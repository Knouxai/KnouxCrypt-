/**
 * KnouxCrypt™ - Advanced AES Implementation
 * تطبيق متقدم لخوارزمية AES-256
 */

import {
  ICipher,
  CipherInfo,
  EncryptionOptions,
  CipherError,
  CipherErrorCodes,
} from "./ICipher";
import { createBuffer, BufferPolyfill } from "../../utils/buffer-polyfill";

// Browser-compatible Buffer type
type BufferLike = BufferPolyfill | Uint8Array;

export class AESCipher implements ICipher {
  public readonly blockSize = 16; // 128 bits
  public readonly keySize = 32; // 256 bits
  public readonly algorithmName = "AES-256";
  public readonly rounds = 14; // AES-256 rounds

  private readonly key: BufferLike;
  private readonly expandedKey: Uint32Array;

  // AES S-Box
  private static readonly SBOX = new Uint8Array([
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b,
    0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0,
    0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26,
    0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
    0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2,
    0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0,
    0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed,
    0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
    0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f,
    0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5,
    0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec,
    0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
    0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14,
    0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c,
    0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d,
    0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
    0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f,
    0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e,
    0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11,
    0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
    0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f,
    0xb0, 0x54, 0xbb, 0x16,
  ]);

  // Inverse S-Box
  private static readonly INV_SBOX = new Uint8Array([
    0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e,
    0x81, 0xf3, 0xd7, 0xfb, 0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87,
    0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb, 0x54, 0x7b, 0x94, 0x32,
    0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
    0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49,
    0x6d, 0x8b, 0xd1, 0x25, 0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16,
    0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92, 0x6c, 0x70, 0x48, 0x50,
    0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
    0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05,
    0xb8, 0xb3, 0x45, 0x06, 0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02,
    0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b, 0x3a, 0x91, 0x11, 0x41,
    0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
    0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8,
    0x1c, 0x75, 0xdf, 0x6e, 0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89,
    0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b, 0xfc, 0x56, 0x3e, 0x4b,
    0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
    0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59,
    0x27, 0x80, 0xec, 0x5f, 0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d,
    0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef, 0xa0, 0xe0, 0x3b, 0x4d,
    0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
    0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63,
    0x55, 0x21, 0x0c, 0x7d,
  ]);

  // Round constants
  private static readonly RCON = new Uint8Array([
    0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c,
    0xd8, 0xab, 0x4d, 0x9a,
  ]);

  constructor(key: BufferLike) {
    if (key.length !== this.keySize) {
      throw new CipherError(
        `🔑 المفتاح يجب أن يكون ${this.keySize} بايت (256 بت)، المعطى: ${key.length} بايت`,
        CipherErrorCodes.INVALID_KEY_SIZE,
        this.algorithmName,
      );
    }

    this.key = key instanceof BufferPolyfill ? key : createBuffer(key);
    this.expandedKey = this.expandKey(this.key);
  }

