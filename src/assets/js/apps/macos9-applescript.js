/**
 * Mac OS 9 AppleScript Editor
 * Script editing and execution tool
 */

(function(global) {
  'use strict';

  class MacOS9AppleScript {
    constructor(desktop) {
      this.desktop = desktop;
      this.currentTab = 'description';
      this.isRecording = false;
    }

    open() {
      const content = this._buildEditorContent();

      this.window = this.desktop.createAppWindow({
        id: 'applescript-editor',
        title: 'AppleScript Editor',
        content: content,
        width: 640,
        height: 520,
        resizable: true
      });

      this._attachListeners();
    }

    _buildEditorContent() {
      const sampleScript = `-- Sample AppleScript
tell application "Finder"
    activate
    make new Finder window
    set target of Finder window 1 to home
end tell

display dialog "Welcome to AppleScript!" buttons {"OK"} default button 1`;

      return `<div style="height: 100%; display: flex; flex-direction: column;">
        <!-- Toolbar -->
        <div style="padding: 8px; background: linear-gradient(to bottom, #EEEEEE, #DDDDDD); border-bottom: 1px solid #555; display: flex; gap: 8px;">
          <button class="mac9-button" id="as-record" title="Record">⏺ Record</button>
          <button class="mac9-button default" id="as-run" title="Run">▶ Run</button>
          <button class="mac9-button" id="as-stop" disabled title="Stop">⏹ Stop</button>
          <div style="width: 1px; height: 24px; background: #999; margin: 0 4px;"></div>
          <button class="mac9-button" id="as-check-syntax" title="Check Syntax">Check Syntax</button>
          <button class="mac9-button" id="as-save-app" title="Save As Application">Save As Application...</button>
        </div>

        <!-- Script Editor -->
        <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
          <textarea id="as-script-area" class="mac9-textarea" style="font-family: var(--mac9-monaco); font-size: 12px; padding: 12px; line-height: 1.5; resize: none; background: #FAFAFA; border: none; border-bottom: 1px solid #CCC;">${sampleScript}</textarea>
        </div>

        <!-- Tabs Area -->
        <div style="border-top: 1px solid #CCC;">
          <div class="mac9-tabs">
            <div class="mac9-tab active" data-tab="description">Description</div>
            <div class="mac9-tab" data-tab="result">Result</div>
            <div class="mac9-tab" data-tab="event-log">Event Log</div>
          </div>

          <!-- Tab Content -->
          <div id="as-tab-content" style="min-height: 120px; max-height: 200px; overflow: auto; background: #FFF; padding: 12px;">
            ${this._renderDescriptionTab()}
          </div>
        </div>
      </div>`;
    }

    _renderDescriptionTab() {
      return `<div style="font-family: var(--mac9-geneva); font-size: 12px; color: #333;">
        <p style="margin: 0 0 12px 0;"><strong>Script Description:</strong></p>
        <p style="margin: 0; line-height: 1.6;">
          This script demonstrates basic AppleScript functionality. It tells the Finder to open a new window and display the home folder, then shows a welcome dialog.
        </p>
        <p style="margin: 12px 0 0 0; color: #666; font-size: 11px;">
          <em>Edit this text to add your own description.</em>
        </p>
      </div>`;
    }

    _renderResultTab() {
      return `<div style="font-family: var(--mac9-monaco); font-size: 11px; padding: 8px; background: #F5F5F5; border: 1px solid #DDD; border-radius: 3px; color: #006600;">
        <strong>Result:</strong> <span style="color: #000;">"OK"</span>
      </div>`;
    }

    _renderEventLogTab() {
      const timestamp = new Date().toLocaleTimeString();
      return `<div style="font-family: var(--mac9-monaco); font-size: 10px; line-height: 1.6;">
        <div style="color: #666;">(${timestamp}) -- Beginning of script execution --</div>
        <div style="margin-left: 16px; color: #000;">tell application "Finder"</div>
        <div style="margin-left: 32px; color: #0066CC;">activate</div>
        <div style="margin-left: 32px; color: #0066CC;">make new Finder window</div>
        <div style="margin-left: 16px; color: #000;">end tell</div>
        <div style="margin-left: 16px; color: #0066CC;">display dialog "Welcome to AppleScript!"</div>
        <div style="color: #006600; margin-top: 8px;">(*Result: "OK"*)</div>
        <div style="color: #666;">(${timestamp}) -- End of script execution --</div>
      </div>`;
    }

    _attachListeners() {
      if (!this.window || !this.window.element) return;

      const recordBtn = this.window.element.querySelector('#as-record');
      const runBtn = this.window.element.querySelector('#as-run');
      const stopBtn = this.window.element.querySelector('#as-stop');
      const checkSyntaxBtn = this.window.element.querySelector('#as-check-syntax');
      const saveAppBtn = this.window.element.querySelector('#as-save-app');
      const tabs = this.window.element.querySelectorAll('.mac9-tab');

      if (recordBtn) {
        recordBtn.addEventListener('click', () => this._toggleRecording(recordBtn, stopBtn));
      }

      if (runBtn) {
        runBtn.addEventListener('click', () => this._runScript());
      }

      if (stopBtn) {
        stopBtn.addEventListener('click', () => this._stopScript());
      }

      if (checkSyntaxBtn) {
        checkSyntaxBtn.addEventListener('click', () => this._checkSyntax());
      }

      if (saveAppBtn) {
        saveAppBtn.addEventListener('click', () => this._saveAsApplication());
      }

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const tabName = tab.getAttribute('data-tab');
          this._switchTab(tabName);

          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
        });
      });
    }

    _toggleRecording(recordBtn, stopBtn) {
      this.isRecording = !this.isRecording;

      if (this.isRecording) {
        recordBtn.style.color = '#CC0000';
        recordBtn.innerHTML = '⏺ Recording...';
        if (stopBtn) stopBtn.disabled = false;
        this.desktop._showAlert('Recording AppleScript actions... (demo mode)');
      } else {
        recordBtn.style.color = '';
        recordBtn.innerHTML = '⏺ Record';
        if (stopBtn) stopBtn.disabled = true;
      }
    }

    _runScript() {
      const scriptArea = this.window.element.querySelector('#as-script-area');
      if (scriptArea && scriptArea.value.trim()) {
        this.desktop._showAlert('Executing AppleScript... (demo mode)');

        // Switch to result tab
        setTimeout(() => {
          this._switchTab('result');
          const tabs = this.window.element.querySelectorAll('.mac9-tab');
          tabs.forEach(t => t.classList.remove('active'));
          const resultTab = this.window.element.querySelector('.mac9-tab[data-tab="result"]');
          if (resultTab) resultTab.classList.add('active');
        }, 500);
      } else {
        this.desktop._showAlert('Please enter a script to run.');
      }
    }

    _stopScript() {
      this.desktop._showAlert('Script execution stopped (demo)');
    }

    _checkSyntax() {
      const scriptArea = this.window.element.querySelector('#as-script-area');
      if (scriptArea && scriptArea.value.trim()) {
        this.desktop._showAlert('Syntax OK: No errors found.');
      } else {
        this.desktop._showAlert('Please enter a script to check.');
      }
    }

    _saveAsApplication() {
      const content = `<div style="padding: 20px;">
        <h3 style="font-family: var(--mac9-charcoal); margin: 0 0 16px 0;">Save As Application</h3>
        <div class="mac9-group">
          <div class="mac9-group-title">Application Options</div>
          <div style="margin: 12px 0;">
            <label style="display: block; margin-bottom: 4px;">Save as:</label>
            <input type="text" class="mac9-input" style="width: 100%;" value="My Script.app" placeholder="Application name">
          </div>
          <div style="margin: 12px 0;">
            <label style="display: flex; align-items: center; gap: 8px;">
              <input type="checkbox" checked>
              <span>Stay open after run handler</span>
            </label>
          </div>
          <div style="margin: 12px 0;">
            <label style="display: flex; align-items: center; gap: 8px;">
              <input type="checkbox">
              <span>Never show startup screen</span>
            </label>
          </div>
        </div>
        <div style="margin-top: 20px; text-align: right; display: flex; gap: 8px; justify-content: flex-end;">
          <button class="mac9-button" onclick="this.closest('.os-window').querySelector('.window-btn-close').click()">Cancel</button>
          <button class="mac9-button default" onclick="alert('Application saved (demo)'); this.closest('.os-window').querySelector('.window-btn-close').click()">Save</button>
        </div>
      </div>`;

      this.desktop.createAppWindow({
        id: 'as-save-dialog',
        title: 'Save As Application',
        content: content,
        width: 420,
        height: 280,
        resizable: false
      });
    }

    _switchTab(tabName) {
      this.currentTab = tabName;
      const content = this.window.element.querySelector('#as-tab-content');
      if (content) {
        if (tabName === 'description') {
          content.innerHTML = this._renderDescriptionTab();
        } else if (tabName === 'result') {
          content.innerHTML = this._renderResultTab();
        } else if (tabName === 'event-log') {
          content.innerHTML = this._renderEventLogTab();
        }
      }
    }
  }

  global.MacOS9AppleScript = MacOS9AppleScript;

})(typeof window !== 'undefined' ? window : global);
