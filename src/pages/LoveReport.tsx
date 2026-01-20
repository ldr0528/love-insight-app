
import { useState } from 'react';
import { Loader2, Lock, Heart, ArrowRight, Share2, AlertCircle, RefreshCcw } from 'lucide-react';
import MBTIQuiz from '@/components/MBTIQuiz';

type RelationshipStage = 'single' | 'dating' | 'relationship' | 'breakup_recovery';
type Goal = 'improve_attraction' | 'stabilize_relationship' | 'improve_communication' | 'move_on' | 'other';
type PayStatus = 'free' | 'paid';

interface FormData {
  mbti: string;
  birthday: string;
  relationship_stage: RelationshipStage;
  goal: Goal;
}

interface ReportData {
  disclaimer: string;
  version: 'preview' | 'full';
  headline: string;
  summary: string[];
  attraction_profile: {
    you_attract: string[];
    you_miss: string[];
    key_strengths: string[];
    key_blindspots: string[];
  };
  action_plan: {
    title: string;
    steps: string[];
    scenario: string;
    example_script: string;
  }[];
  weekly_focus: {
    theme: string;
    do: string[];
    avoid: string[];
  };
  share_card_copy: {
    title: string;
    one_liner: string;
    tags: string[];
  };
  paywall?: {
    show: boolean;
    reason: string;
    cta: {
      text: string;
      supported_methods: string[];
    };
    locked_items: string[];
  };
}

