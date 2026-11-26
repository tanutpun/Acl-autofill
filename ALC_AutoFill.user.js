
 // ==UserScript==
 // @name         ALC Auto Fill iPad
 // @namespace    ALC-AutoFill
 // @version      4.0
 // @description  Fill ALC job booking form
 // @match        https://myalcapp.com/*
 // @grant        none
 // @run-at       document-idle
 // ==/UserScript==

 (function () {
   'use strict';

   // แก้ข้อมูล 3 บรรทัดนี้ตามต้องการ
   const START_DATE = '2027-05-01';
   const END_DATE = '2027-08-31';
   const TARGET_POSITION = 'Ride Operator (Early)';

   function fillForm() {
     const dates = {
       startDate: START_DATE,
       endDate: END_DATE
     };

     Object.entries(dates).forEach(([name, value]) => {
       const input = document.querySelector(
         `input[name="${name}"]`
       );

       if (!input || input.value) return;

       const setter =
         Object.getOwnPropertyDescriptor(
           HTMLInputElement.prototype, 'value'
         ).set;

       setter.call(input, value);
       input.dispatchEvent(
         new Event('input', { bubbles: true })
       );
       input.dispatchEvent(
         new Event('change', { bubbles: true })
       );
     });

     document.querySelectorAll('select').forEach(select => {
       const option = Array.from(select.options).find(
         opt => opt.textContent.trim()
           .startsWith(TARGET_POSITION)
           && !opt.disabled
       );

       if (!option || select.value === option.value) {
         return;
       }

       const setter =
         Object.getOwnPropertyDescriptor(
           HTMLSelectElement.prototype, 'value'
         ).set;

       setter.call(select, option.value);
       select.dispatchEvent(
         new Event('input', { bubbles: true })
       );
       select.dispatchEvent(
         new Event('change', { bubbles: true })
       );
     });
   }

   fillForm();

   const observer = new MutationObserver(fillForm);
   observer.observe(document.documentElement, {
     childList: true,
     subtree: true
   });

   window.addEventListener('pageshow', fillForm);
   window.addEventListener('popstate', fillForm);

   console.log('ALC AUTO FILL iPad RUNNING');
 })();
