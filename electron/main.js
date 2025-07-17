/**
 * KnouxCrypt™ 2025 - Electron Main Process
 * العملية الرئيسية لتطبيق سطح المكتب
 */

const {
  app,
  BrowserWindow,
  Menu,
  Tray,
  dialog,
  shell,
  ipcMain,
  protocol,
  nativeTheme,
} = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const isDev = require("electron-is-dev");
const { spawn } = require("child_process");

// تكوين التطبيق
const APP_CONFIG = {
  name: "KnouxCrypt™ 2025",
  version: "2025.1.0",
  description: "نظام التشفير العسكري المتقدم",
  author: "Knoux Technologies",
  minWidth: 1200,
  minHeight: 800,
  defaultWidth: 1400,
  defaultHeight: 1000,
};

// متغيرات ع��مة
let mainWindow = null;
let splashWindow = null;
let tray = null;
let isQuitting = false;
let devServer = null;

/**
 * إنشاء نافذة البداية (Splash Screen)
 */
function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 600,
    height: 400,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "assets", "icon.png"),
  });

  // تحميل صفحة البداية
  if (isDev) {
    splashWindow.loadFile(path.join(__dirname, "splash.html"));
  } else {
    splashWindow.loadFile(path.join(__dirname, "..", "build", "splash.html"));
  }

  // إخفاء النافذة بعد 3 ثوان
  setTimeout(() => {
    if (splashWindow) {
      splashWindow.close();
      splashWindow = null;
      createMainWindow();
    }
  }, 3000);
}

