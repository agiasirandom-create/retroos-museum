/**
 * Mac OS 9 Graphing Calculator
 * 3D equation graphing application
 */

(function(global) {
  'use strict';

  class MacOS9GraphingCalc {
    constructor(desktop) {
      this.desktop = desktop;
      this.equations = ['z = sin(x) * cos(y)'];
      this.rotationX = 30;
      this.rotationY = 45;
      this.zoom = 1.0;
    }

    open() {
      const content = this._buildCalcContent();

      this.window = this.desktop.createAppWindow({
        id: 'graphing-calculator',
        title: 'Graphing Calculator',
        content: content,
        width: 680,
        height: 560,
        resizable: true
      });

      this._attachListeners();
    }

    _buildCalcContent() {
      return `<div style="height: 100%; display: flex; flex-direction: column;">
        <!-- Toolbar -->
        <div style="padding: 8px; background: linear-gradient(to bottom, #EEEEEE, #DDDDDD); border-bottom: 1px solid #555; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; gap: 8px;">
            <button class="mac9-button" id="graph-2d">2D</button>
            <button class="mac9-button default" id="graph-3d">3D</button>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <label style="font-family: var(--mac9-geneva); font-size: 11px;">Grid:</label>
            <input type="checkbox" id="graph-grid" checked>
            <label style="font-family: var(--mac9-geneva); font-size: 11px;">Axes:</label>
            <input type="checkbox" id="graph-axes" checked>
          </div>
        </div>

        <!-- Graph Display Area -->
        <div style="flex: 1; background: #FFFFFF; display: flex; align-items: center; justify-content: center; position: relative; min-height: 360px; border-bottom: 1px solid #CCC;">
          <div id="graph-canvas" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
            ${this._renderGraphPreview()}
          </div>
        </div>

        <!-- Equation Input Area -->
        <div style="padding: 12px; background: var(--mac9-platinum-light);">
          <div class="mac9-group">
            <div class="mac9-group-title">Equation</div>
            <div style="margin: 8px 0;">
              <input type="text" id="graph-equation" class="mac9-input" style="width: 100%; font-family: var(--mac9-monaco); font-size: 13px;" value="z = sin(x) * cos(y)" placeholder="Enter equation (e.g., z = sin(x) * cos(y))">
            </div>
            <div style="margin-top: 12px; display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; gap: 8px;">
                <button class="mac9-button default" id="graph-plot">Graph</button>
                <button class="mac9-button" id="graph-clear">Clear</button>
              </div>
              <div style="font-family: var(--mac9-geneva); font-size: 10px; color: #666;">
                Use x, y for variables. Functions: sin, cos, tan, sqrt, abs
              </div>
            </div>
          </div>

          <!-- Rotation and Zoom Controls -->
          <div style="margin-top: 12px; display: flex; gap: 20px;">
            <div style="flex: 1;">
              <label style="display: block; font-family: var(--mac9-geneva); font-size: 11px; margin-bottom: 4px;">Rotation X: <span id="rotation-x-val">30°</span></label>
              <input type="range" id="rotation-x" min="0" max="360" value="30" style="width: 100%;">
            </div>
            <div style="flex: 1;">
              <label style="display: block; font-family: var(--mac9-geneva); font-size: 11px; margin-bottom: 4px;">Rotation Y: <span id="rotation-y-val">45°</span></label>
              <input type="range" id="rotation-y" min="0" max="360" value="45" style="width: 100%;">
            </div>
            <div style="flex: 1;">
              <label style="display: block; font-family: var(--mac9-geneva); font-size: 11px; margin-bottom: 4px;">Zoom: <span id="zoom-val">1.0x</span></label>
              <input type="range" id="zoom" min="0.5" max="3" step="0.1" value="1.0" style="width: 100%;">
            </div>
          </div>
        </div>
      </div>`;
    }

    _renderGraphPreview() {
      return `<svg width="500" height="360" viewBox="0 0 500 360">
        <!-- Grid -->
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E0E0E0" stroke-width="0.5"/>
          </pattern>
        </defs>
        <rect width="500" height="360" fill="url(#grid)" />

        <!-- Axes -->
        <line x1="50" y1="180" x2="450" y2="180" stroke="#000" stroke-width="2" />
        <line x1="250" y1="30" x2="250" y2="330" stroke="#000" stroke-width="2" />

        <!-- 3D Surface Approximation -->
        <g opacity="0.8">
          ${this._generateSurfaceMesh()}
        </g>

        <!-- Axis Labels -->
        <text x="460" y="185" font-family="var(--mac9-geneva)" font-size="12" fill="#000">X</text>
        <text x="255" y="20" font-family="var(--mac9-geneva)" font-size="12" fill="#000">Y</text>
        <text x="20" y="185" font-family="var(--mac9-geneva)" font-size="12" fill="#000">Z</text>
      </svg>`;
    }

    _generateSurfaceMesh() {
      let paths = '';
      const centerX = 250;
      const centerY = 180;
      const scale = 40;

      // Generate a simple 3D surface mesh
      for (let i = -4; i <= 4; i++) {
        for (let j = -4; j <= 4; j++) {
          const x1 = i * scale;
          const y1 = j * scale;
          const z1 = Math.sin(i * 0.5) * Math.cos(j * 0.5) * 30;

          const x2 = (i + 1) * scale;
          const y2 = j * scale;
          const z2 = Math.sin((i + 1) * 0.5) * Math.cos(j * 0.5) * 30;

          const x3 = i * scale;
          const y3 = (j + 1) * scale;
          const z3 = Math.sin(i * 0.5) * Math.cos((j + 1) * 0.5) * 30;

          // Project to 2D
          const px1 = centerX + x1 * 0.8 + y1 * 0.3;
          const py1 = centerY - z1 - y1 * 0.3;

          const px2 = centerX + x2 * 0.8 + y2 * 0.3;
          const py2 = centerY - z2 - y2 * 0.3;

          const px3 = centerX + x3 * 0.8 + y3 * 0.3;
          const py3 = centerY - z3 - y3 * 0.3;

          const hue = 200 + z1 * 2;
          paths += `<path d="M ${px1} ${py1} L ${px2} ${py2} L ${px3} ${py3} Z" fill="hsl(${hue}, 70%, 60%)" stroke="#3366FF" stroke-width="0.5" />`;
        }
      }

      return paths;
    }

    _attachListeners() {
      if (!this.window || !this.window.element) return;

      const plotBtn = this.window.element.querySelector('#graph-plot');
      const clearBtn = this.window.element.querySelector('#graph-clear');
      const equationInput = this.window.element.querySelector('#graph-equation');
      const rotationX = this.window.element.querySelector('#rotation-x');
      const rotationY = this.window.element.querySelector('#rotation-y');
      const zoom = this.window.element.querySelector('#zoom');

      if (plotBtn) {
        plotBtn.addEventListener('click', () => {
          const equation = equationInput.value;
          this.desktop._showAlert(`Graphing equation: ${equation} (demo)`);
        });
      }

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          equationInput.value = '';
        });
      }

      if (rotationX) {
        rotationX.addEventListener('input', (e) => {
          this.rotationX = parseInt(e.target.value);
          const label = this.window.element.querySelector('#rotation-x-val');
          if (label) label.textContent = `${this.rotationX}°`;
        });
      }

      if (rotationY) {
        rotationY.addEventListener('input', (e) => {
          this.rotationY = parseInt(e.target.value);
          const label = this.window.element.querySelector('#rotation-y-val');
          if (label) label.textContent = `${this.rotationY}°`;
        });
      }

      if (zoom) {
        zoom.addEventListener('input', (e) => {
          this.zoom = parseFloat(e.target.value);
          const label = this.window.element.querySelector('#zoom-val');
          if (label) label.textContent = `${this.zoom.toFixed(1)}x`;
        });
      }
    }
  }

  global.MacOS9GraphingCalc = MacOS9GraphingCalc;

})(typeof window !== 'undefined' ? window : global);
