import React, { useState } from "react";
import { motion } from "framer-motion";
import { LocalAIAssistant } from "../UI/LocalAIAssistant";
import { ModernCard } from "../UI/ModernCard";
import { NeonButton2025 } from "../UI/NeonButton2025";

export const AIAssistant: React.FC = () => {
  const [isAIOpen, setIsAIOpen] = useState(false);

  const features = [
    {
      icon: "🧠",
      title: "ذكاء اصطناعي محلي",
      description: "يعمل بالكامل على جهازك بدون إرسال بيانات خارجية",
      color: "#6366F1",
    },
    {
      icon: "🔒",
      title: "خصوصية مطلقة",
      description: "لا توجد اتصالات خارجية - بياناتك تبقى آمنة",
      color: "#10B981",
    },
    {
      icon: "⚡",
      title: "استجابة فورية",
      description: "إجابات سريعة ودقيقة حول التشفير والأمان",
      color: "#F59E0B",
    },
    {
      icon: "📚",
      title: "قاعدة معرفة شاملة",
      description: "معلومات متخصصة في خوارزميات التشفير المتقدمة",
      color: "#8B5CF6",
    },
  ];

  const expertiseAreas = [
    {
      category: "خوارزميات التشفير",
      topics: ["AES-256", "Serpent", "Twofish", "التشفير الثلاثي"],
      icon: "🔐",
    },
    {
      category: "أمان كلمات المرور",
      topics: ["إنشاء كلمات مرور قوية", "إدارة المفاتيح", "المصادقة الثنائية"],
      icon: "🔑",
    },
    {
      category: "حماية البيانات",
      topics: ["تشفير الملفات", "تأمين الأقراص", "النسخ الاحتياطية الآمنة"],
      icon: "🛡️",
    },
    {
      category: "أفضل الممارسات",
      topics: ["سياسات الأمان", "كشف التهديدات", "الاستجابة للحوادث"],
      icon: "⚔️",
    },
  ];

  return (
    <div className="page-container">
      {/* Enhanced Header */}
      <motion.div
        className="relative overflow-hidden rounded-3xl mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 backdrop-blur-sm" />
        <div className="relative p-8 text-center">
          <motion.div
            className="text-6xl mb-4"
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🧠
          </motion.div>
          <motion.h1
            className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            المساعد الذكي المحلي
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            ذكاء اصطناعي متخصص في التشفير يعمل بالكامل على جهازك
          </motion.p>
          <motion.div
            className="flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-sm font-medium">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse inline-block" />
              خصوصية مطلقة
            </div>
            <div className="px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium">
              محلي وآمن
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Launch Assistant */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ModernCard
            variant="gradient"
            glow
            className="text-center h-full flex flex-col justify-center"
          >
            <motion.div
              className="text-8xl mb-6"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              🚀
            </motion.div>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ابدأ المحادثة
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              اسأل أي سؤال حول التشفير والأمان واحصل على إجابات دقيقة ومتخصصة من
              المساعد الذكي المحلي
            </p>
            <NeonButton2025
              variant="quantum"
              size="lg"
              onClick={() => setIsAIOpen(true)}
              pulse
              className="w-full"
            >
              <span className="mr-2">🧠</span>
              فتح المساعد الذكي
            </NeonButton2025>
          </ModernCard>
        </motion.div>

        {/* Features */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ModernCard variant="hologram">
            <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              ✨ المميزات الفريدة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <h4 className="font-semibold text-white">
                      {feature.title}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </ModernCard>
        </motion.div>
      </div>

      {/* Expertise Areas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          🎯 مجالات الخبرة
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {expertiseAreas.map((area, index) => (
            <ModernCard
              key={area.category}
              variant="gradient"
              delay={0.7 + index * 0.1}
              className="text-center"
            >
              <motion.div
                className="text-4xl mb-4"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {area.icon}
              </motion.div>
              <h4 className="text-lg font-bold text-white mb-3">
                {area.category}
              </h4>
              <div className="space-y-2">
                {area.topics.map((topic, topicIndex) => (
                  <motion.div
                    key={topicIndex}
                    className="text-sm text-gray-300 py-1 px-3 rounded-lg bg-white/5 border border-white/10"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.8 + index * 0.1 + topicIndex * 0.05,
                    }}
                  >
                    {topic}
                  </motion.div>
                ))}
              </div>
            </ModernCard>
          ))}
        </div>
      </motion.div>

      {/* Quick Start Guide */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <ModernCard variant="neon">
          <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            🚀 دليل البدء السريع
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="text-3xl mb-3">1️⃣</div>
              <h4 className="font-semibold text-white mb-2">افتح المساعد</h4>
              <p className="text-sm text-gray-300">
                اضغط على زر "فتح المساعد الذكي" أو الزر في الشريط الجانبي
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="text-3xl mb-3">2️⃣</div>
              <h4 className="font-semibold text-white mb-2">اسأل سؤالك</h4>
              <p className="text-sm text-gray-300">
                اكتب أي سؤال حول التشفير أو الأمان أو استخدم الأسئلة السريعة
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="text-3xl mb-3">3️⃣</div>
              <h4 className="font-semibold text-white mb-2">احصل على إجابة</h4>
              <p className="text-sm text-gray-300">
                ستحصل على إجابة مفصلة ودقيقة من قاعدة المعرفة المحلية
              </p>
            </motion.div>
          </div>
        </ModernCard>
      </motion.div>

      {/* Local AI Assistant Component */}
      <LocalAIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
};
