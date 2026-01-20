import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'About Convert.Work - Free Online File Converter',
  description: 'Learn about Convert.Work, your trusted free online file converter supporting 200+ formats. Convert documents, images, audio, video, and more with ease.',
  keywords: 'about convert.work, file converter about, online converter team',
  openGraph: {
    title: 'About Convert.Work - Free Online File Converter',
    description: 'Learn about Convert.Work, your trusted free online file converter supporting 200+ formats.',
    url: 'https://www.convert.work/about',
    siteName: 'Convert.Work',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', color: 'black' }}>
      <Navigation />
      <div style={{
        padding: '48px 0'
      }}>
      <div style={{
        maxWidth: '1024px',
        margin: '0 auto',
        padding: '0 16px'
      }}>
        <header style={{
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>About Convert.Work</h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#6b7280',
            maxWidth: '768px',
            margin: '0 auto'
          }}>
            Your trusted free online file converter for seamless format conversion
          </p>
        </header>

        <main style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '48px',
          paddingTop: '120px'
        }}>
          <section style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '16px'
            }}>Our Mission</h2>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.625',
              fontSize: '1.125rem'
            }}>
              Convert.Work is your trusted free online file converter that makes file format conversion simple,
              fast, and secure. We support over 200 file formats across documents, images, audio, video,
              ebooks, archives, spreadsheets, and presentations.
            </p>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.625',
              fontSize: '1.125rem',
              marginTop: '16px'
            }}>
              Our mission is to provide a free, user-friendly platform that eliminates barriers of file format compatibility.
              Whether you&apos;re a student, professional, or casual user, Convert.Work ensures you can work with any file format
              without expensive software or complex installations.
            </p>
          </section>

          <section style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '24px'
            }}>What We Offer</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#dbeafe',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '4px'
                }}>
                  <i className="fas fa-file" style={{
                    color: '#2563eb',
                    fontSize: '14px'
                  }}></i>
                </div>
                <div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '4px'
                  }}>200+ File Formats</h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '14px'
                  }}>Support for documents (PDF, DOC, DOCX), images (JPG, PNG, WebP), audio (MP3, WAV), video (MP4, AVI), and more</p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#dcfce7',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '4px'
                }}>
                  <i className="fas fa-gift" style={{
                    color: '#16a34a',
                    fontSize: '14px'
                  }}></i>
                </div>
                <div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '4px'
                  }}>Free Service</h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '14px'
                  }}>No registration required, completely free to use</p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#faf5ff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '4px'
                }}>
                  <i className="fas fa-shield-alt" style={{
                    color: '#9333ea',
                    fontSize: '14px'
                  }}></i>
                </div>
                <div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '4px'
                  }}>Secure Processing</h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '14px'
                  }}>Your files are processed securely and automatically deleted after conversion</p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#fff7ed',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '4px'
                }}>
                  <i className="fas fa-tachometer-alt" style={{
                    color: '#ea580c',
                    fontSize: '14px'
                  }}></i>
                </div>
                <div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '4px'
                  }}>Fast Conversion</h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '14px'
                  }}>Quick processing with progress tracking</p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#eef2ff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '4px'
                }}>
                  <i className="fas fa-desktop" style={{
                    color: '#4338ca',
                    fontSize: '14px'
                  }}></i>
                </div>
                <div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '4px'
                  }}>Cross-Platform</h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '14px'
                  }}>Works on any device with a web browser</p>
                </div>
              </div>
            </div>
          </section>

          <section style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '16px'
            }}>Technology</h2>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.625',
              fontSize: '1.125rem'
            }}>
              Convert.Work uses cutting-edge cloud technology to provide reliable file conversion services.
              Our platform leverages multiple conversion engines to ensure the highest quality output for your files.
            </p>
          </section>

          <section style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '16px'
            }}>Contact Us</h2>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.625',
              fontSize: '1.125rem'
            }}>
              Have questions or feedback? We&apos;d love to hear from you at{' '}
              <a href="mailto:hello@convert.work" style={{
                color: '#2563eb',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                hello@convert.work
              </a>
            </p>
          </section>
        </main>

        <footer style={{
          marginTop: '64px',
          textAlign: 'center'
        }}>
          <Link href="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '12px 32px',
            background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
            color: '#ffffff',
            fontWeight: '600',
            borderRadius: '8px',
            textDecoration: 'none',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.2s',
            transform: 'scale(1)'
          }}>
            <i className="fas fa-exchange-alt" style={{
              marginRight: '8px'
            }}></i>
            Start Converting
          </Link>
        </footer>
      </div>
    </div>
    </div>
  )
}