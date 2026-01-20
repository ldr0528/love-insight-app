import React, { useState } from 'react';
import { ArrowLeft, PenTool, Sparkles, User, Briefcase, Wand2, ChevronDown, ChevronUp, Copy, RefreshCcw, Heart, Info, X } from 'lucide-react';
import { Link } from 'react-router-dom';

type NamingType = 'baby' | 'company' | 'brand';

// Baby Naming Options
const NAME_STYLES = ['古风', '现代', '文雅', '大气', '清爽', '独特'];
const NAME_MEANINGS = ['品德', '智慧', '健康', '勇敢', '温柔', '自由'];
const NAME_TONES = ['响亮', '柔和', '中性'];
const NAME_COMMONALITY = ['常见', '适中', '小众'];

// Company Naming Options
const BRAND_TONES = ['专业', '年轻', '高端', '亲民', '科技', '国潮'];
const TARGET_AUDIENCES = ['B端', '大众', '女性向', '男性向', '亲子'];
const BRAND_LANGUAGES = ['中文', '中英混合', '英文'];

export default function NamingMaster() {
  const [namingType, setNamingType] = useState<NamingType>('baby');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showTimeInput, setShowTimeInput] = useState(false);

  // Baby Form States
  const [babyForm, setBabyForm] = useState({
    lastName: '',
    birthDate: '', // YYYY-MM-DD
    birthTime: '', // HH:mm
    gender: 'boy',
    nameLength: '2', // '2' or '3'
    styles: [] as string[],
    meanings: [] as string[],
    tone: '',
    avoidChars: '',
    fixedChar: '',
    commonality: '适中',
  });

  // Company Form States
  const [companyForm, setCompanyForm] = useState({
    industry: '',
    customIndustry: '',
    tone: '',
    audience: '',
    language: '中文',
    keywords: '',
    description: '',
    city: '',
  });

  const toggleSelection = (list: string[], item: string) => {
    if (list.includes(item)) {
      return list.filter(i => i !== item);
    }
    if (list.length >= 2) return list; // Limit max selection
    return [...list, item];
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    // Simulate API call with different mock data based on type
    setTimeout(() => {
      setIsLoading(false);
      setResult(generateMockResult(namingType));
    }, 2000);
  };

  const generateMockResult = (type: NamingType) => {
    if (type === 'baby') {
      return [
        { 
          name: babyForm.lastName + (babyForm.gender === 'boy' ? '浩宇' : '梦瑶'), 
          pinyin: babyForm.gender === 'boy' ? 'Hào Yǔ' : 'Mèng Yáo',
          meaning: '浩瀚宇宙，心胸开阔，前程远大。寓意孩子未来拥有广阔的天地和无限的可能。',
          tags: ['水土', '大气'],
          ratings: { sound: 95, meaning: 98, unique: 88 },
          reasons: ['“浩”字五行属水，弥补了八字缺水的遗憾。', '与姓氏读音搭配朗朗上口，平仄协调。']
        },
        { 
          name: babyForm.lastName + (babyForm.gender === 'boy' ? '思淼' : '清婉'), 
          pinyin: babyForm.gender === 'boy' ? 'Sī Miǎo' : 'Qīng Wǎn', 
          meaning: '思绪如水，智慧深邃，灵动敏捷。象征着智慧与才情，如同流水般源远流长。',
          tags: ['金水', '文雅'],
          ratings: { sound: 92, meaning: 95, unique: 90 },
          reasons: ['“淼”字三水相叠，财运亨通。', '符合“文雅”的风格偏好。']
        },
        { 
          name: babyForm.lastName + (babyForm.gender === 'boy' ? '奕辰' : '芷若'), 
          pinyin: babyForm.gender === 'boy' ? 'Yì Chén' : 'Zhǐ Ruò', 
          meaning: '神采奕奕，如星辰般璀璨耀眼。代表着朝气蓬勃，如初升的太阳般充满希望。',
          tags: ['木土', '现代'],
          ratings: { sound: 96, meaning: 92, unique: 94 },
          reasons: ['“奕”字寓意精神饱满，神采飞扬。', '避开了生僻字，书写美观。']
        },
      ];
    } else {
      return [
        { 
          name: '智创未来', 
          enName: 'FutureMind', 
          slogans: ['智慧创造未来', '引领行业创新', '智创，不止于想'],
          tags: ['科技感', '大气'],
          explanation: '“智”代表智慧、智能，“创”代表创新、创造。寓意公司以智慧引领创新，开创美好未来。'
        },
        { 
          name: '云启科技', 
          enName: 'CloudStart', 
          slogans: ['云端开启，无限可能', '连接你我，启动未来', '云启，智慧之源'],
          tags: ['专业', 'B端'],
          explanation: '“云”象征云计算、高科技，“启”代表开启、启动。适合科技类公司，寓意在云端开启新的篇章。'
        },
        { 
          name: '极客空间', 
          enName: 'GeekSpace', 
          slogans: ['追求极致，探索前沿', '极客精神，改变世界', '你的专属极客空间'],
          tags: ['新潮', '年轻'],
          explanation: '“极客”代表追求极致、热爱技术的精神，“空间”代表无限的想象力和发展空间。'
        },
      ];
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center p-4">
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-8 pt-4">
        <Link to="/" className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <PenTool className="w-6 h-6 text-purple-600" />
          缘名堂
        </h1>
        <div className="w-10"></div>
      </div>

      <div className="w-full max-w-2xl space-y-6">
        {/* Type Selection */}
        <div className="bg-white rounded-2xl p-2 shadow-sm flex">
          <button
            onClick={() => { setNamingType('baby'); setResult(null); }}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              namingType === 'baby' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <User className="w-4 h-4" /> 宝宝起名
          </button>
          <button
            onClick={() => { setNamingType('company'); setResult(null); }}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              namingType === 'company' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Briefcase className="w-4 h-4" /> 公司/品牌起名
          </button>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
          {namingType === 'baby' ? (
            <>
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">宝宝姓氏</label>
                  <input
                    type="text"
                    value={babyForm.lastName}
                    onChange={(e) => setBabyForm({...babyForm, lastName: e.target.value})}
                    placeholder="例如：李"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">性别</label>
                   <div className="flex bg-gray-50 rounded-xl p-1">
                      <button 
                        onClick={() => setBabyForm({...babyForm, gender: 'boy'})}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${babyForm.gender === 'boy' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-500'}`}
                      >
                        👦 男孩
                      </button>
                      <button 
                        onClick={() => setBabyForm({...babyForm, gender: 'girl'})}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${babyForm.gender === 'girl' ? 'bg-pink-100 text-pink-700 shadow-sm' : 'text-gray-500'}`}
                      >
                        👧 女孩
                      </button>
                   </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">出生日期 (阳历)</label>
                  <button 
                    onClick={() => setShowTimeInput(!showTimeInput)}
                    className="text-xs text-purple-600 font-medium hover:underline"
                  >
                    {showTimeInput ? '隐藏时间' : '+ 添加出生时间'}
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={babyForm.birthDate}
                    onChange={(e) => setBabyForm({...babyForm, birthDate: e.target.value})}
                    className="flex-grow p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                  {showTimeInput && (
                    <input
                      type="time"
                      value={babyForm.birthTime}
                      onChange={(e) => setBabyForm({...babyForm, birthTime: e.target.value})}
                      className="w-32 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    />
                  )}
                </div>
              </div>

              {/* Preferences Toggle */}
              <div>
                <button 
                  onClick={() => setShowPreferences(!showPreferences)}
                  className="w-full flex items-center justify-between p-3 bg-purple-50 rounded-xl text-purple-700 font-medium hover:bg-purple-100 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> 偏好设置 (选填)
                  </span>
                  {showPreferences ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showPreferences && (
                  <div className="mt-4 space-y-4 animate-fade-in p-2">
                     {/* Name Length */}
                     <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">名字字数</label>
                        <div className="flex gap-3">
                          {['2', '3'].map((len) => (
                            <button
                              key={len}
                              onClick={() => setBabyForm({...babyForm, nameLength: len})}
                              className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                                babyForm.nameLength === len 
                                ? 'border-purple-500 bg-purple-50 text-purple-700 font-bold' 
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                              }`}
                            >
                              {len}字
                            </button>
                          ))}
                        </div>
                     </div>

                     {/* Style */}
                     <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">风格 (多选)</label>
                        <div className="flex flex-wrap gap-2">
                          {NAME_STYLES.map((style) => (
                            <button
                              key={style}
                              onClick={() => setBabyForm({...babyForm, styles: toggleSelection(babyForm.styles, style)})}
                              className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                                babyForm.styles.includes(style)
                                ? 'border-purple-500 bg-purple-50 text-purple-700 font-bold' 
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                              }`}
                            >
                              {style}
                            </button>
                          ))}
                        </div>
                     </div>

                     {/* Meaning */}
                     <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">寓意方向 (多选)</label>
                        <div className="flex flex-wrap gap-2">
                          {NAME_MEANINGS.map((m) => (
                            <button
                              key={m}
                              onClick={() => setBabyForm({...babyForm, meanings: toggleSelection(babyForm.meanings, m)})}
                              className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                                babyForm.meanings.includes(m)
                                ? 'border-purple-500 bg-purple-50 text-purple-700 font-bold' 
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                     </div>
                     
                     {/* Advanced Inputs */}
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">避讳/禁用字</label>
                          <input 
                            type="text" 
                            placeholder="如：国、强"
                            value={babyForm.avoidChars}
                            onChange={(e) => setBabyForm({...babyForm, avoidChars: e.target.value})}
                            className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-purple-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">辈分字/固定字</label>
                          <input 
                            type="text" 
                            placeholder="如：梓"
                            value={babyForm.fixedChar}
                            onChange={(e) => setBabyForm({...babyForm, fixedChar: e.target.value})}
                            className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-purple-500 outline-none"
                          />
                        </div>
                     </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Company Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">所属行业</label>
                <div className="relative">
                  <select 
                    value={companyForm.industry}
                    onChange={(e) => setCompanyForm({...companyForm, industry: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none appearance-none bg-white"
                  >
                    <option value="">请选择行业...</option>
                    <option value="tech">科技/互联网</option>
                    <option value="food">餐饮/食品</option>
                    <option value="fashion">服装/时尚</option>
                    <option value="education">教育/培训</option>
                    <option value="finance">金融/投资</option>
                    <option value="other">其他</option>
                  </select>
                  <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </div>
                {companyForm.industry === 'other' && (
                  <input
                    type="text"
                    value={companyForm.customIndustry}
                    onChange={(e) => setCompanyForm({...companyForm, customIndustry: e.target.value})}
                    placeholder="请输入具体行业"
                    className="mt-2 w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">品牌调性</label>
                    <select 
                      value={companyForm.tone}
                      onChange={(e) => setCompanyForm({...companyForm, tone: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                    >
                      <option value="">选择调性</option>
                      {BRAND_TONES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">目标受众</label>
                    <select 
                      value={companyForm.audience}
                      onChange={(e) => setCompanyForm({...companyForm, audience: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                    >
                      <option value="">选择受众</option>
                      {TARGET_AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">命名语言</label>
                <div className="flex gap-2">
                  {BRAND_LANGUAGES.map(lang => (
                    <button
                      key={lang}
                      onClick={() => setCompanyForm({...companyForm, language: lang})}
                      className={`flex-1 py-2 rounded-lg text-sm border transition-all ${
                        companyForm.language === lang 
                        ? 'border-purple-500 bg-purple-50 text-purple-700 font-bold' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">必须包含/避免的关键词 (可选)</label>
                <input
                  type="text"
                  value={companyForm.keywords}
                  onChange={(e) => setCompanyForm({...companyForm, keywords: e.target.value})}
                  placeholder="例如：包含“智”，避免“通”"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">品牌描述/愿景</label>
                <textarea
                  value={companyForm.description}
                  onChange={(e) => setCompanyForm({...companyForm, description: e.target.value})}
                  placeholder="例如：主打年轻人的健康轻食，风格简约时尚..."
                  rows={2}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                />
              </div>
            </>
          )}

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" /> 正在推算...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" /> 立即生成好名
              </>
            )}
          </button>
          
          <p className="text-center text-xs text-gray-400 mt-2">
            {namingType === 'baby' 
             ? '注：仅用于生成风格与五行倾向建议；不保存或可随时删除' 
             : '注：生成结果不保证商标与域名可用，建议自行检索'}
          </p>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                 <Sparkles className="w-5 h-5 text-purple-500" /> 推荐结果
               </h2>
               <div className="flex gap-2">
                 <button onClick={handleGenerate} className="text-sm text-gray-500 flex items-center gap-1 hover:text-purple-600 transition-colors">
                   <RefreshCcw className="w-3 h-3" /> 换一批
                 </button>
               </div>
            </div>

            {result.map((item: any, index: number) => (
              <div key={index} className="bg-white rounded-2xl shadow-md border border-purple-50 overflow-hidden group hover:shadow-lg transition-all">
                {namingType === 'baby' ? (
                  // Baby Result Card
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-end gap-3 mb-1">
                          <h3 className="text-3xl font-bold text-gray-900">{item.name}</h3>
                          <span className="text-lg text-purple-600 font-medium pb-1">{item.pinyin}</span>
                        </div>
                        <p className="text-gray-600 text-sm">{item.meaning}</p>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                         {item.tags.map((tag: string, i: number) => (
                           <span key={i} className={`px-2 py-1 rounded-md text-xs font-bold ${i === 0 ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                             {tag}
                           </span>
                         ))}
                      </div>
                    </div>
                    
                    {/* Ratings */}
                    <div className="grid grid-cols-3 gap-4 mb-4 bg-gray-50 p-3 rounded-xl">
                       <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">音韵顺口</div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400 rounded-full" style={{width: `${item.ratings.sound}%`}}></div>
                          </div>
                       </div>
                       <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">寓意契合</div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-400 rounded-full" style={{width: `${item.ratings.meaning}%`}}></div>
                          </div>
                       </div>
                       <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">独特不生僻</div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-400 rounded-full" style={{width: `${item.ratings.unique}%`}}></div>
                          </div>
                       </div>
                    </div>

                    {/* Reasons */}
                    <div className="border-t border-gray-100 pt-4 mt-2">
                       <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider flex items-center gap-1">
                         <Info className="w-3 h-3" /> 推荐理由
                       </div>
                       <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                         {item.reasons.map((r: string, i: number) => (
                           <li key={i}>{r}</li>
                         ))}
                       </ul>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                       <button className="text-gray-400 hover:text-red-500 transition-colors">
                         <Heart className="w-5 h-5" />
                       </button>
                       <button className="text-gray-400 hover:text-blue-500 transition-colors">
                         <Copy className="w-5 h-5" />
                       </button>
                    </div>
                  </div>
                ) : (
                  // Company Result Card
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500 font-mono">{item.enName}</p>
                      </div>
                      <div className="flex gap-2">
                         {item.tags.map((tag: string, i: number) => (
                           <span key={i} className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md text-xs font-bold">
                             {tag}
                           </span>
                         ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-xl mb-4">
                      <div className="text-xs font-bold text-gray-500 mb-2">SLOGAN 建议</div>
                      <div className="space-y-1">
                        {item.slogans.map((s: string, i: number) => (
                          <div key={i} className="text-sm text-gray-700 italic">“{s}”</div>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed">
                      <span className="font-bold text-gray-800">释义：</span>
                      {item.explanation}
                    </p>
                    
                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                       <button className="text-gray-400 hover:text-red-500 transition-colors">
                         <Heart className="w-5 h-5" />
                       </button>
                       <button className="text-gray-400 hover:text-blue-500 transition-colors">
                         <Copy className="w-5 h-5" />
                       </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}