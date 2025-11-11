/**
 * Mac OS 9 Keychain Access
 * Password and certificate management
 */

(function(global) {
  'use strict';

  class MacOS9Keychain {
    constructor(desktop) {
      this.desktop = desktop;
      this.currentCategory = 'all';
      this.isLocked = true;
      this.keychainItems = this._generateSampleItems();
    }

    open() {
      const content = this._buildKeychainContent();

      this.window = this.desktop.createAppWindow({
        id: 'keychain-access',
        title: 'Keychain Access',
        content: content,
        width: 640,
        height: 480,
        resizable: true
      });

      this._attachListeners();
    }

    _generateSampleItems() {
      return [
        { name: 'apple.com', type: 'password', account: 'user@example.com', kind: 'Internet password', created: 'Nov 10, 2025' },
        { name: 'Mac OS 9 Login', type: 'password', account: 'Administrator', kind: 'Application password', created: 'Nov 1, 2025' },
        { name: 'mail.example.com', type: 'password', account: 'user@example.com', kind: 'Internet password', created: 'Nov 8, 2025' },
        { name: 'Apple Root CA', type: 'certificate', account: '-', kind: 'Certificate', created: 'Oct 15, 2025' },
        { name: 'File Server', type: 'password', account: 'guest', kind: 'AppleShare password', created: 'Nov 5, 2025' },
        { name: 'Developer ID', type: 'certificate', account: '-', kind: 'Certificate', created: 'Sep 20, 2025' }
      ];
    }

    _buildKeychainContent() {
      return `<div style="height: 100%; display: flex; flex-direction: column;">
        <!-- Toolbar -->
        <div style="padding: 8px; background: linear-gradient(to bottom, #EEEEEE, #DDDDDD); border-bottom: 1px solid #555; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; gap: 8px;">
            <select id="kc-keychain-select" class="mac9-input">
              <option>login</option>
              <option>System</option>
              <option>X509Anchors</option>
            </select>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="mac9-button" id="kc-lock" title="Lock Keychain">🔒 ${this.isLocked ? 'Unlock' : 'Lock'}</button>
            <button class="mac9-button" id="kc-settings" title="Keychain Settings">⚙</button>
          </div>
        </div>

        <!-- Main Content Area -->
        <div style="flex: 1; display: flex; overflow: hidden;">
          <!-- Sidebar - Categories -->
          <div style="width: 180px; background: var(--mac9-platinum-light); border-right: 1px solid #CCC; padding: 8px;">
            <div style="margin-bottom: 6px; font-family: var(--mac9-geneva); font-size: 11px; font-weight: bold; color: #666;">Category</div>
            <button class="kc-category-btn active" data-category="all" style="display: block; width: 100%; text-align: left; padding: 6px 8px; margin-bottom: 2px; background: var(--mac9-highlight); color: var(--mac9-highlight-text); border: none; border-radius: 3px; font-family: var(--mac9-geneva); font-size: 11px; cursor: default;">
              All Items
            </button>
            <button class="kc-category-btn" data-category="passwords" style="display: block; width: 100%; text-align: left; padding: 6px 8px; margin-bottom: 2px; background: transparent; border: none; border-radius: 3px; font-family: var(--mac9-geneva); font-size: 11px; cursor: default;">
              🔑 Passwords
            </button>
            <button class="kc-category-btn" data-category="certificates" style="display: block; width: 100%; text-align: left; padding: 6px 8px; margin-bottom: 2px; background: transparent; border: none; border-radius: 3px; font-family: var(--mac9-geneva); font-size: 11px; cursor: default;">
              📜 Certificates
            </button>
            <button class="kc-category-btn" data-category="keys" style="display: block; width: 100%; text-align: left; padding: 6px 8px; margin-bottom: 2px; background: transparent; border: none; border-radius: 3px; font-family: var(--mac9-geneva); font-size: 11px; cursor: default;">
              🔐 My Keys
            </button>

            <div style="margin: 16px 0 6px 0; font-family: var(--mac9-geneva); font-size: 11px; font-weight: bold; color: #666;">Actions</div>
            <button class="mac9-button" style="width: 100%; margin-bottom: 4px; font-size: 10px;" id="kc-new-password" ${this.isLocked ? 'disabled' : ''}>New Password Item</button>
            <button class="mac9-button" style="width: 100%; font-size: 10px;" id="kc-change-password" ${this.isLocked ? 'disabled' : ''}>Change Password...</button>
          </div>

          <!-- Main List Area -->
          <div style="flex: 1; display: flex; flex-direction: column;">
            <!-- Search Bar -->
            <div style="padding: 8px; background: #FFF; border-bottom: 1px solid #CCC;">
              <input type="text" id="kc-search" class="mac9-input" style="width: 100%;" placeholder="Search keychain items..." ${this.isLocked ? 'disabled' : ''}>
            </div>

            <!-- Items List -->
            <div id="kc-items-container" style="flex: 1; overflow: auto; background: #FFF;">
              ${this.isLocked ? this._renderLockedView() : this._renderItemsList()}
            </div>
          </div>
        </div>
      </div>`;
    }

    _renderLockedView() {
      return `<div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 40px; text-align: center;">
        <div>
          <div style="font-size: 64px; margin-bottom: 16px;">🔒</div>
          <h3 style="font-family: var(--mac9-charcoal); margin: 0 0 12px 0;">Keychain is Locked</h3>
          <p style="font-family: var(--mac9-geneva); font-size: 12px; color: #666; margin: 0 0 20px 0;">
            Click "Unlock" to access your passwords and certificates.
          </p>
          <button class="mac9-button default" onclick="document.getElementById('kc-lock').click()">Unlock Keychain</button>
        </div>
      </div>`;
    }

    _renderItemsList() {
      let items = this.keychainItems;

      if (this.currentCategory === 'passwords') {
        items = items.filter(item => item.type === 'password');
      } else if (this.currentCategory === 'certificates') {
        items = items.filter(item => item.type === 'certificate');
      } else if (this.currentCategory === 'keys') {
        items = []; // No keys in sample data
      }

      if (items.length === 0) {
        return `<div style="padding: 40px; text-align: center; color: #999;">
          <p>No items in this category</p>
        </div>`;
      }

      let html = '<div class="list-view"><table><thead><tr><th>Name</th><th>Kind</th><th>Account</th><th>Created</th></tr></thead><tbody>';

      items.forEach((item, index) => {
        const icon = item.type === 'password' ? '🔑' : '📜';
        html += `<tr class="list-item kc-item" data-index="${index}">
          <td>${icon} ${this._escapeHtml(item.name)}</td>
          <td>${this._escapeHtml(item.kind)}</td>
          <td>${this._escapeHtml(item.account)}</td>
          <td>${this._escapeHtml(item.created)}</td>
        </tr>`;
      });

      html += '</tbody></table></div>';
      return html;
    }

    _escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    _attachListeners() {
      if (!this.window || !this.window.element) return;

      const lockBtn = this.window.element.querySelector('#kc-lock');
      const settingsBtn = this.window.element.querySelector('#kc-settings');
      const categoryBtns = this.window.element.querySelectorAll('.kc-category-btn');
      const searchInput = this.window.element.querySelector('#kc-search');
      const newPasswordBtn = this.window.element.querySelector('#kc-new-password');
      const changePasswordBtn = this.window.element.querySelector('#kc-change-password');

      if (lockBtn) {
        lockBtn.addEventListener('click', () => this._toggleLock());
      }

      if (settingsBtn) {
        settingsBtn.addEventListener('click', () => this._showSettings());
      }

      categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          if (this.isLocked) return;

          const category = btn.getAttribute('data-category');
          this.currentCategory = category;

          categoryBtns.forEach(b => {
            b.style.background = 'transparent';
            b.style.color = '#000';
          });
          btn.style.background = 'var(--mac9-highlight)';
          btn.style.color = 'var(--mac9-highlight-text)';
          btn.classList.add('active');

          this._updateItemsList();
        });
      });

      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          console.log('Search:', e.target.value);
        });
      }

      if (newPasswordBtn) {
        newPasswordBtn.addEventListener('click', () => this._showNewPasswordDialog());
      }

      if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', () => {
          this.desktop._showAlert('Change keychain password (demo)');
        });
      }

      // Double-click to show item details
      this._attachItemListeners();
    }

    _attachItemListeners() {
      const itemsContainer = this.window.element.querySelector('#kc-items-container');
      if (itemsContainer) {
        itemsContainer.addEventListener('dblclick', (e) => {
          const item = e.target.closest('.kc-item');
          if (item) {
            const index = parseInt(item.getAttribute('data-index'));
            this._showItemDetails(this.keychainItems[index]);
          }
        });
      }
    }

    _toggleLock() {
      this.isLocked = !this.isLocked;

      if (!this.isLocked) {
        // Unlock - show password dialog
        this.desktop._showAlert('Keychain unlocked (demo)');
      }

      this._updateUI();
    }

    _updateUI() {
      const lockBtn = this.window.element.querySelector('#kc-lock');
      const searchInput = this.window.element.querySelector('#kc-search');
      const newPasswordBtn = this.window.element.querySelector('#kc-new-password');
      const changePasswordBtn = this.window.element.querySelector('#kc-change-password');

      if (lockBtn) {
        lockBtn.innerHTML = this.isLocked ? '🔓 Unlock' : '🔒 Lock';
      }

      if (searchInput) {
        searchInput.disabled = this.isLocked;
      }

      if (newPasswordBtn) {
        newPasswordBtn.disabled = this.isLocked;
      }

      if (changePasswordBtn) {
        changePasswordBtn.disabled = this.isLocked;
      }

      this._updateItemsList();
    }

    _updateItemsList() {
      const container = this.window.element.querySelector('#kc-items-container');
      if (container) {
        container.innerHTML = this.isLocked ? this._renderLockedView() : this._renderItemsList();
        this._attachItemListeners();
      }
    }

    _showItemDetails(item) {
      const content = `<div style="padding: 20px;">
        <h3 style="font-family: var(--mac9-charcoal); margin: 0 0 16px 0;">${item.type === 'password' ? '🔑' : '📜'} ${this._escapeHtml(item.name)}</h3>
        <div class="mac9-group">
          <div class="mac9-group-title">Item Information</div>
          <p style="margin: 6px 0;"><strong>Kind:</strong> ${this._escapeHtml(item.kind)}</p>
          <p style="margin: 6px 0;"><strong>Account:</strong> ${this._escapeHtml(item.account)}</p>
          <p style="margin: 6px 0;"><strong>Created:</strong> ${this._escapeHtml(item.created)}</p>
          ${item.type === 'password' ? `
          <p style="margin: 12px 0 6px 0;"><strong>Password:</strong></p>
          <div style="display: flex; gap: 8px; align-items: center;">
            <input type="password" class="mac9-input" style="flex: 1;" value="••••••••" readonly id="kc-password-field">
            <button class="mac9-button" id="kc-reveal-password">Show</button>
          </div>
          ` : ''}
        </div>
        <div style="margin-top: 20px; text-align: right; display: flex; gap: 8px; justify-content: flex-end;">
          <button class="mac9-button" onclick="this.closest('.os-window').querySelector('.window-btn-close').click()">Cancel</button>
          <button class="mac9-button default" onclick="this.closest('.os-window').querySelector('.window-btn-close').click()">Save</button>
        </div>
      </div>`;

      const detailWindow = this.desktop.createAppWindow({
        id: 'kc-item-detail-' + Date.now(),
        title: item.name,
        content: content,
        width: 420,
        height: item.type === 'password' ? 340 : 280,
        resizable: false
      });

      // Add reveal password functionality
      if (item.type === 'password' && detailWindow && detailWindow.element) {
        const revealBtn = detailWindow.element.querySelector('#kc-reveal-password');
        const passwordField = detailWindow.element.querySelector('#kc-password-field');

        if (revealBtn && passwordField) {
          revealBtn.addEventListener('click', () => {
            if (passwordField.type === 'password') {
              passwordField.type = 'text';
              passwordField.value = 'examplePassword123';
              revealBtn.textContent = 'Hide';
            } else {
              passwordField.type = 'password';
              passwordField.value = '••••••••';
              revealBtn.textContent = 'Show';
            }
          });
        }
      }
    }

    _showNewPasswordDialog() {
      const content = `<div style="padding: 20px;">
        <h3 style="font-family: var(--mac9-charcoal); margin: 0 0 16px 0;">New Password Item</h3>
        <div class="mac9-group">
          <div class="mac9-group-title">Password Information</div>
          <div style="margin: 8px 0;">
            <label style="display: block; margin-bottom: 4px;">Name:</label>
            <input type="text" class="mac9-input" style="width: 100%;" placeholder="Enter item name">
          </div>
          <div style="margin: 8px 0;">
            <label style="display: block; margin-bottom: 4px;">Account:</label>
            <input type="text" class="mac9-input" style="width: 100%;" placeholder="Username or account">
          </div>
          <div style="margin: 8px 0;">
            <label style="display: block; margin-bottom: 4px;">Password:</label>
            <input type="password" class="mac9-input" style="width: 100%;" placeholder="Enter password">
          </div>
        </div>
        <div style="margin-top: 20px; text-align: right; display: flex; gap: 8px; justify-content: flex-end;">
          <button class="mac9-button" onclick="this.closest('.os-window').querySelector('.window-btn-close').click()">Cancel</button>
          <button class="mac9-button default" onclick="alert('Password item created (demo)'); this.closest('.os-window').querySelector('.window-btn-close').click()">Add</button>
        </div>
      </div>`;

      this.desktop.createAppWindow({
        id: 'kc-new-password-dialog',
        title: 'New Password Item',
        content: content,
        width: 420,
        height: 320,
        resizable: false
      });
    }

    _showSettings() {
      this.desktop._showAlert('Keychain settings (demo)');
    }
  }

  global.MacOS9Keychain = MacOS9Keychain;

})(typeof window !== 'undefined' ? window : global);
