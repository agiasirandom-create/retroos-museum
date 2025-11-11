# RetroOS Museum Component Library - API Reference

## Table of Contents
1. [Common Interface](#common-interface)
2. [Window Systems API](#window-systems-api)
3. [Desktop Components API](#desktop-components-api)
4. [Configuration Schemas](#configuration-schemas)
5. [Events Reference](#events-reference)
6. [TypeScript Definitions](#typescript-definitions)

---

## Common Interface

All window system components implement a common interface for consistency and interoperability.

### Constructor

```javascript
constructor(options = {})
```

**Parameters:**
- `options` (Object): Configuration object specific to each component

**Returns**: Component instance

**Example:**
```javascript
const system = new ClassicWindowsSystem({
  style: 'win95',
  titleBarGradient: false
});
```

---

### createWindow(config)

Creates and returns a new window element.

```javascript
createWindow(config: WindowConfig): HTMLElement
```

**Parameters:**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | string | Auto-generated | Unique window identifier |
| `title` | string | 'Untitled' | Window title text |
| `content` | string | '' | HTML content for window body |
| `icon` | string | null | SVG or emoji icon |
| `width` | number | 400 | Window width in pixels |
| `height` | number | 300 | Window height in pixels |
| `x` | number | null | X position (null = center) |
| `y` | number | null | Y position (null = center) |
| `resizable` | boolean | true | Enable window resizing |
| `minimizable` | boolean | true | Show minimize button |
| `maximizable` | boolean | true | Show maximize button |
| `onClose` | function | null | Close callback (return false to prevent) |
| `onFocus` | function | null | Focus callback |
| `onMinimize` | function | null | Minimize callback |
| `onMaximize` | function | null | Maximize callback (receives isMaximized) |

**Returns**: `HTMLElement` - Window DOM element

**Example:**
```javascript
const window = system.createWindow({
  id: 'notepad',
  title: 'Untitled - Notepad',
  width: 600,
  height: 400,
  content: '<textarea style="width:100%;height:100%;"></textarea>',
  onClose: () => {
    return confirm('Save changes?');
  }
});

document.body.appendChild(window);
```

---

### setTheme(config)

Updates theme configuration.

```javascript
setTheme(config: ThemeConfig): void
```

**Parameters:**
- `config` (Object): Theme configuration object

**Example:**
```javascript
system.setTheme({
  colors: {
    titleBarActive: '#cc0000',
    titleBarInactive: '#999999'
  }
});
```

---

### destroy(id)

Destroys a window and cleans up resources.

```javascript
destroy(id: string): void
```

**Parameters:**
- `id` (string): Window identifier

**Example:**
```javascript
system.destroy('notepad');
```

---

### getWindow(id)

Retrieves window data by ID.

```javascript
getWindow(id: string): WindowData | null
```

**Returns**: Window data object or null if not found

```javascript
{
  element: HTMLElement,
  title: string,
  icon: string,
  onClose: function,
  onFocus: function,
  isMinimized: boolean,
  isMaximized: boolean,
  previousState: Object
}
```

**Example:**
```javascript
const windowData = system.getWindow('notepad');
if (windowData) {
  console.log('Title:', windowData.title);
  console.log('Minimized:', windowData.isMinimized);
}
```

---

### getAllWindows()

Retrieves all window data.

```javascript
getAllWindows(): Array<WindowData>
```

**Returns**: Array of window data objects

**Example:**
```javascript
const windows = system.getAllWindows();
console.log(`${windows.length} windows open`);

windows.forEach(win => {
  console.log(win.title);
});
```

---

### restoreWindow(id)

Restores a minimized window.

```javascript
restoreWindow(id: string): void
```

**Parameters:**
- `id` (string): Window identifier

**Example:**
```javascript
system.restoreWindow('notepad');
```

---

## Window Systems API

### ClassicWindowsSystem

#### Constructor Options

```javascript
{
  style: string,              // 'win95', 'win98', 'win2000', 'winxp'
  titleBarGradient: boolean,  // Enable gradient title bars
  borderWidth: number,        // Border thickness (2-4px)
  colors: {
    titleBarActive: string,
    titleBarInactive: string,
    titleBarTextActive: string,
    titleBarTextInactive: string,
    border: string,
    borderHighlight: string,
    borderShadow: string,
    borderDarkShadow: string,
    background: string
  }
}
```

#### Window-Specific Options

```javascript
{
  menuItems: Array<MenuItem>,  // Menu bar items
  statusBar: string            // Status bar text
}
```

**MenuItem Type:**
```javascript
{
  label: string,
  onClick: function
}
```

**Example:**
```javascript
const system = new ClassicWindowsSystem({
  style: 'winxp',
  titleBarGradient: true
});

const window = system.createWindow({
  id: 'explorer',
  title: 'My Computer',
  menuItems: [
    { label: 'File', onClick: () => showFileMenu() },
    { label: 'Edit', onClick: () => showEditMenu() },
    { label: 'View', onClick: () => showViewMenu() }
  ],
  statusBar: 'Ready',
  content: '<div>Explorer content</div>'
});
```

---

### ModernWindowsSystem

#### Constructor Options

```javascript
{
  style: string,           // 'win7', 'win8', 'win10', 'win11'
  accentColor: string,     // Accent color (hex)
  useAeroGlass: boolean,   // Enable blur effects
  useRoundedCorners: boolean, // Windows 11 corners
  transparency: number     // 0.0 - 1.0
}
```

#### Unique Features

**Snap Assist**: Automatically enabled, no configuration needed

**Snap Events**: Windows emit snap positions during drag

```javascript
// Snap detection happens automatically
// Guides appear when dragging near edges
// Release to snap window
```

**Example:**
```javascript
const system = new ModernWindowsSystem({
  style: 'win11',
  accentColor: '#0078d4',
  useRoundedCorners: true
});

const window = system.createWindow({
  id: 'settings',
  title: 'Settings',
  width: 900,
  height: 700,
  content: '<div>Settings panel</div>'
});
```

---

### MacClassicSystem

#### Constructor Options

```javascript
{
  style: string,              // 'classic', 'platinum'
  usePinstripes: boolean,     // Title bar pinstripes
  useRoundedCorners: boolean, // Rounded window corners
  colors: {
    titleBarActive: string,
    titleBarInactive: string,
    titleBarText: string,
    border: string,
    background: string
  }
}
```

#### Window-Specific Options

```javascript
{
  closable: boolean,      // Show close box
  collapsable: boolean,   // Window shade feature
  zoomable: boolean,      // Show zoom box
  onCollapse: function,   // Collapse callback
  onZoom: function        // Zoom callback
}
```

**Example:**
```javascript
const system = new MacClassicSystem({
  style: 'platinum',
  usePinstripes: true
});

const window = system.createWindow({
  id: 'finder',
  title: 'Macintosh HD',
  collapsable: true,
  zoomable: true,
  onCollapse: (isCollapsed) => {
    console.log('Window shade:', isCollapsed);
  },
  onZoom: (isZoomed) => {
    console.log('Zoomed:', isZoomed);
  }
});
```

---

### MacModernSystem

#### Constructor Options

```javascript
{
  style: string,          // 'aqua', 'brushed-metal', 'unified'
  accentColor: string,    // 'blue', 'graphite', 'red', etc.
  useBlur: boolean,       // Backdrop blur effect
  transparency: number,   // 0.0 - 1.0
  buttonPosition: string  // 'left' or 'right'
}
```

#### Window-Specific Options

```javascript
{
  toolbar: Array<ToolbarItem>, // Toolbar buttons
  closable: boolean,
  minimizable: boolean,
  zoomable: boolean
}
```

**ToolbarItem Type:**
```javascript
{
  label: string,
  onClick: function
}
```

**Example:**
```javascript
const system = new MacModernSystem({
  style: 'unified',
  accentColor: 'blue',
  useBlur: true
});

const window = system.createWindow({
  id: 'safari',
  title: 'Safari',
  toolbar: [
    { label: '←', onClick: () => goBack() },
    { label: '→', onClick: () => goForward() },
    { label: '🏠', onClick: () => goHome() }
  ]
});
```

---

### UnixWindowsSystem

#### Constructor Options

```javascript
{
  style: string,              // 'cde', 'motif', 'x11'
  focusMode: string,          // 'click' or 'follow-mouse'
  virtualDesktop: number,     // Current desktop (1-4)
  colors: {
    background: string,
    titleBarActive: string,
    titleBarInactive: string,
    border: string,
    borderShadow: string,
    text: string
  }
}
```

#### Window-Specific Options

```javascript
{
  virtualDesktop: number,       // Desktop assignment
  menuItems: Array<MenuItem>
}
```

#### Unique Methods

**switchVirtualDesktop(desktopNum)**

```javascript
switchVirtualDesktop(desktopNum: number): void
```

Switches to specified virtual desktop.

**getVisibleWindows()**

```javascript
getVisibleWindows(): Array<WindowData>
```

Returns windows on current virtual desktop.

**Example:**
```javascript
const system = new UnixWindowsSystem({
  style: 'cde',
  focusMode: 'click',
  virtualDesktop: 1
});

const window = system.createWindow({
  id: 'terminal',
  title: 'dtterm',
  virtualDesktop: 1,
  menuItems: [
    { label: 'Options', onClick: () => {} }
  ]
});

// Switch desktop
system.switchVirtualDesktop(2);

// Get visible windows
const visible = system.getVisibleWindows();
```

---

## Desktop Components API

### WindowsTaskbar

#### Constructor

```javascript
constructor()
```

No constructor options. Configure via `initialize()`.

---

#### initialize(container, config)

```javascript
initialize(container: HTMLElement, config: TaskbarConfig): WindowsTaskbar
```

**Parameters:**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `mode` | string | 'xp' | Taskbar style |
| `position` | string | 'bottom' | Position on screen |
| `autoHide` | boolean | false | Auto-hide taskbar |
| `height` | number | 40 | Taskbar height |
| `showClock` | boolean | true | Show clock |
| `showQuickLaunch` | boolean | true | Show quick launch |
| `showSystemTray` | boolean | true | Show system tray |
| `groupSimilar` | boolean | false | Group similar windows |
| `centerAlign` | boolean | false | Center taskbar (Win11) |

**Returns**: `this` (for chaining)

**Example:**
```javascript
const taskbar = new WindowsTaskbar();
taskbar.initialize(document.body, {
  mode: 'xp',
  position: 'bottom',
  showQuickLaunch: true
});
```

---

#### addWindow(windowInfo)

```javascript
addWindow(windowInfo: WindowInfo): void
```

**WindowInfo Type:**
```javascript
{
  id: string,
  title: string,
  icon: string  // Emoji or HTML
}
```

**Example:**
```javascript
taskbar.addWindow({
  id: 'notepad',
  title: 'Untitled - Notepad',
  icon: '📝'
});
```

---

#### removeWindow(windowId)

```javascript
removeWindow(windowId: string): void
```

---

#### setActiveWindow(windowId)

```javascript
setActiveWindow(windowId: string | null): void
```

Highlights active window button. Pass `null` to deactivate all.

---

#### setTheme(config)

```javascript
setTheme(config: TaskbarThemeConfig): void
```

**Example:**
```javascript
taskbar.setTheme({
  mode: '7',
  height: 44
});
```

---

#### destroy()

```javascript
destroy(): void
```

Cleans up taskbar and removes event listeners.

---

#### Events

**taskbar:windowActivate**
```javascript
taskbar.elements.taskbar.addEventListener('taskbar:windowActivate', (e) => {
  console.log('Activate window:', e.detail.windowId);
});
```

**taskbar:windowMinimize**
```javascript
taskbar.elements.taskbar.addEventListener('taskbar:windowMinimize', (e) => {
  console.log('Minimize window:', e.detail.windowId);
});
```

**taskbar:startMenuToggle**
```javascript
taskbar.elements.taskbar.addEventListener('taskbar:startMenuToggle', (e) => {
  console.log('Start menu open:', e.detail.open);
});
```

---

### MacDock

#### initialize(container, config)

```javascript
initialize(container: HTMLElement, config: DockConfig): MacDock
```

**Parameters:**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `position` | string | 'bottom' | Dock position |
| `magnification` | boolean | true | Icon magnification |
| `magnificationSize` | number | 2.5 | Magnification multiplier |
| `autoHide` | boolean | false | Auto-hide dock |
| `iconSize` | number | 48 | Icon size in pixels |
| `spacing` | number | 8 | Gap between icons |
| `showIndicators` | boolean | true | Running app dots |
| `showLabels` | boolean | true | Hover labels |
| `perspective` | boolean | true | 3D tilt effect |
| `theme` | string | 'glass' | Theme style |

**Example:**
```javascript
const dock = new MacDock();
dock.initialize(document.body, {
  position: 'bottom',
  magnification: true,
  theme: 'glass'
});
```

---

#### addApp(appInfo)

```javascript
addApp(appInfo: AppInfo): void
```

**AppInfo Type:**
```javascript
{
  id: string,
  name: string,
  icon: string,      // Emoji
  iconUrl?: string,  // Image URL (alternative)
  running: boolean
}
```

**Example:**
```javascript
dock.addApp({
  id: 'finder',
  name: 'Finder',
  icon: '📁',
  running: true
});
```

---

#### removeApp(appId)

```javascript
removeApp(appId: string): void
```

---

#### setAppRunning(appId, running)

```javascript
setAppRunning(appId: string, running: boolean): void
```

Updates running indicator for app.

---

#### bounceApp(appId, times)

```javascript
bounceApp(appId: string, times: number = 3): void
```

Bounces icon for notifications.

**Example:**
```javascript
// Mail notification
dock.bounceApp('mail', 5);
```

---

#### addFolder(folderInfo)

```javascript
addFolder(folderInfo: FolderInfo): void
```

Adds folder stack to dock.

**FolderInfo Type:**
```javascript
{
  id: string,
  name: string,
  icon: string,
  items: Array<any>  // Optional folder contents
}
```

---

#### Events

**dock:appLaunch**
```javascript
dock.elements.dockContainer.addEventListener('dock:appLaunch', (e) => {
  console.log('Launch app:', e.detail.app);
});
```

**dock:appActivate**
```javascript
dock.elements.dockContainer.addEventListener('dock:appActivate', (e) => {
  console.log('Activate app:', e.detail.app);
});
```

**dock:folderStack**
```javascript
dock.elements.dockContainer.addEventListener('dock:folderStack', (e) => {
  console.log('Show folder:', e.detail.folder);
});
```

---

### GNOMEPanel

#### initialize(container, config)

```javascript
initialize(container: HTMLElement, config: PanelConfig): GNOMEPanel
```

**Parameters:**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `mode` | string | 'gnome2' | Panel mode |
| `showTopPanel` | boolean | true | Show top panel |
| `showBottomPanel` | boolean | true | Show bottom panel |
| `showLeftLauncher` | boolean | false | Unity launcher |
| `showActivities` | boolean | true | GNOME 3 Activities |
| `showWorkspaces` | boolean | true | Workspace switcher |
| `workspaceCount` | number | 4 | Number of workspaces |
| `height` | number | 24 | Panel height |
| `theme` | string | 'dark' | Theme style |

**Example:**
```javascript
const panel = new GNOMEPanel();
panel.initialize(document.body, {
  mode: 'gnome2',
  showBottomPanel: true,
  workspaceCount: 4
});
```

---

#### addWindow(windowInfo)

```javascript
addWindow(windowInfo: WindowInfo): void
```

---

#### removeWindow(windowId)

```javascript
removeWindow(windowId: string): void
```

---

#### Events

**gnome:menuOpen**
```javascript
document.addEventListener('gnome:menuOpen', (e) => {
  console.log('Menu type:', e.detail.menuType);
});
```

**gnome:activitiesOpen**
```javascript
document.addEventListener('gnome:activitiesOpen', () => {
  showActivitiesOverview();
});
```

**gnome:workspaceSwitch**
```javascript
document.addEventListener('gnome:workspaceSwitch', (e) => {
  console.log('Workspace:', e.detail.workspaceId);
});
```

**gnome:windowActivate**
```javascript
document.addEventListener('gnome:windowActivate', (e) => {
  console.log('Window:', e.detail.windowId);
});
```

---

### KDEPanel

#### initialize(container, config)

```javascript
initialize(container: HTMLElement, config: KDEPanelConfig): KDEPanel
```

**Parameters:**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `mode` | string | 'kde3' | Panel mode |
| `position` | string | 'bottom' | Panel position |
| `height` | number | 46 | Panel height |
| `autoHide` | boolean | false | Auto-hide panel |
| `customizable` | boolean | true | Enable customization |
| `showKMenu` | boolean | true | Show K Menu |
| `showTaskManager` | boolean | true | Show task manager |
| `showSystemTray` | boolean | true | Show system tray |
| `showPager` | boolean | true | Virtual desktop pager |
| `showQuickLaunch` | boolean | true | Quick launch icons |
| `groupTasks` | boolean | false | Group similar tasks |
| `theme` | string | 'oxygen' | Theme style |

**Example:**
```javascript
const panel = new KDEPanel();
panel.initialize(document.body, {
  mode: 'plasma',
  theme: 'breeze',
  customizable: true
});
```

---

#### addWindow(windowInfo)

```javascript
addWindow(windowInfo: WindowInfo): void
```

---

#### removeWindow(windowId)

```javascript
removeWindow(windowId: string): void
```

---

#### setActiveWindow(windowId)

```javascript
setActiveWindow(windowId: string): void
```

---

#### addWidget(widgetInfo)

```javascript
addWidget(widgetInfo: WidgetInfo): void
```

**WidgetInfo Type:**
```javascript
{
  id: string,
  content: string  // HTML content
}
```

**Example:**
```javascript
panel.addWidget({
  id: 'weather',
  content: '<div>☀️ 72°F</div>'
});
```

---

#### removeWidget(widgetId)

```javascript
removeWidget(widgetId: string): void
```

---

#### setAutoHide(enabled)

```javascript
setAutoHide(enabled: boolean): void
```

---

#### Events

**kde:kMenuToggle**
```javascript
panel.elements.panel.addEventListener('kde:kMenuToggle', () => {
  showKMenu();
});
```

**kde:windowActivate**
```javascript
panel.elements.panel.addEventListener('kde:windowActivate', (e) => {
  console.log('Window:', e.detail.windowId);
});
```

**kde:workspaceSwitch**
```javascript
panel.elements.panel.addEventListener('kde:workspaceSwitch', (e) => {
  console.log('Workspace:', e.detail.workspaceId);
});
```

**kde:clockClick**
```javascript
panel.elements.panel.addEventListener('kde:clockClick', () => {
  showCalendar();
});
```

**kde:taskContextMenu**
```javascript
panel.elements.panel.addEventListener('kde:taskContextMenu', (e) => {
  showContextMenu(e.detail.windowId, e.detail.x, e.detail.y);
});
```

---

## Configuration Schemas

### WindowConfig

Complete window configuration schema:

```javascript
{
  // Identification
  id: string,                    // Unique identifier

  // Content
  title: string,                 // Title bar text
  content: string,               // HTML content
  icon: string | null,           // Icon (SVG/emoji)

  // Dimensions & Position
  width: number,                 // Width in pixels
  height: number,                // Height in pixels
  x: number | null,              // X position (null = center)
  y: number | null,              // Y position (null = center)

  // Features
  resizable: boolean,            // Enable resizing
  minimizable: boolean,          // Show minimize button
  maximizable: boolean,          // Show maximize button
  closable: boolean,             // Show close button (Mac)
  collapsable: boolean,          // Window shade (Mac Classic)
  zoomable: boolean,             // Zoom box (Mac)

  // Component-Specific
  menuItems: Array<MenuItem>,    // Menu bar (Windows, UNIX)
  toolbar: Array<ToolbarItem>,   // Toolbar (Mac Modern)
  statusBar: string,             // Status bar text (Windows)
  virtualDesktop: number,        // Desktop assignment (UNIX)

  // Event Handlers
  onClose: () => boolean,        // Return false to prevent
  onFocus: () => void,
  onMinimize: () => void,
  onMaximize: (isMaximized: boolean) => void,
  onCollapse: (isCollapsed: boolean) => void,  // Mac Classic
  onZoom: (isZoomed: boolean) => void          // Mac
}
```

---

### ThemeConfig

Window system theme configuration:

```javascript
{
  // Classic Windows
  style: string,                 // OS version
  titleBarGradient: boolean,
  borderWidth: number,
  colors: {
    titleBarActive: string,
    titleBarInactive: string,
    titleBarTextActive: string,
    titleBarTextInactive: string,
    border: string,
    borderHighlight: string,
    borderShadow: string,
    borderDarkShadow: string,
    background: string
  },

  // Modern Windows
  accentColor: string,
  useAeroGlass: boolean,
  useRoundedCorners: boolean,
  transparency: number,

  // Mac Classic
  usePinstripes: boolean,
  useRoundedCorners: boolean,

  // Mac Modern
  buttonPosition: string,        // 'left' or 'right'
  useBlur: boolean,

  // UNIX
  focusMode: string,             // 'click' or 'follow-mouse'
  virtualDesktop: number
}
```

---

## Events Reference

### Event Naming Convention

All custom events follow the pattern: `componentType:eventName`

**Examples:**
- `taskbar:windowActivate`
- `dock:appLaunch`
- `gnome:menuOpen`
- `kde:kMenuToggle`

---

### Event Detail Objects

**Window Events:**
```javascript
{
  windowId: string
}
```

**App Events (Dock):**
```javascript
{
  app: {
    id: string,
    name: string,
    icon: string,
    running: boolean
  }
}
```

**Menu Events:**
```javascript
{
  menuType: string,      // 'applications', 'places', 'system'
  open: boolean          // For toggle events
}
```

**Workspace Events:**
```javascript
{
  workspaceId: number
}
```

**Context Menu Events:**
```javascript
{
  windowId: string,
  x: number,
  y: number
}
```

---

### Listening to Events

**Component-Level Events:**

```javascript
// Taskbar events
taskbar.elements.taskbar.addEventListener('taskbar:windowActivate', handler);

// Dock events
dock.elements.dockContainer.addEventListener('dock:appLaunch', handler);

// Panel events (attach to specific element)
panel.elements.panel.addEventListener('kde:kMenuToggle', handler);
```

**Document-Level Events (GNOME):**

```javascript
// GNOME emits to document
document.addEventListener('gnome:menuOpen', handler);
document.addEventListener('gnome:workspaceSwitch', handler);
```

---

### Custom Event Creation

Create your own events for application logic:

```javascript
// Dispatch custom event
const event = new CustomEvent('app:customEvent', {
  detail: { data: 'value' }
});
element.dispatchEvent(event);

// Listen for custom event
element.addEventListener('app:customEvent', (e) => {
  console.log('Data:', e.detail.data);
});
```

---

## TypeScript Definitions

TypeScript type definitions for the component library (pseudo-code):

### Core Types

```typescript
// Window System Types
interface WindowConfig {
  id?: string;
  title?: string;
  content?: string;
  icon?: string | null;
  width?: number;
  height?: number;
  x?: number | null;
  y?: number | null;
  resizable?: boolean;
  minimizable?: boolean;
  maximizable?: boolean;
  menuItems?: MenuItem[];
  statusBar?: string;
  onClose?: () => boolean;
  onFocus?: () => void;
  onMinimize?: () => void;
  onMaximize?: (isMaximized: boolean) => void;
}

interface MenuItem {
  label: string;
  onClick: () => void;
}

interface WindowData {
  element: HTMLElement;
  title: string;
  icon: string | null;
  onClose: (() => boolean) | null;
  onFocus: (() => void) | null;
  onMinimize: (() => void) | null;
  onMaximize: ((isMaximized: boolean) => void) | null;
  isMinimized: boolean;
  isMaximized: boolean;
  previousState: WindowState | null;
}

interface WindowState {
  left: string;
  top: string;
  width: string;
  height: string;
}

// Window System Classes
declare class ClassicWindowsSystem {
  constructor(options?: ClassicWindowsOptions);
  createWindow(config: WindowConfig): HTMLElement;
  setTheme(config: ThemeConfig): void;
  destroy(id: string): void;
  getWindow(id: string): WindowData | null;
  getAllWindows(): WindowData[];
  restoreWindow(id: string): void;
}

declare class ModernWindowsSystem {
  constructor(options?: ModernWindowsOptions);
  createWindow(config: WindowConfig): HTMLElement;
  setTheme(config: ThemeConfig): void;
  destroy(id: string): void;
  getWindow(id: string): WindowData | null;
  getAllWindows(): WindowData[];
  restoreWindow(id: string): void;
}

declare class MacClassicSystem {
  constructor(options?: MacClassicOptions);
  createWindow(config: MacClassicWindowConfig): HTMLElement;
  setTheme(config: ThemeConfig): void;
  destroy(id: string): void;
  getWindow(id: string): WindowData | null;
  getAllWindows(): WindowData[];
}

declare class MacModernSystem {
  constructor(options?: MacModernOptions);
  createWindow(config: MacModernWindowConfig): HTMLElement;
  setTheme(config: ThemeConfig): void;
  destroy(id: string): void;
  getWindow(id: string): WindowData | null;
  getAllWindows(): WindowData[];
  restoreWindow(id: string): void;
}

declare class UnixWindowsSystem {
  constructor(options?: UnixWindowsOptions);
  createWindow(config: UnixWindowConfig): HTMLElement;
  setTheme(config: ThemeConfig): void;
  destroy(id: string): void;
  getWindow(id: string): WindowData | null;
  getAllWindows(): WindowData[];
  restoreWindow(id: string): void;
  switchVirtualDesktop(desktopNum: number): void;
  getVisibleWindows(): WindowData[];
}

// Desktop Components
declare class WindowsTaskbar {
  constructor();
  initialize(container: HTMLElement, config?: TaskbarConfig): this;
  addWindow(windowInfo: WindowInfo): void;
  removeWindow(windowId: string): void;
  setActiveWindow(windowId: string | null): void;
  setTheme(config: TaskbarThemeConfig): void;
  destroy(): void;
  elements: {
    taskbar: HTMLElement;
    startButton: HTMLElement;
    taskButtons: HTMLElement;
    systemTray: HTMLElement;
    clock: HTMLElement;
  };
}

declare class MacDock {
  constructor();
  initialize(container: HTMLElement, config?: DockConfig): this;
  addApp(appInfo: AppInfo): void;
  removeApp(appId: string): void;
  setAppRunning(appId: string, running: boolean): void;
  bounceApp(appId: string, times?: number): void;
  addFolder(folderInfo: FolderInfo): void;
  setTheme(config: DockThemeConfig): void;
  destroy(): void;
  elements: {
    dockContainer: HTMLElement;
    dock: HTMLElement;
    iconsContainer: HTMLElement;
    label: HTMLElement;
  };
}

declare class GNOMEPanel {
  constructor();
  initialize(container: HTMLElement, config?: GNOMEPanelConfig): this;
  addWindow(windowInfo: WindowInfo): void;
  removeWindow(windowId: string): void;
  setTheme(config: ThemeConfig): void;
  destroy(): void;
}

declare class KDEPanel {
  constructor();
  initialize(container: HTMLElement, config?: KDEPanelConfig): this;
  addWindow(windowInfo: WindowInfo): void;
  removeWindow(windowId: string): void;
  setActiveWindow(windowId: string): void;
  addWidget(widgetInfo: WidgetInfo): void;
  removeWidget(widgetId: string): void;
  setAutoHide(enabled: boolean): void;
  setTheme(config: ThemeConfig): void;
  destroy(): void;
}

// Configuration Interfaces
interface ClassicWindowsOptions {
  style?: 'win95' | 'win98' | 'win2000' | 'winxp';
  titleBarGradient?: boolean;
  borderWidth?: number;
  colors?: {
    titleBarActive?: string;
    titleBarInactive?: string;
    titleBarTextActive?: string;
    titleBarTextInactive?: string;
    border?: string;
    borderHighlight?: string;
    borderShadow?: string;
    borderDarkShadow?: string;
    background?: string;
  };
}

interface ModernWindowsOptions {
  style?: 'win7' | 'win8' | 'win10' | 'win11';
  accentColor?: string;
  useAeroGlass?: boolean;
  useRoundedCorners?: boolean;
  transparency?: number;
}

interface MacClassicOptions {
  style?: 'classic' | 'platinum';
  usePinstripes?: boolean;
  useRoundedCorners?: boolean;
  colors?: {
    titleBarActive?: string;
    titleBarInactive?: string;
    titleBarText?: string;
    border?: string;
    background?: string;
  };
}

interface MacModernOptions {
  style?: 'aqua' | 'brushed-metal' | 'unified';
  accentColor?: string;
  useBlur?: boolean;
  transparency?: number;
  buttonPosition?: 'left' | 'right';
}

interface UnixWindowsOptions {
  style?: 'cde' | 'motif' | 'x11';
  focusMode?: 'click' | 'follow-mouse';
  virtualDesktop?: number;
  colors?: {
    background?: string;
    titleBarActive?: string;
    titleBarInactive?: string;
    border?: string;
    borderShadow?: string;
    text?: string;
  };
}

interface TaskbarConfig {
  mode?: '95' | '98' | 'xp' | '7' | '10' | '11';
  position?: 'top' | 'bottom' | 'left' | 'right';
  autoHide?: boolean;
  height?: number;
  showClock?: boolean;
  showQuickLaunch?: boolean;
  showSystemTray?: boolean;
  groupSimilar?: boolean;
  centerAlign?: boolean;
}

interface DockConfig {
  position?: 'bottom' | 'left' | 'right';
  magnification?: boolean;
  magnificationSize?: number;
  autoHide?: boolean;
  iconSize?: number;
  spacing?: number;
  showIndicators?: boolean;
  showLabels?: boolean;
  perspective?: boolean;
  theme?: 'glass' | 'solid' | 'translucent';
}

interface WindowInfo {
  id: string;
  title: string;
  icon?: string;
}

interface AppInfo {
  id: string;
  name: string;
  icon: string;
  iconUrl?: string;
  running: boolean;
}

interface FolderInfo {
  id: string;
  name: string;
  icon: string;
  items?: any[];
}

interface WidgetInfo {
  id: string;
  content: string;
}

// Event Detail Types
interface WindowEventDetail {
  windowId: string;
}

interface AppEventDetail {
  app: AppInfo;
}

interface MenuEventDetail {
  menuType?: string;
  open?: boolean;
}

interface WorkspaceEventDetail {
  workspaceId: number;
}

interface ContextMenuEventDetail {
  windowId: string;
  x: number;
  y: number;
}
```

---

## Error Handling

### Common Errors

**Window Not Found:**
```javascript
const windowData = system.getWindow('nonexistent');
if (!windowData) {
  console.error('Window not found');
}
```

**Invalid Configuration:**
```javascript
try {
  const system = new ClassicWindowsSystem({
    style: 'invalid' // Will use default 'win95'
  });
} catch (error) {
  console.error('Configuration error:', error);
}
```

**Duplicate Window ID:**
```javascript
// Components handle duplicates silently
// Second window with same ID is ignored
taskbar.addWindow({ id: 'duplicate', title: 'First' });
taskbar.addWindow({ id: 'duplicate', title: 'Second' }); // Ignored
```

---

## Best Practices

### Type Safety

```javascript
// Validate window ID before operations
function safeDestroyWindow(id) {
  if (typeof id !== 'string' || !id) {
    console.error('Invalid window ID');
    return;
  }

  const window = system.getWindow(id);
  if (window) {
    system.destroy(id);
  }
}
```

### Event Handling

```javascript
// Always clean up event listeners
const handler = (e) => {
  console.log(e.detail);
};

taskbar.elements.taskbar.addEventListener('taskbar:windowActivate', handler);

// Clean up
function cleanup() {
  taskbar.elements.taskbar.removeEventListener('taskbar:windowActivate', handler);
  taskbar.destroy();
}
```

### Error Prevention

```javascript
// Check component initialization
if (!taskbar.elements.taskbar) {
  console.error('Taskbar not initialized');
  return;
}

// Validate callback return values
const window = system.createWindow({
  onClose: () => {
    // Always return boolean
    return confirm('Close?');
  }
});
```

---

**Document Version**: 1.0
**Last Updated**: 2025-11-11
**Word Count**: ~2,100 words
