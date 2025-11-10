# Window Management System API Documentation

## Overview

The RetroOS Museum Window Management System provides a complete solution for creating draggable, resizable windows with proper z-index layering, desktop icon management, and menu systems. Built for compatibility across modern browsers including IE11+.

## Architecture

### Core Components

1. **WindowManager** - Orchestrates all window instances, manages z-index stacking
2. **Window** - Individual window instances with drag/resize/focus functionality
3. **MenuSystem** - Menu bar with dropdown menus and keyboard navigation
4. **Desktop** - Desktop icon management with selection and context menus

### File Structure

```
/src/assets/js/
├── window-manager.js    # Window management core
├── menu-system.js       # Menu bar and dropdowns
├── desktop.js          # Desktop icon system
└── main.js             # Initialization and global API

/src/assets/css/
└── window-system.css   # Complete styling for all components
```

---

## Global API (RetroOS namespace)

All functionality is exposed through the global `RetroOS` object.

### RetroOS.createWindow(options)

Creates a new window instance.

**Parameters:**
- `options.id` (string, optional) - Unique window identifier
- `options.title` (string, default: 'Untitled Window') - Window title
- `options.content` (string, required) - HTML content for window body
- `options.width` (number, default: 400) - Window width in pixels
- `options.height` (number, default: 300) - Window height in pixels
- `options.x` (number, optional) - Initial X position (centered if omitted)
- `options.y` (number, optional) - Initial Y position (centered if omitted)
- `options.minWidth` (number, default: 200) - Minimum window width
- `options.minHeight` (number, default: 150) - Minimum window height
- `options.resizable` (boolean, default: true) - Enable resizing
- `options.maximizable` (boolean, default: true) - Enable maximize button
- `options.minimizable` (boolean, default: true) - Enable minimize button
- `options.modal` (boolean, default: false) - Modal window (blocks other interactions)
- `options.onClose` (function, optional) - Callback when window closes
- `options.onFocus` (function, optional) - Callback when window gains focus
- `options.onMinimize` (function, optional) - Callback when window minimizes
- `options.onMaximize` (function, optional) - Callback when window maximizes

**Returns:** Window instance

**Example:**
```javascript
const myWindow = RetroOS.createWindow({
  id: 'my-app',
  title: 'My Application',
  content: '<div><h2>Hello World</h2><p>Window content here</p></div>',
  width: 500,
  height: 400,
  x: 100,
  y: 100,
  onClose: (window) => {
    console.log('Window closed');
    return true; // Return false to prevent close
  }
});
```

### RetroOS.notify(title, message, options)

Shows a notification window.

**Parameters:**
- `title` (string) - Notification title
- `message` (string) - Notification message (HTML supported)
- `options.width` (number, default: 300) - Window width
- `options.height` (number, default: 150) - Window height
- `options.modal` (boolean, default: false) - Modal notification
- `options.onClose` (function, optional) - Callback when closed

**Returns:** Window instance

**Example:**
```javascript
RetroOS.notify('Success', 'File saved successfully!');
```

### RetroOS.confirm(title, message, onConfirm, onCancel)

Shows a confirmation dialog.

**Parameters:**
- `title` (string) - Dialog title
- `message` (string) - Dialog message
- `onConfirm` (function) - Callback when OK clicked
- `onCancel` (function) - Callback when Cancel clicked

**Returns:** Window instance

**Example:**
```javascript
RetroOS.confirm(
  'Delete File',
  'Are you sure you want to delete this file?',
  () => {
    console.log('File deleted');
  },
  () => {
    console.log('Cancelled');
  }
);
```

### RetroOS.alert(title, message, onClose)

Shows an alert dialog.

**Parameters:**
- `title` (string) - Dialog title
- `message` (string) - Dialog message
- `onClose` (function, optional) - Callback when closed

**Returns:** Window instance

**Example:**
```javascript
RetroOS.alert('Error', 'An error occurred!', () => {
  console.log('Alert closed');
});
```

### RetroOS.createMenu(options)

Creates a menu in the menu bar.

**Parameters:**
- `options.id` (string, optional) - Unique menu identifier
- `options.label` (string, required) - Menu label text
- `options.trigger` (HTMLElement, required) - Trigger element
- `options.items` (Array, required) - Menu items array

