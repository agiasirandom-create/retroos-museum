/**
 * BeOS ShowImage
 * Simple, elegant image viewer
 * Features: zoom, rotate, slideshow, navigation
 */

(function(global) {
  'use strict';

  /**
   * BeOS ShowImage Application
   */
  class BeOSShowImage {
    constructor(desktop, imagePath = null) {
      this.desktop = desktop;
      this.imagePath = imagePath;
      this.window = null;
      this.windowId = null;
      this.zoomLevel = 100;
      this.rotation = 0;
      this.images = this._getMockImages();
      this.currentImageIndex = 0;
    }

    /**
     * Launch ShowImage
     */
    launch() {
      const content = this._createContent();

      this.windowId = `showimage-${Date.now()}`;
      this.window = this.desktop.windowSystem.createWindow({
        id: this.windowId,
        title: 'ShowImage',
        width: 600,
        height: 500,
        content: content,
        resizable: true,
        tabPosition: 'top',
        menuItems: [
          { label: 'File', onClick: () => {} },
          { label: 'View', onClick: () => {} },
          { label: 'Image', onClick: () => {} }
        ],
        onClose: () => this._cleanup()
      });

      // Add to workspace
      if (this.desktop.workspaceSwitcher) {
        this.desktop.workspaceSwitcher.addWindowToWorkspace(this.windowId);
      }

      // Setup event handlers
      this._setupEventHandlers();

      // Append to container
      const container = document.getElementById('windows-container');
      if (container) {
        container.appendChild(this.window);
      }

      // Load initial image
      this._loadImage();
    }

    /**
     * Create ShowImage content
     * @private
     */
    _createContent() {
      return `
        <div class="showimage-window" style="display: flex; flex-direction: column; height: 100%;">
          <!-- Toolbar -->
          <div class="beos-toolbar">
            <button class="beos-toolbar-button" data-action="prev" title="Previous">◀</button>
            <button class="beos-toolbar-button" data-action="next" title="Next">▶</button>
            <div class="beos-toolbar-separator"></div>
            <button class="beos-toolbar-button" data-action="zoom-out" title="Zoom Out">-</button>
            <span id="zoom-level" style="font-size: 10px; padding: 0 8px; min-width: 50px; text-align: center;">100%</span>
            <button class="beos-toolbar-button" data-action="zoom-in" title="Zoom In">+</button>
            <button class="beos-toolbar-button" data-action="zoom-fit" title="Fit to Window">⊞</button>
            <div class="beos-toolbar-separator"></div>
            <button class="beos-toolbar-button" data-action="rotate-left" title="Rotate Left">↶</button>
            <button class="beos-toolbar-button" data-action="rotate-right" title="Rotate Right">↷</button>
            <div class="beos-toolbar-separator"></div>
            <button class="beos-toolbar-button" data-action="slideshow" title="Slideshow">▶▶</button>
            <button class="beos-toolbar-button" data-action="fullscreen" title="Full Screen">⛶</button>
          </div>

          <!-- Image Display Area -->
          <div id="image-container" style="flex: 1; overflow: auto; display: flex; align-items: center; justify-content: center; background: #000;">
            <div id="image-wrapper" style="text-align: center;">
              <div style="font-size: 64px; color: #666;">🖼️</div>
              <div style="color: #999; font-size: 10px; margin-top: 12px;">Sample Image.jpg</div>
            </div>
          </div>

          <!-- Status Bar -->
          <div class="beos-statusbar">
            <span id="image-info">Image 1 of ${this.images.length}</span>
            <span style="margin-left: auto;" id="image-size">800 × 600</span>
          </div>
        </div>
      `;
    }

    /**
     * Setup event handlers
     * @private
     */
    _setupEventHandlers() {
      const toolbar = this.window.querySelector('.beos-toolbar');
      if (toolbar) {
        toolbar.addEventListener('click', (e) => {
          const button = e.target.closest('[data-action]');
          if (!button) return;

          const action = button.dataset.action;
          switch (action) {
            case 'prev':
              this._previousImage();
              break;
            case 'next':
              this._nextImage();
              break;
            case 'zoom-in':
              this._zoomIn();
              break;
            case 'zoom-out':
              this._zoomOut();
              break;
            case 'zoom-fit':
              this._zoomFit();
              break;
            case 'rotate-left':
              this._rotateLeft();
              break;
            case 'rotate-right':
              this._rotateRight();
              break;
            case 'slideshow':
              this._startSlideshow();
              break;
            case 'fullscreen':
              this._toggleFullscreen();
              break;
          }
        });
      }

      // Keyboard shortcuts
      this.window.addEventListener('keydown', (e) => {
        switch (e.key) {
          case 'ArrowLeft':
            this._previousImage();
            break;
          case 'ArrowRight':
            this._nextImage();
            break;
          case '+':
          case '=':
            this._zoomIn();
            break;
          case '-':
            this._zoomOut();
            break;
        }
      });
    }

    /**
     * Load image
     * @private
     */
    _loadImage() {
      const image = this.images[this.currentImageIndex];
      const wrapper = this.window.querySelector('#image-wrapper');

      if (wrapper) {
        wrapper.innerHTML = `
          <div style="font-size: 64px; color: #CCC;">${image.icon}</div>
          <div style="color: #999; font-size: 10px; margin-top: 12px;">${image.name}</div>
        `;
      }

      // Update info
      const info = this.window.querySelector('#image-info');
      if (info) {
        info.textContent = `Image ${this.currentImageIndex + 1} of ${this.images.length}`;
      }

      const size = this.window.querySelector('#image-size');
      if (size) {
        size.textContent = image.dimensions;
      }

      // Update window title
      const titleEl = this.window.querySelector('.beos-window-tab-title');
      if (titleEl) {
        titleEl.textContent = `ShowImage - ${image.name}`;
      }

      this._updateZoomDisplay();
    }

    /**
     * Previous image
     * @private
     */
    _previousImage() {
      this.currentImageIndex--;
      if (this.currentImageIndex < 0) {
        this.currentImageIndex = this.images.length - 1;
      }
      this._loadImage();
    }

    /**
     * Next image
     * @private
     */
    _nextImage() {
      this.currentImageIndex++;
      if (this.currentImageIndex >= this.images.length) {
        this.currentImageIndex = 0;
      }
      this._loadImage();
    }

    /**
     * Zoom in
     * @private
     */
    _zoomIn() {
      this.zoomLevel += 25;
      if (this.zoomLevel > 400) this.zoomLevel = 400;
      this._updateZoomDisplay();
    }

    /**
     * Zoom out
     * @private
     */
    _zoomOut() {
      this.zoomLevel -= 25;
      if (this.zoomLevel < 25) this.zoomLevel = 25;
      this._updateZoomDisplay();
    }

    /**
     * Zoom to fit
     * @private
     */
    _zoomFit() {
      this.zoomLevel = 100;
      this._updateZoomDisplay();
    }

    /**
     * Update zoom display
     * @private
     */
    _updateZoomDisplay() {
      const zoomEl = this.window.querySelector('#zoom-level');
      if (zoomEl) {
        zoomEl.textContent = `${this.zoomLevel}%`;
      }

      const wrapper = this.window.querySelector('#image-wrapper');
      if (wrapper) {
        wrapper.style.transform = `scale(${this.zoomLevel / 100}) rotate(${this.rotation}deg)`;
      }
    }

    /**
     * Rotate left
     * @private
     */
    _rotateLeft() {
      this.rotation -= 90;
      this._updateZoomDisplay();
    }

    /**
     * Rotate right
     * @private
     */
    _rotateRight() {
      this.rotation += 90;
      this._updateZoomDisplay();
    }

    /**
     * Start slideshow
     * @private
     */
    _startSlideshow() {
      alert('Slideshow feature - would cycle through images automatically');
    }

    /**
     * Toggle fullscreen
     * @private
     */
    _toggleFullscreen() {
      console.log('Fullscreen toggle');
      // Could maximize window
    }

    /**
     * Get mock images
     * @private
     */
    _getMockImages() {
      return [
        { name: 'Vacation.jpg', icon: '🏖️', dimensions: '1024 × 768' },
        { name: 'Family.jpg', icon: '👨‍👩‍👧‍👦', dimensions: '800 × 600' },
        { name: 'Landscape.jpg', icon: '🏔️', dimensions: '1920 × 1080' },
        { name: 'Sunset.jpg', icon: '🌅', dimensions: '1600 × 1200' }
      ];
    }

    /**
     * Cleanup
     * @private
     */
    _cleanup() {
      if (this.desktop.workspaceSwitcher) {
        this.desktop.workspaceSwitcher.removeWindowFromWorkspace(this.windowId);
      }
    }
  }

  // Export to global scope
  global.BeOSShowImage = BeOSShowImage;

})(window);
