# OS Generator System Guide

## Overview

The OS Generator system allows you to create interactive operating system recreations from JSON configuration files. This enables scaling from 2 OS recreations to potentially all 94 operating systems in the museum.

## Architecture

### Core Components

1. **ConfigValidator** (`config-validator.js`)
   - Validates OS JSON schemas
   - Provides default values for missing fields
   - Reports errors and warnings

2. **ThemeEngine** (`theme-engine.js`)
   - Applies colors, fonts, and styles from config
   - Generates CSS variables dynamically
   - Loads custom fonts
   - Manages wallpapers and patterns

3. **AppFactory** (`app-factory.js`)
   - Creates application windows from config
   - Supports: Text editors, file managers, terminals, calculators
   - Generates menus, toolbars, and content areas
   - Extensible with custom components

4. **DesktopGenerator** (`desktop-generator.js`)
   - Creates desktop icons from config
   - Builds taskbar (Windows), dock (Mac), or panel (Linux)
   - Sets up menu bar (global or per-window)
   - Handles icon interactions (drag, selection)

5. **OSGenerator** (`os-generator.js`)
   - Main orchestrator
   - Loads and validates configs
   - Initializes all subsystems
   - Manages OS lifecycle

6. **OSSwitcher** (`os-switcher.js`)
   - UI for switching between OS instances
   - Loads available OS list
   - Smooth transitions between systems

## Creating a New OS Recreation

### Step 1: Create JSON Configuration

Create a file in `/src/_data/os/your-os-id.json`:

```json
{
  "schema_version": "1.0.0",
  "os_id": "windows-98",

  "metadata": {
    "name": "Windows 98",
    "fullName": "Microsoft Windows 98",
    "version": "4.10.1998",
    "company": "Microsoft Corporation",
    "releaseYear": 1998,
    "releaseDate": "1998-06-25",
    "description": "Enhanced consumer OS with Internet integration",
    "tagline": "Works Better, Plays Better",
    "category": "desktop_windows",
    "architecture": ["x86"]
  },

  "visual": {
    "theme": {
      "colors": {
        "desktop": "#008080",
        "windowBackground": "#C0C0C0",
        "titleBarActive": "#000080",
        "titleBarInactive": "#808080",
        "titleBarText": "#FFFFFF",
        "buttonFace": "#C0C0C0",
        "buttonHighlight": "#FFFFFF",
        "buttonShadow": "#808080",
        "highlight": "#000080",
        "highlightText": "#FFFFFF",
        "menuBackground": "#C0C0C0",
        "menuText": "#000000",
        "text": "#000000"
      },

      "typography": {
        "systemFont": {
          "family": "MS Sans Serif",
          "size": 11,
          "weight": "normal",
          "fallback": ["Arial", "sans-serif"]
        },
        "antialiasing": false
      },

      "style": {
        "type": "bevel_3d",
        "borderStyle": "bevel_out",
        "cornerRadius": 0,
        "shadows": false,
        "bevels": true,
        "gradients": false
      }
    },

    "wallpaper": {
      "type": "solid",
      "value": "#008080"
    }
  },

  "paradigm": {
    "windowSystem": {
      "type": "stacking",
      "behavior": {
        "overlap": true,
        "resize": true,
        "minimize": true,
        "maximize": true,
        "close": true
      },
      "chrome": {
        "titleBar": "classic",
        "controls": "buttons",
        "controlPosition": "right",
        "titleAlign": "left"
      }
    },

    "menuSystem": {
      "type": "hybrid",
      "menuBar": {
        "enabled": true,
        "position": "window"
      },
      "contextMenu": {
        "enabled": true,
        "trigger": "right_click"
      }
    },

    "taskManagement": {
      "type": "taskbar",
      "taskbar": {
        "position": "bottom",
        "size": 28,
        "sections": {
          "start": true,
          "tasks": true,
          "system_tray": true,
          "clock": true
        }
      }
    },

    "desktop": {
      "type": "iconic",
      "layout": {
        "type": "grid",
        "grid": {
          "cellWidth": 80,
          "cellHeight": 80,
          "spacing": 8
        },
        "direction": "vertical",
        "snapToGrid": true
      },
      "interaction": {
        "click": "double",
        "dragAndDrop": true
      }
    }
  },

  "components": {
    "applications": [
      {
        "id": "my_computer",
        "name": "My Computer",
        "icon": "icons/my_computer.png",
        "type": "system",
        "component": "FileExplorer",
        "window": {
          "title": "My Computer",
          "width": 640,
          "height": 480,
          "resizable": true,
          "minimizable": true,
          "maximizable": true,
          "position": "center"
        },
        "desktop": {
          "icon": true,
          "position": { "x": 0, "y": 0 }
        }
      },
      {
        "id": "notepad",
        "name": "Notepad",
        "icon": "icons/notepad.png",
        "type": "productivity",
        "component": "Notepad",
        "window": {
          "title": "Untitled - Notepad",
          "width": 500,
          "height": 400,
          "resizable": true,
          "minimizable": true,
          "maximizable": true,
          "position": "cascade"
        }
      }
    ]
  },

  "features": {
    "interaction": {
      "dragAndDrop": true,
      "clipboard": true
    },
    "animations": {
      "enabled": false
    }
  }
}
```

