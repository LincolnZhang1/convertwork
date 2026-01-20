/**
 * CRITICAL WARNING: In-Memory Rate Limiting Implementation
 *
 * This rate limiting uses an in-memory Map for storage, which has severe limitations
 * in serverless/Vercel environments:
 *
 * LIMITATIONS:
 * 1. Serverless functions are stateless - each invocation may have a fresh instance
 * 2. Multiple concurrent instances don't share memory - rate limits won't be enforced across instances
 * 3. Function cold starts reset all rate limit data
 * 4. This provides NO RELIABLE rate limiting in production Vercel deployments
 *
 * RECOMMENDED SOLUTIONS FOR PRODUCTION:
 * - Use Vercel KV (Redis-based key-value store)
 * - Use Upstash Redis
 * - Use a dedicated rate-limiting service (e.g., Arcjet, Unkey)
 * - Implement edge-based rate limiting with Vercel Edge Config
 *
 * This implementation is suitable ONLY for:
 * - Local development
 * - Single-instance deployments
 * - Testing purposes
 */

interface RateLimitRecord {
  dailyCount: number
  hourlyCount: number
  lastResetDate: string
  lastResetHour: number
}

const rateLimitStore = new Map<string, RateLimitRecord>()

const MAX_CONVERTS_PER_DAY = parseInt(process.env.MAX_CONVERTS_PER_DAY || '25')
const MAX_CONVERTS_PER_HOUR = parseInt(process.env.MAX_CONVERTS_PER_HOUR || '5')

export function checkRateLimit(ip: string): { allowed: boolean; message?: string } {
  const now = new Date()
  const currentDate = now.toISOString().split('T')[0]
  const currentHour = now.getHours()

  let record = rateLimitStore.get(ip)

  if (!record) {
    record = {
      dailyCount: 0,
      hourlyCount: 0,
      lastResetDate: currentDate,
      lastResetHour: currentHour,
    }
    rateLimitStore.set(ip, record)
  }

  // 重置每日计数
  if (record.lastResetDate !== currentDate) {
    record.dailyCount = 0
    record.lastResetDate = currentDate
  }

  // 重置每小时计数
  if (record.lastResetHour !== currentHour) {
    record.hourlyCount = 0
    record.lastResetHour = currentHour
  }

  // 检查限制
  if (record.dailyCount >= MAX_CONVERTS_PER_DAY) {
    return {
      allowed: false,
      message: `已达到每日转换次数限制（${MAX_CONVERTS_PER_DAY} 次），请明天再试`,
    }
  }

  if (record.hourlyCount >= MAX_CONVERTS_PER_HOUR) {
    return {
      allowed: false,
      message: `已达到每小时转换次数限制（${MAX_CONVERTS_PER_HOUR} 次），请稍后再试`,
    }
  }

  // 增加计数
  record.dailyCount++
  record.hourlyCount++
  rateLimitStore.set(ip, record)

  return { allowed: true }
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfIP = request.headers.get('cf-connecting-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIP) {
    return realIP
  }
  if (cfIP) {
    return cfIP
  }
  return 'unknown'
}