  encrypt(data: string | BufferLike): BufferLike {
    try {
      const input =
        typeof data === "string" ? createBuffer(data, "utf8") : data;
      const paddedData = this.addPKCS7Padding(input);
      const result = createBuffer(new Uint8Array(paddedData.length));

      for (let i = 0; i < paddedData.length; i += this.blockSize) {
        const blockData =
          paddedData instanceof BufferPolyfill
            ? paddedData.toUint8Array()
            : paddedData;
        const block = createBuffer(blockData.slice(i, i + this.blockSize));
        const encryptedBlock = this.encryptBlock(block);
        const encryptedUint8 =
          encryptedBlock instanceof BufferPolyfill
            ? encryptedBlock.toUint8Array()
            : encryptedBlock;
        const resultUint8 =
          result instanceof BufferPolyfill ? result.toUint8Array() : result;
        resultUint8.set(encryptedUint8, i);
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

  decrypt(encryptedData: BufferLike): string | BufferLike {
    try {
      if (encryptedData.length % this.blockSize !== 0) {
        throw new Error("حجم البيانات المشفرة يجب أن يكون مضاعف لحجم البلوك");
      }

      const result = createBuffer(new Uint8Array(encryptedData.length));

      for (let i = 0; i < encryptedData.length; i += this.blockSize) {
        const encryptedUint8 =
          encryptedData instanceof BufferPolyfill
            ? encryptedData.toUint8Array()
            : encryptedData;
        const block = createBuffer(encryptedUint8.slice(i, i + this.blockSize));
        const decryptedBlock = this.decryptBlock(block);
        const decryptedUint8 =
          decryptedBlock instanceof BufferPolyfill
            ? decryptedBlock.toUint8Array()
            : decryptedBlock;
        const resultUint8 =
          result instanceof BufferPolyfill ? result.toUint8Array() : result;
        resultUint8.set(decryptedUint8, i);
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
      name: "AES-256",
      description:
        "Advanced Encryption Standard مع مفتاح 256 بت - المعيار الذهبي للتشفير المتماثل",
      keySize: this.keySize,
      blockSize: this.blockSize,
      rounds: this.rounds,
      securityLevel: "عالي جداً",
      performance: "سريع",
      developedBy: "Joan Daemen & Vincent Rijmen",
      year: 2001,
      standardized: true,
      features: [
        "تشفير متماثل بمفتاح 256 بت",
        "حجم بلوك ثابت 128 بت",
        "14 جولة تشفير",
        "مقاوم للتحليل التفاضلي والخطي",
        "دعم أوضاع متعددة (CBC, ECB, CTR, GCM)",
        "متحسن للأجهزة الحديثة (AES-NI)",
      ],
      advantages: [
        "سرعة عالية في التشفير وفك التشفير",
        "مدعوم من قبل معالجات Intel/AMD (AES-NI)",
        "معتمد من NSA للمعلومات السرية",
        "مقاوم لجميع الهجمات المعروفة",
        "استهلاك ذاكرة منخفض",
        "تطبيق بسيط وموثوق",
      ],
      disadvantages: [
        "حجم بلوك صغير نسبياً (128 بت)",
        "قد يكون عرضة لهجمات القناة الجانبية",
        "يتطلب مولد أرقام عشوائية قوي للـ IV",
      ],
      useCases: [
        "تشفير الملفات والأقراص",
        "اتصالات الإنترنت الآمنة (TLS/SSL)",
        "التطبيقات المصرفية والمالية",
        "الحوسبة السحاب��ة",
        "أنظمة إدارة قواعد البيانات",
        "الاتصالات العسكرية والحكومية",
      ],
      cryptanalysisResistance: {
        bruteForce: "2^256 محاولة - مستحيل عملياً",
        differential: "مقاوم بقوة - لا توجد هجمات فعالة",
        linear: "مقاوم بقوة - لا توجد هجمات فعالة",
        algebraic: "مقاوم - لا توجد هجمات عملية",
      },
    };
  }

  /**
   * توسيع المفتاح لجميع الجولات
   */
  private expandKey(key: BufferLike): Uint32Array {
    const expandedKey = new Uint32Array(60); // 15 round keys × 4 words

    // نسخ المفتاح الأصلي
    const keyData = key instanceof BufferPolyfill ? key.toUint8Array() : key;
    for (let i = 0; i < 8; i++) {
      expandedKey[i] =
        (keyData[i * 4] << 24) |
        (keyData[i * 4 + 1] << 16) |
        (keyData[i * 4 + 2] << 8) |
        keyData[i * 4 + 3];
    }

    // توليد مفاتيح الجولات
    for (let i = 8; i < 60; i++) {
      let temp = expandedKey[i - 1];

      if (i % 8 === 0) {
        temp = this.subWord(this.rotWord(temp)) ^ (AESCipher.RCON[i / 8] << 24);
      } else if (i % 8 === 4) {
        temp = this.subWord(temp);
      }

      expandedKey[i] = expandedKey[i - 8] ^ temp;
    }

    return expandedKey;
  }

  /**
   * تشفير بلوك واحد
   */
  private encryptBlock(block: BufferLike): BufferLike {
    const state = new Uint8Array(16);
    const blockData =
      block instanceof BufferPolyfill ? block.toUint8Array() : block;
    state.set(blockData);

    // الجولة الأولى
    this.addRoundKey(state, 0);

    // الجولات الوسطية
    for (let round = 1; round < this.rounds; round++) {
      this.subBytes(state);
      this.shiftRows(state);
      this.mixColumns(state);
      this.addRoundKey(state, round);
    }

    // الجولة الأخيرة
    this.subBytes(state);
    this.shiftRows(state);
    this.addRoundKey(state, this.rounds);

    return createBuffer(state);
  }

  /**
   * فك تشفير بلوك واحد
   */
  private decryptBlock(block: BufferLike): BufferLike {
    const state = new Uint8Array(16);
    const blockData =
      block instanceof BufferPolyfill ? block.toUint8Array() : block;
    state.set(blockData);

    // الجولة الأولى (عكسية)
    this.addRoundKey(state, this.rounds);
    this.invShiftRows(state);
    this.invSubBytes(state);

    // الجولات الوسطية (عكسية)
    for (let round = this.rounds - 1; round > 0; round--) {
      this.addRoundKey(state, round);
      this.invMixColumns(state);
      this.invShiftRows(state);
      this.invSubBytes(state);
    }

    // الجولة الأخيرة (عكسية)
    this.addRoundKey(state, 0);

    return createBuffer(state);
  }

  /**
   * إضافة مفتاح الجولة
   */
  private addRoundKey(state: Uint8Array, round: number): void {
    const roundKey = this.expandedKey.slice(round * 4, (round + 1) * 4);

    for (let i = 0; i < 4; i++) {
      const keyWord = roundKey[i];
      state[i * 4] ^= (keyWord >>> 24) & 0xff;
      state[i * 4 + 1] ^= (keyWord >>> 16) & 0xff;
      state[i * 4 + 2] ^= (keyWord >>> 8) & 0xff;
      state[i * 4 + 3] ^= keyWord & 0xff;
    }
  }

  /**
   * استبدال البايتات
   */
  private subBytes(state: Uint8Array): void {
    for (let i = 0; i < 16; i++) {
      state[i] = AESCipher.SBOX[state[i]];
    }
  }

  /**
   * استبدال البايتات العكسي
   */
  private invSubBytes(state: Uint8Array): void {
    for (let i = 0; i < 16; i++) {
      state[i] = AESCipher.INV_SBOX[state[i]];
    }
  }

  /**
   * إزاحة الصفوف
   */
  private shiftRows(state: Uint8Array): void {
    let temp: number;

    // الصف الثاني - إزاحة 1
    temp = state[1];
    state[1] = state[5];
    state[5] = state[9];
    state[9] = state[13];
    state[13] = temp;

    // الصف الثالث - إزاحة 2
    temp = state[2];
    state[2] = state[10];
    state[10] = temp;
    temp = state[6];
    state[6] = state[14];
    state[14] = temp;

    // الصف الرابع - إزاحة 3
    temp = state[3];
    state[3] = state[15];
    state[15] = state[11];
    state[11] = state[7];
    state[7] = temp;
  }

  /**
   * إزاحة الصفوف العكسية
   */
  private invShiftRows(state: Uint8Array): void {
    let temp: number;

    // الصف الثاني - إزاحة عكسية 1
    temp = state[13];
    state[13] = state[9];
    state[9] = state[5];
    state[5] = state[1];
    state[1] = temp;

    // الصف الثالث - إزاحة عكسية 2
    temp = state[2];
    state[2] = state[10];
    state[10] = temp;
    temp = state[6];
    state[6] = state[14];
    state[14] = temp;

    // الصف الرابع - إزاحة عكسية 3
    temp = state[3];
    state[3] = state[7];
    state[7] = state[11];
    state[11] = state[15];
    state[15] = temp;
  }

  /**
   * خلط الأعمدة
   */
  private mixColumns(state: Uint8Array): void {
    for (let c = 0; c < 4; c++) {
      const a = [
        state[c * 4],
        state[c * 4 + 1],
        state[c * 4 + 2],
        state[c * 4 + 3],
      ];

      state[c * 4] = this.gmul(a[0], 2) ^ this.gmul(a[1], 3) ^ a[2] ^ a[3];
      state[c * 4 + 1] = a[0] ^ this.gmul(a[1], 2) ^ this.gmul(a[2], 3) ^ a[3];
      state[c * 4 + 2] = a[0] ^ a[1] ^ this.gmul(a[2], 2) ^ this.gmul(a[3], 3);
      state[c * 4 + 3] = this.gmul(a[0], 3) ^ a[1] ^ a[2] ^ this.gmul(a[3], 2);
    }
  }

  /**
   * خلط الأعمدة العكسي
   */
  private invMixColumns(state: Uint8Array): void {
    for (let c = 0; c < 4; c++) {
      const a = [
        state[c * 4],
        state[c * 4 + 1],
        state[c * 4 + 2],
        state[c * 4 + 3],
      ];

      state[c * 4] =
        this.gmul(a[0], 14) ^
        this.gmul(a[1], 11) ^
        this.gmul(a[2], 13) ^
        this.gmul(a[3], 9);
      state[c * 4 + 1] =
        this.gmul(a[0], 9) ^
        this.gmul(a[1], 14) ^
        this.gmul(a[2], 11) ^
        this.gmul(a[3], 13);
      state[c * 4 + 2] =
        this.gmul(a[0], 13) ^
        this.gmul(a[1], 9) ^
        this.gmul(a[2], 14) ^
        this.gmul(a[3], 11);
      state[c * 4 + 3] =
        this.gmul(a[0], 11) ^
        this.gmul(a[1], 13) ^
        this.gmul(a[2], 9) ^
        this.gmul(a[3], 14);
    }
  }

  /**
   * ضرب في Galois Field
   */
  private gmul(a: number, b: number): number {
    let result = 0;

    while (b) {
      if (b & 1) {
        result ^= a;
      }
      a <<= 1;
      if (a & 0x100) {
        a ^= 0x11b; // AES irreducible polynomial
      }
      b >>= 1;
    }

    return result & 0xff;
  }

  /**
   * دوران كلمة
   */
  private rotWord(word: number): number {
    return ((word << 8) | (word >>> 24)) & 0xffffffff;
  }

  /**
   * استبدال كلمة
   */
  private subWord(word: number): number {
    return (
      (AESCipher.SBOX[(word >>> 24) & 0xff] << 24) |
      (AESCipher.SBOX[(word >>> 16) & 0xff] << 16) |
      (AESCipher.SBOX[(word >>> 8) & 0xff] << 8) |
      AESCipher.SBOX[word & 0xff]
    );
  }

  /**
   * إضافة PKCS7 padding
   */
  private addPKCS7Padding(data: BufferLike): BufferLike {
    const paddingLength = this.blockSize - (data.length % this.blockSize);
    const padding = createBuffer(
      new Uint8Array(paddingLength).fill(paddingLength),
    );
    const dataUint8 =
      data instanceof BufferPolyfill ? data.toUint8Array() : data;
    const paddingUint8 =
      padding instanceof BufferPolyfill ? padding.toUint8Array() : padding;
    const result = new Uint8Array(dataUint8.length + paddingUint8.length);
    result.set(dataUint8);
    result.set(paddingUint8, dataUint8.length);
    return createBuffer(result);
  }

  /**
   * إزالة PKCS7 padding
   */
  private removePKCS7Padding(data: BufferLike): BufferLike {
    const dataUint8 =
      data instanceof BufferPolyfill ? data.toUint8Array() : data;
    const paddingLength = dataUint8[dataUint8.length - 1];

    if (paddingLength < 1 || paddingLength > this.blockSize) {
      throw new Error("Padding غير صحيح");
    }

    // التحقق من صحة الـ padding
    for (let i = dataUint8.length - paddingLength; i < dataUint8.length; i++) {
      if (dataUint8[i] !== paddingLength) {
        throw new Error("Padding غير صحيح");
      }
    }

    return createBuffer(dataUint8.slice(0, dataUint8.length - paddingLength));
  }
}
