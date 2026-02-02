
import { useState, useEffect, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles, Store, Mic, MicOff, Check } from 'lucide-react';
import ThreePet from '@/components/ThreePet';
import { useAuthStore, PetType } from '@/store/useAuthStore';
import toast from 'react-hot-toast';

// Memoize Pet Buttons to prevent unnecessary re-renders and image flickering
const PetOptionButton = memo(({ type, selectedType, onSelect, imgSrc, label, colorClass, borderColorClass, iconColorClass }: any) => (
  <button
    onClick={() => onSelect(type)}
    className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
      selectedType === type 
        ? `${colorClass} ${borderColorClass} shadow-md transform scale-105` 
        : `bg-white border-gray-200 hover:${borderColorClass.replace('border-', 'hover:border-')}`
    }`}
  >
    {selectedType === type && <div className={`absolute top-2 right-2 ${iconColorClass} text-white p-1 rounded-full`}><Check size={12} /></div>}
    <img 
      src={imgSrc} 
      alt={label} 
      className="w-16 h-16 object-contain" 
    />
    <span className="font-bold text-gray-800">{label}</span>
  </button>
));

export default function DigitalPetShop() {
  const { user, token, login } = useAuthStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ reply: string; quote: { content: string; source: string } } | null>(null);
  const [displayedReply, setDisplayedReply] = useState('');
  const [showQuote, setShowQuote] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Pet Selection State
  const [selectedPetType, setSelectedPetType] = useState<PetType | null>(null);
  const [petName, setPetName] = useState('');
  const [isSubmittingPet, setIsSubmittingPet] = useState(false);

  const replyContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const hasPet = !!user?.petType;

  // 恢复全量预加载：用户反馈之前这种方式体验更好
  useEffect(() => {
    const images = [
      '/images/pets/cat.png',
      '/images/pets/dog.png',
      '/images/pets/chicken.png',
      '/images/pets/rabbit.png',
      '/images/pets/hamster.png',
      '/images/pets/fox.png'
    ];
    
    // 使用 Promise.all 并行加载，但非阻塞
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Function to reset pet choice (for testing/user request)
  const handleResetPet = async () => {
    if (!user || !token) return;

    // Optimistically update local state
    const updatedUser = { ...user, petType: null, petName: null };
    // @ts-ignore - Allowing nulls for reset
    login(updatedUser, token);

    // Also update backend to persist the reset
    try {
      await fetch('/api/auth/pet', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ petType: null, petName: null })
      });
    } catch (e) {
      console.error("Failed to reset pet on server", e);
    }
  };

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'zh-CN';

      recognitionRef.current.onresult = (event: any) => {
        let newContent = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            newContent += event.results[i][0].transcript;
          }
        }
        if (newContent) {
          setInput(prev => prev + newContent);
        }
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }
  }, []);

  const handleAdoptPet = async () => {
    if (!user || !token) {
       toast.error('请先登录');
       return;
    }
    if (!selectedPetType) {
      toast.error('请选择一只宠物');
      return;
    }
    if (!petName.trim()) {
      toast.error('请给宠物起个名字');
      return;
    }

    setIsSubmittingPet(true);
    try {
      const res = await fetch('/api/auth/pet', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ petType: selectedPetType, petName: petName })
      });
      const data = await res.json();
      
      if (data.success) {
        login(data.user, token); // Update local user store
        toast.success('领养成功！');
      } else {
        toast.error(data.error || '领养失败');
      }
    } catch (e) {
      toast.error('网络错误');
    } finally {
      setIsSubmittingPet(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error('您的浏览器不支持语音输入功能');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;
    
    setLoading(true);
    setResponse(null);
    setDisplayedReply('');
    setShowQuote(false);

    try {
      const res = await fetch('/api/worry/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input, petType: user?.petType, petName: user?.petName }),
      });
      
      const data = await res.json();
      if (data.success) {
        setResponse(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Typewriter effect
  useEffect(() => {
    if (response?.reply) {
      let i = 0;
      const timer = setInterval(() => {
        setDisplayedReply(response.reply.slice(0, i + 1));
        i++;
        if (i === response.reply.length) {
          clearInterval(timer);
          setTimeout(() => setShowQuote(true), 800); // Show quote after a delay
        }
      }, 50);
      return () => clearInterval(timer);
    }
  }, [response]);

  // Scroll to bottom
  useEffect(() => {
    if (replyContainerRef.current) {
      replyContainerRef.current.scrollTop = replyContainerRef.current.scrollHeight;
    }
  }, [displayedReply, showQuote]);

  const renderPet = (message: React.ReactNode) => {
    switch (user?.petType) {
      case 'dog':
        return <ThreePet imageSrc="/images/pets/dog.png" altText="Dog" message={message} />;
      case 'chicken':
        return <ThreePet imageSrc="/images/pets/chicken.png" altText="Chicken" message={message} />;
      case 'rabbit':
        return <ThreePet imageSrc="/images/pets/rabbit.png" altText="Rabbit" message={message} />;
      case 'hamster':
        return <ThreePet imageSrc="/images/pets/hamster.png" altText="Hamster" message={message} />;
      case 'fox':
        return <ThreePet imageSrc="/images/pets/fox.png" altText="Fox" message={message} />;
      case 'cat':
      default:
        return <ThreePet imageSrc="/images/pets/cat.png" altText="Cat" message={message} />;
    }
  };

  if (!hasPet) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50 flex flex-col font-sans">
        <header className="p-4 flex items-center sticky top-0 bg-white/30 backdrop-blur-md z-10">
          <Link to="/" className="p-2 rounded-full hover:bg-orange-100 transition-colors text-amber-800">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="ml-2 font-bold text-xl text-amber-900 flex items-center gap-2">
            <Store className="w-5 h-5" /> 电子宠物店
          </h1>
        </header>

        <main className="flex-1 max-w-2xl w-full mx-auto p-6 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">欢迎来到电子宠物店</h2>
            <p className="text-gray-600">请挑选一只属于你的专属宠物。</p>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full mb-8">
            <PetOptionButton 
              type="cat" selectedType={selectedPetType} onSelect={setSelectedPetType}
              imgSrc="/images/pets/cat.png" label="小猫"
              colorClass="bg-orange-100" borderColorClass="border-orange-500" iconColorClass="bg-orange-500"
            />
            <PetOptionButton 
              type="dog" selectedType={selectedPetType} onSelect={setSelectedPetType}
              imgSrc="/images/pets/dog.png" label="小狗"
              colorClass="bg-amber-100" borderColorClass="border-amber-500" iconColorClass="bg-amber-500"
            />
            <PetOptionButton 
              type="chicken" selectedType={selectedPetType} onSelect={setSelectedPetType}
              imgSrc="/images/pets/chicken.png" label="小鸡"
              colorClass="bg-yellow-100" borderColorClass="border-yellow-500" iconColorClass="bg-yellow-500"
            />
            <PetOptionButton 
              type="rabbit" selectedType={selectedPetType} onSelect={setSelectedPetType}
              imgSrc="/images/pets/rabbit.png" label="小兔"
              colorClass="bg-pink-100" borderColorClass="border-pink-500" iconColorClass="bg-pink-500"
            />
            <PetOptionButton 
              type="hamster" selectedType={selectedPetType} onSelect={setSelectedPetType}
              imgSrc="/images/pets/hamster.png" label="仓鼠"
              colorClass="bg-blue-100" borderColorClass="border-blue-500" iconColorClass="bg-blue-500"
            />
            <PetOptionButton 
              type="fox" selectedType={selectedPetType} onSelect={setSelectedPetType}
              imgSrc="/images/pets/fox.png" label="狐狸"
              colorClass="bg-orange-100" borderColorClass="border-orange-600" iconColorClass="bg-orange-600"
            />
          </div>

          <div className="w-full space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">给它起个名字</label>
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="例如：旺财、咪咪..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              onClick={handleAdoptPet}
              disabled={!selectedPetType || !petName.trim() || isSubmittingPet}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isSubmittingPet ? '领养中...' : '确认领养'}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50 flex flex-col font-sans">
      {/* Header */}
      <header className="p-4 flex items-center sticky top-0 bg-white/30 backdrop-blur-md z-10">
        <Link to="/" className="p-2 rounded-full hover:bg-orange-100 transition-colors text-amber-800">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="ml-2 font-bold text-xl text-amber-900 flex items-center gap-2">
          <Store className="w-5 h-5" /> 电子宠物店
        </h1>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto p-4 flex flex-col relative">
        {/* Pet Area */}
        <div className="flex flex-col items-center mb-2 mt-4 animate-in fade-in slide-in-from-top-8 duration-700 w-full z-10">
          <div className="relative w-full max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-center group">
            {/* Re-select Pet Button (Hidden by default, shown on hover) */}
            <button 
              onClick={handleResetPet}
              className="absolute top-0 right-0 md:right-10 z-50 bg-white/80 hover:bg-white text-gray-500 hover:text-orange-500 p-2 rounded-full shadow-sm backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
              title="重新选择宠物"
            >
              <Sparkles size={16} />
            </button>

            {/* Pet Model - Bubble is now handled inside the 3D component */}
            <div className="w-full md:w-[500px] flex-shrink-0">
              {renderPet(loading 
                ? "嗯... 正在思考... 🤔" 
                : response 
                  ? "我已经听到了你的心声... 👂✨"
                  : `Hi，我是${user?.petName || '旺财'}，有什么心事都可以告诉我哦！🐾`
              )}
            </div>
          </div>
        </div>

        {/* Interaction Area - Conditional Flex Grow */}
        <div className={`flex flex-col gap-6 transition-all duration-500 ${response ? 'flex-1 pb-32' : 'flex-none'}`} ref={replyContainerRef}>
          {/* Result Display */}
          {response && (
            <div className="space-y-6 pb-20">
              {/* Pet's Reply */}
              <div className="bg-white/50 p-6 rounded-3xl border border-orange-50 shadow-sm">
                <p className="text-gray-700 leading-7 whitespace-pre-wrap">
                  {displayedReply}
                  {displayedReply.length < response.reply.length && <span className="animate-pulse">|</span>}
                </p>
              </div>

              {/* Quote Card */}
              {showQuote && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  <div className="bg-[#fffdf5] p-8 md:p-12 rounded-xl shadow-2xl border border-orange-100 relative overflow-hidden mx-4 transform rotate-1 hover:rotate-0 transition-transform duration-700">
                    {/* Paper Texture Overlay */}
                    <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')] mix-blend-multiply"></div>
                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,transparent_49%,rgba(251,146,60,0.1)_50%,transparent_51%)] bg-[length:100%_2rem]"></div>
                    
                    {/* Letter Header Line */}
                    <div className="w-full h-px bg-orange-200 mb-8 relative z-10"></div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center">
                      
                      <div className="relative mb-8 pt-4">
                         <span className="absolute -top-4 -left-4 text-5xl text-orange-200 font-serif opacity-40">“</span>
                         <p className="text-xl md:text-2xl font-serif text-gray-800 leading-relaxed tracking-wide px-4" style={{ fontFamily: '"KaiTi", "STKaiti", serif' }}>
                           {response.quote.content}
                         </p>
                         <span className="absolute -bottom-8 -right-4 text-5xl text-orange-200 font-serif opacity-40">”</span>
                      </div>

                      <div className="w-12 h-px bg-orange-300 mb-4 mt-4"></div>
                      
                      <p className="text-base md:text-lg text-gray-600 font-serif italic" style={{ fontFamily: '"KaiTi", "STKaiti", serif' }}>
                        —— {response.quote.source}
                      </p>
                    </div>
                    
                    {/* Stamp */}
                    <div className="absolute bottom-6 right-6 opacity-80 transform -rotate-[15deg] mix-blend-multiply">
                      <div className="w-20 h-20 border-[3px] border-red-800/70 rounded-full flex items-center justify-center shadow-sm backdrop-blur-[1px]">
                        <div className="w-[70px] h-[70px] border border-red-800/50 rounded-full flex items-center justify-center">
                           <div className="flex flex-col items-center leading-none">
                              <span className="text-red-900 font-serif font-black text-lg tracking-widest writing-vertical-rl">灵犀</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area (Fixed Bottom or Relative) */}
        {!response && !loading && (
          <div className="sticky bottom-0 bg-gradient-to-t from-pink-50 to-transparent pt-4 pb-8 animate-in slide-in-from-bottom-full duration-500 z-20">
            <div className="relative shadow-2xl rounded-2xl overflow-hidden bg-white/90 backdrop-blur border border-orange-100 focus-within:ring-2 focus-within:ring-orange-200 transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`和${user?.petName || '它'}说说你的烦恼...`}
                className="w-full p-4 pr-24 min-h-[80px] resize-none outline-none text-lg text-gray-800 bg-transparent placeholder:text-gray-400 placeholder:font-medium"
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button
                  onClick={toggleListening}
                  className={`p-2.5 rounded-xl transition-all shadow-lg hover:scale-105 active:scale-95 ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                  }`}
                  title="语音输入"
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!input.trim()}
                  className="p-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:scale-105 active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Reset Button (When finished) */}
        {showQuote && (
          <div className="sticky bottom-0 bg-gradient-to-t from-pink-50 to-transparent pt-4 pb-8 flex justify-center animate-in fade-in duration-500">
            <button
              onClick={() => {
                setResponse(null);
                setInput('');
                setDisplayedReply('');
                setShowQuote(false);
              }}
              className="px-8 py-3 bg-white border border-orange-200 text-orange-600 rounded-full font-medium shadow-md hover:bg-orange-50 transition-all"
            >
              还有其他烦恼吗？
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
