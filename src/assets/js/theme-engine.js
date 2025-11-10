/**
 * Theme Engine
 * Dynamically applies themes and styles from OS configurations
 */

class ThemeEngine {
  constructor() {
    this.currentTheme = null;
    this.styleElement = null;
    this.fontLoadPromises = [];
  }

  /**
   * Apply theme from OS configuration
   * @param {Object} config - OS configuration with visual settings
   */
  async applyTheme(config) {
    if (!config || !config.visual || !config.visual.theme) {
      console.error('Invalid theme configuration');
      return;
    }

    this.currentTheme = config.visual.theme;
    const osId = config.os_id;

    // Remove existing theme stylesheet
    if (this.styleElement) {
      this.styleElement.remove();
    }

    // Create new stylesheet
    this.styleElement = document.createElement('style');
    this.styleElement.id = 'os-theme-styles';
    this.styleElement.textContent = this.generateThemeCSS(config);
    document.head.appendChild(this.styleElement);

    // Load fonts if specified
    if (config.assets && config.assets.fonts) {
      await this.loadFonts(config.assets.fonts);
    }

    // Apply body classes
    this.applyBodyClasses(config);

    // Set wallpaper
    this.applyWallpaper(config.visual.wallpaper, config.visual.theme.colors);

    return true;
  }

  /**
   * Generate CSS from theme configuration
   */
  generateThemeCSS(config) {
    const theme = config.visual.theme;
    const colors = theme.colors;
    const typography = theme.typography;
    const style = theme.style;
    const osId = config.os_id;

    let css = `:root {\n`;

    // Color variables
    if (colors) {
      css += `  /* Colors */\n`;
      for (const [key, value] of Object.entries(colors)) {
        if (typeof value === 'string') {
          const varName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          css += `  --color-${varName}: ${value};\n`;
        } else if (typeof value === 'object' && key === 'custom') {
          for (const [customKey, customValue] of Object.entries(value)) {
            const varName = customKey.replace(/([A-Z])/g, '-$1').toLowerCase();
            css += `  --color-${varName}: ${customValue};\n`;
          }
        }
      }
    }

    // Typography variables
    if (typography) {
      css += `\n  /* Typography */\n`;
      if (typography.systemFont) {
        const font = typography.systemFont;
        css += `  --font-family: ${this.buildFontFamily(font)};\n`;
        css += `  --font-size: ${font.size || 12}px;\n`;
        css += `  --font-weight: ${font.weight || 'normal'};\n`;
      }
      if (typography.titleFont) {
        const font = typography.titleFont;
        css += `  --font-title-family: ${this.buildFontFamily(font)};\n`;
        css += `  --font-title-size: ${font.size || 12}px;\n`;
        css += `  --font-title-weight: ${font.weight || 'bold'};\n`;
      }
      if (typography.menuFont) {
        const font = typography.menuFont;
        css += `  --font-menu-family: ${this.buildFontFamily(font)};\n`;
        css += `  --font-menu-size: ${font.size || 12}px;\n`;
      }
      if (typography.monospaceFont) {
        const font = typography.monospaceFont;
        css += `  --font-mono-family: ${this.buildFontFamily(font)};\n`;
        css += `  --font-mono-size: ${font.size || 10}px;\n`;
      }
      css += `  --font-antialiasing: ${typography.antialiasing ? 'antialiased' : 'none'};\n`;
    }

    // Style variables
    if (style) {
      css += `\n  /* Style */\n`;
      css += `  --border-radius: ${style.cornerRadius || 0}px;\n`;
      css += `  --border-style: ${style.borderStyle || 'single'};\n`;
      css += `  --window-border-width: ${colors.windowBorderWidth || 1}px;\n`;
      css += `  --use-shadows: ${style.shadows ? '1' : '0'};\n`;
      css += `  --use-bevels: ${style.bevels ? '1' : '0'};\n`;
      css += `  --use-gradients: ${style.gradients ? '1' : '0'};\n`;
    }

    // Window system variables
    if (config.paradigm && config.paradigm.windowSystem) {
      const ws = config.paradigm.windowSystem;
      if (ws.chrome) {
        css += `\n  /* Window Chrome */\n`;
        css += `  --title-align: ${ws.chrome.titleAlign || 'left'};\n`;
        css += `  --control-position: ${ws.chrome.controlPosition || 'right'};\n`;
      }
    }

    // Menu bar variables
    if (config.paradigm && config.paradigm.menuSystem && config.paradigm.menuSystem.menuBar) {
      const mb = config.paradigm.menuSystem.menuBar;
      if (mb.style) {
        css += `\n  /* Menu Bar */\n`;
        css += `  --menubar-background: ${mb.style.background || colors.menuBackground};\n`;
        css += `  --menubar-text: ${mb.style.textColor || colors.menuText};\n`;
        css += `  --menubar-height: ${mb.style.height || 20}px;\n`;
      }
    }

    // Taskbar variables
    if (config.paradigm && config.paradigm.taskManagement && config.paradigm.taskManagement.taskbar) {
      const tb = config.paradigm.taskManagement.taskbar;
      css += `\n  /* Taskbar */\n`;
      css += `  --taskbar-height: ${tb.size || 28}px;\n`;
      css += `  --taskbar-position: ${tb.position || 'bottom'};\n`;
      if (tb.style) {
        css += `  --taskbar-background: ${tb.style.background || colors.taskbar || colors.buttonFace};\n`;
      }
    }

    css += `}\n\n`;

    // Body styles
    css += `body {\n`;
    css += `  font-family: var(--font-family);\n`;
    css += `  font-size: var(--font-size);\n`;
    css += `  color: var(--color-text);\n`;
    css += `  background-color: var(--color-desktop);\n`;
    if (typography && !typography.antialiasing) {
      css += `  -webkit-font-smoothing: none;\n`;
      css += `  -moz-osx-font-smoothing: grayscale;\n`;
    }
    css += `}\n\n`;

    // Add OS-specific styles
    css += this.generateOSSpecificCSS(config);

    return css;
  }

