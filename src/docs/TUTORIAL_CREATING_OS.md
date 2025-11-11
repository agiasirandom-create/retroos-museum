# Tutorial: Creating a Complete OS with RetroOS Components

## Table of Contents
1. [Tutorial Goal](#tutorial-goal)
2. [Prerequisites](#prerequisites)
3. [Step-by-Step: Windows 98](#step-by-step-windows-98)
4. [Additional Examples](#additional-examples)
5. [Customization & Extensions](#customization--extensions)
6. [Troubleshooting](#troubleshooting)

---

## Tutorial Goal

In this tutorial, you'll build a fully functional Windows 98 operating system interface using the RetroOS Museum component library. The final result will include:

- Authentic Windows 98 window system with draggable, resizable windows
- Classic Windows 98 taskbar with Start button, clock, and system tray
- Working "desktop applications" (My Computer, Notepad, etc.)
- Start Menu integration
- Proper window/taskbar synchronization

**Expected Time**: 45-60 minutes
**Difficulty Level**: Intermediate

---

## Prerequisites

### Required Files

Ensure you have these component files:

```
/project
  /assets
    /js
      /components
        classic-windows.js
        windows-taskbar.js
```

### HTML Template

Create `windows98.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Windows 98</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'MS Sans Serif', 'Tahoma', Arial, sans-serif;
      overflow: hidden;
      background: #008080; /* Teal desktop */
    }

    #desktop {
      width: 100vw;
      height: 100vh;
      position: relative;
      background: #008080;
    }

    /* Desktop icons */
    .desktop-icon {
      position: absolute;
      width: 64px;
      text-align: center;
      cursor: pointer;
      user-select: none;
    }

    .desktop-icon-image {
      font-size: 32px;
      margin-bottom: 4px;
    }

    .desktop-icon-label {
      color: white;
      font-size: 11px;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
      background: transparent;
      padding: 2px 4px;
    }

    .desktop-icon.selected .desktop-icon-label {
      background: #000080;
    }
  </style>
</head>
<body>
  <div id="desktop"></div>

  <!-- Include components -->
  <script src="/assets/js/components/classic-windows.js"></script>
  <script src="/assets/js/components/windows-taskbar.js"></script>

  <!-- Main script -->
  <script src="/assets/js/windows98.js"></script>
</body>
</html>
```

### Knowledge Required

- Basic JavaScript (ES6+)
- DOM manipulation
- Event handling
- Understanding of callbacks

---

## Step-by-Step: Windows 98

### Step 1: Set Up HTML Structure

Already completed in prerequisites. Your HTML should have:
- `#desktop` container
- Component script includes
- Basic styling

---

### Step 2: Initialize Window System

Create `/assets/js/windows98.js`:

```javascript
// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing Windows 98...');

  // Get desktop container
  const desktop = document.getElementById('desktop');

  // Initialize window system
  const windowSystem = new ClassicWindowsSystem({
    style: 'win98',
    titleBarGradient: false, // Win98 uses solid colors
    borderWidth: 2,
    colors: {
      titleBarActive: '#000080',     // Classic blue
      titleBarInactive: '#808080',   // Gray
      titleBarTextActive: '#ffffff',
      titleBarTextInactive: '#c0c0c0',
      background: '#c0c0c0',
      border: '#c0c0c0',
      borderHighlight: '#ffffff',
      borderShadow: '#808080',
      borderDarkShadow: '#000000'
    }
  });

  console.log('Window system initialized');

  // Store globally for easy access
  window.win98 = {
    desktop,
    windowSystem,
    windows: {} // Track our windows
  };
});
```

**What This Does:**
- Waits for DOM to be ready
- Creates window system with Windows 98 styling
- Stores references globally for other functions to use

---

### Step 3: Initialize Taskbar

Add to `windows98.js` after window system initialization:

```javascript
// Initialize taskbar
const taskbar = new WindowsTaskbar();
taskbar.initialize(desktop, {
  mode: '98',
  position: 'bottom',
  height: 28,
  autoHide: false,
  showClock: true,
  showQuickLaunch: true,
  showSystemTray: true
});

console.log('Taskbar initialized');

// Store taskbar reference
window.win98.taskbar = taskbar;
```

**What This Does:**
- Creates Windows 98 style taskbar
- Positions it at bottom of screen
- Enables clock, quick launch, and system tray

**You Should See:**
- Gray taskbar at bottom with Start button
- Clock displaying current time
- Quick launch area with icons

---

### Step 4: Create Desktop Icons

Add this code:

```javascript
// Desktop icon data
const desktopIcons = [
  { id: 'my-computer', label: 'My Computer', icon: '💻', x: 20, y: 20 },
  { id: 'network', label: 'Network Neighborhood', icon: '🌐', x: 20, y: 100 },
  { id: 'recycle-bin', label: 'Recycle Bin', icon: '🗑️', x: 20, y: 180 },
  { id: 'my-documents', label: 'My Documents', icon: '📁', x: 20, y: 260 }
];

// Create desktop icons
desktopIcons.forEach(iconData => {
  const icon = document.createElement('div');
  icon.className = 'desktop-icon';
  icon.dataset.iconId = iconData.id;
  icon.style.left = `${iconData.x}px`;
  icon.style.top = `${iconData.y}px`;

  icon.innerHTML = `
    <div class="desktop-icon-image">${iconData.icon}</div>
    <div class="desktop-icon-label">${iconData.label}</div>
  `;

  // Double-click to open
  icon.addEventListener('dblclick', () => {
    openApplication(iconData.id);
  });

  // Single click to select
  icon.addEventListener('click', () => {
    document.querySelectorAll('.desktop-icon').forEach(i => {
      i.classList.remove('selected');
    });
    icon.classList.add('selected');
  });

  desktop.appendChild(icon);
});

console.log('Desktop icons created');
```

**You Should See:**
- 4 desktop icons on left side of screen
- Icons selectable with single click (blue highlight)
- Double-click ready to open applications

---

### Step 5: Create Window Helper Function

This function creates integrated windows that sync with taskbar:

```javascript
// Helper function to create synchronized windows
function createIntegratedWindow(config) {
  const windowId = config.id;

  // Create window with event callbacks
  const windowElement = windowSystem.createWindow({
    ...config,

    // Handle minimize
    onMinimize: () => {
      taskbar.setActiveWindow(null);
      if (config.onMinimize) config.onMinimize();
    },

    // Handle focus
    onFocus: () => {
      taskbar.setActiveWindow(windowId);
      if (config.onFocus) config.onFocus();
    },

    // Handle close
    onClose: () => {
      // Call custom close handler if provided
      if (config.onClose) {
        const shouldClose = config.onClose();
        if (shouldClose === false) return false;
      }

      // Remove from taskbar
      taskbar.removeWindow(windowId);

      // Remove from our tracking
      delete window.win98.windows[windowId];

      return true; // Allow close
    }
  });

  // Add window to desktop
  desktop.appendChild(windowElement);

  // Add to taskbar
  taskbar.addWindow({
    id: windowId,
    title: config.title,
    icon: config.icon || '📄'
  });

  // Track window
  window.win98.windows[windowId] = {
    element: windowElement,
    config: config
  };

  return windowElement;
}
```

**What This Does:**
- Creates window with automatic taskbar integration
- Handles minimize/maximize/close events
- Keeps taskbar and windows in sync
- Tracks all open windows

---

### Step 6: Wire Up Taskbar Events

Connect taskbar to window system:

```javascript
// Listen for taskbar window activation
taskbar.elements.taskbar.addEventListener('taskbar:windowActivate', (e) => {
  const windowId = e.detail.windowId;
  const windowData = windowSystem.getWindow(windowId);

  if (windowData && windowData.isMinimized) {
    windowSystem.restoreWindow(windowId);
  }
});

// Listen for taskbar window minimize
taskbar.elements.taskbar.addEventListener('taskbar:windowMinimize', (e) => {
  const windowId = e.detail.windowId;
  windowSystem._minimizeWindow(windowId);
});

// Listen for Start menu toggle
taskbar.elements.taskbar.addEventListener('taskbar:startMenuToggle', (e) => {
  if (e.detail.open) {
    console.log('Start menu opened');
    // TODO: Show start menu
  } else {
    console.log('Start menu closed');
  }
});

console.log('Taskbar events wired');
```

**What This Does:**
- Clicking taskbar button restores minimized windows
- Clicking active window's button minimizes it
- Start button triggers start menu (placeholder for now)

---

### Step 7: Create Application Launchers

Implement the functions that open applications:

```javascript
// Application launchers
function openApplication(appId) {
  switch (appId) {
    case 'my-computer':
      openMyComputer();
      break;

    case 'recycle-bin':
      openRecycleBin();
      break;

    case 'my-documents':
      openMyDocuments();
      break;

    case 'notepad':
      openNotepad();
      break;

    case 'mspaint':
      openMSPaint();
      break;

    default:
      console.log('Unknown application:', appId);
  }
}

// My Computer
function openMyComputer() {
  // Check if already open
  if (window.win98.windows['my-computer']) {
    windowSystem._focusWindow('my-computer');
    return;
  }

  createIntegratedWindow({
    id: 'my-computer',
    title: 'My Computer',
    icon: '💻',
    width: 600,
    height: 400,
    menuItems: [
      { label: 'File', onClick: () => console.log('File menu') },
      { label: 'Edit', onClick: () => console.log('Edit menu') },
      { label: 'View', onClick: () => console.log('View menu') },
      { label: 'Help', onClick: () => console.log('Help menu') }
    ],
    content: `
      <div style="display: flex; height: 100%; background: white;">
        <!-- Toolbar -->
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 40px;
                    background: #c0c0c0; border-bottom: 1px solid #808080;
                    display: flex; align-items: center; padding: 0 8px; gap: 4px;">
          <button style="padding: 4px 8px;">Back</button>
          <button style="padding: 4px 8px;">Forward</button>
          <div style="flex: 1;"></div>
          <button style="padding: 4px 8px;">Search</button>
          <button style="padding: 4px 8px;">Folders</button>
        </div>

        <!-- Main content -->
        <div style="position: absolute; top: 40px; left: 0; right: 0; bottom: 0;
                    padding: 20px; display: grid; grid-template-columns: repeat(auto-fill, 80px);
                    gap: 20px; align-content: start;">
          <div style="text-align: center; cursor: pointer;" ondblclick="openApplication('my-documents')">
            <div style="font-size: 32px;">📁</div>
            <div style="font-size: 11px; margin-top: 4px;">My Documents</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 32px;">💾</div>
            <div style="font-size: 11px; margin-top: 4px;">(C:)</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 32px;">💿</div>
            <div style="font-size: 11px; margin-top: 4px;">(D:)</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 32px;">🖨️</div>
            <div style="font-size: 11px; margin-top: 4px;">Printers</div>
          </div>
        </div>
      </div>
    `,
    statusBar: 'My Computer'
  });
}

// Notepad
function openNotepad() {
  const notepadId = `notepad-${Date.now()}`;

  createIntegratedWindow({
    id: notepadId,
    title: 'Untitled - Notepad',
    icon: '📝',
    width: 500,
    height: 400,
    menuItems: [
      { label: 'File', onClick: () => console.log('File menu') },
      { label: 'Edit', onClick: () => console.log('Edit menu') },
      { label: 'Search', onClick: () => console.log('Search menu') },
      { label: 'Help', onClick: () => console.log('Help menu') }
    ],
    content: `
      <textarea style="width: 100%; height: 100%; border: none;
                       font-family: 'Courier New', monospace; font-size: 12px;
                       padding: 4px; resize: none; outline: none;"
                placeholder="Type here..."></textarea>
    `,
    onClose: () => {
      const textarea = document.querySelector(`#${notepadId} textarea`);
      if (textarea && textarea.value.trim()) {
        return confirm('Save changes to Untitled?');
      }
      return true;
    }
  });
}

// MS Paint
function openMSPaint() {
  const paintId = `mspaint-${Date.now()}`;

  createIntegratedWindow({
    id: paintId,
    title: 'Untitled - Paint',
    icon: '🎨',
    width: 640,
    height: 480,
    menuItems: [
      { label: 'File', onClick: () => console.log('File') },
      { label: 'Edit', onClick: () => console.log('Edit') },
      { label: 'View', onClick: () => console.log('View') },
      { label: 'Image', onClick: () => console.log('Image') },
      { label: 'Colors', onClick: () => console.log('Colors') },
      { label: 'Help', onClick: () => console.log('Help') }
    ],
    content: `
      <div style="height: 100%; display: flex; flex-direction: column; background: #c0c0c0;">
        <!-- Toolbar -->
        <div style="height: 50px; background: #c0c0c0; border-bottom: 1px solid #808080;
                    display: flex; align-items: center; padding: 0 8px; gap: 8px;">
          <div style="width: 24px; height: 24px; background: white; border: 1px solid black;
                      cursor: pointer;" title="Pencil">✏️</div>
          <div style="width: 24px; height: 24px; background: white; border: 1px solid black;
                      cursor: pointer;" title="Brush">🖌️</div>
          <div style="width: 24px; height: 24px; background: white; border: 1px solid black;
                      cursor: pointer;" title="Eraser">🧹</div>
          <div style="width: 24px; height: 24px; background: white; border: 1px solid black;
                      cursor: pointer;" title="Fill">🪣</div>
        </div>

        <!-- Canvas -->
        <div style="flex: 1; background: white; margin: 8px; border: 2px inset #808080;
                    position: relative; overflow: auto;">
          <canvas id="${paintId}-canvas" width="800" height="600"
                  style="background: white; cursor: crosshair;"></canvas>
        </div>
      </div>
    `
  });

  // Setup canvas drawing (simple example)
  setTimeout(() => {
    const canvas = document.getElementById(`${paintId}-canvas`);
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let isDrawing = false;

      canvas.addEventListener('mousedown', () => { isDrawing = true; });
      canvas.addEventListener('mouseup', () => { isDrawing = false; });
      canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.fillStyle = '#000000';
        ctx.fillRect(x, y, 2, 2);
      });
    }
  }, 100);
}