**Menu Item Structure:**
```javascript
{
  label: 'Menu Item',        // Item label
  icon: '📄',                // Icon (emoji or HTML)
  shortcut: 'Ctrl+N',        // Keyboard shortcut text
  disabled: false,           // Disabled state
  action: () => {},          // Click callback
  submenu: [],               // Submenu items (nested)
  type: 'separator'          // Or use for separators
}
```

**Returns:** Menu instance

**Example:**
```javascript
const fileMenu = RetroOS.createMenu({
  id: 'file-menu',
  label: 'File',
  trigger: document.querySelector('[data-menu="file"]'),
  items: [
    {
      label: 'New',
      icon: '📄',
      shortcut: 'Ctrl+N',
      action: () => console.log('New file')
    },
    { type: 'separator' },
    {
      label: 'Open Recent',
      submenu: [
        { label: 'file1.txt', action: () => {} },
        { label: 'file2.txt', action: () => {} }
      ]
    },
    { type: 'separator' },
    {
      label: 'Exit',
      action: () => console.log('Exit')
    }
  ]
});
```

### RetroOS.addDesktopIcon(options)

Adds an icon to the desktop.

**Parameters:**
- `options.id` (string, optional) - Unique icon identifier
- `options.label` (string, required) - Icon label text
- `options.icon` (string, required) - Icon image (emoji, URL, or HTML)
- `options.x` (number, optional) - Grid X position
- `options.y` (number, optional) - Grid Y position
- `options.onOpen` (function, optional) - Callback when double-clicked
- `options.onSelect` (function, optional) - Callback when selected
- `options.onDelete` (function, optional) - Callback when deleted
- `options.contextMenuItems` (Array, optional) - Custom context menu

**Returns:** DesktopIcon instance

**Example:**
```javascript
RetroOS.addDesktopIcon({
  id: 'my-computer',
  label: 'My Computer',
  icon: '🖥️',
  x: 0,
  y: 0,
  onOpen: (icon) => {
    RetroOS.createWindow({
      title: 'My Computer',
      content: '<p>Computer window</p>',
      width: 500,
      height: 400
    });
  }
});
```

---

## Window Instance Methods

### window.focus()

Brings window to front and activates it.

**Returns:** Window instance (for chaining)

**Example:**
```javascript
myWindow.focus();
```

### window.minimize()

Minimizes the window.

**Returns:** Window instance

**Example:**
```javascript
myWindow.minimize();
```

### window.maximize()

Maximizes the window to full screen.

**Returns:** Window instance

**Example:**
```javascript
myWindow.maximize();
```

### window.restore()

Restores window from minimized or maximized state.

**Returns:** Window instance

**Example:**
```javascript
myWindow.restore();
```

### window.toggleMaximize()

Toggles between maximized and normal state.

**Returns:** Window instance

**Example:**
```javascript
myWindow.toggleMaximize();
```

### window.close()

Closes the window.

**Example:**
```javascript
myWindow.close();
```

### window.setTitle(title)

Updates the window title.

**Parameters:**
- `title` (string) - New title

**Returns:** Window instance

**Example:**
```javascript
myWindow.setTitle('New Title');
```

### window.setContent(content)

Updates the window content.

**Parameters:**
- `content` (string) - New HTML content

**Returns:** Window instance

**Example:**
```javascript
myWindow.setContent('<p>New content</p>');
```

---

## WindowManager Methods

Access via `RetroOS.windowManager`

### windowManager.getWindow(id)

Gets a window by ID.

**Parameters:**
- `id` (string) - Window identifier

**Returns:** Window instance or undefined

**Example:**
```javascript
const win = RetroOS.windowManager.getWindow('my-window');
```

### windowManager.getAllWindows()

Gets all window instances.

**Returns:** Array of Window instances

**Example:**
```javascript
const windows = RetroOS.windowManager.getAllWindows();
console.log(`${windows.length} windows open`);
```

### windowManager.closeWindow(id)

Closes a specific window by ID.

**Parameters:**
- `id` (string) - Window identifier

**Example:**
```javascript
RetroOS.windowManager.closeWindow('my-window');
```

### windowManager.closeAll()

Closes all windows.

**Example:**
```javascript
RetroOS.windowManager.closeAll();
```

### windowManager.minimizeAll()

Minimizes all windows.

**Example:**
```javascript
RetroOS.windowManager.minimizeAll();
```

---

## Desktop Methods

Access via `RetroOS.desktop`

