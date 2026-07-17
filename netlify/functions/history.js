const { MongoClient, ObjectId } = require('mongodb')

const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = 'auto-timkiem-sosanh'

let client = null

async function getClient() {
  if (!client) {
    client = new MongoClient(MONGODB_URI)
    await client.connect()
  }
  return client
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

      const docs = await collection
        .find({})
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray()

      return { statusCode: 200, headers, body: JSON.stringify(docs) }
    }

    if (event.httpMethod === 'DELETE') {
      if (!id) {
        return { statusCode: 400, headers, body: JSON.stringify({ message: 'Thiếu ID' }) }
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
