# RetroOS Museum Component Library - Design Patterns

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Design Patterns Used](#design-patterns-used)
3. [Best Practices](#best-practices)
4. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)

---

## Architecture Overview

### Component Structure

The RetroOS Museum component library follows a modular, self-contained architecture where each component manages its own:

- **DOM Structure**: Dynamic element creation
- **Styling**: CSS-in-JS injection
- **State Management**: Internal state tracking
- **Event Handling**: Custom events for communication
- **Lifecycle**: Initialization and cleanup

**Diagram:**

```
Component
├── Constructor (initialize state)
├── _injectStyles() (CSS-in-JS)
├── createWindow/initialize() (DOM creation)
├── Public Methods (API)
├── Private Methods (internal logic)
├── Event Handlers (user interaction)
└── destroy() (cleanup)
```

---

### CSS-in-JS Approach

Components inject styles dynamically to avoid global CSS conflicts and enable theme customization.

**Benefits:**
- **Scoping**: Styles are component-specific
- **Dynamic Theming**: Colors and styles change at runtime
- **No Build Step**: Pure vanilla JavaScript
- **Cleanup**: Styles can be removed when component is destroyed

**Implementation Pattern:**

```javascript
_injectStyles() {
  // Prevent duplicate injection
  if (document.getElementById('component-styles')) return;

  const style = document.createElement('style');
  style.id = 'component-styles';

  // Use template literals for readability
  style.textContent = `
    .component-class {
      property: ${this.theme.value};
    }
  `;

  document.head.appendChild(style);
}
```

**Theme Updates:**

```javascript
setTheme(newTheme) {
  // Update internal state
  Object.assign(this.theme, newTheme);

  // Re-inject styles
  const existingStyle = document.getElementById('component-styles');
  if (existingStyle) existingStyle.remove();

  this._injectStyles();
}
```

---

### Event Delegation

Components use event delegation to efficiently handle user interactions on dynamically created elements.

**Pattern:**

```javascript
// Attach listener to container, not individual elements
this.elements.taskbar.addEventListener('click', (e) => {
  // Check target
  const taskButton = e.target.closest('.taskbar-task-button');

  if (taskButton) {
    const windowId = taskButton.dataset.windowId;
    this._handleTaskClick(windowId);
  }
});
```

**Benefits:**
- Fewer event listeners (better performance)
- Works with dynamically added elements
- Easier cleanup

---

### State Management

Each component maintains internal state using JavaScript Maps and Sets for efficient lookups.

**Window System State:**

```javascript
class WindowSystem {
  constructor() {
    this.windows = new Map();       // windowId -> windowData
    this.zIndexCounter = 1000;      // Auto-incrementing z-index
    this.activeWindow = null;       // Currently focused window ID
  }

  createWindow(config) {
    const id = config.id || this._generateId();

    // Store window data
    this.windows.set(id, {
      element: windowElement,
      title: config.title,
      isMinimized: false,
      isMaximized: false,
      previousState: null
    });
  }

  getWindow(id) {
    return this.windows.get(id);
  }
}
```

**Taskbar State:**

```javascript
class Taskbar {
  constructor() {
    this.windows = new Map();       // windowId -> { info, element }
    this.activeWindow = null;
  }

  addWindow(info) {
    const button = this._createTaskButton(info);

    this.windows.set(info.id, {
      info: info,
      element: button
    });
  }
}
```

**Benefits of Map:**
- O(1) lookup by key
- Maintains insertion order
- Easier to iterate

---

### Z-Index Management

Components manage window stacking order using an incrementing counter.

**Pattern:**

```javascript
class WindowSystem {
  constructor() {
    this.zIndexCounter = 1000;
  }

  _focusWindow(id) {
    const windowData = this.windows.get(id);

    // Bring to front
    windowData.element.style.zIndex = ++this.zIndexCounter;

    // Update active state
    this.activeWindow = id;
  }
}
```

**Layering:**
```
Desktop Background: z-index: 0
Windows:            z-index: 1000+
Taskbar/Panels:     z-index: 9999
Modals/Menus:       z-index: 10000+
```

---

## Design Patterns Used

### 1. Singleton Pattern

**Where Used**: Style injection (ensure single instance of CSS)

**Implementation:**

```javascript
_injectStyles() {
  // Check if already injected
  if (document.getElementById('classic-windows-styles')) return;

  // Create and inject
  const style = document.createElement('style');
  style.id = 'classic-windows-styles';
  style.textContent = `...`;
  document.head.appendChild(style);
}
```

**Benefits:**
- Prevents duplicate styles
- Reduces memory usage
- Avoids CSS conflicts

---

### 2. Factory Pattern

**Where Used**: Window and button creation

**Implementation:**

```javascript
class WindowSystem {
  // Factory method for creating windows
  createWindow(config) {
    const window = this._buildWindowElement(config);
    this._setupWindowBehavior(window, config);
    this._storeWindowData(window, config);

    return window;
  }

  // Private factory helpers
  _buildWindowElement(config) {
    const el = document.createElement('div');
    el.className = 'window';
    // ...configure element
    return el;
  }

  _setupWindowBehavior(el, config) {
    this._makeDraggable(el);
    this._makeResizable(el);
    // ...attach behaviors
  }
}
```

**Benefits:**
- Consistent window creation
- Encapsulates complex logic
- Easy to extend with new window types

---

### 3. Observer Pattern

**Where Used**: Custom events for component communication

**Implementation:**

```javascript
// Component emits events
class Taskbar {
  _handleTaskClick(windowId) {
    // Dispatch custom event
    const event = new CustomEvent('taskbar:windowActivate', {
      detail: { windowId }
    });

    this.elements.taskbar.dispatchEvent(event);
  }
}

// Consumers listen for events
taskbar.elements.taskbar.addEventListener('taskbar:windowActivate', (e) => {
  windowSystem.restoreWindow(e.detail.windowId);
});
```

**Benefits:**
- Loose coupling between components
- Easy to add new listeners
- Follows DOM event model

---

### 4. Strategy Pattern

**Where Used**: Theme variants and focus modes

**Implementation:**

```javascript
class UnixWindowSystem {
  constructor(options) {
    // Strategy: focus mode
    this.focusStrategy = options.focusMode || 'click';
  }

  _setupFocusMode() {
    if (this.focusStrategy === 'follow-mouse') {
      document.addEventListener('mouseover', (e) => {
        const window = e.target.closest('.unix-window');
        if (window) this._focusWindow(window.id);
      });
    } else {
      // Click-to-focus (default)
      // Handled in window creation
    }
  }
}
```

**Benefits:**
- Runtime behavior selection
- Easy to add new strategies
- Separation of concerns

---

### 5. Composition Over Inheritance

**Where Used**: Component structure (no inheritance hierarchy)

**Implementation:**

```javascript
// Components are standalone classes, not subclasses
class ClassicWindowsSystem { /* ... */ }
class ModernWindowsSystem { /* ... */ }
class MacClassicSystem { /* ... */ }

// Composition: Use multiple components together
const desktop = {
  windowSystem: new ClassicWindowsSystem(),
  taskbar: new WindowsTaskbar(),
  startMenu: new StartMenu()
};

// Components communicate via events, not inheritance
desktop.taskbar.elements.taskbar.addEventListener('taskbar:windowActivate', (e) => {
  desktop.windowSystem.restoreWindow(e.detail.windowId);
});
```

**Benefits:**
- Flexibility in combining components
- Avoid deep inheritance trees
- Easier to test and maintain

---

### 6. Module Pattern

**Where Used**: IIFE wrappers for global scope isolation

**Implementation:**

```javascript
(function(global) {
  'use strict';

  class WindowSystem {
    // ...implementation
  }

  // Export to global scope
  global.WindowSystem = WindowSystem;

})(typeof window !== 'undefined' ? window : global);
```

**Benefits:**
- Avoids polluting global namespace
- Creates private scope
- Compatible with different environments (browser/Node)

---

### 7. Command Pattern

**Where Used**: Callback functions for window actions

**Implementation:**

```javascript
// Commands as callbacks
const window = system.createWindow({
  onClose: () => {
    // Command: save and close
    saveDocument();
    return true;
  },
  onMinimize: () => {
    // Command: minimize action
    updateTaskbar();
  }
});

// Commands can be stored and executed later
const commands = {
  close: () => window.close(),
  minimize: () => window.minimize(),
  maximize: () => window.maximize()
};

// Execute command
commands.close();
```

---

## Best Practices

### Component Initialization

**Correct Pattern:**

```javascript
// 1. Create window system
const windowSystem = new ClassicWindowsSystem({
  style: 'win95'
});

// 2. Create desktop component
const taskbar = new WindowsTaskbar();
taskbar.initialize(document.body, {
  mode: '95'
});

// 3. Create windows AFTER initialization
const window = windowSystem.createWindow({
  id: 'app',
  title: 'Application'
});

document.body.appendChild(window);

// 4. Sync components via events
taskbar.addWindow({
  id: 'app',
  title: 'Application',
  icon: '📄'
});
```

**Why:**
- Components are ready before use
- Events are properly attached
- DOM is in correct state

---

### Cleanup and Disposal

**Pattern:**

```javascript
class Component {
  constructor() {
    this.eventHandlers = {};
    this.intervals = [];
  }

  initialize() {
    // Store event handlers for cleanup
    this.eventHandlers.resize = () => this._handleResize();
    window.addEventListener('resize', this.eventHandlers.resize);

    // Store intervals
    this.intervals.push(
      setInterval(() => this._updateClock(), 1000)
    );
  }

  destroy() {
    // Remove event listeners
    Object.entries(this.eventHandlers).forEach(([event, handler]) => {
      window.removeEventListener(event, handler);
    });

    // Clear intervals
    this.intervals.forEach(id => clearInterval(id));

    // Remove DOM elements
    if (this.elements.container) {
      this.elements.container.remove();
    }

    // Clear references
    this.windows.clear();
    this.elements = {};
    this.eventHandlers = {};
    this.intervals = [];
  }
}
```

**Checklist:**
- Remove all event listeners
- Clear intervals and timeouts
- Remove injected DOM elements
- Clear Maps and Sets
- Nullify object references

---

### Memory Management

**Avoiding Memory Leaks:**

```javascript
// BAD: Creates memory leak
class Component {
  createWindow(config) {
    const window = document.createElement('div');

    // Anonymous function creates closure
    window.addEventListener('click', () => {
      this.handleClick(config); // Keeps config in memory
    });

    return window;
  }
}

// GOOD: Cleanup is possible
class Component {
  createWindow(config) {
    const window = document.createElement('div');

    // Named function stored for removal
    const clickHandler = () => this.handleClick(config);
    window._clickHandler = clickHandler;

    window.addEventListener('click', clickHandler);

    return window;
  }

  destroyWindow(window) {
    // Remove listener to free memory
    window.removeEventListener('click', window._clickHandler);
    delete window._clickHandler;
    window.remove();
  }
}
```

**Best Practices:**
- Store event handlers for later removal
- Use WeakMap for element-to-data mapping
- Clear references in destroy methods
- Avoid circular references

---

### Performance Considerations

**1. Debounce Expensive Operations:**

```javascript
class Component {
  constructor() {
    this._resizeTimeout = null;
  }

  _handleResize() {
    clearTimeout(this._resizeTimeout);

    this._resizeTimeout = setTimeout(() => {
      this._updateLayout();
    }, 250);
  }
}
```

**2. Batch DOM Updates:**

```javascript
// BAD: Multiple reflows
windows.forEach(config => {
  const window = createWindow(config);
  container.appendChild(window); // Reflow each time
});

// GOOD: Single reflow
const fragment = document.createDocumentFragment();

windows.forEach(config => {
  const window = createWindow(config);
  fragment.appendChild(window);
});

container.appendChild(fragment); // Single reflow
```

**3. Use CSS Transforms:**

```javascript
// BAD: Triggers layout
element.style.left = `${x}px`;
element.style.top = `${y}px`;

// GOOD: Uses compositor
element.style.transform = `translate(${x}px, ${y}px)`;
```

---

### Accessibility Guidelines

**1. Semantic HTML:**

```javascript
createWindow(config) {
  const window = document.createElement('div');
  window.setAttribute('role', 'dialog');
  window.setAttribute('aria-labelledby', `${id}-title`);
  window.setAttribute('aria-modal', 'true');

  // ...
}
```

**2. Keyboard Navigation:**

```javascript
class WindowSystem {
  _setupKeyboardNav() {
    document.addEventListener('keydown', (e) => {
      // Alt+Tab: Switch windows
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        this._focusNextWindow();
      }

      // Alt+F4: Close window
      if (e.altKey && e.key === 'F4') {
        e.preventDefault();
        this._closeActiveWindow();
      }

      // Escape: Close dialogs
      if (e.key === 'Escape') {
        this._closeActiveModal();
      }
    });
  }
}
```

**3. Focus Management:**

```javascript
_focusWindow(id) {
  const windowData = this.windows.get(id);

  // Update focus
  this.activeWindow = id;
  windowData.element.classList.add('active');

  // Move keyboard focus
  const focusable = windowData.element.querySelector(
    'button, input, textarea, [tabindex]'
  );

  if (focusable) {
    focusable.focus();
  }
}
```

---

### Error Handling

**Defensive Programming:**

```javascript
class Component {
  getWindow(id) {
    // Validate input
    if (!id || typeof id !== 'string') {
      console.warn('Invalid window ID:', id);
      return null;
    }

    // Check existence
    const window = this.windows.get(id);
    if (!window) {
      console.warn('Window not found:', id);
      return null;
    }

    return window;
  }

  createWindow(config) {
    // Validate required fields
    if (!config) {
      throw new Error('Window configuration required');
    }

    // Provide defaults
    const safeConfig = {
      id: this._generateId(),
      title: 'Untitled',
      width: 400,
      height: 300,
      ...config
    };

    // ...create window
  }

  _executeCallback(callback, ...args) {
    // Safe callback execution
    if (typeof callback === 'function') {
      try {
        return callback(...args);
      } catch (error) {
        console.error('Callback error:', error);
        return undefined;
      }
    }
  }
}
```

---

## Anti-Patterns to Avoid

### 1. Global State Pollution

**BAD:**
```javascript
// Pollutes global scope
var windows = [];
var activeWindow = null;

function createWindow(config) {
  windows.push(config);
}
```

**GOOD:**
```javascript
// Encapsulated state
class WindowSystem {
  constructor() {
    this.windows = new Map();
    this.activeWindow = null;
  }
}
```

---

### 2. Tight Coupling

**BAD:**
```javascript
class Taskbar {
  handleClick(windowId) {
    // Directly calling window system (tight coupling)
    windowSystem.restoreWindow(windowId);
  }
}
```

**GOOD:**
```javascript
class Taskbar {
  handleClick(windowId) {
    // Emit event (loose coupling)
    this._dispatchEvent('windowActivate', { windowId });
  }
}

// External integration
taskbar.addEventListener('taskbar:windowActivate', (e) => {
  windowSystem.restoreWindow(e.detail.windowId);
});
```

---

### 3. Inline Styles

**BAD:**
```javascript
element.style.cssText = `
  position: absolute;
  left: 100px;
  top: 100px;
  width: 400px;
  height: 300px;
  background: #ffffff;
  border: 1px solid #000000;
  /* ... many more properties */
`;
```

**GOOD:**
```javascript
// Use CSS classes
_injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .window {
      position: absolute;
      background: #ffffff;
      border: 1px solid #000000;
    }
  `;
  document.head.appendChild(style);
}

