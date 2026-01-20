import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Cloudflare R2 配置
const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true, // 重要：R2需要这个设置
})

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

/**
 * 上传文件到 Cloudflare R2
 */
export async function uploadToR2(
  filePath: string,
  fileName: string,
  contentType?: string
): Promise<UploadResult> {
  try {
    const fs = await import('fs')
    const fileBuffer = await fs.promises.readFile(filePath)

    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET,
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
      // 设置文件过期时间
      Expires: new Date(Date.now() + (parseInt(process.env.FILE_EXPIRE_HOURS || '24') * 60 * 60 * 1000)),
    })

    await s3Client.send(command)

    // 生成带签名的下载URL - 使用 GetObjectCommand 而不是 PutObjectCommand
    const getCommand = new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET,
      Key: fileName,
    })
    const signedUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 }) // 1小时有效期

    return {
      success: true,
      url: signedUrl,
    }
  } catch (error) {
    console.error('R2 upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '上传失败',
    }
  }
}

/**
 * 获取 R2 文件的下载 URL
 */
export async function getR2Url(fileName: string): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET,
      Key: fileName,
    })
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }) // 1小时有效期
    return signedUrl
  } catch (error) {
    console.error('R2 get URL error:', error)
    throw new Error('Failed to generate download URL')
  }
}

/**
 * 从 R2 下载文件
 */
export async function downloadFromR2(fileName: string): Promise<Buffer | null> {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET,
      Key: fileName,
    })

    const response = await s3Client.send(command)
    if (response.Body) {
      const reader = response.Body.transformToByteArray()
      const buffer = await reader
      return Buffer.from(buffer)
    }
    return null
  } catch (error) {
    console.error('R2 download error:', error)
    return null
  }
}

/**
 * 生成文件在 R2 中的唯一名称
 */
export function generateFileName(originalName: string, prefix: string = ''): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const ext = originalName.split('.').pop() || ''
  const baseName = originalName.replace(/\.[^/.]+$/, '')

  return `${prefix}${baseName}_${timestamp}_${random}.${ext}`
}

/**
 * 直接上传Buffer到R2
 */
export async function uploadBufferToR2(
  buffer: Buffer,
  fileName: string,
  contentType?: string
): Promise<UploadResult> {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET,
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
      // 设置文件过期时间
      Expires: new Date(Date.now() + (parseInt(process.env.FILE_EXPIRE_HOURS || '24') * 60 * 60 * 1000)),
    })

    await s3Client.send(command)

    // 生成带签名的下载URL - 使用 GetObjectCommand 而不是 PutObjectCommand
    const getCommand = new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET,
      Key: fileName,
    })
    const signedUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 }) // 1小时有效期

    return {
      success: true,
      url: signedUrl,
    }
  } catch (error) {
    console.error('R2 buffer upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '上传失败',
    }
  }
}