# OS Configuration Schema - Quick Reference

## Overview

The OS Configuration Schema is a comprehensive JSON-based system for defining operating systems from the 1980s through 2020s. It supports all major OS paradigms through a flexible, declarative structure.

## File Locations

- **Schema Documentation**: `/home/ai/dev/active/ RetroOS Museum /os-config-schema.md`
- **Design Decisions**: `/home/ai/dev/active/ RetroOS Museum /SCHEMA-DESIGN-DECISIONS.md`
- **Example Configs**: `/home/ai/dev/active/ RetroOS Museum /src/_data/os/`
- **Usage Guide**: `/home/ai/dev/active/ RetroOS Museum /src/_data/os/README.md`

## Available Example Configurations

### Fully Detailed

1. **windows95.json** - Windows 95 (1995)
   - Complete configuration with all sections
   - Classic 3D beveled interface
   - Start menu, taskbar, system tray
   - 8 bundled applications (Notepad, Paint, Calculator, Minesweeper, etc.)

2. **macos-system7.json** - Mac OS System 7 (1991)
   - Global menu bar paradigm
   - Spatial desktop metaphor
   - Single-click icon interaction
   - 9 classic Mac applications (TeachText, Stickies, Puzzle, etc.)

### Basic Examples

3. **linux-fvwm.json** - Linux with FVWM (1995)
   - Unix workstation environment
   - Virtual desktops
   - Context menu-based interaction
   - Basic X11 applications

4. **amigaos-workbench.json** - Amiga Workbench 3.1 (1994)
   - Distinctive blue/orange color scheme
   - Preemptive multitasking
   - Screen bar menu system
   - Workbench applications

## Schema Structure

```
OSConfig
├── schema_version (required)
├── os_id (required)
├── metadata (required)
│   ├── name, version, company, releaseYear
│   ├── description, category, architecture
│   └── historical context
├── visual
│   ├── theme (colors, typography, style)
│   ├── cursor
│   ├── icons
│   ├── sounds
│   └── wallpaper
├── paradigm
│   ├── windowSystem (type, behavior, chrome, effects)
│   ├── menuSystem (type, menuBar, contextMenu)
│   ├── taskManagement (taskbar, switching, multitasking)
│   ├── desktop (layout, items, interaction)
│   └── inputMethods (keyboard, mouse, touch)
├── components
│   ├── core (windowManager, fileManager, etc.)
│   ├── applications (array of app configs)
│   └── utilities (control panels, extensions)
├── features
│   ├── interaction (dragAndDrop, clipboard, etc.)
│   ├── animations (enabled, speed, effects)
│   ├── accessibility
│   └── customization
└── assets
    ├── basePath
    ├── paths (icons, cursors, sounds, fonts)
    └── asset sets
```

## Key Design Features

### 1. Flexibility
- Supports OSes from 1980s CLI systems to 2020s touch interfaces
- Optional fields allow for era-appropriate features
- Extensible through custom fields

### 2. Modularity
- Components referenced by ID, not embedded
- Reusable across configurations
- Lazy loading support

### 3. Type Safety
- TypeScript-style type definitions
- Enum-based field values
- Runtime validation support

### 4. Asset Management
- Centralized asset configuration
- Preload hints for performance
- Multiple asset sets (icons, cursors, sounds)

### 5. Historical Accuracy
- Era-specific visual styles
- Platform-specific behaviors
- Authentic interaction patterns

## OS Categories Supported

- **desktop_windows** - Windows 1.0 through Windows 11
- **desktop_mac** - Mac OS System 1 through macOS
- **desktop_linux** - Various Linux distributions
- **desktop_unix** - Unix workstations (SGI, Sun, HP-UX)
- **desktop_alternative** - BeOS, AmigaOS, OS/2, NeXTSTEP, Haiku
- **mobile_classic** - Palm OS, Symbian, Windows Mobile, BlackBerry OS
- **mobile_modern** - iOS, Android, Windows Phone
- **embedded** - Embedded systems
- **server** - Server operating systems
- **mainframe** - Mainframe systems

## Visual Style Types

