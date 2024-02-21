// ==UserScript==
// @name         班固米共同高评分
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  显示用户共同8分以上条目
// @match        https://bgm.tv/user/*
// @match        https://bangumi.tv/user/*
// @match        https://chii.in/user/*
// @grant        none
// ==/UserScript==


// IIFE
(function () {
    'use strict';

    const selfUserId = $('.avatar').attr('href').split('/').pop();
    const userId = window.location.href.split('/').pop();
    fetch(`https://api.bgm.tv/v0/users/${userId}/collections`)
        .then(response => response.json())
        .then(data => {
            let collections = data.collects;
            let subjectIds = collections.map(collect => collect.subject.id);
            let subjectIdSet = new Set(subjectIds);
            let subjectIdArray = Array.from(subjectIdSet);

            let subjectIdToCount = {};
            subjectIdArray.forEach(subjectId => {
                subjectIdToCount[subjectId] = 0;
            });
            subjectIds.forEach(subjectId => {
                subjectIdToCount[subjectId] += 1;
            });

            let highRatedSubjectIds = [];
            Object.entries(subjectIdToCount).forEach(([subjectId, count]) => {
                if (count >= 2) {
                    highRatedSubjectIds.push(subjectId);
                }
            });

            let highRatedSubjects = collections.filter(collect => highRatedSubjectIds.includes(collect.subject.id));
            let highRatedSubjectNames = highRatedSubjects.map(collect => collect.subject.name);
            let highRatedSubjectNamesSet = new Set(highRatedSubjectNames);
            let highRatedSubjectNamesArray = Array.from(highRatedSubjectNamesSet);

            let highRatedSubjectNamesDiv = document.createElement('div');
            highRatedSubjectNamesDiv.innerHTML = `
                <h4>共同高评分条目</h4>
                <ul>
                    ${highRatedSubjectNamesArray.map(name => `<li>${name}</li>`).join('')}
                </ul>
            `;
            highRatedSubjectNamesDiv.style = `
                font-size: 16px;
            `;

            let sidePanel = document.querySelector('.SidePanel');
            sidePanel.appendChild(highRatedSubjectNamesDiv);
        })
        .catch(error => {
            console.error('Error:', error);
        })
})();
