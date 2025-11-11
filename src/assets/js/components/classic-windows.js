/**
 * Classic Windows Window System (Windows 95/98/2000/XP)
 * Implements the iconic 3D raised borders with highlight/shadow effects
 * Features: Classic gray title bars, gradient options, standard control buttons
 */

(function(global) {
  'use strict';

  /**
   * Classic Windows style window system
   * Supports Windows 95 (thick borders) and Windows 2000 (thin borders) modes
   * @class
   */
  class ClassicWindowsSystem {
    constructor(options = {}) {
      this.windows = new Map();
      this.zIndexCounter = 1000;
      this.activeWindow = null;
      this.container = null;

      // Theme configuration
      this.theme = {
        style: options.style || 'win95', // 'win95', 'win98', 'win2000', 'winxp'
        titleBarGradient: options.titleBarGradient !== false,
        borderWidth: options.borderWidth || (options.style === 'win95' ? 3 : 2),
        colors: {
          titleBarActive: options.colors?.titleBarActive || '#000080',
          titleBarInactive: options.colors?.titleBarInactive || '#808080',
          titleBarTextActive: options.colors?.titleBarTextActive || '#ffffff',
          titleBarTextInactive: options.colors?.titleBarTextInactive || '#c0c0c0',
          border: options.colors?.border || '#c0c0c0',
          borderHighlight: options.colors?.borderHighlight || '#ffffff',
          borderShadow: options.colors?.borderShadow || '#808080',
          borderDarkShadow: options.colors?.borderDarkShadow || '#000000',
          background: options.colors?.background || '#c0c0c0',
          ...options.colors
        }
      };

      this._injectStyles();
    }

    /**
     * Inject CSS styles for classic Windows windows
     * @private
     */
    _injectStyles() {
      if (document.getElementById('classic-windows-styles')) return;

      const style = document.createElement('style');
      style.id = 'classic-windows-styles';
      style.textContent = `
        .classic-window {
          position: absolute;
          display: flex;
          flex-direction: column;
          background: ${this.theme.colors.background};
          box-shadow:
            inset 1px 1px 0 ${this.theme.colors.borderHighlight},
            inset 2px 2px 0 ${this.theme.colors.borderHighlight},
            inset -1px -1px 0 ${this.theme.colors.borderDarkShadow},
            inset -2px -2px 0 ${this.theme.colors.borderShadow},
            ${this.theme.borderWidth}px ${this.theme.borderWidth}px 10px rgba(0,0,0,0.3);
          border: ${this.theme.borderWidth}px solid ${this.theme.colors.border};
          min-width: 200px;
          min-height: 150px;
          font-family: 'Tahoma', 'MS Sans Serif', Arial, sans-serif;
          font-size: 11px;
          user-select: none;
          overflow: hidden;
        }

        .classic-window.active .classic-titlebar {
          background: ${this.theme.colors.titleBarActive};
          ${this.theme.titleBarGradient ? `
            background: linear-gradient(90deg,
              ${this.theme.colors.titleBarActive} 0%,
              #1084d0 100%);
          ` : ''}
          color: ${this.theme.colors.titleBarTextActive};
        }

        .classic-window:not(.active) .classic-titlebar {
          background: ${this.theme.colors.titleBarInactive};
          color: ${this.theme.colors.titleBarTextInactive};
        }

        .classic-window.dragging {
          opacity: 0.8;
          cursor: move;
        }

        .classic-window.minimized {
          display: none;
        }

        .classic-window.maximized {
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          height: 100% !important;
        }

        .classic-titlebar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2px 4px;
          height: 24px;
          cursor: move;
          font-weight: bold;
          font-size: 11px;
        }

        .classic-titlebar-icon {
          width: 16px;
          height: 16px;
          margin-right: 4px;
          flex-shrink: 0;
        }

        .classic-titlebar-text {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          letter-spacing: 0.5px;
        }

        .classic-titlebar-controls {
          display: flex;
          gap: 2px;
          flex-shrink: 0;
        }

        .classic-control-btn {
          width: 16px;
          height: 14px;
          border: 1px solid transparent;
          background: ${this.theme.colors.background};
          box-shadow:
            inset -1px -1px 0 #000000,
            inset 1px 1px 0 #ffffff,
            inset -2px -2px 0 #808080,
            inset 2px 2px 0 #dfdfdf;
          font-size: 9px;
          line-height: 1;
          padding: 0;
          cursor: pointer;
          font-family: 'Marlett', 'Webdings', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .classic-control-btn:hover {
          background: #d8d8d8;
        }

        .classic-control-btn:active {
          box-shadow:
            inset 1px 1px 0 #000000,
            inset -1px -1px 0 #ffffff,
            inset 2px 2px 0 #808080,
            inset -2px -2px 0 #dfdfdf;
          padding-left: 1px;
          padding-top: 1px;
        }

        .classic-menu-bar {
          display: flex;
          background: ${this.theme.colors.background};
          border-bottom: 1px solid ${this.theme.colors.borderShadow};
          padding: 2px 4px;
          gap: 8px;
          font-size: 11px;
        }

        .classic-menu-item {
          padding: 2px 6px;
          cursor: pointer;
          border: 1px solid transparent;
        }

        .classic-menu-item:hover {
          border: 1px solid #0a246a;
          background: #0a246a;
          color: white;
        }

        .classic-window-content {
          flex: 1;
          overflow: auto;
          background: white;
          position: relative;
        }

        .classic-resize-handle {
          position: absolute;
          width: 12px;
          height: 12px;
          cursor: nwse-resize;
        }

        .classic-resize-n { top: 0; left: 50%; transform: translateX(-50%); width: 100%; height: 4px; cursor: ns-resize; }
        .classic-resize-ne { top: 0; right: 0; cursor: nesw-resize; }
        .classic-resize-e { top: 50%; right: 0; transform: translateY(-50%); width: 4px; height: 100%; cursor: ew-resize; }
        .classic-resize-se { bottom: 0; right: 0; cursor: nwse-resize; }
        .classic-resize-s { bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; height: 4px; cursor: ns-resize; }
        .classic-resize-sw { bottom: 0; left: 0; cursor: nesw-resize; }
        .classic-resize-w { top: 50%; left: 0; transform: translateY(-50%); width: 4px; height: 100%; cursor: ew-resize; }
        .classic-resize-nw { top: 0; left: 0; cursor: nwse-resize; }

        .classic-status-bar {
          height: 20px;
          background: ${this.theme.colors.background};
          border-top: 1px solid ${this.theme.colors.borderHighlight};
          display: flex;
          align-items: center;
          padding: 2px 4px;
          font-size: 11px;
        }
      `;
      document.head.appendChild(style);
    }

    /**
     * Create a classic Windows style window
     * @param {Object} options - Window configuration
     * @param {string} options.id - Unique window identifier
     * @param {string} options.title - Window title
     * @param {string} options.content - Window content HTML
     * @param {string} options.icon - Icon SVG or URL
     * @param {number} [options.width=400] - Window width
     * @param {number} [options.height=300] - Window height
     * @param {number} [options.x] - X position
     * @param {number} [options.y] - Y position
     * @param {boolean} [options.resizable=true] - Enable resizing
     * @param {boolean} [options.minimizable=true] - Enable minimize button
     * @param {boolean} [options.maximizable=true] - Enable maximize button
     * @param {Array} [options.menuItems] - Menu bar items
     * @param {string} [options.statusBar] - Status bar text
     * @param {Function} [options.onClose] - Close callback
     * @param {Function} [options.onFocus] - Focus callback
     * @returns {HTMLElement} Window element
     */
    createWindow(options) {
      const {
        id = `classic-window-${Date.now()}`,
        title = 'Untitled',
        content = '',
        icon = null,
        width = 400,
        height = 300,
        x = null,
        y = null,
        resizable = true,
        minimizable = true,
        maximizable = true,
        menuItems = [],
        statusBar = '',
        onClose = null,
        onFocus = null,
        onMinimize = null,
        onMaximize = null
      } = options;

      // Create window element
      const windowEl = document.createElement('div');
      windowEl.className = 'classic-window';
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
      titleBar.className = 'classic-titlebar';
      titleBar.id = `${id}-title`;

      if (icon) {
        const iconEl = document.createElement('div');
        iconEl.className = 'classic-titlebar-icon';
        iconEl.innerHTML = icon;
        titleBar.appendChild(iconEl);
      }

      const titleText = document.createElement('div');
      titleText.className = 'classic-titlebar-text';
      titleText.textContent = title;
      titleBar.appendChild(titleText);

      // Control buttons
      const controls = document.createElement('div');
      controls.className = 'classic-titlebar-controls';

      if (minimizable) {
        const minBtn = document.createElement('button');
        minBtn.className = 'classic-control-btn';
        minBtn.innerHTML = '0'; // Marlett font character for minimize
        minBtn.setAttribute('aria-label', 'Minimize');
        minBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this._minimizeWindow(id);
        });
        controls.appendChild(minBtn);
      }

      if (maximizable) {
        const maxBtn = document.createElement('button');
        maxBtn.className = 'classic-control-btn';
        maxBtn.innerHTML = '1'; // Marlett font character for maximize
        maxBtn.setAttribute('aria-label', 'Maximize');
        maxBtn.setAttribute('data-action', 'maximize');
        maxBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this._toggleMaximize(id);
        });
        controls.appendChild(maxBtn);
      }

      const closeBtn = document.createElement('button');
      closeBtn.className = 'classic-control-btn';
      closeBtn.innerHTML = 'r'; // Marlett font character for close
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._closeWindow(id);
      });
      controls.appendChild(closeBtn);

      titleBar.appendChild(controls);
      windowEl.appendChild(titleBar);

      // Menu bar (optional)
      if (menuItems.length > 0) {
        const menuBar = document.createElement('div');
        menuBar.className = 'classic-menu-bar';
        menuBar.setAttribute('role', 'menubar');

        menuItems.forEach(item => {
          const menuItem = document.createElement('div');
          menuItem.className = 'classic-menu-item';
          menuItem.textContent = item.label;
          menuItem.setAttribute('role', 'menuitem');
          if (item.onClick) {
            menuItem.addEventListener('click', item.onClick);
          }
          menuBar.appendChild(menuItem);
        });

        windowEl.appendChild(menuBar);
      }

      // Content area
      const contentEl = document.createElement('div');
      contentEl.className = 'classic-window-content';
      contentEl.innerHTML = content;
      windowEl.appendChild(contentEl);

      // Status bar (optional)
      if (statusBar) {
        const statusEl = document.createElement('div');
        statusEl.className = 'classic-status-bar';
        statusEl.textContent = statusBar;
        windowEl.appendChild(statusEl);
      }

      // Resize handles
      if (resizable) {
        const directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
        directions.forEach(dir => {
          const handle = document.createElement('div');
          handle.className = `classic-resize-handle classic-resize-${dir}`;
          handle.setAttribute('data-direction', dir);
          windowEl.appendChild(handle);
        });
        this._makeResizable(windowEl);
      }

      // Make draggable
      this._makeDraggable(windowEl, titleBar);

      // Store window data
      this.windows.set(id, {
        element: windowEl,
        title,
        icon,
        onClose,
        onFocus,
        onMinimize,
        onMaximize,
        isMinimized: false,
        isMaximized: false,
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
      const existingStyle = document.getElementById('classic-windows-styles');
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
        if (e.target.closest('.classic-titlebar-controls')) return;

        const windowData = this.windows.get(windowEl.id);
        if (windowData?.isMaximized) return;

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

        // Keep window in viewport
        newLeft = Math.max(-windowEl.offsetWidth + 100, Math.min(newLeft, window.innerWidth - 100));
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

      // Double-click to maximize
      titleBar.addEventListener('dblclick', (e) => {
        if (e.target.closest('.classic-titlebar-controls')) return;
        const windowData = this.windows.get(windowEl.id);
        if (windowData?.onMaximize !== false) {
          this._toggleMaximize(windowEl.id);
        }
      });
    }

    /**
     * Make window resizable
     * @private
     */
    _makeResizable(windowEl) {
      let isResizing = false;
      let resizeDirection = null;
      let startX, startY, startWidth, startHeight, startLeft, startTop;

      const handles = windowEl.querySelectorAll('.classic-resize-handle');
      handles.forEach(handle => {
        handle.addEventListener('mousedown', (e) => {
          const windowData = this.windows.get(windowEl.id);
          if (windowData?.isMaximized) return;

          isResizing = true;
          resizeDirection = handle.getAttribute('data-direction');
          startX = e.clientX;
          startY = e.clientY;
          startWidth = windowEl.offsetWidth;
          startHeight = windowEl.offsetHeight;
          startLeft = windowEl.offsetLeft;
          startTop = windowEl.offsetTop;
          e.preventDefault();
          e.stopPropagation();
        });
      });

      document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;
        let newLeft = startLeft;
        let newTop = startTop;

        if (resizeDirection.includes('e')) {
          newWidth = Math.max(200, startWidth + deltaX);
        }
        if (resizeDirection.includes('w')) {
          newWidth = Math.max(200, startWidth - deltaX);
          newLeft = startLeft + (startWidth - newWidth);
        }
        if (resizeDirection.includes('s')) {
          newHeight = Math.max(150, startHeight + deltaY);
        }
        if (resizeDirection.includes('n')) {
          newHeight = Math.max(150, startHeight - deltaY);
          newTop = startTop + (startHeight - newHeight);
        }

        windowEl.style.width = `${newWidth}px`;
        windowEl.style.height = `${newHeight}px`;
        windowEl.style.left = `${newLeft}px`;
        windowEl.style.top = `${newTop}px`;
      });

      document.addEventListener('mouseup', () => {
        isResizing = false;
        resizeDirection = null;
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
     * Minimize a window
     * @private
     */
    _minimizeWindow(id) {
      const windowData = this.windows.get(id);
      if (!windowData) return;

      windowData.isMinimized = true;
      windowData.element.classList.add('minimized');

      if (windowData.onMinimize) {
        windowData.onMinimize();
      }
    }

    /**
     * Restore a minimized window
     */
    restoreWindow(id) {
      const windowData = this.windows.get(id);
      if (!windowData) return;

      windowData.isMinimized = false;
      windowData.element.classList.remove('minimized');
      this._focusWindow(id);
    }

    /**
     * Toggle maximize state
     * @private
     */
    _toggleMaximize(id) {
      const windowData = this.windows.get(id);
      if (!windowData) return;

      const windowEl = windowData.element;
      const maxBtn = windowEl.querySelector('[data-action="maximize"]');

      if (windowData.isMaximized) {
        // Restore
        windowEl.classList.remove('maximized');
        if (windowData.previousState) {
          windowEl.style.left = windowData.previousState.left;
          windowEl.style.top = windowData.previousState.top;
          windowEl.style.width = windowData.previousState.width;
          windowEl.style.height = windowData.previousState.height;
        }
        windowData.isMaximized = false;
        if (maxBtn) maxBtn.innerHTML = '1';
      } else {
        // Maximize
        windowData.previousState = {
          left: windowEl.style.left,
          top: windowEl.style.top,
          width: windowEl.style.width,
          height: windowEl.style.height
        };
        windowEl.classList.add('maximized');
        windowData.isMaximized = true;
        if (maxBtn) maxBtn.innerHTML = '2'; // Marlett restore character
      }

      if (windowData.onMaximize) {
        windowData.onMaximize(windowData.isMaximized);
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
  global.ClassicWindowsSystem = ClassicWindowsSystem;

})(typeof window !== 'undefined' ? window : global);
