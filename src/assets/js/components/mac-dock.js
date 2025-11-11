/**
 * MacDock - macOS Dock component
 * Authentic macOS Dock with magnification, bounce animations, and glass effects
 *
 * Usage:
 * const dock = new MacDock();
 * dock.initialize(document.body, { position: 'bottom', magnification: true });
 * dock.addApp({ id: 'finder', name: 'Finder', icon: '📁', running: true });
 */

class MacDock {
  constructor() {
    this.container = null;
    this.config = {
      position: 'bottom', // 'bottom', 'left', 'right'
      magnification: true,
      magnificationSize: 2.5, // Multiplier for icon size
      autoHide: false,
      iconSize: 48,
      spacing: 8,
      showIndicators: true, // Show dots for running apps
      showLabels: true,
      perspective: true, // 3D tilt effect
      theme: 'glass' // 'glass', 'solid', 'translucent'
    };
    this.apps = new Map();
    this.runningApps = new Set();
    this.elements = {};
    this.eventHandlers = {};
    this.animationFrameId = null;
  }

  /**
   * Initialize dock in container with configuration
   */
  initialize(container, config = {}) {
    this.container = container;
    this.config = { ...this.config, ...config };

    this._createDock();
    this._applyTheme();
    this._attachEventListeners();

    if (this.config.autoHide) {
      this._enableAutoHide();
    }

    return this;
  }

  /**
   * Create dock DOM structure
   */
  _createDock() {
    // Dock container
    this.elements.dockContainer = document.createElement('div');
    this.elements.dockContainer.className = 'mac-dock-container';

    const positionStyles = this._getPositionStyles();
    this.elements.dockContainer.style.cssText = `
      position: fixed;
      ${positionStyles}
      display: flex;
      ${this.config.position === 'bottom' ? 'flex-direction: row;' : 'flex-direction: column;'}
      z-index: 9999;
      pointer-events: none;
    `;

    // Dock wrapper (for glass background)
    this.elements.dock = document.createElement('div');
    this.elements.dock.className = 'mac-dock';
    this.elements.dock.style.cssText = `
      display: flex;
      ${this.config.position === 'bottom' ? 'flex-direction: row;' : 'flex-direction: column;'}
      align-items: center;
      gap: ${this.config.spacing}px;
      padding: 8px;
      border-radius: 16px;
      pointer-events: auto;
      transform-style: preserve-3d;
      transition: transform 0.3s ease;
    `;

    // Icons container
    this.elements.iconsContainer = document.createElement('div');
    this.elements.iconsContainer.className = 'dock-icons';
    this.elements.iconsContainer.style.cssText = `
      display: flex;
      ${this.config.position === 'bottom' ? 'flex-direction: row;' : 'flex-direction: column;'}
      gap: ${this.config.spacing}px;
      align-items: ${this.config.position === 'bottom' ? 'flex-end' : 'center'};
      position: relative;
    `;

    this.elements.dock.appendChild(this.elements.iconsContainer);
    this.elements.dockContainer.appendChild(this.elements.dock);

    // Label tooltip
    this.elements.label = document.createElement('div');
    this.elements.label.className = 'dock-label';
    this.elements.label.style.cssText = `
      position: fixed;
      background: rgba(0, 0, 0, 0.75);
      color: white;
      padding: 4px 12px;
      border-radius: 6px;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
      font-size: 12px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s;
      z-index: 10001;
      white-space: nowrap;
    `;
    this.container.appendChild(this.elements.label);

    this.container.appendChild(this.elements.dockContainer);
  }

  /**
   * Get position styles based on dock position
   */
  _getPositionStyles() {
    switch (this.config.position) {
      case 'left':
        return 'left: 8px; top: 50%; transform: translateY(-50%);';
      case 'right':
        return 'right: 8px; top: 50%; transform: translateY(-50%);';
      case 'bottom':
      default:
        return 'bottom: 8px; left: 50%; transform: translateX(-50%);';
    }
  }

