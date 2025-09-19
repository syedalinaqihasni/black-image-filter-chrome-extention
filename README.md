# Black Image Filter Chrome Extension

A Chrome extension that applies a black filter to all images on web pages, perfect for focusing on text content or reducing visual distractions.

## Features

- **One-click toggle**: Enable/disable the filter with a single click
- **Universal compatibility**: Works on all websites
- **Dynamic loading**: Automatically applies filter to images loaded after page load
- **Persistent state**: Remembers your preference across browser sessions
- **Beautiful UI**: Modern, glass-morphism design with smooth animations

## Installation

### For Development/Testing:

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select the extension folder
4. The extension icon will appear in your Chrome toolbar

### For Production:

1. Package the extension files
2. Submit to Chrome Web Store following Google's guidelines

## How to Use

1. Click the extension icon in your Chrome toolbar
2. Toggle the switch to enable/disable the black image filter
3. All images on the current and future pages will appear black when enabled
4. Toggle off to restore normal image visibility

## Files Structure

- `manifest.json` - Extension configuration
- `popup.html` - Extension popup interface
- `popup.js` - Popup functionality
- `content.js` - Content script that modifies images
- `background.js` - Background service worker
- Icons (16x16, 32x32, 48x48, 128x128 px)

## Technical Details

- Uses Chrome Manifest V3
- Applies CSS `brightness(0)` filter to make images black
- Includes mutation observer for dynamically loaded content
- Stores state using Chrome storage API
- Works with img, picture, video, canvas, svg elements and background images

## Permissions

- `activeTab` - To modify the current active tab
- `storage` - To remember filter state across sessions

## Browser Compatibility

- Chrome 88+
- Microsoft Edge 88+
- Other Chromium-based browsers

## Privacy

This extension:
- Does not collect any user data
- Does not send information to external servers
- Only modifies visual appearance of images locally
- Settings are stored locally in browser storage