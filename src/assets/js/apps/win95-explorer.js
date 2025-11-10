/**
 * Windows 95 Explorer
 * File manager with tree view and file list
 */

(function(global) {
  'use strict';

  class Win95Explorer {
    constructor(windowManager) {
      this.windowManager = windowManager;
      this.window = null;
      this.currentPath = 'C:\\';
      this.fileSystem = this.createFileSystem();
    }

    /**
     * Create simulated file system
     */
    createFileSystem() {
      return {
        'C:\\': {
          type: 'drive',
          name: 'C:\\',
          children: {
            'Windows': {
              type: 'folder',
              name: 'Windows',
              children: {
                'System': { type: 'folder', name: 'System', children: {} },
                'System32': { type: 'folder', name: 'System32', children: {} },
                'Temp': { type: 'folder', name: 'Temp', children: {} }
              }
            },
            'Program Files': {
              type: 'folder',
              name: 'Program Files',
              children: {
                'Accessories': { type: 'folder', name: 'Accessories', children: {} },
                'Internet Explorer': { type: 'folder', name: 'Internet Explorer', children: {} }
              }
            },
            'My Documents': {
              type: 'folder',
              name: 'My Documents',
              children: {
                'readme.txt': { type: 'file', name: 'readme.txt', size: 1024 }
              }
            }
          }
        },
        'A:\\': {
          type: 'drive',
          name: 'A:\\',
          children: {}
        },
        'D:\\': {
          type: 'drive',
          name: 'D:\\',
          children: {}
        }
      };
    }

    /**
     * Open Explorer
     */
    open(path = 'My Computer') {
      const windowContent = this.createContent();

      this.window = this.windowManager.createWindow({
        id: `explorer-${Date.now()}`,
        title: path,
        width: 640,
        height: 480,
        minWidth: 400,
        minHeight: 300,
        content: windowContent
      });

      this.setupEventListeners();
      this.renderTreeView();
      this.renderFileList();
    }

    /**
     * Create window content
     */
    createContent() {
      return `
        <div class="explorer-container" style="display: flex; flex-direction: column; height: 100%;">
          <!-- Toolbar -->
          <div class="explorer-toolbar" style="
            background: #c0c0c0;
            border-bottom: 2px solid #808080;
            padding: 4px;
            display: flex;
            gap: 4px;
            flex-shrink: 0;
          ">
            <button class="explorer-btn" data-action="back" title="Back">
              ◀
            </button>
            <button class="explorer-btn" data-action="forward" title="Forward">
              ▶
            </button>
            <button class="explorer-btn" data-action="up" title="Up">
              ⬆
            </button>
            <div style="flex: 1;"></div>
            <button class="explorer-btn" data-action="cut" title="Cut">
              ✂
            </button>
            <button class="explorer-btn" data-action="copy" title="Copy">
              📋
            </button>
            <button class="explorer-btn" data-action="paste" title="Paste">
              📄
            </button>
          </div>

          <!-- Address Bar -->
          <div class="explorer-address-bar" style="
            background: #c0c0c0;
            padding: 4px;
            display: flex;
            align-items: center;
            gap: 4px;
            border-bottom: 2px solid #808080;
            flex-shrink: 0;
          ">
            <span style="font-size: 11px;">Address:</span>
            <input type="text" class="explorer-address" value="My Computer"
                   style="flex: 1; padding: 2px 4px; border: 2px inset; font-size: 11px;">
          </div>

          <!-- Main Content Area -->
          <div class="explorer-content" style="
            display: flex;
            flex: 1;
            overflow: hidden;
          ">
            <!-- Tree View -->
            <div class="explorer-tree" style="
              width: 200px;
              border-right: 2px solid #808080;
              overflow-y: auto;
              background: white;
              padding: 8px;
              font-size: 11px;
            ">
              <!-- Tree will be populated by JavaScript -->
            </div>

            <!-- File List -->
            <div class="explorer-files" style="
              flex: 1;
              overflow: auto;
              background: white;
              padding: 8px;
            ">
              <!-- Files will be populated by JavaScript -->
            </div>
          </div>

          <!-- Status Bar -->
          <div class="explorer-status" style="
            background: #c0c0c0;
            border-top: 2px solid #fff;
            padding: 4px 8px;
            font-size: 11px;
            flex-shrink: 0;
          ">
            <span class="status-text">Ready</span>
          </div>
        </div>
      `;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
      // Toolbar buttons
      const buttons = this.window.element.querySelectorAll('.explorer-btn');
      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const action = btn.getAttribute('data-action');
          this.handleToolbarAction(action);
        });
      });

      // Address bar
      const addressBar = this.window.element.querySelector('.explorer-address');
      addressBar.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.navigateToPath(addressBar.value);
        }
      });
    }

    /**
     * Handle toolbar actions
     */
    handleToolbarAction(action) {
      switch (action) {
        case 'back':
          this.navigateBack();
          break;
        case 'forward':
          this.navigateForward();
          break;
        case 'up':
          this.navigateUp();
          break;
        case 'cut':
        case 'copy':
        case 'paste':
          alert(`${action.charAt(0).toUpperCase() + action.slice(1)} functionality not yet implemented.`);
          break;
      }
    }

    /**
     * Render tree view
     */
    renderTreeView() {
      const treeContainer = this.window.element.querySelector('.explorer-tree');
      treeContainer.innerHTML = '';

      // Desktop
      const desktop = this.createTreeNode('Desktop', 'desktop', true);
      treeContainer.appendChild(desktop);

      // My Computer
      const myComputer = this.createTreeNode('My Computer', 'mycomputer', true);
      desktop.appendChild(myComputer);

      // Drives
      Object.keys(this.fileSystem).forEach(driveName => {
        const drive = this.fileSystem[driveName];
        const driveNode = this.createTreeNode(driveName, driveName, false);
        myComputer.appendChild(driveNode);

        // Add folders
        if (drive.children) {
          this.renderTreeFolder(driveNode, drive.children, driveName);
        }
      });

      // Network Neighborhood
      const network = this.createTreeNode('Network Neighborhood', 'network', false);
      desktop.appendChild(network);

      // Recycle Bin
      const recycleBin = this.createTreeNode('Recycle Bin', 'recycle', false);
      desktop.appendChild(recycleBin);
    }

    /**
     * Render tree folder recursively
     */
    renderTreeFolder(parentNode, items, parentPath) {
      Object.keys(items).forEach(itemName => {
        const item = items[itemName];
        if (item.type === 'folder') {
          const fullPath = `${parentPath}${itemName}\\`;
          const node = this.createTreeNode(itemName, fullPath, false);
          parentNode.appendChild(node);

          if (item.children && Object.keys(item.children).length > 0) {
            this.renderTreeFolder(node, item.children, fullPath);
          }
        }
      });
    }

    /**
     * Create tree node
     */
    createTreeNode(label, path, expanded = false) {
      const node = document.createElement('div');
      node.className = 'tree-node';
      node.style.cssText = 'margin-left: 16px;';

      const toggle = document.createElement('span');
      toggle.textContent = expanded ? '▼ ' : '▶ ';
      toggle.style.cursor = 'pointer';
      toggle.style.userSelect = 'none';

      const labelSpan = document.createElement('span');
      labelSpan.textContent = label;
      labelSpan.style.cursor = 'pointer';

      toggle.addEventListener('click', () => {
        const isExpanded = toggle.textContent.includes('▼');
        toggle.textContent = isExpanded ? '▶ ' : '▼ ';
        const children = node.querySelectorAll(':scope > .tree-node');
        children.forEach(child => {
          child.style.display = isExpanded ? 'none' : 'block';
        });
      });

      labelSpan.addEventListener('click', () => {
        this.navigateToPath(path);
      });

      node.appendChild(toggle);
      node.appendChild(labelSpan);

      return node;
    }

    /**
     * Render file list
     */
    renderFileList() {
      const fileContainer = this.window.element.querySelector('.explorer-files');
      fileContainer.innerHTML = '';

      if (this.currentPath === 'My Computer' || this.currentPath === 'mycomputer') {
        // Show drives
        Object.keys(this.fileSystem).forEach(driveName => {
          const driveIcon = this.createFileIcon(driveName, 'drive');
          fileContainer.appendChild(driveIcon);
        });
      } else {
        // Show files and folders
        const items = this.getItemsAtPath(this.currentPath);
        if (items) {
          Object.keys(items).forEach(itemName => {
            const item = items[itemName];
            const icon = this.createFileIcon(itemName, item.type, item.size);
            fileContainer.appendChild(icon);
          });
        }
      }
    }

    /**
     * Create file icon
     */
    createFileIcon(name, type, size) {
      const icon = document.createElement('div');
      icon.style.cssText = `
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        width: 80px;
        margin: 8px;
        cursor: pointer;
        padding: 4px;
      `;

      const iconSymbol = document.createElement('div');
      iconSymbol.style.cssText = 'font-size: 32px; margin-bottom: 4px;';
      iconSymbol.textContent = type === 'folder' ? '📁' : type === 'drive' ? '💾' : '📄';

      const label = document.createElement('div');
      label.style.cssText = `
        font-size: 11px;
        text-align: center;
        word-wrap: break-word;
        max-width: 100%;
      `;
      label.textContent = name;

      icon.appendChild(iconSymbol);
      icon.appendChild(label);

      // Double-click to open
      let lastClick = 0;
      icon.addEventListener('click', () => {
        const now = Date.now();
        if (now - lastClick < 300) {
          // Double-click
          if (type === 'folder' || type === 'drive') {
            const newPath = type === 'drive' ? name : `${this.currentPath}${name}\\`;
            this.navigateToPath(newPath);
          } else if (type === 'file') {
            this.openFile(name);
          }
        }
        lastClick = now;
      });

      // Single-click to select
      icon.addEventListener('mousedown', () => {
        const selected = this.window.element.querySelector('.file-icon-selected');
        if (selected) {
          selected.classList.remove('file-icon-selected');
          selected.style.background = 'transparent';
        }
        icon.classList.add('file-icon-selected');
        icon.style.background = '#000080';
        icon.style.color = 'white';
        label.style.background = '#000080';
        label.style.color = 'white';
      });

      return icon;
    }

    /**
     * Get items at path
     */
    getItemsAtPath(path) {
      const parts = path.split('\\').filter(p => p);
      let current = this.fileSystem;

      for (const part of parts) {
        if (current[part]) {
          current = current[part];
          if (current.children) {
            current = current.children;
          } else {
            return null;
          }
        } else {
          return null;
        }
      }

      return current;
    }

    /**
     * Navigate to path
     */
    navigateToPath(path) {
      this.currentPath = path;
      this.window.setTitle(path);

      const addressBar = this.window.element.querySelector('.explorer-address');
      addressBar.value = path;

      this.renderFileList();

      const statusBar = this.window.element.querySelector('.status-text');
      const items = this.getItemsAtPath(path);
      const count = items ? Object.keys(items).length : 0;
      statusBar.textContent = `${count} object(s)`;
    }

    /**
     * Navigate up one level
     */
    navigateUp() {
      if (this.currentPath === 'My Computer') return;

      const parts = this.currentPath.split('\\').filter(p => p);
      if (parts.length > 1) {
        parts.pop();
        const newPath = parts.join('\\') + '\\';
        this.navigateToPath(newPath);
      } else {
        this.navigateToPath('My Computer');
      }
    }

    /**
     * Navigate back (placeholder)
     */
    navigateBack() {
      alert('Back navigation not yet implemented.');
    }

    /**
     * Navigate forward (placeholder)
     */
    navigateForward() {
      alert('Forward navigation not yet implemented.');
    }

    /**
     * Open file
     */
    openFile(filename) {
      if (filename.endsWith('.txt')) {
        // Open in Notepad
        if (typeof Win95Notepad !== 'undefined') {
          const notepad = new Win95Notepad(this.windowManager);
          notepad.open(filename, 'This is a sample text file.');
        }
      } else {
        alert(`Cannot open file: ${filename}`);
      }
    }
  }

  // Export to global scope
  global.Win95Explorer = Win95Explorer;

})(typeof window !== 'undefined' ? window : global);
