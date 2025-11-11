/**
 * Windows XP Internet Explorer 6
 * Classic IE6 browser interface
 */

(function(global) {
  'use strict';

  class WinXPInternetExplorer {
    constructor(desktop) {
      this.desktop = desktop;
      this.window = null;
      this.currentUrl = 'http://www.msn.com';
      this.history = [];
      this.historyIndex = -1;
    }

    /**
     * Open Internet Explorer window
     */
    open() {
      const windowContent = this.buildContent();

      this.window = this.desktop.windowManager.createWindow({
        id: `ie-${Date.now()}`,
        title: 'MSN.com - Microsoft Internet Explorer',
        content: windowContent,
        width: 800,
        height: 600,
        minWidth: 640,
        minHeight: 480,
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
        <div class="ie-container" style="display: flex; flex-direction: column; height: 100%; font-family: Tahoma, Arial, sans-serif; font-size: 11px; background: #ECE9D8;">
          <!-- Menu Bar -->
          <div class="ie-menubar" style="display: flex; background: linear-gradient(to bottom, #ECE9D8 0%, #D6D3CE 100%); border-bottom: 1px solid #ACA899; padding: 2px 4px;">
            <button class="ie-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">File</button>
            <button class="ie-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">Edit</button>
            <button class="ie-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">View</button>
            <button class="ie-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">Favorites</button>
            <button class="ie-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">Tools</button>
            <button class="ie-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">Help</button>
          </div>

          <!-- Toolbar -->
          <div class="ie-toolbar" style="display: flex; align-items: center; gap: 4px; background: linear-gradient(to bottom, #ECE9D8 0%, #D6D3CE 100%); border-bottom: 1px solid #ACA899; padding: 4px 8px;">
            <button class="toolbar-btn" id="back-btn" title="Back" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">◀</button>
            <button class="toolbar-btn" id="forward-btn" title="Forward" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">▶</button>
            <button class="toolbar-btn" id="stop-btn" title="Stop" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">✕</button>
            <button class="toolbar-btn" id="refresh-btn" title="Refresh" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">↻</button>
            <button class="toolbar-btn" id="home-btn" title="Home" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">🏠</button>
            <div style="width: 1px; height: 20px; background: #ACA899; margin: 0 4px;"></div>
            <button class="toolbar-btn" title="Search" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">🔍</button>
            <button class="toolbar-btn" title="Favorites" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">⭐</button>
            <button class="toolbar-btn" title="History" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">📜</button>
          </div>

          <!-- Address Bar -->
          <div class="ie-addressbar" style="display: flex; align-items: center; gap: 8px; background: #ECE9D8; border-bottom: 1px solid #ACA899; padding: 4px 8px;">
            <span style="font-weight: bold;">Address</span>
            <div style="flex: 1; display: flex; align-items: center; background: white; border: 1px inset #ACA899; padding: 2px 4px;">
              <span style="margin-right: 4px;">🌐</span>
              <input type="text" id="address-input" value="${this.currentUrl}" style="flex: 1; border: none; outline: none; font-family: Tahoma; font-size: 11px; background: transparent;">
            </div>
            <button id="go-btn" style="padding: 4px 12px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer; font-weight: bold;">Go</button>
            <button class="toolbar-btn" title="Links" style="padding: 4px 8px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">»</button>
          </div>

          <!-- Links Toolbar -->
          <div class="ie-links" style="display: flex; align-items: center; gap: 4px; background: #ECE9D8; border-bottom: 1px solid #ACA899; padding: 4px 8px;">
            <span style="color: #666; font-size: 10px;">Links »</span>
            <button class="link-btn" style="padding: 3px 8px; background: transparent; border: none; cursor: pointer; color: #0000EE; text-decoration: underline; font-size: 11px;">MSN.com</button>
            <button class="link-btn" style="padding: 3px 8px; background: transparent; border: none; cursor: pointer; color: #0000EE; text-decoration: underline; font-size: 11px;">Windows Update</button>
            <button class="link-btn" style="padding: 3px 8px; background: transparent; border: none; cursor: pointer; color: #0000EE; text-decoration: underline; font-size: 11px;">Windows</button>
          </div>

          <!-- Main Content Area -->
          <div class="ie-content" style="display: flex; flex: 1; overflow: hidden;">
            <!-- Browser Content -->
            <div class="ie-page" style="flex: 1; background: white; overflow-y: auto; padding: 20px;">
              ${this.buildPageContent()}
            </div>
          </div>

          <!-- Status Bar -->
          <div class="ie-statusbar" style="background: #ECE9D8; border-top: 1px solid #ACA899; padding: 4px 8px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span id="status-text">Done</span>
              <div style="width: 1px; height: 16px; background: #ACA899;"></div>
              <span style="font-size: 10px;">🔒 Encrypted</span>
            </div>
            <div style="display: flex; gap: 8px; align-items: center;">
              <span style="font-size: 10px;">Internet</span>
              <div style="width: 16px; height: 16px; background: #0000EE; border: 1px solid #000;"></div>
            </div>
          </div>
        </div>
      `;
    }

    /**
     * Build page content
     */
    buildPageContent() {
      return `
        <div style="max-width: 900px; margin: 0 auto; font-family: Arial, sans-serif;">
          <!-- IE Logo -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 80px; height: 80px; margin: 0 auto; background: linear-gradient(135deg, #4299E1 0%, #2B6CB0 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 48px; font-weight: bold; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">e</div>
            <h1 style="color: #003C74; margin-top: 16px; font-size: 32px;">Welcome to Internet Explorer 6</h1>
          </div>

          <!-- Content -->
          <div style="background: #F0F8FF; border: 1px solid #B0D4F1; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #003C74; font-size: 20px; margin-top: 0;">Your Gateway to the Web</h2>
            <p style="line-height: 1.6; color: #333;">
              This is a recreation of the classic Internet Explorer 6 browser interface from Windows XP.
              Internet Explorer 6 was released in 2001 and became one of the most widely used web browsers of its time.
            </p>
          </div>

          <!-- Quick Links -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px;">
            <div style="background: white; border: 1px solid #D0D0D0; border-radius: 4px; padding: 16px;">
              <h3 style="color: #003C74; font-size: 14px; margin-top: 0;">🔍 Search</h3>
              <p style="font-size: 12px; color: #666;">Find information on the web</p>
            </div>
            <div style="background: white; border: 1px solid #D0D0D0; border-radius: 4px; padding: 16px;">
              <h3 style="color: #003C74; font-size: 14px; margin-top: 0;">⭐ Favorites</h3>
              <p style="font-size: 12px; color: #666;">Access your saved sites</p>
            </div>
            <div style="background: white; border: 1px solid #D0D0D0; border-radius: 4px; padding: 16px;">
              <h3 style="color: #003C74; font-size: 14px; margin-top: 0;">📜 History</h3>
              <p style="font-size: 12px; color: #666;">View recently visited pages</p>
            </div>
          </div>

          <!-- Info Box -->
          <div style="background: #FFF8DC; border: 1px solid #F0E68C; border-radius: 4px; padding: 16px;">
            <strong style="color: #8B4513;">Note:</strong>
            <span style="color: #333;">This is a demonstration interface. In a real implementation, this would display actual web content.</span>
          </div>
        </div>
      `;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
      // Navigation buttons
      const backBtn = this.window.element.querySelector('#back-btn');
      const forwardBtn = this.window.element.querySelector('#forward-btn');
      const refreshBtn = this.window.element.querySelector('#refresh-btn');
      const homeBtn = this.window.element.querySelector('#home-btn');
      const stopBtn = this.window.element.querySelector('#stop-btn');

      if (backBtn) {
        backBtn.addEventListener('click', () => {
          alert('Back - In a real browser, this would go to the previous page.');
        });
      }

      if (forwardBtn) {
        forwardBtn.addEventListener('click', () => {
          alert('Forward - In a real browser, this would go to the next page.');
        });
      }

      if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
          const statusText = this.window.element.querySelector('#status-text');
          if (statusText) {
            statusText.textContent = 'Refreshing...';
            setTimeout(() => {
              statusText.textContent = 'Done';
            }, 1000);
          }
        });
      }

      if (homeBtn) {
        homeBtn.addEventListener('click', () => {
          this.navigateTo('http://www.msn.com');
        });
      }

      if (stopBtn) {
        stopBtn.addEventListener('click', () => {
          const statusText = this.window.element.querySelector('#status-text');
          if (statusText) {
            statusText.textContent = 'Stopped';
          }
        });
      }

      // Address bar
      const addressInput = this.window.element.querySelector('#address-input');
      const goBtn = this.window.element.querySelector('#go-btn');

      if (addressInput && goBtn) {
        const navigate = () => {
          const url = addressInput.value;
          this.navigateTo(url);
        };

        goBtn.addEventListener('click', navigate);
        addressInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            navigate();
          }
        });
      }

      // Toolbar button hover effects
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
      const menuButtons = this.window.element.querySelectorAll('.ie-menu-btn');
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
          this.handleMenuClick(btn.textContent.trim());
        });
      });

      // Link buttons
      const linkButtons = this.window.element.querySelectorAll('.link-btn');
      linkButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.navigateTo('http://' + btn.textContent.toLowerCase().replace(/\s+/g, '') + '.com');
        });
      });
    }

    /**
     * Navigate to URL
     */
    navigateTo(url) {
      this.currentUrl = url;
      const addressInput = this.window.element.querySelector('#address-input');
      if (addressInput) {
        addressInput.value = url;
      }

      const statusText = this.window.element.querySelector('#status-text');
      if (statusText) {
        statusText.textContent = 'Loading...';
        setTimeout(() => {
          statusText.textContent = 'Done';
        }, 1000);
      }

      // Update window title
      const domain = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      this.window.setTitle(`${domain} - Microsoft Internet Explorer`);
    }

    /**
     * Handle menu click
     */
    handleMenuClick(menu) {
      switch(menu) {
        case 'File':
          alert('File menu - New, Open, Save, Print...');
          break;
        case 'Edit':
          alert('Edit menu - Cut, Copy, Paste, Find...');
          break;
        case 'View':
          alert('View menu - Toolbars, Status Bar, Text Size...');
          break;
        case 'Favorites':
          alert('Favorites menu - Add to Favorites, Organize Favorites...');
          break;
        case 'Tools':
          alert('Tools menu - Internet Options, Windows Update...');
          break;
        case 'Help':
          alert('Internet Explorer Help\n\nInternet Explorer 6\nRetroOS Museum Project');
          break;
      }
    }
  }

  // Export to global scope
  global.WinXPInternetExplorer = WinXPInternetExplorer;

})(typeof window !== 'undefined' ? window : global);
