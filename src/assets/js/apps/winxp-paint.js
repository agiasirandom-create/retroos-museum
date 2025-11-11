/**
 * Windows XP Paint
 * Classic paint application with Luna theme
 */

(function(global) {
  'use strict';

  class WinXPPaint {
    constructor(desktop) {
      this.desktop = desktop;
      this.window = null;
      this.canvas = null;
      this.ctx = null;
      this.drawing = false;
      this.currentTool = 'pencil';
      this.currentColor = '#000000';
      this.lineWidth = 2;
    }

    /**
     * Open Paint window
     */
    open() {
      const windowContent = this.buildContent();

      this.window = this.desktop.windowManager.createWindow({
        id: `paint-${Date.now()}`,
        title: 'untitled - Paint',
        content: windowContent,
        width: 800,
        height: 600,
        minWidth: 600,
        minHeight: 400,
        resizable: true,
        minimizable: true,
        maximizable: true
      });

      this.setupCanvas();
      this.setupEventListeners();
    }

    /**
     * Build window content
     */
    buildContent() {
      return `
        <div class="paint-container" style="display: flex; flex-direction: column; height: 100%; font-family: Tahoma, Arial, sans-serif; font-size: 11px; background: #ECE9D8;">
          <!-- Menu Bar -->
          <div class="paint-menubar" style="display: flex; background: linear-gradient(to bottom, #ECE9D8 0%, #D6D3CE 100%); border-bottom: 1px solid #ACA899; padding: 2px 4px;">
            <button class="paint-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">File</button>
            <button class="paint-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">Edit</button>
            <button class="paint-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">View</button>
            <button class="paint-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">Image</button>
            <button class="paint-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">Colors</button>
            <button class="paint-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px;">Help</button>
          </div>

          <!-- Toolbox -->
          <div class="paint-toolbar" style="display: flex; gap: 4px; background: #ECE9D8; border-bottom: 1px solid #ACA899; padding: 4px 8px;">
            <button class="tool-btn active" data-tool="pencil" title="Pencil" style="width: 32px; height: 32px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 2px solid #0054E3; border-radius: 3px; cursor: pointer; display: flex; align-items: center; justify-content: center;">✏️</button>
            <button class="tool-btn" data-tool="brush" title="Brush" style="width: 32px; height: 32px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer; display: flex; align-items: center; justify-content: center;">🖌️</button>
            <button class="tool-btn" data-tool="eraser" title="Eraser" style="width: 32px; height: 32px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer; display: flex; align-items: center; justify-content: center;">🧹</button>
            <button class="tool-btn" data-tool="fill" title="Fill" style="width: 32px; height: 32px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer; display: flex; align-items: center; justify-content: center;">🪣</button>
            <button class="tool-btn" data-tool="text" title="Text" style="width: 32px; height: 32px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer; display: flex; align-items: center; justify-content: center;">A</button>
            <button class="tool-btn" data-tool="line" title="Line" style="width: 32px; height: 32px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer; display: flex; align-items: center; justify-content: center;">/</button>
            <button class="tool-btn" data-tool="rectangle" title="Rectangle" style="width: 32px; height: 32px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer; display: flex; align-items: center; justify-content: center;">▭</button>
            <button class="tool-btn" data-tool="circle" title="Circle" style="width: 32px; height: 32px; background: linear-gradient(to bottom, #FFFFFF 0%, #ECE9D8 100%); border: 1px solid #ACA899; border-radius: 3px; cursor: pointer; display: flex; align-items: center; justify-content: center;">○</button>
            <div style="width: 1px; height: 32px; background: #ACA899; margin: 0 4px;"></div>
            <input type="color" id="color-picker" value="#000000" title="Color" style="width: 32px; height: 32px; border: 1px solid #ACA899; cursor: pointer;">
            <input type="range" id="line-width" min="1" max="20" value="2" title="Line Width" style="width: 100px;">
          </div>

          <!-- Canvas Area -->
          <div class="paint-canvas-container" style="flex: 1; overflow: auto; background: #808080; padding: 8px;">
            <canvas id="paint-canvas" width="600" height="400" style="background: white; display: block; box-shadow: 0 0 0 1px #000; cursor: crosshair;"></canvas>
          </div>

          <!-- Color Palette -->
          <div class="paint-palette" style="display: flex; gap: 2px; background: #ECE9D8; border-top: 1px solid #ACA899; padding: 4px 8px; flex-wrap: wrap;">
            ${this.buildColorPalette()}
          </div>

          <!-- Status Bar -->
          <div class="paint-statusbar" style="background: #ECE9D8; border-top: 1px solid #ACA899; padding: 4px 8px; display: flex; justify-content: space-between;">
            <span id="paint-coords">For Help, click Help Topics on the Help Menu.</span>
            <span id="paint-dimensions">600 x 400px</span>
          </div>
        </div>
      `;
    }

    /**
     * Build color palette
     */
    buildColorPalette() {
      const colors = [
        '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
        '#808000', '#FFFFFF', '#C0C0C0', '#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF',
        '#FF00FF', '#FFFF80', '#80FFFF', '#FF8080'
      ];

      return colors.map(color =>
        `<button class="palette-color" data-color="${color}" style="width: 20px; height: 20px; background: ${color}; border: 1px solid #000; cursor: pointer;"></button>`
      ).join('');
    }

    /**
     * Setup canvas
     */
    setupCanvas() {
      this.canvas = this.window.element.querySelector('#paint-canvas');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.strokeStyle = this.currentColor;
      this.ctx.lineWidth = this.lineWidth;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
      // Canvas drawing events
      this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
      this.canvas.addEventListener('mousemove', (e) => this.draw(e));
      this.canvas.addEventListener('mouseup', () => this.stopDrawing());
      this.canvas.addEventListener('mouseout', () => this.stopDrawing());

      // Tool buttons
      const toolButtons = this.window.element.querySelectorAll('.tool-btn');
      toolButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          toolButtons.forEach(b => {
            b.style.border = '1px solid #ACA899';
            b.classList.remove('active');
          });
          btn.style.border = '2px solid #0054E3';
          btn.classList.add('active');
          this.currentTool = btn.dataset.tool;
        });
      });

      // Color picker
      const colorPicker = this.window.element.querySelector('#color-picker');
      if (colorPicker) {
        colorPicker.addEventListener('change', (e) => {
          this.currentColor = e.target.value;
          this.ctx.strokeStyle = this.currentColor;
          this.ctx.fillStyle = this.currentColor;
        });
      }

      // Line width
      const lineWidth = this.window.element.querySelector('#line-width');
      if (lineWidth) {
        lineWidth.addEventListener('input', (e) => {
          this.lineWidth = e.target.value;
          this.ctx.lineWidth = this.lineWidth;
        });
      }

      // Palette colors
      const paletteColors = this.window.element.querySelectorAll('.palette-color');
      paletteColors.forEach(btn => {
        btn.addEventListener('click', (e) => {
          this.currentColor = btn.dataset.color;
          this.ctx.strokeStyle = this.currentColor;
          this.ctx.fillStyle = this.currentColor;
          colorPicker.value = this.currentColor;
        });
      });

      // Menu buttons
      const menuButtons = this.window.element.querySelectorAll('.paint-menu-btn');
      menuButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
          btn.style.background = 'linear-gradient(to bottom, #4B91FF 0%, #3C81F3 100%)';
          btn.style.color = 'white';
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.background = 'transparent';
          btn.style.color = 'inherit';
        });

        btn.addEventListener('click', () => {
          this.handleMenuClick(btn.textContent.trim());
        });
      });

      // Cursor position tracking
      this.canvas.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);
        const coords = this.window.element.querySelector('#paint-coords');
        if (coords) {
          coords.textContent = `${x}, ${y}`;
        }
      });
    }

    /**
     * Start drawing
     */
    startDrawing(e) {
      this.drawing = true;
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (this.currentTool === 'fill') {
        this.fillArea(x, y);
      } else if (this.currentTool === 'eraser') {
        this.ctx.globalCompositeOperation = 'destination-out';
      } else {
        this.ctx.globalCompositeOperation = 'source-over';
      }

      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
    }

    /**
     * Draw on canvas
     */
    draw(e) {
      if (!this.drawing) return;

      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (this.currentTool === 'pencil' || this.currentTool === 'brush' || this.currentTool === 'eraser') {
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
      }
    }

    /**
     * Stop drawing
     */
    stopDrawing() {
      if (this.drawing) {
        this.drawing = false;
        this.ctx.closePath();
        this.ctx.globalCompositeOperation = 'source-over';
      }
    }

    /**
     * Fill area (simplified)
     */
    fillArea(x, y) {
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Handle menu click
     */
    handleMenuClick(menu) {
      switch(menu) {
        case 'File':
          alert('File menu - New, Open, Save, Save As...');
          break;
        case 'Edit':
          alert('Edit menu - Undo, Redo, Cut, Copy, Paste...');
          break;
        case 'View':
          alert('View menu - Zoom, View Bitmap...');
          break;
        case 'Image':
          alert('Image menu - Flip/Rotate, Stretch/Skew, Invert Colors...');
          break;
        case 'Colors':
          alert('Colors menu - Edit Colors...');
          break;
        case 'Help':
          alert('Paint Help\n\nWindows XP Paint Recreation\nRetroOS Museum Project');
          break;
      }
    }
  }

  // Export to global scope
  global.WinXPPaint = WinXPPaint;

})(typeof window !== 'undefined' ? window : global);
