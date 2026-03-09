import express from 'express'
import cors from 'cors'
import type { CorsOptions } from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './lib/auth.ts'
import { env, isTest } from '../env.ts'
import { adminRouter } from './routes/admin.routes.ts'
import { portfolioRouter } from './routes/portfolio.routes.ts'
import { contactRouter } from './routes/contact.routes.ts'
import { requireAuth } from './lib/auth-middleware.ts'
import { apiErrorHandler } from './lib/error-middleware.ts'

const app = express()

const allowedOrigins = env.CORS_ORIGIN.split(',')
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0)

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Non-browser requests (e.g. curl, health checks) may not send an Origin header.
    if (!origin) {
      callback(null, true)
      return
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
      return
    }

    callback(new Error(`Origin not allowed by CORS: ${origin}`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(helmet())
app.use(cors(corsOptions))
app.options('/{*splat}', cors(corsOptions))
app.use(
  morgan('dev', {
    skip: () => isTest(),
  }),
)

// Must be mounted BEFORE express.json() to avoid body parsing conflicts
app.all('/api/auth/*splat', toNodeHandler(auth))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/health', (req, res) => {
  res.json({ message: 'Hello there!' })
})

app.use('/api/contact', contactRouter)
app.use('/api/portfolio', portfolioRouter)
app.use('/api/admin', requireAuth, adminRouter)

app.use(apiErrorHandler)

export default app
