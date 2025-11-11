/**
 * Mac OS X Aqua Window System
 * Implements Aqua-style windows with traffic lights and genie effect
 */

class MacOSXWindowSystem {
  constructor(windowManager) {
    this.windowManager = windowManager;
    this.windows = new Map();
    this.activeWindow = null;
    this.zIndexCounter = 1000;
  }

  createWindow(options) {
    const windowId = `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const windowEl = document.createElement('div');
    windowEl.className = 'window opening';
    windowEl.id = windowId;
    windowEl.dataset.appId = options.appId || '';

    // Set initial position and size
    const width = options.width || 600;
    const height = options.height || 400;
    windowEl.style.width = `${width}px`;
    windowEl.style.height = `${height}px`;

    if (options.center) {
      windowEl.style.left = `${(window.innerWidth - width) / 2}px`;
      windowEl.style.top = `${(window.innerHeight - height) / 2}px`;
    } else {
      windowEl.style.left = options.x ? `${options.x}px` : '100px';
      windowEl.style.top = options.y ? `${options.y}px` : '100px';
    }

    // Title bar
    const titleBar = this.createTitleBar(windowId, options);
    windowEl.appendChild(titleBar);

    // Toolbar (optional)
    if (options.toolbar) {
      const toolbar = this.createToolbar(options.toolbar);
      windowEl.appendChild(toolbar);
    }

    // Content
    const content = document.createElement('div');
    content.className = 'window-content';
    if (options.brushedMetal) {
      content.classList.add('brushed-metal');
    }

    if (typeof options.content === 'string') {
      content.innerHTML = options.content;
    } else if (options.content instanceof HTMLElement) {
      content.appendChild(options.content);
    }

    windowEl.appendChild(content);

    // Status bar (optional)
    if (options.statusBar) {
      const statusBar = document.createElement('div');
      statusBar.className = 'window-statusbar';
      statusBar.innerHTML = options.statusBar;
      windowEl.appendChild(statusBar);
    }

    // Resize handle (if resizable)
    if (options.resizable !== false) {
      const resizeHandle = document.createElement('div');
      resizeHandle.className = 'window-resize';
      windowEl.appendChild(resizeHandle);
    }

    // Add to DOM
    const container = document.getElementById('windows-container');
    if (container) {
      container.appendChild(windowEl);
    }

    // Store window data
    this.windows.set(windowId, {
      id: windowId,
      element: windowEl,
      options: options,
      minimized: false,
      position: { x: parseInt(windowEl.style.left), y: parseInt(windowEl.style.top) },
      size: { width, height }
    });

    // Attach event listeners
    this.attachWindowEvents(windowId);

    // Focus the window
    this.focusWindow(windowId);

    // Remove opening animation class
    setTimeout(() => windowEl.classList.remove('opening'), 300);

    return windowId;
  }

  createTitleBar(windowId, options) {
    const titleBar = document.createElement('div');
    titleBar.className = 'window-titlebar';

    // Traffic lights (window controls)
    const controls = document.createElement('div');
    controls.className = 'window-controls';

    const closeBtn = this.createTrafficLight('close', () => this.closeWindow(windowId));
    const minimizeBtn = this.createTrafficLight('minimize', () => this.minimizeWindow(windowId));
    const zoomBtn = this.createTrafficLight('zoom', () => this.zoomWindow(windowId));

    controls.appendChild(closeBtn);
    controls.appendChild(minimizeBtn);
    controls.appendChild(zoomBtn);

    titleBar.appendChild(controls);

    // Title
    const title = document.createElement('div');
    title.className = 'window-title';
    title.textContent = options.title || 'Untitled';
    titleBar.appendChild(title);

    return titleBar;
  }

  createTrafficLight(type, onClick) {
    const button = document.createElement('div');
    button.className = `window-control ${type}`;
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      onClick();
    });
    return button;
  }

  createToolbar(toolbarOptions) {
    const toolbar = document.createElement('div');
    toolbar.className = 'window-toolbar';

    if (toolbarOptions.unified) {
      toolbar.classList.add('unified');
    }

    if (toolbarOptions.items) {
      toolbarOptions.items.forEach(item => {
        const button = document.createElement('button');
        button.className = 'toolbar-button';
        if (item.primary) {
          button.classList.add('default');
        }
        button.textContent = item.label;
        button.addEventListener('click', item.action);
        toolbar.appendChild(button);
      });
    }

    return toolbar;
  }

  attachWindowEvents(windowId) {
    const windowData = this.windows.get(windowId);
    if (!windowData) return;

    const windowEl = windowData.element;
    const titleBar = windowEl.querySelector('.window-titlebar');
    const resizeHandle = windowEl.querySelector('.window-resize');

    // Window dragging
    if (titleBar) {
      let isDragging = false;
      let dragOffset = { x: 0, y: 0 };

      titleBar.addEventListener('mousedown', (e) => {
        if (e.target.closest('.window-control')) return;

        isDragging = true;
        dragOffset.x = e.clientX - windowEl.offsetLeft;
        dragOffset.y = e.clientY - windowEl.offsetTop;

        this.focusWindow(windowId);
        windowEl.style.cursor = 'grabbing';
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;

        // Keep window within bounds
        const menuBarHeight = 22;
        newY = Math.max(menuBarHeight, newY);
        newX = Math.max(0, Math.min(newX, window.innerWidth - 100));

        windowEl.style.left = `${newX}px`;
        windowEl.style.top = `${newY}px`;

        windowData.position = { x: newX, y: newY };
      });

      document.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          windowEl.style.cursor = '';
        }
      });

      // Double-click to minimize
      titleBar.addEventListener('dblclick', (e) => {
        if (!e.target.closest('.window-control')) {
          this.minimizeWindow(windowId);
        }
      });
    }

    // Window resizing
    if (resizeHandle) {
      let isResizing = false;
      let resizeStart = { x: 0, y: 0, width: 0, height: 0 };

      resizeHandle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        isResizing = true;
        resizeStart = {
          x: e.clientX,
          y: e.clientY,
          width: windowEl.offsetWidth,
          height: windowEl.offsetHeight
        };

        this.focusWindow(windowId);
      });

      document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;

        const newWidth = Math.max(200, resizeStart.width + deltaX);
        const newHeight = Math.max(100, resizeStart.height + deltaY);

        windowEl.style.width = `${newWidth}px`;
        windowEl.style.height = `${newHeight}px`;

        windowData.size = { width: newWidth, height: newHeight };
      });

      document.addEventListener('mouseup', () => {
        isResizing = false;
      });
    }

    // Focus window on click
    windowEl.addEventListener('mousedown', () => {
      this.focusWindow(windowId);
    });
  }

  focusWindow(windowId) {
    // Update z-index
    const windowData = this.windows.get(windowId);
    if (!windowData) return;

    // Remove active class from all windows
    this.windows.forEach((data, id) => {
      if (id !== windowId) {
        data.element.classList.remove('active');
        data.element.classList.add('inactive');
      }
    });

    // Set active window
    windowData.element.classList.add('active');
    windowData.element.classList.remove('inactive');
    windowData.element.style.zIndex = ++this.zIndexCounter;
    this.activeWindow = windowId;

    // Update menu bar app name
    if (windowData.options.appName && window.macosx && window.macosx.menuBar) {
      window.macosx.menuBar.setCurrentApp(windowData.options.appName);
    }
  }

  minimizeWindow(windowId) {
    const windowData = this.windows.get(windowId);
    if (!windowData || windowData.minimized) return;

    const windowEl = windowData.element;

    // Add minimizing animation
    windowEl.classList.add('minimizing');

    // Get dock position for genie effect target
    const dock = document.getElementById('macosx-dock');
    const dockRect = dock ? dock.getBoundingClientRect() : null;

    if (dockRect) {
      // Animate to dock position
      windowEl.style.transformOrigin = 'bottom center';
    }

    setTimeout(() => {
      windowEl.style.display = 'none';
      windowEl.classList.remove('minimizing');
      windowData.minimized = true;

      // If this was the active window, focus another
      if (this.activeWindow === windowId) {
        this.focusNextWindow();
      }
    }, 500);

    // Bounce app icon in dock
    if (window.macosx && window.macosx.dock && windowData.options.appId) {
      window.macosx.dock.bounceIcon(windowData.options.appId);
    }
  }

  restoreWindow(windowId) {
    const windowData = this.windows.get(windowId);
    if (!windowData || !windowData.minimized) return;

    const windowEl = windowData.element;
    windowEl.style.display = '';
    windowData.minimized = false;

    // Add opening animation
    windowEl.classList.add('opening');
    setTimeout(() => windowEl.classList.remove('opening'), 300);

    this.focusWindow(windowId);
  }

  closeWindow(windowId) {
    const windowData = this.windows.get(windowId);
    if (!windowData) return;

    const windowEl = windowData.element;

    // Add closing animation
    windowEl.classList.add('minimizing');

    setTimeout(() => {
      windowEl.remove();
      this.windows.delete(windowId);

      // If this was the active window, focus another
      if (this.activeWindow === windowId) {
        this.focusNextWindow();
      }

      // Check if app has any more windows
      if (windowData.options.appId) {
        const appHasWindows = Array.from(this.windows.values()).some(
          w => w.options.appId === windowData.options.appId && !w.minimized
        );

        if (!appHasWindows && window.macosx && window.macosx.dock) {
          window.macosx.dock.setAppRunning(windowData.options.appId, false);
        }
      }
    }, 300);
  }

  zoomWindow(windowId) {
    const windowData = this.windows.get(windowId);
    if (!windowData) return;

    const windowEl = windowData.element;

    // Toggle between normal and zoomed state
    if (windowData.zoomed) {
      // Restore original size
      windowEl.style.width = `${windowData.originalSize.width}px`;
      windowEl.style.height = `${windowData.originalSize.height}px`;
      windowEl.style.left = `${windowData.originalPosition.x}px`;
      windowEl.style.top = `${windowData.originalPosition.y}px`;
      windowData.zoomed = false;
    } else {
      // Store original size and position
      windowData.originalSize = { ...windowData.size };
      windowData.originalPosition = { ...windowData.position };

      // Zoom to fill available space (with padding)
      const menuBarHeight = 22;
      const dockHeight = 80;
      const padding = 20;

      const newWidth = window.innerWidth - padding * 2;
      const newHeight = window.innerHeight - menuBarHeight - dockHeight - padding * 2;

      windowEl.style.width = `${newWidth}px`;
      windowEl.style.height = `${newHeight}px`;
      windowEl.style.left = `${padding}px`;
      windowEl.style.top = `${menuBarHeight + padding}px`;

      windowData.size = { width: newWidth, height: newHeight };
      windowData.position = { x: padding, y: menuBarHeight + padding };
      windowData.zoomed = true;
    }
  }

  focusNextWindow() {
    const visibleWindows = Array.from(this.windows.values())
      .filter(w => !w.minimized)
      .sort((a, b) => parseInt(b.element.style.zIndex) - parseInt(a.element.style.zIndex));

    if (visibleWindows.length > 0) {
      this.focusWindow(visibleWindows[0].id);
    } else {
      this.activeWindow = null;
    }
  }

  getWindowsByApp(appId) {
    return Array.from(this.windows.values()).filter(w => w.options.appId === appId);
  }

  closeAppWindows(appId) {
    const appWindows = this.getWindowsByApp(appId);
    appWindows.forEach(w => this.closeWindow(w.id));
  }

  hideAppWindows(appId) {
    const appWindows = this.getWindowsByApp(appId);
    appWindows.forEach(w => {
      if (!w.minimized) {
        w.element.style.display = 'none';
        w.hidden = true;
      }
    });
  }

  showAppWindows(appId) {
    const appWindows = this.getWindowsByApp(appId);
    appWindows.forEach(w => {
      if (w.hidden) {
        w.element.style.display = '';
        w.hidden = false;
      }
    });

    if (appWindows.length > 0 && !appWindows[0].minimized) {
      this.focusWindow(appWindows[0].id);
    }
  }
}

// Make available globally
window.MacOSXWindowSystem = MacOSXWindowSystem;
