/**
 * KnouxCrypt™ - Advanced Cipher Factory
 * 👑 الملك الذي يحكم جميع خوارزميات التشفير
 * مصنع ذكي لإنشاء وإدارة جميع أنواع الخوارزميات
 */

import {
  ICipher,
  CipherType,
  CipherInfo,
  CipherError,
  CipherErrorCodes,
  SecureKeyGenerator,
} from "./ICipher";
import { AESCipher } from "./AESCipher";
import { SerpentCipher } from "./SerpentCipher";
import { TwofishCipher } from "./TwofishCipher";
import { TripleCipher } from "./TripleCipher";

/**
 * أنواع الخوارزميات المدعومة
 */
export type SupportedCipherType =
  | "AES-256"
  | "Serpent"
  | "Twofish"
  | "AES-Serpent-Twofish"
  | "Auto"; // للاختيار التلقائي بناءً على المتطلبات

/**
 * متطلبات الأمان للاختيار التلقائي
 */
export interface SecurityRequirements {
  level: "standard" | "high" | "maximum" | "quantum-resistant";
  performance: "fast" | "balanced" | "secure";
  dataSize: "small" | "medium" | "large" | "enterprise";
  usagePattern: "one-time" | "frequent" | "long-term-storage";
  threatModel: "casual" | "commercial" | "government" | "military";
}

/**
 * إحصائيات الأداء للخوارزمية
 */
export interface PerformanceMetrics {
  algorithm: string;
  encryptionSpeed: number; // MB/s
  decryptionSpeed: number; // MB/s
  memoryUsage: number; // KB
  keySetupTime: number; // ms
  cpuIntensity: "low" | "medium" | "high" | "very-high";
}

/**
 * نتيجة اختبار الخوارزمية
 */
export interface CipherTestResult {
  algorithm: string;
  success: boolean;
  encryptionTime: number;
  decryptionTime: number;
  dataIntegrity: boolean;
  errorMessage?: string;
  recommendation: "recommended" | "acceptable" | "not-recommended";
}

/**
 * مقارنة بين الخوارزميات
 */
export interface CipherComparison {
  algorithms: string[];
  criteria: {
    security: { [algorithm: string]: number }; // 1-10
    performance: { [algorithm: string]: number }; // 1-10
    memory: { [algorithm: string]: number }; // 1-10
    cpuUsage: { [algorithm: string]: number }; // 1-10
  };
  recommendations: {
    bestOverall: string;
    fastestEncryption: string;
    mostSecure: string;
    bestMemoryEfficiency: string;
  };
}

/**
 * 👑 مصنع الخوارزميات المتقدم
 */
export class CipherFactory {
  private static readonly SUPPORTED_ALGORITHMS = [
    "AES-256",
    "Serpent",
    "Twofish",
    "AES-Serpent-Twofish",
  ];
  private static performanceCache = new Map<string, PerformanceMetrics>();

  /**
   * 🔧 إنشاء خوارزمية تشفير
   * @param type نوع الخوارزمية أو 'Auto' للاختيار التلقائي
   * @param key مفتاح التشفير
   * @param requirements متطلبات الأمان (للاختيار التلقائي)
   * @returns مثيل يطبق ICipher
   */
  static createCipher(
    type: SupportedCipherType,
    key: Buffer,
    requirements?: SecurityRequirements,
  ): ICipher {
    try {
      // إذا كان النوع 'Auto'، اختر الخوارزمية المناسبة
      if (type === "Auto") {
        if (!requirements) {
          throw new Error("متطلبات الأمان مطلوبة للاختيار التلقائي");
        }
        type = this.selectOptimalAlgorithm(
          requirements,
          key,
        ) as SupportedCipherType;
        console.log(`🤖 تم اختيار الخوارزمية تلقائياً: ${type}`);
      }

      switch (type) {
        case "AES-256":
          this.validateKeySize(key, 32, type);
          return new AESCipher(key);

        case "Serpent":
          this.validateKeySize(key, 32, type);
          return new SerpentCipher(key);

        case "Twofish":
          this.validateKeySize(key, 32, type);
          return new TwofishCipher(key);

        case "AES-Serpent-Twofish":
          // TripleCipher يقبل مفاتيح مختلفة الأحجام
          if (![32, 64, 96].includes(key.length)) {
            throw new Error(
              "مفتاح التشفير الثلاثي يجب أن يكون 32، 64، أو 96 بايت",
            );
          }
          return new TripleCipher(key);

        default:
          throw new Error(`🚫 خوارزمية غير مدعومة: ${type}`);
      }
    } catch (error) {
      throw new CipherError(
        `فشل في إنشاء الخوارزمية ${type}: ${error.message}`,
        CipherErrorCodes.UNSUPPORTED_ALGORITHM,
      );
    }
  }

