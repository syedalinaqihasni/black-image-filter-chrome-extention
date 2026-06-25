// Background script for Chrome extension
chrome.runtime.onInstalled.addListener(() => {
  // Initialize storage
  chrome.storage.sync.set({ filterEnabled: false });
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // This will open the popup, which is handled by popup.html
});

// Listen for tab updates to apply filter on new pages
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if filter should be applied
    chrome.storage.sync.get(['filterEnabled'], (result) => {
      if (result.filterEnabled) {
        chrome.tabs.sendMessage(tabId, {
          action: 'toggleFilter',
          enabled: true
        }).catch(() => {
          // Ignore errors for pages where content scripts can't run
        });
      }
    });
  }
});