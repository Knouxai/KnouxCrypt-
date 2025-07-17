# KnouxCrypt™ 2025 - Windows Installer Script
# سكريبت تثبيت Windows

# تخصيص صفحة الترحيب
!define MUI_WELCOMEPAGE_TITLE "مرحباً بك في معالج تثبيت KnouxCrypt™ 2025"
!define MUI_WELCOMEPAGE_TEXT "سيقوم هذا المعالج بإرشادك خلال تثبيت نظام التشفير العسكري المتقدم KnouxCrypt™ 2025.$\r$\n$\r$\nيُنصح بإغلاق جميع التطبيقات الأخرى قبل المتابعة. هذا سيسمح للمعالج بتحديث ملفات النظام ذات الصلة دون الحاجة لإعادة تشغيل الكمبيوتر.$\r$\n$\r$\nانقر على 'التالي' للمتابعة."

# تخصيص صفحة الانتهاء
!define MUI_FINISHPAGE_TITLE "تم الانتهاء من تثبيت KnouxCrypt™ 2025"
!define MUI_FINISHPAGE_TEXT "تم تثبيت KnouxCrypt™ 2025 بنجاح على الكمبيوتر.$\r$\n$\r$\nانقر على 'إنهاء' لإغلاق هذا المعالج."
!define MUI_FINISHPAGE_RUN "$INSTDIR\KnouxCrypt™ 2025.exe"
!define MUI_FINISHPAGE_RUN_TEXT "تشغيل KnouxCrypt™ 2025"

# إعدادات إضافية
!define MUI_ICON "assets\icon.ico"
!define MUI_UNICON "assets\icon.ico"

# معلومات الشركة
VIProductVersion "2025.1.0.0"
VIAddVersionKey "ProductName" "KnouxCrypt™ 2025"
VIAddVersionKey "ProductVersion" "2025.1.0"
VIAddVersionKey "CompanyName" "Knoux Technologies"
VIAddVersionKey "FileDescription" "نظام التشفير العسكري المتقدم"
VIAddVersionKey "FileVersion" "2025.1.0.0"
VIAddVersionKey "LegalCopyright" "© 2025 Knoux Technologies. All rights reserved."
VIAddVersionKey "OriginalFilename" "KnouxCrypt-2025-Setup.exe"

# وظائف مخصصة
Function .onInit
  # فحص إذا كان التطبيق يعمل بالفعل
  System::Call 'kernel32::CreateMutex(i 0, i 0, t "KnouxCrypt2025Installer") i .r1 ?e'
  Pop $R0
  StrCmp $R0 0 +3
    MessageBox MB_OK|MB_ICONEXCLAMATION "معالج التثبيت يعمل بالفعل."
    Abort
    
  # فحص نسخة النظام
  ${If} ${AtMostWin7}
    MessageBox MB_OK|MB_ICONSTOP "KnouxCrypt™ 2025 يتطلب Windows 8 أو أحدث."
    Abort
  ${EndIf}
FunctionEnd

Function .onInstSuccess
  # إنشاء اختصارات إضافية
  CreateShortCut "$DESKTOP\KnouxCrypt™ 2025.lnk" "$INSTDIR\KnouxCrypt™ 2025.exe"
  CreateShortCut "$STARTMENU\Programs\KnouxCrypt™ 2025\مستندات المساعدة.lnk" "$INSTDIR\resources\help\index.html"
  
  # تسجيل التطبيق في النظام
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\KnouxCrypt2025" "DisplayName" "KnouxCrypt™ 2025"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\KnouxCrypt2025" "DisplayVersion" "2025.1.0"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\KnouxCrypt2025" "Publisher" "Knoux Technologies"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\KnouxCrypt2025" "DisplayIcon" "$INSTDIR\KnouxCrypt™ 2025.exe"
  
  # إنشاء بروتوكول مخصص
  WriteRegStr HKCR "knouxcrypt" "" "URL:KnouxCrypt Protocol"
  WriteRegStr HKCR "knouxcrypt" "URL Protocol" ""
  WriteRegStr HKCR "knouxcrypt\shell\open\command" "" '"$INSTDIR\KnouxCrypt™ 2025.exe" "%1"'
