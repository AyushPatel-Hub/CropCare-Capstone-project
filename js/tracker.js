// Crop Tracker Module
(function() {
  // Stage checklists configuration
  const STAGE_CONFIG = {
    germination: {
      label: "Sowing & Germination",
      durationDays: 10,
      tasks: [
        "Prepare seed beds and fertilize with well-decayed organic compost.",
        "Sow seeds at correct depth and maintain uniform light moisture.",
        "Check for first sprouts (usually within 3-7 days).",
        "Monitor for birds or insect pests attacking young shoots."
      ]
    },
    vegetative: {
      label: "Vegetative Growth",
      durationDays: 35, // 11 to 45
      tasks: [
        "Perform first weeding session (remove resource-hogging weeds).",
        "Apply first dose of Jeevamrita (200L/acre) or vermicompost.",
        "Inspect leaves for sucking pests (aphids, thrips).",
        "Ensure uniform watering (soil should be damp, not flooded)."
      ]
    },
    flowering: {
      label: "Flowering",
      durationDays: 30, // 46 to 75
      tasks: [
        "Avoid water stress (under-watering or heavy flooding) to prevent flower drop.",
        "Inspect flowers for fungal mold or early borers.",
        "Apply light organic foliar spray (like diluted Neem Astra).",
        "Add organic mulching to hold soil moisture."
      ]
    },
    maturity: {
      label: "Fruiting / Maturity",
      durationDays: 35, // 76 to 110
      tasks: [
        "Reduce water supply gradually to prompt ripening.",
        "Check ripening color of fruit/grains.",
        "Protect fields from animal or bird theft.",
        "Clear threshing floors or storage areas for incoming harvest."
      ]
    },
    harvest: {
      label: "Harvesting & Storage",
      durationDays: 10, // 111+
      tasks: [
        "Harvest crops during dry, sunny mornings.",
        "Dry grain/produce properly in shade to reduce moisture level (<12%).",
        "Pack in clean, rodent-proof bags.",
        "Update sales logs and calculate seasonal profits."
      ]
    }
  };

  // Seed data if localstorage is empty
  const SEED_TRACKERS = [
    {
      id: "track-101",
      cropName: "Paddy (Rice)",
      variety: "Basmati (PB-1121)",
      plantationDate: getPastDate(42), // 42 days ago
      area: 2.5,
      unit: "acres",
      logs: [
        { date: getPastDate(42), note: "Seeds sowed in nursery beds." },
        { date: getPastDate(30), note: "Seedlings transplanted to main field." },
        { date: getPastDate(15), note: "Applied Jeevamrita growth promoter." }
      ],
      completedTasks: [
        "germination-0", "germination-1", "germination-2", "germination-3",
        "vegetative-0", "vegetative-1"
      ]
    },
    {
      id: "track-102",
      cropName: "Cotton",
      variety: "Bt Cotton (Hybrid)",
      plantationDate: getPastDate(115), // 115 days ago
      area: 4.0,
      unit: "acres",
      logs: [
        { date: getPastDate(115), note: "Seeds sown in black soil." },
        { date: getPastDate(95), note: "Foliar spray of Neem oil completed." },
        { date: getPastDate(50), note: "Flower budding phase started." },
        { date: getPastDate(10), note: "Cotton bolls beginning to burst." }
      ],
      completedTasks: [
        "germination-0", "germination-1", "germination-2",
        "vegetative-0", "vegetative-1", "vegetative-2",
        "flowering-0", "flowering-1", "flowering-2", "flowering-3",
        "maturity-0", "maturity-1", "maturity-2"
      ]
    }
  ];

  // Helper to generate dynamic dates
  function getPastDate(daysAgo) {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  }

  // Save/Load helpers
  function getTrackers() {
    let trackers = localStorage.getItem('cropcare_trackers');
    if (!trackers) {
      localStorage.setItem('cropcare_trackers', JSON.stringify(SEED_TRACKERS));
      trackers = JSON.stringify(SEED_TRACKERS);
    }
    return JSON.parse(trackers);
  }

  function saveTrackers(trackers) {
    localStorage.setItem('cropcare_trackers', JSON.stringify(trackers));
  }

  // Initialize Tracker Module
  function initTracker() {
    // Bind Add Crop button to open modal
    const addBtn = document.getElementById('add-crop-tracker-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        window.CropCare.modals.open('modal-add-tracker');
      });
    }

    // Bind form submit
    const form = document.getElementById('form-add-tracker');
    if (form) {
      form.addEventListener('submit', handleAddTrackerSubmit);
    }

    // Render list
    renderTrackersList();
  }

  // Handle Form Submission
  function handleAddTrackerSubmit(e) {
    e.preventDefault();
    
    const cropName = document.getElementById('track-crop-name').value;
    const variety = document.getElementById('track-variety').value;
    const plantationDate = document.getElementById('track-date').value;
    const area = parseFloat(document.getElementById('track-area').value) || 1;
    const unit = document.getElementById('track-unit').value;

    const newTracker = {
      id: 'track-' + Date.now(),
      cropName,
      variety,
      plantationDate,
      area,
      unit,
      logs: [
        { date: new Date().toISOString().split('T')[0], note: "Crop track initiated. Seeds planted." }
      ],
      completedTasks: []
    };

    const trackers = getTrackers();
    trackers.unshift(newTracker);
    saveTrackers(trackers);

    // Reset and close modal
    document.getElementById('form-add-tracker').reset();
    window.CropCare.modals.close('modal-add-tracker');

    // Re-render
    renderTrackersList();
  }

  // Delete Tracker
  window.deleteTracker = function(id) {
    if (confirm("Are you sure you want to stop tracking this crop? This will delete all logged data.")) {
      let trackers = getTrackers();
      trackers = trackers.filter(t => t.id !== id);
      saveTrackers(trackers);
      renderTrackersList();
    }
  };

  // Add customized activity log
  window.addTrackerLog = function(e, id) {
    e.preventDefault();
    const input = document.getElementById(`log-input-${id}`);
    const note = input?.value.trim();
    if (!note) return;

    const trackers = getTrackers();
    const tracker = trackers.find(t => t.id === id);
    if (tracker) {
      tracker.logs.unshift({
        date: new Date().toISOString().split('T')[0],
        note: note
      });
      saveTrackers(trackers);
      
      // Clear input and update DOM logs
      input.value = '';
      renderTrackersList();
    }
  };

  // Toggle tasks completion state
  window.toggleTrackerTask = function(trackerId, taskKey) {
    const trackers = getTrackers();
    const tracker = trackers.find(t => t.id === trackerId);
    if (tracker) {
      const idx = tracker.completedTasks.indexOf(taskKey);
      if (idx > -1) {
        tracker.completedTasks.splice(idx, 1);
      } else {
        tracker.completedTasks.push(taskKey);
      }
      saveTrackers(trackers);
      renderTrackersList();
    }
  };

  // Calculate current stage & percentage
  function getCropProgress(plantationDateStr) {
    const plantation = new Date(plantationDateStr);
    const today = new Date();
    const diffTime = Math.abs(today - plantation);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Days elapsed
    
    let currentStage = 'germination';
    let progressPct = 0;
    
    // Stages breakdown:
    // Germination: 0 - 10 days
    // Vegetative: 11 - 45 days (duration 35)
    // Flowering: 46 - 75 days (duration 30)
    // Maturity: 76 - 110 days (duration 35)
    // Harvest: 111+ days
    
    if (diffDays <= 10) {
      currentStage = 'germination';
      progressPct = Math.round((diffDays / 10) * 20);
    } else if (diffDays <= 45) {
      currentStage = 'vegetative';
      progressPct = 20 + Math.round(((diffDays - 10) / 35) * 20);
    } else if (diffDays <= 75) {
      currentStage = 'flowering';
      progressPct = 40 + Math.round(((diffDays - 45) / 30) * 20);
    } else if (diffDays <= 110) {
      currentStage = 'maturity';
      progressPct = 60 + Math.round(((diffDays - 75) / 35) * 20);
    } else {
      currentStage = 'harvest';
      progressPct = Math.min(100, 80 + Math.round(((diffDays - 110) / 10) * 20));
    }

    return {
      daysElapsed: diffDays,
      currentStage,
      progressPct
    };
  }

  // Render tracker lists to HTML
  function renderTrackersList() {
    const listContainer = document.getElementById('trackers-list-container');
    if (!listContainer) return;

    const trackers = getTrackers();
    if (trackers.length === 0) {
      listContainer.innerHTML = `
        <div class="card" style="text-align: center; color: var(--text-secondary); padding: 40px;">
          <i class="fas fa-seedling" style="font-size: 3rem; margin-bottom: 16px; color: var(--text-muted);"></i>
          <h3>No Crops Under Tracking</h3>
          <p style="margin-top: 8px; margin-bottom: 20px;">Add your first crop to track growth, schedule nutrients, and prepare for harvest.</p>
          <button class="btn btn-primary" onclick="window.CropCare.modals.open('modal-add-tracker')">Track a Crop</button>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = trackers.map(tracker => {
      const { daysElapsed, currentStage, progressPct } = getCropProgress(tracker.plantationDate);

      // Render stepper indicators
      const stages = ['germination', 'vegetative', 'flowering', 'maturity', 'harvest'];
      let activeFound = false;

      const stepperHTML = stages.map(st => {
        let stateClass = "";
        
        if (st === currentStage) {
          stateClass = "active";
          activeFound = true;
        } else if (!activeFound) {
          stateClass = "completed";
        }
        
        return `
          <div class="timeline-step ${stateClass}">
            <div class="step-node">${stateClass === 'completed' ? '✓' : ''}</div>
            <div class="step-label">${STAGE_CONFIG[st].label}</div>
          </div>
        `;
      }).join('');

      // Tasks for the active stage
      const activeStageTasks = STAGE_CONFIG[currentStage].tasks;
      const tasksHTML = activeStageTasks.map((task, idx) => {
        const taskKey = `${currentStage}-${idx}`;
        const isChecked = tracker.completedTasks.includes(taskKey) ? 'checked' : '';
        return `
          <li>
            <input type="checkbox" id="${tracker.id}-${taskKey}" ${isChecked} 
              onclick="window.toggleTrackerTask('${tracker.id}', '${taskKey}')">
            <label for="${tracker.id}-${taskKey}" style="cursor: pointer; ${isChecked ? 'text-decoration: line-through; color: var(--text-muted);' : ''}">${task}</label>
          </li>
        `;
      }).join('');

      // Logs entries
      const logsHTML = tracker.logs.map(log => `
        <div class="log-entry">
          <span>${log.note}</span>
          <span style="font-size: 0.75rem; color: var(--text-muted);">${log.date}</span>
        </div>
      `).join('');

      // Harvest prediction date (approximated based on 120 days average)
      const harvestDateObj = new Date(tracker.plantationDate);
      harvestDateObj.setDate(harvestDateObj.getDate() + 120);
      const estHarvestDate = harvestDateObj.toISOString().split('T')[0];

      return `
        <div class="card tracker-card" style="border-left-color: ${progressPct === 100 ? 'var(--primary)' : 'var(--secondary)'}">
          <div class="tracker-meta">
            <div class="tracker-info">
              <h3>${tracker.cropName}</h3>
              <p>Variety: <strong>${tracker.variety}</strong> | Sowing Area: <strong>${tracker.area} ${tracker.unit}</strong></p>
              <p style="margin-top: 4px;">Sown on: <strong>${tracker.plantationDate}</strong> (${daysElapsed} days elapsed) | Est. Harvest: <strong>${estHarvestDate}</strong></p>
            </div>
            <div class="tracker-actions">
              <span class="trend-badge up" style="padding: 6px 12px; font-size: 0.85rem;"><i class="fas fa-bars-progress"></i> Progress: ${progressPct}%</span>
              <button class="btn btn-secondary" style="padding: 6px 12px; color: var(--danger);" onclick="window.deleteTracker('${tracker.id}')">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>

          <!-- Stepper timeline -->
          <div class="timeline-stepper">
            ${stepperHTML}
          </div>

          <div class="grid-2">
            <!-- Active checklists -->
            <div class="step-content-panel">
              <h4 style="border-bottom: 1px solid var(--border-color); padding-bottom: 8px; margin-bottom: 10px;">
                <i class="fas fa-list-check" style="color: var(--primary);"></i> Current Stage Tasks: ${STAGE_CONFIG[currentStage].label}
              </h4>
              <ul class="step-tasks-list">
                ${tasksHTML}
              </ul>
            </div>

            <!-- Activity Logging -->
            <div class="tracker-logs">
              <h4><i class="fas fa-clipboard-list" style="color: var(--secondary);"></i> Activity & Observations Log</h4>
              <div class="logs-list">
                ${logsHTML}
              </div>
              <form class="add-log-form" onsubmit="window.addTrackerLog(event, '${tracker.id}')">
                <input type="text" id="log-input-${tracker.id}" class="form-input" placeholder="Record weeding, spraying, or watering..." required>
                <button type="submit" class="btn btn-primary" style="padding: 8px 16px;"><i class="fas fa-plus"></i> Log</button>
              </form>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Register onInit callback
  window.CropCare.onInit(initTracker);

})();
