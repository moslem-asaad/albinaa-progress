import { courses } from './data.js';
import { firebaseConfig } from './firebase-config.js';

const STORAGE_KEY = 'albinaaProgressV1';
const FIREBASE_VERSION = '12.1.0';
const elements = {
  courses: document.querySelector('#courses'), search: document.querySelector('#searchInput'),
  percent: document.querySelector('#overallPercent'), bar: document.querySelector('#overallBar'),
  completed: document.querySelector('#completedCount'), total: document.querySelector('#totalCount'),
  empty: document.querySelector('#emptyState'), auth: document.querySelector('#authButton'),
  user: document.querySelector('#userName'), status: document.querySelector('#syncStatus')
};

let state = loadLocalState();
let auth;
let db;
let currentUser = null;
let firestoreTimer;
let noteTimer;

function defaultState() {
  return { version: 1, completed: {}, notes: {}, dates: {}, expandedCourses: {}, updatedAt: null };
}

function loadLocalState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return { ...defaultState(), ...saved };
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
  return { completed, total: course.lessons.length, percent: Math.round(completed / course.lessons.length * 100) };
}

function render() {
  const query = normalizeArabic(elements.search.value);
  let visibleCourses = 0;
  elements.courses.innerHTML = courses.map(course => {
    const titleMatch = normalizeArabic(course.title).includes(query);
    const lessons = query && !titleMatch
      ? course.lessons.filter(lesson => normalizeArabic(lesson.title).includes(query))
      : course.lessons;
    if (query && !titleMatch && !lessons.length) return '';
    visibleCourses += 1;
    const stats = calculate(course);
    const expanded = query ? true : Boolean(state.expandedCourses[course.id]);
    return `
      <article class="course card" data-course-id="${course.id}">
        <header class="course-header">
          <div class="course-title-row">
            <h2>${course.title}</h2>
            <button class="toggle-course" type="button" aria-expanded="${expanded}" aria-controls="lessons-${course.id}">${expanded ? 'إخفاء' : 'عرض الدروس'}</button>
          </div>
          <div class="course-meta"><span>${stats.completed} من ${stats.total}</span><span>${stats.percent}%</span></div>
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

function renderLesson(lesson) {
  const completed = Boolean(state.completed[lesson.id]);
  return `
    <li class="lesson${completed ? ' completed' : ''}" data-lesson-id="${lesson.id}">
      <label class="lesson-main">
        <input type="checkbox" ${completed ? 'checked' : ''}>
        <span class="lesson-title">${lesson.title}</span>
      </label>
      <div class="lesson-details">
        <label><span class="sr-only">تاريخ ${lesson.title}</span><input class="lesson-date" type="date" value="${escapeAttribute(state.dates[lesson.id] || '')}" aria-label="تاريخ ${lesson.title}"></label>
        <label><span class="sr-only">ملاحظات ${lesson.title}</span><textarea class="lesson-note" placeholder="ملاحظات قصيرة..." aria-label="ملاحظات ${lesson.title}">${escapeText(state.notes[lesson.id] || '')}</textarea></label>
      </div>
    </li>`;
}

function escapeText(value) {
  return String(value).replace(/[&<>]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[character]);
}

function escapeAttribute(value) {
  return escapeText(value).replace(/"/g, '&quot;');
}

function updateOverall() {
  const allLessons = courses.flatMap(course => course.lessons);
  const completed = allLessons.filter(lesson => state.completed[lesson.id]).length;
  const percent = Math.round(completed / allLessons.length * 100);
  elements.completed.textContent = completed;
  elements.total.textContent = allLessons.length;
  elements.percent.textContent = `${percent}%`;
  elements.bar.style.width = `${percent}%`;
  elements.bar.parentElement.setAttribute('aria-valuenow', percent);
}

elements.courses.addEventListener('click', event => {
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

elements.search.addEventListener('input', render);

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
  return {
    version: 1,
    completed: { ...(remote.completed || {}), ...(local.completed || {}) },
    notes,
    dates: remoteTime > localTime ? { ...(local.dates || {}), ...(remote.dates || {}) } : { ...(remote.dates || {}), ...(local.dates || {}) },
    expandedCourses: { ...(remote.expandedCourses || {}), ...(local.expandedCourses || {}) },
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
      version: 1, completed: state.completed, notes: state.notes, dates: state.dates,
      expandedCourses: state.expandedCourses, updatedAt: firestoreModule.serverTimestamp()
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
