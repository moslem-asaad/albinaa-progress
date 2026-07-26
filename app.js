import { programs } from './data.js?v=10';
import { firebaseConfig } from './firebase-config.js';

const STORAGE_KEY = 'albinaaProgressV1';
const FIREBASE_VERSION = '12.1.0';
const elements = {
  courses: document.querySelector('#courses'), search: document.querySelector('#searchInput'),
  percent: document.querySelector('#overallPercent'), bar: document.querySelector('#overallBar'),
  completed: document.querySelector('#completedCount'), total: document.querySelector('#totalCount'),
  empty: document.querySelector('#emptyState'), auth: document.querySelector('#authButton'),
  user: document.querySelector('#userName'), status: document.querySelector('#syncStatus'),
  manage: document.querySelector('#manageCoursesButton'), dialog: document.querySelector('#courseDialog'),
  courseForm: document.querySelector('#courseForm'), courseSelect: document.querySelector('#courseSelect'),
  courseTitle: document.querySelector('#courseTitle'), courseUrl: document.querySelector('#courseUrl'),
  newLessons: document.querySelector('#newLessons'), notePage: document.querySelector('#notePageDialog'),
  notePageTitle: document.querySelector('#notePageTitle'), notePageTextarea: document.querySelector('#notePageTextarea'),
  programTabs: document.querySelector('#programTabs'), programSubtitle: document.querySelector('#programSubtitle'),
  programName: document.querySelector('#programName')
};

let state = loadLocalState();
let auth;
let db;
let currentUser = null;
let firestoreTimer;
let noteTimer;
let openNoteId = null;
const defaultLessonDates = new Map(programs.flatMap(program => program.courses.flatMap(course =>
  course.lessons.map(lesson => [lesson.id, lesson.scheduledDate])
)));

function defaultState() {
  return { version: 2, activeProgramId: 'stage2', completed: {}, notes: {}, dates: {}, expandedCourses: {}, programCourses: {}, updatedAt: null };
}

function getCourses() {
  const program = programs.find(item => item.id === state.activeProgramId) || programs[0];
  const customCourses = state.programCourses?.[program.id] || (program.id === 'stage2' ? state.courses : null);
  if (!customCourses) return program.courses;
  return customCourses.map(course => ({
    ...course,
    lessons: course.lessons.map(lesson => ({
      ...lesson,
      scheduledDate: lesson.scheduledDate || defaultLessonDates.get(lesson.id)
    }))
  }));
}

function loadLocalState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const loaded = { ...defaultState(), ...saved, programCourses: { ...(saved.programCourses || {}) } };
    if (saved.courses && !loaded.programCourses.stage2) loaded.programCourses.stage2 = saved.courses;
    if (!programs.some(program => program.id === loaded.activeProgramId)) loaded.activeProgramId = 'stage2';
    return loaded;
  } catch {
    return defaultState();
  }
}

function saveLocal({ sync = true } = {}) {
  state.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (!navigator.onLine) setStatus('غير متصل');
  else if (currentUser && sync) scheduleFirestoreSave();
  else if (!currentUser && isFirebaseConfigured()) setStatus('محفوظ محلياً');
}

function normalizeArabic(value) {
  return value.toLocaleLowerCase('ar').normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').trim();
}

function calculate(course) {
  const completed = course.lessons.filter(lesson => state.completed[lesson.id]).length;
  const total = course.lessons.length;
  return { completed, total, percent: total ? Math.round(completed / total * 100) : 0 };
}

