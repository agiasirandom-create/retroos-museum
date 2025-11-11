/**
 * Mac OS 9 Control Panels
 * System settings and preferences
 */

(function(global) {
  'use strict';

  class MacOS9ControlPanels {
    constructor(desktop) {
      this.desktop = desktop;
      this.panels = this._getPanels();
    }

    open() {
      const content = this._buildControlPanelsContent();

      this.window = this.desktop.createAppWindow({
        id: 'control-panels',
        title: 'Control Panels',
        content: content,
        width: 560,
        height: 420,
        resizable: true
      });

      this._attachListeners();
    }

    _getPanels() {
      return [
        { id: 'appearance', name: 'Appearance', icon: '\uD83C\uDFA8' },
        { id: 'controlstrip', name: 'Control Strip', icon: '\u2630' },
        { id: 'datetime', name: 'Date & Time', icon: '\uD83D\uDD52' },
        { id: 'extensions', name: 'Extensions Manager', icon: '\uD83D\uDCE6' },
        { id: 'filesharing', name: 'File Sharing', icon: '\uD83D\uDCC2' },
        { id: 'keyboard', name: 'Keyboard', icon: '\u2328' },
        { id: 'monitors', name: 'Monitors', icon: '\uD83D\uDDA5' },
        { id: 'mouse', name: 'Mouse', icon: '\uD83D\uDDB1' },
        { id: 'network', name: 'TCP/IP', icon: '\uD83C\uDF10' },
        { id: 'sound', name: 'Sound', icon: '\uD83D\uDD0A' },
        { id: 'startup', name: 'Startup Disk', icon: '\uD83D\uDCBD' },
        { id: 'users', name: 'Multiple Users', icon: '\uD83D\uDC65' }
      ];
    }

    _buildControlPanelsContent() {
      let html = '<div class="control-panels-grid">';
      this.panels.forEach(panel => {
        html += '<div class="control-panel-item" data-panel="' + panel.id + '"><div style="font-size: 48px;">' + panel.icon + '</div><span>' + panel.name + '</span></div>';
      });
      html += '</div>';
      return html;
    }

    _attachListeners() {
      if (!this.window || !this.window.element) return;

      const items = this.window.element.querySelectorAll('.control-panel-item');
      items.forEach(item => {
        item.addEventListener('dblclick', () => {
          const panelId = item.getAttribute('data-panel');
          this._openPanel(panelId);
        });
      });
    }

    _openPanel(panelId) {
      const panel = this.panels.find(p => p.id === panelId);
      if (panel) {
        this._showPanelWindow(panel);
      }
    }

    _showPanelWindow(panel) {
      let content = '';

      switch (panel.id) {
        case 'appearance':
          content = this._buildAppearancePanel();
          break;
        case 'sound':
          content = this._buildSoundPanel();
          break;
        case 'monitors':
          content = this._buildMonitorsPanel();
          break;
        default:
          content = '<div style="padding: 40px; text-align: center; color: #666;">' + panel.name + ' control panel<br>(Demo mode)</div>';
      }

      this.desktop.createAppWindow({
        id: 'panel-' + panel.id,
        title: panel.name,
        content: content,
        width: 420,
        height: 380,
        resizable: false
      });
    }

    _buildAppearancePanel() {
      return '<div style="padding: 20px;"><div class="mac9-group"><div class="mac9-group-title">Theme</div><select class="mac9-input" style="width: 100%; margin: 8px 0;"><option>Platinum</option><option>High-Tech</option><option>Drawing Board</option></select></div><div class="mac9-group" style="margin-top: 16px;"><div class="mac9-group-title">Desktop Picture</div><button class="mac9-button">Choose Picture...</button></div><div class="mac9-group" style="margin-top: 16px;"><div class="mac9-group-title">Highlight Color</div><div style="display: flex; gap: 8px; margin: 8px 0;"><div style="width: 32px; height: 32px; background: #3366FF; border: 2px solid #000; cursor: pointer;"></div><div style="width: 32px; height: 32px; background: #FF0000; border: 1px solid #000; cursor: pointer;"></div><div style="width: 32px; height: 32px; background: #00CC00; border: 1px solid #000; cursor: pointer;"></div></div></div><div style="margin-top: 20px; text-align: right;"><button class="mac9-button default">OK</button></div></div>';
    }

    _buildSoundPanel() {
      return '<div style="padding: 20px;"><div class="mac9-group"><div class="mac9-group-title">Alert Sound</div><select class="mac9-input" style="width: 100%; margin: 8px 0;"><option>Sosumi</option><option>Quack</option><option>Wild Eep</option><option>Droplet</option></select><button class="mac9-button" style="margin-top: 8px;">Play</button></div><div class="mac9-group" style="margin-top: 16px;"><div class="mac9-group-title">Volume</div><input type="range" min="0" max="100" value="75" style="width: 100%; margin: 8px 0;"></div><div style="margin-top: 20px; text-align: right;"><button class="mac9-button default">OK</button></div></div>';
    }

    _buildMonitorsPanel() {
      return '<div style="padding: 20px;"><div class="mac9-group"><div class="mac9-group-title">Resolution</div><select class="mac9-input" style="width: 100%; margin: 8px 0;"><option>800 x 600</option><option>1024 x 768</option><option>1280 x 1024</option></select></div><div class="mac9-group" style="margin-top: 16px;"><div class="mac9-group-title">Colors</div><select class="mac9-input" style="width: 100%; margin: 8px 0;"><option>Millions</option><option>Thousands</option><option>256</option></select></div><div style="margin-top: 20px; text-align: right;"><button class="mac9-button default">OK</button></div></div>';
    }
  }

  global.MacOS9ControlPanels = MacOS9ControlPanels;

})(typeof window !== 'undefined' ? window : global);
