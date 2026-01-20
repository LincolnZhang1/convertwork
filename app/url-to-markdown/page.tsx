'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Navigation from '@/components/Navigation'
import UrlInput from '@/components/UrlInput'
import ConversionProgress from '@/components/ConversionProgress'
import Link from 'next/link'
import Head from 'next/head'

export default function UrlToMarkdownPage() {
  const [webpageUrl, setWebpageUrl] = useState<string>('')
  const [conversionStatus, setConversionStatus] = useState<'idle' | 'uploading' | 'converting' | 'completed' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [resultFileName, setResultFileName] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const handleConvertRef = useRef<() => Promise<void>>()

  const handleUrlSubmit = useCallback((url: string) => {
    setWebpageUrl(url)
    setConversionStatus('idle')
    setResultUrl(null)
    setResultFileName('')
    setError(null)
  }, [])

  const handleConvert = useCallback(async () => {
    if (!webpageUrl.trim()) {
      setError('Please enter a web page URL')
      setConversionStatus('error')
      return
    }

    // Validate URL
    try {
      const urlObj = new URL(webpageUrl)
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        setError('URL must start with http:// or https://')
        setConversionStatus('error')
        return
      }
    } catch {
      setError('Please enter a valid URL')
      setConversionStatus('error')
      return
    }

    setConversionStatus('uploading')
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('conversionType', 'document')
      formData.append('operation', 'url-to-markdown')
      formData.append('webpageUrl', webpageUrl.trim())
      formData.append('targetFormat', 'md')

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
              setResultFileName(data.fileName || 'webpage.md')
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
  }, [webpageUrl])

  handleConvertRef.current = handleConvert

  // Auto-convert when URL is submitted
  useEffect(() => {
    if (webpageUrl && conversionStatus === 'idle') {
      setTimeout(() => handleConvert(), 100)
    }
  }, [webpageUrl, conversionStatus, handleConvert])

  return (
    <>
      <Head>
        <title>Convert Web Page to Markdown Online Free | URL to MD Converter</title>
        <meta name="description" content="Convert any web page to Markdown format online for free. Extract clean Markdown from websites, articles, and blogs. Perfect for content creators and developers." />
        <meta name="keywords" content="url to markdown, web page to markdown, html to markdown, online markdown converter, webpage converter, extract markdown from url" />
        <meta property="og:title" content="Convert Web Page to Markdown Online Free | URL to MD Converter" />
        <meta property="og:description" content="Convert any web page to Markdown format online for free. Extract clean Markdown from websites, articles, and blogs." />
        <meta property="og:url" content="https://www.convert.work/url-to-markdown" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Convert Web Page to Markdown Online Free | URL to MD Converter" />
        <meta name="twitter:description" content="Convert any web page to Markdown format online for free. Extract clean Markdown from websites." />
        <link rel="canonical" href="https://www.convert.work/url-to-markdown" />
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
            <span>URL to Markdown</span>
          </div>

          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Convert Web Page to Markdown
          </h1>

          <p style={{ fontSize: '1.1rem', textAlign: 'center', marginBottom: '30px', color: '#666', maxWidth: '600px', margin: '0 auto 30px' }}>
            Extract clean Markdown content from any website. Perfect for saving articles, documentation, and web content in Markdown format.
          </p>

          {/* Features */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <i className="fas fa-globe" style={{ fontSize: '2rem', color: '#007bff', marginBottom: '10px' }}></i>
              <h3 style={{ margin: '10px 0', fontSize: '1.1rem' }}>Any Website</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Convert content from any public web page</p>
            </div>
            <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <i className="fas fa-file-alt" style={{ fontSize: '2rem', color: '#007bff', marginBottom: '10px' }}></i>
              <h3 style={{ margin: '10px 0', fontSize: '1.1rem' }}>Clean Markdown</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Extract readable Markdown with proper formatting</p>
            </div>
            <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <i className="fas fa-rocket" style={{ fontSize: '2rem', color: '#007bff', marginBottom: '10px' }}></i>
              <h3 style={{ margin: '10px 0', fontSize: '1.1rem' }}>Fast & Free</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Quick conversion with no registration required</p>
            </div>
          </div>

          {/* URL Input */}
          <div style={{ marginBottom: '30px' }}>
            <UrlInput
              onUrlSubmit={handleUrlSubmit}
              selectedFormat="markdown"
              supportedFormats={['markdown']}
              placeholder="Enter web page URL (https://...)"
              isWebsiteCapture={true}
            />
          </div>

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
                <p>Your web page has been converted to Markdown format.</p>
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
                  Download Markdown File
                </a>
              </div>
            </div>
          )}

          {/* How it works */}
          <div style={{ marginTop: '50px', padding: '30px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>How to Convert Web Page to Markdown</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#007bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: '1.2rem', fontWeight: 'bold' }}>1</div>
                <h4 style={{ margin: '10px 0' }}>Enter URL</h4>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Paste the web page URL you want to convert</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#007bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: '1.2rem', fontWeight: 'bold' }}>2</div>
                <h4 style={{ margin: '10px 0' }}>Auto Convert</h4>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>The tool automatically processes the page</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#007bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: '1.2rem', fontWeight: 'bold' }}>3</div>
                <h4 style={{ margin: '10px 0' }}>Download</h4>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Download your clean Markdown file</p>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div style={{ marginTop: '30px', padding: '30px', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffeaa7' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#856404' }}>Perfect For:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div style={{ textAlign: 'center', color: '#856404' }}>
                <i className="fas fa-blog" style={{ fontSize: '1.5rem', marginBottom: '8px' }}></i>
                <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Content Creators</p>
                <p style={{ fontSize: '0.9rem' }}>Save articles and blog posts</p>
              </div>
              <div style={{ textAlign: 'center', color: '#856404' }}>
                <i className="fas fa-code" style={{ fontSize: '1.5rem', marginBottom: '8px' }}></i>
                <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Developers</p>
                <p style={{ fontSize: '0.9rem' }}>Extract documentation and guides</p>
              </div>
              <div style={{ textAlign: 'center', color: '#856404' }}>
                <i className="fas fa-book" style={{ fontSize: '1.5rem', marginBottom: '8px' }}></i>
                <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Researchers</p>
                <p style={{ fontSize: '0.9rem' }}>Save research papers and articles</p>
              </div>
              <div style={{ textAlign: 'center', color: '#856404' }}>
                <i className="fas fa-graduation-cap" style={{ fontSize: '1.5rem', marginBottom: '8px' }}></i>
                <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Students</p>
                <p style={{ fontSize: '0.9rem' }}>Save study materials and notes</p>
              </div>
            </div>
          </div>

          {/* Related Tools */}
          <div style={{ marginTop: '50px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Related Tools</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center' }}>
              <Link href="/merge-pdf" style={{ padding: '10px 20px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '6px', textDecoration: 'none', color: '#007bff', fontSize: '0.9rem' }}>
                Merge PDFs
              </Link>
              <Link href="/convert-pdf-to-word" style={{ padding: '10px 20px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '6px', textDecoration: 'none', color: '#007bff', fontSize: '0.9rem' }}>
                PDF to Word
              </Link>
              <Link href="/documents" style={{ padding: '10px 20px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '6px', textDecoration: 'none', color: '#007bff', fontSize: '0.9rem' }}>
                More Document Tools
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}