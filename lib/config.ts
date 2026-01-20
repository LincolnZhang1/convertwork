// Configuration utilities for the application

export interface AppConfig {
  maxFileSize: number
  fileExpireHours: number
}

/**
 * Get application configuration from environment variables
 */
export function getAppConfig(): AppConfig {
  return {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE_MB || '100') * 1024 * 1024,
    fileExpireHours: parseInt(process.env.FILE_EXPIRE_HOURS || '24')
  }
}