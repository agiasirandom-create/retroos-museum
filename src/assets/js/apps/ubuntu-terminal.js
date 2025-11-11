/**
 * Ubuntu GNOME Terminal
 * Terminal emulator with tab support
 */

(function(global) {
  'use strict';

  class UbuntuTerminal {
    constructor(windowManager) {
      this.windowManager = windowManager;
      this.windowInstance = null;
      this.history = [];
      this.historyIndex = -1;
      this.currentDirectory = '/home/user';
    }

    open() {
      this.windowInstance = this.windowManager.createWindow({
        id: `terminal-${Date.now()}`,
        title: 'Terminal',
        width: 640,
        height: 420,
        x: 140 + Math.random() * 100,
        y: 120 + Math.random() * 80,
        resizable: true,
        content: this.renderContent()
      });

      this.attachEventListeners();
    }

    renderContent() {
      return `
        <div class="terminal-container">
          <div class="terminal-menubar">
            <button class="terminal-menu-item">File</button>
            <button class="terminal-menu-item">Edit</button>
            <button class="terminal-menu-item">View</button>
            <button class="terminal-menu-item">Terminal</button>
            <button class="terminal-menu-item">Help</button>
          </div>
          <div class="terminal-output" id="terminal-output-${this.windowInstance?.id || 'temp'}">
            <div class="terminal-line">Ubuntu 4.10 Warty Warthog</div>
            <div class="terminal-line">Welcome to Ubuntu!</div>
            <div class="terminal-line">&nbsp;</div>
          </div>
          <div class="terminal-input-line">
            <span class="terminal-prompt">user@ubuntu:~$</span>
            <input type="text" class="terminal-input" autofocus>
          </div>
        </div>

        <style>
          .terminal-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: #2E3436;
            color: #D3D7CF;
            font-family: 'Courier New', monospace;
            font-size: 11pt;
          }

          .terminal-menubar {
            display: flex;
            padding: 2px 4px;
            background: #E9E7E3;
            border-bottom: 1px solid #9B9388;
          }

          .terminal-menu-item {
            padding: 4px 12px;
            background: transparent;
            border: none;
            border-radius: 2px;
            font-family: 'Ubuntu Sans', sans-serif;
            font-size: 10pt;
            color: #2C2C2C;
            cursor: pointer;
            transition: background-color 0.1s ease;
          }

          .terminal-menu-item:hover {
            background: rgba(240, 119, 70, 0.15);
          }

          .terminal-output {
            flex: 1;
            padding: 12px;
            overflow-y: auto;
          }

          .terminal-line {
            line-height: 1.4;
            white-space: pre-wrap;
            word-wrap: break-word;
          }

          .terminal-input-line {
            display: flex;
            padding: 0 12px 12px;
          }

          .terminal-prompt {
            color: #8AE234;
            margin-right: 8px;
            white-space: nowrap;
          }

          .terminal-input {
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            color: #D3D7CF;
            font-family: 'Courier New', monospace;
            font-size: 11pt;
          }

          .terminal-output::-webkit-scrollbar {
            width: 12px;
          }

          .terminal-output::-webkit-scrollbar-track {
            background: #1C1E1F;
          }

          .terminal-output::-webkit-scrollbar-thumb {
            background: #555753;
            border-radius: 6px;
          }
        </style>
      `;
    }

    attachEventListeners() {
      const content = this.windowInstance.contentArea;
      const input = content.querySelector('.terminal-input');
      const output = content.querySelector('.terminal-output');

      if (input && output) {
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            const command = input.value;
            this.executeCommand(command, output);
            input.value = '';
            this.history.push(command);
            this.historyIndex = this.history.length;
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex > 0) {
              this.historyIndex--;
              input.value = this.history[this.historyIndex];
            }
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex < this.history.length - 1) {
              this.historyIndex++;
              input.value = this.history[this.historyIndex];
            } else {
              this.historyIndex = this.history.length;
              input.value = '';
            }
          }
        });
      }
    }

    executeCommand(command, output) {
      const line = document.createElement('div');
      line.className = 'terminal-line';

      // Create prompt span safely
      const prompt = document.createElement('span');
      prompt.style.color = '#8AE234';
      prompt.textContent = 'user@ubuntu:~$';
      line.appendChild(prompt);

      // Add command as text (safe from XSS)
      line.appendChild(document.createTextNode(' ' + command));
      output.appendChild(line);

      const response = this.processCommand(command.trim());
      if (response) {
        const responseLine = document.createElement('div');
        responseLine.className = 'terminal-line';
        responseLine.textContent = response;
        output.appendChild(responseLine);
      }

      output.scrollTop = output.scrollHeight;
    }

    processCommand(command) {
      const parts = command.split(' ');
      const cmd = parts[0];

      switch (cmd) {
        case 'ls':
          return 'Desktop  Documents  Downloads  Music  Pictures  Videos';
        case 'pwd':
          return this.currentDirectory;
        case 'whoami':
          return 'user';
        case 'date':
          return new Date().toString();
        case 'uname':
          return 'Linux ubuntu 2.6.8 #1 SMP i686 GNU/Linux';
        case 'clear':
          const output = document.querySelector('.terminal-output');
          if (output) output.innerHTML = '';
          return '';
        case 'help':
          return 'Available commands: ls, pwd, whoami, date, uname, clear, help';
        case 'apt-get':
          return 'E: Could not open lock file - open (13: Permission denied)\nE: Unable to lock the administration directory, are you root?';
        case 'sudo':
          if (parts[1] === 'apt-get') {
            return '[sudo] password for user: ';
          }
          return 'sudo: ' + parts.slice(1).join(' ') + ': command not found';
        case '':
          return '';
        default:
          return `bash: ${cmd}: command not found`;
      }
    }
  }

  global.UbuntuTerminal = UbuntuTerminal;

})(typeof window !== 'undefined' ? window : global);
