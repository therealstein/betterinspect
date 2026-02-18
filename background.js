// Background service worker for Network AI Copier
// Handles extension lifecycle and initial setup

chrome.runtime.onInstalled.addListener(() => {
  console.log('Network AI Copier installed');
  
  // Initialize default settings
  chrome.storage.sync.get({
    headerFilters: {
      browserHeaders: true,
      authHeaders: false,
      cookies: false,
      cacheHeaders: false,
      customHeaders: []
    },
    responseHandling: {
      truncateLarge: true,
      maxBodySize: 100000
    }
  }, (settings) => {
    if (!settings.headerFilters || !settings.responseHandling) {
      chrome.storage.sync.set({
        headerFilters: {
          browserHeaders: true,
          authHeaders: false,
          cookies: false,
          cacheHeaders: false,
          customHeaders: []
        },
        responseHandling: {
          truncateLarge: true,
          maxBodySize: 100000
        }
      });
    }
  });
});

// Handle messages from DevTools panel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getSettings') {
    chrome.storage.sync.get(['headerFilters', 'responseHandling'], (result) => {
      sendResponse({
        headerFilters: result.headerFilters || {},
        responseHandling: result.responseHandling || {}
      });
    });
    return true; // Keep message channel open for async response
  }
  
  if (request.type === 'updateSettings') {
    chrome.storage.sync.set({
      headerFilters: request.headerFilters,
      responseHandling: request.responseHandling
    }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

console.log('Background script loaded');