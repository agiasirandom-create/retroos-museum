/**
 * Mac OS X Desktop Manager
 * Main desktop controller that coordinates all components
 */

class MacOSXDesktop {
  constructor() {
    this.menuBar = null;
    this.dock = null;
    this.windowSystem = null;
    this.apps = new Map();
  }

  init() {
    console.log('Initializing Mac OS X Cheetah Desktop...');

    // Initialize menu bar
    this.menuBar = new MacOSXMenuBar();
    this.menuBar.init();

    // Initialize dock
    this.dock = new MacOSXDock();
    this.dock.init();

    // Initialize window system
    this.windowSystem = new MacOSXWindowSystem();

    // Setup desktop icons
    this.setupDesktopIcons();

    // Register event listeners
    this.setupEventListeners();

    // Show welcome message
    this.showWelcome();

    console.log('Mac OS X Cheetah Desktop initialized successfully!');
  }

  setupDesktopIcons() {
    const iconsContainer = document.getElementById('desktop-icons');
    if (!iconsContainer) return;

    const icons = [
      {
        id: 'macintosh_hd',
        name: 'Macintosh HD',
        icon: '💾',
        action: () => this.launchApp('finder', { folder: 'root' })
      }
    ];

    icons.forEach(iconData => {
      const icon = this.createDesktopIcon(iconData);
      iconsContainer.appendChild(icon);
    });
  }

  createDesktopIcon(data) {
    const icon = document.createElement('div');
    icon.className = 'desktop-icon';
    icon.dataset.iconId = data.id;

    const image = document.createElement('div');
    image.className = 'desktop-icon-image';
    image.style.fontSize = '64px';
    image.textContent = data.icon;
    icon.appendChild(image);

    const label = document.createElement('div');
    label.className = 'desktop-icon-label';
    label.textContent = data.name;
    icon.appendChild(label);

    // Double-click to open
    icon.addEventListener('dblclick', () => {
      if (data.action) {
        data.action();
      }
    });

    // Single click to select
    icon.addEventListener('click', () => {
      document.querySelectorAll('.desktop-icon').forEach(i => {
        i.classList.remove('selected');
      });
      icon.classList.add('selected');
    });

    return icon;
  }

  setupEventListeners() {
    // Listen for app launch requests from dock
    document.addEventListener('macosx-launch-app', (e) => {
      this.launchApp(e.detail.appId, e.detail.options);
    });

    // Listen for app quit requests
    document.addEventListener('macosx-quit-app', (e) => {
      this.quitApp(e.detail.appId);
    });

    // Listen for app hide requests
    document.addEventListener('macosx-hide-app', (e) => {
      this.hideApp(e.detail.appId);
    });

    // Listen for app show requests
    document.addEventListener('macosx-focus-app', (e) => {
      this.showApp(e.detail.appId);
    });

    // Listen for menu actions
    document.addEventListener('macosx-menu-action', (e) => {
      this.handleMenuAction(e.detail.action);
    });

    // Deselect desktop icons when clicking empty space
    document.getElementById('desktop-area').addEventListener('click', (e) => {
      if (e.target.id === 'desktop-area' || e.target.id === 'desktop-icons') {
        document.querySelectorAll('.desktop-icon').forEach(icon => {
          icon.classList.remove('selected');
        });
      }
    });
  }

  launchApp(appId, options = {}) {
    console.log('Launching app:', appId);

    // Mark app as running in dock
    this.dock.setAppRunning(appId, true);

    // Check if app has an existing window
    const existingWindows = this.windowSystem.getWindowsByApp(appId);
    if (existingWindows.length > 0) {
      // Focus existing window
      const firstWindow = existingWindows.find(w => !w.minimized);
      if (firstWindow) {
        if (firstWindow.hidden) {
          this.windowSystem.showAppWindows(appId);
        } else {
          this.windowSystem.focusWindow(firstWindow.id);
        }
        return;
      } else {
        // Restore first minimized window
        this.windowSystem.restoreWindow(existingWindows[0].id);
        return;
      }
    }

    // Launch new app instance
    switch (appId) {
      case 'finder':
        if (window.MacOSXFinder) {
          const finder = new MacOSXFinder(this.windowSystem);
          finder.launch(options);
          this.apps.set(appId, finder);
        }
        break;

      case 'textedit':
        if (window.MacOSXTextEdit) {
          const textEdit = new MacOSXTextEdit(this.windowSystem);
          textEdit.launch();
          this.apps.set(appId, textEdit);
        }
        break;

      case 'terminal':
        if (window.MacOSXTerminal) {
          const terminal = new MacOSXTerminal(this.windowSystem);
          terminal.launch();
          this.apps.set(appId, terminal);
        }
        break;

      case 'system_preferences':
        if (window.MacOSXSystemPreferences) {
          const sysPrefs = new MacOSXSystemPreferences(this.windowSystem);
          sysPrefs.launch();
          this.apps.set(appId, sysPrefs);
        }
        break;

      case 'mail':
      case 'safari':
      case 'itunes':
        this.showComingSoon(appId);
        break;

      default:
        console.warn('Unknown app:', appId);
    }
  }