/**
 * إنشاء النافذة الرئيسية
 */
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: APP_CONFIG.defaultWidth,
    height: APP_CONFIG.defaultHeight,
    minWidth: APP_CONFIG.minWidth,
    minHeight: APP_CONFIG.minHeight,
    show: false,
    frame: false, // إطار مخصص
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 20, y: 20 },
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
      webSecurity: !isDev,
      allowRunningInsecureContent: false,
      experimentalFeatures: false,
    },
    icon: path.join(__dirname, "assets", "icon.png"),
    backgroundColor: "#0F172A", // لون الخلفية المظلم
  });

  // تحميل التطبيق
  const startUrl = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "..", "build", "index.html")}`;

  mainWindow.loadURL(startUrl);

  // إظهار النافذة عند الانتهاء من التحميل
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    // فتح أدوات التطوير في وضع التطوير
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // معالجة إغلاق النافذة
  mainWindow.on("close", (event) => {
    if (!isQuitting && process.platform === "darwin") {
      event.preventDefault();
      mainWindow.hide();
    } else if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      showNotification(
        "KnouxCrypt™ يعمل في الخلفية",
        "انقر على أيقونة الصينية للوصول السريع",
      );
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // منع التنقل الخارجي
  mainWindow.webContents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    if (parsedUrl.origin !== startUrl) {
      event.preventDefault();
      shell.openExternal(navigationUrl);
    }
  });

  // معالجة الروابط الجديدة
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  // إعداد القائمة
  setupMenu();

  // إعداد صينية النظام
  setupSystemTray();

  // إعداد اختصارات لوحة المفاتيح العامة
  setupGlobalShortcuts();
}

/**
 * إعداد صينية النظام
 */
function setupSystemTray() {
  const iconPath = path.join(__dirname, "assets", "tray-icon.png");
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "KnouxCrypt™ 2025",
      enabled: false,
      icon: path.join(__dirname, "assets", "menu-icon.png"),
    },
    { type: "separator" },
    {
      label: "🏠 إظهار النافذة الرئيسية",
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    {
      label: "🔒 تشفير سريع",
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.webContents.send("quick-encrypt");
        }
      },
    },
    {
      label: "🔍 فحص النظام",
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.webContents.send("system-scan");
        }
      },
    },
    { type: "separator" },
    {
      label: "⚙️ الإعدادات",
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.webContents.send("open-settings");
        }
      },
    },
    {
      label: "ℹ️ حول البرنامج",
      click: () => {
        showAboutDialog();
      },
    },
    { type: "separator" },
    {
      label: "🚪 إنهاء البرنامج",
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip("KnouxCrypt™ 2025 - نظام التشفير العسكري");
  tray.setContextMenu(contextMenu);

  // نقرة مزدوجة لإظهار النافذة
  tray.on("double-click", () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

/**
 * إعداد القائمة الرئيسية
 */
function setupMenu() {
  const template = [
    {
      label: "ملف",
      submenu: [
        {
          label: "تشفير ملف جديد",
          accelerator: "CmdOrCtrl+N",
          click: () => mainWindow?.webContents.send("encrypt-new-file"),
        },
        {
          label: "فتح ملف مشفر",
          accelerator: "CmdOrCtrl+O",
          click: () => mainWindow?.webContents.send("open-encrypted-file"),
        },
        { type: "separator" },
        {
          label: "حفظ",
          accelerator: "CmdOrCtrl+S",
          click: () => mainWindow?.webContents.send("save-current"),
        },
        { type: "separator" },
        {
          label: "إنهاء",
          accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
          click: () => {
            isQuitting = true;
            app.quit();
          },
        },
      ],
    },
    {
      label: "تحرير",
      submenu: [
        { label: "تراجع", accelerator: "CmdOrCtrl+Z", role: "undo" },
        { label: "إعادة", accelerator: "Shift+CmdOrCtrl+Z", role: "redo" },
        { type: "separator" },
        { label: "قص", accelerator: "CmdOrCtrl+X", role: "cut" },
        { label: "نسخ", accelerator: "CmdOrCtrl+C", role: "copy" },
        { label: "لصق", accelerator: "CmdOrCtrl+V", role: "paste" },
        { label: "تحديد الكل", accelerator: "CmdOrCtrl+A", role: "selectall" },
      ],
    },
    {
      label: "عرض",
      submenu: [
        {
          label: "إعادة تحميل",
          accelerator: "CmdOrCtrl+R",
          click: () => mainWindow?.reload(),
        },
        {
          label: "تبديل أدوات التطوير",
          accelerator:
            process.platform === "darwin" ? "Alt+Cmd+I" : "Ctrl+Shift+I",
          click: () => mainWindow?.webContents.toggleDevTools(),
        },
        { type: "separator" },
        { label: "تكبير فعلي", accelerator: "CmdOrCtrl+0", role: "resetzoom" },
        { label: "تكبير", accelerator: "CmdOrCtrl+Plus", role: "zoomin" },
        { label: "تصغير", accelerator: "CmdOrCtrl+-", role: "zoomout" },
        { type: "separator" },
        { label: "ملء الشاشة", accelerator: "F11", role: "togglefullscreen" },
      ],
    },
    {
      label: "نافذة",
      submenu: [
        { label: "تصغير", accelerator: "CmdOrCtrl+M", role: "minimize" },
        { label: "إغلاق", accelerator: "CmdOrCtrl+W", role: "close" },
      ],
    },
    {
      label: "مساعدة",
      submenu: [
        {
          label: "حول KnouxCrypt™",
          click: () => showAboutDialog(),
        },
        {
          label: "اختصارات لوحة المفاتيح",
          accelerator: "F1",
          click: () => mainWindow?.webContents.send("show-shortcuts"),
        },
        {
          label: "التحقق من التحديثات",
          click: () => checkForUpdates(),
        },
        { type: "separator" },
        {
          label: "موقع الويب",
          click: () => shell.openExternal("https://knouxcrypt.com"),
        },
        {
          label: "الدعم التقني",
          click: () => shell.openExternal("mailto:support@knouxcrypt.com"),
        },
      ],
    },
  ];

  // تخصيص القائمة لـ macOS
  if (process.platform === "darwin") {
    template.unshift({
      label: APP_CONFIG.name,
      submenu: [
        { label: `حول ${APP_CONFIG.name}`, role: "about" },
        { type: "separator" },
        { label: "الخدمات", role: "services", submenu: [] },
        { type: "separator" },
        {
          label: `إخفاء ${APP_CONFIG.name}`,
          accelerator: "Command+H",
          role: "hide",
        },
        {
          label: "إخفاء الآخرين",
          accelerator: "Command+Shift+H",
          role: "hideothers",
        },
        { label: "إظهار الكل", role: "unhide" },
        { type: "separator" },
        { label: "إنهاء", accelerator: "Command+Q", click: () => app.quit() },
      ],
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

/**
 * إعداد اختصارات لوحة المفاتيح العامة
 */
function setupGlobalShortcuts() {
  const { globalShortcut } = require("electron");

  // اختصار إظهار/إخفاء النافذة
  globalShortcut.register("CommandOrControl+Shift+K", () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });

  // اختصار تشفير سريع
  globalShortcut.register("CommandOrControl+Shift+E", () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.webContents.send("quick-encrypt");
    }
  });
}

/**
 * عرض نافذة حول البرنامج
 */
function showAboutDialog() {
  dialog.showMessageBox(mainWindow, {
    type: "info",
    title: "حول KnouxCrypt™ 2025",
    message: APP_CONFIG.name,
    detail: `الإصدار: ${APP_CONFIG.version}\n${APP_CONFIG.description}\n\nطور بواسطة: ${APP_CONFIG.author}\n\n© 2025 ��ميع الحقوق محفوظة`,
    icon: path.join(__dirname, "assets", "icon.png"),
    buttons: ["موافق"],
  });
}

/**
 * إظهار إشعار النظام
 */
function showNotification(title, body) {
  const { Notification } = require("electron");

  if (Notification.isSupported()) {
    new Notification({
      title: title,
      body: body,
      icon: path.join(__dirname, "assets", "icon.png"),
    }).show();
  }
}

/**
 * التحقق من التحديثات
 */
function checkForUpdates() {
  autoUpdater.checkForUpdatesAndNotify();
}

/**
 * إعداد التحديث التلقائي
 */
function setupAutoUpdater() {
  autoUpdater.on("checking-for-update", () => {
    console.log("جاري البحث عن تحديثات...");
  });

  autoUpdater.on("update-available", () => {
    dialog.showMessageBox(mainWindow, {
      type: "info",
      title: "تحديث متاح",
      message: "يتوفر إصدار جديد من KnouxCrypt™",
      detail: "سيتم تنزيل التحديث في الخلفية وسيتم إشعارك عند الانتهاء.",
      buttons: ["موافق"],
    });
  });

  autoUpdater.on("update-downloaded", () => {
    dialog
      .showMessageBox(mainWindow, {
        type: "info",
        title: "التحديث جاهز",
        message: "تم تنزيل التحديث وهو جاهز للتثبيت",
        detail: "سيتم إعادة تشغيل التطبيق لتطبيق التحديث.",
        buttons: ["إعادة التشغيل الآن", "لاحقاً"],
      })
      .then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
  });
}

/**
 * بدء خادم التطوير
 */
function startDevServer() {
  if (isDev) {
    console.log("بدء خادم التطوير...");
    devServer = spawn("npm", ["run", "dev"], {
      stdio: "inherit",
      shell: true,
      cwd: path.join(__dirname, ".."),
    });

    devServer.on("error", (error) => {
      console.error("خطأ في خادم التطوير:", error);
    });
  }
}

/**
 * أحداث التطبيق الرئيسية
 */
app.whenReady().then(() => {
  // إعداد البروتوكولات المخصصة
  protocol.registerFileProtocol("knouxcrypt", (request, callback) => {
    const url = request.url.substr(12);
    callback({ path: path.normalize(`${__dirname}/${url}`) });
  });

  // بدء خادم التطوير
  if (isDev) {
    startDevServer();

    // انتظار بدء الخادم
    setTimeout(() => {
      createSplashWindow();
    }, 2000);
  } else {
    createSplashWindow();
  }

  // إعداد التحديث التلقائي
  setupAutoUpdater();

  // للنظم التي تدعم dock
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    } else if (mainWindow) {
      mainWindow.show();
    }
  });
});

// إنهاء التطبيق عند إغلاق جميع النوافذ
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// معالجة الإنهاء
app.on("before-quit", () => {
  isQuitting = true;

  // إنهاء خادم التطوير
  if (devServer) {
    devServer.kill();
  }
});

// تنظيف الموارد
app.on("will-quit", () => {
  const { globalShortcut } = require("electron");
  globalShortcut.unregisterAll();
});

// معالجة الأخطاء غير المتوقعة
process.on("uncaughtException", (error) => {
  console.error("خطأ غير متوقع:", error);
  dialog.showErrorBox("خطأ في التطبيق", `حدث خطأ غير متوقع:\n${error.message}`);
});

/**
 * معالجات IPC للتواصل مع العملية الفرعية
 */
ipcMain.handle("app-version", () => APP_CONFIG.version);
ipcMain.handle("app-name", () => APP_CONFIG.name);
ipcMain.handle("is-dev", () => isDev);

ipcMain.handle("show-save-dialog", async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow, options);
  return result;
});

ipcMain.handle("show-open-dialog", async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result;
});

ipcMain.handle("show-message-box", async (event, options) => {
  const result = await dialog.showMessageBox(mainWindow, options);
  return result;
});

// إدارة النوافذ
ipcMain.handle("window-minimize", () => {
  mainWindow?.minimize();
});

ipcMain.handle("window-maximize", () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.handle("window-close", () => {
  mainWindow?.close();
});

ipcMain.handle("window-is-maximized", () => {
  return mainWindow?.isMaximized();
});

// إشعارات النظام
ipcMain.handle("show-notification", (event, title, body) => {
  showNotification(title, body);
});

module.exports = { app, mainWindow };