### Step 2: Create Page Template

Create `/src/os/your-os-id.njk`:

```njk
---
layout: layouts/base.njk
title: "Windows 98 - RetroOS Museum"
description: "Interactive recreation of Windows 98"
---

<div class="os-page" data-os-id="windows-98">
  <div class="desktop" id="desktop"></div>

  <div class="os-loading" id="os-loading">
    <div class="loading-content">
      <div class="loading-logo">🪟</div>
      <h2>Loading Windows 98...</h2>
      <div class="loading-bar">
        <div class="loading-progress"></div>
      </div>
    </div>
  </div>
</div>

<script src="/assets/js/config-validator.js"></script>
<script src="/assets/js/theme-engine.js"></script>
<script src="/assets/js/window-manager.js"></script>
<script src="/assets/js/app-factory.js"></script>
<script src="/assets/js/desktop-generator.js"></script>
<script src="/assets/js/os-generator.js"></script>
<script src="/assets/js/os-switcher.js"></script>

<script>
  (async function() {
    const configPath = '/assets/data/os/windows-98.json';
    const osGenerator = OSGenerator.getInstance();
    await osGenerator.initialize(configPath);
  })();
</script>
```

### Step 3: Add to OS List

Add your OS to `/assets/data/os-list.json`:

```json
[
  {
    "id": "windows-98",
    "name": "Windows 98",
    "category": "Windows",
    "icon": "🪟",
    "year": 1998
  }
]
```

### Step 4: Link from Timeline

Update the timeline to link to your new OS page.

## Configuration Reference

### Required Fields

- `schema_version`: Config version (currently "1.0.0")
- `os_id`: Unique identifier (kebab-case)
- `metadata.name`: Display name
- `metadata.version`: OS version
- `metadata.company`: Creator/publisher
- `metadata.releaseYear`: Year released
- `metadata.description`: Brief description
- `metadata.category`: Category (desktop_windows, desktop_mac, desktop_linux, etc.)

### Visual Configuration

#### Colors
- `desktop`: Desktop background color
- `windowBackground`: Window content background
- `titleBarActive`: Active window title bar
- `titleBarInactive`: Inactive window title bar
- `titleBarText`: Title bar text color
- `buttonFace`: Button background
- `buttonHighlight`: Button highlight (top/left)
- `buttonShadow`: Button shadow (bottom/right)
- `highlight`: Selection color
- `highlightText`: Selected text color
- `menuBackground`: Menu background
- `menuText`: Menu text color
- `text`: General text color

#### Typography
```json
"typography": {
  "systemFont": {
    "family": "Font Name",
    "size": 12,
    "weight": "normal",
    "fallback": ["Arial", "sans-serif"]
  },
  "antialiasing": false
}
```

#### Style Types
- `classic`: Simple borders (Mac, early Windows)
- `bevel_3d`: 3D beveled look (Windows 95/98)
- `modern`: Flat design (Windows 10, modern Linux)

### Paradigm Configuration

#### Window System Types
- `stacking`: Traditional overlapping windows
- `tiling`: Automatic tiling (i3, awesome)
- `tabbed`: Tab-based (modern browsers)

#### Menu System Types
- `global_menu`: Menu bar at top of screen (Mac)
- `window`: Menu in each window (Windows)
- `context_only`: Right-click only (some Linux WMs)
- `hybrid`: Both global and window menus

