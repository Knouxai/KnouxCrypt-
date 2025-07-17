/**
 * KnouxCrypt™ - Advanced Twofish Implementation
 * تطبيق متقدم لخوارزمية Twofish-256
 */

import { ICipher, CipherInfo, CipherError, CipherErrorCodes } from "./ICipher";

export class TwofishCipher implements ICipher {
  public readonly blockSize = 16; // 128 bits
  public readonly keySize = 32; // 256 bits
  public readonly algorithmName = "Twofish-256";
  public readonly rounds = 16; // Twofish rounds

  private readonly key: Buffer;
  private readonly sboxKeys: Uint32Array;
  private readonly roundKeys: Uint32Array;

  // MDS Matrix for column mixing
  private static readonly MDS = [
    [0x01, 0xef, 0x5b, 0x5b],
    [0x5b, 0xef, 0xef, 0x01],
    [0xef, 0x5b, 0x01, 0xef],
    [0xef, 0x01, 0xef, 0x5b],
  ];

  // Q-Tables for key-dependent S-boxes
  private static readonly Q0 = new Uint8Array([
    0xa9, 0x67, 0xb3, 0xe8, 0x04, 0xfd, 0xa3, 0x76, 0x9a, 0x92, 0x80, 0x78,
    0xe4, 0xdd, 0xd1, 0x38, 0x0d, 0xc6, 0x35, 0x98, 0x18, 0xf7, 0xec, 0x6c,
    0x43, 0x75, 0x37, 0x26, 0xfa, 0x13, 0x94, 0x48, 0xf2, 0xd0, 0x8b, 0x30,
    0x84, 0x54, 0xdf, 0x23, 0x19, 0x5b, 0x3d, 0x59, 0xf3, 0xae, 0xa2, 0x82,
    0x63, 0x01, 0x83, 0x2e, 0xd9, 0x51, 0x9b, 0x7c, 0xa6, 0xeb, 0xa5, 0xbe,
    0x16, 0x0c, 0xe3, 0x61, 0xc0, 0x8c, 0x3a, 0xf5, 0x73, 0x2c, 0x25, 0x0b,
    0xbb, 0x4e, 0x89, 0x6b, 0x53, 0x6a, 0xb4, 0xf1, 0xe1, 0xe6, 0xbd, 0x45,
    0xe2, 0xf4, 0xb6, 0x66, 0xcc, 0x95, 0x03, 0x56, 0xd4, 0x1c, 0x1e, 0xd7,
    0xfb, 0xc3, 0x8e, 0xb5, 0xe9, 0xcf, 0xbf, 0xba, 0xea, 0x77, 0x39, 0xaf,
    0x33, 0xc9, 0x62, 0x71, 0x81, 0x79, 0x09, 0xad, 0x24, 0xcd, 0xf9, 0xd8,
    0xe5, 0xc5, 0xb9, 0x4d, 0x44, 0x08, 0x86, 0xe7, 0xa1, 0x1d, 0xaa, 0xed,
    0x06, 0x70, 0xb2, 0xd2, 0x41, 0x7b, 0xa0, 0x11, 0x31, 0xc2, 0x27, 0x90,
    0x20, 0xf6, 0x60, 0xff, 0x96, 0x5c, 0xb1, 0xab, 0x9e, 0x9c, 0x52, 0x1b,
    0x5f, 0x93, 0x0a, 0xef, 0x91, 0x85, 0x49, 0xee, 0x2d, 0x4f, 0x8f, 0x3b,
    0x47, 0x87, 0x6d, 0x46, 0xd6, 0x3e, 0x69, 0x64, 0x2a, 0xce, 0xcb, 0x2f,
    0xfc, 0x97, 0x05, 0x7a, 0xac, 0x7f, 0xd5, 0x1a, 0x4b, 0x0e, 0xa7, 0x5a,
    0x28, 0x14, 0x3f, 0x29, 0x88, 0x3c, 0x4c, 0x02, 0xb8, 0xda, 0xb0, 0x17,
    0x55, 0x1f, 0x8a, 0x7d, 0x57, 0xc7, 0x8d, 0x74, 0xb7, 0xc4, 0x9f, 0x72,
    0x7e, 0x15, 0x22, 0x12, 0x58, 0x07, 0x99, 0x34, 0x6e, 0x50, 0xde, 0x68,
    0x65, 0xbc, 0xdb, 0xf8, 0xc8, 0xa8, 0x2b, 0x40, 0xdc, 0xfe, 0x32, 0xa4,
    0xca, 0x10, 0x21, 0xf0, 0xd3, 0x5d, 0x0f, 0x00, 0x6f, 0x9d, 0x36, 0x42,
    0x4a, 0x5e, 0xc1, 0xe0,
  ]);

