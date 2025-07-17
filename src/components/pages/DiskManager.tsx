import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSecurity } from "../../context/SecurityContext";
import AIRecommendationsCard from "../dashboard/AIRecommendationsCard";

export const DiskManager: React.FC = () => {
  const {
    disks,
    refreshDisks,
    startEncryption,
    startDecryption,
    mountVolume,
    unmountVolume,
    encryptionState,
    decryptionState,
    mountState,
    selectedDisk,
    setSelectedDisk,
  } = useSecurity();

  const [showEncryptDialog, setShowEncryptDialog] = useState(false);

  useEffect(() => {
    refreshDisks();
  }, [refreshDisks]);

  const handleEncryptDisk = (disk: any) => {
    setSelectedDisk(disk);
    setShowEncryptDialog(true);
  };

  const confirmEncryption = async (password: string, algorithm: string) => {
    if (selectedDisk) {
      await startEncryption(selectedDisk, password, { algorithm });
      setShowEncryptDialog(false);
      setSelectedDisk(null);
    }
  };

  const getDeviceIcon = (driveType: number) => {
    switch (driveType) {
      case 3:
        return "💿"; // Fixed disk
      case 2:
        return "💾"; // Removable
      case 5:
        return "📀"; // CD-ROM
      default:
        return "💽";
    }
  };

  const getEncryptionStatus = (status: string) => {
    return status === "encrypted"
      ? { icon: "🔒", text: "مشفر", color: "#059669" }
      : { icon: "🔓", text: "غير مشفر", color: "#DC2626" };
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isOperating = (diskCaption: string) => {
    return (
      (encryptionState.targetDisk === diskCaption &&
        encryptionState.isRunning) ||
      (decryptionState.targetDisk === diskCaption &&
        decryptionState.isRunning) ||
      (mountState.targetDisk === diskCaption && mountState.isRunning)
    );
  };

  return (
    <div className="page-container">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>إدارة الأقراص والتشفير</h1>
        <p>تشفير وإدارة جميع الأقراص الداخلية والخارجية</p>
        <button className="refresh-btn" onClick={refreshDisks} disabled={false}>
          🔄 تحديث
        </button>
      </motion.div>

      <div className="disk-manager-content">
        {/* AI Recommendations */}
        {selectedDisk && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AIRecommendationsCard />
          </motion.div>
        )}

        {/* Disks Grid */}
        <motion.div
          className="disks-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3>الأقراص المتاحة</h3>
          <div className="disks-grid">
            {disks.map((disk, index) => {
              const status = getEncryptionStatus(disk.encryptionStatus);
              const operating = isOperating(disk.caption);

              return (
                <motion.div
                  key={disk.caption}
                  className={`glass-card disk-card ${disk.encryptionStatus === "encrypted" ? "encrypted" : "unencrypted"}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedDisk(disk)}
                >
                  <div className="disk-header">
                    <div className="disk-icon">
                      {getDeviceIcon(disk.driveType)}
                    </div>
                    <div className="disk-info">
                      <h4>
                        {disk.caption} {disk.volumeName}
                      </h4>
                      <span className="disk-type">{disk.fileSystem}</span>
                    </div>
                    <div
                      className="disk-status"
                      style={{ color: status.color }}
                    >
                      <span className="status-icon">{status.icon}</span>
                      <span>{status.text}</span>
                    </div>
                  </div>

                  <div className="disk-storage">
                    <div className="storage-info">
                      <span>المساحة الإجمالية: {formatBytes(disk.size)}</span>
                      <span>المتاح: {formatBytes(disk.freeSpace)}</span>
                    </div>
                    <div className="storage-bar">
                      <div
                        className="storage-used"
                        style={{
                          width: `${((disk.size - disk.freeSpace) / disk.size) * 100}%`,
                          backgroundColor:
                            disk.encryptionStatus === "encrypted"
                              ? "#059669"
                              : "#DC2626",
                        }}
                      />
                    </div>
                  </div>

                  <div className="disk-actions">
                    {disk.encryptionStatus !== "encrypted" ? (
                      <button
                        className="btn btn-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEncryptDisk(disk);
                        }}
                        disabled={operating}
                      >
                        {operating ? "🔄 جاري المعالجة..." : "🔒 تشفير"}
                      </button>
                    ) : (
                      <div className="encrypted-actions">
                        {!disk.mounted ? (
                          <button
                            className="btn btn-secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              // For now, we'll need a password prompt
                              const password = prompt("أدخل كلمة المرور:");
                              if (password) mountVolume(disk, password);
                            }}
                            disabled={operating}
                          >
                            {operating ? "🔄 جاري التركيب..." : "📁 تركيب"}
                          </button>
                        ) : (
                          <button
                            className="btn btn-secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              unmountVolume(disk);
                            }}
                            disabled={operating}
                          >
                            {operating
                              ? "🔄 جاري الإلغاء..."
                              : "📤 إلغاء التركيب"}
                          </button>
                        )}
                        <button
                          className="btn btn-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            const password = prompt(
                              "أدخل كلمة المرور لفك التشفير:",
                            );
                            if (password) startDecryption(disk, password);
                          }}
                          disabled={operating}
                        >
                          {operating
                            ? "🔄 جاري فك التشفير..."
                            : "🔓 فك التشفير"}
                        </button>
                      </div>
                    )}
                  </div>

                  {operating && (
                    <div className="operation-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${encryptionState.progress || decryptionState.progress || mountState.progress}%`,
                          }}
                        />
                      </div>
                      <span>
                        {encryptionState.message ||
                          decryptionState.message ||
                          mountState.message}
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Encryption Dialog */}
      <AnimatePresence>
        {showEncryptDialog && selectedDisk && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content glass-card"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              <h3>تشفير القرص {selectedDisk.caption}:</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  confirmEncryption(
                    formData.get("password") as string,
                    formData.get("algorithm") as string,
                  );
                }}
              >
                <div className="form-group">
                  <label>كلمة المرور:</label>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="أدخل كلمة مرور قوية"
                  />
                </div>
                <div className="form-group">
                  <label>خوارزمية التشفير:</label>
                  <select name="algorithm" defaultValue="AES-256">
                    <option value="AES-256">AES-256</option>
                    <option value="Serpent">Serpent</option>
                    <option value="Twofish">Twofish</option>
                    <option value="AES-Serpent-Twofish">
                      AES-Serpent-Twofish
                    </option>
                  </select>
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setShowEncryptDialog(false)}
                  >
                    إلغاء
                  </button>
                  <button type="submit" className="btn-primary">
                    تشفير الآن
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
