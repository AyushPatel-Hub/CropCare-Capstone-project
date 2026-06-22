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

    // ==========================================
    // CROPCARE AI CHAT CONTROLLER
    // ==========================================
    initChatAssistant();
  });

  function initChatAssistant() {
    const toggleBtn = document.getElementById('chat-toggle-btn');
    const closeBtn = document.getElementById('chat-close-btn');
    const panel = document.getElementById('chat-assistant-panel');
    const form = document.getElementById('chat-input-form');
    const input = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('chat-messages-container');
    const suggestionsContainer = document.getElementById('chat-suggestions-container');
    const statusDot = panel?.querySelector('.chat-status-dot');
    const statusText = document.getElementById('chat-status-text');

    if (!toggleBtn || !panel || !form || !messagesContainer) return;

    // Dynamically resolve API URL to support both split-port local dev and unified production
    const apiBase = (window.location.port === '8001') ? 'http://localhost:8000' : '';

    // Generate unique session ID for this visitor
    let sessionId = localStorage.getItem('cropcare_chat_session');
    if (!sessionId) {
      sessionId = 'session_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('cropcare_chat_session', sessionId);
    }

    // Toggle Chat Panel
    toggleBtn.addEventListener('click', () => {
      panel.classList.toggle('active');
      const badge = toggleBtn.querySelector('.chat-notification-dot');
      if (badge) badge.remove();
      
      // Auto focus input when opening
      if (panel.classList.contains('active')) {
        setTimeout(() => input.focus(), 300);
        checkServerStatus();
      }
    });

    closeBtn.addEventListener('click', () => {
      panel.classList.remove('active');
    });

    // Handle suggestion button clicks
    if (suggestionsContainer) {
      suggestionsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.chat-suggest-btn');
        if (btn) {
          const query = btn.dataset.query;
          input.value = query;
          form.dispatchEvent(new Event('submit'));
        }
      });
    }

    // Check if the local ADK server is online
    async function checkServerStatus() {
      try {
        const res = await fetch(apiBase + '/list-apps', { method: 'GET' });
        if (res.ok) {
          if (statusDot) statusDot.className = 'chat-status-dot online';
          if (statusText) statusText.textContent = 'Online';
          return true;
        }
      } catch (err) {
        // Silent catch, server is offline
      }
      if (statusDot) statusDot.className = 'chat-status-dot offline';
      if (statusText) statusText.textContent = 'Offline';
      return false;
    }

    // Append Message to UI
    function appendMessage(sender, text, isHtml = false) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `chat-message ${sender}`;
      
      const bubbleDiv = document.createElement('div');
      bubbleDiv.className = 'chat-msg-bubble';
      
      if (isHtml) {
        bubbleDiv.innerHTML = text;
      } else {
        // Convert newlines to breaks and do simple markdown formatting for bold/italic/code
        bubbleDiv.innerHTML = text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`(.*?)`/g, '<code>$1</code>')
          .replace(/\n/g, '<br>');
      }
      
      msgDiv.appendChild(bubbleDiv);
      
      const timeDiv = document.createElement('div');
      timeDiv.className = 'chat-time';
      const now = new Date();
      timeDiv.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      msgDiv.appendChild(timeDiv);
      
      messagesContainer.appendChild(msgDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Append Typing Indicator
    function showTypingIndicator() {
      const typingDiv = document.createElement('div');
      typingDiv.className = 'chat-message bot typing-indicator-container';
      typingDiv.innerHTML = `
        <div class="chat-msg-bubble" style="padding: 8px 12px; background-color: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-color); border-bottom-left-radius: 4px;">
          <div class="typing-dots">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>
      `;
      messagesContainer.appendChild(typingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      return typingDiv;
    }

    // Handle Form Submit
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const query = input.value.trim();
      if (!query) return;

      // Add user message
      appendMessage('user', query);
      input.value = '';

      // Check status and show typing indicator
      const isOnline = await checkServerStatus();
      const typingIndicator = showTypingIndicator();

      if (!isOnline) {
        setTimeout(() => {
          typingIndicator.remove();
          appendMessage('bot', `⚠️ <strong>CropCare AI is currently offline.</strong><br><br>Please start the backend agent server using the commands:<br><code>agents-cli playground</code><br>or<br><code>uv run adk web .</code><br>in the capstone project root folder, and ensure the server runs on port 8000.<br><br><em>Note: If you run both dashboard and uvicorn locally, make sure they run on different ports (e.g. dashboard on 8001, uvicorn on 8000).</em>`, true);
        }, 1000);
        return;
      }

      // Prepare payload with current location if useful to context
      const region = window.CropCare.currentLocation || 'punjab';
      const fullQuery = `[Selected Region: ${region}] ${query}`;

      try {
        const response = await fetch(apiBase + '/run', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            appName: 'app',
            userId: 'ayush_farmer',
            sessionId: sessionId,
            newMessage: {
              role: 'user',
              parts: [{ text: fullQuery }]
            }
          })
        });

        typingIndicator.remove();

        if (response.ok) {
          const events = await response.json();
          let botText = '';
          
          if (Array.isArray(events)) {
            events.forEach(evt => {
              if (evt.content && Array.isArray(evt.content.parts)) {
                evt.content.parts.forEach(part => {
                  if (part.text) {
                    botText += part.text;
                  }
                });
              }
            });
          }

          if (botText) {
            appendMessage('bot', botText);
          } else {
            appendMessage('bot', "I ran the request but didn't receive a text response. Please try rephrasing your question.");
          }
        } else {
          const errDetail = await response.text();
          appendMessage('bot', `⚠️ Server Error: ${response.status} - ${errDetail || 'Something went wrong'}`);
        }
      } catch (err) {
        typingIndicator.remove();
        console.error('Chat error:', err);
        if (statusDot) statusDot.className = 'chat-status-dot offline';
        if (statusText) statusText.textContent = 'Offline';
        appendMessage('bot', `⚠️ <strong>Connection failed.</strong> Make sure the uvicorn server is running on port 8000 and CORS permits requests from your local server. Try launching it with <code>uv run adk web .</code>`, true);
      }
    });
  }
})();
