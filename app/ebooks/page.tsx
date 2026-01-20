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

export default function EbooksPage() {
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
      formData.append('conversionType', 'document')
      formData.append('operation', 'convert')

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
  }, [selectedFile, targetFormat])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', color: 'black' }}>
      <Navigation />

      <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', paddingTop: '120px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Link href="/" style={{ color: '#007bff', textDecoration: 'none' }}>
            ← Back to Home
          </Link>
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: '20px', textAlign: 'center' }}>Ebook Conversion</h1>

        {!selectedType ? (
          <div>
            <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Choose an ebook tool</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div
                onClick={() => handleTypeSelect({
                  id: 'ebook-convert',
                  name: 'Ebook Conversion',
                  description: 'Convert between EPUB, MOBI, AZW, FB2 formats',
                  icon: 'fa-book',
                  formats: ['epub', 'mobi', 'azw', 'azw3', 'fb2', 'pdf']
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
                <i className="fas fa-book" style={{ fontSize: '2rem', color: '#007bff', marginBottom: '10px' }}></i>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Ebook Conversion</div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>EPUB, MOBI, AZW, FB2, PDF</div>
              </div>
            </div>
          </div>
        ) : !selectedFile ? (
          <div>
            <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>{selectedType.name}</h2>
            <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
              {selectedType.description}
            </p>
            <FileUploader onFileSelect={handleFileSelect} selectedFile={selectedFile} />
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                onClick={() => setSelectedType(null)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Back
              </button>
            </div>
          </div>
        ) : !targetFormat ? (
          <div>
            <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Select Output Format</h2>
            <FormatSelector
              formats={selectedType.formats}
              selectedFormat={targetFormat}
              onFormatSelect={handleFormatSelect}
            />
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                onClick={handleBack}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Convert File</h2>
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <p><strong>File:</strong> {selectedFile.name}</p>
              <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              <p><strong>Target Format:</strong> {targetFormat.toUpperCase()}</p>
            </div>

            {conversionStatus === 'idle' && (
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={handleConvert}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Start Conversion
                </button>
              </div>
            )}

            {(conversionStatus === 'uploading' || conversionStatus === 'converting' || conversionStatus === 'completed' || conversionStatus === 'error') && (
              <ConversionProgress
                status={conversionStatus}
                progress={progress}
                error={error}
              />
            )}

            {conversionStatus === 'completed' && resultUrl && (
              <ConversionResult
                downloadUrl={resultUrl}
                fileName={resultFileName}
                targetFormat={targetFormat}
              />
            )}

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                onClick={handleBack}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Convert Another File
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}