function render() {
  renderProgramTabs();
  const query = normalizeArabic(elements.search.value);
  let visibleCourses = 0;
  elements.courses.innerHTML = getCourses().map(course => {
    const titleMatch = normalizeArabic(course.title).includes(query);
    const lessons = query && !titleMatch
      ? course.lessons.filter(lesson => normalizeArabic(lesson.title).includes(query))
      : course.lessons;
    if (query && !titleMatch && !lessons.length) return '';
    visibleCourses += 1;
    const stats = calculate(course);
    const coursePeriod = getCoursePeriod(course);
    const catchUp = getCatchUpStatus(course);
    const expanded = query ? true : Boolean(state.expandedCourses[course.id]);
    return `
      <article class="course card" data-course-id="${course.id}">
        <header class="course-header">
          <div class="course-title-row">
            <div class="course-title-wrap">
              <h2>${course.title}</h2>
              ${coursePeriod ? `<small class="course-period">من ${coursePeriod.start} إلى ${coursePeriod.end}</small>` : ''}
              <a class="course-link" href="${escapeAttribute(course.url || '#')}" target="_blank" rel="noopener noreferrer" ${course.url ? '' : 'hidden'}>
                <span class="link-icon" aria-hidden="true">↗</span>
                رابط المادة
              </a>
            </div>
            <button class="toggle-course" type="button" aria-expanded="${expanded}" aria-controls="lessons-${course.id}">${expanded ? 'إخفاء' : 'عرض الدروس'}</button>
          </div>
          <div class="course-meta">
            <span>${stats.completed} من ${stats.total}</span>
            ${catchUp ? `<span class="catch-up ${catchUp.kind}">${catchUp.text}</span>` : ''}
            <span>${stats.percent}%</span>
          </div>
          <div class="progress" role="progressbar" aria-label="تقدم ${course.title}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${stats.percent}"><span style="width:${stats.percent}%"></span></div>
        </header>
        <ul class="lessons" id="lessons-${course.id}" ${expanded ? '' : 'hidden'}>
          ${lessons.map(lesson => renderLesson(lesson)).join('')}
        </ul>
      </article>`;
  }).join('');
  elements.empty.hidden = visibleCourses > 0;
  updateOverall();
}

function renderProgramTabs() {
  const active = programs.find(program => program.id === state.activeProgramId) || programs[0];
  elements.programName.textContent = active.name;
  elements.programSubtitle.textContent = active.title;
  document.title = `${active.name} - ${active.title}`;
  elements.programTabs.innerHTML = programs.map(program => `
    <button class="program-tab" type="button" role="tab" data-program-id="${program.id}"
      aria-selected="${program.id === active.id}">${program.name.replace('برنامج ', '')} - ${program.title}</button>
  `).join('');
}

function renderLesson(lesson) {
  const completed = Boolean(state.completed[lesson.id]);
  const scheduledDate = lesson.scheduledDate ? formatScheduledDate(lesson.scheduledDate) : '';
  return `
    <li class="lesson${completed ? ' completed' : ''}" data-lesson-id="${lesson.id}">
      <label class="lesson-main">
        <input type="checkbox" ${completed ? 'checked' : ''}>
        <span class="lesson-text">
          <span class="lesson-title">${lesson.title}</span>
          ${scheduledDate ? `<small class="scheduled-date">الموعد: ${scheduledDate}</small>` : ''}
        </span>
      </label>
      <div class="lesson-details">
        <label><span class="sr-only">تاريخ ${lesson.title}</span><input class="lesson-date" type="date" value="${escapeAttribute(state.dates[lesson.id] || '')}" aria-label="تاريخ ${lesson.title}"></label>
        <div class="note-field">
          <div class="note-heading">
            <span>الملاحظات</span>
            <span class="note-controls">
              <button class="expand-note" type="button" aria-expanded="false">تكبير</button>
              <button class="open-note-page" type="button">فتح كصفحة</button>
            </span>
          </div>
          <label><span class="sr-only">ملاحظات ${lesson.title}</span><textarea class="lesson-note" placeholder="ملاحظات قصيرة..." aria-label="ملاحظات ${lesson.title}">${escapeText(state.notes[lesson.id] || '')}</textarea></label>
        </div>
      </div>
    </li>`;
}

function formatScheduledDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  const pad = number => String(number).padStart(2, '0');
  return `${pad(day)}/${pad(month)}/${String(year).slice(-2)}`;
}

function getCoursePeriod(course) {
  const dates = course.lessons.map(lesson => lesson.scheduledDate).filter(Boolean).sort();
  if (!dates.length) return null;
  return { start: formatScheduledDate(dates[0]), end: formatScheduledDate(dates[dates.length - 1]) };
}

