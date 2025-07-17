import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModernCard } from "./ModernCard";
import { NeonButton2025 } from "./NeonButton2025";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface AIResponse {
  patterns: string[];
  response: string;
  category: string;
}

// قاعدة معرفة محلية للأسئلة والإجابات
const knowledgeBase: AIResponse[] = [
  {
    patterns: ["مرحبا", "السلام عليكم", "أهلا", "مساء الخير", "صباح الخ��ر"],
    response:
      "🔐 مرحباً بك! أنا المساعد الذكي المحلي لنظام KnouxCrypt™. يمكنني مساعدتك في:\n\n✅ شرح خوارزميات التشفير\n✅ توصيات الأمان\n✅ أفضل الممارسات\n✅ اختيار الخوارزمية المناسبة\n\nكيف يمكنني مساعدتك اليوم؟",
    category: "greeting",
  },
  {
    patterns: ["AES", "AES-256", "ايه اي اس"],
    response:
      "🛡️ **خوارزمية AES-256**\n\n**المميزات:**\n• سرعة عالية في التشفير\n• مدعومة عالمياً\n• أمان قوي 256-bit\n• 14 جولة تشفير\n\n**الاستخدامات المثلى:**\n• تشفير الملفات اليومية\n• قواعد البيانات\n• الاتصالات الآمنة\n• التطبيقات التجارية\n\n**التقييم:** ⭐⭐⭐⭐⭐ (ممتاز للاستخدام العام)",
    category: "algorithm",
  },
  {
    patterns: ["Serpent", "سربنت", "الثعبان"],
    response:
      "🐍 **خوارزمية Serpent**\n\n**المميزات:**\n• أمان أقصى مع 32 جولة\n• مقاومة عالية للهجمات\n• تصميم محافظ للأمان\n• خيار ممتاز للبيا��ات الحساسة\n\n**الاستخدامات المثلى:**\n• البيانات الحكومية\n• الأنظمة المصرفية\n• الأبحاث السرية\n• التطبيقات عالية الأمان\n\n**التقييم:** ⭐⭐⭐⭐⭐ (أمان فائق)",
    category: "algorithm",
  },
  {
    patterns: ["Twofish", "توفيش", "السمكتين"],
    response:
      "🐟 **خوارزمية Twofish**\n\n**المميزات:**\n• توازن مثالي بين السرعة والأمان\n• 16 جولة تشفير\n• كفاءة عالية في الأداء\n• مرونة في التطبيق\n\n**الاستخدامات المثلى:**\n• التراسل الفوري\n• شبكات VPN\n• التخزين السحابي\n• الألعاب الآمنة\n\n**التقييم:** ⭐⭐⭐⭐☆ (متوازن وعملي)",
    category: "algorithm",
  },
  {
    patterns: ["تشفير ثلاثي", "Triple", "AES-Serpent-Twofish", "ثلاثي"],
    response:
      "🔐 **التشفير الثلاثي (AES→Serpent→Twofish)**\n\n**المميزات الفريدة:**\n• أقصى مستوى أمان ممكن\n• 62 جولة تشفير إجمالية\n• مقاوم للكمبيوتر الكمي\n• تصميم حصري لـ KnouxCrypt™\n\n**الاستخدامات الخاصة:**\n• الأسرار العسكرية\n• البيانات المصنفة\n• الأرشيف طويل المدى\n• الأمن القومي\n\n**التقييم:** ⭐⭐⭐⭐⭐ (أمان مطلق)",
    category: "algorithm",
  },
  {
    patterns: ["كلمة مرور", "كلمة سر", "password", "باسورد"],
    response:
      "🔑 **أفضل ممارسات كلمات المرور:**\n\n**القوة:**\n• 12+ حرف على الأقل\n• مزيج من أحرف كبيرة وصغيرة\n• أرقام ورموز خاصة\n• تجنب الكلمات المعروفة\n\n**الأمان:**\n• استخدم مدير كلمات مرور\n• كلمة مرور فريدة لكل حساب\n• فعّل المصادقة الثنائية\n• غيّر كلمات المرور دورياً",
    category: "security",
  },
  {
    patterns: ["مفتاح", "key", "مفاتيح", "كي"],
    response:
      "🗝️ **إدارة المفاتيح الآمنة:**\n\n**التوليد:**\n• استخدم مولدات عشوائية قوية\n• تجنب المفاتيح القابلة للتخمين\n• طول كافٍ (256-bit على الأقل)\n\n**التخزين:**\n• احفظ المفاتيح منفصلة عن البيانات\n• استخدم HSM للمفاتيح الحساسة\n• نسخ احتياطية آمنة ومشفرة\n\n**الدوران:**\n• غيّر المفاتيح دورياً\n• خطة للطوارئ عند تسريب مفتاح",
    category: "security",
  },
  {
    patterns: ["أيهما أفضل", "مقارنة", "الفرق", "compare"],
    response:
      "📊 **مقارنة سريعة للخوارزميات:**\n\n**للسرعة:** AES-256 ⚡\n**للأمان الأقصى:** Serpent 🛡️\n**للتوازن:** Twofish ⚖️\n**للحماية المطلقة:** التشفير الثلاثي 🔐\n\n**التوصية:**\n• الاستخدام العام: AES-256\n• البيانات الحساسة: Serpent\n• التطبيقات السريعة: Twofish\n• الأمان العسكري: التشفير الثلاثي",
    category: "comparison",
  },
  {
    patterns: ["هجوم", "اختراق", "hack", "attack"],
    response:
      "⚔️ **الحماية من الهجمات:**\n\n**أنواع الهجمات الشائعة:**\n• هجمات القوة الغاشمة\n• هجمات القاموس\n• التصيد الإلكتروني\n• البرمجيات الخبيثة\n\n**الحماية:**\n• استخدم تشفير قوي\n• حدّث النظام باستمرار\n• مراقبة الشبكة\n• تدريب المستخدمين\n• نسخ احتياطية منتظمة",
    category: "security",
  },
  {
    patterns: ["بطيء", "سريع", "أداء", "performance"],
    response:
      "⚡ **تحسين أداء التشفير:**\n\n**لتحسين السرعة:**\n• استخدم AES-256 للسرعة\n• تفعيل التسريع المعدني (AES-NI)\n• تشفير متوازي للملفات الكبيرة\n• تحسين حجم البلوك\n\n**موازنة الأداء:**\n• السرعة العالية: AES ⚡⚡⚡\n• متوسط: Twofish ⚡⚡\n• أمان عالي: Serpent ⚡\n• أقصى أمان: التشفير الثلاثي 🐌",
    category: "performance",
  },
  {
    patterns: ["شكرا", "شكراً", "thanks", "مشكور"],
    response:
      "🙏 عفواً! سعيد لمساعدتك في أمانك الرقمي.\n\n💡 **تذكر دائماً:**\n• الأمان رحلة وليس وجهة\n• حدّث معرفتك باستمرار\n• ثق ولكن تحقق\n\nأي سؤال آخر؟ أنا هنا لمساعدتك! 🔐",
    category: "closing",
  },
];

