/**
 * UNIX Window System (CDE, Motif, X11)
 * Implements classic UNIX window manager styles
 * Features: CDE, Motif 3D borders, simple X11 decorations, virtual desktop support
 */

(function(global) {
  'use strict';

  /**
   * UNIX style window system
   * Supports CDE (Common Desktop Environment), Motif, and basic X11 styles
   * @class
   */
  class UnixWindowsSystem {
    constructor(options = {}) {
      this.windows = new Map();
      this.zIndexCounter = 1000;
      this.activeWindow = null;
      this.container = null;

      // Theme configuration
      this.theme = {
        style: options.style || 'cde', // 'cde', 'motif', 'x11'
        focusMode: options.focusMode || 'click', // 'click' or 'follow-mouse'
        virtualDesktop: options.virtualDesktop ?? 1,
        colors: {
          background: options.colors?.background || '#5b7e95',
          titleBarActive: options.colors?.titleBarActive || '#5b7e95',
          titleBarInactive: options.colors?.titleBarInactive || '#7a96a7',
          border: options.colors?.border || '#e0e0e0',
          borderShadow: options.colors?.borderShadow || '#000000',
          text: options.colors?.text || '#ffffff',
          ...options.colors
        }
      };

      this._injectStyles();
      this._setupFocusMode();
    }

    /**
     * Setup focus mode (click-to-focus or focus-follows-mouse)
     * @private
     */
    _setupFocusMode() {
      if (this.theme.focusMode === 'follow-mouse') {
        document.addEventListener('mouseover', (e) => {
          const windowEl = e.target.closest('.unix-window');
          if (windowEl) {
            this._focusWindow(windowEl.id);
          }
        });
      }
    }

    /**
     * Inject CSS styles for UNIX windows
     * @private
     */
    _injectStyles() {
      if (document.getElementById('unix-windows-styles')) return;

      const isCDE = this.theme.style === 'cde';
      const isMotif = this.theme.style === 'motif';

      const style = document.createElement('style');
      style.id = 'unix-windows-styles';
      style.textContent = `
        .unix-window {
          position: absolute;
          display: flex;
          flex-direction: column;
          background: ${this.theme.colors.background};
          box-shadow:
            ${isCDE || isMotif ? `
            inset 2px 2px 0 rgba(255, 255, 255, 0.7),
            inset -2px -2px 0 rgba(0, 0, 0, 0.5),
            ` : ''}
            3px 3px 8px rgba(0, 0, 0, 0.4);
          border: ${isCDE || isMotif ? '2px solid' : '1px solid'} ${this.theme.colors.border};
          min-width: 200px;
          min-height: 150px;
          font-family: 'Lucida Sans', 'Helvetica', 'Arial', sans-serif;
          font-size: 12px;
          user-select: none;
          overflow: hidden;
        }

        .unix-window.dragging {
          opacity: 0.8;
          cursor: move;
        }

        .unix-window.minimized {
          display: none;
        }

        .unix-window.maximized {
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          height: 100% !important;
        }

        .unix-titlebar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: ${isCDE ? '4px 6px' : '3px 5px'};
          height: ${isCDE ? '28px' : '24px'};
          cursor: move;
          ${isCDE || isMotif ? `
            box-shadow:
              inset 1px 1px 0 rgba(255, 255, 255, 0.8),
              inset -1px -1px 0 rgba(0, 0, 0, 0.6);
          ` : ''}
        }

        .unix-window.active .unix-titlebar {
          background: ${this.theme.colors.titleBarActive};
          color: ${this.theme.colors.text};
        }

        .unix-window:not(.active) .unix-titlebar {
          background: ${this.theme.colors.titleBarInactive};
          color: rgba(255, 255, 255, 0.7);
        }

        .unix-titlebar-left {
          display: flex;
          align-items: center;
          gap: 6px;
          flex: 1;
          min-width: 0;
        }

        .unix-titlebar-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .unix-titlebar-text {
          font-size: 12px;
          font-weight: bold;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }

        .unix-titlebar-controls {
          display: flex;
          gap: ${isCDE ? '4px' : '2px'};
          flex-shrink: 0;
        }

        .unix-control-btn {
          width: ${isCDE ? '20px' : '18px'};
          height: ${isCDE ? '20px' : '18px'};
          border: ${isCDE || isMotif ? '2px' : '1px'} solid transparent;
          background: ${this.theme.colors.background};
          ${isCDE || isMotif ? `
            box-shadow:
              inset 1px 1px 0 rgba(255, 255, 255, 0.8),
              inset -1px -1px 0 rgba(0, 0, 0, 0.6);
          ` : 'border: 1px solid rgba(255, 255, 255, 0.3);'}
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: white;
          font-weight: bold;
        }

        .unix-control-btn:hover {
          background: ${isCDE ? '#6b8ea5' : 'rgba(255, 255, 255, 0.1)'};
        }

        .unix-control-btn:active {
          ${isCDE || isMotif ? `
            box-shadow:
              inset -1px -1px 0 rgba(255, 255, 255, 0.8),
              inset 1px 1px 0 rgba(0, 0, 0, 0.6);
          ` : ''}
        }

        .unix-menu-bar {
          display: flex;
          background: ${this.theme.colors.background};
          padding: 2px 4px;
          gap: 4px;
          font-size: 12px;
          ${isCDE || isMotif ? `
            box-shadow:
              inset 1px 1px 0 rgba(255, 255, 255, 0.5),
              inset -1px -1px 0 rgba(0, 0, 0, 0.3);
          ` : ''}
          border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        }

        .unix-menu-item {
          padding: 3px 8px;
          cursor: pointer;
          color: white;
          border: 1px solid transparent;
        }

        .unix-menu-item:hover {
          ${isCDE || isMotif ? `
            box-shadow:
              inset 1px 1px 0 rgba(255, 255, 255, 0.8),
              inset -1px -1px 0 rgba(0, 0, 0, 0.6);
          ` : 'background: rgba(255, 255, 255, 0.1);'}
        }

        .unix-window-content {
          flex: 1;
          overflow: auto;
          background: white;
          position: relative;
        }

        .unix-resize-handle {
          position: absolute;
          z-index: 10;
        }

        .unix-resize-n { top: 0; left: 0; width: 100%; height: 4px; cursor: ns-resize; }
        .unix-resize-ne { top: 0; right: 0; width: 12px; height: 12px; cursor: nesw-resize; }
        .unix-resize-e { top: 0; right: 0; width: 4px; height: 100%; cursor: ew-resize; }
        .unix-resize-se { bottom: 0; right: 0; width: 12px; height: 12px; cursor: nwse-resize; }
        .unix-resize-s { bottom: 0; left: 0; width: 100%; height: 4px; cursor: ns-resize; }
        .unix-resize-sw { bottom: 0; left: 0; width: 12px; height: 12px; cursor: nesw-resize; }
        .unix-resize-w { top: 0; left: 0; width: 4px; height: 100%; cursor: ew-resize; }
        .unix-resize-nw { top: 0; left: 0; width: 12px; height: 12px; cursor: nwse-resize; }

        .unix-virtual-desktop-indicator {
          position: fixed;
          bottom: 10px;
          right: 10px;
          display: flex;
          gap: 4px;
          background: rgba(0, 0, 0, 0.5);
          padding: 6px;
          border-radius: 4px;
          z-index: 10000;
        }

        .unix-desktop-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          cursor: pointer;
        }

        .unix-desktop-dot.active {
          background: rgba(255, 255, 255, 1);
        }
      `;
      document.head.appendChild(style);
    }

    /**
     * Create a UNIX style window
     * @param {Object} options - Window configuration
     * @returns {HTMLElement} Window element
     */
    createWindow(options) {
      const {
        id = `unix-window-${Date.now()}`,
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
        virtualDesktop = this.theme.virtualDesktop,
        onClose = null,
        onFocus = null,
        onMinimize = null,
        onMaximize = null
      } = options;

      // Create window element
      const windowEl = document.createElement('div');
      windowEl.className = 'unix-window';
      windowEl.id = id;
      windowEl.setAttribute('role', 'dialog');
      windowEl.setAttribute('aria-labelledby', `${id}-title`);
      windowEl.setAttribute('data-virtual-desktop', virtualDesktop);
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
      titleBar.className = 'unix-titlebar';

      const titleLeft = document.createElement('div');
      titleLeft.className = 'unix-titlebar-left';

      if (icon) {
        const iconEl = document.createElement('div');
        iconEl.className = 'unix-titlebar-icon';
        iconEl.innerHTML = icon;
        titleLeft.appendChild(iconEl);
      }

      const titleText = document.createElement('div');
      titleText.className = 'unix-titlebar-text';
      titleText.id = `${id}-title`;
      titleText.textContent = title;
      titleLeft.appendChild(titleText);

      titleBar.appendChild(titleLeft);

      // Control buttons
      const controls = document.createElement('div');
      controls.className = 'unix-titlebar-controls';

      if (minimizable) {
        const minBtn = document.createElement('button');
        minBtn.className = 'unix-control-btn';
        minBtn.innerHTML = '_';
        minBtn.setAttribute('aria-label', 'Minimize');
        minBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this._minimizeWindow(id);
        });
        controls.appendChild(minBtn);
      }

      if (maximizable) {
        const maxBtn = document.createElement('button');
        maxBtn.className = 'unix-control-btn';
        maxBtn.innerHTML = '□';
        maxBtn.setAttribute('aria-label', 'Maximize');
        maxBtn.setAttribute('data-action', 'maximize');
        maxBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this._toggleMaximize(id);
        });
        controls.appendChild(maxBtn);
      }

      const closeBtn = document.createElement('button');
      closeBtn.className = 'unix-control-btn';
      closeBtn.innerHTML = 'X';
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
        menuBar.className = 'unix-menu-bar';
        menuBar.setAttribute('role', 'menubar');

        menuItems.forEach(item => {
          const menuItem = document.createElement('div');
          menuItem.className = 'unix-menu-item';
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
      contentEl.className = 'unix-window-content';
      contentEl.innerHTML = content;
      windowEl.appendChild(contentEl);

      // Resize handles
      if (resizable) {
        const directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
        directions.forEach(dir => {
          const handle = document.createElement('div');
          handle.className = `unix-resize-handle unix-resize-${dir}`;
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
        virtualDesktop,
        onClose,
        onFocus,
        onMinimize,
        onMaximize,
        isMinimized: false,
        isMaximized: false,
        previousState: null
      });

      // Focus window (click-to-focus mode)
      if (this.theme.focusMode === 'click') {
        windowEl.addEventListener('mousedown', () => this._focusWindow(id));
      }

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
      const existingStyle = document.getElementById('unix-windows-styles');
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
     * Switch to virtual desktop
     * @param {number} desktopNum - Desktop number (1-4)
     */
    switchVirtualDesktop(desktopNum) {
      this.theme.virtualDesktop = desktopNum;

      this.windows.forEach((data, id) => {
        const windowEl = data.element;
        if (data.virtualDesktop === desktopNum) {
          windowEl.style.display = '';
        } else {
          windowEl.style.display = 'none';
        }
      });
    }

    /**
     * Make window draggable
     * @private
     */
    _makeDraggable(windowEl, titleBar) {
      let isDragging = false;
      let startX, startY, startLeft, startTop;

      titleBar.addEventListener('mousedown', (e) => {
        if (e.target.closest('.unix-titlebar-controls')) return;

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
        if (e.target.closest('.unix-titlebar-controls')) return;
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

      const handles = windowEl.querySelectorAll('.unix-resize-handle');
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
        if (maxBtn) maxBtn.innerHTML = '□';
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
        if (maxBtn) maxBtn.innerHTML = '❐';
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

    /**
     * Get windows for current virtual desktop
     * @returns {Array} Array of window data objects
     */
    getVisibleWindows() {
      return Array.from(this.windows.values()).filter(
        data => data.virtualDesktop === this.theme.virtualDesktop
      );
    }
  }

  // Export to global scope
  global.UnixWindowsSystem = UnixWindowsSystem;

})(typeof window !== 'undefined' ? window : global);
