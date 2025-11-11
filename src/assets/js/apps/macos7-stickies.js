/**
 * Mac OS System 7 Stickies
 * Classic sticky notes application
 */

(function(global) {
  'use strict';

  /**
   * Mac OS 7 Stickies Application
   */
  class MacOS7Stickies {
    constructor(desktop) {
      this.desktop = desktop;
      this.windows = [];
      this.noteColors = ['#ffffcc', '#ccffcc', '#ccccff', '#ffccff', '#ffcccc'];
      this.nextColorIndex = 0;
    }

    /**
     * Open new sticky note
     */
    open() {
      const color = this.noteColors[this.nextColorIndex % this.noteColors.length];
      this.nextColorIndex++;

      const noteId = `sticky-note-${Date.now()}`;
      const content = this._buildContent(color);

      const window = this.desktop.createAppWindow({
        id: noteId,
        title: '',
        content: content,
        width: 200,
        height: 150,
        resizable: true,
        onClose: () => {
          const index = this.windows.indexOf(window);
          if (index > -1) {
            this.windows.splice(index, 1);
          }
          return true;
        }
      });

      this.windows.push(window);
      this._attachEventListeners(window, color);
    }

    /**
     * Build sticky note content
     * @param {string} color - Background color
     * @private
     */
    _buildContent(color) {
      return `
        <div class="stickies-note" style="background-color: ${color}; height: 100%; display: flex; flex-direction: column;">
          <div style="flex: 1; padding: 8px;">
            <textarea class="mac-textarea stickies-textarea"
                      style="width: 100%; height: 100%; background-color: ${color}; border: none; resize: none;"
                      placeholder="Type note here..."></textarea>
          </div>
        </div>
      `;
    }

    /**
     * Attach event listeners
     * @param {Window} window - Window instance
     * @param {string} color - Note color
     * @private
     */
    _attachEventListeners(window, color) {
      const textarea = window.element.querySelector('.stickies-textarea');

      if (textarea) {
        // Focus textarea when created
        setTimeout(() => textarea.focus(), 100);

        // Save content on change (in real app would persist)
        textarea.addEventListener('input', () => {
          // Could save to localStorage here
          console.log('Note content changed');
        });
      }
    }
  }

  // Export to global scope
  global.MacOS7Stickies = MacOS7Stickies;

})(typeof window !== 'undefined' ? window : global);
