/**
 * 長井ビル４Ｆ クリニック掃除 スケジュール表アプリ
 * 火曜日・金曜日の清掃スケジュールを管理
 */

// ==========================================================================
// Constants
// ==========================================================================

const STORAGE_KEY = 'cleaning-schedule-data';
const SETTINGS_KEY = 'cleaning-schedule-settings';

// ==========================================================================
// i18n Translations
// ==========================================================================

const translations = {
  ja: {
    dayNames: ['日', '月', '火', '水', '木', '金', '土'],
    title: '長井ビル４Ｆ　クリニック掃除',
    subtitle: '清掃スケジュール表',
    prevMonth: '前月',
    nextMonth: '次月',
    cleaningDays: '清掃曜日：',
    daySun: '日', dayMon: '月', dayTue: '火', dayWed: '水', dayThu: '木', dayFri: '金', daySat: '土',
    reset: 'リセット',
    thisMonth: '今月に戻る',
    print: '印刷',
    scheduledDays: '今月の予定日：',
    days: '日',
    addDate: '日付を追加：',
    add: '＋ 追加',
    deleteHint: '※ 行の「×」ボタンで個別に削除できます',
    date: '日付',
    dayOfWeek: '曜日',
    staffName: '担当者名',
    entryTime: '入室時間',
    exitTime: '退室時間',
    cleaningAreas: '掃除箇所',
    toilet: 'トイレ',
    kitchen: '給湯室',
    vacuum: '掃除機<br>掛け',
    garbage: 'ゴミ<br>処理',
    clinicCheck: 'クリニック<br>確認',
    notes: '連絡事項',
    remarks: '備考',
    footerNote: '※ 本表は月初に印刷し、清掃完了後に各項目にチェックを入れてください。クリニック確認欄はクリニック側で記入してください。',
    monthFormat: (year, month) => `${year}年${month}月`,
    staffPlaceholder: '担当者名',
    notesPlaceholder: '連絡事項',
    remarksPlaceholder: '備考',
    spotLabel: '(追加)',
    confirmDelete: (date) => `${date} を削除しますか？`,
    confirmReset: 'すべての設定とデータをリセットしますか？',
    resetComplete: 'リセットしました',
    selectDate: '追加する日付を選択してください',
    alreadyAdded: 'この日付は既に追加されています',
    alreadyIncluded: 'この日付は既に曜日設定で含まれています'
  },
  en: {
    dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    title: 'Nagai Bldg 4F Clinic Cleaning',
    subtitle: 'Cleaning Schedule',
    prevMonth: 'Prev',
    nextMonth: 'Next',
    cleaningDays: 'Cleaning Days:',
    daySun: 'Sun', dayMon: 'Mon', dayTue: 'Tue', dayWed: 'Wed', dayThu: 'Thu', dayFri: 'Fri', daySat: 'Sat',
    reset: 'Reset',
    thisMonth: 'This Month',
    print: 'Print',
    scheduledDays: 'Scheduled Days: ',
    days: '',
    addDate: 'Add Date:',
    add: '+ Add',
    deleteHint: '* Click "×" to delete individual rows',
    date: 'Date',
    dayOfWeek: 'Day',
    staffName: 'Staff',
    entryTime: 'Entry',
    exitTime: 'Exit',
    cleaningAreas: 'Cleaning Areas',
    toilet: 'Toilet',
    kitchen: 'Kitchen',
    vacuum: 'Vacuum',
    garbage: 'Trash',
    clinicCheck: 'Clinic<br>Check',
    notes: 'Notes',
    remarks: 'Remarks',
    footerNote: '* Print at the beginning of each month. Check each item after cleaning is complete. Clinic confirmation is to be filled in by the clinic.',
    monthFormat: (year, month) => `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1]} ${year}`,
    staffPlaceholder: 'Staff Name',
    notesPlaceholder: 'Notes',
    remarksPlaceholder: 'Remarks',
    spotLabel: '(Added)',
    confirmDelete: (date) => `Delete ${date}?`,
    confirmReset: 'Reset all settings and data?',
    resetComplete: 'Reset complete',
    selectDate: 'Please select a date to add',
    alreadyAdded: 'This date is already added',
    alreadyIncluded: 'This date is already included in the weekday settings'
  }
};

let currentLang = 'ja';

// ==========================================================================
// State
// ==========================================================================

let currentDate = new Date();
let scheduleData = {};
let selectedDays = [2, 5]; // デフォルト：火曜日(2)、金曜日(5)
let spotDates = {}; // 月ごとのスポット追加/削除日 { "2026-03": { added: ["2026-03-15"], removed: ["2026-03-03"] } }

