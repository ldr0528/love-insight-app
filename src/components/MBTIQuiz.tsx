
import { useState } from 'react';
import { Check, ArrowRight, RefreshCcw } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  dimension: 'E_I' | 'S_N' | 'T_F' | 'J_P';
  options: [
    { text: string; value: string }, 
    { text: string; value: string }
  ];
}

const QUESTIONS: Question[] = [
  // --- E vs I (Energy: 12 Questions) ---
  {
    id: 1,
    text: "在经过忙碌的一周工作后，你通常更倾向于...",
    dimension: 'E_I',
    options: [
      { text: "和朋友聚会、吃饭或参加活动，释放压力", value: 'E' },
      { text: "独自在家看书、追剧或睡觉，享受独处时光", value: 'I' }
    ]
  },
  {
    id: 2,
    text: "在社交场合中，你通常...",
    dimension: 'E_I',
    options: [
      { text: "主动介绍自己，很容易与陌生人打成一片", value: 'E' },
      { text: "等待别人来和你搭话，或者只和认识的人聊天", value: 'I' }
    ]
  },
  {
    id: 3,
    text: "当遇到一个复杂的问题时，你更习惯...",
    dimension: 'E_I',
    options: [
      { text: "找人讨论，在交流中理清思路", value: 'E' },
      { text: "独自思考，想清楚了再说", value: 'I' }
    ]
  },
  {
    id: 4,
    text: "你认为自己是一个...",
    dimension: 'E_I',
    options: [
      { text: "容易被了解的人，喜怒哀乐都写在脸上", value: 'E' },
      { text: "比较难被了解的人，注重保护个人隐私", value: 'I' }
    ]
  },
  {
    id: 5,
    text: "在聚会上，你通常是...",
    dimension: 'E_I',
    options: [
      { text: "那个说话最多、最活跃的人之一", value: 'E' },
      { text: "那个安静倾听、观察周围的人", value: 'I' }
    ]
  },
  {
    id: 6,
    text: "电话铃声突然响起时，你的第一反应是...",
    dimension: 'E_I',
    options: [
      { text: "立刻接听，想知道是谁找我", value: 'E' },
      { text: "希望能不接就不接，更喜欢文字沟通", value: 'I' }
    ]
  },
  {
    id: 7,
    text: "你更喜欢哪种工作环境？",
    dimension: 'E_I',
    options: [
      { text: "开放式办公，大家随时可以交流讨论", value: 'E' },
      { text: "独立的办公室或安静的角落，不受打扰", value: 'I' }
    ]
  },
  {
    id: 8,
    text: "在排队等候时，你会...",
    dimension: 'E_I',
    options: [
      { text: "经常和身边的人闲聊几句", value: 'E' },
      { text: "看手机或发呆，不主动和人说话", value: 'I' }
    ]
  },
  {
    id: 9,
    text: "你觉得哪种情况更让你感到疲惫？",
    dimension: 'E_I',
    options: [
      { text: "长时间独自一人，没有人说话", value: 'E' },
      { text: "长时间处于嘈杂的人群中，需要不停社交", value: 'I' }
    ]
  },
  {
    id: 10,
    text: "你的朋友圈子通常是...",
    dimension: 'E_I',
    options: [
      { text: "非常广泛，认识各种各样的人", value: 'E' },
      { text: "比较小，但都是非常亲密的朋友", value: 'I' }
    ]
  },
  {
    id: 11,
    text: "当你在专注于一件事时被别人打断，你会...",
    dimension: 'E_I',
    options: [
      { text: "不介意，乐于回应对方", value: 'E' },
      { text: "感到烦躁，希望能尽快结束对话", value: 'I' }
    ]
  },
  {
    id: 12,
    text: "在团队合作中，你更倾向于...",
    dimension: 'E_I',
    options: [
      { text: "担任发言人，代表团队展示成果", value: 'E' },
      { text: "负责幕后工作，专注于内容本身", value: 'I' }
    ]
  },

  // --- S vs N (Information: 13 Questions) ---
  {
    id: 13,
    text: "如果你是一名作家，你更倾向于写...",
    dimension: 'S_N',
    options: [
      { text: "基于现实生活的非虚构类作品，注重细节描写", value: 'S' },
      { text: "充满奇幻色彩的科幻小说，注重构思与隐喻", value: 'N' }
    ]
  },
  {
    id: 14,
    text: "在学习新技能时，你更喜欢...",
    dimension: 'S_N',
    options: [
      { text: "按照详细的步骤说明，一步步操作", value: 'S' },
      { text: "了解大概原理后，自己摸索尝试", value: 'N' }
    ]
  },
  {
    id: 15,
    text: "你通常更关注...",
    dimension: 'S_N',
    options: [
      { text: "当下的现实情况和具体的细节", value: 'S' },
      { text: "未来的可能性和整体的趋势", value: 'N' }
    ]
  },
  {
    id: 16,
    text: "当你描述一件事情时，你倾向于...",
    dimension: 'S_N',
    options: [
      { text: "实事求是，描述具体发生了什么", value: 'S' },
      { text: "加入自己的联想，描述这件事情的意义", value: 'N' }
    ]
  },
  {
    id: 17,
    text: "你更信任...",
    dimension: 'S_N',
    options: [
      { text: "亲身经验和经过验证的数据", value: 'S' },
      { text: "直觉灵感和未经证实的理论", value: 'N' }
    ]
  },
  {
    id: 18,
    text: "对于“常识”，你的态度是...",
    dimension: 'S_N',
    options: [
      { text: "通常是正确的，值得遵守", value: 'S' },
      { text: "经常是过时的，值得质疑", value: 'N' }
    ]
  },
  {
    id: 19,
    text: "看电影时，你更在意...",
    dimension: 'S_N',
    options: [
      { text: "服装道具是否真实，情节是否合乎逻辑", value: 'S' },
      { text: "电影传达的主题思想和象征意义", value: 'N' }
    ]
  },
  {
    id: 20,
    text: "你更喜欢和哪种人聊天？",
    dimension: 'S_N',
    options: [
      { text: "脚踏实地，聊生活琐事和实用信息的人", value: 'S' },
      { text: "天马行空，聊哲学思考和未来设想的人", value: 'N' }
    ]
  },
  {
    id: 21,
    text: "在做计划时，你更注重...",
    dimension: 'S_N',
    options: [
      { text: "具体的执行细节和所需资源", value: 'S' },
      { text: "最终要达到的愿景和目标", value: 'N' }
    ]
  },
  {
    id: 22,
    text: "对于抽象的理论讨论，你会...",
    dimension: 'S_N',
    options: [
      { text: "觉得枯燥乏味，甚至有点浪费时间", value: 'S' },
      { text: "觉得充满趣味，乐于参与其中", value: 'N' }
    ]
  },
  {
    id: 23,
    text: "你认为自己...",
    dimension: 'S_N',
    options: [
      { text: "比较务实，看重实际效果", value: 'S' },
      { text: "比较有创意，看重想法的新颖性", value: 'N' }
    ]
  },
  {
    id: 24,
    text: "在解决问题时，你倾向于...",
    dimension: 'S_N',
    options: [
      { text: "使用成熟的、标准的方法", value: 'S' },
      { text: "设计全新的、独特的方案", value: 'N' }
    ]
  },
  {
    id: 25,
    text: "你对未来的看法是...",
    dimension: 'S_N',
    options: [
      { text: "基于现在的延续，可以被预测", value: 'S' },
      { text: "充满变数，可以被创造", value: 'N' }
    ]
  },

  // --- T vs F (Decision: 12 Questions) ---
  {
    id: 26,
    text: "在做决定时，你更看重...",
    dimension: 'T_F',
    options: [
      { text: "逻辑推理和客观事实", value: 'T' },
      { text: "个人感受和对他人的影响", value: 'F' }
    ]
  },
  {
    id: 27,
    text: "当朋友犯错时，你会...",
    dimension: 'T_F',
    options: [
      { text: "直接指出错误，帮助他改正", value: 'T' },
      { text: "先安抚情绪，委婉地提醒", value: 'F' }
    ]
  },
  {
    id: 28,
    text: "你认为什么是“公平”？",
    dimension: 'T_F',
    options: [
      { text: "一视同仁，所有人遵守同样的规则", value: 'T' },
      { text: "具体情况具体分析，考虑每个人的难处", value: 'F' }
    ]
  },
  {
    id: 29,
    text: "在争论中，你更在意...",
    dimension: 'T_F',
    options: [
      { text: "谁的观点更符合逻辑和事实", value: 'T' },
      { text: "不要伤了和气，维护关系和谐", value: 'F' }
    ]
  },
  {
    id: 30,
    text: "你更希望被别人评价为...",
    dimension: 'T_F',
    options: [
      { text: "一个聪明、有能力的人", value: 'T' },
      { text: "一个善良、体贴的人", value: 'F' }
    ]
  },
  {
    id: 31,
    text: "面对别人的倾诉，你通常...",
    dimension: 'T_F',
    options: [
      { text: "分析问题原因，提供解决方案", value: 'T' },
      { text: "倾听并表示理解，提供情感支持", value: 'F' }
    ]
  },
  {
    id: 32,
    text: "在工作中，如果必须要裁员，你会...",
    dimension: 'T_F',
    options: [
      { text: "根据绩效考核，留下能力最强的人", value: 'T' },
      { text: "非常纠结，担心被裁员工的生活", value: 'F' }
    ]
  },
  {
    id: 33,
    text: "你认为真理和和睦哪个更重要？",
    dimension: 'T_F',
    options: [
      { text: "真理更重要，即使会得罪人", value: 'T' },
      { text: "和睦更重要，善意的谎言是可以接受的", value: 'F' }
    ]
  },
  {
    id: 34,
    text: "你的决策风格通常是...",
    dimension: 'T_F',
    options: [
      { text: "冷静客观，不被情绪左右", value: 'T' },
      { text: "热情投入，听从内心的召唤", value: 'F' }
    ]
  },
  {
    id: 35,
    text: "你更容易被什么说服？",
    dimension: 'T_F',
    options: [
      { text: "严密的逻辑论证和数据支持", value: 'T' },
      { text: "感人的故事和强烈的情感共鸣", value: 'F' }
    ]
  },
  {
    id: 36,
    text: "在评价一部电影时，你更关注...",
    dimension: 'T_F',
    options: [
      { text: "剧本结构是否严谨，逻辑是否通顺", value: 'T' },
      { text: "角色情感是否真挚，能否打动人心", value: 'F' }
    ]
  },
  {
    id: 37,
    text: "当由于你的决定伤害到别人时，你会...",
    dimension: 'T_F',
    options: [
      { text: "认为这是必要的代价，只要决定是正确的", value: 'T' },
      { text: "感到非常内疚，甚至怀疑决定是否正确", value: 'F' }
    ]
  },

  // --- J vs P (Lifestyle: 13 Questions) ---
  {
    id: 38,
    text: "关于旅行，你习惯...",
    dimension: 'J_P',
    options: [
      { text: "提前做好详细攻略，预订好所有行程", value: 'J' },
      { text: "只定个大概方向，走到哪算哪", value: 'P' }
    ]
  },
  {
    id: 39,
    text: "你的桌面或房间通常是...",
    dimension: 'J_P',
    options: [
      { text: "井井有条，每样东西都有固定的位置", value: 'J' },
      { text: "比较随意，乱中有序，找得到就行", value: 'P' }
    ]
  },
  {
    id: 40,
    text: "面对截止日期，你通常...",
    dimension: 'J_P',
    options: [
      { text: "制定计划，提前完成任务", value: 'J' },
      { text: "拖到最后时刻，靠压力爆发完成", value: 'P' }
    ]
  },
  {
    id: 41,
    text: "周末休息时，你喜欢...",
    dimension: 'J_P',
    options: [
      { text: "提前想好要做什么，安排好时间", value: 'J' },
      { text: "随心所欲，想干什么就干什么", value: 'P' }
    ]
  },
  {
    id: 42,
    text: "你更喜欢哪种工作方式？",
    dimension: 'J_P',
    options: [
      { text: "按部就班，每天完成既定目标", value: 'J' },
      { text: "灵活多变，根据状态调整进度", value: 'P' }
    ]
  },
  {
    id: 43,
    text: "做一个决定后，你会...",
    dimension: 'J_P',
    options: [
      { text: "感到轻松，终于可以开始执行了", value: 'J' },
      { text: "感到有些焦虑，担心是否还有更好的选择", value: 'P' }
    ]
  },
  {
    id: 44,
    text: "对于规则和流程，你的态度是...",
    dimension: 'J_P',
    options: [
      { text: "严格遵守，认为这是效率的保证", value: 'J' },
      { text: "视情况而定，认为规则是死的", value: 'P' }
    ]
  },
  {
    id: 45,
    text: "在购物时，你通常...",
    dimension: 'J_P',
    options: [
      { text: "列好清单，只买需要的", value: 'J' },
      { text: "看心情，经常会冲动消费", value: 'P' }
    ]
  },
  {
    id: 46,
    text: "当计划被打乱时，你会...",
    dimension: 'J_P',
    options: [
      { text: "感到非常不爽，很难适应新的变化", value: 'J' },
      { text: "觉得无所谓，甚至觉得有点刺激", value: 'P' }
    ]
  },
  {
    id: 47,
    text: "你做事倾向于...",
    dimension: 'J_P',
    options: [
      { text: "先工作再玩耍，任务没完成玩不痛快", value: 'J' },
      { text: "先玩耍再工作，享受当下的快乐", value: 'P' }
    ]
  },
  {
    id: 48,
    text: "对于“确定性”，你的感觉是...",
    dimension: 'J_P',
    options: [
      { text: "很舒服，喜欢一切尽在掌握", value: 'J' },
      { text: "很无聊，喜欢未知和惊喜", value: 'P' }
    ]
  },
  {
    id: 49,
    text: "你通常如何结束一天？",
    dimension: 'J_P',
    options: [
      { text: "复盘今天，规划明天", value: 'J' },
      { text: "顺其自然，困了就睡", value: 'P' }
    ]
  },
  {
    id: 50,
    text: "在看剧或看书时，你会...",
    dimension: 'J_P',
    options: [
      { text: "一定要看到结局，不喜欢半途而废", value: 'J' },
      { text: "随时可能弃坑，如果觉得没意思了", value: 'P' }
    ]
  }
];

