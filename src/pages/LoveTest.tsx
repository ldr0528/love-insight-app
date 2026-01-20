
import { useReportStore } from '@/store/useReportStore';
import BasicInfoStep from '@/components/test-steps/BasicInfoStep';
import MBTIStep from '@/components/test-steps/MBTIStep';
import PalmStep from '@/components/test-steps/PalmStep';
import ReportGenerationStep from '@/components/test-steps/ReportGenerationStep';
import { Heart } from 'lucide-react';

export default function LoveTest() {
  const { currentStep, totalSteps } = useReportStore();

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <BasicInfoStep />;
      // case 1 & 2 (MBTI & Palm) are skipped in this new flow
      case 1: return <ReportGenerationStep />;
      default: return <BasicInfoStep />;
    }
  };

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex flex-col items-center">
      {/* Top Bar */}
      <div className="w-full max-w-xl mx-auto p-6 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-pink-600 text-lg">
          <Heart className="fill-current" /> LoveInsight
        </div>
        <div className="text-xs font-medium text-gray-400">
          Step {currentStep + 1} / {totalSteps}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xl px-6 mb-8">
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500 ease-out"
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
