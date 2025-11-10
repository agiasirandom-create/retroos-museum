# Window Management System - Quick Reference Card

## Installation

```html
<!-- Include CSS -->
<link rel="stylesheet" href="/assets/css/window-system.css">

<!-- Include JavaScript (in order) -->
<script src="/assets/js/window-manager.js"></script>
<script src="/assets/js/menu-system.js"></script>
<script src="/assets/js/desktop.js"></script>
<script src="/assets/js/main.js"></script>
```

## Common Tasks

### Create a Window
```javascript
RetroOS.createWindow({
  title: 'My Window',
  content: '<p>Content here</p>',
  width: 400,
  height: 300
});
```

### Show Notification
```javascript
RetroOS.notify('Title', 'Message');
```

### Show Confirmation
```javascript
RetroOS.confirm('Title', 'Message?',
  () => console.log('Confirmed'),
  () => console.log('Cancelled')
);
```

### Create Menu
```javascript
RetroOS.createMenu({
  trigger: document.querySelector('[data-menu="file"]'),
  items: [
    { label: 'Item 1', action: () => {} },
    { type: 'separator' },
    { label: 'Item 2', action: () => {} }
  ]
});
```

### Add Desktop Icon
```javascript
RetroOS.addDesktopIcon({
  label: 'My App',
  icon: '📱',
  x: 0,
  y: 0,
  onOpen: () => {}
});
```

## Window Options

```javascript
{
  id: 'unique-id',           // Optional
  title: 'Window Title',     // Default: 'Untitled Window'
  content: '<p>HTML</p>',    // Required
  width: 400,                // Default: 400
  height: 300,               // Default: 300
  x: 100,                    // Optional (centered)
  y: 100,                    // Optional (centered)
  minWidth: 200,             // Default: 200
  minHeight: 150,            // Default: 150
  resizable: true,           // Default: true
  maximizable: true,         // Default: true
  minimizable: true,         // Default: true
  modal: false,              // Default: false
  onClose: (win) => {},      // Optional
  onFocus: (win) => {},      // Optional
  onMinimize: (win) => {},   // Optional
  onMaximize: (win) => {}    // Optional
}
```

## Window Methods

```javascript
const win = RetroOS.createWindow({ /* options */ });

win.focus();              // Bring to front
win.minimize();           // Minimize
win.maximize();           // Maximize
win.restore();            // Restore from min/max
win.toggleMaximize();     // Toggle maximize
win.close();              // Close
win.setTitle('New');      // Update title
win.setContent('<p>');    // Update content
```

## Menu Item Options

```javascript
{
  label: 'Menu Item',        // Required
  icon: '📄',                // Optional (emoji/HTML)
  shortcut: 'Ctrl+N',        // Optional
  disabled: false,           // Default: false
  action: () => {},          // Click handler
  submenu: [],               // Nested items
  type: 'separator'          // Or use for separators
}
```

## Desktop Icon Options

```javascript
{
  id: 'unique-id',           // Optional
  label: 'Icon Label',       // Required
  icon: '📱',                // Required (emoji/URL/HTML)
  x: 0,                      // Grid X position
  y: 0,                      // Grid Y position
  onOpen: (icon) => {},      // Double-click
  onSelect: (icon) => {},    // Selected
  onDelete: (icon) => {},    // Delete pressed
  contextMenuItems: []       // Custom context menu
}
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt+F4` | Close active window |
| `Alt+Tab` | Switch windows |
| `Ctrl+A` | Select all icons |
| `Delete` | Delete selected icons |
| `Escape` | Close menus |
| `Arrow Keys` | Navigate menus/items |
| `Enter/Space` | Activate item |

## Access Managers

```javascript
RetroOS.windowManager   // Window manager instance
RetroOS.menuSystem      // Menu system instance
RetroOS.desktop         // Desktop instance
```

## WindowManager Methods

```javascript
const wm = RetroOS.windowManager;

wm.getWindow('id')       // Get window by ID
wm.getAllWindows()       // Get all windows
wm.closeWindow('id')     // Close by ID
wm.closeAll()            // Close all
wm.minimizeAll()         // Minimize all
```

## Desktop Methods

```javascript
const desktop = RetroOS.desktop;

desktop.getIcon('id')           // Get icon by ID
desktop.removeIcon('id')        // Remove icon
desktop.getAllIcons()           // Get all icons
desktop.getSelectedIcons()      // Get selected
desktop.clearSelection()        // Clear selection
```

## HTML Markup

### Pre-defined Window
```html
<div data-os-window
     data-window-id="my-window"
     data-window-title="Title"
     data-window-width="500"
     data-window-height="400">
  Content here
</div>
```

### Pre-defined Icon
```html
<div data-desktop-icon
     data-icon-id="my-icon"
     data-icon-label="My App"
     data-icon-image="📱"
     data-icon-x="0"
     data-icon-y="0">
</div>
```

### Menu Bar
```html
<div class="menu-bar">
  <div data-menu="file">File</div>
  <div data-menu="edit">Edit</div>
</div>
```

## CSS Customization

```css
/* Window background */
.os-window {
  background: #e0e0e0;
}

/* Title bar */
.window-titlebar {
  background: linear-gradient(to right, #1e90ff, #4169e1);
}

/* Desktop background */
.desktop-container {
  background: #008080;
}

/* Button style */
.btn {
  background: #c0c0c0;
  border: 2px solid;
}
```

## Common Patterns

### Singleton Window
```javascript
function openSettings() {
  let win = RetroOS.windowManager.getWindow('settings');
  if (win) {
    win.focus();
    return;
  }

  win = RetroOS.createWindow({
    id: 'settings',
    title: 'Settings',
    content: '<p>Settings</p>'
  });
}
```

### Confirm Before Close
```javascript
RetroOS.createWindow({
  title: 'Editor',
  content: '<textarea></textarea>',
  onClose: (win) => {
    if (hasUnsavedChanges) {
      RetroOS.confirm('Unsaved', 'Close anyway?',
        () => true,   // Allow close
        () => false   // Prevent close
      );
      return false;
    }
    return true;
  }
});
```

### Dynamic Content
```javascript
const win = RetroOS.createWindow({
  title: 'Loading...',
  content: '<p>Loading...</p>'
});

fetch('/api/data')
  .then(res => res.json())
  .then(data => {
    win.setTitle('Data Loaded');
    win.setContent(renderData(data));
  });
```

## Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full support |
| Firefox | 88+ | ✅ Full support |
| Safari | 14+ | ✅ Full support |
| Edge | 90+ | ✅ Full support |
| IE11 | - | ⚠️ Needs polyfills |

### IE11 Polyfills
```html
<script src="https://cdn.polyfill.io/v3/polyfill.min.js?features=Map,Set,Array.from"></script>
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Windows not appearing | Check WindowManager initialized |
| Drag not working | Ensure not maximized |
| Menus not opening | Check MenuSystem initialized |
| Icons not showing | Verify desktop container exists |

## Performance Tips

1. **Limit windows**: Max 20 concurrent
2. **Reuse windows**: Check existence first
3. **Clean callbacks**: Remove listeners in onClose
4. **Simple content**: Avoid heavy HTML

## Links

- **Full API**: See `WINDOW-SYSTEM-API.md`
- **Examples**: See `USAGE-EXAMPLES.md`
- **Architecture**: See `ARCHITECTURE.md`
- **Demo**: Open `window-system-demo.html`

---

**Quick Help**: All functions return instances for chaining:
```javascript
RetroOS.createWindow({ title: 'Test' })
  .setContent('<p>New</p>')
  .focus();
```
