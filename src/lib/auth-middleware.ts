import type { Request, Response, NextFunction } from 'express'
import { fromNodeHeaders } from 'better-auth/node'
import { auth } from './auth.ts'
import type { AppRole, Session, User } from './auth.ts'

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

export function requireRole(allowedRoles: AppRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = (res.locals.user.role ?? 'editor') as AppRole

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({ success: false, error: 'Forbidden' })
      return
    }

    next()
  }
}