// Apply class
element.className = 'window';
element.style.left = '100px';
element.style.top = '100px';
```

---

### 4. Synchronous Style Injection

**BAD:**
```javascript
// Re-inject on every theme change
setTheme(newTheme) {
  document.head.removeChild(this.styleElement);
  this._injectStyles();
  this._updateAllWindows(); // Forces reflow
}
```

**GOOD:**
```javascript
// Update CSS variables or re-inject once
setTheme(newTheme) {
  Object.assign(this.theme, newTheme);

  const existingStyle = document.getElementById('component-styles');
  if (existingStyle) {
    existingStyle.remove();
  }

  this._injectStyles(); // Single update
}
```

---

### 5. Memory Leaks from Event Listeners

**BAD:**
```javascript
createWindow(config) {
  const window = document.createElement('div');

  // Creates closure over config (memory leak)
  window.addEventListener('click', () => {
    console.log(config.title);
  });

  return window;
}

// No cleanup when window is destroyed
```

**GOOD:**
```javascript
createWindow(config) {
  const window = document.createElement('div');

  const clickHandler = () => {
    console.log(this.windows.get(config.id).title);
  };

  window.addEventListener('click', clickHandler);

  // Store for cleanup
  this.windows.set(config.id, {
    element: window,
    handlers: { click: clickHandler }
  });

  return window;
}

