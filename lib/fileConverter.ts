import sharp from 'sharp'
import { PDFDocument } from 'pdf-lib'
import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import archiver from 'archiver'
import yauzl from 'yauzl'

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE_MB || '100') * 1024 * 1024

export interface ConversionResult {
  success: boolean
  outputPath?: string
  error?: string
}

// 图片转换
export async function convertImage(
  inputPath: string,
  outputPath: string,
  targetFormat: string
): Promise<ConversionResult> {
  try {
    const format = targetFormat.toLowerCase() as keyof sharp.FormatEnum

    await sharp(inputPath)
      .toFormat(format)
      .toFile(outputPath)

    return {
      success: true,
      outputPath,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '图片转换失败',
    }
  }
}

// 图片压缩
export async function compressImage(
  inputPath: string,
  outputPath: string,
  quality: number = 80
): Promise<ConversionResult> {
  try {
    const image = sharp(inputPath)
    const metadata = await image.metadata()

    if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
      await image
        .jpeg({ quality })
        .toFile(outputPath)
    } else if (metadata.format === 'png') {
      await image
        .png({ quality: Math.round(quality / 10) }) // PNG quality is 0-9
        .toFile(outputPath)
    } else if (metadata.format === 'webp') {
      await image
        .webp({ quality })
        .toFile(outputPath)
    } else {
      // For other formats, just copy
      await fs.copyFile(inputPath, outputPath)
    }

    return {
      success: true,
      outputPath,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '图片压缩失败',
    }
  }
}

// PDF 处理
export async function mergePDFs(
  inputPaths: string[],
  outputPath: string
): Promise<ConversionResult> {
  try {
    const mergedPdf = await PDFDocument.create()

    for (const inputPath of inputPaths) {
      const pdfBytes = await fs.readFile(inputPath)
      const pdf = await PDFDocument.load(pdfBytes)
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      pages.forEach((page) => mergedPdf.addPage(page))
    }

    const pdfBytes = await mergedPdf.save()
    await fs.writeFile(outputPath, pdfBytes)

    return {
      success: true,
      outputPath,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'PDF 合并失败',
    }
  }
}

// 文档转换 - 使用 CloudConvert
export async function convertDocument(
  inputPath: string,
  outputPath: string,
  targetFormat: string
): Promise<ConversionResult> {
  // 使用 CloudConvert 转换器进行所有文档转换
  const { convertDocumentWithCloudConvert } = await import('./cloudConvertConverter')
  const result = await convertDocumentWithCloudConvert(inputPath, outputPath, targetFormat)
  return {
    success: result.success,
    outputPath: result.success ? outputPath : undefined,
    error: result.error,
  }
}

// 音视频转换 - 已移除，需要时请安装 fluent-ffmpeg 和 ffmpeg-static
export async function convertAudioVideo(
  inputPath: string,
  outputPath: string,
  targetFormat: string
): Promise<ConversionResult> {
  return {
    success: false,
    error: '音视频转换功能已禁用。如需使用，请安装 fluent-ffmpeg 和 ffmpeg-static 包。',
  }
}

// 生成临时文件路径
export async function getTempFilePath(extension: string): Promise<string> {
  const fileName = `${uuidv4()}.${extension}`

  // 始终使用 /tmp 目录，因为在 serverless 环境中只有 /tmp 是可写的
  const tempDir = '/tmp'

  // 确保目录存在
  const fs = await import('fs')
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }

  return path.join(tempDir, fileName)
}

// 验证文件大小
export function validateFileSize(fileSize: number): { valid: boolean; error?: string } {
  if (fileSize <= MAX_FILE_SIZE) {
    return { valid: true }
  } else {
    return {
      valid: false,
      error: `文件大小超过限制。最大允许大小: ${formatFileSize(MAX_FILE_SIZE)}`
    }
  }
}

