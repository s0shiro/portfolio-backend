import { asc, desc } from 'drizzle-orm'
import { db } from '../db/connection.ts'
import { experiences, projects } from '../db/schema.ts'

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

export async function getPublicProjects() {
  return db
    .select(projectColumns)
    .from(projects)
    .orderBy(asc(projects.orderIndex), desc(projects.createdAt))
}

export async function getPublicExperiences() {
  return db
    .select(experienceColumns)
    .from(experiences)
    .orderBy(asc(experiences.orderIndex), desc(experiences.startDate))
}
