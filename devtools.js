// DevTools entry point - Creates and manages the betterinspect panel

chrome.devtools.panels.create(
  'betterinspect',
  'icons/icon48.png',
  'panel.html',
  function(panel) {
    console.log('betterinspect panel created');
    
    // Panel shown/hidden handlers
    panel.onShown.addListener(function(window) {
      console.log('Panel shown');
      // Send initial data when panel becomes visible
      window.postMessage({ type: 'panelShown' }, '*');
    });
    
    panel.onHidden.addListener(function() {
      console.log('Panel hidden');
      // Clean up resources when panel is hidden
      window.postMessage({ type: 'panelHidden' }, '*');
    });
  }
);

// Forward messages between panel and background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Forward to panel if it exists
  chrome.devtools.inspectedWindow.eval('window.postMessage(' + JSON.stringify(request) + ', "*")');
  return true;
});