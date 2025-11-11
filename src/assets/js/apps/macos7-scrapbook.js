/**
 * Mac OS System 7 Scrapbook
 * Collection viewer for images and text clippings
 */

(function(global) {
  'use strict';

  /**
   * Mac OS 7 Scrapbook Application
   */
  class MacOS7Scrapbook {
    constructor(desktop) {
      this.desktop = desktop;
      this.window = null;
      this.currentPage = 0;
      this.pages = this._generateSamplePages();
    }

    /**
     * Generate sample scrapbook pages
     * @private
     */
    _generateSamplePages() {
      return [
        {
          type: 'text',
          content: 'Welcome to Scrapbook!\n\nThis is a place to store text clippings, images, and other items for later use.'
        },
        {
          type: 'text',
          content: 'Classic Macintosh Quote:\n\n"The journey is the reward."\n- Steve Jobs'
        },
        {
          type: 'image',
          content: '<svg width="200" height="150" viewBox="0 0 200 150"><rect width="200" height="150" fill="#e0e0e0"/><text x="100" y="75" text-anchor="middle" font-family="Geneva" font-size="14">Sample Image</text><circle cx="100" cy="75" r="40" fill="none" stroke="#000" stroke-width="2"/></svg>'
        },
        {
          type: 'text',
          content: 'Keyboard Shortcuts:\n\nCommand-C: Copy\nCommand-V: Paste\nCommand-X: Cut\nCommand-Z: Undo'
        },
        {
          type: 'text',
          content: 'Mac OS System 7\n\nReleased: May 13, 1991\n\nFeatures:\n• Virtual Memory\n• Personal File Sharing\n• System Extensions\n• TrueType Fonts'
        }
      ];
    }

    /**
     * Open Scrapbook
     */
    open() {
      if (this.window) {
        this.window.focus();
        return;
      }

      const content = this._buildContent();

      this.window = this.desktop.createAppWindow({
        id: 'scrapbook',
        title: 'Scrapbook',
        content: content,
        width: 420,
        height: 320,
        resizable: true,
        onClose: () => {
          this.window = null;
          return true;
        }
      });

      this._attachEventListeners();
      this._updatePage();
    }

    /**
     * Build Scrapbook content
     * @private
     */
    _buildContent() {
      return `
        <div style="height: 100%; display: flex; flex-direction: column;">
          <!-- Content area -->
          <div id="scrapbook-page" style="flex: 1; padding: 16px; overflow: auto; background: var(--mac7-white);">
            <!-- Page content goes here -->
          </div>

          <!-- Controls -->
          <div style="border-top: 1px solid var(--mac7-black); padding: 8px; background: var(--mac7-light-gray); display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; gap: 8px;">
              <button id="prev-page-btn" class="mac-button" style="width: 80px;">
                « Prev
              </button>
              <button id="next-page-btn" class="mac-button" style="width: 80px;">
                Next »
              </button>
            </div>

            <div style="font-family: var(--mac7-geneva); font-size: 11px;">
              Page <span id="page-number">1</span> of <span id="total-pages">${this.pages.length}</span>
            </div>

            <div style="display: flex; gap: 8px;">
              <button id="new-page-btn" class="mac-button">
                New
              </button>
              <button id="clear-page-btn" class="mac-button">
                Clear
              </button>
            </div>
          </div>
        </div>
      `;
    }

    /**
     * Update page display
     * @private
     */
    _updatePage() {
      if (!this.window) return;

      const pageContent = this.window.element.querySelector('#scrapbook-page');
      const pageNumber = this.window.element.querySelector('#page-number');
      const totalPages = this.window.element.querySelector('#total-pages');
      const prevBtn = this.window.element.querySelector('#prev-page-btn');
      const nextBtn = this.window.element.querySelector('#next-page-btn');

      if (!pageContent) return;

      // Update page number
      pageNumber.textContent = this.currentPage + 1;
      totalPages.textContent = this.pages.length;

      // Update button states
      prevBtn.disabled = this.currentPage === 0;
      nextBtn.disabled = this.currentPage >= this.pages.length - 1;

      // Display current page
      const page = this.pages[this.currentPage];
      if (page.type === 'text') {
        pageContent.innerHTML = `
          <div style="font-family: var(--mac7-geneva); font-size: 12px; white-space: pre-wrap;">
            ${this._escapeHtml(page.content)}
          </div>
        `;
      } else if (page.type === 'image') {
        pageContent.innerHTML = `
          <div style="text-align: center; padding: 20px;">
            ${page.content}
          </div>
        `;
      }
    }

    /**
     * Escape HTML
     * @param {string} text - Text to escape
     * @private
     */
    _escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    /**
     * Attach event listeners
     * @private
     */
    _attachEventListeners() {
      if (!this.window) return;

      const element = this.window.element;
      const prevBtn = element.querySelector('#prev-page-btn');
      const nextBtn = element.querySelector('#next-page-btn');
      const newBtn = element.querySelector('#new-page-btn');
      const clearBtn = element.querySelector('#clear-page-btn');

      // Previous page
      prevBtn.addEventListener('click', () => {
        if (this.currentPage > 0) {
          this.currentPage--;
          this._updatePage();
        }
      });

      // Next page
      nextBtn.addEventListener('click', () => {
        if (this.currentPage < this.pages.length - 1) {
          this.currentPage++;
          this._updatePage();
        }
      });

      // New page
      newBtn.addEventListener('click', () => {
        this.pages.push({
          type: 'text',
          content: 'New page...'
        });
        this.currentPage = this.pages.length - 1;
        this._updatePage();
      });

      // Clear page
      clearBtn.addEventListener('click', () => {
        if (confirm('Clear this page?')) {
          this.pages[this.currentPage] = {
            type: 'text',
            content: ''
          };
          this._updatePage();
        }
      });

      // Keyboard navigation
      element.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && this.currentPage > 0) {
          this.currentPage--;
          this._updatePage();
        } else if (e.key === 'ArrowRight' && this.currentPage < this.pages.length - 1) {
          this.currentPage++;
          this._updatePage();
        }
      });
    }
  }

  // Export to global scope
  global.MacOS7Scrapbook = MacOS7Scrapbook;

})(typeof window !== 'undefined' ? window : global);
