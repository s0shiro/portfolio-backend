import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { HttpError } from './http-errors.ts'

export function apiErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    const fieldErrors = err.flatten().fieldErrors

    res.status(400).json({
      success: false,
      error: 'Request validation failed',
      details: fieldErrors,
    })
    return
  }

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      ...(err.details ? { details: err.details } : {}),
    })
    return
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error',
  })
}
