import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { SecurityProvider } from "./context/SecurityContext";
import {
  NotificationProvider,
  useNotifications,
} from "./components/UI/QuantumNotification";
import { Sidebar } from "./components/layout/Sidebar";
import { AppRouter } from "./components/layout/AppRouter";
import { SystemTray } from "./components/UI/SystemTray";
import { KeyboardShortcuts } from "./components/UI/KeyboardShortcuts";
import "./App.css";

const AppContent = () => {
  const [showSystemTray, setShowSystemTray] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Show welcome notification
    const timer = setTimeout(() => {
      addNotification({
        title: "مرحباً بك في KnouxCrypt™ 2025",
        message:
          "نظام التشفير العسكري المتقدم جاهز للاستخدام. اضغط F1 لعرض اختصارات لوحة المفاتيح.",
        type: "quantum",
        duration: 8000,
        action: {
          label: "اختصارات المفاتيح",
          onClick: () => setShowKeyboardShortcuts(true),
        },
      });
    }, 2000);

    // Keyboard shortcuts handler
    const handleKeyPress = (e) => {
      if (e.key === "F1") {
        e.preventDefault();
        setShowKeyboardShortcuts(true);
      }
      if (e.ctrlKey && e.shiftKey && e.key === "T") {
        e.preventDefault();
        setShowSystemTray(!showSystemTray);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [addNotification, showSystemTray]);

  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">
        <AppRouter />
      </main>

      {/* Enhanced Features */}
      <SystemTray
        isVisible={showSystemTray}
        onToggle={() => setShowSystemTray(!showSystemTray)}
      />
      <KeyboardShortcuts
        isVisible={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />
    </div>
  );
};

function App() {
  return (
    <SecurityProvider>
      <NotificationProvider>
        <Router>
          <AppContent />
        </Router>
      </NotificationProvider>
    </SecurityProvider>
  );
}

export default App;
