/**
 * Mac OS System 7 Finder
 * File browser and desktop manager
 */

(function(global) {
  'use strict';

  /**
   * Mac OS 7 Finder Application
   */
  class MacOS7Finder {
    constructor(desktop) {
      this.desktop = desktop;
      this.currentView = 'icon';
      this.currentFolder = 'Macintosh HD';
      this.selectedItems = [];
      this.window = null;
    }

    /**
     * Open Finder window
     */
    open() {
      if (this.window) {
        this.window.focus();
        return;
      }

      const content = this._buildContent();

      this.window = this.desktop.createAppWindow({
        id: 'finder-macintosh-hd',
        title: 'Macintosh HD',
        content: content,
        width: 512,
        height: 342,
        resizable: true,
        onClose: () => {
          this.window = null;
          return true;
        }
      });

      this._attachEventListeners();
    }

    /**
     * Build Finder window content
     * @private
     */
    _buildContent() {
      if (this.currentView === 'icon') {
        return this._buildIconView();
      } else {
        return this._buildListView();
      }
    }

    /**
     * Build icon view
     * @private
     */
    _buildIconView() {
      const items = this._getFolderContents();

      let html = '<div class="icon-view">';

      items.forEach(item => {
        html += `
          <div class="icon-view-item" data-item="${item.name}">
            ${this._getItemIcon(item.type)}
            <span>${item.name}</span>
          </div>
        `;
      });

      html += '</div>';

      return html;
    }

    /**
     * Build list view
     * @private
     */
    _buildListView() {
      const items = this._getFolderContents();

      let html = `
        <div class="list-view">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Size</th>
                <th>Kind</th>
                <th>Date Modified</th>
              </tr>
            </thead>
            <tbody>
      `;

      items.forEach(item => {
        html += `
          <tr data-item="${item.name}">
            <td>${item.name}</td>
            <td>${item.size}</td>
            <td>${item.kind}</td>
            <td>${item.date}</td>
          </tr>
        `;
      });

      html += `
            </tbody>
          </table>
        </div>
      `;

      return html;
    }

    /**
     * Get folder contents (mock data)
     * @private
     */
    _getFolderContents() {
      return [
        { name: 'System Folder', type: 'system-folder', size: '--', kind: 'System Folder', date: 'Today, 9:00 AM' },
        { name: 'Applications', type: 'folder', size: '--', kind: 'Folder', date: 'Today, 9:00 AM' },
        { name: 'Documents', type: 'folder', size: '--', kind: 'Folder', date: 'Today, 10:30 AM' },
        { name: 'Read Me', type: 'document', size: '4 KB', kind: 'Document', date: 'Yesterday, 2:15 PM' },
        { name: 'SimpleText', type: 'app', size: '128 KB', kind: 'Application', date: 'Nov 8, 1996' },
        { name: 'Stickies', type: 'app', size: '64 KB', kind: 'Application', date: 'Nov 8, 1996' },
        { name: 'Scrapbook', type: 'app', size: '96 KB', kind: 'Application', date: 'Nov 8, 1996' },
        { name: 'Puzzle', type: 'app', size: '32 KB', kind: 'Application', date: 'Nov 8, 1996' }
      ];
    }

    /**
     * Get item icon SVG
     * @param {string} type - Item type
     * @private
     */
    _getItemIcon(type) {
      const icons = {
        'system-folder': `
          <svg width="32" height="32" viewBox="0 0 32 32">
            <path d="M4 8 L4 26 L28 26 L28 12 L16 12 L14 8 Z" fill="#cccccc" stroke="#000" stroke-width="1.5"/>
            <rect x="8" y="14" width="16" height="8" fill="#ffffff" stroke="#000" stroke-width="1"/>
            <line x1="10" y1="16" x2="22" y2="16" stroke="#000"/>
            <line x1="10" y1="18" x2="22" y2="18" stroke="#000"/>
            <line x1="10" y1="20" x2="22" y2="20" stroke="#000"/>
          </svg>
        `,
        'folder': `
          <svg width="32" height="32" viewBox="0 0 32 32">
            <path d="M4 8 L4 26 L28 26 L28 12 L16 12 L14 8 Z" fill="#cccccc" stroke="#000" stroke-width="1.5"/>
          </svg>
        `,
        'document': `
          <svg width="32" height="32" viewBox="0 0 32 32">
            <path d="M8 4 L8 28 L24 28 L24 10 L18 4 Z" fill="#ffffff" stroke="#000" stroke-width="1.5"/>
            <path d="M18 4 L18 10 L24 10" fill="#cccccc" stroke="#000" stroke-width="1.5"/>
            <line x1="12" y1="14" x2="20" y2="14" stroke="#000"/>
            <line x1="12" y1="17" x2="20" y2="17" stroke="#000"/>
            <line x1="12" y1="20" x2="20" y2="20" stroke="#000"/>
          </svg>
        `,
        'app': `
          <svg width="32" height="32" viewBox="0 0 32 32">
            <rect x="6" y="6" width="20" height="20" fill="#ffffff" stroke="#000" stroke-width="1.5"/>
            <path d="M10 10 L16 22 L22 10" fill="none" stroke="#0000cc" stroke-width="2"/>
          </svg>
        `
      };

      return icons[type] || icons['document'];
    }

    /**
     * Attach event listeners
     * @private
     */
    _attachEventListeners() {
      if (!this.window) return;

      const contentArea = this.window.element.querySelector('.window-content');
      if (!contentArea) return;

      // Single click to select
      contentArea.addEventListener('click', (e) => {
        const item = e.target.closest('[data-item]');
        if (item) {
          this._selectItem(item, e.metaKey || e.ctrlKey);
        } else {
          this._clearSelection();
        }
      });

      // Double click to open
      let lastClickTime = 0;
      let lastClickedItem = null;

      contentArea.addEventListener('click', (e) => {
        const item = e.target.closest('[data-item]');
        if (!item) return;

        const now = Date.now();
        if (item === lastClickedItem && now - lastClickTime < 300) {
          this._openItem(item.dataset.item);
        }

        lastClickedItem = item;
        lastClickTime = now;
      });

      // Listen for menu actions
      document.addEventListener('macos7:menuaction', (e) => {
        if (this.window && this.window === this.desktop.windowManager.activeWindow) {
          this._handleMenuAction(e.detail.action);
        }
      });
    }

    /**
     * Select item
     * @param {HTMLElement} item - Item element
     * @param {boolean} addToSelection - Add to current selection
     * @private
     */
    _selectItem(item, addToSelection = false) {
      if (!addToSelection) {
        this._clearSelection();
      }

      item.classList.toggle('selected');

      const itemName = item.dataset.item;
      const index = this.selectedItems.indexOf(itemName);

      if (item.classList.contains('selected')) {
        if (index === -1) {
          this.selectedItems.push(itemName);
        }
      } else {
        if (index > -1) {
          this.selectedItems.splice(index, 1);
        }
      }
    }

    /**
     * Clear selection
     * @private
     */
    _clearSelection() {
      if (!this.window) return;

      const contentArea = this.window.element.querySelector('.window-content');
      if (!contentArea) return;

      const selectedItems = contentArea.querySelectorAll('.selected');
      selectedItems.forEach(item => item.classList.remove('selected'));

      this.selectedItems = [];
    }

    /**
     * Open item
     * @param {string} itemName - Item name
     * @private
     */
    _openItem(itemName) {
      console.log('Opening item:', itemName);

      // Open applications
      switch(itemName) {
        case 'SimpleText':
          if (typeof MacOS7SimpleText !== 'undefined') {
            const simpleText = new MacOS7SimpleText(this.desktop);
            simpleText.open();
          }
          break;
        case 'Stickies':
          if (typeof MacOS7Stickies !== 'undefined') {
            const stickies = new MacOS7Stickies(this.desktop);
            stickies.open();
          }
          break;
        case 'Scrapbook':
          if (typeof MacOS7Scrapbook !== 'undefined') {
            const scrapbook = new MacOS7Scrapbook(this.desktop);
            scrapbook.open();
          }
          break;
        case 'Puzzle':
          if (typeof MacOS7Puzzle !== 'undefined') {
            const puzzle = new MacOS7Puzzle(this.desktop);
            puzzle.open();
          }
          break;
        case 'Applications':
        case 'System Folder':
        case 'Documents':
          // Open subfolder (would create new Finder window in real Mac OS)
          alert(`Opening folder: ${itemName} (demo)`);
          break;
        default:
          alert(`Opening: ${itemName} (demo)`);
      }
    }

    /**
     * Handle menu action
     * @param {string} action - Action name
     * @private
     */
    _handleMenuAction(action) {
      switch (action) {
        case 'viewByIcon':
          this.currentView = 'icon';
          this._refreshView();
          break;

        case 'viewByName':
        case 'viewByDate':
        case 'viewBySize':
        case 'viewByKind':
          this.currentView = 'list';
          this._refreshView();
          break;

        case 'selectAll':
          this._selectAll();
          break;

        case 'newFolder':
          alert('New folder created: "untitled folder" (demo)');
          break;

        case 'getInfo':
          if (this.selectedItems.length > 0) {
            alert(`Get Info for: ${this.selectedItems[0]} (demo)`);
          }
          break;
      }
    }

    /**
     * Select all items
     * @private
     */
    _selectAll() {
      if (!this.window) return;

      const contentArea = this.window.element.querySelector('.window-content');
      if (!contentArea) return;

      const items = contentArea.querySelectorAll('[data-item]');
      this.selectedItems = [];

      items.forEach(item => {
        item.classList.add('selected');
        this.selectedItems.push(item.dataset.item);
      });
    }

    /**
     * Refresh view
     * @private
     */
    _refreshView() {
      if (!this.window) return;

      const newContent = this._buildContent();
      this.window.setContent(newContent);
      this._attachEventListeners();
    }
  }

  // Export to global scope
  global.MacOS7Finder = MacOS7Finder;

})(typeof window !== 'undefined' ? window : global);
