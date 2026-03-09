import { messageModerationFilterSchema, userRoleSchema } from '../db/schema.ts'
import { NotFoundError } from '../lib/http-errors.ts'
import { z } from 'zod'
import * as adminRepository from '../repositories/admin.repository.ts'

type MessageModerationFilters = z.infer<typeof messageModerationFilterSchema>
type AppRole = z.infer<typeof userRoleSchema>

export async function createProject(data: adminRepository.InsertProjectInput) {
  const project = await adminRepository.adminCreateProject(data)
  if (!project) {
    throw new NotFoundError('Project was not created')
  }
  return project
}

export async function getProjects() {
  return adminRepository.adminGetProjects()
}

export async function getProjectById(id: string) {
  const project = await adminRepository.adminGetProjectById(id)
  if (!project) {
    throw new NotFoundError('Project not found')
  }
  return project
}

export async function updateProject(
  id: string,
  data: adminRepository.UpdateProjectInput,
) {
  const project = await adminRepository.adminUpdateProject(id, data)
  if (!project) {
    throw new NotFoundError('Project not found')
  }
  return project
}

export async function deleteProject(id: string) {
  const project = await adminRepository.adminDeleteProject(id)
  if (!project) {
    throw new NotFoundError('Project not found')
  }
  return project
}

export async function reorderProjects(
  updates: Array<{ id: string; orderIndex: number }>,
) {
  const projects = await adminRepository.adminReorderProjects(updates)
  if (!projects) {
    throw new NotFoundError('One or more projects not found')
  }
  return projects
}

export async function createExperience(
  data: adminRepository.InsertExperienceInput,
) {
  const experience = await adminRepository.adminCreateExperience(data)
  if (!experience) {
    throw new NotFoundError('Experience was not created')
  }
  return experience
}

export async function getExperiences() {
  return adminRepository.adminGetExperiences()
}

export async function updateExperience(
  id: string,
  data: adminRepository.UpdateExperienceInput,
) {
  const experience = await adminRepository.adminUpdateExperience(id, data)
  if (!experience) {
    throw new NotFoundError('Experience not found')
  }
  return experience
}

export async function deleteExperience(id: string) {
  const experience = await adminRepository.adminDeleteExperience(id)
  if (!experience) {
    throw new NotFoundError('Experience not found')
  }
  return experience
}

export async function reorderExperiences(
  updates: Array<{ id: string; orderIndex: number }>,
) {
  const experiences = await adminRepository.adminReorderExperiences(updates)
  if (!experiences) {
    throw new NotFoundError('One or more experiences not found')
  }
  return experiences
}

export async function getMessages(filters?: MessageModerationFilters) {
  return adminRepository.adminGetMessages(filters)
}

export async function createMessage(data: adminRepository.InsertMessageInput) {
  const msg = await adminRepository.adminCreateMessage(data)
  if (!msg) {
    throw new NotFoundError('Message was not created')
  }
  return msg
}

export async function markMessageRead(id: string) {
  const msg = await adminRepository.adminUpdateMessageReadStatus(id, true)
  if (!msg) {
    throw new NotFoundError('Message not found')
  }
  return msg
}

export async function markMessageUnread(id: string) {
  const msg = await adminRepository.adminUpdateMessageReadStatus(id, false)
  if (!msg) {
    throw new NotFoundError('Message not found')
  }
  return msg
}

export async function deleteMessage(id: string) {
  const msg = await adminRepository.adminDeleteMessage(id)
  if (!msg) {
    throw new NotFoundError('Message not found')
  }
  return msg
}
