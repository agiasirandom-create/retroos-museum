/**
 * Application Factory
 * Dynamically generates applications from configuration
 */

class AppFactory {
  constructor(windowManager, themeEngine) {
    this.windowManager = windowManager;
    this.themeEngine = themeEngine;
    this.appComponents = new Map();
    this.registerDefaultComponents();
  }

  /**
   * Register default application components
   */
  registerDefaultComponents() {
    // Text Editor
    this.register('Notepad', this.createTextEditor.bind(this));
    this.register('TeachText', this.createTextEditor.bind(this));
    this.register('XEdit', this.createTextEditor.bind(this));
    this.register('NotePad', this.createTextEditor.bind(this));

    // File Manager
    this.register('FileExplorer', this.createFileManager.bind(this));
    this.register('Finder', this.createFileManager.bind(this));
    this.register('WorkbenchWindow', this.createFileManager.bind(this));
    this.register('XFM', this.createFileManager.bind(this));

    // Terminal
    this.register('XTerm', this.createTerminal.bind(this));
    this.register('Shell', this.createTerminal.bind(this));

    // Calculator
    this.register('Calculator', this.createCalculator.bind(this));
    this.register('XCalc', this.createCalculator.bind(this));

    // About/Info
    this.register('About', this.createAboutDialog.bind(this));

    // Settings
    this.register('ControlPanel', this.createControlPanel.bind(this));
    this.register('ControlPanels', this.createControlPanel.bind(this));

    // Trash/Recycle Bin
    this.register('RecycleBin', this.createTrashcan.bind(this));
    this.register('Trash', this.createTrashcan.bind(this));
    this.register('Trashcan', this.createTrashcan.bind(this));

    // RAM Disk / Drives
    this.register('RAMDisk', this.createDrive.bind(this));
  }

  /**
   * Register a custom component factory
   */
  register(componentName, factoryFunction) {
    this.appComponents.set(componentName, factoryFunction);
  }

  /**
   * Create application from configuration
   */
  createApp(appConfig, osConfig) {
    const componentName = appConfig.component || 'Default';
    const factory = this.appComponents.get(componentName);

    if (factory) {
      return factory(appConfig, osConfig);
    }

    // Fallback to generic window
    return this.createGenericWindow(appConfig, osConfig);
  }

  /**
   * Create generic window with basic content
   */
  createGenericWindow(appConfig, osConfig) {
    const content = document.createElement('div');
    content.className = 'app-content generic-app';
    content.innerHTML = `
      <div class="app-header">
        <h2>${appConfig.name}</h2>
        <p>Application Type: ${appConfig.type}</p>
      </div>
      <div class="app-body">
        <p>This is a placeholder for ${appConfig.name}.</p>
        <p>Component: ${appConfig.component}</p>
      </div>
    `;

    return content;
  }

  /**
   * Create text editor application
   */
  createTextEditor(appConfig, osConfig) {
    const container = document.createElement('div');
    container.className = 'app-content text-editor';

    // Menu bar (if window-level menus)
    if (osConfig.paradigm.menuSystem.type === 'hybrid' ||
        osConfig.paradigm.menuSystem.type === 'window') {
      const menuBar = this.createMenuBar([
        {
          label: 'File',
          items: [
            { label: 'New', shortcut: 'Ctrl+N' },
            { label: 'Open...', shortcut: 'Ctrl+O' },
            { label: 'Save', shortcut: 'Ctrl+S' },
            { label: 'Save As...', shortcut: 'Ctrl+Shift+S' },
            { type: 'separator' },
            { label: 'Exit', shortcut: 'Alt+F4' }
          ]
        },
        {
          label: 'Edit',
          items: [
            { label: 'Undo', shortcut: 'Ctrl+Z' },
            { label: 'Redo', shortcut: 'Ctrl+Y' },
            { type: 'separator' },
            { label: 'Cut', shortcut: 'Ctrl+X' },
            { label: 'Copy', shortcut: 'Ctrl+C' },
            { label: 'Paste', shortcut: 'Ctrl+V' }
          ]
        },
        {
          label: 'Format',
          items: [
            { label: 'Word Wrap' },
            { label: 'Font...' }
          ]
        },
        {
          label: 'Help',
          items: [
            { label: 'View Help' },
            { label: 'About' }
          ]
        }
      ], osConfig);
      container.appendChild(menuBar);
    }

    // Text area
    const textArea = document.createElement('textarea');
    textArea.className = 'text-editor-area';
    textArea.placeholder = 'Start typing...';
    textArea.spellcheck = false;

    container.appendChild(textArea);

    // Status bar
    const statusBar = document.createElement('div');
    statusBar.className = 'status-bar';
    statusBar.innerHTML = `
      <span class="status-item">Line 1, Col 1</span>
      <span class="status-item">100%</span>
      <span class="status-item">Windows (CRLF)</span>
    `;
    container.appendChild(statusBar);

    // Update status on input
    textArea.addEventListener('input', (e) => {
      const lines = textArea.value.split('\n').length;
      const col = textArea.value.length - textArea.value.lastIndexOf('\n');
      statusBar.querySelector('.status-item').textContent = `Line ${lines}, Col ${col}`;
    });

    return container;
  }