// 获取文件大小的可读格式
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 批量转换
export async function convertMultipleFiles(
  inputPaths: string[],
  outputPaths: string[],
  targetFormat: string,
  conversionType: string
): Promise<ConversionResult[]> {
  const results: ConversionResult[] = []

  for (let i = 0; i < inputPaths.length; i++) {
    let result: ConversionResult

    switch (conversionType) {
      case 'image':
        result = await convertImage(inputPaths[i], outputPaths[i], targetFormat)
        break
      case 'document':
        result = await convertDocument(inputPaths[i], outputPaths[i], targetFormat)
        break
      case 'audio':
      case 'video':
        result = await convertAudioVideo(inputPaths[i], outputPaths[i], targetFormat)
        break
      default:
        result = {
          success: false,
          error: `不支持的转换类型: ${conversionType}`,
        }
    }

    results.push(result)
  }

  return results
}

// 创建ZIP压缩包
export async function createZipArchive(
  files: { path: string; name: string }[],
  outputPath: string
): Promise<ConversionResult> {
  return new Promise((resolve) => {
    const output = fsSync.createWriteStream(outputPath)
    const archive = archiver('zip', {
      zlib: { level: 9 } // 最高压缩级别
    })

    output.on('close', () => {
      resolve({
        success: true,
        outputPath,
      })
    })

    archive.on('error', (error) => {
      resolve({
        success: false,
        error: error.message,
      })
    })

    archive.pipe(output)

    // 添加文件到压缩包
    files.forEach(file => {
      archive.file(file.path, { name: file.name })
    })

    archive.finalize()
  })
}

// 解压ZIP文件
export async function extractZipArchive(
  inputPath: string,
  outputDir: string
): Promise<ConversionResult> {
  return new Promise((resolve) => {
    yauzl.open(inputPath, { lazyEntries: true }, (error, zipfile) => {
      if (error) {
        resolve({
          success: false,
          error: error.message,
        })
        return
      }

      zipfile.readEntry()
      zipfile.on('entry', (entry) => {
        if (/\/$/.test(entry.fileName)) {
          // 目录
          zipfile.readEntry()
        } else {
          // 文件
          const filePath = path.join(outputDir, entry.fileName)
          const dirPath = path.dirname(filePath)

          // 确保目录存在
          if (!fsSync.existsSync(dirPath)) {
            fsSync.mkdirSync(dirPath, { recursive: true })
          }

          zipfile.openReadStream(entry, (error, readStream) => {
            if (error) {
              resolve({
                success: false,
                error: error.message,
              })
              return
            }

            const writeStream = fsSync.createWriteStream(filePath)
            readStream.pipe(writeStream)
            writeStream.on('close', () => {
              zipfile.readEntry()
            })
          })
        }
      })

      zipfile.on('end', () => {
        resolve({
          success: true,
        })
      })
    })
  })
}

// URL转Markdown
export async function convertUrlToMarkdown(
  url: string,
  outputPath: string
): Promise<ConversionResult> {
  try {
    const { JSDOM } = await import('jsdom')
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AnyConvert/1.0)',
      },
    })

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch URL: ${response.status}`,
      }
    }

    const html = await response.text()
    const dom = new JSDOM(html)
    const document = dom.window.document

    // 提取标题
    const title = document.querySelector('title')?.textContent?.trim() || 'Untitled'

    // 提取主要内容
    const contentSelectors = ['article', 'main', '.content', '.post', '.entry', 'body']
    let content = ''

    for (const selector of contentSelectors) {
      const element = document.querySelector(selector)
      if (element && element.textContent?.trim()) {
        content = element.textContent.trim()
        break
      }
    }

    if (!content) {
      content = document.body?.textContent?.trim() || ''
    }

    // 生成Markdown
    const markdown = `# ${title}\n\n${url}\n\n${content}`

    await fs.writeFile(outputPath, markdown, 'utf8')

    return {
      success: true,
      outputPath,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'URL转Markdown失败',
    }
  }
}

