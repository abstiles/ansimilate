'use strict';

var tabEnabledMap = {};

/** Update tabs to ensure the active status is correct. */
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  console.log("Tab updated: " + tabId);
  console.log(JSON.stringify(changeInfo));
  var tabEnabled = tabEnabledMap[tabId];
  console.log("Tab enabled? " + tabEnabled);
  if (tabEnabled === true) {
    chrome.pageAction.show(tabId);
  } else if (tabEnabled === false) {
    chrome.pageAction.hide(tabId);
  }
  if (changeInfo.status === "complete") {
    delete tabEnabledMap[tabId];
  }
});

/** Inform the tab that this extension should activate. */
chrome.pageAction.onClicked.addListener(function(tab) {
  chrome.tabs.sendMessage(tab.id, {event: "iconClicked"});
});

/** Check headers for pages to see whether this extension is applicable. */
chrome.webRequest.onHeadersReceived.addListener(function(details) {
  if (details.tabId === chrome.tabs.TAB_ID_NONE) {
    // Invalid tab. Ignore.
    return;
  }
  var contentType = getContentType(details);
  console.log("Content type for tab " + details.tabId + ":" + contentType);
  if (contentType === "text/plain") {
    tabEnabledMap[details.tabId] = true;
    chrome.pageAction.show(details.tabId);
  }
}, { urls: ['*://*/*']
   , types: ['main_frame']
}, ['responseHeaders']);

/** Extract the content type from the onHeadersReceived details object. */
function getContentType(requestDetails) {
  var contentTypeHeader = requestDetails.responseHeaders.find(
    header => header.name.toLowerCase() === "content-type");
  return contentTypeHeader && contentTypeHeader.value.split(';')[0];
}
