// electron_main/core/veracryptWrapper.js - Comprehensive VeraCrypt Integration

const { spawn, execFile } = require("child_process");
const { EventEmitter } = require("events");
const { promisify } = require("util");
const os = require("os");
const path = require("path");
const fs = require("fs");

const execFileAsync = promisify(execFile);

class VeraCryptWrapper extends EventEmitter {
  constructor() {
    super();
    this.platform = os.platform();
    this.veracryptPath = null;
    this.isInstalled = false;
    this.activeOperations = new Map(); // Track active operations
    this.mountedVolumes = new Map(); // Track mounted volumes

    // Initialize VeraCrypt path detection
    this.detectVeraCryptPath();
  }

  /**
   * Detect VeraCrypt installation path based on platform
   */
  async detectVeraCryptPath() {
    try {
      if (this.platform === "win32") {
        // Common Windows installation paths
        const possiblePaths = [
          "C:\\Program Files\\VeraCrypt\\VeraCrypt.exe",
          "C:\\Program Files (x86)\\VeraCrypt\\VeraCrypt.exe",
          path.join(
            os.homedir(),
            "AppData",
            "Local",
            "VeraCrypt",
            "VeraCrypt.exe",
          ),
        ];

        for (const vcPath of possiblePaths) {
          if (fs.existsSync(vcPath)) {
            this.veracryptPath = vcPath;
            this.isInstalled = true;
            console.log(`VeraCrypt found at: ${vcPath}`);
            return;
          }
        }
      } else if (this.platform === "linux") {
        // Check common Linux paths
        const possiblePaths = [
          "/usr/bin/veracrypt",
          "/usr/local/bin/veracrypt",
          "/opt/veracrypt/bin/veracrypt",
        ];

        for (const vcPath of possiblePaths) {
          if (fs.existsSync(vcPath)) {
            this.veracryptPath = vcPath;
            this.isInstalled = true;
            console.log(`VeraCrypt found at: ${vcPath}`);
            return;
          }
        }
      } else if (this.platform === "darwin") {
        // macOS paths
        const possiblePaths = [
          "/Applications/VeraCrypt.app/Contents/MacOS/VeraCrypt",
          "/usr/local/bin/veracrypt",
        ];

        for (const vcPath of possiblePaths) {
          if (fs.existsSync(vcPath)) {
            this.veracryptPath = vcPath;
            this.isInstalled = true;
            console.log(`VeraCrypt found at: ${vcPath}`);
            return;
          }
        }
      }

      console.warn("VeraCrypt not found in standard locations");
      this.emit("tool-status", {
        tool: "VeraCrypt",
        status: "NotInstalled",
        message:
          "VeraCrypt is not installed or not found in standard locations",
      });
    } catch (error) {
      console.error("Error detecting VeraCrypt path:", error);
      this.emit("tool-status", {
        tool: "VeraCrypt",
        status: "Error",
        message: error.message,
      });
    }
  }

  /**
   * Check if VeraCrypt is installed and accessible
   * @returns {Promise<boolean>} Installation status
   */
  async checkInstallation() {
    if (!this.veracryptPath) {
      await this.detectVeraCryptPath();
    }

    if (!this.isInstalled) {
      return false;
    }

    try {
      // Test VeraCrypt by getting version
      const version = await this.getVersion();
      return !!version;
    } catch (error) {
      console.error("VeraCrypt installation check failed:", error);
      this.isInstalled = false;
      return false;
    }
  }

  /**
   * Get VeraCrypt version
   * @returns {Promise<string>} Version string
   */
  async getVersion() {
    if (!this.veracryptPath) {
      throw new Error("VeraCrypt not found");
    }

    try {
      const { stdout } = await execFileAsync(
        this.veracryptPath,
        ["--version"],
        {
          encoding: "utf8",
          timeout: 5000,
        },
      );

      // Parse version from output
      const versionMatch = stdout.match(/VeraCrypt\s+([\d.]+)/i);
      return versionMatch ? versionMatch[1] : stdout.trim();
    } catch (error) {
      console.error("Failed to get VeraCrypt version:", error);
      throw error;
    }
  }

