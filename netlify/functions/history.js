const { MongoClient, ObjectId } = require('mongodb')
const crypto = require('crypto')

const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = 'auto-timkiem-sosanh'
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production'

let client = null

async function getClient() {
  if (!client) {
    client = new MongoClient(MONGODB_URI)
    await client.connect()
  }
  return client
}

function verifyToken(token) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${parts[0]}.${parts[1]}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
    if (parts[2] !== expectedSig) return null
    return payload
  } catch {
    return null
  }
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

  const authHeader = event.headers?.authorization || event.headers?.Authorization
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  const user = token ? verifyToken(token) : null

  try {
    const mongoClient = await getClient()
    const db = mongoClient.db(DB_NAME)
    const collection = db.collection('comparisons')

    const id = event.queryStringParameters?.id

    if (event.httpMethod === 'GET') {
      if (id) {
        const doc = await collection.findOne({ _id: new ObjectId(id) })
        if (!doc) {
          return { statusCode: 404, headers, body: JSON.stringify({ message: 'Không tìm thấy' }) }
        }
        return { statusCode: 200, headers, body: JSON.stringify(doc) }
      }

      const query = user && user.sub ? { 'user.sub': user.sub } : {}
      const docs = await collection
        .find(query)
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray()

      return { statusCode: 200, headers, body: JSON.stringify(docs) }
    }

    if (event.httpMethod === 'DELETE') {
      if (!id) {
        return { statusCode: 400, headers, body: JSON.stringify({ message: 'Thiếu ID' }) }
      }

      const doc = await collection.findOne({ _id: new ObjectId(id) })
      if (!doc) {
        return { statusCode: 404, headers, body: JSON.stringify({ message: 'Không tìm thấy' }) }
      }

      await collection.deleteOne({ _id: new ObjectId(id) })
      return { statusCode: 200, headers, body: JSON.stringify({ message: 'Đã xóa' }) }
    }

    return { statusCode: 405, headers, body: JSON.stringify({ message: 'Method not allowed' }) }
  } catch (error) {
    console.error('History error:', error)
    return { statusCode: 500, headers, body: JSON.stringify({ message: 'Internal server error' }) }
  }
}
