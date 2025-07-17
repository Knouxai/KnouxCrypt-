/**
 * KnouxCrypt™ - Comprehensive Crypto Testing Module
 * اختبار شامل لجميع وحدات التشفير والBuffer polyfill
 */

import { createBuffer, BufferPolyfill } from "./buffer-polyfill";
import { AESCipher } from "../core/crypto/AESCipher";
import { SerpentCipher } from "../core/crypto/SerpentCipher";
import { TwofishCipher } from "../core/crypto/TwofishCipher";
import { TripleCipher } from "../core/crypto/TripleCipher";
import { SecureKeyGenerator } from "../core/crypto/ICipher";

export interface TestResult {
  module: string;
  passed: boolean;
  message: string;
  details?: any;
}

export class CryptoTester {
  private results: TestResult[] = [];

  /**
   * تشغيل جميع الاختبارات
   */
  async runAllTests(): Promise<TestResult[]> {
    this.results = [];

    console.log("🔬 بدء الاختبارات الشاملة للتشفير...");

    // اختبار Buffer polyfill
    await this.testBufferPolyfill();

    // اختبار مولد المفاتيح
    await this.testKeyGenerator();

    // اختبار AES
    await this.testAESCipher();

    // اختبار Serpent
    await this.testSerpentCipher();

    // اختبار Twofish
    await this.testTwofishCipher();

    // اختبار Triple Cipher
    await this.testTripleCipher();

    // اختبار الأداء
    await this.testPerformance();

    console.log("✅ انتهاء جميع الاختبارات");

    return this.results;
  }

  /**
   * اختبار Buffer polyfill
   */
  private async testBufferPolyfill(): Promise<void> {
    try {
      console.log("🧪 اختبار Buffer polyfill...");

      // اختبار الإنشاء من string
      const buf1 = createBuffer("Hello World", "utf8");
      if (buf1.length !== 11) {
        throw new Error("خطأ في طول Buffer من string");
      }

      // اختبار الإنشاء من hex
      const buf2 = createBuffer("48656c6c6f", "hex");
      if (buf2.toString("utf8") !== "Hello") {
        throw new Error("خطأ في تحويل hex إلى string");
      }

      // اختبار slice
      const buf3 = buf1.slice(0, 5);
      if (buf3.toString("utf8") !== "Hello") {
        throw new Error("خطأ في slice");
      }

      // اختبار equals
      const buf4 = createBuffer("Hello", "utf8");
      if (!buf3.equals(buf4)) {
        throw new Error("خطأ في equals");
      }

      // اختبار alloc
      const buf5 = BufferPolyfill.alloc(10, 0);
      if (buf5.length !== 10) {
        throw new Error("خطأ في alloc");
      }

      this.addResult(
        "Buffer Polyfill",
        true,
        "جميع اختبارات Buffer polyfill نجحت",
      );
    } catch (error) {
      this.addResult(
        "Buffer Polyfill",
        false,
        `فشل اختبار Buffer polyfill: ${error.message}`,
      );
    }
  }

  /**
   * اختبار مولد المفاتيح
   */
  private async testKeyGenerator(): Promise<void> {
    try {
      console.log("🔑 اختبار مولد المفاتيح...");

      // اختبار توليد مفتاح آمن
      const key1 = SecureKeyGenerator.generateSecureKey(32);
      if (key1.length !== 32) {
        throw new Error("خطأ في حجم المفتاح المولد");
      }

      // اختبار اشتقاق مفتاح من كلمة مرور
      const salt = createBuffer("test-salt", "utf8");
      const key2 = SecureKeyGenerator.deriveKeyFromPassword(
        "test-password",
        salt,
        1000,
        32,
      );
      if (key2.length !== 32) {
        throw new Error("خطأ في اشتقاق المفتاح");
      }

      // التأكد من عدم تطابق المفاتيح المولدة
      const key3 = SecureKeyGenerator.generateSecureKey(32);
      if (key1.equals && key3.equals && key1.equals(key3)) {
        throw new Error("المفاتيح المولدة متطابقة - خطأ في العشوائية");
      }

      this.addResult("Key Generator", true, "جميع اختبارات مولد المفاتيح نجحت");
    } catch (error) {
      this.addResult(
        "Key Generator",
        false,
        `فشل اختبار مولد المفاتيح: ${error.message}`,
      );
    }
  }

