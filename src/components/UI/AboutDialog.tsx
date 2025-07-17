import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  APP_CONSTANTS,
  getSystemInfo,
  getAppConfig,
} from "../../config/AppConfig";

interface AboutDialogProps {
  isVisible: boolean;
  onClose: () => void;
}

export const AboutDialog: React.FC<AboutDialogProps> = ({
  isVisible,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"about" | "system" | "config">(
    "about",
  );
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    if (isVisible) {
      setSystemInfo(getSystemInfo());
      setConfig(getAppConfig());
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const tabs = [
    { id: "about", name: "حول البرنامج", icon: "ℹ️" },
    { id: "system", name: "معلومات النظام", icon: "💻" },
    { id: "config", name: "الإعدادات", icon: "⚙️" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <motion.div
                className="text-5xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                🔐
              </motion.div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {APP_CONSTANTS.NAME}
                </h2>
                <p className="text-gray-400 mt-1">
                  {APP_CONSTANTS.DESCRIPTION}
                </p>
              </div>
            </div>
            <motion.button
              className="text-white/60 hover:text-white text-2xl"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-white/5 p-2 rounded-2xl">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                className={`flex-1 flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setActiveTab(tab.id as any)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="font-medium">{tab.name}</span>
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-indigo-500/20"
                    layoutId="activeAboutTab"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Content */}
          <div className="min-h-[400px]">
            {activeTab === "about" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">🛡️</div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {APP_CONSTANTS.FULL_NAME}
                  </h3>
                  <p className="text-gray-400 text-lg">
                    الإصدار {config?.version} - البناء {config?.buildNumber}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      🏢 معلومات الشركة
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-400">المطور:</span>{" "}
                        <span className="text-white">
                          {APP_CONSTANTS.VENDOR}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-400">الموقع:</span>{" "}
                        <span className="text-blue-400">
                          {APP_CONSTANTS.WEBSITE}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-400">الدعم:</span>{" "}
                        <span className="text-blue-400">
                          {APP_CONSTANTS.SUPPORT_EMAIL}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-400">حقوق النشر:</span>{" "}
                        <span className="text-white">
                          {APP_CONSTANTS.COPYRIGHT}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      🔒 خوارزميات التشفير
                    </h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(APP_CONSTANTS.ALGORITHMS).map(
                        ([key, algo]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-400">{algo.name}:</span>
                            <span className="text-green-400">
                              {algo.keySize}-bit
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    ✅ الميزات المفعلة
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    {config?.features &&
                      Object.entries(config.features).map(([key, enabled]) => (
                        <div key={key} className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${enabled ? "bg-green-400" : "bg-gray-400"}`}
                          />
                          <span
                            className={enabled ? "text-white" : "text-gray-400"}
                          >
                            {key === "systemTray" && "صينية النظام"}
                            {key === "keyboardShortcuts" && "اختصارات المفاتيح"}
                            {key === "aiAssistant" && "المساعد الذكي"}
                            {key === "autoEncryption" && "التشفير التلقائي"}
                            {key === "quantumResistance" &&
                              "مقاومة الكمبيوتر الكمي"}
                            {key === "realTimeMonitoring" && "المراقبة الفورية"}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "system" && systemInfo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      💻 معلومات النظام
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">المنصة:</span>
                        <span className="text-white">
                          {systemInfo.platform}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">اللغة:</span>
                        <span className="text-white">
                          {systemInfo.language}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">المعالجات:</span>
                        <span className="text-white">
                          {systemInfo.hardwareConcurrency} نواة
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">الذاكرة:</span>
                        <span className="text-white">
                          {systemInfo.memory} GB
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">الاتصال:</span>
                        <span
                          className={`${systemInfo.onLine ? "text-green-400" : "text-red-400"}`}
                        >
                          {systemInfo.onLine ? "متصل" : "غير متصل"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      📊 إحصائيات الأداء
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">استخدام المعالج</span>
                          <span className="text-green-400">23%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-400 h-2 rounded-full"
                            style={{ width: "23%" }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">استخدام الذاكرة</span>
                          <span className="text-blue-400">67%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-400 h-2 rounded-full"
                            style={{ width: "67%" }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">مستوى الأمان</span>
                          <span className="text-purple-400">98%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-purple-400 h-2 rounded-full"
                            style={{ width: "98%" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    🌐 معلومات المتصفح
                  </h4>
                  <div className="text-xs text-gray-400 font-mono break-all">
                    {systemInfo.userAgent}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "config" && config && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      🔒 إعدادات الأمان
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">مستوى التشفير:</span>
                        <span className="text-green-400">
                          {config.security?.encryptionLevel}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">القفل التلقائي:</span>
                        <span
                          className={
                            config.security?.autoLock
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {config.security?.autoLock ? "مفعل" : "معطل"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">مهلة القفل:</span>
                        <span className="text-white">
                          {config.security?.autoLockTimeout} دقيقة
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">سجل التدقيق:</span>
                        <span
                          className={
                            config.security?.auditLogging
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {config.security?.auditLogging ? "مفعل" : "معطل"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      🎨 إعدادات الواجهة
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">السمة:</span>
                        <span className="text-white">{config.ui?.theme}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">اللغة:</span>
                        <span className="text-white">
                          {config.ui?.language}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">الحركات:</span>
                        <span
                          className={
                            config.ui?.animations
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {config.ui?.animations ? "مفعل" : "معطل"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">الإشعارات:</span>
                        <span
                          className={
                            config.ui?.notifications
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {config.ui?.notifications ? "مفعل" : "معطل"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    ⚡ إعدادات الأداء
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">تسريع الأجهزة:</span>
                      <span
                        className={
                          config.performance?.enableHardwareAcceleration
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        {config.performance?.enableHardwareAcceleration
                          ? "مفعل"
                          : "معطل"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">العمليات المتزامنة:</span>
                      <span className="text-white">
                        {config.performance?.maxConcurrentOperations}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">حجم التخزين المؤقت:</span>
                      <span className="text-white">
                        {config.performance?.cacheSize} MB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        المعالجة في الخلفية:
                      </span>
                      <span
                        className={
                          config.performance?.backgroundProcessing
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        {config.performance?.backgroundProcessing
                          ? "مفعل"
                          : "معطل"}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <span>
                وقت النظام:{" "}
                {systemInfo?.timestamp &&
                  new Date(systemInfo.timestamp).toLocaleString("ar-SA")}
              </span>
              <span>•</span>
              <span>البيئة: {config?.environment}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
