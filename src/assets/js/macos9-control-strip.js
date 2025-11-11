/**
 * Mac OS 9 Control Strip
 * Collapsible control strip with system controls
 */

(function(global) {
  'use strict';

  class MacOS9ControlStrip {
    constructor(desktop) {
      this.desktop = desktop;
      this.container = null;
      this.collapsed = true;
      this.initialized = false;
    }

    init(container) {
      if (this.initialized) return this;

      this.container = typeof container === 'string'
        ? document.querySelector(container)
        : container;

      if (!this.container) {
        throw new Error('Control Strip container not found');
      }

      this._buildControlStrip();
      this._attachEventListeners();
      this.initialized = true;

      return this;
    }

    _buildControlStrip() {
      // Tab to expand/collapse
      const tab = document.createElement('div');
      tab.className = 'macos9-control-strip-tab';
      tab.textContent = '\u25C0';
      tab.title = 'Show Control Strip';
      tab.addEventListener('click', () => this.toggle());
      this.container.appendChild(tab);
      this.tab = tab;

      // Modules
      this._addModule('Volume', '\u266B', () => this._showVolumeControl());
      this._addModule('Monitor', '\u25A0', () => this._showMonitorControl());
      this._addModule('Battery', '\u26A1', () => this._showBatteryInfo());
      this._addModule('Network', '\u2303', () => this._showNetworkInfo());
    }

    _addModule(name, icon, action) {
      const module = document.createElement('div');
      module.className = 'macos9-control-strip-module';
      module.textContent = icon;
      module.title = name;
      module.addEventListener('click', action);
      this.container.appendChild(module);
    }

    toggle() {
      this.collapsed = !this.collapsed;
      if (this.collapsed) {
        this.container.classList.add('collapsed');
        this.tab.textContent = '\u25C0';
        this.tab.title = 'Show Control Strip';
      } else {
        this.container.classList.remove('collapsed');
        this.tab.textContent = '\u25B6';
        this.tab.title = 'Hide Control Strip';
      }
    }

    _attachEventListeners() {
      // Auto-collapse when clicking outside
      document.addEventListener('click', (e) => {
        if (!this.container.contains(e.target) && !this.collapsed) {
          // Optional: auto-collapse
        }
      });
    }

    _showVolumeControl() {
      this.desktop._showAlert('Volume Control (demo)');
    }

    _showMonitorControl() {
      this.desktop._showAlert('Monitor Settings (demo)');
    }

    _showBatteryInfo() {
      this.desktop._showAlert('Battery: 100% charged');
    }

    _showNetworkInfo() {
      this.desktop._showAlert('Network: Connected');
    }
  }

  global.MacOS9ControlStrip = MacOS9ControlStrip;

})(typeof window !== 'undefined' ? window : global);
