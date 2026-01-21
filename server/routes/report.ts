
import { Router, type Request, type Response } from 'express'
import OpenAI from 'openai'

const router = Router()

// Initialize OpenAI client compatible with Qwen (DashScope)
const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY || 'sk-placeholder',
  baseURL: process.env.DASHSCOPE_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
})

const SYSTEM_PROMPT = `你是「灵犀指引」娱乐型报告生成引擎。你的任务是根据用户的 MBTI、星盘（生日）以及情感状态，生成一份深度、温暖且具有洞察力的情感分析报告。

**核心风格要求：**
1. **温暖治愈**：语气要像一位深谙心理学和占星学的知心老友，既专业又充满人文关怀。避免冷冰冰的机械陈述。
2. **深度详实**：报告内容要丰富充实，杜绝泛泛而谈。每一个结论都要有逻辑支撑（结合用户的 MBTI 或星盘）。
3. **“很长”的体感**：在“完整版”报告中，分析维度要全面展开，给用户一种“物超所值”的厚重感。
4. **拒绝重复**：每次生成的具体措辞应当根据用户的具体组合（MBTI x 现状）有所不同，避免让用户感觉是模板拼接。

**输入数据说明：**
- user_profile: { relationship_stage (情感状态), goal (目标) }
- signals: { mbti (人格), birthday (生日) }
- entitlements: { pay_status (支付状态: 'free' | 'paid') }

**输出控制：**
- 如果 pay_status 为 'free'：生成一份“预览版”报告。核心洞察点到为止，关键的时间点和具体建议（如真命天子画像）要留白，并在 paywall 字段中诱导解锁。
- 如果 pay_status 为 'paid'：生成一份“完整深度版”报告。
    - **必须包含**：2026年详细的月度桃花运势（尤其是5月和9月等关键节点）。
    - **必须包含**：基于星盘和 MBTI 的真命天子/天女详细画像（外貌、职业、性格）。
    - **必须包含**：具体的改运建议和行动指南。
    - **语气升级**：更加亲密、更加笃定，给予用户极大的情绪价值。

**禁止事项：**
- 严禁在完整版中再次出现“解锁后可见”的字样。
- 严禁输出 Markdown 格式，必须输出纯 JSON。
`

