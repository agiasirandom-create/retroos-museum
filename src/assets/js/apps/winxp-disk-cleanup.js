/**
 * Windows XP Disk Cleanup
 * System utility for cleaning temporary files
 */

(function(global) {
  'use strict';

  class WinXPDiskCleanup {
    constructor(desktop) {
      this.desktop = desktop;
      this.window = null;
      this.scanning = false;
      this.selectedCategories = new Set(['temp', 'cache']);
    }

    /**
     * Open Disk Cleanup window
     */
    open() {
      const windowContent = this.buildContent();

      this.window = this.desktop.windowManager.createWindow({
        id: `diskcleanup-${Date.now()}`,
        title: 'Disk Cleanup for (C:)',
        content: windowContent,
        width: 500,
        height: 450,
        minWidth: 450,
        minHeight: 400,
        resizable: false,
        minimizable: true,
        maximizable: false
      });

      this.setupEventListeners();
    }

    /**
     * Build window content
     */
    buildContent() {
      return `
        <div class="diskcleanup-container" style="display: flex; flex-direction: column; height: 100%; font-family: Tahoma, Arial, sans-serif; font-size: 11px; background: #ECE9D8; padding: 12px;">
          <!-- Header -->
          <div style="margin-bottom: 16px;">
            <h2 style="margin: 0 0 8px 0; font-size: 14px; color: #000;">Disk Cleanup for (C:)</h2>
            <p style="margin: 0; color: #333; line-height: 1.5;">
              You can use Disk Cleanup to free up to <strong id="total-space">2,847 MB</strong> of disk space on (C:).
            </p>
          </div>

          <!-- Drive Selector -->
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px; padding: 12px; background: white; border: 1px solid #ACA899; border-radius: 4px;">
            <span style="font-weight: bold;">Drive:</span>
            <select id="drive-select" style="flex: 1; padding: 4px; border: 1px solid #ACA899; background: white; font-family: Tahoma; font-size: 11px;">
              <option value="C" selected>(C:) Local Disk</option>
              <option value="D">(D:) CD Drive</option>
            </select>
            <button id="scan-btn" style="padding: 6px 16px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer; font-family: Tahoma; font-size: 11px; font-weight: bold;">Scan</button>
          </div>

          <!-- Files to Delete Section -->
          <div style="flex: 1; display: flex; flex-direction: column; background: white; border: 1px solid #ACA899; padding: 12px; overflow: hidden;">
            <div style="margin-bottom: 8px;">
              <strong>Files to delete:</strong>
            </div>

            <!-- Category List -->
            <div id="category-list" style="flex: 1; overflow-y: auto; border: 1px solid #D0D0D0; background: white; padding: 8px;">
              ${this.buildCategoryList()}
            </div>

            <!-- Description -->
            <div style="margin-top: 12px; padding: 12px; background: #F0F0F0; border: 1px solid #D0D0D0; border-radius: 4px; min-height: 60px;">
              <strong style="display: block; margin-bottom: 4px;">Description:</strong>
              <div id="description-text" style="color: #333; line-height: 1.5; font-size: 11px;">
                Select a category above to see its description.
              </div>
            </div>

            <!-- Total Space Summary -->
            <div style="margin-top: 12px; padding: 12px; background: #E8F2FF; border: 1px solid #5A8DD5; border-radius: 4px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>Total amount of disk space you gain:</span>
                <strong id="space-gain">1,234 MB</strong>
              </div>
              <div style="font-size: 10px; color: #666; margin-top: 4px;">
                This is an estimate based on selected categories.
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px;">
            <button id="view-files-btn" style="padding: 6px 16px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer; font-family: Tahoma; font-size: 11px;">View Files</button>
            <button id="ok-btn" style="padding: 6px 24px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer; font-family: Tahoma; font-size: 11px; font-weight: bold;">OK</button>
            <button id="cancel-btn" style="padding: 6px 16px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer; font-family: Tahoma; font-size: 11px;">Cancel</button>
          </div>
        </div>
      `;
    }

    /**
     * Build category list
     */
    buildCategoryList() {
      const categories = [
        { id: 'temp', label: 'Temporary files', size: 856, description: 'Temporary files are created by programs and can be safely deleted.' },
        { id: 'cache', label: 'Temporary Internet Files', size: 378, description: 'The Temporary Internet Files folder contains Web pages stored on your hard disk for quick viewing. Your personalized settings for Web pages will be left intact.' },
        { id: 'recyclebin', label: 'Recycle Bin', size: 245, description: 'The Recycle Bin contains files you have deleted from your computer. These files are not permanently removed until you empty the Recycle Bin.' },
        { id: 'thumbnails', label: 'Thumbnails', size: 124, description: 'Windows keeps a copy of all your picture, video, and document thumbnails so they can be displayed quickly when you open a folder.' },
        { id: 'offline', label: 'Offline Web Pages', size: 89, description: 'Offline Web Pages are Web pages that are stored on your computer so you can view them without being connected to the Internet.' },
        { id: 'setup', label: 'Setup Log Files', size: 45, description: 'Setup Log Files are created by Windows Setup and can be deleted if no problems have occurred.' },
        { id: 'compress', label: 'Old Chkdsk files', size: 12, description: 'When Chkdsk checks your disk for errors, it might save lost file fragments as files in your disk\'s root folder. These files are unnecessary and can be removed.' }
      ];

      return categories.map(cat => `
        <label class="category-item" data-category="${cat.id}" style="display: flex; align-items: center; gap: 8px; padding: 6px; cursor: pointer; border-radius: 2px; transition: background-color 0.1s; user-select: none;" onmouseover="this.style.background='#E8F2FF'" onmouseout="this.style.background=''">
          <input type="checkbox" class="category-checkbox" data-category="${cat.id}" data-size="${cat.size}" ${this.selectedCategories.has(cat.id) ? 'checked' : ''} style="cursor: pointer;">
          <div style="flex: 1;">
            <div style="font-weight: 500;">${cat.label}</div>
            <div style="font-size: 10px; color: #666; margin-top: 2px;">${cat.size} MB</div>
          </div>
        </label>
      `).join('');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
      // Scan button
      const scanBtn = this.window.element.querySelector('#scan-btn');
      if (scanBtn) {
        scanBtn.addEventListener('click', () => {
          this.performScan();
        });
      }

      // OK button
      const okBtn = this.window.element.querySelector('#ok-btn');
      if (okBtn) {
        okBtn.addEventListener('click', () => {
          this.performCleanup();
        });
      }

      // Cancel button
      const cancelBtn = this.window.element.querySelector('#cancel-btn');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          this.window.close();
        });
      }

      // View Files button
      const viewFilesBtn = this.window.element.querySelector('#view-files-btn');
      if (viewFilesBtn) {
        viewFilesBtn.addEventListener('click', () => {
          alert('View Files\n\nIn a full implementation, this would show a list of files to be deleted.');
        });
      }

      // Category checkboxes
      const checkboxes = this.window.element.querySelectorAll('.category-checkbox');
      checkboxes.forEach(cb => {
        cb.addEventListener('change', (e) => {
          if (e.target.checked) {
            this.selectedCategories.add(e.target.dataset.category);
          } else {
            this.selectedCategories.delete(e.target.dataset.category);
          }
          this.updateSpaceGain();
        });
      });

      // Category items for description
      const categoryItems = this.window.element.querySelectorAll('.category-item');
      categoryItems.forEach(item => {
        item.addEventListener('click', (e) => {
          if (e.target.type !== 'checkbox') {
            const checkbox = item.querySelector('.category-checkbox');
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
          }
          this.showDescription(item.dataset.category);
        });
      });

      // Button hover effects
      const buttons = this.window.element.querySelectorAll('button');
      buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
          btn.style.background = 'linear-gradient(to bottom, #E8F2FF 0%, #C0DEFF 100%)';
          btn.style.borderColor = '#0054E3';
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.background = 'linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%)';
          btn.style.borderColor = '#ACA899';
        });
      });

      // Initial space calculation
      this.updateSpaceGain();
    }

    /**
     * Show description for category
     */
    showDescription(categoryId) {
      const descriptions = {
        'temp': 'Temporary files are created by programs and can be safely deleted.',
        'cache': 'The Temporary Internet Files folder contains Web pages stored on your hard disk for quick viewing. Your personalized settings for Web pages will be left intact.',
        'recyclebin': 'The Recycle Bin contains files you have deleted from your computer. These files are not permanently removed until you empty the Recycle Bin.',
        'thumbnails': 'Windows keeps a copy of all your picture, video, and document thumbnails so they can be displayed quickly when you open a folder.',
        'offline': 'Offline Web Pages are Web pages that are stored on your computer so you can view them without being connected to the Internet.',
        'setup': 'Setup Log Files are created by Windows Setup and can be deleted if no problems have occurred.',
        'compress': 'When Chkdsk checks your disk for errors, it might save lost file fragments as files in your disk\'s root folder. These files are unnecessary and can be removed.'
      };

      const descText = this.window.element.querySelector('#description-text');
      if (descText) {
        descText.textContent = descriptions[categoryId] || 'Select a category to see its description.';
      }
    }

    /**
     * Update space gain calculation
     */
    updateSpaceGain() {
      const checkboxes = this.window.element.querySelectorAll('.category-checkbox:checked');
      let totalSpace = 0;

      checkboxes.forEach(cb => {
        totalSpace += parseInt(cb.dataset.size);
      });

      const spaceGain = this.window.element.querySelector('#space-gain');
      if (spaceGain) {
        spaceGain.textContent = `${totalSpace.toLocaleString()} MB`;
      }
    }

    /**
     * Perform scan
     */
    performScan() {
      if (this.scanning) return;

      this.scanning = true;
      const scanBtn = this.window.element.querySelector('#scan-btn');
      if (scanBtn) {
        scanBtn.textContent = 'Scanning...';
        scanBtn.disabled = true;
      }

      // Simulate scanning
      setTimeout(() => {
        this.scanning = false;
        if (scanBtn) {
          scanBtn.textContent = 'Scan';
          scanBtn.disabled = false;
        }
        alert('Scan Complete\n\nDisk Cleanup has calculated the amount of space you can free up.');
      }, 2000);
    }

    /**
     * Perform cleanup
     */
    performCleanup() {
      const checkboxes = this.window.element.querySelectorAll('.category-checkbox:checked');
      if (checkboxes.length === 0) {
        alert('No categories selected\n\nPlease select at least one category to clean up.');
        return;
      }

      let totalSpace = 0;
      checkboxes.forEach(cb => {
        totalSpace += parseInt(cb.dataset.size);
      });

      const confirmed = confirm(
        `Disk Cleanup\n\n` +
        `Are you sure you want to permanently delete these files?\n\n` +
        `Total space to be freed: ${totalSpace.toLocaleString()} MB`
      );

      if (confirmed) {
        // Simulate cleanup
        alert(
          `Disk Cleanup Complete\n\n` +
          `Successfully freed ${totalSpace.toLocaleString()} MB of disk space.`
        );
        this.window.close();
      }
    }
  }

  // Export to global scope
  global.WinXPDiskCleanup = WinXPDiskCleanup;

})(typeof window !== 'undefined' ? window : global);
