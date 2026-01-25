import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight, Brain, Hand, Heart, Target, PenTool, Feather, User, Crown, Store, Cat, Sparkles, PawPrint, MessageCircle, CloudMoon } from 'lucide-react';
import FortuneTube from '@/components/FortuneTube';
import { useAuthStore } from '@/store/useAuthStore';

export default function Home() {
  const { user, openAuthModal, logout } = useAuthStore();

  useEffect(() => {
    // 预加载图片
    const images = [
      '/images/ENFJ.jpg', '/images/ENFP.jpg', '/images/ENTJ.jpg', '/images/ENTP.jpg',
      '/images/ESFJ.jpg', '/images/ESFP.jpg', '/images/ESTJ.jpg', '/images/ESTP.jpg',
      '/images/INFJ.jpg', '/images/INFP.jpg', '/images/INTJ.jpg', '/images/INTP.jpg',
      '/images/ISFJ.jpg', '/images/ISFP.jpg', '/images/ISTJ.jpg', '/images/ISTP.jpg'
    ];
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
    console.log('Home component mounted - v1.0.1');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex flex-col relative">
      {/* Top Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-center p-3 md:p-4">
        <div className="flex items-center gap-1 md:gap-4 bg-white/90 backdrop-blur-md px-1.5 py-1 md:px-3 md:py-2 rounded-full shadow-sm border border-pink-100 max-w-full overflow-x-auto scrollbar-hide">
          <Link 
            to="/contact"
            className="flex-shrink-0 flex items-center gap-1 md:gap-2 px-2 py-1.5 md:px-3 rounded-full text-gray-700 hover:bg-gray-100 transition-all whitespace-nowrap"
          >
            <MessageCircle size={16} className="md:w-[18px] md:h-[18px]" />
            <span className="text-xs md:text-sm font-medium">联系我们</span>
          </Link>

          <div className="flex-shrink-0 w-px h-3 md:h-4 bg-gray-200"></div>
          
          <button 
            onClick={() => {
              if (user) {
                window.location.href = '/recharge';
              } else {
                openAuthModal();
              }
            }}
            className="flex-shrink-0 flex items-center gap-1 md:gap-2 px-2 py-1.5 md:px-3 rounded-full text-white bg-gradient-to-r from-yellow-400 to-orange-500 shadow-sm hover:shadow-md hover:scale-105 transition-all whitespace-nowrap"
          >
            <Crown size={16} className="fill-current md:w-[18px] md:h-[18px]" />
            <span className="text-xs md:text-sm font-medium">充值VIP</span>
          </button>

          <div className="flex-shrink-0 w-px h-3 md:h-4 bg-gray-200"></div>

          {user ? (
            <div className="flex-shrink-0 flex items-center gap-1.5 pl-0.5 md:gap-2 md:pl-1">
              <div className="relative w-6 h-6 md:w-8 md:h-8 flex-shrink-0">
                <div className="w-full h-full bg-pink-100 rounded-full flex items-center justify-center text-pink-500 font-bold overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={14} className="md:w-[16px] md:h-[16px]" />
                  )}
                </div>
                {user.isVip && (
                  <div className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 bg-yellow-400 rounded-full p-[1px] md:p-0.5 border border-white z-10">
                    <Crown size={6} className="text-white fill-current md:w-[8px] md:h-[8px]" />
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center min-w-0 max-w-[60px] md:max-w-[80px]">
                <span className="text-[10px] md:text-sm font-medium text-gray-700 leading-tight truncate">{user.nickname}</span>
              </div>
              <button 
                onClick={logout} 
                className="text-[10px] md:text-xs text-gray-400 hover:text-pink-500 px-1.5 py-1 whitespace-nowrap"
              >
                退出
              </button>
            </div>
          ) : (
            <button 
              onClick={openAuthModal}
              className="flex-shrink-0 flex items-center gap-1 md:gap-2 px-2 py-1.5 md:px-3 rounded-full text-gray-700 hover:bg-gray-100 transition-all whitespace-nowrap"
            >
              <User size={16} className="md:w-[18px] md:h-[18px]" />
              <span className="text-xs md:text-sm font-medium">登录/注册</span>
            </button>
          )}
        </div>
      </nav>

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
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed flex items-center justify-center gap-2">
            探索独属于你的小小宇宙 <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
          </p>
        </div>

        {/* Fortune Tube & Worry Grocery */}
        <div className="w-full flex flex-row items-end justify-center gap-2 md:gap-12 min-h-[260px] md:min-h-[280px]">
          {/* Left: Fortune Tube */}
          <div className="flex-1 max-w-[180px] h-64 md:h-72 flex flex-col items-center justify-end">
            <FortuneTube />
          </div>

          {/* Right: Worry Grocery */}
          <div className="flex-1 max-w-[180px] h-64 md:h-72 flex flex-col items-center justify-end">
            <Link to="/worry-grocery" className="group relative w-full h-full flex flex-col items-center justify-end gap-2">
              <div className="relative w-full h-48 md:h-64 transition-all duration-500 transform group-hover:-translate-y-2 flex items-end justify-center">
                {/* Store Container */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-28 h-36 md:w-36 md:h-44">
                  {/* Main Building Block */}
                  <div className="absolute bottom-0 w-full h-24 md:h-32 bg-[#fffbf0] rounded-xl shadow-lg border-2 border-orange-100/50"></div>
                  
                  {/* Roof */}
                  <div className="absolute top-4 -left-3 w-[118%] h-8 md:h-12 z-20 filter drop-shadow-md">
                    <div className="w-full h-full bg-[#ff9f43] flex overflow-hidden [clip-path:polygon(10%_0%,90%_0%,100%_100%,0%_100%)] rounded-t-sm">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className={`flex-1 h-full ${i % 2 === 0 ? 'bg-[#ffb142]' : ''}`}></div>
                      ))}
                    </div>
                    {/* Roof Edge */}
                    <div className="absolute -bottom-1.5 left-[2%] w-[96%] flex">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="flex-1 h-2 md:h-3 bg-[#ff9f43] rounded-b-full"></div>
                      ))}
                    </div>
                  </div>

                  {/* Signboard */}
                  <div className="absolute top-16 md:top-20 left-1/2 transform -translate-x-1/2 w-20 md:w-28 z-20">
                    <div className="bg-[#8e5431] text-[#fffbf0] text-[10px] md:text-xs font-bold text-center py-1 md:py-1.5 rounded shadow-sm border border-[#6d3e1d] tracking-wide whitespace-nowrap">
                      电子宠物店
                    </div>
                  </div>

                  {/* Door/Window */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-16 md:w-16 md:h-20 bg-[#ffeaa7] rounded-t-full border-4 border-[#8e5431] overflow-hidden">
                    <div className="absolute bottom-0 w-full h-1 bg-[#8e5431]/20"></div>
                    <div className="w-full h-full flex items-center justify-center opacity-30">
                      <Cat className="w-6 h-6 md:w-8 md:h-8 text-[#8e5431]" />
                    </div>
                  </div>
                  
                  {/* Shadow */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 md:w-24 h-3 bg-black/10 rounded-full blur-md"></div>
                </div>
              </div>
              
              {/* Button */}
              <div className="mt-6 h-9 md:h-10 min-w-[6.5rem] md:min-w-[8rem] px-4 bg-[#2d3436] text-white rounded-full text-xs md:text-sm font-bold shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center gap-1 md:gap-2 whitespace-nowrap leading-none">
                <span>进来聊聊</span>
                <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
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

          {/* Animal Personality Test */}
          <a href="https://www.animal-personality-test.fun/" target="_blank" rel="noopener noreferrer" className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-green-50 overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <PawPrint className="w-24 h-24 text-green-500" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4">
                <PawPrint className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">动物塑性格测试</h3>
              <p className="text-gray-500 text-sm mb-6 flex-grow">
                发现你内心的真实天性，探索属于你的精神动物。
              </p>
              <span className="inline-flex items-center text-green-600 font-bold group-hover:gap-2 transition-all">
                开始动物塑测试 <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </div>
          </a>

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

          {/* Dream Interpretation */}
          <Link to="/dream" className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-purple-50 overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <CloudMoon className="w-24 h-24 text-purple-500" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                <CloudMoon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">周公解梦</h3>
              <p className="text-gray-500 text-sm mb-6 flex-grow">
                通过梦境解析你的真实心理年龄、适配职业，以及内心深处渴望成为的人。
              </p>
              <span className="inline-flex items-center text-purple-600 font-bold group-hover:gap-2 transition-all">
                开启梦境解析 <ArrowRight className="w-4 h-4 ml-1" />
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
          <div className="relative group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-cyan-50 overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Feather className="w-24 h-24 text-cyan-500" />
            </div>
            {/* VIP Badge */}
            <div className="absolute top-4 right-4 z-20">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                <Crown size={12} fill="currentColor" />
                VIP
              </div>
            </div>
            <div className="relative z-10 flex flex-col h-full justify-center">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-600 mb-4">
                <Feather className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">缘分探索</h3>
              <p className="text-gray-500 text-sm mb-6 flex-grow">
                输入双方信息，AI 深度解析前世今生与性格契合度，并赠予专属定情古诗。
              </p>
              
              <button 
                onClick={() => {
                  if (!user) {
                    openAuthModal();
                  } else if (!user.isVip) {
                    window.location.href = '/recharge';
                  } else {
                    window.location.href = '/compatibility';
                  }
                }}
                className="inline-flex items-center text-cyan-600 font-bold group-hover:gap-2 transition-all text-left"
              >
                {user?.isVip ? '开启缘分测试' : '解锁缘分测试'} <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="pt-8 text-center text-gray-500 text-sm border-t border-gray-100 w-full">
          <p className="font-medium text-2xl text-pink-500 italic">希望你能遇见更好的自己 ✨</p>
        </div>
      </main>
    </div>
  );
}
