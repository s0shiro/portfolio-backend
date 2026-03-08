import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './lib/auth.ts'
import { isTest } from '../env.ts'

const app = express()
app.use(helmet())
app.use(cors())
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

export default app
