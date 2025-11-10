# OS Configuration Schema Documentation

## Overview

This schema defines a comprehensive, flexible configuration system for representing operating systems from the 1980s through 2020s. The design prioritizes extensibility, allowing new OS types to be added without schema changes.

## Design Philosophy

### Core Principles

1. **Modularity**: Each OS is composed of pluggable components (window manager, file browser, taskbar, etc.)
2. **Declarative**: Configuration describes what the OS should look like, not how to build it
3. **Extensibility**: New fields can be added without breaking existing configurations
4. **Backward Compatible**: Older OS paradigms are first-class citizens, not afterthoughts
5. **Asset-Driven**: Visual elements reference external assets for easy customization

### Schema Structure

The schema is organized into these major sections:

```
metadata (who, what, when)
  └─ Basic identifying information

visual (look and feel)
  └─ theme: Colors, fonts, borders
  └─ cursor: Mouse cursor styles
  └─ icons: Icon set and style
  └─ sounds: System sound effects

paradigm (interaction model)
  └─ windowSystem: How windows behave
  └─ menuSystem: Menu bar, context menus
  └─ taskManagement: How apps are switched
  └─ desktop: Icon placement and behavior

components (what's included)
  └─ core: Essential OS components
  └─ applications: Bundled demo apps

features (capabilities)
  └─ interaction: What users can do
  └─ animations: Motion design

assets (resources)
  └─ paths: Where to find images, fonts, etc.
```

## Schema Definition

### Root Object

```typescript
interface OSConfig {
  schema_version: string;           // Format: "1.0.0"
  os_id: string;                    // Unique identifier (slug format)

  metadata: Metadata;
  visual: VisualConfiguration;
  paradigm: UIParadigm;
  components: ComponentConfiguration;
  features: FeatureConfiguration;
  assets: AssetConfiguration;
}
```

---

## Detailed Field Documentation

### 1. Metadata Section

Describes the OS identity and historical context.

```typescript
interface Metadata {
  name: string;                     // Display name
  fullName?: string;                // Full official name if different
  version: string;                  // Version number or name
  company: string;                  // Developing company
  releaseYear: number;              // Year of release
  releaseDate?: string;             // Full date if known (ISO 8601)

  description: string;              // Short description (1-2 sentences)
  tagline?: string;                 // Marketing tagline or slogan

  category: OSCategory;             // Type of OS
  architecture: string[];           // CPU architectures supported

  historical: {
    significance?: string;          // Why this OS matters
    marketShare?: string;           // Peak market position
    successor?: string;             // OS that replaced it
    predecessor?: string;           // OS it replaced
    endOfLife?: string;             // When support ended
  };

  links?: {
    wikipedia?: string;
    officialSite?: string;
    documentation?: string;
  };
}

enum OSCategory {
  DESKTOP_WINDOWS = "desktop_windows",
  DESKTOP_MAC = "desktop_mac",
  DESKTOP_LINUX = "desktop_linux",
  DESKTOP_UNIX = "desktop_unix",
  DESKTOP_ALTERNATIVE = "desktop_alternative",
  MOBILE_CLASSIC = "mobile_classic",      // Pre-smartphone
  MOBILE_MODERN = "mobile_modern",        // iOS/Android era
  EMBEDDED = "embedded",
  SERVER = "server",
  MAINFRAME = "mainframe"
}
```

---

### 2. Visual Configuration Section

Defines the complete visual appearance.

