/**
 * BeOS Deskbar
 * The Deskbar is BeOS's unique taskbar/application launcher
 * Features: Be menu, yellow application tabs, replicant hosting, clock
 */

(function(global) {
  'use strict';

  /**
   * BeOS Deskbar
   * Manages the Deskbar (taskbar), Be menu, and application tabs
   */
  class BeOSDeskbar {
    constructor() {
      this.element = null;
      this.beMenuButton = null;
      this.beMenu = null;
      this.appTray = null;
      this.clock = null;
      this.isBeMenuOpen = false;
    }

    /**
     * Initialize the Deskbar
     */
    init() {
      this.element = document.getElementById('beos-deskbar');
      this.beMenuButton = document.getElementById('be-menu-button');
      this.beMenu = document.getElementById('be-menu');
      this.appTray = document.getElementById('deskbar-apps');
      this.clock = document.getElementById('deskbar-clock');

      if (!this.element || !this.beMenuButton || !this.beMenu) {
        console.error('Deskbar elements not found');
        return;
      }

      this._setupBeMenu();
      this._setupClock();
      this._setupClickOutside();
    }

    /**
     * Setup Be menu
     * @private
     */
    _setupBeMenu() {
      // Be menu button click
      this.beMenuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleBeMenu();
      });

      // Create Be menu items
      this._createBeMenuItems();
    }

    /**
     * Create Be menu items
     * @private
     */
    _createBeMenuItems() {
      const menuItems = [
        {
          label: 'Applications',
          icon: '📁',
          submenu: [
            { label: 'Tracker', action: () => this._launchApp('tracker') },
            { label: 'StyledEdit', action: () => this._launchApp('stylededit') },
            { label: 'Terminal', action: () => this._launchApp('terminal') },
            { label: 'MediaPlayer', action: () => this._launchApp('mediaplayer') },
            { label: 'BeDepot', action: () => this._launchApp('bedepot') }
          ]
        },
        { separator: true },
        {
          label: 'Preferences',
          icon: '⚙️',
          submenu: [
            { label: 'Appearance...', action: () => this._showPreferences('appearance') },
            { label: 'Keyboard...', action: () => this._showPreferences('keyboard') },
            { label: 'Mouse...', action: () => this._showPreferences('mouse') },
            { label: 'Screen...', action: () => this._showPreferences('screen') }
          ]
        },
        {
          label: 'Deskbar',
          icon: '🔧',
          submenu: [
            { label: 'About Deskbar...', action: () => this._showAbout() },
            { label: 'Preferences...', action: () => this._showPreferences('deskbar') },
            { separator: true },
            { label: 'Show Replicants', action: () => this._toggleReplicants() },
            { label: 'Hide Replicants', action: () => this._toggleReplicants() }
          ]
        },
        { separator: true },
        { label: 'Find...', icon: '🔍', action: () => this._openFind() },
        { label: 'Show Replicants', action: () => this._toggleReplicants() },
        { separator: true },
        { label: 'Mount', icon: '💾', action: () => this._showMount() },
        { label: 'Eject', icon: '⏏️', action: () => this._showEject() },
        { separator: true },
        { label: 'Shutdown...', icon: '⏻', action: () => this._showShutdown() },
        { label: 'Restart...', icon: '🔄', action: () => this._showRestart() }
      ];

      const container = this.beMenu.querySelector('.be-menu-items');
      container.innerHTML = '';

      menuItems.forEach(item => {
        if (item.separator) {
          const sep = document.createElement('div');
          sep.className = 'be-menu-separator';
          container.appendChild(sep);
        } else {
          const menuItem = this._createMenuItem(item);
          container.appendChild(menuItem);
        }
      });
    }

    /**
     * Create individual menu item
     * @private
     */
    _createMenuItem(item) {
      const menuItem = document.createElement('div');
      menuItem.className = 'be-menu-item';
      menuItem.setAttribute('role', 'menuitem');

      if (item.icon) {
        const icon = document.createElement('div');
        icon.className = 'be-menu-item-icon';
        icon.textContent = item.icon;
        menuItem.appendChild(icon);
      }

      const label = document.createElement('div');
      label.className = 'be-menu-item-label';
      label.textContent = item.label;
      menuItem.appendChild(label);

      if (item.submenu) {
        const arrow = document.createElement('div');
        arrow.className = 'be-menu-item-arrow';
        arrow.textContent = '▶';
        menuItem.appendChild(arrow);

        const submenu = document.createElement('div');
        submenu.className = 'be-submenu';
        item.submenu.forEach(subitem => {
          if (subitem.separator) {
            const sep = document.createElement('div');
            sep.className = 'be-menu-separator';
            submenu.appendChild(sep);
          } else {
            const subMenuItem = this._createMenuItem(subitem);
            submenu.appendChild(subMenuItem);
          }
        });
        menuItem.appendChild(submenu);
      }

      if (item.action) {
        menuItem.addEventListener('click', (e) => {
          e.stopPropagation();
          item.action();
          this.closeBeMenu();
        });
      }

      return menuItem;
    }

    /**
     * Toggle Be menu
     */
    toggleBeMenu() {
      this.isBeMenuOpen = !this.isBeMenuOpen;

      if (this.isBeMenuOpen) {
        this.beMenu.removeAttribute('hidden');
        this.beMenuButton.setAttribute('aria-expanded', 'true');
      } else {
        this.beMenu.setAttribute('hidden', '');
        this.beMenuButton.setAttribute('aria-expanded', 'false');
      }
    }

    /**
     * Close Be menu
     */
    closeBeMenu() {
      this.isBeMenuOpen = false;
      this.beMenu.setAttribute('hidden', '');
      this.beMenuButton.setAttribute('aria-expanded', 'false');
    }

    /**
     * Setup clock
     * @private
     */
    _setupClock() {
      this._updateClock();
      setInterval(() => this._updateClock(), 1000);
    }

    /**
     * Update clock display
     * @private
     */
    _updateClock() {
      if (!this.clock) return;

      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;

      const timeString = `${displayHours}:${minutes} ${ampm}`;
      this.clock.querySelector('#clock-time').textContent = timeString;
    }

    /**
     * Update application tabs (yellow tabs!)
     */
    updateAppTabs() {
      if (!this.appTray) return;
      if (!global.beosDesktop || !global.beosDesktop.windowSystem) return;

      const windows = global.beosDesktop.windowSystem.getAllWindows();
      this.appTray.innerHTML = '';

      windows.forEach(windowData => {
        const tab = document.createElement('div');
        tab.className = 'deskbar-app-tab';
        tab.dataset.windowId = windowData.element.id;

        if (!windowData.element.classList.contains('active')) {
          tab.classList.add('inactive');
        }

        // App icon (placeholder)
        const icon = document.createElement('div');
        icon.className = 'deskbar-app-icon';
        icon.textContent = '📄'; // Default icon
        tab.appendChild(icon);

        // App title
        const title = document.createElement('span');
        title.textContent = windowData.title;
        tab.appendChild(title);

        // Click to focus/restore window
        tab.addEventListener('click', () => {
          if (windowData.minimized) {
            global.beosDesktop.windowSystem.restoreWindow(windowData.element.id);
          } else if (windowData.element.classList.contains('active')) {
            global.beosDesktop.windowSystem._handleMinimize(windowData.element);
          } else {
            global.beosDesktop.windowSystem.focusWindow(windowData.element.id);
          }
        });

        this.appTray.appendChild(tab);
      });
    }

    /**
     * Setup click outside to close menu
     * @private
     */
    _setupClickOutside() {
      document.addEventListener('click', (e) => {
        if (this.isBeMenuOpen && !this.beMenu.contains(e.target) && !this.beMenuButton.contains(e.target)) {
          this.closeBeMenu();
        }
      });
    }

    /**
     * Launch application
     * @private
     */
    _launchApp(appName) {
      if (global.beosDesktop) {
        global.beosDesktop.launchApp(appName);
      }
    }

    /**
     * Show preferences
     * @private
     */
    _showPreferences(type) {
      console.log(`Opening ${type} preferences...`);
      // Could open a preferences window here
    }

    /**
     * Show about dialog
     * @private
     */
    _showAbout() {
      if (!global.beosDesktop || !global.beosDesktop.windowSystem) return;

      const content = `
        <div style="padding: 20px; text-align: center;">
          <h2 style="color: #336699; margin: 0 0 10px 0;">Deskbar</h2>
          <p style="margin: 10px 0;">The BeOS Application Launcher</p>
          <p style="margin: 10px 0; font-size: 9px; color: #666;">Version 5.0</p>
          <div style="margin-top: 20px;">
            <button class="beos-button default" onclick="this.closest('.beos-window').querySelector('.beos-tab-btn').click()">OK</button>
          </div>
        </div>
      `;

      global.beosDesktop.windowSystem.createWindow({
        id: 'about-deskbar',
        title: 'About Deskbar',
        width: 300,
        height: 180,
        content: content,
        resizable: false
      });
    }

    /**
     * Open Find window
     * @private
     */
    _openFind() {
      console.log('Opening Find...');
      // Could open a Find window with query support
    }

    /**
     * Toggle replicants visibility
     * @private
     */
    _toggleReplicants() {
      console.log('Toggling replicants...');
      // Toggle replicant visibility
    }

    /**
     * Show mount dialog
     * @private
     */
    _showMount() {
      console.log('Opening mount dialog...');
    }

    /**
     * Show eject dialog
     * @private
     */
    _showEject() {
      console.log('Opening eject dialog...');
    }

    /**
     * Show shutdown dialog
     * @private
     */
    _showShutdown() {
      if (confirm('Are you sure you want to shut down?')) {
        window.location.href = '/';
      }
    }

    /**
     * Show restart dialog
     * @private
     */
    _showRestart() {
      if (confirm('Are you sure you want to restart?')) {
        window.location.reload();
      }
    }
  }

  // Export to global scope
  global.BeOSDeskbar = BeOSDeskbar;

})(window);
