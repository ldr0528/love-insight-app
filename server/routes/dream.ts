import { Router, type Request, type Response } from 'express'
import OpenAI from 'openai'

const router = Router()

// Initialize OpenAI client compatible with Qwen (DashScope)
const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY || 'sk-placeholder',
  baseURL: process.env.DASHSCOPE_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
})

const getDreamSystemPrompt = () => {
  return `你是一位精通心理学和梦境解析的“周公”。
你的任务是根据用户在梦境测试中的选择，深度解析他们的潜意识。

重要提示：所有输出内容必须严格使用【简体中文】。

你需要分析出以下四个维度的信息：
1. 真实心理年龄 (psychologicalAge): 一个具体的数字。
2. 灵魂适配职业 (career): 一个富有创意和契合度的职业名称（如“造梦师”、“星际导航员”、“心灵园丁”等）。请务必使用中文。
3. 潜意识梦想人格 (dreamPersona): 用一个词或短语描述他们内心深处渴望成为的人（如“孤独的观察者”、“光明的守护者”）。请务必使用中文。
4. 深度解析 (analysis): 结合用户的选择，给出一断温暖、深刻且带有神秘感的心理分析（150字左右）。请务必使用中文。

请严格返回合法的 JSON 格式，不要包含 Markdown 代码块标记。
格式示例：
{
  "psychologicalAge": 28,
  "career": "时间旅行者",
  "dreamPersona": "自由的灵魂",
  "analysis": "你在梦中选择了..."
}`;
}

router.post('/analyze', async (req: Request, res: Response): Promise<void> => {
  try {
    const { answers } = req.body

    if (!answers) {
      res.status(400).json({ success: false, error: 'Answers are required' })
      return
    }

    // Convert answers map to readable text
    const answerText = JSON.stringify(answers);

    const completion = await client.chat.completions.create({
      model: 'qwen-plus', 
      messages: [
        { role: 'system', content: getDreamSystemPrompt() },
        { role: 'user', content: `用户的测试选择如下：${answerText}` },
      ],
      temperature: 0.7,
    })

    let responseContent = completion.choices[0].message.content || '{}'
    
    // Clean up markdown
    responseContent = responseContent.replace(/```json\n?|```/g, '').trim()
    
    let result
    try {
      result = JSON.parse(responseContent)
    } catch (e) {
      console.warn('Failed to parse AI JSON, using fallback')
      result = {
        psychologicalAge: 25,
        career: "心灵捕手",
        dreamPersona: "追光者",
        analysis: "你的梦境显示出你内心深处对自由的渴望，虽然表面平静，但潜意识里藏着巨大的能量。"
      }
    }

    res.json({ success: true, data: result })

  } catch (error: any) {
    console.error('Error in dream analysis:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze dream'
    })
  }
})

export default router
