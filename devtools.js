// DevTools entry point - Creates and manages the betterinspect panel
// This file has access to chrome.devtools.* APIs

let panelWindow = null;

chrome.devtools.panels.create(
  'betterinspect',
  'icons/icon48.png',
  'panel.html',
  function(panel) {
    console.log('betterinspect panel created');
    
    // Panel shown/hidden handlers
    panel.onShown.addListener(function(window) {
      panelWindow = window;
      console.log('Panel shown');
      
      // Send initial HAR data when panel becomes visible
      loadAndSendNetworkData();
    });
    
    panel.onHidden.addListener(function() {
      console.log('Panel hidden');
    });
  }
);

// Listen for network requests in real-time
chrome.devtools.network.onRequestFinished.addListener(function(request) {
  console.log('Request finished:', request.url);
  
  // Get response content and send to panel
  request.getContent(function(content, encoding) {
    const requestData = {
      type: 'requestFinished',
      request: {
        url: request.url,
        method: request.method,
        status: request.response ? request.response.status : 0,
        statusText: request.response ? request.response.statusText : '',
        requestHeaders: request.request ? request.request.headers : [],
        responseHeaders: request.response ? request.response.headers : [],
        postData: request.request ? request.request.postData : null,
        content: content,
        encoding: encoding,
        startedDateTime: request.startedDateTime,
        time: request.time || 0,
        timings: request.timings || {},
        mimeType: request.response && request.response.content ? request.response.content.mimeType : ''
      }
    };
    
    sendToPanel(requestData);
  });
});

// Load all network data and send to panel
function loadAndSendNetworkData() {
  chrome.devtools.network.getHAR(function(har) {
    console.log('HAR data loaded:', har ? har.log?.entries?.length : 0, 'entries');
    
    if (har && har.log && har.log.entries) {
      const entries = har.log.entries.map(entry => ({
        url: entry.request.url,
        method: entry.request.method,
        status: entry.response.status,
        statusText: entry.response.statusText,
        requestHeaders: entry.request.headers,
        responseHeaders: entry.response.headers,
        postData: entry.request.postData,
        mimeType: entry.response.content ? entry.response.content.mimeType : '',
        startedDateTime: entry.startedDateTime,
        time: entry.time || 0,
        timings: entry.timings || {},
        queryString: entry.request.queryString || [],
        content: entry.response.content ? entry.response.content.text : '',
        encoding: entry.response.content ? entry.response.content.encoding : null
      }));
      
      sendToPanel({ type: 'harData', entries: entries });
    } else {
      sendToPanel({ type: 'harData', entries: [] });
    }
  });
}

// Send message to panel
function sendToPanel(message) {
  if (panelWindow) {
    panelWindow.postMessage(message, '*');
  }
}

// Listen for messages from panel
window.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'refreshRequests') {
    loadAndSendNetworkData();
  }
});

// Forward messages from background to panel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  sendToPanel(request);
  return true;
});

console.log('DevTools script loaded');