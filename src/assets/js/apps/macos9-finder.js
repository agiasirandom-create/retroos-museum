/**
 * Mac OS 9 Finder
 * Spatial file browser with icon/list/button views
 */

(function(global) {
  'use strict';

  class MacOS9Finder {
    constructor(desktop) {
      this.desktop = desktop;
      this.currentView = 'icon';
      this.files = this._generateSampleFiles();
    }

    open() {
      const content = this._buildFinderContent();
      
      this.window = this.desktop.createAppWindow({
        id: 'finder-macintosh-hd',
        title: 'Macintosh HD',
        content: content,
        width: 640,
        height: 480,
        resizable: true
      });

      this._attachListeners();
    }

    /**
     * Escape HTML special characters to prevent XSS
     * @param {string} str - String to escape
     * @returns {string} Escaped string
     */
    _escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    _generateSampleFiles() {
      return [
        { name: 'Applications', type: 'folder', size: '1.2 GB', modified: 'Nov 11, 2025, 10:30 AM', icon: '\uD83D\uDCC1' },
        { name: 'System Folder', type: 'folder', size: '450 MB', modified: 'Nov 11, 2025, 9:00 AM', icon: '\uD83D\uDCC1' },
        { name: 'Documents', type: 'folder', size: '2.4 GB', modified: 'Nov 11, 2025, 11:15 AM', icon: '\uD83D\uDCC1' },
        { name: 'Desktop', type: 'folder', size: '128 MB', modified: 'Nov 11, 2025, 12:00 PM', icon: '\uD83D\uDCC1' },
        { name: 'ReadMe.txt', type: 'text', size: '4 KB', modified: 'Nov 10, 2025, 3:45 PM', icon: '\uD83D\uDCC4' },
        { name: 'Utilities', type: 'folder', size: '320 MB', modified: 'Nov 9, 2025, 2:20 PM', icon: '\uD83D\uDCC1' },
        { name: 'Internet', type: 'folder', size: '180 MB', modified: 'Nov 8, 2025, 4:10 PM', icon: '\uD83D\uDCC1' }
      ];
    }

    _buildFinderContent() {
      return '<div class="finder-container"><div class="finder-toolbar" style="padding: 8px; background: linear-gradient(to bottom, #EEEEEE, #DDDDDD); border-bottom: 1px solid #555;"><button class="mac9-button" data-view="icon">Icons</button> <button class="mac9-button" data-view="button">Buttons</button> <button class="mac9-button" data-view="list">List</button></div><div class="finder-view-container" id="finder-view">' + this._renderIconView() + '</div></div>';
    }

    _renderIconView() {
      let html = '<div class="icon-view">';
      this.files.forEach(file => {
        html += '<div class="icon-view-item" data-file="' + this._escapeHtml(file.name) + '"><div style="font-size: 32px;">' + file.icon + '</div><span>' + this._escapeHtml(file.name) + '</span></div>';
      });
      html += '</div>';
      return html;
    }

    _renderListView() {
      let html = '<div class="list-view"><table><thead><tr><th>Name</th><th>Size</th><th>Modified</th><th>Kind</th></tr></thead><tbody>';
      this.files.forEach(file => {
        html += '<tr class="list-item" data-file="' + this._escapeHtml(file.name) + '"><td>' + file.icon + ' ' + this._escapeHtml(file.name) + '</td><td>' + this._escapeHtml(file.size) + '</td><td>' + this._escapeHtml(file.modified) + '</td><td>' + (file.type === 'folder' ? 'Folder' : 'Document') + '</td></tr>';
      });
      html += '</tbody></table></div>';
      return html;
    }

    _renderButtonView() {
      let html = '<div style="padding: 12px;">';
      this.files.forEach(file => {
        html += '<button class="mac9-button" style="margin: 4px; padding: 8px 16px;" data-file="' + this._escapeHtml(file.name) + '">' + file.icon + ' ' + this._escapeHtml(file.name) + '</button>';
      });
      html += '</div>';
      return html;
    }

    _attachListeners() {
      if (!this.window || !this.window.element) return;

      const toolbar = this.window.element.querySelector('.finder-toolbar');
      if (toolbar) {
        toolbar.addEventListener('click', (e) => {
          if (e.target.classList.contains('mac9-button')) {
            const view = e.target.getAttribute('data-view');
            if (view) {
              this._switchView(view);
            }
          }
        });
      }

      const viewContainer = this.window.element.querySelector('#finder-view');
      if (viewContainer) {
        viewContainer.addEventListener('dblclick', (e) => {
          const item = e.target.closest('[data-file]');
          if (item) {
            const filename = item.getAttribute('data-file');
            this._openFile(filename);
          }
        });

        viewContainer.addEventListener('click', (e) => {
          const item = e.target.closest('[data-file]');
          if (item) {
            const items = viewContainer.querySelectorAll('[data-file]');
            items.forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
          }
        });
      }
    }

    _switchView(view) {
      this.currentView = view;
      const viewContainer = this.window.element.querySelector('#finder-view');
      if (viewContainer) {
        if (view === 'icon') {
          viewContainer.innerHTML = this._renderIconView();
        } else if (view === 'list') {
          viewContainer.innerHTML = this._renderListView();
        } else if (view === 'button') {
          viewContainer.innerHTML = this._renderButtonView();
        }
        this._attachListeners();
      }
    }

    _openFile(filename) {
      const file = this.files.find(f => f.name === filename);
      if (file) {
        if (file.type === 'folder') {
          this.desktop._showAlert('Opening folder: ' + filename + ' (demo)');
        } else {
          this.desktop._showAlert('Opening file: ' + filename + ' (demo)');
        }
      }
    }
  }

  global.MacOS9Finder = MacOS9Finder;

})(typeof window !== 'undefined' ? window : global);
