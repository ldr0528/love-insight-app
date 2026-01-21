import React, { useState } from 'react';
import { X, User, ArrowRight, Loader2, Lock, UserPlus } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function SimpleAuthModal() {
  const { isAuthModalOpen, closeAuthModal, login } = useAuthStore();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 4) {
      alert('请输入4位数字');
      return;
    }
    if (!password) {
      alert('请输入密码');
      return;
    }

    setIsLoading(true);
    
    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        login(data.user);
        closeAuthModal();
        setCode('');
        setPassword('');
        // Reset to login mode for next time
        setTimeout(() => setIsLoginMode(true), 300); 
      } else {
        alert(data.error || (isLoginMode ? '登录失败' : '注册失败'));
      }
    } catch (error) {
       alert('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setCode('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative">
         <button 
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>
        
        <div className="p-8">
          <div className="text-center mb-8">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300 ${isLoginMode ? 'bg-pink-100 text-pink-500' : 'bg-purple-100 text-purple-500'}`}>
              {isLoginMode ? <User size={32} /> : <UserPlus size={32} />}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 transition-all duration-300">
              {isLoginMode ? '欢迎回来' : '创建账号'}
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              {isLoginMode ? '请输入您的灵犀账号' : '设置您的专属灵犀账号'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
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

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLoginMode ? "请输入密码" : "请设置密码"}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={code.length !== 4 || !password || isLoading}
              className={`w-full py-3 px-4 text-white rounded-xl font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                isLoginMode 
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-500/30 hover:shadow-pink-500/40' 
                  : 'bg-gradient-to-r from-purple-500 to-indigo-500 shadow-purple-500/30 hover:shadow-purple-500/40'
              }`}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : (isLoginMode ? '登录' : '立即注册')}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={toggleMode}
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium"
            >
              {isLoginMode ? '还没有账号？' : '已有账号？'} 
              <span className={`underline ml-1 ${isLoginMode ? 'text-pink-500' : 'text-purple-500'}`}>
                {isLoginMode ? '去注册' : '去登录'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
