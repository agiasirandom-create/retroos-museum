# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RetroOS Museum is an authentic retro operating system recreation system built with Eleventy (11ty). It features:
- Interactive timeline of 94 operating systems from 1980-2025
- Modular OS generator that creates fully functional OS recreations from JSON configurations
- Pixel-perfect recreations of Windows 95 and Mac OS System 7 with working applications
- Component-based UI system with reusable Nunjucks components

## Technology Stack

- **Static Site Generator**: Eleventy 3.1.2
- **Templating**: Nunjucks
- **JavaScript**: Vanilla ES6+ (no frameworks)
- **CSS**: Modern CSS with Grid/Flexbox, CSS Variables for theming
- **Architecture**: JSON-driven configuration system for OS instances

## Development Commands

```bash
# Install dependencies
npm install

# Start development server with live reload (http://localhost:8080)
npm start

# Build for production (_site/ directory)
npm run build

# Debug mode with Eleventy logging
npm run debug
```

## Architecture Overview

### Core Systems

The project uses a **modular OS generator architecture** where entire operating systems are defined in JSON and instantiated dynamically:

1. **OSGenerator** (`src/assets/js/os-generator.js`) - Main orchestrator
   - Loads and validates OS configurations from JSON
   - Coordinates all subsystems (theme, desktop, window manager)
   - Dispatches `os-initialized` event when ready

2. **ConfigValidator** (`src/assets/js/config-validator.js`) - Schema validation
   - Validates OS JSON against schema requirements
   - Normalizes configurations with defaults
   - Returns validation errors and warnings

3. **ThemeEngine** (`src/assets/js/theme-engine.js`) - Visual theming
   - Applies colors, fonts, and visual styles from OS config
   - Generates CSS variables dynamically
   - Handles OS-specific UI paradigms (bevels, gradients, etc.)

4. **WindowManager** (`src/assets/js/window-manager.js`) - Window system
   - Creates draggable, resizable windows with z-index stacking
   - Manages window state (minimize/maximize/restore)
   - Handles focus, persistence to localStorage
   - See `ARCHITECTURE.md` for detailed API and flow diagrams

5. **DesktopGenerator** (`src/assets/js/desktop-generator.js`) - Desktop creation
   - Generates desktop icons from OS config
   - Creates taskbar (Windows) or menubar (Mac OS)
   - Handles desktop interactions

6. **AppFactory** (`src/assets/js/app-factory.js`) - Application instantiation
   - Loads application components based on configuration
   - Creates working apps: Notepad, Explorer, Control Panel, Finder, SimpleText
   - Each app in `src/assets/js/apps/` directory

### OS Configuration Schema

OS instances are defined in JSON files at `src/_data/os/*.json`. Each config includes:

- **metadata**: name, version, company, release date, historical info
- **visual**: theme colors, typography, icons, sounds, wallpaper
- **paradigm**: window system behavior, menu system, taskbar/dock, desktop layout
- **components**: core components and application definitions
- **features**: drag-and-drop, animations, accessibility, easter eggs
- **assets**: paths to icons, cursors, sounds, fonts

See `os-config-schema.md` for full schema documentation.

### Adding a New OS

1. Create JSON config in `src/_data/os/your-os.json` based on schema
2. Create Nunjucks page in `src/os/your-os.njk` that loads the config:
   ```njk
   <script>
     fetch('/assets/data/os/your-os.json')
       .then(r => r.json())
       .then(config => osGenerator.initialize(config));
   </script>
   ```
3. Add OS data to timeline in `src/_data/os-{decade}.json`

### Component System

Reusable UI components in `src/_includes/components/`:
- `window.njk` - Draggable window with title bar and controls
- `button.njk` - Styled buttons with OS variants
- `menu.njk` - Menu bars, dropdowns, context menus
- `icon.njk` - Desktop icons, file icons
- `scrollbar.njk` - Custom styled scrollbars

OS-specific styles in `src/assets/css/components/`:
- `windows.css` - Windows 95/98 3D beveled style
- `macos.css` - Mac OS Classic flat black/white style
- `unix.css` - Unix/Motif 3D embossed style

Use components with `osStyle` parameter: `"win95"`, `"macos"`, or `"unix"`

### Application Development

To add a new application to an OS:

1. Create app component in `src/assets/js/apps/your-app.js`:
   ```js
   class YourApp {
     constructor(windowManager, config) { /* ... */ }
     init() { /* Create window and UI */ }
   }
   ```

2. Register in AppFactory's `createApp()` method

3. Add to OS JSON config in `components.applications[]`:
   ```json
   {
     "id": "your_app",
     "name": "Your App",
     "type": "utility",
     "component": "YourApp",
     "window": { /* window config */ },
     "desktop": { "icon": true }
   }
   ```

### File Organization

```
src/
├── _data/                  # Eleventy data files
│   ├── os/                # OS configurations (JSON)
│   └── os-{decade}.json   # Timeline data by decade
├── _includes/
│   ├── layouts/           # Page layouts (base.njk)
│   └── components/        # Reusable UI components
├── os/                    # OS instance pages
│   ├── windows-95.njk
│   └── macos-system7.njk
├── assets/
│   ├── css/               # Stylesheets
│   │   ├── components/    # Component styles by OS
│   │   ├── timeline.css   # Timeline page styles
│   │   └── window-system.css
│   ├── js/                # JavaScript modules
│   │   ├── apps/          # Application implementations
│   │   ├── os-generator.js
│   │   └── window-manager.js
│   └── data/              # JSON data for client-side
└── index.njk              # Timeline landing page
```

## Key Implementation Details

### Window System API

Global API exposed on `window.RetroOS`:
```js
// Create windows
RetroOS.createWindow({ title, content, width, height })

// Access managers
RetroOS.windowManager
RetroOS.menuSystem
RetroOS.desktop
```

See `WINDOW-SYSTEM-API.md` for complete API reference.

### State Persistence

Windows save position/size to localStorage with keys:
- `window-state-{windowId}` - window dimensions and position
- `app-state-{appId}` - application-specific state

### Keyboard Shortcuts

- `Alt+F4` - Close active window
- `Alt+Tab` - Switch windows (when implemented)
- `Ctrl/Cmd+K` - Focus search on timeline
- `0-5` - Navigate decades on timeline

## Documentation

- `ARCHITECTURE.md` - Complete window system architecture diagrams
- `QUICK_START.md` - Getting started with timeline features
- `COMPONENTS.md` - Component library reference
- `os-config-schema.md` - Full OS configuration schema
- `WINDOWS95_QUICKSTART.md` - Windows 95 implementation guide
- `MACOS7_QUICKSTART.md` - Mac OS 7 implementation guide
- `ROSM.md` - Historical OS information (1980s-2020s)

## Browser Compatibility

- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- IE11 has limited support (requires transpilation for ES6 features)
- Mobile browsers supported with responsive design

## Historical Accuracy Guidelines

When recreating OS interfaces:
- Reference ROSM.md for accurate OS timeline and feature sets
- Use period-appropriate fonts: MS Sans Serif (Windows), Chicago/Geneva (Mac OS)
- Match exact color palettes (e.g., Windows 95 teal desktop #008080)
- Recreate authentic interaction patterns (double-click to open, right-click context menus)
- Include historically accurate default applications and icons
