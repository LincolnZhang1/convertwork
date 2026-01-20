'use client'

import { useState, useCallback } from 'react'

interface UrlInputProps {
  onUrlSubmit: (url: string, format: string) => void
  selectedFormat: string
  placeholder?: string
  supportedFormats?: string[]
  isWebsiteCapture?: boolean
}

export default function UrlInput({
  onUrlSubmit,
  selectedFormat,
  placeholder = "Enter video URL (YouTube, Vimeo, etc.)",
  supportedFormats = ['mp4', 'mp3'],
  isWebsiteCapture = false
}: UrlInputProps) {
  const [url, setUrl] = useState('')
  const [isValidating, setIsValidating] = useState(false)

  const validateUrl = useCallback((inputUrl: string) => {
    try {
      const urlObj = new URL(inputUrl)
      
      if (isWebsiteCapture) {
        // 对于网站捕获，只需要是有效的HTTP/HTTPS URL
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
      } else {
        // Only YouTube is supported for video downloads
        const hostname = urlObj.hostname.toLowerCase()
        return hostname.includes('youtube.com') || hostname.includes('youtu.be')
      }
    } catch {
      return false
    }
  }, [isWebsiteCapture])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.trim()) {
      alert('Please enter a valid URL')
      return
    }

    if (!validateUrl(url.trim())) {
      const errorMessage = isWebsiteCapture 
        ? 'Please enter a valid website URL (must start with http:// or https://)'
        : 'Unsupported platform. Currently supports: YouTube'
      alert(errorMessage)
      return
    }

    setIsValidating(true)

    try {
      // 这里可以添加URL验证逻辑
      await new Promise(resolve => setTimeout(resolve, 500)) // 模拟验证
      onUrlSubmit(url.trim(), selectedFormat)
    } catch (error) {
      alert('Failed to validate URL. Please try again.')
    } finally {
      setIsValidating(false)
    }
  }, [url, selectedFormat, validateUrl, onUrlSubmit])

  return (
    <div
      className="upload-area"
      style={{
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        border: '2px dashed #18bfef',
        borderRadius: '8px',
        marginBottom: '20px'
      }}
    >
      <i className="fas fa-link" style={{ fontSize: '48px', color: '#18bfef', marginBottom: '20px' }}></i>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={placeholder}
            style={{
              width: '100%',
              maxWidth: '500px',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              marginBottom: '10px'
            }}
            disabled={isValidating}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <select
            value={selectedFormat}
            onChange={(e) => onUrlSubmit(url, e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              backgroundColor: 'white'
            }}
          >
            {supportedFormats.map(format => (
              <option key={format} value={format}>
                {format.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="button primary large"
          disabled={!url.trim() || isValidating}
          style={{
            opacity: (!url.trim() || isValidating) ? 0.6 : 1,
            cursor: (!url.trim() || isValidating) ? 'not-allowed' : 'pointer'
          }}
        >
          {isValidating ? (
            <>
              <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
              Validating...
            </>
          ) : (
            <>
              <i className="fas fa-download" style={{ marginRight: '8px' }}></i>
              {isWebsiteCapture ? 'Capture' : 'Download'} {selectedFormat.toUpperCase()}
            </>
          )}
        </button>
      </form>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '10px' }}>
          <strong>Disclaimer:</strong> {isWebsiteCapture 
            ? 'This tool captures website screenshots for personal use only. Please respect website terms of service.'
            : 'This tool is for personal use only. Please respect copyright laws and platform terms of service.'
          }
        </p>
      </div>
    </div>
  )
}