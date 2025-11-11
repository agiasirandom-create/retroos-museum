/**
 * iOS 1.0 Settings App
 * System settings and preferences
 */

class iOS1SettingsApp {
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
        <div class="app-navbar-title">Settings</div>
      </div>

      <div class="app-content">
        <ul class="ios1-list">
          <li class="ios1-list-item">
            <div class="ios1-list-item-icon">
              <svg width="30" height="30" fill="#007AFF" viewBox="0 0 30 30">
                <rect width="30" height="30" rx="6" fill="#007AFF"/>
                <path d="M15 8 L15 22 M8 15 L22 15" stroke="white" stroke-width="2"/>
              </svg>
            </div>
            <div class="ios1-list-item-content">
              <div class="ios1-list-item-title">Wi-Fi</div>
              <div class="ios1-list-item-subtitle">Not Connected</div>
            </div>
            <svg class="ios1-list-item-chevron" fill="currentColor"><path d="M2 0 L8 6 L2 12"/></svg>
          </li>
          <li class="ios1-list-item">
            <div class="ios1-list-item-icon">
              <svg width="30" height="30" fill="#FF3B30" viewBox="0 0 30 30">
                <rect width="30" height="30" rx="6" fill="#FF3B30"/>
                <circle cx="15" cy="15" r="8" stroke="white" stroke-width="2" fill="none"/>
              </svg>
            </div>
            <div class="ios1-list-item-content">
              <div class="ios1-list-item-title">Sounds</div>
            </div>
            <svg class="ios1-list-item-chevron" fill="currentColor"><path d="M2 0 L8 6 L2 12"/></svg>
          </li>
          <li class="ios1-list-item">
            <div class="ios1-list-item-icon">
              <svg width="30" height="30" fill="#007AFF" viewBox="0 0 30 30">
                <rect width="30" height="30" rx="6" fill="#007AFF"/>
                <circle cx="15" cy="10" r="4" fill="white"/>
                <path d="M8 24 C8 20 11 18 15 18 C19 18 22 20 22 24" fill="white"/>
              </svg>
            </div>
            <div class="ios1-list-item-content">
              <div class="ios1-list-item-title">General</div>
            </div>
            <svg class="ios1-list-item-chevron" fill="currentColor"><path d="M2 0 L8 6 L2 12"/></svg>
          </li>
          <li class="ios1-list-item">
            <div class="ios1-list-item-icon">
              <svg width="30" height="30" fill="#5856D6" viewBox="0 0 30 30">
                <rect width="30" height="30" rx="6" fill="#5856D6"/>
                <rect x="8" y="10" width="14" height="10" rx="1" fill="white"/>
              </svg>
            </div>
            <div class="ios1-list-item-content">
              <div class="ios1-list-item-title">Mail</div>
            </div>
            <svg class="ios1-list-item-chevron" fill="currentColor"><path d="M2 0 L8 6 L2 12"/></svg>
          </li>
          <li class="ios1-list-item">
            <div class="ios1-list-item-icon">
              <svg width="30" height="30" fill="#34C759" viewBox="0 0 30 30">
                <rect width="30" height="30" rx="6" fill="#34C759"/>
                <path d="M10 15 L13 18 L20 11" stroke="white" stroke-width="2" fill="none"/>
              </svg>
            </div>
            <div class="ios1-list-item-content">
              <div class="ios1-list-item-title">Phone</div>
            </div>
            <svg class="ios1-list-item-chevron" fill="currentColor"><path d="M2 0 L8 6 L2 12"/></svg>
          </li>
          <li class="ios1-list-item">
            <div class="ios1-list-item-icon">
              <svg width="30" height="30" fill="#007AFF" viewBox="0 0 30 30">
                <rect width="30" height="30" rx="6" fill="#007AFF"/>
                <circle cx="15" cy="15" r="7" stroke="white" stroke-width="2" fill="none"/>
              </svg>
            </div>
            <div class="ios1-list-item-content">
              <div class="ios1-list-item-title">Safari</div>
            </div>
            <svg class="ios1-list-item-chevron" fill="currentColor"><path d="M2 0 L8 6 L2 12"/></svg>
          </li>
          <li class="ios1-list-item">
            <div class="ios1-list-item-icon">
              <svg width="30" height="30" fill="#A855F7" viewBox="0 0 30 30">
                <rect width="30" height="30" rx="6" fill="#A855F7"/>
                <circle cx="15" cy="15" r="5" fill="white"/>
              </svg>
            </div>
            <div class="ios1-list-item-content">
              <div class="ios1-list-item-title">iPod</div>
            </div>
            <svg class="ios1-list-item-chevron" fill="currentColor"><path d="M2 0 L8 6 L2 12"/></svg>
          </li>
        </ul>
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
  if (e.detail.appId === 'settings') {
    const app = new iOS1SettingsApp();
    app.render();
  }
});