  /**
   * Apply theme
   */
  _applyTheme() {
    const themes = {
      glass: {
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(30px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      },
      solid: {
        background: 'rgba(50, 50, 50, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
      },
      translucent: {
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
      }
    };

    const theme = themes[this.config.theme] || themes.glass;

    this.elements.dock.style.background = theme.background;
    this.elements.dock.style.border = theme.border;
    this.elements.dock.style.boxShadow = theme.boxShadow;

    if (theme.backdropFilter) {
      this.elements.dock.style.backdropFilter = theme.backdropFilter;
      this.elements.dock.style.webkitBackdropFilter = theme.backdropFilter;
    }
  }

  /**
   * Add app to dock
   */
  addApp(appInfo) {
    if (this.apps.has(appInfo.id)) {
      return;
    }

    const appIcon = this._createAppIcon(appInfo);
    this.apps.set(appInfo.id, {
      info: appInfo,
      element: appIcon
    });

    if (appInfo.running) {
      this.runningApps.add(appInfo.id);
    }

    // Insert before trash or at end
    const trashIcon = this.elements.iconsContainer.querySelector('[data-app-id="trash"]');
    if (trashIcon) {
      this.elements.iconsContainer.insertBefore(appIcon, trashIcon);
    } else {
      this.elements.iconsContainer.appendChild(appIcon);
    }
  }

  /**
   * Create app icon
   */
  _createAppIcon(appInfo) {
    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'dock-icon-wrapper';
    iconWrapper.dataset.appId = appInfo.id;
    iconWrapper.style.cssText = `
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    `;

    // Icon
    const icon = document.createElement('div');
    icon.className = 'dock-icon';
    icon.style.cssText = `
      width: ${this.config.iconSize}px;
      height: ${this.config.iconSize}px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${this.config.iconSize * 0.6}px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      transition: all 0.2s;
      user-select: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    `;

    if (appInfo.icon) {
      icon.textContent = appInfo.icon;
    } else if (appInfo.iconUrl) {
      icon.style.backgroundImage = `url(${appInfo.iconUrl})`;
      icon.style.backgroundSize = 'cover';
    }

    iconWrapper.appendChild(icon);

    // Running indicator
    if (this.config.showIndicators) {
      const indicator = document.createElement('div');
      indicator.className = 'dock-indicator';
      indicator.style.cssText = `
        position: absolute;
        ${this.config.position === 'bottom' ? 'bottom: -6px;' : 'right: -6px;'}
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 2px;
        opacity: ${appInfo.running ? '1' : '0'};
        transition: opacity 0.2s;
        box-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
      `;
      iconWrapper.appendChild(indicator);
    }

    // Event listeners
    iconWrapper.addEventListener('click', () => this._handleIconClick(appInfo));
    iconWrapper.addEventListener('mouseenter', (e) => this._handleIconHover(e, appInfo));
    iconWrapper.addEventListener('mouseleave', () => this._handleIconLeave());

    // Store reference to icon element
    iconWrapper._icon = icon;
    iconWrapper._indicator = iconWrapper.querySelector('.dock-indicator');

    return iconWrapper;
  }

  /**
   * Remove app from dock
   */
  removeApp(appId) {
    const app = this.apps.get(appId);
    if (!app) return;

    app.element.remove();
    this.apps.delete(appId);
    this.runningApps.delete(appId);
  }

  /**
   * Set app running state
   */
  setAppRunning(appId, running) {
    const app = this.apps.get(appId);
    if (!app) return;

    if (running) {
      this.runningApps.add(appId);
    } else {
      this.runningApps.delete(appId);
    }

    const indicator = app.element._indicator;
    if (indicator) {
      indicator.style.opacity = running ? '1' : '0';
    }
  }

  /**
   * Bounce app icon (notification animation)
   */
  bounceApp(appId, times = 3) {
    const app = this.apps.get(appId);
    if (!app) return;

    const icon = app.element;
    let bounceCount = 0;

    const bounce = () => {
      if (bounceCount >= times) {
        icon.style.transform = 'translateY(0) scale(1)';
        return;
      }

      icon.style.transition = 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)';
      icon.style.transform = this.config.position === 'bottom'
        ? 'translateY(-20px) scale(1.1)'
        : 'translateX(-20px) scale(1.1)';

      setTimeout(() => {
        icon.style.transform = 'translateY(0) scale(1)';
        bounceCount++;
        setTimeout(bounce, 150);
      }, 150);
    };

    bounce();
  }

  /**
   * Handle icon click
   */
  _handleIconClick(appInfo) {
    const isRunning = this.runningApps.has(appInfo.id);

    if (isRunning) {
      // Activate or show window
      this._dispatchEvent('appActivate', { app: appInfo });
    } else {
      // Launch app
      this.setAppRunning(appInfo.id, true);
      this.bounceApp(appInfo.id, 2);
      this._dispatchEvent('appLaunch', { app: appInfo });
    }
  }

  /**
   * Handle icon hover with magnification
   */
  _handleIconHover(event, appInfo) {
    if (this.config.showLabels) {
      this._showLabel(appInfo.name, event);
    }

    if (!this.config.magnification) return;

    const hoveredIcon = event.currentTarget;
    const icons = Array.from(this.elements.iconsContainer.children);
    const hoveredIndex = icons.indexOf(hoveredIcon);

    icons.forEach((icon, index) => {
      const distance = Math.abs(hoveredIndex - index);
      const scale = Math.max(1, this.config.magnificationSize - distance * 0.5);

      icon.style.transform = `scale(${scale})`;
      icon.style.zIndex = this.config.magnificationSize * 10 - distance;
    });

    // Apply 3D perspective tilt
    if (this.config.perspective && this.config.position === 'bottom') {
      const rect = hoveredIcon.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const mouseX = event.clientX;
      const offset = (mouseX - centerX) / rect.width;

      this.elements.dock.style.transform = `perspective(1000px) rotateY(${offset * 5}deg)`;
    }
  }

