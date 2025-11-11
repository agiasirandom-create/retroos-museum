/**
 * Windows XP Start Menu
 * Manages the iconic Windows XP 2-column Start menu with Luna theme
 */

(function(global) {
  'use strict';

  class WinXPStartMenu {
    constructor(desktop) {
      this.desktop = desktop;
      this.button = null;
      this.menu = null;
      this.allProgramsMenu = null;
      this.isOpen = false;
      this.showingAllPrograms = false;
    }

    /**
     * Initialize Start menu
     */
    init() {
      this.button = document.getElementById('start-button');
      this.menu = document.getElementById('start-menu');
      this.allProgramsMenu = document.getElementById('all-programs-menu');

      if (!this.button || !this.menu) {
        console.error('Start button or menu not found');
        return;
      }

      // Build menu structure
      this.buildPinnedPrograms();
      this.buildPlaces();
      this.buildAllPrograms();

      // Attach event listeners
      this.attachEventListeners();

      console.log('WinXPStartMenu initialized');
    }

    /**
     * Build pinned programs section
     */
    buildPinnedPrograms() {
      const container = this.menu.querySelector('.start-menu-pinned');
      if (!container) return;

      const programs = [
        {
          label: 'Internet',
          icon: this.getIconSvg('ie'),
          action: () => {
            this.close();
            this.desktop.openInternetExplorer();
          }
        },
        {
          label: 'E-mail',
          icon: this.getIconSvg('mail'),
          action: () => {
            this.close();
            this.desktop.showPlaceholder('Outlook Express');
          }
        }
      ];

      programs.forEach(program => {
        const item = this.createMenuItem(program);
        container.appendChild(item);
      });
    }

    /**
     * Build places section (right panel)
     */
    buildPlaces() {
      const container = this.menu.querySelector('.start-menu-right');
      if (!container) return;

      const places = [
        {
          label: 'My Documents',
          icon: this.getIconSvg('documents'),
          action: () => {
            this.close();
            this.desktop.openMyDocuments();
          }
        },
        {
          label: 'My Pictures',
          icon: this.getIconSvg('pictures'),
          action: () => {
            this.close();
            this.desktop.showPlaceholder('My Pictures');
          }
        },
        {
          label: 'My Music',
          icon: this.getIconSvg('music'),
          action: () => {
            this.close();
            this.desktop.showPlaceholder('My Music');
          }
        },
        {
          label: 'My Computer',
          icon: this.getIconSvg('computer'),
          action: () => {
            this.close();
            this.desktop.openMyComputer();
          }
        },
        {
          label: 'Control Panel',
          icon: this.getIconSvg('control'),
          action: () => {
            this.close();
            this.desktop.openControlPanel();
          }
        },
        {
          label: 'Help and Support',
          icon: this.getIconSvg('help'),
          action: () => {
            this.close();
            this.desktop.showPlaceholder('Help and Support');
          }
        },
        {
          label: 'Search',
          icon: this.getIconSvg('search'),
          action: () => {
            this.close();
            this.desktop.openSearch();
          }
        },
        {
          label: 'Run...',
          icon: this.getIconSvg('run'),
          action: () => {
            this.close();
            this.desktop.openRun();
          }
        }
      ];

      places.forEach(place => {
        const item = this.createPlaceItem(place);
        container.appendChild(item);
      });
    }

    /**
     * Build All Programs menu
     */
    buildAllPrograms() {
      const container = this.allProgramsMenu?.querySelector('.all-programs-items');
      if (!container) return;

      const programs = [
        {
          label: 'Accessories',
          icon: this.getIconSvg('folder'),
          submenu: [
            {
              label: 'Notepad',
              icon: this.getIconSvg('notepad'),
              action: () => {
                this.close();
                this.desktop.openNotepad();
              }
            },
            {
              label: 'Calculator',
              icon: this.getIconSvg('calculator'),
              action: () => {
                this.close();
                this.desktop.showPlaceholder('Calculator');
              }
            },
            {
              label: 'Paint',
              icon: this.getIconSvg('paint'),
              action: () => {
                this.close();
                this.desktop.showPlaceholder('Paint');
              }
            },
            {
              label: 'Windows Explorer',
              icon: this.getIconSvg('explorer'),
              action: () => {
                this.close();
                this.desktop.openMyComputer();
              }
            }
          ]
        },
        {
          label: 'Games',
          icon: this.getIconSvg('folder'),
          submenu: [
            {
              label: 'Minesweeper',
              icon: this.getIconSvg('game'),
              action: () => {
                this.close();
                this.desktop.showPlaceholder('Minesweeper');
              }
            },
            {
              label: 'Solitaire',
              icon: this.getIconSvg('game'),
              action: () => {
                this.close();
                this.desktop.showPlaceholder('Solitaire');
              }
            },
            {
              label: '3D Pinball',
              icon: this.getIconSvg('game'),
              action: () => {
                this.close();
                this.desktop.showPlaceholder('3D Pinball');
              }
            }
          ]
        },
        {
          label: 'Internet Explorer',
          icon: this.getIconSvg('ie'),
          action: () => {
            this.close();
            this.desktop.openInternetExplorer();
          }
        },
        {
          label: 'Windows Media Player',
          icon: this.getIconSvg('media'),
          action: () => {
            this.close();
            this.desktop.showPlaceholder('Windows Media Player');
          }
        }
      ];

      programs.forEach(program => {
        const item = this.createMenuItem(program);
        container.appendChild(item);
      });
    }

    /**
     * Create menu item element
     */
    createMenuItem(item) {
      const element = document.createElement('div');
      element.className = 'start-menu-item';
      element.setAttribute('role', 'menuitem');
      element.setAttribute('tabindex', '0');

      // Icon
      const icon = document.createElement('div');
      icon.className = 'start-menu-item-icon';
      icon.innerHTML = item.icon || this.getIconSvg('default');
      element.appendChild(icon);

      // Label
      const label = document.createElement('div');
      label.className = 'start-menu-item-label';
      label.textContent = item.label;
      element.appendChild(label);

      // Submenu arrow
      if (item.submenu) {
        const arrow = document.createElement('div');
        arrow.className = 'start-menu-item-arrow';
        arrow.textContent = '¶';
        element.appendChild(arrow);

        // Show submenu on hover
        element.addEventListener('mouseenter', () => {
          this.showSubmenu(element, item.submenu);
        });
      }

      // Click handler
      if (item.action) {
        element.addEventListener('click', (e) => {
          e.stopPropagation();
          if (!item.submenu) {
            item.action();
          }
        });
      }

      // Keyboard support
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (item.action && !item.submenu) {
            item.action();
          }
        }
      });

      return element;
    }

    /**
     * Create place item element (right panel)
     */
    createPlaceItem(place) {
      const element = document.createElement('div');
      element.className = 'start-menu-place';
      element.setAttribute('role', 'menuitem');
      element.setAttribute('tabindex', '0');

      // Icon
      const icon = document.createElement('div');
      icon.className = 'start-menu-place-icon';
      icon.innerHTML = place.icon || this.getIconSvg('default');
      element.appendChild(icon);

      // Label
      const label = document.createElement('div');
      label.className = 'start-menu-place-label';
      label.textContent = place.label;
      element.appendChild(label);

      // Click handler
      if (place.action) {
        element.addEventListener('click', (e) => {
          e.stopPropagation();
          place.action();
        });
      }

      // Keyboard support
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (place.action) {
            place.action();
          }
        }
      });

      return element;
    }

    /**
     * Show submenu (placeholder for now)
     */
    showSubmenu(parentElement, submenu) {
      // For now, we'll convert submenu items to display in a simple way
      // In a full implementation, this would show a cascading submenu
      console.log('Submenu:', submenu);
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
      // Start button click
      this.button.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });

      // All Programs trigger
      const allProgramsTrigger = document.getElementById('all-programs-trigger');
      if (allProgramsTrigger) {
        allProgramsTrigger.addEventListener('click', (e) => {
          e.stopPropagation();
          this.showAllPrograms();
        });
      }

      // All Programs back button
      const backBtn = this.allProgramsMenu?.querySelector('.all-programs-header');
      if (backBtn) {
        backBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.hideAllPrograms();
        });
      }

      // Footer buttons
      const logOffBtn = this.menu.querySelector('.log-off-btn');
      const turnOffBtn = this.menu.querySelector('.turn-off-btn');

      if (logOffBtn) {
        logOffBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.close();
          alert('Log Off clicked - In a real system, this would log off the user.');
        });
      }

      if (turnOffBtn) {
        turnOffBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.close();
          alert('Turn Off Computer clicked - In a real system, this would show shutdown options.');
        });
      }

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (this.isOpen && !this.menu.contains(e.target) && e.target !== this.button) {
          this.close();
        }
      });

      // ESC key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });
    }

    /**
     * Toggle Start menu
     */
    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    /**
     * Open Start menu
     */
    open() {
      this.menu.removeAttribute('hidden');
      this.button.classList.add('active');
      this.button.setAttribute('aria-expanded', 'true');
      this.isOpen = true;
    }

    /**
     * Close Start menu
     */
    close() {
      this.menu.setAttribute('hidden', '');
      this.allProgramsMenu?.setAttribute('hidden', '');
      this.button.classList.remove('active');
      this.button.setAttribute('aria-expanded', 'false');
      this.isOpen = false;
      this.showingAllPrograms = false;
    }

    /**
     * Show All Programs menu
     */
    showAllPrograms() {
      this.menu.setAttribute('hidden', '');
      this.allProgramsMenu.removeAttribute('hidden');
      this.showingAllPrograms = true;
    }

    /**
     * Hide All Programs menu
     */
    hideAllPrograms() {
      this.allProgramsMenu.setAttribute('hidden', '');
      this.menu.removeAttribute('hidden');
      this.showingAllPrograms = false;
    }

    /**
     * Get icon SVG
     */
    getIconSvg(type) {
      const icons = {
        ie: `<svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#4299E1"/><path d="M10 12c0-3 2-5 6-5s6 2 6 5" fill="none" stroke="white" stroke-width="2"/></svg>`,
        mail: `<svg width="32" height="32" viewBox="0 0 32 32"><rect x="4" y="8" width="24" height="16" rx="2" fill="#FCD34D"/><path d="M4 10l12 8 12-8" stroke="#F59E0B" stroke-width="2"/></svg>`,
        documents: `<svg width="32" height="32" viewBox="0 0 32 32"><path d="M8 4h12l6 6v18H8V4z" fill="#FCD34D"/></svg>`,
        pictures: `<svg width="32" height="32" viewBox="0 0 32 32"><rect x="4" y="6" width="24" height="20" rx="2" fill="#A78BFA"/><circle cx="12" cy="14" r="3" fill="white"/><path d="M4 20l6-6 4 4 6-8 6 6v8" fill="white" opacity="0.5"/></svg>`,
        music: `<svg width="32" height="32" viewBox="0 0 32 32"><circle cx="10" cy="22" r="4" fill="#34D399"/><circle cx="22" cy="20" r="4" fill="#34D399"/><path d="M14 22V8l8-2v14" stroke="#10B981" stroke-width="2" fill="none"/></svg>`,
        computer: `<svg width="32" height="32" viewBox="0 0 32 32"><rect x="4" y="8" width="24" height="16" fill="#3B82F6"/></svg>`,
        control: `<svg width="32" height="32" viewBox="0 0 32 32"><rect x="6" y="6" width="20" height="20" rx="2" fill="#F59E0B"/><rect x="10" y="10" width="4" height="4" fill="white"/><rect x="18" y="10" width="4" height="4" fill="white"/><rect x="10" y="18" width="4" height="4" fill="white"/><rect x="18" y="18" width="4" height="4" fill="white"/></svg>`,
        help: `<svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="12" fill="#3B82F6"/><path d="M12 12c0-2 1.5-3.5 4-3.5s4 1.5 4 3.5c0 2-2 2.5-2 4.5" stroke="white" stroke-width="2" fill="none"/><circle cx="16" cy="22" r="1.5" fill="white"/></svg>`,
        search: `<svg width="32" height="32" viewBox="0 0 32 32"><circle cx="14" cy="14" r="8" fill="none" stroke="#3B82F6" stroke-width="2"/><path d="M20 20l6 6" stroke="#3B82F6" stroke-width="2"/></svg>`,
        run: `<svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="12" fill="#10B981"/><path d="M13 10l8 6-8 6V10z" fill="white"/></svg>`,
        folder: `<svg width="32" height="32" viewBox="0 0 32 32"><path d="M4 8h10l2 2h12v16H4V8z" fill="#FCD34D"/></svg>`,
        notepad: `<svg width="32" height="32" viewBox="0 0 32 32"><rect x="6" y="4" width="20" height="24" fill="white" stroke="#94A3B8" stroke-width="2"/><line x1="10" y1="10" x2="22" y2="10" stroke="#94A3B8"/><line x1="10" y1="14" x2="22" y2="14" stroke="#94A3B8"/><line x1="10" y1="18" x2="18" y2="18" stroke="#94A3B8"/></svg>`,
        calculator: `<svg width="32" height="32" viewBox="0 0 32 32"><rect x="6" y="4" width="20" height="24" rx="2" fill="#64748B"/><rect x="8" y="6" width="16" height="5" fill="#CBD5E1"/></svg>`,
        paint: `<svg width="32" height="32" viewBox="0 0 32 32"><rect x="4" y="8" width="24" height="20" fill="white" stroke="#94A3B8" stroke-width="2"/><path d="M8 24q8-12 16 0" stroke="#EF4444" stroke-width="2" fill="none"/></svg>`,
        explorer: `<svg width="32" height="32" viewBox="0 0 32 32"><path d="M4 6h10l2 2h12v18H4V6z" fill="#FCD34D"/><rect x="8" y="12" width="16" height="2" fill="#F59E0B"/></svg>`,
        game: `<svg width="32" height="32" viewBox="0 0 32 32"><rect x="8" y="10" width="16" height="12" rx="2" fill="#EF4444"/><circle cx="13" cy="16" r="2" fill="white"/><rect x="19" y="14" width="2" height="4" fill="white"/></svg>`,
        media: `<svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="12" fill="#F59E0B"/><path d="M13 10l10 6-10 6V10z" fill="white"/></svg>`,
        default: `<svg width="32" height="32" viewBox="0 0 32 32"><rect x="8" y="8" width="16" height="16" fill="#94A3B8"/></svg>`
      };
      return icons[type] || icons.default;
    }
  }

  // Export to global scope
  global.WinXPStartMenu = WinXPStartMenu;

})(typeof window !== 'undefined' ? window : global);
