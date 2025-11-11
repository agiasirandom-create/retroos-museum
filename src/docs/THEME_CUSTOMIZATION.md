# Theme Customization Guide

## Table of Contents
1. [Theme System Overview](#theme-system-overview)
2. [Creating Custom Themes](#creating-custom-themes)
3. [Example Themes](#example-themes)
4. [Theme Gallery](#theme-gallery)
5. [Advanced Customization](#advanced-customization)

---

## Theme System Overview

### How Themes Work

The RetroOS component library uses a theme system based on:

1. **Configuration Objects**: Define colors, styles, and options
2. **CSS-in-JS**: Styles are generated and injected dynamically
3. **Runtime Updates**: Themes can be changed without page reload
4. **Component-Specific**: Each component has its own theme structure

**Theme Application Flow:**
```
Constructor Options
    ↓
Initial Theme Set
    ↓
_injectStyles() Creates CSS
    ↓
Styles Applied to DOM
    ↓
setTheme() Updates → Re-inject Styles
```

---

### CSS Variables

Components use JavaScript template literals to inject CSS with theme colors:

```javascript
style.textContent = `
  .window {
    background: ${this.theme.colors.background};
    border: 2px solid ${this.theme.colors.border};
  }

  .titlebar {
    background: ${this.theme.colors.titleBarActive};
    color: ${this.theme.colors.titleBarTextActive};
  }
`;
```

**Why Not CSS Custom Properties?**
- More flexible (can compute values)
- Works with older browsers
- Complete control over generation

---

### Color Schemes

**Standard Theme Properties:**

| Property | Description | Example |
|----------|-------------|---------|
| `titleBarActive` | Active window title bar | `#000080` |
| `titleBarInactive` | Inactive window title bar | `#808080` |
| `titleBarTextActive` | Active title text | `#ffffff` |
| `titleBarTextInactive` | Inactive title text | `#c0c0c0` |
| `background` | Window/panel background | `#c0c0c0` |
| `border` | Border color | `#000000` |
| `borderHighlight` | 3D highlight | `#ffffff` |
| `borderShadow` | 3D shadow | `#808080` |
| `borderDarkShadow` | 3D dark shadow | `#000000` |

---

### Typography

Fonts are defined in component CSS:

```javascript
font-family: 'Tahoma', 'MS Sans Serif', Arial, sans-serif;  // Windows
font-family: 'Chicago', 'Charcoal', 'Geneva', sans-serif;   // Mac Classic
font-family: -apple-system, 'SF Pro Display', sans-serif;   // Mac Modern
font-family: 'Ubuntu', 'Cantarell', sans-serif;             // GNOME
font-family: 'Oxygen', 'Noto Sans', sans-serif;             // KDE
```

**Custom Fonts:**
```javascript
// Load custom font
const font = new FontFace('MS Sans Serif', 'url(/fonts/mssans.woff2)');
font.load().then(() => {
  document.fonts.add(font);
});
```

---

## Creating Custom Themes

### Step 1: Define Theme Object

Create a theme configuration object:

```javascript
const customTheme = {
  // Style variant
  style: 'win95',

  // Visual options
  titleBarGradient: true,
  borderWidth: 3,

  // Color scheme
  colors: {
    titleBarActive: '#cc0000',
    titleBarInactive: '#999999',
    titleBarTextActive: '#ffffff',
    titleBarTextInactive: '#e0e0e0',
    border: '#800000',
    borderHighlight: '#ff6666',
    borderShadow: '#660000',
    borderDarkShadow: '#330000',
    background: '#d4d0c8'
  }
};
```

---

### Step 2: Apply to Component

Apply theme during initialization or runtime:

```javascript
// During initialization
const windowSystem = new ClassicWindowsSystem(customTheme);

// After initialization
windowSystem.setTheme(customTheme);
```

---

### Step 3: Test and Refine

Create test windows to preview theme:

```javascript
function previewTheme(theme) {
  const system = new ClassicWindowsSystem(theme);

  const window = system.createWindow({
    id: 'preview',
    title: 'Theme Preview',
    width: 400,
    height: 300,
    menuItems: [
      { label: 'File', onClick: () => {} },
      { label: 'Edit', onClick: () => {} }
    ],
    content: `
      <div style="padding: 20px;">
        <h2>Theme Preview</h2>
        <p>This is how your theme looks.</p>
      </div>
    `,
    statusBar: 'Ready'
  });

  document.body.appendChild(window);
}

previewTheme(customTheme);
```

---

### Required Properties

**Minimum theme requirements:**

```javascript
{
  colors: {
    titleBarActive: string,      // Required
    titleBarInactive: string,    // Required
    background: string           // Required
  }
}
```

All other properties have defaults.

---

### Optional Properties

**Extended customization:**

```javascript
{
  // Windows-specific
  titleBarGradient: boolean,
  borderWidth: number,
  useAeroGlass: boolean,          // Modern Windows
  useRoundedCorners: boolean,     // Win 11 / Mac

  // Mac-specific
  usePinstripes: boolean,
  buttonPosition: 'left' | 'right',
  accentColor: string,

  // UNIX-specific
  focusMode: 'click' | 'follow-mouse',

  // All color properties
  colors: {
    titleBarActive: string,
    titleBarInactive: string,
    titleBarTextActive: string,
    titleBarTextInactive: string,
    border: string,
    borderHighlight: string,
    borderShadow: string,
    borderDarkShadow: string,
    background: string
  }
}
```

---

## Example Themes

### Windows 95 (Default)

```javascript
const win95Theme = {
  style: 'win95',
  titleBarGradient: false,
  borderWidth: 3,
  colors: {
    titleBarActive: '#000080',
    titleBarInactive: '#808080',
    titleBarTextActive: '#ffffff',
    titleBarTextInactive: '#c0c0c0',
    border: '#c0c0c0',
    borderHighlight: '#ffffff',
    borderShadow: '#808080',
    borderDarkShadow: '#000000',
    background: '#c0c0c0'
  }
};
```

**Visual Description:**
- Classic navy blue title bars
- 3D raised borders (thick)
- Gray window backgrounds
- No gradients

---

### Windows XP Luna

```javascript
const winXPLunaTheme = {
  style: 'winxp',
  titleBarGradient: true,
  borderWidth: 2,
  colors: {
    titleBarActive: '#0054E3',     // Blue gradient start
    titleBarTextActive: '#ffffff',
    titleBarInactive: '#7A96DF',
    titleBarTextInactive: '#ffffff',
    border: '#0054E3',
    borderHighlight: '#84B2FF',
    borderShadow: '#003C74',
    borderDarkShadow: '#001F3F',
    background: '#ECE9D8'           // Tan/beige
  }
};
```

**Visual Description:**
- Bright blue gradient title bars
- Rounded window corners
- Tan/beige window backgrounds
- Fisher-Price aesthetic

---

### macOS Aqua

```javascript
const aquaTheme = {
  style: 'aqua',
  accentColor: 'blue',
  useBlur: true,
  transparency: 0.95,
  buttonPosition: 'left',
  colors: {
    titleBarActive: 'rgba(236, 236, 236, 0.95)',
    titleBarInactive: 'rgba(246, 246, 246, 0.90)',
    titleBarText: 'rgba(0, 0, 0, 0.85)',
    background: 'rgba(255, 255, 255, 0.95)',
    border: 'rgba(0, 0, 0, 0.15)'
  }
};
```

**Visual Description:**
- Translucent backgrounds
- Blur effects
- Traffic light buttons
- Clean, minimal design

---

### Ubuntu Human Theme

```javascript
const ubuntuHumanTheme = {
  style: 'gnome2',
  showTopPanel: true,
  showBottomPanel: true,
  theme: 'dark',
  colors: {
    background: '#3c3b37',         // Brown-gray
    titleBarActive: '#df6e1e',     // Ubuntu orange
    titleBarInactive: '#665c54',
    border: 'rgba(0, 0, 0, 0.5)',
    text: '#ffffff'
  }
};
```

**Visual Description:**
- Ubuntu orange accents
- Dark brown-gray panels
- Warm color palette
- Human/earthy tones

---

### Custom Dark Theme

```javascript
const darkTheme = {
  style: 'win10',
  accentColor: '#0078d4',
  useRoundedCorners: false,
  transparency: 1.0,
  colors: {
    titleBarActive: '#1f1f1f',
    titleBarInactive: '#2d2d2d',
    titleBarTextActive: '#ffffff',
    titleBarTextInactive: '#888888',
    border: '#000000',
    borderHighlight: '#404040',
    borderShadow: '#000000',
    background: '#252525'
  }
};
```

**Visual Description:**
- Dark gray/black color scheme
- High contrast
- Modern flat design
- Blue accent color

---

## Theme Gallery

### Classic Themes

**1. Windows 3.1**
```javascript
{
  style: 'win95',
  borderWidth: 2,
  colors: {
    titleBarActive: '#000080',
    titleBarTextActive: '#ffffff',
    background: '#c0c0c0'
  }
}
```
*Solid blue title bars, monochrome icons, simple borders*

---

**2. Mac OS System 7**
```javascript
{
  style: 'classic',
  usePinstripes: false,
  useRoundedCorners: true,
  colors: {
    titleBarActive: '#ffffff',
    titleBarInactive: '#ffffff',
    titleBarText: '#000000',
    border: '#000000',
    background: '#ffffff'
  }
}
```
*Black and white, no color, rounded windows*

---

**3. BeOS**
```javascript
{
  style: 'x11',
  colors: {
    background: '#e0e0e0',
    titleBarActive: '#ffbb00',    // BeOS yellow
    titleBarInactive: '#d4d0c8',
    border: '#888888',
    text: '#000000'
  }
}
```
*Distinctive yellow title bars, light gray UI*

---

### Modern Themes

**1. Windows 11**
```javascript
{
  style: 'win11',
  accentColor: '#0078d4',
  useRoundedCorners: true,
  transparency: 0.9,
  colors: {
    background: 'rgba(243, 243, 243, 0.9)',
    titleBarActive: 'transparent',
    border: 'rgba(0, 0, 0, 0.08)'
  }
}
```
*Rounded corners, mica material, centered taskbar*

---

**2. macOS Big Sur**
```javascript
{
  style: 'unified',
  accentColor: 'blue',
  useBlur: true,
  transparency: 0.85,
  colors: {
    background: 'rgba(246, 246, 246, 0.85)',
    titleBarActive: 'rgba(246, 246, 246, 0.85)',
    border: 'rgba(0, 0, 0, 0.1)'
  }
}
```
*Heavy blur, unified toolbar, translucent*

---

**3. KDE Breeze Dark**
```javascript
{
  mode: 'plasma',
  theme: 'breeze',
  colors: {
    background: 'rgba(49, 54, 59, 0.95)',
    color: '#eff0f1',
    titleBarActive: '#31363b',
    titleBarInactive: '#3e4349'
  }
}
```
*Dark theme, subtle colors, modern flat design*

---

### Retro-Future Themes

**1. Cyberpunk**
```javascript
{
  style: 'win95',
  titleBarGradient: true,
  colors: {
    titleBarActive: '#ff00ff',     // Magenta
    titleBarInactive: '#660066',
    titleBarTextActive: '#00ffff', // Cyan
    border: '#ff00ff',
    borderHighlight: '#ff66ff',
    borderShadow: '#990099',
    background: '#1a001a'          // Dark purple
  }
}
```
*Neon colors, high contrast, sci-fi aesthetic*

---

**2. Vaporwave**
```javascript
{
  style: 'winxp',
  titleBarGradient: true,
  colors: {
    titleBarActive: '#ff71ce',     // Hot pink
    titleBarInactive: '#b967ff',   // Purple
    titleBarTextActive: '#01cdfe', // Cyan
    border: '#05ffa1',             // Green
    borderHighlight: '#b967ff',
    borderShadow: '#ff71ce',
    background: '#fffb96'          // Pale yellow
  }
}
```
*Pastel colors, nostalgic 80s/90s aesthetic*

---

**3. Matrix**
```javascript
{
  style: 'x11',
  colors: {
    titleBarActive: '#003300',
    titleBarInactive: '#001a00',
    titleBarTextActive: '#00ff00',
    titleBarTextInactive: '#008800',
    border: '#00ff00',
    borderHighlight: '#00ff00',
    borderShadow: '#004400',
    background: '#000000'
  }
}
```
*Black and green terminal colors*

---

## Advanced Customization

### Dynamic Theme Switching

Create a theme switcher:

```javascript
const themes = {
  win95: win95Theme,
  winxp: winXPLunaTheme,
  aqua: aquaTheme,
  dark: darkTheme
};

function switchTheme(themeName) {
  const theme = themes[themeName];

  if (!theme) {
    console.error('Theme not found:', themeName);
    return;
  }

  windowSystem.setTheme(theme);
  console.log('Theme switched to:', themeName);
}

// Create theme selector UI
function createThemeSelector() {
  const selector = document.createElement('select');
  selector.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 99999;
    padding: 8px;
    font-size: 14px;
  `;

  Object.keys(themes).forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name.toUpperCase();
    selector.appendChild(option);
  });

  selector.addEventListener('change', (e) => {
    switchTheme(e.target.value);
  });

  document.body.appendChild(selector);
}

createThemeSelector();
```

---

### Time-Based Themes

Automatically switch theme based on time of day:

```javascript
function getTimeBasedTheme() {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 18) {
    // Daytime: light theme
    return lightTheme;
  } else {
    // Nighttime: dark theme
    return darkTheme;
  }
}

// Apply time-based theme
const currentTheme = getTimeBasedTheme();
windowSystem.setTheme(currentTheme);

// Update theme every hour
setInterval(() => {
  const newTheme = getTimeBasedTheme();
  windowSystem.setTheme(newTheme);
}, 3600000); // 1 hour
```

---

### User Preference Storage

Save user's theme choice:

```javascript
// Save theme to localStorage
function saveTheme(themeName) {
  localStorage.setItem('userTheme', themeName);
}

// Load theme from localStorage
function loadSavedTheme() {
  const savedTheme = localStorage.getItem('userTheme');

  if (savedTheme && themes[savedTheme]) {
    switchTheme(savedTheme);
  }
}

// Apply on page load
loadSavedTheme();

// Save when changed
function switchTheme(themeName) {
  const theme = themes[themeName];
  windowSystem.setTheme(theme);
  saveTheme(themeName);
}
```

---

### Per-Window Themes

Apply different themes to individual windows:

```javascript
function createThemedWindow(config, theme) {
  // Create temporary system with theme
  const tempSystem = new ClassicWindowsSystem(theme);

  // Create window
  const window = tempSystem.createWindow(config);

  // Use window but not the temp system
  return window;
}

// Create windows with different themes
const blueWindow = createThemedWindow({
  id: 'blue',
  title: 'Blue Window'
}, win95Theme);

const redWindow = createThemedWindow({
  id: 'red',
  title: 'Red Window'
}, customRedTheme);
```

**Note**: This creates style conflicts. Better approach is to use CSS classes.

---

### CSS Class-Based Theming

More efficient approach for multiple themes:

```javascript
// Inject multiple theme stylesheets
function injectThemeStylesheets() {
  const themes = {
    blue: { titleBarActive: '#000080', ... },
    red: { titleBarActive: '#cc0000', ... },
    green: { titleBarActive: '#008000', ... }
  };

  Object.entries(themes).forEach(([name, colors]) => {
    const style = document.createElement('style');
    style.id = `theme-${name}`;
    style.textContent = `
      .window.theme-${name} .titlebar {
        background: ${colors.titleBarActive};
      }
      /* ... more styles */
    `;
    document.head.appendChild(style);
  });
}

// Apply theme class to window
window.classList.add('theme-blue');
```

---

### Gradient Generators

Create gradient title bars:

```javascript
function generateGradient(color1, color2, angle = 90) {
  return `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
}

const gradientTheme = {
  style: 'winxp',
  titleBarGradient: true,
  colors: {
    titleBarActive: generateGradient('#0054E3', '#1084D0', 90),
    titleBarInactive: generateGradient('#7A96DF', '#A0B0E0', 90),
    // ... other colors
  }
};
```

---

### Animation Effects

Add theme transition animations:

```javascript
function switchThemeWithAnimation(newTheme) {
  // Fade out
  windowSystem.getAllWindows().forEach(win => {
    win.element.style.transition = 'opacity 0.3s';
    win.element.style.opacity = '0';
  });

  // Switch theme
  setTimeout(() => {
    windowSystem.setTheme(newTheme);

    // Fade in
    windowSystem.getAllWindows().forEach(win => {
      win.element.style.opacity = '1';
    });
  }, 300);
}
```

---

## Best Practices

### 1. Test with Different Content

Preview theme with various window types:

```javascript
// Test window
createWindow({ title: 'Active Window', ... });

// Inactive window
createWindow({ title: 'Inactive Window', ... });

// Window with menu
createWindow({ title: 'With Menu', menuItems: [...], ... });

// Window with status bar
createWindow({ title: 'With Status', statusBar: 'Ready', ... });
```

---

### 2. Maintain Contrast Ratios

Ensure text is readable:

```javascript
// Good contrast
colors: {
  titleBarActive: '#000080',      // Dark blue
  titleBarTextActive: '#ffffff'   // White (high contrast)
}

// Poor contrast
colors: {
  titleBarActive: '#cccccc',      // Light gray
  titleBarTextActive: '#ffffff'   // White (low contrast)
}
```

Use online contrast checkers: https://webaim.org/resources/contrastchecker/

---

### 3. Preserve UI Affordances

Keep 3D effects recognizable:

```javascript
// Good: Clear 3D borders
colors: {
  borderHighlight: '#ffffff',     // White
  borderShadow: '#808080',        // Medium gray
  borderDarkShadow: '#000000'     // Black
}

// Poor: Flat appearance
colors: {
  borderHighlight: '#c0c0c0',     // All same
  borderShadow: '#c0c0c0',
  borderDarkShadow: '#c0c0c0'
}
```

---

### 4. Document Your Themes

Create theme documentation:

```javascript
/**
 * Custom Windows 98 Dark Theme
 *
 * Description: Dark variant of classic Win98 with blue accents
 * Inspiration: Windows 98 + modern dark themes
 * Best for: Nighttime use, reduced eye strain
 *
 * Colors:
 * - Title Bar: Dark gray (#1f1f1f)
 * - Accent: Blue (#0078d4)
 * - Background: Medium gray (#2a2a2a)
 *
 * @author Your Name
 * @version 1.0
 */
const win98DarkTheme = {
  // ...theme config
};
```

---

## Summary

The RetroOS theme system provides extensive customization:

**Features:**
- Dynamic theme switching
- CSS-in-JS styling
- Per-component themes
- Runtime updates

**Capabilities:**
- Create authentic retro themes
- Design modern variants
- Build creative hybrids
- Apply user preferences

**Resources:**
- Example themes included
- Theme gallery for inspiration
- Advanced techniques documented
- Best practices provided

**Next Steps:**
- Experiment with color combinations
- Create theme collections
- Build theme switcher UI
- Share themes with community

---

**Document Version**: 1.0
**Last Updated**: 2025-11-11
**Word Count**: ~1,100 words
