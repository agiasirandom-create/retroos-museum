/**
 * Windows 3.1 Write
 * Basic word processor
 */

(function(global) {
  'use strict';

  class Win31Write {
    constructor(desktop) {
      this.desktop = desktop;
      this.window = null;
      this.filename = 'Untitled';
    }

    /**
     * Open Write
     */
    open() {
      const content = this.buildContent();

      this.window = this.desktop.windowManager.createWindow({
        id: 'write-' + Date.now(),
        title: this.filename + ' - Write',
        content: content,
        width: 600,
        height: 450,
        onClose: () => {
          this.window = null;
        }
      });
    }

    /**
     * Build Write content
     */
    buildContent() {
      return `
        <div class="window-menubar">
          <div class="menu-item" data-menu="file">File</div>
          <div class="menu-item" data-menu="edit">Edit</div>
          <div class="menu-item" data-menu="find">Find</div>
          <div class="menu-item" data-menu="character">Character</div>
          <div class="menu-item" data-menu="paragraph">Paragraph</div>
          <div class="menu-item" data-menu="document">Document</div>
          <div class="menu-item" data-menu="help">Help</div>
        </div>

        <div class="window-toolbar">
          <button class="toolbar-button" title="New">=Ä</button>
          <button class="toolbar-button" title="Open">=Á</button>
          <button class="toolbar-button" title="Save">=¾</button>
          <button class="toolbar-button" title="Print">=¨</button>
          <div class="toolbar-separator"></div>
          <button class="toolbar-button" title="Bold"><b>B</b></button>
          <button class="toolbar-button" title="Italic"><i>I</i></button>
          <button class="toolbar-button" title="Underline"><u>U</u></button>
          <div class="toolbar-separator"></div>
          <button class="toolbar-button" title="Left Align">ç</button>
          <button class="toolbar-button" title="Center">¬</button>
          <button class="toolbar-button" title="Right Align">è</button>
        </div>

        <div class="window-content" style="padding: 8px; background: white; overflow: auto;">
          <div contenteditable="true" style="outline: none; min-height: 100%; font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5;">
            <p>Type your document here...</p>
          </div>
        </div>

        <div class="window-statusbar">
          <div class="statusbar-section">Page 1</div>
          <div class="statusbar-section flex">Microsoft Write</div>
        </div>
      `;
    }
  }

  // Export to global scope
  global.Win31Write = Win31Write;

})(typeof window !== 'undefined' ? window : global);
