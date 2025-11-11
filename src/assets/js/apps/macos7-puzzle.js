/**
 * Mac OS System 7 Puzzle Game
 * Classic 15-puzzle sliding tile game
 */

(function(global) {
  'use strict';

  /**
   * Mac OS 7 Puzzle Application
   */
  class MacOS7Puzzle {
    constructor(desktop) {
      this.desktop = desktop;
      this.window = null;
      this.tiles = [];
      this.emptyPos = { row: 3, col: 3 };
      this.moves = 0;
    }

    /**
     * Open Puzzle game
     */
    open() {
      if (this.window) {
        this.window.focus();
        return;
      }

      const content = this._buildContent();

      this.window = this.desktop.createAppWindow({
        id: 'puzzle-game',
        title: 'Puzzle',
        content: content,
        width: 280,
        height: 340,
        resizable: false,
        onClose: () => {
          this.window = null;
          return true;
        }
      });

      this._initGame();
      this._attachEventListeners();
    }

    /**
     * Initialize game
     * @private
     */
    _initGame() {
      // Create ordered tiles (1-15)
      this.tiles = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 0]
      ];
      this.emptyPos = { row: 3, col: 3 };
      this.moves = 0;
      this._renderBoard();
    }

    /**
     * Build Puzzle content
     * @private
     */
    _buildContent() {
      return `
        <div style="padding: 12px; display: flex; flex-direction: column; height: 100%;">
          <!-- Info bar -->
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-family: var(--mac7-geneva); font-size: 11px;">
            <div>Moves: <span id="move-count">0</span></div>
            <button id="shuffle-btn" class="mac-button">Shuffle</button>
          </div>

          <!-- Puzzle board -->
          <div id="puzzle-board" style="width: 256px; height: 256px; border: 1px solid var(--mac7-black); background: var(--mac7-light-gray); position: relative; margin: 0 auto;">
            <!-- Tiles will be generated here -->
          </div>

          <!-- Win message -->
          <div id="win-message" style="display: none; margin-top: 12px; text-align: center; font-family: var(--mac7-geneva); font-size: 12px; font-weight: bold; color: #0000cc;">
            You solved it!
          </div>
        </div>
      `;
    }

    /**
     * Render game board
     * @private
     */
    _renderBoard() {
      if (!this.window) return;

      const board = this.window.element.querySelector('#puzzle-board');
      if (!board) return;

      board.innerHTML = '';

      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          const tileNum = this.tiles[row][col];

          if (tileNum === 0) continue; // Empty space

          const tile = document.createElement('button');
          tile.className = 'puzzle-tile';
          tile.textContent = tileNum;
          tile.dataset.row = row;
          tile.dataset.col = col;
          tile.style.cssText = `
            position: absolute;
            left: ${col * 64}px;
            top: ${row * 64}px;
            width: 64px;
            height: 64px;
            border: 1px solid var(--mac7-black);
            background: var(--mac7-white);
            font-family: var(--mac7-chicago);
            font-size: 24px;
            font-weight: bold;
            cursor: default;
            transition: all 0.15s ease;
          `;

          tile.addEventListener('click', () => this._moveTile(row, col));

          // Hover effect
          tile.addEventListener('mouseenter', () => {
            if (this._canMove(row, col)) {
              tile.style.background = 'var(--mac7-gray)';
            }
          });
          tile.addEventListener('mouseleave', () => {
            tile.style.background = 'var(--mac7-white)';
          });

          board.appendChild(tile);
        }
      }

      // Update move count
      const moveCount = this.window.element.querySelector('#move-count');
      if (moveCount) {
        moveCount.textContent = this.moves;
      }
    }

    /**
     * Check if tile can move
     * @param {number} row - Tile row
     * @param {number} col - Tile column
     * @private
     */
    _canMove(row, col) {
      const { row: emptyRow, col: emptyCol } = this.emptyPos;

      // Check if adjacent to empty space
      return (
        (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
        (col === emptyCol && Math.abs(row - emptyRow) === 1)
      );
    }

    /**
     * Move tile
     * @param {number} row - Tile row
     * @param {number} col - Tile column
     * @private
     */
    _moveTile(row, col) {
      if (!this._canMove(row, col)) return;

      const { row: emptyRow, col: emptyCol } = this.emptyPos;

      // Swap tile with empty space
      this.tiles[emptyRow][emptyCol] = this.tiles[row][col];
      this.tiles[row][col] = 0;
      this.emptyPos = { row, col };

      this.moves++;
      this._renderBoard();

      // Check win condition
      if (this._checkWin()) {
        setTimeout(() => this._showWin(), 200);
      }
    }

    /**
     * Shuffle puzzle
     * @private
     */
    _shuffle() {
      // Random moves to shuffle (ensures solvable)
      for (let i = 0; i < 100; i++) {
        const validMoves = this._getValidMoves();
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];

        // Move without counting
        const { row: emptyRow, col: emptyCol } = this.emptyPos;
        this.tiles[emptyRow][emptyCol] = this.tiles[randomMove.row][randomMove.col];
        this.tiles[randomMove.row][randomMove.col] = 0;
        this.emptyPos = randomMove;
      }

      this.moves = 0;
      this._renderBoard();

      // Hide win message
      const winMsg = this.window.element.querySelector('#win-message');
      if (winMsg) {
        winMsg.style.display = 'none';
      }
    }

    /**
     * Get valid moves
     * @private
     */
    _getValidMoves() {
      const { row, col } = this.emptyPos;
      const moves = [];

      if (row > 0) moves.push({ row: row - 1, col });
      if (row < 3) moves.push({ row: row + 1, col });
      if (col > 0) moves.push({ row, col: col - 1 });
      if (col < 3) moves.push({ row, col: col + 1 });

      return moves;
    }

    /**
     * Check win condition
     * @private
     */
    _checkWin() {
      let expected = 1;
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          if (row === 3 && col === 3) {
            return this.tiles[row][col] === 0;
          }
          if (this.tiles[row][col] !== expected) {
            return false;
          }
          expected++;
        }
      }
      return true;
    }

    /**
     * Show win message
     * @private
     */
    _showWin() {
      const winMsg = this.window.element.querySelector('#win-message');
      if (winMsg) {
        winMsg.style.display = 'block';
      }
      alert(`Congratulations! You solved the puzzle in ${this.moves} moves!`);
    }

    /**
     * Attach event listeners
     * @private
     */
    _attachEventListeners() {
      if (!this.window) return;

      const shuffleBtn = this.window.element.querySelector('#shuffle-btn');
      if (shuffleBtn) {
        shuffleBtn.addEventListener('click', () => this._shuffle());
      }

      // Keyboard controls
      this.window.element.addEventListener('keydown', (e) => {
        const { row, col } = this.emptyPos;
        let targetRow = row;
        let targetCol = col;

        switch(e.key) {
          case 'ArrowUp':
            if (row < 3) targetRow = row + 1;
            break;
          case 'ArrowDown':
            if (row > 0) targetRow = row - 1;
            break;
          case 'ArrowLeft':
            if (col < 3) targetCol = col + 1;
            break;
          case 'ArrowRight':
            if (col > 0) targetCol = col - 1;
            break;
          default:
            return;
        }

        if (targetRow !== row || targetCol !== col) {
          e.preventDefault();
          this._moveTile(targetRow, targetCol);
        }
      });
    }
  }

  // Export to global scope
  global.MacOS7Puzzle = MacOS7Puzzle;

})(typeof window !== 'undefined' ? window : global);
