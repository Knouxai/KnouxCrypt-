import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSecurity } from "../../context/SecurityContext";

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export const AIAssistant: React.FC = () => {
  const { aiRecommendations, aiAnalysisForDisk } = useSecurity();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content:
        "مرحباً! أنا مساعدك الذكي للتشفير. يمكنني مساعدتك في:\n\n• تحليل الأقراص وتقديم توصيات التشفير\n• اختيار أفضل خوارزميات التشفير\n• تقييم قوة كلمات المرور\n• توفير نصائح الأمان\n\nكيف يمكنني مساعدتك اليوم؟",
      timestamp: new Date(),
      suggestions: [
        "تحليل أقراصي",
        "ما هي أفضل خوارزمية تشفير؟",
        "كيف أنشئ كلمة مرور قوية؟",
        "نصائح للأمان",
      ],
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // محاكاة رد الـ AI
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (
    userMessage: string,
  ): { content: string; suggestions?: string[] } => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("تحليل") || lowerMessage.includes("أقراص")) {
      return {
        content:
          "سأقوم بتحليل أقراصك الآن...\n\n🔍 **نتائج التحليل:**\n\n• **القرص C:** SSD - يُنصح بـ AES-256\n• **القرص D:** HDD - يُنصح بـ Serpent للأمان الإضافي\n• **USB المتصل:** يُنصح بتشفير VeraCrypt\n\n💡 **التوصيات:**\n- استخدم كلمة مرور قوية (12+ حرف)\n- فعّل النسخ الاحتياطي المشفر\n- أنشئ مجلد مخفي للملفات الحساسة",
        suggestions: [
          "كيف أنشئ كلمة مرور قوية؟",
          "ما هو الفرق بين AES و Serpent؟",
          "كيف أنشئ مجلد مخفي؟",
        ],
      };
    }

    if (lowerMessage.includes("خوارزمية") || lowerMessage.includes("أفضل")) {
      return {
        content:
          "🔐 **أفضل خوارزميات التشفير:**\n\n• **AES-256:** الأكثر توازناً (أداء + أمان)\n• **Serpent:** أمان إضافي مع أداء متوسط\n• **Twofish:** سرعة عالية مع أمان جيد\n• **AES-Serpent-Twofish:** الحماية القصوى\n\n**توصيتي:** ابدأ بـ AES-256 للاستخدام العام، واستخدم Serpent للبيانات الحساسة جداً.",
        suggestions: [
          "ما هي مواصفات AES-256؟",
          "متى أستخدم التشفير الثلاثي؟",
          "كيف أختار الخوارزمية المناسبة؟",
        ],
      };
    }

    if (
      lowerMessage.includes("كلمة مرور") ||
      lowerMessage.includes("password")
    ) {
      return {
        content:
          "🔑 **دليل كلمات المرور القوية:**\n\n**المعايير الأساسية:**\n• 12+ حرف على الأقل\n• أحرف كبيرة وصغيرة\n• أرقام ورموز خاصة\n• تجنب الكلمات المعروفة\n\n**أمثلة قوية:**\n• `My$ecur3Pa$$w0rd2024!`\n• `Crypto#Is&Secure789`\n\n**نصائح إضافية:**\n• استخدم مدير كلمات مرور\n• فعّل المصادقة الثنائية\n• غيّر كلمات المرور دورياً",
        suggestions: [
          "كيف أختبر قوة كلمة المرور؟",
          "ما هو أفضل مدير كلمات مرور؟",
          "كيف أفعل المصادقة الثنائية؟",
        ],
      };
    }

    if (lowerMessage.includes("نصائح") || lowerMessage.includes("أمان")) {
      return {
        content:
          "🛡️ **نصائح الأمان المتقدمة:**\n\n**1. طبقات الحماية:**\n• تشفير القرص الكامل\n• مجلدات مخفية للملفات الحساسة\n• نسخ احتياطية مشفرة\n\n**2. السلوكيات الآمنة:**\n• تحديثات النظام المنتظمة\n• تجنب الواي فاي العام للمعاملات الحساسة\n• فحص البرامج قبل التثبيت\n\n**3. التكنولوجيا:**\n• استخدم VPN موثوق\n• فعّل جدار الحماية\n• استخدم برامج مكافحة البرمجيات الخبيثة",
        suggestions: [
          "كيف أنشئ نسخة احتياطية مشفرة؟",
          "ما هو أفضل VPN؟",
          "كيف أتحقق من أمان شبكتي؟",
        ],
      };
    }

    // رد افتراضي
    return {
      content:
        "أفهم سؤالك، ولكنني متخصص في مجال التشفير والأمان السيبراني. يمكنني مساعدتك في:\n\n• تحليل وتشفير الأقراص\n• اختيار خوارزميات التشفير\n• تقوية كلمات المرور\n• نصائح الأمان الرقمي\n\nهل تريد معرفة المزيد عن أي من هذه المواضيع؟",
      suggestions: [
        "تحليل أقراصي",
        "أفضل خوارزميات التشفير",
        "كيف أنشئ كلمة مرور قوية؟",
        "نصائح الأمان",
      ],
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="page-container">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>المساعد الذكي للتشفير</h1>
        <p>مساعد AI متخصص في التشفير والأمان السيبراني</p>
      </motion.div>

      <div className="ai-assistant-content">
        {/* Chat Container */}
        <motion.div
          className="glass-card chat-container"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="chat-header">
            <div className="ai-avatar">🧠</div>
            <div className="ai-info">
              <h3>KnouxCrypt AI</h3>
              <span className="status online">متصل ونشط</span>
            </div>
            <button
              className="analyze-btn"
              onClick={requestAIAnalysis}
              disabled={aiRecommendations.analyzing}
            >
              {aiRecommendations.analyzing
                ? "🔄 جاري التحليل..."
                : "🔍 تحليل سريع"}
            </button>
          </div>

          <div className="chat-messages">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`message ${message.type}`}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="message-avatar">
                    {message.type === "ai" ? "🧠" : "👤"}
                  </div>
                  <div className="message-content">
                    <div className="message-text">
                      {message.content.split("\n").map((line, index) => (
                        <React.Fragment key={index}>
                          {line}
                          {index < message.content.split("\n").length - 1 && (
                            <br />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="message-time">
                      {message.timestamp.toLocaleTimeString("ar", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    {message.suggestions && (
                      <div className="message-suggestions">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            className="suggestion-chip"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                className="message ai typing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="message-avatar">🧠</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputMessage);
              }}
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="اكتب سؤالك عن التشفير والأمان..."
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="send-btn"
              >
                ↵
              </button>
            </form>
          </div>
        </motion.div>

        {/* AI Capabilities */}
        <motion.div
          className="glass-card capabilities-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3>قدرات المساعد الذكي</h3>
          <div className="capabilities-list">
            <div className="capability-item">
              <div className="capability-icon">🔍</div>
              <div className="capability-info">
                <h4>تحليل الأقراص</h4>
                <p>فحص ذكي للأقراص وتقديم توصيات مخصصة</p>
              </div>
            </div>
            <div className="capability-item">
              <div className="capability-icon">🎯</div>
              <div className="capability-info">
                <h4>اختيار الخوارزميات</h4>
                <p>توصيات مبنية على نوع البيانات والاستخدام</p>
              </div>
            </div>
            <div className="capability-item">
              <div className="capability-icon">🔑</div>
              <div className="capability-info">
                <h4>تقييم كلمات المرور</h4>
                <p>فحص قوة كلمات المرور وتقديم تحسينات</p>
              </div>
            </div>
            <div className="capability-item">
              <div className="capability-icon">🛡️</div>
              <div className="capability-info">
                <h4>استشارات الأمان</h4>
                <p>نصائح متقدمة لحماية البيانات والخصوصية</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