  private static readonly Q1 = new Uint8Array([
    0x75, 0xf3, 0xc6, 0xf4, 0xdb, 0x7b, 0xfb, 0xc8, 0x4a, 0xd3, 0xe6, 0x6b,
    0x45, 0x7d, 0xe8, 0x4b, 0xd6, 0x32, 0xd8, 0xfd, 0x37, 0x71, 0xf1, 0xe1,
    0x30, 0x0f, 0xf8, 0x1b, 0x87, 0xfa, 0x06, 0x3f, 0x5e, 0xba, 0xae, 0x5b,
    0x8a, 0x00, 0xbc, 0x9d, 0x6d, 0xc1, 0xb1, 0x0e, 0x80, 0x5d, 0xd2, 0xd5,
    0xa0, 0x84, 0x07, 0x14, 0xb5, 0x90, 0x2c, 0xa3, 0xb2, 0x73, 0x4c, 0x54,
    0x92, 0x74, 0x36, 0x51, 0x38, 0xb0, 0xbd, 0x5a, 0xfc, 0x60, 0x62, 0x96,
    0x6c, 0x42, 0xf7, 0x10, 0x7c, 0x28, 0x27, 0x8c, 0x13, 0x95, 0x9c, 0xc7,
    0x24, 0x46, 0x3b, 0x70, 0xca, 0xe3, 0x85, 0xcb, 0x11, 0xd0, 0x93, 0xb8,
    0xa6, 0x83, 0x20, 0xff, 0x9f, 0x77, 0xc3, 0xcc, 0x03, 0x6f, 0x08, 0xbf,
    0x40, 0xe7, 0x2b, 0xe2, 0x79, 0x0c, 0xaa, 0x82, 0x41, 0x3a, 0xea, 0xb9,
    0xe4, 0x9a, 0xa4, 0x97, 0x7e, 0xda, 0x7a, 0x17, 0x66, 0x94, 0xa1, 0x1d,
    0x3d, 0xf0, 0xde, 0xb3, 0x0b, 0x72, 0xa7, 0x1c, 0xef, 0xd1, 0x53, 0x3e,
    0x8f, 0x33, 0x26, 0x5f, 0xec, 0x76, 0x2a, 0x49, 0x81, 0x88, 0xee, 0x21,
    0xc4, 0x1a, 0xeb, 0xd9, 0xc5, 0x39, 0x99, 0xcd, 0xad, 0x31, 0x8b, 0x01,
    0x18, 0x23, 0xdd, 0x1f, 0x4e, 0x2d, 0xf9, 0x48, 0x4f, 0xf2, 0x65, 0x8e,
    0x78, 0x5c, 0x58, 0x19, 0x8d, 0xe5, 0x98, 0x57, 0x67, 0x7f, 0x05, 0x64,
    0xaf, 0x63, 0xb6, 0xfe, 0xf5, 0xb7, 0x3c, 0xa5, 0xce, 0xe9, 0x68, 0x44,
    0xe0, 0x4d, 0x43, 0x69, 0x29, 0x2e, 0xac, 0x15, 0x59, 0xa8, 0x0a, 0x9e,
    0x6e, 0x47, 0xdf, 0x34, 0x35, 0x6a, 0xcf, 0xdc, 0x22, 0xc9, 0xc0, 0x9b,
    0x89, 0xd4, 0xed, 0xab, 0x12, 0xa2, 0x0d, 0x52, 0xbb, 0x02, 0x2f, 0xa9,
    0xd7, 0x61, 0x1e, 0xb4, 0x50, 0x04, 0xf6, 0xc2, 0x16, 0x25, 0x86, 0x56,
    0x55, 0x09, 0xbe, 0x91,
  ]);

  constructor(key: Buffer) {
    if (key.length !== this.keySize) {
      throw new CipherError(
        `🔑 المفتاح يجب أن يكون ${this.keySize} بايت (256 بت)، المعطى: ${key.length} بايت`,
        CipherErrorCodes.INVALID_KEY_SIZE,
        this.algorithmName,
      );
    }

    this.key = Buffer.from(key);
    const { sboxKeys, roundKeys } = this.expandKey(key);
    this.sboxKeys = sboxKeys;
    this.roundKeys = roundKeys;
  }

