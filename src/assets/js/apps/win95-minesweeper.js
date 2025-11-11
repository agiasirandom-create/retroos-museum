/**
 * Windows 95 Minesweeper
 * Classic mine sweeping game
 */

(function(global) {
  'use strict';

  class Win95Minesweeper {
    constructor(windowManager) {
      this.windowManager = windowManager;
      this.window = null;
      this.gridSize = 8;
      this.mineCount = 10;
      this.grid = [];
      this.revealed = [];
      this.flagged = [];
      this.gameOver = false;
      this.gameWon = false;
      this.timer = 0;
      this.timerInterval = null;
      this.firstClick = true;
    }

    /**
     * Open Minesweeper
     */
    open() {
      const windowContent = this.createContent();

      this.window = this.windowManager.createWindow({
        id: `minesweeper-${Date.now()}`,
        title: 'Minesweeper',
        width: 320,
        height: 380,
        resizable: false,
        content: windowContent
      });

      // Initialize game
      this.initGame();
      this.setupEventListeners();
    }

    /**
     * Create window content
     */
    createContent() {
      return `
        <div class="minesweeper-container" style="
          background: #C0C0C0;
          padding: 8px;
          font-family: 'MS Sans Serif', sans-serif;
          height: 100%;
          display: flex;
          flex-direction: column;
        ">
          <!-- Menu Bar -->
          <div class="window-menubar" style="flex-shrink: 0;">
            <div class="menu-item">Game</div>
            <div class="menu-item">Help</div>
          </div>

          <!-- Top Panel -->
          <div style="
            background: #C0C0C0;
            border: 3px solid;
            border-color: #808080 #FFF #FFF #808080;
            padding: 8px;
            margin: 8px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <!-- Mine Counter -->
            <div class="mine-counter" style="
              background: #000;
              color: #FF0000;
              font-family: 'Courier New', monospace;
              font-size: 24px;
              font-weight: bold;
              padding: 4px 8px;
              border: 2px inset;
              min-width: 60px;
              text-align: center;
            ">010</div>

            <!-- Smiley Button -->
            <button class="smiley-btn" style="
              width: 40px;
              height: 40px;
              background: #C0C0C0;
              border: 2px solid;
              border-color: #FFF #808080 #808080 #FFF;
              font-size: 24px;
              cursor: pointer;
              padding: 0;
            ">🙂</button>

            <!-- Timer -->
            <div class="timer-display" style="
              background: #000;
              color: #FF0000;
              font-family: 'Courier New', monospace;
              font-size: 24px;
              font-weight: bold;
              padding: 4px 8px;
              border: 2px inset;
              min-width: 60px;
              text-align: center;
            ">000</div>
          </div>

          <!-- Game Grid -->
          <div class="mine-grid-container" style="
            border: 3px solid;
            border-color: #808080 #FFF #FFF #808080;
            padding: 8px;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div class="mine-grid" style="
              display: grid;
              grid-template-columns: repeat(8, 24px);
              grid-template-rows: repeat(8, 24px);
              gap: 0;
              background: #C0C0C0;
            "></div>
          </div>
        </div>
      `;
    }

    /**
     * Initialize game
     */
    initGame() {
      this.grid = [];
      this.revealed = [];
      this.flagged = [];
      this.gameOver = false;
      this.gameWon = false;
      this.timer = 0;
      this.firstClick = true;

      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }

      // Initialize grid
      for (let y = 0; y < this.gridSize; y++) {
        this.grid[y] = [];
        this.revealed[y] = [];
        this.flagged[y] = [];
        for (let x = 0; x < this.gridSize; x++) {
          this.grid[y][x] = 0;
          this.revealed[y][x] = false;
          this.flagged[y][x] = false;
        }
      }

      this.renderGrid();
      this.updateMineCounter();
      this.updateTimer();
    }

    /**
     * Place mines (after first click to ensure first click is always safe)
     */
    placeMines(firstX, firstY) {
      let minesPlaced = 0;
      while (minesPlaced < this.mineCount) {
        const x = Math.floor(Math.random() * this.gridSize);
        const y = Math.floor(Math.random() * this.gridSize);

        // Don't place mine on first click or if already a mine
        if ((x === firstX && y === firstY) || this.grid[y][x] === -1) {
          continue;
        }

        this.grid[y][x] = -1;
        minesPlaced++;
      }

      // Calculate numbers
      for (let y = 0; y < this.gridSize; y++) {
        for (let x = 0; x < this.gridSize; x++) {
          if (this.grid[y][x] !== -1) {
            this.grid[y][x] = this.countAdjacentMines(x, y);
          }
        }
      }
    }

    /**
     * Count adjacent mines
     */
    countAdjacentMines(x, y) {
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const newX = x + dx;
          const newY = y + dy;
          if (newX >= 0 && newX < this.gridSize && newY >= 0 && newY < this.gridSize) {
            if (this.grid[newY][newX] === -1) {
              count++;
            }
          }
        }
      }
      return count;
    }

    /**
     * Render grid
     */
    renderGrid() {
      const gridContainer = this.window.element.querySelector('.mine-grid');
      gridContainer.innerHTML = '';

      for (let y = 0; y < this.gridSize; y++) {
        for (let x = 0; x < this.gridSize; x++) {
          const cell = document.createElement('div');
          cell.className = 'mine-cell';
          cell.dataset.x = x;
          cell.dataset.y = y;
          cell.style.cssText = `
            width: 24px;
            height: 24px;
            background: #C0C0C0;
            border: 2px solid;
            border-color: #FFF #808080 #808080 #FFF;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
            user-select: none;
          `;

          if (this.revealed[y][x]) {
            this.revealCell(cell, x, y);
          } else if (this.flagged[y][x]) {
            cell.textContent = '🚩';
          }

          gridContainer.appendChild(cell);
        }
      }
    }

    /**
     * Reveal cell visually
     */
    revealCell(cell, x, y) {
      cell.style.borderColor = '#808080';
      cell.style.borderWidth = '1px';
      cell.style.background = '#BDBDBD';

      const value = this.grid[y][x];
      if (value === -1) {
        cell.textContent = '💣';
        if (this.gameOver) {
          cell.style.background = '#FF0000';
        }
      } else if (value > 0) {
        cell.textContent = value;
        const colors = ['', '#0000FF', '#008000', '#FF0000', '#000080', '#800000', '#008080', '#000000', '#808080'];
        cell.style.color = colors[value] || '#000';
      }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
      // Grid clicks
      const gridContainer = this.window.element.querySelector('.mine-grid');
      gridContainer.addEventListener('click', (e) => {
        if (this.gameOver || this.gameWon) return;
        const cell = e.target.closest('.mine-cell');
        if (!cell) return;

        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);

        this.handleCellClick(x, y);
      });

      // Right click for flags
      gridContainer.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (this.gameOver || this.gameWon) return;

        const cell = e.target.closest('.mine-cell');
        if (!cell) return;

        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);

        this.handleRightClick(x, y);
      });

      // Smiley button
      const smileyBtn = this.window.element.querySelector('.smiley-btn');
      smileyBtn.addEventListener('click', () => {
        this.initGame();
      });
    }

    /**
     * Handle cell click
     */
    handleCellClick(x, y) {
      if (this.revealed[y][x] || this.flagged[y][x]) return;

      // First click - place mines
      if (this.firstClick) {
        this.placeMines(x, y);
        this.firstClick = false;
        this.startTimer();
      }

      // Reveal cell
      this.revealed[y][x] = true;

      if (this.grid[y][x] === -1) {
        // Hit a mine
        this.gameOver = true;
        this.endGame(false);
      } else if (this.grid[y][x] === 0) {
        // Cascade reveal empty cells
        this.revealEmptyCells(x, y);
      }

      this.renderGrid();
      this.checkWin();
    }

    /**
     * Handle right click (flag)
     */
    handleRightClick(x, y) {
      if (this.revealed[y][x]) return;

      this.flagged[y][x] = !this.flagged[y][x];
      this.renderGrid();
      this.updateMineCounter();
    }

    /**
     * Reveal empty cells (cascade)
     */
    revealEmptyCells(x, y) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const newX = x + dx;
          const newY = y + dy;

          if (newX >= 0 && newX < this.gridSize && newY >= 0 && newY < this.gridSize) {
            if (!this.revealed[newY][newX] && !this.flagged[newY][newX]) {
              this.revealed[newY][newX] = true;

              if (this.grid[newY][newX] === 0) {
                this.revealEmptyCells(newX, newY);
              }
            }
          }
        }
      }
    }

    /**
     * Check for win condition
     */
    checkWin() {
      let revealedCount = 0;
      for (let y = 0; y < this.gridSize; y++) {
        for (let x = 0; x < this.gridSize; x++) {
          if (this.revealed[y][x]) {
            revealedCount++;
          }
        }
      }

      const totalCells = this.gridSize * this.gridSize;
      if (revealedCount === totalCells - this.mineCount) {
        this.gameWon = true;
        this.endGame(true);
      }
    }

    /**
     * End game
     */
    endGame(won) {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }

      const smileyBtn = this.window.element.querySelector('.smiley-btn');

      if (won) {
        smileyBtn.textContent = '😎';
        // Flag all mines
        for (let y = 0; y < this.gridSize; y++) {
          for (let x = 0; x < this.gridSize; x++) {
            if (this.grid[y][x] === -1) {
              this.flagged[y][x] = true;
            }
          }
        }
      } else {
        smileyBtn.textContent = '😵';
        // Reveal all mines
        for (let y = 0; y < this.gridSize; y++) {
          for (let x = 0; x < this.gridSize; x++) {
            if (this.grid[y][x] === -1) {
              this.revealed[y][x] = true;
            }
          }
        }
      }

      this.renderGrid();
    }

    /**
     * Start timer
     */
    startTimer() {
      this.timerInterval = setInterval(() => {
        this.timer++;
        this.updateTimer();
      }, 1000);
    }

    /**
     * Update timer display
     */
    updateTimer() {
      const timerDisplay = this.window.element.querySelector('.timer-display');
      timerDisplay.textContent = String(Math.min(this.timer, 999)).padStart(3, '0');
    }

    /**
     * Update mine counter
     */
    updateMineCounter() {
      let flaggedCount = 0;
      for (let y = 0; y < this.gridSize; y++) {
        for (let x = 0; x < this.gridSize; x++) {
          if (this.flagged[y][x]) {
            flaggedCount++;
          }
        }
      }

      const remaining = Math.max(0, this.mineCount - flaggedCount);
      const mineCounter = this.window.element.querySelector('.mine-counter');
      mineCounter.textContent = String(remaining).padStart(3, '0');
    }
  }

  // Export to global scope
  global.Win95Minesweeper = Win95Minesweeper;

})(typeof window !== 'undefined' ? window : global);
