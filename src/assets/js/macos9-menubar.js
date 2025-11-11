/**
 * Mac OS 9 Menu Bar
 * Global menu bar implementation for Mac OS 9
 */

(function(global) {
  'use strict';

  /**
   * Mac OS 9 Menu Bar
   * Manages the global menu bar at the top of the screen
   */
  class MacOS9MenuBar {
    constructor(desktop) {
      this.desktop = desktop;
      this.container = null;
      this.menus = [];
      this.activeMenu = null;
      this.currentApp = 'Finder';
      this.initialized = false;
      this.clockInterval = null;
    }

    /**
     * Initialize the menu bar
     * @param {HTMLElement|string} container - Menu bar container
     */
    init(container) {
      if (this.initialized) return this;

      this.container = typeof container === 'string'
        ? document.querySelector(container)
        : container;

      if (!this.container) {
        throw new Error('Menu bar container not found');
      }

      this._attachEventListeners();
      this._buildDefaultMenus();
      this._startClock();
      this.initialized = true;

      return this;
    }

    /**
     * Build default Mac OS 9 menus
     * @private
     */
    _buildDefaultMenus() {
      // Apple Menu
      this._addMenu({
        id: 'apple',
        label: '\uF8FF',
        className: 'apple-menu',
        items: [
          { label: 'About This Computer...', action: () => this._triggerAction('about') },
          { type: 'separator' },
          { label: 'Apple System Profiler', action: () => this._triggerAction('openSystemProfiler') },
          { type: 'separator' },
          { label: 'Control Panels', arrow: true, submenu: this._getControlPanelsSubmenu() },
          { label: 'Recent Applications', arrow: true, disabled: true },
          { label: 'Recent Documents', arrow: true, disabled: true },
          { label: 'Recent Servers', arrow: true, disabled: true },
          { type: 'separator' },
          { label: 'Sherlock 2', action: () => this._triggerAction('openSherlock') },
          { type: 'separator' },
          { label: 'Sleep', action: () => this._sleep() },
          { label: 'Restart', action: () => this._triggerAction('restart') },
          { label: 'Shut Down', action: () => this._triggerAction('shutdown') }
        ]
      });

      // Application Menu (changes based on active app)
      this._addMenu({
        id: 'app',
        label: 'Finder',
        className: 'app-menu',
        items: [
          { label: 'About Finder', action: () => this._triggerAction('about') },
          { type: 'separator' },
          { label: 'Preferences...', action: () => this._showPreferences() },
          { type: 'separator' },
          { label: 'Hide Finder', shortcut: '\u2318H', disabled: true },
          { label: 'Hide Others', shortcut: '\u2318\u2325H', disabled: true },
          { label: 'Show All', disabled: true },
          { type: 'separator' },
          { label: 'Quit', shortcut: '\u2318Q', action: () => this._quitApp() }
        ]
      });

      // File Menu
      this._addMenu({
        id: 'file',
        label: 'File',
        items: [
          { label: 'New Folder', shortcut: '\u2318N', action: () => this._triggerAction('newFolder') },
          { label: 'Open', shortcut: '\u2318O', action: () => this._triggerAction('open') },
          { label: 'Print', shortcut: '\u2318P', action: () => this._triggerAction('print'), disabled: true },
          { label: 'Close Window', shortcut: '\u2318W', action: () => this._triggerAction('close') },
          { type: 'separator' },
          { label: 'Get Info', shortcut: '\u2318I', action: () => this._triggerAction('getInfo') },
          { label: 'Duplicate', shortcut: '\u2318D', action: () => this._triggerAction('duplicate'), disabled: true },
          { label: 'Make Alias', shortcut: '\u2318M', action: () => this._triggerAction('makeAlias'), disabled: true },
          { label: 'Add to Favorites', shortcut: '\u2318T', action: () => this._triggerAction('addFavorites'), disabled: true },
          { label: 'Put Away', shortcut: '\u2318Y', action: () => this._triggerAction('putAway'), disabled: true },
          { type: 'separator' },
          { label: 'Move to Trash', shortcut: '\u2318\u232B', action: () => this._triggerAction('moveToTrash'), disabled: true },
          { type: 'separator' },
          { label: 'Find...', shortcut: '\u2318F', action: () => this._triggerAction('openSherlock') },
          { label: 'Search Internet...', shortcut: '\u2318H', disabled: true },
          { type: 'separator' },
          { label: 'Show Original', disabled: true }
        ]
      });

      // Edit Menu
      this._addMenu({
        id: 'edit',
        label: 'Edit',
        items: [
          { label: 'Undo', shortcut: '\u2318Z', action: () => this._triggerAction('undo'), disabled: true },
          { type: 'separator' },
          { label: 'Cut', shortcut: '\u2318X', action: () => this._triggerAction('cut'), disabled: true },
          { label: 'Copy', shortcut: '\u2318C', action: () => this._triggerAction('copy'), disabled: true },
          { label: 'Paste', shortcut: '\u2318V', action: () => this._triggerAction('paste'), disabled: true },
          { label: 'Clear', action: () => this._triggerAction('clear'), disabled: true },
          { type: 'separator' },
          { label: 'Select All', shortcut: '\u2318A', action: () => this._triggerAction('selectAll') },
          { type: 'separator' },
          { label: 'Show Clipboard', disabled: true }
        ]
      });

      // View Menu
      this._addMenu({
        id: 'view',
        label: 'View',
        items: [
          { label: 'as Icons', shortcut: '\u23181', action: () => this._triggerAction('viewByIcon') },
          { label: 'as Buttons', shortcut: '\u23182', action: () => this._triggerAction('viewByButton') },
          { label: 'as List', shortcut: '\u23183', action: () => this._triggerAction('viewByList') },
          { type: 'separator' },
          { label: 'Clean Up', action: () => this._triggerAction('cleanUp') },
          { label: 'Arrange', arrow: true, submenu: [
            { label: 'by Name', action: () => this._triggerAction('arrangeByName') },
            { label: 'by Date Modified', action: () => this._triggerAction('arrangeByDate') },
            { label: 'by Date Created', action: () => this._triggerAction('arrangeByCreated') },
            { label: 'by Size', action: () => this._triggerAction('arrangeBySize') },
            { label: 'by Kind', action: () => this._triggerAction('arrangeByKind') },
            { label: 'by Label', action: () => this._triggerAction('arrangeByLabel') }
          ]},
          { type: 'separator' },
          { label: 'View Options...', shortcut: '\u2318J', action: () => this._showViewOptions() }
        ]
      });

      // Special Menu
      this._addMenu({
        id: 'special',
        label: 'Special',
        items: [
          { label: 'Empty Trash...', action: () => this._triggerAction('emptyTrash') },
          { type: 'separator' },
          { label: 'Eject', shortcut: '\u2318E', disabled: true },
          { label: 'Burn Disc...', disabled: true },
          { type: 'separator' },
          { label: 'Sleep', action: () => this._sleep() },
          { label: 'Restart', action: () => this._triggerAction('restart') },
          { label: 'Shut Down', action: () => this._triggerAction('shutdown') }
        ]
      });

      // Help Menu
      this._addMenu({
        id: 'help',
        label: 'Help',
        items: [
          { label: 'Mac Help', shortcut: '\u2318?', action: () => this._showHelp() },
          { type: 'separator' },
          { label: 'Show Balloons', disabled: true }
        ]
      });

      // Add right-side elements
      this._addRightSideElements();
    }

    /**
     * Get Control Panels submenu
     * @private
     */
    _getControlPanelsSubmenu() {
      return [
        { label: 'Appearance', action: () => this._openControlPanel('appearance') },
        { label: 'Control Strip', action: () => this._openControlPanel('controlstrip') },
        { label: 'Date & Time', action: () => this._openControlPanel('datetime') },
        { label: 'File Sharing', action: () => this._openControlPanel('filesharing') },
        { label: 'Monitors', action: () => this._openControlPanel('monitors') },
        { label: 'Mouse', action: () => this._openControlPanel('mouse') },
        { label: 'Sound', action: () => this._openControlPanel('sound') },
        { type: 'separator' },
        { label: 'View All Control Panels', action: () => this._triggerAction('openControlPanels') }
      ];
    }

    /**
     * Add menu to menu bar
     * @param {Object} config - Menu configuration
     * @private
     */
    _addMenu(config) {
      const menuItem = document.createElement('div');
      menuItem.className = 'menu-item';
      if (config.className) {
        menuItem.classList.add(config.className);
      }
      menuItem.textContent = config.label;
      menuItem.setAttribute('role', 'menuitem');
      menuItem.setAttribute('aria-haspopup', 'true');
      menuItem.setAttribute('aria-expanded', 'false');

      // Create dropdown
      const dropdown = this._createDropdown(config.items);
      menuItem.appendChild(dropdown);

      // Store menu data
      const menu = {
        id: config.id,
        label: config.label,
        element: menuItem,
        dropdown: dropdown,
        items: config.items
      };

      this.menus.push(menu);
      this.container.appendChild(menuItem);

      // Event listeners
      menuItem.addEventListener('click', (e) => {
        e.stopPropagation();
        this._toggleMenu(menu);
      });

      menuItem.addEventListener('mouseenter', () => {
        if (this.activeMenu) {
          this._closeMenu(this.activeMenu);
          this._openMenu(menu);
        }
      });
    }

    /**
     * Create dropdown menu
     * @param {Array} items - Menu items
     * @returns {HTMLElement} Dropdown element
     * @private
     */
    _createDropdown(items) {
      const dropdown = document.createElement('div');
      dropdown.className = 'macos9-menu-dropdown';
      dropdown.setAttribute('role', 'menu');

      const ul = document.createElement('ul');
      ul.setAttribute('role', 'none');

      items.forEach(item => {
        if (item.type === 'separator') {
          const li = document.createElement('li');
          li.className = 'separator';
          li.setAttribute('role', 'separator');
          ul.appendChild(li);
        } else {
          const li = document.createElement('li');
          li.setAttribute('role', 'none');

          const button = document.createElement('button');
          button.setAttribute('role', 'menuitem');
          button.textContent = item.label;
          
          if (item.disabled) {
            button.disabled = true;
          }

          if (item.shortcut) {
            const shortcut = document.createElement('span');
            shortcut.className = 'menu-shortcut';
            shortcut.textContent = item.shortcut;
            button.appendChild(shortcut);
          }

          if (item.arrow) {
            const arrow = document.createElement('span');
            arrow.textContent = ' \u25B6';
            button.appendChild(arrow);
          }

          if (item.action && !item.disabled) {
            button.addEventListener('click', (e) => {
              e.stopPropagation();
              item.action();
              this._closeAllMenus();
            });
          }

          li.appendChild(button);
          ul.appendChild(li);
        }
      });

      dropdown.appendChild(ul);
      return dropdown;
    }

    /**
     * Add right-side menu bar elements (clock, app switcher)
     * @private
     */
    _addRightSideElements() {
      const rightContainer = document.createElement('div');
      rightContainer.className = 'macos9-menubar-right';

      // Application switcher icon (placeholder)
      const appSwitcher = document.createElement('div');
      appSwitcher.className = 'app-switcher';
      appSwitcher.textContent = '\u2756';
      appSwitcher.title = 'Application menu';
      rightContainer.appendChild(appSwitcher);

      // Clock
      const clock = document.createElement('div');
      clock.className = 'menu-clock';
      clock.id = 'macos9-clock';
      clock.textContent = this._getCurrentTime();
      rightContainer.appendChild(clock);

      this.container.appendChild(rightContainer);
    }

    /**
     * Get current time formatted
     * @private
     */
    _getCurrentTime() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return displayHours + ':' + minutes + ' ' + ampm;
    }

    /**
     * Start clock updates
     * @private
     */
    _startClock() {
      this._updateClock();
      this.clockInterval = setInterval(() => this._updateClock(), 60000);
    }

    /**
     * Update clock display
     * @private
     */
    _updateClock() {
      const clock = document.getElementById('macos9-clock');
      if (clock) {
        clock.textContent = this._getCurrentTime();
      }
    }

    /**
     * Toggle menu
     * @param {Object} menu - Menu object
     * @private
     */
    _toggleMenu(menu) {
      if (this.activeMenu === menu) {
        this._closeMenu(menu);
      } else {
        if (this.activeMenu) {
          this._closeMenu(this.activeMenu);
        }
        this._openMenu(menu);
      }
    }

    /**
     * Open menu
     * @param {Object} menu - Menu object
     * @private
     */
    _openMenu(menu) {
      menu.dropdown.classList.add('visible');
      menu.element.classList.add('active');
      menu.element.setAttribute('aria-expanded', 'true');
      this.activeMenu = menu;
    }

    /**
     * Close menu
     * @param {Object} menu - Menu object
     * @private
     */
    _closeMenu(menu) {
      menu.dropdown.classList.remove('visible');
      menu.element.classList.remove('active');
      menu.element.setAttribute('aria-expanded', 'false');
      if (this.activeMenu === menu) {
        this.activeMenu = null;
      }
    }

    /**
     * Close all menus
     * @private
     */
    _closeAllMenus() {
      this.menus.forEach(menu => this._closeMenu(menu));
    }

    /**
     * Attach global event listeners
     * @private
     */
    _attachEventListeners() {
      document.addEventListener('click', () => {
        this._closeAllMenus();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this._closeAllMenus();
        }
      });
    }

    /**
     * Trigger action
     * @param {string} action - Action name
     * @private
     */
    _triggerAction(action) {
      const event = new CustomEvent('macos9:menuaction', {
        detail: { action, app: this.currentApp }
      });
      document.dispatchEvent(event);
    }

    /**
     * Update application menu
     * @param {string} appName - Application name
     */
    updateAppMenu(appName) {
      this.currentApp = appName;
      const appMenu = this.menus.find(m => m.id === 'app');
      if (appMenu) {
        appMenu.element.childNodes[0].textContent = appName;
      }
    }

    /**
     * Show preferences
     * @private
     */
    _showPreferences() {
      this.desktop._showAlert('Preferences (demo)');
    }

    /**
     * Show view options
     * @private
     */
    _showViewOptions() {
      this.desktop._showAlert('View Options (demo)');
    }

    /**
     * Quit application
     * @private
     */
    _quitApp() {
      if (this.currentApp === 'Finder') {
        this.desktop._showAlert('You cannot quit the Finder.');
      } else {
        this.desktop.windowManager.closeAll();
      }
    }

    /**
     * Sleep computer
     * @private
     */
    _sleep() {
      if (confirm('Are you sure you want to put your computer to sleep now?')) {
        this.desktop._showAlert('Sleeping... (demo mode)');
      }
    }

    /**
     * Show help
     * @private
     */
    _showHelp() {
      this.desktop._showAlert('Mac Help is not available in demo mode.');
    }

    /**
     * Open control panel
     * @param {string} panelId - Control panel ID
     * @private
     */
    _openControlPanel(panelId) {
      this.desktop._showAlert('Opening ' + panelId + ' control panel... (demo)');
    }

    /**
     * Cleanup
     */
    destroy() {
      if (this.clockInterval) {
        clearInterval(this.clockInterval);
      }
    }
  }

  // Export to global scope
  global.MacOS9MenuBar = MacOS9MenuBar;

})(typeof window !== 'undefined' ? window : global);
