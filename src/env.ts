import { env as loadEnv } from 'custom-env'
import { z } from 'zod'

process.env.APP_STAGE = process.env.APP_STAGE || 'dev'

const isProduction = process.env.APP_STAGE === 'production'
const isDevelopment = process.env.APP_STAGE === 'dev'
const isTesting = process.env.APP_STAGE === 'test'

if (isDevelopment) {
  loadEnv()
} else if (isTesting) {
  loadEnv('test')
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  APP_STAGE: z.enum(['dev', 'test', 'production']).default('dev'),
  MAILGUN_API_KEY: z.string().optional(),
  MAILGUN_DOMAIN: z.string().optional(),
  DO_INFERENCE_KEY: z.string().optional(),
  DO_INFERENCE_URL: z.string().optional(),
  PORT: z.coerce.number().positive().default(3000),
  DATABASE_URL: z.string().startsWith('postgresql://'),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  CORS_ORIGIN: z.string().min(1).default('http://localhost:5173'),
  // Optional social provider credentials
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>
let env: Env

try {
  env = envSchema.parse(process.env)
} catch (e) {
  if (e instanceof z.ZodError) {
    console.log('Invalid env var')
    console.error(JSON.stringify(e.flatten().fieldErrors, null, 2))

    e.issues.forEach((issue) => {
      const path = issue.path.join('.') || '(root)'
      console.log(`${path}: ${issue.message}`)
    })

    process.exit(1)
  } else {
    throw e
  }
}

export const isProd = () => env.APP_STAGE === 'production'
export const isDev = () => env.APP_STAGE === 'dev'
export const isTest = () => env.APP_STAGE === 'test'

export { env }
export default env
