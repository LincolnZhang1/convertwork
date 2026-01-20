'use client'

import { useState, useCallback } from 'react'
import Navigation from '@/components/Navigation'
import FileUploader from '@/components/FileUploader'
import FormatSelector from '@/components/FormatSelector'
import ConversionProgress from '@/components/ConversionProgress'
import ConversionResult from '@/components/ConversionResult'
import Link from 'next/link'

interface ConversionType {
  id: string
  name: string
  description: string
  icon: string
  formats: string[]
}

export default function ImagesPage() {
  const [selectedType, setSelectedType] = useState<ConversionType | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [targetFormat, setTargetFormat] = useState<string>('')
  const [conversionStatus, setConversionStatus] = useState<'idle' | 'uploading' | 'converting' | 'completed' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [resultFileName, setResultFileName] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const handleTypeSelect = useCallback((type: ConversionType) => {
    setSelectedType(type)
    setSelectedFile(null)
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
    if (!selectedFile) {
      setError('Please select a file')
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
      formData.append('file', selectedFile)
      formData.append('targetFormat', targetFormat)
      formData.append('conversionType', 'image')
      formData.append('operation', selectedType?.id.includes('compress') ? 'compress' : 'convert')

      if (selectedType?.id.includes('compress')) {
        formData.append('quality', '80')
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
              console.log('API Response:', data)

              if (data.success) {
                setResultUrl(data.downloadUrl)
                setResultFileName(data.fileName || 'converted_file')
                setConversionStatus('completed')
                setProgress(100)
                resolve()
              } else {
                reject(new Error(data.error || 'Conversion failed'))
              }
            } else {
              const errorData = JSON.parse(xhr.responseText)
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

        xhr.open('POST', '/api/convert')
        xhr.send(formData)
      })
    } catch (err) {
      console.error('Conversion error:', err)
      setError(err instanceof Error ? err.message : 'Conversion failed, please try again')
      setConversionStatus('error')
    }
  }, [selectedFile, targetFormat, selectedType])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', color: 'black' }}>
      <Navigation />

      <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', paddingTop: '120px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Link href="/" style={{ color: '#007bff', textDecoration: 'none' }}>
            ← Back to Home
          </Link>
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: '20px', textAlign: 'center' }}>Image Conversion</h1>

        {!selectedType ? (
          <div>
            <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Choose an image tool</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div
                onClick={() => handleTypeSelect({
                  id: 'image',
                  name: 'Image Conversion',
                  description: 'Convert between JPG, PNG, GIF, WebP, BMP, TIFF, SVG formats',
                  icon: 'fa-image',
                  formats: ['jpg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'svg']
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
                <i className="fas fa-image" style={{ fontSize: '2rem', color: '#007bff', marginBottom: '10px' }}></i>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Image Conversion</div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>JPG, PNG, GIF, WebP, BMP, TIFF, SVG</div>
              </div>

              <div
                onClick={() => handleTypeSelect({
                  id: 'compress-image',
                  name: 'Compress Images',
                  description: 'Compress JPG, PNG images to reduce file size',
                  icon: 'fa-compress',
                  formats: ['jpg', 'jpeg', 'png', 'webp']
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
                <i className="fas fa-compress" style={{ fontSize: '2rem', color: '#007bff', marginBottom: '10px' }}></i>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Compress Images</div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>Reduce file size</div>
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

            <FileUploader
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
            />

            {selectedFile && (
              <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <div><strong>File:</strong> {selectedFile.name}</div>
                <div><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
            )}

            {selectedFile && (
              <FormatSelector
                formats={selectedType.formats}
                selectedFormat={targetFormat}
                onFormatSelect={handleFormatSelect}
              />
            )}

            {selectedFile && targetFormat && conversionStatus === 'idle' && (
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
                  Convert Now
                </button>
              </div>
            )}

            {conversionStatus !== 'idle' && (
              <ConversionProgress
                status={conversionStatus}
                progress={progress}
                error={error}
                estimatedTime={conversionStatus === 'converting' && selectedFile ?
                  Math.max(10, Math.ceil(selectedFile.size / 100000)) : undefined}
              />
            )}

            {conversionStatus === 'completed' && resultUrl && selectedFile && (
              <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#d4edda', borderRadius: '4px' }}>
                <a href={resultUrl} download={resultFileName || 'converted_file'} style={{ color: '#155724', textDecoration: 'none', fontWeight: 'bold' }}>
                  ✓ Download: {resultFileName || 'converted_file'}
                </a>
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