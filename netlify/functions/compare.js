const { MongoClient } = require('mongodb')
const OpenAI = require('openai')

const MONGODB_URI = process.env.MONGODB_URI
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DB_NAME = 'auto-timkiem-sosanh'

const MOCK_FALLBACK = {
  searchQuery: '(Demo - API chưa được cấu hình)',
  category: 'other',
  items: [
    {
      name: 'Sản phẩm mẫu 1',
      price: 1800000,
      location: 'Mẫu - Vui lòng cấu hình API',
      features: ['Tính năng A', 'Tính năng B', 'Tính năng C'],
      pros: 'Giá tốt, nhiều tính năng',
      cons: 'Cần cấu hình API key',
      aiRating: 7.5,
      aiComment: 'Vui lòng thêm DEEPSEEK_API_KEY và MONGODB_URI vào .env.local',
    },
  ],
}

let mongoClient = null

async function getMongoClient() {
  if (!MONGODB_URI) return null
  if (!mongoClient) {
    mongoClient = new MongoClient(MONGODB_URI)
    await mongoClient.connect()
  }
  return mongoClient
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

    if (!DEEPSEEK_API_KEY) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          ...MOCK_FALLBACK,
          searchQuery: searchQuery || '(Chưa cấu hình API)',
          note: 'Thiếu DEEPSEEK_API_KEY trong .env.local',
        }),
      }
    }

    const deepseek = new OpenAI({
      baseURL: 'https://api.deepseek.com/v1',
      apiKey: DEEPSEEK_API_KEY,
    })

    let items = []

    try {
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

      const completion = await deepseek.chat.completions.create({
        model: 'deepseek-v4-flash',
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
      items = MOCK_FALLBACK.items.map((item) => ({
        ...item,
        pros: `${item.pros} (AI offline: ${aiError.message})`,
      }))
    }

    if (items.length === 0) {
      items = MOCK_FALLBACK.items
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
      statusCode: 200,
      headers,
      body: JSON.stringify(MOCK_FALLBACK),
    }
  }
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
