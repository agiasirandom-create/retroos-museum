/**
 * Ubuntu Update Manager
 * System update and distribution upgrade tool
 */

(function(global) {
  'use strict';

  class UbuntuUpdateManager {
    constructor(windowManager) {
      this.windowManager = windowManager;
      this.windowInstance = null;
      this.selectedUpdates = new Set([1, 2, 3]);
    }

    open() {
      this.windowInstance = this.windowManager.createWindow({
        id: `update-manager-${Date.now()}`,
        title: 'Update Manager',
        width: 650,
        height: 500,
        x: 100 + Math.random() * 100,
        y: 80 + Math.random() * 80,
        resizable: true,
        content: this.renderContent()
      });

      this.attachEventListeners();
    }

    renderContent() {
      const totalUpdates = 3;
      const selectedCount = this.selectedUpdates.size;
      const updateSize = '23.4 MB';

      return `
        <div class="update-manager-container">
          <!-- Header with Ubuntu Branding -->
          <div class="update-manager-header">
            <div class="update-manager-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="22" fill="#F07746"/>
                <circle cx="24" cy="24" r="6" fill="white"/>
                <circle cx="24" cy="6" r="4.5" fill="white"/>
                <circle cx="39" cy="33" r="4.5" fill="white"/>
                <circle cx="9" cy="33" r="4.5" fill="white"/>
                <path d="M24 10v8M20 30l-8 5M28 30l8 5" stroke="white" stroke-width="2"/>
              </svg>
            </div>
            <div class="update-manager-header-text">
              <h2>Software Updates</h2>
              <p>${totalUpdates} updates are available</p>
            </div>
          </div>

          <!-- Distribution Upgrade Notice -->
          <div class="update-manager-notice">
            <div class="update-notice-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" fill="#F07746"/>
                <path d="M16 10v8M16 22v2" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="update-notice-content">
              <strong>New Ubuntu release '5.04 Hoary Hedgehog' available</strong>
              <p>A new version of Ubuntu is available. Would you like to upgrade?</p>
              <div class="update-notice-actions">
                <button class="update-notice-btn" data-action="upgrade-info">More Info...</button>
                <button class="update-notice-btn update-notice-btn-primary" data-action="upgrade">Upgrade</button>
              </div>
            </div>
          </div>

          <!-- Updates List -->
          <div class="update-manager-content">
            <div class="update-manager-toolbar">
              <button class="update-toolbar-btn" data-action="check">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <path d="M7 1C3.7 1 1 3.7 1 7s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm0 10c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/>
                  <path d="M7 2v5l3 2" stroke="currentColor" stroke-width="1.5" fill="none"/>
                </svg>
                Check
              </button>
              <button class="update-toolbar-btn" data-action="settings">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <path d="M7 4.5c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5S8.4 4.5 7 4.5z"/>
                  <path d="M11.5 7L10 6l.5-2-2-.5L7 1 5.5 3.5l-2 .5.5 2L2.5 7 4 8l-.5 2 2 .5L7 13l1.5-2.5 2-.5-.5-2 1.5-1z" fill="none" stroke="currentColor" stroke-width="1"/>
                </svg>
                Settings
              </button>
            </div>

            <div class="update-list">
              <!-- Update Item 1 -->
              <div class="update-item">
                <input type="checkbox" class="update-checkbox" data-id="1" ${this.selectedUpdates.has(1) ? 'checked' : ''}>
                <div class="update-item-icon">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                    <rect x="4" y="8" width="24" height="16" rx="2" fill="#F07746"/>
                    <rect x="6" y="10" width="20" height="12" fill="white"/>
                  </svg>
                </div>
                <div class="update-item-details">
                  <div class="update-item-name">Security update for Firefox</div>
                  <div class="update-item-description">
                    Firefox web browser - critical security update addressing multiple vulnerabilities
                  </div>
                  <div class="update-item-meta">
                    <span class="update-tag update-tag-security">Security</span>
                    <span class="update-size">8.7 MB</span>
                  </div>
                </div>
                <button class="update-item-details-btn" data-action="show-details" title="Show Details">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M8 6v6M6 10h4" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                </button>
              </div>

              <!-- Update Item 2 -->
              <div class="update-item">
                <input type="checkbox" class="update-checkbox" data-id="2" ${this.selectedUpdates.has(2) ? 'checked' : ''}>
                <div class="update-item-icon">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                    <circle cx="16" cy="16" r="12" fill="#F07746"/>
                    <circle cx="16" cy="16" r="4" fill="white"/>
                    <circle cx="16" cy="6" r="3" fill="white"/>
                    <circle cx="26" cy="20" r="3" fill="white"/>
                    <circle cx="6" cy="20" r="3" fill="white"/>
                  </svg>
                </div>
                <div class="update-item-details">
                  <div class="update-item-name">Ubuntu base system update</div>
                  <div class="update-item-description">
                    Important system libraries and core components
                  </div>
                  <div class="update-item-meta">
                    <span class="update-tag update-tag-important">Important</span>
                    <span class="update-size">11.2 MB</span>
                  </div>
                </div>
                <button class="update-item-details-btn" data-action="show-details" title="Show Details">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M8 6v6M6 10h4" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                </button>
              </div>

              <!-- Update Item 3 -->
              <div class="update-item">
                <input type="checkbox" class="update-checkbox" data-id="3" ${this.selectedUpdates.has(3) ? 'checked' : ''}>
                <div class="update-item-icon">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                    <rect x="6" y="4" width="20" height="24" rx="2" fill="#E9E7E3"/>
                    <rect x="8" y="6" width="16" height="20" fill="white"/>
                    <rect x="10" y="10" width="12" height="2" fill="#CCCCCC"/>
                    <rect x="10" y="14" width="12" height="2" fill="#CCCCCC"/>
                    <rect x="10" y="18" width="8" height="2" fill="#CCCCCC"/>
                  </svg>
                </div>
                <div class="update-item-details">
                  <div class="update-item-name">Language pack updates</div>
                  <div class="update-item-description">
                    Translation updates for English, Spanish, and French
                  </div>
                  <div class="update-item-meta">
                    <span class="update-tag update-tag-recommended">Recommended</span>
                    <span class="update-size">3.5 MB</span>
                  </div>
                </div>
                <button class="update-item-details-btn" data-action="show-details" title="Show Details">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M8 6v6M6 10h4" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Action Bar -->
          <div class="update-manager-footer">
            <div class="update-footer-info">
              <span>${selectedCount} update${selectedCount !== 1 ? 's' : ''} selected (${updateSize})</span>
            </div>
            <div class="update-footer-actions">
              <button class="update-footer-btn" data-action="close">Close</button>
              <button class="update-footer-btn update-footer-btn-primary" data-action="install">
                Install Updates
              </button>
            </div>
          </div>
        </div>

        <style>
          .update-manager-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: white;
            font-family: 'Ubuntu Sans', sans-serif;
          }

          .update-manager-header {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 20px;
            background: linear-gradient(to bottom, #FFFFFF 0%, #F9F9F9 100%);
            border-bottom: 1px solid #E0E0E0;
          }

          .update-manager-icon {
            flex-shrink: 0;
          }

          .update-manager-header-text h2 {
            margin: 0 0 4px 0;
            color: #2C2C2C;
            font-size: 14pt;
          }

          .update-manager-header-text p {
            margin: 0;
            color: #666;
            font-size: 10pt;
          }

          .update-manager-notice {
            display: flex;
            gap: 12px;
            padding: 16px 20px;
            background: #FFF8F0;
            border-bottom: 1px solid #F9D5B0;
            border-left: 4px solid #F07746;
          }

          .update-notice-icon {
            flex-shrink: 0;
          }

          .update-notice-content {
            flex: 1;
          }

          .update-notice-content strong {
            display: block;
            margin-bottom: 6px;
            color: #DD4814;
            font-size: 11pt;
          }

          .update-notice-content p {
            margin: 0 0 12px 0;
            font-size: 10pt;
            color: #666;
          }

          .update-notice-actions {
            display: flex;
            gap: 8px;
          }

          .update-notice-btn {
            padding: 6px 16px;
            background: white;
            border: 1px solid #9B9388;
            border-radius: 3px;
            font-size: 10pt;
            cursor: pointer;
            transition: all 0.1s ease;
          }

          .update-notice-btn:hover {
            border-color: #F07746;
            background: #FFF8F0;
          }

          .update-notice-btn-primary {
            background: linear-gradient(to bottom, #F9A86D 0%, #F07746 100%);
            border-color: #DD4814;
            color: white;
            font-weight: 500;
          }

          .update-notice-btn-primary:hover {
            background: linear-gradient(to bottom, #FAB27D 0%, #F18856 100%);
          }

          .update-manager-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .update-manager-toolbar {
            display: flex;
            gap: 8px;
            padding: 12px 20px;
            background: #F5F5F5;
            border-bottom: 1px solid #E0E0E0;
          }

          .update-toolbar-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            background: white;
            border: 1px solid #CCCCCC;
            border-radius: 2px;
            font-size: 10pt;
            cursor: pointer;
            transition: all 0.1s ease;
          }

          .update-toolbar-btn:hover {
            border-color: #F07746;
            background: #FFF8F0;
          }

          .update-list {
            flex: 1;
            overflow-y: auto;
            padding: 12px 20px;
          }

          .update-item {
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

          .update-item:hover {
            border-color: #F07746;
            box-shadow: 0 2px 8px rgba(240, 119, 70, 0.1);
          }

          .update-checkbox {
            margin-top: 4px;
            width: 18px;
            height: 18px;
            cursor: pointer;
          }

          .update-item-icon {
            flex-shrink: 0;
          }

          .update-item-details {
            flex: 1;
          }

          .update-item-name {
            font-size: 11pt;
            font-weight: 600;
            color: #2C2C2C;
            margin-bottom: 4px;
          }

          .update-item-description {
            font-size: 9pt;
            color: #666;
            line-height: 1.4;
            margin-bottom: 8px;
          }

          .update-item-meta {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .update-tag {
            padding: 2px 8px;
            border-radius: 2px;
            font-size: 8pt;
            font-weight: 600;
            text-transform: uppercase;
          }

          .update-tag-security {
            background: #ffebee;
            color: #c62828;
          }

          .update-tag-important {
            background: #FFF8F0;
            color: #F07746;
          }

          .update-tag-recommended {
            background: #e3f2fd;
            color: #1976d2;
          }

          .update-size {
            font-size: 9pt;
            color: #999;
          }

          .update-item-details-btn {
            padding: 6px;
            background: transparent;
            border: 1px solid transparent;
            border-radius: 2px;
            cursor: pointer;
            color: #999;
            transition: all 0.1s ease;
          }

          .update-item-details-btn:hover {
            background: #F9F9F9;
            border-color: #E0E0E0;
            color: #F07746;
          }

          .update-manager-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 20px;
            background: #F5F5F5;
            border-top: 1px solid #E0E0E0;
          }

          .update-footer-info {
            font-size: 10pt;
            color: #666;
          }

          .update-footer-actions {
            display: flex;
            gap: 8px;
          }

          .update-footer-btn {
            padding: 8px 20px;
            background: white;
            border: 1px solid #9B9388;
            border-radius: 3px;
            font-size: 10pt;
            cursor: pointer;
            transition: all 0.1s ease;
          }

          .update-footer-btn:hover {
            border-color: #F07746;
            background: #FFF8F0;
          }

          .update-footer-btn-primary {
            background: linear-gradient(to bottom, #F9A86D 0%, #F07746 100%);
            border-color: #DD4814;
            color: white;
            font-weight: 500;
          }

          .update-footer-btn-primary:hover {
            background: linear-gradient(to bottom, #FAB27D 0%, #F18856 100%);
          }
        </style>
      `;
    }

    attachEventListeners() {
      const content = this.windowInstance.contentArea;

      content.addEventListener('change', (e) => {
        if (e.target.classList.contains('update-checkbox')) {
          const id = parseInt(e.target.getAttribute('data-id'));
          if (e.target.checked) {
            this.selectedUpdates.add(id);
          } else {
            this.selectedUpdates.delete(id);
          }
          this.windowInstance.setContent(this.renderContent());
          this.attachEventListeners();
        }
      });

      content.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (btn) {
          const action = btn.getAttribute('data-action');
          this.handleAction(action);
        }
      });
    }

    handleAction(action) {
      switch (action) {
        case 'install':
          alert('Installing updates...\n\nIn a real Ubuntu system, this would download and install the selected updates.');
          break;
        case 'upgrade':
          alert('Distribution Upgrade\n\nThis would upgrade your system to Ubuntu 5.04 "Hoary Hedgehog".');
          break;
        case 'upgrade-info':
          alert('Ubuntu 5.04 "Hoary Hedgehog"\n\nReleased: April 2005\n\nNew features:\n- GNOME 2.10\n- Updated applications\n- Better hardware support');
          break;
        case 'check':
          alert('Checking for updates...');
          break;
        case 'close':
          this.windowInstance.close();
          break;
      }
    }
  }

  global.UbuntuUpdateManager = UbuntuUpdateManager;

})(typeof window !== 'undefined' ? window : global);
