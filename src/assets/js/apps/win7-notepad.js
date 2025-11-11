/**
 * Windows 7 Notepad
 * Simple text editor
 */

class Win7Notepad {
  constructor(desktop) {
    this.desktop = desktop;
    this.content = '';
    this.filename = 'Untitled';
    this.modified = false;
  }

  /**
   * Render Notepad content
   * @returns {HTMLElement} - Content element
   */
  render() {
    const container = document.createElement('div');
    container.style.cssText = `
      display: flex;
      flex-direction: column;
      height: 100%;
    `;

    // Menu bar
    const menuBar = document.createElement('div');
    menuBar.className = 'win7-menubar';

    const menus = ['File', 'Edit', 'Format', 'View', 'Help'];
    menus.forEach(menu => {
      const menuItem = document.createElement('div');
      menuItem.className = 'win7-menu-item';
      menuItem.textContent = menu;
      menuBar.appendChild(menuItem);
    });

    container.appendChild(menuBar);

    // Text area
    const textarea = document.createElement('textarea');
    textarea.style.cssText = `
      flex: 1;
      border: none;
      padding: 8px;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 12px;
      resize: none;
      outline: none;
    `;
    textarea.placeholder = 'Start typing...';
    textarea.value = this.content;

    textarea.addEventListener('input', (e) => {
      this.content = e.target.value;
      this.modified = true;
    });

    container.appendChild(textarea);

    // Status bar
    const statusBar = document.createElement('div');
    statusBar.className = 'win7-statusbar';
    statusBar.textContent = 'Ln 1, Col 1';

    textarea.addEventListener('keyup', () => {
      const lines = textarea.value.substr(0, textarea.selectionStart).split('\n');
      const currentLine = lines.length;
      const currentCol = lines[lines.length - 1].length + 1;
      statusBar.textContent = `Ln ${currentLine}, Col ${currentCol}`;
    });

    container.appendChild(statusBar);

    return container;
  }

  /**
   * Open Notepad window
   */
  open() {
    const title = this.modified ? `*${this.filename} - Notepad` : `${this.filename} - Notepad`;

    this.desktop.createWindow({
      title: title,
      icon: '📝',
      width: 700,
      height: 500,
      content: this.render(),
      appId: 'notepad'
    });
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Win7Notepad;
}