// Recycle Bin
function openRecycleBin() {
  if (window.win98.windows['recycle-bin']) {
    windowSystem._focusWindow('recycle-bin');
    return;
  }

  createIntegratedWindow({
    id: 'recycle-bin',
    title: 'Recycle Bin',
    icon: '🗑️',
    width: 500,
    height: 350,
    menuItems: [
      { label: 'File', onClick: () => {} },
      { label: 'Edit', onClick: () => {} },
      { label: 'View', onClick: () => {} }
    ],
    content: `
      <div style="height: 100%; background: white; padding: 20px; text-align: center;">
        <div style="font-size: 64px; margin-bottom: 20px;">🗑️</div>
        <div style="font-size: 14px; color: #666;">Recycle Bin is empty.</div>
      </div>
    `,
    statusBar: '0 objects'
  });
}

// My Documents
function openMyDocuments() {
  if (window.win98.windows['my-documents']) {
    windowSystem._focusWindow('my-documents');
    return;
  }

  createIntegratedWindow({
    id: 'my-documents',
    title: 'My Documents',
    icon: '📁',
    width: 600,
    height: 400,
    menuItems: [
      { label: 'File', onClick: () => {} },
      { label: 'Edit', onClick: () => {} },
      { label: 'View', onClick: () => {} }
    ],
    content: `
      <div style="height: 100%; background: white; padding: 20px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fill, 100px);
                    gap: 20px;">
          <div style="text-align: center; cursor: pointer;">
            <div style="font-size: 48px;">📄</div>
            <div style="font-size: 11px; margin-top: 4px;">Document.txt</div>
          </div>
          <div style="text-align: center; cursor: pointer;">
            <div style="font-size: 48px;">🖼️</div>
            <div style="font-size: 11px; margin-top: 4px;">Photo.jpg</div>
          </div>
        </div>
      </div>
    `,
    statusBar: '2 object(s)'
  });
}

