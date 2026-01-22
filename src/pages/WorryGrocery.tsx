
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles, Cat, Store } from 'lucide-react';

export default function WorryGrocery() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ reply: string; quote: { content: string; source: string } } | null>(null);
  const [displayedReply, setDisplayedReply] = useState('');
  const [showQuote, setShowQuote] = useState(false);
  
  const replyContainerRef = useRef<HTMLDivElement>(null);

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
    <div className="min-h-screen bg-[#fdf6e3] flex flex-col font-sans">
      {/* Header */}
      <header className="p-4 flex items-center sticky top-0 bg-[#fdf6e3]/80 backdrop-blur-sm z-10">
        <Link to="/" className="p-2 rounded-full hover:bg-orange-100 transition-colors text-amber-800">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="ml-2 font-bold text-xl text-amber-900 flex items-center gap-2">
          <Store className="w-5 h-5" /> 解忧杂货铺
        </h1>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto p-4 flex flex-col">
        {/* Cat Area */}
        <div className="flex flex-col items-center mb-8 mt-4 animate-in fade-in slide-in-from-top-8 duration-700">
          {/* CSS Art Cat */}
          <div className="relative w-40 h-40 mb-2 transform hover:scale-105 transition-transform duration-500">
            {/* Tail */}
            <div className="absolute bottom-4 right-4 w-12 h-12 border-[6px] border-white rounded-full border-t-0 border-l-0 rotate-[-10deg] shadow-sm"></div>
            
            {/* Body */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-28 h-24 bg-white rounded-[50px] shadow-lg z-10"></div>
            
            {/* Head */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-24 h-20 bg-white rounded-[45px] shadow-md z-20">
              {/* Ears */}
              <div className="absolute -top-3 left-1 w-8 h-8 bg-white rounded-tr-xl transform -rotate-12 border-l border-gray-50"></div>
              <div className="absolute -top-3 right-1 w-8 h-8 bg-white rounded-tl-xl transform rotate-12 border-r border-gray-50"></div>
              {/* Inner Ears */}
              <div className="absolute -top-1 left-2.5 w-5 h-5 bg-pink-200 rounded-tr-lg transform -rotate-12"></div>
              <div className="absolute -top-1 right-2.5 w-5 h-5 bg-pink-200 rounded-tl-lg transform rotate-12"></div>
              
              {/* Face */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center w-full">
                {/* Eyes */}
                <div className="flex gap-8 mb-1.5">
                  <div className="relative w-3 h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white rounded-full opacity-80"></div>
                  </div>
                  <div className="relative w-3 h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white rounded-full opacity-80"></div>
                  </div>
                </div>
                {/* Nose */}
                <div className="w-1.5 h-1 bg-pink-300 rounded-full mb-0.5"></div>
                {/* Mouth */}
                <div className="flex gap-0.5">
                   <div className="w-2 h-1 border-b-[1.5px] border-gray-400 rounded-full"></div>
                   <div className="w-2 h-1 border-b-[1.5px] border-gray-400 rounded-full"></div>
                </div>
                {/* Blush */}
                <div className="absolute top-2 left-2 w-4 h-2 bg-pink-100 rounded-full opacity-60 blur-[1px]"></div>
                <div className="absolute top-2 right-2 w-4 h-2 bg-pink-100 rounded-full opacity-60 blur-[1px]"></div>
              </div>
            </div>
            
            {/* Paws */}
            <div className="absolute bottom-0 left-10 w-5 h-4 bg-white rounded-full shadow-sm z-30 border-b-2 border-gray-100"></div>
            <div className="absolute bottom-0 right-10 w-5 h-4 bg-white rounded-full shadow-sm z-30 border-b-2 border-gray-100"></div>

            {/* Bow Tie */}
            <div className="absolute top-[88px] left-1/2 transform -translate-x-1/2 z-30 flex items-center drop-shadow-sm">
               <div className="w-3 h-3 bg-pink-400 rounded-full z-10 relative"></div>
               <div className="absolute right-1 w-5 h-4 bg-pink-400 rounded-r-lg skew-y-12"></div>
               <div className="absolute left-1 w-5 h-4 bg-pink-400 rounded-l-lg -skew-y-12"></div>
            </div>
            
            {/* Sparkles */}
            <div className="absolute -top-4 -right-4 text-yellow-300 animate-pulse">
              <Sparkles className="w-6 h-6 fill-current" />
            </div>
          </div>
          
          {/* Chat Bubble - Positioned near mouth */}
          <div className="bg-white px-5 py-3 rounded-2xl shadow-md border border-orange-100 max-w-[260px] relative animate-in zoom-in duration-500 delay-300 -mt-2 z-40">
            <p className="text-amber-900/90 text-xs font-medium leading-relaxed text-center">
              {loading 
                ? "喵... 正在用心聆听..." 
                : response 
                  ? "我已经听到了你的心声..."
                  : "小乖，愿意将今天的心事分享给我吗？这里只有我们两个。"}
            </p>
            {/* Bubble Tail pointing up to cat */}
            <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-orange-100 rotate-45"></div>
          </div>
        </div>

        {/* Interaction Area */}
        <div className="flex-1 flex flex-col gap-6" ref={replyContainerRef}>
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

        {/* Input Area (Fixed Bottom) */}
        {!response && !loading && (
          <div className="sticky bottom-0 bg-[#fdf6e3] pt-4 pb-8 animate-in slide-in-from-bottom-full duration-500">
            <div className="relative shadow-xl rounded-2xl overflow-hidden bg-white border border-orange-100 focus-within:ring-2 focus-within:ring-orange-200 transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="在这里写下你的烦恼..."
                className="w-full p-4 pr-14 min-h-[120px] resize-none outline-none text-gray-700 bg-transparent placeholder:text-gray-300"
              />
              <button
                onClick={handleSubmit}
                disabled={!input.trim()}
                className="absolute bottom-3 right-3 p-2 bg-orange-400 text-white rounded-xl hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:scale-105 active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
        
        {/* Reset Button (When finished) */}
        {showQuote && (
          <div className="sticky bottom-0 bg-[#fdf6e3] pt-4 pb-8 flex justify-center animate-in fade-in duration-500">
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
