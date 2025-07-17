/**
 * KnouxCrypt™ - Crypto Test Button Component
 * زر اختبار سريع للتشفير
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { runQuickTest } from "../../utils/test-crypto";

export const CryptoTestButton: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [lastResult, setLastResult] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleTest = async () => {
    if (testing) return;

    setTesting(true);
    setShowResult(false);

    try {
      const result = await runQuickTest();
      setLastResult(result);
      setShowResult(true);

      // إخفاء النتيجة بعد 5 ثوان
      setTimeout(() => setShowResult(false), 5000);
    } catch (error) {
      console.error("فشل في الاختبار:", error);
      setLastResult(false);
      setShowResult(true);
      setTimeout(() => setShowResult(false), 5000);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="relative">
      <motion.button
        className={`glass-button p-3 relative ${testing ? "opacity-50" : ""}`}
        onClick={handleTest}
        disabled={testing}
        whileHover={{ scale: testing ? 1 : 1.05 }}
        whileTap={{ scale: testing ? 1 : 0.95 }}
        title="اختبار سريع للتشفير"
      >
        <motion.div
          animate={testing ? { rotate: 360 } : { rotate: 0 }}
          transition={
            testing
              ? { duration: 1, repeat: Infinity, ease: "linear" }
              : { duration: 0.2 }
          }
        >
          🧪
        </motion.div>

        {/* Result indicator */}
        <AnimatePresence>
          {showResult && lastResult !== null && (
            <motion.div
              className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${
                lastResult ? "bg-green-500" : "bg-red-500"
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <div className="w-full h-full flex items-center justify-center text-xs text-white">
                {lastResult ? "✓" : "✗"}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap z-50 ${
              lastResult
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {lastResult ? "✅ الاختبار نجح" : "❌ الاختبار فشل"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
