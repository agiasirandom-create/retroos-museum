/**
 * BeOS Mail
 * Email client showcasing BeOS's attribute-based file system
 * Features: query-by-attribute, minimalist design, fast searching
 */

(function(global) {
  'use strict';

  /**
   * BeOS Mail Application
   */
  class BeOSMail {
    constructor(desktop) {
      this.desktop = desktop;
      this.window = null;
      this.windowId = null;
      this.currentFolder = 'inbox';
      this.selectedEmail = null;
      this.folders = ['inbox', 'sent', 'drafts', 'trash'];
      this.emails = this._getMockEmails();
    }

    /**
     * Launch Mail
     */
    launch() {
      const content = this._createContent();

      this.windowId = `mail-${Date.now()}`;
      this.window = this.desktop.windowSystem.createWindow({
        id: this.windowId,
        title: 'Mail',
        width: 700,
        height: 500,
        content: content,
        resizable: true,
        tabPosition: 'top',
        menuItems: [
          { label: 'File', onClick: () => {} },
          { label: 'Edit', onClick: () => {} },
          { label: 'Mailbox', onClick: () => {} },
          { label: 'Queries', onClick: () => {} }
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

      // Initial render
      this._renderEmails();
    }

    /**
     * Create Mail content
     * @private
     */
    _createContent() {
      return `
        <div class="mail-window" style="display: flex; height: 100%;">
          <!-- Sidebar -->
          <div style="width: 150px; background: #DCDCDC; border-right: 1px solid #808080; display: flex; flex-direction: column;">
            <!-- Folders -->
            <div style="padding: 8px; border-bottom: 1px solid #808080;">
              <div style="font-size: 10px; font-weight: bold; margin-bottom: 6px;">FOLDERS</div>
              <div id="folder-list">
                ${this.folders.map(folder => `
                  <div class="mail-folder ${folder === this.currentFolder ? 'active' : ''}"
                       data-folder="${folder}"
                       style="padding: 4px 8px; cursor: pointer; font-size: 10px; margin-bottom: 2px; ${folder === this.currentFolder ? 'background: #4682B4; color: #FFF;' : ''}"
                       onmouseenter="if (!this.classList.contains('active')) this.style.background='#E8E8E8'"
                       onmouseleave="if (!this.classList.contains('active')) this.style.background=''">
                    ${this._getFolderIcon(folder)} ${this._capitalize(folder)}
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Query Button -->
            <div style="padding: 8px;">
              <button class="beos-button" data-action="new-query" style="width: 100%; font-size: 9px; padding: 4px;">
                🔍 New Query
              </button>
              <button class="beos-button default" data-action="compose" style="width: 100%; font-size: 9px; padding: 4px; margin-top: 4px;">
                ✉️ Compose
              </button>
            </div>
          </div>

          <!-- Main Content -->
          <div style="flex: 1; display: flex; flex-direction: column;">
            <!-- Toolbar -->
            <div class="beos-toolbar">
              <button class="beos-toolbar-button" data-action="reply" title="Reply">↩</button>
              <button class="beos-toolbar-button" data-action="forward" title="Forward">⇒</button>
              <div class="beos-toolbar-separator"></div>
              <button class="beos-toolbar-button" data-action="delete" title="Delete">🗑️</button>
              <div class="beos-toolbar-separator"></div>
              <input type="text" class="beos-input" id="mail-search" placeholder="Search mail..." style="flex: 1; margin: 0 4px;">
              <button class="beos-button" data-action="search" style="height: 22px; padding: 2px 12px; font-size: 10px;">Search</button>
            </div>

            <!-- Email List -->
            <div id="email-list" style="flex: 1; overflow: auto; background: #FFF;">
              <!-- Emails will be rendered here -->
            </div>

            <!-- Status Bar -->
            <div class="beos-statusbar">
              <span id="mail-status">0 messages</span>
              <span style="margin-left: auto;" id="mail-folder"></span>
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
      // Folder selection
      const folders = this.window.querySelectorAll('.mail-folder');
      folders.forEach(folder => {
        folder.addEventListener('click', () => {
          this._selectFolder(folder.dataset.folder);
        });
      });

      // Toolbar actions
      this.window.addEventListener('click', (e) => {
        const button = e.target.closest('[data-action]');
        if (!button) return;

        const action = button.dataset.action;
        switch (action) {
          case 'compose':
            this._composeEmail();
            break;
          case 'reply':
            this._replyEmail();
            break;
          case 'forward':
            this._forwardEmail();
            break;
          case 'delete':
            this._deleteEmail();
            break;
          case 'new-query':
            this._newQuery();
            break;
          case 'search':
            this._searchEmails();
            break;
        }
      });

      // Search on enter
      const searchInput = this.window.querySelector('#mail-search');
      if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            this._searchEmails();
          }
        });
      }
    }

    /**
     * Select folder
     * @private
     */
    _selectFolder(folder) {
      this.currentFolder = folder;

      // Update folder list
      const folders = this.window.querySelectorAll('.mail-folder');
      folders.forEach(f => {
        if (f.dataset.folder === folder) {
          f.classList.add('active');
          f.style.background = '#4682B4';
          f.style.color = '#FFF';
        } else {
          f.classList.remove('active');
          f.style.background = '';
          f.style.color = '';
        }
      });

      this._renderEmails();
    }

    /**
     * Render emails
     * @private
     */
    _renderEmails() {
      const emailList = this.window.querySelector('#email-list');
      if (!emailList) return;

      const folderEmails = this.emails.filter(email => email.folder === this.currentFolder);

      emailList.innerHTML = `
        <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
          <thead>
            <tr style="background: #DCDCDC; border-bottom: 1px solid #808080;">
              <th style="text-align: left; padding: 6px; width: 30px;"></th>
              <th style="text-align: left; padding: 6px; width: 200px;">From</th>
              <th style="text-align: left; padding: 6px;">Subject</th>
              <th style="text-align: right; padding: 6px; width: 120px;">Date</th>
            </tr>
          </thead>
          <tbody>
            ${folderEmails.map(email => `
              <tr class="email-row" data-email-id="${email.id}"
                  style="cursor: pointer; border-bottom: 1px solid #EEEEEE; ${email.read ? '' : 'font-weight: bold;'}"
                  onmouseenter="this.style.background='#E8E8E8'"
                  onmouseleave="this.style.background=''">
                <td style="padding: 6px; text-align: center;">${email.read ? '📭' : '📬'}</td>
                <td style="padding: 6px;">${email.from}</td>
                <td style="padding: 6px;">${email.subject}</td>
                <td style="padding: 6px; text-align: right;">${email.date}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;

      // Add click handlers
      emailList.querySelectorAll('.email-row').forEach(row => {
        row.addEventListener('dblclick', () => {
          const emailId = parseInt(row.dataset.emailId);
          this._openEmail(emailId);
        });
      });

      // Update status
      const status = this.window.querySelector('#mail-status');
      if (status) {
        const unread = folderEmails.filter(e => !e.read).length;
        status.textContent = `${folderEmails.length} message${folderEmails.length !== 1 ? 's' : ''}${unread > 0 ? `, ${unread} unread` : ''}`;
      }

      const folderStatus = this.window.querySelector('#mail-folder');
      if (folderStatus) {
        folderStatus.textContent = this._capitalize(this.currentFolder);
      }
    }

    /**
     * Open email
     * @private
     */
    _openEmail(emailId) {
      const email = this.emails.find(e => e.id === emailId);
      if (!email) return;

      // Mark as read
      email.read = true;
      this._renderEmails();

      // Create email viewer window
      const content = `
        <div style="padding: 12px; height: 100%; overflow: auto;">
          <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 2px solid #DCDCDC;">
            <div style="font-size: 14px; font-weight: bold; margin-bottom: 8px;">${email.subject}</div>
            <div style="font-size: 10px; color: #666; margin-bottom: 4px;"><strong>From:</strong> ${email.from}</div>
            <div style="font-size: 10px; color: #666; margin-bottom: 4px;"><strong>Date:</strong> ${email.date}</div>
            ${email.to ? `<div style="font-size: 10px; color: #666;"><strong>To:</strong> ${email.to}</div>` : ''}
          </div>
          <div style="font-size: 11px; line-height: 1.6; white-space: pre-wrap;">${email.body}</div>
        </div>
      `;

      const viewerId = `email-viewer-${Date.now()}`;
      const viewerWindow = this.desktop.windowSystem.createWindow({
        id: viewerId,
        title: email.subject,
        width: 500,
        height: 400,
        content: content,
        resizable: true,
        tabPosition: 'top'
      });

      const container = document.getElementById('windows-container');
      if (container) {
        container.appendChild(viewerWindow);
      }
    }

    /**
     * Compose email
     * @private
     */
    _composeEmail() {
      const content = `
        <div style="display: flex; flex-direction: column; height: 100%; padding: 8px;">
          <div style="margin-bottom: 8px;">
            <label style="display: inline-block; width: 60px; font-size: 10px; font-weight: bold;">To:</label>
            <input type="text" class="beos-input" style="width: calc(100% - 70px);">
          </div>
          <div style="margin-bottom: 8px;">
            <label style="display: inline-block; width: 60px; font-size: 10px; font-weight: bold;">Subject:</label>
            <input type="text" class="beos-input" style="width: calc(100% - 70px);">
          </div>
          <textarea class="beos-input" style="flex: 1; resize: none; margin-bottom: 8px;"></textarea>
          <div style="display: flex; justify-content: flex-end; gap: 8px;">
            <button class="beos-button default">Send</button>
            <button class="beos-button">Cancel</button>
          </div>
        </div>
      `;

      const composeId = `mail-compose-${Date.now()}`;
      const composeWindow = this.desktop.windowSystem.createWindow({
        id: composeId,
        title: 'New Message',
        width: 500,
        height: 400,
        content: content,
        resizable: true,
        tabPosition: 'top'
      });

      const container = document.getElementById('windows-container');
      if (container) {
        container.appendChild(composeWindow);
      }
    }

    /**
     * Reply email
     * @private
     */
    _replyEmail() {
      alert('Reply feature - would open compose window with quoted text');
    }

    /**
     * Forward email
     * @private
     */
    _forwardEmail() {
      alert('Forward feature - would open compose window with forwarded message');
    }

    /**
     * Delete email
     * @private
     */
    _deleteEmail() {
      alert('Delete feature - would move selected email to trash');
    }

    /**
     * New query
     * @private
     */
    _newQuery() {
      alert('New Query - BeOS allows searching email by any attribute (sender, date, subject, etc.)');
    }

    /**
     * Search emails
     * @private
     */
    _searchEmails() {
      const searchInput = this.window.querySelector('#mail-search');
      if (searchInput && searchInput.value) {
        alert(`Searching for: "${searchInput.value}"\n\nBeOS would use live queries to find matching emails instantly.`);
      }
    }

    /**
     * Get folder icon
     * @private
     */
    _getFolderIcon(folder) {
      const icons = {
        inbox: '📥',
        sent: '📤',
        drafts: '📝',
        trash: '🗑️'
      };
      return icons[folder] || '📁';
    }

    /**
     * Capitalize string
     * @private
     */
    _capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Get mock emails
     * @private
     */
    _getMockEmails() {
      return [
        {
          id: 1,
          folder: 'inbox',
          from: 'admin@be.com',
          to: 'user@example.com',
          subject: 'Welcome to BeOS R5',
          date: 'Today 10:30 AM',
          read: false,
          body: 'Welcome to BeOS R5!\n\nThank you for choosing BeOS. This advanced operating system features pervasive multithreading, a powerful media kit, and a database-like file system.\n\nEnjoy your computing experience!\n\nThe Be Team'
        },
        {
          id: 2,
          folder: 'inbox',
          from: 'updates@bebits.com',
          subject: 'New software available on BeBits',
          date: 'Yesterday 3:45 PM',
          read: true,
          body: 'Check out the latest applications and utilities for BeOS on BeBits!'
        },
        {
          id: 3,
          folder: 'inbox',
          from: 'support@be.com',
          subject: 'BeOS Tips and Tricks',
          date: 'Mar 15 2:20 PM',
          read: false,
          body: 'Did you know you can query files by any attribute? Try right-clicking on the desktop and selecting "Find..."'
        },
        {
          id: 4,
          folder: 'sent',
          from: 'Me',
          to: 'friend@example.com',
          subject: 'Check out BeOS!',
          date: 'Mar 14 5:00 PM',
          read: true,
          body: 'You have to try BeOS - it is incredibly fast and responsive!'
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
  global.BeOSMail = BeOSMail;

})(window);
