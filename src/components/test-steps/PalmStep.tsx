
import { useState } from 'react';
import { useReportStore } from '@/store/useReportStore';
import { ChevronLeft, Hand, Camera, List } from 'lucide-react';
import PalmUploader from '@/components/PalmUploader';

export default function PalmStep() {
  const { palm, setPalmFeatures, nextStep, prevStep } = useReportStore();
  const [inputMode, setInputMode] = useState<'upload' | 'manual'>('upload');

  const isComplete = palm.heart_line !== 'unknown' || palm.head_line !== 'unknown';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">第三步：手相运势</h2>
        <p className="text-gray-500">掌纹不仅记录过去，也暗示未来</p>
      </div>

      <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex p-1 mb-4">
        <button
          onClick={() => setInputMode('upload')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
            inputMode === 'upload' 
              ? 'bg-pink-100 text-pink-700 shadow-sm' 
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <Camera className="w-4 h-4" /> 拍照智能分析
        </button>
        <button
          onClick={() => setInputMode('manual')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
            inputMode === 'manual' 
              ? 'bg-pink-100 text-pink-700 shadow-sm' 
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <List className="w-4 h-4" /> 手动选择特征
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[300px]">
        {inputMode === 'upload' ? (
          <PalmUploader onAnalysisComplete={(features) => setPalmFeatures(features)} />
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">感情线 (Heart Line)</label>
              <select 
                value={palm.heart_line}
                onChange={(e) => setPalmFeatures({ heart_line: e.target.value })}
                className="w-full border-gray-200 rounded-lg p-3 bg-gray-50"
              >
                <option value="unknown">不清楚</option>
                <option value="long">长（延伸至食指）- 重情重义</option>
                <option value="short">短（止于中指）- 现实主义</option>
                <option value="forked">末端分叉 - 幸福美满</option>
                <option value="chained">锁链状 - 多愁善感</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">智慧线 (Head Line)</label>
              <select 
                value={palm.head_line}
                onChange={(e) => setPalmFeatures({ head_line: e.target.value })}
                className="w-full border-gray-200 rounded-lg p-3 bg-gray-50"
              >
                <option value="unknown">不清楚</option>
                <option value="straight">平直 - 务实理性</option>
                <option value="curved">弯曲 - 想象力丰富</option>
                <option value="long">长 - 思考深入</option>
              </select>
            </div>

             <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">生命线 (Life Line)</label>
              <select 
                value={palm.life_line}
                onChange={(e) => setPalmFeatures({ life_line: e.target.value })}
                className="w-full border-gray-200 rounded-lg p-3 bg-gray-50"
              >
                <option value="unknown">不清楚</option>
                <option value="deep">深长 - 精力旺盛</option>
                <option value="faint">浅淡 - 体质敏感</option>
                <option value="broken">断续 - 变化较多</option>
                <option value="wide_arc">大弧度 - 热情开朗</option>
              </select>
            </div>
          </div>
        )}

        {/* Feature Summary */}
        {(palm.heart_line !== 'unknown' || palm.head_line !== 'unknown') && (
          <div className="mt-6 p-4 bg-pink-50 rounded-xl border border-pink-100">
            <h4 className="text-sm font-bold text-pink-700 mb-2 flex items-center gap-2">
              <Hand className="w-4 h-4" /> 已捕捉手相特征
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
               <div className="bg-white p-2 rounded">❤️ 感情线: {palm.heart_line}</div>
               <div className="bg-white p-2 rounded">🧠 智慧线: {palm.head_line}</div>
               <div className="bg-white p-2 rounded">🧬 生命线: {palm.life_line}</div>
               <div className="bg-white p-2 rounded">⛰️ 金星丘: {palm.mount_venus}</div>
            </div>
          </div>
        )}
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
          disabled={!isComplete && inputMode === 'manual'} // For upload mode, user might skip if they want, but let's encourage at least one feature
          className={`flex-1 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
            (isComplete || inputMode === 'upload')
              ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white cursor-pointer' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          生成最终报告 &rarr;
        </button>
      </div>
    </div>
  );
}
