/**
 * iOS 1.0 Home Screen System
 * Manages app icons, pages, and swipe navigation
 */

class iOS1HomeScreen {
  constructor() {
    this.container = null;
    this.pageDotsContainer = null;
    this.currentPage = 0;
    this.totalPages = 0;
    this.isDragging = false;
    this.startX = 0;
    this.currentX = 0;
    this.apps = [];
  }

  init() {
    this.container = document.getElementById('app-pages-container');
    this.pageDotsContainer = document.getElementById('page-dots');

    if (!this.container) return;

    this.defineApps();
    this.renderPages();
    this.attachEventListeners();
  }

  defineApps() {
    // Original 16 iPhone OS 1.0 apps (excluding dock apps)
    this.apps = [
      { id: 'messages', name: 'Messages', color: '#4CD964', icon: 'message' },
      { id: 'calendar', name: 'Calendar', color: '#FFFFFF', icon: 'calendar' },
      { id: 'photos', name: 'Photos', color: '#FFD60A', icon: 'photo' },
      { id: 'camera', name: 'Camera', color: '#8E8E93', icon: 'camera' },
      { id: 'youtube', name: 'YouTube', color: '#FF3B30', icon: 'youtube' },
      { id: 'stocks', name: 'Stocks', color: '#000000', icon: 'stocks' },
      { id: 'maps', name: 'Maps', color: '#4CD964', icon: 'map' },
      { id: 'weather', name: 'Weather', color: '#007AFF', icon: 'weather' },
      { id: 'clock', name: 'Clock', color: '#000000', icon: 'clock' },
      { id: 'calculator', name: 'Calculator', color: '#8E8E93', icon: 'calculator' },
      { id: 'notes', name: 'Notes', color: '#FFD60A', icon: 'notes' },
      { id: 'settings', name: 'Settings', color: '#8E8E93', icon: 'settings' }
    ];
  }

  renderPages() {
    this.container.innerHTML = '';
    this.pageDotsContainer.innerHTML = '';

    const availableApps = this.apps;
    this.totalPages = Math.ceil(availableApps.length / 12) || 1;

    for (let pageIndex = 0; pageIndex < this.totalPages; pageIndex++) {
      const page = this.createPage(pageIndex, availableApps);
      this.container.appendChild(page);

      const dot = document.createElement('div');
      dot.className = 'page-dot';
      if (pageIndex === 0) dot.classList.add('active');
      dot.dataset.page = pageIndex;
      dot.addEventListener('click', () => this.goToPage(pageIndex));
      this.pageDotsContainer.appendChild(dot);
    }
  }

  createPage(pageIndex, apps) {
    const page = document.createElement('div');
    page.className = 'app-page';
    const offset = pageIndex * 320;
    page.style.transform = 'translateX(' + offset + 'px)';

    const startIdx = pageIndex * 12;
    const endIdx = Math.min(startIdx + 12, apps.length);
    const pageApps = apps.slice(startIdx, endIdx);

    pageApps.forEach(app => {
      const appIcon = this.createAppIcon(app);
      page.appendChild(appIcon);
    });

    return page;
  }

  createAppIcon(app) {
    const icon = document.createElement('div');
    icon.className = 'app-icon app-' + app.id;
    icon.dataset.appId = app.id;

    const iconImage = document.createElement('div');
    iconImage.className = 'app-icon-image';
    iconImage.innerHTML = this.getAppIconSVG(app.icon);

    const iconLabel = document.createElement('div');
    iconLabel.className = 'app-icon-label';
    iconLabel.textContent = app.name;

    icon.appendChild(iconImage);
    icon.appendChild(iconLabel);

    icon.addEventListener('click', () => this.launchApp(app));

    return icon;
  }

