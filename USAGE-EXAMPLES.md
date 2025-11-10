# Window Management System - Usage Examples

## Quick Start

### 1. Include Required Files

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="/assets/css/window-system.css">
</head>
<body>
  <!-- Your content -->

  <script src="/assets/js/window-manager.js"></script>
  <script src="/assets/js/menu-system.js"></script>
  <script src="/assets/js/desktop.js"></script>
  <script src="/assets/js/main.js"></script>
</body>
</html>
```

### 2. Create Your First Window

```javascript
RetroOS.createWindow({
  title: 'My First Window',
  content: '<h2>Hello World!</h2><p>This is my first window.</p>',
  width: 400,
  height: 300
});
```

---

## Basic Examples

### Simple Notification

```javascript
RetroOS.notify('Success', 'Operation completed successfully!');
```

### Confirmation Dialog

```javascript
RetroOS.confirm(
  'Delete Item',
  'Are you sure you want to delete this item?',
  () => {
    console.log('Deleted!');
    // Perform delete action
  },
  () => {
    console.log('Cancelled');
  }
);
```

### Window with Custom Position

```javascript
RetroOS.createWindow({
  title: 'Top Left Window',
  content: '<p>I appear in the top-left corner</p>',
  width: 300,
  height: 200,
  x: 20,
  y: 20
});
```

### Non-Resizable Window

```javascript
RetroOS.createWindow({
  title: 'Fixed Size',
  content: '<p>You cannot resize me</p>',
  width: 250,
  height: 150,
  resizable: false,
  maximizable: false
});
```

---

## Application Examples

### Text Editor

```javascript
RetroOS.createWindow({
  id: 'notepad',
  title: 'Untitled - Notepad',
  content: `
    <div style="height: 100%; display: flex; flex-direction: column;">
      <textarea
        id="notepad-text"
        style="flex: 1; border: none; padding: 8px; font-family: monospace; resize: none;"
        placeholder="Start typing..."></textarea>
      <div style="display: flex; gap: 4px; padding: 4px; background: #f0f0f0;">
        <button class="btn" onclick="saveFile()">Save</button>
        <button class="btn" onclick="clearText()">Clear</button>
      </div>
    </div>
  `,
  width: 600,
  height: 400,
  onClose: (win) => {
    const text = document.getElementById('notepad-text').value;
    if (text.length > 0) {
      RetroOS.confirm(
        'Unsaved Changes',
        'You have unsaved changes. Close anyway?',
        () => true,
        () => false
      );
      return false; // Prevent close until confirmed
    }
    return true;
  }
});

function saveFile() {
  const text = document.getElementById('notepad-text').value;
  localStorage.setItem('notepad-content', text);
  RetroOS.notify('Saved', 'File saved successfully!');
}

function clearText() {
  document.getElementById('notepad-text').value = '';
}
```

### Calculator

```javascript
let calcDisplay = '0';
let calcMemory = 0;

RetroOS.createWindow({
  id: 'calculator',
  title: 'Calculator',
  content: `
    <div style="padding: 8px; width: 220px;">
      <div style="background: #000; color: #0f0; padding: 8px; margin-bottom: 8px; text-align: right; font-family: monospace; font-size: 18px;">
        <div id="calc-display">0</div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px;">
        ${[
          '7','8','9','/',
          '4','5','6','*',
          '1','2','3','-',
          '0','.','=','+'
        ].map(btn => `<button class="btn" onclick="calcPress('${btn}')">${btn}</button>`).join('')}
      </div>
      <button class="btn" style="width: 100%; margin-top: 4px;" onclick="calcPress('C')">Clear</button>
    </div>
  `,
  width: 250,
  height: 300,
  resizable: false,
  maximizable: false
});

