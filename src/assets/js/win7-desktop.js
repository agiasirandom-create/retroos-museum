/**
 * Windows 7 Desktop Management
 * Handles desktop initialization, icons, and window management
 */

class Win7Desktop {
  constructor() {
    this.desktop = null;
    this.iconsContainer = null;
    this.windowsContainer = null;
    this.aero = null;
    this.taskbar = null;
    this.startMenu = null;
    this.windows = new Map();
    this.nextWindowId = 1;
    this.nextZIndex = 100;

    // Desktop icons configuration
    this.desktopIcons = [
      {
        id: 'computer',
        name: 'Computer',
        icon: '💻',
        app: 'explorer',
        path: 'Computer'
      },
      {
        id: 'recycle-bin',
        name: 'Recycle Bin',
        icon: '🗑️',
        app: 'explorer',
        path: 'Recycle Bin'
      },
      {
        id: 'network',
        name: 'Network',
        icon: '🌐',
        app: 'explorer',
        path: 'Network'
      },
      {
        id: 'user-files',
        name: "User's Files",
        icon: '📁',
        app: 'explorer',
        path: 'C:\\Users\\User'
      }
    ];
  }

  /**
   * Initialize desktop
   */
  init() {
    this.desktop = document.getElementById('win7-desktop');
    this.iconsContainer = document.getElementById('desktop-icons');
    this.windowsContainer = document.getElementById('windows-container');

    if (!this.desktop) {
      console.error('Desktop element not found');
      return;
    }

    // Initialize subsystems
    this.aero = new Win7Aero();
    this.aero.init();

    this.taskbar = new Win7Taskbar(this);
    this.taskbar.init();

    this.startMenu = new Win7StartMenu(this);
    this.startMenu.init();

    // Setup desktop
    this.setupDesktopIcons();
    this.setupWindowManagement();
    this.setupContextMenu();
    this.setupKeyboardShortcuts();

    // Initialize gadgets
    if (typeof Win7Gadgets !== 'undefined') {
      this.gadgets = new Win7Gadgets();
      this.gadgets.init();
    }

    console.log('Windows 7 Desktop initialized');
  }

  /**
   * Setup desktop icons
   */
  setupDesktopIcons() {
    if (!this.iconsContainer) return;

    this.desktopIcons.forEach((iconConfig, index) => {
      const icon = this.createDesktopIcon(iconConfig, index);
      this.iconsContainer.appendChild(icon);
    });
  }

