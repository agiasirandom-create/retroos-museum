/**
 * WindowsTaskbar - Modular Windows taskbar component
 * Supports Windows 95/98, XP, 7, and 10/11 modes
 *
 * Usage:
 * const taskbar = new WindowsTaskbar();
 * taskbar.initialize(document.body, { mode: 'xp', autoHide: false });
 * taskbar.addWindow({ id: 'win1', title: 'My Computer', icon: 'computer.png' });
 */

class WindowsTaskbar {
  constructor() {
    this.container = null;
    this.config = {
      mode: 'xp', // '95', '98', 'xp', '7', '10', '11'
      position: 'bottom', // 'top', 'bottom', 'left', 'right'
      autoHide: false,
      height: 40,
      showClock: true,
      showQuickLaunch: true,
      showSystemTray: true,
      groupSimilar: false,
      centerAlign: false // Windows 11 style
    };
    this.windows = new Map();
    this.activeWindow = null;
    this.startMenuOpen = false;
    this.elements = {};
    this.eventHandlers = {};
  }

  /**
   * Initialize taskbar in container with configuration
   */
  initialize(container, config = {}) {
    this.container = container;
    this.config = { ...this.config, ...config };

    this._createTaskbar();
    this._applyTheme();
    this._attachEventListeners();

    if (this.config.autoHide) {
      this._enableAutoHide();
    }

    return this;
  }

  /**
   * Create taskbar DOM structure
   */
  _createTaskbar() {
    // Main taskbar container
    this.elements.taskbar = document.createElement('div');
    this.elements.taskbar.className = `windows-taskbar windows-taskbar--${this.config.mode}`;
    this.elements.taskbar.style.cssText = `
      position: fixed;
      ${this.config.position}: 0;
      left: 0;
      right: 0;
      height: ${this.config.height}px;
      display: flex;
      align-items: center;
      z-index: 9999;
      user-select: none;
    `;

    // Start button
    this.elements.startButton = this._createStartButton();
    this.elements.taskbar.appendChild(this.elements.startButton);

    // Quick launch (95/98/XP/7)
    if (this.config.showQuickLaunch && !['10', '11'].includes(this.config.mode)) {
      this.elements.quickLaunch = this._createQuickLaunch();
      this.elements.taskbar.appendChild(this.elements.quickLaunch);
    }

    // Task buttons area
    this.elements.taskButtons = document.createElement('div');
    this.elements.taskButtons.className = 'taskbar-tasks';
    this.elements.taskButtons.style.cssText = `
      flex: 1;
      display: flex;
      gap: ${this.config.mode === '11' && this.config.centerAlign ? '0' : '4px'};
      padding: 0 4px;
      overflow: hidden;
      ${this.config.mode === '11' && this.config.centerAlign ? 'justify-content: center;' : ''}
    `;
    this.elements.taskbar.appendChild(this.elements.taskButtons);

    // System tray area
    if (this.config.showSystemTray) {
      this.elements.systemTray = this._createSystemTray();
      this.elements.taskbar.appendChild(this.elements.systemTray);
    }

    // Clock
    if (this.config.showClock) {
      this.elements.clock = this._createClock();
      this.elements.taskbar.appendChild(this.elements.clock);
    }

    // Append to container
    this.container.appendChild(this.elements.taskbar);
  }

  /**
   * Create Start button
   */
  _createStartButton() {
    const button = document.createElement('button');
    button.className = 'taskbar-start-button';
    button.style.cssText = `
      height: 100%;
      padding: 0 20px;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'Tahoma', 'MS Sans Serif', sans-serif;
      font-weight: bold;
      transition: background 0.1s;
    `;

    // Start button content varies by mode
    const startContent = this._getStartButtonContent();
    button.innerHTML = startContent;

    button.addEventListener('click', () => this._toggleStartMenu());

    return button;
  }

