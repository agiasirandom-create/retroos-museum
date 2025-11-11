/**
 * Ubuntu Firefox 0.9
 * Simple web browser interface
 */

(function(global) {
  'use strict';

  class UbuntuFirefox {
    constructor(windowManager) {
      this.windowManager = windowManager;
      this.windowInstance = null;
      this.currentUrl = 'https://ubuntu.com';
    }

    open(url = 'https://ubuntu.com') {
      this.currentUrl = url;

      this.windowInstance = this.windowManager.createWindow({
        id: `firefox-${Date.now()}`,
        title: 'Ubuntu - Mozilla Firefox',
        width: 800,
        height: 600,
        x: 80 + Math.random() * 80,
        y: 60 + Math.random() * 60,
        resizable: true,
        content: this.renderContent()
      });

      this.attachEventListeners();
    }

    renderContent() {
      return `
        <div class="firefox-container">
          <div class="firefox-menubar">
            <button class="firefox-menu-item">File</button>
            <button class="firefox-menu-item">Edit</button>
            <button class="firefox-menu-item">View</button>
            <button class="firefox-menu-item">Go</button>
            <button class="firefox-menu-item">Bookmarks</button>
            <button class="firefox-menu-item">Tools</button>
            <button class="firefox-menu-item">Help</button>
          </div>

          <div class="firefox-toolbar">
            <button class="firefox-btn" data-action="back" title="Back">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M10 12L6 8l4-4"/>
              </svg>
            </button>
            <button class="firefox-btn" data-action="forward" title="Forward">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6 12l4-4-4-4"/>
              </svg>
            </button>
            <button class="firefox-btn" data-action="reload" title="Reload">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M13 8c0 2.8-2.2 5-5 5s-5-2.2-5-5 2.2-5 5-5c1.4 0 2.6.5 3.5 1.4M13 3v3h-3"/>
              </svg>
            </button>
            <button class="firefox-btn" data-action="stop" title="Stop">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="4" y="4" width="8" height="8"/>
              </svg>
            </button>
            <button class="firefox-btn" data-action="home" title="Home">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 2L2 7v7h4v-4h4v4h4V7L8 2z"/>
              </svg>
            </button>
            <div class="firefox-separator"></div>
            <input type="text" class="firefox-urlbar" value="${this.currentUrl}">
            <button class="firefox-btn" data-action="go" title="Go">Go</button>
          </div>

          <div class="firefox-content">
            <div class="firefox-page">
              <div style="text-align: center; padding: 40px;">
                <img src="data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='38' fill='%23F07746'/%3E%3Ccircle cx='40' cy='40' r='12' fill='white'/%3E%3Ccircle cx='40' cy='10' r='8' fill='white'/%3E%3Ccircle cx='68' cy='56' r='8' fill='white'/%3E%3Ccircle cx='12' cy='56' r='8' fill='white'/%3E%3C/svg%3E" alt="Ubuntu Logo" style="margin-bottom: 24px;">
                <h1 style="color: #DD4814; font-size: 28pt; margin: 0 0 16px 0;">Welcome to Ubuntu</h1>
                <p style="font-size: 12pt; color: #666; max-width: 600px; margin: 0 auto 24px; line-height: 1.6;">
                  Ubuntu 4.10 "Warty Warthog" - Linux for human beings
                </p>
                <p style="font-size: 11pt; color: #666; max-width: 600px; margin: 0 auto; line-height: 1.6;">
                  You are viewing a simulated Firefox 0.9 browser. In the real Ubuntu 4.10,
                  this browser would display actual web pages and provide a complete browsing experience.
                </p>
              </div>
            </div>
          </div>

          <div class="firefox-statusbar">
            <span class="firefox-status-text">Done</span>
          </div>
        </div>

        <style>
          .firefox-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: white;
            font-family: 'Ubuntu Sans', sans-serif;
          }

          .firefox-menubar {
            display: flex;
            padding: 2px 4px;
            background: #E9E7E3;
            border-bottom: 1px solid #9B9388;
          }

          .firefox-menu-item {
            padding: 4px 12px;
            background: transparent;
            border: none;
            border-radius: 2px;
            font-family: 'Ubuntu Sans', sans-serif;
            font-size: 10pt;
            cursor: pointer;
            transition: background-color 0.1s ease;
          }

          .firefox-menu-item:hover {
            background: rgba(240, 119, 70, 0.15);
          }

          .firefox-toolbar {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 4px 6px;
            background: #E9E7E3;
            border-bottom: 1px solid #9B9388;
          }

          .firefox-btn {
            height: 28px;
            padding: 0 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: 1px solid transparent;
            border-radius: 2px;
            cursor: pointer;
            color: #2C2C2C;
            font-family: 'Ubuntu Sans', sans-serif;
            font-size: 10pt;
            transition: all 0.1s ease;
          }

          .firefox-btn:hover {
            background: rgba(255, 255, 255, 0.5);
            border-color: #9B9388;
          }

          .firefox-separator {
            width: 1px;
            height: 24px;
            background: #9B9388;
            margin: 0 4px;
          }

          .firefox-urlbar {
            flex: 1;
            padding: 4px 8px;
            background: white;
            border: 1px solid #9B9388;
            border-radius: 2px;
            font-family: 'Ubuntu Sans', sans-serif;
            font-size: 10pt;
          }

          .firefox-content {
            flex: 1;
            overflow: auto;
            background: white;
          }

          .firefox-page {
            padding: 20px;
          }

          .firefox-statusbar {
            padding: 4px 12px;
            background: #E9E7E3;
            border-top: 1px solid #9B9388;
            font-size: 9pt;
            color: #666;
          }
        </style>
      `;
    }

    attachEventListeners() {
      const content = this.windowInstance.contentArea;

      content.addEventListener('click', (e) => {
        const btn = e.target.closest('.firefox-btn');
        if (btn) {
          const action = btn.getAttribute('data-action');
          if (action) this.handleAction(action);
        }
      });
    }

    handleAction(action) {
      switch (action) {
        case 'home':
          this.currentUrl = 'https://ubuntu.com';
          this.windowInstance.setContent(this.renderContent());
          this.attachEventListeners();
          break;
        case 'reload':
          alert('Page would reload');
          break;
      }
    }
  }

  global.UbuntuFirefox = UbuntuFirefox;

})(typeof window !== 'undefined' ? window : global);
