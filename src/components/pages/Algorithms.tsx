import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModernCard } from "../UI/ModernCard";
import { NeonButton2025 } from "../UI/NeonButton2025";
import { QuantumProgress } from "../UI/QuantumProgress";
import { useNotifications } from "../UI/QuantumNotification";
import {
  CipherFactory,
  SupportedCipherType,
} from "../../core/crypto/CipherFactory";
import {
  ICipher,
  CipherInfo,
  SecureKeyGenerator,
} from "../../core/crypto/ICipher";

interface AlgorithmDemo {
  algorithm: SupportedCipherType;
  cipher: ICipher | null;
  key: Buffer | null;
  info: CipherInfo | null;
  isActive: boolean;
}

interface TestResult {
  algorithm: string;
  originalText: string;
  encryptedHex: string;
  encryptedBase64: string;
  decryptedText: string;
  encryptionTime: number;
  decryptionTime: number;
  success: boolean;
  error?: string;
}

interface BenchmarkResult {
  algorithm: string;
  avgEncryptionTime: number;
  avgDecryptionTime: number;
  throughput: number; // chars per ms
  memoryUsage: string;
  security: number; // 1-10
  performance: number; // 1-10
}

export const Algorithms: React.FC = () => {
  const { addNotification } = useNotifications();
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "demo" | "benchmark" | "compare"
  >("overview");
  const [algorithms, setAlgorithms] = useState<AlgorithmDemo[]>([]);
  const [testInput, setTestInput] = useState(
    "🔐 هذا نص تجريبي للتشفير - صنع بروح أبو ريتاج 💥",
  );
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [benchmarkResults, setBenchmarkResults] = useState<BenchmarkResult[]>(
    [],
  );
  const [isRunningBenchmark, setIsRunningBenchmark] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<SupportedCipherType>("AES-256");
  const [customKey, setCustomKey] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // تحميل جميع الخوارزميات عند البداية
  useEffect(() => {
    initializeAlgorithms();
  }, []);

  const initializeAlgorithms = async () => {
    const supportedAlgorithms: SupportedCipherType[] = [
      "AES-256",
      "Serpent",
      "Twofish",
      "AES-Serpent-Twofish",
    ];
    const initializedAlgorithms: AlgorithmDemo[] = [];

    for (const algorithmType of supportedAlgorithms) {
      try {
        const key = CipherFactory.generateKeyForAlgorithm(algorithmType);
        const cipher = CipherFactory.createCipher(algorithmType, key);
        const info = cipher.getInfo();

        initializedAlgorithms.push({
          algorithm: algorithmType,
          cipher,
          key,
          info,
          isActive: true,
        });
      } catch (error) {
        console.error(`فشل في تحميل ${algorithmType}:`, error);
        initializedAlgorithms.push({
          algorithm: algorithmType,
          cipher: null,
          key: null,
          info: null,
          isActive: false,
        });
      }
    }

    setAlgorithms(initializedAlgorithms);
  };

  const runSingleTest = async (algorithmType: SupportedCipherType) => {
    const algorithm = algorithms.find((a) => a.algorithm === algorithmType);
    if (!algorithm || !algorithm.cipher) return;

    try {
      const startEncrypt = performance.now();
      const encrypted = algorithm.cipher.encrypt(testInput);
      const encryptTime = performance.now() - startEncrypt;

      const startDecrypt = performance.now();
      const decrypted = algorithm.cipher.decrypt(encrypted);
      const decryptTime = performance.now() - startDecrypt;

      const result: TestResult = {
        algorithm: algorithmType,
        originalText: testInput,
        encryptedHex: encrypted.toString("hex"),
        encryptedBase64: encrypted.toString("base64"),
        decryptedText: decrypted,
        encryptionTime: encryptTime,
        decryptionTime: decryptTime,
        success: decrypted === testInput,
      };

      setTestResults((prev) => [
        ...prev.filter((r) => r.algorithm !== algorithmType),
        result,
      ]);
    } catch (error) {
      const result: TestResult = {
        algorithm: algorithmType,
        originalText: testInput,
        encryptedHex: "",
        encryptedBase64: "",
        decryptedText: "",
        encryptionTime: 0,
        decryptionTime: 0,
        success: false,
        error: error.message,
      };

      setTestResults((prev) => [
        ...prev.filter((r) => r.algorithm !== algorithmType),
        result,
      ]);
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    for (const algorithm of algorithms) {
      if (algorithm.isActive) {
        await runSingleTest(algorithm.algorithm);
        // تأخير صغير لتحديث الواجهة
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  };

  const runBenchmark = async () => {
    setIsRunningBenchmark(true);
    setBenchmarkResults([]);

    const iterations = 50;
    const testData = "x".repeat(1024); // 1KB test data

    for (const algorithm of algorithms) {
      if (!algorithm.isActive || !algorithm.cipher) continue;

      try {
        let totalEncryptTime = 0;
        let totalDecryptTime = 0;

        for (let i = 0; i < iterations; i++) {
          const startEncrypt = performance.now();
          const encrypted = algorithm.cipher.encrypt(testData);
          const encryptTime = performance.now() - startEncrypt;
          totalEncryptTime += encryptTime;

          const startDecrypt = performance.now();
          algorithm.cipher.decrypt(encrypted);
          const decryptTime = performance.now() - startDecrypt;
          totalDecryptTime += decryptTime;
        }

        const avgEncryptTime = totalEncryptTime / iterations;
        const avgDecryptTime = totalDecryptTime / iterations;
        const throughput = testData.length / avgEncryptTime;

        const benchmarkResult: BenchmarkResult = {
          algorithm: algorithm.algorithm,
          avgEncryptionTime: avgEncryptTime,
          avgDecryptionTime: avgDecryptTime,
          throughput,
          memoryUsage: estimateMemoryUsage(algorithm.algorithm),
          security: getSecurityScore(algorithm.algorithm),
          performance: getPerformanceScore(avgEncryptTime + avgDecryptTime),
        };

        setBenchmarkResults((prev) => [...prev, benchmarkResult]);
      } catch (error) {
        console.error(`فشل في قياس ${algorithm.algorithm}:`, error);
      }
    }

    setIsRunningBenchmark(false);
  };

  const generateCustomKey = () => {
    const key = CipherFactory.generateKeyForAlgorithm(selectedAlgorithm);
    setCustomKey(key.toString("hex"));
  };

  const testWithCustomKey = async () => {
    if (!customKey) {
      alert("يرجى إدخال مفتاح صحيح");
      return;
    }

    try {
      const keyBuffer = Buffer.from(customKey, "hex");
      const cipher = CipherFactory.createCipher(selectedAlgorithm, keyBuffer);

      const encrypted = cipher.encrypt(testInput);
      const decrypted = cipher.decrypt(encrypted);

      const result: TestResult = {
        algorithm: `${selectedAlgorithm} (Custom Key)`,
        originalText: testInput,
        encryptedHex: encrypted.toString("hex"),
        encryptedBase64: encrypted.toString("base64"),
        decryptedText: decrypted,
        encryptionTime: 0,
        decryptionTime: 0,
        success: decrypted === testInput,
      };

      setTestResults((prev) => [result, ...prev]);
    } catch (error) {
      alert(`خطأ في المفتاح: ${error.message}`);
    }
  };

  // Helper functions
  const estimateMemoryUsage = (algorithm: string): string => {
    const usage = {
      "AES-256": "~64 KB",
      Serpent: "~128 KB",
      Twofish: "~96 KB",
      "AES-Serpent-Twofish": "~256 KB",
    };
    return usage[algorithm] || "~64 KB";
  };

  const getSecurityScore = (algorithm: string): number => {
    const scores = {
      "AES-256": 8,
      Serpent: 9,
      Twofish: 8,
      "AES-Serpent-Twofish": 10,
    };
    return scores[algorithm] || 5;
  };

  const getPerformanceScore = (totalTime: number): number => {
    if (totalTime < 1) return 10;
    if (totalTime < 2) return 8;
    if (totalTime < 5) return 6;
    if (totalTime < 10) return 4;
    return 2;
  };

  const getAlgorithmColor = (algorithm: string) => {
    const colors = {
      "AES-256": "#4F46E5",
      Serpent: "#059669",
      Twofish: "#DC2626",
      "AES-Serpent-Twofish": "#7C3AED",
    };
    return colors[algorithm] || "#6B7280";
  };

  return (
    <div className="page-container">
      <motion.div
        className="relative overflow-hidden rounded-3xl mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-cyan-600/20 backdrop-blur-sm" />
        <div className="relative p-8 text-center">
          <motion.div
            className="text-6xl mb-4"
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🔬
          </motion.div>
          <motion.h1
            className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            مختبر خوارزميات التشفير 2025
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            اختبر وقارن بين أقوى خوارزميات التشفير العسكرية
          </motion.p>
          <motion.div
            className="flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-sm font-medium">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse inline-block" />
              4 خوارزميات نشطة
            </div>
            <div className="px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-medium">
              مقاوم كمي
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Advanced Tab Navigation */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <ModernCard variant="hologram" className="p-4">
          <div className="flex justify-center gap-2">
            {[
              {
                id: "overview",
                label: "نظرة عامة",
                icon: "📋",
                gradient: "from-indigo-500 to-purple-600",
              },
              {
                id: "demo",
                label: "تجربة مباشرة",
                icon: "🧪",
                gradient: "from-emerald-500 to-teal-600",
              },
              {
                id: "benchmark",
                label: "قياس الأداء",
                icon: "⚡",
                gradient: "from-yellow-500 to-orange-600",
              },
              {
                id: "compare",
                label: "مقارنة متقدمة",
                icon: "📊",
                gradient: "from-pink-500 to-red-600",
              },
            ].map((tab, index) => (
              <motion.button
                key={tab.id}
                className={`
                  relative flex items-center gap-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300
                  ${
                    selectedTab === tab.id
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }
                `}
                onClick={() => setSelectedTab(tab.id as any)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                {selectedTab === tab.id && (
                  <motion.div
                    className="absolute inset-0 bg-white/20 rounded-2xl"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </ModernCard>
      </motion.div>

      <div className="algorithms-content">
        {/* Overview Tab */}
        {selectedTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="algorithms-grid">
              {algorithms.map((algorithm, index) => (
                <motion.div
                  key={algorithm.algorithm}
                  className={`glass-card algorithm-card ${algorithm.isActive ? "active" : "inactive"}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  style={{
                    borderLeft: `4px solid ${getAlgorithmColor(algorithm.algorithm)}`,
                  }}
                >
                  {algorithm.info && (
                    <>
                      <div className="algorithm-header">
                        <div
                          className="algorithm-icon"
                          style={{
                            color: getAlgorithmColor(algorithm.algorithm),
                          }}
                        >
                          {algorithm.algorithm === "AES-256" && "🛡️"}
                          {algorithm.algorithm === "Serpent" && "🐍"}
                          {algorithm.algorithm === "Twofish" && "🐟"}
                          {algorithm.algorithm === "AES-Serpent-Twofish" &&
                            "🔐"}
                        </div>
                        <div className="algorithm-info">
                          <h3>{algorithm.info.name}</h3>
                          <p>{algorithm.info.description}</p>
                        </div>
                        <div className="algorithm-badges">
                          <span
                            className={`security-badge ${algorithm.info.securityLevel}`}
                          >
                            {algorithm.info.securityLevel}
                          </span>
                          <span
                            className={`performance-badge ${algorithm.info.performance}`}
                          >
                            {algorithm.info.performance}
                          </span>
                        </div>
                      </div>

                      <div className="algorithm-specs">
                        <div className="spec-grid">
                          <div className="spec-item">
                            <span className="spec-label">حجم المفتاح:</span>
                            <span className="spec-value">
                              {algorithm.info.keySize * 8} بت
                            </span>
                          </div>
                          <div className="spec-item">
                            <span className="spec-label">حجم البلوك:</span>
                            <span className="spec-value">
                              {algorithm.info.blockSize * 8} بت
                            </span>
                          </div>
                          <div className="spec-item">
                            <span className="spec-label">عدد الجولات:</span>
                            <span className="spec-value">
                              {algorithm.info.rounds}
                            </span>
                          </div>
                          <div className="spec-item">
                            <span className="spec-label">سنة التطوير:</span>
                            <span className="spec-value">
                              {algorithm.info.year}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="algorithm-features">
                        <h4>المميزات الرئيسية:</h4>
                        <ul>
                          {algorithm.info.features
                            .slice(0, 3)
                            .map((feature, idx) => (
                              <li key={idx}>{feature}</li>
                            ))}
                        </ul>
                      </div>

                      <div className="algorithm-actions">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => runSingleTest(algorithm.algorithm)}
                          disabled={!algorithm.isActive}
                        >
                          🧪 اختبار سريع
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setSelectedAlgorithm(algorithm.algorithm);
                            setSelectedTab("demo");
                          }}
                        >
                          🔬 تجربة تفصيلية
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Demo Tab */}
        {selectedTab === "demo" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="demo-section"
          >
            <div className="demo-controls glass-card">
              <h3>🧪 مختبر التشفير التفاعلي</h3>

              <div className="demo-input-section">
                <label>النص المراد تشفيره:</label>
                <textarea
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder="أدخل النص الذي تريد تشفيره..."
                  rows={3}
                  className="demo-textarea"
                />
              </div>

              <div className="demo-controls-row">
                <button
                  className="btn btn-primary"
                  onClick={runAllTests}
                  disabled={!testInput.trim()}
                >
                  🚀 تشفير بجميع الخوارزميات
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  ⚙️ إعدادات متقدمة
                </button>
              </div>

              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    className="advanced-controls"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="advanced-grid">
                      <div className="control-group">
                        <label>اختر خوارزمية:</label>
                        <select
                          value={selectedAlgorithm}
                          onChange={(e) =>
                            setSelectedAlgorithm(
                              e.target.value as SupportedCipherType,
                            )
                          }
                        >
                          <option value="AES-256">AES-256</option>
                          <option value="Serpent">Serpent</option>
                          <option value="Twofish">Twofish</option>
                          <option value="AES-Serpent-Twofish">
                            AES-Serpent-Twofish
                          </option>
                        </select>
                      </div>
                      <div className="control-group">
                        <label>مفتاح مخصص (Hex):</label>
                        <input
                          type="text"
                          value={customKey}
                          onChange={(e) => setCustomKey(e.target.value)}
                          placeholder="اتركه فارغاً لمفتاح عشوائي"
                        />
                      </div>
                      <div className="control-actions">
                        <button
                          className="btn btn-sm"
                          onClick={generateCustomKey}
                        >
                          🎲 مفتاح عشوائي
                        </button>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={testWithCustomKey}
                        >
                          🔑 اختبار بالمفتاح المخصص
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <motion.div
                className="test-results glass-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3>📊 نتائج التشفير</h3>
                <div className="results-grid">
                  {testResults.map((result, index) => (
                    <motion.div
                      key={`${result.algorithm}-${index}`}
                      className={`result-card ${result.success ? "success" : "error"}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      style={{
                        borderLeft: `4px solid ${getAlgorithmColor(result.algorithm.split(" ")[0])}`,
                      }}
                    >
                      <div className="result-header">
                        <h4>{result.algorithm}</h4>
                        <span
                          className={`result-status ${result.success ? "success" : "error"}`}
                        >
                          {result.success ? "✅" : "❌"}
                        </span>
                      </div>

                      {result.success ? (
                        <>
                          <div className="result-times">
                            <span>
                              تشفير: {result.encryptionTime.toFixed(2)}ms
                            </span>
                            <span>
                              فك تشفير: {result.decryptionTime.toFixed(2)}ms
                            </span>
                          </div>

                          <div className="result-data">
                            <div className="data-section">
                              <label>النص المشفر (Base64):</label>
                              <div className="encrypted-text">
                                {result.encryptedBase64.substring(0, 64)}
                                {result.encryptedBase64.length > 64 && "..."}
                              </div>
                            </div>

                            <div className="data-section">
                              <label>النتيجة:</label>
                              <div className="decrypted-text">
                                {result.decryptedText === result.originalText
                                  ? "🎉 تم فك التشفير بنجاح!"
                                  : "⚠️ خطأ في فك التشفير"}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="error-message">❌ {result.error}</div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Benchmark Tab */}
        {selectedTab === "benchmark" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="benchmark-section"
          >
            <div className="benchmark-controls glass-card">
              <h3>⚡ قياس الأداء المتقدم</h3>
              <p>اختبار شامل لسرعة وكفا��ة جميع الخوارزميات</p>

              <button
                className="btn btn-primary benchmark-btn"
                onClick={runBenchmark}
                disabled={isRunningBenchmark}
              >
                {isRunningBenchmark ? (
                  <>
                    <span className="spinner"></span>
                    جاري القياس...
                  </>
                ) : (
                  <>🚀 بدء قياس الأداء</>
                )}
              </button>
            </div>

            {benchmarkResults.length > 0 && (
              <motion.div
                className="benchmark-results glass-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3>📈 نتائج قياس الأداء</h3>
                <div className="benchmark-table">
                  <div className="table-header">
                    <span>الخوارزمية</span>
                    <span>زمن التشفير (ms)</span>
                    <span>زمن فك التشفير (ms)</span>
                    <span>السرعة (char/ms)</span>
                    <span>الذاكرة</span>
                    <span>الأمان</span>
                    <span>الأداء</span>
                  </div>
                  {benchmarkResults.map((result, index) => (
                    <motion.div
                      key={result.algorithm}
                      className="table-row"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span
                        className="algorithm-name"
                        style={{ color: getAlgorithmColor(result.algorithm) }}
                      >
                        {result.algorithm}
                      </span>
                      <span>{result.avgEncryptionTime.toFixed(2)}</span>
                      <span>{result.avgDecryptionTime.toFixed(2)}</span>
                      <span>{result.throughput.toFixed(0)}</span>
                      <span>{result.memoryUsage}</span>
                      <span>
                        <div className="score-bar">
                          <div
                            className="score-fill security"
                            style={{ width: `${result.security * 10}%` }}
                          />
                          <span>{result.security}/10</span>
                        </div>
                      </span>
                      <span>
                        <div className="score-bar">
                          <div
                            className="score-fill performance"
                            style={{ width: `${result.performance * 10}%` }}
                          />
                          <span>{result.performance}/10</span>
                        </div>
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Compare Tab */}
        {selectedTab === "compare" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="compare-section"
          >
            <div className="glass-card comparison-matrix">
              <h3>📊 مصفوفة المقارنة الشاملة</h3>

              <div className="comparison-table">
                <div className="comparison-header">
                  <span></span>
                  <span>🛡️ AES-256</span>
                  <span>🐍 Serpent</span>
                  <span>🐟 Twofish</span>
                  <span>🔐 Triple</span>
                </div>

                {[
                  {
                    label: "الأمان",
                    values: ["عالي جداً", "أقصى", "عالي جداً", "أقصى"],
                  },
                  {
                    label: "السرعة",
                    values: ["سريع", "متوسط", "سريع", "بطيء"],
                  },
                  {
                    label: "استهلاك الذاكرة",
                    values: ["منخفض", "متوسط", "متوسط", "عالي"],
                  },
                  { label: "الجولات", values: ["14", "32", "16", "62"] },
                  {
                    label: "سنة التطوير",
                    values: ["2001", "1998", "1998", "2024"],
                  },
                  {
                    label: "الاستخدام الأمثل",
                    values: ["عام", "حكومي", "تجاري", "عسكري"],
                  },
                ].map((row, index) => (
                  <motion.div
                    key={row.label}
                    className="comparison-row"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="row-label">{row.label}</span>
                    {row.values.map((value, cellIndex) => (
                      <span key={cellIndex} className="comparison-cell">
                        {value}
                      </span>
                    ))}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="glass-card usage-recommendations">
              <h3>🎯 توصيات الاستخدام</h3>
              <div className="recommendations-grid">
                {[
                  {
                    icon: "🛡️",
                    title: "AES-256",
                    subtitle: "للاستخدام العام",
                    description:
                      "الخيار الأمثل للتطبيقات التجارية والاستخدام اليومي",
                    useCases: [
                      "تشفير الملفات",
                      "قواعد البيانات",
                      "الاتصالات الآمنة",
                    ],
                    color: "#4F46E5",
                  },
                  {
                    icon: "🐍",
                    title: "Serpent",
                    subtitle: "للأمان المتقدم",
                    description: "أمان استثنائي مع 32 جولة للبيانات الحساسة",
                    useCases: [
                      "البيانات الحكومية",
                      "الأبحاث السرية",
                      "الأنظمة المصرفية",
                    ],
                    color: "#059669",
                  },
                  {
                    icon: "🐟",
                    title: "Twofish",
                    subtitle: "للأداء المتوازن",
                    description:
                      "توازن مثالي بين السرعة والأمان للتطبيقات التجارية",
                    useCases: ["التراسل الفوري", "VPN", "التخزين السحابي"],
                    color: "#DC2626",
                  },
                  {
                    icon: "🔐",
                    title: "التشفير الثلاثي",
                    subtitle: "للحماية القصوى",
                    description: "أقصى مستوى أمان ممكن - مقاوم للكمبيوتر الكمي",
                    useCases: [
                      "الأسرار العسكرية",
                      "البيانات المصنفة",
                      "الأرشيف طويل المدى",
                    ],
                    color: "#7C3AED",
                  },
                ].map((rec, index) => (
                  <motion.div
                    key={rec.title}
                    className="recommendation-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                    style={{ borderLeft: `4px solid ${rec.color}` }}
                  >
                    <div className="rec-header">
                      <span className="rec-icon" style={{ color: rec.color }}>
                        {rec.icon}
                      </span>
                      <div>
                        <h4 style={{ color: rec.color }}>{rec.title}</h4>
                        <span className="rec-subtitle">{rec.subtitle}</span>
                      </div>
                    </div>
                    <p className="rec-description">{rec.description}</p>
                    <div className="rec-use-cases">
                      <span className="use-cases-label">الاستخدامات:</span>
                      <ul>
                        {rec.useCases.map((useCase, idx) => (
                          <li key={idx}>{useCase}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
