/**
 * Ubuntu Totem Movie Player
 * GNOME video player with clean interface
 */

(function(global) {
  'use strict';

  class UbuntuTotem {
    constructor(windowManager) {
      this.windowManager = windowManager;
      this.windowInstance = null;
      this.isPlaying = false;
      this.showPlaylist = true;
    }

    open() {
      this.windowInstance = this.windowManager.createWindow({
        id: `totem-${Date.now()}`,
        title: 'Totem Movie Player',
        width: 800,
        height: 550,
        x: 90 + Math.random() * 80,
        y: 70 + Math.random() * 70,
        resizable: true,
        content: this.renderContent()
      });

      this.attachEventListeners();
    }

    renderContent() {
      return `
        <div class="totem-container">
          <!-- Menu Bar -->
          <div class="totem-menubar">
            <button class="totem-menu-item">Movie</button>
            <button class="totem-menu-item">Edit</button>
            <button class="totem-menu-item">View</button>
            <button class="totem-menu-item">Go</button>
            <button class="totem-menu-item">Sound</button>
            <button class="totem-menu-item">Help</button>
          </div>

          <!-- Main Content Area -->
          <div class="totem-main">
            <!-- Video Display Area -->
            <div class="totem-video-area">
              <div class="totem-video-screen">
                <div class="totem-video-placeholder">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <rect x="10" y="20" width="60" height="40" rx="4" fill="#F07746" opacity="0.3"/>
                    <path d="M35 30l20 15-20 15V30z" fill="#F07746"/>
                  </svg>
                  <p style="margin-top: 16px; color: #999; font-size: 11pt;">
                    No video loaded
                  </p>
                </div>
              </div>

              <!-- Video Controls -->
              <div class="totem-controls">
                <div class="totem-controls-row">
                  <button class="totem-control-btn" data-action="prev" title="Previous">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M11 3L5 8l6 5V3zM4 3h2v10H4V3z"/>
                    </svg>
                  </button>
                  <button class="totem-control-btn totem-btn-play" data-action="play" title="Play">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      ${this.isPlaying ?
                        '<rect x="5" y="4" width="3" height="12"/><rect x="11" y="4" width="3" height="12"/>' :
                        '<path d="M6 4l10 6-10 6V4z"/>'
                      }
                    </svg>
                  </button>
                  <button class="totem-control-btn" data-action="next" title="Next">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M5 3l6 5-6 5V3zM12 3h-2v10h2V3z"/>
                    </svg>
                  </button>

                  <div class="totem-time-display">
                    <span>0:00</span>
                    <span class="totem-time-separator">/</span>
                    <span>0:00</span>
                  </div>

                  <div class="totem-spacer"></div>

                  <button class="totem-control-btn" data-action="volume" title="Volume">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 3L4 6H1v4h3l4 3V3z"/>
                      <path d="M11 5c.5.5 1 1.5 1 3s-.5 2.5-1 3" stroke="currentColor" stroke-width="1.5" fill="none"/>
                    </svg>
                  </button>
                  <input type="range" class="totem-volume-slider" min="0" max="100" value="80" title="Volume">

                  <button class="totem-control-btn" data-action="fullscreen" title="Fullscreen">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M2 2v4h2V4h2V2H2zM12 2v2h2v2h2V2h-4zM2 10v4h4v-2H4v-2H2zM14 10v2h-2v2h4v-4h-2z"/>
                    </svg>
                  </button>
                </div>

                <!-- Seek Bar -->
                <div class="totem-seekbar">
                  <input type="range" class="totem-seek-slider" min="0" max="100" value="0">
                </div>
              </div>
            </div>

            <!-- Playlist Sidebar -->
            ${this.showPlaylist ? `
            <div class="totem-playlist">
              <div class="totem-playlist-header">
                <span>Playlist</span>
                <button class="totem-playlist-close" data-action="toggle-playlist" title="Hide Playlist">×</button>
              </div>
              <div class="totem-playlist-content">
                <div class="totem-playlist-empty">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.3">
                    <rect x="8" y="10" width="32" height="4" fill="currentColor"/>
                    <rect x="8" y="18" width="32" height="4" fill="currentColor"/>
                    <rect x="8" y="26" width="32" height="4" fill="currentColor"/>
                    <rect x="8" y="34" width="32" height="4" fill="currentColor"/>
                  </svg>
                  <p style="margin-top: 12px; color: #999; font-size: 10pt;">
                    Playlist is empty
                  </p>
                </div>
              </div>
              <div class="totem-playlist-actions">
                <button class="totem-playlist-btn" title="Add">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <path d="M7 3v8M3 7h8" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  Add
                </button>
                <button class="totem-playlist-btn" title="Remove">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <path d="M3 7h8" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  Remove
                </button>
                <button class="totem-playlist-btn" title="Clear">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <path d="M5 2h4v1H5V2zM3 4h8l-1 8H4L3 4z"/>
                  </svg>
                  Clear
                </button>
              </div>
            </div>
            ` : ''}
          </div>

          <!-- Status Bar -->
          <div class="totem-statusbar">
            <span>Ready</span>
          </div>
        </div>

        <style>
          .totem-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: #2C2C2C;
            font-family: 'Ubuntu Sans', sans-serif;
          }

          .totem-menubar {
            display: flex;
            padding: 2px 4px;
            background: #E9E7E3;
            border-bottom: 1px solid #9B9388;
          }

          .totem-menu-item {
            padding: 4px 12px;
            background: transparent;
            border: none;
            border-radius: 2px;
            font-size: 10pt;
            cursor: pointer;
            transition: background-color 0.1s ease;
          }

          .totem-menu-item:hover {
            background: rgba(240, 119, 70, 0.15);
          }

          .totem-main {
            display: flex;
            flex: 1;
            overflow: hidden;
          }

          .totem-video-area {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: #000000;
          }

          .totem-video-screen {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #000000;
          }

          .totem-video-placeholder {
            text-align: center;
          }

          .totem-controls {
            background: linear-gradient(to bottom, #3C3C3C 0%, #2C2C2C 100%);
            border-top: 1px solid #1C1C1C;
            padding: 8px 12px;
          }

          .totem-controls-row {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 8px;
          }

          .totem-control-btn {
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            color: white;
            cursor: pointer;
            transition: all 0.15s ease;
          }

          .totem-control-btn:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(240, 119, 70, 0.5);
          }

          .totem-btn-play {
            background: linear-gradient(to bottom, #F9A86D 0%, #F07746 100%);
            border-color: #DD4814;
          }

          .totem-btn-play:hover {
            background: linear-gradient(to bottom, #FAB27D 0%, #F18856 100%);
          }

          .totem-time-display {
            display: flex;
            align-items: center;
            gap: 6px;
            color: white;
            font-size: 10pt;
            margin-left: 8px;
          }

          .totem-time-separator {
            opacity: 0.5;
          }

          .totem-spacer {
            flex: 1;
          }

          .totem-volume-slider {
            width: 80px;
            height: 4px;
            -webkit-appearance: none;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
            outline: none;
          }

          .totem-volume-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 12px;
            height: 12px;
            background: #F07746;
            border-radius: 50%;
            cursor: pointer;
          }

          .totem-seekbar {
            width: 100%;
          }

          .totem-seek-slider {
            width: 100%;
            height: 6px;
            -webkit-appearance: none;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            outline: none;
          }

          .totem-seek-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 14px;
            height: 14px;
            background: #F07746;
            border-radius: 50%;
            cursor: pointer;
          }

          .totem-playlist {
            width: 250px;
            background: #F5F5F5;
            border-left: 1px solid #CCCCCC;
            display: flex;
            flex-direction: column;
          }

          .totem-playlist-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
            background: #E9E7E3;
            border-bottom: 1px solid #9B9388;
            font-weight: 600;
            font-size: 10pt;
          }

          .totem-playlist-close {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            border-radius: 2px;
            font-size: 18pt;
            line-height: 1;
            cursor: pointer;
            color: #666;
            transition: all 0.1s ease;
          }

          .totem-playlist-close:hover {
            background: rgba(240, 119, 70, 0.15);
            color: #F07746;
          }

          .totem-playlist-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
          }

          .totem-playlist-empty {
            text-align: center;
            padding: 40px 20px;
          }

          .totem-playlist-actions {
            display: flex;
            gap: 4px;
            padding: 8px;
            background: #E9E7E3;
            border-top: 1px solid #9B9388;
          }

          .totem-playlist-btn {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            padding: 6px 8px;
            background: white;
            border: 1px solid #9B9388;
            border-radius: 2px;
            font-size: 9pt;
            cursor: pointer;
            transition: all 0.1s ease;
          }

          .totem-playlist-btn:hover {
            border-color: #F07746;
            background: #FFF8F0;
          }

          .totem-statusbar {
            padding: 4px 12px;
            background: #E9E7E3;
            border-top: 1px solid #9B9388;
            font-size: 9pt;
            color: #666;
          }
        </style>
      `;
    }

    attachEventListeners() {
      const content = this.windowInstance.contentArea;

      content.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (btn) {
          const action = btn.getAttribute('data-action');
          this.handleAction(action);
        }
      });
    }

    handleAction(action) {
      switch (action) {
        case 'play':
          this.togglePlay();
          break;
        case 'toggle-playlist':
          this.togglePlaylist();
          break;
        case 'fullscreen':
          alert('Fullscreen mode would activate');
          break;
      }
    }

    togglePlay() {
      this.isPlaying = !this.isPlaying;
      this.windowInstance.setContent(this.renderContent());
      this.attachEventListeners();
    }

    togglePlaylist() {
      this.showPlaylist = !this.showPlaylist;
      this.windowInstance.setContent(this.renderContent());
      this.attachEventListeners();
    }
  }

  global.UbuntuTotem = UbuntuTotem;

})(typeof window !== 'undefined' ? window : global);
