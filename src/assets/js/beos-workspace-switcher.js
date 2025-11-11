/**
 * BeOS Workspace Switcher
 * Implements the 3x3 virtual desktop grid unique to BeOS
 * This is a replicant that can be moved around the desktop
 */

(function(global) {
  'use strict';

  /**
   * Workspace Switcher
   * Manages 9 workspaces in a 3x3 grid
   */
  class BeOSWorkspaceSwitcher {
    constructor() {
      this.workspaces = [];
      this.currentWorkspace = 0; // 0-8 (3x3 grid)
      this.element = null;
      this.isDragging = false;
      this.dragOffsetX = 0;
      this.dragOffsetY = 0;

      // Initialize 9 workspaces
      for (let i = 0; i < 9; i++) {
        this.workspaces.push({
          id: i,
          windows: new Set(),
          active: i === 0
        });
      }
    }

    /**
     * Initialize workspace switcher
     */
    init() {
      this.element = document.getElementById('workspace-switcher');
      if (!this.element) {
        console.error('Workspace switcher element not found');
        return;
      }

      this._createGrid();
      this._setupDragging();
      this._loadPosition();
    }

    /**
     * Create the 3x3 workspace grid
     * @private
     */
    _createGrid() {
      const grid = this.element.querySelector('.workspace-grid');
      if (!grid) return;

      grid.innerHTML = '';

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const index = row * 3 + col;
          const cell = document.createElement('div');
          cell.className = 'workspace-cell';
          cell.dataset.workspace = index;

          if (index === this.currentWorkspace) {
            cell.classList.add('active');
          }

          cell.addEventListener('click', () => this.switchToWorkspace(index));
          grid.appendChild(cell);
        }
      }

      this._updateGrid();
    }

    /**
     * Setup dragging for replicant
     * @private
     */
    _setupDragging() {
      const handle = this.element.querySelector('.replicant-handle');
      if (!handle) return;

      handle.addEventListener('mousedown', (e) => {
        this.isDragging = true;
        this.dragOffsetX = e.clientX - this.element.offsetLeft;
        this.dragOffsetY = e.clientY - this.element.offsetTop;
        this.element.style.cursor = 'move';
        e.preventDefault();
      });

      document.addEventListener('mousemove', (e) => {
        if (!this.isDragging) return;

        let newX = e.clientX - this.dragOffsetX;
        let newY = e.clientY - this.dragOffsetY;

        // Keep within viewport
        newX = Math.max(0, Math.min(newX, window.innerWidth - this.element.offsetWidth));
        newY = Math.max(20, Math.min(newY, window.innerHeight - this.element.offsetHeight));

        this.element.style.left = `${newX}px`;
        this.element.style.top = `${newY}px`;
        this.element.style.right = 'auto';
      });

      document.addEventListener('mouseup', () => {
        if (this.isDragging) {
          this.isDragging = false;
          this.element.style.cursor = '';
          this._savePosition();
        }
      });
    }

    /**
     * Switch to a different workspace
     */
    switchToWorkspace(index) {
      if (index < 0 || index >= 9) return;
      if (index === this.currentWorkspace) return;

      const oldWorkspace = this.currentWorkspace;
      this.currentWorkspace = index;

      // Update workspace states
      this.workspaces[oldWorkspace].active = false;
      this.workspaces[index].active = true;

      // Hide windows from old workspace
      this.workspaces[oldWorkspace].windows.forEach(windowId => {
        if (global.beosDesktop && global.beosDesktop.windowSystem) {
          const windowData = global.beosDesktop.windowSystem.getWindow(windowId);
          if (windowData && windowData.element) {
            windowData.element.style.display = 'none';
          }
        }
      });

      // Show windows in new workspace
      this.workspaces[index].windows.forEach(windowId => {
        if (global.beosDesktop && global.beosDesktop.windowSystem) {
          const windowData = global.beosDesktop.windowSystem.getWindow(windowId);
          if (windowData && windowData.element && !windowData.minimized) {
            windowData.element.style.display = 'flex';
          }
        }
      });

      this._updateGrid();
      this._announceWorkspaceChange(index);
    }

    /**
     * Add window to workspace
     */
    addWindowToWorkspace(windowId, workspaceIndex = null) {
      const index = workspaceIndex !== null ? workspaceIndex : this.currentWorkspace;
      if (index < 0 || index >= 9) return;

      this.workspaces[index].windows.add(windowId);
      this._updateGrid();
    }

    /**
     * Remove window from workspace
     */
    removeWindowFromWorkspace(windowId) {
      this.workspaces.forEach(workspace => {
        workspace.windows.delete(windowId);
      });
      this._updateGrid();
    }

    /**
     * Move window to different workspace
     */
    moveWindowToWorkspace(windowId, targetIndex) {
      if (targetIndex < 0 || targetIndex >= 9) return;

      // Remove from all workspaces
      this.removeWindowFromWorkspace(windowId);

      // Add to target workspace
      this.addWindowToWorkspace(windowId, targetIndex);

      // If moving to a different workspace, hide the window
      if (targetIndex !== this.currentWorkspace) {
        if (global.beosDesktop && global.beosDesktop.windowSystem) {
          const windowData = global.beosDesktop.windowSystem.getWindow(windowId);
          if (windowData && windowData.element) {
            windowData.element.style.display = 'none';
          }
        }
      }
    }

    /**
     * Update grid visual state
     * @private
     */
    _updateGrid() {
      const cells = this.element.querySelectorAll('.workspace-cell');

      cells.forEach((cell, index) => {
        const workspace = this.workspaces[index];

        // Update active state
        if (index === this.currentWorkspace) {
          cell.classList.add('active');
        } else {
          cell.classList.remove('active');
        }

        // Show if workspace has windows
        if (workspace.windows.size > 0) {
          cell.classList.add('has-windows');
        } else {
          cell.classList.remove('has-windows');
        }

        // Update tooltip
        cell.title = `Workspace ${index + 1}${workspace.windows.size > 0 ? ` (${workspace.windows.size} windows)` : ''}`;
      });
    }

    /**
     * Get current workspace index
     */
    getCurrentWorkspace() {
      return this.currentWorkspace;
    }

    /**
     * Switch to next workspace (keyboard shortcut support)
     */
    nextWorkspace() {
      const next = (this.currentWorkspace + 1) % 9;
      this.switchToWorkspace(next);
    }

    /**
     * Switch to previous workspace (keyboard shortcut support)
     */
    previousWorkspace() {
      const prev = (this.currentWorkspace - 1 + 9) % 9;
      this.switchToWorkspace(prev);
    }

    /**
     * Save position to localStorage
     * @private
     */
    _savePosition() {
      const pos = {
        left: this.element.style.left,
        top: this.element.style.top
      };
      localStorage.setItem('beos-workspace-switcher-position', JSON.stringify(pos));
    }

    /**
     * Load position from localStorage
     * @private
     */
    _loadPosition() {
      const saved = localStorage.getItem('beos-workspace-switcher-position');
      if (saved) {
        try {
          const pos = JSON.parse(saved);
          if (pos.left && pos.top) {
            this.element.style.left = pos.left;
            this.element.style.top = pos.top;
            this.element.style.right = 'auto';
          }
        } catch (e) {
          console.error('Failed to load workspace switcher position', e);
        }
      }
    }

    /**
     * Announce workspace change for accessibility
     * @private
     */
    _announceWorkspaceChange(index) {
      const row = Math.floor(index / 3) + 1;
      const col = (index % 3) + 1;
      const announcement = `Switched to workspace ${index + 1} (row ${row}, column ${col})`;

      // Create or update aria-live region
      let liveRegion = document.getElementById('workspace-live-region');
      if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'workspace-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);
      }

      liveRegion.textContent = announcement;
    }
  }

  // Export to global scope
  global.BeOSWorkspaceSwitcher = BeOSWorkspaceSwitcher;

})(window);
