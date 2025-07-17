# 🔐 KnouxCrypt™ 2025 - دليل النشر الشامل

## ملخص التطبيق

**KnouxCrypt™ 2025** هو نظام تشفير عسكري متقدم تم بناؤه بالكامل ويمكن تشغيله كـ:

- 🌐 تطبيق ويب
- 🖥️ تطبيق سطح مكتب (Electron)
- 📦 تطبيق محمول

---

## 📋 محتويات المشروع

### ملفات التطبيق الرئيسية:

```
knouxcrypt/
├── src/                          # كود المصدر
│   ├── components/              # مكونات React
│   │   ├── modern/             # واجهة عصرية متطورة
│   │   ├── pages/              # صفحات التطبيق
│   │   └── UI/                 # مكونات واجهة المستخدم
│   ├── core/crypto/            # خوارزميات التشفير
│   ├── services/               # خدمات التطبيق
│   └── styles/                 # ملفات التصميم
├── electron/                    # ملفات Electron
├── build/                       # ملفات التطبيق المبنية
├── package.json                 # إعدادات المشروع
└── vite.config.js              # إعدادات البناء
```

### التقنيات المستخدمة:

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Tailwind CSS + Framer Motion
- **Build Tool**: Vite
- **Desktop**: Electron
- **Crypto**: خوارزميات مخصصة (AES, Serpent, Twofish)

---

## 🚀 طرق التشغيل

### 1. تطبيق ويب (Development)

```bash
# تثبيت التبعيات
npm install

# تشغيل خادم التطوير
npm run dev

# الوصول للتطبيق
# http://localhost:3000
```

### 2. تطبيق ويب (Production)

```bash
# بناء التطبيق
npm run build

# معاينة النسخة المبنية
npm run preview

# أو استخدام أي خادم ويب
npx serve build
```

### 3. تطبيق سطح مكتب

```bash
# تشغيل Electron في وضع التطوير
npm run electron-dev

# بناء تطبيق سطح المكتب
npm run dist

# بناء لنظام محدد
npm run dist:win    # Windows
npm run dist:mac    # macOS
npm run dist:linux  # Linux
```

---

## 💻 إنشاء ملف .exe

### الطريقة الأولى: Electron Builder

```bash
# 1. بناء التطبيق
npm run build

# 2. إنشاء ملف .exe
npm run dist:win

# النتيجة: dist/KnouxCrypt-2025-Setup-2025.1.0.exe
```

### الطريقة الثانية: تطبيق محمول

```bash
# تشغيل سكريبت إنشاء التطبيق المحمول
node create-portable.js

# النتيجة: مجلد portable-dist/ يحتوي على:
# - start-knouxcrypt.bat (Windows)
# - start-knouxcrypt.sh (Linux/Mac)
# - app/ (ملفات التطبيق)
# - README.txt (التعليمات)
```

### الطريقة الثالثة: سكريبت البناء الشامل

```bash
# تشغيل سكريبت البناء المتكامل
node build-app.js

# يقوم بـ:
# - فحص البيئة
# - تثبيت التبعيات
# - بناء التطبيق
# - إنشاء الأيقونات
# - بناء Electron
# - إنشاء ملفات التوزيع
```

---

## 📦 ملفات التوزيع النهائية

بعد تشغيل عملية البناء، ستحصل على:

### Windows:

- `KnouxCrypt-2025-Setup-2025.1.0.exe` - ملف التثبيت
- `KnouxCrypt-2025-Portable-2025.1.0.exe` - ملف محمول

### macOS:

- `KnouxCrypt-2025-2025.1.0.dmg` - ملف التثبيت
- `KnouxCrypt-2025-2025.1.0-mac.zip` - ملف مضغوط

### Linux:

- `KnouxCrypt-2025-2025.1.0.AppImage` - ملف محمول
- `KnouxCrypt-2025-2025.1.0.deb` - حزمة Debian
- `KnouxCrypt-2025-2025.1.0.rpm` - حزمة Red Hat

---

## 🔧 متطلبات النظام

### للتطوير:

- Node.js 16+
- npm 8+
- Git
- 4GB RAM
- 2GB مساحة خالية

### للمستخدم النهائي:

- Windows 10+ / macOS 10.15+ / Ubuntu 18.04+
- 2GB RAM
- 500MB مساحة خالية
- متصفح ويب حديث (للإصدار المحمول)

---

## 🎯 الميزات المتكاملة

### واجهة المستخدم:

- ✅ تصميم Glassmorphism عصري
- ✅ دعم اللغة العربية (RTL)
- ✅ حركات متقدمة بـ Framer Motion
- ✅ واجهة متجاوبة لجميع الشاشات

### الأمان:

- ✅ 4 خوارزميات تشفير متقدمة
- ✅ مقاومة الكمبيوتر الكمي
- ✅ تشفير عسكري متقدم
- ✅ مراقبة أمنية فورية

### سطح المكتب:

- ✅ صينية النظام
- ✅ اختصارات لوحة المفاتيح العامة
- ✅ تحديث تلقائي
- ✅ إشعارات النظام
- ✅ قوائم مخصصة

---

## 🛠️ استكشاف الأخطاء

### مشاكل شائعة:

#### 1. خطأ Buffer في المتصفح

```bash
# الحل: التأكد من تحديث vite.config.js
npm install buffer
```

#### 2. مشكلة Electron في Linux

```bash
# تثبيت المكتبات المطلوبة
sudo apt-get install libnss3-dev libatk-bridge2.0-dev libdrm2 \
libxcomposite1 libxdamage1 libxrandr2 libgbm1 libxss1 libasound2
```

#### 3. فشل بناء Windows

```bash
# التأكد من وجود أيقونة Windows
# إنشاء icon.ico في electron/assets/
```

---

## 📚 استخدام التطبيق

### 1. الصفحة الرئيسية:

- مراقبة الأمان الفوري
- إحصائيات التشفير
- العمليات النشطة

### 2. إدارة الأقراص:

- تشفير/فك تشفير الأقراص
- مراقبة حالة الأقراص
- إدارة المفاتيح

### 3. مختبر الخوارزميات:

- اختبار 4 خوارزميات
- مقارنة الأداء
- تحليل الأمان

### 4. المساعد الذكي:

- توصيات أمنية ذكية
- تحليل التهديدات
- مساعدة تفاعلية

---

## 📄 الترخيص والحقوق

**KnouxCrypt™ 2025**  
© 2025 Knoux Technologies. جميع الحقوق محفوظة.

- نظام تشفير عسكري متقدم
- واجهة مستخدم عصرية
- دعم متعدد المنصات
- مقاوم للكمبيوتر الكمي

---

## 📞 الدعم

- **البريد الإلكتروني**: support@knouxcrypt.com
- **الموقع**: https://knouxcrypt.com
- **التوثيق**: https://docs.knouxcrypt.com

---

## 🎉 التطبيق جاهز!

التطبيق الآن مكتمل بالكامل ويمكن:

- تشغيله كتطبيق ويب
- إنشاء ملف .exe لـ Windows
- إنشاء تطبيقات لجميع المنصات
- توزيعه كتطبيق محمول

**جميع الملفات والسكريبتات جاهزة للاستخدام الفوري!** ✨
