/**
 * Mac OS System 7 Desktop
 * Main orchestrator for Mac OS System 7 desktop environment
 */

(function(global) {
  'use strict';

  /**
   * Mac OS System 7 Desktop
   * Initializes and manages the complete desktop environment
   */
  class MacOS7Desktop {
    constructor() {
      this.windowManager = null;
      this.windowAdapter = null;
      this.menuBar = null;
      this.desktop = null;
      this.initialized = false;
      this.trashEmpty = true;
    }

    /**
     * Initialize the Mac OS System 7 desktop
     */
    init() {
      if (this.initialized) return;

      console.log('Initializing Mac OS System 7...');

      // Initialize core systems
      this._initWindowManager();
      this._initMenuBar();
      this._initDesktop();
      this._setupDesktopIcons();
      this._attachGlobalListeners();

      this.initialized = true;
      console.log('Mac OS System 7 initialized successfully');
    }

    /**
     * Initialize window manager
     * @private
     */
    _initWindowManager() {
      this.windowManager = new WindowManager();
      this.windowManager.init('#windows-container');

      // Create Mac-specific window adapter
      this.windowAdapter = new MacOS7WindowAdapter(this.windowManager);

      console.log('Window manager initialized');
    }

    /**
     * Initialize menu bar
     * @private
     */
    _initMenuBar() {
      this.menuBar = new MacOS7MenuBar();
      this.menuBar.init('#macos7-menubar');

      console.log('Menu bar initialized');
    }

    /**
     * Initialize desktop
     * @private
     */
    _initDesktop() {
      this.desktop = new Desktop();
      this.desktop.init('#desktop-icons', {
        multiSelect: true,
        draggable: false,
        contextMenu: true
      });

      console.log('Desktop initialized');
    }

    /**
     * Setup desktop icons
     * @private
     */
    _setupDesktopIcons() {
      // Macintosh HD icon
      this.desktop.addIcon({
        id: 'macintosh-hd',
        label: 'Macintosh HD',
        icon: this._createHardDriveIcon(),
        onOpen: () => this._openMacintoshHD(),
        contextMenuItems: [
          { label: 'Open', action: () => this._openMacintoshHD() },
          { label: 'Get Info', action: () => this._showGetInfo('Macintosh HD') },
          { type: 'separator' },
          { label: 'Eject', disabled: true }
        ]
      });

      // Trash icon
      this.desktop.addIcon({
        id: 'trash',
        label: 'Trash',
        icon: this._createTrashIcon(this.trashEmpty),
        onOpen: () => this._openTrash(),
        contextMenuItems: [
          { label: 'Open', action: () => this._openTrash() },
          { label: 'Empty Trash', action: () => this._emptyTrash() },
          { type: 'separator' },
          { label: 'Get Info', action: () => this._showGetInfo('Trash') }
        ]
      });

      console.log('Desktop icons created');
    }

    /**
     * Create hard drive icon SVG
     * @private
     */
    _createHardDriveIcon() {
      return '<svg width="32" height="32" viewBox="0 0 32 32"><rect x="4" y="8" width="24" height="18" fill="#ffffff" stroke="#000" stroke-width="1.5"/><rect x="4" y="8" width="24" height="4" fill="#cccccc" stroke="#000" stroke-width="1.5"/><circle cx="26" cy="10" r="1.5" fill="#000"/><rect x="10" y="16" width="12" height="6" fill="#cccccc" stroke="#000" stroke-width="1"/></svg>';
    }

    /**
     * Create trash icon SVG
     * @param {boolean} empty - Is trash empty
     * @private
     */
    _createTrashIcon(empty = true) {
      if (empty) {
        return '<svg width="32" height="32" viewBox="0 0 32 32"><path d="M8 8 L8 28 L24 28 L24 8 Z" fill="#ffffff" stroke="#000" stroke-width="1.5"/><rect x="6" y="6" width="20" height="3" fill="#cccccc" stroke="#000" stroke-width="1.5"/><rect x="12" y="4" width="8" height="2" fill="#cccccc" stroke="#000" stroke-width="1"/><line x1="12" y1="12" x2="12" y2="24" stroke="#000" stroke-width="1"/><line x1="16" y1="12" x2="16" y2="24" stroke="#000" stroke-width="1"/><line x1="20" y1="12" x2="20" y2="24" stroke="#000" stroke-width="1"/></svg>';
      } else {
        return '<svg width="32" height="32" viewBox="0 0 32 32"><path d="M8 8 L8 28 L24 28 L24 8 Z" fill="#ffffff" stroke="#000" stroke-width="1.5"/><rect x="6" y="6" width="20" height="3" fill="#cccccc" stroke="#000" stroke-width="1.5"/><rect x="12" y="4" width="8" height="2" fill="#cccccc" stroke="#000" stroke-width="1"/><rect x="10" y="14" width="12" height="8" fill="#cccccc" stroke="#000" stroke-width="1"/></svg>';
      }
    }

    /**
     * Open Macintosh HD (Finder window)
     * @private
     */
    _openMacintoshHD() {
      if (typeof MacOS7Finder !== 'undefined') {
        const finder = new MacOS7Finder(this);
        finder.open();
      } else {
        console.warn('Finder not loaded');
      }
    }

    /**
     * Open Trash
     * @private
     */
    _openTrash() {
      const content = `
        <div class="icon-view">
          <p style="text-align: center; color: #888; padding: 40px;">
            ${this.trashEmpty ? 'The Trash is empty' : 'Items in Trash'}
          </p>
        </div>
      `;

      this.windowAdapter.createWindow({
        id: 'trash-window',
        title: 'Trash',
        content: content,
        width: 512,
        height: 342,
        resizable: true
      });
    }

    /**
     * Empty trash
     * @private
     */
    _emptyTrash() {
      if (this.trashEmpty) {
        alert('The Trash is already empty.');
        return;
      }

      if (confirm('Are you sure you want to permanently remove the items in the Trash?')) {
        this.trashEmpty = true;
        const trashIcon = this.desktop.getIcon('trash');
        if (trashIcon) {
          trashIcon.setIcon(this._createTrashIcon(true));
        }
        alert('The Trash has been emptied.');
      }
    }

    /**
     * Show Get Info dialog
     * @param {string} itemName - Item name
     * @private
     */
    _showGetInfo(itemName) {
      const content = `
        <div style="padding: 16px;">
          <h3 style="font-family: var(--mac7-chicago); margin: 0 0 12px 0;">${itemName}</h3>
          <div class="mac-group">
            <div class="mac-group-title">Info</div>
            <p style="margin: 4px 0;"><strong>Kind:</strong> ${itemName === 'Trash' ? 'System' : 'Disk'}</p>
            <p style="margin: 4px 0;"><strong>Size:</strong> ${itemName === 'Trash' ? '0 KB' : '2 GB'}</p>
            <p style="margin: 4px 0;"><strong>Where:</strong> Desktop</p>
            <p style="margin: 4px 0;"><strong>Created:</strong> Mon, Nov 10, 2025</p>
            <p style="margin: 4px 0;"><strong>Modified:</strong> Mon, Nov 10, 2025</p>
          </div>
          <div style="margin-top: 16px; text-align: right;">
            <button class="mac-button default" onclick="this.closest('.os-window').querySelector('.window-btn-close').click()">OK</button>
          </div>
        </div>
      `;

      this.windowAdapter.createWindow({
        id: 'getinfo-' + itemName.toLowerCase().replace(/\s+/g, '-'),
        title: itemName + ' Info',
        content: content,
        width: 320,
        height: 300,
        resizable: false
      });
    }

    /**
     * Attach global event listeners
     * @private
     */
    _attachGlobalListeners() {
      // Listen for menu actions
      document.addEventListener('macos7:menuaction', (e) => {
        const { action, app } = e.detail;
        this._handleMenuAction(action, app);
      });

      // Keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        // Command+N: New Folder (in Finder)
        if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
          e.preventDefault();
          this._handleMenuAction('newFolder', 'Finder');
        }

        // Command+W: Close active window
        if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
          e.preventDefault();
          if (this.windowManager.activeWindow) {
            this.windowManager.activeWindow.close();
          }
        }

        // Command+Q: Quit (close all windows)
        if ((e.metaKey || e.ctrlKey) && e.key === 'q') {
          e.preventDefault();
          this.windowManager.closeAll();
        }
      });
    }

    /**
     * Handle menu action
     * @param {string} action - Action name
     * @param {string} app - Application name
     * @private
     */
    _handleMenuAction(action, app) {
      console.log('Menu action:', action, 'for app:', app);

      switch (action) {
        case 'newFolder':
          alert('New Folder created (demo)');
          break;

        case 'close':
          if (this.windowManager.activeWindow) {
            this.windowManager.activeWindow.close();
          }
          break;

        case 'emptyTrash':
          this._emptyTrash();
          break;

        case 'getInfo':
          if (this.windowManager.activeWindow) {
            this._showGetInfo(this.windowManager.activeWindow.title);
          }
          break;

        case 'cleanUpDesktop':
          alert('Desktop cleaned up (demo)');
          break;

        case 'openControlPanels':
          if (typeof MacOS7ControlPanels !== 'undefined') {
            const controlPanels = new MacOS7ControlPanels(this);
            controlPanels.open();
          }
          break;

        default:
          console.log('Unhandled action:', action);
      }
    }

    /**
     * Create a simple application window (helper method for apps)
     * @param {Object} options - Window options
     * @returns {Window} Window instance
     */
    createAppWindow(options) {
      return this.windowAdapter.createWindow(options);
    }
  }

  // Export to global scope
  global.MacOS7Desktop = MacOS7Desktop;

})(typeof window !== 'undefined' ? window : global);
