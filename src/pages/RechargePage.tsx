import { useState } from 'react';
import { ArrowLeft, Crown, AlertCircle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RechargePage() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'permanent'>('monthly');

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
        
        {/* VIP Plan Selection */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`relative p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
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
            <h3 className={`font-bold text-lg ${selectedPlan === 'monthly' ? 'text-orange-800' : 'text-gray-600'}`}>
              月度 VIP
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-medium text-gray-500">¥</span>
              <span className={`text-3xl font-extrabold ${selectedPlan === 'monthly' ? 'text-orange-600' : 'text-gray-800'}`}>16</span>
            </div>
            <p className="text-xs text-gray-400">有效期 30 天</p>
          </button>

          <button
            onClick={() => setSelectedPlan('permanent')}
            className={`relative p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
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
            <h3 className={`font-bold text-lg ${selectedPlan === 'permanent' ? 'text-amber-800' : 'text-gray-600'}`}>
              永久 VIP
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-medium text-gray-500">¥</span>
              <span className={`text-3xl font-extrabold ${selectedPlan === 'permanent' ? 'text-amber-600' : 'text-gray-800'}`}>66</span>
            </div>
            <p className="text-xs text-gray-400">终身有效 · 无限畅享</p>
          </button>
        </div>

        {/* Important Notice */}
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-bold text-red-800">付款重要提示</h3>
              <p className="text-sm text-red-700 mt-1">
                请支付 <span className="text-lg font-black mx-1">{selectedPlan === 'monthly' ? '16' : '66'}</span> 元。请务必在付款备注中填写您的<span className="font-bold underline">注册手机号</span>，否则客服无法为您开通权益！
              </p>
            </div>
          </div>
        </div>

        {/* How to Note (Moved Up) */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-yellow-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" /> 如何添加备注？
          </h3>
          <div className="rounded-xl overflow-hidden border border-gray-200">
            <img 
              src="/images/attention.jpg" 
              alt="备注填写示例" 
              className="w-full h-auto"
            />
          </div>
          <p className="mt-4 text-sm text-gray-600 leading-relaxed">
            在支付界面中，请找到<span className="font-bold text-gray-900">“添加备注”</span>选项，并输入您的注册手机号。支付成功后，系统将在 10 分钟内为您自动开通 VIP 权益。如遇问题，请联系客服。
          </p>
        </div>

        {/* Payment Options */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* WeChat Pay */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-green-100 flex flex-col items-center hover:shadow-xl transition-shadow">
            <div className="w-full aspect-[3/4] relative rounded-xl overflow-hidden mb-4 bg-green-50">
              <img 
                src="/images/weixinpay.jpg" 
                alt="微信支付" 
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-lg font-bold text-green-600 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> 微信支付
            </h3>
            <p className="text-xs text-gray-500 text-center">
              推荐使用微信扫码支付
            </p>
          </div>

          {/* Alipay */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100 flex flex-col items-center hover:shadow-xl transition-shadow">
            <div className="w-full aspect-[3/4] relative rounded-xl overflow-hidden mb-4 bg-blue-50">
              <img 
                src="/images/alipay.jpg" 
                alt="支付宝" 
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-lg font-bold text-blue-600 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> 支付宝支付
            </h3>
            <p className="text-xs text-gray-500 text-center">
              支持花呗、余额宝支付
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}