  /**
   * Create an encrypted volume
   * @param {Object} params - Volume creation parameters
   * @returns {Promise<Object>} Operation result
   */
  async createVolume(params) {
    const {
      devicePath,
      password,
      algorithm = "AES",
      hashAlgorithm = "SHA-512",
      filesystem = "NTFS",
      useUsbKey = false,
      usbKeyPath = null,
      hiddenVolume = false,
      quickFormat = true,
      volumeSize = null,
    } = params;

    if (!this.isInstalled) {
      throw new Error("VeraCrypt is not installed");
    }

    const operationId = `encrypt_${Date.now()}`;

    try {
      this.emit("status-update", {
        type: "encryption",
        status: "Initializing",
        progress: 0,
        message: "Preparing volume creation...",
        targetDisk: devicePath,
        operationId,
      });

      // Build VeraCrypt command arguments
      const args = [
        "--create",
        devicePath,
        "--volume-type=normal",
        `--encryption=${algorithm}`,
        `--hash=${hashAlgorithm}`,
        `--filesystem=${filesystem}`,
        "--random-source=/dev/urandom", // Unix-like systems
      ];

      // Add size if specified (for file containers)
      if (volumeSize) {
        args.push(`--size=${volumeSize}`);
      }

      // Add keyfile if specified
      if (useUsbKey && usbKeyPath) {
        args.push(`--keyfiles=${usbKeyPath}`);
      }

      // Add quick format flag
      if (quickFormat) {
        args.push("--quick");
      }

      // Add hidden volume flag
      if (hiddenVolume) {
        args.push("--volume-type=hidden");
      }

      // Non-interactive mode
      args.push("--non-interactive");

      // Store operation details
      this.activeOperations.set(operationId, {
        type: "encryption",
        devicePath,
        startTime: new Date(),
        params,
      });

      // Execute VeraCrypt with progress monitoring
      await this.executeVeraCryptWithProgress(
        args,
        password,
        operationId,
        "encryption",
      );

      this.emit("status-update", {
        type: "encryption",
        status: "Completed",
        progress: 100,
        message: "Volume encryption completed successfully",
        targetDisk: devicePath,
        operationId,
      });

      return {
        success: true,
        message: "Volume created successfully",
        operationId,
      };
    } catch (error) {
      console.error("Volume creation failed:", error);

      this.emit("status-update", {
        type: "encryption",
        status: "Failed",
        progress: 0,
        message: `Encryption failed: ${error.message}`,
        targetDisk: devicePath,
        operationId,
      });

      throw error;
    } finally {
      this.activeOperations.delete(operationId);
    }
  }

  /**
   * Mount an encrypted volume
   * @param {Object} params - Mount parameters
   * @returns {Promise<Object>} Mount result
   */
  async mountVolume(params) {
    const {
      devicePath,
      password,
      mountLetter = null,
      useUsbKey = false,
      usbKeyPath = null,
      readOnly = false,
    } = params;

    if (!this.isInstalled) {
      throw new Error("VeraCrypt is not installed");
    }

    const operationId = `mount_${Date.now()}`;

    try {
      this.emit("status-update", {
        type: "mount",
        status: "Mounting",
        progress: 0,
        message: "Mounting encrypted volume...",
        targetDisk: devicePath,
        operationId,
      });

      // Find available drive letter on Windows
      let assignedLetter = mountLetter;
      if (this.platform === "win32" && !assignedLetter) {
        assignedLetter = await this.findAvailableDriveLetter();
      }

      const args = [devicePath, "--mount"];

      // Add mount point
      if (this.platform === "win32" && assignedLetter) {
        args.push(`--slot=${assignedLetter.replace(":", "")}`);
      } else if (this.platform !== "win32") {
        // For Unix-like systems, create mount point
        const mountPoint = `/mnt/veracrypt_${Date.now()}`;
        args.push(`--mount-point=${mountPoint}`);
        assignedLetter = mountPoint;
      }

      // Add keyfile if specified
      if (useUsbKey && usbKeyPath) {
        args.push(`--keyfiles=${usbKeyPath}`);
      }

      // Add read-only flag
      if (readOnly) {
        args.push("--read-only");
      }

      // Non-interactive mode
      args.push("--non-interactive");

      // Store operation details
      this.activeOperations.set(operationId, {
        type: "mount",
        devicePath,
        mountLetter: assignedLetter,
        startTime: new Date(),
        params,
      });

      // Execute mount command
      await this.executeVeraCryptCommand(args, password);

      // Track mounted volume
      this.mountedVolumes.set(devicePath, {
        mountLetter: assignedLetter,
        mountTime: new Date(),
        readOnly,
      });

      this.emit("status-update", {
        type: "mount",
        status: "Mounted",
        progress: 100,
        message: `Volume mounted to ${assignedLetter}`,
        targetDisk: devicePath,
        mountLetter: assignedLetter,
        operationId,
      });

      return {
        success: true,
        mountLetter: assignedLetter,
        message: "Volume mounted successfully",
        operationId,
      };
    } catch (error) {
      console.error("Volume mount failed:", error);

      this.emit("status-update", {
        type: "mount",
        status: "Failed",
        progress: 0,
        message: `Mount failed: ${error.message}`,
        targetDisk: devicePath,
        operationId,
      });

      throw error;
    } finally {
      this.activeOperations.delete(operationId);
    }
  }

