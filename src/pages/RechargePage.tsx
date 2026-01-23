import { ArrowLeft, Crown, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RechargePage() {
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
        
        {/* Important Notice */}
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-bold text-red-800">付款重要提示</h3>
              <p className="text-sm text-red-700 mt-1">
                请务必在付款备注中填写您的<span className="font-bold underline">注册手机号</span>，否则客服无法为您开通权益！
              </p>
            </div>
          </div>
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

        {/* How to Note */}
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

      </main>
    </div>
  );
}