/**
 * iOS 1.0 iPod Music Player
 * Music, playlists, Cover Flow
 */

class iOS1iPodApp {
  constructor() {
    this.container = null;
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
        <button class="app-navbar-button app-navbar-back" data-action="close">
          <svg width="12" height="12" fill="white"><path d="M10 1 L2 6 L10 11"/></svg>
          Back
        </button>
        <div class="app-navbar-title">iPod</div>
      </div>

      <div class="app-content with-toolbar">
        <div style="padding: 80px 20px; text-align: center;">
          <div style="width: 200px; height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0 auto 30px; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
            <svg width="100" height="100" fill="white">
              <circle cx="50" cy="55" r="20"/>
              <path d="M45 20 L55 20 L55 40"/>
              <circle cx="50" cy="55" r="10" fill="#764ba2"/>
            </svg>
          </div>
          <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #000;">Now Playing</h3>
          <p style="margin: 0; font-size: 14px; color: #666;">No music in library</p>
        </div>
      </div>

      <div class="app-toolbar">
        <button class="toolbar-button">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v18M7 7v10M17 7v10"/>
          </svg>
          <span>Playlists</span>
        </button>
        <button class="toolbar-button">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="8" r="4"/>
            <path d="M6 20c0-4 2.5-6 6-6s6 2 6 6"/>
          </svg>
          <span>Artists</span>
        </button>
        <button class="toolbar-button">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <rect x="4" y="4" width="16" height="16" rx="2"/>
          </svg>
          <span>Songs</span>
        </button>
      </div>
    `;
  }

  attachEventListeners() {
    const backButton = this.container.querySelector('[data-action="close"]');
    if (backButton) {
      backButton.addEventListener('click', () => this.close());
    }
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
  if (e.detail.appId === 'ipod') {
    const app = new iOS1iPodApp();
    app.render();
  }
});
