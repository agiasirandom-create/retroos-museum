/**
 * Windows 95 Desktop
 * Main orchestrator for the Windows 95 desktop environment
 */

(function(global) {
  'use strict';

  class Win95Desktop {
    constructor() {
      this.windowManager = null;
      this.desktop = null;
      this.taskbar = null;
      this.startMenu = null;
      this.config = null;
    }

    /**
     * Initialize Windows 95 desktop
     */
    async init() {
      console.log('Initializing Windows 95 Desktop...');

      // Load configuration
      await this.loadConfig();

      // Initialize core systems
      this.initWindowManager();
      this.initDesktop();
      this.initTaskbar();
      this.initStartMenu();

      // Set up desktop icons
      this.createDesktopIcons();

      // Set up keyboard shortcuts
      this.setupKeyboardShortcuts();

      // Update clock
      this.startClock();

      console.log('Windows 95 Desktop initialized successfully');
    }

    /**
     * Load Windows 95 configuration
     */
    async loadConfig() {
      try {
        const response = await fetch('/src/_data/os/windows95.json');
        this.config = await response.json();
      } catch (error) {
        console.warn('Failed to load config, using defaults:', error);
        this.config = this.getDefaultConfig();
      }
    }

    /**
     * Get default configuration
     */
    getDefaultConfig() {
      return {
        metadata: {
          name: 'Windows 95',
          version: '4.0.950'
        },
        visual: {
          theme: {
            colors: {
              desktop: '#008080'
            }
          }
        },
        components: {
          applications: []
        }
      };
    }

    /**
     * Initialize window manager
     */
    initWindowManager() {
      this.windowManager = new WindowManager();
      this.windowManager.init('#windows-container');

      // Listen for window events to update taskbar
      const originalCreateWindow = this.windowManager.createWindow.bind(this.windowManager);
      this.windowManager.createWindow = (options) => {
        const win = originalCreateWindow(options);
        if (this.taskbar) {
          this.taskbar.addWindow(win);
        }
        return win;
      };
    }

    /**
     * Initialize desktop
     */
    initDesktop() {
      this.desktop = new Desktop();
      this.desktop.init('#desktop-icons', {
        multiSelect: true,
        draggable: false,
        contextMenu: true,
        contextMenuItems: this.getDesktopContextMenu()
      });
    }

    /**
     * Initialize taskbar
     */
    initTaskbar() {
      if (typeof Win95Taskbar !== 'undefined') {
        this.taskbar = new Win95Taskbar(this.windowManager);
        this.taskbar.init();
      }
    }

    /**
     * Initialize Start menu
     */
    initStartMenu() {
      if (typeof Win95StartMenu !== 'undefined') {
        this.startMenu = new Win95StartMenu(this);
        this.startMenu.init();
      }
    }

    /**
     * Create desktop icons
     */
    createDesktopIcons() {
      const icons = [
        {
          id: 'my-computer',
          label: 'My Computer',
          icon: this.getIconHTML('my-computer'),
          x: 0,
          y: 0,
          onOpen: () => this.openMyComputer()
        },
        {
          id: 'recycle-bin',
          label: 'Recycle Bin',
          icon: this.getIconHTML('recycle-bin'),
          x: 0,
          y: 1,
          onOpen: () => this.openRecycleBin()
        },
        {
          id: 'network-neighborhood',
          label: 'Network Neighborhood',
          icon: this.getIconHTML('network'),
          x: 0,
          y: 2,
          onOpen: () => this.showComingSoon('Network Neighborhood')
        },
        {
          id: 'my-briefcase',
          label: 'My Briefcase',
          icon: this.getIconHTML('briefcase'),
          x: 0,
          y: 3,
          onOpen: () => this.showComingSoon('My Briefcase')
        },
        {
          id: 'internet-explorer',
          label: 'The Internet',
          icon: this.getIconHTML('internet-explorer'),
          x: 0,
          y: 4,
          onOpen: () => this.showComingSoon('Internet Explorer')
        }
      ];

      icons.forEach(iconConfig => {
        this.desktop.addIcon(iconConfig);
      });
    }

    /**
     * Get icon HTML (placeholder for now)
     */
    getIconHTML(type) {
      const icons = {
        'my-computer': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="4" y="8" width="24" height="18" fill="#808080" stroke="#000" stroke-width="2"/>
          <rect x="6" y="10" width="20" height="12" fill="#0080FF"/>
          <rect x="13" y="26" width="6" height="3" fill="#808080" stroke="#000"/>
          <rect x="8" y="29" width="16" height="2" fill="#808080" stroke="#000"/>
        </svg>`,
        'recycle-bin': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M8 10 L10 28 L22 28 L24 10 Z" fill="#C0C0C0" stroke="#000" stroke-width="2"/>
          <rect x="6" y="8" width="20" height="3" fill="#808080" stroke="#000"/>
          <rect x="12" y="5" width="8" height="3" fill="#808080" stroke="#000"/>
          <line x1="14" y1="14" x2="14" y2="24" stroke="#000" stroke-width="1.5"/>
          <line x1="18" y1="14" x2="18" y2="24" stroke="#000" stroke-width="1.5"/>
        </svg>`,
        'network': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="8" cy="8" r="4" fill="#808080" stroke="#000" stroke-width="2"/>
          <circle cx="24" cy="8" r="4" fill="#808080" stroke="#000" stroke-width="2"/>
          <circle cx="16" cy="24" r="4" fill="#808080" stroke="#000" stroke-width="2"/>
          <line x1="10" y1="10" x2="14" y2="22" stroke="#000" stroke-width="2"/>
          <line x1="22" y1="10" x2="18" y2="22" stroke="#000" stroke-width="2"/>
        </svg>`,
        'briefcase': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="4" y="12" width="24" height="16" fill="#8B4513" stroke="#000" stroke-width="2"/>
          <rect x="10" y="8" width="12" height="5" fill="#8B4513" stroke="#000" stroke-width="2"/>
          <rect x="14" y="18" width="4" height="4" fill="#FFD700" stroke="#000"/>
        </svg>`,
        'internet-explorer': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" fill="#0080FF" stroke="#000" stroke-width="2"/>
          <path d="M8 16 Q16 8 24 16" stroke="#FFF" stroke-width="3" fill="none"/>
          <ellipse cx="16" cy="16" rx="8" ry="12" stroke="#FFF" stroke-width="2" fill="none"/>
        </svg>`,
        'folder': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M4 8 L14 8 L16 6 L28 6 L28 26 L4 26 Z" fill="#FFD700" stroke="#000" stroke-width="2"/>
        </svg>`,
        'notepad': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="6" y="4" width="20" height="24" fill="#FFF" stroke="#000" stroke-width="2"/>
          <line x1="10" y1="10" x2="22" y2="10" stroke="#000"/>
          <line x1="10" y1="14" x2="22" y2="14" stroke="#000"/>
          <line x1="10" y1="18" x2="18" y2="18" stroke="#000"/>
        </svg>`
      };
      return icons[type] || icons['folder'];
    }

    /**
     * Open My Computer
     */
    openMyComputer() {
      if (typeof Win95Explorer !== 'undefined') {
        const explorer = new Win95Explorer(this.windowManager);
        explorer.open('My Computer');
      }
    }

    /**
     * Open Recycle Bin
     */
    openRecycleBin() {
      this.windowManager.createWindow({
        id: 'recycle-bin',
        title: 'Recycle Bin',
        width: 600,
        height: 400,
        content: `
          <div style="padding: 16px; text-align: center;">
            <h3>Recycle Bin is empty</h3>
            <p style="margin-top: 8px; color: #666;">
              Drag files and folders here to delete them.
            </p>
          </div>
        `
      });
    }

    /**
     * Show coming soon dialog
     */
    showComingSoon(feature) {
      this.windowManager.createWindow({
        id: `coming-soon-${Date.now()}`,
        title: feature,
        width: 300,
        height: 150,
        content: `
          <div style="padding: 24px; text-align: center;">
            <p style="margin-bottom: 16px;">
              ${feature} is coming soon!
            </p>
            <button onclick="this.closest('.os-window').querySelector('.window-btn-close').click()"
                    style="padding: 4px 16px; font-family: 'MS Sans Serif', sans-serif;">
              OK
            </button>
          </div>
        `,
        resizable: false,
        maximizable: false
      });
    }

    /**
     * Get desktop context menu items
     */
    getDesktopContextMenu() {
      return [
        {
          label: 'Arrange Icons',
          action: () => console.log('Arrange icons')
        },
        {
          type: 'separator'
        },
        {
          label: 'Refresh',
          action: () => location.reload()
        },
        {
          type: 'separator'
        },
        {
          label: 'Paste',
          disabled: true,
          action: () => console.log('Paste')
        },
        {
          type: 'separator'
        },
        {
          label: 'New',
          action: () => console.log('New')
        },
        {
          type: 'separator'
        },
        {
          label: 'Properties',
          action: () => this.showAboutWindows()
        }
      ];
    }

    /**
     * Show About Windows dialog
     */
    showAboutWindows() {
      this.windowManager.createWindow({
        id: 'about-windows',
        title: 'About Windows 95',
        width: 400,
        height: 300,
        content: `
          <div style="padding: 24px; font-family: 'MS Sans Serif', sans-serif;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: #000080; margin-bottom: 8px;">Microsoft Windows 95</h2>
              <p style="font-size: 11px;">Version 4.0.950</p>
            </div>
            <div style="border-top: 2px solid #808080; padding-top: 16px; font-size: 11px;">
              <p style="margin-bottom: 8px;">
                Copyright © 1981-1995 Microsoft Corporation
              </p>
              <p style="margin-bottom: 16px;">
                This product is licensed to:<br>
                <strong>RetroOS Museum User</strong>
              </p>
              <p style="margin-bottom: 8px;">
                <strong>Physical memory available:</strong> 32,768 KB
              </p>
              <p style="margin-bottom: 16px;">
                <strong>System resources:</strong> 85% free
              </p>
            </div>
            <div style="text-align: center; margin-top: 24px;">
              <button onclick="this.closest('.os-window').querySelector('.window-btn-close').click()"
                      class="retro-button--win95"
                      style="min-width: 80px;">
                OK
              </button>
            </div>
          </div>
        `,
        resizable: false,
        maximizable: false
      });
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
      document.addEventListener('keydown', (e) => {
        // Ctrl+Esc or Windows key - Open Start menu
        if ((e.ctrlKey && e.key === 'Escape') || e.key === 'Meta') {
          e.preventDefault();
          if (this.startMenu) {
            this.startMenu.toggle();
          }
        }
      });
    }

    /**
     * Start clock updates
     */
    startClock() {
      const updateClock = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = minutes.toString().padStart(2, '0');

        const clockElement = document.getElementById('clock-time');
        if (clockElement) {
          clockElement.textContent = `${displayHours}:${displayMinutes} ${ampm}`;
        }
      };

      updateClock();
      setInterval(updateClock, 60000); // Update every minute
    }

    /**
     * Open application by ID
     */
    openApplication(appId) {
      console.log('Opening application:', appId);

      switch (appId) {
        case 'notepad':
          if (typeof Win95Notepad !== 'undefined') {
            const notepad = new Win95Notepad(this.windowManager);
            notepad.open();
          }
          break;

        case 'explorer':
          if (typeof Win95Explorer !== 'undefined') {
            const explorer = new Win95Explorer(this.windowManager);
            explorer.open();
          }
          break;

        case 'control-panel':
          if (typeof Win95ControlPanel !== 'undefined') {
            const controlPanel = new Win95ControlPanel(this.windowManager);
            controlPanel.open();
          }
          break;

        case 'minesweeper':
        case 'solitaire':
        case 'paint':
        case 'calculator':
          this.showComingSoon(appId.charAt(0).toUpperCase() + appId.slice(1));
          break;

        default:
          console.warn('Unknown application:', appId);
      }
    }

    /**
     * Shutdown Windows 95
     */
    shutdown() {
      const shutdownWin = this.windowManager.createWindow({
        id: 'shutdown',
        title: 'Shut Down Windows',
        width: 350,
        height: 200,
        content: `
          <div style="padding: 24px; font-family: 'MS Sans Serif', sans-serif;">
            <div style="margin-bottom: 24px; font-size: 11px;">
              <p style="margin-bottom: 16px;">
                <strong>Are you sure you want to shut down the computer?</strong>
              </p>
              <div style="padding-left: 20px;">
                <label style="display: block; margin-bottom: 8px;">
                  <input type="radio" name="shutdown-option" value="shutdown" checked>
                  Shut down the computer
                </label>
                <label style="display: block; margin-bottom: 8px;">
                  <input type="radio" name="shutdown-option" value="restart">
                  Restart the computer
                </label>
                <label style="display: block;">
                  <input type="radio" name="shutdown-option" value="restart-msdos">
                  Restart in MS-DOS mode
                </label>
              </div>
            </div>
            <div style="text-align: center;">
              <button onclick="window.location.href='/'" class="retro-button--win95" style="min-width: 80px; margin-right: 8px;">
                Yes
              </button>
              <button onclick="this.closest('.os-window').querySelector('.window-btn-close').click()"
                      class="retro-button--win95" style="min-width: 80px;">
                No
              </button>
            </div>
          </div>
        `,
        resizable: false,
        maximizable: false,
        minimizable: false
      });
    }
  }

  // Export to global scope
  global.Win95Desktop = Win95Desktop;

})(typeof window !== 'undefined' ? window : global);
