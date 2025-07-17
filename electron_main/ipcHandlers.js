// electron_main/ipcHandlers.js (Comprehensive AI and Disk Operations Integration)

const { ipcMain, dialog, app, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const os = require("os");
const { execFile } = require("child_process");

// Assume VeraCryptWrapper instance is created and exported from core
const veraCryptManager = require("./core/veracryptWrapper");
const diskManager = require("./core/diskManager");

let mainWindow; // Keep a reference to the main window to send events
let systemInfo = null; // Cache system information

function setupIpcHandlers(window) {
  mainWindow = window;

  // --- System Information Handler ---
  ipcMain.handle("get-system-info", async (event) => {
    console.log("IPC: Received request for system information.");
    try {
      if (!systemInfo) {
        // Load system information including disk detection
        systemInfo = {
          platform: os.platform(),
          release: os.release(),
          arch: os.arch(),
          totalMemory: os.totalmem(),
          freeMemory: os.freemem(),
          cpus: os.cpus(),
          uefiSecureBoot: os.platform() === "win32" ? true : false, // Simplified
          drives: await diskManager.getAvailableDisks(), // Detect all drives
          veracryptInstalled: await veraCryptManager.checkInstallation(),
          timestamp: Date.now(),
        };
      }
      return systemInfo;
    } catch (error) {
      console.error("Failed to get system information:", error);
      return { error: error.message, drives: [] };
    }
  });

  // --- AI Service Handlers ---
  ipcMain.handle("run-ai-analysis", async (event, diskInfo) => {
    console.log("IPC: Received request to run AI analysis.");

    if (!diskInfo) {
      return {
        success: false,
        error: "Disk information not available.",
        data: null,
      };
    }

    // Ensure system info is loaded
    if (!systemInfo) {
      try {
        systemInfo = await ipcMain.handleOnce("get-system-info")(event);
      } catch (error) {
        return {
          success: false,
          error: "Failed to load system information.",
          data: null,
        };
      }
    }

    const pythonExecutable = "python"; // Assumes Python is in PATH
    // OR: const pythonExecutable = path.join(app.getAppPath(), '..', 'python', 'python.exe'); // If bundling Python

    // Construct absolute path to the AI script
    const aiScriptPath = path.join(__dirname, "ai_service", "disk_analyzer.py");

    if (!fs.existsSync(aiScriptPath)) {
      console.error(`AI script not found at: ${aiScriptPath}`);
      return {
        success: false,
        error: "AI analysis script not found.",
        data: null,
      };
    }

    try {
      // Convert disk and system info to JSON strings for arguments
      const diskInfoStr = JSON.stringify(diskInfo);
      const systemContextStr = JSON.stringify({
        platform: systemInfo.platform,
        release: systemInfo.release,
        arch: systemInfo.arch,
        totalMemory: systemInfo.totalMemory,
        freeMemory: systemInfo.freeMemory,
        cpuCount: systemInfo.cpus?.length || 1,
        uefiSecureBoot: systemInfo.uefiSecureBoot,
        timestamp: Date.now(),
      });

      const { stdout, stderr } = await new Promise((resolve, reject) => {
        // Execute the Python script
        execFile(
          pythonExecutable,
          [aiScriptPath, diskInfoStr, systemContextStr],
          { encoding: "utf8", shell: false, timeout: 30000 }, // 30 second timeout
          (error, stdout, stderr) => {
            if (error) {
              console.error(`Python AI Execution Error: ${error}`);
              return reject({ error: error.message, stderr, stdout });
            }
            resolve({ stdout, stderr });
          },
        );
      });

      // Parse stdout for results, stderr for errors/warnings
      if (stderr && stderr.includes("ERROR")) {
        console.error(`Python AI Critical Error: ${stderr}`);
        return {
          success: false,
          error: "AI analysis encountered critical errors.",
          data: null,
        };
      } else if (stderr && stderr.includes("WARNING")) {
        console.warn(`Python AI Warnings: ${stderr}`);
      }

      try {
        const results = JSON.parse(stdout);
        console.log("AI Analysis Results:", results);

        // Emit the result back to the renderer
        mainWindow.webContents.send("ai-analysis-result", {
          success: true,
          data: results,
        });
        return { success: true, data: results }; // Also return it for `invoke` response
      } catch (parseError) {
        console.error("Failed to parse AI output:", parseError);
        mainWindow.webContents.send("ai-analysis-result", {
          success: false,
          error: "Failed to parse AI analysis results.",
          data: null,
        });
        return {
          success: false,
          error: "Failed to parse AI output.",
          data: null,
        };
      }
    } catch (error) {
      console.error("Failed to execute AI analysis:", error);
      // Send failure status back to renderer
      mainWindow.webContents.send("ai-analysis-result", {
        success: false,
        error: error.error || error.message || "Unknown error occurred.",
        data: null,
      });
      return {
        success: false,
        error: error.message || "Execution failed.",
        data: null,
      };
    }
  });

  // --- VeraCrypt/DiskCryptor Operation Handlers ---
  ipcMain.handle("encrypt-drive", async (event, params) => {
    console.log("IPC: Encrypt drive request received", params);
    try {
      // Validate parameters
      if (!params.disk || !params.password || !params.algorithm) {
        return {
          success: false,
          message: "Missing required encryption parameters.",
        };
      }

      // Use the VeraCrypt wrapper instance
      const result = await veraCryptManager.createVolume({
        devicePath: params.disk.caption,
        password: params.password,
        algorithm: params.algorithm,
        useUsbKey: params.useUsbKey || false,
        usbKeyPath: params.usbKeyPath,
        hiddenVolume: params.hiddenVolume || false,
        filesystem: params.filesystem || "NTFS",
        quickFormat: params.quickFormat !== false,
      });

      return result;
    } catch (error) {
      console.error("Error handling encrypt-drive IPC:", error);
      return {
        success: false,
        message: error.message || "An unexpected error occurred.",
      };
    }
  });

  ipcMain.handle("decrypt-drive", async (event, params) => {
    console.log("IPC: Decrypt drive request received", params);
    try {
      if (!params.disk || !params.password) {
        return {
          success: false,
          message: "Missing required decryption parameters.",
        };
      }

      const result = await veraCryptManager.decryptVolume({
        devicePath: params.disk.caption,
        password: params.password,
      });

      return result;
    } catch (error) {
      console.error("Error handling decrypt-drive IPC:", error);
      return {
        success: false,
        message: error.message || "An unexpected error occurred.",
      };
    }
  });

  // --- Mount/Unmount Handlers ---
  ipcMain.handle("mount-volume", async (event, params) => {
    console.log("IPC: Mount volume request received", params);
    try {
      if (!params.disk || !params.password) {
        return {
          success: false,
          message: "Missing required mount parameters.",
        };
      }

      const result = await veraCryptManager.mountVolume({
        devicePath: params.disk.caption,
        password: params.password,
        mountLetter: params.driveLetter,
        useUsbKey: params.useUsbKey || false,
        usbKeyPath: params.usbKeyPath,
      });

      return result;
    } catch (error) {
      console.error("Error handling mount-volume IPC:", error);
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle("unmount-volume", async (event, params) => {
    console.log("IPC: Unmount volume request received", params);
    try {
      if (!params.disk) {
        return {
          success: false,
          message: "Missing required unmount parameters.",
        };
      }

      const result = await veraCryptManager.unmountVolume({
        devicePath: params.disk.caption,
        mountLetter: params.disk.mountLetter,
      });

      return result;
    } catch (error) {
      console.error("Error handling unmount-volume IPC:", error);
      return { success: false, message: error.message };
    }
  });

  // --- Disk Management Handlers ---
  ipcMain.handle("refresh-disks", async (event) => {
    console.log("IPC: Refresh disks request received");
    try {
      const disks = await diskManager.getAvailableDisks();
      // Update cached system info
      if (systemInfo) {
        systemInfo.drives = disks;
        systemInfo.timestamp = Date.now();
      }

      // Emit updated disk list to renderer
      mainWindow.webContents.send("disk-status-update", disks);
      return { success: true, disks };
    } catch (error) {
      console.error("Error refreshing disks:", error);
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle("get-disk-details", async (event, diskCaption) => {
    console.log("IPC: Get disk details request received for:", diskCaption);
    try {
      const details = await diskManager.getDiskDetails(diskCaption);
      return { success: true, details };
    } catch (error) {
      console.error("Error getting disk details:", error);
      return { success: false, message: error.message };
    }
  });

  // --- VeraCrypt Tool Management ---
  ipcMain.handle("check-veracrypt", async (event) => {
    console.log("IPC: Check VeraCrypt installation");
    try {
      const isInstalled = await veraCryptManager.checkInstallation();
      const version = isInstalled ? await veraCryptManager.getVersion() : null;

      return {
        success: true,
        installed: isInstalled,
        version: version,
      };
    } catch (error) {
      console.error("Error checking VeraCrypt:", error);
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle("download-veracrypt", async (event) => {
    console.log("IPC: Download VeraCrypt request");
    try {
      // Open VeraCrypt download page
      await shell.openExternal("https://www.veracrypt.fr/en/Downloads.html");
      return { success: true };
    } catch (error) {
      console.error("Error opening VeraCrypt download:", error);
      return { success: false, message: error.message };
    }
  });

  // --- File Dialog Handlers ---
  ipcMain.handle("select-usb-key-file", async (event) => {
    console.log("IPC: Select USB key file");
    try {
      const result = await dialog.showOpenDialog(mainWindow, {
        title: "Select USB Key File",
        filters: [
          { name: "Key Files", extensions: ["key", "keyfile", "*"] },
          { name: "All Files", extensions: ["*"] },
        ],
        properties: ["openFile"],
      });

      if (!result.canceled && result.filePaths.length > 0) {
        return { success: true, filePath: result.filePaths[0] };
      } else {
        return { success: false, message: "No file selected" };
      }
    } catch (error) {
      console.error("Error selecting USB key file:", error);
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle("select-backup-location", async (event) => {
    console.log("IPC: Select backup location");
    try {
      const result = await dialog.showSaveDialog(mainWindow, {
        title: "Select Backup Location",
        defaultPath: `KnouxCrypt_Backup_${new Date().toISOString().split("T")[0]}.vcbak`,
        filters: [
          { name: "VeraCrypt Backup", extensions: ["vcbak"] },
          { name: "All Files", extensions: ["*"] },
        ],
      });

      if (!result.canceled && result.filePath) {
        return { success: true, filePath: result.filePath };
      } else {
        return { success: false, message: "No location selected" };
      }
    } catch (error) {
      console.error("Error selecting backup location:", error);
      return { success: false, message: error.message };
    }
  });

  // --- Event Listeners from VeraCryptWrapper ---
  // Forward VeraCryptWrapper's events to the renderer process
  if (veraCryptManager) {
    // Ensure manager is available
    veraCryptManager.on("status-update", (data) => {
      // Data should have a 'type' (e.g., 'encryption', 'mount') and state details
      console.log("Main Process emitting status update:", data);
      mainWindow.webContents.send("operation-progress", data);
    });

    veraCryptManager.on("tool-status", (data) => {
      console.log("Main Process emitting tool status:", data);
      mainWindow.webContents.send("tool-status-update", data);
    });

    veraCryptManager.on("operation-complete", (data) => {
      console.log("Main Process emitting operation complete:", data);
      mainWindow.webContents.send("operation-complete", data);

      // Refresh disk list after operations
      if (
        data.type === "encryption" ||
        data.type === "decryption" ||
        data.type === "mount" ||
        data.type === "unmount"
      ) {
        setTimeout(async () => {
          try {
            const disks = await diskManager.getAvailableDisks();
            mainWindow.webContents.send("disk-status-update", disks);
          } catch (error) {
            console.error("Error refreshing disks after operation:", error);
          }
        }, 1000);
      }
    });

    veraCryptManager.on("operation-error", (data) => {
      console.log("Main Process emitting operation error:", data);
      mainWindow.webContents.send("operation-error", data);
    });
  }

  // --- Cleanup handlers ---
  ipcMain.handle("cleanup-temp-files", async (event) => {
    console.log("IPC: Cleanup temporary files");
    try {
      // Clean up any temporary files created during operations
      // This is important for security
      const result = await veraCryptManager.cleanupTempFiles();
      return { success: true, result };
    } catch (error) {
      console.error("Error cleaning up temp files:", error);
      return { success: false, message: error.message };
    }
  });

  // Invalidate system info cache periodically
  setInterval(() => {
    systemInfo = null; // Force reload on next request
  }, 300000); // 5 minutes

  console.log("IPC handlers setup completed");
}

module.exports = setupIpcHandlers;
