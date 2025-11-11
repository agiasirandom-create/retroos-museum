/**
 * Windows 7 Taskbar (Superbar)
 * Handles taskbar functionality, app buttons, and thumbnail previews
 */

class Win7Taskbar {
  constructor(desktop) {
    this.desktop = desktop;
    this.taskbar = null;
    this.appsContainer = null;
    this.windowButtons = new Map();
    this.pinnedApps = [
      { id: 'explorer', name: 'Windows Explorer', icon: '📁' },
      { id: 'ie', name: 'Internet Explorer', icon: '🌐' },
      { id: 'media-player', name: 'Windows Media Player', icon: '🎵' }
    ];
  }

  /**
   * Initialize taskbar
   */
  init() {
    this.taskbar = document.getElementById('win7-taskbar');
    this.appsContainer = document.getElementById('taskbar-apps');

    if (!this.taskbar) {
      console.error('Taskbar element not found');
      return;
    }

    this.setupClock();
    this.setupStartButton();
    this.setupPinnedApps();
    this.setupSystemTray();
  }

  /**
   * Setup clock
   */
  setupClock() {
    const clockElement = document.getElementById('clock');
    const timeElement = document.getElementById('clock-time');
    const dateElement = document.getElementById('clock-date');

    if (!clockElement || !timeElement || !dateElement) return;

    const updateClock = () => {
      const now = new Date();

      // Format time (12-hour format)
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const timeString = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;

      // Format date
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const year = now.getFullYear();
      const dateString = `${month}/${day}/${year}`;

      timeElement.textContent = timeString;
      dateElement.textContent = dateString;
    };

    updateClock();
    setInterval(updateClock, 1000);

    // Click to show calendar (placeholder)
    clockElement.addEventListener('click', () => {
      console.log('Calendar would open here');
    });
  }

  /**
   * Setup start button
   */
  setupStartButton() {
    const startButton = document.getElementById('start-button');
    if (!startButton) return;

    startButton.addEventListener('click', () => {
      this.desktop.startMenu.toggle();
    });
  }

  /**
   * Setup pinned apps
   */
  setupPinnedApps() {
    if (!this.appsContainer) return;

    this.pinnedApps.forEach(app => {
      const button = this.createAppButton(app);
      this.appsContainer.appendChild(button);
    });
  }

