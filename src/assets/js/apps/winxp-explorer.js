/**
 * Windows XP Explorer
 * File browser with tree view and details pane
 */

(function(global) {
  'use strict';

  class WinXPExplorer {
    constructor(desktop) {
      this.desktop = desktop;
      this.window = null;
      this.currentPath = 'My Computer';
    }

    /**
     * Open Explorer window
     */
    open(path = 'My Computer') {
      this.currentPath = path;

      const windowContent = this.buildContent();

      this.window = this.desktop.windowManager.createWindow({
        id: `explorer-${Date.now()}`,
        title: path,
        content: windowContent,
        width: 700,
        height: 500,
        minWidth: 500,
        minHeight: 400,
        resizable: true,
        minimizable: true,
        maximizable: true
      });

      this.setupEventListeners();
    }

    /**
     * Build window content
     */
    buildContent() {
      return `
        <div class="explorer-container" style="display: flex; flex-direction: column; height: 100%; font-family: Tahoma, Arial, sans-serif; font-size: 11px;">
          <!-- Menu Bar -->
          <div class="explorer-menubar" style="display: flex; background: linear-gradient(to bottom, #ECE9D8 0%, #D6D3CE 100%); border-bottom: 1px solid #ACA899; padding: 2px 4px;">
            <button class="explorer-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer;">File</button>
            <button class="explorer-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer;">Edit</button>
            <button class="explorer-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer;">View</button>
            <button class="explorer-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer;">Favorites</button>
            <button class="explorer-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer;">Tools</button>
            <button class="explorer-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer;">Help</button>
          </div>

          <!-- Toolbar -->
          <div class="explorer-toolbar" style="display: flex; align-items: center; gap: 4px; background: linear-gradient(to bottom, #ECE9D8 0%, #D6D3CE 100%); border-bottom: 1px solid #ACA899; padding: 4px 8px;">
            <button class="toolbar-btn" title="Back" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">À</button>
            <button class="toolbar-btn" title="Forward" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">¶</button>
            <button class="toolbar-btn" title="Up" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;"></button>
            <div style="width: 1px; height: 20px; background: #ACA899; margin: 0 4px;"></div>
            <button class="toolbar-btn" title="Search" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">=</button>
            <button class="toolbar-btn" title="Folders" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">=Á</button>
          </div>

          <!-- Address Bar -->
          <div class="explorer-addressbar" style="display: flex; align-items: center; gap: 8px; background: #ECE9D8; border-bottom: 1px solid #ACA899; padding: 4px 8px;">
            <span style="font-weight: bold;">Address</span>
            <input type="text" value="${this.currentPath}" readonly style="flex: 1; padding: 4px 8px; border: 1px inset #ACA899; background: white; font-family: Tahoma; font-size: 11px;">
            <button style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">Go</button>
          </div>

          <!-- Main Content Area -->
          <div class="explorer-content" style="display: flex; flex: 1; overflow: hidden;">
            <!-- Left Panel - Folder Tree -->
            <div class="explorer-tree" style="width: 200px; background: white; border-right: 1px solid #ACA899; overflow-y: auto; padding: 8px;">
              <div style="padding: 4px 8px; cursor: pointer; border-radius: 2px;" onmouseover="this.style.background='#316AC5'; this.style.color='white';" onmouseout="this.style.background=''; this.style.color='';">
                =Á Desktop
              </div>
              <div style="padding: 4px 8px; cursor: pointer; border-radius: 2px; font-weight: bold; background: #E8F2FF;" onmouseover="this.style.background='#316AC5'; this.style.color='white';" onmouseout="this.style.background='#E8F2FF'; this.style.color='';">
                =» My Computer
              </div>
              <div style="padding: 4px 8px 4px 24px; cursor: pointer; border-radius: 2px;" onmouseover="this.style.background='#316AC5'; this.style.color='white';" onmouseout="this.style.background=''; this.style.color='';">
                =¾ (C:)
              </div>
              <div style="padding: 4px 8px 4px 24px; cursor: pointer; border-radius: 2px;" onmouseover="this.style.background='#316AC5'; this.style.color='white';" onmouseout="this.style.background=''; this.style.color='';">
                =¿ (D:)
              </div>
              <div style="padding: 4px 8px; cursor: pointer; border-radius: 2px;" onmouseover="this.style.background='#316AC5'; this.style.color='white';" onmouseout="this.style.background=''; this.style.color='';">
                =Ä My Documents
              </div>
              <div style="padding: 4px 8px; cursor: pointer; border-radius: 2px;" onmouseover="this.style.background='#316AC5'; this.style.color='white';" onmouseout="this.style.background=''; this.style.color='';">
                < My Network Places
              </div>
              <div style="padding: 4px 8px; cursor: pointer; border-radius: 2px;" onmouseover="this.style.background='#316AC5'; this.style.color='white';" onmouseout="this.style.background=''; this.style.color='';">
                =Ñ Recycle Bin
              </div>
            </div>

            <!-- Right Panel - File List -->
            <div class="explorer-files" style="flex: 1; background: white; overflow-y: auto; padding: 16px;">
              ${this.buildFileList()}
            </div>
          </div>

          <!-- Status Bar -->
          <div class="explorer-statusbar" style="background: #ECE9D8; border-top: 1px solid #ACA899; padding: 4px 8px; display: flex; justify-content: space-between;">
            <span>4 objects</span>
            <span>My Computer</span>
          </div>
        </div>
      `;
    }

    /**
     * Build file list
     */
    buildFileList() {
      const items = [
        { icon: '=Á', name: 'My Documents', type: 'File Folder', modified: '11/11/2025 10:30 AM' },
        { icon: '=¾', name: 'Local Disk (C:)', type: 'Local Disk', modified: '' },
        { icon: '=¿', name: 'CD Drive (D:)', type: 'CD Drive', modified: '' },
        { icon: '™', name: 'Control Panel', type: 'System Folder', modified: '' }
      ];

      return `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 16px; padding: 8px;">
          ${items.map(item => `
            <div class="file-item" style="display: flex; flex-direction: column; align-items: center; padding: 8px; cursor: pointer; border-radius: 4px; transition: background-color 0.1s;" onmouseover="this.style.background='#E8F2FF'" onmouseout="this.style.background=''" ondblclick="alert('Opening ${item.name}')">
              <div style="font-size: 32px; margin-bottom: 4px;">${item.icon}</div>
              <div style="text-align: center; word-wrap: break-word; max-width: 100px;">${item.name}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
      const menuButtons = this.window.element.querySelectorAll('.explorer-menu-btn');
      menuButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
          btn.style.background = 'linear-gradient(to bottom, #4B91FF 0%, #3C81F3 100%)';
          btn.style.color = 'white';
          btn.style.borderRadius = '2px';
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.background = 'transparent';
          btn.style.color = 'inherit';
        });

        btn.addEventListener('click', () => {
          alert('Menu: ' + btn.textContent);
        });
      });
    }
  }

  // Export to global scope
  global.WinXPExplorer = WinXPExplorer;

})(typeof window !== 'undefined' ? window : global);
