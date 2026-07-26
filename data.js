const stage2Courses = [
  {
    id: 'sahaba',
    title: 'كيف تأسس جيل الصحابة',
    url: 'https://www.youtube.com/watch?v=jpoD1Ab9Dbk',
    lessons: [
      { id: 'sahaba-01', title: 'النصف الأول', scheduledDate: '2026-06-02' },
      { id: 'sahaba-02', title: 'النصف الثاني', scheduledDate: '2026-06-03' },
      { id: 'sahaba-03', title: 'النصف الثالث', scheduledDate: '2026-06-04' }
    ]
  },
  {
    id: 'aqeeda-intro',
    title: 'مدخل إلى علم العقيدة',
    url: 'https://youtu.be/sbbax79XfAM?si=ZlOoPbUJlQBch0tS',
    lessons: [
      { id: 'aqeeda-intro-01', title: 'النصف الأول', scheduledDate: '2026-06-06' },
      { id: 'aqeeda-intro-02', title: 'النصف الثاني', scheduledDate: '2026-06-07' }
    ]
  },
  {
    id: 'asmaa',
    title: 'مختصر أسماء الله الحسنى',
    url: 'https://drive.google.com/file/d/1RGpT9S8n8V-Z38eD-3LHlutgO3ZMaf-7/view?usp=drive_link',
    lessons: [
      { id: 'asmaa-01', title: 'من ص 5 إلى ص 27', scheduledDate: '2026-06-08' },
      { id: 'asmaa-02', title: 'من ص 28 إلى ص 56', scheduledDate: '2026-06-09' },
      { id: 'asmaa-03', title: 'من ص 57 إلى ص 86', scheduledDate: '2026-06-10' },
      { id: 'asmaa-04', title: 'من ص 87 إلى ص 116', scheduledDate: '2026-06-15' },
      { id: 'asmaa-05', title: 'من ص 117 إلى نهاية الكتاب', scheduledDate: '2026-06-16' }
    ]
  },
  {
    id: 'riyadh',
    title: 'شرح رياض الصالحين',
    url: 'https://youtube.com/playlist?list=PLZmiPrHYOIsS5j5KXnB8xMbSjy_7KYbCq&si=hpLPsO0vNeWX62zg',
    lessons: [
      { id: 'riyadh-01', title: 'باب التوبة 2 — النصف الأول', scheduledDate: '2026-06-11' },
      { id: 'riyadh-02', title: 'باب التوبة 2 — النصف الثاني', scheduledDate: '2026-06-18' },
      { id: 'riyadh-03', title: 'باب التوبة 3', scheduledDate: '2026-06-25' },
      { id: 'riyadh-04', title: 'باب الصبر 1', scheduledDate: '2026-07-02' },
      { id: 'riyadh-05', title: 'باب الصبر 2', scheduledDate: '2026-07-09' },
      { id: 'riyadh-06', title: 'باب الصبر 3 — النصف الأول', scheduledDate: '2026-07-16' },
      { id: 'riyadh-07', title: 'باب الصبر 2 — النصف الثاني', scheduledDate: '2026-07-23' },
      { id: 'riyadh-08', title: 'باب الصبر 4', scheduledDate: '2026-07-30' },
      { id: 'riyadh-09', title: 'باب الصبر 5', scheduledDate: '2026-08-06' }
    ]
  },
  {
    id: 'bag',
    title: 'الحقيبة الشرعية — العقيدة',
    url: 'https://youtube.com/playlist?list=PLZmiPrHYOIsT0PkIptFKZNq9YG6w9bnYW&si=7FYrZBN56uOwaqnq',
    lessons: [
      { id: 'bag-01', title: 'المحاضرة الأولى', scheduledDate: '2026-06-13' },
      { id: 'bag-02', title: 'المحاضرة الثانية', scheduledDate: '2026-06-14' },
      { id: 'bag-03', title: 'المحاضرة الثالثة', scheduledDate: '2026-06-20' },
      { id: 'bag-04', title: 'المحاضرة الرابعة — النصف الأول', scheduledDate: '2026-06-21' },
      { id: 'bag-05', title: 'المحاضرة الرابعة — النصف الثاني', scheduledDate: '2026-06-27' },
      { id: 'bag-06', title: 'المحاضرة الخامسة', scheduledDate: '2026-06-28' },
      { id: 'bag-07', title: 'المحاضرة السادسة', scheduledDate: '2026-07-04' },
      { id: 'bag-08', title: 'المحاضرة السابعة', scheduledDate: '2026-07-05' },
      { id: 'bag-09', title: 'المحاضرة الثامنة', scheduledDate: '2026-07-11' },
      { id: 'bag-10', title: 'المحاضرة التاسعة', scheduledDate: '2026-07-12' },
      { id: 'bag-11', title: 'المحاضرة العاشرة', scheduledDate: '2026-07-18' },
      { id: 'bag-12', title: 'المحاضرة الحادية عشرة', scheduledDate: '2026-07-19' },
      { id: 'bag-13', title: 'المحاضرة الثانية عشرة — النصف الأول', scheduledDate: '2026-07-25' },
      { id: 'bag-14', title: 'المحاضرة الثانية عشرة — النصف الثاني', scheduledDate: '2026-07-26' },
      { id: 'bag-15', title: 'المحاضرة الثالثة عشرة', scheduledDate: '2026-08-01' },
      { id: 'bag-16', title: 'المحاضرة الرابعة عشرة — النصف الأول', scheduledDate: '2026-08-02' },
      { id: 'bag-17', title: 'المحاضرة الرابعة عشرة — النصف الثاني', scheduledDate: '2026-08-03' },
      { id: 'bag-18', title: 'المحاضرة الخامسة عشرة — النصف الأول', scheduledDate: '2026-08-08' },
      { id: 'bag-19', title: 'المحاضرة الخامسة عشرة — النصف الثاني', scheduledDate: '2026-08-09' }
    ]
  },
  {
    id: 'sawiya',
    title: 'سوية المؤمن',
    url: 'https://youtube.com/playlist?list=PLZmiPrHYOIsS5j5KXnB8xMbSjy_7KYbCq&si=hpLPsO0vNeWX62zg',
    lessons: [
      { id: 'sawiya-01', title: 'الثبات — النصف الأول', scheduledDate: '2026-06-17' },
      { id: 'sawiya-02', title: 'الثبات — النصف الثاني', scheduledDate: '2026-06-22' },
      { id: 'sawiya-03', title: 'قوة النفس — النصف الأول', scheduledDate: '2026-06-23' },
      { id: 'sawiya-04', title: 'قوة النفس — النصف الثاني', scheduledDate: '2026-06-24' },
      { id: 'sawiya-05', title: 'الهم والحزن 1 — النصف الأول', scheduledDate: '2026-06-29' },
      { id: 'sawiya-06', title: 'الهم والحزن 1 — النصف الثاني', scheduledDate: '2026-06-30' },
      { id: 'sawiya-07', title: 'الهم والحزن 2 — النصف الأول', scheduledDate: '2026-07-01' },
      { id: 'sawiya-08', title: 'الهم والحزن 2 — النصف الثاني', scheduledDate: '2026-07-06' },
      { id: 'sawiya-09', title: 'التفاؤل', scheduledDate: '2026-07-07' },
      { id: 'sawiya-10', title: 'التوازن', scheduledDate: '2026-07-08' },
      { id: 'sawiya-11', title: 'الصديق والصداقة', scheduledDate: '2026-07-13' },
      { id: 'sawiya-12', title: 'الصبر', scheduledDate: '2026-07-14' },
      { id: 'sawiya-13', title: 'الشتات', scheduledDate: '2026-07-15' },
      { id: 'sawiya-14', title: 'المسؤولية', scheduledDate: '2026-07-20' },
      { id: 'sawiya-15', title: 'العزيمة', scheduledDate: '2026-07-21' },
      { id: 'sawiya-16', title: 'الحياء', scheduledDate: '2026-07-22' },
      { id: 'sawiya-17', title: 'الأمان — النصف الأول', scheduledDate: '2026-07-27' },
      { id: 'sawiya-18', title: 'الأمان — النصف الثاني', scheduledDate: '2026-07-28' },
      { id: 'sawiya-19', title: 'الجود والسخاء والبخل والشح — النصف الأول', scheduledDate: '2026-07-29' },
      { id: 'sawiya-20', title: 'الجود والسخاء والبخل والشح — النصف الثاني', scheduledDate: '2026-08-04' },
      { id: 'sawiya-21', title: 'العفو والصفح', scheduledDate: '2026-08-05' }
    ]
  }
];

