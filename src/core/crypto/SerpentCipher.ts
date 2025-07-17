/**
 * KnouxCrypt™ - Advanced Serpent Implementation
 * تطبيق متقدم لخوارزمية Serpent-256
 */

import { ICipher, CipherInfo, CipherError, CipherErrorCodes } from "./ICipher";
import { createBuffer, BufferPolyfill } from "../../utils/buffer-polyfill";

// Browser-compatible Buffer type
type BufferLike = BufferPolyfill | Uint8Array;

export class SerpentCipher implements ICipher {
  public readonly blockSize = 16; // 128 bits
  public readonly keySize = 32; // 256 bits
  public readonly algorithmName = "Serpent-256";
  public readonly rounds = 32; // Serpent rounds

  private readonly key: BufferLike;
  private readonly roundKeys: Uint32Array;

  // Serpent S-Boxes
  private static readonly SBOXES = [
    // S0
    [3, 8, 15, 1, 10, 6, 5, 11, 14, 13, 4, 2, 7, 0, 9, 12],
    // S1
    [15, 12, 2, 7, 9, 0, 5, 10, 1, 11, 14, 8, 6, 13, 3, 4],
    // S2
    [8, 6, 7, 9, 3, 12, 10, 15, 13, 1, 14, 4, 0, 11, 5, 2],
    // S3
    [0, 15, 11, 8, 12, 9, 6, 3, 13, 1, 2, 4, 10, 7, 5, 14],
    // S4
    [1, 15, 8, 3, 12, 0, 11, 6, 2, 5, 4, 10, 9, 14, 7, 13],
    // S5
    [15, 5, 2, 11, 4, 10, 9, 12, 0, 3, 14, 8, 13, 6, 7, 1],
    // S6
    [7, 2, 12, 5, 8, 4, 6, 11, 14, 9, 1, 15, 13, 3, 10, 0],
    // S7
    [1, 13, 15, 0, 14, 8, 2, 11, 7, 4, 12, 10, 9, 3, 5, 6],
  ];

  // Inverse S-Boxes
  private static readonly INV_SBOXES = [
    // S0^-1
    [13, 3, 11, 0, 10, 6, 5, 12, 1, 14, 4, 7, 15, 9, 8, 2],
    // S1^-1
    [5, 8, 2, 14, 15, 6, 12, 3, 11, 4, 7, 9, 1, 13, 10, 0],
    // S2^-1
    [12, 9, 15, 4, 11, 14, 1, 2, 0, 3, 6, 13, 5, 8, 10, 7],
    // S3^-1
    [0, 9, 10, 7, 11, 14, 6, 13, 3, 5, 12, 2, 4, 8, 15, 1],
    // S4^-1
    [5, 0, 8, 3, 10, 9, 7, 14, 2, 12, 11, 6, 4, 15, 13, 1],
    // S5^-1
    [8, 15, 2, 9, 4, 1, 13, 14, 11, 6, 5, 3, 7, 12, 10, 0],
    // S6^-1
    [15, 10, 1, 13, 5, 3, 6, 0, 4, 9, 14, 7, 2, 12, 8, 11],
    // S7^-1
    [3, 0, 6, 13, 9, 14, 15, 8, 5, 12, 11, 7, 10, 1, 4, 2],
  ];

  // Linear transformation constants
  private static readonly PHI = 0x9e3779b9;

  constructor(key: BufferLike) {
    if (key.length !== this.keySize) {
      throw new CipherError(
        `🔑 المفتاح يجب أن يكون ${this.keySize} بايت (256 بت)، المعطى: ${key.length} بايت`,
        CipherErrorCodes.INVALID_KEY_SIZE,
        this.algorithmName,
      );
    }

    this.key = key instanceof BufferPolyfill ? key : createBuffer(key);
    this.roundKeys = this.expandKey(this.key);
  }

