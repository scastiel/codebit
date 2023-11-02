import { env } from '@/lib/env'
import LRUCache from 'lru-cache'

export default function rateLimiter() {
  const tokenCache = new LRUCache({
    max: env.RATE_LIMIT_MAX_ITEMS_IN_CACHE,
    ttl: env.RATE_LIMIT_CACHE_ITEM_TTL_IN_MS,
  })

  return {
    check: (limit: number, token: string) => {
      const tokenCount = (tokenCache.get(token) as number[]) || [0]
      if (tokenCount[0] === 0) {
        tokenCache.set(token, tokenCount)
      }
      tokenCount[0] += 1
      const currentUsage = tokenCount[0]
      const usageExceeded = currentUsage >= limit

      const rateLimitHeaders = new Headers()
      rateLimitHeaders.set('X-RateLimit-Limit', limit.toString())
      rateLimitHeaders.set(
        'X-RateLimit-Remaining',
        isRateLimited ? '0' : (limit - currentUsage).toString(),
      )

      return {
        isRateLimited: usageExceeded,
        headers: rateLimitHeaders,
      }
    },
  }
}
