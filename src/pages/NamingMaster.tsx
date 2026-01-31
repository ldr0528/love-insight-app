import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, PenTool, Sparkles, User, Briefcase, Wand2, ChevronDown, ChevronUp, Copy, RefreshCcw, Heart, Info, X, Crown, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { generateName } from '@/services/aiNaming';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';

type NamingType = 'baby' | 'company' | 'brand';

// Baby Naming Options
const NAME_STYLES = ['古风', '现代', '文雅', '大气', '清爽', '独特'];
const NAME_MEANINGS = ['品德', '智慧', '健康', '勇敢', '温柔', '自由'];

// Company Naming Options
const BRAND_TONES = ['专业', '年轻', '高端', '亲民', '科技', '国潮', '稳重', '创新', '奢华', '极简', '活力', '温暖'];
const TARGET_AUDIENCES = ['B端企业', '大众消费者', '女性群体', '男性群体', '亲子家庭', 'Z世代', '银发族', '极客/发烧友', '高端商务'];
const BRAND_LANGUAGES = ['中文', '中英混合', '英文'];

export default function NamingMaster() {
  const { user, openAuthModal } = useAuthStore();
  const navigate = useNavigate();

  const [namingType, setNamingType] = useState<NamingType>('baby');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showTimeInput, setShowTimeInput] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      openAuthModal();
      navigate('/');
      return;
    }
    if (!user.isVip) {
      navigate('/recharge');
    }
  }, [user, navigate, openAuthModal]);

  // Baby Form States
  const [babyForm, setBabyForm] = useState({
    lastName: '',
    birthDate: '', // YYYY-MM-DD
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    birthTime: '', // HH:mm
    uncertainTime: false,
    timeBranch: '', // 子/丑/寅/...
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
    includeKeywords: '',
    avoidKeywords: '',
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
    setResult(null);
    setError(null);
    
    try {
      // Force master version settings: count 10, detailed true
      const params = namingType === 'baby' 
        ? { type: 'baby', ...babyForm, _t: Date.now(), count: 10, detailed: true } 
        : { type: 'company', ...companyForm, _t: Date.now(), count: 10, detailed: true };
        
      const data = await generateName(params);
      setResult(data);
      
      // Auto-scroll to results with a slight delay to ensure rendering
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          toast.success('好名已生成！👇', { duration: 3000 });
        }
      }, 100);
      
    } catch (err: any) {
      console.error("Naming generation failed:", err);
      setError(err.message || '生成失败，请稍后重试');
    } finally {
      setIsLoading(false);
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
            className={`flex-1 py-3 rounded-xl text-base font-bold transition-all flex items-center justify-center gap-2 ${
              namingType === 'baby' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <User className="w-5 h-5" /> 宝宝起名
          </button>
          <button
            onClick={() => { setNamingType('company'); setResult(null); }}
            className={`flex-1 py-3 rounded-xl text-base font-bold transition-all flex items-center justify-center gap-2 ${
              namingType === 'company' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Briefcase className="w-5 h-5" /> 公司/品牌起名
          </button>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
          {namingType === 'baby' ? (
            <>
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">宝宝姓氏</label>
                  <input
                    type="text"
                    value={babyForm.lastName}
                    onChange={(e) => setBabyForm({...babyForm, lastName: e.target.value})}
                    placeholder="例如：李"
                    className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-base"
                  />
                </div>
                <div>
                   <label className="block text-base font-medium text-gray-700 mb-2">性别</label>
                   <div className="flex bg-gray-50 rounded-xl p-1 h-[52px]">
                      <button 
                        onClick={() => setBabyForm({...babyForm, gender: 'boy'})}
                        className={`flex-1 rounded-lg text-base font-medium transition-all flex items-center justify-center gap-1 ${babyForm.gender === 'boy' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-500'}`}
                      >
                        👦 男孩
                      </button>
                      <button 
                        onClick={() => setBabyForm({...babyForm, gender: 'girl'})}
                        className={`flex-1 rounded-lg text-base font-medium transition-all flex items-center justify-center gap-1 ${babyForm.gender === 'girl' ? 'bg-pink-100 text-pink-700 shadow-sm' : 'text-gray-500'}`}
                      >
                        👧 女孩
                      </button>
                   </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-base font-medium text-gray-700">出生日期 (阳历)</label>
                  <button 
                    onClick={() => setShowTimeInput(!showTimeInput)}
                    className="text-sm text-purple-600 font-medium hover:underline flex items-center gap-1"
                  >
                    {showTimeInput ? '隐藏时间' : '+ 添加出生时间'}
                  </button>
                </div>
                <div className="flex gap-2 mb-2">
                   <div className="flex-1 relative">
                     <select
                       value={babyForm.birthYear}
                       onChange={(e) => setBabyForm({...babyForm, birthYear: e.target.value})}
                       className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-base appearance-none bg-white"
                     >
                       <option value="">年份</option>
                       {Array.from({length: 100}, (_, i) => new Date().getFullYear() - i).map(year => (
                         <option key={year} value={year}>{year}年</option>
                       ))}
                     </select>
                     <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
                   </div>
                   <div className="flex-1 relative">
                     <select
                       value={babyForm.birthMonth}
                       onChange={(e) => setBabyForm({...babyForm, birthMonth: e.target.value})}
                       className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-base appearance-none bg-white"
                     >
                       <option value="">月份</option>
                       {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                         <option key={month} value={month}>{month}月</option>
                       ))}
                     </select>
                     <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
                   </div>
                   <div className="flex-1 relative">
                     <select
                       value={babyForm.birthDay}
                       onChange={(e) => setBabyForm({...babyForm, birthDay: e.target.value})}
                       className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-base appearance-none bg-white"
                     >
                       <option value="">日期</option>
                       {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                         <option key={day} value={day}>{day}日</option>
                       ))}
                     </select>
                     <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
                   </div>
                </div>
                
                {showTimeInput && !babyForm.uncertainTime && (
                  <div className="relative w-full">
                    <input
                      type="time"
                      value={babyForm.birthTime}
                      onChange={(e) => setBabyForm({...babyForm, birthTime: e.target.value})}
                      className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-base appearance-none"
                    />
                  </div>
                )}
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={babyForm.uncertainTime}
                      onChange={(e) => setBabyForm({...babyForm, uncertainTime: e.target.checked, birthTime: e.target.checked ? '' : babyForm.birthTime})}
                    />
                    具体时间不确定，用时辰代替
                  </label>
                  <div className="relative">
                    <select
                      disabled={!babyForm.uncertainTime}
                      value={babyForm.timeBranch}
                      onChange={(e) => setBabyForm({...babyForm, timeBranch: e.target.value})}
                      className={`p-3.5 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm appearance-none ${babyForm.uncertainTime ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
                    >
                      <option value="">选择时辰</option>
                      {['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'].map(s => (
                        <option key={s} value={s}>{s}时</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Preferences Toggle */}
              <div>
                <button 
                  onClick={() => setShowPreferences(!showPreferences)}
                  className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-xl text-purple-700 font-medium hover:bg-purple-100 transition-colors"
                >
                  <span className="flex items-center gap-2 text-base">
                    <Sparkles className="w-5 h-5" /> 偏好设置 (选填)
                  </span>
                  {showPreferences ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>

                {showPreferences && (
                  <div className="mt-4 space-y-5 animate-fade-in p-2">
                     {/* Name Length */}
                     <div>
                        <label className="block text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">名字字数</label>
                        <div className="flex gap-3">
                          {['2', '3'].map((len) => (
                            <button
                              key={len}
                              onClick={() => setBabyForm({...babyForm, nameLength: len})}
                              className={`px-5 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                                babyForm.nameLength === len 
                                ? 'border-purple-500 bg-purple-50 text-purple-700' 
                                : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                              }`}
                            >
                              {len}字
                            </button>
                          ))}
                        </div>
                     </div>

                     {/* Style */}
                     <div>
                        <label className="block text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">风格 (多选)</label>
                        <div className="flex flex-wrap gap-2.5">
                          {NAME_STYLES.map((style) => (
                            <button
                              key={style}
                              onClick={() => setBabyForm({...babyForm, styles: toggleSelection(babyForm.styles, style)})}
                              className={`px-4 py-2 rounded-full text-sm border transition-all ${
                                babyForm.styles.includes(style)
                                ? 'border-purple-500 bg-purple-50 text-purple-700 font-bold' 
                                : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                              }`}
                            >
                              {style}
                            </button>
                          ))}
                        </div>
                     </div>

                     {/* Meaning */}
                     <div>
                        <label className="block text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">寓意方向 (多选)</label>
                        <div className="flex flex-wrap gap-2.5">
                          {NAME_MEANINGS.map((m) => (
                            <button
                              key={m}
                              onClick={() => setBabyForm({...babyForm, meanings: toggleSelection(babyForm.meanings, m)})}
                              className={`px-4 py-2 rounded-full text-sm border transition-all ${
                                babyForm.meanings.includes(m)
                                ? 'border-purple-500 bg-purple-50 text-purple-700 font-bold' 
                                : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
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
                          <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">避讳/禁用字</label>
                          <input 
                            type="text" 
                            placeholder="如：国、强"
                            value={babyForm.avoidChars}
                            onChange={(e) => setBabyForm({...babyForm, avoidChars: e.target.value})}
                            className="w-full p-3 text-base border border-gray-200 rounded-xl focus:ring-1 focus:ring-purple-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">辈分字/固定字</label>
                          <input 
                            type="text" 
                            placeholder="如：梓"
                            value={babyForm.fixedChar}
                            onChange={(e) => setBabyForm({...babyForm, fixedChar: e.target.value})}
                            className="w-full p-3 text-base border border-gray-200 rounded-xl focus:ring-1 focus:ring-purple-500 outline-none"
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
                    <option value="telecom">通信/网络</option>
                    <option value="semiconductor">半导体/芯片</option>
                    <option value="ai">人工智能/大数据</option>
                    <option value="manufacturing">智能制造/工业</option>
                    <option value="food">餐饮/食品</option>
                    <option value="beauty">美妆/护肤</option>
                    <option value="fashion">服装/时尚</option>
                    <option value="education">教育/培训</option>
                    <option value="finance">金融/投资</option>
                    <option value="medical">医疗/健康</option>
                    <option value="realestate">房地产/建筑</option>
                    <option value="media">文化/传媒</option>
                    <option value="logistics">物流/运输</option>
                    <option value="energy">新能源/环保</option>
                    <option value="service">生活服务</option>
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

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">必须包含关键词 (可选)</label>
                  <input
                    type="text"
                    value={companyForm.includeKeywords}
                    onChange={(e) => setCompanyForm({...companyForm, includeKeywords: e.target.value})}
                    placeholder="例如：包含“智、创、光”等"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">需要避免的关键词 (可选)</label>
                  <input
                    type="text"
                    value={companyForm.avoidKeywords}
                    onChange={(e) => setCompanyForm({...companyForm, avoidKeywords: e.target.value})}
                    placeholder="例如：避免“通、达、联”等"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                </div>
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

          <div className="mb-4">
            {/* VIP Status Banner (Always show active) */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">尊贵大师版已激活</h3>
                  <p className="text-sm text-gray-600">正在为您提供深度五行分析与更多候选结果</p>
                </div>
              </div>
            </div>
          </div>

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

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-fade-in">
              <X className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div ref={resultsRef} className="space-y-6 animate-fade-in pb-12 scroll-mt-20">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-pulse">
               <CheckCircle className="w-6 h-6 text-green-600" />
               <div>
                 <h3 className="font-bold text-green-800">已为您生成 10 个精选好名</h3>
                 <p className="text-sm text-green-700">请向下查看大师解析与详细评分</p>
               </div>
            </div>

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

            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
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

                    {/* VIP Analysis */}
                    {item.wuxing && (
                      <div className="border-t border-amber-100 bg-amber-50/50 -mx-6 -mb-6 mt-4 p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Crown className="w-4 h-4 text-amber-600" />
                          <span className="text-sm font-bold text-amber-800">大师深度解析</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex gap-2 text-sm">
                            <span className="text-amber-700 font-medium shrink-0">五行属性：</span>
                            <span className="text-gray-700 font-bold">{item.wuxing}</span>
                          </div>
                          {item.wuxingAnalysis && (
                            <div className="flex gap-2 text-sm">
                              <span className="text-amber-700 font-medium shrink-0">五行分析：</span>
                              <span className="text-gray-600 leading-relaxed">{item.wuxingAnalysis}</span>
                            </div>
                          )}
                          {item.luck && (
                            <div className="flex gap-2 text-sm">
                              <span className="text-amber-700 font-medium shrink-0">运势简评：</span>
                              <span className="text-gray-600 leading-relaxed">{item.luck}</span>
                            </div>
                          )}
                          {item.sancai && (
                            <div className="flex gap-2 text-sm">
                              <span className="text-amber-700 font-medium shrink-0">三才五格：</span>
                              <span className="text-gray-700">{item.sancai}</span>
                            </div>
                          )}
                          {item.zodiac && (
                            <div className="flex gap-2 text-sm">
                              <span className="text-amber-700 font-medium shrink-0">生肖喜忌：</span>
                              <span className="text-gray-700">{item.zodiac}</span>
                            </div>
                          )}
                          {item.poem && (
                            <div className="flex gap-2 text-sm">
                              <span className="text-amber-700 font-medium shrink-0">诗词出处：</span>
                              <span className="text-gray-700 italic">“{item.poem}”</span>
                            </div>
                          )}
                          {item.score && (
                            <div className="flex gap-2 text-sm">
                              <span className="text-amber-700 font-medium shrink-0">综合评分：</span>
                              <span className="text-gray-700 font-bold">{item.score}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className={`flex justify-end gap-3 pt-4 border-t border-gray-100 ${item.wuxing ? 'mt-0 bg-amber-50/50 px-6 pb-6 border-none' : 'mt-4'}`}>
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
                    
                    {(item.rationale || item.phonetics || item.positioning || item["don'ts"]) && (
                      <div className="grid sm:grid-cols-2 gap-3 mt-4">
                        {item.rationale && (
                          <div className="bg-indigo-50 p-3 rounded-xl">
                            <div className="text-xs font-bold text-indigo-600 mb-1">命名理由</div>
                            <div className="text-sm text-gray-700">{item.rationale}</div>
                          </div>
                        )}
                        {item.phonetics && (
                          <div className="bg-indigo-50 p-3 rounded-xl">
                            <div className="text-xs font-bold text-indigo-600 mb-1">读音特点</div>
                            <div className="text-sm text-gray-700">{item.phonetics}</div>
                          </div>
                        )}
                        {item.positioning && (
                          <div className="bg-indigo-50 p-3 rounded-xl">
                            <div className="text-xs font-bold text-indigo-600 mb-1">品牌定位关键词</div>
                            <div className="text-sm text-gray-700">{Array.isArray(item.positioning) ? item.positioning.join('、') : item.positioning}</div>
                          </div>
                        )}
                        {item["don'ts"] && (
                          <div className="bg-indigo-50 p-3 rounded-xl">
                            <div className="text-xs font-bold text-indigo-600 mb-1">避免词</div>
                            <div className="text-sm text-gray-700">{Array.isArray(item["don'ts"]) ? item["don'ts"].join('、') : item["don'ts"]}</div>
                          </div>
                        )}
                      </div>
                    )}
                    
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
          {/* Unlock Banner - Removed as functionality is now VIP-gated at entry */}
          {/* {!isVip && (
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 sm:p-6 text-white shadow-xl relative overflow-hidden group cursor-pointer" onClick={() => setShowPaymentModal(true)}>
                ...
              </div>
            )} */}
          </div>
        )}
      </div>
    </div>
  );
}
