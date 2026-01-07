// ==UserScript==
// @name         iqiyi 或 qq 视频 试看/立即登录解析
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在iqiyi或qq视频页面上检测到"试看"或"立即登录"字样后自动解析播放
// @author       You
// @match        https://www.iqiyi.com/*
// @match        https://v.qq.com/*
// @match        https://v.youku.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let attemptCount = 0; // 尝试检测的次数
    const maxAttempts = 1000; // 最大检测次数

    // 每秒检测一次，最多检测5次
    const intervalId = setInterval(function() {
        attemptCount++;

        // 获取页面的所有文本
        const bodyText = document.body.innerText;

        // 检查是否包含 "试看" 或 "立即登录" 字样
        if (bodyText.includes("试看") || bodyText.includes("立即登录")) {
            // 找到"试看"或"立即登录"，弹出提示框
           // alert("检测到‘" + (bodyText.includes("试看") ? "试看" : "立即登录") + "’，即将进行VIP解析...");

            // 构建VIP解析链接
            const currentUrl = window.location.href;
            const vipParseUrl = `https://jx.nnxv.cn/tv.php?url=${encodeURIComponent(currentUrl)}`;

            // 跳转到VIP解析页面
            window.location.href = vipParseUrl;

            clearInterval(intervalId); // 停止进一步的检测
        }

        // 如果达到最大检测次数，停止检测
        if (attemptCount >= maxAttempts) {
            clearInterval(intervalId);
        }
    }, 1000); // 每1秒检测一次

})();