  /**
   * Get Start button content based on mode
   */
  _getStartButtonContent() {
    const logos = {
      '95': '<span style="font-size: 20px;">&#x229E;</span> <span>Start</span>',
      '98': '<span style="font-size: 20px;">&#x229E;</span> <span>Start</span>',
      'xp': `
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path d="M10,2 L18,6 L18,14 L10,18 L2,14 L2,6 Z" fill="#5DB854"/>
          <path d="M10,2 L18,6 L10,10 Z" fill="#8DD887"/>
          <path d="M10,10 L18,14 L10,18 Z" fill="#3D8B3D"/>
          <path d="M2,6 L10,10 L10,2 Z" fill="#FFB900"/>
          <path d="M2,14 L10,18 L10,10 Z" fill="#FF6C00"/>
        </svg>
        <span>start</span>
      `,
      '7': `
        <svg width="24" height="24" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="11" fill="url(#win7-gradient)"/>
          <defs>
            <linearGradient id="win7-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#5BC0DE;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#0275D8;stop-opacity:1" />
            </linearGradient>
          </defs>
          <path d="M6,6 L11,6 L11,11 L6,11 Z M13,6 L18,6 L18,11 L13,11 Z M6,13 L11,13 L11,18 L6,18 Z M13,13 L18,13 L18,18 L13,18 Z" fill="white"/>
        </svg>
      `,
      '10': `
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path d="M2,2 L9,2 L9,9 L2,9 Z M11,2 L18,2 L18,9 L11,9 Z M2,11 L9,11 L9,18 L2,18 Z M11,11 L18,11 L18,18 L11,18 Z" fill="currentColor"/>
        </svg>
      `,
      '11': `
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path d="M2,2 L9,2 L9,9 L2,9 Z M11,2 L18,2 L18,9 L11,9 Z M2,11 L9,11 L9,18 L2,18 Z M11,11 L18,11 L18,18 L11,18 Z" fill="currentColor"/>
        </svg>
      `
    };

    return logos[this.config.mode] || logos['xp'];
  }

  /**
   * Create quick launch area
   */
  _createQuickLaunch() {
    const quickLaunch = document.createElement('div');
    quickLaunch.className = 'taskbar-quick-launch';
    quickLaunch.style.cssText = `
      display: flex;
      gap: 2px;
      padding: 0 8px;
      border-right: 1px solid rgba(255,255,255,0.2);
      margin-right: 4px;
    `;

    // Add some default quick launch icons
    const defaultIcons = ['🌐', '📧', '📁'];
    defaultIcons.forEach(icon => {
      const btn = document.createElement('button');
      btn.className = 'quick-launch-icon';
      btn.textContent = icon;
      btn.style.cssText = `
        width: 28px;
        height: 28px;
        border: none;
        background: transparent;
        cursor: pointer;
        font-size: 16px;
        border-radius: 2px;
        transition: background 0.1s;
      `;
      btn.addEventListener('mouseenter', () => {
        btn.style.background = 'rgba(255,255,255,0.1)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.background = 'transparent';
      });
      quickLaunch.appendChild(btn);
    });

    return quickLaunch;
  }

  /**
   * Create system tray
   */
  _createSystemTray() {
    const tray = document.createElement('div');
    tray.className = 'taskbar-system-tray';
    tray.style.cssText = `
      display: flex;
      gap: 8px;
      padding: 0 8px;
      align-items: center;
      border-left: 1px solid rgba(255,255,255,0.2);
    `;

    // Add system tray icons
    const trayIcons = ['🔊', '🌐', '🔋'];
    trayIcons.forEach(icon => {
      const trayIcon = document.createElement('span');
      trayIcon.className = 'tray-icon';
      trayIcon.textContent = icon;
      trayIcon.style.cssText = `
        cursor: pointer;
        font-size: 14px;
        padding: 4px;
        border-radius: 2px;
        transition: background 0.1s;
      `;
      trayIcon.addEventListener('mouseenter', () => {
        trayIcon.style.background = 'rgba(255,255,255,0.1)';
      });
      trayIcon.addEventListener('mouseleave', () => {
        trayIcon.style.background = 'transparent';
      });
      tray.appendChild(trayIcon);
    });

    return tray;
  }

