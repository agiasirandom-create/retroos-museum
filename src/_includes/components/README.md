# RetroOS Museum Component Library

A comprehensive, reusable UI component library for building retro operating system interfaces. Supports Windows 95/98, Mac OS Classic (System 7-9), and Unix/Linux X11 (Motif/CDE) styles.

## Components

### 1. Window Component (`window.njk`)

Reusable window component with OS-specific styling.

**Parameters:**
- `title` - Window title text (required)
- `icon` - Icon path/emoji for title bar (optional)
- `content` - Window content (for simple windows)
- `width` - Window width in pixels (default: 400)
- `height` - Window height in pixels (default: 300)
- `x` - X position in pixels (default: 100)
- `y` - Y position in pixels (default: 100)
- `osStyle` - OS style: 'win95', 'macos', 'unix' (default: 'win95')
- `active` - Whether window is active/focused (default: true)
- `showMinimize` - Show minimize button (default: true)
- `showMaximize` - Show maximize button (default: true)
- `showClose` - Show close button (default: true)
- `id` - Window ID for JavaScript targeting (optional)

**Usage:**

```njk
{% import "_includes/components/window.njk" as windowComponent %}

{# Simple window #}
{{ windowComponent.simpleWindow(
  title="About",
  content="<p>This is about text</p>",
  osStyle="win95"
) }}

{# Complex window with call block #}
{% call windowComponent.window(
  title="My Application",
  icon="/assets/icons/app.png",
  width=500,
  height=400,
  osStyle="macos"
) %}
  <h1>Custom Content</h1>
  <p>Any HTML content here</p>
  {{ buttonComponent.button(text="OK") }}
{% endcall %}
```

**Features:**
- Windows 95: 3D beveled borders, blue gradient title bar, three-button controls
- Mac OS: Striped title bar, close box (left), zoom box (right)
- Unix/Linux: Motif-style 3D borders, gradient title bars

---

### 2. Button Component (`button.njk`)

Button component with OS-specific styles and states.

**Parameters:**
- `text` - Button label text (required)
- `type` - Button type: 'button', 'submit', 'reset' (default: 'button')
- `osStyle` - OS style: 'win95', 'macos', 'unix' (default: 'win95')
- `disabled` - Whether button is disabled (default: false)
- `default` - Whether button is default/primary (default: false)
- `id` - Button ID (optional)
- `class` - Additional CSS classes (optional)
- `ariaLabel` - Accessible label (optional)
- `onClick` - JavaScript click handler (optional)

**Usage:**

```njk
{% import "_includes/components/button.njk" as buttonComponent %}

{# Single button #}
{{ buttonComponent.button(text="OK", osStyle="win95", default=true) }}

{# Icon button #}
{{ buttonComponent.iconButton(icon="📁", text="Open", osStyle="win95") }}

{# Button group #}
{{ buttonComponent.buttonGroup(
  buttons=[
    {text: "Yes", default: true},
    {text: "No"},
    {text: "Cancel"}
  ],
  osStyle="win95"
) }}
```

**States:**
- Normal, hover, active, disabled
- Default/primary button style
- Focus-visible outline for accessibility

---

### 3. Menu Component (`menu.njk`)

Menu system with menu bars, dropdowns, and context menus.

**Parameters:**
- `items` - Array of menu item objects (required)
  - `text` - Menu item text
  - `shortcut` - Keyboard shortcut text
  - `disabled` - Boolean
  - `checked` - Boolean (shows checkmark)
  - `separator` - Boolean (renders separator)
  - `onClick` - JavaScript handler
- `osStyle` - OS style: 'win95', 'macos', 'unix' (default: 'win95')
- `vertical` - Vertical dropdown menu (default: true)
- `id` - Menu ID (optional)

**Usage:**

