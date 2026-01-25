import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CloudMoon, Sparkles, ChevronRight, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

interface Question {
  id: number;
  text: string;
  options: { label: string; value: string }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "在梦中，你独自走进了一片森林，这里的光线是怎样的？",
    options: [
      { label: "清晨的阳光，透过树叶洒下斑驳光影", value: "sunlight" },
      { label: "幽暗神秘，只有微弱的月光", value: "moonlight" },
      { label: "迷雾缭绕，看不清远方", value: "foggy" },
      { label: "色彩斑斓，像童话世界一样发光", value: "colorful" }
    ]
  },
  {
    id: 2,
    text: "忽然，你发现前方有一座建筑，它看起来是：",
    options: [
      { label: "一座古老而庄严的城堡", value: "castle" },
      { label: "一间温馨的小木屋", value: "cabin" },
      { label: "一座充满科技感的未来高塔", value: "tower" },
      { label: "一片废墟遗迹", value: "ruins" }
    ]
  },
  {
    id: 3,
    text: "你走进建筑，在桌上发现了一样东西，你会拿起：",
    options: [
      { label: "一本泛黄的厚重古书", value: "book" },
      { label: "一把锋利的宝剑", value: "sword" },
      { label: "一面映照出不同面孔的镜子", value: "mirror" },
      { label: "一颗散发温暖光芒的水晶球", value: "crystal" }
    ]
  },
  {
    id: 4,
    text: "此时，身后传来一个声音，你直觉那是：",
    options: [
      { label: "多年未见的老友", value: "friend" },
      { label: "儿时的自己", value: "child" },
      { label: "一位智慧的长者", value: "elder" },
      { label: "一只会说话的动物", value: "animal" }
    ]
  },
  {
    id: 5,
    text: "梦境即将结束，你必须带走一样东西回到现实，你选择：",
    options: [
      { label: "关于未来的预言", value: "knowledge" },
      { label: "无尽的财富", value: "wealth" },
      { label: "一段珍贵的回忆", value: "memory" },
      { label: "一种神奇的能力", value: "power" }
    ]
  }
];

export default function DreamInterpretation() {
  const [started, setStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

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
                   <p className="text-xl font-bold text-white truncate" title={result.career}>{result.career}</p>
                 </div>
                 <div className="bg-black/20 p-4 rounded-xl border border-white/10">
                   <p className="text-purple-300 text-sm mb-1">潜意识梦想</p>
                   <p className="text-xl font-bold text-white truncate" title={result.dreamPersona}>{result.dreamPersona}</p>
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

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {!started ? (
          <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-30 animate-pulse"></div>
              <CloudMoon className="w-32 h-32 text-purple-200 relative z-10 mx-auto" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">探索潜意识的迷宫</h2>
              <p className="text-purple-200/80 leading-relaxed">
                梦是潜意识的信使。通过构建你的专属梦境，
                我们将为你揭示真实的心理年龄、最契合的职业方向，
                以及你灵魂深处真正渴望成为的样子。
              </p>
            </div>

            <button
              onClick={handleStart}
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-900 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] transition-all hover:-translate-y-1"
            >
              开始入梦 <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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