/**
 * Mac OS System 7 Window Adapter
 * Adapts the generic WindowManager for Mac OS System 7 style
 */

(function(global) {
  'use strict';

  /**
   * Mac OS 7 Window Adapter
   * Modifies windows to match Mac OS System 7 styling and behavior
   */
  class MacOS7WindowAdapter {
    constructor(windowManager) {
      this.windowManager = windowManager;
    }

    /**
     * Create Mac-styled window
     * @param {Object} options - Window configuration
     * @returns {Window} Window instance
     */
    createWindow(options) {
      // Mac OS 7 specific defaults
      const macOptions = Object.assign({}, options, {
        minimizable: false,
        maximizable: false,
        resizable: options.resizable !== false
      });

      const window = this.windowManager.createWindow(macOptions);

      // Apply Mac-specific styling
      this._applyMacStyling(window);

      return window;
    }

    /**
     * Apply Mac OS 7 specific styling to window
     * @param {Window} window - Window instance
     * @private
     */
    _applyMacStyling(window) {
      // Add Mac class
      window.element.classList.add('mac-window');

      // Ensure only close box is visible
      if (window.minimizeBtn) {
        window.minimizeBtn.style.display = 'none';
      }
      if (window.maximizeBtn) {
        window.maximizeBtn.style.display = 'none';
      }

      // Move close button to left side
      const controls = window.element.querySelector('.window-controls');
      if (controls) {
        controls.style.position = 'absolute';
        controls.style.left = '6px';
        controls.style.right = 'auto';
      }

      // Add grow box for resize (if resizable)
      if (window.resizable) {
        this._addGrowBox(window);
      }
    }

    /**
     * Add Mac-style grow box for resizing
     * @param {Window} window - Window instance
     * @private
     */
    _addGrowBox(window) {
      // Hide all resize handles except southeast
      const handles = window.element.querySelectorAll('.resize-handle');
      handles.forEach(handle => {
        if (!handle.classList.contains('resize-se')) {
          handle.style.display = 'none';
        }
      });
    }
  }

  // Export to global scope
  global.MacOS7WindowAdapter = MacOS7WindowAdapter;

})(typeof window !== 'undefined' ? window : global);
