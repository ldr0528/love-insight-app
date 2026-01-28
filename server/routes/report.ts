import { Router, type Request, type Response } from 'express'
import OpenAI from 'openai'

const router = Router()

// Initialize OpenAI client compatible with Qwen (DashScope)
const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY || 'sk-placeholder',
  baseURL: process.env.DASHSCOPE_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
})

const SYSTEM_PROMPT = `你是「灵犀指引」娱乐型报告生成引擎。你的任务是根据用户的 MBTI、星盘（生日）以及情感状态，生成一份深度、温暖且具有洞察力的情感与运势分析报告。

{{CURRENT_DATE_LINE}}

**核心风格要求：**
1. **温暖治愈**：语气要像一位深谙心理学和占星学的知心老友，既专业又充满人文关怀。避免冷冰冰的机械陈述。
2. **深度详实**：报告内容要丰富充实，杜绝泛泛而谈。每一个结论都要有逻辑支撑（结合用户的 MBTI 或星盘）。
3. **拒绝重复**：每次生成的具体措辞应当根据用户的具体组合（MBTI x 现状）有所不同，避免让用户感觉是模板拼接。

**输入数据说明：**
- user_profile: { relationship_stage (情感状态), goal (目标), fortune_type (运势类型: weekly/monthly/yearly) }
- signals: { mbti (人格), birthday (生日) }

**禁止事项：**
- 严禁输出 Markdown 格式，必须输出纯 JSON。
`

const OUTPUT_FORMAT = `Return ONLY valid JSON. No markdown blocks. Ensure all content is in Chinese (Simplified).`

// --- Dynamic Schema Generators ---
const getSchemaForReportType = (type: string) => {
  if (type === 'love_coach') {
    return `{
      "headline": "string (catchy title)",
      "summary": "string (core insight paragraph)",
      "target_profile": ["string", "string", "string"],
      "user_opportunity": ["string", "string", "string"],
      "action_plan": [
        { "title": "string", "desc": "string", "tip": "string" },
        { "title": "string", "desc": "string", "tip": "string" },
        { "title": "string", "desc": "string", "tip": "string" }
      ],
      "scripts": ["string", "string", "string"],
      "warnings": ["string", "string", "string"]
    }`;
  }

  // Fortune Inn Schemas
  if (type === 'fortune_monthly' || type === 'fortune_yearly') {
      return `{
        "headline": "string (Title for the period, e.g., '本周运势：星光闪耀之时')",
        "summary": ["string", "string", "string"],
        "fortune_score": 85,
        "lucky_items": {
            "color": "string",
            "number": "string",
            "direction": "string",
            "element": "string (optional)"
        },
        "taboos": {
            "do": ["string", "string", "string"],
            "avoid": ["string", "string", "string"]
        },
        "content_sections": [
            { "title": "string (e.g., 事业运)", "content": "string" },
            { "title": "string (e.g., 桃花运)", "content": "string" },
            { "title": "string (e.g., 财富运)", "content": "string" }
        ]
      }`;
  }
  
  // Default Schema (for astrology/palm/general)
  return `{
    "headline": "string",
    "summary": ["string", "string"],
    "attraction_profile": {
      "you_attract": ["string"],
      "you_miss": ["string"],
      "key_strengths": ["string"],
      "key_blindspots": ["string"]
    },
    "action_plan": [
      { "title": "string", "steps": ["string"], "scenario": "string", "example_script": "string" }
    ],
    "weekly_focus": { "theme": "string", "do": ["string"], "avoid": ["string"] },
    "share_card_copy": { "title": "string", "one_liner": "string", "tags": ["string"] }
  }`;
};

// Mock Data for Fallback
const MOCK_REPORT = {
  headline: "星际引力：你在混乱中寻找秩序的深情守望者",
  summary: [
    "你的特质让你在感情中显得冷静克制，但内心藏着一座休眠火山。",
    "近期星盘显示土星正在考验你的耐心，建议在关系中少一点逻辑分析，多一点直觉感受。",
    "星盘中的金星位置暗示了你对完美的苛求，这可能是你感到孤独的根源。"
  ],
  attraction_profile: {
    you_attract: ["高智商、有独立见解的思考者", "需要被引领但内心叛逆的探索者"],
    you_miss: ["温暖热情但缺乏逻辑深度的乐天派", "过于依赖情感链接的粘人型伴侣"],
    key_strengths: ["忠诚度极高", "善于解决复杂的情感问题"],
    key_blindspots: ["过度理性化对方的情绪", "不仅不解释，还觉得对方应该懂"]
  },
  action_plan: [
    {
      title: "打破冰山效应",
      steps: ["每天主动分享一件'无用'的小事", "练习在对话中多问一句'你感觉怎么样'"],
      scenario: "当对方抱怨工作时",
      example_script: "听起来真的很难搞，如果是我也会很生气。（而不是直接给建议）"
    }
  ],
  weekly_focus: {
    theme: "情感流动",
    do: ["表达脆弱", "接受赞美"],
    avoid: ["说教", "冷暴力"]
  },
  share_card_copy: {
    title: "恋爱说明书",
    one_liner: "看似冷漠的冰山，实则是最长情的守候。",
    tags: ["智性恋", "深情", "完美主义"]
  }
}

