/**
 * GNOMEPanel - GNOME desktop panel component
 * Supports GNOME 2, GNOME 3, and Ubuntu Unity panel layouts
 *
 * Usage:
 * const panel = new GNOMEPanel();
 * panel.initialize(document.body, { mode: 'gnome2', showBottomPanel: true });
 * panel.addWindow({ id: 'win1', title: 'Terminal', icon: '💻' });
 */

class GNOMEPanel {
  constructor() {
    this.container = null;
    this.config = {
      mode: 'gnome2', // 'gnome2', 'gnome3', 'unity'
      showTopPanel: true,
      showBottomPanel: true, // GNOME 2 only
      showLeftLauncher: false, // Unity only
      showActivities: true, // GNOME 3
      showWorkspaces: true,
      workspaceCount: 4,
      height: 24,
      theme: 'dark' // 'dark', 'light'
    };
    this.windows = new Map();
    this.workspaces = [];
    this.activeWorkspace = 0;
    this.currentTime = '';
    this.elements = {};
    this.eventHandlers = {};
  }

  /**
   * Initialize panel in container with configuration
   */
  initialize(container, config = {}) {
    this.container = container;
    this.config = { ...this.config, ...config };

    this._initializeWorkspaces();
    this._createPanels();
    this._applyTheme();
    this._attachEventListeners();
    this._startClock();

    return this;
  }

  /**
   * Initialize workspaces
   */
  _initializeWorkspaces() {
    this.workspaces = Array.from({ length: this.config.workspaceCount }, (_, i) => ({
      id: i,
      windows: []
    }));
  }

  /**
   * Create panels based on mode
   */
  _createPanels() {
    switch (this.config.mode) {
      case 'gnome2':
        this._createGNOME2Panels();
        break;
      case 'gnome3':
        this._createGNOME3Panel();
        break;
      case 'unity':
        this._createUnityPanels();
        break;
    }
  }

  /**
   * Create GNOME 2 style panels (top + bottom)
   */
  _createGNOME2Panels() {
    // Top panel
    if (this.config.showTopPanel) {
      this.elements.topPanel = document.createElement('div');
      this.elements.topPanel.className = 'gnome-panel gnome-panel-top';
      this.elements.topPanel.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: ${this.config.height}px;
        display: flex;
        align-items: center;
        z-index: 9999;
        font-family: 'Ubuntu', 'Cantarell', sans-serif;
        font-size: 11px;
        user-select: none;
      `;

      // Applications menu
      const appsMenu = this._createMenuItem('Applications', () => this._showMenu('applications'));
      this.elements.topPanel.appendChild(appsMenu);

      // Places menu
      const placesMenu = this._createMenuItem('Places', () => this._showMenu('places'));
      this.elements.topPanel.appendChild(placesMenu);

      // System menu
      const systemMenu = this._createMenuItem('System', () => this._showMenu('system'));
      this.elements.topPanel.appendChild(systemMenu);

      // Spacer
      const spacer = document.createElement('div');
      spacer.style.flex = '1';
      this.elements.topPanel.appendChild(spacer);

      // System indicators
      this.elements.indicators = this._createSystemIndicators();
      this.elements.topPanel.appendChild(this.elements.indicators);

      // Clock
      this.elements.clock = this._createClockApplet();
      this.elements.topPanel.appendChild(this.elements.clock);

      this.container.appendChild(this.elements.topPanel);
    }

    // Bottom panel
    if (this.config.showBottomPanel) {
      this.elements.bottomPanel = document.createElement('div');
      this.elements.bottomPanel.className = 'gnome-panel gnome-panel-bottom';
      this.elements.bottomPanel.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: ${this.config.height}px;
        display: flex;
        align-items: center;
        z-index: 9999;
        font-family: 'Ubuntu', 'Cantarell', sans-serif;
        font-size: 11px;
        user-select: none;
      `;

      // Show desktop button
      const showDesktop = this._createShowDesktopButton();
      this.elements.bottomPanel.appendChild(showDesktop);

      // Window list
      this.elements.windowList = document.createElement('div');
      this.elements.windowList.className = 'gnome-window-list';
      this.elements.windowList.style.cssText = `
        flex: 1;
        display: flex;
        gap: 2px;
        padding: 0 4px;
        overflow: hidden;
      `;
      this.elements.bottomPanel.appendChild(this.elements.windowList);

      // Workspace switcher
      if (this.config.showWorkspaces) {
        this.elements.workspaceSwitcher = this._createWorkspaceSwitcher();
        this.elements.bottomPanel.appendChild(this.elements.workspaceSwitcher);
      }

      this.container.appendChild(this.elements.bottomPanel);
    }
  }