  /**
   * اختبار AES
   */
  private async testAESCipher(): Promise<void> {
    try {
      console.log("🛡️ اختبار AES-256...");

      const key = SecureKeyGenerator.generateSecureKey(32);
      const aes = new AESCipher(key);

      const testData = "هذا نص تجريبي للتشفير باستخدام AES-256";
      const encrypted = aes.encrypt(testData);
      const decrypted = aes.decrypt(encrypted);

      if (decrypted !== testData) {
        throw new Error("فشل في فك التشفير - البيانات لا تطابق");
      }

      // اختبار مع بيانات ثنائية
      const binaryData = SecureKeyGenerator.generateSecureKey(100);
      const encryptedBinary = aes.encrypt(binaryData);
      const decryptedBinary = aes.decrypt(encryptedBinary);

      if (!binaryData.equals || !binaryData.equals(decryptedBinary as any)) {
        throw new Error("فشل في تشفير البيانات الثنائية");
      }

      this.addResult("AES-256", true, "جميع اختبارات AES-256 نجحت", {
        originalSize: testData.length,
        encryptedSize: encrypted.length,
      });
    } catch (error) {
      this.addResult("AES-256", false, `فشل اختبار AES-256: ${error.message}`);
    }
  }

  /**
   * اختبار Serpent
   */
  private async testSerpentCipher(): Promise<void> {
    try {
      console.log("🐍 اختبار Serpent-256...");

      const key = SecureKeyGenerator.generateSecureKey(32);
      const serpent = new SerpentCipher(key);

      const testData =
        "اختبار خوارزمية Serpent مع النص العربي والإنجليزي Mixed Text";
      const encrypted = serpent.encrypt(testData);
      const decrypted = serpent.decrypt(encrypted);

      if (decrypted !== testData) {
        throw new Error("فشل في فك التشفير - البيانات لا تطابق");
      }

      this.addResult("Serpent-256", true, "جميع اختبارات Serpent-256 نجحت", {
        originalSize: testData.length,
        encryptedSize: encrypted.length,
      });
    } catch (error) {
      this.addResult(
        "Serpent-256",
        false,
        `فشل اختبار Serpent-256: ${error.message}`,
      );
    }
  }

  /**
   * اختبار Twofish
   */
  private async testTwofishCipher(): Promise<void> {
    try {
      console.log("🐟 اختبار Twofish-256...");

      const key = SecureKeyGenerator.generateSecureKey(32);
      const twofish = new TwofishCipher(key);

      const testData =
        "Testing Twofish encryption with special chars: @#$%^&*()";
      const encrypted = twofish.encrypt(testData);
      const decrypted = twofish.decrypt(encrypted);

      if (decrypted !== testData) {
        throw new Error("فشل في فك التشفير - البيانات لا تطابق");
      }

      this.addResult("Twofish-256", true, "جميع اختبارات Twofish-256 نجحت", {
        originalSize: testData.length,
        encryptedSize: encrypted.length,
      });
    } catch (error) {
      this.addResult(
        "Twofish-256",
        false,
        `فشل اختبار Twofish-256: ${error.message}`,
      );
    }
  }

  /**
   * اختبار Triple Cipher
   */
  private async testTripleCipher(): Promise<void> {
    try {
      console.log("🔐 اختبار Triple Cipher...");

      const key = TripleCipher.generateSecureTripleKey();
      const triple = new TripleCipher(key);

      const testData = "هذا اختبار للتشفير الثلاثي الأقوى في العالم! 🔒🛡️🔐";
      const encrypted = triple.encrypt(testData);
      const decrypted = triple.decrypt(encrypted);

      if (decrypted !== testData) {
        throw new Error("فشل في فك التشفير - البيانات لا تطابق");
      }

      // اختبار مع مفتاح 32 بايت (اشتقاق تلقائي)
      const smallKey = SecureKeyGenerator.generateSecureKey(32);
      const triple32 = new TripleCipher(smallKey);
      const encrypted32 = triple32.encrypt(testData);
      const decrypted32 = triple32.decrypt(encrypted32);

      if (decrypted32 !== testData) {
        throw new Error("فشل في التشفير مع المفتاح المشتق");
      }

      this.addResult(
        "Triple Cipher",
        true,
        "جميع اختبارات Triple Cipher نجحت",
        {
          originalSize: testData.length,
          encryptedSize: encrypted.length,
          keySize: key.length,
        },
      );
    } catch (error) {
      this.addResult(
        "Triple Cipher",
        false,
        `فشل اختبار Triple Cipher: ${error.message}`,
      );
    }
  }

