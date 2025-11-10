/**
 * Menu System
 * Handles menu bar interactions, dropdowns, and keyboard navigation
 * Compatible with IE11+, Edge, Chrome, Firefox, Safari
 */

(function(global) {
  'use strict';

  /**
   * Menu System - Manages menu bar and dropdown menus
   * @class
   */
  class MenuSystem {
    constructor() {
      this.menus = new Map();
      this.activeMenu = null;
      this.isMenuBarActive = false;
      this.initialized = false;
    }

    /**
     * Initialize the menu system
     * @param {HTMLElement|string} container - Menu bar container element or selector
     * @returns {MenuSystem} Instance for chaining
     */
    init(container) {
      if (this.initialized) return this;

      this.container = typeof container === 'string'
        ? document.querySelector(container)
        : container;

      if (!this.container) {
        throw new Error('Menu system container not found');
      }

      this._attachGlobalListeners();
      this.initialized = true;
      return this;
    }

    /**
     * Register a menu
     * @param {Object} options - Menu configuration
     * @param {string} options.id - Unique menu identifier
     * @param {string} options.label - Menu label text
     * @param {HTMLElement} options.trigger - Trigger element
     * @param {Array<Object>} options.items - Menu items
     * @returns {Menu} Created menu instance
     */
    registerMenu(options) {
      if (!this.initialized) {
        throw new Error('MenuSystem not initialized. Call init() first.');
      }

      const id = options.id || `menu-${Date.now()}`;

      if (this.menus.has(id)) {
        console.warn(`Menu with id "${id}" already exists.`);
        return this.menus.get(id);
      }

      const menu = new Menu(this, options);
      this.menus.set(id, menu);

      return menu;
    }

    /**
     * Get menu by ID
     * @param {string} id - Menu identifier
     * @returns {Menu|undefined} Menu instance
     */
    getMenu(id) {
      return this.menus.get(id);
    }

    /**
     * Open menu
     * @param {Menu} menu - Menu to open
     */
    openMenu(menu) {
      if (this.activeMenu === menu) return;

      // Close previous menu
      if (this.activeMenu) {
        this.activeMenu.close();
      }

      this.activeMenu = menu;
      this.isMenuBarActive = true;
      menu.open();
    }

    /**
     * Close active menu
     */
    closeActiveMenu() {
      if (this.activeMenu) {
        this.activeMenu.close();
        this.activeMenu = null;
        this.isMenuBarActive = false;
      }
    }

    /**
     * Close all menus
     */
    closeAll() {
      this.menus.forEach(menu => menu.close());
      this.activeMenu = null;
      this.isMenuBarActive = false;
    }

    /**
     * Attach global event listeners
     * @private
     */
    _attachGlobalListeners() {
      // Click outside to close
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.menu-trigger') && !e.target.closest('.menu-dropdown')) {
          this.closeAll();
        }
      });

      // Keyboard navigation
      document.addEventListener('keydown', this._handleGlobalKeydown.bind(this));
    }

    /**
     * Handle global keyboard events
     * @private
     */
    _handleGlobalKeydown(e) {
      // Escape to close menus
      if (e.key === 'Escape' && this.activeMenu) {
        e.preventDefault();
        this.closeAll();
        return;
      }

      // Navigate between menus with arrow keys when menu bar is active
      if (this.isMenuBarActive && this.activeMenu) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this._navigateToAdjacentMenu(-1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this._navigateToAdjacentMenu(1);
        }
      }
    }

    /**
     * Navigate to adjacent menu
     * @private
     */
    _navigateToAdjacentMenu(direction) {
      const menuArray = Array.from(this.menus.values());
      const currentIndex = menuArray.indexOf(this.activeMenu);

      if (currentIndex === -1) return;

      let nextIndex = currentIndex + direction;
      if (nextIndex < 0) nextIndex = menuArray.length - 1;
      if (nextIndex >= menuArray.length) nextIndex = 0;

      this.openMenu(menuArray[nextIndex]);
    }

    /**
     * Remove menu from system
     * @param {string} id - Menu identifier
     */
    _removeMenu(id) {
      const menu = this.menus.get(id);
      if (menu) {
        if (this.activeMenu === menu) {
          this.activeMenu = null;
          this.isMenuBarActive = false;
        }
        this.menus.delete(id);
      }
    }
  }

  /**
   * Individual Menu Instance
   * @class
   */
  class Menu {
    constructor(system, options) {
      this.system = system;
      this.id = options.id || `menu-${Date.now()}`;
      this.label = options.label || 'Menu';
      this.trigger = options.trigger;
      this.items = options.items || [];
      this.isOpen = false;
      this.selectedIndex = -1;

      this._build();
      this._attachEventListeners();
    }

    /**
     * Build menu DOM structure
     * @private
     */
    _build() {
      // Set up trigger
      if (this.trigger) {
        this.trigger.classList.add('menu-trigger');
        this.trigger.setAttribute('role', 'button');
        this.trigger.setAttribute('aria-haspopup', 'true');
        this.trigger.setAttribute('aria-expanded', 'false');
        this.trigger.setAttribute('aria-controls', `${this.id}-dropdown`);
      }

      // Create dropdown
      this.dropdown = document.createElement('div');
      this.dropdown.className = 'menu-dropdown';
      this.dropdown.id = `${this.id}-dropdown`;
      this.dropdown.setAttribute('role', 'menu');
      this.dropdown.setAttribute('aria-label', this.label);

      // Create menu items
      const menuList = document.createElement('ul');
      menuList.className = 'menu-list';
      menuList.setAttribute('role', 'none');

      this.items.forEach((item, index) => {
        const menuItem = this._createMenuItem(item, index);
        menuList.appendChild(menuItem);
      });

      this.dropdown.appendChild(menuList);

      // Position dropdown near trigger
      if (this.trigger) {
        this.trigger.parentNode.style.position = 'relative';
        this.trigger.parentNode.appendChild(this.dropdown);
      }
    }

    /**
     * Create menu item element
     * @private
     */
    _createMenuItem(item, index) {
      const li = document.createElement('li');
      li.className = 'menu-item';
      li.setAttribute('role', 'none');

      if (item.type === 'separator') {
        li.classList.add('menu-separator');
        const hr = document.createElement('hr');
        hr.setAttribute('role', 'separator');
        li.appendChild(hr);
        return li;
      }

      const button = document.createElement('button');
      button.className = 'menu-item-button';
      button.setAttribute('role', 'menuitem');
      button.setAttribute('tabindex', '-1');
      button.setAttribute('data-index', index);

      // Icon
      if (item.icon) {
        const icon = document.createElement('span');
        icon.className = 'menu-item-icon';
        icon.innerHTML = item.icon;
        button.appendChild(icon);
      }

      // Label
      const label = document.createElement('span');
      label.className = 'menu-item-label';
      label.textContent = item.label || 'Unnamed';
      button.appendChild(label);

      // Keyboard shortcut
      if (item.shortcut) {
        const shortcut = document.createElement('span');
        shortcut.className = 'menu-item-shortcut';
        shortcut.textContent = item.shortcut;
        button.appendChild(shortcut);
      }

      // Submenu indicator
      if (item.submenu) {
        const arrow = document.createElement('span');
        arrow.className = 'menu-item-arrow';
        arrow.textContent = '▶';
        button.appendChild(arrow);
      }

      // Disabled state
      if (item.disabled) {
        button.disabled = true;
        li.classList.add('disabled');
      }

      // Action
      if (item.action && typeof item.action === 'function') {
        button.addEventListener('click', (e) => {
          e.stopPropagation();
          item.action(e);
          this.close();
          this.system.closeAll();
        });
      }

      li.appendChild(button);

      // Submenu
      if (item.submenu && Array.isArray(item.submenu)) {
        const submenu = this._createSubmenu(item.submenu);
        li.appendChild(submenu);
        li.classList.add('has-submenu');

        // Show submenu on hover
        li.addEventListener('mouseenter', () => {
          submenu.classList.add('visible');
        });
        li.addEventListener('mouseleave', () => {
          submenu.classList.remove('visible');
        });
      }

      return li;
    }

    /**
     * Create submenu
     * @private
     */
    _createSubmenu(items) {
      const submenu = document.createElement('div');
      submenu.className = 'menu-submenu';
      submenu.setAttribute('role', 'menu');

      const submenuList = document.createElement('ul');
      submenuList.className = 'menu-list';
      submenuList.setAttribute('role', 'none');

      items.forEach((item, index) => {
        const menuItem = this._createMenuItem(item, index);
        submenuList.appendChild(menuItem);
      });

      submenu.appendChild(submenuList);
      return submenu;
    }

    /**
     * Attach event listeners
     * @private
     */
    _attachEventListeners() {
      if (!this.trigger) return;

      // Click to toggle
      this.trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.isOpen) {
          this.close();
        } else {
          this.system.openMenu(this);
        }
      });

      // Hover to open when menu bar is active
      this.trigger.addEventListener('mouseenter', () => {
        if (this.system.isMenuBarActive && !this.isOpen) {
          this.system.openMenu(this);
        }
      });

      // Keyboard navigation within dropdown
      this.dropdown.addEventListener('keydown', this._handleKeydown.bind(this));
    }

    /**
     * Handle keyboard navigation
     * @private
     */
    _handleKeydown(e) {
      const items = Array.from(this.dropdown.querySelectorAll('.menu-item-button:not([disabled])'));

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          this._navigateItems(items, 1);
          break;

        case 'ArrowUp':
          e.preventDefault();
          this._navigateItems(items, -1);
          break;

        case 'Home':
          e.preventDefault();
          if (items.length > 0) {
            items[0].focus();
            this.selectedIndex = 0;
          }
          break;

        case 'End':
          e.preventDefault();
          if (items.length > 0) {
            items[items.length - 1].focus();
            this.selectedIndex = items.length - 1;
          }
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
            items[this.selectedIndex].click();
          }
          break;
      }
    }

    /**
     * Navigate menu items with keyboard
     * @private
     */
    _navigateItems(items, direction) {
      if (items.length === 0) return;

      let nextIndex = this.selectedIndex + direction;

      if (nextIndex < 0) nextIndex = items.length - 1;
      if (nextIndex >= items.length) nextIndex = 0;

      items[nextIndex].focus();
      this.selectedIndex = nextIndex;
    }

    /**
     * Open menu
     */
    open() {
      if (this.isOpen) return;

      this.isOpen = true;
      this.dropdown.classList.add('visible');

      if (this.trigger) {
        this.trigger.setAttribute('aria-expanded', 'true');
        this.trigger.classList.add('active');
      }

      // Position dropdown
      this._positionDropdown();

      // Focus first item
      setTimeout(() => {
        const firstItem = this.dropdown.querySelector('.menu-item-button:not([disabled])');
        if (firstItem) {
          firstItem.focus();
          this.selectedIndex = 0;
        }
      }, 50);
    }

    /**
     * Close menu
     */
    close() {
      if (!this.isOpen) return;

      this.isOpen = false;
      this.dropdown.classList.remove('visible');
      this.selectedIndex = -1;

      if (this.trigger) {
        this.trigger.setAttribute('aria-expanded', 'false');
        this.trigger.classList.remove('active');
      }

      // Hide all submenus
      const submenus = this.dropdown.querySelectorAll('.menu-submenu');
      submenus.forEach(submenu => submenu.classList.remove('visible'));
    }

    /**
     * Position dropdown relative to trigger
     * @private
     */
    _positionDropdown() {
      if (!this.trigger) return;

      const triggerRect = this.trigger.getBoundingClientRect();
      const dropdownRect = this.dropdown.getBoundingClientRect();

      // Position below trigger
      this.dropdown.style.top = `${triggerRect.height}px`;
      this.dropdown.style.left = '0';

      // Check if dropdown goes off screen
      const spaceBelow = window.innerHeight - triggerRect.bottom;
      const spaceRight = window.innerWidth - triggerRect.left;

      // Flip up if not enough space below
      if (spaceBelow < dropdownRect.height && triggerRect.top > dropdownRect.height) {
        this.dropdown.style.top = 'auto';
        this.dropdown.style.bottom = `${triggerRect.height}px`;
      }

      // Flip left if not enough space on right
      if (spaceRight < dropdownRect.width) {
        this.dropdown.style.left = 'auto';
        this.dropdown.style.right = '0';
      }
    }

    /**
     * Update menu items
     * @param {Array<Object>} items - New menu items
     */
    updateItems(items) {
      this.items = items;
      const menuList = this.dropdown.querySelector('.menu-list');
      menuList.innerHTML = '';

      this.items.forEach((item, index) => {
        const menuItem = this._createMenuItem(item, index);
        menuList.appendChild(menuItem);
      });
    }

    /**
     * Destroy menu
     */
    destroy() {
      if (this.dropdown && this.dropdown.parentNode) {
        this.dropdown.remove();
      }
      this.system._removeMenu(this.id);
    }
  }

  // Export to global scope
  global.MenuSystem = MenuSystem;
  global.Menu = Menu;

})(typeof window !== 'undefined' ? window : global);
