/**
 * OS Generator
 * Main orchestrator for generating OS instances from JSON configuration
 */

class OSGenerator {
  constructor() {
    this.currentOS = null;
    this.validator = new ConfigValidator();
    this.themeEngine = new ThemeEngine();
    this.windowManager = null;
    this.desktopGenerator = null;
    this.appFactory = null;
    this.isInitialized = false;
  }

  /**
   * Initialize OS from configuration
   * @param {Object|string} config - Configuration object or URL to JSON
   * @returns {Promise<boolean>} - Success status
   */
  async initialize(config) {
    try {
      // Load config if URL provided
      if (typeof config === 'string') {
        config = await this.loadConfigFromURL(config);
      }

      // Validate configuration
      const validation = this.validator.validate(config);

      if (!validation.valid) {
        console.error('Configuration validation failed:', validation.errors);
        this.showError('Invalid OS configuration', validation.errors);
        return false;
      }

      if (validation.warnings.length > 0) {
        console.warn('Configuration warnings:', validation.warnings);
      }

      // Use validated/normalized config
      this.currentOS = validation.config;

      // Initialize subsystems
      await this.initializeSubsystems();

      // Apply theme
      await this.themeEngine.applyTheme(this.currentOS);

      // Generate desktop
      this.desktopGenerator.generateDesktop(this.currentOS);

      // Set up window manager for this OS paradigm
      this.configureWindowManager(this.currentOS);

      // Play startup sound if configured
      if (this.currentOS.visual.sounds && this.currentOS.visual.sounds.enabled) {
        this.playStartupSound(this.currentOS);
      }

      this.isInitialized = true;

      // Dispatch event for other systems to hook into
      document.dispatchEvent(new CustomEvent('os-initialized', {
        detail: { os: this.currentOS }
      }));

      return true;

    } catch (error) {
      console.error('Failed to initialize OS:', error);
      this.showError('Failed to initialize OS', [error.message]);
      return false;
    }
  }

