/**
 * BeOS NetPositive
 * The BeOS web browser - fast, simple, and efficient
 * Showcases BeOS networking capabilities
 */

(function(global) {
  'use strict';

  /**
   * BeOS NetPositive Application
   */
  class BeOSNetPositive {
    constructor(desktop, initialUrl = 'http://www.be.com') {
      this.desktop = desktop;
      this.currentUrl = initialUrl;
      this.window = null;
      this.windowId = null;
      this.history = [initialUrl];
      this.historyIndex = 0;
    }

    /**
     * Launch NetPositive
     */
    launch() {
      const content = this._createContent();

      this.windowId = `netpositive-${Date.now()}`;
      this.window = this.desktop.windowSystem.createWindow({
        id: this.windowId,
        title: 'NetPositive',
        width: 700,
        height: 550,
        content: content,
        resizable: true,
        tabPosition: 'top',
        menuItems: [
          { label: 'File', onClick: () => {} },
          { label: 'Edit', onClick: () => {} },
          { label: 'View', onClick: () => {} },
          { label: 'Go', onClick: () => {} },
          { label: 'Bookmarks', onClick: () => {} }
        ],
        onClose: () => this._cleanup()
      });

      // Add to workspace
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

      // Load initial page
      this._loadPage();
    }

    /**
     * Create NetPositive content
     * @private
     */
    _createContent() {
      return `
        <div class="netpositive-window" style="display: flex; flex-direction: column; height: 100%;">
          <!-- Navigation Toolbar -->
          <div class="beos-toolbar">
            <button class="beos-toolbar-button" data-action="back" title="Back">◀</button>
            <button class="beos-toolbar-button" data-action="forward" title="Forward">▶</button>
            <button class="beos-toolbar-button" data-action="stop" title="Stop">⊠</button>
            <button class="beos-toolbar-button" data-action="reload" title="Reload">↻</button>
            <button class="beos-toolbar-button" data-action="home" title="Home">⌂</button>
            <div class="beos-toolbar-separator"></div>
            <input type="text" class="beos-input" id="url-bar" value="${this.currentUrl}" style="flex: 1; margin: 0 4px;" placeholder="Enter URL...">
            <button class="beos-button" data-action="go" style="height: 22px; padding: 2px 12px; font-size: 10px;">Go</button>
          </div>

          <!-- Bookmarks Bar -->
          <div style="display: flex; gap: 2px; padding: 4px; background: #DCDCDC; border-bottom: 1px solid #808080; font-size: 10px;">
            <button class="beos-button" style="padding: 2px 8px; font-size: 9px;" data-bookmark="be.com">Be Inc.</button>
            <button class="beos-button" style="padding: 2px 8px; font-size: 9px;" data-bookmark="bebits.com">BeBits</button>
            <button class="beos-button" style="padding: 2px 8px; font-size: 9px;" data-bookmark="beware.org">BeWare</button>
            <button class="beos-button" style="padding: 2px 8px; font-size: 9px;" data-bookmark="beos.org">BeOS.org</button>
          </div>

          <!-- Content Area -->
          <div id="browser-content" style="flex: 1; overflow: auto; background: #FFF; padding: 16px;">
            <!-- Page content will be rendered here -->
          </div>

          <!-- Status Bar -->
          <div class="beos-statusbar">
            <span id="browser-status">Ready</span>
            <span style="margin-left: auto;" id="page-info"></span>
          </div>
        </div>
      `;
    }

    /**
     * Setup event handlers
     * @private
     */
    _setupEventHandlers() {
      const toolbar = this.window.querySelector('.beos-toolbar');
      if (toolbar) {
        toolbar.addEventListener('click', (e) => {
          const button = e.target.closest('[data-action]');
          if (!button) return;

          const action = button.dataset.action;
          switch (action) {
            case 'back':
              this._goBack();
              break;
            case 'forward':
              this._goForward();
              break;
            case 'stop':
              this._stopLoading();
              break;
            case 'reload':
              this._reload();
              break;
            case 'home':
              this._goHome();
              break;
            case 'go':
              this._navigate();
              break;
          }
        });
      }

      // URL bar enter key
      const urlBar = this.window.querySelector('#url-bar');
      if (urlBar) {
        urlBar.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            this._navigate();
          }
        });
      }

      // Bookmarks
      const bookmarks = this.window.querySelectorAll('[data-bookmark]');
      bookmarks.forEach(bookmark => {
        bookmark.addEventListener('click', () => {
          const url = `http://www.${bookmark.dataset.bookmark}`;
          this._navigateTo(url);
        });
      });
    }

    /**
     * Navigate to URL in bar
     * @private
     */
    _navigate() {
      const urlBar = this.window.querySelector('#url-bar');
      if (urlBar) {
        const url = urlBar.value;
        this._navigateTo(url);
      }
    }

    /**
     * Navigate to specific URL
     * @private
     */
    _navigateTo(url) {
      this.currentUrl = url;

      // Add to history
      if (this.historyIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.historyIndex + 1);
      }
      this.history.push(url);
      this.historyIndex = this.history.length - 1;

      // Update URL bar
      const urlBar = this.window.querySelector('#url-bar');
      if (urlBar) {
        urlBar.value = url;
      }

      this._loadPage();
    }

    /**
     * Load page
     * @private
     */
    _loadPage() {
      const content = this.window.querySelector('#browser-content');
      const status = this.window.querySelector('#browser-status');

      if (status) {
        status.textContent = 'Loading...';
      }

      // Simulate loading
      setTimeout(() => {
        if (content) {
          content.innerHTML = this._getPageContent();
        }

        if (status) {
          status.textContent = 'Done';
        }

        const pageInfo = this.window.querySelector('#page-info');
        if (pageInfo) {
          pageInfo.textContent = this.currentUrl;
        }

        // Update title
        const titleEl = this.window.querySelector('.beos-window-tab-title');
        if (titleEl) {
          titleEl.textContent = `NetPositive - ${this._getPageTitle()}`;
        }
      }, 500);
    }

    /**
     * Get page content
     * @private
     */
    _getPageContent() {
      if (this.currentUrl.includes('be.com')) {
        return `
          <div style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 48px; color: #336699; font-weight: bold; margin-bottom: 20px;">Be Inc.</div>
            <div style="font-size: 14px; color: #666; margin-bottom: 30px;">The BeOS Operating System</div>
            <div style="text-align: left; max-width: 600px; margin: 0 auto; line-height: 1.6;">
              <h2 style="color: #336699; font-size: 16px; margin-top: 20px;">Welcome to BeOS</h2>
              <p style="font-size: 11px;">BeOS is the multimedia operating system designed from the ground up
              for digital media creation, manipulation and delivery.</p>

              <h3 style="color: #336699; font-size: 14px; margin-top: 20px;">Features</h3>
              <ul style="font-size: 11px;">
                <li>Pervasive multithreading</li>
                <li>Symmetric multiprocessing</li>
                <li>64-bit journaling file system</li>
                <li>Database-like file attributes</li>
                <li>Powerful media kit</li>
              </ul>

              <p style="font-size: 11px; margin-top: 20px;">
                <a href="#" style="color: #336699;">Download BeOS R5</a> |
                <a href="#" style="color: #336699;">Developer Zone</a> |
                <a href="#" style="color: #336699;">Support</a>
              </p>
            </div>
          </div>
        `;
      } else if (this.currentUrl.includes('bebits.com')) {
        return `
          <div style="padding: 20px;">
            <h1 style="color: #336699; font-size: 20px;">BeBits - Software for BeOS</h1>
            <p style="font-size: 11px; margin: 10px 0;">Your source for BeOS applications and utilities.</p>
            <div style="margin-top: 20px;">
              <div style="padding: 10px; border: 1px solid #CCC; margin-bottom: 10px;">
                <div style="font-weight: bold; font-size: 11px;">NetPositive Enhancement Pack</div>
                <div style="font-size: 10px; color: #666;">Plugins and themes for NetPositive</div>
              </div>
              <div style="padding: 10px; border: 1px solid #CCC; margin-bottom: 10px;">
                <div style="font-weight: bold; font-size: 11px;">MediaPlayer Codecs</div>
                <div style="font-size: 10px; color: #666;">Additional codec support</div>
              </div>
            </div>
          </div>
        `;
      } else {
        return `
          <div style="text-align: center; padding: 60px 20px;">
            <div style="font-size: 48px; margin-bottom: 20px;">🌐</div>
            <h2 style="font-size: 18px; color: #336699; margin-bottom: 10px;">NetPositive Browser</h2>
            <p style="font-size: 11px; color: #666;">Enter a URL to browse the web</p>
            <p style="font-size: 10px; color: #999; margin-top: 20px;">This is a simulated browser interface</p>
          </div>
        `;
      }
    }

    /**
     * Get page title
     * @private
     */
    _getPageTitle() {
      if (this.currentUrl.includes('be.com')) return 'Be Inc.';
      if (this.currentUrl.includes('bebits.com')) return 'BeBits';
      if (this.currentUrl.includes('beware.org')) return 'BeWare';
      if (this.currentUrl.includes('beos.org')) return 'BeOS.org';
      return 'NetPositive';
    }

    /**
     * Go back
     * @private
     */
    _goBack() {
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.currentUrl = this.history[this.historyIndex];
        const urlBar = this.window.querySelector('#url-bar');
        if (urlBar) {
          urlBar.value = this.currentUrl;
        }
        this._loadPage();
      }
    }

    /**
     * Go forward
     * @private
     */
    _goForward() {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.currentUrl = this.history[this.historyIndex];
        const urlBar = this.window.querySelector('#url-bar');
        if (urlBar) {
          urlBar.value = this.currentUrl;
        }
        this._loadPage();
      }
    }

    /**
     * Stop loading
     * @private
     */
    _stopLoading() {
      const status = this.window.querySelector('#browser-status');
      if (status) {
        status.textContent = 'Stopped';
      }
    }

    /**
     * Reload page
     * @private
     */
    _reload() {
      this._loadPage();
    }

    /**
     * Go home
     * @private
     */
    _goHome() {
      this._navigateTo('http://www.be.com');
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
  global.BeOSNetPositive = BeOSNetPositive;

})(window);
