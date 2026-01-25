import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CloudMoon, Sparkles, ChevronRight, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

const Whale = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 800 600"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="whaleBodyGradient" x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0%" stopColor="#4F46E5" />
        <stop offset="50%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#C084FC" />
      </linearGradient>

      <linearGradient id="bellyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#E0E7FF" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#E0E7FF" stopOpacity="0.4" />
      </linearGradient>

      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <g fill="#FFF" fillOpacity="0.6">
      <circle cx="100" cy="100" r="2" className="animate-pulse" />
      <circle cx="700" cy="150" r="3" className="animate-pulse" style={{ animationDelay: '1s' }} />
      <circle cx="500" cy="50" r="1.5" className="animate-pulse" style={{ animationDelay: '2s' }} />
      <path d="M600 80 L602 85 L607 87 L602 89 L600 94 L598 89 L593 87 L598 85 Z" fill="#FCD34D" className="animate-[spin_4s_linear_infinite]" />
    </g>

    <g className="animate-[float_6s_ease-in-out_infinite]">
      
      <path
        d="M680 280 Q 750 220 780 180 Q 740 250 720 290 Q 760 320 790 350 Q 720 330 680 300"
        fill="url(#whaleBodyGradient)"
        opacity="0.9"
      />

      <path
        d="M150 300 
           C 150 180, 350 150, 500 180 
           C 650 210, 700 250, 680 300
           C 660 380, 500 420, 350 380
           C 200 340, 150 300, 150 300 Z"
        fill="url(#whaleBodyGradient)"
        filter="url(#glow)"
      />

      <path
        d="M180 320
           C 250 360, 450 390, 620 330
           C 580 380, 400 400, 220 360 Z"
        fill="url(#bellyGradient)"
      />

      <path
        d="M400 320
           C 380 380, 320 420, 280 400
           C 320 380, 360 350, 400 320"
        fill="#6D28D9" 
        opacity="0.8"
      />

      <path
        d="M260 280 Q 270 275 280 280"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />

      <g transform="translate(280, 180)">
        <circle cx="0" cy="0" r="4" fill="white" opacity="0.4" className="animate-[ping_3s_linear_infinite]" />
        <circle cx="15" cy="-20" r="6" fill="white" opacity="0.3" className="animate-[ping_4s_linear_infinite]" style={{ animationDelay: '1s' }} />
        <circle cx="-10" cy="-35" r="3" fill="white" opacity="0.2" className="animate-[ping_2s_linear_infinite]" style={{ animationDelay: '0.5s' }} />
      </g>
      
      <g stroke="white" strokeWidth="1" strokeOpacity="0.4" fill="white">
        <circle cx="350" cy="250" r="1.5" />
        <circle cx="400" cy="220" r="1.5" />
        <circle cx="450" cy="240" r="1.5" />
        <line x1="350" y1="250" x2="400" y2="220" />
        <line x1="400" y1="220" x2="450" y2="240" />
      </g>
    </g>
  </svg>
);

