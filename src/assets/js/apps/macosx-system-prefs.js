/**
 * Mac OS X System Preferences
 * Control panel with preference panes in icon grid
 */

class MacOSXSystemPreferences {
  constructor(windowSystem) {
    this.windowSystem = windowSystem;
  }

  launch() {
    const content = this.createSystemPrefsContent();

    const windowId = this.windowSystem.createWindow({
      title: 'System Preferences',
      content: content,
      width: 600,
      height: 500,
      appId: 'system_preferences',
      appName: 'System Preferences',
      toolbar: {
        items: [
          { label: 'Show All', action: () => this.showAll() }
        ]
      }
    });

    this.windowId = windowId;
    this.initialize();
  }

  createSystemPrefsContent() {
    const container = document.createElement('div');
    container.style.height = '100%';
    container.style.overflow = 'auto';
    container.style.background = '#fff';

    // Categories
    const categories = [
      {
        name: 'Personal',
        prefs: [
          { id: 'general', name: 'General', icon: '⚙️' },
          { id: 'desktop', name: 'Desktop', icon: '🖥️' },
          { id: 'dock', name: 'Dock', icon: '📦' },
          { id: 'language', name: 'International', icon: '🌍' }
        ]
      },
      {
        name: 'Hardware',
        prefs: [
          { id: 'displays', name: 'Displays', icon: '🖥️' },
          { id: 'sound', name: 'Sound', icon: '🔊' },
          { id: 'keyboard', name: 'Keyboard', icon: '⌨️' },
          { id: 'mouse', name: 'Mouse', icon: '🖱️' }
        ]
      },
      {
        name: 'Internet & Network',
        prefs: [
          { id: 'network', name: 'Network', icon: '🌐' },
          { id: 'sharing', name: 'Sharing', icon: '🔄' }
        ]
      },
      {
        name: 'System',
        prefs: [
          { id: 'accounts', name: 'Users', icon: '👤' },
          { id: 'date', name: 'Date & Time', icon: '🕐' },
          { id: 'software_update', name: 'Software Update', icon: '⬇️' },
          { id: 'startup', name: 'Startup Disk', icon: '💾' }
        ]
      }
    ];

    categories.forEach(category => {
      // Category header
      const header = document.createElement('div');
      header.style.padding = '12px 20px 8px 20px';
      header.style.fontSize = '11px';
      header.style.fontWeight = 'bold';
      header.style.color = '#666';
      header.style.borderBottom = '1px solid #E0E0E0';
      header.style.background = 'linear-gradient(to bottom, #F5F5F5 0%, #E8E8E8 100%)';
      header.textContent = category.name;
      container.appendChild(header);

      // Preferences grid
      const grid = document.createElement('div');
      grid.className = 'sysprefs-grid';
      grid.style.borderBottom = '1px solid #E0E0E0';

      category.prefs.forEach(pref => {
        const item = document.createElement('div');
        item.className = 'sysprefs-item';
        item.dataset.prefId = pref.id;

        const icon = document.createElement('div');
        icon.className = 'sysprefs-icon';
        icon.style.fontSize = '48px';
        icon.textContent = pref.icon;
        item.appendChild(icon);

        const label = document.createElement('div');
        label.className = 'sysprefs-label';
        label.textContent = pref.name;
        item.appendChild(label);

        item.addEventListener('click', () => {
          this.openPreferencePane(pref);
        });

        grid.appendChild(item);
      });

      container.appendChild(grid);
    });

    return container;
  }

  initialize() {
    // Nothing to initialize for now
  }

  showAll() {
    // Already showing all - this is the main view
    console.log('Show All');
  }

  openPreferencePane(pref) {
    console.log('Opening preference pane:', pref.id);

    let content = '';

    switch (pref.id) {
      case 'general':
        content = this.createGeneralPane();
        break;
      case 'desktop':
        content = this.createDesktopPane();
        break;
      case 'dock':
        content = this.createDockPane();
        break;
      case 'displays':
        content = this.createDisplaysPane();
        break;
      case 'sound':
        content = this.createSoundPane();
        break;
      default:
        content = this.createGenericPane(pref);
    }

    // Update window content
    const windowEl = document.getElementById(this.windowId);
    if (windowEl) {
      const contentEl = windowEl.querySelector('.window-content');
      if (contentEl) {
        contentEl.innerHTML = '';
        contentEl.appendChild(content);
      }

      const titleEl = windowEl.querySelector('.window-title');
      if (titleEl) {
        titleEl.textContent = pref.name;
      }
    }
  }

