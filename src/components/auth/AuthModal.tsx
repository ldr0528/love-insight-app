import React, { useState, useEffect } from 'react';
import { X, Phone, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import SliderCaptcha from './SliderCaptcha';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isAuthModalOpen) {
      setPhone('');
      setCode('');
      setStep('phone');
      setShowCaptcha(false);
      setIsLoading(false);
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      alert('请输入有效的手机号码');
      return;
    }
    setShowCaptcha(true);
  };

  const handleCaptchaVerify = async (success: boolean) => {
    if (success) {
      setShowCaptcha(false);
      setIsLoading(true);
      
      try {
        const res = await fetch('/api/auth/send-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone })
        });
        
        const data = await res.json();
        
        if (res.ok) {
          setStep('code');
          setCountdown(60);
        } else {
          alert(data.error || '发送验证码失败');
        }
      } catch (error) {
        alert('网络错误，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      alert('请输入6位验证码');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        login(data.user);
        closeAuthModal();
      } else {
        alert(data.error || '登录失败，请检查验证码');
      }
    } catch (error) {
      alert('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95 duration-200 relative">
        {/* Close button */}
        <button 
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {step === 'phone' ? '登录 / 注册' : '输入验证码'}
            </h2>
            <p className="text-gray-500 text-sm">
              {step === 'phone' 
                ? '未注册手机号验证后将自动创建账号' 
                : `验证码已发送至 ${phone}`}
            </p>
          </div>

          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1">手机号码</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Phone size={20} />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    placeholder="请输入11位手机号码"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-medium"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={phone.length !== 11 || isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold shadow-lg shadow-pink-500/30 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : '获取验证码'}
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1">验证码</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={20} />
                  </div>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="请输入6位数字验证码 (测试: 123456)"
                    className="w-full pl-12 pr-28 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-medium tracking-widest"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (countdown === 0) {
                        setShowCaptcha(true);
                      }
                    }}
                    disabled={countdown > 0}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-medium text-pink-600 bg-pink-50 rounded-lg hover:bg-pink-100 disabled:opacity-50 disabled:hover:bg-pink-50 transition-colors"
                  >
                    {countdown > 0 ? `${countdown}s后重试` : '重新获取'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={code.length !== 6 || isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold shadow-lg shadow-pink-500/30 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : '登录 / 注册'}
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
              >
                更换手机号
              </button>
            </form>
          )}

          {/* Social Login Divider (Optional) */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-center text-xs text-gray-400 mb-4">
              登录即代表同意 <a href="#" className="text-pink-500 hover:underline">用户协议</a> 和 <a href="#" className="text-pink-500 hover:underline">隐私政策</a>
            </p>
          </div>
        </div>
      </div>

      {/* Captcha Overlay */}
      {showCaptcha && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <SliderCaptcha 
            onVerify={handleCaptchaVerify} 
            onClose={() => setShowCaptcha(false)}
          />
        </div>
      )}
    </div>
  );
}
