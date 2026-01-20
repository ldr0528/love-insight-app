import React, { useState } from 'react';
import { ArrowLeft, PenTool, Sparkles, User, Briefcase, Wand2 } from 'lucide-react';
import { Link } from 'react-router-dom';

type NamingType = 'baby' | 'company' | 'brand';

export default function NamingMaster() {
  const [namingType, setNamingType] = useState<NamingType>('baby');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Form states
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('boy');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');

  const handleGenerate = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setResult(generateMockResult(namingType));
    }, 2000);
  };

  const generateMockResult = (type: NamingType) => {
    if (type === 'baby') {
      return [
        { name: lastName + '浩宇', pinyin: 'Hào Yǔ', meaning: '浩瀚宇宙，心胸开阔，前程远大', wuxing: '水土' },
        { name: lastName + '思淼', pinyin: 'Sī Miǎo', meaning: '思绪如水，智慧深邃，灵动敏捷', wuxing: '金水' },
        { name: lastName + '奕辰', pinyin: 'Yì Chén', meaning: '神采奕奕，如星辰般璀璨耀眼', wuxing: '木土' },
      ];
    } else {
      return [
        { name: '智创', pinyin: 'Zhì Chuàng', meaning: '智慧创造，引领行业未来', style: '科技感' },
        { name: '云启', pinyin: 'Yún Qǐ', meaning: '云端开启，无限可能', style: '大气' },
        { name: '极客', pinyin: 'Jí Kè', meaning: '追求极致，探索前沿', style: '新潮' },
      ];
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center p-4">
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-8 pt-4">
        <Link to="/" className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <PenTool className="w-6 h-6 text-purple-600" />
          AI 起名大师
        </h1>
        <div className="w-10"></div>
      </div>

      <div className="w-full max-w-2xl space-y-6">
        {/* Type Selection */}
        <div className="bg-white rounded-2xl p-2 shadow-sm flex">
          <button
            onClick={() => { setNamingType('baby'); setResult(null); }}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              namingType === 'baby' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <User className="w-4 h-4" /> 宝宝起名
          </button>
          <button
            onClick={() => { setNamingType('company'); setResult(null); }}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              namingType === 'company' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Briefcase className="w-4 h-4" /> 公司/品牌起名
          </button>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
          {namingType === 'baby' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">宝宝姓氏</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="例如：李"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">出生日期 (阳历)</label>
                <input
                  type="datetime-local"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">性别</label>
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="boy"
                      checked={gender === 'boy'}
                      onChange={() => setGender('boy')}
                      className="hidden peer"
                    />
                    <div className="p-3 rounded-xl border-2 border-gray-100 peer-checked:border-blue-500 peer-checked:bg-blue-50 text-center text-gray-600 peer-checked:text-blue-600 transition-all">
                      👦 男孩
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="girl"
                      checked={gender === 'girl'}
                      onChange={() => setGender('girl')}
                      className="hidden peer"
                    />
                    <div className="p-3 rounded-xl border-2 border-gray-100 peer-checked:border-pink-500 peer-checked:bg-pink-50 text-center text-gray-600 peer-checked:text-pink-600 transition-all">
                      👧 女孩
                    </div>
                  </label>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">所属行业</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="例如：科技、餐饮、服装"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">品牌描述/愿景</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="例如：主打年轻人的健康轻食，风格简约时尚..."
                  rows={3}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                />
              </div>
            </>
          )}

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" /> 正在推算...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" /> 立即生成好名
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-800 ml-1">推荐名字</h2>
            {result.map((item: any, index: number) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-md border border-purple-50 flex flex-col gap-2 relative overflow-hidden group hover:shadow-lg transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                
                <div className="flex justify-between items-end relative z-10">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-purple-600 font-medium">{item.pinyin}</p>
                  </div>
                  {item.wuxing && (
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                      五行：{item.wuxing}
                    </span>
                  )}
                  {item.style && (
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                      风格：{item.style}
                    </span>
                  )}
                </div>
                
                <div className="mt-2 pt-4 border-t border-gray-100 relative z-10">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    <span className="font-bold text-gray-800">寓意解析：</span>
                    {item.meaning}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}