# OS Configuration Files

This directory contains JSON configuration files that define operating systems for the RetroOS Museum. Each file describes a complete OS with its visual theme, UI paradigm, components, and features.

## Available Configurations

### Fully Detailed Examples

1. **windows95.json** - Windows 95 (1995)
   - Classic 3D beveled interface
   - Start menu and taskbar paradigm
   - Iconic Windows applications

2. **macos-system7.json** - Mac OS System 7 (1991)
   - Global menu bar
   - Spatial desktop metaphor
   - Classic Mac aesthetic

### Basic Examples

3. **linux-fvwm.json** - Linux with FVWM (1995)
   - Unix workstation environment
   - Virtual desktops
   - Lightweight window manager

4. **amigaos-workbench.json** - Amiga Workbench 3.1 (1994)
   - Distinctive blue/orange color scheme
   - Preemptive multitasking
   - Custom hardware integration

## File Structure

Each OS configuration follows this structure:

```
{
  schema_version: "1.0.0",
  os_id: "unique-identifier",

  metadata: { ... },      // OS identity and history
  visual: { ... },        // Look and feel
  paradigm: { ... },      // Interaction model
  components: { ... },    // Included apps/modules
  features: { ... },      // Capabilities
  assets: { ... }         // Resource paths
}
```

## Creating New OS Configurations

### Step 1: Choose an OS Category

Determine which category fits your OS:

- `desktop_windows` - Windows family
- `desktop_mac` - Mac OS family
- `desktop_linux` - Linux distributions
- `desktop_unix` - Unix workstations
- `desktop_alternative` - BeOS, AmigaOS, OS/2, etc.
- `mobile_classic` - Palm OS, Symbian, Windows Mobile
- `mobile_modern` - iOS, Android
- `embedded` - Embedded systems
- `server` - Server OS
- `mainframe` - Mainframe OS

### Step 2: Define Visual Theme

The visual theme is the most distinctive aspect:

```json
{
  "visual": {
    "theme": {
      "colors": {
        "desktop": "#008080",
        "windowBackground": "#C0C0C0",
        // ... complete color palette
      },
      "typography": {
        "systemFont": {
          "family": "MS Sans Serif",
          "size": 11
        }
      },
      "style": {
        "type": "bevel_3d",
        "bevels": true,
        "gradients": false
      }
    }
  }
}
```

**Visual Style Types:**
- `classic` - Flat 2D (80s/early 90s)
- `bevel_3d` - 3D bevels (mid-90s)
- `aqua` - Mac OS X style
- `aero` - Windows Vista glass
- `metro` - Windows 8 flat tiles
- `material` - Android Material Design
- `flat` - Modern minimalist

### Step 3: Define UI Paradigm

How does the user interact with the OS?

```json
{
  "paradigm": {
    "windowSystem": {
      "type": "stacking",  // or "tiling", "mdi", "tabs"
      "behavior": {
        "resize": true,
        "minimize": true,
        "maximize": true
      }
    },
    "menuSystem": {
      "type": "menu_bar"   // or "global_menu", "start_menu"
    },
    "taskManagement": {
      "type": "taskbar"    // or "dock", "panel", "none"
    }
  }
}
```

**Common Paradigm Patterns:**

- **Windows-style**: Stacking windows + taskbar + in-window menus
- **Mac-style**: Stacking windows + global menu + dock
- **Unix-style**: Stacking/tiling windows + context menus + virtual desktops
- **Mobile-style**: Full-screen + cards + no windows

### Step 4: Configure Components

Define which applications come with the OS:

```json
{
  "components": {
    "core": {
      "windowManager": "module-id",
      "fileManager": "module-id"
    },
    "applications": [
      {
        "id": "notepad",
        "name": "Notepad",
        "icon": "icons/notepad.png",
        "type": "productivity",
        "window": {
          "title": "Untitled - Notepad",
          "width": 500,
          "height": 400
        }
      }
    ]
  }
}
```

### Step 5: Set Features and Assets

Enable features and point to assets:

```json
{
  "features": {
    "interaction": {
      "dragAndDrop": true,
      "clipboard": true
    },
    "animations": {
      "enabled": true,
      "speed": "normal"
    }
  },
  "assets": {
    "basePath": "/assets/os/my-os",
    "paths": {
      "icons": "icons",
      "sounds": "sounds"
    }
  }
}
```

