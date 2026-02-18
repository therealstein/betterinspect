// HAR Parser - Extracts and processes network request data from HAR format

class HARParser {
  constructor() {
    this.defaultHeaders = [
      'user-agent',
      'accept',
      'accept-language',
      'accept-encoding'
    ];
  }

  // Get HAR data from Chrome DevTools Network API
  async getHARData() {
    return new Promise((resolve, reject) => {
      chrome.devtools.network.getHAR((har) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(har);
        }
      });
    });
  }

  // Process HAR entries into structured format
  async getProcessedRequests(headerFilters, responseHandling) {
    try {
      const har = await this.getHARData();
      if (!har || !har.log || !har.log.entries) {
        return [];
      }

      return har.log.entries
        .map(entry => this.processEntry(entry, headerFilters, responseHandling))
        .filter(request => request !== null); // Filter out null entries
    } catch (error) {
      console.error('Error processing HAR data:', error);
      return [];
    }
  }

  // Process individual HAR entry
  processEntry(entry, headerFilters, responseHandling) {
    try {
      const request = entry.request;
      const response = entry.response;

      // Extract headers as plain objects
      const requestHeaders = this.headersToObject(request.headers);
      const responseHeaders = this.headersToObject(response.headers);

      // Apply header filtering
      const filteredRequestHeaders = this.filterHeaders(requestHeaders, headerFilters);
      const filteredResponseHeaders = this.filterHeaders(responseHeaders, headerFilters);

      // Handle request body
      let requestBody = '';
      if (request.postData) {
        requestBody = this.processRequestBody(request.postData);
      }

      // Handle response body
      let responseBody = '';
      let responseSize = 0;
      if (response.content && response.content.text) {
        const processedResponse = this.processResponse(response.content, responseHandling);
        responseBody = processedResponse.body;
        responseSize = processedResponse.size;
      }

      return {
        id: this.generateRequestId(entry),
        url: request.url,
        method: request.method,
        requestHeaders: filteredRequestHeaders,
        requestBody: requestBody,
        responseStatus: response.status,
        responseStatusText: response.statusText,
        responseHeaders: filteredResponseHeaders,
        responseBody: responseBody,
        responseSize: responseSize,
        mimeType: response.content ? response.content.mimeType : 'unknown',
        startedDateTime: entry.startedDateTime,
        time: entry.time || 0,
        timings: entry.timings || {},
        queryString: request.queryString || [],
        type: this.determineRequestType(response.content, request.url)
      };
    } catch (error) {
      console.error('Error processing HAR entry:', error);
      return null;
    }
  }

  // Convert HAR headers array to object
  headersToObject(headers) {
    const obj = {};
    if (Array.isArray(headers)) {
      headers.forEach(header => {
        if (header.name && header.value !== undefined) {
          obj[header.name.toLowerCase()] = header.value;
        }
      });
    }
    return obj;
  }

  // Apply header filtering based on user preferences
  filterHeaders(headers, filters) {
    const filtered = { ...headers };

    // Remove browser headers
    if (filters.browserHeaders) {
      this.defaultHeaders.forEach(header => {
        delete filtered[header];
      });
    }

    // Remove authentication headers
    if (filters.authHeaders) {
      const authHeaders = [
        'authorization',
        'x-api-key',
        'x-auth-token',
        'bearer',
        'x-access-token',
        'authentication'
      ];
      authHeaders.forEach(header => {
        delete filtered[header];
      });
    }

    // Remove cookies
    if (filters.cookies) {
      delete filtered['cookie'];
      delete filtered['set-cookie'];
    }

    // Remove cache headers
    if (filters.cacheHeaders) {
      const cacheHeaders = [
        'cache-control',
        'etag',
        'if-none-match',
        'if-modified-since',
        'last-modified',
        'expires',
        'pragma'
      ];
      cacheHeaders.forEach(header => {
        delete filtered[header];
      });
    }

    // Remove custom headers
    if (filters.customHeaders && Array.isArray(filters.customHeaders)) {
      filters.customHeaders.forEach(header => {
        delete filtered[header.toLowerCase()];
      });
    }

    return filtered;
  }

  // Process request body based on content type
  processRequestBody(postData) {
    if (postData.text) {
      return postData.text;
    } else if (postData.params && postData.params.length > 0) {
      // Handle form data
      const formData = postData.params.map(param => {
        return `${param.name}=${encodeURIComponent(param.value)}`;
      }).join('&');
      return formData;
    }
    return '';
  }

  // Process response body with size handling
  processResponse(content, responseHandling) {
    const maxSize = responseHandling.maxBodySize || 100000;
    let body = '';
    let size = content.size || 0;

    if (content.text) {
      // Handle base64 encoded content
      if (content.encoding === 'base64') {
        try {
          body = atob(content.text);
        } catch (error) {
          body = '[Binary data - unable to decode]';
        }
      } else {
        body = content.text;
      }

      // Truncate if too large
      if (responseHandling.truncateLarge && body.length > maxSize) {
        body = body.substring(0, maxSize) + '\n\n... [Response truncated, size: ' + this.formatBytes(body.length) + ']';
      }
    } else {
      body = '[No response body]';
    }

    return { body, size };
  }

  // Generate unique request ID
  generateRequestId(entry) {
    return entry.request.url + '_' + entry.startedDateTime;
  }

  // Determine request type based on URL and MIME type
  determineRequestType(content, url) {
    const mimeType = content ? content.mimeType.toLowerCase() : '';
    const urlLower = url.toLowerCase();

    if (mimeType.includes('json')) return 'xhr';
    if (mimeType.includes('javascript')) return 'script';
    if (mimeType.includes('css')) return 'stylesheet';
    if (mimeType.includes('html')) return 'document';
    if (mimeType.includes('image')) return 'image';
    if (mimeType.includes('font')) return 'font';

    // Check URL patterns
    if (urlLower.includes('.js')) return 'script';
    if (urlLower.includes('.css')) return 'stylesheet';
    if (urlLower.includes('.png') || urlLower.includes('.jpg') || urlLower.includes('.gif')) return 'image';

    return 'other';
  }

  // Format bytes for display
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HARParser;
}