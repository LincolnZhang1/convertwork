export async function handler(event, context) {
  try {
    const { httpMethod, body } = event
    
    if (httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Method not allowed' })
      }
    }

    const { url } = JSON.parse(body)
    
    if (!url) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'No URL provided' })
      }
    }

    // For demo purposes
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: 'Video download service available',
        url: url
      })
    }
  } catch (error) {
    console.error('Download error:', error)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Download failed' })
    }
  }
}