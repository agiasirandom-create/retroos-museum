/**
 * BeOS BeDepot
 * Software package manager for BeOS
 */

(function(global) {
  'use strict';

  /**
   * BeOS BeDepot Application
   */
  class BeOSBeDepot {
    constructor(desktop) {
      this.desktop = desktop;
      this.window = null;
      this.windowId = null;
      this.packages = this._createPackageList();
      this.selectedPackage = null;
    }

    /**
     * Launch BeDepot
     */
    launch() {
      const content = this._createContent();

      this.windowId = `bedepot-${Date.now()}`;
      this.window = this.desktop.windowSystem.createWindow({
        id: this.windowId,
        title: 'BeDepot',
        width: 600,
        height: 450,
        content: content,
        resizable: true,
        menuItems: [
          { label: 'File', onClick: () => {} },
          { label: 'Packages', onClick: () => {} },
          { label: 'Help', onClick: () => {} }
        ],
        onClose: () => this._cleanup()
      });

      // Add to current workspace
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
    }

    /**
     * Create BeDepot content
     * @private
     */
    _createContent() {
      return `
        <div class="bedepot-window" style="display: flex; flex-direction: column; height: 100%;">
          <!-- Toolbar -->
          <div class="beos-toolbar">
            <button class="beos-toolbar-button" data-action="refresh" title="Refresh">🔄</button>
            <button class="beos-toolbar-button" data-action="search" title="Search">🔍</button>
            <div class="beos-toolbar-separator"></div>
            <input type="text" class="beos-input" id="search-box" placeholder="Search packages..." style="flex: 1; margin: 0 4px;">
          </div>

          <!-- Main Content Area -->
          <div style="flex: 1; display: flex; overflow: hidden;">
            <!-- Categories Sidebar -->
            <div id="categories-sidebar" style="
              width: 150px;
              background: #EEEEEE;
              border-right: 1px solid #808080;
              overflow-y: auto;
              padding: 8px;
            ">
              <div style="font-size: 10px; font-weight: bold; margin-bottom: 8px;">Categories</div>
              <div class="category-list" style="font-size: 10px;">
                <!-- Categories will be populated here -->
              </div>
            </div>

            <!-- Package List -->
            <div style="flex: 1; display: flex; flex-direction: column;">
              <div id="package-list" style="
                flex: 1;
                overflow-y: auto;
                background: white;
              ">
                <!-- Packages will be listed here -->
              </div>

              <!-- Package Details -->
              <div id="package-details" style="
                height: 150px;
                background: #EEEEEE;
                border-top: 1px solid #808080;
                padding: 12px;
                overflow-y: auto;
                display: none;
              ">
                <!-- Package details will be shown here -->
              </div>
            </div>
          </div>

          <!-- Status Bar -->
          <div class="beos-statusbar">
            <span id="bedepot-status">Ready - ${this.packages.length} packages available</span>
            <div style="margin-left: auto; display: flex; gap: 8px;">
              <button class="beos-button" id="btn-install" disabled>Install</button>
              <button class="beos-button" id="btn-uninstall" disabled>Uninstall</button>
            </div>
          </div>
        </div>
      `;
    }

    /**
     * Setup event handlers
     * @private
     */
    _setupEventHandlers() {
      // Populate categories
      this._populateCategories();

      // Populate package list
      this._populatePackages();

      // Search box
      const searchBox = this.window.querySelector('#search-box');
      if (searchBox) {
        searchBox.addEventListener('input', (e) => {
          this._filterPackages(e.target.value);
        });
      }

      // Toolbar buttons
      const toolbar = this.window.querySelector('.beos-toolbar');
      if (toolbar) {
        toolbar.addEventListener('click', (e) => {
          const button = e.target.closest('[data-action]');
          if (!button) return;

          const action = button.dataset.action;
          if (action === 'refresh') {
            this._refresh();
          } else if (action === 'search') {
            if (searchBox) searchBox.focus();
          }
        });
      }

      // Install/Uninstall buttons
      const btnInstall = this.window.querySelector('#btn-install');
      const btnUninstall = this.window.querySelector('#btn-uninstall');

      if (btnInstall) {
        btnInstall.addEventListener('click', () => this._installPackage());
      }

      if (btnUninstall) {
        btnUninstall.addEventListener('click', () => this._uninstallPackage());
      }
    }

    /**
     * Populate categories
     * @private
     */
    _populateCategories() {
      const categories = ['All', 'Audio', 'Games', 'Graphics', 'Internet', 'Productivity', 'System', 'Utilities'];
      const categoryList = this.window.querySelector('.category-list');

      if (!categoryList) return;

      categories.forEach(cat => {
        const item = document.createElement('div');
        item.className = 'category-item';
        item.textContent = cat;
        item.style.cssText = 'padding: 4px 8px; cursor: pointer; border-radius: 2px;';

        if (cat === 'All') {
          item.style.background = '#336699';
          item.style.color = '#FFFFFF';
        }

        item.addEventListener('click', () => {
          // Clear previous selection
          categoryList.querySelectorAll('.category-item').forEach(i => {
            i.style.background = '';
            i.style.color = '';
          });

          // Select this category
          item.style.background = '#336699';
          item.style.color = '#FFFFFF';

          this._filterByCategory(cat);
        });

        categoryList.appendChild(item);
      });
    }

    /**
     * Populate packages
     * @private
     */
    _populatePackages(packages = null) {
      const packageList = this.window.querySelector('#package-list');
      if (!packageList) return;

      const pkgs = packages || this.packages;
      packageList.innerHTML = '';

      pkgs.forEach(pkg => {
        const item = document.createElement('div');
        item.className = 'package-item';
        item.dataset.id = pkg.id;
        item.style.cssText = `
          padding: 12px;
          border-bottom: 1px solid #EEEEEE;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
        `;

        item.innerHTML = `
          <div style="font-size: 32px;">${pkg.icon}</div>
          <div style="flex: 1;">
            <div style="font-weight: bold; font-size: 11px; margin-bottom: 2px;">${pkg.name}</div>
            <div style="font-size: 9px; color: #666;">${pkg.description}</div>
            <div style="font-size: 9px; color: #999; margin-top: 2px;">
              ${pkg.category} • ${pkg.size} • ${pkg.installed ? 'Installed' : 'Not installed'}
            </div>
          </div>
        `;

        item.addEventListener('click', () => this._selectPackage(pkg, item));

        item.addEventListener('mouseenter', () => {
          item.style.background = '#F0F0F0';
        });

        item.addEventListener('mouseleave', () => {
          if (!item.classList.contains('selected')) {
            item.style.background = '';
          }
        });

        packageList.appendChild(item);
      });
    }

    /**
     * Select package
     * @private
     */
    _selectPackage(pkg, item) {
      this.selectedPackage = pkg;

      // Clear previous selection
      this.window.querySelectorAll('.package-item').forEach(i => {
        i.classList.remove('selected');
        i.style.background = '';
      });

      // Select this item
      item.classList.add('selected');
      item.style.background = '#4682B4';
      item.style.color = '#FFFFFF';

      // Show package details
      this._showPackageDetails(pkg);

      // Enable/disable buttons
      const btnInstall = this.window.querySelector('#btn-install');
      const btnUninstall = this.window.querySelector('#btn-uninstall');

      if (btnInstall) {
        btnInstall.disabled = pkg.installed;
      }

      if (btnUninstall) {
        btnUninstall.disabled = !pkg.installed;
      }
    }

    /**
     * Show package details
     * @private
     */
    _showPackageDetails(pkg) {
      const details = this.window.querySelector('#package-details');
      if (!details) return;

      details.style.display = 'block';
      details.innerHTML = `
        <div style="font-size: 11px; font-weight: bold; margin-bottom: 8px;">${pkg.name}</div>
        <div style="font-size: 10px; margin-bottom: 8px;">${pkg.description}</div>
        <div style="font-size: 9px; color: #666;">
          <div>Category: ${pkg.category}</div>
          <div>Version: ${pkg.version}</div>
          <div>Size: ${pkg.size}</div>
          <div>Author: ${pkg.author}</div>
          <div>Status: ${pkg.installed ? 'Installed' : 'Not installed'}</div>
        </div>
      `;
    }

    /**
     * Filter packages
     * @private
     */
    _filterPackages(query) {
      if (!query) {
        this._populatePackages();
        return;
      }

      const filtered = this.packages.filter(pkg =>
        pkg.name.toLowerCase().includes(query.toLowerCase()) ||
        pkg.description.toLowerCase().includes(query.toLowerCase())
      );

      this._populatePackages(filtered);
    }

    /**
     * Filter by category
     * @private
     */
    _filterByCategory(category) {
      if (category === 'All') {
        this._populatePackages();
        return;
      }

      const filtered = this.packages.filter(pkg => pkg.category === category);
      this._populatePackages(filtered);
    }

    /**
     * Install package
     * @private
     */
    _installPackage() {
      if (!this.selectedPackage) return;

      const status = this.window.querySelector('#bedepot-status');
      if (status) {
        status.textContent = `Installing ${this.selectedPackage.name}...`;
      }

      // Simulate installation
      setTimeout(() => {
        this.selectedPackage.installed = true;

        if (status) {
          status.textContent = `${this.selectedPackage.name} installed successfully`;
        }

        // Update UI
        this._populatePackages();
        this.selectedPackage = null;

        const btnInstall = this.window.querySelector('#btn-install');
        const btnUninstall = this.window.querySelector('#btn-uninstall');

        if (btnInstall) btnInstall.disabled = true;
        if (btnUninstall) btnUninstall.disabled = true;

        setTimeout(() => {
          if (status) {
            status.textContent = `Ready - ${this.packages.length} packages available`;
          }
        }, 2000);
      }, 1500);
    }

    /**
     * Uninstall package
     * @private
     */
    _uninstallPackage() {
      if (!this.selectedPackage) return;

      const confirmed = confirm(`Uninstall ${this.selectedPackage.name}?`);
      if (!confirmed) return;

      const status = this.window.querySelector('#bedepot-status');
      if (status) {
        status.textContent = `Uninstalling ${this.selectedPackage.name}...`;
      }

      // Simulate uninstallation
      setTimeout(() => {
        this.selectedPackage.installed = false;

        if (status) {
          status.textContent = `${this.selectedPackage.name} uninstalled`;
        }

        // Update UI
        this._populatePackages();
        this.selectedPackage = null;

        const btnInstall = this.window.querySelector('#btn-install');
        const btnUninstall = this.window.querySelector('#btn-uninstall');

        if (btnInstall) btnInstall.disabled = true;
        if (btnUninstall) btnUninstall.disabled = true;

        setTimeout(() => {
          if (status) {
            status.textContent = `Ready - ${this.packages.length} packages available`;
          }
        }, 2000);
      }, 1000);
    }

    /**
     * Refresh package list
     * @private
     */
    _refresh() {
      const status = this.window.querySelector('#bedepot-status');
      if (status) {
        status.textContent = 'Refreshing package list...';
      }

      setTimeout(() => {
        this._populatePackages();
        if (status) {
          status.textContent = `Ready - ${this.packages.length} packages available`;
        }
      }, 500);
    }

    /**
     * Create package list
     * @private
     */
    _createPackageList() {
      return [
        {
          id: 1,
          name: 'SoundPlay',
          description: 'Advanced audio player with playlist support',
          category: 'Audio',
          version: '4.9.1',
          size: '1.2 MB',
          author: 'Marco Nelissen',
          icon: '🎵',
          installed: false
        },
        {
          id: 2,
          name: 'Vision',
          description: 'IRC client for BeOS',
          category: 'Internet',
          version: '0.1.8',
          size: '850 KB',
          author: 'Vision Team',
          icon: '💬',
          installed: true
        },
        {
          id: 3,
          name: 'Gobe Productive',
          description: 'Integrated office suite',
          category: 'Productivity',
          version: '2.0',
          size: '15 MB',
          author: 'Gobe Software',
          icon: '📊',
          installed: false
        },
        {
          id: 4,
          name: 'BeatBox',
          description: 'Drum machine and sequencer',
          category: 'Audio',
          version: '1.0',
          size: '2.3 MB',
          author: 'Be Inc.',
          icon: '🥁',
          installed: false
        },
        {
          id: 5,
          name: 'Pe',
          description: 'Powerful programmer\'s editor',
          category: 'Productivity',
          version: '2.4.3',
          size: '1.8 MB',
          author: 'Maarten Hekkelman',
          icon: '📝',
          installed: true
        },
        {
          id: 6,
          name: 'ArtPaint',
          description: 'Bitmap image editor',
          category: 'Graphics',
          version: '2.1.0',
          size: '3.5 MB',
          author: 'Heikki Suhonen',
          icon: '🎨',
          installed: false
        },
        {
          id: 7,
          name: 'BePDF',
          description: 'PDF viewer and annotator',
          category: 'Utilities',
          version: '1.1.1',
          size: '1.1 MB',
          author: 'Michael Pfeiffer',
          icon: '📄',
          installed: true
        },
        {
          id: 8,
          name: 'NetPositive',
          description: 'Web browser for BeOS',
          category: 'Internet',
          version: '2.2.2',
          size: '2.8 MB',
          author: 'Be Inc.',
          icon: '🌐',
          installed: true
        }
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
  global.BeOSBeDepot = BeOSBeDepot;

})(window);
