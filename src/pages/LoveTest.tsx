
import { useReportStore } from '@/store/useReportStore';
import BasicInfoStep from '@/components/test-steps/BasicInfoStep';
import MBTIStep from '@/components/test-steps/MBTIStep';
import PalmStep from '@/components/test-steps/PalmStep';
import ReportGenerationStep from '@/components/test-steps/ReportGenerationStep';
import FortuneTypeSelectionStep from '@/components/test-steps/FortuneTypeSelectionStep';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LoveTest() {
  const { currentStep, totalSteps, prevStep } = useReportStore();

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <FortuneTypeSelectionStep />;
      case 1: return <BasicInfoStep />;
      case 2: return <ReportGenerationStep />;
      default: return <FortuneTypeSelectionStep />;
    }
  };

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center">
      {/* Top Bar */}
      <div className="w-full max-w-xl mx-auto p-6 flex items-center justify-between sticky top-0 z-10 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-2">
            {currentStep > 0 ? (
                <button onClick={prevStep} className="text-gray-600 hover:text-indigo-600">
                    <ArrowLeft className="w-6 h-6" />
                </button>
            ) : (
                <Link to="/" className="text-gray-600 hover:text-indigo-600">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
            )}
            <div className="flex items-center gap-2 font-bold text-indigo-800 text-lg ml-2">
                <Sparkles className="fill-current text-indigo-500" /> 运报客栈
            </div>
        </div>
        
        <div className="text-xs font-medium text-gray-400">
          Step {currentStep + 1} / {totalSteps}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xl px-6 mb-8 mt-4">
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-xl px-6 pb-20 flex-1 flex flex-col">
        {renderStep()}
      </div>
    </div>
  );
}
