# CropCare - Smart Farmer Assistant

CropCare is an interactive, responsive, and aesthetically premium Single Page Application (SPA) designed to empower Indian farmers with data-driven insights. It aggregates environment details, crop suitability calculations, wholesale mandi rates, organic nutrient recipes, growth timeline tracking, rain forecasting, and agricultural news in a single dark-themed glassmorphic dashboard.

![CropCare Dashboard Screenshot](screenshot.png)

---

## 📋 Table of Contents
1. [Project Details & Overview](#-project-details--overview)
2. [Technology Stack](#-technology-stack)
3. [Workflow Diagram](#-workflow-diagram)
4. [Implementation Plan](#-implementation-plan)
5. [Local Setup & Execution](#-local-setup--execution)

---

## 🌾 Project Details & Overview

Agriculture in India is heavily dependent on weather conditions, seasonal market shifts, and soil health. Farmers often face challenges due to information gaps regarding fluctuating market prices, chemical-to-organic fertilizer conversions, and weather warnings. 

CropCare bridges this gap by offering:
* **Real-Time Climate Diagnostics**: Automated weather, soil pH, and soil moisture calculations customized for six major Indian regions (including Punjab, Maharashtra, Uttar Pradesh, Rajasthan, Kerala, and West Bengal).
* **Crop Recommender**: A scoring algorithm matching current climate data, soil types, and water availability to rank suitable crops (with suitability percentages).
* **Indian Mandi price tracker**: Compares current crop rates (2026) with the previous year's rates (2025) and renders 6-month historical canvas trends.
* **Organic Fertilizer Promoter**: An input calculator that estimates conventional Urea/SSP/MOP dosages alongside organic vermicompost equivalents, and provides step-by-step fermentation recipes for *Jeevamrita*, *Neem Astra*, and *Agnihastra*.
* **Active Crop Tracker**: A checklist-based timeline tracker backed by browser `localStorage` to log crop sowing, weeding, spraying, and harvesting tasks.
* **Agri-News Feed**: Searchable articles covering AgriTech, Government Schemes, and Organic success stories.

---

## 💻 Technology Stack

* **Structure**: Semantic HTML5 (Single Page Application architecture with dynamic section views)
* **Styling**: Vanilla CSS3 (Custom properties, grid & flexbox layouts, CSS backdrop filters for glassmorphism, responsive media queries, keyframe animations)
* **Logic**: JavaScript ES6+ (Native module design pattern, state observers, LocalStorage API, HTML5 Canvas API for dynamic trend-line drawings)
* **Assets**: FontAwesome v6.4 (icons), Google Fonts (Outfit & Plus Jakarta Sans)

---

## 📊 Workflow Diagram

```mermaid
graph TD
    A[index.html Shell] --> B(Sidebar Navigation)
    A --> C(Header Controls)
    
    C -->|Select State| C1[Location Change Observer]
    C1 -->|Update climate data| D[Weather & Environment Dashboard]
    C1 -->|Prefill params| E[Crop Recommender Engine]
    
    B -->|View: Climate| D
    B -->|View: Recommender| E
    B -->|View: Mandi Rates| F[Indian Mandi Tracker]
    B -->|View: Calculator| G[NPK & Bio-Concoctions Calculator]
    B -->|View: Tracker| H[Crop Timeline Tracker]
    B -->|View: News| I[Agri-News Feed]
    
    D -->|Simulate precipitation| D1[Rain Simulator & Particle Generator]
    E -->|Evaluate Season, Soil, Temp, Water| E1[Suitability Matcher %]
    F -->|Query / Category filter| F1[Wholesale Rate comparisons & Canvas Sparklines]
    G -->|NPK formula calculation| G1[Chemical inputs dosage vs organic recipes]
    H -->|Add Crop Tracker Modal| H1[Sowing timelines, Stage Checklists & Activity Logs]
    H1 -->|Auto Save / Read| H2[(Browser LocalStorage)]
    I -->|Search / Filter by tab| I1[News Cards & Bookmark state]
```

---

## 🛠️ Implementation Plan

### Main Components
* **`index.html`**: Establishes the layout grids, sidebar routing targets, modal form screens, and references all dependencies.
* **`style.css`**: Configures HSL color variables (mint green, deep slate, amber accents), layout boundaries, timeline stepper nodes, and light theme overrides.
* **`app.js`**: Core state orchestrator. Manages initialization states to prevent race conditions, navigation hash routing, theme configuration toggles, and modal states.
* **`js/weather.js`**: Coordinates climate metrics, SVG-based rain charts, and the particle rain simulator.
* **`js/recommender.js`**: Holds the crop parameters database and processes compatibility rankings.
* **`js/rates.js`**: Manages Agmarknet averages and handles HTML5 Canvas path drawings.
* **`js/calculator.js`**: Outputs N-P-K ratios and houses bio-pesticide recipes.
* **`js/tracker.js`**: Powers CRUD timelines, milestone checklists, and logs saving.
* **`js/news.js`**: Controls bookmarks and handles category query filters.

The Model Context Protocol (MCP) Server The custom MCP server (mcp_server.py) acts as a bridge between the AI agent and the external APIs. It packages the raw JSON responses from the Open-Meteo and Yahoo Finance APIs into structured dictionary outputs matching the expected MCP tools schema:
get_regional_weather(region: str) get_mandi_prices(crop_query: str | None) recommend_crops(season, soil, temp, water_level) get_organic_recipes(recipe_query: str | None)

ADK and the Chatbot Agent Definition (app/agent.py): Defines an Agent initialized with the Gemini model, custom instructions, and the MCP tools. It communicates with the MCP server running as a sub-process via sys.executable to dynamically execute the tools. FastAPI Server (app/fast_api_app.py): Wraps the ADK app to expose API endpoints. We disabled the default ADK playground UI (web=False) to host the CropCare frontend files directly on the root path / using FastAPI's StaticFiles mount. Real-time SSE Streaming Chat (app.js): Upon chat initialization, the frontend calls POST /apps/app/users/ayush_farmer/sessions to register the session ID in the server's memory. When a question is submitted, it initiates a connection to /run_sse with streaming: true. The frontend reads the stream chunk-by-chunk using a TextDecoder and a buffered loop, parsing data: {…} event payloads as they arrive, enabling the chatbot to output responses word-by-word.

Production Deployment Dockerfile: A multi-stage setup that installs uv, creates a virtual environment, and executes the server. We optimized the container command to bind to dynamic hosting ports: render.yaml: The infrastructure-as-code blueprint defining a web service running Python. It includes: Proper environment setups (GOOGLE_API_KEY and GEMINI_API_KEY passed to authenticate the Gemini SDK). Auto-routing and health checks configured on the root route /health. Automatic triggers to build and spin up the Docker container whenever changes are pushed to GitHub.
   agents-cli playground
   # Or run directly via: uv run adk web .
   ```

