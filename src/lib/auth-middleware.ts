import type { Request, Response, NextFunction } from 'express'
import { fromNodeHeaders } from 'better-auth/node'
import { auth } from './auth.ts'
import type { Session, User } from './auth.ts'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Locals {
      session: Session
      user: User
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const sessionData = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  })

  if (!sessionData) {
    res.status(401).json({ success: false, error: 'Unauthorized' })
    return
  }

  res.locals.session = sessionData.session
  res.locals.user = sessionData.user
  next()
}
