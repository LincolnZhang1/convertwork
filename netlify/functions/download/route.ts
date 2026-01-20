import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIP } from '@/lib/rateLimit'
import { downloadYouTubeMedia, cleanupTempFile } from '@/lib/youtubeDownloader'
import { uploadToR2, getR2Url } from '@/lib/r2Storage'
import { randomUUID } from 'crypto'

export const runtime = 'nodejs'
export const maxDuration = 900 // 15 minutes for video downloads

export async function POST(request: NextRequest) {
  console.log('=== API DOWNLOAD REQUEST START ===')

  let tempFilePath: string | null = null

  try {
    // 检查限流
    const clientIP = getClientIP(request)
    const rateLimitCheck = checkRateLimit(clientIP)

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { error: rateLimitCheck.message },
        { status: 429 }
      )
    }

    // 解析表单数据
    const formData = await request.formData()
    const videoUrl = formData.get('videoUrl') as string
    const targetFormat = formData.get('targetFormat') as string
    const conversionType = formData.get('conversionType') as string

    console.log('FormData received:')
    console.log('- videoUrl:', videoUrl)
    console.log('- targetFormat:', targetFormat)
    console.log('- conversionType:', conversionType)

    // 验证输入
    if (!videoUrl) {
      return NextResponse.json(
        { error: '未提供视频URL' },
        { status: 400 }
      )
    }

    if (!targetFormat) {
      return NextResponse.json(
        { error: '未选择目标格式' },
        { status: 400 }
      )
    }

    // 检查是否是YouTube URL
    if (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
      return NextResponse.json(
        { error: '目前仅支持YouTube视频下载' },
        { status: 400 }
      )
    }

    console.log('Starting YouTube download with ytdl-core...')

    // 确定下载选项
    const downloadOptions = {
      url: videoUrl,
      format: (conversionType === 'audio' ? 'audio' : 'video') as 'video' | 'audio',
      quality: (conversionType === 'audio' ? 'highestaudio' : 'highest') as 'highest' | 'lowest' | 'highestaudio' | 'lowestaudio',
      targetFormat: targetFormat
    }

    // 下载媒体文件
    const downloadResult = await downloadYouTubeMedia(downloadOptions)

    if (!downloadResult.success || !downloadResult.filePath) {
      return NextResponse.json(
        {
          error: '下载失败',
          details: downloadResult.error || '未知错误'
        },
        { status: 500 }
      )
    }

    tempFilePath = downloadResult.filePath

    console.log('Download completed:', {
      filePath: tempFilePath,
      fileSize: downloadResult.fileSize,
      title: downloadResult.title
    })

    // 生成唯一的文件名
    const fileExtension = targetFormat === 'm4a' ? 'm4a' : targetFormat
    const uniqueId = randomUUID()
    const fileName = `${downloadResult.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'youtube_video'}_${uniqueId}.${fileExtension}`

    // 上传到R2存储
    console.log('Uploading to R2 storage...')
    const uploadResult = await uploadToR2(tempFilePath, fileName)

    if (!uploadResult.success) {
      return NextResponse.json(
        {
          error: '文件上传失败',
          details: uploadResult.error || '未知错误'
        },
        { status: 500 }
      )
    }

    // 获取下载URL
    const downloadUrl = getR2Url(fileName)

    console.log('Upload completed, returning download URL')

    return NextResponse.json({
      success: true,
      downloadUrl,
      fileName,
      fileSize: downloadResult.fileSize,
      title: downloadResult.title,
      duration: downloadResult.duration,
      thumbnail: downloadResult.thumbnail,
      format: conversionType === 'audio' ? 'audio' : targetFormat
    })

  } catch (error: unknown) {
    console.error('Download API error:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  } finally {
    // 清理临时文件
    if (tempFilePath) {
      try {
        await cleanupTempFile(tempFilePath)
      } catch (cleanupError) {
        console.warn('Failed to cleanup temp file:', cleanupError)
      }
    }
  }
}