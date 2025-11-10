/**
 * OS Switcher
 * UI component for switching between different OS instances
 */

class OSSwitcher {
  constructor(osGenerator) {
    this.osGenerator = osGenerator;
    this.availableOS = [];
    this.switcherElement = null;
    this.isOpen = false;
  }

  /**
   * Initialize OS switcher
   */
  async initialize() {
    // Load list of available OS
    await this.loadAvailableOS();

    // Create switcher UI
    this.createSwitcherUI();

    // Add keyboard shortcut (Ctrl+Shift+O)
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'O') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  /**
   * Load list of available operating systems
   */
  async loadAvailableOS() {
    try {
      // Try to fetch OS list from a central config
      const response = await fetch('/assets/data/os-list.json');
      if (response.ok) {
        this.availableOS = await response.json();
      } else {
        // Fallback to hardcoded list
        this.availableOS = this.getDefaultOSList();
      }
    } catch (error) {
      console.warn('Failed to load OS list, using defaults:', error);
      this.availableOS = this.getDefaultOSList();
    }
  }

  /**
   * Get default OS list
   */
  getDefaultOSList() {
    return [
      {
        id: 'windows-95',
        name: 'Windows 95',
        category: 'Windows',
        icon: '🪟',
        year: 1995
      },
      {
        id: 'macos-system7',
        name: 'Mac OS System 7',
        category: 'macOS',
        icon: '🍎',
        year: 1991
      },
      {
        id: 'linux-fvwm',
        name: 'Linux FVWM',
        category: 'Linux',
        icon: '🐧',
        year: 1995
      },
      {
        id: 'amigaos-workbench',
        name: 'AmigaOS Workbench',
        category: 'Alternative',
        icon: '🔶',
        year: 1994
      }
    ];
  }

  /**
   * Create switcher UI
   */
  createSwitcherUI() {
    // Create switcher button
    const switcherBtn = document.createElement('button');
    switcherBtn.className = 'os-switcher-button';
    switcherBtn.innerHTML = '💻 <span class="switcher-label">Switch OS</span>';
    switcherBtn.title = 'Switch Operating System (Ctrl+Shift+O)';
    switcherBtn.addEventListener('click', () => this.toggle());
    document.body.appendChild(switcherBtn);

    // Create switcher modal
    this.switcherElement = document.createElement('div');
    this.switcherElement.className = 'os-switcher-modal';
    this.switcherElement.innerHTML = `
      <div class="os-switcher-overlay"></div>
      <div class="os-switcher-content">
        <div class="os-switcher-header">
          <h2>Select Operating System</h2>
          <button class="os-switcher-close" title="Close (Esc)">✕</button>
        </div>
        <div class="os-switcher-search">
          <input type="text" placeholder="Search operating systems..." class="os-search-input">
        </div>
        <div class="os-switcher-grid"></div>
      </div>
    `;

    document.body.appendChild(this.switcherElement);

    // Populate OS grid
    this.populateOSGrid();

    // Set up event handlers
    this.setupEventHandlers();
  }

  /**
   * Populate OS grid with available systems
   */
  populateOSGrid(filter = '') {
    const grid = this.switcherElement.querySelector('.os-switcher-grid');
    grid.innerHTML = '';

    const filtered = this.availableOS.filter(os =>
      os.name.toLowerCase().includes(filter.toLowerCase()) ||
      os.category.toLowerCase().includes(filter.toLowerCase())
    );

    // Group by category
    const grouped = this.groupByCategory(filtered);

    Object.entries(grouped).forEach(([category, systems]) => {
      const categorySection = document.createElement('div');
      categorySection.className = 'os-category-section';

      const categoryHeader = document.createElement('h3');
      categoryHeader.className = 'os-category-header';
      categoryHeader.textContent = category;
      categorySection.appendChild(categoryHeader);

      const categoryGrid = document.createElement('div');
      categoryGrid.className = 'os-category-grid';

      systems.forEach(os => {
        const osCard = this.createOSCard(os);
        categoryGrid.appendChild(osCard);
      });

      categorySection.appendChild(categoryGrid);
      grid.appendChild(categorySection);
    });

    if (filtered.length === 0) {
      grid.innerHTML = '<div class="no-results">No operating systems found</div>';
    }
  }

