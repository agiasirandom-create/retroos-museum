/**
 * Mac OS 9 Apple DVD Player
 * DVD playback application with controller
 */

(function(global) {
  'use strict';

  class MacOS9AppleDVDPlayer {
    constructor(desktop) {
      this.desktop = desktop;
      this.isPlaying = false;
      this.currentTime = 0;
      this.duration = 5940; // 99:00 in seconds
    }

    open() {
      const content = this._buildPlayerContent();

      this.window = this.desktop.createAppWindow({
        id: 'apple-dvd-player',
        title: 'Apple DVD Player',
        content: content,
        width: 640,
        height: 520,
        resizable: true
      });

      this._attachListeners();
    }

    _buildPlayerContent() {
      return `<div style="height: 100%; display: flex; flex-direction: column; background: #000;">
        <!-- Video Display Area -->
        <div style="flex: 1; background: #000; display: flex; align-items: center; justify-content: center; position: relative; min-height: 360px;">
          <div style="text-align: center; color: #666;">
            <div style="font-size: 64px; margin-bottom: 12px;">📀</div>
            <div style="font-family: var(--mac9-geneva); font-size: 14px;">No DVD Loaded</div>
            <div style="font-family: var(--mac9-geneva); font-size: 11px; margin-top: 8px; color: #555;">Insert a DVD to begin playback</div>
          </div>
        </div>

        <!-- Controller Area -->
        <div style="background: linear-gradient(to bottom, #DDDDDD, #CCCCCC); border-top: 1px solid #555; padding: 12px;">
          <!-- Time Display -->
          <div style="text-align: center; margin-bottom: 12px;">
            <div style="font-family: var(--mac9-monaco); font-size: 18px; color: #000; letter-spacing: 2px;" id="dvd-time-display">00:00 / 99:00</div>
          </div>

          <!-- Timeline Scrubber -->
          <div style="margin: 0 20px 16px 20px;">
            <input type="range" id="dvd-timeline" min="0" max="5940" value="0" style="width: 100%; height: 6px; background: #999; border-radius: 3px; outline: none; -webkit-appearance: none;">
          </div>

          <!-- Playback Controls -->
          <div style="display: flex; justify-content: center; align-items: center; gap: 8px; margin-bottom: 12px;">
            <button class="mac9-button" id="dvd-prev-chapter" title="Previous Chapter">⏮</button>
            <button class="mac9-button" id="dvd-rewind" title="Rewind">⏪</button>
            <button class="mac9-button default" id="dvd-play" style="font-size: 16px; min-width: 60px;" title="Play">▶</button>
            <button class="mac9-button" id="dvd-forward" title="Fast Forward">⏩</button>
            <button class="mac9-button" id="dvd-next-chapter" title="Next Chapter">⏭</button>
            <button class="mac9-button" id="dvd-stop" title="Stop">⏹</button>
          </div>

          <!-- Volume and Options -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0 20px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-family: var(--mac9-geneva); font-size: 11px;">🔊</span>
              <input type="range" id="dvd-volume" min="0" max="100" value="75" style="width: 120px;">
            </div>

            <div style="display: flex; gap: 8px;">
              <button class="mac9-button" id="dvd-menu" title="DVD Menu">Menu</button>
              <button class="mac9-button" id="dvd-fullscreen" title="Full Screen">⛶</button>
            </div>
          </div>
        </div>
      </div>`;
    }

    _attachListeners() {
      if (!this.window || !this.window.element) return;

      const playBtn = this.window.element.querySelector('#dvd-play');
      const stopBtn = this.window.element.querySelector('#dvd-stop');
      const timeline = this.window.element.querySelector('#dvd-timeline');
      const volumeSlider = this.window.element.querySelector('#dvd-volume');
      const fullscreenBtn = this.window.element.querySelector('#dvd-fullscreen');
      const menuBtn = this.window.element.querySelector('#dvd-menu');
      const prevBtn = this.window.element.querySelector('#dvd-prev-chapter');
      const nextBtn = this.window.element.querySelector('#dvd-next-chapter');

      if (playBtn) {
        playBtn.addEventListener('click', () => this._togglePlay(playBtn));
      }

      if (stopBtn) {
        stopBtn.addEventListener('click', () => this._stop());
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

      if (menuBtn) {
        menuBtn.addEventListener('click', () => {
          this.desktop._showAlert('DVD Menu (demo)');
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          this.desktop._showAlert('Previous chapter (demo)');
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          this.desktop._showAlert('Next chapter (demo)');
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

    _stop() {
      this.isPlaying = false;
      this.currentTime = 0;
      const playBtn = this.window.element.querySelector('#dvd-play');
      if (playBtn) {
        playBtn.innerHTML = '▶';
        playBtn.title = 'Play';
      }
      this._updateTimeDisplay();
      this._updateTimeline();
      this._stopPlayback();
    }

    _startPlayback() {
      this.playbackInterval = setInterval(() => {
        if (this.currentTime < this.duration) {
          this.currentTime++;
          this._updateTimeDisplay();
          this._updateTimeline();
        } else {
          this._stop();
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
      const display = this.window.element.querySelector('#dvd-time-display');
      if (display) {
        const currentMin = Math.floor(this.currentTime / 60);
        const currentSec = this.currentTime % 60;
        const durationMin = Math.floor(this.duration / 60);
        const durationSec = this.duration % 60;
        display.textContent = `${String(currentMin).padStart(2, '0')}:${String(currentSec).padStart(2, '0')} / ${String(durationMin).padStart(2, '0')}:${String(durationSec).padStart(2, '0')}`;
      }
    }

    _updateTimeline() {
      const timeline = this.window.element.querySelector('#dvd-timeline');
      if (timeline) {
        timeline.value = this.currentTime;
      }
    }
  }

  global.MacOS9AppleDVDPlayer = MacOS9AppleDVDPlayer;

})(typeof window !== 'undefined' ? window : global);
