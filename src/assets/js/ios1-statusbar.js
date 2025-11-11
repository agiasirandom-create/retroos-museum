/**
 * iOS 1.0 Status Bar System
 * Displays time, carrier, signal, WiFi, and battery
 */

class iOS1StatusBar {
  constructor() {
    this.timeElement = null;
    this.carrierElement = null;
    this.updateInterval = null;
  }

  init() {
    this.timeElement = document.getElementById('statusbar-time');
    this.carrierElement = document.getElementById('carrier-name');
    
    if (this.timeElement) {
      this.updateTime();
      this.updateInterval = setInterval(() => this.updateTime(), 1000);
    }

    // Simulate carrier name
    if (this.carrierElement) {
      const carriers = ['AT&T', 'Carrier'];
      this.carrierElement.textContent = carriers[0];
    }
  }

  updateTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    
    const timeStr = `${hours}:${minutesStr} ${ampm}`;
    
    if (this.timeElement) {
      this.timeElement.textContent = timeStr;
    }

    // Also update lock screen time if visible
    const lockscreenHours = document.getElementById('lockscreen-hours');
    const lockscreenDate = document.getElementById('lockscreen-date');
    
    if (lockscreenHours) {
      const displayHours = hours < 10 ? hours : hours;
      lockscreenHours.textContent = `${displayHours}:${minutesStr}`;
    }

    if (lockscreenDate) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
      const dayName = days[now.getDay()];
      const monthName = months[now.getMonth()];
      const date = now.getDate();
      lockscreenDate.textContent = `${dayName}, ${monthName} ${date}`;
    }
  }

  destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}
