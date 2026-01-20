import { useState, useEffect } from 'react';
import { Sparkles, Calendar, CheckCircle2, Trophy, ArrowRight, Zap, Cat, Star, Heart, Cloud } from 'lucide-react';

// Mock Data Library
const SIGNS = [
  { theme: "勇气", quote: "爱是勇者的游戏，畏首畏尾只会错失良机。", task: "给一位异性朋友点赞并评论朋友圈", icon: "🦁" },
  { theme: "邂逅", quote: "转角遇到的不只是风景，也可能是那个Ta。", task: "今天出门穿一件平时很少穿的亮色衣服", icon: "🚲" },
  { theme: "沉淀", quote: "在遇见对的人之前，先把自己变成对的人。", task: "睡前放下手机，阅读10分钟或冥想", icon: "🧘" },
  { theme: "表达", quote: "沉默不是金，真诚的表达能融化冰山。", task: "对身边的人说一句真诚的夸奖", icon: "🗣️" },
  { theme: "接纳", quote: "拥抱不完美的自己，才是魅力的开始。", task: "照镜子，找出自己身上最满意的三个部位", icon: "🪞" },
  { theme: "破冰", quote: "所有的熟络，都始于一句'你好'。", task: "在这个周末，主动发起一次约饭邀请", icon: "🤝" },
  { theme: "倾听", quote: "懂比爱更重要，倾听是懂的前提。", task: "在对话中，尝试多问'然后呢？'而不是急着发表意见", icon: "👂" },
  { theme: "边界", quote: "好的关系，是两个独立圆的相交，而不是同心圆。", task: "今天试着温和但坚定地拒绝一件你不想做的小事", icon: "🛡️" },
  { theme: "惊喜", quote: "生活需要仪式感，这与矫情无关，而是对生活的热爱。", task: "给自己买一束花或者一杯好喝的饮料", icon: "🎁" },
  { theme: "眼神", quote: "眼睛是心灵的窗户，试着用眼神传递你的善意。", task: "与对话的人保持3秒以上的眼神接触", icon: "👁️" },
  { theme: "微笑", quote: "微笑是世界上最通用的语言，也是最迷人的妆容。", task: "对便利店店员或快递员真诚地微笑并说声谢谢", icon: "😊" },
  { theme: "赞美", quote: "发现美的眼睛，比美本身更珍贵。", task: "真诚地夸奖一位异性的衣着或发型", icon: "👍" },
  { theme: "好奇", quote: "保持好奇心，是让人永远年轻的秘诀。", task: "了解一个你完全不熟悉的爱好或领域", icon: "🧐" },
  { theme: "独处", quote: "只有学会独处，才能在关系中不迷失自己。", task: "一个人去咖啡馆坐坐，不玩手机，观察周围的人", icon: "☕" },
  { theme: "整理", quote: "清理身边的杂物，也是在清理内心的情绪。", task: "整理手机相册，删除5张不再需要的截图或照片", icon: "🧹" },
  { theme: "复盘", quote: "经验不是发生在你身上的事，而是你对它的理解。", task: "睡前想一件今天发生的好事，并记录下来", icon: "📝" },
  { theme: "主动", quote: "等待只会带来焦虑，行动才能带来结果。", task: "主动给一个许久未联系的朋友发个微信问候", icon: "🚀" },
  { theme: "宽容", quote: "原谅别人，其实是放过自己。", task: "心里默默原谅一个曾经冒犯过你的人", icon: "🕊️" },
  { theme: "真实", quote: "与其完美，不如真实。真实自有万钧之力。", task: "在朋友圈发一条不加滤镜的生活照或真实感悟", icon: "📷" },
  { theme: "慢活", quote: "慢下来，才能听见花开的声音。", task: "走路的速度放慢一半，感受脚下的路", icon: "🐢" },
  { theme: "礼物", quote: "礼物不在贵重，而在心意。", task: "给家人或朋友准备一份手写的小便签", icon: "🎀" },
  { theme: "幽默", quote: "幽默感是最高级的性感。", task: "准备一个冷笑话，讲给身边的人听", icon: "🤡" },
  { theme: "学习", quote: "最好的投资，是投资自己。", task: "阅读一篇关于两性心理或沟通技巧的文章", icon: "📚" },
  { theme: "运动", quote: "流汗是最好的排毒，也是最好的化妆。", task: "做20个深蹲或散步30分钟", icon: "🏃" },
  { theme: "声音", quote: "声音是第二张脸，温柔的语气能抚平焦躁。", task: "给重要的人发一条语音消息，注意语气的温和", icon: "🎵" },
  { theme: "信任", quote: "信任是关系的基石，也是勇气的体现。", task: "把一件小事放手交给别人去做，并信任对方", icon: "🤝" },
  { theme: "梦想", quote: "有梦想的人，眼睛里有光。", task: "花5分钟想象一下你理想中的亲密关系是什么样子的", icon: "✨" },
  { theme: "示弱", quote: "适当的示弱，能激起对方的保护欲。", task: "请一位异性帮一个小忙（如拧瓶盖、拿东西）", icon: "🥺" },
  { theme: "细节", quote: "细节打败爱情，也能成就爱情。", task: "观察一位朋友的习惯，下次见面时给ta一个小惊喜", icon: "🔍" },
  { theme: "拒绝", quote: "学会说不，你的'是'才更有价值。", task: "推掉一个无意义的社交局，把时间留给自己", icon: "🚫" },
  { theme: "尝新", quote: "生活需要新鲜感，爱情也是。", task: "走一条平时没走过的路回家", icon: "🗺️" },
  { theme: "感恩", quote: "感恩的心，离幸福最近。", task: "给父母打个电话，聊聊家常", icon: "🙏" },
  { theme: "专注", quote: "专注当下的力量，是无穷的。", task: "吃饭时关掉电视和手机，专心享受食物的味道", icon: "🍲" },
  { theme: "探索", quote: "未知的世界，藏着无限的可能。", task: "搜一家评分高但没去过的店，列入周末计划", icon: "🧭" },
];

