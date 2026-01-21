'use client'

interface ConversionResultProps {
  downloadUrl: string
  fileName: string
  targetFormat: string
}

export default function ConversionResult({ downloadUrl, fileName, targetFormat }: ConversionResultProps) {
  // 从文件名中提取实际的输出格式
  const actualFormat = fileName.split('.').pop()?.toUpperCase() || targetFormat.toUpperCase()
  
  const handleDownload = async () => {
    try {
      const response = await fetch(downloadUrl)
      if (!response.ok) {
        throw new Error('Download failed')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // 清理URL对象
      window.URL.revokeObjectURL(url)
    } catch (error) {
      alert('Download failed: ' + error.message)
    }
  }

  return (
    <div style={{ marginTop: '30px', padding: '30px', backgroundColor: '#d4edda', borderRadius: '8px', border: '1px solid #c3e6cb' }}>
      <div style={{ textAlign: 'center' }}>
        <i className="fas fa-check-circle" style={{ fontSize: '64px', color: '#28a745', marginBottom: '20px' }}></i>
        <h2 style={{ color: '#155724', marginBottom: '10px' }}>Conversion Successful!</h2>
        <p style={{ color: '#155724', marginBottom: '20px' }}>
          File converted to {actualFormat} format
        </p>
        <button
          className="button primary large"
          onClick={handleDownload}
        >
          <i className="fas fa-download" style={{ marginRight: '8px' }}></i>
          Download File
        </button>
      </div>
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '4px' }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
          <i className="fas fa-info-circle" style={{ marginRight: '5px' }}></i>
          File will be automatically deleted after 24 hours, please download promptly
        </p>
      </div>
    </div>
  )
}
