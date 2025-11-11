/**
 * Mac OS X Terminal
 * Unix command line interface
 */

class MacOSXTerminal {
  constructor(windowSystem) {
    this.windowSystem = windowSystem;
    this.history = [];
    this.historyIndex = -1;
    this.currentPath = '/Users/user';
  }

  launch() {
    const content = this.createTerminalContent();

    const windowId = this.windowSystem.createWindow({
      title: 'Terminal',
      content: content,
      width: 600,
      height: 400,
      appId: 'terminal',
      appName: 'Terminal'
    });

    this.windowId = windowId;
    this.initialize();
  }

  createTerminalContent() {
    const container = document.createElement('div');
    container.className = 'terminal-content';
    container.id = 'terminal-content';

    // Welcome message
    container.innerHTML = `
      <div style="color: #0F0; margin-bottom: 8px;">Last login: ${new Date().toDateString()} on console</div>
      <div style="color: #0F0; margin-bottom: 8px;">Welcome to Darwin!</div>
      <div style="margin-bottom: 8px;"></div>
    `;

    // Add initial prompt
    this.addPromptLine(container);

    return container;
  }

  addPromptLine(container) {
    const line = document.createElement('div');
    line.className = 'terminal-line';

    const prompt = document.createElement('span');
    prompt.className = 'terminal-prompt';
    prompt.textContent = `${this.currentPath.split('/').pop() || 'user'}$ `;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'terminal-input';
    input.id = 'terminal-input';
    input.spellcheck = false;
    input.autocomplete = 'off';

    line.appendChild(prompt);
    line.appendChild(input);
    container.appendChild(line);

    return input;
  }

  initialize() {
    const container = document.querySelector(`#${this.windowId} #terminal-content`);
    if (!container) return;

    const input = container.querySelector('#terminal-input');
    if (!input) return;

    input.focus();

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const command = input.value.trim();

        if (command) {
          this.history.push(command);
          this.historyIndex = this.history.length;
          this.executeCommand(command, container);
        } else {
          this.addPromptLine(container);
          container.scrollTop = container.scrollHeight;
        }

        // Focus new input
        setTimeout(() => {
          const newInput = container.querySelector('#terminal-input');
          if (newInput) newInput.focus();
        }, 0);
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
      } else if (e.key === 'Tab') {
        e.preventDefault();
        // Tab completion (simplified)
      }
    });

    // Refocus input when clicking in terminal
    container.addEventListener('click', () => {
      const currentInput = container.querySelector('#terminal-input');
      if (currentInput) currentInput.focus();
    });
  }

  executeCommand(command, container) {
    // Display command
    const commandLine = container.querySelector('.terminal-line:last-child');
    if (commandLine) {
      commandLine.querySelector('#terminal-input')?.remove();
      const commandText = document.createElement('span');
      commandText.textContent = command;
      commandLine.appendChild(commandText);
    }

    // Parse and execute
    const parts = command.split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);

    const output = this.runCommand(cmd, args);

    // Display output
    if (output) {
      const outputDiv = document.createElement('div');
      outputDiv.style.marginBottom = '8px';
      outputDiv.innerHTML = output;
      container.appendChild(outputDiv);
    }

    // Add new prompt
    this.addPromptLine(container);
    container.scrollTop = container.scrollHeight;
  }

  runCommand(cmd, args) {
    switch (cmd) {
      case 'help':
        return `<div style="color: #0F0;">Available commands:</div>
<div style="color: #888;">  help      - Show this help message</div>
<div style="color: #888;">  ls        - List directory contents</div>
<div style="color: #888;">  pwd       - Print working directory</div>
<div style="color: #888;">  cd        - Change directory</div>
<div style="color: #888;">  whoami    - Print current user</div>
<div style="color: #888;">  date      - Display current date and time</div>
<div style="color: #888;">  uname     - Print system information</div>
<div style="color: #888;">  clear     - Clear terminal screen</div>
<div style="color: #888;">  about     - About this terminal</div>`;

      case 'ls':
        return `<div style="color: #0F0;">Desktop     Documents   Downloads   Music       Pictures</div>`;

      case 'pwd':
        return `<div style="color: #0F0;">${this.currentPath}</div>`;

      case 'cd':
        if (args.length === 0) {
          this.currentPath = '/Users/user';
          return '';
        } else if (args[0] === '..') {
          const parts = this.currentPath.split('/').filter(p => p);
          if (parts.length > 0) {
            parts.pop();
            this.currentPath = '/' + parts.join('/');
          }
          return '';
        } else {
          this.currentPath = `${this.currentPath}/${args[0]}`.replace('//', '/');
          return '';
        }

      case 'whoami':
        return `<div style="color: #0F0;">user</div>`;

      case 'date':
        return `<div style="color: #0F0;">${new Date().toString()}</div>`;

      case 'uname':
        if (args.includes('-a')) {
          return `<div style="color: #0F0;">Darwin localhost 1.3.1 Darwin Kernel Version 1.3.1: PowerPC</div>`;
        }
        return `<div style="color: #0F0;">Darwin</div>`;

      case 'clear':
        const container = document.querySelector(`#${this.windowId} #terminal-content`);
        if (container) {
          container.innerHTML = '';
        }
        return '';

      case 'about':
        return `<div style="color: #0F0;">Terminal.app - Mac OS X 10.0 Cheetah</div>
<div style="color: #888;">A recreation for the RetroOS Museum</div>
<div style="color: #888;">Built on Darwin 1.3.1</div>`;

      case 'echo':
        return `<div style="color: #0F0;">${args.join(' ')}</div>`;

      case 'cat':
        if (args.length === 0) {
          return `<div style="color: #F00;">cat: missing file operand</div>`;
        }
        return `<div style="color: #0F0;">This is the contents of ${args[0]}</div>
<div style="color: #888;">(Demo mode - file system not fully implemented)</div>`;

      case 'top':
        return `<div style="color: #0F0;">Processes: 42 total, 2 running, 40 sleeping... 68 threads</div>
<div style="color: #0F0;">Load Avg: 0.45, 0.38, 0.32     CPU usage: 2.5% user, 5.8% sys, 91.7% idle</div>
<div style="color: #888;">(Press q to quit - not implemented in demo)</div>`;

      case 'ps':
        return `<div style="color: #0F0;">  PID TTY          TIME CMD</div>
<div style="color: #0F0;">  123 ttys000    0:00.01 -bash</div>
<div style="color: #0F0;">  456 ttys000    0:00.00 ps</div>`;

      case '':
        return '';

      default:
        return `<div style="color: #F00;">-bash: ${cmd}: command not found</div>
<div style="color: #888;">Type 'help' for available commands</div>`;
    }
  }
}

// Make available globally
window.MacOSXTerminal = MacOSXTerminal;
