import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModernCard } from "../UI/ModernCard";
import { NeonButton2025 } from "../UI/NeonButton2025";
import { QuantumProgress } from "../UI/QuantumProgress";
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
      {/* Enhanced Header */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
              {algorithms.map((algorithm, index) => (
                <ModernCard
                  key={algorithm.algorithm}
                  variant="hologram"
                  glow={algorithm.isActive}
                  delay={index * 0.1}
                  className={`relative ${algorithm.isActive ? "" : "opacity-60"}`}
                >
                  {algorithm.info && (
                    <>
                      {/* Status Indicator */}
                      <div className="absolute top-4 right-4">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            algorithm.isActive
                              ? "bg-green-400 shadow-lg shadow-green-400/50 animate-pulse"
                              : "bg-red-400 shadow-lg shadow-red-400/50"
                          }`}
                        />
                      </div>

                      {/* Algorithm Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <motion.div
                            className="text-5xl"
                            style={{
                              filter:
                                "drop-shadow(0 0 20px rgba(255,255,255,0.3))",
                            }}
                            whileHover={{ scale: 1.2, rotate: 10 }}
                          >
                            {algorithm.algorithm === "AES-256" && "🛡️"}
                            {algorithm.algorithm === "Serpent" && "���"}
                            {algorithm.algorithm === "Twofish" && "🐟"}
                            {algorithm.algorithm === "AES-Serpent-Twofish" &&
                              "🔐"}
                          </motion.div>
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                              {algorithm.info.name}
                            </h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {algorithm.info.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              algorithm.info.securityLevel === "maximum"
                                ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                : algorithm.info.securityLevel === "high"
                                  ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                                  : "bg-green-500/20 text-green-300 border border-green-500/30"
                            }`}
                          >
                            {algorithm.info.securityLevel === "maximum"
                              ? "أمان أقصى"
                              : algorithm.info.securityLevel === "high"
                                ? "أمان عالي"
                                : "أمان قياسي"}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              algorithm.info.performance === "fast"
                                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                : algorithm.info.performance === "balanced"
                                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                  : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                            }`}
                          >
                            {algorithm.info.performance === "fast"
                              ? "سريع"
                              : algorithm.info.performance === "balanced"
                                ? "متوازن"
                                : "بطيء"}
                          </span>
                        </div>
                      </div>

                      {/* Algorithm Specifications */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {[
                          {
                            label: "حجم المفتاح",
                            value: `${algorithm.info.keySize * 8} بت`,
                            icon: "🔑",
                          },
                          {
                            label: "حجم البلوك",
                            value: `${algorithm.info.blockSize * 8} بت`,
                            icon: "📊",
                          },
                          {
                            label: "عدد الجولات",
                            value: algorithm.info.rounds.toString(),
                            icon: "🔄",
                          },
                          {
                            label: "سنة التطوير",
                            value: algorithm.info.year.toString(),
                            icon: "📅",
                          },
                        ].map((spec, idx) => (
                          <motion.div
                            key={spec.label}
                            className="bg-white/5 rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all duration-300"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{spec.icon}</span>
                              <span className="text-xs text-gray-400 font-medium">
                                {spec.label}
                              </span>
                            </div>
                            <div className="text-lg font-bold text-white">
                              {spec.value}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Algorithm Features */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                          <span>✨</span>
                          المميزات الرئيسية
                        </h4>
                        <div className="space-y-2">
                          {algorithm.info.features
                            .slice(0, 3)
                            .map((feature, idx) => (
                              <motion.div
                                key={idx}
                                className="flex items-start gap-3 text-sm text-gray-300"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + idx * 0.1 }}
                              >
                                <span className="text-green-400 mt-0.5">✓</span>
                                <span>{feature}</span>
                              </motion.div>
                            ))}
                        </div>
                      </div>

                      {/* Algorithm Actions */}
                      <div className="flex gap-3">
                        <NeonButton2025
                          variant="primary"
                          size="sm"
                          onClick={() => runSingleTest(algorithm.algorithm)}
                          disabled={!algorithm.isActive}
                          className="flex-1"
                        >
                          <span>🧪</span>
                          اختبار سريع
                        </NeonButton2025>
                        <NeonButton2025
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedAlgorithm(algorithm.algorithm);
                            setSelectedTab("demo");
                          }}
                          className="flex-1"
                        >
                          <span>🔬</span>
                          تجربة تفصيلية
                        </NeonButton2025>
                      </div>
                    </>
                  )}
                </ModernCard>
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
            className="space-y-8"
          >
            <ModernCard variant="gradient" glow>
              <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                🧪 مختبر التشفير التفاعلي 2025
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-medium text-white mb-3">
                    النص المراد تشفيره:
                  </label>
                  <textarea
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    placeholder="أدخل النص الذي تريد تشفيره..."
                    rows={4}
                    className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:border-indigo-500 focus:bg-white/15 transition-all duration-300"
                  />
                </div>

                <div className="flex gap-4">
                  <NeonButton2025
                    variant="quantum"
                    size="lg"
                    onClick={runAllTests}
                    disabled={!testInput.trim()}
                    pulse
                  >
                    🚀 تشفير بجميع الخوارزميات
                  </NeonButton2025>
                  <NeonButton2025
                    variant="secondary"
                    size="lg"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    ⚙️ إعدادات متقدمة
                  </NeonButton2025>
                </div>

                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <ModernCard variant="neon" className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-white mb-2">
                              اختر خوارزمية:
                            </label>
                            <select
                              value={selectedAlgorithm}
                              onChange={(e) =>
                                setSelectedAlgorithm(
                                  e.target.value as SupportedCipherType,
                                )
                              }
                              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-sm focus:outline-none focus:border-indigo-500"
                            >
                              <option value="AES-256">AES-256</option>
                              <option value="Serpent">Serpent</option>
                              <option value="Twofish">Twofish</option>
                              <option value="AES-Serpent-Twofish">
                                AES-Serpent-Twofish
                              </option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-white mb-2">
                              مفتاح مخصص (Hex):
                            </label>
                            <input
                              type="text"
                              value={customKey}
                              onChange={(e) => setCustomKey(e.target.value)}
                              placeholder="اتركه فارغاً لمفتاح عشوائي"
                              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                          <NeonButton2025
                            variant="warning"
                            size="sm"
                            onClick={generateCustomKey}
                          >
                            🎲 مفتاح عشوائي
                          </NeonButton2025>
                          <NeonButton2025
                            variant="success"
                            size="sm"
                            onClick={testWithCustomKey}
                          >
                            🔑 اختبار بالمفتاح المخصص
                          </NeonButton2025>
                        </div>
                      </ModernCard>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ModernCard>

            {/* Test Results */}
            {testResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  📊 نتائج التشفير المتقدمة
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {testResults.map((result, index) => (
                    <ModernCard
                      key={`${result.algorithm}-${index}`}
                      variant={result.success ? "gradient" : "neon"}
                      delay={index * 0.1}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xl font-bold text-white">
                          {result.algorithm}
                        </h4>
                        <span
                          className={`text-2xl ${result.success ? "✅" : "❌"}`}
                        >
                          {result.success ? "✅" : "❌"}
                        </span>
                      </div>

                      {result.success ? (
                        <>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-400">
                                {result.encryptionTime.toFixed(2)}ms
                              </div>
                              <div className="text-sm text-gray-400">
                                زمن التشفير
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-400">
                                {result.decryptionTime.toFixed(2)}ms
                              </div>
                              <div className="text-sm text-gray-400">
                                زمن فك التشفير
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1">
                                النص المشفر (Base64):
                              </label>
                              <div className="p-2 bg-black/30 rounded-lg text-xs text-cyan-300 font-mono overflow-hidden">
                                {result.encryptedBase64.substring(0, 64)}
                                {result.encryptedBase64.length > 64 && "..."}
                              </div>
                            </div>
                            <div className="text-center p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                              <span className="text-green-300 font-medium">
                                🎉 تم فك التشفير بنجاح!
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-4 bg-red-500/20 rounded-lg border border-red-500/30">
                          <div className="text-red-300 font-medium">
                            ❌ {result.error}
                          </div>
                        </div>
                      )}
                    </ModernCard>
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
            className="space-y-8"
          >
            <ModernCard variant="gradient" glow className="text-center">
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                ⚡ مختبر قياس الأداء المتقدم
              </h3>
              <p className="text-gray-300 mb-6">
                اختبار شامل لسرعة وكفاءة جميع الخوارزميات مع تحليل مفصل
              </p>

              <NeonButton2025
                variant="warning"
                size="xl"
                onClick={runBenchmark}
                disabled={isRunningBenchmark}
                loading={isRunningBenchmark}
                pulse={isRunningBenchmark}
              >
                {isRunningBenchmark ? "جاري القياس..." : "🚀 بدء قياس الأداء"}
              </NeonButton2025>
            </ModernCard>

            {benchmarkResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  📈 نتائج قياس الأداء التفصيلية
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {benchmarkResults.map((result, index) => (
                    <ModernCard
                      key={result.algorithm}
                      variant="hologram"
                      delay={index * 0.1}
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h4
                          className="text-xl font-bold"
                          style={{ color: getAlgorithmColor(result.algorithm) }}
                        >
                          {result.algorithm}
                        </h4>
                        <div className="text-2xl">
                          {result.algorithm === "AES-256" && "🛡️"}
                          {result.algorithm === "Serpent" && "🐍"}
                          {result.algorithm === "Twofish" && "🐟"}
                          {result.algorithm === "AES-Serpent-Twofish" && "🔐"}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-green-400">
                              {result.avgEncryptionTime.toFixed(2)}ms
                            </div>
                            <div className="text-xs text-gray-400">
                              متوسط زمن التشفير
                            </div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-blue-400">
                              {result.avgDecryptionTime.toFixed(2)}ms
                            </div>
                            <div className="text-xs text-gray-400">
                              متوسط زمن فك التشفير
                            </div>
                          </div>
                        </div>

                        <div>
                          <QuantumProgress
                            label="الأمان"
                            value={result.security * 10}
                            variant="quantum"
                            color={getAlgorithmColor(result.algorithm)}
                            size="sm"
                          />
                        </div>

                        <div>
                          <QuantumProgress
                            label="الأداء"
                            value={result.performance * 10}
                            variant="hologram"
                            color={getAlgorithmColor(result.algorithm)}
                            size="sm"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-center text-sm">
                          <div>
                            <div className="font-bold text-purple-400">
                              {result.throughput.toFixed(0)}
                            </div>
                            <div className="text-gray-400">حرف/ثانية</div>
                          </div>
                          <div>
                            <div className="font-bold text-orange-400">
                              {result.memoryUsage}
                            </div>
                            <div className="text-gray-400">استهلاك الذاكرة</div>
                          </div>
                        </div>
                      </div>
                    </ModernCard>
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
            className="space-y-8"
          >
            <ModernCard variant="hologram" glow>
              <h3 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                ���� مصفوفة المقارنة الشاملة 2025
              </h3>

              {/* Comparison Matrix */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-right p-4 text-gray-300"></th>
                      <th className="text-center p-4 text-indigo-400">
                        🛡️ AES-256
                      </th>
                      <th className="text-center p-4 text-green-400">
                        🐍 Serpent
                      </th>
                      <th className="text-center p-4 text-red-400">
                        🐟 Twofish
                      </th>
                      <th className="text-center p-4 text-purple-400">
                        🔐 Triple
                      </th>
                    </tr>
                  </thead>
                  <tbody>
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
                      <motion.tr
                        key={row.label}
                        className="border-b border-white/10 hover:bg-white/5 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <td className="p-4 font-medium text-white">
                          {row.label}
                        </td>
                        {row.values.map((value, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="p-4 text-center text-gray-300"
                          >
                            {value}
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ModernCard>

            {/* Usage Recommendations */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                🎯 توصيات الاستخدام المتقدمة
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: "🛡️",
                    title: "AES-256",
                    subtitle: "للاستخدام العام والتجاري",
                    description:
                      "الخيار الأمثل للتطبيقات التجارية والاستخدام اليومي مع توازن مثالي",
                    useCases: [
                      "تشفير الملفات",
                      "قواعد البيانات",
                      "الاتصالات الآمنة",
                      "التجارة الإلكترونية",
                    ],
                    color: "#4F46E5",
                  },
                  {
                    icon: "🐍",
                    title: "Serpent",
                    subtitle: "للأمان المتقدم والحكومي",
                    description:
                      "أمان استثنائي مع 32 جولة للبيانات الحساسة والتطبيقات الحرجة",
                    useCases: [
                      "البيانات الحكومية",
                      "الأبحاث السرية",
                      "الأنظمة المصرفية",
                      "الدفاع الوطني",
                    ],
                    color: "#059669",
                  },
                  {
                    icon: "🐟",
                    title: "Twofish",
                    subtitle: "للأداء المتوازن والسرعة",
                    description:
                      "توازن مثالي بين السرعة والأمان للتطبيقات التي تتطلب أداء عالي",
                    useCases: [
                      "التراسل الفوري",
                      "VPN",
                      "التخزين السحابي",
                      "الألعاب الآمنة",
                    ],
                    color: "#DC2626",
                  },
                  {
                    icon: "🔐",
                    title: "التشفير الثلاثي",
                    subtitle: "للحماية القصوى والعسكرية",
                    description:
                      "أقصى مستوى أمان ممكن - مقاوم للكمبيوتر الكمي والتهديدات المستقبلية",
                    useCases: [
                      "الأسرار العسكرية",
                      "البيانات المصنفة",
                      "الأرشيف طويل المدى",
                      "الأمن القومي",
                    ],
                    color: "#7C3AED",
                  },
                ].map((rec, index) => (
                  <ModernCard
                    key={rec.title}
                    variant="gradient"
                    delay={index * 0.15}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-4xl">{rec.icon}</span>
                      <div>
                        <h4
                          className="text-xl font-bold"
                          style={{ color: rec.color }}
                        >
                          {rec.title}
                        </h4>
                        <span className="text-sm text-gray-400">
                          {rec.subtitle}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      {rec.description}
                    </p>
                    <div>
                      <span className="text-sm font-medium text-gray-400 mb-2 block">
                        الاستخدامات المثلى:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {rec.useCases.map((useCase, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm text-gray-300"
                          >
                            <span className="text-green-400">✓</span>
                            <span>{useCase}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ModernCard>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
