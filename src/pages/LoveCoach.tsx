import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Zap, ShieldAlert, Target, Sparkles, Loader2, Send, Copy, Check } from 'lucide-react';

interface CoachFormData {
  relation_stage: string;
  target_mbti: string;
  target_traits: string[];
  target_hobbies: string;
  current_issue: string;
}

const RELATION_STAGES = [
  { value: 'crush', label: '暗恋中', icon: '👀', color: 'from-pink-400 to-rose-500' },
  { value: 'ambiguous', label: '暧昧拉扯', icon: '🎣', color: 'from-purple-400 to-indigo-500' },
  { value: 'dating', label: '热恋期', icon: '💑', color: 'from-red-400 to-pink-500' },
  { value: 'cooling', label: '平淡/冷淡期', icon: '🧊', color: 'from-blue-400 to-cyan-500' },
  { value: 'conflict', label: '矛盾/冷战', icon: '💥', color: 'from-orange-400 to-red-500' },
  { value: 'breakup', label: '分手/挽回', icon: '💔', color: 'from-gray-400 to-slate-500' },
];

const TRAITS = [
  "高冷", "慢热", "粘人", "独立", "事业狂", "顾家", 
  "幽默", "敏感", "强势", "温柔", "文艺", "社牛", 
  "社恐", "直男/直女", "浪漫", "务实"
];

const MBTI_TYPES = [
  "不清楚", "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP"
];