- **classic** - Flat 2D (1980s, early 1990s)
- **bevel_3d** - 3D bevels (mid-1990s)
- **skeuomorphic** - Real-world textures (2000s)
- **aqua** - Mac OS X glossy style
- **aero** - Windows Vista/7 glass
- **metro** - Windows 8 flat tiles
- **material** - Android Material Design
- **flat** - Modern minimalist
- **neumorphic** - Soft UI

## Window System Types

- **none** - No windowing (DOS, CLI)
- **stacking** - Traditional overlapping windows (most common)
- **tiling** - Non-overlapping tiled windows (Unix WMs)
- **mdi** - Multiple Document Interface (Windows apps)
- **tabs** - Tabbed interface
- **full_screen** - One app at a time (mobile)
- **hybrid** - Combination of types

## Menu System Types

- **menu_bar** - Traditional menu bar in window
- **global_menu** - Mac-style screen-top menu
- **application_menu** - Application-specific menu
- **start_menu** - Windows Start menu
- **dock_menu** - Mac dock menus
- **context_only** - Right-click menus only
- **hybrid** - Multiple menu types

## Task Management Types

- **taskbar** - Windows-style taskbar
- **dock** - Mac-style dock
- **panel** - Linux panel
- **system_tray** - System tray only
- **cards** - Card-based (mobile)
- **none** - No task management UI

## Quick Start

### 1. Copy an Example

```bash
cp windows95.json my-os.json
```

### 2. Modify Metadata

```json
{
  "os_id": "my-custom-os",
  "metadata": {
    "name": "My Custom OS",
    "version": "1.0",
    "company": "My Company",
    "releaseYear": 2024,
    "category": "desktop_alternative"
  }
}
```

### 3. Customize Visual Theme

```json
{
  "visual": {
    "theme": {
      "colors": {
        "desktop": "#2C3E50",
        "windowBackground": "#ECF0F1",
        "titleBarActive": "#3498DB"
      }
    }
  }
}
```

### 4. Define Applications

```json
{
  "components": {
    "applications": [
      {
        "id": "my_app",
        "name": "My Application",
        "icon": "icons/app.png",
        "type": "productivity",
        "window": {
          "title": "My App",
          "width": 600,
          "height": 400
        }
      }
    ]
  }
}
```

### 5. Validate

- Check required fields are present
- Verify color values are valid CSS
- Ensure asset paths exist
- Test in browser

## Common Patterns

### Windows-Style OS

```json
{
  "paradigm": {
    "windowSystem": { "type": "stacking" },
    "menuSystem": { "type": "menu_bar", "menuBar": { "position": "window" } },
    "taskManagement": { "type": "taskbar", "taskbar": { "position": "bottom" } }
  },
  "visual": {
    "theme": {
      "style": { "type": "bevel_3d", "bevels": true }
    }
  }
}
```

### Mac-Style OS

```json
{
  "paradigm": {
    "windowSystem": { "type": "stacking" },
    "menuSystem": { "type": "global_menu", "menuBar": { "position": "top" } },
    "taskManagement": { "type": "dock" }
  },
  "desktop": {
    "interaction": { "click": "single" }
  }
}
```

### Unix/Linux-Style OS

```json
{
  "paradigm": {
    "windowSystem": { "type": "stacking" },
    "menuSystem": { "type": "context_only" },
    "taskManagement": {
      "type": "panel",
      "multitasking": { "virtual_desktops": true }
    }
  }
}
```

### Mobile-Style OS

```json
{
  "paradigm": {
    "windowSystem": {
      "type": "full_screen",
      "chrome": { "titleBar": "hidden" }
    },
    "taskManagement": { "type": "cards" }
  },
  "inputMethods": {
    "touch": {
      "enabled": true,
      "gestures": ["swipe", "pinch", "tap"]
    }
  }
}
```

## Color Scheme Examples

### Windows 95 Classic

```json
{
  "desktop": "#008080",
  "windowBackground": "#C0C0C0",
  "titleBarActive": "#000080",
  "highlight": "#000080",
  "buttonFace": "#C0C0C0"
}
```

### Mac OS Platinum

```json
{
  "desktop": "#CCCCCC",
  "windowBackground": "#FFFFFF",
  "titleBarActive": "#FFFFFF",
  "highlight": "#0000CC",
  "buttonFace": "#DDDDDD"
}
```

### Modern Dark Theme