```typescript
interface VisualConfiguration {
  theme: ThemeConfiguration;
  cursor: CursorConfiguration;
  icons: IconConfiguration;
  sounds?: SoundConfiguration;
  wallpaper: WallpaperConfiguration;
}

interface ThemeConfiguration {
  // Color Palette
  colors: {
    // Desktop/Background
    desktop: string;                // Desktop background color

    // Window Chrome
    windowBackground: string;       // Window content area
    windowBorder: string;           // Window border
    windowBorderWidth: number;      // Border width in pixels

    // Title Bars
    titleBarActive: string;         // Active window title bar
    titleBarInactive: string;       // Inactive window title bar
    titleBarText: string;           // Title text color
    titleBarTextInactive?: string;  // Inactive title text

    // UI Controls
    buttonFace: string;             // Button background
    buttonText: string;             // Button text
    buttonHighlight: string;        // Button highlight (3D effect)
    buttonShadow: string;           // Button shadow (3D effect)
    buttonBorder?: string;          // Button border

    // Selections
    highlight: string;              // Selected item background
    highlightText: string;          // Selected item text

    // Menus
    menuBackground: string;         // Menu background
    menuText: string;               // Menu text
    menuHighlight?: string;         // Menu item hover (if different)

    // Text and Content
    text: string;                   // Default text color
    textDisabled?: string;          // Disabled text
    link?: string;                  // Hyperlink color

    // Status and System
    statusBar?: string;             // Status bar background
    taskbar?: string;               // Taskbar/dock background

    // Special Effects
    shadow?: string;                // Drop shadow color
    glow?: string;                  // Glow effect color

    // Custom Colors (for OS-specific needs)
    custom?: Record<string, string>;
  };

  // Typography
  typography: {
    systemFont: FontDefinition;     // Default UI font
    titleFont?: FontDefinition;     // Window titles
    menuFont?: FontDefinition;      // Menus
    monospaceFont?: FontDefinition; // Terminal/code

    // Text Rendering
    antialiasing: boolean;          // Smooth fonts
    subpixelRendering?: boolean;    // LCD optimization (post-2000)

    // Sizes
    baseFontSize: number;           // Base size in pixels
    scaleFactor?: number;           // Global scale (for HiDPI)
  };

  // Visual Style
  style: {
    type: UIStyleType;              // Overall style paradigm

    // Border Styles
    borderStyle: BorderStyle;       // How borders are drawn
    cornerRadius: number;           // Rounded corners (pixels)

    // Effects
    shadows: boolean;               // Drop shadows enabled
    shadowStyle?: ShadowStyle;      // Shadow rendering approach
    transparency: boolean;          // Alpha transparency support
    blur?: boolean;                 // Blur effects (modern)

    // 3D Effects
    bevels: boolean;                // Beveled edges (90s style)
    gradients: boolean;             // Gradient fills
    textures?: boolean;             // Texture fills (brushed metal, etc.)

    // Animation
    animationStyle?: AnimationStyle;
  };

  // Special Visual Elements
  specialElements?: {
    scrollbarStyle?: ScrollbarStyle;
    focusIndicator?: FocusStyle;
    dragVisual?: DragStyle;
  };
}

interface FontDefinition {
  family: string;                   // Font family name
  size: number;                     // Size in pixels
  weight?: string | number;         // Font weight
  style?: "normal" | "italic";
  fallback?: string[];              // Fallback fonts
}

enum UIStyleType {
  FLAT = "flat",                    // Flat design (early, or modern minimalist)
  SKEUOMORPHIC = "skeuomorphic",    // Real-world metaphors
  NEUMORPHIC = "neumorphic",        // Soft UI (modern)
  BEVEL_3D = "bevel_3d",           // Classic 3D bevels (90s)
  AQUA = "aqua",                    // Mac OS X Aqua style
  AERO = "aero",                    // Windows Vista/7 glass
  METRO = "metro",                  // Windows 8 flat tiles
  MATERIAL = "material",            // Android Material Design
  CLASSIC = "classic"               // Simple 2D (80s/early 90s)
}

enum BorderStyle {
  NONE = "none",
  SINGLE = "single",                // Single line
  DOUBLE = "double",                // Double line
  BEVEL_OUT = "bevel_out",         // Raised bevel
  BEVEL_IN = "bevel_in",           // Inset bevel
  ETCHED = "etched",                // Etched line
  RIDGE = "ridge",                  // Ridge effect
  SHADOW = "shadow",                // Simple shadow
  CUSTOM = "custom"                 // Custom implementation
}

enum ShadowStyle {
  NONE = "none",
  SIMPLE = "simple",                // Single color offset
  SOFT = "soft",                    // Blurred shadow
  HARD = "hard",                    // Sharp shadow
  REALISTIC = "realistic"           // Complex realistic shadow
}

enum AnimationStyle {
  NONE = "none",
  INSTANT = "instant",              // No animation
  LINEAR = "linear",                // Linear transitions
  EASE = "ease",                    // Eased transitions
  BOUNCE = "bounce",                // Bouncy (elastic)
  MORPH = "morph"                   // Morphing transitions
}

enum ScrollbarStyle {
  CLASSIC = "classic",              // Traditional scrollbars
  THIN = "thin",                    // Thin modern scrollbars
  OVERLAY = "overlay",              // Auto-hide overlays
  CUSTOM = "custom"
}

enum FocusStyle {
  DOTTED_OUTLINE = "dotted_outline",
  SOLID_OUTLINE = "solid_outline",
  GLOW = "glow",
  INSET = "inset"
}

enum DragStyle {
  OUTLINE = "outline",              // Outline of object
  GHOST = "ghost",                  // Semi-transparent
  FULL = "full"                     // Full object
}

interface CursorConfiguration {
  style: CursorStyle;
  customCursors?: {
    default?: string;               // Path to cursor image
    pointer?: string;               // Link/button cursor
    text?: string;                  // Text selection cursor
    wait?: string;                  // Busy/loading cursor
    resize?: string;                // Resize cursor
    [key: string]: string | undefined;
  };
  animated?: boolean;               // Animated cursors support
  shadows?: boolean;                // Cursor shadows
}

enum CursorStyle {
  CLASSIC_ARROW = "classic_arrow",
  MODERN_ARROW = "modern_arrow",
  MAC_ARROW = "mac_arrow",
  HAND = "hand",
  CROSSHAIR = "crosshair",
  CUSTOM = "custom"
}

interface IconConfiguration {
  style: IconStyle;
  size: {
    default: number;                // Default icon size (pixels)
    sizes: number[];                // Available sizes
  };
  rendering: IconRendering;
  shadow?: boolean;
  labelStyle: {
    position: "below" | "right" | "none";
    background: "transparent" | "solid" | "gradient";
    backgroundColor?: string;
    textColor?: string;
    font?: FontDefinition;
  };
}

enum IconStyle {
  PIXEL_ART = "pixel_art",          // Low-res pixel art (80s/90s)
  ICON_16 = "icon_16",              // 16x16 icons
  ICON_32 = "icon_32",              // 32x32 icons
  ICON_48 = "icon_48",              // 48x48 icons
  PHOTO_REALISTIC = "photo_realistic", // Realistic (2000s)
  FLAT_MODERN = "flat_modern",      // Modern flat design
  SKEUOMORPHIC = "skeuomorphic",    // iOS-style realistic
  MATERIAL = "material",            // Material Design
  FLUENT = "fluent"                 // Windows 11 style
}

enum IconRendering {
  ALIASED = "aliased",              // Hard edges
  ANTIALIASED = "antialiased",      // Smooth edges
  VECTOR = "vector"                 // SVG/vector
}

interface SoundConfiguration {
  enabled: boolean;
  sounds: {
    startup?: string;               // Startup chime
    shutdown?: string;              // Shutdown sound
    error?: string;                 // Error beep
    warning?: string;               // Warning sound
    notification?: string;          // Notification
    click?: string;                 // UI click
    windowOpen?: string;            // Window open
    windowClose?: string;           // Window close
    trash?: string;                 // Move to trash
    [key: string]: string | undefined;
  };
  volume?: number;                  // 0-100
}

interface WallpaperConfiguration {
  type: "solid" | "pattern" | "image" | "gradient";
  value: string;                    // Color, path, or gradient definition
  pattern?: PatternStyle;
  tiling?: "tile" | "center" | "stretch" | "fit" | "fill";
  overlay?: boolean;                // Can be changed by user
}

enum PatternStyle {
  NONE = "none",
  DOTS = "dots",
  GRID = "grid",
  DIAGONAL = "diagonal",
  CUSTOM = "custom"
}
```

