
import { Router, type Request, type Response } from 'express'
import OpenAI from 'openai'

const router = Router()

// Initialize OpenAI client compatible with Qwen (DashScope)
const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY || 'sk-placeholder',
  baseURL: process.env.DASHSCOPE_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
})

const ANALYSIS_PROMPT = `Analyze the palm lines in this image strictly and precisely.
Identify the following features and provide a specific, descriptive English adjective (1-2 words) for each based on the visual evidence:
1. heart_line (e.g., "steeply_curved", "straight_long", "faint", "chain_like", "forked_end")
2. head_line (e.g., "sloping", "straight_across", "wavy", "short_deep", "broken")
3. life_line (e.g., "wide_arc", "narrow_arc", "doubled", "faint", "deeply_etched")
4. mount_venus (e.g., "highly_raised", "flat", "grilled", "smooth", "reddish")

Return a valid JSON object ONLY. Keys: heart_line, head_line, life_line, mount_venus.
DO NOT use generic defaults unless they truly fit. Be specific to this hand.`

router.post('/palm', async (req: Request, res: Response): Promise<void> => {
  console.log('Received palm analysis request');
  try {
    const { image } = req.body 
    console.log('Image received, length:', image?.length);

    if (!image) {
      res.status(400).json({ success: false, error: 'Image data is required' })
      return
    }

    // Try AI generation first
    try {
      console.log('Attempting AI Vision with model qwen-vl-max...');
      const completion = await client.chat.completions.create({
        model: 'qwen-vl-max', // Using qwen-vl-max for best image understanding
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: ANALYSIS_PROMPT },
              { type: 'image_url', image_url: { url: image } },
            ],
          },
        ],
      })
      console.log('AI Vision response received');

      let content = completion.choices[0].message.content || '{}'
      
      // Clean up markdown if AI returns it despite instructions
      content = content.replace(/```json\n?|```/g, '').trim()
      
      let features
      try {
         features = JSON.parse(content)
      } catch (e) {
         console.warn('Failed to parse AI JSON, using fallback regex or default')
         features = { heart_line: 'unknown', head_line: 'unknown', life_line: 'unknown', mount_venus: 'unknown' }
      }
      
      res.json({ success: true, features })
      return

    } catch (aiError: any) {
      console.warn('AI Vision failed, falling back to mock:', aiError.message)
      
      // Fallback Mock Data Logic
      // Ensure the user flow is not blocked even if AI fails
      const randomFeature = (opts: string[]) => opts[Math.floor(Math.random() * opts.length)]
      
      const mockFeatures = {
        heart_line: randomFeature(['long', 'curved', 'deep', 'forked_end']),
        head_line: randomFeature(['straight', 'curved_down', 'short', 'islanded']),
        life_line: randomFeature(['deep_arc', 'wide', 'broken', 'chained']),
        mount_venus: randomFeature(['full', 'flat', 'crossed', 'prominent'])
      }

      res.json({
        success: true,
        features: mockFeatures,
        is_mock: true,
        warning: 'AI analysis failed, showing simulated results.'
      })
      return
    }

  } catch (error: any) {
    console.error('Error analyzing palm:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze image'
    })
  }
})

export default router
