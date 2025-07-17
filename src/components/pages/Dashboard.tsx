import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface QuickActionCard {
  title: string;
  description: string;
  icon: string;
  path: string;
  color: string;
}

const quickActions: QuickActionCard[] = [
  {
    title: "إدارة الأقراص",
    description: "تشفير الأقراص الخارجية والـ USB",
    icon: "🧩",
    path: "/disk-manager",
    color: "#4F46E5",
  },
  {
    title: "تشفير النظام",
    description: "تشفير كامل للقرص الصلب",
    icon: "💻",
    path: "/system-encryption",
    color: "#059669",
  },
  {
    title: "الخوارزميات",
    description: "AES-256, Serpent, Twofish",
    icon: "🔐",
    path: "/algorithms",
    color: "#DC2626",
  },
  {
    title: "المساعد الذكي",
    description: "توصيات AI للتشفير",
    icon: "🧠",
    path: "/ai-assistant",
    color: "#7C3AED",
  },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>لوحة المعلومات الرئيسية</h1>
        <p>إدارة شاملة لجميع عمليات التشفير</p>
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
