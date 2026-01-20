'use client'

import { useState, useCallback, useRef } from 'react'
import Navigation from '@/components/Navigation'
import FileUploader from '@/components/FileUploader'
import MultiFileUploader from '@/components/MultiFileUploader'
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

export default function ArchivesPage() {
  const [selectedType, setSelectedType] = useState<ConversionType | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
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

  const handleFilesSelect = useCallback((files: File[]) => {
    setSelectedFiles(files)
    setConversionStatus('idle')
    setResultUrl(null)
    setResultFileName('')
    setError(null)
  }, [])

  const handleFormatSelect = useCallback((format: string) => {
    setTargetFormat(format)
  }, [])

  const handleConvert = useCallback(async () => {
    if (selectedType?.id.includes('create') && selectedFiles.length === 0) {
      setError('Please select files to archive')
      return
    }

    if (selectedType?.id.includes('extract') && !selectedFile) {
      setError('Please select an archive file')
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
      formData.append('conversionType', 'archive')
      formData.append('operation', selectedType?.id.includes('create') ? 'create' : 'extract')
      formData.append('targetFormat', targetFormat)

      if (selectedType?.id.includes('create')) {
        selectedFiles.forEach((file) => {
          formData.append('files', file)
        })
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
              } else if (data.downloadUrl) {
                const downloadUrl = data.downloadUrl.startsWith('/temp/')
                  ? `${window.location.origin}/api/temp/${data.downloadUrl.replace('/temp/', '')}`
                  : data.downloadUrl
                setResultUrl(downloadUrl)
                setResultFileName(data.fileName || 'archive_result')
                setConversionStatus('completed')
                setProgress(100)
                resolve()
              } else {
                reject(new Error('Invalid response'))
              }
            } else {
              const errorData = JSON.parse(xhr.responseText)
              reject(new Error(errorData.error || 'Operation failed'))
            }
          } catch {
            reject(new Error('Failed to parse response'))
          }
        })

        xhr.addEventListener('error', () => {
          reject(new Error('Network request failed'))
        })

        xhr.open('POST', '/api/convert')
        xhr.send(formData)
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed')
      setConversionStatus('error')
    }
  }, [selectedFile, selectedFiles, targetFormat, selectedType])

  handleConvertRef.current = handleConvert

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
          throw new Error(data.error || 'Operation failed')
        } else {
          setProgress(data.progress || 0)
          attempts++
          if (attempts < maxAttempts) {
            setTimeout(poll, 2000)
          } else {
            throw new Error('Operation timeout')
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

        <h1 style={{ fontSize: '2rem', marginBottom: '20px', textAlign: 'center' }}>Archive Tools</h1>

        {!selectedType ? (
          <div>
            <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Choose an archive operation</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div
                onClick={() => handleTypeSelect({
                  id: 'create-archive',
                  name: 'Create Archive',
                  description: 'Package files into ZIP or TAR archives',
                  icon: 'fa-file-archive',
                  formats: ['zip', 'tar']
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
                <i className="fas fa-file-archive" style={{ fontSize: '2rem', color: '#007bff', marginBottom: '10px' }}></i>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Create Archive</div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>Package files into ZIP or TAR</div>
              </div>

              <div
                onClick={() => handleTypeSelect({
                  id: 'extract-archive',
                  name: 'Extract Archive',
                  description: 'Extract files from ZIP or TAR archives',
                  icon: 'fa-folder-open',
                  formats: ['zip', 'tar', 'gz', 'bz2']
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
                <i className="fas fa-folder-open" style={{ fontSize: '2rem', color: '#007bff', marginBottom: '10px' }}></i>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Extract Archive</div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>Extract files from archives</div>
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

            {selectedType.id.includes('create') ? (
              <MultiFileUploader
                onFilesSelect={handleFilesSelect}
                selectedFiles={selectedFiles}
                maxFiles={50}
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

            {selectedFiles.length > 0 && (
              <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <div><strong>Files:</strong> {selectedFiles.length}</div>
                <div>
                  {selectedFiles.slice(0, 5).map((file, index) => (
                    <div key={index}>{index + 1}. {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</div>
                  ))}
                  {selectedFiles.length > 5 && <div>... and {selectedFiles.length - 5} more files</div>}
                </div>
              </div>
            )}

            {(selectedFile || selectedFiles.length > 0) && (
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
                      Math.max(15, Math.ceil(selectedFiles.reduce((total, file) => total + file.size, 0) / 100000)) : undefined}
              />
            )}

            {conversionStatus === 'completed' && resultUrl && (selectedFile || selectedFiles.length > 0) && (
              <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#d4edda', borderRadius: '4px' }}>
                <a href={resultUrl} download={resultFileName || 'archive_result'} style={{ color: '#155724', textDecoration: 'none', fontWeight: 'bold' }}>
                  ✓ Download: {resultFileName || 'archive_result'}
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