import { z } from 'zod'
import { createMessageBodySchema } from '../db/schema.ts'
import * as contactRepository from '../repositories/contact.repository.ts'
import { HttpError } from '../lib/http-errors.ts'

type CreateContactMessageInput = z.infer<typeof createMessageBodySchema>

export async function createContactMessage(data: unknown) {
  // Validate and normalize input
  const parsed = createMessageBodySchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpError(400, 'Invalid contact message input')
  }
  const normalized = {
    name: parsed.data.name.trim(),
    email: parsed.data.email.trim().toLowerCase(),
    body: parsed.data.body.trim(),
  }
  return contactRepository.createContactMessage(normalized)
}
