/**
 * Mac Modern Window System (Mac OS X / macOS Aqua)
 * Implements the Aqua translucent windows with traffic light buttons
 * Features: Drop shadows, blur effects, brushed metal, unified toolbar, full-screen mode
 */

(function(global) {
  'use strict';

  /**
   * Mac Modern style window system (Aqua interface)
   * Supports Mac OS X 10.0 through current macOS
   * @class
   */
  class MacModernSystem {
    constructor(options = {}) {
      this.windows = new Map();
      this.zIndexCounter = 1000;
      this.activeWindow = null;
      this.container = null;

      // Theme configuration
      this.theme = {
        style: options.style || 'aqua', // 'aqua', 'brushed-metal', 'unified'
        accentColor: options.accentColor || 'blue', // 'blue', 'graphite', 'red', 'orange', 'yellow', 'green', 'purple', 'pink'
        useBlur: options.useBlur !== false,
        transparency: options.transparency ?? 0.95,
        buttonPosition: options.buttonPosition || 'left', // 'left' or 'right'
        ...options
      };

      this._injectStyles();
    }

    /**
     * Get traffic light button colors based on accent
     * @private
     */
    _getButtonColors() {
      return {
        close: '#ff5f57',
        minimize: '#febc2e',
        zoom: '#28c840'
      };
    }

    /**
     * Inject CSS styles for Mac Modern windows
     * @private
     */
    _injectStyles() {
      if (document.getElementById('mac-modern-styles')) return;

      const isBrushedMetal = this.theme.style === 'brushed-metal';
      const isUnified = this.theme.style === 'unified';
      const colors = this._getButtonColors();

      const style = document.createElement('style');
      style.id = 'mac-modern-styles';
      style.textContent = `
        .mac-modern-window {
          position: absolute;
          display: flex;
          flex-direction: column;
          background: ${isBrushedMetal ? 'linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 100%)' : 'rgba(236, 236, 236, 0.95)'};
          ${this.theme.useBlur ? 'backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px);' : ''}
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 0.5px rgba(0, 0, 0, 0.15);
          border-radius: 10px;
          min-width: 200px;
          min-height: 150px;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif;
          font-size: 13px;
          user-select: none;
          overflow: hidden;
          transition: box-shadow 0.2s ease;
        }

        .mac-modern-window.active {
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5), 0 0 0 0.5px rgba(0, 0, 0, 0.2);
        }

        .mac-modern-window.dragging {
          opacity: 0.9;
          cursor: move;
        }

        .mac-modern-window.minimized {
          display: none;
        }

        .mac-modern-window.fullscreen {
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          height: 100% !important;
          border-radius: 0 !important;
        }

        .mac-titlebar {
          display: flex;
          align-items: center;
          padding: ${isUnified ? '12px 16px' : '12px 16px'};
          height: ${isUnified ? '52px' : '40px'};
          background: ${isBrushedMetal ? 'linear-gradient(180deg, #f5f5f5 0%, #e0e0e0 100%)' : isUnified ? 'transparent' : 'rgba(255, 255, 255, 0.5)'};
          border-bottom: ${isUnified ? 'none' : '1px solid rgba(0, 0, 0, 0.1)'};
          border-radius: 10px 10px 0 0;
          cursor: move;
          position: relative;
        }

        .mac-titlebar-controls {
          display: flex;
          gap: 8px;
          align-items: center;
          position: ${this.theme.buttonPosition === 'left' ? 'absolute' : 'relative'};
          ${this.theme.buttonPosition === 'left' ? 'left: 16px;' : ''}
          ${this.theme.buttonPosition === 'right' ? 'margin-left: auto;' : ''}
        }

        .mac-traffic-light {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 0.5px solid rgba(0, 0, 0, 0.15);
          cursor: pointer;
          position: relative;
          transition: all 0.1s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mac-traffic-light::before {
          content: '';
          position: absolute;
          width: 6px;
          height: 6px;
          opacity: 0;
          transition: opacity 0.1s ease;
        }

        .mac-modern-window.active .mac-traffic-light:hover::before {
          opacity: 1;
        }

        .mac-traffic-light.close {
          background: linear-gradient(135deg, ${colors.close} 0%, #e0443e 100%);
        }

        .mac-traffic-light.close::before {
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><path d="M3 3 L9 9 M9 3 L3 9" stroke="%23000" stroke-width="1.5" stroke-linecap="round"/></svg>') center/contain no-repeat;
        }

        .mac-traffic-light.minimize {
          background: linear-gradient(135deg, ${colors.minimize} 0%, #f5a623 100%);
        }

        .mac-traffic-light.minimize::before {
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><path d="M3 6 L9 6" stroke="%23000" stroke-width="1.5" stroke-linecap="round"/></svg>') center/contain no-repeat;
        }

        .mac-traffic-light.zoom {
          background: linear-gradient(135deg, ${colors.zoom} 0%, #20a038 100%);
        }

        .mac-traffic-light.zoom::before {
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><path d="M3 3 L9 3 L9 9 L6 9 M3 6 L6 6 L6 9" stroke="%23000" stroke-width="1.2" stroke-linecap="round" fill="none"/></svg>') center/contain no-repeat;
        }

        .mac-modern-window:not(.active) .mac-traffic-light {
          background: #e0e0e0;
          border-color: rgba(0, 0, 0, 0.1);
        }

        .mac-modern-window:not(.active) .mac-traffic-light::before {
          display: none;
        }

        .mac-titlebar-text {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          font-size: 13px;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.85);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: calc(100% - 160px);
          pointer-events: none;
        }

        .mac-modern-window:not(.active) .mac-titlebar-text {
          color: rgba(0, 0, 0, 0.5);
        }

        .mac-toolbar {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          gap: 12px;
          background: ${isUnified ? 'transparent' : 'rgba(245, 245, 245, 0.95)'};
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          min-height: 44px;
        }

        .mac-toolbar-item {
          padding: 4px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.85);
          transition: background 0.1s ease;
        }

        .mac-toolbar-item:hover {
          background: rgba(0, 0, 0, 0.05);
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
          width: 16px;
          height: 16px;
          cursor: nwse-resize;
          opacity: 0.5;
          background: radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.1) 0%, transparent 70%);
        }

        .mac-modern-window.active .mac-resize-handle {
          opacity: 0.7;
        }

        .mac-resize-edge {
          position: absolute;
          z-index: 10;
        }

        .mac-resize-n { top: 0; left: 0; width: 100%; height: 6px; cursor: ns-resize; }
        .mac-resize-ne { top: 0; right: 0; width: 16px; height: 16px; cursor: nesw-resize; }
        .mac-resize-e { top: 0; right: 0; width: 6px; height: 100%; cursor: ew-resize; }
        .mac-resize-se { bottom: 0; right: 0; width: 16px; height: 16px; cursor: nwse-resize; }
        .mac-resize-s { bottom: 0; left: 0; width: 100%; height: 6px; cursor: ns-resize; }
        .mac-resize-sw { bottom: 0; left: 0; width: 16px; height: 16px; cursor: nesw-resize; }
        .mac-resize-w { top: 0; left: 0; width: 6px; height: 100%; cursor: ew-resize; }
        .mac-resize-nw { top: 0; left: 0; width: 16px; height: 16px; cursor: nwse-resize; }
      `;
      document.head.appendChild(style);
    }

    /**
     * Create a Mac Modern style window
     * @param {Object} options - Window configuration
     * @returns {HTMLElement} Window element
     */
    createWindow(options) {
      const {
        id = `mac-modern-window-${Date.now()}`,
        title = 'Untitled',
        content = '',
        width = 600,
        height = 400,
        x = null,
        y = null,
        resizable = true,
        closable = true,
        minimizable = true,
        zoomable = true,
        toolbar = null,
        onClose = null,
        onFocus = null,
        onMinimize = null,
        onZoom = null
      } = options;

      // Create window element
      const windowEl = document.createElement('div');
      windowEl.className = 'mac-modern-window';
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

      // Traffic light buttons
      const controls = document.createElement('div');
      controls.className = 'mac-titlebar-controls';

      if (closable) {
        const closeBtn = document.createElement('div');
        closeBtn.className = 'mac-traffic-light close';
        closeBtn.setAttribute('aria-label', 'Close');
        closeBtn.setAttribute('title', 'Close');
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this._closeWindow(id);
        });
        controls.appendChild(closeBtn);
      }

      if (minimizable) {
        const minimizeBtn = document.createElement('div');
        minimizeBtn.className = 'mac-traffic-light minimize';
        minimizeBtn.setAttribute('aria-label', 'Minimize');
        minimizeBtn.setAttribute('title', 'Minimize');
        minimizeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this._minimizeWindow(id);
        });
        controls.appendChild(minimizeBtn);
      }

      if (zoomable) {
        const zoomBtn = document.createElement('div');
        zoomBtn.className = 'mac-traffic-light zoom';
        zoomBtn.setAttribute('aria-label', 'Zoom');
        zoomBtn.setAttribute('title', 'Zoom');
        zoomBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this._toggleZoom(id);
        });
        controls.appendChild(zoomBtn);
      }

      titleBar.appendChild(controls);

      // Title text (centered)
      const titleText = document.createElement('div');
      titleText.className = 'mac-titlebar-text';
      titleText.id = `${id}-title`;
      titleText.textContent = title;
      titleBar.appendChild(titleText);

      windowEl.appendChild(titleBar);

      // Optional toolbar
      if (toolbar && toolbar.length > 0) {
        const toolbarEl = document.createElement('div');
        toolbarEl.className = 'mac-toolbar';
        toolbarEl.setAttribute('role', 'toolbar');

        toolbar.forEach(item => {
          const toolbarItem = document.createElement('div');
          toolbarItem.className = 'mac-toolbar-item';
          toolbarItem.textContent = item.label;
          if (item.onClick) {
            toolbarItem.addEventListener('click', item.onClick);
          }
          toolbarEl.appendChild(toolbarItem);
        });

        windowEl.appendChild(toolbarEl);
      }

      // Content area
      const contentEl = document.createElement('div');
      contentEl.className = 'mac-window-content';
      contentEl.innerHTML = content;
      windowEl.appendChild(contentEl);

      // Resize handles
      if (resizable) {
        const directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
        directions.forEach(dir => {
          const handle = document.createElement('div');
          handle.className = `mac-resize-edge mac-resize-${dir}`;
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
        onClose,
        onFocus,
        onMinimize,
        onZoom,
        isMinimized: false,
        isFullscreen: false,
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
      // Re-inject styles with new theme
      const existingStyle = document.getElementById('mac-modern-styles');
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

        const windowData = this.windows.get(windowEl.id);
        if (windowData?.isFullscreen) return;

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

      // Double-click to zoom
      titleBar.addEventListener('dblclick', (e) => {
        if (e.target.closest('.mac-titlebar-controls')) return;
        this._toggleZoom(windowEl.id);
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

      const handles = windowEl.querySelectorAll('.mac-resize-edge');
      handles.forEach(handle => {
        handle.addEventListener('mousedown', (e) => {
          const windowData = this.windows.get(windowEl.id);
          if (windowData?.isFullscreen) return;

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
     * Toggle zoom/fullscreen
     * @private
     */
    _toggleZoom(id) {
      const windowData = this.windows.get(id);
      if (!windowData) return;

      const windowEl = windowData.element;

      if (windowData.isFullscreen) {
        // Restore
        windowEl.classList.remove('fullscreen');
        if (windowData.previousState) {
          windowEl.style.left = windowData.previousState.left;
          windowEl.style.top = windowData.previousState.top;
          windowEl.style.width = windowData.previousState.width;
          windowEl.style.height = windowData.previousState.height;
        }
        windowData.isFullscreen = false;
      } else {
        // Fullscreen
        windowData.previousState = {
          left: windowEl.style.left,
          top: windowEl.style.top,
          width: windowEl.style.width,
          height: windowEl.style.height
        };
        windowEl.classList.add('fullscreen');
        windowData.isFullscreen = true;
      }

      if (windowData.onZoom) {
        windowData.onZoom(windowData.isFullscreen);
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
  global.MacModernSystem = MacModernSystem;

})(typeof window !== 'undefined' ? window : global);
