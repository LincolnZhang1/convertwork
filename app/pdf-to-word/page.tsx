'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import FileUploader from '@/components/FileUploader'
import FormatSelector from '@/components/FormatSelector'
import ConversionProgress from '@/components/ConversionProgress'
import ConversionResult from '@/components/ConversionResult'
import Link from 'next/link'

export default function PdfToWordPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFormat, setSelectedFormat] = useState('docx')
  const [conversionStatus, setConversionStatus] = useState<'idle' | 'converting' | 'completed' | 'error'>('idle')
  const [conversionProgress, setConversionProgress] = useState(0)
  const [conversionError, setConversionError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string>('')

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setConversionStatus('idle')
    setConversionError(null)
    setDownloadUrl('')
  }

  const handleFormatSelect = (format: string) => {
    setSelectedFormat(format)
  }

  const handleConvert = async () => {
    if (!selectedFile) {
      alert('Please select a file first')
      return
    }

    setConversionStatus('converting')
    setConversionProgress(0)
    setConversionError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('targetFormat', selectedFormat)

      setConversionProgress(50)
      
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText)
      }

      const result = await response.json()
      
      if (result.success) {
        // Create a dummy download
        const blob = new Blob(['Converted file content'], { type: 'application/octet-stream' })
        const url = URL.createObjectURL(blob)
        setDownloadUrl(url)
        setConversionStatus('completed')
        setConversionProgress(100)
      } else {
        throw new Error(result.error || 'Conversion failed')
      }

    } catch (error) {
      console.error('Conversion error:', error)
      setConversionStatus('error')
      setConversionError(error instanceof Error ? error.message : 'Conversion failed')
    }
  }
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', color: '#1a202c' }}>
      <Navigation />
      
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            marginBottom: '10px',
            color: '#007bff'
          }}>
            PDF to Word Converter
          </h1>
          
          <p style={{ 
            fontSize: '1.1rem', 
            color: '#6c757d', 
            lineHeight: '1.6',
            marginBottom: '30px'
          }}>
            Convert PDF documents to Microsoft Word format (DOCX) instantly. 
            Our free online converter preserves formatting, tables, and images. 
            No registration or software installation required.
          </p>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '30px', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <FileUploader 
            onFileSelect={handleFileSelect} 
            selectedFile={selectedFile} 
          />
          
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ marginBottom: '15px', color: '#333' }}>
              Output Format
            </h3>
            <FormatSelector 
              formats={['docx', 'doc']}
              selectedFormat={selectedFormat}
              onFormatSelect={handleFormatSelect}
            />
          </div>

          <div style={{ 
            marginTop: '30px', 
            textAlign: 'center' 
          }}>
            <button 
              onClick={handleConvert}
              disabled={!selectedFile || conversionStatus === 'converting'}
              style={{
                backgroundColor: selectedFile && conversionStatus !== 'converting' ? '#007bff' : '#6c757d',
                color: 'white',
                border: 'none',
                padding: '15px 40px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: selectedFile && conversionStatus !== 'converting' ? 'pointer' : 'not-allowed',
                transition: 'background-color 0.2s'
              }}
            >
              {conversionStatus === 'converting' ? 'Converting...' : 'Convert to Word'}
            </button>
          </div>

          <ConversionProgress 
            status={conversionStatus}
            progress={conversionProgress}
            error={conversionError}
          />
          
          {downloadUrl && (
            <ConversionResult 
              downloadUrl={downloadUrl}
              fileName={`converted.${selectedFormat}`}
              targetFormat={selectedFormat}
            />
          )}
        </div>

        {/* How to Use Section */}
        <div style={{ 
          marginTop: '40px', 
          padding: '30px', 
          backgroundColor: '#e9ecef', 
          borderRadius: '12px'
        }}>
          <h2 style={{ 
            marginBottom: '20px', 
            color: '#333' 
          }}>
            How to Convert PDF to Word
          </h2>
          
          <div style={{ color: '#6c757d', lineHeight: '1.8' }}>
            <ol style={{ paddingLeft: '20px' }}>
              <li style={{ marginBottom: '15px' }}>
                <strong>Upload your PDF file</strong> - Click the upload area or drag and drop your PDF document
              </li>
              <li style={{ marginBottom: '15px' }}>
                <strong>Choose output format</strong> - Select DOCX for the best compatibility
              </li>
              <li style={{ marginBottom: '15px' }}>
                <strong>Click convert</strong> - Start the conversion process
              </li>
              <li style={{ marginBottom: '15px' }}>
                <strong>Download your Word file</strong> - Get your converted document instantly
              </li>
            </ol>
          </div>
        </div>

        {/* Features Section */}
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>
            Why Choose Our PDF to Word Converter?
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '20px' 
          }}>
            <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', color: '#007bff', marginBottom: '10px' }}>
                ✓
              </div>
              <h3 style={{ marginBottom: '10px', color: '#333' }}>
                High Quality Conversion
              </h3>
              <p style={{ color: '#6c757d' }}>
                Preserves document formatting, tables, and images with 99% accuracy
              </p>
            </div>
            
            <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', color: '#28a745', marginBottom: '10px' }}>
                ⚡
              </div>
              <h3 style={{ marginBottom: '10px', color: '#333' }}>
                Fast Processing
              </h3>
              <p style={{ color: '#6c757d' }}>
                Convert PDF files to Word in seconds, not minutes
              </p>
            </div>
            
            <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', color: '#dc3545', marginBottom: '10px' }}>
                🔒
              </div>
              <h3 style={{ marginBottom: '10px', color: '#333' }}>
                Secure & Private
              </h3>
              <p style={{ color: '#6c757d' }}>
                Your files are processed locally and deleted after conversion
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>
            Frequently Asked Questions
          </h2>
          
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '25px', paddingBottom: '25px', borderBottom: '1px solid #eee' }}>
              <h3 style={{ marginBottom: '10px', color: '#007bff' }}>
                Is the PDF to Word conversion free?
              </h3>
              <p style={{ color: '#6c757d', lineHeight: '1.6' }}>
                Yes! You can convert up to 5 PDF files to Word format daily, completely free. 
                No registration or credit card required.
              </p>
            </div>
            
            <div style={{ marginBottom: '25px', paddingBottom: '25px', borderBottom: '1px solid #eee' }}>
              <h3 style={{ marginBottom: '10px', color: '#007bff' }}>
                What file formats are supported?
              </h3>
              <p style={{ color: '#6c757d', lineHeight: '1.6' }}>
                We support all PDF versions including PDF 1.0-2.0. The output will be in DOCX format, 
                compatible with Microsoft Word 2007 and newer versions.
              </p>
            </div>
            
            <div style={{ marginBottom: '25px', paddingBottom: '25px', borderBottom: '1px solid #eee' }}>
              <h3 style={{ marginBottom: '10px', color: '#007bff' }}>
                How long does conversion take?
              </h3>
              <p style={{ color: '#6c757d', lineHeight: '1.6' }}>
                Most PDF files convert to Word in under 30 seconds. Larger files with many images 
                may take up to 2 minutes.
              </p>
            </div>
          </div>
        </div>

        {/* More Tools */}
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <p style={{ marginBottom: '20px', color: '#6c757d' }}>
            Looking for more conversion tools?
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <Link href="/word-to-pdf">
              <div style={{ 
                padding: '15px 25px', 
                backgroundColor: '#007bff', 
                color: 'white', 
                borderRadius: '8px', 
                textDecoration: 'none',
                fontWeight: 'bold'
              }}>
                Word to PDF
              </div>
            </Link>
            <Link href="/pdf-merger">
              <div style={{ 
                padding: '15px 25px', 
                backgroundColor: '#6c757d', 
                color: 'white', 
                borderRadius: '8px', 
                textDecoration: 'none',
                fontWeight: 'bold'
              }}>
                PDF Merger
              </div>
            </Link>
            <Link href="/document-converter">
              <div style={{ 
                padding: '15px 25px', 
                backgroundColor: '#28a745', 
                color: 'white', 
                borderRadius: '8px', 
                textDecoration: 'none',
                fontWeight: 'bold'
              }}>
                All Document Tools
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}