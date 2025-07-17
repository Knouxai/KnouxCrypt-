import React, { useState } from "react";
import { motion } from "framer-motion";

interface Algorithm {
  name: string;
  keySize: string;
  blockSize: string;
  rounds: number;
  performance: "عالي" | "متوسط" | "منخفض";
  security: "ممتاز" | "عالي" | "جيد";
  description: string;
  icon: string;
  recommended: boolean;
}

interface HashAlgorithm {
  name: string;
  outputSize: string;
  blockSize: string;
  performance: "عالي" | "متوسط" | "منخفض";
  security: "ممتاز" | "عالي" | "جيد";
  description: string;
  icon: string;
}

const encryptionAlgorithms: Algorithm[] = [
  {
    name: "AES-256",
    keySize: "256-bit",
    blockSize: "128-bit",
    rounds: 14,
    performance: "عالي",
    security: "ممتاز",
    description: "المعيار المتقدم للتشفير - الخيار الأكثر شيوعاً وأماناً",
    icon: "🛡️",
    recommended: true,
  },
  {
    name: "Serpent",
    keySize: "256-bit",
    blockSize: "128-bit",
    rounds: 32,
    performance: "متوسط",
    security: "ممتاز",
    description: "خوارزمية عالية الأمان مع 32 دورة تشفير",
    icon: "🐍",
    recommended: false,
  },
  {
    name: "Twofish",
    keySize: "256-bit",
    blockSize: "128-bit",
    rounds: 16,
    performance: "عالي",
    security: "ممتاز",
    description: "خوارزمية سريعة وآمنة مع بنية Feistel",
    icon: "🐟",
    recommended: false,
  },
  {
    name: "AES-Serpent-Twofish",
    keySize: "256-bit x3",
    blockSize: "128-bit",
    rounds: 62,
    performance: "منخفض",
    security: "ممتاز",
    description: "تشفير ثلاثي متتالي للحماية القصوى",
    icon: "🔐",
    recommended: false,
  },
];

const hashAlgorithms: HashAlgorithm[] = [
  {
    name: "SHA-256",
    outputSize: "256-bit",
    blockSize: "512-bit",
    performance: "عالي",
    security: "ممتاز",
    description: "خوارزمية الهاش الأكثر استخداماً وأماناً",
    icon: "#️⃣",
  },
  {
    name: "SHA-512",
    outputSize: "512-bit",
    blockSize: "1024-bit",
    performance: "متوسط",
    security: "ممتاز",
    description: "إصدار محسن من SHA مع مخرجات أطول",
    icon: "#️⃣",
  },
  {
    name: "RIPEMD-160",
    outputSize: "160-bit",
    blockSize: "512-bit",
    performance: "عالي",
    security: "عالي",
    description: "خوارزمية أوروبية بديلة لـ SHA",
    icon: "#️⃣",
  },
  {
    name: "Whirlpool",
    outputSize: "512-bit",
    blockSize: "512-bit",
    performance: "متوسط",
    security: "ممتاز",
    description: "خوارزمية معتمدة من ISO/IEC",
    icon: "#️⃣",
  },
];

