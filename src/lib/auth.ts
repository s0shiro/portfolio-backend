import { betterAuth } from 'better-auth'
import { admin } from 'better-auth/plugins'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import db from '../db/connection.ts'
import * as authSchema from '../db/auth-schema.ts'
import { env } from '../env.ts'

const authBaseUrl = new URL(env.BETTER_AUTH_URL).origin

type SocialProviders = NonNullable<
  Parameters<typeof betterAuth>[0]['socialProviders']
>

const socialProviders: SocialProviders = {}

if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
  }
}

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  }
}

const trustedOrigins = env.CORS_ORIGIN.split(',')
  .map((o) => o.trim())
  .filter((o) => o.length > 0)

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: authBaseUrl,
  trustedOrigins,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: authSchema,
  }),
  plugins: [
    admin({
      defaultRole: 'editor',
      adminRole: ['admin'], // or adminRoles if applicable, depending on version
    }),
  ],
  emailAndPassword: {
    enabled: true,
  },
  ...(Object.keys(socialProviders).length > 0 && { socialProviders }),
})

export type Session = typeof auth.$Infer.Session.session
export type User = typeof auth.$Infer.Session.user
export type AppRole = 'admin' | 'editor'
