/**
 * Windows 7 Explorer (Libraries View)
 * File explorer with Windows 7 features
 */

class Win7Explorer {
  constructor(desktop, initialPath = 'Computer') {
    this.desktop = desktop;
    this.currentPath = initialPath;
    this.history = [initialPath];
    this.historyIndex = 0;

    this.libraries = {
      'Computer': {
        icon: '💻',
        items: [
          { name: 'Local Disk (C:)', type: 'drive', icon: '💾', size: '465 GB free of 931 GB' },
          { name: 'DVD Drive (D:)', type: 'drive', icon: '📀', size: 'Empty' },
          { name: 'Removable Disk (E:)', type: 'drive', icon: '💿', size: '7.2 GB free of 8 GB' }
        ]
      },
      'Documents': {
        icon: '📄',
        items: [
          { name: 'Work Reports.docx', type: 'file', icon: '📄', size: '245 KB', modified: '11/10/2025' },
          { name: 'Resume.pdf', type: 'file', icon: '📕', size: '512 KB', modified: '11/8/2025' },
          { name: 'Projects', type: 'folder', icon: '📁', items: '12 items', modified: '11/9/2025' }
        ]
      },
      'Pictures': {
        icon: '🖼️',
        items: [
          { name: 'Vacation 2025', type: 'folder', icon: '📁', items: '48 items', modified: '10/15/2025' },
          { name: 'Family Photos', type: 'folder', icon: '📁', items: '124 items', modified: '9/22/2025' },
          { name: 'Screenshot.png', type: 'file', icon: '🖼️', size: '1.2 MB', modified: '11/11/2025' }
        ]
      },
      'Music': {
        icon: '🎵',
        items: [
          { name: 'Playlist.m3u', type: 'file', icon: '🎵', size: '4 KB', modified: '10/1/2025' },
          { name: 'Albums', type: 'folder', icon: '📁', items: '32 items', modified: '9/15/2025' }
        ]
      },
      'Videos': {
        icon: '🎬',
        items: [
          { name: 'Home Videos', type: 'folder', icon: '📁', items: '8 items', modified: '10/20/2025' }
        ]
      },
      'Downloads': {
        icon: '⬇️',
        items: [
          { name: 'Setup.exe', type: 'file', icon: '⚙️', size: '25 MB', modified: '11/11/2025' },
          { name: 'Document.zip', type: 'file', icon: '🗜️', size: '3.4 MB', modified: '11/10/2025' }
        ]
      },
      'Network': {
        icon: '🌐',
        items: [
          { name: 'WORKGROUP', type: 'network', icon: '🖥️', items: '2 computers' }
        ]
      },
      'Recycle Bin': {
        icon: '🗑️',
        items: [
          { name: 'Old Document.txt', type: 'file', icon: '📄', size: '8 KB', deleted: '11/9/2025' }
        ]
      }
    };
  }

  /**
   * Render Explorer window content
   * @returns {HTMLElement} - Content element
   */
  render() {
    const container = document.createElement('div');
    container.className = 'win7-explorer';

    // Create toolbar
    const toolbar = this.createToolbar();
    container.appendChild(toolbar);

    // Create address bar
    const addressBar = this.createAddressBar();
    container.appendChild(addressBar);

    // Create main content area
    const mainContent = document.createElement('div');
    mainContent.style.display = 'flex';
    mainContent.style.height = 'calc(100% - 88px)';

    // Create navigation pane
    const navPane = this.createNavigationPane();
    mainContent.appendChild(navPane);

    // Create file list
    const fileList = this.createFileList();
    mainContent.appendChild(fileList);

    container.appendChild(mainContent);

    // Create status bar
    const statusBar = this.createStatusBar();
    container.appendChild(statusBar);

    return container;
  }

