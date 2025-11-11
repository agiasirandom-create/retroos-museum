/**
 * Windows 3.1 Program Manager
 * The main application launcher and window manager for Windows 3.1
 */

(function(global) {
  'use strict';

  class Win31ProgramManager {
    constructor(desktop) {
      this.desktop = desktop;
      this.window = null;
      this.groupWindows = new Map();
    }

    /**
     * Open Program Manager
     */
    open() {
      if (this.window) {
        this.window.focus();
        return;
      }

      const content = this.buildContent();

      this.window = this.desktop.windowManager.createWindow({
        id: 'program-manager',
        title: 'Program Manager',
        content: content,
        width: 640,
        height: 480,
        x: 50,
        y: 30,
        onClose: () => {
          // In Windows 3.1, closing Program Manager shows exit dialog
          this.desktop.showExitDialog();
          return false; // Cancel close
        }
      });

      this.attachEventListeners();
      this.openDefaultGroups();
    }

    /**
     * Build Program Manager content
     */
    buildContent() {
      return `
        <div class="window-menubar">
          <div class="menu-item" data-menu="file">File</div>
          <div class="menu-item" data-menu="options">Options</div>
          <div class="menu-item" data-menu="window">Window</div>
          <div class="menu-item" data-menu="help">Help</div>
        </div>
        <div class="window-content" style="background-color: var(--win31-gray); padding: 0;">
          <div id="program-manager-workspace" style="width: 100%; height: 100%; position: relative;">
            <!-- Group windows will be added here -->
          </div>
        </div>
      `;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
      const windowEl = this.window.element;

      // Menu items
      const menuItems = windowEl.querySelectorAll('.menu-item');
      menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
          const menuType = item.dataset.menu;
          this.showMenu(menuType, item);
        });
      });
    }

    /**
     * Show dropdown menu
     */
    showMenu(menuType, triggerElement) {
      // Remove any existing menus
      document.querySelectorAll('.dropdown-menu').forEach(m => m.remove());

      const menu = document.createElement('div');
      menu.className = 'dropdown-menu show';

      const rect = triggerElement.getBoundingClientRect();
      menu.style.position = 'fixed';
      menu.style.left = rect.left + 'px';
      menu.style.top = rect.bottom + 'px';

      menu.innerHTML = this.getMenuContent(menuType);

      // Add click handler
      menu.addEventListener('click', (e) => {
        const item = e.target.closest('.dropdown-item');
        if (!item || item.classList.contains('disabled') || item.classList.contains('separator')) {
          return;
        }

        const action = item.dataset.action;
        this.handleMenuAction(action);
        menu.remove();
      });

      // Close menu when clicking elsewhere
      setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
          if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener('click', closeMenu);
          }
        });
      }, 0);

      document.body.appendChild(menu);
    }

    /**
     * Get menu content based on type
     */
    getMenuContent(menuType) {
      switch (menuType) {
        case 'file':
          return `
            <div class="dropdown-item disabled" data-action="new">New...</div>
            <div class="dropdown-item disabled" data-action="open">Open...</div>
            <div class="dropdown-item disabled" data-action="move">Move...</div>
            <div class="dropdown-item disabled" data-action="copy">Copy...</div>
            <div class="dropdown-item disabled" data-action="delete">Delete...</div>
            <div class="dropdown-item separator"></div>
            <div class="dropdown-item disabled" data-action="properties">Properties...</div>
            <div class="dropdown-item separator"></div>
            <div class="dropdown-item disabled" data-action="run">Run...</div>
            <div class="dropdown-item separator"></div>
            <div class="dropdown-item" data-action="exit">Exit Windows...</div>
          `;

        case 'options':
          return `
            <div class="dropdown-item disabled" data-action="auto-arrange">Auto Arrange</div>
            <div class="dropdown-item disabled" data-action="minimize-on-use">Minimize on Use</div>
            <div class="dropdown-item separator"></div>
            <div class="dropdown-item disabled" data-action="save-settings">Save Settings on Exit</div>
          `;

        case 'window':
          return `
            <div class="dropdown-item" data-action="cascade">Cascade</div>
            <div class="dropdown-item" data-action="tile">Tile</div>
            <div class="dropdown-item" data-action="arrange-icons">Arrange Icons</div>
          `;

        case 'help':
          return `
            <div class="dropdown-item disabled" data-action="contents">Contents</div>
            <div class="dropdown-item disabled" data-action="search">Search for Help on...</div>
            <div class="dropdown-item disabled" data-action="how-to-use">How to Use Help</div>
            <div class="dropdown-item separator"></div>
            <div class="dropdown-item" data-action="about">About Program Manager...</div>
          `;

        default:
          return '';
      }
    }

    /**
     * Handle menu action
     */
    handleMenuAction(action) {
      switch (action) {
        case 'exit':
          this.desktop.showExitDialog();
          break;

        case 'cascade':
          this.cascadeGroups();
          break;

        case 'tile':
          this.tileGroups();
          break;

        case 'arrange-icons':
          // Icons auto-arrange with CSS grid
          break;

        case 'about':
          this.desktop.showAboutDialog();
          break;

        default:
          console.log('Menu action:', action);
      }
    }

    /**
     * Open default program groups
     */
    openDefaultGroups() {
      // Main group
      this.createProgramGroup({
        id: 'main',
        title: 'Main',
        x: 20,
        y: 20,
        programs: [
          { id: 'file-manager', label: 'File Manager', icon: '=Á', action: () => this.desktop.launchFileManager() },
          { id: 'control-panel', label: 'Control Panel', icon: '™', action: () => this.desktop.launchControlPanel() },
          { id: 'print-manager', label: 'Print Manager', icon: '=¨', action: () => this.desktop.showNotImplemented('Print Manager') },
          { id: 'clipboard', label: 'Clipboard', icon: '=Ë', action: () => this.desktop.showNotImplemented('Clipboard Viewer') },
          { id: 'pif-editor', label: 'PIF Editor', icon: '=Ý', action: () => this.desktop.showNotImplemented('PIF Editor') },
          { id: 'read-me', label: 'Read Me', icon: '=Ä', action: () => this.openReadMe() }
        ]
      });

      // Accessories group
      this.createProgramGroup({
        id: 'accessories',
        title: 'Accessories',
        x: 180,
        y: 80,
        programs: [
          { id: 'notepad', label: 'Notepad', icon: '=Ý', action: () => this.launchNotepad() },
          { id: 'write', label: 'Write', icon: '=Ã', action: () => this.launchWrite() },
          { id: 'calculator', label: 'Calculator', icon: '="', action: () => this.launchCalculator() },
          { id: 'calendar', label: 'Calendar', icon: '=Å', action: () => this.desktop.showNotImplemented('Calendar') },
          { id: 'cardfile', label: 'Cardfile', icon: '=Â', action: () => this.desktop.showNotImplemented('Cardfile') },
          { id: 'paintbrush', label: 'Paintbrush', icon: '<¨', action: () => this.desktop.showNotImplemented('Paintbrush') }
        ]
      });

      // Games group
      this.createProgramGroup({
        id: 'games',
        title: 'Games',
        x: 340,
        y: 140,
        programs: [
          { id: 'solitaire', label: 'Solitaire', icon: '<Ï', action: () => this.desktop.showNotImplemented('Solitaire') },
          { id: 'minesweeper', label: 'Minesweeper', icon: '=£', action: () => this.desktop.showNotImplemented('Minesweeper') }
        ]
      });

      // StartUp group (empty by default)
      this.createProgramGroup({
        id: 'startup',
        title: 'StartUp',
        x: 500,
        y: 200,
        programs: []
      });
    }

    /**
     * Create a program group window
     */
    createProgramGroup(config) {
      const content = `
        <div class="program-group-content" id="group-${config.id}">
          ${config.programs.map(program => `
            <div class="program-icon" tabindex="0" data-program-id="${program.id}">
              <div class="program-icon-image">${program.icon}</div>
              <div class="program-label">${program.label}</div>
            </div>
          `).join('')}
        </div>
      `;

      const workspace = this.window.element.querySelector('#program-manager-workspace');

      // Create group window element
      const groupWindow = document.createElement('div');
      groupWindow.className = 'os-window program-group-window active';
      groupWindow.style.position = 'absolute';
      groupWindow.style.left = config.x + 'px';
      groupWindow.style.top = config.y + 'px';
      groupWindow.style.width = '280px';
      groupWindow.style.height = '200px';
      groupWindow.style.zIndex = '1';

      groupWindow.innerHTML = `
        <div class="window-titlebar">
          <div class="window-title">${config.title}</div>
          <div class="window-controls">
            <button class="window-btn window-btn-minimize" title="Minimize">
              <span style="display:block;width:8px;height:2px;background:#000;margin-top:4px;"></span>
            </button>
            <button class="window-btn window-btn-maximize" title="Maximize">
              <span style="display:block;width:8px;height:8px;border:2px solid #000;border-top-width:3px;"></span>
            </button>
          </div>
        </div>
        <div class="window-content" style="overflow: auto;">
          ${content}
        </div>
      `;

      workspace.appendChild(groupWindow);

      // Make group window draggable
      this.makeGroupWindowDraggable(groupWindow);

      // Attach program icon handlers
      const icons = groupWindow.querySelectorAll('.program-icon');
      icons.forEach((icon, index) => {
        const program = config.programs[index];

        // Single click to select
        icon.addEventListener('click', (e) => {
          e.stopPropagation();
          this.selectProgramIcon(icon);
        });

        // Double click to launch
        icon.addEventListener('dblclick', (e) => {
          e.stopPropagation();
          if (program && program.action) {
            program.action();
          }
        });

        // Keyboard support
        icon.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            if (program && program.action) {
              program.action();
            }
          }
        });
      });

      // Window controls
      const minimizeBtn = groupWindow.querySelector('.window-btn-minimize');
      if (minimizeBtn) {
        minimizeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          groupWindow.style.display = 'none';
        });
      }

      const maximizeBtn = groupWindow.querySelector('.window-btn-maximize');
      if (maximizeBtn) {
        maximizeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          // Toggle maximize
          if (groupWindow.classList.contains('maximized')) {
            groupWindow.classList.remove('maximized');
            groupWindow.style.width = '280px';
            groupWindow.style.height = '200px';
            groupWindow.style.left = config.x + 'px';
            groupWindow.style.top = config.y + 'px';
          } else {
            groupWindow.classList.add('maximized');
            const workspace = groupWindow.parentElement;
            groupWindow.style.width = workspace.offsetWidth + 'px';
            groupWindow.style.height = workspace.offsetHeight + 'px';
            groupWindow.style.left = '0';
            groupWindow.style.top = '0';
          }
        });
      }

      this.groupWindows.set(config.id, groupWindow);
    }

    /**
     * Make group window draggable
     */
    makeGroupWindowDraggable(groupWindow) {
      const titlebar = groupWindow.querySelector('.window-titlebar');
      let isDragging = false;
      let startX, startY, initialX, initialY;

      titlebar.addEventListener('mousedown', (e) => {
        if (e.target.closest('.window-controls')) return;

        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = groupWindow.getBoundingClientRect();
        initialX = rect.left - groupWindow.parentElement.getBoundingClientRect().left;
        initialY = rect.top - groupWindow.parentElement.getBoundingClientRect().top;

        // Bring to front
        const siblings = Array.from(groupWindow.parentElement.children);
        siblings.forEach((sibling, i) => {
          if (sibling.style) sibling.style.zIndex = '1';
        });
        groupWindow.style.zIndex = '2';

        const onMouseMove = (e) => {
          if (!isDragging) return;

          const deltaX = e.clientX - startX;
          const deltaY = e.clientY - startY;

          groupWindow.style.left = (initialX + deltaX) + 'px';
          groupWindow.style.top = (initialY + deltaY) + 'px';
        };

        const onMouseUp = () => {
          isDragging = false;
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });

      // Double-click to maximize
      titlebar.addEventListener('dblclick', (e) => {
        if (e.target.closest('.window-controls')) return;
        const maximizeBtn = groupWindow.querySelector('.window-btn-maximize');
        if (maximizeBtn) {
          maximizeBtn.click();
        }
      });
    }

    /**
     * Select a program icon
     */
    selectProgramIcon(icon) {
      // Deselect all icons
      const allIcons = this.window.element.querySelectorAll('.program-icon');
      allIcons.forEach(i => i.classList.remove('selected'));

      // Select this icon
      icon.classList.add('selected');
      icon.focus();
    }

    /**
     * Cascade group windows
     */
    cascadeGroups() {
      const groups = Array.from(this.groupWindows.values());
      const offsetX = 24;
      const offsetY = 24;

      groups.forEach((group, index) => {
        group.style.left = (20 + index * offsetX) + 'px';
        group.style.top = (20 + index * offsetY) + 'px';
        group.style.zIndex = (index + 1).toString();
      });
    }

    /**
     * Tile group windows
     */
    tileGroups() {
      const groups = Array.from(this.groupWindows.values());
      const workspace = this.window.element.querySelector('#program-manager-workspace');
      const workspaceWidth = workspace.offsetWidth;
      const workspaceHeight = workspace.offsetHeight;

      if (groups.length === 0) return;

      // Simple tiling
      const cols = Math.ceil(Math.sqrt(groups.length));
      const rows = Math.ceil(groups.length / cols);
      const windowWidth = Math.floor(workspaceWidth / cols);
      const windowHeight = Math.floor(workspaceHeight / rows);

      groups.forEach((group, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);

        group.style.left = (col * windowWidth) + 'px';
        group.style.top = (row * windowHeight) + 'px';
        group.style.width = windowWidth + 'px';
        group.style.height = windowHeight + 'px';
        group.classList.remove('maximized');
      });
    }

    /**
     * Launch Notepad
     */
    launchNotepad() {
      if (typeof Win31Notepad !== 'undefined') {
        const notepad = new Win31Notepad(this.desktop);
        notepad.open();
      } else {
        console.error('Win31Notepad not loaded');
      }
    }

    /**
     * Launch Write
     */
    launchWrite() {
      if (typeof Win31Write !== 'undefined') {
        const write = new Win31Write(this.desktop);
        write.open();
      } else {
        console.error('Win31Write not loaded');
      }
    }

    /**
     * Launch Calculator
     */
    launchCalculator() {
      if (typeof Win31Calculator !== 'undefined') {
        const calc = new Win31Calculator(this.desktop);
        calc.open();
      } else {
        console.error('Win31Calculator not loaded');
      }
    }

    /**
     * Open Read Me file
     */
    openReadMe() {
      const content = `
        <div style="padding: 16px; background: white; height: 100%; overflow: auto; font-family: 'Courier New', monospace; font-size: 11px; line-height: 1.4;">
          <pre>MICROSOFT WINDOWS VERSION 3.1 README

Welcome to Windows 3.1!

This recreation faithfully reproduces the classic Windows 3.1
interface from 1992.

KEY FEATURES:
- Program Manager with group windows
- File Manager with tree view
- Authentic 16-color VGA graphics
- Classic applications (Notepad, Write, Calculator)
- Keyboard shortcuts (Ctrl+Esc for Task List, Alt+F4 to close)

SYSTEM REQUIREMENTS:
- A web browser with JavaScript enabled
- Appreciation for vintage computing aesthetics

NOTES:
This is a faithful recreation for educational and nostalgic
purposes. Not all features are implemented.

© 1992 Microsoft Corporation
RetroOS Museum Recreation</pre>
        </div>
      `;

      this.desktop.windowManager.createWindow({
        id: 'readme',
        title: 'Read Me - Notepad',
        content: content,
        width: 560,
        height: 400
      });
    }
  }

  // Export to global scope
  global.Win31ProgramManager = Win31ProgramManager;

})(typeof window !== 'undefined' ? window : global);
