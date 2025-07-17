/**
 * KnouxCrypt™ - Advanced Encryption Interface
 * واجهة التشفير الموحدة لجميع الخوارزميات
 */

import { createBuffer, BufferPolyfill } from "../../utils/buffer-polyfill";

// Browser-compatible Buffer type
type BufferLike = BufferPolyfill | Uint8Array;

export interface ICipher {
  /**
   * 🔐 تشفير البيانات
   * @param data ال��يانات المراد تشفيرها (نص أو Buffer)
   * @returns البيانات المشفرة
   */
  encrypt(data: string | BufferLike): BufferLike;

  /**
   * 🔓 فك تش��ير البيانات
   * @param encryptedData البيانات المشفرة
   * @returns البيانات الأصلية
   */
  decrypt(encryptedData: BufferLike): string | BufferLike;

  /**
   * 📏 حجم البلوك بالبايت
   */
  readonly blockSize: number;

  /**
   * 🔑 حجم المفتاح بالبايت
   */
  readonly keySize: number;

  /**
   * 📝 اسم الخوارزمية
   */
  readonly algorithmName: string;

  /**
   * 🔄 ��دد الجولات
   */
  readonly rounds: number;

  /**
   * 📊 معلومات الخوارزمية
   */
  getInfo(): CipherInfo;
}

/**
 * معلومات مفصلة عن الخوارزمية
 */
export interface CipherInfo {
  name: string;
  description: string;
  keySize: number;
  blockSize: number;
  rounds: number;
  securityLevel: "عالي" | "عالي جداً" | "أقصى";
  performance: "سريع" | "متوسط" | "بطيء";
  developedBy: string;
  year: number;
  standardized: boolean;
  features: string[];
  advantages: string[];
  disadvantages: string[];
  useCases: string[];
  cryptanalysisResistance: {
    bruteForce: string;
    differential: string;
    linear: string;
    algebraic: string;
  };
}

/**
 * نوع الخوارزمية المدعومة
 */
export type CipherType =
  | "AES-256"
  | "Serpent"
  | "Twofish"
  | "AES-Serpent-Twofish"
  | "Triple-DES"
  | "ChaCha20";

/**
 * إعدادات التشفير
 */
export interface EncryptionOptions {
  mode?: "CBC" | "ECB" | "CFB" | "OFB" | "CTR" | "GCM";
  padding?: "PKCS7" | "ANSIX923" | "ISO10126" | "NoPadding";
  iv?: BufferLike;
  associatedData?: BufferLike; // للـ GCM mode
  tagLength?: number; // للـ GCM mode
}

/**
 * نتيجة التشفير مع معلومات إضافية
 */
export interface EncryptionResult {
  ciphertext: BufferLike;
  iv?: BufferLike;
  tag?: BufferLike; // للـ GCM mode
  algorithm: string;
  mode: string;
  timestamp: Date;
  keyFingerprint: string; // هاش المفتاح للتحقق
}

/**
 * إحصائيات الأداء
 */
export interface PerformanceStats {
  algorithm: string;
  dataSize: number;
  encryptionTime: number; // milliseconds
  decryptionTime: number; // milliseconds
  throughput: number; // MB/s
  cpuUsage: number; // percentage
  memoryUsage: number; // bytes
}

/**
 * معايير الأمان
 */
export interface SecurityMetrics {
  algorithm: string;
  keyStrength: number; // bits
  theoreticalSecurity: number; // bits
  practicalSecurity: number; // bits
  quantumResistance: boolean;
  sidechannelResistance: "ضعيف" | "متوسط" | "قوي";
  certifications: string[]; // FIPS, Common Criteria, etc.
}

/**
 * فئة خطأ التشفير
 */
export class CipherError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly algorithm?: string,
  ) {
    super(message);
    this.name = "CipherError";
  }
}

/**
 * أكواد الأخطاء الشائعة
 */
export const CipherErrorCodes = {
  INVALID_KEY_SIZE: "INVALID_KEY_SIZE",
  INVALID_BLOCK_SIZE: "INVALID_BLOCK_SIZE",
  INVALID_DATA_SIZE: "INVALID_DATA_SIZE",
  INVALID_IV_SIZE: "INVALID_IV_SIZE",
  ENCRYPTION_FAILED: "ENCRYPTION_FAILED",
  DECRYPTION_FAILED: "DECRYPTION_FAILED",
  UNSUPPORTED_ALGORITHM: "UNSUPPORTED_ALGORITHM",
  UNSUPPORTED_MODE: "UNSUPPORTED_MODE",
  WEAK_KEY_DETECTED: "WEAK_KEY_DETECTED",
  INVALID_PADDING: "INVALID_PADDING",
} as const;

/**
 * أداة مساعدة للتحقق من صحة المفاتيح
 */
