'use client'

import { useState } from 'react'
import Link from 'next/link'

interface NavigationProps {
  activeCategory?: 'documents' | 'images' | 'videos' | 'audio' | 'archives'
  onCategoryChange?: (category: 'documents' | 'images' | 'videos' | 'audio' | 'archives') => void
}

export default function Navigation({ activeCategory, onCategoryChange }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const categories = [
    { id: 'documents', name: 'Documents', icon: 'fa-file-alt', href: '/documents' },
    { id: 'images', name: 'Images', icon: 'fa-image', href: '/images' },
    { id: 'videos', name: 'Videos', icon: 'fa-video', href: '/videos' },
    { id: 'audio', name: 'Audio', icon: 'fa-music', href: '/audio' },
    { id: 'archives', name: 'Archives', icon: 'fa-file-archive', href: '/archives' },
  ]

  const handleMenuToggle = () => {
    console.log('Menu toggle clicked, current state:', isMenuOpen)
    setIsMenuOpen(!isMenuOpen)
  }

  const handleCategoryChange = (category: 'documents' | 'images' | 'videos' | 'audio' | 'archives') => {
    onCategoryChange?.(category)
    setIsMenuOpen(false) // Close mobile menu after selection
  }

  return (
    <>
      <nav className="nav-header">
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            <div className="nav-logo-icon">
              <i className="fas fa-exchange-alt"></i>
            </div>
            Convert.Work
          </Link>
          
          <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            {categories.map((category) => (
              <div
                key={category.id}
                className={`nav-item ${activeCategory === category.id ? 'active' : ''}`}
              >
                <Link href={category.href} className="nav-link">
                  <i className={`fas ${category.icon} nav-icon`}></i>
                  {category.name}
                </Link>
              </div>
            ))}
            
            <div className="nav-item">
              <Link href="/blog" className="nav-link">
                <i className="fas fa-blog nav-icon"></i>
                Blog
              </Link>
            </div>
            
            <div className="nav-item">
              <Link href="/about" className="nav-link">
                <i className="fas fa-info-circle nav-icon"></i>
                About
              </Link>
            </div>
          </div>
          
          <div className="nav-actions">
            <button
              className="nav-menu-toggle"
              onClick={handleMenuToggle}
              aria-label="Toggle navigation menu"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
            <a href="https://github.com" className="nav-link" target="_blank" rel="noopener noreferrer" title="GitHub">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="mobile-menu-overlay"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
      
      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <h3 className="mobile-menu-title">Menu</h3>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className={`mobile-menu-item ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <i className={`fas ${category.icon} mobile-menu-icon`}></i>
              <div className="mobile-menu-text">
                <span className="mobile-menu-name">{category.name}</span>
              </div>
            </Link>
          ))}
          
          <Link href="/blog" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>
            <i className="fas fa-blog mobile-menu-icon"></i>
            <div className="mobile-menu-text">
              <span className="mobile-menu-name">Blog</span>
            </div>
          </Link>
          
          <Link href="/about" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>
            <i className="fas fa-info-circle mobile-menu-icon"></i>
            <div className="mobile-menu-text">
              <span className="mobile-menu-name">About</span>
            </div>
          </Link>
        </div>
      </div>
    </>
  )
}