  /**
   * Handle icon mouse leave
   */
  _handleIconLeave() {
    this._hideLabel();

    if (this.config.magnification) {
      const icons = Array.from(this.elements.iconsContainer.children);
      icons.forEach(icon => {
        icon.style.transform = 'scale(1)';
        icon.style.zIndex = '1';
      });

      if (this.config.perspective) {
        this.elements.dock.style.transform = 'perspective(1000px) rotateY(0deg)';
      }
    }
  }

  /**
   * Show label tooltip
   */
  _showLabel(text, event) {
    this.elements.label.textContent = text;
    this.elements.label.style.opacity = '1';

    // Position label above/beside icon
    const updateLabelPosition = () => {
      const rect = event.target.getBoundingClientRect();
      const labelRect = this.elements.label.getBoundingClientRect();

      if (this.config.position === 'bottom') {
        this.elements.label.style.left = `${rect.left + rect.width / 2 - labelRect.width / 2}px`;
        this.elements.label.style.top = `${rect.top - labelRect.height - 8}px`;
      } else if (this.config.position === 'left') {
        this.elements.label.style.left = `${rect.right + 8}px`;
        this.elements.label.style.top = `${rect.top + rect.height / 2 - labelRect.height / 2}px`;
      } else {
        this.elements.label.style.left = `${rect.left - labelRect.width - 8}px`;
        this.elements.label.style.top = `${rect.top + rect.height / 2 - labelRect.height / 2}px`;
      }
    };

    updateLabelPosition();
  }

  /**
   * Hide label tooltip
   */
  _hideLabel() {
    this.elements.label.style.opacity = '0';
  }

  /**
   * Add folder stack to dock
   */
  addFolder(folderInfo) {
    const folder = {
      ...folderInfo,
      type: 'folder'
    };

    this.addApp(folder);

    // Add folder-specific click handler
    const folderElement = this.apps.get(folderInfo.id).element;
    folderElement.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this._showFolderStack(folderInfo);
    });
  }

  /**
   * Show folder stack (fan or grid view)
   */
  _showFolderStack(folderInfo) {
    this._dispatchEvent('folderStack', { folder: folderInfo });
  }

  /**
   * Enable auto-hide functionality
   */
  _enableAutoHide() {
    let hideTimeout;
    const hideDelay = 500;

    this.elements.dockContainer.addEventListener('mouseenter', () => {
      clearTimeout(hideTimeout);
      this._showDock();
    });

    this.elements.dockContainer.addEventListener('mouseleave', () => {
      hideTimeout = setTimeout(() => {
        this._hideDock();
      }, hideDelay);
    });

    // Initial hide
    setTimeout(() => this._hideDock(), 1000);
  }

  /**
   * Show dock
   */
  _showDock() {
    this.elements.dockContainer.style.transition = 'transform 0.3s ease';

    switch (this.config.position) {
      case 'left':
        this.elements.dockContainer.style.transform = 'translateX(0) translateY(-50%)';
        break;
      case 'right':
        this.elements.dockContainer.style.transform = 'translateX(0) translateY(-50%)';
        break;
      case 'bottom':
      default:
        this.elements.dockContainer.style.transform = 'translateX(-50%) translateY(0)';
        break;
    }
  }

  /**
   * Hide dock
   */
  _hideDock() {
    const hideDistance = this.config.iconSize + 16;

    switch (this.config.position) {
      case 'left':
        this.elements.dockContainer.style.transform = `translateX(-${hideDistance}px) translateY(-50%)`;
        break;
      case 'right':
        this.elements.dockContainer.style.transform = `translateX(${hideDistance}px) translateY(-50%)`;
        break;
      case 'bottom':
      default:
        this.elements.dockContainer.style.transform = `translateX(-50%) translateY(${hideDistance}px)`;
        break;
    }
  }

  /**
   * Attach event listeners
   */
  _attachEventListeners() {
    // Global mouse move for magnification
    if (this.config.magnification) {
      this.eventHandlers.mouseMove = (e) => {
        // Smooth magnification based on mouse position
      };
      document.addEventListener('mousemove', this.eventHandlers.mouseMove);
    }
  }

  /**
   * Set theme configuration
   */
  setTheme(themeConfig) {
    this.config = { ...this.config, ...themeConfig };
    this._applyTheme();
  }

  /**
   * Dispatch custom event
   */
  _dispatchEvent(eventName, detail) {
    const event = new CustomEvent(`dock:${eventName}`, { detail });
    this.elements.dockContainer.dispatchEvent(event);
  }

  /**
   * Clean up component
   */
  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.eventHandlers.mouseMove) {
      document.removeEventListener('mousemove', this.eventHandlers.mouseMove);
    }

    if (this.elements.dockContainer) {
      this.elements.dockContainer.remove();
    }

    if (this.elements.label) {
      this.elements.label.remove();
    }

    this.apps.clear();
    this.runningApps.clear();
    this.elements = {};
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MacDock;
}
