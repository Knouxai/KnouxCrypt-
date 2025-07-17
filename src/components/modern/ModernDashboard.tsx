import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LivePreviewQuickAccess from "../UI/LivePreviewQuickAccess";

interface SecurityMetric {
  id: string;
  name: string;
  value: number;
  maxValue: number;
  unit: string;
  status: "excellent" | "good" | "warning" | "critical";
  trend: "up" | "down" | "stable";
  icon: string;
  color: string;
}

interface EncryptionOperation {
  id: string;
  type: "encrypt" | "decrypt" | "scan";
  fileName: string;
  progress: number;
  status: "active" | "completed" | "paused" | "error";
  startTime: Date;
  algorithm: string;
}

interface ThreatAlert {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: Date;
  resolved: boolean;
}

export const ModernDashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([
    {
      id: "encryption-strength",
      name: "قوة التشفير",
      value: 98,
      maxValue: 100,
      unit: "%",
      status: "excellent",
      trend: "up",
      icon: "🔐",
      color: "#10B981",
    },
    {
      id: "system-performance",
      name: "أداء النظام",
      value: 87,
      maxValue: 100,
      unit: "%",
      status: "good",
      trend: "stable",
      icon: "⚡",
      color: "#3B82F6",
    },
    {
      id: "quantum-resistance",
      name: "مقاومة الكمبيوتر الكمي",
      value: 95,
      maxValue: 100,
      unit: "%",
      status: "excellent",
      trend: "up",
      icon: "⚛️",
      color: "#8B5CF6",
    },
    {
      id: "threat-detection",
      name: "كشف التهديدات",
      value: 92,
      maxValue: 100,
      unit: "%",
      status: "excellent",
      trend: "up",
      icon: "🛡️",
      color: "#06B6D4",
    },
  ]);

  const [activeOperations, setActiveOperations] = useState<
    EncryptionOperation[]
  >([
    {
      id: "op1",
      type: "encrypt",
      fileName: "مستندات_سرية.pdf",
      progress: 73,
      status: "active",
      startTime: new Date(Date.now() - 180000),
      algorithm: "AES-256",
    },
    {
      id: "op2",
      type: "scan",
      fileName: "فحص النظام الكامل",
      progress: 45,
      status: "active",
      startTime: new Date(Date.now() - 90000),
      algorithm: "Multi-Layer",
    },
  ]);

  const [recentAlerts, setRecentAlerts] = useState<ThreatAlert[]>([
    {
      id: "alert1",
      title: "محاولة وصول مشبوهة",
      description: "تم اكتشاف محاولة وصول غير مصرح بها للملفات المشفرة",
      severity: "high",
      timestamp: new Date(Date.now() - 300000),
      resolved: false,
    },
    {
      id: "alert2",
      title: "تحديث أمني متاح",
      description: "يتوفر تحديث أمني جديد لتحسين خوارزميات التشفير",
      severity: "medium",
      timestamp: new Date(Date.now() - 1800000),
      resolved: false,
    },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "#10B981";
      case "good":
        return "#3B82F6";
      case "warning":
        return "#F59E0B";
      case "critical":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "#10B981";
      case "medium":
        return "#F59E0B";
      case "high":
        return "#EF4444";
      case "critical":
        return "#7C2D12";
      default:
        return "#6B7280";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString("ar-SA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (startTime: Date) => {
    const duration = Date.now() - startTime.getTime();
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="modern-dashboard p-8 space-y-8">
      {/* Header Section */}
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">
              KnouxCrypt™ 2025
            </h1>
            <p className="text-xl text-white/70">
              نظام التشفير العسكري المتقدم
            </p>
            <p className="text-sm text-white/50 mt-1">
              {formatTime(currentTime)}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="status-indicator secure">
              <div className="status-dot"></div>
              النظام آمن
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">98%</div>
              <div className="text-sm text-white/60">مستوى الأمان</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Security Metrics Grid */}
      <motion.div
        className="metrics-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {securityMetrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            className="metric-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div
              className="metric-icon"
              style={{ background: `${metric.color}20`, color: metric.color }}
            >
              {metric.icon}
            </div>
            <div className="metric-value" style={{ color: metric.color }}>
              {metric.value}
              {metric.unit}
            </div>
            <div className="metric-label">{metric.name}</div>
            <div
              className={`metric-change ${metric.trend === "up" ? "positive" : metric.trend === "down" ? "negative" : ""}`}
            >
              {metric.trend === "up" && "↗"}
              {metric.trend === "down" && "↘"}
              {metric.trend === "stable" && "→"}
              {metric.trend === "up"
                ? "+2.1%"
                : metric.trend === "down"
                  ? "-1.3%"
                  : "مستقر"}
            </div>

            {/* Progress Ring */}
            <div className="progress-ring mt-4">
              <svg width="60" height="60" className="progress-ring-circle">
                <circle
                  className="progress-ring-track"
                  cx="30"
                  cy="30"
                  r="26"
                />
                <circle
                  className="progress-ring-fill"
                  cx="30"
                  cy="30"
                  r="26"
                  stroke={metric.color}
                  strokeDasharray={`${metric.value * 1.63} 163`}
                />
              </svg>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Operations */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="glass-card-strong p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">العمليات النشطة</h2>
              <div className="text-sm text-white/60">
                {activeOperations.length} عملية جارية
              </div>
            </div>

            <div className="space-y-4">
              {activeOperations.map((operation) => (
                <motion.div
                  key={operation.id}
                  className="glass-card p-4"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          operation.type === "encrypt"
                            ? "bg-blue-400"
                            : operation.type === "decrypt"
                              ? "bg-green-400"
                              : "bg-purple-400"
                        }`}
                      ></div>
                      <div>
                        <div className="font-medium text-white">
                          {operation.fileName}
                        </div>
                        <div className="text-sm text-white/60">
                          {operation.algorithm} •{" "}
                          {formatDuration(operation.startTime)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">
                        {operation.progress}%
                      </div>
                      <div className="text-xs text-white/60">
                        {operation.type === "encrypt"
                          ? "تشفير"
                          : operation.type === "decrypt"
                            ? "فك تشفير"
                            : "فحص"}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: `${operation.progress}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${operation.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <motion.button
                className="glass-button p-3 text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-2xl mb-1">🔒</div>
                <div className="text-sm">تشفير ملف</div>
              </motion.button>
              <motion.button
                className="glass-button p-3 text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-2xl mb-1">🔓</div>
                <div className="text-sm">فك التشفير</div>
              </motion.button>
              <motion.button
                className="glass-button p-3 text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-2xl mb-1">🔍</div>
                <div className="text-sm">فحص النظام</div>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Security Alerts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="glass-card-strong p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">تنبيهات الأمان</h2>
              <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  className="glass-card p-4"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-3 h-3 rounded-full mt-1.5"
                      style={{
                        backgroundColor: getSeverityColor(alert.severity),
                      }}
                    ></div>
                    <div className="flex-1">
                      <div className="font-medium text-white text-sm mb-1">
                        {alert.title}
                      </div>
                      <div className="text-xs text-white/60 mb-2">
                        {alert.description}
                      </div>
                      <div className="text-xs text-white/40">
                        {new Date(alert.timestamp).toLocaleString("ar-SA")}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* System Status */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="text-lg font-bold text-white mb-4">
                حالة النظام
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">
                    الخوارزميات النشطة
                  </span>
                  <span className="text-white font-medium">4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">الملفات المحمية</span>
                  <span className="text-white font-medium">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">آخر فحص</span>
                  <span className="text-white font-medium">قبل ساعة</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">التحديث التالي</span>
                  <span className="text-white font-medium">غداً</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Real-time Activity Feed */}
      <motion.div
        className="glass-card-strong p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-xl font-bold text-white mb-6">النشاط الفوري</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              time: "الآن",
              action: "تم تشفير ملف جديد",
              icon: "🔒",
              color: "#10B981",
            },
            {
              time: "قبل دقيقة",
              action: "اكتمل فحص النظام",
              icon: "✅",
              color: "#3B82F6",
            },
            {
              time: "قبل 3 دقائق",
              action: "تحديث قاعدة البيانات",
              icon: "🔄",
              color: "#8B5CF6",
            },
            {
              time: "قبل 5 دقائق",
              action: "تسجيل دخول آمن",
              icon: "👤",
              color: "#06B6D4",
            },
          ].map((activity, index) => (
            <motion.div
              key={index}
              className="glass-card p-4 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-2xl mb-2" style={{ color: activity.color }}>
                {activity.icon}
              </div>
              <div className="text-sm text-white font-medium mb-1">
                {activity.action}
              </div>
              <div className="text-xs text-white/60">{activity.time}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
