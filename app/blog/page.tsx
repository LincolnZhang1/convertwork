import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'Blog - Convert.Work File Conversion Tips & Guides',
  description: 'Learn file conversion tips, guides, and best practices. Discover how to convert documents, images, videos, and audio files online for free.',
  keywords: 'file conversion blog, convert files online, file converter tips, document conversion guide',
  openGraph: {
    title: 'Blog - Convert.Work File Conversion Tips & Guides',
    description: 'Learn file conversion tips, guides, and best practices. Discover how to convert documents, images, videos, and audio files online.',
    url: 'https://www.convert.work/blog',
    siteName: 'Convert.Work',
    type: 'website',
  },
}

interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  readTime: string
}

const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-convert-pdf-to-word-online-free',
    title: 'How to Convert PDF to Word Online Free: Complete Guide 2024',
    description: 'Learn the best methods to convert PDF files to Word documents online for free. Compare tools and get step-by-step instructions.',
    date: '2025-01-15',
    readTime: '5 min read'
  },
  {
    slug: 'best-online-file-converter-for-documents',
    title: 'Best Online File Converter for Documents: Top 10 Tools Compared',
    description: 'Discover the best online file converters for documents. Compare features, speed, and quality for PDF, Word, Excel conversions.',
    date: '2025-01-14',
    readTime: '7 min read'
  },
  {
    slug: 'convert-video-to-mp4-online-free',
    title: 'Convert Video to MP4 Online Free: Best Tools and Methods',
    description: 'Convert any video format to MP4 online for free. Learn about the best converters, quality settings, and tips for optimal results.',
    date: '2025-01-13',
    readTime: '6 min read'
  },
  {
    slug: 'online-image-converter-jpg-to-png',
    title: 'Online Image Converter JPG to PNG: Free Tools & Best Practices',
    description: 'Convert JPG to PNG online for free. Learn when to use PNG vs JPG and get the best conversion results.',
    date: '2025-01-12',
    readTime: '4 min read'
  },
  {
    slug: 'convert-audio-files-online-free',
    title: 'Convert Audio Files Online Free: MP3, WAV, FLAC Converters',
    description: 'Convert audio files online for free. Support for MP3, WAV, FLAC, AAC and more formats with high quality output.',
    date: '2025-01-11',
    readTime: '5 min read'
  },
  {
    slug: 'best-free-online-file-converter-2024',
    title: 'Best Free Online File Converter 2024: Complete Review',
    description: 'Comprehensive review of the best free online file converters in 2024. Compare features, limits, and user experience.',
    date: '2025-01-10',
    readTime: '8 min read'
  },
  {
    slug: 'how-to-convert-excel-to-pdf-online',
    title: 'How to Convert Excel to PDF Online: Step-by-Step Guide',
    description: 'Convert Excel spreadsheets to PDF online easily. Maintain formatting and get professional results.',
    date: '2025-01-09',
    readTime: '4 min read'
  },
  {
    slug: 'online-document-converter-multiple-files',
    title: 'Online Document Converter for Multiple Files: Batch Processing',
    description: 'Convert multiple documents online at once. Learn about batch processing tools and efficiency tips.',
    date: '2025-01-08',
    readTime: '6 min read'
  },
  {
    slug: 'convert-powerpoint-to-pdf-online-free',
    title: 'Convert PowerPoint to PDF Online Free: Best Methods',
    description: 'Convert PowerPoint presentations to PDF online for free. Preserve animations and formatting perfectly.',
    date: '2025-01-07',
    readTime: '5 min read'
  },
  {
    slug: 'best-online-video-converter-for-youtube',
    title: 'Best Online Video Converter for YouTube: Download & Convert',
    description: 'Convert YouTube videos to any format online. Best tools for downloading and converting YouTube content.',
    date: '2025-01-06',
    readTime: '7 min read'
  },
  {
    slug: 'convert-images-to-pdf-online-free',
    title: 'Convert Images to PDF Online Free: JPG, PNG to PDF Converter',
    description: 'Convert images to PDF online for free. Combine multiple images into single PDF documents easily.',
    date: '2025-01-05',
    readTime: '4 min read'
  },
  {
    slug: 'online-file-converter-without-registration',
    title: 'Online File Converter Without Registration: Instant Conversion',
    description: 'Convert files online without creating accounts. Fast, secure, and private file conversion services.',
    date: '2025-01-04',
    readTime: '5 min read'
  },
  {
    slug: 'how-to-convert-epub-to-pdf-online',
    title: 'How to Convert EPUB to PDF Online: Free eBook Converters',
    description: 'Convert EPUB ebooks to PDF format online for free. Maintain formatting and get readable results.',
    date: '2025-01-03',
    readTime: '4 min read'
  },
  {
    slug: 'best-free-online-converter-for-all-formats',
    title: 'Best Free Online Converter for All Formats: Universal Tool',
    description: 'Find the best universal online file converter that supports all file formats. One tool for everything.',
    date: '2025-01-02',
    readTime: '6 min read'
  },
  {
    slug: 'convert-files-online-securely-and-privately',
    title: 'Convert Files Online Securely and Privately: Privacy-First Tools',
    description: 'Convert files online with complete privacy and security. No data tracking, secure processing guaranteed.',
    date: '2025-01-01',
    readTime: '5 min read'
  }
]

export default function BlogPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', color: 'black' }}>
      <Navigation />

      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', paddingTop: '100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>File Conversion Blog</h1>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>Tips, guides, and best practices for online file conversion</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          {blogPosts.map((post) => (
            <article key={post.slug} style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              padding: '1.5rem',
              border: '1px solid #e9ecef',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}>
              <header style={{ marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                  <Link href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {post.title}
                  </Link>
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#666', marginBottom: '0.75rem' }}>
                  <time>{post.date}</time>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
              </header>

              <p style={{ color: '#666', marginBottom: '1rem', flex: '1' }}>{post.description}</p>

              <footer>
                <Link href={`/blog/${post.slug}`} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  color: '#007bff',
                  fontWeight: '500',
                  textDecoration: 'none'
                }}>
                  Read More
                  <i className="fas fa-arrow-right" style={{ marginLeft: '0.5rem', fontSize: '0.875rem' }}></i>
                </Link>
              </footer>
            </article>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            fontWeight: '600',
            borderRadius: '0.5rem',
            textDecoration: 'none'
          }}>
            <i className="fas fa-exchange-alt" style={{ marginRight: '0.5rem' }}></i>
            Start Converting Files
          </Link>
        </div>
      </main>
    </div>
  )
}