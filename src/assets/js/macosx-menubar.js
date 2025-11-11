/**
 * Mac OS X Menu Bar System
 * Implements the global menu bar with Apple menu and application menus
 */

class MacOSXMenuBar {
  constructor() {
    this.menubar = document.getElementById('macosx-menubar');
    this.activeMenu = null;
    this.currentApp = 'Finder';
    this.menus = this.getDefaultMenus();
  }

  init() {
    this.render();
    this.attachEventListeners();
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
  }

  getDefaultMenus() {
    return {
      apple: {
        icon: '\uF8FF', // Apple logo approximation
        items: [
          { label: 'About This Mac', action: 'aboutMac' },
          { separator: true },
          { label: 'System Preferences...', action: 'systemPrefs' },
          { label: 'Dock', submenu: ['Turn Hiding On', 'Position on Left', 'Position on Bottom', 'Position on Right'] },
          { separator: true },
          { label: 'Recent Items', submenu: ['Applications', 'Documents', 'Servers'] },
          { label: 'Force Quit...', action: 'forceQuit', shortcut: '⌥⌘⎋' },
          { separator: true },
          { label: 'Sleep', action: 'sleep' },
          { label: 'Restart...', action: 'restart' },
          { label: 'Shut Down...', action: 'shutdown' }
        ]
      },
      app: {
        label: 'Finder',
        items: [
          { label: 'About Finder', action: 'aboutApp' },
          { separator: true },
          { label: 'Preferences...', action: 'preferences', shortcut: '⌘,' },
          { separator: true },
          { label: 'Hide Finder', action: 'hideApp', shortcut: '⌘H' },
          { label: 'Hide Others', action: 'hideOthers', shortcut: '⌥⌘H' },
          { label: 'Show All', action: 'showAll' },
          { separator: true },
          { label: 'Quit Finder', action: 'quitApp', shortcut: '⌘Q', disabled: true }
        ]
      },
      file: {
        label: 'File',
        items: [
          { label: 'New Finder Window', action: 'newWindow', shortcut: '⌘N' },
          { label: 'New Folder', action: 'newFolder', shortcut: '⇧⌘N' },
          { label: 'Open', action: 'open', shortcut: '⌘O' },
          { label: 'Close Window', action: 'closeWindow', shortcut: '⌘W' },
          { separator: true },
          { label: 'Get Info', action: 'getInfo', shortcut: '⌘I' },
          { label: 'Duplicate', action: 'duplicate', shortcut: '⌘D' },
          { label: 'Make Alias', action: 'makeAlias', shortcut: '⌘L' },
          { label: 'Show Original', action: 'showOriginal', shortcut: '⌘R' },
          { separator: true },
          { label: 'Move to Trash', action: 'moveToTrash', shortcut: '⌘⌫' },
          { label: 'Eject', action: 'eject', shortcut: '⌘E' }
        ]
      },
      edit: {
        label: 'Edit',
        items: [
          { label: 'Undo', action: 'undo', shortcut: '⌘Z' },
          { label: 'Redo', action: 'redo', shortcut: '⇧⌘Z' },
          { separator: true },
          { label: 'Cut', action: 'cut', shortcut: '⌘X' },
          { label: 'Copy', action: 'copy', shortcut: '⌘C' },
          { label: 'Paste', action: 'paste', shortcut: '⌘V' },
          { label: 'Select All', action: 'selectAll', shortcut: '⌘A' }
        ]
      },
      view: {
        label: 'View',
        items: [
          { label: 'as Icons', action: 'viewIcons', shortcut: '⌘1' },
          { label: 'as List', action: 'viewList', shortcut: '⌘2' },
          { label: 'as Columns', action: 'viewColumns', shortcut: '⌘3' },
          { separator: true },
          { label: 'Clean Up', action: 'cleanUp' },
          { label: 'Arrange', submenu: ['by Name', 'by Date Modified', 'by Size', 'by Kind'] },
          { separator: true },
          { label: 'Hide Toolbar', action: 'hideToolbar' },
          { label: 'Customize Toolbar...', action: 'customizeToolbar' }
        ]
      },
      go: {
        label: 'Go',
        items: [
          { label: 'Back', action: 'goBack', shortcut: '⌘[' },
          { label: 'Forward', action: 'goForward', shortcut: '⌘]' },
          { label: 'Enclosing Folder', action: 'goUp', shortcut: '⌘↑' },
          { separator: true },
          { label: 'Computer', action: 'goComputer', shortcut: '⇧⌘C' },
          { label: 'Home', action: 'goHome', shortcut: '⇧⌘H' },
          { label: 'Applications', action: 'goApplications', shortcut: '⇧⌘A' },
          { label: 'Favorites', action: 'goFavorites', shortcut: '⇧⌘F' },
          { separator: true },
          { label: 'Connect to Server...', action: 'connectServer', shortcut: '⌘K' }
        ]
      },
      window: {
        label: 'Window',
        items: [
          { label: 'Minimize Window', action: 'minimizeWindow', shortcut: '⌘M' },
          { label: 'Bring All to Front', action: 'bringAllToFront' },
          { separator: true }
        ]
      },
      help: {
        label: 'Help',
        items: [
          { label: 'Mac Help', action: 'macHelp', shortcut: '⌘?' },
          { separator: true },
          { label: 'About RetroOS Museum', action: 'aboutMuseum' }
        ]
      }
    };
  }