  /**
   * Create clock
   */
  _createClock() {
    const clock = document.createElement('div');
    clock.className = 'taskbar-clock';
    clock.style.cssText = `
      padding: 0 12px;
      font-family: 'Tahoma', 'MS Sans Serif', sans-serif;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 2px;
      transition: background 0.1s;
    `;

    this._updateClock(clock);
    this.clockInterval = setInterval(() => this._updateClock(clock), 1000);

    clock.addEventListener('mouseenter', () => {
      clock.style.background = 'rgba(255,255,255,0.1)';
    });
    clock.addEventListener('mouseleave', () => {
      clock.style.background = 'transparent';
    });

    return clock;
  }

  /**
   * Update clock display
   */
  _updateClock(clockElement) {
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

    if (['95', '98', 'xp'].includes(this.config.mode)) {
      clockElement.innerHTML = `<div style="line-height: 1.2;">${time}</div>`;
    } else {
      clockElement.innerHTML = `
        <div style="line-height: 1;">${time}</div>
        <div style="line-height: 1; font-size: 10px; opacity: 0.8;">${date}</div>
      `;
    }
  }

  /**
   * Apply theme based on mode
   */
  _applyTheme() {
    const themes = {
      '95': {
        background: 'linear-gradient(to bottom, #c0c0c0 0%, #808080 100%)',
        color: '#000',
        startButtonBg: '#c0c0c0',
        startButtonActiveBg: '#808080',
        taskButtonBg: '#c0c0c0',
        taskButtonActiveBg: '#00007f',
        taskButtonActiveColor: '#fff'
      },
      '98': {
        background: 'linear-gradient(to bottom, #c0c0c0 0%, #808080 100%)',
        color: '#000',
        startButtonBg: '#c0c0c0',
        startButtonActiveBg: '#808080',
        taskButtonBg: '#c0c0c0',
        taskButtonActiveBg: '#00007f',
        taskButtonActiveColor: '#fff'
      },
      'xp': {
        background: 'linear-gradient(to bottom, #245edb 0%, #3f8cf3 50%, #245edb 100%)',
        color: '#fff',
        startButtonBg: 'linear-gradient(to bottom, #5ecd5e 0%, #2d9b2d 100%)',
        startButtonActiveBg: 'linear-gradient(to bottom, #4db84d 0%, #267326 100%)',
        taskButtonBg: 'linear-gradient(to bottom, #3f8cf3 0%, #245edb 100%)',
        taskButtonActiveBg: 'linear-gradient(to bottom, #5ecd5e 0%, #2d9b2d 100%)',
        taskButtonActiveColor: '#fff'
      },
      '7': {
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
        color: '#fff',
        startButtonBg: 'transparent',
        startButtonActiveBg: 'rgba(255, 255, 255, 0.2)',
        taskButtonBg: 'rgba(255, 255, 255, 0.1)',
        taskButtonActiveBg: 'rgba(255, 255, 255, 0.3)',
        taskButtonActiveColor: '#fff',
        borderTop: '1px solid rgba(255, 255, 255, 0.3)'
      },
      '10': {
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(20px)',
        color: '#fff',
        startButtonBg: 'transparent',
        startButtonActiveBg: 'rgba(255, 255, 255, 0.1)',
        taskButtonBg: 'transparent',
        taskButtonActiveBg: 'rgba(255, 255, 255, 0.2)',
        taskButtonActiveColor: '#fff',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      },
      '11': {
        background: 'rgba(243, 243, 243, 0.9)',
        backdropFilter: 'blur(40px)',
        color: '#000',
        startButtonBg: 'transparent',
        startButtonActiveBg: 'rgba(0, 0, 0, 0.05)',
        taskButtonBg: 'transparent',
        taskButtonActiveBg: 'rgba(0, 0, 0, 0.08)',
        taskButtonActiveColor: '#000',
        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
        borderRadius: '8px'
      }
    };

    const theme = themes[this.config.mode] || themes['xp'];

    this.elements.taskbar.style.background = theme.background;
    this.elements.taskbar.style.color = theme.color;

    if (theme.backdropFilter) {
      this.elements.taskbar.style.backdropFilter = theme.backdropFilter;
    }

    if (theme.borderTop) {
      this.elements.taskbar.style.borderTop = theme.borderTop;
    }

    if (theme.borderRadius && this.config.mode === '11') {
      this.elements.taskbar.style.borderRadius = theme.borderRadius;
      this.elements.taskbar.style.left = '8px';
      this.elements.taskbar.style.right = '8px';
      this.elements.taskbar.style.bottom = '8px';
    }

    // Apply start button theme
    this.elements.startButton.style.background = theme.startButtonBg;
    this.elements.startButton.style.color = theme.color;

    this.theme = theme;
  }

