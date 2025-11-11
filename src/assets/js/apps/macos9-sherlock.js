/**
 * Mac OS 9 Sherlock 2
 * File and Internet search tool
 */

(function(global) {
  'use strict';

  class MacOS9Sherlock {
    constructor(desktop) {
      this.desktop = desktop;
      this.currentTab = 'files';
    }

    open() {
      const content = this._buildSherlockContent();

      this.window = this.desktop.createAppWindow({
        id: 'sherlock2',
        title: 'Sherlock 2',
        content: content,
        width: 600,
        height: 450,
        resizable: true
      });

      this._attachListeners();
    }

    _buildSherlockContent() {
      return '<div style="height: 100%; display: flex; flex-direction: column;"><div class="mac9-tabs"><div class="mac9-tab active" data-tab="files">Files</div><div class="mac9-tab" data-tab="internet">Internet</div><div class="mac9-tab" data-tab="people">People</div><div class="mac9-tab" data-tab="shopping">Shopping</div></div><div style="padding: 16px; flex: 1; overflow: auto;"><div id="sherlock-content">' + this._renderFilesTab() + '</div></div></div>';
    }

    _renderFilesTab() {
      return '<div class="mac9-group"><div class="mac9-group-title">Search for files on your computer</div><div style="margin: 12px 0;"><label style="display: block; margin-bottom: 4px;">File name contains:</label><input type="text" class="mac9-input" style="width: 100%;" placeholder="Enter search term"></div><div style="margin: 12px 0;"><label style="display: block; margin-bottom: 4px;">Search in:</label><select class="mac9-input" style="width: 100%;"><option>Macintosh HD</option><option>Applications</option><option>Documents</option><option>Desktop</option></select></div><div style="margin-top: 16px;"><button class="mac9-button default">Search</button> <button class="mac9-button">More Options</button></div></div><div style="margin-top: 16px; padding: 40px; text-align: center; color: #888; border: 1px solid #CCC; border-radius: 4px;">No search results yet. Enter a search term and click Search.</div>';
    }

    _renderInternetTab() {
      return '<div class="mac9-group"><div class="mac9-group-title">Search the Internet</div><div style="margin: 12px 0;"><label style="display: block; margin-bottom: 4px;">Search for:</label><input type="text" class="mac9-input" style="width: 100%;" placeholder="Enter search term"></div><div style="margin: 12px 0;"><label style="display: block; margin-bottom: 4px;">Search engine:</label><select class="mac9-input" style="width: 100%;"><option>Google</option><option>Yahoo</option><option>AltaVista</option></select></div><div style="margin-top: 16px;"><button class="mac9-button default">Search</button></div></div><div style="margin-top: 16px; padding: 40px; text-align: center; color: #888; border: 1px solid #CCC; border-radius: 4px;">Internet search available in demo mode.</div>';
    }

    _renderPeopleTab() {
      return '<div class="mac9-group"><div class="mac9-group-title">Find people</div><p style="margin: 12px 0; color: #666;">Search for people in your Address Book or online directories.</p><div style="margin-top: 16px;"><button class="mac9-button" disabled>Search People (demo)</button></div></div>';
    }

    _renderShoppingTab() {
      return '<div class="mac9-group"><div class="mac9-group-title">Shop online</div><p style="margin: 12px 0; color: #666;">Compare prices and shop online.</p><div style="margin-top: 16px;"><button class="mac9-button" disabled>Search Shopping (demo)</button></div></div>';
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
      this.currentTab = tabName;
      const content = this.window.element.querySelector('#sherlock-content');
      if (content) {
        if (tabName === 'files') {
          content.innerHTML = this._renderFilesTab();
        } else if (tabName === 'internet') {
          content.innerHTML = this._renderInternetTab();
        } else if (tabName === 'people') {
          content.innerHTML = this._renderPeopleTab();
        } else if (tabName === 'shopping') {
          content.innerHTML = this._renderShoppingTab();
        }
      }
    }
  }

  global.MacOS9Sherlock = MacOS9Sherlock;

})(typeof window !== 'undefined' ? window : global);
