/**
 * مولد الأيقونات لـ KnouxCrypt™ 2025
 * يقوم بإنشاء جميع أحجام الأيقونات المطلوبة
 */

const fs = require("fs");
const path = require("path");

// رمز الأيقونة SVG
const iconSVG = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#8B5CF6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06B6D4;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- خلفية دائرية -->
  <circle cx="256" cy="256" r="240" fill="url(#grad1)" filter="url(#glow)"/>
  
  <!-- قفل رئيسي -->
  <g transform="translate(256,256)">
    <!-- جسم القفل -->
    <rect x="-60" y="-20" width="120" height="80" rx="15" fill="white" opacity="0.95"/>
    
    <!-- قوس القفل -->
    <path d="M -40,-20 C -40,-60 -20,-80 0,-80 C 20,-80 40,-60 40,-20" 
          stroke="white" stroke-width="16" fill="none" stroke-linecap="round" opacity="0.95"/>
    
    <!-- ثقب المفتاح -->
    <circle cx="0" cy="10" r="12" fill="url(#grad1)"/>
    <rect x="-4" y="10" width="8" height="20" rx="4" fill="url(#grad1)"/>
    
    <!-- نجوم أمنية -->
    <g opacity="0.8">
      <polygon points="-80,-60 -75,-50 -85,-50" fill="white" transform="rotate(45)"/>
      <polygon points="80,-60 85,-50 75,-50" fill="white" transform="rotate(-45)"/>
      <polygon points="-80,80 -75,90 -85,90" fill="white" transform="rotate(135)"/>
      <polygon points="80,80 85,90 75,90" fill="white" transform="rotate(-135)"/>
    </g>
    
    <!-- دائرة التشفير -->
    <circle cx="0" cy="0" r="90" stroke="white" stroke-width="4" fill="none" opacity="0.3" stroke-dasharray="10,5"/>
    <circle cx="0" cy="0" r="110" stroke="white" stroke-width="2" fill="none" opacity="0.2" stroke-dasharray="5,10"/>
  </g>
  
  <!-- نص KnouxCrypt -->
  <text x="256" y="450" text-anchor="middle" fill="white" font-size="36" font-weight="bold" font-family="Arial">
    KnouxCrypt™
  </text>
</svg>
`;

// كتابة ملف SVG
fs.writeFileSync(path.join(__dirname, "icon.svg"), iconSVG);

console.log("✅ تم إنشاء ملف icon.svg");
console.log(
  "📝 يمكنك الآن تحويله إلى PNG/ICO/ICNS باستخدام أدوات التحويل المناسبة",
);
console.log("🔧 أو استخدام خدمات التحويل عبر الإنترنت مثل:");
console.log("   - https://convertio.co/svg-ico/");
console.log("   - https://cloudconvert.com/svg-to-png");
console.log("   - https://iconverticons.com/online/");

// إنشاء أيقونة مبسطة للصينية
const trayIconSVG = `
<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="28" fill="#3B82F6"/>
  <rect x="20" y="28" width="24" height="16" rx="3" fill="white"/>
  <path d="M 24,28 C 24,20 28,16 32,16 C 36,16 40,20 40,28" 
        stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>
  <circle cx="32" cy="34" r="3" fill="#3B82F6"/>
  <rect x="30" y="34" width="4" height="6" rx="2" fill="#3B82F6"/>
</svg>
`;

fs.writeFileSync(path.join(__dirname, "tray-icon.svg"), trayIconSVG);

// إنشاء أيقونة القائمة
const menuIconSVG = `
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="8" cy="8" r="7" fill="#3B82F6"/>
  <rect x="4" y="7" width="8" height="4" rx="1" fill="white"/>
  <path d="M 5,7 C 5,5 6,4 8,4 C 10,4 11,5 11,7" 
        stroke="white" stroke-width="1" fill="none" stroke-linecap="round"/>
  <circle cx="8" cy="8.5" r="1" fill="#3B82F6"/>
</svg>
`;

fs.writeFileSync(path.join(__dirname, "menu-icon.svg"), menuIconSVG);

console.log("✅ تم إنشاء جميع الأيقونات SVG");

// إنشاء ملف README للأيقونات
const iconsReadme = `# أيقونات KnouxCrypt™ 2025

## الملفات المطلوبة:

### Windows:
- icon.ico (256x256, 128x128, 64x64, 48x48, 32x32, 16x16)

### macOS:
- icon.icns (512x512, 256x256, 128x128, 64x64, 32x32, 16x16)

### Linux:
- icon.png (512x512)

### صينية النظام:
- tray-icon.png (64x64, 32x32, 16x16)

## تحويل الأيقونات:

### من SVG إلى PNG:
\`\`\`bash
# استخدم ImageMagick أو أي أداة تحويل أخرى
convert icon.svg -resize 512x512 icon.png
convert icon.svg -resize 256x256 icon-256.png
convert icon.svg -resize 128x128 icon-128.png
convert icon.svg -resize 64x64 icon-64.png
convert icon.svg -resize 32x32 icon-32.png
convert icon.svg -resize 16x16 icon-16.png
\`\`\`

### من PNG إلى ICO (Windows):
\`\`\`bash
convert icon-16.png icon-32.png icon-48.png icon-64.png icon-128.png icon-256.png icon.ico
\`\`\`

### من PNG إلى ICNS (macOS):
\`\`\`bash
# استخدم iconutil على macOS
mkdir icon.iconset
cp icon-16.png icon.iconset/icon_16x16.png
cp icon-32.png icon.iconset/icon_16x16@2x.png
cp icon-32.png icon.iconset/icon_32x32.png
cp icon-64.png icon.iconset/icon_32x32@2x.png
cp icon-128.png icon.iconset/icon_128x128.png
cp icon-256.png icon.iconset/icon_128x128@2x.png
cp icon-256.png icon.iconset/icon_256x256.png
cp icon-512.png icon.iconset/icon_256x256@2x.png
cp icon-512.png icon.iconset/icon_512x512.png
iconutil -c icns icon.iconset
\`\`\`

## الخدمات الم��انية لتحويل الأيقونات:
- https://convertio.co/
- https://cloudconvert.com/
- https://iconverticons.com/
- https://favicon.io/
`;

fs.writeFileSync(path.join(__dirname, "README.md"), iconsReadme);

console.log("✅ تم إنشاء ملف README للأيقونات");
console.log("🎯 الخطوة التالية: قم بتحويل الملفات SVG إلى التنسيقات المطلوبة");
