const fs = require('fs')
const path = require('path')

// Get all pages from the app directory
function getAllPages(dir, basePath = '') {
  const pages = []
  const items = fs.readdirSync(dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      // Check if this directory has a page.tsx
      const pageFile = path.join(fullPath, 'page.tsx')
      if (fs.existsSync(pageFile)) {
        const route = basePath + '/' + item
        pages.push(route === '/page' ? '/' : route)
      }

      // Recursively check subdirectories
      pages.push(...getAllPages(fullPath, basePath + '/' + item))
    }
  }

  return pages
}

// Generate sitemap XML
function generateSitemap() {
  const appDir = path.join(__dirname, 'app')
  const pages = getAllPages(appDir)

  // Filter out API routes and special pages
  const publicPages = pages.filter(page =>
    !page.startsWith('/api') &&
    !page.includes('/_') &&
    page !== '/not-found'
  )

  const currentDate = new Date().toISOString().split('T')[0]

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

  // Add main pages with appropriate priorities
  const mainPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/contact', priority: '0.8', changefreq: 'monthly' },
    { url: '/privacy', priority: '0.7', changefreq: 'monthly' },
    { url: '/terms', priority: '0.7', changefreq: 'monthly' },
    { url: '/blog', priority: '0.9', changefreq: 'daily' },
  ]

  // Add conversion category pages
  const categoryPages = [
    '/documents', '/images', '/videos', '/audio', '/archives', '/ebooks'
  ].map(url => ({ url, priority: '0.9', changefreq: 'weekly' }))

  // Add tool pages
  const toolPages = [
    '/merge-pdf', '/url-to-markdown', '/convert-pdf-to-word', '/convert-word-to-pdf'
  ].map(url => ({ url, priority: '0.8', changefreq: 'weekly' }))

  // Add blog pages
  const blogPages = publicPages
    .filter(page => page.startsWith('/blog/'))
    .map(url => ({ url, priority: '0.7', changefreq: 'monthly' }))

  const allPages = [...mainPages, ...categoryPages, ...toolPages, ...blogPages]

  for (const page of allPages) {
    sitemap += '  <url>\n'
    sitemap += `    <loc>https://www.convert.work${page.url}</loc>\n`
    sitemap += `    <lastmod>${currentDate}</lastmod>\n`
    sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`
    sitemap += `    <priority>${page.priority}</priority>\n`
    sitemap += '  </url>\n'
  }

  sitemap += '</urlset>'

  // Write to public/sitemap.xml
  const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml')
  fs.writeFileSync(sitemapPath, sitemap, 'utf8')

  console.log(`Sitemap generated with ${allPages.length} pages`)
  console.log('Pages included:')
  allPages.forEach(page => console.log(`  ${page.url}`))
}

// Run the generator
generateSitemap()