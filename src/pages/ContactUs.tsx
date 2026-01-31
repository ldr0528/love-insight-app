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
              <Sparkles className="w-5 h-5 text-purple-500 fill-current" /> 关于灵犀指引
            </h3>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                欢迎来到「灵犀指引」。
              </p>
              <p>
                这是一个连接内心与未来的静谧角落。我们的初衷很简单：在喧嚣的数字世界里，为你留一盏温暖的灯。
              </p>
              <p>
                我们将前沿的 AI 技术与心理学、传统智慧相融合，只为帮你更清晰地照见自我，更从容地应对生活。
                无论是通过 MBTI 探寻性格底色，还是在缘名堂寻找一个美好的代号，亦或是让智能助手为你理清思绪——
              </p>
              <p className="font-medium text-gray-800">
                愿这些小小的工具，如微光般照亮你的前行之路，带来些许启发与治愈。
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
               <div className="text-center space-y-2">
                 <p className="text-sm text-gray-500">可以通过以下方式联系主创团队：</p>
                 <div className="flex flex-col gap-2">
                    <div className="bg-gray-50 px-4 py-2 rounded-lg font-mono text-gray-800 font-bold border border-gray-200 select-all">
                      MxL1Ddi8f
                    </div>
                    <div className="bg-gray-50 px-4 py-2 rounded-lg font-mono text-gray-800 font-bold border border-gray-200 select-all">
                      Lingxi00888
                    </div>
                 </div>
                 <p className="text-xs text-gray-400 mt-2">
                   (复制微信号添加好友，请注明“灵犀指引”)
                 </p>
               </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}