  getAppIconSVG(iconType) {
    const icons = {
      message: '<svg viewBox="0 0 40 40" fill="white"><rect x="5" y="10" width="30" height="20" rx="2"/><path d="M5 10 L20 20 L35 10"/></svg>',
      calendar: '<svg viewBox="0 0 40 40" fill="#000"><rect width="40" height="40" fill="#fff"/><rect y="0" width="40" height="12" fill="#d00"/><text x="20" y="30" text-anchor="middle" font-size="16" font-weight="bold">29</text></svg>',
      photo: '<svg viewBox="0 0 40 40" fill="white"><circle cx="20" cy="20" r="8"/><path d="M10 10 L30 10 L35 15 L35 35 L5 35 L5 15 Z"/></svg>',
      camera: '<svg viewBox="0 0 40 40" fill="white"><rect x="5" y="12" width="30" height="20" rx="2"/><circle cx="20" cy="22" r="6"/><rect x="8" y="8" width="8" height="4" rx="1"/></svg>',
      youtube: '<svg viewBox="0 0 40 40" fill="white"><rect x="5" y="10" width="30" height="20" rx="3"/><path d="M16 13 L16 27 L28 20 Z"/></svg>',
      stocks: '<svg viewBox="0 0 40 40" fill="#4CD964"><path d="M5 30 L10 25 L15 28 L20 18 L25 22 L30 12 L35 15"/></svg>',
      map: '<svg viewBox="0 0 40 40" fill="white"><path d="M13 5 L13 35 M27 5 L27 35 M5 8 L13 5 L27 10 L35 7 L35 32 L27 35 L13 30 L5 33 Z"/></svg>',
      weather: '<svg viewBox="0 0 40 40" fill="white"><circle cx="20" cy="15" r="6"/><path d="M10 25 Q15 20 20 25 T30 25"/></svg>',
      clock: '<svg viewBox="0 0 40 40" fill="white"><circle cx="20" cy="20" r="14" stroke="white" stroke-width="2" fill="none"/><path d="M20 20 L20 10 M20 20 L26 26"/></svg>',
      calculator: '<svg viewBox="0 0 40 40" fill="white"><rect x="8" y="6" width="24" height="8" rx="1"/><circle cx="12" cy="20" r="2"/><circle cx="20" cy="20" r="2"/><circle cx="28" cy="20" r="2"/><circle cx="12" cy="28" r="2"/><circle cx="20" cy="28" r="2"/><circle cx="28" cy="28" r="2"/></svg>',
      notes: '<svg viewBox="0 0 40 40" fill="#000"><rect width="40" height="40" fill="#FFD60A"/><line x1="5" y1="12" x2="35" y2="12" stroke="#000" opacity="0.1"/><line x1="5" y1="18" x2="35" y2="18" stroke="#000" opacity="0.1"/><line x1="5" y1="24" x2="35" y2="24" stroke="#000" opacity="0.1"/></svg>',
      settings: '<svg viewBox="0 0 40 40" fill="white"><circle cx="20" cy="20" r="6"/><path d="M20 5 L20 10 M20 30 L20 35 M5 20 L10 20 M30 20 L35 20 M9 9 L13 13 M27 27 L31 31 M31 9 L27 13 M13 27 L9 31"/></svg>'
    };
    return icons[iconType] || icons.settings;
  }

  attachEventListeners() {
    this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
    this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e));

    this.container.addEventListener('mousedown', (e) => this.handleTouchStart(e));
    document.addEventListener('mousemove', (e) => this.handleTouchMove(e));
    document.addEventListener('mouseup', (e) => this.handleTouchEnd(e));

    const homeButton = document.getElementById('home-button');
    if (homeButton) {
      homeButton.addEventListener('click', () => this.closeCurrentApp());
    }
  }

  handleTouchStart(e) {
    this.isDragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    this.startX = clientX;
    this.currentX = 0;
  }

  handleTouchMove(e) {
    if (!this.isDragging) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = clientX - this.startX;
    this.currentX = diff;

    const pages = this.container.querySelectorAll('.app-page');
    pages.forEach((page, index) => {
      const baseOffset = (index - this.currentPage) * 320;
      page.style.transition = 'none';
      page.style.transform = 'translateX(' + (baseOffset + diff) + 'px)';
    });
  }

  handleTouchEnd(e) {
    if (!this.isDragging) return;
    this.isDragging = false;

    const threshold = 80;
    if (Math.abs(this.currentX) > threshold) {
      if (this.currentX > 0 && this.currentPage > 0) {
        this.goToPage(this.currentPage - 1);
      } else if (this.currentX < 0 && this.currentPage < this.totalPages - 1) {
        this.goToPage(this.currentPage + 1);
      } else {
        this.goToPage(this.currentPage);
      }
    } else {
      this.goToPage(this.currentPage);
    }
  }

  goToPage(pageIndex) {
    this.currentPage = pageIndex;

    const pages = this.container.querySelectorAll('.app-page');
    pages.forEach((page, index) => {
      page.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      page.style.transform = 'translateX(' + ((index - pageIndex) * 320) + 'px)';
    });

    const dots = this.pageDotsContainer.querySelectorAll('.page-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === pageIndex);
    });
  }

  launchApp(app) {
    console.log('Launching app:', app.name);
    
    const event = new CustomEvent('ios1:launchApp', { 
      detail: { appId: app.id, appName: app.name } 
    });
    document.dispatchEvent(event);
  }

  closeCurrentApp() {
    const event = new CustomEvent('ios1:closeApp');
    document.dispatchEvent(event);
  }
}
