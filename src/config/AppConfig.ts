export interface AppConfig {
  version: string;
  buildNumber: string;
  environment: "development" | "production" | "testing";
  features: {
    systemTray: boolean;
    keyboardShortcuts: boolean;
    aiAssistant: boolean;
    autoEncryption: boolean;
    quantumResistance: boolean;
    realTimeMonitoring: boolean;
  };
  security: {
    encryptionLevel: "military" | "standard" | "enhanced";
    autoLock: boolean;
    autoLockTimeout: number; // minutes
    requireBiometric: boolean;
    auditLogging: boolean;
  };
  ui: {
    theme: "dark" | "light" | "auto";
    language: "ar" | "en" | "auto";
    animations: boolean;
    soundEffects: boolean;
    notifications: boolean;
  };
  performance: {
    enableHardwareAcceleration: boolean;
    maxConcurrentOperations: number;
    cacheSize: number; // MB
    backgroundProcessing: boolean;
  };
}

export const defaultConfig: AppConfig = {
  version: "2025.1.0",
  buildNumber: "20250101",
  environment: "production",
  features: {
    systemTray: true,
    keyboardShortcuts: true,
    aiAssistant: true,
    autoEncryption: true,
    quantumResistance: true,
    realTimeMonitoring: true,
  },
  security: {
    encryptionLevel: "military",
    autoLock: true,
    autoLockTimeout: 15,
    requireBiometric: false,
    auditLogging: true,
  },
  ui: {
    theme: "dark",
    language: "ar",
    animations: true,
    soundEffects: true,
    notifications: true,
  },
  performance: {
    enableHardwareAcceleration: true,
    maxConcurrentOperations: 4,
    cacheSize: 512,
    backgroundProcessing: true,
  },
};

export const getAppConfig = (): AppConfig => {
  try {
    const savedConfig = localStorage.getItem("knouxcrypt-config");
    if (savedConfig) {
      return { ...defaultConfig, ...JSON.parse(savedConfig) };
    }
  } catch (error) {
    console.warn("Failed to load saved config, using defaults:", error);
  }
  return defaultConfig;
};

export const saveAppConfig = (config: Partial<AppConfig>): void => {
  try {
    const currentConfig = getAppConfig();
    const newConfig = { ...currentConfig, ...config };
    localStorage.setItem("knouxcrypt-config", JSON.stringify(newConfig));
  } catch (error) {
    console.error("Failed to save config:", error);
  }
};

export const resetAppConfig = (): void => {
  try {
    localStorage.removeItem("knouxcrypt-config");
  } catch (error) {
    console.error("Failed to reset config:", error);
  }
};

// System information
export const getSystemInfo = () => {
  return {
    platform: navigator.platform,
    userAgent: navigator.userAgent,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    hardwareConcurrency: navigator.hardwareConcurrency || 4,
    memory: (navigator as any).deviceMemory || "Unknown",
    connection: (navigator as any).connection?.effectiveType || "Unknown",
    timestamp: new Date().toISOString(),
  };
};

// Application constants
export const APP_CONSTANTS = {
  NAME: "KnouxCrypt™",
  FULL_NAME: "KnouxCrypt™ 2025 - نظام التشفير العسكري المتقدم",
  DESCRIPTION: "Advanced Military-Grade Encryption System",
  VENDOR: "Knoux Technologies",
  COPYRIGHT: "© 2025 Knoux Technologies. All rights reserved.",
  WEBSITE: "https://knouxcrypt.com",
  SUPPORT_EMAIL: "support@knouxcrypt.com",

  // Encryption algorithms
  ALGORITHMS: {
    AES: { name: "AES-256", keySize: 256, blockSize: 128 },
    SERPENT: { name: "Serpent-256", keySize: 256, blockSize: 128 },
    TWOFISH: { name: "Twofish-256", keySize: 256, blockSize: 128 },
    TRIPLE_CIPHER: {
      name: "AES+Serpent+Twofish",
      keySize: 768,
      blockSize: 128,
    },
  },

  // File size limits
  LIMITS: {
    MAX_FILE_SIZE: 1024 * 1024 * 1024 * 100, // 100GB
    MAX_CONCURRENT_OPERATIONS: 10,
    MIN_PASSWORD_LENGTH: 12,
    MAX_PASSWORD_LENGTH: 256,
  },

  // Default paths
  PATHS: {
    CONFIG: "config",
    LOGS: "logs",
    CACHE: "cache",
    TEMP: "temp",
  },
} as const;
