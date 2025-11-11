/**
 * Ubuntu Rhythmbox Music Player
 * GNOME music management and playback application
 */

(function(global) {
  'use strict';

  class UbuntuRhythmbox {
    constructor(windowManager) {
      this.windowManager = windowManager;
      this.windowInstance = null;
      this.isPlaying = false;
      this.currentTrack = 1;
    }

    open() {
      this.windowInstance = this.windowManager.createWindow({
        id: `rhythmbox-${Date.now()}`,
        title: 'Rhythmbox Music Player',
        width: 850,
        height: 550,
        x: 70 + Math.random() * 70,
        y: 60 + Math.random() * 60,
        resizable: true,
        content: this.renderContent()
      });

      this.attachEventListeners();
    }

    renderContent() {
      return `
        <div class="rhythmbox-container">
          <!-- Menu Bar -->
          <div class="rhythmbox-menubar">
            <button class="rhythmbox-menu-item">Music</button>
            <button class="rhythmbox-menu-item">Edit</button>
            <button class="rhythmbox-menu-item">View</button>
            <button class="rhythmbox-menu-item">Control</button>
            <button class="rhythmbox-menu-item">Tools</button>
            <button class="rhythmbox-menu-item">Help</button>
          </div>

          <!-- Toolbar -->
          <div class="rhythmbox-toolbar">
            <button class="rhythmbox-btn" data-action="prev" title="Previous">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M11 3L5 8l6 5V3zM4 3h2v10H4V3z"/>
              </svg>
            </button>
            <button class="rhythmbox-btn rhythmbox-btn-play" data-action="play" title="Play">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                ${this.isPlaying ?
                  '<rect x="4" y="3" width="3" height="10"/><rect x="9" y="3" width="3" height="10"/>' :
                  '<path d="M5 3l8 5-8 5V3z"/>'
                }
              </svg>
            </button>
            <button class="rhythmbox-btn" data-action="next" title="Next">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M5 3l6 5-6 5V3zM12 3h-2v10h2V3z"/>
              </svg>
            </button>
            <div class="rhythmbox-separator"></div>
            <button class="rhythmbox-btn" data-action="shuffle" title="Shuffle">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3 5h3l7-2v3l-4 1 4 1v3l-7-2H3V5z"/>
              </svg>
            </button>
            <button class="rhythmbox-btn" data-action="repeat" title="Repeat">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 5h8v2l3-3-3-3v2H3v5h1V5zm8 6H4V9l-3 3 3 3v-2h9V8h-1v3z"/>
              </svg>
            </button>
          </div>

          <!-- Main Content -->
          <div class="rhythmbox-main">
            <!-- Sidebar -->
            <div class="rhythmbox-sidebar">
              <div class="rhythmbox-source-header">Library</div>
              <div class="rhythmbox-source active" data-source="music">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <circle cx="4" cy="11" r="2"/>
                  <rect x="3" y="2" width="2" height="9"/>
                  <path d="M5 3h6v2l-2 1v5c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.4 0 .8.1 1.1.3V5.5l2-1V5l-5 1.5V3z"/>
                </svg>
                <span>Music</span>
              </div>
              <div class="rhythmbox-source" data-source="playlists">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <rect x="2" y="3" width="10" height="1"/>
                  <rect x="2" y="6" width="10" height="1"/>
                  <rect x="2" y="9" width="10" height="1"/>
                </svg>
                <span>Playlists</span>
              </div>
              <div class="rhythmbox-source" data-source="podcasts">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <circle cx="7" cy="7" r="2"/>
                  <path d="M7 1C3.7 1 1 3.7 1 7h2c0-2.2 1.8-4 4-4s4 1.8 4 4h2c0-3.3-2.7-6-6-6z"/>
                  <path d="M5 10v3h4v-3H5z"/>
                </svg>
                <span>Podcasts</span>
              </div>
              <div class="rhythmbox-source" data-source="radio">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <rect x="2" y="5" width="10" height="7" rx="1"/>
                  <circle cx="5" cy="9" r="2"/>
                  <rect x="8" y="7" width="3" height="1"/>
                  <rect x="8" y="9" width="3" height="1"/>
                  <rect x="8" y="11" width="2" height="1"/>
                </svg>
                <span>Radio</span>
              </div>
            </div>

            <!-- Track List -->
            <div class="rhythmbox-content">
              <!-- Now Playing Area -->
              <div class="rhythmbox-now-playing">
                <div class="rhythmbox-cover-art">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <rect width="80" height="80" fill="#E9E7E3"/>
                    <circle cx="40" cy="40" r="25" fill="#F07746"/>
                    <circle cx="40" cy="40" r="8" fill="white"/>
                  </svg>
                </div>
                <div class="rhythmbox-track-info">
                  <div class="rhythmbox-track-title">Ubuntu Sounds</div>
                  <div class="rhythmbox-track-artist">Various Artists</div>
                  <div class="rhythmbox-track-album">Ubuntu 4.10 Warty Warthog</div>
                  <div class="rhythmbox-progress">
                    <div class="rhythmbox-progress-bar">
                      <div class="rhythmbox-progress-fill" style="width: 45%"></div>
                    </div>
                    <div class="rhythmbox-progress-time">
                      <span>1:23</span>
                      <span>3:05</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Track List Table -->
              <div class="rhythmbox-tracklist">
                <div class="rhythmbox-tracklist-header">
                  <div class="rhythmbox-col-track">#</div>
                  <div class="rhythmbox-col-title">Title</div>
                  <div class="rhythmbox-col-artist">Artist</div>
                  <div class="rhythmbox-col-album">Album</div>
                  <div class="rhythmbox-col-time">Time</div>
                </div>
                <div class="rhythmbox-tracks">
                  <div class="rhythmbox-track ${this.currentTrack === 1 ? 'playing' : ''}" data-track="1">
                    <div class="rhythmbox-col-track">1</div>
                    <div class="rhythmbox-col-title">Ubuntu Sounds</div>
                    <div class="rhythmbox-col-artist">Various Artists</div>
                    <div class="rhythmbox-col-album">Ubuntu 4.10</div>
                    <div class="rhythmbox-col-time">3:05</div>
                  </div>
                  <div class="rhythmbox-track" data-track="2">
                    <div class="rhythmbox-col-track">2</div>
                    <div class="rhythmbox-col-title">GNOME Theme</div>
                    <div class="rhythmbox-col-artist">Desktop Team</div>
                    <div class="rhythmbox-col-album">GNOME 2.8</div>
                    <div class="rhythmbox-col-time">2:47</div>
                  </div>
                  <div class="rhythmbox-track" data-track="3">
                    <div class="rhythmbox-col-track">3</div>
                    <div class="rhythmbox-col-title">Warty Warthog</div>
                    <div class="rhythmbox-col-artist">Canonical Ltd.</div>
                    <div class="rhythmbox-col-album">Ubuntu 4.10</div>
                    <div class="rhythmbox-col-time">4:12</div>
                  </div>
                  <div class="rhythmbox-track" data-track="4">
                    <div class="rhythmbox-col-track">4</div>
                    <div class="rhythmbox-col-title">Human Theme</div>
                    <div class="rhythmbox-col-artist">Design Team</div>
                    <div class="rhythmbox-col-album">Ubuntu Artwork</div>
                    <div class="rhythmbox-col-time">3:28</div>
                  </div>
                  <div class="rhythmbox-track" data-track="5">
                    <div class="rhythmbox-col-track">5</div>
                    <div class="rhythmbox-col-title">Linux for Human Beings</div>
                    <div class="rhythmbox-col-artist">Mark Shuttleworth</div>
                    <div class="rhythmbox-col-album">Ubuntu Philosophy</div>
                    <div class="rhythmbox-col-time">5:30</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Status Bar with Volume -->
          <div class="rhythmbox-statusbar">
            <span>5 tracks, 18 minutes 52 seconds</span>
            <div class="rhythmbox-volume">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 3L4 6H1v4h3l4 3V3z"/>
                <path d="M11 5c.5.5 1 1.5 1 3s-.5 2.5-1 3"/>
              </svg>
              <input type="range" class="rhythmbox-volume-slider" min="0" max="100" value="75">
            </div>
          </div>
        </div>

        <style>
          .rhythmbox-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: white;
            font-family: 'Ubuntu Sans', sans-serif;
          }

          .rhythmbox-menubar {
            display: flex;
            padding: 2px 4px;
            background: #E9E7E3;
            border-bottom: 1px solid #9B9388;
          }

          .rhythmbox-menu-item {
            padding: 4px 12px;
            background: transparent;
            border: none;
            border-radius: 2px;
            font-family: 'Ubuntu Sans', sans-serif;
            font-size: 10pt;
            cursor: pointer;
            transition: background-color 0.1s ease;
          }

          .rhythmbox-menu-item:hover {
            background: rgba(240, 119, 70, 0.15);
          }

          .rhythmbox-toolbar {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 8px;
            background: #F5F5F5;
            border-bottom: 1px solid #CCCCCC;
          }

          .rhythmbox-btn {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            border: 1px solid #9B9388;
            border-radius: 2px;
            cursor: pointer;
            color: #2C2C2C;
            transition: all 0.1s ease;
          }

          .rhythmbox-btn:hover {
            background: #F9F9F9;
            border-color: #F07746;
          }

          .rhythmbox-btn-play {
            background: linear-gradient(to bottom, #F9A86D 0%, #F07746 100%);
            border-color: #DD4814;
            color: white;
          }

          .rhythmbox-btn-play:hover {
            background: linear-gradient(to bottom, #FAB27D 0%, #F18856 100%);
          }

          .rhythmbox-separator {
            width: 1px;
            height: 24px;
            background: #CCCCCC;
            margin: 0 4px;
          }

          .rhythmbox-main {
            display: flex;
            flex: 1;
            overflow: hidden;
          }

          .rhythmbox-sidebar {
            width: 180px;
            background: #F5F5F5;
            border-right: 1px solid #CCCCCC;
            padding: 8px 4px;
          }

          .rhythmbox-source-header {
            padding: 6px 8px;
            font-weight: 600;
            font-size: 9pt;
            color: #666;
            text-transform: uppercase;
          }

          .rhythmbox-source {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            margin: 2px 4px;
            border-radius: 2px;
            cursor: pointer;
            font-size: 10pt;
            transition: background-color 0.1s ease;
          }

          .rhythmbox-source:hover {
            background: rgba(240, 119, 70, 0.1);
          }

          .rhythmbox-source.active {
            background: #F07746;
            color: white;
            font-weight: 500;
          }

          .rhythmbox-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .rhythmbox-now-playing {
            display: flex;
            gap: 16px;
            padding: 16px;
            background: linear-gradient(to bottom, #FFFFFF 0%, #F9F9F9 100%);
            border-bottom: 1px solid #CCCCCC;
          }

          .rhythmbox-cover-art {
            width: 80px;
            height: 80px;
            flex-shrink: 0;
            border: 1px solid #CCCCCC;
            border-radius: 2px;
            overflow: hidden;
          }

          .rhythmbox-track-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .rhythmbox-track-title {
            font-size: 13pt;
            font-weight: 600;
            margin-bottom: 4px;
            color: #2C2C2C;
          }

          .rhythmbox-track-artist {
            font-size: 10pt;
            color: #666;
            margin-bottom: 2px;
          }

          .rhythmbox-track-album {
            font-size: 9pt;
            color: #999;
            margin-bottom: 12px;
          }

          .rhythmbox-progress {
            width: 100%;
            max-width: 400px;
          }

          .rhythmbox-progress-bar {
            height: 6px;
            background: #E0E0E0;
            border-radius: 3px;
            overflow: hidden;
            margin-bottom: 4px;
          }

          .rhythmbox-progress-fill {
            height: 100%;
            background: linear-gradient(to right, #F9A86D 0%, #F07746 100%);
            transition: width 0.3s ease;
          }

          .rhythmbox-progress-time {
            display: flex;
            justify-content: space-between;
            font-size: 8pt;
            color: #999;
          }

          .rhythmbox-tracklist {
            flex: 1;
            overflow-y: auto;
          }

          .rhythmbox-tracklist-header {
            display: flex;
            padding: 6px 12px;
            background: #E9E7E3;
            border-bottom: 1px solid #9B9388;
            font-weight: 600;
            font-size: 9pt;
            position: sticky;
            top: 0;
          }

          .rhythmbox-col-track { width: 40px; flex-shrink: 0; }
          .rhythmbox-col-title { flex: 1; }
          .rhythmbox-col-artist { width: 180px; flex-shrink: 0; }
          .rhythmbox-col-album { width: 180px; flex-shrink: 0; }
          .rhythmbox-col-time { width: 60px; flex-shrink: 0; text-align: right; }

          .rhythmbox-tracks {
            background: white;
          }

          .rhythmbox-track {
            display: flex;
            padding: 8px 12px;
            border-bottom: 1px solid #F0F0F0;
            cursor: pointer;
            transition: background-color 0.1s ease;
          }

          .rhythmbox-track:hover {
            background: #F9F9F9;
          }

          .rhythmbox-track.playing {
            background: #FFF8F0;
            color: #F07746;
            font-weight: 500;
          }

          .rhythmbox-track.playing:hover {
            background: #FFF0E0;
          }

          .rhythmbox-statusbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px 12px;
            background: #E9E7E3;
            border-top: 1px solid #9B9388;
            font-size: 9pt;
            color: #666;
          }

          .rhythmbox-volume {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .rhythmbox-volume-slider {
            width: 80px;
            height: 4px;
            -webkit-appearance: none;
            background: #CCCCCC;
            border-radius: 2px;
            outline: none;
          }

          .rhythmbox-volume-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 12px;
            height: 12px;
            background: #F07746;
            border-radius: 50%;
            cursor: pointer;
          }
        </style>
      `;
    }

    attachEventListeners() {
      const content = this.windowInstance.contentArea;

      content.addEventListener('click', (e) => {
        const btn = e.target.closest('.rhythmbox-btn');
        if (btn) {
          const action = btn.getAttribute('data-action');
          if (action) this.handleAction(action);
        }

        const track = e.target.closest('.rhythmbox-track');
        if (track) {
          const trackNum = parseInt(track.getAttribute('data-track'));
          this.playTrack(trackNum);
        }
      });
    }

    handleAction(action) {
      switch (action) {
        case 'play':
          this.togglePlay();
          break;
        case 'next':
          this.playTrack(this.currentTrack + 1);
          break;
        case 'prev':
          this.playTrack(this.currentTrack - 1);
          break;
      }
    }

    togglePlay() {
      this.isPlaying = !this.isPlaying;
      this.windowInstance.setContent(this.renderContent());
      this.attachEventListeners();
    }

    playTrack(trackNum) {
      if (trackNum < 1 || trackNum > 5) return;
      this.currentTrack = trackNum;
      this.isPlaying = true;
      this.windowInstance.setContent(this.renderContent());
      this.attachEventListeners();
    }
  }

  global.UbuntuRhythmbox = UbuntuRhythmbox;

})(typeof window !== 'undefined' ? window : global);
