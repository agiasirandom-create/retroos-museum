/**
 * BeOS MediaPlayer
 * Showcases BeOS's famous media capabilities
 */

(function(global) {
  'use strict';

  /**
   * BeOS MediaPlayer Application
   */
  class BeOSMediaPlayer {
    constructor(desktop) {
      this.desktop = desktop;
      this.window = null;
      this.windowId = null;
      this.isPlaying = false;
      this.currentTime = 0;
      this.duration = 180; // 3 minutes demo
      this.volume = 75;
      this.playInterval = null;
    }

    /**
     * Launch MediaPlayer
     */
    launch() {
      const content = this._createContent();

      this.windowId = `mediaplayer-${Date.now()}`;
      this.window = this.desktop.windowSystem.createWindow({
        id: this.windowId,
        title: 'MediaPlayer',
        width: 400,
        height: 300,
        content: content,
        resizable: true,
        menuItems: [
          { label: 'File', onClick: () => {} },
          { label: 'Audio', onClick: () => {} },
          { label: 'Video', onClick: () => {} }
        ],
        onClose: () => this._cleanup()
      });

      // Add to current workspace
      if (this.desktop.workspaceSwitcher) {
        this.desktop.workspaceSwitcher.addWindowToWorkspace(this.windowId);
      }

      // Setup event handlers
      this._setupEventHandlers();

      // Append to container
      const container = document.getElementById('windows-container');
      if (container) {
        container.appendChild(this.window);
      }
    }

    /**
     * Create MediaPlayer content
     * @private
     */
    _createContent() {
      return `
        <div class="mediaplayer-window" style="display: flex; flex-direction: column; height: 100%; background: #000;">
          <!-- Video/Visualization Area -->
          <div id="media-display" style="
            flex: 1;
            background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 50%, #1a1a2e 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #00FFFF;
            font-size: 14px;
            position: relative;
            overflow: hidden;
          ">
            <div id="visualization" style="text-align: center;">
              <div style="font-size: 48px; margin-bottom: 16px;">♪</div>
              <div id="track-title">Sample Audio Track.mp3</div>
            </div>
          </div>

          <!-- Controls Area -->
          <div style="background: #DCDCDC; padding: 8px;">
            <!-- Progress Bar -->
            <div style="margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; font-size: 9px; margin-bottom: 2px;">
                <span id="current-time">0:00</span>
                <span id="total-time">3:00</span>
              </div>
              <div id="progress-track" style="
                height: 6px;
                background: #808080;
                border: 1px solid #000;
                cursor: pointer;
                position: relative;
              ">
                <div id="progress-bar" style="
                  height: 100%;
                  background: linear-gradient(90deg, #336699 0%, #4682B4 100%);
                  width: 0%;
                  transition: width 0.1s;
                "></div>
              </div>
            </div>

            <!-- Playback Controls -->
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <button class="beos-button" id="btn-prev" title="Previous" style="width: 32px; padding: 4px;">⏮</button>
              <button class="beos-button" id="btn-play" title="Play" style="width: 40px; padding: 4px;">▶</button>
              <button class="beos-button" id="btn-stop" title="Stop" style="width: 32px; padding: 4px;">⏹</button>
              <button class="beos-button" id="btn-next" title="Next" style="width: 32px; padding: 4px;">⏭</button>

              <div style="flex: 1;"></div>

              <!-- Volume Control -->
              <span style="font-size: 10px; margin-right: 4px;">🔊</span>
              <input type="range" id="volume-slider" min="0" max="100" value="75" style="width: 80px;">
              <span id="volume-display" style="font-size: 9px; min-width: 30px;">75%</span>
            </div>

            <!-- Status Bar -->
            <div style="font-size: 9px; color: #606060; border-top: 1px solid #808080; padding-top: 4px;">
              <span id="media-status">Ready</span>
            </div>
          </div>
        </div>
      `;
    }

    /**
     * Setup event handlers
     * @private
     */
    _setupEventHandlers() {
      const btnPlay = this.window.querySelector('#btn-play');
      const btnStop = this.window.querySelector('#btn-stop');
      const btnPrev = this.window.querySelector('#btn-prev');
      const btnNext = this.window.querySelector('#btn-next');
      const volumeSlider = this.window.querySelector('#volume-slider');
      const progressTrack = this.window.querySelector('#progress-track');

      if (btnPlay) {
        btnPlay.addEventListener('click', () => this._togglePlay());
      }

      if (btnStop) {
        btnStop.addEventListener('click', () => this._stop());
      }

      if (btnPrev) {
        btnPrev.addEventListener('click', () => this._previous());
      }

      if (btnNext) {
        btnNext.addEventListener('click', () => this._next());
      }

      if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
          this.volume = e.target.value;
          this._updateVolumeDisplay();
        });
      }

      if (progressTrack) {
        progressTrack.addEventListener('click', (e) => {
          const rect = progressTrack.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const percent = x / rect.width;
          this.currentTime = Math.floor(this.duration * percent);
          this._updateProgress();
        });
      }

      this._updateProgress();
      this._updateVolumeDisplay();
    }

    /**
     * Toggle play/pause
     * @private
     */
    _togglePlay() {
      if (this.isPlaying) {
        this._pause();
      } else {
        this._play();
      }
    }

    /**
     * Play
     * @private
     */
    _play() {
      this.isPlaying = true;

      const btnPlay = this.window.querySelector('#btn-play');
      if (btnPlay) {
        btnPlay.textContent = '⏸';
        btnPlay.title = 'Pause';
      }

      const status = this.window.querySelector('#media-status');
      if (status) {
        status.textContent = 'Playing...';
      }

      // Start visualization animation
      this._startVisualization();

      // Update progress
      this.playInterval = setInterval(() => {
        this.currentTime++;
        if (this.currentTime >= this.duration) {
          this._stop();
        } else {
          this._updateProgress();
        }
      }, 1000);
    }

    /**
     * Pause
     * @private
     */
    _pause() {
      this.isPlaying = false;

      const btnPlay = this.window.querySelector('#btn-play');
      if (btnPlay) {
        btnPlay.textContent = '▶';
        btnPlay.title = 'Play';
      }

      const status = this.window.querySelector('#media-status');
      if (status) {
        status.textContent = 'Paused';
      }

      if (this.playInterval) {
        clearInterval(this.playInterval);
        this.playInterval = null;
      }

      this._stopVisualization();
    }

    /**
     * Stop
     * @private
     */
    _stop() {
      this.isPlaying = false;
      this.currentTime = 0;

      const btnPlay = this.window.querySelector('#btn-play');
      if (btnPlay) {
        btnPlay.textContent = '▶';
        btnPlay.title = 'Play';
      }

      const status = this.window.querySelector('#media-status');
      if (status) {
        status.textContent = 'Stopped';
      }

      if (this.playInterval) {
        clearInterval(this.playInterval);
        this.playInterval = null;
      }

      this._stopVisualization();
      this._updateProgress();
    }

    /**
     * Previous track
     * @private
     */
    _previous() {
      this._stop();
      const trackTitle = this.window.querySelector('#track-title');
      if (trackTitle) {
        trackTitle.textContent = 'Previous Track.mp3';
      }
    }

    /**
     * Next track
     * @private
     */
    _next() {
      this._stop();
      const trackTitle = this.window.querySelector('#track-title');
      if (trackTitle) {
        trackTitle.textContent = 'Next Track.mp3';
      }
    }

    /**
     * Update progress bar
     * @private
     */
    _updateProgress() {
      const percent = (this.currentTime / this.duration) * 100;

      const progressBar = this.window.querySelector('#progress-bar');
      if (progressBar) {
        progressBar.style.width = `${percent}%`;
      }

      const currentTimeEl = this.window.querySelector('#current-time');
      if (currentTimeEl) {
        currentTimeEl.textContent = this._formatTime(this.currentTime);
      }
    }

    /**
     * Update volume display
     * @private
     */
    _updateVolumeDisplay() {
      const volumeDisplay = this.window.querySelector('#volume-display');
      if (volumeDisplay) {
        volumeDisplay.textContent = `${this.volume}%`;
      }
    }

    /**
     * Format time (seconds to mm:ss)
     * @private
     */
    _formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Start visualization
     * @private
     */
    _startVisualization() {
      const visualization = this.window.querySelector('#visualization');
      if (!visualization) return;

      const icons = ['♪', '♫', '♬', '♩'];
      let iconIndex = 0;

      this.visualizationInterval = setInterval(() => {
        const icon = visualization.querySelector('div:first-child');
        if (icon) {
          icon.textContent = icons[iconIndex];
          iconIndex = (iconIndex + 1) % icons.length;
        }
      }, 500);
    }

    /**
     * Stop visualization
     * @private
     */
    _stopVisualization() {
      if (this.visualizationInterval) {
        clearInterval(this.visualizationInterval);
        this.visualizationInterval = null;
      }

      const visualization = this.window.querySelector('#visualization');
      if (visualization) {
        const icon = visualization.querySelector('div:first-child');
        if (icon) {
          icon.textContent = '♪';
        }
      }
    }

    /**
     * Cleanup
     * @private
     */
    _cleanup() {
      this._stop();

      if (this.desktop.workspaceSwitcher) {
        this.desktop.workspaceSwitcher.removeWindowFromWorkspace(this.windowId);
      }
    }
  }

  // Export to global scope
  global.BeOSMediaPlayer = BeOSMediaPlayer;

})(window);
