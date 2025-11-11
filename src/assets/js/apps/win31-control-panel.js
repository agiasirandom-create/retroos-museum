/**
 * Windows 3.1 Control Panel
 * System settings and configuration
 */

(function(global) {
  'use strict';

  class Win31ControlPanel {
    constructor(desktop) {
      this.desktop = desktop;
      this.window = null;
    }

    /**
     * Open Control Panel
     */
    open() {
      if (this.window) {
        this.window.focus();
        return;
      }

      const content = this.buildContent();

      this.window = this.desktop.windowManager.createWindow({
        id: 'control-panel',
        title: 'Control Panel',
        content: content,
        width: 480,
        height: 360,
        onClose: () => {
          this.window = null;
        }
      });

      this.attachEventListeners();
    }

    /**
     * Build Control Panel content
     */
    buildContent() {
      const items = [
        { id: 'color', icon: '<¨', label: 'Color' },
        { id: 'fonts', icon: '=$', label: 'Fonts' },
        { id: 'ports', icon: '=', label: 'Ports' },
        { id: 'mouse', icon: '=±', label: 'Mouse' },
        { id: 'desktop', icon: '=¥', label: 'Desktop' },
        { id: 'keyboard', icon: '(', label: 'Keyboard' },
        { id: 'printers', icon: '=¨', label: 'Printers' },
        { id: 'international', icon: '<', label: 'International' },
        { id: 'date-time', icon: '=P', label: 'Date/Time' },
        { id: 'drivers', icon: '=¿', label: 'Drivers' },
        { id: 'sound', icon: '=
', label: 'Sound' },
        { id: '386-enhanced', icon: '™', label: '386 Enhanced' }
      ];

      return `
        <div class="window-menubar">
          <div class="menu-item" data-menu="settings">Settings</div>
          <div class="menu-item" data-menu="help">Help</div>
        </div>
        <div class="control-panel-grid">
          ${items.map(item => `
            <div class="control-panel-item" data-item-id="${item.id}" tabindex="0">
              <div class="control-panel-icon">${item.icon}</div>
              <div class="control-panel-label">${item.label}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
      const windowEl = this.window.element;

      // Control panel items
      const items = windowEl.querySelectorAll('.control-panel-item');
      items.forEach(item => {
        // Single click to select
        item.addEventListener('click', (e) => {
          items.forEach(i => i.classList.remove('selected'));
          item.classList.add('selected');
        });

        // Double click to open
        item.addEventListener('dblclick', (e) => {
          const itemId = item.dataset.itemId;
          this.openControlPanelItem(itemId);
        });

        // Keyboard support
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            const itemId = item.dataset.itemId;
            this.openControlPanelItem(itemId);
          }
        });
      });
    }

    /**
     * Open control panel item
     */
    openControlPanelItem(itemId) {
      switch (itemId) {
        case 'color':
          this.showColorSettings();
          break;

        case 'date-time':
          this.showDateTimeSettings();
          break;

        default:
          this.desktop.showNotImplemented(itemId.replace('-', ' ').toUpperCase() + ' settings');
      }
    }

    /**
     * Show color settings
     */
    showColorSettings() {
      const content = `
        <div class="win31-dialog" style="padding: 16px;">
          <div class="win31-groupbox">
            <div class="groupbox-title">Color Schemes</div>
            <select class="win31-select" style="width: 100%; margin-top: 8px;" size="6">
              <option selected>Windows Default</option>
              <option>Arizona</option>
              <option>Black Leather Jacket</option>
              <option>Bordeaux</option>
              <option>Designer</option>
              <option>Emerald City</option>
              <option>Fluorescent</option>
              <option>Hotdog Stand</option>
              <option>LCD Default Screen Settings</option>
              <option>LCD Reversed - Dark</option>
              <option>Monochrome</option>
              <option>Ocean</option>
              <option>Patchwork</option>
              <option>Plasma Power Saver</option>
              <option>Rugby</option>
              <option>The Blues</option>
              <option>Tweed</option>
              <option>Valentine</option>
              <option>Wingtips</option>
            </select>
          </div>
          <div style="margin-top: 16px; text-align: center;">
            <p style="font-size: 10px;">Note: Color scheme changes are not persistent in this recreation.</p>
          </div>
          <div class="dialog-buttons" style="margin-top: 16px;">
            <button class="win31-button default" onclick="this.closest('.os-window').querySelector('.window-btn-close').click()">OK</button>
            <button class="win31-button" onclick="this.closest('.os-window').querySelector('.window-btn-close').click()">Cancel</button>
          </div>
        </div>
      `;

      this.desktop.windowManager.createWindow({
        id: 'color-settings',
        title: 'Color',
        content: content,
        width: 320,
        height: 350,
        resizable: false,
        maximizable: false
      });
    }

    /**
     * Show date/time settings
     */
    showDateTimeSettings() {
      const now = new Date();
      const dateStr = now.toLocaleDateString();
      const timeStr = now.toLocaleTimeString();

      const content = `
        <div class="win31-dialog" style="padding: 16px;">
          <div class="win31-groupbox">
            <div class="groupbox-title">Date</div>
            <div style="padding: 8px;">
              <input type="text" class="win31-input" value="${dateStr}" style="width: 100%;">
            </div>
          </div>

          <div class="win31-groupbox">
            <div class="groupbox-title">Time</div>
            <div style="padding: 8px;">
              <input type="text" class="win31-input" value="${timeStr}" style="width: 100%;">
            </div>
          </div>

          <div style="margin-top: 16px; text-align: center;">
            <p style="font-size: 10px;">Note: Changes are not persistent in this recreation.</p>
          </div>

          <div class="dialog-buttons" style="margin-top: 16px;">
            <button class="win31-button default" onclick="this.closest('.os-window').querySelector('.window-btn-close').click()">OK</button>
            <button class="win31-button" onclick="this.closest('.os-window').querySelector('.window-btn-close').click()">Cancel</button>
          </div>
        </div>
      `;

      this.desktop.windowManager.createWindow({
        id: 'datetime-settings',
        title: 'Date/Time',
        content: content,
        width: 300,
        height: 320,
        resizable: false,
        maximizable: false
      });
    }
  }

  // Export to global scope
  global.Win31ControlPanel = Win31ControlPanel;

})(typeof window !== 'undefined' ? window : global);
