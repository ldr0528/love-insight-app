
// Mocking OpenAI API for now as per instructions to "call ai" but assuming we need to set up the structure first.
// In a real scenario, this would be a server-side route (e.g., Vercel Function).

export async function generateName(params: any) {
  // Simulating an AI call delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // In production, this would call OpenAI:
  // const completion = await openai.chat.completions.create({ ... })

  console.log('Generating name with params:', params);

  if (params.type === 'baby') {
    return generateBabyNames(params);
  } else {
    return generateCompanyNames(params);
  }
}

function generateBabyNames(params: any) {
    const lastName = params.lastName || '李';
    const gender = params.gender === 'boy' ? '男孩' : '女孩';
    const style = params.styles?.join('、') || '大气';
    
    // Mock AI response logic based on inputs to make it feel "real"
    if (gender === '男孩') {
        return [
            { 
              name: lastName + '浩宇', 
              pinyin: 'Hào Yǔ', 
              meaning: '浩瀚宇宙，心胸开阔。寓意拥有广阔的胸怀与无限的未来。',
              tags: ['水土', style],
              ratings: { sound: 95, meaning: 98, unique: 88 },
              reasons: ['“浩”字五行属水，补足八字喜用。', '声调跌宕起伏，响亮大气。']
            },
            { 
              name: lastName + '铭泽', 
              pinyin: 'Míng Zé', 
              meaning: '铭记恩泽，光耀门楣。寓意懂得感恩，且有才华与福气。',
              tags: ['金水', '文雅'],
              ratings: { sound: 92, meaning: 95, unique: 90 },
              reasons: ['“铭”刻骨铭心，“泽”润泽万物。', '字形优美，利于书写。']
            },
             { 
              name: lastName + '翊宸', 
              pinyin: 'Yì Chén', 
              meaning: '辅佐帝王，位高权重。寓意才华出众，有领导风范。',
              tags: ['木金', '独特'],
              ratings: { sound: 94, meaning: 96, unique: 95 },
              reasons: ['“翊”指辅佐，“宸”指帝王居所。', '古风韵味浓厚，不落俗套。']
            }
        ];
    } else {
        return [
            { 
              name: lastName + '悦溪', 
              pinyin: 'Yuè Xī', 
              meaning: '喜悦如溪水般长流。寓意生活快乐，性格温柔灵动。',
              tags: ['金水', '清爽'],
              ratings: { sound: 96, meaning: 94, unique: 90 },
              reasons: ['“悦”心生欢喜，“溪”清澈见底。', '读音轻快，给人愉悦之感。']
            },
            { 
              name: lastName + '语汐', 
              pinyin: 'Yǔ Xī', 
              meaning: '温言软语，潮汐往复。寓意善于表达，情感丰富且有深度。',
              tags: ['木水', '古风'],
              ratings: { sound: 93, meaning: 95, unique: 92 },
              reasons: ['“语”妙语连珠，“汐”气势柔美。', '富有诗意，意境优美。']
            },
            { 
              name: lastName + '若初', 
              pinyin: 'Ruò Chū', 
              meaning: '人生若只如初见。寓意保持初心，纯真美好。',
              tags: ['木金', '文雅'],
              ratings: { sound: 90, meaning: 98, unique: 96 },
              reasons: ['取自纳兰性德名句，文化底蕴深厚。', '名字清新脱俗，不易重名。']
            }
        ];
    }
}

function generateCompanyNames(params: any) {
    const industry = params.industry || '科技';
    
    if (industry.includes('tech') || industry.includes('科技')) {
         return [
            { 
              name: '智界科技', 
              enName: 'IntelWorld', 
              slogans: ['智慧连接世界', '探索无限边界', '智界，让未来更近'],
              tags: ['科技感', '大气'],
              explanation: '“智”代表人工智能与智慧，“界”代表领域与世界。寓意在科技领域开疆拓土。'
            },
            { 
              name: '极光创想', 
              enName: 'AuroraIdea', 
              slogans: ['点亮创新之光', '极致灵感，无限可能', '如极光般绚烂'],
              tags: ['年轻', '创新'],
              explanation: '“极光”象征罕见与美丽的光芒，“创想”代表创造力。寓意企业创意无限，前景辉煌。'
            },
            { 
              name: '星链云', 
              enName: 'StarLinkCloud', 
              slogans: ['链接万物星辰', '云端之上的链接', '星链，构建数字宇宙'],
              tags: ['高端', 'B端'],
              explanation: '“星链”寓意广泛的连接，“云”代表数据服务。适合云计算或网络服务类企业。'
            }
          ];
    } else if (industry.includes('food') || industry.includes('餐饮')) {
         return [
            { 
              name: '味蕾时光', 
              enName: 'TasteTime', 
              slogans: ['品味美好时光', '舌尖上的记忆', '味蕾的专属旅程'],
              tags: ['亲民', '温馨'],
              explanation: '强调美食带来的幸福时光，名字亲切自然，易于传播。'
            },
            { 
              name: '鲜源纪', 
              enName: 'FreshEra', 
              slogans: ['源自新鲜，回归本味', '开启鲜食新纪元', '每一口都是新鲜'],
              tags: ['健康', '品质'],
              explanation: '“鲜”突出食材新鲜，“源”代表源头，“纪”象征新时代。适合主打健康食材的品牌。'
            },
             { 
              name: '食尚界', 
              enName: 'FoodStyle', 
              slogans: ['吃出时尚范', '美食新主张', '食尚，不只是吃'],
              tags: ['年轻', '时尚'],
              explanation: '将“美食”与“时尚”结合，吸引年轻消费群体。'
            }
         ];
    } else {
        return [
            { 
              name: '众信联合', 
              enName: 'UnionTrust', 
              slogans: ['众志成城，信达天下', '联合共赢未来', '值得信赖的伙伴'],
              tags: ['稳重', '大气'],
              explanation: '“众”代表大众，“信”代表诚信，“联合”代表合作。寓意诚信为本，合作共赢。'
            },
            { 
              name: '锦程优选', 
              enName: 'BrightChoice', 
              slogans: ['前程似锦，优选生活', '为你精选最好', '锦程，品质之选'],
              tags: ['高端', '品质'],
              explanation: '“锦程”寓意前程美好，“优选”代表高品质。适合服务或零售行业。'
            },
            { 
              name: '悦享生活', 
              enName: 'JoyLife', 
              slogans: ['喜悦分享，美好生活', '享受每一刻', '悦享，懂生活'],
              tags: ['亲民', '生活化'],
              explanation: '传达快乐、分享的生活态度，名字通俗易懂，亲和力强。'
            }
        ];
    }
}