console.log('Applications defined');
```

**What This Does:**
- Creates 5 different applications
- Each with appropriate content and styling
- MS Paint has functional drawing canvas
- Notepad asks to save if content exists
- Windows only open once (singleton pattern)

---

### Step 8: Add Quick Launch Icons

Quick launch icons for frequently used apps:

```javascript
// Add quick launch functionality
setTimeout(() => {
  const quickLaunchIcons = taskbar.elements.quickLaunch.querySelectorAll('.quick-launch-icon');

  if (quickLaunchIcons[0]) {
    quickLaunchIcons[0].title = 'Internet Explorer';
    quickLaunchIcons[0].addEventListener('click', () => {
      console.log('IE would open here');
    });
  }

  if (quickLaunchIcons[1]) {
    quickLaunchIcons[1].title = 'Outlook Express';
    quickLaunchIcons[1].addEventListener('click', () => {
      console.log('Outlook would open here');
    });
  }

  if (quickLaunchIcons[2]) {
    quickLaunchIcons[2].title = 'My Computer';
    quickLaunchIcons[2].addEventListener('click', () => {
      openMyComputer();
    });
  }
}, 500);
```

---

### Step 9: Test Your OS

Open `windows98.html` in your browser. You should be able to:

**✓ Desktop:**
- See teal background
- See 4 desktop icons on left
- Click icons to select (blue highlight)
- Double-click icons to open windows

**✓ Windows:**
- Drag windows by title bar
- Resize windows by edges/corners
- Minimize/maximize/close windows
- Use menu bar (logs to console)
- Multiple windows open simultaneously

**✓ Taskbar:**
- See Windows 98 style taskbar at bottom
- Start button present (click logs to console)
- Clock shows current time
- Quick launch icons present
- Window buttons appear when windows open
- Click window button to focus/minimize
- System tray icons present

**✓ Applications:**
- My Computer shows drives and folders
- Notepad has working textarea
- MS Paint has drawing canvas
- Recycle Bin shows empty state
- My Documents shows sample files

---

### Step 10: Polish and Refine

Add finishing touches:

```javascript
// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Alt+F4: Close active window
  if (e.altKey && e.key === 'F4') {
    e.preventDefault();
    const activeId = windowSystem.activeWindow;
    if (activeId) {
      windowSystem._closeWindow(activeId);
    }
  }

  // Ctrl+N: New Notepad
  if (e.ctrlKey && e.key === 'n') {
    e.preventDefault();
    openNotepad();
  }
});

