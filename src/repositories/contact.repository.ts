import { db } from '../db/connection.ts'
import { messages } from '../db/schema.ts'
import { HttpError } from '../lib/http-errors.ts'

export type InsertContactMessageInput = Pick<
  typeof messages.$inferInsert,
  'name' | 'email' | 'body'
>

export type ContactMessage = typeof messages.$inferSelect

const messageColumns = {
  id: messages.id,
  name: messages.name,
  email: messages.email,
  body: messages.body,
  isRead: messages.isRead,
  createdAt: messages.createdAt,
}

export async function createContactMessage(
  data: InsertContactMessageInput,
): Promise<ContactMessage> {
  const [message] = await db
    .insert(messages)
    .values(data)
    .returning(messageColumns)

  if (!message) {
    throw new HttpError(500, 'Message was not created')
  }

  return message
}
