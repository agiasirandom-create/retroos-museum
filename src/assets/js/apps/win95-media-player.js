/**
 * Windows 95 Media Player
 * Classic Windows Media Player interface
 */

(function(global) {
  'use strict';

  class Win95MediaPlayer {
    constructor(windowManager) {
      this.windowManager = windowManager;
      this.window = null;
      this.isPlaying = false;
      this.currentTime = 0;
      this.duration = 180; // 3 minutes demo
      this.volume = 50;
      this.playInterval = null;
      this.playlist = [
        'Canyon.mid',
        'Passport.mid',
        'Town.mid',
        'Flourish.mid'
      ];
      this.currentTrack = 0;
    }

    /**
     * Open Media Player
     */
    open() {
      const windowContent = this.createContent();

      this.window = this.windowManager.createWindow({
        id: `media-player-${Date.now()}`,
        title: 'Media Player',
        width: 450,
        height: 350,
        minWidth: 400,
        minHeight: 300,
        content: windowContent
      });

      this.setupEventListeners();
    }

    /**
     * Create window content
     */
    createContent() {
      return `
        <div class="media-player-container" style="
          background: #C0C0C0;
          font-family: 'MS Sans Serif', sans-serif;
          height: 100%;
          display: flex;
          flex-direction: column;
        ">
          <!-- Menu Bar -->
          <div class="window-menubar" style="flex-shrink: 0;">
            <div class="menu-item">File</div>
            <div class="menu-item">Edit</div>
            <div class="menu-item">Device</div>
            <div class="menu-item">Scale</div>
            <div class="menu-item">Help</div>
          </div>

          <!-- Display Area -->
          <div style="
            flex: 1;
            background: #000;
            margin: 8px;
            border: 2px solid;
            border-color: #808080 #FFF #FFF #808080;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          ">
            <!-- Visualizer -->
            <div class="media-visualizer" style="
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #00FF00;
              font-size: 48px;
              font-weight: bold;
            ">
              ${this.playlist[this.currentTrack]}
            </div>
          </div>

          <!-- Progress Bar -->
          <div style="margin: 0 8px 8px 8px;">
            <div style="
              background: #FFF;
              border: 2px inset;
              height: 20px;
              position: relative;
              cursor: pointer;
            " class="progress-container">
              <div class="progress-bar" style="
                background: linear-gradient(to bottom, #0000FF, #000080);
                height: 100%;
                width: 0%;
                transition: width 0.1s linear;
              "></div>
              <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 10px;
                color: #000;
                font-weight: bold;
                mix-blend-mode: difference;
              " class="time-display">0:00 / 3:00</div>
            </div>
          </div>

          <!-- Controls -->
          <div style="
            display: flex;
            gap: 4px;
            padding: 8px;
            background: #C0C0C0;
            border-top: 2px solid #FFF;
            align-items: center;
            justify-content: center;
          ">
            <!-- Previous -->
            <button class="media-btn prev-btn" style="
              width: 40px;
              height: 32px;
              background: #C0C0C0;
              border: 2px solid;
              border-color: #FFF #808080 #808080 #FFF;
              cursor: pointer;
              font-size: 16px;
            " title="Previous">⏮</button>

            <!-- Stop -->
            <button class="media-btn stop-btn" style="
              width: 40px;
              height: 32px;
              background: #C0C0C0;
              border: 2px solid;
              border-color: #FFF #808080 #808080 #FFF;
              cursor: pointer;
              font-size: 16px;
            " title="Stop">⏹</button>

            <!-- Play/Pause -->
            <button class="media-btn play-btn" style="
              width: 40px;
              height: 32px;
              background: #C0C0C0;
              border: 2px solid;
              border-color: #FFF #808080 #808080 #FFF;
              cursor: pointer;
              font-size: 16px;
            " title="Play">▶</button>

            <!-- Next -->
            <button class="media-btn next-btn" style="
              width: 40px;
              height: 32px;
              background: #C0C0C0;
              border: 2px solid;
              border-color: #FFF #808080 #808080 #FFF;
              cursor: pointer;
              font-size: 16px;
            " title="Next">⏭</button>

            <!-- Spacer -->
            <div style="width: 16px;"></div>

            <!-- Volume Label -->
            <div style="font-size: 11px; margin-right: 4px;">Volume:</div>

            <!-- Volume Slider -->
            <input type="range" class="volume-slider" min="0" max="100" value="50" style="
              width: 100px;
              height: 20px;
            ">

            <!-- Volume Display -->
            <div class="volume-display" style="
              font-size: 11px;
              margin-left: 4px;
              min-width: 30px;
            ">50%</div>
          </div>

          <!-- Playlist -->
          <div style="
            margin: 0 8px 8px 8px;
            border: 2px solid;
            border-color: #808080 #FFF #FFF #808080;
            background: #FFF;
            max-height: 80px;
            overflow-y: auto;
          ">
            <div class="playlist-items" style="padding: 4px;">
              ${this.playlist.map((track, index) => `
                <div class="playlist-item ${index === 0 ? 'active' : ''}" data-index="${index}" style="
                  padding: 2px 4px;
                  cursor: pointer;
                  font-size: 11px;
                  ${index === 0 ? 'background: #000080; color: #FFF;' : ''}
                ">
                  ${index + 1}. ${track}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
      // Play button
      const playBtn = this.window.element.querySelector('.play-btn');
      playBtn.addEventListener('click', () => {
        if (this.isPlaying) {
          this.pause();
        } else {
          this.play();
        }
      });

      // Stop button
      const stopBtn = this.window.element.querySelector('.stop-btn');
      stopBtn.addEventListener('click', () => {
        this.stop();
      });

      // Previous button
      const prevBtn = this.window.element.querySelector('.prev-btn');
      prevBtn.addEventListener('click', () => {
        this.previous();
      });

      // Next button
      const nextBtn = this.window.element.querySelector('.next-btn');
      nextBtn.addEventListener('click', () => {
        this.next();
      });

      // Volume slider
      const volumeSlider = this.window.element.querySelector('.volume-slider');
      volumeSlider.addEventListener('input', (e) => {
        this.volume = parseInt(e.target.value);
        this.updateVolumeDisplay();
      });

      // Progress bar click
      const progressContainer = this.window.element.querySelector('.progress-container');
      progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        this.currentTime = Math.floor(percent * this.duration);
        this.updateProgress();
      });

      // Playlist items
      const playlistItems = this.window.element.querySelectorAll('.playlist-item');
      playlistItems.forEach(item => {
        item.addEventListener('click', () => {
          const index = parseInt(item.getAttribute('data-index'));
          this.loadTrack(index);
        });
      });
    }

    /**
     * Play
     */
    play() {
      this.isPlaying = true;
      const playBtn = this.window.element.querySelector('.play-btn');
      playBtn.textContent = '⏸';
      playBtn.setAttribute('title', 'Pause');

      this.playInterval = setInterval(() => {
        this.currentTime++;
        if (this.currentTime >= this.duration) {
          this.next();
        }
        this.updateProgress();
      }, 1000);
    }

    /**
     * Pause
     */
    pause() {
      this.isPlaying = false;
      const playBtn = this.window.element.querySelector('.play-btn');
      playBtn.textContent = '▶';
      playBtn.setAttribute('title', 'Play');

      if (this.playInterval) {
        clearInterval(this.playInterval);
        this.playInterval = null;
      }
    }

    /**
     * Stop
     */
    stop() {
      this.pause();
      this.currentTime = 0;
      this.updateProgress();
    }

    /**
     * Previous track
     */
    previous() {
      this.currentTrack = (this.currentTrack - 1 + this.playlist.length) % this.playlist.length;
      this.loadTrack(this.currentTrack);
    }

    /**
     * Next track
     */
    next() {
      this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
      this.loadTrack(this.currentTrack);
    }

    /**
     * Load track
     */
    loadTrack(index) {
      const wasPlaying = this.isPlaying;
      this.stop();
      this.currentTrack = index;

      // Update visualizer
      const visualizer = this.window.element.querySelector('.media-visualizer');
      visualizer.textContent = this.playlist[index];

      // Update playlist highlighting
      const playlistItems = this.window.element.querySelectorAll('.playlist-item');
      playlistItems.forEach((item, i) => {
        if (i === index) {
          item.style.background = '#000080';
          item.style.color = '#FFF';
          item.classList.add('active');
        } else {
          item.style.background = '';
          item.style.color = '';
          item.classList.remove('active');
        }
      });

      if (wasPlaying) {
        this.play();
      }
    }

    /**
     * Update progress bar
     */
    updateProgress() {
      const percent = (this.currentTime / this.duration) * 100;
      const progressBar = this.window.element.querySelector('.progress-bar');
      progressBar.style.width = `${percent}%`;

      const timeDisplay = this.window.element.querySelector('.time-display');
      const currentMin = Math.floor(this.currentTime / 60);
      const currentSec = this.currentTime % 60;
      const durationMin = Math.floor(this.duration / 60);
      const durationSec = this.duration % 60;

      timeDisplay.textContent = `${currentMin}:${String(currentSec).padStart(2, '0')} / ${durationMin}:${String(durationSec).padStart(2, '0')}`;
    }

    /**
     * Update volume display
     */
    updateVolumeDisplay() {
      const volumeDisplay = this.window.element.querySelector('.volume-display');
      volumeDisplay.textContent = `${this.volume}%`;
    }
  }

  // Export to global scope
  global.Win95MediaPlayer = Win95MediaPlayer;

})(typeof window !== 'undefined' ? window : global);
