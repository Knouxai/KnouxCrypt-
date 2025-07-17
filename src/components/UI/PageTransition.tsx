import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: React.ReactNode;
  variant?: "slide" | "fade" | "scale" | "quantum" | "hologram";
  duration?: number;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  variant = "quantum",
  duration = 0.6,
}) => {
  const location = useLocation();

  const getVariantConfig = () => {
    switch (variant) {
      case "slide":
        return {
          initial: { x: 300, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: -300, opacity: 0 },
        };

      case "fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };

      case "scale":
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 1.2, opacity: 0 },
        };

      case "hologram":
        return {
          initial: {
            opacity: 0,
            y: 50,
            scale: 0.9,
            filter: "blur(10px)",
          },
          animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          },
          exit: {
            opacity: 0,
            y: -50,
            scale: 1.1,
            filter: "blur(10px)",
          },
        };

      case "quantum":
      default:
        return {
          initial: {
            opacity: 0,
            y: 20,
            scale: 0.95,
            rotateX: 10,
            filter: "blur(5px) brightness(0.8)",
          },
          animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            filter: "blur(0px) brightness(1)",
          },
          exit: {
            opacity: 0,
            y: -20,
            scale: 1.05,
            rotateX: -10,
            filter: "blur(5px) brightness(1.2)",
          },
        };
    }
  };

  const variantConfig = getVariantConfig();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={variantConfig.initial}
        animate={variantConfig.animate}
        exit={variantConfig.exit}
        transition={{
          duration,
          ease: [0.4, 0, 0.2, 1],
          ...(variant === "quantum" && {
            type: "spring",
            stiffness: 100,
            damping: 20,
          }),
        }}
        style={{
          width: "100%",
          height: "100%",
          ...(variant === "quantum" && {
            transformStyle: "preserve-3d",
            perspective: 1000,
          }),
        }}
      >
        {/* Background Particles for Quantum Effect */}
        {variant === "quantum" && (
          <div className="fixed inset-0 pointer-events-none z-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        )}

        {/* Hologram Grid Effect */}
        {variant === "hologram" && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-0 opacity-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />
        )}

        {/* Page Content */}
        <div className="relative z-10">{children}</div>

        {/* Shimmer Effect for Special Variants */}
        {(variant === "quantum" || variant === "hologram") && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-5"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.5,
              ease: "linear",
              delay: 0.2,
            }}
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
              width: "100%",
              height: "100%",
            }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

// Higher Order Component for easy page wrapping
export const withPageTransition = (
  Component: React.ComponentType,
  variant?: PageTransitionProps["variant"],
) => {
  const WrappedComponent = (props: any) => (
    <PageTransition variant={variant}>
      <Component {...props} />
    </PageTransition>
  );

  WrappedComponent.displayName = `withPageTransition(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Custom hook for programmatic transitions
export const usePageTransition = () => {
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const startTransition = (callback: () => void, delay: number = 300) => {
    setIsTransitioning(true);
    setTimeout(() => {
      callback();
      setTimeout(() => setIsTransitioning(false), 100);
    }, delay);
  };

  return { isTransitioning, startTransition };
};
