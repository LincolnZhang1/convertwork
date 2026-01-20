'use client'

interface ConversionProgressProps {
  status: 'idle' | 'uploading' | 'converting' | 'completed' | 'error'
  progress: number
  error: string | null
  estimatedTime?: number // 预估剩余时间（秒）
}

export default function ConversionProgress({ status, progress, error, estimatedTime }: ConversionProgressProps) {
  const getStatusText = () => {
    switch (status) {
      case 'idle':
        return 'Preparing...'
      case 'uploading':
        return 'Uploading file...'
      case 'converting':
        return 'Converting file...'
      case 'completed':
        return 'Conversion completed!'
      case 'error':
        return 'Conversion failed'
      default:
        return ''
    }
  }

  const getStatusDescription = () => {
    switch (status) {
      case 'uploading':
        return 'Please wait while the file is being uploaded'
      case 'converting':
        return estimatedTime 
          ? `Estimated ${Math.ceil(estimatedTime)} seconds remaining, please wait...`
          : 'Processing in progress, please wait...'
      case 'completed':
        return 'File is ready for download'
      case 'error':
        return 'Please check the file format or try again later'
      default:
        return ''
    }
  }

  return (
    <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        {status === 'uploading' || status === 'converting' ? (
          <i className="fas fa-spinner fa-spin" style={{ marginRight: '10px', color: '#18bfef' }}></i>
        ) : status === 'completed' ? (
          <i className="fas fa-check-circle" style={{ marginRight: '10px', color: '#28a745' }}></i>
        ) : (
          <i className="fas fa-exclamation-circle" style={{ marginRight: '10px', color: '#dc3545' }}></i>
        )}
        <h3 style={{ margin: 0 }}>{getStatusText()}</h3>
      </div>
      
      {(status === 'uploading' || status === 'converting') && (
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
        {getStatusDescription()}
      </p>

      {(status === 'uploading' || status === 'converting') && (
        <p style={{ marginTop: '5px', color: '#666' }}>
          Progress: {progress}%
        </p>
      )}

      {error && (
        <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px', border: '1px solid #ffc107' }}>
          <p style={{ margin: 0, color: '#856404' }}>{error}</p>
        </div>
      )}
    </div>
  )
}
