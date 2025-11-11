/**
 * Mac OS X TextEdit
 * Simple rich text editor
 */

class MacOSXTextEdit {
  constructor(windowSystem) {
    this.windowSystem = windowSystem;
    this.content = '';
  }

  launch() {
    const content = this.createTextEditContent();

    const windowId = this.windowSystem.createWindow({
      title: 'Untitled',
      content: content,
      width: 600,
      height: 400,
      appId: 'textedit',
      appName: 'TextEdit',
      toolbar: {
        items: [
          { label: 'Fonts', action: () => this.showFonts() },
          { label: 'Colors', action: () => this.showColors() },
          { label: 'Style', action: () => this.showStyles() }
        ]
      }
    });

    this.windowId = windowId;
    this.initialize();
  }

  createTextEditContent() {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.height = '100%';
    container.style.background = '#fff';

    // Format toolbar
    const formatBar = document.createElement('div');
    formatBar.style.display = 'flex';
    formatBar.style.gap = '4px';
    formatBar.style.padding = '8px';
    formatBar.style.borderBottom = '1px solid #ccc';
    formatBar.style.background = 'linear-gradient(to bottom, #f5f5f5 0%, #e8e8e8 100%)';

    const buttons = [
      { label: 'B', title: 'Bold', action: () => this.toggleBold() },
      { label: 'I', title: 'Italic', action: () => this.toggleItalic() },
      { label: 'U', title: 'Underline', action: () => this.toggleUnderline() }
    ];

    buttons.forEach(btn => {
      const button = document.createElement('button');
      button.className = 'toolbar-button';
      button.textContent = btn.label;
      button.title = btn.title;
      button.style.width = '30px';
      button.style.fontWeight = btn.label === 'B' ? 'bold' : 'normal';
      button.style.fontStyle = btn.label === 'I' ? 'italic' : 'normal';
      button.style.textDecoration = btn.label === 'U' ? 'underline' : 'none';
      button.addEventListener('click', btn.action);
      formatBar.appendChild(button);
    });

    // Text area
    const textArea = document.createElement('div');
    textArea.id = 'textedit-content';
    textArea.contentEditable = true;
    textArea.style.flex = '1';
    textArea.style.padding = '16px';
    textArea.style.fontFamily = "'Lucida Grande', sans-serif";
    textArea.style.fontSize = '13px';
    textArea.style.lineHeight = '1.6';
    textArea.style.outline = 'none';
    textArea.style.overflow = 'auto';

    textArea.innerHTML = `<p>Welcome to TextEdit!</p>
<p>This is a simple rich text editor for Mac OS X.</p>
<p><br></p>
<p>You can type here and use the formatting toolbar above to style your text.</p>
<p><br></p>
<p style="color: #666; font-size: 11px;">Mac OS X 10.0 Cheetah • RetroOS Museum</p>`;

    container.appendChild(formatBar);
    container.appendChild(textArea);

    return container;
  }

  initialize() {
    const textArea = document.querySelector(`#${this.windowId} #textedit-content`);
    if (textArea) {
      textArea.addEventListener('input', () => {
        this.content = textArea.innerHTML;
        this.updateTitle();
      });

      textArea.focus();
    }
  }

  toggleBold() {
    document.execCommand('bold', false, null);
  }

  toggleItalic() {
    document.execCommand('italic', false, null);
  }

  toggleUnderline() {
    document.execCommand('underline', false, null);
  }

  showFonts() {
    alert('Font Panel\n\n(Demo mode)\n\nIn the real Mac OS X, this would show the system font panel.');
  }

  showColors() {
    alert('Color Panel\n\n(Demo mode)\n\nIn the real Mac OS X, this would show the system color picker.');
  }

  showStyles() {
    alert('Text Styles\n\n(Demo mode)\n\nOptions:\n• Plain Text\n• Rich Text\n• HTML');
  }

  updateTitle() {
    const windowEl = document.getElementById(this.windowId);
    if (windowEl) {
      const titleEl = windowEl.querySelector('.window-title');
      if (titleEl) {
        titleEl.textContent = 'Untitled (modified)';
      }
    }
  }
}

// Make available globally
window.MacOSXTextEdit = MacOSXTextEdit;