FunctionEnd

# دالة إلغاء التثبيت
Function un.onInit
  MessageBox MB_ICONQUESTION|MB_YESNO|MB_DEFBUTTON2 "هل أنت متأكد من أنك تريد إزالة KnouxCrypt™ 2025 وجميع مكوناته؟" IDYES +2
  Abort
FunctionEnd

Function un.onUninstSuccess
  # تنظيف السجل
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\KnouxCrypt2025"
  DeleteRegKey HKCR "knouxcrypt"
  
  # حذف الاختصارات
  Delete "$DESKTOP\KnouxCrypt™ 2025.lnk"
  
  MessageBox MB_OK "تم إلغاء تثبيت KnouxCrypt™ 2025 بنجاح."
FunctionEnd

# ماكرو للتحقق من المتطلبات
!macro CheckRequirements
  # فحص .NET Framework
  ReadRegDWORD $0 HKLM "SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full" "Release"
  IntCmp $0 461808 NetFrameworkOK NetFrameworkOK 0
    MessageBox MB_OK|MB_ICONSTOP "يتطلب KnouxCrypt™ 2025 تثبيت .NET Framework 4.7.2 أو أحدث."
    ExecShell "open" "https://dotnet.microsoft.com/download/dotnet-framework"
    Abort
  NetFrameworkOK:
  
  # فحص Visual C++ Redistributable
  ReadRegDWORD $0 HKLM "SOFTWARE\Microsoft\VisualStudio\14.0\VC\Runtimes\x64" "Installed"
  IntCmp $0 1 VCRedistOK 0 0
    MessageBox MB_YESNO|MB_ICONQUESTION "يتطلب KnouxCrypt™ 2025 تثبيت Visual C++ Redistributable. هل تريد تنزيله الآن؟" IDNO VCRedistOK
    ExecShell "open" "https://aka.ms/vs/17/release/vc_redist.x64.exe"
  VCRedistOK:
!macroend

# استدعاء فحص المتطلبات أثناء التثبيت
Section "تثبيت التطبيق الرئيسي" SecMain
  !insertmacro CheckRequirements
  
  SetOutPath "$INSTDIR"
  
  # نسخ ملفات التطبيق
  File /r "${BUILD_DIR}\*"
  
  # إنشاء ملفات إضافية
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  
  # تسجيل التطبيق
  WriteRegStr HKLM "Software\KnouxTechnologies\KnouxCrypt2025" "InstallPath" "$INSTDIR"
  WriteRegStr HKLM "Software\KnouxTechnologies\KnouxCrypt2025" "Version" "2025.1.0"
SectionEnd

# قسم الاختصارات
Section "إنشاء الاختصارات" SecShortcuts
  CreateDirectory "$SMPROGRAMS\KnouxCrypt™ 2025"
  CreateShortCut "$SMPROGRAMS\KnouxCrypt™ 2025\KnouxCrypt™ 2025.lnk" "$INSTDIR\KnouxCrypt™ 2025.exe"
  CreateShortCut "$SMPROGRAMS\KnouxCrypt™ 2025\إلغاء التثبيت.lnk" "$INSTDIR\Uninstall.exe"
SectionEnd

# وصف الأقسام
LangString DESC_SecMain ${LANG_ARABIC} "ملفات التطبيق الرئيسية لـ KnouxCrypt™ 2025"
LangString DESC_SecShortcuts ${LANG_ARABIC} "إنشاء اختصارات في قائمة ابدأ وسطح المكتب"

!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  !insertmacro MUI_DESCRIPTION_TEXT ${SecMain} $(DESC_SecMain)
  !insertmacro MUI_DESCRIPTION_TEXT ${SecShortcuts} $(DESC_SecShortcuts)
!insertmacro MUI_FUNCTION_DESCRIPTION_END