---

### 3. UI Paradigm Section

Defines how users interact with the OS.

```typescript
interface UIParadigm {
  windowSystem: WindowSystemConfiguration;
  menuSystem: MenuSystemConfiguration;
  taskManagement: TaskManagementConfiguration;
  desktop: DesktopConfiguration;
  inputMethods: InputMethodConfiguration;
}

interface WindowSystemConfiguration {
  type: WindowSystemType;

  // Window Behavior
  behavior: {
    overlap: boolean;               // Overlapping windows
    resize: boolean;                // User can resize
    minimize: boolean;              // Can minimize
    maximize: boolean;              // Can maximize
    close: boolean;                 // Can close

    // Window States
    modal: boolean;                 // Modal dialogs supported
    alwaysOnTop?: boolean;          // Always-on-top support
    transparency?: boolean;         // Transparent windows

    // Multi-Window
    multipleDocuments?: boolean;    // MDI support
    tabbed?: boolean;               // Tabbed windows (modern)
    tiling?: boolean;               // Tiling window support
  };

  // Window Chrome
  chrome: {
    titleBar: TitleBarStyle;
    controls: WindowControlStyle;
    controlPosition: "left" | "right" | "both";

    // Window Buttons
    buttons: {
      close?: ButtonDefinition;
      minimize?: ButtonDefinition;
      maximize?: ButtonDefinition;
      menu?: ButtonDefinition;      // System menu
      help?: ButtonDefinition;      // Help button (Windows)
      custom?: ButtonDefinition[];
    };

    // Title Bar Content
    titleAlign: "left" | "center" | "right";
    showIcon?: boolean;             // App icon in title bar
    showPath?: boolean;             // File path in title bar
  };

  // Window Effects
  effects: {
    openAnimation?: WindowAnimation;
    closeAnimation?: WindowAnimation;
    minimizeAnimation?: WindowAnimation;
    maximizeAnimation?: WindowAnimation;

    shadow?: boolean;
    blur?: boolean;                 // Blur behind (modern)
    wobbly?: boolean;               // Wobbly windows (Linux)
  };
}

enum WindowSystemType {
  NONE = "none",                    // No window system
  STACKING = "stacking",            // Traditional overlapping
  TILING = "tiling",                // Tiling WM
  HYBRID = "hybrid",                // Mix of both
  MDI = "mdi",                      // Multiple Document Interface
  TABS = "tabs",                    // Tabbed interface
  FULL_SCREEN = "full_screen"       // One app at a time (mobile)
}

enum TitleBarStyle {
  CLASSIC = "classic",              // Traditional title bar
  UNIFIED = "unified",              // Content extends into title bar
  HIDDEN = "hidden",                // No title bar
  MINIMAL = "minimal"               // Minimal decorations
}

enum WindowControlStyle {
  BUTTONS = "buttons",              // Traditional buttons
  ICONS = "icons",                  // Icon buttons
  TEXT = "text",                    // Text labels
  MENU = "menu"                     // Menu-based
}

interface ButtonDefinition {
  style: "icon" | "text" | "image";
  content: string;                  // Icon name, text, or path
  position?: number;                // Order in title bar
  color?: string;
  hoverColor?: string;
}

enum WindowAnimation {
  NONE = "none",
  FADE = "fade",
  SLIDE = "slide",
  ZOOM = "zoom",
  MINIMIZE_TO_ICON = "minimize_to_icon",
  GENIE = "genie",                  // Mac OS genie effect
  SCALE = "scale",
  ROLL = "roll"                     // Roll up like a shade
}

interface MenuSystemConfiguration {
  type: MenuSystemType;

  // Menu Bar
  menuBar: {
    enabled: boolean;
    position: "top" | "window" | "both" | "none";
    sticky?: boolean;               // Always visible
    autoHide?: boolean;             // Auto-hide when not in use

    style: {
      background?: string;
      textColor?: string;
      height?: number;
      font?: FontDefinition;
    };

    // Menu Items
    items: {
      alwaysVisible?: string[];     // Always show these (e.g., Apple menu)
      applicationMenu?: boolean;    // App name menu (Mac)
      systemMenu?: boolean;         // System menu (Start, etc.)
    };
  };

  // Context Menus
  contextMenu: {
    enabled: boolean;
    trigger: "right_click" | "long_press" | "ctrl_click";
    style?: {
      background?: string;
      borderStyle?: string;
    };
  };

  // Menu Behavior
  behavior: {
    clickToOpen?: boolean;          // Click or hover to open
    keyboardShortcuts?: boolean;    // Alt+Letter shortcuts
    mnemonics?: boolean;            // Underlined letters
    icons?: boolean;                // Icons in menus
    cascading?: boolean;            // Submenu support
    tearOff?: boolean;              // Tear-off menus (Unix)
  };
}

enum MenuSystemType {
  MENU_BAR = "menu_bar",            // Traditional menu bar
  GLOBAL_MENU = "global_menu",      // Mac-style global menu
  APPLICATION_MENU = "application_menu", // Menu in window
  START_MENU = "start_menu",        // Windows Start menu
  DOCK_MENU = "dock_menu",          // Mac dock menus
  CONTEXT_ONLY = "context_only",    // Context menus only
  HYBRID = "hybrid"                 // Multiple types
}

interface TaskManagementConfiguration {
  type: TaskManagementType;

  // Taskbar/Dock
  taskbar?: {
    enabled: boolean;
    position: "bottom" | "top" | "left" | "right";
    autoHide?: boolean;
    size?: number;                  // Height/width in pixels

    style: {
      background?: string;
      transparency?: boolean;
      blur?: boolean;

      itemStyle: TaskbarItemStyle;
      grouping?: boolean;           // Group similar windows
      previews?: boolean;           // Window previews on hover
    };

    sections?: {
      start?: boolean;              // Start button
      quick_launch?: boolean;       // Quick launch area
      tasks?: boolean;              // Running tasks
      system_tray?: boolean;        // System tray
      clock?: boolean;              // Clock
    };
  };

  // Application Switching
  switching: {
    method: SwitchingMethod[];      // Multiple methods possible
    altTab?: {
      enabled: boolean;
      visual: "list" | "icons" | "thumbnails";
      animation?: boolean;
    };
    expose?: {                      // Mac Exposé-style
      enabled: boolean;
      layout: "grid" | "cascade";
    };
  };

  // Multitasking
  multitasking: {
    preemptive?: boolean;           // Preemptive multitasking
    virtual_desktops?: boolean;     // Multiple workspaces
    snapAssist?: boolean;           // Window snapping (modern)
    splitScreen?: boolean;          // Split-screen multitasking
  };
}

enum TaskManagementType {
  TASKBAR = "taskbar",              // Windows taskbar
  DOCK = "dock",                    // Mac dock
  PANEL = "panel",                  // Linux panel
  SYSTEM_TRAY = "system_tray",      // System tray only
  NONE = "none",                    // No task management
  CARDS = "cards"                   // Card-based (mobile)
}

enum TaskbarItemStyle {
  BUTTONS = "buttons",
  ICONS = "icons",
  LABELS = "labels",
  ICONS_AND_LABELS = "icons_and_labels",
  THUMBNAILS = "thumbnails"
}

enum SwitchingMethod {
  ALT_TAB = "alt_tab",
  DOCK_CLICK = "dock_click",
  TASKBAR_CLICK = "taskbar_click",
  WINDOW_LIST = "window_list",
  EXPOSE = "expose",
  MISSION_CONTROL = "mission_control",
  GESTURE = "gesture"
}

interface DesktopConfiguration {
  type: DesktopType;

  // Icon Placement
  layout: {
    type: LayoutType;
    grid?: {
      columns?: number;
      rows?: number;
      cellWidth: number;
      cellHeight: number;
      spacing: number;
    };
    direction?: "vertical" | "horizontal"; // Fill direction
    alignment?: "left" | "right" | "top" | "bottom";
    snapToGrid?: boolean;
    autoArrange?: boolean;
  };

  // Desktop Items
  items: {
    icons?: boolean;                // Desktop icons enabled
    widgets?: boolean;              // Widgets/gadgets (Vista, modern)
    shortcuts?: boolean;            // Shortcut support
    folders?: boolean;              // Folders on desktop

    defaultItems?: string[];        // Default desktop items
  };

  // Interaction
  interaction: {
    click: "single" | "double";     // Click to open
    selection: "single" | "multiple" | "rubber_band";
    dragAndDrop?: boolean;
    hoverPreview?: boolean;         // Preview on hover
  };

  // Desktop Behavior
  behavior?: {
    showTrash?: boolean;
    showComputer?: boolean;
    showNetwork?: boolean;
    showHome?: boolean;
  };
}

enum DesktopType {
  SPATIAL = "spatial",              // Icons represent locations
  ICONIC = "iconic",                // Icon-based desktop
  CLEAN = "clean",                  // Minimal/no desktop icons
  DASHBOARD = "dashboard",          // Widget dashboard
  NONE = "none"                     // No desktop concept
}

enum LayoutType {
  GRID = "grid",                    // Snap to grid
  FREE_FORM = "free_form",          // Place anywhere
  LIST = "list",                    // List view
  AUTOMATIC = "automatic"           // OS-managed placement
}

interface InputMethodConfiguration {
  keyboard: {
    shortcuts?: boolean;
    function_keys?: boolean;
    navigation?: "arrows" | "vim" | "emacs" | "custom";
    accessibility?: boolean;        // Sticky keys, etc.
  };

  mouse: {
    buttons: number;                // Number of buttons
    scroll?: "none" | "wheel" | "trackball";
    gestures?: boolean;             // Mouse gestures
    acceleration?: boolean;
  };

  touch?: {
    enabled: boolean;
    multitouch?: boolean;
    gestures?: TouchGesture[];
    pressureSensitive?: boolean;
  };

  pen?: {
    enabled: boolean;
    pressureLevels?: number;
    tilt?: boolean;
    eraser?: boolean;
  };

  voice?: {
    enabled: boolean;
    commands?: string[];
  };
}

enum TouchGesture {
  TAP = "tap",
  DOUBLE_TAP = "double_tap",
  LONG_PRESS = "long_press",
  SWIPE = "swipe",
  PINCH = "pinch",
  ROTATE = "rotate",
  MULTI_FINGER = "multi_finger"
}
```

