import { Buffer } from 'buffer'

export async function handler(event, context) {
  try {
    const { httpMethod, body, headers } = event
    
    if (httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Method not allowed' })
      }
    }

    // Parse form data
    const contentType = headers['content-type'] || ''
    let file = null
    let targetFormat = ''

    if (contentType.includes('multipart/form-data')) {
      // For form data, extract targetFormat from the multipart data
      const boundary = contentType.split('boundary=')[1]
      const parts = body.split(`--${boundary}`)
      
      for (const part of parts) {
        if (part.includes('name="targetFormat"')) {
          const lines = part.split('\r\n')
          targetFormat = lines[lines.length - 1].trim()
        }
        if (part.includes('name="file"')) {
          file = Buffer.from(part.split('\r\n\r\n')[1].split('\r\n')[0], 'binary')
        }
      }
    }

    if (!file) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'No file provided' })
      }
    }

    // Simulate conversion
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Return the file directly
    const fileName = `converted.${targetFormat || 'pdf'}`
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-cache',
      },
      body: file.toString('base64'),
      isBase64Encoded: true
    }
  } catch (error) {
    console.error('Conversion error:', error)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: false,
        error: 'Conversion failed. Please try again.' 
      })
    }
  }
}