  /**
   * اختبار الأداء
   */
  private async testPerformance(): Promise<void> {
    try {
      console.log("⚡ اختبار الأداء...");

      const testData = "A".repeat(1024); // 1KB
      const key = SecureKeyGenerator.generateSecureKey(32);

      const algorithms = [
        { name: "AES-256", cipher: new AESCipher(key) },
        { name: "Serpent-256", cipher: new SerpentCipher(key) },
        { name: "Twofish-256", cipher: new TwofishCipher(key) },
      ];

      const results: any = {};

      for (const algo of algorithms) {
        const start = performance.now();
        const encrypted = algo.cipher.encrypt(testData);
        const encryptTime = performance.now() - start;

        const decryptStart = performance.now();
        algo.cipher.decrypt(encrypted);
        const decryptTime = performance.now() - decryptStart;

        results[algo.name] = {
          encryptTime: Math.round(encryptTime * 100) / 100,
          decryptTime: Math.round(decryptTime * 100) / 100,
          totalTime: Math.round((encryptTime + decryptTime) * 100) / 100,
        };
      }

      this.addResult("Performance Test", true, "اختبار الأداء مكتمل", results);
    } catch (error) {
      this.addResult(
        "Performance Test",
        false,
        `فشل اختبار الأداء: ${error.message}`,
      );
    }
  }

  /**
   * إضافة نتيجة اختبار
   */
  private addResult(
    module: string,
    passed: boolean,
    message: string,
    details?: any,
  ): void {
    this.results.push({ module, passed, message, details });

    const status = passed ? "✅" : "❌";
    console.log(`${status} ${module}: ${message}`);

    if (details) {
      console.log("   التفاصيل:", details);
    }
  }

  /**
   * الحصول على تقرير مفصل
   */
  getDetailedReport(): {
    summary: { total: number; passed: number; failed: number };
    results: TestResult[];
    recommendations: string[];
  } {
    const total = this.results.length;
    const passed = this.results.filter((r) => r.passed).length;
    const failed = total - passed;

    const recommendations: string[] = [];

    if (failed === 0) {
      recommendations.push("���� جميع الاختبارات نجحت! النظام جاهز للاستخدام");
    } else {
      recommendations.push("⚠️ يوجد مشاكل تحتاج إصلاح قبل الاستخدام");

      const failedModules = this.results
        .filter((r) => !r.passed)
        .map((r) => r.module);
      recommendations.push(`الوحدات الفاشلة: ${failedModules.join(", ")}`);
    }

    if (passed > 0) {
      recommendations.push(`✅ ${passed} اختبار نجح من أصل ${total}`);
    }

    return {
      summary: { total, passed, failed },
      results: this.results,
      recommendations,
    };
  }
}

/**
 * تشغيل اختبار سريع
 */
export async function runQuickTest(): Promise<boolean> {
  console.log("🚀 تشغيل اختبار سريع...");

  try {
    const tester = new CryptoTester();
    const results = await tester.runAllTests();
    const report = tester.getDetailedReport();

    console.log("\n📊 تقرير الاختبار:");
    console.log(`   المجموع: ${report.summary.total}`);
    console.log(`   نجح: ${report.summary.passed}`);
    console.log(`   فشل: ${report.summary.failed}`);

    console.log("\n📋 التوصيات:");
    report.recommendations.forEach((rec) => console.log(`   ${rec}`));

    return report.summary.failed === 0;
  } catch (error) {
    console.error("❌ فشل في تشغيل الاختبارات:", error);
    return false;
  }
}

// تصدير مثيل عام
export const cryptoTester = new CryptoTester();
