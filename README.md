# PowerShield Pro

واجهة هبوط ولوحة تحكم لمشروع PowerShield Pro الخاص بعرض وبيع أجهزة UPS / Onduleur.

## الملفات الرئيسية

- `onduleur-landing.html`: صفحة الهبوط للمنتج.
- `dashboard.html`: لوحة تحكم الطلبات والمبيعات.
- `js/`: ملفات JavaScript وبيانات المدن.
- ملفات PDF و PNG: صور وملفات تقنية مستخدمة في العرض.

## التشغيل

افتح `onduleur-landing.html` أو `dashboard.html` مباشرة في المتصفح.

## ربط Firebase / Firestore

تم تجهيز المشروع ليعمل بطريقتين:

- بدون Firebase: يحفظ الطلبات في `localStorage` داخل المتصفح.
- مع Firebase: يحفظ الطلبات في Firestore ويعرضها في `dashboard.html`.

### خطوات إنشاء Firebase

1. ادخل إلى Firebase Console وأنشئ مشروعاً جديداً.
2. من Build > Firestore Database اضغط Create database.
3. اختر Test mode للتجربة فقط، ثم غيّر القواعد قبل نشر الموقع.
4. من Project settings > General > Your apps أضف Web app.
5. انسخ كائن `firebaseConfig`.
6. افتح `js/firebase-config.js` واستبدل قيم `YOUR_...` بقيم مشروعك.
7. افتح `onduleur-landing.html` وسجل طلباً جديداً.
8. افتح `dashboard.html` واضغط تحديث، أو راقب collection اسمها `orders` داخل Firestore.

### ملاحظة أمان مهمة

مفتاح Firebase الموجود في الواجهة ليس كلمة سر. الحماية الحقيقية تكون عبر Firestore Security Rules و/أو Firebase Auth.

للتجربة السريعة فقط يمكنك استخدام قواعد اختبار مؤقتة. للإنتاج يفضل:

- السماح لصفحة الطلب بإنشاء طلب جديد فقط.
- حماية قراءة وتعديل الطلبات في الداشبورد بحساب Admin عبر Firebase Auth.
- عدم نشر `dashboard.html` كرابط عام بدون حماية.
