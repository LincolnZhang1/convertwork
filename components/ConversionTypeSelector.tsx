// Type definitions
export interface ConversionType {
  id: string
  name: string
  description: string
  icon: string
  formats: string[]
}

export interface ConversionTypeSelectorProps {
  category: keyof typeof conversionTypes
  onTypeSelect: (type: ConversionType) => void
}

// Conversion types with download category
const downloadTypes = [
  {
    id: 'download-video',
    name: 'Download YouTube Video',
    description: 'Download videos from YouTube and other platforms as MP4',
    icon: 'fa-video',
    formats: ['mp4']
  },
  {
    id: 'download-audio',
    name: 'Download Audio',
    description: 'Download audio from YouTube and other platforms as M4A',
    icon: 'fa-music',
    formats: ['m4a']
  }
]

export const conversionTypes = {
  convert: [
    {
      id: 'image',
      name: 'Image Conversion',
      description: 'Convert between JPG, PNG, GIF, WebP, BMP, TIFF, SVG formats',
      icon: 'fa-image',
      formats: ['jpg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'svg']
    },
    {
      id: 'document',
      name: 'Document Conversion',
      description: 'Convert between PDF, DOC, DOCX, TXT, HTML, RTF, ODT formats',
      icon: 'fa-file-alt',
      formats: ['pdf', 'doc', 'docx', 'txt', 'html', 'rtf', 'odt']
    },
    {
      id: 'video',
      name: 'Convert Local Video',
      description: 'Convert uploaded video files between MP4, AVI, MKV, MOV, WebM, FLV formats',
      icon: 'fa-video',
      formats: ['mp4', 'avi', 'mkv', 'mov', 'webm', 'flv']
    },
    {
      id: 'audio',
      name: 'Audio Conversion',
      description: 'Convert between MP3, WAV, FLAC, AAC, OGG, M4A formats',
      icon: 'fa-music',
      formats: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a']
    },
    {
      id: 'compress-image',
      name: 'Compress Images',
      description: 'Compress JPG, PNG images to reduce file size',
      icon: 'fa-compress',
      formats: ['jpg', 'jpeg', 'png', 'webp']
    },
    {
      id: 'pdf-ocr',
      name: 'PDF OCR',
      description: 'Extract text from PDF images to make them searchable',
      icon: 'fa-search',
      formats: ['pdf']
    },
    {
      id: 'merge-pdf',
      name: 'Merge PDFs',
      description: 'Combine multiple PDF files into one document',
      icon: 'fa-file-pdf',
      formats: ['pdf']
    }
  ],
  download: downloadTypes,
  website: [
    {
      id: 'website-pdf',
      name: 'Website to PDF',
      description: 'Convert web pages to PDF documents',
      icon: 'fa-file-pdf',
      formats: ['pdf']
    },
    {
      id: 'website-screenshot',
      name: 'Website Screenshot',
      description: 'Capture web pages as PNG or JPG images',
      icon: 'fa-camera',
      formats: ['png', 'jpg']
    }
  ],
  archive: [
    {
      id: 'create-archive',
      name: 'Create Archive',
      description: 'Package files into ZIP or TAR archives',
      icon: 'fa-file-archive',
      formats: ['zip', 'tar']
    },
    {
      id: 'extract-archive',
      name: 'Extract Archive',
      description: 'Extract files from ZIP or TAR archives',
      icon: 'fa-folder-open',
      formats: ['zip', 'tar', 'gz', 'bz2']
    }
  ],
  optimize: [
    {
      id: 'compress-pdf',
      name: 'Compress PDF',
      description: 'Reduce PDF file size while maintaining quality',
      icon: 'fa-file-pdf',
      formats: ['pdf']
    },
    {
      id: 'compress-image',
      name: 'Compress Images',
      description: 'Compress JPG, PNG images to reduce file size',
      icon: 'fa-compress',
      formats: ['jpg', 'jpeg', 'png', 'webp']
    }
  ]
}

export default function ConversionTypeSelector({ category, onTypeSelect }: ConversionTypeSelectorProps) {
  const types = conversionTypes[category] || []

  if (types.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>No features available for this category</p>
      </div>
    )
  }

  return (
    <div style={{ marginTop: '40px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Select Conversion Type
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginTop: '30px',
        }}
      >
        {types.map((type) => (
          <div
            key={type.id}
            className="box"
            style={{
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onClick={() => onTypeSelect(type)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <i
              className={`fas ${type.icon}`}
              style={{
                fontSize: '48px',
                color: '#18bfef',
                marginBottom: '20px',
                display: 'block',
              }}
            ></i>
            <h3 style={{ marginBottom: '10px' }}>{type.name}</h3>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
              {type.description}
            </p>
            <div style={{ marginTop: '15px', fontSize: '12px', color: '#999' }}>
              支持格式: {type.formats.join(', ').toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}