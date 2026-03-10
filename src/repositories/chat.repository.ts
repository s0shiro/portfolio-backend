import { db } from '../db/connection.js'
import {
  botSessions,
  botMessages,
  projects,
  experiences,
} from '../db/schema.js'
import { eq } from 'drizzle-orm'

export const chatRepository = {
  createSession: async () => {
    const [session] = await db.insert(botSessions).values({}).returning()
    return session
  },

  getSession: async (id: string) => {
    return db.query.botSessions.findFirst({
      where: eq(botSessions.id, id),
    })
  },

  createMessage: async (
    sessionId: string,
    role: 'user' | 'assistant',
    content: string,
    type: 'command' | 'conversation' = 'conversation',
  ) => {
    const [message] = await db
      .insert(botMessages)
      .values({ sessionId, role, content, type })
      .returning()
    return message
  },

  getProjects: async () => {
    return db.query.projects.findMany({
      orderBy: (projects, { asc }) => [asc(projects.orderIndex)],
    })
  },

  getExperiences: async () => {
    return db.query.experiences.findMany({
      orderBy: (experiences, { asc }) => [asc(experiences.orderIndex)],
    })
  },

  getMessagesBySessionId: async (sessionId: string, limit: number = 10) => {
    return db.query.botMessages.findMany({
      where: eq(botMessages.sessionId, sessionId),
      orderBy: (botMessages, { desc }) => [desc(botMessages.createdAt)],
      limit,
    })
  },
}
