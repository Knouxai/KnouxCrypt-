import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LivePreviewBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 mx-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className="text-2xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎉
              </motion.div>
              <div>
                <div className="text-white font-bold text-sm">واجهة جديدة!</div>
                <div className="text-white/80 text-xs">
                  المراقبة المباشرة للخدمات متاحة الآن
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                onClick={() => navigate("/live-preview")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                جرّب الآن
              </motion.button>
              <button
                className="text-white/60 hover:text-white/80 transition-colors"
                onClick={() => setIsVisible(false)}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LivePreviewBanner;
