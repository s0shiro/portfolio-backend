import type { NextFunction, Request, Response } from 'express'

type RateLimitOptions = {
  maxRequests: number
  windowMs: number
  errorMessage: string
}

type RequestBucket = {
  count: number
  resetAtMs: number
}

function getClientKey(req: Request): string {
  const forwardedFor = req.headers['x-forwarded-for']

  if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
    const [firstForwardedIp] = forwardedFor.split(',')
    return firstForwardedIp?.trim() ?? req.ip ?? 'unknown'
  }

  if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
    return forwardedFor[0]?.trim() ?? req.ip ?? 'unknown'
  }

  return req.ip ?? 'unknown'
}

export function createPublicRateLimit(options: RateLimitOptions) {
  const buckets = new Map<string, RequestBucket>()

  return (req: Request, res: Response, next: NextFunction): void => {
    const nowMs = Date.now()
    const key = getClientKey(req)
    const existingBucket = buckets.get(key)

    if (!existingBucket || existingBucket.resetAtMs <= nowMs) {
      buckets.set(key, {
        count: 1,
        resetAtMs: nowMs + options.windowMs,
      })

      next()
      return
    }

    existingBucket.count += 1

    if (existingBucket.count > options.maxRequests) {
      res.status(429).json({
        success: false,
        error: options.errorMessage,
      })
      return
    }

    next()
  }
}
