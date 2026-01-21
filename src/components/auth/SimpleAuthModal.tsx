import React, { useState } from 'react';
import { X, User, ArrowRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function SimpleAuthModal() {
  const { isAuthModalOpen, closeAuthModal, login } = useAuthStore();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 4) {
      alert('请输入4位数字');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      
      if (res.ok) {
        login(data.user);
        closeAuthModal();
        setCode('');
      } else {
        alert(data.error || '登录失败');
      }
    } catch (error) {
       // Fallback if backend is not ready
       const username = `Lin${code}`;
       login({
         id: code,
         username,
         nickname: username
       });
       closeAuthModal();
       setCode('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative">
         <button 
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-500">
              <User size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">创建/登录账号</h2>
            <p className="text-gray-500 text-sm mt-2">请输入4位数字，我们将为您生成专属账号</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                 <span className="text-gray-500 font-bold text-xl">Lin</span>
               </div>
               <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="0000"
                className="w-full pl-16 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-bold text-xl tracking-widest"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={code.length !== 4 || isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold shadow-lg shadow-pink-500/30 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : '进入灵犀空间'}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