const TITLES = [
  { days: 3, name: "初级灵犀学徒", icon: "🌱" },
  { days: 7, name: "桃花见习生", icon: "🌸" },
  { days: 21, name: "情感修炼师", icon: "🔮" },
  { days: 100, name: "恋爱大宗师", icon: "👑" },
];

export default function DailyCheckIn() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [streak, setStreak] = useState(0);
  const [todaySign, setTodaySign] = useState<any>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Load state from local storage
    const lastDate = localStorage.getItem('lastCheckInDate');
    const storedStreak = parseInt(localStorage.getItem('checkInStreak') || '0');
    const storedSign = localStorage.getItem('todaySign');
    
    const today = new Date().toISOString().split('T')[0];

    if (lastDate === today) {
      setCheckedIn(true);
      setStreak(storedStreak);
      if (storedSign) setTodaySign(JSON.parse(storedSign));
    } else {
      // Check if streak is broken (missed yesterday)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastDate === yesterdayStr) {
        setStreak(storedStreak);
      } else {
        setStreak(0); // Reset streak if broken
      }
    }
  }, []);

  const handleCheckIn = () => {
    setShowAnimation(true);
    
    // Simulate API delay / Animation
    setTimeout(() => {
      const today = new Date().toISOString().split('T')[0];
      const randomSign = SIGNS[Math.floor(Math.random() * SIGNS.length)];
      
      const newStreak = streak + 1;
      
      localStorage.setItem('lastCheckInDate', today);
      localStorage.setItem('checkInStreak', newStreak.toString());
      localStorage.setItem('todaySign', JSON.stringify(randomSign));
      
      setCheckedIn(true);
      setStreak(newStreak);
      setTodaySign(randomSign);
      setShowAnimation(false);
    }, 1500);
  };

  const getNextTitle = () => {
    return TITLES.find(t => t.days > streak) || TITLES[TITLES.length - 1];
  };

  const currentTitle = [...TITLES].reverse().find(t => t.days <= streak) || { name: "灵犀萌新", icon: "🥚" };

  return (
    <div className="w-full max-w-2xl mx-auto mb-12 animate-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-pink-100 border-4 border-white overflow-hidden relative">
        {/* Cartoon Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-100/50 to-purple-100/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-100/50 to-yellow-100/50 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-6 right-8 animate-bounce delay-700 text-pink-200">
          <Heart className="w-6 h-6 fill-current" />
        </div>
        <div className="absolute bottom-12 left-6 animate-pulse text-yellow-200">
          <Star className="w-8 h-8 fill-current" />
        </div>
        <div className="absolute top-1/2 left-4 text-purple-100 transform -rotate-12">
          <Cloud className="w-10 h-10 fill-current" />
        </div>

        <div className="p-6 md:p-10 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
               {/* Mascot Avatar */}
               <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg relative overflow-hidden">
                 <Cat className="w-10 h-10 text-pink-500 absolute -bottom-1" />
               </div>
               <div>
                <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                  每日灵犀签
                </h2>
                <p className="text-sm text-gray-400 font-medium">坚持打卡，积攒桃花能量</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-amber-50 pl-2 pr-5 py-2 rounded-full border border-orange-100 shadow-sm">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">
                {currentTitle.icon}
              </div>
              <div className="text-right">
                <div className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">当前称号</div>
                <div className="text-sm font-black text-orange-700">{currentTitle.name}</div>
              </div>
            </div>
          </div>

          {!checkedIn ? (
            <div className="text-center py-10">
              <div className="mb-8 relative inline-block perspective-1000">
                 {showAnimation && (
                   <div className="absolute inset-0 flex items-center justify-center z-20">
                     <span className="text-6xl animate-ping">✨</span>
                   </div>
                 )}
                 <div className={`w-40 h-56 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl mx-auto shadow-2xl flex flex-col items-center justify-center border-[6px] border-white transform transition-all duration-700 preserve-3d cursor-pointer hover:-translate-y-2 ${showAnimation ? 'rotate-y-180 scale-0 opacity-0' : 'scale-100'}`}
                      onClick={handleCheckIn}
                 >
                   <div className="w-full h-full border-2 border-white/20 rounded-xl flex items-center justify-center flex-col gap-2">
                     <span className="text-6xl filter drop-shadow-md">🎴</span>
                     <span className="text-white/80 font-bold text-sm tracking-widest">点击抽取</span>
                   </div>
                 </div>
                 {/* Card Shadow */}
                 <div className="w-32 h-4 bg-black/10 blur-xl rounded-full mx-auto mt-4"></div>
              </div>
              
              <button 
                onClick={handleCheckIn}
                disabled={showAnimation}
                className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-70 flex items-center justify-center gap-2 mx-auto"
              >
                {showAnimation ? '正在接收宇宙信号...' : '抽取今日运势'} <Sparkles className="w-4 h-4" />
              </button>
              <p className="text-xs text-gray-400 mt-6 font-medium bg-gray-50 inline-block px-4 py-1 rounded-full">
                已连续打卡 <span className="text-pink-500 font-bold text-lg mx-1">{streak}</span> 天
              </p>
            </div>
          ) : (
            <div className="animate-in zoom-in duration-500">
              {/* The Sign Card */}
              <div className="bg-gradient-to-br from-pink-50 via-white to-purple-50 rounded-3xl p-8 border border-pink-100 mb-6 relative overflow-hidden shadow-sm group hover:shadow-md transition-shadow">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-pink-100 rounded-full opacity-50"></div>
                <div className="absolute top-4 right-6 text-6xl opacity-10 font-serif text-pink-900 leading-none">“</div>
                
                <div className="flex flex-col md:flex-row gap-6 items-center relative z-10">
                  <div className="flex-shrink-0 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-pink-50 transform group-hover:rotate-12 transition-transform duration-300">
                    <span className="text-4xl">{todaySign?.icon || "✨"}</span>
                  </div>
                  
                  <div className="text-center md:text-left flex-1">
                    <div className="inline-block px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-xs font-bold mb-3">
                       #{todaySign?.theme}
                    </div>
                    <p className="text-xl text-gray-800 font-bold leading-relaxed italic mb-4">
                      "{todaySign?.quote}"
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-pink-400 font-bold uppercase tracking-widest">
                      <Sparkles className="w-3 h-3" /> 今日灵犀指引
                    </div>
                  </div>
                </div>
              </div>

              {/* The Task */}
              <div className="bg-white border-2 border-dashed border-indigo-200 rounded-2xl p-6 flex items-start gap-5 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 fill-current" />
                </div>
                <div className="flex-1 pt-1">
                  <h4 className="font-black text-gray-900 mb-2 flex items-center gap-2 text-lg">
                    3分钟桃花任务
                    <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">进行中</span>
                  </h4>
                  <p className="text-gray-600 font-medium">{todaySign?.task}</p>
                </div>
                <button className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 self-center whitespace-nowrap bg-indigo-50 px-4 py-2 rounded-xl group-hover:bg-white transition-colors">
                  去完成 <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Streak Progress */}
              <div className="mt-8">
                <div className="flex items-center justify-between text-xs font-bold text-gray-400 mb-2">
                  <div className="flex items-center gap-1 text-green-500">
                    <CheckCircle2 className="w-4 h-4 fill-current" />
                    今日已打卡
                  </div>
                  <div className="flex items-center gap-1">
                    距离 <span className="text-gray-700">{getNextTitle()?.name}</span> 还需 
                    <span className="text-pink-500 text-lg mx-1">{getNextTitle()?.days - streak}</span> 天
                  </div>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 transition-all duration-1000 relative"
                    style={{ width: `${Math.min((streak / getNextTitle()?.days) * 100, 100)}%` }}
                  >
                    <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/50 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}