  /**
   * Create GNOME 3 style top bar
   */
  _createGNOME3Panel() {
    this.elements.topPanel = document.createElement('div');
    this.elements.topPanel.className = 'gnome-panel gnome3-topbar';
    this.elements.topPanel.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 28px;
      display: flex;
      align-items: center;
      z-index: 9999;
      font-family: 'Cantarell', 'Ubuntu', sans-serif;
      font-size: 11px;
      font-weight: 500;
      user-select: none;
    `;

    // Activities button
    if (this.config.showActivities) {
      const activities = this._createActivitiesButton();
      this.elements.topPanel.appendChild(activities);
    }

    // App menu (centered)
    this.elements.appMenu = document.createElement('div');
    this.elements.appMenu.className = 'gnome3-app-menu';
    this.elements.appMenu.style.cssText = `
      flex: 1;
      text-align: center;
      font-weight: bold;
      opacity: 0.9;
    `;
    this.elements.appMenu.textContent = '';
    this.elements.topPanel.appendChild(this.elements.appMenu);

    // Right side container
    const rightSide = document.createElement('div');
    rightSide.style.cssText = 'display: flex; align-items: center; gap: 8px;';

    // System status
    this.elements.indicators = this._createSystemIndicators();
    rightSide.appendChild(this.elements.indicators);

    // Clock
    this.elements.clock = this._createClockApplet();
    rightSide.appendChild(this.elements.clock);

    // System menu
    const systemMenu = this._createSystemMenuButton();
    rightSide.appendChild(systemMenu);

    this.elements.topPanel.appendChild(rightSide);
    this.container.appendChild(this.elements.topPanel);
  }

  /**
   * Create Unity style panels (top bar + left launcher)
   */
  _createUnityPanels() {
    // Top panel
    this.elements.topPanel = document.createElement('div');
    this.elements.topPanel.className = 'gnome-panel unity-panel';
    this.elements.topPanel.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 24px;
      display: flex;
      align-items: center;
      z-index: 9999;
      font-family: 'Ubuntu', sans-serif;
      font-size: 11px;
      user-select: none;
    `;

    // Ubuntu logo/BFB (Big Friendly Button)
    const bfb = this._createBFBButton();
    this.elements.topPanel.appendChild(bfb);

    // App menu
    this.elements.appMenu = document.createElement('div');
    this.elements.appMenu.className = 'unity-app-menu';
    this.elements.appMenu.style.cssText = `
      display: flex;
      gap: 12px;
      padding: 0 12px;
    `;

    const menus = ['File', 'Edit', 'View', 'Help'];
    menus.forEach(menu => {
      const item = this._createMenuItem(menu, () => {});
      this.elements.appMenu.appendChild(item);
    });

    this.elements.topPanel.appendChild(this.elements.appMenu);

    // Spacer
    const spacer = document.createElement('div');
    spacer.style.flex = '1';
    this.elements.topPanel.appendChild(spacer);

    // Indicators
    this.elements.indicators = this._createSystemIndicators();
    this.elements.topPanel.appendChild(this.elements.indicators);

    // Clock
    this.elements.clock = this._createClockApplet();
    this.elements.topPanel.appendChild(this.elements.clock);

    this.container.appendChild(this.elements.topPanel);

    // Left launcher
    if (this.config.showLeftLauncher) {
      this.elements.launcher = this._createUnityLauncher();
      this.container.appendChild(this.elements.launcher);
    }
  }

  /**
   * Create menu item
   */
  _createMenuItem(text, onClick) {
    const item = document.createElement('div');
    item.className = 'panel-menu-item';
    item.textContent = text;
    item.style.cssText = `
      padding: 0 12px;
      height: 100%;
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: background 0.1s;
    `;

    item.addEventListener('click', onClick);
    item.addEventListener('mouseenter', () => {
      item.style.background = 'rgba(255, 255, 255, 0.1)';
    });
    item.addEventListener('mouseleave', () => {
      item.style.background = 'transparent';
    });

    return item;
  }

  /**
   * Create Activities button (GNOME 3)
   */
  _createActivitiesButton() {
    const button = document.createElement('div');
    button.className = 'gnome3-activities';
    button.textContent = 'Activities';
    button.style.cssText = `
      padding: 0 16px;
      height: 100%;
      display: flex;
      align-items: center;
      cursor: pointer;
      font-weight: bold;
      transition: background 0.15s;
    `;

    button.addEventListener('click', () => {
      this._dispatchEvent('activitiesOpen', {});
    });

    button.addEventListener('mouseenter', () => {
      button.style.background = 'rgba(255, 255, 255, 0.1)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.background = 'transparent';
    });

    return button;
  }

