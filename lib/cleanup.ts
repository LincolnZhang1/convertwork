import fs from 'fs'
import path from 'path'
import os from 'os'

// Clean up temp files older than 24 hours
function cleanupTempFiles() {
  const tempDir = '/tmp'
  const maxAge = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  
  console.log('Starting cleanup of temp files...')
  
  if (!fs.existsSync(tempDir)) {
    console.log('Temp directory does not exist')
    return
  }
  
  const files = fs.readdirSync(tempDir)
  let deletedCount = 0
  let totalSize = 0
  
  files.forEach((file: string) => {
    const filePath = path.join(tempDir, file)
    const stats = fs.statSync(filePath)
    const now = Date.now()
    
    if (now - stats.mtime.getTime() > maxAge) {
      const fileSize = stats.size
      try {
        fs.unlinkSync(filePath)
        deletedCount++
        totalSize += fileSize
        console.log(`Deleted: ${file} (${(fileSize / 1024).toFixed(2)} KB)`)
      } catch (error) {
        console.error(`Failed to delete ${file}:`, error instanceof Error ? error.message : String(error))
      }
    }
  })
  
  console.log(`Cleanup complete. Deleted ${deletedCount} files, freed ${(totalSize / 1024 / 1024).toFixed(2)} MB`)
}

// Also clean up system temp directory
function cleanupSystemTemp() {
  const systemTemp = os.tmpdir()
  const maxAge = 1 * 60 * 60 * 1000 // 1 hour for system temp
  
  console.log('Starting cleanup of system temp files...')
  
  try {
    const files = fs.readdirSync(systemTemp)
    let deletedCount = 0
    
    files.forEach(file => {
      if (file.startsWith('tmp-') || file.includes('anyconvert')) {
        const filePath = path.join(systemTemp, file)
        try {
          const stats = fs.statSync(filePath)
          const now = Date.now()
          
          if (now - stats.mtime.getTime() > maxAge) {
            fs.unlinkSync(filePath)
            deletedCount++
            console.log(`Deleted system temp file: ${file}`)
          }
        } catch (error) {
          // Ignore errors for files we can't access
        }
      }
    })
    
    console.log(`System temp cleanup complete. Deleted ${deletedCount} files`)
  } catch {
    console.log('System temp cleanup failed: Unknown error')
  }
}

export { cleanupTempFiles, cleanupSystemTemp }

// Run cleanup if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  cleanupTempFiles()
  cleanupSystemTemp()
}