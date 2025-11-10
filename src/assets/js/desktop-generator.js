/**
 * Desktop Generator
 * Generates desktop environment from OS configuration
 */

class DesktopGenerator {
  constructor(windowManager, themeEngine) {
    this.windowManager = windowManager;
    this.themeEngine = themeEngine;
    this.desktopElement = null;
    this.iconPositions = new Map();
  }

  /**
   * Generate desktop from configuration
   */
  generateDesktop(config) {
    this.desktopElement = document.querySelector('.desktop') || this.createDesktopElement();

    // Clear existing desktop
    this.desktopElement.innerHTML = '';

    // Generate desktop icons
    if (config.paradigm.desktop && config.paradigm.desktop.items) {
      this.generateDesktopIcons(config);
    }

    // Generate taskbar if applicable
    if (config.paradigm.taskManagement && config.paradigm.taskManagement.type === 'taskbar') {
      this.generateTaskbar(config);
    }

    // Generate dock if applicable
    if (config.paradigm.taskManagement && config.paradigm.taskManagement.type === 'dock') {
      this.generateDock(config);
    }

    // Generate menu bar if global
    if (config.paradigm.menuSystem && config.paradigm.menuSystem.type === 'global_menu') {
      this.generateMenuBar(config);
    }

    return this.desktopElement;
  }

  /**
   * Create desktop element if it doesn't exist
   */
  createDesktopElement() {
    const desktop = document.createElement('div');
    desktop.className = 'desktop';
    document.body.appendChild(desktop);
    return desktop;
  }

  /**
   * Generate desktop icons
   */
  generateDesktopIcons(config) {
    const apps = config.components.applications || [];
    const desktopConfig = config.paradigm.desktop;
    const layout = desktopConfig.layout;

    let iconContainer = this.desktopElement.querySelector('.desktop-icons');
    if (!iconContainer) {
      iconContainer = document.createElement('div');
      iconContainer.className = 'desktop-icons';
      this.desktopElement.appendChild(iconContainer);
    }

    // Filter apps that should appear on desktop
    const desktopApps = apps.filter(app => app.desktop && app.desktop.icon);

    desktopApps.forEach((app, index) => {
      const icon = this.createDesktopIcon(app, config);

      // Position icon
      if (app.desktop.position) {
        icon.style.position = 'absolute';
        icon.style.left = `${app.desktop.position.x}px`;
        icon.style.top = `${app.desktop.position.y}px`;
      } else if (layout && layout.type === 'grid') {
        this.positionIconInGrid(icon, index, layout);
      }

      iconContainer.appendChild(icon);
    });

    // Set up icon interactions
    this.setupIconInteractions(config);
  }

  /**
   * Create desktop icon element
   */
  createDesktopIcon(app, config) {
    const icon = document.createElement('div');
    icon.className = 'desktop-icon';
    icon.dataset.appId = app.id;

    // Icon image
    const iconImage = document.createElement('div');
    iconImage.className = 'desktop-icon-image';

    if (app.icon) {
      const img = document.createElement('img');
      img.src = app.icon;
      img.alt = app.name;
      img.onerror = () => {
        // Fallback to emoji or text
        iconImage.innerHTML = this.getIconFallback(app.type);
      };
      iconImage.appendChild(img);
    } else {
      iconImage.innerHTML = this.getIconFallback(app.type);
    }

    icon.appendChild(iconImage);

    // Icon label
    const label = document.createElement('div');
    label.className = 'desktop-icon-label';
    label.textContent = app.name;
    icon.appendChild(label);

    // Double-click to open (or single-click for Mac)
    const clickType = config.paradigm.desktop.interaction.click;
    if (clickType === 'double') {
      icon.addEventListener('dblclick', () => this.openApp(app, config));
    } else {
      icon.addEventListener('click', () => this.openApp(app, config));
    }

    return icon;
  }

