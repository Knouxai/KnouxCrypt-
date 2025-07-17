import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSecurityContext } from "../../context/SecurityContext";
import { AIRecommendationsCard } from "../dashboard/AIRecommendationsCard";

interface Disk {
  letter: string;
  label: string;
  filesystem: string;
  size: string;
  used: string;
  available: string;
  encrypted: boolean;
  mounted: boolean;
  deviceType: "hdd" | "ssd" | "usb" | "optical";
}

export const DiskManager: React.FC = () => {
  const {
    disks,
    operations,
    refreshDisks,
    encryptDisk,
    decryptDisk,
    mountVolume,
    unmountVolume,
  } = useSecurityContext();
  const [selectedDisk, setSelectedDisk] = useState<Disk | null>(null);
  const [showEncryptDialog, setShowEncryptDialog] = useState(false);

  useEffect(() => {
    refreshDisks();
  }, [refreshDisks]);

  const handleEncryptDisk = async (disk: Disk) => {
    setSelectedDisk(disk);
    setShowEncryptDialog(true);
  };

  const confirmEncryption = async (password: string, algorithm: string) => {
    if (selectedDisk) {
      await encryptDisk(selectedDisk.letter, password, algorithm);
      setShowEncryptDialog(false);
      setSelectedDisk(null);
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "ssd":
        return "💾";
      case "hdd":
        return "💿";
      case "usb":
        return "🔌";
      case "optical":
        return "📀";
      default:
        return "💽";
    }
  };

  const getEncryptionStatus = (encrypted: boolean) => {
    return encrypted
      ? { icon: "🔒", text: "مشفر", color: "#059669" }
      : { icon: "🔓", text: "غير مشفر", color: "#DC2626" };
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
        <button
          className="refresh-btn"
          onClick={refreshDisks}
          disabled={operations.refreshing}
        >
          {operations.refreshing ? "🔄 جاري التحديث..." : "🔄 تحديث"}
        </button>
      </motion.div>

      <div className="disk-manager-content">
        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AIRecommendationsCard />
        </motion.div>

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
              const status = getEncryptionStatus(disk.encrypted);
              const isOperating =
                operations.encrypting === disk.letter ||
                operations.decrypting === disk.letter ||
                operations.mounting === disk.letter ||
                operations.unmounting === disk.letter;

              return (
                <motion.div
                  key={disk.letter}
                  className={`glass-card disk-card ${disk.encrypted ? "encrypted" : "unencrypted"}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="disk-header">
                    <div className="disk-icon">
                      {getDeviceIcon(disk.deviceType)}
                    </div>
                    <div className="disk-info">
                      <h4>
                        {disk.letter}: {disk.label}
                      </h4>
                      <span className="disk-type">{disk.filesystem}</span>
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
                      <span>المساحة الإجمالية: {disk.size}</span>
                      <span>المستخدم: {disk.used}</span>
                      <span>المتاح: {disk.available}</span>
                    </div>
                    <div className="storage-bar">
                      <div
                        className="storage-used"
                        style={{
                          width: `${(parseFloat(disk.used) / parseFloat(disk.size)) * 100}%`,
                          backgroundColor: disk.encrypted
                            ? "#059669"
                            : "#DC2626",
                        }}
                      />
                    </div>
                  </div>

                  <div className="disk-actions">
                    {!disk.encrypted ? (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEncryptDisk(disk)}
                        disabled={isOperating}
                      >
                        {operations.encrypting === disk.letter
                          ? "🔄 جاري التشفير..."
                          : "🔒 تشفير"}
                      </button>
                    ) : (
                      <div className="encrypted-actions">
                        {!disk.mounted ? (
                          <button
                            className="btn btn-secondary"
                            onClick={() => mountVolume(disk.letter)}
                            disabled={isOperating}
                          >
                            {operations.mounting === disk.letter
                              ? "🔄 جاري التركيب..."
                              : "📁 تركيب"}
                          </button>
                        ) : (
                          <button
                            className="btn btn-secondary"
                            onClick={() => unmountVolume(disk.letter)}
                            disabled={isOperating}
                          >
                            {operations.unmounting === disk.letter
                              ? "🔄 جاري الإلغاء..."
                              : "📤 إلغاء التركيب"}
                          </button>
                        )}
                        <button
                          className="btn btn-danger"
                          onClick={() => decryptDisk(disk.letter)}
                          disabled={isOperating}
                        >
                          {operations.decrypting === disk.letter
                            ? "🔄 جاري فك التشفير..."
                            : "🔓 فك التشفير"}
                        </button>
                      </div>
                    )}
                  </div>

                  {isOperating && (
                    <div className="operation-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" />
                      </div>
                      <span>جاري المعالجة...</span>
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
              <h3>تشفير القرص {selectedDisk.letter}:</h3>
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
