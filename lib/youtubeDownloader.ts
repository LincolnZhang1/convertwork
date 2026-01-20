import ytdl from 'ytdl-core'
import ffmpeg from 'fluent-ffmpeg'
import { writeFile, unlink } from 'fs/promises'
import { getTempFilePath } from './fileConverter'
import path from 'path'

// Configure ffmpeg to use system ffmpeg
ffmpeg.setFfmpegPath('/usr/local/bin/ffmpeg')
ffmpeg.setFfprobePath('/usr/local/bin/ffprobe')

export interface DownloadOptions {
  url: string
  format: 'video' | 'audio'
  quality: 'highest' | 'lowest' | 'highestaudio' | 'lowestaudio'
  targetFormat?: string
}

export interface DownloadResult {
  success: boolean
  filePath?: string
  fileSize?: number
  title?: string
  duration?: number
  thumbnail?: string
  error?: string
}

export interface VideoInfo {
  title: string
  duration: number
  thumbnail: string
  formats: ytdl.videoFormat[]
}

/**
 * Get video information without downloading
 */
export async function getVideoInfo(url: string): Promise<VideoInfo> {
  try {
    const info = await ytdl.getInfo(url)
    return {
      title: info.videoDetails.title,
      duration: parseInt(info.videoDetails.lengthSeconds),
      thumbnail: info.videoDetails.thumbnails[0]?.url || '',
      formats: info.formats
    }
  } catch (error) {
    throw new Error(`Failed to get video info: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Download YouTube video/audio using ytdl-core and ffmpeg
 */
export async function downloadYouTubeMedia(options: DownloadOptions): Promise<DownloadResult> {
  const { url, format, quality, targetFormat } = options

  try {
    console.log(`Starting YouTube download: ${url}, format: ${format}, quality: ${quality}`)

    // Get video info first
    const info = await getVideoInfo(url)
    console.log(`Video info retrieved: ${info.title}`)

    // Determine output format
    const outputFormat = targetFormat || (format === 'audio' ? 'm4a' : 'mp4')
    const outputPath = await getTempFilePath(outputFormat)

    console.log(`Output path: ${outputPath}, format: ${outputFormat}`)

    if (format === 'audio') {
      // Audio download and conversion
      return new Promise((resolve, reject) => {
        const stream = ytdl(url, {
          quality: quality === 'highestaudio' ? 'highestaudio' : 'lowestaudio',
          filter: 'audioonly'
        })

        ffmpeg(stream)
          .audioCodec('aac')
          .audioBitrate(128)
          .format(outputFormat)
          .on('end', async () => {
            try {
              // Get file size
              const stats = await import('fs').then(fs => fs.promises.stat(outputPath))
              resolve({
                success: true,
                filePath: outputPath,
                fileSize: stats.size,
                title: info.title,
                duration: info.duration,
                thumbnail: info.thumbnail
              })
            } catch (error) {
              resolve({
                success: false,
                error: `Failed to get file info: ${error instanceof Error ? error.message : 'Unknown error'}`
              })
            }
          })
          .on('error', (err) => {
            console.error('FFmpeg audio conversion error:', err)
            resolve({
              success: false,
              error: `Audio conversion failed: ${err.message}`
            })
          })
          .save(outputPath)
      })
    } else {
      // Video download
      return new Promise((resolve, reject) => {
        const stream = ytdl(url, {
          quality: quality === 'highest' ? 'highest' : 'lowest',
          filter: format === 'video' ? 'videoandaudio' : 'audioonly'
        })

        if (outputFormat === 'mp4') {
          // Direct MP4 output
          ffmpeg(stream)
            .videoCodec('libx264')
            .audioCodec('aac')
            .format('mp4')
            .on('end', async () => {
              try {
                const stats = await import('fs').then(fs => fs.promises.stat(outputPath))
                resolve({
                  success: true,
                  filePath: outputPath,
                  fileSize: stats.size,
                  title: info.title,
                  duration: info.duration,
                  thumbnail: info.thumbnail
                })
              } catch (error) {
                resolve({
                  success: false,
                  error: `Failed to get file info: ${error instanceof Error ? error.message : 'Unknown error'}`
                })
              }
            })
            .on('error', (err) => {
              console.error('FFmpeg video conversion error:', err)
              resolve({
                success: false,
                error: `Video conversion failed: ${err.message}`
              })
            })
            .save(outputPath)
        } else {
          // For other formats, save as is
          const writeStream = require('fs').createWriteStream(outputPath)
          stream.pipe(writeStream)

          writeStream.on('finish', async () => {
            try {
              const stats = await import('fs').then(fs => fs.promises.stat(outputPath))
              resolve({
                success: true,
                filePath: outputPath,
                fileSize: stats.size,
                title: info.title,
                duration: info.duration,
                thumbnail: info.thumbnail
              })
            } catch (error) {
              resolve({
                success: false,
                error: `Failed to get file info: ${error instanceof Error ? error.message : 'Unknown error'}`
              })
            }
          })

          writeStream.on('error', (err: Error) => {
            console.error('Stream write error:', err)
            resolve({
              success: false,
              error: `Download failed: ${err.message}`
            })
          })
        }
      })
    }

  } catch (error) {
    console.error('YouTube download error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown download error'
    }
  }
}

/**
 * Clean up temporary files
 */
export async function cleanupTempFile(filePath: string): Promise<void> {
  try {
    await unlink(filePath)
    console.log(`Cleaned up temp file: ${filePath}`)
  } catch (error) {
    console.warn(`Failed to cleanup temp file ${filePath}:`, error)
  }
}