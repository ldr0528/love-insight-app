import { ArrowLeft, MessageCircle, Heart, Sparkles, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col font-sans">
      {/* Header */}
      <header className="p-4 flex items-center sticky top-0 bg-white/60 backdrop-blur-md z-10 shadow-sm">
        <Link to="/" className="p-2 rounded-full hover:bg-blue-100 transition-colors text-blue-800">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="ml-2 font-bold text-xl text-blue-900 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" /> 联系我们
        </h1>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Content Section */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-50 space-y-8">
          
          {/* Intro */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b pb-2 border-gray-100">
              <Heart className="w-5 h-5 text-red-500 fill-current" /> 关于灵犀指引
            </h3>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                欢迎来到「灵犀指引」，这是一处古老东方智慧与现代 AI 科技温柔共鸣的静谧宇宙。
              </p>
              <p>
                在这里，玄学褪去了晦涩的外衣，科技也注入了温暖的灵魂。我们愿做那一座桥梁，连接您的内心世界与浩瀚的命运星空。
              </p>
              <p>
                您可以借助 <span className="font-bold text-indigo-500">MBTI</span> 与 <span className="font-bold text-pink-500">缘分探索</span> 厘清情感脉络，
                让 <span className="font-bold text-orange-500">智能手相大师</span> 与 <span className="font-bold text-purple-500">周公解梦</span> 破译命运的掌纹与潜意识的低语。
              </p>
              <p>
                当您感到迷茫，<span className="font-bold text-amber-600">解忧杂货铺</span> 与 <span className="font-bold text-rose-500">恋爱军师</span> 永远为您敞开；
                更有 <span className="font-bold text-purple-600">缘名堂取名</span> 赋予新生，<span className="font-bold text-red-500">灵签</span> 摇落神谕，<span className="font-bold text-green-600">电子守护灵</span> 长情相伴。
              </p>
              <p className="flex items-center gap-2 font-medium text-gray-700">
                愿这点点汇聚了传统与科技的微光，能穿透生活的迷雾，为您照亮前行的路，带来最温柔的治愈与指引 <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}