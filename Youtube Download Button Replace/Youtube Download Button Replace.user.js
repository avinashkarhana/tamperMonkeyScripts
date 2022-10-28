// ==UserScript==
// @name         Youtube Download Button Replace
// @namespace    http://avinashkarhana.codes/
// @version      0.1
// @updateURL    https://github.com/avinashkarhana/tamperMonkeyScripts/raw/main/Youtube%20Download%20Button%20Replace/Youtube%20Download%20Button%20Replace.user.js
// @downloadURL  https://github.com/avinashkarhana/tamperMonkeyScripts/raw/main/Youtube%20Download%20Button%20Replace/Youtube%20Download%20Button%20Replace.user.js
// @description  Replace the default download button with a download button that will download the video in different formats and qualities.
// @author       Avinash Karhana
// @match        *://*.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  var oldHref = document.location.href;

  window.onload = function() {
      var bodyList = document.querySelector("body")

      var observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
              if (oldHref != document.location.href) {
                  oldHref = document.location.href;
                  CustomisedDownloadButton();
              }
          });
      });

      var config = {
          childList: true,
          subtree: true
      };

      observer.observe(bodyList, config);
  };
  CustomisedDownloadButton();

  function CustomisedDownloadButton() {
      var downloaderUrl = "https://apiyoutube.cc/?url=";
      var intId = setInterval(WaitForDownloadButton, 2000);
      function WaitForDownloadButton() {
          if (document.querySelector("#flexible-item-buttons > ytd-download-button-renderer > ytd-button-renderer > yt-button-shape > button") != null) {
              document.querySelector("#flexible-item-buttons > ytd-download-button-renderer > ytd-button-renderer > yt-button-shape > button").onclick = () => {var videoUrl = window.window.location.href;window.open(downloaderUrl+videoUrl, "_blank")};
              clearInterval(intId);
          }
      }
  }
})();