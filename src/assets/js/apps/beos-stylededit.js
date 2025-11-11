/**
 * BeOS StyledEdit
 * Text editor with styling support
 */

(function(global) {
  'use strict';

  /**
   * BeOS StyledEdit Application
   */
  class BeOSStyledEdit {
    constructor(desktop, filename = 'Untitled') {
      this.desktop = desktop;
      this.filename = filename;
      this.window = null;
      this.windowId = null;
      this.textArea = null;
      this.modified = false;
    }

    /**
     * Launch StyledEdit
     */
    launch() {
      const content = this._createContent();

      this.windowId = `stylededit-${Date.now()}`;
      this.window = this.desktop.windowSystem.createWindow({
        id: this.windowId,
        title: this.filename,
        width: 500,
        height: 400,
        content: content,
        resizable: true,
        menuItems: [
          { label: 'File', onClick: () => {} },
          { label: 'Edit', onClick: () => {} },
          { label: 'Font', onClick: () => {} },
          { label: 'Document', onClick: () => {} }
        ],
        onClose: () => this._handleClose()
      });

      // Add to current workspace
      if (this.desktop.workspaceSwitcher) {
        this.desktop.workspaceSwitcher.addWindowToWorkspace(this.windowId);
      }

      // Setup event handlers
      this._setupEventHandlers();

      // Append to container
      const container = document.getElementById('windows-container');
      if (container) {
        container.appendChild(this.window);
      }
    }

    /**
     * Create StyledEdit content
     * @private
     */
    _createContent() {
      return `
        <div class="stylededit-window" style="display: flex; flex-direction: column; height: 100%;">
          <!-- Toolbar -->
          <div class="beos-toolbar">
            <button class="beos-toolbar-button" data-action="bold" title="Bold">B</button>
            <button class="beos-toolbar-button" data-action="italic" title="Italic">I</button>
            <button class="beos-toolbar-button" data-action="underline" title="Underline">U</button>
            <div class="beos-toolbar-separator"></div>
            <select class="beos-input" id="font-family" style="margin: 0 4px; font-size: 10px;">
              <option>Helvetica</option>
              <option>Courier</option>
              <option>Times</option>
            </select>
            <select class="beos-input" id="font-size" style="margin: 0 4px; font-size: 10px; width: 60px;">
              <option>9</option>
              <option selected>10</option>
              <option>12</option>
              <option>14</option>
              <option>18</option>
            </select>
          </div>

          <!-- Text Area -->
          <div style="flex: 1; padding: 8px; overflow: hidden;">
            <textarea id="stylededit-textarea" style="
              width: 100%;
              height: 100%;
              border: none;
              outline: none;
              font-family: Helvetica, Arial, sans-serif;
              font-size: 10px;
              resize: none;
              background: white;
              color: black;
            " placeholder="Enter text here..."></textarea>
          </div>

          <!-- Status Bar -->
          <div class="beos-statusbar">
            <span id="stylededit-status">Line 1, Column 1</span>
            <span style="margin-left: auto;" id="char-count">0 characters</span>
          </div>
        </div>
      `;
    }

    /**
     * Setup event handlers
     * @private
     */
    _setupEventHandlers() {
      this.textArea = this.window.querySelector('#stylededit-textarea');
      if (!this.textArea) return;

      // Track modifications
      this.textArea.addEventListener('input', () => {
        this._markModified();
        this._updateStatus();
      });

      // Track cursor position
      this.textArea.addEventListener('click', () => this._updateStatus());
      this.textArea.addEventListener('keyup', () => this._updateStatus());

      // Toolbar buttons
      const toolbar = this.window.querySelector('.beos-toolbar');
      if (toolbar) {
        toolbar.addEventListener('click', (e) => {
          const button = e.target.closest('[data-action]');
          if (!button) return;

          const action = button.dataset.action;
          this._applyFormatting(action);
        });
      }

      // Font controls
      const fontFamily = this.window.querySelector('#font-family');
      const fontSize = this.window.querySelector('#font-size');

      if (fontFamily) {
        fontFamily.addEventListener('change', () => {
          this.textArea.style.fontFamily = fontFamily.value;
        });
      }

      if (fontSize) {
        fontSize.addEventListener('change', () => {
          this.textArea.style.fontSize = fontSize.value + 'px';
        });
      }

      // Keyboard shortcuts
      this.textArea.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
          if (e.key === 's') {
            e.preventDefault();
            this._save();
          } else if (e.key === 'n') {
            e.preventDefault();
            this._new();
          }
        }
      });

      // Initial status update
      this._updateStatus();
    }

    /**
     * Apply formatting
     * @private
     */
    _applyFormatting(format) {
      const start = this.textArea.selectionStart;
      const end = this.textArea.selectionEnd;

      if (start === end) {
        console.log('No text selected');
        return;
      }

      console.log(`Apply ${format} formatting (not fully implemented in this demo)`);
    }

    /**
     * Update status bar
     * @private
     */
    _updateStatus() {
      if (!this.textArea) return;

      const text = this.textArea.value;
      const pos = this.textArea.selectionStart;

      // Calculate line and column
      const beforeCursor = text.substring(0, pos);
      const lines = beforeCursor.split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;

      const status = this.window.querySelector('#stylededit-status');
      if (status) {
        status.textContent = `Line ${line}, Column ${column}`;
      }

      const charCount = this.window.querySelector('#char-count');
      if (charCount) {
        charCount.textContent = `${text.length} character${text.length !== 1 ? 's' : ''}`;
      }
    }

    /**
     * Mark as modified
     * @private
     */
    _markModified() {
      if (this.modified) return;

      this.modified = true;
      const titleEl = this.window.querySelector('.beos-window-tab-title');
      if (titleEl) {
        titleEl.textContent = this.filename + ' *';
      }
    }

    /**
     * Save file
     * @private
     */
    _save() {
      console.log('Saving file:', this.filename);
      this.modified = false;

      const titleEl = this.window.querySelector('.beos-window-tab-title');
      if (titleEl) {
        titleEl.textContent = this.filename;
      }

      // Show saved message in status
      const status = this.window.querySelector('#stylededit-status');
      if (status) {
        const originalText = status.textContent;
        status.textContent = 'Saved';
        setTimeout(() => {
          status.textContent = originalText;
        }, 2000);
      }
    }

    /**
     * New file
     * @private
     */
    _new() {
      if (this.modified) {
        if (!confirm('Discard changes?')) {
          return;
        }
      }

      this.textArea.value = '';
      this.filename = 'Untitled';
      this.modified = false;

      const titleEl = this.window.querySelector('.beos-window-tab-title');
      if (titleEl) {
        titleEl.textContent = this.filename;
      }

      this._updateStatus();
    }

    /**
     * Handle close
     * @private
     */
    _handleClose() {
      if (this.modified) {
        const confirmed = confirm(`Save changes to ${this.filename}?`);
        if (confirmed) {
          this._save();
        }
      }

      if (this.desktop.workspaceSwitcher) {
        this.desktop.workspaceSwitcher.removeWindowFromWorkspace(this.windowId);
      }
    }
  }

  // Export to global scope
  global.BeOSStyledEdit = BeOSStyledEdit;

})(window);
