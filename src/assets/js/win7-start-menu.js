/**
 * Windows 7 Start Menu
 * Handles Start Menu display, search, and program launching
 */

class Win7StartMenu {
  constructor(desktop) {
    this.desktop = desktop;
    this.startMenu = null;
    this.startButton = null;
    this.searchInput = null;
    this.isOpen = false;

    this.pinnedPrograms = [
      { name: 'Internet Explorer', icon: '🌐', app: 'ie' },
      { name: 'Windows Explorer', icon: '📁', app: 'explorer' },
      { name: 'Windows Media Player', icon: '🎵', app: 'media-player' },
      { name: 'Notepad', icon: '📝', app: 'notepad' },
      { name: 'Calculator', icon: '🔢', app: 'calculator' },
      { name: 'Paint', icon: '🎨', app: 'paint' },
      { name: 'Command Prompt', icon: '⚫', app: 'cmd' }
    ];

    this.places = [
      { name: 'Documents', icon: '📄', path: 'Documents' },
      { name: 'Pictures', icon: '🖼️', path: 'Pictures' },
      { name: 'Music', icon: '🎵', path: 'Music' },
      { name: 'Videos', icon: '🎬', path: 'Videos' },
      { name: 'Computer', icon: '💻', path: 'Computer' },
      { name: 'Control Panel', icon: '⚙️', path: 'Control Panel' },
      { name: 'Devices and Printers', icon: '🖨️', path: 'Devices' },
      { name: 'Default Programs', icon: '📦', path: 'Programs' },
      { name: 'Help and Support', icon: '❓', path: 'Help' }
    ];
  }

  /**
   * Initialize Start Menu
   */
  init() {
    this.startMenu = document.getElementById('start-menu');
    this.startButton = document.getElementById('start-button');
    this.searchInput = document.getElementById('start-search');

    if (!this.startMenu || !this.startButton) {
      console.error('Start Menu elements not found');
      return;
    }

    this.populatePinnedPrograms();
    this.populatePlaces();
    this.setupSearch();
    this.setupAllPrograms();
    this.setupShutdown();
    this.setupClickOutside();
  }

  /**
   * Populate pinned programs
   */
  populatePinnedPrograms() {
    const container = this.startMenu.querySelector('.start-menu-pinned');
    if (!container) return;

    this.pinnedPrograms.forEach(program => {
      const item = this.createMenuItem(program);
      item.addEventListener('click', () => {
        this.launchProgram(program.app);
        this.close();
      });
      container.appendChild(item);
    });
  }

  /**
   * Populate places (right panel)
   */
  populatePlaces() {
    const container = this.startMenu.querySelector('.start-menu-right');
    if (!container) return;

    // Skip the user info which is already in the template
    const userInfo = container.querySelector('.start-menu-user');

    this.places.forEach(place => {
      const item = document.createElement('div');
      item.className = 'start-menu-place';

      const icon = document.createElement('div');
      icon.className = 'start-menu-place-icon';
      icon.textContent = place.icon;
      icon.style.fontSize = '24px';

      const text = document.createElement('div');
      text.className = 'start-menu-place-text';
      text.textContent = place.name;

      item.appendChild(icon);
      item.appendChild(text);

      item.addEventListener('click', () => {
        this.openPlace(place);
        this.close();
      });

      container.appendChild(item);
    });
  }

  /**
   * Create menu item
   * @param {Object} program - Program configuration
   * @returns {HTMLElement} - Menu item element
   */
  createMenuItem(program) {
    const item = document.createElement('div');
    item.className = 'start-menu-item';
    item.setAttribute('role', 'menuitem');

    const icon = document.createElement('div');
    icon.className = 'start-menu-item-icon';
    icon.textContent = program.icon;
    icon.style.fontSize = '32px';

    const text = document.createElement('div');
    text.className = 'start-menu-item-text';
    text.textContent = program.name;

    item.appendChild(icon);
    item.appendChild(text);

    return item;
  }

