import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface QuantumNotificationProps {
  id: string;
  title: string;
  message: string;
  type?: "success" | "error" | "warning" | "info" | "quantum";
  duration?: number;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "center";
  onClose?: (id: string) => void;
  persistent?: boolean;
  interactive?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextProps {
  notifications: QuantumNotificationProps[];
  addNotification: (notification: Omit<QuantumNotificationProps, "id">) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext =
  React.createContext<NotificationContextProps | null>(null);

export const useNotifications = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = React.useState<
    QuantumNotificationProps[]
  >([]);

  const addNotification = (
    notification: Omit<QuantumNotificationProps, "id">,
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    setNotifications((prev) => [...prev, newNotification]);

    if (!notification.persistent && notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAll,
      }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  const getPositionStyles = (position: string) => {
    const positions = {
      "top-right": "top-4 right-4",
      "top-left": "top-4 left-4",
      "bottom-right": "bottom-4 right-4",
      "bottom-left": "bottom-4 left-4",
      center: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
    };
    return positions[position] || positions["top-right"];
  };

  // Group notifications by position
  const groupedNotifications = notifications.reduce(
    (groups, notification) => {
      const position = notification.position || "top-right";
      if (!groups[position]) {
        groups[position] = [];
      }
      groups[position].push(notification);
      return groups;
    },
    {} as Record<string, QuantumNotificationProps[]>,
  );

  return (
    <>
      {Object.entries(groupedNotifications).map(
        ([position, positionNotifications]) => (
          <div
            key={position}
            className={`fixed z-[9999] ${getPositionStyles(position)} space-y-4`}
            style={{ pointerEvents: "none" }}
          >
            <AnimatePresence>
              {positionNotifications.map((notification) => (
                <QuantumNotification
                  key={notification.id}
                  {...notification}
                  onClose={removeNotification}
                />
              ))}
            </AnimatePresence>
          </div>
        ),
      )}
    </>
  );
};

const QuantumNotification: React.FC<QuantumNotificationProps> = ({
  id,
  title,
  message,
  type = "info",
  onClose,
  interactive = true,
  action,
}) => {
  const getTypeStyles = () => {
    const styles = {
      success: {
        bg: "from-emerald-500/20 to-green-500/20",
        border: "border-emerald-400/50",
        icon: "✓",
        iconBg: "bg-emerald-500/20",
        iconColor: "text-emerald-400",
        shadow: "shadow-emerald-500/25",
      },
      error: {
        bg: "from-red-500/20 to-pink-500/20",
        border: "border-red-400/50",
        icon: "✕",
        iconBg: "bg-red-500/20",
        iconColor: "text-red-400",
        shadow: "shadow-red-500/25",
      },
      warning: {
        bg: "from-yellow-500/20 to-orange-500/20",
        border: "border-yellow-400/50",
        icon: "⚠",
        iconBg: "bg-yellow-500/20",
        iconColor: "text-yellow-400",
        shadow: "shadow-yellow-500/25",
      },
      info: {
        bg: "from-blue-500/20 to-indigo-500/20",
        border: "border-blue-400/50",
        icon: "ℹ",
        iconBg: "bg-blue-500/20",
        iconColor: "text-blue-400",
        shadow: "shadow-blue-500/25",
      },
      quantum: {
        bg: "from-cyan-500/20 via-blue-500/20 to-purple-500/20",
        border: "border-cyan-400/50",
        icon: "⚛",
        iconBg: "bg-gradient-to-r from-cyan-500/20 to-purple-500/20",
        iconColor: "text-cyan-400",
        shadow: "shadow-cyan-500/25",
      },
    };
    return styles[type];
  };

  const typeStyles = getTypeStyles();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.3 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        opacity: { duration: 0.3 },
      }}
      className={`
        relative min-w-80 max-w-md p-6 rounded-2xl backdrop-blur-md 
        bg-gradient-to-br ${typeStyles.bg}
        border-2 ${typeStyles.border}
        shadow-xl ${typeStyles.shadow}
        ${interactive ? "cursor-pointer group" : ""}
      `}
      style={{ pointerEvents: "auto" }}
      whileHover={interactive ? { scale: 1.02, y: -2 } : {}}
      onClick={interactive ? () => onClose?.(id) : undefined}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Quantum Effect for Quantum Type */}
      {type === "quantum" && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
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

      {/* Close Button */}
      {interactive && (
        <motion.button
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onClose?.(id);
          }}
        >
          ×
        </motion.button>
      )}

      {/* Content */}
      <div className="relative z-10 flex gap-4">
        {/* Icon */}
        <motion.div
          className={`
            flex-shrink-0 w-12 h-12 rounded-full ${typeStyles.iconBg} 
            flex items-center justify-center text-xl ${typeStyles.iconColor}
            border border-white/20
          `}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          {typeStyles.icon}
        </motion.div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <motion.h4
            className="font-bold text-white text-lg mb-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {title}
          </motion.h4>
          <motion.p
            className="text-white/80 text-sm leading-relaxed"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {message}
          </motion.p>

          {/* Action Button */}
          {action && (
            <motion.button
              className={`
                mt-3 px-4 py-2 rounded-lg text-sm font-medium
                bg-white/10 hover:bg-white/20 border border-white/20
                text-white transition-all duration-200
              `}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
                onClose?.(id);
              }}
            >
              {action.label}
            </motion.button>
          )}
        </div>
      </div>

      {/* Progress Bar for Auto-dismiss */}
      {!action && (
        <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-2xl overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${typeStyles.bg.replace("/20", "/60")}`}
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 5, ease: "linear" }}
          />
        </motion.div>
      )}

      {/* Shimmer Effect */}
      <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
    </motion.div>
  );
};

export { QuantumNotification };