export default function LoveReport() {
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [loading, setLoading] = useState(false);
  const [payStatus, setPayStatus] = useState<PayStatus>('free');
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState('');
  
  const [showQuiz, setShowQuiz] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    mbti: '',
    birthday: '2000-01-01',
    relationship_stage: 'single',
    goal: 'improve_attraction',
  });

  const fetchReport = async (status: PayStatus) => {
    if (!formData.mbti) {
      setError('请选择 MBTI 人格类型或进行测试');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Use relative path for production compatibility
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_profile: {
            language: 'zh-CN',
            timezone: 'Asia/Shanghai',
            relationship_stage: formData.relationship_stage,
            goal: formData.goal,
          },
          signals: {
            mbti: { type: formData.mbti, confidence: 0.8 },
            birthday: { date: formData.birthday, tags: [], confidence: 0.6 },
          },
          entitlements: {
            pay_status: status,
            product_sku: status === 'paid' ? 'love_report_pro' : 'love_report_basic',
            payment_methods: ['wechat_pay', 'alipay'],
          },
          ui_context: { app_name: 'LoveInsight', share_card_style: 'minimal', max_length: 'medium' },
        }),
      });

      if (!response.ok) throw new Error('Failed to generate report');
      
      const data = await response.json();
      setReport(data);
      setStep('result');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async () => {
    // TODO: Implement real payment logic here (e.g., call WeChat/Alipay API)
    // For now, we will just alert the user.
    alert('支付功能正在接入中，敬请期待！');
  };

  if (loading && !report) { // Initial loading for result
     return (
       <div className="flex flex-col items-center justify-center min-h-screen bg-pink-50 text-pink-800">
         <Loader2 className="w-12 h-12 animate-spin mb-4" />
         <p className="text-lg animate-pulse">正在连接宇宙能量...</p>
       </div>
     );
  }

  if (step === 'form') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 p-6 flex flex-col items-center">
        {showQuiz && (
          <MBTIQuiz 
            onComplete={(result) => {
              setFormData({...formData, mbti: result});
              setShowQuiz(false);
            }} 
            onCancel={() => setShowQuiz(false)} 
          />
        )}

        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-pink-600 flex items-center gap-2 justify-center">
            <Heart className="fill-current" /> 灵犀指引
          </h1>
          <p className="text-gray-600 mt-2">基于 MBTI + 星盘 + 手相的多维命运洞察</p>
        </header>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-lg space-y-8 border border-white/50">
          
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">第一步：基础档案</h2>
            <p className="text-gray-500 text-sm">完善生辰信息，生成更精准的星盘/八字解读</p>
          </div>

          <div className="space-y-6">
            {/* MBTI Section - Modern Card Style */}
            <div className="group relative">
               <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">MBTI 人格类型</label>
               <div className="flex gap-3">
                 <button 
                   onClick={() => setShowQuiz(true)}
                   className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                 >
                   <RefreshCcw className="w-4 h-4" /> 帮我测试
                 </button>
                 <div className="relative flex-1">
                   <select 
                     value={formData.mbti}
                     onChange={(e) => setFormData({...formData, mbti: e.target.value})}
                     className="w-full appearance-none bg-gray-50 border-0 rounded-xl py-3 px-4 text-gray-700 font-medium focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
                   >
                     <option value="">直接选择...</option>
                     {['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'].map(t => (
                       <option key={t} value={t}>{t}</option>
                     ))}
                   </select>
                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                     <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                   </div>
                 </div>
               </div>
               {formData.mbti && (
                 <div className="absolute -right-2 -top-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold animate-fade-in">
                   已选: {formData.mbti}
                 </div>
               )}
            </div>

            {/* Birthday Section - Clean Input */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">出生日期 (公历)</label>
              <div className="relative">
                <input 
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                  className="w-full bg-gray-50 border-0 rounded-xl py-3 px-4 text-gray-800 font-medium focus:ring-2 focus:ring-pink-500 transition-all"
                />
              </div>
            </div>

             {/* Relationship Stage - Visual Cards */}
             <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">当前状态</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'single', label: '单身', emoji: '👋' },
                  { id: 'dating', label: '暧昧中', emoji: '💌' },
                  { id: 'relationship', label: '恋爱中', emoji: '💑' },
                  { id: 'breakup_recovery', label: '疗愈期', emoji: '🩹' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFormData({...formData, relationship_stage: item.id as RelationshipStage})}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      formData.relationship_stage === item.id 
                        ? 'bg-pink-50 border-pink-500 text-pink-700 shadow-sm' 
                        : 'bg-white border-gray-200 text-gray-600 hover:border-pink-300'
                    }`}
                  >
                    <span>{item.emoji}</span> {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Goal - Minimal Select */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">本次咨询目标</label>
              <div className="relative">
                <select 
                  value={formData.goal}
                  onChange={(e) => setFormData({...formData, goal: e.target.value as Goal})}
                  className="w-full appearance-none bg-gray-50 border-0 rounded-xl py-3 px-4 text-gray-800 font-medium focus:ring-2 focus:ring-pink-500 transition-all"
                >
                  <option value="improve_attraction">✨ 提升吸引力/脱单</option>
                  <option value="stabilize_relationship">🔒 关系升温/稳定</option>
                  <option value="improve_communication">🗣️ 改善沟通</option>
                  <option value="move_on">🌱 走出阴影</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
              </div>
            </div>

            <button 
              onClick={() => fetchReport('free')}
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold py-4 rounded-xl shadow-xl shadow-pink-200 transform transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-lg mt-4"
            >
              {loading ? <Loader2 className="animate-spin w-6 h-6" /> : (
                <>
                  生成免费预览报告 <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Result View
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Loading Overlay for Payment */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center text-white">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-8 pb-16">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => setStep('form')} className="text-white/80 hover:text-white mb-4 flex items-center text-sm">
            &larr; 返回重填
          </button>
          <div className="flex justify-between items-start">
            <div>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                {report?.version === 'preview' ? '免费预览版' : '完整深度版'}
              </span>
              <h1 className="text-3xl font-bold mt-4">{report?.headline}</h1>
              <p className="mt-2 text-white/90">{report?.share_card_copy.one_liner}</p>
            </div>
            <Share2 className="w-6 h-6 text-white/80 cursor-pointer hover:text-white" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-10 space-y-6">
        {/* Disclaimer */}
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-400 flex gap-3 text-sm text-gray-600">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          {report?.disclaimer}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🔮</span> 核心洞察
          </h2>
          <div className="space-y-3">
            {report?.summary.map((s, i) => (
              <p key={i} className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                {s}
              </p>
            ))}
          </div>
        </div>

        {/* Attraction Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-pink-600 mb-3">你吸引的类型</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
              {report?.attraction_profile.you_attract.map((x, i) => <li key={i}>{x}</li>)}
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-gray-500 mb-3">你容易错过的</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
              {report?.attraction_profile.you_miss.map((x, i) => <li key={i}>{x}</li>)}
            </ul>
          </div>
        </div>

        {/* Action Plan */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 px-2">行动指南</h2>
          {report?.action_plan.map((action, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-indigo-50 p-4 border-b border-indigo-100">
                <h3 className="font-bold text-indigo-900">{action.title}</h3>
                <p className="text-xs text-indigo-600 mt-1">场景: {action.scenario}</p>
              </div>
              <div className="p-4 space-y-3">
                <div className="space-y-2">
                  {action.steps.map((step, j) => (
                    <div key={j} className="flex gap-2 text-sm text-gray-700">
                      <span className="text-indigo-400 font-bold">{j+1}.</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm italic text-gray-600">
                  "{action.example_script}"
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paywall Overlay / Upsell */}
        {report?.paywall?.show && (
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-pink-500" />
            <Lock className="w-12 h-12 mx-auto text-yellow-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">解锁完整版报告</h2>
            <p className="text-gray-300 mb-6 max-w-lg mx-auto">{report.paywall.reason}</p>
            
            <div className="grid gap-3 max-w-md mx-auto mb-8 text-left">
              {report.paywall.locked_items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                  <div className="bg-yellow-400/20 p-1 rounded">
                    <Lock className="w-4 h-4 text-yellow-400" />
                  </div>
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={handleUnlock}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-gray-900 font-bold py-4 px-8 rounded-full text-lg shadow-lg transform transition hover:scale-105 w-full max-w-xs"
            >
              {report.paywall.cta.text}
            </button>
            <p className="mt-4 text-xs text-gray-500">支持微信 / 支付宝安全支付</p>
          </div>
        )}
      </div>
    </div>
  );
}
