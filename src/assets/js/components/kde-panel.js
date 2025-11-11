/**
 * KDEPanel - KDE desktop panel component (Kicker/Plasma)
 * Supports KDE 3 Kicker and KDE 4/5 Plasma panel layouts
 *
 * Usage:
 * const panel = new KDEPanel();
 * panel.initialize(document.body, { mode: 'kde3', customizable: true });
 * panel.addWindow({ id: 'win1', title: 'Konqueror', icon: '🌐' });
 */

class KDEPanel {
  constructor() {
    this.container = null;
    this.config = {
      mode: 'kde3', // 'kde3', 'kde4', 'plasma'
      position: 'bottom', // 'top', 'bottom', 'left', 'right'
      height: 46,
      autoHide: false,
      customizable: true,
      showKMenu: true,
      showTaskManager: true,
      showSystemTray: true,
      showPager: true,
      showQuickLaunch: true,
      groupTasks: false,
      theme: 'oxygen' // 'oxygen', 'breeze', 'plastik'
    };
    this.windows = new Map();
    this.workspaces = [
      { id: 0, name: 'Desktop 1', windows: [] },
      { id: 1, name: 'Desktop 2', windows: [] },
      { id: 2, name: 'Desktop 3', windows: [] },
      { id: 3, name: 'Desktop 4', windows: [] }
    ];
    this.activeWorkspace = 0;
    this.widgets = [];
    this.elements = {};
    this.eventHandlers = {};
  }

  /**
   * Initialize panel in container with configuration
   */
  initialize(container, config = {}) {
    this.container = container;
    this.config = { ...this.config, ...config };

    this._createPanel();
    this._applyTheme();
    this._attachEventListeners();
    this._startClock();

    return this;
  }

  /**
   * Create panel DOM structure
   */
  _createPanel() {
    this.elements.panel = document.createElement('div');
    this.elements.panel.className = `kde-panel kde-panel--${this.config.mode}`;

    const isHorizontal = ['top', 'bottom'].includes(this.config.position);

    this.elements.panel.style.cssText = `
      position: fixed;
      ${this.config.position}: 0;
      ${isHorizontal ? 'left: 0; right: 0;' : 'top: 0; bottom: 0;'}
      ${isHorizontal ? `height: ${this.config.height}px;` : `width: ${this.config.height}px;`}
      display: flex;
      ${isHorizontal ? 'flex-direction: row;' : 'flex-direction: column;'}
      align-items: center;
      z-index: 9999;
      font-family: 'Oxygen', 'Noto Sans', 'Ubuntu', sans-serif;
      font-size: 11px;
      user-select: none;
      transition: transform 0.3s ease;
    `;

    // K Menu button
    if (this.config.showKMenu) {
      this.elements.kMenu = this._createKMenuButton();
      this.elements.panel.appendChild(this.elements.kMenu);
    }

    // Quick launch icons
    if (this.config.showQuickLaunch) {
      this.elements.quickLaunch = this._createQuickLaunch();
      this.elements.panel.appendChild(this.elements.quickLaunch);
    }

    // Task manager
    if (this.config.showTaskManager) {
      this.elements.taskManager = this._createTaskManager();
      this.elements.panel.appendChild(this.elements.taskManager);
    }

    // System tray
    if (this.config.showSystemTray) {
      this.elements.systemTray = this._createSystemTray();
      this.elements.panel.appendChild(this.elements.systemTray);
    }

    // Virtual desktop pager
    if (this.config.showPager) {
      this.elements.pager = this._createVirtualDesktopPager();
      this.elements.panel.appendChild(this.elements.pager);
    }

    // Clock
    this.elements.clock = this._createClockWidget();
    this.elements.panel.appendChild(this.elements.clock);

    // Add panel to container
    this.container.appendChild(this.elements.panel);

    // Add customization mode if enabled
    if (this.config.customizable && this.config.mode !== 'kde3') {
      this._enableCustomization();
    }
  }

