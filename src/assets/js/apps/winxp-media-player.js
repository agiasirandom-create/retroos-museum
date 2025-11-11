/**
 * Windows XP Media Player 9
 * Classic Windows Media Player with blue skin
 */

(function(global) {
  'use strict';

  class WinXPMediaPlayer {
    constructor(desktop) {
      this.desktop = desktop;
      this.window = null;
      this.playing = false;
      this.currentTime = 0;
      this.duration = 215; // 3:35 in seconds
    }

    /**
     * Open Media Player window
     */
    open() {
      const windowContent = this.buildContent();

      this.window = this.desktop.windowManager.createWindow({
        id: `mediaplayer-${Date.now()}`,
        title: 'Windows Media Player',
        content: windowContent,
        width: 600,
        height: 450,
        minWidth: 500,
        minHeight: 400,
        resizable: true,
        minimizable: true,
        maximizable: true
      });

      this.setupEventListeners();
    }

    /**
     * Build window content
     */
    buildContent() {
      return `
        <div class="wmp-container" style="display: flex; flex-direction: column; height: 100%; font-family: Tahoma, Arial, sans-serif; font-size: 11px; background: linear-gradient(to bottom, #003C9D 0%, #002266 100%); color: white;">
          <!-- Menu Bar -->
          <div class="wmp-menubar" style="display: flex; background: rgba(0, 0, 0, 0.3); border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding: 2px 4px;">
            <button class="wmp-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px; color: white;">File</button>
            <button class="wmp-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px; color: white;">View</button>
            <button class="wmp-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px; color: white;">Play</button>
            <button class="wmp-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px; color: white;">Tools</button>
            <button class="wmp-menu-btn" style="padding: 4px 8px; background: transparent; border: none; cursor: pointer; border-radius: 2px; color: white;">Help</button>
          </div>

          <!-- Main Content Area -->
          <div class="wmp-content" style="display: flex; flex: 1; overflow: hidden;">
            <!-- Center - Visualization -->
            <div class="wmp-center" style="flex: 1; display: flex; flex-direction: column;">
              <!-- Now Playing Area -->
              <div class="wmp-now-playing" style="flex: 1; display: flex; align-items: center; justify-content: center; background: #000; position: relative;">
                <div class="wmp-visualization" style="text-align: center;">
                  <svg width="200" height="200" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#00A0FF" stroke-width="2" opacity="0.3"/>
                    <circle cx="100" cy="100" r="60" fill="none" stroke="#00D4FF" stroke-width="2" opacity="0.5"/>
                    <circle cx="100" cy="100" r="40" fill="none" stroke="#00FFFF" stroke-width="2" opacity="0.7"/>
                    <circle cx="100" cy="100" r="20" fill="#00FFFF" opacity="0.5"/>
                  </svg>
                  <div style="margin-top: 16px; font-size: 14px; color: #00D4FF;">
                    <div style="font-weight: bold;">Sample Song</div>
                    <div style="font-size: 12px; opacity: 0.8; margin-top: 4px;">Unknown Artist</div>
                  </div>
                </div>
              </div>

              <!-- Seek Bar -->
              <div class="wmp-seek-container" style="padding: 8px 16px; background: rgba(0, 0, 0, 0.3);">
                <input type="range" id="seek-bar" min="0" max="215" value="0" style="width: 100%; cursor: pointer;">
                <div style="display: flex; justify-content: space-between; font-size: 10px; margin-top: 4px; color: #00D4FF;">
                  <span id="current-time">0:00</span>
                  <span id="total-time">3:35</span>
                </div>
              </div>

              <!-- Controls -->
              <div class="wmp-controls" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 16px; background: rgba(0, 0, 0, 0.4);">
                <button class="control-btn" id="shuffle-btn" title="Shuffle" style="width: 32px; height: 32px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; cursor: pointer; color: white;">🔀</button>
                <button class="control-btn" id="prev-btn" title="Previous" style="width: 40px; height: 40px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; cursor: pointer; color: white; font-size: 20px;">⏮️</button>
                <button class="control-btn" id="play-btn" title="Play" style="width: 48px; height: 48px; background: linear-gradient(to bottom, #0066CC 0%, #003D7A 100%); border: 2px solid #00A0FF; border-radius: 50%; cursor: pointer; color: white; font-size: 24px;">▶️</button>
                <button class="control-btn" id="next-btn" title="Next" style="width: 40px; height: 40px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; cursor: pointer; color: white; font-size: 20px;">⏭️</button>
                <button class="control-btn" id="repeat-btn" title="Repeat" style="width: 32px; height: 32px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; cursor: pointer; color: white;">🔁</button>
                <div style="width: 1px; height: 32px; background: rgba(255, 255, 255, 0.2); margin: 0 8px;"></div>
                <button class="control-btn" title="Volume" style="width: 32px; height: 32px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; cursor: pointer; color: white;">🔊</button>
                <input type="range" id="volume-slider" min="0" max="100" value="50" style="width: 80px; cursor: pointer;">
              </div>
            </div>

            <!-- Sidebar - Playlist -->
            <div class="wmp-sidebar" style="width: 200px; background: rgba(0, 0, 0, 0.4); border-left: 1px solid rgba(255, 255, 255, 0.1); display: flex; flex-direction: column;">
              <div style="padding: 8px; background: rgba(0, 0, 0, 0.3); border-bottom: 1px solid rgba(255, 255, 255, 0.1); font-weight: bold; color: #00D4FF;">
                Playlist
              </div>
              <div class="playlist-items" style="flex: 1; overflow-y: auto; padding: 4px;">
                ${this.buildPlaylist()}
              </div>
            </div>
          </div>

          <!-- Status Bar -->
          <div class="wmp-statusbar" style="background: rgba(0, 0, 0, 0.5); border-top: 1px solid rgba(255, 255, 255, 0.1); padding: 4px 8px; display: flex; justify-content: space-between; font-size: 10px; color: #00D4FF;">
            <span>Ready</span>
            <span id="status-info">0 items</span>
          </div>
        </div>
      `;
    }

    /**
     * Build playlist
     */
    buildPlaylist() {
      const items = [
        'Sample Song.mp3',
        'Demo Track.wma',
        'Example Audio.mp3',
        'Test Music.wma'
      ];

      return items.map((item, index) => `
        <div class="playlist-item" data-index="${index}" style="padding: 6px 8px; cursor: pointer; border-radius: 4px; margin-bottom: 2px; transition: background-color 0.2s; ${index === 0 ? 'background: rgba(0, 164, 255, 0.3);' : ''}" onmouseover="this.style.background='rgba(255, 255, 255, 0.1)'" onmouseout="this.style.background='${index === 0 ? 'rgba(0, 164, 255, 0.3)' : 'transparent'}'">
          <div style="font-size: 11px;">${item}</div>
          <div style="font-size: 9px; opacity: 0.7; margin-top: 2px;">3:35</div>
        </div>
      `).join('');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
      // Play/Pause button
      const playBtn = this.window.element.querySelector('#play-btn');
      if (playBtn) {
        playBtn.addEventListener('click', () => {
          this.playing = !this.playing;
          playBtn.textContent = this.playing ? '⏸️' : '▶️';
          playBtn.title = this.playing ? 'Pause' : 'Play';
        });
      }

      // Previous button
      const prevBtn = this.window.element.querySelector('#prev-btn');
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          this.currentTime = 0;
          this.updateTimeDisplay();
        });
      }

      // Next button
      const nextBtn = this.window.element.querySelector('#next-btn');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          alert('Next track - In a full implementation, this would play the next song.');
        });
      }

      // Seek bar
      const seekBar = this.window.element.querySelector('#seek-bar');
      if (seekBar) {
        seekBar.addEventListener('input', (e) => {
          this.currentTime = parseInt(e.target.value);
          this.updateTimeDisplay();
        });
      }

      // Volume slider
      const volumeSlider = this.window.element.querySelector('#volume-slider');
      if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
          // Volume control would be implemented here
        });
      }

      // Control button hover effects
      const controlButtons = this.window.element.querySelectorAll('.control-btn');
      controlButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
          btn.style.background = 'rgba(255, 255, 255, 0.2)';
          btn.style.transform = 'scale(1.05)';
          btn.style.transition = 'all 0.2s';
        });

        btn.addEventListener('mouseleave', () => {
          if (btn.id === 'play-btn') {
            btn.style.background = 'linear-gradient(to bottom, #0066CC 0%, #003D7A 100%)';
          } else {
            btn.style.background = 'rgba(255, 255, 255, 0.1)';
          }
          btn.style.transform = 'scale(1)';
        });
      });

      // Menu buttons
      const menuButtons = this.window.element.querySelectorAll('.wmp-menu-btn');
      menuButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
          btn.style.background = 'rgba(255, 255, 255, 0.2)';
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.background = 'transparent';
        });

        btn.addEventListener('click', () => {
          this.handleMenuClick(btn.textContent.trim());
        });
      });

      // Playlist items
      const playlistItems = this.window.element.querySelectorAll('.playlist-item');
      playlistItems.forEach(item => {
        item.addEventListener('click', () => {
          playlistItems.forEach(i => i.style.background = 'transparent');
          item.style.background = 'rgba(0, 164, 255, 0.3)';
        });
      });
    }

    /**
     * Update time display
     */
    updateTimeDisplay() {
      const currentTimeEl = this.window.element.querySelector('#current-time');
      if (currentTimeEl) {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = Math.floor(this.currentTime % 60);
        currentTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }

      const seekBar = this.window.element.querySelector('#seek-bar');
      if (seekBar) {
        seekBar.value = this.currentTime;
      }
    }

    /**
     * Handle menu click
     */
    handleMenuClick(menu) {
      switch(menu) {
        case 'File':
          alert('File menu - Open, Add to Library, Burn...');
          break;
        case 'View':
          alert('View menu - Full Mode, Skin Mode, Visualizations...');
          break;
        case 'Play':
          alert('Play menu - Play/Pause, Stop, Shuffle, Repeat...');
          break;
        case 'Tools':
          alert('Tools menu - Options, Plug-ins, Download Visualizations...');
          break;
        case 'Help':
          alert('Windows Media Player Help\n\nWindows Media Player 9\nRetroOS Museum Project');
          break;
      }
    }
  }

  // Export to global scope
  global.WinXPMediaPlayer = WinXPMediaPlayer;

})(typeof window !== 'undefined' ? window : global);
