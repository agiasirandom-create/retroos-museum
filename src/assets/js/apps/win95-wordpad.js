/**
 * Windows 95 WordPad
 * Rich text editor with formatting toolbar
 */

(function(global) {
  'use strict';

  class Win95WordPad {
    constructor(windowManager) {
      this.windowManager = windowManager;
      this.window = null;
      this.editor = null;
      this.filename = 'Document';
      this.isDirty = false;
    }

    /**
     * Open WordPad
     */
    open(filename = 'Document', content = '') {
      this.filename = filename;

      const windowContent = this.createContent(content);

      this.window = this.windowManager.createWindow({
        id: `wordpad-${Date.now()}`,
        title: `${this.filename} - WordPad`,
        width: 700,
        height: 500,
        minWidth: 500,
        minHeight: 400,
        content: windowContent
      });

      // Get references
      this.editor = this.window.element.querySelector('.wordpad-editor');

      // Set up event listeners
      this.setupEventListeners();
    }

    /**
     * Create window content
     */
    createContent(initialContent) {
      return `
        <div class="wordpad-container" style="
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #C0C0C0;
        ">
          <!-- Menu Bar -->
          <div class="window-menubar" style="flex-shrink: 0;">
            <div class="menu-item" data-menu="file">File</div>
            <div class="menu-item" data-menu="edit">Edit</div>
            <div class="menu-item" data-menu="view">View</div>
            <div class="menu-item" data-menu="insert">Insert</div>
            <div class="menu-item" data-menu="format">Format</div>
            <div class="menu-item" data-menu="help">Help</div>
          </div>

          <!-- Toolbar -->
          <div class="wordpad-toolbar" style="
            display: flex;
            gap: 2px;
            padding: 4px;
            background: #C0C0C0;
            border-bottom: 2px solid;
            border-color: #808080 #FFF #FFF #808080;
            flex-wrap: wrap;
            align-items: center;
          ">
            <!-- Font Name -->
            <select class="font-name" style="
              padding: 2px 4px;
              font-family: 'MS Sans Serif', sans-serif;
              font-size: 11px;
              border: 2px solid;
              border-color: #808080 #FFF #FFF #808080;
            ">
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
            </select>

            <!-- Font Size -->
            <select class="font-size" style="
              padding: 2px 4px;
              font-family: 'MS Sans Serif', sans-serif;
              font-size: 11px;
              border: 2px solid;
              border-color: #808080 #FFF #FFF #808080;
              width: 50px;
            ">
              <option value="8">8</option>
              <option value="10">10</option>
              <option value="12" selected>12</option>
              <option value="14">14</option>
              <option value="16">16</option>
              <option value="18">18</option>
              <option value="20">20</option>
              <option value="24">24</option>
            </select>

            <!-- Separator -->
            <div style="width: 2px; height: 20px; background: #808080; margin: 0 4px;"></div>

            <!-- Bold -->
            <button class="toolbar-btn bold-btn" data-command="bold" style="
              width: 24px;
              height: 24px;
              background: #C0C0C0;
              border: 2px solid;
              border-color: #FFF #808080 #808080 #FFF;
              cursor: pointer;
              font-weight: bold;
              font-size: 12px;
            " title="Bold">B</button>

            <!-- Italic -->
            <button class="toolbar-btn italic-btn" data-command="italic" style="
              width: 24px;
              height: 24px;
              background: #C0C0C0;
              border: 2px solid;
              border-color: #FFF #808080 #808080 #FFF;
              cursor: pointer;
              font-style: italic;
              font-size: 12px;
            " title="Italic">I</button>

            <!-- Underline -->
            <button class="toolbar-btn underline-btn" data-command="underline" style="
              width: 24px;
              height: 24px;
              background: #C0C0C0;
              border: 2px solid;
              border-color: #FFF #808080 #808080 #FFF;
              cursor: pointer;
              text-decoration: underline;
              font-size: 12px;
            " title="Underline">U</button>

            <!-- Separator -->
            <div style="width: 2px; height: 20px; background: #808080; margin: 0 4px;"></div>

            <!-- Align Left -->
            <button class="toolbar-btn align-left-btn" data-command="justifyLeft" style="
              width: 24px;
              height: 24px;
              background: #C0C0C0;
              border: 2px solid;
              border-color: #FFF #808080 #808080 #FFF;
              cursor: pointer;
              font-size: 12px;
            " title="Align Left">⬅</button>

            <!-- Align Center -->
            <button class="toolbar-btn align-center-btn" data-command="justifyCenter" style="
              width: 24px;
              height: 24px;
              background: #C0C0C0;
              border: 2px solid;
              border-color: #FFF #808080 #808080 #FFF;
              cursor: pointer;
              font-size: 12px;
            " title="Align Center">⬌</button>

            <!-- Align Right -->
            <button class="toolbar-btn align-right-btn" data-command="justifyRight" style="
              width: 24px;
              height: 24px;
              background: #C0C0C0;
              border: 2px solid;
              border-color: #FFF #808080 #808080 #FFF;
              cursor: pointer;
              font-size: 12px;
            " title="Align Right">➡</button>

            <!-- Separator -->
            <div style="width: 2px; height: 20px; background: #808080; margin: 0 4px;"></div>

            <!-- Bullets -->
            <button class="toolbar-btn bullets-btn" data-command="insertUnorderedList" style="
              width: 24px;
              height: 24px;
              background: #C0C0C0;
              border: 2px solid;
              border-color: #FFF #808080 #808080 #FFF;
              cursor: pointer;
              font-size: 12px;
            " title="Bullets">•</button>

            <!-- Color Picker -->
            <input type="color" class="color-picker" value="#000000" style="
              width: 32px;
              height: 24px;
              border: 2px solid;
              border-color: #FFF #808080 #808080 #FFF;
              cursor: pointer;
            " title="Text Color">
          </div>

          <!-- Ruler -->
          <div style="
            height: 20px;
            background: #FFF;
            border-bottom: 1px solid #808080;
            display: flex;
            align-items: center;
            padding: 0 8px;
            font-size: 8px;
            font-family: 'Courier New', monospace;
          ">
            ${'|'.repeat(80).split('').map((c, i) => i % 10 === 0 ? i/10 : c).join('')}
          </div>

          <!-- Editor -->
          <div contenteditable="true" class="wordpad-editor" style="
            flex: 1;
            background: #FFF;
            padding: 16px;
            margin: 2px;
            border: 2px solid;
            border-color: #808080 #FFF #FFF #808080;
            overflow: auto;
            outline: none;
            font-family: Arial, sans-serif;
            font-size: 12pt;
            line-height: 1.5;
          ">${initialContent}</div>

          <!-- Status Bar -->
          <div class="wordpad-status" style="
            height: 24px;
            background: #C0C0C0;
            border-top: 2px solid;
            border-color: #FFF #808080 #808080 #FFF;
            display: flex;
            align-items: center;
            padding: 0 8px;
            font-size: 11px;
          ">
            For Help, press F1
          </div>
        </div>
      `;
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
      // Track changes
      this.editor.addEventListener('input', () => {
        this.isDirty = true;
        this.updateTitle();
      });

      // Toolbar buttons
      const toolbarBtns = this.window.element.querySelectorAll('.toolbar-btn');
      toolbarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const command = btn.getAttribute('data-command');
          document.execCommand(command, false, null);
          this.editor.focus();
          this.updateButtonStates();
        });
      });

      // Font name
      const fontName = this.window.element.querySelector('.font-name');
      fontName.addEventListener('change', () => {
        document.execCommand('fontName', false, fontName.value);
        this.editor.focus();
      });

      // Font size
      const fontSize = this.window.element.querySelector('.font-size');
      fontSize.addEventListener('change', () => {
        document.execCommand('fontSize', false, '3');
        const fontElements = this.editor.querySelectorAll('font[size="3"]');
        fontElements.forEach(el => {
          el.removeAttribute('size');
          el.style.fontSize = fontSize.value + 'pt';
        });
        this.editor.focus();
      });

      // Color picker
      const colorPicker = this.window.element.querySelector('.color-picker');
      colorPicker.addEventListener('change', () => {
        document.execCommand('foreColor', false, colorPicker.value);
        this.editor.focus();
      });

      // Update button states on selection change
      this.editor.addEventListener('mouseup', () => this.updateButtonStates());
      this.editor.addEventListener('keyup', () => this.updateButtonStates());

      // Menu items
      const menuItems = this.window.element.querySelectorAll('.menu-item');
      menuItems.forEach(item => {
        item.addEventListener('click', () => {
          const menu = item.getAttribute('data-menu');
          this.showMenu(menu, item);
        });
      });

      // Keyboard shortcuts
      this.editor.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 's') {
          e.preventDefault();
          this.save();
        } else if (e.ctrlKey && e.key === 'p') {
          e.preventDefault();
          this.print();
        }
      });
    }

    /**
     * Update button states based on current selection
     */
    updateButtonStates() {
      const buttons = {
        'bold': this.window.element.querySelector('.bold-btn'),
        'italic': this.window.element.querySelector('.italic-btn'),
        'underline': this.window.element.querySelector('.underline-btn')
      };

      for (let [command, button] of Object.entries(buttons)) {
        if (button) {
          const isActive = document.queryCommandState(command);
          if (isActive) {
            button.style.borderColor = '#808080 #FFF #FFF #808080';
            button.style.background = '#808080';
          } else {
            button.style.borderColor = '#FFF #808080 #808080 #FFF';
            button.style.background = '#C0C0C0';
          }
        }
      }
    }

    /**
     * Show menu
     */
    showMenu(menuType, triggerElement) {
      const menus = {
        file: [
          { label: 'New', shortcut: 'Ctrl+N', action: () => this.newDocument() },
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
          { label: 'Redo', shortcut: 'Ctrl+Y', action: () => document.execCommand('redo') },
          { type: 'separator' },
          { label: 'Cut', shortcut: 'Ctrl+X', action: () => document.execCommand('cut') },
          { label: 'Copy', shortcut: 'Ctrl+C', action: () => document.execCommand('copy') },
          { label: 'Paste', shortcut: 'Ctrl+V', action: () => document.execCommand('paste') },
          { type: 'separator' },
          { label: 'Select All', shortcut: 'Ctrl+A', action: () => document.execCommand('selectAll') },
          { label: 'Find...', shortcut: 'Ctrl+F', action: () => this.showFind() }
        ]
      };

      if (menus[menuType]) {
        this.showDropdownMenu(menus[menuType], triggerElement);
      }
    }

    /**
     * Show dropdown menu
     */
    showDropdownMenu(items, triggerElement) {
      // Remove existing menu
      const existingMenu = document.querySelector('.wordpad-dropdown-menu');
      if (existingMenu) {
        existingMenu.remove();
      }

      const menu = document.createElement('div');
      menu.className = 'wordpad-dropdown-menu';
      menu.style.cssText = `
        position: absolute;
        background: #C0C0C0;
        border: 2px solid;
        border-color: #FFF #000 #000 #FFF;
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
            background: linear-gradient(to bottom, #808080, #FFF);
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
            menuItem.style.color = '#FFF';
          });

          menuItem.addEventListener('mouseleave', () => {
            menuItem.style.background = 'transparent';
            menuItem.style.color = '#000';
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
     * New document
     */
    newDocument() {
      if (this.isDirty) {
        if (confirm('Do you want to save changes?')) {
          this.save();
        }
      }
      this.editor.innerHTML = '';
      this.filename = 'Document';
      this.isDirty = false;
      this.updateTitle();
    }

    /**
     * Save document
     */
    save() {
      const content = this.editor.innerHTML;
      const blob = new Blob([content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = this.filename.endsWith('.rtf') ? this.filename : `${this.filename}.rtf`;
      a.click();

      URL.revokeObjectURL(url);

      this.isDirty = false;
      this.updateTitle();
    }

    /**
     * Save as
     */
    saveAs() {
      const newFilename = prompt('Save as:', this.filename);
      if (newFilename) {
        this.filename = newFilename;
        this.save();
      }
    }

    /**
     * Print
     */
    print() {
      window.print();
    }

    /**
     * Show find dialog
     */
    showFind() {
      const searchText = prompt('Find:');
      if (searchText) {
        window.find(searchText);
      }
    }

    /**
     * Update window title
     */
    updateTitle() {
      const prefix = this.isDirty ? '*' : '';
      this.window.setTitle(`${prefix}${this.filename} - WordPad`);
    }
  }

  // Export to global scope
  global.Win95WordPad = Win95WordPad;

})(typeof window !== 'undefined' ? window : global);
