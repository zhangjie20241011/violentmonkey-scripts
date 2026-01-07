// ==UserScript==
// @name         优酷视频自动关闭弹幕
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在优酷 v.youku.com 播放页面自动关闭弹幕（网页版）
// @author       Grok
// @match        https://v.youku.com/v_show/*
// @match        https://v.youku.com/v_nextstage/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 隐藏弹幕层（直接通过CSS隐藏弹幕元素，更可靠）
    const style = document.createElement('style');
    style.innerHTML = `
        /* 隐藏弹幕容器（优酷常见弹幕层class或id，可能随更新变化） */
        .youku-danmu,
        .danmu-container,
        [class*="danmu"],
        [id*="danmu"],
        .yk-danmaku {  /* 常见优酷弹幕相关class */
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
        }
    `;
    document.head.appendChild(style);

    // 额外：尝试点击弹幕开关按钮（如果存在）
    function clickDanmuToggle() {
        // 优酷网页版弹幕开关常见特征：包含“弹”字或特定class的按钮
        const buttons = document.querySelectorAll('button, div, span, i');
        for (let btn of buttons) {
            if (btn.innerText.includes('弹') || btn.title.includes('弹幕') || btn.getAttribute('data-tip')?.includes('弹幕')) {
                // 检查是否是开启状态（有勾或active class）
                if (btn.classList.contains('active') || btn.querySelector('.checked')) {
                    btn.click();
                    console.log('已自动点击关闭弹幕开关');
                    return;
                }
            }
        }
    }

    // 页面加载后立即执行
    clickDanmuToggle();

    // 因为播放器可能异步加载，使用MutationObserver监控DOM变化
    const observer = new MutationObserver(() => {
        clickDanmuToggle();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 可选：5秒后停止观察，避免性能消耗
    setTimeout(() => observer.disconnect(), 10000);

})();