// Clear desktop selection on desktop click
desktop.addEventListener('click', (e) => {
  if (e.target === desktop) {
    document.querySelectorAll('.desktop-icon').forEach(icon => {
      icon.classList.remove('selected');
    });
  }
});

// Right-click desktop context menu (placeholder)
desktop.addEventListener('contextmenu', (e) => {
  if (e.target === desktop) {
    e.preventDefault();
    console.log('Desktop context menu would open here');
  }
});

console.log('Windows 98 fully initialized!');
```

---

## Additional Examples

### Example 2: Creating Mac OS 9

Create `macos9.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Mac OS 9</title>
  <style>
    body {
      margin: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23007777"/></svg>');
      font-family: 'Chicago', 'Charcoal', 'Geneva', sans-serif;
    }

    #desktop {
      width: 100vw;
      height: 100vh;
      position: relative;
    }
  </style>
</head>
<body>
  <div id="desktop"></div>

  <script src="/assets/js/components/mac-classic.js"></script>
  <script src="/assets/js/macos9.js"></script>
</body>
</html>
```

JavaScript (`macos9.js`):

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const desktop = document.getElementById('desktop');

  // Initialize Mac Classic window system
  const windowSystem = new MacClassicSystem({
    style: 'platinum',
    usePinstripes: true,
    useRoundedCorners: true
  });

  // Create Finder window
  const finderWindow = windowSystem.createWindow({
    id: 'finder',
    title: 'Macintosh HD',
    width: 500,
    height: 400,
    collapsable: true,
    zoomable: true,
    content: `
      <div style="padding: 20px; background: white; height: 100%;">
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
          <div style="text-align: center;">
            <div style="font-size: 48px;">🗂️</div>
            <div style="font-size: 12px; margin-top: 8px;">System Folder</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 48px;">📁</div>
            <div style="font-size: 12px; margin-top: 8px;">Applications</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 48px;">📄</div>
            <div style="font-size: 12px; margin-top: 8px;">Documents</div>
          </div>
        </div>
      </div>
    `
  });

  desktop.appendChild(finderWindow);

  // Create SimpleText window
  const textWindow = windowSystem.createWindow({
    id: 'simpletext',
    title: 'Untitled',
    width: 450,
    height: 350,
    x: 120,
    y: 120,
    content: `
      <textarea style="width: 100%; height: 100%; border: none;
                       font-family: Monaco, monospace; font-size: 12px;
                       padding: 8px; resize: none; background: white;"></textarea>
    `
  });

  desktop.appendChild(textWindow);

  console.log('Mac OS 9 initialized');
});
```

