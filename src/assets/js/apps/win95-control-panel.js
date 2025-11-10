/**
 * Windows 95 Control Panel
 * System settings and configuration
 */

(function(global) {
  'use strict';

  class Win95ControlPanel {
    constructor(windowManager) {
      this.windowManager = windowManager;
      this.window = null;
    }

    /**
     * Open Control Panel
     */
    open() {
      const windowContent = this.createContent();

      this.window = this.windowManager.createWindow({
        id: 'control-panel',
        title: 'Control Panel',
        width: 560,
        height: 420,
        minWidth: 400,
        minHeight: 300,
        content: windowContent
      });

      this.setupEventListeners();
    }

    /**
     * Create window content
     */
    createContent() {
      const items = this.getControlPanelItems();

      return `
        <div class="control-panel-container" style="
          display: flex;
          flex-direction: column;
          height: 100%;
          background: white;
        ">
          <!-- Toolbar -->
          <div class="control-panel-toolbar" style="
            background: #c0c0c0;
            border-bottom: 2px solid #808080;
            padding: 4px;
            display: flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;
          ">
            <span style="font-size: 11px; font-weight: bold;">View:</span>
            <select style="padding: 2px; font-size: 11px;">
              <option>Large Icons</option>
              <option>Small Icons</option>
              <option>List</option>
              <option>Details</option>
            </select>
          </div>

          <!-- Items Grid -->
          <div class="control-panel-items" style="
            flex: 1;
            padding: 16px;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 16px;
            overflow-y: auto;
            align-content: start;
          ">
            ${items.map(item => `
              <div class="control-panel-item" data-item-id="${item.id}" style="
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
                padding: 8px;
                text-align: center;
              ">
                <div style="font-size: 32px; margin-bottom: 8px;">
                  ${item.icon}
                </div>
                <div style="font-size: 11px; word-wrap: break-word; max-width: 100%;">
                  ${item.name}
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Status Bar -->
          <div class="control-panel-status" style="
            background: #c0c0c0;
            border-top: 2px solid #fff;
            padding: 4px 8px;
            font-size: 11px;
            flex-shrink: 0;
          ">
            <span>${items.length} object(s)</span>
          </div>
        </div>
      `;
    }

    /**
     * Get Control Panel items
     */
    getControlPanelItems() {
      return [
        {
          id: 'display',
          name: 'Display',
          icon: '🖥️',
          action: () => this.openDisplay()
        },
        {
          id: 'mouse',
          name: 'Mouse',
          icon: '🖱️',
          action: () => this.showComingSoon('Mouse Properties')
        },
        {
          id: 'keyboard',
          name: 'Keyboard',
          icon: '⌨️',
          action: () => this.showComingSoon('Keyboard Properties')
        },
        {
          id: 'system',
          name: 'System',
          icon: '💻',
          action: () => this.openSystem()
        },
        {
          id: 'add-remove',
          name: 'Add/Remove Programs',
          icon: '💿',
          action: () => this.showComingSoon('Add/Remove Programs')
        },
        {
          id: 'network',
          name: 'Network',
          icon: '🌐',
          action: () => this.showComingSoon('Network Properties')
        },
        {
          id: 'sounds',
          name: 'Sounds',
          icon: '🔊',
          action: () => this.showComingSoon('Sounds Properties')
        },
        {
          id: 'printers',
          name: 'Printers',
          icon: '🖨️',
          action: () => this.showComingSoon('Printers')
        },
        {
          id: 'fonts',
          name: 'Fonts',
          icon: '🅰️',
          action: () => this.showComingSoon('Fonts')
        },
        {
          id: 'date-time',
          name: 'Date/Time',
          icon: '🕐',
          action: () => this.openDateTime()
        },
        {
          id: 'regional',
          name: 'Regional Settings',
          icon: '🌍',
          action: () => this.showComingSoon('Regional Settings')
        },
        {
          id: 'accessibility',
          name: 'Accessibility',
          icon: '♿',
          action: () => this.showComingSoon('Accessibility Options')
        }
      ];
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
      const items = this.window.element.querySelectorAll('.control-panel-item');
      items.forEach(item => {
        const itemId = item.getAttribute('data-item-id');
        const itemConfig = this.getControlPanelItems().find(i => i.id === itemId);

        if (itemConfig) {
          // Hover effect
          item.addEventListener('mouseenter', () => {
            item.style.background = '#e0e0e0';
          });

          item.addEventListener('mouseleave', () => {
            item.style.background = 'transparent';
          });

          // Double-click to open
          let lastClick = 0;
          item.addEventListener('click', () => {
            const now = Date.now();
            if (now - lastClick < 300) {
              // Double-click
              if (itemConfig.action) {
                itemConfig.action();
              }
            }
            lastClick = now;
          });
        }
      });
    }

    /**
     * Open Display Properties
     */
    openDisplay() {
      this.windowManager.createWindow({
        id: 'display-properties',
        title: 'Display Properties',
        width: 400,
        height: 450,
        content: `
          <div style="padding: 16px; font-family: 'MS Sans Serif', sans-serif; font-size: 11px;">
            <div style="
              border: 2px inset;
              background: #008080;
              height: 200px;
              margin-bottom: 16px;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
            ">
              <div style="
                width: 120px;
                height: 90px;
                background: #c0c0c0;
                border: 2px outset;
                box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
              ">
                <div style="
                  background: linear-gradient(90deg, #000080, #0997ff);
                  color: white;
                  padding: 2px 4px;
                  font-size: 9px;
                  font-weight: bold;
                ">
                  Monitor Preview
                </div>
              </div>
            </div>

            <!-- Tabs -->
            <div style="border-bottom: 2px solid #808080; margin-bottom: 16px;">
              <button class="retro-button--win95" style="margin-right: 4px; padding: 4px 12px;">
                Background
              </button>
              <button class="retro-button--win95" style="margin-right: 4px; padding: 4px 12px;">
                Screen Saver
              </button>
              <button class="retro-button--win95" style="margin-right: 4px; padding: 4px 12px;">
                Appearance
              </button>
              <button class="retro-button--win95" style="padding: 4px 12px;">
                Settings
              </button>
            </div>

            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 4px;">Pattern:</label>
              <select style="width: 100%; padding: 2px;">
                <option>(None)</option>
                <option>Boxes</option>
                <option>Diamonds</option>
                <option>Weave</option>
              </select>
            </div>

            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 4px;">Wallpaper:</label>
              <select style="width: 100%; padding: 2px;">
                <option>(None)</option>
                <option>Clouds</option>
                <option>Setup</option>
                <option>Waves</option>
              </select>
            </div>

            <div style="text-align: center; margin-top: 24px;">
              <button onclick="this.closest('.os-window').querySelector('.window-btn-close').click()"
                      class="retro-button--win95" style="min-width: 80px; margin-right: 8px;">
                OK
              </button>
              <button onclick="this.closest('.os-window').querySelector('.window-btn-close').click()"
                      class="retro-button--win95" style="min-width: 80px; margin-right: 8px;">
                Cancel
              </button>
              <button onclick="alert('Apply clicked')"
                      class="retro-button--win95" style="min-width: 80px;">
                Apply
              </button>
            </div>
          </div>
        `,
        resizable: false,
        maximizable: false
      });
    }

    /**
     * Open System Properties
     */
    openSystem() {
      this.windowManager.createWindow({
        id: 'system-properties',
        title: 'System Properties',
        width: 400,
        height: 400,
        content: `
          <div style="padding: 16px; font-family: 'MS Sans Serif', sans-serif; font-size: 11px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: #000080; margin-bottom: 8px;">System Properties</h2>
            </div>

            <div style="border: 2px inset; padding: 16px; margin-bottom: 16px; background: white;">
              <p style="margin-bottom: 8px;">
                <strong>System:</strong>
              </p>
              <p style="margin-bottom: 8px; padding-left: 16px;">
                Microsoft Windows 95<br>
                4.00.950
              </p>

              <p style="margin-bottom: 8px; margin-top: 16px;">
                <strong>Registered to:</strong>
              </p>
              <p style="margin-bottom: 8px; padding-left: 16px;">
                RetroOS Museum User<br>
                12345-OEM-0000001-00000
              </p>

              <p style="margin-bottom: 8px; margin-top: 16px;">
                <strong>Computer:</strong>
              </p>
              <p style="padding-left: 16px;">
                x86-based PC<br>
                32,768 KB RAM
              </p>
            </div>

            <div style="text-align: center; margin-top: 24px;">
              <button onclick="this.closest('.os-window').querySelector('.window-btn-close').click()"
                      class="retro-button--win95" style="min-width: 80px;">
                OK
              </button>
            </div>
          </div>
        `,
        resizable: false,
        maximizable: false
      });
    }

    /**
     * Open Date/Time Properties
     */
    openDateTime() {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });

      this.windowManager.createWindow({
        id: 'date-time-properties',
        title: 'Date/Time Properties',
        width: 350,
        height: 350,
        content: `
          <div style="padding: 16px; font-family: 'MS Sans Serif', sans-serif; font-size: 11px;">
            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 8px; font-weight: bold;">Date</label>
              <div style="border: 2px inset; padding: 8px; background: white;">
                <input type="date" value="${now.toISOString().split('T')[0]}"
                       style="width: 100%; padding: 4px; border: 1px solid #808080; font-size: 11px;">
              </div>
            </div>

            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 8px; font-weight: bold;">Time</label>
              <div style="border: 2px inset; padding: 8px; background: white;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <input type="time" value="${now.toTimeString().slice(0, 5)}"
                         style="flex: 1; padding: 4px; border: 1px solid #808080; font-size: 11px;">
                  <button class="retro-button--win95" style="padding: 2px 8px;">
                    ▲
                  </button>
                  <button class="retro-button--win95" style="padding: 2px 8px;">
                    ▼
                  </button>
                </div>
                <div style="margin-top: 8px; font-size: 10px; color: #666;">
                  Current time: ${timeString}
                </div>
              </div>
            </div>

            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 8px; font-weight: bold;">Time Zone</label>
              <select style="width: 100%; padding: 4px; border: 2px inset; font-size: 11px;">
                <option>(GMT-08:00) Pacific Time (US & Canada)</option>
                <option>(GMT-05:00) Eastern Time (US & Canada)</option>
                <option>(GMT) Greenwich Mean Time</option>
              </select>
            </div>

            <div style="text-align: center; margin-top: 24px;">
              <button onclick="this.closest('.os-window').querySelector('.window-btn-close').click()"
                      class="retro-button--win95" style="min-width: 80px; margin-right: 8px;">
                OK
              </button>
              <button onclick="this.closest('.os-window').querySelector('.window-btn-close').click()"
                      class="retro-button--win95" style="min-width: 80px; margin-right: 8px;">
                Cancel
              </button>
              <button onclick="alert('Apply clicked')"
                      class="retro-button--win95" style="min-width: 80px;">
                Apply
              </button>
            </div>
          </div>
        `,
        resizable: false,
        maximizable: false
      });
    }

    /**
     * Show coming soon dialog
     */
    showComingSoon(feature) {
      this.windowManager.createWindow({
        id: `coming-soon-${Date.now()}`,
        title: feature,
        width: 300,
        height: 150,
        content: `
          <div style="padding: 24px; text-align: center; font-family: 'MS Sans Serif', sans-serif; font-size: 11px;">
            <p style="margin-bottom: 16px;">
              ${feature} is not yet available in this simulation.
            </p>
            <button onclick="this.closest('.os-window').querySelector('.window-btn-close').click()"
                    class="retro-button--win95" style="min-width: 80px;">
              OK
            </button>
          </div>
        `,
        resizable: false,
        maximizable: false
      });
    }
  }

  // Export to global scope
  global.Win95ControlPanel = Win95ControlPanel;

})(typeof window !== 'undefined' ? window : global);
