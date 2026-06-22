// CropCare Application Orchestrator
(function() {
  // Global App State
  window.CropCare = {
    currentLocation: 'punjab',
    theme: 'dark',
    initialized: false,
    observers: {
      location: [],
      init: []
    },
    
    // Register observers for state changes
    onLocationChange(callback) {
      this.observers.location.push(callback);
      // If already initialized, run it immediately to sync current state
      if (this.initialized) {
        try { callback(this.currentLocation); } catch(e) { console.error('Location sync error:', e); }
      }
    },
    
    onInit(callback) {
      if (this.initialized) {
        try { callback(); } catch(e) { console.error('Init sync error:', e); }
      } else {
        this.observers.init.push(callback);
      }
    },
    
    // Trigger location updates
    changeLocation(newLoc) {
      this.currentLocation = newLoc;
      this.observers.location.forEach(cb => {
        try { cb(newLoc); } catch(e) { console.error('Location observer error:', e); }
      });
    }
  };

  // Switch view function
  function switchView(targetId) {
    const navItems = document.querySelectorAll('.nav-links li');
    const sections = document.querySelectorAll('.view-section');
    const headerTitle = document.querySelector('.header-title h2');

    sections.forEach(sec => sec.classList.remove('active'));
    navItems.forEach(item => item.classList.remove('active'));

    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    const activeLink = document.querySelector(`.nav-links li a[href="#${targetId}"]`);
    if (activeLink) {
      activeLink.parentElement.classList.add('active');
      headerTitle.textContent = activeLink.textContent.trim();
    }

    const sidebar = document.querySelector('.sidebar');
    if (sidebar && sidebar.classList.contains('active')) {
      sidebar.classList.remove('active');
    }
  }

  // Orchestrate UI and events
  document.addEventListener('DOMContentLoaded', () => {
    // Switch to active view based on hash or default
    const initialView = window.location.hash ? window.location.hash.substring(1) : 'dashboard';
    switchView(initialView);

    // Bind navigation clicks
    document.querySelectorAll('.nav-links li a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        window.location.hash = targetId;
        switchView(targetId);
      });
    });

    // Mobile sidebar toggle
    const hamburger = document.querySelector('.hamburger-btn');
    const sidebar = document.querySelector('.sidebar');
    if (hamburger && sidebar) {
      hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('active');
      });
      document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && 
            !sidebar.contains(e.target) && 
            !hamburger.contains(e.target) && 
            sidebar.classList.contains('active')) {
          sidebar.classList.remove('active');
        }
      });
    }

    // Bind Region Selector
    const locationSelect = document.getElementById('region-selector');
    if (locationSelect) {
      locationSelect.addEventListener('change', (e) => {
        window.CropCare.changeLocation(e.target.value);
      });
      window.CropCare.currentLocation = locationSelect.value;
    }

    // Prominent Theme Toggle in Header and Sidebar
    const themeToggles = document.querySelectorAll('.theme-toggle-btn');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('cropcare_theme') || 'dark';
    window.CropCare.theme = savedTheme;
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
      updateThemeTogglesUI(true);
    } else {
      document.body.classList.remove('light-theme');
      updateThemeTogglesUI(false);
    }

    themeToggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-theme');
        const theme = isLight ? 'light' : 'dark';
        window.CropCare.theme = theme;
        localStorage.setItem('cropcare_theme', theme);
        updateThemeTogglesUI(isLight);
      });
    });

    function updateThemeTogglesUI(isLight) {
      themeToggles.forEach(btn => {
        const icon = btn.querySelector('i');
        const text = btn.querySelector('span');
        if (icon) {
          icon.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
        }
        if (text) {
          text.textContent = isLight ? 'Dark Mode' : 'Light Mode';
        }
      });
    }

    // Modal Helpers
    window.CropCare.modals = {
      open(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('active');
      },
      close(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
      }
    };

    // Close modal handlers
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    });

    document.querySelectorAll('.close-btn, .btn-close-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        if (modal) modal.classList.remove('active');
      });
    });

    // Notification bell click
    const bell = document.querySelector('.bell-btn');
    if (bell) {
      bell.addEventListener('click', () => {
        alert("System Status: All systems operational. Weather parameters are within optimal ranges for your active crops.");
        const badge = bell.querySelector('.notification-badge');
        if (badge) badge.remove();
      });
    }

    // Mark App as Initialized
    window.CropCare.initialized = true;

    // Run all registered init callbacks
    window.CropCare.observers.init.forEach(cb => {
      try { cb(); } catch(e) { console.error('Init callback error:', e); }
    });

    // Trigger initial location observer run
    window.CropCare.changeLocation(window.CropCare.currentLocation);
  });
})();
