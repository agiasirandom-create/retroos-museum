/**
 * Windows 95 Run Dialog
 * Classic "Run" dialog for launching programs
 */

(function(global) {
  'use strict';

  class Win95Run {
    constructor(windowManager, desktop) {
      this.windowManager = windowManager;
      this.desktop = desktop;
      this.window = null;
      this.recentCommands = this.loadRecentCommands();
    }

    /**
     * Open Run dialog
     */
    open() {
      const windowContent = this.createContent();

      this.window = this.windowManager.createWindow({
        id: 'run-dialog',
        title: 'Run',
        width: 400,
        height: 200,
        resizable: false,
        maximizable: false,
        content: windowContent
      });

      this.setupEventListeners();

      // Focus the input
      setTimeout(() => {
        const input = this.window.element.querySelector('.run-input');
        if (input) input.focus();
      }, 100);
    }

    /**
     * Create window content
     */
    createContent() {
      return `
        <div class="run-dialog-container" style="
          padding: 16px;
          font-family: 'MS Sans Serif', sans-serif;
          font-size: 11px;
          background: #C0C0C0;
          height: 100%;
          display: flex;
          flex-direction: column;
        ">
          <!-- Icon and Message -->
          <div style="display: flex; gap: 16px; margin-bottom: 16px;">
            <div style="font-size: 32px;">📁</div>
            <p style="margin: 0; line-height: 1.4;">
              Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.
            </p>
          </div>

          <!-- Input Field -->
          <div style="margin-bottom: 16px;">
            <label for="run-input" style="display: block; margin-bottom: 4px;">
              <u>O</u>pen:
            </label>
            <div style="display: flex; gap: 8px;">
              <select class="run-input" style="
                flex: 1;
                padding: 4px;
                border: 2px solid;
                border-color: #808080 #FFF #FFF #808080;
                background: white;
                font-family: 'MS Sans Serif', sans-serif;
                font-size: 11px;
              ">
                <option value=""></option>
                ${this.recentCommands.map(cmd => `<option value="${cmd}">${cmd}</option>`).join('')}
              </select>
            </div>
          </div>

          <!-- Buttons -->
          <div style="
            display: flex;
            gap: 8px;
            justify-content: flex-end;
            margin-top: auto;
          ">
            <button class="run-ok-btn" style="
              min-width: 75px;
              padding: 4px 12px;
              background: #C0C0C0;
              border: 2px solid;
              border-color: #FFF #808080 #808080 #FFF;
              font-family: 'MS Sans Serif', sans-serif;
              font-size: 11px;
              cursor: pointer;
            ">
              OK
            </button>
            <button class="run-cancel-btn" style="
              min-width: 75px;
              padding: 4px 12px;
              background: #C0C0C0;
              border: 2px solid;
              border-color: #FFF #808080 #808080 #FFF;
              font-family: 'MS Sans Serif', sans-serif;
              font-size: 11px;
              cursor: pointer;
            ">
              Cancel
            </button>
            <button class="run-browse-btn" style="
              min-width: 75px;
              padding: 4px 12px;
              background: #C0C0C0;
              border: 2px solid;
              border-color: #FFF #808080 #808080 #FFF;
              font-family: 'MS Sans Serif', sans-serif;
              font-size: 11px;
              cursor: pointer;
            ">
              <u>B</u>rowse...
            </button>
          </div>
        </div>
      `;
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
      const input = this.window.element.querySelector('.run-input');
      const okBtn = this.window.element.querySelector('.run-ok-btn');
      const cancelBtn = this.window.element.querySelector('.run-cancel-btn');
      const browseBtn = this.window.element.querySelector('.run-browse-btn');

      // OK button
      okBtn.addEventListener('click', () => {
        this.executeCommand();
      });

      // Cancel button
      cancelBtn.addEventListener('click', () => {
        this.window.close();
      });

      // Browse button
      browseBtn.addEventListener('click', () => {
        alert('Browse functionality is not available in this simulation.');
      });

      // Enter key
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.executeCommand();
        } else if (e.key === 'Escape') {
          this.window.close();
        }
      });

      // Allow typing in select
      input.addEventListener('change', function() {
        // Store the typed/selected value
        this.setAttribute('data-value', this.value);
      });
    }

    /**
     * Execute command
     */
    executeCommand() {
      const input = this.window.element.querySelector('.run-input');
      const command = input.value.trim().toLowerCase();

      if (!command) {
        alert('Please type a command.');
        return;
      }

      // Save to recent commands
      this.addRecentCommand(command);

      // Execute command
      let executed = false;

      // Application shortcuts
      const appMap = {
        'notepad': 'notepad',
        'wordpad': 'wordpad',
        'paint': 'paint',
        'mspaint': 'paint',
        'calc': 'calculator',
        'calculator': 'calculator',
        'minesweeper': 'minesweeper',
        'winmine': 'minesweeper',
        'sol': 'solitaire',
        'solitaire': 'solitaire',
        'explorer': 'explorer',
        'iexplore': 'internet-explorer',
        'control': 'control-panel',
        'mplayer': 'media-player',
        'mediaplayer': 'media-player'
      };

      if (appMap[command]) {
        if (this.desktop) {
          this.desktop.openApplication(appMap[command]);
          executed = true;
        }
      }

      // Special commands
      if (!executed) {
        switch (command) {
          case 'help':
            alert('Windows 95 Help is not available in this simulation.');
            executed = true;
            break;
          case 'winver':
            if (this.desktop) {
              this.desktop.showAboutWindows();
              executed = true;
            }
            break;
          case 'regedit':
            alert('Registry Editor is not available in this simulation.');
            executed = true;
            break;
          case 'command':
          case 'cmd':
          case 'command.com':
            alert('MS-DOS Prompt is not available in this simulation.');
            executed = true;
            break;
        }
      }

      if (!executed) {
        alert(`Windows cannot find '${command}'. Make sure you typed the name correctly, and then try again.`);
      } else {
        this.window.close();
      }
    }

    /**
     * Load recent commands from localStorage
     */
    loadRecentCommands() {
      try {
        const stored = localStorage.getItem('win95-run-recent');
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        return [];
      }
    }

    /**
     * Add command to recent list
     */
    addRecentCommand(command) {
      // Remove if already exists
      this.recentCommands = this.recentCommands.filter(cmd => cmd !== command);

      // Add to beginning
      this.recentCommands.unshift(command);

      // Keep only last 10
      this.recentCommands = this.recentCommands.slice(0, 10);

      // Save to localStorage
      try {
        localStorage.setItem('win95-run-recent', JSON.stringify(this.recentCommands));
      } catch (e) {
        // Ignore errors
      }
    }
  }

  // Export to global scope
  global.Win95Run = Win95Run;

})(typeof window !== 'undefined' ? window : global);
