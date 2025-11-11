/**
 * Mac OS X Finder
 * Column view file browser with sidebar
 */

class MacOSXFinder {
  constructor(windowSystem) {
    this.windowSystem = windowSystem;
    this.currentPath = [];
    this.fileSystem = this.createFileSystem();
  }

  launch(options = {}) {
    const startFolder = options.folder || 'root';
    const content = this.createFinderContent();

    const windowId = this.windowSystem.createWindow({
      title: 'Macintosh HD',
      content: content,
      width: 700,
      height: 500,
      appId: 'finder',
      appName: 'Finder',
      toolbar: {
        items: [
          { label: 'Back', action: () => this.goBack() },
          { label: 'Forward', action: () => this.goForward() },
          { label: 'View', action: () => this.changeView() }
        ]
      },
      statusBar: '<span id="finder-status">0 items</span>'
    });

    this.windowId = windowId;
    this.initialize();
  }

  createFileSystem() {
    return {
      root: {
        name: 'Macintosh HD',
        type: 'folder',
        items: {
          applications: {
            name: 'Applications',
            type: 'folder',
            items: {
              finder: { name: 'Finder.app', type: 'app', icon: '📁' },
              mail: { name: 'Mail.app', type: 'app', icon: '✉️' },
              safari: { name: 'Internet Explorer.app', type: 'app', icon: '🌐' },
              itunes: { name: 'iTunes.app', type: 'app', icon: '🎵' },
              textedit: { name: 'TextEdit.app', type: 'app', icon: '📝' },
              terminal: { name: 'Terminal.app', type: 'app', icon: '💻' }
            }
          },
          users: {
            name: 'Users',
            type: 'folder',
            items: {
              user: {
                name: 'User',
                type: 'folder',
                items: {
                  documents: {
                    name: 'Documents',
                    type: 'folder',
                    items: {
                      readme: { name: 'Read Me.txt', type: 'file', icon: '📄' },
                      welcome: { name: 'Welcome.rtf', type: 'file', icon: '📝' }
                    }
                  },
                  desktop: {
                    name: 'Desktop',
                    type: 'folder',
                    items: {}
                  },
                  downloads: {
                    name: 'Downloads',
                    type: 'folder',
                    items: {}
                  },
                  pictures: {
                    name: 'Pictures',
                    type: 'folder',
                    items: {}
                  },
                  music: {
                    name: 'Music',
                    type: 'folder',
                    items: {}
                  }
                }
              }
            }
          },
          system: {
            name: 'System',
            type: 'folder',
            items: {
              library: { name: 'Library', type: 'folder', items: {} }
            }
          }
        }
      },
      trash: {
        name: 'Trash',
        type: 'folder',
        items: {}
      }
    };
  }

  createFinderContent() {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.height = '100%';
    container.style.background = '#fff';

    // Sidebar
    const sidebar = document.createElement('div');
    sidebar.className = 'finder-sidebar';
    sidebar.innerHTML = `
      <div class="finder-sidebar-item" data-location="root">
        <span style="font-size: 14px;">💾</span>
        <span>Macintosh HD</span>
      </div>
      <div style="height: 8px;"></div>
      <div class="finder-sidebar-item" data-location="applications">
        <span style="font-size: 12px;">📦</span>
        <span>Applications</span>
      </div>
      <div class="finder-sidebar-item" data-location="documents">
        <span style="font-size: 12px;">📄</span>
        <span>Documents</span>
      </div>
      <div class="finder-sidebar-item" data-location="desktop">
        <span style="font-size: 12px;">🖥️</span>
        <span>Desktop</span>
      </div>
      <div class="finder-sidebar-item" data-location="downloads">
        <span style="font-size: 12px;">⬇️</span>
        <span>Downloads</span>
      </div>
      <div style="height: 8px;"></div>
      <div class="finder-sidebar-item" data-location="trash">
        <span style="font-size: 12px;">🗑️</span>
        <span>Trash</span>
      </div>
    `;

    // Column view area
    const columnsArea = document.createElement('div');
    columnsArea.className = 'finder-columns';
    columnsArea.id = 'finder-columns';

    container.appendChild(sidebar);
    container.appendChild(columnsArea);

    return container;
  }

  initialize() {
    // Add event listeners to sidebar items
    const sidebar = document.querySelector(`#${this.windowId} .finder-sidebar`);
    if (sidebar) {
      sidebar.querySelectorAll('.finder-sidebar-item').forEach(item => {
        item.addEventListener('click', () => {
          // Remove selection from all items
          sidebar.querySelectorAll('.finder-sidebar-item').forEach(i => {
            i.classList.remove('selected');
          });
          item.classList.add('selected');

          const location = item.dataset.location;
          this.navigateToLocation(location);
        });
      });

      // Select first item by default
      const firstItem = sidebar.querySelector('.finder-sidebar-item');
      if (firstItem) {
        firstItem.classList.add('selected');
      }
    }

    // Load initial location
    this.navigateToLocation('root');
  }

