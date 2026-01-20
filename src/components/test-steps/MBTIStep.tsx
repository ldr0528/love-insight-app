
import { useState } from 'react';
import { useReportStore } from '@/store/useReportStore';
import { RefreshCcw, Check, Brain, ChevronLeft } from 'lucide-react';
import MBTIQuiz from '@/components/MBTIQuiz';

export default function MBTIStep() {
  const { mbti, setMBTI, nextStep, prevStep } = useReportStore();
  const [showQuiz, setShowQuiz] = useState(false);

  const mbtiTypes = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      {showQuiz && (
        <MBTIQuiz 
          onComplete={(result) => {
            setMBTI(result);
            setShowQuiz(false);
          }} 
          onCancel={() => setShowQuiz(false)} 
        />
      )}

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">第二步：人格分析</h2>
        <p className="text-gray-500">MBTI 决定了你在亲密关系中的底层逻辑</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <Brain className="w-10 h-10 text-indigo-600" />
          </div>
          
          <button
            onClick={() => setShowQuiz(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-colors shadow-md hover:shadow-lg"
          >
            <RefreshCcw className="w-4 h-4" />
            {mbti ? '重新测试' : '开始 50 题深度测试'}
          </button>
          
          <p className="text-xs text-gray-400 mt-2">大约需要 5 分钟</p>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">或者直接选择</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {mbtiTypes.map((type) => (
            <button
              key={type}
              onClick={() => setMBTI(type)}
              className={`p-2 rounded-lg text-sm font-bold border-2 transition-all ${
                mbti === type
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={prevStep}
          className="px-6 py-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextStep}
          disabled={!mbti}
          className={`flex-1 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
            mbti 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white cursor-pointer' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          下一步：手相运势 &rarr;
        </button>
      </div>
    </div>
  );
}