export const Algorithms: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<"encryption" | "hash">(
    "encryption",
  );
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(
    null,
  );

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "عالي":
        return "#059669";
      case "متوسط":
        return "#F59E0B";
      case "منخفض":
        return "#DC2626";
      default:
        return "#6B7280";
    }
  };

  const getSecurityColor = (security: string) => {
    switch (security) {
      case "ممتاز":
        return "#059669";
      case "عالي":
        return "#0EA5E9";
      case "جيد":
        return "#F59E0B";
      default:
        return "#6B7280";
    }
  };

  return (
    <div className="page-container">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>خوارزميات التشفير</h1>
        <p>معلومات مفصلة عن خوارزميات التشفير والهاش المدعومة</p>
      </motion.div>

      <div className="algorithms-content">
        {/* Tab Navigation */}
        <motion.div
          className="tab-navigation"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="glass-card tab-container">
            <button
              className={`tab-button ${selectedTab === "encryption" ? "active" : ""}`}
              onClick={() => setSelectedTab("encryption")}
            >
              🔐 خوارزميات التشفير
            </button>
            <button
              className={`tab-button ${selectedTab === "hash" ? "active" : ""}`}
              onClick={() => setSelectedTab("hash")}
            >
              #️⃣ خوارزميات الهاش
            </button>
          </div>
        </motion.div>

        {/* Encryption Algorithms */}
        {selectedTab === "encryption" && (
          <motion.div
            className="algorithms-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {encryptionAlgorithms.map((algorithm, index) => (
              <motion.div
                key={algorithm.name}
                className={`glass-card algorithm-card ${algorithm.recommended ? "recommended" : ""}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedAlgorithm(algorithm)}
              >
                {algorithm.recommended && (
                  <div className="recommended-badge">موصى به</div>
                )}

                <div className="algorithm-header">
                  <div className="algorithm-icon">{algorithm.icon}</div>
                  <div className="algorithm-info">
                    <h3>{algorithm.name}</h3>
                    <p>{algorithm.description}</p>
                  </div>
                </div>

                <div className="algorithm-specs">
                  <div className="spec-item">
                    <span className="spec-label">حجم المفتاح:</span>
                    <span className="spec-value">{algorithm.keySize}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">حجم البلوك:</span>
                    <span className="spec-value">{algorithm.blockSize}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">عدد الدورات:</span>
                    <span className="spec-value">{algorithm.rounds}</span>
                  </div>
                </div>

                <div className="algorithm-ratings">
                  <div className="rating-item">
                    <span className="rating-label">الأداء:</span>
                    <span
                      className="rating-value"
                      style={{
                        color: getPerformanceColor(algorithm.performance),
                      }}
                    >
                      {algorithm.performance}
                    </span>
                  </div>
                  <div className="rating-item">
                    <span className="rating-label">الأمان:</span>
                    <span
                      className="rating-value"
                      style={{ color: getSecurityColor(algorithm.security) }}
                    >
                      {algorithm.security}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Hash Algorithms */}
        {selectedTab === "hash" && (
          <motion.div
            className="algorithms-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {hashAlgorithms.map((algorithm, index) => (
              <motion.div
                key={algorithm.name}
                className="glass-card algorithm-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="algorithm-header">
                  <div className="algorithm-icon">{algorithm.icon}</div>
                  <div className="algorithm-info">
                    <h3>{algorithm.name}</h3>
                    <p>{algorithm.description}</p>
                  </div>
                </div>

                <div className="algorithm-specs">
                  <div className="spec-item">
                    <span className="spec-label">حجم الخرج:</span>
                    <span className="spec-value">{algorithm.outputSize}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">حجم البلوك:</span>
                    <span className="spec-value">{algorithm.blockSize}</span>
                  </div>
                </div>

                <div className="algorithm-ratings">
                  <div className="rating-item">
                    <span className="rating-label">الأداء:</span>
                    <span
                      className="rating-value"
                      style={{
                        color: getPerformanceColor(algorithm.performance),
                      }}
                    >
                      {algorithm.performance}
                    </span>
                  </div>
                  <div className="rating-item">
                    <span className="rating-label">الأمان:</span>
                    <span
                      className="rating-value"
                      style={{ color: getSecurityColor(algorithm.security) }}
                    >
                      {algorithm.security}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Algorithm Comparison */}
        <motion.div
          className="glass-card comparison-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h3>مقارنة الخوارزميات</h3>
          <div className="comparison-table">
            <div className="table-header">
              <span>الخوارزمية</span>
              <span>الأمان</span>
              <span>الأداء</span>
              <span>الاستخدام</span>
            </div>
            {encryptionAlgorithms.map((algorithm) => (
              <div key={algorithm.name} className="table-row">
                <span className="algorithm-name">
                  {algorithm.icon} {algorithm.name}
                </span>
                <span style={{ color: getSecurityColor(algorithm.security) }}>
                  {algorithm.security}
                </span>
                <span
                  style={{ color: getPerformanceColor(algorithm.performance) }}
                >
                  {algorithm.performance}
                </span>
                <span>
                  {algorithm.recommended ? "للاستخدام العام" : "للحالات الخاصة"}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Best Practices */}
        <motion.div
          className="glass-card practices-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <h3>أفضل الممارسات</h3>
          <div className="practices-list">
            <div className="practice-item">
              <span className="practice-icon">🎯</span>
              <div className="practice-content">
                <h4>استخدم AES-256 للاستخدام العام</h4>
                <p>AES-256 يوفر توازناً مثالياً بين الأمان والأداء</p>
              </div>
            </div>
            <div className="practice-item">
              <span className="practice-icon">🐍</span>
              <div className="practice-content">
                <h4>اختر Serpent لل��مان الإضافي</h4>
                <p>Serpent يوفر مستوى أمان أعلى مع تضحية طفيفة في الأداء</p>
              </div>
            </div>
            <div className="practice-item">
              <span className="practice-icon">🔐</span>
              <div className="practice-content">
                <h4>استخدم التشفير الثلاثي للحماية القصوى</h4>
                <p>AES-Serpent-Twofish للبيانات عالية الحساسية</p>
              </div>
            </div>
            <div className="practice-item">
              <span className="practice-icon">🔑</span>
              <div className="practice-content">
                <h4>قم بتغيير كلمات المرور بانتظام</h4>
                <p>حتى أقوى الخوارزميات تحتاج لكلمات مرور قوية</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
