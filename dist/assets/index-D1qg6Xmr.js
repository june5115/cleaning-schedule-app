(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function d(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(n){if(n.ep)return;n.ep=!0;const a=d(n);fetch(n.href,a)}})();const b="cleaning-schedule-data",v="cleaning-schedule-settings",p={ja:{dayNames:["日","月","火","水","木","金","土"],title:"長井ビル４Ｆ　クリニック掃除",subtitle:"清掃スケジュール表",prevMonth:"前月",nextMonth:"次月",cleaningDays:"清掃曜日：",daySun:"日",dayMon:"月",dayTue:"火",dayWed:"水",dayThu:"木",dayFri:"金",daySat:"土",reset:"リセット",thisMonth:"今月に戻る",print:"印刷",scheduledDays:"今月の予定日：",days:"日",addDate:"日付を追加：",add:"＋ 追加",deleteHint:"※ 行の「×」ボタンで個別に削除できます",date:"日付",dayOfWeek:"曜日",staffName:"担当者名",entryTime:"入室時間",exitTime:"退室時間",cleaningAreas:"掃除箇所",toilet:"トイレ",kitchen:"給湯室",vacuum:"掃除機<br>掛け",garbage:"ゴミ<br>処理",clinicCheck:"クリニック<br>確認",notes:"連絡事項",remarks:"備考",footerNote:"※ 本表は月初に印刷し、清掃完了後に各項目にチェックを入れてください。クリニック確認欄はクリニック側で記入してください。",monthFormat:(e,t)=>`${e}年${t}月`,staffPlaceholder:"担当者名",notesPlaceholder:"連絡事項",remarksPlaceholder:"備考",spotLabel:"(追加)",confirmDelete:e=>`${e} を削除しますか？`,confirmReset:"すべての設定とデータをリセットしますか？",resetComplete:"リセットしました",selectDate:"追加する日付を選択してください",alreadyAdded:"この日付は既に追加されています",alreadyIncluded:"この日付は既に曜日設定で含まれています"},en:{dayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],title:"Nagai Bldg 4F Clinic Cleaning",subtitle:"Cleaning Schedule",prevMonth:"Prev",nextMonth:"Next",cleaningDays:"Cleaning Days:",daySun:"Sun",dayMon:"Mon",dayTue:"Tue",dayWed:"Wed",dayThu:"Thu",dayFri:"Fri",daySat:"Sat",reset:"Reset",thisMonth:"This Month",print:"Print",scheduledDays:"Scheduled Days: ",days:"",addDate:"Add Date:",add:"+ Add",deleteHint:'* Click "×" to delete individual rows',date:"Date",dayOfWeek:"Day",staffName:"Staff",entryTime:"Entry",exitTime:"Exit",cleaningAreas:"Cleaning Areas",toilet:"Toilet",kitchen:"Kitchen",vacuum:"Vacuum",garbage:"Trash",clinicCheck:"Clinic<br>Check",notes:"Notes",remarks:"Remarks",footerNote:"* Print at the beginning of each month. Check each item after cleaning is complete. Clinic confirmation is to be filled in by the clinic.",monthFormat:(e,t)=>`${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][t-1]} ${e}`,staffPlaceholder:"Staff Name",notesPlaceholder:"Notes",remarksPlaceholder:"Remarks",spotLabel:"(Added)",confirmDelete:e=>`Delete ${e}?`,confirmReset:"Reset all settings and data?",resetComplete:"Reset complete",selectDate:"Please select a date to add",alreadyAdded:"This date is already added",alreadyIncluded:"This date is already included in the weekday settings"}};let i="ja",h=new Date,f={},r=[2,5],o={};const c={currentMonth:document.getElementById("current-month"),printMonth:document.getElementById("print-month"),scheduleBody:document.getElementById("schedule-body"),dayCount:document.getElementById("day-count"),prevMonthBtn:document.getElementById("prev-month"),nextMonthBtn:document.getElementById("next-month"),todayBtn:document.getElementById("today-btn"),printBtn:document.getElementById("print-btn"),dayCheckboxes:{0:document.getElementById("day-sun"),1:document.getElementById("day-mon"),2:document.getElementById("day-tue"),3:document.getElementById("day-wed"),4:document.getElementById("day-thu"),5:document.getElementById("day-fri"),6:document.getElementById("day-sat")},spotAddDate:document.getElementById("spot-add-date"),spotAddBtn:document.getElementById("spot-add-btn"),resetBtn:document.getElementById("reset-btn"),langBtn:document.getElementById("lang-btn")};function A(e,t){const d=S(new Date(e,t,1)),s=o[d]||{added:[],removed:[]},n=[],a=new Date(e,t,1);for(;a.getMonth()===t;){const l=a.getDay(),m=k(a);r.includes(l)&&!s.removed.includes(m)&&n.push({date:new Date(a),isSpot:!1}),a.setDate(a.getDate()+1)}return s.added.forEach(l=>{const[m,T,I]=l.split("-").map(Number),N=new Date(m,T-1,I);n.some(L=>k(L.date)===l)||n.push({date:N,isSpot:!0})}),n.sort((l,m)=>l.date-m.date),n}function O(e){const t=e.getMonth()+1,d=e.getDate();return`${t}/${d}`}function k(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`}function S(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`}function P(){try{const e=localStorage.getItem(b);e&&(f=JSON.parse(e))}catch(e){console.error("データの読み込みに失敗しました:",e),f={}}}function F(){try{const e=localStorage.getItem(v);if(e){const t=JSON.parse(e);t.selectedDays&&Array.isArray(t.selectedDays)&&t.selectedDays.length>0&&(r=t.selectedDays),t.spotDates&&typeof t.spotDates=="object"&&(o=t.spotDates),t.lang&&(t.lang==="ja"||t.lang==="en")&&(i=t.lang)}}catch(e){console.error("設定の読み込みに失敗しました:",e),r=[2,5]}(!r||r.length===0)&&(r=[2,5])}function u(e){return p[i][e]||p.ja[e]||e}function K(e){return p[i].dayNames[e]}function R(){i=i==="ja"?"en":"ja",_(),x(),g(),y()}function x(){document.querySelectorAll("[data-i18n]").forEach(e=>{const t=e.getAttribute("data-i18n"),d=u(t);d&&(e.innerHTML=d)}),c.langBtn&&(c.langBtn.textContent=i==="ja"?"EN / 日本語":"日本語 / EN"),document.documentElement.lang=i==="ja"?"ja":"en"}function _(){try{localStorage.setItem(v,JSON.stringify({selectedDays:r,spotDates:o,lang:i}))}catch(e){console.error("設定の保存に失敗しました:",e)}}function j(){try{localStorage.setItem(b,JSON.stringify(f))}catch(e){console.error("データの保存に失敗しました:",e)}}function C(e){return f[e]||{staff:"",entryTime:"",exitTime:"",toilet:!1,kitchen:!1,vacuum:!1,garbage:!1,clinicCheck:!1,notes:"",remarks:""}}function W(e,t,d){f[e]||(f[e]=C(e)),f[e][t]=d,j()}function g(){const e=h.getFullYear(),t=h.getMonth()+1,d=p[i].monthFormat(e,t);c.currentMonth.textContent=d,c.printMonth.textContent=d}function y(){const e=h.getFullYear(),t=h.getMonth(),d=A(e,t);c.dayCount.textContent=d.length,c.scheduleBody.innerHTML="",d.forEach(n=>{const a=Y(n.date,n.isSpot);c.scheduleBody.appendChild(a)});const s=`${e}-${String(t+1).padStart(2,"0")}`;if(c.spotAddDate){c.spotAddDate.value="",c.spotAddDate.min=`${s}-01`;const n=new Date(e,t+1,0).getDate();c.spotAddDate.max=`${s}-${String(n).padStart(2,"0")}`}}function J(e){return{0:"row--sunday",1:"row--monday",2:"row--tuesday",3:"row--wednesday",4:"row--thursday",5:"row--friday",6:"row--saturday"}[e]||""}function H(e){return{0:"schedule__td--sunday",2:"schedule__td--tuesday",5:"schedule__td--friday",6:"schedule__td--saturday"}[e]||""}function Y(e,t=!1){const d=k(e),s=e.getDay(),n=C(d),a=document.createElement("tr");a.className=t?"row--spot":J(s),a.dataset.date=d,a.dataset.isSpot=t?"true":"false";const l=t?`<span class="spot-badge">${u("spotLabel")}</span>`:"";return a.innerHTML=`
    <td class="schedule__td schedule__td--action no-print">
      <button type="button" class="btn--delete" data-action="delete" title="Delete">×</button>
    </td>
    <td class="schedule__td schedule__td--date">${O(e)}${l}</td>
    <td class="schedule__td schedule__td--day ${H(s)}">
      ${K(s)}
    </td>
    <td class="schedule__td">
      <input type="text" 
             class="schedule__input schedule__input--text" 
             data-field="staff" 
             value="${D(n.staff)}" 
             placeholder="${u("staffPlaceholder")}">
    </td>
    <td class="schedule__td">
      <input type="time" 
             class="schedule__input schedule__input--time" 
             data-field="entryTime" 
             value="${n.entryTime}">
    </td>
    <td class="schedule__td">
      <input type="time" 
             class="schedule__input schedule__input--time" 
             data-field="exitTime" 
             value="${n.exitTime}">
    </td>
    <td class="schedule__td">
      <div class="schedule__checkbox-wrapper">
        <input type="checkbox" 
               class="schedule__checkbox" 
               data-field="toilet" 
               ${n.toilet?"checked":""}>
      </div>
    </td>
    <td class="schedule__td">
      <div class="schedule__checkbox-wrapper">
        <input type="checkbox" 
               class="schedule__checkbox" 
               data-field="kitchen" 
               ${n.kitchen?"checked":""}>
      </div>
    </td>
    <td class="schedule__td">
      <div class="schedule__checkbox-wrapper">
        <input type="checkbox" 
               class="schedule__checkbox" 
               data-field="vacuum" 
               ${n.vacuum?"checked":""}>
      </div>
    </td>
    <td class="schedule__td">
      <div class="schedule__checkbox-wrapper">
        <input type="checkbox" 
               class="schedule__checkbox" 
               data-field="garbage" 
               ${n.garbage?"checked":""}>
      </div>
    </td>
    <td class="schedule__td schedule__td--clinic">
      <div class="schedule__checkbox-wrapper">
        <input type="checkbox" 
               class="schedule__checkbox" 
               data-field="clinicCheck" 
               ${n.clinicCheck?"checked":""}>
      </div>
    </td>
    <td class="schedule__td">
      <input type="text" 
             class="schedule__input schedule__input--text" 
             data-field="notes" 
             value="${D(n.notes)}" 
             placeholder="${u("notesPlaceholder")}">
    </td>
    <td class="schedule__td">
      <input type="text" 
             class="schedule__input schedule__input--text" 
             data-field="remarks" 
             value="${D(n.remarks)}" 
             placeholder="${u("remarksPlaceholder")}">
    </td>
  `,a}function D(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}function E(){h.setMonth(h.getMonth()-1),g(),y()}function B(){h.setMonth(h.getMonth()+1),g(),y()}function q(){h=new Date,g(),y()}function M(){window.print()}function w(e){const t=e.target,d=t.dataset.field;if(!d)return;const s=t.closest("tr");if(!s)return;const n=s.dataset.date,a=t.type==="checkbox"?t.checked:t.value;W(n,d,a)}function G(){confirm(u("confirmReset"))&&(localStorage.removeItem(b),localStorage.removeItem(v),r=[2,5],o={},f={},i="ja",$(),x(),y(),alert(u("resetComplete")))}function V(){r=[];for(let e=0;e<=6;e++)c.dayCheckboxes[e]&&c.dayCheckboxes[e].checked&&r.push(e);_(),y()}function U(){const e=c.spotAddDate.value;if(!e){alert(u("selectDate"));return}const[t,d]=e.split("-").map(Number),s=S(new Date(t,d-1,1));if(o[s]||(o[s]={added:[],removed:[]}),o[s].added.includes(e)){alert(u("alreadyAdded"));return}const n=o[s].removed.indexOf(e);if(n>-1)o[s].removed.splice(n,1);else{const a=new Date(t,d-1,Number(e.split("-")[2]));if(r.includes(a.getDay())){alert(u("alreadyIncluded"));return}o[s].added.push(e)}_(),y()}function z(e,t){const[d,s]=e.split("-").map(Number),n=S(new Date(d,s-1,1));if(o[n]||(o[n]={added:[],removed:[]}),t){const a=o[n].added.indexOf(e);a>-1&&o[n].added.splice(a,1)}else o[n].removed.includes(e)||o[n].removed.push(e);_(),y()}function Q(e){const t=e.target;if(t.dataset.action!=="delete")return;const d=t.closest("tr");if(!d)return;const s=d.dataset.date,n=d.dataset.isSpot==="true";confirm(p[i].confirmDelete(s))&&z(s,n)}function $(){for(let e=0;e<=6;e++)c.dayCheckboxes[e]&&(c.dayCheckboxes[e].checked=r.includes(e))}function X(){c.prevMonthBtn.addEventListener("click",E),c.nextMonthBtn.addEventListener("click",B),c.todayBtn.addEventListener("click",q),c.printBtn.addEventListener("click",M);for(let e=0;e<=6;e++)c.dayCheckboxes[e]&&c.dayCheckboxes[e].addEventListener("change",V);c.spotAddBtn&&c.spotAddBtn.addEventListener("click",U),c.resetBtn&&c.resetBtn.addEventListener("click",G),c.langBtn&&c.langBtn.addEventListener("click",R),c.scheduleBody.addEventListener("input",w),c.scheduleBody.addEventListener("change",w),c.scheduleBody.addEventListener("click",Q),document.addEventListener("keydown",e=>{(e.ctrlKey||e.metaKey)&&e.key==="p"&&(e.preventDefault(),M()),(e.ctrlKey||e.metaKey)&&e.key==="ArrowLeft"&&(e.preventDefault(),E()),(e.ctrlKey||e.metaKey)&&e.key==="ArrowRight"&&(e.preventDefault(),B())})}function Z(){F(),P(),x(),$(),g(),y(),X()}document.addEventListener("DOMContentLoaded",Z);
