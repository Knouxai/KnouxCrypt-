/**
 * Browser-compatible Buffer polyfill for KnouxCrypt™
 * بديل Buffer متوافق مع المتصفحات
 */

// Simple Buffer polyfill that mimics basic Buffer functionality
export class BufferPolyfill {
  private data: Uint8Array;

  constructor(
    data: Uint8Array | ArrayBuffer | number[] | string,
    encoding?: string,
  ) {
    if (typeof data === "string") {
      if (encoding === "hex") {
        this.data = this.hexToUint8Array(data);
      } else {
        // Default to UTF-8
        this.data = new TextEncoder().encode(data);
      }
    } else if (data instanceof ArrayBuffer) {
      this.data = new Uint8Array(data);
    } else if (Array.isArray(data)) {
      this.data = new Uint8Array(data);
    } else {
      this.data = new Uint8Array(data);
    }
  }

  static from(
    data: Uint8Array | ArrayBuffer | number[] | string,
    encoding?: string,
  ): BufferPolyfill {
    return new BufferPolyfill(data, encoding);
  }

  static alloc(size: number, fill?: number): BufferPolyfill {
    const array = new Uint8Array(size);
    if (fill !== undefined) {
      array.fill(fill);
    }
    return new BufferPolyfill(array);
  }

  get length(): number {
    return this.data.length;
  }

  slice(start?: number, end?: number): BufferPolyfill {
    return new BufferPolyfill(this.data.slice(start, end));
  }

  toString(encoding?: string): string {
    if (encoding === "hex") {
      return Array.from(this.data)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
    } else {
      // Default to UTF-8
      return new TextDecoder().decode(this.data);
    }
  }

  equals(other: BufferPolyfill): boolean {
    if (this.length !== other.length) return false;
    for (let i = 0; i < this.length; i++) {
      if (this.data[i] !== other.data[i]) return false;
    }
    return true;
  }

  // Array-like access
  [index: number]: number;

  // Make it iterable
  *[Symbol.iterator]() {
    for (let i = 0; i < this.data.length; i++) {
      yield this.data[i];
    }
  }

  // Convert to Uint8Array
  toUint8Array(): Uint8Array {
    return this.data;
  }

  private hexToUint8Array(hex: string): Uint8Array {
    const result = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      result[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return result;
  }
}

// Create a Proxy to handle array-like access
export function createBuffer(
  data: Uint8Array | ArrayBuffer | number[] | string,
  encoding?: string,
): any {
  const buffer = new BufferPolyfill(data, encoding);

  return new Proxy(buffer, {
    get(target: BufferPolyfill, prop: string | symbol) {
      if (typeof prop === "string" && /^\d+$/.test(prop)) {
        const index = parseInt(prop);
        return target.toUint8Array()[index];
      }
      return (target as any)[prop];
    },

    set(target: BufferPolyfill, prop: string | symbol, value: any) {
      if (typeof prop === "string" && /^\d+$/.test(prop)) {
        const index = parseInt(prop);
        target.toUint8Array()[index] = value;
        return true;
      }
      (target as any)[prop] = value;
      return true;
    },
  });
}

// Global Buffer polyfill for browser environment
if (
  typeof window !== "undefined" &&
  typeof (window as any).Buffer === "undefined"
) {
  (window as any).Buffer = {
    from: (data: any, encoding?: string) => createBuffer(data, encoding),
    alloc: (size: number, fill?: number) =>
      createBuffer(new Uint8Array(size).fill(fill || 0)),
    isBuffer: (obj: any) => obj instanceof BufferPolyfill,
  };
}

export default BufferPolyfill;