interface MBTIQuizProps {
  onComplete: (mbti: string) => void;
  onCancel: () => void;
}

export default function MBTIQuiz({ onComplete, onCancel }: MBTIQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (dimension: string, value: string) => {
    const newAnswers = { ...answers, [currentQuestionIndex]: value };
    setAnswers(newAnswers);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: Record<string, string>) => {
    const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    
    QUESTIONS.forEach((q, idx) => {
      const answer = finalAnswers[idx];
      if (answer && answer in counts) {
        counts[answer as keyof typeof counts]++;
      }
    });

    const mbti = [
      counts.E >= counts.I ? 'E' : 'I',
      counts.S >= counts.N ? 'S' : 'N',
      counts.T >= counts.F ? 'T' : 'F',
      counts.J >= counts.P ? 'J' : 'P'
    ].join('');

    onComplete(mbti);
  };

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / QUESTIONS.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">MBTI 深度人格测试</h2>
          <button onClick={onCancel} className="text-white/80 hover:text-white">✕</button>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-gray-100 w-full">
          <div 
            className="h-full bg-pink-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Body */}
        <div className="p-8 flex-1 overflow-y-auto">
          <div className="mb-8">
            <span className="text-sm font-bold text-pink-500 mb-2 block">
              Question {currentQuestionIndex + 1} / {QUESTIONS.length}
            </span>
            <h3 className="text-2xl font-bold text-gray-800 leading-snug">
              {currentQuestion.text}
            </h3>
          </div>

          <div className="space-y-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(currentQuestion.dimension, option.value)}
                className="w-full text-left p-5 rounded-xl border-2 border-gray-100 hover:border-pink-500 hover:bg-pink-50 transition-all group relative overflow-hidden"
              >
                <span className="relative z-10 font-medium text-gray-700 group-hover:text-pink-700 text-lg">
                  {option.text}
                </span>
                <div className="absolute inset-0 bg-white z-0"></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