export class KeyValidator {
  /**
   * التحقق من قوة المفتاح
   */
  static validateKeyStrength(key: BufferLike): {
    isValid: boolean;
    strength: "ضعيف" | "متوسط" | "قوي" | "ممتاز";
    issues: string[];
  } {
    const issues: string[] = [];
    let strength: "ضعيف" | "متوسط" | "قوي" | "ممتاز" = "ضعيف";

    // فحص الحجم
    if (key.length < 16) {
      issues.push("المفتاح أقل من 128 بت");
    } else if (key.length < 24) {
      strength = "متوسط";
    } else if (key.length < 32) {
      strength = "قوي";
    } else {
      strength = "ممتاز";
    }

    // فحص العشوائية
    const entropy = this.calculateEntropy(key);
    if (entropy < 6) {
      issues.push("المفتاح يفتقر للعشوائية");
      strength = "ضعيف";
    }

    // فحص ��لتكرار
    if (this.hasRepeatingPatterns(key)) {
      issues.push("المفتاح يحتوي على أنماط متكررة");
      if (strength !== "ضعيف") strength = "متوسط";
    }

    return {
      isValid: issues.length === 0,
      strength,
      issues,
    };
  }

  /**
   * حساب الإنتروبيا (العشوائية)
   */
  private static calculateEntropy(data: BufferLike): number {
    const freq = new Map<number, number>();
    const uint8Data =
      data instanceof BufferPolyfill ? data.toUint8Array() : data;

    for (const byte of uint8Data) {
      freq.set(byte, (freq.get(byte) || 0) + 1);
    }

    let entropy = 0;
    for (const count of freq.values()) {
      const probability = count / uint8Data.length;
      entropy -= probability * Math.log2(probability);
    }

    return entropy;
  }

  /**
   * فحص الأنماط المتكررة
   */
  private static hasRepeatingPatterns(data: BufferLike): boolean {
    const uint8Data =
      data instanceof BufferPolyfill ? data.toUint8Array() : data;

    for (
      let patternSize = 2;
      patternSize <= Math.min(8, uint8Data.length / 4);
      patternSize++
    ) {
      for (let i = 0; i <= uint8Data.length - patternSize * 2; i++) {
        const pattern = uint8Data.slice(i, i + patternSize);
        const nextPattern = uint8Data.slice(
          i + patternSize,
          i + patternSize * 2,
        );

        // Compare arrays manually
        let areEqual = true;
        if (pattern.length === nextPattern.length) {
          for (let j = 0; j < pattern.length; j++) {
            if (pattern[j] !== nextPattern[j]) {
              areEqual = false;
              break;
            }
          }
          if (areEqual) {
            return true;
          }
        }
      }
    }
    return false;
  }
}

/**
 * مولد مف��تيح آمن
 */
export class SecureKeyGenerator {
  /**
   * إنشاء مفتاح عشوائي آمن
   */
  static generateSecureKey(size: number = 32): BufferLike {
    if (typeof window !== "undefined" && window.crypto) {
      // في المتصفح
      const key = new Uint8Array(size);
      window.crypto.getRandomValues(key);
      return createBuffer(key);
    } else if (typeof require !== "undefined") {
      // في Node.js
      const crypto = require("crypto");
      return createBuffer(crypto.randomBytes(size));
    } else {
      // fallback بسيط
      const key = new Uint8Array(size);
      for (let i = 0; i < size; i++) {
        key[i] = Math.floor(Math.random() * 256);
      }
      return createBuffer(key);
    }
  }

  /**
   * اشتقاق مفتاح من كلمة مرور
   */
  static deriveKeyFromPassword(
    password: string,
    salt: Buffer,
    iterations: number = 10000,
    keyLength: number = 32,
  ): Buffer {
    // تنفيذ PBKDF2 مبسط
    // في التطبيق الحقيقي، استخدم مكتبة مخصصة
    if (typeof require !== "undefined") {
      const crypto = require("crypto");
      return crypto.pbkdf2Sync(password, salt, iterations, keyLength, "sha256");
    }

    // Fallback بسيط للمتصفح
    let key = Buffer.from(password + salt.toString("hex"), "utf8");
    for (let i = 0; i < iterations; i++) {
      key = this.simpleHash(key);
    }
    return key.slice(0, keyLength);
  }

  private static simpleHash(data: Buffer): Buffer {
    // تنفيذ هاش بسيط - في التطبيق الحقيقي استخدم SHA-256
    let hash = 0;
    const result = new Uint8Array(32);

    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash + data[i]) & 0xffffffff;
    }

    for (let i = 0; i < 32; i++) {
      result[i] = (hash >>> i % 32) & 0xff;
    }

    return Buffer.from(result);
  }
}
