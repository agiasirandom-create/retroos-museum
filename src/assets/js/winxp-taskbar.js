/**
 * Windows XP Taskbar
 * Manages taskbar window buttons, quick launch, and system tray
 */

(function(global) {
  'use strict';

  class WinXPTaskbar {
    constructor(desktop) {
      this.desktop = desktop;
      this.taskbar = null;
      this.windowsContainer = null;
      this.quickLaunch = null;
      this.windows = new Map();
    }

    /**
     * Initialize taskbar
     */
    init() {
      this.taskbar = document.getElementById('winxp-taskbar');
      this.windowsContainer = document.getElementById('taskbar-windows');
      this.quickLaunch = this.taskbar?.querySelector('.quick-launch');

      if (!this.taskbar || !this.windowsContainer) {
        console.error('Taskbar elements not found');
        return;
      }

      // Build quick launch icons
      this.buildQuickLaunch();

      // Setup show desktop button
      this.setupShowDesktop();

      console.log('WinXPTaskbar initialized');
    }

    /**
     * Build quick launch toolbar
     */
    buildQuickLaunch() {
      if (!this.quickLaunch) return;

      const icons = [
        {
          id: 'ql-ie',
          title: 'Internet Explorer',
          icon: this.getIconSvg('ie'),
          action: () => this.desktop.openInternetExplorer()
        },
        {
          id: 'ql-explorer',
          title: 'Windows Explorer',
          icon: this.getIconSvg('explorer'),
          action: () => this.desktop.openMyComputer()
        },
        {
          id: 'ql-media',
          title: 'Windows Media Player',
          icon: this.getIconSvg('media'),
          action: () => this.desktop.showPlaceholder('Windows Media Player')
        }
      ];

      icons.forEach(iconData => {
        const icon = document.createElement('button');
        icon.className = 'quick-launch-icon';
        icon.title = iconData.title;
        icon.setAttribute('aria-label', iconData.title);
        icon.innerHTML = iconData.icon;

        icon.addEventListener('click', (e) => {
          e.stopPropagation();
          if (iconData.action) {
            iconData.action();
          }
        });

        this.quickLaunch.appendChild(icon);
      });
    }

    /**
     * Setup show desktop button
     */
    setupShowDesktop() {
      const showDesktopBtn = this.taskbar?.querySelector('.show-desktop-btn');
      if (!showDesktopBtn) return;

      showDesktopBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.desktop.windowManager.minimizeAll();
      });
    }

    /**
     * Add window to taskbar
     */
    addWindow(window) {
      if (this.windows.has(window.id)) {
        return;
      }

      const button = this.createWindowButton(window);
      this.windowsContainer.appendChild(button);
      this.windows.set(window.id, { window, button });

      // Listen for window events
      window.element.addEventListener('focus', () => {
        this.updateButtonState(window.id);
      });

      // Remove button when window closes
      const originalClose = window.close.bind(window);
      window.close = () => {
        this.removeWindow(window.id);
        originalClose();
      };
    }

    /**
     * Create window button for taskbar
     */
    createWindowButton(window) {
      const button = document.createElement('button');
      button.className = 'taskbar-window-btn';
      button.setAttribute('data-window-id', window.id);
      button.setAttribute('aria-label', window.title);

      // Icon (placeholder)
      const icon = document.createElement('span');
      icon.className = 'taskbar-window-btn-icon';
      icon.innerHTML = this.getIconSvg('window');
      button.appendChild(icon);

      // Text
      const text = document.createElement('span');
      text.className = 'taskbar-window-btn-text';
      text.textContent = window.title;
      button.appendChild(text);

      // Click handler
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.isMinimized) {
          window.restore();
          window.focus();
        } else if (this.desktop.windowManager.activeWindow === window) {
          window.minimize();
        } else {
          window.focus();
        }
        this.updateButtonState(window.id);
      });

      return button;
    }

    /**
     * Remove window from taskbar
     */
    removeWindow(windowId) {
      const entry = this.windows.get(windowId);
      if (entry) {
        entry.button.remove();
        this.windows.delete(windowId);
      }
    }

    /**
     * Update button active state
     */
    updateButtonState(windowId) {
      // Remove active class from all buttons
      this.windows.forEach((entry) => {
        entry.button.classList.remove('active');
      });

      // Add active class to current window's button
      const entry = this.windows.get(windowId);
      if (entry && this.desktop.windowManager.activeWindow === entry.window) {
        entry.button.classList.add('active');
      }
    }

    /**
     * Get icon SVG
     */
    getIconSvg(type) {
      const icons = {
        ie: `<svg width="16" height="16" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="7" fill="#4299E1"/>
          <path d="M5 6c0-1.5 1-2.5 3-2.5s3 1 3 2.5" fill="none" stroke="white" stroke-width="1"/>
        </svg>`,
        explorer: `<svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M2 3h5l1 1h6v9H2V3z" fill="#FCD34D"/>
        </svg>`,
        media: `<svg width="16" height="16" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="6" fill="#F59E0B"/>
          <path d="M6 5l5 3-5 3V5z" fill="white"/>
        </svg>`,
        window: `<svg width="16" height="16" viewBox="0 0 16 16">
          <rect x="2" y="2" width="12" height="12" rx="1" fill="#3B82F6" stroke="#1E40AF" stroke-width="1"/>
          <rect x="3" y="3" width="10" height="2" fill="#60A5FA"/>
        </svg>`
      };
      return icons[type] || icons.window;
    }
  }

  // Export to global scope
  global.WinXPTaskbar = WinXPTaskbar;

})(typeof window !== 'undefined' ? window : global);