function calcPress(key) {
  const display = document.getElementById('calc-display');
  if (!display) return;

  if (key === 'C') {
    calcDisplay = '0';
  } else if (key === '=') {
    try {
      calcDisplay = eval(calcDisplay).toString();
    } catch (e) {
      calcDisplay = 'Error';
    }
  } else {
    if (calcDisplay === '0' && key !== '.') {
      calcDisplay = key;
    } else {
      calcDisplay += key;
    }
  }

  display.textContent = calcDisplay;
}
```

### Image Viewer

```javascript
function openImage(imageUrl, imageName) {
  RetroOS.createWindow({
    id: `image-${imageName}`,
    title: `${imageName} - Image Viewer`,
    content: `
      <div style="height: 100%; display: flex; flex-direction: column;">
        <div style="flex: 1; overflow: auto; display: flex; align-items: center; justify-content: center; background: #000;">
          <img src="${imageUrl}" alt="${imageName}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
        </div>
        <div style="display: flex; gap: 4px; padding: 4px; background: #f0f0f0;">
          <button class="btn" onclick="zoomIn()">Zoom In</button>
          <button class="btn" onclick="zoomOut()">Zoom Out</button>
          <button class="btn" onclick="resetZoom()">Reset</button>
        </div>
      </div>
    `,
    width: 800,
    height: 600
  });
}