  /**
   * Create app button
   * @param {Object} app - App configuration
   * @returns {HTMLElement} - Button element
   */
  createAppButton(app) {
    const button = document.createElement('button');
    button.className = 'taskbar-app';
    button.dataset.appId = app.id;
    button.setAttribute('aria-label', app.name);
    button.title = app.name;

    const icon = document.createElement('div');
    icon.className = 'taskbar-app-icon';
    icon.textContent = app.icon;
    icon.style.fontSize = '32px';

    button.appendChild(icon);

    // Click to launch or show window
    button.addEventListener('click', () => {
      this.handleAppButtonClick(app.id);
    });

    // Hover to show thumbnails
    let hoverTimeout;
    button.addEventListener('mouseenter', () => {
      hoverTimeout = setTimeout(() => {
        this.showThumbnailsForApp(app.id, button);
      }, 500);
    });

    button.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimeout);
      // Don't hide thumbnails immediately - let user move to them
      setTimeout(() => {
        const thumbnails = document.getElementById('thumbnail-previews');
        if (thumbnails && !thumbnails.matches(':hover')) {
          this.desktop.aero.hideThumbnails();
        }
      }, 300);
    });

    return button;
  }

  /**
   * Handle app button click
   * @param {string} appId - App ID
   */
  handleAppButtonClick(appId) {
    // Find windows for this app
    const windows = this.getWindowsForApp(appId);

    if (windows.length === 0) {
      // Launch app
      this.launchApp(appId);
    } else if (windows.length === 1) {
      // Toggle single window
      const window = windows[0];
      if (window.classList.contains('minimized')) {
        this.desktop.aero.animateWindowRestore(window);
        this.desktop.focusWindow(window);
      } else if (window.classList.contains('active')) {
        this.desktop.minimizeWindow(window);
      } else {
        this.desktop.focusWindow(window);
      }
    } else {
      // Show thumbnails for multiple windows
      const button = this.appsContainer.querySelector(`[data-app-id="${appId}"]`);
      this.showThumbnailsForApp(appId, button);
    }
  }

  /**
   * Get windows for app
   * @param {string} appId - App ID
   * @returns {Array} - Array of window elements
   */
  getWindowsForApp(appId) {
    const windows = [];
    this.windowButtons.forEach((data, windowId) => {
      if (data.appId === appId) {
        const windowEl = document.querySelector(`[data-window-id="${windowId}"]`);
        if (windowEl) {
          windows.push(windowEl);
        }
      }
    });
    return windows;
  }

  /**
   * Launch app
   * @param {string} appId - App ID
   */
  launchApp(appId) {
    switch (appId) {
      case 'explorer':
        this.desktop.openExplorer('Computer');
        break;
      case 'ie':
        this.desktop.createWindow({
          title: 'Internet Explorer',
          icon: '🌐',
          width: 1000,
          height: 700,
          content: '<div style="padding: 20px;">Internet Explorer simulation would go here</div>'
        });
        break;
      case 'media-player':
        this.desktop.createWindow({
          title: 'Windows Media Player',
          icon: '🎵',
          width: 800,
          height: 600,
          content: '<div style="padding: 20px;">Media Player simulation would go here</div>'
        });
        break;
      default:
        console.log('Launch app:', appId);
    }
  }

  /**
   * Show thumbnails for app
   * @param {string} appId - App ID
   * @param {HTMLElement} button - Taskbar button
   */
  showThumbnailsForApp(appId, button) {
    const windows = this.getWindowsForApp(appId);
    if (windows.length > 0) {
      this.desktop.aero.showThumbnails(windows, button);
    }
  }

  /**
   * Add window button to taskbar
   * @param {number} windowId - Window ID
   * @param {Object} options - Window options
   */
  addWindowButton(windowId, options) {
    // Determine app ID from options or generate one
    const appId = options.appId || `app-${windowId}`;

    // Store window button data
    this.windowButtons.set(windowId, {
      appId: appId,
      title: options.title,
      icon: options.icon
    });

    // Find or create app button
    let button = this.appsContainer.querySelector(`[data-app-id="${appId}"]`);
    if (!button) {
      button = this.createAppButton({
        id: appId,
        name: options.title,
        icon: options.icon
      });
      this.appsContainer.appendChild(button);
    }

    // Mark button as active
    button.classList.add('active');
  }

  /**
   * Remove window button from taskbar
   * @param {number} windowId - Window ID
   */
  removeWindowButton(windowId) {
    const data = this.windowButtons.get(windowId);
    if (!data) return;

    this.windowButtons.delete(windowId);

    // Check if there are other windows for this app
    const remainingWindows = this.getWindowsForApp(data.appId);
    if (remainingWindows.length === 0) {
      // Remove app button if not pinned
      const isPinned = this.pinnedApps.some(app => app.id === data.appId);
      if (!isPinned) {
        const button = this.appsContainer.querySelector(`[data-app-id="${data.appId}"]`);
        if (button) {
          button.remove();
        }
      } else {
        // Just remove active state
        const button = this.appsContainer.querySelector(`[data-app-id="${data.appId}"]`);
        if (button) {
          button.classList.remove('active');
        }
      }
    }
  }

  /**
   * Set active window
   * @param {number} windowId - Window ID
   */
  setActiveWindow(windowId) {
    // Remove active state from all buttons
    const allButtons = this.appsContainer.querySelectorAll('.taskbar-app');
    allButtons.forEach(btn => btn.classList.remove('active'));

    // Add active state to this window's button
    const data = this.windowButtons.get(windowId);
    if (data) {
      const button = this.appsContainer.querySelector(`[data-app-id="${data.appId}"]`);
      if (button) {
        button.classList.add('active');
      }
    }
  }

  /**
   * Get window button element
   * @param {number} windowId - Window ID
   * @returns {HTMLElement|null} - Button element
   */
  getWindowButton(windowId) {
    const data = this.windowButtons.get(windowId);
    if (!data) return null;

    return this.appsContainer.querySelector(`[data-app-id="${data.appId}"]`);
  }

  /**
   * Setup system tray
   */
  setupSystemTray() {
    // Show hidden icons button
    const showHiddenBtn = this.taskbar.querySelector('.show-hidden-icons');
    if (showHiddenBtn) {
      showHiddenBtn.addEventListener('click', () => {
        console.log('Show hidden icons');
      });
    }

    // Tray icons
    const trayIcons = this.taskbar.querySelectorAll('.tray-icon');
    trayIcons.forEach(icon => {
      icon.addEventListener('click', () => {
        const title = icon.getAttribute('title');
        console.log('Tray icon clicked:', title);
      });
    });

    // Show desktop button
    const showDesktopBtn = this.taskbar.querySelector('.show-desktop-btn');
    if (showDesktopBtn) {
      // Hover preview is handled by Aero system
      showDesktopBtn.addEventListener('click', () => {
        this.desktop.aero.toggleDesktop();
      });
    }
  }

  /**
   * Show Jump List for app
   * @param {string} appId - App ID
   * @param {HTMLElement} button - Taskbar button
   */
  showJumpList(appId, button) {
    // Create Jump List menu
    const jumpList = document.createElement('div');
    jumpList.className = 'win7-jump-list';

    const buttonRect = button.getBoundingClientRect();
    jumpList.style.left = `${buttonRect.left}px`;
    jumpList.style.bottom = '45px';

    // Add recent items
    const recentHeader = document.createElement('div');
    recentHeader.className = 'jump-list-header';
    recentHeader.textContent = 'Recent';
    jumpList.appendChild(recentHeader);

    const recentItems = [
      'Document 1.txt',
      'Presentation.pptx',
      'Spreadsheet.xlsx'
    ];

    recentItems.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'jump-list-item';
      itemEl.textContent = item;
      jumpList.appendChild(itemEl);
    });

    // Add tasks
    const separator = document.createElement('div');
    separator.className = 'jump-list-separator';
    jumpList.appendChild(separator);

    const tasksHeader = document.createElement('div');
    tasksHeader.className = 'jump-list-header';
    tasksHeader.textContent = 'Tasks';
    jumpList.appendChild(tasksHeader);

    const tasks = ['New Window', 'Open File'];
    tasks.forEach(task => {
      const taskEl = document.createElement('div');
      taskEl.className = 'jump-list-item';
      taskEl.textContent = task;
      jumpList.appendChild(taskEl);
    });

    document.body.appendChild(jumpList);

    // Close on click outside
    setTimeout(() => {
      document.addEventListener('click', function closeJumpList() {
        jumpList.remove();
        document.removeEventListener('click', closeJumpList);
      });
    }, 0);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Win7Taskbar;
}
