/**
 * Windows XP WordPad
 * Rich text editor with formatting toolbar
 */

(function(global) {
  'use strict';

  class WinXPWordPad {
    constructor(desktop) {
      this.desktop = desktop;
      this.window = null;
      this.editor = null;
      this.filename = 'Document';
      this.modified = false;
    }

    /**
     * Open WordPad window
     */
    open() {
      const windowContent = this.buildContent();

      this.window = this.desktop.windowManager.createWindow({
        id: `wordpad-${Date.now()}`,
        title: this.getTitle(),
        content: windowContent,
        width: 700,
        height: 550,
        minWidth: 500,
        minHeight: 400,
        resizable: true,
        minimizable: true,
        maximizable: true
      });

      this.editor = this.window.element.querySelector('.wordpad-editor');
      this.setupEventListeners();
    }

    /**
     * Build window content
     */
    buildContent() {
      return `
        <div class="wordpad-container" style="display: flex; flex-direction: column; height: 100%; font-family: Tahoma, Arial, sans-serif; font-size: 11px; background: #ECE9D8;">
          <!-- Menu Bar -->
          <div class="wordpad-menubar" style="display: flex; background: linear-gradient(to bottom, #ECE9D8 0%, #D6D3CE 100%); border-bottom: 1px solid #ACA899; padding: 2px 4px;">
            <button class="wordpad-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">File</button>
            <button class="wordpad-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">Edit</button>
            <button class="wordpad-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">View</button>
            <button class="wordpad-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">Insert</button>
            <button class="wordpad-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">Format</button>
            <button class="wordpad-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">Help</button>
          </div>

          <!-- Toolbar -->
          <div class="wordpad-toolbar" style="display: flex; align-items: center; gap: 4px; background: #ECE9D8; border-bottom: 1px solid #ACA899; padding: 4px 8px; flex-wrap: wrap;">
            <button class="toolbar-btn" title="New" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">📄</button>
            <button class="toolbar-btn" title="Open" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">📁</button>
            <button class="toolbar-btn" title="Save" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">💾</button>
            <button class="toolbar-btn" title="Print" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">🖨️</button>
            <div style="width: 1px; height: 24px; background: #ACA899; margin: 0 4px;"></div>
            <button class="format-btn" data-command="bold" title="Bold (Ctrl+B)" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer; font-weight: bold;">B</button>
            <button class="format-btn" data-command="italic" title="Italic (Ctrl+I)" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer; font-style: italic;">I</button>
            <button class="format-btn" data-command="underline" title="Underline (Ctrl+U)" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer; text-decoration: underline;">U</button>
            <div style="width: 1px; height: 24px; background: #ACA899; margin: 0 4px;"></div>
            <select class="font-family" title="Font" style="padding: 4px; border: 1px solid #ACA899; background: white; font-family: Tahoma; font-size: 11px; cursor: pointer;">
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Tahoma" selected>Tahoma</option>
              <option value="Verdana">Verdana</option>
            </select>
            <select class="font-size" title="Font Size" style="padding: 4px; border: 1px solid #ACA899; background: white; font-family: Tahoma; font-size: 11px; cursor: pointer;">
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12" selected>12</option>
              <option value="14">14</option>
              <option value="16">16</option>
              <option value="18">18</option>
              <option value="20">20</option>
              <option value="24">24</option>
            </select>
            <div style="width: 1px; height: 24px; background: #ACA899; margin: 0 4px;"></div>
            <button class="format-btn" data-command="justifyLeft" title="Align Left" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">≡</button>
            <button class="format-btn" data-command="justifyCenter" title="Center" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">≡</button>
            <button class="format-btn" data-command="justifyRight" title="Align Right" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">≡</button>
            <div style="width: 1px; height: 24px; background: #ACA899; margin: 0 4px;"></div>
            <button class="format-btn" data-command="insertUnorderedList" title="Bullets" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">• List</button>
            <input type="color" class="text-color" value="#000000" title="Text Color" style="width: 32px; height: 28px; border: 1px solid #ACA899; cursor: pointer; margin-left: 4px;">
          </div>

          <!-- Editor Area -->
          <div class="wordpad-editor-container" style="flex: 1; overflow: auto; background: #808080; padding: 16px;">
            <div class="wordpad-editor" contenteditable="true" style="min-height: 100%; background: white; padding: 24px; font-family: Tahoma, Arial, sans-serif; font-size: 12pt; line-height: 1.5; outline: none; box-shadow: 0 0 8px rgba(0,0,0,0.2);">
              <p>Start typing your document here...</p>
            </div>
          </div>

          <!-- Status Bar -->
          <div class="wordpad-statusbar" style="background: #ECE9D8; border-top: 1px solid #ACA899; padding: 4px 8px; display: flex; justify-content: space-between;">
            <span>For Help, press F1</span>
            <span id="word-count">0 words</span>
          </div>
        </div>
      `;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
      if (!this.editor) return;

      // Track modifications
      this.editor.addEventListener('input', () => {
        if (!this.modified) {
          this.modified = true;
          this.updateTitle();
        }
        this.updateWordCount();
      });

      // Format buttons
      const formatButtons = this.window.element.querySelectorAll('.format-btn');
      formatButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const command = btn.dataset.command;
          document.execCommand(command, false, null);
          this.editor.focus();
        });

        btn.addEventListener('mouseenter', () => {
          btn.style.background = 'linear-gradient(to bottom, #E8F2FF 0%, #C0DEFF 100%)';
          btn.style.borderColor = '#0054E3';
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.background = 'linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%)';
          btn.style.borderColor = '#ACA899';
        });
      });

      // Font family
      const fontFamily = this.window.element.querySelector('.font-family');
      if (fontFamily) {
        fontFamily.addEventListener('change', (e) => {
          document.execCommand('fontName', false, e.target.value);
          this.editor.focus();
        });
      }

      // Font size
      const fontSize = this.window.element.querySelector('.font-size');
      if (fontSize) {
        fontSize.addEventListener('change', (e) => {
          document.execCommand('fontSize', false, '3');
          const fontElements = this.editor.querySelectorAll('font[size="3"]');
          fontElements.forEach(el => {
            el.removeAttribute('size');
            el.style.fontSize = e.target.value + 'pt';
          });
          this.editor.focus();
        });
      }

      // Text color
      const textColor = this.window.element.querySelector('.text-color');
      if (textColor) {
        textColor.addEventListener('change', (e) => {
          document.execCommand('foreColor', false, e.target.value);
          this.editor.focus();
        });
      }

      // Menu buttons
      const menuButtons = this.window.element.querySelectorAll('.wordpad-menu-btn');
      menuButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
          btn.style.background = 'linear-gradient(to bottom, #4B91FF 0%, #3C81F3 100%)';
          btn.style.color = 'white';
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.background = 'transparent';
          btn.style.color = 'inherit';
        });

        btn.addEventListener('click', () => {
          this.handleMenuClick(btn.textContent.trim());
        });
      });

      // Keyboard shortcuts
      this.editor.addEventListener('keydown', (e) => {
        if (e.ctrlKey) {
          switch(e.key.toLowerCase()) {
            case 's':
              e.preventDefault();
              this.save();
              break;
            case 'b':
            case 'i':
            case 'u':
              // Let execCommand handle these
              break;
          }
        }
      });
    }

    /**
     * Update word count
     */
    updateWordCount() {
      const text = this.editor.textContent.trim();
      const words = text ? text.split(/\s+/).length : 0;
      const wordCount = this.window.element.querySelector('#word-count');
      if (wordCount) {
        wordCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
      }
    }

    /**
     * Handle menu click
     */
    handleMenuClick(menu) {
      switch(menu) {
        case 'File':
          alert('File menu - New, Open, Save, Save As, Print...');
          break;
        case 'Edit':
          alert('Edit menu - Undo, Cut, Copy, Paste, Find...');
          break;
        case 'View':
          alert('View menu - Toolbar, Format Bar, Ruler, Status Bar...');
          break;
        case 'Insert':
          alert('Insert menu - Date and Time, Object...');
          break;
        case 'Format':
          alert('Format menu - Font, Bullet Style, Paragraph...');
          break;
        case 'Help':
          alert('WordPad Help\n\nWindows XP WordPad Recreation\nRetroOS Museum Project');
          break;
      }
    }

    /**
     * Save document
     */
    save() {
      const content = this.editor.innerHTML;
      navigator.clipboard.writeText(this.editor.textContent).then(() => {
        alert('Document saved: ' + this.filename + '.rtf\n\n(Text content copied to clipboard)');
        this.modified = false;
        this.updateTitle();
      }).catch(() => {
        alert('Document saved: ' + this.filename + '.rtf');
        this.modified = false;
        this.updateTitle();
      });
    }

    /**
     * Get window title
     */
    getTitle() {
      return this.filename + (this.modified ? '*' : '') + ' - WordPad';
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
  global.WinXPWordPad = WinXPWordPad;

})(typeof window !== 'undefined' ? window : global);
