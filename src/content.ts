// Content script to apply black filter to images
let isFilterActive = false;
let observer = null;

// Function to apply black filter to a single element
function applyFilterToElement(element) {
  if (!element || element.getAttribute('data-black-filtered') === 'true') return;
  
  element.style.filter = 'brightness(0) !important';
  element.style.setProperty('filter', 'brightness(0)', 'important');
  element.setAttribute('data-black-filtered', 'true');
}

// Function to apply black filter to all images
function applyBlackFilter() {
  // Target all possible image elements and elements with background images
  const selectors = [
    'img',
    'picture',
    'video',
    'canvas',
    'svg',
    '[style*="background-image"]',
    '[style*="background:"]',
    '.image',
    '[class*="image"]',
    '[class*="photo"]',
    '[class*="picture"]'
  ];
  
  const elements = document.querySelectorAll(selectors.join(', '));
  
  elements.forEach(applyFilterToElement);
  
  // Also check for elements with computed background images
  const allElements = document.querySelectorAll('*');
  allElements.forEach(element => {
    const computedStyle = window.getComputedStyle(element);
    if (computedStyle.backgroundImage && computedStyle.backgroundImage !== 'none') {
      applyFilterToElement(element);
    }
  });
}

// Function to remove black filter
function removeBlackFilter() {
  const filteredElements = document.querySelectorAll('[data-black-filtered="true"]');
  
  filteredElements.forEach(element => {
    element.style.filter = '';
    element.style.removeProperty('filter');
    element.removeAttribute('data-black-filtered');
  });
}

// Enhanced mutation observer to catch all dynamic content
function startObserver() {
  if (observer) {
    observer.disconnect();
  }

  observer = new MutationObserver((mutations) => {
    if (!isFilterActive) return;
    
    mutations.forEach((mutation) => {
      // Handle added nodes
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node;
          
          // Check if the added node itself is an image element
          const selectors = [
            'img',
            'picture', 
            'video',
            'canvas',
            'svg',
            '[style*="background-image"]',
            '[style*="background:"]'
          ];
          
          if (element.matches && element.matches(selectors.join(', '))) {
            applyFilterToElement(element);
          }
          
          // Check for image elements within the added node
          if (element.querySelectorAll) {
            const newImages = element.querySelectorAll(selectors.join(', '));
            newImages.forEach(applyFilterToElement);
            
            // Also check for elements with computed background images
            const allNewElements = element.querySelectorAll('*');
            allNewElements.forEach(el => {
              const computedStyle = window.getComputedStyle(el);
              if (computedStyle.backgroundImage && computedStyle.backgroundImage !== 'none') {
                applyFilterToElement(el);
              }
            });
          }
        }
      });
      
      // Handle attribute changes (like style changes that add background images)
      if (mutation.type === 'attributes' && 
          (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
        const element = mutation.target;
        const computedStyle = window.getComputedStyle(element);
        
        if (computedStyle.backgroundImage && computedStyle.backgroundImage !== 'none') {
          applyFilterToElement(element);
        }
        
        // Check if element now matches image selectors
        const selectors = [
          'img',
          'picture',
          'video', 
          'canvas',
          'svg',
          '[style*="background-image"]',
          '[style*="background:"]'
        ];
        
        if (element.matches && element.matches(selectors.join(', '))) {
          applyFilterToElement(element);
        }
      }
    });
  });

  // Observe with comprehensive options
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class', 'src', 'srcset'],
    attributeOldValue: false
  });
}

// Function to handle filter toggle
function toggleFilter(enabled) {
  isFilterActive = enabled;
  
  if (enabled) {
    applyBlackFilter();
    startObserver();
  } else {
    removeBlackFilter();
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }
}

// Listen for messages from popup and background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleFilter') {
    toggleFilter(request.enabled);
    sendResponse({ success: true });
  }
});

// Initialize filter state when page loads
chrome.storage.sync.get(['filterEnabled'], (result) => {
  const enabled = result.filterEnabled || false;
  toggleFilter(enabled);
});

// Also apply filter when DOM is fully loaded (backup)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['filterEnabled'], (result) => {
      const enabled = result.filterEnabled || false;
      if (enabled) {
        setTimeout(() => applyBlackFilter(), 100);
      }
    });
  });
} else {
  // DOM is already loaded
  chrome.storage.sync.get(['filterEnabled'], (result) => {
    const enabled = result.filterEnabled || false;
    if (enabled) {
      applyBlackFilter();
    }
  });
}

// Handle page visibility changes (when switching tabs)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && isFilterActive) {
    // Re-apply filter when tab becomes visible
    setTimeout(() => applyBlackFilter(), 100);
  }
});

// Handle window focus (additional safety net)
window.addEventListener('focus', () => {
  if (isFilterActive) {
    setTimeout(() => applyBlackFilter(), 100);
  }
});