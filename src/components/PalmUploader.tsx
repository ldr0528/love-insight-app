
import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, CheckCircle2 } from 'lucide-react';

interface PalmFeatures {
  heart_line: string;
  head_line: string;
  life_line: string;
  mount_venus: string;
}

interface PalmUploaderProps {
  onAnalysisComplete: (features: PalmFeatures) => void;
}

export default function PalmUploader({ onAnalysisComplete }: PalmUploaderProps) {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        analyzeImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64Image: string) => {
    setAnalyzing(true);
    setError('');
    try {
      // Use relative path for production compatibility
      const response = await fetch('/api/analyze/palm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      if (data.success && data.features) {
        onAnalysisComplete(data.features);
      } else {
        throw new Error('Could not identify palm features');
      }
    } catch (err: any) {
      console.error(err);
      setError('无法识别图片，请确保上传清晰的手掌照片');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-pink-200 rounded-xl p-6 text-center hover:border-pink-400 transition-colors bg-pink-50/50">
      <input 
        type="file" 
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer space-y-3"
        >
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto text-pink-500">
            <Camera className="w-8 h-8" />
          </div>
          <div>
            <p className="font-bold text-gray-700">上传手相照片</p>
            <p className="text-xs text-gray-500">支持 JPG/PNG，AI 自动分析掌纹</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative w-full h-48 bg-gray-900 rounded-lg overflow-hidden mx-auto">
            <img src={image} alt="Palm" className="w-full h-full object-contain opacity-80" />
            {analyzing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/40 backdrop-blur-sm">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <span className="text-sm font-medium">正在读取命运轨迹...</span>
              </div>
            )}
            {!analyzing && !error && (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-green-500/20 backdrop-blur-sm">
                <CheckCircle2 className="w-10 h-10 mb-2 text-green-400 drop-shadow-lg" />
                <span className="text-sm font-bold drop-shadow-md">分析完成</span>
              </div>
            )}
          </div>
          
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
              {error}
              <button 
                onClick={() => setImage(null)}
                className="text-red-700 underline ml-2"
              >
                重试
              </button>
            </div>
          )}

          {!analyzing && !error && (
             <button 
             onClick={() => setImage(null)}
             className="text-xs text-gray-500 underline"
           >
             重新上传
           </button>
          )}
        </div>
      )}
    </div>
  );
}
