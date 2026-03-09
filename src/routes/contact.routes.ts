import { Router } from 'express'
import { createContactMessage } from '../controllers/contact.controller.ts'
import { createPublicRateLimit } from '../lib/rate-limit.ts'

export const contactRouter = Router()

const contactRateLimit = createPublicRateLimit({
  maxRequests: 100,
  windowMs: 60_000,
  errorMessage: 'Too many contact requests. Please try again in a minute.',
})

contactRouter.post('/', contactRateLimit, createContactMessage)
