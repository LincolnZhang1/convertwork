'use client'

interface ConversionResultProps {
  downloadUrl: string
  fileName: string
  targetFormat: string
}

export default function ConversionResult({ downloadUrl, fileName, targetFormat }: ConversionResultProps) {
  // 从文件名中提取实际的输出格式
  const actualFormat = fileName.split('.').pop()?.toUpperCase() || targetFormat.toUpperCase()
  
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = fileName // 直接使用后端返回的实际文件名
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
          style={{ marginRight: '10px' }}
        >
          <i className="fas fa-download" style={{ marginRight: '8px' }}></i>
          Download File
        </button>
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="button"
          style={{ marginLeft: '10px' }}
        >
          <i className="fas fa-external-link-alt" style={{ marginRight: '8px' }}></i>
          Open in New Window
        </a>
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
