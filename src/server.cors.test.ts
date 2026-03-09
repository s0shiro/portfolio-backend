import test from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import app from './server.ts'
import { env } from '../env.ts'

function getPrimaryCorsOrigin(): string {
  const [firstOrigin] = env.CORS_ORIGIN.split(',').map((origin) =>
    origin.trim(),
  )

  if (!firstOrigin) {
    throw new Error(
      'CORS_ORIGIN must contain at least one origin for integration tests.',
    )
  }

  return firstOrigin
}

test('auth preflight responds with credentialed CORS headers', async () => {
  const origin = getPrimaryCorsOrigin()

  const response = await request(app)
    .options('/api/auth/get-session')
    .set('Origin', origin)
    .set('Access-Control-Request-Method', 'GET')

  assert.equal(response.status, 204)
  assert.equal(response.headers['access-control-allow-origin'], origin)
  assert.equal(response.headers['access-control-allow-credentials'], 'true')
})