  /**
   * Create file manager application
   */
  createFileManager(appConfig, osConfig) {
    const container = document.createElement('div');
    container.className = 'app-content file-manager';

    // Toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';
    toolbar.innerHTML = `
      <button class="toolbar-button" title="Back">◄</button>
      <button class="toolbar-button" title="Forward">►</button>
      <button class="toolbar-button" title="Up">▲</button>
      <div class="address-bar">
        <input type="text" value="C:\\" readonly>
      </div>
    `;
    container.appendChild(toolbar);

    // File view
    const fileView = document.createElement('div');
    fileView.className = 'file-view';

    const sampleFiles = [
      { name: 'Documents', type: 'folder', icon: '📁' },
      { name: 'Pictures', type: 'folder', icon: '📁' },
      { name: 'Program Files', type: 'folder', icon: '📁' },
      { name: 'Windows', type: 'folder', icon: '📁' },
      { name: 'readme.txt', type: 'file', icon: '📄' },
      { name: 'config.sys', type: 'file', icon: '⚙️' }
    ];

    sampleFiles.forEach(file => {
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      fileItem.innerHTML = `
        <div class="file-icon">${file.icon}</div>
        <div class="file-name">${file.name}</div>
      `;
      fileView.appendChild(fileItem);
    });

    container.appendChild(fileView);

    // Status bar
    const statusBar = document.createElement('div');
    statusBar.className = 'status-bar';
    statusBar.innerHTML = `
      <span class="status-item">${sampleFiles.length} objects</span>
      <span class="status-item">512 MB free</span>
    `;
    container.appendChild(statusBar);

    return container;
  }

