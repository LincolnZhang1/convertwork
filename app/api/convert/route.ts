import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIP } from '@/lib/rateLimit'
import { validateFileSize, getTempFilePath } from '@/lib/fileConverter'
import { uploadBufferToR2 } from '@/lib/r2Storage'
import { writeFile, readFile, unlink } from 'fs/promises'
import sharp from 'sharp'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const clientIP = getClientIP(request)
    const rateLimitCheck = checkRateLimit(clientIP)
    
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { error: rateLimitCheck.message || 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const files = formData.getAll('files') as File[]
    const videoUrl = formData.get('videoUrl') as string
    const webpageUrl = formData.get('webpageUrl') as string
    const conversionType = formData.get('conversionType') as string
    const operation = formData.get('operation') as string
    const targetFormat = formData.get('targetFormat') as string

    console.log('Conversion request:', {
      conversionType,
      operation,
      targetFormat,
      hasFile: !!file,
      filesCount: files.length,
      hasVideoUrl: !!videoUrl,
      hasWebpageUrl: !!webpageUrl
    })

    // Handle video download
    if (operation === 'download' && videoUrl) {
      const downloadResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin}/api/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl, targetFormat })
      })

      if (!downloadResponse.ok) {
        const errorData = await downloadResponse.json()
        return NextResponse.json({ error: errorData.error || 'Download failed' }, { status: downloadResponse.status })
      }

      const downloadData = await downloadResponse.json()
      return NextResponse.json({
        success: true,
        downloadUrl: downloadData.downloadUrl,
        fileName: downloadData.fileName,
        fileSize: downloadData.fileSize
      })
    }

    // Handle URL to Markdown conversion
    if (operation === 'url-to-markdown' && webpageUrl) {
      console.log('Starting URL-to-Markdown conversion for:', webpageUrl)
      try {
        // Validate URL
        const urlObj = new URL(webpageUrl)
        if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
          return NextResponse.json(
            { error: 'URL must start with http:// or https://' },
            { status: 400 }
          )
        }

        const { convertUrlToMarkdown } = await import('@/lib/fileConverter')
        const outputFileName = `webpage_${Date.now()}.md`
        const outputPath = await getTempFilePath('md')
        
        console.log('Calling convertUrlToMarkdown with outputPath:', outputPath)
        const result = await convertUrlToMarkdown(webpageUrl, outputPath)
        console.log('convertUrlToMarkdown result:', result)

        if (result.success && result.outputPath) {
          const outputBuffer = await readFile(result.outputPath)

          // Upload to R2 for production or return temp URL for local dev
          const isLocalDev = !process.env.VERCEL && !process.env.VERCEL_ENV
          let downloadUrl: string

          if (isLocalDev) {
            downloadUrl = `/api/temp/${outputFileName}`
          } else {
            const r2Result = await uploadBufferToR2(outputBuffer, outputFileName, 'text/markdown')
            if (r2Result.success && r2Result.url) {
              downloadUrl = r2Result.url
            } else {
              return NextResponse.json(
                { error: 'Upload to R2 failed: ' + (r2Result.error || 'Unknown error') },
                { status: 500 }
              )
            }
          }

          // Clean up temp file
          await unlink(result.outputPath).catch(() => {})

          return NextResponse.json({
            success: true,
            downloadUrl,
            fileName: outputFileName,
            fileSize: outputBuffer.length
          })
        } else {
          return NextResponse.json(
            { error: result.error || 'URL to Markdown conversion failed' },
            { status: 500 }
          )
        }
      } catch (urlError) {
        const errorMessage = urlError instanceof Error ? urlError.message : 'Invalid URL'
        return NextResponse.json(
          { error: 'URL to Markdown conversion failed: ' + errorMessage },
          { status: 400 }
        )
      }
    }

    // Handle file uploads
    const filesToProcess = files.length > 0 ? files : (file ? [file] : [])
    
    if (filesToProcess.length === 0) {
      return NextResponse.json(
        { error: 'No file provided for conversion' },
        { status: 400 }
      )
    }

    // Validate file sizes
    for (const f of filesToProcess) {
      const sizeCheck = validateFileSize(f.size)
      if (!sizeCheck.valid) {
        return NextResponse.json({ error: sizeCheck.error }, { status: 400 })
      }
    }

    // Handle image conversions
    if (conversionType === 'image' && operation === 'convert') {
      const inputBuffer = Buffer.from(await filesToProcess[0].arrayBuffer())
      const outputFormat = targetFormat || 'jpg'
      const outputFileName = `converted_${Date.now()}.${outputFormat}`

      try {
        // Convert image format using Sharp
        const format = outputFormat.toLowerCase() as keyof sharp.FormatEnum
        const outputBuffer = await sharp(inputBuffer)
          .toFormat(format)
          .toBuffer()

        // Upload to R2 for production or return temp URL for local dev
        const isLocalDev = !process.env.VERCEL && !process.env.VERCEL_ENV
        let downloadUrl: string

        if (isLocalDev) {
          // Local development: save to temp directory
          const tempPath = await getTempFilePath(outputFormat)
          await writeFile(tempPath, outputBuffer)
          downloadUrl = `/api/temp/${outputFileName}`
        } else {
          // Production: upload to R2
          const r2Result = await uploadBufferToR2(outputBuffer, outputFileName, `image/${outputFormat}`)
          if (r2Result.success && r2Result.url) {
            downloadUrl = r2Result.url
          } else {
            return NextResponse.json(
              { error: 'Upload to R2 failed: ' + (r2Result.error || 'Unknown error') },
              { status: 500 }
            )
          }
        }

        return NextResponse.json({
          success: true,
          downloadUrl,
          fileName: outputFileName,
          fileSize: outputBuffer.length
        })
      } catch (conversionError) {
        const errorMessage = conversionError instanceof Error ? conversionError.message : 'Unknown error'
        return NextResponse.json(
          { error: 'Image conversion failed: ' + errorMessage },
          { status: 500 }
        )
      }
    }

    // Handle PDF merge
    if (operation === 'merge' && files.length >= 2) {
      const mergedFileName = `merged_${Date.now()}.pdf`
      
      try {
        const { mergePDFs, getTempFilePath } = await import('@/lib/fileConverter')
        
        const inputPaths: string[] = []
        for (const file of files) {
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)
          const ext = file.name.split('.').pop() || 'pdf'
          const inputPath = await getTempFilePath(ext)
          await writeFile(inputPath, buffer)
          inputPaths.push(inputPath)
        }

        const outputPath = await getTempFilePath('pdf')
        const result = await mergePDFs(inputPaths, outputPath)
        
        if (result.success && result.outputPath) {
          const outputBuffer = await readFile(result.outputPath)
          
          // For local development, use temp file approach
          const isLocalDev = !process.env.VERCEL && !process.env.VERCEL_ENV
          let downloadUrl: string
          
          if (isLocalDev) {
            // Use temp file for local development
            const tempPath = await getTempFilePath('pdf')
            await writeFile(tempPath, outputBuffer)
            downloadUrl = `/temp/${mergedFileName}`
            console.log('Using temp file for PDF merge:', downloadUrl)
          } else {
            // Use R2 for production
            const r2Result = await uploadBufferToR2(outputBuffer, mergedFileName, 'application/pdf')
            if (r2Result.success && r2Result.url) {
              downloadUrl = r2Result.url
            } else {
              return NextResponse.json(
                { error: 'Upload to R2 failed: ' + (r2Result.error || 'Unknown error') },
                { status: 500 }
              )
            }
          }
          
          // Clean up temp files
          for (const inputPath of inputPaths) {
            await unlink(inputPath).catch(() => {})
          }
          await unlink(result.outputPath).catch(() => {})
          
          return NextResponse.json({
            success: true,
            downloadUrl,
            fileName: mergedFileName,
            fileSize: outputBuffer.length
          })
        } else {
          return NextResponse.json(
            { error: result.error || 'PDF merge failed' },
            { status: 500 }
          )
        }
      } catch (mergeError) {
        const errorMessage = mergeError instanceof Error ? mergeError.message : 'Unknown error'
        return NextResponse.json(
          { error: 'PDF merge failed: ' + errorMessage },
          { status: 500 }
        )
      }
    }

    // Handle image compression
    if (operation === 'compress' && conversionType === 'image') {
      const compressedFileName = `compressed_${Date.now()}.jpg`

      try {
        const inputBuffer = Buffer.from(await filesToProcess[0].arrayBuffer())

        // Compress image using Sharp (80% quality)
        const compressedBuffer = await sharp(inputBuffer)
          .jpeg({ quality: 80, mozjpeg: true })
          .toBuffer()

        // Upload to R2 for production or return temp URL for local dev
        const isLocalDev = !process.env.VERCEL && !process.env.VERCEL_ENV
        let downloadUrl: string

        if (isLocalDev) {
          const tempPath = await getTempFilePath('jpg')
          await writeFile(tempPath, compressedBuffer)
          downloadUrl = `/api/temp/${compressedFileName}`
        } else {
          const r2Result = await uploadBufferToR2(compressedBuffer, compressedFileName, 'image/jpeg')
          if (r2Result.success && r2Result.url) {
            downloadUrl = r2Result.url
          } else {
            return NextResponse.json(
              { error: 'Upload to R2 failed: ' + (r2Result.error || 'Unknown error') },
              { status: 500 }
            )
          }
        }

        return NextResponse.json({
          success: true,
          downloadUrl,
          fileName: compressedFileName,
          fileSize: compressedBuffer.length
        })
      } catch (compressError) {
        const errorMessage = compressError instanceof Error ? compressError.message : 'Unknown error'
        return NextResponse.json(
          { error: 'Image compression failed: ' + errorMessage },
          { status: 500 }
        )
      }
    }

    // Handle document conversions
    if (conversionType === 'document' && operation === 'convert' && targetFormat) {
      const inputBuffer = Buffer.from(await filesToProcess[0].arrayBuffer())
      const outputFileName = `converted_${Date.now()}.${targetFormat}`

      try {
        // Use the full document conversion function that handles both local and CloudConvert
        const { convertDocument } = await import('@/lib/fileConverter')
        
        // Create temp files for conversion
        const inputPath = `/tmp/${filesToProcess[0].name}`
        const outputPath = `/tmp/${outputFileName}`
        
        await writeFile(inputPath, inputBuffer)
        
        const result = await convertDocument(inputPath, outputPath, targetFormat)
        
        if (result.success && result.outputPath) {
          const outputBuffer = await readFile(result.outputPath)
          
          // For local development, use temp file approach to avoid R2 credential issues
          const isLocalDev = !process.env.VERCEL && !process.env.VERCEL_ENV
          let downloadUrl: string
          
          if (isLocalDev) {
            // Use temp file for local development
            const tempFileName = outputFileName
            const tempPath = await getTempFilePath(targetFormat)
            await writeFile(tempPath, outputBuffer)
            downloadUrl = `/temp/${tempFileName}`
            console.log('Using temp file for local development:', downloadUrl)
          } else {
            // Use R2 for production
            const r2Result = await uploadBufferToR2(outputBuffer, outputFileName, getContentType(targetFormat))
            if (r2Result.success && r2Result.url) {
              downloadUrl = r2Result.url
            } else {
              return NextResponse.json(
                { error: 'Upload to R2 failed: ' + (r2Result.error || 'Unknown error') },
                { status: 500 }
              )
            }
          }
          
          // Clean up temp files
          await unlink(inputPath).catch(() => {})
          await unlink(result.outputPath).catch(() => {})
          
          return NextResponse.json({
            success: true,
            downloadUrl,
            fileName: outputFileName,
            fileSize: outputBuffer.length
          })
        } else {
          // If CloudConvert fails, try to provide a more helpful error message
          const errorMsg = result.error || 'Document conversion failed'
          let userFriendlyError = 'Document conversion is currently unavailable. Please try again later.'

          if (errorMsg.includes('API key') || errorMsg.includes('forbidden') || errorMsg.includes('unauthorized')) {
            userFriendlyError = 'Conversion service is temporarily unavailable. Please try a different format or try again later.'
          } else if (errorMsg.includes('unsupported') || errorMsg.includes('format')) {
            userFriendlyError = 'This file format combination is not supported. Please try a different format.'
          }

          return NextResponse.json(
            { error: userFriendlyError },
            { status: 500 }
          )
        }
      } catch (conversionError) {
        const errorMessage = conversionError instanceof Error ? conversionError.message : 'Unknown error'
        return NextResponse.json(
          { error: 'Document conversion failed: ' + errorMessage },
          { status: 500 }
        )
      }
    }

    // Handle audio/video conversions using FFmpeg.wasm (free, client-side)
    if ((conversionType === 'video' || conversionType === 'audio') && operation === 'convert') {
      if (!file) {
        return NextResponse.json(
          { error: 'No file selected' },
          { status: 400 }
        )
      }

      if (!targetFormat) {
        return NextResponse.json(
          { error: 'No target format selected' },
          { status: 400 }
        )
      }

      const inputBuffer = Buffer.from(await file.arrayBuffer())
      const originalExt = file.name.split('.').pop()?.toLowerCase() || 'mp4'
      const tempFileName = `${Date.now()}_${file.name}`
      
      // Upload original file to temp storage for client-side processing
      await writeFile(`/tmp/${tempFileName}`, inputBuffer)
      
      return NextResponse.json({
        success: true,
        clientSideConversion: true,
        tempFileUrl: `/temp/${tempFileName}`,
        originalFile: {
          name: file.name,
          size: inputBuffer.length,
          type: file.type,
          extension: originalExt
        },
        targetFormat: targetFormat,
        conversionType: conversionType,
        message: 'File uploaded successfully. FFmpeg.wasm will handle conversion in your browser for free.',
        ffmpegOptions: getFFmpegOptions(conversionType, originalExt, targetFormat)
      })
    }

    // Other operations are not available
    return NextResponse.json(
      { error: `${operation} operation is temporarily unavailable. Please try image conversion, document conversion, audio/video conversion, or compression.` },
      { status: 503 }
    )

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    console.error('Convert API error:', error)
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