## Common Patterns by Era

### 1980s (Classic Flat)

```json
{
  "visual": {
    "theme": {
      "style": {
        "type": "classic",
        "bevels": false,
        "gradients": false,
        "shadows": false
      },
      "typography": {
        "antialiasing": false
      }
    },
    "icons": {
      "style": "icon_16",
      "rendering": "aliased"
    }
  }
}
```

### 1990s (3D Bevels)

```json
{
  "visual": {
    "theme": {
      "style": {
        "type": "bevel_3d",
        "bevels": true,
        "gradients": false,
        "shadows": false
      }
    },
    "icons": {
      "style": "icon_32",
      "rendering": "aliased"
    }
  }
}
```

### 2000s (Skeuomorphic)

```json
{
  "visual": {
    "theme": {
      "style": {
        "type": "aqua",
        "gradients": true,
        "shadows": true,
        "transparency": true
      },
      "typography": {
        "antialiasing": true
      }
    },
    "icons": {
      "style": "photo_realistic",
      "rendering": "antialiased"
    }
  }
}
```

### 2010s (Flat/Material)

```json
{
  "visual": {
    "theme": {
      "style": {
        "type": "material",
        "bevels": false,
        "gradients": false,
        "shadows": true,
        "shadowStyle": "soft"
      }
    },
    "icons": {
      "style": "flat_modern",
      "rendering": "vector"
    }
  }
}
```

## Platform-Specific Features

### Windows Features

- Start menu (`taskManagement.taskbar.sections.start: true`)
- System tray (`taskManagement.taskbar.sections.system_tray: true`)
- In-window menus (`menuSystem.menuBar.position: "window"`)
- Alt+Tab switching
- Window control buttons on right

### Mac Features

- Global menu bar (`menuSystem.type: "global_menu"`)
- Apple menu (`menuSystem.menuBar.items.alwaysVisible: ["apple"]`)
- Dock (`taskManagement.type: "dock"`)
- Single-click icons (`desktop.interaction.click: "single"`)
- Window control buttons on left

### Unix/Linux Features

- Virtual desktops (`taskManagement.multitasking.virtual_desktops: true`)
- 3-button mouse (`inputMethods.mouse.buttons: 3`)
- Tiling window managers (`windowSystem.type: "tiling"`)
- Tear-off menus (`menuSystem.behavior.tearOff: true`)
- X11 applications

### Mobile Features

- Full-screen apps (`windowSystem.type: "full_screen"`)
- Touch input (`inputMethods.touch.enabled: true`)
- Gesture support
- Card-based multitasking
- No window chrome

## Color Palette Guide

### Essential Colors

Every OS needs these core colors defined:

```json
{
  "colors": {
    "desktop": "#008080",           // Desktop background
    "windowBackground": "#C0C0C0",  // Window content area
    "titleBarActive": "#000080",    // Active title bar
    "titleBarInactive": "#808080",  // Inactive title bar
    "highlight": "#000080",         // Selection highlight
    "highlightText": "#FFFFFF",     // Selected text
    "text": "#000000"               // Default text
  }
}
```

### Classic Color Schemes

**Windows 95 Gray:**
- Desktop: `#008080` (teal)
- Windows: `#C0C0C0` (gray)
- Title: `#000080` (navy blue)
- Buttons: 3D gray bevels

**Mac Platinum:**
- Desktop: `#CCCCCC` (light gray)
- Windows: `#FFFFFF` (white)
- Highlights: `#0000CC` (blue)
- Minimal shadows

**Amiga Blue/Orange:**
- Desktop: `#5555AA` (blue)
- Title: `#6688BB` (light blue)
- Highlight: `#FF8800` (orange)
- High contrast

## Typography Considerations

### System Fonts by Platform

- **Windows**: MS Sans Serif, Arial
- **Mac Classic**: Chicago, Geneva, Monaco
- **Unix/Linux**: Helvetica, Fixed
- **Amiga**: Topaz
- **NeXT**: Helvetica

### Font Size Guidelines

- **1980s**: 8-10px (small, bitmap)
- **1990s**: 10-12px (medium)
- **2000s**: 11-13px (smooth)
- **2010s**: 12-16px (retina)

