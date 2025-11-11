# RetroOS Museum Component Library Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Quick Start](#quick-start)
4. [Component Catalog](#component-catalog)
5. [Integration Guide](#integration-guide)
6. [Advanced Topics](#advanced-topics)

---

## Introduction

### Overview

The RetroOS Museum Component Library is a modular, highly authentic collection of UI components that recreate classic operating system interfaces from the 1990s and 2000s. Built with vanilla JavaScript and CSS-in-JS, this library enables developers to create pixel-perfect retro OS experiences with minimal effort.

**Key Features:**
- **9 Reusable Components**: 5 window systems + 4 desktop/taskbar components
- **Zero Dependencies**: Pure vanilla JavaScript, no frameworks required
- **Authentic Design**: Pixel-perfect recreations based on original OS specifications
- **Modular Architecture**: Mix and match components to create custom OS experiences
- **Event-Driven**: Custom events enable seamless integration
- **Accessible**: ARIA attributes and keyboard navigation support
- **Themeable**: Extensive customization options for colors and styles

### Benefits of Modular Approach

**Code Reusability**: Create multiple OS recreations using the same components with different configurations.

**Maintainability**: Each component is self-contained with its own styling and logic.

**Performance**: Load only the components you need. CSS is injected dynamically only when components are initialized.

**Flexibility**: Components can be combined in creative ways to build hybrid or custom OS experiences.

**Testing**: Isolated components are easier to test and debug.

### Browser Compatibility

**Supported Browsers:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

**CSS Features Used:**
- CSS Grid and Flexbox
- Custom Properties (CSS Variables)
- Backdrop Filter (for glass effects)
- CSS Gradients and Shadows

**JavaScript Features:**
- ES6 Classes
- Map and Set
- Arrow Functions
- Template Literals
- Custom Events

### Installation & Setup

**1. Download Components**

Place component files in your project structure:
```
/src/assets/js/components/
  ├── classic-windows.js
  ├── modern-windows.js
  ├── mac-classic.js
  ├── mac-modern.js
  ├── unix-windows.js
  ├── windows-taskbar.js
  ├── mac-dock.js
  ├── gnome-panel.js
  └── kde-panel.js
```

**2. Include in HTML**

```html
<!-- Include only the components you need -->
<script src="/assets/js/components/classic-windows.js"></script>
<script src="/assets/js/components/windows-taskbar.js"></script>
```

**3. Create Container**

```html
<div id="desktop"></div>
```

**4. Initialize Components**

```javascript
// Initialize in your main script
document.addEventListener('DOMContentLoaded', () => {
  const desktop = document.getElementById('desktop');

  // Create window system
  const windowSystem = new ClassicWindowsSystem({ style: 'win95' });

  // Create taskbar
  const taskbar = new WindowsTaskbar();
  taskbar.initialize(desktop, { mode: '95' });
});
```

---

## Getting Started

### Basic Concepts

**Window Systems**: Components that create and manage draggable, resizable windows with title bars and control buttons.

**Desktop Components**: Taskbars, docks, and panels that provide navigation, window management, and system functions.

**Themes**: Pre-configured color schemes and visual styles matching specific OS versions.

**Events**: Custom events emitted by components for integration (e.g., `taskbar:windowActivate`, `dock:appLaunch`).

### Project Structure

Recommended file organization:
```
/project
  /src
    /assets
      /js
        /components    # Component library files
        /apps          # Application implementations
        desktop.js     # Desktop initialization
      /css
        global.css     # Global styles
      /images
        icons/         # App and system icons
    index.html
```

### Development Workflow

1. **Choose Components**: Select window system + desktop component combination
2. **Configure**: Set theme options, colors, and behaviors
3. **Create Content**: Build window content and applications
4. **Style**: Apply custom themes if needed
5. **Test**: Verify interactions and responsiveness
6. **Optimize**: Remove unused code and minimize assets

---

## Quick Start

### Creating Your First Window

**Step 1: Initialize Window System**

```javascript
// Create classic Windows 95 window system
const windowSystem = new ClassicWindowsSystem({
  style: 'win95',
  colors: {
    titleBarActive: '#000080',
    background: '#c0c0c0'
  }
});
```

**Step 2: Create a Window**

```javascript
const myWindow = windowSystem.createWindow({
  id: 'my-first-window',
  title: 'My Computer',
  content: '<h1>Welcome to Windows 95!</h1>',
  width: 500,
  height: 400,
  x: 100,
  y: 100,
  icon: '<svg>...</svg>',
  menuItems: [
    { label: 'File', onClick: () => console.log('File clicked') },
    { label: 'Edit', onClick: () => console.log('Edit clicked') }
  ]
});

// Append to desktop
document.getElementById('desktop').appendChild(myWindow);
```

**Step 3: Handle Window Events**

```javascript
const myWindow = windowSystem.createWindow({
  id: 'my-window',
  title: 'Notepad',
  content: '<textarea style="width:100%;height:100%;border:none;"></textarea>',
  onClose: () => {
    console.log('Window closing');
    return true; // Allow close (return false to prevent)
  },
  onFocus: () => {
    console.log('Window focused');
  },
  onMinimize: () => {
    console.log('Window minimized');
  }
});
```

### Adding a Taskbar

**Windows Taskbar Example:**

```javascript
const taskbar = new WindowsTaskbar();
taskbar.initialize(document.body, {
  mode: 'xp',           // Windows XP style
  position: 'bottom',
  height: 40,
  showClock: true,
  showQuickLaunch: true
});

// Add window to taskbar
taskbar.addWindow({
  id: 'my-window',
  title: 'My Computer',
  icon: '💻'
});

// Listen for taskbar events
taskbar.elements.taskbar.addEventListener('taskbar:windowActivate', (e) => {
  const windowId = e.detail.windowId;
  windowSystem.restoreWindow(windowId);
});
```

### Common Patterns

**Pattern 1: Window + Taskbar Integration**

```javascript
// Sync window system with taskbar
const createIntegratedWindow = (config) => {
  const window = windowSystem.createWindow({
    ...config,
    onMinimize: () => {
      taskbar.setActiveWindow(null);
    },
    onFocus: () => {
      taskbar.setActiveWindow(config.id);
    },
    onClose: () => {
      taskbar.removeWindow(config.id);
      return true;
    }
  });

  taskbar.addWindow({
    id: config.id,
    title: config.title,
    icon: config.icon
  });

  return window;
};

// Use it
const window1 = createIntegratedWindow({
  id: 'notepad',
  title: 'Notepad',
  content: '<p>Type here...</p>',
  icon: '📝'
});
```

---

## Component Catalog

### Window Systems

#### 1. Classic Windows (classic-windows.js)

**Purpose**: Creates Windows 95/98/2000/XP style windows with 3D raised borders and classic control buttons.

**Visual Characteristics:**
- Thick 3D borders with highlight/shadow effects
- Gray or gradient title bars
- Square minimize/maximize/close buttons
- Optional menu bar
- Status bar support

**Configuration Options:**

```javascript
const system = new ClassicWindowsSystem({
  style: 'win95',        // 'win95', 'win98', 'win2000', 'winxp'
  titleBarGradient: true,
  borderWidth: 3,
  colors: {
    titleBarActive: '#000080',
    titleBarInactive: '#808080',
    titleBarTextActive: '#ffffff',
    background: '#c0c0c0'
  }
});
```

**Window Options:**

```javascript
windowSystem.createWindow({
  id: 'unique-id',
  title: 'Window Title',
  content: '<div>HTML content</div>',
  icon: '<svg>...</svg>',
  width: 400,
  height: 300,
  x: 100,  // Optional position
  y: 100,
  resizable: true,
  minimizable: true,
  maximizable: true,
  menuItems: [
    { label: 'File', onClick: () => {} }
  ],
  statusBar: 'Ready',
  onClose: () => true,
  onFocus: () => {},
  onMinimize: () => {},
  onMaximize: (isMaximized) => {}
});
```

**When to Use:**
- Recreating Windows 95/98 experiences
- Retro productivity applications
- Educational demos about UI evolution
- Nostalgia-driven projects

**Code Example:**

```javascript
const win95System = new ClassicWindowsSystem({ style: 'win95' });

const explorerWindow = win95System.createWindow({
  id: 'explorer',
  title: 'Exploring - C:\\',
  width: 640,
  height: 480,
  menuItems: [
    { label: 'File', onClick: () => {} },
    { label: 'Edit', onClick: () => {} },
    { label: 'View', onClick: () => {} },
    { label: 'Help', onClick: () => {} }
  ],
  content: `
    <div style="display: flex; height: 100%;">
      <div style="width: 200px; border-right: 1px solid #808080;">
        Tree view...
      </div>
      <div style="flex: 1; padding: 10px;">
        File list...
      </div>
    </div>
  `,
  statusBar: 'My Computer'
});

document.body.appendChild(explorerWindow);
```

---

#### 2. Modern Windows (modern-windows.js)

**Purpose**: Creates Windows 7/8/10/11 style windows with Aero glass effects, flat design, and modern aesthetics.

**Visual Characteristics:**
- Transparent/blurred backgrounds (Aero glass)
- Flat or rounded corners (Windows 11)
- SVG-based control buttons
- Snap assist guides
- Modern shadows and transitions

**Configuration Options:**

```javascript
const system = new ModernWindowsSystem({
  style: 'win10',          // 'win7', 'win8', 'win10', 'win11'
  accentColor: '#0078d4',
  useAeroGlass: false,     // Auto-enabled for win7
  useRoundedCorners: false, // Auto-enabled for win11
  transparency: 0.95
});
```

**Unique Features:**
- **Snap Assist**: Drag to edges for window snapping
- **Aero Glass**: Blur effects on Windows 7
- **Rounded Corners**: Windows 11 style
- **Dynamic Unsnap**: Drag maximized window to restore

**Code Example:**

```javascript
const win11System = new ModernWindowsSystem({
  style: 'win11',
  accentColor: '#0078d4'
});

const settingsWindow = win11System.createWindow({
  id: 'settings',
  title: 'Settings',
  width: 800,
  height: 600,
  content: `
    <div style="display: flex; height: 100%;">
      <nav style="width: 200px; background: #f3f3f3; padding: 20px;">
        <div style="padding: 10px; cursor: pointer;">System</div>
        <div style="padding: 10px; cursor: pointer;">Personalization</div>
        <div style="padding: 10px; cursor: pointer;">Apps</div>
      </nav>
      <main style="flex: 1; padding: 30px;">
        <h1 style="margin: 0;">Display</h1>
        <p>Adjust your display settings...</p>
      </main>
    </div>
  `
});

document.body.appendChild(settingsWindow);
```

---

#### 3. Mac Classic (mac-classic.js)

**Purpose**: Creates Mac OS 7/8/9 Platinum appearance windows with pinstripes and rounded corners.

**Visual Characteristics:**
- Rounded window corners
- Horizontal pinstripe pattern on title bar
- Three window control boxes (close, collapse, zoom)
- Bottom-right resize handle
- Window shade (collapse) feature

**Configuration Options:**

```javascript
const system = new MacClassicSystem({
  style: 'platinum',      // 'classic', 'platinum'
  usePinstripes: true,
  useRoundedCorners: true,
  colors: {
    titleBarActive: '#cccccc',
    titleBarInactive: '#ffffff'
  }
});
```

**Window Options:**

```javascript
system.createWindow({
  id: 'finder',
  title: 'Macintosh HD',
  content: '<div>Icon view...</div>',
  width: 500,
  height: 400,
  resizable: true,
  closable: true,
  collapsable: true,  // Window shade
  zoomable: true,     // Maximize
  onCollapse: (isCollapsed) => {},
  onZoom: (isZoomed) => {}
});
```

**Special Features:**
- **Window Shade**: Double-click title bar to collapse window
- **Single Resize Handle**: Bottom-right corner only
- **Zoom Box**: Maximizes with margin (not full screen)

**Code Example:**

```javascript
const macSystem = new MacClassicSystem({ style: 'platinum' });

const finderWindow = macSystem.createWindow({
  id: 'finder',
  title: 'Desktop',
  width: 600,
  height: 450,
  content: `
    <div style="padding: 20px; background: white; height: 100%;">
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
        <div style="text-align: center;">
          <div style="font-size: 48px;">📁</div>
          <div>Documents</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 48px;">🖼️</div>
          <div>Pictures</div>
        </div>
      </div>
    </div>
  `
});

document.body.appendChild(finderWindow);
```

---

#### 4. Mac Modern (mac-modern.js)

**Purpose**: Creates macOS Aqua-style windows with traffic light buttons, blur effects, and modern glass aesthetics.

**Visual Characteristics:**
- Translucent backgrounds with blur
- Traffic light buttons (red, yellow, green)
- Rounded corners (10px radius)
- Optional toolbar
- Smooth animations

**Configuration Options:**

```javascript
const system = new MacModernSystem({
  style: 'aqua',           // 'aqua', 'brushed-metal', 'unified'
  accentColor: 'blue',     // 'blue', 'graphite', 'red', etc.
  useBlur: true,
  transparency: 0.95,
  buttonPosition: 'left'   // 'left' or 'right'
});
```

**Window Options:**

```javascript
system.createWindow({
  id: 'safari',
  title: 'Safari',
  width: 900,
  height: 600,
  toolbar: [
    { label: '← →', onClick: () => {} },
    { label: '🔄', onClick: () => {} },
    { label: '🏠', onClick: () => {} }
  ],
  closable: true,
  minimizable: true,
  zoomable: true
});
```

**Traffic Light Buttons:**
- **Red**: Close window
- **Yellow**: Minimize to Dock
- **Green**: Zoom/fullscreen
- Hover to reveal icons

**Code Example:**

```javascript
const macOSSystem = new MacModernSystem({
  style: 'unified',
  accentColor: 'blue'
});

const safariWindow = macOSSystem.createWindow({
  id: 'safari',
  title: 'Apple',
  width: 1000,
  height: 700,
  toolbar: [
    { label: '←', onClick: () => console.log('Back') },
    { label: '→', onClick: () => console.log('Forward') },
    { label: 'Apple', onClick: () => {} }
  ],
  content: `
    <div style="background: white; height: 100%; padding: 40px;">
      <h1>Welcome to Safari</h1>
    </div>
  `
});

document.body.appendChild(safariWindow);
```

---

#### 5. UNIX Windows (unix-windows.js)

**Purpose**: Creates CDE/Motif/X11 style windows with 3D beveled borders and classic UNIX aesthetics.

**Visual Characteristics:**
- Thick 3D inset/outset borders
- CDE blue-gray color scheme
- Simple text buttons (_, □, X)
- Optional menu bar
- Virtual desktop support

**Configuration Options:**

```javascript
const system = new UnixWindowsSystem({
  style: 'cde',           // 'cde', 'motif', 'x11'
  focusMode: 'click',     // 'click' or 'follow-mouse'
  virtualDesktop: 1,
  colors: {
    background: '#5b7e95',
    titleBarActive: '#5b7e95',
    titleBarInactive: '#7a96a7'
  }
});
```

**Window Options:**

```javascript
system.createWindow({
  id: 'terminal',
  title: 'dtterm',
  content: '<pre>$ ls -la\n...</pre>',
  width: 600,
  height: 400,
  virtualDesktop: 1,  // Associate with desktop
  menuItems: [
    { label: 'Options', onClick: () => {} },
    { label: 'Help', onClick: () => {} }
  ]
});
```

**Special Features:**
- **Focus Modes**: Click-to-focus or focus-follows-mouse
- **Virtual Desktops**: Assign windows to specific desktops
- **Workspace Switching**: `switchVirtualDesktop(desktopNum)`

**Code Example:**

```javascript
const cdeSystem = new UnixWindowsSystem({
  style: 'cde',
  focusMode: 'click'
});

const terminalWindow = cdeSystem.createWindow({
  id: 'dtterm',
  title: 'Terminal - dtterm',
  width: 640,
  height: 480,
  menuItems: [
    { label: 'Options', onClick: () => {} },
    { label: 'Help', onClick: () => {} }
  ],
  content: `
    <div style="background: black; color: #00ff00; font-family: monospace;
                padding: 10px; height: 100%; overflow: auto;">
      <div>SunOS 5.8 Generic sun4u sparc SUNW,Ultra-5_10</div>
      <div>login: user</div>
      <div>Password:</div>
      <div>Last login: Mon Nov 11 10:23:45 from workstation</div>
      <div>Sun Microsystems Inc.   SunOS 5.8       Generic February 2000</div>
      <div>$ █</div>
    </div>
  `
});

document.body.appendChild(terminalWindow);
```

---

### Desktop/Taskbar Components

#### 6. Windows Taskbar (windows-taskbar.js)

**Purpose**: Authentic Windows taskbar supporting Windows 95 through Windows 11 modes.

**Visual Characteristics:**
- Mode-specific styling (95/98/XP/7/10/11)
- Start button with era-appropriate logo
- Task buttons with icons and titles
- System tray icons
- Live clock
- Quick launch (95-7)

**Configuration:**

```javascript
const taskbar = new WindowsTaskbar();
taskbar.initialize(document.body, {
  mode: 'xp',              // '95', '98', 'xp', '7', '10', '11'
  position: 'bottom',
  autoHide: false,
  height: 40,
  showClock: true,
  showQuickLaunch: true,
  showSystemTray: true,
  groupSimilar: false,
  centerAlign: false       // Windows 11 centered taskbar
});
```

**API Methods:**

```javascript
// Add window
taskbar.addWindow({
  id: 'window-1',
  title: 'My Computer',
  icon: '💻'
});

// Remove window
taskbar.removeWindow('window-1');

// Set active window (highlights button)
taskbar.setActiveWindow('window-1');

// Listen for events
taskbar.elements.taskbar.addEventListener('taskbar:windowActivate', (e) => {
  console.log('Activate:', e.detail.windowId);
});

taskbar.elements.taskbar.addEventListener('taskbar:startMenuToggle', (e) => {
  console.log('Start menu:', e.detail.open);
});
```

**Customization:**

```javascript
// Change theme
taskbar.setTheme({
  mode: '7',
  accentColor: '#0078d4'
});

// Clean up
taskbar.destroy();
```

**Code Example:**

```javascript
// Windows XP taskbar with full integration
const taskbar = new WindowsTaskbar();
taskbar.initialize(document.body, {
  mode: 'xp',
  showQuickLaunch: true
});

// Listen for Start menu
taskbar.elements.taskbar.addEventListener('taskbar:startMenuToggle', (e) => {
  if (e.detail.open) {
    showStartMenu();
  } else {
    hideStartMenu();
  }
});

// Listen for window activation
taskbar.elements.taskbar.addEventListener('taskbar:windowActivate', (e) => {
  windowSystem.restoreWindow(e.detail.windowId);
});

// Listen for minimize
taskbar.elements.taskbar.addEventListener('taskbar:windowMinimize', (e) => {
  windowSystem._minimizeWindow(e.detail.windowId);
});
```

---

#### 7. Mac Dock (mac-dock.js)

**Purpose**: Authentic macOS Dock with magnification, bounce animations, and glass effects.

**Visual Characteristics:**
- Glass/translucent background
- Icon magnification on hover
- Running app indicators (dots)
- App labels on hover
- Bounce animations
- 3D tilt effect (optional)

**Configuration:**

```javascript
const dock = new MacDock();
dock.initialize(document.body, {
  position: 'bottom',      // 'bottom', 'left', 'right'
  magnification: true,
  magnificationSize: 2.5,  // Scale multiplier
  autoHide: false,
  iconSize: 48,
  spacing: 8,
  showIndicators: true,    // Running app dots
  showLabels: true,
  perspective: true,       // 3D tilt
  theme: 'glass'           // 'glass', 'solid', 'translucent'
});
```

**API Methods:**

```javascript
// Add app
dock.addApp({
  id: 'finder',
  name: 'Finder',
  icon: '📁',
  iconUrl: '/icons/finder.png',  // Alternative to emoji
  running: true
});

// Remove app
dock.removeApp('finder');

// Set running state
dock.setAppRunning('safari', true);

// Bounce icon (for notifications)
dock.bounceApp('mail', 3);  // Bounce 3 times

// Add folder stack
dock.addFolder({
  id: 'downloads',
  name: 'Downloads',
  icon: '📥',
  items: [...]
});
```

**Events:**

```javascript
// App launched
dock.elements.dockContainer.addEventListener('dock:appLaunch', (e) => {
  console.log('Launch:', e.detail.app);
});

// App activated
dock.elements.dockContainer.addEventListener('dock:appActivate', (e) => {
  console.log('Activate:', e.detail.app);
});

// Folder stack shown
dock.elements.dockContainer.addEventListener('dock:folderStack', (e) => {
  console.log('Folder:', e.detail.folder);
});
```

**Code Example:**

```javascript
const dock = new MacDock();
dock.initialize(document.body, {
  position: 'bottom',
  magnification: true,
  theme: 'glass'
});

// Add system apps
const apps = [
  { id: 'finder', name: 'Finder', icon: '📁', running: true },
  { id: 'safari', name: 'Safari', icon: '🧭', running: false },
  { id: 'mail', name: 'Mail', icon: '📧', running: false },
  { id: 'itunes', name: 'iTunes', icon: '🎵', running: true }
];

apps.forEach(app => dock.addApp(app));

// Add Downloads folder
dock.addApp({ id: 'trash', name: 'Trash', icon: '🗑️', running: false });

// Handle app launch
dock.elements.dockContainer.addEventListener('dock:appLaunch', (e) => {
  const app = e.detail.app;
  dock.setAppRunning(app.id, true);
  createAppWindow(app);
});

// Bounce mail when new message arrives
setTimeout(() => {
  dock.bounceApp('mail', 5);
}, 3000);
```

---

#### 8. GNOME Panel (gnome-panel.js)

**Purpose**: GNOME desktop panels supporting GNOME 2, GNOME 3, and Ubuntu Unity layouts.

**Visual Characteristics:**
- Top panel with menu bar
- Optional bottom panel (GNOME 2)
- Optional left launcher (Unity)
- Activities button (GNOME 3)
- Window list
- Workspace switcher
- System indicators

**Configuration:**

```javascript
const panel = new GNOMEPanel();
panel.initialize(document.body, {
  mode: 'gnome2',          // 'gnome2', 'gnome3', 'unity'
  showTopPanel: true,
  showBottomPanel: true,   // GNOME 2 only
  showLeftLauncher: false, // Unity only
  showActivities: true,    // GNOME 3
  showWorkspaces: true,
  workspaceCount: 4,
  height: 24,
  theme: 'dark'            // 'dark', 'light'
});
```

**API Methods:**

```javascript
// Add window to panel
panel.addWindow({
  id: 'window-1',
  title: 'Terminal',
  icon: '💻'
});

// Remove window
panel.removeWindow('window-1');
```

**Events:**

```javascript
// Menu opened
document.addEventListener('gnome:menuOpen', (e) => {
  console.log('Menu type:', e.detail.menuType);
});

// Activities opened (GNOME 3)
document.addEventListener('gnome:activitiesOpen', () => {
  showActivitiesOverview();
});

// Workspace switched
document.addEventListener('gnome:workspaceSwitch', (e) => {
  console.log('Workspace:', e.detail.workspaceId);
});

// Window activated
document.addEventListener('gnome:windowActivate', (e) => {
  console.log('Window:', e.detail.windowId);
});
```

**Code Example:**

```javascript
// Ubuntu GNOME 2 style
const panel = new GNOMEPanel();
panel.initialize(document.body, {
  mode: 'gnome2',
  showTopPanel: true,
  showBottomPanel: true,
  showWorkspaces: true,
  workspaceCount: 4,
  theme: 'dark'
});

// Handle menu clicks
document.addEventListener('gnome:menuOpen', (e) => {
  if (e.detail.menuType === 'applications') {
    showApplicationsMenu();
  }
});

// Handle workspace switching
document.addEventListener('gnome:workspaceSwitch', (e) => {
  switchToWorkspace(e.detail.workspaceId);
});
```

---

#### 9. KDE Panel (kde-panel.js)

**Purpose**: KDE desktop panel supporting KDE 3 Kicker and KDE 4/5 Plasma layouts.

**Visual Characteristics:**
- K Menu button with iconic logo
- Quick launch icons
- Task manager with grouped windows
- System tray
- Virtual desktop pager
- Digital clock widget
- Customizable (Plasma)

**Configuration:**

```javascript
const panel = new KDEPanel();
panel.initialize(document.body, {
  mode: 'plasma',          // 'kde3', 'kde4', 'plasma'
  position: 'bottom',      // 'top', 'bottom', 'left', 'right'
  height: 46,
  autoHide: false,
  customizable: true,
  showKMenu: true,
  showTaskManager: true,
  showSystemTray: true,
  showPager: true,
  showQuickLaunch: true,
  groupTasks: false,
  theme: 'breeze'          // 'oxygen', 'breeze', 'plastik'
});
```

**API Methods:**

```javascript
// Add window
panel.addWindow({
  id: 'window-1',
  title: 'Konqueror',
  icon: '🌐'
});

// Remove window
panel.removeWindow('window-1');

// Set active window
panel.setActiveWindow('window-1');

// Add widget (Plasma)
panel.addWidget({
  id: 'weather',
  content: '<div>☀️ 72°F</div>'
});

// Remove widget
panel.removeWidget('weather');

// Enable/disable auto-hide
panel.setAutoHide(true);
```

**Events:**

```javascript
// K Menu toggled
panel.elements.panel.addEventListener('kde:kMenuToggle', () => {
  showKMenu();
});

// Window activated
panel.elements.panel.addEventListener('kde:windowActivate', (e) => {
  console.log('Window:', e.detail.windowId);
});

// Workspace switched
panel.elements.panel.addEventListener('kde:workspaceSwitch', (e) => {
  console.log('Workspace:', e.detail.workspaceId);
});

// Clock clicked
panel.elements.panel.addEventListener('kde:clockClick', () => {
  showCalendar();
});
```

**Code Example:**

```javascript
// KDE Plasma 5 panel
const panel = new KDEPanel();
panel.initialize(document.body, {
  mode: 'plasma',
  theme: 'breeze',
  customizable: true,
  height: 46
});

// Add custom weather widget
panel.addWidget({
  id: 'weather',
  content: `
    <div style="display: flex; align-items: center; gap: 4px;">
      <span style="font-size: 18px;">☀️</span>
      <span>72°F</span>
    </div>
  `
});

// Handle K Menu
panel.elements.panel.addEventListener('kde:kMenuToggle', () => {
  showKMenu();
});

// Handle task context menu
panel.elements.panel.addEventListener('kde:taskContextMenu', (e) => {
  showContextMenu(e.detail.windowId, e.detail.x, e.detail.y);
});
```

---

## Integration Guide

### How to Integrate with Existing OS

**Step 1: Choose Your Components**

Select window system and desktop component:
- **Windows 95/98**: ClassicWindowsSystem + WindowsTaskbar
- **Windows XP**: ClassicWindowsSystem + WindowsTaskbar
- **Windows 7/10**: ModernWindowsSystem + WindowsTaskbar
- **Mac OS 9**: MacClassicSystem + (custom menu bar)
- **macOS**: MacModernSystem + MacDock
- **GNOME**: UnixWindowsSystem + GNOMEPanel
- **KDE**: UnixWindowsSystem + KDEPanel

**Step 2: Initialize Components**

```javascript
// Example: Windows XP setup
const desktop = document.getElementById('desktop');

// 1. Create window system
const windowSystem = new ClassicWindowsSystem({
  style: 'winxp',
  titleBarGradient: true
});

// 2. Create taskbar
const taskbar = new WindowsTaskbar();
taskbar.initialize(desktop, {
  mode: 'xp',
  showQuickLaunch: true
});

// 3. Store globally for access
window.osComponents = { windowSystem, taskbar };
```

**Step 3: Create Helper Functions**

```javascript
// Helper to create integrated windows
function createWindow(config) {
  const window = windowSystem.createWindow({
    ...config,
    onMinimize: () => {
      taskbar.setActiveWindow(null);
    },
    onFocus: () => {
      taskbar.setActiveWindow(config.id);
    },
    onClose: () => {
      taskbar.removeWindow(config.id);
      return true;
    }
  });

  taskbar.addWindow({
    id: config.id,
    title: config.title,
    icon: config.icon
  });

  desktop.appendChild(window);
  return window;
}
```

**Step 4: Wire Up Events**

```javascript
// Taskbar -> Window System communication
taskbar.elements.taskbar.addEventListener('taskbar:windowActivate', (e) => {
  const windowData = windowSystem.getWindow(e.detail.windowId);
  if (windowData && windowData.isMinimized) {
    windowSystem.restoreWindow(e.detail.windowId);
  }
});

taskbar.elements.taskbar.addEventListener('taskbar:windowMinimize', (e) => {
  windowSystem._minimizeWindow(e.detail.windowId);
});

taskbar.elements.taskbar.addEventListener('taskbar:startMenuToggle', (e) => {
  if (e.detail.open) {
    showStartMenu();
  }
});
```

### Combining Components

**Example: Mac OS X Setup**

```javascript
// Initialize components
const windowSystem = new MacModernSystem({
  style: 'aqua',
  accentColor: 'blue'
});

const dock = new MacDock();
dock.initialize(document.body, {
  position: 'bottom',
  magnification: true
});

// Add Finder to dock
dock.addApp({
  id: 'finder',
  name: 'Finder',
  icon: '📁',
  running: true
});

// Create Finder window
const finderWindow = windowSystem.createWindow({
  id: 'finder-window',
  title: 'Documents',
  width: 800,
  height: 600,
  toolbar: [
    { label: '←', onClick: () => {} },
    { label: '→', onClick: () => {} }
  ],
  content: '<div>File browser...</div>',
  onClose: () => {
    dock.setAppRunning('finder', false);
    return true;
  }
});

document.body.appendChild(finderWindow);

// Handle dock app launch
dock.elements.dockContainer.addEventListener('dock:appLaunch', (e) => {
  const app = e.detail.app;
  // Create window for app
  createAppWindow(app);
});
```

### Theme Customization

**Changing Colors:**

```javascript
// Windows system
windowSystem.setTheme({
  colors: {
    titleBarActive: '#cc0000',      // Red title bar
    titleBarInactive: '#999999',
    background: '#d4d0c8'
  }
});

// Taskbar
taskbar.setTheme({
  mode: 'xp',
  // Custom colors applied via CSS
});
```

**Creating Custom Themes:**

```javascript
// Define theme object
const customTheme = {
  style: 'winxp',
  colors: {
    titleBarActive: '#1a5f7a',
    titleBarInactive: '#86a5b5',
    titleBarTextActive: '#ffffff',
    titleBarTextInactive: '#e0e0e0',
    border: '#0d3b52',
    borderHighlight: '#86c5e8',
    borderShadow: '#0a2e3f',
    background: '#ece9d8'
  }
};

// Apply theme
windowSystem.setTheme(customTheme);
```

### Event Handling

**Window Events:**

```javascript
const window = windowSystem.createWindow({
  id: 'app',
  title: 'My App',
  content: '<div>Content</div>',

  // Close event (return false to prevent)
  onClose: () => {
    const hasUnsavedChanges = checkUnsavedChanges();
    if (hasUnsavedChanges) {
      const confirm = window.confirm('Close without saving?');
      return confirm;
    }
    return true;
  },

  // Focus event
  onFocus: () => {
    updateMenuBar();
    taskbar.setActiveWindow('app');
  },

  // Minimize event
  onMinimize: () => {
    taskbar.setActiveWindow(null);
  },

  // Maximize event
  onMaximize: (isMaximized) => {
    if (isMaximized) {
      enterFullScreenMode();
    } else {
      exitFullScreenMode();
    }
  }
});
```

**Custom Events:**

```javascript
// Create custom event
const event = new CustomEvent('app:dataChanged', {
  detail: { data: newData }
});

window.dispatchEvent(event);

// Listen for custom event
window.addEventListener('app:dataChanged', (e) => {
  console.log('Data:', e.detail.data);
});
```

### Best Practices

**1. Component Initialization Order**

```javascript
// Correct order
const windowSystem = new ClassicWindowsSystem(config);
const taskbar = new WindowsTaskbar();
taskbar.initialize(desktop, config);
// Now create windows
```

**2. Memory Management**

```javascript
// Clean up when switching OS
function cleanup() {
  // Destroy all windows
  windowSystem.getAllWindows().forEach(win => {
    windowSystem.destroy(win.id);
  });

  // Destroy taskbar
  taskbar.destroy();

  // Clear references
  window.osComponents = null;
}
```

**3. Responsive Design**

```javascript
// Handle window resize
window.addEventListener('resize', () => {
  // Taskbar handles this automatically

  // Reposition windows if needed
  windowSystem.getAllWindows().forEach(win => {
    const el = win.element;
    const maxX = window.innerWidth - el.offsetWidth;
    const maxY = window.innerHeight - el.offsetHeight;

    if (el.offsetLeft > maxX) el.style.left = `${maxX}px`;
    if (el.offsetTop > maxY) el.style.top = `${maxY}px`;
  });
});
```

**4. Z-Index Management**

```javascript
// Components manage z-index automatically
// Taskbar: 9999
// Windows: 1000+ (incrementing)
// Menus/modals: 10000+

// Override if needed
const window = windowSystem.createWindow({...});
window.style.zIndex = 5000;
```

**5. Accessibility**

```javascript
// Components include ARIA attributes
// Add keyboard navigation

document.addEventListener('keydown', (e) => {
  // Alt+Tab window switching
  if (e.altKey && e.key === 'Tab') {
    e.preventDefault();
    switchToNextWindow();
  }

  // Alt+F4 close window
  if (e.altKey && e.key === 'F4') {
    e.preventDefault();
    closeActiveWindow();
  }
});
```

---

## Advanced Topics

### Custom Styling

**Overriding Component Styles:**

```javascript
// Add custom CSS after component initialization
const style = document.createElement('style');
style.textContent = `
  .classic-window {
    font-family: 'Comic Sans MS', cursive !important;
  }

  .classic-titlebar {
    background: linear-gradient(90deg, #ff00ff, #00ffff) !important;
  }

  .taskbar-start-button {
    background: gold !important;
  }
`;
document.head.appendChild(style);
```

**CSS Variables:**

```javascript
// Set CSS variables for theming
document.documentElement.style.setProperty('--window-bg', '#ffffff');
document.documentElement.style.setProperty('--titlebar-active', '#0078d4');
```

### Performance Optimization

**1. Lazy Loading Components**

```javascript
// Load components on demand
async function loadWindowsComponents() {
  if (!window.ClassicWindowsSystem) {
    await import('./components/classic-windows.js');
  }
  if (!window.WindowsTaskbar) {
    await import('./components/windows-taskbar.js');
  }
}

// Initialize when needed
loadWindowsComponents().then(() => {
  initializeWindows95();
});
```

**2. Minimize Reflows**

```javascript
// Batch DOM updates
function createMultipleWindows(configs) {
  const fragment = document.createDocumentFragment();

  configs.forEach(config => {
    const window = windowSystem.createWindow(config);
    fragment.appendChild(window);
  });

  desktop.appendChild(fragment);
}
```

**3. Debounce Resize Events**

```javascript
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    handleResize();
  }, 250);
});
```

### Accessibility Features

**Keyboard Navigation:**

```javascript
// Focus management
function focusNextWindow() {
  const windows = windowSystem.getAllWindows();
  const currentIndex = windows.findIndex(w => w.element.classList.contains('active'));
  const nextIndex = (currentIndex + 1) % windows.length;
  windowSystem._focusWindow(windows[nextIndex].element.id);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Tab') {
    e.preventDefault();
    focusNextWindow();
  }
});
```

**Screen Reader Support:**

```javascript
// Announce window state changes
function announceWindowState(windowId, state) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.textContent = `Window ${windowId} ${state}`;
  announcement.style.position = 'absolute';
  announcement.style.left = '-9999px';
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

// Use in callbacks
windowSystem.createWindow({
  onMinimize: () => {
    announceWindowState('myapp', 'minimized');
  }
});
```

### Browser Compatibility

**Feature Detection:**

```javascript
// Check for backdrop-filter support
function supportsBackdropFilter() {
  return CSS.supports('backdrop-filter', 'blur(10px)');
}

// Fallback for unsupported browsers
if (!supportsBackdropFilter()) {
  // Use solid backgrounds instead
  windowSystem.setTheme({
    useAeroGlass: false,
    transparency: 1.0
  });
}
```

**Polyfills:**

```javascript
// CustomEvent polyfill for older browsers
if (typeof CustomEvent !== 'function') {
  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: null };
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }
  window.CustomEvent = CustomEvent;
}
```

### Troubleshooting

**Issue: Windows not draggable**

```javascript
// Check z-index conflicts
const window = windowSystem.getWindow('mywindow');
console.log('Z-index:', window.element.style.zIndex);

// Ensure container doesn't have overflow: hidden
desktop.style.overflow = 'visible';
```

**Issue: Taskbar not updating**

```javascript
// Verify event listeners are attached
console.log('Taskbar listeners:', taskbar.eventHandlers);

// Manually trigger update
taskbar._updateTaskButtonSizes();
```

**Issue: Styles not applying**

```javascript
// Check for style injection
const styleEl = document.getElementById('classic-windows-styles');
console.log('Styles injected:', !!styleEl);

// Reinject if needed
windowSystem._injectStyles();
```

**Issue: Memory leaks**

```javascript
// Always destroy components when done
function cleanup() {
  windowSystem.getAllWindows().forEach(w => {
    windowSystem.destroy(w.element.id);
  });
  taskbar.destroy();
}

// Call cleanup before switching OS or on page unload
window.addEventListener('beforeunload', cleanup);
```

---

## Summary

The RetroOS Museum Component Library provides everything needed to create authentic retro OS experiences:

- **9 Production-Ready Components**: Thoroughly tested window systems and desktop components
- **Complete OS Coverage**: Windows, Mac, and UNIX interfaces from 1995-2025
- **Simple Integration**: Initialize, configure, and connect with minimal code
- **Extensive Customization**: Themes, colors, behaviors fully configurable
- **Event-Driven Architecture**: Easy integration with existing codebases
- **Performance Optimized**: Efficient rendering and memory management
- **Accessible**: ARIA support and keyboard navigation built-in

**Next Steps:**
1. Read [API_REFERENCE.md](./API_REFERENCE.md) for detailed API documentation
2. Review [DESIGN_PATTERNS.md](./DESIGN_PATTERNS.md) for architectural insights
3. Follow [TUTORIAL_CREATING_OS.md](./TUTORIAL_CREATING_OS.md) for step-by-step guides
4. Explore [THEME_CUSTOMIZATION.md](./THEME_CUSTOMIZATION.md) for styling options
5. Check [EXAMPLES_DEMOS.md](./EXAMPLES_DEMOS.md) for working code samples

**Resources:**
- Component source code: `/src/assets/js/components/`
- Example implementations: `/src/assets/js/apps/`
- Demo page: `/demo.html`

---

**Document Version**: 1.0
**Last Updated**: 2025-11-11
**Word Count**: ~3,200 words