  render() {
    const leftSection = document.createElement('div');
    leftSection.className = 'menubar-left';

    // Apple menu
    const appleMenu = this.createMenuItem('apple', this.menus.apple.icon, true);
    leftSection.appendChild(appleMenu);

    // Application menu
    const appMenu = this.createMenuItem('app', this.currentApp, false, true);
    leftSection.appendChild(appMenu);

    // Standard menus
    ['file', 'edit', 'view', 'go', 'window', 'help'].forEach(menuId => {
      if (this.menus[menuId]) {
        const menuItem = this.createMenuItem(menuId, this.menus[menuId].label);
        leftSection.appendChild(menuItem);
      }
    });

    // Right section (menu extras)
    const rightSection = document.createElement('div');
    rightSection.className = 'menubar-right';

    // Menu extras
    rightSection.innerHTML = `
      <div class="menu-extra" title="Volume">
        <div class="menu-extra-icon">🔊</div>
      </div>
      <div class="menu-extra" title="Network">
        <div class="menu-extra-icon">📡</div>
      </div>
      <div class="menu-extra" title="Battery">
        <div class="menu-extra-icon">🔋</div>
      </div>
      <div class="menu-clock" id="menu-clock">12:00 PM</div>
    `;

    this.menubar.appendChild(leftSection);
    this.menubar.appendChild(rightSection);
  }

  createMenuItem(id, label, isApple = false, isAppName = false) {
    const item = document.createElement('div');
    item.className = `menu-item${isApple ? ' apple-menu' : ''}${isAppName ? ' app-name' : ''}`;
    item.textContent = label;
    item.dataset.menuId = id;
    return item;
  }

