
import { useEffect, useState, useRef } from 'react';
import { useReportStore } from '@/store/useReportStore';
import { Loader2, Lock, Heart, RefreshCw, X, CheckCircle2, ScanLine, ExternalLink, Star, Compass, Ban, Sparkles, Share2, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import request from '@/utils/request';

// Type definitions
interface ReportData {
  disclaimer: string;
  version: 'preview' | 'full';
  headline: string;
  summary: string[];
  // Fortune Inn Fields
  fortune_score?: number;
  lucky_items?: {
    color: string;
    number: string;
    direction: string;
    element?: string;
  };
  taboos?: {
    do: string[];
    avoid: string[];
  };
  content_sections?: {
    title: string;
    content: string;
  }[];
  // Original Fields
  attraction_profile?: {
    you_attract: string[];
    you_miss: string[];
  };
  action_plan?: {
    title: string;
    steps: string[] | string;
    scenario: string;
    example_script: string;
  }[];
  paywall?: {
    show: boolean;
    reason: string;
    cta: { text: string };
    locked_items: string[];
  };
  share_card_copy: {
    one_liner: string;
  };
}

// Share Modal Component
function ShareModal({ image, onClose }: { image: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
         <button 
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full bg-black/5 hover:bg-black/10 text-gray-500 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="p-4 text-center border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">保存分享</h3>
          <p className="text-xs text-gray-400 mt-1">长按图片保存到相册，或直接发送给朋友</p>
        </div>
        <div className="p-4 bg-gray-50 max-h-[60vh] overflow-y-auto flex justify-center">
            <img src={image} alt="Report Share" className="w-full h-auto rounded-lg shadow-sm border border-gray-200" />
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-center">
             <a href={image} download="fortune-report.png" className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-full font-bold text-sm shadow-lg hover:bg-indigo-700 transition-all">
                <Download className="w-4 h-4" /> 保存图片
             </a>
        </div>
      </div>
    </div>
  );
}

// Payment Modal Component
function PaymentModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [method, setMethod] = useState<'wechat' | 'alipay' | 'zpay'>('wechat');
  const [status, setStatus] = useState<'creating' | 'waiting' | 'paid'>('creating');
  const [order, setOrder] = useState<{ id: string; payUrl: string } | null>(null);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Create Order
  useEffect(() => {
    let active = true;
    
    async function createOrder() {
      setStatus('creating');
      try {
        const data = await request<any>('/api/payment/create', {
          method: 'POST',
          data: { method, amount: 9.90 }
        });
        
        if (data.success && active) {
          setOrder({ id: data.orderId, payUrl: data.payUrl });
          setStatus('waiting');
        }
      } catch (e) {
        console.error("Order creation failed", e);
      }
    }

    createOrder();

    return () => { active = false; };
  }, [method]);

  // 2. Poll Status
  useEffect(() => {
    if (!order || status !== 'waiting') return;

    const checkStatus = async () => {
      try {
        const data = await request<any>(`/api/payment/status/${order.id}`);
        if (data.success && data.status === 'paid') {
          setStatus('paid');
          setTimeout(onSuccess, 1500);
        }
      } catch (e) {
        // ignore polling errors
      }
    };

    pollTimerRef.current = setInterval(checkStatus, 2000);

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [order, status, onSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 text-center border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">收银台</h3>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">¥ 9.90</p>
          <p className="text-sm text-gray-500 mt-1">解锁完整深度报告</p>
        </div>

        <div className="p-6 flex flex-col items-center">
          {status === 'paid' ? (
            <div className="py-8 flex flex-col items-center text-green-500 animate-in zoom-in duration-300">
              <CheckCircle2 className="w-16 h-16 mb-4" />
              <p className="font-bold text-lg">支付成功</p>
              <p className="text-sm text-gray-400">正在为您生成完整报告...</p>
            </div>
          ) : (
            <>
              {/* Payment Method Tabs */}
              <div className="flex bg-gray-100 p-1 rounded-lg w-full mb-6">
                <button
                  onClick={() => setMethod('wechat')}
                  className={`flex-1 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    method === 'wechat' ? 'bg-green-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                    method === 'wechat' ? 'bg-white text-green-500' : 'bg-green-500 text-white'
                  }`}>
                    💬
                  </span>
                  微信支付
                </button>
                <button
                  onClick={() => setMethod('alipay')}
                  className={`flex-1 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    method === 'alipay' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                    method === 'alipay' ? 'bg-white text-blue-500' : 'bg-blue-500 text-white'
                  }`}>
                    支
                  </span>
                  支付宝
                </button>
                <button
                  onClick={() => setMethod('zpay')}
                  className={`flex-1 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    method === 'zpay' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                    method === 'zpay' ? 'bg-white text-orange-500' : 'bg-orange-500 text-white'
                  }`}>
                    合
                  </span>
                  聚合支付
                </button>
              </div>

              {/* QR Code Area */}
              <div className="relative group">
                <div className={`w-48 h-48 border-2 rounded-xl p-2 flex items-center justify-center mb-4 transition-colors ${
                  method === 'wechat' ? 'border-green-100' : method === 'alipay' ? 'border-blue-100' : method === 'zpay' ? 'border-orange-100' : 'border-gray-200'
                }`}>
                  {status === 'creating' ? (
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  ) : (
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(order?.payUrl || '')}`}
                      alt="Payment QR Code" 
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                <ScanLine className="w-3 h-3" />
                <span>请使用{method === 'wechat' ? '微信' : method === 'alipay' ? '支付宝' : '聚合平台支持的支付方式'}扫码支付</span>
              </div>
            </>
          )}
        </div>
        
        {status !== 'paid' && (
           <div className="bg-gray-50 p-3 text-center text-xs text-gray-400 border-t border-gray-100">
             安全支付保障 · 虚拟商品不支持退款
           </div>
        )}
      </div>
    </div>
  );
}

export default function ReportGenerationStep() {
  const { profile, mbti, palm, reset, fortuneType } = useReportStore();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const navigate = useNavigate();

  // Share functionality
  const [shareImage, setShareImage] = useState<string | null>(null);
  const [isGeneratingShare, setIsGeneratingShare] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (!reportRef.current) return;
    setIsGeneratingShare(true);
    try {
      // Small delay to ensure clean render
      await new Promise(resolve => setTimeout(resolve, 100));
      const canvas = await html2canvas(reportRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#f8fafc', // slate-50
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

  const fetchReport = async (status: 'free' | 'paid') => {
    setLoading(true);
    setError('');
    
    // Determine report type based on available data
    // If fortuneType is set, it overrides others for the new module
    let reportType = 'astrology';
    
    if (fortuneType) {
        reportType = `fortune_${fortuneType}`;
    } else {
        // Fallback logic for old flow
        const isPalmReport = palm.heart_line !== 'unknown' && palm.head_line !== 'unknown';
        reportType = isPalmReport ? 'palm' : 'astrology';
    }

    try {
      const data = await request<any>('/api/report', {
        method: 'POST',
        data: {
          user_profile: {
            language: 'zh-CN',
            timezone: 'Asia/Shanghai',
            relationship_stage: profile.relationship_stage,
            goal: profile.goal,
            name: profile.name,
            birth_time: profile.birthTime,
            birth_location: profile.birthLocation,
            report_type: reportType, 
            fortune_type: fortuneType // Pass explicit fortune type
          },
          signals: {
            // Include Palm data if available
            palm: reportType === 'palm' ? { features: palm } : undefined,
            birthday: { date: profile.birthday, time: profile.birthTime, location: profile.birthLocation },
          },
          entitlements: {
            pay_status: status,
            product_sku: status === 'paid' ? 'love_report_pro' : 'love_report_basic',
            payment_methods: ['wechat_pay', 'alipay'],
          },
          ui_context: { app_name: 'LoveInsight', share_card_style: 'minimal', max_length: 'medium', report_type: reportType },
        },
      });

      console.log('Report Data:', data);
      setReport(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch on mount
    fetchReport('free');
  }, []);

  const handleUnlockClick = () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    fetchReport('paid');
  };

  const handleRestart = () => {
    reset();
    navigate('/');
  };

  if (loading && !report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-indigo-800">
        <Loader2 className="w-16 h-16 animate-spin mb-6 text-indigo-500" />
        <h3 className="text-xl font-bold animate-pulse">正在连接宇宙能量...</h3>
        <p className="text-sm text-indigo-400 mt-2">正在推演{fortuneType === 'monthly' ? '本月' : '年度'}运势数据</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4 text-lg">{error}</div>
        <button onClick={() => fetchReport('free')} className="px-6 py-2 bg-indigo-500 text-white rounded-lg">
          重试
        </button>
      </div>
    );
  }

  // --- Fortune Report Rendering Logic ---
  const isFortuneReport = report?.fortune_score !== undefined || fortuneType;

  if (isFortuneReport && report) {
      return (
        <div className="animate-in fade-in duration-700 pb-20 relative">
            {shareImage && (
                <ShareModal image={shareImage} onClose={() => setShareImage(null)} />
            )}
            {showPayment && (
                <PaymentModal onClose={() => setShowPayment(false)} onSuccess={handlePaymentSuccess} />
            )}

            {/* Share FAB */}
            <button
                onClick={handleShare}
                disabled={isGeneratingShare}
                className="fixed bottom-8 right-6 z-40 bg-indigo-600 text-white p-3 rounded-full shadow-xl hover:bg-indigo-700 transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 pr-5"
            >
                {isGeneratingShare ? <Loader2 className="w-5 h-5 animate-spin" /> : <Share2 className="w-5 h-5" />}
                <span className="font-bold text-sm">分享</span>
            </button>

            <div ref={reportRef} className="bg-slate-50 p-4 -m-4">
                {/* Header */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-8 rounded-3xl shadow-xl mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sparkles className="w-48 h-48" />
                    </div>
                    <div className="relative z-10 text-center">
                        <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs mb-4 backdrop-blur-md">
                            {fortuneType === 'monthly' ? '本月运势' : '年度运势'} · 专属分析
                        </div>
                        <h1 className="text-3xl font-bold mb-2">{report.headline}</h1>
                        <div className="flex justify-center items-end gap-2 mt-6">
                            <span className="text-6xl font-extrabold text-yellow-300">{report.fortune_score}</span>
                            <span className="text-xl mb-2 opacity-80">/ 100分</span>
                        </div>
                    </div>
                </div>

                {/* Lucky Items */}
                {report.lucky_items && (
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-white p-4 rounded-xl shadow-sm text-center border border-indigo-50">
                            <div className="text-xs text-gray-400 mb-1">幸运色</div>
                            <div className="font-bold text-indigo-600">{report.lucky_items.color}</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm text-center border border-indigo-50">
                            <div className="text-xs text-gray-400 mb-1">幸运数</div>
                            <div className="font-bold text-indigo-600">{report.lucky_items.number}</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm text-center border border-indigo-50">
                            <div className="text-xs text-gray-400 mb-1">吉方位</div>
                            <div className="font-bold text-indigo-600">{report.lucky_items.direction}</div>
                        </div>
                    </div>
                )}

                {/* Summary */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border-l-4 border-indigo-500">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" /> 运势总览
                    </h3>
                    <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                        {report.summary?.map((s, i) => <p key={i}>{s}</p>)}
                    </div>
                </div>

                {/* Taboos (Do's and Don'ts) */}
                {report.taboos && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                            <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" /> 宜
                            </h3>
                            <ul className="space-y-2">
                                {report.taboos.do?.map((item, i) => (
                                    <li key={i} className="text-sm text-green-800 flex items-start gap-2">
                                        <span className="mt-1.5 w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
                            <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                                <Ban className="w-5 h-5" /> 忌
                            </h3>
                            <ul className="space-y-2">
                                {report.taboos.avoid?.map((item, i) => (
                                    <li key={i} className="text-sm text-red-800 flex items-start gap-2">
                                        <span className="mt-1.5 w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Content Sections */}
                <div className="space-y-4 mb-8">
                    {report.content_sections?.map((section, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-sm p-5">
                            <h4 className="font-bold text-indigo-900 mb-2">{section.title}</h4>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{section.content}</p>
                        </div>
                    ))}
                </div>

                {/* Paywall */}
                {report?.paywall?.show && (
                    <div className="relative overflow-hidden rounded-3xl bg-gray-900 text-white p-8 text-center shadow-2xl mx-auto max-w-md transform hover:scale-[1.01] transition-transform">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-pink-500"></div>
                        <Lock className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">解锁完整运势报告</h2>
                        <p className="text-gray-400 text-sm mb-6">{report.paywall.reason}</p>
                        
                        <button
                            onClick={handleUnlockClick}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold py-4 rounded-full shadow-lg hover:shadow-yellow-500/20 transition-all"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto"/> : report.paywall.cta.text}
                        </button>
                    </div>
                )}

                <div className="mt-12 text-center pb-8">
                    <div className="text-xs text-gray-400 mb-4">灵犀指引 · Fortune Inn</div>
                    <button onClick={handleRestart} className="text-gray-400 hover:text-gray-600 text-sm flex items-center justify-center gap-2 mx-auto">
                        <RefreshCw className="w-4 h-4" /> 返回客栈
                    </button>
                </div>
            </div>
        </div>
      );
  }

  // --- Fallback to Original Rendering for other types ---
  return (
    <div className="animate-in fade-in duration-700 pb-20 relative">
      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal 
          onClose={() => setShowPayment(false)} 
          onSuccess={handlePaymentSuccess} 
        />
      )}

      {/* Header Card */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6 rounded-3xl shadow-xl mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Heart className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 opacity-80 text-sm">
            <span>灵犀指引 · 专属报告</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
              {report?.version === 'preview' ? '免费预览' : '深度完整版'}
            </span>
          </div>
          <h1 className="text-2xl font-bold leading-tight mb-2">{report?.headline}</h1>
          <p className="text-white/90 text-sm">{report?.share_card_copy?.one_liner}</p>
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-4 mb-6">
        {(Array.isArray(report?.summary) ? report?.summary : (report?.summary ? [report.summary] : [])).map((s: any, i: number) => {
          const icons = ["🌌", "✨", "🕯️", "🔮", "📜"]; // Cycle through icons
          const titles = ["命盘解析", "流年运势", "情感建议", "潜意识解读", "未来展望"]; // Fallback titles
          
          return (
            <div key={i} className="bg-white rounded-2xl shadow-md border border-indigo-50 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-pink-50 px-4 py-3 border-b border-indigo-100 flex items-center gap-2">
                <span className="text-xl">{icons[i % icons.length]}</span>
                <h3 className="font-bold text-indigo-900 text-sm">{titles[i] || "深度洞察"}</h3>
              </div>
              <div className="p-5">
                <p className="text-gray-700 text-sm leading-relaxed text-justify">{s}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Attraction */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h3 className="font-bold text-pink-600 mb-3 text-sm uppercase tracking-wider">你的吸引力</h3>
          <ul className="space-y-2">
            {(Array.isArray(report?.attraction_profile?.you_attract) ? report?.attraction_profile?.you_attract : (report?.attraction_profile?.you_attract ? [report.attraction_profile.you_attract] : [])).map((x: any, i: number) => (
              <li key={i} className="text-sm text-gray-600 flex gap-2">
                <span className="text-pink-400">•</span> {x}
              </li>
            ))}
          </ul>
        </div>
         <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h3 className="font-bold text-gray-500 mb-3 text-sm uppercase tracking-wider">你的盲点</h3>
          <ul className="space-y-2">
            {(Array.isArray(report?.attraction_profile?.you_miss) ? report?.attraction_profile?.you_miss : (report?.attraction_profile?.you_miss ? [report.attraction_profile.you_miss] : [])).map((x: any, i: number) => (
              <li key={i} className="text-sm text-gray-600 flex gap-2">
                <span className="text-gray-300">•</span> {x}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Plan */}
      <h3 className="text-lg font-bold text-gray-800 mb-4 px-2">行动指南</h3>
      <div className="space-y-4 mb-8">
        {(Array.isArray(report?.action_plan) ? report?.action_plan : (report?.action_plan ? [report.action_plan] : [])).map((plan: any, i: number) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-indigo-50/50 p-4 border-b border-indigo-50">
              <h4 className="font-bold text-indigo-900">{plan.title}</h4>
              <p className="text-xs text-indigo-500 mt-1">{plan.scenario}</p>
            </div>
            <div className="p-4 space-y-3">
              {Array.isArray(plan.steps) ? plan.steps.map((step, j) => (
                <div key={j} className="flex gap-3 text-sm">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">{j+1}</span>
                  <span className="text-gray-600">{step}</span>
                </div>
              )) : (typeof plan.steps === 'string' ? (
                 <div className="flex gap-3 text-sm">
                   <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">1</span>
                   <span className="text-gray-600">{plan.steps}</span>
                 </div>
              ) : null)}
              <div className="mt-3 bg-gray-50 p-3 rounded-lg text-xs text-gray-500 italic border border-gray-100">
                "{plan.example_script}"
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paywall */}
      {report?.paywall?.show && (
        <div className="relative overflow-hidden rounded-3xl bg-gray-900 text-white p-8 text-center shadow-2xl mx-auto max-w-md transform hover:scale-[1.01] transition-transform">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-pink-500"></div>
          <Lock className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">解锁完整深度报告</h2>
          <p className="text-gray-400 text-sm mb-6">{report.paywall.reason}</p>
          
          <div className="space-y-2 mb-8 text-left max-w-xs mx-auto">
            {report.paywall.locked_items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                <Lock className="w-3 h-3 text-yellow-500" /> {item}
              </div>
            ))}
          </div>

          <button
            onClick={handleUnlockClick}
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold py-4 rounded-full shadow-lg hover:shadow-yellow-500/20 transition-all"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto"/> : report.paywall.cta.text}
          </button>
        </div>
      )}

      {/* Restart */}
      <div className="mt-12 text-center">
        <button onClick={handleRestart} className="text-gray-400 hover:text-gray-600 text-sm flex items-center justify-center gap-2 mx-auto">
          <RefreshCw className="w-4 h-4" /> 开始新的测试
        </button>
      </div>
    </div>
  );
}
