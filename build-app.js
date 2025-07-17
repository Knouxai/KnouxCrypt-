#!/usr/bin/env node

/**
 * KnouxCrypt™ 2025 - سكريبت البناء المتكامل
 * يقوم ببناء التطبيق وإنشاء ملفات التوزيع
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

console.log("🔐 KnouxCrypt™ 2025 - بناء التطبيق المتكامل");
console.log("=".repeat(50));

const platform = os.platform();
const arch = os.arch();

console.log(`🖥️  النظام: ${platform} (${arch})`);
console.log(`📁 مجلد العمل: ${process.cwd()}`);

// التحقق من البيئة
function checkEnvironment() {
  console.log("\n📋 التحقق من البيئة...");

  try {
    // التحقق من Node.js
    const nodeVersion = execSync("node --version", { encoding: "utf8" }).trim();
    console.log(`✅ Node.js: ${nodeVersion}`);

    // التحقق من npm
    const npmVersion = execSync("npm --version", { encoding: "utf8" }).trim();
    console.log(`✅ npm: ${npmVersion}`);

    // التحقق من package.json
    if (!fs.existsSync("package.json")) {
      throw new Error("ملف package.json غير موجود");
    }
    console.log("✅ package.json موجود");

    // التحقق من مجلد electron
    if (!fs.existsSync("electron")) {
      throw new Error("مجلد electron غير موجود");
    }
    console.log("✅ مجلد Electron موجود");
  } catch (error) {
    console.error(`❌ خطأ في البيئة: ${error.message}`);
    process.exit(1);
  }
}

// تثبيت التبعيات
function installDependencies() {
  console.log("\n📦 تثبيت التبعيات...");

  try {
    execSync("npm install", { stdio: "inherit" });
    console.log("✅ تم تثبيت التبعيات بنجاح");
  } catch (error) {
    console.error("❌ فشل في تثبيت التبعيات");
    process.exit(1);
  }
}

// بناء تطبيق الويب
function buildWebApp() {
  console.log("\n🏗️  بناء تطبيق الويب...");

  try {
    execSync("npm run build", { stdio: "inherit" });
    console.log("✅ تم بناء تطبيق الويب بنجاح");
  } catch (error) {
    console.error("❌ فشل في بناء تطبيق الويب");
    process.exit(1);
  }
}

// إنشاء الأيقونات الناقصة
function generateIcons() {
  console.log("\n🎨 إنشاء الأيقونات...");

  const iconsDir = path.join("electron", "assets");

  // إنشاء أيقونة PNG بسيطة
  const simpleIcon = `data:image/svg+xml;base64,${Buffer.from(
    `
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3B82F6"/>
          <stop offset="100%" style="stop-color:#8B5CF6"/>
        </linearGradient>
      </defs>
      <circle cx="256" cy="256" r="240" fill="url(#grad)"/>
      <rect x="196" y="236" width="120" height="80" rx="15" fill="white"/>
      <path d="M 216,236 C 216,196 236,176 256,176 C 276,176 296,196 296,236" 
            stroke="white" stroke-width="16" fill="none"/>
      <circle cx="256" cy="266" r="12" fill="#3B82F6"/>
      <rect x="252" y="266" width="8" height="20" rx="4" fill="#3B82F6"/>
      <text x="256" y="420" text-anchor="middle" fill="white" font-size="32" font-weight="bold">
        KnouxCrypt™
      </text>
    </svg>
  `,
  ).toString("base64")}`;

  // إنشاء ملفات الأيقونات البديلة
  const iconFiles = {
    "icon.png": simpleIcon,
    "icon.ico": simpleIcon,
    "icon.icns": simpleIcon,
    "tray-icon.png": simpleIcon,
  };

  Object.entries(iconFiles).forEach(([filename, data]) => {
    const iconPath = path.join(iconsDir, filename);
    if (!fs.existsSync(iconPath)) {
      console.log(`📄 إنشاء ${filename}...`);
      // في بيئة الإنتاج، يجب استخدام أدوات تحويل حقيقية
      fs.writeFileSync(iconPath, `<!-- Placeholder for ${filename} -->`);
    }
  });

  console.log("✅ تم إنشاء الأيقونات");
}

// بناء تطبيق Electron
function buildElectronApp() {
  console.log("\n⚡ بناء تطبيق Electron...");

  try {
    let buildCommand = "npm run dist";

    // تخصيص الأمر حسب النظام
    if (platform === "win32") {
      buildCommand = "npm run dist:win";
    } else if (platform === "darwin") {
      buildCommand = "npm run dist:mac";
    } else if (platform === "linux") {
      buildCommand = "npm run dist:linux";
    }

    console.log(`🔨 تنفيذ: ${buildCommand}`);
    execSync(buildCommand, { stdio: "inherit", timeout: 300000 }); // 5 دقائق
    console.log("✅ تم بناء تطبيق Electron بنجاح");
  } catch (error) {
    console.error("❌ فشل في بناء تطبيق Electron");
    console.error("💡 نصيحة: تأكد من وجود جميع الأيقونات المطلوبة");

    // محاولة بناء مجلد بدلاً من التوزيع
    try {
      console.log("🔄 محاولة بناء مجلد التطبيق...");
      execSync("npm run pack", { stdio: "inherit" });
      console.log("✅ تم بناء مجلد التطبيق بنجاح");
    } catch (packError) {
      console.error("❌ فشل في بناء مجلد التطبيق أيضاً");
      process.exit(1);
    }
  }
}

// عرض نتائج البناء
function showResults() {
  console.log("\n🎉 تم الانتهاء من البناء!");
  console.log("=".repeat(50));

  const distDir = path.join(process.cwd(), "dist");
  if (fs.existsSync(distDir)) {
    console.log("📦 ملفات التوزيع:");
    try {
      const files = fs.readdirSync(distDir);
      files.forEach((file) => {
        const filePath = path.join(distDir, file);
        const stats = fs.statSync(filePath);
        const size = (stats.size / 1024 / 1024).toFixed(2);
        console.log(`   📄 ${file} (${size} MB)`);
      });
    } catch (error) {
      console.log("   📁 مجلد dist موجود ولكن لا يمكن قراءة محتوياته");
    }
  } else {
    console.log("⚠️  مجلد التوزيع غير موجود، تحقق من وجود أخطاء في البناء");
  }

  console.log("\n📋 الخطوات التالية:");
  console.log("   1. اختبر التطبيق في مجلد dist");
  console.log("   2. قم بتوزيع ملفات التثبيت");
  console.log("   3. اختبر التطبيق على أنظمة مختلفة");

  console.log("\n🔐 KnouxCrypt™ 2025 جاهز للاستخدام!");
}

// تنفيذ البرنامج الرئيسي
async function main() {
  try {
    checkEnvironment();
    installDependencies();
    buildWebApp();
    generateIcons();
    buildElectronApp();
    showResults();
  } catch (error) {
    console.error(`\n💥 خطأ عام: ${error.message}`);
    process.exit(1);
  }
}

// معالجة إشارات النظام
process.on("SIGINT", () => {
  console.log("\n⏹️  تم إيقاف البناء بواسطة المستخدم");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n⏹️  تم إيقاف البناء بواسطة النظام");
  process.exit(0);
});

// بدء البرنامج
if (require.main === module) {
  main();
}

module.exports = {
  checkEnvironment,
  installDependencies,
  buildWebApp,
  generateIcons,
  buildElectronApp,
  showResults,
};
