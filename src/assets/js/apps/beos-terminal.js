/**
 * BeOS Terminal
 * Command line interface with BeOS command set
 */

(function(global) {
  'use strict';

  /**
   * BeOS Terminal Application
   */
  class BeOSTerminal {
    constructor(desktop) {
      this.desktop = desktop;
      this.window = null;
      this.windowId = null;
      this.outputElement = null;
      this.inputElement = null;
      this.history = [];
      this.historyIndex = -1;
      this.currentPath = '/home';
    }

    /**
     * Launch Terminal
     */
    launch() {
      const content = this._createContent();

      this.windowId = `terminal-${Date.now()}`;
      this.window = this.desktop.windowSystem.createWindow({
        id: this.windowId,
        title: 'Terminal',
        width: 640,
        height: 400,
        content: content,
        resizable: true,
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

      // Focus input
      setTimeout(() => {
        if (this.inputElement) {
          this.inputElement.focus();
        }
      }, 100);
    }

    /**
     * Create Terminal content
     * @private
     */
    _createContent() {
      return `
        <div class="terminal-window" style="
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #000000;
          color: #00FF00;
          font-family: 'Courier New', Courier, monospace;
          font-size: 12px;
          padding: 8px;
          overflow: hidden;
        ">
          <div id="terminal-output" style="
            flex: 1;
            overflow-y: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
          "></div>
          <div style="display: flex; align-items: center; margin-top: 4px;">
            <span id="terminal-prompt" style="color: #00FFFF;">~&gt; </span>
            <input type="text" id="terminal-input" style="
              flex: 1;
              background: transparent;
              border: none;
              outline: none;
              color: #00FF00;
              font-family: 'Courier New', Courier, monospace;
              font-size: 12px;
              margin-left: 4px;
            ">
          </div>
        </div>
      `;
    }

    /**
     * Setup event handlers
     * @private
     */
    _setupEventHandlers() {
      this.outputElement = this.window.querySelector('#terminal-output');
      this.inputElement = this.window.querySelector('#terminal-input');

      if (!this.inputElement) return;

      this.inputElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this._executeCommand();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this._historyUp();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          this._historyDown();
        } else if (e.key === 'Tab') {
          e.preventDefault();
          this._autoComplete();
        }
      });

      // Show welcome message
      this._printWelcome();
    }

    /**
     * Print welcome message
     * @private
     */
    _printWelcome() {
      this._print('BeOS Terminal R5');
      this._print('Copyright 2000 Be Incorporated. All rights reserved.');
      this._print('');
      this._print('Type "help" for a list of commands.');
      this._print('');
    }

    /**
     * Execute command
     * @private
     */
    _executeCommand() {
      const command = this.inputElement.value.trim();
      if (!command) return;

      // Add to history
      this.history.push(command);
      this.historyIndex = this.history.length;

      // Echo command
      this._print(`~> ${command}`);

      // Clear input
      this.inputElement.value = '';

      // Parse and execute
      const parts = command.split(' ');
      const cmd = parts[0];
      const args = parts.slice(1);

      this._runCommand(cmd, args);
    }

    /**
     * Run command
     * @private
     */
    _runCommand(cmd, args) {
      switch (cmd) {
        case 'help':
          this._cmdHelp();
          break;
        case 'ls':
          this._cmdLs(args);
          break;
        case 'cd':
          this._cmdCd(args);
          break;
        case 'pwd':
          this._cmdPwd();
          break;
        case 'cat':
          this._cmdCat(args);
          break;
        case 'echo':
          this._cmdEcho(args);
          break;
        case 'clear':
          this._cmdClear();
          break;
        case 'uname':
          this._cmdUname();
          break;
        case 'date':
          this._cmdDate();
          break;
        case 'query':
          this._cmdQuery(args);
          break;
        case 'listattr':
          this._cmdListAttr(args);
          break;
        case 'about':
          this._cmdAbout();
          break;
        default:
          this._print(`bash: ${cmd}: command not found`);
          break;
      }

      this._print('');
    }

    /**
     * Command: help
     * @private
     */
    _cmdHelp() {
      this._print('Available commands:');
      this._print('  help      - Display this help message');
      this._print('  ls        - List directory contents');
      this._print('  cd        - Change directory');
      this._print('  pwd       - Print working directory');
      this._print('  cat       - Display file contents');
      this._print('  echo      - Display a line of text');
      this._print('  clear     - Clear the terminal');
      this._print('  uname     - Print system information');
      this._print('  date      - Display current date and time');
      this._print('  query     - Perform a live query (BeOS feature)');
      this._print('  listattr  - List file attributes (BeOS feature)');
      this._print('  about     - About BeOS R5');
    }

    /**
     * Command: ls
     * @private
     */
    _cmdLs(args) {
      const items = ['Documents', 'Music', 'Pictures', 'Desktop', 'readme.txt'];
      this._print(items.join('  '));
    }

    /**
     * Command: cd
     * @private
     */
    _cmdCd(args) {
      if (args.length === 0) {
        this.currentPath = '/home';
      } else {
        this.currentPath = args[0];
      }
      this._updatePrompt();
    }

    /**
     * Command: pwd
     * @private
     */
    _cmdPwd() {
      this._print(this.currentPath);
    }

    /**
     * Command: cat
     * @private
     */
    _cmdCat(args) {
      if (args.length === 0) {
        this._print('cat: missing file operand');
        return;
      }

      this._print('This is a sample file in BeOS.');
      this._print('BeOS features pervasive multithreading and a 64-bit journaling file system.');
    }

    /**
     * Command: echo
     * @private
     */
    _cmdEcho(args) {
      this._print(args.join(' '));
    }

    /**
     * Command: clear
     * @private
     */
    _cmdClear() {
      if (this.outputElement) {
        this.outputElement.textContent = '';
      }
    }

    /**
     * Command: uname
     * @private
     */
    _cmdUname() {
      this._print('BeOS 5.0 (Personal Edition) x86');
    }

    /**
     * Command: date
     * @private
     */
    _cmdDate() {
      const now = new Date();
      this._print(now.toString());
    }

    /**
     * Command: query (BeOS feature)
     * @private
     */
    _cmdQuery(args) {
      this._print('Performing live query...');
      this._print('Found 3 files matching query:');
      this._print('  /home/Documents/Notes.txt');
      this._print('  /home/Documents/Report.txt');
      this._print('  /boot/apps/readme.txt');
    }

    /**
     * Command: listattr (BeOS feature)
     * @private
     */
    _cmdListAttr(args) {
      if (args.length === 0) {
        this._print('listattr: missing file operand');
        return;
      }

      this._print(`File: ${args[0]}`);
      this._print('Attributes:');
      this._print('  BEOS:TYPE      : text/plain');
      this._print('  META:name      : Sample Document');
      this._print('  META:author    : BeOS User');
      this._print('  META:keywords  : demo, sample');
    }

    /**
     * Command: about
     * @private
     */
    _cmdAbout() {
      this._print('BeOS R5 (Personal Edition)');
      this._print('Copyright 2000 Be Incorporated.');
      this._print('');
      this._print('The Media OS - designed for digital media creation');
      this._print('Featuring:');
      this._print('  - Pervasive multithreading');
      this._print('  - 64-bit journaling file system (BFS)');
      this._print('  - Extended file attributes');
      this._print('  - Live queries');
      this._print('  - Symmetric multiprocessing');
    }

    /**
     * Print to terminal
     * @private
     */
    _print(text) {
      if (!this.outputElement) return;

      this.outputElement.textContent += text + '\n';
      this.outputElement.scrollTop = this.outputElement.scrollHeight;
    }

    /**
     * Update prompt
     * @private
     */
    _updatePrompt() {
      const promptEl = this.window.querySelector('#terminal-prompt');
      if (promptEl) {
        promptEl.textContent = `${this.currentPath}> `;
      }
    }

    /**
     * History navigation - up
     * @private
     */
    _historyUp() {
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.inputElement.value = this.history[this.historyIndex];
      }
    }

    /**
     * History navigation - down
     * @private
     */
    _historyDown() {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.inputElement.value = this.history[this.historyIndex];
      } else {
        this.historyIndex = this.history.length;
        this.inputElement.value = '';
      }
    }

    /**
     * Auto-complete
     * @private
     */
    _autoComplete() {
      const commands = ['help', 'ls', 'cd', 'pwd', 'cat', 'echo', 'clear', 'uname', 'date', 'query', 'listattr', 'about'];
      const input = this.inputElement.value;

      const matches = commands.filter(cmd => cmd.startsWith(input));
      if (matches.length === 1) {
        this.inputElement.value = matches[0];
      }
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
  global.BeOSTerminal = BeOSTerminal;

})(window);
