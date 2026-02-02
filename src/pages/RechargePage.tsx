import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Crown, AlertCircle, Check, Copy } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';

export default function RechargePage() {
  const [selectedPlan, setSelectedPlan] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const { user, refreshProfile } = useAuthStore();
  const [searchParams] = useSearchParams();
  const processedRef = useRef(false);

  // Auto-refresh profile if returning from payment
  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'paid' && !processedRef.current) {
      processedRef.current = true;
      const toastId = toast.loading('正在确认支付结果...');
      // Delay slightly to ensure server DB update propagates
      setTimeout(() => {
        refreshProfile().then(() => {
          toast.dismiss(toastId);
          toast.success('VIP权益已开通！');
        });
      }, 1000);
    }
  }, [searchParams, refreshProfile]);

  const handlePayment = async () => {
    if (!user) {
      toast.error('请先登录');
      return;
    }

    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'epay',
          type: 'vip',
          plan: selectedPlan,
          userId: user.phone || user.id // Pass user identifier
        }),
      });

      const data = await response.json();

      if (data.success && data.payUrl) {
        // Redirect to payment page
        window.location.href = data.payUrl;
      } else {
        toast.error('创建订单失败: ' + (data.error || '未知错误'));
      }
    } catch (error) {
      console.error('Payment Error:', error);
      toast.error('支付请求失败，请稍后重试');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white flex flex-col font-sans">
      {/* Header */}
      <header className="p-4 flex items-center sticky top-0 bg-white/60 backdrop-blur-md z-10 shadow-sm">
        <Link to="/" className="p-2 rounded-full hover:bg-yellow-100 transition-colors text-yellow-800">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="ml-2 font-bold text-xl text-yellow-900 flex items-center gap-2">
          <Crown className="w-6 h-6 fill-current" /> 充值VIP会员
        </h1>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 md:p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Notice Banner */}
        <div className="bg-gradient-to-r from-pink-50 to-orange-50 border border-pink-100 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
            <div className="bg-pink-100 p-2 rounded-full flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-pink-500" />
            </div>
            <p className="font-bold text-gray-800 text-sm md:hidden">
              制作不易，鼓励一下！❤️
            </p>
          </div>
          
          <div className="text-sm text-gray-700 space-y-1 flex-1">
            <p className="font-bold text-gray-800 hidden md:block">
              网站制作不易，您的小小鼓励是我们最大的动力！❤️
            </p>
            <p className="text-gray-500 text-xs leading-relaxed">
              <span className="opacity-80">⚠️ 避免在微信/抖音等APP内直接打开，可能导致支付失败。</span>
            </p>
          </div>
        </div>

        {/* VIP Plan Selection */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {/* Weekly Plan */}
          <button
            onClick={() => setSelectedPlan('weekly')}
            className={`relative p-4 md:p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
              selectedPlan === 'weekly' 
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-emerald-400 shadow-md transform scale-[1.02]' 
                : 'bg-white border-gray-100 hover:border-yellow-200'
            }`}
          >
            {selectedPlan === 'weekly' && (
              <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full">
                <Check size={12} strokeWidth={3} />
              </div>
            )}
            <h3 className={`font-bold text-base md:text-lg ${selectedPlan === 'weekly' ? 'text-emerald-800' : 'text-gray-600'}`}>
              VIP周卡
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-medium text-gray-500">¥</span>
              <span className={`text-2xl md:text-3xl font-extrabold ${selectedPlan === 'weekly' ? 'text-emerald-600' : 'text-gray-800'}`}>8</span>
            </div>
            <p className="text-[10px] md:text-xs text-gray-400">有效期 7 天</p>
          </button>

          {/* Monthly Plan */}
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`relative p-4 md:p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
              selectedPlan === 'monthly' 
                ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-400 shadow-md transform scale-[1.02]' 
                : 'bg-white border-gray-100 hover:border-yellow-200'
            }`}
          >
            {selectedPlan === 'monthly' && (
              <div className="absolute top-2 right-2 bg-orange-500 text-white p-1 rounded-full">
                <Check size={12} strokeWidth={3} />
              </div>
            )}
            <h3 className={`font-bold text-base md:text-lg ${selectedPlan === 'monthly' ? 'text-orange-800' : 'text-gray-600'}`}>
              VIP月卡
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-medium text-gray-500">¥</span>
              <span className={`text-2xl md:text-3xl font-extrabold ${selectedPlan === 'monthly' ? 'text-orange-600' : 'text-gray-800'}`}>16</span>
            </div>
            <p className="text-[10px] md:text-xs text-gray-400">有效期 30 天</p>
          </button>

          {/* Yearly Plan */}
          <button
            onClick={() => setSelectedPlan('yearly')}
            className={`relative p-4 md:p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
              selectedPlan === 'yearly' 
                ? 'bg-gradient-to-br from-yellow-100 to-amber-100 border-amber-500 shadow-md transform scale-[1.02]' 
                : 'bg-white border-gray-100 hover:border-yellow-200'
            }`}
          >
            {selectedPlan === 'yearly' && (
              <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl rounded-tr-xl">
                超值推荐
              </div>
            )}
            {selectedPlan === 'yearly' && (
              <div className="absolute top-2 right-2 mt-5 bg-amber-500 text-white p-1 rounded-full">
                <Check size={12} strokeWidth={3} />
              </div>
            )}
            <h3 className={`font-bold text-base md:text-lg ${selectedPlan === 'yearly' ? 'text-amber-800' : 'text-gray-600'}`}>
              VIP年卡
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-medium text-gray-500">¥</span>
              <span className={`text-2xl md:text-3xl font-extrabold ${selectedPlan === 'yearly' ? 'text-amber-600' : 'text-gray-800'}`}>58</span>
            </div>
            <p className="text-[10px] md:text-xs text-gray-400">有效期 365 天</p>
          </button>
        </div>

        {/* Payment Button */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 flex flex-col items-center gap-4">
          <div className="text-center">
             <p className="text-gray-500 text-sm mb-1">当前选择</p>
             <p className="text-xl font-bold text-gray-800">
               {selectedPlan === 'weekly' && 'VIP周卡 (7天)'}
               {selectedPlan === 'monthly' && 'VIP月卡 (30天)'}
               {selectedPlan === 'yearly' && 'VIP年卡 (365天)'}
             </p>
             <p className="text-3xl font-extrabold text-orange-600 mt-2">
               ¥ {selectedPlan === 'weekly' ? '8' : selectedPlan === 'monthly' ? '16' : '58'}
             </p>
          </div>
          
          <button 
            onClick={handlePayment}
            className="w-full max-w-sm bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transform transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Crown className="w-5 h-5 fill-current" />
            立即支付开通
          </button>
          
          <p className="text-xs text-gray-400">
            支付成功后自动开通权益，无需人工介入
          </p>
        </div>

      </main>
    </div>
  );
}