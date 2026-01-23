import React, { useState } from 'react';
import { X, User, ArrowRight, Loader2, Lock, UserPlus } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';

export default function SimpleAuthModal() {
  const { isAuthModalOpen, closeAuthModal, login } = useAuthStore();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState('/images/ENFJ.jpg');

  if (!isAuthModalOpen) return null;

  const AVATARS = [
    '/images/ENFJ.jpg', '/images/ENFP.jpg', '/images/ENTJ.jpg', '/images/ENTP.jpg',
    '/images/ESFJ.jpg', '/images/ESFP.jpg', '/images/ESTJ.jpg',
    '/images/INFJ.jpg', '/images/INFP.jpg', '/images/INTJ.jpg', '/images/INTP.jpg',
    '/images/ISFJ.jpg', '/images/ISFP.jpg', '/images/ISTJ.jpg', '/images/ISTP.jpg'
  ];

  const handleSendCode = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('请输入有效的邮箱地址');
      return;
    }
    
    setIsLoading(true);
    const loadingToast = toast.loading('正在发送验证码...');
    
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success('验证码已发送，请留意您的邮箱', { duration: 4000 });
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error(data.error || '发送失败');
      }
    } catch (error) {
      toast.error('网络错误');
    } finally {
      toast.dismiss(loadingToast);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      toast.error('请输入有效的11位手机号码');
      return;
    }
    if (!password) {
      toast.error('请输入密码');
      return;
    }
    if (!isLoginMode) {
      if (!email) {
        toast.error('请输入邮箱');
        return;
      }
      if (!verificationCode) {
        toast.error('请输入验证码');
        return;
      }
    }

    setIsLoading(true);
    
    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
    const body = isLoginMode 
      ? { phone, password }
      : { phone, password, avatar: selectedAvatar, email, code: verificationCode };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      if (res.ok) {
        login(data.user);
        toast.success(isLoginMode ? '登录成功' : '注册成功');
        closeAuthModal();
        setPhone('');
        setPassword('');
        // Reset to login mode for next time
        setTimeout(() => setIsLoginMode(true), 300); 
      } else {
        toast.error(data.error || (isLoginMode ? '登录失败' : '注册失败'));
      }
    } catch (error) {
       toast.error('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setPhone('');
    setPassword('');
    setEmail('');
    setVerificationCode('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-hide">
         <button 
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>
        
        <div className="p-8">
          <div className="text-center mb-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300 ${isLoginMode ? 'bg-pink-100 text-pink-500' : 'bg-purple-100 text-purple-500'} overflow-hidden`}>
              {isLoginMode ? <User size={32} /> : (
                 <img src={selectedAvatar} alt="Avatar" className="w-full h-full object-cover" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 transition-all duration-300">
              {isLoginMode ? '欢迎回来' : '创建账号'}
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              {isLoginMode ? '请输入您的灵犀账号' : '设置您的专属灵犀账号'}
            </p>
          </div>

          {!isLoginMode && (
            <div className="mb-6">
              <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider text-center">选择头像</p>
              <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto p-1">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`relative rounded-full overflow-hidden aspect-square border-2 transition-all ${selectedAvatar === avatar ? 'border-purple-500 scale-110 shadow-md' : 'border-transparent hover:border-gray-200'}`}
                  >
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative flex items-center">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center z-10 w-24">
                   <span className="text-gray-500 font-bold text-sm w-10 text-center">账号</span>
                   <div className="h-6 w-px bg-gray-300 mx-3"></div>
                 </div>
                 <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  placeholder="请输入11位手机号码"
                  className="w-full pl-24 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-bold text-lg placeholder:font-normal placeholder:text-gray-400"
                  autoFocus
                />
              </div>

              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 z-10 w-24">
                  <div className="w-10 flex justify-center">
                    <Lock size={20} strokeWidth={2.5} />
                  </div>
                  <div className="h-6 w-px bg-gray-300 mx-3"></div>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLoginMode ? "请输入密码" : "请设置密码"}
                  className="w-full pl-24 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-bold text-lg placeholder:font-normal placeholder:text-gray-400"
                />
              </div>

              {!isLoginMode && (
                <>
                  <div className="relative flex items-center">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center z-10 w-24">
                      <span className="text-gray-500 font-bold text-sm w-10 text-center">邮箱</span>
                      <div className="h-6 w-px bg-gray-300 mx-3"></div>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="必填，用于找回密码"
                      className="w-full pl-24 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-bold text-lg placeholder:font-normal placeholder:text-gray-400"
                    />
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex items-center flex-1">
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="请输入邮箱验证码"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-bold text-lg placeholder:font-normal placeholder:text-gray-400"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSendCode}
                      disabled={countdown > 0 || isLoading || !email}
                      className="px-4 py-3 bg-pink-100 text-pink-600 rounded-xl font-bold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-200 transition-colors"
                    >
                      {countdown > 0 ? `${countdown}s` : '发送验证码'}
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              type="submit"
              disabled={phone.length !== 11 || !password || isLoading || (!isLoginMode && (!email || !verificationCode))}
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
