/**
 * iOS 1.0 Messages App
 * SMS messaging with green bubbles
 */

class iOS1MessagesApp {
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
        <div class="app-navbar-title">Messages</div>
        <button class="app-navbar-button" data-action="compose">+</button>
      </div>

      <div class="app-content">
        <ul class="ios1-list">
          <li class="ios1-list-item">
            <div class="ios1-list-item-content">
              <div class="ios1-list-item-title">Steve Jobs</div>
              <div class="ios1-list-item-subtitle">This changes everything.</div>
            </div>
            <svg class="ios1-list-item-chevron" fill="currentColor"><path d="M2 0 L8 6 L2 12"/></svg>
          </li>
          <li class="ios1-list-item">
            <div class="ios1-list-item-content">
              <div class="ios1-list-item-title">Jony Ive</div>
              <div class="ios1-list-item-subtitle">Design is how it works.</div>
            </div>
            <svg class="ios1-list-item-chevron" fill="currentColor"><path d="M2 0 L8 6 L2 12"/></svg>
          </li>
          <li class="ios1-list-item">
            <div class="ios1-list-item-content">
              <div class="ios1-list-item-title">Scott Forstall</div>
              <div class="ios1-list-item-subtitle">Welcome to iPhone OS 1.0!</div>
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
  if (e.detail.appId === 'messages') {
    const app = new iOS1MessagesApp();
    app.render();
  }
});