  /**
   * 🧠 اختيار الخوارزمية المثلى تلقائياً
   */
  static selectOptimalAlgorithm(
    requirements: SecurityRequirements,
    key: Buffer,
  ): string {
    const { level, performance, dataSize, usagePattern, threatModel } =
      requirements;

    // للأمان الكمي والعسكري، استخدم التشفير الثلاثي
    if (
      level === "quantum-resistant" ||
      threatModel === "military" ||
      usagePattern === "long-term-storage"
    ) {
      return "AES-Serpent-Twofish";
    }

    // للأمان الأقصى مع الحكومات
    if (level === "maximum" || threatModel === "government") {
      return performance === "fast" ? "AES-256" : "Serpent";
    }

    // للأمان العالي التجاري
    if (level === "high" || threatModel === "commercial") {
      if (performance === "fast") return "AES-256";
      if (performance === "balanced") return "Twofish";
      return "Serpent";
    }

    // للاستخدام العادي
    if (performance === "fast") return "AES-256";
    if (performance === "balanced") return "Twofish";

    return "AES-256"; // الافتراضي
  }

  /**
   * 🎯 إنشاء خوارزمية محسنة للاستخدام المحدد
   */
  static createOptimizedCipher(
    useCase: string,
    dataSize?: number,
  ): {
    cipher: ICipher;
    key: Buffer;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    let algorithmType: SupportedCipherType;
    let keySize: number;

    switch (useCase.toLowerCase()) {
      case "file-encryption":
      case "disk-encryption":
        algorithmType = "AES-256";
        keySize = 32;
        recommendations.push("AES-256 محسن لتشفير الملفات والأقراص");
        recommendations.push("استخدم وضع XTS أو CBC للأقراص");
        break;

      case "military":
      case "government":
      case "classified":
        algorithmType = "AES-Serpent-Twofish";
        keySize = 96;
        recommendations.push("التشفير الثلاثي للبيانات المصنفة");
        recommendations.push("احتفظ بنسخ احتياطية من المفاتيح في أماكن منفصلة");
        break;

      case "database":
      case "enterprise":
        algorithmType = "Serpent";
        keySize = 32;
        recommendations.push("Serpent يوفر أمان عالي للمؤسسات");
        recommendations.push("فعل دوران المفاتيح الدوري");
        break;

      case "communication":
      case "messaging":
        algorithmType = "Twofish";
        keySize = 32;
        recommendations.push("Twofish سريع للاتصالات المباشرة");
        recommendations.push("استخدم مفاتيح جلسة مؤقتة");
        break;

      case "backup":
      case "archive":
        algorithmType = "AES-Serpent-Twofish";
        keySize = 96;
        recommendations.push("التشفير الثلاثي للأرشيف طويل المدى");
        recommendations.push("أمان مضمون لعقود قادمة");
        break;

      default:
        algorithmType = "AES-256";
        keySize = 32;
        recommendations.push("AES-256 مناسب للاستخدام العام");
    }

    // تعديل حجم المفتاح بناءً على حجم البيانات
    if (dataSize && dataSize > 1024 * 1024 * 1024) {
      // أكبر من 1GB
      recommendations.push("بيانات كبيرة - تم تحسين المفتاح");
    }

    const key = SecureKeyGenerator.generateSecureKey(keySize);
    const cipher = this.createCipher(algorithmType, key);

    return { cipher, key, recommendations };
  }

