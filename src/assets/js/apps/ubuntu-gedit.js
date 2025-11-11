/**
 * Ubuntu gedit Text Editor
 * Simple GNOME text editor with tabs and basic editing
 */

(function(global) {
  'use strict';

  class UbuntuGedit {
    constructor(windowManager) {
      this.windowManager = windowManager;
      this.windowInstance = null;
      this.filename = null;
      this.content = '';
      this.modified = false;
    }

    /**
     * Open gedit window
     */
    open(filename = null, content = '') {
      this.filename = filename;
      this.content = content;
      this.modified = false;

      const title = filename ? `${filename} - gedit` : 'Untitled Document - gedit';

      this.windowInstance = this.windowManager.createWindow({
        id: `gedit-${Date.now()}`,
        title: title,
        width: 640,
        height: 480,
        x: 120 + Math.random() * 100,
        y: 100 + Math.random() * 80,
        resizable: true,
        content: this.renderContent()
      });

      this.attachEventListeners();
    }

    /**
     * Render gedit content
     */
    renderContent() {
      return `
        <div class="gedit-container">
          <!-- Menu Bar -->
          <div class="gedit-menubar">
            <button class="gedit-menu-item">File</button>
            <button class="gedit-menu-item">Edit</button>
            <button class="gedit-menu-item">View</button>
            <button class="gedit-menu-item">Search</button>
            <button class="gedit-menu-item">Tools</button>
            <button class="gedit-menu-item">Documents</button>
            <button class="gedit-menu-item">Help</button>
          </div>

          <!-- Toolbar -->
          <div class="gedit-toolbar">
            <button class="gedit-btn" data-action="new" title="New">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 2h6l3 3v9H4V2z"/>
                <path d="M10 2v3h3"/>
              </svg>
            </button>
            <button class="gedit-btn" data-action="open" title="Open">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 4h4l2 2h6v7H2V4z"/>
              </svg>
            </button>
            <button class="gedit-btn" data-action="save" title="Save">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2" y="2" width="12" height="12" rx="1"/>
                <rect x="4" y="2" width="8" height="5" fill="white"/>
                <rect x="9" y="3" width="2" height="3" fill="#808080"/>
              </svg>
            </button>
            <div class="gedit-separator"></div>
            <button class="gedit-btn" data-action="undo" title="Undo">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 3v3l-4-2 4-2zM4 7c0 2.2 1.8 4 4 4s4-1.8 4-4"/>
              </svg>
            </button>
            <button class="gedit-btn" data-action="redo" title="Redo">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 3v3l4-2-4-2zM12 7c0 2.2-1.8 4-4 4s-4-1.8-4-4"/>
              </svg>
            </button>
            <div class="gedit-separator"></div>
            <button class="gedit-btn" data-action="cut" title="Cut">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 8l4-4 4 4M8 4v8"/>
                <circle cx="5" cy="11" r="2"/>
                <circle cx="11" cy="11" r="2"/>
              </svg>
            </button>
            <button class="gedit-btn" data-action="copy" title="Copy">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="5" y="2" width="8" height="10" rx="1"/>
                <rect x="3" y="4" width="8" height="10" rx="1" fill="white" stroke="currentColor"/>
              </svg>
            </button>
            <button class="gedit-btn" data-action="paste" title="Paste">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="4" y="5" width="8" height="9" rx="1"/>
                <path d="M6 2h4v3H6V2z"/>
              </svg>
            </button>
            <div class="gedit-separator"></div>
            <button class="gedit-btn" data-action="find" title="Find">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="7" cy="7" r="4"/>
                <path d="M10 10l4 4"/>
              </svg>
            </button>
          </div>

          <!-- Editor Area -->
          <div class="gedit-editor">
            <textarea class="gedit-textarea" placeholder="Start typing...">${this.content}</textarea>
          </div>

          <!-- Status Bar -->
          <div class="gedit-statusbar">
            <span class="gedit-status-text">Ln 1, Col 1</span>
            <span class="gedit-status-spacer"></span>
            <span class="gedit-status-encoding">UTF-8</span>
          </div>
        </div>

        <style>
          .gedit-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: white;
            font-family: 'Ubuntu Sans', sans-serif;
          }

          .gedit-menubar {
            display: flex;
            padding: 2px 4px;
            background: #E9E7E3;
            border-bottom: 1px solid #9B9388;
          }

          .gedit-menu-item {
            padding: 4px 12px;
            background: transparent;
            border: none;
            border-radius: 2px;
            font-family: 'Ubuntu Sans', sans-serif;
            font-size: 10pt;
            cursor: pointer;
            transition: background-color 0.1s ease;
          }

          .gedit-menu-item:hover {
            background: rgba(240, 119, 70, 0.15);
          }

          .gedit-toolbar {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 4px 6px;
            background: #E9E7E3;
            border-bottom: 1px solid #9B9388;
          }

          .gedit-btn {
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: 1px solid transparent;
            border-radius: 2px;
            cursor: pointer;
            color: #2C2C2C;
            transition: all 0.1s ease;
          }

          .gedit-btn:hover {
            background: rgba(255, 255, 255, 0.5);
            border-color: #9B9388;
          }

          .gedit-btn:active {
            background: rgba(240, 119, 70, 0.2);
            border-color: #F07746;
          }

          .gedit-separator {
            width: 1px;
            height: 24px;
            background: #9B9388;
            margin: 0 4px;
          }

          .gedit-editor {
            flex: 1;
            overflow: hidden;
            display: flex;
          }

          .gedit-textarea {
            flex: 1;
            padding: 12px;
            border: none;
            outline: none;
            font-family: 'Courier New', monospace;
            font-size: 11pt;
            line-height: 1.5;
            resize: none;
            background: white;
          }

          .gedit-statusbar {
            display: flex;
            align-items: center;
            padding: 4px 12px;
            background: #E9E7E3;
            border-top: 1px solid #9B9388;
            font-size: 9pt;
            color: #666;
          }

          .gedit-status-spacer {
            flex: 1;
          }

          .gedit-status-encoding {
            padding-left: 12px;
          }
        </style>
      `;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
      const content = this.windowInstance.contentArea;
      const textarea = content.querySelector('.gedit-textarea');
      const statusText = content.querySelector('.gedit-status-text');

      // Track cursor position
      if (textarea && statusText) {
        const updateStatus = () => {
          const text = textarea.value;
          const cursorPos = textarea.selectionStart;
          const textBeforeCursor = text.substring(0, cursorPos);
          const lines = textBeforeCursor.split('\n');
          const line = lines.length;
          const col = lines[lines.length - 1].length + 1;

          statusText.textContent = `Ln ${line}, Col ${col}`;

          // Mark as modified
          if (!this.modified) {
            this.modified = true;
            const title = this.filename ? `*${this.filename} - gedit` : '*Untitled Document - gedit';
            this.windowInstance.setTitle(title);
          }
        };

        textarea.addEventListener('input', updateStatus);
        textarea.addEventListener('click', updateStatus);
        textarea.addEventListener('keyup', updateStatus);
      }

      // Toolbar buttons
      content.addEventListener('click', (e) => {
        const btn = e.target.closest('.gedit-btn');
        if (btn) {
          const action = btn.getAttribute('data-action');
          this.handleAction(action, textarea);
        }
      });
    }

    /**
     * Handle toolbar actions
     */
    handleAction(action, textarea) {
      switch (action) {
        case 'new':
          if (this.modified) {
            if (confirm('You have unsaved changes. Create a new document?')) {
              this.open();
            }
          } else {
            this.open();
          }
          break;
        case 'open':
          alert('Open file dialog would appear here');
          break;
        case 'save':
          this.save(textarea);
          break;
        case 'undo':
          document.execCommand('undo');
          break;
        case 'redo':
          document.execCommand('redo');
          break;
        case 'cut':
          document.execCommand('cut');
          break;
        case 'copy':
          document.execCommand('copy');
          break;
        case 'paste':
          document.execCommand('paste');
          break;
        case 'find':
          this.showFindDialog();
          break;
      }
    }

    /**
     * Save document
     */
    save(textarea) {
      this.content = textarea.value;
      this.modified = false;

      if (!this.filename) {
        this.filename = 'untitled.txt';
      }

      const title = `${this.filename} - gedit`;
      this.windowInstance.setTitle(title);

      // Show save notification
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(46, 52, 54, 0.95);
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        font-size: 10pt;
        z-index: 1000;
        pointer-events: none;
      `;
      notification.textContent = `Saved ${this.filename}`;

      this.windowInstance.contentArea.style.position = 'relative';
      this.windowInstance.contentArea.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 1500);
    }

    /**
     * Show find dialog
     */
    showFindDialog() {
      const findText = prompt('Find:');
      if (findText) {
        alert(`Find functionality would search for: "${findText}"`);
      }
    }
  }

  // Export to global scope
  global.UbuntuGedit = UbuntuGedit;

})(typeof window !== 'undefined' ? window : global);
