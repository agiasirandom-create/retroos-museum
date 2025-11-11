/**
 * Windows 95 Paint
 * Classic MS Paint application with drawing tools
 */

(function(global) {
  'use strict';

  class Win95Paint {
    constructor(windowManager) {
      this.windowManager = windowManager;
      this.window = null;
      this.canvas = null;
      this.ctx = null;
      this.currentTool = 'pencil';
      this.currentColor = '#000000';
      this.isDrawing = false;
      this.lastX = 0;
      this.lastY = 0;
      this.startX = 0;
      this.startY = 0;

      // Color palette
      this.colors = [
        '#000000', '#808080', '#800000', '#FF0000',
        '#008000', '#00FF00', '#808000', '#FFFF00',
        '#000080', '#0000FF', '#800080', '#FF00FF',
        '#008080', '#00FFFF', '#C0C0C0', '#FFFFFF'
      ];
    }

    /**
     * Open Paint
     */
    open() {
      const windowContent = this.createContent();

      this.window = this.windowManager.createWindow({
        id: `paint-${Date.now()}`,
        title: 'Untitled - Paint',
        width: 800,
        height: 600,
        minWidth: 640,
        minHeight: 480,
        content: windowContent
      });

      // Get references
      this.canvas = this.window.element.querySelector('.paint-canvas');
      this.ctx = this.canvas.getContext('2d');

      // Initialize canvas
      this.initCanvas();

      // Set up event listeners
      this.setupEventListeners();
    }

    /**
     * Create window content
     */
    createContent() {
      return `
        <div class="paint-container" style="display: flex; flex-direction: column; height: 100%; background: #C0C0C0;">
          <!-- Menu Bar -->
          <div class="window-menubar" style="flex-shrink: 0;">
            <div class="menu-item">File</div>
            <div class="menu-item">Edit</div>
            <div class="menu-item">View</div>
            <div class="menu-item">Image</div>
            <div class="menu-item">Options</div>
            <div class="menu-item">Help</div>
          </div>

          <!-- Toolbox and Canvas Area -->
          <div style="display: flex; flex: 1; overflow: hidden; padding: 4px;">
            <!-- Toolbox -->
            <div class="paint-toolbox" style="
              width: 56px;
              background: #C0C0C0;
              border: 2px solid;
              border-color: #FFF #808080 #808080 #FFF;
              margin-right: 4px;
              padding: 4px;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 4px;
              align-content: start;
            ">
              ${this.createToolButtons()}
            </div>

            <!-- Canvas Area -->
            <div style="flex: 1; display: flex; flex-direction: column;">
              <!-- Canvas -->
              <div style="flex: 1; background: white; border: 2px solid;
                border-color: #808080 #FFF #FFF #808080;
                overflow: auto;
                position: relative;">
                <canvas class="paint-canvas" width="640" height="480" style="display: block; cursor: crosshair;"></canvas>
              </div>

              <!-- Color Palette -->
              <div class="paint-palette" style="
                margin-top: 4px;
                background: #C0C0C0;
                border: 2px solid;
                border-color: #FFF #808080 #808080 #FFF;
                padding: 4px;
                display: flex;
                gap: 4px;
                align-items: center;
              ">
                <div style="font-size: 11px; margin-right: 8px;">Colors:</div>
                <div class="paint-colors" style="display: grid; grid-template-columns: repeat(16, 20px); gap: 2px;">
                  ${this.createColorPalette()}
                </div>
                <div class="current-colors" style="margin-left: 16px; display: flex; gap: 4px;">
                  <div style="width: 32px; height: 32px; border: 2px solid #000; background: #000000;" class="current-color"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Status Bar -->
          <div class="paint-status-bar" style="
            height: 24px;
            background: #C0C0C0;
            border-top: 2px solid;
            border-color: #FFF #808080 #808080 #FFF;
            display: flex;
            align-items: center;
            padding: 0 8px;
            font-size: 11px;
          ">
            <span class="status-coords">For Help, click Help Topics on the Help Menu.</span>
          </div>
        </div>
      `;
    }

    /**
     * Create tool buttons
     */
    createToolButtons() {
      const tools = [
        { id: 'pencil', label: '✏️' },
        { id: 'brush', label: '🖌️' },
        { id: 'eraser', label: '⬜' },
        { id: 'fill', label: '🪣' },
        { id: 'text', label: 'A' },
        { id: 'line', label: '/' },
        { id: 'rectangle', label: '▭' },
        { id: 'ellipse', label: '○' }
      ];

      return tools.map(tool => `
        <button class="paint-tool-btn" data-tool="${tool.id}" style="
          width: 22px;
          height: 22px;
          background: #C0C0C0;
          border: 2px solid;
          border-color: #FFF #808080 #808080 #FFF;
          cursor: pointer;
          font-size: 12px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        " title="${tool.id.charAt(0).toUpperCase() + tool.id.slice(1)}">
          ${tool.label}
        </button>
      `).join('');
    }

    /**
     * Create color palette
     */
    createColorPalette() {
      return this.colors.map(color => `
        <div class="paint-color-btn" data-color="${color}" style="
          width: 20px;
          height: 20px;
          background: ${color};
          border: 1px solid #000;
          cursor: pointer;
        "></div>
      `).join('');
    }

    /**
     * Initialize canvas
     */
    initCanvas() {
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.strokeStyle = this.currentColor;
      this.ctx.fillStyle = this.currentColor;
      this.ctx.lineWidth = 1;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
      // Tool buttons
      const toolButtons = this.window.element.querySelectorAll('.paint-tool-btn');
      toolButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.currentTool = btn.getAttribute('data-tool');

          // Update button states
          toolButtons.forEach(b => {
            b.style.borderColor = '#FFF #808080 #808080 #FFF';
          });
          btn.style.borderColor = '#808080 #FFF #FFF #808080';
        });
      });

      // Color buttons
      const colorButtons = this.window.element.querySelectorAll('.paint-color-btn');
      colorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.currentColor = btn.getAttribute('data-color');
          this.ctx.strokeStyle = this.currentColor;
          this.ctx.fillStyle = this.currentColor;

          // Update current color display
          const currentColorDiv = this.window.element.querySelector('.current-color');
          currentColorDiv.style.background = this.currentColor;
        });
      });

      // Canvas drawing
      this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
      this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
      this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
      this.canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));

      // Set default tool
      toolButtons[0].click();
    }

    /**
     * Handle mouse down
     */
    handleMouseDown(e) {
      const rect = this.canvas.getBoundingClientRect();
      this.startX = e.clientX - rect.left;
      this.startY = e.clientY - rect.top;
      this.lastX = this.startX;
      this.lastY = this.startY;
      this.isDrawing = true;

      // Store canvas state for shape tools
      if (['line', 'rectangle', 'ellipse'].includes(this.currentTool)) {
        this.canvasState = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      }

      if (this.currentTool === 'fill') {
        this.floodFill(this.startX, this.startY);
      }
    }

    /**
     * Handle mouse move
     */
    handleMouseMove(e) {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update status bar
      const statusCoords = this.window.element.querySelector('.status-coords');
      statusCoords.textContent = `${Math.floor(x)}, ${Math.floor(y)}`;

      if (!this.isDrawing) return;

      switch (this.currentTool) {
        case 'pencil':
          this.drawPencil(x, y);
          break;
        case 'brush':
          this.drawBrush(x, y);
          break;
        case 'eraser':
          this.drawEraser(x, y);
          break;
        case 'line':
          this.drawLine(x, y);
          break;
        case 'rectangle':
          this.drawRectangle(x, y);
          break;
        case 'ellipse':
          this.drawEllipse(x, y);
          break;
      }
    }

    /**
     * Handle mouse up
     */
    handleMouseUp(e) {
      this.isDrawing = false;
    }

    /**
     * Draw with pencil
     */
    drawPencil(x, y) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      this.lastX = x;
      this.lastY = y;
    }

    /**
     * Draw with brush
     */
    drawBrush(x, y) {
      this.ctx.lineWidth = 5;
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      this.lastX = x;
      this.lastY = y;
      this.ctx.lineWidth = 1;
    }

    /**
     * Draw with eraser
     */
    drawEraser(x, y) {
      const oldStyle = this.ctx.strokeStyle;
      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.lineWidth = 10;
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      this.lastX = x;
      this.lastY = y;
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = oldStyle;
    }

    /**
     * Draw line
     */
    drawLine(x, y) {
      this.ctx.putImageData(this.canvasState, 0, 0);
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    }

    /**
     * Draw rectangle
     */
    drawRectangle(x, y) {
      this.ctx.putImageData(this.canvasState, 0, 0);
      const width = x - this.startX;
      const height = y - this.startY;
      this.ctx.strokeRect(this.startX, this.startY, width, height);
    }

    /**
     * Draw ellipse
     */
    drawEllipse(x, y) {
      this.ctx.putImageData(this.canvasState, 0, 0);
      const radiusX = Math.abs(x - this.startX) / 2;
      const radiusY = Math.abs(y - this.startY) / 2;
      const centerX = this.startX + (x - this.startX) / 2;
      const centerY = this.startY + (y - this.startY) / 2;

      this.ctx.beginPath();
      this.ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      this.ctx.stroke();
    }

    /**
     * Flood fill (simplified version)
     */
    floodFill(x, y) {
      // Simplified fill - just fills a small area for demo purposes
      this.ctx.fillRect(Math.floor(x / 10) * 10, Math.floor(y / 10) * 10, 10, 10);
    }
  }

  // Export to global scope
  global.Win95Paint = Win95Paint;

})(typeof window !== 'undefined' ? window : global);