  /**
   * Create desktop icon
   * @param {Object} config - Icon configuration
   * @param {number} index - Icon index for positioning
   * @returns {HTMLElement} - Icon element
   */
  createDesktopIcon(config, index) {
    const icon = document.createElement('div');
    icon.className = 'desktop-icon';
    icon.dataset.iconId = config.id;
    icon.setAttribute('role', 'button');
    icon.setAttribute('tabindex', '0');
    icon.setAttribute('aria-label', config.name);

    // Icon image
    const iconImage = document.createElement('div');
    iconImage.className = 'desktop-icon-image';
    iconImage.textContent = config.icon;
    iconImage.style.fontSize = '48px';
    iconImage.style.lineHeight = '48px';

    // Icon label
    const iconLabel = document.createElement('div');
    iconLabel.className = 'desktop-icon-label';
    iconLabel.textContent = config.name;

    icon.appendChild(iconImage);
    icon.appendChild(iconLabel);

    // Double-click to open
    let clickCount = 0;
    let clickTimer = null;

    icon.addEventListener('click', () => {
      clickCount++;

      if (clickCount === 1) {
        // First click - select
        this.selectIcon(icon);
        clickTimer = setTimeout(() => {
          clickCount = 0;
        }, 300);
      } else if (clickCount === 2) {
        // Double click - open
        clearTimeout(clickTimer);
        clickCount = 0;
        this.openIcon(config);
      }
    });

    // Keyboard support
    icon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.openIcon(config);
      }
    });

    return icon;
  }

  /**
   * Select desktop icon
   * @param {HTMLElement} icon - Icon element
   */
  selectIcon(icon) {
    // Deselect all icons
    const allIcons = this.iconsContainer.querySelectorAll('.desktop-icon');
    allIcons.forEach(i => i.classList.remove('selected'));

    // Select this icon
    icon.classList.add('selected');
  }

  /**
   * Open desktop icon
   * @param {Object} config - Icon configuration
   */
  openIcon(config) {
    switch (config.app) {
      case 'explorer':
        this.openExplorer(config.path);
        break;
      default:
        console.log('Opening:', config.name);
    }
  }

  /**
   * Open Windows Explorer
   * @param {string} path - Initial path
   */
  openExplorer(path) {
    if (typeof Win7Explorer !== 'undefined') {
      const explorer = new Win7Explorer(this, path);
      const windowEl = this.createWindow({
        title: path,
        icon: '📁',
        width: 900,
        height: 600,
        content: explorer.render()
      });
    }
  }

  /**
   * Create window
   * @param {Object} options - Window options
   * @returns {HTMLElement} - Window element
   */
  createWindow(options) {
    const windowId = this.nextWindowId++;
    const window = document.createElement('div');
    window.className = 'win7-window active';
    window.dataset.windowId = windowId;
    window.style.zIndex = this.nextZIndex++;

    // Set dimensions and position
    const width = options.width || 800;
    const height = options.height || 600;
    const left = options.left || (window.innerWidth - width) / 2;
    const top = options.top || (window.innerHeight - 40 - height) / 2;

    window.style.width = `${width}px`;
    window.style.height = `${height}px`;
    window.style.left = `${left}px`;
    window.style.top = `${top}px`;

    // Create title bar
    const titlebar = this.createTitleBar(options);
    window.appendChild(titlebar);

    // Create content area
    const content = document.createElement('div');
    content.className = 'win7-window-content';
    if (options.content) {
      if (typeof options.content === 'string') {
        content.innerHTML = options.content;
      } else {
        content.appendChild(options.content);
      }
    }
    window.appendChild(content);

    // Add to container
    this.windowsContainer.appendChild(window);

    // Store window reference
    this.windows.set(windowId, {
      element: window,
      options: options
    });

    // Setup window interactions
    this.setupWindowDragging(window, titlebar);
    this.setupWindowResizing(window);

    // Apply Aero effects
    this.aero.applyGlassEffect(window);
    this.aero.animateWindowOpen(window);

    // Update taskbar
    this.taskbar.addWindowButton(windowId, options);

    return window;
  }

  /**
   * Create window title bar
   * @param {Object} options - Window options
   * @returns {HTMLElement} - Title bar element
   */
  createTitleBar(options) {
    const titlebar = document.createElement('div');
    titlebar.className = 'win7-titlebar';

    // Icon
    if (options.icon) {
      const icon = document.createElement('div');
      icon.className = 'win7-titlebar-icon';
      icon.textContent = options.icon;
      titlebar.appendChild(icon);
    }

    // Title text
    const title = document.createElement('div');
    title.className = 'win7-titlebar-text';
    title.textContent = options.title || 'Window';
    titlebar.appendChild(title);

    // Control buttons
    const controls = document.createElement('div');
    controls.className = 'win7-titlebar-controls';

    // Minimize button
    const minimizeBtn = this.createControlButton('minimize', '−');
    minimizeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.minimizeWindow(titlebar.parentElement);
    });
    controls.appendChild(minimizeBtn);

    // Maximize/Restore button
    const maximizeBtn = this.createControlButton('maximize', '□');
    maximizeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMaximize(titlebar.parentElement);
    });
    controls.appendChild(maximizeBtn);

    // Close button
    const closeBtn = this.createControlButton('close', '×');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeWindow(titlebar.parentElement);
    });
    controls.appendChild(closeBtn);

    titlebar.appendChild(controls);

    return titlebar;
  }

  /**
   * Create control button
   * @param {string} type - Button type
   * @param {string} symbol - Button symbol
   * @returns {HTMLElement} - Button element
   */
  createControlButton(type, symbol) {
    const button = document.createElement('button');
    button.className = `win7-control-btn ${type}`;
    button.setAttribute('aria-label', type.charAt(0).toUpperCase() + type.slice(1));
    button.textContent = symbol;
    return button;
  }

  /**
   * Setup window dragging
   * @param {HTMLElement} window - Window element
   * @param {HTMLElement} titlebar - Title bar element
   */
  setupWindowDragging(window, titlebar) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    let currentSnapZone = null;

    titlebar.addEventListener('mousedown', (e) => {
      if (e.target.closest('.win7-titlebar-controls')) return;

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = window.offsetLeft;
      startTop = window.offsetTop;

      // If window was snapped, unsnap it
      if (window.dataset.snapped) {
        this.aero.removeSnap(window);
        // Adjust position to follow cursor
        const width = parseInt(window.style.width);
        window.style.left = `${e.clientX - width / 2}px`;
        window.style.top = `${e.clientY - 10}px`;
        startLeft = window.offsetLeft;
        startTop = window.offsetTop;
      }

      this.focusWindow(window);
      document.body.classList.add('dragging');
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      window.style.left = `${startLeft + deltaX}px`;
      window.style.top = `${startTop + deltaY}px`;

      // Check for snap zones
      const snapZone = this.aero.detectSnapZone(e.clientX, e.clientY);
      if (snapZone) {
        if (snapZone !== currentSnapZone) {
          this.aero.showSnapPreview(snapZone);
          currentSnapZone = snapZone;
        }
      } else {
        this.aero.hideSnapPreview();
        currentSnapZone = null;
      }
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        document.body.classList.remove('dragging');

        // Apply snap if in snap zone
        if (currentSnapZone) {
          this.aero.applySnap(window, currentSnapZone);
          this.aero.hideSnapPreview();
          currentSnapZone = null;
        }
      }
    });

    // Double-click to maximize
    titlebar.addEventListener('dblclick', (e) => {
      if (e.target.closest('.win7-titlebar-controls')) return;
      this.toggleMaximize(window);
    });
  }

  /**
   * Setup window resizing
   * @param {HTMLElement} window - Window element
   */
  setupWindowResizing(window) {
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'win7-resize-handle';
    window.appendChild(resizeHandle);

    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    resizeHandle.addEventListener('mousedown', (e) => {
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = window.offsetWidth;
      startHeight = window.offsetHeight;
      e.preventDefault();
      document.body.classList.add('resizing');
    });

    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      const newWidth = Math.max(400, startWidth + deltaX);
      const newHeight = Math.max(300, startHeight + deltaY);

      window.style.width = `${newWidth}px`;
      window.style.height = `${newHeight}px`;
    });

    document.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        document.body.classList.remove('resizing');
      }
    });
  }

  /**
   * Focus window
   * @param {HTMLElement} window - Window element
   */
  focusWindow(window) {
    // Remove active state from all windows
    const allWindows = this.windowsContainer.querySelectorAll('.win7-window');
    allWindows.forEach(win => {
      win.classList.remove('active');
      win.classList.add('inactive');
      this.aero.applyWindowGlow(win, false);
    });

    // Activate this window
    window.classList.remove('inactive');
    window.classList.add('active');
    window.style.zIndex = this.nextZIndex++;
    this.aero.applyWindowGlow(window, true);

    // Update taskbar
    this.taskbar.setActiveWindow(parseInt(window.dataset.windowId));
  }

  /**
   * Minimize window
   * @param {HTMLElement} window - Window element
   */
  minimizeWindow(window) {
    const windowId = parseInt(window.dataset.windowId);
    const button = this.taskbar.getWindowButton(windowId);

    if (button) {
      this.aero.animateWindowMinimize(window, button);
    }
  }

  /**
   * Toggle maximize window
   * @param {HTMLElement} window - Window element
   */
  toggleMaximize(window) {
    if (window.classList.contains('maximized')) {
      // Restore
      this.restoreWindow(window);
    } else {
      // Maximize
      this.maximizeWindow(window);
    }
  }

  /**
   * Maximize window
   * @param {HTMLElement} window - Window element
   */
  maximizeWindow(window) {
    // Store original dimensions
    window.dataset.originalWidth = window.style.width;
    window.dataset.originalHeight = window.style.height;
    window.dataset.originalLeft = window.style.left;
    window.dataset.originalTop = window.style.top;

    // Maximize
    this.aero.applySnap(window, 'top');
  }

  /**
   * Restore window
   * @param {HTMLElement} window - Window element
   */
  restoreWindow(window) {
    if (window.dataset.originalWidth) {
      window.style.transition = 'all 0.2s ease';
      window.style.width = window.dataset.originalWidth;
      window.style.height = window.dataset.originalHeight;
      window.style.left = window.dataset.originalLeft;
      window.style.top = window.dataset.originalTop;

      delete window.dataset.originalWidth;
      delete window.dataset.originalHeight;
      delete window.dataset.originalLeft;
      delete window.dataset.originalTop;

      window.classList.remove('maximized');
      this.aero.removeSnap(window);

      setTimeout(() => {
        window.style.transition = '';
      }, 200);
    }
  }

  /**
   * Close window
   * @param {HTMLElement} window - Window element
   */
  closeWindow(window) {
    const windowId = parseInt(window.dataset.windowId);

    this.aero.animateWindowClose(window, () => {
      window.remove();
      this.windows.delete(windowId);
      this.taskbar.removeWindowButton(windowId);
    });
  }

  /**
   * Setup desktop context menu
   */
  setupContextMenu() {
    this.desktop.addEventListener('contextmenu', (e) => {
      if (e.target === this.desktop || e.target === this.iconsContainer) {
        e.preventDefault();
        this.showContextMenu(e.clientX, e.clientY);
      }
    });

    // Close context menu on click outside
    document.addEventListener('click', () => {
      const contextMenu = document.querySelector('.win7-context-menu');
      if (contextMenu) {
        contextMenu.remove();
      }
    });
  }

  /**
   * Show desktop context menu
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  showContextMenu(x, y) {
    // Remove existing context menu
    const existingMenu = document.querySelector('.win7-context-menu');
    if (existingMenu) {
      existingMenu.remove();
    }

    const menu = document.createElement('div');
    menu.className = 'win7-context-menu';
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    const items = [
      { text: 'View', submenu: true },
      { text: 'Sort by', submenu: true },
      { separator: true },
      { text: 'Refresh' },
      { separator: true },
      { text: 'Paste', disabled: true },
      { text: 'Paste shortcut', disabled: true },
      { separator: true },
      { text: 'Gadgets' },
      { separator: true },
      { text: 'Screen resolution' },
      { text: 'Personalize' }
    ];

    items.forEach(item => {
      if (item.separator) {
        const separator = document.createElement('div');
        separator.className = 'context-menu-separator';
        menu.appendChild(separator);
      } else {
        const menuItem = document.createElement('div');
        menuItem.className = 'context-menu-item';
        if (item.disabled) {
          menuItem.classList.add('disabled');
        }

        const text = document.createElement('span');
        text.className = 'context-menu-text';
        text.textContent = item.text;
        menuItem.appendChild(text);

        if (item.submenu) {
          const arrow = document.createElement('span');
          arrow.textContent = '▶';
          arrow.style.marginLeft = 'auto';
          menuItem.appendChild(arrow);
        }

        menu.appendChild(menuItem);
      }
    });

    document.body.appendChild(menu);
  }

  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Windows key (simulated with Meta/Command)
      if (e.metaKey && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        this.startMenu.toggle();
      }

      // Alt+F4 - Close active window
      if (e.altKey && e.key === 'F4') {
        e.preventDefault();
        const activeWindow = document.querySelector('.win7-window.active');
        if (activeWindow) {
          this.closeWindow(activeWindow);
        }
      }

      // Windows+D - Show desktop
      if (e.metaKey && e.key === 'd') {
        e.preventDefault();
        this.aero.toggleDesktop();
      }
    });
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Win7Desktop;
}