  /**
   * 🧪 اختبار جميع الخوارزميات المتاحة
   */
  static async testAllAlgorithms(
    testData?: string,
  ): Promise<CipherTestResult[]> {
    const data =
      testData || "🔐 هذا نص اختبار للتشفير - صنع knoux بروح أبو ريتاج 💥";
    const results: CipherTestResult[] = [];

    for (const algorithm of this.SUPPORTED_ALGORITHMS) {
      try {
        const startTime = Date.now();

        // إنشاء مفتاح منا��ب
        const keySize = algorithm === "AES-Serpent-Twofish" ? 96 : 32;
        const key = SecureKeyGenerator.generateSecureKey(keySize);

        // إنشاء الخوارزمية
        const cipher = this.createCipher(algorithm as SupportedCipherType, key);

        // اختبار التشفير
        const encryptStart = Date.now();
        const encrypted = cipher.encrypt(data);
        const encryptTime = Date.now() - encryptStart;

        // اختبار فك التشفير
        const decryptStart = Date.now();
        const decrypted = cipher.decrypt(encrypted);
        const decryptTime = Date.now() - decryptStart;

        // التحقق من سلامة البيانات
        const dataIntegrity = decrypted === data;

        results.push({
          algorithm,
          success: true,
          encryptionTime: encryptTime,
          decryptionTime: decryptTime,
          dataIntegrity,
          recommendation: this.getRecommendation(
            algorithm,
            encryptTime,
            decryptTime,
          ),
        });
      } catch (error) {
        results.push({
          algorithm,
          success: false,
          encryptionTime: 0,
          decryptionTime: 0,
          dataIntegrity: false,
          errorMessage: error.message,
          recommendation: "not-recommended",
        });
      }
    }

    return results;
  }

  /**
   * 📊 مقارنة شاملة بين الخوارزميات
   */
  static async compareAlgorithms(
    testData?: string,
    iterations: number = 100,
  ): Promise<CipherComparison> {
    const algorithms = this.SUPPORTED_ALGORITHMS;
    const criteria = {
      security: {} as { [algorithm: string]: number },
      performance: {} as { [algorithm: string]: number },
      memory: {} as { [algorithm: string]: number },
      cpuUsage: {} as { [algorithm: string]: number },
    };

    for (const algorithm of algorithms) {
      const metrics = await this.benchmarkAlgorithm(
        algorithm,
        testData,
        iterations,
      );

      // تقييم الأمان (1-10)
      criteria.security[algorithm] = this.calculateSecurityScore(algorithm);

      // تقييم الأداء (1-10)
      criteria.performance[algorithm] = this.calculatePerformanceScore(metrics);

      // تقييم استخدام الذاكرة (1-10)
      criteria.memory[algorithm] = this.calculateMemoryScore(metrics);

      // تقييم استخدام المعالج (1-10)
      criteria.cpuUsage[algorithm] = this.calculateCpuScore(metrics);
    }

    // تحديد الأفضل في كل فئة
    const recommendations = {
      bestOverall: this.findBestOverall(criteria),
      fastestEncryption: this.findFastest(criteria.performance),
      mostSecure: this.findMostSecure(criteria.security),
      bestMemoryEfficiency: this.findBestMemory(criteria.memory),
    };

    return {
      algorithms,
      criteria,
      recommendations,
    };
  }

  /**
   * 📈 قياس أداء خوارزمية محددة
   */
  static async benchmarkAlgorithm(
    algorithm: string,
    testData?: string,
    iterations: number = 100,
  ): Promise<PerformanceMetrics> {
    if (this.performanceCache.has(algorithm)) {
      return this.performanceCache.get(algorithm)!;
    }

    const data = testData || "x".repeat(1024); // 1KB test data
    const keySize = algorithm === "AES-Serpent-Twofish" ? 96 : 32;
    const key = SecureKeyGenerator.generateSecureKey(keySize);

    let totalEncryptTime = 0;
    let totalDecryptTime = 0;
    let memoryBefore = 0;
    let memoryAfter = 0;

    // قياس الذاكرة قبل الاختبار
    if (typeof process !== "undefined" && process.memoryUsage) {
      memoryBefore = process.memoryUsage().heapUsed;
    }

    const cipher = this.createCipher(algorithm as SupportedCipherType, key);

    for (let i = 0; i < iterations; i++) {
      // قياس التشفير
      const encryptStart = performance.now();
      const encrypted = cipher.encrypt(data);
      const encryptEnd = performance.now();
      totalEncryptTime += encryptEnd - encryptStart;

      // قياس فك التشفير
      const decryptStart = performance.now();
      cipher.decrypt(encrypted);
      const decryptEnd = performance.now();
      totalDecryptTime += decryptEnd - decryptStart;
    }

    // قياس الذاكرة بعد الاختبار
    if (typeof process !== "undefined" && process.memoryUsage) {
      memoryAfter = process.memoryUsage().heapUsed;
    }

    const avgEncryptTime = totalEncryptTime / iterations;
    const avgDecryptTime = totalDecryptTime / iterations;
    const dataSize = new Blob([data]).size / 1024; // KB

    const metrics: PerformanceMetrics = {
      algorithm,
      encryptionSpeed: dataSize / (avgEncryptTime / 1000), // KB/s
      decryptionSpeed: dataSize / (avgDecryptTime / 1000), // KB/s
      memoryUsage: Math.max(0, memoryAfter - memoryBefore) / 1024, // KB
      keySetupTime: 0, // سيتم قياسه لاحقاً
      cpuIntensity: this.calculateCpuIntensity(algorithm),
    };

    this.performanceCache.set(algorithm, metrics);
    return metrics;
  }