  /**
   * Create toolbar
   * @returns {HTMLElement} - Toolbar element
   */
  createToolbar() {
    const toolbar = document.createElement('div');
    toolbar.className = 'win7-toolbar';

    const buttons = [
      { icon: '◀', label: 'Back', action: () => this.navigateBack() },
      { icon: '▶', label: 'Forward', action: () => this.navigateForward() },
      { separator: true },
      { icon: '↻', label: 'Refresh', action: () => this.refresh() },
      { separator: true },
      { icon: '📁', label: 'Organize', action: () => console.log('Organize') },
      { icon: '📋', label: 'New folder', action: () => this.createNewFolder() }
    ];

    buttons.forEach(btn => {
      if (btn.separator) {
        const sep = document.createElement('div');
        sep.style.width = '1px';
        sep.style.height = '24px';
        sep.style.background = '#D0D0D0';
        sep.style.margin = '0 4px';
        toolbar.appendChild(sep);
      } else {
        const button = document.createElement('button');
        button.className = 'win7-toolbar-btn';
        button.textContent = btn.icon;
        button.title = btn.label;
        button.addEventListener('click', btn.action);
        toolbar.appendChild(button);
      }
    });

    return toolbar;
  }

  /**
   * Create address bar
   * @returns {HTMLElement} - Address bar element
   */
  createAddressBar() {
    const addressBar = document.createElement('div');
    addressBar.className = 'win7-addressbar';

    // Breadcrumb navigation
    const breadcrumb = document.createElement('div');
    breadcrumb.className = 'win7-addressbar-breadcrumb';

    const pathParts = this.currentPath.split('\\').filter(p => p);
    if (pathParts.length === 0) {
      pathParts.push(this.currentPath);
    }

    pathParts.forEach((part, index) => {
      if (index > 0) {
        const arrow = document.createElement('span');
        arrow.className = 'win7-addressbar-arrow';
        arrow.textContent = '▶';
        breadcrumb.appendChild(arrow);
      }

      const item = document.createElement('span');
      item.className = 'win7-addressbar-item';
      item.textContent = part;
      item.addEventListener('click', () => {
        const newPath = pathParts.slice(0, index + 1).join('\\');
        this.navigate(newPath);
      });
      breadcrumb.appendChild(item);
    });

    addressBar.appendChild(breadcrumb);

    // Search box
    const searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.placeholder = `Search ${this.currentPath}`;
    searchBox.style.cssText = `
      margin-left: auto;
      padding: 4px 8px;
      border: 1px solid #D0D0D0;
      border-radius: 3px;
      font-size: 11px;
      width: 180px;
    `;
    addressBar.appendChild(searchBox);

    return addressBar;
  }

  /**
   * Create navigation pane
   * @returns {HTMLElement} - Navigation pane element
   */
  createNavigationPane() {
    const navPane = document.createElement('div');
    navPane.style.cssText = `
      width: 200px;
      border-right: 1px solid #D0D0D0;
      overflow-y: auto;
      background: #F6F6F6;
    `;

    const sections = [
      {
        title: 'Favorites',
        items: ['Desktop', 'Downloads', 'Recent Places']
      },
      {
        title: 'Libraries',
        items: ['Documents', 'Music', 'Pictures', 'Videos']
      },
      {
        title: 'Computer',
        items: ['Computer', 'Network']
      }
    ];

    sections.forEach(section => {
      const header = document.createElement('div');
      header.style.cssText = `
        padding: 6px 12px;
        font-size: 11px;
        font-weight: 600;
        color: #666;
        background: #E8E8E8;
        border-top: 1px solid #D0D0D0;
        border-bottom: 1px solid #D0D0D0;
      `;
      header.textContent = section.title;
      navPane.appendChild(header);

      section.items.forEach(item => {
        const navItem = document.createElement('div');
        navItem.style.cssText = `
          padding: 4px 20px;
          font-size: 11px;
          cursor: pointer;
          transition: background 0.15s ease;
        `;
        navItem.textContent = item;

        navItem.addEventListener('mouseenter', () => {
          navItem.style.background = 'rgba(77, 166, 255, 0.15)';
        });

        navItem.addEventListener('mouseleave', () => {
          navItem.style.background = 'transparent';
        });

        navItem.addEventListener('click', () => {
          this.navigate(item);
        });

        navPane.appendChild(navItem);
      });
    });

    return navPane;
  }