  createGeneralPane() {
    const container = document.createElement('div');
    container.style.padding = '20px';

    container.innerHTML = `
      <div style="font-family: 'Lucida Grande', sans-serif;">
        <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: bold;">General</h3>

        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-size: 13px;">Appearance:</label>
          <select class="aqua-input" style="width: 200px;">
            <option>Blue</option>
            <option>Graphite</option>
          </select>
        </div>

        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-size: 13px;">Highlight Color:</label>
          <select class="aqua-input" style="width: 200px;">
            <option>Blue</option>
            <option>Purple</option>
            <option>Pink</option>
            <option>Red</option>
            <option>Orange</option>
            <option>Yellow</option>
            <option>Green</option>
          </select>
        </div>

        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-size: 13px;">
            <input type="checkbox" class="aqua-checkbox" checked>
            Use smooth scrolling
          </label>
        </div>

        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-size: 13px;">
            <input type="checkbox" class="aqua-checkbox" checked>
            Minimize when double clicking a window title bar
          </label>
        </div>

        <div style="margin-top: 30px;">
          <button class="aqua-button" onclick="window.macosx.windowSystem.closeWindow('${this.windowId}')">
            Close
          </button>
        </div>
      </div>
    `;

    return container;
  }

  createDesktopPane() {
    const container = document.createElement('div');
    container.style.padding = '20px';

    container.innerHTML = `
      <div style="font-family: 'Lucida Grande', sans-serif;">
        <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: bold;">Desktop</h3>

        <div style="margin-bottom: 20px;">
          <div style="margin-bottom: 12px; font-size: 13px; font-weight: bold;">Desktop Picture:</div>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 12px;">
            <div style="width: 100%; aspect-ratio: 4/3; background: linear-gradient(180deg, #5B9BD5 0%, #1E5A8E 100%); border: 2px solid #4A90E2; border-radius: 4px;"></div>
            <div style="width: 100%; aspect-ratio: 4/3; background: linear-gradient(180deg, #7B68EE 0%, #483D8B 100%); border: 1px solid #999; border-radius: 4px; cursor: pointer;"></div>
            <div style="width: 100%; aspect-ratio: 4/3; background: linear-gradient(180deg, #20B2AA 0%, #008B8B 100%); border: 1px solid #999; border-radius: 4px; cursor: pointer;"></div>
            <div style="width: 100%; aspect-ratio: 4/3; background: linear-gradient(180deg, #87CEEB 0%, #4682B4 100%); border: 1px solid #999; border-radius: 4px; cursor: pointer;"></div>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-size: 13px;">
            <input type="checkbox" class="aqua-checkbox" checked>
            Change picture every 30 minutes
          </label>
        </div>

        <div style="margin-top: 30px;">
          <button class="aqua-button primary" onclick="alert('Desktop settings applied! (Demo mode)')">
            Apply
          </button>
          <button class="aqua-button" onclick="window.macosx.windowSystem.closeWindow('${this.windowId}')">
            Cancel
          </button>
        </div>
      </div>
    `;

    return container;
  }

  createDockPane() {
    const container = document.createElement('div');
    container.style.padding = '20px';

    container.innerHTML = `
      <div style="font-family: 'Lucida Grande', sans-serif;">
        <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: bold;">Dock</h3>

        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-size: 13px;">Dock Size:</label>
          <input type="range" min="16" max="128" value="48" style="width: 300px;">
        </div>

        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-size: 13px;">Magnification:</label>
          <input type="range" min="16" max="128" value="72" style="width: 300px;">
          <label style="margin-left: 10px;">
            <input type="checkbox" class="aqua-checkbox" checked>
            Enable
          </label>
        </div>

        <div style="margin-bottom: 20px;">
          <div style="margin-bottom: 8px; font-size: 13px;">Position on screen:</div>
          <label style="display: block; margin-bottom: 4px;">
            <input type="radio" name="dock-position" value="left">
            Left
          </label>
          <label style="display: block; margin-bottom: 4px;">
            <input type="radio" name="dock-position" value="bottom" checked>
            Bottom
          </label>
          <label style="display: block;">
            <input type="radio" name="dock-position" value="right">
            Right
          </label>
        </div>

        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-size: 13px;">
            <input type="checkbox" class="aqua-checkbox">
            Automatically hide and show the Dock
          </label>
        </div>

        <div style="margin-top: 30px;">
          <button class="aqua-button" onclick="window.macosx.windowSystem.closeWindow('${this.windowId}')">
            Close
          </button>
        </div>
      </div>
    `;

    return container;
  }