```njk
{% import "_includes/components/menu.njk" as menuComponent %}

{# Dropdown menu #}
{{ menuComponent.menu(
  items=[
    {text: "New", shortcut: "Ctrl+N"},
    {text: "Open", shortcut: "Ctrl+O"},
    {separator: true},
    {text: "Exit"}
  ],
  osStyle="win95"
) }}

{# Menu bar #}
{{ menuComponent.menuBar(
  menus=[
    {
      text: "File",
      items: [
        {text: "New", shortcut: "Ctrl+N"},
        {text: "Exit"}
      ]
    },
    {
      text: "Edit",
      items: [
        {text: "Cut", shortcut: "Ctrl+X"},
        {text: "Copy", shortcut: "Ctrl+C"}
      ]
    }
  ],
  osStyle="win95"
) }}

{# Context menu #}
{{ menuComponent.contextMenu(
  items=[
    {text: "Cut"},
    {text: "Copy"},
    {text: "Paste"}
  ],
  osStyle="win95",
  id="context-menu"
) }}
```

---

### 4. Icon Component (`icon.njk`)

Desktop and file icons with selection states.

**Parameters:**
- `image` - Icon image path or emoji (required)
- `label` - Icon label text (required)
- `size` - Icon size: 'small' (16px), 'medium' (32px), 'large' (48px) (default: 'medium')
- `osStyle` - OS style: 'win95', 'macos', 'unix' (default: 'win95')
- `selected` - Whether icon is selected (default: false)
- `id` - Icon ID (optional)
- `onClick` - JavaScript click handler (optional)
- `onDblClick` - JavaScript double-click handler (optional)

**Usage:**

```njk
{% import "_includes/components/icon.njk" as iconComponent %}

{# Single icon #}
{{ iconComponent.icon(
  image="📁",
  label="My Documents",
  osStyle="win95"
) }}

{# Icon grid (desktop layout) #}
{{ iconComponent.iconGrid(
  icons=[
    {image: "💾", label: "Save File"},
    {image: "📁", label: "Documents", selected: true},
    {image: "🗑️", label: "Recycle Bin"}
  ],
  osStyle="win95",
  columns=3
) }}

{# List view icon #}
{{ iconComponent.listIcon(
  image="📄",
  label="document.txt",
  details="2 KB - Modified 11/10/2025",
  osStyle="win95"
) }}
```

---

### 5. Scrollbar Component (`scrollbar.njk`)

Custom scrollbars with OS-specific styling.

**Parameters:**
- `orientation` - 'vertical' or 'horizontal' (default: 'vertical')
- `osStyle` - OS style: 'win95', 'macos', 'unix' (default: 'win95')
- `size` - Scrollbar thickness in pixels (default: 16)
- `thumbSize` - Thumb size in pixels (default: 50)
- `thumbPosition` - Thumb position in pixels (default: 0)
- `id` - Scrollbar ID (optional)

**Usage:**

```njk
{% import "_includes/components/scrollbar.njk" as scrollbarComponent %}

{# Vertical scrollbar #}
{{ scrollbarComponent.scrollbar(
  orientation="vertical",
  osStyle="win95"
) }}

{# Horizontal scrollbar #}
{{ scrollbarComponent.scrollbar(
  orientation="horizontal",
  osStyle="macos"
) }}

{# Scrollable container with custom scrollbars #}
{% call scrollbarComponent.scrollableContainer(
  width=400,
  height=300,
  osStyle="win95",
  showVertical=true,
  showHorizontal=false
) %}
  <p>Scrollable content goes here...</p>
{% endcall %}
```

---

## CSS Architecture

### Base Styles (`components/base.css`)

Shared utilities and base component structures:
- CSS variables for spacing, borders, shadows, z-index
- Base component classes (.retro-component, .retro-window, etc.)
- Common utility classes
- Accessibility features

### OS-Specific Styles

