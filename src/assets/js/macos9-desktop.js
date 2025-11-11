/**
 * Mac OS 9 Desktop
 * Main orchestrator for Mac OS 9 desktop environment
 */

(function(global) {
  'use strict';

  /**
   * Mac OS 9 Desktop
   * Initializes and manages the complete desktop environment
   */
  class MacOS9Desktop {
    constructor() {
      this.windowManager = null;
      this.windowSystem = null;
      this.menuBar = null;
      this.desktop = null;
      this.controlStrip = null;
      this.initialized = false;
      this.trashEmpty = true;
      this.iconLabels = {
        'macintosh-hd': 'none',
        'trash': 'none'
      };
    }

    /**
     * Initialize the Mac OS 9 desktop
     */
    init() {
      if (this.initialized) return;

      console.log('Initializing Mac OS 9...');

      // Initialize core systems
      this._initWindowManager();
      this._initMenuBar();
      this._initDesktop();
      this._initControlStrip();
      this._setupDesktopIcons();
      this._attachGlobalListeners();

      this.initialized = true;
      console.log('Mac OS 9 initialized successfully');
    }

    /**
     * Initialize window manager
     * @private
     */
    _initWindowManager() {
      this.windowManager = new WindowManager();
      this.windowManager.init('#windows-container');

      // Create Mac OS 9-specific window system
      this.windowSystem = new MacOS9WindowSystem(this.windowManager);

      console.log('Window manager initialized');
    }

    /**
     * Initialize menu bar
     * @private
     */
    _initMenuBar() {
      this.menuBar = new MacOS9MenuBar(this);
      this.menuBar.init('#macos9-menubar');

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
     * Initialize control strip
     * @private
     */
    _initControlStrip() {
      if (typeof MacOS9ControlStrip !== 'undefined') {
        this.controlStrip = new MacOS9ControlStrip(this);
        this.controlStrip.init('#macos9-control-strip');
        console.log('Control Strip initialized');
      }
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
          { label: 'Label', submenu: this._getLabelSubmenu('macintosh-hd') },
          { type: 'separator' },
          { label: 'Eject', disabled: true }
        ]
      });

      // Applications folder shortcut
      this.desktop.addIcon({
        id: 'applications',
        label: 'Applications',
        icon: this._createFolderIcon(),
        onOpen: () => this._showAlert('Applications folder (demo)'),
        contextMenuItems: [
          { label: 'Open', action: () => this._showAlert('Applications folder (demo)') },
          { label: 'Get Info', action: () => this._showGetInfo('Applications') }
        ]
      });

      // Documents folder shortcut
      this.desktop.addIcon({
        id: 'documents',
        label: 'Documents',
        icon: this._createFolderIcon(),
        onOpen: () => this._showAlert('Documents folder (demo)'),
        contextMenuItems: [
          { label: 'Open', action: () => this._showAlert('Documents folder (demo)') },
          { label: 'Get Info', action: () => this._showGetInfo('Documents') }
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
     * Get label color submenu
     * @param {string} iconId - Icon ID
     * @private
     */
    _getLabelSubmenu(iconId) {
      const colors = [
        { label: 'None', color: 'none' },
        { label: 'Essential', color: '#FF0000' },
        { label: 'Hot', color: '#FF6600' },
        { label: 'In Progress', color: '#FFCC00' },
        { label: 'Cool', color: '#00CC00' },
        { label: 'Personal', color: '#0066FF' },
        { label: 'Project 1', color: '#9966FF' },
        { label: 'Project 2', color: '#999999' }
      ];

      return colors.map(c => ({
        label: c.label,
        action: () => this._setIconLabel(iconId, c.color)
      }));
    }

    /**
     * Set icon label color
     * @param {string} iconId - Icon ID
     * @param {string} color - Label color
     * @private
     */
    _setIconLabel(iconId, color) {
      this.iconLabels[iconId] = color;
      const icon = this.desktop.getIcon(iconId);
      if (icon && icon.element) {
        const label = icon.element.querySelector('.desktop-icon-label');
        if (label) {
          if (color === 'none') {
            label.style.backgroundColor = 'transparent';
          } else {
            label.style.backgroundColor = color;
          }
        }
      }
    }

    /**
     * Create hard drive icon SVG
     * @private
     */
    _createHardDriveIcon() {
      return '<svg width="48" height="48" viewBox="0 0 48 48"><defs><linearGradient id="hdGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#EEEEEE;stop-opacity:1" /><stop offset="100%" style="stop-color:#CCCCCC;stop-opacity:1" /></linearGradient></defs><rect x="6" y="12" width="36" height="28" rx="2" fill="url(#hdGrad)" stroke="#000" stroke-width="2"/><rect x="6" y="12" width="36" height="6" fill="#DDDDDD" stroke="#000" stroke-width="2"/><circle cx="38" cy="15" r="2" fill="#00AA00"/><rect x="14" y="24" width="20" height="10" rx="1" fill="#999999" stroke="#000" stroke-width="1"/><rect x="18" y="28" width="12" height="2" fill="#666666"/></svg>';
    }

    /**
     * Create folder icon SVG
     * @private
     */
    _createFolderIcon() {
      return '<svg width="48" height="48" viewBox="0 0 48 48"><defs><linearGradient id="folderGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#6699FF;stop-opacity:1" /><stop offset="100%" style="stop-color:#3366CC;stop-opacity:1" /></linearGradient></defs><path d="M6 14 L6 38 C6 40 8 42 10 42 L38 42 C40 42 42 40 42 38 L42 18 C42 16 40 14 38 14 L24 14 L20 10 L10 10 C8 10 6 12 6 14 Z" fill="url(#folderGrad)" stroke="#000" stroke-width="2"/><path d="M6 14 L6 18 L42 18 L42 14 L24 14 L20 10 L10 10 C8 10 6 12 6 14 Z" fill="#4477DD" stroke="#000" stroke-width="2"/></svg>';
    }

    /**
     * Create trash icon SVG
     * @param {boolean} empty - Is trash empty
     * @private
     */
    _createTrashIcon(empty = true) {
      if (empty) {
        return '<svg width="48" height="48" viewBox="0 0 48 48"><defs><linearGradient id="trashGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:1" /><stop offset="100%" style="stop-color:#DDDDDD;stop-opacity:1" /></linearGradient></defs><path d="M12 12 L12 42 L36 42 L36 12 Z" fill="url(#trashGrad)" stroke="#000" stroke-width="2"/><rect x="10" y="10" width="28" height="4" rx="1" fill="#CCCCCC" stroke="#000" stroke-width="2"/><rect x="18" y="6" width="12" height="4" rx="1" fill="#CCCCCC" stroke="#000" stroke-width="1.5"/><line x1="18" y1="18" x2="18" y2="36" stroke="#000" stroke-width="1.5"/><line x1="24" y1="18" x2="24" y2="36" stroke="#000" stroke-width="1.5"/><line x1="30" y1="18" x2="30" y2="36" stroke="#000" stroke-width="1.5"/></svg>';
      } else {
        return '<svg width="48" height="48" viewBox="0 0 48 48"><defs><linearGradient id="trashFullGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:1" /><stop offset="100%" style="stop-color:#DDDDDD;stop-opacity:1" /></linearGradient></defs><path d="M12 12 L12 42 L36 42 L36 12 Z" fill="url(#trashFullGrad)" stroke="#000" stroke-width="2"/><rect x="10" y="10" width="28" height="4" rx="1" fill="#CCCCCC" stroke="#000" stroke-width="2"/><rect x="18" y="6" width="12" height="4" rx="1" fill="#CCCCCC" stroke="#000" stroke-width="1.5"/><rect x="16" y="20" width="16" height="14" rx="2" fill="#AAAAAA" stroke="#000" stroke-width="1"/></svg>';
      }
    }

    /**
     * Open Macintosh HD (Finder window)
     * @private
     */
    _openMacintoshHD() {
      if (typeof MacOS9Finder !== 'undefined') {
        const finder = new MacOS9Finder(this);
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
      const emptyMessage = 'The Trash is empty';
      const fullMessage = 'Items in Trash';
      const message = this.trashEmpty ? emptyMessage : fullMessage;
      
      const content = '<div class="icon-view"><p style="text-align: center; color: #888; padding: 60px 20px; font-family: var(--mac9-geneva);">' + message + '</p></div>';

      this.windowSystem.createWindow({
        id: 'trash-window',
        title: 'Trash',
        content: content,
        width: 540,
        height: 380,
        resizable: true
      });
    }

    /**
     * Empty trash
     * @private
     */
    _emptyTrash() {
      if (this.trashEmpty) {
        this._showAlert('The Trash is already empty.');
        return;
      }

      if (confirm('Are you sure you want to permanently remove the items in the Trash?')) {
        this.trashEmpty = true;
        const trashIcon = this.desktop.getIcon('trash');
        if (trashIcon) {
          trashIcon.setIcon(this._createTrashIcon(true));
        }
        this._showAlert('The Trash has been emptied.');
      }
    }

    /**
     * Show Get Info dialog
     * @param {string} itemName - Item name
     * @private
     */
    _showGetInfo(itemName) {
      const kind = itemName === 'Trash' ? 'System folder' : 'Volume';
      const size = itemName === 'Trash' ? '0 KB' : '4.2 GB (4,294,967,296 bytes)';
      
      const content = '<div style="padding: 20px;"><h3 style="font-family: var(--mac9-charcoal); margin: 0 0 16px 0;">' + itemName + '</h3><div class="mac9-group"><div class="mac9-group-title">General Information</div><p style="margin: 6px 0;"><strong>Kind:</strong> ' + kind + '</p><p style="margin: 6px 0;"><strong>Size:</strong> ' + size + '</p><p style="margin: 6px 0;"><strong>Where:</strong> Desktop</p><p style="margin: 6px 0;"><strong>Created:</strong> Monday, November 11, 2025, 12:00 PM</p><p style="margin: 6px 0;"><strong>Modified:</strong> Monday, November 11, 2025, 12:00 PM</p></div><div style="margin-top: 20px; text-align: right;"><button class="mac9-button default" onclick="this.closest(\'.os-window\').querySelector(\'.window-btn-close\').click()">OK</button></div></div>';

      this.windowSystem.createWindow({
        id: 'getinfo-' + itemName.toLowerCase().replace(/\s+/g, '-'),
        title: itemName + ' Info',
        content: content,
        width: 360,
        height: 340,
        resizable: false
      });
    }

    /**
     * Show alert dialog
     * @param {string} message - Alert message
     * @private
     */
    _showAlert(message) {
      const content = '<div style="padding: 24px; text-align: center;"><p style="font-family: var(--mac9-charcoal); font-size: 13px; margin: 0 0 20px 0;">' + message + '</p><button class="mac9-button default" onclick="this.closest(\'.os-window\').querySelector(\'.window-btn-close\').click()">OK</button></div>';

      this.windowSystem.createWindow({
        id: 'alert-' + Date.now(),
        title: 'Mac OS 9',
        content: content,
        width: 320,
        height: 140,
        resizable: false
      });
    }

    /**
     * Attach global event listeners
     * @private
     */
    _attachGlobalListeners() {
      // Listen for menu actions
      document.addEventListener('macos9:menuaction', (e) => {
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

        // Command+I: Get Info
        if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
          e.preventDefault();
          if (this.windowManager.activeWindow) {
            this._showGetInfo(this.windowManager.activeWindow.title);
          }
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
        case 'about':
          this._showAboutBox();
          break;

        case 'newFolder':
          this._showAlert('New Folder created (demo)');
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

        case 'openControlPanels':
          if (typeof MacOS9ControlPanels !== 'undefined') {
            const controlPanels = new MacOS9ControlPanels(this);
            controlPanels.open();
          }
          break;

        case 'openSherlock':
          if (typeof MacOS9Sherlock !== 'undefined') {
            const sherlock = new MacOS9Sherlock(this);
            sherlock.open();
          }
          break;

        case 'openSystemProfiler':
          if (typeof MacOS9SystemProfiler !== 'undefined') {
            const profiler = new MacOS9SystemProfiler(this);
            profiler.open();
          }
          break;

        case 'openSimpleText':
          if (typeof MacOS9SimpleText !== 'undefined') {
            const simpleText = new MacOS9SimpleText(this);
            simpleText.open();
          }
          break;

        case 'openDVDPlayer':
          if (typeof MacOS9AppleDVDPlayer !== 'undefined') {
            const dvdPlayer = new MacOS9AppleDVDPlayer(this);
            dvdPlayer.open();
          }
          break;

        case 'openGraphingCalc':
          if (typeof MacOS9GraphingCalc !== 'undefined') {
            const graphingCalc = new MacOS9GraphingCalc(this);
            graphingCalc.open();
          }
          break;

        case 'openQuickTime':
          if (typeof MacOS9QuickTime !== 'undefined') {
            const quickTime = new MacOS9QuickTime(this);
            quickTime.open();
          }
          break;

        case 'openAppleScript':
          if (typeof MacOS9AppleScript !== 'undefined') {
            const appleScript = new MacOS9AppleScript(this);
            appleScript.open();
          }
          break;

        case 'openKeychain':
          if (typeof MacOS9Keychain !== 'undefined') {
            const keychain = new MacOS9Keychain(this);
            keychain.open();
          }
          break;

        case 'restart':
          if (confirm('Are you sure you want to restart your computer now?')) {
            this._showAlert('Restarting... (demo mode)');
          }
          break;

        case 'shutdown':
          if (confirm('Are you sure you want to shut down your computer now?')) {
            this._showAlert('Shutting down... (demo mode)');
          }
          break;

        default:
          console.log('Unhandled action:', action);
      }
    }

    /**
     * Show About This Mac dialog
     * @private
     */
    _showAboutBox() {
      const content = '<div class="about-dialog"><div class="mac-icon"><svg width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#3366FF" stroke="#000" stroke-width="2"/><text x="32" y="42" font-family="Arial" font-size="36" font-weight="bold" fill="#FFFFFF" text-anchor="middle">9</text></svg></div><h2>Mac OS 9.2.2</h2><p style="font-weight: bold;">The Best Internet Operating System Ever</p><div class="version-info"><p style="margin: 4px 0;"><strong>Version:</strong> 9.2.2</p><p style="margin: 4px 0;"><strong>Built-in Memory:</strong> 256 MB</p><p style="margin: 4px 0;"><strong>Virtual Memory:</strong> 257 MB</p><p style="margin: 4px 0;"><strong>Largest Unused Block:</strong> 234 MB</p></div><p style="margin-top: 16px; font-size: 10px; color: #666;">&copy; Apple Computer, Inc. 1983-2001<br>All Rights Reserved</p><div style="margin-top: 20px;"><button class="mac9-button default" onclick="this.closest(\'.os-window\').querySelector(\'.window-btn-close\').click()">OK</button></div></div>';

      this.windowSystem.createWindow({
        id: 'about-macos9',
        title: 'About This Computer',
        content: content,
        width: 420,
        height: 480,
        resizable: false
      });
    }

    /**
     * Create a simple application window (helper method for apps)
     * @param {Object} options - Window options
     * @returns {Window} Window instance
     */
    createAppWindow(options) {
      return this.windowSystem.createWindow(options);
    }
  }

  // Export to global scope
  global.MacOS9Desktop = MacOS9Desktop;

})(typeof window !== 'undefined' ? window : global);