---

### 4. Component Configuration Section

Defines which modules and applications are included.

```typescript
interface ComponentConfiguration {
  core: CoreComponents;
  applications: ApplicationConfiguration[];
  utilities?: UtilityConfiguration[];
}

interface CoreComponents {
  windowManager: string;            // Module ID
  fileManager: string;              // Module ID

  optional: {
    taskbar?: string;               // Module ID or null
    dock?: string;
    systemTray?: string;
    menuBar?: string;
    terminal?: string;
    textEditor?: string;
    imageViewer?: string;
    mediaPlayer?: string;
    webBrowser?: string;
    emailClient?: string;
  };
}

interface ApplicationConfiguration {
  id: string;                       // Unique app ID
  name: string;                     // Display name
  icon: string;                     // Icon path

  // Application Type
  type: ApplicationType;
  component?: string;               // React component name

  // Window Properties
  window: {
    title: string;
    width: number;
    height: number;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;

    resizable?: boolean;
    minimizable?: boolean;
    maximizable?: boolean;

    position?: "center" | "cascade" | { x: number; y: number };
  };

  // Desktop Presence
  desktop?: {
    icon: boolean;                  // Show desktop icon
    position?: { x: number; y: number };
  };

  // Menu/Launcher Presence
  menu?: {
    path?: string;                  // Menu path (e.g., "Accessories/Games")
    category?: string;              // Category
  };

  // Application Features
  features?: {
    saveState?: boolean;            // Save window position/state
    multiInstance?: boolean;        // Multiple windows allowed
    fileAssociations?: string[];    // File types it handles
  };

  // Demo Content
  content?: any;                    // App-specific demo content
}

enum ApplicationType {
  SYSTEM = "system",                // System utility
  PRODUCTIVITY = "productivity",    // Productivity app
  CREATIVE = "creative",            // Creative app
  GAME = "game",                    // Game
  MEDIA = "media",                  // Media player
  COMMUNICATION = "communication",  // Chat, email, etc.
  DEVELOPER = "developer",          // Developer tool
  UTILITY = "utility",              // Utility app
  DEMO = "demo",                    // Demo/sample app
  WEB = "web"                       // Web-based app
}

interface UtilityConfiguration {
  id: string;
  name: string;
  type: "system_preference" | "control_panel" | "extension" | "service";
  icon?: string;
  component?: string;
}
```

