import { and, asc, desc, eq, ilike, inArray, SQL } from 'drizzle-orm'
import { db } from '../db/connection.ts'
import { user } from '../db/auth-schema.ts'
import { experiences, messages, projects } from '../db/schema.ts'

export type InsertProjectInput = typeof projects.$inferInsert
export type UpdateProjectInput = Partial<InsertProjectInput>
export type InsertExperienceInput = typeof experiences.$inferInsert
export type UpdateExperienceInput = Partial<InsertExperienceInput>
export type InsertMessageInput = typeof messages.$inferInsert

const projectColumns = {
  id: projects.id,
  title: projects.title,
  description: projects.description,
  link: projects.link,
  imageUrl: projects.imageUrl,
  tags: projects.tags,
  orderIndex: projects.orderIndex,
  createdAt: projects.createdAt,
  updatedAt: projects.updatedAt,
}

const experienceColumns = {
  id: experiences.id,
  company: experiences.company,
  role: experiences.role,
  startDate: experiences.startDate,
  endDate: experiences.endDate,
  description: experiences.description,
  employmentType: experiences.employmentType,
  skills: experiences.skills,
  orderIndex: experiences.orderIndex,
  createdAt: experiences.createdAt,
  updatedAt: experiences.updatedAt,
}

const messageColumns = {
  id: messages.id,
  name: messages.name,
  email: messages.email,
  body: messages.body,
  isRead: messages.isRead,
  createdAt: messages.createdAt,
}

const userColumns = {
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  emailVerified: user.emailVerified,
  image: user.image,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
}

export async function adminCreateProject(data: InsertProjectInput) {
  const [project] = await db
    .insert(projects)
    .values(data)
    .returning(projectColumns)
  return project
}

export async function adminGetProjects() {
  return db
    .select(projectColumns)
    .from(projects)
    .orderBy(asc(projects.orderIndex), desc(projects.createdAt))
}

export async function adminGetProjectById(id: string) {
  const [project] = await db
    .select(projectColumns)
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1)
  return project
}

export async function adminUpdateProject(id: string, data: UpdateProjectInput) {
  const [project] = await db
    .update(projects)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id))
    .returning(projectColumns)
  return project
}

export async function adminDeleteProject(id: string) {
  const [project] = await db
    .delete(projects)
    .where(eq(projects.id, id))
    .returning(projectColumns)
  return project
}

export async function adminReorderProjects(
  updates: Array<{ id: string; orderIndex: number }>,
) {
  let hasMissing = false
  await db.transaction(async (tx) => {
    for (const update of updates) {
      const result = await tx
        .update(projects)
        .set({ orderIndex: update.orderIndex, updatedAt: new Date() })
        .where(eq(projects.id, update.id))
        .returning({ id: projects.id })

      if (result.length === 0) {
        hasMissing = true
      }
    }
  })

  if (hasMissing) return null

  const ids = updates.map((update) => update.id)
  return db
    .select(projectColumns)
    .from(projects)
    .where(inArray(projects.id, ids))
    .orderBy(asc(projects.orderIndex), desc(projects.updatedAt))
}

export async function adminCreateExperience(data: InsertExperienceInput) {
  const [experience] = await db
    .insert(experiences)
    .values(data)
    .returning(experienceColumns)
  return experience
}

export async function adminGetExperiences() {
  return db
    .select(experienceColumns)
    .from(experiences)
    .orderBy(asc(experiences.orderIndex), desc(experiences.startDate))
}

export async function adminUpdateExperience(
  id: string,
  data: UpdateExperienceInput,
) {
  const [experience] = await db
    .update(experiences)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(experiences.id, id))
    .returning(experienceColumns)
  return experience
}

export async function adminDeleteExperience(id: string) {
  const [experience] = await db
    .delete(experiences)
    .where(eq(experiences.id, id))
    .returning(experienceColumns)
  return experience
}

export async function adminReorderExperiences(
  updates: Array<{ id: string; orderIndex: number }>,
) {
  let hasMissing = false
  await db.transaction(async (tx) => {
    for (const update of updates) {
      const result = await tx
        .update(experiences)
        .set({ orderIndex: update.orderIndex, updatedAt: new Date() })
        .where(eq(experiences.id, update.id))
        .returning({ id: experiences.id })

      if (result.length === 0) {
        hasMissing = true
      }
    }
  })

  if (hasMissing) return null

  const ids = updates.map((update) => update.id)
  return db
    .select(experienceColumns)
    .from(experiences)
    .where(inArray(experiences.id, ids))
    .orderBy(asc(experiences.orderIndex), desc(experiences.updatedAt))
}

export async function adminGetMessages(filters?: {
  isRead?: boolean
  search?: string
}) {
  const conditions: SQL[] = []

  if (filters?.isRead !== undefined) {
    conditions.push(eq(messages.isRead, filters.isRead))
  }

  if (filters?.search) {
    conditions.push(ilike(messages.body, `%${filters.search}%`))
  }

  return db
    .select(messageColumns)
    .from(messages)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(messages.createdAt))
}

export async function adminCreateMessage(data: InsertMessageInput) {
  const [msg] = await db.insert(messages).values(data).returning(messageColumns)
  return msg
}

export async function adminUpdateMessageReadStatus(
  id: string,
  isRead: boolean,
) {
  const [msg] = await db
    .update(messages)
    .set({ isRead })
    .where(eq(messages.id, id))
    .returning(messageColumns)
  return msg
}

export async function adminDeleteMessage(id: string) {
  const [msg] = await db
    .delete(messages)
    .where(eq(messages.id, id))
    .returning(messageColumns)
  return msg
}
