import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const targetFormat = formData.get('targetFormat') as string
    
    if (!file) {
      return NextResponse.json({ 
        success: false,
        error: 'No file provided' 
      }, { status: 400 })
    }

    // Simulate conversion for demo purposes
    // In production, implement actual conversion logic
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate processing time
    
    // For demo, just return the original file with new extension
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Return the file directly
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="converted.${targetFormat}"`,
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Conversion error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Conversion failed. Please try again.' 
    }, { status: 500 })
  }
}