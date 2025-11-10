/**
 * Mac OS System 7 SimpleText
 * Simple text editor application
 */

(function(global) {
  'use strict';

  /**
   * Mac OS 7 SimpleText Application
   */
  class MacOS7SimpleText {
    constructor(desktop) {
      this.desktop = desktop;
      this.window = null;
      this.textarea = null;
      this.modified = false;
      this.filename = 'Untitled';
    }

    /**
     * Open SimpleText window
     * @param {string} filename - Optional filename
     * @param {string} content - Optional initial content
     */
    open(filename = 'Untitled', content = '') {
      this.filename = filename;

      const windowContent = this._buildContent(content);

      this.window = this.desktop.createAppWindow({
        id: 'simpletext-' + Date.now(),
        title: this.filename,
        content: windowContent,
        width: 480,
        height: 320,
        minWidth: 200,
        minHeight: 150,
        resizable: true,
        onClose: () => {
          if (this.modified) {
            return confirm('Do you want to save changes before closing?');
          }
          this.window = null;
          return true;
        }
      });

      this._attachEventListeners();
      this._focusTextarea();
    }

    /**
     * Build SimpleText content
     * @param {string} initialContent - Initial text content
     * @private
     */
    _buildContent(initialContent) {
      return `
        <div style="display: flex; flex-direction: column; height: 100%;">
          <textarea class="mac-textarea" style="flex: 1; border: none; outline: none;">${initialContent}</textarea>
        </div>
      `;
    }

    /**
     * Attach event listeners
     * @private
     */
    _attachEventListeners() {
      if (!this.window) return;

      this.textarea = this.window.element.querySelector('textarea');
      if (!this.textarea) return;

      // Track modifications
      this.textarea.addEventListener('input', () => {
        if (!this.modified) {
          this.modified = true;
          this.window.setTitle(this.filename + ' *');
        }
      });

      // Listen for menu actions
      document.addEventListener('macos7:menuaction', (e) => {
        if (this.window && this.window === this.desktop.windowManager.activeWindow) {
          this._handleMenuAction(e.detail.action);
        }
      });

      // Keyboard shortcuts
      this.textarea.addEventListener('keydown', (e) => {
        // Command+S: Save
        if ((e.metaKey || e.ctrlKey) && e.key === 's') {
          e.preventDefault();
          this._save();
        }

        // Command+A: Select All
        if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
          // Let browser handle this
        }

        // Command+Z: Undo (browser default)
        // Command+X: Cut (browser default)
        // Command+C: Copy (browser default)
        // Command+V: Paste (browser default)
      });
    }

    /**
     * Focus textarea
     * @private
     */
    _focusTextarea() {
      setTimeout(() => {
        if (this.textarea) {
          this.textarea.focus();
        }
      }, 100);
    }

    /**
     * Handle menu action
     * @param {string} action - Action name
     * @private
     */
    _handleMenuAction(action) {
      if (!this.textarea) return;

      switch (action) {
        case 'cut':
          document.execCommand('cut');
          break;

        case 'copy':
          document.execCommand('copy');
          break;

        case 'paste':
          document.execCommand('paste');
          break;

        case 'selectAll':
          this.textarea.select();
          break;

        case 'clear':
          if (this.textarea.selectionStart !== this.textarea.selectionEnd) {
            const start = this.textarea.selectionStart;
            const end = this.textarea.selectionEnd;
            const text = this.textarea.value;
            this.textarea.value = text.substring(0, start) + text.substring(end);
            this.textarea.selectionStart = this.textarea.selectionEnd = start;
            this.modified = true;
            this.window.setTitle(this.filename + ' *');
          }
          break;

        case 'undo':
          document.execCommand('undo');
          break;

        case 'print':
          window.print();
          break;

        case 'close':
          this.window.close();
          break;
      }
    }

    /**
     * Save document
     * @private
     */
    _save() {
      // In a real implementation, this would save to localStorage or trigger a download
      this.modified = false;
      this.window.setTitle(this.filename);
      alert('Document saved (demo)');
    }

    /**
     * Set text content
     * @param {string} text - Text content
     */
    setText(text) {
      if (this.textarea) {
        this.textarea.value = text;
      }
    }

    /**
     * Get text content
     * @returns {string} Text content
     */
    getText() {
      return this.textarea ? this.textarea.value : '';
    }
  }

  // Export to global scope
  global.MacOS7SimpleText = MacOS7SimpleText;

})(typeof window !== 'undefined' ? window : global);
