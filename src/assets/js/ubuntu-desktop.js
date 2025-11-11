/**
 * Ubuntu 4.10 Warty Warthog Desktop
 * Main desktop initialization and management for the Human theme
 */

(function(global) {
  'use strict';

  class UbuntuDesktop {
    constructor() {
      this.windowManager = null;
      this.menuSystem = null;
      this.desktop = null;
      this.panels = null;
      this.workspaceSwitcher = null;
      this.initialized = false;
      this.currentWorkspace = 1;
      this.workspaces = {
        1: new Set(),
        2: new Set(),
        3: new Set(),
        4: new Set()
      };
    }

    /**
     * Initialize Ubuntu desktop
     */
    init() {
      if (this.initialized) return;

      console.log('Initializing Ubuntu 4.10 Warty Warthog Desktop...');

      // Initialize core systems
      this.initWindowManager();
      this.initMenuSystem();
      this.initDesktop();
      this.initPanels();
      this.initWorkspaceSwitcher();
      this.initClock();

      // Set up desktop icons
      this.setupDesktopIcons();

      // Add welcome message
      this.showWelcomeMessage();

      this.initialized = true;
      console.log('Ubuntu Desktop initialized successfully');
    }

    /**
     * Initialize window manager
     */
    initWindowManager() {
      this.windowManager = new WindowManager();
      this.windowManager.init('#windows-container');
      global.ubuntuWindowManager = this.windowManager;
    }

    /**
     * Initialize menu system
     */
    initMenuSystem() {
      this.menuSystem = new MenuSystem();
      this.menuSystem.init('#ubuntu-top-panel');
      global.ubuntuMenuSystem = this.menuSystem;
    }

    /**
     * Initialize desktop
     */
    initDesktop() {
      this.desktop = new Desktop();
      this.desktop.init('#desktop-icons', {
        multiSelect: true,
        draggable: false,
        contextMenu: true,
        contextMenuItems: this.getDesktopContextMenu()
      });
      global.ubuntuDesktop = this.desktop;
    }

    /**
     * Initialize panels
     */
    initPanels() {
      if (typeof UbuntuPanels !== 'undefined') {
        this.panels = new UbuntuPanels(this);
        this.panels.init();
      }
    }

    /**
     * Initialize workspace switcher
     */
    initWorkspaceSwitcher() {
      if (typeof UbuntuWorkspaceSwitcher !== 'undefined') {
        this.workspaceSwitcher = new UbuntuWorkspaceSwitcher(this);
        this.workspaceSwitcher.init();
      }
    }

    /**
     * Initialize clock
     */
    initClock() {
      const updateClock = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = minutes < 10 ? '0' + minutes : minutes;

        const timeString = `${displayHours}:${displayMinutes} ${ampm}`;
        const clockElement = document.getElementById('panel-clock-time');
        if (clockElement) {
          clockElement.textContent = timeString;
        }
      };

      updateClock();
      setInterval(updateClock, 1000);
    }

    /**
     * Set up desktop icons
     */
    setupDesktopIcons() {
      // Computer icon
      this.desktop.addIcon({
        id: 'computer',
        label: 'Computer',
        icon: this.createIcon('computer'),
        x: 0,
        y: 0,
        onOpen: () => {
          this.openNautilus('/');
        }
      });

      // Home folder icon
      this.desktop.addIcon({
        id: 'home',
        label: "user's Home",
        icon: this.createIcon('home'),
        x: 0,
        y: 1,
        onOpen: () => {
          this.openNautilus('/home/user');
        }
      });

      // Trash icon
      this.desktop.addIcon({
        id: 'trash',
        label: 'Trash',
        icon: this.createIcon('trash'),
        x: 0,
        y: 2,
        onOpen: () => {
          this.openNautilus('/home/user/.Trash');
        }
      });
    }

    /**
     * Create Tango-style icon SVG
     */
    createIcon(type) {
      const icons = {
        computer: `
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="8" y="12" width="32" height="22" fill="#808080" rx="2"/>
            <rect x="10" y="14" width="28" height="18" fill="#4A90E2" rx="1"/>
            <rect x="18" y="34" width="12" height="3" fill="#666666"/>
            <rect x="12" y="37" width="24" height="2" fill="#808080" rx="1"/>
          </svg>
        `,
        home: `
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M24 8L8 22v18h12V30h8v10h12V22L24 8z" fill="#F07746"/>
            <path d="M24 8L8 22v2l16-14 16 14v-2L24 8z" fill="#DD4814"/>
            <rect x="20" y="30" width="8" height="10" fill="#8B4513"/>
          </svg>
        `,
        trash: `
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M16 10h16v4H16v-4z" fill="#808080"/>
            <path d="M12 14h24l-2 26H14l-2-26z" fill="#E9E7E3"/>
            <path d="M12 14h24v2H12v-2z" fill="#666666"/>
            <rect x="18" y="18" width="2" height="18" fill="#999999"/>
            <rect x="23" y="18" width="2" height="18" fill="#999999"/>
            <rect x="28" y="18" width="2" height="18" fill="#999999"/>
          </svg>
        `,
        folder: `
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M8 12h12l4 4h16v20H8V12z" fill="#F07746"/>
            <path d="M8 12h12l4 4h16v4H8V12z" fill="#DD4814"/>
          </svg>
        `,
        document: `
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M14 8h14l6 6v26H14V8z" fill="white"/>
            <path d="M28 8v6h6l-6-6z" fill="#E0E0E0"/>
            <rect x="18" y="18" width="12" height="2" fill="#CCCCCC"/>
            <rect x="18" y="22" width="12" height="2" fill="#CCCCCC"/>
            <rect x="18" y="26" width="8" height="2" fill="#CCCCCC"/>
          </svg>
        `
      };

      return icons[type] || icons.document;
    }

    /**
     * Get desktop context menu items
     */
    getDesktopContextMenu() {
      return [
        {
          label: 'Create Folder',
          action: () => {
            console.log('Create folder');
          }
        },
        {
          label: 'Create Document',
          action: () => {
            console.log('Create document');
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Paste',
          disabled: true,
          action: () => {
            console.log('Paste');
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Change Desktop Background',
          action: () => {
            alert('Desktop background settings would open here');
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Clean Up by Name',
          action: () => {
            console.log('Clean up icons by name');
          }
        }
      ];
    }

    /**
     * Open Nautilus file manager
     */
    openNautilus(path = '/home/user') {
      if (typeof UbuntuNautilus !== 'undefined') {
        const nautilus = new UbuntuNautilus(this.windowManager);
        nautilus.open(path);
      }
    }

    /**
     * Open gedit text editor
     */
    openGedit(filename = null, content = '') {
      if (typeof UbuntuGedit !== 'undefined') {
        const gedit = new UbuntuGedit(this.windowManager);
        gedit.open(filename, content);
      }
    }

    /**
     * Open GNOME Terminal
     */
    openTerminal() {
      if (typeof UbuntuTerminal !== 'undefined') {
        const terminal = new UbuntuTerminal(this.windowManager);
        terminal.open();
      }
    }

    /**
     * Open Firefox browser
     */
    openFirefox(url = 'about:blank') {
      if (typeof UbuntuFirefox !== 'undefined') {
        const firefox = new UbuntuFirefox(this.windowManager);
        firefox.open(url);
      }
    }

    /**
     * Open Synaptic Package Manager
     */
    openSynaptic() {
      if (typeof UbuntuSynaptic !== 'undefined') {
        const synaptic = new UbuntuSynaptic(this.windowManager);
        synaptic.open();
      }
    }

    /**
     * Open System Monitor
     */
    openSystemMonitor() {
      if (typeof UbuntuSystemMonitor !== 'undefined') {
        const monitor = new UbuntuSystemMonitor(this.windowManager);
        monitor.open();
      }
    }

    /**
     * Open Evolution Email Client
     */
    openEvolution() {
      if (typeof UbuntuEvolution !== 'undefined') {
        const evolution = new UbuntuEvolution(this.windowManager);
        evolution.open();
      }
    }

    /**
     * Open Rhythmbox Music Player
     */
    openRhythmbox() {
      if (typeof UbuntuRhythmbox !== 'undefined') {
        const rhythmbox = new UbuntuRhythmbox(this.windowManager);
        rhythmbox.open();
      }
    }

    /**
     * Open GIMP Image Editor
     */
    openGimp() {
      if (typeof UbuntuGimp !== 'undefined') {
        const gimp = new UbuntuGimp(this.windowManager);
        gimp.open();
      }
    }

    /**
     * Open Totem Movie Player
     */
    openTotem() {
      if (typeof UbuntuTotem !== 'undefined') {
        const totem = new UbuntuTotem(this.windowManager);
        totem.open();
      }
    }

    /**
     * Open Update Manager
     */
    openUpdateManager() {
      if (typeof UbuntuUpdateManager !== 'undefined') {
        const updateManager = new UbuntuUpdateManager(this.windowManager);
        updateManager.open();
      }
    }

    /**
     * Open Software Center (Add/Remove Programs)
     */
    openSoftwareCenter() {
      if (typeof UbuntuSoftwareCenter !== 'undefined') {
        const softwareCenter = new UbuntuSoftwareCenter(this.windowManager);
        softwareCenter.open();
      }
    }

    /**
     * Show welcome message
     */
    showWelcomeMessage() {
      setTimeout(() => {
        const welcomeWindow = this.windowManager.createWindow({
          id: 'welcome-ubuntu',
          title: 'Welcome to Ubuntu 4.10',
          width: 480,
          height: 360,
          x: (window.innerWidth - 480) / 2,
          y: (window.innerHeight - 360) / 2,
          resizable: true,
          content: `
            <div style="padding: 20px; font-family: 'Ubuntu Sans', sans-serif;">
              <div style="text-align: center; margin-bottom: 20px;">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="30" fill="#F07746"/>
                  <circle cx="32" cy="32" r="8" fill="white"/>
                  <circle cx="32" cy="8" r="6" fill="white"/>
                  <circle cx="53" cy="44" r="6" fill="white"/>
                  <circle cx="11" cy="44" r="6" fill="white"/>
                </svg>
              </div>
              <h2 style="color: #DD4814; text-align: center; margin: 0 0 16px 0;">
                Ubuntu 4.10 "Warty Warthog"
              </h2>
              <p style="line-height: 1.6; margin-bottom: 16px;">
                Welcome to <strong>Ubuntu</strong> - Linux for human beings!
              </p>
              <p style="line-height: 1.6; margin-bottom: 16px;">
                This is the first Ubuntu release, featuring:
              </p>
              <ul style="line-height: 1.8; margin-bottom: 16px; padding-left: 24px;">
                <li>The revolutionary <strong>Human theme</strong> with warm brown and orange colors</li>
                <li><strong>GNOME 2.8</strong> desktop environment</li>
                <li><strong>Firefox 0.9</strong> web browser</li>
                <li><strong>OpenOffice.org</strong> office suite</li>
                <li><strong>Easy software installation</strong> with Synaptic</li>
              </ul>
              <p style="line-height: 1.6; margin-bottom: 16px; font-style: italic; color: #666;">
                "Ubuntu" is an ancient African word meaning "humanity to others"
              </p>
              <div style="text-align: center; margin-top: 24px;">
                <button onclick="window.ubuntuWindowManager.closeWindow('welcome-ubuntu')"
                        style="padding: 8px 24px; background: #F07746; color: white; border: none;
                               border-radius: 3px; font-size: 11pt; cursor: pointer; font-weight: 500;">
                  Get Started
                </button>
              </div>
            </div>
          `
        });
      }, 500);
    }

    /**
     * Switch workspace
     */
    switchWorkspace(workspaceNum) {
      if (workspaceNum < 1 || workspaceNum > 4) return;
      if (workspaceNum === this.currentWorkspace) return;

      // Hide windows in current workspace
      const currentWindows = this.workspaces[this.currentWorkspace];
      currentWindows.forEach(windowId => {
        const win = this.windowManager.getWindow(windowId);
        if (win && !win.isMinimized) {
          win.element.style.display = 'none';
        }
      });

      // Show windows in new workspace
      const newWindows = this.workspaces[workspaceNum];
      newWindows.forEach(windowId => {
        const win = this.windowManager.getWindow(windowId);
        if (win && !win.isMinimized) {
          win.element.style.display = 'flex';
        }
      });

      this.currentWorkspace = workspaceNum;

      // Update workspace switcher UI
      if (this.workspaceSwitcher) {
        this.workspaceSwitcher.updateActive(workspaceNum);
      }
    }

    /**
     * Add window to current workspace
     */
    addWindowToWorkspace(windowId) {
      this.workspaces[this.currentWorkspace].add(windowId);
    }

    /**
     * Remove window from all workspaces
     */
    removeWindowFromWorkspaces(windowId) {
      Object.values(this.workspaces).forEach(workspace => {
        workspace.delete(windowId);
      });
    }

    /**
     * Show desktop (minimize all windows)
     */
    showDesktop() {
      const windows = this.windowManager.getAllWindows();
      windows.forEach(win => {
        if (!win.isMinimized) {
          win.minimize();
        }
      });
    }

    /**
     * About Ubuntu
     */
    showAboutDialog() {
      const aboutWindow = this.windowManager.createWindow({
        id: 'about-ubuntu',
        title: 'About Ubuntu',
        width: 400,
        height: 320,
        resizable: false,
        content: `
          <div style="padding: 24px; text-align: center; font-family: 'Ubuntu Sans', sans-serif;">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style="margin-bottom: 16px;">
              <circle cx="32" cy="32" r="30" fill="#F07746"/>
              <circle cx="32" cy="32" r="8" fill="white"/>
              <circle cx="32" cy="8" r="6" fill="white"/>
              <circle cx="53" cy="44" r="6" fill="white"/>
              <circle cx="11" cy="44" r="6" fill="white"/>
            </svg>
            <h2 style="color: #DD4814; margin: 0 0 8px 0;">Ubuntu 4.10</h2>
            <p style="margin: 0 0 16px 0; font-size: 10pt; color: #666;">
              Warty Warthog
            </p>
            <p style="line-height: 1.6; margin-bottom: 12px; font-size: 10pt;">
              Released October 20, 2004
            </p>
            <p style="line-height: 1.6; margin-bottom: 12px; font-size: 10pt;">
              GNOME 2.8.1<br>
              Linux Kernel 2.6.8
            </p>
            <p style="line-height: 1.6; font-size: 9pt; color: #666; margin-top: 24px;">
              © 2004 Canonical Ltd.<br>
              Ubuntu is a registered trademark of Canonical Ltd.
            </p>
          </div>
        `
      });
    }

    /**
     * Log out
     */
    logout() {
      if (confirm('Are you sure you want to log out?')) {
        document.body.innerHTML = `
          <div style="position: fixed; inset: 0; background: #5E2750;
                      display: flex; align-items: center; justify-content: center;
                      font-family: 'Ubuntu Sans', sans-serif; color: white;">
            <div style="text-align: center;">
              <h1 style="font-size: 24pt; margin-bottom: 16px;">Logging out...</h1>
              <p style="font-size: 12pt;">Thank you for using Ubuntu</p>
            </div>
          </div>
        `;
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    }

    /**
     * Shutdown
     */
    shutdown() {
      if (confirm('Are you sure you want to shut down?')) {
        document.body.innerHTML = `
          <div style="position: fixed; inset: 0; background: #5E2750;
                      display: flex; align-items: center; justify-content: center;
                      font-family: 'Ubuntu Sans', sans-serif; color: white;">
            <div style="text-align: center;">
              <h1 style="font-size: 24pt; margin-bottom: 16px;">Shutting down...</h1>
              <p style="font-size: 12pt;">It is now safe to turn off your computer</p>
            </div>
          </div>
        `;
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      }
    }
  }

  // Export to global scope
  global.UbuntuDesktop = UbuntuDesktop;

})(typeof window !== 'undefined' ? window : global);