  /**
   * Group OS list by category
   */
  groupByCategory(osList) {
    const grouped = {};

    osList.forEach(os => {
      const category = os.category || 'Other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(os);
    });

    return grouped;
  }

  /**
   * Create OS card element
   */
  createOSCard(os) {
    const currentOS = this.osGenerator.getOSInfo();
    const isActive = currentOS && currentOS.id === os.id;

    const card = document.createElement('div');
    card.className = `os-card ${isActive ? 'active' : ''}`;
    card.dataset.osId = os.id;

    card.innerHTML = `
      <div class="os-card-icon">${os.icon}</div>
      <div class="os-card-info">
        <div class="os-card-name">${os.name}</div>
        <div class="os-card-year">${os.year}</div>
      </div>
      ${isActive ? '<div class="os-card-badge">Active</div>' : ''}
    `;

    card.addEventListener('click', () => this.switchTo(os.id));

    return card;
  }

  /**
   * Setup event handlers
   */
  setupEventHandlers() {
    // Close button
    const closeBtn = this.switcherElement.querySelector('.os-switcher-close');
    closeBtn.addEventListener('click', () => this.close());

    // Overlay click
    const overlay = this.switcherElement.querySelector('.os-switcher-overlay');
    overlay.addEventListener('click', () => this.close());

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Search input
    const searchInput = this.switcherElement.querySelector('.os-search-input');
    searchInput.addEventListener('input', (e) => {
      this.populateOSGrid(e.target.value);
    });
  }

  /**
   * Switch to OS
   */
  async switchTo(osId) {
    // Show loading state
    this.showLoading();

    try {
      // Load config
      const config = await this.osGenerator.loadConfigById(osId);

      // Switch OS
      await this.osGenerator.switchOS(config);

      // Close switcher
      this.close();

      // Show success notification
      this.showNotification(`Switched to ${config.metadata.name}`, 'success');

    } catch (error) {
      console.error('Failed to switch OS:', error);
      this.showNotification(`Failed to switch OS: ${error.message}`, 'error');
    } finally {
      this.hideLoading();
    }
  }

  /**
   * Toggle switcher visibility
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Open switcher
   */
  open() {
    this.switcherElement.classList.add('open');
    this.isOpen = true;

    // Focus search input
    const searchInput = this.switcherElement.querySelector('.os-search-input');
    setTimeout(() => searchInput.focus(), 100);

    // Refresh OS grid to show current active OS
    this.populateOSGrid();
  }

  /**
   * Close switcher
   */
  close() {
    this.switcherElement.classList.remove('open');
    this.isOpen = false;

    // Clear search
    const searchInput = this.switcherElement.querySelector('.os-search-input');
    searchInput.value = '';
  }

  /**
   * Show loading indicator
   */
  showLoading() {
    const loader = document.createElement('div');
    loader.className = 'os-switcher-loader';
    loader.innerHTML = '<div class="loader-spinner"></div><p>Loading OS...</p>';
    document.body.appendChild(loader);
  }

  /**
   * Hide loading indicator
   */
  hideLoading() {
    const loader = document.querySelector('.os-switcher-loader');
    if (loader) {
      loader.remove();
    }
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  /**
   * Add OS to available list
   */
  addOS(osConfig) {
    this.availableOS.push({
      id: osConfig.os_id,
      name: osConfig.metadata.name,
      category: osConfig.metadata.category,
      icon: this.getCategoryIcon(osConfig.metadata.category),
      year: osConfig.metadata.releaseYear
    });

    // Refresh grid if switcher is open
    if (this.isOpen) {
      this.populateOSGrid();
    }
  }

  /**
   * Get icon for category
   */
  getCategoryIcon(category) {
    const icons = {
      'desktop_windows': '🪟',
      'desktop_mac': '🍎',
      'desktop_linux': '🐧',
      'desktop_alternative': '🔶',
      'mobile': '📱',
      'server': '🖥️'
    };

    return icons[category] || '💻';
  }
}

// Auto-initialize switcher when OS generator is ready
document.addEventListener('os-initialized', async () => {
  const osGenerator = OSGenerator.getInstance();
  const switcher = new OSSwitcher(osGenerator);
  await switcher.initialize();

  // Make globally accessible
  window.osSwitcher = switcher;
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OSSwitcher;
}
