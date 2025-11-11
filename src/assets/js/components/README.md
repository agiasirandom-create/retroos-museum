# RetroOS Museum - Window System Components

Comprehensive modular window system component library for creating authentic retro OS experiences.

## Components Overview

### 1. Classic Windows System (`classic-windows.js`)
**Styles:** Windows 95, 98, 2000, XP
**File:** `/src/assets/js/components/classic-windows.js`

**Features:**
- Classic 3D raised borders with highlight/shadow effects
- Gray title bars with optional gradient (XP style)
- Standard min/max/close buttons (right side)
- 8-direction resizable handles
- Supports both thick borders (Win95) and thin borders (Win2000)
- Classic menu bar rendering
- Status bar support

**Usage:**
```javascript
// Initialize the system
const windowSystem = new ClassicWindowsSystem({
  style: 'win95', // 'win95', 'win98', 'win2000', 'winxp'
  titleBarGradient: true,
  borderWidth: 3,
  colors: {
    titleBarActive: '#000080',
    titleBarInactive: '#808080'
  }
});

// Create a window
const window = windowSystem.createWindow({
  id: 'my-window',
  title: 'My Application',
  content: '<div>Window content here</div>',
  width: 500,
  height: 400,
  x: 100,
  y: 100,
  resizable: true,
  minimizable: true,
  maximizable: true,
  menuItems: [
    { label: 'File', onClick: () => {} },
    { label: 'Edit', onClick: () => {} },
    { label: 'View', onClick: () => {} }
  ],
  statusBar: 'Ready',
  onClose: () => console.log('Window closed'),
  onFocus: () => console.log('Window focused')
});

// Append to container
document.getElementById('desktop').appendChild(window);

// Theme switching
windowSystem.setTheme({
  style: 'winxp',
  titleBarGradient: true
});
```

---

### 2. Modern Windows System (`modern-windows.js`)
**Styles:** Windows 7, 8, 10, 11
**File:** `/src/assets/js/components/modern-windows.js`

**Features:**
- Aero Glass blur effect (Windows 7)
- Flat design (Windows 8/10)
- Rounded corners (Windows 11)
- Transparency and shadow effects
- Snap assist visual guides (drag to edges)
- Modern minimize/maximize/close buttons with SVG icons
- Smooth animations and transitions

**Usage:**
```javascript
// Initialize with Windows 11 style
const modernSystem = new ModernWindowsSystem({
  style: 'win11', // 'win7', 'win8', 'win10', 'win11'
  accentColor: '#0078d4',
  useAeroGlass: true,
  useRoundedCorners: true,
  transparency: 0.95
});

// Create a modern window
const window = modernSystem.createWindow({
  id: 'modern-app',
  title: 'Modern Application',
  content: '<div>Your content</div>',
  width: 800,
  height: 600,
  icon: '<svg>...</svg>',
  onMinimize: () => console.log('Minimized'),
  onMaximize: (isMaximized) => console.log('Maximized:', isMaximized)
});

document.body.appendChild(window);

// Restore minimized window
modernSystem.restoreWindow('modern-app');
```

---

### 3. Mac Classic System (`mac-classic.js`)
**Styles:** Mac OS 7, 8, 9 (Platinum)
**File:** `/src/assets/js/components/mac-classic.js`

**Features:**
- Pinstriped title bars (Mac OS 8/9)
- Rounded corners on windows
- Close/collapse/zoom boxes (left side)
- Classic Mac resize handle (bottom-right only)
- Platinum appearance option
- Window shade collapse feature (double-click title bar)
- Authentic Mac OS visual styling

**Usage:**
```javascript
// Initialize Mac Classic system
const macSystem = new MacClassicSystem({
  style: 'platinum', // 'classic', 'platinum'
  usePinstripes: true,
  useRoundedCorners: true,
  colors: {
    titleBarActive: '#cccccc',
    titleBarInactive: '#ffffff'
  }
});

// Create a Mac Classic window
const window = macSystem.createWindow({
  id: 'finder-window',
  title: 'Hard Disk',
  content: '<div>Finder content</div>',
  width: 400,
  height: 300,
  closable: true,
  collapsable: true, // Window shade feature
  zoomable: true,
  onCollapse: (isCollapsed) => console.log('Collapsed:', isCollapsed),
  onZoom: (isZoomed) => console.log('Zoomed:', isZoomed)
});

document.body.appendChild(window);
```

---

### 4. Mac Modern System (`mac-modern.js`)
**Styles:** Mac OS X / macOS Aqua
**File:** `/src/assets/js/components/mac-modern.js`

**Features:**
- Aqua translucent title bars
- Traffic light buttons (red/yellow/green, left side)
- Drop shadow and blur effects
- Brushed metal option
- Unified toolbar option
- Full-screen mode support
- Authentic macOS visual appearance

**Usage:**
```javascript
// Initialize Mac Modern system
const aquaSystem = new MacModernSystem({
  style: 'aqua', // 'aqua', 'brushed-metal', 'unified'
  accentColor: 'blue', // 'blue', 'graphite', 'red', etc.
  useBlur: true,
  transparency: 0.95,
  buttonPosition: 'left'
});

// Create an Aqua window
const window = aquaSystem.createWindow({
  id: 'safari-window',
  title: 'Safari',
  content: '<div>Browser content</div>',
  width: 900,
  height: 600,
  toolbar: [
    { label: 'Back', onClick: () => {} },
    { label: 'Forward', onClick: () => {} },
    { label: 'Reload', onClick: () => {} }
  ],
  onZoom: (isFullscreen) => console.log('Fullscreen:', isFullscreen)
});

document.body.appendChild(window);
```

