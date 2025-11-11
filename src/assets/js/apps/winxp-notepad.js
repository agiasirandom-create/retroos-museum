/**
 * Windows XP Notepad
 * Classic text editor application
 */

(function(global) {
  'use strict';

  class WinXPNotepad {
    constructor(desktop) {
      this.desktop = desktop;
      this.window = null;
      this.textarea = null;
      this.filename = 'Untitled';
      this.modified = false;
    }

    /**
     * Open Notepad window
     */
    open(content = '', filename = 'Untitled') {
      this.filename = filename;
      this.modified = false;

      const windowContent = this.buildContent(content);

      this.window = this.desktop.windowManager.createWindow({
        id: `notepad-${Date.now()}`,
        title: this.getTitle(),
        content: windowContent,
        width: 600,
        height: 450,
        minWidth: 400,
        minHeight: 300,
        resizable: true,
        minimizable: true,
        maximizable: true
      });

      // Get textarea reference
      this.textarea = this.window.element.querySelector('.notepad-textarea');

      // Setup event listeners
      this.setupEventListeners();
    }

    /**
     * Build window content
     */
    buildContent(content) {
      return `
        <div class="notepad-container" style="display: flex; flex-direction: column; height: 100%;">
          <!-- Menu Bar -->
          <div class="notepad-menubar" style="display: flex; background: linear-gradient(to bottom, #ECE9D8 0%, #D6D3CE 100%); border-bottom: 1px solid #ACA899; padding: 2px 4px; font-family: Tahoma, Arial, sans-serif; font-size: 11px;">
            <button class="notepad-menu-btn" data-menu="file" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">File</button>
            <button class="notepad-menu-btn" data-menu="edit" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">Edit</button>
            <button class="notepad-menu-btn" data-menu="format" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">Format</button>
            <button class="notepad-menu-btn" data-menu="view" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">View</button>
            <button class="notepad-menu-btn" data-menu="help" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">Help</button>
          </div>

          <!-- Text Area -->
          <textarea class="notepad-textarea" style="flex: 1; width: 100%; border: none; padding: 8px; font-family: 'Lucida Console', 'Courier New', monospace; font-size: 10pt; resize: none; background: white; color: #000; outline: none;">${content}</textarea>

          <!-- Status Bar -->
          <div class="notepad-statusbar" style="display: none; background: #ECE9D8; border-top: 1px solid #ACA899; padding: 4px 8px; font-family: Tahoma, Arial, sans-serif; font-size: 11px; color: #000;">
            <span class="status-text">Line 1, Col 1</span>
          </div>
        </div>
      `;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
      if (!this.textarea) return;

      // Track modifications
      this.textarea.addEventListener('input', () => {
        if (!this.modified) {
          this.modified = true;
          this.updateTitle();
        }
      });

      // Menu buttons
      const menuButtons = this.window.element.querySelectorAll('.notepad-menu-btn');
      menuButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.handleMenuClick(btn.dataset.menu);
        });

        // Hover effect
        btn.addEventListener('mouseenter', () => {
          btn.style.background = 'linear-gradient(to bottom, #4B91FF 0%, #3C81F3 100%)';
          btn.style.color = 'white';
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.background = 'transparent';
          btn.style.color = 'inherit';
        });
      });

      // Keyboard shortcuts
      this.textarea.addEventListener('keydown', (e) => {
        if (e.ctrlKey) {
          switch(e.key.toLowerCase()) {
            case 's':
              e.preventDefault();
              this.save();
              break;
            case 'o':
              e.preventDefault();
              this.openFile();
              break;
            case 'n':
              e.preventDefault();
              this.newFile();
              break;
          }
        }
      });
    }

    /**
     * Handle menu click
     */
    handleMenuClick(menu) {
      switch(menu) {
        case 'file':
          this.showFileMenu();
          break;
        case 'edit':
          this.showEditMenu();
          break;
        case 'format':
          alert('Format menu - In a full implementation, this would show format options.');
          break;
        case 'view':
          alert('View menu - In a full implementation, this would show view options.');
          break;
        case 'help':
          alert('Help menu - About Notepad\n\nWindows XP Notepad Recreation\nRetroOS Museum Project');
          break;
      }
    }

    /**
     * Show file menu
     */
    showFileMenu() {
      const options = [
        'New (Ctrl+N)',
        'Open... (Ctrl+O)',
        'Save (Ctrl+S)',
        'Save As...',
        'Exit'
      ];

      const choice = prompt('File Menu:\n' + options.join('\n') + '\n\nEnter option number (1-5):');

      switch(choice) {
        case '1':
          this.newFile();
          break;
        case '2':
          this.openFile();
          break;
        case '3':
          this.save();
          break;
        case '4':
          this.saveAs();
          break;
        case '5':
          this.window.close();
          break;
      }
    }

    /**
     * Show edit menu
     */
    showEditMenu() {
      const options = [
        'Undo (Ctrl+Z)',
        'Cut (Ctrl+X)',
        'Copy (Ctrl+C)',
        'Paste (Ctrl+V)',
        'Delete (Del)',
        'Select All (Ctrl+A)',
        'Find... (Ctrl+F)',
        'Find Next (F3)',
        'Replace... (Ctrl+H)'
      ];

      alert('Edit Menu:\n\n' + options.join('\n') + '\n\nThese commands work with standard keyboard shortcuts.');
    }

    /**
     * New file
     */
    newFile() {
      if (this.modified) {
        const save = confirm('Do you want to save changes to ' + this.filename + '?');
        if (save) {
          this.save();
        }
      }

      this.textarea.value = '';
      this.filename = 'Untitled';
      this.modified = false;
      this.updateTitle();
    }

    /**
     * Open file (simulated)
     */
    openFile() {
      const content = prompt('Paste file content to open:');
      if (content !== null) {
        this.textarea.value = content;
        this.filename = prompt('Enter filename:', 'Document.txt') || 'Document.txt';
        this.modified = false;
        this.updateTitle();
      }
    }

    /**
     * Save file (simulated)
     */
    save() {
      if (this.filename === 'Untitled') {
        this.saveAs();
      } else {
        this.performSave();
      }
    }

    /**
     * Save as (simulated)
     */
    saveAs() {
      const filename = prompt('Enter filename:', this.filename + '.txt');
      if (filename) {
        this.filename = filename;
        this.performSave();
      }
    }

    /**
     * Perform save operation
     */
    performSave() {
      // In a real implementation, this would save to a file
      // For now, we'll just copy to clipboard and show a message
      const content = this.textarea.value;

      navigator.clipboard.writeText(content).then(() => {
        alert('File saved: ' + this.filename + '\n\n(Content copied to clipboard)');
        this.modified = false;
        this.updateTitle();
      }).catch(() => {
        alert('File saved: ' + this.filename + '\n\n(Clipboard access denied, but consider it saved!)');
        this.modified = false;
        this.updateTitle();
      });
    }

    /**
     * Get window title
     */
    getTitle() {
      return (this.modified ? '*' : '') + this.filename + ' - Notepad';
    }

    /**
     * Update window title
     */
    updateTitle() {
      if (this.window) {
        this.window.setTitle(this.getTitle());
      }
    }
  }

  // Export to global scope
  global.WinXPNotepad = WinXPNotepad;

})(typeof window !== 'undefined' ? window : global);