  /**
   * Create K Menu button
   */
  _createKMenuButton() {
    const button = document.createElement('div');
    button.className = 'kde-kmenu-button';
    button.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 12px;
      height: 100%;
      cursor: pointer;
      transition: background 0.15s;
    `;

    // K Menu icon varies by KDE version
    const icon = this._getKMenuIcon();
    button.innerHTML = icon;

    button.addEventListener('click', () => this._toggleKMenu());
    button.addEventListener('mouseenter', () => {
      button.style.background = 'rgba(255, 255, 255, 0.15)';
    });
    button.addEventListener('mouseleave', () => {
      button.style.background = 'transparent';
    });

    return button;
  }

  /**
   * Get K Menu icon based on mode
   */
  _getKMenuIcon() {
    const icons = {
      kde3: `
        <svg width="24" height="24" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="#0057AE"/>
          <path d="M12 6 L12 12 L18 18" stroke="white" stroke-width="2" fill="none"/>
          <path d="M12 6 L12 12 L6 18" stroke="white" stroke-width="2" fill="none"/>
        </svg>
      `,
      kde4: `
        <svg width="24" height="24" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="url(#kde4-gradient)"/>
          <defs>
            <linearGradient id="kde4-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#4A90D9;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#2A5F99;stop-opacity:1" />
            </linearGradient>
          </defs>
          <text x="12" y="16" text-anchor="middle" font-size="14" font-weight="bold" fill="white">K</text>
        </svg>
      `,
      plasma: `
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path d="M12 2 L22 12 L12 22 L2 12 Z" fill="#3DAEE9"/>
          <text x="12" y="16" text-anchor="middle" font-size="12" font-weight="bold" fill="white">K</text>
        </svg>
      `
    };

    return icons[this.config.mode] || icons.plasma;
  }

  /**
   * Create quick launch area
   */
  _createQuickLaunch() {
    const quickLaunch = document.createElement('div');
    quickLaunch.className = 'kde-quick-launch';
    quickLaunch.style.cssText = `
      display: flex;
      gap: 4px;
      padding: 0 8px;
      align-items: center;
      border-right: 1px solid rgba(255, 255, 255, 0.2);
    `;

    const defaultApps = ['🌐', '📧', '📁', '💻'];
    defaultApps.forEach(icon => {
      const appButton = document.createElement('div');
      appButton.className = 'quick-launch-icon';
      appButton.textContent = icon;
      appButton.style.cssText = `
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 4px;
        font-size: 18px;
        transition: background 0.1s;
      `;

      appButton.addEventListener('mouseenter', () => {
        appButton.style.background = 'rgba(255, 255, 255, 0.15)';
      });
      appButton.addEventListener('mouseleave', () => {
        appButton.style.background = 'transparent';
      });

      quickLaunch.appendChild(appButton);
    });

    return quickLaunch;
  }

  /**
   * Create task manager
   */
  _createTaskManager() {
    const taskManager = document.createElement('div');
    taskManager.className = 'kde-task-manager';
    taskManager.style.cssText = `
      flex: 1;
      display: flex;
      gap: 4px;
      padding: 0 8px;
      overflow: hidden;
      align-items: center;
    `;

    return taskManager;
  }

  /**
   * Create system tray
   */
  _createSystemTray() {
    const tray = document.createElement('div');
    tray.className = 'kde-system-tray';
    tray.style.cssText = `
      display: flex;
      gap: 6px;
      padding: 0 8px;
      align-items: center;
      border-left: 1px solid rgba(255, 255, 255, 0.2);
    `;

    // System tray icons
    const trayIcons = ['🔊', '🌐', '🔋', '📋'];
    trayIcons.forEach(icon => {
      const trayIcon = document.createElement('div');
      trayIcon.className = 'system-tray-icon';
      trayIcon.textContent = icon;
      trayIcon.style.cssText = `
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 4px;
        transition: background 0.1s;
      `;

      trayIcon.addEventListener('mouseenter', () => {
        trayIcon.style.background = 'rgba(255, 255, 255, 0.15)';
      });
      trayIcon.addEventListener('mouseleave', () => {
        trayIcon.style.background = 'transparent';
      });

      tray.appendChild(trayIcon);
    });

    return tray;
  }

  /**
   * Create virtual desktop pager
   */
  _createVirtualDesktopPager() {
    const pager = document.createElement('div');
    pager.className = 'kde-pager';
    pager.style.cssText = `
      display: flex;
      gap: 2px;
      padding: 0 8px;
      align-items: center;
    `;

    this.workspaces.forEach((workspace, index) => {
      const desktop = document.createElement('div');
      desktop.className = 'pager-desktop';
      desktop.dataset.workspaceId = index;
      desktop.style.cssText = `
        width: 32px;
        height: 24px;
        border: 1px solid rgba(255, 255, 255, 0.4);
        border-radius: 2px;
        cursor: pointer;
        transition: all 0.15s;
        ${index === this.activeWorkspace ? 'background: rgba(61, 174, 233, 0.5);' : 'background: transparent;'}
        position: relative;
      `;

      // Desktop number label
      if (this.config.mode === 'kde3') {
        const label = document.createElement('span');
        label.textContent = index + 1;
        label.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 10px;
          font-weight: bold;
        `;
        desktop.appendChild(label);
      }

