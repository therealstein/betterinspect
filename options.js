// Options page logic for betterinspect settings management

class BetterInspectOptions {
  constructor() {
    this.defaultSettings = {
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
      },
      defaultFormat: 'markdown'
    };
    
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupEventListeners();
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(this.defaultSettings);
      this.populateForm(result);
    } catch (error) {
      console.error('Error loading settings:', error);
      this.showStatus('Error loading settings: ' + error.message, 'error');
    }
  }

  populateForm(settings) {
    // Header filters
    document.getElementById('filter-browser-headers').checked = 
      settings.headerFilters.browserHeaders !== undefined ? settings.headerFilters.browserHeaders : true;
    document.getElementById('filter-auth-headers').checked = 
      settings.headerFilters.authHeaders || false;
    document.getElementById('filter-cookies').checked = 
      settings.headerFilters.cookies || false;
    document.getElementById('filter-cache-headers').checked = 
      settings.headerFilters.cacheHeaders || false;
    
    // Custom headers - handle both array and string formats
    const customHeaders = settings.headerFilters.customHeaders || [];
    document.getElementById('custom-headers').value = Array.isArray(customHeaders) 
      ? customHeaders.join('\n') 
      : customHeaders;
    
    // Response handling
    document.getElementById('truncate-large').checked = 
      settings.responseHandling.truncateLarge !== undefined ? settings.responseHandling.truncateLarge : true;
    document.getElementById('max-body-size').value = 
      settings.responseHandling.maxBodySize || 100000;
    
    // Default format
    document.getElementById('default-format').value = 
      settings.defaultFormat || 'markdown';
  }

  setupEventListeners() {
    // Save button
    document.getElementById('save-settings').addEventListener('click', () => {
      this.saveSettings();
    });

    // Reset button
    document.getElementById('reset-settings').addEventListener('click', () => {
      this.resetToDefaults();
    });

    // Cancel button
    document.getElementById('cancel-changes').addEventListener('click', () => {
      this.cancelChanges();
    });

    // Real-time validation
    document.getElementById('max-body-size').addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      if (value < 1000) {
        e.target.setCustomValidity('Minimum size is 1000 bytes');
      } else if (value > 10000000) {
        e.target.setCustomValidity('Maximum size is 10,000,000 bytes');
      } else {
        e.target.setCustomValidity('');
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        this.saveSettings();
      }
      if (e.key === 'Escape') {
        this.cancelChanges();
      }
    });
  }

  async saveSettings() {
    try {
      // Gather settings from form
      const settings = {
        headerFilters: {
          browserHeaders: document.getElementById('filter-browser-headers').checked,
          authHeaders: document.getElementById('filter-auth-headers').checked,
          cookies: document.getElementById('filter-cookies').checked,
          cacheHeaders: document.getElementById('filter-cache-headers').checked,
          customHeaders: this.parseCustomHeaders(document.getElementById('custom-headers').value)
        },
        responseHandling: {
          truncateLarge: document.getElementById('truncate-large').checked,
          maxBodySize: parseInt(document.getElementById('max-body-size').value) || 100000
        },
        defaultFormat: document.getElementById('default-format').value
      };

      // Validate
      if (settings.responseHandling.maxBodySize < 1000) {
        this.showStatus('Maximum body size must be at least 1000 bytes', 'error');
        return;
      }

      // Save to Chrome storage
      await chrome.storage.sync.set(settings);
      
      this.showStatus('Settings saved successfully!', 'success');
      
      // Notify background script
      chrome.runtime.sendMessage({
        type: 'settingsUpdated',
        settings: settings
      });

    } catch (error) {
      console.error('Error saving settings:', error);
      this.showStatus('Error saving settings: ' + error.message, 'error');
    }
  }

  parseCustomHeaders(input) {
    if (!input || !input.trim()) return [];
    
    // Split by newlines or commas
    const headers = input
      .split(/[\n,]+/)
      .map(h => h.trim().toLowerCase())
      .filter(h => h.length > 0);
    
    // Remove duplicates
    return [...new Set(headers)];
  }

  async resetToDefaults() {
    if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      try {
        await chrome.storage.sync.set(this.defaultSettings);
        this.populateForm(this.defaultSettings);
        this.showStatus('Settings reset to defaults', 'success');
        
        // Notify background script
        chrome.runtime.sendMessage({
          type: 'settingsUpdated',
          settings: this.defaultSettings
        });
      } catch (error) {
        console.error('Error resetting settings:', error);
        this.showStatus('Error resetting settings: ' + error.message, 'error');
      }
    }
  }

  cancelChanges() {
    if (confirm('Discard all unsaved changes?')) {
      this.loadSettings();
      this.showStatus('Changes discarded', 'success');
    }
  }

  showStatus(message, type = 'info') {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = 'status ' + type;
    statusDiv.style.display = 'block';

    // Auto-hide after 3 seconds
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }
}

// Initialize options page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new BetterInspectOptions();
});