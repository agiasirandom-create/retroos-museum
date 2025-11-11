/**
 * Mac OS 9 SimpleText
 * Basic text editor
 */

(function(global) {
  'use strict';

  class MacOS9SimpleText {
    constructor(desktop) {
      this.desktop = desktop;
      this.content = '';
    }

    open(filename = 'Untitled') {
      const content = '<div style="height: 100%; display: flex; flex-direction: column;"><div style="flex: 1; padding: 0;"><textarea class="mac9-textarea" placeholder="Type your text here..." style="border: none;">' + this.content + '</textarea></div></div>';

      this.window = this.desktop.createAppWindow({
        id: 'simpletext-' + Date.now(),
        title: filename,
        content: content,
        width: 500,
        height: 400,
        resizable: true
      });

      this._attachListeners();
    }

    _attachListeners() {
      if (!this.window || !this.window.element) return;

      const textarea = this.window.element.querySelector('.mac9-textarea');
      if (textarea) {
        textarea.addEventListener('input', (e) => {
          this.content = e.target.value;
        });
      }
    }
  }

  global.MacOS9SimpleText = MacOS9SimpleText;

})(typeof window !== 'undefined' ? window : global);