function getCatchUpStatus(course) {
  const now = new Date();
  const today = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
  const scheduled = course.lessons.filter(lesson => lesson.scheduledDate);
  if (!scheduled.length) return null;
  const due = scheduled.filter(lesson => lesson.scheduledDate <= today);
  if (!due.length) return { kind: 'upcoming', text: 'لم يبدأ بعد' };
  const remaining = due.filter(lesson => !state.completed[lesson.id]).length;
  if (!remaining) return { kind: 'on-track', text: 'مكتمل حتى اليوم' };
  return { kind: 'behind', text: `متبقي للحاق: ${remaining}` };
}

function escapeText(value) {
  return String(value).replace(/[&<>]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[character]);
}

function escapeAttribute(value) {
  return escapeText(value).replace(/"/g, '&quot;');
}

function updateOverall() {
  const allLessons = getCourses().flatMap(course => course.lessons);
  const completed = allLessons.filter(lesson => state.completed[lesson.id]).length;
  const percent = Math.round(completed / allLessons.length * 100);
  elements.completed.textContent = completed;
  elements.total.textContent = allLessons.length;
  elements.percent.textContent = `${percent}%`;
  elements.bar.style.width = `${percent}%`;
  elements.bar.parentElement.setAttribute('aria-valuenow', percent);
}

elements.courses.addEventListener('click', event => {
  const pageButton = event.target.closest('.open-note-page');
  if (pageButton) {
    const lesson = pageButton.closest('.lesson');
    openNoteId = lesson.dataset.lessonId;
    elements.notePageTitle.textContent = lesson.querySelector('.lesson-title').textContent;
    elements.notePageTextarea.value = state.notes[openNoteId] || '';
    elements.notePage.showModal();
    elements.notePageTextarea.focus();
    return;
  }
  const noteButton = event.target.closest('.expand-note');
  if (noteButton) {
    const field = noteButton.closest('.note-field');
    const expanded = field.classList.toggle('expanded');
    noteButton.setAttribute('aria-expanded', expanded);
    noteButton.textContent = expanded ? 'تصغير' : 'تكبير';
    if (expanded) field.querySelector('textarea').focus();
    return;
  }
  const toggle = event.target.closest('.toggle-course');
  if (!toggle || elements.search.value.trim()) return;
  const courseId = toggle.closest('.course').dataset.courseId;
  state.expandedCourses[courseId] = !state.expandedCourses[courseId];
  saveLocal();
  render();
});

elements.courses.addEventListener('change', event => {
  const lesson = event.target.closest('.lesson');
  if (!lesson) return;
  const id = lesson.dataset.lessonId;
  if (event.target.matches('input[type="checkbox"]')) {
    if (event.target.checked) state.completed[id] = true;
    else delete state.completed[id];
    saveLocal();
    render();
  } else if (event.target.matches('.lesson-date')) {
    if (event.target.value) state.dates[id] = event.target.value;
    else delete state.dates[id];
    saveLocal();
  }
});

elements.courses.addEventListener('input', event => {
  if (!event.target.matches('.lesson-note')) return;
  const id = event.target.closest('.lesson').dataset.lessonId;
  state.notes[id] = event.target.value;
  clearTimeout(noteTimer);
  noteTimer = setTimeout(() => saveLocal(), 500);
});

elements.notePageTextarea.addEventListener('input', () => {
  if (!openNoteId) return;
  state.notes[openNoteId] = elements.notePageTextarea.value;
  const inlineNote = elements.courses.querySelector(`[data-lesson-id="${openNoteId}"] .lesson-note`);
  if (inlineNote) inlineNote.value = elements.notePageTextarea.value;
  clearTimeout(noteTimer);
  noteTimer = setTimeout(() => saveLocal(), 500);
});

function closeNotePage() {
  clearTimeout(noteTimer);
  if (openNoteId) saveLocal();
  openNoteId = null;
  elements.notePage.close();
}

document.querySelector('#closeNotePage').addEventListener('click', closeNotePage);
elements.notePage.addEventListener('cancel', event => {
  event.preventDefault();
  closeNotePage();
});

elements.search.addEventListener('input', render);
elements.programTabs.addEventListener('click', event => {
  const tab = event.target.closest('.program-tab');
  if (!tab || tab.dataset.programId === state.activeProgramId) return;
  state.activeProgramId = tab.dataset.programId;
  elements.search.value = '';
  saveLocal();
  render();
});

function editableCourses() {
  const program = programs.find(item => item.id === state.activeProgramId) || programs[0];
  state.programCourses ||= {};
  if (!state.programCourses[program.id]) state.programCourses[program.id] = structuredClone(getCourses());
  return state.programCourses[program.id];
}

function fillCourseEditor(courseId) {
  const course = editableCourses().find(item => item.id === courseId);
  if (!course) return;
  elements.courseSelect.value = course.id;
  elements.courseTitle.value = course.title;
  elements.courseUrl.value = course.url || '';
  elements.newLessons.value = '';
}

function openCourseEditor() {
  const courses = editableCourses();
  elements.courseSelect.innerHTML = courses.map(course =>
    `<option value="${escapeAttribute(course.id)}">${escapeText(course.title)}</option>`
  ).join('');
  fillCourseEditor(courses[0].id);
  elements.dialog.showModal();
}

function uniqueId(prefix) {
  const random = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${random}`;
}

elements.manage.addEventListener('click', openCourseEditor);
elements.courseSelect.addEventListener('change', () => fillCourseEditor(elements.courseSelect.value));
document.querySelector('#closeCourseDialog').addEventListener('click', () => elements.dialog.close());
document.querySelector('#newCourseButton').addEventListener('click', () => {
  const course = { id: uniqueId('course'), title: 'مقرر جديد', url: '', lessons: [] };
  editableCourses().push(course);
  const option = document.createElement('option');
  option.value = course.id;
  option.textContent = course.title;
  elements.courseSelect.append(option);
  fillCourseEditor(course.id);
  elements.courseTitle.focus();
});

elements.courseForm.addEventListener('submit', event => {
  event.preventDefault();
  const course = editableCourses().find(item => item.id === elements.courseSelect.value);
  if (!course) return;
  course.title = elements.courseTitle.value.trim();
  course.url = elements.courseUrl.value.trim();
  const additions = elements.newLessons.value.split('\n').map(title => title.trim()).filter(Boolean);
  course.lessons.push(...additions.map(title => ({ id: uniqueId(course.id), title })));
  saveLocal();
  render();
  elements.dialog.close();
});

function isFirebaseConfigured() {
  return Object.values(firebaseConfig).every(value => value && !value.includes('YOUR_'));
}

function setStatus(status) {
  elements.status.textContent = status;
}

async function initializeFirebase() {
  if (!isFirebaseConfigured()) return;
  try {
    const appModule = await import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app.js`);
    const authModule = await import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-auth.js`);
    const firestoreModule = await import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-firestore.js`);
    const firebaseApp = appModule.initializeApp(firebaseConfig);
    auth = authModule.getAuth(firebaseApp);
    db = firestoreModule.getFirestore(firebaseApp);
    elements.auth.disabled = false;
    elements.auth.addEventListener('click', () => handleAuth(authModule));
    try { await authModule.getRedirectResult(auth); } catch { setStatus('تعذر الحفظ'); }
    authModule.onAuthStateChanged(auth, user => handleAuthChange(user, firestoreModule));
  } catch {
    elements.auth.disabled = true;
    setStatus(navigator.onLine ? 'تعذر الحفظ' : 'غير متصل');
  }
}