// In-memory cache to prevent re-generation for paid users in the same session (simple implementation)
// In production, use Redis or Database.
const reportCache: Record<string, any> = {}

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_profile, signals, entitlements } = req.body
    
    // Unique key for caching: based on user signals
    const cacheKey = JSON.stringify({ 
      mbti: signals.mbti?.type, 
      birthday: signals.birthday, 
      palm: signals.palm, 
      coach_data: signals.coach_data, 
      report_type: user_profile.report_type || 'comprehensive',
      fortune_type: user_profile.fortune_type, 
      stage: user_profile.relationship_stage,
      goal: user_profile.goal,
      name: user_profile.name,
      v: '14' // Bump version
    })

    if (reportCache[cacheKey]) {
       console.log('Serving cached report for key:', cacheKey.slice(0, 20) + '...')
       res.json(reportCache[cacheKey])
       return
    }

    // Determine System Prompt based on report_type
    const now = new Date();
    const currentDateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
    
    let systemPrompt = SYSTEM_PROMPT.replace('{{CURRENT_DATE_LINE}}', `**当前时间**: ${currentDateStr} (请基于此时间推算周运、月运和年运)`);

    const reportType = user_profile.report_type || 'comprehensive';
    const fortuneType = user_profile.fortune_type; // 'weekly', 'monthly', 'yearly'

    if (reportType === 'astrology') {
      systemPrompt = `你是「灵犀指引」的首席占星专家（拥有20年经验）。你的任务是根据用户的出生日期、时间、地点（星盘/八字信息）以及情感状态，生成一份深度、温暖且具有洞察力的**占星与八字运势报告**。
      
      **核心要求**：
      1. **专注星象**：分析重点必须放在星盘配置（如太阳、月亮、金星落座）和流年运势上。
      2. **八字结合**：如果提供了具体时间，简要结合八字五行（金木水火土）的互补性进行分析。
      3. **温暖治愈**：语气要像一位深谙命理的知心老友。
      
      **输出控制**：
      - **Summary 要求**：必须极度详尽，至少 3 个段落。必须包含具体的八字分析（如“你的日柱为...，五行缺...”）。
      - **深度解析**：分析月亮/八字忌神，剖析深层心理原因。
      - **真命天子/天女画像**：必须包含外貌、职业、性格的详细描述。
      - **行动建议**：包含 5-7 个大项。
      `
    } else if (reportType === 'love_coach') {
      systemPrompt = `你是「灵犀指引」的顶级恋爱军师与情感博弈专家。你的任务是根据用户提供的目标对象信息（MBTI、性格关键词、兴趣爱好）以及当前的核心困扰，生成一份**高情商、可执行的实战恋爱攻略**。

      **核心要求**：
      1. **局势研判**：基于博弈论和心理学，分析当前关系的权力高低、对方的真实心理状态。
      2. **拒绝鸡汤**：不要说“做你自己”这种废话。要给出具体的战术，例如“推拉话术”、“朋友圈建设”、“冷读技巧”。
      3. **针对性强**：
         - 如果对方是 INTJ/INTP，强调智性交流和独立空间。
         - 如果对方是回避型依恋（高冷/慢热），强调安全感建立和低压陪伴。
         - 如果是挽回局，强调“断联”与“二次吸引”。

      **输出控制（JSON格式）**：
      - **headline**: 一句直击痛点的局势总结。
      - **summary**: 核心洞察（300字左右），分析对方心理和当前局势。
      - **target_profile**: 对方心理画像（3-5点）。
      - **user_opportunity**: 你的优势与机会（3-5点）。
      - **action_plan**: 破局行动指南（3个阶段），每个阶段包含 title, desc, tip。
      - **scripts**: 实战话术库（3-5句），可以直接复制粘贴发给对方的话。
      - **warnings**: 避雷警示（3-5点），绝对不能做的事。
      `
    } else if (reportType === 'palm') {
      systemPrompt = `你是「灵犀指引」的手相大师。你的任务是根据用户上传的手相特征（感情线、智慧线、生命线、金星丘），生成一份**深度手相命运解读报告**。
      
      **核心要求**：
      1. **专注手相**：详细解读每一条纹路的含义（例如：感情线末端分叉代表什么），并结合流年推断。
      2. **性格映射**：通过掌纹反推用户的性格情感模式，深度剖析潜意识。
      3. **温暖治愈**：语气神秘而温暖，给予积极的心理暗示。
      
      **输出控制**：
         - **字数要求**：Summary 部分不得少于 500 字，细致入微。
         - **深度解读**：不仅仅是看线，还要分析“丘”的饱满度。
         - **流年预测**：基于生命线和事业线的流年法，详细预测未来 5 年的情感关键节点。
         - **行动指南**：包含 5-7 个针对性的改运指南。
      `
    } else if (reportType === 'fortune_weekly' || reportType === 'fortune_monthly' || reportType === 'fortune_yearly') {
        const periodText = reportType === 'fortune_weekly' ? '本周' : reportType === 'fortune_monthly' ? '本月' : `${now.getFullYear()}年`;
        systemPrompt = `你是「灵犀指引」的运势分析师。当前日期是 ${currentDateStr}。你的任务是为用户生成${periodText}的运势报告（运报客栈）。

        **核心要求**：
        1. **精准时效**：基于当前日期（${currentDateStr}）和用户的星座/八字，推演${periodText}的运势。
        2. **实用宜忌**：必须给出具体的宜忌指南（Taboos），例如“宜：修剪植物，忌：签署合同”。
        3. **生活化**：建议要具体到生活细节，如幸运色、幸运数字、方位等。
        
        **输出控制（JSON格式）**：
        - headline: 标题
        - summary: 运势总览（3段）
        - fortune_score: 运势评分 (0-100)
        - lucky_items: { color, number, direction, element }
        - taboos: { do: [3点], avoid: [3点] }
        - content_sections: [ {title: '事业/学业', content: '...'}, {title: '情感/人际', content: '...'}, {title: '财运/健康', content: '...'} ]
        `
    }

    // Try AI generation first
    try {
      // Determine model based on report type to optimize speed/quality
      // Use qwen-max for complex astrology, qwen-plus for standard reports
      const modelName = req.body.ui_context?.report_type === 'astrology' || req.body.ui_context?.report_type?.startsWith('fortune_') ? 'qwen-max' : 'qwen-plus';

      console.log(`Attempting AI generation with model ${modelName}...`);
      
      const developerSchema = getSchemaForReportType(req.body.ui_context?.report_type || 'comprehensive');
      const DEVELOPER_PROMPT_DYNAMIC = `You are a strict JSON generator. You must output VALID JSON matching the schema below.
      Schema:
      ${developerSchema}
      `;

      const completion = await client.chat.completions.create({
        model: modelName,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'system', content: DEVELOPER_PROMPT_DYNAMIC },
          { role: 'user', content: `Please generate the report based on this input:\n${JSON.stringify({user_profile, signals})}\n\nOutput Format Requirement:\n${OUTPUT_FORMAT}` }
        ],
        response_format: { type: 'json_object' },
      })
      console.log('AI response received');

      const content = completion.choices[0].message.content
      if (content) {
        let reportData;
        try {
           // Sanitize content: remove markdown code blocks if present
           const cleanContent = content.replace(/```json\n?|```/g, '').trim();
           reportData = JSON.parse(cleanContent)
        } catch (parseError) {
           console.error('Failed to parse AI JSON:', content);
           throw new Error('AI returned invalid JSON');
        }
        
        // Normalize Data Structure (Fix AI Hallucinations)
         if (typeof reportData.summary === 'string') {
             reportData.summary = [reportData.summary];
         }
         
         if (reportData.attraction_profile) {
             ['you_attract', 'you_miss', 'key_strengths', 'key_blindspots'].forEach(key => {
                 if (typeof reportData.attraction_profile[key] === 'string') {
                     reportData.attraction_profile[key] = [reportData.attraction_profile[key]];
                 }
             });
         }

         if (reportData.action_plan && Array.isArray(reportData.action_plan)) {
             reportData.action_plan.forEach((plan: any) => {
                 // Fix steps being a string instead of array
                 if (typeof plan.steps === 'string') {
                     plan.steps = [plan.steps];
                 }
             });
         }

        // Ensure share_card_copy exists
        if (!reportData.share_card_copy) {
            reportData.share_card_copy = {
                title: reportData.headline || "情感报告",
                one_liner: reportData.headline || "你的专属情感洞察",
                tags: []
            };
        }

        // --- Validation for Fortune Reports ---
        if (req.body.ui_context?.report_type?.startsWith('fortune_')) {
            if (!reportData.taboos) {
                reportData.taboos = { do: [], avoid: [] };
            }
            if (!reportData.taboos.do) reportData.taboos.do = ["顺其自然", "保持乐观", "早睡早起"];
            if (!reportData.taboos.avoid) reportData.taboos.avoid = ["冲动决策", "熬夜", "暴饮暴食"];
            
            if (!reportData.content_sections || !Array.isArray(reportData.content_sections)) {
                reportData.content_sections = [
                    { title: "综合运势", content: reportData.summary?.[0] || "运势平稳，静待花开。" },
                    { title: "事业学业", content: "保持专注，效率会逐渐提升。" },
                    { title: "情感人际", content: "多与人交流，会有意外收获。" }
                ];
            }
        }

        // Save to cache
        reportCache[cacheKey] = reportData
        
        res.json(reportData)
        return
      }
    } catch (aiError: any) {
      console.warn('AI Generation failed, falling back to mock data:', aiError.message)
      // Fallthrough to mock data
    }


    // Fallback Mock Data Logic
    // Deep copy to avoid mutating the global MOCK_REPORT
    const mockResponse = JSON.parse(JSON.stringify(MOCK_REPORT))
    
    // Adjust mock based on user input (simple customization)
    if (user_profile.relationship_stage === 'single') {
        mockResponse.headline = "独行者的浪漫：你正在等待一个能读懂沉默的人"
    } else if (user_profile.relationship_stage === 'breakup_recovery') {
        mockResponse.headline = "重生之旅：每一次破碎都是为了重塑更完整的自己"
    }

    // Hand Palm specific fallback
    if (user_profile.report_type === 'palm') {
       // Customize based on detected features if available
       const palmFeatures = signals.palm?.features || {};
       const heartLine = palmFeatures.heart_line || 'unknown';
       const headLine = palmFeatures.head_line || 'unknown';
       const lifeLine = palmFeatures.life_line || 'unknown';

       // Dictionary for natural language mapping
       const featureMap: Record<string, string> = {
         // Heart Line
         'long': '深长且延展', 'curved': '呈优美的弧形', 'deep': '深刻清晰', 'forked_end': '末端出现分叉',
         // Head Line
         'straight': '平直有力', 'curved_down': '向下弯曲延伸', 'short': '短促而集中', 'islanded': '中途出现岛纹',
         // Life Line
         'deep_arc': '弧度深刻饱满', 'wide': '宽阔开朗', 'broken': '略有断续', 'chained': '呈锁链状',
         // Mount Venus
         'full': '饱满隆起', 'flat': '较为平坦', 'crossed': '有杂纹交错', 'prominent': '显著突起'
       };

       const heartDesc = featureMap[heartLine] || heartLine;
       const headDesc = featureMap[headLine] || headLine;
       const lifeDesc = featureMap[lifeLine] || lifeLine;

       mockResponse.headline = "掌纹揭秘：你的手中掌握着命运的地图";
       mockResponse.summary = [
         `你的感情线${heartDesc}，这通常意味着你在感情中${heartLine.includes('forked') ? '有着丰富的选择，但也容易陷入纠结' : heartLine.includes('deep') || heartLine.includes('long') ? '非常专一且长情，一旦爱上便全力以赴' : '比较慢热，需要时间建立信任'}。`,
         `智慧线${headDesc}，显示出你${headLine.includes('curved') ? '极具想象力和创造力，适合从事艺术相关工作' : headLine.includes('straight') ? '逻辑思维严密，做事条理分明' : '反应迅速，直觉往往比逻辑更准'}。`,
         `生命线${lifeDesc}，预示着${lifeLine.includes('broken') || lifeLine.includes('chained') ? '你的早期生活可能经历过一些变动，但这些经历塑造了你坚韧的性格' : '你拥有充沛的精力，能够应对高强度的工作与生活挑战'}。`
       ];
       
       // Dynamic Strengths
       const strengths = [];
       if (headLine.includes('curved') || headLine.includes('islanded')) strengths.push("直觉敏锐", "创造力强");
       else strengths.push("逻辑清晰", "决策果断");
       
       if (heartLine.includes('deep') || heartLine.includes('long')) strengths.push("重情重义");
       else strengths.push("独立自主");
       
       if (lifeLine.includes('deep') || lifeLine.includes('wide')) strengths.push("精力充沛");
       else strengths.push("适应力强");
       
       mockResponse.attraction_profile.key_strengths = strengths.slice(0, 3);
    }

    // Love Coach specific fallback
    if (user_profile.report_type === 'love_coach') {
       const coachData = signals.coach_data || {};
       mockResponse.headline = "破局之道：你正在一步步拿回属于你的主动权";
       mockResponse.summary = "通过对你提供的关系的深度复盘，我们发现对方并非对你无感，而是进入了一种“舒适区倦怠”。你的MBTI特质与他的性格（" + (coachData.target_mbti || "对方") + "）其实存在天然的互补，但目前的沟通模式掩盖了这种吸引力。他现在需要的不是更多的关心，而是一点点不可控的“危机感”。";
       
       mockResponse.target_profile = [
         "核心需求：他渴望一个能带给他情绪价值，同时又足够独立的伴侣。",
         "防御机制：面对高压逼问，他会本能地开启“静音模式”。",
         "兴趣切入：" + (coachData.target_hobbies ? `他对“${coachData.target_hobbies}”的热爱，是你打开他话匣子的最佳钥匙。` : "利用他的爱好制造共同话题是关键。")
       ];
       
       mockResponse.user_opportunity = [
         "你的情感细腻度是你最大的武器，但要学会“延迟满足”。",
         "目前的关系虽然平淡，但基础信任还在，这就是翻盘的基石。",
         "利用“间歇性强化”原理，让他重新对你产生好奇心。"
       ];

       mockResponse.action_plan = [
         {
           title: "阶段一：冷启动重建 (3-5天)",
           desc: "这一阶段的核心是“制造反差”。如果以前你秒回，现在就轮回；如果以前你总点赞，现在就消失。让他感到“不对劲”。",
           tip: "不要害怕失去，害怕失去才是真的失去。"
         },
         {
           title: "阶段二：智性唤醒 (触达)",
           desc: "通过朋友圈展示你正在通过“" + (coachData.target_hobbies?.split('、')[0] || "新兴趣") + "”获得快乐。不要提他，只提事。",
           tip: "展示你的高价值，而不是你的等待。"
         },
         {
           title: "阶段三：锚点植入 (互动)",
           desc: "当他主动点赞或评论时，不要急着回复。过2小时回复一个有趣的表情包，或者反问句，把球踢回去。",
           tip: "保持轻松，谁先认真谁就输了。"
         }
       ];

       mockResponse.scripts = [
         "突然发现那家店的招牌菜换了，感觉你应该会喜欢。",
         "（发一张模糊但好看的照片）猜猜我在哪？",
         "今天遇到个很有意思的事，第一个就想到了你。"
       ];

       mockResponse.warnings = [
         "严禁在深夜发任何情绪化的文字。",
         "严禁连续发三条以上的信息而没有收到回复。",
         "严禁问“我们现在算什么”这种索取承诺的问题。"
       ];
       
       // Clean up standard report fields
       delete (mockResponse as any).attraction_profile;
       delete (mockResponse as any).weekly_focus;
    }
    
    // Fortune Inn Fallback
    if (user_profile.report_type?.startsWith('fortune_')) {
        mockResponse.headline = "2026年运势来福";
        mockResponse.summary = [
            "本周你的运势如日中天，各项事务推进顺利。",
            "财运方面有小额进账，但需注意控制支出。",
            "情感上可能遇到心动的对象，建议多参加社交活动。"
        ];
        (mockResponse as any).fortune_score = 88;
        (mockResponse as any).lucky_items = {
            color: "红色",
            number: "8",
            direction: "东南",
            element: "火"
        };
        (mockResponse as any).taboos = {
            do: ["晨跑", "阅读", "整理房间"],
            avoid: ["熬夜", "暴饮暴食", "与人争执"]
        };
        
        (mockResponse as any).content_sections = [
            { title: "事业运", content: "工作效率高，容易得到上司赏识。" },
            { title: "桃花运", content: "单身者有机会脱单，有伴者感情升温。" },
            { title: "财运", content: "正财稳定，偏财运一般，投资需谨慎。" }
        ];
        
        // Cleanup
        delete (mockResponse as any).attraction_profile;
        delete (mockResponse as any).action_plan;
        delete (mockResponse as any).weekly_focus;
    }

    res.json(mockResponse)

  } catch (error: any) {
    console.error('Error generating report:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate report'
    })
  }
})

export default router
