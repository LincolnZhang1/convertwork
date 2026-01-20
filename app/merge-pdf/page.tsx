'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Navigation from '@/components/Navigation'
import MultiFileUploader from '@/components/MultiFileUploader'
import ConversionProgress from '@/components/ConversionProgress'
import Link from 'next/link'
import Head from 'next/head'

export default function MergePdfPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [conversionStatus, setConversionStatus] = useState<'idle' | 'uploading' | 'converting' | 'completed' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [resultFileName, setResultFileName] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const handleConvertRef = useRef<() => Promise<void>>()

  const handleFilesSelect = useCallback((files: File[]) => {
    setSelectedFiles(files)
    setConversionStatus('idle')
    setResultUrl(null)
    setResultFileName('')
    setError(null)
  }, [])

  const handleConvert = useCallback(async () => {
    if (selectedFiles.length < 2) {
      setError('Please select at least 2 PDF files to merge')
      setConversionStatus('error')
      return
    }

    setConversionStatus('uploading')
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('conversionType', 'document')
      formData.append('operation', 'merge')

      selectedFiles.forEach((file, index) => {
        formData.append('files', file)
      })

      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100
          setProgress(percentComplete * 0.5) // Upload is 50% of progress
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const data = JSON.parse(xhr.responseText)
            if (data.success) {
              const downloadUrl = data.downloadUrl.startsWith('/temp/')
                ? `${window.location.origin}/api/temp/${data.downloadUrl.replace('/temp/', '')}`
                : data.downloadUrl
              setResultUrl(downloadUrl)
              setResultFileName(data.fileName || 'merged.pdf')
              setConversionStatus('completed')
              setProgress(100)
            } else {
              setError(data.error || 'Merge failed')
              setConversionStatus('error')
            }
          } catch {
            setError('Failed to parse response')
            setConversionStatus('error')
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText)
            setError(errorData.error || 'Merge failed')
          } catch {
            setError('Merge failed')
          }
          setConversionStatus('error')
        }
      })

      xhr.addEventListener('error', () => {
        setError('Network request failed')
        setConversionStatus('error')
      })

      xhr.open('POST', '/api/convert')
      xhr.send(formData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError('Merge failed: ' + errorMessage)
      setConversionStatus('error')
    }
  }, [selectedFiles])

  handleConvertRef.current = handleConvert

  return (
    <>
      <Head>
        <title>Merge PDF Files Online Free - Combine Multiple PDFs | Convert.Work</title>
        <meta name="description" content="Merge multiple PDF files online for free. Combine PDFs easily without registration. Fast, secure PDF merger supporting unlimited files. No quality loss." />
        <meta name="keywords" content="merge pdf online, combine pdf files, pdf merger, merge multiple pdfs, free pdf combiner, online pdf merge" />
        <meta property="og:title" content="Merge PDF Files Online Free - Combine Multiple PDFs" />
        <meta property="og:description" content="Merge multiple PDF files online for free. Combine PDFs easily without registration. Fast, secure PDF merger." />
        <meta property="og:url" content="https://www.convert.work/merge-pdf" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Merge PDF Files Online Free - Combine Multiple PDFs" />
        <meta name="twitter:description" content="Merge multiple PDF files online for free. Combine PDFs easily without registration." />
        <link rel="canonical" href="https://www.convert.work/merge-pdf" />
      </Head>

      <div style={{ minHeight: '100vh', backgroundColor: 'white', color: 'black' }}>
        <Navigation />

        <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', paddingTop: '120px' }}>
          {/* Breadcrumb */}
          <div style={{ marginBottom: '20px', fontSize: '0.9rem', color: '#666' }}>
            <Link href="/" style={{ color: '#007bff', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <Link href="/documents" style={{ color: '#007bff', textDecoration: 'none' }}>Documents</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span>Merge PDFs</span>
          </div>

          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Merge PDF Files Online Free
          </h1>

          <p style={{ fontSize: '1.1rem', textAlign: 'center', marginBottom: '30px', color: '#666', maxWidth: '600px', margin: '0 auto 30px' }}>
            Combine multiple PDF files into one document instantly. No registration required, completely free, and secure.
          </p>

          {/* Features */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <i className="fas fa-infinity" style={{ fontSize: '2rem', color: '#007bff', marginBottom: '10px' }}></i>
              <h3 style={{ margin: '10px 0', fontSize: '1.1rem' }}>Unlimited Files</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Merge as many PDF files as you need</p>
            </div>
            <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <i className="fas fa-shield-alt" style={{ fontSize: '2rem', color: '#007bff', marginBottom: '10px' }}></i>
              <h3 style={{ margin: '10px 0', fontSize: '1.1rem' }}>Secure & Private</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Your files are processed securely and deleted after conversion</p>
            </div>
            <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <i className="fas fa-rocket" style={{ fontSize: '2rem', color: '#007bff', marginBottom: '10px' }}></i>
              <h3 style={{ margin: '10px 0', fontSize: '1.1rem' }}>Fast Processing</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Quick merge process with high-speed servers</p>
            </div>
          </div>

          {/* File Upload */}
          <div style={{ marginBottom: '30px' }}>
            <MultiFileUploader
              onFilesSelect={handleFilesSelect}
              selectedFiles={selectedFiles}
              accept=".pdf"
              maxFiles={50}
            />
          </div>

          {/* Convert Button */}
          {selectedFiles.length >= 2 && conversionStatus === 'idle' && (
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <button
                onClick={handleConvert}
                style={{
                  padding: '15px 30px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
              >
                <i className="fas fa-file-pdf" style={{ marginRight: '8px' }}></i>
                Merge {selectedFiles.length} PDF Files
              </button>
            </div>
          )}

          {/* Progress */}
          {conversionStatus !== 'idle' && (
            <ConversionProgress
              status={conversionStatus}
              progress={progress}
              error={error}
            />
          )}

          {/* Result */}
          {conversionStatus === 'completed' && resultUrl && (
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <div style={{ padding: '20px', border: '1px solid #d4edda', borderRadius: '8px', backgroundColor: '#d4edda', color: '#155724' }}>
                <i className="fas fa-check-circle" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                <h3 style={{ margin: '10px 0' }}>Merge Completed Successfully!</h3>
                <p>Your PDF files have been combined into one document.</p>
                <a
                  href={resultUrl}
                  download={resultFileName}
                  style={{
                    display: 'inline-block',
                    marginTop: '15px',
                    padding: '12px 24px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    fontWeight: '600'
                  }}
                >
                  <i className="fas fa-download" style={{ marginRight: '8px' }}></i>
                  Download Merged PDF
                </a>
              </div>
            </div>
          )}

          {/* How it works */}
          <div style={{ marginTop: '50px', padding: '30px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>How to Merge PDF Files Online</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#007bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: '1.2rem', fontWeight: 'bold' }}>1</div>
                <h4 style={{ margin: '10px 0' }}>Upload Files</h4>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Select multiple PDF files from your device</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#007bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: '1.2rem', fontWeight: 'bold' }}>2</div>
                <h4 style={{ margin: '10px 0' }}>Arrange Order</h4>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Drag and drop to reorder files if needed</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#007bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: '1.2rem', fontWeight: 'bold' }}>3</div>
                <h4 style={{ margin: '10px 0' }}>Merge</h4>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Click merge and wait for processing</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#007bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: '1.2rem', fontWeight: 'bold' }}>4</div>
                <h4 style={{ margin: '10px 0' }}>Download</h4>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Download your merged PDF file</p>
              </div>
            </div>
          </div>

          {/* Related Tools */}
          <div style={{ marginTop: '50px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Related PDF Tools</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center' }}>
              <Link href="/convert-pdf-to-word" style={{ padding: '10px 20px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '6px', textDecoration: 'none', color: '#007bff', fontSize: '0.9rem' }}>
                PDF to Word
              </Link>
              <Link href="/convert-word-to-pdf" style={{ padding: '10px 20px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '6px', textDecoration: 'none', color: '#007bff', fontSize: '0.9rem' }}>
                Word to PDF
              </Link>
              <Link href="/compress-pdf" style={{ padding: '10px 20px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '6px', textDecoration: 'none', color: '#007bff', fontSize: '0.9rem' }}>
                Compress PDF
              </Link>
              <Link href="/documents" style={{ padding: '10px 20px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '6px', textDecoration: 'none', color: '#007bff', fontSize: '0.9rem' }}>
                More PDF Tools
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}