async function handleAuth(authModule) {
  if (currentUser) {
    try { await authModule.signOut(auth); } catch { setStatus('تعذر الحفظ'); }
    return;
  }
  const provider = new authModule.GoogleAuthProvider();
  try {
    await authModule.signInWithPopup(auth, provider);
  } catch (error) {
    if (['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment', 'auth/cancelled-popup-request'].includes(error.code)) {
      try { await authModule.signInWithRedirect(auth, provider); } catch { setStatus('تعذر الحفظ'); }
    } else if (error.code !== 'auth/popup-closed-by-user') setStatus('تعذر الحفظ');
  }
}

async function handleAuthChange(user, firestoreModule) {
  currentUser = user;
  elements.auth.textContent = user ? 'تسجيل الخروج' : 'تسجيل الدخول بحساب Google';
  elements.user.hidden = !user;
  elements.user.textContent = user ? (user.displayName || user.email || '') : '';
  if (!user) { setStatus(navigator.onLine ? 'محفوظ محلياً' : 'غير متصل'); return; }
  setStatus(navigator.onLine ? 'جاري الحفظ...' : 'غير متصل');
  if (!navigator.onLine) return;
  try {
    const ref = firestoreModule.doc(db, 'users', user.uid);
    const snapshot = await firestoreModule.getDoc(ref);
    state = mergeStates(state, snapshot.exists() ? snapshot.data() : {});
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    render();
    await saveToFirestore(firestoreModule);
  } catch { setStatus('تعذر الحفظ'); }
}