  encrypt(data: string | BufferLike): BufferLike {
    try {
      const input =
        typeof data === "string" ? createBuffer(data, "utf8") : data;
      const paddedData = this.addPKCS7Padding(input);
      const result = createBuffer(new Uint8Array(paddedData.length));

      for (let i = 0; i < paddedData.length; i += this.blockSize) {
        const paddedUint8 =
          paddedData instanceof BufferPolyfill
            ? paddedData.toUint8Array()
            : paddedData;
        const block = createBuffer(paddedUint8.slice(i, i + this.blockSize));
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
      name: "Serpent-256",
      description: "خوارزمية تشفير فائقة الأمان مع 32 جولة و 8 S-Boxes مختلفة",
      keySize: this.keySize,
      blockSize: this.blockSize,
      rounds: this.rounds,
      securityLevel: "أقصى",
      performance: "متوسط",
      developedBy: "Ross Anderson, Eli Biham, Lars Knudsen",
      year: 1998,
      standardized: true,
      features: [
        "تشفير متماثل بمفتاح 256 بت",
        "32 جولة تشفير (ضعف AES)",
        "8 S-Boxes مختلفة لمقاومة التحليل",
        "تصميم محافظ يركز على الأمان",
        "مقاوم لجميع أنواع التحليل المعروفة",
        "هامش أمان كبير جداً",
      ],
      advantages: [
        "أمان استثنائي مع 32 جولة",
        "تصميم مقاوم للتحليل التفاضلي والخطي",
        "S-Boxes متنوعة تزيد التعقيد",
        "هامش أمان كبير ضد الهجمات المستقبلية",
        "مناسب للتطبيقات عالية الأمان",
        "لا توجد نقاط ضعف معروفة",
      ],
      disadvantages: [
        "أبطأ من AES بحوالي 2-3 مرات",
        "يستهلك ذاكرة أكثر",
        "أقل دعماً في الأجهزة",
        "أكثر تعقيداً في التطبيق",
      ],
      useCases: [
        "التطبيقات العسكرية والاستخباراتية",
        "حماية البيانات فائقة الحساسية",
        "الأنظمة التي تتطلب أمان طويل المدى",
        "التشفير في البيئات عالية المخاطر",
        "النسخ الاحتياطية طويلة المدى",
        "الأنظمة الحكومية المصنفة",
      ],
      cryptanalysisResistance: {
        bruteForce: "2^256 محاولة - مستحيل عملياً",
        differential: "مقاوم بقوة فائقة - 32 جولة توفر حماية مطلقة",
        linear: "مقاوم بقوة فائقة - تصميم مخصص لمقاومة التحليل الخطي",
        algebraic: "مقاوم جداً - تعقيد S-Boxes يمنع التحليل الجبري",
      },
    };
  }

  /**
   * توسيع المفتا�� لجميع الجولات
   */
  private expandKey(key: BufferLike): Uint32Array {
    const w = new Uint32Array(140); // 132 round keys + 8 initial keys
    const keyData = key instanceof BufferPolyfill ? key.toUint8Array() : key;

    // تحويل المفتاح إلى كلمات 32-bit
    for (let i = 0; i < 8; i++) {
      w[i] =
        keyData[i * 4] |
        (keyData[i * 4 + 1] << 8) |
        (keyData[i * 4 + 2] << 16) |
        (keyData[i * 4 + 3] << 24);
    }

    // إذا كان المفتاح أقل من 256 بت، امتداد بـ padding
    if (keyData.length < 32) {
      w[Math.floor(keyData.length / 4)] = 0x00000001;
      for (let i = Math.ceil(keyData.length / 4) + 1; i < 8; i++) {
        w[i] = 0;
      }
    }

    // توليد 132 كلمة إضافية
    for (let i = 8; i < 140; i++) {
      w[i] = this.rotateLeft(
        w[i - 8] ^ w[i - 5] ^ w[i - 3] ^ w[i - 1] ^ SerpentCipher.PHI ^ (i - 8),
        11,
      );
    }

    // تطبيق S-Boxes على المفاتيح
    const roundKeys = new Uint32Array(132);
    for (let i = 0; i < 33; i++) {
      const sboxIndex = (32 - i) % 8;
      const k = i * 4;

      for (let j = 0; j < 4; j++) {
        const word = w[k + j + 8];
        roundKeys[k + j] = this.applySBoxToWord(word, sboxIndex);
      }
    }

    return roundKeys;
  }

  /**
   * تشفير بلوك واحد
   */
  private encryptBlock(block: BufferLike): BufferLike {
    const blockData =
      block instanceof BufferPolyfill ? block.toUint8Array() : block;
    let x = [
      blockData[0] |
        (blockData[1] << 8) |
        (blockData[2] << 16) |
        (blockData[3] << 24),
      blockData[4] |
        (blockData[5] << 8) |
        (blockData[6] << 16) |
        (blockData[7] << 24),
      blockData[8] |
        (blockData[9] << 8) |
        (blockData[10] << 16) |
        (blockData[11] << 24),
      blockData[12] |
        (blockData[13] << 8) |
        (blockData[14] << 16) |
        (blockData[15] << 24),
    ];

    // 31 جولة أولى
    for (let round = 0; round < 31; round++) {
      // إضافة مفتاح الجولة
      x[0] ^= this.roundKeys[round * 4];
      x[1] ^= this.roundKeys[round * 4 + 1];
      x[2] ^= this.roundKeys[round * 4 + 2];
      x[3] ^= this.roundKeys[round * 4 + 3];

      // تطبيق S-Box
      x = this.applySBox(x, round % 8);

      // التحويل الخطي
      x = this.linearTransform(x);
    }

    // الجولة الأخيرة (بدون تحويل خطي)
    x[0] ^= this.roundKeys[31 * 4];
    x[1] ^= this.roundKeys[31 * 4 + 1];
    x[2] ^= this.roundKeys[31 * 4 + 2];
    x[3] ^= this.roundKeys[31 * 4 + 3];

    x = this.applySBox(x, 31 % 8);

    // إضافة المفتاح النهائي
    x[0] ^= this.roundKeys[32 * 4];
    x[1] ^= this.roundKeys[32 * 4 + 1];
    x[2] ^= this.roundKeys[32 * 4 + 2];
    x[3] ^= this.roundKeys[32 * 4 + 3];

    const result = new Uint8Array(16);
    result[0] = x[0] & 0xff;
    result[1] = (x[0] >>> 8) & 0xff;
    result[2] = (x[0] >>> 16) & 0xff;
    result[3] = (x[0] >>> 24) & 0xff;
    result[4] = x[1] & 0xff;
    result[5] = (x[1] >>> 8) & 0xff;
    result[6] = (x[1] >>> 16) & 0xff;
    result[7] = (x[1] >>> 24) & 0xff;
    result[8] = x[2] & 0xff;
    result[9] = (x[2] >>> 8) & 0xff;
    result[10] = (x[2] >>> 16) & 0xff;
    result[11] = (x[2] >>> 24) & 0xff;
    result[12] = x[3] & 0xff;
    result[13] = (x[3] >>> 8) & 0xff;
    result[14] = (x[3] >>> 16) & 0xff;
    result[15] = (x[3] >>> 24) & 0xff;

    return createBuffer(result);
  }

  /**
   * فك تشفير بلوك واحد
   */
  private decryptBlock(block: BufferLike): BufferLike {
    const blockData =
      block instanceof BufferPolyfill ? block.toUint8Array() : block;
    let x = [
      blockData[0] |
        (blockData[1] << 8) |
        (blockData[2] << 16) |
        (blockData[3] << 24),
      blockData[4] |
        (blockData[5] << 8) |
        (blockData[6] << 16) |
        (blockData[7] << 24),
      blockData[8] |
        (blockData[9] << 8) |
        (blockData[10] << 16) |
        (blockData[11] << 24),
      blockData[12] |
        (blockData[13] << 8) |
        (blockData[14] << 16) |
        (blockData[15] << 24),
    ];

    // إزالة المفتاح النهائي
    x[0] ^= this.roundKeys[32 * 4];
    x[1] ^= this.roundKeys[32 * 4 + 1];
    x[2] ^= this.roundKeys[32 * 4 + 2];
    x[3] ^= this.roundKeys[32 * 4 + 3];

    // تطبيق S-Box العكسي
    x = this.applyInvSBox(x, 31 % 8);

    // إزالة مفتاح الجولة الأخيرة
    x[0] ^= this.roundKeys[31 * 4];
    x[1] ^= this.roundKeys[31 * 4 + 1];
    x[2] ^= this.roundKeys[31 * 4 + 2];
    x[3] ^= this.roundKeys[31 * 4 + 3];

    // 31 جولة عكسية
    for (let round = 30; round >= 0; round--) {
      // التحويل الخطي العكسي
      x = this.invLinearTransform(x);

      // تطبيق S-Box العكسي
      x = this.applyInvSBox(x, round % 8);

      // إزالة مفتاح الجولة
      x[0] ^= this.roundKeys[round * 4];
      x[1] ^= this.roundKeys[round * 4 + 1];
      x[2] ^= this.roundKeys[round * 4 + 2];
      x[3] ^= this.roundKeys[round * 4 + 3];
    }

    const result = new Uint8Array(16);
    result[0] = x[0] & 0xff;
    result[1] = (x[0] >>> 8) & 0xff;
    result[2] = (x[0] >>> 16) & 0xff;
    result[3] = (x[0] >>> 24) & 0xff;
    result[4] = x[1] & 0xff;
    result[5] = (x[1] >>> 8) & 0xff;
    result[6] = (x[1] >>> 16) & 0xff;
    result[7] = (x[1] >>> 24) & 0xff;
    result[8] = x[2] & 0xff;
    result[9] = (x[2] >>> 8) & 0xff;
    result[10] = (x[2] >>> 16) & 0xff;
    result[11] = (x[2] >>> 24) & 0xff;
    result[12] = x[3] & 0xff;
    result[13] = (x[3] >>> 8) & 0xff;
    result[14] = (x[3] >>> 16) & 0xff;
    result[15] = (x[3] >>> 24) & 0xff;

    return createBuffer(result);
  }

  /**
   * تطبيق S-Box
   */
  private applySBox(x: number[], sboxIndex: number): number[] {
    const result = [0, 0, 0, 0];
    const sbox = SerpentCipher.SBOXES[sboxIndex];

    for (let i = 0; i < 32; i++) {
      const input =
        ((x[0] >>> i) & 1) |
        (((x[1] >>> i) & 1) << 1) |
        (((x[2] >>> i) & 1) << 2) |
        (((x[3] >>> i) & 1) << 3);

      const output = sbox[input];

      result[0] |= (output & 1) << i;
      result[1] |= ((output >>> 1) & 1) << i;
      result[2] |= ((output >>> 2) & 1) << i;
      result[3] |= ((output >>> 3) & 1) << i;
    }

    return result;
  }

  /**
   * تطبيق S-Box العكسي
   */
  private applyInvSBox(x: number[], sboxIndex: number): number[] {
    const result = [0, 0, 0, 0];
    const invSbox = SerpentCipher.INV_SBOXES[sboxIndex];

    for (let i = 0; i < 32; i++) {
      const input =
        ((x[0] >>> i) & 1) |
        (((x[1] >>> i) & 1) << 1) |
        (((x[2] >>> i) & 1) << 2) |
        (((x[3] >>> i) & 1) << 3);

      const output = invSbox[input];

      result[0] |= (output & 1) << i;
      result[1] |= ((output >>> 1) & 1) << i;
      result[2] |= ((output >>> 2) & 1) << i;
      result[3] |= ((output >>> 3) & 1) << i;
    }

    return result;
  }

  /**
   * التحويل الخطي
   */
  private linearTransform(x: number[]): number[] {
    x[0] = this.rotateLeft(x[0], 13);
    x[2] = this.rotateLeft(x[2], 3);
    x[1] = x[1] ^ x[0] ^ x[2];
    x[3] = x[3] ^ x[2] ^ (x[0] << 3);
    x[1] = this.rotateLeft(x[1], 1);
    x[3] = this.rotateLeft(x[3], 7);
    x[0] = x[0] ^ x[1] ^ x[3];
    x[2] = x[2] ^ x[3] ^ (x[1] << 7);
    x[0] = this.rotateLeft(x[0], 5);
    x[2] = this.rotateLeft(x[2], 22);

    return x;
  }

  /**
   * التحويل الخطي العكسي
   */
  private invLinearTransform(x: number[]): number[] {
    x[2] = this.rotateRight(x[2], 22);
    x[0] = this.rotateRight(x[0], 5);
    x[2] = x[2] ^ x[3] ^ (x[1] << 7);
    x[0] = x[0] ^ x[1] ^ x[3];
    x[3] = this.rotateRight(x[3], 7);
    x[1] = this.rotateRight(x[1], 1);
    x[3] = x[3] ^ x[2] ^ (x[0] << 3);
    x[1] = x[1] ^ x[0] ^ x[2];
    x[2] = this.rotateRight(x[2], 3);
    x[0] = this.rotateRight(x[0], 13);

    return x;
  }

  /**
   * تطبيق S-Box على كلمة 32-bit
   */
  private applySBoxToWord(word: number, sboxIndex: number): number {
    const sbox = SerpentCipher.SBOXES[sboxIndex];
    let result = 0;

    for (let i = 0; i < 8; i++) {
      const nibble = (word >>> (i * 4)) & 0xf;
      result |= sbox[nibble] << (i * 4);
    }

    return result;
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