---

### Example 3: Creating Linux KDE Desktop

Create `kde-plasma.html` and `kde-plasma.js`:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const desktop = document.getElementById('desktop');

  // Initialize UNIX window system
  const windowSystem = new UnixWindowsSystem({
    style: 'cde',
    focusMode: 'click'
  });

  // Initialize KDE panel
  const panel = new KDEPanel();
  panel.initialize(desktop, {
    mode: 'plasma',
    theme: 'breeze',
    position: 'bottom',
    height: 46,
    showKMenu: true,
    showTaskManager: true,
    showPager: true
  });

  // Create Konqueror window
  function openKonqueror() {
    const window = windowSystem.createWindow({
      id: 'konqueror',
      title: 'Konqueror - Home',
      width: 700,
      height: 500,
      menuItems: [
        { label: 'Location', onClick: () => {} },
        { label: 'Edit', onClick: () => {} },
        { label: 'View', onClick: () => {} },
        { label: 'Go', onClick: () => {} },
        { label: 'Bookmarks', onClick: () => {} },
        { label: 'Tools', onClick: () => {} },
        { label: 'Settings', onClick: () => {} },
        { label: 'Help', onClick: () => {} }
      ],
      content: `
        <div style="height: 100%; background: white; padding: 20px;">
          <h2 style="color: #000;">Home Directory</h2>
          <div style="margin-top: 20px; display: grid; grid-template-columns: repeat(auto-fill, 80px); gap: 15px;">
            <div style="text-align: center;">
              <div style="font-size: 32px;">📁</div>
              <div style="font-size: 11px;">Desktop</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 32px;">📁</div>
              <div style="font-size: 11px;">Documents</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 32px;">📁</div>
              <div style="font-size: 11px;">Downloads</div>
            </div>
          </div>
        </div>
      `,
      onClose: () => {
        panel.removeWindow('konqueror');
        return true;
      },
      onFocus: () => {
        panel.setActiveWindow('konqueror');
      }
    });

    desktop.appendChild(window);

    panel.addWindow({
      id: 'konqueror',
      title: 'Konqueror',
      icon: '🌐'
    });
  }

  // Wire up K Menu
  panel.elements.panel.addEventListener('kde:kMenuToggle', () => {
    console.log('K Menu toggled');
  });

  // Wire up window activation
  panel.elements.panel.addEventListener('kde:windowActivate', (e) => {
    windowSystem._focusWindow(e.detail.windowId);
  });

  // Open Konqueror by default
  openKonqueror();

  console.log('KDE Plasma initialized');
});
```

---

### Example 4: Creating Custom Hybrid OS

Mix components creatively:

```javascript
// Hybrid: Windows 11 windows + macOS Dock
document.addEventListener('DOMContentLoaded', () => {
  const desktop = document.getElementById('desktop');

  // Modern Windows windows
  const windowSystem = new ModernWindowsSystem({
    style: 'win11',
    accentColor: '#0078d4',
    useRoundedCorners: true
  });

  // macOS Dock instead of taskbar
  const dock = new MacDock();
  dock.initialize(desktop, {
    position: 'bottom',
    magnification: true,
    theme: 'glass'
  });

  // Add system apps to dock
  const apps = [
    { id: 'files', name: 'Files', icon: '📁', running: false },
    { id: 'browser', name: 'Browser', icon: '🌐', running: false },
    { id: 'terminal', name: 'Terminal', icon: '💻', running: false }
  ];

  apps.forEach(app => dock.addApp(app));

  // Handle dock app launch
  dock.elements.dockContainer.addEventListener('dock:appLaunch', (e) => {
    const app = e.detail.app;

    // Create window
    const window = windowSystem.createWindow({
      id: app.id,
      title: app.name,
      width: 600,
      height: 400,
      content: `<div style="padding: 20px;"><h1>${app.name}</h1></div>`,
      onClose: () => {
        dock.setAppRunning(app.id, false);
        return true;
      }
    });

    desktop.appendChild(window);
    dock.setAppRunning(app.id, true);
  });

  console.log('Hybrid OS initialized');
});
```

---

## Customization & Extensions

### Custom Window Content

Create interactive applications:

```javascript
function openCalculator() {
  createIntegratedWindow({
    id: 'calculator',
    title: 'Calculator',
    icon: '🔢',
    width: 300,
    height: 400,
    resizable: false,
    content: `
      <div style="padding: 10px; background: #c0c0c0; height: 100%;">
        <input type="text" id="calc-display" readonly
               style="width: 100%; height: 40px; text-align: right;
                      font-size: 24px; margin-bottom: 10px;">
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px;">
          ${['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+']
            .map(btn => `
              <button style="height: 50px; font-size: 18px;"
                      onclick="calcButton('${btn}')">${btn}</button>
            `).join('')}
        </div>
      </div>
    `
  });
}

