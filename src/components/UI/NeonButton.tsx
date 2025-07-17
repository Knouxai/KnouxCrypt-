import React, { ReactNode, useState } from "react";
import { motion } from "framer-motion";

interface NeonButtonProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger" | "success" | "warning";
  size?: "small" | "medium" | "large";
  icon?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  onClick,
  className = "",
  disabled = false,
  variant = "primary",
  size = "medium",
  icon,
  loading = false,
  fullWidth = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // الأنماط الأساسية
  const baseStyles = `
    relative flex items-center justify-center font-bold transition-all duration-300 ease-in-out 
    shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 
    border border-transparent overflow-hidden
    ${fullWidth ? "w-full" : ""}
    ${disabled || loading ? "cursor-not-allowed opacity-60" : "hover:scale-105"}
  `;

  // أنماط الأحجام
  const sizeStyles = {
    small: "px-4 py-2 text-sm rounded-md",
    medium: "px-6 py-3 text-base rounded-lg",
    large: "px-8 py-4 text-lg rounded-xl",
  };

  // أنماط الألوان والتأثيرات
  const variantStyles = {
    primary: {
      bg: "bg-gradient-to-r from-purple-600 to-pink-600",
      hover: "hover:from-purple-500 hover:to-pink-500",
      glow: "#D946EF",
      text: "text-white",
      ring: "focus:ring-purple-500",
    },
    secondary: {
      bg: "bg-gradient-to-r from-gray-700 to-gray-800",
      hover: "hover:from-gray-600 hover:to-gray-700",
      glow: "#9CA3AF",
      text: "text-gray-200",
      ring: "focus:ring-gray-500",
    },
    danger: {
      bg: "bg-gradient-to-r from-red-600 to-red-700",
      hover: "hover:from-red-500 hover:to-red-600",
      glow: "#EF4444",
      text: "text-white",
      ring: "focus:ring-red-500",
    },
    success: {
      bg: "bg-gradient-to-r from-green-600 to-emerald-600",
      hover: "hover:from-green-500 hover:to-emerald-500",
      glow: "#10B981",
      text: "text-white",
      ring: "focus:ring-green-500",
    },
    warning: {
      bg: "bg-gradient-to-r from-yellow-500 to-orange-500",
      hover: "hover:from-yellow-400 hover:to-orange-400",
      glow: "#F59E0B",
      text: "text-white",
      ring: "focus:ring-yellow-500",
    },
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  const buttonVariants = {
    idle: {
      scale: 1,
      boxShadow: `0 4px 14px 0 ${currentVariant.glow}25`,
    },
    hover: {
      scale: 1.05,
      boxShadow: `0 0 8px ${currentVariant.glow}, 0 0 20px ${currentVariant.glow}40, 0 0 35px ${currentVariant.glow}20`,
      transition: { duration: 0.3 },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
  };

  return (
    <motion.button
      className={`
        ${baseStyles}
        ${currentSize}
        ${currentVariant.bg}
        ${currentVariant.hover}
        ${currentVariant.text}
        ${currentVariant.ring}
        ${className}
      `}
      onClick={!disabled && !loading ? onClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variants={buttonVariants}
      initial="idle"
      animate={isHovered && !disabled && !loading ? "hover" : "idle"}
      whileTap={!disabled && !loading ? "tap" : "idle"}
      disabled={disabled || loading}
    >
      {/* طبقة الوهج الخلفية */}
      <motion.div
        className="absolute inset-0 rounded-lg blur-xl opacity-0 pointer-events-none"
        style={{ backgroundColor: currentVariant.glow }}
        animate={{
          opacity: isHovered && !disabled && !loading ? [0, 0.4, 0] : 0,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      />

      {/* خطوط الطاقة المتحركة */}
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered && !disabled && !loading ? 0.3 : 0 }}
      >
        <motion.div
          className="absolute h-full w-2 bg-gradient-to-b from-transparent via-white to-transparent"
          style={{ left: "-10px" }}
          animate={{
            x: isHovered && !disabled && !loading ? 200 : -50,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          }}
        />
      </motion.div>

      {/* محتوى الزر */}
      <div className="relative z-10 flex items-center justify-center">
        {loading ? (
          <motion.div
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          <>
            {icon && (
              <motion.span
                className="ml-2 text-xl"
                animate={{
                  rotate: isHovered ? [0, 10, 0] : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                {icon}
              </motion.span>
            )}
            <span className="relative">{children}</span>
          </>
        )}
      </div>

      {/* تأثير النقر */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        initial={{ scale: 0, opacity: 0.5 }}
        animate={{ scale: 0, opacity: 0.5 }}
        whileTap={{
          scale: 1.2,
          opacity: 0,
          transition: { duration: 0.3 },
        }}
        style={{
          background: `radial-gradient(circle, ${currentVariant.glow}40 0%, transparent 70%)`,
        }}
      />
    </motion.button>
  );
};

export default NeonButton;
