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
    text: "梦里你正在被某种东西追赶，你觉得那是什么？",
    options: [
      { label: "看不清脸的黑影", value: "shadow" },
      { label: "巨大的时钟，滴答作响", value: "clock" },
      { label: "一大堆未完成的工作/作业", value: "work" },
      { label: "一只凶猛但熟悉的野兽", value: "beast" }
    ]
  },
  {
    id: 3,
    text: "梦境中出现了一扇门，你推开后发现竟然是：",
    options: [
      { label: "一片无边无际的沙漠", value: "desert" },
      { label: "繁华喧闹的都市街头", value: "city" },
      { label: "静谧的图书馆，书架高耸入云", value: "library" },
      { label: "满是糖果和玩具的游乐园", value: "park" }
    ]
  },
  {
    id: 4,
    text: "梦里你获得了一种超能力，你会选择：",
    options: [
      { label: "读心术，听见别人的心声", value: "mindreading" },
      { label: "隐身术，不被任何人发现", value: "invisibility" },
      { label: "瞬间移动，去任何想去的地方", value: "teleport" },
      { label: "时间倒流，改变过去的遗憾", value: "timeback" }
    ]
  },
  {
    id: 5,
    text: "醒来时，你记得梦里最后一种感觉是：",
    options: [
      { label: "怅然若失，不想醒来", value: "lost" },
      { label: "充满力量，跃跃欲试", value: "energetic" },
      { label: "松了一口气，庆幸只是梦", value: "relief" },
      { label: "平静温暖，嘴角带笑", value: "peaceful" }
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