---

### 5. Feature Configuration Section

Defines interactive capabilities and animations.

```typescript
interface FeatureConfiguration {
  // Interaction Capabilities
  interaction: {
    dragAndDrop: boolean;
    clipboard: boolean;
    undo: boolean;

    fileOperations: {
      copy: boolean;
      move: boolean;
      delete: boolean;
      rename: boolean;
      properties: boolean;
    };

    networking?: {
      enabled: boolean;
      protocols?: string[];         // HTTP, FTP, etc.
    };

    printing?: boolean;
    scanning?: boolean;
  };

  // Animation Settings
  animations: {
    enabled: boolean;
    speed: "slow" | "normal" | "fast";

    effects: {
      windowOpen?: boolean;
      windowClose?: boolean;
      windowMinimize?: boolean;
      minimize?: boolean;
      maximize?: boolean;

      menuOpen?: boolean;
      hover?: boolean;
      click?: boolean;

      transitions?: boolean;        // General transitions
      parallax?: boolean;            // Parallax effects (modern)
    };
  };

  // Accessibility
  accessibility?: {
    highContrast?: boolean;
    screenReader?: boolean;
    magnifier?: boolean;
    keyboard_navigation?: boolean;
    colorblindModes?: string[];
  };

  // Easter Eggs
  easterEggs?: {
    enabled: boolean;
    list?: string[];                // List of easter egg IDs
  };

  // Customization
  customization?: {
    themes?: boolean;               // User can change themes
    wallpaper?: boolean;            // User can change wallpaper
    colors?: boolean;               // User can change colors
    fonts?: boolean;                // User can change fonts
    layout?: boolean;               // User can change layout
  };
}
```