destroy(id) {
  const windowData = this.windows.get(id);

  // Clean up event listeners
  Object.entries(windowData.handlers).forEach(([event, handler]) => {
    windowData.element.removeEventListener(event, handler);
  });

  windowData.element.remove();
  this.windows.delete(id);
}
```

---

### 6. Excessive DOM Queries

**BAD:**
```javascript
updateTaskbar() {
  // Query DOM every time
  document.querySelector('.taskbar').style.background = '#000';
  document.querySelector('.taskbar .clock').textContent = getTime();
  document.querySelector('.taskbar .tray').innerHTML = getTrayIcons();
}
```

**GOOD:**
```javascript
initialize(container, config) {
  // Cache DOM elements
  this.elements = {
    taskbar: document.querySelector('.taskbar'),
    clock: document.querySelector('.taskbar .clock'),
    tray: document.querySelector('.taskbar .tray')
  };
}

updateTaskbar() {
  // Use cached references
  this.elements.taskbar.style.background = '#000';
  this.elements.clock.textContent = getTime();
  this.elements.tray.innerHTML = getTrayIcons();
}
```

---

### 7. Ignoring Return Values

**BAD:**
```javascript
createWindow(config) {
  // User's onClose callback ignored
  if (config.onClose) {
    config.onClose();
  }

  window.remove(); // Always removes
}
```

**GOOD:**
```javascript
createWindow(config) {
  // Respect return value
  if (config.onClose) {
    const shouldClose = config.onClose();

    if (shouldClose === false) {
      return; // Don't close
    }
  }

  window.remove();
}
```

---

### 8. Hard-Coded Values

**BAD:**
```javascript
createWindow() {
  const window = document.createElement('div');
  window.style.width = '400px';
  window.style.height = '300px';
  window.style.background = '#ffffff';
}
```

**GOOD:**
```javascript
createWindow(config = {}) {
  const window = document.createElement('div');

  // Use configuration
  window.style.width = `${config.width || this.defaults.width}px`;
  window.style.height = `${config.height || this.defaults.height}px`;
  window.style.background = config.background || this.theme.background;
}
```

---

## Summary

The RetroOS Museum component library demonstrates solid software engineering principles:

**Architecture:**
- Self-contained components with CSS-in-JS
- Map-based state management
- Event-driven communication
- Efficient z-index handling

**Patterns:**
- Singleton for style injection
- Factory for element creation
- Observer for component communication
- Strategy for behavior variants
- Composition over inheritance

**Best Practices:**
- Proper initialization order
- Comprehensive cleanup
- Memory leak prevention
- Performance optimization
- Accessibility support
- Defensive error handling

**Avoid:**
- Global state pollution
- Tight coupling
- Excessive inline styles
- Memory leaks
- DOM query overhead
- Ignored return values
- Hard-coded values

By following these patterns and practices, components remain maintainable, performant, and extensible.

---

**Document Version**: 1.0
**Last Updated**: 2025-11-11
**Word Count**: ~1,600 words