// Helper function to get FFmpeg conversion options
interface FFmpegOptions {
  codec?: string
  bitrate?: string
  container?: string
  preset?: string
  crf?: number
  audioCodec?: string
}

function getFFmpegOptions(conversionType: string, inputFormat: string, outputFormat: string): FFmpegOptions {
  const options: FFmpegOptions = {}

  if (conversionType === 'audio') {
    // Audio conversion options
    switch (outputFormat.toLowerCase()) {
      case 'mp3':
        options.codec = 'libmp3lame'
        options.bitrate = '192k'
        break
      case 'aac':
        options.codec = 'aac'
        options.bitrate = '128k'
        break
      case 'wav':
        options.codec = 'pcm_s16le'
        break
      case 'flac':
        options.codec = 'flac'
        break
      case 'ogg':
        options.codec = 'libvorbis'
        break
      case 'm4a':
        options.codec = 'aac'
        options.container = 'mp4'
        break
    }
  } else if (conversionType === 'video') {
    // Video conversion options
    switch (outputFormat.toLowerCase()) {
      case 'mp4':
        options.codec = 'libx264'
        options.preset = 'medium'
        options.crf = 23
        options.audioCodec = 'aac'
        break
      case 'webm':
        options.codec = 'libvpx-vp9'
        options.audioCodec = 'libvorbis'
        break
      case 'avi':
        options.codec = 'libx264'
        options.container = 'avi'
        break
      case 'mkv':
        options.codec = 'libx264'
        options.container = 'matroska'
        break
      case 'mov':
        options.codec = 'libx264'
        options.container = 'mov'
        break
    }
  }

  return options
}

// Helper function to get content type
function getContentType(ext: string): string {
  const contentTypes: Record<string, string> = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'txt': 'text/plain',
    'html': 'text/html',
    'rtf': 'application/rtf',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'mp4': 'video/mp4',
    'avi': 'video/x-msvideo',
    'mov': 'video/quicktime',
    'mkv': 'video/x-matroska',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'flac': 'audio/flac',
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
  }
  return contentTypes[ext] || 'application/octet-stream'
}