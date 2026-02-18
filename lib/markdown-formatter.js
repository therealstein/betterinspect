// Markdown Formatter - Converts network requests to AI-optimized markdown format

class MarkdownFormatter {
  constructor() {
    this.requestCounter = 0;
  }

  // Format a single request as markdown
  formatSingleRequest(request) {
    this.requestCounter++;
    
    let markdown = `# Request #${this.requestCounter}\n\n`;
    
    // Basic request info
    markdown += `**Method**: ${request.method}  \n`;
    markdown += `**URL**: ${request.url}  \n`;
    markdown += `**Timestamp**: ${request.startedDateTime}  \n`;
    markdown += `**Duration**: ${request.time}ms  \n`;
    markdown += `**Type**: ${request.type}  \n\n`;

    // Request Headers
    if (Object.keys(request.requestHeaders).length > 0) {
      markdown += `## Request Headers\n\`\`\`\n`;
      Object.entries(request.requestHeaders).forEach(([name, value]) => {
        markdown += `${name}: ${value}\n`;
      });
      markdown += `\`\`\`\n\n`;
    }

    // Request Body
    if (request.requestBody) {
      markdown += `## Request Body\n`;
      if (this.isJSON(request.requestBody)) {
        markdown += `\`\`\`json\n`;
        try {
          const parsed = JSON.parse(request.requestBody);
          markdown += JSON.stringify(parsed, null, 2);
        } catch (error) {
          markdown += request.requestBody;
        }
        markdown += `\n\`\`\`\n\n`;
      } else if (this.isXML(request.requestBody)) {
        markdown += `\`\`\`xml\n${request.requestBody}\n\`\`\`\n\n`;
      } else if (this.isHTML(request.requestBody)) {
        markdown += `\`\`\`html\n${request.requestBody}\n\`\`\`\n\n`;
      } else {
        markdown += `\`\`\`\n${request.requestBody}\n\`\`\`\n\n`;
      }
    }

    // Response Status
    const statusClass = this.getStatusClass(request.responseStatus);
    markdown += `## Response Status\n**${request.responseStatus} ${request.responseStatusText}** (${request.time}ms) ${statusClass}\n\n`;

    // Response Headers
    if (Object.keys(request.responseHeaders).length > 0) {
      markdown += `## Response Headers\n\`\`\`\n`;
      Object.entries(request.responseHeaders).forEach(([name, value]) => {
        markdown += `${name}: ${value}\n`;
      });
      markdown += `\`\`\`\n\n`;
    }

    // Response Body
    if (request.responseBody) {
      markdown += `## Response Body\n`;
      markdown += `**Size**: ${this.formatBytes(request.responseSize)}  \n\n`;
      
      if (this.isJSON(request.responseBody)) {
        markdown += `\`\`\`json\n`;
        try {
          const parsed = JSON.parse(request.responseBody);
          markdown += JSON.stringify(parsed, null, 2);
        } catch (error) {
          markdown += request.responseBody;
        }
        markdown += `\n\`\`\`\n\n`;
      } else if (this.isXML(request.responseBody)) {
        markdown += `\`\`\`xml\n${request.responseBody}\n\`\`\`\n\n`;
      } else if (this.isHTML(request.responseBody)) {
        markdown += `\`\`\`html\n${this.truncateHTML(request.responseBody)}\n\`\`\`\n\n`;
      } else {
        markdown += `\`\`\`\n${request.responseBody}\n\`\`\`\n\n`;
      }
    }

    return markdown;
  }

  // Format multiple requests with numbered sequence
  formatMultipleRequests(requests, preserveOrder = true) {
    this.requestCounter = 0; // Reset counter
    
    if (!requests || requests.length === 0) {
      return '# Network Requests\n\nNo requests to display.';
    }

    let markdown = `# Network Requests (${requests.length} total)\n\n`;
    
    // Sort by timestamp if preserveOrder is true
    let sortedRequests = preserveOrder 
      ? requests.sort((a, b) => new Date(a.startedDateTime) - new Date(b.startedDateTime))
      : requests;

    // Format each request
    sortedRequests.forEach((request, index) => {
      markdown += this.formatSingleRequest(request);
      if (index < sortedRequests.length - 1) {
        markdown += '---\n\n';
      }
    });

    return markdown;
  }