  navigateToLocation(location) {
    switch (location) {
      case 'root':
        this.currentPath = ['root'];
        break;
      case 'applications':
        this.currentPath = ['root', 'applications'];
        break;
      case 'documents':
        this.currentPath = ['root', 'users', 'user', 'documents'];
        break;
      case 'desktop':
        this.currentPath = ['root', 'users', 'user', 'desktop'];
        break;
      case 'downloads':
        this.currentPath = ['root', 'users', 'user', 'downloads'];
        break;
      case 'trash':
        this.currentPath = ['trash'];
        break;
    }

    this.renderColumns();
  }

  renderColumns() {
    const columnsArea = document.querySelector(`#${this.windowId} .finder-columns`);
    if (!columnsArea) return;

    columnsArea.innerHTML = '';

    // Render each level of the path
    let currentNode = this.fileSystem;
    const columns = [];

    for (let i = 0; i < this.currentPath.length; i++) {
      const pathPart = this.currentPath[i];
      currentNode = currentNode[pathPart];

      if (!currentNode) break;

      // Create column for current level
      const column = this.createColumn(currentNode, i);
      columns.push(column);
      columnsArea.appendChild(column);
    }

    // Add empty column for selection preview
    if (currentNode && currentNode.items) {
      const previewColumn = this.createPreviewColumn();
      columnsArea.appendChild(previewColumn);
    }

    // Update status bar
    this.updateStatusBar();
  }

  createColumn(node, level) {
    const column = document.createElement('div');
    column.className = 'finder-column';
    column.dataset.level = level;

    if (node.items) {
      Object.entries(node.items).forEach(([key, item]) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'finder-item';
        itemEl.dataset.key = key;

        const icon = document.createElement('span');
        icon.className = 'finder-item-icon';
        icon.textContent = item.icon || (item.type === 'folder' ? '📁' : '📄');

        const name = document.createElement('span');
        name.textContent = item.name;

        itemEl.appendChild(icon);
        itemEl.appendChild(name);

        itemEl.addEventListener('click', () => {
          // Remove selection from siblings
          column.querySelectorAll('.finder-item').forEach(i => {
            i.classList.remove('selected');
          });
          itemEl.classList.add('selected');

          // If folder, add to path and update
          if (item.type === 'folder') {
            this.currentPath = this.currentPath.slice(0, level + 1);
            this.currentPath.push(key);
            this.renderColumns();
          }
        });

        itemEl.addEventListener('dblclick', () => {
          this.openItem(item, key);
        });

        column.appendChild(itemEl);
      });
    }

    return column;
  }

  createPreviewColumn() {
    const column = document.createElement('div');
    column.className = 'finder-column';
    column.style.display = 'flex';
    column.style.alignItems = 'center';
    column.style.justifyContent = 'center';
    column.style.color = '#999';
    column.style.fontSize = '12px';
    column.textContent = 'Select an item';
    return column;
  }

  openItem(item, key) {
    if (item.type === 'folder') {
      // Already handled by column navigation
      return;
    }

    if (item.type === 'app') {
      const appId = key;
      if (window.macosx) {
        window.macosx.launchApp(appId);
      }
    } else if (item.type === 'file') {
      // Open file in appropriate application
      if (item.name.endsWith('.txt') || item.name.endsWith('.rtf')) {
        if (window.macosx) {
          window.macosx.launchApp('textedit');
        }
      }
    }
  }

  goBack() {
    if (this.currentPath.length > 1) {
      this.currentPath.pop();
      this.renderColumns();
    }
  }

  goForward() {
    // Not implemented in this demo
    console.log('Go Forward');
  }

  changeView() {
    alert('View options (Demo mode)\n\nMac OS X Cheetah supports:\n• Icon View\n• List View\n• Column View (current)');
  }

  updateStatusBar() {
    const statusEl = document.querySelector(`#${this.windowId} #finder-status`);
    if (!statusEl) return;

    // Count items in current location
    let currentNode = this.fileSystem;
    for (const pathPart of this.currentPath) {
      currentNode = currentNode[pathPart];
      if (!currentNode) break;
    }

    const itemCount = currentNode && currentNode.items
      ? Object.keys(currentNode.items).length
      : 0;

    statusEl.textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;

    // Update window title
    const windowEl = document.getElementById(this.windowId);
    if (windowEl) {
      const titleEl = windowEl.querySelector('.window-title');
      if (titleEl && currentNode) {
        titleEl.textContent = currentNode.name;
      }
    }
  }
}

// Make available globally
window.MacOSXFinder = MacOSXFinder;
