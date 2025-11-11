/**
 * BeOS SoundPlay
 * Audio player showcasing BeOS's powerful media kit
 * Features: playback controls, playlist, loop/shuffle
 */

(function(global) {
  'use strict';

  /**
   * BeOS SoundPlay Application
   */
  class BeOSSoundPlay {
    constructor(desktop) {
      this.desktop = desktop;
      this.window = null;
      this.windowId = null;
      this.isPlaying = false;
      this.currentTrack = 0;
      this.isLooping = false;
      this.isShuffling = false;
      this.currentTime = 0;
      this.duration = 180; // 3 minutes
      this.volume = 75;
      this.playlist = this._getMockPlaylist();
    }

    /**
     * Launch SoundPlay
     */
    launch() {
      const content = this._createContent();

      this.windowId = `soundplay-${Date.now()}`;
      this.window = this.desktop.windowSystem.createWindow({
        id: this.windowId,
        title: 'SoundPlay',
        width: 400,
        height: 350,
        content: content,
        resizable: true,
        tabPosition: 'top',
        menuItems: [
          { label: 'File', onClick: () => {} },
          { label: 'Controls', onClick: () => {} },
          { label: 'View', onClick: () => {} }
        ],
        onClose: () => this._cleanup()
      });

      // Add to workspace
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

      // Update display
      this._updateDisplay();
    }

    /**
     * Create SoundPlay content
     * @private
     */
    _createContent() {
      return `
        <div class="soundplay-window" style="display: flex; flex-direction: column; height: 100%; background: #DCDCDC;">
          <!-- Now Playing Info -->
          <div style="padding: 12px; background: #EEEEEE; border-bottom: 1px solid #808080; text-align: center;">
            <div id="track-title" style="font-size: 12px; font-weight: bold; margin-bottom: 4px;">No Track Selected</div>
            <div id="track-artist" style="font-size: 10px; color: #666;">Unknown Artist</div>
          </div>

          <!-- Progress Bar -->
          <div style="padding: 12px; background: #DCDCDC;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span id="time-current" style="font-size: 9px; min-width: 40px;">0:00</span>
              <div style="flex: 1; height: 8px; background: #808080; border: 1px inset #666; position: relative; cursor: pointer;" id="progress-bar">
                <div id="progress-fill" style="width: 0%; height: 100%; background: linear-gradient(180deg, #5599FF 0%, #336699 100%);"></div>
              </div>
              <span id="time-duration" style="font-size: 9px; min-width: 40px;">3:00</span>
            </div>
          </div>

          <!-- Transport Controls -->
          <div style="display: flex; justify-content: center; align-items: center; gap: 8px; padding: 12px; background: #DCDCDC; border-bottom: 1px solid #808080;">
            <button class="beos-button" data-action="prev" style="width: 36px; height: 28px; font-size: 14px;">⏮</button>
            <button class="beos-button" id="play-pause-btn" data-action="play-pause" style="width: 48px; height: 32px; font-size: 16px;">▶</button>
            <button class="beos-button" data-action="stop" style="width: 36px; height: 28px; font-size: 14px;">⏹</button>
            <button class="beos-button" data-action="next" style="width: 36px; height: 28px; font-size: 14px;">⏭</button>
          </div>

          <!-- Options -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #DCDCDC; border-bottom: 1px solid #808080;">
            <div style="display: flex; gap: 8px;">
              <button class="beos-button" id="loop-btn" data-action="loop" style="padding: 4px 10px; font-size: 9px;">Loop</button>
              <button class="beos-button" id="shuffle-btn" data-action="shuffle" style="padding: 4px 10px; font-size: 9px;">Shuffle</button>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 9px;">🔊</span>
              <input type="range" id="volume-slider" min="0" max="100" value="75" style="width: 80px;">
              <span id="volume-display" style="font-size: 9px; min-width: 30px;">75%</span>
            </div>
          </div>

          <!-- Playlist -->
          <div style="flex: 1; overflow: auto; background: #FFF; margin: 0; padding: 0;">
            <div id="playlist" style="font-size: 10px;">
              <!-- Playlist items will be added here -->
            </div>
          </div>

          <!-- Status Bar -->
          <div class="beos-statusbar">
            <span id="player-status">Stopped</span>
            <span style="margin-left: auto;" id="track-count">${this.playlist.length} tracks</span>
          </div>
        </div>
      `;
    }

    /**
     * Setup event handlers
     * @private
     */
    _setupEventHandlers() {
      // Transport controls
      this.window.addEventListener('click', (e) => {
        const button = e.target.closest('[data-action]');
        if (!button) return;

        const action = button.dataset.action;
        switch (action) {
          case 'play-pause':
            this._togglePlayPause();
            break;
          case 'stop':
            this._stop();
            break;
          case 'prev':
            this._previousTrack();
            break;
          case 'next':
            this._nextTrack();
            break;
          case 'loop':
            this._toggleLoop();
            break;
          case 'shuffle':
            this._toggleShuffle();
            break;
        }
      });

      // Volume slider
      const volumeSlider = this.window.querySelector('#volume-slider');
      if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
          this.volume = parseInt(e.target.value);
          const volumeDisplay = this.window.querySelector('#volume-display');
          if (volumeDisplay) {
            volumeDisplay.textContent = `${this.volume}%`;
          }
        });
      }

      // Render playlist
      this._renderPlaylist();
    }

    /**
     * Render playlist
     * @private
     */
    _renderPlaylist() {
      const playlistEl = this.window.querySelector('#playlist');
      if (!playlistEl) return;

      playlistEl.innerHTML = this.playlist.map((track, index) => `
        <div class="playlist-item ${index === this.currentTrack ? 'active' : ''}"
             data-index="${index}"
             style="padding: 6px 10px; cursor: pointer; border-bottom: 1px solid #EEEEEE; ${index === this.currentTrack ? 'background: #4682B4; color: #FFF;' : ''}"
             onmouseenter="if (!this.classList.contains('active')) this.style.background='#E8E8E8'"
             onmouseleave="if (!this.classList.contains('active')) this.style.background=''">
          <div style="font-weight: bold; margin-bottom: 2px;">${track.title}</div>
          <div style="font-size: 9px; opacity: 0.8;">${track.artist} - ${track.duration}</div>
        </div>
      `).join('');

      // Add click handlers
      playlistEl.querySelectorAll('.playlist-item').forEach(item => {
        item.addEventListener('click', () => {
          const index = parseInt(item.dataset.index);
          this._selectTrack(index);
        });
      });
    }

    /**
     * Select track
     * @private
     */
    _selectTrack(index) {
      this.currentTrack = index;
      this.currentTime = 0;
      this._updateDisplay();
      this._renderPlaylist();

      // Auto-play if currently playing
      if (this.isPlaying) {
        this._play();
      }
    }

    /**
     * Toggle play/pause
     * @private
     */
    _togglePlayPause() {
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
      const playBtn = this.window.querySelector('#play-pause-btn');
      if (playBtn) {
        playBtn.textContent = '⏸';
      }

      const status = this.window.querySelector('#player-status');
      if (status) {
        status.textContent = 'Playing';
      }

      // Simulate playback (would use audio API in real implementation)
      console.log('Playing:', this.playlist[this.currentTrack].title);
    }

    /**
     * Pause
     * @private
     */
    _pause() {
      this.isPlaying = false;
      const playBtn = this.window.querySelector('#play-pause-btn');
      if (playBtn) {
        playBtn.textContent = '▶';
      }

      const status = this.window.querySelector('#player-status');
      if (status) {
        status.textContent = 'Paused';
      }
    }

    /**
     * Stop
     * @private
     */
    _stop() {
      this.isPlaying = false;
      this.currentTime = 0;
      const playBtn = this.window.querySelector('#play-pause-btn');
      if (playBtn) {
        playBtn.textContent = '▶';
      }

      const status = this.window.querySelector('#player-status');
      if (status) {
        status.textContent = 'Stopped';
      }

      this._updateDisplay();
    }

    /**
     * Previous track
     * @private
     */
    _previousTrack() {
      this.currentTrack--;
      if (this.currentTrack < 0) {
        this.currentTrack = this.playlist.length - 1;
      }
      this.currentTime = 0;
      this._updateDisplay();
      this._renderPlaylist();

      if (this.isPlaying) {
        this._play();
      }
    }

    /**
     * Next track
     * @private
     */
    _nextTrack() {
      this.currentTrack++;
      if (this.currentTrack >= this.playlist.length) {
        this.currentTrack = 0;
      }
      this.currentTime = 0;
      this._updateDisplay();
      this._renderPlaylist();

      if (this.isPlaying) {
        this._play();
      }
    }

    /**
     * Toggle loop
     * @private
     */
    _toggleLoop() {
      this.isLooping = !this.isLooping;
      const loopBtn = this.window.querySelector('#loop-btn');
      if (loopBtn) {
        loopBtn.style.background = this.isLooping ? '#336699' : '';
        loopBtn.style.color = this.isLooping ? '#FFF' : '';
      }
    }

    /**
     * Toggle shuffle
     * @private
     */
    _toggleShuffle() {
      this.isShuffling = !this.isShuffling;
      const shuffleBtn = this.window.querySelector('#shuffle-btn');
      if (shuffleBtn) {
        shuffleBtn.style.background = this.isShuffling ? '#336699' : '';
        shuffleBtn.style.color = this.isShuffling ? '#FFF' : '';
      }
    }

    /**
     * Update display
     * @private
     */
    _updateDisplay() {
      const track = this.playlist[this.currentTrack];

      const titleEl = this.window.querySelector('#track-title');
      if (titleEl) {
        titleEl.textContent = track.title;
      }

      const artistEl = this.window.querySelector('#track-artist');
      if (artistEl) {
        artistEl.textContent = track.artist;
      }

      const currentTimeEl = this.window.querySelector('#time-current');
      if (currentTimeEl) {
        currentTimeEl.textContent = this._formatTime(this.currentTime);
      }

      const durationEl = this.window.querySelector('#time-duration');
      if (durationEl) {
        durationEl.textContent = track.duration;
      }

      // Update window title
      const titleTabEl = this.window.querySelector('.beos-window-tab-title');
      if (titleTabEl) {
        titleTabEl.textContent = `SoundPlay - ${track.title}`;
      }
    }

    /**
     * Format time
     * @private
     */
    _formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Get mock playlist
     * @private
     */
    _getMockPlaylist() {
      return [
        { title: 'Digital Sunrise', artist: 'BeOS Sound Team', duration: '3:24' },
        { title: 'System Startup', artist: 'BeOS Sound Team', duration: '0:05' },
        { title: 'Electronic Dreams', artist: 'Demo Artist', duration: '4:12' },
        { title: 'Multimedia Flow', artist: 'Demo Artist', duration: '3:47' },
        { title: 'Binary Beat', artist: 'Demo Artist', duration: '5:03' }
      ];
    }

    /**
     * Cleanup
     * @private
     */
    _cleanup() {
      if (this.desktop.workspaceSwitcher) {
        this.desktop.workspaceSwitcher.removeWindowFromWorkspace(this.windowId);
      }
    }
  }

  // Export to global scope
  global.BeOSSoundPlay = BeOSSoundPlay;

})(window);
