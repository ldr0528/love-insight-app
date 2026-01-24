import { useState } from 'react';
import { ArrowLeft, Crown, AlertCircle, Check, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function RechargePage() {
  const [selectedPlan, setSelectedPlan] = useState<'weekly' | 'monthly' | 'permanent'>('monthly');

  const copyLink = () => {
    const link = '#付款:astra(dr13528855668)';
    navigator.clipboard.writeText(link).then(() => {
      toast.success('复制成功！请前往微信发送给任意好友');
    }).catch(() => {
      toast.error('复制失败，请手动复制');
    });
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
        
        {/* Encouragement Message */}
        <div className="bg-orange-100 text-orange-800 p-4 rounded-xl text-center font-medium shadow-sm">
          网站制作不易，您的小小鼓励就是我们最大的动力 ❤️
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

          {/* Permanent Plan */}
          <button
            onClick={() => setSelectedPlan('permanent')}
            className={`relative p-4 md:p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
              selectedPlan === 'permanent' 
                ? 'bg-gradient-to-br from-yellow-100 to-amber-100 border-amber-500 shadow-md transform scale-[1.02]' 
                : 'bg-white border-gray-100 hover:border-yellow-200'
            }`}
          >
            {selectedPlan === 'permanent' && (
              <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl rounded-tr-xl">
                超值推荐
              </div>
            )}
            {selectedPlan === 'permanent' && (
              <div className="absolute top-2 right-2 mt-5 bg-amber-500 text-white p-1 rounded-full">
                <Check size={12} strokeWidth={3} />
              </div>
            )}
            <h3 className={`font-bold text-base md:text-lg ${selectedPlan === 'permanent' ? 'text-amber-800' : 'text-gray-600'}`}>
              VIP永久
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-medium text-gray-500">¥</span>
              <span className={`text-2xl md:text-3xl font-extrabold ${selectedPlan === 'permanent' ? 'text-amber-600' : 'text-gray-800'}`}>38</span>
            </div>
            <p className="text-[10px] md:text-xs text-gray-400">终身有效</p>
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
              第一步：复制链接并发送
            </h3>
            <div className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-200 flex items-center justify-between gap-2">
              <code className="text-sm md:text-base font-mono text-gray-800 break-all">
                #付款:astra(dr13528855668)
              </code>
              <button 
                onClick={copyLink}
                className="flex-shrink-0 flex items-center gap-1 bg-white border border-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 active:scale-95 transition-all text-gray-700"
              >
                <Copy size={14} />
                复制
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              点击上方复制按钮，然后在手机微信中打开<span className="font-bold text-gray-900">任意聊天窗口</span>（例如发给自己），粘贴并发送。
            </p>
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <img 
                src="/images/VIP-step1.png" 
                alt="Step 1 Example" 
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
              第二步：点击链接付款
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              点击您刚才发送的绿色链接，进入支付界面。选择对应产品（周卡/月卡/永久），并在电话栏<span className="font-bold text-red-500 underline">填写您的注册账号</span>！
            </p>
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <img 
                src="/images/VIP-step2.png" 
                alt="Step 2 Example" 
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
              第三步：等待开通
            </h3>
            <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm mb-4">
              客服助理会根据您填写的信息（注册账号）将您的账号设置为VIP。
            </div>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
              <p className="text-sm text-red-700 font-bold">
                如有联系请咨询客服，请不要相信其它充值方式！
              </p>
            </div>
          </div>
        </div>

        {/* Customer Service */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-3xl p-6 shadow-xl text-center space-y-4">
          <h3 className="text-lg font-bold flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5" /> 如有问题请尽快联系客服
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
              <span className="text-gray-400 text-xs block mb-1">客服 1</span>
              <span className="font-mono text-lg font-bold select-all">MxL1Ddi8f</span>
            </div>
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
              <span className="text-gray-400 text-xs block mb-1">客服 2</span>
              <span className="font-mono text-lg font-bold select-all">Lingxi00888</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}