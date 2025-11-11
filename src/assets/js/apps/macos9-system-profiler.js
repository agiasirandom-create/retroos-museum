/**
 * Mac OS 9 Apple System Profiler
 * System information display
 */

(function(global) {
  'use strict';

  class MacOS9SystemProfiler {
    constructor(desktop) {
      this.desktop = desktop;
    }

    open() {
      const content = this._buildProfilerContent();

      this.window = this.desktop.createAppWindow({
        id: 'system-profiler',
        title: 'Apple System Profiler',
        content: content,
        width: 560,
        height: 480,
        resizable: true
      });

      this._attachListeners();
    }

    _buildProfilerContent() {
      return '<div style="height: 100%; display: flex; flex-direction: column;"><div class="mac9-tabs"><div class="mac9-tab active" data-tab="system">System Profile</div><div class="mac9-tab" data-tab="devices">Devices and Volumes</div><div class="mac9-tab" data-tab="extensions">Extensions</div></div><div style="padding: 16px; flex: 1; overflow: auto;"><div id="profiler-content">' + this._renderSystemTab() + '</div></div></div>';
    }

    _renderSystemTab() {
      return '<div style="font-family: var(--mac9-monaco); font-size: 11px; line-height: 1.6;"><div class="mac9-group"><div class="mac9-group-title">System Software Overview</div><p style="margin: 4px 0;"><strong>System:</strong> Mac OS 9.2.2</p><p style="margin: 4px 0;"><strong>Finder:</strong> 9.2.2</p><p style="margin: 4px 0;"><strong>System Enabler:</strong> None required</p><p style="margin: 4px 0;"><strong>QuickTime:</strong> 6.0.3</p><p style="margin: 4px 0;"><strong>CarbonLib:</strong> 1.6</p></div><div class="mac9-group" style="margin-top: 12px;"><div class="mac9-group-title">Hardware Overview</div><p style="margin: 4px 0;"><strong>Machine Model:</strong> Power Macintosh G4</p><p style="margin: 4px 0;"><strong>CPU Type:</strong> PowerPC G4 (7447A)</p><p style="margin: 4px 0;"><strong>CPU Speed:</strong> 1.25 GHz</p><p style="margin: 4px 0;"><strong>L2 Cache:</strong> 512 KB</p><p style="margin: 4px 0;"><strong>Bus Speed:</strong> 167 MHz</p><p style="margin: 4px 0;"><strong>Built-in Memory:</strong> 256 MB</p><p style="margin: 4px 0;"><strong>ROM Version:</strong> $077D.45F1</p></div><div class="mac9-group" style="margin-top: 12px;"><div class="mac9-group-title">Network Overview</div><p style="margin: 4px 0;"><strong>Built-in Ethernet:</strong> Active</p><p style="margin: 4px 0;"><strong>AppleTalk:</strong> Active</p><p style="margin: 4px 0;"><strong>TCP/IP:</strong> Configured</p><p style="margin: 4px 0;"><strong>IP Address:</strong> 192.168.1.100</p></div></div>';
    }

    _renderDevicesTab() {
      return '<div style="font-family: var(--mac9-monaco); font-size: 11px; line-height: 1.6;"><div class="mac9-group"><div class="mac9-group-title">Disk Drives</div><p style="margin: 4px 0;"><strong>Macintosh HD</strong></p><p style="margin: 4px 0 4px 16px;">Capacity: 40 GB</p><p style="margin: 4px 0 4px 16px;">Available: 35.8 GB</p><p style="margin: 4px 0 4px 16px;">Format: Mac OS Extended</p></div><div class="mac9-group" style="margin-top: 12px;"><div class="mac9-group-title">CD/DVD Drives</div><p style="margin: 4px 0;"><strong>MATSHITA DVD-ROM SR-8585</strong></p><p style="margin: 4px 0 4px 16px;">Type: DVD-ROM</p><p style="margin: 4px 0 4px 16px;">Read Speed: 24x</p></div><div class="mac9-group" style="margin-top: 12px;"><div class="mac9-group-title">USB Devices</div><p style="margin: 4px 0;">Apple Pro Keyboard</p><p style="margin: 4px 0;">Apple Pro Mouse</p></div></div>';
    }

    _renderExtensionsTab() {
      return '<div style="font-family: var(--mac9-monaco); font-size: 11px; line-height: 1.6;"><div class="mac9-group"><div class="mac9-group-title">System Extensions</div><p style="margin: 4px 0;">AppleScript (1.8.3)</p><p style="margin: 4px 0;">ATI 3D Accelerator (4.7.6)</p><p style="margin: 4px 0;">ColorSync (2.6.1)</p><p style="margin: 4px 0;">File Sharing Extension (9.2.2)</p><p style="margin: 4px 0;">QuickTime (6.0.3)</p><p style="margin: 4px 0;">Sound Manager (3.6.3)</p><p style="margin: 4px 0;">USB Device Extension (1.5.5)</p><p style="margin: 8px 0; font-style: italic; color: #666;">...and 47 more extensions</p></div></div>';
    }

    _attachListeners() {
      if (!this.window || !this.window.element) return;

      const tabs = this.window.element.querySelectorAll('.mac9-tab');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const tabName = tab.getAttribute('data-tab');
          this._switchTab(tabName);
          
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
        });
      });
    }

    _switchTab(tabName) {
      const content = this.window.element.querySelector('#profiler-content');
      if (content) {
        if (tabName === 'system') {
          content.innerHTML = this._renderSystemTab();
        } else if (tabName === 'devices') {
          content.innerHTML = this._renderDevicesTab();
        } else if (tabName === 'extensions') {
          content.innerHTML = this._renderExtensionsTab();
        }
      }
    }
  }

  global.MacOS9SystemProfiler = MacOS9SystemProfiler;

})(typeof window !== 'undefined' ? window : global);