---

### 6. Asset Configuration Section

Defines where to find visual and audio assets.

```typescript
interface AssetConfiguration {
  basePath: string;                 // Base path for all assets

  paths: {
    icons: string;                  // Icon directory
    cursors?: string;               // Cursor directory
    sounds?: string;                // Sound directory
    fonts?: string;                 // Font directory
    wallpapers?: string;            // Wallpaper directory
    themes?: string;                // Theme directory
  };

  // Asset Collections
  iconSets?: {
    [setName: string]: {
      path: string;
      format: "png" | "svg" | "ico";
      sizes: number[];
    };
  };

  cursorSets?: {
    [setName: string]: {
      path: string;
      format: "cur" | "png" | "svg";
      animated?: boolean;
    };
  };

  soundSets?: {
    [setName: string]: {
      path: string;
      format: "wav" | "mp3" | "ogg";
    };
  };

  // Font Definitions
  fonts?: {
    [fontName: string]: {
      path: string;
      format: "ttf" | "otf" | "woff" | "woff2";
      weights?: number[];
      styles?: string[];
    };
  };

  // Pre-loaded Assets
  preload?: string[];               // Asset paths to preload
}
```

---

## Design Decisions

### 1. Flat vs. Nested Structure

**Decision**: Use moderate nesting with clear section boundaries