  createDisplaysPane() {
    const container = document.createElement('div');
    container.style.padding = '20px';

    container.innerHTML = `
      <div style="font-family: 'Lucida Grande', sans-serif;">
        <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: bold;">Displays</h3>

        <div style="margin-bottom: 20px;">
          <div style="margin-bottom: 12px; font-size: 13px; font-weight: bold;">Resolutions:</div>
          <div class="aqua-list" style="height: 200px;">
            <div class="aqua-list-item selected">1024 x 768, Millions</div>
            <div class="aqua-list-item">800 x 600, Millions</div>
            <div class="aqua-list-item">640 x 480, Millions</div>
            <div class="aqua-list-item">1024 x 768, Thousands</div>
            <div class="aqua-list-item">800 x 600, Thousands</div>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-size: 13px;">Colors:</label>
          <select class="aqua-input" style="width: 200px;">
            <option>Millions</option>
            <option>Thousands</option>
            <option>256</option>
          </select>
        </div>

        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-size: 13px;">Refresh Rate:</label>
          <select class="aqua-input" style="width: 200px;">
            <option>75 Hz</option>
            <option>60 Hz</option>
          </select>
        </div>

        <div style="margin-top: 30px;">
          <button class="aqua-button" onclick="window.macosx.windowSystem.closeWindow('${this.windowId}')">
            Close
          </button>
        </div>
      </div>
    `;

    return container;
  }

  createSoundPane() {
    const container = document.createElement('div');
    container.style.padding = '20px';

    container.innerHTML = `
      <div style="font-family: 'Lucida Grande', sans-serif;">
        <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: bold;">Sound</h3>

        <div style="margin-bottom: 20px;">
          <div style="margin-bottom: 8px; font-size: 13px; font-weight: bold;">Alert volume:</div>
          <input type="range" min="0" max="100" value="75" style="width: 300px;">
        </div>

        <div style="margin-bottom: 20px;">
          <div style="margin-bottom: 8px; font-size: 13px; font-weight: bold;">Alert sound:</div>
          <div class="aqua-list" style="height: 150px;">
            <div class="aqua-list-item">Basso</div>
            <div class="aqua-list-item selected">Funk</div>
            <div class="aqua-list-item">Glass</div>
            <div class="aqua-list-item">Hero</div>
            <div class="aqua-list-item">Sosumi</div>
            <div class="aqua-list-item">Pop</div>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <div style="margin-bottom: 8px; font-size: 13px; font-weight: bold;">Output volume:</div>
          <input type="range" min="0" max="100" value="50" style="width: 300px;">
          <label style="margin-left: 10px;">
            <input type="checkbox" class="aqua-checkbox">
            Mute
          </label>
        </div>

        <div style="margin-top: 30px;">
          <button class="aqua-button" onclick="window.macosx.windowSystem.closeWindow('${this.windowId}')">
            Close
          </button>
        </div>
      </div>
    `;

    return container;
  }

  createGenericPane(pref) {
    const container = document.createElement('div');
    container.style.padding = '40px';
    container.style.textAlign = 'center';

    container.innerHTML = `
      <div style="font-family: 'Lucida Grande', sans-serif;">
        <div style="font-size: 48px; margin-bottom: 20px;">${pref.icon}</div>
        <h3 style="margin: 0 0 20px 0; font-size: 18px;">${pref.name}</h3>
        <p style="color: #666; font-size: 13px; margin-bottom: 30px;">
          This preference pane is not yet implemented in this demo.
        </p>
        <button class="aqua-button primary" onclick="window.macosx.windowSystem.closeWindow('${this.windowId}')">
          OK
        </button>
      </div>
    `;

    return container;
  }
}

// Make available globally
window.MacOSXSystemPreferences = MacOSXSystemPreferences;
