/**
 * Windows 95 Taskbar
 * Manages taskbar window buttons and interactions
 */

(function(global) {
  'use strict';

  class Win95Taskbar {
    constructor(windowManager) {
      this.windowManager = windowManager;
      this.windowButtons = new Map();
      this.container = null;
    }

    /**
     * Initialize taskbar
     */
    init() {
      this.container = document.getElementById('taskbar-windows');
      if (!this.container) {
        console.error('Taskbar windows container not found');
        return;
      }

      // Monitor existing windows
      this.windowManager.getAllWindows().forEach(win => {
        this.addWindow(win);
      });

      console.log('Win95Taskbar initialized');
    }

    /**
     * Add window to taskbar
     */
    addWindow(window) {
      if (this.windowButtons.has(window.id)) {
        return; // Already added
      }

      // Create taskbar button
      const button = document.createElement('button');
      button.className = 'taskbar-window-button';
      button.setAttribute('aria-label', window.title);
      button.setAttribute('data-window-id', window.id);

      // Icon (optional)
      const icon = document.createElement('span');
      icon.className = 'taskbar-window-icon';
      icon.innerHTML = '&#x1F5D7;'; // Window icon placeholder

      // Title
      const title = document.createElement('span');
      title.className = 'taskbar-window-title';
      title.textContent = window.title;

      button.appendChild(icon);
      button.appendChild(title);

      // Click to focus/restore window
      button.addEventListener('click', () => {
        if (window.isMinimized) {
          window.restore();
        } else if (this.windowManager.activeWindow === window) {
          window.minimize();
        } else {
          window.focus();
        }
      });

      // Add to container
      this.container.appendChild(button);
      this.windowButtons.set(window.id, button);

      // Update button state when window is focused
      const originalFocus = window.focus.bind(window);
      window.focus = () => {
        const result = originalFocus();
        this.updateActiveButton(window.id);
        return result;
      };

      // Update button state when window is minimized
      const originalMinimize = window.minimize.bind(window);
      window.minimize = () => {
        const result = originalMinimize();
        this.updateButtonState(window.id, false);
        return result;
      };

      // Remove button when window closes
      const originalClose = window.close.bind(window);
      window.close = () => {
        originalClose();
        this.removeWindow(window.id);
      };

      // Update title when it changes
      const originalSetTitle = window.setTitle.bind(window);
      window.setTitle = (newTitle) => {
        const result = originalSetTitle(newTitle);
        this.updateWindowTitle(window.id, newTitle);
        return result;
      };

      // Set initial active state
      if (this.windowManager.activeWindow === window) {
        button.classList.add('active');
      }
    }

    /**
     * Remove window from taskbar
     */
    removeWindow(windowId) {
      const button = this.windowButtons.get(windowId);
      if (button) {
        button.remove();
        this.windowButtons.delete(windowId);
      }
    }

    /**
     * Update active button
     */
    updateActiveButton(windowId) {
      // Remove active class from all buttons
      this.windowButtons.forEach(button => {
        button.classList.remove('active');
      });

      // Add active class to clicked button
      const button = this.windowButtons.get(windowId);
      if (button) {
        button.classList.add('active');
      }
    }

    /**
     * Update button state (for minimize/restore)
     */
    updateButtonState(windowId, isActive) {
      const button = this.windowButtons.get(windowId);
      if (button) {
        if (isActive) {
          button.classList.add('active');
        } else {
          button.classList.remove('active');
        }
      }
    }

    /**
     * Update window title in taskbar
     */
    updateWindowTitle(windowId, newTitle) {
      const button = this.windowButtons.get(windowId);
      if (button) {
        const titleElement = button.querySelector('.taskbar-window-title');
        if (titleElement) {
          titleElement.textContent = newTitle;
        }
        button.setAttribute('aria-label', newTitle);
      }
    }

    /**
     * Get all window buttons
     */
    getAllButtons() {
      return Array.from(this.windowButtons.values());
    }

    /**
     * Clear all window buttons
     */
    clear() {
      this.windowButtons.forEach(button => button.remove());
      this.windowButtons.clear();
    }
  }

  // Export to global scope
  global.Win95Taskbar = Win95Taskbar;

})(typeof window !== 'undefined' ? window : global);
