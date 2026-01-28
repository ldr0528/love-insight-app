
import { useReportStore } from '@/store/useReportStore';
import { User, Calendar, Heart, Target, Clock, MapPin } from 'lucide-react';

export default function BasicInfoStep() {
  const { profile, setProfile, nextStep } = useReportStore();

  const isFormValid = profile.name && profile.birthday;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">第一步：基础档案</h2>
        <p className="text-gray-500">完善生辰信息，生成更精准的星盘/八字解读</p>
      </div>

      <div className="space-y-4">
        {/* Name Input */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 text-pink-500" /> 你的昵称
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ name: e.target.value })}
            placeholder="怎么称呼你？"
            className="w-full border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-pink-200 focus:border-pink-500 transition-all outline-none"
          />
        </div>

        {/* Gender Selection */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 text-pink-500" /> 性别
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setProfile({ gender: 'female' })}
              className={`p-3 rounded-lg text-sm transition-all ${
                profile.gender === 'female'
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              女
            </button>
            <button
              onClick={() => setProfile({ gender: 'male' })}
              className={`p-3 rounded-lg text-sm transition-all ${
                profile.gender === 'male'
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              男
            </button>
          </div>
        </div>

        {/* Birthday Input */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 text-pink-500" /> 出生日期 (公历)
          </label>
          <input
            type="date"
            value={profile.birthday}
            onChange={(e) => setProfile({ birthday: e.target.value })}
            className="w-full border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-pink-200 focus:border-pink-500 transition-all outline-none"
          />
        </div>

        {/* Birth Time & Location */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 text-pink-500" /> 出生时间
            </label>
            <input
              type="time"
              value={profile.birthTime || '12:00'}
              onChange={(e) => setProfile({ birthTime: e.target.value })}
              className="w-full border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-pink-200 focus:border-pink-500 transition-all outline-none"
            />
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 text-pink-500" /> 出生地点
            </label>
            <input
              type="text"
              value={profile.birthLocation || ''}
              onChange={(e) => setProfile({ birthLocation: e.target.value })}
              placeholder="城市 (如: 上海)"
              className="w-full border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-pink-200 focus:border-pink-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Relationship Status */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Heart className="w-4 h-4 text-pink-500" /> 当前情感状态
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { val: 'single', label: '单身' },
              { val: 'dating', label: '暧昧/接触中' },
              { val: 'relationship', label: '恋爱/婚姻中' },
              { val: 'breakup_recovery', label: '分手/疗愈期' }
            ].map((opt) => (
              <button
                key={opt.val}
                onClick={() => setProfile({ relationship_stage: opt.val as any })}
                className={`p-3 rounded-lg text-sm transition-all ${
                  profile.relationship_stage === opt.val
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={nextStep}
        disabled={!isFormValid}
        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
          isFormValid 
            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white cursor-pointer' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        生成星盘/八字解读报告 &rarr;
      </button>
    </div>
  );
}
