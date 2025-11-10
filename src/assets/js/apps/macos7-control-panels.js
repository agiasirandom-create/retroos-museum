/**
 * Mac OS System 7 Control Panels
 * System settings and preferences
 */

(function(global) {
  'use strict';

  /**
   * Mac OS 7 Control Panels Application
   */
  class MacOS7ControlPanels {
    constructor(desktop) {
      this.desktop = desktop;
      this.window = null;
    }

    /**
     * Open Control Panels window
     */
    open() {
      if (this.window) {
        this.window.focus();
        return;
      }

      const content = this._buildContent();

      this.window = this.desktop.createAppWindow({
        id: 'control-panels',
        title: 'Control Panels',
        content: content,
        width: 400,
        height: 300,
        resizable: true,
        onClose: () => {
          this.window = null;
          return true;
        }
      });

      this._attachEventListeners();
    }

    /**
     * Build Control Panels content
     * @private
     */
    _buildContent() {
      const panels = this._getControlPanels();

      let html = '<div class="control-panels-grid">';

      panels.forEach(panel => {
        html += `
          <div class="control-panel-item" data-panel="${panel.id}">
            ${this._getPanelIcon(panel.id)}
            <span>${panel.name}</span>
          </div>
        `;
      });

      html += '</div>';

      return html;
    }

    /**
     * Get available control panels
     * @private
     */
    _getControlPanels() {
      return [
        { id: 'general', name: 'General Controls' },
        { id: 'sound', name: 'Sound' },
        { id: 'monitors', name: 'Monitors' },
        { id: 'mouse', name: 'Mouse' },
        { id: 'keyboard', name: 'Keyboard' },
        { id: 'date-time', name: 'Date & Time' },
        { id: 'memory', name: 'Memory' },
        { id: 'startup-disk', name: 'Startup Disk' }
      ];
    }

    /**
     * Get control panel icon
     * @param {string} panelId - Panel ID
     * @private
     */
    _getPanelIcon(panelId) {
      const icons = {
        'general': `
          <svg width="48" height="48" viewBox="0 0 48 48">
            <rect x="8" y="8" width="32" height="32" fill="#ffffff" stroke="#000" stroke-width="2"/>
            <circle cx="24" cy="24" r="8" fill="#0000cc"/>
            <line x1="16" y1="16" x2="32" y2="32" stroke="#000" stroke-width="2"/>
          </svg>
        `,
        'sound': `
          <svg width="48" height="48" viewBox="0 0 48 48">
            <path d="M16 18 L16 30 L24 30 L32 36 L32 12 Z" fill="#ffffff" stroke="#000" stroke-width="2"/>
            <path d="M34 18 Q38 24 34 30" stroke="#000" stroke-width="2" fill="none"/>
          </svg>
        `,
        'monitors': `
          <svg width="48" height="48" viewBox="0 0 48 48">
            <rect x="8" y="12" width="32" height="20" fill="#0000cc" stroke="#000" stroke-width="2"/>
            <rect x="8" y="12" width="32" height="2" fill="#cccccc" stroke="#000" stroke-width="1"/>
            <rect x="18" y="32" width="12" height="4" fill="#cccccc" stroke="#000" stroke-width="1"/>
          </svg>
        `,
        'mouse': `
          <svg width="48" height="48" viewBox="0 0 48 48">
            <rect x="16" y="12" width="16" height="24" rx="8" fill="#ffffff" stroke="#000" stroke-width="2"/>
            <line x1="24" y1="12" x2="24" y2="24" stroke="#000" stroke-width="2"/>
            <circle cx="24" cy="20" r="2" fill="#000"/>
          </svg>
        `,
        'keyboard': `
          <svg width="48" height="48" viewBox="0 0 48 48">
            <rect x="8" y="18" width="32" height="16" fill="#ffffff" stroke="#000" stroke-width="2"/>
            <rect x="12" y="22" width="4" height="4" fill="#cccccc" stroke="#000" stroke-width="1"/>
            <rect x="18" y="22" width="4" height="4" fill="#cccccc" stroke="#000" stroke-width="1"/>
            <rect x="24" y="22" width="4" height="4" fill="#cccccc" stroke="#000" stroke-width="1"/>
            <rect x="30" y="22" width="4" height="4" fill="#cccccc" stroke="#000" stroke-width="1"/>
          </svg>
        `,
        'date-time': `
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="14" fill="#ffffff" stroke="#000" stroke-width="2"/>
            <line x1="24" y1="24" x2="24" y2="14" stroke="#000" stroke-width="2"/>
            <line x1="24" y1="24" x2="30" y2="24" stroke="#000" stroke-width="2"/>
          </svg>
        `,
        'memory': `
          <svg width="48" height="48" viewBox="0 0 48 48">
            <rect x="12" y="16" width="24" height="16" fill="#ffffff" stroke="#000" stroke-width="2"/>
            <line x1="16" y1="16" x2="16" y2="32" stroke="#000" stroke-width="1"/>
            <line x1="20" y1="16" x2="20" y2="32" stroke="#000" stroke-width="1"/>
            <line x1="24" y1="16" x2="24" y2="32" stroke="#000" stroke-width="1"/>
            <line x1="28" y1="16" x2="28" y2="32" stroke="#000" stroke-width="1"/>
            <line x1="32" y1="16" x2="32" y2="32" stroke="#000" stroke-width="1"/>
          </svg>
        `,
        'startup-disk': `
          <svg width="48" height="48" viewBox="0 0 48 48">
            <rect x="12" y="16" width="24" height="18" fill="#ffffff" stroke="#000" stroke-width="2"/>
            <rect x="12" y="16" width="24" height="4" fill="#cccccc" stroke="#000" stroke-width="1"/>
            <circle cx="32" cy="18" r="1.5" fill="#000"/>
          </svg>
        `
      };

      return icons[panelId] || icons['general'];
    }

    /**
     * Attach event listeners
     * @private
     */
    _attachEventListeners() {
      if (!this.window) return;

      const contentArea = this.window.element.querySelector('.window-content');
      if (!contentArea) return;

      // Click to open control panel
      contentArea.addEventListener('click', (e) => {
        const panelItem = e.target.closest('.control-panel-item');
        if (panelItem) {
          this._openPanel(panelItem.dataset.panel);
        }
      });

      // Double click to open (Mac behavior)
      let lastClickTime = 0;
      let lastClickedPanel = null;

      contentArea.addEventListener('click', (e) => {
        const panelItem = e.target.closest('.control-panel-item');
        if (!panelItem) return;

        const now = Date.now();
        if (panelItem === lastClickedPanel && now - lastClickTime < 300) {
          this._openPanel(panelItem.dataset.panel);
        }

        lastClickedPanel = panelItem;
        lastClickTime = now;
      });
    }

    /**
     * Open specific control panel
     * @param {string} panelId - Panel ID
     * @private
     */
    _openPanel(panelId) {
      console.log('Opening control panel:', panelId);

      const panelName = this._getPanelName(panelId);
      const content = this._getPanelContent(panelId);

      this.desktop.createAppWindow({
        id: 'control-panel-' + panelId,
        title: panelName,
        content: content,
        width: 320,
        height: 240,
        resizable: false
      });
    }

    /**
     * Get panel name
     * @param {string} panelId - Panel ID
     * @private
     */
    _getPanelName(panelId) {
      const names = {
        'general': 'General Controls',
        'sound': 'Sound',
        'monitors': 'Monitors',
        'mouse': 'Mouse',
        'keyboard': 'Keyboard',
        'date-time': 'Date & Time',
        'memory': 'Memory',
        'startup-disk': 'Startup Disk'
      };

      return names[panelId] || 'Control Panel';
    }

    /**
     * Get panel content
     * @param {string} panelId - Panel ID
     * @private
     */
    _getPanelContent(panelId) {
      const contents = {
        'general': this._buildGeneralControls(),
        'sound': this._buildSoundPanel(),
        'monitors': this._buildMonitorsPanel(),
        'mouse': this._buildMousePanel(),
        'keyboard': this._buildKeyboardPanel(),
        'date-time': this._buildDateTimePanel(),
        'memory': this._buildMemoryPanel(),
        'startup-disk': this._buildStartupDiskPanel()
      };

      return contents[panelId] || '<div style="padding: 20px;">Control panel content</div>';
    }

    /**
     * Build General Controls panel
     * @private
     */
    _buildGeneralControls() {
      return `
        <div style="padding: 16px;">
          <div class="mac-group">
            <div class="mac-group-title">Desktop</div>
            <label style="display: block; margin: 4px 0;">
              <input type="checkbox" checked> Show Desktop Pattern
            </label>
            <label style="display: block; margin: 4px 0;">
              <input type="checkbox"> Blink Insertion Point
            </label>
          </div>
          <div class="mac-group">
            <div class="mac-group-title">Menu Blinking</div>
            <label style="display: block; margin: 4px 0;">
              Off <input type="range" min="0" max="3" value="1" style="width: 100px;"> 3
            </label>
          </div>
        </div>
      `;
    }

    /**
     * Build Sound panel
     * @private
     */
    _buildSoundPanel() {
      return `
        <div style="padding: 16px;">
          <div class="mac-group">
            <div class="mac-group-title">Alert Sound</div>
            <select class="mac-input" style="width: 100%; margin: 8px 0;">
              <option>Simple Beep</option>
              <option>Sosumi</option>
              <option>Quack</option>
            </select>
          </div>
          <div class="mac-group">
            <div class="mac-group-title">Volume</div>
            <input type="range" min="0" max="7" value="4" style="width: 100%;">
          </div>
        </div>
      `;
    }

    /**
     * Build Monitors panel
     * @private
     */
    _buildMonitorsPanel() {
      return `
        <div style="padding: 16px;">
          <div class="mac-group">
            <div class="mac-group-title">Monitor Settings</div>
            <p style="margin: 8px 0;"><strong>Resolution:</strong> 640 x 480</p>
            <p style="margin: 8px 0;"><strong>Colors:</strong> 256</p>
          </div>
          <div style="margin-top: 16px;">
            <button class="mac-button">Options...</button>
          </div>
        </div>
      `;
    }

    /**
     * Build Mouse panel
     * @private
     */
    _buildMousePanel() {
      return `
        <div style="padding: 16px;">
          <div class="mac-group">
            <div class="mac-group-title">Mouse Tracking</div>
            <label style="display: block; margin: 8px 0;">
              Very Slow <input type="range" min="0" max="4" value="2" style="width: 120px;"> Fast
            </label>
          </div>
          <div class="mac-group">
            <div class="mac-group-title">Double-Click Speed</div>
            <label style="display: block; margin: 8px 0;">
              Slow <input type="range" min="0" max="4" value="2" style="width: 120px;"> Fast
            </label>
          </div>
        </div>
      `;
    }

    /**
     * Build Keyboard panel
     * @private
     */
    _buildKeyboardPanel() {
      return `
        <div style="padding: 16px;">
          <div class="mac-group">
            <div class="mac-group-title">Key Repeat Rate</div>
            <label style="display: block; margin: 8px 0;">
              Slow <input type="range" min="0" max="4" value="2" style="width: 120px;"> Fast
            </label>
          </div>
          <div class="mac-group">
            <div class="mac-group-title">Delay Until Repeat</div>
            <label style="display: block; margin: 8px 0;">
              Long <input type="range" min="0" max="4" value="2" style="width: 120px;"> Short
            </label>
          </div>
        </div>
      `;
    }

    /**
     * Build Date & Time panel
     * @private
     */
    _buildDateTimePanel() {
      const now = new Date();
      const dateStr = now.toLocaleDateString();
      const timeStr = now.toLocaleTimeString();

      return `
        <div style="padding: 16px;">
          <div class="mac-group">
            <div class="mac-group-title">Current Date and Time</div>
            <p style="margin: 8px 0;"><strong>Date:</strong> ${dateStr}</p>
            <p style="margin: 8px 0;"><strong>Time:</strong> ${timeStr}</p>
          </div>
          <div style="margin-top: 16px;">
            <button class="mac-button">Set Date...</button>
            <button class="mac-button">Set Time...</button>
          </div>
        </div>
      `;
    }

    /**
     * Build Memory panel
     * @private
     */
    _buildMemoryPanel() {
      return `
        <div style="padding: 16px;">
          <div class="mac-group">
            <div class="mac-group-title">Memory Information</div>
            <p style="margin: 8px 0;"><strong>Total Memory:</strong> 16,384 K</p>
            <p style="margin: 8px 0;"><strong>System Software:</strong> 4,096 K</p>
            <p style="margin: 8px 0;"><strong>Largest Unused Block:</strong> 12,288 K</p>
          </div>
          <div class="mac-group">
            <div class="mac-group-title">Virtual Memory</div>
            <label style="display: block; margin: 4px 0;">
              <input type="checkbox"> On
            </label>
          </div>
        </div>
      `;
    }

    /**
     * Build Startup Disk panel
     * @private
     */
    _buildStartupDiskPanel() {
      return `
        <div style="padding: 16px;">
          <div class="mac-group">
            <div class="mac-group-title">Select Startup Disk</div>
            <div style="padding: 16px; border: 1px solid #000; margin: 8px 0; background: #fff;">
              <label style="display: block; margin: 4px 0;">
                <input type="radio" name="startup" checked> Macintosh HD
              </label>
            </div>
          </div>
          <div style="margin-top: 16px;">
            <button class="mac-button default">Restart</button>
          </div>
        </div>
      `;
    }
  }

  // Export to global scope
  global.MacOS7ControlPanels = MacOS7ControlPanels;

})(typeof window !== 'undefined' ? window : global);
