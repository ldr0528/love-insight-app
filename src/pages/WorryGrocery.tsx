
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles, Store, Mic, MicOff, Check } from 'lucide-react';
import ThreeCat from '@/components/ThreeCat';
import ThreeDog from '@/components/ThreeDog';
import ThreeChicken from '@/components/ThreeChicken';
import ThreePet from '@/components/ThreePet';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';

export default function DigitalPetShop() {
  const { user, login } = useAuthStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ reply: string; quote: { content: string; source: string } } | null>(null);
  const [displayedReply, setDisplayedReply] = useState('');
  const [showQuote, setShowQuote] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Pet Selection State
  const [selectedPetType, setSelectedPetType] = useState<'cat' | 'dog' | 'chicken' | 'rabbit' | 'panda' | 'hamster' | 'koala' | null>(null);
  const [petName, setPetName] = useState('');
  const [isSubmittingPet, setIsSubmittingPet] = useState(false);

  const replyContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const hasPet = !!user?.petType;

  // Function to reset pet choice (for testing/user request)
  const handleResetPet = () => {
    // In a real app, this might need an API call to reset the user's pet in the DB
    // For now, we just clear the local state to show the selection screen again
    // To make it persistent, we should add an API endpoint or update the existing one.
    // Let's assume we just want to allow re-selection in the UI for now.
    // Ideally, we should update the user object in the store to clear petType.
    
    // We can "hack" it by updating the local user object via login() with null values,
    // but the backend should support clearing it.
    // For this task "User can re-select pet", I will add a button to clear the current pet state.
    const updatedUser = { ...user!, petType: null, petName: null };
    // @ts-ignore - Allowing nulls for reset
    login(updatedUser);
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
      // Assuming mock-token-PHONE format for demo
      const token = `mock-token-${user?.username}`; 
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
        login(data.user); // Update local user store
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
        return <ThreeDog message={message} />;
      case 'chicken':
        return <ThreeChicken message={message} />;
      case 'rabbit':
        return <ThreePet imageSrc="/images/pets/rabbit.png" altText="Rabbit" message={message} />;
      case 'panda':
        return <ThreePet imageSrc="/images/pets/panda.png" altText="Panda" message={message} />;
      case 'hamster':
        return <ThreePet imageSrc="/images/pets/hamster.png" altText="Hamster" message={message} />;
      case 'koala':
        return <ThreePet imageSrc="/images/pets/koala.png" altText="Koala" message={message} />;
      case 'cat':
      default:
        return <ThreeCat message={message} />;
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
            <p className="text-gray-600">请挑选一只属于你的专属宠物，它将永远陪伴你。</p>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full mb-8">
            {/* Cat Option */}
            <button
              onClick={() => setSelectedPetType('cat')}
              className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                selectedPetType === 'cat' 
                  ? 'bg-orange-100 border-orange-500 shadow-md transform scale-105' 
                  : 'bg-white border-gray-200 hover:border-orange-200'
              }`}
            >
              {selectedPetType === 'cat' && <div className="absolute top-2 right-2 bg-orange-500 text-white p-1 rounded-full"><Check size={12} /></div>}
              <img src="/images/pets/cat.png" alt="Cat" className="w-16 h-16 object-contain" />
              <span className="font-bold text-gray-800">小猫</span>
            </button>

            {/* Dog Option */}
            <button
              onClick={() => setSelectedPetType('dog')}
              className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                selectedPetType === 'dog' 
                  ? 'bg-amber-100 border-amber-500 shadow-md transform scale-105' 
                  : 'bg-white border-gray-200 hover:border-amber-200'
              }`}
            >
              {selectedPetType === 'dog' && <div className="absolute top-2 right-2 bg-amber-500 text-white p-1 rounded-full"><Check size={12} /></div>}
              <img src="/images/pets/dog.png" alt="Dog" className="w-16 h-16 object-contain" />
              <span className="font-bold text-gray-800">小狗</span>
            </button>

            {/* Chicken Option */}
            <button
              onClick={() => setSelectedPetType('chicken')}
              className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                selectedPetType === 'chicken' 
                  ? 'bg-yellow-100 border-yellow-500 shadow-md transform scale-105' 
                  : 'bg-white border-gray-200 hover:border-yellow-200'
              }`}
            >
              {selectedPetType === 'chicken' && <div className="absolute top-2 right-2 bg-yellow-500 text-white p-1 rounded-full"><Check size={12} /></div>}
              <img src="/images/pets/chicken.png" alt="Chicken" className="w-16 h-16 object-contain" />
              <span className="font-bold text-gray-800">小鸡</span>
            </button>

            {/* Rabbit Option */}
            <button
              onClick={() => setSelectedPetType('rabbit')}
              className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                selectedPetType === 'rabbit' 
                  ? 'bg-pink-100 border-pink-500 shadow-md transform scale-105' 
                  : 'bg-white border-gray-200 hover:border-pink-200'
              }`}
            >
              {selectedPetType === 'rabbit' && <div className="absolute top-2 right-2 bg-pink-500 text-white p-1 rounded-full"><Check size={12} /></div>}
              <img src="/images/pets/rabbit.png" alt="Rabbit" className="w-16 h-16 object-contain" />
              <span className="font-bold text-gray-800">小兔</span>
            </button>

            {/* Panda Option */}
            <button
              onClick={() => setSelectedPetType('panda')}
              className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                selectedPetType === 'panda' 
                  ? 'bg-green-100 border-green-500 shadow-md transform scale-105' 
                  : 'bg-white border-gray-200 hover:border-green-200'
              }`}
            >
              {selectedPetType === 'panda' && <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full"><Check size={12} /></div>}
              <img src="/images/pets/panda.png" alt="Panda" className="w-16 h-16 object-contain" />
              <span className="font-bold text-gray-800">熊猫</span>
            </button>

            {/* Hamster Option */}
            <button
              onClick={() => setSelectedPetType('hamster')}
              className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                selectedPetType === 'hamster' 
                  ? 'bg-blue-100 border-blue-500 shadow-md transform scale-105' 
                  : 'bg-white border-gray-200 hover:border-blue-200'
              }`}
            >
              {selectedPetType === 'hamster' && <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full"><Check size={12} /></div>}
              <img src="/images/pets/hamster.png" alt="Hamster" className="w-16 h-16 object-contain" />
              <span className="font-bold text-gray-800">仓鼠</span>
            </button>

             {/* Koala Option */}
             <button
              onClick={() => setSelectedPetType('koala')}
              className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                selectedPetType === 'koala' 
                  ? 'bg-gray-100 border-gray-500 shadow-md transform scale-105' 
                  : 'bg-white border-gray-200 hover:border-gray-200'
              }`}
            >
              {selectedPetType === 'koala' && <div className="absolute top-2 right-2 bg-gray-500 text-white p-1 rounded-full"><Check size={12} /></div>}
              <img src="/images/pets/koala.png" alt="Koala" className="w-16 h-16 object-contain" />
              <span className="font-bold text-gray-800">考拉</span>
            </button>
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
            <p className="text-xs text-gray-400 text-center mt-2">
              * 领养后无法更换宠物种类，请慎重选择
            </p>
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
                ? "嗯... 正在思考..." 
                : response 
                  ? "我已经听到了你的心声..."
                  : `Hi，我是${user?.petName || '旺财'}，有什么心事都可以告诉我哦！`
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
