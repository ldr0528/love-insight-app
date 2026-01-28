import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Compass, Sparkles, Send, RefreshCw, Lock, ChevronLeft, Loader2, Star, Zap, Share2, Download, X } from 'lucide-react';
import html2canvas from 'html2canvas';

interface DivineResult {
  sign: string; // e.g., "第十五签 · 上上签"
  judgment: '吉' | '平' | '凶';
  poem: string; // 签诗
  interpretation: string; // AI 解读
}

// Share Modal Component
function ShareModal({ image, onClose }: { image: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
         <button 
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full bg-black/20 hover:bg-black/40 text-slate-400 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="p-4 text-center border-b border-slate-800">
          <h3 className="text-lg font-bold text-yellow-400">保存签文</h3>
          <p className="text-xs text-slate-400 mt-1">长按图片保存，或分享给好友</p>
        </div>
        <div className="p-4 bg-slate-950/50 max-h-[60vh] overflow-y-auto flex justify-center">
            <img src={image} alt="Divine Share" className="w-full h-auto rounded-lg shadow-sm border border-slate-800" />
        </div>
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-center">
             <a href={image} download="divine-oracle.png" className="flex items-center gap-2 px-6 py-2 bg-yellow-500 text-slate-900 rounded-full font-bold text-sm shadow-lg hover:bg-yellow-400 transition-all">
                <Download className="w-4 h-4" /> 保存图片
             </a>
        </div>
      </div>
    </div>
  );
}

