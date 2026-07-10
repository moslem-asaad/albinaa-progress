# برنامج البناء الميسر – المرحلة الثانية

موقع عربي شخصي وخفيف لمتابعة إنجاز مقررات المرحلة الثانية. يعمل مباشرة من الملفات الثابتة، ويحفظ محلياً حتى قبل إعداد Firebase، ثم يزامن وثيقة واحدة لكل مستخدم عند تسجيل الدخول بحساب Google.

## التشغيل المحلي

شغّل خادماً ثابتاً من مجلد المشروع، مثلاً:

```bash
python3 -m http.server 8000
```

ثم افتح `http://localhost:8000`. لا تفتح `index.html` عبر `file://` لأن وحدات JavaScript تحتاج إلى خادم HTTP.

## إعداد Firebase

1. افتح [Firebase Console](https://console.firebase.google.com/) وأنشئ مشروعاً.
2. من إعدادات المشروع، أضف Web App.
3. انسخ إعدادات التطبيق إلى `firebase-config.js` بدلاً من القيم المؤقتة.
4. افتح Authentication، ثم Sign-in method، وفعّل Google.
5. افتح Authentication → Settings → Authorized domains وأضف نطاق GitHub Pages، مثل `username.github.io`.
6. أضف أيضاً `localhost` ونطاق Firebase عند الحاجة.
7. أنشئ Cloud Firestore واختر Production mode.
8. افتح Firestore Database → Rules، والصق القواعد التالية ثم انشرها:

```text
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }
  }
}
```

تسمح هذه القواعد للمستخدم المسجل بالدخول بقراءة وكتابة وثيقته فقط في `users/{uid}`، ولا تسمح له بالوصول إلى وثائق المستخدمين الآخرين.

## النشر على GitHub Pages

1. أنشئ مستودع GitHub جديداً.
2. ارفع الملفات الموجودة في جذر هذا المشروع. انتبه: `firebase-config.js` مستثنى من Git؛ أنشئه في المستودع من نسخة `firebase-config.example.js` مع قيمك الفعلية، أو عدّل طريقة تزويده بأمان بما يناسب مستودعك. إعداد Firebase لتطبيق ويب ليس سراً أمنياً، والحماية الفعلية تأتي من قواعد Firestore والنطاقات المصرح بها.
3. من المستودع افتح Settings → Pages.
4. اختر Deploy from a branch.
5. اختر الفرع `main` والمجلد `/ (root)` ثم Save.
6. افتح رابط GitHub Pages الذي يظهر بعد اكتمال النشر.
7. أضف نطاق الرابط إلى Firebase Authentication → Settings → Authorized domains إن لم تكن أضفته.
8. سجّل الدخول بالحساب نفسه على Mac وiPhone لمزامنة التقدم.

## القيم المطلوبة منك

املأ في `firebase-config.js`: `apiKey` و`authDomain` و`projectId` و`storageBucket` و`messagingSenderId` و`appId`. بدونها يبقى التطبيق عاملاً بالكامل بالحفظ المحلي، ويعرض أن المزامنة السحابية غير مفعلة.
