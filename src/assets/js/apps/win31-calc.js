/**
 * Windows 3.1 Calculator
 * Standard calculator application
 */

(function(global) {
  'use strict';

  class Win31Calculator {
    constructor(desktop) {
      this.desktop = desktop;
      this.window = null;
      this.display = '0';
      this.currentValue = 0;
      this.operator = null;
      this.newNumber = true;
    }

    /**
     * Open Calculator
     */
    open() {
      const content = this.buildContent();

      this.window = this.desktop.windowManager.createWindow({
        id: 'calculator-' + Date.now(),
        title: 'Calculator',
        content: content,
        width: 240,
        height: 280,
        resizable: false,
        maximizable: false,
        onClose: () => {
          this.window = null;
        }
      });

      this.attachEventListeners();
    }

    /**
     * Build Calculator content
     */
    buildContent() {
      return `
        <div class="calculator-container">
          <div class="calculator-display" id="calc-display">0</div>
          <div class="calculator-buttons">
            <button class="calc-button" data-action="clear">C</button>
            <button class="calc-button" data-action="backspace">ê</button>
            <button class="calc-button" data-action="divide">/</button>
            <button class="calc-button" data-action="multiply">*</button>

            <button class="calc-button" data-number="7">7</button>
            <button class="calc-button" data-number="8">8</button>
            <button class="calc-button" data-number="9">9</button>
            <button class="calc-button" data-action="subtract">-</button>

            <button class="calc-button" data-number="4">4</button>
            <button class="calc-button" data-number="5">5</button>
            <button class="calc-button" data-number="6">6</button>
            <button class="calc-button" data-action="add">+</button>

            <button class="calc-button" data-number="1">1</button>
            <button class="calc-button" data-number="2">2</button>
            <button class="calc-button" data-number="3">3</button>
            <button class="calc-button" data-action="equals" style="grid-row: span 2;">=</button>

            <button class="calc-button" data-number="0" style="grid-column: span 2;">0</button>
            <button class="calc-button" data-action="decimal">.</button>
          </div>
        </div>
      `;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
      const windowEl = this.window.element;
      const displayEl = windowEl.querySelector('#calc-display');

      // Number buttons
      const numberButtons = windowEl.querySelectorAll('[data-number]');
      numberButtons.forEach(button => {
        button.addEventListener('click', () => {
          const num = button.dataset.number;
          if (this.newNumber) {
            this.display = num;
            this.newNumber = false;
          } else {
            if (this.display === '0') {
              this.display = num;
            } else {
              this.display += num;
            }
          }
          displayEl.textContent = this.display;
        });
      });

      // Action buttons
      const actionButtons = windowEl.querySelectorAll('[data-action]');
      actionButtons.forEach(button => {
        button.addEventListener('click', () => {
          const action = button.dataset.action;
          this.handleAction(action, displayEl);
        });
      });
    }

    /**
     * Handle calculator action
     */
    handleAction(action, displayEl) {
      switch (action) {
        case 'clear':
          this.display = '0';
          this.currentValue = 0;
          this.operator = null;
          this.newNumber = true;
          break;

        case 'backspace':
          if (this.display.length > 1) {
            this.display = this.display.slice(0, -1);
          } else {
            this.display = '0';
          }
          break;

        case 'decimal':
          if (!this.display.includes('.')) {
            this.display += '.';
          }
          break;

        case 'add':
        case 'subtract':
        case 'multiply':
        case 'divide':
          this.currentValue = parseFloat(this.display);
          this.operator = action;
          this.newNumber = true;
          break;

        case 'equals':
          if (this.operator) {
            const value = parseFloat(this.display);
            let result = 0;

            switch (this.operator) {
              case 'add':
                result = this.currentValue + value;
                break;
              case 'subtract':
                result = this.currentValue - value;
                break;
              case 'multiply':
                result = this.currentValue * value;
                break;
              case 'divide':
                result = value !== 0 ? this.currentValue / value : 'Error';
                break;
            }

            this.display = result.toString();
            this.operator = null;
            this.newNumber = true;
          }
          break;
      }

      displayEl.textContent = this.display;
    }
  }

  // Export to global scope
  global.Win31Calculator = Win31Calculator;

})(typeof window !== 'undefined' ? window : global);