  attachEventListeners() {
    // Menu item click handlers
    this.menubar.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const menuId = item.dataset.menuId;
        this.toggleMenu(menuId, item);
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', () => {
      this.closeActiveMenu();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.metaKey || e.ctrlKey) {
        this.handleKeyboardShortcut(e);
      }
    });
  }

  toggleMenu(menuId, menuItem) {
    if (this.activeMenu === menuId) {
      this.closeActiveMenu();
      return;
    }

    this.closeActiveMenu();

    const menu = this.menus[menuId];
    if (!menu) return;

    const dropdown = this.createDropdown(menu.items);
    const rect = menuItem.getBoundingClientRect();
    dropdown.style.left = `${rect.left}px`;

    this.menubar.appendChild(dropdown);
    menuItem.classList.add('active');
    this.activeMenu = menuId;

    // Attach dropdown item listeners
    dropdown.querySelectorAll('.menu-dropdown-item').forEach(item => {
      if (!item.classList.contains('disabled')) {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const action = item.dataset.action;
          if (action) {
            this.executeMenuAction(action);
          }
          this.closeActiveMenu();
        });
      }
    });
  }

  createDropdown(items) {
    const dropdown = document.createElement('div');
    dropdown.className = 'menu-dropdown active';

    items.forEach(item => {
      if (item.separator) {
        const separator = document.createElement('div');
        separator.className = 'menu-dropdown-separator';
        dropdown.appendChild(separator);
      } else {
        const menuItem = document.createElement('div');
        menuItem.className = `menu-dropdown-item${item.disabled ? ' disabled' : ''}`;

        const label = document.createElement('span');
        label.textContent = item.label;
        menuItem.appendChild(label);

        if (item.shortcut) {
          const shortcut = document.createElement('span');
          shortcut.className = 'shortcut';
          shortcut.textContent = item.shortcut;
          menuItem.appendChild(shortcut);
        }

        if (item.action) {
          menuItem.dataset.action = item.action;
        }

        dropdown.appendChild(menuItem);
      }
    });

    return dropdown;
  }

  closeActiveMenu() {
    const activeDropdown = this.menubar.querySelector('.menu-dropdown');
    if (activeDropdown) {
      activeDropdown.remove();
    }

    this.menubar.querySelectorAll('.menu-item.active').forEach(item => {
      item.classList.remove('active');
    });

    this.activeMenu = null;
  }

  executeMenuAction(action) {
    console.log('Menu action:', action);

    // Dispatch custom events for menu actions
    const event = new CustomEvent('macosx-menu-action', {
      detail: { action }
    });
    document.dispatchEvent(event);

    // Handle some actions directly
    switch (action) {
      case 'aboutMac':
        this.showAboutMac();
        break;
      case 'systemPrefs':
        if (window.macosx && window.macosx.launchApp) {
          window.macosx.launchApp('system_preferences');
        }
        break;
      case 'shutdown':
        this.showShutdownDialog();
        break;
      case 'newWindow':
        if (window.macosx && window.macosx.launchApp) {
          window.macosx.launchApp('finder');
        }
        break;
    }
  }

  showAboutMac() {
    if (!window.windowManager) return;

    const content = `
      <div style="padding: 30px; text-align: center; font-family: 'Lucida Grande', sans-serif;">
        <div style="font-size: 48px; margin-bottom: 10px;">🍎</div>
        <h2 style="margin: 10px 0; font-size: 18px;">Mac OS X</h2>
        <p style="margin: 5px 0; color: #666;">Version 10.0.4</p>
        <p style="margin: 15px 0; font-size: 11px; color: #888;">
          Processor: PowerPC G3<br>
          Memory: 128 MB<br>
          Startup Disk: Macintosh HD
        </p>
        <p style="margin: 20px 0; font-size: 10px; color: #999;">
          © 2001 Apple Computer, Inc.<br>
          All Rights Reserved.
        </p>
        <div style="margin-top: 20px;">
          <button class="aqua-button primary" onclick="window.windowManager.closeWindow(this.closest('.window').id)">OK</button>
        </div>
      </div>
    `;

    window.windowManager.createWindow({
      title: 'About This Mac',
      content: content,
      width: 350,
      height: 350,
      resizable: false,
      center: true
    });
  }

  showShutdownDialog() {
    if (!window.windowManager) return;

    const content = `
      <div style="padding: 30px; text-align: center; font-family: 'Lucida Grande', sans-serif;">
        <div style="font-size: 48px; margin-bottom: 20px;">⏻</div>
        <p style="margin: 20px 0; font-size: 14px;">
          Are you sure you want to shut down your computer now?
        </p>
        <div style="margin-top: 30px; display: flex; gap: 10px; justify-content: center;">
          <button class="aqua-button" onclick="window.windowManager.closeWindow(this.closest('.window').id)">Cancel</button>
          <button class="aqua-button primary" onclick="alert('Shutting down... (Demo mode)'); window.windowManager.closeWindow(this.closest('.window').id);">Shut Down</button>
        </div>
      </div>
    `;

    window.windowManager.createWindow({
      title: 'Shut Down',
      content: content,
      width: 350,
      height: 200,
      resizable: false,
      center: true,
      showControls: false
    });
  }

  updateClock() {
    const clockEl = document.getElementById('menu-clock');
    if (!clockEl) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    clockEl.textContent = timeStr;
  }

  setCurrentApp(appName) {
    this.currentApp = appName;
    const appMenuItem = this.menubar.querySelector('.menu-item.app-name');
    if (appMenuItem) {
      appMenuItem.textContent = appName;
    }
  }

  handleKeyboardShortcut(e) {
    // Handle common keyboard shortcuts
    const key = e.key.toLowerCase();

    if (e.metaKey || e.ctrlKey) {
      switch (key) {
        case 'n':
          if (e.shiftKey) {
            this.executeMenuAction('newFolder');
          } else {
            this.executeMenuAction('newWindow');
          }
          e.preventDefault();
          break;
        case 'w':
          this.executeMenuAction('closeWindow');
          e.preventDefault();
          break;
        case 'q':
          this.executeMenuAction('quitApp');
          e.preventDefault();
          break;
      }
    }
  }
}

// Make available globally
window.MacOSXMenuBar = MacOSXMenuBar;
