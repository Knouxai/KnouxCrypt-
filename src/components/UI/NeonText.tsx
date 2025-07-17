import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface NeonTextProps {
  children: ReactNode;
  className?: string;
  size?: "small" | "normal" | "large" | "xlarge";
  color?: string;
  glowIntensity?: "low" | "medium" | "high";
  animated?: boolean;
  gradient?: boolean;
}

const NeonText: React.FC<NeonTextProps> = ({
  children,
  className = "",
  size = "normal",
  color = "#D946EF",
  glowIntensity = "medium",
  animated = true,
  gradient = false,
}) => {
  // أحجام النصوص
  const sizeClasses = {
    small: "text-sm",
    normal: "text-base",
    large: "text-xl",
    xlarge: "text-3xl",
  };

  // شدة التوهج
  const glowStyles = {
    low: {
      textShadow: `0 0 5px ${color}50, 0 0 10px ${color}30`,
      filter: `drop-shadow(0 0 2px ${color}60)`,
    },
    medium: {
      textShadow: `0 0 8px ${color}70, 0 0 16px ${color}50, 0 0 24px ${color}30`,
      filter: `drop-shadow(0 0 4px ${color}80)`,
    },
    high: {
      textShadow: `0 0 12px ${color}90, 0 0 24px ${color}70, 0 0 36px ${color}50, 0 0 48px ${color}30`,
      filter: `drop-shadow(0 0 8px ${color})`,
    },
  };

  // التدرج اللوني
  const gradientStyle = gradient
    ? {
        background: `linear-gradient(45deg, ${color}, #9333EA, #EC4899)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }
    : {
        color: color,
      };

  const textVariants = {
    initial: {
      opacity: 0.8,
      scale: 1,
    },
    animate: {
      opacity: [0.8, 1, 0.8],
      scale: [1, 1.02, 1],
    },
  };

  return (
    <motion.span
      className={`
        font-bold select-none relative inline-block
        ${sizeClasses[size]}
        ${className}
      `}
      style={{
        ...glowStyles[glowIntensity],
        ...gradientStyle,
      }}
      variants={animated ? textVariants : undefined}
      initial={animated ? "initial" : undefined}
      animate={animated ? "animate" : undefined}
      transition={
        animated
          ? {
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }
          : undefined
      }
    >
      {/* طبقة النص الخلفية للتوهج */}
      <span
        className="absolute inset-0 blur-sm opacity-60 pointer-events-none"
        style={{ color: color }}
        aria-hidden="true"
      >
        {children}
      </span>

      {/* النص الرئيسي */}
      <span className="relative z-10">{children}</span>

      {/* تأثيرات إضافية للحروف الكبيرة */}
      {size === "xlarge" && (
        <>
          <motion.span
            className="absolute inset-0 blur-md opacity-40 pointer-events-none"
            style={{ color: color }}
            animate={
              animated
                ? {
                    opacity: [0.2, 0.6, 0.2],
                  }
                : undefined
            }
            transition={
              animated
                ? {
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                    delay: 0.5,
                  }
                : undefined
            }
            aria-hidden="true"
          >
            {children}
          </motion.span>

          <motion.span
            className="absolute inset-0 blur-lg opacity-20 pointer-events-none"
            style={{ color: color }}
            animate={
              animated
                ? {
                    opacity: [0.1, 0.3, 0.1],
                    scale: [1, 1.05, 1],
                  }
                : undefined
            }
            transition={
              animated
                ? {
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                    delay: 1,
                  }
                : undefined
            }
            aria-hidden="true"
          >
            {children}
          </motion.span>
        </>
      )}
    </motion.span>
  );
};

export default NeonText;