// ==========================================================================
// DOM Elements
// ==========================================================================

const elements = {
  currentMonth: document.getElementById('current-month'),
  printMonth: document.getElementById('print-month'),
  scheduleBody: document.getElementById('schedule-body'),
  dayCount: document.getElementById('day-count'),
  prevMonthBtn: document.getElementById('prev-month'),
  nextMonthBtn: document.getElementById('next-month'),
  todayBtn: document.getElementById('today-btn'),
  printBtn: document.getElementById('print-btn'),
  dayCheckboxes: {
    0: document.getElementById('day-sun'),
    1: document.getElementById('day-mon'),
    2: document.getElementById('day-tue'),
    3: document.getElementById('day-wed'),
    4: document.getElementById('day-thu'),
    5: document.getElementById('day-fri'),
    6: document.getElementById('day-sat'),
  },
  spotAddDate: document.getElementById('spot-add-date'),
  spotAddBtn: document.getElementById('spot-add-btn'),
  resetBtn: document.getElementById('reset-btn'),
  langBtn: document.getElementById('lang-btn'),
};

// ==========================================================================
// Utility Functions
// ==========================================================================

/**
 * 指定月の清掃日を取得（選択された曜日 + スポット追加/削除を考慮）
 * @param {number} year
 * @param {number} month
 * @returns {{date: Date, isSpot: boolean}[]}
 */
function getCleaningDays(year, month) {
  const monthKey = getMonthKey(new Date(year, month, 1));
  const monthSpot = spotDates[monthKey] || { added: [], removed: [] };

  const days = [];
  const date = new Date(year, month, 1);

  // 曜日ベースの日付を取得
  while (date.getMonth() === month) {
    const dayOfWeek = date.getDay();
    const dateKey = getDateKey(date);

    // 削除されていない曜日ベースの日付を追加
    if (selectedDays.includes(dayOfWeek) && !monthSpot.removed.includes(dateKey)) {
      days.push({ date: new Date(date), isSpot: false });
    }
    date.setDate(date.getDate() + 1);
  }

  // スポット追加日を追加
  monthSpot.added.forEach((dateKey) => {
    const [y, m, d] = dateKey.split('-').map(Number);
    const spotDate = new Date(y, m - 1, d);
    // 既に存在しない場合のみ追加
    if (!days.some((item) => getDateKey(item.date) === dateKey)) {
      days.push({ date: spotDate, isSpot: true });
    }
  });

  // 日付順にソート
  days.sort((a, b) => a.date - b.date);

  return days;
}

/**
 * 日付をフォーマット
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
}

/**
 * 日付キーを生成（データ保存用）
 * @param {Date} date
 * @returns {string}
 */
function getDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * 月キーを生成
 * @param {Date} date
 * @returns {string}
 */
function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

// ==========================================================================
// Data Management
// ==========================================================================

/**
 * ローカルストレージからデータを読み込み
 */
function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      scheduleData = JSON.parse(saved);
    }
  } catch (e) {
    console.error('データの読み込みに失敗しました:', e);
    scheduleData = {};
  }
}

/**
 * 設定を読み込み
 */
function loadSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      const settings = JSON.parse(saved);
      if (settings.selectedDays && Array.isArray(settings.selectedDays) && settings.selectedDays.length > 0) {
        selectedDays = settings.selectedDays;
      }
      if (settings.spotDates && typeof settings.spotDates === 'object') {
        spotDates = settings.spotDates;
      }
      if (settings.lang && (settings.lang === 'ja' || settings.lang === 'en')) {
        currentLang = settings.lang;
      }
    }
  } catch (e) {
    console.error('設定の読み込みに失敗しました:', e);
    selectedDays = [2, 5];
  }
  
  if (!selectedDays || selectedDays.length === 0) {
    selectedDays = [2, 5];
  }
}

/**
 * 翻訳を取得
 */
function t(key) {
  return translations[currentLang][key] || translations['ja'][key] || key;
}

/**
 * 曜日名を取得
 */
function getDayName(dayOfWeek) {
  return translations[currentLang].dayNames[dayOfWeek];
}

/**
 * 言語を切り替え
 */
function toggleLanguage() {
  currentLang = currentLang === 'ja' ? 'en' : 'ja';
  saveSettings();
  applyTranslations();
  updateMonthDisplay();
  renderSchedule();
}

