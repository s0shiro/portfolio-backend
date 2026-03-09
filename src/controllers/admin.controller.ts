import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import * as adminService from '../services/admin.service.ts'
import {
  createExperienceBodySchema,
  createMessageBodySchema,
  createProjectBodySchema,
  messageModerationFilterSchema,
  reorderExperiencesBodySchema,
  reorderProjectsBodySchema,
  updateExperienceBodySchema,
  updateProjectBodySchema,
  userRoleSchema,
} from '../db/schema.ts'

const uuidParamSchema = z.object({ id: z.string().uuid() })
const userParamSchema = z.object({ id: z.string().min(1) })
type AppRole = z.infer<typeof userRoleSchema>

export async function getProjectsHandler(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await adminService.getProjects()
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export async function createProjectHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsed = createProjectBodySchema.parse(req.body)
    const data = await adminService.createProject(parsed)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export async function updateProjectHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = uuidParamSchema.parse(req.params)
    const parsed = updateProjectBodySchema.parse(req.body)
    const data = await adminService.updateProject(id, parsed)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export async function deleteProjectHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = uuidParamSchema.parse(req.params)
    const data = await adminService.deleteProject(id)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export async function reorderProjectsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { updates } = reorderProjectsBodySchema.parse(req.body)
    const data = await adminService.reorderProjects(updates)
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
    const data = await adminService.getExperiences()
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export async function createExperienceHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsed = createExperienceBodySchema.parse(req.body)
    const data = await adminService.createExperience(parsed)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export async function updateExperienceHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = uuidParamSchema.parse(req.params)
    const parsed = updateExperienceBodySchema.parse(req.body)
    const data = await adminService.updateExperience(id, parsed)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export async function deleteExperienceHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = uuidParamSchema.parse(req.params)
    const data = await adminService.deleteExperience(id)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export async function reorderExperiencesHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { updates } = reorderExperiencesBodySchema.parse(req.body)
    const data = await adminService.reorderExperiences(updates)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export async function getMessagesHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const filters = messageModerationFilterSchema.parse(req.query)
    const data = await adminService.getMessages(filters)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export async function createMessageHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsed = createMessageBodySchema.parse(req.body)
    const data = await adminService.createMessage(parsed)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export async function markMessageReadHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = uuidParamSchema.parse(req.params)
    const data = await adminService.markMessageRead(id)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export async function markMessageUnreadHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = uuidParamSchema.parse(req.params)
    const data = await adminService.markMessageUnread(id)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export async function deleteMessageHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = uuidParamSchema.parse(req.params)
    const data = await adminService.deleteMessage(id)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}
