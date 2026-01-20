
import { Router, type Request, type Response } from 'express'
import OpenAI from 'openai'

const router = Router()

const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY || 'sk-placeholder',
  baseURL: process.env.DASHSCOPE_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
})

router.post('/generate', async (req: Request, res: Response): Promise<void> => {
  try {
    const params = req.body
    const { type } = params

    if (!type) {
      res.status(400).json({ success: false, error: 'Naming type is required' })
      return
    }

    let prompt = ''
    const systemPrompt = 'You are a professional naming expert. Return only valid JSON array. Do not include any explanation or markdown formatting.'

    if (type === 'baby') {
      const { lastName, gender, birthYear, birthMonth, birthDay, birthTime, styles, meanings, nameLength, avoidChars, fixedChar, count, detailed } = params
      const styleStr = styles?.length ? styles.join('、') : '不限'
      const meaningStr = meanings?.length ? meanings.join('、') : '不限'
      const nameCount = count || 3
      const totalLen = Number(nameLength || 2)
      const ln = (lastName || '李')
      const lnLen = ln.length
      const givenLen = Math.max(totalLen - lnLen, 1)
      
      prompt = `请为姓氏“${ln}”的${gender === 'boy' ? '男孩' : '女孩'}起${nameCount}个名字。
      出生信息：${birthYear || '不详'}年${birthMonth || ''}月${birthDay || ''}日 ${birthTime || ''}
      名字总字数：严格限制为${totalLen}个字（包含姓氏）。例如：姓李，总字数2，则全名为“李X”；总字数3，则“李XX”。
      风格偏好：${styleStr}
      寓意偏好：${meaningStr}
      ${avoidChars ? `避讳字：${avoidChars}` : ''}
      ${fixedChar ? `固定字：${fixedChar}` : ''}
      
      请返回${nameCount}个推荐名字，要求：
      1. 必须富有创意，避免常见重名。
      2. 每次生成必须不同，根据当前时间微调灵感。
      3. 全名总字数必须严格等于${totalLen}（含姓“${ln}”），即名部分为${givenLen}个字；不符合则重写。
      4. 格式必须为严格的JSON数组，每个对象包含以下字段：
      - name: 完整名字（含姓）
      - pinyin: 拼音（带声调，如 Hào Yǔ）
      - meaning: 名字寓意（50字以内）
      - tags: 2个风格标签（数组，如 ["文雅", "大气"]）
      - ratings: { sound: 0-100, meaning: 0-100, unique: 0-100 } (分数)
      - reasons: 2个推荐理由（数组，每条20字以内）
      ${detailed ? `- wuxing: 五行属性（如"木火"，仅名字的五行）
      - wuxingAnalysis: 五行分析（30字以内，分析五行是否平衡）
      - luck: 八字运势简评（30字以内）
      - sancai: 三才五格（如"天格12(木) 地格15(土) 人格20(水)"）
      - zodiac: 生肖喜忌（结合出生年份生肖，分析名字字根是否合适）
      - poem: 诗词出处（引用的古诗词句子，没有则写"自创"）
      - score: 综合评分（80-100之间）` : ''}
      `
    } else {
      const { industry, customIndustry, tone, audience, language, keywords, description } = params
      const industryStr = industry === 'other' ? customIndustry : industry
      
      prompt = `请为一家${industryStr || '科技'}行业的公司/品牌起3个名字。
      品牌调性：${tone || '不限'}
      目标受众：${audience || '不限'}
      语言偏好：${language || '中文'}
      ${keywords ? `关键词：${keywords}` : ''}
      ${description ? `描述：${description}` : ''}

      请返回3个推荐名字，格式必须为严格的JSON数组，每个对象包含以下字段：
      - name: 品牌名称
      - enName: 英文名称（如果是中文名，请创造对应的英文名）
      - slogans: 3个简短Slogan（数组）
      - tags: 2个标签（数组）
      - explanation: 释义（50字以内）
      `
    }

    console.log('Generating names with prompt:', prompt.substring(0, 100) + '...')

    const completion = await client.chat.completions.create({
      model: 'qwen-plus',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 1.1, // Increase randomness
    })

    let content = completion.choices[0].message.content || '[]'
    // Remove markdown code blocks if present
    content = content.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '')

    let data
    try {
      data = JSON.parse(content)
    } catch (e) {
      console.error('JSON Parse Error:', content)
      throw new Error('Failed to parse AI response')
    }

    if (params.type === 'baby') {
      const ln = (params.lastName || '李')
      const totalLen = Number(params.nameLength || 2)
      const sanitize = (s: string) => (s || '').replace(/\s+/g, '')
      data = Array.isArray(data)
        ? data.filter((item: any) => {
            const full = sanitize(item?.name)
            if (!full) return false
            return full.startsWith(ln) && [...full].length === totalLen
          })
        : []
    }

    res.json({ success: true, data })

  } catch (error: any) {
    console.error('Naming generation error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
