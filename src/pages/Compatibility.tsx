import React, { useState } from 'react';
import { ArrowLeft, Heart, Sparkles, Send, RefreshCw, Feather } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Compatibility() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_name: '',
    user_birth: '',
    partner_name: '',
    partner_birth: ''
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-8 flex items-center text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-1" /> 返回首页
        </button>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left Side: Introduction / Form */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/50">
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform rotate-3">
                <Feather className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                缘分探索
              </h1>
              <p className="text-gray-500">
                以名之灵，测爱之深。AI 将结合古今智慧，为您解析前世今生的羁绊。
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-4">
                 <div className="relative">
                   <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">你的名字</label>
                   <input 
                     required
                     type="text" 
                     value={formData.user_name}
                     onChange={e => setFormData({...formData, user_name: e.target.value})}
                     className="w-full px-5 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-purple-200 outline-none transition-all placeholder-gray-400"
                     placeholder="请输入您的姓名"
                   />
                 </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">你的生日 (选填)</label>
                  <div className="relative">
                    <div className={`w-full px-5 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-purple-200 outline-none transition-all flex items-center ${formData.user_birth ? 'text-gray-900' : 'text-gray-400'}`}>
                      {formData.user_birth ? formData.user_birth.replace(/-/g, ' / ') : "请选择出生日期"}
                    </div>
                    <input 
                      type="date"
                      value={formData.user_birth}
                      onChange={e => setFormData({...formData, user_birth: e.target.value})}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                  </div>
                </div>
                 
                 <div className="relative py-2 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative z-10 bg-white p-2 rounded-full shadow-sm border border-gray-100">
                        <Heart className="w-5 h-5 text-pink-400 fill-pink-50" />
                    </div>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">对方的名字</label>
                   <input 
                     required
                     type="text" 
                     value={formData.partner_name}
                     onChange={e => setFormData({...formData, partner_name: e.target.value})}
                     className="w-full px-5 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-purple-200 outline-none transition-all placeholder-gray-400"
                     placeholder="请输入对方姓名"
                   />
                 </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">对方的生日 (选填)</label>
                  <div className="relative">
                    <div className={`w-full px-5 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-purple-200 outline-none transition-all flex items-center ${formData.partner_birth ? 'text-gray-900' : 'text-gray-400'}`}>
                      {formData.partner_birth ? formData.partner_birth.replace(/-/g, ' / ') : "请选择对方生日"}
                    </div>
                    <input 
                      type="date"
                      value={formData.partner_birth}
                      onChange={e => setFormData({...formData, partner_birth: e.target.value})}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                  </div>
                </div>
               </div>

               <button 
                 type="submit" 
                 disabled={loading}
                 className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
               >
                 {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-yellow-300" />}
                 {loading ? '正在以此生数据推演...' : '开始探索缘分'}
               </button>
            </form>
          </div>

          {/* Right Side: Result Area */}
          <div className={`transition-all duration-700 ${result ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 grayscale blur-sm pointer-events-none'}`}>
             {result ? (
               <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white/50">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <h2 className="text-xl font-medium opacity-90 mb-2">缘分契合度</h2>
                    <div className="text-6xl font-bold mb-4 flex items-center justify-center gap-1">
                      {result.score}
                      <span className="text-2xl font-normal opacity-60 mt-4">%</span>
                    </div>
                    <div className="flex justify-center flex-wrap gap-2">
                      {result.keywords?.map((k: string) => (
                        <span key={k} className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="prose prose-purple max-w-none mb-8 text-justify text-gray-600 leading-relaxed">
                      {result.analysis}
                    </div>

                    <div className="relative p-8 bg-gradient-to-br from-indigo-50 to-pink-50 rounded-2xl border border-indigo-100 text-center group hover:shadow-md transition-shadow">
                      <div className="absolute top-4 left-4 text-4xl text-indigo-200 opacity-50 font-serif">“</div>
                      <div className="text-xl font-serif text-gray-800 italic mb-3 relative z-10 leading-loose">
                        {result.ending_poem}
                      </div>
                      <div className="text-xs text-gray-400 font-medium tracking-widest uppercase">—— 灵犀指引</div>
                      <div className="absolute bottom-4 right-4 text-4xl text-indigo-200 opacity-50 font-serif rotate-180">“</div>
                    </div>
                  </div>
               </div>
             ) : (
               <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-gray-400 bg-white/40 backdrop-blur-md rounded-3xl border border-dashed border-gray-300 p-8">
                 <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Heart className="w-8 h-8 text-gray-300" />
                 </div>
                 <p className="text-lg">等待输入数据...</p>
                 <p className="text-sm mt-2 max-w-xs text-center opacity-70">
                   请在左侧输入双方信息，我们将为您揭开命运的神秘面纱。
                 </p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
