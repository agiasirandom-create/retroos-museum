/**
 * OS Configuration Validator
 * Validates OS JSON configs and provides defaults
 */

class ConfigValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Validate OS configuration
   * @param {Object} config - OS configuration object
   * @returns {Object} - Validated and normalized config
   */
  validate(config) {
    this.errors = [];
    this.warnings = [];

    if (!config) {
      this.errors.push('Configuration is null or undefined');
      return null;
    }

    // Check required top-level fields
    this.checkRequired(config, 'schema_version', 'string');
    this.checkRequired(config, 'os_id', 'string');
    this.checkRequired(config, 'metadata', 'object');
    this.checkRequired(config, 'visual', 'object');
    this.checkRequired(config, 'paradigm', 'object');

    // Validate metadata
    if (config.metadata) {
      this.checkRequired(config.metadata, 'name', 'string');
      this.checkRequired(config.metadata, 'version', 'string');
      this.checkRequired(config.metadata, 'company', 'string');
      this.checkRequired(config.metadata, 'releaseYear', 'number');
      this.checkRequired(config.metadata, 'description', 'string');
      this.checkRequired(config.metadata, 'category', 'string');
    }

    // Validate visual settings
    if (config.visual) {
      this.validateVisual(config.visual);
    }

    // Validate paradigm
    if (config.paradigm) {
      this.validateParadigm(config.paradigm);
    }

    // Apply defaults
    const normalized = this.applyDefaults(config);

    return {
      config: normalized,
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  /**
   * Check if required field exists and has correct type
   */
  checkRequired(obj, field, type) {
    if (!(field in obj)) {
      this.errors.push(`Missing required field: ${field}`);
      return false;
    }

    const actualType = typeof obj[field];
    if (type === 'object' && obj[field] !== null && actualType === 'object') {
      return true;
    }

    if (actualType !== type) {
      this.errors.push(`Field ${field} should be ${type}, got ${actualType}`);
      return false;
    }

    return true;
  }

  /**
   * Validate visual configuration
   */
  validateVisual(visual) {
    if (!visual.theme) {
      this.errors.push('visual.theme is required');
      return;
    }

    const theme = visual.theme;

    // Check colors
    if (!theme.colors) {
      this.errors.push('theme.colors is required');
    } else {
      const requiredColors = [
        'desktop', 'windowBackground', 'titleBarActive',
        'buttonFace', 'text', 'menuBackground'
      ];

      requiredColors.forEach(color => {
        if (!theme.colors[color]) {
          this.warnings.push(`Missing recommended color: ${color}`);
        }
      });
    }

    // Check typography
    if (!theme.typography) {
      this.warnings.push('theme.typography is recommended');
    }

    // Check style
    if (!theme.style) {
      this.warnings.push('theme.style is recommended');
    }
  }

  /**
   * Validate paradigm configuration
   */
  validateParadigm(paradigm) {
    if (!paradigm.windowSystem) {
      this.errors.push('paradigm.windowSystem is required');
    }

    if (!paradigm.menuSystem) {
      this.warnings.push('paradigm.menuSystem is recommended');
    }

    if (!paradigm.desktop) {
      this.warnings.push('paradigm.desktop is recommended');
    }
  }

  /**
   * Apply default values to configuration
   */
  applyDefaults(config) {
    const defaults = {
      visual: {
        theme: {
          colors: {
            desktop: '#008080',
            windowBackground: '#C0C0C0',
            windowBorder: '#000000',
            windowBorderWidth: 1,
            titleBarActive: '#000080',
            titleBarInactive: '#808080',
            titleBarText: '#FFFFFF',
            titleBarTextInactive: '#C0C0C0',
            buttonFace: '#C0C0C0',
            buttonText: '#000000',
            buttonHighlight: '#FFFFFF',
            buttonShadow: '#808080',
            highlight: '#000080',
            highlightText: '#FFFFFF',
            menuBackground: '#C0C0C0',
            menuText: '#000000',
            text: '#000000'
          },
          typography: {
            systemFont: {
              family: 'sans-serif',
              size: 12,
              weight: 'normal'
            },
            antialiasing: false
          },
          style: {
            type: 'classic',
            borderStyle: 'single',
            cornerRadius: 0,
            shadows: false,
            transparency: false,
            bevels: false,
            gradients: false
          }
        },
        cursor: {
          style: 'classic_arrow',
          animated: false
        },
        icons: {
          style: 'icon_32',
          size: {
            default: 32,
            sizes: [32]
          }
        },
        wallpaper: {
          type: 'solid',
          value: '#008080'
        }
      },
      paradigm: {
        windowSystem: {
          type: 'stacking',
          behavior: {
            overlap: true,
            resize: true,
            minimize: true,
            maximize: true,
            close: true
          },
          chrome: {
            titleBar: 'classic',
            controls: 'buttons',
            controlPosition: 'right'
          }
        },
        menuSystem: {
          type: 'window',
          behavior: {
            clickToOpen: true
          }
        },
        desktop: {
          type: 'iconic',
          layout: {
            type: 'grid',
            snapToGrid: true
          },
          interaction: {
            click: 'double',
            dragAndDrop: true
          }
        },
        inputMethods: {
          keyboard: {
            shortcuts: true
          },
          mouse: {
            buttons: 2
          }
        }
      },
      components: {
        applications: []
      },
      features: {
        interaction: {
          dragAndDrop: true,
          clipboard: true
        },
        animations: {
          enabled: false
        }
      }
    };

    return this.deepMerge(defaults, config);
  }

  /**
   * Deep merge two objects
   */
  deepMerge(target, source) {
    const result = { ...target };

    for (const key in source) {
      if (source[key] instanceof Object && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }

    return result;
  }

  /**
   * Get validation report
   */
  getReport() {
    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      summary: `${this.errors.length} errors, ${this.warnings.length} warnings`
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ConfigValidator;
}
