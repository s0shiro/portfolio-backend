import type { NextFunction, Request, Response } from 'express'
import * as portfolioService from '../services/portfolio.service.ts'

export async function getProjectsHandler(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await portfolioService.fetchPortfolioProjects()
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export async function getExperiencesHandler(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await portfolioService.fetchPortfolioExperiences()
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}
