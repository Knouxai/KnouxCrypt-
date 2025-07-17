import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LivePreviewQuickAccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
    >
      <motion.button
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
        onClick={() => navigate("/live-preview")}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        title="انتقل لواجهة المراقبة المباشرة الجديدة"
      >
        <div className="text-2xl">📺</div>
        <div className="text-sm font-medium">
          <div>المراقبة المباشرة</div>
          <div className="text-xs opacity-80">الواجهة الجديدة</div>
        </div>
        <motion.div
          className="w-2 h-2 bg-red-500 rounded-full"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </motion.button>
    </motion.div>
  );
};

export default LivePreviewQuickAccess;
