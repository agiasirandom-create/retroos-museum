/**
 * Windows 95 Notepad
 * Classic text editor application
 */

(function(global) {
  'use strict';

  class Win95Notepad {
    constructor(windowManager) {
      this.windowManager = windowManager;
      this.window = null;
      this.textarea = null;
      this.filename = 'Untitled';
      this.isDirty = false;
    }

    /**
     * Open Notepad
     */
    open(filename = 'Untitled', content = '') {
      this.filename = filename;

      const windowContent = this.createContent(content);

      this.window = this.windowManager.createWindow({
        id: `notepad-${Date.now()}`,
        title: `${this.filename} - Notepad`,
        width: 600,
        height: 400,
        minWidth: 300,
        minHeight: 200,
        content: windowContent
      });

      // Get references to elements
      this.textarea = this.window.element.querySelector('.notepad-textarea');

      // Set up event listeners
      this.setupEventListeners();
    }

    /**
     * Create window content
     */
    createContent(initialContent) {
      return `
        <div class="notepad-container" style="display: flex; flex-direction: column; height: 100%;">
          <!-- Menu Bar -->
          <div class="window-menubar" style="flex-shrink: 0;">
            <div class="menu-trigger" data-menu="file">File</div>
            <div class="menu-trigger" data-menu="edit">Edit</div>
            <div class="menu-trigger" data-menu="search">Search</div>
            <div class="menu-trigger" data-menu="help">Help</div>
          </div>

          <!-- Text Area -->
          <textarea class="notepad-textarea"
                    style="flex: 1;
                           width: 100%;
                           border: none;
                           padding: 8px;
                           font-family: 'Courier New', monospace;
                           font-size: 12px;
                           resize: none;
                           outline: none;
                           background: white;
                           color: black;"
                    spellcheck="false">${initialContent}</textarea>
        </div>
      `;
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
      if (!this.textarea) return;

      // Track changes
      this.textarea.addEventListener('input', () => {
        this.isDirty = true;
        this.updateTitle();
      });

      // Menu items
      const menuTriggers = this.window.element.querySelectorAll('.menu-trigger');
      menuTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          const menu = e.target.getAttribute('data-menu');
          this.showMenu(menu, e.target);
        });
      });

      // Keyboard shortcuts
      this.textarea.addEventListener('keydown', (e) => {
        // Ctrl+N - New
        if (e.ctrlKey && e.key === 'n') {
          e.preventDefault();
          this.newFile();
        }
        // Ctrl+S - Save
        else if (e.ctrlKey && e.key === 's') {
          e.preventDefault();
          this.save();
        }
        // Ctrl+A - Select All
        else if (e.ctrlKey && e.key === 'a') {
          // Let browser handle it
        }
        // Ctrl+F - Find
        else if (e.ctrlKey && e.key === 'f') {
          e.preventDefault();
          this.showFindDialog();
        }
      });
    }

    /**
     * Show menu
     */
    showMenu(menuType, triggerElement) {
      const menus = {
        file: [
          { label: 'New', shortcut: 'Ctrl+N', action: () => this.newFile() },
          { label: 'Open...', shortcut: 'Ctrl+O', action: () => this.open() },
          { label: 'Save', shortcut: 'Ctrl+S', action: () => this.save() },
          { label: 'Save As...', action: () => this.saveAs() },
          { type: 'separator' },
          { label: 'Print...', shortcut: 'Ctrl+P', action: () => this.print() },
          { type: 'separator' },
          { label: 'Exit', action: () => this.window.close() }
        ],
        edit: [
          { label: 'Undo', shortcut: 'Ctrl+Z', action: () => document.execCommand('undo') },
          { type: 'separator' },
          { label: 'Cut', shortcut: 'Ctrl+X', action: () => document.execCommand('cut') },
          { label: 'Copy', shortcut: 'Ctrl+C', action: () => document.execCommand('copy') },
          { label: 'Paste', shortcut: 'Ctrl+V', action: () => document.execCommand('paste') },
          { label: 'Delete', shortcut: 'Del', action: () => this.deleteSelection() },
          { type: 'separator' },
          { label: 'Select All', shortcut: 'Ctrl+A', action: () => this.textarea.select() },
          { label: 'Time/Date', shortcut: 'F5', action: () => this.insertDateTime() },
          { type: 'separator' },
          { label: 'Word Wrap', action: () => this.toggleWordWrap() }
        ],
        search: [
          { label: 'Find...', shortcut: 'Ctrl+F', action: () => this.showFindDialog() },
          { label: 'Find Next', shortcut: 'F3', action: () => this.findNext() }
        ],
        help: [
          { label: 'Help Topics', action: () => this.showHelp() },
          { type: 'separator' },
          { label: 'About Notepad', action: () => this.showAbout() }
        ]
      };

      // Create and show dropdown menu
      this.showDropdownMenu(menus[menuType], triggerElement);
    }

    /**
     * Show dropdown menu
     */
    showDropdownMenu(items, triggerElement) {
      // Remove existing menu
      const existingMenu = document.querySelector('.notepad-dropdown-menu');
      if (existingMenu) {
        existingMenu.remove();
      }

      const menu = document.createElement('div');
      menu.className = 'notepad-dropdown-menu';
      menu.style.cssText = `
        position: absolute;
        background: #c0c0c0;
        border: 2px solid;
        border-color: #fff #000 #000 #fff;
        box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        padding: 2px;
        z-index: 10000;
        min-width: 180px;
      `;

      items.forEach(item => {
        if (item.type === 'separator') {
          const separator = document.createElement('div');
          separator.style.cssText = `
            height: 2px;
            background: linear-gradient(to bottom, #808080, #fff);
            margin: 2px 4px;
          `;
          menu.appendChild(separator);
        } else {
          const menuItem = document.createElement('div');
          menuItem.style.cssText = `
            padding: 4px 8px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            font-size: 11px;
          `;

          const label = document.createElement('span');
          label.textContent = item.label;
          menuItem.appendChild(label);

          if (item.shortcut) {
            const shortcut = document.createElement('span');
            shortcut.textContent = item.shortcut;
            shortcut.style.marginLeft = '24px';
            shortcut.style.color = '#666';
            menuItem.appendChild(shortcut);
          }

          menuItem.addEventListener('mouseenter', () => {
            menuItem.style.background = '#000080';
            menuItem.style.color = '#fff';
            if (item.shortcut) {
              menuItem.querySelector('span:last-child').style.color = '#fff';
            }
          });

          menuItem.addEventListener('mouseleave', () => {
            menuItem.style.background = 'transparent';
            menuItem.style.color = '#000';
            if (item.shortcut) {
              menuItem.querySelector('span:last-child').style.color = '#666';
            }
          });

          menuItem.addEventListener('click', () => {
            if (item.action) {
              item.action();
            }
            menu.remove();
          });

          menu.appendChild(menuItem);
        }
      });

      // Position menu
      const rect = triggerElement.getBoundingClientRect();
      menu.style.left = rect.left + 'px';
      menu.style.top = rect.bottom + 'px';

      document.body.appendChild(menu);

      // Close menu on click outside
      setTimeout(() => {
        const closeMenu = (e) => {
          if (!menu.contains(e.target) && e.target !== triggerElement) {
            menu.remove();
            document.removeEventListener('click', closeMenu);
          }
        };
        document.addEventListener('click', closeMenu);
      }, 0);
    }

    /**
     * New file
     */
    newFile() {
      if (this.isDirty) {
        if (!confirm('The text in the file has changed.\n\nDo you want to save the changes?')) {
          this.textarea.value = '';
          this.filename = 'Untitled';
          this.isDirty = false;
          this.updateTitle();
        }
      } else {
        this.textarea.value = '';
        this.filename = 'Untitled';
        this.isDirty = false;
        this.updateTitle();
      }
    }

    /**
     * Save file (simulated)
     */
    save() {
      const content = this.textarea.value;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = this.filename.endsWith('.txt') ? this.filename : `${this.filename}.txt`;
      a.click();

      URL.revokeObjectURL(url);

      this.isDirty = false;
      this.updateTitle();
    }

    /**
     * Save As
     */
    saveAs() {
      const newFilename = prompt('Save as:', this.filename);
      if (newFilename) {
        this.filename = newFilename;
        this.save();
      }
    }

    /**
     * Print (simulated)
     */
    print() {
      alert('Print functionality is not available in this simulation.');
    }

    /**
     * Delete selection
     */
    deleteSelection() {
      const start = this.textarea.selectionStart;
      const end = this.textarea.selectionEnd;
      if (start !== end) {
        const value = this.textarea.value;
        this.textarea.value = value.substring(0, start) + value.substring(end);
        this.textarea.selectionStart = this.textarea.selectionEnd = start;
        this.isDirty = true;
        this.updateTitle();
      }
    }

    /**
     * Insert date/time
     */
    insertDateTime() {
      const now = new Date();
      const dateTime = now.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });

      const pos = this.textarea.selectionStart;
      const value = this.textarea.value;
      this.textarea.value = value.substring(0, pos) + dateTime + value.substring(pos);
      this.textarea.selectionStart = this.textarea.selectionEnd = pos + dateTime.length;
      this.isDirty = true;
      this.updateTitle();
    }

    /**
     * Toggle word wrap
     */
    toggleWordWrap() {
      if (this.textarea.style.whiteSpace === 'pre-wrap') {
        this.textarea.style.whiteSpace = 'pre';
        this.textarea.style.overflowX = 'auto';
      } else {
        this.textarea.style.whiteSpace = 'pre-wrap';
        this.textarea.style.overflowX = 'hidden';
      }
    }

    /**
     * Show find dialog
     */
    showFindDialog() {
      alert('Find functionality is not yet implemented in this simulation.');
    }

    /**
     * Find next
     */
    findNext() {
      alert('Find functionality is not yet implemented in this simulation.');
    }

    /**
     * Show help
     */
    showHelp() {
      alert('Help is not available in this simulation.');
    }

    /**
     * Show about dialog
     */
    showAbout() {
      this.windowManager.createWindow({
        id: 'notepad-about',
        title: 'About Notepad',
        width: 350,
        height: 200,
        content: `
          <div style="padding: 24px; text-align: center; font-family: 'MS Sans Serif', sans-serif; font-size: 11px;">
            <h2 style="margin-bottom: 8px;">Notepad</h2>
            <p style="margin-bottom: 16px;">Version 4.0</p>
            <p style="margin-bottom: 8px;">Copyright © 1981-1995 Microsoft Corporation</p>
            <div style="margin-top: 24px;">
              <button onclick="this.closest('.os-window').querySelector('.window-btn-close').click()"
                      class="retro-button--win95" style="min-width: 80px;">
                OK
              </button>
            </div>
          </div>
        `,
        resizable: false,
        maximizable: false
      });
    }

    /**
     * Update window title
     */
    updateTitle() {
      const prefix = this.isDirty ? '*' : '';
      this.window.setTitle(`${prefix}${this.filename} - Notepad`);
    }
  }

  // Export to global scope
  global.Win95Notepad = Win95Notepad;

})(typeof window !== 'undefined' ? window : global);
