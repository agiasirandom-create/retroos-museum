/**
 * Mac OS System 7 Alarm Clock
 * Classic analog clock with alarm functionality
 */

(function(global) {
  'use strict';

  /**
   * Mac OS 7 Alarm Clock Application
   */
  class MacOS7AlarmClock {
    constructor(desktop) {
      this.desktop = desktop;
      this.window = null;
      this.intervalId = null;
      this.alarmTime = null;
      this.alarmEnabled = false;
    }

    /**
     * Open Alarm Clock
     */
    open() {
      if (this.window) {
        this.window.focus();
        return;
      }

      const content = this._buildContent();

      this.window = this.desktop.createAppWindow({
        id: 'alarm-clock',
        title: 'Alarm Clock',
        content: content,
        width: 260,
        height: 340,
        resizable: false,
        onClose: () => {
          if (this.intervalId) {
            clearInterval(this.intervalId);
          }
          this.window = null;
          return true;
        }
      });

      this._attachEventListeners();
      this._startClock();
    }

    /**
     * Build Alarm Clock content
     * @private
     */
    _buildContent() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');

      return `
        <div style="padding: 16px; display: flex; flex-direction: column; align-items: center; height: 100%;">
          <!-- Analog clock -->
          <div style="width: 200px; height: 200px; border: 2px solid var(--mac7-black); border-radius: 50%; background: var(--mac7-white); position: relative; margin-bottom: 20px;">
            <!-- Clock face -->
            <svg id="clock-face" width="200" height="200" viewBox="0 0 200 200" style="position: absolute; top: 0; left: 0;">
              <!-- Hour markers -->
              ${this._generateClockMarkers()}

              <!-- Clock hands (will be updated by JS) -->
              <line id="hour-hand" x1="100" y1="100" x2="100" y2="60" stroke="#000" stroke-width="4" stroke-linecap="round"/>
              <line id="minute-hand" x1="100" y1="100" x2="100" y2="40" stroke="#000" stroke-width="3" stroke-linecap="round"/>
              <line id="second-hand" x1="100" y1="100" x2="100" y2="30" stroke="#cc0000" stroke-width="1" stroke-linecap="round"/>

              <!-- Center dot -->
              <circle cx="100" cy="100" r="5" fill="#000"/>
            </svg>
          </div>

          <!-- Digital time -->
          <div id="digital-time" style="font-family: var(--mac7-chicago); font-size: 24px; font-weight: bold; margin-bottom: 16px;">
            00:00:00
          </div>

          <!-- Alarm settings -->
          <div class="mac-group" style="width: 100%; padding: 12px;">
            <div class="mac-group-title" style="margin-bottom: 8px;">Alarm</div>

            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <label style="font-family: var(--mac7-geneva); font-size: 11px;">Time:</label>
              <input type="time" id="alarm-time" class="mac-input" style="flex: 1;" value="${hours}:${minutes}">
            </div>

            <label style="display: flex; align-items: center; gap: 4px; cursor: default; font-family: var(--mac7-geneva); font-size: 11px;">
              <input type="checkbox" id="alarm-enabled">
              Alarm On
            </label>
          </div>

          <!-- Alarm status -->
          <div id="alarm-status" style="display: none; margin-top: 12px; padding: 8px; background: #ffffcc; border: 1px solid var(--mac7-black); font-family: var(--mac7-geneva); font-size: 11px; text-align: center; width: 100%;">
            Alarm set for: <span id="alarm-time-display"></span>
          </div>
        </div>
      `;
    }

    /**
     * Generate clock hour markers
     * @private
     */
    _generateClockMarkers() {
      let markers = '';
      for (let i = 1; i <= 12; i++) {
        const angle = (i * 30 - 90) * Math.PI / 180;
        const x = 100 + 75 * Math.cos(angle);
        const y = 100 + 75 * Math.sin(angle);
        markers += `<text x="${x}" y="${y + 5}" text-anchor="middle" font-family="Chicago" font-size="14" fill="#000">${i}</text>`;
      }
      return markers;
    }

    /**
     * Start clock updates
     * @private
     */
    _startClock() {
      this._updateClock();
      this.intervalId = setInterval(() => {
        this._updateClock();
        this._checkAlarm();
      }, 1000);
    }

    /**
     * Update clock display
     * @private
     */
    _updateClock() {
      if (!this.window) return;

      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      // Update digital time
      const digitalTime = this.window.element.querySelector('#digital-time');
      if (digitalTime) {
        digitalTime.textContent =
          String(hours).padStart(2, '0') + ':' +
          String(minutes).padStart(2, '0') + ':' +
          String(seconds).padStart(2, '0');
      }

      // Update analog clock hands
      const secondAngle = (seconds * 6 - 90) * Math.PI / 180;
      const minuteAngle = ((minutes + seconds / 60) * 6 - 90) * Math.PI / 180;
      const hourAngle = ((hours % 12 + minutes / 60) * 30 - 90) * Math.PI / 180;

      const hourHand = this.window.element.querySelector('#hour-hand');
      const minuteHand = this.window.element.querySelector('#minute-hand');
      const secondHand = this.window.element.querySelector('#second-hand');

      if (hourHand) {
        const x = 100 + 40 * Math.cos(hourAngle);
        const y = 100 + 40 * Math.sin(hourAngle);
        hourHand.setAttribute('x2', x);
        hourHand.setAttribute('y2', y);
      }

      if (minuteHand) {
        const x = 100 + 60 * Math.cos(minuteAngle);
        const y = 100 + 60 * Math.sin(minuteAngle);
        minuteHand.setAttribute('x2', x);
        minuteHand.setAttribute('y2', y);
      }

      if (secondHand) {
        const x = 100 + 70 * Math.cos(secondAngle);
        const y = 100 + 70 * Math.sin(secondAngle);
        secondHand.setAttribute('x2', x);
        secondHand.setAttribute('y2', y);
      }
    }

    /**
     * Check if alarm should trigger
     * @private
     */
    _checkAlarm() {
      if (!this.alarmEnabled || !this.alarmTime) return;

      const now = new Date();
      const currentTime = String(now.getHours()).padStart(2, '0') + ':' +
                         String(now.getMinutes()).padStart(2, '0');

      if (currentTime === this.alarmTime) {
        this._triggerAlarm();
      }
    }

    /**
     * Trigger alarm
     * @private
     */
    _triggerAlarm() {
      // Only trigger once per minute
      if (this.lastAlarmTrigger === this.alarmTime) return;
      this.lastAlarmTrigger = this.alarmTime;

      alert('ALARM!\n\nTime: ' + this.alarmTime);

      // Flash window (simple visual feedback)
      const titleBar = this.window.element.querySelector('.window-titlebar');
      if (titleBar) {
        let flashCount = 0;
        const flashInterval = setInterval(() => {
          titleBar.style.backgroundColor = flashCount % 2 === 0 ? '#ffcc00' : '';
          flashCount++;
          if (flashCount > 6) {
            clearInterval(flashInterval);
            titleBar.style.backgroundColor = '';
          }
        }, 300);
      }
    }

    /**
     * Attach event listeners
     * @private
     */
    _attachEventListeners() {
      if (!this.window) return;

      const alarmTimeInput = this.window.element.querySelector('#alarm-time');
      const alarmEnabledCheckbox = this.window.element.querySelector('#alarm-enabled');
      const alarmStatus = this.window.element.querySelector('#alarm-status');
      const alarmTimeDisplay = this.window.element.querySelector('#alarm-time-display');

      // Alarm time changed
      alarmTimeInput.addEventListener('change', (e) => {
        this.alarmTime = e.target.value;
        if (alarmTimeDisplay) {
          alarmTimeDisplay.textContent = this.alarmTime;
        }
      });

      // Alarm enabled/disabled
      alarmEnabledCheckbox.addEventListener('change', (e) => {
        this.alarmEnabled = e.target.checked;

        if (this.alarmEnabled) {
          this.alarmTime = alarmTimeInput.value;
          if (alarmTimeDisplay) {
            alarmTimeDisplay.textContent = this.alarmTime;
          }
          alarmStatus.style.display = 'block';
        } else {
          alarmStatus.style.display = 'none';
          this.lastAlarmTrigger = null;
        }
      });
    }
  }

  // Export to global scope
  global.MacOS7AlarmClock = MacOS7AlarmClock;

})(typeof window !== 'undefined' ? window : global);
