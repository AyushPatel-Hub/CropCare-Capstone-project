// Market Rates (Mandi Price Tracker) Module
(function() {
  // Mock Mandi Prices in India (Rates are in Rupees per Quintal - 100 kg)
  const CROP_RATES = [
    {
      name: "Paddy (Common)",
      category: "cereals",
      mandiRate2026: 2441,
      mandiRate2025: 2369,
      history: [2369, 2380, 2395, 2410, 2425, 2441],
      marketStatus: "Stable",
      icon: "🌾"
    },
    {
      name: "Wheat",
      category: "cereals",
      mandiRate2026: 2585,
      mandiRate2025: 2425,
      history: [2425, 2450, 2480, 2520, 2560, 2585],
      marketStatus: "Bullish",
      icon: "🌾"
    },
    {
      name: "Cotton (Long Staple)",
      category: "cash",
      mandiRate2026: 7521,
      mandiRate2025: 7120,
      history: [7120, 7150, 7220, 7340, 7450, 7521],
      marketStatus: "Bullish",
      icon: "☁️"
    },
    {
      name: "Mustard Seed",
      category: "oilseeds",
      mandiRate2026: 5950,
      mandiRate2025: 5650,
      history: [5650, 5700, 5820, 5750, 5880, 5950],
      marketStatus: "Stable",
      icon: "🌼"
    },
    {
      name: "Sugarcane (FRP)",
      category: "cash",
      mandiRate2026: 340, // FRP per quintal is lower (subsidized flat)
      mandiRate2025: 315,
      history: [315, 320, 325, 330, 335, 340],
      marketStatus: "Stable",
      icon: "🎋"
    },
    {
      name: "Onion (Nashik Red)",
      category: "vegetables",
      mandiRate2026: 1850,
      mandiRate2025: 1450,
      history: [1450, 1600, 1900, 1750, 1680, 1850],
      marketStatus: "Volatile",
      icon: "🧅"
    },
    {
      name: "Potato (Jyoti)",
      category: "vegetables",
      mandiRate2026: 1200,
      mandiRate2025: 1350,
      history: [1350, 1420, 1380, 1250, 1180, 1200],
      marketStatus: "Bearish",
      icon: "🥔"
    },
    {
      name: "Tomato (Desi)",
      category: "vegetables",
      mandiRate2026: 2200,
      mandiRate2025: 1800,
      history: [1800, 1600, 2400, 3200, 2800, 2200],
      marketStatus: "Volatile",
      icon: "🍅"
    },
    {
      name: "Soybean (Yellow)",
      category: "oilseeds",
      mandiRate2026: 4892,
      mandiRate2025: 4600,
      history: [4600, 4650, 4720, 4800, 4850, 4892],
      marketStatus: "Stable",
      icon: "🌱"
    },
    {
      name: "Maize (Corn)",
      category: "cereals",
      mandiRate2026: 2225,
      mandiRate2025: 2090,
      history: [2090, 2120, 2150, 2190, 2210, 2225],
      marketStatus: "Bullish",
      icon: "🌽"
    }
  ];

  // Initialize Rates Module
  function initRates() {
    const searchInput = document.getElementById('mandi-search');
    const categorySelect = document.getElementById('mandi-filter');

    if (searchInput) {
      searchInput.addEventListener('input', filterAndRenderRates);
    }
    if (categorySelect) {
      categorySelect.addEventListener('change', filterAndRenderRates);
    }

    // Initial render
    filterAndRenderRates();
  }

  // Filter prices and render to table
  function filterAndRenderRates() {
    const searchVal = document.getElementById('mandi-search')?.value.toLowerCase() || '';
    const catVal = document.getElementById('mandi-filter')?.value || 'all';
    const tbody = document.getElementById('mandi-table-body');
    
    if (!tbody) return;

    const filtered = CROP_RATES.filter(crop => {
      const matchSearch = crop.name.toLowerCase().includes(searchVal);
      const matchCat = catVal === 'all' || crop.category === catVal;
      return matchSearch && matchCat;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 30px;">No crop rates found matching search criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map((crop, idx) => {
      const priceDiff = crop.mandiRate2026 - crop.mandiRate2025;
      const pctChange = ((priceDiff / crop.mandiRate2025) * 100).toFixed(1);
      
      const isUp = priceDiff >= 0;
      const trendClass = isUp ? 'up' : 'down';
      const trendArrow = isUp ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down';
      const formattedDiff = isUp ? `+₹${priceDiff}` : `-₹${Math.abs(priceDiff)}`;
      const formattedPct = isUp ? `+${pctChange}%` : `${pctChange}%`;

      return `
        <tr>
          <td>
            <div class="crop-cell">
              <div class="crop-badge-icon">${crop.icon}</div>
              <span>${crop.name}</span>
            </div>
          </td>
          <td style="font-weight: 700;">₹${crop.mandiRate2026} <span style="font-size: 0.75rem; color: var(--text-muted);">/ qtl</span></td>
          <td style="color: var(--text-secondary);">₹${crop.mandiRate2025} <span style="font-size: 0.75rem; color: var(--text-muted);">/ qtl</span></td>
          <td>
            <span class="trend-badge ${trendClass}">
              <i class="fas ${trendArrow}"></i> ${formattedPct} (${formattedDiff})
            </span>
          </td>
          <td>
            <canvas id="sparkline-${idx}" class="sparkline-canvas" width="80" height="30"></canvas>
          </td>
          <td>
            <span style="font-size: 0.85rem; font-weight: 600; color: ${
              crop.marketStatus === 'Bullish' ? 'var(--primary)' : 
              crop.marketStatus === 'Volatile' ? 'var(--accent)' : 'var(--text-secondary)'
            }">${crop.marketStatus}</span>
          </td>
        </tr>
      `;
    }).join('');

    // Draw sparklines for each canvas after render completes
    filtered.forEach((crop, idx) => {
      setTimeout(() => {
        drawSparkline(`sparkline-${idx}`, crop.history, priceDiffColor(crop.mandiRate2026 - crop.mandiRate2025));
      }, 0);
    });
  }

  function priceDiffColor(diff) {
    // Theme colors: green #10b981 or red #ef4444
    return diff >= 0 ? '#10b981' : '#ef4444';
  }

  // Draw smooth sparkline curves using HTML5 Canvas
  function drawSparkline(canvasId, data, strokeColor) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Compute min/max
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    // Coordinate mapping helpers
    const getX = (index) => padding + (index / (data.length - 1)) * (width - 2 * padding);
    const getY = (value) => padding + (1 - (value - min) / range) * (height - 2 * padding);

    // Draw gradient fill below path
    ctx.beginPath();
    ctx.moveTo(getX(0), height);
    for (let i = 0; i < data.length; i++) {
      ctx.lineTo(getX(i), getY(data[i]));
    }
    ctx.lineTo(getX(data.length - 1), height);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, strokeColor + '30'); // 30 is alpha in hex
    gradient.addColorStop(1, strokeColor + '00');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw stroke line
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(data[0]));
    for (let i = 1; i < data.length; i++) {
      // Draw bezier curves for smoothness
      const xc = (getX(i - 1) + getX(i)) / 2;
      const yc = (getY(i - 1) + getY(i)) / 2;
      ctx.quadraticCurveTo(getX(i - 1), getY(i - 1), xc, yc);
    }
    ctx.lineTo(getX(data.length - 1), getY(data[data.length - 1]));
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw endpoint dot
    ctx.beginPath();
    ctx.arc(getX(data.length - 1), getY(data[data.length - 1]), 2.5, 0, 2 * Math.PI);
    ctx.fillStyle = strokeColor;
    ctx.fill();
  }

  // Register onInit callback
  window.CropCare.onInit(initRates);

})();
