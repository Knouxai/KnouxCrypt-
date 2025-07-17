import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: "none" | "small" | "medium" | "large";
  borderColor?: string;
  glowColor?: string;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  hoverable = true,
  padding = "medium",
  borderColor = "rgba(255, 255, 255, 0.2)",
  glowColor = "#D946EF",
  onClick,
}) => {
  // أنماط الحشو
  const paddingStyles = {
    none: "",
    small: "p-4",
    medium: "p-6",
    large: "p-8",
  };

  const cardVariants = {
    initial: {
      scale: 1,
      boxShadow: `0 8px 32px rgba(0, 0, 0, 0.1)`,
    },
    hover: {
      scale: hoverable ? 1.02 : 1,
      boxShadow: hoverable
        ? `0 12px 40px rgba(0, 0, 0, 0.15), 0 0 20px ${glowColor}30`
        : `0 8px 32px rgba(0, 0, 0, 0.1)`,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className={`
        relative backdrop-blur-xl bg-white/10 rounded-2xl border overflow-hidden
        ${paddingStyles[padding]}
        ${hoverable ? "cursor-pointer" : ""}
        ${className}
      `}
      style={{
        borderColor: borderColor,
        background: `
          linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0.05) 100%
          )
        `,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      onClick={onClick}
    >
      {/* طبقة الوهج الداخلية */}
      <div
        className="absolute inset-0 rounded-2xl opacity-50 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, 
              ${glowColor}15 0%, 
              transparent 50%
            ),
            radial-gradient(circle at 80% 20%, 
              rgba(147, 51, 234, 0.1) 0%, 
              transparent 50%
            ),
            radial-gradient(circle at 40% 80%, 
              rgba(59, 130, 246, 0.1) 0%, 
              transparent 50%
            )
          `,
        }}
      />

      {/* خطوط الضوء المتحركة */}
      <motion.div
        className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={{
          x: ["-100%", "100%"],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      />

      {/* المحتوى */}
      <div className="relative z-10">{children}</div>

      {/* تأثير الحدود المتوهجة */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `
            linear-gradient(90deg, transparent, ${glowColor}30, transparent),
            linear-gradient(0deg, transparent, ${glowColor}20, transparent)
          `,
          mask: `
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0)
          `,
          WebkitMask: `
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0)
          `,
          maskComposite: "xor",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />

      {/* نقاط الضوء العشوائية */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/60 rounded-full"
            style={{
              left: `${20 + i * 30}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + i,
              repeat: Infinity,
              repeatType: "loop",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default GlassCard;
