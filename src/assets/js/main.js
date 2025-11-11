/**
 * RetroOS Museum - Main JavaScript
 * Handles interactive functionality for the modular OS builder
 */

(function() {
  'use strict';

  // Global RetroOS namespace
  window.RetroOS = window.RetroOS || {};

  /**
   * Initialize RetroOS systems
   */
  function init() {
    console.log('RetroOS Museum initialized');

    // Initialize Window Manager
    if (typeof WindowManager !== 'undefined') {
      window.RetroOS.windowManager = new WindowManager();
      window.RetroOS.windowManager.init(document.body);
      console.log('Window Manager initialized');
    }

    // Initialize Menu System
    if (typeof MenuSystem !== 'undefined') {
      window.RetroOS.menuSystem = new MenuSystem();
      window.RetroOS.menuSystem.init('.menu-bar');
      console.log('Menu System initialized');
    }

    // Initialize Desktop
    if (typeof Desktop !== 'undefined') {
      window.RetroOS.desktop = new Desktop();
      // Desktop will be initialized when a desktop container is found
      const desktopContainer = document.querySelector('.desktop-area');
      if (desktopContainer) {
        window.RetroOS.desktop.init(desktopContainer, {
          multiSelect: true,
          draggable: false,
          contextMenu: true
        });
        console.log('Desktop initialized');
      }
    }

    // Expose convenient API methods
    setupAPI();

    // Initialize any OS-specific components
    initializeOSComponents();

    // Set up demo interactions (if on demo page)
    setupDemoInteractions();
  }

  /**
   * Set up convenient global API
   */
  function setupAPI() {
    /**
     * Create a new window
     * @param {Object} options - Window configuration
     * @returns {Window} Window instance
     */
    window.RetroOS.createWindow = function(options) {
      if (!window.RetroOS.windowManager) {
        console.error('Window Manager not initialized');
        return null;
      }
      return window.RetroOS.windowManager.createWindow(options);
    };

    /**
     * Create a menu
     * @param {Object} options - Menu configuration
     * @returns {Menu} Menu instance
     */
    window.RetroOS.createMenu = function(options) {
      if (!window.RetroOS.menuSystem) {
        console.error('Menu System not initialized');
        return null;
      }
      return window.RetroOS.menuSystem.registerMenu(options);
    };

    /**
     * Add desktop icon
     * @param {Object} options - Icon configuration
     * @returns {DesktopIcon} Icon instance
     */
    window.RetroOS.addDesktopIcon = function(options) {
      if (!window.RetroOS.desktop || !window.RetroOS.desktop.initialized) {
        console.error('Desktop not initialized');
        return null;
      }
      return window.RetroOS.desktop.addIcon(options);
    };

    /**
     * Show a notification window
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     * @param {Object} options - Additional options
     */
    window.RetroOS.notify = function(title, message, options = {}) {
      const content = `
        <div class="notification-content">
          <p>${message}</p>
          <div class="notification-actions">
            <button class="btn btn-primary" onclick="this.closest('.os-window').querySelector('.window-btn-close').click()">OK</button>
          </div>
        </div>
      `;

      return window.RetroOS.createWindow({
        id: `notification-${Date.now()}`,
        title: title,
        content: content,
        width: options.width || 300,
        height: options.height || 150,
        resizable: false,
        maximizable: false,
        modal: options.modal || false
      });
    };

    /**
     * Show a confirmation dialog
     * @param {string} title - Dialog title
     * @param {string} message - Dialog message
     * @param {Function} onConfirm - Callback when confirmed
     * @param {Function} onCancel - Callback when cancelled
     */
    window.RetroOS.confirm = function(title, message, onConfirm, onCancel) {
      const content = `
        <div class="dialog-content">
          <p>${message}</p>
          <div class="dialog-actions">
            <button class="btn btn-primary" id="confirm-btn">OK</button>
            <button class="btn btn-secondary" id="cancel-btn">Cancel</button>
          </div>
        </div>
      `;

      const win = window.RetroOS.createWindow({
        id: `confirm-${Date.now()}`,
        title: title,
        content: content,
        width: 350,
        height: 150,
        resizable: false,
        maximizable: false,
        modal: true
      });

      // Add event listeners after window is created
      setTimeout(() => {
        const confirmBtn = win.element.querySelector('#confirm-btn');
        const cancelBtn = win.element.querySelector('#cancel-btn');

        if (confirmBtn) {
          confirmBtn.addEventListener('click', () => {
            if (onConfirm) onConfirm();
            win.close();
          });
        }

        if (cancelBtn) {
          cancelBtn.addEventListener('click', () => {
            if (onCancel) onCancel();
            win.close();
          });
        }
      }, 50);

      return win;
    };

    /**
     * Show an alert dialog
     * @param {string} title - Dialog title
     * @param {string} message - Dialog message
     * @param {Function} onClose - Callback when closed
     */
    window.RetroOS.alert = function(title, message, onClose) {
      return window.RetroOS.notify(title, message, {
        modal: true,
        onClose: onClose
      });
    };
  }

  /**
   * Initialize OS-specific components
   */
  function initializeOSComponents() {
    // Look for any pre-defined windows in the page
    const windowElements = document.querySelectorAll('[data-os-window]');
    windowElements.forEach(element => {
      const config = {
        id: element.getAttribute('data-window-id') || undefined,
        title: element.getAttribute('data-window-title') || 'Window',
        content: element.innerHTML,
        width: parseInt(element.getAttribute('data-window-width')) || 400,
        height: parseInt(element.getAttribute('data-window-height')) || 300,
        x: parseInt(element.getAttribute('data-window-x')) || undefined,
        y: parseInt(element.getAttribute('data-window-y')) || undefined
      };

      window.RetroOS.createWindow(config);
      element.remove(); // Remove template from DOM
    });

    // Look for pre-defined desktop icons
    const iconElements = document.querySelectorAll('[data-desktop-icon]');
    iconElements.forEach(element => {
      const config = {
        id: element.getAttribute('data-icon-id') || undefined,
        label: element.getAttribute('data-icon-label') || 'Icon',
        icon: element.getAttribute('data-icon-image') || '📄',
        x: parseInt(element.getAttribute('data-icon-x')) || undefined,
        y: parseInt(element.getAttribute('data-icon-y')) || undefined,
        onOpen: function(icon) {
          const action = element.getAttribute('data-icon-action');
          if (action) {
            // Only execute if it's a registered function
            // This prevents arbitrary code execution
            try {
              if (typeof window[action] === 'function') {
                window[action](icon);
              } else {
                console.warn('Icon action must be a registered function:', action);
              }
            } catch (e) {
              console.error('Failed to execute icon action:', e);
            }
          }
        }
      };

      window.RetroOS.addDesktopIcon(config);
      element.remove(); // Remove template from DOM
    });
  }

  /**
   * Set up demo interactions for showcase pages
   */
  function setupDemoInteractions() {
    // Create demo button if present
    const demoBtn = document.querySelector('[data-demo="create-window"]');
    if (demoBtn) {
      demoBtn.addEventListener('click', createDemoWindow);
    }

    // Example menu bar setup
    const menuBar = document.querySelector('.menu-bar');
    if (menuBar && window.RetroOS.menuSystem) {
      setupDemoMenus();
    }

    // Example desktop icons
    const desktopArea = document.querySelector('.desktop-area');
    if (desktopArea && window.RetroOS.desktop && window.RetroOS.desktop.initialized) {
      setupDemoIcons();
    }
  }

  /**
   * Create a demo window
   */
  function createDemoWindow() {
    const windowCount = window.RetroOS.windowManager.getAllWindows().length;

    window.RetroOS.createWindow({
      id: `demo-window-${windowCount}`,
      title: `Demo Window ${windowCount + 1}`,
      content: `
        <div class="demo-window-content">
          <h2>Welcome to RetroOS Museum!</h2>
          <p>This is a demonstration of the window management system.</p>
          <p>You can:</p>
          <ul>
            <li>Drag the window by the title bar</li>
            <li>Resize using the edges and corners</li>
            <li>Minimize, maximize, or close the window</li>
            <li>Double-click title bar to maximize</li>
            <li>Press Alt+F4 to close</li>
          </ul>
          <button class="btn btn-primary" onclick="RetroOS.createWindow({
            title: 'Nested Window',
            content: '<p>You can create windows from within windows!</p>',
            width: 300,
            height: 200
          })">Create Another Window</button>
        </div>
      `,
      width: 500,
      height: 400,
      x: 50 + (windowCount * 30),
      y: 50 + (windowCount * 30)
    });
  }

  /**
   * Set up demo menu bar
   */
  function setupDemoMenus() {
    // File menu
    const fileMenuTrigger = document.querySelector('[data-menu="file"]');
    if (fileMenuTrigger) {
      window.RetroOS.createMenu({
        id: 'file-menu',
        label: 'File',
        trigger: fileMenuTrigger,
        items: [
          {
            label: 'New',
            icon: '📄',
            shortcut: 'Ctrl+N',
            action: () => {
              window.RetroOS.notify('New File', 'Create new file functionality');
            }
          },
          {
            label: 'Open',
            icon: '📂',
            shortcut: 'Ctrl+O',
            action: () => {
              window.RetroOS.notify('Open File', 'Open file functionality');
            }
          },
          {
            type: 'separator'
          },
          {
            label: 'Save',
            icon: '💾',
            shortcut: 'Ctrl+S',
            action: () => {
              window.RetroOS.notify('Save', 'File saved successfully!');
            }
          },
          {
            label: 'Save As...',
            shortcut: 'Ctrl+Shift+S',
            action: () => {
              window.RetroOS.notify('Save As', 'Save file as functionality');
            }
          },
          {
            type: 'separator'
          },
          {
            label: 'Exit',
            shortcut: 'Alt+F4',
            action: () => {
              window.RetroOS.confirm(
                'Exit Application',
                'Are you sure you want to exit?',
                () => {
                  window.RetroOS.windowManager.closeAll();
                }
              );
            }
          }
        ]
      });
    }

    // Edit menu
    const editMenuTrigger = document.querySelector('[data-menu="edit"]');
    if (editMenuTrigger) {
      window.RetroOS.createMenu({
        id: 'edit-menu',
        label: 'Edit',
        trigger: editMenuTrigger,
        items: [
          {
            label: 'Undo',
            icon: '↶',
            shortcut: 'Ctrl+Z',
            action: () => console.log('Undo')
          },
          {
            label: 'Redo',
            icon: '↷',
            shortcut: 'Ctrl+Y',
            action: () => console.log('Redo')
          },
          {
            type: 'separator'
          },
          {
            label: 'Cut',
            icon: '✂',
            shortcut: 'Ctrl+X',
            action: () => console.log('Cut')
          },
          {
            label: 'Copy',
            icon: '📋',
            shortcut: 'Ctrl+C',
            action: () => console.log('Copy')
          },
          {
            label: 'Paste',
            icon: '📄',
            shortcut: 'Ctrl+V',
            action: () => console.log('Paste')
          }
        ]
      });
    }

    // View menu
    const viewMenuTrigger = document.querySelector('[data-menu="view"]');
    if (viewMenuTrigger) {
      window.RetroOS.createMenu({
        id: 'view-menu',
        label: 'View',
        trigger: viewMenuTrigger,
        items: [
          {
            label: 'Zoom In',
            shortcut: 'Ctrl++',
            action: () => console.log('Zoom in')
          },
          {
            label: 'Zoom Out',
            shortcut: 'Ctrl+-',
            action: () => console.log('Zoom out')
          },
          {
            label: 'Reset Zoom',
            shortcut: 'Ctrl+0',
            action: () => console.log('Reset zoom')
          },
          {
            type: 'separator'
          },
          {
            label: 'Full Screen',
            shortcut: 'F11',
            action: () => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
              } else {
                document.exitFullscreen();
              }
            }
          }
        ]
      });
    }

    // Help menu
    const helpMenuTrigger = document.querySelector('[data-menu="help"]');
    if (helpMenuTrigger) {
      window.RetroOS.createMenu({
        id: 'help-menu',
        label: 'Help',
        trigger: helpMenuTrigger,
        items: [
          {
            label: 'Documentation',
            icon: '📖',
            action: () => {
              window.RetroOS.createWindow({
                title: 'Documentation',
                content: '<div class="help-content"><h2>RetroOS Museum Documentation</h2><p>Interactive OS recreation system.</p></div>',
                width: 600,
                height: 400
              });
            }
          },
          {
            label: 'Keyboard Shortcuts',
            icon: '⌨',
            action: () => {
              const shortcuts = `
                <div class="shortcuts-content">
                  <h2>Keyboard Shortcuts</h2>
                  <ul>
                    <li><kbd>Alt+F4</kbd> - Close active window</li>
                    <li><kbd>Alt+Tab</kbd> - Switch windows</li>
                    <li><kbd>Ctrl+A</kbd> - Select all (desktop)</li>
                    <li><kbd>Delete</kbd> - Delete selected items</li>
                    <li><kbd>Esc</kbd> - Close menus</li>
                  </ul>
                </div>
              `;
              window.RetroOS.createWindow({
                title: 'Keyboard Shortcuts',
                content: shortcuts,
                width: 400,
                height: 300
              });
            }
          },
          {
            type: 'separator'
          },
          {
            label: 'About',
            action: () => {
              window.RetroOS.notify(
                'About RetroOS Museum',
                'RetroOS Museum v1.0<br>Interactive OS recreation system<br>&copy; 2025'
              );
            }
          }
        ]
      });
    }
  }

  /**
   * Set up demo desktop icons
   */
  function setupDemoIcons() {
    // Example icons
    const icons = [
      {
        id: 'my-computer',
        label: 'My Computer',
        icon: '🖥️',
        x: 0,
        y: 0,
        onOpen: () => {
          window.RetroOS.createWindow({
            title: 'My Computer',
            content: '<div class="computer-content"><h2>My Computer</h2><p>Drives and devices appear here.</p></div>',
            width: 500,
            height: 400
          });
        }
      },
      {
        id: 'documents',
        label: 'My Documents',
        icon: '📁',
        x: 0,
        y: 1,
        onOpen: () => {
          window.RetroOS.createWindow({
            title: 'My Documents',
            content: '<div class="documents-content"><h2>My Documents</h2><p>Your documents folder.</p></div>',
            width: 500,
            height: 400
          });
        }
      },
      {
        id: 'recycle-bin',
        label: 'Recycle Bin',
        icon: '🗑️',
        x: 0,
        y: 2,
        onOpen: () => {
          window.RetroOS.createWindow({
            title: 'Recycle Bin',
            content: '<div class="recycle-content"><h2>Recycle Bin</h2><p>Deleted items appear here.</p></div>',
            width: 400,
            height: 300
          });
        }
      },
      {
        id: 'network',
        label: 'Network',
        icon: '🌐',
        x: 0,
        y: 3,
        onOpen: () => {
          window.RetroOS.createWindow({
            title: 'Network',
            content: '<div class="network-content"><h2>Network</h2><p>Network connections.</p></div>',
            width: 450,
            height: 350
          });
        }
      }
    ];

    icons.forEach(iconConfig => {
      window.RetroOS.addDesktopIcon(iconConfig);
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