const defaultResponses = [
  "🤔 سؤال ممتاز! دعني أفكر في أفضل إجابة لك...",
  "💭 يمكنني مساعدتك في أسئلة التشفير والأمان. هل يمكنك إعادة صياغة سؤالك؟",
  "🔍 لم أتمكن من فهم سؤالك بالضبط. جرب سؤالاً حول:\n• خوارزميات التشفير\n• أمان كلمات المرور\n• حماية البيانات\n• أفضل الممارسات",
  "🎯 أنا متخصص في الأمان والتشفير. اسألني عن AES، Serpent، Twofish، أو أي موضوع متعلق بالأمان الرقمي!",
];

interface LocalAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocalAIAssistant: React.FC<LocalAIAssistantProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // رسالة الترحيب
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        type: "ai",
        content:
          "🔐 مرحباً! أنا المساعد الذكي المحلي لنظام KnouxCrypt™.\n\nأعمل بالكامل على جهازك بدون اتصال بالإنترنت لضمان خصوصيت�� المطلقة.\n\nيمكنني مساعدتك في أسئلة التشفير والأمان. اسألني أي شيء!",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  // التمرير للأسفل عند إضافة رسائل جديدة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // معالج الذكاء الاصطناعي المحلي
  const getLocalAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase().trim();

    // البحث في قاعدة المعرفة
    for (const item of knowledgeBase) {
      for (const pattern of item.patterns) {
        if (input.includes(pattern.toLowerCase())) {
          return item.response;
        }
      }
    }

    // ردود افتراضية
    return defaultResponses[
      Math.floor(Math.random() * defaultResponses.length)
    ];
  };

  // إرسال رسالة
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // محاكاة وقت التفكير
    setTimeout(
      () => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: getLocalAIResponse(inputMessage),
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiResponse]);
        setIsTyping(false);
      },
      1000 + Math.random() * 2000,
    );
  };

  // أسئلة سريعة
  const quickQuestions = [
    "ما هي أفضل خوارزمية للاستخدام العام؟",
    "كيف أحمي كلمات المرور؟",
    "الفرق بين AES و Serpent؟",
    "ما هو التشفير الثلاثي؟",
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
    handleSendMessage();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-4xl max-h-[90vh] mx-4"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <ModernCard variant="hologram" className="h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <div className="flex items-center gap-4">
                <motion.div
                  className="text-4xl"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  🧠
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    المساعد الذكي المحلي
                  </h2>
                  <p className="text-gray-400 text-sm">
                    يعمل بالكامل على جهازك - خصوصية مطلقة
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-green-300 font-medium">
                    محلي وآمن
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  >
                    {message.type === "ai" && (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-lg flex-shrink-0">
                        🧠
                      </div>
                    )}

                    <div
                      className={`max-w-[70%] ${message.type === "user" ? "order-1" : ""}`}
                    >
                      <div
                        className={`
                        p-4 rounded-2xl backdrop-blur-sm border
                        ${
                          message.type === "user"
                            ? "bg-gradient-to-br from-indigo-600/80 to-purple-600/80 border-indigo-500/30 text-white"
                            : "bg-white/10 border-white/20 text-gray-100"
                        }
                      `}
                      >
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </div>
                      </div>
                      <div
                        className={`text-xs text-gray-400 mt-1 ${message.type === "user" ? "text-right" : "text-left"}`}
                      >
                        {message.timestamp.toLocaleTimeString("ar-SA", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    {message.type === "user" && (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-lg flex-shrink-0">
                        👤
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  className="flex gap-3 justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-lg">
                    🧠
                  </div>
                  <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-cyan-400 rounded-full"
                          animate={{
                            y: [0, -8, 0],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length <= 1 && (
              <div className="px-6 py-3 border-t border-white/10">
                <p className="text-sm text-gray-400 mb-3">أسئلة سريعة:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="px-3 py-2 text-xs bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-200 hover:scale-105"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-6 border-t border-white/20">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-3"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="اسألني عن التشفير والأمان..."
                  disabled={isTyping}
                  className="flex-1 p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:bg-white/15 transition-all backdrop-blur-sm"
                />
                <NeonButton2025
                  variant="quantum"
                  size="md"
                  disabled={!inputMessage.trim() || isTyping}
                  onClick={handleSendMessage}
                >
                  {isTyping ? "⏳" : "↵"}
                </NeonButton2025>
              </form>
            </div>
          </ModernCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