// Calculator logic
window.calcButton = function(value) {
  const display = document.getElementById('calc-display');
  if (value === '=') {
    try {
      display.value = eval(display.value);
    } catch (e) {
      display.value = 'Error';
    }
  } else {
    display.value += value;
  }
};
```

### Custom Themes

Apply custom color schemes:

```javascript
// Dark mode Windows 98
windowSystem.setTheme({
  colors: {
    titleBarActive: '#1a1a1a',
    titleBarInactive: '#333333',
    titleBarTextActive: '#ffffff',
    titleBarTextInactive: '#888888',
    background: '#2a2a2a',
    border: '#1a1a1a',
    borderHighlight: '#444444',
    borderShadow: '#000000'
  }
});
```

### Add Sound Effects

```javascript
// Load audio
const sounds = {
  startup: new Audio('/sounds/startup.mp3'),
  shutdown: new Audio('/sounds/shutdown.mp3'),
  error: new Audio('/sounds/error.wav')
};

// Play on events
document.addEventListener('DOMContentLoaded', () => {
  sounds.startup.play();
});

function showError() {
  sounds.error.play();
  // ...show error dialog
}
```

---

## Troubleshooting

### Windows Don't Appear

**Check:**
1. Is window appended to desktop? `desktop.appendChild(window)`
2. Are scripts loaded in correct order? (components before app code)
3. Console errors? Check browser console

**Fix:**
```javascript
const window = windowSystem.createWindow({...});
console.log('Window created:', window);
desktop.appendChild(window);
console.log('Window appended');
```

---

### Taskbar Not Updating

**Check:**
1. Is taskbar initialized? `taskbar.initialize(desktop, config)`
2. Are events wired up?
3. Is window ID matching?

**Fix:**
```javascript
// Ensure IDs match
const windowId = 'my-app';

