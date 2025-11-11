/**
 * Windows XP Search Companion
 * File and folder search with animated assistant
 */

(function(global) {
  'use strict';

  class WinXPSearch {
    constructor(desktop) {
      this.desktop = desktop;
      this.window = null;
    }

    /**
     * Open Search window
     */
    open() {
      const windowContent = this.buildContent();

      this.window = this.desktop.windowManager.createWindow({
        id: `search-${Date.now()}`,
        title: 'Search Results',
        content: windowContent,
        width: 600,
        height: 450,
        minWidth: 500,
        minHeight: 400,
        resizable: true,
        minimizable: true,
        maximizable: true
      });
    }

    /**
     * Build window content
     */
    buildContent() {
      return `
        <div class="search-container" style="display: flex; height: 100%; font-family: Tahoma, Arial, sans-serif; font-size: 11px;">
          <!-- Left Panel - Search Companion -->
          <div class="search-companion" style="width: 200px; background: linear-gradient(to bottom, #D6E9F8 0%, #B3D9F0 100%); border-right: 1px solid #ACA899; padding: 16px; overflow-y: auto;">
            <!-- Search Companion Header -->
            <div style="text-align: center; margin-bottom: 16px;">
              <div style="font-size: 48px; margin-bottom: 8px;">=</div>
              <h3 style="margin: 0; color: #0054E3; font-size: 14px;">Search Companion</h3>
            </div>

            <!-- Search Options -->
            <div style="background: white; padding: 12px; border: 1px solid #ACA899; border-radius: 4px; margin-bottom: 12px;">
              <p style="margin: 0 0 12px 0; font-weight: bold;">What do you want to search for?</p>

              <div class="search-option" style="padding: 6px; margin-bottom: 4px; cursor: pointer; border-radius: 2px;" onmouseover="this.style.background='#E8F2FF'" onmouseout="this.style.background=''" onclick="document.getElementById('search-type').textContent='Pictures, music, or video'">
                =÷ Pictures, music, or video
              </div>
              <div class="search-option" style="padding: 6px; margin-bottom: 4px; cursor: pointer; border-radius: 2px;" onmouseover="this.style.background='#E8F2FF'" onmouseout="this.style.background=''" onclick="document.getElementById('search-type').textContent='Documents'">
                =Ä Documents (word processing, spreadsheet, etc.)
              </div>
              <div class="search-option" style="padding: 6px; margin-bottom: 4px; cursor: pointer; border-radius: 2px;" onmouseover="this.style.background='#E8F2FF'" onmouseout="this.style.background=''" onclick="document.getElementById('search-type').textContent='All files and folders'">
                =Á All files and folders
              </div>
              <div class="search-option" style="padding: 6px; margin-bottom: 4px; cursor: pointer; border-radius: 2px;" onmouseover="this.style.background='#E8F2FF'" onmouseout="this.style.background=''" onclick="document.getElementById('search-type').textContent='Computer on the network'">
                =» Computers or people
              </div>
            </div>

            <!-- Search Form -->
            <div style="background: white; padding: 12px; border: 1px solid #ACA899; border-radius: 4px;">
              <label style="display: block; margin-bottom: 4px; font-weight: bold;">All or part of the file name:</label>
              <input type="text" id="search-filename" placeholder="Search..." style="width: 100%; padding: 4px; border: 1px inset #ACA899; margin-bottom: 12px; font-family: Tahoma; font-size: 11px;">

              <label style="display: block; margin-bottom: 4px; font-weight: bold;">Look in:</label>
              <select style="width: 100%; padding: 4px; border: 1px inset #ACA899; margin-bottom: 12px; font-family: Tahoma; font-size: 11px;">
                <option>My Computer</option>
                <option>Local Hard Drives (C:)</option>
                <option>My Documents</option>
                <option>Desktop</option>
              </select>

              <button onclick="alert('Searching for: ' + document.getElementById('search-filename').value)" style="width: 100%; padding: 6px; background: linear-gradient(to bottom, #4B91FF 0%, #3C81F3 100%); border: 1px solid #0054E3; border-radius: 3px; color: white; font-weight: bold; cursor: pointer;">Search</button>
            </div>
          </div>

          <!-- Right Panel - Results -->
          <div class="search-results" style="flex: 1; display: flex; flex-direction: column; background: white;">
            <!-- Results Header -->
            <div style="background: linear-gradient(to bottom, #ECE9D8 0%, #D6D3CE 100%); border-bottom: 1px solid #ACA899; padding: 8px 12px; font-weight: bold; color: #0054E3;">
              <span id="search-type">Search Results</span>
            </div>

            <!-- Results Content -->
            <div style="flex: 1; padding: 20px; text-align: center; color: #666;">
              <div style="font-size: 64px; margin-bottom: 16px; opacity: 0.3;">=</div>
              <p>Enter your search criteria and click Search to begin.</p>
              <p style="font-size: 10px; margin-top: 20px;">Tip: Use wildcards like * and ? to broaden your search.</p>
            </div>

            <!-- Status Bar -->
            <div style="background: #ECE9D8; border-top: 1px solid #ACA899; padding: 4px 12px; font-size: 10px;">
              Ready
            </div>
          </div>
        </div>
      `;
    }
  }

  // Export to global scope
  global.WinXPSearch = WinXPSearch;

})(typeof window !== 'undefined' ? window : global);
