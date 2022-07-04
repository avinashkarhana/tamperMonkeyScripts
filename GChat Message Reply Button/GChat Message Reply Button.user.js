// ==UserScript==
// @name         GChat Message Reply Button
// @namespace    http://avinashkarhana.github.io/
// @version      0.1
// @updateURL    https://github.com/avinashkarhana/tamperMonkeyScripts/raw/main/GChat%20Message%20Reply%20Button/GChat%20Message%20Reply%20Button.user.js
// @downloadURL  https://github.com/avinashkarhana/tamperMonkeyScripts/raw/main/GChat%20Message%20Reply%20Button/GChat%20Message%20Reply%20Button.user.js
// @description  Adds a Message Reply Button on message hover Button that automatically highlights message in reply message
// @author       Avinash Karhana
// @match        *://chat.google.com/u/0/frame*
// @icon         https://ssl.gstatic.com/ui/v1/icons/mail/images/favicon_chat_r2.ico
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  setInterval(monitorForMessages, 2000)
})();

function monitorForMessages() {
  let chatSpaceStyle = false;
  let chatApp = false;
  let messageBox = document.querySelector("body > c-wiz > div > div > div > div > div:nth-child(3) > div > c-wiz > div:nth-child(3) > div");
  if(!messageBox) {
    messageBox = document.querySelector("body > c-wiz > div > div > div > div > span > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div > c-wiz > div:nth-child(3) > div");
    chatSpaceStyle = true;
  }
  if(!messageBox) {
    messageBox = document.querySelector("body > c-wiz.SSPGKf.aM97s.ZCbGl.zmXnlc.QpZf2b.jwuIpc.n0GTjf > div > div > div > div.RWqrJc.lRFQ6d > div.jO3HBb > div > c-wiz > div.Bl2pUd.krjOGe > div.auHzcc.cFc9ae > div");
    chatApp = true;
  }
  if (!messageBox) {
    messageBox = document.querySelector("body > c-wiz > div > div > div > div.RWqrJc.lRFQ6d > span > div.kSBibe > div.l9H1ve > div > div.Kk7lMc-ae3xF-MVH0Ye-bN97Pc-haAclf > div > div > div > c-wiz > div.Bl2pUd.krjOGe > div.auHzcc.cFc9ae");
    messageBox = document.querySelector("body > c-wiz.SSPGKf.aM97s.ZCbGl.zmXnlc.QpZf2b.jwuIpc.n0GTjf > div > div > div > div.RWqrJc.lRFQ6d > span > div.kSBibe > div.l9H1ve > div > div.Kk7lMc-ae3xF-MVH0Ye-bN97Pc-haAclf > div > div > div > c-wiz > div.Bl2pUd.krjOGe > div.auHzcc.cFc9ae");
    chatSpaceStyle = true;
    chatApp = true;
  }
  if (messageBox) {
    let messagesCount = 0;
    if (!chatSpaceStyle) {
      messagesCount = messageBox.getElementsByTagName('c-wiz').length;
    }
    else{
      messagesCount = messageBox.querySelectorAll(".nF6pT").length;
    }
    if (messagesCount > 0) {
      buildAndAddButton(messagesCount, messageBox, chatSpaceStyle, chatApp);
    }
  }
}

