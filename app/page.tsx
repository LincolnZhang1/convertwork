import Link from 'next/link'
import Navigation from '@/components/Navigation'

const categories = [
  { name: 'Documents', href: '/documents', icon: 'fas fa-file-alt', description: 'Convert documents' },
  { name: 'Images', href: '/images', icon: 'fas fa-image', description: 'Convert images' },
  { name: 'Videos', href: '/videos', icon: 'fas fa-video', description: 'Convert videos' },
  { name: 'Audio', href: '/audio', icon: 'fas fa-music', description: 'Convert audio' },
  { name: 'Archives', href: '/archives', icon: 'fas fa-file-archive', description: 'Archive tools' },
]

const popularTools = [
  { name: 'Merge PDFs', href: '/merge-pdf', icon: 'fas fa-file-pdf', description: 'Combine multiple PDFs' },
  { name: 'URL to Markdown', href: '/url-to-markdown', icon: 'fas fa-globe', description: 'Convert web pages' },
  { name: 'PDF to Word', href: '/convert-pdf-to-word', icon: 'fas fa-file-word', description: 'Convert PDF to DOCX' },
  { name: 'Word to PDF', href: '/convert-word-to-pdf', icon: 'fas fa-file-pdf', description: 'Convert DOCX to PDF' },
]

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', color: 'black' }}>
      <Navigation />

      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 200px)', // 减去导航和footer的高度
        padding: '20px',
        paddingTop: '120px' // 为固定导航栏留出空间
      }}>
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '2rem',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          Choose a category to convert
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          maxWidth: '800px',
          width: '100%'
        }}>
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '1rem',
                textDecoration: 'none',
                color: 'inherit',
                border: '1px solid #ddd',
                borderRadius: '8px',
                textAlign: 'center'
              }}
            >
              <i className={category.icon} style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#007bff' }}></i>
              <span style={{ fontSize: '1rem', fontWeight: '500' }}>{category.name}</span>
              <span style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>{category.description}</span>
            </Link>
          ))}
        </div>

        <h2 style={{
          fontSize: '1.5rem',
          marginTop: '3rem',
          marginBottom: '1.5rem',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          Popular Tools
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          maxWidth: '800px',
          width: '100%'
        }}>
          {popularTools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '1rem',
                textDecoration: 'none',
                color: 'inherit',
                border: '1px solid #ddd',
                borderRadius: '8px',
                textAlign: 'center'
              }}
            >
              <i className={tool.icon} style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#28a745' }}></i>
              <span style={{ fontSize: '1rem', fontWeight: '500' }}>{tool.name}</span>
              <span style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>{tool.description}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}