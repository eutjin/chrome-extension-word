// background.ts

// let savedText: string = '';

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === 'saveText') {
//     savedText = request.selectedText;
//   }
// });

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === 'getSavedText') {
//     sendResponse({ savedText });
//   }
// });

const { v4: uuidv4 } = require('uuid');

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveText",
    title: "Save Text",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveText" && tab) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: () => {
        const selectedText = window.getSelection()!.toString();
        chrome.runtime.sendMessage({ action: 'saveText', selectedText });
      },
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveText') {
    chrome.storage.local.get('savedText', (result) => {
      const savedText = result.savedText || [];
      console.log("UUID: ", uuidv4())
      let data={
        id: uuidv4(),
        title: request.selectedText,
        description: null,
        links: [],
        createDate: new Date(Date.now()),
        updateDate: new Date(Date.now()),
        labels : [],
        difficulty: null, 
        group: null
      }

      savedText.push(data)


      // savedText.push(request.selectedText);
      chrome.storage.local.set({ savedText });
    });
  }
});
