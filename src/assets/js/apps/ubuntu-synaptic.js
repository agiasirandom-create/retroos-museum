/**
 * Ubuntu Synaptic Package Manager
 * GUI package manager for APT
 */

(function(global) {
  'use strict';

  class UbuntuSynaptic {
    constructor(windowManager) {
      this.windowManager = windowManager;
      this.windowInstance = null;
      this.packages = this.createPackageList();
    }

    createPackageList() {
      return [
        { name: 'firefox', version: '0.9', status: 'installed', description: 'Mozilla Firefox Web Browser' },
        { name: 'gimp', version: '2.0', status: 'not-installed', description: 'GNU Image Manipulation Program' },
        { name: 'openoffice.org', version: '1.1.2', status: 'installed', description: 'OpenOffice.org Office Suite' },
        { name: 'rhythmbox', version: '0.8.5', status: 'installed', description: 'Music Player' },
        { name: 'evolution', version: '2.0', status: 'installed', description: 'Email and Calendar' },
        { name: 'gaim', version: '1.0', status: 'installed', description: 'Multi-protocol Instant Messenger' },
        { name: 'totem', version: '0.99', status: 'installed', description: 'Movie Player' },
        { name: 'gedit', version: '2.8', status: 'installed', description: 'Text Editor' },
      ];
    }

    open() {
      this.windowInstance = this.windowManager.createWindow({
        id: `synaptic-${Date.now()}`,
        title: 'Synaptic Package Manager',
        width: 720,
        height: 540,
        x: 100 + Math.random() * 80,
        y: 80 + Math.random() * 60,
        resizable: true,
        content: this.renderContent()
      });
    }

    renderContent() {
      return `
        <div class="synaptic-container">
          <div class="synaptic-toolbar">
            <button class="synaptic-btn">Reload</button>
            <button class="synaptic-btn">Mark All Upgrades</button>
            <div class="synaptic-separator"></div>
            <button class="synaptic-btn">Apply</button>
            <div class="synaptic-separator"></div>
            <input type="text" class="synaptic-search" placeholder="Search packages...">
          </div>

          <div class="synaptic-main">
            <div class="synaptic-sidebar">
              <div class="synaptic-section-title">Sections</div>
              <button class="synaptic-sidebar-item active">All</button>
              <button class="synaptic-sidebar-item">Installed</button>
              <button class="synaptic-sidebar-item">Not Installed</button>
              <button class="synaptic-sidebar-item">Upgradable</button>
              <div class="synaptic-section-title">Categories</div>
              <button class="synaptic-sidebar-item">Accessories</button>
              <button class="synaptic-sidebar-item">Games</button>
              <button class="synaptic-sidebar-item">Graphics</button>
              <button class="synaptic-sidebar-item">Internet</button>
              <button class="synaptic-sidebar-item">Office</button>
              <button class="synaptic-sidebar-item">Sound & Video</button>
              <button class="synaptic-sidebar-item">System</button>
            </div>

            <div class="synaptic-content">
              <div class="synaptic-package-list">
                ${this.packages.map(pkg => this.renderPackage(pkg)).join('')}
              </div>
            </div>
          </div>

          <div class="synaptic-statusbar">
            <span>${this.packages.filter(p => p.status === 'installed').length} packages installed</span>
            <span style="margin-left: 20px;">${this.packages.filter(p => p.status === 'not-installed').length} packages available</span>
          </div>
        </div>

        <style>
          .synaptic-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: white;
            font-family: 'Ubuntu Sans', sans-serif;
          }

          .synaptic-toolbar {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px;
            background: #E9E7E3;
            border-bottom: 1px solid #9B9388;
          }

          .synaptic-btn {
            padding: 6px 12px;
            background: white;
            border: 1px solid #9B9388;
            border-radius: 2px;
            font-family: 'Ubuntu Sans', sans-serif;
            font-size: 10pt;
            cursor: pointer;
            transition: all 0.1s ease;
          }

          .synaptic-btn:hover {
            background: rgba(240, 119, 70, 0.1);
            border-color: #F07746;
          }

          .synaptic-separator {
            width: 1px;
            height: 24px;
            background: #9B9388;
            margin: 0 4px;
          }

          .synaptic-search {
            flex: 1;
            padding: 6px 12px;
            background: white;
            border: 1px solid #9B9388;
            border-radius: 2px;
            font-family: 'Ubuntu Sans', sans-serif;
            font-size: 10pt;
          }

          .synaptic-main {
            flex: 1;
            display: flex;
            overflow: hidden;
          }

          .synaptic-sidebar {
            width: 180px;
            background: #E9E7E3;
            border-right: 1px solid #9B9388;
            overflow-y: auto;
            padding: 8px 0;
          }

          .synaptic-section-title {
            padding: 8px 12px 4px;
            font-size: 9pt;
            font-weight: 600;
            color: #666;
            text-transform: uppercase;
          }

          .synaptic-sidebar-item {
            width: 100%;
            display: block;
            padding: 6px 12px;
            background: transparent;
            border: none;
            text-align: left;
            font-family: 'Ubuntu Sans', sans-serif;
            font-size: 10pt;
            cursor: pointer;
            transition: background-color 0.1s ease;
          }

          .synaptic-sidebar-item:hover {
            background: rgba(240, 119, 70, 0.15);
          }

          .synaptic-sidebar-item.active {
            background: rgba(240, 119, 70, 0.3);
            font-weight: 600;
          }

          .synaptic-content {
            flex: 1;
            overflow: auto;
          }

          .synaptic-package-list {
            padding: 12px;
          }

          .synaptic-package {
            padding: 12px;
            border: 1px solid #E9E7E3;
            border-radius: 3px;
            margin-bottom: 8px;
            transition: all 0.1s ease;
          }

          .synaptic-package:hover {
            background: rgba(240, 119, 70, 0.05);
            border-color: #F07746;
          }

          .synaptic-package-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 4px;
          }

          .synaptic-package-name {
            font-size: 11pt;
            font-weight: 600;
            color: #2C2C2C;
          }

          .synaptic-package-version {
            font-size: 9pt;
            color: #666;
          }

          .synaptic-package-status {
            margin-left: auto;
            padding: 2px 8px;
            border-radius: 2px;
            font-size: 9pt;
            font-weight: 500;
          }

          .synaptic-package-status.installed {
            background: #8AE234;
            color: white;
          }

          .synaptic-package-status.not-installed {
            background: #9B9388;
            color: white;
          }

          .synaptic-package-desc {
            font-size: 10pt;
            color: #666;
            line-height: 1.4;
          }

          .synaptic-statusbar {
            padding: 6px 12px;
            background: #E9E7E3;
            border-top: 1px solid #9B9388;
            font-size: 9pt;
            color: #666;
          }
        </style>
      `;
    }

    renderPackage(pkg) {
      return `
        <div class="synaptic-package">
          <div class="synaptic-package-header">
            <span class="synaptic-package-name">${pkg.name}</span>
            <span class="synaptic-package-version">${pkg.version}</span>
            <span class="synaptic-package-status ${pkg.status}">${pkg.status === 'installed' ? 'Installed' : 'Available'}</span>
          </div>
          <div class="synaptic-package-desc">${pkg.description}</div>
        </div>
      `;
    }
  }

  global.UbuntuSynaptic = UbuntuSynaptic;

})(typeof window !== 'undefined' ? window : global);
