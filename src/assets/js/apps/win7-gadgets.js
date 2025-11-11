/**
 * Windows 7 Desktop Gadgets
 * Clock, weather, and system monitoring gadgets
 */

class Win7Gadgets {
  constructor() {
    this.sidebar = null;
    this.gadgets = [];
  }

  /**
   * Initialize gadgets
   */
  init() {
    this.sidebar = document.getElementById('gadgets-sidebar');
    if (!this.sidebar) {
      console.error('Gadgets sidebar not found');
      return;
    }

    // Create default gadgets
    this.createClockGadget();
    this.createWeatherGadget();
    this.createCPUGadget();
  }

  /**
   * Create clock gadget
   */
  createClockGadget() {
    const gadget = document.createElement('div');
    gadget.className = 'gadget clock-gadget';
    gadget.style.cssText = `
      text-align: center;
      padding: 15px;
    `;

    const time = document.createElement('div');
    time.style.cssText = `
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin-bottom: 4px;
    `;

    const date = document.createElement('div');
    date.style.cssText = `
      font-size: 11px;
      color: #666;
    `;

    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;

      time.textContent = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;

      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      date.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
    };

    updateClock();
    setInterval(updateClock, 1000);

    gadget.appendChild(time);
    gadget.appendChild(date);

    this.sidebar.appendChild(gadget);
    this.gadgets.push({ type: 'clock', element: gadget });
  }

  /**
   * Create weather gadget
   */
  createWeatherGadget() {
    const gadget = document.createElement('div');
    gadget.className = 'gadget weather-gadget';
    gadget.style.cssText = `
      text-align: center;
      padding: 15px;
    `;

    const location = document.createElement('div');
    location.style.cssText = `
      font-size: 12px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    `;
    location.textContent = 'San Francisco, CA';

    const icon = document.createElement('div');
    icon.style.cssText = `
      font-size: 48px;
      margin: 8px 0;
    `;
    icon.textContent = '☀️';

    const temp = document.createElement('div');
    temp.style.cssText = `
      font-size: 32px;
      font-weight: 600;
      color: #333;
    `;
    temp.textContent = '72°';

    const condition = document.createElement('div');
    condition.style.cssText = `
      font-size: 11px;
      color: #666;
      margin-top: 4px;
    `;
    condition.textContent = 'Sunny';

    const forecast = document.createElement('div');
    forecast.style.cssText = `
      display: flex;
      justify-content: space-around;
      margin-top: 12px;
      padding-top: 8px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      font-size: 10px;
      color: #666;
    `;

    const days = [
      { day: 'Mon', icon: '⛅', temp: '70°' },
      { day: 'Tue', icon: '🌧️', temp: '65°' },
      { day: 'Wed', icon: '☀️', temp: '73°' }
    ];

    days.forEach(day => {
      const dayEl = document.createElement('div');
      dayEl.style.textAlign = 'center';
      dayEl.innerHTML = `
        <div>${day.day}</div>
        <div style="font-size: 20px; margin: 4px 0;">${day.icon}</div>
        <div>${day.temp}</div>
      `;
      forecast.appendChild(dayEl);
    });

    gadget.appendChild(location);
    gadget.appendChild(icon);
    gadget.appendChild(temp);
    gadget.appendChild(condition);
    gadget.appendChild(forecast);

    this.sidebar.appendChild(gadget);
    this.gadgets.push({ type: 'weather', element: gadget });
  }

  /**
   * Create CPU monitoring gadget
   */
  createCPUGadget() {
    const gadget = document.createElement('div');
    gadget.className = 'gadget cpu-gadget';
    gadget.style.cssText = `
      padding: 15px;
    `;

    const title = document.createElement('div');
    title.style.cssText = `
      font-size: 12px;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
    `;
    title.textContent = 'CPU Meter';

    // CPU usage
    const cpuSection = this.createMeterSection('CPU', 45);
    gadget.appendChild(title);
    gadget.appendChild(cpuSection);

    // Memory usage
    const memSection = this.createMeterSection('RAM', 62);
    gadget.appendChild(memSection);

    this.sidebar.appendChild(gadget);
    this.gadgets.push({ type: 'cpu', element: gadget });

    // Animate meters
    setInterval(() => {
      this.updateMeter(cpuSection, Math.floor(Math.random() * 100));
      this.updateMeter(memSection, Math.floor(Math.random() * 100));
    }, 2000);
  }

  /**
   * Create meter section
   * @param {string} label - Meter label
   * @param {number} value - Initial value
   * @returns {HTMLElement} - Meter section element
   */
  createMeterSection(label, value) {
    const section = document.createElement('div');
    section.style.cssText = `
      margin-bottom: 12px;
    `;

    const labelRow = document.createElement('div');
    labelRow.style.cssText = `
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #666;
      margin-bottom: 4px;
    `;

    const labelText = document.createElement('span');
    labelText.textContent = label;

    const valueText = document.createElement('span');
    valueText.className = 'meter-value';
    valueText.textContent = `${value}%`;

    labelRow.appendChild(labelText);
    labelRow.appendChild(valueText);

    const bar = document.createElement('div');
    bar.style.cssText = `
      height: 12px;
      background: #E0E0E0;
      border-radius: 6px;
      overflow: hidden;
    `;

    const fill = document.createElement('div');
    fill.className = 'meter-fill';
    fill.style.cssText = `
      height: 100%;
      width: ${value}%;
      background: linear-gradient(to right, #4CB3F7, #1E8CE3);
      transition: width 0.5s ease;
    `;

    bar.appendChild(fill);
    section.appendChild(labelRow);
    section.appendChild(bar);

    return section;
  }

  /**
   * Update meter value
   * @param {HTMLElement} section - Meter section element
   * @param {number} value - New value
   */
  updateMeter(section, value) {
    const valueText = section.querySelector('.meter-value');
    const fill = section.querySelector('.meter-fill');

    if (valueText) {
      valueText.textContent = `${value}%`;
    }

    if (fill) {
      fill.style.width = `${value}%`;

      // Change color based on value
      if (value < 50) {
        fill.style.background = 'linear-gradient(to right, #4CB3F7, #1E8CE3)';
      } else if (value < 80) {
        fill.style.background = 'linear-gradient(to right, #FFB900, #FF8C00)';
      } else {
        fill.style.background = 'linear-gradient(to right, #F44336, #D32F2F)';
      }
    }
  }

  /**
   * Remove gadget
   * @param {HTMLElement} gadget - Gadget element
   */
  removeGadget(gadget) {
    const index = this.gadgets.findIndex(g => g.element === gadget);
    if (index !== -1) {
      this.gadgets.splice(index, 1);
      gadget.remove();
    }
  }

  /**
   * Toggle sidebar visibility
   */
  toggleSidebar() {
    if (this.sidebar) {
      this.sidebar.style.display = this.sidebar.style.display === 'none' ? 'flex' : 'none';
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Win7Gadgets;
}
