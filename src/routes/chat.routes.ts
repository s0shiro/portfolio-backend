// src/routes/chat.routes.ts
import { Router } from 'express'
import { chatController } from '../controllers/chat.controller.js'
import { createPublicRateLimit } from '../lib/rate-limit.js'

export const chatRoutes = Router()

// Strict rate limit for AI Chat to prevent API cost abuse:
// Max 15 messages per 1 minute window per IP
const chatRateLimit = createPublicRateLimit({
  maxRequests: 15,
  windowMs: 60 * 1000,
  errorMessage:
    'Whoa there! You are sending messages too fast. Please wait a minute and try again.',
})

chatRoutes.post('/', chatRateLimit, chatController.processChat)
