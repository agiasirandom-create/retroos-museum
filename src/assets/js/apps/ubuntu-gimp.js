/**
 * Ubuntu GIMP (GNU Image Manipulation Program)
 * Simplified multi-window image editor interface
 */

(function(global) {
  'use strict';

  class UbuntuGimp {
    constructor(windowManager) {
      this.windowManager = windowManager;
      this.windows = {};
    }

    open() {
      // Create toolbox window
      this.windows.toolbox = this.windowManager.createWindow({
        id: `gimp-toolbox-${Date.now()}`,
        title: 'The GIMP',
        width: 220,
        height: 450,
        x: 50,
        y: 80,
        resizable: true,
        content: this.renderToolbox()
      });

      // Create main canvas window
      this.windows.canvas = this.windowManager.createWindow({
        id: `gimp-canvas-${Date.now()}`,
        title: 'Untitled-1.0 (RGB, 1 layer) 640x480 - The GIMP',
        width: 700,
        height: 550,
        x: 280,
        y: 80,
        resizable: true,
        content: this.renderCanvas()
      });

      // Create layers dock
      this.windows.layers = this.windowManager.createWindow({
        id: `gimp-layers-${Date.now()}`,
        title: 'Layers, Channels, Paths',
        width: 280,
        height: 450,
        x: window.innerWidth - 330,
        y: 80,
        resizable: true,
        content: this.renderLayersDock()
      });
    }

    renderToolbox() {
      return `
        <div class="gimp-toolbox">
          <!-- Menu -->
          <div class="gimp-menu">
            <button class="gimp-menu-btn">File</button>
            <button class="gimp-menu-btn">Xtns</button>
            <button class="gimp-menu-btn">Help</button>
          </div>

          <!-- Tools Grid -->
          <div class="gimp-tools">
            <button class="gimp-tool active" title="Rectangle Select">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <rect x="4" y="4" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="2,2"/>
              </svg>
            </button>
            <button class="gimp-tool" title="Ellipse Select">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <ellipse cx="10" cy="10" rx="6" ry="6" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="2,2"/>
              </svg>
            </button>
            <button class="gimp-tool" title="Free Select">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 8l3-3 5 5 2-2v7l-7-2-3-5z" fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
            <button class="gimp-tool" title="Fuzzy Select">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 4l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" fill="none" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </button>
            <button class="gimp-tool" title="Move">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 3l-2 2h4l-2-2zM10 17l-2-2h4l-2 2zM3 10l2-2v4l-2-2zM17 10l-2-2v4l2-2z"/>
              </svg>
            </button>
            <button class="gimp-tool" title="Crop">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M6 2v4H2v2h4v8h8v4h2v-4h4v-2h-4V6H8V2H6z" fill="currentColor"/>
              </svg>
            </button>
            <button class="gimp-tool" title="Zoom">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <circle cx="9" cy="9" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
                <path d="M13 13l4 4" stroke="currentColor" stroke-width="2"/>
                <path d="M7 9h4M9 7v4" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </button>
            <button class="gimp-tool" title="Text">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6 4h8v2h-3v10h-2V6H6V4z"/>
              </svg>
            </button>
            <button class="gimp-tool" title="Fill">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3l5 5v2L7 16 3 12l6-6V3z"/>
                <rect x="12" y="13" width="5" height="4"/>
              </svg>
            </button>
            <button class="gimp-tool" title="Blend">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:currentColor;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:currentColor;stop-opacity:0.2" />
                  </linearGradient>
                </defs>
                <rect x="4" y="4" width="12" height="12" fill="url(#grad1)"/>
              </svg>
            </button>
            <button class="gimp-tool" title="Pencil">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M14 3l3 3-9 9-4 1 1-4 9-9z"/>
              </svg>
            </button>
            <button class="gimp-tool" title="Paintbrush">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 2l3 3-8 8-2 5-3-3 5-2 8-8-3-3zM4 15c-1 1-1 2 0 3s2 1 3 0"/>
              </svg>
            </button>
            <button class="gimp-tool" title="Eraser">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3l6 6-5 5-6-6 5-5zm-8 11l3 3h6l3-3-6-6-6 6z"/>
              </svg>
            </button>
            <button class="gimp-tool" title="Clone">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <circle cx="7" cy="7" r="4" fill="none" stroke="currentColor" stroke-width="2"/>
                <circle cx="13" cy="13" r="4" fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
            <button class="gimp-tool" title="Blur/Sharpen">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <circle cx="10" cy="10" r="3"/>
                <circle cx="10" cy="10" r="6" opacity="0.3"/>
              </svg>
            </button>
            <button class="gimp-tool" title="Dodge/Burn">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M10 3v14M3 10h14" stroke="currentColor" stroke-width="2"/>
                <circle cx="10" cy="10" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>

          <!-- Color Swatches -->
          <div class="gimp-colors">
            <div class="gimp-color-swatch">
              <div class="gimp-fg-color" style="background: #2C2C2C;" title="Foreground"></div>
              <div class="gimp-bg-color" style="background: #FFFFFF;" title="Background"></div>
            </div>
            <button class="gimp-color-swap" title="Swap Colors">⇄</button>
            <button class="gimp-color-reset" title="Reset to B&W">
              <div style="width: 10px; height: 10px; background: black; border: 1px solid #999;"></div>
            </button>
          </div>

          <!-- Brush/Pattern/Gradient -->
          <div class="gimp-resource-box">
            <div class="gimp-resource-label">Brush</div>
            <div class="gimp-resource-preview">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="15" fill="#2C2C2C"/>
              </svg>
            </div>
          </div>
        </div>

        <style>
          .gimp-toolbox {
            background: #E9E7E3;
            height: 100%;
            display: flex;
            flex-direction: column;
            font-family: 'Ubuntu Sans', sans-serif;
          }

          .gimp-menu {
            display: flex;
            background: #E9E7E3;
            border-bottom: 1px solid #9B9388;
          }

          .gimp-menu-btn {
            flex: 1;
            padding: 4px 8px;
            background: transparent;
            border: none;
            font-size: 10pt;
            cursor: pointer;
            transition: background-color 0.1s ease;
          }

          .gimp-menu-btn:hover {
            background: rgba(240, 119, 70, 0.15);
          }

          .gimp-tools {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2px;
            padding: 8px;
            border-bottom: 1px solid #9B9388;
          }

          .gimp-tool {
            width: 100%;
            aspect-ratio: 1;
            padding: 8px;
            background: white;
            border: 1px solid #9B9388;
            border-radius: 2px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.1s ease;
          }

          .gimp-tool:hover {
            border-color: #F07746;
            background: #FFF8F0;
          }

          .gimp-tool.active {
            background: #F07746;
            border-color: #DD4814;
            color: white;
          }

          .gimp-colors {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px;
            border-bottom: 1px solid #9B9388;
          }

          .gimp-color-swatch {
            position: relative;
            width: 50px;
            height: 50px;
          }

          .gimp-fg-color {
            position: absolute;
            top: 0;
            left: 0;
            width: 35px;
            height: 35px;
            border: 2px solid white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            cursor: pointer;
          }

          .gimp-bg-color {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 35px;
            height: 35px;
            border: 2px solid white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            cursor: pointer;
          }

          .gimp-color-swap,
          .gimp-color-reset {
            padding: 6px;
            background: white;
            border: 1px solid #9B9388;
            border-radius: 2px;
            cursor: pointer;
            font-size: 12pt;
            transition: all 0.1s ease;
          }

          .gimp-color-swap:hover,
          .gimp-color-reset:hover {
            border-color: #F07746;
          }

          .gimp-resource-box {
            padding: 12px;
          }

          .gimp-resource-label {
            font-size: 9pt;
            color: #666;
            margin-bottom: 6px;
          }

          .gimp-resource-preview {
            background: white;
            border: 1px solid #9B9388;
            padding: 8px;
            display: flex;
            justify-content: center;
            border-radius: 2px;
          }
        </style>
      `;
    }

    renderCanvas() {
      return `
        <div class="gimp-canvas-window">
          <!-- Menu Bar -->
          <div class="gimp-menubar">
            <button class="gimp-menu-item">File</button>
            <button class="gimp-menu-item">Edit</button>
            <button class="gimp-menu-item">Select</button>
            <button class="gimp-menu-item">View</button>
            <button class="gimp-menu-item">Image</button>
            <button class="gimp-menu-item">Layer</button>
            <button class="gimp-menu-item">Tools</button>
            <button class="gimp-menu-item">Filters</button>
            <button class="gimp-menu-item">Windows</button>
            <button class="gimp-menu-item">Help</button>
          </div>

          <!-- Canvas Area -->
          <div class="gimp-canvas-area">
            <div class="gimp-canvas-viewport">
              <!-- Rulers -->
              <div class="gimp-ruler-h"></div>
              <div class="gimp-ruler-v"></div>

              <!-- Canvas -->
              <div class="gimp-canvas">
                <div class="gimp-canvas-checker">
                  <div style="text-align: center; padding: 80px 40px; color: #999;">
                    <svg width="64" height="64" viewBox="0 0 64 64" style="opacity: 0.3; margin-bottom: 16px;">
                      <path d="M8 8h16v16H8zM24 24h16v16H24zM40 8h16v16H40zM8 40h16v16H8zM40 40h16v16H40z" fill="#CCCCCC"/>
                    </svg>
                    <p style="font-size: 11pt;">New Image<br>640 x 480 pixels</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>
          .gimp-canvas-window {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: #808080;
            font-family: 'Ubuntu Sans', sans-serif;
          }

          .gimp-menubar {
            display: flex;
            padding: 2px 4px;
            background: #E9E7E3;
            border-bottom: 1px solid #9B9388;
          }

          .gimp-menu-item {
            padding: 4px 12px;
            background: transparent;
            border: none;
            border-radius: 2px;
            font-size: 10pt;
            cursor: pointer;
            transition: background-color 0.1s ease;
          }

          .gimp-menu-item:hover {
            background: rgba(240, 119, 70, 0.15);
          }

          .gimp-canvas-area {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: auto;
            padding: 20px;
          }

          .gimp-canvas-viewport {
            position: relative;
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          }

          .gimp-ruler-h {
            position: absolute;
            top: -20px;
            left: 0;
            right: 0;
            height: 20px;
            background: #E9E7E3;
            border-bottom: 1px solid #9B9388;
          }

          .gimp-ruler-v {
            position: absolute;
            left: -20px;
            top: 0;
            bottom: 0;
            width: 20px;
            background: #E9E7E3;
            border-right: 1px solid #9B9388;
          }

          .gimp-canvas {
            width: 640px;
            height: 480px;
            background: white;
            position: relative;
          }

          .gimp-canvas-checker {
            width: 100%;
            height: 100%;
            background-image:
              linear-gradient(45deg, #EEEEEE 25%, transparent 25%),
              linear-gradient(-45deg, #EEEEEE 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #EEEEEE 75%),
              linear-gradient(-45deg, transparent 75%, #EEEEEE 75%);
            background-size: 20px 20px;
            background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
          }
        </style>
      `;
    }

    renderLayersDock() {
      return `
        <div class="gimp-layers-dock">
          <!-- Tabs -->
          <div class="gimp-dock-tabs">
            <button class="gimp-dock-tab active">Layers</button>
            <button class="gimp-dock-tab">Channels</button>
            <button class="gimp-dock-tab">Paths</button>
          </div>

          <!-- Layers Content -->
          <div class="gimp-layers-content">
            <!-- Layer Modes -->
            <div class="gimp-layer-controls">
              <select class="gimp-layer-mode">
                <option>Normal</option>
                <option>Dissolve</option>
                <option>Multiply</option>
                <option>Screen</option>
                <option>Overlay</option>
              </select>
              <div class="gimp-opacity-control">
                <label>Opacity:</label>
                <input type="range" min="0" max="100" value="100">
                <span>100</span>
              </div>
            </div>

            <!-- Layers List -->
            <div class="gimp-layers-list">
              <div class="gimp-layer active">
                <div class="gimp-layer-preview">
                  <div style="width: 100%; height: 100%; background: white;"></div>
                </div>
                <div class="gimp-layer-name">Background</div>
              </div>
            </div>

            <!-- Layer Actions -->
            <div class="gimp-layer-actions">
              <button class="gimp-layer-action" title="New Layer">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="2" y="2" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"/>
                  <path d="M8 5v6M5 8h6" stroke="currentColor" stroke-width="1.5"/>
                </svg>
              </button>
              <button class="gimp-layer-action" title="Duplicate Layer">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="2" y="2" width="10" height="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
                  <rect x="4" y="4" width="10" height="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
                </svg>
              </button>
              <button class="gimp-layer-action" title="Anchor Layer">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2v12M4 10l4 4 4-4"/>
                </svg>
              </button>
              <button class="gimp-layer-action gimp-layer-action-danger" title="Delete Layer">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M5 2h6v2H5V2zM3 5h10l-1 9H4L3 5z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <style>
          .gimp-layers-dock {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: #E9E7E3;
            font-family: 'Ubuntu Sans', sans-serif;
          }

          .gimp-dock-tabs {
            display: flex;
            background: #D0CBC3;
            border-bottom: 1px solid #9B9388;
          }

          .gimp-dock-tab {
            flex: 1;
            padding: 6px 8px;
            background: #D0CBC3;
            border: none;
            border-right: 1px solid #9B9388;
            font-size: 9pt;
            cursor: pointer;
            transition: background-color 0.1s ease;
          }

          .gimp-dock-tab:last-child {
            border-right: none;
          }

          .gimp-dock-tab:hover {
            background: #C5C0B8;
          }

          .gimp-dock-tab.active {
            background: #E9E7E3;
            font-weight: 600;
          }

          .gimp-layers-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 8px;
          }

          .gimp-layer-controls {
            margin-bottom: 8px;
          }

          .gimp-layer-mode {
            width: 100%;
            padding: 4px 8px;
            background: white;
            border: 1px solid #9B9388;
            border-radius: 2px;
            font-size: 10pt;
            margin-bottom: 8px;
          }

          .gimp-opacity-control {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 9pt;
          }

          .gimp-opacity-control label {
            flex-shrink: 0;
          }

          .gimp-opacity-control input {
            flex: 1;
            height: 4px;
          }

          .gimp-opacity-control span {
            flex-shrink: 0;
            width: 32px;
            text-align: right;
          }

          .gimp-layers-list {
            flex: 1;
            background: white;
            border: 1px solid #9B9388;
            border-radius: 2px;
            overflow-y: auto;
            margin-bottom: 8px;
          }

          .gimp-layer {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px;
            border-bottom: 1px solid #E0E0E0;
            cursor: pointer;
            transition: background-color 0.1s ease;
          }

          .gimp-layer:hover {
            background: #F9F9F9;
          }

          .gimp-layer.active {
            background: #F07746;
            color: white;
          }

          .gimp-layer-preview {
            width: 40px;
            height: 32px;
            border: 1px solid #9B9388;
            flex-shrink: 0;
            background: repeating-conic-gradient(#CCCCCC 0% 25%, white 0% 50%) 50% / 10px 10px;
          }

          .gimp-layer-name {
            flex: 1;
            font-size: 10pt;
          }

          .gimp-layer-actions {
            display: flex;
            gap: 4px;
          }

          .gimp-layer-action {
            flex: 1;
            padding: 6px;
            background: white;
            border: 1px solid #9B9388;
            border-radius: 2px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.1s ease;
          }

          .gimp-layer-action:hover {
            border-color: #F07746;
            background: #FFF8F0;
          }

          .gimp-layer-action-danger:hover {
            border-color: #c62828;
            background: #ffebee;
          }
        </style>
      `;
    }
  }

  global.UbuntuGimp = UbuntuGimp;

})(typeof window !== 'undefined' ? window : global);
