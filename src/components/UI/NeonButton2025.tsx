import React from "react";
import { motion } from "framer-motion";

interface NeonButton2025Props {
  children: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "quantum";
  size?: "sm" | "md" | "lg" | "xl";
  pulse?: boolean;
  glow?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

export const NeonButton2025: React.FC<NeonButton2025Props> = ({
  children,
  variant = "primary",
  size = "md",
  pulse = false,
  glow = true,
  disabled = false,
  loading = false,
  onClick,
  className = "",
}) => {
  const getVariantStyles = () => {
    const variants = {
      primary: {
        bg: "from-indigo-500 to-purple-600",
        border: "border-indigo-400",
        shadow: "shadow-indigo-500/50",
        text: "text-white",
      },
      secondary: {
        bg: "from-gray-600 to-gray-700",
        border: "border-gray-400",
        shadow: "shadow-gray-500/50",
        text: "text-white",
      },
      success: {
        bg: "from-emerald-500 to-green-600",
        border: "border-emerald-400",
        shadow: "shadow-emerald-500/50",
        text: "text-white",
      },
      danger: {
        bg: "from-red-500 to-pink-600",
        border: "border-red-400",
        shadow: "shadow-red-500/50",
        text: "text-white",
      },
      warning: {
        bg: "from-yellow-500 to-orange-600",
        border: "border-yellow-400",
        shadow: "shadow-yellow-500/50",
        text: "text-white",
      },
      quantum: {
        bg: "from-cyan-400 via-blue-500 to-purple-600",
        border: "border-cyan-400",
        shadow: "shadow-cyan-500/50",
        text: "text-white",
      },
    };
    return variants[variant];
  };

  const getSizeStyles = () => {
    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
      xl: "px-10 py-5 text-xl",
    };
    return sizes[size];
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <motion.button
      className={`
        relative overflow-hidden rounded-full font-bold
        bg-gradient-to-r ${variantStyles.bg}
        border-2 ${variantStyles.border}
        ${variantStyles.text}
        ${sizeStyles}
        ${glow ? `shadow-lg ${variantStyles.shadow}` : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${pulse && !disabled ? "animate-pulse" : ""}
        transition-all duration-300
        group
        ${className}
      `}
      onClick={!disabled && !loading ? onClick : undefined}
      disabled={disabled || loading}
      initial={{ scale: 1 }}
      whileHover={
        !disabled
          ? {
              scale: 1.05,
              boxShadow: glow
                ? `0 0 30px ${variantStyles.shadow.split("/")[0].split("-")[1]}`
                : undefined,
            }
          : {}
      }
      whileTap={!disabled ? { scale: 0.95 } : {}}
      animate={
        pulse
          ? {
              boxShadow: [
                `0 0 20px ${variantStyles.shadow.split("/")[0]}`,
                `0 0 40px ${variantStyles.shadow.split("/")[0]}`,
                `0 0 20px ${variantStyles.shadow.split("/")[0]}`,
              ],
            }
          : {}
      }
      transition={{
        boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/30 to-white/20"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
      />

      {/* Loading Spinner */}
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}

      {/* Button Content */}
      <motion.span
        className={`relative z-10 flex items-center justify-center gap-2 ${loading ? "opacity-0" : "opacity-100"}`}
        transition={{ opacity: { duration: 0.2 } }}
      >
        {children}
      </motion.span>

      {/* Hover Effect */}
      <motion.div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Corner Glow Effects */}
      {glow && (
        <>
          <div
            className={`absolute top-0 left-0 w-2 h-2 bg-gradient-to-br ${variantStyles.bg} rounded-full blur-sm opacity-80`}
          />
          <div
            className={`absolute top-0 right-0 w-2 h-2 bg-gradient-to-bl ${variantStyles.bg} rounded-full blur-sm opacity-80`}
          />
          <div
            className={`absolute bottom-0 left-0 w-2 h-2 bg-gradient-to-tr ${variantStyles.bg} rounded-full blur-sm opacity-80`}
          />
          <div
            className={`absolute bottom-0 right-0 w-2 h-2 bg-gradient-to-tl ${variantStyles.bg} rounded-full blur-sm opacity-80`}
          />
        </>
      )}

      {/* Quantum Effect for Quantum Variant */}
      {variant === "quantum" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-600/20"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.button>
  );
};
