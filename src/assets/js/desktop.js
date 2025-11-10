/**
 * Desktop System
 * Manages desktop icons, selection, and interactions
 * Compatible with IE11+, Edge, Chrome, Firefox, Safari
 */

(function(global) {
  'use strict';

  /**
   * Desktop Manager - Manages desktop icons and interactions
   * @class
   */
  class Desktop {
    constructor() {
      this.icons = new Map();
      this.selectedIcons = new Set();
      this.container = null;
      this.initialized = false;
      this.isDraggingIcons = false;
      this.selectionBox = null;
      this.contextMenu = null;
    }

    /**
     * Initialize the desktop
     * @param {HTMLElement|string} container - Desktop container element or selector
     * @param {Object} options - Configuration options
     * @param {boolean} [options.multiSelect=true] - Enable multi-selection
     * @param {boolean} [options.draggable=false] - Enable icon dragging
     * @param {boolean} [options.contextMenu=true] - Enable context menu
     * @param {Array<Object>} [options.contextMenuItems] - Custom context menu items
     * @returns {Desktop} Instance for chaining
     */
    init(container, options = {}) {
      if (this.initialized) return this;

      this.container = typeof container === 'string'
        ? document.querySelector(container)
        : container;

      if (!this.container) {
        throw new Error('Desktop container not found');
      }

      // Options
      this.options = {
        multiSelect: options.multiSelect !== false,
        draggable: options.draggable || false,
        contextMenu: options.contextMenu !== false,
        contextMenuItems: options.contextMenuItems || this._getDefaultContextMenuItems()
      };

      this.container.classList.add('desktop-container');
      this.container.setAttribute('role', 'application');
      this.container.setAttribute('aria-label', 'Desktop');

      this._attachEventListeners();
      this.initialized = true;

      return this;
    }

    /**
     * Add icon to desktop
     * @param {Object} options - Icon configuration
     * @param {string} options.id - Unique icon identifier
     * @param {string} options.label - Icon label text
     * @param {string} options.icon - Icon image URL or HTML
     * @param {number} [options.x] - X position in grid
     * @param {number} [options.y] - Y position in grid
     * @param {Function} [options.onOpen] - Callback when icon is opened (double-click)
     * @param {Function} [options.onSelect] - Callback when icon is selected
     * @param {Array<Object>} [options.contextMenuItems] - Custom context menu items
     * @returns {DesktopIcon} Created icon instance
     */
    addIcon(options) {
      if (!this.initialized) {
        throw new Error('Desktop not initialized. Call init() first.');
      }

      const id = options.id || `icon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      if (this.icons.has(id)) {
        console.warn(`Icon with id "${id}" already exists.`);
        return this.icons.get(id);
      }

      const icon = new DesktopIcon(this, options);
      this.icons.set(id, icon);
      this.container.appendChild(icon.element);

      return icon;
    }

    /**
     * Remove icon from desktop
     * @param {string} id - Icon identifier
     */
    removeIcon(id) {
      const icon = this.icons.get(id);
      if (icon) {
        icon.destroy();
        this.icons.delete(id);
      }
    }

    /**
     * Get icon by ID
     * @param {string} id - Icon identifier
     * @returns {DesktopIcon|undefined} Icon instance
     */
    getIcon(id) {
      return this.icons.get(id);
    }

    /**
     * Get all icons
     * @returns {Array<DesktopIcon>} Array of icon instances
     */
    getAllIcons() {
      return Array.from(this.icons.values());
    }

    /**
     * Select icon
     * @param {DesktopIcon} icon - Icon to select
     * @param {boolean} [addToSelection=false] - Add to current selection (multi-select)
     */
    selectIcon(icon, addToSelection = false) {
      if (!this.options.multiSelect || !addToSelection) {
        this.clearSelection();
      }

      icon.select();
      this.selectedIcons.add(icon);
    }

    /**
     * Deselect icon
     * @param {DesktopIcon} icon - Icon to deselect
     */
    deselectIcon(icon) {
      icon.deselect();
      this.selectedIcons.delete(icon);
    }

    /**
     * Clear all selections
     */
    clearSelection() {
      this.selectedIcons.forEach(icon => icon.deselect());
      this.selectedIcons.clear();
    }

    /**
     * Get selected icons
     * @returns {Array<DesktopIcon>} Array of selected icons
     */
    getSelectedIcons() {
      return Array.from(this.selectedIcons);
    }

    /**
     * Show context menu
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {DesktopIcon} [icon] - Icon context (if right-clicked on icon)
     * @private
     */
    _showContextMenu(x, y, icon = null) {
      if (!this.options.contextMenu) return;

      // Remove existing context menu
      this._hideContextMenu();

      // Create context menu
      this.contextMenu = document.createElement('div');
      this.contextMenu.className = 'desktop-context-menu';
      this.contextMenu.setAttribute('role', 'menu');

      const items = icon && icon.contextMenuItems
        ? icon.contextMenuItems
        : this.options.contextMenuItems;

      const menuList = document.createElement('ul');
      menuList.className = 'context-menu-list';

      items.forEach(item => {
        if (item.type === 'separator') {
          const separator = document.createElement('li');
          separator.className = 'context-menu-separator';
          menuList.appendChild(separator);
          return;
        }

        const li = document.createElement('li');
        li.className = 'context-menu-item';

        const button = document.createElement('button');
        button.className = 'context-menu-button';
        button.textContent = item.label;
        button.disabled = item.disabled || false;

        button.addEventListener('click', (e) => {
          e.stopPropagation();
          if (item.action) {
            item.action(icon);
          }
          this._hideContextMenu();
        });

        li.appendChild(button);
        menuList.appendChild(li);
      });

      this.contextMenu.appendChild(menuList);
      document.body.appendChild(this.contextMenu);

      // Position context menu
      this.contextMenu.style.left = `${x}px`;
      this.contextMenu.style.top = `${y}px`;

      // Keep menu in viewport
      setTimeout(() => {
        const rect = this.contextMenu.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
          this.contextMenu.style.left = `${window.innerWidth - rect.width - 5}px`;
        }
        if (rect.bottom > window.innerHeight) {
          this.contextMenu.style.top = `${window.innerHeight - rect.height - 5}px`;
        }
      }, 0);

      // Show menu
      setTimeout(() => {
        this.contextMenu.classList.add('visible');
      }, 10);
    }

    /**
     * Hide context menu
     * @private
     */
    _hideContextMenu() {
      if (this.contextMenu) {
        this.contextMenu.remove();
        this.contextMenu = null;
      }
    }

    /**
     * Get default context menu items
     * @private
     */
    _getDefaultContextMenuItems() {
      return [
        {
          label: 'Refresh',
          action: () => {
            console.log('Refresh desktop');
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'View',
          action: () => {
            console.log('View options');
          }
        },
        {
          label: 'Sort by',
          action: () => {
            console.log('Sort options');
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Personalize',
          action: () => {
            console.log('Personalize desktop');
          }
        }
      ];
    }

    /**
     * Attach event listeners
     * @private
     */
    _attachEventListeners() {
      // Click on desktop to clear selection
      this.container.addEventListener('mousedown', (e) => {
        if (e.target === this.container) {
          this.clearSelection();

          // Start selection box if enabled
          if (this.options.multiSelect) {
            this._startSelectionBox(e);
          }
        }
      });

      // Context menu
      this.container.addEventListener('contextmenu', (e) => {
        if (e.target === this.container) {
          e.preventDefault();
          this._showContextMenu(e.clientX, e.clientY);
        }
      });

      // Hide context menu on click outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.desktop-context-menu')) {
          this._hideContextMenu();
        }
      });

      // Keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        // Ctrl+A to select all
        if (e.ctrlKey && e.key === 'a' && this.container.contains(document.activeElement)) {
          e.preventDefault();
          this.clearSelection();
          this.icons.forEach(icon => this.selectIcon(icon, true));
        }

        // Delete to remove selected icons
        if (e.key === 'Delete' && this.selectedIcons.size > 0) {
          this.getSelectedIcons().forEach(icon => {
            if (icon.onDelete) {
              icon.onDelete(icon);
            }
          });
        }
      });
    }

    /**
     * Start selection box
     * @private
     */
    _startSelectionBox(e) {
      const startX = e.clientX;
      const startY = e.clientY;

      // Create selection box
      this.selectionBox = document.createElement('div');
      this.selectionBox.className = 'desktop-selection-box';
      this.selectionBox.style.left = `${startX}px`;
      this.selectionBox.style.top = `${startY}px`;
      document.body.appendChild(this.selectionBox);

      const onMove = (e) => {
        const width = Math.abs(e.clientX - startX);
        const height = Math.abs(e.clientY - startY);
        const left = Math.min(e.clientX, startX);
        const top = Math.min(e.clientY, startY);

        this.selectionBox.style.left = `${left}px`;
        this.selectionBox.style.top = `${top}px`;
        this.selectionBox.style.width = `${width}px`;
        this.selectionBox.style.height = `${height}px`;

        // Select icons within selection box
        this._selectIconsInBox(left, top, width, height);
      };

      const onEnd = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);

        if (this.selectionBox) {
          this.selectionBox.remove();
          this.selectionBox = null;
        }
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onEnd);
    }

    /**
     * Select icons within bounding box
     * @private
     */
    _selectIconsInBox(left, top, width, height) {
      const boxRect = {
        left: left,
        top: top,
        right: left + width,
        bottom: top + height
      };

      this.icons.forEach(icon => {
        const iconRect = icon.element.getBoundingClientRect();

        const intersects = !(
          iconRect.right < boxRect.left ||
          iconRect.left > boxRect.right ||
          iconRect.bottom < boxRect.top ||
          iconRect.top > boxRect.bottom
        );

        if (intersects) {
          this.selectIcon(icon, true);
        } else {
          this.deselectIcon(icon);
        }
      });
    }
  }

  /**
   * Desktop Icon Instance
   * @class
   */
  class DesktopIcon {
    constructor(desktop, options) {
      this.desktop = desktop;
      this.id = options.id || `icon-${Date.now()}`;
      this.label = options.label || 'Untitled';
      this.icon = options.icon || '';
      this.x = options.x || 0;
      this.y = options.y || 0;

      // Callbacks
      this.onOpen = options.onOpen;
      this.onSelect = options.onSelect;
      this.onDelete = options.onDelete;
      this.contextMenuItems = options.contextMenuItems;

      // State
      this.isSelected = false;
      this.lastClickTime = 0;

      this._build();
      this._attachEventListeners();
    }

    /**
     * Build icon DOM structure
     * @private
     */
    _build() {
      this.element = document.createElement('div');
      this.element.className = 'desktop-icon';
      this.element.setAttribute('data-icon-id', this.id);
      this.element.setAttribute('role', 'button');
      this.element.setAttribute('tabindex', '0');
      this.element.setAttribute('aria-label', this.label);

      // Icon image/symbol
      const iconImage = document.createElement('div');
      iconImage.className = 'desktop-icon-image';

      if (this.icon.startsWith('<')) {
        iconImage.innerHTML = this.icon;
      } else if (this.icon.startsWith('http') || this.icon.startsWith('/')) {
        const img = document.createElement('img');
        img.src = this.icon;
        img.alt = '';
        iconImage.appendChild(img);
      } else {
        iconImage.textContent = this.icon;
      }

      // Icon label
      const iconLabel = document.createElement('div');
      iconLabel.className = 'desktop-icon-label';
      iconLabel.textContent = this.label;

      this.element.appendChild(iconImage);
      this.element.appendChild(iconLabel);

      // Position icon (if using grid positioning)
      if (this.x !== undefined && this.y !== undefined) {
        this.element.style.gridColumn = this.x + 1;
        this.element.style.gridRow = this.y + 1;
      }
    }

    /**
     * Attach event listeners
     * @private
     */
    _attachEventListeners() {
      // Click to select
      this.element.addEventListener('mousedown', (e) => {
        e.stopPropagation();

        const now = Date.now();
        const isDoubleClick = now - this.lastClickTime < 300;
        this.lastClickTime = now;

        if (isDoubleClick) {
          this._handleDoubleClick(e);
        } else {
          this._handleClick(e);
        }
      });

      // Context menu
      this.element.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Select icon if not already selected
        if (!this.isSelected) {
          this.desktop.selectIcon(this);
        }

        this.desktop._showContextMenu(e.clientX, e.clientY, this);
      });

      // Keyboard support
      this.element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this._handleDoubleClick(e);
        }
      });

      // Drag support (if enabled)
      if (this.desktop.options.draggable) {
        this.element.draggable = true;

        this.element.addEventListener('dragstart', (e) => {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', this.id);
          this.element.classList.add('dragging');
        });

        this.element.addEventListener('dragend', () => {
          this.element.classList.remove('dragging');
        });
      }
    }

    /**
     * Handle single click
     * @private
     */
    _handleClick(e) {
      const multiSelect = e.ctrlKey || e.metaKey || e.shiftKey;

      if (multiSelect && this.desktop.options.multiSelect) {
        if (this.isSelected) {
          this.desktop.deselectIcon(this);
        } else {
          this.desktop.selectIcon(this, true);
        }
      } else {
        this.desktop.selectIcon(this);
      }
    }

    /**
     * Handle double click
     * @private
     */
    _handleDoubleClick(e) {
      if (this.onOpen) {
        this.onOpen(this);
      }
    }

    /**
     * Select icon
     */
    select() {
      if (this.isSelected) return;

      this.isSelected = true;
      this.element.classList.add('selected');
      this.element.setAttribute('aria-selected', 'true');

      if (this.onSelect) {
        this.onSelect(this);
      }
    }

    /**
     * Deselect icon
     */
    deselect() {
      if (!this.isSelected) return;

      this.isSelected = false;
      this.element.classList.remove('selected');
      this.element.setAttribute('aria-selected', 'false');
    }

    /**
     * Update icon label
     * @param {string} label - New label
     */
    setLabel(label) {
      this.label = label;
      const labelElement = this.element.querySelector('.desktop-icon-label');
      if (labelElement) {
        labelElement.textContent = label;
      }
      this.element.setAttribute('aria-label', label);
    }

    /**
     * Update icon image
     * @param {string} icon - New icon
     */
    setIcon(icon) {
      this.icon = icon;
      const iconElement = this.element.querySelector('.desktop-icon-image');
      if (iconElement) {
        iconElement.innerHTML = '';
        if (icon.startsWith('<')) {
          iconElement.innerHTML = icon;
        } else if (icon.startsWith('http') || icon.startsWith('/')) {
          const img = document.createElement('img');
          img.src = icon;
          img.alt = '';
          iconElement.appendChild(img);
        } else {
          iconElement.textContent = icon;
        }
      }
    }

    /**
     * Destroy icon
     */
    destroy() {
      this.element.remove();
    }
  }

  // Export to global scope
  global.Desktop = Desktop;
  global.DesktopIcon = DesktopIcon;

})(typeof window !== 'undefined' ? window : global);
