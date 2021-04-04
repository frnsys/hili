// Context types:
// <https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/menus/ContextType>
// Firefox for Android does not support contextMenus;
// on Android this interaction is handled in the frontend
if (browser.contextMenus) {
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
}

browser.runtime.onMessage.addListener(function(msg, sender) {
  switch (msg.type) {
    case "highlighted":
      if (browser.contextMenus) {
        browser.notifications.create({
          'type': 'basic',
          'title': 'Highlighted',
          'message': msg.data.text
        });
      }
      break;
   case "init":
      if (!browser.contextMenus) {
        browser.tabs.sendMessage(sender.tab.id, {type: "init-frontend"});
      }
      break;
  }
});
