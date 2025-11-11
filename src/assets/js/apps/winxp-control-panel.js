/**
 * Windows XP Control Panel
 * System settings and configuration
 */

(function(global) {
  'use strict';

  class WinXPControlPanel {
    constructor(desktop) {
      this.desktop = desktop;
      this.window = null;
    }

    /**
     * Open Control Panel window
     */
    open() {
      const windowContent = this.buildContent();

      this.window = this.desktop.windowManager.createWindow({
        id: `control-panel-${Date.now()}`,
        title: 'Control Panel',
        content: windowContent,
        width: 650,
        height: 500,
        minWidth: 500,
        minHeight: 400,
        resizable: true,
        minimizable: true,
        maximizable: true
      });
    }

    /**
     * Build window content
     */
    buildContent() {
      const categories = [
        { icon: '<¨', title: 'Appearance and Themes', desc: 'Change the appearance of desktop items' },
        { icon: '<', title: 'Network and Internet', desc: 'Connect to the Internet and other networks' },
        { icon: '•', title: 'Add or Remove Programs', desc: 'Add or remove programs and Windows components' },
        { icon: '=
', title: 'Sounds and Audio Devices', desc: 'Change sound scheme and speaker settings' },
        { icon: '™', title: 'Performance and Maintenance', desc: 'Adjust system settings and performance' },
        { icon: '=¨', title: 'Printers and Other Hardware', desc: 'View installed printers and hardware' },
        { icon: '=d', title: 'User Accounts', desc: 'Change user account settings and passwords' },
        { icon: '=Å', title: 'Date, Time, and Regional', desc: 'Change date, time, and number formats' },
        { icon: '', title: 'Accessibility Options', desc: 'Adjust accessibility settings' },
        { icon: '=', title: 'Security Center', desc: 'View security status and settings' }
      ];

      return `
        <div class="control-panel-container" style="display: flex; flex-direction: column; height: 100%; font-family: Tahoma, Arial, sans-serif; font-size: 11px; background: white;">
          <!-- Header -->
          <div class="cp-header" style="background: linear-gradient(to bottom, #E8F2FF 0%, #D1E9FF 100%); border-bottom: 1px solid #ACA899; padding: 16px;">
            <h2 style="margin: 0 0 8px 0; color: #0054E3; font-size: 16px;">Control Panel</h2>
            <p style="margin: 0; color: #666;">Pick a category</p>
          </div>

          <!-- Categories Grid -->
          <div class="cp-categories" style="flex: 1; overflow-y: auto; padding: 20px;">
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;">
              ${categories.map(cat => `
                <div class="cp-category" style="display: flex; flex-direction: column; padding: 12px; background: linear-gradient(to bottom, #FFFFFF 0%, #F5F5F5 100%); border: 1px solid #ACA899; border-radius: 4px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='linear-gradient(to bottom, #E8F2FF 0%, #D1E9FF 100%)'; this.style.borderColor='#0054E3';" onmouseout="this.style.background='linear-gradient(to bottom, #FFFFFF 0%, #F5F5F5 100%)'; this.style.borderColor='#ACA899';" onclick="alert('Opening ${cat.title}')">
                  <div style="font-size: 48px; margin-bottom: 8px; text-align: center;">${cat.icon}</div>
                  <div style="font-weight: bold; color: #0054E3; margin-bottom: 4px; text-align: center;">${cat.title}</div>
                  <div style="font-size: 10px; color: #666; text-align: center;">${cat.desc}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Classic View Link -->
          <div style="background: #ECE9D8; border-top: 1px solid #ACA899; padding: 12px; display: flex; align-items: center; gap: 8px;">
            <span style="color: #0054E3; cursor: pointer; text-decoration: underline;" onclick="alert('Switch to Classic View')">Switch to Classic View</span>
          </div>
        </div>
      `;
    }
  }

  // Export to global scope
  global.WinXPControlPanel = WinXPControlPanel;

})(typeof window !== 'undefined' ? window : global);
