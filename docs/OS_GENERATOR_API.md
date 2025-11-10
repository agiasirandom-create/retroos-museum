# OS Generator API Reference

## OSGenerator

Main class for creating and managing OS instances.

### Methods

#### `initialize(config)`
Initialize an OS from configuration.

**Parameters:**
- `config` (Object|string): Configuration object or URL to JSON file

**Returns:** `Promise<boolean>` - Success status

**Example:**
```javascript
const osGenerator = OSGenerator.getInstance();
await osGenerator.initialize('/assets/data/os/windows-95.json');
```

#### `loadConfigById(osId)`
Load configuration by OS ID.

**Parameters:**
- `osId` (string): OS identifier (e.g., 'windows-95')

**Returns:** `Promise<Object>` - Configuration object

**Example:**
```javascript
const config = await osGenerator.loadConfigById('windows-95');
```

#### `switchOS(config)`
Switch to a different OS.

**Parameters:**
- `config` (Object): New OS configuration

**Returns:** `Promise<boolean>` - Success status

**Example:**
```javascript
const newConfig = await osGenerator.loadConfigById('macos-system7');
await osGenerator.switchOS(newConfig);
```

#### `createApplicationWindow(appId)`
Create and open an application window.

**Parameters:**
- `appId` (string): Application identifier

**Returns:** `Window` - Window instance

**Example:**
```javascript
osGenerator.createApplicationWindow('notepad');
```

#### `getApplications()`
Get list of available applications.

**Returns:** `Array<Object>` - List of application configs

#### `getOSInfo()`
Get current OS metadata.

**Returns:** `Object` - OS information

```javascript
{
  id: 'windows-95',
  name: 'Windows 95',
  version: '4.0.950',
  company: 'Microsoft Corporation',
  year: 1995,
  description: '...',
  category: 'desktop_windows'
}
```

#### `cleanup()`
Clean up current OS instance (close windows, remove UI elements).

#### `getInstance()`
Get singleton instance of OSGenerator (static method).

**Returns:** `OSGenerator`

---

## ThemeEngine

Manages theme application and CSS generation.

### Methods

#### `applyTheme(config)`
Apply theme from OS configuration.

**Parameters:**
- `config` (Object): OS configuration with visual settings

**Returns:** `Promise<boolean>` - Success status

**Example:**
```javascript
const themeEngine = new ThemeEngine();
await themeEngine.applyTheme(osConfig);
```

#### `switchTheme(newConfig)`
Switch to a new theme dynamically.

**Parameters:**
- `newConfig` (Object): New OS configuration

**Returns:** `Promise<boolean>` - Success status

#### `getCurrentTheme()`
Get current theme configuration.

**Returns:** `Object` - Theme object

---

## AppFactory

Creates application components from configuration.

### Methods

#### `register(componentName, factoryFunction)`
Register a custom application component factory.

**Parameters:**
- `componentName` (string): Component identifier
- `factoryFunction` (Function): Factory function `(appConfig, osConfig) => HTMLElement`

**Example:**
```javascript
appFactory.register('MyApp', (appConfig, osConfig) => {
  const div = document.createElement('div');
  div.textContent = 'My Custom App';
  return div;
});
```

#### `createApp(appConfig, osConfig)`
Create application content from configuration.

**Parameters:**
- `appConfig` (Object): Application configuration
- `osConfig` (Object): OS configuration

**Returns:** `HTMLElement` - Application content

---

## DesktopGenerator

Generates desktop environment elements.

### Methods

#### `generateDesktop(config)`
Generate desktop from OS configuration.

**Parameters:**
- `config` (Object): OS configuration

**Returns:** `HTMLElement` - Desktop element

#### `clearDesktop()`
Remove all desktop elements.

---

## ConfigValidator

Validates and normalizes OS configurations.

### Methods

#### `validate(config)`
Validate an OS configuration.

**Parameters:**
- `config` (Object): OS configuration to validate

**Returns:** `Object` - Validation result