// Usage
openImage('/path/to/image.jpg', 'Photo.jpg');
```

### File Browser

```javascript
function createFileBrowser(path = '/') {
  const files = getFilesForPath(path); // Your file fetching logic

  RetroOS.createWindow({
    id: `browser-${path}`,
    title: `File Browser - ${path}`,
    content: `
      <div style="height: 100%; display: flex; flex-direction: column;">
        <div style="padding: 4px; background: #f0f0f0; border-bottom: 1px solid #ccc;">
          <button class="btn" onclick="navigateUp()">↑ Up</button>
          <span style="margin-left: 8px;">${path}</span>
        </div>
        <div style="flex: 1; overflow: auto;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #e0e0e0;">
                <th style="text-align: left; padding: 4px;">Name</th>
                <th style="text-align: left; padding: 4px;">Size</th>
                <th style="text-align: left; padding: 4px;">Modified</th>
              </tr>
            </thead>
            <tbody>
              ${files.map(file => `
                <tr style="cursor: pointer;" onclick="openFile('${file.path}', '${file.type}')">
                  <td style="padding: 4px;">${file.icon} ${file.name}</td>
                  <td style="padding: 4px;">${file.size}</td>
                  <td style="padding: 4px;">${file.modified}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `,
    width: 700,
    height: 500
  });
}

function openFile(path, type) {
  if (type === 'folder') {
    createFileBrowser(path);
  } else if (type === 'image') {
    openImage(path, path.split('/').pop());
  } else {
    RetroOS.notify('Info', `Opening ${path}`);
  }
}
```

---

## Menu System Examples

### Basic Menu Bar

```html
<div class="menu-bar">
  <div data-menu="file">File</div>
  <div data-menu="edit">Edit</div>
  <div data-menu="view">View</div>
</div>

<script>
  // File Menu
  const fileMenuTrigger = document.querySelector('[data-menu="file"]');
  RetroOS.createMenu({
    id: 'file-menu',
    label: 'File',
    trigger: fileMenuTrigger,
    items: [
      {
        label: 'New',
        icon: '📄',
        shortcut: 'Ctrl+N',
        action: () => createNewFile()
      },
      {
        label: 'Open',
        icon: '📂',
        shortcut: 'Ctrl+O',
        action: () => openFile()
      },
      { type: 'separator' },
      {
        label: 'Save',
        icon: '💾',
        shortcut: 'Ctrl+S',
        action: () => saveFile()
      },
      {
        label: 'Save As...',
        action: () => saveFileAs()
      },
      { type: 'separator' },
      {
        label: 'Exit',
        action: () => {
          RetroOS.confirm(
            'Exit',
            'Are you sure?',
            () => RetroOS.windowManager.closeAll()
          );
        }
      }
    ]
  });
</script>
```

### Menu with Submenus

```javascript
RetroOS.createMenu({
  id: 'file-menu',
  trigger: document.querySelector('[data-menu="file"]'),
  items: [
    {
      label: 'New',
      submenu: [
        {
          label: 'Text File',
          action: () => createNewFile('text')
        },
        {
          label: 'Folder',
          action: () => createNewFolder()
        },
        {
          label: 'Shortcut',
          action: () => createNewShortcut()
        }
      ]
    },
    {
      label: 'Open Recent',
      submenu: [
        { label: 'document1.txt', action: () => openFile('document1.txt') },
        { label: 'document2.txt', action: () => openFile('document2.txt') },
        { type: 'separator' },
        { label: 'Clear History', action: () => clearHistory() }
      ]
    }
  ]
});
```

---

## Desktop Icon Examples

### Basic Desktop Setup

```html
<div class="desktop-area" style="position: fixed; inset: 0;"></div>

<script>
  // Initialize desktop
  RetroOS.desktop.init('.desktop-area', {
    multiSelect: true,
    contextMenu: true
  });

  // Add icons
  RetroOS.addDesktopIcon({
    id: 'my-computer',
    label: 'My Computer',
    icon: '🖥️',
    x: 0,
    y: 0,
    onOpen: () => {
      RetroOS.createWindow({
        title: 'My Computer',
        content: '<h2>Computer</h2><p>Drives and devices</p>',
        width: 500,
        height: 400
      });
    }
  });

  RetroOS.addDesktopIcon({
    id: 'documents',
    label: 'My Documents',
    icon: '📁',
    x: 0,
    y: 1,
    onOpen: () => createFileBrowser('/documents')
  });

  RetroOS.addDesktopIcon({
    id: 'recycle-bin',
    label: 'Recycle Bin',
    icon: '🗑️',
    x: 0,
    y: 2,
    onOpen: () => openRecycleBin()
  });
</script>
```

### Dynamic Icon Creation

```javascript
// Create application launcher icons from data
const applications = [
  { name: 'Calculator', icon: '🔢', action: openCalculator },
  { name: 'Notepad', icon: '📝', action: openNotepad },
  { name: 'Paint', icon: '🎨', action: openPaint },
  { name: 'Browser', icon: '🌐', action: openBrowser }
];

applications.forEach((app, index) => {
  RetroOS.addDesktopIcon({
    id: app.name.toLowerCase(),
    label: app.name,
    icon: app.icon,
    x: 1,
    y: index,
    onOpen: app.action
  });
});
```

### Icon with Custom Context Menu

```javascript
RetroOS.addDesktopIcon({
  id: 'custom-icon',
  label: 'Custom App',
  icon: '⚙️',
  x: 0,
  y: 0,
  contextMenuItems: [
    {
      label: 'Open',
      action: (icon) => openApp()
    },
    {
      label: 'Properties',
      action: (icon) => showProperties(icon)
    },
    { type: 'separator' },
    {
      label: 'Delete',
      action: (icon) => {
        RetroOS.confirm(
          'Delete Icon',
          'Remove this icon?',
          () => RetroOS.desktop.removeIcon(icon.id)
        );
      }
    }
  ],
  onOpen: () => openApp()
});
```

---

## Advanced Patterns

### Multi-Window Application

```javascript
class MyApplication {
  constructor() {
    this.windows = [];
    this.createMainWindow();
  }

  createMainWindow() {
    const win = RetroOS.createWindow({
      id: 'app-main',
      title: 'My Application',
      content: `
        <div>
          <h2>Main Window</h2>
          <button class="btn" onclick="app.createChildWindow()">New Window</button>
          <button class="btn" onclick="app.closeAll()">Close All</button>
        </div>
      `,
      width: 400,
      height: 300,
      onClose: () => {
        this.closeAll();
      }
    });
    this.windows.push(win);
  }

  createChildWindow() {
    const win = RetroOS.createWindow({
      title: `Child Window ${this.windows.length}`,
      content: '<p>Child window content</p>',
      width: 300,
      height: 200
    });
    this.windows.push(win);
  }

  closeAll() {
    this.windows.forEach(win => {
      const w = RetroOS.windowManager.getWindow(win.id);
      if (w) w.close();
    });
    this.windows = [];
  }
}

// Create application instance
const app = new MyApplication();
```

### Window State Management

```javascript
class WindowStateManager {
  constructor(windowId) {
    this.windowId = windowId;
    this.data = {};
  }

  save() {
    localStorage.setItem(
      `app-state-${this.windowId}`,
      JSON.stringify(this.data)
    );
  }

  load() {
    const saved = localStorage.getItem(`app-state-${this.windowId}`);
    if (saved) {
      this.data = JSON.parse(saved);
    }
  }

  set(key, value) {
    this.data[key] = value;
    this.save();
  }

  get(key) {
    return this.data[key];
  }
}

// Usage
const state = new WindowStateManager('my-app');
state.load();

const initialText = state.get('text') || '';

RetroOS.createWindow({
  id: 'my-app',
  title: 'Stateful App',
  content: `<textarea id="app-text">${initialText}</textarea>`,
  onClose: () => {
    const text = document.getElementById('app-text').value;
    state.set('text', text);
  }
});
```

### Window Communication

```javascript
// Event bus for window communication
class WindowEventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }

  off(event, callback) {
    const callbacks = this.listeners.get(event) || [];
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }
}

const windowBus = new WindowEventBus();

// Window 1 - Sender
RetroOS.createWindow({
  id: 'sender',
  title: 'Sender',
  content: `
    <button class="btn" onclick="sendMessage()">Send Message</button>
  `
});

function sendMessage() {
  windowBus.emit('message', { text: 'Hello from sender!' });
}

// Window 2 - Receiver
RetroOS.createWindow({
  id: 'receiver',
  title: 'Receiver',
  content: `<div id="messages"></div>`
});

windowBus.on('message', (data) => {
  const messagesEl = document.getElementById('messages');
  if (messagesEl) {
    messagesEl.innerHTML += `<p>${data.text}</p>`;
  }
});
```

---

## Best Practices

### 1. Always Check Window Existence

```javascript
// Good
let win = RetroOS.windowManager.getWindow('my-window');
if (win) {
  win.focus();
} else {
  win = RetroOS.createWindow({
    id: 'my-window',
    title: 'My Window',
    content: '<p>Content</p>'
  });
}
```

### 2. Handle Window Close Events

```javascript
// Good
RetroOS.createWindow({
  title: 'Important Window',
  content: '<textarea id="important-data"></textarea>',
  onClose: (win) => {
    // Save data before closing
    const data = document.getElementById('important-data').value;
    if (data) {
      localStorage.setItem('saved-data', data);
    }
    return true; // Allow close
  }
});
```

### 3. Use Unique IDs for Singleton Windows

```javascript
// Good - prevents duplicate windows
function openSettings() {
  let settings = RetroOS.windowManager.getWindow('settings');
  if (settings) {
    settings.focus();
    return;
  }

  RetroOS.createWindow({
    id: 'settings',
    title: 'Settings',
    content: renderSettings()
  });
}
```

### 4. Clean Up Resources

```javascript
// Good
const intervalId = setInterval(() => updateData(), 1000);

RetroOS.createWindow({
  title: 'Live Data',
  content: '<div id="live-data"></div>',
  onClose: () => {
    clearInterval(intervalId); // Clean up
    return true;
  }
});
```

---

## Complete Example Application

See `/window-system-demo.html` for a fully functional example with:
- Calculator
- Notepad
- Paint application
- File browser
- Start menu
- Desktop icons
- Context menus
- Keyboard shortcuts

---

## Need Help?

See the complete API documentation in `WINDOW-SYSTEM-API.md` for detailed information on all methods and options.
