/**
 * Mac Classic Window System (Mac OS 1-9)
 * Implements the iconic Mac OS Classic window style with pinstripes and rounded corners
 * Features: Window shade, close/minimize/zoom boxes, Platinum appearance, draggable resize handle
 */

(function(global) {
  'use strict';

  /**
   * Mac Classic style window system
   * Supports Mac OS 7/8/9 Platinum appearance and earlier styles
   * @class
   */
  class MacClassicSystem {
    constructor(options = {}) {
      this.windows = new Map();
      this.zIndexCounter = 1000;
      this.activeWindow = null;
      this.container = null;

      // Theme configuration
      this.theme = {
        style: options.style || 'platinum', // 'classic', 'platinum'
        usePinstripes: options.usePinstripes !== false,
        useRoundedCorners: options.useRoundedCorners !== false,
        colors: {
          titleBarActive: options.colors?.titleBarActive || '#cccccc',
          titleBarInactive: options.colors?.titleBarInactive || '#ffffff',
          titleBarText: options.colors?.titleBarText || '#000000',
          border: options.colors?.border || '#000000',
          background: options.colors?.background || '#ffffff',
          ...options.colors
        }
      };

      this._injectStyles();
    }

    /**
     * Inject CSS styles for Mac Classic windows
     * @private
     */
    _injectStyles() {
      if (document.getElementById('mac-classic-styles')) return;

      const pinstripePattern = this.theme.usePinstripes
        ? 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.05) 1px, rgba(0,0,0,0.05) 2px)'
        : '';

      const style = document.createElement('style');
      style.id = 'mac-classic-styles';
      style.textContent = `
        .mac-classic-window {
          position: absolute;
          display: flex;
          flex-direction: column;
          background: ${this.theme.colors.background};
          border: 1px solid ${this.theme.colors.border};
          ${this.theme.useRoundedCorners ? 'border-radius: 8px;' : ''}
          box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
          min-width: 200px;
          min-height: 150px;
          font-family: 'Chicago', 'Charcoal', 'Geneva', 'Helvetica', Arial, sans-serif;
          font-size: 12px;
          user-select: none;
          overflow: hidden;
        }

        .mac-classic-window.active .mac-titlebar {
          background: ${this.theme.colors.titleBarActive};
          ${pinstripePattern ? `background-image: ${pinstripePattern};` : ''}
        }

        .mac-classic-window:not(.active) .mac-titlebar {
          background: ${this.theme.colors.titleBarInactive};
          background-image: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 1px,
            rgba(0,0,0,0.02) 1px,
            rgba(0,0,0,0.02) 2px
          );
        }

        .mac-classic-window.dragging {
          opacity: 0.8;
          cursor: move;
        }

        .mac-classic-window.minimized {
          display: none;
        }

        .mac-classic-window.collapsed {
          height: auto !important;
        }

        .mac-classic-window.collapsed .mac-window-content {
          display: none;
        }

        .mac-classic-window.collapsed .mac-resize-handle {
          display: none;
        }

        .mac-titlebar {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px 8px;
          height: 22px;
          ${this.theme.useRoundedCorners ? 'border-radius: 7px 7px 0 0;' : ''}
          cursor: move;
          position: relative;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .mac-titlebar-controls {
          position: absolute;
          left: 8px;
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .mac-window-box {
          width: 13px;
          height: 13px;
          border: 1px solid rgba(0, 0, 0, 0.4);
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
          transition: background 0.1s ease;
        }

        .mac-classic-window.active .mac-window-box {
          border-color: rgba(0, 0, 0, 0.6);
        }

        .mac-classic-window:not(.active) .mac-window-box {
          background: #e0e0e0;
          border-color: rgba(0, 0, 0, 0.3);
        }

        .mac-window-box:hover {
          background: #f0f0f0;
        }

        .mac-window-box:active {
          background: #d0d0d0;
        }

        .mac-close-box {
          position: relative;
        }

        .mac-close-box::before,
        .mac-close-box::after {
          content: '';
          position: absolute;
          width: 7px;
          height: 1px;
          background: black;
          top: 50%;
          left: 50%;
        }

        .mac-close-box::before {
          transform: translate(-50%, -50%) rotate(45deg);
        }

        .mac-close-box::after {
          transform: translate(-50%, -50%) rotate(-45deg);
        }

        .mac-collapse-box {
          position: relative;
        }

        .mac-collapse-box::after {
          content: '';
          width: 7px;
          height: 7px;
          border: 1px solid black;
          border-bottom: none;
          border-left: none;
          border-right: none;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .mac-zoom-box {
          position: relative;
        }

        .mac-zoom-box::after {
          content: '';
          width: 7px;
          height: 7px;
          border: 1px solid black;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .mac-titlebar-text {
          font-size: 12px;
          font-weight: bold;
          color: ${this.theme.colors.titleBarText};
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: calc(100% - 120px);
          text-align: center;
        }

        .mac-classic-window:not(.active) .mac-titlebar-text {
          color: #888888;
        }

        .mac-window-content {
          flex: 1;
          overflow: auto;
          background: white;
          position: relative;
        }

        .mac-resize-handle {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 15px;
          height: 15px;
          cursor: nwse-resize;
          background: linear-gradient(
            -45deg,
            transparent 0%,
            transparent 30%,
            rgba(0,0,0,0.1) 30%,
            rgba(0,0,0,0.1) 32%,
            transparent 32%,
            transparent 40%,
            rgba(0,0,0,0.1) 40%,
            rgba(0,0,0,0.1) 42%,
            transparent 42%,
            transparent 50%,
            rgba(0,0,0,0.1) 50%,
            rgba(0,0,0,0.1) 52%,
            transparent 52%
          );
          ${this.theme.useRoundedCorners ? 'border-radius: 0 0 7px 0;' : ''}
        }

        .mac-classic-window.active .mac-resize-handle {
          background: linear-gradient(
            -45deg,
            transparent 0%,
            transparent 30%,
            rgba(0,0,0,0.2) 30%,
            rgba(0,0,0,0.2) 32%,
            transparent 32%,
            transparent 40%,
            rgba(0,0,0,0.2) 40%,
            rgba(0,0,0,0.2) 42%,
            transparent 42%,
            transparent 50%,
            rgba(0,0,0,0.2) 50%,
            rgba(0,0,0,0.2) 52%,
            transparent 52%
          );
        }

        .mac-grow-icon {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 15px;
          height: 15px;
          pointer-events: none;
        }
      `;
      document.head.appendChild(style);
    }

    /**
     * Create a Mac Classic style window
     * @param {Object} options - Window configuration
     * @returns {HTMLElement} Window element
     */
    createWindow(options) {
      const {
        id = `mac-classic-window-${Date.now()}`,
        title = 'Untitled',
        content = '',
        width = 400,
        height = 300,
        x = null,
        y = null,
        resizable = true,
        closable = true,
        collapsable = true,
        zoomable = true,
        onClose = null,
        onFocus = null,
        onCollapse = null,
        onZoom = null
      } = options;

      // Create window element
      const windowEl = document.createElement('div');
      windowEl.className = 'mac-classic-window';
      windowEl.id = id;
      windowEl.setAttribute('role', 'dialog');
      windowEl.setAttribute('aria-labelledby', `${id}-title`);
      windowEl.style.width = `${width}px`;
      windowEl.style.height = `${height}px`;

      // Position window
      if (x !== null && y !== null) {
        windowEl.style.left = `${x}px`;
        windowEl.style.top = `${y}px`;
      } else {
        windowEl.style.left = `${(window.innerWidth - width) / 2}px`;
        windowEl.style.top = `${(window.innerHeight - height) / 2}px`;
      }

      // Create title bar
      const titleBar = document.createElement('div');
      titleBar.className = 'mac-titlebar';

      // Window control boxes (left side)
      const controls = document.createElement('div');
      controls.className = 'mac-titlebar-controls';

      if (closable) {
        const closeBox = document.createElement('div');
        closeBox.className = 'mac-window-box mac-close-box';
        closeBox.setAttribute('aria-label', 'Close');
        closeBox.setAttribute('title', 'Close');
        closeBox.addEventListener('click', (e) => {
          e.stopPropagation();
          this._closeWindow(id);
        });
        controls.appendChild(closeBox);
      }

      if (collapsable) {
        const collapseBox = document.createElement('div');
        collapseBox.className = 'mac-window-box mac-collapse-box';
        collapseBox.setAttribute('aria-label', 'Collapse');
        collapseBox.setAttribute('title', 'Window Shade');
        collapseBox.addEventListener('click', (e) => {
          e.stopPropagation();
          this._toggleCollapse(id);
        });
        controls.appendChild(collapseBox);
      }

      if (zoomable) {
        const zoomBox = document.createElement('div');
        zoomBox.className = 'mac-window-box mac-zoom-box';
        zoomBox.setAttribute('aria-label', 'Zoom');
        zoomBox.setAttribute('title', 'Zoom');
        zoomBox.addEventListener('click', (e) => {
          e.stopPropagation();
          this._toggleZoom(id);
        });
        controls.appendChild(zoomBox);
      }

      titleBar.appendChild(controls);

      // Title text (centered)
      const titleText = document.createElement('div');
      titleText.className = 'mac-titlebar-text';
      titleText.id = `${id}-title`;
      titleText.textContent = title;
      titleBar.appendChild(titleText);

      windowEl.appendChild(titleBar);

      // Content area
      const contentEl = document.createElement('div');
      contentEl.className = 'mac-window-content';
      contentEl.innerHTML = content;
      windowEl.appendChild(contentEl);

      // Resize handle (bottom-right corner)
      if (resizable) {
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'mac-resize-handle';
        windowEl.appendChild(resizeHandle);
        this._makeResizable(windowEl, resizeHandle);
      }

      // Make draggable
      this._makeDraggable(windowEl, titleBar);

      // Store window data
      this.windows.set(id, {
        element: windowEl,
        title,
        onClose,
        onFocus,
        onCollapse,
        onZoom,
        isCollapsed: false,
        isZoomed: false,
        previousState: null
      });

      // Focus window
      windowEl.addEventListener('mousedown', () => this._focusWindow(id));

      this._focusWindow(id);

      return windowEl;
    }

    /**
     * Set theme configuration
     * @param {Object} themeConfig - Theme colors and options
     */
    setTheme(themeConfig) {
      Object.assign(this.theme, themeConfig);
      if (themeConfig.colors) {
        Object.assign(this.theme.colors, themeConfig.colors);
      }
      // Re-inject styles with new theme
      const existingStyle = document.getElementById('mac-classic-styles');
      if (existingStyle) existingStyle.remove();
      this._injectStyles();
    }

    /**
     * Destroy a window and clean up resources
     * @param {string} id - Window identifier
     */
    destroy(id) {
      this._closeWindow(id);
    }

    /**
     * Make window draggable
     * @private
     */
    _makeDraggable(windowEl, titleBar) {
      let isDragging = false;
      let startX, startY, startLeft, startTop;

      titleBar.addEventListener('mousedown', (e) => {
        if (e.target.closest('.mac-titlebar-controls')) return;

        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = windowEl.offsetLeft;
        startTop = windowEl.offsetTop;
        windowEl.classList.add('dragging');
        e.preventDefault();
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        let newLeft = startLeft + deltaX;
        let newTop = startTop + deltaY;

        // Keep window in viewport (allow partial off-screen)
        newLeft = Math.max(-windowEl.offsetWidth + 50, Math.min(newLeft, window.innerWidth - 50));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - 40));

        windowEl.style.left = `${newLeft}px`;
        windowEl.style.top = `${newTop}px`;
      });

      document.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          windowEl.classList.remove('dragging');
        }
      });

      // Double-click title bar to collapse (window shade)
      let clickCount = 0;
      let clickTimer = null;

      titleBar.addEventListener('mousedown', (e) => {
        if (e.target.closest('.mac-titlebar-controls')) return;

        clickCount++;
        if (clickCount === 1) {
          clickTimer = setTimeout(() => {
            clickCount = 0;
          }, 300);
        } else if (clickCount === 2) {
          clearTimeout(clickTimer);
          clickCount = 0;
          this._toggleCollapse(windowEl.id);
        }
      });
    }

    /**
     * Make window resizable from bottom-right corner
     * @private
     */
    _makeResizable(windowEl, handle) {
      let isResizing = false;
      let startX, startY, startWidth, startHeight;

      handle.addEventListener('mousedown', (e) => {
        const windowData = this.windows.get(windowEl.id);
        if (windowData?.isCollapsed) return;

        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = windowEl.offsetWidth;
        startHeight = windowEl.offsetHeight;
        e.preventDefault();
        e.stopPropagation();
      });

      document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        const newWidth = Math.max(200, startWidth + deltaX);
        const newHeight = Math.max(150, startHeight + deltaY);

        windowEl.style.width = `${newWidth}px`;
        windowEl.style.height = `${newHeight}px`;
      });

      document.addEventListener('mouseup', () => {
        isResizing = false;
      });
    }

    /**
     * Focus a window
     * @private
     */
    _focusWindow(id) {
      const windowData = this.windows.get(id);
      if (!windowData) return;

      // Remove active class from all windows
      this.windows.forEach(data => data.element.classList.remove('active'));

      // Add active class and bring to front
      windowData.element.classList.add('active');
      windowData.element.style.zIndex = ++this.zIndexCounter;
      this.activeWindow = id;

      if (windowData.onFocus) {
        windowData.onFocus();
      }
    }

    /**
     * Toggle window shade (collapse/expand)
     * @private
     */
    _toggleCollapse(id) {
      const windowData = this.windows.get(id);
      if (!windowData) return;

      const windowEl = windowData.element;

      if (windowData.isCollapsed) {
        // Expand
        windowEl.classList.remove('collapsed');
        if (windowData.previousHeight) {
          windowEl.style.height = windowData.previousHeight;
        }
        windowData.isCollapsed = false;
      } else {
        // Collapse (window shade)
        windowData.previousHeight = windowEl.style.height;
        windowEl.classList.add('collapsed');
        windowData.isCollapsed = true;
      }

      if (windowData.onCollapse) {
        windowData.onCollapse(windowData.isCollapsed);
      }
    }

    /**
     * Toggle zoom (maximize/restore)
     * @private
     */
    _toggleZoom(id) {
      const windowData = this.windows.get(id);
      if (!windowData) return;

      const windowEl = windowData.element;

      if (windowData.isZoomed) {
        // Restore
        if (windowData.previousState) {
          windowEl.style.left = windowData.previousState.left;
          windowEl.style.top = windowData.previousState.top;
          windowEl.style.width = windowData.previousState.width;
          windowEl.style.height = windowData.previousState.height;
        }
        windowData.isZoomed = false;
      } else {
        // Zoom (maximize with margin)
        windowData.previousState = {
          left: windowEl.style.left,
          top: windowEl.style.top,
          width: windowEl.style.width,
          height: windowEl.style.height
        };

        const margin = 40;
        windowEl.style.left = `${margin}px`;
        windowEl.style.top = `${margin}px`;
        windowEl.style.width = `${window.innerWidth - margin * 2}px`;
        windowEl.style.height = `${window.innerHeight - margin * 2}px`;
        windowData.isZoomed = true;
      }

      if (windowData.onZoom) {
        windowData.onZoom(windowData.isZoomed);
      }
    }

    /**
     * Close a window
     * @private
     */
    _closeWindow(id) {
      const windowData = this.windows.get(id);
      if (!windowData) return;

      if (windowData.onClose) {
        const shouldClose = windowData.onClose();
        if (shouldClose === false) return;
      }

      windowData.element.remove();
      this.windows.delete(id);

      if (this.activeWindow === id) {
        this.activeWindow = null;
      }
    }

    /**
     * Get window by ID
     * @param {string} id - Window identifier
     * @returns {Object|null} Window data
     */
    getWindow(id) {
      return this.windows.get(id);
    }

    /**
     * Get all windows
     * @returns {Array} Array of window data objects
     */
    getAllWindows() {
      return Array.from(this.windows.values());
    }
  }

  // Export to global scope
  global.MacClassicSystem = MacClassicSystem;

})(typeof window !== 'undefined' ? window : global);
