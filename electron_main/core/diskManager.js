// electron_main/core/diskManager.js - Comprehensive Disk Management Service

const { execFile, spawn } = require("child_process");
const { promisify } = require("util");
const os = require("os");
const path = require("path");
const fs = require("fs");

const execFileAsync = promisify(execFile);

class DiskManager {
  constructor() {
    this.platform = os.platform();
    this.cachedDisks = [];
    this.lastScanTime = 0;
    this.scanCacheTimeout = 30000; // 30 seconds cache
  }

  /**
   * Get all available disks with comprehensive information
   * @returns {Promise<Array>} Array of disk objects
   */
  async getAvailableDisks() {
    const now = Date.now();

    // Return cached data if recent
    if (
      this.cachedDisks.length > 0 &&
      now - this.lastScanTime < this.scanCacheTimeout
    ) {
      console.log("DiskManager: Returning cached disk data");
      return this.cachedDisks;
    }

    try {
      let disks = [];

      if (this.platform === "win32") {
        disks = await this.getWindowsDisks();
      } else if (this.platform === "linux") {
        disks = await this.getLinuxDisks();
      } else if (this.platform === "darwin") {
        disks = await this.getMacOSDisks();
      } else {
        throw new Error(`Unsupported platform: ${this.platform}`);
      }

      // Cache the results
      this.cachedDisks = disks;
      this.lastScanTime = now;

      console.log(`DiskManager: Found ${disks.length} disks`);
      return disks;
    } catch (error) {
      console.error("DiskManager: Failed to get available disks:", error);
      return [];
    }
  }