**Rationale**:
- Too flat: Hard to organize, naming conflicts
- Too nested: Verbose access paths, harder to understand
- Current structure: 2-3 levels deep max, grouped by concern

### 2. Enums vs. Strings

**Decision**: Use TypeScript enums for documentation, accept strings in JSON

**Rationale**:
- Enums provide clear options in code
- JSON can use string values for flexibility
- Validation happens at runtime, not parse time

### 3. Optional Fields

**Decision**: Most fields optional with sensible defaults

**Rationale**:
- Older OSes lack many modern features
- Missing fields = feature not applicable
- Required fields limited to: schema_version, os_id, metadata.name, category

### 4. Asset References

**Decision**: Use path strings, not embedded data

**Rationale**:
- Keep JSON files small and readable
- Assets can be shared between OS configs
- Easier to swap assets without changing config
- Supports lazy loading

### 5. Component-Based Architecture

**Decision**: Reference components by ID/name strings

**Rationale**:
- Loose coupling between config and implementation
- Same config can work with multiple rendering engines
- Components can be swapped without config changes
- Supports future extensibility

### 6. Color Values

**Decision**: Use CSS color strings (hex, rgb, named)

**Rationale**:
- Familiar to web developers
- Flexible (hex, rgb, rgba, hsl, named colors)
- Direct CSS output possible

### 7. Measurement Units

**Decision**: Pixels for everything

**Rationale**:
- Retro OSes used pixel measurements
- Consistent and simple
- Can be scaled via scale factor if needed

### 8. Animation Definitions

**Decision**: Named animation types, not detailed keyframes

**Rationale**:
- Config describes intent, not implementation
- Implementation can vary by rendering engine
- Easier to write and maintain
- Performance optimization possible

---

## Edge Cases and Variations

### Handling Different OS Paradigms

#### 1. No Window System (DOS, Early Systems)

```json
{
  "paradigm": {
    "windowSystem": {
      "type": "none"
    }
  }
}
```

#### 2. Full-Screen Only (Early Mobile)

```json
{
  "paradigm": {
    "windowSystem": {
      "type": "full_screen",
      "behavior": {
        "overlap": false,
        "resize": false
      }
    }
  }
}
```

#### 3. MDI (Multiple Document Interface)

```json
{
  "paradigm": {
    "windowSystem": {
      "type": "mdi",
      "behavior": {
        "multipleDocuments": true
      }
    }
  }
}
```

#### 4. Tiling Window Manager (Linux)

```json
{
  "paradigm": {
    "windowSystem": {
      "type": "tiling",
      "behavior": {
        "tiling": true,
        "resize": true,
        "maximize": false
      }
    }
  }
}
```

### Platform-Specific Features

#### Mac OS Global Menu

```json
{
  "paradigm": {
    "menuSystem": {
      "type": "global_menu",
      "menuBar": {
        "position": "top",
        "sticky": true,
        "items": {
          "alwaysVisible": ["apple"],
          "applicationMenu": true
        }
      }
    }
  }
}
```

