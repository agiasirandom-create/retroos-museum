/**
 * Windows 3.1 File Manager
 * Classic two-pane file browser
 */

(function(global) {
  'use strict';

  class Win31FileManager {
    constructor(desktop) {
      this.desktop = desktop;
      this.window = null;
      this.currentPath = 'C:\\';
    }

    /**
     * Open File Manager
     */
    open() {
      if (this.window) {
        this.window.focus();
        return;
      }

      const content = this.buildContent();

      this.window = this.desktop.windowManager.createWindow({
        id: 'file-manager-' + Date.now(),
        title: 'File Manager - [C:\\*.*]',
        content: content,
        width: 600,
        height: 400,
        onClose: () => {
          this.window = null;
        }
      });

      this.attachEventListeners();
    }

    /**
     * Build File Manager content
     */
    buildContent() {
      return `
        <div class="window-menubar">
          <div class="menu-item" data-menu="file">File</div>
          <div class="menu-item" data-menu="disk">Disk</div>
          <div class="menu-item" data-menu="tree">Tree</div>
          <div class="menu-item" data-menu="view">View</div>
          <div class="menu-item" data-menu="options">Options</div>
          <div class="menu-item" data-menu="window">Window</div>
          <div class="menu-item" data-menu="help">Help</div>
        </div>

        <div class="window-toolbar">
          <button class="toolbar-button" title="Open">=Â</button>
          <button class="toolbar-button" title="Print">=¨</button>
          <div class="toolbar-separator"></div>
          <button class="toolbar-button" title="Copy">=Ë</button>
          <button class="toolbar-button" title="Move">¡</button>
          <button class="toolbar-button" title="Delete">=Ñ</button>
          <div class="toolbar-separator"></div>
          <button class="toolbar-button" title="Properties">9</button>
        </div>

        <div class="file-manager-content">
          <div class="file-manager-tree" id="file-tree">
            ${this.buildTreeView()}
          </div>
          <div class="file-manager-list" id="file-list">
            ${this.buildFileList()}
          </div>
        </div>

        <div class="window-statusbar">
          <div class="statusbar-section flex">Selected: 0 file(s)</div>
          <div class="statusbar-section">Total: 24 file(s)</div>
          <div class="statusbar-section">Free: 512MB</div>
        </div>
      `;
    }

    /**
     * Build tree view
     */
    buildTreeView() {
      return `
        <div class="tree-item selected" data-path="C:\\">
          <span class="tree-item-icon">=¾</span> C:\\
        </div>
        <div class="tree-item" data-path="C:\\WINDOWS" style="padding-left: 20px;">
          <span class="tree-item-icon">=Á</span> WINDOWS
        </div>
        <div class="tree-item" data-path="C:\\WINDOWS\\SYSTEM" style="padding-left: 36px;">
          <span class="tree-item-icon">=Á</span> SYSTEM
        </div>
        <div class="tree-item" data-path="C:\\DOS" style="padding-left: 20px;">
          <span class="tree-item-icon">=Á</span> DOS
        </div>
        <div class="tree-item" data-path="C:\\TEMP" style="padding-left: 20px;">
          <span class="tree-item-icon">=Á</span> TEMP
        </div>
        <div class="tree-item" data-path="C:\\WINWORD" style="padding-left: 20px;">
          <span class="tree-item-icon">=Á</span> WINWORD
        </div>
        <div class="tree-item" data-path="C:\\EXCEL" style="padding-left: 20px;">
          <span class="tree-item-icon">=Á</span> EXCEL
        </div>
        <div class="tree-item" data-path="A:\\" style="margin-top: 8px;">
          <span class="tree-item-icon">=¾</span> A:\\
        </div>
        <div class="tree-item" data-path="D:\\" style="margin-top: 8px;">
          <span class="tree-item-icon">=¿</span> D:\\
        </div>
      `;
    }

    /**
     * Build file list
     */
    buildFileList() {
      const files = [
        { name: 'AUTOEXEC.BAT', size: '512 bytes', type: 'BAT', icon: '=Ä' },
        { name: 'CONFIG.SYS', size: '256 bytes', type: 'SYS', icon: '™' },
        { name: 'COMMAND.COM', size: '52,925 bytes', type: 'COM', icon: '™' },
        { name: 'WIN.INI', size: '4,096 bytes', type: 'INI', icon: '=Ý' },
        { name: 'SYSTEM.INI', size: '2,048 bytes', type: 'INI', icon: '=Ý' },
        { name: 'PROGMAN.INI', size: '1,024 bytes', type: 'INI', icon: '=Ý' },
        { name: 'README.TXT', size: '8,192 bytes', type: 'TXT', icon: '=Ä' },
        { name: 'INSTALL.EXE', size: '128,000 bytes', type: 'EXE', icon: '™' },
      ];

      return files.map(file => `
        <div class="file-item" data-filename="${file.name}">
          <span class="file-item-icon">${file.icon}</span>
          <span style="flex: 1;">${file.name}</span>
          <span style="width: 100px; text-align: right;">${file.size}</span>
        </div>
      `).join('');
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
      const windowEl = this.window.element;

      // Tree items
      const treeItems = windowEl.querySelectorAll('.tree-item');
      treeItems.forEach(item => {
        item.addEventListener('click', (e) => {
          // Deselect all
          treeItems.forEach(t => t.classList.remove('selected'));
          // Select this one
          item.classList.add('selected');

          const path = item.dataset.path;
          this.currentPath = path;
          this.window.setTitle(`File Manager - [${path}*.*]`);
        });
      });

      // File items
      const fileItems = windowEl.querySelectorAll('.file-item');
      fileItems.forEach(item => {
        item.addEventListener('click', (e) => {
          // Deselect all
          fileItems.forEach(f => f.classList.remove('selected'));
          // Select this one
          item.classList.add('selected');
        });

        item.addEventListener('dblclick', (e) => {
          const filename = item.dataset.filename;
          if (filename.endsWith('.TXT')) {
            this.openTextFile(filename);
          } else {
            this.desktop.showNotImplemented('Opening ' + filename);
          }
        });
      });

      // Menu items
      const menuItems = windowEl.querySelectorAll('.menu-item');
      menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
          // Simplified - just show "not implemented"
          const menuType = item.dataset.menu;
          if (menuType === 'help') {
            this.showAbout();
          }
        });
      });

      // Toolbar buttons
      const toolbarButtons = windowEl.querySelectorAll('.toolbar-button');
      toolbarButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          // Simplified - just show feedback
          const title = button.getAttribute('title');
          console.log('Toolbar:', title);
        });
      });
    }

    /**
     * Open text file
     */
    openTextFile(filename) {
      const content = `
        <div style="padding: 16px; background: white; height: 100%; overflow: auto; font-family: 'Courier New', monospace; font-size: 11px; line-height: 1.4;">
          <pre>This is a sample text file: ${filename}

Windows 3.1 File Manager allows you to:
- Browse files and folders
- Copy, move, and delete files
- View file properties
- Search for files
- Format disks

This is a demonstration file in the RetroOS Museum recreation.</pre>
        </div>
      `;

      this.desktop.windowManager.createWindow({
        id: 'notepad-' + Date.now(),
        title: filename + ' - Notepad',
        content: content,
        width: 500,
        height: 350
      });
    }

    /**
     * Show About dialog
     */
    showAbout() {
      const content = `
        <div class="win31-dialog about-dialog">
          <div class="about-logo">=Á</div>
          <div class="about-title">File Manager</div>
          <div class="about-version">Version 3.1</div>
          <div style="margin: 16px 0;">
            <p>Microsoft Windows File Manager</p>
            <p>Copyright © 1990-1992 Microsoft Corp.</p>
          </div>
          <div class="dialog-buttons">
            <button class="win31-button default" onclick="this.closest('.os-window').querySelector('.window-btn-close').click()">OK</button>
          </div>
        </div>
      `;

      this.desktop.windowManager.createWindow({
        id: 'about-file-manager',
        title: 'About File Manager',
        content: content,
        width: 350,
        height: 280,
        resizable: false,
        maximizable: false,
        modal: true
      });
    }
  }

  // Export to global scope
  global.Win31FileManager = Win31FileManager;

})(typeof window !== 'undefined' ? window : global);
