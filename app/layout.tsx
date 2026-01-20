import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Convert.Work - Free Online File Converter | 200+ Formats Supported',
  description: 'Convert files online for free. Support 200+ formats including documents, images, audio, video, and archives. No registration required.',
  keywords: 'file converter, format converter, online converter, PDF converter, image converter, video converter, audio converter, document converter, free file conversion',
  authors: [{ name: 'Convert.Work Team' }],
  creator: 'Convert.Work',
  publisher: 'Convert.Work',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.convert.work'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Convert.Work - Free Online File Converter | 200+ Formats Supported',
    description: 'Convert files online for free. Support 200+ formats including documents, images, audio, video, and archives.',
    url: 'https://www.convert.work',
    siteName: 'Convert.Work',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Convert.Work - Free Online File Converter',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Convert.Work - Free Online File Converter | 200+ Formats Supported',
    description: 'Convert files online for free. Support 200+ formats including documents, images, audio, video, ebooks, archives, spreadsheets & presentations.',
    images: ['/og-image.jpg'],
    creator: '@convertwork',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="canonical" href="https://www.convert.work/" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/img_8818.png" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#667eea" />
        <meta name="msapplication-TileColor" content="#667eea" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Convert.Work",
              "description": "Free online file converter supporting 200+ formats including documents, images, audio, video, ebooks, archives, spreadsheets & presentations.",
              "url": "https://www.convert.work",
              "applicationCategory": "Utility",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "Convert.Work Team"
              },
              "featureList": [
                "Document conversion (PDF, DOC, DOCX, TXT, HTML)",
                "Image conversion (JPG, PNG, GIF, WebP, BMP, TIFF, SVG)",
                "Audio conversion (MP3, WAV, FLAC, AAC, OGG)",
                "Video conversion (MP4, AVI, MKV, MOV, WebM)",
                "Ebook conversion (EPUB, MOBI, AZW, FB2)",
                "Archive creation and extraction (ZIP, TAR)",
                "Spreadsheet conversion (XLS, XLSX, CSV, ODS)",
                "Presentation conversion (PPT, PPTX, ODP)"
              ]
            })
          }}
        />
      </head>
      <body>
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8961908805253917" crossOrigin="anonymous" strategy="beforeInteractive" />
        {children}
        <Footer />
      </body>
    </html>
  )
}
