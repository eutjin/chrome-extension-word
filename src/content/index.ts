// chrome.runtime.onMessage.addListener(
//   function(msg, sender, sendResponse) {
//     const dogImg: HTMLImageElement = document.createElement('img');
//     dogImg.src = msg;
//     document.body.appendChild(dogImg);
//   }
// );

// contentScript.js

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === 'getSelectedText') {
//     const selectedText = window.getSelection()?.toString();
//     sendResponse({ selectedText });
//   }
// });

// chrome.contextMenus.create({
//   title: "Save Text",
//   contexts: ["selection"],
//   onclick: (info, tab) => {
//     chrome.tabs.sendMessage(tab.id!, { action: 'saveText', selectedText: info.selectionText });
//   }
// });

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === 'saveText') {
//     const selectedText = window.getSelection()!.toString();
//     sendResponse({ selectedText });
//   }
// });