  /**
   * Create terminal/shell application
   */
  createTerminal(appConfig, osConfig) {
    const container = document.createElement('div');
    container.className = 'app-content terminal';

    const output = document.createElement('div');
    output.className = 'terminal-output';
    output.innerHTML = `
      <div class="terminal-line">${osConfig.metadata.name} Version ${osConfig.metadata.version}</div>
      <div class="terminal-line">(C) Copyright ${osConfig.metadata.company}</div>
      <div class="terminal-line"></div>
      <div class="terminal-line">Type "help" for available commands.</div>
      <div class="terminal-line"></div>
    `;

    const inputLine = document.createElement('div');
    inputLine.className = 'terminal-input-line';
    inputLine.innerHTML = `
      <span class="terminal-prompt">C:\\&gt;</span>
      <input type="text" class="terminal-input" autocomplete="off">
    `;

    container.appendChild(output);
    container.appendChild(inputLine);

    // Handle terminal commands
    const input = inputLine.querySelector('.terminal-input');
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const command = input.value;
        const response = this.handleTerminalCommand(command, osConfig);

        const cmdLine = document.createElement('div');
        cmdLine.className = 'terminal-line';
        cmdLine.innerHTML = `<span class="terminal-prompt">C:\\&gt;</span> ${command}`;
        output.appendChild(cmdLine);

        if (response) {
          const respLine = document.createElement('div');
          respLine.className = 'terminal-line';
          respLine.textContent = response;
          output.appendChild(respLine);
        }

        input.value = '';
        container.scrollTop = container.scrollHeight;
      }
    });

    return container;
  }

  /**
   * Handle terminal command
   */
  handleTerminalCommand(command, osConfig) {
    const cmd = command.toLowerCase().trim();

    const responses = {
      'help': 'Available commands: help, ver, dir, cls, echo, exit',
      'ver': `${osConfig.metadata.name} Version ${osConfig.metadata.version}`,
      'dir': 'Directory listing not implemented in this demo',
      'cls': '',
      'echo': command.substring(5),
      'exit': 'Use the close button to exit'
    };

    if (cmd === 'cls') {
      const output = document.querySelector('.terminal-output');
      if (output) output.innerHTML = '';
      return '';
    }

    return responses[cmd.split(' ')[0]] || `'${command}' is not recognized as a command.`;
  }

  /**
   * Create calculator application
   */
  createCalculator(appConfig, osConfig) {
    const container = document.createElement('div');
    container.className = 'app-content calculator';

    const display = document.createElement('input');
    display.type = 'text';
    display.className = 'calc-display';
    display.value = '0';
    display.readOnly = true;
    container.appendChild(display);

    const buttons = [
      ['7', '8', '9', '/'],
      ['4', '5', '6', '*'],
      ['1', '2', '3', '-'],
      ['C', '0', '=', '+']
    ];

    const buttonGrid = document.createElement('div');
    buttonGrid.className = 'calc-buttons';

    buttons.forEach(row => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'calc-row';

      row.forEach(label => {
        const button = document.createElement('button');
        button.className = 'calc-button';
        button.textContent = label;
        button.onclick = () => this.handleCalcButton(label, display);
        rowDiv.appendChild(button);
      });

      buttonGrid.appendChild(rowDiv);
    });

    container.appendChild(buttonGrid);
    return container;
  }

  /**
   * Handle calculator button click
   */
  handleCalcButton(label, display) {
    if (label === 'C') {
      display.value = '0';
    } else if (label === '=') {
      try {
        display.value = eval(display.value.replace('×', '*').replace('÷', '/'));
      } catch (e) {
        display.value = 'Error';
      }
    } else {
      if (display.value === '0' || display.value === 'Error') {
        display.value = label;
      } else {
        display.value += label;
      }
    }
  }

  /**
   * Create about dialog
   */
  createAboutDialog(appConfig, osConfig) {
    const container = document.createElement('div');
    container.className = 'app-content about-dialog';

    container.innerHTML = `
      <div class="about-header">
        <div class="about-logo">ℹ️</div>
        <h2>${osConfig.metadata.name}</h2>
      </div>
      <div class="about-info">
        <p><strong>Version:</strong> ${osConfig.metadata.version}</p>
        <p><strong>Company:</strong> ${osConfig.metadata.company}</p>
        <p><strong>Released:</strong> ${osConfig.metadata.releaseYear}</p>
        <p class="about-description">${osConfig.metadata.description}</p>
        ${osConfig.metadata.tagline ? `<p class="about-tagline">"${osConfig.metadata.tagline}"</p>` : ''}
      </div>
      <div class="about-footer">
        <button class="button primary">OK</button>
      </div>
    `;

    container.querySelector('button').onclick = function() {
      const window = container.closest('.window');
      if (window) {
        window.remove();
      }
    };

    return container;
  }

  /**
   * Create control panel
   */
  createControlPanel(appConfig, osConfig) {
    const container = document.createElement('div');
    container.className = 'app-content control-panel';

    container.innerHTML = `
      <div class="control-panel-grid">
        <div class="control-panel-item">
          <div class="control-icon">🖥️</div>
          <div class="control-label">Display</div>
        </div>
        <div class="control-panel-item">
          <div class="control-icon">🔊</div>
          <div class="control-label">Sound</div>
        </div>
        <div class="control-panel-item">
          <div class="control-icon">🖱️</div>
          <div class="control-label">Mouse</div>
        </div>
        <div class="control-panel-item">
          <div class="control-icon">⌨️</div>
          <div class="control-label">Keyboard</div>
        </div>
        <div class="control-panel-item">
          <div class="control-icon">🌐</div>
          <div class="control-label">Network</div>
        </div>
        <div class="control-panel-item">
          <div class="control-icon">⚙️</div>
          <div class="control-label">System</div>
        </div>
      </div>
    `;

    return container;
  }

  /**
   * Create trashcan/recycle bin
   */
  createTrashcan(appConfig, osConfig) {
    const container = document.createElement('div');
    container.className = 'app-content trashcan';

    container.innerHTML = `
      <div class="trashcan-header">
        <p class="trashcan-message">The Recycle Bin is empty.</p>
      </div>
      <div class="trashcan-actions">
        <button class="button">Empty Recycle Bin</button>
      </div>
    `;

    return container;
  }

  /**
   * Create drive window
   */
  createDrive(appConfig, osConfig) {
    return this.createFileManager(appConfig, osConfig);
  }

  /**
   * Create menu bar for applications
   */
  createMenuBar(menuConfig, osConfig) {
    const menuBar = document.createElement('div');
    menuBar.className = 'menu-bar';

    menuConfig.forEach(menu => {
      const menuItem = document.createElement('div');
      menuItem.className = 'menu-item';
      menuItem.textContent = menu.label;

      const dropdown = document.createElement('div');
      dropdown.className = 'menu-dropdown';

      menu.items.forEach(item => {
        if (item.type === 'separator') {
          const separator = document.createElement('div');
          separator.className = 'menu-separator';
          dropdown.appendChild(separator);
        } else {
          const dropdownItem = document.createElement('div');
          dropdownItem.className = 'menu-dropdown-item';
          dropdownItem.innerHTML = `
            <span>${item.label}</span>
            ${item.shortcut ? `<span class="menu-shortcut">${item.shortcut}</span>` : ''}
          `;
          dropdown.appendChild(dropdownItem);
        }
      });

      menuItem.appendChild(dropdown);
      menuBar.appendChild(menuItem);
    });

    return menuBar;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AppFactory;
}