  /**
   * Get detailed information about a specific disk
   * @param {string} diskCaption - The disk caption (e.g., "C:")
   * @returns {Promise<Object>} Detailed disk information
   */
  async getDiskDetails(diskCaption) {
    try {
      const disks = await this.getAvailableDisks();
      const disk = disks.find((d) => d.caption === diskCaption);

      if (!disk) {
        throw new Error(`Disk ${diskCaption} not found`);
      }

      // Get additional details based on platform
      if (this.platform === "win32") {
        return await this.getWindowsDiskDetails(disk);
      } else {
        return disk; // Return basic info for non-Windows platforms
      }
    } catch (error) {
      console.error(
        `DiskManager: Failed to get disk details for ${diskCaption}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Windows-specific disk enumeration using WMIC
   * @returns {Promise<Array>} Array of Windows disk objects
   */
  async getWindowsDisks() {
    try {
      // Get logical disks
      const logicalDisksCommand =
        "wmic logicaldisk get Caption,Size,FreeSpace,FileSystem,DriveType,VolumeName /format:csv";
      const { stdout: logicalStdout } = await execFileAsync(
        "cmd",
        ["/c", logicalDisksCommand],
        { encoding: "utf8" },
      );

      // Get physical disks for additional info
      const physicalDisksCommand =
        "wmic diskdrive get Caption,Size,MediaType,DeviceID /format:csv";
      const { stdout: physicalStdout } = await execFileAsync(
        "cmd",
        ["/c", physicalDisksCommand],
        { encoding: "utf8" },
      );

      const logicalDisks = this.parseWMICOutput(logicalStdout);
      const physicalDisks = this.parseWMICOutput(physicalStdout);

      const disks = [];

      for (const logical of logicalDisks) {
        if (!logical.Caption || logical.Caption.trim() === "") continue;

        const disk = {
          caption: logical.Caption.trim(),
          size: parseInt(logical.Size) || 0,
          freeSpace: parseInt(logical.FreeSpace) || 0,
          fileSystem: logical.FileSystem || "Unknown",
          driveType: parseInt(logical.DriveType) || 0,
          volumeName: logical.VolumeName || "",
          description: this.getDriveTypeDescription(
            parseInt(logical.DriveType) || 0,
          ),
          encryptionStatus: "unknown", // Will be determined by VeraCrypt integration
          mounted: false, // Will be updated by mount status check
          deviceID: `\\\\.\\${logical.Caption.replace(":", "")}`,
          mediaType: "Fixed", // Default, will be updated from physical disk info
        };

        // Try to match with physical disk for additional info
        const physicalMatch = physicalDisks.find(
          (p) => p.Caption && p.Caption.includes("DRIVE"),
        );

        if (physicalMatch) {
          disk.mediaType = physicalMatch.MediaType || "Fixed";
          if (
            physicalMatch.MediaType &&
            physicalMatch.MediaType.includes("SSD")
          ) {
            disk.description += " (SSD)";
          }
        }

        disks.push(disk);
      }

      return disks;
    } catch (error) {
      console.error("DiskManager: Failed to get Windows disks:", error);
      throw error;
    }
  }

  /**
   * Linux-specific disk enumeration using various system tools
   * @returns {Promise<Array>} Array of Linux disk objects
   */
  async getLinuxDisks() {
    try {
      // Use lsblk to get block device information
      const { stdout } = await execFileAsync(
        "lsblk",
        ["-J", "-b", "-o", "NAME,SIZE,FSTYPE,MOUNTPOINT,TYPE,VENDOR,MODEL"],
        { encoding: "utf8" },
      );
      const lsblkData = JSON.parse(stdout);

      const disks = [];

      for (const device of lsblkData.blockdevices) {
        if (device.type === "disk") {
          // Process partitions of this disk
          if (device.children) {
            for (const partition of device.children) {
              if (partition.mountpoint) {
                const disk = {
                  caption: partition.mountpoint,
                  size: parseInt(partition.size) || 0,
                  freeSpace: await this.getLinuxFreeSpace(partition.mountpoint),
                  fileSystem: partition.fstype || "Unknown",
                  driveType: 3, // Fixed disk
                  volumeName: partition.name || "",
                  description:
                    `${device.vendor || ""} ${device.model || ""}`.trim() ||
                    "Local Disk",
                  encryptionStatus: "unknown",
                  mounted: !!partition.mountpoint,
                  deviceID: `/dev/${partition.name}`,
                  mediaType: "Fixed",
                };

                disks.push(disk);
              }
            }
          }
        }
      }

      return disks;
    } catch (error) {
      console.error("DiskManager: Failed to get Linux disks:", error);
      throw error;
    }
  }

  /**
   * macOS-specific disk enumeration using diskutil
   * @returns {Promise<Array>} Array of macOS disk objects
   */
  async getMacOSDisks() {
    try {
      const { stdout } = await execFileAsync("diskutil", ["list", "-plist"], {
        encoding: "utf8",
      });
      // Parse plist output (would need plist parser in real implementation)

      // For now, return mock data structure
      return [
        {
          caption: "/",
          size: 500 * 1024 * 1024 * 1024,
          freeSpace: 200 * 1024 * 1024 * 1024,
          fileSystem: "APFS",
          driveType: 3,
          volumeName: "Macintosh HD",
          description: "Internal SSD",
          encryptionStatus: "unknown",
          mounted: true,
          deviceID: "/dev/disk1s1",
          mediaType: "SSD",
        },
      ];
    } catch (error) {
      console.error("DiskManager: Failed to get macOS disks:", error);
      throw error;
    }
  }

  /**
   * Get additional Windows disk details
   * @param {Object} disk - Basic disk information
   * @returns {Promise<Object>} Enhanced disk information
   */
  async getWindowsDiskDetails(disk) {
    try {
      // Get more detailed information using WMIC
      const detailCommand = `wmic logicaldisk where "Caption='${disk.caption}'" get *`;
      const { stdout } = await execFileAsync("cmd", ["/c", detailCommand], {
        encoding: "utf8",
      });

      // Parse the detailed output and enhance the disk object
      // This would include additional properties like:
      // - Compressed
      // - Description
      // - FileSystem
      // - MaxComponentLength
      // - SupportsFileBasedCompression
      // etc.

      return {
        ...disk,
        lastScanTime: new Date().toISOString(),
        // Additional Windows-specific properties would go here
      };
    } catch (error) {
      console.error("DiskManager: Failed to get Windows disk details:", error);
      return disk; // Return basic info if detailed scan fails
    }
  }

  /**
   * Get free space for Linux mount point
   * @param {string} mountpoint - The mount point path
   * @returns {Promise<number>} Free space in bytes
   */
  async getLinuxFreeSpace(mountpoint) {
    try {
      const { stdout } = await execFileAsync("df", ["-B1", mountpoint], {
        encoding: "utf8",
      });
      const lines = stdout.trim().split("\n");
      if (lines.length > 1) {
        const fields = lines[1].split(/\s+/);
        return parseInt(fields[3]) || 0; // Available space
      }
      return 0;
    } catch (error) {
      console.error(
        `DiskManager: Failed to get free space for ${mountpoint}:`,
        error,
      );
      return 0;
    }
  }

  /**
   * Parse WMIC CSV output into objects
   * @param {string} wmicOutput - Raw WMIC output
   * @returns {Array} Array of parsed objects
   */
  parseWMICOutput(wmicOutput) {
    const lines = wmicOutput
      .trim()
      .split("\n")
      .filter((line) => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim());
    const results = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const obj = {};

      headers.forEach((header, index) => {
        if (header && header !== "Node") {
          // Skip the Node column added by WMIC
          obj[header] = values[index] || "";
        }
      });

      results.push(obj);
    }

    return results;
  }

  /**
   * Get human-readable description for Windows drive type
   * @param {number} driveType - Windows drive type number
   * @returns {string} Human-readable description
   */
  getDriveTypeDescription(driveType) {
    const types = {
      0: "Unknown",
      1: "No Root Directory",
      2: "Removable Disk",
      3: "Local Fixed Disk",
      4: "Network Drive",
      5: "Compact Disc",
      6: "RAM Disk",
    };
    return types[driveType] || "Unknown";
  }

  /**
   * Check if a disk is encrypted using various detection methods
   * @param {Object} disk - Disk information
   * @returns {Promise<string>} Encryption status
   */
  async checkEncryptionStatus(disk) {
    try {
      if (this.platform === "win32") {
        return await this.checkWindowsEncryption(disk);
      } else {
        return await this.checkLinuxEncryption(disk);
      }
    } catch (error) {
      console.error(
        `DiskManager: Failed to check encryption status for ${disk.caption}:`,
        error,
      );
      return "unknown";
    }
  }

  /**
   * Check Windows disk encryption status (BitLocker, VeraCrypt, etc.)
   * @param {Object} disk - Disk information
   * @returns {Promise<string>} Encryption status
   */
  async checkWindowsEncryption(disk) {
    try {
      // Check BitLocker status
      const bitlockerCommand = `manage-bde -status ${disk.caption}`;
      const { stdout } = await execFileAsync("cmd", ["/c", bitlockerCommand], {
        encoding: "utf8",
      });

      if (stdout.includes("Protection On")) {
        return "encrypted";
      } else if (stdout.includes("Protection Off")) {
        return "unencrypted";
      }

      // Could also check for VeraCrypt volumes here
      // This would require VeraCrypt CLI integration

      return "unknown";
    } catch (error) {
      // BitLocker command might fail if not available or insufficient permissions
      return "unknown";
    }
  }

  /**
   * Check Linux disk encryption status (LUKS, etc.)
   * @param {Object} disk - Disk information
   * @returns {Promise<string>} Encryption status
   */
  async checkLinuxEncryption(disk) {
    try {
      // Check if device is a LUKS encrypted volume
      const { stdout } = await execFileAsync(
        "cryptsetup",
        ["isLuks", disk.deviceID],
        { encoding: "utf8" },
      );
      return "encrypted";
    } catch (error) {
      // Not a LUKS volume or cryptsetup not available
      return "unencrypted";
    }
  }

  /**
   * Clear the disk cache to force fresh scan
   */
  clearCache() {
    this.cachedDisks = [];
    this.lastScanTime = 0;
    console.log("DiskManager: Cache cleared");
  }

  /**
   * Get disk performance metrics
   * @param {string} diskCaption - The disk caption
   * @returns {Promise<Object>} Performance metrics
   */
  async getDiskPerformance(diskCaption) {
    try {
      // This would implement disk performance monitoring
      // Could use tools like:
      // - Windows: typeperf, wmic
      // - Linux: iostat, iotop
      // - macOS: iostat

      return {
        readSpeed: 0,
        writeSpeed: 0,
        utilization: 0,
        queueDepth: 0,
        temperature: null,
      };
    } catch (error) {
      console.error(
        `DiskManager: Failed to get performance metrics for ${diskCaption}:`,
        error,
      );
      return null;
    }
  }
}

module.exports = new DiskManager();
