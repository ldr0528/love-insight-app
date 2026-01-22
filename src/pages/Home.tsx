import { Link } from 'react-router-dom';
import { Compass, ArrowRight, Brain, Hand, Heart, Target, PenTool, Feather, User, Crown, Store } from 'lucide-react';
import FortuneTube from '@/components/FortuneTube';
import { useAuthStore } from '@/store/useAuthStore';

export default function Home() {
  const { user, openAuthModal, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex flex-col relative">
      {/* Header / Auth Button */}
      <header className="w-full p-4 flex justify-end items-center z-20 absolute top-0 right-0">
        {user ? (
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-2 pr-4 rounded-full shadow-sm border border-pink-100 hover:shadow-md transition-all">
            <div className="relative w-8 h-8">
              <div className="w-full h-full bg-pink-100 rounded-full flex items-center justify-center text-pink-500 font-bold overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={16} />
                )}
              </div>
              {user.isVip && (
                <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5 border border-white z-10">
                  <Crown size={8} className="text-white fill-current" />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 leading-tight">{user.nickname}</span>
              {user.isVip && (
                <span className="text-[10px] font-bold text-yellow-500 flex items-center gap-0.5 leading-tight">
                  <Crown size={8} className="fill-current" /> VIP会员
                </span>
              )}
            </div>
            <button 
              onClick={logout} 
              className="text-xs text-gray-400 hover:text-pink-500 ml-2 border-l border-gray-200 pl-3"
            >
              退出
            </button>
          </div>
        ) : (
          <button 
            onClick={openAuthModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full font-medium shadow-sm border border-pink-100 hover:bg-white hover:text-pink-600 hover:shadow-md transition-all"
          >
            <User size={18} />
            <span>登录 / 注册</span>
          </button>
        )}
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4 pt-20 max-w-4xl w-full mx-auto space-y-12">
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

        {/* Fortune Tube & Worry Grocery */}
        <div className="w-full flex justify-center gap-6 min-h-[350px]">
          <div className="flex-1 flex justify-end">
            <FortuneTube />
          </div>
          <div className="flex-1 flex justify-start">
            <Link to="/worry-grocery" className="group relative w-64 h-[350px] perspective-1000 block">
              <div className="relative w-full h-full bg-[#fdf6e3] rounded-[2.5rem] shadow-xl shadow-orange-100 border-4 border-white overflow-hidden transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl">
                {/* Store Decor */}
                <div className="absolute top-0 left-0 w-full h-16 bg-orange-400 z-10 flex items-end justify-around px-4 pb-2">
                  <div className="w-2 h-2 rounded-full bg-white/50"></div>
                  <div className="w-2 h-2 rounded-full bg-white/50"></div>
                  <div className="w-2 h-2 rounded-full bg-white/50"></div>
                  <div className="w-2 h-2 rounded-full bg-white/50"></div>
                </div>
                <div className="absolute top-16 left-0 w-full h-4 bg-white/20 z-10 skew-y-1"></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-16 p-6 text-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-orange-100 mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Store className="w-12 h-12 text-orange-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-amber-900 mb-2">解忧杂货铺</h3>
                  <p className="text-sm text-amber-700/70 font-medium">
                    在这里，写下你的心事<br/>
                    就会收到温暖的回信
                  </p>
                  <span className="mt-6 px-6 py-2 bg-orange-400 text-white rounded-full text-sm font-bold shadow-md group-hover:bg-orange-500 transition-colors">
                    进店看看
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6 w-full">
          {/* Main Wizard (kept as secondary entry) */}
          <Link to="/report" className="hidden group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-pink-100 overflow-hidden flex flex-col h-full">
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
          <Link to="/naming" className="hidden group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-purple-50 overflow-hidden flex flex-col h-full">
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
          <Link to="/compatibility" className="hidden group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-cyan-50 overflow-hidden flex flex-col h-full">
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
        <div className="pt-8 text-center text-gray-500 text-sm border-t border-gray-100 w-full">
          <p className="font-medium text-2xl text-pink-500 italic">希望你能遇见更好的自己 ✨</p>
        </div>
      </main>
    </div>
  );
}
