import React from "react";
import { motion } from "framer-motion";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number; // قطر الدائرة
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  text?: string; // نص اختياري
  textColor?: string;
  textClass?: string;
  showPercentage?: boolean;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  progress = 0,
  size = 100,
  strokeWidth = 8,
  color = "#D946EF", // النيون البنفسجي الافتراضي
  trackColor = "rgba(255, 255, 255, 0.3)",
  text,
  textColor = "#FFF",
  textClass = "font-bold text-lg",
  showPercentage = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  // التأكد من أن التقدم ضمن الحدود المطلوبة
  const safeProgress = Math.max(0, Math.min(100, progress));

  const commonPathProps = {
    cx: size / 2,
    cy: size / 2,
    r: radius,
    strokeWidth: strokeWidth,
    fill: "none",
    strokeLinecap: "round" as const,
  };

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        className="w-full h-full absolute transform -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* المسار الخلفي */}
        <circle
          {...commonPathProps}
          stroke={trackColor}
          strokeDasharray={circumference}
          style={{ strokeDashoffset: 0 }}
        />
        {/* مؤشر التقدم */}
        <motion.circle
          {...commonPathProps}
          stroke={color}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset:
              circumference - (safeProgress / 100) * circumference,
          }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
            type: "spring",
            stiffness: 50,
          }}
          style={{
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>

      {/* النص المركزي */}
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        {text && (
          <div
            className={`${textClass} text-center mb-1`}
            style={{ color: textColor }}
          >
            {text}
          </div>
        )}
        {showPercentage && (
          <motion.div
            className={`${textClass} text-center`}
            style={{ color: textColor }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {`${Math.round(safeProgress)}%`}
          </motion.div>
        )}
      </div>

      {/* تأثير الوهج */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
        }}
        animate={{
          opacity: safeProgress > 0 ? [0, 0.3, 0] : 0,
          scale: safeProgress > 0 ? [0.8, 1.2, 0.8] : 0.8,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default ProgressRing;
