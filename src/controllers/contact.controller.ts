import type { Request, Response, NextFunction } from 'express'
import * as contactService from '../services/contact.service.ts'

export async function createContactMessage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await contactService.createContactMessage(req.body)
    res.status(201).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}
