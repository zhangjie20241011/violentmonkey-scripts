// ==UserScript==
// @name         ChinaFix 自动每日签到（带浏览器启动跳转）
// @namespace    https://github.com/
// @version      1.0.0
// @description  打开浏览器（首页为 Google）自动跳转到签到页，自动点击签到。签到成功或已签到后在右上角提示并返回 https://www.google.com/ncr
// @author       Grok
// @match        https://www.chinafix.com/plugin.php?id=k_misign:sign*
// @match        https://www.google.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const SIGN_URL = 'https://www.chinafix.com/plugin.php?id=k_misign:sign';
    const GOOGLE_URL = 'https://www.google.com/ncr';

    // 获取今天日期（YYYY-MM-DD），用于防止重复跳转
    const today = new Date().toISOString().split('T')[0];

    // 右上角提示框函数
    function showToast(message, color = '#4CAF50') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${color};
            color: white;
            padding: 15px 25px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 99999;
            font-size: 17px;
            font-weight: bold;
            opacity: 0;
            transition: all 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        // 淡入
        setTimeout(() => { toast.style.opacity = '1'; }, 10);

        // 3秒后淡出消失
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // ====================== 签到页面逻辑 ======================
    if (window.location.href.includes('chinafix.com/plugin.php?id=k_misign:sign')) {
        console.log('【ChinaFix签到脚本】已进入签到页面，开始自动操作...');

        // 延迟1秒确保页面完全加载（按钮可能动态生成）
        setTimeout(() => {
            const signBtn = document.getElementById('JD_sign');           // 签到按钮（k_misign插件标准ID）
            const alreadyEl = document.querySelector('.btnvisted');       // 已签到状态的元素（常见class）

            if (signBtn) {
                // 未签到 → 点击签到
                console.log('【ChinaFix签到脚本】检测到签到按钮，正在点击...');
                signBtn.click();

                // 点击后等待2.5秒（签到请求完成），显示成功提示并返回Google
                setTimeout(() => {
                    showToast('✅ 签到成功');
                    GM_setValue('chinafix_signed_date', today);   // 记录今日已签
                    window.location.href = GOOGLE_URL;
                }, 2500);

            } else if (alreadyEl ||
                       document.body.innerText.includes('今日已签到') ||
                       document.body.innerText.includes('您今天已经签到') ||
                       document.body.innerText.includes('已签到')) {
                // 已签到
                console.log('【ChinaFix签到脚本】今日已签到');
                showToast('✅ 今天已签到');
                GM_setValue('chinafix_signed_date', today);
                window.location.href = GOOGLE_URL;

            } else {
                // 其他情况（未登录、页面异常等）
                console.log('【ChinaFix签到脚本】未检测到签到按钮或状态');
                showToast('❌ 签到失败或未登录，请手动检查', '#f44336');
            }
        }, 1200);
    }

    // ====================== Google页面逻辑（浏览器启动时触发） ======================
    else if (window.location.hostname === 'www.google.com') {
        const signedDate = GM_getValue('chinafix_signed_date', '');

        if (signedDate !== today) {
            // 今日尚未签到 → 自动跳转到签到页
            console.log('【ChinaFix签到脚本】检测到今日未签到，自动跳转签到页面...');
            window.location.href = SIGN_URL;
        } else {
            // 今日已完成签到，什么都不做，停留在Google
            console.log('【ChinaFix签到脚本】今日已签到，停留在Google首页');
        }
    }
})();