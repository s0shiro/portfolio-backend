import { chatRepository } from '../repositories/chat.repository.js'
import { env } from '../env.ts'

export const chatService = {
  processChat: async (message: string, sessionId?: string) => {
    let currentSessionId = sessionId

    if (!currentSessionId) {
      const newSession = await chatRepository.createSession()
      currentSessionId = newSession.id
    } else {
      const session = await chatRepository.getSession(currentSessionId)
      if (!session) {
        const newSession = await chatRepository.createSession()
        currentSessionId = newSession.id
      }
    }

    const messageType = 'conversation'

    // Save user message
    await chatRepository.createMessage(
      currentSessionId,
      'user',
      message,
      messageType,
    )

    let responseContent = ''

    if (env.DO_INFERENCE_KEY) {
      try {
        if (!env.DO_INFERENCE_URL) {
          throw new Error(
            'DO_INFERENCE_URL is not set in environment variables',
          )
        }
        const url = `${env.DO_INFERENCE_URL.replace(/\/$/, '')}/api/v1/chat/completions`

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${env.DO_INFERENCE_KEY}`,
          },
          body: JSON.stringify({
            messages: [{ role: 'user', content: message }],
            stream: false,
            include_functions_info: true,
            include_retrieval_info: true,
            include_guardrails_info: true,
            provide_citations: true,
            temperature: 0.1, // Low temperature for factual bot responses
            max_tokens: 250, // Keep responses concise
          }),
        })
        const data = (await response.json()) as {
          choices?: Array<{ message?: { content?: string } }>
        }
        responseContent =
          data?.choices?.[0]?.message?.content ||
          'I could not generate a response.'
      } catch (e) {
        responseContent = 'An error occurred while calling the AI service.'
      }
    } else {
      responseContent = 'AI service is not configured. I am a helpful bot.'
    }

    // Save assistant message
    const botMessage = await chatRepository.createMessage(
      currentSessionId,
      'assistant',
      responseContent,
      messageType,
    )

    return {
      sessionId: currentSessionId,
      message: responseContent,
      type: messageType,
    }
  },
}
