/**
 * Mac OS X Dock System
 * Implements the iconic Dock with magnification and icon management
 */

class MacOSXDock {
  constructor() {
    this.dock = document.getElementById('macosx-dock');
    this.iconsContainer = null;
    this.apps = [];
    this.magnificationEnabled = true;
    this.magnificationAmount = 1.5;
  }

  init() {
    this.iconsContainer = this.dock.querySelector('.dock-icons');
    if (!this.iconsContainer) {
      console.error('Dock icons container not found');
      return;
    }

    this.setupDefaultApps();
    this.render();
    this.attachEventListeners();
  }

  setupDefaultApps() {
    this.apps = [
      // Applications section
      { id: 'finder', name: 'Finder', icon: '📁', type: 'app', running: true },
      { id: 'mail', name: 'Mail', icon: '✉️', type: 'app' },
      { id: 'safari', name: 'Internet Explorer', icon: '🌐', type: 'app' },
      { id: 'itunes', name: 'iTunes', icon: '🎵', type: 'app' },
      { id: 'textedit', name: 'TextEdit', icon: '📝', type: 'app' },
      { id: 'terminal', name: 'Terminal', icon: '💻', type: 'app' },
      { id: 'system_preferences', name: 'System Preferences', icon: '⚙️', type: 'app' },

      // Separator
      { type: 'separator' },

      // Documents/Folders section
      { id: 'documents', name: 'Documents', icon: '📄', type: 'folder' },
      { id: 'downloads', name: 'Downloads', icon: '⬇️', type: 'folder' },

      // Trash (always at the end)
      { id: 'trash', name: 'Trash', icon: '🗑️', type: 'trash' }
    ];
  }

  render() {
    if (!this.iconsContainer) return;

    this.iconsContainer.innerHTML = '';

    this.apps.forEach(app => {
      if (app.type === 'separator') {
        const separator = document.createElement('div');
        separator.className = 'dock-separator';
        this.iconsContainer.appendChild(separator);
      } else {
        const icon = this.createDockIcon(app);
        this.iconsContainer.appendChild(icon);
      }
    });
  }

  createDockIcon(app) {
    const icon = document.createElement('div');
    icon.className = 'dock-icon';
    icon.dataset.appId = app.id;

    if (app.running) {
      icon.classList.add('running');
    }

    // Icon image
    const img = document.createElement('div');
    img.style.fontSize = '42px';
    img.textContent = app.icon;
    icon.appendChild(img);

    // Label (shown on hover)
    const label = document.createElement('div');
    label.className = 'dock-icon-label';
    label.textContent = app.name;
    icon.appendChild(label);

    return icon;
  }

  attachEventListeners() {
    // Click handler for dock icons
    this.iconsContainer.addEventListener('click', (e) => {
      const icon = e.target.closest('.dock-icon');
      if (icon) {
        this.handleIconClick(icon);
      }
    });

    // Magnification effect
    if (this.magnificationEnabled) {
      this.iconsContainer.addEventListener('mousemove', (e) => {
        this.handleMagnification(e);
      });

      this.iconsContainer.addEventListener('mouseleave', () => {
        this.resetMagnification();
      });
    }

    // Right-click context menu
    this.iconsContainer.addEventListener('contextmenu', (e) => {
      const icon = e.target.closest('.dock-icon');
      if (icon) {
        e.preventDefault();
        this.showContextMenu(icon, e);
      }
    });
  }

  handleIconClick(icon) {
    const appId = icon.dataset.appId;
    const app = this.apps.find(a => a.id === appId);

    if (!app) return;

    // Add bounce animation
    icon.classList.add('active');
    setTimeout(() => icon.classList.remove('active'), 600);

    // Launch or focus app
    if (app.type === 'trash') {
      this.openTrash();
    } else if (app.type === 'folder') {
      this.openFolder(appId);
    } else if (app.type === 'app') {
      this.launchApp(appId);
    }
  }

  handleMagnification(e) {
    const icons = Array.from(this.iconsContainer.querySelectorAll('.dock-icon'));
    const containerRect = this.iconsContainer.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;

    icons.forEach((icon, index) => {
      const iconRect = icon.getBoundingClientRect();
      const iconCenterX = iconRect.left + iconRect.width / 2 - containerRect.left;
      const distance = Math.abs(mouseX - iconCenterX);

      // Reset classes
      icon.classList.remove('adjacent-1', 'adjacent-2');

      // Calculate scale based on distance
      if (distance < 60) {
        const scale = 1 + (1 - distance / 60) * (this.magnificationAmount - 1);
        const translateY = -10 * (1 - distance / 60);
        icon.style.transform = `scale(${scale}) translateY(${translateY}px)`;
      } else if (distance < 120) {
        const scale = 1 + (1 - distance / 120) * 0.25;
        const translateY = -5 * (1 - distance / 120);
        icon.style.transform = `scale(${scale}) translateY(${translateY}px)`;
      } else {
        icon.style.transform = '';
      }
    });
  }

  resetMagnification() {
    const icons = this.iconsContainer.querySelectorAll('.dock-icon');
    icons.forEach(icon => {
      icon.style.transform = '';
      icon.classList.remove('adjacent-1', 'adjacent-2');
    });
  }

