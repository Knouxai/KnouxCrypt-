import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SystemTrayProps {
  isVisible: boolean;
  onToggle: () => void;
}

export const SystemTray: React.FC<SystemTrayProps> = ({
  isVisible,
  onToggle,
}) => {
  const [notifications, setNotifications] = useState<number>(3);
  const [systemStatus, setSystemStatus] = useState<
    "secure" | "warning" | "danger"
  >("secure");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = () => {
    switch (systemStatus) {
      case "secure":
        return "#10B981";
      case "warning":
        return "#F59E0B";
      case "danger":
        return "#EF4444";
      default:
        return "#10B981";
    }
  };

  const getStatusText = () => {
    switch (systemStatus) {
      case "secure":
        return "النظام آمن";
      case "warning":
        return "تحذير أمني";
      case "danger":
        return "خطر أمني";
      default:
        return "النظام آمن";
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-4 left-4 z-[9999]"
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        transition={{ duration: 0.3, type: "spring" }}
      >
        <motion.div
          className="bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl p-4 min-w-[280px]"
          whileHover={{ scale: 1.02 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getStatusColor() }}
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-white font-medium text-sm">
                KnouxCrypt™
              </span>
            </div>
            <motion.button
              className="text-white/60 hover:text-white transition-colors"
              onClick={onToggle}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>
          </div>

          {/* Status */}
          <div className="mb-4">
            <div className="text-white text-lg font-bold mb-1">
              {getStatusText()}
            </div>
            <div className="text-white/60 text-xs">
              {currentTime.toLocaleTimeString("ar-SA")}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-400">98%</div>
              <div className="text-xs text-white/60">قوة التشفير</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-blue-400">
                {notifications}
              </div>
              <div className="text-xs text-white/60">تنبيهات</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <motion.button
              className="w-full text-left p-2 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white text-sm"
              whileHover={{ x: 5 }}
            >
              🔍 فحص سريع للنظام
            </motion.button>
            <motion.button
              className="w-full text-left p-2 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white text-sm"
              whileHover={{ x: 5 }}
            >
              🛡️ تشفير قرص جديد
            </motion.button>
            <motion.button
              className="w-full text-left p-2 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white text-sm"
              whileHover={{ x: 5 }}
            >
              ⚙️ إعدادات سريعة
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