createIntegratedWindow({ id: windowId, ... });
taskbar.addWindow({ id: windowId, ... });  // Same ID
```

---

### Windows Not Draggable

**Check:**
1. Is window inside desktop container?
2. Is desktop positioned correctly? (`position: relative`)
3. Z-index conflicts?

**Fix:**
```css
#desktop {
  position: relative;
  overflow: visible; /* Not hidden */
}
```

---

### Style Conflicts

**Check:**
1. Global CSS overriding component styles
2. Multiple components injecting conflicting styles

**Fix:**
```javascript
// Use !important in component styles if needed
// Or increase selector specificity
```

---

## Next Steps

**Congratulations!** You've created a complete retro OS interface.

**Enhance Your OS:**
1. Add Start Menu implementation
2. Create more applications
3. Add file system simulation
4. Implement drag-and-drop
5. Add window animations
6. Create system dialogs
7. Add desktop wallpaper support
8. Implement context menus

**Learn More:**
- Read [API_REFERENCE.md](./API_REFERENCE.md) for all methods
- Study [DESIGN_PATTERNS.md](./DESIGN_PATTERNS.md) for architecture
- Check [EXAMPLES_DEMOS.md](./EXAMPLES_DEMOS.md) for more code

---

**Document Version**: 1.0
**Last Updated**: 2025-11-11
**Word Count**: ~2,600 words