      desktop.addEventListener('click', () => this._switchWorkspace(index));
      desktop.addEventListener('mouseenter', () => {
        if (index !== this.activeWorkspace) {
          desktop.style.background = 'rgba(255, 255, 255, 0.1)';
        }
      });
      desktop.addEventListener('mouseleave', () => {
        if (index !== this.activeWorkspace) {
          desktop.style.background = 'transparent';
        }
      });

      pager.appendChild(desktop);
    });

    return pager;
  }

  /**
   * Create clock widget
   */
  _createClockWidget() {
    const clock = document.createElement('div');
    clock.className = 'kde-clock-widget';
    clock.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0 12px;
      cursor: pointer;
      transition: background 0.15s;
      min-width: 80px;
    `;

    clock.addEventListener('click', () => {
      this._dispatchEvent('clockClick', {});
    });

    clock.addEventListener('mouseenter', () => {
      clock.style.background = 'rgba(255, 255, 255, 0.15)';
    });
    clock.addEventListener('mouseleave', () => {
      clock.style.background = 'transparent';
    });

    return clock;
  }

  /**
   * Start clock update
   */
  _startClock() {
    this._updateClock();
    this.clockInterval = setInterval(() => this._updateClock(), 1000);
  }

  /**
   * Update clock display
   */
  _updateClock() {
    if (!this.elements.clock) return;

    const now = new Date();
    const time = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    const date = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

    if (this.config.mode === 'kde3') {
      this.elements.clock.innerHTML = `
        <div style="font-size: 11px; font-weight: bold;">${time}</div>
        <div style="font-size: 9px; opacity: 0.9;">${date}</div>
      `;
    } else {
      this.elements.clock.innerHTML = `
        <div style="font-size: 12px; font-weight: 500; line-height: 1.2;">${time}</div>
        <div style="font-size: 9px; opacity: 0.8; line-height: 1.2;">${date}</div>
      `;
    }
  }

  /**
   * Add window to task manager
   */
  addWindow(windowInfo) {
    if (this.windows.has(windowInfo.id)) return;

    const taskButton = this._createTaskButton(windowInfo);
    this.windows.set(windowInfo.id, {
      info: windowInfo,
      element: taskButton,
      workspace: this.activeWorkspace
    });

    this.workspaces[this.activeWorkspace].windows.push(windowInfo.id);
    this.elements.taskManager.appendChild(taskButton);
    this._updateTaskButtonSizes();
  }

  /**
   * Create task button
   */
  _createTaskButton(windowInfo) {
    const button = document.createElement('div');
    button.className = 'kde-task-button';
    button.dataset.windowId = windowInfo.id;
    button.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 12px;
      height: ${this.config.height - 12}px;
      min-width: 150px;
      max-width: 200px;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.15s;
      overflow: hidden;
    `;

    // Icon
    if (windowInfo.icon) {
      const icon = document.createElement('span');
      icon.textContent = windowInfo.icon;
      icon.style.fontSize = '18px';
      button.appendChild(icon);
    }

    // Title
    const title = document.createElement('span');
    title.textContent = windowInfo.title;
    title.style.cssText = `
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 11px;
    `;
    button.appendChild(title);

    // Event listeners
    button.addEventListener('click', () => this._handleTaskClick(windowInfo.id));
    button.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this._showTaskContextMenu(windowInfo.id, e);
    });

    button.addEventListener('mouseenter', () => {
      button.style.background = 'rgba(255, 255, 255, 0.15)';
    });
    button.addEventListener('mouseleave', () => {
      button.style.background = 'transparent';
    });

    return button;
  }

  /**
   * Remove window from task manager
   */
  removeWindow(windowId) {
    const window = this.windows.get(windowId);
    if (!window) return;

    window.element.remove();

    const workspace = this.workspaces[window.workspace];
    workspace.windows = workspace.windows.filter(id => id !== windowId);

    this.windows.delete(windowId);
    this._updateTaskButtonSizes();
  }

  /**
   * Set active window
   */
  setActiveWindow(windowId) {
    this.windows.forEach((window, id) => {
      if (id === windowId) {
        window.element.style.background = 'rgba(61, 174, 233, 0.4)';
        window.element.style.boxShadow = 'inset 0 0 0 1px rgba(61, 174, 233, 0.6)';
      } else {
        window.element.style.background = 'transparent';
        window.element.style.boxShadow = 'none';
      }
    });
  }

  /**
   * Handle task button click
   */
  _handleTaskClick(windowId) {
    this.setActiveWindow(windowId);
    this._dispatchEvent('windowActivate', { windowId });
  }

  /**
   * Show task context menu
   */
  _showTaskContextMenu(windowId, event) {
    this._dispatchEvent('taskContextMenu', {
      windowId,
      x: event.clientX,
      y: event.clientY
    });
  }

  /**
   * Update task button sizes
   */
  _updateTaskButtonSizes() {
    if (!this.elements.taskManager) return;

    const windowCount = this.windows.size;
    if (windowCount === 0) return;

    const availableWidth = this.elements.taskManager.offsetWidth;
    const buttonWidth = Math.max(120, Math.min(200, Math.floor(availableWidth / windowCount) - 8));

    this.windows.forEach(window => {
      window.element.style.maxWidth = `${buttonWidth}px`;
    });
  }

  /**
   * Switch workspace
   */
  _switchWorkspace(workspaceId) {
    if (workspaceId === this.activeWorkspace) return;

    this.activeWorkspace = workspaceId;

    // Update pager UI
    if (this.elements.pager) {
      const desktops = this.elements.pager.querySelectorAll('.pager-desktop');
      desktops.forEach((desktop, index) => {
        desktop.style.background = index === workspaceId
          ? 'rgba(61, 174, 233, 0.5)'
          : 'transparent';
      });
    }

    this._dispatchEvent('workspaceSwitch', { workspaceId });
  }

  /**
   * Toggle K Menu
   */
  _toggleKMenu() {
    this._dispatchEvent('kMenuToggle', {});
  }

  /**
   * Enable panel customization
   */
  _enableCustomization() {
    this.elements.panel.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this._showPanelContextMenu(e);
    });
  }

  /**
   * Show panel context menu
   */
  _showPanelContextMenu(event) {
    this._dispatchEvent('panelContextMenu', {
      x: event.clientX,
      y: event.clientY
    });
  }

  /**
   * Add widget to panel
   */
  addWidget(widgetInfo) {
    const widget = document.createElement('div');
    widget.className = 'kde-panel-widget';
    widget.dataset.widgetId = widgetInfo.id;
    widget.style.cssText = `
      padding: 0 8px;
      cursor: pointer;
      transition: background 0.15s;
    `;

    if (widgetInfo.content) {
      widget.innerHTML = widgetInfo.content;
    }

    widget.addEventListener('mouseenter', () => {
      widget.style.background = 'rgba(255, 255, 255, 0.15)';
    });
    widget.addEventListener('mouseleave', () => {
      widget.style.background = 'transparent';
    });

    // Insert widget before clock
    this.elements.panel.insertBefore(widget, this.elements.clock);

    this.widgets.push({
      id: widgetInfo.id,
      element: widget,
      info: widgetInfo
    });
  }

  /**
   * Remove widget from panel
   */
  removeWidget(widgetId) {
    const widgetIndex = this.widgets.findIndex(w => w.id === widgetId);
    if (widgetIndex === -1) return;

    const widget = this.widgets[widgetIndex];
    widget.element.remove();
    this.widgets.splice(widgetIndex, 1);
  }

  /**
   * Apply theme
   */
  _applyTheme() {
    const themes = {
      oxygen: {
        background: 'linear-gradient(to bottom, #404040 0%, #2d2d2d 100%)',
        color: '#ffffff',
        shadow: '0 -2px 8px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      },
      breeze: {
        background: 'rgba(49, 54, 59, 0.95)',
        backdropFilter: 'blur(10px)',
        color: '#eff0f1',
        shadow: '0 -1px 4px rgba(0, 0, 0, 0.4)',
        border: 'none'
      },
      plastik: {
        background: 'linear-gradient(to bottom, #5a7aa5 0%, #3d5a7e 100%)',
        color: '#ffffff',
        shadow: '0 -2px 6px rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }
    };

    const theme = themes[this.config.theme] || themes.oxygen;

    this.elements.panel.style.background = theme.background;
    this.elements.panel.style.color = theme.color;
    this.elements.panel.style.boxShadow = theme.shadow;

    if (theme.backdropFilter) {
      this.elements.panel.style.backdropFilter = theme.backdropFilter;
      this.elements.panel.style.webkitBackdropFilter = theme.backdropFilter;
    }

    if (theme.border) {
      if (this.config.position === 'bottom') {
        this.elements.panel.style.borderTop = theme.border;
      } else if (this.config.position === 'top') {
        this.elements.panel.style.borderBottom = theme.border;
      }
    }
  }

  /**
   * Set theme configuration
   */
  setTheme(themeConfig) {
    this.config = { ...this.config, ...themeConfig };
    this._applyTheme();
  }

  /**
   * Enable/disable auto-hide
   */
  setAutoHide(enabled) {
    this.config.autoHide = enabled;

    if (enabled) {
      this._enableAutoHide();
    } else {
      this._disableAutoHide();
    }
  }

  /**
   * Enable auto-hide functionality
   */
  _enableAutoHide() {
    let hideTimeout;

    this.elements.panel.addEventListener('mouseenter', () => {
      clearTimeout(hideTimeout);
      this._showPanel();
    });

    this.elements.panel.addEventListener('mouseleave', () => {
      hideTimeout = setTimeout(() => {
        this._hidePanel();
      }, 500);
    });

    // Initial hide
    setTimeout(() => this._hidePanel(), 1000);
  }

  /**
   * Disable auto-hide
   */
  _disableAutoHide() {
    this._showPanel();
  }

  /**
   * Show panel
   */
  _showPanel() {
    this.elements.panel.style.transform = 'translateY(0)';
  }

  /**
   * Hide panel
   */
  _hidePanel() {
    const hideDistance = this.config.height - 4;

    if (this.config.position === 'bottom') {
      this.elements.panel.style.transform = `translateY(${hideDistance}px)`;
    } else if (this.config.position === 'top') {
      this.elements.panel.style.transform = `translateY(-${hideDistance}px)`;
    }
  }

  /**
   * Attach event listeners
   */
  _attachEventListeners() {
    this.eventHandlers.resize = () => this._updateTaskButtonSizes();
    window.addEventListener('resize', this.eventHandlers.resize);
  }

  /**
   * Dispatch custom event
   */
  _dispatchEvent(eventName, detail) {
    const event = new CustomEvent(`kde:${eventName}`, { detail });
    this.elements.panel.dispatchEvent(event);
  }

  /**
   * Clean up component
   */
  destroy() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }

    window.removeEventListener('resize', this.eventHandlers.resize);

    if (this.elements.panel) {
      this.elements.panel.remove();
    }

    this.windows.clear();
    this.widgets = [];
    this.workspaces = [];
    this.elements = {};
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KDEPanel;
}
