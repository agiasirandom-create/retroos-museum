/**
 * iOS 1.0 Lock Screen System
 * Slide to unlock functionality
 */

class iOS1LockScreen {
  constructor() {
    this.lockscreen = null;
    this.slider = null;
    this.sliderButton = null;
    this.isDragging = false;
    this.startX = 0;
    this.currentX = 0;
    this.threshold = 200; // Distance to unlock
  }

  init() {
    this.lockscreen = document.getElementById('ios1-lockscreen');
    this.slider = document.getElementById('slide-to-unlock');
    this.sliderButton = document.getElementById('slider-button');

    if (!this.lockscreen || !this.sliderButton) return;

    // Show lock screen initially
    this.lockscreen.hidden = false;

    this.attachEventListeners();
  }

  attachEventListeners() {
    // Touch events
    this.sliderButton.addEventListener('touchstart', (e) => this.handleStart(e), { passive: false });
    this.sliderButton.addEventListener('touchmove', (e) => this.handleMove(e), { passive: false });
    this.sliderButton.addEventListener('touchend', (e) => this.handleEnd(e));

    // Mouse events (for desktop testing)
    this.sliderButton.addEventListener('mousedown', (e) => this.handleStart(e));
    document.addEventListener('mousemove', (e) => this.handleMove(e));
    document.addEventListener('mouseup', (e) => this.handleEnd(e));
  }

  handleStart(e) {
    e.preventDefault();
    this.isDragging = true;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    this.startX = clientX;
    this.currentX = 0;
    
    this.sliderButton.style.transition = 'none';
  }

  handleMove(e) {
    if (!this.isDragging) return;
    
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = clientX - this.startX;
    
    // Constrain movement
    this.currentX = Math.max(0, Math.min(diff, this.threshold));
    
    this.sliderButton.style.transform = `translateX(${this.currentX}px)`;
    
    // Update text opacity as slider moves
    const sliderText = this.slider.querySelector('.slider-text');
    if (sliderText) {
      sliderText.style.opacity = 1 - (this.currentX / this.threshold);
    }
  }

  handleEnd(e) {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    this.sliderButton.style.transition = 'all 0.3s ease';
    
    // Check if unlocked
    if (this.currentX >= this.threshold * 0.8) {
      this.unlock();
    } else {
      // Reset slider
      this.sliderButton.style.transform = 'translateX(0)';
      const sliderText = this.slider.querySelector('.slider-text');
      if (sliderText) {
        sliderText.style.opacity = 0.6;
      }
    }
  }

  unlock() {
    // Animate slider to full width
    this.sliderButton.style.transform = `translateX(${this.threshold}px)`;
    
    setTimeout(() => {
      // Hide lock screen
      this.lockscreen.style.opacity = '0';
      this.lockscreen.style.transform = 'scale(1.1)';
      this.lockscreen.style.transition = 'all 0.3s ease';
      
      setTimeout(() => {
        this.lockscreen.hidden = true;
        this.lockscreen.style.opacity = '1';
        this.lockscreen.style.transform = 'scale(1)';
        
        // Reset slider for next time
        this.sliderButton.style.transition = 'none';
        this.sliderButton.style.transform = 'translateX(0)';
        const sliderText = this.slider.querySelector('.slider-text');
        if (sliderText) {
          sliderText.style.opacity = 0.6;
        }
      }, 300);
    }, 100);
  }

  lock() {
    this.lockscreen.hidden = false;
  }
}