---

### 5. UNIX Windows System (`unix-windows.js`)
**Styles:** CDE, Motif, X11
**File:** `/src/assets/js/components/unix-windows.js`

**Features:**
- CDE (Common Desktop Environment) style
- Motif 3D raised borders
- Simple X11 window decorations
- Virtual desktop support (1-4 desktops)
- Focus-follows-mouse option
- Click-to-focus mode
- Menu bar support

**Usage:**
```javascript
// Initialize UNIX system
const unixSystem = new UnixWindowsSystem({
  style: 'cde', // 'cde', 'motif', 'x11'
  focusMode: 'click', // 'click' or 'follow-mouse'
  virtualDesktop: 1,
  colors: {
    background: '#5b7e95',
    titleBarActive: '#5b7e95',
    titleBarInactive: '#7a96a7'
  }
});

// Create a CDE window
const window = unixSystem.createWindow({
  id: 'xterm',
  title: 'Terminal',
  content: '<div>Terminal content</div>',
  width: 600,
  height: 400,
  virtualDesktop: 1, // Desktop 1-4
  icon: '<svg>...</svg>',
  menuItems: [
    { label: 'File', onClick: () => {} },
    { label: 'Options', onClick: () => {} }
  ]
});

document.body.appendChild(window);

// Switch virtual desktops
unixSystem.switchVirtualDesktop(2);

// Get visible windows on current desktop
const visibleWindows = unixSystem.getVisibleWindows();
```

---

## Common Interface

All window systems implement these methods:

### `createWindow(options)`
Creates and returns a window element.

**Parameters:**
- `id` (string): Unique window identifier
- `title` (string): Window title
- `content` (string): HTML content
- `width` (number): Window width in pixels
- `height` (number): Window height in pixels
- `x` (number, optional): X position (centered if omitted)
- `y` (number, optional): Y position (centered if omitted)
- `resizable` (boolean): Enable resizing
- `minimizable` (boolean): Enable minimize button
- `maximizable` (boolean): Enable maximize button
- `onClose` (function): Close callback
- `onFocus` (function): Focus callback
- `onMinimize` (function): Minimize callback
- `onMaximize` (function): Maximize callback

### `setTheme(themeConfig)`
Apply or update color/style theme.

**Parameters:**
- `themeConfig` (object): Theme configuration object

### `destroy(id)`
Close and clean up a window by ID.

**Parameters:**
- `id` (string): Window identifier

### `getWindow(id)`
Get window data by ID.

**Parameters:**
- `id` (string): Window identifier

**Returns:** Window data object or null

### `getAllWindows()`
Get all window data objects.

**Returns:** Array of window data objects

### `restoreWindow(id)`
Restore a minimized window (available on all systems).

**Parameters:**
- `id` (string): Window identifier

---

## Integration with Existing OS Implementations

These components are designed to work alongside existing implementations:

### Example: Using with Windows XP Desktop
```javascript
// In winxp-desktop.js
const windowSystem = new ClassicWindowsSystem({ style: 'winxp' });

// Replace WindowManager usage with:
this.windowSystem = windowSystem;

// Create windows using:
const win = this.windowSystem.createWindow({
  id: 'notepad',
  title: 'Notepad',
  content: notepadContent
});
document.getElementById('windows-container').appendChild(win);
```

### Example: Using with Mac OS 9
```javascript
// In macos9-desktop.js
const windowSystem = new MacClassicSystem({ style: 'platinum' });

// Create Finder window:
const finder = windowSystem.createWindow({
  id: 'finder',
  title: 'Macintosh HD',
  content: finderContent,
  collapsable: true
});
document.getElementById('desktop').appendChild(finder);
```

---

## Styling & Customization

### CSS Variables
Each system generates its own scoped CSS. You can override colors via the constructor:

```javascript
const system = new ClassicWindowsSystem({
  colors: {
    titleBarActive: '#ff0000',
    titleBarInactive: '#cccccc',
    background: '#c0c0c0'
  }
});
```

### Theme Switching
Change themes dynamically:

```javascript
windowSystem.setTheme({
  style: 'win2000',
  borderWidth: 2,
  colors: { titleBarActive: '#0a246a' }
});
```

---

## Accessibility Features

All components include:
- Proper ARIA labels (`role="dialog"`, `aria-labelledby`)
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Semantic HTML structure

---

## Performance Considerations

- Lightweight: Each component ~20-23KB unminified
- No external dependencies
- CSS-in-JS for self-contained styling
- Efficient z-index management
- Optimized drag/resize handlers
- Minimal DOM manipulation

---

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

Graceful degradation for:
- backdrop-filter (falls back to solid colors)
- CSS grid/flexbox (works on all modern browsers)

---

## Files Structure

```
/src/assets/js/components/
├── classic-windows.js    (22KB)
├── modern-windows.js     (23KB)
├── mac-classic.js        (19KB)
├── mac-modern.js         (21KB)
├── unix-windows.js       (22KB)
└── README.md            (this file)
```

---

## License

Part of the RetroOS Museum project.

---

## Contributing

When adding new features:
1. Maintain the common interface
2. Add JSDoc comments
3. Follow existing code style
4. Include error handling
5. Test on multiple browsers
