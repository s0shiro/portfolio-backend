import { Router } from 'express'
import { createPublicRateLimit } from '../lib/rate-limit.ts'
import {
  getExperiencesHandler,
  getProjectsHandler,
} from '../controllers/portfolio.controller.ts'

export const portfolioRouter = Router()

const publicRateLimit = createPublicRateLimit({
  maxRequests: 100,
  windowMs: 60 * 1000,
  errorMessage: 'Too many requests, please try again later.',
})

portfolioRouter.use(publicRateLimit)

portfolioRouter.get('/projects', getProjectsHandler)
portfolioRouter.get('/experiences', getExperiencesHandler)
