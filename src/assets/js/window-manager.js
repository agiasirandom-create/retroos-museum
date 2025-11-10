/**
 * Window Manager System
 * Manages draggable, resizable windows with z-index stacking
 * Compatible with IE11+, Edge, Chrome, Firefox, Safari
 */

(function(global) {
  'use strict';

  /**
   * Window Manager - Orchestrates all window instances
   * @class
   */
  class WindowManager {
    constructor() {
      this.windows = new Map();
      this.zIndexCounter = 1000;
      this.activeWindow = null;
      this.container = null;
      this.initialized = false;
    }

    /**
     * Initialize the window manager
     * @param {HTMLElement|string} container - Container element or selector
     * @returns {WindowManager} Instance for chaining
     */
    init(container) {
      if (this.initialized) return this;

      this.container = typeof container === 'string'
        ? document.querySelector(container)
        : container || document.body;

      if (!this.container) {
        throw new Error('Window manager container not found');
      }

      // Add keyboard listener for global shortcuts
      document.addEventListener('keydown', this._handleGlobalKeydown.bind(this));

      this.initialized = true;
      return this;
    }

    /**
     * Create a new window
     * @param {Object} options - Window configuration
     * @param {string} options.id - Unique window identifier
     * @param {string} options.title - Window title
     * @param {string} options.content - Window content HTML
     * @param {number} [options.width=400] - Window width in pixels
     * @param {number} [options.height=300] - Window height in pixels
     * @param {number} [options.x] - Initial X position (centered if omitted)
     * @param {number} [options.y] - Initial Y position (centered if omitted)
     * @param {boolean} [options.resizable=true] - Enable resizing
     * @param {boolean} [options.maximizable=true] - Enable maximize button
     * @param {boolean} [options.minimizable=true] - Enable minimize button
     * @param {boolean} [options.modal=false] - Modal window (blocks interaction with others)
     * @param {Function} [options.onClose] - Callback when window closes
     * @param {Function} [options.onFocus] - Callback when window gains focus
     * @returns {Window} Created window instance
     */
    createWindow(options) {
      if (!this.initialized) {
        throw new Error('WindowManager not initialized. Call init() first.');
      }

      const id = options.id || `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      if (this.windows.has(id)) {
        console.warn(`Window with id "${id}" already exists. Focusing existing window.`);
        return this.windows.get(id).focus();
      }

      const windowInstance = new Window(this, options);
      this.windows.set(id, windowInstance);
      this.container.appendChild(windowInstance.element);

      // Focus the new window
      windowInstance.focus();

      return windowInstance;
    }

    /**
     * Get window by ID
     * @param {string} id - Window identifier
     * @returns {Window|undefined} Window instance
     */
    getWindow(id) {
      return this.windows.get(id);
    }

    /**
     * Get all windows
     * @returns {Array<Window>} Array of window instances
     */
    getAllWindows() {
      return Array.from(this.windows.values());
    }

    /**
     * Close window by ID
     * @param {string} id - Window identifier
     */
    closeWindow(id) {
      const window = this.windows.get(id);
      if (window) {
        window.close();
      }
    }

    /**
     * Close all windows
     */
    closeAll() {
      this.windows.forEach(window => window.close());
    }

    /**
     * Minimize all windows
     */
    minimizeAll() {
      this.windows.forEach(window => window.minimize());
    }

    /**
     * Get next z-index value
     * @returns {number} Next z-index
     */
    _getNextZIndex() {
      return ++this.zIndexCounter;
    }

    /**
     * Set active window
     * @param {Window} window - Window to activate
     */
    _setActiveWindow(window) {
      if (this.activeWindow === window) return;

      // Deactivate previous window
      if (this.activeWindow) {
        this.activeWindow.element.classList.remove('active');
      }

      this.activeWindow = window;

      if (window) {
        window.element.classList.add('active');
        window.element.style.zIndex = this._getNextZIndex();
      }
    }

    /**
     * Remove window from management
     * @param {string} id - Window identifier
     */
    _removeWindow(id) {
      const window = this.windows.get(id);
      if (window) {
        if (this.activeWindow === window) {
          this.activeWindow = null;
        }
        this.windows.delete(id);
      }
    }

    /**
     * Handle global keyboard shortcuts
     * @param {KeyboardEvent} e - Keyboard event
     */
    _handleGlobalKeydown(e) {
      // Alt+F4 - Close active window
      if (e.altKey && e.key === 'F4') {
        e.preventDefault();
        if (this.activeWindow) {
          this.activeWindow.close();
        }
      }

      // Alt+Tab - Cycle through windows (basic implementation)
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        const windows = this.getAllWindows().filter(w => !w.isMinimized);
        if (windows.length > 1) {
          const currentIndex = windows.indexOf(this.activeWindow);
          const nextIndex = (currentIndex + 1) % windows.length;
          windows[nextIndex].focus();
        }
      }
    }

    /**
     * Load window state from localStorage
     * @param {string} id - Window identifier
     * @returns {Object|null} Saved window state
     */
    loadWindowState(id) {
      try {
        const state = localStorage.getItem(`window-state-${id}`);
        return state ? JSON.parse(state) : null;
      } catch (e) {
        console.warn('Failed to load window state:', e);
        return null;
      }
    }

    /**
     * Save window state to localStorage
     * @param {string} id - Window identifier
     * @param {Object} state - Window state to save
     */
    saveWindowState(id, state) {
      try {
        localStorage.setItem(`window-state-${id}`, JSON.stringify(state));
      } catch (e) {
        console.warn('Failed to save window state:', e);
      }
    }
  }

  /**
   * Individual Window Instance
   * @class
   */
  class Window {
    constructor(manager, options) {
      this.manager = manager;
      this.id = options.id || `window-${Date.now()}`;
      this.title = options.title || 'Untitled Window';
      this.content = options.content || '';

      // Window properties
      this.width = options.width || 400;
      this.height = options.height || 300;
      this.minWidth = options.minWidth || 200;
      this.minHeight = options.minHeight || 150;
      this.x = options.x;
      this.y = options.y;

      // Feature flags
      this.resizable = options.resizable !== false;
      this.maximizable = options.maximizable !== false;
      this.minimizable = options.minimizable !== false;
      this.modal = options.modal || false;

      // State
      this.isMaximized = false;
      this.isMinimized = false;
      this.previousState = null;

      // Callbacks
      this.onClose = options.onClose;
      this.onFocus = options.onFocus;
      this.onMinimize = options.onMinimize;
      this.onMaximize = options.onMaximize;

      // Drag state
      this.isDragging = false;
      this.isResizing = false;
      this.dragStartX = 0;
      this.dragStartY = 0;
      this.dragStartWindowX = 0;
      this.dragStartWindowY = 0;
      this.resizeDirection = null;

      // Build the window
      this._build();
      this._loadState();
      this._attachEventListeners();
    }

    /**
     * Build window DOM structure
     * @private
     */
    _build() {
      // Create main window element
      this.element = document.createElement('div');
      this.element.className = 'os-window';
      this.element.setAttribute('data-window-id', this.id);
      this.element.setAttribute('role', 'dialog');
      this.element.setAttribute('aria-labelledby', `${this.id}-title`);

      if (this.modal) {
        this.element.classList.add('modal');
        this.element.setAttribute('aria-modal', 'true');
      }

      // Title bar
      const titleBar = document.createElement('div');
      titleBar.className = 'window-titlebar';

      const titleText = document.createElement('div');
      titleText.className = 'window-title';
      titleText.id = `${this.id}-title`;
      titleText.textContent = this.title;

      const controls = document.createElement('div');
      controls.className = 'window-controls';

      // Control buttons
      if (this.minimizable) {
        this.minimizeBtn = this._createButton('minimize', 'Minimize', '−');
        controls.appendChild(this.minimizeBtn);
      }

      if (this.maximizable) {
        this.maximizeBtn = this._createButton('maximize', 'Maximize', '□');
        controls.appendChild(this.maximizeBtn);
      }

      this.closeBtn = this._createButton('close', 'Close', '×');
      controls.appendChild(this.closeBtn);

      titleBar.appendChild(titleText);
      titleBar.appendChild(controls);

      // Content area
      const contentArea = document.createElement('div');
      contentArea.className = 'window-content';
      contentArea.innerHTML = this.content;

      // Resize handles (if resizable)
      if (this.resizable) {
        this.resizeHandles = this._createResizeHandles();
      }

      // Assemble window
      this.element.appendChild(titleBar);
      this.element.appendChild(contentArea);

      if (this.resizable) {
        this.resizeHandles.forEach(handle => this.element.appendChild(handle));
      }

      // Store references
      this.titleBar = titleBar;
      this.contentArea = contentArea;

      // Set initial size and position
      this._setSize(this.width, this.height);
      this._setPosition(this.x, this.y);
    }

    /**
     * Create control button
     * @private
     */
    _createButton(type, label, symbol) {
      const btn = document.createElement('button');
      btn.className = `window-btn window-btn-${type}`;
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
      btn.textContent = symbol;
      return btn;
    }

    /**
     * Create resize handles
     * @private
     */
    _createResizeHandles() {
      const directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
      return directions.map(dir => {
        const handle = document.createElement('div');
        handle.className = `resize-handle resize-${dir}`;
        handle.setAttribute('data-direction', dir);
        return handle;
      });
    }

    /**
     * Attach event listeners
     * @private
     */
    _attachEventListeners() {
      // Title bar drag
      this.titleBar.addEventListener('mousedown', this._onDragStart.bind(this));
      this.titleBar.addEventListener('dblclick', this._onTitleBarDoubleClick.bind(this));

      // Window focus
      this.element.addEventListener('mousedown', this._onWindowMouseDown.bind(this));

      // Control buttons
      if (this.minimizeBtn) {
        this.minimizeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.minimize();
        });
      }

      if (this.maximizeBtn) {
        this.maximizeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleMaximize();
        });
      }

      this.closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.close();
      });

      // Resize handles
      if (this.resizable && this.resizeHandles) {
        this.resizeHandles.forEach(handle => {
          handle.addEventListener('mousedown', this._onResizeStart.bind(this));
        });
      }
    }

    /**
     * Handle window mousedown for focus
     * @private
     */
    _onWindowMouseDown(e) {
      this.focus();
    }

    /**
     * Handle drag start
     * @private
     */
    _onDragStart(e) {
      if (e.target.closest('.window-controls')) return;
      if (this.isMaximized) return;

      e.preventDefault();
      this.isDragging = true;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
      this.dragStartWindowX = this.x;
      this.dragStartWindowY = this.y;

      this.element.classList.add('dragging');

      document.addEventListener('mousemove', this._onDragMove.bind(this));
      document.addEventListener('mouseup', this._onDragEnd.bind(this));
    }

    /**
     * Handle drag move
     * @private
     */
    _onDragMove(e) {
      if (!this.isDragging) return;

      const deltaX = e.clientX - this.dragStartX;
      const deltaY = e.clientY - this.dragStartY;

      let newX = this.dragStartWindowX + deltaX;
      let newY = this.dragStartWindowY + deltaY;

      // Keep window in viewport
      newX = this._constrainX(newX);
      newY = this._constrainY(newY);

      this._setPosition(newX, newY);
    }

    /**
     * Handle drag end
     * @private
     */
    _onDragEnd(e) {
      if (!this.isDragging) return;

      this.isDragging = false;
      this.element.classList.remove('dragging');

      document.removeEventListener('mousemove', this._onDragMove.bind(this));
      document.removeEventListener('mouseup', this._onDragEnd.bind(this));

      this._saveState();
    }

    /**
     * Handle title bar double click
     * @private
     */
    _onTitleBarDoubleClick(e) {
      if (e.target.closest('.window-controls')) return;
      if (this.maximizable) {
        this.toggleMaximize();
      }
    }

    /**
     * Handle resize start
     * @private
     */
    _onResizeStart(e) {
      e.preventDefault();
      e.stopPropagation();

      this.isResizing = true;
      this.resizeDirection = e.target.getAttribute('data-direction');
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
      this.resizeStartWidth = this.width;
      this.resizeStartHeight = this.height;
      this.resizeStartX = this.x;
      this.resizeStartY = this.y;

      this.element.classList.add('resizing');

      document.addEventListener('mousemove', this._onResizeMove.bind(this));
      document.addEventListener('mouseup', this._onResizeEnd.bind(this));
    }

    /**
     * Handle resize move
     * @private
     */
    _onResizeMove(e) {
      if (!this.isResizing) return;

      const deltaX = e.clientX - this.dragStartX;
      const deltaY = e.clientY - this.dragStartY;

      let newWidth = this.resizeStartWidth;
      let newHeight = this.resizeStartHeight;
      let newX = this.resizeStartX;
      let newY = this.resizeStartY;

      const dir = this.resizeDirection;

      // Horizontal resize
      if (dir.includes('e')) {
        newWidth = Math.max(this.minWidth, this.resizeStartWidth + deltaX);
      } else if (dir.includes('w')) {
        const minDelta = this.minWidth - this.resizeStartWidth;
        const constrainedDelta = Math.max(minDelta, deltaX);
        newWidth = this.resizeStartWidth - constrainedDelta;
        newX = this.resizeStartX + constrainedDelta;
      }

      // Vertical resize
      if (dir.includes('s')) {
        newHeight = Math.max(this.minHeight, this.resizeStartHeight + deltaY);
      } else if (dir.includes('n')) {
        const minDelta = this.minHeight - this.resizeStartHeight;
        const constrainedDelta = Math.max(minDelta, deltaY);
        newHeight = this.resizeStartHeight - constrainedDelta;
        newY = this.resizeStartY + constrainedDelta;
      }

      // Keep window in viewport
      newX = this._constrainX(newX);
      newY = this._constrainY(newY);

      this._setSize(newWidth, newHeight);
      this._setPosition(newX, newY);
    }

    /**
     * Handle resize end
     * @private
     */
    _onResizeEnd(e) {
      if (!this.isResizing) return;

      this.isResizing = false;
      this.element.classList.remove('resizing');

      document.removeEventListener('mousemove', this._onResizeMove.bind(this));
      document.removeEventListener('mouseup', this._onResizeEnd.bind(this));

      this._saveState();
    }

    /**
     * Set window size
     * @private
     */
    _setSize(width, height) {
      this.width = Math.max(this.minWidth, width);
      this.height = Math.max(this.minHeight, height);
      this.element.style.width = `${this.width}px`;
      this.element.style.height = `${this.height}px`;
    }

    /**
     * Set window position
     * @private
     */
    _setPosition(x, y) {
      // Center if no position provided
      if (x === undefined || x === null) {
        x = (window.innerWidth - this.width) / 2;
      }
      if (y === undefined || y === null) {
        y = (window.innerHeight - this.height) / 2;
      }

      this.x = x;
      this.y = y;
      this.element.style.left = `${this.x}px`;
      this.element.style.top = `${this.y}px`;
    }

    /**
     * Constrain X position to viewport
     * @private
     */
    _constrainX(x) {
      const maxX = window.innerWidth - 100; // Keep at least 100px visible
      const minX = -(this.width - 100);
      return Math.max(minX, Math.min(maxX, x));
    }

    /**
     * Constrain Y position to viewport
     * @private
     */
    _constrainY(y) {
      const maxY = window.innerHeight - 40; // Keep title bar visible
      const minY = 0;
      return Math.max(minY, Math.min(maxY, y));
    }

    /**
     * Focus this window
     * @returns {Window} Instance for chaining
     */
    focus() {
      if (this.isMinimized) {
        this.restore();
      }

      this.manager._setActiveWindow(this);

      if (this.onFocus) {
        this.onFocus(this);
      }

      return this;
    }

    /**
     * Minimize window
     * @returns {Window} Instance for chaining
     */
    minimize() {
      if (this.isMinimized) return this;

      this.isMinimized = true;
      this.element.classList.add('minimized');
      this.element.setAttribute('aria-hidden', 'true');

      if (this.onMinimize) {
        this.onMinimize(this);
      }

      return this;
    }

    /**
     * Restore minimized window
     * @returns {Window} Instance for chaining
     */
    restore() {
      if (!this.isMinimized && !this.isMaximized) return this;

      if (this.isMinimized) {
        this.isMinimized = false;
        this.element.classList.remove('minimized');
        this.element.removeAttribute('aria-hidden');
      }

      if (this.isMaximized) {
        this.isMaximized = false;
        this.element.classList.remove('maximized');

        // Restore previous size and position
        if (this.previousState) {
          this._setSize(this.previousState.width, this.previousState.height);
          this._setPosition(this.previousState.x, this.previousState.y);
        }
      }

      this.focus();
      return this;
    }

    /**
     * Maximize window
     * @returns {Window} Instance for chaining
     */
    maximize() {
      if (this.isMaximized) return this;

      // Save current state
      this.previousState = {
        width: this.width,
        height: this.height,
        x: this.x,
        y: this.y
      };

      this.isMaximized = true;
      this.element.classList.add('maximized');

      // Fill viewport
      this._setSize(window.innerWidth, window.innerHeight);
      this._setPosition(0, 0);

      if (this.maximizeBtn) {
        this.maximizeBtn.textContent = '❐';
        this.maximizeBtn.setAttribute('title', 'Restore');
      }

      if (this.onMaximize) {
        this.onMaximize(this);
      }

      return this;
    }

    /**
     * Toggle maximize state
     * @returns {Window} Instance for chaining
     */
    toggleMaximize() {
      if (this.isMaximized) {
        this.restore();
      } else {
        this.maximize();
      }
      return this;
    }

    /**
     * Close window
     */
    close() {
      // Call callback
      if (this.onClose) {
        const shouldClose = this.onClose(this);
        if (shouldClose === false) return; // Cancel close
      }

      // Remove from DOM
      this.element.classList.add('closing');

      setTimeout(() => {
        this.element.remove();
        this.manager._removeWindow(this.id);
      }, 200); // Match CSS animation duration
    }

    /**
     * Update window content
     * @param {string} content - New content HTML
     * @returns {Window} Instance for chaining
     */
    setContent(content) {
      this.content = content;
      this.contentArea.innerHTML = content;
      return this;
    }

    /**
     * Update window title
     * @param {string} title - New title
     * @returns {Window} Instance for chaining
     */
    setTitle(title) {
      this.title = title;
      const titleElement = this.element.querySelector('.window-title');
      if (titleElement) {
        titleElement.textContent = title;
      }
      return this;
    }

    /**
     * Load window state from storage
     * @private
     */
    _loadState() {
      const state = this.manager.loadWindowState(this.id);
      if (state) {
        this._setSize(state.width || this.width, state.height || this.height);
        this._setPosition(state.x, state.y);
      }
    }

    /**
     * Save window state to storage
     * @private
     */
    _saveState() {
      if (this.isMaximized || this.isMinimized) return;

      this.manager.saveWindowState(this.id, {
        width: this.width,
        height: this.height,
        x: this.x,
        y: this.y
      });
    }
  }

  // Export to global scope
  global.WindowManager = WindowManager;
  global.Window = Window;

})(typeof window !== 'undefined' ? window : global);
