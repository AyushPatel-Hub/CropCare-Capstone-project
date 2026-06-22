// Crop Recommendation Engine Module
(function() {
  // Comprehensive Crop Database
  const CROPS_DB = [
    {
      id: "paddy",
      name: "Paddy (Rice)",
      season: "kharif",
      soil: ["clayey", "alluvial", "loamy"],
      tempRange: [20, 35],
      waterLevel: "high",
      duration: "120 - 150 Days",
      sowing: "June - July",
      yield: "4.5 - 5.5 Tons/Hectare",
      returns: "High",
      tip: "Ensure standing water of 2-5cm during early vegetative stages. Use green manuring (Dhaincha) before sowing.",
      icon: "🌾"
    },
    {
      id: "wheat",
      name: "Wheat",
      season: "rabi",
      soil: ["loamy", "clayey", "alluvial"],
      tempRange: [10, 25],
      waterLevel: "medium",
      duration: "110 - 130 Days",
      sowing: "October - November",
      yield: "3.5 - 4.5 Tons/Hectare",
      returns: "High",
      tip: "Requires 4-6 timely irrigations. First watering at Crown Root Initiation (21 days after sowing) is critical.",
      icon: "🌾"
    },
    {
      id: "cotton",
      name: "Cotton",
      season: "kharif",
      soil: ["black", "loamy", "alluvial"],
      tempRange: [20, 35],
      waterLevel: "medium",
      duration: "150 - 180 Days",
      sowing: "May - June",
      yield: "2.0 - 2.5 Tons/Hectare",
      returns: "Very High",
      tip: "Prone to Pink Bollworm. Intercrop with Cowpea or Maize as trap crops to invite beneficial insects.",
      icon: "☁️"
    },
    {
      id: "mustard",
      name: "Mustard",
      season: "rabi",
      soil: ["sandy", "loamy", "alluvial"],
      tempRange: [10, 22],
      waterLevel: "low",
      duration: "100 - 120 Days",
      sowing: "October - October",
      yield: "1.5 - 2.0 Tons/Hectare",
      returns: "Medium",
      tip: "Drought resistant. Needs only 2 irrigations. Spray neem oil solution to prevent Aphid attacks.",
      icon: "🌼"
    },
    {
      id: "sugarcane",
      name: "Sugarcane",
      season: "kharif",
      soil: ["alluvial", "loamy", "black"],
      tempRange: [20, 38],
      waterLevel: "high",
      duration: "10 - 12 Months",
      sowing: "Jan - March",
      yield: "70 - 80 Tons/Hectare",
      returns: "Very High",
      tip: "Heavy nutrient consumer. Incorporate plenty of vermicompost and practice trash mulching to save water.",
      icon: "🎋"
    },
    {
      id: "onion",
      name: "Onion",
      season: "rabi",
      soil: ["sandy", "loamy"],
      tempRange: [15, 28],
      waterLevel: "medium",
      duration: "120 - 140 Days",
      sowing: "Nov - Dec",
      yield: "15 - 20 Tons/Hectare",
      returns: "High",
      tip: "Avoid clayey soils as they restrict bulb expansion. Maintain uniform light moisture; drying causes split bulbs.",
      icon: "🧅"
    },
    {
      id: "potato",
      name: "Potato",
      season: "rabi",
      soil: ["sandy", "loamy"],
      tempRange: [15, 22],
      waterLevel: "medium",
      duration: "90 - 120 Days",
      sowing: "October - November",
      yield: "20 - 25 Tons/Hectare",
      returns: "High",
      tip: "Requires earthing up (mounding soil around stems) 30 days after planting. Watch out for Early Blight.",
      icon: "🥔"
    },
    {
      id: "watermelon",
      name: "Watermelon",
      season: "zaid",
      soil: ["sandy", "loamy"],
      tempRange: [24, 38],
      waterLevel: "medium",
      duration: "85 - 95 Days",
      sowing: "Feb - March",
      yield: "25 - 35 Tons/Hectare",
      returns: "Medium",
      tip: "Sow in sandy riverbeds. Needs warm days and dry weather. Organic mulching prevents fruit rot from soil contact.",
      icon: "🍉"
    },
    {
      id: "cucumber",
      name: "Cucumber",
      season: "zaid",
      soil: ["sandy", "loamy"],
      tempRange: [20, 35],
      waterLevel: "medium",
      duration: "60 - 70 Days",
      sowing: "February - March",
      yield: "8 - 12 Tons/Hectare",
      returns: "Medium",
      tip: "Quick cash crop. Use trellises to increase yield and fruit quality. Ensure adequate bees for pollination.",
      icon: "🥒"
    },
    {
      id: "moong",
      name: "Moong (Green Gram)",
      season: "zaid",
      soil: ["loamy", "sandy"],
      tempRange: [25, 35],
      waterLevel: "low",
      duration: "60 - 75 Days",
      sowing: "March - April",
      yield: "0.8 - 1.2 Tons/Hectare",
      returns: "Medium",
      tip: "Short-duration pulse crop that fixes atmospheric nitrogen, improving soil fertility for the next season.",
      icon: "🌱"
    }
  ];

  // Initialize Recommender
  function initRecommender() {
    const calcBtn = document.getElementById('calc-recommend-btn');
    if (calcBtn) {
      calcBtn.addEventListener('click', (e) => {
        e.preventDefault();
        calculateAndRender();
      });
    }

    // Load recommendations initially based on default state
    calculateAndRender();
  }

  // Calculate suitability score based on inputs
  function calculateAndRender() {
    const season = document.getElementById('rec-season').value;
    const soil = document.getElementById('rec-soil').value;
    const tempVal = parseInt(document.getElementById('rec-temp').value) || 28;
    const water = document.getElementById('rec-water').value;

    const resultsContainer = document.getElementById('recommendations-grid');
    if (!resultsContainer) return;

    // Filter and score crops
    const scoredCrops = CROPS_DB.map(crop => {
      let score = 0;
      let reasons = [];

      // 1. Season matching (Critical weight)
      if (crop.season === season) {
        score += 40;
      } else {
        score -= 20; // Heavy penalty
      }

      // 2. Soil matching
      if (crop.soil.includes(soil)) {
        score += 25;
      } else {
        reasons.push(`Soil preference mismatch (Prefers: ${crop.soil.join('/')})`);
      }

      // 3. Temp matching
      if (tempVal >= crop.tempRange[0] && tempVal <= crop.tempRange[1]) {
        score += 20;
      } else {
        score += 5; // Partial points
        reasons.push(`Temp out of optimal range (${crop.tempRange[0]}-${crop.tempRange[1]}°C)`);
      }

      // 4. Water level matching
      if (crop.waterLevel === water) {
        score += 15;
      } else {
        const waterDiff = Math.abs(getWaterScore(crop.waterLevel) - getWaterScore(water));
        if (waterDiff === 1) {
          score += 8;
        } else {
          reasons.push(`Water demand mismatch (Requires ${crop.waterLevel} irrigation)`);
        }
      }

      // Constrain score between 0 and 100
      const finalScore = Math.max(0, Math.min(100, score));

      return {
        ...crop,
        score: finalScore,
        reasons: reasons
      };
    })
    // Sort by suitability score descending
    .sort((a, b) => b.score - a.score);

    // Render cards
    renderCropCards(scoredCrops, resultsContainer);
  }

  function getWaterScore(level) {
    if (level === 'low') return 1;
    if (level === 'medium') return 2;
    if (level === 'high') return 3;
    return 2;
  }

  // Render cards to container
  function renderCropCards(crops, container) {
    if (crops.length === 0) {
      container.innerHTML = `<div class="card" style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No matching crops found. Adjust settings and recalculate.</div>`;
      return;
    }

    container.innerHTML = crops.map(crop => {
      // Color coding for suitability
      let badgeStyle = "background-color: var(--danger-light); color: var(--danger); border-color: rgba(239, 68, 68, 0.3);";
      if (crop.score >= 80) {
        badgeStyle = "background-color: var(--primary-light); color: var(--primary); border-color: rgba(16, 185, 129, 0.3);";
      } else if (crop.score >= 50) {
        badgeStyle = "background-color: var(--accent-light); color: var(--accent); border-color: rgba(245, 158, 11, 0.3);";
      }

      return `
        <div class="card crop-card">
          <span class="suitability-badge" style="${badgeStyle}">${crop.score}% Suitable</span>
          <div class="crop-card-header">
            <div class="crop-icon-box">${crop.icon}</div>
            <div>
              <h3>${crop.name}</h3>
              <p style="font-size: 0.8rem; text-transform: uppercase; color: var(--primary); font-weight: 700;">${crop.season} Crop</p>
            </div>
          </div>
          <div class="crop-card-details">
            <div class="crop-detail-item">
              <span>Sowing Period:</span>
              <span>${crop.sowing}</span>
            </div>
            <div class="crop-detail-item">
              <span>Growing Cycle:</span>
              <span>${crop.duration}</span>
            </div>
            <div class="crop-detail-item">
              <span>Est. Yield:</span>
              <span>${crop.yield}</span>
            </div>
            <div class="crop-detail-item">
              <span>Market Value:</span>
              <span style="color: ${crop.returns === 'Very High' || crop.returns === 'High' ? 'var(--primary)' : 'var(--accent)'}">${crop.returns}</span>
            </div>
          </div>
          <div style="border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 12px;">
            <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">
              <strong>Tip:</strong> ${crop.tip}
            </p>
          </div>
        </div>
      `;
    }).join('');
  }

  // Register in global app callbacks
  window.CropCare.onInit(initRecommender);

  // Proactive binding to update state-based suggestions on region switch
  window.CropCare.onLocationChange((loc) => {
    // Modify form values dynamically based on selected state's climate
    const climateState = {
      punjab: { season: 'rabi', soil: 'loamy', temp: '18', water: 'medium' },
      maharashtra: { season: 'kharif', soil: 'black', temp: '29', water: 'medium' },
      uttar_pradesh: { season: 'rabi', soil: 'alluvial', temp: '22', water: 'medium' },
      west_bengal: { season: 'kharif', soil: 'clayey', temp: '31', water: 'high' },
      kerala: { season: 'kharif', soil: 'clayey', temp: '28', water: 'high' },
      rajasthan: { season: 'zaid', soil: 'sandy', temp: '38', water: 'low' }
    };

    const config = climateState[loc];
    if (config) {
      const formSeason = document.getElementById('rec-season');
      const formSoil = document.getElementById('rec-soil');
      const formTemp = document.getElementById('rec-temp');
      const formWater = document.getElementById('rec-water');

      if (formSeason) formSeason.value = config.season;
      if (formSoil) formSoil.value = config.soil;
      if (formTemp) formTemp.value = config.temp;
      if (formWater) formWater.value = config.water;

      calculateAndRender();
    }
  });

})();
