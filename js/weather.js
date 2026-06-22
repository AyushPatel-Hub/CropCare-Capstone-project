// Weather & Rain Prediction Module
(function() {
  // Mock Climate profiles for major Indian states
  const REGION_CLIMATES = {
    punjab: {
      name: "Punjab (North)",
      temp: 34,
      humidity: 45,
      rainChance: 12,
      wind: 14,
      soilPH: "7.2",
      soilMoisture: "52%",
      condition: "Clear Sky",
      icon: "fa-sun",
      forecast: [10, 15, 20, 5, 0, 10, 80], // 7-day rain chance %
      warnings: "No severe weather alerts. Ideal conditions for harvesting.",
      suitabilityText: "Best for Wheat (Rabi) and Rice (Kharif) under canal/tubewell irrigation."
    },
    maharashtra: {
      name: "Maharashtra (West/Central)",
      temp: 29,
      humidity: 78,
      rainChance: 65,
      wind: 18,
      soilPH: "6.8",
      soilMoisture: "70%",
      condition: "Scattered Showers",
      icon: "fa-cloud-sun-rain",
      forecast: [65, 80, 75, 40, 50, 90, 85],
      warnings: "Yellow alert: Moderate rain expected. Keep drainage channels open in cotton fields.",
      suitabilityText: "Ideal for Cotton, Sugarcane, Soybeans, and Onions."
    },
    uttar_pradesh: {
      name: "Uttar Pradesh (North/Central)",
      temp: 32,
      humidity: 60,
      rainChance: 40,
      wind: 12,
      soilPH: "6.8",
      soilMoisture: "65%",
      condition: "Partly Cloudy",
      icon: "fa-cloud-sun",
      forecast: [40, 50, 45, 30, 20, 15, 60],
      warnings: "No immediate warnings. Good moisture levels for sugarcane planting.",
      suitabilityText: "Highly fertile alluvial soil. Best for Wheat, Sugarcane, Potato, and Rice."
    },
    west_bengal: {
      name: "West Bengal (East)",
      temp: 31,
      humidity: 85,
      rainChance: 80,
      wind: 22,
      soilPH: "6.2",
      soilMoisture: "85%",
      condition: "Heavy Rain",
      icon: "fa-cloud-showers-heavy",
      forecast: [80, 95, 90, 70, 60, 50, 40],
      warnings: "Orange alert: Heavy rainfall. Potential waterlogging in low-lying paddy nurseries.",
      suitabilityText: "Perfect for Rice (Aman/Boro paddy) and Jute."
    },
    kerala: {
      name: "Kerala (South)",
      temp: 28,
      humidity: 90,
      rainChance: 90,
      wind: 25,
      soilPH: "5.5",
      soilMoisture: "92%",
      condition: "Thunderstorms",
      icon: "fa-cloud-bolt",
      forecast: [90, 100, 85, 95, 90, 80, 75],
      warnings: "Red alert: Heavy thunderstorms. Risk of flash floods in hilly cardamom/rubber estates.",
      suitabilityText: "Best for Spices, Rubber, Tea, Coffee, and Coconuts."
    },
    rajasthan: {
      name: "Rajasthan (West)",
      temp: 42,
      humidity: 25,
      rainChance: 5,
      wind: 20,
      soilPH: "8.2",
      soilMoisture: "20%",
      condition: "Hot & Arid",
      icon: "fa-wind",
      forecast: [5, 0, 0, 0, 10, 15, 5],
      warnings: "Heatwave warning: Avoid spraying fertilizers/pesticides during afternoon hours.",
      suitabilityText: "Best for Pearl Millet (Bajra), Cluster Beans (Guar), and Mustard."
    }
  };

  // Environmental requirements for major crops
  const CROP_ENVIRONS = [
    { name: "Paddy (Rice)", temp: "22°C - 32°C", rain: "150 - 300 cm", ph: "5.5 - 6.5", soil: "Clayey / Alluvial" },
    { name: "Wheat", temp: "15°C - 25°C", rain: "75 - 100 cm", ph: "6.0 - 7.5", soil: "Loamy / Clay Loam" },
    { name: "Cotton", temp: "21°C - 30°C", rain: "50 - 100 cm", ph: "6.0 - 8.0", soil: "Black Cotton / Saline-free" },
    { name: "Onion", temp: "15°C - 25°C", rain: "75 - 100 cm", ph: "6.0 - 7.0", soil: "Sandy Loam / Alluvial" },
    { name: "Sugarcane", temp: "21°C - 27°C", rain: "150 - 250 cm", ph: "6.5 - 7.5", soil: "Sandy Loam to Clayey" }
  ];

  // Initialize Weather Module
  function initWeather() {
    renderEnvRequirements();
    
    // Bind Rain Simulator controls
    document.querySelectorAll('.rain-stage').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const stageBtn = e.currentTarget;
        document.querySelectorAll('.rain-stage').forEach(b => b.classList.remove('active'));
        stageBtn.classList.add('active');
        
        const type = stageBtn.dataset.rain;
        triggerRainSimulation(type);
      });
    });

    // Default simulator state
    triggerRainSimulation('none');
  }

  // Update weather cards when location changes
  function updateLocationWeather(locKey) {
    const climate = REGION_CLIMATES[locKey];
    if (!climate) return;

    // Dashboard & Weather Section Updates
    updateDOMElements({
      '#dash-temp': `${climate.temp}°C`,
      '#dash-humidity': `${climate.humidity}%`,
      '#dash-wind': `${climate.wind} km/h`,
      '#dash-rain-chance': `${climate.rainChance}%`,
      '#dash-condition': climate.condition,
      '#dash-soil-ph': climate.soilPH,
      '#dash-soil-moisture': climate.soilMoisture,
      '#weather-warning-text': climate.warnings,
      '#weather-suitability-text': climate.suitabilityText
    });

    // Update main weather display icon
    const wIcon = document.querySelector('#dash-weather-icon');
    if (wIcon) {
      wIcon.className = `fas ${climate.icon} weather-icon-lg`;
    }

    // Render rain forecast chart
    renderForecastChart(climate.forecast);
  }

  // Helper function to bulk update text contents
  function updateDOMElements(selectorValueMap) {
    for (let selector in selectorValueMap) {
      const el = document.querySelector(selector);
      if (el) el.textContent = selectorValueMap[selector];
    }
  }

  // Render Environmental Info Table
  function renderEnvRequirements() {
    const tbody = document.getElementById('env-requirements-body');
    if (!tbody) return;

    tbody.innerHTML = CROP_ENVIRONS.map(crop => `
      <tr>
        <td style="font-weight: 600;">${crop.name}</td>
        <td><span style="color: var(--danger);"><i class="fas fa-temperature-high"></i> ${crop.temp}</span></td>
        <td><span style="color: var(--secondary);"><i class="fas fa-cloud-showers-heavy"></i> ${crop.rain}</span></td>
        <td><span style="color: var(--accent);"><i class="fas fa-flask"></i> ${crop.ph}</span></td>
        <td><span style="color: var(--text-secondary);"><i class="fas fa-mountain"></i> ${crop.soil}</span></td>
      </tr>
    `).join('');
  }

  // Render Rain forecast bar chart using SVG/DOM
  function renderForecastChart(forecastData) {
    const container = document.getElementById('rain-forecast-chart');
    if (!container) return;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    container.innerHTML = forecastData.map((pct, idx) => `
      <div class="forecast-bar-group">
        <div class="forecast-bar-track">
          <div class="forecast-bar-fill" style="height: ${pct}%;">
            <span class="forecast-bar-pct">${pct}%</span>
          </div>
        </div>
        <span>${days[idx]}</span>
      </div>
    `).join('');
  }

  // Dynamic Particle Rain Simulator
  let rainInterval = null;
  function triggerRainSimulation(intensity) {
    const displayPanel = document.getElementById('rain-display');
    const descText = document.getElementById('rain-sim-description');
    const actionText = document.getElementById('rain-sim-action');
    
    if (!displayPanel) return;

    // Clear existing drops
    const oldDrops = displayPanel.querySelectorAll('.rain-particle');
    oldDrops.forEach(d => d.remove());
    if (rainInterval) clearInterval(rainInterval);

    let dropCount = 0;
    let speedRange = [0, 0];
    let description = "";
    let action = "";

    switch(intensity) {
      case 'none':
        description = "Dry conditions. Soil moisture is constant. Check irrigation schedules.";
        action = "💡 Action: Irrigate fields if soil moisture is below 40%.";
        break;
      case 'drizzle':
        dropCount = 30;
        speedRange = [1.2, 1.8];
        description = "Light rain. Good for crop root systems, raises soil moisture slightly.";
        action = "💡 Action: Pause light surface irrigation. Safe to apply organic compost.";
        break;
      case 'moderate':
        dropCount = 75;
        speedRange = [0.8, 1.3];
        description = "Moderate rain. Deep soil moisture replenishment. Beneficial for high water demand crops.";
        action = "💡 Action: Stop all irrigation. Postpone pesticide sprays to avoid wash-off.";
        break;
      case 'heavy':
        dropCount = 180;
        speedRange = [0.4, 0.8];
        description = "Severe downpour & storm. Potential waterlogging risk. Check field drainage immediately.";
        action = "⚠️ Alert: Clear drainage channels, protect newly sown nursery beds with organic mulching.";
        break;
    }

    descText.textContent = description;
    actionText.textContent = action;

    if (intensity === 'none') return;

    // Spawn initial particles
    for (let i = 0; i < dropCount; i++) {
      spawnRaindrop(displayPanel, speedRange);
    }

    // Keep spawning new drops periodically to simulate flow
    rainInterval = setInterval(() => {
      spawnRaindrop(displayPanel, speedRange);
    }, 100);
  }

  function spawnRaindrop(panel, speedRange) {
    // Limit total particles in DOM
    if (panel.querySelectorAll('.rain-particle').length > 250) {
      panel.querySelector('.rain-particle').remove();
    }

    const drop = document.createElement('div');
    drop.className = 'rain-particle';
    
    // Random position & length
    const left = Math.random() * 100;
    const length = Math.random() * 20 + 10;
    const duration = Math.random() * (speedRange[1] - speedRange[0]) + speedRange[0];

    drop.style.left = `${left}%`;
    drop.style.height = `${length}px`;
    drop.style.animationDuration = `${duration}s`;
    
    // Remove drop after animation cycles
    drop.addEventListener('animationend', () => {
      drop.remove();
    });

    panel.appendChild(drop);
  }

  // Register in global observers
  window.CropCare.onInit(initWeather);
  window.CropCare.onLocationChange(updateLocationWeather);

})();
