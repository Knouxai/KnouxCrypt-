import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
  category: "navigation" | "encryption" | "system" | "ai";
}

interface KeyboardShortcutsProps {
  isVisible: boolean;
  onClose: () => void;
}

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  isVisible,
  onClose,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("navigation");

  const shortcuts: KeyboardShortcut[] = [
    // Navigation
    {
      key: "Ctrl + H",
      description: "الذهاب للرئيسية",
      action: () => {},
      category: "navigation",
    },
    {
      key: "Ctrl + D",
      description: "إدارة الأقراص",
      action: () => {},
      category: "navigation",
    },
    {
      key: "Ctrl + S",
      description: "تشفير النظام",
      action: () => {},
      category: "navigation",
    },
    {
      key: "Ctrl + A",
      description: "الخوارزميات",
      action: () => {},
      category: "navigation",
    },
    {
      key: "Ctrl + I",
      description: "المساعد الذكي",
      action: () => {},
      category: "navigation",
    },

    // Encryption
    {
      key: "Ctrl + E",
      description: "تشفير سريع",
      action: () => {},
      category: "encryption",
    },
    {
      key: "Ctrl + U",
      description: "فك التشفير",
      action: () => {},
      category: "encryption",
    },
    {
      key: "Ctrl + Shift + E",
      description: "تشفير كامل للنظام",
      action: () => {},
      category: "encryption",
    },
    {
      key: "F5",
      description: "تحديث قائمة الأقراص",
      action: () => {},
      category: "encryption",
    },

    // System
    {
      key: "F12",
      description: "فحص أمني شامل",
      action: () => {},
      category: "system",
    },
    {
      key: "Ctrl + R",
      description: "إعادة تشغيل النظام",
      action: () => {},
      category: "system",
    },
    {
      key: "Ctrl + Shift + L",
      description: "عرض سجل النشاط",
      action: () => {},
      category: "system",
    },

    // AI
    {
      key: "Ctrl + Shift + A",
      description: "تفعيل المساعد الذكي",
      action: () => {},
      category: "ai",
    },
    {
      key: "Ctrl + T",
      description: "تحليل ذكي للتهديدات",
      action: () => {},
      category: "ai",
    },
    {
      key: "Ctrl + Shift + R",
      description: "توصيات ذكية",
      action: () => {},
      category: "ai",
    },
  ];

  const categories = {
    navigation: { name: "التنقل", icon: "🧭", color: "#6366F1" },
    encryption: { name: "التشفير", icon: "🔐", color: "#10B981" },
    system: { name: "النظام", icon: "⚙️", color: "#F59E0B" },
    ai: { name: "الذكاء الاصطناعي", icon: "🧠", color: "#8B5CF6" },
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }

      // Handle shortcuts
      shortcuts.forEach((shortcut) => {
        const keys = shortcut.key.toLowerCase().split(" + ");
        const ctrlPressed = keys.includes("ctrl") ? e.ctrlKey : true;
        const shiftPressed = keys.includes("shift")
          ? e.shiftKey
          : !keys.includes("shift") || !e.shiftKey;
        const keyPressed = keys[keys.length - 1] === e.key.toLowerCase();

        if (ctrlPressed && shiftPressed && keyPressed) {
          e.preventDefault();
          shortcut.action();
        }
      });
    };

    if (isVisible) {
      window.addEventListener("keydown", handleKeyPress);
    }

    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isVisible, shortcuts, onClose]);

  if (!isVisible) return null;

  const filteredShortcuts = shortcuts.filter(
    (s) => s.category === activeCategory,
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="text-4xl">⌨️</div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  اختصارات لوحة المفاتيح
                </h2>
                <p className="text-gray-400 mt-1">
                  جميع الاختصارات المتاحة في النظام
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

          {/* Category Tabs */}
          <div className="flex gap-2 mb-8 bg-white/5 p-2 rounded-2xl">
            {Object.entries(categories).map(([key, category]) => (
              <motion.button
                key={key}
                className={`flex-1 flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  activeCategory === key
                    ? "bg-white/20 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setActiveCategory(key)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-xl">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
                {activeCategory === key && (
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    style={{ backgroundColor: `${category.color}20` }}
                    layoutId="activeTab"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Shortcuts List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredShortcuts.map((shortcut, index) => (
              <motion.div
                key={`${shortcut.key}-${index}`}
                className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <div className="flex-1">
                  <div className="text-white font-medium mb-1">
                    {shortcut.description}
                  </div>
                </div>
                <div className="flex gap-1">
                  {shortcut.key.split(" + ").map((key, i) => (
                    <React.Fragment key={i}>
                      <kbd className="px-2 py-1 bg-white/20 text-white text-xs rounded-md font-mono border border-white/30">
                        {key}
                      </kbd>
                      {i < shortcut.key.split(" + ").length - 1 && (
                        <span className="text-white/40 mx-1">+</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-white/60 text-sm">
              اضغط{" "}
              <kbd className="px-2 py-1 bg-white/20 text-white text-xs rounded-md font-mono border border-white/30">
                Esc
              </kbd>{" "}
              لإغلاق هذه النافذة
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
