/**
 * BeOS Desktop
 * Main controller for the BeOS R5 desktop environment
 * Coordinates window system, deskbar, workspace switcher, and applications
 */

(function(global) {
  'use strict';

  /**
   * BeOS Desktop
   * Main desktop environment controller
   */
  class BeOSDesktop {
    constructor() {
      this.windowSystem = null;
      this.deskbar = null;
      this.workspaceSwitcher = null;
      this.desktop = null;
      this.applications = new Map();
      this.desktopIcons = [];
    }

    /**
     * Initialize BeOS desktop
     */
    init() {
      // Initialize core systems
      this.windowSystem = new BeOSWindowSystem();
      this.deskbar = new BeOSDeskbar();
      this.workspaceSwitcher = new BeOSWorkspaceSwitcher();

      // Initialize components
      this.deskbar.init();
      this.workspaceSwitcher.init();

      // Setup desktop
      this._setupDesktop();
      this._setupKeyboardShortcuts();
      this._createDesktopIcons();

      // Register as global
      global.beosDesktop = this;

      console.log('BeOS R5 Desktop initialized');
    }

    /**
     * Setup desktop area
     * @private
     */
    _setupDesktop() {
      this.desktop = document.getElementById('desktop-icons');
      if (!this.desktop) {
        console.error('Desktop element not found');
        return;
      }

      // Desktop context menu
      const desktopArea = document.getElementById('beos-desktop');
      if (desktopArea) {
        desktopArea.addEventListener('contextmenu', (e) => {
          if (e.target === desktopArea || e.target === this.desktop) {
            e.preventDefault();
            this._showDesktopContextMenu(e.clientX, e.clientY);
          }
        });

        // Close context menu on click
        desktopArea.addEventListener('click', (e) => {
          const contextMenu = document.getElementById('desktop-context-menu');
          if (contextMenu && !contextMenu.contains(e.target)) {
            contextMenu.setAttribute('hidden', '');
          }
        });
      }
    }

    /**
     * Create desktop icons
     * @private
     */
    _createDesktopIcons() {
      const icons = [
        { id: 'home', label: 'Home', icon: '🏠', action: () => this.launchApp('tracker', '/home') },
        { id: 'disk', label: 'BeOS', icon: '💾', action: () => this.launchApp('tracker', '/boot') },
        { id: 'trash', label: 'Trash', icon: '🗑️', action: () => this.launchApp('tracker', '/trash') }
      ];

      icons.forEach(iconData => {
        const icon = this._createDesktopIcon(iconData);
        this.desktop.appendChild(icon);
        this.desktopIcons.push(iconData);
      });
    }

    /**
     * Create a desktop icon
     * @private
     */
    _createDesktopIcon(data) {
      const icon = document.createElement('div');
      icon.className = 'desktop-icon';
      icon.id = `desktop-icon-${data.id}`;
      icon.setAttribute('role', 'button');
      icon.setAttribute('tabindex', '0');

      const image = document.createElement('div');
      image.className = 'desktop-icon-image';
      image.textContent = data.icon;
      icon.appendChild(image);

      const label = document.createElement('div');
      label.className = 'desktop-icon-label';
      label.textContent = data.label;
      icon.appendChild(label);

      // Double-click to open
      let clickCount = 0;
      let clickTimer = null;

      icon.addEventListener('click', () => {
        clickCount++;
        if (clickCount === 1) {
          // Single click - select
          this._selectDesktopIcon(icon);
          clickTimer = setTimeout(() => {
            clickCount = 0;
          }, 300);
        } else if (clickCount === 2) {
          // Double click - open
          clearTimeout(clickTimer);
          clickCount = 0;
          if (data.action) {
            data.action();
          }
        }
      });

      // Keyboard activation
      icon.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (data.action) {
            data.action();
          }
        }
      });

      return icon;
    }

    /**
     * Select desktop icon
     * @private
     */
    _selectDesktopIcon(icon) {
      // Deselect all icons
      this.desktop.querySelectorAll('.desktop-icon').forEach(i => {
        i.classList.remove('selected');
      });

      // Select this icon
      icon.classList.add('selected');
      icon.focus();
    }

    /**
     * Show desktop context menu
     * @private
     */
    _showDesktopContextMenu(x, y) {
      const contextMenu = document.getElementById('desktop-context-menu');
      if (!contextMenu) return;

      // Create menu items if not already created
      if (!contextMenu.querySelector('.context-menu-list')) {
        const list = document.createElement('ul');
        list.className = 'context-menu-list';

        const items = [
          { label: 'New Folder', action: () => console.log('New folder') },
          { label: 'Find...', action: () => console.log('Find') },
          { separator: true },
          { label: 'Mount', action: () => console.log('Mount') },
          { separator: true },
          { label: 'Workspaces', action: () => console.log('Workspaces') },
          { label: 'Deskbar Preferences', action: () => console.log('Deskbar prefs') }
        ];

        items.forEach(item => {
          if (item.separator) {
            const sep = document.createElement('div');
            sep.className = 'context-menu-separator';
            list.appendChild(sep);
          } else {
            const li = document.createElement('li');
            li.className = 'context-menu-item';

            const button = document.createElement('button');
            button.className = 'context-menu-button';
            button.textContent = item.label;
            button.addEventListener('click', () => {
              item.action();
              contextMenu.setAttribute('hidden', '');
            });

            li.appendChild(button);
            list.appendChild(li);
          }
        });

        contextMenu.appendChild(list);
      }

      // Position and show menu
      contextMenu.style.left = `${x}px`;
      contextMenu.style.top = `${y}px`;
      contextMenu.removeAttribute('hidden');
    }

    /**
     * Launch an application
     */
    launchApp(appName, ...args) {
      const appMap = {
        'tracker': BeOSTracker,
        'stylededit': BeOSStyledEdit,
        'terminal': BeOSTerminal,
        'mediaplayer': BeOSMediaPlayer,
        'bedepot': BeOSBeDepot,
        'people': BeOSPeople,
        'showimage': BeOSShowImage,
        'netpositive': BeOSNetPositive,
        'soundplay': BeOSSoundPlay,
        'mail': BeOSMail
      };

      const AppClass = appMap[appName];
      if (!AppClass) {
        console.error(`Unknown application: ${appName}`);
        return;
      }

      // Check if app is defined
      if (typeof AppClass === 'undefined') {
        console.error(`Application ${appName} not loaded`);
        return;
      }

      // Create and launch app
      const app = new AppClass(this, ...args);
      const appId = `${appName}-${Date.now()}`;
      this.applications.set(appId, app);

      // Launch the app
      app.launch();

      return app;
    }

    /**
     * Setup keyboard shortcuts
     * @private
     */
    _setupKeyboardShortcuts() {
      document.addEventListener('keydown', (e) => {
        // Alt + Tab: Switch windows
        if (e.altKey && e.key === 'Tab') {
          e.preventDefault();
          this._cycleWindows();
        }

        // Ctrl + Alt + Arrow: Switch workspaces
        if (e.ctrlKey && e.altKey) {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.workspaceSwitcher.nextWorkspace();
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.workspaceSwitcher.previousWorkspace();
          }
        }

        // Alt + Escape: Open Be menu
        if (e.altKey && e.key === 'Escape') {
          e.preventDefault();
          this.deskbar.toggleBeMenu();
        }
      });
    }

    /**
     * Cycle through windows (Alt+Tab)
     * @private
     */
    _cycleWindows() {
      const windows = this.windowSystem.getAllWindows();
      if (windows.length === 0) return;

      const currentActive = this.windowSystem.activeWindow;
      const windowIds = Array.from(this.windowSystem.windows.keys());
      const currentIndex = windowIds.indexOf(currentActive);
      const nextIndex = (currentIndex + 1) % windowIds.length;
      const nextWindowId = windowIds[nextIndex];

      this.windowSystem.focusWindow(nextWindowId);
    }

    /**
     * Get desktop element
     */
    getDesktop() {
      return this.desktop;
    }

    /**
     * Get window system
     */
    getWindowSystem() {
      return this.windowSystem;
    }

    /**
     * Get deskbar
     */
    getDeskbar() {
      return this.deskbar;
    }

    /**
     * Get workspace switcher
     */
    getWorkspaceSwitcher() {
      return this.workspaceSwitcher;
    }
  }

  // Export to global scope
  global.BeOSDesktop = BeOSDesktop;

})(window);
