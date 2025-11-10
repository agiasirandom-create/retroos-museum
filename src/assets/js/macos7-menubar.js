/**
 * Mac OS System 7 Menu Bar
 * Global menu bar implementation for Mac OS System 7
 */

(function(global) {
  'use strict';

  /**
   * Mac OS 7 Menu Bar
   * Manages the global menu bar at the top of the screen
   */
  class MacOS7MenuBar {
    constructor() {
      this.container = null;
      this.menus = [];
      this.activeMenu = null;
      this.currentApp = 'Finder';
      this.initialized = false;
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
      this.initialized = true;

      return this;
    }

    /**
     * Build default Mac OS 7 menus
     * @private
     */
    _buildDefaultMenus() {
      // Apple Menu
      this._addMenu({
        id: 'apple',
        label: '\uF8FF',
        className: 'apple-menu',
        items: [
          { label: 'About This Macintosh...', action: () => this._showAboutBox() },
          { type: 'separator' },
          { label: 'Control Panels', action: () => this._openControlPanels(), arrow: true },
          { label: 'Chooser', action: () => this._openChooser() },
          { type: 'separator' },
          { label: 'Recent Applications', arrow: true, disabled: true },
          { label: 'Recent Documents', arrow: true, disabled: true },
          { type: 'separator' },
          { label: 'Shut Down', action: () => this._shutDown() }
        ]
      });

      // File Menu
      this._addMenu({
        id: 'file',
        label: 'File',
        items: [
          { label: 'New Folder', shortcut: '\u2318N', action: () => this._triggerAppAction('newFolder') },
          { label: 'Open', shortcut: '\u2318O', action: () => this._triggerAppAction('open') },
          { label: 'Print', shortcut: '\u2318P', action: () => this._triggerAppAction('print'), disabled: true },
          { label: 'Close', shortcut: '\u2318W', action: () => this._triggerAppAction('close') },
          { type: 'separator' },
          { label: 'Get Info', shortcut: '\u2318I', action: () => this._triggerAppAction('getInfo') },
          { label: 'Duplicate', shortcut: '\u2318D', action: () => this._triggerAppAction('duplicate'), disabled: true },
          { label: 'Put Away', shortcut: '\u2318Y', action: () => this._triggerAppAction('putAway'), disabled: true },
          { type: 'separator' },
          { label: 'Find...', shortcut: '\u2318F', action: () => this._triggerAppAction('find'), disabled: true },
          { type: 'separator' },
          { label: 'Empty Trash', action: () => this._triggerAppAction('emptyTrash') }
        ]
      });

      // Edit Menu
      this._addMenu({
        id: 'edit',
        label: 'Edit',
        items: [
          { label: 'Undo', shortcut: '\u2318Z', action: () => this._triggerAppAction('undo'), disabled: true },
          { type: 'separator' },
          { label: 'Cut', shortcut: '\u2318X', action: () => this._triggerAppAction('cut'), disabled: true },
          { label: 'Copy', shortcut: '\u2318C', action: () => this._triggerAppAction('copy'), disabled: true },
          { label: 'Paste', shortcut: '\u2318V', action: () => this._triggerAppAction('paste'), disabled: true },
          { label: 'Clear', action: () => this._triggerAppAction('clear'), disabled: true },
          { type: 'separator' },
          { label: 'Select All', shortcut: '\u2318A', action: () => this._triggerAppAction('selectAll') }
        ]
      });

      // View Menu
      this._addMenu({
        id: 'view',
        label: 'View',
        items: [
          { label: 'by Icon', action: () => this._triggerAppAction('viewByIcon') },
          { label: 'by Name', action: () => this._triggerAppAction('viewByName') },
          { label: 'by Date', action: () => this._triggerAppAction('viewByDate') },
          { label: 'by Size', action: () => this._triggerAppAction('viewBySize') },
          { label: 'by Kind', action: () => this._triggerAppAction('viewByKind') }
        ]
      });

      // Special Menu
      this._addMenu({
        id: 'special',
        label: 'Special',
        items: [
          { label: 'Clean Up Desktop', action: () => this._cleanUpDesktop() },
          { label: 'Empty Trash...', action: () => this._triggerAppAction('emptyTrash') },
          { type: 'separator' },
          { label: 'Eject', shortcut: '\u2318E', action: () => this._eject(), disabled: true },
          { type: 'separator' },
          { label: 'Restart', action: () => this._restart() },
          { label: 'Shut Down', action: () => this._shutDown() }
        ]
      });

      // Help Menu
      this._addMenu({
        id: 'help',
        label: 'Help',
        items: [
          { label: 'About Balloon Help', action: () => this._showHelp('balloon') },
          { label: 'Show Balloons', action: () => this._showHelp('show'), disabled: true },
          { type: 'separator' },
          { label: 'Finder Help', action: () => this._showHelp('finder') }
        ]
      });
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
    }

    /**
     * Create dropdown menu
     * @param {Array} items - Menu items
     * @returns {HTMLElement} Dropdown element
     * @private
     */
    _createDropdown(items) {
      const dropdown = document.createElement('div');
      dropdown.className = 'macos7-menu-dropdown';
      dropdown.setAttribute('role', 'menu');

      const ul = document.createElement('ul');
      ul.setAttribute('role', 'none');

      items.forEach(item => {
        if (item.type === 'separator') {
          const li = document.createElement('li');
          li.className = 'separator';
          li.setAttribute('role', 'separator');
          ul.appendChild(li);
          return;
        }

        const li = document.createElement('li');
        li.setAttribute('role', 'none');

        const button = document.createElement('button');
        button.className = 'menu-item-button';
        button.setAttribute('role', 'menuitem');
        button.textContent = item.label;

        if (item.shortcut) {
          const shortcut = document.createElement('span');
          shortcut.className = 'menu-shortcut';
          shortcut.textContent = item.shortcut;
          button.appendChild(shortcut);
        }

        if (item.arrow) {
          button.textContent += ' \u25B6';
        }

        if (item.disabled) {
          button.disabled = true;
        }

        if (item.action) {
          button.addEventListener('click', (e) => {
            e.stopPropagation();
            this._closeAllMenus();
            item.action();
          });
        }

        li.appendChild(button);
        ul.appendChild(li);
      });

      dropdown.appendChild(ul);
      return dropdown;
    }

    /**
     * Toggle menu open/closed
     * @param {Object} menu - Menu object
     * @private
     */
    _toggleMenu(menu) {
      if (this.activeMenu === menu) {
        this._closeMenu(menu);
        this.activeMenu = null;
      } else {
        this._closeAllMenus();
        this._openMenu(menu);
        this.activeMenu = menu;
      }
    }

    /**
     * Open menu
     * @param {Object} menu - Menu object
     * @private
     */
    _openMenu(menu) {
      menu.element.classList.add('active');
      menu.dropdown.classList.add('visible');
      menu.element.setAttribute('aria-expanded', 'true');
    }

    /**
     * Close menu
     * @param {Object} menu - Menu object
     * @private
     */
    _closeMenu(menu) {
      menu.element.classList.remove('active');
      menu.dropdown.classList.remove('visible');
      menu.element.setAttribute('aria-expanded', 'false');
    }

    /**
     * Close all menus
     * @private
     */
    _closeAllMenus() {
      this.menus.forEach(menu => this._closeMenu(menu));
      this.activeMenu = null;
    }

    /**
     * Attach event listeners
     * @private
     */
    _attachEventListeners() {
      // Click outside to close menus
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.macos7-menubar')) {
          this._closeAllMenus();
        }
      });

      // Keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        // Command key shortcuts
        if (e.metaKey || e.ctrlKey) {
          this._handleKeyboardShortcut(e);
        }

        // Escape to close menus
        if (e.key === 'Escape' && this.activeMenu) {
          this._closeAllMenus();
        }
      });
    }

    /**
     * Handle keyboard shortcuts
     * @param {KeyboardEvent} e - Keyboard event
     * @private
     */
    _handleKeyboardShortcut(e) {
      const key = e.key.toLowerCase();

      // Map shortcuts to actions
      const shortcuts = {
        'n': () => this._triggerAppAction('newFolder'),
        'o': () => this._triggerAppAction('open'),
        'w': () => this._triggerAppAction('close'),
        'q': () => this._triggerAppAction('quit'),
        'a': () => this._triggerAppAction('selectAll'),
        'i': () => this._triggerAppAction('getInfo')
      };

      if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
      }
    }

    /**
     * Trigger application-specific action
     * @param {string} action - Action name
     * @private
     */
    _triggerAppAction(action) {
      // Dispatch custom event for apps to listen to
      const event = new CustomEvent('macos7:menuaction', {
        detail: { action: action, app: this.currentApp }
      });
      document.dispatchEvent(event);
    }

    /**
     * Show About This Macintosh dialog
     * @private
     */
    _showAboutBox() {
      if (!global.macos7 || !global.macos7.windowAdapter) return;

      const content = `
        <div class="about-dialog">
          <div class="mac-icon">
            <svg width="64" height="64" viewBox="0 0 64 64">
              <rect x="8" y="8" width="48" height="40" fill="#ffffff" stroke="#000" stroke-width="2"/>
              <rect x="8" y="48" width="48" height="8" fill="#cccccc" stroke="#000" stroke-width="2"/>
              <circle cx="32" cy="28" r="8" fill="#0000cc"/>
            </svg>
          </div>
          <h2>System 7.5.5</h2>
          <p>&copy; Apple Computer, Inc. 1983-1996</p>
          <div class="memory-info">
            <p><strong>Total Memory:</strong> 16,384 K</p>
            <p><strong>Largest Unused Block:</strong> 12,288 K</p>
          </div>
          <div style="margin-top: 16px;">
            <button class="mac-button default" onclick="this.closest('.os-window').querySelector('.window-btn-close').click()">OK</button>
          </div>
        </div>
      `;

      global.macos7.windowAdapter.createWindow({
        id: 'about-macintosh',
        title: 'About This Macintosh',
        content: content,
        width: 320,
        height: 280,
        resizable: false,
        x: (window.innerWidth - 320) / 2,
        y: (window.innerHeight - 280) / 2 + 20
      });
    }

    /**
     * Open Control Panels
     * @private
     */
    _openControlPanels() {
      this._triggerAppAction('openControlPanels');
    }

    /**
     * Open Chooser
     * @private
     */
    _openChooser() {
      if (!global.macos7 || !global.macos7.windowAdapter) return;

      const content = `
        <div style="padding: 20px; text-align: center;">
          <p>Select a printer or file server:</p>
          <div style="margin: 20px 0; padding: 20px; border: 1px solid #000;">
            <p style="color: #888;">No devices available</p>
          </div>
          <button class="mac-button" onclick="this.closest('.os-window').querySelector('.window-btn-close').click()">Cancel</button>
        </div>
      `;

      global.macos7.windowAdapter.createWindow({
        id: 'chooser',
        title: 'Chooser',
        content: content,
        width: 400,
        height: 250,
        resizable: false
      });
    }

    /**
     * Clean up desktop
     * @private
     */
    _cleanUpDesktop() {
      this._triggerAppAction('cleanUpDesktop');
    }

    /**
     * Eject disk
     * @private
     */
    _eject() {
      alert('No disk to eject');
    }

    /**
     * Restart system
     * @private
     */
    _restart() {
      if (confirm('Are you sure you want to restart?')) {
        window.location.href = '/os/macos-system7/';
      }
    }

    /**
     * Shut down system
     * @private
     */
    _shutDown() {
      if (confirm('Are you sure you want to shut down?')) {
        window.location.href = '/';
      }
    }

    /**
     * Show help
     * @param {string} topic - Help topic
     * @private
     */
    _showHelp(topic) {
      alert('Help is not available in this demo.');
    }

    /**
     * Update menu for current application
     * @param {string} appName - Application name
     */
    setCurrentApp(appName) {
      this.currentApp = appName;
    }
  }

  // Export to global scope
  global.MacOS7MenuBar = MacOS7MenuBar;

})(typeof window !== 'undefined' ? window : global);
