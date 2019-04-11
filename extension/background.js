// Context types:
// <https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/menus/ContextType>
browser.contextMenus.create({
  id: "highlight-text",
  title: "Highlight text",
  contexts: ["selection"]
});
browser.contextMenus.create({
  id: "highlight-image",
  title: "Highlight image",
  contexts: ["image"]
});

browser.contextMenus.onClicked.addListener(function(info, tab) {
  switch (info.menuItemId) {
    case "highlight-text":
      browser.tabs.sendMessage(tab.id, {type: "highlight-text"});
      break;
    case "highlight-image":
      browser.tabs.sendMessage(tab.id, {type: "highlight-image", src: info.srcUrl});
      break;
  }
})
