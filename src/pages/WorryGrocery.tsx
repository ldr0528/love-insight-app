
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles, Store, Mic, MicOff } from 'lucide-react';
import ThreeCat from '@/components/ThreeCat';

export default function WorryGrocery() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ reply: string; quote: { content: string; source: string } } | null>(null);
  const [displayedReply, setDisplayedReply] = useState('');
  const [showQuote, setShowQuote] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const replyContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

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

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('您的浏览器不支持语音输入功能');
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
        body: JSON.stringify({ content: input }),
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50 flex flex-col font-sans">
      {/* Header */}
      <header className="p-4 flex items-center sticky top-0 bg-white/30 backdrop-blur-md z-10">
        <Link to="/" className="p-2 rounded-full hover:bg-orange-100 transition-colors text-amber-800">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="ml-2 font-bold text-xl text-amber-900 flex items-center gap-2">
          <Store className="w-5 h-5" /> 解忧杂货铺
        </h1>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto p-4 flex flex-col relative">
        {/* Cat Area */}
        <div className="flex flex-col items-center mb-2 mt-4 animate-in fade-in slide-in-from-top-8 duration-700 w-full z-10">
          <ThreeCat 
            message={loading 
              ? "喵... 正在用心聆听..." 
              : response 
                ? "我已经听到了你的心声..."
                : "小乖，愿意将今天的心事分享给我吗？这里只有我们两个。"}
          />
        </div>

        {/* Interaction Area - Conditional Flex Grow */}
        <div className={`flex flex-col gap-6 transition-all duration-500 ${response ? 'flex-1 pb-32' : 'flex-none'}`} ref={replyContainerRef}>
          {/* Result Display */}
          {response && (
            <div className="space-y-6 pb-20">
              {/* Cat's Reply */}
              <div className="bg-white/50 p-6 rounded-3xl border border-orange-50 shadow-sm">
                <p className="text-gray-700 leading-7 whitespace-pre-wrap">
                  {displayedReply}
                  {displayedReply.length < response.reply.length && <span className="animate-pulse">|</span>}
                </p>
              </div>

              {/* Quote Card */}
              {showQuote && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  <div className="bg-[#fffdf5] p-8 rounded-xl shadow-xl border-2 border-orange-100 relative overflow-hidden mx-4 transform rotate-1 hover:rotate-0 transition-transform">
                    {/* Paper Texture Overlay */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <Sparkles className="w-6 h-6 text-orange-300 mb-4" />
                      <p className="text-lg md:text-xl font-serif text-gray-800 leading-relaxed italic mb-6">
                        “{response.quote.content}”
                      </p>
                      <div className="w-12 h-px bg-orange-200 mb-2"></div>
                      <p className="text-sm text-gray-500 font-medium">
                        —— {response.quote.source}
                      </p>
                    </div>
                    
                    {/* Stamp */}
                    <div className="absolute bottom-[-10px] right-[-10px] opacity-20 transform rotate-[-15deg]">
                      <div className="w-24 h-24 border-4 border-red-800 rounded-full flex items-center justify-center">
                        <span className="text-red-800 font-serif font-bold">解忧</span>
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
                placeholder="在这里写下你的烦恼..."
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