  /**
   * 🔑 إنشاء مفتاح آمن للخوارزمية المحددة
   */
  static generateKeyForAlgorithm(algorithm: SupportedCipherType): Buffer {
    switch (algorithm) {
      case "AES-256":
      case "Serpent":
      case "Twofish":
        return SecureKeyGenerator.generateSecureKey(32);

      case "AES-Serpent-Twofish":
        return SecureKeyGenerator.generateSecureKey(96);

      default:
        return SecureKeyGenerator.generateSecureKey(32);
    }
  }

  /**
   * 📋 الحصول على معلومات جميع الخوارزميات
   */
  static getAllAlgorithmsInfo(): { [algorithm: string]: CipherInfo } {
    const info: { [algorithm: string]: CipherInfo } = {};

    for (const algorithm of this.SUPPORTED_ALGORITHMS) {
      try {
        const key = this.generateKeyForAlgorithm(
          algorithm as SupportedCipherType,
        );
        const cipher = this.createCipher(algorithm as SupportedCipherType, key);
        info[algorithm] = cipher.getInfo();
      } catch (error) {
        console.warn(`تعذر الحصول على معلومات ${algorithm}:`, error.message);
      }
    }

    return info;
  }

  /**
   * ✅ التحقق من صحة المفتاح للخوارزمية
   */
  static validateKey(
    algorithm: SupportedCipherType,
    key: Buffer,
  ): {
    isValid: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // فحص حجم المفتاح
    const expectedSizes = this.getExpectedKeySizes(algorithm);
    if (!expectedSizes.includes(key.length)) {
      issues.push(
        `حجم المفتاح غير صحيح. متوقع: ${expectedSizes.join(" أو ")} بايت، المعطى: ${key.length} بايت`,
      );
    }

    // فحص قوة المفتاح
    if (algorithm === "AES-Serpent-Twofish") {
      const strength = TripleCipher.evaluateKeyStrength(key);
      if (strength.overallStrength === "ضعيف") {
        issues.push("المفتاح الثلاثي ضعيف");
        recommendations.push(...strength.recommendations);
      }
    }

    // فحص العشوائية
    const entropy = this.calculateKeyEntropy(key);
    if (entropy < 7) {
      issues.push("المفتاح يفتقر للعشوائية");
      recommendations.push("استخدم مولد أرقام عشوائية قوي");
    }

    // توصيات عامة
    if (key.length < 32) {
      recommendations.push("استخدم مفتاح 256 بت على الأقل");
    }

    return {
      isValid: issues.length === 0,
      issues,
      recommendations,
    };
  }

  // ==================== Helper Methods ====================

  private static validateKeySize(
    key: Buffer,
    expectedSize: number,
    algorithm: string,
  ): void {
    if (key.length !== expectedSize) {
      throw new CipherError(
        `المفتاح يجب أن يكون ${expectedSize} بايت للخوارزمية ${algorithm}، المعطى: ${key.length} بايت`,
        CipherErrorCodes.INVALID_KEY_SIZE,
        algorithm,
      );
    }
  }