interface Question {
  id: number;
  text: string;
  options: { label: string; value: string }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "如果今晚你会做一个梦，你最希望梦见什么场景？",
    options: [
      { label: "在云端飞行，俯瞰大地", value: "flying" },
      { label: "回到童年的老房子，和家人吃饭", value: "childhood" },
      { label: "在深海潜水，周围是发光的鱼群", value: "deepsea" },
      { label: "站在舞台中央，掌声雷动", value: "stage" }
    ]
  },
  {
    id: 2,
    text: "梦里的天气通常是什么样的？",
    options: [
      { label: "温暖的午后阳光", value: "sunny" },
      { label: "狂风暴雨，电闪雷鸣", value: "storm" },
      { label: "阴沉压抑的乌云", value: "cloudy" },
      { label: "漫天飞雪，寂静无声", value: "snow" }
    ]
  },
  {
    id: 3,
    text: "梦里你正在被某种东西追赶，你觉得那是什么？",
    options: [
      { label: "看不清脸的黑影", value: "shadow" },
      { label: "巨大的时钟，滴答作响", value: "clock" },
      { label: "一大堆未完成的工作/作业", value: "work" },
      { label: "一只凶猛但熟悉的野兽", value: "beast" }
    ]
  },
  {
    id: 4,
    text: "梦境中出现了一扇门，你推开后发现竟然是：",
    options: [
      { label: "一片无边无际的沙漠", value: "desert" },
      { label: "繁华喧闹的都市街头", value: "city" },
      { label: "静谧的图书馆，书架高耸入云", value: "library" },
      { label: "满是糖果和玩具的游乐园", value: "park" }
    ]
  },
  {
    id: 5,
    text: "梦里有一个看不清脸的人递给你一样东西，那是：",
    options: [
      { label: "一把陈旧的钥匙", value: "key" },
      { label: "一封没有字的信", value: "letter" },
      { label: "一朵永不凋谢的花", value: "flower" },
      { label: "一块破碎的怀表", value: "watch" }
    ]
  },
  {
    id: 6,
    text: "在梦里，你发现自己变成了一种动物，你觉得是：",
    options: [
      { label: "翱翔天际的鹰", value: "eagle" },
      { label: "自由自在的猫", value: "cat" },
      { label: "深海孤独的鲸", value: "whale" },
      { label: "森林之王狮子", value: "lion" }
    ]
  },
  {
    id: 7,
    text: "梦里你获得了一种超能力，你会选择：",
    options: [
      { label: "读心术，听见别人的心声", value: "mindreading" },
      { label: "隐身术，不被任何人发现", value: "invisibility" },
      { label: "瞬间移动，去任何想去的地方", value: "teleport" },
      { label: "时间倒流，改变过去的遗憾", value: "timeback" }
    ]
  },
  {
    id: 8,
    text: "梦里你来到一条河边，河水是：",
    options: [
      { label: "清澈见底，游鱼可数", value: "clear" },
      { label: "湍急浑浊，咆哮奔腾", value: "turbid" },
      { label: "静止不动，像一面镜子", value: "still" },
      { label: "五彩斑斓，像流动的油彩", value: "colorful_river" }
    ]
  },
  {
    id: 9,
    text: "你在梦中捡到了一把钥匙，你觉得它能打开：",
    options: [
      { label: "家里的旧衣柜", value: "wardrobe" },
      { label: "通往另一个世界的门", value: "portal" },
      { label: "一个埋藏地下的宝箱", value: "chest" },
      { label: "你自己心房的锁", value: "heart" }
    ]
  },
  {
    id: 10,
    text: "梦里出现了一面镜子，但镜子里照出的不是你，而是：",
    options: [
      { label: "一只盯着你看的猫", value: "cat_mirror" },
      { label: "一个苍老陌生的人", value: "stranger" },
      { label: "空无一物，只有背景", value: "empty" },
      { label: "你小时候的样子", value: "young" }
    ]
  },
  {
    id: 11,
    text: "梦中你必须走过一座桥，这座桥是：",
    options: [
      { label: "摇摇欲坠的独木桥", value: "plank" },
      { label: "宏伟壮观的石拱桥", value: "stone" },
      { label: "看不见尽头的玻璃桥", value: "glass" },
      { label: "由彩虹构成的幻影桥", value: "rainbow" }
    ]
  },
  {
    id: 12,
    text: "忽然，天空下起了一场雨，雨滴竟然是：",
    options: [
      { label: "五颜六色的糖果", value: "candy" },
      { label: "冰冷的刀片", value: "blade" },
      { label: "燃烧的火苗", value: "fire" },
      { label: "发光的星星碎片", value: "star" }
    ]
  },
  {
    id: 13,
    text: "梦里你正在准备一场表演，但上台前你发现：",
    options: [
      { label: "你忘记了所有的台词", value: "forgot" },
      { label: "你没有穿演出服", value: "naked" },
      { label: "台下空无一人", value: "empty_seat" },
      { label: "你变成了一个木偶", value: "puppet" }
    ]
  },
  {
    id: 14,
    text: "梦境的最后，有人问了你一个问题，你还没回答就醒了，那个问题是：",
    options: [
      { label: "“你快乐吗？”", value: "happy" },
      { label: "“你要去哪里？”", value: "where" },
      { label: "“你是谁？”", value: "who" },
      { label: "“你忘记了什么？”", value: "forget" }
    ]
  },
  {
    id: 15,
    text: "醒来时，你记得梦里最后一种感觉是：",
    options: [
      { label: "怅然若失，不想醒来", value: "lost" },
      { label: "充满力量，跃跃欲试", value: "energetic" },
      { label: "松了一口气，庆幸只是梦", value: "relief" },
      { label: "平静温暖，嘴角带笑", value: "peaceful" }
    ]
  },
  {
    id: 16,
    text: "梦里你听到了一种声音，一直回荡在耳边，那是：",
    options: [
      { label: "悠扬的笛声", value: "flute" },
      { label: "嘈杂的电流声", value: "noise" },
      { label: "某人的低语", value: "whisper" },
      { label: "海浪拍打礁石的声音", value: "waves" }
    ]
  },
  {
    id: 17,
    text: "你发现家里多了一个从未见过的房间，里面放着：",
    options: [
      { label: "一架落满灰尘的钢琴", value: "piano" },
      { label: "满墙的奇怪面具", value: "masks" },
      { label: "无数的镜子", value: "mirrors" },
      { label: "一张舒适的旧沙发", value: "sofa" }
    ]
  },
  {
    id: 18,
    text: "梦里你必须丢弃一样东西才能前行，你会丢掉：",
    options: [
      { label: "沉重的背包", value: "backpack" },
      { label: "昂贵的首饰", value: "jewelry" },
      { label: "模糊的照片", value: "photo" },
      { label: "手里的地图", value: "map" }
    ]
  },
  {
    id: 19,
    text: "你走进一片森林，树上结的果实竟然是：",
    options: [
      { label: "发光的灯泡", value: "bulb" },
      { label: "滴答作响的时钟", value: "clock_fruit" },
      { label: "透明的水晶球", value: "crystal" },
      { label: "鲜红的心脏", value: "heart_fruit" }
    ]
  },
  {
    id: 20,
    text: "梦境即将结束，你眼前出现了一道光，这道光是：",
    options: [
      { label: "刺眼的白光", value: "white_light" },
      { label: "柔和的金光", value: "gold_light" },
      { label: "幽冷的蓝光", value: "blue_light" },
      { label: "温暖的橙光", value: "orange_light" }
    ]
  }
];

