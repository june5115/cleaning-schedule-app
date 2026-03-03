(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const d of t)if(d.type==="childList")for(const l of d.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function c(t){const d={};return t.integrity&&(d.integrity=t.integrity),t.referrerPolicy&&(d.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?d.credentials="include":t.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function s(t){if(t.ep)return;t.ep=!0;const d=c(t);fetch(t.href,d)}})();const C=["日","月","火","水","木","金","土"],g="cleaning-schedule-data",_="cleaning-schedule-settings";let i=new Date,u={},r=[2,5],o={};const a={currentMonth:document.getElementById("current-month"),printMonth:document.getElementById("print-month"),scheduleBody:document.getElementById("schedule-body"),dayCount:document.getElementById("day-count"),prevMonthBtn:document.getElementById("prev-month"),nextMonthBtn:document.getElementById("next-month"),todayBtn:document.getElementById("today-btn"),printBtn:document.getElementById("print-btn"),dayCheckboxes:{0:document.getElementById("day-sun"),1:document.getElementById("day-mon"),2:document.getElementById("day-tue"),3:document.getElementById("day-wed"),4:document.getElementById("day-thu"),5:document.getElementById("day-fri"),6:document.getElementById("day-sat")},spotAddDate:document.getElementById("spot-add-date"),spotAddBtn:document.getElementById("spot-add-btn"),resetBtn:document.getElementById("reset-btn")};function L(e,n){const c=D(new Date(e,n,1)),s=o[c]||{added:[],removed:[]},t=[],d=new Date(e,n,1);for(;d.getMonth()===n;){const l=d.getDay(),p=m(d);r.includes(l)&&!s.removed.includes(p)&&t.push({date:new Date(d),isSpot:!1}),d.setDate(d.getDate()+1)}return s.added.forEach(l=>{const[p,w,M]=l.split("-").map(Number),I=new Date(p,w-1,M);t.some($=>m($.date)===l)||t.push({date:I,isSpot:!0})}),t.sort((l,p)=>l.date-p.date),t}function A(e){const n=e.getMonth()+1,c=e.getDate();return`${n}/${c}`}function m(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`}function D(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`}function O(){try{const e=localStorage.getItem(g);e&&(u=JSON.parse(e))}catch(e){console.error("データの読み込みに失敗しました:",e),u={}}}function T(){try{const e=localStorage.getItem(_);if(e){const n=JSON.parse(e);n.selectedDays&&Array.isArray(n.selectedDays)&&n.selectedDays.length>0&&(r=n.selectedDays),n.spotDates&&typeof n.spotDates=="object"&&(o=n.spotDates)}}catch(e){console.error("設定の読み込みに失敗しました:",e),r=[2,5]}(!r||r.length===0)&&(r=[2,5])}function k(){try{localStorage.setItem(_,JSON.stringify({selectedDays:r,spotDates:o}))}catch(e){console.error("設定の保存に失敗しました:",e)}}function N(){try{localStorage.setItem(g,JSON.stringify(u))}catch(e){console.error("データの保存に失敗しました:",e)}}function S(e){return u[e]||{staff:"",entryTime:"",exitTime:"",toilet:!1,kitchen:!1,vacuum:!1,garbage:!1,clinicCheck:!1,notes:"",remarks:""}}function K(e,n,c){u[e]||(u[e]=S(e)),u[e][n]=c,N()}function f(){const e=i.getFullYear(),n=i.getMonth()+1,c=`${e}年${n}月`;a.currentMonth.textContent=c,a.printMonth.textContent=c}function h(){const e=i.getFullYear(),n=i.getMonth(),c=L(e,n);a.dayCount.textContent=c.length,a.scheduleBody.innerHTML="",c.forEach(t=>{const d=P(t.date,t.isSpot);a.scheduleBody.appendChild(d)});const s=`${e}-${String(n+1).padStart(2,"0")}`;if(a.spotAddDate){a.spotAddDate.value="",a.spotAddDate.min=`${s}-01`;const t=new Date(e,n+1,0).getDate();a.spotAddDate.max=`${s}-${String(t).padStart(2,"0")}`}}function Y(e){return{0:"row--sunday",1:"row--monday",2:"row--tuesday",3:"row--wednesday",4:"row--thursday",5:"row--friday",6:"row--saturday"}[e]||""}function F(e){return{0:"schedule__td--sunday",2:"schedule__td--tuesday",5:"schedule__td--friday",6:"schedule__td--saturday"}[e]||""}function P(e,n=!1){const c=m(e),s=e.getDay(),t=S(c),d=document.createElement("tr");d.className=n?"row--spot":Y(s),d.dataset.date=c,d.dataset.isSpot=n?"true":"false";const l=n?'<span class="spot-badge">(追加)</span>':"";return d.innerHTML=`
    <td class="schedule__td schedule__td--action no-print">
      <button type="button" class="btn--delete" data-action="delete" title="この日を削除">×</button>
    </td>
    <td class="schedule__td schedule__td--date">${A(e)}${l}</td>
    <td class="schedule__td schedule__td--day ${F(s)}">
      ${C[s]}
    </td>
    <td class="schedule__td">
      <input type="text" 
             class="schedule__input schedule__input--text" 
             data-field="staff" 
             value="${y(t.staff)}" 
             placeholder="担当者名">
    </td>
    <td class="schedule__td">
      <input type="time" 
             class="schedule__input schedule__input--time" 
             data-field="entryTime" 
             value="${t.entryTime}">
    </td>
    <td class="schedule__td">
      <input type="time" 
             class="schedule__input schedule__input--time" 
             data-field="exitTime" 
             value="${t.exitTime}">
    </td>
    <td class="schedule__td">
      <div class="schedule__checkbox-wrapper">
        <input type="checkbox" 
               class="schedule__checkbox" 
               data-field="toilet" 
               ${t.toilet?"checked":""}>
      </div>
    </td>
    <td class="schedule__td">
      <div class="schedule__checkbox-wrapper">
        <input type="checkbox" 
               class="schedule__checkbox" 
               data-field="kitchen" 
               ${t.kitchen?"checked":""}>
      </div>
    </td>
    <td class="schedule__td">
      <div class="schedule__checkbox-wrapper">
        <input type="checkbox" 
               class="schedule__checkbox" 
               data-field="vacuum" 
               ${t.vacuum?"checked":""}>
      </div>
    </td>
    <td class="schedule__td">
      <div class="schedule__checkbox-wrapper">
        <input type="checkbox" 
               class="schedule__checkbox" 
               data-field="garbage" 
               ${t.garbage?"checked":""}>
      </div>
    </td>
    <td class="schedule__td schedule__td--clinic">
      <div class="schedule__checkbox-wrapper">
        <input type="checkbox" 
               class="schedule__checkbox" 
               data-field="clinicCheck" 
               ${t.clinicCheck?"checked":""}>
      </div>
    </td>
    <td class="schedule__td">
      <input type="text" 
             class="schedule__input schedule__input--text" 
             data-field="notes" 
             value="${y(t.notes)}" 
             placeholder="連絡事項">
    </td>
    <td class="schedule__td">
      <input type="text" 
             class="schedule__input schedule__input--text" 
             data-field="remarks" 
             value="${y(t.remarks)}" 
             placeholder="備考">
    </td>
  `,d}function y(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}function v(){i.setMonth(i.getMonth()-1),f(),h()}function x(){i.setMonth(i.getMonth()+1),f(),h()}function J(){i=new Date,f(),h()}function b(){window.print()}function E(e){const n=e.target,c=n.dataset.field;if(!c)return;const s=n.closest("tr");if(!s)return;const t=s.dataset.date,d=n.type==="checkbox"?n.checked:n.value;K(t,c,d)}function R(){confirm("すべての設定とデータをリセットしますか？")&&(localStorage.removeItem(g),localStorage.removeItem(_),r=[2,5],o={},u={},B(),h(),alert("リセットしました"))}function H(){r=[];for(let e=0;e<=6;e++)a.dayCheckboxes[e]&&a.dayCheckboxes[e].checked&&r.push(e);k(),h()}function q(){const e=a.spotAddDate.value;if(!e){alert("追加する日付を選択してください");return}const[n,c]=e.split("-").map(Number),s=D(new Date(n,c-1,1));if(o[s]||(o[s]={added:[],removed:[]}),o[s].added.includes(e)){alert("この日付は既に追加されています");return}const t=o[s].removed.indexOf(e);if(t>-1)o[s].removed.splice(t,1);else{const d=new Date(n,c-1,Number(e.split("-")[2]));if(r.includes(d.getDay())){alert("この日付は既に曜日設定で含まれています");return}o[s].added.push(e)}k(),h()}function G(e,n){const[c,s]=e.split("-").map(Number),t=D(new Date(c,s-1,1));if(o[t]||(o[t]={added:[],removed:[]}),n){const d=o[t].added.indexOf(e);d>-1&&o[t].added.splice(d,1)}else o[t].removed.includes(e)||o[t].removed.push(e);k(),h()}function W(e){const n=e.target;if(n.dataset.action!=="delete")return;const c=n.closest("tr");if(!c)return;const s=c.dataset.date,t=c.dataset.isSpot==="true";confirm(`${s} を削除しますか？`)&&G(s,t)}function B(){for(let e=0;e<=6;e++)a.dayCheckboxes[e]&&(a.dayCheckboxes[e].checked=r.includes(e))}function j(){a.prevMonthBtn.addEventListener("click",v),a.nextMonthBtn.addEventListener("click",x),a.todayBtn.addEventListener("click",J),a.printBtn.addEventListener("click",b);for(let e=0;e<=6;e++)a.dayCheckboxes[e]&&a.dayCheckboxes[e].addEventListener("change",H);a.spotAddBtn&&a.spotAddBtn.addEventListener("click",q),a.resetBtn&&a.resetBtn.addEventListener("click",R),a.scheduleBody.addEventListener("input",E),a.scheduleBody.addEventListener("change",E),a.scheduleBody.addEventListener("click",W),document.addEventListener("keydown",e=>{(e.ctrlKey||e.metaKey)&&e.key==="p"&&(e.preventDefault(),b()),(e.ctrlKey||e.metaKey)&&e.key==="ArrowLeft"&&(e.preventDefault(),v()),(e.ctrlKey||e.metaKey)&&e.key==="ArrowRight"&&(e.preventDefault(),x())})}function U(){T(),O(),B(),f(),h(),j()}document.addEventListener("DOMContentLoaded",U);