  /**
   * Setup search functionality
   */
  setupSearch() {
    if (!this.searchInput) return;

    this.searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      this.performSearch(query);
    });

    this.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = this.searchInput.value.trim();
        if (query) {
          this.executeSearch(query);
          this.close();
        }
      }
    });
  }

  /**
   * Perform search filtering
   * @param {string} query - Search query
   */
  performSearch(query) {
    if (!query) {
      // Show all items
      const items = this.startMenu.querySelectorAll('.start-menu-item');
      items.forEach(item => {
        item.style.display = 'flex';
      });
      return;
    }

    // Filter items
    const items = this.startMenu.querySelectorAll('.start-menu-item');
    items.forEach(item => {
      const text = item.querySelector('.start-menu-item-text').textContent.toLowerCase();
      if (text.includes(query)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  /**
   * Execute search
   * @param {string} query - Search query
   */
  executeSearch(query) {
    console.log('Search for:', query);

    // Try to find matching program
    const program = this.pinnedPrograms.find(p =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );

    if (program) {
      this.launchProgram(program.app);
    } else {
      // Show search results window
      this.desktop.createWindow({
        title: `Search Results - "${query}"`,
        icon: '🔍',
        width: 700,
        height: 500,
        content: `<div style="padding: 20px;">
          <h3>Search results for "${query}"</h3>
          <p>No items match your search.</p>
        </div>`
      });
    }
  }

  /**
   * Setup All Programs menu
   */
  setupAllPrograms() {
    const trigger = document.getElementById('all-programs-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      this.showAllPrograms();
    });
  }

  /**
   * Show All Programs menu
   */
  showAllPrograms() {
    const container = this.startMenu.querySelector('.start-menu-pinned');
    if (!container) return;

    // Clear current items
    container.innerHTML = '';

    // Add back button
    const backBtn = document.createElement('div');
    backBtn.className = 'start-menu-item';
    backBtn.innerHTML = `
      <div class="start-menu-item-icon" style="font-size: 20px;">◀</div>
      <div class="start-menu-item-text">Back</div>
    `;
    backBtn.addEventListener('click', () => {
      container.innerHTML = '';
      this.populatePinnedPrograms();
    });
    container.appendChild(backBtn);

    // Add program categories
    const categories = [
      {
        name: 'Accessories',
        icon: '📁',
        programs: [
          { name: 'Calculator', icon: '🔢', app: 'calculator' },
          { name: 'Notepad', icon: '📝', app: 'notepad' },
          { name: 'Paint', icon: '🎨', app: 'paint' },
          { name: 'Command Prompt', icon: '⚫', app: 'cmd' },
          { name: 'Snipping Tool', icon: '✂️', app: 'snip' }
        ]
      },
      {
        name: 'Games',
        icon: '🎮',
        programs: [
          { name: 'Solitaire', icon: '🃏', app: 'solitaire' },
          { name: 'Minesweeper', icon: '💣', app: 'minesweeper' }
        ]
      },
      {
        name: 'System Tools',
        icon: '🔧',
        programs: [
          { name: 'Control Panel', icon: '⚙️', app: 'control-panel' },
          { name: 'Task Manager', icon: '📊', app: 'taskmgr' },
          { name: 'System Information', icon: 'ℹ️', app: 'sysinfo' }
        ]
      }
    ];

    categories.forEach(category => {
      const categoryItem = document.createElement('div');
      categoryItem.className = 'start-menu-item';

      const icon = document.createElement('div');
      icon.className = 'start-menu-item-icon';
      icon.textContent = category.icon;
      icon.style.fontSize = '32px';

      const text = document.createElement('div');
      text.className = 'start-menu-item-text';
      text.textContent = category.name;

      const arrow = document.createElement('div');
      arrow.textContent = '▶';
      arrow.style.marginLeft = 'auto';

      categoryItem.appendChild(icon);
      categoryItem.appendChild(text);
      categoryItem.appendChild(arrow);

      categoryItem.addEventListener('click', () => {
        this.showCategoryPrograms(category);
      });

      container.appendChild(categoryItem);
    });
  }

  /**
   * Show programs in category
   * @param {Object} category - Category configuration
   */
  showCategoryPrograms(category) {
    const container = this.startMenu.querySelector('.start-menu-pinned');
    if (!container) return;

    container.innerHTML = '';

    // Add back button
    const backBtn = document.createElement('div');
    backBtn.className = 'start-menu-item';
    backBtn.innerHTML = `
      <div class="start-menu-item-icon" style="font-size: 20px;">◀</div>
      <div class="start-menu-item-text">Back</div>
    `;
    backBtn.addEventListener('click', () => {
      this.showAllPrograms();
    });
    container.appendChild(backBtn);

    // Add category title
    const title = document.createElement('div');
    title.style.padding = '8px 12px';
    title.style.color = '#FFFFFF';
    title.style.fontWeight = '600';
    title.textContent = category.name;
    container.appendChild(title);

    // Add programs
    category.programs.forEach(program => {
      const item = this.createMenuItem(program);
      item.addEventListener('click', () => {
        this.launchProgram(program.app);
        this.close();
      });
      container.appendChild(item);
    });
  }

  /**
   * Setup shutdown button
   */
  setupShutdown() {
    const shutdownBtn = this.startMenu.querySelector('.shutdown-btn');
    if (!shutdownBtn) return;

    shutdownBtn.addEventListener('click', () => {
      this.showShutdownMenu();
    });
  }

  /**
   * Show shutdown menu
   */
  showShutdownMenu() {
    const menu = document.createElement('div');
    menu.className = 'win7-context-menu';
    menu.style.bottom = '85px';
    menu.style.left = '8px';

    const options = [
      { text: 'Switch user', icon: '👤' },
      { text: 'Log off', icon: '🚪' },
      { text: 'Lock', icon: '🔒' },
      { text: 'Restart', icon: '🔄' },
      { text: 'Sleep', icon: '😴' },
      { text: 'Hibernate', icon: '💤' },
      { text: 'Shut down', icon: '⏻' }
    ];

    options.forEach(option => {
      const item = document.createElement('div');
      item.className = 'context-menu-item';

      const icon = document.createElement('span');
      icon.className = 'context-menu-icon';
      icon.textContent = option.icon;

      const text = document.createElement('span');
      text.className = 'context-menu-text';
      text.textContent = option.text;

      item.appendChild(icon);
      item.appendChild(text);

      item.addEventListener('click', () => {
        console.log('Shutdown action:', option.text);
        menu.remove();
        this.close();
      });

      menu.appendChild(item);
    });

    document.body.appendChild(menu);

    // Close on click outside
    setTimeout(() => {
      document.addEventListener('click', function closeMenu() {
        menu.remove();
        document.removeEventListener('click', closeMenu);
      });
    }, 0);
  }

  /**
   * Launch program
   * @param {string} appId - App ID
   */
  launchProgram(appId) {
    switch (appId) {
      case 'explorer':
        this.desktop.openExplorer('Computer');
        break;

      case 'notepad':
        if (typeof Win7Notepad !== 'undefined') {
          const notepad = new Win7Notepad(this.desktop);
          notepad.open();
        }
        break;

      case 'calculator':
        if (typeof Win7Calculator !== 'undefined') {
          const calc = new Win7Calculator(this.desktop);
          calc.open();
        }
        break;

      case 'paint':
        this.desktop.createWindow({
          title: 'Paint',
          icon: '🎨',
          width: 800,
          height: 600,
          content: '<div style="padding: 20px;">Paint simulation would go here</div>'
        });
        break;

      case 'cmd':
        this.desktop.createWindow({
          title: 'Command Prompt',
          icon: '⚫',
          width: 700,
          height: 400,
          content: `<div style="background: #000; color: #FFF; padding: 10px; font-family: 'Consolas', monospace; font-size: 14px; height: 100%;">
            Microsoft Windows [Version 6.1.7600]<br>
            Copyright (c) 2009 Microsoft Corporation. All rights reserved.<br><br>
            C:\\Users\\User><span style="animation: blink 1s infinite;">_</span>
          </div>`
        });
        break;

      default:
        console.log('Launch program:', appId);
        this.desktop.createWindow({
          title: appId,
          icon: '📦',
          width: 600,
          height: 400,
          content: `<div style="padding: 20px;">Application "${appId}" would launch here</div>`
        });
    }
  }

  /**
   * Open place
   * @param {Object} place - Place configuration
   */
  openPlace(place) {
    this.desktop.openExplorer(place.path);
  }

  /**
   * Setup click outside to close
   */
  setupClickOutside() {
    document.addEventListener('click', (e) => {
      if (this.isOpen) {
        if (!this.startMenu.contains(e.target) && !this.startButton.contains(e.target)) {
          this.close();
        }
      }
    });
  }

  /**
   * Toggle Start Menu
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Open Start Menu
   */
  open() {
    if (this.isOpen) return;

    this.startMenu.hidden = false;
    this.startButton.setAttribute('aria-expanded', 'true');
    this.isOpen = true;

    // Focus search input
    if (this.searchInput) {
      setTimeout(() => {
        this.searchInput.focus();
      }, 100);
    }
  }

  /**
   * Close Start Menu
   */
  close() {
    if (!this.isOpen) return;

    this.startMenu.hidden = true;
    this.startButton.setAttribute('aria-expanded', 'false');
    this.isOpen = false;

    // Clear search
    if (this.searchInput) {
      this.searchInput.value = '';
      this.performSearch('');
    }

    // Reset to pinned programs view
    const container = this.startMenu.querySelector('.start-menu-pinned');
    if (container) {
      container.innerHTML = '';
      this.populatePinnedPrograms();
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Win7StartMenu;
}
