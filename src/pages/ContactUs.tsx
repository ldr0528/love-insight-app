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
                欢迎光临「灵犀指引」。这是一个连接内心与缘分的静谧宇宙。
              </p>
              <p>
                我们的初衷纯粹而简单：在喧嚣的数字洪流中，为你筑起一个温暖的避风港。我们尝试将古老的东方智慧与前沿的 AI 技术交织，只为帮你更清晰地照见自我，更温柔地理解他人。
              </p>
              <p>
                在这里，你可以通过 MBTI 探寻灵魂的底色，在电子宠物店领养一只懂你的守护灵，或是让恋爱军师为你理清情感的丝缕。愿这些小小的工具，如微光般照亮你的角落，带来些许启发与治愈。
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
              <Send className="w-5 h-5" /> 我们期待你的声音
            </h3>
            <p className="text-gray-700 mb-6 text-sm md:text-base">
              网站还在成长中，可能会有一些不完美的地方。如果你在使用过程中遇到了问题，或者有任何新颖有趣的点子想要分享，甚至只是想找人聊聊你的使用感受，都<strong>热烈欢迎联系我们！</strong>
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <img 
                  src="/images/contact_qr.jpg" 
                  alt="客服二维码" 
                  className="relative w-48 h-48 md:w-56 md:h-56 object-cover rounded-lg shadow-md"
                />
              </div>
              <p className="text-xs text-gray-500 font-medium mt-2">
                扫一扫上面的二维码图案，加我为朋友
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}