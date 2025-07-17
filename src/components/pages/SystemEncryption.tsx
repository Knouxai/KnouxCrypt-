import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SystemInfo {
  os: string;
  version: string;
  architecture: string;
  totalRAM: string;
  bootDisk: string;
  bitlockerEnabled: boolean;
  tpmAvailable: boolean;
}

export const SystemEncryption: React.FC = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [encryptionStatus, setEncryptionStatus] = useState<
    "idle" | "analyzing" | "encrypting" | "encrypted"
  >("idle");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // محاكاة جلب معلومات النظام
    setTimeout(() => {
      setSystemInfo({
        os: "Windows 11 Pro",
        version: "22H2",
        architecture: "x64",
        totalRAM: "16 GB",
        bootDisk: "C: (NVMe SSD)",
        bitlockerEnabled: false,
        tpmAvailable: true,
      });
    }, 1000);
  }, []);

  const startSystemEncryption = async () => {
    setEncryptionStatus("analyzing");
    setProgress(0);

    // محاكاة عملية التحليل
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setProgress(i);
    }

    setEncryptionStatus("encrypting");
    setProgress(0);

    // محاكاة عملية التشفير
    for (let i = 0; i <= 100; i += 2) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setProgress(i);
    }

    setEncryptionStatus("encrypted");
  };

  const getSystemStatusColor = () => {
    if (systemInfo?.bitlockerEnabled) return "#059669";
    return "#DC2626";
  };

  const getSystemStatusText = () => {
    if (systemInfo?.bitlockerEnabled) return "النظام محمي";
    return "النظام غير محمي";
  };

  return (
    <div className="page-container">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>تشفير النظام الكامل</h1>
        <p>حماية شاملة لقرص النظام الرئيسي</p>
      </motion.div>

      <div className="system-encryption-content">
        {/* System Status Card */}
        <motion.div
          className="glass-card system-status-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="status-header">
            <div className="status-icon">
              {systemInfo?.bitlockerEnabled ? "🛡️" : "⚠️"}
            </div>
            <div className="status-text">
              <h3 style={{ color: getSystemStatusColor() }}>
                {getSystemStatusText()}
              </h3>
              <p>حالة تشفير النظام الحالية</p>
            </div>
          </div>

          {systemInfo && (
            <div className="system-details">
              <div className="detail-item">
                <span className="detail-label">نظام التشغيل:</span>
                <span className="detail-value">
                  {systemInfo.os} {systemInfo.version}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">المعمارية:</span>
                <span className="detail-value">{systemInfo.architecture}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">الذاكرة:</span>
                <span className="detail-value">{systemInfo.totalRAM}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">قرص النظام:</span>
                <span className="detail-value">{systemInfo.bootDisk}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">TPM متاح:</span>
                <span className="detail-value">
                  {systemInfo.tpmAvailable ? "✅ نعم" : "❌ لا"}
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Encryption Options */}
        <motion.div
          className="encryption-options"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="glass-card options-card">
            <h3>خيارات التشفير</h3>

            <div className="encryption-methods">
              <div className="method-card">
                <div className="method-icon">🔐</div>
                <div className="method-info">
                  <h4>BitLocker (موصى به)</h4>
                  <p>تشفير Windows الأصلي مع دعم TPM</p>
                  <ul>
                    <li>سرعة عالية في الأداء</li>
                    <li>دعم كامل من Microsoft</li>
                    <li>تكامل مع Active Directory</li>
                  </ul>
                </div>
                <button
                  className="btn btn-primary"
                  disabled={
                    systemInfo?.bitlockerEnabled || encryptionStatus !== "idle"
                  }
                  onClick={() => setShowConfirmDialog(true)}
                >
                  {systemInfo?.bitlockerEnabled
                    ? "مفعل بالفعل"
                    : "تفعيل BitLocker"}
                </button>
              </div>

              <div className="method-card">
                <div className="method-icon">🔒</div>
                <div className="method-info">
                  <h4>VeraCrypt للنظام</h4>
                  <p>تشفير متقدم مع خيارات إضافية</p>
                  <ul>
                    <li>خوارزميات متعددة</li>
                    <li>مجلدات مخفية</li>
                    <li>مفتوح المصدر</li>
                  </ul>
                </div>
                <button
                  className="btn btn-secondary"
                  disabled={encryptionStatus !== "idle"}
                >
                  تشفير VeraCrypt
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Encryption Progress */}
        <AnimatePresence>
          {encryptionStatus !== "idle" && (
            <motion.div
              className="glass-card progress-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="progress-header">
                <h3>
                  {encryptionStatus === "analyzing" && "🔍 تحليل النظام..."}
                  {encryptionStatus === "encrypting" && "🔐 جاري التشفير..."}
                  {encryptionStatus === "encrypted" && "✅ تم التشفير بنجاح!"}
                </h3>
                <span className="progress-percentage">{progress}%</span>
              </div>

              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="progress-info">
                {encryptionStatus === "analyzing" && (
                  <p>فحص أقسام القرص الصلب وتجهيز عملية التشفير...</p>
                )}
                {encryptionStatus === "encrypting" && (
                  <p>
                    تشفير البيانات باستخدام AES-256... الرجاء عدم إيقاف تشغيل
                    الجهاز.
                  </p>
                )}
                {encryptionStatus === "encrypted" && (
                  <p>
                    تم تشفير النظام بنجاح! سيتم إعادة تشغيل الجهاز تلقائياً.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Security Recommendations */}
        <motion.div
          className="glass-card recommendations-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3>توصيات الأمان</h3>
          <div className="recommendations-list">
            <div className="recommendation-item">
              <span className="rec-icon">🔑</span>
              <div className="rec-content">
                <h4>احتفظ بنسخة احتياطية من مفتاح الاستعادة</h4>
                <p>احفظ مفتاح الاستعادة في مكان آمن منفصل عن الجهاز</p>
              </div>
            </div>
            <div className="recommendation-item">
              <span className="rec-icon">🔄</span>
              <div className="rec-content">
                <h4>قم بتحديث النظام بانتظام</h4>
                <p>حافظ على تحديث Windows وبرامج الحماية</p>
              </div>
            </div>
            <div className="recommendation-item">
              <span className="rec-icon">💾</span>
              <div className="rec-content">
                <h4>أنشئ نسخة احتياطية كاملة</h4>
                <p>قم بإنشاء نسخة احتياطية كاملة قبل بدء التشفير</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content glass-card"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              <h3>تأكيد تشفير النظام</h3>
              <p>
                هل أنت متأكد من رغبتك في تشفير النظام بالكامل؟ ستحتاج إلى كلمة
                مرور أو مفتاح الاستعادة لتسجيل الدخول في المستقبل.
              </p>

              <div className="warning-box">
                <div className="warning-icon">⚠️</div>
                <div className="warning-text">
                  <strong>تحذير:</strong> تأكد من حفظ مفتاح الاستعادة في مكان
                  آمن قبل المتابعة.
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowConfirmDialog(false)}
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    setShowConfirmDialog(false);
                    startSystemEncryption();
                  }}
                >
                  ابدأ التشفير
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
