/**
 * Ubuntu Menu System
 * Implements the GNOME 2 three-menu structure: Applications, Places, System
 */

(function(global) {
  'use strict';

  class UbuntuMenu {
    constructor(desktopInstance) {
      this.desktop = desktopInstance;
      this.menuSystem = desktopInstance.menuSystem;
      this.menus = {};
    }

    /**
     * Initialize all menus
     */
    init() {
      this.initApplicationsMenu();
      this.initPlacesMenu();
      this.initSystemMenu();
      this.initUserMenu();
    }

    /**
     * Initialize Applications menu
     */
    initApplicationsMenu() {
      const trigger = document.getElementById('applications-menu-btn');
      if (!trigger) return;

      this.menus.applications = this.menuSystem.registerMenu({
        id: 'applications-menu',
        label: 'Applications',
        trigger: trigger,
        items: [
          {
            label: 'Accessories',
            icon: this.getMenuIcon('accessories'),
            submenu: [
              {
                label: 'Calculator',
                action: () => alert('Calculator would launch here')
              },
              {
                label: 'Text Editor',
                action: () => this.desktop.openGedit()
              },
              {
                label: 'Terminal',
                action: () => this.desktop.openTerminal()
              }
            ]
          },
          {
            label: 'Games',
            icon: this.getMenuIcon('games'),
            submenu: [
              {
                label: 'AisleRiot Solitaire',
                action: () => alert('Solitaire would launch here')
              },
              {
                label: 'Gnometris',
                action: () => alert('Gnometris would launch here')
              },
              {
                label: 'Mines',
                action: () => alert('Mines would launch here')
              }
            ]
          },
          {
            label: 'Graphics',
            icon: this.getMenuIcon('graphics'),
            submenu: [
              {
                label: 'Eye of GNOME Image Viewer',
                action: () => alert('Image viewer would launch here')
              },
              {
                label: 'The GIMP',
                action: () => alert('GIMP would launch here')
              }
            ]
          },
          {
            label: 'Internet',
            icon: this.getMenuIcon('internet'),
            submenu: [
              {
                label: 'Firefox Web Browser',
                action: () => this.desktop.openFirefox('https://ubuntu.com')
              },
              {
                label: 'Evolution Email',
                action: () => alert('Evolution would launch here')
              },
              {
                label: 'Gaim Internet Messenger',
                action: () => alert('Gaim would launch here')
              }
            ]
          },
          {
            label: 'Office',
            icon: this.getMenuIcon('office'),
            submenu: [
              {
                label: 'OpenOffice.org Writer',
                action: () => alert('Writer would launch here')
              },
              {
                label: 'OpenOffice.org Calc',
                action: () => alert('Calc would launch here')
              },
              {
                label: 'OpenOffice.org Impress',
                action: () => alert('Impress would launch here')
              }
            ]
          },
          {
            label: 'Sound & Video',
            icon: this.getMenuIcon('sound'),
            submenu: [
              {
                label: 'Rhythmbox Music Player',
                action: () => alert('Rhythmbox would launch here')
              },
              {
                label: 'Totem Movie Player',
                action: () => alert('Totem would launch here')
              },
              {
                label: 'Sound Recorder',
                action: () => alert('Sound Recorder would launch here')
              }
            ]
          },
          {
            type: 'separator'
          },
          {
            label: 'System Tools',
            icon: this.getMenuIcon('system-tools'),
            submenu: [
              {
                label: 'Configuration Editor',
                action: () => alert('Configuration Editor would launch here')
              },
              {
                label: 'File Browser',
                action: () => this.desktop.openNautilus('/')
              },
              {
                label: 'System Log',
                action: () => alert('System Log would launch here')
              },
              {
                label: 'System Monitor',
                action: () => this.desktop.openSystemMonitor()
              },
              {
                label: 'Terminal',
                action: () => this.desktop.openTerminal()
              }
            ]
          }
        ]
      });
    }

    /**
     * Initialize Places menu
     */
    initPlacesMenu() {
      const trigger = document.getElementById('places-menu-btn');
      if (!trigger) return;

      const username = 'user';

      this.menus.places = this.menuSystem.registerMenu({
        id: 'places-menu',
        label: 'Places',
        trigger: trigger,
        items: [
          {
            label: 'Home Folder',
            icon: this.getMenuIcon('home'),
            action: () => this.desktop.openNautilus(`/home/${username}`)
          },
          {
            label: 'Desktop',
            icon: this.getMenuIcon('desktop'),
            action: () => this.desktop.openNautilus(`/home/${username}/Desktop`)
          },
          {
            type: 'separator'
          },
          {
            label: 'Computer',
            icon: this.getMenuIcon('computer'),
            action: () => this.desktop.openNautilus('/')
          },
          {
            label: 'CD/DVD Creator',
            icon: this.getMenuIcon('cd'),
            action: () => alert('CD/DVD Creator would launch here')
          },
          {
            type: 'separator'
          },
          {
            label: 'Network Servers',
            icon: this.getMenuIcon('network'),
            action: () => alert('Network browser would launch here')
          },
          {
            type: 'separator'
          },
          {
            label: 'Search for Files...',
            icon: this.getMenuIcon('search'),
            shortcut: 'Ctrl+F',
            action: () => alert('Search tool would launch here')
          },
          {
            label: 'Recent Documents',
            icon: this.getMenuIcon('recent'),
            submenu: [
              {
                label: 'No recent documents',
                disabled: true
              }
            ]
          }
        ]
      });
    }

    /**
     * Initialize System menu
     */
    initSystemMenu() {
      const trigger = document.getElementById('system-menu-btn');
      if (!trigger) return;

      this.menus.system = this.menuSystem.registerMenu({
        id: 'system-menu',
        label: 'System',
        trigger: trigger,
        items: [
          {
            label: 'Preferences',
            icon: this.getMenuIcon('preferences'),
            submenu: [
              {
                label: 'About Me',
                action: () => alert('About Me would open here')
              },
              {
                label: 'Keyboard',
                action: () => alert('Keyboard settings would open here')
              },
              {
                label: 'Mouse',
                action: () => alert('Mouse settings would open here')
              },
              {
                label: 'Network',
                action: () => alert('Network settings would open here')
              },
              {
                label: 'Removable Drives and Media',
                action: () => alert('Media settings would open here')
              },
              {
                label: 'Screen Resolution',
                action: () => alert('Display settings would open here')
              },
              {
                label: 'Theme',
                action: () => alert('Theme settings would open here')
              }
            ]
          },
          {
            label: 'Administration',
            icon: this.getMenuIcon('administration'),
            submenu: [
              {
                label: 'Login Window',
                action: () => alert('Login Window settings would open here')
              },
              {
                label: 'Networking',
                action: () => alert('Network administration would open here')
              },
              {
                label: 'Printing',
                action: () => alert('Printing settings would open here')
              },
              {
                label: 'Synaptic Package Manager',
                action: () => this.desktop.openSynaptic()
              },
              {
                label: 'System Log',
                action: () => alert('System log would open here')
              },
              {
                label: 'Update Manager',
                action: () => alert('Update Manager would launch here')
              },
              {
                label: 'Users and Groups',
                action: () => alert('User management would open here')
              }
            ]
          },
          {
            type: 'separator'
          },
          {
            label: 'About Ubuntu',
            icon: this.getMenuIcon('about'),
            action: () => this.desktop.showAboutDialog()
          },
          {
            type: 'separator'
          },
          {
            label: 'Lock Screen',
            icon: this.getMenuIcon('lock'),
            shortcut: 'Ctrl+Alt+L',
            action: () => alert('Screen would be locked')
          },
          {
            label: 'Log Out...',
            icon: this.getMenuIcon('logout'),
            action: () => this.desktop.logout()
          }
        ]
      });
    }

    /**
     * Initialize User menu
     */
    initUserMenu() {
      const trigger = document.getElementById('user-menu-btn');
      if (!trigger) return;

      this.menus.user = this.menuSystem.registerMenu({
        id: 'user-menu',
        label: 'User',
        trigger: trigger,
        items: [
          {
            label: 'Lock Screen',
            action: () => alert('Screen would be locked')
          },
          {
            label: 'Switch User',
            action: () => alert('User switching would happen here')
          },
          {
            type: 'separator'
          },
          {
            label: 'Log Out...',
            action: () => this.desktop.logout()
          },
          {
            label: 'Shut Down...',
            action: () => this.desktop.shutdown()
          }
        ]
      });
    }

    /**
     * Get menu icon SVG
     */
    getMenuIcon(type) {
      const icons = {
        accessories: `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect x="4" y="8" width="12" height="8" rx="1"/>
            <rect x="8" y="4" width="4" height="12" rx="1"/>
          </svg>
        `,
        games: `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 8h12c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2h-3l-2 2-2-2H4c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2z"/>
            <circle cx="7" cy="12" r="1.5"/>
            <circle cx="13" cy="12" r="1.5"/>
          </svg>
        `,
        graphics: `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 3v14h14V3H3zm2 12l3-4 2 3 3-4 3 4H5z"/>
            <circle cx="7" cy="7" r="1.5"/>
          </svg>
        `,
        internet: `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="10" cy="10" r="7"/>
            <path d="M3 10h14M10 3c-2 2-2 10 0 12M10 3c2 2 2 10 0 12"/>
          </svg>
        `,
        office: `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 3h8l3 3v10c0 .6-.4 1-1 1H5c-.6 0-1-.4-1-1V4c0-.6.4-1 1-1z"/>
            <path d="M13 3v3h3l-3-3z" fill="white"/>
            <rect x="7" y="9" width="6" height="1" fill="white"/>
            <rect x="7" y="11" width="6" height="1" fill="white"/>
            <rect x="7" y="13" width="4" height="1" fill="white"/>
          </svg>
        `,
        sound: `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 5L4 8H2v4h2l4 3V5z"/>
            <path d="M12 7c.7.7 1 1.6 1 3s-.3 2.3-1 3" fill="none" stroke="currentColor" stroke-width="1.5"/>
            <path d="M14 5c1.3 1.3 2 3 2 5s-.7 3.7-2 5" fill="none" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        `,
        'system-tools': `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.5 2h-7L3 5.5v9L6.5 18h7l3.5-3.5v-9L13.5 2z"/>
            <circle cx="10" cy="10" r="3" fill="white"/>
          </svg>
        `,
        home: `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3L2 9v8h5v-5h6v5h5V9l-8-6z"/>
          </svg>
        `,
        desktop: `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect x="2" y="3" width="16" height="11" rx="1"/>
            <rect x="3" y="4" width="14" height="9" fill="white"/>
            <rect x="7" y="14" width="6" height="2"/>
            <rect x="5" y="16" width="10" height="1"/>
          </svg>
        `,
        computer: `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect x="3" y="5" width="14" height="10" rx="1"/>
            <rect x="4" y="6" width="12" height="7" fill="white"/>
          </svg>
        `,
        cd: `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="10" cy="10" r="7"/>
            <circle cx="10" cy="10" r="2"/>
          </svg>
        `,
        network: `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect x="2" y="3" width="16" height="3" rx="1"/>
            <rect x="2" y="8" width="16" height="3" rx="1"/>
            <rect x="2" y="13" width="16" height="3" rx="1"/>
            <circle cx="5" cy="4.5" r="0.8" fill="white"/>
            <circle cx="5" cy="9.5" r="0.8" fill="white"/>
            <circle cx="5" cy="14.5" r="0.8" fill="white"/>
          </svg>
        `,
        search: `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="8" cy="8" r="5"/>
            <path d="M12 12l5 5"/>
          </svg>
        `,
        recent: `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="10" cy="10" r="7"/>
            <path d="M10 6v4l3 2"/>
          </svg>
        `,
        preferences: `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M11 2l-1 3h4v2h-4l-1 3h-2l1-3H4V5h4l1-3h2zm-3 8l-1 3h4v2H7l-1 3H4l1-3H1v-2h4l1-3h2z"/>
          </svg>
        `,
        administration: `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2L2 6v4c0 5 3 8 8 10 5-2 8-5 8-10V6l-8-4z"/>
            <path d="M8 10l2 2 4-4" fill="none" stroke="white" stroke-width="1.5"/>
          </svg>
        `,
        about: `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="10" cy="10" r="7"/>
            <path d="M10 7v6M10 5v1"/>
          </svg>
        `,
        lock: `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect x="5" y="9" width="10" height="8" rx="1"/>
            <path d="M7 9V6c0-1.7 1.3-3 3-3s3 1.3 3 3v3" fill="none" stroke="currentColor" stroke-width="1.5"/>
            <circle cx="10" cy="13" r="1.5"/>
          </svg>
        `,
        logout: `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 3v14h8v-2H5V5h6V3H3z"/>
            <path d="M12 7l5 3-5 3v-2H8v-2h4V7z"/>
          </svg>
        `
      };

      return icons[type] || '';
    }
  }

  // Auto-initialize when desktop is ready
  document.addEventListener('DOMContentLoaded', function() {
    // Wait for Ubuntu desktop to initialize
    const checkDesktop = setInterval(() => {
      if (window.ubuntu && window.ubuntu.menuSystem) {
        const ubuntuMenu = new UbuntuMenu(window.ubuntu);
        ubuntuMenu.init();
        clearInterval(checkDesktop);
      }
    }, 100);
  });

  // Export to global scope
  global.UbuntuMenu = UbuntuMenu;

})(typeof window !== 'undefined' ? window : global);
