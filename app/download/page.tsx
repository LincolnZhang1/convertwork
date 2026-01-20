
import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'Video Downloader - Convert.Work | Free Online Video Downloads',
  description: 'Download videos from YouTube, Vimeo and other platforms for free. Fast, secure video downloader supporting multiple formats.',
  keywords: 'video downloader, youtube downloader, video download, free video downloader',
  openGraph: {
    title: 'Video Downloader - Convert.Work | Free Online Video Downloads',
    description: 'Download videos from YouTube, Vimeo and other platforms for free. Fast, secure video downloader supporting multiple formats.',
    url: 'https://www.convert.work/download',
    siteName: 'Convert.Work',
    type: 'website',
  },
}

export default function DownloadVideoPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', color: 'black' }}>
      <Navigation />

      <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', paddingTop: '100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Video Downloader</h1>
          <p style={{ color: '#666' }}>Download videos from YouTube, Vimeo and other platforms</p>
        </div>

        <div style={{ backgroundColor: '#f8f9fa', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <i className="fas fa-download" style={{ fontSize: '3rem', color: '#007bff', marginBottom: '1rem' }}></i>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>How to Download Videos</h2>
            <p style={{ color: '#666' }}>Simply paste the video URL and click download</p>
          </div>

          <div style={{ backgroundColor: '#e3f2fd', border: '1px solid #bbdefb', padding: '1rem', borderRadius: '4px', marginBottom: '2rem' }}>
            <h3 style={{ color: '#1976d2', marginBottom: '0.5rem' }}>
              <i className="fas fa-info-circle" style={{ marginRight: '0.5rem' }}></i>
              Note
            </h3>
            <p style={{ color: '#1976d2', fontSize: '0.9rem' }}>
              For video downloading functionality, please use our main <a href="/" style={{ color: '#1976d2', textDecoration: 'underline' }}>file converter tool</a> and select the "Download Media" option.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <i className="fas fa-copy" style={{ fontSize: '2rem', color: '#4caf50', marginBottom: '0.5rem' }}></i>
              <h4 style={{ marginBottom: '0.25rem' }}>1. Copy URL</h4>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>Copy the video URL from your browser</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <i className="fas fa-paste" style={{ fontSize: '2rem', color: '#2196f3', marginBottom: '0.5rem' }}></i>
              <h4 style={{ marginBottom: '0.25rem' }}>2. Paste Here</h4>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>Paste the URL in the converter</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <i className="fas fa-download" style={{ fontSize: '2rem', color: '#ff9800', marginBottom: '0.5rem' }}></i>
              <h4 style={{ marginBottom: '0.25rem' }}>3. Download</h4>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>Choose format and download</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
