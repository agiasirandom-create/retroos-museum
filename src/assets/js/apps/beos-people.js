/**
 * BeOS People
 * Contact manager with BeOS attributes system
 * Showcases the powerful file attributes and query capabilities
 */

(function(global) {
  'use strict';

  /**
   * BeOS People Application
   */
  class BeOSPeople {
    constructor(desktop, personData = null) {
      this.desktop = desktop;
      this.personData = personData || this._getEmptyPerson();
      this.window = null;
      this.windowId = null;
    }

    /**
     * Launch People
     */
    launch() {
      const content = this._createContent();

      this.windowId = `people-${Date.now()}`;
      this.window = this.desktop.windowSystem.createWindow({
        id: this.windowId,
        title: this.personData.name || 'New Person',
        width: 500,
        height: 450,
        content: content,
        resizable: true,
        tabPosition: 'top',
        menuItems: [
          { label: 'File', onClick: () => {} },
          { label: 'Edit', onClick: () => {} },
          { label: 'Attributes', onClick: () => {} }
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
    }

    /**
     * Create People content
     * @private
     */
    _createContent() {
      return `
        <div class="people-window" style="display: flex; flex-direction: column; height: 100%; background: #DCDCDC;">
          <!-- Tabs -->
          <div class="people-tabs" style="display: flex; background: linear-gradient(180deg, #FFDD44 0%, #FFCC00 50%, #CC9900 100%); padding: 4px; border-bottom: 1px solid #000;">
            <button class="people-tab active" data-tab="contact" style="padding: 4px 12px; background: #EEEEEE; border: 1px solid #000; margin-right: 2px; font-size: 10px; cursor: pointer;">Contact</button>
            <button class="people-tab" data-tab="work" style="padding: 4px 12px; background: #D4D4D4; border: 1px solid #000; margin-right: 2px; font-size: 10px; cursor: pointer;">Work</button>
            <button class="people-tab" data-tab="personal" style="padding: 4px 12px; background: #D4D4D4; border: 1px solid #000; font-size: 10px; cursor: pointer;">Personal</button>
          </div>

          <!-- Content Area -->
          <div style="flex: 1; overflow: auto; padding: 12px;">
            <!-- Contact Tab -->
            <div class="tab-content" data-content="contact" style="display: block;">
              <div style="display: flex; gap: 12px;">
                <!-- Photo Area -->
                <div style="width: 120px; flex-shrink: 0;">
                  <div style="width: 100px; height: 120px; background: #FFF; border: 2px inset #808080; display: flex; align-items: center; justify-content: center; font-size: 48px;">
                    👤
                  </div>
                  <button class="beos-button" style="width: 100%; margin-top: 8px; font-size: 9px;">Add Photo</button>
                </div>

                <!-- Form Fields -->
                <div style="flex: 1;">
                  <div style="margin-bottom: 10px;">
                    <label style="display: block; font-size: 10px; margin-bottom: 2px; font-weight: bold;">Name:</label>
                    <input type="text" class="beos-input" id="person-name" value="${this.personData.name}" style="width: 100%;">
                  </div>

                  <div style="margin-bottom: 10px;">
                    <label style="display: block; font-size: 10px; margin-bottom: 2px; font-weight: bold;">Email:</label>
                    <input type="email" class="beos-input" id="person-email" value="${this.personData.email}" style="width: 100%;">
                  </div>

                  <div style="margin-bottom: 10px;">
                    <label style="display: block; font-size: 10px; margin-bottom: 2px; font-weight: bold;">Phone:</label>
                    <input type="tel" class="beos-input" id="person-phone" value="${this.personData.phone}" style="width: 100%;">
                  </div>

                  <div style="margin-bottom: 10px;">
                    <label style="display: block; font-size: 10px; margin-bottom: 2px; font-weight: bold;">Address:</label>
                    <textarea class="beos-input" id="person-address" style="width: 100%; height: 60px; resize: vertical;">${this.personData.address}</textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- Work Tab -->
            <div class="tab-content" data-content="work" style="display: none;">
              <div style="margin-bottom: 10px;">
                <label style="display: block; font-size: 10px; margin-bottom: 2px; font-weight: bold;">Company:</label>
                <input type="text" class="beos-input" id="person-company" value="${this.personData.company}" style="width: 100%;">
              </div>

              <div style="margin-bottom: 10px;">
                <label style="display: block; font-size: 10px; margin-bottom: 2px; font-weight: bold;">Title:</label>
                <input type="text" class="beos-input" id="person-title" value="${this.personData.title}" style="width: 100%;">
              </div>

              <div style="margin-bottom: 10px;">
                <label style="display: block; font-size: 10px; margin-bottom: 2px; font-weight: bold;">Work Phone:</label>
                <input type="tel" class="beos-input" id="person-work-phone" value="${this.personData.workPhone}" style="width: 100%;">
              </div>

              <div style="margin-bottom: 10px;">
                <label style="display: block; font-size: 10px; margin-bottom: 2px; font-weight: bold;">Work Email:</label>
                <input type="email" class="beos-input" id="person-work-email" value="${this.personData.workEmail}" style="width: 100%;">
              </div>
            </div>

            <!-- Personal Tab -->
            <div class="tab-content" data-content="personal" style="display: none;">
              <div style="margin-bottom: 10px;">
                <label style="display: block; font-size: 10px; margin-bottom: 2px; font-weight: bold;">Birthday:</label>
                <input type="date" class="beos-input" id="person-birthday" value="${this.personData.birthday}" style="width: 100%;">
              </div>

              <div style="margin-bottom: 10px;">
                <label style="display: block; font-size: 10px; margin-bottom: 2px; font-weight: bold;">URL:</label>
                <input type="url" class="beos-input" id="person-url" value="${this.personData.url}" style="width: 100%;">
              </div>

              <div style="margin-bottom: 10px;">
                <label style="display: block; font-size: 10px; margin-bottom: 2px; font-weight: bold;">Notes:</label>
                <textarea class="beos-input" id="person-notes" style="width: 100%; height: 120px; resize: vertical;">${this.personData.notes}</textarea>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div style="padding: 8px; background: #DCDCDC; border-top: 1px solid #808080; display: flex; justify-content: flex-end; gap: 8px;">
            <button class="beos-button" id="person-save">Save</button>
            <button class="beos-button" id="person-cancel">Cancel</button>
          </div>
        </div>
      `;
    }

    /**
     * Setup event handlers
     * @private
     */
    _setupEventHandlers() {
      // Tab switching
      const tabs = this.window.querySelectorAll('.people-tab');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const tabName = tab.dataset.tab;
          this._switchTab(tabName);
        });
      });

      // Save button
      const saveBtn = this.window.querySelector('#person-save');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => this._savePerson());
      }

      // Cancel button
      const cancelBtn = this.window.querySelector('#person-cancel');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          this.window.querySelector('.beos-tab-btn').click();
        });
      }
    }

    /**
     * Switch tab
     * @private
     */
    _switchTab(tabName) {
      // Update tab buttons
      this.window.querySelectorAll('.people-tab').forEach(tab => {
        if (tab.dataset.tab === tabName) {
          tab.classList.add('active');
          tab.style.background = '#EEEEEE';
        } else {
          tab.classList.remove('active');
          tab.style.background = '#D4D4D4';
        }
      });

      // Update content
      this.window.querySelectorAll('.tab-content').forEach(content => {
        if (content.dataset.content === tabName) {
          content.style.display = 'block';
        } else {
          content.style.display = 'none';
        }
      });
    }

    /**
     * Save person
     * @private
     */
    _savePerson() {
      // Gather data from form
      this.personData.name = this.window.querySelector('#person-name').value;
      this.personData.email = this.window.querySelector('#person-email').value;
      this.personData.phone = this.window.querySelector('#person-phone').value;
      this.personData.address = this.window.querySelector('#person-address').value;
      this.personData.company = this.window.querySelector('#person-company').value;
      this.personData.title = this.window.querySelector('#person-title').value;
      this.personData.workPhone = this.window.querySelector('#person-work-phone').value;
      this.personData.workEmail = this.window.querySelector('#person-work-email').value;
      this.personData.birthday = this.window.querySelector('#person-birthday').value;
      this.personData.url = this.window.querySelector('#person-url').value;
      this.personData.notes = this.window.querySelector('#person-notes').value;

      // Update window title
      const titleEl = this.window.querySelector('.beos-window-tab-title');
      if (titleEl && this.personData.name) {
        titleEl.textContent = this.personData.name;
      }

      console.log('Person saved with attributes:', this.personData);

      // In real BeOS, this would save as a file with extended attributes
      alert('Contact saved! (In BeOS, this would be saved as a file with queryable attributes)');
    }

    /**
     * Get empty person data
     * @private
     */
    _getEmptyPerson() {
      return {
        name: '',
        email: '',
        phone: '',
        address: '',
        company: '',
        title: '',
        workPhone: '',
        workEmail: '',
        birthday: '',
        url: '',
        notes: ''
      };
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
  global.BeOSPeople = BeOSPeople;

})(window);
