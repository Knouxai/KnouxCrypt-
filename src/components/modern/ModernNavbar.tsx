import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CryptoTestButton } from "../UI/CryptoTestButton";

interface UserProfile {
  name: string;
  avatar: string;
  role: string;
  status: "online" | "away" | "busy";
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "security" | "system" | "update" | "alert";
  read: boolean;
}

export const ModernNavbar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const userProfile: UserProfile = {
    name: "المدير الأمني",
    avatar: "👤",
    role: "Security Administrator",
    status: "online",
  };

  const notifications: Notification[] = [
    {
      id: "1",
      title: "تحديث أمني",
      message: "يتوفر تحديث جديد لنظام التشفير",
      time: "قبل 5 دقائق",
      type: "update",
      read: false,
    },
    {
      id: "2",
      title: "عملية تشفير مكتملة",
      message: "تم تشفير 50 ملف بنجاح",
      time: "قبل 15 دقيقة",
      type: "system",
      read: false,
    },
    {
      id: "3",
      title: "تنبيه أمني",
      message: "محاولة وصول مشبوهة تم حجبها",
      time: "قبل ساعة",
      type: "security",
      read: true,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "security":
        return "🛡️";
      case "system":
        return "⚙️";
      case "update":
        return "🔄";
      case "alert":
        return "⚠️";
      default:
        return "ℹ️";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-400";
      case "away":
        return "bg-yellow-400";
      case "busy":
        return "bg-red-400";
      default:
        return "bg-gray-400";
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav className="modern-nav">
      {/* Logo Section */}
      <motion.div
        className="nav-logo"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-3xl"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🔐
        </motion.div>
        <div>
          <div className="text-xl font-bold">KnouxCrypt™</div>
          <div className="text-xs text-white/60">Military Grade Encryption</div>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        className="search-container relative flex-1 max-w-md mx-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.div
          className={`glass-button flex items-center gap-3 p-3 cursor-pointer ${showSearch ? "active" : ""}`}
          onClick={() => setShowSearch(!showSearch)}
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-lg">🔍</div>
          <div className="text-white/60">البحث في النظام...</div>
          <div className="text-white/40 text-xs mr-auto">Ctrl+K</div>
        </motion.div>

        <AnimatePresence>
          {showSearch && (
            <motion.div
              className="absolute top-full left-0 right-0 mt-2 glass-card-strong p-4 z-50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <input
                type="text"
                placeholder="البحث عن ملفات، إعدادات، أو أوامر..."
                className="w-full bg-transparent border-none outline-none text-white placeholder-white/50"
                autoFocus
              />
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="text-xs text-white/60 mb-2">
                  اختصارات سريعة:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-white/40">Ctrl+E: تشفير سريع</div>
                  <div className="text-white/40">Ctrl+D: إدارة الأقراص</div>
                  <div className="text-white/40">Ctrl+S: إعدادات النظام</div>
                  <div className="text-white/40">Ctrl+H: المساعدة</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Right Actions */}
      <motion.div
        className="nav-actions"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Live Preview Link */}
        <motion.a
          href="/live-preview"
          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30 rounded-lg text-sm font-medium text-white transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="واجهة المراقبة المباشرة الجديدة"
        >
          <span className="text-lg">📺</span>
          <span>مراقبة مباشرة</span>
          <motion.div
            className="w-1.5 h-1.5 bg-red-500 rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.a>

        {/* Crypto Test Button */}
        <CryptoTestButton />

        {/* System Status */}
        <motion.div
          className="glass-button p-3 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <div className="text-sm">
            <div className="text-white font-medium">آمن</div>
            <div className="text-white/60 text-xs">98%</div>
          </div>
        </motion.div>

        {/* Time Display */}
        <motion.div
          className="glass-button p-3 text-center"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-sm font-medium text-white">
            {currentTime.toLocaleTimeString("ar-SA", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="text-xs text-white/60">
            {currentTime.toLocaleDateString("ar-SA", {
              weekday: "short",
            })}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div className="relative">
          <motion.button
            className="glass-button p-3 relative"
            onClick={() => setShowNotifications(!showNotifications)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-xl">🔔</div>
            {unreadCount > 0 && (
              <motion.div
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                {unreadCount}
              </motion.div>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                className="absolute top-full right-0 mt-2 w-80 glass-card-strong p-4 z-50"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white">الإشعارات</h3>
                  <button className="text-xs text-white/60 hover:text-white">
                    وضع علامة كمقروء
                  </button>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      className={`glass-card p-3 cursor-pointer ${
                        !notification.read ? "border-blue-500/30" : ""
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-lg">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className={`font-medium text-sm ${
                              !notification.read
                                ? "text-white"
                                : "text-white/70"
                            }`}
                          >
                            {notification.title}
                          </div>
                          <div className="text-xs text-white/60 mt-1">
                            {notification.message}
                          </div>
                          <div className="text-xs text-white/40 mt-1">
                            {notification.time}
                          </div>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-white/10">
                  <button className="w-full glass-button p-2 text-sm">
                    عرض جميع الإشعارات
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* User Profile */}
        <motion.div className="relative">
          <motion.button
            className="glass-button p-3 flex items-center gap-3"
            onClick={() => setShowProfile(!showProfile)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <div className="text-xl">{userProfile.avatar}</div>
              <div
                className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(userProfile.status)} rounded-full border border-gray-900`}
              ></div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-white">
                {userProfile.name}
              </div>
              <div className="text-xs text-white/60">{userProfile.role}</div>
            </div>
          </motion.button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                className="absolute top-full right-0 mt-2 w-64 glass-card-strong p-4 z-50"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">{userProfile.avatar}</div>
                  <div className="font-bold text-white">{userProfile.name}</div>
                  <div className="text-sm text-white/60">
                    {userProfile.role}
                  </div>
                  <div
                    className={`inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs ${
                      userProfile.status === "online"
                        ? "bg-green-500/20 text-green-400"
                        : userProfile.status === "away"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${getStatusColor(userProfile.status)}`}
                    ></div>
                    {userProfile.status === "online"
                      ? "متصل"
                      : userProfile.status === "away"
                        ? "غائب"
                        : "مشغول"}
                  </div>
                </div>

                <div className="space-y-2">
                  <motion.button
                    className="w-full glass-button p-2 text-sm text-right"
                    whileHover={{ scale: 1.02 }}
                  >
                    ⚙️ إعدادات الحساب
                  </motion.button>
                  <motion.button
                    className="w-full glass-button p-2 text-sm text-right"
                    whileHover={{ scale: 1.02 }}
                  >
                    🔒 تغيير كلمة المرور
                  </motion.button>
                  <motion.button
                    className="w-full glass-button p-2 text-sm text-right"
                    whileHover={{ scale: 1.02 }}
                  >
                    📊 إحصائيات الاستخدام
                  </motion.button>
                  <motion.button
                    className="w-full glass-button p-2 text-sm text-right"
                    whileHover={{ scale: 1.02 }}
                  >
                    ❓ المساعدة والدعم
                  </motion.button>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10">
                  <motion.button
                    className="w-full glass-button p-2 text-sm text-red-400"
                    whileHover={{ scale: 1.02 }}
                  >
                    🚪 تسجيل الخروج
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </nav>
  );
};
