
import { Router, type Request, type Response } from 'express';
import OpenAI from 'openai';

const router = Router();

// Initialize OpenAI client compatible with Qwen (DashScope)
const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY || 'sk-placeholder',
  baseURL: process.env.DASHSCOPE_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
});

const SYSTEM_PROMPT = `你是「灵犀指引」的缘分分析大师，精通东方八字与西方占星。你的任务是根据两个人的姓名和生日，分析他们的缘分深浅、相处模式，并给出一首原创或引用的古诗作为结语。

**分析维度**：
1. **性格互补性**：结合星座与姓名学（字义/五行），分析两人性格是互补还是冲突。
2. **缘分指数**：给出一个0-100的分数，并说明理由。
3. **相处建议**：针对两人的潜在矛盾给出具体的相处建议。
4. **前世今生**（娱乐性）：用浪漫的笔触描述两人可能的前世羁绊。

**输出要求**：
- 语气：古风、唯美、深情，但分析部分要逻辑清晰。
- 格式：JSON格式。
- **必须包含一首古诗作为结尾**（ending_poem）。

**JSON Schema**:
{
  "score": number,
  "analysis": "string (main analysis text, at least 300 words, formatted with paragraphs)",
  "keywords": ["string", "string", "string"],
  "ending_poem": "string"
}
`;

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_name, user_birth, partner_name, partner_birth } = req.body;

    if (!user_name || !partner_name) {
      res.status(400).json({ error: 'Missing names' });
      return;
    }

    // Try AI generation
    try {
      const completion = await client.chat.completions.create({
        model: 'qwen-plus',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `分析以下两人的缘分：\n甲方：${user_name} (${user_birth || '未知'})\n乙方：${partner_name} (${partner_birth || '未知'})` }
        ],
        response_format: { type: 'json_object' },
      });

      const content = completion.choices[0].message.content;
      if (content) {
        let result;
        try {
            // Clean up any markdown code blocks if present
            const cleanContent = content.replace(/```json\n?|```/g, '').trim();
            result = JSON.parse(cleanContent);
        } catch (e) {
            console.error('Failed to parse AI JSON:', content);
            throw new Error('Invalid JSON from AI');
        }
        res.json(result);
        return;
      }
    } catch (aiError) {
      console.error('AI Generation failed:', aiError);
      // Fallback mock data
      res.json({
        score: 88,
        analysis: "你们的缘分如同高山流水，虽有波折但终归于海。从姓名学来看，二者五行相生，性格上一动一静，互补性极强。虽然偶尔会有口角，但这正是磨合的必经之路。在星盘的映照下，你们的灵魂早在前世便已结下契约，今生的相遇是为了完成未竟的课题。",
        keywords: ["互补", "情深", "磨合"],
        ending_poem: "金风玉露一相逢，便胜却人间无数。"
      });
    }

  } catch (error: any) {
    console.error('Error in compatibility analysis:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
