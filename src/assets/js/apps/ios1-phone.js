/**
 * iOS 1.0 Phone App
 * Keypad, Contacts, Recents, Voicemail
 */

class iOS1PhoneApp {
  constructor() {
    this.container = null;
    this.currentTab = 'keypad';
    this.phoneNumber = '';
  }

  render() {
    this.container = document.getElementById('app-container');
    if (!this.container) return;

    this.container.hidden = false;
    this.container.innerHTML = this.getHTML();
    this.attachEventListeners();
  }

  getHTML() {
    return `
      <div class="app-navbar">
        <button class="app-navbar-button app-navbar-back" data-action="close">
          <svg width="12" height="12" fill="white"><path d="M10 1 L2 6 L10 11"/></svg>
          Back
        </button>
        <div class="app-navbar-title">Phone</div>
      </div>

      <div class="app-content">
        <div class="phone-display">
          <div id="phone-number-display" class="phone-number-display"></div>
        </div>

        <div class="phone-keypad">
          <div class="keypad-row">
            <button class="keypad-button" data-digit="1">
              <span class="digit">1</span>
              <span class="letters"></span>
            </button>
            <button class="keypad-button" data-digit="2">
              <span class="digit">2</span>
              <span class="letters">ABC</span>
            </button>
            <button class="keypad-button" data-digit="3">
              <span class="digit">3</span>
              <span class="letters">DEF</span>
            </button>
          </div>
          <div class="keypad-row">
            <button class="keypad-button" data-digit="4">
              <span class="digit">4</span>
              <span class="letters">GHI</span>
            </button>
            <button class="keypad-button" data-digit="5">
              <span class="digit">5</span>
              <span class="letters">JKL</span>
            </button>
            <button class="keypad-button" data-digit="6">
              <span class="digit">6</span>
              <span class="letters">MNO</span>
            </button>
          </div>
          <div class="keypad-row">
            <button class="keypad-button" data-digit="7">
              <span class="digit">7</span>
              <span class="letters">PQRS</span>
            </button>
            <button class="keypad-button" data-digit="8">
              <span class="digit">8</span>
              <span class="letters">TUV</span>
            </button>
            <button class="keypad-button" data-digit="9">
              <span class="digit">9</span>
              <span class="letters">WXYZ</span>
            </button>
          </div>
          <div class="keypad-row">
            <button class="keypad-button" data-digit="*">
              <span class="digit">*</span>
            </button>
            <button class="keypad-button" data-digit="0">
              <span class="digit">0</span>
              <span class="letters">+</span>
            </button>
            <button class="keypad-button" data-digit="#">
              <span class="digit">#</span>
            </button>
          </div>
          <div class="keypad-row keypad-actions">
            <button class="keypad-call-button">
              <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="app-toolbar">
        <button class="toolbar-button" data-tab="keypad">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <circle cx="6" cy="6" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="18" cy="6" r="2"/>
            <circle cx="6" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="18" cy="12" r="2"/>
            <circle cx="6" cy="18" r="2"/><circle cx="12" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>
          </svg>
          <span>Keypad</span>
        </button>
        <button class="toolbar-button" data-tab="contacts">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          <span>Contacts</span>
        </button>
        <button class="toolbar-button" data-tab="recents">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 3h-2v10l8.5 5.2 1-1.7-7.5-4.3z"/>
            <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" stroke-width="2"/>
          </svg>
          <span>Recents</span>
        </button>
        <button class="toolbar-button" data-tab="voicemail">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <circle cx="6" cy="12" r="4"/><circle cx="18" cy="12" r="4"/>
            <path d="M6 12 h12"/>
          </svg>
          <span>Voicemail</span>
        </button>
      </div>

      <style>
        .phone-display {
          padding: 40px 20px 20px;
          text-align: center;
        }
        .phone-number-display {
          font-size: 32px;
          font-weight: 300;
          color: #000;
          min-height: 40px;
        }
        .phone-keypad {
          padding: 20px;
        }
        .keypad-row {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 20px;
        }
        .keypad-button {
          width: 75px;
          height: 75px;
          border-radius: 50%;
          background: linear-gradient(to bottom, #f0f0f0, #d0d0d0);
          border: 1px solid #999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          transition: all 0.1s;
        }
        .keypad-button:active {
          transform: scale(0.95);
          background: linear-gradient(to bottom, #d0d0d0, #b0b0b0);
        }
        .keypad-button .digit {
          font-size: 32px;
          font-weight: 300;
          color: #000;
        }
        .keypad-button .letters {
          font-size: 10px;
          color: #666;
          margin-top: -5px;
        }
        .keypad-call-button {
          width: 75px;
          height: 75px;
          border-radius: 50%;
          background: linear-gradient(to bottom, #4CD964, #2ECC71);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(76, 217, 100, 0.4);
        }
        .keypad-call-button:active {
          transform: scale(0.95);
        }
        .keypad-actions {
          justify-content: center;
        }
      </style>
    `;
  }

  attachEventListeners() {
    const keypadButtons = this.container.querySelectorAll('.keypad-button[data-digit]');
    keypadButtons.forEach(button => {
      button.addEventListener('click', () => {
        const digit = button.dataset.digit;
        this.phoneNumber += digit;
        this.updateDisplay();
      });
    });

    const backButton = this.container.querySelector('[data-action="close"]');
    if (backButton) {
      backButton.addEventListener('click', () => this.close());
    }

    const callButton = this.container.querySelector('.keypad-call-button');
    if (callButton) {
      callButton.addEventListener('click', () => {
        alert('Calling ' + this.phoneNumber);
      });
    }
  }

  updateDisplay() {
    const display = document.getElementById('phone-number-display');
    if (display) {
      display.textContent = this.phoneNumber || '';
    }
  }

  close() {
    if (this.container) {
      this.container.classList.add('closing');
      setTimeout(() => {
        this.container.hidden = true;
        this.container.classList.remove('closing');
        this.container.innerHTML = '';
        this.phoneNumber = '';
      }, 300);
    }
  }
}

// Listen for app launch events
document.addEventListener('ios1:launchApp', (e) => {
  if (e.detail.appId === 'phone') {
    const app = new iOS1PhoneApp();
    app.render();
  }
});

document.addEventListener('ios1:closeApp', () => {
  const container = document.getElementById('app-container');
  if (container && !container.hidden) {
    container.classList.add('closing');
    setTimeout(() => {
      container.hidden = true;
      container.classList.remove('closing');
      container.innerHTML = '';
    }, 300);
  }
});