  quitApp(appId) {
    console.log('Quitting app:', appId);

    // Close all app windows
    this.windowSystem.closeAppWindows(appId);

    // Remove from apps map
    this.apps.delete(appId);

    // Update dock
    this.dock.setAppRunning(appId, false);
  }

  hideApp(appId) {
    console.log('Hiding app:', appId);
    this.windowSystem.hideAppWindows(appId);
  }

  showApp(appId) {
    console.log('Showing app:', appId);
    this.windowSystem.showAppWindows(appId);
  }

  handleMenuAction(action) {
    console.log('Handling menu action:', action);

    switch (action) {
      case 'newWindow':
        this.launchApp('finder');
        break;

      case 'newFolder':
        alert('New Folder (Demo mode)');
        break;

      case 'closeWindow':
        if (this.windowSystem.activeWindow) {
          this.windowSystem.closeWindow(this.windowSystem.activeWindow);
        }
        break;

      case 'minimizeWindow':
        if (this.windowSystem.activeWindow) {
          this.windowSystem.minimizeWindow(this.windowSystem.activeWindow);
        }
        break;
    }
  }

  showWelcome() {
    // Show a welcome window after a brief delay
    setTimeout(() => {
      const content = `
        <div style="padding: 30px; font-family: 'Lucida Grande', sans-serif; text-align: center;">
          <div style="font-size: 64px; margin-bottom: 20px;">🍎</div>
          <h1 style="margin: 0 0 10px 0; font-size: 24px; font-weight: normal;">
            Welcome to Mac OS X
          </h1>
          <p style="margin: 20px 0; color: #666; font-size: 14px;">
            Experience the revolutionary Aqua interface with translucent elements,
            the Dock, and the power of Unix.
          </p>
          <p style="margin: 20px 0; font-size: 13px; color: #888;">
            This is a faithful recreation of Mac OS X 10.0 Cheetah (2001)<br>
            built for the RetroOS Museum.
          </p>
          <div style="margin-top: 30px; padding: 20px; background: rgba(74, 144, 226, 0.1); border-radius: 8px;">
            <h3 style="margin: 0 0 10px 0; font-size: 14px;">Try These Features:</h3>
            <ul style="text-align: left; margin: 10px 0; padding-left: 20px; font-size: 13px; line-height: 1.8;">
              <li>Click apps in the Dock to launch them</li>
              <li>Hover over the Dock for magnification effect</li>
              <li>Drag windows by their title bars</li>
              <li>Click the traffic lights (red, yellow, green)</li>
              <li>Right-click Dock icons for options</li>
              <li>Try the menu bar at the top</li>
            </ul>
          </div>
          <div style="margin-top: 30px;">
            <button class="aqua-button primary" onclick="window.windowManager.closeWindow(this.closest('.window').id)">
              Get Started
            </button>
          </div>
        </div>
      `;

      this.windowSystem.createWindow({
        title: 'Welcome to Mac OS X',
        content: content,
        width: 500,
        height: 550,
        center: true,
        resizable: false,
        appName: 'Setup Assistant'
      });
    }, 500);
  }

  showComingSoon(appId) {
    const appNames = {
      mail: 'Mail',
      safari: 'Internet Explorer',
      itunes: 'iTunes'
    };

    const content = `
      <div style="padding: 40px; text-align: center; font-family: 'Lucida Grande', sans-serif;">
        <div style="font-size: 48px; margin-bottom: 20px;">🚧</div>
        <h2 style="margin: 10px 0; font-size: 18px;">${appNames[appId] || 'This App'}</h2>
        <p style="margin: 20px 0; color: #666;">
          This application is coming soon to the RetroOS Museum.
        </p>
        <div style="margin-top: 30px;">
          <button class="aqua-button primary" onclick="window.windowManager.closeWindow(this.closest('.window').id)">OK</button>
        </div>
      </div>
    `;

    this.windowSystem.createWindow({
      title: appNames[appId] || 'Coming Soon',
      content: content,
      width: 400,
      height: 300,
      center: true,
      resizable: false,
      appId: appId
    });
  }
}

// Make available globally
window.MacOSXDesktop = MacOSXDesktop;

// Compatibility with window-manager.js
if (!window.windowManager) {
  window.windowManager = {
    createWindow: function(options) {
      if (window.macosx && window.macosx.windowSystem) {
        return window.macosx.windowSystem.createWindow(options);
      }
    },
    closeWindow: function(windowId) {
      if (window.macosx && window.macosx.windowSystem) {
        window.macosx.windowSystem.closeWindow(windowId);
      }
    }
  };
}
