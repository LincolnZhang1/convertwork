'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Navigation from '@/components/Navigation'
import FileUploader from '@/components/FileUploader'
import MultiFileUploader from '@/components/MultiFileUploader'
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

type Category = 'convert' | 'download' | 'archive' | 'optimize'

export default function DocumentsPage() {
  const [selectedType, setSelectedType] = useState<ConversionType | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [targetFormat, setTargetFormat] = useState<string>('')
  const [conversionStatus, setConversionStatus] = useState<'idle' | 'uploading' | 'converting' | 'completed' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [resultFileName, setResultFileName] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const handleConvertRef = useRef<() => Promise<void>>()

  const handleTypeSelect = useCallback((type: ConversionType) => {
    setSelectedType(type)
    setSelectedFile(null)
    setSelectedFiles([])
    // 只有当从 url-to-markdown 切换到其他类型时，才清空 videoUrl
    if (selectedType?.id !== 'url-to-markdown' || type.id !== 'url-to-markdown') {
      setVideoUrl('')
    }
    setTargetFormat('')
    setConversionStatus('idle')
    setResultUrl(null)
    setResultFileName('')
    setError(null)
  }, [selectedType])

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file)
    setTargetFormat('')
    setConversionStatus('idle')
    setResultUrl(null)
    setResultFileName('')
    setError(null)
  }, [])

  const handleFormatSelect = useCallback((format: string) => {
    setTargetFormat(format)
  }, [])

  const handleBack = useCallback(() => {
    setTargetFormat('')
    setConversionStatus('idle')
    setResultUrl(null)
    setResultFileName('')
    setError(null)
  }, [])

  const handleConvert = useCallback(async () => {
    console.log('HandleConvert called:', { 
      selectedType: selectedType?.id, 
      videoUrl, 
      targetFormat, 
      conversionStatus 
    })
    
    const hasFile = selectedFile || selectedFiles.length > 0
    const hasUrl = videoUrl.trim()

    if (!hasFile && !hasUrl && !selectedType) {
      setError('Please select a file, enter a URL, or choose a conversion type')
      return
    }

    if ((selectedType?.id.includes('download-video') || selectedType?.id.includes('download-audio')) && !hasUrl) {
      setError('Please enter a video URL to download')
      return
    }

    if (!selectedType?.id.includes('download') && !selectedType?.id.includes('url-to-markdown') && !hasFile) {
      setError('Please select a file to convert')
      return
    }

    const needsTargetFormat = !selectedType?.id.includes('compress') &&
                              !selectedType?.id.includes('merge') &&
                              !selectedType?.id.includes('ocr') &&
                              !selectedType?.id.includes('download-video') &&
                              !selectedType?.id.includes('download-audio') &&
                              !selectedType?.id.includes('download')

    if (needsTargetFormat && !targetFormat) {
      setError('Please select target format')
      return
    }

    setConversionStatus('uploading')
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      let conversionType = 'image'
      let operation = 'convert'

      if (selectedType) {
        if (selectedType.id.includes('download-video') || selectedType.id.includes('download-audio')) {
          operation = 'download'
          conversionType = selectedType.id.includes('download-video') ? 'video' : 'audio'
        } else if (selectedType.id.includes('url-to-markdown')) {
          operation = 'url-to-markdown'
          conversionType = 'document'
        } else if (selectedType.id.includes('compress')) {
          operation = 'compress'
          conversionType = selectedType.id.includes('pdf') ? 'document' : 'image'
        } else if (selectedType.id.includes('merge')) {
          operation = 'merge'
          conversionType = 'document'
        } else if (selectedType.id.includes('ocr')) {
          operation = 'ocr'
          conversionType = 'document'
        } else {
          if (selectedType.id.includes('image')) conversionType = 'image'
          else if (selectedType.id.includes('document')) conversionType = 'document'
          else if (selectedType.id.includes('audio')) conversionType = 'audio'
          else if (selectedType.id.includes('video')) conversionType = 'video'
        }
      }

      formData.append('conversionType', conversionType)
      formData.append('operation', operation)

      if (operation === 'download') {
        if (!videoUrl.trim()) {
          setError('Please enter a video URL')
          setConversionStatus('error')
          return
        }
        formData.append('videoUrl', videoUrl.trim())
        const defaultFormat = conversionType === 'audio' ? 'm4a' : 'mp4'
        formData.append('targetFormat', targetFormat || defaultFormat)
      } else if (operation === 'url-to-markdown') {
        if (!videoUrl.trim()) {
          setError('Please enter a web page URL')
          setConversionStatus('error')
          return
        }
        formData.append('webpageUrl', videoUrl.trim())
        formData.append('targetFormat', 'md')
      } else {
        if (operation === 'merge') {
          if (selectedFiles.length < 2) {
            setError('PDF merge requires at least 2 files')
            setConversionStatus('error')
            return
          }
          selectedFiles.forEach((file, index) => {
            formData.append('files', file)
          })
        } else {
          if (!selectedFile) {
            setError('Please select a file')
            setConversionStatus('error')
            return
          }
          formData.append('file', selectedFile)
        }

        if (targetFormat) {
          formData.append('targetFormat', targetFormat)
        }

        if (operation === 'compress') {
          formData.append('quality', '80')
        }
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
              console.log('API Response received:', data)

              if (data.success) {
                console.log('Conversion successful, setting result:', {
                  downloadUrl: data.downloadUrl,
                  fileName: data.fileName,
                  fileSize: data.fileSize
                })
                setResultUrl(data.downloadUrl)
                setResultFileName(data.fileName || 'downloaded_file')
                setConversionStatus('completed')
                setProgress(100)
                resolve()
              } else {
                console.error('Conversion failed:', data.error)
                reject(new Error(data.error || 'Conversion failed'))
              }
            } else {
              const errorData = JSON.parse(xhr.responseText)
              console.error('API error response:', errorData)
              reject(new Error(errorData.error || 'Conversion failed'))
            }
          } catch (err) {
            console.error('Response parsing error:', err)
            reject(new Error('Failed to parse response'))
          }
        })

        xhr.addEventListener('error', () => {
          reject(new Error('Network request failed'))
        })

        xhr.addEventListener('abort', () => {
          reject(new Error('Request cancelled'))
        })

        xhr.open('POST', operation === 'download' ? '/api/download' : '/api/convert')
        xhr.send(formData)
      })
    } catch (err) {
      console.error('Conversion error:', err)
      setError(err instanceof Error ? err.message : 'Conversion failed, please try again')
      setConversionStatus('error')
    }
  }, [selectedFile, selectedFiles, selectedType, targetFormat, videoUrl])

  handleConvertRef.current = handleConvert

  const handleUrlSubmit = useCallback(async (url: string, format: string) => {
    console.log('URL Submit called:', { url, format, selectedType: selectedType?.id })
    setVideoUrl(url)
    setTargetFormat(format)
    
    // 对于URL-to-Markdown，直接触发转换
    if (selectedType?.id === 'url-to-markdown' && conversionStatus === 'idle') {
      console.log('Triggering URL-to-Markdown conversion directly')
      setTimeout(() => handleConvert(), 100) // 延迟一下确保状态更新
    }
  }, [selectedType, conversionStatus])

  useEffect(() => {
    if (videoUrl && targetFormat && (selectedType?.id.includes('download') || selectedType?.id === 'url-to-markdown') && conversionStatus === 'idle') {
      handleConvert()
    }
  }, [videoUrl, targetFormat, selectedType, conversionStatus, handleConvert])

  useEffect(() => {
    if (videoUrl && targetFormat && (selectedType?.id.includes('download') || selectedType?.id === 'url-to-markdown') && conversionStatus === 'idle' && handleConvertRef.current) {
      handleConvertRef.current()
    }
  }, [videoUrl, targetFormat, selectedType, conversionStatus])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', color: 'black' }}>
      <Navigation />

      <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', paddingTop: '120px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Link href="/" style={{ color: '#007bff', textDecoration: 'none' }}>
            ← Back to Home
          </Link>
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: '20px', textAlign: 'center' }}>Document Conversion</h1>

        {!selectedType ? (
          <div>
            <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Choose a document conversion type</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div
                onClick={() => handleTypeSelect({
                  id: 'document',
                  name: 'Document Conversion',
                  description: 'Convert between PDF, DOC, DOCX, TXT, HTML, RTF, ODT formats',
                  icon: 'fa-file-alt',
                  formats: ['pdf', 'doc', 'docx', 'txt', 'html', 'rtf', 'odt']
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
                <i className="fas fa-file-alt" style={{ fontSize: '2rem', color: '#007bff', marginBottom: '10px' }}></i>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Document Conversion</div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>PDF, DOC, DOCX, TXT, HTML, RTF, ODT</div>
              </div>

              <div
                onClick={() => handleTypeSelect({
                  id: 'pdf-ocr',
                  name: 'PDF OCR',
                  description: 'Extract text from PDF images to make them searchable',
                  icon: 'fa-search',
                  formats: ['pdf']
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
                <i className="fas fa-search" style={{ fontSize: '2rem', color: '#007bff', marginBottom: '10px' }}></i>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>PDF OCR</div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>Make PDFs searchable</div>
              </div>

              <Link href="/merge-pdf" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div
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
                  <i className="fas fa-file-pdf" style={{ fontSize: '2rem', color: '#007bff', marginBottom: '10px' }}></i>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Merge PDFs</div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>Combine multiple PDFs</div>
                </div>
              </Link>

              <Link href="/url-to-markdown" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div
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
                  <i className="fas fa-globe" style={{ fontSize: '2rem', color: '#007bff', marginBottom: '10px' }}></i>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Web Page to Markdown</div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>Convert web pages to .md files</div>
                </div>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#007bff', cursor: 'pointer' }} onClick={handleBack}>← Back</span>
            </div>
            <div style={{ marginBottom: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
              {selectedType.name}
            </div>

            {selectedType.id.includes('download-video') || selectedType.id.includes('download-audio') ? (
              <UrlInput
                onUrlSubmit={handleUrlSubmit}
                selectedFormat={targetFormat || selectedType.formats[0]}
                supportedFormats={selectedType.formats}
              />
            ) : selectedType.id.includes('url-to-markdown') ? (
              <UrlInput
                onUrlSubmit={handleUrlSubmit}
                selectedFormat={targetFormat || selectedType.formats[0]}
                supportedFormats={selectedType.formats}
                placeholder="Enter web page URL (e.g., https://example.com/article)"
                isWebsiteCapture={true}
              />
            ) : selectedType.id.includes('merge') ? (
              <MultiFileUploader
                onFilesSelect={setSelectedFiles}
                selectedFiles={selectedFiles}
                maxFiles={10}
                accept=".pdf,application/pdf"
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

            {selectedFiles.length > 0 && (
              <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <div><strong>Files:</strong> {selectedFiles.length}</div>
                <div>
                  {selectedFiles.map((file, index) => (
                    <div key={index}>{index + 1}. {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</div>
                  ))}
                </div>
              </div>
            )}

            {selectedFile && !selectedType.id.includes('merge') && (
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
                estimatedTime={conversionStatus === 'converting' && (selectedFile || selectedFiles.length > 0) ?
                  selectedFile ?
                    Math.max(10, Math.ceil(selectedFile.size / 100000)) :
                      Math.max(15, Math.ceil(selectedFiles.reduce((total, file) => total + file.size, 0) / 100000)) :
                    undefined}
              />
            )}

            {conversionStatus === 'completed' && resultUrl && (selectedFile || selectedFiles.length > 0 || videoUrl || selectedType?.id === 'url-to-markdown') && (
              <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#d4edda', borderRadius: '4px' }}>
                <a href={resultUrl} download={resultFileName || 'downloaded_file'} style={{ color: '#155724', textDecoration: 'none', fontWeight: 'bold' }}>
                  ✓ Download: {resultFileName || 'downloaded_file'}
                </a>
                {/* Debug info */}
                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  Debug: status={conversionStatus}, hasResultUrl={!!resultUrl}, hasFile={!!selectedFile}, hasFiles={selectedFiles.length > 0}, hasVideoUrl={!!videoUrl}, typeId={selectedType?.id}, url-to-markdown={selectedType?.id === 'url-to-markdown'}
                </div>
              </div>
            )}

            {((selectedFile && targetFormat && conversionStatus === 'idle') || 
              (selectedFiles.length > 1 && conversionStatus === 'idle') || 
              (videoUrl && selectedType?.id.includes('download') && conversionStatus === 'idle')) && (
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button
                  onClick={handleConvert}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                >
                  <i className="fas fa-exchange-alt" style={{ marginRight: '8px' }}></i>
                  {selectedType?.id.includes('merge') ? 'Merge PDFs' : 'Convert Now'}
                </button>
              </div>
            )}

            <div style={{ marginTop: '30px' }}>
              <span style={{ color: '#007bff', cursor: 'pointer' }} onClick={handleBack}>← Back</span>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}