#### Windows Start Menu

```json
{
  "paradigm": {
    "menuSystem": {
      "type": "start_menu"
    },
    "taskManagement": {
      "taskbar": {
        "sections": {
          "start": true,
          "quick_launch": true
        }
      }
    }
  }
}
```

### Visual Style Variations

#### Classic Flat (System 7, Windows 3.1)

```json
{
  "visual": {
    "theme": {
      "style": {
        "type": "classic",
        "borderStyle": "single",
        "bevels": false,
        "gradients": false,
        "shadows": false
      }
    }
  }
}
```

#### 3D Bevels (Windows 95, Classic Theme)

```json
{
  "visual": {
    "theme": {
      "style": {
        "type": "bevel_3d",
        "borderStyle": "bevel_out",
        "bevels": true,
        "gradients": false,
        "shadows": false
      }
    }
  }
}
```

#### Aqua (Mac OS X)

```json
{
  "visual": {
    "theme": {
      "style": {
        "type": "aqua",
        "borderStyle": "custom",
        "bevels": false,
        "gradients": true,
        "shadows": true,
        "shadowStyle": "soft",
        "transparency": true
      }
    }
  }
}
```

#### Aero (Windows Vista/7)

```json
{
  "visual": {
    "theme": {
      "style": {
        "type": "aero",
        "transparency": true,
        "blur": true,
        "shadows": true,
        "shadowStyle": "soft"
      }
    }
  }
}
```

---

## Validation Rules

### Required Fields

```
- schema_version
- os_id
- metadata.name
- metadata.version
- metadata.company
- metadata.releaseYear
- metadata.category
- visual.theme.colors.desktop
- paradigm.windowSystem.type
```

### Constraints

```
- colors: Must be valid CSS color strings
- sizes: Must be positive integers
- years: Must be 1970-2030
- paths: Must be valid relative paths
- percentages: 0-100
- opacity: 0-1
```

---

## Extension Points

### Adding New Features

The schema supports extension without breaking existing configs:

1. **New Fields**: Add optional fields at any level
2. **Custom Objects**: Use `custom` or `extra` fields for OS-specific data
3. **Component Types**: Add new application or component types
4. **Asset Types**: Add new asset collections
5. **Style Variants**: Add new enum values

### Version Migration

When schema changes:

1. Increment `schema_version`
2. Provide migration tools for old configs
3. Support multiple schema versions simultaneously
4. Use sensible defaults for new fields

---

## Usage Examples

### Minimal Config

```json
{
  "schema_version": "1.0.0",
  "os_id": "simple-os",
  "metadata": {
    "name": "Simple OS",
    "version": "1.0",
    "company": "Example Corp",
    "releaseYear": 1990,
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
    "windowSystem": {
      "type": "stacking"
    }
  }
}
```

### Maximum Config

See the example configurations for Windows 95 and Mac OS System 7 for comprehensive examples using most available fields.

---

## Implementation Notes

### Parsing and Validation

1. Load JSON file
2. Validate schema version compatibility
3. Validate required fields
4. Apply defaults for missing optional fields
5. Validate data types and constraints
6. Load referenced assets
7. Initialize components

### Rendering Pipeline

1. Parse configuration
2. Initialize theme system with visual config
3. Create window manager based on paradigm
4. Load and register components
5. Create desktop layout
6. Initialize applications
7. Apply animations and effects

### Performance Considerations

1. **Lazy Loading**: Load assets on demand
2. **Caching**: Cache parsed configs and assets
3. **Preloading**: Use preload list for critical assets
4. **Optimization**: Disable animations on slow systems
5. **Scaling**: Use scale factor for performance tuning

---

## Future Enhancements

Potential additions for v2.0:

1. **Localization**: Multi-language support
2. **Theming**: Runtime theme switching
3. **Plugins**: Third-party extensions
4. **Scripting**: Embedded scripting support
5. **Network**: Networked desktop features
6. **3D**: 3D desktop support (Compiz-style)
7. **VR/AR**: Virtual/augmented reality interfaces
8. **AI**: AI assistant integration

---

## Conclusion

This schema provides a comprehensive, flexible foundation for representing operating systems across four decades of computing history. Its design prioritizes:

- Historical accuracy for retro OS representation
- Modern extensibility for new OS types
- Implementation flexibility across rendering engines
- Maintainability through clear structure
- Documentation through extensive typing

The schema handles edge cases gracefully and provides clear extension points for future growth.
