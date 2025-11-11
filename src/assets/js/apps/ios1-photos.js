/**
 * iOS 1.0 Photos App
 * Photo grid and viewer
 */

class iOS1PhotosApp {
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
    const photoGridHTML = this.generatePhotoGrid();
    return '<div class="app-navbar">' +
      '<button class="app-navbar-button app-navbar-back" data-action="close">' +
      '<svg width="12" height="12" fill="white"><path d="M10 1 L2 6 L10 11"/></svg>' +
      'Back</button>' +
      '<div class="app-navbar-title">Photos</div>' +
      '</div>' +
      '<div class="app-content">' +
      '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; padding: 2px;">' +
      photoGridHTML +
      '</div></div>';
  }

  generatePhotoGrid() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    let html = '';
    for (let i = 0; i < 16; i++) {
      const color = colors[i % colors.length];
      html += '<div style="aspect-ratio: 1; background: linear-gradient(135deg, ' + color + ' 0%, ' + color + 'CC 100%); display: flex; align-items: center; justify-content: center;">' +
        '<svg width="40" height="40" fill="white" opacity="0.5">' +
        '<circle cx="20" cy="15" r="6"/>' +
        '<path d="M5 10 L35 10 L35 35 L5 35 Z"/>' +
        '</svg></div>';
    }
    return html;
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
  if (e.detail.appId === 'photos') {
    const app = new iOS1PhotosApp();
    app.render();
  }
});