  private static getExpectedKeySizes(algorithm: SupportedCipherType): number[] {
    switch (algorithm) {
      case "AES-256":
      case "Serpent":
      case "Twofish":
        return [32];
      case "AES-Serpent-Twofish":
        return [32, 64, 96];
      default:
        return [32];
    }
  }

  private static calculateKeyEntropy(key: Buffer): number {
    const freq = new Map<number, number>();

    for (const byte of key) {
      freq.set(byte, (freq.get(byte) || 0) + 1);
    }

    let entropy = 0;
    for (const count of freq.values()) {
      const probability = count / key.length;
      entropy -= probability * Math.log2(probability);
    }

    return entropy;
  }

  private static getRecommendation(
    algorithm: string,
    encryptTime: number,
    decryptTime: number,
  ): "recommended" | "acceptable" | "not-recommended" {
    const totalTime = encryptTime + decryptTime;

    if (algorithm === "AES-256" && totalTime < 5) return "recommended";
    if (algorithm === "Serpent" && totalTime < 15) return "recommended";
    if (algorithm === "Twofish" && totalTime < 10) return "recommended";
    if (algorithm === "AES-Serpent-Twofish" && totalTime < 30)
      return "recommended";

    return totalTime < 50 ? "acceptable" : "not-recommended";
  }

  private static calculateSecurityScore(algorithm: string): number {
    const scores = {
      "AES-256": 8,
      Serpent: 9,
      Twofish: 8,
      "AES-Serpent-Twofish": 10,
    };
    return scores[algorithm] || 5;
  }

  private static calculatePerformanceScore(
    metrics: PerformanceMetrics,
  ): number {
    const avgSpeed = (metrics.encryptionSpeed + metrics.decryptionSpeed) / 2;
    if (avgSpeed > 100) return 10;
    if (avgSpeed > 50) return 8;
    if (avgSpeed > 20) return 6;
    if (avgSpeed > 10) return 4;
    return 2;
  }

  private static calculateMemoryScore(metrics: PerformanceMetrics): number {
    if (metrics.memoryUsage < 100) return 10;
    if (metrics.memoryUsage < 500) return 8;
    if (metrics.memoryUsage < 1000) return 6;
    if (metrics.memoryUsage < 2000) return 4;
    return 2;
  }

  private static calculateCpuScore(metrics: PerformanceMetrics): number {
    const scores = {
      low: 10,
      medium: 8,
      high: 6,
      "very-high": 4,
    };
    return scores[metrics.cpuIntensity] || 5;
  }

  private static calculateCpuIntensity(
    algorithm: string,
  ): "low" | "medium" | "high" | "very-high" {
    const intensity = {
      "AES-256": "low",
      Serpent: "high",
      Twofish: "medium",
      "AES-Serpent-Twofish": "very-high",
    };
    return (intensity[algorithm] as any) || "medium";
  }

  private static findBestOverall(criteria: any): string {
    let bestScore = 0;
    let bestAlgorithm = "";

    for (const algorithm of this.SUPPORTED_ALGORITHMS) {
      const score =
        criteria.security[algorithm] * 0.4 +
        criteria.performance[algorithm] * 0.3 +
        criteria.memory[algorithm] * 0.2 +
        criteria.cpuUsage[algorithm] * 0.1;

      if (score > bestScore) {
        bestScore = score;
        bestAlgorithm = algorithm;
      }
    }

    return bestAlgorithm;
  }

  private static findFastest(performance: {
    [algorithm: string]: number;
  }): string {
    return Object.keys(performance).reduce((a, b) =>
      performance[a] > performance[b] ? a : b,
    );
  }

  private static findMostSecure(security: {
    [algorithm: string]: number;
  }): string {
    return Object.keys(security).reduce((a, b) =>
      security[a] > security[b] ? a : b,
    );
  }

  private static findBestMemory(memory: {
    [algorithm: string]: number;
  }): string {
    return Object.keys(memory).reduce((a, b) =>
      memory[a] > memory[b] ? a : b,
    );
  }
}

// تصدير سريع للاستخدام المباشر
export const createCipher = CipherFactory.createCipher;
export const generateKey = CipherFactory.generateKeyForAlgorithm;
export const testAlgorithms = CipherFactory.testAllAlgorithms;
export const compareAlgorithms = CipherFactory.compareAlgorithms;