/**
 * 翻訳を適用
 */
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = t(key);
    if (translation) {
      el.innerHTML = translation;
    }
  });
  
  // Update lang button text
  if (elements.langBtn) {
    elements.langBtn.textContent = currentLang === 'ja' ? 'EN / 日本語' : '日本語 / EN';
  }
  
  // Update HTML lang attribute
  document.documentElement.lang = currentLang === 'ja' ? 'ja' : 'en';
}

/**
 * 設定を保存
 */
function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ selectedDays, spotDates, lang: currentLang }));
  } catch (e) {
    console.error('設定の保存に失敗しました:', e);
  }
}

/**
 * ローカルストレージにデータを保存
 */
function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scheduleData));
  } catch (e) {
    console.error('データの保存に失敗しました:', e);
  }
}

/**
 * 特定日のデータを取得
 * @param {string} dateKey
 * @returns {Object}
 */
function getDayData(dateKey) {
  return (
    scheduleData[dateKey] || {
      staff: '',
      entryTime: '',
      exitTime: '',
      toilet: false,
      kitchen: false,
      vacuum: false,
      garbage: false,
      clinicCheck: false,
      notes: '',
      remarks: '',
    }
  );
}

/**
 * 特定日のデータを更新
 * @param {string} dateKey
 * @param {string} field
 * @param {any} value
 */
function updateDayData(dateKey, field, value) {
  if (!scheduleData[dateKey]) {
    scheduleData[dateKey] = getDayData(dateKey);
  }
  scheduleData[dateKey][field] = value;
  saveData();
}

// ==========================================================================
// UI Rendering
// ==========================================================================

/**
 * 月表示を更新
 */
function updateMonthDisplay() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const monthText = translations[currentLang].monthFormat(year, month);

  elements.currentMonth.textContent = monthText;
  elements.printMonth.textContent = monthText;
}

/**
 * スケジュール表を描画
 */
