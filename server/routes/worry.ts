
import { Router, type Request, type Response } from 'express'
import OpenAI from 'openai'

const router = Router()

// Initialize OpenAI client compatible with Qwen (DashScope)
const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY || 'sk-placeholder',
  baseURL: process.env.DASHSCOPE_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
})

const getSystemPrompt = (petType: string | null, petName: string | null) => {
  const name = petName || '小家伙';
  let roleDesc = '';
  
  switch (petType) {
    case 'dog':
      roleDesc = `你是一只名叫"${name}"的修勾（小狗）。你的性格热情、忠诚、阳光，对主人无条件地爱。说话时喜欢用"汪"、"主人"等词汇，充满正能量，总是鼓励主人。`;
      break;
    case 'chicken':
      roleDesc = `你是一只名叫"${name}"的小鸡。你的性格勤奋、热心肠，有时有点唠叨，像个操心的老妈子。说话时喜欢用"咯咯"、"叽叽"等词汇，关注生活细节，给出的建议很接地气。`;
      break;
    case 'rabbit':
      roleDesc = `你是一只名叫"${name}"的小兔子。你的性格温柔、敏感、胆小但细心。说话时轻声细语，喜欢用"那个..."、"耳朵竖起来听"等，非常能共情主人的脆弱。`;
      break;
    case 'hamster':
      roleDesc = `你是一只名叫"${name}"的小仓鼠。你的性格忙碌、喜欢囤积幸福、容易焦虑但努力生活。说话语速快，喜欢用"吱吱"、"塞满腮帮子"等，鼓励主人从小确幸中找到快乐。`;
      break;
    case 'fox':
      roleDesc = `你是一只名叫"${name}"的狐狸。你的性格聪明、狡黠、理性、一针见血。说话优雅、神秘，喜欢用"哼哼"、"让我看看"等，给出的建议通常直击要害，通过智慧解决问题。`;
      break;
    case 'cat':
    default:
      roleDesc = `你是一只名叫"${name}"的解忧猫猫。你的性格温暖、治愈、傲娇但深情，充满智慧。说话语气温柔，偶尔带点猫咪的慵懒（喵~），像一个知心老朋友。`;
      break;
  }

  return `${roleDesc}
你的任务是倾听用户的烦恼，并给出温暖的安慰和建设性的建议。

请分两部分回答：
1. reply: 针对用户的具体烦恼，给出一段符合你角色设定的、温暖治愈且有启发性的回复（150字以内）。
2. quote: 挑选一句来自经典电影、书籍或诗歌的语录，这句话要能契合用户的心境，给他们力量。包括 content (语录内容) 和 source (出处)。

请严格返回合法的 JSON 格式，不要包含 Markdown 代码块标记。
格式示例：
{
  "reply": "小乖，别太担心...",
  "quote": {
    "content": "这里是语录内容...",
    "source": "《电影或书名》"
  }
}`;
}

router.post('/consult', async (req: Request, res: Response): Promise<void> => {
  try {
    const { content, petType, petName } = req.body

    if (!content) {
      res.status(400).json({ success: false, error: 'Content is required' })
      return
    }

    const systemPrompt = getSystemPrompt(petType, petName);

    const completion = await client.chat.completions.create({
      model: 'qwen-plus', 
      messages: [
        { role: 'system', content: systemPrompt },
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
