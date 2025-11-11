/**
 * Ubuntu Evolution Email Client
 * GNOME email, calendar and contact manager
 */

(function(global) {
  'use strict';

  class UbuntuEvolution {
    constructor(windowManager) {
      this.windowManager = windowManager;
      this.windowInstance = null;
      this.currentFolder = 'Inbox';
    }

    open() {
      this.windowInstance = this.windowManager.createWindow({
        id: `evolution-${Date.now()}`,
        title: 'Inbox - Evolution',
        width: 900,
        height: 600,
        x: 60 + Math.random() * 60,
        y: 50 + Math.random() * 50,
        resizable: true,
        content: this.renderContent()
      });

      this.attachEventListeners();
    }

    renderContent() {
      return `
        <div class="evolution-container">
          <!-- Menu Bar -->
          <div class="evolution-menubar">
            <button class="evolution-menu-item">File</button>
            <button class="evolution-menu-item">Edit</button>
            <button class="evolution-menu-item">View</button>
            <button class="evolution-menu-item">Folder</button>
            <button class="evolution-menu-item">Message</button>
            <button class="evolution-menu-item">Tools</button>
            <button class="evolution-menu-item">Help</button>
          </div>

          <!-- Toolbar -->
          <div class="evolution-toolbar">
            <button class="evolution-btn" data-action="new">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2" y="4" width="12" height="8" fill="none" stroke="currentColor" stroke-width="1.5"/>
                <path d="M2 4l6 4 6-4"/>
              </svg>
              New
            </button>
            <div class="evolution-separator"></div>
            <button class="evolution-btn" data-action="reply">Reply</button>
            <button class="evolution-btn" data-action="reply-all">Reply All</button>
            <button class="evolution-btn" data-action="forward">Forward</button>
            <div class="evolution-separator"></div>
            <button class="evolution-btn evolution-btn-danger" data-action="delete">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <path d="M5 2h4v1H5V2zM3 4h8l-1 8H4L3 4z"/>
              </svg>
              Delete
            </button>
          </div>

          <!-- Main Content Area -->
          <div class="evolution-main">
            <!-- Folder Sidebar -->
            <div class="evolution-sidebar">
              <div class="evolution-folder-tree">
                <div class="evolution-folder-section">
                  <div class="evolution-folder-header">On This Computer</div>
                  <div class="evolution-folder ${this.currentFolder === 'Inbox' ? 'active' : ''}" data-folder="Inbox">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                      <rect x="1" y="3" width="12" height="8" fill="none" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M1 3l6 4 6-4"/>
                    </svg>
                    <span>Inbox (3)</span>
                  </div>
                  <div class="evolution-folder" data-folder="Sent">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                      <path d="M2 2l10 5-10 5V8l6-1-6-1V2z"/>
                    </svg>
                    <span>Sent</span>
                  </div>
                  <div class="evolution-folder" data-folder="Drafts">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                      <rect x="2" y="2" width="10" height="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
                      <rect x="4" y="5" width="6" height="1" fill="currentColor"/>
                      <rect x="4" y="7" width="6" height="1" fill="currentColor"/>
                    </svg>
                    <span>Drafts</span>
                  </div>
                  <div class="evolution-folder" data-folder="Trash">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                      <path d="M5 2h4v1H5V2zM3 4h8l-1 8H4L3 4z"/>
                    </svg>
                    <span>Trash</span>
                  </div>
                  <div class="evolution-folder" data-folder="Junk">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                      <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M5 5l4 4M9 5l-4 4"/>
                    </svg>
                    <span>Junk</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Email List and Preview -->
            <div class="evolution-content">
              <!-- Email List -->
              <div class="evolution-email-list">
                <div class="evolution-email-header">
                  <div class="evolution-col-from">From</div>
                  <div class="evolution-col-subject">Subject</div>
                  <div class="evolution-col-date">Date</div>
                </div>
                <div class="evolution-emails">
                  <div class="evolution-email unread">
                    <div class="evolution-col-from">
                      <strong>Ubuntu Team</strong>
                    </div>
                    <div class="evolution-col-subject">
                      <strong>Welcome to Ubuntu 4.10 Warty Warthog</strong>
                    </div>
                    <div class="evolution-col-date">Today 10:30 AM</div>
                  </div>
                  <div class="evolution-email unread">
                    <div class="evolution-col-from">
                      <strong>GNOME Release Team</strong>
                    </div>
                    <div class="evolution-col-subject">
                      <strong>GNOME 2.8 Available Now</strong>
                    </div>
                    <div class="evolution-col-date">Today 9:15 AM</div>
                  </div>
                  <div class="evolution-email unread">
                    <div class="evolution-col-from">
                      <strong>Canonical Ltd.</strong>
                    </div>
                    <div class="evolution-col-subject">
                      <strong>Linux for Human Beings</strong>
                    </div>
                    <div class="evolution-col-date">Yesterday 4:20 PM</div>
                  </div>
                  <div class="evolution-email">
                    <div class="evolution-col-from">System Administrator</div>
                    <div class="evolution-col-subject">Package updates available</div>
                    <div class="evolution-col-date">Oct 19</div>
                  </div>
                  <div class="evolution-email">
                    <div class="evolution-col-from">Desktop Team</div>
                    <div class="evolution-col-subject">Human Theme Feedback</div>
                    <div class="evolution-col-date">Oct 18</div>
                  </div>
                </div>
              </div>

              <!-- Email Preview Pane -->
              <div class="evolution-preview">
                <div class="evolution-preview-header">
                  <h3>Welcome to Ubuntu 4.10 Warty Warthog</h3>
                  <div class="evolution-preview-meta">
                    <strong>From:</strong> Ubuntu Team &lt;team@ubuntu.com&gt;<br>
                    <strong>To:</strong> user@localhost<br>
                    <strong>Date:</strong> Wed, 20 Oct 2004 10:30:45 +0000
                  </div>
                </div>
                <div class="evolution-preview-body">
                  <p>Dear Ubuntu User,</p>

                  <p>Welcome to <strong>Ubuntu 4.10 "Warty Warthog"</strong> - the first release of Ubuntu,
                  a new Linux distribution that brings together the best of Debian with a focus on
                  ease of use, regular releases, and a vibrant community.</p>

                  <p><strong>What's included:</strong></p>
                  <ul>
                    <li>GNOME 2.8 desktop environment with the new Human theme</li>
                    <li>Firefox 0.9 web browser</li>
                    <li>Evolution email and calendar</li>
                    <li>OpenOffice.org 1.1.2 office suite</li>
                    <li>Thousands of free software packages</li>
                  </ul>

                  <p><strong>Ubuntu</strong> is an ancient African word meaning <em>"humanity to others"</em>.
                  Ubuntu also means <em>"I am what I am because of who we all are"</em>.</p>

                  <p>We hope you enjoy using Ubuntu!</p>

                  <p>Best regards,<br>
                  The Ubuntu Team</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Status Bar -->
          <div class="evolution-statusbar">
            <span>3 unread, 5 total in Inbox</span>
          </div>
        </div>

        <style>
          .evolution-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: white;
            font-family: 'Ubuntu Sans', sans-serif;
          }

          .evolution-menubar {
            display: flex;
            padding: 2px 4px;
            background: #E9E7E3;
            border-bottom: 1px solid #9B9388;
          }

          .evolution-menu-item {
            padding: 4px 12px;
            background: transparent;
            border: none;
            border-radius: 2px;
            font-family: 'Ubuntu Sans', sans-serif;
            font-size: 10pt;
            cursor: pointer;
            transition: background-color 0.1s ease;
          }

          .evolution-menu-item:hover {
            background: rgba(240, 119, 70, 0.15);
          }

          .evolution-toolbar {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 6px;
            background: #E9E7E3;
            border-bottom: 1px solid #9B9388;
          }

          .evolution-btn {
            height: 28px;
            padding: 0 12px;
            display: flex;
            align-items: center;
            gap: 4px;
            background: white;
            border: 1px solid #9B9388;
            border-radius: 2px;
            cursor: pointer;
            color: #2C2C2C;
            font-family: 'Ubuntu Sans', sans-serif;
            font-size: 10pt;
            transition: all 0.1s ease;
          }

          .evolution-btn:hover {
            background: #F5F5F5;
            border-color: #F07746;
          }

          .evolution-btn-danger:hover {
            background: #ffebee;
            color: #c62828;
          }

          .evolution-separator {
            width: 1px;
            height: 24px;
            background: #9B9388;
            margin: 0 4px;
          }

          .evolution-main {
            display: flex;
            flex: 1;
            overflow: hidden;
          }

          .evolution-sidebar {
            width: 200px;
            background: #F5F5F5;
            border-right: 1px solid #CCCCCC;
            overflow-y: auto;
          }

          .evolution-folder-tree {
            padding: 8px 4px;
          }

          .evolution-folder-header {
            padding: 6px 8px;
            font-weight: 600;
            font-size: 9pt;
            color: #666;
            text-transform: uppercase;
          }

          .evolution-folder {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            margin: 2px 4px;
            border-radius: 2px;
            cursor: pointer;
            font-size: 10pt;
            transition: background-color 0.1s ease;
          }

          .evolution-folder:hover {
            background: rgba(240, 119, 70, 0.1);
          }

          .evolution-folder.active {
            background: #F07746;
            color: white;
            font-weight: 500;
          }

          .evolution-folder svg {
            flex-shrink: 0;
          }

          .evolution-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .evolution-email-list {
            height: 250px;
            border-bottom: 1px solid #CCCCCC;
            overflow-y: auto;
          }

          .evolution-email-header {
            display: flex;
            padding: 6px 8px;
            background: #E9E7E3;
            border-bottom: 1px solid #9B9388;
            font-weight: 600;
            font-size: 9pt;
          }

          .evolution-col-from {
            width: 200px;
            flex-shrink: 0;
          }

          .evolution-col-subject {
            flex: 1;
          }

          .evolution-col-date {
            width: 140px;
            flex-shrink: 0;
          }

          .evolution-emails {
            background: white;
          }

          .evolution-email {
            display: flex;
            padding: 8px;
            border-bottom: 1px solid #EEEEEE;
            cursor: pointer;
            transition: background-color 0.1s ease;
          }

          .evolution-email:hover {
            background: #F9F9F9;
          }

          .evolution-email.unread {
            background: #FFF8F0;
          }

          .evolution-email.unread:hover {
            background: #FFF0E0;
          }

          .evolution-preview {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            background: white;
          }

          .evolution-preview-header h3 {
            margin: 0 0 12px 0;
            color: #2C2C2C;
            font-size: 13pt;
          }

          .evolution-preview-meta {
            padding: 12px;
            background: #F9F9F9;
            border: 1px solid #E0E0E0;
            border-radius: 2px;
            margin-bottom: 16px;
            font-size: 9pt;
            line-height: 1.6;
          }

          .evolution-preview-body {
            line-height: 1.6;
          }

          .evolution-preview-body p {
            margin: 0 0 12px 0;
          }

          .evolution-preview-body ul {
            margin: 0 0 12px 24px;
          }

          .evolution-preview-body li {
            margin-bottom: 6px;
          }

          .evolution-statusbar {
            padding: 4px 12px;
            background: #E9E7E3;
            border-top: 1px solid #9B9388;
            font-size: 9pt;
            color: #666;
          }
        </style>
      `;
    }

    attachEventListeners() {
      const content = this.windowInstance.contentArea;

      content.addEventListener('click', (e) => {
        const folder = e.target.closest('.evolution-folder');
        if (folder) {
          const folderName = folder.getAttribute('data-folder');
          this.switchFolder(folderName);
        }
      });
    }

    switchFolder(folderName) {
      this.currentFolder = folderName;
      this.windowInstance.setTitle(`${folderName} - Evolution`);
      this.windowInstance.setContent(this.renderContent());
      this.attachEventListeners();
    }
  }

  global.UbuntuEvolution = UbuntuEvolution;

})(typeof window !== 'undefined' ? window : global);
