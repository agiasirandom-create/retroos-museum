/**
 * Ubuntu Workspace Switcher
 * Manages 4 workspaces in a 2x2 grid (classic GNOME 2 layout)
 */

(function(global) {
  'use strict';

  class UbuntuWorkspaceSwitcher {
    constructor(desktopInstance) {
      this.desktop = desktopInstance;
      this.buttons = [];
      this.currentWorkspace = 1;
    }

    /**
     * Initialize workspace switcher
     */
    init() {
      this.buttons = Array.from(document.querySelectorAll('.workspace-button'));

      if (this.buttons.length === 0) {
        console.error('Workspace buttons not found');
        return;
      }

      this.attachEventListeners();
      this.updateActive(1);
    }

    /**
     * Attach event listeners to workspace buttons
     */
    attachEventListeners() {
      this.buttons.forEach((button, index) => {
        const workspaceNum = parseInt(button.getAttribute('data-workspace'));

        button.addEventListener('click', () => {
          this.switchToWorkspace(workspaceNum);
        });

        // Keyboard navigation
        button.addEventListener('keydown', (e) => {
          switch (e.key) {
            case 'ArrowRight':
              e.preventDefault();
              this.navigateWorkspace('right');
              break;
            case 'ArrowLeft':
              e.preventDefault();
              this.navigateWorkspace('left');
              break;
            case 'ArrowDown':
              e.preventDefault();
              this.navigateWorkspace('down');
              break;
            case 'ArrowUp':
              e.preventDefault();
              this.navigateWorkspace('up');
              break;
          }
        });
      });

      // Global keyboard shortcuts for workspace switching
      document.addEventListener('keydown', (e) => {
        // Ctrl+Alt+Arrow keys to switch workspaces
        if (e.ctrlKey && e.altKey) {
          switch (e.key) {
            case 'ArrowRight':
              e.preventDefault();
              this.navigateWorkspace('right');
              break;
            case 'ArrowLeft':
              e.preventDefault();
              this.navigateWorkspace('left');
              break;
            case 'ArrowDown':
              e.preventDefault();
              this.navigateWorkspace('down');
              break;
            case 'ArrowUp':
              e.preventDefault();
              this.navigateWorkspace('up');
              break;
          }
        }

        // Ctrl+Alt+1-4 to switch to specific workspace
        if (e.ctrlKey && e.altKey && e.key >= '1' && e.key <= '4') {
          e.preventDefault();
          this.switchToWorkspace(parseInt(e.key));
        }
      });
    }

    /**
     * Navigate to adjacent workspace
     */
    navigateWorkspace(direction) {
      // 2x2 grid layout:
      // 1 2
      // 3 4

      let newWorkspace = this.currentWorkspace;

      switch (direction) {
        case 'right':
          if (this.currentWorkspace === 1) newWorkspace = 2;
          else if (this.currentWorkspace === 3) newWorkspace = 4;
          break;
        case 'left':
          if (this.currentWorkspace === 2) newWorkspace = 1;
          else if (this.currentWorkspace === 4) newWorkspace = 3;
          break;
        case 'down':
          if (this.currentWorkspace === 1) newWorkspace = 3;
          else if (this.currentWorkspace === 2) newWorkspace = 4;
          break;
        case 'up':
          if (this.currentWorkspace === 3) newWorkspace = 1;
          else if (this.currentWorkspace === 4) newWorkspace = 2;
          break;
      }

      if (newWorkspace !== this.currentWorkspace) {
        this.switchToWorkspace(newWorkspace);
      }
    }

    /**
     * Switch to specific workspace
     */
    switchToWorkspace(workspaceNum) {
      if (workspaceNum < 1 || workspaceNum > 4) return;
      if (workspaceNum === this.currentWorkspace) return;

      // Notify desktop to switch workspace
      this.desktop.switchWorkspace(workspaceNum);
      this.currentWorkspace = workspaceNum;
      this.updateActive(workspaceNum);

      // Visual feedback
      this.showWorkspaceNotification(workspaceNum);
    }

    /**
     * Update active workspace button
     */
    updateActive(workspaceNum) {
      this.buttons.forEach(button => {
        const btnWorkspace = parseInt(button.getAttribute('data-workspace'));
        if (btnWorkspace === workspaceNum) {
          button.classList.add('active');
          button.setAttribute('aria-pressed', 'true');
        } else {
          button.classList.remove('active');
          button.setAttribute('aria-pressed', 'false');
        }
      });
    }

    /**
     * Show workspace switch notification
     */
    showWorkspaceNotification(workspaceNum) {
      // Remove existing notification
      const existingNotification = document.querySelector('.workspace-notification');
      if (existingNotification) {
        existingNotification.remove();
      }

      // Create notification
      const notification = document.createElement('div');
      notification.className = 'workspace-notification';
      notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(46, 52, 54, 0.9);
        color: white;
        padding: 24px 32px;
        border-radius: 6px;
        font-family: 'Ubuntu Sans', sans-serif;
        font-size: 18pt;
        font-weight: 500;
        z-index: 100000;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
      `;

      // Workspace layout indicator
      const grid = document.createElement('div');
      grid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(2, 40px);
        grid-template-rows: repeat(2, 40px);
        gap: 8px;
        margin-bottom: 12px;
      `;

      for (let i = 1; i <= 4; i++) {
        const cell = document.createElement('div');
        cell.style.cssText = `
          background: ${i === workspaceNum ? '#F07746' : 'rgba(255, 255, 255, 0.2)'};
          border: 2px solid ${i === workspaceNum ? '#DD4814' : 'rgba(255, 255, 255, 0.3)'};
          border-radius: 3px;
        `;
        grid.appendChild(cell);
      }

      const text = document.createElement('div');
      text.textContent = `Workspace ${workspaceNum}`;
      text.style.textAlign = 'center';

      notification.appendChild(grid);
      notification.appendChild(text);
      document.body.appendChild(notification);

      // Animate in
      requestAnimationFrame(() => {
        notification.style.opacity = '1';
      });

      // Remove after delay
      setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
          notification.remove();
        }, 200);
      }, 1000);
    }

    /**
     * Get workspace for window
     */
    getWindowWorkspace(windowId) {
      for (let i = 1; i <= 4; i++) {
        if (this.desktop.workspaces[i].has(windowId)) {
          return i;
        }
      }
      return null;
    }

    /**
     * Move window to workspace
     */
    moveWindowToWorkspace(windowId, workspaceNum) {
      if (workspaceNum < 1 || workspaceNum > 4) return;

      // Remove from all workspaces
      for (let i = 1; i <= 4; i++) {
        this.desktop.workspaces[i].delete(windowId);
      }

      // Add to target workspace
      this.desktop.workspaces[workspaceNum].add(windowId);

      // Hide window if not in current workspace
      const win = this.desktop.windowManager.getWindow(windowId);
      if (win) {
        if (workspaceNum === this.currentWorkspace) {
          win.element.style.display = 'flex';
        } else {
          win.element.style.display = 'none';
        }
      }
    }

    /**
     * Get workspace info
     */
    getWorkspaceInfo(workspaceNum) {
      const windows = Array.from(this.desktop.workspaces[workspaceNum]);
      return {
        number: workspaceNum,
        windowCount: windows.length,
        windows: windows,
        isCurrent: workspaceNum === this.currentWorkspace
      };
    }
  }

  // Export to global scope
  global.UbuntuWorkspaceSwitcher = UbuntuWorkspaceSwitcher;

})(typeof window !== 'undefined' ? window : global);
