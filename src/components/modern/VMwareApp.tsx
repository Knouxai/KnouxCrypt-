import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import { SecurityProvider } from "../../context/SecurityContext";
import { NotificationProvider } from "../UI/QuantumNotification";
import "../../styles/modern-theme.css";

// Import existing pages
import { ModernDashboard } from "./ModernDashboard";
import { DiskManager } from "../pages/DiskManager";
import { SystemEncryption } from "../pages/SystemEncryption";
import { Algorithms } from "../pages/Algorithms";
import { AIAssistant } from "../pages/AIAssistant";
import { CryptoTest } from "../pages/CryptoTest";
import LivePreview from "../pages/LivePreview";

interface NavigationItem {
  path: string;
  icon: string;
  label: string;
  description: string;
  component: React.ComponentType;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

export const VMwareApp: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState("/");
  const [openedSections, setOpenedSections] = useState<string[]>(["/"]);

  useEffect(() => {
    document.body.classList.add("modern-theme");
    return () => document.body.classList.remove("modern-theme");
  }, []);

  const navigationSections: NavigationSection[] = [
    {
      title: "الرئيسية",
      items: [
        {
          path: "/",
          icon: "🏠",
          label: "لوحة التحكم",
          description: "نظرة عامة على النظام",
          component: ModernDashboard,
        },
      ],
    },
    {
      title: "التشفير والحماية",
      items: [
        {
          path: "/disk-manager",
          icon: "💾",
          label: "إدارة الأقراص",
          description: "تشفير الأقراص والوسائط",
          component: DiskManager,
        },
        {
          path: "/system-encryption",
          icon: "🌐",
          label: "تشفير النظام",
          description: "حماية شاملة للنظام",
          component: SystemEncryption,
        },
        {
          path: "/algorithms",
          icon: "🔬",
          label: "مختبر الخوارزميات",
          description: "4 خوارزميات متقدمة",
          component: Algorithms,
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
          component: AIAssistant,
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
          description: "اختبار وحدات التشفير",
          component: CryptoTest,
        },
        {
          path: "/live-preview",
          icon: "📺",
          label: "المراقبة المباشرة",
          description: "عرض مباشر للخدمات",
          component: LivePreview,
        },
      ],
    },
  ];

  const allItems = navigationSections.flatMap((section) => section.items);
  const currentItem = allItems.find((item) => item.path === selectedSection);
  const CurrentComponent = currentItem?.component || ModernDashboard;

  const handleSectionSelect = (path: string) => {
    setSelectedSection(path);
    if (!openedSections.includes(path)) {
      setOpenedSections([...openedSections, path]);
    }
  };

  const handleTabClose = (path: string) => {
    const newOpenedSections = openedSections.filter((p) => p !== path);
    setOpenedSections(newOpenedSections);
    if (selectedSection === path && newOpenedSections.length > 0) {
      setSelectedSection(newOpenedSections[newOpenedSections.length - 1]);
    }
  };

  return (
    <SecurityProvider>
      <NotificationProvider>
        <Router>
          <div
            className="w-full h-screen relative overflow-hidden"
            style={{
              background: "#1F1F1F",
              backgroundImage:
                'url("https://api.builder.io/api/v1/image/assets/TEMP/32df3456c4cc74d73958ae26d58c6b5008a46202?width=4252")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Background Blur Layer */}
            <div className="absolute inset-0 backdrop-blur-sm bg-black/30" />

            {/* Main Window Container */}
            <motion.div
              className="absolute inset-4 rounded-xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%), rgba(4, 4, 4, 0.75)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                boxShadow: "6px 6px 24px 5px rgba(0, 0, 0, 0.25)",
                backdropFilter: "blur(100px)",
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Top Toolbar */}
              <div
                className="flex items-center gap-4 px-4 py-3 h-12"
                style={{
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                  background: "rgba(0, 0, 0, 0.3)",
                }}
              >
                {/* App Logo */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className="w-3 h-3 rounded-sm border-2"
                      style={{ borderColor: "#4EB4FF" }}
                    />
                    <div
                      className="absolute -left-1 top-0.5 w-3 h-3 rounded-sm border-2"
                      style={{ borderColor: "#F38B00" }}
                    />
                  </div>

                  {/* Menu Items */}
                  <div className="flex items-center gap-4 text-sm">
                    {["ملف", "تحرير", "عرض", "أدوات", "مساعدة"].map((item) => (
                      <span
                        key={item}
                        className="text-gray-300 hover:text-white cursor-pointer transition-colors"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* App Title */}
                <div className="flex-1 text-center">
                  <span className="text-white text-sm font-medium">
                    KnouxCrypt™ 2025 Pro - نظام التشفير المتقدم
                  </span>
                </div>

                {/* Window Controls */}
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
              </div>

              {/* Section Tabs */}
              <div className="flex items-center h-9 px-2 gap-1 bg-black/20 border-b border-white/10">
                {openedSections.map((path) => {
                  const item = allItems.find((i) => i.path === path);
                  return (
                    <motion.div
                      key={path}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs font-medium cursor-pointer transition-all ${
                        selectedSection === path
                          ? "bg-white/8 text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                      onClick={() => setSelectedSection(path)}
                    >
                      <span>{item?.icon}</span>
                      <span>{item?.label}</span>
                      {openedSections.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTabClose(path);
                          }}
                          className="ml-1 text-gray-500 hover:text-white"
                        >
                          ×
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Main Content Area */}
              <div className="flex h-full">
                {/* Left Sidebar */}
                <div className="w-80 h-full flex flex-col p-3 gap-4 border-r border-white/10 bg-black/20">
                  {/* Sections */}
                  {navigationSections.map((section) => (
                    <div key={section.title}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white text-xs font-medium tracking-wide">
                          {section.title}
                        </h3>
                      </div>

                      <div className="space-y-1 pl-4">
                        {section.items.map((item) => (
                          <motion.div
                            key={item.path}
                            className={`flex items-center gap-3 px-2 py-1.5 rounded cursor-pointer transition-all ${
                              selectedSection === item.path
                                ? "bg-white/15 text-white"
                                : "text-gray-300 hover:text-white hover:bg-white/5"
                            }`}
                            onClick={() => handleSectionSelect(item.path)}
                            whileHover={{ scale: 1.02 }}
                          >
                            <span className="text-lg">{item.icon}</span>
                            <div>
                              <div className="text-xs font-normal tracking-wide">
                                {item.label}
                              </div>
                              <div className="text-xs text-gray-400">
                                {item.description}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* System Status */}
                  <div className="mt-auto">
                    <div
                      className="p-4 rounded-lg"
                      style={{
                        background: "rgba(0, 0, 0, 0.3)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">
                            النظام محمي
                          </div>
                          <div className="text-xs text-white/60">
                            آخر فحص: قبل 5 دقائق
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Content Area */}
                <div className="flex-1 flex flex-col">
                  {/* Main Content */}
                  <div className="flex-1 p-6 overflow-y-auto">
                    <motion.div
                      key={selectedSection}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      <Routes>
                        <Route path="/" element={<ModernDashboard />} />
                        <Route path="/disk-manager" element={<DiskManager />} />
                        <Route
                          path="/system-encryption"
                          element={<SystemEncryption />}
                        />
                        <Route path="/algorithms" element={<Algorithms />} />
                        <Route path="/ai-assistant" element={<AIAssistant />} />
                        <Route path="/crypto-test" element={<CryptoTest />} />
                        <Route path="/live-preview" element={<LivePreview />} />
                      </Routes>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Router>
      </NotificationProvider>
    </SecurityProvider>
  );
};