```json
{
  "desktop": "#1E1E1E",
  "windowBackground": "#252526",
  "titleBarActive": "#3C3C3C",
  "highlight": "#0E639C",
  "text": "#CCCCCC"
}
```

## Validation Checklist

- [ ] `schema_version` is "1.0.0"
- [ ] `os_id` is unique (lowercase-with-hyphens)
- [ ] `metadata.name` is set
- [ ] `metadata.category` is valid enum value
- [ ] `metadata.releaseYear` is between 1970-2030
- [ ] `visual.theme.colors.desktop` is defined
- [ ] All color values are valid CSS (#HEX, rgb(), named)
- [ ] Window system type is specified
- [ ] At least one application is configured
- [ ] Asset paths are relative to basePath
- [ ] Sizes are positive integers
- [ ] JSON is valid (no syntax errors)

## Edge Cases Handled

1. **No window system** (DOS, CLI) - `windowSystem.type: "none"`
2. **Single-button mouse** (Mac) - `mouse.buttons: 1`, `contextMenu.trigger: "ctrl_click"`
3. **No minimize** (Mac Classic) - `behavior.minimize: false`
4. **Virtual desktops** (Unix) - `multitasking.virtual_desktops: true`
5. **Global menu** (Mac) - `menuSystem.type: "global_menu"`
6. **Full-screen only** (mobile) - `windowSystem.type: "full_screen"`
7. **Touch input** (mobile/tablet) - `inputMethods.touch.enabled: true`
8. **MDI applications** (Windows 3.1) - `windowSystem.type: "mdi"`
9. **Tiling WM** (i3, dwm) - `windowSystem.type: "tiling"`
10. **Custom colors** - Use `colors.custom` object

## Performance Tips

1. **Preload critical assets**
   ```json
   {
     "assets": {
       "preload": ["icons/computer.png", "sounds/startup.wav"]
     }
   }
   ```

2. **Disable animations for older systems**
   ```json
   {
     "features": {
       "animations": { "enabled": false }
     }
   }
   ```

3. **Use appropriate icon sizes**
   - 1980s: 16x16
   - 1990s: 32x32
   - 2000s+: Multiple sizes

4. **Optimize color palette**
   - Use CSS color names for common colors
   - Reuse colors via CSS variables in implementation

## Troubleshooting

### Colors Don't Match

- Verify hex format: `#RRGGBB` (6 digits)
- Check contrast ratios for readability
- Test on different displays

### Windows Behave Incorrectly

- Review `windowSystem.behavior` settings
- Check if minimize/maximize are enabled
- Verify window chrome configuration

### Menus Don't Appear

- Check `menuSystem.type`
- Verify `menuBar.position`
- Ensure components are referenced

### Icons Wrong Size

- Match `icons.size.default` to `desktop.layout.grid` cells
- Check icon rendering mode (aliased vs antialiased)
- Verify asset paths

## Next Steps

1. **Read full documentation**: `/home/ai/dev/active/ RetroOS Museum /os-config-schema.md`
2. **Study examples**: Review the 4 example configurations
3. **Create your OS**: Copy an example and customize
4. **Test thoroughly**: Validate JSON and test all features
5. **Add assets**: Create or source appropriate icons, sounds
6. **Document custom features**: Add notes for unusual configurations

## Resources

- Full Schema: `os-config-schema.md`
- Design Rationale: `SCHEMA-DESIGN-DECISIONS.md`
- Usage Guide: `src/_data/os/README.md`
- Examples: `src/_data/os/*.json`

## Support Matrix

| Feature | 1980s | 1990s | 2000s | 2010s |
|---------|-------|-------|-------|-------|
| Windows | ✓ | ✓ | ✓ | ✓ |
| Menus | ✓ | ✓ | ✓ | ✓ |
| Icons | 16px | 32px | 48px+ | Vector |
| Colors | 16 | 256+ | Millions | HDR |
| Animation | ✗ | Minimal | ✓ | Full |
| Touch | ✗ | ✗ | Partial | ✓ |
| Sound | Beep | WAV | MP3 | All |
| Network | ✗ | Dialup | Ethernet | WiFi |

## Version

Schema Version: **1.0.0**
Created: 2024
Status: Production Ready