```javascript
{
  config: {...},        // Normalized config with defaults applied
  valid: true,          // Validation passed
  errors: [],           // Array of error messages
  warnings: []          // Array of warning messages
}
```

**Example:**
```javascript
const validator = new ConfigValidator();
const result = validator.validate(config);

if (!result.valid) {
  console.error('Validation failed:', result.errors);
} else {
  console.log('Config is valid');
  if (result.warnings.length > 0) {
    console.warn('Warnings:', result.warnings);
  }
}
```

---

## OSSwitcher

UI component for switching between OS instances.

### Methods

#### `initialize()`
Initialize the OS switcher UI.

**Returns:** `Promise<void>`

#### `addOS(osConfig)`
Add an OS to the available list.

**Parameters:**
- `osConfig` (Object): OS configuration

**Example:**
```javascript
osSwitcher.addOS({
  os_id: 'windows-xp',
  metadata: {
    name: 'Windows XP',
    releaseYear: 2001,
    category: 'desktop_windows'
  }
});
```

#### `open()`
Open the OS switcher modal.

#### `close()`
Close the OS switcher modal.

#### `toggle()`
Toggle switcher visibility.

---

## Events

### `os-initialized`
Fired when an OS is successfully initialized.

**Detail:**
```javascript
{
  os: {...}  // OS configuration
}
```

**Example:**
```javascript
document.addEventListener('os-initialized', (e) => {
  console.log('OS initialized:', e.detail.os.metadata.name);
});
```

---

## CSS Variables

Generated CSS variables available for styling:

### Colors
- `--color-desktop`
- `--color-window-background`
- `--color-window-border`
- `--color-title-bar-active`
- `--color-title-bar-inactive`
- `--color-title-bar-text`
- `--color-title-bar-text-inactive`
- `--color-button-face`
- `--color-button-text`
- `--color-button-highlight`
- `--color-button-shadow`
- `--color-button-border`
- `--color-highlight`
- `--color-highlight-text`
- `--color-menu-background`
- `--color-menu-text`
- `--color-menu-highlight`
- `--color-text`

### Typography
- `--font-family`
- `--font-size`
- `--font-weight`
- `--font-title-family`
- `--font-title-size`
- `--font-title-weight`
- `--font-menu-family`
- `--font-menu-size`
- `--font-mono-family`
- `--font-mono-size`
- `--font-antialiasing`

### Layout
- `--border-radius`
- `--border-style`
- `--window-border-width`
- `--title-align`
- `--control-position`
- `--menubar-background`
- `--menubar-text`
- `--menubar-height`
- `--taskbar-height`
- `--taskbar-position`
- `--taskbar-background`

### Flags
- `--use-shadows` (0 or 1)
- `--use-bevels` (0 or 1)
- `--use-gradients` (0 or 1)

---

## Body Classes

Classes applied to `<body>` based on OS configuration:

- `os-{os_id}` - e.g., `os-windows-95`
- `category-{category}` - e.g., `category-desktop_windows`
- `style-{style_type}` - e.g., `style-bevel_3d`
- `windows-{window_type}` - e.g., `windows-stacking`
- `menu-{menu_type}` - e.g., `menu-hybrid`

**Example:**
```css
/* Target Windows 95 specifically */
.os-windows-95 .window {
  font-family: 'MS Sans Serif', Arial, sans-serif;
}

/* Target all Windows-category OS */
.category-desktop_windows .button {
  border-style: outset;
}

/* Target all beveled style OS */
.style-bevel_3d .button {
  border-width: 2px;
}
```

---

## Application Component Interface

Custom application components should follow this interface:

```javascript
/**
 * @param {Object} appConfig - Application configuration
 * @param {string} appConfig.id - Unique app identifier
 * @param {string} appConfig.name - Display name
 * @param {string} appConfig.icon - Icon path
 * @param {string} appConfig.type - App type (system, productivity, etc.)
 * @param {Object} appConfig.window - Window configuration
 *
 * @param {Object} osConfig - OS configuration
 *
 * @returns {HTMLElement} - Application content element
 */
function createCustomApp(appConfig, osConfig) {
  const container = document.createElement('div');
  container.className = 'app-content my-app';

  // Build your UI
  // ...

  return container;
}
```

