/**
 * Modern Windows Window System (Windows 7/8/10/11)
 * Implements Aero Glass, flat design, and modern Windows window styles
 * Features: Blur effects, rounded corners, snap assist, transparency
 */

(function(global) {
  'use strict';

  /**
   * Modern Windows style window system
   * Supports Windows 7 (Aero), Windows 8/10 (Flat), Windows 11 (Rounded)
   * @class
   */
  class ModernWindowsSystem {
    constructor(options = {}) {
      this.windows = new Map();
      this.zIndexCounter = 1000;
      this.activeWindow = null;
      this.container = null;
      this.snapGuides = null;

      // Theme configuration
      this.theme = {
        style: options.style || 'win10', // 'win7', 'win8', 'win10', 'win11'
        accentColor: options.accentColor || '#0078d4',
        useAeroGlass: options.useAeroGlass !== false && (options.style === 'win7'),
        useRoundedCorners: options.useRoundedCorners !== false && (options.style === 'win11'),
        transparency: options.transparency ?? 0.95,
        ...options
      };

      this._injectStyles();
      this._createSnapGuides();
    }

    /**
     * Inject CSS styles for modern Windows windows
     * @private
     */
    _injectStyles() {
      if (document.getElementById('modern-windows-styles')) return;

      const isWin7 = this.theme.style === 'win7';
      const isWin11 = this.theme.style === 'win11';
      const borderRadius = isWin11 ? '8px' : '0';

      const style = document.createElement('style');
      style.id = 'modern-windows-styles';
      style.textContent = `
        .modern-window {
          position: absolute;
          display: flex;
          flex-direction: column;
          background: ${isWin7 ? 'rgba(255, 255, 255, 0.9)' : '#ffffff'};
          ${isWin7 ? `backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);` : ''}
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          border-radius: ${borderRadius};
          ${isWin11 ? 'border: 1px solid rgba(0, 0, 0, 0.08);' : ''}
          min-width: 200px;
          min-height: 150px;
          font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
          font-size: 12px;
          user-select: none;
          overflow: hidden;
          transition: box-shadow 0.2s ease;
        }

        .modern-window.active {
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
        }

        .modern-window.dragging {
          opacity: 0.9;
          cursor: move;
        }

        .modern-window.minimized {
          display: none;
        }

        .modern-window.maximized {
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          height: 100% !important;
          border-radius: 0 !important;
        }

        .modern-window.snap-preview {
          pointer-events: none;
          background: rgba(0, 120, 212, 0.3);
          border: 2px solid #0078d4;
        }

        .modern-titlebar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: ${isWin11 ? '8px 16px' : '8px 12px'};
          height: ${isWin11 ? '40px' : '32px'};
          background: ${isWin7 ? 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(252,252,252,0.7) 100%)' : 'transparent'};
          cursor: move;
          ${isWin11 ? 'border-radius: 8px 8px 0 0;' : ''}
        }

        .modern-window.active .modern-titlebar {
          background: ${isWin7 ? 'linear-gradient(180deg, rgba(225,235,255,0.9) 0%, rgba(209,228,255,0.8) 100%)' : 'transparent'};
        }

        .modern-titlebar-icon {
          width: 16px;
          height: 16px;
          margin-right: 8px;
          flex-shrink: 0;
        }

        .modern-titlebar-text {
          flex: 1;
          font-size: ${isWin11 ? '13px' : '12px'};
          font-weight: ${isWin11 ? '600' : '400'};
          color: ${isWin11 ? '#000000' : '#1f1f1f'};
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .modern-window:not(.active) .modern-titlebar-text {
          color: #6d6d6d;
        }

        .modern-titlebar-controls {
          display: flex;
          flex-shrink: 0;
          margin-left: 8px;
        }

        .modern-control-btn {
          width: ${isWin11 ? '46px' : '45px'};
          height: ${isWin11 ? '32px' : '32px'};
          border: none;
          background: transparent;
          color: #1f1f1f;
          font-size: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.1s ease;
          ${isWin11 ? 'border-radius: 4px;' : ''}
        }

        .modern-control-btn:hover {
          background: ${isWin11 ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.1)'};
        }

        .modern-control-btn.close:hover {
          background: #e81123;
          color: white;
        }

        .modern-control-btn:active {
          background: ${isWin11 ? 'rgba(0, 0, 0, 0.08)' : 'rgba(0, 0, 0, 0.15)'};
        }

        .modern-control-btn svg {
          width: 10px;
          height: 10px;
          fill: currentColor;
        }

        .modern-window-content {
          flex: 1;
          overflow: auto;
          background: white;
          position: relative;
        }

        .modern-resize-handle {
          position: absolute;
          z-index: 10;
        }

        .modern-resize-n { top: 0; left: 0; width: 100%; height: 4px; cursor: ns-resize; }
        .modern-resize-ne { top: 0; right: 0; width: 12px; height: 12px; cursor: nesw-resize; }
        .modern-resize-e { top: 0; right: 0; width: 4px; height: 100%; cursor: ew-resize; }
        .modern-resize-se { bottom: 0; right: 0; width: 12px; height: 12px; cursor: nwse-resize; }
        .modern-resize-s { bottom: 0; left: 0; width: 100%; height: 4px; cursor: ns-resize; }
        .modern-resize-sw { bottom: 0; left: 0; width: 12px; height: 12px; cursor: nesw-resize; }
        .modern-resize-w { top: 0; left: 0; width: 4px; height: 100%; cursor: ew-resize; }
        .modern-resize-nw { top: 0; left: 0; width: 12px; height: 12px; cursor: nwse-resize; }

        .snap-guide {
          position: fixed;
          background: rgba(0, 120, 212, 0.2);
          border: 2px solid #0078d4;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s ease;
          z-index: 9999;
        }

        .snap-guide.active {
          opacity: 1;
        }
      `;
      document.head.appendChild(style);
    }

    /**
     * Create snap assist guide elements
     * @private
     */
    _createSnapGuides() {
      if (this.snapGuides) return;

      this.snapGuides = {
        left: this._createSnapGuide(),
        right: this._createSnapGuide(),
        top: this._createSnapGuide()
      };

      document.body.appendChild(this.snapGuides.left);
      document.body.appendChild(this.snapGuides.right);
      document.body.appendChild(this.snapGuides.top);
    }

    /**
     * Create a single snap guide element
     * @private
     */
    _createSnapGuide() {
      const guide = document.createElement('div');
      guide.className = 'snap-guide';
      return guide;
    }

    /**
     * Show snap guide
     * @private
     */
    _showSnapGuide(position) {
      const guide = this.snapGuides[position];
      if (!guide) return;

      guide.classList.add('active');

      switch (position) {
        case 'left':
          guide.style.left = '0';
          guide.style.top = '0';
          guide.style.width = '50%';
          guide.style.height = '100%';
          break;
        case 'right':
          guide.style.right = '0';
          guide.style.top = '0';
          guide.style.width = '50%';
          guide.style.height = '100%';
          break;
        case 'top':
          guide.style.left = '0';
          guide.style.top = '0';
          guide.style.width = '100%';
          guide.style.height = '100%';
          break;
      }
    }

    /**
     * Hide all snap guides
     * @private
     */
    _hideSnapGuides() {
      Object.values(this.snapGuides).forEach(guide => {
        guide.classList.remove('active');
      });
    }

    /**
     * Create a modern Windows style window
     * @param {Object} options - Window configuration
     * @returns {HTMLElement} Window element
     */
    createWindow(options) {
      const {
        id = `modern-window-${Date.now()}`,
        title = 'Untitled',
        content = '',
        icon = null,
        width = 600,
        height = 400,
        x = null,
        y = null,
        resizable = true,
        minimizable = true,
        maximizable = true,
        onClose = null,
        onFocus = null,
        onMinimize = null,
        onMaximize = null
      } = options;

      // Create window element
      const windowEl = document.createElement('div');
      windowEl.className = 'modern-window';
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
      titleBar.className = 'modern-titlebar';
      titleBar.id = `${id}-title`;

      if (icon) {
        const iconEl = document.createElement('div');
        iconEl.className = 'modern-titlebar-icon';
        iconEl.innerHTML = icon;
        titleBar.appendChild(iconEl);
      }

      const titleText = document.createElement('div');
      titleText.className = 'modern-titlebar-text';
      titleText.textContent = title;
      titleBar.appendChild(titleText);

      // Control buttons
      const controls = document.createElement('div');
      controls.className = 'modern-titlebar-controls';

      if (minimizable) {
        const minBtn = document.createElement('button');
        minBtn.className = 'modern-control-btn minimize';
        minBtn.innerHTML = `<svg viewBox="0 0 12 12"><rect x="0" y="5" width="10" height="1"/></svg>`;
        minBtn.setAttribute('aria-label', 'Minimize');
        minBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this._minimizeWindow(id);
        });
        controls.appendChild(minBtn);
      }

      if (maximizable) {
        const maxBtn = document.createElement('button');
        maxBtn.className = 'modern-control-btn maximize';
        maxBtn.innerHTML = `<svg viewBox="0 0 12 12"><rect x="1" y="1" width="9" height="9" fill="none" stroke="currentColor" stroke-width="1"/></svg>`;
        maxBtn.setAttribute('aria-label', 'Maximize');
        maxBtn.setAttribute('data-action', 'maximize');
        maxBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this._toggleMaximize(id);
        });
        controls.appendChild(maxBtn);
      }

      const closeBtn = document.createElement('button');
      closeBtn.className = 'modern-control-btn close';
      closeBtn.innerHTML = `<svg viewBox="0 0 12 12"><path d="M1 1 L11 11 M11 1 L1 11" stroke="currentColor" stroke-width="1" fill="none"/></svg>`;
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._closeWindow(id);
      });
      controls.appendChild(closeBtn);

      titleBar.appendChild(controls);
      windowEl.appendChild(titleBar);

      // Content area
      const contentEl = document.createElement('div');
      contentEl.className = 'modern-window-content';
      contentEl.innerHTML = content;
      windowEl.appendChild(contentEl);

      // Resize handles
      if (resizable) {
        const directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
        directions.forEach(dir => {
          const handle = document.createElement('div');
          handle.className = `modern-resize-handle modern-resize-${dir}`;
          handle.setAttribute('data-direction', dir);
          windowEl.appendChild(handle);
        });
        this._makeResizable(windowEl);
      }

      // Make draggable with snap assist
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
      // Re-inject styles with new theme
      const existingStyle = document.getElementById('modern-windows-styles');
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
     * Make window draggable with snap assist
     * @private
     */
    _makeDraggable(windowEl, titleBar) {
      let isDragging = false;
      let startX, startY, startLeft, startTop;
      let snapPosition = null;

      titleBar.addEventListener('mousedown', (e) => {
        if (e.target.closest('.modern-titlebar-controls')) return;

        const windowData = this.windows.get(windowEl.id);
        if (windowData?.isMaximized) {
          // Dragging from maximized state
          this._toggleMaximize(windowEl.id);
          const newWidth = parseInt(windowEl.style.width);
          startLeft = e.clientX - (newWidth / 2);
          windowEl.style.left = `${startLeft}px`;
          windowEl.style.top = `${e.clientY - 16}px`;
        }

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

        // Snap assist detection
        const edgeThreshold = 10;
        snapPosition = null;

        if (e.clientX <= edgeThreshold) {
          snapPosition = 'left';
          this._showSnapGuide('left');
        } else if (e.clientX >= window.innerWidth - edgeThreshold) {
          snapPosition = 'right';
          this._showSnapGuide('right');
        } else if (e.clientY <= edgeThreshold) {
          snapPosition = 'top';
          this._showSnapGuide('top');
        } else {
          this._hideSnapGuides();
        }
      });

      document.addEventListener('mouseup', (e) => {
        if (!isDragging) return;

        isDragging = false;
        windowEl.classList.remove('dragging');
        this._hideSnapGuides();

        // Apply snap if detected
        if (snapPosition) {
          this._snapWindow(windowEl.id, snapPosition);
        }

        snapPosition = null;
      });

      // Double-click to maximize
      titleBar.addEventListener('dblclick', (e) => {
        if (e.target.closest('.modern-titlebar-controls')) return;
        const windowData = this.windows.get(windowEl.id);
        if (windowData?.onMaximize !== false) {
          this._toggleMaximize(windowEl.id);
        }
      });
    }

    /**
     * Snap window to screen edge
     * @private
     */
    _snapWindow(id, position) {
      const windowData = this.windows.get(id);
      if (!windowData) return;

      const windowEl = windowData.element;

      // Save current state
      windowData.previousState = {
        left: windowEl.style.left,
        top: windowEl.style.top,
        width: windowEl.style.width,
        height: windowEl.style.height
      };

      switch (position) {
        case 'left':
          windowEl.style.left = '0';
          windowEl.style.top = '0';
          windowEl.style.width = '50%';
          windowEl.style.height = '100%';
          break;
        case 'right':
          windowEl.style.left = '50%';
          windowEl.style.top = '0';
          windowEl.style.width = '50%';
          windowEl.style.height = '100%';
          break;
        case 'top':
          this._toggleMaximize(id);
          return;
      }

      windowData.isSnapped = true;
    }

    /**
     * Make window resizable
     * @private
     */
    _makeResizable(windowEl) {
      let isResizing = false;
      let resizeDirection = null;
      let startX, startY, startWidth, startHeight, startLeft, startTop;

      const handles = windowEl.querySelectorAll('.modern-resize-handle');
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
        if (maxBtn) {
          maxBtn.innerHTML = `<svg viewBox="0 0 12 12"><rect x="1" y="1" width="9" height="9" fill="none" stroke="currentColor" stroke-width="1"/></svg>`;
        }
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
        if (maxBtn) {
          maxBtn.innerHTML = `<svg viewBox="0 0 12 12"><rect x="1" y="1" width="7" height="7" fill="none" stroke="currentColor" stroke-width="1"/><rect x="3" y="3" width="7" height="7" fill="white" stroke="currentColor" stroke-width="1"/></svg>`;
        }
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
  global.ModernWindowsSystem = ModernWindowsSystem;

})(typeof window !== 'undefined' ? window : global);
