import { chatRepository } from '../repositories/chat.repository.js'
import { env } from '../env.ts'
import FormData from 'form-data'
import Mailgun from 'mailgun.js'

const mailgun = new Mailgun(FormData)
const mg = env.MAILGUN_API_KEY
  ? mailgun.client({ username: 'api', key: env.MAILGUN_API_KEY })
  : null

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

    const isCommand = message.startsWith('/')
    const messageType = isCommand ? 'command' : 'conversation'

    // Save user message
    await chatRepository.createMessage(
      currentSessionId,
      'user',
      message,
      messageType,
    )

    let responseContent = ''

    if (isCommand) {
      if (message === '/projects') {
        const projects = await chatRepository.getProjects()
        if (projects.length === 0) {
          responseContent = 'No projects are currently listed.'
        } else {
          responseContent =
            'Here are my featured projects:\n\n' +
            projects
              .map(
                (p) =>
                  `- **${p.title}**\n  ${p.description}${p.link ? `\n  [View Project](${p.link})` : ''}`,
              )
              .join('\n\n')
        }
      } else if (message === '/experience') {
        const experiences = await chatRepository.getExperiences()
        if (experiences.length === 0) {
          responseContent = 'No experience is currently listed.'
        } else {
          responseContent =
            'Here is my professional experience:\n\n' +
            experiences
              .map((e) => {
                const start = new Date(e.startDate).toLocaleDateString(
                  undefined,
                  { month: 'short', year: 'numeric' },
                )
                const end = e.endDate
                  ? new Date(e.endDate).toLocaleDateString(undefined, {
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'Present'
                return `- **${e.role}** at **${e.company}**\n  *( ${start} - ${end} )*\n  ${e.description}`
              })
              .join('\n\n')
        }
      } else if (message === '/skills') {
        responseContent = `Here are my technical skills:
- **Frontend:** JavaScript, TypeScript, ReactJS, Vue.js, Next.js, Tailwind CSS
- **Backend:** Node.js, Express.js, Laravel, REST APIs, Drizzle ORM
- **Databases:** MySQL, PostgreSQL, MongoDB, Supabase
- **Tools:** Git, GitHub, Resend, Tanstack Query`
      } else if (message === '/contact') {
        responseContent = `Want to work together? Let's connect!
You can email me directly at **mascarinas022@gmail.com** or leave your email here in the chat and I'll get back to you ASAP.`
      } else {
        responseContent =
          'Unknown command. Try /projects, /experience, /skills, or /contact.'
      }
    } else {
      // Basic Lead Capture Logic
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
      if (emailRegex.test(message)) {
        const extractedEmail = message.match(emailRegex)![0]

        // Prevent SMTP spam by checking if we already captured an email in this session
        const previousMessages = await chatRepository.getMessagesBySessionId(
          currentSessionId,
          50,
        )
        const alreadyCaptured = previousMessages.some(
          (m) =>
            m.role === 'assistant' &&
            m.content.includes("I've received your email"),
        )

        if (alreadyCaptured) {
          responseContent = `I already have your email on file! I will be in touch soon.`
        } else {
          responseContent = `I've received your email (**${extractedEmail}**)! I'll reach out to you shortly. Thanks for connecting!`

          if (mg && env.MAILGUN_DOMAIN) {
            try {
              const htmlEmail = `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px;">
                <div style="background-color: white; padding: 24px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <h2 style="color: #111827; margin-top: 0; padding-bottom: 12px; border-bottom: 2px solid #3b82f6;">
                    🚀 New Portfolio Lead
                  </h2>
                  <p style="color: #4b5563; font-size: 16px;">Your AI Chatbot just captured a new connection!</p>
                  
                  <div style="background-color: #eff6ff; padding: 16px; border-radius: 8px; margin: 24px 0;">
                    <p style="margin: 0; font-size: 14px; text-transform: uppercase; color: #1e3a8a; font-weight: bold;">Lead Email</p>
                    <p style="margin: 4px 0 0 0; font-size: 18px;">
                      <a href="mailto:${extractedEmail}" style="color: #2563eb; text-decoration: none; font-weight: bold;">${extractedEmail}</a>
                    </p>
                  </div>
                  
                  <div style="background-color: #f3f4f6; padding: 16px; border-left: 4px solid #9ca3af; border-radius: 4px;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; color: #4b5563; font-weight: bold;">Chat Context</p>
                    <p style="margin: 0; color: #1f2937; font-style: italic; line-height: 1.5;">"${message}"</p>
                  </div>
                  
                  <div style="margin-top: 32px; text-align: center;">
                    <a href="mailto:${extractedEmail}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                      Reply to Lead
                    </a>
                  </div>
                </div>
              </div>
            `

              await mg.messages.create(env.MAILGUN_DOMAIN, {
                from: `Portfolio Chatbot <mailgun@${env.MAILGUN_DOMAIN}>`,
                to: ['mascarinas022@gmail.com'],
                subject: '🔥 New Message from Portfolio Chatbot!',
                html: htmlEmail,
                text: `You have a new lead from the chatbot!\nEmail provided: ${extractedEmail}\nFull message: ${message}`,
              })
            } catch (error) {
              console.error('Mailgun error:', error)
            }
          }
        }
      } else if (env.DO_INFERENCE_KEY) {
        try {
          const url =
            env.DO_INFERENCE_URL ||
            'https://inference.do-ai.run/v1/chat/completions'

          // Fetch the last 6 messages (excluding the one just saved, but we'll limit to previous conversation)
          const pastMessagesDb = await chatRepository.getMessagesBySessionId(
            currentSessionId,
            7,
          )

          // Reverse them so they are in chronological order
          const formattedPastMessages = pastMessagesDb
            .reverse()
            .slice(0, -1) // Exclude the current user message we just saved so we don't duplicate
            .filter((m) => m.type === 'conversation') // Optional: only include conversation, not explicit commands
            .map((m) => ({
              role: m.role as 'user' | 'assistant',
              content: m.content,
            }))

          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${env.DO_INFERENCE_KEY}`,
            },
            body: JSON.stringify({
              model: 'llama3.3-70b-instruct', // Standard DO inference model, update if you chose another
              messages: [
                {
                  role: 'system',
                  content: `You are an AI persona of Neilven Mascariñas, a Full Stack Developer. You are chatting directly with visitors on your portfolio website. Always speak in the first person ("I", "my", "me") as if you are absolutely Neilven. 
CRITICAL GUARDRAIL: You must ONLY answer questions directly related to your resume, skills, experience, or projects + remeber your girlfriend. DO NOT answer general knowledge questions, define technical terms (e.g., explaining what a "bomb" or "virus" means), write code tutorials, or engage in unrelated casual chat. If a user asks something out-of-scope, politely decline it by saying "I only answer questions regarding my professional experience" and quickly pivot back to your portfolio or offer your contact email.
CRITICAL FORMATTING INSTRUCTION: You MUST use rich Markdown formatting in your responses! Use **bold** for keywords/technologies, bulleted lists (-) for skills or multiple items, and \`inline code\` for technical terms or tools. Make responses highly visual and readable.

YOUR BACKGROUND CONTEXT:
- Name: Neilven Mascariñas
- Contact: mascarinas022@gmail.com | https://github.com/s0shiro
- EXPERIENCE: Full Stack Developer Intern at Ramcar Group of Companies (486 hours). Improved Asset Inventory Management System (delivery receipt, barcode item selection).
- PROJECTS: 
  1. Crop Production Monitoring System (growsmart.app): Lead Full Stack Developer. Web app for Marinduque Provincial Agriculture Office (farmer registration, Leaflet maps, email verification).
  2. Marinduque Vehicle Rental System: Full Stack developer. Built RESTful APIs, JWT authentication, and admin dashboard.
- EDUCATION: 
  1. Bachelor of Science in Information Technology (Marinduque State University)
  2. STEM with High Honors (Bangbang National High School)
- SKILLS: 
  Frontend: JavaScript, TypeScript, ReactJS, Vue.js, Next.js, Tailwind CSS
  Backend: Node.js, Express.js, Laravel, REST APIs, Drizzle ORM
  Databases: MySQL, PostgreSQL, MongoDB, Supabase
  Tools: Git, Resend, Tanstack Query
-LOVELIFE:
  Girlfriend: Cindy Rosales.💖`,
                },
                ...formattedPastMessages,
                { role: 'user', content: message },
              ],
              max_tokens: 250,
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
