/**
 * Windows 3.1 Notepad
 * Simple text editor
 */

(function(global) {
  'use strict';

  class Win31Notepad {
    constructor(desktop) {
      this.desktop = desktop;
      this.window = null;
      this.filename = 'Untitled';
      this.modified = false;
    }

    /**
     * Open Notepad
     */
    open() {
      const content = this.buildContent();

      this.window = this.desktop.windowManager.createWindow({
        id: 'notepad-' + Date.now(),
        title: this.filename + ' - Notepad',
        content: content,
        width: 500,
        height: 350,
        onClose: () => {
          if (this.modified) {
            // In real Windows 3.1, this would show a save dialog
            return confirm('Save changes to ' + this.filename + '?');
          }
          this.window = null;
          return true;
        }
      });

      this.attachEventListeners();
    }

    /**
     * Build Notepad content
     */
    buildContent() {
      return `
        <div class="window-menubar">
          <div class="menu-item" data-menu="file">File</div>
          <div class="menu-item" data-menu="edit">Edit</div>
          <div class="menu-item" data-menu="search">Search</div>
          <div class="menu-item" data-menu="help">Help</div>
        </div>
        <div class="window-content" style="padding: 0;">
          <textarea class="win31-textarea" id="notepad-text" placeholder=""></textarea>
        </div>
      `;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
      const windowEl = this.window.element;
      const textarea = windowEl.querySelector('#notepad-text');

      // Track modifications
      textarea.addEventListener('input', () => {
        this.modified = true;
        this.window.setTitle('*' + this.filename + ' - Notepad');
      });

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
     * Show menu
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
     * Get menu content
     */
    getMenuContent(menuType) {
      switch (menuType) {
        case 'file':
          return `
            <div class="dropdown-item disabled" data-action="new">New</div>
            <div class="dropdown-item disabled" data-action="open">Open...</div>
            <div class="dropdown-item disabled" data-action="save">Save</div>
            <div class="dropdown-item disabled" data-action="save-as">Save As...</div>
            <div class="dropdown-item separator"></div>
            <div class="dropdown-item disabled" data-action="print">Print...</div>
            <div class="dropdown-item disabled" data-action="page-setup">Page Setup...</div>
            <div class="dropdown-item separator"></div>
            <div class="dropdown-item" data-action="exit">Exit</div>
          `;

        case 'edit':
          return `
            <div class="dropdown-item disabled" data-action="undo">Undo</div>
            <div class="dropdown-item separator"></div>
            <div class="dropdown-item disabled" data-action="cut">Cut</div>
            <div class="dropdown-item disabled" data-action="copy">Copy</div>
            <div class="dropdown-item disabled" data-action="paste">Paste</div>
            <div class="dropdown-item disabled" data-action="delete">Delete</div>
            <div class="dropdown-item separator"></div>
            <div class="dropdown-item disabled" data-action="select-all">Select All</div>
            <div class="dropdown-item disabled" data-action="time-date">Time/Date</div>
          `;

        case 'search':
          return `
            <div class="dropdown-item disabled" data-action="find">Find...</div>
            <div class="dropdown-item disabled" data-action="find-next">Find Next</div>
          `;

        case 'help':
          return `
            <div class="dropdown-item disabled" data-action="contents">Contents</div>
            <div class="dropdown-item disabled" data-action="search-help">Search for Help on...</div>
            <div class="dropdown-item disabled" data-action="how-to-use">How to Use Help</div>
            <div class="dropdown-item separator"></div>
            <div class="dropdown-item" data-action="about">About Notepad...</div>
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
          this.window.close();
          break;

        case 'about':
          this.showAbout();
          break;

        default:
          console.log('Menu action:', action);
      }
    }

    /**
     * Show About dialog
     */
    showAbout() {
      const content = `
        <div class="win31-dialog about-dialog">
          <div class="about-logo">=Ý</div>
          <div class="about-title">Notepad</div>
          <div class="about-version">Version 3.1</div>
          <div style="margin: 16px 0;">
            <p>Microsoft Windows Notepad</p>
            <p>Copyright © 1985-1992 Microsoft Corp.</p>
          </div>
          <div class="dialog-buttons">
            <button class="win31-button default" onclick="this.closest('.os-window').querySelector('.window-btn-close').click()">OK</button>
          </div>
        </div>
      `;

      this.desktop.windowManager.createWindow({
        id: 'about-notepad',
        title: 'About Notepad',
        content: content,
        width: 350,
        height: 260,
        resizable: false,
        maximizable: false,
        modal: true
      });
    }
  }

  // Export to global scope
  global.Win31Notepad = Win31Notepad;

})(typeof window !== 'undefined' ? window : global);
