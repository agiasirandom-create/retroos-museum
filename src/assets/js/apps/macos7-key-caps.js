/**
 * Mac OS System 7 Key Caps
 * Keyboard layout utility
 */

(function(global) {
  'use strict';

  /**
   * Mac OS 7 Key Caps Application
   */
  class MacOS7KeyCaps {
    constructor(desktop) {
      this.desktop = desktop;
      this.window = null;
      this.currentModifiers = { shift: false, option: false, command: false };
      this.lastPressedKey = '';
    }

    /**
     * Open Key Caps
     */
    open() {
      if (this.window) {
        this.window.focus();
        return;
      }

      const content = this._buildContent();

      this.window = this.desktop.createAppWindow({
        id: 'key-caps',
        title: 'Key Caps',
        content: content,
        width: 450,
        height: 220,
        resizable: false,
        onClose: () => {
          this.window = null;
          return true;
        }
      });

      this._attachEventListeners();
    }

    /**
     * Build Key Caps content
     * @private
     */
    _buildContent() {
      return `
        <div style="padding: 12px; font-family: var(--mac7-geneva);">
          <!-- Display area -->
          <div style="height: 40px; border: 1px solid var(--mac7-black); background: var(--mac7-white); margin-bottom: 12px; padding: 8px; font-family: var(--mac7-chicago); font-size: 18px; text-align: center; line-height: 24px;">
            <span id="key-display"></span>
          </div>

          <!-- Modifier keys -->
          <div style="margin-bottom: 12px; display: flex; gap: 8px; justify-content: center;">
            <label style="cursor: default;">
              <input type="checkbox" id="shift-mod" style="margin-right: 4px;">
              Shift
            </label>
            <label style="cursor: default;">
              <input type="checkbox" id="option-mod" style="margin-right: 4px;">
              Option
            </label>
            <label style="cursor: default;">
              <input type="checkbox" id="command-mod" style="margin-right: 4px;">
              Command
            </label>
          </div>

          <!-- Keyboard layout -->
          <div style="background: var(--mac7-light-gray); border: 1px solid var(--mac7-black); padding: 8px;">
            <!-- Number row -->
            <div style="display: flex; gap: 2px; margin-bottom: 2px; justify-content: center;">
              ${this._createKeyRow(['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='])}
            </div>
            <!-- QWERTY row -->
            <div style="display: flex; gap: 2px; margin-bottom: 2px; justify-content: center; padding-left: 20px;">
              ${this._createKeyRow(['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\\\'])}
            </div>
            <!-- ASDFGH row -->
            <div style="display: flex; gap: 2px; margin-bottom: 2px; justify-content: center; padding-left: 30px;">
              ${this._createKeyRow(['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'"])}
            </div>
            <!-- ZXCVBN row -->
            <div style="display: flex; gap: 2px; justify-content: center; padding-left: 40px;">
              ${this._createKeyRow(['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'])}
            </div>
          </div>

          <!-- Copy button -->
          <div style="margin-top: 12px; text-align: right;">
            <button class="mac-button" id="copy-char-btn">Copy Character</button>
          </div>
        </div>
      `;
    }

    /**
     * Create keyboard row
     * @param {string[]} keys - Keys in row
     * @private
     */
    _createKeyRow(keys) {
      return keys.map(key => `
        <button class="key-cap-btn" data-key="${key}"
                style="width: 26px; height: 26px; border: 1px solid var(--mac7-black); background: var(--mac7-white); cursor: default; font-family: var(--mac7-chicago); font-size: 10px; padding: 0;">
          ${key}
        </button>
      `).join('');
    }

    /**
     * Attach event listeners
     * @private
     */
    _attachEventListeners() {
      if (!this.window) return;

      const element = this.window.element;
      const displayArea = element.querySelector('#key-display');
      const shiftMod = element.querySelector('#shift-mod');
      const optionMod = element.querySelector('#option-mod');
      const commandMod = element.querySelector('#command-mod');
      const copyBtn = element.querySelector('#copy-char-btn');

      // Key clicks
      const keyButtons = element.querySelectorAll('.key-cap-btn');
      keyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const key = btn.dataset.key;
          let displayChar = key;

          // Apply modifiers
          if (this.currentModifiers.shift) {
            displayChar = this._getShiftedKey(key);
          }
          if (this.currentModifiers.option) {
            displayChar = this._getOptionKey(key);
          }

          this.lastPressedKey = displayChar;
          displayArea.textContent = displayChar;
        });
      });

      // Modifier checkboxes
      shiftMod.addEventListener('change', (e) => {
        this.currentModifiers.shift = e.target.checked;
      });

      optionMod.addEventListener('change', (e) => {
        this.currentModifiers.option = e.target.checked;
      });

      commandMod.addEventListener('change', (e) => {
        this.currentModifiers.command = e.target.checked;
      });

      // Copy button
      copyBtn.addEventListener('click', () => {
        if (this.lastPressedKey) {
          // In modern browsers
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(this.lastPressedKey);
            alert(`Copied: ${this.lastPressedKey}`);
          } else {
            alert(`Character: ${this.lastPressedKey}`);
          }
        }
      });

      // Real keyboard input
      element.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;

        const key = e.key;
        if (key.length === 1) {
          this.lastPressedKey = key;
          displayArea.textContent = key;
        }
      });
    }

    /**
     * Get shifted key
     * @param {string} key - Original key
     * @private
     */
    _getShiftedKey(key) {
      const shiftMap = {
        '`': '~', '1': '!', '2': '@', '3': '#', '4': '$', '5': '%',
        '6': '^', '7': '&', '8': '*', '9': '(', '0': ')', '-': '_', '=': '+',
        '[': '{', ']': '}', '\\': '|', ';': ':', "'": '"', ',': '<', '.': '>', '/': '?'
      };
      return shiftMap[key] || key.toUpperCase();
    }

    /**
     * Get option key (simplified)
     * @param {string} key - Original key
     * @private
     */
    _getOptionKey(key) {
      const optionMap = {
        'A': 'å', 'E': '´', 'U': '¨', 'I': 'ˆ', 'O': 'ø',
        'N': '˜', 'C': 'ç', 'S': 'ß'
      };
      return optionMap[key.toUpperCase()] || key;
    }
  }

  // Export to global scope
  global.MacOS7KeyCaps = MacOS7KeyCaps;

})(typeof window !== 'undefined' ? window : global);