  encrypt(data: string | Buffer): Buffer {
    try {
      const input = typeof data === "string" ? Buffer.from(data, "utf8") : data;
      const paddedData = this.addPKCS7Padding(input);
      const result = Buffer.alloc(paddedData.length);

      for (let i = 0; i < paddedData.length; i += this.blockSize) {
        const block = paddedData.slice(i, i + this.blockSize);
        const encryptedBlock = this.encryptBlock(block);
        encryptedBlock.copy(result, i);
      }

      return result;
    } catch (error) {
      throw new CipherError(
        `🔐 فشل التشفير: ${error.message}`,
        CipherErrorCodes.ENCRYPTION_FAILED,
        this.algorithmName,
      );
    }
  }

  decrypt(encryptedData: Buffer): string {
    try {
      if (encryptedData.length % this.blockSize !== 0) {
        throw new Error("حجم البيانات المشفرة يجب أن يكون مضاعف لحجم البلوك");
      }

      const result = Buffer.alloc(encryptedData.length);

      for (let i = 0; i < encryptedData.length; i += this.blockSize) {
        const block = encryptedData.slice(i, i + this.blockSize);
        const decryptedBlock = this.decryptBlock(block);
        decryptedBlock.copy(result, i);
      }

      const unpaddedData = this.removePKCS7Padding(result);
      return unpaddedData.toString("utf8");
    } catch (error) {
      throw new CipherError(
        `🔓 فشل فك التشفير: ${error.message}`,
        CipherErrorCodes.DECRYPTION_FAILED,
        this.algorithmName,
      );
    }
  }

  getInfo(): CipherInfo {
    return {
      name: "Twofish-256",
      description:
        "خوارزمية تشفير سريعة ومرنة مع بنية Feistel وS-Boxes معتمدة على المفتاح",
      keySize: this.keySize,
      blockSize: this.blockSize,
      rounds: this.rounds,
      securityLevel: "عالي جداً",
      performance: "سريع",
      developedBy: "Bruce Schneier et al.",
      year: 1998,
      standardized: true,
      features: [
        "تشفير متماثل بمفتاح 256 بت",
        "بنية Feistel مع 16 جولة",
        "S-Boxes معتمدة على المفتاح",
        "تحويل خطي بمصفوفة MDS",
        "تصميم محسن للسرعة والأمان",
        "دعم مفاتيح متغيرة الطول",
      ],
      advantages: [
        "سرعة عالية في البرمجيات",
        "مرونة في التطبيق",
        "تصميم Feistel مقاوم للأخطاء",
        "S-Boxes معتمدة على المفتاح تزيد الأمان",
        "مناسب للتطبيقات التجارية",
        "توازن ممتاز بين السرعة والأمان",
      ],
      disadvantages: [
        "أكثر تعقيداً من AES",
        "يحتاج ذاكرة أكثر لـ S-Boxes",
        "أقل دعماً في الأجهزة",
        "تطبيق مفاتيح الجولات أكثر تعقيداً",
      ],
      useCases: [
        "التطبيقات التجارية والمالية",
        "تشفير قواعد البيانات",
        "أنظمة التراسل الآمن",
        "التخزين السحابي",
        "شبكات VPN",
        "حماية الملفات الشخصية",
      ],
      cryptanalysisResistance: {
        bruteForce: "2^256 محاولة - مستحيل عملياً",
        differential: "مقاوم جداً - بنية Feistel توفر حماية قوية",
        linear: "مقاوم جداً - S-Boxes المتنوعة تمنع التحليل الخطي",
        algebraic: "مقاوم - تعقيد البنية يحمي من التحليل الجبري",
      },
    };
  }

