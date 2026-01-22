
import { useState, useEffect } from 'react';
import { Hand, Camera, ArrowLeft, Loader2, Sparkles, BookOpen, Heart, Brain, Zap, Compass, ChevronRight, RotateCcw, ScanEye } from 'lucide-react';
import { Link } from 'react-router-dom';
import PalmUploader from '@/components/PalmUploader';

// Story Component
function PalmStory({ report, features, onReplay, onShowFull }: { report: any, features: any, onReplay: () => void, onShowFull: () => void }) {
  const [step, setStep] = useState(0);

  const scenes = [
    {
      title: "情感：内心的罗盘",
      icon: <Heart className="w-16 h-16 text-pink-500 animate-pulse" />,
      content: report.summary?.[0] || "你的感情线揭示了你内心深处的情感模式...",
      color: "bg-pink-50 text-pink-900 border-pink-100"
    },
    {
      title: "思维：理性的边界",
      icon: <Brain className="w-16 h-16 text-indigo-500 animate-bounce" />,
      content: report.summary?.[1] || "你的智慧线显示了你独特的思考方式...",
      color: "bg-indigo-50 text-indigo-900 border-indigo-100"
    },
    {
      title: "能量：生命的节奏",
      icon: <Zap className="w-16 h-16 text-yellow-500 animate-pulse" />,
      content: report.summary?.[2] || "你的生命线蕴含着你当下的能量状态...",
      color: "bg-yellow-50 text-yellow-900 border-yellow-100"
    },
    {
      title: "指引：行动的建议",
      icon: <Compass className="w-16 h-16 text-purple-500 animate-[spin_10s_linear_infinite]" />,
      content: report.attraction_profile?.key_strengths ? 
        `发挥你的优势：${report.attraction_profile.key_strengths.join('、')}。保持觉知，宇宙正在指引你前行。` : 
        "根据掌纹的启示，建议你近期多关注内心的声音，保持平衡。",
      color: "bg-purple-50 text-purple-900 border-purple-100"
    }
  ];

  const currentScene = scenes[step];
  const isLast = step === scenes.length - 1;

  return (
    <div className="max-w-md w-full animate-in zoom-in duration-500">
      <div className={`relative rounded-3xl p-8 shadow-2xl border-2 ${currentScene.color} min-h-[400px] flex flex-col items-center text-center justify-between transition-all duration-500`}>
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gray-100 rounded-t-3xl overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
            style={{ width: `${((step + 1) / scenes.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="mt-8 flex flex-col items-center flex-1">
          <div className="mb-6 p-4 bg-white rounded-full shadow-lg">
            {currentScene.icon}
          </div>
          <h3 className="text-2xl font-bold mb-6">{currentScene.title}</h3>
          <p className="text-lg leading-relaxed opacity-90 font-medium">
            {currentScene.content}
          </p>
        </div>

        {/* Controls */}
        <div className="w-full mt-8 flex flex-col gap-3">
          <button 
            onClick={() => isLast ? onShowFull() : setStep(s => s + 1)}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-xl"
          >
            {isLast ? "查看完整报告" : "继续"} <ChevronRight className="w-5 h-5" />
          </button>
          
          {step > 0 && (
            <button 
              onClick={() => setStep(0)}
              className="text-sm text-gray-400 flex items-center justify-center gap-1 hover:text-gray-600"
            >
              <RotateCcw className="w-3 h-3" /> 重播
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PalmPage() {
  const [features, setFeatures] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [showStory, setShowStory] = useState(false); // Toggle between Story and Full View

  const handleAnalysisComplete = (res: any) => {
    setFeatures(res);
    // Auto-generate report when analysis is done
    generatePalmReport(res);
  };

  const generatePalmReport = async (palmFeatures: any) => {
    setLoadingReport(true);
    try {
      // Use relative path for production compatibility
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_profile: {
            relationship_stage: 'single', // Default or could ask
            goal: 'improve_attraction',
            report_type: 'palm'
          },
          signals: {
            palm: { input_mode: 'mixed', features: palmFeatures },
          },
          entitlements: {
            pay_status: 'free', // Standalone palm is free for now or uses basic logic
          },
          ui_context: { app_name: 'LoveInsight', report_type: 'palm' },
        }),
      });
      const data = await response.json();
      setReport(data);
      setShowStory(true); // Start story mode when report is ready
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingReport(false);
    }
  };

  const reset = () => {
    setFeatures(null);
    setReport(null);
    setShowStory(false);
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
        <Link to="/" className="text-gray-600 hover:text-pink-600 flex items-center gap-1">
          <ArrowLeft className="w-5 h-5" /> 返回首页
        </Link>
        <h1 className="font-bold text-xl text-pink-800 flex items-center gap-2">
          <Hand className="w-6 h-6" /> 手相大师
        </h1>
        <div className="w-20"></div> 
      </header>

      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        {!features ? (
          <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-32 h-32 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera className="w-16 h-16 text-pink-600" />
            </div>
            
            <div>
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-blue-200 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative px-6 py-4 bg-white border-2 border-blue-100 rounded-2xl flex flex-col items-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                    <span className="text-3xl mb-1">🙋‍♂️</span>
                    <span className="text-xs text-blue-400 font-medium tracking-wider mb-1">男生</span>
                    <span className="text-xl font-black text-blue-600">左手</span>
                  </div>
                </div>
                
                <div className="text-gray-300 font-serif italic text-xl">/</div>

                <div className="relative group">
                  <div className="absolute inset-0 bg-pink-200 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative px-6 py-4 bg-white border-2 border-pink-100 rounded-2xl flex flex-col items-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                    <span className="text-3xl mb-1">🙋‍♀️</span>
                    <span className="text-xs text-pink-400 font-medium tracking-wider mb-1">女生</span>
                    <span className="text-xl font-black text-pink-600">右手</span>
                  </div>
                </div>
              </div>
              <p className="text-lg text-gray-600 max-w-lg mx-auto flex flex-col items-center gap-2">
                <span className="flex items-center gap-2">
                  让我瞅瞅你的手里藏着什么秘密 <ScanEye className="w-5 h-5 text-pink-500" />
                </span>
                <span className="text-xs text-gray-400 block">*照片仅用于实时分析，不会被保存</span>
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md mx-auto">
              <PalmUploader onAnalysisComplete={handleAnalysisComplete} />
            </div>
          </div>
        ) : loadingReport ? (
             <div className="flex flex-col items-center justify-center h-64 text-pink-500">
               <Loader2 className="w-12 h-12 animate-spin mb-4" />
               <p className="text-lg font-bold animate-pulse">AI 正在解读你的掌纹故事...</p>
             </div>
        ) : showStory && report ? (
             <PalmStory 
               report={report} 
               features={features} 
               onReplay={() => setShowStory(true)} // Actually just reset step, managed in component state 
               onShowFull={() => setShowStory(false)} 
             />
        ) : (
          <div className="max-w-xl w-full flex flex-col gap-6 animate-in zoom-in duration-500">
            
            {/* Replay Story Button */}
            <button 
              onClick={() => setShowStory(true)}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> 回放掌纹故事
            </button>

            {/* Features Section */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden h-fit">
              <div className="bg-gradient-to-br from-pink-500 to-orange-400 p-6 text-white relative overflow-hidden">
                <Sparkles className="absolute top-4 right-4 w-12 h-12 opacity-30 animate-pulse" />
                <h3 className="text-xl font-bold mb-1">掌纹特征识别</h3>
                <p className="opacity-90 text-xs">AI 视觉分析结果</p>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 bg-pink-50 rounded-xl">
                    <span className="text-gray-600 font-medium">❤️ 感情线</span>
                    <span className="font-bold text-pink-700">{features.heart_line === 'unknown' ? '未识别' : features.heart_line}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl">
                    <span className="text-gray-600 font-medium">🧠 智慧线</span>
                    <span className="font-bold text-indigo-700">{features.head_line === 'unknown' ? '未识别' : features.head_line}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <span className="text-gray-600 font-medium">🧬 生命线</span>
                    <span className="font-bold text-green-700">{features.life_line === 'unknown' ? '未识别' : features.life_line}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                    <span className="text-gray-600 font-medium">⛰️ 金星丘</span>
                    <span className="font-bold text-yellow-700">{features.mount_venus === 'unknown' ? '未识别' : features.mount_venus}</span>
                  </div>
                </div>
                
                <button 
                  onClick={reset}
                  className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 underline"
                >
                  重新拍摄
                </button>
              </div>
            </div>

            {/* Right Column: Interpretation Report */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col">
               <div className="bg-indigo-50 p-6 border-b border-indigo-100 flex items-center gap-3">
                 <BookOpen className="w-6 h-6 text-indigo-600" />
                 <h3 className="text-xl font-bold text-indigo-900">命运解读报告</h3>
               </div>
               
               <div className="p-6 flex-1 min-h-[300px]">
                 {report ? (
                   <div className="space-y-6">
                     <div>
                       <h4 className="font-bold text-gray-900 text-lg mb-2">{report.headline}</h4>
                       <div className="space-y-3">
                         {report.summary?.map((text: string, i: number) => (
                           <p key={i} className="text-gray-600 text-sm leading-relaxed">{text}</p>
                         ))}
                       </div>
                     </div>
                     
                     {report.attraction_profile && (
                       <div className="bg-pink-50 p-4 rounded-xl">
                         <h5 className="font-bold text-pink-800 text-sm mb-2">你的性格优势</h5>
                         <ul className="space-y-1">
                           {report.attraction_profile.key_strengths?.map((s: string, i: number) => (
                             <li key={i} className="text-xs text-pink-600">• {s}</li>
                           ))}
                         </ul>
                       </div>
                     )}
                   </div>
                 ) : (
                   <div className="text-center text-gray-400 py-10">
                     生成报告失败，请重试
                   </div>
                 )}
               </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