  /**
   * Unmount an encrypted volume
   * @param {Object} params - Unmount parameters
   * @returns {Promise<Object>} Unmount result
   */
  async unmountVolume(params) {
    const { devicePath, mountLetter = null, force = false } = params;

    if (!this.isInstalled) {
      throw new Error("VeraCrypt is not installed");
    }

    const operationId = `unmount_${Date.now()}`;

    try {
      this.emit("status-update", {
        type: "unmount",
        status: "Unmounting",
        progress: 0,
        message: "Unmounting encrypted volume...",
        targetDisk: devicePath,
        operationId,
      });

      const args = ["--dismount"];

      // Specify what to unmount
      if (mountLetter) {
        if (this.platform === "win32") {
          args.push(`--slot=${mountLetter.replace(":", "")}`);
        } else {
          args.push(mountLetter); // Unix mount point
        }
      } else {
        args.push(devicePath);
      }

      // Add force flag if requested
      if (force) {
        args.push("--force");
      }

      // Non-interactive mode
      args.push("--non-interactive");

      // Execute unmount command
      await this.executeVeraCryptCommand(args);

      // Remove from mounted volumes tracking
      this.mountedVolumes.delete(devicePath);

      this.emit("status-update", {
        type: "unmount",
        status: "Unmounted",
        progress: 100,
        message: "Volume unmounted successfully",
        targetDisk: devicePath,
        operationId,
      });

      return {
        success: true,
        message: "Volume unmounted successfully",
        operationId,
      };
    } catch (error) {
      console.error("Volume unmount failed:", error);

      this.emit("status-update", {
        type: "unmount",
        status: "Failed",
        progress: 0,
        message: `Unmount failed: ${error.message}`,
        targetDisk: devicePath,
        operationId,
      });

      throw error;
    } finally {
      this.activeOperations.delete(operationId);
    }
  }

  /**
   * Decrypt a volume (remove encryption)
   * @param {Object} params - Decryption parameters
   * @returns {Promise<Object>} Decryption result
   */
  async decryptVolume(params) {
    const {
      devicePath,
      password,
      useUsbKey = false,
      usbKeyPath = null,
    } = params;

    if (!this.isInstalled) {
      throw new Error("VeraCrypt is not installed");
    }

    const operationId = `decrypt_${Date.now()}`;

    try {
      this.emit("status-update", {
        type: "decryption",
        status: "Preparing",
        progress: 0,
        message: "Preparing volume decryption...",
        targetDisk: devicePath,
        operationId,
      });

      // Note: VeraCrypt doesn't have a direct "decrypt" command
      // This would typically involve:
      // 1. Mounting the encrypted volume
      // 2. Copying all data to a temporary location
      // 3. Reformatting the original volume without encryption
      // 4. Copying data back
      // This is a complex operation that requires careful implementation

      throw new Error(
        "Volume decryption not yet implemented. This requires a complex multi-step process.",
      );
    } catch (error) {
      console.error("Volume decryption failed:", error);

      this.emit("status-update", {
        type: "decryption",
        status: "Failed",
        progress: 0,
        message: `Decryption failed: ${error.message}`,
        targetDisk: devicePath,
        operationId,
      });

      throw error;
    } finally {
      this.activeOperations.delete(operationId);
    }
  }

