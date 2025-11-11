/**
 * BeOS Tracker
 * The BeOS file manager with query support, multiple view modes, and navigator
 */

(function(global) {
  'use strict';

  /**
   * BeOS Tracker Application
   */
  class BeOSTracker {
    constructor(desktop, initialPath = '/home') {
      this.desktop = desktop;
      this.currentPath = initialPath;
      this.viewMode = 'icon'; // icon, list, mini
      this.window = null;
      this.windowId = null;
      this.selectedItems = new Set();

      // Mock file system
      this.fileSystem = this._createMockFileSystem();
    }

    /**
     * Launch Tracker
     */
    launch() {
      const content = this._createContent();

      this.windowId = `tracker-${Date.now()}`;
      this.window = this.desktop.windowSystem.createWindow({
        id: this.windowId,
        title: `Tracker - ${this._getPathName(this.currentPath)}`,
        width: 600,
        height: 400,
        content: content,
        resizable: true,
        menuItems: [
          { label: 'File', onClick: () => {} },
          { label: 'Edit', onClick: () => {} },
          { label: 'Window', onClick: () => {} },
          { label: 'Attributes', onClick: () => {} }
        ],
        onClose: () => this._cleanup()
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
     * Create Tracker content
     * @private
     */
    _createContent() {
      return `
        <div class="tracker-window" style="display: flex; flex-direction: column; height: 100%;">
          <!-- Toolbar -->
          <div class="beos-toolbar">
            <button class="beos-toolbar-button" data-action="back" title="Back">◀</button>
            <button class="beos-toolbar-button" data-action="forward" title="Forward">▶</button>
            <button class="beos-toolbar-button" data-action="up" title="Up">⬆</button>
            <div class="beos-toolbar-separator"></div>
            <button class="beos-toolbar-button" data-action="icon-view" title="Icon View">⊞</button>
            <button class="beos-toolbar-button" data-action="list-view" title="List View">☰</button>
            <button class="beos-toolbar-button" data-action="mini-view" title="Mini Icon View">⊟</button>
            <div class="beos-toolbar-separator"></div>
            <input type="text" class="beos-input" id="tracker-path" value="${this.currentPath}" style="flex: 1; margin: 0 4px;" readonly>
          </div>

          <!-- File List Area -->
          <div id="tracker-content" class="tracker-content" style="flex: 1; overflow: auto; padding: 8px;">
            <!-- Files will be rendered here -->
          </div>

          <!-- Status Bar -->
          <div class="beos-statusbar">
            <span id="tracker-status">0 items</span>
          </div>
        </div>
      `;
    }

    /**
     * Setup event handlers
     * @private
     */
    _setupEventHandlers() {
      // Toolbar buttons
      const toolbar = this.window.querySelector('.beos-toolbar');
      if (toolbar) {
        toolbar.addEventListener('click', (e) => {
          const button = e.target.closest('[data-action]');
          if (!button) return;

          const action = button.dataset.action;
          switch (action) {
            case 'back':
              this._navigateBack();
              break;
            case 'forward':
              this._navigateForward();
              break;
            case 'up':
              this._navigateUp();
              break;
            case 'icon-view':
              this._setViewMode('icon');
              break;
            case 'list-view':
              this._setViewMode('list');
              break;
            case 'mini-view':
              this._setViewMode('mini');
              break;
          }
        });
      }

      // Render initial content
      this._renderFiles();
    }

    /**
     * Render files in current directory
     * @private
     */
    _renderFiles() {
      const content = this.window.querySelector('#tracker-content');
      if (!content) return;

      const items = this._getItemsInPath(this.currentPath);

      if (this.viewMode === 'icon') {
        content.innerHTML = this._renderIconView(items);
      } else if (this.viewMode === 'list') {
        content.innerHTML = this._renderListView(items);
      } else {
        content.innerHTML = this._renderMiniView(items);
      }

      // Update status
      const status = this.window.querySelector('#tracker-status');
      if (status) {
        status.textContent = `${items.length} item${items.length !== 1 ? 's' : ''}`;
      }

      // Setup item click handlers
      this._setupItemHandlers();
    }

    /**
     * Render icon view
     * @private
     */
    _renderIconView(items) {
      return `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, 80px); gap: 16px;">
          ${items.map(item => `
            <div class="tracker-item" data-name="${item.name}" data-type="${item.type}" style="display: flex; flex-direction: column; align-items: center; cursor: pointer; padding: 8px;">
              <div style="font-size: 32px; margin-bottom: 4px;">${item.type === 'directory' ? '📁' : this._getFileIcon(item.name)}</div>
              <div style="font-size: 10px; text-align: center; word-wrap: break-word; max-width: 100%;">${item.name}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    /**
     * Render list view
     * @private
     */
    _renderListView(items) {
      return `
        <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
          <thead>
            <tr style="background: #DCDCDC; border-bottom: 1px solid #808080;">
              <th style="text-align: left; padding: 4px;">Name</th>
              <th style="text-align: right; padding: 4px; width: 80px;">Size</th>
              <th style="text-align: left; padding: 4px; width: 120px;">Modified</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr class="tracker-item" data-name="${item.name}" data-type="${item.type}" style="cursor: pointer; border-bottom: 1px solid #EEEEEE;">
                <td style="padding: 4px;">
                  <span style="margin-right: 6px;">${item.type === 'directory' ? '📁' : this._getFileIcon(item.name)}</span>
                  ${item.name}
                </td>
                <td style="text-align: right; padding: 4px;">${item.size || '-'}</td>
                <td style="padding: 4px;">${item.modified || 'Today'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    /**
     * Render mini icon view
     * @private
     */
    _renderMiniView(items) {
      return `
        <div style="display: flex; flex-direction: column; gap: 2px;">
          ${items.map(item => `
            <div class="tracker-item" data-name="${item.name}" data-type="${item.type}" style="display: flex; align-items: center; padding: 4px; cursor: pointer; font-size: 10px;">
              <span style="margin-right: 6px;">${item.type === 'directory' ? '📁' : this._getFileIcon(item.name)}</span>
              ${item.name}
            </div>
          `).join('')}
        </div>
      `;
    }

    /**
     * Setup item click handlers
     * @private
     */
    _setupItemHandlers() {
      const items = this.window.querySelectorAll('.tracker-item');

      items.forEach(item => {
        let clickCount = 0;
        let clickTimer = null;

        item.addEventListener('click', (e) => {
          clickCount++;
          if (clickCount === 1) {
            // Single click - select
            clickTimer = setTimeout(() => {
              clickCount = 0;
              this._selectItem(item);
            }, 300);
          } else if (clickCount === 2) {
            // Double click - open
            clearTimeout(clickTimer);
            clickCount = 0;
            this._openItem(item);
          }
        });

        item.addEventListener('mouseenter', () => {
          if (this.viewMode === 'list') {
            item.style.background = '#4682B4';
            item.style.color = '#FFFFFF';
          }
        });

        item.addEventListener('mouseleave', () => {
          if (this.viewMode === 'list' && !item.classList.contains('selected')) {
            item.style.background = '';
            item.style.color = '';
          }
        });
      });
    }

    /**
     * Select item
     * @private
     */
    _selectItem(item) {
      // Clear previous selection
      this.window.querySelectorAll('.tracker-item').forEach(i => {
        i.classList.remove('selected');
        i.style.background = '';
        i.style.color = '';
      });

      // Select this item
      item.classList.add('selected');
      item.style.background = '#4682B4';
      item.style.color = '#FFFFFF';
    }

    /**
     * Open item
     * @private
     */
    _openItem(item) {
      const name = item.dataset.name;
      const type = item.dataset.type;

      if (type === 'directory') {
        this._navigate(this.currentPath === '/' ? `/${name}` : `${this.currentPath}/${name}`);
      } else {
        console.log(`Opening file: ${name}`);
        // Could open file in appropriate application
      }
    }

    /**
     * Navigate to path
     * @private
     */
    _navigate(path) {
      this.currentPath = path;
      this._updateTitle();
      this._renderFiles();

      const pathInput = this.window.querySelector('#tracker-path');
      if (pathInput) {
        pathInput.value = path;
      }
    }

    /**
     * Navigate up
     * @private
     */
    _navigateUp() {
      if (this.currentPath === '/') return;

      const parts = this.currentPath.split('/').filter(p => p);
      parts.pop();
      const newPath = '/' + parts.join('/');
      this._navigate(newPath || '/');
    }

    /**
     * Navigate back
     * @private
     */
    _navigateBack() {
      console.log('Navigate back (history not implemented)');
    }

    /**
     * Navigate forward
     * @private
     */
    _navigateForward() {
      console.log('Navigate forward (history not implemented)');
    }

    /**
     * Set view mode
     * @private
     */
    _setViewMode(mode) {
      this.viewMode = mode;
      this._renderFiles();
    }

    /**
     * Update window title
     * @private
     */
    _updateTitle() {
      const titleEl = this.window.querySelector('.beos-window-tab-title');
      if (titleEl) {
        titleEl.textContent = `Tracker - ${this._getPathName(this.currentPath)}`;
      }
    }

    /**
     * Get path name
     * @private
     */
    _getPathName(path) {
      if (path === '/') return 'Root';
      const parts = path.split('/').filter(p => p);
      return parts[parts.length - 1] || 'Root';
    }

    /**
     * Get file icon
     * @private
     */
    _getFileIcon(filename) {
      if (filename.endsWith('.txt')) return '📄';
      if (filename.endsWith('.mp3') || filename.endsWith('.wav')) return '🎵';
      if (filename.endsWith('.jpg') || filename.endsWith('.png')) return '🖼️';
      if (filename.endsWith('.zip')) return '📦';
      return '📄';
    }

    /**
     * Create mock file system
     * @private
     */
    _createMockFileSystem() {
      return {
        '/': [
          { name: 'home', type: 'directory' },
          { name: 'boot', type: 'directory' },
          { name: 'trash', type: 'directory' }
        ],
        '/home': [
          { name: 'Documents', type: 'directory' },
          { name: 'Music', type: 'directory' },
          { name: 'Pictures', type: 'directory' },
          { name: 'Desktop', type: 'directory' },
          { name: 'readme.txt', type: 'file', size: '1.2 KB', modified: 'Today 10:30 AM' }
        ],
        '/home/Documents': [
          { name: 'Notes.txt', type: 'file', size: '3.4 KB', modified: 'Yesterday' },
          { name: 'Report.txt', type: 'file', size: '12 KB', modified: 'Mar 15' }
        ],
        '/home/Music': [
          { name: 'song1.mp3', type: 'file', size: '3.5 MB', modified: 'Mar 10' },
          { name: 'song2.mp3', type: 'file', size: '4.2 MB', modified: 'Mar 10' }
        ],
        '/boot': [
          { name: 'beos', type: 'directory' },
          { name: 'apps', type: 'directory' },
          { name: 'preferences', type: 'directory' }
        ],
        '/trash': []
      };
    }

    /**
     * Get items in path
     * @private
     */
    _getItemsInPath(path) {
      return this.fileSystem[path] || [];
    }

    /**
     * Cleanup
     * @private
     */
    _cleanup() {
      if (this.desktop.workspaceSwitcher) {
        this.desktop.workspaceSwitcher.removeWindowFromWorkspace(this.windowId);
      }
    }
  }

  // Export to global scope
  global.BeOSTracker = BeOSTracker;

})(window);
