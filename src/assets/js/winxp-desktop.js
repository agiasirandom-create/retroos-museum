/**
 * Windows XP Desktop
 * Main orchestrator for the Windows XP Luna desktop environment
 */

(function(global) {
  'use strict';

  class WinXPDesktop {
    constructor() {
      this.windowManager = null;
      this.desktop = null;
      this.taskbar = null;
      this.startMenu = null;
      this.config = null;
      this.selectedIcon = null;
    }

    /**
     * Initialize Windows XP desktop
     */
    async init() {
      console.log('Initializing Windows XP Desktop...');

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

      console.log('Windows XP Desktop initialized successfully');
    }

    /**
     * Load Windows XP configuration
     */
    async loadConfig() {
      try {
        const response = await fetch('/src/_data/os/windowsxp.json');
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
          name: 'Windows XP',
          version: '5.1.2600'
        },
        visual: {
          theme: {
            colors: {
              desktop: '#5A7EDC'
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
      this.desktop = document.getElementById('winxp-desktop');
      if (!this.desktop) {
        console.error('Desktop element not found');
        return;
      }

      // Set up desktop click handler for deselecting icons
      this.desktop.addEventListener('click', (e) => {
        if (e.target === this.desktop || e.target.classList.contains('desktop-icons')) {
          this.deselectAllIcons();
        }
      });
    }

    /**
     * Initialize taskbar
     */
    initTaskbar() {
      if (typeof WinXPTaskbar !== 'undefined') {
        this.taskbar = new WinXPTaskbar(this);
        this.taskbar.init();
      } else {
        console.error('WinXPTaskbar not loaded');
      }
    }

    /**
     * Initialize Start menu
     */
    initStartMenu() {
      if (typeof WinXPStartMenu !== 'undefined') {
        this.startMenu = new WinXPStartMenu(this);
        this.startMenu.init();
      } else {
        console.error('WinXPStartMenu not loaded');
      }
    }

    /**
     * Create desktop icons
     */
    createDesktopIcons() {
      const container = document.getElementById('desktop-icons');
      if (!container) return;

      const icons = [
        {
          id: 'my-computer',
          label: 'My Computer',
          icon: this.getIconSvg('computer'),
          action: () => this.openMyComputer()
        },
        {
          id: 'my-documents',
          label: 'My Documents',
          icon: this.getIconSvg('documents'),
          action: () => this.openMyDocuments()
        },
        {
          id: 'my-network',
          label: 'My Network Places',
          icon: this.getIconSvg('network'),
          action: () => this.openMyNetwork()
        },
        {
          id: 'recycle-bin',
          label: 'Recycle Bin',
          icon: this.getIconSvg('recycle'),
          action: () => this.openRecycleBin()
        },
        {
          id: 'internet-explorer',
          label: 'Internet Explorer',
          icon: this.getIconSvg('ie'),
          action: () => this.openInternetExplorer()
        }
      ];

      icons.forEach(iconData => {
        const icon = this.createDesktopIcon(iconData);
        container.appendChild(icon);
      });
    }

    /**
     * Create a single desktop icon
     */
    createDesktopIcon(data) {
      const icon = document.createElement('div');
      icon.className = 'desktop-icon';
      icon.setAttribute('data-icon-id', data.id);
      icon.setAttribute('tabindex', '0');
      icon.setAttribute('role', 'button');
      icon.setAttribute('aria-label', data.label);

      const image = document.createElement('div');
      image.className = 'desktop-icon-image';
      image.innerHTML = data.icon;

      const label = document.createElement('div');
      label.className = 'desktop-icon-label';
      label.textContent = data.label;

      icon.appendChild(image);
      icon.appendChild(label);

      // Single click to select
      icon.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectIcon(icon);
      });

      // Double click to open
      icon.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        if (data.action) {
          data.action();
        }
      });

      // Keyboard support
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
     * Select a desktop icon
     */
    selectIcon(icon) {
      this.deselectAllIcons();
      icon.classList.add('selected');
      this.selectedIcon = icon;
    }

    /**
     * Deselect all desktop icons
     */
    deselectAllIcons() {
      const icons = document.querySelectorAll('.desktop-icon.selected');
      icons.forEach(icon => icon.classList.remove('selected'));
      this.selectedIcon = null;
    }

    /**
     * Get icon SVG
     */
    getIconSvg(type) {
      const icons = {
        computer: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="4" y="8" width="24" height="16" fill="#3B82F6" stroke="#1E40AF" stroke-width="2"/>
          <rect x="6" y="10" width="20" height="12" fill="#60A5FA"/>
          <rect x="12" y="24" width="8" height="2" fill="#6B7280"/>
          <rect x="8" y="26" width="16" height="2" fill="#9CA3AF"/>
        </svg>`,
        documents: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M8 4h12l6 6v18H8V4z" fill="#FCD34D" stroke="#F59E0B" stroke-width="2"/>
          <path d="M20 4v6h6" fill="none" stroke="#F59E0B" stroke-width="2"/>
          <line x1="12" y1="14" x2="22" y2="14" stroke="#F59E0B" stroke-width="1.5"/>
          <line x1="12" y1="18" x2="22" y2="18" stroke="#F59E0B" stroke-width="1.5"/>
          <line x1="12" y1="22" x2="18" y2="22" stroke="#F59E0B" stroke-width="1.5"/>
        </svg>`,
        network: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="8" r="4" fill="#34D399" stroke="#10B981" stroke-width="2"/>
          <circle cx="8" cy="24" r="4" fill="#34D399" stroke="#10B981" stroke-width="2"/>
          <circle cx="24" cy="24" r="4" fill="#34D399" stroke="#10B981" stroke-width="2"/>
          <line x1="16" y1="12" x2="10" y2="20" stroke="#10B981" stroke-width="2"/>
          <line x1="16" y1="12" x2="22" y2="20" stroke="#10B981" stroke-width="2"/>
        </svg>`,
        recycle: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M8 10l2-6h12l2 6" fill="none" stroke="#64748B" stroke-width="2"/>
          <rect x="6" y="10" width="20" height="18" rx="2" fill="#94A3B8" stroke="#64748B" stroke-width="2"/>
          <rect x="8" y="12" width="16" height="14" fill="#CBD5E1"/>
          <rect x="10" y="14" width="3" height="10" fill="#64748B" opacity="0.5"/>
          <rect x="14.5" y="14" width="3" height="10" fill="#64748B" opacity="0.5"/>
          <rect x="19" y="14" width="3" height="10" fill="#64748B" opacity="0.5"/>
        </svg>`,
        ie: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" fill="#4299E1" stroke="#2B6CB0" stroke-width="2"/>
          <path d="M10 12c0-3 2-5 6-5s6 2 6 5" fill="none" stroke="white" stroke-width="2"/>
          <ellipse cx="16" cy="16" rx="10" ry="6" fill="none" stroke="white" stroke-width="2"/>
          <line x1="6" y1="16" x2="26" y2="16" stroke="white" stroke-width="2"/>
        </svg>`
      };
      return icons[type] || icons.computer;
    }

    /**
     * Open My Computer
     */
    openMyComputer() {
      if (typeof WinXPExplorer !== 'undefined') {
        const explorer = new WinXPExplorer(this);
        explorer.open('My Computer');
      } else {
        this.showPlaceholder('My Computer');
      }
    }

    /**
     * Open My Documents
     */
    openMyDocuments() {
      if (typeof WinXPExplorer !== 'undefined') {
        const explorer = new WinXPExplorer(this);
        explorer.open('My Documents');
      } else {
        this.showPlaceholder('My Documents');
      }
    }

    /**
     * Open My Network Places
     */
    openMyNetwork() {
      this.showPlaceholder('My Network Places');
    }

    /**
     * Open Recycle Bin
     */
    openRecycleBin() {
      this.showPlaceholder('Recycle Bin');
    }

    /**
     * Open Internet Explorer
     */
    openInternetExplorer() {
      this.showPlaceholder('Internet Explorer');
    }

    /**
     * Open Notepad
     */
    openNotepad() {
      if (typeof WinXPNotepad !== 'undefined') {
        const notepad = new WinXPNotepad(this);
        notepad.open();
      } else {
        console.error('WinXPNotepad not loaded');
      }
    }

    /**
     * Open Control Panel
     */
    openControlPanel() {
      if (typeof WinXPControlPanel !== 'undefined') {
        const controlPanel = new WinXPControlPanel(this);
        controlPanel.open();
      } else {
        console.error('WinXPControlPanel not loaded');
      }
    }

    /**
     * Open Search
     */
    openSearch() {
      if (typeof WinXPSearch !== 'undefined') {
        const search = new WinXPSearch(this);
        search.open();
      } else {
        console.error('WinXPSearch not loaded');
      }
    }

    /**
     * Open Run dialog
     */
    openRun() {
      if (typeof WinXPRun !== 'undefined') {
        const run = new WinXPRun(this);
        run.open();
      } else {
        console.error('WinXPRun not loaded');
      }
    }

    /**
     * Show placeholder window
     */
    showPlaceholder(title) {
      this.windowManager.createWindow({
        id: `placeholder-${Date.now()}`,
        title: title,
        content: `
          <div style="padding: 40px; text-align: center; font-family: Tahoma, Arial, sans-serif;">
            <h2 style="color: #0054E3; margin-bottom: 20px;">${title}</h2>
            <p style="color: #666; margin-bottom: 20px;">This is a demonstration window.</p>
            <p style="color: #999; font-size: 11px;">In a full implementation, this would open the ${title} interface.</p>
          </div>
        `,
        width: 500,
        height: 400,
        resizable: true,
        minimizable: true,
        maximizable: true
      });
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
      document.addEventListener('keydown', (e) => {
        // Ctrl+Esc or Windows key - Open Start Menu
        if ((e.ctrlKey && e.key === 'Escape') || e.key === 'Meta') {
          e.preventDefault();
          if (this.startMenu) {
            this.startMenu.toggle();
          }
        }

        // Windows+D - Show Desktop
        if (e.metaKey && e.key === 'd') {
          e.preventDefault();
          this.windowManager.minimizeAll();
        }

        // Windows+E - Open My Computer
        if (e.metaKey && e.key === 'e') {
          e.preventDefault();
          this.openMyComputer();
        }

        // Windows+R - Open Run
        if (e.metaKey && e.key === 'r') {
          e.preventDefault();
          this.openRun();
        }

        // Windows+F - Open Search
        if (e.metaKey && e.key === 'f') {
          e.preventDefault();
          this.openSearch();
        }
      });
    }

    /**
     * Start clock update
     */
    startClock() {
      const updateClock = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;

        const clockElement = document.getElementById('clock-time');
        if (clockElement) {
          clockElement.textContent = `${displayHours}:${minutes} ${ampm}`;
        }
      };

      updateClock();
      setInterval(updateClock, 1000);
    }
  }

  // Export to global scope
  global.WinXPDesktop = WinXPDesktop;

})(typeof window !== 'undefined' ? window : global);
