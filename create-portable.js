#!/usr/bin/env node

/**
 * KnouxCrypt™ 2025 - إنشاء حزمة محمولة
 * يقوم بإنشاء ملف تطبيق محمول يمكن تشغيله بدون تثبيت
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🔐 KnouxCrypt™ 2025 - إنشاء التطبيق المحمول");
console.log("=".repeat(50));

// معلومات التطبيق
const APP_INFO = {
  name: "KnouxCrypt™ 2025",
  version: "2025.1.0",
  description: "نظام التشفير العسكري المتقدم",
  author: "Knoux Technologies",
  executable: "KnouxCrypt-2025-Portable.exe",
};

// إنشاء مجلد التوزيع
function createDistributionFolder() {
  const distDir = path.join(process.cwd(), "portable-dist");

  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }

  fs.mkdirSync(distDir, { recursive: true });
  console.log(`📁 تم إنشاء مجلد التوزيع: ${distDir}`);

  return distDir;
}

// نسخ ملفات التطبيق
function copyAppFiles(distDir) {
  console.log("📋 نسخ ملفات التطبيق...");

  // نسخ ملفات البناء
  const buildDir = path.join(process.cwd(), "build");
  if (fs.existsSync(buildDir)) {
    const appDir = path.join(distDir, "app");
    fs.mkdirSync(appDir, { recursive: true });
    copyDirectory(buildDir, appDir);
    console.log("✅ تم نسخ ملفات التطبيق");
  } else {
    console.error("❌ مجلد البناء غير موجود. يرجى تشغيل npm run build أولاً");
    process.exit(1);
  }

  // نسخ ملفات Electron
  const electronDir = path.join(process.cwd(), "electron");
  if (fs.existsSync(electronDir)) {
    const electronDistDir = path.join(distDir, "electron");
    fs.mkdirSync(electronDistDir, { recursive: true });
    copyDirectory(electronDir, electronDistDir);
    console.log("✅ تم نسخ ملفات Electron");
  }
}

// نسخ مجلد بأكمله
function copyDirectory(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// إنشاء ملف تشغيل Windows
function createWindowsExecutable(distDir) {
  console.log("🪟 إنشاء ملف تشغيل Windows...");

  const batchContent = `@echo off
title ${APP_INFO.name}
echo.
echo ==========================================
echo    ${APP_INFO.name}
echo    ${APP_INFO.description}
echo    الإصدار: ${APP_INFO.version}
echo ==========================================
echo.

REM فحص Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js غير مثبت على النظام
    echo يرجى تنزيل وتثبيت Node.js من: https://nodejs.org/
    pause
    exit /b 1
)

REM عرض إصدار Node.js
echo ✅ Node.js متاح
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo 📌 إصدار Node.js: %NODE_VERSION%
echo.

REM ال��حقق من ملفات التطبيق
if not exist "app\\index.html" (
    echo ❌ ملفات التطبيق غير موجودة
    pause
    exit /b 1
)

echo 🚀 بدء تشغيل ${APP_INFO.name}...
echo.

REM بدء خادم محلي بسيط
cd /d "%~dp0"
echo 🌐 تشغيل الخادم المحلي على http://localhost:3000
echo 🔐 اضغط Ctrl+C لإيقاف التطبيق
echo.

REM استخدام Python كخادم بديل إذا كان متاحاً
where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo 🐍 استخدام Python كخادم...
    cd app
    python -m http.server 3000
) else (
    where npx >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo 📦 استخدام serve...
        npx serve app -l 3000
    ) else (
        echo ❌ لا يمكن العثور على خادم مناسب
        echo يرجى تثبيت Python أو npm
        pause
        exit /b 1
    )
)

pause
`;

  const batPath = path.join(distDir, "start-knouxcrypt.bat");
  fs.writeFileSync(batPath, batchContent, "utf8");
  console.log("✅ تم إنشاء ملف التشغيل Windows (.bat)");
}

// إنشاء ملف تشغيل Linux/Mac
function createUnixExecutable(distDir) {
  console.log("🐧 إنشاء ملف تشغيل Unix...");

  const shellContent = `#!/bin/bash

echo "=========================================="
echo "    ${APP_INFO.name}"
echo "    ${APP_INFO.description}"
echo "    الإصدار: ${APP_INFO.version}"
echo "=========================================="
echo ""

# فحص Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js غير مثبت على النظام"
    echo "يرجى تثبيت Node.js من: https://nodejs.org/"
    read -p "اضغط Enter للمتابعة..."
    exit 1
fi

echo "✅ Node.js متاح"
echo "📌 إصدار Node.js: $(node --version)"
echo ""

# التحقق من ملفات التطبيق
if [ ! -f "app/index.html" ]; then
    echo "❌ ملفات التطبيق غير موجودة"
    read -p "اضغط Enter للمتابعة..."
    exit 1
fi

echo "🚀 بدء تشغيل ${APP_INFO.name}..."
echo ""

# الانتقال لمجلد التطبيق
cd "$(dirname "$0")"

echo "🌐 تشغيل الخادم المحلي على http://localhost:3000"
echo "🔐 اضغط Ctrl+C لإيقاف التطبيق"
echo ""

# استخدام Python كخادم بديل إذا كان متاحاً
if command -v python3 &> /dev/null; then
    echo "🐍 استخدام Python كخادم..."
    cd app
    python3 -m http.server 3000
elif command -v python &> /dev/null; then
    echo "🐍 استخدام Python كخادم..."
    cd app
    python -m http.server 3000
elif command -v npx &> /dev/null; then
    echo "📦 استخدام serve..."
    npx serve app -l 3000
else
    echo "❌ لا يمكن العثور على خادم مناسب"
    echo "يرجى تثبيت Python أو npm"
    read -p "اضغط Enter للمتابعة..."
    exit 1
fi
`;

  const shPath = path.join(distDir, "start-knouxcrypt.sh");
  fs.writeFileSync(shPath, shellContent, "utf8");

  // جعل الملف قابل للتنفيذ
  try {
    fs.chmodSync(shPath, "755");
  } catch (error) {
    console.warn("⚠️ لا يمكن تعيين صلاحيات التنفيذ للملف Unix");
  }

  console.log("✅ تم إنشاء ملف التشغيل Unix (.sh)");
}

// إنشاء ملف README
function createReadme(distDir) {
  console.log("📖 إنشاء ملف التعليمات...");

  const readmeContent = `# ${APP_INFO.name} - الإصدار المحمول

${APP_INFO.description}

## التشغيل

### Windows:
انقر نقراً مزدوجاً على \`start-knouxcrypt.bat\`

### Linux/Mac:
تشغيل في الطرفية:
\`\`\`bash
./start-knouxcrypt.sh
\`\`\`

## المتطلبات

- Node.js (الإصدار 16 أو أحدث)
- متصفح ويب حديث
- Python (اختياري، كخادم بديل)

## كيفية الاستخدام

1. تشغيل ملف البدء المناسب لنظامك
2. انتظار تحميل الخادم المحلي
3. فتح المتصفح على http://localhost:3000
4. استخدام التطبيق بشكل طبيعي

## الميزات

- ✅ تشفير الملفات بخوارزميات متقدمة
- ✅ واجهة مستخدم عصرية
- ✅ نظام إدارة الأقراص
- ✅ مساعد ذكي للأمان
- ✅ مقاوم للكمبيوتر الكمي

## الدعم

البريد الإلكتروني: support@knouxcrypt.com
الموقع: https://knouxcrypt.com

---

© 2025 ${APP_INFO.author}. جميع الحقوق محفوظة.

الإصدار: ${APP_INFO.version}
تاريخ البناء: ${new Date().toISOString().split("T")[0]}
`;

  const readmePath = path.join(distDir, "README.txt");
  fs.writeFileSync(readmePath, readmeContent, "utf8");
  console.log("✅ تم إنشاء ملف التعليمات");
}

// إنشاء ملف معلومات النظام
function createSystemInfo(distDir) {
  console.log("ℹ️ إنشاء ملف معلومات النظام...");

  const systemInfo = {
    app: APP_INFO,
    build: {
      date: new Date().toISOString(),
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
    },
    requirements: {
      nodejs: ">=16.0.0",
      browser: "Chrome/Firefox/Safari/Edge (آخر إصدار)",
      ram: "2GB كحد أدنى، 4GB مُوصى به",
      storage: "500MB مساحة خالية",
    },
  };

  const infoPath = path.join(distDir, "system-info.json");
  fs.writeFileSync(infoPath, JSON.stringify(systemInfo, null, 2), "utf8");
  console.log("✅ تم إنشاء ملف معلومات النظام");
}

// ضغط الحزمة (اختياري)
function createArchive(distDir) {
  console.log("📦 إنشاء أرشيف مضغوط...");

  try {
    const archiveName = `KnouxCrypt-2025-Portable-v${APP_INFO.version}.zip`;
    const archivePath = path.join(process.cwd(), archiveName);

    // محاولة استخدام zip إذا كان متاحاً
    execSync(`cd "${distDir}" && zip -r "${archivePath}" .`, {
      stdio: "inherit",
    });
    console.log(`✅ تم إنشاء الأرشيف: ${archiveName}`);
  } catch (error) {
    console.log("⚠️ لا يمكن إنشاء أرشيف مضغوط، لكن الملفات جاهزة في المجلد");
  }
}

// البرنامج الرئيسي
function main() {
  try {
    console.log("🔧 بدء إنشاء الحزمة المحمولة...");

    const distDir = createDistributionFolder();
    copyAppFiles(distDir);
    createWindowsExecutable(distDir);
    createUnixExecutable(distDir);
    createReadme(distDir);
    createSystemInfo(distDir);

    console.log("\n✅ تم إنشاء التطبيق المحمول بنجاح!");
    console.log("=".repeat(50));
    console.log(`📁 مجلد التوزيع: ${distDir}`);
    console.log(`🗂️ حجم التطبيق: ${calculateDirectorySize(distDir)} MB`);

    console.log("\n📋 محتويات الحزمة:");
    const files = fs.readdirSync(distDir);
    files.forEach((file) => {
      console.log(`   📄 ${file}`);
    });

    console.log("\n🚀 لتشغيل التطبيق:");
    console.log("   Windows: انقر نقراً مزدوجاً على start-knouxcrypt.bat");
    console.log("   Linux/Mac: ./start-knouxcrypt.sh");

    // محاولة إنشاء أرشيف
    createArchive(distDir);
  } catch (error) {
    console.error(`❌ خطأ: ${error.message}`);
    process.exit(1);
  }
}

// حساب حجم المجلد
function calculateDirectorySize(dirPath) {
  let totalSize = 0;

  function getSize(itemPath) {
    try {
      const stats = fs.statSync(itemPath);
      if (stats.isDirectory()) {
        const items = fs.readdirSync(itemPath);
        items.forEach((item) => {
          getSize(path.join(itemPath, item));
        });
      } else {
        totalSize += stats.size;
      }
    } catch (error) {
      // تجاهل الأخطاء
    }
  }

  getSize(dirPath);
  return (totalSize / 1024 / 1024).toFixed(2);
}

// تشغيل البرنامج
if (require.main === module) {
  main();
}

module.exports = { main };
