import React from "react";
import { motion } from "framer-motion";

interface QuantumProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "linear" | "circular" | "quantum" | "hologram";
  color?: string;
  showPercentage?: boolean;
  animated?: boolean;
  label?: string;
  className?: string;
}

export const QuantumProgress: React.FC<QuantumProgressProps> = ({
  value,
  max = 100,
  size = "md",
  variant = "linear",
  color = "#6366F1",
  showPercentage = true,
  animated = true,
  label,
  className = "",
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const getSizeStyles = () => {
    const sizes = {
      sm: { height: "h-2", width: "w-32", text: "text-xs" },
      md: { height: "h-3", width: "w-48", text: "text-sm" },
      lg: { height: "h-4", width: "w-64", text: "text-base" },
      xl: { height: "h-6", width: "w-80", text: "text-lg" },
    };
    return sizes[size];
  };

  const sizeStyles = getSizeStyles();

  if (variant === "circular") {
    const radius =
      size === "sm" ? 30 : size === "md" ? 40 : size === "lg" ? 50 : 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg
          width={radius * 2.5}
          height={radius * 2.5}
          className="transform -rotate-90"
        >
          {/* Background Circle */}
          <circle
            cx={radius * 1.25}
            cy={radius * 1.25}
            r={radius}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
            fill="transparent"
            className="drop-shadow-lg"
          />

          {/* Progress Circle */}
          <motion.circle
            cx={radius * 1.25}
            cy={radius * 1.25}
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset: animated ? strokeDashoffset : strokeDashoffset,
            }}
            transition={{ duration: 2, ease: "easeInOut" }}
            style={{
              filter: `drop-shadow(0 0 10px ${color}60)`,
            }}
          />

          {/* Quantum Glow Effect */}
          <motion.circle
            cx={radius * 1.25}
            cy={radius * 1.25}
            r={radius}
            stroke={color}
            strokeWidth="12"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            opacity="0.3"
            animate={{
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {showPercentage && (
              <motion.div
                className={`font-bold text-white ${sizeStyles.text}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
              >
                {Math.round(percentage)}%
              </motion.div>
            )}
            {label && <div className="text-xs text-gray-400 mt-1">{label}</div>}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "quantum") {
    return (
      <div className={`relative ${sizeStyles.width} ${className}`}>
        {label && (
          <div className="flex justify-between items-center mb-2">
            <span className={`font-medium text-white ${sizeStyles.text}`}>
              {label}
            </span>
            {showPercentage && (
              <span className={`font-bold text-cyan-400 ${sizeStyles.text}`}>
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}

        <div
          className={`relative ${sizeStyles.height} bg-gray-800/50 rounded-full backdrop-blur-sm border border-cyan-500/30 overflow-hidden`}
        >
          {/* Quantum Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-pulse" />

          {/* Main Progress Bar */}
          <motion.div
            className={`${sizeStyles.height} bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full relative overflow-hidden`}
            style={{
              boxShadow: `0 0 20px ${color}60, inset 0 0 20px rgba(255,255,255,0.1)`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 1,
              }}
            />

            {/* Quantum Particles */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 w-1 h-1 bg-white rounded-full"
                style={{ left: `${20 + i * 30}%` }}
                animate={{
                  y: [-2, 2, -2],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1 + i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>

          {/* Outer Glow */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: `0 0 30px ${color}40`,
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    );
  }

  if (variant === "hologram") {
    return (
      <div className={`relative ${sizeStyles.width} ${className}`}>
        {label && (
          <div className="flex justify-between items-center mb-2">
            <span className={`font-medium text-white ${sizeStyles.text}`}>
              {label}
            </span>
            {showPercentage && (
              <span
                className={`font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent ${sizeStyles.text}`}
              >
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}

        <div
          className={`relative ${sizeStyles.height} bg-black/30 rounded-full border border-blue-400/30 overflow-hidden backdrop-blur-sm`}
        >
          {/* Hologram Grid Background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(59, 130, 246, 0.3) 2px, rgba(59, 130, 246, 0.3) 4px)",
              backgroundSize: "4px 100%",
            }}
          />

          {/* Progress Bar */}
          <motion.div
            className={`${sizeStyles.height} bg-gradient-to-r from-blue-400/80 via-purple-500/80 to-pink-500/80 rounded-full relative`}
            style={{
              filter: "drop-shadow(0 0 10px rgba(59, 130, 246, 0.6))",
            }}
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: `${percentage}%`,
              opacity: animated ? 1 : 1,
            }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            {/* Scanning Line */}
            <motion.div
              className="absolute inset-y-0 right-0 w-0.5 bg-white"
              animate={{
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Hologram Interference Lines */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border-t border-blue-400/20"
              style={{ top: `${i * 20}%` }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 1 + i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Linear variant (default)
  return (
    <div className={`relative ${sizeStyles.width} ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className={`font-medium text-white ${sizeStyles.text}`}>
            {label}
          </span>
          {showPercentage && (
            <span className={`font-bold ${sizeStyles.text}`} style={{ color }}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        className={`relative ${sizeStyles.height} bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/20`}
      >
        <motion.div
          className={`${sizeStyles.height} rounded-full relative overflow-hidden`}
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}aa)`,
            boxShadow: `0 0 15px ${color}40`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 1.5 : 0, ease: "easeOut" }}
        >
          {/* Animated Highlight */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 1,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};
