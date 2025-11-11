/**
 * Ubuntu Panels System
 * Manages top panel (menu bar) and bottom panel (window list + workspace switcher)
 */

(function(global) {
  'use strict';

  class UbuntuPanels {
    constructor(desktopInstance) {
      this.desktop = desktopInstance;
      this.windowList = new Map();
      this.showDesktopBtn = null;
      this.trashBtn = null;
    }

    /**
     * Initialize panels
     */
    init() {
      this.initShowDesktopButton();
      this.initWindowList();
      this.initTrashButton();
      this.setupWindowListeners();
    }

    /**
     * Initialize show desktop button
     */
    initShowDesktopButton() {
      this.showDesktopBtn = document.querySelector('.panel-show-desktop-btn');
      if (this.showDesktopBtn) {
        this.showDesktopBtn.addEventListener('click', () => {
          this.desktop.showDesktop();
        });
      }
    }

    /**
     * Initialize window list
     */
    initWindowList() {
      this.windowListContainer = document.getElementById('window-list');
      if (!this.windowListContainer) {
        console.error('Window list container not found');
        return;
      }

      // Listen for window manager events
      this.setupWindowListeners();
    }

    /**
     * Initialize trash button
     */
    initTrashButton() {
      this.trashBtn = document.querySelector('.panel-trash-button');
      if (this.trashBtn) {
        this.trashBtn.addEventListener('click', () => {
          this.desktop.openNautilus('/home/user/.Trash');
        });
      }
    }

    /**
     * Set up window event listeners
     */
    setupWindowListeners() {
      // Override window manager's createWindow to hook into window creation
      const originalCreateWindow = this.desktop.windowManager.createWindow.bind(this.desktop.windowManager);
      this.desktop.windowManager.createWindow = (options) => {
        const win = originalCreateWindow(options);
        this.addWindowToList(win);
        return win;
      };

      // Listen for window close
      document.addEventListener('click', (e) => {
        if (e.target.closest('.window-btn-close')) {
          const windowEl = e.target.closest('.os-window');
          if (windowEl) {
            const windowId = windowEl.getAttribute('data-window-id');
            setTimeout(() => {
              this.removeWindowFromList(windowId);
            }, 250);
          }
        }
      });
    }

    /**
     * Add window to window list
     */
    addWindowToList(windowInstance) {
      if (!this.windowListContainer) return;

      const button = document.createElement('button');
      button.className = 'window-list-button';
      button.setAttribute('data-window-id', windowInstance.id);
      button.setAttribute('title', windowInstance.title);

      // Window icon (generic for now)
      const icon = document.createElement('span');
      icon.className = 'window-list-icon';
      icon.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="2" y="2" width="12" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/>
          <rect x="2" y="2" width="12" height="3" fill="currentColor"/>
        </svg>
      `;

      // Window title
      const title = document.createElement('span');
      title.className = 'window-list-title';
      title.textContent = windowInstance.title;

      button.appendChild(icon);
      button.appendChild(title);

      // Click to focus/minimize window
      button.addEventListener('click', () => {
        if (windowInstance.isMinimized) {
          windowInstance.restore();
          windowInstance.focus();
          button.classList.remove('minimized');
        } else if (this.desktop.windowManager.activeWindow === windowInstance) {
          windowInstance.minimize();
          button.classList.add('minimized');
        } else {
          windowInstance.focus();
        }
      });

      // Update button state on window events
      windowInstance.onMinimize = (win) => {
        button.classList.add('minimized');
      };

      windowInstance.onFocus = (win) => {
        // Remove active class from all buttons
        const allButtons = this.windowListContainer.querySelectorAll('.window-list-button');
        allButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to this button
        button.classList.add('active');
        button.classList.remove('minimized');
      };

      // Store button reference
      this.windowList.set(windowInstance.id, button);
      this.windowListContainer.appendChild(button);

      // Add window to current workspace
      this.desktop.addWindowToWorkspace(windowInstance.id);

      // Set button as active
      button.classList.add('active');
    }

    /**
     * Remove window from window list
     */
    removeWindowFromList(windowId) {
      const button = this.windowList.get(windowId);
      if (button) {
        button.remove();
        this.windowList.delete(windowId);
      }

      // Remove from workspaces
      this.desktop.removeWindowFromWorkspaces(windowId);
    }

    /**
     * Update window list button
     */
    updateWindowButton(windowId, title) {
      const button = this.windowList.get(windowId);
      if (button) {
        const titleElement = button.querySelector('.window-list-title');
        if (titleElement) {
          titleElement.textContent = title;
        }
        button.setAttribute('title', title);
      }
    }

    /**
     * Get window list button
     */
    getWindowButton(windowId) {
      return this.windowList.get(windowId);
    }
  }

  // Export to global scope
  global.UbuntuPanels = UbuntuPanels;

})(typeof window !== 'undefined' ? window : global);
