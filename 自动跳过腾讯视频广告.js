// ==UserScript==
// @name         跳过腾讯视频开头广告(20260111)
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  自动跳过腾讯视频开头广告
// @author       zhengmingliang
// @match        *://*.v.qq.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.setInterval(function() {
        let time = document.querySelectorAll(".txp_ad video");
        if (time.length) {
            for (let i = 0; i < time.length; i++) {
                time[i].currentTime = 110;
            }
        }
    }, 1000);
})();