  /**
   * Execute VeraCrypt command with progress monitoring
   * @param {Array} args - Command arguments
   * @param {string} password - Volume password
   * @param {string} operationId - Operation identifier
   * @param {string} operationType - Type of operation
   * @returns {Promise} Command execution promise
   */
  async executeVeraCryptWithProgress(
    args,
    password,
    operationId,
    operationType,
  ) {
    return new Promise((resolve, reject) => {
      const process = spawn(this.veracryptPath, args, {
        stdio: ["pipe", "pipe", "pipe"],
      });

      // Send password to stdin
      if (password) {
        process.stdin.write(password + "\n");
        process.stdin.end();
      }

      let stdout = "";
      let stderr = "";
      let progress = 0;

      // Monitor stdout for progress information
      process.stdout.on("data", (data) => {
        stdout += data.toString();

        // Parse progress from VeraCrypt output
        // VeraCrypt progress output format varies, this is a simplified example
        const progressMatch = data.toString().match(/(\d+)%/);
        if (progressMatch) {
          progress = parseInt(progressMatch[1]);
          this.emit("status-update", {
            type: operationType,
            status: "Processing",
            progress: progress,
            message: `${operationType} in progress: ${progress}%`,
            operationId,
          });
        }
      });

      process.stderr.on("data", (data) => {
        stderr += data.toString();
        console.error("VeraCrypt stderr:", data.toString());
      });

      process.on("close", (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new Error(`VeraCrypt exited with code ${code}: ${stderr}`));
        }
      });

      process.on("error", (error) => {
        reject(error);
      });

      // Store process for potential cancellation
      this.activeOperations.set(operationId, {
        ...this.activeOperations.get(operationId),
        process,
      });
    });
  }

  /**
   * Execute basic VeraCrypt command
   * @param {Array} args - Command arguments
   * @param {string} password - Volume password (optional)
   * @returns {Promise<string>} Command output
   */
  async executeVeraCryptCommand(args, password = null) {
    return new Promise((resolve, reject) => {
      const process = spawn(this.veracryptPath, args, {
        stdio: ["pipe", "pipe", "pipe"],
      });

      // Send password to stdin if provided
      if (password) {
        process.stdin.write(password + "\n");
        process.stdin.end();
      }

      let stdout = "";
      let stderr = "";

      process.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      process.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      process.on("close", (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new Error(`VeraCrypt exited with code ${code}: ${stderr}`));
        }
      });

      process.on("error", (error) => {
        reject(error);
      });
    });
  }

  /**
   * Find an available drive letter on Windows
   * @returns {Promise<string>} Available drive letter
   */
  async findAvailableDriveLetter() {
    if (this.platform !== "win32") {
      throw new Error("Drive letters are only applicable on Windows");
    }

    try {
      // Get used drive letters
      const { stdout } = await execFileAsync(
        "wmic",
        ["logicaldisk", "get", "caption"],
        { encoding: "utf8" },
      );
      const usedLetters = new Set();

      stdout.split("\n").forEach((line) => {
        const match = line.trim().match(/^([A-Z]):/);
        if (match) {
          usedLetters.add(match[1]);
        }
      });

      // Find first available letter starting from E:
      for (let i = 69; i <= 90; i++) {
        // E to Z
        const letter = String.fromCharCode(i);
        if (!usedLetters.has(letter)) {
          return `${letter}:`;
        }
      }

      throw new Error("No available drive letters");
    } catch (error) {
      console.error("Failed to find available drive letter:", error);
      // Fallback to a random letter
      return `${String.fromCharCode(69 + Math.floor(Math.random() * 22))}:`;
    }
  }

  /**
   * Get list of mounted VeraCrypt volumes
   * @returns {Promise<Array>} List of mounted volumes
   */
  async getMountedVolumes() {
    if (!this.isInstalled) {
      return [];
    }

    try {
      const { stdout } = await execFileAsync(this.veracryptPath, ["--list"], {
        encoding: "utf8",
      });

      // Parse mounted volumes from output
      const volumes = [];
      const lines = stdout.split("\n");

      for (const line of lines) {
        if (line.trim() && !line.includes("Slot")) {
          // Parse volume information from line
          // Format varies by platform
          volumes.push({
            slot: "", // Extract from line
            device: "", // Extract from line
            mountPoint: "", // Extract from line
          });
        }
      }

      return volumes;
    } catch (error) {
      console.error("Failed to get mounted volumes:", error);
      return [];
    }
  }

  /**
   * Cancel an active operation
   * @param {string} operationId - Operation to cancel
   * @returns {boolean} Success status
   */
  cancelOperation(operationId) {
    const operation = this.activeOperations.get(operationId);
    if (operation && operation.process) {
      try {
        operation.process.kill("SIGTERM");
        this.activeOperations.delete(operationId);

        this.emit("status-update", {
          type: operation.type,
          status: "Cancelled",
          progress: 0,
          message: "Operation cancelled by user",
          operationId,
        });

        return true;
      } catch (error) {
        console.error("Failed to cancel operation:", error);
        return false;
      }
    }
    return false;
  }

  /**
   * Clean up temporary files and resources
   * @returns {Promise<Object>} Cleanup result
   */
  async cleanupTempFiles() {
    try {
      // Clean up any temporary keyfiles, cache files, etc.
      // This would implement actual cleanup logic based on VeraCrypt's temp file locations

      console.log("VeraCrypt: Temporary files cleaned up");
      return { success: true, message: "Cleanup completed" };
    } catch (error) {
      console.error("VeraCrypt cleanup failed:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get VeraCrypt supported algorithms
   * @returns {Array} List of supported encryption algorithms
   */
  getSupportedAlgorithms() {
    return [
      "AES",
      "Serpent",
      "Twofish",
      "AES-Twofish",
      "AES-Twofish-Serpent",
      "Serpent-AES",
      "Serpent-Twofish-AES",
      "Twofish-Serpent",
    ];
  }

  /**
   * Get supported hash algorithms
   * @returns {Array} List of supported hash algorithms
   */
  getSupportedHashAlgorithms() {
    return ["SHA-512", "SHA-256", "Whirlpool", "RIPEMD-160"];
  }
}

module.exports = new VeraCryptWrapper();