  /**
   * Get fallback icon based on app type
   */
  getIconFallback(type) {
    const fallbacks = {
      'system': '💻',
      'productivity': '📝',
      'utility': '🔧',
      'game': '🎮',
      'creative': '🎨',
      'web': '🌐',
      'folder': '📁',
      'file': '📄'
    };

    return fallbacks[type] || '📦';
  }

  /**
   * Position icon in grid layout
   */
  positionIconInGrid(icon, index, layout) {
    const grid = layout.grid;
    const cellWidth = grid.cellWidth || 80;
    const cellHeight = grid.cellHeight || 100;
    const spacing = grid.spacing || 8;

    if (layout.direction === 'vertical') {
      const row = index;
      icon.style.position = 'absolute';
      icon.style.left = `${spacing}px`;
      icon.style.top = `${spacing + row * (cellHeight + spacing)}px`;
    } else {
      const col = index;
      icon.style.position = 'absolute';
      icon.style.left = `${spacing + col * (cellWidth + spacing)}px`;
      icon.style.top = `${spacing}px`;
    }

    icon.style.width = `${cellWidth}px`;
    icon.style.height = `${cellHeight}px`;
  }

  /**
   * Setup icon interactions (drag, selection, etc.)
   */
  setupIconInteractions(config) {
    if (config.paradigm.desktop.interaction.dragAndDrop) {
      this.enableIconDragging();
    }

    if (config.paradigm.desktop.interaction.selection === 'rubber_band') {
      this.enableRubberBandSelection();
    }
  }