  launchApp(appId) {
    console.log('Launching app:', appId);

    // Mark app as running
    const app = this.apps.find(a => a.id === appId);
    if (app && !app.running) {
      app.running = true;
      const icon = this.iconsContainer.querySelector(`[data-app-id="${appId}"]`);
      if (icon) {
        icon.classList.add('running');
      }
    }

    // Dispatch event for the desktop to handle
    const event = new CustomEvent('macosx-launch-app', {
      detail: { appId }
    });
    document.dispatchEvent(event);
  }

  openFolder(folderId) {
    console.log('Opening folder:', folderId);

    // Open folder in Finder
    if (window.macosx && window.macosx.launchApp) {
      window.macosx.launchApp('finder', { folder: folderId });
    }
  }

  openTrash() {
    console.log('Opening Trash');

    // Open Trash in Finder
    if (window.macosx && window.macosx.launchApp) {
      window.macosx.launchApp('finder', { folder: 'trash' });
    }
  }

  showContextMenu(icon, event) {
    const appId = icon.dataset.appId;
    const app = this.apps.find(a => a.id === appId);

    if (!app) return;

    // Create context menu
    const menu = document.createElement('div');
    menu.className = 'menu-dropdown active';
    menu.style.position = 'fixed';
    menu.style.left = `${event.clientX}px`;
    menu.style.bottom = `${window.innerHeight - event.clientY}px`;
    menu.style.top = 'auto';

    const items = this.getContextMenuItems(app);

    items.forEach(item => {
      if (item.separator) {
        const separator = document.createElement('div');
        separator.className = 'menu-dropdown-separator';
        menu.appendChild(separator);
      } else {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-dropdown-item';
        menuItem.textContent = item.label;

        menuItem.addEventListener('click', () => {
          item.action();
          menu.remove();
        });

        menu.appendChild(menuItem);
      }
    });

    document.body.appendChild(menu);

    // Close menu when clicking outside
    const closeMenu = (e) => {
      if (!menu.contains(e.target)) {
        menu.remove();
        document.removeEventListener('click', closeMenu);
      }
    };
    setTimeout(() => document.addEventListener('click', closeMenu), 0);
  }

  getContextMenuItems(app) {
    const items = [];

    if (app.type === 'app') {
      if (app.running) {
        items.push({ label: 'Show', action: () => this.showApp(app.id) });
        items.push({ label: 'Hide', action: () => this.hideApp(app.id) });
        items.push({ separator: true });
        items.push({ label: 'Quit', action: () => this.quitApp(app.id) });
      } else {
        items.push({ label: 'Open', action: () => this.launchApp(app.id) });
      }

      if (app.id !== 'finder' && app.id !== 'trash') {
        items.push({ separator: true });
        items.push({ label: 'Remove from Dock', action: () => this.removeFromDock(app.id) });
      }
    } else if (app.type === 'folder') {
      items.push({ label: 'Open', action: () => this.openFolder(app.id) });
      items.push({ separator: true });
      items.push({ label: 'Remove from Dock', action: () => this.removeFromDock(app.id) });
    } else if (app.type === 'trash') {
      items.push({ label: 'Open', action: () => this.openTrash() });
      items.push({ separator: true });
      items.push({ label: 'Empty Trash...', action: () => this.emptyTrash() });
    }

    return items;
  }

  showApp(appId) {
    console.log('Show app:', appId);
    // Focus app windows
    const event = new CustomEvent('macosx-focus-app', { detail: { appId } });
    document.dispatchEvent(event);
  }

  hideApp(appId) {
    console.log('Hide app:', appId);
    // Hide app windows
    const event = new CustomEvent('macosx-hide-app', { detail: { appId } });
    document.dispatchEvent(event);
  }

  quitApp(appId) {
    console.log('Quit app:', appId);

    // Mark app as not running
    const app = this.apps.find(a => a.id === appId);
    if (app) {
      app.running = false;
      const icon = this.iconsContainer.querySelector(`[data-app-id="${appId}"]`);
      if (icon) {
        icon.classList.remove('running');
      }
    }

    // Dispatch event to close app windows
    const event = new CustomEvent('macosx-quit-app', { detail: { appId } });
    document.dispatchEvent(event);
  }

  removeFromDock(appId) {
    console.log('Remove from Dock:', appId);

    const index = this.apps.findIndex(a => a.id === appId);
    if (index !== -1) {
      this.apps.splice(index, 1);
      this.render();
    }
  }

  emptyTrash() {
    const confirmed = confirm('Are you sure you want to permanently erase the items in the Trash?');
    if (confirmed) {
      alert('Trash emptied. (Demo mode)');
    }
  }

  addApp(app) {
    // Add app before the separator
    const separatorIndex = this.apps.findIndex(a => a.type === 'separator');
    if (separatorIndex !== -1) {
      this.apps.splice(separatorIndex, 0, app);
    } else {
      this.apps.push(app);
    }
    this.render();
  }

  setAppRunning(appId, running) {
    const app = this.apps.find(a => a.id === appId);
    if (app) {
      app.running = running;
      const icon = this.iconsContainer.querySelector(`[data-app-id="${appId}"]`);
      if (icon) {
        if (running) {
          icon.classList.add('running');
        } else {
          icon.classList.remove('running');
        }
      }
    }
  }

  bounceIcon(appId) {
    const icon = this.iconsContainer.querySelector(`[data-app-id="${appId}"]`);
    if (icon) {
      icon.classList.add('active');
      setTimeout(() => icon.classList.remove('active'), 600);
    }
  }
}

// Make available globally
window.MacOSXDock = MacOSXDock;