  /**
   * Add window to taskbar
   */
  addWindow(windowInfo) {
    if (this.windows.has(windowInfo.id)) {
      return;
    }

    const taskButton = this._createTaskButton(windowInfo);
    this.windows.set(windowInfo.id, {
      info: windowInfo,
      element: taskButton
    });

    this.elements.taskButtons.appendChild(taskButton);
    this._updateTaskButtonSizes();
  }

  /**
   * Create task button for window
   */
  _createTaskButton(windowInfo) {
    const button = document.createElement('button');
    button.className = 'taskbar-task-button';
    button.dataset.windowId = windowInfo.id;

    const baseStyle = `
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 12px;
      border: none;
      cursor: pointer;
      font-family: 'Tahoma', 'MS Sans Serif', sans-serif;
      font-size: 12px;
      transition: all 0.15s;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `;

    if (['10', '11'].includes(this.config.mode)) {
      button.style.cssText = baseStyle + `
        min-width: 48px;
        height: 48px;
        justify-content: center;
        flex-direction: column;
        background: ${this.theme.taskButtonBg};
        border-radius: 4px;
      `;
    } else {
      button.style.cssText = baseStyle + `
        height: ${this.config.height - 8}px;
        min-width: 150px;
        max-width: 200px;
        background: ${this.theme.taskButtonBg};
        border-radius: 2px;
      `;
    }

    // Icon
    if (windowInfo.icon) {
      const icon = document.createElement('span');
      icon.textContent = windowInfo.icon;
      icon.style.fontSize = '16px';
      button.appendChild(icon);
    }

    // Title
    if (!['10', '11'].includes(this.config.mode) || !this.config.centerAlign) {
      const title = document.createElement('span');
      title.textContent = windowInfo.title;
      title.style.cssText = 'overflow: hidden; text-overflow: ellipsis;';
      button.appendChild(title);
    }

    // Active indicator for Windows 11
    if (this.config.mode === '11') {
      const indicator = document.createElement('div');
      indicator.className = 'task-indicator';
      indicator.style.cssText = `
        position: absolute;
        bottom: 2px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 4px;
        background: #0078d4;
        border-radius: 2px;
        display: none;
      `;
      button.style.position = 'relative';
      button.appendChild(indicator);
    }

    // Event listeners
    button.addEventListener('click', () => this._handleTaskButtonClick(windowInfo.id));
    button.addEventListener('mouseenter', () => {
      if (this.activeWindow !== windowInfo.id) {
        button.style.background = 'rgba(255,255,255,0.15)';
      }
    });
    button.addEventListener('mouseleave', () => {
      if (this.activeWindow !== windowInfo.id) {
        button.style.background = this.theme.taskButtonBg;
      }
    });

    return button;
  }

  /**
   * Remove window from taskbar
   */
  removeWindow(windowId) {
    const window = this.windows.get(windowId);
    if (!window) return;

    window.element.remove();
    this.windows.delete(windowId);

    if (this.activeWindow === windowId) {
      this.activeWindow = null;
    }

    this._updateTaskButtonSizes();
  }