function buildAndAddButton(messagesCount, messageBox, chatSpaceStyle, chatApp) {
  var messageTextElements = []
  for (var i = 0; i < messagesCount; i++) {
    let messageTextElement = null;
    try {
      messageTextElement = messageBox.getElementsByTagName("c-wiz")[i].children[2].firstChild.firstChild.firstChild.firstChild.children[1].children[1].firstChild.children[0].firstChild;
    } catch { }
    if (!messageTextElement || chatSpaceStyle) {
      messageTextElement = messageBox.querySelectorAll(".nF6pT")[i].firstChild.firstChild.children[1].children[1].firstChild.firstChild.firstChild;
      chatSpaceStyle = true;
    }
    if(!messageTextElement) return
    messageTextElements.push(messageTextElement);
    let message = messageTextElement.innerText;
    let sender = messageTextElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.firstChild.children[1].firstChild.firstChild.innerText;
    let textDateTimeString = messageTextElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.firstChild.children[1].firstChild.children[1].children[1].innerText;
    let currentMsgDateTime = null;
    let daysOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    let monthsOfYear = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    if (textDateTimeString.trim().toLowerCase() == 'now') {
      currentMsgDateTime = (new Date()).toLocaleString();
    }
    else if (textDateTimeString.includes('min')) {
      currentMsgDateTime = subtractMinutesFromDateTime(Date.now(), textDateTimeString.split(' ')[0]);
    }
    else if (textDateTimeString.split(' ')[0] === "Yesterday") {
      currentMsgDateTime = subtractDaysFromDateWithGivenTime(Date.now(), 1, textDateTimeString.split(' ')[1] + " " + textDateTimeString.split(' ')[2]);
    }
    else if (textDateTimeString.split(' ')[1].toLowerCase() === "pm" || textDateTimeString.split(' ')[1].toLowerCase() === "am") {
      currentMsgDateTime = new Date(Date.now()).toLocaleString().split(' ')[0] + " " + textDateTimeString;
    }
    else if (daysOfWeek.includes(textDateTimeString.split(' ')[0].toLowerCase())) {
      let msgDay = daysOfWeek.indexOf(textDateTimeString.split(' ')[0].toLowerCase());
      let todayDay = (new Date()).getDay();
      msgDay = parseInt(msgDay);
      todayDay = parseInt(todayDay);
      let dayDiff = todayDay - msgDay;
      if (dayDiff < 0) {
        dayDiff = 7 + dayDiff;
      }
      currentMsgDateTime = subtractDaysFromDateWithGivenTime(Date.now(), dayDiff, textDateTimeString.split(' ')[1] + " " + textDateTimeString.split(' ')[2]);
    }
    else if (textDateTimeString.split(',').length == 2) {
      if ((monthsOfYear.includes(textDateTimeString.split(',')[0].split(' ')[0].toLowerCase()))) {
        let msgMonth = monthsOfYear.indexOf(textDateTimeString.split(',')[0].split(' ')[0].toLowerCase());
        let msgDay = textDateTimeString.split(',')[0].split(' ')[1];
        msgMonth = parseInt(msgMonth);
        msgDay = parseInt(msgDay);
        currentMsgDateTime = (new Date((new Date()).getFullYear(), msgMonth, msgDay, 0, 0, 0, 0)).toLocaleString().split(' ')[0] + textDateTimeString.split(',')[1];
      }
    }
    else if (textDateTimeString.split(',').length == 3) {
      let monthsOfYear = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      if ((monthsOfYear.includes(textDateTimeString.split(',')[0].split(' ')[0].toLowerCase()))) {
        let msgMonth = monthsOfYear.indexOf(textDateTimeString.split(',')[0].split(' ')[0].toLowerCase());
        let msgDay = textDateTimeString.split(',')[0].split(' ')[1];
        let msgYear = textDateTimeString.split(',')[1].split(' ')[1];
        msgMonth = parseInt(msgMonth);
        msgDay = parseInt(msgDay);
        msgYear = parseInt(msgYear)
        currentMsgDateTime = (new Date(msgYear, msgMonth, msgDay, 0, 0, 0, 0)).toLocaleString().split(' ')[0] + textDateTimeString.split(',')[2];
      }
    }

    let ReplyText = "```\n" + sender + " " + currentMsgDateTime + "\n" + message + "\n```\n\n";
    // Prepare reply button
    let chatSpaceStyleInputBox = (chatSpaceStyle) ? 'chatSpaceStyleInputBox="true"' : 'chatSpaceStyleInputBox="false"';
    let replyButtonHtmlString = `
      <div role="button"
        class="replyButton U26fgb mUbCce fKz7Od orLAid PFn4wd M9Bg4d"
        jsshadow="" aria-label="Reply to message"
        aria-disabled="false"
        tabindex="-1"
        data-tooltip="Reply to message"
        data-id="replyToMessage"
        data-tooltip-vertical-offset="-12"
        data-tooltip-horizontal-offset="0"
        replyMessage="`+ReplyText+`"
        ` + chatSpaceStyleInputBox + `
        ` + chatApp+ `
        >
        <div class="VTBa7b MbhUzd"></div>
        <span jsslot="" class="xjKiLb">
          <span class="Ce1Y1c" style="top: -10px">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="25px"
              viewBox="-2 3 24 24" version="1.1">
              <g id="surface1">
                <path style=" stroke:none;fill-rule:nonzero;fill: #5f6368;fill-opacity:1;"
                  d="M 20.3125 19.792969 L 20.3125 15.261719 C 20.3125 14.324219 19.984375 13.523438 19.324219 12.863281 C 18.664062 12.203125 17.863281 11.875 16.925781 11.875 L 6.09375 11.875 L 10.105469 15.886719 L 9.011719 16.980469 L 3.125 11.09375 L 9.011719 5.207031 L 10.105469 6.300781 L 6.09375 10.3125 L 16.925781 10.3125 C 18.28125 10.3125 19.445312 10.792969 20.417969 11.757812 C 21.390625 12.722656 21.875 13.890625 21.875 15.261719 L 21.875 19.792969 Z M 20.3125 19.792969 ">
                </path>
              </g>
            </svg>
          </span>
        </span>
      </div>
    `;
    let replyButton = createElementFromHTML(replyButtonHtmlString);
    replyButton.onclick = enterReplyText;
    if (messageTextElement.children[1].firstChild.getElementsByClassName('replyButton').length < 1) {
      messageTextElement.children[1].firstChild.prepend(replyButton);
    }
  }
  setTimeout(monitorForMessages, 2000);
}