export default function DreamInterpretation() {
  const [started, setStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    psychologicalAge: number;
    career: string;
    dreamPersona: string;
    analysis: string;
  } | null>(null);

  const handleStart = () => {
    setStarted(true);
  };

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [questions[currentQIndex].id]: value }));
    
    if (currentQIndex < questions.length - 1) {
      setTimeout(() => setCurrentQIndex(prev => prev + 1), 300);
    } else {
      submitAnswers({ ...answers, [questions[currentQIndex].id]: value });
    }
  };

  const submitAnswers = async (finalAnswers: Record<number, string>) => {
    setLoading(true);
    try {
      const res = await fetch('/api/dream/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        toast.error('解析失败，请稍后再试');
      }
    } catch (error) {
      console.error(error);
      toast.error('网络错误');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white font-sans p-6 flex flex-col items-center">
         <header className="w-full max-w-2xl flex items-center mb-8">
          <Link to="/" className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="ml-2 font-bold text-xl flex items-center gap-2">
            <CloudMoon className="w-5 h-5 text-purple-300" /> 周公解梦 · 梦境解析报告
          </h1>
        </header>

        <main className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
           <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
             {/* Decorative Elements */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
             
             <div className="relative z-10 text-center space-y-8">
               <div className="inline-block p-4 bg-purple-500/30 rounded-full mb-4">
                 <Sparkles className="w-12 h-12 text-purple-200" />
               </div>
               
               <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">
                 你的梦境映射
               </h2>

               <div className="grid gap-6 md:grid-cols-3 text-left mt-8">
                 <div className="bg-black/20 p-4 rounded-xl border border-white/10">
                   <p className="text-purple-300 text-sm mb-1">真实心理年龄</p>
                   <p className="text-2xl font-bold text-white">{result.psychologicalAge}岁</p>
                 </div>
                 <div className="bg-black/20 p-4 rounded-xl border border-white/10">
                  <p className="text-purple-300 text-sm mb-1">灵魂适配职业</p>
                  <p className="text-xl font-bold text-white break-words" title={result.career}>{result.career}</p>
                </div>
                <div className="bg-black/20 p-4 rounded-xl border border-white/10">
                  <p className="text-purple-300 text-sm mb-1">潜意识梦想</p>
                  <p className="text-xl font-bold text-white break-words" title={result.dreamPersona}>{result.dreamPersona}</p>
                </div>
               </div>

               <div className="bg-white/5 rounded-2xl p-6 text-left border border-white/10">
                 <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                   <Moon className="w-4 h-4 text-yellow-300" /> 深度解析
                 </h3>
                 <p className="text-gray-200 leading-relaxed text-justify">
                   {result.analysis}
                 </p>
               </div>

               <button 
                 onClick={() => {
                   setResult(null);
                   setStarted(false);
                   setCurrentQIndex(0);
                   setAnswers({});
                 }}
                 className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full font-bold shadow-lg hover:shadow-purple-500/50 transition-all hover:-translate-y-1"
               >
                 重新探索梦境
               </button>
             </div>
           </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 text-white font-sans flex flex-col">
      <header className="p-4 flex items-center">
        <Link to="/" className="p-2 rounded-full hover:bg-white/10 transition-colors text-white">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="ml-2 font-bold text-xl flex items-center gap-2">
          <CloudMoon className="w-5 h-5 text-purple-300" /> 周公解梦
        </h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        {!started ? (
          <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500 relative z-10">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-30 animate-pulse"></div>
              {/* Big Blue Whale Illustration */}
              <div className="relative w-48 h-48 mx-auto mb-4 animate-[float_6s_ease-in-out_infinite]">
                 <Whale className="w-full h-full text-blue-300 drop-shadow-[0_0_15px_rgba(147,197,253,0.5)]" strokeWidth={1} />
                 <div className="absolute -top-4 right-10 w-4 h-4 bg-white rounded-full opacity-60 animate-[ping_3s_linear_infinite]"></div>
                 <div className="absolute top-10 -left-4 w-2 h-2 bg-blue-200 rounded-full opacity-40 animate-bounce"></div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
                探索潜意识的深海
              </h2>
              <p className="text-blue-100/80 leading-relaxed font-light">
                梦境如同深海，藏着你未曾察觉的真实自我。
                跟随这只引路鲸，潜入 15 层梦境深处，
                找回那个被遗忘的自己。
              </p>
            </div>

            <button
              onClick={handleStart}
              className="group relative inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-bold text-lg shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] transition-all hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                潜入梦境 <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>
        ) : loading ? (
          <div className="text-center space-y-4">
            <CloudMoon className="w-16 h-16 text-purple-300 animate-bounce mx-auto" />
            <p className="text-xl font-medium animate-pulse">正在解析梦境碎片...</p>
          </div>
        ) : (
          <div className="max-w-xl w-full bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl animate-in slide-in-from-right duration-500">
            <div className="mb-8">
              <div className="flex justify-between text-sm text-purple-300 mb-2">
                <span>梦境节点 {currentQIndex + 1}</span>
                <span>{questions.length}</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-400 transition-all duration-500 ease-out"
                  style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-8 leading-snug">
              {questions[currentQIndex].text}
            </h3>

            <div className="space-y-4">
              {questions[currentQIndex].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/20 border border-white/10 hover:border-purple-300/50 transition-all group flex items-center justify-between"
                >
                  <span className="text-lg">{option.label}</span>
                  <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-purple-300" />
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}