function timestampValue(value) {
  if (!value) return 0;
  if (typeof value.toMillis === 'function') return value.toMillis();
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function mergeStates(local, remote) {
  const localTime = timestampValue(local.updatedAt);
  const remoteTime = timestampValue(remote.updatedAt);
  const notes = { ...(remote.notes || {}) };
  for (const [id, localNote] of Object.entries(local.notes || {})) {
    const remoteNote = notes[id];
    if (!remoteNote || (localNote && localTime >= remoteTime)) notes[id] = localNote;
  }
  const localProgramCourses = { ...(local.programCourses || {}) };
  const remoteProgramCourses = { ...(remote.programCourses || {}) };
  if (local.courses && !localProgramCourses.stage2) localProgramCourses.stage2 = local.courses;
  if (remote.courses && !remoteProgramCourses.stage2) remoteProgramCourses.stage2 = remote.courses;
  return {
    version: 2,
    activeProgramId: local.activeProgramId || remote.activeProgramId || 'stage2',
    completed: { ...(remote.completed || {}), ...(local.completed || {}) },
    notes,
    dates: remoteTime > localTime ? { ...(local.dates || {}), ...(remote.dates || {}) } : { ...(remote.dates || {}), ...(local.dates || {}) },
    expandedCourses: { ...(remote.expandedCourses || {}), ...(local.expandedCourses || {}) },
    programCourses: remoteTime > localTime
      ? { ...localProgramCourses, ...remoteProgramCourses }
      : { ...remoteProgramCourses, ...localProgramCourses },
    updatedAt: new Date(Math.max(localTime, remoteTime, Date.now())).toISOString()
  };
}

function scheduleFirestoreSave() {
  clearTimeout(firestoreTimer);
  setStatus(navigator.onLine ? 'جاري الحفظ...' : 'غير متصل');
  if (!navigator.onLine) return;
  firestoreTimer = setTimeout(() => saveToFirestore(), 1000);
}

async function saveToFirestore(providedModule) {
  if (!currentUser || !navigator.onLine) return;
  try {
    const firestoreModule = providedModule || await import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-firestore.js`);
    await firestoreModule.setDoc(firestoreModule.doc(db, 'users', currentUser.uid), {
      version: 2, activeProgramId: state.activeProgramId,
      completed: state.completed, notes: state.notes, dates: state.dates,
      expandedCourses: state.expandedCourses, programCourses: state.programCourses,
      updatedAt: firestoreModule.serverTimestamp()
    });
    setStatus('تم الحفظ');
  } catch { setStatus(navigator.onLine ? 'تعذر الحفظ' : 'غير متصل'); }
}

window.addEventListener('offline', () => setStatus('غير متصل'));
window.addEventListener('online', () => {
  if (currentUser) scheduleFirestoreSave();
  else setStatus(isFirebaseConfigured() ? 'محفوظ محلياً' : 'المزامنة السحابية غير مفعلة');
});

render();
initializeFirebase();