### desktop.getIcon(id)

Gets an icon by ID.

**Parameters:**
- `id` (string) - Icon identifier

**Returns:** DesktopIcon instance or undefined

**Example:**
```javascript
const icon = RetroOS.desktop.getIcon('my-computer');
```

### desktop.removeIcon(id)

Removes an icon from desktop.

**Parameters:**
- `id` (string) - Icon identifier

**Example:**
```javascript
RetroOS.desktop.removeIcon('my-computer');
```

### desktop.getAllIcons()

Gets all desktop icons.

**Returns:** Array of DesktopIcon instances

**Example:**
```javascript
const icons = RetroOS.desktop.getAllIcons();
```

### desktop.getSelectedIcons()

Gets currently selected icons.

**Returns:** Array of selected DesktopIcon instances

**Example:**
```javascript
const selected = RetroOS.desktop.getSelectedIcons();
console.log(`${selected.length} icons selected`);
```

### desktop.clearSelection()

Clears all icon selections.

**Example:**
```javascript
RetroOS.desktop.clearSelection();
```

---

## Keyboard Shortcuts

### Window Management
- **Alt+F4** - Close active window
- **Alt+Tab** - Cycle through windows

### Desktop
- **Ctrl+A** - Select all icons
- **Delete** - Delete selected icons (if onDelete handler defined)

### Menus
- **Escape** - Close open menus
- **Arrow Left/Right** - Navigate between menus in menu bar
- **Arrow Up/Down** - Navigate menu items
- **Enter/Space** - Activate menu item
- **Home** - First menu item
- **End** - Last menu item

---

## HTML Markup Integration

### Pre-defined Windows

Create windows declaratively in HTML:

```html
<div data-os-window
     data-window-id="my-window"
     data-window-title="My Window"
     data-window-width="500"
     data-window-height="400"
     data-window-x="100"
     data-window-y="100">
  <h2>Window Content</h2>
  <p>This will become a window automatically.</p>
</div>
```

### Pre-defined Desktop Icons

```html
<div data-desktop-icon
     data-icon-id="my-icon"
     data-icon-label="My Application"
     data-icon-image="🖥️"
     data-icon-x="0"
     data-icon-y="0"
     data-icon-action="openMyApp">
</div>
```

### Menu Bar Structure

```html
<div class="menu-bar">
  <div data-menu="file">File</div>
  <div data-menu="edit">Edit</div>
  <div data-menu="help">Help</div>
</div>
```

---

## State Persistence

The window manager automatically saves and restores window positions and sizes to `localStorage`:

- Window position (x, y)
- Window dimensions (width, height)
- Window state (normal, minimized, maximized)

State is saved on:
- Drag end
- Resize end
- Window close

State is restored on:
- Window creation (if ID matches saved state)

**Disable persistence:**
```javascript
// Don't provide an ID to disable state saving
RetroOS.createWindow({
  // id: 'my-window', // Omit for no persistence
  title: 'Temporary Window',
  content: '<p>No state saved</p>'
});
```

---

## Browser Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- IE11 (with polyfills)

### Required Polyfills for IE11
```html
<!-- Add before window-manager.js -->
<script src="https://cdn.polyfill.io/v3/polyfill.min.js?features=Map,Set,Array.from"></script>
```

### CSS Features Used
- Flexbox (supported in all target browsers)
- CSS Grid (desktop icon layout - fallback to flexbox for IE11)
- CSS Variables (minimal use - fallback values provided)

---

## Performance Considerations

### Window Limits
- Recommended maximum: 20 concurrent windows
- Each window creates ~10 DOM elements
- Z-index range: 1000-10000 (resets when limit reached)

### Memory Management
- Windows are fully removed from DOM on close
- Event listeners are cleaned up automatically
- LocalStorage has ~5MB limit for state

### Optimization Tips

1. **Minimize content complexity:**
```javascript
// Good - simple content
RetroOS.createWindow({
  title: 'Simple',
  content: '<p>Text content</p>'
});

// Avoid - heavy content
RetroOS.createWindow({
  title: 'Heavy',
  content: '<div>' + complexHeavyHTML + '</div>'
});
```

2. **Reuse windows instead of creating new ones:**
```javascript
// Check if window exists first
let win = RetroOS.windowManager.getWindow('my-window');
if (win) {
  win.setContent(newContent);
  win.focus();
} else {
  win = RetroOS.createWindow({
    id: 'my-window',
    content: newContent
  });
}
```