---

## Configuration Schema

### Top Level

```typescript
interface OSConfig {
  schema_version: string;
  os_id: string;
  metadata: Metadata;
  visual: Visual;
  paradigm: Paradigm;
  components: Components;
  features?: Features;
  assets?: Assets;
}
```

### Metadata

```typescript
interface Metadata {
  name: string;
  fullName?: string;
  version: string;
  company: string;
  releaseYear: number;
  releaseDate?: string;
  description: string;
  tagline?: string;
  category: string;
  architecture?: string[];
  historical?: {
    significance?: string;
    marketShare?: string;
    successor?: string;
    predecessor?: string;
  };
  links?: {
    wikipedia?: string;
    [key: string]: string;
  };
}
```

### Visual

```typescript
interface Visual {
  theme: {
    colors: {
      desktop: string;
      windowBackground: string;
      titleBarActive: string;
      // ... more colors
    };
    typography: {
      systemFont: Font;
      titleFont?: Font;
      menuFont?: Font;
      monospaceFont?: Font;
      antialiasing?: boolean;
    };
    style: {
      type: 'classic' | 'bevel_3d' | 'modern';
      borderStyle: string;
      cornerRadius: number;
      shadows?: boolean;
      bevels?: boolean;
      gradients?: boolean;
    };
  };
  cursor?: {
    style: string;
    animated?: boolean;
  };
  icons?: {
    style: string;
    size: { default: number; sizes: number[] };
  };
  wallpaper?: {
    type: 'solid' | 'pattern' | 'image';
    value: string;
    url?: string;
  };
}

interface Font {
  family: string;
  size: number;
  weight?: string;
  fallback?: string[];
}
```

### Paradigm

```typescript
interface Paradigm {
  windowSystem: {
    type: 'stacking' | 'tiling' | 'tabbed';
    behavior: {
      overlap?: boolean;
      resize?: boolean;
      minimize?: boolean;
      maximize?: boolean;
      close?: boolean;
    };
    chrome: {
      titleBar: string;
      controls: string;
      controlPosition: 'left' | 'right';
      titleAlign?: 'left' | 'center' | 'right';
    };
  };
  menuSystem: {
    type: 'global_menu' | 'window' | 'context_only' | 'hybrid';
    menuBar?: {
      enabled: boolean;
      position: 'top' | 'window';
    };
    contextMenu?: {
      enabled: boolean;
      trigger: string;
    };
  };
  taskManagement: {
    type: 'taskbar' | 'dock' | 'panel' | 'none';
    taskbar?: {
      position: 'top' | 'bottom' | 'left' | 'right';
      size: number;
      sections: {
        start?: boolean;
        tasks?: boolean;
        system_tray?: boolean;
        clock?: boolean;
      };
    };
  };
  desktop: {
    type: 'iconic' | 'spatial';
    layout: {
      type: 'grid' | 'free_form';
      grid?: {
        cellWidth: number;
        cellHeight: number;
        spacing: number;
      };
      direction?: 'vertical' | 'horizontal';
      snapToGrid?: boolean;
    };
    interaction: {
      click: 'single' | 'double';
      dragAndDrop?: boolean;
    };
  };
}
```

### Components

```typescript
interface Components {
  applications: Application[];
}

interface Application {
  id: string;
  name: string;
  icon?: string;
  type: string;
  component: string;
  window: {
    title: string;
    width: number;
    height: number;
    minWidth?: number;
    minHeight?: number;
    resizable?: boolean;
    minimizable?: boolean;
    maximizable?: boolean;
    position?: 'center' | 'cascade' | { x: number; y: number };
  };
  desktop?: {
    icon: boolean;
    position?: { x: number; y: number };
  };
  menu?: {
    path: string;
    category: string;
  };
  features?: {
    multiInstance?: boolean;
    fileAssociations?: string[];
    saveState?: boolean;
  };
}
```
