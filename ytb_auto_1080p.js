// ==UserScript==
// @name         Auto Set YouTube Quality to 1080p
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Automatically sets YouTube video quality to 1080p if available, otherwise the next best quality.
// @author       Grok
// @match        https://www.youtube.com/watch*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Settings
    const targetRes = "hd1080"; // 1080p
    // Other options: tiny (144p), small (240p), medium (360p), large (480p), hd720 (720p), hd1440 (1440p), etc.

    // Function to get the player
    function getPlayer() {
        return document.getElementById("movie_player") || document.getElementsByClassName("html5-video-player")[0];
    }

    // Function to set quality
    function setQuality(player) {
        if (player && player.setPlaybackQuality) {
            player.setPlaybackQuality(targetRes);
        }
    }

    // Observer to detect when the player is ready
    const observer = new MutationObserver(function() {
        const player = getPlayer();
        if (player) {
            setQuality(player);
            observer.disconnect(); // Stop observing once set
        }
    });

    // Start observing the document
    observer.observe(document, { childList: true, subtree: true });

    // Also try immediately in case it's already loaded
    const initialPlayer = getPlayer();
    if (initialPlayer) {
        setQuality(initialPlayer);
    }
})();