const DEVELOPER_PROMPT = `You are a strict JSON generator. You must output VALID JSON matching the schema below.
Schema:
{
  "disclaimer": "string (entertainment purpose warning)",
  "version": "'preview' | 'full'",
  "headline": "string (a poetic and catchy title for the user)",
  "summary": ["string (paragraph 1)", "string (paragraph 2)", "string (paragraph 3)"],
  "attraction_profile": {
    "you_attract": ["string", "string"],
    "you_miss": ["string", "string"],
    "key_strengths": ["string", "string"],
    "key_blindspots": ["string", "string"]
  },
  "action_plan": [
    {
      "title": "string",
      "steps": ["string", "string"],
      "scenario": "string",
      "example_script": "string"
    }
  ],
  "weekly_focus": {
    "theme": "string",
    "do": ["string", "string"],
    "avoid": ["string", "string"]
  },
  "share_card_copy": {
    "title": "string",
    "one_liner": "string",
    "tags": ["string", "string"]
  },
  "paywall": {
    "show": boolean,
    "reason": "string (marketing copy for locked content)",
    "cta": { "text": "string" },
    "locked_items": ["string", "string"]
  }
}
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
  
  // Default Schema (for astrology/general)
  return `{
    "disclaimer": "string",
    "version": "'preview' | 'full'",
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
    "share_card_copy": { "title": "string", "one_liner": "string", "tags": ["string"] },
    "paywall": { "show": boolean, "reason": "string", "cta": { "text": "string" }, "locked_items": ["string"] }
  }`;
};

// Mock Data for Fallback
const MOCK_REPORT = {
  disclaimer: "【模拟数据】本报告仅供娱乐测试，非 AI 实时生成。请检查 API Key 权限以解锁真实体验。",
  version: "preview",
  headline: "星际引力：你在混乱中寻找秩序的深情守望者",
  summary: [
    "你的 INTJ 特质让你在感情中显得冷静克制，但内心藏着一座休眠火山。",
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
    },
    {
      title: "制造低压社交场",
      steps: ["选择非面对面的交流活动（如看展、徒步）", "设定一个'不谈正事'的时间段"],
      scenario: "初次约会",
      example_script: "最近在读一本书很有意思，讲的是..."
    },
    {
      title: "接纳不确定性",
      steps: ["允许计划被打乱一次而不发火", "尝试一次没有任何目的的漫步"],
      scenario: "周末安排",
      example_script: "这周我们不做计划，走到哪算哪怎么样？"
    }
  ],
  weekly_focus: {
    theme: "情感流动",
    do: ["表达脆弱", "接受赞美"],
    avoid: ["说教", "冷暴力"]
  },
  share_card_copy: {
    title: "INTJ 恋爱说明书",
    one_liner: "看似冷漠的冰山，实则是最长情的守候。",
    tags: ["智性恋", "深情", "完美主义"]
  },
  paywall: {
    show: true,
    reason: "解锁完整版可查看：你的 2026 桃花运势时间轴、真命天子/天女的详细画像（外貌/职业/性格）、以及针对你星盘的专属改运建议。",
    cta: {
      text: "解锁完整深度报告",
      supported_methods: ["wechat_pay", "alipay"]
    },
    locked_items: ["2026 桃花时间轴", "真命天子详细画像", "星盘改运建议"]
  }
}

// In-memory cache to prevent re-generation for paid users in the same session (simple implementation)
// In production, use Redis or Database.
const reportCache: Record<string, any> = {}

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_profile, signals, entitlements } = req.body
    
    // Unique key for caching: based on user signals + pay status
    // Added 'v12' to invalidate previous bad caches
    // CRITICAL: Must include coach_data for Love Coach reports!
    const cacheKey = JSON.stringify({ 
      mbti: signals.mbti?.type, 
      birthday: signals.birthday, // Include birthday object (date, time, location)
      palm: signals.palm, 
      coach_data: signals.coach_data, // Fix: Include coach data in cache key
      pay_status: entitlements.pay_status,
      report_type: user_profile.report_type || 'comprehensive',
      // Include critical user context that affects report content
      stage: user_profile.relationship_stage,
      goal: user_profile.goal,
      name: user_profile.name,
      v: '12' 
    })

    if (reportCache[cacheKey]) {
       console.log('Serving cached report for key:', cacheKey.slice(0, 20) + '...')
       res.json(reportCache[cacheKey])
       return
    }

    // Determine System Prompt based on report_type
    let systemPrompt = SYSTEM_PROMPT;
    if (req.body.ui_context?.report_type === 'astrology') {
      systemPrompt = `你是「灵犀指引」的首席占星专家（拥有20年经验）。你的任务是根据用户的出生日期、时间、地点（星盘/八字信息）以及情感状态，生成一份深度、温暖且具有洞察力的**占星与八字运势报告**。
      
      **核心要求**：
      1. **专注星象**：分析重点必须放在星盘配置（如太阳、月亮、金星落座）和流年运势上。
      2. **八字结合**：如果提供了具体时间，简要结合八字五行（金木水火土）的互补性进行分析。
      3. **忽略其他**：不要提及 MBTI 或 手相，除非用户显式提供了这些信息作为辅助。
      4. **温暖治愈**：语气要像一位深谙命理的知心老友。
      
      **输出控制**：
      - Free: 预览版，**必须基于用户的八字（出生日期+时间）和星座进行真实分析**。
          - **仅输出**：headline, summary, paywall, share_card_copy。
          - **严禁输出**：attraction_profile, action_plan, weekly_focus（预览版不需要这些，把 Token 全部分配给 Summary）。
          - **Summary 要求**：必须极度详尽，至少 3 个段落，每段 150 字以上。**必须包含具体的八字分析**（如“你的日柱为...，五行缺...”），不能只说星座通用模板。每次生成的内容必须独一无二。
      - Paid: 完整版，**这是用户付费购买的高级产品，必须提供“震撼人心”的深度解析**！
         - **核心基调**：融合荣格心理学（阴影/阿尼玛）、古典占星（宿命点/南北交点）与子平八字（十神/喜忌），打造一份“灵魂说明书”。
         - **字数与结构**：Summary 部分必须洋洋洒洒，至少 1200 字，分为 6-8 个自然段。每段开头必须有一个富有哲理的小标题。
             - 段落1：**灵魂底色与业力**（分析南北交点/日柱，揭示你此生情感的终极课题）。
             - 段落2：**潜意识的阴影**（分析月亮/八字忌神，剖析你总是爱上某类人或在某处跌倒的深层心理原因）。
             - 段落3：**当下的能量场**（结合2026流年星象，解读土星/木星对你命盘的具体触发）。
             - 段落4：**未来的剧本**（基于运势推演，描绘未来3年的情感蓝图）。
         - **深度八字解析**：必须使用专业术语但通俗解释（如“伤官见官”、“财滋弱杀”），精准分析你的性格光影。
         - **星盘深度配置**：必须深入分析金星（价值观）、火星（行动力）、月亮（安全感）的相位互动，并指出“凯龙星”带来的疗愈方向。
         - **真命天子/天女画像**：**拒绝模棱两可**！必须包含：
             - **外貌**：具体到身高区间、发质、穿衣风格（如“日系工装”、“极简性冷淡风”）。
             - **职业**：具体到行业细分（如“独立策展人”、“外科医生”、“金融分析师”）。
             - **性格**：具体的MBTI类型猜测，以及与你的互动模式（如“他会包容你的焦虑，但无法忍受你的冷战”）。
             - **相遇契机**：具体的流年触发点（如“2026年5月金星过境本命七宫时”）。
         - **行动建议**：Action Plan 必须包含 5-7 个大项。每一项都必须是“心理学+玄学”的双重建议（例如：“佩戴黑曜石的同时，练习每天对着镜子说...”）。
         - **语气升级**：文字要有文学性，像《百年孤独》或《月亮与六便士》的笔触，深情、苍凉而又充满希望。
      `
    } else if (req.body.ui_context?.report_type === 'love_coach') {
      systemPrompt = `你是「灵犀指引」的顶级恋爱军师与情感博弈专家。你的任务是根据用户提供的目标对象信息（MBTI、性格关键词、兴趣爱好）以及当前的核心困扰，生成一份**高情商、可执行的实战恋爱攻略**。

      **核心要求**：
      1. **局势研判**：基于博弈论和心理学，分析当前关系的权力高低、对方的真实心理状态。
      2. **拒绝鸡汤**：不要说“做你自己”这种废话。要给出具体的战术，例如“推拉话术”、“朋友圈建设”、“冷读技巧”。
      3. **针对性强**：
         - 如果对方是 INTJ/INTP，强调智性交流和独立空间。
         - 如果对方是回避型依恋（高冷/慢热），强调安全感建立和低压陪伴。
         - 如果是挽回局，强调“断联”与“二次吸引”。

      **输出控制（JSON格式）**：
      - **headline**: 一句直击痛点的局势总结（如“他在试探你的底线，你却在交出底牌”）。
      - **summary**: 核心洞察（300字左右），分析对方心理和当前局势。
      - **target_profile**: 对方心理画像（3-5点），深度剖析其性格弱点和核心需求。
      - **user_opportunity**: 你的优势与机会（3-5点）。
      - **action_plan**: 破局行动指南（3个阶段），每个阶段包含 title, desc, tip。
      - **scripts**: 实战话术库（3-5句），可以直接复制粘贴发给对方的话。
      - **warnings**: 避雷警示（3-5点），绝对不能做的事。
      `
    } else if (req.body.ui_context?.report_type === 'palm') {
      systemPrompt = `你是「灵犀指引」的手相大师。你的任务是根据用户上传的手相特征（感情线、智慧线、生命线、金星丘），生成一份**深度手相命运解读报告**。
      
      **核心要求**：
      1. **专注手相**：详细解读每一条纹路的含义（例如：感情线末端分叉代表什么），并结合流年推断。
      2. **性格映射**：通过掌纹反推用户的性格情感模式，深度剖析潜意识。
      3. **温暖治愈**：语气神秘而温暖，给予积极的心理暗示。
      
      **输出控制**：
      - Free: 预览版，点到为止。
      - Paid: 完整版，必须极其详细！
         - **字数要求**：Summary 部分不得少于 1000 字，细致入微。必须包含对手部“气色”和“形态”的综合分析。
         - **深度解读**：不仅仅是看线，还要分析“丘”的饱满度（如金星丘、月丘）对运势的具体影响。
         - **流年预测**：基于生命线和事业线的流年法，详细预测未来 5 年（2026-2030）的情感关键节点，并精确到可能的月份。
         - **详细建议**：针对手相弱点（如断掌、锁链纹）给出具体的化解方案和心理建设建议。
         - **行动指南**：Action Plan 必须极其详尽，包含 5-7 个针对性的改运指南（涵盖手部护理、饰品佩戴、能量手印、心态调整、生活习惯），每个指南都要有具体的操作步骤和预期效果。
      `
    }

    // If it's a FREE preview, use Local Fast Logic to guarantee speed and stability
    // AI is only used for PAID/FULL reports to ensure premium value
    // EXCEPTION: Palm reports and now Astrology reports both use AI for better quality analysis
    if (entitlements.pay_status !== 'paid' && req.body.ui_context?.report_type !== 'palm' && req.body.ui_context?.report_type !== 'astrology' && req.body.ui_context?.report_type !== 'love_coach') {
       console.log('Generating Fast Preview Report (Local Logic)...');
       
       // Calculate Zodiac Sign
       // Prioritize full date string (YYYY-MM-DD) over just time
       const dateStr = signals.birthday?.date || user_profile.birth_time || '2000-01-01';
       console.log('Calculating zodiac for date:', dateStr);
       
       let birthDate = new Date(dateStr);
       if (isNaN(birthDate.getTime())) {
           // Fallback if parsing fails
           console.log('Invalid date, using default');
           birthDate = new Date('2000-01-01');
       }
       
       const month = birthDate.getMonth() + 1;
       const day = birthDate.getDate();
       console.log('Month:', month, 'Day:', day);
       
       const getZodiac = (m: number, d: number) => {
          if ((m == 1 && d >= 20) || (m == 2 && d <= 18)) return "水瓶座";
          if ((m == 2 && d >= 19) || (m == 3 && d <= 20)) return "双鱼座";
          if ((m == 3 && d >= 21) || (m == 4 && d <= 19)) return "白羊座";
          if ((m == 4 && d >= 20) || (m == 5 && d <= 20)) return "金牛座";
          if ((m == 5 && d >= 21) || (m == 6 && d <= 21)) return "双子座";
          if ((m == 6 && d >= 22) || (m == 7 && d <= 22)) return "巨蟹座";
          if ((m == 7 && d >= 23) || (m == 8 && d <= 22)) return "狮子座";
          if ((m == 8 && d >= 23) || (m == 9 && d <= 22)) return "处女座";
          if ((m == 9 && d >= 23) || (m == 10 && d <= 23)) return "天秤座";
          if ((m == 10 && d >= 24) || (m == 11 && d <= 22)) return "天蝎座";
          if ((m == 11 && d >= 23) || (m == 12 && d <= 21)) return "射手座";
          return "摩羯座";
       };
       const zodiac = getZodiac(month, day);

       // Zodiac-specific content database
       const zodiacContent: Record<string, any> = {
          "白羊座": {
             summary: [
                "白羊座的你，天生带着一股不服输的冲劲。你的星盘显示火星能量充沛，意味着你在感情中更倾向于直球对决，不喜欢拖泥带水。",
                "近期的星象可能会让你感到些许急躁，特别是当对方没有及时回应时。请记住，有时候慢下来，反而能看到更美的风景。",
                "八字中火旺的特质，让你像个小太阳一样发光发热，但也容易灼伤亲近的人。建议多尝试冥想或瑜伽，平衡内在的躁动。"
             ],
             strengths: ["行动力爆表", "真诚坦率", "保护欲强"],
             blindspots: ["缺乏耐心", "容易冲动", "忽略细节"],
             tag: "热情似火"
          },
          "金牛座": {
             summary: [
                "金牛座的你，是感官世界的鉴赏家。你的星盘中金星能量显著，这赋予了你对美、美食和稳定关系的极高追求。",
                "最近土星的相位可能让你对物质安全感产生焦虑，进而影响了恋爱心情。其实，你本身就是最大的财富，无需向外抓取。",
                "八字中土重的特质，让你稳重可靠，但有时也显得固执。试着接受一些突如其来的小惊喜，生活会更有趣。"
             ],
             strengths: ["稳重可靠", "审美极佳", "长情专一"],
             blindspots: ["固执己见", "占有欲强", "抗拒改变"],
             tag: "温润如玉"
          },
          "双子座": {
             summary: [
                "双子座的你，灵魂里住着两个有趣的灵魂。水星守护的你，思维敏捷，在感情中极度看重精神交流和新鲜感。",
                "近期的星象显示，你可能在两段关系或两种选择中摇摆不定。这是你探索自我的过程，不必为此感到内疚，但最终需要做出选择。",
                "八字中风象特质明显，让你灵动多变。建议多进行深度阅读或长途旅行，让漂浮的心找到一个临时的锚点。"
             ],
             strengths: ["幽默风趣", "思维灵活", "沟通达人"],
             blindspots: ["情绪多变", "缺乏定性", "容易分心"],
             tag: "灵动百变"
          },
          "巨蟹座": {
             summary: [
                "巨蟹座的你，拥有一颗柔软而敏感的心。月亮守护的你，家庭和归属感是你情感世界的基石，你总是默默照顾着身边的人。",
                "最近的情绪可能会像潮汐一样起伏不定，这其实是内心在提醒你：在爱别人之前，先好好抱抱自己。",
                "八字中水气充沛，赋予了你极强的共情能力。建议多接触带有泥土气息的大自然，让大地母亲给你力量。"
             ],
             strengths: ["温柔体贴", "顾家恋旧", "情感细腻"],
             blindspots: ["过于敏感", "情绪化", "自我保护过重"],
             tag: "温柔港湾"
          },
          "狮子座": {
             summary: [
                "狮子座的你，天生就是舞台的中心。太阳守护的你，自信、慷慨，在爱情中希望被崇拜，也愿意给予对方国王/女王般的待遇。",
                "近期的星象可能会挑战你的自尊心，或许是一次不被理解的表达。请相信，真正爱你的人，会看见你霸气背后的脆弱。",
                "八字中火土相生，让你既有领导力又有行动力。建议在感情中偶尔示弱，这种反差萌会让你更具吸引力。"
             ],
             strengths: ["自信大方", "忠诚护短", "领导力强"],
             blindspots: ["死要面子", "控制欲强", "以自我为中心"],
             tag: "耀眼王者"
          },
          "处女座": {
             summary: [
                "处女座的你，是细节的魔术师。水星赋予了你缜密的逻辑，你在感情中追求完美，往往通过服务和照顾对方来表达爱意。",
                "最近可能会因为对方的一些小毛病而抓狂，这是你追求完美的体现。试着练习“抓大放小”，不完美的关系才是有温度的。",
                "八字中土金相生，让你做事井井有条。建议多尝试一些混乱但有趣的艺术活动（如泼墨画），打破内心的秩序感。"
             ],
             strengths: ["细心体贴", "逻辑清晰", "追求卓越"],
             blindspots: ["吹毛求疵", "过度焦虑", "难以取悦"],
             tag: "完美主义"
          },
          "天秤座": {
             summary: [
                "天秤座的你，是优雅与和谐的化身。金星守护的你，在关系中极度追求平衡，你希望爱情是美好、体面且没有冲突的。",
                "近期的星象可能迫使你面对一些必须撕破脸的冲突。别害怕，真实的冲突比虚假的和平更能拉近两颗心的距离。",
                "八字中金气旺盛，赋予了你出众的气质。建议多练习果断决策，不要让犹豫消耗了你的魅力。"
             ],
             strengths: ["优雅迷人", "善解人意", "社交高手"],
             blindspots: ["优柔寡断", "回避冲突", "过度迎合"],
             tag: "优雅平衡"
          },
          "天蝎座": {
             summary: [
                "天蝎座的你，拥有洞穿灵魂的眼神。冥王星守护的你，对待感情极致、深刻，要么全有，要么全无，容不下一粒沙子。",
                "最近的直觉可能异常敏锐，察觉到了关系中的暗流涌动。请相信你的直觉，但表达时请带上一层温柔的滤镜。",
                "八字中水火交战的特质，让你内心充满了激情与矛盾。建议通过剧烈运动或深层心理咨询来释放积压的情绪。"
             ],
             strengths: ["深情专一", "直觉敏锐", "灵魂伴侣"],
             blindspots: ["多疑善妒", "控制欲强", "报复心重"],
             tag: "极致深情"
          },
          "射手座": {
             summary: [
                "射手座的你，是追逐自由的游吟诗人。木星守护的你，乐观、豁达，爱情对你来说是一场共同探索世界的冒险。",
                "近期的束缚感可能让你想逃离，也许是关系太粘稠了。试着和伴侣沟通你需要独立空间的需求，真正的爱是给彼此自由。",
                "八字中火木通明，让你才华横溢。建议去一个从未去过的地方，新的风景会给你的感情带来新的灵感。"
             ],
             strengths: ["乐观开朗", "热爱自由", "充满智慧"],
             blindspots: ["粗心大意", "承诺恐惧", "说话太直"],
             tag: "自由灵魂"
          },
          "摩羯座": {
             summary: [
                "摩羯座的你，是时间的攀登者。土星守护的你，成熟、稳重，在感情中虽然不善言辞，但会用实际行动许下一个长久的未来。",
                "最近的工作压力可能让你无暇顾及感情，导致伴侣有被冷落的感觉。试着每天抽出15分钟纯粹的聊天时间，这比昂贵的礼物更重要。",
                "八字中土气厚重，让你坚韧不拔。建议多尝试一些轻松的娱乐活动，卸下肩上的重担，展现你孩子气的一面。"
             ],
             strengths: ["责任感强", "成熟稳重", "潜力股"],
             blindspots: ["过于严肃", "不解风情", "工作狂"],
             tag: "稳重靠谱"
          },
          "水瓶座": {
             summary: [
                "水瓶座的你，是来自未来的思想家。天王星守护的你，特立独行，在感情中更看重精神共鸣，你需要的不仅是恋人，更是知己。",
                "近期的疏离感可能让你觉得没人懂你。其实，只要你愿意放下一点点防备，就会发现身边一直有人在尝试走进你的世界。",
                "八字中风水相依，让你思维跳跃。建议参加一些公益或社团活动，在群体中找到你的归属感和同频的人。"
             ],
             strengths: ["独立自主", "思维独特", "尊重差异"],
             blindspots: ["忽冷忽热", "疏离感强", "难以捉摸"],
             tag: "独特灵魂"
          },
          "双鱼座": {
             summary: [
                "双鱼座的你，是造梦的艺术家。海王星守护的你，浪漫、慈悲，在爱情中容易无条件付出，甚至牺牲自己来成全对方。",
                "最近可能会陷入某种情绪的漩涡，分不清现实与幻想。请记得，健康的爱是两个独立个体的结合，而不是谁依附于谁。",
                "八字中水气弥漫，赋予了你极强的艺术天赋。建议通过绘画、写作或音乐来表达你的情感，将情绪转化为作品。"
             ],
             strengths: ["浪漫多情", "心地善良", "极具灵性"],
             blindspots: ["不切实际", "容易受伤", "缺乏界限"],
             tag: "浪漫造梦"
          }
       };

       const content = zodiacContent[zodiac] || zodiacContent["白羊座"]; // Fallback

       // Simple Report Template
       const localReport = {
          version: 'preview',
          headline: `${zodiac}的专属星运：${content.tag}的你，值得最好的爱`,
          summary: content.summary,
          attraction_profile: {
             you_attract: [`欣赏${content.tag}特质的人`, "能够包容你小脾气的守护者"],
             you_miss: ["缺乏深度的表面之交", "无法与你精神共鸣的人"],
             key_strengths: content.strengths,
             key_blindspots: content.blindspots
          },
          action_plan: [
             {
                title: "提升桃花磁场",
                steps: ["本周试着穿一件暖色调的衣服", "在社交场合多停留 10 分钟"],
                scenario: "周末聚会",
                example_script: "很高兴认识你，我也对这个话题很感兴趣..."
             }
          ],
          weekly_focus: {
             theme: "接纳自我",
             do: ["记录三个优点", "主动发起一次邀约"],
             avoid: ["过度自省", "拒绝合理的帮助"]
          },
          share_card_copy: {
             title: `${zodiac} 恋爱说明书`,
             one_liner: "看似冷漠的冰山，实则是最长情的守候。",
             tags: [zodiac, "深情", "潜力股"]
          },
          paywall: {
             show: true,
             reason: `解锁完整版可查看：${zodiac} 2026 桃花运势时间轴、真命天子/天女的详细画像（外貌/职业/性格）、以及针对你命盘的专属改运建议。`,
             cta: { text: "解锁完整深度报告" },
             locked_items: ["2026 桃花时间轴", "真命天子详细画像", "专属改运建议"]
          }
       };

       res.json(localReport);
       return;
    }

    // Try AI generation first (Only for PAID users now)
    try {
      // Determine model based on report type to optimize speed/quality
      // Use qwen-max for complex astrology, qwen-plus for standard reports
      const modelName = req.body.ui_context?.report_type === 'astrology' ? 'qwen-max' : 'qwen-plus';

      console.log(`Attempting AI generation with model ${modelName}...`);
      console.log('Using API Key:', client.apiKey.slice(0, 6) + '******' + client.apiKey.slice(-4)); // Debug log
      
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
          { role: 'user', content: `Please generate the report based on this input:\n${JSON.stringify({user_profile, signals, entitlements})}\n\nOutput Format Requirement:\n${OUTPUT_FORMAT}` }
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
        
        // Post-processing for Paid Version Consistency
        if (entitlements.pay_status === 'paid') {
           reportData.paywall = { show: false } // Ensure paywall is hidden
           
           // Ensure it feels "long" and "warm" by checking array lengths (simple validation)
           if (reportData.summary.length < 3) reportData.summary.push("愿你在星河的指引下，找到那个与你灵魂共振的人。")
        } else {
           // Ensure preview logic
           reportData.paywall = {
            show: true,
            reason: "解锁完整版可查看：你的 2026 桃花运势时间轴、真命天子/天女的详细画像（外貌/职业/性格）、以及针对你星盘的专属改运建议。",
            cta: { text: "解锁完整深度报告" },
            locked_items: ["2026 桃花时间轴", "真命天子详细画像", "星盘改运建议"]
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
    
    // Adjust mock based on pay status
    if (entitlements.pay_status === 'paid') {
      mockResponse.version = 'full'
      mockResponse.paywall = { show: false } as any
      // Add more content to make it feel "long" and "value-for-money"
      mockResponse.summary.push("你的真爱可能出现在 5 月或 9 月的社交场合，尤其是那些与艺术或学习相关的聚会。这段时间你的金星能量最强，容易吸引到那些与你灵魂共鸣的人。建议多参加画展、读书会或者是小型的音乐现场，那里会是你邂逅良缘的圣地。")
      mockResponse.summary.push("记得多留意身边那个总是默默支持你的人，缘分或许早已种下。有时候，我们一直在寻找远方的风景，却忽略了身边最温暖的陪伴。回想一下，谁在你最无助的时候总是第一时间出现？或许，他/她就是你一直在等的那个对的人。")
      mockResponse.summary.push("从星盘流年来看，2026年是你情感转折的关键之年。上半年的木星换座会给你带来大量的人际机会，但也会带来一些烂桃花的干扰。你需要保持清醒的头脑，不要被表面的浮华所迷惑。下半年土星的相位会让你更加务实，这时候出现的对象，往往是能够陪你走入婚姻殿堂的合适人选。")
      
      // Add a dummy detailed timeline if missing (since mock data doesn't have it by default)
      mockResponse.action_plan.push({
        title: "2026 深度桃花运势时间轴 (Mock)",
        steps: [
            "第一季度（1-3月）：金星逆行结束，适合清理过去的感情包袱。建议进行一次彻底的大扫除，扔掉前任的物品，或者写一封不会寄出的信与过去告别。", 
            "第二季度（4-6月）：木星进入恋爱宫，魅力值爆表。这是脱单的最佳时机，建议每周至少安排一次社交活动，不要宅在家里。", 
            "第三季度（7-9月）：水星顺行，旧人回归或解开误会。如果之前有遗憾错过的缘分，这时候通过朋友重新建立联系，会有意想不到的转机。",
            "第四季度（10-12月）：土星顺行，关系趋于稳定。如果你已经有了伴侣，这时候适合讨论订婚或结婚的话题；如果是单身，年底的聚会中会遇到一个稳重可靠的对象。"
        ],
        scenario: "年度运势规划",
        example_script: "保持开放心态，好运自来。当机会来临时，勇敢地伸出手去抓住它。"
      })

      mockResponse.action_plan.push({
          title: "真命天子/天女详细画像 (Mock)",
          steps: [
              "外貌特征：身高偏高，体型匀称偏瘦，眼神深邃，手指修长。平时喜欢穿着简约舒适的棉麻质地衣服，给人一种干净清爽的感觉。",
              "性格特征：外表看起来可能有点高冷或慢热，但内心非常细腻温暖。做事有计划有条理，是一个典型的实干家。在感情中不善言辞，但会用行动来表达爱意。",
              "职业方向：从事技术、金融、医疗或法律等专业性较强的行业。工作非常忙碌，但懂得平衡生活。"
          ],
          scenario: "遇见对的人",
          example_script: "当你遇到符合这些特征的人时，不妨多给彼此一点时间了解。"
      })
    }

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

    // Astrology specific fallback
    if (user_profile.report_type === 'astrology') {
       mockResponse.headline = "星盘指引：星辰为你铺就的命运轨迹";
       mockResponse.summary = [
         "你的星盘显示，你的太阳与金星呈和谐相位，预示着你在人际交往中具有天然的魅力。",
         "流年土星的影响正在减弱，这标志着过去两年的情感压力即将解除，新的机遇正在萌芽。",
         "结合八字五行来看，你命格中水木相生，非常适合在柔和、具有艺术气息的环境中邂逅良缘。"
       ];
       mockResponse.attraction_profile.you_attract = ["情感细腻的艺术家型伴侣", "稳重可靠的实干家"];
       mockResponse.attraction_profile.key_strengths = ["极具同理心", "审美独特", "温柔包容"];
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
