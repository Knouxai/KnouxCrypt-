/**
 * KnouxCrypt™ 2025 - Electron Preload Script
 * سكريبت التحميل المسبق للأمان والتواصل الآمن
 */

const { contextBridge, ipcRenderer } = require("electron");

// تعريف API آمن للتطبيق
const electronAPI = {
  // معلومات التطبيق
  app: {
    getName: () => ipcRenderer.invoke("app-name"),
    getVersion: () => ipcRenderer.invoke("app-version"),
    isDev: () => ipcRenderer.invoke("is-dev"),
  },

  // إدارة النوافذ
  window: {
    minimize: () => ipcRenderer.invoke("window-minimize"),
    maximize: () => ipcRenderer.invoke("window-maximize"),
    close: () => ipcRenderer.invoke("window-close"),
    isMaximized: () => ipcRenderer.invoke("window-is-maximized"),
  },

  // حوارات النظام
  dialog: {
    showSaveDialog: (options) =>
      ipcRenderer.invoke("show-save-dialog", options),
    showOpenDialog: (options) =>
      ipcRenderer.invoke("show-open-dialog", options),
    showMessageBox: (options) =>
      ipcRenderer.invoke("show-message-box", options),
  },

  // إشعارات النظام
  notification: {
    show: (title, body) => ipcRenderer.invoke("show-notification", title, body),
  },

  // استقبال الأحداث من العملية الرئيسية
  on: (channel, callback) => {
    const validChannels = [
      "quick-encrypt",
      "system-scan",
      "open-settings",
      "show-shortcuts",
      "encrypt-new-file",
      "open-encrypted-file",
      "save-current",
    ];

    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, callback);
    }
  },

  // إزالة مستقبلات الأحداث
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },

  // منصة النظام
  platform: process.platform,

  // متغيرات البيئة الآمنة
  env: {
    NODE_ENV: process.env.NODE_ENV,
  },
};

// تصدير API للنافذة بشكل آمن
contextBridge.exposeInMainWorld("electronAPI", electronAPI);

// تصدير معلومات إضافية مفيدة
contextBridge.exposeInMainWorld("knouxcrypt", {
  version: "2025.1.0",
  name: "KnouxCrypt™ 2025",
  description: "نظام التشفير العسكري المتقدم",
  isElectron: true,
  platform: process.platform,
  arch: process.arch,
});

// حماية من التلاعب بالكونسول في الإنتاج
if (process.env.NODE_ENV === "production") {
  // تعطيل الكونسول في الإنتاج
  window.addEventListener("DOMContentLoaded", () => {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
    console.info = () => {};
    console.debug = () => {};
  });
}

// إضافة معلومات الإصدار لـ window
window.addEventListener("DOMContentLoaded", () => {
  // إضافة معرف للتطبيق الإلكتروني
  document.body.classList.add("electron-app");

  // إضافة متغيرات CSS مخصصة
  document.documentElement.style.setProperty("--electron-app", "1");
  document.documentElement.style.setProperty("--platform", process.platform);

  // إضافة شريط العنوان المخصص إذا لم يكن موجوداً
  if (!document.querySelector(".custom-titlebar")) {
    createCustomTitlebar();
  }
});

/**
 * إنشاء شريط عنوان مخصص
 */
function createCustomTitlebar() {
  const titlebar = document.createElement("div");
  titlebar.className = "custom-titlebar";
  titlebar.innerHTML = `
    <div class="titlebar-content">
      <div class="titlebar-title">
        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjNEY0NkU1Ii8+Cjwvc3ZnPgo=" alt="KnouxCrypt">
        <span>KnouxCrypt™ 2025</span>
      </div>
      <div class="titlebar-controls">
        <button class="titlebar-button minimize-btn" title="تصغير">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path d="M2 6h8" stroke="currentColor" stroke-width="1"/>
          </svg>
        </button>
        <button class="titlebar-button maximize-btn" title="تكبير">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <rect x="2" y="2" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1" fill="none"/>
          </svg>
        </button>
        <button class="titlebar-button close-btn" title="إغلاق">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path d="M2 2l8 8M2 10L10 2" stroke="currentColor" stroke-width="1"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  // إضافة الأنماط
  const style = document.createElement("style");
  style.textContent = `
    .custom-titlebar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 32px;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      z-index: 10000;
      -webkit-app-region: drag;
      display: flex;
      align-items: center;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .titlebar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0 16px;
    }

    .titlebar-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
    }

    .titlebar-title img {
      width: 16px;
      height: 16px;
    }

    .titlebar-controls {
      display: flex;
      gap: 8px;
      -webkit-app-region: no-drag;
    }

    .titlebar-button {
      width: 28px;
      height: 20px;
      border: none;
      background: transparent;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .titlebar-button:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .titlebar-button.close-btn:hover {
      background: #ef4444;
      color: white;
    }

    /* تعديل المحتوى الرئيسي لإفساح المجال لشريط العنوان */
    body.electron-app {
      padding-top: 32px;
    }

    /* إخفاء شريط العنوان على macOS */
    body.electron-app.darwin .custom-titlebar {
      display: none;
    }

    body.electron-app.darwin {
      padding-top: 28px;
    }
  `;

  document.head.appendChild(style);
  document.body.insertBefore(titlebar, document.body.firstChild);

  // إضافة مستقبلات الأحداث لأزرار التحكم
  titlebar.querySelector(".minimize-btn")?.addEventListener("click", () => {
    window.electronAPI.window.minimize();
  });

  titlebar.querySelector(".maximize-btn")?.addEventListener("click", () => {
    window.electronAPI.window.maximize();
  });

  titlebar.querySelector(".close-btn")?.addEventListener("click", () => {
    window.electronAPI.window.close();
  });

  // إضافة فئة المنصة
  document.body.classList.add(process.platform);
}

// حماية ضد XSS وحقن التعليمات البرمجية
window.addEventListener("DOMContentLoaded", () => {
  // منع السحب والإفلات للملفات غير المرغوب فيها
  document.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  document.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();

    // معالجة الملفات المسحوبة هنا إذا لزم الأمر
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      // إرسال إشارة للتطبيق الرئيسي
      console.log(
        "ملفات مسحوبة:",
        files.map((f) => f.name),
      );
    }
  });

  // منع الانتقال بـ F5
  document.addEventListener("keydown", (e) => {
    if (e.key === "F5" || (e.ctrlKey && e.key === "r")) {
      e.preventDefault();
    }
  });
});

console.log("🔐 KnouxCrypt™ 2025 - Preload script loaded successfully");
