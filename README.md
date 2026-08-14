# برنامج البناء الميسر – المرحلة الثانية

موقع عربي شخصي وخفيف لمتابعة إنجاز مقررات المرحلة الثانية. يعمل مباشرة من الملفات الثابتة، ويحفظ محلياً حتى قبل إعداد Firebase، ثم يزامن وثيقة واحدة لكل مستخدم عند تسجيل الدخول بحساب Google.

يدعم الموقع حالياً «البناء الميسر - المرحلة الثانية» و«البناء المنهجي - المرحلة الثالثة» من خلال تبويبين يستخدمان نفس قالب العرض والحفظ والمزامنة.

## إضافة برنامج جديد

توجد جميع البرامج في `data.js` داخل مصفوفة `programs`. لإضافة مرحلة جديدة، أضف عنصراً بهذا الشكل، وسيظهر تبويبها تلقائياً:

```js
{
  id: 'stage4',
  name: 'اسم البرنامج',
  title: 'المرحلة الرابعة',
  courses: [
    {
      id: 'stage4-course-1',
      title: 'اسم المقرر',
      url: 'https://example.com', // اختياري
      lessons: [
        {
          id: 'stage4-course-1-01',
          title: 'اسم الدرس',
          scheduledDate: '2026-11-20'
        }
      ]
    }
  ]
}
```

يجب أن تكون معرفات البرامج والمقررات والدروس ثابتة وفريدة. القالب المشترك يتولى تلقائياً حساب التقدم، المواعيد، حالة اللحاق، البحث، الملاحظات، والحفظ السحابي.

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

### تفعيل ملفات PDF مجاناً عبر Supabase

يستخدم الموقع Firebase للتسجيل وحفظ التقدم، وSupabase Storage المجاني لحفظ ملفات PDF.

1. في Supabase افتح **Authentication → Third-Party Auth**، وأضف **Firebase** باستخدام Project ID: `albinaa-progress`.
2. افتح **SQL Editor → New query**.
3. الصق الاستعلام التالي وشغّله مرة واحدة:

```sql
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('lesson-pdfs', 'lesson-pdfs', false, 20971520, array['application/pdf'])
on conflict (id) do update set
  public = false,
  file_size_limit = 20971520,
  allowed_mime_types = array['application/pdf'];

create policy "Firebase users upload their PDFs"
on storage.objects for insert to anon
with check (
  bucket_id = 'lesson-pdfs'
  and (storage.foldername(name))[1] = (auth.jwt()->>'sub')
  and auth.jwt()->>'iss' = 'https://securetoken.google.com/albinaa-progress'
  and auth.jwt()->>'aud' = 'albinaa-progress'
);

create policy "Firebase users read their PDFs"
on storage.objects for select to anon
using (
  bucket_id = 'lesson-pdfs'
  and (storage.foldername(name))[1] = (auth.jwt()->>'sub')
  and auth.jwt()->>'iss' = 'https://securetoken.google.com/albinaa-progress'
  and auth.jwt()->>'aud' = 'albinaa-progress'
);

create policy "Firebase users delete their PDFs"
on storage.objects for delete to anon
using (
  bucket_id = 'lesson-pdfs'
  and (storage.foldername(name))[1] = (auth.jwt()->>'sub')
  and auth.jwt()->>'iss' = 'https://securetoken.google.com/albinaa-progress'
  and auth.jwt()->>'aud' = 'albinaa-progress'
);
```

الإعدادات العامة للاتصال موجودة في `supabase-config.js`. الـbucket خاص، وروابط الفتح مؤقتة لعشر دقائق، وكل مستخدم يستطيع الوصول فقط إلى المجلد المطابق لمعرّفه في Firebase. لا تضع Database Password أو `service_role` key داخل المشروع.

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