  /**
   * Create file list
   * @returns {HTMLElement} - File list element
   */
  createFileList() {
    const fileList = document.createElement('div');
    fileList.style.cssText = `
      flex: 1;
      padding: 12px;
      overflow-y: auto;
    `;

    const library = this.libraries[this.currentPath] || { items: [] };

    if (library.items.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.style.cssText = `
        padding: 40px;
        text-align: center;
        color: #666;
        font-size: 14px;
      `;
      emptyMsg.textContent = 'This folder is empty.';
      fileList.appendChild(emptyMsg);
      return fileList;
    }

    // Create grid layout for files
    const grid = document.createElement('div');
    grid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 16px;
      padding: 8px;
    `;

    library.items.forEach(item => {
      const fileItem = this.createFileItem(item);
      grid.appendChild(fileItem);
    });

    fileList.appendChild(grid);

    return fileList;
  }

  /**
   * Create file item
   * @param {Object} item - Item configuration
   * @returns {HTMLElement} - File item element
   */
  createFileItem(item) {
    const fileItem = document.createElement('div');
    fileItem.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.15s ease;
    `;

    const icon = document.createElement('div');
    icon.style.cssText = `
      font-size: 48px;
      margin-bottom: 4px;
    `;
    icon.textContent = item.icon;

    const name = document.createElement('div');
    name.style.cssText = `
      font-size: 11px;
      text-align: center;
      word-break: break-word;
      max-width: 100%;
    `;
    name.textContent = item.name;

    const details = document.createElement('div');
    details.style.cssText = `
      font-size: 10px;
      color: #666;
      text-align: center;
      margin-top: 2px;
    `;
    details.textContent = item.size || item.items || '';

    fileItem.appendChild(icon);
    fileItem.appendChild(name);
    fileItem.appendChild(details);

    fileItem.addEventListener('mouseenter', () => {
      fileItem.style.background = 'rgba(77, 166, 255, 0.15)';
    });

    fileItem.addEventListener('mouseleave', () => {
      fileItem.style.background = 'transparent';
    });

    // Double-click to open
    let clickCount = 0;
    let clickTimer = null;

    fileItem.addEventListener('click', () => {
      clickCount++;
      if (clickCount === 1) {
        clickTimer = setTimeout(() => {
          clickCount = 0;
        }, 300);
      } else if (clickCount === 2) {
        clearTimeout(clickTimer);
        clickCount = 0;
        this.openItem(item);
      }
    });

    return fileItem;
  }

  /**
   * Create status bar
   * @returns {HTMLElement} - Status bar element
   */
  createStatusBar() {
    const statusBar = document.createElement('div');
    statusBar.className = 'win7-statusbar';

    const library = this.libraries[this.currentPath] || { items: [] };
    statusBar.textContent = `${library.items.length} items`;

    return statusBar;
  }

  /**
   * Navigate to path
   * @param {string} path - Path to navigate to
   */
  navigate(path) {
    this.currentPath = path;
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(path);
    this.historyIndex = this.history.length - 1;
    this.refresh();
  }

  /**
   * Navigate back
   */
  navigateBack() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.currentPath = this.history[this.historyIndex];
      this.refresh();
    }
  }

  /**
   * Navigate forward
   */
  navigateForward() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.currentPath = this.history[this.historyIndex];
      this.refresh();
    }
  }

  /**
   * Refresh view
   */
  refresh() {
    // In a real implementation, this would reload the current view
    console.log('Refresh:', this.currentPath);
  }

  /**
   * Open item
   * @param {Object} item - Item to open
   */
  openItem(item) {
    if (item.type === 'folder' || item.type === 'drive') {
      this.navigate(item.name);
    } else {
      console.log('Open file:', item.name);
    }
  }

  /**
   * Create new folder
   */
  createNewFolder() {
    console.log('Create new folder');
  }

  /**
   * Open Explorer window
   */
  open() {
    this.desktop.createWindow({
      title: this.currentPath,
      icon: this.libraries[this.currentPath]?.icon || '📁',
      width: 900,
      height: 600,
      content: this.render(),
      appId: 'explorer'
    });
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Win7Explorer;
}
