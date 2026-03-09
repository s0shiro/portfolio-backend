import { Router } from 'express'
import { requireRole } from '../lib/auth-middleware.ts'
import {
  createExperienceHandler,
  createMessageHandler,
  createProjectHandler,
  deleteExperienceHandler,
  deleteMessageHandler,
  deleteProjectHandler,
  getExperiencesHandler,
  getMessagesHandler,
  getProjectsHandler,
  markMessageReadHandler,
  markMessageUnreadHandler,
  reorderExperiencesHandler,
  reorderProjectsHandler,
  updateExperienceHandler,
  updateProjectHandler,
} from '../controllers/admin.controller.ts'

export const adminRouter = Router()

// Projects
adminRouter.get(
  '/projects',
  requireRole(['admin', 'editor']),
  getProjectsHandler,
)
adminRouter.post(
  '/projects',
  requireRole(['admin', 'editor']),
  createProjectHandler,
)
adminRouter.patch(
  '/projects/reorder',
  requireRole(['admin', 'editor']),
  reorderProjectsHandler,
)
adminRouter.patch(
  '/projects/:id',
  requireRole(['admin', 'editor']),
  updateProjectHandler,
)
adminRouter.delete(
  '/projects/:id',
  requireRole(['admin', 'editor']),
  deleteProjectHandler,
)

// Experiences
adminRouter.get(
  '/experiences',
  requireRole(['admin', 'editor']),
  getExperiencesHandler,
)
adminRouter.post(
  '/experiences',
  requireRole(['admin', 'editor']),
  createExperienceHandler,
)
adminRouter.patch(
  '/experiences/reorder',
  requireRole(['admin', 'editor']),
  reorderExperiencesHandler,
)
adminRouter.patch(
  '/experiences/:id',
  requireRole(['admin', 'editor']),
  updateExperienceHandler,
)
adminRouter.delete(
  '/experiences/:id',
  requireRole(['admin', 'editor']),
  deleteExperienceHandler,
)

// Messages
adminRouter.get('/messages', requireRole(['admin']), getMessagesHandler)
adminRouter.post('/messages', requireRole(['admin']), createMessageHandler)
adminRouter.patch(
  '/messages/:id/read',
  requireRole(['admin']),
  markMessageReadHandler,
)
adminRouter.patch(
  '/messages/:id/unread',
  requireRole(['admin']),
  markMessageUnreadHandler,
)
adminRouter.delete(
  '/messages/:id',
  requireRole(['admin']),
  deleteMessageHandler,
)
