import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";

// تعريف أنواع البيانات الأساسية
export interface DiskInfo {
  caption: string;
  size: number;
  freeSpace: number;
  fileSystem: string;
  driveType: number;
  volumeName?: string;
  description: string;
  encryptionStatus:
    | "unencrypted"
    | "encrypted"
    | "processing"
    | "preparing"
    | "mounted"
    | "unmounted";
  deviceID: string;
  mediaType?: string;
}

export interface EncryptionSettings {
  algorithm: "AES-256" | "Serpent" | "Twofish" | "AES-Serpent-Twofish";
  password: string;
  keyFiles?: string[];
  hashAlgorithm: "SHA-512" | "SHA-256" | "Whirlpool";
  filesystem: "NTFS" | "FAT32" | "exFAT";
  quickFormat: boolean;
  systemEncryption: boolean;
  hiddenVolume: boolean;
  volumeSize?: number;
}

export interface OperationState {
  progress: number; // 0-100
  status: string;
  message: string;
  isRunning: boolean;
  success?: boolean;
  targetDisk?: string | null;
  operationType:
    | "encryption"
    | "decryption"
    | "mount"
    | "unmount"
    | "ai-analysis"
    | "none";
  startTime?: Date;
  estimatedTimeRemaining?: number;
}

export interface AIRecommendation {
  algorithm: string;
  passwordStrengthScore: number;
  suggestUsbKey: boolean;
  suggestHiddenVolume: boolean;
  explanation: string;
  confidenceScore: number;
  securityLevel: "basic" | "high" | "military";
  performanceImpact: "low" | "medium" | "high";
}

export interface SystemContext {
  os: string;
  architecture: string;
  totalRAM: number;
  uefiSecureBoot: boolean;
  tpmVersion?: string;
  hasHardwareEncryption: boolean;
}

// تعريف نوع Context
interface SecurityContextType {
  // الحالات الأساسية
  disks: DiskInfo[];
  selectedDisk: DiskInfo | null;
  encryptionSettings: EncryptionSettings;
  systemContext: SystemContext;
  mountedVolumes: Record<string, string>;

  // حالات العمليات
  encryptionState: OperationState;
  decryptionState: OperationState;
  mountState: OperationState;
  aiAnalysisState: OperationState;

  // توصيات الذكاء الاصطناعي
  aiRecommendations: AIRecommendation | null;
  isLoadingAI: boolean;

  // الوظائف
  setSelectedDisk: (disk: DiskInfo | null) => void;
  updateEncryptionSettings: (settings: Partial<EncryptionSettings>) => void;
  scanDisks: () => Promise<void>;
  startEncryption: (
    disk: DiskInfo,
    params: Partial<EncryptionSettings>,
  ) => Promise<void>;
  startDecryption: (disk: DiskInfo, password: string) => Promise<void>;
  mountVolume: (
    disk: DiskInfo,
    password: string,
    driveLetter?: string,
  ) => Promise<void>;
  unmountVolume: (disk: DiskInfo) => Promise<void>;
  getAIRecommendations: (disk: DiskInfo) => Promise<void>;
  updateOperationState: (
    type: OperationState["operationType"],
    stateUpdate: Partial<OperationState>,
  ) => void;
  resetOperationState: (type: OperationState["operationType"]) => void;
}

// إنشاء Context
const SecurityContext = createContext<SecurityContextType | undefined>(
  undefined,
);

// الحالة الافتراضية للعمليات
const defaultOperationState: OperationState = {
  progress: 0,
  status: "Idle",
  message: "",
  isRunning: false,
  operationType: "none",
};

// الإعدادات الافتراضية للتشفير
const defaultEncryptionSettings: EncryptionSettings = {
  algorithm: "AES-256",
  password: "",
  hashAlgorithm: "SHA-512",
  filesystem: "NTFS",
  quickFormat: false,
  systemEncryption: false,
  hiddenVolume: false,
};

