/**
 * RetroOS Museum - Timeline Interactive Features
 * Handles filtering, search, navigation, and interactions
 */

(function() {
  'use strict';

  // ===== State Management =====
  const state = {
    currentDecade: 'all',
    currentFamily: 'all',
    currentType: 'all',
    searchQuery: '',
    crtMode: false,
    allCards: [],
    filteredCount: 0
  };

  // ===== DOM Elements =====
  const elements = {
    // Navigation
    decadeBtns: document.querySelectorAll('.decade-btn'),

    // Filters
    searchInput: document.getElementById('os-search'),
    familyFilter: document.getElementById('family-filter'),
    typeFilter: document.getElementById('type-filter'),
    clearFiltersBtn: document.getElementById('clear-filters'),
    resultsCount: document.getElementById('results-count'),

    // Sections
    decadeSections: document.querySelectorAll('.decade-section'),

    // Cards
    osCards: document.querySelectorAll('.os-card'),

    // UI Controls
    crtToggle: document.getElementById('crt-toggle'),
    backToTop: document.getElementById('back-to-top'),

    // Modal
    modal: document.getElementById('os-modal'),
    modalBody: document.getElementById('modal-body'),
    modalClose: document.querySelector('.modal-close')
  };

  // ===== Initialization =====
  function init() {
    // Store all cards for filtering
    state.allCards = Array.from(elements.osCards);
    state.filteredCount = state.allCards.length;

    // Set up event listeners
    setupEventListeners();

    // Initial filter application
    applyFilters();

    // Check scroll position
    checkScrollPosition();

    // Load saved CRT preference
    loadCRTPreference();

    console.log('RetroOS Museum Timeline initialized with', state.allCards.length, 'operating systems');
  }

  // ===== Event Listeners =====
  function setupEventListeners() {
    // Decade navigation
    elements.decadeBtns.forEach(btn => {
      btn.addEventListener('click', handleDecadeClick);
    });

    // Search input with debounce
    let searchTimeout;
    elements.searchInput?.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        state.searchQuery = e.target.value.toLowerCase();
        applyFilters();
      }, 300);
    });

    // Family filter
    elements.familyFilter?.addEventListener('change', (e) => {
      state.currentFamily = e.target.value;
      applyFilters();
    });

    // Type filter
    elements.typeFilter?.addEventListener('change', (e) => {
      state.currentType = e.target.value;
      applyFilters();
    });

    // Clear filters
    elements.clearFiltersBtn?.addEventListener('click', clearAllFilters);

    // CRT toggle
    elements.crtToggle?.addEventListener('click', toggleCRTMode);

    // Back to top
    elements.backToTop?.addEventListener('click', scrollToTop);

    // Scroll detection
    window.addEventListener('scroll', throttle(checkScrollPosition, 100));

    // OS detail buttons
    document.querySelectorAll('.os-details-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const osId = e.currentTarget.dataset.osId;
        openOSModal(osId);
      });
    });

    // Modal close
    elements.modalClose?.addEventListener('click', closeModal);
    elements.modal?.addEventListener('click', (e) => {
      if (e.target === elements.modal) {
        closeModal();
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
  }

  // ===== Decade Navigation =====
  function handleDecadeClick(e) {
    const decade = e.currentTarget.dataset.decade;

    // Update active state
    elements.decadeBtns.forEach(btn => btn.classList.remove('active'));
    e.currentTarget.classList.add('active');

    // Update state
    state.currentDecade = decade;

    // Apply filters
    applyFilters();

    // Smooth scroll to section if not "all"
    if (decade !== 'all') {
      const section = document.getElementById(`section-${decade}`);
      if (section) {
        const offset = 140; // Account for sticky nav
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  }

  // ===== Filtering =====
  function applyFilters() {
    let visibleCount = 0;
    const hasActiveFilters = state.currentDecade !== 'all' ||
                            state.currentFamily !== 'all' ||
                            state.currentType !== 'all' ||
                            state.searchQuery !== '';

    // Show/hide decade sections
    elements.decadeSections.forEach(section => {
      const sectionDecade = section.dataset.decade;
      const shouldShowSection = state.currentDecade === 'all' || state.currentDecade === sectionDecade;

      if (shouldShowSection) {
        section.classList.remove('hidden');
      } else {
        section.classList.add('hidden');
      }
    });

    // Filter individual cards
    state.allCards.forEach(card => {
      const matches = matchesFilters(card);

      if (matches) {
        card.classList.remove('filtered-out');
        visibleCount++;

        // Add animation
        card.style.animation = 'none';
        requestAnimationFrame(() => {
          card.style.animation = 'fadeIn 0.3s ease forwards';
        });
      } else {
        card.classList.add('filtered-out');
      }
    });

    // Update results count
    state.filteredCount = visibleCount;
    if (elements.resultsCount) {
      elements.resultsCount.textContent = visibleCount;

      // Animate count change
      elements.resultsCount.style.animation = 'pulse 0.3s ease';
      setTimeout(() => {
        elements.resultsCount.style.animation = '';
      }, 300);
    }

    // Show message if no results
    updateEmptyState(visibleCount);
  }

  function matchesFilters(card) {
    const cardDecade = card.dataset.decade;
    const cardFamily = card.dataset.family;
    const cardType = card.dataset.type;
    const cardYear = card.dataset.year;
    const cardCompany = card.dataset.company;
    const cardName = card.querySelector('.os-name')?.textContent.toLowerCase() || '';
    const cardDesc = card.querySelector('.os-description')?.textContent.toLowerCase() || '';

    // Decade filter
    if (state.currentDecade !== 'all' && cardDecade !== state.currentDecade) {
      return false;
    }

    // Family filter
    if (state.currentFamily !== 'all' && cardFamily !== state.currentFamily) {
      return false;
    }

    // Type filter
    if (state.currentType !== 'all' && cardType !== state.currentType) {
      return false;
    }

    // Search query
    if (state.searchQuery) {
      const searchableText = `${cardName} ${cardCompany} ${cardYear} ${cardDesc}`;
      if (!searchableText.includes(state.searchQuery)) {
        return false;
      }
    }

    return true;
  }

  function updateEmptyState(count) {
    // Remove any existing empty state
    const existingEmpty = document.querySelector('.empty-state');
    if (existingEmpty) {
      existingEmpty.remove();
    }

    // Add empty state if no results
    if (count === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.innerHTML = `
        <div style="text-align: center; padding: 4rem 2rem; color: var(--text-secondary);">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🔍</div>
          <h3 style="margin: 0 0 1rem; color: var(--text-primary);">No operating systems found</h3>
          <p>Try adjusting your filters or search query</p>
          <button id="reset-filters-empty" style="margin-top: 1rem; padding: 0.5rem 1.5rem; background: var(--retro-blue); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
            Clear All Filters
          </button>
        </div>
      `;

      document.querySelector('.timeline-main').appendChild(emptyState);

      // Add click handler
      document.getElementById('reset-filters-empty')?.addEventListener('click', clearAllFilters);
    }
  }

  function clearAllFilters() {
    // Reset state
    state.currentDecade = 'all';
    state.currentFamily = 'all';
    state.currentType = 'all';
    state.searchQuery = '';

    // Reset UI
    if (elements.searchInput) elements.searchInput.value = '';
    if (elements.familyFilter) elements.familyFilter.value = 'all';
    if (elements.typeFilter) elements.typeFilter.value = 'all';

    // Reset decade buttons
    elements.decadeBtns.forEach(btn => {
      if (btn.dataset.decade === 'all') {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Apply filters
    applyFilters();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ===== CRT Mode =====
  function toggleCRTMode() {
    state.crtMode = !state.crtMode;
    document.body.classList.toggle('crt-mode', state.crtMode);

    // Save preference
    localStorage.setItem('retroos-crt-mode', state.crtMode);

    // Update button text
    if (elements.crtToggle) {
      const icon = elements.crtToggle.querySelector('.toggle-icon');
      if (state.crtMode) {
        elements.crtToggle.innerHTML = '<span class="toggle-icon">✨</span> Modern Mode';
      } else {
        elements.crtToggle.innerHTML = '<span class="toggle-icon">⚡</span> Retro Mode';
      }
    }
  }

  function loadCRTPreference() {
    const saved = localStorage.getItem('retroos-crt-mode');
    if (saved === 'true') {
      toggleCRTMode();
    }
  }

  // ===== Scroll Functions =====
  function checkScrollPosition() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Show/hide back to top button
    if (elements.backToTop) {
      if (scrollTop > 500) {
        elements.backToTop.classList.add('visible');
      } else {
        elements.backToTop.classList.remove('visible');
      }
    }
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // ===== Modal Functions =====
  function openOSModal(osId) {
    // Check if OS has a dedicated recreation page
    const osPages = {
      'windows-95': '/os/windows-95/',
      'macos-system7': '/os/macos-system7/'
    };

    // If OS page exists, navigate to it
    if (osPages[osId]) {
      window.location.href = osPages[osId];
      return;
    }

    // Otherwise, show placeholder modal
    if (!elements.modal || !elements.modalBody) return;

    // Find OS data (in a real implementation, this would fetch from data)
    const card = document.querySelector(`[data-os-id="${osId}"]`);
    if (!card) return;

    const osName = card.querySelector('.os-name')?.textContent || 'Unknown OS';
    const osYear = card.querySelector('.os-year')?.textContent || '';
    const osCompany = card.querySelector('.os-company')?.textContent || '';
    const osDesc = card.querySelector('.os-description')?.textContent || '';
    const features = Array.from(card.querySelectorAll('.feature-tag')).map(tag => tag.textContent);

    // Build modal content
    elements.modalBody.innerHTML = `
      <div style="padding-right: 2rem;">
        <h2 style="font-size: 2rem; margin: 0 0 1rem; color: var(--text-primary);">${osName}</h2>
        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; font-family: var(--font-mono); color: var(--text-secondary);">
          <span><strong>Year:</strong> ${osYear}</span>
          <span>•</span>
          <span><strong>Company:</strong> ${osCompany}</span>
        </div>
        <p style="line-height: 1.6; margin-bottom: 1.5rem; color: var(--text-secondary);">${osDesc}</p>

        <h3 style="font-size: 1.25rem; margin: 1.5rem 0 1rem;">Key Features</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">
          ${features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
        </div>

        <div style="background: var(--gray-100); padding: 1rem; border-radius: 8px; margin-top: 2rem;">
          <p style="margin: 0; color: var(--text-secondary); font-size: 0.875rem;">
            <strong>Note:</strong> Detailed OS information pages are coming soon!
            This is a placeholder for the full operating system showcase.
          </p>
        </div>
      </div>
    `;

    // Show modal
    elements.modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!elements.modal) return;

    elements.modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  // ===== Keyboard Shortcuts =====
  function handleKeyboard(e) {
    // Escape to close modal
    if (e.key === 'Escape' && !elements.modal?.hasAttribute('hidden')) {
      closeModal();
    }

    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      elements.searchInput?.focus();
    }

    // Number keys 1-5 to switch decades
    if (e.key >= '1' && e.key <= '5' && !e.ctrlKey && !e.metaKey) {
      const decades = ['1980s', '1990s', '2000s', '2010s', '2020s'];
      const index = parseInt(e.key) - 1;
      const btn = document.querySelector(`.decade-btn[data-decade="${decades[index]}"]`);
      if (btn) btn.click();
    }

    // 0 to show all
    if (e.key === '0' && !e.ctrlKey && !e.metaKey) {
      const btn = document.querySelector('.decade-btn[data-decade="all"]');
      if (btn) btn.click();
    }
  }

  // ===== Utility Functions =====
  function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall < delay) return;
      lastCall = now;
      return func(...args);
    };
  }

  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);

  // ===== Initialize on DOM Load =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ===== Export for debugging =====
  window.RetroOSTimeline = {
    state,
    elements,
    applyFilters,
    clearAllFilters,
    toggleCRTMode
  };

})();