### Antialiasing

- **Pre-1995**: Always false
- **1995-2000**: Optional
- **2000+**: Usually true
- **Modern**: Subpixel rendering

## Icon Design Guidelines

### Icon Sizes by Era

- **1980s**: 16x16 (Mac, Atari)
- **Early 90s**: 32x32 (Windows 3.1, System 7)
- **Late 90s**: 48x48 (Unix, Windows)
- **2000s**: Multiple sizes (16, 32, 48, 128)
- **Modern**: Vector/scalable

### Icon Style Matching

Match icon style to OS era:
- 80s: Pixel art, high contrast, simple
- 90s: More colors, slight depth
- 2000s: Realistic, shadows, gradients
- 2010s: Flat, minimalist, solid colors

## Animation Guidelines

### When to Enable Animations

- **Never**: DOS, early systems
- **Minimal**: Windows 95-98, System 7
- **Some**: Windows XP, Mac OS X
- **Full**: Modern systems

### Animation Types

```json
{
  "animations": {
    "enabled": true,
    "effects": {
      "windowOpen": true,      // Window appears
      "windowMinimize": true,  // Minimize to taskbar
      "menuOpen": true,        // Dropdown menus
      "transitions": true      // General transitions
    }
  }
}
```

## Testing Your Configuration

### Validation Checklist

- [ ] `schema_version` is "1.0.0"
- [ ] `os_id` is unique and lowercase-with-hyphens
- [ ] All required metadata fields present
- [ ] Desktop color is defined
- [ ] Window system type is specified
- [ ] At least one application configured
- [ ] Asset paths are correct
- [ ] Colors are valid CSS color strings
- [ ] Sizes are positive integers

### Visual Testing

1. Check color contrast (title bar text must be readable)
2. Verify icon sizes match grid layout
3. Test window resize/minimize/close behaviors
4. Confirm menu accessibility
5. Validate font rendering at target sizes

## Advanced Topics

### Custom Color Properties

Use the `custom` object for platform-specific colors:

```json
{
  "colors": {
    "custom": {
      "pagerBackground": "#606060",
      "scrollbarThumb": "#808080",
      "gadgetColor": "#FF8800"
    }
  }
}
```

### Multi-Instance Applications

Some apps should allow multiple windows:

```json
{
  "features": {
    "multiInstance": true
  }
}
```

### File Associations

Define which file types an app handles:

```json
{
  "features": {
    "fileAssociations": [".txt", ".log", ".ini"]
  }
}
```

### Easter Eggs

Add hidden features:

```json
{
  "features": {
    "easterEggs": {
      "enabled": true,
      "list": ["credits_volcano", "hidden_game"]
    }
  }
}
```

## Troubleshooting

### Common Issues

**Problem**: Colors look wrong
- **Solution**: Verify hex color format (#RRGGBB)
- Check contrast ratios for readability

**Problem**: Icons don't show
- **Solution**: Verify asset paths are correct
- Check icon sizes match configuration

**Problem**: Windows behave incorrectly
- **Solution**: Review window system type
- Check behavior flags (resize, minimize, etc.)

**Problem**: Menus don't appear
- **Solution**: Verify menu system type
- Check menu bar position setting

## Best Practices

1. **Start with an example**: Copy windows95.json or macos-system7.json
2. **Test incrementally**: Change one section at a time
3. **Document changes**: Add comments explaining custom settings
4. **Match historical accuracy**: Research actual OS appearance
5. **Consider accessibility**: Ensure sufficient color contrast
6. **Validate JSON**: Use a JSON validator before testing
7. **Test all interactions**: Try all buttons, menus, windows
8. **Optimize assets**: Use appropriate image formats and sizes

## Resources

- Full schema documentation: `/os-config-schema.md`
- Example configurations: This directory
- Asset guidelines: `/assets/README.md` (if available)
- Component documentation: `/src/components/README.md` (if available)

## Contributing

When adding new OS configurations:

1. Research the actual OS thoroughly
2. Use accurate color values (use screenshots/emulators)
3. Include representative applications
4. Add historical context in metadata
5. Test on multiple screen sizes
6. Document any custom properties
7. Submit with example screenshots

## Version History

- **1.0.0** (2024): Initial schema with support for 1980s-2020s operating systems
