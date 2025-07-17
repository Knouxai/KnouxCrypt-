/**
 * KnouxCrypt™ - Crypto Testing Page
 * صفحة اختبار شامل لجميع وحدات التشفير
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CryptoTester,
  TestResult,
  runQuickTest,
} from "../../utils/test-crypto";

interface TestSession {
  id: string;
  timestamp: Date;
  results: TestResult[];
  duration: number;
  passed: number;
  failed: number;
}

export const CryptoTest: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [currentResults, setCurrentResults] = useState<TestResult[]>([]);
  const [testSessions, setTestSessions] = useState<TestSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [autoTest, setAutoTest] = useState(false);

  // إجراء اختبار دوري كل 5 دقائق إذا كان مفعلاً
  useEffect(() => {
    if (!autoTest) return;

    const interval = setInterval(
      async () => {
        await handleRunTests(true);
      },
      5 * 60 * 1000,
    ); // 5 minutes

    return () => clearInterval(interval);
  }, [autoTest]);

  /**
   * تشغيل الاختبارات
   */
  const handleRunTests = async (silent: boolean = false) => {
    if (testing) return;

    setTesting(true);
    if (!silent) {
      setCurrentResults([]);
    }

    try {
      const startTime = Date.now();
      const tester = new CryptoTester();
      const results = await tester.runAllTests();
      const duration = Date.now() - startTime;

      const passed = results.filter((r) => r.passed).length;
      const failed = results.length - passed;

      const session: TestSession = {
        id: `test_${Date.now()}`,
        timestamp: new Date(),
        results,
        duration,
        passed,
        failed,
      };

      setCurrentResults(results);
      setTestSessions((prev) => [session, ...prev.slice(0, 9)]); // Keep last 10 sessions

      if (!silent) {
        console.log("�� اختبار التشفير مكتمل:", session);
      }
    } catch (error) {
      console.error("❌ فشل في تشغيل الاختبارات:", error);
    } finally {
      setTesting(false);
    }
  };

  /**
   * تشغيل اختبار سريع
   */
  const handleQuickTest = async () => {
    setTesting(true);
    try {
      const success = await runQuickTest();
      console.log(
        success ? "✅ الاختبار السريع نجح" : "❌ الاختبار السريع فشل",
      );
    } catch (error) {
      console.error("❌ خطأ في الاختبار السريع:", error);
    } finally {
      setTesting(false);
    }
  };

  /**
   * تصدير نتائج الاختبار
   */
  const handleExportResults = () => {
    const dataStr = JSON.stringify(testSessions, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `knoux-crypto-test-results-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  /**
   * الحصول على لون حسب نتيجة الاختبار
   */
  const getResultColor = (passed: boolean) => {
    return passed
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : "bg-red-500/20 text-red-400 border-red-500/30";
  };

  /**
   * الحصول على أيقونة نتيجة الاختبار
   */
  const getResultIcon = (passed: boolean) => {
    return passed ? "✅" : "❌";
  };

  const selectedSessionData = selectedSession
    ? testSessions.find((s) => s.id === selectedSession)
    : null;

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="glass-card-strong p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-4">
              🧪 مختبر اختبار التشفير
            </h1>
            <p className="text-white/70 text-lg">
              اختبار شامل لجميع وحدات التشفير والBuffer polyfill
            </p>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              className={`glass-button px-4 py-2 ${autoTest ? "bg-green-500/20 text-green-400" : ""}`}
              onClick={() => setAutoTest(!autoTest)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {autoTest
                ? "🔄 الاختبار التلقائي مفعل"
                : "⏸️ الاختبار التلقائي معطل"}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Test Controls */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          التحكم في الاختبارات
        </h2>
        <div className="flex flex-wrap gap-4">
          <motion.button
            className="glass-button px-6 py-3 bg-blue-500/20 text-blue-400 disabled:opacity-50"
            onClick={() => handleRunTests()}
            disabled={testing}
            whileHover={{ scale: testing ? 1 : 1.05 }}
            whileTap={{ scale: testing ? 1 : 0.95 }}
          >
            {testing ? "🔄 جاري الاختبار..." : "🚀 تشغيل اختبار شامل"}
          </motion.button>

          <motion.button
            className="glass-button px-6 py-3 bg-green-500/20 text-green-400 disabled:opacity-50"
            onClick={handleQuickTest}
            disabled={testing}
            whileHover={{ scale: testing ? 1 : 1.05 }}
            whileTap={{ scale: testing ? 1 : 0.95 }}
          >
            ⚡ اختبار سريع
          </motion.button>

          <motion.button
            className="glass-button px-6 py-3 bg-purple-500/20 text-purple-400"
            onClick={handleExportResults}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={testSessions.length === 0}
          >
            📥 تصدير النتائج
          </motion.button>
        </div>
      </div>

      {/* Current Test Progress */}
      <AnimatePresence>
        {testing && (
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <div className="text-lg font-medium text-white">
                جاري تشغيل الاختبارات...
              </div>
            </div>
            <div className="text-white/60">
              ��تم فحص جميع وحدات التشفير للتأكد من سلامة العمل
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Test Results */}
      {currentResults.length > 0 && (
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold text-white mb-6">
            نتائج الاختبار الحالي
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {currentResults.map((result, index) => (
              <motion.div
                key={`${result.module}-${index}`}
                className={`glass-card p-4 border ${getResultColor(result.passed)}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-xl">{getResultIcon(result.passed)}</div>
                  <div className="font-medium text-white">{result.module}</div>
                </div>
                <div className="text-sm text-white/70 mb-3">
                  {result.message}
                </div>
                {result.details && (
                  <div className="text-xs text-white/50 bg-black/20 rounded p-2">
                    <pre>{JSON.stringify(result.details, null, 2)}</pre>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="glass-card p-4 bg-gradient-to-r from-blue-500/10 to-purple-600/10">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">
                  {currentResults.length}
                </div>
                <div className="text-white/60 text-sm">إجمالي الاختبارات</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {currentResults.filter((r) => r.passed).length}
                </div>
                <div className="text-white/60 text-sm">نجح</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">
                  {currentResults.filter((r) => !r.passed).length}
                </div>
                <div className="text-white/60 text-sm">فشل</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Test History */}
      {testSessions.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6">سجل الاختبارات</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sessions List */}
            <div className="space-y-3">
              <h3 className="font-medium text-white mb-3">الجلسات الأخيرة</h3>
              {testSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  className={`glass-card p-4 cursor-pointer transition-all ${
                    selectedSession === session.id ? "border-blue-500/50" : ""
                  }`}
                  onClick={() => setSelectedSession(session.id)}
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {session.timestamp.toLocaleString("ar-SA")}
                      </div>
                      <div className="text-xs text-white/60">
                        {session.duration}ms • {session.results.length} اختبار
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="text-green-400 text-sm font-bold">
                        {session.passed}
                      </div>
                      <div className="text-white/40">/</div>
                      <div className="text-red-400 text-sm font-bold">
                        {session.failed}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Session Details */}
            <div>
              <h3 className="font-medium text-white mb-3">تفاصيل الجلسة</h3>
              {selectedSessionData ? (
                <motion.div
                  className="glass-card p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-4">
                    <div className="text-sm font-medium text-white mb-2">
                      {selectedSessionData.timestamp.toLocaleString("ar-SA")}
                    </div>
                    <div className="text-xs text-white/60">
                      المدة: {selectedSessionData.duration}ms
                    </div>
                  </div>

                  <div className="space-y-2">
                    {selectedSessionData.results.map((result, index) => (
                      <div
                        key={`detail-${index}`}
                        className={`flex items-center gap-2 p-2 rounded ${
                          result.passed ? "bg-green-500/10" : "bg-red-500/10"
                        }`}
                      >
                        <div className="text-sm">
                          {getResultIcon(result.passed)}
                        </div>
                        <div className="text-sm text-white flex-1">
                          {result.module}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="glass-card p-8 text-center text-white/50">
                  اختر جلسة لعرض التفاصيل
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {!testing && currentResults.length === 0 && testSessions.length === 0 && (
        <div className="glass-card p-12 text-center">
          <div className="text-6xl mb-4">🧪</div>
          <div className="text-xl font-medium text-white mb-2">
            لم يتم تشغيل أي اختبارات بعد
          </div>
          <div className="text-white/60 mb-6">
            اضغط على "تشغيل اختبار شامل" لبدء فحص جميع وحدات التشفير
          </div>
          <motion.button
            className="glass-button px-8 py-3 bg-blue-500/20 text-blue-400"
            onClick={() => handleRunTests()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🚀 بدء الاختبار الأول
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};
