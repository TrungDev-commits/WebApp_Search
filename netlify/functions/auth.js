const crypto = require('crypto')

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production'
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID

function base64url(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function createToken(payload) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const encodedHeader = base64url(JSON.stringify(header))
  const encodedPayload = base64url(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000) }))
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

async function verifyGoogleToken(credential) {
  const verifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
  const res = await fetch(verifyUrl)

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Google token verification failed: ${text}`)
  }

  const payload = await res.json()

  if (payload.aud !== GOOGLE_CLIENT_ID) {
    throw new Error('Token audience mismatch - wrong Client ID')
  }

  return payload
}

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ message: 'Method not allowed' }) }
  }

  try {
    const { credential } = JSON.parse(event.body)
    if (!credential) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: 'Missing credential' }) }
    }

    const payload = await verifyGoogleToken(credential)

    const user = {
      sub: payload.sub,
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    }

    const token = createToken(user)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ user, token }),
    }
  } catch (error) {
    console.error('Auth error:', error)
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ message: 'Authentication failed: ' + error.message }),
    }
  }
}
