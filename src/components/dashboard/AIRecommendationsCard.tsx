import React from "react";
import { motion } from "framer-motion";
import GlassCard from "../UI/GlassCard";
import NeonText from "../UI/NeonText";
import NeonButton from "../UI/NeonButton";
import ProgressRing from "../UI/ProgressRing";
import { useSecurity, AIRecommendation } from "../../context/SecurityContext";

const AIRecommendationsCard: React.FC = () => {
  const {
    aiRecommendations,
    isLoadingAI,
    selectedDisk,
    getAIRecommendations,
    updateEncryptionSettings,
  } = useSecurity();

  // تطبيق التوصيات
  const applyRecommendations = () => {
    if (!aiRecommendations) return;

    updateEncryptionSettings({
      algorithm: aiRecommendations.algorithm as any,
      hashAlgorithm: "SHA-512", // افتراضي
      quickFormat: false,
    });
  };

  // رموز الثقة
  const getConfidenceIcon = (score: number) => {
    if (score >= 0.8) return "🟢";
    if (score >= 0.6) return "🟡";
    return "🔴";
  };

  // رموز مستوى الأمان
  const getSecurityLevelIcon = (level: string) => {
    switch (level) {
      case "military":
        return "🔰";
      case "high":
        return "🔒";
      case "basic":
        return "🛡️";
      default:
        return "⚡";
    }
  };

  // ألوان مستوى الأمان
  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case "military":
        return "text-red-400";
      case "high":
        return "text-green-400";
      case "basic":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <GlassCard className="flex flex-col h-full" padding="medium">
      <div className="flex items-center justify-between mb-6">
        <NeonText size="large" className="text-2xl" gradient>
          🧠 توصيات الذكاء الاصطناعي
        </NeonText>
        <NeonButton
          size="small"
          variant="secondary"
          onClick={() => selectedDisk && getAIRecommendations(selectedDisk)}
          disabled={!selectedDisk || isLoadingAI}
          icon="🔄"
        >
          تحليل
        </NeonButton>
      </div>

      <div className="flex-grow">
        {/* حالة التحميل */}
        {isLoadingAI && (
          <motion.div
            className="flex flex-col items-center justify-center h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ProgressRing progress={75} size={80} />
            <NeonText size="normal" className="mt-4">
              جاري التحليل...
            </NeonText>
            <p className="text-gray-400 text-sm mt-2">تحليل القرص والنظام</p>
          </motion.div>
        )}

        {/* لا يوجد قرص محدد */}
        {!selectedDisk && !isLoadingAI && (
          <motion.div
            className="flex flex-col items-center justify-center h-full text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-6xl mb-4">🤖</span>
            <NeonText size="normal" className="mb-2">
              لا يوجد قرص محدد
            </NeonText>
            <p className="text-gray-400 text-sm">
              اختر قرصاً للحصول على توصيات ذكية
            </p>
          </motion.div>
        )}

        {/* عرض التوصيات */}
        {!isLoadingAI && selectedDisk && aiRecommendations && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* معلومات القرص المحدد */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <h4 className="text-gray-300 font-medium mb-2">القرص المحلل:</h4>
              <p className="text-white font-bold">
                {selectedDisk.caption} ({selectedDisk.volumeName || "بدون اسم"})
              </p>
              <p className="text-gray-400 text-sm">
                {selectedDisk.fileSystem} -{" "}
                {(selectedDisk.size / 1024 ** 3).toFixed(1)} GB
              </p>
            </div>

            {/* نتائج التحليل */}
            <div className="grid grid-cols-2 gap-4">
              {/* الخوارزمية المقترحة */}
              <div className="p-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">🔐</span>
                  <h5 className="text-gray-300 font-medium">الخوارزمية</h5>
                </div>
                <p className="text-white font-bold text-lg">
                  {aiRecommendations.algorithm}
                </p>
              </div>

              {/* قوة كلمة المرور */}
              <div className="p-4 bg-gradient-to-br from-green-500/20 to-teal-500/20 border border-green-400/30 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">🔑</span>
                  <h5 className="text-gray-300 font-medium">قوة كلمة المرور</h5>
                </div>
                <div className="flex items-center">
                  <ProgressRing
                    progress={aiRecommendations.passwordStrengthScore}
                    size={40}
                    strokeWidth={4}
                    color={
                      aiRecommendations.passwordStrengthScore >= 80
                        ? "#10B981"
                        : aiRecommendations.passwordStrengthScore >= 60
                          ? "#F59E0B"
                          : "#EF4444"
                    }
                    showPercentage={false}
                  />
                  <span className="ml-3 text-white font-bold">
                    {aiRecommendations.passwordStrengthScore}%
                  </span>
                </div>
              </div>

              {/* مستوى الأمان */}
              <div className="p-4 bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-400/30 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">
                    {getSecurityLevelIcon(aiRecommendations.securityLevel)}
                  </span>
                  <h5 className="text-gray-300 font-medium">مستوى الأمان</h5>
                </div>
                <p
                  className={`font-bold text-lg ${getSecurityLevelColor(aiRecommendations.securityLevel)}`}
                >
                  {aiRecommendations.securityLevel === "military"
                    ? "عسكري"
                    : aiRecommendations.securityLevel === "high"
                      ? "عالي"
                      : aiRecommendations.securityLevel === "basic"
                        ? "أساسي"
                        : "غير معروف"}
                </p>
              </div>

              {/* ثقة الذكاء الاصطناعي */}
              <div className="p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">
                    {getConfidenceIcon(aiRecommendations.confidenceScore)}
                  </span>
                  <h5 className="text-gray-300 font-medium">ثقة AI</h5>
                </div>
                <p className="text-white font-bold text-lg">
                  {Math.round(aiRecommendations.confidenceScore * 100)}%
                </p>
              </div>
            </div>

            {/* التوصيات الإضافية */}
            <div className="space-y-3">
              {aiRecommendations.suggestUsbKey && (
                <motion.div
                  className="p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg flex items-center"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="text-xl mr-3">💾</span>
                  <div>
                    <p className="text-blue-300 font-medium">
                      مفتاح USB موصى به
                    </p>
                    <p className="text-gray-400 text-sm">
                      استخدم مفتاح USB لحماية إضافية
                    </p>
                  </div>
                </motion.div>
              )}

              {aiRecommendations.suggestHiddenVolume && (
                <motion.div
                  className="p-3 bg-purple-500/10 border border-purple-400/30 rounded-lg flex items-center"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-xl mr-3">👁️‍🗨️</span>
                  <div>
                    <p className="text-purple-300 font-medium">حجم مخفي</p>
                    <p className="text-gray-400 text-sm">
                      إنشاء حجم مخفي لخصوصية إضافية
                    </p>
                  </div>
                </motion.div>
              )}

              {aiRecommendations.performanceImpact && (
                <motion.div
                  className={`p-3 rounded-lg flex items-center ${
                    aiRecommendations.performanceImpact === "low"
                      ? "bg-green-500/10 border-green-400/30"
                      : aiRecommendations.performanceImpact === "medium"
                        ? "bg-yellow-500/10 border-yellow-400/30"
                        : "bg-red-500/10 border-red-400/30"
                  }`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-xl mr-3">⚡</span>
                  <div>
                    <p
                      className={`font-medium ${
                        aiRecommendations.performanceImpact === "low"
                          ? "text-green-300"
                          : aiRecommendations.performanceImpact === "medium"
                            ? "text-yellow-300"
                            : "text-red-300"
                      }`}
                    >
                      تأثير الأداء:{" "}
                      {aiRecommendations.performanceImpact === "low"
                        ? "منخفض"
                        : aiRecommendations.performanceImpact === "medium"
                          ? "متوسط"
                          : "عالي"}
                    </p>
                    <p className="text-gray-400 text-sm">
                      التأثير المتوقع على سرعة النظام
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* شرح التوصيات */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <h5 className="text-gray-300 font-medium mb-2 flex items-center">
                <span className="text-xl mr-2">💡</span>
                تفسير التوصيات
              </h5>
              <p className="text-gray-400 text-sm leading-relaxed">
                {aiRecommendations.explanation}
              </p>
            </div>

            {/* أزرار العمل */}
            <div className="flex space-x-3 space-x-reverse">
              <NeonButton onClick={applyRecommendations} icon="✅" fullWidth>
                تطبيق التوصيات
              </NeonButton>
              <NeonButton
                onClick={() =>
                  selectedDisk && getAIRecommendations(selectedDisk)
                }
                variant="secondary"
                icon="🔄"
                fullWidth
              >
                تحليل مجدداً
              </NeonButton>
            </div>
          </motion.div>
        )}

        {/* لا توجد توصيات */}
        {!isLoadingAI && selectedDisk && !aiRecommendations && (
          <motion.div
            className="flex flex-col items-center justify-center h-full text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-6xl mb-4">🤔</span>
            <NeonText size="normal" className="mb-2">
              لا توجد توصيات
            </NeonText>
            <p className="text-gray-400 text-sm mb-4">
              اضغط على "تحليل" للحصول على توصيات ذكية
            </p>
            <NeonButton
              onClick={() => selectedDisk && getAIRecommendations(selectedDisk)}
              icon="🧠"
            >
              بدء التحليل
            </NeonButton>
          </motion.div>
        )}
      </div>
    </GlassCard>
  );
};

export default AIRecommendationsCard;
