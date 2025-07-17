import React, { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "../UI/GlassCard";
import NeonText from "../UI/NeonText";
import ProgressRing from "../UI/ProgressRing";
import NeonButton from "../UI/NeonButton";
import {
  useSecurity,
  DiskInfo,
  OperationState,
} from "../../context/SecurityContext";

const DiskSummaryCard: React.FC = () => {
  const {
    disks,
    selectedDisk,
    setSelectedDisk,
    startEncryption,
    encryptionState,
    decryptionState,
    startDecryption,
    mountVolume,
    unmountVolume,
    mountedVolumes,
    isLoadingAI,
    getAIRecommendations,
  } = useSecurity();

  const [expandedDisk, setExpandedDisk] = useState<DiskInfo | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentAction, setCurrentAction] = useState<{
    disk: DiskInfo;
    action: string;
  } | null>(null);
  const [password, setPassword] = useState("");

  // تحديد حالة العملية لقرص معين
  const getDiskOperationState = (disk: DiskInfo): OperationState | null => {
    if (
      encryptionState.isRunning &&
      encryptionState.targetDisk === disk.caption
    )
      return encryptionState;
    if (
      decryptionState.isRunning &&
      decryptionState.targetDisk === disk.caption
    )
      return decryptionState;
    return null;
  };

  // معالج إجراءات الأقراص
  const handleDiskAction = async (
    disk: DiskInfo,
    action: "select" | "encrypt" | "decrypt" | "mount" | "unmount" | "analyze",
  ) => {
    if (action === "select") {
      setSelectedDisk(disk === expandedDisk ? null : disk);
      setExpandedDisk(disk === expandedDisk ? null : disk);
    } else if (action === "analyze") {
      await getAIRecommendations(disk);
    } else if (
      action === "encrypt" ||
      action === "decrypt" ||
      action === "mount"
    ) {
      setCurrentAction({ disk, action });
      setShowPasswordModal(true);
    } else if (action === "unmount") {
      await unmountVolume(disk);
    }
  };

  // تنفيذ الإجراء مع ك��مة المرور
  const executeActionWithPassword = async () => {
    if (!currentAction || !password.trim()) return;

    const { disk, action } = currentAction;

    try {
      if (action === "encrypt") {
        await startEncryption(disk, { password });
      } else if (action === "decrypt") {
        await startDecryption(disk, password);
      } else if (action === "mount") {
        await mountVolume(disk, password);
      }
    } finally {
      setShowPasswordModal(false);
      setPassword("");
      setCurrentAction(null);
    }
  };

  // التحقق من تركيب القرص
  const isDiskMounted = (disk: DiskInfo): boolean => {
    if (!disk.caption) return false;
    return Object.keys(mountedVolumes).some(
      (driveLetter) => mountedVolumes[driveLetter] === disk.caption,
    );
  };

  // أيقونة القرص بناءً على الحالة
  const getDiskIcon = (disk: DiskInfo) => {
    switch (disk.encryptionStatus) {
      case "encrypted":
        return "🔒";
      case "processing":
      case "preparing":
        return "⏳";
      case "mounted":
        return "📂";
      default:
        return disk.driveType === 2 ? "💾" : "🖴";
    }
  };

  // لون القرص بناءً على الحالة
  const getDiskStatusColor = (disk: DiskInfo) => {
    switch (disk.encryptionStatus) {
      case "encrypted":
        return "text-green-400";
      case "processing":
      case "preparing":
        return "text-yellow-400";
      case "mounted":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <>
      <GlassCard className="flex flex-col h-full" padding="medium">
        <div className="flex items-center justify-between mb-6">
          <NeonText size="large" className="text-2xl" gradient>
            💾 ملخص الأقراص
          </NeonText>
          <NeonButton
            size="small"
            variant="secondary"
            onClick={() => window.location.reload()}
            icon="🔄"
          >
            تحديث
          </NeonButton>
        </div>

        <div className="flex-grow overflow-y-auto max-h-96 space-y-3 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-800">
          {disks.length === 0 && !isLoadingAI && (
            <motion.div
              className="text-center py-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-gray-400 mb-4">لم يتم العثور على أقراص</p>
              <NeonButton
                onClick={() => window.location.reload()}
                variant="secondary"
              >
                فحص الأقراص
              </NeonButton>
            </motion.div>
          )}

          {disks.length === 0 && isLoadingAI && (
            <motion.div
              className="flex flex-col items-center justify-center h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <ProgressRing progress={50} size={60} />
              <NeonText size="normal" className="mt-4">
                جاري تحليل النظام...
              </NeonText>
              <p className="text-gray-400 text-sm mt-2">فحص الأقراص المتاحة</p>
            </motion.div>
          )}

          {disks.map((disk, index) => {
            const operationState = getDiskOperationState(disk);
            const mounted = isDiskMounted(disk);
            const isExpanded = expandedDisk?.caption === disk.caption;

            return (
              <motion.div
                key={disk.caption || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  relative p-4 rounded-xl border backdrop-blur-sm transition-all duration-300
                  ${
                    isExpanded
                      ? "bg-white/20 border-purple-400 shadow-lg shadow-purple-500/20"
                      : "bg-white/10 border-white/20 hover:bg-white/15"
                  }
                `}
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => handleDiskAction(disk, "select")}
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <span className={`text-2xl ${getDiskStatusColor(disk)}`}>
                      {getDiskIcon(disk)}
                    </span>
                    <div>
                      <p className="text-gray-200 font-medium">
                        {disk.caption || "قرص غير معروف"}
                        {disk.volumeName && ` (${disk.volumeName})`}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {disk.fileSystem} | {(disk.size / 1024 ** 3).toFixed(1)}{" "}
                        GB
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 space-x-reverse">
                    {operationState?.isRunning && (
                      <ProgressRing
                        progress={operationState.progress}
                        size={35}
                        strokeWidth={3}
                        color="#FFD700"
                        showPercentage={false}
                      />
                    )}

                    {!operationState?.isRunning && (
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {disk.encryptionStatus === "encrypted" &&
                          (mounted ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDiskAction(disk, "unmount");
                              }}
                              className="px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-xs text-white transition"
                            >
                              إلغاء التركيب
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDiskAction(disk, "mount");
                              }}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs text-white transition"
                            >
                              تركيب
                            </button>
                          ))}

                        {disk.encryptionStatus === "unencrypted" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDiskAction(disk, "encrypt");
                            }}
                            className="px-2 py-1 bg-purple-600 hover:bg-purple-500 rounded text-xs text-white transition"
                          >
                            تشفير
                          </button>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDiskAction(disk, "analyze");
                          }}
                          className="px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-xs text-white transition"
                        >
                          تحليل AI
                        </button>

                        <span
                          className={`transform transition-all duration-300 ${isExpanded ? "rotate-180" : ""}`}
                        >
                          ▼
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* قسم التفاصيل الموسع */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg"
                  >
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-300 font-medium">نوع القرص:</p>
                        <p className="text-gray-400">
                          {disk.driveType === 2 ? "محمول" : "ثابت"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-300 font-medium">
                          المساحة الفارغة:
                        </p>
                        <p className="text-gray-400">
                          {(disk.freeSpace / 1024 ** 3).toFixed(1)} GB
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-300 font-medium">
                          حالة التشفير:
                        </p>
                        <p
                          className={`font-medium ${getDiskStatusColor(disk)}`}
                        >
                          {disk.encryptionStatus === "encrypted"
                            ? "مشفر"
                            : disk.encryptionStatus === "unencrypted"
                              ? "غير مشفر"
                              : disk.encryptionStatus === "processing"
                                ? "جاري المعالجة"
                                : "غير معروف"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-300 font-medium">
                          معرف الجهاز:
                        </p>
                        <p className="text-gray-400 text-xs">{disk.deviceID}</p>
                      </div>
                    </div>

                    {operationState && operationState.status !== "Idle" && (
                      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-yellow-300">
                              العملية: {operationState.status} (
                              {operationState.progress}%)
                            </p>
                            <p className="text-xs text-yellow-400">
                              {operationState.message}
                            </p>
                          </div>
                          {operationState.isRunning && (
                            <ProgressRing
                              progress={operationState.progress}
                              size={40}
                              strokeWidth={4}
                              color="#FFD700"
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {disk.encryptionStatus === "encrypted" &&
                      !operationState?.isRunning && (
                        <div className="mt-4">
                          <NeonButton
                            onClick={() => handleDiskAction(disk, "decrypt")}
                            variant="danger"
                            size="small"
                            fullWidth
                          >
                            فك التشفير الدائم (خطر!)
                          </NeonButton>
                        </div>
                      )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </GlassCard>

      {/* ن��فذة كلمة المرور */}
      {showPasswordModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-gray-900/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-96"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
          >
            <h3 className="text-xl font-bold text-white mb-4">
              أدخل كلمة المرور
            </h3>
            <p className="text-gray-400 mb-4">
              {currentAction?.action === "encrypt"
                ? "تشفير"
                : currentAction?.action === "decrypt"
                  ? "فك تشفير"
                  : "تركيب"}
              القرص {currentAction?.disk.caption}
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              placeholder="كلمة المرور..."
              onKeyPress={(e) =>
                e.key === "Enter" && executeActionWithPassword()
              }
            />
            <div className="flex space-x-3 space-x-reverse mt-4">
              <NeonButton
                onClick={executeActionWithPassword}
                disabled={!password.trim()}
                fullWidth
              >
                تنفيذ
              </NeonButton>
              <NeonButton
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword("");
                  setCurrentAction(null);
                }}
                variant="secondary"
                fullWidth
              >
                إلغاء
              </NeonButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default DiskSummaryCard;