  /**
   * Generate OS-specific CSS rules
   */
  generateOSSpecificCSS(config) {
    const category = config.metadata.category;
    const theme = config.visual.theme;
    let css = '';

    // Windows-style beveled buttons
    if (theme.style && theme.style.bevels) {
      css += `.button, .window-button {\n`;
      css += `  border-top: 2px solid var(--color-button-highlight);\n`;
      css += `  border-left: 2px solid var(--color-button-highlight);\n`;
      css += `  border-right: 2px solid var(--color-button-shadow);\n`;
      css += `  border-bottom: 2px solid var(--color-button-shadow);\n`;
      css += `  background: var(--color-button-face);\n`;
      css += `}\n\n`;

      css += `.button:active, .window-button:active {\n`;
      css += `  border-top: 2px solid var(--color-button-shadow);\n`;
      css += `  border-left: 2px solid var(--color-button-shadow);\n`;
      css += `  border-right: 2px solid var(--color-button-highlight);\n`;
      css += `  border-bottom: 2px solid var(--color-button-highlight);\n`;
      css += `}\n\n`;
    }

    // Mac-style shadows
    if (theme.style && theme.style.shadows) {
      css += `.window {\n`;
      css += `  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3);\n`;
      css += `}\n\n`;
    }

    // Desktop icon styles
    if (config.paradigm && config.paradigm.desktop) {
      const desktop = config.paradigm.desktop;
      if (desktop.layout && desktop.layout.grid) {
        const grid = desktop.layout.grid;
        css += `.desktop-icon {\n`;
        css += `  width: ${grid.cellWidth}px;\n`;
        css += `  height: ${grid.cellHeight}px;\n`;
        css += `}\n\n`;
      }
    }

    return css;
  }

  /**
   * Build font-family CSS value
   */
  buildFontFamily(fontConfig) {
    let family = `'${fontConfig.family}'`;
    if (fontConfig.fallback && fontConfig.fallback.length > 0) {
      family += ', ' + fontConfig.fallback.map(f =>
        f.includes(' ') ? `'${f}'` : f
      ).join(', ');
    }
    return family;
  }

  /**
   * Load custom fonts
   */
  async loadFonts(fontsConfig) {
    this.fontLoadPromises = [];

    for (const [fontName, fontData] of Object.entries(fontsConfig)) {
      if (fontData.path) {
        const fontFace = new FontFace(
          fontName.replace(/_/g, ' '),
          `url(${fontData.path})`,
          {
            weight: fontData.weights ? fontData.weights.join(' ') : 'normal'
          }
        );

        this.fontLoadPromises.push(
          fontFace.load().then(loadedFace => {
            document.fonts.add(loadedFace);
            return loadedFace;
          }).catch(err => {
            console.warn(`Failed to load font ${fontName}:`, err);
          })
        );
      }
    }

    await Promise.all(this.fontLoadPromises);
  }

  /**
   * Apply body classes based on OS configuration
   */
  applyBodyClasses(config) {
    const body = document.body;

    // Remove old OS classes
    body.className = body.className
      .split(' ')
      .filter(c => !c.startsWith('os-') && !c.startsWith('category-'))
      .join(' ');

    // Add new classes
    body.classList.add(`os-${config.os_id}`);
    body.classList.add(`category-${config.metadata.category}`);

    if (config.visual.theme.style) {
      body.classList.add(`style-${config.visual.theme.style.type}`);
    }

    if (config.paradigm.windowSystem) {
      body.classList.add(`windows-${config.paradigm.windowSystem.type}`);
    }

    if (config.paradigm.menuSystem) {
      body.classList.add(`menu-${config.paradigm.menuSystem.type}`);
    }
  }

  /**
   * Apply wallpaper/desktop background
   */
  applyWallpaper(wallpaperConfig, colors) {
    if (!wallpaperConfig) return;

    const desktop = document.querySelector('.desktop') || document.body;

    switch (wallpaperConfig.type) {
      case 'solid':
        desktop.style.backgroundColor = wallpaperConfig.value || colors.desktop;
        desktop.style.backgroundImage = 'none';
        break;

      case 'pattern':
        desktop.style.backgroundColor = wallpaperConfig.value || colors.desktop;
        // Pattern implementation would go here
        if (wallpaperConfig.pattern) {
          const pattern = this.generatePattern(wallpaperConfig.pattern);
          desktop.style.backgroundImage = pattern;
        }
        break;

      case 'image':
        desktop.style.backgroundColor = colors.desktop;
        if (wallpaperConfig.url) {
          desktop.style.backgroundImage = `url(${wallpaperConfig.url})`;
          desktop.style.backgroundSize = wallpaperConfig.tiling === 'stretch' ? 'cover' : 'auto';
          desktop.style.backgroundRepeat = wallpaperConfig.tiling === 'tile' ? 'repeat' : 'no-repeat';
          desktop.style.backgroundPosition = 'center';
        }
        break;
    }
  }

  /**
   * Generate CSS pattern
   */
  generatePattern(patternName) {
    const patterns = {
      'dots': 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)',
      'grid': 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
      'stripes': 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)'
    };

    return patterns[patternName] || 'none';
  }

  /**
   * Get current theme
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * Switch theme dynamically
   */
  async switchTheme(newConfig) {
    return this.applyTheme(newConfig);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeEngine;
}
