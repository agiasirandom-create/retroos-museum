/**
 * RetroOS Museum - Demos Page JavaScript
 * Interactive OS Showcase functionality
 */

(function() {
  'use strict';

  // OS Data
  const OS_DATA = [
    {
      id: 'windows-31',
      name: 'Windows 3.1',
      year: 1992,
      category: 'windows',
      url: '/os/windows-31/',
      features: ['program-manager', 'menu-bar', 'widgets']
    },
    {
      id: 'windows-95',
      name: 'Windows 95',
      year: 1995,
      category: 'windows',
      url: '/os/windows-95/',
      features: ['start-menu', 'taskbar']
    },
    {
      id: 'windows-xp',
      name: 'Windows XP',
      year: 2001,
      category: 'windows',
      url: '/os/windows-xp/',
      features: ['start-menu', 'taskbar', 'glass']
    },
    {
      id: 'windows-7',
      name: 'Windows 7',
      year: 2009,
      category: 'windows',
      url: '/os/windows-7/',
      features: ['start-menu', 'taskbar', 'glass', 'widgets']
    },
    {
      id: 'macos-system7',
      name: 'Mac OS System 7',
      year: 1991,
      category: 'macos',
      url: '/os/macos-system7/',
      features: ['menu-bar', 'dock']
    },
    {
      id: 'macos-9',
      name: 'Mac OS 9',
      year: 1999,
      category: 'macos',
      url: '/os/macos-9/',
      features: ['menu-bar', 'dock']
    },
    {
      id: 'macos-x-cheetah',
      name: 'Mac OS X Cheetah',
      year: 2001,
      category: 'macos',
      url: '/os/macos-x-cheetah/',
      features: ['menu-bar', 'dock', 'glass']
    },
    {
      id: 'ubuntu-warty',
      name: 'Ubuntu 4.10 Warty',
      year: 2004,
      category: 'linux',
      url: '/os/ubuntu-warty/',
      features: ['menu-bar', 'taskbar', 'workspaces']
    },
    {
      id: 'beos-r5',
      name: 'BeOS R5',
      year: 2000,
      category: 'other',
      url: '/os/beos-r5/',
      features: ['menu-bar', 'taskbar', 'workspaces']
    },
    {
      id: 'ios-1',
      name: 'iOS 1.0',
      year: 2007,
      category: 'mobile',
      url: '/os/ios-1/',
      features: ['touch', 'dock']
    }
  ];

  // Feature mapping
  const FEATURE_MAP = {
    'start-menu': ['windows-95', 'windows-xp', 'windows-7'],
    'dock': ['macos-system7', 'macos-9', 'macos-x-cheetah', 'ios-1'],
    'taskbar': ['windows-95', 'windows-xp', 'windows-7', 'ubuntu-warty', 'beos-r5'],
    'menu-bar': ['windows-31', 'macos-system7', 'macos-9', 'macos-x-cheetah', 'ubuntu-warty', 'beos-r5'],
    'workspaces': ['ubuntu-warty', 'beos-r5'],
    'glass': ['windows-xp', 'windows-7', 'macos-x-cheetah'],
    'touch': ['ios-1'],
    'widgets': ['windows-31', 'windows-7']
  };

  class DemosPage {
    constructor() {
      this.init();
    }

    init() {
      this.setupGalleryFilters();
      this.setupFeatureExplorer();
      this.setupTimeline();
      this.setupComparison();
      this.setupQuickLauncher();
      this.setupKeyboardShortcuts();
      this.setupModals();
      this.updateClock();
    }

    /**
     * Gallery Filters
     */
    setupGalleryFilters() {
      const filterButtons = document.querySelectorAll('.filter-btn');
      const osCards = document.querySelectorAll('.os-card');

      filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const filter = btn.dataset.filter;

          // Update active state
          filterButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          // Filter cards
          osCards.forEach(card => {
            const category = card.dataset.category;

            if (filter === 'all' || category === filter) {
              card.style.display = '';
              card.style.animation = 'fade-in 0.4s ease-out';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });
    }

    /**
     * Feature Explorer
     */
    setupFeatureExplorer() {
      const featureTags = document.querySelectorAll('.feature-tag');
      const resultsContainer = document.getElementById('feature-results');
      let selectedFeatures = new Set();

      featureTags.forEach(tag => {
        tag.addEventListener('click', () => {
          const feature = tag.dataset.feature;

          // Toggle selection
          if (selectedFeatures.has(feature)) {
            selectedFeatures.delete(feature);
            tag.classList.remove('active');
          } else {
            selectedFeatures.add(feature);
            tag.classList.add('active');
          }

          // Update results
          this.updateFeatureResults(selectedFeatures, resultsContainer);
        });
      });
    }

    updateFeatureResults(selectedFeatures, container) {
      if (selectedFeatures.size === 0) {
        container.innerHTML = '<p class="feature-results-text">Select features to filter operating systems</p>';
        return;
      }

      // Find OS that match ALL selected features
      const matchingOS = OS_DATA.filter(os => {
        return Array.from(selectedFeatures).every(feature => {
          const osIds = FEATURE_MAP[feature] || [];
          return osIds.includes(os.id);
        });
      });

      if (matchingOS.length === 0) {
        container.innerHTML = '<p class="feature-results-text">No operating systems match all selected features</p>';
        return;
      }

      // Display results
      const html = `
        <h3 style="margin-bottom: 1rem; color: var(--demo-text);">
          Found ${matchingOS.length} operating system${matchingOS.length !== 1 ? 's' : ''}
        </h3>
        <div class="os-grid" style="margin-top: 1.5rem;">
          ${matchingOS.map(os => `
            <a href="${os.url}" class="os-card" style="text-decoration: none;">
              <div class="os-card-body">
                <h4 style="font-size: 1.25rem; margin: 0 0 0.5rem 0; color: var(--demo-text);">
                  ${os.name}
                </h4>
                <p style="color: var(--demo-text-muted); margin: 0;">
                  ${os.year}
                </p>
              </div>
            </a>
          `).join('')}
        </div>
      `;
      container.innerHTML = html;
    }

    /**
     * Timeline Interaction
     */
    setupTimeline() {
      const timelineOS = document.querySelectorAll('.timeline-os');

      timelineOS.forEach(item => {
        item.addEventListener('click', () => {
          const osId = item.dataset.os;
          const os = OS_DATA.find(o => o.id === osId);

          if (os) {
            window.location.href = os.url;
          }
        });

        // Keyboard support
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');

        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            item.click();
          }
        });
      });
    }

    /**
     * Comparison Mode
     */
    setupComparison() {
      const compareBtn = document.getElementById('compare-mode-btn');
      const modal = document.getElementById('compare-modal');
      const select1 = document.getElementById('compare-os-1');
      const select2 = document.getElementById('compare-os-2');
      const startBtn = document.getElementById('start-comparison');
      const framesContainer = document.getElementById('compare-frames');

      if (!compareBtn || !modal) return;

      // Open modal
      compareBtn.addEventListener('click', () => {
        this.openModal(modal);
      });

      // Enable start button when both OS selected
      const checkSelections = () => {
        const enabled = select1.value && select2.value && select1.value !== select2.value;
        startBtn.disabled = !enabled;
      };

      select1?.addEventListener('change', checkSelections);
      select2?.addEventListener('change', checkSelections);

      // Start comparison
      startBtn?.addEventListener('click', () => {
        const os1 = OS_DATA.find(os => os.id === select1.value);
        const os2 = OS_DATA.find(os => os.id === select2.value);

        if (os1 && os2) {
          this.showComparison(os1, os2);
          framesContainer.hidden = false;
        }
      });
    }

    showComparison(os1, os2) {
      const title1 = document.getElementById('compare-title-1');
      const title2 = document.getElementById('compare-title-2');
      const iframe1 = document.getElementById('compare-iframe-1');
      const iframe2 = document.getElementById('compare-iframe-2');
      const fullscreen1 = document.getElementById('compare-fullscreen-1');
      const fullscreen2 = document.getElementById('compare-fullscreen-2');

      title1.textContent = os1.name;
      title2.textContent = os2.name;
      iframe1.src = os1.url;
      iframe2.src = os2.url;
      fullscreen1.href = os1.url;
      fullscreen2.href = os2.url;
    }

    /**
     * Quick Launcher
     */
    setupQuickLauncher() {
      const toggle = document.getElementById('quick-launcher-toggle');
      const menu = document.getElementById('quick-launcher-menu');
      const list = document.getElementById('quick-launcher-list');
      const search = document.getElementById('quick-search');

      if (!toggle || !menu) return;

      // Toggle menu
      toggle.addEventListener('click', () => {
        const isHidden = menu.hidden;
        menu.hidden = !isHidden;

        if (!isHidden) {
          // Menu is being hidden
          search.value = '';
          this.renderQuickLauncherList(OS_DATA);
        } else {
          // Menu is being shown
          setTimeout(() => search.focus(), 100);
        }
      });

      // Close when clicking outside
      document.addEventListener('click', (e) => {
        if (!menu.hidden && !menu.contains(e.target) && !toggle.contains(e.target)) {
          menu.hidden = true;
        }
      });

      // Search functionality
      search?.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = OS_DATA.filter(os =>
          os.name.toLowerCase().includes(query) ||
          os.year.toString().includes(query)
        );
        this.renderQuickLauncherList(filtered);
      });

      // Initial render
      this.renderQuickLauncherList(OS_DATA);
    }

    renderQuickLauncherList(osList) {
      const list = document.getElementById('quick-launcher-list');
      if (!list) return;

      if (osList.length === 0) {
        list.innerHTML = '<p style="padding: 1rem; text-align: center; color: var(--demo-text-muted);">No results found</p>';
        return;
      }

      const html = osList.map(os => `
        <a href="${os.url}" class="quick-launcher-item" style="
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          text-decoration: none;
          color: var(--demo-text);
          border-bottom: 1px solid var(--demo-border);
          transition: background 0.2s;
        " onmouseover="this.style.background='var(--demo-bg)'"
           onmouseout="this.style.background='transparent'">
          <span style="font-size: 1.5rem;">${this.getOSIcon(os.category)}</span>
          <div style="flex: 1;">
            <div style="font-weight: 600; font-size: 0.95rem;">${os.name}</div>
            <div style="font-size: 0.8rem; color: var(--demo-text-muted);">${os.year}</div>
          </div>
        </a>
      `).join('');

      list.innerHTML = html;
    }

    getOSIcon(category) {
      const icons = {
        windows: '🪟',
        macos: '🍎',
        linux: '🐧',
        mobile: '📱',
        other: '⚡'
      };
      return icons[category] || '💻';
    }

    /**
     * Keyboard Shortcuts
     */
    setupKeyboardShortcuts() {
      const shortcutsModal = document.getElementById('shortcuts-modal');

      document.addEventListener('keydown', (e) => {
        // Ignore if typing in input
        if (e.target.matches('input, textarea, select')) return;

        switch(e.key) {
          case '?':
            e.preventDefault();
            if (shortcutsModal) this.openModal(shortcutsModal);
            break;

          case 'c':
          case 'C':
            e.preventDefault();
            const compareModal = document.getElementById('compare-modal');
            if (compareModal) this.openModal(compareModal);
            break;

          case 'Escape':
            this.closeAllModals();
            break;

          // Quick launch with number keys
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
          case '6':
          case '7':
          case '8':
          case '9':
            e.preventDefault();
            const index = parseInt(e.key) - 1;
            if (OS_DATA[index]) {
              window.location.href = OS_DATA[index].url;
            }
            break;
        }
      });
    }

    /**
     * Modal Management
     */
    setupModals() {
      const modals = document.querySelectorAll('.modal');

      modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');

        // Close button
        closeBtn?.addEventListener('click', () => {
          this.closeModal(modal);
        });

        // Overlay click
        overlay?.addEventListener('click', () => {
          this.closeModal(modal);
        });

        // Escape key (handled in keyboard shortcuts)
      });
    }

    openModal(modal) {
      if (!modal) return;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';

      // Focus management
      const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      setTimeout(() => firstFocusable?.focus(), 100);
    }

    closeModal(modal) {
      if (!modal) return;
      modal.hidden = true;
      document.body.style.overflow = '';
    }

    closeAllModals() {
      const modals = document.querySelectorAll('.modal');
      modals.forEach(modal => this.closeModal(modal));
    }

    /**
     * Clock Update (if needed)
     */
    updateClock() {
      const clockElement = document.getElementById('clock-time');
      if (!clockElement) return;

      const update = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;

        clockElement.textContent = `${displayHours}:${minutes} ${ampm}`;
      };

      update();
      setInterval(update, 60000); // Update every minute
    }
  }

  /**
   * Scroll Animations
   */
  function setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe elements that should animate
    const elements = document.querySelectorAll('.os-card, .special-card, .evolution-card, .tech-item');
    elements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 0.6s ease-out ${index * 0.05}s, transform 0.6s ease-out ${index * 0.05}s`;
      observer.observe(el);
    });
  }

  /**
   * Hero Preview Animation
   */
  function setupHeroPreview() {
    const preview = document.getElementById('hero-preview');
    if (!preview) return;

    // Cycle through OS screenshots or colors
    const colors = [
      'linear-gradient(135deg, #0078d4, #00bcf2)', // Windows
      'linear-gradient(135deg, #333, #666)',        // Mac Classic
      'linear-gradient(135deg, #007aff, #00d4ff)', // Mac OS X
      'linear-gradient(135deg, #e95420, #f47421)', // Ubuntu
      'linear-gradient(135deg, #ffcc00, #ffff00)'  // BeOS
    ];

    let index = 0;
    setInterval(() => {
      index = (index + 1) % colors.length;
      preview.style.background = colors[index];
      preview.style.transition = 'background 1s ease-in-out';
    }, 3000);

    // Initial color
    preview.style.background = colors[0];
  }

  /**
   * Back to Top Button (if exists)
   */
  function setupBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 500) {
        backToTopBtn.style.display = 'block';
      } else {
        backToTopBtn.style.display = 'none';
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /**
   * Share Functionality
   */
  function setupShare() {
    // Add share buttons if needed
    const shareButtons = document.querySelectorAll('[data-share]');

    shareButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const platform = btn.dataset.share;
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('Check out the RetroOS Museum - Interactive OS recreations!');

        let shareUrl = '';
        switch(platform) {
          case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
            break;
          case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
          case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
        }

        if (shareUrl) {
          window.open(shareUrl, '_blank', 'width=600,height=400');
        }
      });
    });
  }

  /**
   * Performance Monitoring
   */
  function logPerformance() {
    if (window.performance && window.performance.timing) {
      window.addEventListener('load', () => {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
      });
    }
  }

  /**
   * Initialize Everything
   */
  function init() {
    // Check if we're on the demos page
    if (!document.body.classList.contains('demos-page')) {
      return;
    }

    // Initialize main functionality
    new DemosPage();

    // Setup additional features
    setupScrollAnimations();
    setupHeroPreview();
    setupBackToTop();
    setupShare();
    logPerformance();

    console.log('RetroOS Museum - Demos page loaded');
    console.log(`Available OS: ${OS_DATA.length}`);
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
