/**
 * Windows 3.1 Desktop
 * Main orchestrator for the Windows 3.1 desktop environment with Program Manager
 */

(function(global) {
  'use strict';

  class Win31Desktop {
    constructor() {
      this.windowManager = null;
      this.desktop = null;
      this.selectedIcon = null;
      this.programManager = null;
    }

    /**
     * Initialize Windows 3.1 desktop
     */
    init() {
      console.log('Initializing Windows 3.1 Desktop...');

      // Initialize core systems
      this.initWindowManager();
      this.initDesktop();

      // Create desktop icons
      this.createDesktopIcons();

      // Set up keyboard shortcuts
      this.setupKeyboardShortcuts();

      // Launch Program Manager automatically (Windows 3.1 behavior)
      setTimeout(() => {
        this.launchProgramManager();
      }, 500);

      console.log('Windows 3.1 Desktop initialized successfully');
    }

    /**
     * Initialize window manager
     */
    initWindowManager() {
      this.windowManager = new WindowManager();
      this.windowManager.init('#windows-container');
    }

    /**
     * Initialize desktop
     */
    initDesktop() {
      this.desktop = document.getElementById('win31-desktop');
      if (!this.desktop) {
        console.error('Desktop element not found');
        return;
      }

      // Set up desktop click handler for deselecting icons
      this.desktop.addEventListener('click', (e) => {
        if (e.target === this.desktop || e.target.classList.contains('desktop-icons')) {
          this.deselectAllIcons();
        }
      });

      // Right-click context menu
      this.desktop.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        // In Windows 3.1, right-click wasn't as prominent, but we can add basic functionality
        this.showDesktopContextMenu(e.clientX, e.clientY);
      });
    }

    /**
     * Create desktop icons
     */
    createDesktopIcons() {
      const container = document.getElementById('desktop-icons');
      if (!container) return;

      const icons = [
        {
          id: 'file-manager',
          label: 'File Manager',
          icon: '=Á',
          action: () => this.launchFileManager()
        },
        {
          id: 'control-panel',
          label: 'Control Panel',
          icon: '™',
          action: () => this.launchControlPanel()
        },
        {
          id: 'print-manager',
          label: 'Print Manager',
          icon: '=¨',
          action: () => this.showNotImplemented('Print Manager')
        },
        {
          id: 'clipboard',
          label: 'Clipboard',
          icon: '=Ë',
          action: () => this.showNotImplemented('Clipboard Viewer')
        }
      ];

      icons.forEach(iconData => {
        const icon = this.createDesktopIcon(iconData);
        container.appendChild(icon);
      });
    }

    /**
     * Create a single desktop icon
     */
    createDesktopIcon(data) {
      const icon = document.createElement('div');
      icon.className = 'desktop-icon';
      icon.setAttribute('tabindex', '0');
      icon.setAttribute('role', 'button');
      icon.setAttribute('aria-label', data.label);
      icon.dataset.iconId = data.id;

      const image = document.createElement('div');
      image.className = 'desktop-icon-image';
      image.textContent = data.icon;

      const label = document.createElement('div');
      label.className = 'icon-label';
      label.textContent = data.label;

      icon.appendChild(image);
      icon.appendChild(label);

      // Single click to select
      icon.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectIcon(icon);
      });

      // Double click to open
      icon.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        if (data.action) {
          data.action();
        }
      });

      // Keyboard support
      icon.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          if (data.action) {
            data.action();
          }
        }
      });

      return icon;
    }

    /**
     * Select an icon
     */
    selectIcon(icon) {
      this.deselectAllIcons();
      icon.classList.add('selected');
      this.selectedIcon = icon;
      icon.focus();
    }

    /**
     * Deselect all icons
     */
    deselectAllIcons() {
      const icons = document.querySelectorAll('.desktop-icon.selected');
      icons.forEach(icon => icon.classList.remove('selected'));
      this.selectedIcon = null;
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
      document.addEventListener('keydown', (e) => {
        // Ctrl+Esc or Windows key - Show task list (Windows 3.1 task switcher)
        if ((e.ctrlKey && e.key === 'Escape') || e.key === 'Meta') {
          e.preventDefault();
          this.showTaskList();
        }
      });
    }

    /**
     * Launch Program Manager
     */
    launchProgramManager() {
      if (typeof Win31ProgramManager !== 'undefined') {
        this.programManager = new Win31ProgramManager(this);
        this.programManager.open();
      } else {
        console.error('Win31ProgramManager not loaded');
      }
    }

    /**
     * Launch File Manager
     */
    launchFileManager() {
      if (typeof Win31FileManager !== 'undefined') {
        const fileManager = new Win31FileManager(this);
        fileManager.open();
      } else {
        console.error('Win31FileManager not loaded');
      }
    }

    /**
     * Launch Control Panel
     */
    launchControlPanel() {
      if (typeof Win31ControlPanel !== 'undefined') {
        const controlPanel = new Win31ControlPanel(this);
        controlPanel.open();
      } else {
        console.error('Win31ControlPanel not loaded');
      }
    }

    /**
     * Show task list (Ctrl+Esc in Windows 3.1)
     */
    showTaskList() {
      const windows = this.windowManager.getAllWindows();

      if (windows.length === 0) {
        return;
      }

      const content = `
        <div class="win31-dialog">
          <div style="margin-bottom: 16px;">
            <label for="task-list">Select task:</label>
          </div>
          <select id="task-list" class="win31-listbox" size="6" style="width: 100%; margin-bottom: 16px;">
            ${windows.map(win => `
              <option value="${win.id}">${win.title}</option>
            `).join('')}
          </select>
          <div class="dialog-buttons">
            <button class="win31-button" onclick="window.win31.switchToTask()">Switch To</button>
            <button class="win31-button" onclick="window.win31.endTask()">End Task</button>
            <button class="win31-button" onclick="window.win31.closeTaskList()">Cancel</button>
          </div>
        </div>
      `;

      this.taskListWindow = this.windowManager.createWindow({
        id: 'task-list',
        title: 'Task List',
        content: content,
        width: 300,
        height: 250,
        resizable: false,
        maximizable: false,
        modal: true
      });
    }

    /**
     * Switch to selected task
     */
    switchToTask() {
      const select = document.getElementById('task-list');
      if (select && select.value) {
        const window = this.windowManager.getWindow(select.value);
        if (window) {
          window.focus();
          if (window.isMinimized) {
            window.restore();
          }
        }
        this.closeTaskList();
      }
    }

    /**
     * End selected task
     */
    endTask() {
      const select = document.getElementById('task-list');
      if (select && select.value) {
        this.windowManager.closeWindow(select.value);
        this.closeTaskList();
      }
    }

    /**
     * Close task list
     */
    closeTaskList() {
      if (this.taskListWindow) {
        this.taskListWindow.close();
        this.taskListWindow = null;
      }
    }

    /**
     * Show desktop context menu
     */
    showDesktopContextMenu(x, y) {
      // Remove existing context menu if any
      const existingMenu = document.querySelector('.desktop-context-menu');
      if (existingMenu) {
        existingMenu.remove();
      }

      const menu = document.createElement('div');
      menu.className = 'dropdown-menu show desktop-context-menu';
      menu.style.position = 'fixed';
      menu.style.left = x + 'px';
      menu.style.top = y + 'px';
      menu.style.zIndex = '10000';

      menu.innerHTML = `
        <div class="dropdown-item" data-action="arrange">Arrange Icons</div>
        <div class="dropdown-item separator"></div>
        <div class="dropdown-item" data-action="refresh">Refresh</div>
      `;

      // Handle menu actions
      menu.addEventListener('click', (e) => {
        const item = e.target.closest('.dropdown-item');
        if (!item || item.classList.contains('separator')) return;

        const action = item.dataset.action;
        if (action === 'arrange') {
          this.arrangeIcons();
        } else if (action === 'refresh') {
          // Simulate refresh
          console.log('Refreshing desktop...');
        }

        menu.remove();
      });

      // Close menu when clicking elsewhere
      setTimeout(() => {
        document.addEventListener('click', function closeMenu() {
          menu.remove();
          document.removeEventListener('click', closeMenu);
        });
      }, 0);

      document.body.appendChild(menu);
    }

    /**
     * Arrange desktop icons
     */
    arrangeIcons() {
      // Icons are already arranged in a grid by CSS
      console.log('Icons arranged');
    }

    /**
     * Show "not implemented" dialog
     */
    showNotImplemented(feature) {
      const content = `
        <div class="win31-dialog">
          <div class="dialog-content">
            <div class="dialog-icon">9</div>
            <div class="dialog-message">
              <p>${feature} is not implemented in this recreation.</p>
            </div>
          </div>
          <div class="dialog-buttons">
            <button class="win31-button default" onclick="this.closest('.os-window').querySelector('.window-btn-close').click()">OK</button>
          </div>
        </div>
      `;

      this.windowManager.createWindow({
        id: `not-implemented-${Date.now()}`,
        title: feature,
        content: content,
        width: 350,
        height: 150,
        resizable: false,
        maximizable: false,
        modal: true
      });
    }

    /**
     * Show Exit Windows dialog
     */
    showExitDialog() {
      const content = `
        <div class="win31-dialog">
          <div class="dialog-content">
            <div class="dialog-icon">S</div>
            <div class="dialog-message">
              <p>This will end your Windows session.</p>
              <p><strong>Do you want to continue?</strong></p>
            </div>
          </div>
          <div class="dialog-buttons">
            <button class="win31-button default" onclick="window.win31.exitWindows()">OK</button>
            <button class="win31-button" onclick="this.closest('.os-window').querySelector('.window-btn-close').click()">Cancel</button>
          </div>
        </div>
      `;

      this.windowManager.createWindow({
        id: 'exit-windows-dialog',
        title: 'Exit Windows',
        content: content,
        width: 350,
        height: 170,
        resizable: false,
        maximizable: false,
        modal: true
      });
    }

    /**
     * Exit Windows (return to homepage)
     */
    exitWindows() {
      // Show exiting screen
      const exitScreen = document.createElement('div');
      exitScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #000;
        color: #FFF;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100000;
        font-family: var(--win31-font);
        font-size: 24px;
      `;
      exitScreen.textContent = 'It\'s now safe to turn off your computer.';
      document.body.appendChild(exitScreen);

      // Redirect after a moment
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }

    /**
     * Show About Program Manager dialog
     */
    showAboutDialog() {
      const content = `
        <div class="about-dialog win31-dialog">
          <div class="about-logo">>Ÿ</div>
          <div class="about-title">Microsoft Windows</div>
          <div class="about-version">Version 3.1</div>
          <div style="margin: 16px 0;">
            <p>Copyright © 1985-1992 Microsoft Corp.</p>
          </div>
          <div class="about-copyright">
            <p>This product is licensed to:</p>
            <p><strong>RetroOS Museum Visitor</strong></p>
          </div>
          <div class="dialog-buttons" style="margin-top: 24px;">
            <button class="win31-button default" onclick="this.closest('.os-window').querySelector('.window-btn-close').click()">OK</button>
          </div>
        </div>
      `;

      this.windowManager.createWindow({
        id: 'about-windows',
        title: 'About Program Manager',
        content: content,
        width: 380,
        height: 320,
        resizable: false,
        maximizable: false,
        modal: true
      });
    }

    /**
     * Cascade windows
     */
    cascadeWindows() {
      const windows = this.windowManager.getAllWindows().filter(w => !w.isMinimized);
      const offsetX = 24;
      const offsetY = 24;
      const startX = 20;
      const startY = 20;

      windows.forEach((win, index) => {
        win._setPosition(startX + (index * offsetX), startY + (index * offsetY));
        win._setSize(500, 400);
        win.focus();
      });
    }

    /**
     * Tile windows
     */
    tileWindows() {
      const windows = this.windowManager.getAllWindows().filter(w => !w.isMinimized);
      if (windows.length === 0) return;

      const desktopWidth = window.innerWidth;
      const desktopHeight = window.innerHeight;

      // Simple tiling - horizontal split
      const windowWidth = Math.floor(desktopWidth / windows.length);

      windows.forEach((win, index) => {
        win._setPosition(index * windowWidth, 0);
        win._setSize(windowWidth, desktopHeight);
      });
    }
  }

  // Export to global scope
  global.Win31Desktop = Win31Desktop;

})(typeof window !== 'undefined' ? window : global);
