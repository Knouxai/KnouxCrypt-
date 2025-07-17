import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import { ModernNavbar } from "./ModernNavbar";
import { ModernSidebar } from "./ModernSidebar";
import { ModernDashboard } from "./ModernDashboard";
import { SecurityProvider } from "../../context/SecurityContext";
import { NotificationProvider } from "../UI/QuantumNotification";
import "../../styles/modern-theme.css";

// Import existing pages
import { DiskManager } from "../pages/DiskManager";
import { SystemEncryption } from "../pages/SystemEncryption";
import { Algorithms } from "../pages/Algorithms";
import { AIAssistant } from "../pages/AIAssistant";
import { CryptoTest } from "../pages/CryptoTest";
import LivePreview from "../pages/LivePreview";
import VMwareInterface from "../pages/VMwareInterface";

// Import crypto factory for encrypt page
import { CipherFactory } from "../../core/crypto/CipherFactory";

export const ModernApp: React.FC = () => {
  useEffect(() => {
    // Add modern theme to body
    document.body.classList.add("modern-theme");
    return () => document.body.classList.remove("modern-theme");
  }, []);

  return (
    <SecurityProvider>
      <NotificationProvider>
        <Router>
          <div className="modern-app min-h-screen bg-gradient-background">
            {/* Navigation Header */}
            <ModernNavbar />

            {/* Main Layout */}
            <div className="flex">
              {/* Sidebar */}
              <ModernSidebar />

              {/* Main Content */}
              <motion.main
                className="modern-main"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Routes>
                  <Route path="/" element={<ModernDashboard />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/encrypt" element={<EncryptPage />} />
                  <Route path="/disk-manager" element={<DiskManager />} />
                  <Route
                    path="/system-encryption"
                    element={<SystemEncryption />}
                  />
                  <Route path="/algorithms" element={<Algorithms />} />
                  <Route path="/quantum" element={<QuantumPage />} />
                  <Route path="/ai-assistant" element={<AIAssistant />} />
                  <Route
                    path="/threat-detection"
                    element={<ThreatDetectionPage />}
                  />
                  <Route path="/crypto-test" element={<CryptoTest />} />
                  <Route path="/live-preview" element={<LivePreview />} />
                  <Route path="/vmware" element={<VMwareInterface />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/logs" element={<LogsPage />} />
                </Routes>
              </motion.main>
            </div>
          </div>
        </Router>
      </NotificationProvider>
    </SecurityProvider>
  );
};

// Placeholder components for new pages
const AnalyticsPage: React.FC = () => (
  <motion.div
    className="space-y-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="glass-card-strong p-8">
      <h1 className="text-3xl font-bold text-gradient mb-4">
        📊 التحليلات ��لمتقدمة
      </h1>
      <p className="text-white/70 text-lg">
        إحصائيات وتقارير مفصلة عن نشاط النظام
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-4">مخطط ��لأداء</h2>
        <div className="h-64 bg-white/5 rounded-xl flex items-center justify-center">
          <div className="text-center text-white/50">
            <div className="text-4xl mb-2">📈</div>
            <div>مخطط الأداء سيتم عرضه هنا</div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-4">إحصائيات سريعة</h2>
        <div className="space-y-4">
          {[
            { label: "الملفات المشفرة", value: "1,247", icon: "🔒" },
            { label: "العمليات اليوم", value: "156", icon: "⚡" },
            { label: "توفير المساحة", value: "23%", icon: "💾" },
            { label: "وقت التشفير المتوسط", value: "2.3s", icon: "⏱️" },
          ].map((stat, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 glass-card"
            >
              <div className="flex items-center gap-3">
                <div className="text-xl">{stat.icon}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
              <div className="font-bold text-white">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

const EncryptPage: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = React.useState("AES-256");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [encrypting, setEncrypting] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const algorithms = [
    { value: "AES-256", label: "AES-256", description: "سريع ومعتمد عالمياً" },
    {
      value: "Serpent",
      label: "Serpent-256",
      description: "32 جولة أمان فائق",
    },
    { value: "Twofish", label: "Twofish-256", description: "سريع ومرن" },
    {
      value: "AES-Serpent-Twofish",
      label: "Triple Cipher",
      description: "أقصى أمان ممكن",
    },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(selectedFiles);
  };

  const handleEncrypt = async () => {
    if (!password || password !== confirmPassword) {
      alert("كلمات المر��ر غير متطابقة");
      return;
    }

    if (files.length === 0) {
      alert("اختر ملفات للتشفير");
      return;
    }

    setEncrypting(true);
    setProgress(0);

    try {
      // محاكاة التشفير
      for (let i = 0; i < files.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setProgress(((i + 1) / files.length) * 100);
      }
      alert("تم التشفير بنجاح!");
    } catch (error) {
      alert("فشل في التشفير");
    } finally {
      setEncrypting(false);
      setProgress(0);
    }
  };

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-card-strong p-8">
        <h1 className="text-3xl font-bold text-gradient mb-4">
          🔒 تشفير الملفات
        </h1>
        <p className="text-white/70 text-lg">
          حماية متقدمة للملفات والمجلدات باستخدام خوارزميات عسكرية
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">رفع الملفات</h2>
          <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">📁</div>
            <div className="text-white/70 mb-2">
              اسحب الملفات هنا أو انقر للاختيار
            </div>
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="glass-button px-6 py-2 mt-4 cursor-pointer inline-block"
            >
              اختيار الملفات
            </label>
          </div>

          {files.length > 0 && (
            <div className="mt-4">
              <h3 className="text-white font-medium mb-2">الملفات المحددة:</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="glass-card p-2 text-sm text-white/80"
                  >
                    📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">إعدادات التشفير</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">
                خوارزمية التشفير
              </label>
              <select
                className="w-full glass-button p-2"
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value)}
              >
                {algorithms.map((algo) => (
                  <option key={algo.value} value={algo.value}>
                    {algo.label} - {algo.description}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">
                كلمة المرور
              </label>
              <input
                type="password"
                className="w-full glass-button p-2"
                placeholder="أدخل كلمة مرور قوية"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                className="w-full glass-button p-2"
                placeholder="أعد إدخال كلمة المرور"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {encrypting && (
              <div className="mt-4">
                <div className="text-sm text-white/70 mb-2">
                  جاري التشفير... {progress.toFixed(0)}%
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl text-white font-medium disabled:opacity-50"
              onClick={handleEncrypt}
              disabled={
                encrypting ||
                !password ||
                !confirmPassword ||
                files.length === 0
              }
            >
              {encrypting ? "🔄 جاري التشفير..." : "🚀 بدء التشفير"}
            </button>
          </div>
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          معلومات الخوارزمية المحددة
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {algorithms
            .filter((a) => a.value === selectedAlgorithm)
            .map((algo) => (
              <div key={algo.value} className="glass-card p-4">
                <div className="text-lg font-medium text-white mb-2">
                  {algo.label}
                </div>
                <div className="text-sm text-white/70">{algo.description}</div>
                <div className="mt-3 text-xs text-white/50">
                  {algo.value === "AES-256" && "🏆 الأسرع والأكثر انتشاراً"}
                  {algo.value === "Serpent" && "🛡️ الأكثر أماناً"}
                  {algo.value === "Twofish" && "⚖️ توازن مثالي"}
                  {algo.value === "AES-Serpent-Twofish" && "👑 ملك الأمان"}
                </div>
              </div>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

const QuantumPage: React.FC = () => (
  <motion.div
    className="space-y-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="glass-card-strong p-8">
      <h1 className="text-3xl font-bold text-gradient mb-4">
        ⚛️ التشفير الكمي
      </h1>
      <p className="text-white/70 text-lg">
        مقاوم للكمبيوتر الكمي - تقنية المستقبل
      </p>
      <div className="inline-flex items-center gap-2 mt-4 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
        ⚠️ تجريبي - قيد التطوير
      </div>
    </div>

    <div className="glass-card p-6">
      <h2 className="text-xl font-bold text-white mb-4">
        مقاومة الكمبيوتر الكمي
      </h2>
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🔬</div>
        <div className="text-white/70">تقنية التشفير الكمي قي�� التطوير</div>
        <div className="text-white/50 mt-2">ستكون متاحة في الإصدار القادم</div>
      </div>
    </div>
  </motion.div>
);

const ThreatDetectionPage: React.FC = () => (
  <motion.div
    className="space-y-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="glass-card-strong p-8">
      <h1 className="text-3xl font-bold text-gradient mb-4">
        🛡️ كشف التهديدات
      </h1>
      <p className="text-white/70 text-lg">مراقبة فورية للتهديدات الأمنية</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="glass-card p-6">
        <h3 className="font-bold text-white mb-4">حالة الحماية</h3>
        <div className="text-center">
          <div className="text-4xl mb-2">🛡️</div>
          <div className="text-green-400 font-bold">محمي</div>
          <div className="text-sm text-white/60 mt-1">آخر فحص: قبل 5 دقائق</div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="font-bold text-white mb-4">التهديدات المحجوبة</h3>
        <div className="text-center">
          <div className="text-4xl mb-2">🚫</div>
          <div className="text-red-400 font-bold text-2xl">0</div>
          <div className="text-sm text-white/60 mt-1">اليوم</div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="font-bold text-white mb-4">مستوى الأمان</h3>
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <div className="text-green-400 font-bold text-2xl">98%</div>
          <div className="text-sm text-white/60 mt-1">ممتاز</div>
        </div>
      </div>
    </div>
  </motion.div>
);

const SettingsPage: React.FC = () => (
  <motion.div
    className="space-y-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="glass-card-strong p-8">
      <h1 className="text-3xl font-bold text-gradient mb-4">⚙️ الإعدادات</h1>
      <p className="text-white/70 text-lg">تخصيص إعدادات النظام</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-4">الأمان</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white/70">التشفير التلقائي</span>
            <div className="w-12 h-6 bg-green-500 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/70">المصادقة الثنائية</span>
            <div className="w-12 h-6 bg-green-500 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/70">حفظ كلمات المرور</span>
            <div className="w-12 h-6 bg-gray-500 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-4">الواجهة</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-2">ا��لغة</label>
            <select className="w-full glass-button p-2">
              <option>العربية</option>
              <option>English</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-2">السمة</label>
            <select className="w-full glass-button p-2">
              <option>داكن</option>
              <option>فاتح</option>
              <option>تلقائي</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/70">الحركات المتقدمة</span>
            <div className="w-12 h-6 bg-green-500 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const LogsPage: React.FC = () => (
  <motion.div
    className="space-y-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="glass-card-strong p-8">
      <h1 className="text-3xl font-bold text-gradient mb-4">📝 سجل النشاط</h1>
      <p className="text-white/70 text-lg">سجل العمليات والأحداث</p>
    </div>

    <div className="glass-card p-6">
      <div className="space-y-3">
        {[
          {
            time: "14:23:45",
            action: "تم تشفير ملف: document.pdf",
            type: "encrypt",
            status: "success",
          },
          {
            time: "14:20:12",
            action: "فحص أمني للنظام",
            type: "scan",
            status: "success",
          },
          {
            time: "14:15:33",
            action: "تسجيل دخول المستخدم",
            type: "auth",
            status: "success",
          },
          {
            time: "14:10:08",
            action: "تحديث قاعدة البيانات",
            type: "system",
            status: "success",
          },
          {
            time: "14:05:22",
            action: "فك تشفير ملف: report.xlsx",
            type: "decrypt",
            status: "success",
          },
        ].map((log, index) => (
          <div key={index} className="glass-card p-4 flex items-center gap-4">
            <div className="text-xs text-white/60 font-mono">{log.time}</div>
            <div className="flex-1 text-white/80">{log.action}</div>
            <div
              className={`px-2 py-1 rounded-full text-xs ${
                log.status === "success"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {log.status === "success" ? "✓ نجح" : "✗ فشل"}
            </div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);
