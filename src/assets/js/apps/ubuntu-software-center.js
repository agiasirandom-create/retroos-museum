/**
 * Ubuntu Software Center (Add/Remove Programs)
 * Simple package browser and installer
 */

(function(global) {
  'use strict';

  class UbuntuSoftwareCenter {
    constructor(windowManager) {
      this.windowManager = windowManager;
      this.windowInstance = null;
      this.currentCategory = 'all';
      this.selectedPackages = new Set();
    }

    open() {
      this.windowInstance = this.windowManager.createWindow({
        id: `software-center-${Date.now()}`,
        title: 'Add/Remove Applications',
        width: 750,
        height: 550,
        x: 80 + Math.random() * 80,
        y: 70 + Math.random() * 70,
        resizable: true,
        content: this.renderContent()
      });

      this.attachEventListeners();
    }

    renderContent() {
      return `
        <div class="software-center-container">
          <!-- Toolbar -->
          <div class="software-center-toolbar">
            <div class="software-search">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
                <path d="M11 11l4 4" stroke="currentColor" stroke-width="2"/>
              </svg>
              <input type="text" class="software-search-input" placeholder="Search applications...">
            </div>
            <button class="software-toolbar-btn" data-action="refresh" title="Refresh">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <path d="M12 7c0 2.8-2.2 5-5 5s-5-2.2-5-5 2.2-5 5-5c1.4 0 2.6.5 3.5 1.4M12 2v3h-3" stroke="currentColor" stroke-width="1.5" fill="none"/>
              </svg>
            </button>
          </div>

          <!-- Main Content -->
          <div class="software-center-main">
            <!-- Categories Sidebar -->
            <div class="software-center-sidebar">
              <div class="software-category-header">Categories</div>
              <div class="software-category ${this.currentCategory === 'all' ? 'active' : ''}" data-category="all">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <rect x="2" y="2" width="4" height="4"/>
                  <rect x="8" y="2" width="4" height="4"/>
                  <rect x="2" y="8" width="4" height="4"/>
                  <rect x="8" y="8" width="4" height="4"/>
                </svg>
                <span>All Applications</span>
              </div>
              <div class="software-category ${this.currentCategory === 'internet' ? 'active' : ''}" data-category="internet">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M2 7h10M7 2c-2 1.5-2 7.5 0 9M7 2c2 1.5 2 7.5 0 9" stroke="currentColor" stroke-width="1"/>
                </svg>
                <span>Internet</span>
              </div>
              <div class="software-category ${this.currentCategory === 'office' ? 'active' : ''}" data-category="office">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <path d="M3 2h6l3 3v7c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V3c0-.6.4-1 1-1z"/>
                  <path d="M9 2v3h3" fill="white"/>
                </svg>
                <span>Office</span>
              </div>
              <div class="software-category ${this.currentCategory === 'graphics' ? 'active' : ''}" data-category="graphics">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <rect x="2" y="2" width="10" height="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M2 10l3-3 2 2 3-4 2 2"/>
                  <circle cx="5" cy="5" r="1"/>
                </svg>
                <span>Graphics</span>
              </div>
              <div class="software-category ${this.currentCategory === 'games' ? 'active' : ''}" data-category="games">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <path d="M3 5h8c1 0 2 1 2 2v3c0 1-1 2-2 2H9l-2 2-2-2H3c-1 0-2-1-2-2V7c0-1 1-2 2-2z" fill="none" stroke="currentColor" stroke-width="1.5"/>
                  <circle cx="5" cy="8" r="1"/>
                  <circle cx="9" cy="8" r="1"/>
                </svg>
                <span>Games</span>
              </div>
              <div class="software-category ${this.currentCategory === 'sound-video' ? 'active' : ''}" data-category="sound-video">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <path d="M4 4l7 3-7 3V4z"/>
                  <circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                <span>Sound & Video</span>
              </div>
              <div class="software-category ${this.currentCategory === 'system' ? 'active' : ''}" data-category="system">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <path d="M10.5 2h-7L1 5.5v3L3.5 12h7L13 8.5v-3L10.5 2z" fill="none" stroke="currentColor" stroke-width="1.5"/>
                  <circle cx="7" cy="7" r="2"/>
                </svg>
                <span>System Tools</span>
              </div>
            </div>

            <!-- Package List -->
            <div class="software-center-content">
              <div class="software-package-list">
                ${this.renderPackageList()}
              </div>
            </div>
          </div>

          <!-- Action Bar -->
          <div class="software-center-footer">
            <div class="software-footer-info">
              <span>${this.selectedPackages.size} change${this.selectedPackages.size !== 1 ? 's' : ''} to apply</span>
            </div>
            <div class="software-footer-actions">
              <button class="software-footer-btn" data-action="cancel">Cancel</button>
              <button class="software-footer-btn software-footer-btn-primary" data-action="apply" ${this.selectedPackages.size === 0 ? 'disabled' : ''}>
                Apply
              </button>
            </div>
          </div>
        </div>

        <style>
          .software-center-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: white;
            font-family: 'Ubuntu Sans', sans-serif;
          }

          .software-center-toolbar {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px;
            background: #F5F5F5;
            border-bottom: 1px solid #E0E0E0;
          }

          .software-search {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            background: white;
            border: 1px solid #CCCCCC;
            border-radius: 3px;
          }

          .software-search-input {
            flex: 1;
            border: none;
            outline: none;
            font-size: 10pt;
            background: transparent;
          }

          .software-toolbar-btn {
            padding: 8px 12px;
            background: white;
            border: 1px solid #CCCCCC;
            border-radius: 2px;
            cursor: pointer;
            transition: all 0.1s ease;
          }

          .software-toolbar-btn:hover {
            border-color: #F07746;
            background: #FFF8F0;
          }

          .software-center-main {
            display: flex;
            flex: 1;
            overflow: hidden;
          }

          .software-center-sidebar {
            width: 200px;
            background: #F5F5F5;
            border-right: 1px solid #E0E0E0;
            overflow-y: auto;
            padding: 8px 4px;
          }

          .software-category-header {
            padding: 8px 12px;
            font-weight: 600;
            font-size: 9pt;
            color: #666;
            text-transform: uppercase;
          }

          .software-category {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            margin: 2px 4px;
            border-radius: 2px;
            cursor: pointer;
            font-size: 10pt;
            transition: background-color 0.1s ease;
          }

          .software-category:hover {
            background: rgba(240, 119, 70, 0.1);
          }

          .software-category.active {
            background: #F07746;
            color: white;
            font-weight: 500;
          }

          .software-category svg {
            flex-shrink: 0;
          }

          .software-center-content {
            flex: 1;
            overflow-y: auto;
          }

          .software-package-list {
            padding: 16px;
          }

          .software-package {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 16px;
            margin-bottom: 12px;
            background: white;
            border: 1px solid #E0E0E0;
            border-radius: 4px;
            transition: all 0.15s ease;
          }

          .software-package:hover {
            border-color: #F07746;
            box-shadow: 0 2px 8px rgba(240, 119, 70, 0.1);
          }

          .software-package-checkbox {
            margin-top: 2px;
            width: 18px;
            height: 18px;
            cursor: pointer;
          }

          .software-package-icon {
            width: 48px;
            height: 48px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #F9A86D 0%, #F07746 100%);
            border-radius: 6px;
          }

          .software-package-details {
            flex: 1;
          }

          .software-package-name {
            font-size: 11pt;
            font-weight: 600;
            color: #2C2C2C;
            margin-bottom: 4px;
          }

          .software-package-description {
            font-size: 9pt;
            color: #666;
            line-height: 1.4;
            margin-bottom: 6px;
          }

          .software-package-meta {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 8pt;
            color: #999;
          }

          .software-package-status {
            padding: 2px 8px;
            background: #e3f2fd;
            color: #1976d2;
            border-radius: 2px;
            font-weight: 600;
            text-transform: uppercase;
          }

          .software-center-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 20px;
            background: #F5F5F5;
            border-top: 1px solid #E0E0E0;
          }

          .software-footer-info {
            font-size: 10pt;
            color: #666;
          }

          .software-footer-actions {
            display: flex;
            gap: 8px;
          }

          .software-footer-btn {
            padding: 8px 20px;
            background: white;
            border: 1px solid #9B9388;
            border-radius: 3px;
            font-size: 10pt;
            cursor: pointer;
            transition: all 0.1s ease;
          }

          .software-footer-btn:hover:not(:disabled) {
            border-color: #F07746;
            background: #FFF8F0;
          }

          .software-footer-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .software-footer-btn-primary {
            background: linear-gradient(to bottom, #F9A86D 0%, #F07746 100%);
            border-color: #DD4814;
            color: white;
            font-weight: 500;
          }

          .software-footer-btn-primary:hover:not(:disabled) {
            background: linear-gradient(to bottom, #FAB27D 0%, #F18856 100%);
          }
        </style>
      `;
    }

    renderPackageList() {
      const packages = [
        {
          id: 'audacity',
          name: 'Audacity',
          description: 'Free audio editor and recorder',
          category: 'sound-video',
          installed: false,
          icon: `<path d="M8 3l5 10H3L8 3z" fill="white"/><circle cx="8" cy="10" r="2" fill="#DD4814"/>`
        },
        {
          id: 'blender',
          name: 'Blender',
          description: '3D modeling and animation suite',
          category: 'graphics',
          installed: false,
          icon: `<circle cx="8" cy="8" r="6" fill="white"/><circle cx="8" cy="8" r="3" fill="#DD4814"/>`
        },
        {
          id: 'inkscape',
          name: 'Inkscape',
          description: 'Vector graphics editor',
          category: 'graphics',
          installed: true,
          icon: `<path d="M4 4h8l2 2v6l-2 2H6l-2-2V6l2-2z" fill="white" stroke="#DD4814" stroke-width="1.5"/>`
        },
        {
          id: 'vlc',
          name: 'VLC Media Player',
          description: 'Multimedia player for various formats',
          category: 'sound-video',
          installed: false,
          icon: `<path d="M5 4l6 4-6 4V4z" fill="white"/>`
        },
        {
          id: 'pidgin',
          name: 'Pidgin Internet Messenger',
          description: 'Multi-protocol instant messaging client',
          category: 'internet',
          installed: true,
          icon: `<circle cx="8" cy="8" r="5" fill="white"/><path d="M5 8c0-1.7 1.3-3 3-3s3 1.3 3 3" stroke="#DD4814" stroke-width="1.5" fill="none"/>`
        },
        {
          id: 'frozen-bubble',
          name: 'Frozen Bubble',
          description: 'Puzzle game with colorful bubbles',
          category: 'games',
          installed: false,
          icon: `<circle cx="6" cy="6" r="3" fill="white"/><circle cx="10" cy="10" r="3" fill="white"/>`
        },
        {
          id: 'abiword',
          name: 'AbiWord',
          description: 'Lightweight word processor',
          category: 'office',
          installed: false,
          icon: `<rect x="4" y="4" width="8" height="8" fill="white"/><rect x="5" y="6" width="6" height="1" fill="#DD4814"/><rect x="5" y="8" width="6" height="1" fill="#DD4814"/>`
        },
        {
          id: 'gftp',
          name: 'gFTP',
          description: 'FTP client for GNOME',
          category: 'internet',
          installed: false,
          icon: `<path d="M4 6h8v6H4z" fill="white"/><path d="M8 2v4M5 8l3-3 3 3" stroke="#DD4814" stroke-width="1.5" fill="none"/>`
        }
      ];

      return packages
        .filter(pkg => this.currentCategory === 'all' || pkg.category === this.currentCategory)
        .map(pkg => `
          <div class="software-package">
            <input type="checkbox" class="software-package-checkbox" data-id="${pkg.id}" ${this.selectedPackages.has(pkg.id) ? 'checked' : ''} ${pkg.installed ? '' : ''}>
            <div class="software-package-icon">
              <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
                ${pkg.icon}
              </svg>
            </div>
            <div class="software-package-details">
              <div class="software-package-name">${pkg.name}</div>
              <div class="software-package-description">${pkg.description}</div>
              <div class="software-package-meta">
                ${pkg.installed ? '<span class="software-package-status">Installed</span>' : ''}
                <span>Free Software</span>
              </div>
            </div>
          </div>
        `).join('');
    }

    attachEventListeners() {
      const content = this.windowInstance.contentArea;

      content.addEventListener('click', (e) => {
        const category = e.target.closest('.software-category');
        if (category) {
          this.currentCategory = category.getAttribute('data-category');
          this.windowInstance.setContent(this.renderContent());
          this.attachEventListeners();
        }

        const btn = e.target.closest('[data-action]');
        if (btn) {
          const action = btn.getAttribute('data-action');
          this.handleAction(action);
        }
      });

      content.addEventListener('change', (e) => {
        if (e.target.classList.contains('software-package-checkbox')) {
          const id = e.target.getAttribute('data-id');
          if (e.target.checked) {
            this.selectedPackages.add(id);
          } else {
            this.selectedPackages.delete(id);
          }
          this.windowInstance.setContent(this.renderContent());
          this.attachEventListeners();
        }
      });
    }

    handleAction(action) {
      switch (action) {
        case 'apply':
          if (this.selectedPackages.size > 0) {
            alert(`Installing/Removing ${this.selectedPackages.size} package(s)...\n\nIn a real Ubuntu system, this would install or remove the selected applications.`);
            this.selectedPackages.clear();
            this.windowInstance.setContent(this.renderContent());
            this.attachEventListeners();
          }
          break;
        case 'cancel':
          this.windowInstance.close();
          break;
        case 'refresh':
          alert('Refreshing package list...');
          break;
      }
    }
  }

  global.UbuntuSoftwareCenter = UbuntuSoftwareCenter;

})(typeof window !== 'undefined' ? window : global);
