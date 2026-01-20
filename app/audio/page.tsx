'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Navigation from '@/components/Navigation'
import FileUploader from '@/components/FileUploader'
import UrlInput from '@/components/UrlInput'
import FormatSelector from '@/components/FormatSelector'
import ConversionProgress from '@/components/ConversionProgress'
import Link from 'next/link'

interface ConversionType {
  id: string
  name: string
  description: string
  icon: string
  formats: string[]
}

export default function AudioPage() {
  const [selectedType, setSelectedType] = useState<ConversionType | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [targetFormat, setTargetFormat] = useState<string>('')
  const [conversionStatus, setConversionStatus] = useState<'idle' | 'uploading' | 'converting' | 'completed' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [resultFileName, setResultFileName] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const handleConvertRef = useRef<() => Promise<void>>()

  // Client-side FFmpeg.wasm conversion function
  const performClientSideConversion = useCallback(async (data: { 
    tempFileUrl?: string; 
    downloadUrl?: string;
    ffmpegOptions?: { codec?: string; audioCodec?: string; preset?: string; crf?: string; bitrate?: string };
    conversionType?: string;
    targetFormat?: string
  }) => {
    try {
      // Load FFmpeg.wasm dynamically
      const { FFmpeg } = await import('@ffmpeg/ffmpeg')
      
      const ffmpeg = new FFmpeg()
      
      // Load the original file
      const fileUrl = data.tempFileUrl || data.downloadUrl
      if (!fileUrl) {
        throw new Error('No file URL provided')
      }
      
      const tempFileUrl = fileUrl.startsWith('/temp/')
        ? `${window.location.origin}/api/temp/${fileUrl.replace('/temp/', '')}`
        : fileUrl
        
      const response = await fetch(tempFileUrl)
      const fileBlob = await response.blob()
      const fileArrayBuffer = await fileBlob.arrayBuffer()
      const fileUint8Array = new Uint8Array(fileArrayBuffer)
      const fileName = tempFileUrl.split('/').pop() || 'input_file'
      
      // Write file to FFmpeg virtual file system
      await ffmpeg.load()
      await ffmpeg.writeFile(fileName, fileUint8Array)
      
      // Build FFmpeg command based on options
      let command = ['-i', fileName]
      
      if (data.ffmpegOptions?.codec) {
        if (data.conversionType === 'video') {
          command.push('-c:v', data.ffmpegOptions.codec)
          if (data.ffmpegOptions.audioCodec) {
            command.push('-c:a', data.ffmpegOptions.audioCodec)
          }
          if (data.ffmpegOptions.preset) {
            command.push('-preset', data.ffmpegOptions.preset)
          }
          if (data.ffmpegOptions.crf) {
            command.push('-crf', data.ffmpegOptions.crf.toString())
          }
        } else {
          command.push('-c:a', data.ffmpegOptions.codec)
          if (data.ffmpegOptions.bitrate) {
            command.push('-b:a', data.ffmpegOptions.bitrate)
          }
        }
      }
      
      command.push('output.' + data.targetFormat)
      
      // Run FFmpeg conversion
      await ffmpeg.exec(command)
      
      // Get the converted file
      const outputData = await ffmpeg.readFile('output.' + data.targetFormat!)
      
      // Create download URL
      const outputBlob = new Blob([outputData as any], {
        type: data.conversionType === 'video' 
          ? `video/${data.targetFormat}` 
          : `audio/${data.targetFormat}`
      })
      
      const downloadUrl = URL.createObjectURL(outputBlob)
      setResultUrl(downloadUrl)
      setResultFileName(`converted_${Date.now()}.${data.targetFormat}`)
      setConversionStatus('completed')
      setProgress(100)
      
    } catch (error: unknown) {
      console.error('Client-side conversion error:', error)
      setError(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setConversionStatus('error')
    }
  }, [setResultUrl, setResultFileName, setConversionStatus, setProgress, setError])

  const handleTypeSelect = useCallback((type: ConversionType) => {
    setSelectedType(type)
    setSelectedFile(null)
    setVideoUrl('')
    setTargetFormat('')
    setConversionStatus('idle')
    setResultUrl(null)
    setResultFileName('')
    setError(null)
  }, [])

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file)
    setTargetFormat('')
    setConversionStatus('idle')
    setResultUrl(null)
    setResultFileName('')
    setError(null)
  }, [])

  const handleUrlSubmit = useCallback((url: string, format: string) => {
    setVideoUrl(url)
    setTargetFormat(format)
  }, [])

  const handleFormatSelect = useCallback((format: string) => {
    setTargetFormat(format)
  }, [])

  const handleConvert = useCallback(async () => {
    const hasFile = selectedFile
    const hasUrl = videoUrl.trim()

    if (!hasFile && !hasUrl) {
      setError('Please select a file or enter a URL')
      return
    }

      if (selectedType?.id.includes('download') && !hasUrl) {
        setError('Please enter an audio URL to download')
        return
      }

      if (!selectedType?.id.includes('download') && !hasFile) {
        setError('Please select an audio file')
        return
      }

      // Fix: Don't require format selection for YouTube downloads
      if (!selectedType?.id.includes('download') && !targetFormat) {
        setError('Please select target format')
        return
      }

    if (!targetFormat) {
      setError('Please select target format')
      return
    }

    setConversionStatus('uploading')
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('conversionType', 'audio')
      formData.append('operation', selectedType?.id.includes('download') ? 'download' : 'convert')
      formData.append('targetFormat', targetFormat)

      if (selectedType?.id.includes('download')) {
        formData.append('videoUrl', videoUrl.trim())
      } else {
        formData.append('file', selectedFile!)
      }

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100)
            setProgress(percentComplete)
          }
        })

        xhr.addEventListener('load', async () => {
          try {
            if (xhr.status === 200) {
              const data = JSON.parse(xhr.responseText)

              if (data.taskId) {
                setConversionStatus('converting')
                await pollConversionStatus(data.taskId)
                resolve()
              } else if (data.clientSideConversion) {
                // Handle client-side FFmpeg.wasm conversion
                setConversionStatus('converting')
                await performClientSideConversion(data)
                resolve()
              } else if (data.downloadUrl) {
                const downloadUrl = data.downloadUrl.startsWith('/temp/')
                  ? `${window.location.origin}/api/temp/${data.downloadUrl.replace('/temp/', '')}`
                  : data.downloadUrl
                setResultUrl(downloadUrl)
                setResultFileName(data.fileName || 'converted_audio')
                setConversionStatus('completed')
                setProgress(100)
                resolve()
              } else {
                reject(new Error('Invalid response'))
              }
            } else {
              const errorData = JSON.parse(xhr.responseText)
              reject(new Error(errorData.error || 'Conversion failed'))
            }
          } catch {
            reject(new Error('Failed to parse response'))
          }
        })

        xhr.addEventListener('error', () => {
          reject(new Error('Network request failed'))
        })

        const endpoint = selectedType?.id.includes('download') ? '/api/download' : '/api/convert'
        xhr.open('POST', endpoint)
        xhr.send(formData)
      })
    } catch {
      setError('Conversion failed')
      setConversionStatus('error')
    }
  }, [selectedFile, videoUrl, targetFormat, selectedType])

  handleConvertRef.current = handleConvert

  useEffect(() => {
    if (videoUrl && targetFormat && selectedType?.id.includes('download') && conversionStatus === 'idle') {
      handleConvert()
    }
  }, [videoUrl, targetFormat, selectedType, conversionStatus, handleConvert])

  const pollConversionStatus = async (taskId: string) => {
    const maxAttempts = 60
    let attempts = 0

    const poll = async () => {
      try {
        const response = await fetch(`/api/convert/status/${taskId}`)
        const data = await response.json()

        if (data.status === 'completed') {
          setResultUrl(data.downloadUrl)
          setConversionStatus('completed')
          setProgress(100)
        } else if (data.status === 'failed') {
          throw new Error(data.error || 'Conversion failed')
        } else {
          setProgress(data.progress || 0)
          attempts++
          if (attempts < maxAttempts) {
            setTimeout(poll, 2000)
          } else {
            throw new Error('Conversion timeout')
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check status')
        setConversionStatus('error')
      }
    }

    poll()
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', color: 'black' }}>
      <Navigation />

      <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', paddingTop: '120px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Link href="/" style={{ color: '#007bff', textDecoration: 'none' }}>
            ← Back to Home
          </Link>
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: '20px', textAlign: 'center' }}>Audio Tools</h1>

        {!selectedType ? (
          <div>
            <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Choose an audio tool</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div
                onClick={() => handleTypeSelect({
                  id: 'audio',
                  name: 'Audio Conversion',
                  description: 'Convert between MP3, WAV, FLAC, AAC, OGG, M4A formats',
                  icon: 'fa-music',
                  formats: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a']
                })}
                style={{
                  padding: '20px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <i className="fas fa-music" style={{ fontSize: '2rem', color: '#007bff', marginBottom: '10px' }}></i>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Audio Conversion</div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>MP3, WAV, FLAC, AAC, OGG, M4A</div>
              </div>

              <div
                onClick={() => handleTypeSelect({
                  id: 'download-audio',
                  name: 'Download Audio',
                  description: 'Download audio from YouTube and other platforms',
                  icon: 'fa-download',
                  formats: ['m4a']
                })}
                style={{
                  padding: '20px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <i className="fas fa-download" style={{ fontSize: '2rem', color: '#007bff', marginBottom: '10px' }}></i>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Download Audio</div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>From YouTube and other platforms</div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#007bff', cursor: 'pointer' }} onClick={() => setSelectedType(null)}>← Back</span>
            </div>
            <div style={{ marginBottom: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
              {selectedType.name}
            </div>

            {selectedType.id.includes('download') ? (
              <UrlInput
                onUrlSubmit={handleUrlSubmit}
                selectedFormat={targetFormat || selectedType.formats[0]}
                supportedFormats={selectedType.formats}
              />
            ) : (
              <FileUploader
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
              />
            )}

            {selectedFile && (
              <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <div><strong>File:</strong> {selectedFile.name}</div>
                <div><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
            )}

            {videoUrl && (
              <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <div><strong>URL:</strong> {videoUrl}</div>
                <div><strong>Target:</strong> {targetFormat.toUpperCase()}</div>
              </div>
            )}

            {selectedFile && !selectedType.id.includes('download') && (
              <FormatSelector
                formats={selectedType.formats}
                selectedFormat={targetFormat}
                onFormatSelect={handleFormatSelect}
              />
            )}

            {conversionStatus !== 'idle' && (
              <ConversionProgress
                status={conversionStatus}
                progress={progress}
                error={error}
                estimatedTime={conversionStatus === 'converting' && selectedFile ?
                  Math.max(15, Math.ceil(selectedFile.size / 100000)) : undefined}
              />
            )}

            {conversionStatus === 'completed' && resultUrl && (selectedFile || videoUrl) && (
              <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#d4edda', borderRadius: '4px' }}>
                <a href={resultUrl} download={resultFileName || 'converted_audio'} style={{ color: '#155724', textDecoration: 'none', fontWeight: 'bold' }}>
                  ✓ Download: {resultFileName || 'converted_audio'}
                </a>
              </div>
             )}
 
            {selectedFile && !selectedType.id.includes('download') && targetFormat && conversionStatus === 'idle' && (
              <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <button
                  onClick={handleConvert}
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '15px 40px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                >
                  <i className="fas fa-exchange-alt" style={{ marginRight: '8px' }}></i>
                  Convert to {targetFormat.toUpperCase()}
                </button>
              </div>
            )}
 
            <div style={{ marginTop: '30px' }}>
              <span style={{ color: '#007bff', cursor: 'pointer' }} onClick={() => setSelectedType(null)}>← Back</span>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}