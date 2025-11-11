/**
 * Windows 95 Solitaire
 * Classic Klondike Solitaire card game
 */

(function(global) {
  'use strict';

  class Win95Solitaire {
    constructor(windowManager) {
      this.windowManager = windowManager;
      this.window = null;
      this.deck = [];
      this.stock = [];
      this.waste = [];
      this.foundations = [[], [], [], []];
      this.tableau = [[], [], [], [], [], [], []];
      this.score = 0;
      this.draggedCard = null;
      this.draggedFrom = null;
    }

    /**
     * Open Solitaire
     */
    open() {
      const windowContent = this.createContent();

      this.window = this.windowManager.createWindow({
        id: `solitaire-${Date.now()}`,
        title: 'Solitaire',
        width: 640,
        height: 480,
        minWidth: 640,
        minHeight: 480,
        content: windowContent
      });

      this.initGame();
      this.setupEventListeners();
    }

    /**
     * Create window content
     */
    createContent() {
      return `
        <div class="solitaire-container" style="
          background: #008000;
          padding: 16px;
          font-family: 'MS Sans Serif', sans-serif;
          height: 100%;
          display: flex;
          flex-direction: column;
        ">
          <!-- Menu Bar -->
          <div class="window-menubar" style="flex-shrink: 0; background: #C0C0C0; margin: -16px -16px 16px -16px;">
            <div class="menu-item">Game</div>
            <div class="menu-item">Help</div>
          </div>

          <!-- Score -->
          <div style="color: white; margin-bottom: 16px; font-size: 11px;">
            Score: <span class="solitaire-score">0</span>
          </div>

          <!-- Top Row: Stock, Waste, and Foundations -->
          <div style="display: flex; gap: 8px; margin-bottom: 24px;">
            <!-- Stock -->
            <div class="card-slot stock-slot" data-slot="stock" style="
              width: 71px;
              height: 96px;
              border: 2px solid #FFF;
              border-radius: 4px;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
            ">
              <div style="font-size: 32px;">🂠</div>
            </div>

            <!-- Waste -->
            <div class="card-slot waste-slot" data-slot="waste" style="
              width: 71px;
              height: 96px;
              border: 2px dashed rgba(255,255,255,0.3);
              border-radius: 4px;
              position: relative;
            "></div>

            <!-- Spacer -->
            <div style="flex: 1;"></div>

            <!-- Foundations -->
            ${[0, 1, 2, 3].map(i => `
              <div class="card-slot foundation-slot" data-slot="foundation-${i}" style="
                width: 71px;
                height: 96px;
                border: 2px dashed rgba(255,255,255,0.3);
                border-radius: 4px;
                position: relative;
              "></div>
            `).join('')}
          </div>

          <!-- Tableau (7 columns) -->
          <div style="display: flex; gap: 8px; flex: 1;">
            ${[0, 1, 2, 3, 4, 5, 6].map(i => `
              <div class="card-slot tableau-slot" data-slot="tableau-${i}" style="
                width: 71px;
                min-height: 96px;
                border: 2px dashed rgba(255,255,255,0.3);
                border-radius: 4px;
                position: relative;
              "></div>
            `).join('')}
          </div>
        </div>
      `;
    }

    /**
     * Initialize game
     */
    initGame() {
      // Create deck
      this.deck = [];
      const suits = ['♠', '♥', '♦', '♣'];
      const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

      for (let suit of suits) {
        for (let rank of ranks) {
          this.deck.push({
            suit: suit,
            rank: rank,
            value: ranks.indexOf(rank) + 1,
            color: (suit === '♥' || suit === '♦') ? 'red' : 'black',
            faceUp: false
          });
        }
      }

      // Shuffle deck
      for (let i = this.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
      }

      // Deal cards to tableau
      this.tableau = [[], [], [], [], [], [], []];
      for (let col = 0; col < 7; col++) {
        for (let row = 0; row <= col; row++) {
          const card = this.deck.pop();
          if (row === col) {
            card.faceUp = true;
          }
          this.tableau[col].push(card);
        }
      }

      // Remaining cards go to stock
      this.stock = this.deck;
      this.waste = [];
      this.foundations = [[], [], [], []];
      this.score = 0;

      this.render();
    }

    /**
     * Render the game
     */
    render() {
      // Update score
      const scoreElement = this.window.element.querySelector('.solitaire-score');
      if (scoreElement) {
        scoreElement.textContent = this.score;
      }

      // Render stock
      const stockSlot = this.window.element.querySelector('[data-slot="stock"]');
      if (this.stock.length > 0) {
        stockSlot.innerHTML = '<div style="font-size: 32px;">🂠</div>';
      } else {
        stockSlot.innerHTML = '<div style="font-size: 24px; opacity: 0.3;">↻</div>';
      }

      // Render waste
      const wasteSlot = this.window.element.querySelector('[data-slot="waste"]');
      wasteSlot.innerHTML = '';
      if (this.waste.length > 0) {
        const topCard = this.waste[this.waste.length - 1];
        wasteSlot.appendChild(this.createCardElement(topCard));
      }

      // Render foundations
      for (let i = 0; i < 4; i++) {
        const foundationSlot = this.window.element.querySelector(`[data-slot="foundation-${i}"]`);
        foundationSlot.innerHTML = '';
        if (this.foundations[i].length > 0) {
          const topCard = this.foundations[i][this.foundations[i].length - 1];
          foundationSlot.appendChild(this.createCardElement(topCard));
        }
      }

      // Render tableau
      for (let i = 0; i < 7; i++) {
        const tableauSlot = this.window.element.querySelector(`[data-slot="tableau-${i}"]`);
        tableauSlot.innerHTML = '';
        this.tableau[i].forEach((card, index) => {
          const cardElement = this.createCardElement(card);
          cardElement.style.position = 'absolute';
          cardElement.style.top = `${index * 20}px`;
          tableauSlot.appendChild(cardElement);
        });
      }
    }

    /**
     * Create card element
     */
    createCardElement(card) {
      const cardDiv = document.createElement('div');
      cardDiv.className = 'playing-card';
      cardDiv.style.cssText = `
        width: 71px;
        height: 96px;
        background: ${card.faceUp ? 'white' : '#0066CC'};
        border: 1px solid #000;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${card.rank === '10' ? '20px' : '24px'};
        font-weight: bold;
        color: ${card.faceUp ? card.color : 'white'};
        cursor: ${card.faceUp ? 'pointer' : 'default'};
        user-select: none;
        box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      `;

      if (card.faceUp) {
        cardDiv.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div>${card.rank}</div>
            <div style="font-size: 20px;">${card.suit}</div>
          </div>
        `;
      } else {
        cardDiv.innerHTML = `<div style="font-size: 32px;">🂠</div>`;
      }

      return cardDiv;
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
      // Stock click - draw card
      const stockSlot = this.window.element.querySelector('[data-slot="stock"]');
      stockSlot.addEventListener('click', () => {
        if (this.stock.length > 0) {
          const card = this.stock.pop();
          card.faceUp = true;
          this.waste.push(card);
        } else {
          // Recycle waste back to stock
          while (this.waste.length > 0) {
            const card = this.waste.pop();
            card.faceUp = false;
            this.stock.push(card);
          }
        }
        this.render();
      });

      // Simple click-to-move (simplified version)
      this.window.element.addEventListener('click', (e) => {
        const card = e.target.closest('.playing-card');
        if (!card) return;

        // For demo purposes, just show a message
        // Full drag-and-drop would be more complex
      });

      // Menu items
      const menuItems = this.window.element.querySelectorAll('.menu-item');
      menuItems.forEach(item => {
        item.addEventListener('click', () => {
          if (item.textContent === 'Game') {
            const newGame = confirm('Start a new game?');
            if (newGame) {
              this.initGame();
            }
          }
        });
      });
    }

    /**
     * Check if move is valid
     */
    canMoveToTableau(card, targetPile) {
      if (targetPile.length === 0) {
        return card.value === 13; // Only King can go on empty tableau
      }

      const targetCard = targetPile[targetPile.length - 1];
      return targetCard.faceUp &&
             targetCard.color !== card.color &&
             targetCard.value === card.value + 1;
    }

    /**
     * Check if move to foundation is valid
     */
    canMoveToFoundation(card, foundation) {
      if (foundation.length === 0) {
        return card.value === 1; // Only Ace can start foundation
      }

      const topCard = foundation[foundation.length - 1];
      return card.suit === topCard.suit &&
             card.value === topCard.value + 1;
    }

    /**
     * Check for win
     */
    checkWin() {
      const allComplete = this.foundations.every(f => f.length === 13);
      if (allComplete) {
        setTimeout(() => {
          alert('Congratulations! You won!');
        }, 500);
      }
    }
  }

  // Export to global scope
  global.Win95Solitaire = Win95Solitaire;

})(typeof window !== 'undefined' ? window : global);
