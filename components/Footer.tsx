'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Convert.Work</h3>
          <p>
            Free online file converter supporting 200+ formats. Convert documents, images, audio, video, and more securely and privately.
          </p>
          <div className="footer-links">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
          </div>
        </div>
        
        <div className="footer-section">
          <h3>Features</h3>
          <ul className="feature-list">
            <li>
              <Link href="/documents" className="hover:text-primary transition-colors">
                <i className="fas fa-file-alt"></i>
                Document Conversion
              </Link>
            </li>
            <li>
              <Link href="/images" className="hover:text-primary transition-colors">
                <i className="fas fa-image"></i>
                Image Conversion
              </Link>
            </li>
            <li>
              <Link href="/videos" className="hover:text-primary transition-colors">
                <i className="fas fa-video"></i>
                Video Conversion
              </Link>
            </li>
            <li>
              <Link href="/audio" className="hover:text-primary transition-colors">
                <i className="fas fa-music"></i>
                Audio Conversion
              </Link>
            </li>
            <li>
              <Link href="/ebooks" className="hover:text-primary transition-colors">
                <i className="fas fa-book"></i>
                Ebook Conversion
              </Link>
            </li>
            <li>
              <Link href="/archives" className="hover:text-primary transition-colors">
                <i className="fas fa-file-archive"></i>
                Archive Tools
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Legal</h3>
          <div className="footer-links" style={{ flexDirection: 'column', gap: '0.5rem' }}>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
        
        <div className="footer-section">
          <h3>Creator</h3>
          <div className="creator-info">
            <div className="creator-avatar">
              <i className="fas fa-code"></i>
            </div>
            <div>
              <strong>Convert.Work Team</strong>
              <span>Building free tools for everyone</span>
              <div className="social-links">
                <a href="https://github.com" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-github"></i> GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2024 Convert.work. All rights reserved.</p>
      </div>
    </footer>
  )
}