// Fertilizer & Pesticide Calculator Module
(function() {
  // Nutrient and Pesticide constants per acre for standard growth
  const CROP_RECIPES = {
    paddy: {
      name: "Paddy (Rice)",
      ureaPerAcre: 100, // Nitrogen source in kg
      sspPerAcre: 75,   // Phosphorus source in kg
      mopPerAcre: 40,   // Potassium source in kg
      pesticidePerAcre: 500, // ml
      organicEquivalent: "Vermicompost: 2.0 Tons & Neem Cake: 150 kg",
      recommendedBio: "Jeevamrita (200L) + Azospirillum bio-fertilizer (2 kg)",
      pestAlternative: "Neem Astra (applied every 15 days from transplantation)"
    },
    wheat: {
      name: "Wheat",
      ureaPerAcre: 110,
      sspPerAcre: 90,
      mopPerAcre: 30,
      pesticidePerAcre: 400,
      organicEquivalent: "Well-decomposed Farmyard Manure (FYM): 4.0 Tons",
      recommendedBio: "Jeevamrita (200L) + Azotobacter culture (2 kg)",
      pestAlternative: "Agnihastra (if termites or stem borers appear)"
    },
    cotton: {
      name: "Cotton",
      ureaPerAcre: 120,
      sspPerAcre: 80,
      mopPerAcre: 50,
      pesticidePerAcre: 750,
      organicEquivalent: "Vermicompost: 2.5 Tons & Castor Cake: 200 kg",
      recommendedBio: "Jeevamrita (200L) + PSB (Phosphorus Solubilizing Bacteria - 2 kg)",
      pestAlternative: "Brahmastra or Neem Oil solution (1500 ppm)"
    },
    mustard: {
      name: "Mustard",
      ureaPerAcre: 80,
      sspPerAcre: 70,
      mopPerAcre: 25,
      pesticidePerAcre: 300,
      organicEquivalent: "Farmyard Manure: 3.0 Tons & Mustard Cake: 100 kg",
      recommendedBio: "Jeevamrita (200L) + Sulphur-solubilizing bacteria (1.5 kg)",
      pestAlternative: "Ginger-Garlic-Chilli Extract (for Aphids control)"
    },
    sugarcane: {
      name: "Sugarcane",
      ureaPerAcre: 250,
      sspPerAcre: 120,
      mopPerAcre: 80,
      pesticidePerAcre: 1000,
      organicEquivalent: "Compost/Press mud: 6.0 Tons & Neem Cake: 250 kg",
      recommendedBio: "Jeevamrita (400L - split doses) + Acetobacter culture (3 kg)",
      pestAlternative: "Trichoderma culture (seed treatment) & Agnihastra"
    },
    onion: {
      name: "Onion",
      ureaPerAcre: 90,
      sspPerAcre: 75,
      mopPerAcre: 45,
      pesticidePerAcre: 350,
      organicEquivalent: "Poultry Manure: 1.5 Tons or Vermicompost: 2.0 Tons",
      recommendedBio: "Jeevamrita (200L) + Mycorrhizae (VAM - 10 kg)",
      pestAlternative: "Dashparni Ark (for thrips and blight control)"
    },
    potato: {
      name: "Potato",
      ureaPerAcre: 150,
      sspPerAcre: 100,
      mopPerAcre: 80,
      pesticidePerAcre: 600,
      organicEquivalent: "Vermicompost: 3.5 Tons & Ash: 150 kg (potash replacement)",
      recommendedBio: "Jeevamrita (200L) + PSB (2 kg) + Trichoderma viride (1 kg)",
      pestAlternative: "Neem Oil spray & Copper Oxychloride alternative (Bordeaux mixture)"
    }
  };

  // Organic Bio-concoctions recipes
  const ORGANIC_RECIPES = {
    jeevamrita: {
      name: "Jeevamrita (Growth Promoter)",
      ingredients: [
        "Fresh Desi Cow Dung: 10 kg",
        "Desi Cow Urine: 10 Litres",
        "Jaggery (Gud): 2 kg",
        "Pulse Flour (Besan/Gram): 2 kg",
        "Fertile Forest Soil: 1 Handful",
        "Clean Water: 200 Litres"
      ],
      method: "Mix all ingredients thoroughly in a plastic drum. Stir clockwise with a wooden stick twice daily. Keep in shade. Ferment for 5-7 days. Apply 200L per acre via irrigation water or spray."
    },
    neem_astra: {
      name: "Neem Astra (Sucking Pests)",
      ingredients: [
        "Desi Cow Urine: 10 Litres",
        "Fresh Cow Dung: 2 kg",
        "Crushed Neem Leaves & Twigs: 10 kg",
        "Water: 100 Litres"
      ],
      method: "Crush the neem leaves into a fine paste. Add cow dung, urine, and water in a container. Stir well. Cover with a gunny bag and ferment in shade for 24-48 hours. Filter and spray directly on crops without dilution."
    },
    agnihastra: {
      name: "Agnihastra (Caterpillars & Borers)",
      ingredients: [
        "Desi Cow Urine: 10 Litres",
        "Tobacco Leaves (Crushed): 500 g",
        "Hot Green Chilli Paste: 500 g",
        "Garlic Paste: 250 g",
        "Neem Leaves Pulp: 5 kg"
      ],
      method: "Boil the mixture in a copper pot, stirring constantly. Simmer for 15-20 minutes. Let it cool for 48 hours. Strain using a muslin cloth. Dilute 2.5 Litres of Agnihastra in 100 Litres of water to spray."
    }
  };

  // Initialize Calculator
  function initCalculator() {
    const calcBtn = document.getElementById('calc-run-btn');
    const areaInput = document.getElementById('calc-area');
    const cropSelect = document.getElementById('calc-crop');
    const unitSelect = document.getElementById('calc-unit');
    const recipeSelect = document.getElementById('organic-recipe-select');

    if (calcBtn) {
      calcBtn.addEventListener('click', (e) => {
        e.preventDefault();
        runCalculation();
      });
    }

    if (recipeSelect) {
      recipeSelect.addEventListener('change', (e) => {
        renderOrganicRecipe(e.target.value);
      });
      // Initial recipe load
      renderOrganicRecipe(recipeSelect.value);
    }

    // Run default calculation
    runCalculation();
  }

  // Calculate dosages and update DOM
  function runCalculation() {
    const cropKey = document.getElementById('calc-crop').value;
    const areaVal = parseFloat(document.getElementById('calc-area').value) || 1;
    const unit = document.getElementById('calc-unit').value;
    
    const recipe = CROP_RECIPES[cropKey];
    if (!recipe) return;

    // Convert area to Acres (1 Hectare = 2.47 Acres)
    const multiplier = unit === 'hectares' ? (areaVal * 2.471) : areaVal;

    // Chemical outputs
    const urea = Math.round(recipe.ureaPerAcre * multiplier);
    const ssp = Math.round(recipe.sspPerAcre * multiplier);
    const mop = Math.round(recipe.mopPerAcre * multiplier);
    const pest = Math.round(recipe.pesticidePerAcre * multiplier);

    // Calculate NPK components based on typical percentage configurations
    // Urea = 46% N, SSP = 16% P, MOP = 60% K
    const nitrogen = Math.round(urea * 0.46);
    const phosphorus = Math.round(ssp * 0.16);
    const potassium = Math.round(mop * 0.60);

    // Update DOM inputs
    updateText('#calc-out-urea', `${urea} kg`);
    updateText('#calc-out-ssp', `${ssp} kg`);
    updateText('#calc-out-mop', `${mop} kg`);
    updateText('#calc-out-pesticide', `${pest} ml`);
    updateText('#calc-out-npk', `N: ${nitrogen}kg | P: ${phosphorus}kg | K: ${potassium}kg`);

    // Organic Promo Updates
    updateText('#organic-equiv-text', recipe.organicEquivalent);
    updateText('#organic-bio-text', recipe.recommendedBio);
    updateText('#organic-pest-text', recipe.pestAlternative);

    // Dynamic cost saving estimation
    // Urea ~₹6/kg, SSP ~₹12/kg, MOP ~₹34/kg, Pesticide ~₹1200/litre
    const chemCost = Math.round((urea * 6) + (ssp * 12) + (mop * 34) + ((pest / 1000) * 1200));
    updateText('#organic-savings-cost', `₹${chemCost}`);
  }

  function updateText(selector, text) {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  }

  // Render organic preparation instructions
  function renderOrganicRecipe(recipeKey) {
    const recipe = ORGANIC_RECIPES[recipeKey];
    const detailsContainer = document.getElementById('organic-recipe-details');
    
    if (!recipe || !detailsContainer) return;

    detailsContainer.innerHTML = `
      <h3 style="color: var(--primary); margin-bottom: 8px;">${recipe.name}</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;"><i class="fas fa-flask"></i> Safe, Eco-Friendly, Cost: ₹0</p>
      
      <h4 style="font-size: 0.9rem; margin-bottom: 6px;">Required Ingredients:</h4>
      <ul class="recipe-ingredients">
        ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
      </ul>
      
      <h4 style="font-size: 0.9rem; margin-top: 14px; margin-bottom: 6px;">Method & Fermentation:</h4>
      <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4;">
        ${recipe.method}
      </p>
    `;
  }

  // Register in global callbacks
  window.CropCare.onInit(initCalculator);

})();
