// Error handling and edge case utilities for betterinspect

class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100;
  }

  // Handle and log errors
  handleError(error, context = '') {
    const errorEntry = {
      timestamp: new Date().toISOString(),
      message: error.message || error,
      stack: error.stack,
      context: context
    };

    this.errorLog.push(errorEntry);
    
    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }

    console.error(`[betterinspect Error] ${context}:`, error);
    
    return errorEntry;
  }

  // Get recent errors
  getRecentErrors(count = 10) {
    return this.errorLog.slice(-count);
  }

  // Clear error log
  clearLog() {
    this.errorLog = [];
  }
}

// Safe JSON parsing with fallback
function safeJSONParse(jsonString, fallback = null) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('Failed to parse JSON:', error.message);
    return fallback;
  }
}

// Safe URL parsing with validation
function safeURLParse(urlString) {
  try {
    const url = new URL(urlString);
    return {
      valid: true,
      url: url,
      hostname: url.hostname,
      pathname: url.pathname,
      search: url.search,
      protocol: url.protocol
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
      original: urlString
    };
  }
}

// Validate network request data
function validateRequest(request) {
  const errors = [];
  
  if (!request) {
    errors.push('Request object is null or undefined');
    return { valid: false, errors };
  }

  if (!request.url) {
    errors.push('Request URL is missing');
  }

  if (!request.method) {
    errors.push('Request method is missing');
  }

  if (typeof request.time !== 'number' || request.time < 0) {
    errors.push('Invalid request time');
  }

  if (!request.startedDateTime) {
    errors.push('Request timestamp is missing');
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}

// Truncate text safely
function safeTruncate(text, maxLength = 1000, suffix = '...') {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength) + suffix;
}

// Check if response body is binary
function isBinaryResponse(mimeType) {
  if (!mimeType) return false;
  
  const binaryTypes = [
    'image/', 'video/', 'audio/', 'application/pdf',
    'application/zip', 'application/octet-stream',
    'application/x-rar', 'application/x-tar',
    'application/gzip'
  ];
  
  return binaryTypes.some(type => mimeType.toLowerCase().includes(type));
}

// Check if response body is too large
function isResponseTooLarge(size, maxSize = 10000000) { // 10MB default
  return size > maxSize;
}

// Escape HTML to prevent XSS
function escapeHtml(unsafe) {
  if (!unsafe || typeof unsafe !== 'string') {
    return '';
  }
  
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Sanitize request headers
function sanitizeHeaders(headers, sensitiveKeys = ['authorization', 'cookie', 'token']) {
  const sanitized = {};
  
  if (!headers || typeof headers !== 'object') {
    return sanitized;
  }
  
  Object.entries(headers).forEach(([key, value]) => {
    const lowerKey = key.toLowerCase();
    if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = value;
    }
  });
  
  return sanitized;
}

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for performance
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Format file size
function formatFileSize(bytes) {
  if (typeof bytes !== 'number' || bytes < 0) {
    return 'Unknown';
  }
  
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Format duration
function formatDuration(ms) {
  if (typeof ms !== 'number' || ms < 0) {
    return 'Unknown';
  }
  
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  } else if (ms < 60000) {
    return `${(ms / 1000).toFixed(2)}s`;
  } else {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}m ${seconds}s`;
  }
}

// Check if running in DevTools context
function isDevToolsContext() {
  try {
    return typeof chrome !== 'undefined' && 
           typeof chrome.devtools !== 'undefined';
  } catch {
    return false;
  }
}

// Retry function with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3, initialDelay = 1000) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (i === maxRetries - 1) {
        throw lastError;
      }
      
      const delay = initialDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

// Export utilities
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ErrorHandler,
    safeJSONParse,
    safeURLParse,
    validateRequest,
    safeTruncate,
    isBinaryResponse,
    isResponseTooLarge,
    escapeHtml,
    sanitizeHeaders,
    debounce,
    throttle,
    formatFileSize,
    formatDuration,
    isDevToolsContext,
    retryWithBackoff
  };
}