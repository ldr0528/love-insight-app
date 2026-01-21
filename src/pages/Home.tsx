
import { Link } from 'react-router-dom';
import { Compass, ArrowRight, Brain, Hand, Heart, Target, PenTool, Feather } from 'lucide-react';
import FortuneTube from '@/components/FortuneTube';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center gap-4">
            灵犀
            <div className="inline-block p-3 bg-pink-100 rounded-full">
              <Compass className="w-10 h-10 text-pink-500 animate-[spin_15s_linear_infinite]" />
            </div>
            指引
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            探索独属于你的小小宇宙
          </p>
        </div>

        {/* Fortune Tube */}
        <FortuneTube />
        
        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Main Wizard (kept as secondary entry) */}
          <Link to="/report" className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-pink-100 overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Heart className="w-24 h-24 text-pink-500" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-center">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 mb-4">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">专属运势分析</h3>
              <p className="text-gray-500 text-sm mb-6 flex-grow">
                融合东方八字与西方星盘，深度解析你的命定缘分与人生轨迹。
              </p>
              <span className="inline-flex items-center text-pink-600 font-bold group-hover:gap-2 transition-all">
                开始综合测试 <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </div>
          </Link>

          {/* Standalone MBTI */}
          <Link to="/mbti" className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-indigo-50 overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Brain className="w-24 h-24 text-indigo-500" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">MBTI 人格测试</h3>
              <p className="text-gray-500 text-sm mb-6 flex-grow">
                只需 5 分钟，快速测出你的 16 型人格代码，解析你的社交与思维模式。
              </p>
              <span className="inline-flex items-center text-indigo-600 font-bold group-hover:gap-2 transition-all">
                单独测试 MBTI <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </div>
          </Link>

          {/* Standalone Palmistry */}
          <Link to="/palm" className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-orange-50 overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Hand className="w-24 h-24 text-orange-500" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-4">
                <Hand className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">智能手相大师</h3>
              <p className="text-gray-500 text-sm mb-6 flex-grow">
                上传手掌照片，视觉模型将自动识别你的感情线与生命线特征。
              </p>
              <span className="inline-flex items-center text-orange-600 font-bold group-hover:gap-2 transition-all">
                单独测手相 <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </div>
          </Link>

          {/* Love Coach */}
          <Link to="/coach" className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-rose-50 overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Target className="w-24 h-24 text-rose-500" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-center">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">恋爱军师</h3>
              <p className="text-gray-500 text-sm mb-6 flex-grow">
                输入Ta的性格与你的困扰，军师为你定制高情商追求与挽回攻略。
              </p>
              <span className="inline-flex items-center text-rose-600 font-bold group-hover:gap-2 transition-all">
                获取恋爱攻略 <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </div>
          </Link>

          {/* AI Naming Master */}
          <Link to="/naming" className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-purple-50 overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <PenTool className="w-24 h-24 text-purple-500" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">缘名堂</h3>
              <p className="text-gray-500 text-sm mb-6 flex-grow">
                结合传统生辰八字与现代美学，为宝宝、公司或品牌定制寓意深远、朗朗上口的好名字。
              </p>
              <span className="inline-flex items-center text-purple-600 font-bold group-hover:gap-2 transition-all">
                立即开始起名 <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </div>
          </Link>

          {/* Compatibility Explorer */}
          <Link to="/compatibility" className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-cyan-50 overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Feather className="w-24 h-24 text-cyan-500" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-center">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-600 mb-4">
                <Feather className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">缘分探索</h3>
              <p className="text-gray-500 text-sm mb-6 flex-grow">
                输入双方信息，AI 深度解析前世今生与性格契合度，并赠予专属定情古诗。
              </p>
              <span className="inline-flex items-center text-cyan-600 font-bold group-hover:gap-2 transition-all">
                开启缘分测试 <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </div>
          </Link>
        </div>
        

        {/* Stats */}
        <div className="pt-8 text-center text-gray-500 text-sm border-t border-gray-100">
          <p className="font-medium text-2xl text-pink-500 italic">希望你能遇见更好的自己 ✨</p>
        </div>
      </div>
    </div>
  );
}
