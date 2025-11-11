/**
 * Mac OS 9 QuickTime Player 4
 * Movie player with brushed metal appearance
 */

(function(global) {
  'use strict';

  class MacOS9QuickTime {
    constructor(desktop) {
      this.desktop = desktop;
      this.isPlaying = false;
      this.currentTime = 0;
      this.duration = 180; // 3 minutes
    }

    open() {
      const content = this._buildPlayerContent();

      this.window = this.desktop.createAppWindow({
        id: 'quicktime-player',
        title: 'QuickTime Player',
        content: content,
        width: 480,
        height: 420,
        resizable: true
      });

      this._attachListeners();
    }

    _buildPlayerContent() {
      return `<div style="height: 100%; display: flex; flex-direction: column;">
        <!-- Movie Viewing Area -->
        <div style="flex: 1; background: #000; display: flex; align-items: center; justify-content: center; min-height: 280px; position: relative;">
          <div style="text-align: center; color: #666;">
            <div style="font-size: 48px; margin-bottom: 12px;">🎬</div>
            <div style="font-family: var(--mac9-geneva); font-size: 13px;">No Movie Loaded</div>
            <div style="font-family: var(--mac9-geneva); font-size: 11px; margin-top: 8px; color: #555;">Open a QuickTime movie to play</div>
          </div>
        </div>

        <!-- QuickTime Metal Controller -->
        <div style="background: linear-gradient(135deg, #B8B8B8 0%, #D0D0D0 25%, #B8B8B8 50%, #D0D0D0 75%, #B8B8B8 100%); background-size: 8px 8px; border-top: 1px solid #888; padding: 10px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Timeline Scrubber -->
          <div style="margin: 0 12px 10px 12px; display: flex; align-items: center; gap: 8px;">
            <span style="font-family: var(--mac9-monaco); font-size: 10px; color: #333;" id="qt-current-time">0:00</span>
            <div style="flex: 1; position: relative;">
              <input type="range" id="qt-timeline" min="0" max="180" value="0" style="width: 100%; height: 4px; background: #888; border-radius: 2px; outline: none; -webkit-appearance: none;">
              <div style="position: absolute; top: -16px; left: 0; right: 0; height: 2px; background: linear-gradient(to right, #4A90E2 0%, #4A90E2 0%, #CCC 0%, #CCC 100%); border-radius: 1px; pointer-events: none;" id="qt-progress-bar"></div>
            </div>
            <span style="font-family: var(--mac9-monaco); font-size: 10px; color: #333;" id="qt-duration">3:00</span>
          </div>

          <!-- Playback Controls with Metal Style -->
          <div style="display: flex; justify-content: center; align-items: center; gap: 4px;">
            <!-- Volume -->
            <div style="display: flex; align-items: center; gap: 4px; margin-right: 12px;">
              <button class="qt-metal-button" id="qt-volume-btn" style="font-size: 14px;" title="Volume">🔊</button>
              <input type="range" id="qt-volume" min="0" max="100" value="80" style="width: 60px; height: 4px;">
            </div>

            <!-- Transport Controls -->
            <button class="qt-metal-button" id="qt-step-back" title="Step Backward">|◀</button>
            <button class="qt-metal-button" id="qt-play" style="font-size: 16px;" title="Play">▶</button>
            <button class="qt-metal-button" id="qt-step-forward" title="Step Forward">▶|</button>

            <!-- Spacer -->
            <div style="width: 12px;"></div>

            <!-- Counter Display -->
            <div style="background: rgba(0,0,0,0.3); padding: 3px 8px; border-radius: 3px; font-family: var(--mac9-monaco); font-size: 11px; color: #FFF; letter-spacing: 1px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.4);" id="qt-counter">00:00:00</div>

            <!-- Spacer -->
            <div style="width: 12px;"></div>

            <!-- Additional Controls -->
            <button class="qt-metal-button" id="qt-info" title="Movie Info">ⓘ</button>
            <button class="qt-metal-button" id="qt-fullscreen" title="Full Screen" style="font-size: 14px;">⛶</button>
          </div>
        </div>
      </div>

      <style>
        .qt-metal-button {
          background: linear-gradient(to bottom, #F0F0F0 0%, #D0D0D0 50%, #B8B8B8 100%);
          border: 1px solid #888;
          border-radius: 4px;
          padding: 6px 10px;
          font-size: 12px;
          cursor: default;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.6);
          transition: all 0.1s;
          color: #222;
          font-family: var(--mac9-charcoal);
        }

        .qt-metal-button:hover {
          background: linear-gradient(to bottom, #FFFFFF 0%, #E0E0E0 50%, #C8C8C8 100%);
          box-shadow: 0 1px 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.8);
        }

        .qt-metal-button:active {
          background: linear-gradient(to bottom, #B8B8B8 0%, #D0D0D0 50%, #E0E0E0 100%);
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.3);
        }
      </style>`;
    }

    _attachListeners() {
      if (!this.window || !this.window.element) return;

      const playBtn = this.window.element.querySelector('#qt-play');
      const timeline = this.window.element.querySelector('#qt-timeline');
      const volumeSlider = this.window.element.querySelector('#qt-volume');
      const fullscreenBtn = this.window.element.querySelector('#qt-fullscreen');
      const infoBtn = this.window.element.querySelector('#qt-info');
      const stepBackBtn = this.window.element.querySelector('#qt-step-back');
      const stepForwardBtn = this.window.element.querySelector('#qt-step-forward');

      if (playBtn) {
        playBtn.addEventListener('click', () => this._togglePlay(playBtn));
      }

      if (timeline) {
        timeline.addEventListener('input', (e) => {
          this.currentTime = parseInt(e.target.value);
          this._updateTimeDisplay();
        });
      }

      if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
          const volume = e.target.value;
          console.log('Volume:', volume);
        });
      }

      if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
          this.desktop._showAlert('Full screen mode (demo)');
        });
      }

      if (infoBtn) {
        infoBtn.addEventListener('click', () => {
          this._showMovieInfo();
        });
      }

      if (stepBackBtn) {
        stepBackBtn.addEventListener('click', () => {
          if (this.currentTime > 0) {
            this.currentTime = Math.max(0, this.currentTime - 1);
            this._updateTimeDisplay();
            this._updateTimeline();
          }
        });
      }

      if (stepForwardBtn) {
        stepForwardBtn.addEventListener('click', () => {
          if (this.currentTime < this.duration) {
            this.currentTime = Math.min(this.duration, this.currentTime + 1);
            this._updateTimeDisplay();
            this._updateTimeline();
          }
        });
      }
    }

    _togglePlay(playBtn) {
      this.isPlaying = !this.isPlaying;
      if (this.isPlaying) {
        playBtn.innerHTML = '⏸';
        playBtn.title = 'Pause';
        this._startPlayback();
      } else {
        playBtn.innerHTML = '▶';
        playBtn.title = 'Play';
        this._stopPlayback();
      }
    }

    _startPlayback() {
      this.playbackInterval = setInterval(() => {
        if (this.currentTime < this.duration) {
          this.currentTime++;
          this._updateTimeDisplay();
          this._updateTimeline();
          this._updateProgressBar();
        } else {
          const playBtn = this.window.element.querySelector('#qt-play');
          if (playBtn) {
            playBtn.innerHTML = '▶';
            playBtn.title = 'Play';
          }
          this.isPlaying = false;
          this._stopPlayback();
        }
      }, 1000);
    }

    _stopPlayback() {
      if (this.playbackInterval) {
        clearInterval(this.playbackInterval);
        this.playbackInterval = null;
      }
    }

    _updateTimeDisplay() {
      const currentDisplay = this.window.element.querySelector('#qt-current-time');
      const counter = this.window.element.querySelector('#qt-counter');

      if (currentDisplay) {
        const min = Math.floor(this.currentTime / 60);
        const sec = this.currentTime % 60;
        currentDisplay.textContent = `${min}:${String(sec).padStart(2, '0')}`;
      }

      if (counter) {
        const hours = Math.floor(this.currentTime / 3600);
        const min = Math.floor((this.currentTime % 3600) / 60);
        const sec = this.currentTime % 60;
        counter.textContent = `${String(hours).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
      }
    }

    _updateTimeline() {
      const timeline = this.window.element.querySelector('#qt-timeline');
      if (timeline) {
        timeline.value = this.currentTime;
      }
    }

    _updateProgressBar() {
      const progressBar = this.window.element.querySelector('#qt-progress-bar');
      if (progressBar) {
        const percent = (this.currentTime / this.duration) * 100;
        progressBar.style.background = `linear-gradient(to right, #4A90E2 0%, #4A90E2 ${percent}%, #CCC ${percent}%, #CCC 100%)`;
      }
    }

    _showMovieInfo() {
      const content = `<div style="padding: 20px;">
        <h3 style="font-family: var(--mac9-charcoal); margin: 0 0 16px 0;">Movie Properties</h3>
        <div class="mac9-group">
          <div class="mac9-group-title">Movie Information</div>
          <p style="margin: 6px 0;"><strong>Format:</strong> QuickTime Movie</p>
          <p style="margin: 6px 0;"><strong>Duration:</strong> 3:00</p>
          <p style="margin: 6px 0;"><strong>Dimensions:</strong> 640 x 480</p>
          <p style="margin: 6px 0;"><strong>FPS:</strong> 29.97</p>
          <p style="margin: 6px 0;"><strong>Codec:</strong> Sorenson Video 3</p>
          <p style="margin: 6px 0;"><strong>Audio:</strong> QDesign Music 2, 44.1 kHz, Stereo</p>
          <p style="margin: 6px 0;"><strong>Data Size:</strong> 12.4 MB</p>
        </div>
        <div style="margin-top: 20px; text-align: right;">
          <button class="mac9-button default" onclick="this.closest('.os-window').querySelector('.window-btn-close').click()">OK</button>
        </div>
      </div>`;

      this.desktop.createAppWindow({
        id: 'qt-movie-info',
        title: 'Movie Info',
        content: content,
        width: 380,
        height: 320,
        resizable: false
      });
    }
  }

  global.MacOS9QuickTime = MacOS9QuickTime;

})(typeof window !== 'undefined' ? window : global);
