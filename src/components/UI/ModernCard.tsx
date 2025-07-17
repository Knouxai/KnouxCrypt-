import React from "react";
import { motion } from "framer-motion";

interface ModernCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "glass" | "gradient" | "neon" | "hologram";
  glow?: boolean;
  interactive?: boolean;
  delay?: number;
}

export const ModernCard: React.FC<ModernCardProps> = ({
  children,
  className = "",
  variant = "glass",
  glow = false,
  interactive = true,
  delay = 0,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "gradient":
        return "bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 border-gradient-to-r from-indigo-500/40 to-purple-500/40";
      case "neon":
        return "bg-black/40 border-2 border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.3)]";
      case "hologram":
        return "bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/20 backdrop-blur-xl";
      default:
        return "bg-white/10 border border-white/20 backdrop-blur-md";
    }
  };

  const glowClass = glow ? "shadow-2xl shadow-indigo-500/25" : "";

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-3xl p-6 
        ${getVariantStyles()}
        ${glowClass}
        ${interactive ? "cursor-pointer group" : ""}
        transition-all duration-500
        ${className}
      `}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={
        interactive
          ? {
              scale: 1.02,
              y: -5,
              transition: { duration: 0.3 },
            }
          : {}
      }
      whileTap={interactive ? { scale: 0.98 } : {}}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Shimmer Effect on Hover */}
      {interactive && (
        <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Floating Particles */}
      {variant === "hologram" && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};
