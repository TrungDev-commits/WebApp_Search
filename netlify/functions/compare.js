const { MongoClient } = require('mongodb')
const OpenAI = require('openai')

const MONGODB_URI = process.env.MONGODB_URI
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.DEEPSEEK_API_KEY
const DB_NAME = 'auto-timkiem-sosanh'

let mongoClient = null

async function getMongoClient() {
  if (!MONGODB_URI) return null
  if (!mongoClient) {
    mongoClient = new MongoClient(MONGODB_URI)
    await mongoClient.connect()
  }
  return mongoClient
}

function detectCategory(text) {
  const roomKeywords = ['phòng trọ', 'nhà trọ', 'thuê', 'căn hộ', 'studio', 'chung cư', 'm2', 'm²']
  const techKeywords = ['bàn phím', 'laptop', 'máy tính', 'pc', 'màn hình', 'tai nghe', 'chuột']

  const lower = text.toLowerCase()
  const roomScore = roomKeywords.filter((k) => lower.includes(k)).length
  const techScore = techKeywords.filter((k) => lower.includes(k)).length

  if (roomScore > techScore) return 'room'
  if (techScore > roomScore) return 'tech'
  return 'other'
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
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' }),
    }
  }

  try {
    const { text, searchQuery } = JSON.parse(event.body)

    if (!text) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Vui lòng nhập nội dung' }),
      }
    }

    if (!OPENROUTER_API_KEY) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: 'Thiếu API key cho AI. Vui lòng cấu hình OPENROUTER_API_KEY hoặc DEEPSEEK_API_KEY trong .env.local',
          note: 'Cần có API key để sử dụng AI',
        }),
      }
    }

    const deepseek = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: OPENROUTER_API_KEY,
      defaultHeaders: {
        'HTTP-Referer': 'https://auto-timkiem-sosanh.netlify.app',
        'X-Title': 'Auto Tìm Kiếm So Sánh',
      },
    })

    let items = []

    const systemPrompt = `Bạn là một trợ lý AI chuyên phân tích dữ liệu mua sắm và thuê phòng trọ. Nhiệm vụ của bạn là đọc các đoạn văn bản mô tả thô dưới đây (hoặc nội dung cào từ link) và trích xuất thông tin thành một mảng JSON cấu trúc chuẩn. Tuyệt đối không trả thêm bất kỳ lời thoại nào ngoài JSON.`

    const userPrompt = `Hãy phân tích các thông tin phòng trọ/đồ công nghệ sau đây:
${text}

Trả về định dạng JSON theo đúng cấu trúc sau:
{
  "items": [
    {
      "name": "Tên phòng hoặc tên sản phẩm",
      "price": (chỉ lấy số nguyên),
      "location": "Địa chỉ hoặc nơi bán",
      "features": ["tiện ích 1", "tiện ích 2"],
      "pros": "Ưu điểm nổi bật nhất",
      "cons": "Nhược điểm lớn nhất",
      "aiRating": (điểm số từ 1 đến 10 dựa trên độ ngon so với giá tiền),
      "aiComment": "Đánh giá ngắn gọn của AI"
    }
  ]
}`

    try {
      const completion = await deepseek.chat.completions.create({
        model: 'deepseek/deepseek-v4-flash:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      })

      const content = completion.choices[0]?.message?.content
      if (content) {
        const parsed = JSON.parse(content)
        items = parsed.items || []
      }
    } catch (aiError) {
      console.error('DeepSeek API error:', aiError.message)
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({
          message: 'AI không phản hồi. Vui lòng thử lại sau.',
          error: aiError.message,
          searchQuery: searchQuery || text.slice(0, 100),
          category: detectCategory(text),
        }),
      }
    }

    if (items.length === 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'AI không thể trích xuất thông tin từ nội dung bạn cung cấp.',
          searchQuery: searchQuery || text.slice(0, 100),
          category: detectCategory(text),
          items: [],
        }),
      }
    }

    const doc = {
      searchQuery: searchQuery || text.slice(0, 100),
      category: detectCategory(text),
      createdAt: new Date(),
      items,
    }

    let savedId = null

    try {
      const client = await getMongoClient()
      if (client) {
        const db = client.db(DB_NAME)
        const collection = db.collection('comparisons')
        const result = await collection.insertOne(doc)
        savedId = result.insertedId
      }
    } catch (dbError) {
      console.error('MongoDB error:', dbError.message)
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ _id: savedId, ...doc }),
    }
  } catch (error) {
    console.error('Compare error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Lỗi server: ' + error.message,
      }),
    }
  }
}
