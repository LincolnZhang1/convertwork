'use client'

import { useState, useCallback, useRef } from 'react'

interface FileUploaderProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
}

export default function FileUploader({ onFileSelect, selectedFile }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }, [])

  const handleFile = useCallback((file: File) => {
    // 【FIX】检查文件是否存在 - 防止空文件或无效文件
    if (!file || file.size === 0) {
      alert('Invalid file: file is empty or corrupted')
      return
    }

    // 检查文件大小 (100MB)
    const maxSize = 100 * 1024 * 1024
    if (file.size > maxSize) {
      alert('File size exceeds 100MB limit')
      return
    }

    onFileSelect(file)
  }, [onFileSelect])

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <div
      className={`upload-area ${isDragging ? 'dragover' : ''}`}
      style={{
        border: `2px dashed ${isDragging ? '#007bff' : '#18bfef'}`,
        borderRadius: '8px',
        padding: '40px 20px',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        cursor: 'pointer',
        transition: 'border-color 0.3s ease',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileInput}
        accept="*/*"
      />
      {selectedFile ? (
        <div>
          <i className="fas fa-file" style={{ fontSize: '48px', color: '#18bfef', marginBottom: '20px' }}></i>
          <h3>{selectedFile.name}</h3>
          <p>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          <p style={{ marginTop: '10px', color: '#666' }}>
            Click or drag another file to replace
          </p>
        </div>
      ) : (
        <div>
          <i className="fas fa-cloud-upload-alt" style={{ fontSize: '64px', color: '#18bfef', marginBottom: '20px' }}></i>
          <h3>Drag & drop files here or click to select</h3>
          <p>Supports all common file formats</p>
          <p style={{ marginTop: '10px', color: '#666' }}>
            Maximum file size: 100 MB
          </p>
        </div>
      )}
    </div>
  )
}
