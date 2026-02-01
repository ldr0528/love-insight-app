
import { useState, useRef } from 'react';
import { Brain, RefreshCcw, ArrowLeft, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import MBTIQuiz from '@/components/MBTIQuiz';
import MBTICharacter from '@/components/MBTICharacter';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

export default function MBTIPage() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (!resultRef.current) return;

    const toastId = toast.loading('正在生成图片...');
    
    try {
      const canvas = await html2canvas(resultRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
      });
      
      const link = document.createElement('a');
      link.download = `灵犀-MBTI测试结果-${result}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success('图片已保存', { id: toastId });
    } catch (error) {
      console.error('Failed to generate image:', error);
      toast.error('保存失败，请重试', { id: toastId });
    }
  };

  const mbtiDescriptions: Record<string, string> = {
    INTJ: "建筑师 - 富有想象力和战略性的思想家，一切皆在计划之中。",
    INTP: "逻辑学家 - 具有创造力的发明家，对知识有着止不住的渴望。",
    ENTJ: "指挥官 - 大胆，富有想象力且意志强大的领导者。",
    ENTP: "辩论家 - 聪明好奇的思想者，不会放弃任何智力挑战。",
    INFJ: "提倡者 - 安静而神秘，同时鼓舞人心且不知疲倦的理想主义者。",
    INFP: "调停者 - 诗意，善良的利他主义者，总是热情地为正当事业提供帮助。",
    ENFJ: "主人公 - 清里斯迈，鼓舞人心的领导者，有能力让听众着迷。",
    ENFP: "竞选者 - 热情，有创造力爱社交的自由人，总能找到理由微笑。",
    ISTJ: "物流师 - 实际，有责任感，以事实为依据的个人。",
    ISFJ: "守卫者 - 专注，温暖的守护者，时刻准备着保护心爱的人。",
    ESTJ: "总经理 - 出色的管理者，在管理事情或人的方面无与伦比。",
    ESFJ: "执政官 - 极有同情心，爱社交受欢迎的人，总是热心提供帮助。",
    ISTP: "鉴赏家 - 大胆而实际的实验家，擅长使用各种形式的工具。",
    ISFP: "探险家 - 灵活有魅力的艺术家，时刻准备着探索和体验新鲜事物。",
    ESTP: "企业家 - 聪明，精力充沛，善于感知的人，真心享受生活。",
    ESFP: "表演者 - 自发，精力充沛而热情的表演者，生活在他们周围永不无聊。",
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex flex-col">
      {showQuiz && (
        <MBTIQuiz 
          onComplete={(res) => {
            setResult(res);
            setShowQuiz(false);
          }} 
          onCancel={() => setShowQuiz(false)} 
        />
      )}

      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
        <Link to="/" className="text-gray-600 hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-5 h-5" /> 返回首页
        </Link>
        <h1 className="font-bold text-xl text-indigo-800 flex items-center gap-2">
          <Brain className="w-6 h-6" /> MBTI 人格测试
        </h1>
        <div className="w-20"></div> {/* Spacer */}
      </header>

      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        {!result ? (
          <div className="max-w-2xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-16 h-16 text-indigo-600" />
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900">探索你的真实人格</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              基于荣格心理学理论，只需 50 道深度测试题，<br/>
              快速解析你的性格代码与潜能。
            </p>
            
            <button
              onClick={() => setShowQuiz(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-bold py-4 px-12 rounded-full shadow-xl transition-all transform hover:scale-105"
            >
              开始深度测试
            </button>
            
            <div className="grid grid-cols-3 gap-8 mt-12 text-gray-500">
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <div className="font-bold text-2xl text-indigo-600 mb-1">3min</div>
                <div className="text-sm">深度分析</div>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <div className="font-bold text-2xl text-indigo-600 mb-1">16</div>
                <div className="text-sm">人格类型</div>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <div className="font-bold text-2xl text-indigo-600 mb-1">FREE</div>
                <div className="text-sm">完全免费</div>
              </div>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="max-w-lg w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-500">
            <div className="bg-indigo-600 p-8 text-center text-white relative">
               <div className="absolute top-0 left-0 w-full h-full bg-indigo-600 opacity-50 z-0"></div>
               <div className="relative z-10 flex flex-col items-center">
                  <h3 className="text-lg font-medium opacity-80 mb-4">你的测试结果</h3>
                  
                  {/* Character Image */}
                  <div className="w-32 h-32 mb-4 shadow-lg rounded-xl overflow-hidden border-4 border-white/20">
                     <MBTICharacter type={result} />
                  </div>

                  <div className="text-5xl font-extrabold tracking-widest mb-2">{result}</div>
                  <div className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                    {mbtiDescriptions[result]?.split(' - ')[0]}
                  </div>
               </div>
            </div>
            
            <div className="p-8 space-y-6">
              <p className="text-gray-700 text-lg leading-relaxed text-center">
                {mbtiDescriptions[result]?.split(' - ')[1]}
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowQuiz(true)}
                  className="flex-1 py-3 border-2 border-indigo-100 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCcw className="w-4 h-4" /> 重测
                </button>
                <button 
                  onClick={handleShare}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" /> 分享结果
                </button>
              </div>
              

            </div>
          </div>
        )}
      </main>
    </div>
  );
}