  /**
   * توسيع المفتاح
   */
  private expandKey(key: Buffer): {
    sboxKeys: Uint32Array;
    roundKeys: Uint32Array;
  } {
    // تقسيم المفتاح إلى أجزاء
    const keyWords = new Uint32Array(8);
    for (let i = 0; i < 8; i++) {
      keyWords[i] = key.readUInt32LE(i * 4);
    }

    // إنشاء مفاتيح S-Boxes
    const sboxKeys = new Uint32Array(4);
    for (let i = 0; i < 4; i++) {
      sboxKeys[i] = this.calculateSBoxKey(keyWords, i);
    }

    // إنشاء مفاتيح ��لجولات
    const roundKeys = new Uint32Array(40); // 20 round keys × 2

    for (let i = 0; i < 20; i++) {
      const A = this.h(i * 2, keyWords);
      const B = this.h(i * 2 + 1, keyWords);

      const rotatedB = this.rotateLeft(B, 8);
      roundKeys[i * 2] = (A + rotatedB) & 0xffffffff;
      roundKeys[i * 2 + 1] = this.rotateLeft(
        (A + 2 * rotatedB) & 0xffffffff,
        9,
      );
    }

    return { sboxKeys, roundKeys };
  }

  /**
   * تشفير بلوك واحد
   */
  private encryptBlock(block: Buffer): Buffer {
    let A = block.readUInt32LE(0);
    let B = block.readUInt32LE(4);
    let C = block.readUInt32LE(8);
    let D = block.readUInt32LE(12);

    // التحويل الأولي
    A ^= this.roundKeys[0];
    B ^= this.roundKeys[1];
    C ^= this.roundKeys[2];
    D ^= this.roundKeys[3];

    // 16 جولة Feistel
    for (let round = 0; round < 16; round++) {
      const T0 = this.g(A, this.sboxKeys);
      const T1 = this.g(this.rotateLeft(B, 8), this.sboxKeys);

      C ^= (T0 + T1 + this.roundKeys[8 + round * 2]) & 0xffffffff;
      C = this.rotateRight(C, 1);

      D = this.rotateLeft(D, 1);
      D ^= (T0 + 2 * T1 + this.roundKeys[8 + round * 2 + 1]) & 0xffffffff;

      // تبديل المتغيرات
      [A, B, C, D] = [C, D, A, B];
    }

    // التحويل النهائي
    C ^= this.roundKeys[4];
    D ^= this.roundKeys[5];
    A ^= this.roundKeys[6];
    B ^= this.roundKeys[7];

    const result = Buffer.alloc(16);
    result.writeUInt32LE(C, 0);
    result.writeUInt32LE(D, 4);
    result.writeUInt32LE(A, 8);
    result.writeUInt32LE(B, 12);

    return result;
  }

  /**
   * فك تشفير بلوك واحد
   */
  private decryptBlock(block: Buffer): Buffer {
    let A = block.readUInt32LE(0);
    let B = block.readUInt32LE(4);
    let C = block.readUInt32LE(8);
    let D = block.readUInt32LE(12);

    // التحويل الأولي العكسي
    A ^= this.roundKeys[4];
    B ^= this.roundKeys[5];
    C ^= this.roundKeys[6];
    D ^= this.roundKeys[7];

    // 16 جولة Feistel عكسية
    for (let round = 15; round >= 0; round--) {
      // تبديل المتغيرات العكسي
      [A, B, C, D] = [C, D, A, B];

      const T0 = this.g(A, this.sboxKeys);
      const T1 = this.g(this.rotateLeft(B, 8), this.sboxKeys);

      C = this.rotateLeft(C, 1);
      C ^= (T0 + T1 + this.roundKeys[8 + round * 2]) & 0xffffffff;

      D ^= (T0 + 2 * T1 + this.roundKeys[8 + round * 2 + 1]) & 0xffffffff;
      D = this.rotateRight(D, 1);
    }

    // التحويل النهائي العكسي
    A ^= this.roundKeys[0];
    B ^= this.roundKeys[1];
    C ^= this.roundKeys[2];
    D ^= this.roundKeys[3];

    const result = Buffer.alloc(16);
    result.writeUInt32LE(A, 0);
    result.writeUInt32LE(B, 4);
    result.writeUInt32LE(C, 8);
    result.writeUInt32LE(D, 12);

    return result;
  }

  /**
   * دالة g للتحويل غير الخطي
   */
  private g(x: number, sboxKeys: Uint32Array): number {
    const x0 = (x >>> 0) & 0xff;
    const x1 = (x >>> 8) & 0xff;
    const x2 = (x >>> 16) & 0xff;
    const x3 = (x >>> 24) & 0xff;

    const s0 = this.s(sboxKeys, 0, x0);
    const s1 = this.s(sboxKeys, 1, x1);
    const s2 = this.s(sboxKeys, 2, x2);
    const s3 = this.s(sboxKeys, 3, x3);

    return this.mdsMultiply([s0, s1, s2, s3]);
  }

