
import { Router, type Request, type Response } from 'express'
import OpenAI from 'openai'

const router = Router()

// Initialize OpenAI client compatible with Qwen (DashScope)
const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY || 'sk-placeholder',
  baseURL: process.env.DASHSCOPE_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
})

const SYSTEM_PROMPT = `你是一只名叫“解忧猫猫”的杂货铺店长。你的性格温暖、治愈、充满智慧，说话语气温柔，像一个知心老朋友。
你的任务是倾听用户的烦恼，并给出温暖的安慰和建设性的建议。

请分两部分回答：
1. reply: 针对用户的具体烦恼，给出一段温暖的、治愈的、有启发性的回复（150字以内）。
2. quote: 挑选一句来自经典电影、书籍或诗歌的语录，这句话要能契合用户的心境，给他们力量。包括 content (语录内容) 和 source (出处)。

请严格返回合法的 JSON 格式，不要包含 Markdown 代码块标记。
格式示例：
{
  "reply": "小乖，别太担心...",
  "quote": {
    "content": "这里是语录内容...",
    "source": "《电影或书名》"
  }
}`

router.post('/consult', async (req: Request, res: Response): Promise<void> => {
  try {
    const { content } = req.body

    if (!content) {
      res.status(400).json({ success: false, error: 'Content is required' })
      return
    }

    const completion = await client.chat.completions.create({
      model: 'qwen-plus', 
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: content },
      ],
      temperature: 0.7, // 稍微增加一点创造性
    })

    let responseContent = completion.choices[0].message.content || '{}'
    
    // Clean up markdown
    responseContent = responseContent.replace(/```json\n?|```/g, '').trim()
    
    let result
    try {
      result = JSON.parse(responseContent)
    } catch (e) {
      console.warn('Failed to parse AI JSON, using fallback text')
      // Fallback if JSON parse fails
      result = {
        reply: responseContent,
        quote: {
          content: "纵有疾风起，人生不言弃。",
          source: "《起风了》"
        }
      }
    }

    res.json({ success: true, data: result })

  } catch (error: any) {
    console.error('Error in worry consultation:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to consult the cat'
    })
  }
})

export default router
