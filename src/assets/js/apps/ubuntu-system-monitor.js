/**
 * Ubuntu System Monitor
 * Task manager showing processes, resources, and system info
 */

(function(global) {
  'use strict';

  class UbuntuSystemMonitor {
    constructor(windowManager) {
      this.windowManager = windowManager;
      this.windowInstance = null;
      this.currentTab = 'processes';
      this.processes = this.createProcessList();
    }

    createProcessList() {
      return [
        { pid: 1, name: 'init', user: 'root', cpu: 0, memory: 0.1 },
        { pid: 2345, name: 'gnome-session', user: 'user', cpu: 2.1, memory: 3.2 },
        { pid: 2456, name: 'nautilus', user: 'user', cpu: 0.5, memory: 2.8 },
        { pid: 2567, name: 'gnome-panel', user: 'user', cpu: 1.2, memory: 2.1 },
        { pid: 2678, name: 'firefox-bin', user: 'user', cpu: 8.3, memory: 12.5 },
        { pid: 2789, name: 'gedit', user: 'user', cpu: 0.3, memory: 1.9 },
        { pid: 2890, name: 'gnome-terminal', user: 'user', cpu: 0.4, memory: 1.5 },
        { pid: 2901, name: 'X', user: 'root', cpu: 3.2, memory: 8.4 },
      ];
    }

    open() {
      this.windowInstance = this.windowManager.createWindow({
        id: `system-monitor-${Date.now()}`,
        title: 'System Monitor',
        width: 680,
        height: 500,
        x: 120 + Math.random() * 80,
        y: 100 + Math.random() * 60,
        resizable: true,
        content: this.renderContent()
      });

      this.attachEventListeners();
      this.startUpdating();
    }

    renderContent() {
      return `
        <div class="sysmon-container">
          <div class="sysmon-menubar">
            <button class="sysmon-menu-item">Monitor</button>
            <button class="sysmon-menu-item">Edit</button>
            <button class="sysmon-menu-item">View</button>
            <button class="sysmon-menu-item">Help</button>
          </div>

          <div class="sysmon-tabs">
            <button class="sysmon-tab ${this.currentTab === 'processes' ? 'active' : ''}" data-tab="processes">Processes</button>
            <button class="sysmon-tab ${this.currentTab === 'resources' ? 'active' : ''}" data-tab="resources">Resources</button>
            <button class="sysmon-tab ${this.currentTab === 'system' ? 'active' : ''}" data-tab="system">System</button>
          </div>

          <div class="sysmon-content">
            ${this.renderTabContent()}
          </div>
        </div>

        <style>
          .sysmon-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: white;
            font-family: 'Ubuntu Sans', sans-serif;
          }

          .sysmon-menubar {
            display: flex;
            padding: 2px 4px;
            background: #E9E7E3;
            border-bottom: 1px solid #9B9388;
          }

          .sysmon-menu-item {
            padding: 4px 12px;
            background: transparent;
            border: none;
            border-radius: 2px;
            font-family: 'Ubuntu Sans', sans-serif;
            font-size: 10pt;
            cursor: pointer;
            transition: background-color 0.1s ease;
          }

          .sysmon-menu-item:hover {
            background: rgba(240, 119, 70, 0.15);
          }

          .sysmon-tabs {
            display: flex;
            background: #E9E7E3;
            border-bottom: 1px solid #9B9388;
          }

          .sysmon-tab {
            padding: 8px 20px;
            background: transparent;
            border: none;
            border-bottom: 3px solid transparent;
            font-family: 'Ubuntu Sans', sans-serif;
            font-size: 10pt;
            cursor: pointer;
            transition: all 0.1s ease;
          }

          .sysmon-tab:hover {
            background: rgba(240, 119, 70, 0.1);
          }

          .sysmon-tab.active {
            background: white;
            border-bottom-color: #F07746;
            font-weight: 600;
          }

          .sysmon-content {
            flex: 1;
            overflow: auto;
            padding: 12px;
          }

          .sysmon-process-list {
            border: 1px solid #E9E7E3;
            border-radius: 3px;
          }

          .sysmon-process-header {
            display: grid;
            grid-template-columns: 80px 1fr 100px 80px 100px;
            gap: 12px;
            padding: 8px 12px;
            background: #E9E7E3;
            font-weight: 600;
            font-size: 9pt;
            border-bottom: 1px solid #9B9388;
          }

          .sysmon-process-row {
            display: grid;
            grid-template-columns: 80px 1fr 100px 80px 100px;
            gap: 12px;
            padding: 8px 12px;
            border-bottom: 1px solid #E9E7E3;
            font-size: 10pt;
            transition: background-color 0.1s ease;
          }

          .sysmon-process-row:hover {
            background: rgba(240, 119, 70, 0.05);
          }

          .sysmon-graph-container {
            margin-bottom: 20px;
          }

          .sysmon-graph-title {
            font-size: 11pt;
            font-weight: 600;
            margin-bottom: 8px;
            color: #2C2C2C;
          }

          .sysmon-graph {
            height: 120px;
            background: #E9E7E3;
            border: 1px solid #9B9388;
            border-radius: 3px;
            position: relative;
            overflow: hidden;
          }

          .sysmon-graph-line {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 60%;
            background: linear-gradient(to top, #F07746 0%, rgba(240, 119, 70, 0.3) 100%);
          }

          .sysmon-info-grid {
            display: grid;
            grid-template-columns: 180px 1fr;
            gap: 12px;
            font-size: 10pt;
          }

          .sysmon-info-label {
            font-weight: 600;
            color: #666;
          }

          .sysmon-info-value {
            color: #2C2C2C;
          }
        </style>
      `;
    }

    renderTabContent() {
      switch (this.currentTab) {
        case 'processes':
          return this.renderProcesses();
        case 'resources':
          return this.renderResources();
        case 'system':
          return this.renderSystem();
        default:
          return '';
      }
    }

    renderProcesses() {
      return `
        <div class="sysmon-process-list">
          <div class="sysmon-process-header">
            <div>PID</div>
            <div>Process Name</div>
            <div>User</div>
            <div>CPU %</div>
            <div>Memory (MB)</div>
          </div>
          ${this.processes.map(proc => `
            <div class="sysmon-process-row">
              <div>${proc.pid}</div>
              <div>${proc.name}</div>
              <div>${proc.user}</div>
              <div>${proc.cpu.toFixed(1)}%</div>
              <div>${(proc.memory * 10).toFixed(1)} MB</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    renderResources() {
      return `
        <div class="sysmon-graph-container">
          <div class="sysmon-graph-title">CPU History</div>
          <div class="sysmon-graph">
            <div class="sysmon-graph-line" style="height: ${Math.random() * 40 + 30}%"></div>
          </div>
          <div style="margin-top: 8px; font-size: 10pt; color: #666;">
            CPU: 15.3% (2 CPUs)
          </div>
        </div>

        <div class="sysmon-graph-container">
          <div class="sysmon-graph-title">Memory and Swap History</div>
          <div class="sysmon-graph">
            <div class="sysmon-graph-line" style="height: ${Math.random() * 30 + 40}%"></div>
          </div>
          <div style="margin-top: 8px; font-size: 10pt; color: #666;">
            Memory: 234 MB of 512 MB used (45.7%)
          </div>
        </div>

        <div class="sysmon-graph-container">
          <div class="sysmon-graph-title">Network History</div>
          <div class="sysmon-graph">
            <div class="sysmon-graph-line" style="height: ${Math.random() * 20 + 20}%"></div>
          </div>
          <div style="margin-top: 8px; font-size: 10pt; color: #666;">
            Receiving: 12.3 KB/s &nbsp;&nbsp; Sending: 2.1 KB/s
          </div>
        </div>
      `;
    }

    renderSystem() {
      return `
        <div class="sysmon-info-grid">
          <div class="sysmon-info-label">System:</div>
          <div class="sysmon-info-value">Ubuntu 4.10 (Warty Warthog)</div>

          <div class="sysmon-info-label">Kernel:</div>
          <div class="sysmon-info-value">Linux 2.6.8-1-686</div>

          <div class="sysmon-info-label">GNOME Version:</div>
          <div class="sysmon-info-value">2.8.1</div>

          <div class="sysmon-info-label">Hardware:</div>
          <div class="sysmon-info-value">&nbsp;</div>

          <div class="sysmon-info-label">Processor:</div>
          <div class="sysmon-info-value">Intel Pentium 4 @ 2.4 GHz</div>

          <div class="sysmon-info-label">Memory:</div>
          <div class="sysmon-info-value">512 MB</div>

          <div class="sysmon-info-label">Disk:</div>
          <div class="sysmon-info-value">40 GB (25 GB free)</div>

          <div class="sysmon-info-label">System Status:</div>
          <div class="sysmon-info-value">&nbsp;</div>

          <div class="sysmon-info-label">Available disk space:</div>
          <div class="sysmon-info-value">25.3 GB</div>
        </div>
      `;
    }

    attachEventListeners() {
      const content = this.windowInstance.contentArea;

      content.addEventListener('click', (e) => {
        const tab = e.target.closest('.sysmon-tab');
        if (tab) {
          this.currentTab = tab.getAttribute('data-tab');
          this.windowInstance.setContent(this.renderContent());
          this.attachEventListeners();
        }
      });
    }

    startUpdating() {
      this.updateInterval = setInterval(() => {
        if (this.currentTab === 'processes') {
          // Update CPU and memory values randomly for demo
          this.processes.forEach(proc => {
            proc.cpu = Math.max(0, proc.cpu + (Math.random() - 0.5) * 2);
            proc.memory = Math.max(0.1, proc.memory + (Math.random() - 0.5) * 0.5);
          });

          const content = this.windowInstance?.contentArea;
          if (content) {
            const listContainer = content.querySelector('.sysmon-process-list');
            if (listContainer && this.currentTab === 'processes') {
              listContainer.innerHTML = this.renderProcesses().match(/<div class="sysmon-process-list">([\s\S]*)<\/div>/)[1];
            }
          }
        }
      }, 2000);
    }
  }

  global.UbuntuSystemMonitor = UbuntuSystemMonitor;

})(typeof window !== 'undefined' ? window : global);
