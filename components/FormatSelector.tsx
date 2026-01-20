'use client'

interface FormatSelectorProps {
  formats: string[]
  selectedFormat: string
  onFormatSelect: (format: string) => void
}

export default function FormatSelector({ formats, selectedFormat, onFormatSelect }: FormatSelectorProps) {
  // 【FIX】如果没有可用格式，显示提示信息
  if (formats.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#dc3545' }}>
        <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
        No compatible formats available for this conversion
      </div>
    )
  }

  return (
    <div className="format-selector">
      <div className="format-header">
        <h3>Choose Output Format</h3>
        <p>Select the format you want to convert to</p>
      </div>
      
      <div className="format-grid">
        {formats.map((format) => (
          <button
            key={format}
            className={`format-option ${selectedFormat === format ? 'selected' : ''}`}
            onClick={() => {
              // 【FIX】验证格式是否有效
              if (format && typeof format === 'string' && format.trim()) {
                onFormatSelect(format.trim())
              }
            }}
            disabled={!format || typeof format !== 'string'}
          >
            <span className="format-name">{format ? format.toUpperCase() : 'INVALID'}</span>
            {selectedFormat === format && (
              <span className="format-check">✓</span>
            )}
          </button>
        ))}
      </div>

      {selectedFormat && (
        <div className="format-selected">
          <div className="selected-info">
            <span className="selected-label">Selected Format:</span>
            <span className="selected-value">{selectedFormat.toUpperCase()}</span>
          </div>
        </div>
      )}
    </div>
  )
}