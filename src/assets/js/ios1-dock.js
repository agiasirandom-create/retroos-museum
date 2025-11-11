/**
 * iOS 1.0 Dock System
 * Bottom dock with Phone, Mail, Safari, iPod
 */

class iOS1Dock {
  constructor() {
    this.dock = null;
    this.dockApps = [
      { id: 'phone', name: 'Phone', icon: 'phone' },
      { id: 'mail', name: 'Mail', icon: 'mail' },
      { id: 'safari', name: 'Safari', icon: 'safari' },
      { id: 'ipod', name: 'iPod', icon: 'ipod' }
    ];
  }

  init() {
    this.dock = document.getElementById('ios1-dock');
    if (!this.dock) return;

    this.renderDock();
  }

  renderDock() {
    this.dock.innerHTML = '';

    this.dockApps.forEach(app => {
      const icon = this.createDockIcon(app);
      this.dock.appendChild(icon);
    });
  }

  createDockIcon(app) {
    const icon = document.createElement('div');
    icon.className = 'dock-icon app-' + app.id;
    icon.dataset.appId = app.id;

    const iconImage = document.createElement('div');
    iconImage.className = 'dock-icon-image';
    iconImage.innerHTML = this.getDockIconSVG(app.icon);

    icon.appendChild(iconImage);
    icon.addEventListener('click', () => this.launchApp(app));

    return icon;
  }

  getDockIconSVG(iconType) {
    const icons = {
      phone: '<svg viewBox="0 0 40 40" fill="white"><path d="M12 8 L12 12 L10 14 L10 20 L12 22 L12 26 L16 30 L22 30 L26 26 L26 22 L28 20 L28 14 L26 12 L26 8 Z"/><rect x="14" y="10" width="12" height="16" rx="2"/></svg>',
      mail: '<svg viewBox="0 0 40 40" fill="white"><rect x="6" y="10" width="28" height="20" rx="2"/><path d="M6 10 L20 22 L34 10"/></svg>',
      safari: '<svg viewBox="0 0 40 40" fill="white"><circle cx="20" cy="20" r="14" stroke="white" stroke-width="2" fill="none"/><path d="M20 8 L20 12 M20 28 L20 32 M8 20 L12 20 M28 20 L32 20"/><path d="M14 14 L26 26 M26 14 L20 20"/></svg>',
      ipod: '<svg viewBox="0 0 40 40" fill="white"><circle cx="20" cy="22" r="8"/><path d="M16 8 L24 8 L24 16"/><circle cx="20" cy="22" r="3"/></svg>'
    };
    return icons[iconType] || icons.phone;
  }

  launchApp(app) {
    const event = new CustomEvent('ios1:launchApp', { 
      detail: { appId: app.id, appName: app.name } 
    });
    document.dispatchEvent(event);
  }
}
