import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface QuickActionCard {
  title: string;
  description: string;
  subtitle: string;
  icon: string;
  path: string;
  color: string;
  gradient: string;
  status: "active" | "idle" | "processing";
  stats?: {
    label: string;
    value: string;
  };
}

interface SecurityMetric {
  id: string;
  label: string;
  value: number;
  maxValue: number;
  color: string;
  icon: string;
  trend: "up" | "down" | "stable";
  status: "excellent" | "good" | "warning" | "critical";
}

const quickActions: QuickActionCard[] = [
  {
    title: "مختبر الخوارزميات",
    description: "اختبر أقوى خوارزميات التشفير",
    subtitle: "4 خوارزميات متقدمة",
    icon: "🔬",
    path: "/algorithms",
    color: "#6366F1",
    gradient: "from-indigo-500 to-purple-600",
    status: "active",
    stats: { label: "خوارزميات", value: "4" },
  },
  {
    title: "إدارة الأقراص الذكية",
    description: "تشفير متقدم للأقراص والـ USB",
    subtitle: "حماية عسكرية",
    icon: "🛡️",
    path: "/disk-manager",
    color: "#10B981",
    gradient: "from-emerald-500 to-teal-600",
    status: "active",
    stats: { label: "أقراص", value: "5" },
  },
  {
    title: "تشفير النظام الكامل",
    description: "حماية شاملة للقرص الصلب",
    subtitle: "مقاوم كمي",
    icon: "🌐",
    path: "/system-encryption",
    color: "#F59E0B",
    gradient: "from-amber-500 to-orange-600",
    status: "idle",
    stats: { label: "حماية", value: "98%" },
  },
  {
    title: "المساعد الذكي AI",
    description: "توصيات ذكية للأمان",
    subtitle: "مدعوم بالذكاء الاصطناعي",
    icon: "🧠",
    path: "/ai-assistant",
    color: "#8B5CF6",
    gradient: "from-violet-500 to-purple-600",
    status: "active",
    stats: { label: "توصيات", value: "12" },
  },
];

const securityMetrics: SecurityMetric[] = [
  {
    id: "encryption",
    label: "قوة التشفير",
    value: 98,
    maxValue: 100,
    color: "#10B981",
    icon: "🔐",
    trend: "up",
    status: "excellent",
  },
  {
    id: "quantum-resistance",
    label: "مقاومة الكمبيوتر الكمي",
    value: 95,
    maxValue: 100,
    color: "#6366F1",
    icon: "⚛️",
    trend: "stable",
    status: "excellent",
  },
  {
    id: "performance",
    label: "أداء النظام",
    value: 87,
    maxValue: 100,
    color: "#F59E0B",
    icon: "⚡",
    trend: "up",
    status: "good",
  },
  {
    id: "threat-detection",
    label: "كشف التهديدات",
    value: 92,
    maxValue: 100,
    color: "#EF4444",
    icon: "🎯",
    trend: "up",
    status: "excellent",
  },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeMetric, setActiveMetric] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const loadTimer = setTimeout(() => setIsLoading(false), 1500);
    return () => {
      clearInterval(timer);
      clearTimeout(loadTimer);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleString("ar-SA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <motion.div
          className="flex items-center justify-center min-h-[60vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center">
            <motion.div
              className="inline-block text-6xl mb-4"
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity },
              }}
            >
              🔐
            </motion.div>
            <motion.h2
              className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              تحميل نظام KnouxCrypt™
            </motion.h2>
            <motion.p
              className="text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              جاري تهيئة النظام المتقدم...
            </motion.p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header Section */}
      <motion.div
        className="relative overflow-hidden rounded-3xl mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm" />
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 space-x-reverse">
              <motion.div
                className="text-6xl"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                🛡️
              </motion.div>
              <div>
                <motion.h1
                  className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  مرحباً بك في KnouxCrypt™ 2025
                </motion.h1>
                <motion.p
                  className="text-xl text-gray-300 mb-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  نظام التشفير العسكري المتقدم
                </motion.p>
                <motion.p
                  className="text-sm text-gray-400"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {formatTime(currentTime)}
                </motion.p>
              </div>
            </div>
            <motion.div
              className="text-right"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-sm font-medium mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                نظام محمي بالكامل
              </div>
              <div className="text-sm text-gray-400">مستوى الأمان: عسكري</div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="dashboard-content">
        <motion.div
          className="welcome-section"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="glass-card welcome-card">
            <div className="welcome-header">
              <div className="welcome-icon">🛡️</div>
              <div className="welcome-text">
                <h2>مرحباً بك في KnouxCrypt™</h2>
                <p>أقوى نظام تشفير متقدم مع تقنيات الذكاء الاصطناعي</p>
              </div>
            </div>
            <div className="security-status">
              <div className="status-item">
                <span className="status-label">حالة الأمان:</span>
                <span className="status-value secure">محمي بالكامل</span>
              </div>
              <div className="status-item">
                <span className="status-label">الأقراص المشفرة:</span>
                <span className="status-value">3 أقراص</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="quick-actions-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3>الإجراءات السريعة</h3>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.path}
                className="glass-card quick-action-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(action.path)}
              >
                <div className="action-icon" style={{ color: action.color }}>
                  {action.icon}
                </div>
                <div className="action-content">
                  <h4>{action.title}</h4>
                  <p>{action.description}</p>
                </div>
                <div className="action-arrow">→</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="system-overview"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="glass-card overview-card">
            <h3>نظرة عامة على النظام</h3>
            <div className="overview-stats">
              <div className="stat-item">
                <div className="stat-icon">💿</div>
                <div className="stat-info">
                  <span className="stat-value">5</span>
                  <span className="stat-label">أقراص مكتشفة</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">🔒</div>
                <div className="stat-info">
                  <span className="stat-value">3</span>
                  <span className="stat-label">أقراص مشفرة</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">🧠</div>
                <div className="stat-info">
                  <span className="stat-value">AI</span>
                  <span className="stat-label">مساعد نشط</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">⚡</div>
                <div className="stat-info">
                  <span className="stat-value">AES-256</span>
                  <span className="stat-label">التشفير الافتراضي</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
