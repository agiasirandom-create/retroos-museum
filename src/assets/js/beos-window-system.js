/**
 * BeOS Window System
 * Implements the iconic yellow-tab window system unique to BeOS
 * Features: tabs on any edge, distinctive resize handle, clean borders
 */

(function(global) {
  'use strict';

  /**
   * BeOS Window System
   * Extends the base window manager with BeOS-specific yellow tab behavior
   */
  class BeOSWindowSystem {
    constructor() {
      this.windows = new Map();
      this.zIndexCounter = 1000;
      this.activeWindow = null;
      this.tabPositions = ['top', 'bottom', 'left', 'right'];
      this.nextTabPosition = 0;
    }

    /**
     * Create a BeOS window with yellow tab
     * @param {Object} options - Window configuration
     * @returns {HTMLElement} Window element
     */
    createWindow(options) {
      const {
        id = `beos-window-${Date.now()}`,
        title = 'Untitled',
        width = 400,
        height = 300,
        x = null,
        y = null,
        content = '',
        resizable = true,
        tabPosition = 'top',
        onClose = null,
        onFocus = null,
        menuItems = []
      } = options;

      // Create window element
      const windowEl = document.createElement('div');
      windowEl.className = 'beos-window';
      windowEl.id = id;
      windowEl.setAttribute('role', 'dialog');
      windowEl.setAttribute('aria-label', title);
      windowEl.style.width = `${width}px`;
      windowEl.style.height = `${height}px`;

      // Position window (center if not specified)
      if (x !== null && y !== null) {
        windowEl.style.left = `${x}px`;
        windowEl.style.top = `${y}px`;
      } else {
        windowEl.style.left = `${(window.innerWidth - width) / 2}px`;
        windowEl.style.top = `${(window.innerHeight - height) / 2}px`;
      }

      // Create the iconic yellow tab
      const tab = this._createTab(title, tabPosition);
      windowEl.appendChild(tab);

      // Create menu bar if specified
      if (menuItems.length > 0) {
        const menuBar = this._createMenuBar(menuItems);
        windowEl.appendChild(menuBar);
      }

      // Create content area
      const contentEl = document.createElement('div');
      contentEl.className = 'beos-window-content';
      contentEl.innerHTML = content;
      windowEl.appendChild(contentEl);

      // Add resize handle
      if (resizable) {
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'beos-resize-handle';
        windowEl.appendChild(resizeHandle);
        this._makeResizable(windowEl, resizeHandle);
      }

      // Make window draggable
      this._makeDraggable(windowEl, tab);

      // Store window data
      this.windows.set(id, {
        element: windowEl,
        title,
        tabPosition,
        onClose,
        onFocus,
        minimized: false
      });

      // Set up event handlers
      windowEl.addEventListener('mousedown', () => this.focusWindow(id));

      // Set initial z-index and focus
      this.focusWindow(id);

      return windowEl;
    }

    /**
     * Create the iconic yellow tab
     * @private
     */
    _createTab(title, position) {
      const tab = document.createElement('div');
      tab.className = `beos-window-tab tab-${position}`;
      tab.setAttribute('role', 'banner');

      const titleSpan = document.createElement('span');
      titleSpan.className = 'beos-window-tab-title';
      titleSpan.textContent = title;
      tab.appendChild(titleSpan);

      // Control buttons
      const controls = document.createElement('div');
      controls.className = 'beos-window-tab-controls';

      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.className = 'beos-tab-btn';
      closeBtn.innerHTML = '×';
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._handleClose(tab.closest('.beos-window'));
      });

      // Zoom button (maximize)
      const zoomBtn = document.createElement('button');
      zoomBtn.className = 'beos-tab-btn';
      zoomBtn.innerHTML = '▢';
      zoomBtn.setAttribute('aria-label', 'Zoom');
      zoomBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._handleZoom(tab.closest('.beos-window'));
      });

      // Minimize button
      const minBtn = document.createElement('button');
      minBtn.className = 'beos-tab-btn';
      minBtn.innerHTML = '_';
      minBtn.setAttribute('aria-label', 'Minimize');
      minBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._handleMinimize(tab.closest('.beos-window'));
      });

      controls.appendChild(minBtn);
      controls.appendChild(zoomBtn);
      controls.appendChild(closeBtn);
      tab.appendChild(controls);

      return tab;
    }

    /**
     * Create menu bar
     * @private
     */
    _createMenuBar(items) {
      const menuBar = document.createElement('div');
      menuBar.className = 'beos-menubar';
      menuBar.setAttribute('role', 'menubar');

      items.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'beos-menu-item';
        menuItem.textContent = item.label;
        menuItem.setAttribute('role', 'menuitem');
        if (item.onClick) {
          menuItem.addEventListener('click', item.onClick);
        }
        menuBar.appendChild(menuItem);
      });

      return menuBar;
    }

    /**
     * Make window draggable by tab
     * @private
     */
    _makeDraggable(windowEl, tab) {
      let isDragging = false;
      let offsetX, offsetY;

      tab.addEventListener('mousedown', (e) => {
        if (e.target.closest('.beos-tab-btn')) return;

        isDragging = true;
        offsetX = e.clientX - windowEl.offsetLeft;
        offsetY = e.clientY - windowEl.offsetTop;
        windowEl.style.cursor = 'move';
        document.body.classList.add('dragging');
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        // Keep window within viewport
        newX = Math.max(0, Math.min(newX, window.innerWidth - windowEl.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - windowEl.offsetHeight));

        windowEl.style.left = `${newX}px`;
        windowEl.style.top = `${newY}px`;
      });

      document.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          windowEl.style.cursor = '';
          document.body.classList.remove('dragging');
        }
      });
    }

    /**
     * Make window resizable
     * @private
     */
    _makeResizable(windowEl, handle) {
      let isResizing = false;
      let startX, startY, startWidth, startHeight;

      handle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = windowEl.offsetWidth;
        startHeight = windowEl.offsetHeight;
        document.body.classList.add('resizing');
        e.preventDefault();
      });

      document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        const newWidth = Math.max(200, startWidth + deltaX);
        const newHeight = Math.max(100, startHeight + deltaY);

        windowEl.style.width = `${newWidth}px`;
        windowEl.style.height = `${newHeight}px`;
      });

      document.addEventListener('mouseup', () => {
        if (isResizing) {
          isResizing = false;
          document.body.classList.remove('resizing');
        }
      });
    }

    /**
     * Focus a window
     */
    focusWindow(id) {
      const windowData = this.windows.get(id);
      if (!windowData) return;

      // Remove active class from all windows
      this.windows.forEach((data, windowId) => {
        data.element.classList.remove('active');
      });

      // Add active class to this window
      windowData.element.classList.add('active');
      windowData.element.style.zIndex = ++this.zIndexCounter;
      this.activeWindow = id;

      // Call onFocus callback
      if (windowData.onFocus) {
        windowData.onFocus();
      }

      // Update deskbar
      if (global.beosDesktop && global.beosDesktop.deskbar) {
        global.beosDesktop.deskbar.updateAppTabs();
      }
    }

    /**
     * Close window
     * @private
     */
    _handleClose(windowEl) {
      const id = windowEl.id;
      const windowData = this.windows.get(id);

      if (windowData && windowData.onClose) {
        windowData.onClose();
      }

      windowEl.remove();
      this.windows.delete(id);

      // Update deskbar
      if (global.beosDesktop && global.beosDesktop.deskbar) {
        global.beosDesktop.deskbar.updateAppTabs();
      }
    }

    /**
     * Minimize window
     * @private
     */
    _handleMinimize(windowEl) {
      const id = windowEl.id;
      const windowData = this.windows.get(id);

      if (windowData) {
        windowData.minimized = true;
        windowEl.classList.add('minimized');
      }

      // Update deskbar
      if (global.beosDesktop && global.beosDesktop.deskbar) {
        global.beosDesktop.deskbar.updateAppTabs();
      }
    }

    /**
     * Restore minimized window
     */
    restoreWindow(id) {
      const windowData = this.windows.get(id);
      if (!windowData) return;

      windowData.minimized = false;
      windowData.element.classList.remove('minimized');
      this.focusWindow(id);
    }

    /**
     * Zoom (maximize) window
     * @private
     */
    _handleZoom(windowEl) {
      const id = windowEl.id;
      const windowData = this.windows.get(id);

      if (!windowData) return;

      if (windowData.maximized) {
        // Restore
        windowEl.style.left = windowData.restoreLeft;
        windowEl.style.top = windowData.restoreTop;
        windowEl.style.width = windowData.restoreWidth;
        windowEl.style.height = windowData.restoreHeight;
        windowData.maximized = false;
      } else {
        // Maximize
        windowData.restoreLeft = windowEl.style.left;
        windowData.restoreTop = windowEl.style.top;
        windowData.restoreWidth = windowEl.style.width;
        windowData.restoreHeight = windowEl.style.height;

        windowEl.style.left = '0';
        windowEl.style.top = '20px'; // Below deskbar
        windowEl.style.width = '100%';
        windowEl.style.height = 'calc(100% - 20px)';
        windowData.maximized = true;
      }
    }

    /**
     * Get window by ID
     */
    getWindow(id) {
      return this.windows.get(id);
    }

    /**
     * Get all windows
     */
    getAllWindows() {
      return Array.from(this.windows.values());
    }

    /**
     * Get next tab position (for cascading windows)
     */
    getNextTabPosition() {
      const position = this.tabPositions[this.nextTabPosition];
      this.nextTabPosition = (this.nextTabPosition + 1) % this.tabPositions.length;
      return position;
    }
  }

  // Export to global scope
  global.BeOSWindowSystem = BeOSWindowSystem;

})(window);
