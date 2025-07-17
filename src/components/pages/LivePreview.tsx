import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useServiceMonitor from "../../hooks/useServiceMonitor";

interface ServiceDetail {
  icon: string;
  name: string;
  value: string;
}

const LivePreview: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string>("aes-cipher");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const {
    services,
    systemMetrics,
    isMonitoring,
    startService,
    stopService,
    restartService,
  } = useServiceMonitor();

  const currentService = services.find((s) => s.id === selectedService);

  const serviceDetails: ServiceDetail[] = [
    { icon: "🧠", name: "المعالج", value: "Intel Core i9-12900K" },
    { icon: "💾", name: "الذاكرة", value: "32 GB DDR5-5600" },
    { icon: "💿", name: "التخزين", value: "2TB NVMe SSD" },
    { icon: "🌐", name: "الشبكة", value: "Gigabit Ethernet" },
    { icon: "🔒", name: "الأمان", value: "TPM 2.0 + SecureBoot" },
    { icon: "⚡", name: "الطاقة", value: "850W 80+ Gold" },
    { icon: "🖥️", name: "المراقبة", value: "4K HDR Display" },
    { icon: "🔧", name: "التكوين", value: "Enterprise Grade" },
  ];

  // Helper functions
  const formatUptime = (uptime: number): string => {
    const hours = Math.floor(uptime / 3600000);
    const minutes = Math.floor((uptime % 3600000) / 60000);
    const seconds = Math.floor((uptime % 60000) / 1000);

    if (hours > 0) return `${hours}س ${minutes}د`;
    if (minutes > 0) return `${minutes}د ${seconds}ث`;
    return `${seconds}ث`;
  };

  const formatLastActivity = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `منذ ${hours} ساعة`;
    if (minutes > 0) return `منذ ${minutes} دقيقة`;
    if (seconds > 0) return `منذ ${seconds} ثانية`;
    return "نشط الآن";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "#10B981";
      case "stopped":
        return "#EF4444";
      case "starting":
        return "#F59E0B";
      default:
        return "#6B7280";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "running":
        return "يعمل";
      case "stopped":
        return "متوقف";
      case "starting":
        return "يبدأ التشغيل";
      default:
        return "غير معروف";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Effect */}
      <div
        className={
          'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-20'
        }
      ></div>

      {/* Glassmorphism Container */}
      <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl m-4 overflow-hidden shadow-2xl">
        {/* Top Toolbar */}
        <div className="h-12 bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-300">
              <span>ملف</span>
              <span>عرض</span>
              <span>خدمات</span>
              <span>أدوات</span>
              <span>مساعدة</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>KnouxCrypt™ 2025 - مراقب الخدمات المباشر</span>
          </div>
        </div>

        <div className="flex h-[calc(100vh-8rem)]">
          {/* Left Sidebar */}
          <motion.div
            className="w-80 bg-gradient-to-b from-gray-800/60 to-gray-900/60 backdrop-blur-xl border-r border-white/10 flex flex-col"
            animate={{ width: isCollapsed ? 60 : 320 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                {!isCollapsed && (
                  <motion.h2
                    className="text-lg font-semibold text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    خدمات النظام
                  </motion.h2>
                )}
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <motion.div
                    animate={{ rotate: isCollapsed ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    ←
                  </motion.div>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {!isCollapsed && (
                <div className="mb-4">
                  <div className="text-xs text-gray-400 mb-2">
                    خدمات التشفير
                  </div>
                  {services
                    .filter((s) =>
                      [
                        "aes-cipher",
                        "serpent-cipher",
                        "twofish-cipher",
                        "triple-cipher",
                      ].includes(s.id),
                    )
                    .map((service) => (
                      <motion.div
                        key={service.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          selectedService === service.id
                            ? "bg-white/15 border border-white/20"
                            : "bg-white/5 hover:bg-white/10"
                        }`}
                        onClick={() => setSelectedService(service.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">
                            {service.name}
                          </span>
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: getStatusColor(service.status),
                            }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>CPU: {service.cpu}%</span>
                          <span>{getStatusText(service.status)}</span>
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}

              {!isCollapsed && (
                <div className="mb-4">
                  <div className="text-xs text-gray-400 mb-2">
                    خدمات التحليل
                  </div>
                  {services
                    .filter((s) =>
                      ["system-analyzer", "ai-assistant"].includes(s.id),
                    )
                    .map((service) => (
                      <motion.div
                        key={service.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          selectedService === service.id
                            ? "bg-white/15 border border-white/20"
                            : "bg-white/5 hover:bg-white/10"
                        }`}
                        onClick={() => setSelectedService(service.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">
                            {service.name}
                          </span>
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: getStatusColor(service.status),
                            }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>CPU: {service.cpu}%</span>
                          <span>{getStatusText(service.status)}</span>
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Details Panel */}
          <div className="w-96 bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl border-r border-white/10 flex flex-col">
            {currentService && (
              <>
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-xl font-bold">{currentService.name}</h3>
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor:
                          getStatusColor(currentService.status) + "20",
                        color: getStatusColor(currentService.status),
                      }}
                    >
                      {getStatusText(currentService.status)}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => restartService(currentService.id)}
                    >
                      🔄 إعادة تشغيل
                    </motion.button>
                    {currentService.status === "running" ? (
                      <motion.button
                        className="flex-1 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => stopService(currentService.id)}
                      >
                        ⏹️ إيقاف
                      </motion.button>
                    ) : (
                      <motion.button
                        className="flex-1 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => startService(currentService.id)}
                      >
                        ▶️ تشغيل
                      </motion.button>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                  {/* Performance Metrics */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">
                      مقاييس الأداء
                    </h4>
                    <div className="space-y-4">
                      {currentService.metrics.map((metric, index) => (
                        <motion.div
                          key={metric.name}
                          className="space-y-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex justify-between text-sm">
                            <span className="text-white">{metric.name}</span>
                            <span className="text-gray-300">
                              {metric.value}
                              {metric.unit}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: metric.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${metric.value}%` }}
                              transition={{ duration: 1, delay: index * 0.2 }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* System Details */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">
                      تفاصيل النظام
                    </h4>
                    <div className="space-y-3">
                      {serviceDetails.map((detail, index) => (
                        <motion.div
                          key={detail.name}
                          className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <span className="text-lg">{detail.icon}</span>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-white">
                              {detail.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {detail.value}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Service Info */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">
                      معلومات الخدمة
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="text-sm font-medium text-white">
                          الوصف
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {currentService.description}
                        </div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="text-sm font-medium text-white">
                          الإصدار
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {currentService.version}
                        </div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="text-sm font-medium text-white">
                          آخر نشاط
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {currentService.lastActivity}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Main Preview Area */}
          <div className="flex-1 bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-xl flex flex-col">
            {currentService && (
              <>
                {/* Preview Header */}
                <div className="h-16 bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold">
                      عرض مباشر - {currentService.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-300">مباشر</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                      📱
                    </button>
                    <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                      🖥️
                    </button>
                    <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                      🔄
                    </button>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="flex-1 p-8 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedService}
                      className="w-full max-w-4xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="text-center space-y-6">
                        {/* Service Icon */}
                        <motion.div
                          className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl"
                          animate={{
                            rotate:
                              currentService.status === "running"
                                ? [0, 5, -5, 0]
                                : 0,
                            scale:
                              currentService.status === "starting"
                                ? [1, 1.1, 1]
                                : 1,
                          }}
                          transition={{
                            duration: 2,
                            repeat:
                              currentService.status === "running"
                                ? Infinity
                                : 0,
                            repeatType: "reverse",
                          }}
                        >
                          {currentService.type === "encryption" ? "🔐" : "🔍"}
                        </motion.div>

                        <div>
                          <h3 className="text-3xl font-bold mb-2">
                            {currentService.name}
                          </h3>
                          <p className="text-gray-300 text-lg">
                            {currentService.description}
                          </p>
                        </div>

                        {/* Live Activity Visualization */}
                        <div className="grid grid-cols-3 gap-6 mt-8">
                          {currentService.metrics.map((metric, index) => (
                            <motion.div
                              key={metric.name}
                              className="bg-white/5 rounded-xl p-6 border border-white/10"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.2 }}
                            >
                              <div
                                className="text-2xl font-bold mb-2"
                                style={{ color: metric.color }}
                              >
                                {metric.value}
                                {metric.unit}
                              </div>
                              <div className="text-sm text-gray-400">
                                {metric.name}
                              </div>
                              <motion.div
                                className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.3 }}
                              >
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: metric.color }}
                                  animate={{ width: `${metric.value}%` }}
                                  transition={{ duration: 1 }}
                                />
                              </motion.div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Status Display */}
                        <motion.div
                          className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 }}
                        >
                          <div className="flex items-center justify-center gap-3">
                            <motion.div
                              className="w-4 h-4 rounded-full"
                              style={{
                                backgroundColor: getStatusColor(
                                  currentService.status,
                                ),
                              }}
                              animate={{
                                scale:
                                  currentService.status === "running"
                                    ? [1, 1.2, 1]
                                    : 1,
                                opacity:
                                  currentService.status === "starting"
                                    ? [0.5, 1, 0.5]
                                    : 1,
                              }}
                              transition={{
                                duration: 1,
                                repeat:
                                  currentService.status !== "stopped"
                                    ? Infinity
                                    : 0,
                              }}
                            />
                            <span className="text-lg font-medium">
                              {getStatusText(currentService.status)} - آخر
                              تحديث: {currentService.lastActivity}
                            </span>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
