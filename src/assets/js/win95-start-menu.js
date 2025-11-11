/**
 * Windows 95 Start Menu
 * Manages the iconic Windows 95 Start menu
 */

(function(global) {
  'use strict';

  class Win95StartMenu {
    constructor(desktop) {
      this.desktop = desktop;
      this.button = null;
      this.menu = null;
      this.isOpen = false;
    }

    /**
     * Initialize Start menu
     */
    init() {
      this.button = document.getElementById('start-button');
      this.menu = document.getElementById('start-menu');

      if (!this.button || !this.menu) {
        console.error('Start button or menu not found');
        return;
      }

      // Build menu structure
      this.buildMenu();

      // Attach event listeners
      this.attachEventListeners();

      console.log('Win95StartMenu initialized');
    }

    /**
     * Build menu structure
     */
    buildMenu() {
      const menuItems = this.getMenuStructure();
      const container = this.menu.querySelector('.start-menu-items');

      container.innerHTML = '';

      menuItems.forEach(item => {
        if (item.type === 'separator') {
          const separator = document.createElement('div');
          separator.className = 'start-menu-separator';
          container.appendChild(separator);
        } else {
          const menuItem = this.createMenuItem(item);
          container.appendChild(menuItem);
        }
      });
    }

    /**
     * Create menu item element
     */
    createMenuItem(item) {
      const element = document.createElement('div');
      element.className = 'start-menu-item';
      element.setAttribute('role', 'menuitem');
      element.setAttribute('tabindex', '0');

      // Icon
      const icon = document.createElement('div');
      icon.className = 'start-menu-item-icon';
      icon.innerHTML = item.icon || this.getDefaultIcon();
      element.appendChild(icon);

      // Label
      const label = document.createElement('div');
      label.className = 'start-menu-item-label';
      label.textContent = item.label;
      element.appendChild(label);

      // Submenu arrow
      if (item.submenu) {
        const arrow = document.createElement('div');
        arrow.className = 'start-menu-item-arrow';
        arrow.textContent = '▶';
        element.appendChild(arrow);

        // Create submenu
        const submenu = this.createSubmenu(item.submenu);
        element.appendChild(submenu);
      }

      // Click handler
      if (item.action) {
        element.addEventListener('click', (e) => {
          e.stopPropagation();
          if (!item.submenu) {
            item.action();
            this.close();
          }
        });
      }

      // Keyboard support
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });

      return element;
    }

    /**
     * Create submenu
     */
    createSubmenu(items) {
      const submenu = document.createElement('div');
      submenu.className = 'start-submenu';
      submenu.setAttribute('role', 'menu');

      items.forEach(item => {
        if (item.type === 'separator') {
          const separator = document.createElement('div');
          separator.className = 'start-menu-separator';
          submenu.appendChild(separator);
        } else {
          const menuItem = this.createMenuItem(item);
          submenu.appendChild(menuItem);
        }
      });

      return submenu;
    }

    /**
     * Get menu structure
     */
    getMenuStructure() {
      return [
        {
          label: 'Programs',
          icon: this.getFolderIcon(),
          submenu: [
            {
              label: 'Accessories',
              icon: this.getFolderIcon(),
              submenu: [
                {
                  label: 'Notepad',
                  icon: this.getAppIcon('notepad'),
                  action: () => this.desktop.openApplication('notepad')
                },
                {
                  label: 'Paint',
                  icon: this.getAppIcon('paint'),
                  action: () => this.desktop.openApplication('paint')
                },
                {
                  label: 'WordPad',
                  icon: this.getAppIcon('wordpad'),
                  action: () => this.desktop.openApplication('wordpad')
                },
                {
                  label: 'Calculator',
                  icon: this.getAppIcon('calculator'),
                  action: () => this.desktop.openApplication('calculator')
                }
              ]
            },
            {
              label: 'Multimedia',
              icon: this.getFolderIcon(),
              submenu: [
                {
                  label: 'Media Player',
                  icon: this.getAppIcon('media-player'),
                  action: () => this.desktop.openApplication('media-player')
                }
              ]
            },
            {
              label: 'Games',
              icon: this.getFolderIcon(),
              submenu: [
                {
                  label: 'Minesweeper',
                  icon: this.getAppIcon('minesweeper'),
                  action: () => this.desktop.openApplication('minesweeper')
                },
                {
                  label: 'Solitaire',
                  icon: this.getAppIcon('solitaire'),
                  action: () => this.desktop.openApplication('solitaire')
                }
              ]
            },
            {
              type: 'separator'
            },
            {
              label: 'Windows Explorer',
              icon: this.getAppIcon('explorer'),
              action: () => this.desktop.openApplication('explorer')
            }
          ]
        },
        {
          label: 'Documents',
          icon: this.getFolderIcon(),
          submenu: [
            {
              label: '(empty)',
              action: () => {}
            }
          ]
        },
        {
          label: 'Settings',
          icon: this.getFolderIcon(),
          submenu: [
            {
              label: 'Control Panel',
              icon: this.getAppIcon('control-panel'),
              action: () => this.desktop.openApplication('control-panel')
            },
            {
              label: 'Printers',
              icon: this.getAppIcon('printer'),
              action: () => this.desktop.showComingSoon('Printers')
            },
            {
              type: 'separator'
            },
            {
              label: 'Taskbar',
              icon: this.getAppIcon('taskbar'),
              action: () => this.desktop.showComingSoon('Taskbar Settings')
            }
          ]
        },
        {
          label: 'Find',
          icon: this.getAppIcon('find'),
          submenu: [
            {
              label: 'Files or Folders...',
              action: () => this.desktop.showComingSoon('Find')
            },
            {
              label: 'Computer...',
              action: () => this.desktop.showComingSoon('Find Computer')
            }
          ]
        },
        {
          label: 'Help',
          icon: this.getAppIcon('help'),
          action: () => this.desktop.showComingSoon('Help')
        },
        {
          label: 'Run...',
          icon: this.getAppIcon('run'),
          action: () => this.openRunDialog()
        },
        {
          type: 'separator'
        },
        {
          label: 'Shut Down...',
          icon: this.getAppIcon('shutdown'),
          action: () => this.desktop.shutdown()
        }
      ];
    }

    /**
     * Get folder icon
     */
    getFolderIcon() {
      return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M4 8 L14 8 L16 6 L28 6 L28 26 L4 26 Z" fill="#FFD700" stroke="#000" stroke-width="2"/>
      </svg>`;
    }

    /**
     * Get app icon
     */
    getAppIcon(type) {
      const icons = {
        notepad: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="6" y="4" width="20" height="24" fill="#FFF" stroke="#000" stroke-width="2"/>
          <line x1="10" y1="10" x2="22" y2="10" stroke="#000"/>
          <line x1="10" y1="14" x2="22" y2="14" stroke="#000"/>
          <line x1="10" y1="18" x2="18" y2="18" stroke="#000"/>
        </svg>`,
        paint: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="4" y="8" width="24" height="18" fill="#FFF" stroke="#000" stroke-width="2"/>
          <circle cx="20" cy="16" r="4" fill="#FF0000"/>
          <circle cx="12" cy="16" r="3" fill="#0000FF"/>
        </svg>`,
        wordpad: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="6" y="4" width="20" height="24" fill="#FFF" stroke="#000" stroke-width="2"/>
          <rect x="8" y="7" width="16" height="3" fill="#0000FF"/>
          <line x1="8" y1="13" x2="22" y2="13" stroke="#000" stroke-width="2"/>
          <line x1="8" y1="17" x2="22" y2="17" stroke="#000"/>
          <line x1="8" y1="20" x2="18" y2="20" stroke="#000"/>
        </svg>`,
        'media-player': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="4" y="6" width="24" height="20" fill="#C0C0C0" stroke="#000" stroke-width="2"/>
          <polygon points="12,12 12,22 22,17" fill="#0000FF" stroke="#000" stroke-width="1"/>
        </svg>`,
        minesweeper: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="4" y="4" width="24" height="24" fill="#C0C0C0" stroke="#000" stroke-width="2"/>
          <circle cx="16" cy="16" r="6" fill="#000"/>
          <circle cx="16" cy="16" r="3" fill="#FF0000"/>
        </svg>`,
        solitaire: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="8" y="6" width="16" height="20" rx="2" fill="#FFF" stroke="#000" stroke-width="2"/>
          <text x="16" y="18" text-anchor="middle" fill="#FF0000" font-size="14" font-weight="bold">A♥</text>
        </svg>`,
        explorer: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M4 8 L14 8 L16 6 L28 6 L28 26 L4 26 Z" fill="#FFD700" stroke="#000" stroke-width="2"/>
        </svg>`,
        'control-panel': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="4" y="4" width="24" height="24" fill="#808080" stroke="#000" stroke-width="2"/>
          <rect x="8" y="8" width="6" height="6" fill="#FFF"/>
          <rect x="18" y="8" width="6" height="6" fill="#FFF"/>
          <rect x="8" y="18" width="6" height="6" fill="#FFF"/>
          <rect x="18" y="18" width="6" height="6" fill="#FFF"/>
        </svg>`,
        find: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="14" cy="14" r="8" fill="none" stroke="#000" stroke-width="2"/>
          <line x1="20" y1="20" x2="28" y2="28" stroke="#000" stroke-width="3"/>
        </svg>`,
        run: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="4" y="10" width="24" height="12" fill="#FFF" stroke="#000" stroke-width="2"/>
          <text x="16" y="19" text-anchor="middle" fill="#000" font-size="10" font-family="monospace">C:\\></text>
        </svg>`,
        help: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="12" fill="#0080FF" stroke="#000" stroke-width="2"/>
          <text x="16" y="22" text-anchor="middle" fill="#FFF" font-size="16" font-weight="bold">?</text>
        </svg>`,
        shutdown: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="12" fill="#808080" stroke="#000" stroke-width="2"/>
          <rect x="14" y="8" width="4" height="8" fill="#FFF"/>
          <path d="M16 16 A 6 6 0 1 1 16 28 A 6 6 0 1 1 16 16" stroke="#FFF" stroke-width="2" fill="none"/>
        </svg>`
      };
      return icons[type] || this.getFolderIcon();
    }

    /**
     * Get default icon
     */
    getDefaultIcon() {
      return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="6" y="6" width="20" height="20" fill="#C0C0C0" stroke="#000" stroke-width="2"/>
      </svg>`;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
      // Toggle menu on button click
      this.button.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (this.isOpen && !this.menu.contains(e.target) && e.target !== this.button) {
          this.close();
        }
      });

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });
    }

    /**
     * Toggle menu
     */
    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    /**
     * Open menu
     */
    open() {
      if (this.isOpen) return;

      this.isOpen = true;
      this.menu.hidden = false;
      this.button.setAttribute('aria-expanded', 'true');

      // Focus first menu item
      setTimeout(() => {
        const firstItem = this.menu.querySelector('.start-menu-item');
        if (firstItem) {
          firstItem.focus();
        }
      }, 50);
    }

    /**
     * Close menu
     */
    close() {
      if (!this.isOpen) return;

      this.isOpen = false;
      this.menu.hidden = true;
      this.button.setAttribute('aria-expanded', 'false');

      // Hide all submenus
      const submenus = this.menu.querySelectorAll('.start-submenu');
      submenus.forEach(submenu => {
        submenu.style.display = 'none';
      });
    }

    /**
     * Open Run dialog
     */
    openRunDialog() {
      if (typeof Win95Run !== 'undefined') {
        const runDialog = new Win95Run(this.desktop.windowManager, this.desktop);
        runDialog.open();
      } else {
        console.error('Win95Run not loaded');
      }
    }
  }

  // Export to global scope
  global.Win95StartMenu = Win95StartMenu;

})(typeof window !== 'undefined' ? window : global);