export default function LoveCoach() {
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
  const [formData, setFormData] = useState<CoachFormData>({
    relation_stage: 'crush',
    target_mbti: '不清楚',
    target_traits: [],
    target_hobbies: '',
    current_issue: ''
  });
  const [result, setResult] = useState<any>(null);
  const [loadingText, setLoadingText] = useState("军师正在分析局势...");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (step === 'loading') {
      const texts = [
        "正在拆解对方心理防御机制...",
        "正在计算博弈筹码...",
        "正在检索高情商话术库...",
        "正在生成破局行动方案..."
      ];
      let i = 0;
      const interval = setInterval(() => {
        setLoadingText(texts[i % texts.length]);
        i++;
      }, 800);
      return () => clearInterval(interval);
    }
  }, [step]);

  const toggleTrait = (trait: string) => {
    setFormData(prev => {
      if (prev.target_traits.includes(trait)) {
        return { ...prev, target_traits: prev.target_traits.filter(t => t !== trait) };
      }
      if (prev.target_traits.length >= 5) return prev; // Limit to 5
      return { ...prev, target_traits: [...prev.target_traits, trait] };
    });
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSubmit = async () => {
    if (!formData.current_issue) return;
    
    setStep('loading');
    try {
      // Use relative path for production compatibility
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_profile: {
            report_type: 'love_coach',
          },
          signals: {
            coach_data: formData
          },
          entitlements: {
            pay_status: 'paid', // Simulate paid for now to get AI result
          },
          ui_context: { app_name: 'LoveInsight', report_type: 'love_coach' },
        }),
      });
      const data = await response.json();
      setResult(data);
      setStep('result');
    } catch (e) {
      console.error(e);
      setStep('input');
      alert('请求失败，请稍后重试');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white/90 backdrop-blur-md shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-20 border-b border-slate-100">
        <Link to="/" className="text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-2 font-medium">
          <ArrowLeft className="w-5 h-5" /> <span className="hidden md:inline">返回首页</span>
        </Link>
        <h1 className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-indigo-600 flex items-center gap-2">
          <Target className="w-6 h-6 text-rose-500" /> AI 恋爱军师
        </h1>
        <div className="w-20"></div> 
      </header>

      <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
        {step === 'input' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
            <div className="text-center space-y-3 py-4">
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">定制你的专属恋爱攻略</h2>
              <p className="text-slate-500 text-lg">基于心理学与博弈论，为你提供高情商行动指南</p>
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl shadow-indigo-100/50 p-6 md:p-10 space-y-10 border border-white">
              {/* 1. 关系阶段 */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                  <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs">1</span>
                  当前关系阶段
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {RELATION_STAGES.map(stage => (
                    <button
                      key={stage.value}
                      onClick={() => setFormData({...formData, relation_stage: stage.value})}
                      className={`relative overflow-hidden p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 group ${
                        formData.relation_stage === stage.value
                          ? 'border-transparent shadow-lg scale-[1.02]'
                          : 'border-slate-100 bg-slate-50/50 text-slate-400 hover:border-rose-200 hover:bg-white'
                      }`}
                    >
                      {formData.relation_stage === stage.value && (
                        <div className={`absolute inset-0 bg-gradient-to-br ${stage.color} opacity-10`} />
                      )}
                      {formData.relation_stage === stage.value && (
                         <div className={`absolute inset-0 border-2 border-rose-500 rounded-2xl`} />
                      )}
                      <span className="text-3xl group-hover:scale-110 transition-transform duration-300 filter drop-shadow-sm">{stage.icon}</span>
                      <span className={`font-bold text-sm ${formData.relation_stage === stage.value ? 'text-slate-800' : ''}`}>{stage.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. 对方画像 */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">2</span>
                  Ta 的画像
                </label>
                <div className="flex flex-col gap-4">
                   <div className="flex items-center gap-4">
                     <select 
                      value={formData.target_mbti}
                      onChange={(e) => setFormData({...formData, target_mbti: e.target.value})}
                      className="px-5 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 text-slate-700 font-bold text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer hover:border-indigo-200"
                     >
                       {MBTI_TYPES.map(t => <option key={t} value={t}>{t === '不清楚' ? 'MBTI 类型 (不清楚可不选)' : t}</option>)}
                     </select>
                     <span className="text-xs text-slate-400 font-medium">👈 知道 MBTI 会更准哦</span>
                   </div>
                   
                   <div className="flex flex-wrap gap-2">
                    {TRAITS.map(trait => (
                      <button
                        key={trait}
                        onClick={() => toggleTrait(trait)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                          formData.target_traits.includes(trait)
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105'
                            : 'bg-white border-2 border-slate-100 text-slate-400 hover:border-indigo-200 hover:text-indigo-500'
                        }`}
                      >
                        {trait}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. 兴趣爱好 */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs">3</span>
                  Ta 的爱好
                </label>
                <input
                  type="text"
                  placeholder="例如：喜欢打篮球、看展、养猫、玩王者荣耀..."
                  value={formData.target_hobbies}
                  onChange={(e) => setFormData({...formData, target_hobbies: e.target.value})}
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 text-slate-800 font-medium focus:outline-none focus:border-orange-500 focus:bg-white focus:shadow-lg focus:shadow-orange-100/50 transition-all placeholder:text-slate-300"
                />
              </div>

              {/* 4. 核心困扰 */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">4</span>
                  你的困扰
                </label>
                <textarea
                  rows={4}
                  placeholder="请详细描述你的情况... 例如：不知道怎么开启话题；感觉他对我很冷淡；我想挽回他但不知道怎么做..."
                  value={formData.current_issue}
                  onChange={(e) => setFormData({...formData, current_issue: e.target.value})}
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 text-slate-800 font-medium focus:outline-none focus:border-rose-500 focus:bg-white focus:shadow-lg focus:shadow-rose-100/50 transition-all placeholder:text-slate-300 resize-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!formData.current_issue}
                className="w-full py-5 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-rose-200 hover:shadow-2xl hover:shadow-rose-300 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                <Sparkles className="w-6 h-6 animate-pulse" /> 生成专属攻略
              </button>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-300 to-indigo-300 rounded-full blur-3xl animate-pulse opacity-50"></div>
              <div className="bg-white p-6 rounded-3xl shadow-2xl relative z-10 border border-slate-100">
                <Loader2 className="w-16 h-16 animate-spin text-rose-500" />
              </div>
            </div>
            <div className="text-center space-y-3 z-10">
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-indigo-600 animate-pulse">
                {loadingText}
              </h3>
              <p className="text-slate-400 font-medium">AI 正在调动 100w+ 情感案例库</p>
            </div>
          </div>
        )}

        {step === 'result' && result && (
          <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700 pb-12">
            {/* 1. Header Analysis */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
              <div className="bg-gradient-to-br from-rose-500 via-rose-600 to-pink-600 p-8 md:p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                  <Target className="w-64 h-64" />
                </div>
                <div className="relative z-10">
                  <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-4 border border-white/30">
                    局势研判报告
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-2 text-shadow-sm">{result.headline}</h2>
                </div>
              </div>
              
              <div className="p-6 md:p-10 space-y-8">
                {/* Summary Box */}
                <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-100 relative">
                   <div className="absolute -top-3 left-8 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm flex items-center gap-2 text-rose-600 font-bold text-sm">
                     <Target className="w-4 h-4" /> 核心洞察
                   </div>
                   <p className="text-slate-700 leading-relaxed text-justify font-medium">{result.summary}</p>
                </div>
                
                {/* Grid Analysis */}
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50 hover:shadow-md transition-shadow">
                     <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                       <span className="w-2 h-6 bg-blue-500 rounded-full"></span> 对方心理画像
                     </h3>
                     <ul className="space-y-3">
                       {result.target_profile?.map((item: string, i: number) => (
                         <li key={i} className="text-sm text-slate-700 flex gap-3 leading-relaxed">
                           <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i+1}</span>
                           {item}
                         </li>
                       ))}
                     </ul>
                   </div>
                   <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100/50 hover:shadow-md transition-shadow">
                     <h3 className="font-bold text-orange-900 mb-4 flex items-center gap-2">
                       <span className="w-2 h-6 bg-orange-500 rounded-full"></span> 你的优势与机会
                     </h3>
                     <ul className="space-y-3">
                       {result.user_opportunity?.map((item: string, i: number) => (
                         <li key={i} className="text-sm text-slate-700 flex gap-3 leading-relaxed">
                           <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i+1}</span>
                           {item}
                         </li>
                       ))}
                     </ul>
                   </div>
                </div>
              </div>
            </div>

            {/* 2. Action Strategy */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-6 md:p-10 border border-slate-100">
               <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-2xl bg-yellow-100 flex items-center justify-center text-yellow-600">
                   <Zap className="w-6 h-6 fill-current" />
                 </div>
                 破局行动指南
               </h3>
               
               <div className="space-y-8 relative before:absolute before:left-4 md:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-100">
                 {result.action_plan?.map((step: any, i: number) => (
                   <div key={i} className="relative pl-12 md:pl-16 group">
                     {/* Timeline Node */}
                     <div className="absolute left-0 top-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border-4 border-slate-100 text-slate-400 font-black flex items-center justify-center z-10 group-hover:border-yellow-400 group-hover:text-yellow-500 transition-colors shadow-sm">
                       {i + 1}
                     </div>
                     
                     <div className="bg-slate-50 rounded-2xl p-5 md:p-6 border border-slate-100 group-hover:bg-white group-hover:shadow-lg group-hover:border-yellow-100 transition-all duration-300">
                       <h4 className="font-bold text-lg text-slate-900 mb-2">{step.title}</h4>
                       <p className="text-slate-600 text-sm mb-4 leading-relaxed">{step.desc}</p>
                       <div className="bg-yellow-50/50 p-3 rounded-xl text-sm text-yellow-700/80 font-medium flex items-start gap-2">
                         <span className="text-lg">💡</span> {step.tip}
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* 3. Warnings */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-6 md:p-8 border border-slate-100">
               <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                   <ShieldAlert className="w-5 h-5 fill-current" />
                 </div>
                 避雷警示
               </h3>
               <div className="bg-red-50/50 rounded-2xl p-2">
                 <ul className="divide-y divide-red-100">
                   {result.warnings?.map((w: string, i: number) => (
                     <li key={i} className="py-4 px-2 flex gap-3 items-start">
                       <span className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs font-bold flex-shrink-0">!</span>
                       <span className="text-sm text-slate-700 font-medium pt-0.5">{w}</span>
                     </li>
                   ))}
                 </ul>
               </div>
            </div>

            <div className="flex justify-center pt-8">
              <button 
                onClick={() => setStep('input')}
                className="px-8 py-3 bg-white border-2 border-slate-200 text-slate-500 rounded-full font-bold hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 transition-all shadow-sm"
              >
                换个情况咨询
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}