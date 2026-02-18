// Main Panel Logic - betterinspect extension
class BetterInspectPanel {
  constructor() {
    this.harParser = new HARParser();
    this.markdownFormatter = new MarkdownFormatter();
    this.requests = [];
    this.selectedRequests = [];
    this.filters = {
      text: '',
      type: 'all',
      status: 'all'
    };
    this.sortBy = 'time';
    this.sortDirection = 'desc';
    this.settings = {
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
    };
    
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupEventListeners();
    await this.loadNetworkRequests();
  }

  async loadSettings() {
    try {
      const response = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: 'getSettings' }, resolve);
      });
      
      if (response.headerFilters) {
        this.settings.headerFilters = { ...this.settings.headerFilters, ...response.headerFilters };
      }
      if (response.responseHandling) {
        this.settings.responseHandling = { ...this.settings.responseHandling, ...response.responseHandling };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  setupEventListeners() {
    // Search and filter
    document.getElementById('search-input').addEventListener('input', (e) => {
      this.filters.text = e.target.value.toLowerCase();
      this.updateRequestTable();
    });

    document.getElementById('filter-type').addEventListener('change', (e) => {
      this.filters.type = e.target.value;
      this.updateRequestTable();
    });

    document.getElementById('filter-status').addEventListener('change', (e) => {
      this.filters.status = e.target.value;
      this.updateRequestTable();
    });

    // Toolbar actions
    document.getElementById('clear-search').addEventListener('click', () => {
      document.getElementById('search-input').value = '';
      this.filters.text = '';
      this.updateRequestTable();
    });

    document.getElementById('refresh-requests').addEventListener('click', () => {
      this.loadNetworkRequests();
    });

    document.getElementById('clear-selected').addEventListener('click', () => {
      this.clearSelection();
    });

    document.getElementById('refresh-empty').addEventListener('click', () => {
      this.loadNetworkRequests();
    });

    // Selection handling
    document.getElementById('select-all-checkbox').addEventListener('change', (e) => {
      if (e.target.checked) {
        this.selectAllRequests();
      } else {
        this.clearSelection();
      }
    });

    // Copy button
    document.getElementById('copy-for-ai').addEventListener('click', () => {
      this.copyRequestsForAI();
    });

    // Settings
    document.getElementById('settings-btn').addEventListener('click', () => {
      this.showSettingsModal();
    });

    document.getElementById('close-settings').addEventListener('click', () => {
      this.hideSettingsModal();
    });

    document.getElementById('save-settings').addEventListener('click', () => {
      this.saveSettings();
    });

    document.getElementById('reset-settings').addEventListener('click', () => {
      this.resetSettings();
    });

    // Sorting
    document.querySelectorAll('.sortable').forEach(th => {
      th.addEventListener('click', () => {
        const sortField = th.dataset.sort;
        this.handleSort(sortField);
      });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        this.selectAllRequests();
      }
      if (e.ctrlKey && e.key === 'c' && this.selectedRequests.length > 0) {
        e.preventDefault();
        this.copyRequestsForAI();
      }
      if (e.key === 'Escape') {
        this.hideSettingsModal();
      }
    });
  }

  async loadNetworkRequests() {
    this.showToast('Loading network requests...');
    
    try {
      const processedRequests = await this.harParser.getProcessedRequests(
        this.settings.headerFilters,
        this.settings.responseHandling
      );
      
      this.requests = processedRequests;
      this.sortRequests();
      this.updateRequestTable();
      this.hideToast();
      
      if (this.requests.length === 0) {
        this.showEmptyState();
      } else {
        this.hideEmptyState();
      }
    } catch (error) {
      console.error('Error loading network requests:', error);
      this.showToast('Failed to load requests: ' + error.message, 'error');
    }
  }

  sortRequests() {
    this.requests.sort((a, b) => {
      let aValue, bValue;
      
      switch (this.sortBy) {
        case 'name':
          aValue = new URL(a.url).pathname;
          bValue = new URL(b.url).pathname;
          break;
        case 'status':
          aValue = a.responseStatus;
          bValue = b.responseStatus;
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'size':
          aValue = a.responseSize;
          bValue = b.responseSize;
          break;
        case 'time':
          aValue = a.time;
          bValue = b.time;
          break;
        default:
          aValue = new Date(a.startedDateTime).getTime();
          bValue = new Date(b.startedDateTime).getTime();
      }
      
      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  handleSort(field) {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDirection = 'asc';
    }
    
    // Update UI
    document.querySelectorAll('.sortable').forEach(th => {
      th.classList.remove('sort-asc', 'sort-desc');
      if (th.dataset.sort === field) {
        th.classList.add(`sort-${this.sortDirection}`);
      }
    });
    
    this.sortRequests();
    this.updateRequestTable();
  }

  updateRequestTable() {
    const tbody = document.getElementById('request-table-body');
    const filteredRequests = this.getFilteredRequests();
    
    if (filteredRequests.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px; color: var(--text-secondary);">No requests match current filters</td></tr>';
      return;
    }
    
    tbody.innerHTML = filteredRequests.map((request, index) => {
      const isSelected = this.selectedRequests.some(r => r.id === request.id);
      const selectionOrder = this.selectedRequests.findIndex(r => r.id === request.id) + 1;
      const statusClass = this.getStatusClass(request.responseStatus);
      
      return `
        <tr class="${isSelected ? 'selected' : ''}" data-request-id="${request.id}">
          <td>
            <input type="checkbox" ${isSelected ? 'checked' : ''} data-request-id="${request.id}">
          </td>
          <td>
            ${isSelected ? `<span class="request-number">${selectionOrder}</span>` : ''}
          </td>
          <td title="${request.url}">${this.extractName(request.url)}</td>
          <td class="status-${Math.floor(request.responseStatus/100)}xx">
            ${request.responseStatus}
          </td>
          <td>${request.type}</td>
          <td>${this.formatSize(request.responseSize)}</td>
          <td>${request.time}ms</td>
          <td>${this.formatTime(request.startedDateTime)}</td>
        </tr>
      `;
    }).join('');
    
    // Add event listeners to rows and checkboxes
    tbody.querySelectorAll('tr').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.type === 'checkbox') {
          this.handleCheckboxChange(e.target);
        } else {
          const requestId = row.dataset.requestId;
          this.toggleRequestSelection(requestId);
        }
      });
    });
    
    tbody.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleCheckboxChange(e.target);
      });
    });
    
    this.updateSelectionUI();
  }

  getFilteredRequests() {
    return this.requests.filter(request => {
      // Text filter
      if (this.filters.text) {
        const searchText = this.filters.text.toLowerCase();
        const urlMatch = request.url.toLowerCase().includes(searchText);
        const methodMatch = request.method.toLowerCase().includes(searchText);
        const typeMatch = request.type.toLowerCase().includes(searchText);
        
        if (!urlMatch && !methodMatch && !typeMatch) {
          return false;
        }
      }
      
      // Type filter
      if (this.filters.type !== 'all' && request.type !== this.filters.type) {
        return false;
      }
      
      // Status filter
      if (this.filters.status !== 'all') {
        const statusCategory = this.getStatusCategory(request.responseStatus);
        if (statusCategory !== this.filters.status) {
          return false;
        }
      }
      
      return true;
    });
  }

  toggleRequestSelection(requestId) {
    const request = this.requests.find(r => r.id === requestId);
    if (!request) return;
    
    const index = this.selectedRequests.findIndex(r => r.id === requestId);
    if (index === -1) {
      this.selectedRequests.push(request);
    } else {
      this.selectedRequests.splice(index, 1);
    }
    
    this.updateRequestTable();
  }

  handleCheckboxChange(checkbox) {
    const requestId = checkbox.dataset.requestId;
    const request = this.requests.find(r => r.id === requestId);
    if (!request) return;
    
    if (checkbox.checked) {
      if (!this.selectedRequests.some(r => r.id === requestId)) {
        this.selectedRequests.push(request);
      }
    } else {
      this.selectedRequests = this.selectedRequests.filter(r => r.id !== requestId);
    }
    
    this.updateRequestTable();
    this.updateSelectAllCheckbox();
  }

  selectAllRequests() {
    const filteredRequests = this.getFilteredRequests();
    this.selectedRequests = [...filteredRequests];
    this.updateRequestTable();
  }

  clearSelection() {
    this.selectedRequests = [];
    this.updateRequestTable();
    this.updateSelectAllCheckbox();
  }

  updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('select-all-checkbox');
    const filteredRequests = this.getFilteredRequests();
    const selectedCount = this.selectedRequests.length;
    
    if (filteredRequests.length === 0) {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
    } else if (selectedCount === 0) {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
    } else if (selectedCount === filteredRequests.length) {
      selectAllCheckbox.checked = true;
      selectAllCheckbox.indeterminate = false;
    } else {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = true;
    }
  }

  updateSelectionUI() {
    const count = this.selectedRequests.length;
    const selectionCount = document.getElementById('selection-count');
    const copyButton = document.getElementById('copy-for-ai');
    const selectionSummary = document.getElementById('selection-summary');
    
    selectionCount.textContent = `${count} request${count !== 1 ? 's' : ''} selected`;
    copyButton.disabled = count === 0;
    
    if (count > 0) {
      const methods = [...new Set(this.selectedRequests.map(r => r.method))];
      const domains = [...new Set(this.selectedRequests.map(r => {
        try { return new URL(r.url).hostname; } catch { return 'unknown'; }
      }))];
      
      const summaryParts = [];
      if (methods.length <= 3) {
        summaryParts.push(methods.join(', '));
      } else {
        summaryParts.push(`${methods.length} methods`);
      }
      
      if (domains.length <= 2) {
        summaryParts.push(domains.join(', '));
      } else {
        summaryParts.push(`${domains.length} domains`);
      }
      
      selectionSummary.textContent = `(${summaryParts.join(' • ')})`;
    } else {
      selectionSummary.textContent = '';
    }
    
    this.updateSelectAllCheckbox();
  }

  async copyRequestsForAI() {
    if (this.selectedRequests.length === 0) {
      this.showToast('No requests selected', 'error');
      return;
    }
    
    try {
      this.showToast('Formatting requests...');
      
      const markdown = this.markdownFormatter.formatMultipleRequests(
        this.selectedRequests,
        true // Preserve order
      );
      
      await navigator.clipboard.writeText(markdown);
      
      this.showToast(`Copied ${this.selectedRequests.length} request${this.selectedRequests.length !== 1 ? 's' : ''} to clipboard`, 'success');
      
      // Clear selection after successful copy
      setTimeout(() => {
        this.clearSelection();
      }, 1000);
      
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      this.showToast('Failed to copy to clipboard: ' + error.message, 'error');
    }
  }

  showSettingsModal() {
    const modal = document.getElementById('settings-modal');
    modal.style.display = 'flex';
    
    // Load current settings into form
    document.getElementById('filter-browser-headers').checked = this.settings.headerFilters.browserHeaders;
    document.getElementById('filter-auth-headers').checked = this.settings.headerFilters.authHeaders;
    document.getElementById('filter-cookies').checked = this.settings.headerFilters.cookies;
    document.getElementById('filter-cache-headers').checked = this.settings.headerFilters.cacheHeaders;
    document.getElementById('custom-headers').value = this.settings.headerFilters.customHeaders.join(', ');
    document.getElementById('truncate-large').checked = this.settings.responseHandling.truncateLarge;
    document.getElementById('max-body-size').value = this.settings.responseHandling.maxBodySize;
  }

  hideSettingsModal() {
    document.getElementById('settings-modal').style.display = 'none';
  }

  async saveSettings() {
    const newSettings = {
      headerFilters: {
        browserHeaders: document.getElementById('filter-browser-headers').checked,
        authHeaders: document.getElementById('filter-auth-headers').checked,
        cookies: document.getElementById('filter-cookies').checked,
        cacheHeaders: document.getElementById('filter-cache-headers').checked,
        customHeaders: document.getElementById('custom-headers')
          .split(',')
          .map(h => h.trim().toLowerCase())
          .filter(h => h.length > 0)
      },
      responseHandling: {
        truncateLarge: document.getElementById('truncate-large').checked,
        maxBodySize: parseInt(document.getElementById('max-body-size').value) || 100000
      }
    };
    
    try {
      await new Promise((resolve) => {
        chrome.runtime.sendMessage({
          type: 'updateSettings',
          headerFilters: newSettings.headerFilters,
          responseHandling: newSettings.responseHandling
        }, resolve);
      });
      
      this.settings = newSettings;
      this.hideSettingsModal();
      this.showToast('Settings saved');
      
      // Reload requests with new settings
      this.loadNetworkRequests();
      
    } catch (error) {
      console.error('Failed to save settings:', error);
      this.showToast('Failed to save settings: ' + error.message, 'error');
    }
  }

  resetSettings() {
    if (confirm('Reset all settings to defaults?')) {
      this.settings = {
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
      };
      
      // Update form
      this.showSettingsModal();
      this.showToast('Settings reset to defaults');
    }
  }

  showEmptyState() {
    document.getElementById('empty-state').style.display = 'flex';
    document.querySelector('.request-table thead').style.display = 'none';
  }

  hideEmptyState() {
    document.getElementById('empty-state').style.display = 'none';
    document.querySelector('.request-table thead').style.display = '';
  }

  showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    toastMessage.textContent = message;
    toast.style.backgroundColor = type === 'success' ? 'var(--accent-green)' :
                                type === 'error' ? 'var(--accent-red)' : 'var(--accent-blue)';
    toast.classList.add('show');
    
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  hideToast() {
    const toast = document.getElementById('toast');
    toast.classList.remove('show');
  }

  // Helper methods
  extractName(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname + urlObj.search;
    } catch {
      return url;
    }
  }

  getStatusClass(status) {
    if (status >= 200 && status < 300) return '2xx';
    if (status >= 300 && status < 400) return '3xx';
    if (status >= 400 && status < 500) return '4xx';
    if (status >= 500) return '5xx';
    return 'other';
  }

  getStatusCategory(status) {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 300 && status < 400) return 'redirect';
    if (status >= 400 && status < 500) return 'error';
    if (status >= 500) return 'server';
    return 'other';
  }

  formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  }
}

// Initialize the panel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new BetterInspectPanel();
});