function renderSchedule() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const cleaningDays = getCleaningDays(year, month);

  // 日数を更新
  elements.dayCount.textContent = cleaningDays.length;

  // テーブルをクリア
  elements.scheduleBody.innerHTML = '';

  // 各清掃日の行を生成
  cleaningDays.forEach((item) => {
    const row = createScheduleRow(item.date, item.isSpot);
    elements.scheduleBody.appendChild(row);
  });

  // 日付入力の月を現在表示月に設定
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
  if (elements.spotAddDate) {
    elements.spotAddDate.value = '';
    elements.spotAddDate.min = `${monthStr}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    elements.spotAddDate.max = `${monthStr}-${String(lastDay).padStart(2, '0')}`;
  }
}

/**
 * 曜日に応じた行のクラス名を取得
 * @param {number} dayOfWeek
 * @returns {string}
 */
function getRowClass(dayOfWeek) {
  const classMap = {
    0: 'row--sunday',
    1: 'row--monday',
    2: 'row--tuesday',
    3: 'row--wednesday',
    4: 'row--thursday',
    5: 'row--friday',
    6: 'row--saturday',
  };
  return classMap[dayOfWeek] || '';
}

/**
 * 曜日に応じたセルのクラス名を取得
 * @param {number} dayOfWeek
 * @returns {string}
 */
function getDayClass(dayOfWeek) {
  const classMap = {
    0: 'schedule__td--sunday',
    2: 'schedule__td--tuesday',
    5: 'schedule__td--friday',
    6: 'schedule__td--saturday',
  };
  return classMap[dayOfWeek] || '';
}

/**
 * スケジュール行を生成
 * @param {Date} date
 * @param {boolean} isSpot
 * @returns {HTMLTableRowElement}
 */
function createScheduleRow(date, isSpot = false) {
  const dateKey = getDateKey(date);
  const dayOfWeek = date.getDay();
  const data = getDayData(dateKey);

  const row = document.createElement('tr');
  row.className = isSpot ? 'row--spot' : getRowClass(dayOfWeek);
  row.dataset.date = dateKey;
  row.dataset.isSpot = isSpot ? 'true' : 'false';

  const spotBadge = isSpot ? `<span class="spot-badge">${t('spotLabel')}</span>` : '';

  row.innerHTML = `
    <td class="schedule__td schedule__td--action no-print">
      <button type="button" class="btn--delete" data-action="delete" title="Delete">×</button>
    </td>
    <td class="schedule__td schedule__td--date">${formatDate(date)}${spotBadge}</td>
    <td class="schedule__td schedule__td--day ${getDayClass(dayOfWeek)}">
      ${getDayName(dayOfWeek)}
    </td>
    <td class="schedule__td">
      <input type="text" 
             class="schedule__input schedule__input--text" 
             data-field="staff" 
             value="${escapeHtml(data.staff)}" 
             placeholder="${t('staffPlaceholder')}">
    </td>
    <td class="schedule__td">
      <input type="time" 
             class="schedule__input schedule__input--time" 
             data-field="entryTime" 
             value="${data.entryTime}">
    </td>
    <td class="schedule__td">
      <input type="time" 
             class="schedule__input schedule__input--time" 
             data-field="exitTime" 
             value="${data.exitTime}">
    </td>
    <td class="schedule__td">
      <div class="schedule__checkbox-wrapper">
        <input type="checkbox" 
               class="schedule__checkbox" 
               data-field="toilet" 
               ${data.toilet ? 'checked' : ''}>
      </div>
    </td>
    <td class="schedule__td">
      <div class="schedule__checkbox-wrapper">
        <input type="checkbox" 
               class="schedule__checkbox" 
               data-field="kitchen" 
               ${data.kitchen ? 'checked' : ''}>
      </div>
    </td>
    <td class="schedule__td">
      <div class="schedule__checkbox-wrapper">
        <input type="checkbox" 
               class="schedule__checkbox" 
               data-field="vacuum" 
               ${data.vacuum ? 'checked' : ''}>
      </div>
    </td>
    <td class="schedule__td">
      <div class="schedule__checkbox-wrapper">
        <input type="checkbox" 
               class="schedule__checkbox" 
               data-field="garbage" 
               ${data.garbage ? 'checked' : ''}>
      </div>
    </td>
    <td class="schedule__td schedule__td--clinic">
      <div class="schedule__checkbox-wrapper">
        <input type="checkbox" 
               class="schedule__checkbox" 
               data-field="clinicCheck" 
               ${data.clinicCheck ? 'checked' : ''}>
      </div>
    </td>
    <td class="schedule__td">
      <input type="text" 
             class="schedule__input schedule__input--text" 
             data-field="notes" 
             value="${escapeHtml(data.notes)}" 
             placeholder="${t('notesPlaceholder')}">
    </td>
    <td class="schedule__td">
      <input type="text" 
             class="schedule__input schedule__input--text" 
             data-field="remarks" 
             value="${escapeHtml(data.remarks)}" 
             placeholder="${t('remarksPlaceholder')}">
    </td>
  `;

  return row;
}

/**
 * HTMLエスケープ
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==========================================================================
// Event Handlers
// ==========================================================================

/**
 * 前月へ移動
 */
function goToPrevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  updateMonthDisplay();
  renderSchedule();
}

/**
 * 次月へ移動
 */
function goToNextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  updateMonthDisplay();
  renderSchedule();
}

/**
 * 今月へ戻る
 */
function goToToday() {
  currentDate = new Date();
  updateMonthDisplay();
  renderSchedule();
}

/**
 * 印刷
 */
function printSchedule() {
  window.print();
}

/**
 * 入力変更ハンドラ
 * @param {Event} event
 */
function handleInputChange(event) {
  const target = event.target;
  const field = target.dataset.field;

  if (!field) return;

  const row = target.closest('tr');
  if (!row) return;

  const dateKey = row.dataset.date;
  const value = target.type === 'checkbox' ? target.checked : target.value;

  updateDayData(dateKey, field, value);
}

// ==========================================================================
// Event Listeners
// ==========================================================================

/**
 * 設定をリセット
 */
function resetSettings() {
  if (confirm(t('confirmReset'))) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    selectedDays = [2, 5];
    spotDates = {};
    scheduleData = {};
    currentLang = 'ja';
    updateDaySelectionUI();
    applyTranslations();
    renderSchedule();
    alert(t('resetComplete'));
  }
}

/**
 * 曜日選択の変更ハンドラ
 */
function handleDaySelectionChange() {
  selectedDays = [];
  for (let i = 0; i <= 6; i++) {
    if (elements.dayCheckboxes[i] && elements.dayCheckboxes[i].checked) {
      selectedDays.push(i);
    }
  }
  saveSettings();
  renderSchedule();
}

/**
 * スポット日付を追加
 */
function addSpotDate() {
  const dateValue = elements.spotAddDate.value;
  if (!dateValue) {
    alert(t('selectDate'));
    return;
  }

  const [year, month] = dateValue.split('-').map(Number);
  const monthKey = getMonthKey(new Date(year, month - 1, 1));

  if (!spotDates[monthKey]) {
    spotDates[monthKey] = { added: [], removed: [] };
  }

  if (spotDates[monthKey].added.includes(dateValue)) {
    alert(t('alreadyAdded'));
    return;
  }

  const removedIndex = spotDates[monthKey].removed.indexOf(dateValue);
  if (removedIndex > -1) {
    spotDates[monthKey].removed.splice(removedIndex, 1);
  } else {
    const date = new Date(year, month - 1, Number(dateValue.split('-')[2]));
    if (selectedDays.includes(date.getDay())) {
      alert(t('alreadyIncluded'));
      return;
    }
    spotDates[monthKey].added.push(dateValue);
  }

  saveSettings();
  renderSchedule();
}

/**
 * 日付を削除
 * @param {string} dateKey
 * @param {boolean} isSpot
 */
function removeDate(dateKey, isSpot) {
  const [year, month] = dateKey.split('-').map(Number);
  const monthKey = getMonthKey(new Date(year, month - 1, 1));

  if (!spotDates[monthKey]) {
    spotDates[monthKey] = { added: [], removed: [] };
  }

  if (isSpot) {
    // スポット追加日の場合、addedから削除
    const addedIndex = spotDates[monthKey].added.indexOf(dateKey);
    if (addedIndex > -1) {
      spotDates[monthKey].added.splice(addedIndex, 1);
    }
  } else {
    // 曜日ベースの場合、removedに追加
    if (!spotDates[monthKey].removed.includes(dateKey)) {
      spotDates[monthKey].removed.push(dateKey);
    }
  }

  saveSettings();
  renderSchedule();
}

/**
 * 行削除ボタンのクリックハンドラ
 * @param {Event} event
 */
function handleDeleteClick(event) {
  const target = event.target;
  if (target.dataset.action !== 'delete') return;

  const row = target.closest('tr');
  if (!row) return;

  const dateKey = row.dataset.date;
  const isSpot = row.dataset.isSpot === 'true';

  if (confirm(translations[currentLang].confirmDelete(dateKey))) {
    removeDate(dateKey, isSpot);
  }
}

/**
 * 曜日選択のUIを更新
 */
function updateDaySelectionUI() {
  for (let i = 0; i <= 6; i++) {
    if (elements.dayCheckboxes[i]) {
      elements.dayCheckboxes[i].checked = selectedDays.includes(i);
    }
  }
}

function initEventListeners() {
  // ナビゲーション
  elements.prevMonthBtn.addEventListener('click', goToPrevMonth);
  elements.nextMonthBtn.addEventListener('click', goToNextMonth);
  elements.todayBtn.addEventListener('click', goToToday);
  elements.printBtn.addEventListener('click', printSchedule);

  // 曜日選択
  for (let i = 0; i <= 6; i++) {
    if (elements.dayCheckboxes[i]) {
      elements.dayCheckboxes[i].addEventListener('change', handleDaySelectionChange);
    }
  }

  // スポット日付追加
  if (elements.spotAddBtn) {
    elements.spotAddBtn.addEventListener('click', addSpotDate);
  }
  
  // リセットボタン
  if (elements.resetBtn) {
    elements.resetBtn.addEventListener('click', resetSettings);
  }
  
  // 言語切り替えボタン
  if (elements.langBtn) {
    elements.langBtn.addEventListener('click', toggleLanguage);
  }

  // テーブル入力（イベント委譲）
  elements.scheduleBody.addEventListener('input', handleInputChange);
  elements.scheduleBody.addEventListener('change', handleInputChange);
  elements.scheduleBody.addEventListener('click', handleDeleteClick);

  // キーボードショートカット
  document.addEventListener('keydown', (event) => {
    // Ctrl/Cmd + P で印刷
    if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
      event.preventDefault();
      printSchedule();
    }
    // Ctrl/Cmd + ← で前月
    if ((event.ctrlKey || event.metaKey) && event.key === 'ArrowLeft') {
      event.preventDefault();
      goToPrevMonth();
    }
    // Ctrl/Cmd + → で次月
    if ((event.ctrlKey || event.metaKey) && event.key === 'ArrowRight') {
      event.preventDefault();
      goToNextMonth();
    }
  });
}

// ==========================================================================
// Initialization
// ==========================================================================

function init() {
  loadSettings();
  loadData();
  applyTranslations();
  updateDaySelectionUI();
  updateMonthDisplay();
  renderSchedule();
  initEventListeners();
}

// DOMContentLoaded時に初期化
document.addEventListener('DOMContentLoaded', init);