  /**
   * Create BFB button (Unity)
   */
  _createBFBButton() {
    const button = document.createElement('div');
    button.className = 'unity-bfb';
    button.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="9" fill="#DD4814"/>
        <text x="10" y="14" text-anchor="middle" font-size="12" fill="white" font-family="Ubuntu">u</text>
      </svg>
    `;
    button.style.cssText = `
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin: 0 4px;
    `;

    button.addEventListener('click', () => {
      this._dispatchEvent('dashOpen', {});
    });

    return button;
  }

  /**
   * Create system indicators
   */
  _createSystemIndicators() {
    const indicators = document.createElement('div');
    indicators.className = 'panel-indicators';
    indicators.style.cssText = `
      display: flex;
      gap: 8px;
      padding: 0 8px;
      align-items: center;
    `;

    const icons = ['🔊', '🌐', '🔋'];
    icons.forEach(icon => {
      const indicator = document.createElement('span');
      indicator.textContent = icon;
      indicator.style.cssText = `
        cursor: pointer;
        padding: 4px;
        border-radius: 2px;
        transition: background 0.1s;
      `;
      indicator.addEventListener('mouseenter', () => {
        indicator.style.background = 'rgba(255, 255, 255, 0.1)';
      });
      indicator.addEventListener('mouseleave', () => {
        indicator.style.background = 'transparent';
      });
      indicators.appendChild(indicator);
    });

    return indicators;
  }

  /**
   * Create clock applet
   */
  _createClockApplet() {
    const clock = document.createElement('div');
    clock.className = 'panel-clock';
    clock.style.cssText = `
      padding: 0 12px;
      cursor: pointer;
      transition: background 0.1s;
    `;

    clock.addEventListener('mouseenter', () => {
      clock.style.background = 'rgba(255, 255, 255, 0.1)';
    });
    clock.addEventListener('mouseleave', () => {
      clock.style.background = 'transparent';
    });

    return clock;
  }

  /**
   * Create system menu button (GNOME 3)
   */
  _createSystemMenuButton() {
    const button = document.createElement('div');
    button.className = 'gnome3-system-menu';
    button.innerHTML = '⚙️';
    button.style.cssText = `
      padding: 0 8px;
      cursor: pointer;
      transition: background 0.1s;
    `;

    button.addEventListener('click', () => {
      this._dispatchEvent('systemMenuOpen', {});
    });

    button.addEventListener('mouseenter', () => {
      button.style.background = 'rgba(255, 255, 255, 0.1)';
    });
    button.addEventListener('mouseleave', () => {
      button.style.background = 'transparent';
    });

    return button;
  }

  /**
   * Create show desktop button
   */
  _createShowDesktopButton() {
    const button = document.createElement('div');
    button.className = 'show-desktop-button';
    button.style.cssText = `
      width: 20px;
      height: ${this.config.height}px;
      cursor: pointer;
      border-right: 1px solid rgba(255, 255, 255, 0.2);
      margin-right: 4px;
      transition: background 0.1s;
    `;

    button.addEventListener('click', () => {
      this._dispatchEvent('showDesktop', {});
    });

    button.addEventListener('mouseenter', () => {
      button.style.background = 'rgba(255, 255, 255, 0.1)';
    });
    button.addEventListener('mouseleave', () => {
      button.style.background = 'transparent';
    });

    return button;
  }

  /**
   * Create workspace switcher
   */
  _createWorkspaceSwitcher() {
    const switcher = document.createElement('div');
    switcher.className = 'workspace-switcher';
    switcher.style.cssText = `
      display: flex;
      gap: 2px;
      padding: 0 4px;
      margin-left: 4px;
      border-left: 1px solid rgba(255, 255, 255, 0.2);
    `;

    this.workspaces.forEach((workspace, index) => {
      const wsButton = document.createElement('div');
      wsButton.className = 'workspace-button';
      wsButton.dataset.workspaceId = index;
      wsButton.style.cssText = `
        width: 24px;
        height: 16px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        cursor: pointer;
        transition: background 0.1s;
        ${index === this.activeWorkspace ? 'background: rgba(255, 255, 255, 0.3);' : ''}
      `;

      wsButton.addEventListener('click', () => {
        this._switchWorkspace(index);
      });

      switcher.appendChild(wsButton);
    });

    return switcher;
  }

  /**
   * Create Unity launcher
   */
  _createUnityLauncher() {
    const launcher = document.createElement('div');
    launcher.className = 'unity-launcher';
    launcher.style.cssText = `
      position: fixed;
      left: 0;
      top: 24px;
      bottom: 0;
      width: 64px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 8px 0;
      z-index: 9998;
      user-select: none;
    `;

    // Add launcher icons
    const apps = ['📁', '🌐', '📧', '🎵', '🖼️'];
    apps.forEach(icon => {
      const appIcon = document.createElement('div');
      appIcon.className = 'launcher-icon';
      appIcon.textContent = icon;
      appIcon.style.cssText = `
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 24px;
        border-radius: 4px;
        transition: background 0.1s;
        position: relative;
      `;

      appIcon.addEventListener('mouseenter', () => {
        appIcon.style.background = 'rgba(255, 255, 255, 0.2)';
      });
      appIcon.addEventListener('mouseleave', () => {
        appIcon.style.background = 'transparent';
      });

      launcher.appendChild(appIcon);
    });

    return launcher;
  }

  /**
   * Add window to panel
   */
  addWindow(windowInfo) {
    if (this.windows.has(windowInfo.id)) return;

    const windowButton = this._createWindowButton(windowInfo);
    this.windows.set(windowInfo.id, {
      info: windowInfo,
      element: windowButton,
      workspace: this.activeWorkspace
    });

    this.workspaces[this.activeWorkspace].windows.push(windowInfo.id);

    if (this.elements.windowList) {
      this.elements.windowList.appendChild(windowButton);
    }
  }

  /**
   * Create window button for window list
   */
  _createWindowButton(windowInfo) {
    const button = document.createElement('div');
    button.className = 'window-list-item';
    button.dataset.windowId = windowInfo.id;
    button.style.cssText = `
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 8px;
      max-width: 200px;
      height: ${this.config.height - 4}px;
      cursor: pointer;
      border-radius: 2px;
      transition: background 0.1s;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `;

    if (windowInfo.icon) {
      const icon = document.createElement('span');
      icon.textContent = windowInfo.icon;
      icon.style.fontSize = '14px';
      button.appendChild(icon);
    }

    const title = document.createElement('span');
    title.textContent = windowInfo.title;
    title.style.cssText = 'overflow: hidden; text-overflow: ellipsis;';
    button.appendChild(title);

    button.addEventListener('click', () => {
      this._dispatchEvent('windowActivate', { windowId: windowInfo.id });
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
   * Remove window from panel
   */
  removeWindow(windowId) {
    const window = this.windows.get(windowId);
    if (!window) return;

    window.element.remove();

    const workspace = this.workspaces[window.workspace];
    workspace.windows = workspace.windows.filter(id => id !== windowId);

    this.windows.delete(windowId);
  }

  /**
   * Switch workspace
   */
  _switchWorkspace(workspaceId) {
    if (workspaceId === this.activeWorkspace) return;

    this.activeWorkspace = workspaceId;

    // Update workspace switcher UI
    if (this.elements.workspaceSwitcher) {
      const buttons = this.elements.workspaceSwitcher.querySelectorAll('.workspace-button');
      buttons.forEach((btn, index) => {
        btn.style.background = index === workspaceId
          ? 'rgba(255, 255, 255, 0.3)'
          : 'transparent';
      });
    }

    this._dispatchEvent('workspaceSwitch', { workspaceId });
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

    if (this.config.mode === 'gnome2') {
      const time = now.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      this.elements.clock.textContent = time;
    } else {
      const time = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      const date = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      this.elements.clock.innerHTML = `${date} ${time}`;
    }
  }

  /**
   * Show menu
   */
  _showMenu(menuType) {
    this._dispatchEvent('menuOpen', { menuType });
  }

  /**
   * Apply theme
   */
  _applyTheme() {
    const themes = {
      dark: {
        background: 'linear-gradient(to bottom, #3c3b37 0%, #2c2b27 100%)',
        color: '#fff',
        border: '1px solid rgba(0, 0, 0, 0.5)'
      },
      light: {
        background: 'linear-gradient(to bottom, #f0f0f0 0%, #e0e0e0 100%)',
        color: '#000',
        border: '1px solid rgba(0, 0, 0, 0.2)'
      }
    };

    const theme = themes[this.config.theme] || themes.dark;

    Object.values(this.elements).forEach(element => {
      if (element && element.classList && element.classList.contains('gnome-panel')) {
        element.style.background = theme.background;
        element.style.color = theme.color;
        element.style.borderBottom = theme.border;
      }
    });

    // Unity launcher theme
    if (this.elements.launcher) {
      this.elements.launcher.style.background = 'rgba(0, 0, 0, 0.6)';
      this.elements.launcher.style.backdropFilter = 'blur(10px)';
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
   * Attach event listeners
   */
  _attachEventListeners() {
    // Window resize handler
    this.eventHandlers.resize = () => {
      // Update panel layouts if needed
    };
    window.addEventListener('resize', this.eventHandlers.resize);
  }

  /**
   * Dispatch custom event
   */
  _dispatchEvent(eventName, detail) {
    const event = new CustomEvent(`gnome:${eventName}`, { detail });
    document.dispatchEvent(event);
  }

  /**
   * Clean up component
   */
  destroy() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }

    window.removeEventListener('resize', this.eventHandlers.resize);

    Object.values(this.elements).forEach(element => {
      if (element && element.remove) {
        element.remove();
      }
    });

    this.windows.clear();
    this.workspaces = [];
    this.elements = {};
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GNOMEPanel;
}
