/**
 * Windows 7 Aero Glass Effects System
 * Handles blur effects, glass rendering, and visual animations
 */

class Win7Aero {
  constructor() {
    this.snapPreview = null;
    this.aeroPeekOverlay = null;
    this.thumbnailContainer = null;
    this.isAeroPeekActive = false;
    this.snapZones = {
      left: { x: 0, y: 0, width: 0.5, height: 1 },
      right: { x: 0.5, y: 0, width: 0.5, height: 1 },
      top: { x: 0, y: 0, width: 1, height: 1 }
    };
  }

  /**
   * Initialize Aero effects
   */
  init() {
    this.snapPreview = document.getElementById('snap-preview');
    this.aeroPeekOverlay = document.getElementById('aero-peek-overlay');
    this.thumbnailContainer = document.getElementById('thumbnail-previews');
    this.setupAeroPeek();
    this.checkBrowserSupport();
  }

  /**
   * Check browser support for backdrop-filter
   */
  checkBrowserSupport() {
    const testElement = document.createElement('div');
    testElement.style.backdropFilter = 'blur(1px)';
    const hasSupport = testElement.style.backdropFilter !== '';

    if (!hasSupport) {
      console.warn('Backdrop filter not supported. Falling back to opacity-based glass effect.');
      document.documentElement.classList.add('no-backdrop-filter');
    }

    return hasSupport;
  }

