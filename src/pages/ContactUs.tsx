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
                欢迎来到「灵犀指引」，一个让古老东方智慧与现代 AI 科技温柔相遇的静谧宇宙。
              </p>
              <p>
                在这里，玄学不再是晦涩的符咒，科技也不再是冰冷的代码。我们致力于搭建一座桥梁，连接你的内心世界与浩瀚的命运星空。
              </p>
              <p>
                你可以通过 <strong>MBTI</strong> 与 <strong>缘分探索</strong> 厘清灵魂的脉络与缘分的红线；让 <strong>AI 手相</strong> 与 <strong>周公解梦</strong> 替你翻译命运的掌纹与潜意识的低语。当你感到迷茫或孤独，<strong>解忧杂货铺</strong> 与 <strong>恋爱军师</strong> 永远为你敞开，倾听你的心事，提供温暖的锦囊。
              </p>
              <p>
                不仅如此，你还能体验 <strong>AI 取名</strong> 赋予文字的新生，在 <strong>灵签</strong> 摇落间寻求神性的指引，或是领养一只专属的 <strong>电子守护灵</strong>，陪伴你度过每一个日夜。
              </p>
              <p>
                愿这点点汇聚了传统与科技的微光，能穿透生活的迷雾，为你照亮前行的路，带来些许温暖、启发与治愈。
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}