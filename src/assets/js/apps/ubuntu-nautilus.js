/**
 * Ubuntu Nautilus File Manager
 * GNOME 2 spatial file browser with sidebar
 */

(function(global) {
  'use strict';

  class UbuntuNautilus {
    constructor(windowManager) {
      this.windowManager = windowManager;
      this.currentPath = '/home/user';
      this.viewMode = 'icon'; // 'icon' or 'list'
      this.windowInstance = null;

      // Virtual filesystem
      this.filesystem = this.createFilesystem();
    }

    /**
     * Create virtual filesystem
     */
    createFilesystem() {
      return {
        '/': {
          type: 'directory',
          name: 'Computer',
          children: ['bin', 'boot', 'etc', 'home', 'usr', 'var']
        },
        '/home': {
          type: 'directory',
          name: 'home',
          children: ['user']
        },
        '/home/user': {
          type: 'directory',
          name: 'user',
          children: ['Desktop', 'Documents', 'Downloads', 'Music', 'Pictures', 'Videos']
        },
        '/home/user/Desktop': {
          type: 'directory',
          name: 'Desktop',
          children: ['readme.txt']
        },
        '/home/user/Documents': {
          type: 'directory',
          name: 'Documents',
          children: ['welcome.odt', 'notes.txt']
        },
        '/home/user/Downloads': {
          type: 'directory',
          name: 'Downloads',
          children: []
        },
        '/home/user/Music': {
          type: 'directory',
          name: 'Music',
          children: []
        },
        '/home/user/Pictures': {
          type: 'directory',
          name: 'Pictures',
          children: []
        },
        '/home/user/Videos': {
          type: 'directory',
          name: 'Videos',
          children: []
        },
        '/home/user/.Trash': {
          type: 'directory',
          name: 'Trash',
          children: []
        },
        '/home/user/Desktop/readme.txt': {
          type: 'file',
          name: 'readme.txt',
          size: 1024,
          modified: '2004-10-20'
        },
        '/home/user/Documents/welcome.odt': {
          type: 'file',
          name: 'welcome.odt',
          size: 8192,
          modified: '2004-10-20'
        },
        '/home/user/Documents/notes.txt': {
          type: 'file',
          name: 'notes.txt',
          size: 512,
          modified: '2004-10-20'
        }
      };
    }

    /**
     * Open Nautilus window
     */
    open(path = '/home/user') {
      this.currentPath = path;
      const dirInfo = this.filesystem[path];
      const dirName = dirInfo ? dirInfo.name : 'File Browser';

      this.windowInstance = this.windowManager.createWindow({
        id: `nautilus-${Date.now()}`,
        title: `${dirName} - File Browser`,
        width: 680,
        height: 480,
        x: 100 + Math.random() * 100,
        y: 80 + Math.random() * 80,
        resizable: true,
        content: this.renderContent()
      });

      this.attachEventListeners();
    }

    /**
     * Render Nautilus content
     */
    renderContent() {
      return `
        <div class="nautilus-container">
          <!-- Toolbar -->
          <div class="nautilus-toolbar">
            <button class="nautilus-btn" data-action="back" title="Back">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M10 12L6 8l4-4"/>
              </svg>
            </button>
            <button class="nautilus-btn" data-action="forward" title="Forward">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6 12l4-4-4-4"/>
              </svg>
            </button>
            <button class="nautilus-btn" data-action="up" title="Up">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 12V4m-4 4l4-4 4 4"/>
              </svg>
            </button>
            <div class="nautilus-separator"></div>
            <button class="nautilus-btn" data-action="home" title="Home">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 2L2 7v7h4v-4h4v4h4V7L8 2z"/>
              </svg>
            </button>
            <div class="nautilus-separator"></div>
            <div class="nautilus-location">
              <input type="text" class="nautilus-location-input" value="${this.currentPath}" readonly>
            </div>
            <div class="nautilus-separator"></div>
            <button class="nautilus-btn ${this.viewMode === 'icon' ? 'active' : ''}" data-action="icon-view" title="Icon View">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2" y="2" width="5" height="5"/>
                <rect x="9" y="2" width="5" height="5"/>
                <rect x="2" y="9" width="5" height="5"/>
                <rect x="9" y="9" width="5" height="5"/>
              </svg>
            </button>
            <button class="nautilus-btn ${this.viewMode === 'list' ? 'active' : ''}" data-action="list-view" title="List View">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2" y="3" width="12" height="2"/>
                <rect x="2" y="7" width="12" height="2"/>
                <rect x="2" y="11" width="12" height="2"/>
              </svg>
            </button>
          </div>

          <!-- Main Content -->
          <div class="nautilus-main">
            <!-- Sidebar -->
            <div class="nautilus-sidebar">
              <div class="nautilus-sidebar-section">
                <div class="nautilus-sidebar-title">Places</div>
                <button class="nautilus-sidebar-item" data-path="/home/user">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="#F07746">
                    <path d="M8 2L2 7v7h4v-4h4v4h4V7L8 2z"/>
                  </svg>
                  <span>Home</span>
                </button>
                <button class="nautilus-sidebar-item" data-path="/home/user/Desktop">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="#4A90E2">
                    <rect x="2" y="2" width="12" height="9" rx="1"/>
                  </svg>
                  <span>Desktop</span>
                </button>
                <button class="nautilus-sidebar-item" data-path="/home/user/Documents">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="#F07746">
                    <path d="M4 2h6l3 3v9H4V2z"/>
                    <path d="M10 2v3h3"/>
                  </svg>
                  <span>Documents</span>
                </button>
                <button class="nautilus-sidebar-item" data-path="/home/user/Music">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="#CE5C00">
                    <path d="M12 2v8c-.5-.3-1-.5-1.5-.5-1.4 0-2.5 1.1-2.5 2.5S9.1 14.5 10.5 14.5s2.5-1.1 2.5-2.5V5l-7 2v5.5c-.5-.3-1-.5-1.5-.5C3.1 12 2 13.1 2 14.5S3.1 17 4.5 17 7 15.9 7 14.5V7l5-1.5z"/>
                  </svg>
                  <span>Music</span>
                </button>
                <button class="nautilus-sidebar-item" data-path="/home/user/Pictures">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="#DD4814">
                    <rect x="2" y="3" width="12" height="10" rx="1"/>
                    <circle cx="6" cy="6" r="1.5"/>
                    <path d="M3 11l2.5-3 2 2.5 2-3 3.5 4"/>
                  </svg>
                  <span>Pictures</span>
                </button>
                <button class="nautilus-sidebar-item" data-path="/home/user/Videos">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="#8B4513">
                    <rect x="2" y="4" width="10" height="8" rx="1"/>
                    <path d="M12 6l3-2v8l-3-2"/>
                  </svg>
                  <span>Videos</span>
                </button>
                <button class="nautilus-sidebar-item" data-path="/home/user/Downloads">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="#5E2750">
                    <path d="M8 2v8m-3-3l3 3 3-3"/>
                    <path d="M3 12v2h10v-2"/>
                  </svg>
                  <span>Downloads</span>
                </button>
              </div>
              <div class="nautilus-sidebar-section">
                <div class="nautilus-sidebar-title">Devices</div>
                <button class="nautilus-sidebar-item" data-path="/">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="#808080">
                    <rect x="3" y="5" width="10" height="7" rx="1"/>
                    <rect x="4" y="6" width="8" height="5" fill="#4A90E2"/>
                  </svg>
                  <span>Computer</span>
                </button>
                <button class="nautilus-sidebar-item" data-path="/home/user/.Trash">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="#808080">
                    <path d="M5 3h6v1H5V3z"/>
                    <path d="M4 4h8l-.5 9H4.5L4 4z"/>
                  </svg>
                  <span>Trash</span>
                </button>
              </div>
            </div>

            <!-- Content Area -->
            <div class="nautilus-content">
              ${this.renderFileView()}
            </div>
          </div>

          <!-- Statusbar -->
          <div class="nautilus-statusbar">
            <span class="nautilus-status-text">${this.getStatusText()}</span>
          </div>
        </div>

        <style>
          .nautilus-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: white;
          }

          .nautilus-toolbar {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 4px 6px;
            background: #E9E7E3;
            border-bottom: 1px solid #9B9388;
          }

          .nautilus-btn {
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

          .nautilus-btn:hover {
            background: rgba(255, 255, 255, 0.5);
            border-color: #9B9388;
          }

          .nautilus-btn:active,
          .nautilus-btn.active {
            background: rgba(240, 119, 70, 0.2);
            border-color: #F07746;
          }

          .nautilus-separator {
            width: 1px;
            height: 24px;
            background: #9B9388;
            margin: 0 4px;
          }

          .nautilus-location {
            flex: 1;
            margin: 0 8px;
          }

          .nautilus-location-input {
            width: 100%;
            padding: 4px 8px;
            background: white;
            border: 1px solid #9B9388;
            border-radius: 2px;
            font-family: 'Ubuntu Sans', sans-serif;
            font-size: 9pt;
          }

          .nautilus-main {
            flex: 1;
            display: flex;
            overflow: hidden;
          }

          .nautilus-sidebar {
            width: 180px;
            background: #E9E7E3;
            border-right: 1px solid #9B9388;
            overflow-y: auto;
            padding: 8px 0;
          }

          .nautilus-sidebar-section {
            margin-bottom: 16px;
          }

          .nautilus-sidebar-title {
            padding: 4px 12px;
            font-size: 9pt;
            font-weight: 600;
            color: #666;
            text-transform: uppercase;
          }

          .nautilus-sidebar-item {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            background: transparent;
            border: none;
            text-align: left;
            cursor: pointer;
            font-family: 'Ubuntu Sans', sans-serif;
            font-size: 10pt;
            color: #2C2C2C;
            transition: background-color 0.1s ease;
          }

          .nautilus-sidebar-item:hover {
            background: rgba(240, 119, 70, 0.15);
          }

          .nautilus-sidebar-item svg {
            flex-shrink: 0;
          }

          .nautilus-content {
            flex: 1;
            overflow: auto;
            padding: 12px;
            background: white;
          }

          .nautilus-icon-view {
            display: grid;
            grid-template-columns: repeat(auto-fill, 96px);
            gap: 16px;
            padding: 8px;
          }

          .nautilus-icon-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 8px;
            border-radius: 3px;
            cursor: pointer;
            transition: background-color 0.1s ease;
          }

          .nautilus-icon-item:hover {
            background: rgba(240, 119, 70, 0.1);
          }

          .nautilus-icon-item svg {
            margin-bottom: 6px;
          }

          .nautilus-icon-label {
            text-align: center;
            font-size: 9pt;
            line-height: 1.2;
            word-wrap: break-word;
            max-width: 100%;
          }

          .nautilus-list-view {
            display: table;
            width: 100%;
            border-collapse: collapse;
          }

          .nautilus-list-header {
            display: table-row;
            background: #E9E7E3;
            font-weight: 600;
            font-size: 9pt;
            border-bottom: 1px solid #9B9388;
          }

          .nautilus-list-header-cell {
            display: table-cell;
            padding: 6px 12px;
            border-bottom: 1px solid #9B9388;
          }

          .nautilus-list-item {
            display: table-row;
            cursor: pointer;
          }

          .nautilus-list-item:hover {
            background: rgba(240, 119, 70, 0.1);
          }

          .nautilus-list-cell {
            display: table-cell;
            padding: 6px 12px;
            border-bottom: 1px solid #E9E7E3;
            font-size: 10pt;
          }

          .nautilus-list-cell svg {
            vertical-align: middle;
            margin-right: 6px;
          }

          .nautilus-statusbar {
            padding: 4px 12px;
            background: #E9E7E3;
            border-top: 1px solid #9B9388;
            font-size: 9pt;
            color: #666;
          }
        </style>
      `;
    }

    /**
     * Render file view (icon or list)
     */
    renderFileView() {
      const dirInfo = this.filesystem[this.currentPath];
      if (!dirInfo || dirInfo.type !== 'directory') {
        return '<div>Invalid directory</div>';
      }

      const items = dirInfo.children.map(childName => {
        const childPath = `${this.currentPath}/${childName}`.replace('//', '/');
        return this.filesystem[childPath] || { name: childName, type: 'unknown' };
      });

      if (this.viewMode === 'icon') {
        return `
          <div class="nautilus-icon-view">
            ${items.map(item => this.renderIconItem(item)).join('')}
          </div>
        `;
      } else {
        return `
          <div class="nautilus-list-view">
            <div class="nautilus-list-header">
              <div class="nautilus-list-header-cell">Name</div>
              <div class="nautilus-list-header-cell">Size</div>
              <div class="nautilus-list-header-cell">Modified</div>
            </div>
            ${items.map(item => this.renderListItem(item)).join('')}
          </div>
        `;
      }
    }

    /**
     * Render icon item
     */
    renderIconItem(item) {
      const icon = this.getFileIcon(item);
      const itemPath = `${this.currentPath}/${item.name}`.replace('//', '/');

      return `
        <div class="nautilus-icon-item" data-path="${itemPath}" data-type="${item.type}">
          ${icon}
          <div class="nautilus-icon-label">${item.name}</div>
        </div>
      `;
    }

    /**
     * Render list item
     */
    renderListItem(item) {
      const icon = this.getFileIcon(item, 16);
      const itemPath = `${this.currentPath}/${item.name}`.replace('//', '/');
      const size = item.size ? this.formatSize(item.size) : '-';
      const modified = item.modified || '-';

      return `
        <div class="nautilus-list-item" data-path="${itemPath}" data-type="${item.type}">
          <div class="nautilus-list-cell">${icon}${item.name}</div>
          <div class="nautilus-list-cell">${size}</div>
          <div class="nautilus-list-cell">${modified}</div>
        </div>
      `;
    }

    /**
     * Get file icon
     */
    getFileIcon(item, size = 48) {
      if (item.type === 'directory') {
        return `
          <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none">
            <path d="M8 12h12l4 4h16v20H8V12z" fill="#F07746"/>
            <path d="M8 12h12l4 4h16v4H8V12z" fill="#DD4814"/>
          </svg>
        `;
      } else {
        return `
          <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none">
            <path d="M14 8h14l6 6v26H14V8z" fill="white" stroke="#808080"/>
            <path d="M28 8v6h6l-6-6z" fill="#E0E0E0"/>
            <rect x="18" y="18" width="12" height="2" fill="#CCCCCC"/>
            <rect x="18" y="22" width="12" height="2" fill="#CCCCCC"/>
            <rect x="18" y="26" width="8" height="2" fill="#CCCCCC"/>
          </svg>
        `;
      }
    }

    /**
     * Format file size
     */
    formatSize(bytes) {
      if (bytes < 1024) return bytes + ' bytes';
      if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
      return Math.round(bytes / (1024 * 1024)) + ' MB';
    }

    /**
     * Get status text
     */
    getStatusText() {
      const dirInfo = this.filesystem[this.currentPath];
      if (!dirInfo || dirInfo.type !== 'directory') return '';

      const itemCount = dirInfo.children.length;
      return `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
      const content = this.windowInstance.contentArea;

      // Toolbar buttons
      content.addEventListener('click', (e) => {
        const btn = e.target.closest('.nautilus-btn');
        if (btn) {
          const action = btn.getAttribute('data-action');
          this.handleToolbarAction(action);
        }

        // Sidebar navigation
        const sidebarItem = e.target.closest('.nautilus-sidebar-item');
        if (sidebarItem) {
          const path = sidebarItem.getAttribute('data-path');
          this.navigateTo(path);
        }

        // File/folder items
        const item = e.target.closest('.nautilus-icon-item, .nautilus-list-item');
        if (item) {
          const path = item.getAttribute('data-path');
          const type = item.getAttribute('data-type');
          this.handleItemClick(path, type);
        }
      });
    }

    /**
     * Handle toolbar actions
     */
    handleToolbarAction(action) {
      switch (action) {
        case 'back':
          // Navigate to parent
          this.navigateUp();
          break;
        case 'up':
          this.navigateUp();
          break;
        case 'home':
          this.navigateTo('/home/user');
          break;
        case 'icon-view':
          this.viewMode = 'icon';
          this.refreshView();
          break;
        case 'list-view':
          this.viewMode = 'list';
          this.refreshView();
          break;
      }
    }

    /**
     * Handle item click
     */
    handleItemClick(path, type) {
      if (type === 'directory') {
        this.navigateTo(path);
      } else {
        // Open file with appropriate application
        if (path.endsWith('.txt')) {
          if (typeof UbuntuGedit !== 'undefined') {
            const gedit = new UbuntuGedit(this.windowManager);
            gedit.open(path, 'Sample file content...');
          }
        } else {
          alert(`Opening file: ${path}`);
        }
      }
    }

    /**
     * Navigate to path
     */
    navigateTo(path) {
      this.currentPath = path;
      this.refreshView();
    }

    /**
     * Navigate up
     */
    navigateUp() {
      if (this.currentPath === '/') return;

      const parts = this.currentPath.split('/').filter(p => p);
      parts.pop();
      this.currentPath = '/' + parts.join('/');
      if (this.currentPath === '') this.currentPath = '/';

      this.refreshView();
    }

    /**
     * Refresh view
     */
    refreshView() {
      const dirInfo = this.filesystem[this.currentPath];
      const dirName = dirInfo ? dirInfo.name : 'File Browser';

      this.windowInstance.setTitle(`${dirName} - File Browser`);
      this.windowInstance.setContent(this.renderContent());
      this.attachEventListeners();
    }
  }

  // Export to global scope
  global.UbuntuNautilus = UbuntuNautilus;

})(typeof window !== 'undefined' ? window : global);