  /**
   * Apply glass effect to window
   * @param {HTMLElement} windowElement - Window element
   */
  applyGlassEffect(windowElement) {
    const titlebar = windowElement.querySelector('.win7-titlebar');
    if (titlebar) {
      // Add glass gradient overlay
      const glassOverlay = document.createElement('div');
      glassOverlay.className = 'glass-overlay';
      glassOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to bottom,
          rgba(255, 255, 255, 0.4) 0%,
          rgba(255, 255, 255, 0.1) 50%,
          rgba(255, 255, 255, 0) 100%);
        pointer-events: none;
        border-radius: 8px 8px 0 0;
      `;
      titlebar.style.position = 'relative';
      titlebar.appendChild(glassOverlay);
    }
  }

  /**
   * Show Aero Snap preview
   * @param {string} zone - Snap zone (left, right, top)
   */
  showSnapPreview(zone) {
    if (!this.snapPreview) return;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight - 40; // Subtract taskbar height
    const zoneConfig = this.snapZones[zone];

    if (!zoneConfig) return;

    this.snapPreview.style.left = `${screenWidth * zoneConfig.x}px`;
    this.snapPreview.style.top = `${screenHeight * zoneConfig.y}px`;
    this.snapPreview.style.width = `${screenWidth * zoneConfig.width}px`;
    this.snapPreview.style.height = `${screenHeight * zoneConfig.height}px`;
    this.snapPreview.hidden = false;
  }

  /**
   * Hide Aero Snap preview
   */
  hideSnapPreview() {
    if (this.snapPreview) {
      this.snapPreview.hidden = true;
    }
  }

  /**
   * Detect snap zone from cursor position
   * @param {number} x - Cursor X position
   * @param {number} y - Cursor Y position
   * @returns {string|null} - Snap zone or null
   */
  detectSnapZone(x, y) {
    const threshold = 5;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight - 40;

    // Top edge - maximize
    if (y <= threshold) {
      return 'top';
    }

    // Left edge - snap left
    if (x <= threshold && y > threshold && y < screenHeight - threshold) {
      return 'left';
    }

    // Right edge - snap right
    if (x >= screenWidth - threshold && y > threshold && y < screenHeight - threshold) {
      return 'right';
    }

    return null;
  }

  /**
   * Apply window snap
   * @param {HTMLElement} windowElement - Window element
   * @param {string} zone - Snap zone
   */
  applySnap(windowElement, zone) {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight - 40;
    const zoneConfig = this.snapZones[zone];

    if (!zoneConfig) return;

    windowElement.style.transition = 'all 0.2s ease';
    windowElement.style.left = `${screenWidth * zoneConfig.x}px`;
    windowElement.style.top = `${screenHeight * zoneConfig.y}px`;
    windowElement.style.width = `${screenWidth * zoneConfig.width}px`;
    windowElement.style.height = `${screenHeight * zoneConfig.height}px`;

    // Mark as snapped
    windowElement.dataset.snapped = zone;

    // Remove maximized class if present
    if (zone !== 'top') {
      windowElement.classList.remove('maximized');
    } else {
      windowElement.classList.add('maximized');
    }

    setTimeout(() => {
      windowElement.style.transition = '';
    }, 200);
  }

  /**
   * Remove window snap
   * @param {HTMLElement} windowElement - Window element
   */
  removeSnap(windowElement) {
    delete windowElement.dataset.snapped;
    windowElement.classList.remove('maximized');
  }

  /**
   * Setup Aero Peek (show desktop)
   */
  setupAeroPeek() {
    const showDesktopBtn = document.querySelector('.show-desktop-btn');
    if (!showDesktopBtn) return;

    let peekTimeout;

    showDesktopBtn.addEventListener('mouseenter', () => {
      peekTimeout = setTimeout(() => {
        this.activateAeroPeek();
      }, 500);
    });

    showDesktopBtn.addEventListener('mouseleave', () => {
      clearTimeout(peekTimeout);
      this.deactivateAeroPeek();
    });

    showDesktopBtn.addEventListener('click', () => {
      this.toggleDesktop();
    });
  }

  /**
   * Activate Aero Peek effect
   */
  activateAeroPeek() {
    if (!this.aeroPeekOverlay) return;

    this.isAeroPeekActive = true;
    this.aeroPeekOverlay.classList.add('active');
    this.aeroPeekOverlay.hidden = false;

    // Make all windows transparent
    const windows = document.querySelectorAll('.win7-window');
    windows.forEach(win => {
      win.style.transition = 'opacity 0.3s ease';
      win.dataset.originalOpacity = win.style.opacity || '1';
      win.style.opacity = '0.1';
    });
  }

  /**
   * Deactivate Aero Peek effect
   */
  deactivateAeroPeek() {
    if (!this.aeroPeekOverlay) return;

    this.isAeroPeekActive = false;
    this.aeroPeekOverlay.classList.remove('active');

    // Restore windows
    const windows = document.querySelectorAll('.win7-window');
    windows.forEach(win => {
      win.style.opacity = win.dataset.originalOpacity || '1';
      setTimeout(() => {
        win.style.transition = '';
        delete win.dataset.originalOpacity;
      }, 300);
    });

    setTimeout(() => {
      this.aeroPeekOverlay.hidden = true;
    }, 300);
  }

  /**
   * Toggle show desktop
   */
  toggleDesktop() {
    const windows = document.querySelectorAll('.win7-window:not(.minimized)');

    if (windows.length === 0) {
      // Restore all minimized windows
      this.restoreAllWindows();
    } else {
      // Minimize all windows
      windows.forEach(win => {
        win.classList.add('minimized');
        win.style.display = 'none';
      });
    }
  }

  /**
   * Restore all minimized windows
   */
  restoreAllWindows() {
    const windows = document.querySelectorAll('.win7-window.minimized');
    windows.forEach(win => {
      win.classList.remove('minimized');
      win.style.display = 'flex';
    });
  }

  /**
   * Create window thumbnail for Aero Peek
   * @param {HTMLElement} windowElement - Window element
   * @returns {HTMLElement} - Thumbnail element
   */
  createThumbnail(windowElement) {
    const thumbnail = document.createElement('div');
    thumbnail.className = 'thumbnail-preview';

    // Create thumbnail image (simplified - would need canvas in real implementation)
    const thumbnailImage = document.createElement('div');
    thumbnailImage.className = 'thumbnail-preview-image';
    thumbnailImage.style.background = '#FFFFFF';

    // Add title
    const title = windowElement.querySelector('.win7-titlebar-text');
    const thumbnailTitle = document.createElement('div');
    thumbnailTitle.className = 'thumbnail-preview-title';
    thumbnailTitle.textContent = title ? title.textContent : 'Window';

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'thumbnail-close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      windowElement.remove();
      this.hideThumbnails();
    });

    thumbnail.appendChild(thumbnailImage);
    thumbnail.appendChild(thumbnailTitle);
    thumbnail.appendChild(closeBtn);

    // Click to focus window
    thumbnail.addEventListener('click', () => {
      this.focusWindow(windowElement);
      this.hideThumbnails();
    });

    return thumbnail;
  }

  /**
   * Show thumbnails for an app
   * @param {Array} windows - Array of window elements
   * @param {HTMLElement} buttonElement - Taskbar button element
   */
  showThumbnails(windows, buttonElement) {
    if (!this.thumbnailContainer || windows.length === 0) return;

    // Clear existing thumbnails
    this.thumbnailContainer.innerHTML = '';

    // Add thumbnails
    windows.forEach(win => {
      const thumbnail = this.createThumbnail(win);
      this.thumbnailContainer.appendChild(thumbnail);
    });

    // Position thumbnails above taskbar button
    const buttonRect = buttonElement.getBoundingClientRect();
    const containerWidth = this.thumbnailContainer.offsetWidth;
    let left = buttonRect.left + (buttonRect.width / 2) - (containerWidth / 2);

    // Keep within screen bounds
    left = Math.max(10, Math.min(left, window.innerWidth - containerWidth - 10));

    this.thumbnailContainer.style.left = `${left}px`;
    this.thumbnailContainer.hidden = false;
  }

  /**
   * Hide thumbnails
   */
  hideThumbnails() {
    if (this.thumbnailContainer) {
      this.thumbnailContainer.hidden = true;
    }
  }

  /**
   * Focus window
   * @param {HTMLElement} windowElement - Window element
   */
  focusWindow(windowElement) {
    // Remove minimized state
    windowElement.classList.remove('minimized');
    windowElement.style.display = 'flex';

    // Bring to front
    const allWindows = document.querySelectorAll('.win7-window');
    allWindows.forEach(win => {
      win.classList.remove('active');
      win.classList.add('inactive');
    });

    windowElement.classList.remove('inactive');
    windowElement.classList.add('active');

    // Set highest z-index
    const maxZ = Math.max(...Array.from(allWindows).map(w => parseInt(w.style.zIndex) || 0));
    windowElement.style.zIndex = maxZ + 1;
  }

  /**
   * Apply window glow effect
   * @param {HTMLElement} windowElement - Window element
   * @param {boolean} active - Whether window is active
   */
  applyWindowGlow(windowElement, active) {
    if (active) {
      windowElement.style.boxShadow = `
        0 0 0 1px rgba(255, 255, 255, 0.3),
        0 0 20px rgba(77, 166, 255, 0.4),
        0 8px 32px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.8)
      `;
    } else {
      windowElement.style.boxShadow = `
        0 0 0 1px rgba(255, 255, 255, 0.2),
        0 4px 16px rgba(0, 0, 0, 0.2)
      `;
    }
  }

  /**
   * Animate window open
   * @param {HTMLElement} windowElement - Window element
   */
  animateWindowOpen(windowElement) {
    windowElement.style.opacity = '0';
    windowElement.style.transform = 'scale(0.9)';

    requestAnimationFrame(() => {
      windowElement.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      windowElement.style.opacity = '1';
      windowElement.style.transform = 'scale(1)';

      setTimeout(() => {
        windowElement.style.transition = '';
      }, 200);
    });
  }

  /**
   * Animate window close
   * @param {HTMLElement} windowElement - Window element
   * @param {Function} callback - Callback after animation
   */
  animateWindowClose(windowElement, callback) {
    windowElement.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    windowElement.style.opacity = '0';
    windowElement.style.transform = 'scale(0.9)';

    setTimeout(() => {
      if (callback) callback();
    }, 200);
  }

  /**
   * Animate window minimize
   * @param {HTMLElement} windowElement - Window element
   * @param {HTMLElement} targetElement - Target taskbar button
   */
  animateWindowMinimize(windowElement, targetElement) {
    const windowRect = windowElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    windowElement.style.transition = 'all 0.3s ease';
    windowElement.style.transform = `
      translate(${targetRect.left - windowRect.left}px, ${targetRect.top - windowRect.top}px)
      scale(0.1)
    `;
    windowElement.style.opacity = '0';

    setTimeout(() => {
      windowElement.style.display = 'none';
      windowElement.classList.add('minimized');
      windowElement.style.transition = '';
      windowElement.style.transform = '';
      windowElement.style.opacity = '1';
    }, 300);
  }

  /**
   * Animate window restore
   * @param {HTMLElement} windowElement - Window element
   */
  animateWindowRestore(windowElement) {
    windowElement.classList.remove('minimized');
    windowElement.style.display = 'flex';
    windowElement.style.opacity = '0';
    windowElement.style.transform = 'scale(0.9)';

    requestAnimationFrame(() => {
      windowElement.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      windowElement.style.opacity = '1';
      windowElement.style.transform = 'scale(1)';

      setTimeout(() => {
        windowElement.style.transition = '';
      }, 200);
    });
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Win7Aero;
}
