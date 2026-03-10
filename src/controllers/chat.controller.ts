import type { Request, Response } from 'express'
import { chatRequestSchema } from '../db/schema.js'
import { chatService } from '../services/chat.service.js'
import { z } from 'zod'

export const chatController = {
  processChat: async (req: Request, res: Response) => {
    try {
      const parsedBody = chatRequestSchema.parse(req.body)
      const { message, sessionId } = parsedBody

      const resData = await chatService.processChat(message, sessionId)

      res.status(200).json({
        success: true,
        data: resData,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.issues,
        })
        return
      }

      console.error('Chat error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to process chat message',
      })
    }
  },
}