#### Windows 95/98 (`components/windows.css`)
- 3D beveled borders (outset/inset)
- Gray color scheme (#c0c0c0)
- Blue gradient title bars
- MS Sans Serif typography
- Dotted pattern scrollbar tracks

#### Mac OS Classic (`components/macos.css`)
- Flat design with simple borders
- Black and white high contrast
- Striped title bar pattern
- Chicago and Geneva fonts
- Rounded buttons (8px border-radius)

#### Unix/Linux X11 (`components/unix.css`)
- Motif/CDE inspired styling
- Medium gray color scheme (#b8b8b8)
- Gradient title bars
- Helvetica typography
- 3D effect borders

### CSS Variables

```css
/* Spacing */
--spacing-xs: 2px
--spacing-sm: 4px
--spacing-md: 8px
--spacing-lg: 16px
--spacing-xl: 24px

/* Z-index layers */
--z-base: 1
--z-window: 100
--z-menu: 200
--z-modal: 300
--z-tooltip: 400
```

### Windows 95 Specific

```css
--win-gray: #c0c0c0
--win-blue: #000080
--win-white: #ffffff
--win-black: #000000
```

### Mac OS Specific

```css
--mac-white: #ffffff
--mac-black: #000000
--mac-gray: #dddddd
```

### Unix/Linux Specific

```css
--unix-bg: #b8b8b8
--unix-highlight: #4a90d9
--unix-dark: #686868
```

---

## Accessibility Features

All components include:
- Proper ARIA roles and labels
- Keyboard navigation support
- Focus-visible indicators
- Screen reader friendly markup
- Semantic HTML structure
- Sufficient color contrast

**Keyboard Support:**
- Tab/Shift+Tab: Navigate between interactive elements
- Enter/Space: Activate buttons and menu items
- Arrow keys: Navigate menus (when implemented with JS)
- Escape: Close menus and dialogs (when implemented with JS)

---

## Browser Support

Components are designed to work in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Uses standard CSS features:
- Flexbox for layouts
- CSS Grid for icon grids
- CSS custom properties (variables)
- Linear gradients
- Box shadows

---

## Performance Considerations

- Components use CSS-only styling (no JavaScript required for appearance)
- Minimal DOM nesting for faster rendering
- CSS custom properties for theme switching without recalculation
- No external dependencies
- Optimized for sub-3s load times

---

## Customization

### Changing Colors

Override CSS variables in your stylesheet:

```css
:root {
  --win-blue: #0066cc; /* Custom blue */
  --win-gray: #d0d0d0; /* Lighter gray */
}
```

### Adding New OS Styles

1. Create new CSS file: `/src/assets/css/components/youros.css`
2. Define color variables
3. Create style classes: `.retro-window--youros`, etc.
4. Import in `main.css`
5. Use `osStyle="youros"` in components

---

## Examples

### Complete Dialog Window

```njk
{% call windowComponent.window(
  title="Save Changes?",
  width=380,
  height=180,
  osStyle="win95",
  showMinimize=false,
  showMaximize=false
) %}
  <p style="margin-bottom: 20px;">
    Do you want to save changes to "Document.txt"?
  </p>

  {{ buttonComponent.buttonGroup(
    buttons=[
      {text: "Yes", default: true, onClick: "save()"},
      {text: "No", onClick: "discard()"},
      {text: "Cancel", onClick: "cancel()"}
    ],
    osStyle="win95",
    align="right"
  ) }}
{% endcall %}
```

### File Explorer

```njk
{% call windowComponent.window(
  title="My Documents",
  icon="📁",
  width=600,
  height=400,
  osStyle="win95"
) %}
  {# Menu bar #}
  {{ menuComponent.menuBar(
    menus=[
      {text: "File", items: [...]},
      {text: "Edit", items: [...]},
      {text: "View", items: [...]}
    ],
    osStyle="win95"
  ) }}

  {# File list #}
  <div style="border: 2px inset #808080; background: white; padding: 8px; height: 100%;">
    {{ iconComponent.listIcon(image="📁", label="Documents", details="File Folder") }}
    {{ iconComponent.listIcon(image="📄", label="readme.txt", details="1 KB", selected=true) }}
  </div>
{% endcall %}
```

---

## Testing

View all components in action at:
`/components-demo.njk`

The demo page includes:
- All component variations
- All three OS styles
- Interactive examples
- Usage documentation
- Accessibility testing

---

## Future Enhancements

Planned features:
- JavaScript modules for interactivity (drag, resize, etc.)
- Additional OS styles (BeOS, OS/2, Amiga)
- Form components (inputs, checkboxes, radio buttons)
- Dialog/modal components
- Progress bars and status indicators
- Tabs and panels
- Toolbars and status bars

---

## License

Part of the RetroOS Museum project.
