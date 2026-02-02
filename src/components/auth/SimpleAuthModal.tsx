import React, { useState } from 'react';
import { X, User, ArrowRight, Loader2, Lock, UserPlus } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import request from '@/utils/request';

export default function SimpleAuthModal() {
  const { isAuthModalOpen, closeAuthModal, login } = useAuthStore();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      const data = await request<{ success: boolean; error?: string }>('/api/auth/send-code', {
        method: 'POST',
        data: {
          email,
          type: isForgotPasswordMode ? 'reset' : 'register',
          phone: isForgotPasswordMode ? phone : undefined
        }
      });

      if (!data.success) {
        throw new Error(data.error || '发送失败');
      }
      
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
    } catch (error: any) {
      toast.error(error.message || '发送失败，请稍后重试');
    } finally {
      toast.dismiss(loadingToast);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Forgot Password Logic
    if (isForgotPasswordMode) {
      if (!email) { toast.error('请输入邮箱'); return; }
      if (!verificationCode) { toast.error('请输入验证码'); return; }
      if (!password) { toast.error('请设置新密码'); return; }

      setIsLoading(true);
      try {
        const data = await request<{ success: boolean; message?: string; error?: string }>('/api/auth/reset-password', {
          method: 'POST',
          data: { email, code: verificationCode, newPassword: password }
        });
        
        if (!data.success) {
           throw new Error(data.message || data.error || '重置失败');
        }
        
        toast.success('密码重置成功，请登录');
        setIsForgotPasswordMode(false);
        setIsLoginMode(true);
        setPassword('');
        setVerificationCode('');
        setEmail('');
      } catch (error: any) {
        toast.error(error.message || '重置失败');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      toast.error('请输入有效的11位手机号码');
      return;
    }
    if (!password) {
      toast.error('请输入密码');
      return;
    }
    if (!isLoginMode) {
      if (password !== confirmPassword) {
        toast.error('两次输入的密码不一致');
        return;
      }
      if (!email) {
        toast.error('请输入邮箱');
        return;
      }
      // Registration no longer requires verification code
    }

    setIsLoading(true);
    
    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
    const body = isLoginMode 
      ? { phone, password }
      : { phone, password, avatar: selectedAvatar, email, code: verificationCode };

    try {
      const data = await request<{ success: boolean; user?: any; token?: any; error?: string }>(endpoint, {
        method: 'POST',
        data: body
      });
      
      if (data.success || data.user) {
        login(data.user, data.token); // Pass token to login
        toast.success(isLoginMode ? '登录成功' : '注册成功');
        closeAuthModal();
        setPhone('');
        setPassword('');
        // Reset to login mode for next time
        setTimeout(() => setIsLoginMode(true), 300); 
      } else {
        toast.error(data.error || (isLoginMode ? '登录失败' : '注册失败'));
      }
    } catch (error: any) {
       console.error(error);
       toast.error(error.message || '网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setIsForgotPasswordMode(false);
    setPhone('');
    setPassword('');
    setEmail('');
    setVerificationCode('');
  };

  const switchToForgotPassword = () => {
    setIsForgotPasswordMode(true);
    setIsLoginMode(false); // Hide login form
    setPhone('');
    setPassword('');
    setEmail('');
    setVerificationCode('');
  };

  const backToLogin = () => {
    setIsForgotPasswordMode(false);
    setIsLoginMode(true);
    setPhone('');
    setPassword('');
    setEmail('');
    setVerificationCode('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl relative max-h-[90vh] flex flex-col overflow-hidden">
         <button 
          onClick={closeAuthModal}
          type="button"
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors z-[100] cursor-pointer"
        >
          <X size={20} />
        </button>
        
        <div className="p-8 overflow-y-auto scrollbar-hide">
          <div className="text-center mb-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300 ${isForgotPasswordMode ? 'bg-indigo-100 text-indigo-500' : (isLoginMode ? 'bg-pink-100 text-pink-500' : 'bg-purple-100 text-purple-500')} overflow-hidden`}>
              {isLoginMode || isForgotPasswordMode ? <User size={32} /> : (
                 <img src={selectedAvatar} alt="Avatar" className="w-full h-full object-cover" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 transition-all duration-300">
              {isForgotPasswordMode ? '重置密码' : (isLoginMode ? '欢迎回来' : '创建账号')}
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              {isForgotPasswordMode ? '通过邮箱验证找回密码' : (isLoginMode ? '请输入您的灵犀账号' : '设置您的专属灵犀账号')}
            </p>
          </div>

          {!isLoginMode && !isForgotPasswordMode && (
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
              
              {/* Login / Register Phone Input */}
              {!isForgotPasswordMode && (
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
              )}

              {/* Register Email Input (Register Only) */}
              {!isLoginMode && !isForgotPasswordMode && (
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
              )}

              {/* Forgot Password Email Input */}
              {isForgotPasswordMode && (
                <div className="relative flex items-center">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center z-10 w-24">
                    <span className="text-gray-500 font-bold text-sm w-10 text-center">邮箱</span>
                    <div className="h-6 w-px bg-gray-300 mx-3"></div>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="请输入注册邮箱"
                    className="w-full pl-24 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-bold text-lg placeholder:font-normal placeholder:text-gray-400"
                  />
                </div>
              )}

              {/* Verification Code Input (Forgot Password Only) */}
              {isForgotPasswordMode && (
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
              )}

              {/* Password Input (All Modes) */}
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
                  placeholder={isForgotPasswordMode ? "请设置新密码" : (isLoginMode ? "请输入密码" : "请设置密码")}
                  className="w-full pl-24 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-bold text-lg placeholder:font-normal placeholder:text-gray-400"
                />
              </div>

              {/* Confirm Password Input (Register Only) */}
              {!isLoginMode && !isForgotPasswordMode && (
                <div className="relative flex items-center">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 z-10 w-24">
                    <div className="w-10 flex justify-center">
                      <Lock size={20} strokeWidth={2.5} />
                    </div>
                    <div className="h-6 w-px bg-gray-300 mx-3"></div>
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="请再次输入密码"
                    className="w-full pl-24 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-bold text-lg placeholder:font-normal placeholder:text-gray-400"
                  />
                </div>
              )}

              {/* Login Only: Forgot Password Link */}
              {isLoginMode && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={switchToForgotPassword}
                    className="text-xs text-gray-500 hover:text-pink-500 transition-colors"
                  >
                    忘记密码？
                  </button>
                </div>
              )}

            </div>

            <button
              type="submit"
              disabled={isLoading || (isForgotPasswordMode ? (!email || !verificationCode || !password) : (phone.length !== 11 || !password || (!isLoginMode && (!email || !verificationCode))))}
              className={`w-full py-3 px-4 text-white rounded-xl font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                isForgotPasswordMode
                  ? 'bg-gradient-to-r from-indigo-500 to-blue-500 shadow-indigo-500/30 hover:shadow-indigo-500/40'
                  : isLoginMode 
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-500/30 hover:shadow-pink-500/40' 
                    : 'bg-gradient-to-r from-purple-500 to-indigo-500 shadow-purple-500/30 hover:shadow-purple-500/40'
              }`}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : (isForgotPasswordMode ? '重置密码' : (isLoginMode ? '登录' : '立即注册'))}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-6 text-center">
            {isForgotPasswordMode ? (
              <button 
                onClick={backToLogin}
                className="text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium"
              >
                返回登录
              </button>
            ) : (
              <button 
                onClick={toggleMode}
                className="text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium"
              >
                {isLoginMode ? '还没有账号？' : '已有账号？'} 
                <span className={`underline ml-1 ${isLoginMode ? 'text-pink-500' : 'text-purple-500'}`}>
                  {isLoginMode ? '去注册' : '去登录'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
