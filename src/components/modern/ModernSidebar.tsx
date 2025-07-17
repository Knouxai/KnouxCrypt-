import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";

interface NavigationItem {
  path: string;
  icon: string;
  label: string;
  description: string;
  badge?: string;
  shortcut?: string;
}

interface SidebarSection {
  title: string;
  items: NavigationItem[];
}

export const ModernSidebar: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarSections: SidebarSection[] = [
    {
      title: "الرئيسية",
      items: [
        {
          path: "/",
          icon: "🏠",
          label: "لوحة التحكم",
          description: "نظرة عامة على النظام",
          shortcut: "Ctrl+H",
        },
        {
          path: "/analytics",
          icon: "📊",
          label: "التحليلات المتقدمة",
          description: "إحصائيات وتقارير مفصلة",
          badge: "جديد",
          shortcut: "Ctrl+A",
        },
      ],
    },
    {
      title: "التشفير",
      items: [
        {
          path: "/encrypt",
          icon: "🔒",
          label: "تشفير الملفات",
          description: "حماية متقدمة للملفات",
          shortcut: "Ctrl+E",
        },
        {
          path: "/disk-manager",
          icon: "💾",
          label: "إدارة الأقراص",
          description: "تشفير الأقراص والوسائط",
          shortcut: "Ctrl+D",
        },
        {
          path: "/system-encryption",
          icon: "🌐",
          label: "تشفير النظام",
          description: "حماية شاملة للنظام",
          shortcut: "Ctrl+S",
        },
      ],
    },
    {
      title: "الخوارزميات",
      items: [
        {
          path: "/algorithms",
          icon: "🔬",
          label: "مختبر الخوارزميات",
          description: "4 خوارزميات متقدمة",
          badge: "4",
          shortcut: "Ctrl+L",
        },
        {
          path: "/quantum",
          icon: "⚛️",
          label: "التشفير الكمي",
          description: "مقاوم للكمبيوتر الكمي",
          badge: "تجريبي",
          shortcut: "Ctrl+Q",
        },
      ],
    },
    {
      title: "الذكاء الاصطناعي",
      items: [
        {
          path: "/ai-assistant",
          icon: "🧠",
          label: "المساعد الذكي",
          description: "توصيات ذكية للأمان",
          badge: "AI",
          shortcut: "Ctrl+I",
        },
        {
          path: "/threat-detection",
          icon: "🛡️",
          label: "كشف التهديدات",
          description: "مراقبة فورية للتهديدات",
          shortcut: "Ctrl+T",
        },
      ],
    },
    {
      title: "التطوير والاختبار",
      items: [
        {
          path: "/crypto-test",
          icon: "🧪",
          label: "مختبر التشفير",
          description: "اختبار وحدات التش��ير",
          badge: "تجريبي",
          shortcut: "Ctrl+T",
        },
        {
          path: "/live-preview",
          icon: "📺",
          label: "المراقبة المباشرة",
          description: "عرض مباشر للخدمات",
          badge: "مباشر",
          shortcut: "Ctrl+P",
        },
      ],
    },
    {
      title: "الإعدادات",
      items: [
        {
          path: "/settings",
          icon: "⚙️",
          label: "الإعدادات",
          description: "تخصيص النظام",
          shortcut: "Ctrl+,",
        },
        {
          path: "/logs",
          icon: "📝",
          label: "سجل النشاط",
          description: "سجل العمليات والأحداث",
          shortcut: "Ctrl+L",
        },
      ],
    },
  ];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "جديد":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "تجريبي":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "AI":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "مباشر":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  return (
    <motion.div
      className={`modern-sidebar ${collapsed ? "collapsed" : ""}`}
      initial={{ x: 320 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Sidebar Header */}
      <div className="sidebar-header flex items-center justify-between mb-8">
        <motion.div
          className="flex items-center gap-3"
          animate={{ scale: collapsed ? 0.8 : 1 }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-xl">
            🔐
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-lg font-bold text-white">KnouxCrypt™</div>
                <div className="text-xs text-white/60">2025 Pro</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.button
          className="glass-button p-2"
          onClick={() => setCollapsed(!collapsed)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ←
          </motion.div>
        </motion.button>
      </div>

      {/* Navigation Sections */}
      <div className="navigation-sections space-y-6">
        {sidebarSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            className="sidebar-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
          >
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  className="sidebar-title"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {section.title}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              {section.items.map((item, itemIndex) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: sectionIndex * 0.1 + itemIndex * 0.05,
                  }}
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `sidebar-item group relative ${isActive ? "active" : ""}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Active Indicator */}
                        {isActive && (
                          <motion.div
                            className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full"
                            layoutId="activeIndicator"
                            initial={false}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                          />
                        )}

                        <div className="flex items-center gap-3 relative z-10">
                          {/* Icon */}
                          <motion.div
                            className="text-xl flex-shrink-0"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.icon}
                          </motion.div>

                          {/* Content */}
                          <AnimatePresence>
                            {!collapsed && (
                              <motion.div
                                className="flex-1 min-w-0"
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="truncate">
                                    <div className="font-medium text-sm">
                                      {item.label}
                                    </div>
                                    <div className="text-xs text-white/60 truncate">
                                      {item.description}
                                    </div>
                                  </div>

                                  {/* Badge */}
                                  {item.badge && (
                                    <motion.div
                                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getBadgeColor(item.badge)}`}
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: 0.2 }}
                                    >
                                      {item.badge}
                                    </motion.div>
                                  )}
                                </div>

                                {/* Shortcut */}
                                {item.shortcut && (
                                  <div className="text-xs text-white/40 mt-1">
                                    {item.shortcut}
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Hover Effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100"
                          transition={{ duration: 0.2 }}
                        />

                        {/* Active Background */}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <motion.div
        className="sidebar-footer mt-auto pt-6 border-t border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-sm font-medium text-white">
                    النظام محمي
                  </div>
                  <div className="text-xs text-white/60">
                    آخر فحص: قبل 5 دقائق
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                className="mt-3 flex gap-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.button
                  className="glass-button flex-1 p-2 text-xs"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🔍 فحص سريع
                </motion.button>
                <motion.button
                  className="glass-button flex-1 p-2 text-xs"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ℹ️ المساعدة
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};
