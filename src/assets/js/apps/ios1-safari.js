/**
 * iOS 1.0 Safari Browser
 * Full mobile web browser
 */

class iOS1SafariApp {
  constructor() {
    this.container = null;
    this.currentUrl = 'https://www.apple.com';
  }

  render() {
    this.container = document.getElementById('app-container');
    if (!this.container) return;

    this.container.hidden = false;
    this.container.innerHTML = this.getHTML();
    this.attachEventListeners();
  }

  getHTML() {
    return `
      <div class="app-navbar">
        <div class="safari-url-bar">
          <input type="text" class="safari-url-input" value="${this.currentUrl}" />
        </div>
      </div>

      <div class="app-content with-toolbar">
        <div style="padding: 60px 20px; text-align: center; color: #666;">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="#007AFF" style="margin-bottom: 20px;">
            <circle cx="32" cy="32" r="28" stroke="#007AFF" stroke-width="3" fill="none"/>
            <path d="M32 12 L32 20 M32 44 L32 52 M12 32 L20 32 M44 32 L52 32"/>
            <path d="M20 20 L44 44 M44 20 L32 32" stroke-width="2"/>
          </svg>
          <h2 style="margin: 0 0 10px 0; font-size: 20px;">Safari</h2>
          <p style="margin: 0; font-size: 14px;">The web, on your phone.</p>
          <p style="margin: 20px 0 0 0; font-size: 12px; color: #999;">Demo mode - full browser not available</p>
        </div>
      </div>

      <div class="app-toolbar">
        <button class="toolbar-button">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15 18 L9 12 L15 6"/>
          </svg>
        </button>
        <button class="toolbar-button">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 18 L15 12 L9 6"/>
          </svg>
        </button>
        <button class="toolbar-button">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2 L15 8 L22 9 L17 14 L18 21 L12 18 L6 21 L7 14 L2 9 L9 8 Z"/>
          </svg>
        </button>
        <button class="toolbar-button">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4 L12 20 M4 12 L20 12"/>
          </svg>
        </button>
      </div>

      <style>
        .safari-url-bar {
          width: 100%;
          padding: 8px;
        }
        .safari-url-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 8px;
          background: rgba(255,255,255,0.2);
          color: white;
          font-size: 14px;
          font-family: var(--ios1-font);
        }
        .safari-url-input::placeholder {
          color: rgba(255,255,255,0.6);
        }
      </style>
    `;
  }

  attachEventListeners() {
    // URL bar would work in full implementation
  }

  close() {
    if (this.container) {
      this.container.classList.add('closing');
      setTimeout(() => {
        this.container.hidden = true;
        this.container.classList.remove('closing');
        this.container.innerHTML = '';
      }, 300);
    }
  }
}

document.addEventListener('ios1:launchApp', (e) => {
  if (e.detail.appId === 'safari') {
    const app = new iOS1SafariApp();
    app.render();
  }
});
