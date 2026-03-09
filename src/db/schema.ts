// Re-export Better Auth tables so drizzle-kit can generate migrations for them
export * from './auth-schema.ts'

import {
  pgTable,
  text,
  timestamp,
  boolean,
  jsonb,
  integer,
  index,
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const userRoleSchema = z.enum(['admin', 'editor'])

export const projects = pgTable(
  'projects',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: text('title').notNull(),
    description: text('description').notNull(),
    link: text('link'),
    imageUrl: text('image_url'),
    tags: jsonb('tags').$type<string[]>().default([]).notNull(),
    orderIndex: integer('order_index').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [index('projects_order_index_idx').on(table.orderIndex)],
)

export const insertProjectSchema = createInsertSchema(projects)
export const selectProjectSchema = createSelectSchema(projects)
export const createProjectBodySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  link: z.string().optional(),
  imageUrl: z.string().optional(),
  tags: z.array(z.string()).optional(),
  orderIndex: z.number().int().nonnegative().optional(),
})
export const updateProjectBodySchema = createProjectBodySchema
  .partial()
  .refine(
    (value) => Object.keys(value).length > 0,
    'At least one project field is required',
  )
export const reorderProjectsBodySchema = z.object({
  updates: z
    .array(
      z.object({
        id: z.string().uuid(),
        orderIndex: z.number().int().nonnegative(),
      }),
    )
    .min(1),
})

export const experiences = pgTable(
  'experiences',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    company: text('company').notNull(),
    role: text('role').notNull(),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date'),
    description: text('description').notNull(),
    employmentType: text('employment_type'),
    skills: jsonb('skills').$type<string[]>().default([]).notNull(),
    orderIndex: integer('order_index').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [index('experiences_order_index_idx').on(table.orderIndex)],
)

export const insertExperienceSchema = createInsertSchema(experiences)
export const selectExperienceSchema = createSelectSchema(experiences)
export const createExperienceBodySchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(),
  description: z.string().min(1),
  employmentType: z.string().optional(),
  skills: z.array(z.string()).optional(),
  orderIndex: z.number().int().nonnegative().optional(),
})
export const updateExperienceBodySchema = createExperienceBodySchema
  .partial()
  .refine(
    (value) => Object.keys(value).length > 0,
    'At least one experience field is required',
  )
export const reorderExperiencesBodySchema = z.object({
  updates: z
    .array(
      z.object({
        id: z.string().uuid(),
        orderIndex: z.number().int().nonnegative(),
      }),
    )
    .min(1),
})

export const messages = pgTable(
  'messages',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    email: text('email').notNull(),
    body: text('body').notNull(),
    isRead: boolean('is_read').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('messages_created_at_idx').on(table.createdAt),
    index('messages_is_read_idx').on(table.isRead),
  ],
)

export const insertMessageSchema = createInsertSchema(messages)
export const selectMessageSchema = createSelectSchema(messages)
export const createMessageBodySchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  body: z.string().min(1),
})
export const messageModerationFilterSchema = z.object({
  isRead: z
    .preprocess((value) => {
      if (value === 'true') {
        return true
      }

      if (value === 'false') {
        return false
      }

      return value
    }, z.boolean())
    .optional(),
  search: z.string().trim().optional(),
})