function enterReplyText(e) {
  let chatSpaceStyleInputBox = (e.target.parentElement.parentElement.parentElement.getAttribute("chatSpaceStyleInputBox") === 'true') ? true : false;
  let chatApp = (e.target.parentElement.parentElement.parentElement.getAttribute("chatApp") === 'true') ? true : false;
  let replyMessage = e.target.parentElement.parentElement.parentElement.getAttribute("replyMessage");
  if (!chatSpaceStyleInputBox) {
    document.querySelector(".T2Ybvb").innerText = replyMessage;
  }
  else{
    // Dummy for Text visual until clicked
    try {
      e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[2].firstChild.children[1].firstChild.firstChild.innerText = replyMessage;
    }
    catch { }
    // Actual text
    try {
      e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('.T2Ybvb').innerText = replyMessage;
      e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('.T2Ybvb').addEventListener('DOMSubtreeModified', emptyDummyData, false);
      return
    }
    catch { }
    try {
      e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('.T2Ybvb').innerText = replyMessage;
      e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('.T2Ybvb').addEventListener('DOMSubtreeModified', emptyDummyData, false);
      return
    }
    catch { }
  }
}

function emptyDummyData(e) {
    if(!e.target.innerText.trim()){
        e.target.parentElement.parentNode.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[2].firstChild.children[1].firstChild.firstChild.innerText = "Reply";
    }
}

function createElementFromHTML(htmlString) {
  var escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
    createHTML: (to_escape) => to_escape
  })
  var div = document.createElement('div');
  div.innerHTML = escapeHTMLPolicy.createHTML(htmlString.trim());
  return div.firstChild;
}

function subtractMinutesFromDateTime(dateTime, minutes) {
  let subtractedDate = new Date();
  subtractedDate.setTime(dateTime - (minutes * 60 * 1000));
  let dateString = subtractedDate.toLocaleString();
  return dateString;
}

function subtractDaysFromDateWithGivenTime(date, days, time) {
  let yesterdayDateTime = new Date();
  yesterdayDateTime.setTime(date - (days * 24 * 60 * 60 * 1000));
  let dateString = yesterdayDateTime.toLocaleString().split(' ')[0] + " " + time;
  return dateString;
}