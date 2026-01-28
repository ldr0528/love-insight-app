import React from 'react';
import { useReportStore, FortuneType } from '@/store/useReportStore';
import { Calendar, Moon, Sun, ArrowRight } from 'lucide-react';

export default function FortuneTypeSelectionStep() {
  const { setFortuneType, nextStep } = useReportStore();

  const handleSelect = (type: FortuneType) => {
    setFortuneType(type);
    nextStep();
  };

  const options = [
    {
      id: 'weekly' as FortuneType,
      title: '周运来福',
      desc: '本周运势 · 宜忌指南',
      icon: <Sun className="w-8 h-8 text-orange-500" />,
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
      textColor: 'text-orange-700',
    },
    {
      id: 'monthly' as FortuneType,
      title: '月运来福',
      desc: '本月运程 · 关键节点',
      icon: <Moon className="w-8 h-8 text-indigo-500" />,
      color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
      textColor: 'text-indigo-700',
    },
    {
      id: 'yearly' as FortuneType,
      title: '年运来福',
      desc: '2026流年 · 全局规划',
      icon: <Calendar className="w-8 h-8 text-pink-500" />,
      color: 'bg-pink-50 hover:bg-pink-100 border-pink-200',
      textColor: 'text-pink-700',
    },
  ];

  return (
    <div className="flex flex-col items-center animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">运报客栈</h2>
        <p className="text-gray-500">请选择您想要开启的运势锦囊</p>
      </div>

      <div className="w-full space-y-4">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-between group ${option.color}`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                {option.icon}
              </div>
              <div className="text-left">
                <h3 className={`text-xl font-bold ${option.textColor}`}>
                  {option.title}
                </h3>
                <p className="text-gray-500 text-sm mt-1">{option.desc}</p>
              </div>
            </div>
            <ArrowRight className={`w-5 h-5 ${option.textColor} opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1`} />
          </button>
        ))}
      </div>

      <div className="mt-8 text-xs text-gray-400 text-center max-w-xs">
        *所有运势分析基于当前时间与您的个人命盘数据进行实时推演
      </div>
    </div>
  );
}
