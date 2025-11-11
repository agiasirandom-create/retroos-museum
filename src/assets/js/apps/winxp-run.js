/**
 * Windows XP Run Dialog
 * Execute programs and commands
 */

(function(global) {
  'use strict';

  class WinXPRun {
    constructor(desktop) {
      this.desktop = desktop;
      this.window = null;
      this.history = this.loadHistory();
    }

    /**
     * Open Run dialog
     */
    open() {
      const windowContent = this.buildContent();

      this.window = this.desktop.windowManager.createWindow({
        id: `run-${Date.now()}`,
        title: 'Run',
        content: windowContent,
        width: 400,
        height: 200,
        resizable: false,
        minimizable: false,
        maximizable: false
      });

      this.setupEventListeners();
    }

    /**
     * Build window content
     */
    buildContent() {
      return `
        <div class="run-container" style="padding: 16px; font-family: Tahoma, Arial, sans-serif; font-size: 11px; background: #ECE9D8;">
          <!-- Icon and Instructions -->
          <div style="display: flex; gap: 16px; margin-bottom: 16px;">
            <div style="font-size: 32px;"><Ã</div>
            <div style="flex: 1;">
              <p style="margin: 0 0 8px 0;">Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.</p>
            </div>
          </div>

          <!-- Open Field -->
          <div style="margin-bottom: 16px;">
            <label for="run-input" style="display: block; margin-bottom: 4px; font-weight: bold;">Open:</label>
            <div style="display: flex; gap: 8px;">
              <input type="text" id="run-input" list="run-history" placeholder="Type program name..." style="flex: 1; padding: 4px 8px; border: 1px inset #ACA899; font-family: Tahoma; font-size: 11px;">
              <button id="browse-btn" style="padding: 4px 12px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">Browse...</button>
            </div>
            <datalist id="run-history">
              ${this.history.map(cmd => `<option value="${cmd}">`).join('')}
            </datalist>
          </div>

          <!-- Buttons -->
          <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px;">
            <button id="run-ok-btn" style="min-width: 75px; padding: 6px 16px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; font-weight: bold; cursor: pointer;">OK</button>
            <button id="run-cancel-btn" style="min-width: 75px; padding: 6px 16px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer;">Cancel</button>
          </div>
        </div>
      `;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
      const input = this.window.element.querySelector('#run-input');
      const okBtn = this.window.element.querySelector('#run-ok-btn');
      const cancelBtn = this.window.element.querySelector('#run-cancel-btn');
      const browseBtn = this.window.element.querySelector('#browse-btn');

      // Focus input
      setTimeout(() => input.focus(), 100);

      // OK button
      okBtn.addEventListener('click', () => {
        this.execute(input.value);
      });

      // Cancel button
      cancelBtn.addEventListener('click', () => {
        this.window.close();
      });

      // Browse button
      browseBtn.addEventListener('click', () => {
        alert('Browse dialog - In a full implementation, this would open a file browser.');
      });

      // Enter key
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.execute(input.value);
        }
      });

      // Button hover effects
      [okBtn, cancelBtn, browseBtn].forEach(btn => {
        btn.addEventListener('mouseenter', () => {
          btn.style.background = 'linear-gradient(to bottom, #FFFFFF 0%, #D6E9F8 100%)';
          btn.style.borderColor = '#0054E3';
        });
        btn.addEventListener('mouseleave', () => {
          btn.style.background = 'linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%)';
          btn.style.borderColor = '#ACA899';
        });
      });
    }

    /**
     * Execute command
     */
    execute(command) {
      if (!command.trim()) {
        alert('Please enter a command.');
        return;
      }

      // Add to history
      this.addToHistory(command);

      // Process known commands
      const cmd = command.toLowerCase().trim();

      switch(cmd) {
        case 'notepad':
          this.desktop.openNotepad();
          break;
        case 'explorer':
          this.desktop.openMyComputer();
          break;
        case 'control':
          this.desktop.openControlPanel();
          break;
        case 'calc':
        case 'calculator':
          this.desktop.showPlaceholder('Calculator');
          break;
        case 'mspaint':
        case 'paint':
          this.desktop.showPlaceholder('Paint');
          break;
        case 'iexplore':
        case 'ie':
          this.desktop.openInternetExplorer();
          break;
        default:
          alert(`Cannot find '${command}'. Make sure you typed the name correctly, and then try again.`);
          return;
      }

      this.window.close();
    }

    /**
     * Load command history
     */
    loadHistory() {
      try {
        const stored = localStorage.getItem('winxp-run-history');
        return stored ? JSON.parse(stored) : ['notepad', 'explorer', 'control', 'calc'];
      } catch (e) {
        return ['notepad', 'explorer', 'control', 'calc'];
      }
    }

    /**
     * Add command to history
     */
    addToHistory(command) {
      if (!this.history.includes(command)) {
        this.history.unshift(command);
        this.history = this.history.slice(0, 10); // Keep last 10
        try {
          localStorage.setItem('winxp-run-history', JSON.stringify(this.history));
        } catch (e) {
          console.warn('Failed to save history');
        }
      }
    }
  }

  // Export to global scope
  global.WinXPRun = WinXPRun;

})(typeof window !== 'undefined' ? window : global);
