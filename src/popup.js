// Popup script for Chrome extension
document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('filterToggle');
  const status = document.getElementById('status');

  // Load current state
  chrome.storage.sync.get(['filterEnabled'], function(result) {
    const isEnabled = result.filterEnabled || false;
    toggle.checked = isEnabled;
    updateStatus(isEnabled);
  });

  // Handle toggle change
  toggle.addEventListener('change', function() {
    const isEnabled = toggle.checked;
    
    // Save state
    chrome.storage.sync.set({ filterEnabled: isEnabled });
    
    // Update status
    updateStatus(isEnabled);
    
    // Send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'toggleFilter',
        enabled: isEnabled
      });
    });
  });

  function updateStatus(enabled) {
    if (enabled) {
      status.textContent = 'Active';
      status.className = 'status active';
    } else {
      status.textContent = 'Inactive';
      status.className = 'status inactive';
    }
  }
});