// Provider Component
export const SecurityProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // الحالات الأساسية
  const [disks, setDisks] = useState<DiskInfo[]>([]);
  const [selectedDisk, setSelectedDisk] = useState<DiskInfo | null>(null);
  const [encryptionSettings, setEncryptionSettings] =
    useState<EncryptionSettings>(defaultEncryptionSettings);
  const [mountedVolumes, setMountedVolumes] = useState<Record<string, string>>(
    {},
  );
  const [systemContext, setSystemContext] = useState<SystemContext>({
    os: "Windows 11",
    architecture: "x64",
    totalRAM: 16,
    uefiSecureBoot: true,
    hasHardwareEncryption: false,
  });

  // حالات العمليات
  const [encryptionState, setEncryptionState] = useState<OperationState>(
    defaultOperationState,
  );
  const [decryptionState, setDecryptionState] = useState<OperationState>(
    defaultOperationState,
  );
  const [mountState, setMountState] = useState<OperationState>(
    defaultOperationState,
  );
  const [aiAnalysisState, setAiAnalysisState] = useState<OperationState>(
    defaultOperationState,
  );

  // حالة الذكاء الاصطناعي
  const [aiRecommendations, setAiRecommendations] =
    useState<AIRecommendation | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // تحديث حالة العمليات
  const updateOperationState = useCallback(
    (
      type: OperationState["operationType"],
      stateUpdate: Partial<OperationState>,
    ) => {
      let setter;
      switch (type) {
        case "encryption":
          setter = setEncryptionState;
          break;
        case "decryption":
          setter = setDecryptionState;
          break;
        case "mount":
        case "unmount":
          setter = setMountState;
          break;
        case "ai-analysis":
          setter = setAiAnalysisState;
          break;
        default:
          return;
      }

      setter((prevState) => {
        const newState = { ...prevState, ...stateUpdate };
        if (
          stateUpdate.status &&
          ["Completed", "Failed", "Mounted", "Unmounted"].includes(
            stateUpdate.status,
          )
        ) {
          newState.isRunning = false;
        }
        if (!newState.operationType && type !== "none") {
          newState.operationType = type;
        }
        return newState;
      });
    },
    [],
  );

  // إعادة تعيين حالة العمليات
  const resetOperationState = useCallback(
    (type: OperationState["operationType"]) => {
      updateOperationState(type, {
        ...defaultOperationState,
        operationType: type,
      });
    },
    [updateOperationState],
  );

  // تحديث إعدادات التشفير
  const updateEncryptionSettings = useCallback(
    (settings: Partial<EncryptionSettings>) => {
      setEncryptionSettings((prev) => ({ ...prev, ...settings }));
    },
    [],
  );

  // محاكاة فحص الأقراص
  const scanDisks = useCallback(async () => {
    updateOperationState("ai-analysis", {
      status: "Scanning",
      message: "فحص الأقراص المتاحة...",
      isRunning: true,
      progress: 0,
    });

    try {
      // محاكاة تأخير الفحص
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // بيانات الأقراص المحاكاة
      const mockDisks: DiskInfo[] = [
        {
          caption: "C:",
          size: 500 * 1024 * 1024 * 1024, // 500GB
          freeSpace: 200 * 1024 * 1024 * 1024, // 200GB
          fileSystem: "NTFS",
          driveType: 3,
          volumeName: "Windows",
          description: "Local Fixed Disk",
          encryptionStatus: "unencrypted",
          deviceID: "\\\\.\\PHYSICALDRIVE0",
        },
        {
          caption: "D:",
          size: 1000 * 1024 * 1024 * 1024, // 1TB
          freeSpace: 800 * 1024 * 1024 * 1024, // 800GB
          fileSystem: "NTFS",
          driveType: 3,
          volumeName: "Data",
          description: "Local Fixed Disk",
          encryptionStatus: "unencrypted",
          deviceID: "\\\\.\\PHYSICALDRIVE1",
        },
        {
          caption: "E:",
          size: 64 * 1024 * 1024 * 1024, // 64GB
          freeSpace: 32 * 1024 * 1024 * 1024, // 32GB
          fileSystem: "FAT32",
          driveType: 2,
          volumeName: "USB_DRIVE",
          description: "Removable Disk",
          encryptionStatus: "unencrypted",
          deviceID: "\\\\.\\PHYSICALDRIVE2",
          mediaType: "Removable",
        },
      ];

      updateOperationState("ai-analysis", {
        status: "Completed",
        message: `تم العثور على ${mockDisks.length} أقراص`,
        progress: 100,
        success: true,
      });

      setDisks(mockDisks);
    } catch (error) {
      updateOperationState("ai-analysis", {
        status: "Failed",
        message: "فشل في فحص الأقراص",
        progress: 0,
        success: false,
      });
    }
  }, [updateOperationState]);

  // بدء عملية التشفير
  const startEncryption = useCallback(
    async (disk: DiskInfo, params: Partial<EncryptionSettings>) => {
      updateOperationState("encryption", {
        status: "Preparing",
        message: `تحضير تشفير القرص ${disk.caption}...`,
        targetDisk: disk.caption,
        isRunning: true,
        progress: 0,
        startTime: new Date(),
      });

      try {
        // محاكاة مراحل التشفير
        const phases = [
          { progress: 10, message: "فحص سلامة القرص..." },
          { progress: 25, message: "إنشاء مفاتيح التشفير..." },
          { progress: 40, message: "بدء عملية التشفير..." },
          { progress: 70, message: "تشفير البيانات جاري..." },
          { progress: 90, message: "التحقق من سلامة التشفير..." },
          { progress: 100, message: "تم التشفير بنجاح!" },
        ];

        for (const phase of phases) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          updateOperationState("encryption", {
            status: "Encrypting",
            message: phase.message,
            progress: phase.progress,
          });
        }

        // تحديث حالة القرص
        setDisks((prev) =>
          prev.map((d) =>
            d.caption === disk.caption
              ? { ...d, encryptionStatus: "encrypted" }
              : d,
          ),
        );

        updateOperationState("encryption", {
          status: "Completed",
          message: "تم تشفير القرص بنجاح",
          progress: 100,
          success: true,
        });
      } catch (error) {
        updateOperationState("encryption", {
          status: "Failed",
          message: "فشل في تشفير القرص",
          progress: 0,
          success: false,
        });
      }
    },
    [updateOperationState],
  );

  // بدء عملية فك التشفير
  const startDecryption = useCallback(
    async (disk: DiskInfo, password: string) => {
      updateOperationState("decryption", {
        status: "Preparing",
        message: `تحضير فك تشفير القرص ${disk.caption}...`,
        targetDisk: disk.caption,
        isRunning: true,
        progress: 0,
        startTime: new Date(),
      });

      try {
        const phases = [
          { progress: 20, message: "التحقق من كلمة المرور..." },
          { progress: 50, message: "فك تشفير البيانات..." },
          { progress: 80, message: "استعادة هيكل الملفات..." },
          { progress: 100, message: "تم فك التشفير بنجاح!" },
        ];

        for (const phase of phases) {
          await new Promise((resolve) => setTimeout(resolve, 1200));
          updateOperationState("decryption", {
            status: "Decrypting",
            message: phase.message,
            progress: phase.progress,
          });
        }

        setDisks((prev) =>
          prev.map((d) =>
            d.caption === disk.caption
              ? { ...d, encryptionStatus: "unencrypted" }
              : d,
          ),
        );

        updateOperationState("decryption", {
          status: "Completed",
          message: "تم فك تشفير القرص بنجاح",
          progress: 100,
          success: true,
        });
      } catch (error) {
        updateOperationState("decryption", {
          status: "Failed",
          message: "فشل في فك تشفير القرص",
          progress: 0,
          success: false,
        });
      }
    },
    [updateOperationState],
  );

  // تركيب القرص المشفر
  const mountVolume = useCallback(
    async (disk: DiskInfo, password: string, driveLetter?: string) => {
      updateOperationState("mount", {
        status: "Preparing",
        message: `تركيب القرص ${disk.caption}...`,
        targetDisk: disk.caption,
        isRunning: true,
        progress: 0,
      });

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        updateOperationState("mount", {
          status: "Mounting",
          message: "جاري تركيب القرص...",
          progress: 50,
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const assignedLetter =
          driveLetter ||
          `${String.fromCharCode(70 + Math.floor(Math.random() * 10))}:`;
        setMountedVolumes((prev) => ({
          ...prev,
          [assignedLetter]: disk.caption,
        }));

        setDisks((prev) =>
          prev.map((d) =>
            d.caption === disk.caption
              ? { ...d, encryptionStatus: "mounted" }
              : d,
          ),
        );

        updateOperationState("mount", {
          status: "Mounted",
          message: `تم تركيب القرص على ${assignedLetter}`,
          progress: 100,
          success: true,
        });
      } catch (error) {
        updateOperationState("mount", {
          status: "Failed",
          message: "فشل في تركيب القرص",
          progress: 0,
          success: false,
        });
      }
    },
    [updateOperationState],
  );

  // إلغاء تركيب القرص
  const unmountVolume = useCallback(
    async (disk: DiskInfo) => {
      updateOperationState("unmount", {
        status: "Preparing",
        message: `إلغاء تركيب القرص ${disk.caption}...`,
        targetDisk: disk.caption,
        isRunning: true,
        progress: 0,
      });

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        // العثور على حرف القرص المركب
        const mountedLetter = Object.keys(mountedVolumes).find(
          (letter) => mountedVolumes[letter] === disk.caption,
        );

        if (mountedLetter) {
          setMountedVolumes((prev) => {
            const newMounted = { ...prev };
            delete newMounted[mountedLetter];
            return newMounted;
          });
        }

        setDisks((prev) =>
          prev.map((d) =>
            d.caption === disk.caption
              ? { ...d, encryptionStatus: "encrypted" }
              : d,
          ),
        );

        updateOperationState("unmount", {
          status: "Unmounted",
          message: "تم إلغاء تركيب القرص بنجاح",
          progress: 100,
          success: true,
        });
      } catch (error) {
        updateOperationState("unmount", {
          status: "Failed",
          message: "فشل في إلغاء تركيب القرص",
          progress: 0,
          success: false,
        });
      }
    },
    [updateOperationState, mountedVolumes],
  );

  // الحصول على توصيات الذكاء الاصطناعي
  const getAIRecommendations = useCallback(
    async (disk: DiskInfo) => {
      setIsLoadingAI(true);
      updateOperationState("ai-analysis", {
        status: "Analyzing",
        message: "تحليل القرص بالذكاء الاصطناعي...",
        targetDisk: disk.caption,
        isRunning: true,
        progress: 0,
      });

      try {
        // محاكاة تحليل الذكاء الاصطناعي
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const diskSizeGB = disk.size / 1024 ** 3;
        const isSystemDisk = disk.caption === "C:";
        const isRemovable = disk.driveType === 2;

        let recommendation: AIRecommendation;

        if (isSystemDisk) {
          recommendation = {
            algorithm: "AES-Serpent-Twofish",
            passwordStrengthScore: 95,
            suggestUsbKey: true,
            suggestHiddenVolume: true,
            explanation:
              "قرص النظام يتطلب أعلى مستوى أمان. ننصح بالتشفير الثلاثي ومفتاح USB.",
            confidenceScore: 0.92,
            securityLevel: "military",
            performanceImpact: "medium",
          };
        } else if (isRemovable) {
          recommendation = {
            algorithm: "AES-256",
            passwordStrengthScore: 80,
            suggestUsbKey: false,
            suggestHiddenVolume: false,
            explanation:
              "للأقراص المحمولة، AES-256 يوفر توازناً جيداً بين الأمان والأداء.",
            confidenceScore: 0.85,
            securityLevel: "high",
            performanceImpact: "low",
          };
        } else {
          recommendation = {
            algorithm: "Serpent",
            passwordStrengthScore: 85,
            suggestUsbKey: diskSizeGB > 500,
            suggestHiddenVolume: diskSizeGB > 1000,
            explanation:
              "لأقراص البيانات الكبيرة، Serpent يوفر أماناً عالياً مع أداء مقبول.",
            confidenceScore: 0.78,
            securityLevel: "high",
            performanceImpact: "medium",
          };
        }

        updateOperationState("ai-analysis", {
          status: "Completed",
          message: "تم تحليل القرص بنجاح",
          progress: 100,
          success: true,
        });

        setAiRecommendations(recommendation);
      } catch (error) {
        updateOperationState("ai-analysis", {
          status: "Failed",
          message: "فشل في تحليل القرص",
          progress: 0,
          success: false,
        });
      } finally {
        setIsLoadingAI(false);
      }
    },
    [updateOperationState],
  );

  // فحص الأقراص عند بدء التطبيق
  useEffect(() => {
    scanDisks();
  }, [scanDisks]);

  const value: SecurityContextType = {
    // الحالات
    disks,
    selectedDisk,
    encryptionSettings,
    systemContext,
    mountedVolumes,
    encryptionState,
    decryptionState,
    mountState,
    aiAnalysisState,
    aiRecommendations,
    isLoadingAI,

    // الوظائف
    setSelectedDisk,
    updateEncryptionSettings,
    scanDisks,
    startEncryption,
    startDecryption,
    mountVolume,
    unmountVolume,
    getAIRecommendations,
    updateOperationState,
    resetOperationState,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

// Hook لاستخدام Context
export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error("useSecurity must be used within a SecurityProvider");
  }
  return context;
};
