'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Navigation from '@/components/Navigation'
import FileUploader from '@/components/FileUploader'
import ConversionProgress from '@/components/ConversionProgress'
import Link from 'next/link'
import Head from 'next/head'

export default function ConvertWordToPdfPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [conversionStatus, setConversionStatus] = useState<'idle' | 'uploading' | 'converting' | 'completed' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [resultFileName, setResultFileName] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const handleConvertRef = useRef<() => Promise<void>>()

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file)
    setConversionStatus('idle')
    setResultUrl(null)
    setResultFileName('')
    setError(null)
  }, [])

  const handleConvert = useCallback(async () => {
    if (!selectedFile) {
      setError('Please select a Word file')
      setConversionStatus('error')
      return
    }

    setConversionStatus('uploading')
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('conversionType', 'document')
      formData.append('operation', 'convert')
      formData.append('file', selectedFile)
      formData.append('targetFormat', 'pdf')

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
              setResultFileName(data.fileName || 'converted.pdf')
              setConversionStatus('completed')
              setProgress(100)
            } else {
              setError(data.error || 'Conversion failed')
              setConversionStatus('error')
            }
          } catch {
            setError('Failed to parse response')
            setConversionStatus('error')
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText)
            setError(errorData.error || 'Conversion failed')
          } catch {
            setError('Conversion failed')
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
      setError('Conversion failed: ' + errorMessage)
      setConversionStatus('error')
    }
  }, [selectedFile])

  handleConvertRef.current = handleConvert

  return (
    <>
      <Head>
        <title>Convert Word to PDF Online Free - DOCX to PDF Converter | Convert.Work</title>
        <meta name="description" content="Convert Word to PDF online for free. Transform DOCX and DOC files to PDF format instantly. Maintain formatting, secure conversion, no registration required." />
        <meta name="keywords" content="convert word to pdf, docx to pdf, word to pdf converter, online word converter, free docx to pdf, word to pdf online" />
        <meta property="og:title" content="Convert Word to PDF Online Free - DOCX to PDF Converter" />
        <meta property="og:description" content="Convert Word to PDF online for free. Transform DOCX and DOC files to PDF format instantly." />
        <meta property="og:url" content="https://www.convert.work/convert-word-to-pdf" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Convert Word to PDF Online Free - DOCX to PDF Converter" />
        <meta name="twitter:description" content="Convert Word to PDF online for free. Transform DOCX and DOC files to PDF format." />
        <link rel="canonical" href="https://www.convert.work/convert-word-to-pdf" />
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
            <span>Word to PDF</span>
          </div>

          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Convert Word to PDF Online Free
          </h1>

          <p style={{ fontSize: '1.1rem', textAlign: 'center', marginBottom: '30px', color: '#666', maxWidth: '600px', margin: '0 auto 30px' }}>
            Transform your Word documents into professional PDF files instantly. Convert DOCX and DOC files while preserving formatting.
          </p>

          {/* Features */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <i className="fas fa-file-pdf" style={{ fontSize: '2rem', color: '#007bff', marginBottom: '10px' }}></i>
              <h3 style={{ margin: '10px 0', fontSize: '1.1rem' }}>Professional PDFs</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Create high-quality PDF documents</p>
            </div>
            <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <i className="fas fa-shield-alt" style={{ fontSize: '2rem', color: '#007bff', marginBottom: '10px' }}></i>
              <h3 style={{ margin: '10px 0', fontSize: '1.1rem' }}>Secure & Private</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Your files are processed securely and deleted after conversion</p>
            </div>
            <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <i className="fas fa-rocket" style={{ fontSize: '2rem', color: '#007bff', marginBottom: '10px' }}></i>
              <h3 style={{ margin: '10px 0', fontSize: '1.1rem' }}>Fast Conversion</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Quick processing with high-speed servers</p>
            </div>
          </div>

          {/* Note about LibreOffice */}
          <div style={{ backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px', padding: '15px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <i className="fas fa-info-circle" style={{ color: '#856404', marginRight: '10px' }}></i>
              <strong style={{ color: '#856404' }}>Note:</strong>
            </div>
            <p style={{ color: '#856404', margin: 0, fontSize: '0.9rem' }}>
              Document conversion requires LibreOffice to be installed on the server. If conversion fails, it may be due to LibreOffice not being available in the current environment.
            </p>
          </div>

          {/* File Upload */}
          <div style={{ marginBottom: '30px' }}>
            <FileUploader
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
            />
          </div>

          {/* Convert Button */}
          {selectedFile && conversionStatus === 'idle' && (
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
                Convert Word to PDF
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
                <h3 style={{ margin: '10px 0' }}>Conversion Completed Successfully!</h3>
                <p>Your Word document has been converted to PDF format.</p>
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
                  Download PDF File
                </a>
              </div>
            </div>
          )}

          {/* How it works */}
          <div style={{ marginTop: '50px', padding: '30px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>How to Convert Word to PDF Online</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#007bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: '1.2rem', fontWeight: 'bold' }}>1</div>
                <h4 style={{ margin: '10px 0' }}>Upload Word File</h4>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Select your DOC or DOCX file</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#007bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: '1.2rem', fontWeight: 'bold' }}>2</div>
                <h4 style={{ margin: '10px 0' }}>Auto Convert</h4>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>The tool processes your document</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#007bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: '1.2rem', fontWeight: 'bold' }}>3</div>
                <h4 style={{ margin: '10px 0' }}>Download PDF</h4>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Download your converted PDF file</p>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div style={{ marginTop: '30px', padding: '30px', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffeaa7' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#856404' }}>Why Convert Word to PDF Online?</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div style={{ color: '#856404' }}>
                <i className="fas fa-lock" style={{ marginRight: '10px', fontSize: '1.2rem' }}></i>
                <strong>Preserve Formatting:</strong> Keep exact layout and design
              </div>
              <div style={{ color: '#856404' }}>
                <i className="fas fa-universal-access" style={{ marginRight: '10px', fontSize: '1.2rem' }}></i>
                <strong>Universal Compatibility:</strong> PDFs work on any device
              </div>
              <div style={{ color: '#856404' }}>
                <i className="fas fa-file-signature" style={{ marginRight: '10px', fontSize: '1.2rem' }}></i>
                <strong>Professional Documents:</strong> Create polished business documents
              </div>
              <div style={{ color: '#856404' }}>
                <i className="fas fa-share" style={{ marginRight: '10px', fontSize: '1.2rem' }}></i>
                <strong>Easy Sharing:</strong> Share documents that look the same everywhere
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
              <Link href="/merge-pdf" style={{ padding: '10px 20px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '6px', textDecoration: 'none', color: '#007bff', fontSize: '0.9rem' }}>
                Merge PDFs
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