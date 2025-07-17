import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SystemAnalyzer, {
  SystemAnalysisResult,
} from "../../services/SystemAnalyzer";
import EncryptionService, {
  EncryptionProgress,
  BitLockerOptions,
  VeraCryptOptions,
  BackupOptions,
  RecoveryKeyInfo,
} from "../../services/EncryptionService";

interface RealTimeMetrics {
  cpuUsage: number;
  memoryUsage: number;
  networkActivity: number;
  diskActivity: number;
  activeThreats: number;
}

export const SystemEncryption: React.FC = () => {
  const [systemAnalysis, setSystemAnalysis] =
    useState<SystemAnalysisResult | null>(null);
  const [realTimeMetrics, setRealTimeMetrics] =
    useState<RealTimeMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedEncryptionMethod, setSelectedEncryptionMethod] = useState<
    "bitlocker" | "veracrypt" | null
  >(null);
  const [showEncryptionWizard, setShowEncryptionWizard] = useState(false);
  const [activeOperation, setActiveOperation] = useState<string | null>(null);
  const [operationProgress, setOperationProgress] =
    useState<EncryptionProgress | null>(null);
  const [showBackupWizard, setShowBackupWizard] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState<RecoveryKeyInfo | null>(null);
  const [wizardStep, setWizardStep] = useState(0);

  // Load system analysis on mount
  useEffect(() => {
    performSystemAnalysis();
    const interval = setInterval(updateRealTimeMetrics, 2000);
    return () => clearInterval(interval);
  }, []);

  const performSystemAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const analysis = await SystemAnalyzer.analyzeSystem();
      setSystemAnalysis(analysis);
    } catch (error) {
      console.error("System analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateRealTimeMetrics = async () => {
    try {
      const metrics = await SystemAnalyzer.getRealTimeStatus();
      setRealTimeMetrics(metrics);
    } catch (error) {
      console.error("Failed to update real-time metrics:", error);
    }
  };

  const handleStartEncryption = useCallback(
    (method: "bitlocker" | "veracrypt") => {
      setSelectedEncryptionMethod(method);
      setShowEncryptionWizard(true);
      setWizardStep(0);
    },
    [],
  );

  const processEncryption = async (
    options: BitLockerOptions | VeraCryptOptions,
  ) => {
    try {
      let operationId: string;

      if (selectedEncryptionMethod === "bitlocker") {
        operationId = await EncryptionService.startBitLockerEncryption(
          "C:",
          options as BitLockerOptions,
          setOperationProgress,
        );
      } else {
        operationId = await EncryptionService.startVeraCryptEncryption(
          "C:",
          options as VeraCryptOptions,
          setOperationProgress,
        );
      }

      setActiveOperation(operationId);
      setShowEncryptionWizard(false);
    } catch (error) {
      console.error("Encryption failed:", error);
    }
  };

  const createSystemBackup = async (options: BackupOptions) => {
    try {
      const operationId = await EncryptionService.createSystemBackup(
        options,
        setOperationProgress,
      );
      setActiveOperation(operationId);
      setShowBackupWizard(false);
    } catch (error) {
      console.error("Backup creation failed:", error);
    }
  };

  const generateRecoveryKey = async () => {
    try {
      const key = await EncryptionService.generateRecoveryKey(
        selectedEncryptionMethod === "bitlocker" ? "BitLocker" : "VeraCrypt",
        "C:",
        ["Desktop", "Cloud", "Print"],
      );
      setRecoveryKey(key);
    } catch (error) {
      console.error("Recovery key generation failed:", error);
    }
  };

  const getSystemHealthColor = (score: number) => {
    if (score >= 80) return "#059669";
    if (score >= 60) return "#F59E0B";
    return "#DC2626";
  };

  const getEncryptionStatusColor = () => {
    if (!systemAnalysis) return "#6B7280";
    return systemAnalysis.security.bitlocker.enabled ? "#059669" : "#DC2626";
  };

  const getEncryptionStatusText = () => {
    if (!systemAnalysis) return "جاري التحليل...";
    return systemAnalysis.security.bitlocker.enabled
      ? "النظام محمي"
      : "النظام غير محمي";
  };

  const getEncryptionStatusIcon = () => {
    if (!systemAnalysis) return "🔍";
    return systemAnalysis.security.bitlocker.enabled ? "🛡️" : "⚠️";
  };

  if (isAnalyzing) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            className="glass-card p-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl mb-4">تحليل النظام الشامل</h2>
            <p className="text-gray-400 mb-6">
              جاري فحص الأمان والبحث عن الثغرات...
            </p>
            <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                animate={{ width: ["0%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>تشفير النظام الكامل</h1>
        <p>حماية شاملة متقدمة لقرص النظام الرئيسي</p>
        <button
          className="refresh-btn"
          onClick={performSystemAnalysis}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? "🔄 جاري التحليل..." : "🔄 إعادة التحليل"}
        </button>
      </motion.div>

      <div className="system-encryption-content">
        {/* Real-time System Status Dashboard */}
        <motion.div
          className="glass-card system-dashboard mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="dashboard-header mb-6">
            <h3 className="text-2xl font-bold">لوحة المراقبة المباشرة</h3>
            <div className="status-indicators">
              <div className="indicator">
                <span className="indicator-dot online"></span>
                <span>نشط</span>
              </div>
            </div>
          </div>

          <div className="metrics-grid">
            {realTimeMetrics && (
              <>
                <div className="metric-card">
                  <div className="metric-icon">💻</div>
                  <div className="metric-info">
                    <span className="metric-value">
                      {realTimeMetrics.cpuUsage.toFixed(1)}%
                    </span>
                    <span className="metric-label">استخدام المعالج</span>
                  </div>
                  <div className="metric-chart">
                    <div
                      className="metric-bar"
                      style={{ width: `${realTimeMetrics.cpuUsage}%` }}
                    />
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon">🧠</div>
                  <div className="metric-info">
                    <span className="metric-value">
                      {realTimeMetrics.memoryUsage.toFixed(1)}%
                    </span>
                    <span className="metric-label">استخدام الذاكرة</span>
                  </div>
                  <div className="metric-chart">
                    <div
                      className="metric-bar"
                      style={{ width: `${realTimeMetrics.memoryUsage}%` }}
                    />
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon">🌐</div>
                  <div className="metric-info">
                    <span className="metric-value">
                      {realTimeMetrics.networkActivity.toFixed(0)}
                    </span>
                    <span className="metric-label">نشاط الشبكة</span>
                  </div>
                  <div className="metric-chart">
                    <div
                      className="metric-bar"
                      style={{
                        width: `${Math.min(realTimeMetrics.networkActivity, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon">💾</div>
                  <div className="metric-info">
                    <span className="metric-value">
                      {realTimeMetrics.diskActivity.toFixed(0)}
                    </span>
                    <span className="metric-label">نشاط القرص</span>
                  </div>
                  <div className="metric-chart">
                    <div
                      className="metric-bar"
                      style={{
                        width: `${Math.min(realTimeMetrics.diskActivity, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* System Status Card */}
        {systemAnalysis && (
          <motion.div
            className="glass-card system-status-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="status-header">
              <div className="status-icon">{getEncryptionStatusIcon()}</div>
              <div className="status-text">
                <h3 style={{ color: getEncryptionStatusColor() }}>
                  {getEncryptionStatusText()}
                </h3>
                <p>حالة تشفير النظام الحالية</p>
              </div>
              <div className="security-scores">
                <div className="score-circle">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path
                      className="circle-bg"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="circle"
                      strokeDasharray={`${systemAnalysis.securityScore}, 100`}
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      style={{
                        stroke: getSystemHealthColor(
                          systemAnalysis.securityScore,
                        ),
                      }}
                    />
                    <text x="18" y="20.35" className="percentage">
                      {systemAnalysis.securityScore}
                    </text>
                  </svg>
                  <span className="score-label">نقاط الأمان</span>
                </div>
                <div className="score-circle">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path
                      className="circle-bg"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="circle"
                      strokeDasharray={`${100 - systemAnalysis.riskScore}, 100`}
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      style={{
                        stroke: getSystemHealthColor(
                          100 - systemAnalysis.riskScore,
                        ),
                      }}
                    />
                    <text x="18" y="20.35" className="percentage">
                      {100 - systemAnalysis.riskScore}
                    </text>
                  </svg>
                  <span className="score-label">مستوى الحماية</span>
                </div>
              </div>
            </div>

            <div className="system-details">
              <div className="detail-section">
                <h4>معلومات النظام</h4>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">نظام التشغيل:</span>
                    <span className="detail-value">
                      {systemAnalysis.systemInfo.os}{" "}
                      {systemAnalysis.systemInfo.version}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">البناء:</span>
                    <span className="detail-value">
                      {systemAnalysis.systemInfo.build}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">المعمارية:</span>
                    <span className="detail-value">
                      {systemAnalysis.systemInfo.architecture}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">المعالج:</span>
                    <span className="detail-value">
                      {systemAnalysis.hardware.processor}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">الذا��رة:</span>
                    <span className="detail-value">
                      {Math.round(systemAnalysis.hardware.totalRAM / 1024 ** 3)}{" "}
                      GB
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">اللوحة الأم:</span>
                    <span className="detail-value">
                      {systemAnalysis.hardware.motherboard}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>حالة الأمان</h4>
                <div className="security-status-grid">
                  <div
                    className={`security-item ${systemAnalysis.security.tpm.present ? "enabled" : "disabled"}`}
                  >
                    <span className="security-icon">
                      {systemAnalysis.security.tpm.present ? "✅" : "❌"}
                    </span>
                    <div>
                      <span className="security-label">TPM متاح:</span>
                      <span className="security-value">
                        {systemAnalysis.security.tpm.present
                          ? `نعم (${systemAnalysis.security.tpm.version})`
                          : "لا"}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`security-item ${systemAnalysis.security.secureBoot.enabled ? "enabled" : "disabled"}`}
                  >
                    <span className="security-icon">
                      {systemAnalysis.security.secureBoot.enabled ? "✅" : "❌"}
                    </span>
                    <div>
                      <span className="security-label">Secure Boot:</span>
                      <span className="security-value">
                        {systemAnalysis.security.secureBoot.enabled
                          ? "مفعل"
                          : "معطل"}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`security-item ${systemAnalysis.security.bitlocker.enabled ? "enabled" : "disabled"}`}
                  >
                    <span className="security-icon">
                      {systemAnalysis.security.bitlocker.enabled ? "✅" : "❌"}
                    </span>
                    <div>
                      <span className="security-label">BitLocker:</span>
                      <span className="security-value">
                        {systemAnalysis.security.bitlocker.enabled
                          ? "مفعل"
                          : "معطل"}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`security-item ${systemAnalysis.security.firewall.enabled ? "enabled" : "disabled"}`}
                  >
                    <span className="security-icon">
                      {systemAnalysis.security.firewall.enabled ? "✅" : "❌"}
                    </span>
                    <div>
                      <span className="security-label">جدار الحماية:</span>
                      <span className="security-value">
                        {systemAnalysis.security.firewall.enabled
                          ? "مفعل"
                          : "معطل"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Vulnerabilities Alert */}
        {systemAnalysis && systemAnalysis.vulnerabilities.issues.length > 0 && (
          <motion.div
            className="glass-card vulnerabilities-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="vulnerabilities-header">
              <h3>
                ⚠️ تحذيرات الأمان (
                {systemAnalysis.vulnerabilities.issues.length})
              </h3>
              <span
                className={`severity-badge ${systemAnalysis.vulnerabilities.severity}`}
              >
                {systemAnalysis.vulnerabilities.severity === "critical"
                  ? "حرج"
                  : systemAnalysis.vulnerabilities.severity === "high"
                    ? "عالي"
                    : systemAnalysis.vulnerabilities.severity === "medium"
                      ? "متوسط"
                      : "منخفض"}
              </span>
            </div>
            <div className="vulnerabilities-list">
              {systemAnalysis.vulnerabilities.issues.map((issue, index) => (
                <motion.div
                  key={issue.id}
                  className="vulnerability-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="vulnerability-content">
                    <h4>{issue.title}</h4>
                    <p className="vulnerability-description">
                      {issue.description}
                    </p>
                    <p className="vulnerability-impact">
                      التأثير: {issue.impact}
                    </p>
                    <p className="vulnerability-recommendation">
                      التوصية: {issue.recommendation}
                    </p>
                  </div>
                  {issue.automated_fix && (
                    <button className="btn btn-primary btn-sm">
                      🔧 إصلاح تلقائي
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Encryption Options */}
        {!activeOperation && (
          <motion.div
            className="encryption-options"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="glass-card options-card">
              <h3>خيارات التشفير المتقدمة</h3>

              <div className="encryption-methods">
                <motion.div
                  className="method-card bitlocker-card"
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(0,100,200,0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="method-header">
                    <div className="method-icon">🔐</div>
                    <div className="method-badge recommended">موصى به</div>
                  </div>
                  <div className="method-info">
                    <h4>BitLocker Enterprise</h4>
                    <p>تشفير Windows الأصلي مع دعم TPM متقدم</p>
                    <div className="method-features">
                      <span className="feature">⚡ سرعة عالية في الأداء</span>
                      <span className="feature">🏢 دعم كامل من Microsoft</span>
                      <span className="feature">
                        🔗 تكامل مع Active Directory
                      </span>
                      <span className="feature">🛡️ حماية TPM 2.0</span>
                    </div>
                    <div className="method-specs">
                      <div className="spec">
                        <span>خوارزمية:</span>
                        <span>AES-256 XTS</span>
                      </div>
                      <div className="spec">
                        <span>وقت التشفير:</span>
                        <span>~30 دقيقة</span>
                      </div>
                      <div className="spec">
                        <span>تأثير الأداء:</span>
                        <span>&lt;3%</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary method-btn"
                    onClick={() => handleStartEncryption("bitlocker")}
                    disabled={systemAnalysis?.security.bitlocker.enabled}
                  >
                    {systemAnalysis?.security.bitlocker.enabled
                      ? "✅ مفعل بالفعل"
                      : "🚀 بدء تشفير BitLocker"}
                  </button>
                </motion.div>

                <motion.div
                  className="method-card veracrypt-card"
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(100,0,200,0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="method-header">
                    <div className="method-icon">🔒</div>
                    <div className="method-badge advanced">متقدم</div>
                  </div>
                  <div className="method-info">
                    <h4>VeraCrypt Professional</h4>
                    <p>تشفير متقدم مع خيارات احترافية</p>
                    <div className="method-features">
                      <span className="feature">🔐 خوارزميات متعددة</span>
                      <span className="feature">👁️‍🗨️ مجلدات مخفية</span>
                      <span className="feature">🔓 مفتوح المصدر</span>
                      <span className="feature">🛡️ حماية ضد التحليل</span>
                    </div>
                    <div className="method-specs">
                      <div className="spec">
                        <span>خوارزمية:</span>
                        <span>AES-Serpent-Twofish</span>
                      </div>
                      <div className="spec">
                        <span>وقت التشفير:</span>
                        <span>~45 دقيقة</span>
                      </div>
                      <div className="spec">
                        <span>تأثير الأداء:</span>
                        <span>&lt;5%</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn btn-secondary method-btn"
                    onClick={() => handleStartEncryption("veracrypt")}
                  >
                    🔧 تكوين VeraCrypt
                  </button>
                </motion.div>
              </div>

              <div className="preparation-section">
                <h4>🛠️ إجراءات التحضير</h4>
                <div className="preparation-steps">
                  <button
                    className="preparation-btn"
                    onClick={() => setShowBackupWizard(true)}
                  >
                    <span className="prep-icon">💾</span>
                    <div>
                      <span className="prep-title">
                        إنشاء نسخة احتياطية شاملة
                      </span>
                      <span className="prep-desc">
                        حماية البيانات قبل التشفير
                      </span>
                    </div>
                    <span className="prep-arrow">→</span>
                  </button>
                  <button
                    className="preparation-btn"
                    onClick={generateRecoveryKey}
                  >
                    <span className="prep-icon">🔑</span>
                    <div>
                      <span className="prep-title">إنشاء مفتاح الاستعادة</span>
                      <span className="prep-desc">
                        مفتاح طوارئ للوصول للبيانات
                      </span>
                    </div>
                    <span className="prep-arrow">→</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Operation Progress */}
        {activeOperation && operationProgress && (
          <motion.div
            className="glass-card progress-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="progress-header">
              <h3>
                {operationProgress.phase === "preparing" &&
                  "🔍 تجهيز العملية..."}
                {operationProgress.phase === "analyzing" && "🔬 تحليل القرص..."}
                {operationProgress.phase === "encrypting" &&
                  "🔐 جاري التشفير..."}
                {operationProgress.phase === "finalizing" &&
                  "✨ إنهاء العملية..."}
                {operationProgress.phase === "completed" &&
                  "✅ تم التشفير بنجاح!"}
                {operationProgress.phase === "error" && "❌ حدث خطأ في العملية"}
              </h3>
              <div className="progress-stats">
                <span className="progress-percentage">
                  {operationProgress.percentage}%
                </span>
                <span className="progress-speed">
                  {operationProgress.speed.toFixed(1)} MB/s
                </span>
              </div>
            </div>

            <div className="progress-visual">
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  animate={{ width: `${operationProgress.percentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="progress-steps">
                {Array.from(
                  { length: operationProgress.totalSteps },
                  (_, i) => (
                    <div
                      key={i}
                      className={`step ${i <= operationProgress.currentStepIndex ? "completed" : ""} ${i === operationProgress.currentStepIndex ? "active" : ""}`}
                    />
                  ),
                )}
              </div>
            </div>

            <div className="progress-details">
              <div className="current-step">
                <span className="step-label">الخطوة الحالية:</span>
                <span className="step-text">
                  {operationProgress.currentStep}
                </span>
              </div>
              <div className="progress-info">
                <div className="info-item">
                  <span>الوقت المتبقي:</span>
                  <span>
                    {Math.ceil(operationProgress.estimatedTimeRemaining / 60)}{" "}
                    دقيقة
                  </span>
                </div>
                <div className="info-item">
                  <span>البيانات المعالجة:</span>
                  <span>
                    {(operationProgress.processedBytes / 1024 ** 3).toFixed(1)}{" "}
                    GB
                  </span>
                </div>
                <div className="info-item">
                  <span>إجمالي البيانات:</span>
                  <span>
                    {(operationProgress.totalBytes / 1024 ** 3).toFixed(1)} GB
                  </span>
                </div>
              </div>

              {operationProgress.warnings.length > 0 && (
                <div className="warnings">
                  {operationProgress.warnings.map((warning, index) => (
                    <div key={index} className="warning-item">
                      ⚠️ {warning}
                    </div>
                  ))}
                </div>
              )}

              {operationProgress.errors.length > 0 && (
                <div className="errors">
                  {operationProgress.errors.map((error, index) => (
                    <div key={index} className="error-item">
                      ❌ {error}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {operationProgress.phase !== "completed" &&
              operationProgress.phase !== "error" && (
                <div className="progress-actions">
                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      EncryptionService.cancelOperation(activeOperation)
                    }
                  >
                    ⏹️ إيقاف العملية
                  </button>
                </div>
              )}
          </motion.div>
        )}

        {/* Security Recommendations */}
        {systemAnalysis && (
          <motion.div
            className="glass-card recommendations-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3>🎯 توصيات الأمان الذكية</h3>
            <div className="recommendations-list">
              {systemAnalysis.recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  className={`recommendation-item priority-${rec.priority}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="rec-priority">
                    {rec.priority === "critical" && "🔴"}
                    {rec.priority === "high" && "🟡"}
                    {rec.priority === "medium" && "🔵"}
                    {rec.priority === "low" && "🟢"}
                  </div>
                  <div className="rec-content">
                    <h4>{rec.action}</h4>
                    <p>{rec.description}</p>
                    <div className="rec-meta">
                      <span>الوقت المتوقع: {rec.estimatedTime} دقيقة</span>
                      <span className="rec-category">{rec.category}</span>
                    </div>
                  </div>
                  {rec.automated && (
                    <button className="btn btn-primary btn-sm">
                      🤖 تنفيذ تلقائي
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Encryption Wizard Modal */}
      <AnimatePresence>
        {showEncryptionWizard && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content glass-card encryption-wizard"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              <div className="wizard-header">
                <h3>
                  {selectedEncryptionMethod === "bitlocker"
                    ? "🔐 معالج تشفير BitLocker"
                    : "🔒 معالج تشفير VeraCrypt"}
                </h3>
                <button
                  className="close-btn"
                  onClick={() => setShowEncryptionWizard(false)}
                >
                  ✕
                </button>
              </div>

              <div className="wizard-content">
                {wizardStep === 0 && (
                  <div className="wizard-step">
                    <h4>إعدادات التشفير</h4>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(
                          e.target as HTMLFormElement,
                        );
                        if (selectedEncryptionMethod === "bitlocker") {
                          const options: BitLockerOptions = {
                            algorithm: formData.get("algorithm") as any,
                            keyProtectors: [
                              { type: "TPM" },
                              { type: "RecoveryPassword" },
                            ],
                            recoveryOptions: {
                              saveToFile: true,
                              saveToAD: false,
                              printRecoveryKey: true,
                            },
                            encryptUsedSpaceOnly: false,
                            skipHardwareTest: false,
                          };
                          processEncryption(options);
                        } else {
                          const options: VeraCryptOptions = {
                            algorithm: formData.get("algorithm") as any,
                            hashAlgorithm: "SHA-256",
                            password: formData.get("password") as string,
                            hiddenVolume: formData.get("hiddenVolume") === "on",
                            quickFormat: false,
                            clusterSize: 4096,
                            filesystem: "NTFS",
                            randomPool: true,
                          };
                          processEncryption(options);
                        }
                      }}
                    >
                      <div className="form-group">
                        <label>خوارزمية التشفير:</label>
                        <select
                          name="algorithm"
                          defaultValue={
                            selectedEncryptionMethod === "bitlocker"
                              ? "XTS-AES256"
                              : "AES-Serpent-Twofish"
                          }
                        >
                          {selectedEncryptionMethod === "bitlocker" ? (
                            <>
                              <option value="XTS-AES256">
                                AES-256 XTS (موصى به)
                              </option>
                              <option value="XTS-AES128">AES-128 XTS</option>
                            </>
                          ) : (
                            <>
                              <option value="AES-Serpent-Twofish">
                                AES-Serpent-Twofish (أقصى أمان)
                              </option>
                              <option value="AES">AES (سريع)</option>
                              <option value="Serpent">Serpent (آمن)</option>
                              <option value="Twofish">Twofish (متوازن)</option>
                            </>
                          )}
                        </select>
                      </div>

                      {selectedEncryptionMethod === "veracrypt" && (
                        <>
                          <div className="form-group">
                            <label>كلمة المرور:</label>
                            <input
                              type="password"
                              name="password"
                              required
                              placeholder="أدخل كلمة مرور قوية (12+ حرف)"
                              minLength={12}
                            />
                          </div>
                          <div className="form-group">
                            <label>
                              <input type="checkbox" name="hiddenVolume" />
                              إنشاء مجلد مخفي (اختياري)
                            </label>
                          </div>
                        </>
                      )}

                      <div className="form-actions">
                        <button
                          type="button"
                          onClick={() => setShowEncryptionWizard(false)}
                        >
                          إلغاء
                        </button>
                        <button type="submit" className="btn-primary">
                          🚀 بدء التشفير
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backup Wizard Modal */}
      <AnimatePresence>
        {showBackupWizard && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content glass-card backup-wizard"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              <div className="wizard-header">
                <h3>💾 معالج النسخ الاحتياطي</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowBackupWizard(false)}
                >
                  ✕
                </button>
              </div>

              <div className="wizard-content">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const options: BackupOptions = {
                      createSystemBackup: true,
                      backupLocation: formData.get("location") as string,
                      compressionLevel: formData.get("compression") as any,
                      encryption: formData.get("encryption") === "on",
                      backupPassword: formData.get("backupPassword") as string,
                      verifyBackup: true,
                      estimatedSize: 50 * 1024 * 1024 * 1024, // 50GB
                      estimatedTime: 60, // 60 minutes
                    };
                    createSystemBackup(options);
                  }}
                >
                  <div className="form-group">
                    <label>موقع النسخة الاحتياطية:</label>
                    <input
                      type="text"
                      name="location"
                      required
                      placeholder="D:\Backups\SystemBackup"
                      defaultValue="D:\Backups\SystemBackup"
                    />
                  </div>

                  <div className="form-group">
                    <label>مستوى الضغط:</label>
                    <select name="compression" defaultValue="normal">
                      <option value="none">بدون ضغط (سريع)</option>
                      <option value="fast">ضغط سريع</option>
                      <option value="normal">ضغط عادي (موصى ب��)</option>
                      <option value="maximum">ضغط أقصى (بطيء)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>
                      <input type="checkbox" name="encryption" defaultChecked />
                      تشفير النسخة الاحتياطية
                    </label>
                  </div>

                  <div className="form-group">
                    <label>كلمة مرور النسخة الاحتياطية:</label>
                    <input
                      type="password"
                      name="backupPassword"
                      placeholder="كلمة مرور لحماية النسخة الاحتياطية"
                    />
                  </div>

                  <div className="backup-info">
                    <div className="info-item">
                      <span>الحجم المتوقع:</span>
                      <span>~50 GB</span>
                    </div>
                    <div className="info-item">
                      <span>الوقت المتوقع:</span>
                      <span>~60 دقيقة</span>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={() => setShowBackupWizard(false)}
                    >
                      إلغاء
                    </button>
                    <button type="submit" className="btn-primary">
                      💾 إنشاء النسخة الاحتياطية
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recovery Key Modal */}
      <AnimatePresence>
        {recoveryKey && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content glass-card recovery-key-modal"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              <div className="recovery-header">
                <h3>🔑 مفتاح الاستعادة</h3>
                <button
                  className="close-btn"
                  onClick={() => setRecoveryKey(null)}
                >
                  ✕
                </button>
              </div>

              <div className="recovery-content">
                <div className="recovery-warning">
                  <span className="warning-icon">⚠️</span>
                  <p>
                    احتفظ بهذا المفتاح في مكان آمن! لن تتمكن من الوصول لبياناتك
                    بدونه.
                  </p>
                </div>

                <div className="recovery-key-display">
                  <pre>{recoveryKey.printableFormat}</pre>
                </div>

                <div className="recovery-actions">
                  <button className="btn btn-secondary">💾 حفظ في ملف</button>
                  <button className="btn btn-secondary">🖨️ طباعة</button>
                  <button className="btn btn-secondary">
                    ☁️ حفظ في السحابة
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => setRecoveryKey(null)}
                  >
                    ✅ تم الحفظ
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