#### Task Management Types
- `taskbar`: Windows-style taskbar
- `dock`: Mac-style dock
- `panel`: Linux-style panel
- `none`: No taskbar (classic Mac)

### Application Components

Built-in components:
- `Notepad` / `TeachText` / `XEdit`: Text editor
- `FileExplorer` / `Finder` / `XFM`: File manager
- `XTerm` / `Shell`: Terminal
- `Calculator` / `XCalc`: Calculator
- `RecycleBin` / `Trash` / `Trashcan`: Trash
- `ControlPanel`: Settings

## Custom Components

Register custom app components:

```javascript
const appFactory = window.appFactory;

appFactory.register('MyCustomApp', (appConfig, osConfig) => {
  const container = document.createElement('div');
  container.className = 'app-content my-custom-app';

  // Build your app UI
  container.innerHTML = `
    <h1>My Custom App</h1>
    <p>Content goes here</p>
  `;

  return container;
});
```

## Theme Customization

### CSS Variables

The theme engine generates CSS variables from your config:

```css
--color-desktop
--color-window-background
--color-title-bar-active
--font-family
--font-size
--border-radius
--use-shadows (0 or 1)
--use-bevels (0 or 1)
```

Use these in custom CSS:

```css
.my-element {
  background: var(--color-window-background);
  font-family: var(--font-family);
}
```

### OS-Specific Styles

Add OS-specific CSS classes:

```css
.os-windows-98 .window {
  /* Windows 98 specific styles */
}

.category-desktop_mac .button {
  /* Mac specific styles */
}
```

## Performance Optimization

### Lazy Loading

Load configs on-demand:

```javascript
const osGenerator = OSGenerator.getInstance();
const config = await osGenerator.loadConfigById('windows-98');
await osGenerator.initialize(config);
```

### Resource Preloading

Specify resources to preload in config:

```json
"assets": {
  "preload": [
    "icons/my_computer.png",
    "sounds/startup.wav",
    "fonts/ms-sans-serif.woff2"
  ]
}
```

### Icon Fallbacks

Use emoji fallbacks for missing icons:

```json
"applications": [{
  "icon": "icons/notepad.png",  // Will fallback to 📝 if missing
  "type": "productivity"
}]
```

## Troubleshooting

### Config Validation Errors

Check browser console for validation errors:

```javascript
const validator = new ConfigValidator();
const result = validator.validate(config);
console.log(result.errors);
console.log(result.warnings);
```

### Theme Not Applying

1. Check CSS variable names match config
2. Ensure theme-engine.js is loaded before os-generator.js
3. Verify color values are valid CSS colors

### Applications Not Opening

1. Check component name matches registered factory
2. Ensure window-manager.js is loaded
3. Verify app config has required fields (id, name, component)

### Desktop Icons Not Showing

1. Verify `desktop.icon: true` in app config
2. Check `paradigm.desktop.items.icons: true`
3. Ensure icon path is correct or type has fallback

## Best Practices

1. **Use Semantic Names**: Choose meaningful os_id values (e.g., 'windows-98', not 'os-1')
2. **Validate Configs**: Always run through validator before deploying
3. **Provide Fallbacks**: Include fallback fonts and emoji icons
4. **Test Responsiveness**: Check on different screen sizes
5. **Document Custom Components**: Comment your custom app factories
6. **Version Control**: Keep configs in version control
7. **Incremental Development**: Start with minimal config, add features gradually

## Example: Minimal OS

```json
{
  "schema_version": "1.0.0",
  "os_id": "minimal-os",
  "metadata": {
    "name": "Minimal OS",
    "version": "1.0",
    "company": "Example Inc",
    "releaseYear": 2000,
    "description": "A minimal OS example",
    "category": "desktop_alternative"
  },
  "visual": {
    "theme": {
      "colors": {
        "desktop": "#008080"
      }
    }
  },
  "paradigm": {
    "windowSystem": { "type": "stacking" },
    "desktop": { "type": "iconic" }
  },
  "components": {
    "applications": []
  }
}
```

This minimal config will use all defaults and create a basic desktop environment.

## Next Steps

- Create configs for remaining 92 operating systems
- Add more built-in app components
- Implement advanced features (virtual desktops, window effects)
- Add theme editor for live customization
- Create config generator tool