  /**
   * Load configuration from URL
   */
  async loadConfigFromURL(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch configuration from ${url}: ${error.message}`);
    }
  }

  /**
   * Load configuration by OS ID
   */
  async loadConfigById(osId) {
    const configPath = `/assets/data/os/${osId}.json`;
    return this.loadConfigFromURL(configPath);
  }

  /**
   * Initialize subsystems
   */
  async initializeSubsystems() {
    // Initialize or get window manager
    if (!this.windowManager) {
      if (window.WindowManager) {
        this.windowManager = new WindowManager();
      } else {
        throw new Error('WindowManager not found. Make sure window-manager.js is loaded.');
      }
    }

    // Initialize desktop generator
    this.desktopGenerator = new DesktopGenerator(this.windowManager, this.themeEngine);

    // Initialize app factory
    this.appFactory = new AppFactory(this.windowManager, this.themeEngine);

    // Make app factory globally accessible for desktop generator
    window.appFactory = this.appFactory;
  }

  /**
   * Configure window manager based on OS paradigm
   */
  configureWindowManager(config) {
    if (!this.windowManager) return;

    const paradigm = config.paradigm;

    // Set window behavior defaults
    const windowDefaults = {
      resizable: paradigm.windowSystem.behavior.resize,
      minimizable: paradigm.windowSystem.behavior.minimize,
      maximizable: paradigm.windowSystem.behavior.maximize,
      closable: paradigm.windowSystem.behavior.close
    };

    // Apply to window manager if it supports configuration
    if (this.windowManager.setDefaults) {
      this.windowManager.setDefaults(windowDefaults);
    }

    // Configure window chrome style
    if (paradigm.windowSystem.chrome) {
      this.applyWindowChromeStyle(paradigm.windowSystem.chrome);
    }
  }

  /**
   * Apply window chrome styling
   */
  applyWindowChromeStyle(chromeConfig) {
    // This will be applied via CSS variables set by theme engine
    // Additional runtime configuration can be added here
  }

  /**
   * Play startup sound
   */
  playStartupSound(config) {
    if (config.visual.sounds && config.visual.sounds.sounds.startup) {
      const audio = new Audio(config.visual.sounds.sounds.startup);
      audio.volume = (config.visual.sounds.volume || 100) / 100;
      audio.play().catch(err => {
        console.warn('Failed to play startup sound:', err);
      });
    }
  }

  /**
   * Create application window
   */
  createApplicationWindow(appId) {
    if (!this.isInitialized) {
      console.error('OS not initialized');
      return null;
    }

    const app = this.findApplication(appId);
    if (!app) {
      console.error(`Application not found: ${appId}`);
      return null;
    }

    const content = this.appFactory.createApp(app, this.currentOS);

    return this.windowManager.createWindow({
      title: app.window.title,
      width: app.window.width,
      height: app.window.height,
      content: content,
      resizable: app.window.resizable,
      minimizable: app.window.minimizable !== false,
      maximizable: app.window.maximizable !== false,
      icon: app.icon
    });
  }

  /**
   * Find application by ID
   */
  findApplication(appId) {
    if (!this.currentOS || !this.currentOS.components) {
      return null;
    }

    const apps = this.currentOS.components.applications || [];
    return apps.find(app => app.id === appId);
  }

  /**
   * Get list of available applications
   */
  getApplications() {
    if (!this.currentOS || !this.currentOS.components) {
      return [];
    }

    return this.currentOS.components.applications || [];
  }

  /**
   * Get current OS metadata
   */
  getOSInfo() {
    if (!this.currentOS) {
      return null;
    }

    return {
      id: this.currentOS.os_id,
      name: this.currentOS.metadata.name,
      version: this.currentOS.metadata.version,
      company: this.currentOS.metadata.company,
      year: this.currentOS.metadata.releaseYear,
      description: this.currentOS.metadata.description,
      category: this.currentOS.metadata.category
    };
  }

  /**
   * Switch to different OS
   */
  async switchOS(config) {
    // Clean up current OS
    this.cleanup();

    // Initialize new OS
    return this.initialize(config);
  }

  /**
   * Clean up current OS instance
   */
  cleanup() {
    // Close all windows
    if (this.windowManager) {
      this.windowManager.closeAllWindows();
    }

    // Clear desktop
    if (this.desktopGenerator) {
      this.desktopGenerator.clearDesktop();
    }

    // Remove taskbar/dock
    const taskbar = document.querySelector('.taskbar');
    if (taskbar) taskbar.remove();

    const dock = document.querySelector('.dock');
    if (dock) dock.remove();

    const menuBar = document.querySelector('.global-menu-bar');
    if (menuBar) menuBar.remove();

    this.isInitialized = false;
  }

  /**
   * Show error message
   */
  showError(title, errors) {
    const errorBox = document.createElement('div');
    errorBox.className = 'error-dialog';
    errorBox.innerHTML = `
      <div class="error-dialog-content">
        <h2>❌ ${title}</h2>
        <ul>
          ${errors.map(err => `<li>${err}</li>`).join('')}
        </ul>
        <button onclick="this.closest('.error-dialog').remove()">OK</button>
      </div>
    `;
    document.body.appendChild(errorBox);
  }

  /**
   * Export current state (for debugging)
   */
  exportState() {
    return {
      os: this.currentOS,
      initialized: this.isInitialized,
      windows: this.windowManager ? this.windowManager.getWindowCount() : 0
    };
  }

  /**
   * Get OS generator instance (singleton pattern)
   */
  static getInstance() {
    if (!OSGenerator.instance) {
      OSGenerator.instance = new OSGenerator();
    }
    return OSGenerator.instance;
  }
}

// Auto-initialize if data-os-config attribute is present
document.addEventListener('DOMContentLoaded', async () => {
  const osConfigAttr = document.body.dataset.osConfig;
  const osIdAttr = document.body.dataset.osId;

  if (osConfigAttr || osIdAttr) {
    const generator = OSGenerator.getInstance();

    if (osConfigAttr) {
      // Load from URL
      await generator.initialize(osConfigAttr);
    } else if (osIdAttr) {
      // Load by ID
      const config = await generator.loadConfigById(osIdAttr);
      await generator.initialize(config);
    }
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OSGenerator;
}