  // Generate a summary of requests
  generateSummary(requests) {
    if (!requests || requests.length === 0) {
      return 'No requests found.';
    }

    const summary = {
      total: requests.length,
      methods: {},
      statusCodes: {},
      domains: {},
      types: {}
    };

    requests.forEach(request => {
      // Count methods
      summary.methods[request.method] = (summary.methods[request.method] || 0) + 1;
      
      // Count status codes
      const statusCategory = Math.floor(request.responseStatus / 100) * 100;
      summary.statusCodes[statusCategory] = (summary.statusCodes[statusCategory] || 0) + 1;
      
      // Count domains
      try {
        const domain = new URL(request.url).hostname;
        summary.domains[domain] = (summary.domains[domain] || 0) + 1;
      } catch (error) {
        // Invalid URL, skip
      }
      
      // Count types
      summary.types[request.type] = (summary.types[request.type] || 0) + 1;
    });

    let markdown = '# Request Summary\n\n';
    markdown += `**Total Requests**: ${summary.total}\n\n`;
    
    markdown += '## Methods\n';
    Object.entries(summary.methods).forEach(([method, count]) => {
      markdown += `- ${method}: ${count}\n`;
    });
    
    markdown += '\n## Status Codes\n';
    Object.entries(summary.statusCodes).forEach(([code, count]) => {
      const range = this.getStatusRange(parseInt(code));
      markdown += `- ${range}: ${count}\n`;
    });
    
    if (Object.keys(summary.domains).length > 0) {
      markdown += '\n## Top Domains\n';
      const sortedDomains = Object.entries(summary.domains)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      sortedDomains.forEach(([domain, count]) => {
        markdown += `- ${domain}: ${count}\n`;
      });
    }
    
    markdown += '\n## Request Types\n';
    Object.entries(summary.types).forEach(([type, count]) => {
      markdown += `- ${type}: ${count}\n`;
    });

    return markdown;
  }

  // Helper methods for content detection
  isJSON(content) {
    if (!content || typeof content !== 'string') return false;
    const trimmed = content.trim();
    return trimmed.startsWith('{') && trimmed.endsWith('}') ||
           trimmed.startsWith('[') && trimmed.endsWith(']');
  }

  isXML(content) {
    if (!content || typeof content !== 'string') return false;
    const trimmed = content.trim();
    return trimmed.startsWith('<') && trimmed.endsWith('>');
  }

  isHTML(content) {
    if (!content || typeof content !== 'string') return false;
    const trimmed = content.trim().toLowerCase();
    return trimmed.startsWith('<!doctype html') || 
           trimmed.startsWith('<html') ||
           (trimmed.startsWith('<') && trimmed.includes('</'));
  }

  // Get status class for display
  getStatusClass(status) {
    if (status >= 200 && status < 300) return '✅';
    if (status >= 300 && status < 400) return '↪️';
    if (status >= 400 && status < 500) return '❌';
    if (status >= 500) return '🔥';
    return '❓';
  }

  // Get status range description
  getStatusRange(code) {
    switch (code) {
      case 200: return '2xx (Success)';
      case 300: return '3xx (Redirection)';
      case 400: return '4xx (Client Error)';
      case 500: return '5xx (Server Error)';
      default: return `${code}x`;
    }
  }

  // Truncate HTML for preview
  truncateHTML(html, maxLength = 1000) {
    if (html.length <= maxLength) return html;
    return html.substring(0, maxLength) + '\n\n... [HTML truncated]';
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
  module.exports = MarkdownFormatter;
}