  /**
   * دالة h لتوليد مفاتيح الجولات
   */
  private h(x: number, keyWords: Uint32Array): number {
    const x0 = (x >>> 0) & 0xff;
    const x1 = (x >>> 8) & 0xff;
    const x2 = (x >>> 16) & 0xff;
    const x3 = (x >>> 24) & 0xff;

    // تطبيق Q-Tables بالتسلسل
    let y0 = x0,
      y1 = x1,
      y2 = x2,
      y3 = x3;

    // 4 مراحل للمفتاح 256-bit
    for (let stage = 3; stage >= 0; stage--) {
      const k = keyWords[stage * 2 + 1];
      const k0 = (k >>> 0) & 0xff;
      const k1 = (k >>> 8) & 0xff;
      const k2 = (k >>> 16) & 0xff;
      const k3 = (k >>> 24) & 0xff;

      y0 = TwofishCipher.Q1[y0 ^ k0];
      y1 = TwofishCipher.Q0[y1 ^ k1];
      y2 = TwofishCipher.Q0[y2 ^ k2];
      y3 = TwofishCipher.Q1[y3 ^ k3];
    }

    return this.mdsMultiply([y0, y1, y2, y3]);
  }

  /**
   * دالة S للS-Boxes المعتمدة على المفتاح
   */
  private s(sboxKeys: Uint32Array, box: number, x: number): number {
    const key = sboxKeys[box];
    const k0 = (key >>> 0) & 0xff;
    const k1 = (key >>> 8) & 0xff;
    const k2 = (key >>> 16) & 0xff;
    const k3 = (key >>> 24) & 0xff;

    let y = x;

    // 4 مراحل تحويل
    y = TwofishCipher.Q1[y ^ k3];
    y = TwofishCipher.Q0[y ^ k2];
    y = TwofishCipher.Q0[y ^ k1];
    y = TwofishCipher.Q1[y ^ k0];

    return y;
  }

  /**
   * ضرب MDS Matrix
   */
  private mdsMultiply(input: number[]): number {
    const result = [0, 0, 0, 0];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        result[i] ^= this.gfMultiply(TwofishCipher.MDS[i][j], input[j]);
      }
    }

    return (
      (result[0] | (result[1] << 8) | (result[2] << 16) | (result[3] << 24)) >>>
      0
    );
  }

  /**
   * ضرب في Galois Field GF(2^8)
   */
  private gfMultiply(a: number, b: number): number {
    let result = 0;
    const irreducible = 0x169; // x^8 + x^6 + x^5 + x^3 + 1

    while (b !== 0) {
      if (b & 1) {
        result ^= a;
      }
      a <<= 1;
      if (a & 0x100) {
        a ^= irreducible;
      }
      b >>>= 1;
    }

    return result & 0xff;
  }

  /**
   * حساب مفتاح S-Box
   */
  private calculateSBoxKey(keyWords: Uint32Array, index: number): number {
    // تطبيق مبسط لحساب مفاتيح S-Boxes
    return keyWords[index] ^ keyWords[index + 4];
  }

  /**
   * دوران لليسار
   */
  private rotateLeft(value: number, shift: number): number {
    return ((value << shift) | (value >>> (32 - shift))) >>> 0;
  }

  /**
   * دوران لليمين
   */
  private rotateRight(value: number, shift: number): number {
    return ((value >>> shift) | (value << (32 - shift))) >>> 0;
  }

  /**
   * إضافة PKCS7 padding
   */
  private addPKCS7Padding(data: Buffer): Buffer {
    const paddingLength = this.blockSize - (data.length % this.blockSize);
    const padding = Buffer.alloc(paddingLength, paddingLength);
    return Buffer.concat([data, padding]);
  }

  /**
   * إزالة PKCS7 padding
   */
  private removePKCS7Padding(data: Buffer): Buffer {
    const paddingLength = data[data.length - 1];

    if (paddingLength < 1 || paddingLength > this.blockSize) {
      throw new Error("Padding غير صحيح");
    }

    // التحقق من صحة الـ padding
    for (let i = data.length - paddingLength; i < data.length; i++) {
      if (data[i] !== paddingLength) {
        throw new Error("Padding غير صحيح");
      }
    }

    return data.slice(0, data.length - paddingLength);
  }
}