3. **Clean up event listeners:**
```javascript
RetroOS.createWindow({
  title: 'My Window',
  content: '<button id="my-btn">Click</button>',
  onClose: () => {
    // Clean up any external listeners
    document.removeEventListener('customEvent', handler);
  }
});
```

---

## Accessibility Features

### ARIA Attributes
- Windows have `role="dialog"` and `aria-labelledby`
- Modal windows have `aria-modal="true"`
- Menu items have proper `role="menu"` and `role="menuitem"`
- Desktop icons have `role="button"` and `aria-label`

### Keyboard Navigation
- Full keyboard support for all interactions
- Focus indicators on all interactive elements
- Skip links for screen readers

### Screen Reader Support
- Window titles announced on focus
- Button labels for control buttons
- Status updates for window state changes

**Example with enhanced accessibility:**
```javascript
RetroOS.createWindow({
  title: 'Accessible Window',
  content: `
    <div>
      <h2 id="content-title">Content Title</h2>
      <p>Description here</p>
      <button aria-label="Perform action">Action</button>
    </div>
  `,
  onFocus: () => {
    // Announce focus change
    console.log('Window focused');
  }
});
```

---

## CSS Customization

### Override Default Styles

Create a custom CSS file after including `window-system.css`:

```css
/* Custom window colors */
.os-window {
  background: #e0e0e0;
}

.window-titlebar {
  background: linear-gradient(to right, #1e90ff, #4169e1);
}

/* Custom button styles */
.btn {
  border-radius: 4px;
  background: linear-gradient(to bottom, #f0f0f0, #d0d0d0);
}

/* Custom desktop */
.desktop-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### CSS Variables (Modern Browsers)

```css
:root {
  --window-bg: #c0c0c0;
  --window-titlebar: linear-gradient(to right, #000080, #1084d0);
  --desktop-bg: #008080;
  --text-color: #000;
}

.os-window {
  background: var(--window-bg);
}
```

---

## Common Patterns

### Confirm Before Close

```javascript
RetroOS.createWindow({
  title: 'Unsaved Changes',
  content: '<textarea>Edit me</textarea>',
  onClose: (window) => {
    if (hasUnsavedChanges) {
      RetroOS.confirm(
        'Unsaved Changes',
        'Close without saving?',
        () => true,  // Allow close
        () => false  // Prevent close
      );
      return false; // Prevent immediate close
    }
    return true; // Allow close
  }
});
```

### Dynamic Content Updates

```javascript
const win = RetroOS.createWindow({
  id: 'dynamic-window',
  title: 'Loading...',
  content: '<p>Loading data...</p>'
});

// Update later
fetch('/api/data')
  .then(res => res.json())
  .then(data => {
    win.setTitle('Data Loaded');
    win.setContent(`<div>${renderData(data)}</div>`);
  });
```

### Window Communication

```javascript
// Window 1
RetroOS.createWindow({
  id: 'sender',
  title: 'Sender',
  content: '<button id="send-btn">Send Message</button>'
});

document.getElementById('send-btn').addEventListener('click', () => {
  const receiver = RetroOS.windowManager.getWindow('receiver');
  if (receiver) {
    receiver.setContent('<p>Message received!</p>');
  }
});

// Window 2
RetroOS.createWindow({
  id: 'receiver',
  title: 'Receiver',
  content: '<p>Waiting for message...</p>'
});
```

---

## Troubleshooting

### Windows not appearing
- Check that WindowManager is initialized: `RetroOS.windowManager.init()`
- Verify container element exists
- Check browser console for errors

### Drag/resize not working
- Ensure window is not maximized
- Check for conflicting CSS or JavaScript
- Verify mouse events are not prevented

### Menus not opening
- Check MenuSystem is initialized
- Verify trigger elements exist
- Ensure menu items array is properly formatted

### Desktop icons not showing
- Check Desktop is initialized with proper container
- Verify desktop container has proper styling
- Check icon configuration is correct

---

## Example Projects

See `/window-system-demo.html` for a complete working example including:
- Multiple window types
- Calculator app
- Notepad app
- Paint app
- Menu system
- Desktop icons
- Context menus

---

## License

MIT License - Free for commercial and personal use.

## Support

For issues, questions, or contributions, please visit the RetroOS Museum repository.