export default function DivinePage() {
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuthStore();
  const [step, setStep] = useState<'input' | 'divining' | 'result'>('input');
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<DivineResult | null>(null);
  const [error, setError] = useState('');
  
  // Share state
  const [shareImage, setShareImage] = useState<string | null>(null);
  const [isGeneratingShare, setIsGeneratingShare] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // Animation refs
  const compassRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (!resultRef.current) return;
    setIsGeneratingShare(true);
    try {
      // Small delay to ensure clean render
      await new Promise(resolve => setTimeout(resolve, 100));
      const canvas = await html2canvas(resultRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#0f172a', // slate-900
        logging: false,
      });
      const image = canvas.toDataURL('image/png');
      setShareImage(image);
    } catch (err) {
      console.error("Share generation failed", err);
    } finally {
      setIsGeneratingShare(false);
    }
  };

  const handleStartDivine = async () => {
    if (!question.trim()) return;
    
    if (!user) {
        openAuthModal();
        return;
    }

    setStep('divining');
    setError('');

    // Simulate animation time (min 3s)
    const animationPromise = new Promise(resolve => setTimeout(resolve, 3000));
    
    // API Call
    const apiPromise = fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_profile: {
                report_type: 'divine_oracle',
                question: question,
                name: user.nickname || '求测者'
            },
            signals: {
                // Pass random seed for randomness
                seed: Math.random()
            },
            entitlements: {
                pay_status: user.isVip ? 'paid' : 'free'
            }
        })
    }).then(res => res.json());

    try {
        const [_, data] = await Promise.all([animationPromise, apiPromise]);
        
        if (data.error) throw new Error(data.error);
        
        setResult({
            sign: data.headline || "无字天书",
            judgment: data.fortune_score > 80 ? '吉' : data.fortune_score < 40 ? '凶' : '平',
            poem: data.summary?.[0] || "天机不可泄露",
            interpretation: data.content_sections?.[0]?.content || data.summary?.[1] || "请静心感悟。"
        });
        setStep('result');
    } catch (err: any) {
        setError(err.message || '天机混淆，请稍后再试');
        setStep('input');
    }
  };

  const commonQuestions = [
    "这份工作适合我吗？",
    "最近会有桃花运吗？",
    "前任还会联系我吗？",
    "财运什么时候好转？",
    "这笔投资值得做吗？"
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-yellow-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-4 flex items-center justify-between bg-gradient-to-b from-slate-900 to-transparent">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all backdrop-blur-md">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-yellow-400 animate-spin-slow" />
            <span className="font-bold tracking-wider text-yellow-400">神算子 · Divine Oracle</span>
        </div>
        <div className="w-10"></div> {/* Spacer */}
      </nav>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden">
        
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-yellow-600/10 rounded-full blur-[80px] animate-pulse delay-1000"></div>
        </div>

        {/* Step 1: Input */}
        {step === 'input' && (
            <div className="w-full max-w-md z-10 animate-in fade-in zoom-in duration-500 flex flex-col items-center">
                <div className="relative mb-12 group">
                    <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl group-hover:bg-yellow-400/30 transition-all duration-500"></div>
                    <Compass className="w-32 h-32 text-yellow-400 relative z-10 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                </div>

                <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-yellow-200 to-amber-500 bg-clip-text text-transparent">心中若有惑</h1>
                <p className="text-slate-400 mb-8 text-center text-sm">默念心中所求之事，天机自会应你。</p>

                <div className="w-full relative mb-6">
                    <input 
                        type="text" 
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="请输入你想问的问题..."
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 pl-6 pr-12 text-lg text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all backdrop-blur-sm"
                        onKeyDown={(e) => e.key === 'Enter' && handleStartDivine()}
                    />
                    <button 
                        onClick={handleStartDivine}
                        disabled={!question.trim()}
                        className="absolute right-2 top-2 p-2 bg-yellow-500 text-slate-900 rounded-xl hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>

                {/* Common Questions */}
                <div className="w-full flex flex-wrap gap-2 justify-center">
                    {commonQuestions.map((q, i) => (
                        <button 
                            key={i}
                            onClick={() => setQuestion(q)}
                            className="px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-full text-xs text-slate-400 hover:text-yellow-400 hover:border-yellow-500/30 transition-all"
                        >
                            {q}
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="mt-4 text-red-400 text-sm bg-red-950/30 px-4 py-2 rounded-lg border border-red-900/50">
                        {error}
                    </div>
                )}
            </div>
        )}

        {/* Step 2: Divining Animation */}
        {step === 'divining' && (
            <div className="flex flex-col items-center justify-center z-10">
                <div className="relative w-64 h-64 mb-8">
                    {/* Rotating Rings */}
                    <div className="absolute inset-0 border-2 border-slate-700/30 rounded-full animate-[spin_3s_linear_infinite]"></div>
                    <div className="absolute inset-4 border-2 border-slate-600/30 rounded-full animate-[spin_4s_linear_infinite_reverse]"></div>
                    <div className="absolute inset-8 border border-yellow-500/20 rounded-full animate-[spin_2s_linear_infinite]"></div>
                    
                    {/* Center Core */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 bg-yellow-500/10 rounded-full blur-xl animate-pulse"></div>
                        <Compass className="w-24 h-24 text-yellow-400 animate-[spin_0.5s_linear_infinite]" />
                    </div>
                </div>
                <h2 className="text-xl font-bold text-yellow-400 animate-pulse tracking-widest">天机推演中...</h2>
                <p className="text-slate-500 text-sm mt-2">连接宇宙能量场</p>
            </div>
        )}

        {/* Step 3: Result */}
        {step === 'result' && result && (
            <div className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
                {shareImage && (
                    <ShareModal image={shareImage} onClose={() => setShareImage(null)} />
                )}

                {/* Share FAB */}
                <button
                    onClick={handleShare}
                    disabled={isGeneratingShare}
                    className="fixed bottom-8 right-6 z-40 bg-yellow-500 text-slate-900 p-3 rounded-full shadow-xl hover:bg-yellow-400 transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 pr-5"
                >
                    {isGeneratingShare ? <Loader2 className="w-5 h-5 animate-spin" /> : <Share2 className="w-5 h-5" />}
                    <span className="font-bold text-sm">分享</span>
                </button>

                <div ref={resultRef} className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl"></div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 border border-slate-700 mb-4 shadow-inner">
                            <span className={`text-2xl font-bold ${result.judgment === '吉' ? 'text-red-500' : result.judgment === '凶' ? 'text-gray-400' : 'text-yellow-500'}`}>
                                {result.judgment}
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-1">{result.sign}</h2>
                        <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
                            <Sparkles className="w-3 h-3" />
                            <span>所问：{question}</span>
                        </div>
                    </div>

                    {/* Poem */}
                    <div className="bg-slate-950/50 rounded-xl p-6 mb-6 border border-slate-800 relative">
                        <div className="absolute top-2 left-2 text-slate-700"><Star className="w-4 h-4" /></div>
                        <p className="text-center text-yellow-100/90 font-serif text-lg leading-loose tracking-wide italic">
                            {result.poem}
                        </p>
                        <div className="absolute bottom-2 right-2 text-slate-700"><Star className="w-4 h-4" /></div>
                    </div>

                    {/* Interpretation */}
                    <div className="space-y-3">
                        <h3 className="text-yellow-500 font-bold text-sm flex items-center gap-2">
                            <Zap className="w-4 h-4" /> 天机解语
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed text-justify">
                            {result.interpretation}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex gap-4">
                        <button 
                            onClick={() => setStep('input')}
                            className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" /> 再测一事
                        </button>
                        {!user?.isVip && (
                            <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-900 font-bold text-sm hover:shadow-lg hover:shadow-yellow-500/20 transition-all flex items-center justify-center gap-2">
                                <Lock className="w-4 h-4" /> 解锁深度解析
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )}

      </main>
    </div>
  );
}
