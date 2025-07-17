import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface NavigationItem {
  path: string;
  icon: string;
  label: string;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    path: "/",
    icon: "🏠",
    label: "الرئيسية",
    description: "لوحة المعلومات الرئيسية",
  },
  {
    path: "/disk-manager",
    icon: "🧩",
    label: "إدارة الأقراص",
    description: "تشفير الأقراص والـ USB",
  },
  {
    path: "/system-encryption",
    icon: "💻",
    label: "تشفير النظام",
    description: "تشفير كامل للقرص C",
  },
  {
    path: "/algorithms",
    icon: "🔐",
    label: "الخوارزميات",
    description: "AES-256, Serpent, Twofish",
  },
  {
    path: "/ai-assistant",
    icon: "🧠",
    label: "المساعد الذكي",
    description: "توصيات AI للتشفير",
  },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <motion.div
        className="sidebar-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="logo">
          <div className="logo-icon">🔐</div>
          <div className="logo-text">
            <h1>KnouxCrypt™</h1>
            <span>نكهة التشفير المتقدم</span>
          </div>
        </div>
      </motion.div>

      <nav className="sidebar-nav">
        {navigationItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <div className="nav-icon">{item.icon}</div>
              <div className="nav-content">
                <div className="nav-label">{item.label}</div>
                <div className="nav-description">{item.description}</div>
              </div>
              {location.pathname === item.path && (
                <motion.div
                  className="active-indicator"
                  layoutId="activeIndicator"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <motion.div
        className="sidebar-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="status-indicator">
          <div className="status-dot online"></div>
          <span>متصل وآمن</span>
        </div>
      </motion.div>
    </div>
  );
};