  /**
   * Set active window
   */
  setActiveWindow(windowId) {
    // Deactivate previous active window
    if (this.activeWindow) {
      const prevWindow = this.windows.get(this.activeWindow);
      if (prevWindow) {
        prevWindow.element.style.background = this.theme.taskButtonBg;
        prevWindow.element.style.color = this.theme.color;

        const indicator = prevWindow.element.querySelector('.task-indicator');
        if (indicator) indicator.style.display = 'none';
      }
    }

    // Activate new window
    this.activeWindow = windowId;
    const window = this.windows.get(windowId);
    if (window) {
      window.element.style.background = this.theme.taskButtonActiveBg;
      window.element.style.color = this.theme.taskButtonActiveColor;

      const indicator = window.element.querySelector('.task-indicator');
      if (indicator) indicator.style.display = 'block';
    }
  }

  /**
   * Handle task button click
   */
  _handleTaskButtonClick(windowId) {
    if (this.activeWindow === windowId) {
      // Minimize if already active
      this._dispatchEvent('windowMinimize', { windowId });
    } else {
      // Activate window
      this.setActiveWindow(windowId);
      this._dispatchEvent('windowActivate', { windowId });
    }
  }

  /**
   * Update task button sizes to fit available space
   */
  _updateTaskButtonSizes() {
    const windowCount = this.windows.size;
    if (windowCount === 0) return;

    const availableWidth = this.elements.taskButtons.offsetWidth;
    const buttonWidth = Math.max(150, Math.floor(availableWidth / windowCount) - 8);

    this.windows.forEach(window => {
      if (!['10', '11'].includes(this.config.mode)) {
        window.element.style.maxWidth = `${buttonWidth}px`;
      }
    });
  }

  /**
   * Toggle Start menu
   */
  _toggleStartMenu() {
    this.startMenuOpen = !this.startMenuOpen;

    if (this.startMenuOpen) {
      this.elements.startButton.style.background = this.theme.startButtonActiveBg;
    } else {
      this.elements.startButton.style.background = this.theme.startButtonBg;
    }

    this._dispatchEvent('startMenuToggle', { open: this.startMenuOpen });
  }

  /**
   * Enable auto-hide functionality
   */
  _enableAutoHide() {
    let hideTimeout;

    this.elements.taskbar.addEventListener('mouseenter', () => {
      clearTimeout(hideTimeout);
      this.elements.taskbar.style.transform = 'translateY(0)';
    });

    this.elements.taskbar.addEventListener('mouseleave', () => {
      hideTimeout = setTimeout(() => {
        this.elements.taskbar.style.transform = `translateY(${this.config.height - 2}px)`;
      }, 1000);
    });

    // Initial hide
    this.elements.taskbar.style.transition = 'transform 0.3s ease';
    this.elements.taskbar.style.transform = `translateY(${this.config.height - 2}px)`;
  }

  /**
   * Attach event listeners
   */
  _attachEventListeners() {
    // Resize handler
    this.eventHandlers.resize = () => this._updateTaskButtonSizes();
    window.addEventListener('resize', this.eventHandlers.resize);
  }

  /**
   * Set theme configuration
   */
  setTheme(themeConfig) {
    this.config = { ...this.config, ...themeConfig };
    this._applyTheme();
  }

  /**
   * Dispatch custom event
   */
  _dispatchEvent(eventName, detail) {
    const event = new CustomEvent(`taskbar:${eventName}`, { detail });
    this.elements.taskbar.dispatchEvent(event);
  }

  /**
   * Clean up component
   */
  destroy() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }

    window.removeEventListener('resize', this.eventHandlers.resize);

    if (this.elements.taskbar) {
      this.elements.taskbar.remove();
    }

    this.windows.clear();
    this.elements = {};
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WindowsTaskbar;
}
