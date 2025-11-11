/**
 * Windows 7 Calculator
 * Standard calculator
 */

class Win7Calculator {
  constructor(desktop) {
    this.desktop = desktop;
    this.display = '0';
    this.currentValue = 0;
    this.previousValue = 0;
    this.operation = null;
    this.newNumber = true;
  }

  /**
   * Render Calculator content
   * @returns {HTMLElement} - Content element
   */
  render() {
    const container = document.createElement('div');
    container.style.cssText = `
      display: flex;
      flex-direction: column;
      padding: 8px;
      background: #F0F0F0;
      height: 100%;
    `;

    // Menu bar
    const menuBar = document.createElement('div');
    menuBar.className = 'win7-menubar';

    const menus = ['View', 'Edit', 'Help'];
    menus.forEach(menu => {
      const menuItem = document.createElement('div');
      menuItem.className = 'win7-menu-item';
      menuItem.textContent = menu;
      menuBar.appendChild(menuItem);
    });

    container.appendChild(menuBar);

    // Display
    const display = document.createElement('div');
    display.style.cssText = `
      background: #FFFFFF;
      border: 1px solid #A0A0A0;
      padding: 12px 8px;
      text-align: right;
      font-size: 24px;
      font-family: 'Segoe UI', sans-serif;
      margin: 8px 0;
      min-height: 40px;
    `;
    display.textContent = this.display;
    container.appendChild(display);

    // Buttons grid
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 4px;
      flex: 1;
    `;

    const buttons = [
      ['MC', 'MR', 'MS', 'M+'],
      ['CE', 'C', '←', '÷'],
      ['7', '8', '9', '×'],
      ['4', '5', '6', '-'],
      ['1', '2', '3', '+'],
      ['±', '0', '.', '=']
    ];

    buttons.forEach(row => {
      row.forEach(btnText => {
        const button = document.createElement('button');
        button.textContent = btnText;
        button.style.cssText = `
          padding: 12px;
          font-size: 14px;
          font-weight: 600;
          border: 1px solid #A0A0A0;
          border-radius: 2px;
          background: linear-gradient(to bottom, #FFFFFF 0%, #F0F0F0 100%);
          cursor: pointer;
          transition: all 0.1s ease;
        `;

        button.addEventListener('mousedown', () => {
          button.style.background = '#E0E0E0';
        });

        button.addEventListener('mouseup', () => {
          button.style.background = 'linear-gradient(to bottom, #FFFFFF 0%, #F0F0F0 100%)';
        });

        button.addEventListener('click', () => {
          this.handleButton(btnText, display);
        });

        buttonsContainer.appendChild(button);
      });
    });

    container.appendChild(buttonsContainer);

    return container;
  }

  /**
   * Handle button click
   * @param {string} btnText - Button text
   * @param {HTMLElement} display - Display element
   */
  handleButton(btnText, display) {
    if (btnText >= '0' && btnText <= '9') {
      // Number button
      if (this.newNumber) {
        this.display = btnText;
        this.newNumber = false;
      } else {
        this.display = this.display === '0' ? btnText : this.display + btnText;
      }
    } else if (btnText === '.') {
      // Decimal point
      if (!this.display.includes('.')) {
        this.display += '.';
        this.newNumber = false;
      }
    } else if (btnText === 'C') {
      // Clear
      this.display = '0';
      this.currentValue = 0;
      this.previousValue = 0;
      this.operation = null;
      this.newNumber = true;
    } else if (btnText === 'CE') {
      // Clear entry
      this.display = '0';
      this.newNumber = true;
    } else if (btnText === '←') {
      // Backspace
      this.display = this.display.length > 1 ? this.display.slice(0, -1) : '0';
    } else if (btnText === '±') {
      // Toggle sign
      this.display = String(-parseFloat(this.display));
    } else if (['+', '-', '×', '÷'].includes(btnText)) {
      // Operation
      if (this.operation && !this.newNumber) {
        this.calculate();
      }
      this.previousValue = parseFloat(this.display);
      this.operation = btnText;
      this.newNumber = true;
    } else if (btnText === '=') {
      // Calculate
      this.calculate();
      this.operation = null;
    }

    display.textContent = this.display;
  }

  /**
   * Calculate result
   */
  calculate() {
    if (!this.operation) return;

    const current = parseFloat(this.display);
    let result = 0;

    switch (this.operation) {
      case '+':
        result = this.previousValue + current;
        break;
      case '-':
        result = this.previousValue - current;
        break;
      case '×':
        result = this.previousValue * current;
        break;
      case '÷':
        result = current !== 0 ? this.previousValue / current : 0;
        break;
    }

    this.display = String(result);
    this.currentValue = result;
    this.newNumber = true;
  }

  /**
   * Open Calculator window
   */
  open() {
    this.desktop.createWindow({
      title: 'Calculator',
      icon: '🔢',
      width: 350,
      height: 450,
      content: this.render(),
      appId: 'calculator'
    });
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Win7Calculator;
}
