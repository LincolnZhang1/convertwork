'use client'

import { useState, useCallback, useRef } from 'react'

interface MultiFileUploaderProps {
  onFilesSelect: (files: File[]) => void
  selectedFiles: File[]
  maxFiles?: number
  accept?: string
}

export default function MultiFileUploader({ 
  onFilesSelect, 
  selectedFiles, 
  maxFiles = 10,
  accept = '*/*'
}: MultiFileUploaderProps) {
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

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      handleFiles(Array.from(files))
    }
  }, [])

  const handleFiles = useCallback((files: File[]) => {
    // 【FIX】检查空文件或无效文件
    const emptyFiles = files.filter(f => !f || f.size === 0)
    if (emptyFiles.length > 0) {
      alert(`以下文件为空或损坏: ${emptyFiles.map(f => f.name).join(', ')}`)
      return
    }

    // 检查文件数量
    const totalFiles = selectedFiles.length + files.length
    if (totalFiles > maxFiles) {
      alert(`最多只能选择 ${maxFiles} 个文件`)
      return
    }

    // 检查文件大小
    const maxSize = 100 * 1024 * 1024
    const invalidFiles = files.filter(f => f.size > maxSize)
    if (invalidFiles.length > 0) {
      alert(`以下文件超过 100MB 限制: ${invalidFiles.map(f => f.name).join(', ')}`)
      return
    }

    // 【FIX】检查重复文件 - 基于文件名和大小
    const duplicateFiles = files.filter(newFile => 
      selectedFiles.some(existingFile => 
        existingFile.name === newFile.name && existingFile.size === newFile.size
      )
    )
    if (duplicateFiles.length > 0) {
      alert(`以下文件已存在: ${duplicateFiles.map(f => f.name).join(', ')}`)
      return
    }

    // 合并文件列表
    const newFiles = [...selectedFiles, ...files]
    onFilesSelect(newFiles)
  }, [selectedFiles, maxFiles, onFilesSelect])

  const handleRemoveFile = useCallback((index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    onFilesSelect(newFiles)
  }, [selectedFiles, onFilesSelect])

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <div>
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
          multiple
          style={{ display: 'none' }}
          onChange={handleFileInput}
          accept={accept}
        />
        <div>
          <i className="fas fa-cloud-upload-alt" style={{ fontSize: '64px', color: '#18bfef', marginBottom: '20px' }}></i>
          <h3>拖拽文件到此处或点击选择</h3>
          <p>支持选择多个文件（最多 {maxFiles} 个）</p>
          <p style={{ marginTop: '10px', color: '#666' }}>
            最大文件大小: 100 MB
          </p>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4>已选择文件 ({selectedFiles.length}):</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {selectedFiles.map((file, index) => (
              <li
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px',
                  marginBottom: '10px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <strong>{file.name}</strong>
                  <span style={{ marginLeft: '10px', color: '#666', fontSize: '14px' }}>
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  className="button small"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveFile(index)
                  }}
                  style={{ marginLeft: '10px' }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