  /**
   * Enable icon dragging
   */
  enableIconDragging() {
    const icons = this.desktopElement.querySelectorAll('.desktop-icon');
    icons.forEach(icon => {
      let isDragging = false;
      let startX, startY, offsetX, offsetY;

      icon.addEventListener('mousedown', (e) => {
        if (e.button === 0) { // Left click
          isDragging = true;
          startX = e.clientX;
          startY = e.clientY;
          const rect = icon.getBoundingClientRect();
          offsetX = startX - rect.left;
          offsetY = startY - rect.top;
          icon.classList.add('dragging');
          e.preventDefault();
        }
      });

      document.addEventListener('mousemove', (e) => {
        if (isDragging) {
          icon.style.left = `${e.clientX - offsetX}px`;
          icon.style.top = `${e.clientY - offsetY}px`;
        }
      });

      document.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          icon.classList.remove('dragging');
        }
      });
    });
  }

  /**
   * Enable rubber band selection
   */
  enableRubberBandSelection() {
    // Simplified rubber band selection
    let selecting = false;
    let startX, startY;
    let selectionBox = null;

    this.desktopElement.addEventListener('mousedown', (e) => {
      if (e.target === this.desktopElement || e.target.classList.contains('desktop-icons')) {
        selecting = true;
        startX = e.clientX;
        startY = e.clientY;

        selectionBox = document.createElement('div');
        selectionBox.className = 'selection-box';
        selectionBox.style.left = `${startX}px`;
        selectionBox.style.top = `${startY}px`;
        this.desktopElement.appendChild(selectionBox);
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (selecting && selectionBox) {
        const width = Math.abs(e.clientX - startX);
        const height = Math.abs(e.clientY - startY);
        const left = Math.min(e.clientX, startX);
        const top = Math.min(e.clientY, startY);

        selectionBox.style.left = `${left}px`;
        selectionBox.style.top = `${top}px`;
        selectionBox.style.width = `${width}px`;
        selectionBox.style.height = `${height}px`;
      }
    });

    document.addEventListener('mouseup', () => {
      if (selecting) {
        selecting = false;
        if (selectionBox) {
          selectionBox.remove();
          selectionBox = null;
        }
      }
    });
  }

  /**
   * Open application
   */
  openApp(app, config) {
    // Import app factory dynamically
    if (window.appFactory) {
      const content = window.appFactory.createApp(app, config);
      this.windowManager.createWindow({
        title: app.window.title,
        width: app.window.width,
        height: app.window.height,
        content: content,
        resizable: app.window.resizable,
        minimizable: app.window.minimizable !== false,
        maximizable: app.window.maximizable !== false
      });
    }
  }

  /**
   * Generate Windows-style taskbar
   */
  generateTaskbar(config) {
    let taskbar = document.querySelector('.taskbar');
    if (!taskbar) {
      taskbar = document.createElement('div');
      taskbar.className = 'taskbar';
      document.body.appendChild(taskbar);
    }

    const tbConfig = config.paradigm.taskManagement.taskbar;

    // Position taskbar
    taskbar.style.position = 'fixed';
    taskbar.style[tbConfig.position] = '0';
    taskbar.style.height = `${tbConfig.size}px`;

    // Start button (Windows)
    if (tbConfig.sections.start) {
      const startBtn = document.createElement('button');
      startBtn.className = 'start-button';
      startBtn.innerHTML = '<span class="start-icon">⊞</span> Start';
      taskbar.appendChild(startBtn);
    }

    // Task list
    const taskList = document.createElement('div');
    taskList.className = 'task-list';
    taskbar.appendChild(taskList);

    // System tray
    if (tbConfig.sections.system_tray) {
      const sysTray = document.createElement('div');
      sysTray.className = 'system-tray';
      taskbar.appendChild(sysTray);
    }

    // Clock
    if (tbConfig.sections.clock) {
      const clock = document.createElement('div');
      clock.className = 'taskbar-clock';
      this.updateClock(clock);
      taskbar.appendChild(clock);
    }
  }

  /**
   * Generate Mac-style dock
   */
  generateDock(config) {
    const dock = document.createElement('div');
    dock.className = 'dock';
    document.body.appendChild(dock);

    const apps = config.components.applications || [];
    apps.slice(0, 6).forEach(app => {
      const dockIcon = document.createElement('div');
      dockIcon.className = 'dock-icon';
      dockIcon.title = app.name;

      if (app.icon) {
        const img = document.createElement('img');
        img.src = app.icon;
        img.alt = app.name;
        dockIcon.appendChild(img);
      } else {
        dockIcon.textContent = this.getIconFallback(app.type);
      }

      dockIcon.addEventListener('click', () => this.openApp(app, config));
      dock.appendChild(dockIcon);
    });
  }

  /**
   * Generate global menu bar (Mac-style)
   */
  generateMenuBar(config) {
    let menuBar = document.querySelector('.global-menu-bar');
    if (!menuBar) {
      menuBar = document.createElement('div');
      menuBar.className = 'global-menu-bar';
      document.body.appendChild(menuBar);
    }

    const mbConfig = config.paradigm.menuSystem.menuBar;

    // Apple menu
    const appleMenu = document.createElement('div');
    appleMenu.className = 'menu-item apple-menu';
    appleMenu.innerHTML = '<span class="apple-icon">🍎</span>';
    menuBar.appendChild(appleMenu);

    // Application name
    const appName = document.createElement('div');
    appName.className = 'menu-item app-name';
    appName.textContent = 'Finder';
    menuBar.appendChild(appName);

    // File, Edit, etc.
    const standardMenus = ['File', 'Edit', 'View', 'Special', 'Help'];
    standardMenus.forEach(menuName => {
      const menu = document.createElement('div');
      menu.className = 'menu-item';
      menu.textContent = menuName;
      menuBar.appendChild(menu);
    });

    // Right side items
    const rightItems = document.createElement('div');
    rightItems.className = 'menu-bar-right';

    // Clock
    const clock = document.createElement('div');
    clock.className = 'menu-bar-clock';
    this.updateClock(clock);
    rightItems.appendChild(clock);

    menuBar.appendChild(rightItems);
  }

  /**
   * Update clock display
   */
  updateClock(clockElement) {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      clockElement.textContent = `${hours}:${minutes}`;
    };

    updateTime();
    setInterval(updateTime, 60000); // Update every minute
  }

  /**
   * Clear desktop
   */
  clearDesktop() {
    if (this.desktopElement) {
      this.desktopElement.innerHTML = '';
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DesktopGenerator;
}