const stage3Courses = [
  {
    id: 'stage3-nazm-almueen', title: 'شرح نظم المعين في الحديث',
    url: 'https://www.youtube.com/playlist?list=PLZmiPrHYOIsSppsW3rDVRHqL556H5txHM', lessons: [
      { id: 'stage3-nazm-almueen-01', title: 'المحاضرة 1', scheduledDate: '2026-07-25' },
      { id: 'stage3-nazm-almueen-02', title: 'المحاضرة 2', scheduledDate: '2026-07-26' },
      { id: 'stage3-nazm-almueen-03', title: 'المحاضرة 3', scheduledDate: '2026-07-27' },
      { id: 'stage3-nazm-almueen-04', title: 'المحاضرة 4', scheduledDate: '2026-08-01' },
      { id: 'stage3-nazm-almueen-05', title: 'المحاضرة 5', scheduledDate: '2026-08-02' },
      { id: 'stage3-nazm-almueen-06', title: 'المحاضرتان 6 و7', scheduledDate: '2026-08-03' }
    ]
  },
  {
    id: 'stage3-research-methods', title: 'منهج البحث في القضايا الفكرية المعاصرة',
    url: 'https://www.youtube.com/playlist?list=PLcWpmYxK9ObvxNrVV3Y-4cPid2wPkGzRb', lessons: [
      { id: 'stage3-research-methods-01', title: 'الثلث الأول', scheduledDate: '2026-07-28' },
      { id: 'stage3-research-methods-02', title: 'الثلث الثاني', scheduledDate: '2026-07-29' },
      { id: 'stage3-research-methods-03', title: 'الثلث الثالث', scheduledDate: '2026-07-30' }
    ]
  },
  {
    id: 'stage3-secularism', title: 'الأفكار المؤسلمة للعلمانية',
    url: 'https://www.youtube.com/watch?v=eenwX-whVFY', lessons: [
      { id: 'stage3-secularism-01', title: 'المقرر كامل', scheduledDate: '2026-08-04' }
    ]
  },
  {
    id: 'stage3-civil-discourse', title: 'مآلات الخطاب المدني',
    url: 'https://drive.google.com/file/d/1BBGaKdiXoOoO0V62tAQPPN7KSwpJW70X/view', lessons: [
      { id: 'stage3-civil-discourse-01', title: 'من صـ 9 إلى صـ 21', scheduledDate: '2026-08-05' },
      { id: 'stage3-civil-discourse-02', title: 'من صـ 22 إلى صـ 47', scheduledDate: '2026-08-06' },
      { id: 'stage3-civil-discourse-03', title: 'من صـ 49 إلى صـ 78', scheduledDate: '2026-08-11' },
      { id: 'stage3-civil-discourse-04', title: 'من صـ 79 إلى صـ 95', scheduledDate: '2026-08-12' },
      { id: 'stage3-civil-discourse-05', title: 'من صـ 96 إلى صـ 128', scheduledDate: '2026-08-13' },
      { id: 'stage3-civil-discourse-06', title: 'من صـ 129 إلى صـ 159', scheduledDate: '2026-08-18' },
      { id: 'stage3-civil-discourse-07', title: 'من صـ 160 إلى صـ 185', scheduledDate: '2026-08-19' },
      { id: 'stage3-civil-discourse-08', title: 'من صـ 186 إلى صـ 218', scheduledDate: '2026-08-20' },
      { id: 'stage3-civil-discourse-09', title: 'من صـ 219 إلى صـ 239', scheduledDate: '2026-08-25' },
      { id: 'stage3-civil-discourse-10', title: 'من صـ 240 إلى صـ 266', scheduledDate: '2026-08-26' },
      { id: 'stage3-civil-discourse-11', title: 'من صـ 267 إلى صـ 290', scheduledDate: '2026-08-27' },
      { id: 'stage3-civil-discourse-12', title: 'من صـ 291 إلى صـ 321', scheduledDate: '2026-09-01' },
      { id: 'stage3-civil-discourse-13', title: 'من صـ 321 إلى نهاية الكتاب', scheduledDate: '2026-09-02' }
    ]
  },
  {
    id: 'stage3-language-hadith', title: 'شرح لغة المحدث',
    url: 'https://drive.google.com/file/d/1KrClt3-j32ozkhL6Ol9LzwqPo89F2bgJ/view', lessons: [
      { id: 'stage3-language-hadith-01', title: 'من صـ 5 إلى صـ 53', scheduledDate: '2026-08-08' },
      { id: 'stage3-language-hadith-02', title: 'من صـ 54 إلى صـ 73', scheduledDate: '2026-08-09' },
      { id: 'stage3-language-hadith-03', title: 'من صـ 74 إلى صـ 90', scheduledDate: '2026-08-10' },
      { id: 'stage3-language-hadith-04', title: 'من صـ 91 إلى صـ 114', scheduledDate: '2026-08-15' },
      { id: 'stage3-language-hadith-05', title: 'من صـ 115 إلى صـ 135', scheduledDate: '2026-08-16' },
      { id: 'stage3-language-hadith-06', title: 'من صـ 136 إلى صـ 154', scheduledDate: '2026-08-17' },
      { id: 'stage3-language-hadith-07', title: 'من صـ 155 إلى صـ 184', scheduledDate: '2026-08-22' },
      { id: 'stage3-language-hadith-08', title: 'من صـ 184 إلى صـ 203', scheduledDate: '2026-08-23' },
      { id: 'stage3-language-hadith-09', title: 'من صـ 204 إلى صـ 222', scheduledDate: '2026-08-24' },
      { id: 'stage3-language-hadith-10', title: 'من صـ 222 إلى صـ 249', scheduledDate: '2026-08-29' },
      { id: 'stage3-language-hadith-11', title: 'من صـ 249 إلى صـ 263', scheduledDate: '2026-08-30' },
      { id: 'stage3-language-hadith-12', title: 'من صـ 264 إلى صـ 283', scheduledDate: '2026-08-31' },
      { id: 'stage3-language-hadith-13', title: 'من صـ 283 إلى صـ 299', scheduledDate: '2026-09-05' },
      { id: 'stage3-language-hadith-14', title: 'من صـ 299 إلى صـ 320', scheduledDate: '2026-09-06' },
      { id: 'stage3-language-hadith-15', title: 'من صـ 320 إلى صـ 346', scheduledDate: '2026-09-07' },
      { id: 'stage3-language-hadith-16', title: 'من صـ 346 إلى صـ 361', scheduledDate: '2026-09-12' },
      { id: 'stage3-language-hadith-17', title: 'من صـ 361 إلى صـ 381', scheduledDate: '2026-09-13' },
      { id: 'stage3-language-hadith-18', title: 'من صـ 382 إلى صـ 402', scheduledDate: '2026-09-14' },
      { id: 'stage3-language-hadith-19', title: 'من صـ 403 إلى صـ 425', scheduledDate: '2026-09-19' },
      { id: 'stage3-language-hadith-20', title: 'من صـ 426 إلى صـ 440', scheduledDate: '2026-09-20' },
      { id: 'stage3-language-hadith-21', title: 'من صـ 441 إلى نهاية الكتاب', scheduledDate: '2026-09-21' }
    ]
  },
  {
    id: 'stage3-western-thought', title: 'تاريخ الفكر الغربي الحديث',
    url: 'https://www.youtube.com/playlist?list=PLZmiPrHYOIsQMpwdg-LEUnb7c1LDxkQv5', lessons: [
      { id: 'stage3-western-thought-01', title: 'المحاضرة الأولى', scheduledDate: '2026-09-03' },
      { id: 'stage3-western-thought-02', title: 'المحاضرة الثانية - النصف الأول', scheduledDate: '2026-09-08' },
      { id: 'stage3-western-thought-03', title: 'المحاضرة الثانية - النصف الثاني', scheduledDate: '2026-09-09' },
      { id: 'stage3-western-thought-04', title: 'المحاضرة الثالثة - النصف الأول', scheduledDate: '2026-09-10' },
      { id: 'stage3-western-thought-05', title: 'المحاضرة الثالثة - النصف الثاني', scheduledDate: '2026-09-15' },
      { id: 'stage3-western-thought-06', title: 'المحاضرة الرابعة - النصف الأول', scheduledDate: '2026-09-16' },
      { id: 'stage3-western-thought-07', title: 'المحاضرة الرابعة - النصف الثاني', scheduledDate: '2026-09-17' },
      { id: 'stage3-western-thought-08', title: 'المحاضرة الخامسة', scheduledDate: '2026-09-22' },
      { id: 'stage3-western-thought-09', title: 'المحاضرة السادسة - النصف الأول', scheduledDate: '2026-09-23' },
      { id: 'stage3-western-thought-10', title: 'المحاضرة السادسة - النصف الثاني', scheduledDate: '2026-09-24' },
      { id: 'stage3-western-thought-11', title: 'المحاضرة السابعة - النصف الأول', scheduledDate: '2026-09-29' },
      { id: 'stage3-western-thought-12', title: 'المحاضرة السابعة - النصف الثاني', scheduledDate: '2026-09-30' },
      { id: 'stage3-western-thought-13', title: 'المحاضرة الثامنة - النصف الأول', scheduledDate: '2026-10-01' },
      { id: 'stage3-western-thought-14', title: 'المحاضرة الثامنة - النصف الثاني', scheduledDate: '2026-10-06' }
    ]
  },
  {
    id: 'stage3-knowledge-bearers', title: 'حملة العلم وحفظة الشريعة',
    url: 'https://www.youtube.com/playlist?list=PLZmiPrHYOIsScpWE8OHC_saqUIZMQmsFe', lessons: [
      { id: 'stage3-knowledge-bearers-01', title: 'المحاضرة الأولى - النصف الأول', scheduledDate: '2026-09-26' },
      { id: 'stage3-knowledge-bearers-02', title: 'المحاضرة الأولى - النصف الثاني', scheduledDate: '2026-09-27' },
      { id: 'stage3-knowledge-bearers-03', title: 'المحاضرة الثانية - النصف الأول', scheduledDate: '2026-09-28' },
      { id: 'stage3-knowledge-bearers-04', title: 'المحاضرة الثانية - النصف الثاني', scheduledDate: '2026-10-03' },
      { id: 'stage3-knowledge-bearers-05', title: 'المحاضرة الثالثة - النصف الأول', scheduledDate: '2026-10-04' },
      { id: 'stage3-knowledge-bearers-06', title: 'المحاضرة الثالثة - النصف الثاني', scheduledDate: '2026-10-05' },
      { id: 'stage3-knowledge-bearers-07', title: 'المحاضرة الرابعة - النصف الأول', scheduledDate: '2026-10-10' },
      { id: 'stage3-knowledge-bearers-08', title: 'المحاضرة الرابعة - النصف الثاني', scheduledDate: '2026-10-11' },
      { id: 'stage3-knowledge-bearers-09', title: 'المحاضرة الخامسة', scheduledDate: '2026-10-12' },
      { id: 'stage3-knowledge-bearers-10', title: 'المحاضرة السادسة - النصف الأول', scheduledDate: '2026-10-17' },
      { id: 'stage3-knowledge-bearers-11', title: 'المحاضرة السادسة - النصف الثاني', scheduledDate: '2026-10-18' }
    ]
  },
  {
    id: 'stage3-almirqah', title: 'المرقاة',
    url: 'https://drive.google.com/file/d/1Jlcvz8wYenu-H0ec9BydssYkQp-y4GKk/view', lessons: [
      { id: 'stage3-almirqah-01', title: 'من صـ 8 إلى صـ 52', scheduledDate: '2026-10-07' },
      { id: 'stage3-almirqah-02', title: 'من صـ 53 إلى صـ 87', scheduledDate: '2026-10-08' },
      { id: 'stage3-almirqah-03', title: 'من صـ 88 إلى صـ 119', scheduledDate: '2026-10-13' },
      { id: 'stage3-almirqah-04', title: 'من صـ 120 إلى نهاية الكتاب', scheduledDate: '2026-10-14' }
    ]
  },
  {
    id: 'stage3-sawiya', title: 'سوية المؤمن',
    url: 'https://www.youtube.com/playlist?list=PLZmiPrHYOIsS5j5KXnB8xMbSjy_7KYbCq', lessons: [
      { id: 'stage3-sawiya-01', title: 'العزيمة', scheduledDate: '2026-10-15' },
      { id: 'stage3-sawiya-02', title: 'الشتات', scheduledDate: '2026-10-20' },
      { id: 'stage3-sawiya-03', title: 'المسؤولية', scheduledDate: '2026-10-21' },
      { id: 'stage3-sawiya-04', title: 'الحكمة', scheduledDate: '2026-10-22' }
    ]
  },
  {
    id: 'stage3-hadith-methods', title: 'مناهج المحدثين',
    url: 'https://drive.google.com/file/d/1mVN4_29vTL6MXE3-y5cHLCcWO-lO0jNf/view', lessons: [
      { id: 'stage3-hadith-methods-01', title: 'من صـ 5 إلى صـ 33', scheduledDate: '2026-10-19' },
      { id: 'stage3-hadith-methods-02', title: 'من صـ 34 إلى صـ 66', scheduledDate: '2026-10-24' },
      { id: 'stage3-hadith-methods-03', title: 'من صـ 67 إلى صـ 97', scheduledDate: '2026-10-25' },
      { id: 'stage3-hadith-methods-04', title: 'من صـ 98 إلى صـ 131', scheduledDate: '2026-10-26' },
      { id: 'stage3-hadith-methods-05', title: 'من صـ 132 إلى صـ 166', scheduledDate: '2026-10-27' },
      { id: 'stage3-hadith-methods-06', title: 'من صـ 167 إلى صـ 193', scheduledDate: '2026-10-28' },
      { id: 'stage3-hadith-methods-07', title: 'من صـ 194 إلى صـ 229', scheduledDate: '2026-10-29' },
      { id: 'stage3-hadith-methods-08', title: 'من صـ 230 إلى نهاية الكتاب', scheduledDate: '2026-10-30' }
    ]
  },
  {
    id: 'stage3-followup', title: 'المتابعة العامة', lessons: [
      { id: 'stage3-followup-01', title: 'اختبار المرحلة الثالثة', scheduledDate: '2026-11-10' }
    ]
  }
];

export const programs = [
  { id: 'stage2', name: 'برنامج البناء الميسر', title: 'المرحلة الثانية', courses: stage2Courses },
  { id: 'stage3', name: 'برنامج البناء المنهجي', title: 'المرحلة الثالثة', courses: stage3Courses }
];
