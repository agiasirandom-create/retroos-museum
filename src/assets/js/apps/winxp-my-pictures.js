/**
 * Windows XP My Pictures
 * Special folder view with picture tasks sidebar
 */

(function(global) {
  'use strict';

  class WinXPMyPictures {
    constructor(desktop) {
      this.desktop = desktop;
      this.window = null;
      this.viewMode = 'thumbnails';
    }

    /**
     * Open My Pictures window
     */
    open() {
      const windowContent = this.buildContent();

      this.window = this.desktop.windowManager.createWindow({
        id: `mypictures-${Date.now()}`,
        title: 'My Pictures',
        content: windowContent,
        width: 750,
        height: 550,
        minWidth: 600,
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
        <div class="mypictures-container" style="display: flex; flex-direction: column; height: 100%; font-family: Tahoma, Arial, sans-serif; font-size: 11px; background: #ECE9D8;">
          <!-- Menu Bar -->
          <div class="mypictures-menubar" style="display: flex; background: linear-gradient(to bottom, #ECE9D8 0%, #D6D3CE 100%); border-bottom: 1px solid #ACA899; padding: 2px 4px;">
            <button class="mypictures-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">File</button>
            <button class="mypictures-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">Edit</button>
            <button class="mypictures-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">View</button>
            <button class="mypictures-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">Favorites</button>
            <button class="mypictures-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">Tools</button>
            <button class="mypictures-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">Help</button>
          </div>

          <!-- Toolbar -->
          <div class="mypictures-toolbar" style="display: flex; align-items: center; gap: 4px; background: linear-gradient(to bottom, #ECE9D8 0%, #D6D3CE 100%); border-bottom: 1px solid #ACA899; padding: 4px 8px;">
            <button class="toolbar-btn" title="Back" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">◀</button>
            <button class="toolbar-btn" title="Forward" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">▶</button>
            <button class="toolbar-btn" title="Up" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">⬆</button>
            <div style="width: 1px; height: 20px; background: #ACA899; margin: 0 4px;"></div>
            <button class="toolbar-btn" title="Search" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">🔍</button>
            <button class="toolbar-btn" title="Folders" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">📁</button>
            <div style="width: 1px; height: 20px; background: #ACA899; margin: 0 4px;"></div>
            <button class="view-btn" data-view="thumbnails" title="Thumbnails" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">🖼️</button>
            <button class="view-btn" data-view="filmstrip" title="Filmstrip" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">📽️</button>
          </div>

          <!-- Address Bar -->
          <div class="mypictures-addressbar" style="display: flex; align-items: center; gap: 8px; background: #ECE9D8; border-bottom: 1px solid #ACA899; padding: 4px 8px;">
            <span style="font-weight: bold;">Address</span>
            <input type="text" value="C:\\Documents and Settings\\User\\My Documents\\My Pictures" readonly style="flex: 1; padding: 4px 8px; border: 1px inset #ACA899; background: white; font-family: Tahoma; font-size: 11px;">
          </div>

          <!-- Main Content Area -->
          <div class="mypictures-content" style="display: flex; flex: 1; overflow: hidden;">
            <!-- Left Sidebar - Picture Tasks -->
            <div class="picture-tasks" style="width: 200px; background: linear-gradient(to bottom, #D6E9F8 0%, #B3D9F0 100%); border-right: 1px solid #ACA899; overflow-y: auto;">
              <div style="padding: 12px; border-bottom: 1px solid #ACA899;">
                <h3 style="margin: 0 0 12px 0; color: #003C74; font-size: 13px; font-weight: bold;">Picture Tasks</h3>
                <button class="task-btn" style="width: 100%; padding: 8px; margin-bottom: 6px; background: linear-gradient(to bottom, #FFFFFF 0%, #E8F2FF 100%); border: 1px solid #5A8DD5; border-radius: 4px; cursor: pointer; text-align: left; font-size: 11px; color: #003C74;">▶ View as a slide show</button>
                <button class="task-btn" style="width: 100%; padding: 8px; margin-bottom: 6px; background: linear-gradient(to bottom, #FFFFFF 0%, #E8F2FF 100%); border: 1px solid #5A8DD5; border-radius: 4px; cursor: pointer; text-align: left; font-size: 11px; color: #003C74;">🖨️ Order prints online</button>
                <button class="task-btn" style="width: 100%; padding: 8px; margin-bottom: 6px; background: linear-gradient(to bottom, #FFFFFF 0%, #E8F2FF 100%); border: 1px solid #5A8DD5; border-radius: 4px; cursor: pointer; text-align: left; font-size: 11px; color: #003C74;">🖨️ Print pictures</button>
                <button class="task-btn" style="width: 100%; padding: 8px; margin-bottom: 6px; background: linear-gradient(to bottom, #FFFFFF 0%, #E8F2FF 100%); border: 1px solid #5A8DD5; border-radius: 4px; cursor: pointer; text-align: left; font-size: 11px; color: #003C74;">💿 Copy to CD</button>
              </div>
              <div style="padding: 12px; border-bottom: 1px solid #ACA899;">
                <h3 style="margin: 0 0 12px 0; color: #003C74; font-size: 13px; font-weight: bold;">File and Folder Tasks</h3>
                <button class="task-btn" style="width: 100%; padding: 8px; margin-bottom: 6px; background: linear-gradient(to bottom, #FFFFFF 0%, #E8F2FF 100%); border: 1px solid #5A8DD5; border-radius: 4px; cursor: pointer; text-align: left; font-size: 11px; color: #003C74;">📄 Get pictures from camera</button>
                <button class="task-btn" style="width: 100%; padding: 8px; margin-bottom: 6px; background: linear-gradient(to bottom, #FFFFFF 0%, #E8F2FF 100%); border: 1px solid #5A8DD5; border-radius: 4px; cursor: pointer; text-align: left; font-size: 11px; color: #003C74;">📁 Make a new folder</button>
              </div>
              <div style="padding: 12px;">
                <h3 style="margin: 0 0 12px 0; color: #003C74; font-size: 13px; font-weight: bold;">Other Places</h3>
                <button class="place-btn" style="width: 100%; padding: 6px; margin-bottom: 4px; background: transparent; border: none; cursor: pointer; text-align: left; font-size: 11px; color: #003C74;">📁 My Documents</button>
                <button class="place-btn" style="width: 100%; padding: 6px; margin-bottom: 4px; background: transparent; border: none; cursor: pointer; text-align: left; font-size: 11px; color: #003C74;">🖥️ My Computer</button>
                <button class="place-btn" style="width: 100%; padding: 6px; margin-bottom: 4px; background: transparent; border: none; cursor: pointer; text-align: left; font-size: 11px; color: #003C74;">🌐 My Network Places</button>
              </div>
            </div>

            <!-- Right Panel - Picture View -->
            <div class="picture-view" style="flex: 1; background: white; overflow-y: auto; padding: 16px;">
              ${this.buildPictureView()}
            </div>
          </div>

          <!-- Status Bar -->
          <div class="mypictures-statusbar" style="background: #ECE9D8; border-top: 1px solid #ACA899; padding: 4px 8px; display: flex; justify-content: space-between;">
            <span id="file-count">8 objects</span>
            <span>My Pictures</span>
          </div>
        </div>
      `;
    }

    /**
     * Build picture view
     */
    buildPictureView() {
      if (this.viewMode === 'thumbnails') {
        return this.buildThumbnailView();
      } else {
        return this.buildFilmstripView();
      }
    }

    /**
     * Build thumbnail view
     */
    buildThumbnailView() {
      const pictures = [
        { name: 'Vacation 001.jpg', size: '1024x768', date: '11/11/2025' },
        { name: 'Vacation 002.jpg', size: '1024x768', date: '11/11/2025' },
        { name: 'Birthday 001.jpg', size: '1600x1200', date: '10/15/2025' },
        { name: 'Birthday 002.jpg', size: '1600x1200', date: '10/15/2025' },
        { name: 'Sunset.jpg', size: '2048x1536', date: '09/20/2025' },
        { name: 'Beach.jpg', size: '1280x960', date: '08/05/2025' },
        { name: 'Mountains.jpg', size: '1920x1440', date: '07/12/2025' },
        { name: 'City.jpg', size: '1600x1200', date: '06/30/2025' }
      ];

      return `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px; padding: 8px;">
          ${pictures.map(pic => `
            <div class="picture-item" style="display: flex; flex-direction: column; align-items: center; padding: 8px; cursor: pointer; border: 2px solid transparent; border-radius: 4px; transition: all 0.2s;" onmouseover="this.style.background='#E8F2FF'; this.style.borderColor='#5A8DD5'" onmouseout="this.style.background=''; this.style.borderColor='transparent'">
              <div style="width: 120px; height: 90px; background: linear-gradient(135deg, #E0E0E0 0%, #F5F5F5 100%); border: 1px solid #D0D0D0; border-radius: 4px; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="font-size: 40px;">🖼️</div>
              </div>
              <div style="text-align: center; word-wrap: break-word; max-width: 100%; font-size: 11px;">
                <div style="font-weight: 500; margin-bottom: 2px;">${pic.name}</div>
                <div style="font-size: 9px; color: #666;">${pic.size}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    /**
     * Build filmstrip view
     */
    buildFilmstripView() {
      return `
        <div style="display: flex; flex-direction: column; height: 100%;">
          <!-- Main Preview -->
          <div style="flex: 1; display: flex; align-items: center; justify-content: center; background: #F5F5F5; border: 1px solid #D0D0D0; border-radius: 4px; margin-bottom: 8px;">
            <div style="text-align: center;">
              <div style="font-size: 120px; margin-bottom: 16px;">🖼️</div>
              <div style="font-size: 14px; font-weight: bold; color: #333;">Vacation 001.jpg</div>
              <div style="font-size: 12px; color: #666; margin-top: 4px;">1024 x 768 pixels</div>
            </div>
          </div>

          <!-- Filmstrip -->
          <div style="height: 100px; background: #E0E0E0; border: 1px solid #D0D0D0; border-radius: 4px; display: flex; align-items: center; gap: 8px; padding: 8px; overflow-x: auto;">
            ${Array(8).fill(0).map((_, i) => `
              <div style="min-width: 80px; height: 60px; background: white; border: 2px solid ${i === 0 ? '#0054E3' : '#999'}; border-radius: 2px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: border-color 0.2s;">
                <div style="font-size: 24px;">🖼️</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
      // View buttons
      const viewButtons = this.window.element.querySelectorAll('.view-btn');
      viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.viewMode = btn.dataset.view;
          const pictureView = this.window.element.querySelector('.picture-view');
          if (pictureView) {
            pictureView.innerHTML = this.buildPictureView();
          }
        });
      });

      // Task buttons
      const taskButtons = this.window.element.querySelectorAll('.task-btn');
      taskButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const task = btn.textContent.trim().replace(/^[▶🖨️💿📄📁]\s*/, '');
          if (task === 'View as a slide show') {
            alert('Slide Show\n\nIn a full implementation, this would start a full-screen slide show.');
          } else {
            alert(`Task: ${task}\n\nIn a full implementation, this would perform the selected task.`);
          }
        });

        btn.addEventListener('mouseenter', () => {
          btn.style.background = 'linear-gradient(to bottom, #E8F2FF 0%, #C0DEFF 100%)';
          btn.style.borderColor = '#0054E3';
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.background = 'linear-gradient(to bottom, #FFFFFF 0%, #E8F2FF 100%)';
          btn.style.borderColor = '#5A8DD5';
        });
      });

      // Place buttons
      const placeButtons = this.window.element.querySelectorAll('.place-btn');
      placeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const place = btn.textContent.trim().replace(/^[📁🖥️🌐]\s*/, '');
          alert(`Navigate to: ${place}`);
        });

        btn.addEventListener('mouseenter', () => {
          btn.style.background = 'rgba(255, 255, 255, 0.5)';
          btn.style.textDecoration = 'underline';
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.background = 'transparent';
          btn.style.textDecoration = 'none';
        });
      });

      // Toolbar buttons
      const toolbarButtons = this.window.element.querySelectorAll('.toolbar-btn');
      toolbarButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
          btn.style.background = 'linear-gradient(to bottom, #E8F2FF 0%, #C0DEFF 100%)';
          btn.style.borderColor = '#0054E3';
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.background = 'linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%)';
          btn.style.borderColor = '#ACA899';
        });
      });

      // Menu buttons
      const menuButtons = this.window.element.querySelectorAll('.mypictures-menu-btn');
      menuButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
          btn.style.background = 'linear-gradient(to bottom, #4B91FF 0%, #3C81F3 100%)';
          btn.style.color = 'white';
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.background = 'transparent';
          btn.style.color = 'inherit';
        });

        btn.addEventListener('click', () => {
          alert(`${btn.textContent} menu`);
        });
      });
    }
  }

  // Export to global scope
  global.WinXPMyPictures = WinXPMyPictures;

})(typeof window !== 'undefined' ? window : global);
