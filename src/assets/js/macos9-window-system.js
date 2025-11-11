/**
 * Mac OS 9 Window System
 * Handles window creation, collapsing (window shade), and Mac OS 9-specific window features
 */

(function(global) {
  'use strict';

  /**
   * Mac OS 9 Window System
   * Adapter for WindowManager with Mac OS 9 specific features
   */
  class MacOS9WindowSystem {
    constructor(windowManager) {
      this.windowManager = windowManager;
      this.collapsedWindows = new Map();
    }

    /**
     * Create a Mac OS 9 style window
     * @param {Object} options - Window options
     * @returns {Window} Window instance
     */
    createWindow(options) {
      const window = this.windowManager.createWindow(options);
      
      // Add Mac OS 9 specific features
      this._setupWindowShade(window);
      this._setupCollapseBox(window);
      this._setupZoomBox(window);
      
      return window;
    }

    /**
     * Setup window shade (double-click titlebar to collapse)
     * @param {Window} window - Window instance
     * @private
     */
    _setupWindowShade(window) {
      const titlebar = window.element.querySelector('.window-titlebar');
      if (!titlebar) return;

      let clickCount = 0;
      let clickTimer = null;

      titlebar.addEventListener('mousedown', (e) => {
        // Only respond to clicks on the titlebar itself, not buttons
        if (e.target.classList.contains('window-btn')) return;
        if (e.target.closest('.window-controls')) return;

        clickCount++;

        if (clickCount === 1) {
          clickTimer = setTimeout(() => {
            clickCount = 0;
          }, 300);
        } else if (clickCount === 2) {
          clearTimeout(clickTimer);
          clickCount = 0;
          this._toggleWindowShade(window);
        }
      });
    }

    /**
     * Toggle window shade (collapse to titlebar only)
     * @param {Window} window - Window instance
     * @private
     */
    _toggleWindowShade(window) {
      const isCollapsed = window.element.classList.contains('collapsed');

      if (isCollapsed) {
        // Expand window
        const originalHeight = this.collapsedWindows.get(window.id);
        if (originalHeight) {
          window.element.style.height = originalHeight + 'px';
          window.element.classList.remove('collapsed');
          this.collapsedWindows.delete(window.id);
        }
      } else {
        // Collapse window (window shade)
        const currentHeight = window.element.offsetHeight;
        this.collapsedWindows.set(window.id, currentHeight);
        window.element.classList.add('collapsed');
        
        // Animate collapse
        window.element.style.transition = 'height 0.2s ease-out';
        setTimeout(() => {
          window.element.style.transition = '';
        }, 200);
      }
    }

    /**
     * Setup collapse box (minimize button)
     * @param {Window} window - Window instance
     * @private
     */
    _setupCollapseBox(window) {
      const minimizeBtn = window.element.querySelector('.window-btn-minimize');
      if (!minimizeBtn) return;

      // Override default minimize behavior
      minimizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._toggleWindowShade(window);
      });
    }

    /**
     * Setup zoom box (maximize button with toggle behavior)
     * @param {Window} window - Window instance
     * @private
     */
    _setupZoomBox(window) {
      const maximizeBtn = window.element.querySelector('.window-btn-maximize');
      if (!maximizeBtn) return;

      let standardSize = null;

      maximizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        const isMaximized = window.element.classList.contains('maximized');
        
        if (isMaximized) {
          // Restore to standard size
          if (standardSize) {
            window.element.style.width = standardSize.width + 'px';
            window.element.style.height = standardSize.height + 'px';
            window.element.style.left = standardSize.left + 'px';
            window.element.style.top = standardSize.top + 'px';
          }
          window.element.classList.remove('maximized');
        } else {
          // Save standard size
          standardSize = {
            width: window.element.offsetWidth,
            height: window.element.offsetHeight,
            left: window.element.offsetLeft,
            top: window.element.offsetTop
          };
          
          // Zoom to fit content (or maximize)
          const container = window.element.parentElement;
          const margin = 40;
          window.element.style.width = (container.offsetWidth - margin * 2) + 'px';
          window.element.style.height = (container.offsetHeight - margin * 2) + 'px';
          window.element.style.left = margin + 'px';
          window.element.style.top = margin + 'px';
          window.element.classList.add('maximized');
        }
      });
    }

    /**
     * Close a window
     * @param {string} windowId - Window ID
     */
    closeWindow(windowId) {
      this.collapsedWindows.delete(windowId);
      this.windowManager.closeWindow(windowId);
    }

    /**
     * Get active window
     * @returns {Window|null} Active window
     */
    getActiveWindow() {
      return this.windowManager.activeWindow;
    }

    /**
     * Focus a window
     * @param {string} windowId - Window ID
     */
    focusWindow(windowId) {
      this.windowManager.focusWindow(windowId);
    }
  }

  // Export to global scope
  global.MacOS9WindowSystem = MacOS9WindowSystem;

})(typeof window !== 'undefined' ? window : global);
