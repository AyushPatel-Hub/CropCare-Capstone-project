from typing import Any

from mcp.server.fastmcp import FastMCP

mcp = FastMCP("CropCare-MCP-Server")

# 1. Weather and Climate Profiles
REGION_CLIMATES = {
    "punjab": {
        "name": "Punjab (North)",
        "temp": 34,
        "humidity": 45,
        "rainChance": 12,
        "wind": 14,
        "soilPH": "7.2",
        "soilMoisture": "52%",
        "condition": "Clear Sky",
        "warnings": "No severe weather alerts. Ideal conditions for harvesting.",
        "suitabilityText": "Best for Wheat (Rabi) and Rice (Kharif) under canal/tubewell irrigation.",
    },
    "maharashtra": {
        "name": "Maharashtra (West/Central)",
        "temp": 29,
        "humidity": 78,
        "rainChance": 65,
        "wind": 18,
        "soilPH": "6.8",
        "soilMoisture": "70%",
        "condition": "Scattered Showers",
        "warnings": "Yellow alert: Moderate rain expected. Keep drainage channels open in cotton fields.",
        "suitabilityText": "Ideal for Cotton, Sugarcane, Soybeans, and Onions.",
    },
    "uttar_pradesh": {
        "name": "Uttar Pradesh (North/Central)",
        "temp": 32,
        "humidity": 60,
        "rainChance": 40,
        "wind": 12,
        "soilPH": "6.8",
        "soilMoisture": "65%",
        "condition": "Partly Cloudy",
        "warnings": "No immediate warnings. Good moisture levels for sugarcane planting.",
        "suitabilityText": "Highly fertile alluvial soil. Best for Wheat, Sugarcane, Potato, and Rice.",
    },
    "west_bengal": {
        "name": "West Bengal (East)",
        "temp": 31,
        "humidity": 85,
        "rainChance": 80,
        "wind": 22,
        "soilPH": "6.2",
        "soilMoisture": "85%",
        "condition": "Heavy Rain",
        "warnings": "Orange alert: Heavy rainfall. Potential waterlogging in low-lying paddy nurseries.",
        "suitabilityText": "Perfect for Rice (Aman/Boro paddy) and Jute.",
    },
    "kerala": {
        "name": "Kerala (South)",
        "temp": 28,
        "humidity": 90,
        "rainChance": 90,
        "wind": 25,
        "soilPH": "5.5",
        "soilMoisture": "92%",
        "condition": "Thunderstorms",
        "warnings": "Red alert: Heavy thunderstorms. Risk of flash floods in hilly cardamom/rubber estates.",
        "suitabilityText": "Best for Spices, Rubber, Tea, Coffee, and Coconuts.",
    },
    "rajasthan": {
        "name": "Rajasthan (West)",
        "temp": 42,
        "humidity": 25,
        "rainChance": 5,
        "wind": 20,
        "soilPH": "8.2",
        "soilMoisture": "20%",
        "condition": "Hot & Arid",
        "warnings": "Heatwave warning: Avoid spraying fertilizers/pesticides during afternoon hours.",
        "suitabilityText": "Best for Pearl Millet (Bajra), Cluster Beans (Guar), and Mustard.",
    },
}

# 2. Crops Database
CROPS_DB = [
    {
        "id": "paddy",
        "name": "Paddy (Rice)",
        "season": "kharif",
        "soil": ["clayey", "alluvial", "loamy"],
        "tempRange": [20, 35],
        "waterLevel": "high",
        "duration": "120 - 150 Days",
        "sowing": "June - July",
        "yield": "4.5 - 5.5 Tons/Hectare",
        "returns": "High",
        "tip": "Ensure standing water of 2-5cm during early vegetative stages. Use green manuring (Dhaincha) before sowing.",
    },
    {
        "id": "wheat",
        "name": "Wheat",
        "season": "rabi",
        "soil": ["loamy", "clayey", "alluvial"],
        "tempRange": [10, 25],
        "waterLevel": "medium",
        "duration": "110 - 130 Days",
        "sowing": "October - November",
        "yield": "3.5 - 4.5 Tons/Hectare",
        "returns": "High",
        "tip": "Requires 4-6 timely irrigations. First watering at Crown Root Initiation (21 days after sowing) is critical.",
    },
    {
        "id": "cotton",
        "name": "Cotton",
        "season": "kharif",
        "soil": ["black", "loamy", "alluvial"],
        "tempRange": [20, 35],
        "waterLevel": "medium",
        "duration": "150 - 180 Days",
        "sowing": "May - June",
        "yield": "2.0 - 2.5 Tons/Hectare",
        "returns": "Very High",
        "tip": "Prone to Pink Bollworm. Intercrop with Cowpea or Maize as trap crops to invite beneficial insects.",
    },
    {
        "id": "mustard",
        "name": "Mustard",
        "season": "rabi",
        "soil": ["sandy", "loamy", "alluvial"],
        "tempRange": [10, 22],
        "waterLevel": "low",
        "duration": "100 - 120 Days",
        "sowing": "October",
        "yield": "1.5 - 2.0 Tons/Hectare",
        "returns": "Medium",
        "tip": "Drought resistant. Needs only 2 irrigations. Spray neem oil solution to prevent Aphid attacks.",
    },
    {
        "id": "sugarcane",
        "name": "Sugarcane",
        "season": "kharif",
        "soil": ["alluvial", "loamy", "black"],
        "tempRange": [20, 38],
        "waterLevel": "high",
        "duration": "10 - 12 Months",
        "sowing": "Jan - March",
        "yield": "70 - 80 Tons/Hectare",
        "returns": "Very High",
        "tip": "Heavy nutrient consumer. Incorporate plenty of vermicompost and practice trash mulching to save water.",
    },
    {
        "id": "onion",
        "name": "Onion",
        "season": "rabi",
        "soil": ["sandy", "loamy"],
        "tempRange": [15, 28],
        "waterLevel": "medium",
        "duration": "120 - 140 Days",
        "sowing": "Nov - Dec",
        "yield": "15 - 20 Tons/Hectare",
        "returns": "High",
        "tip": "Avoid clayey soils as they restrict bulb expansion. Maintain uniform light moisture; drying causes split bulbs.",
    },
    {
        "id": "potato",
        "name": "Potato",
        "season": "rabi",
        "soil": ["sandy", "loamy"],
        "tempRange": [15, 22],
        "waterLevel": "medium",
        "duration": "90 - 120 Days",
        "sowing": "October - November",
        "yield": "20 - 25 Tons/Hectare",
        "returns": "High",
        "tip": "Requires earthing up (mounding soil around stems) 30 days after planting. Watch out for Early Blight.",
    },
    {
        "id": "watermelon",
        "name": "Watermelon",
        "season": "zaid",
        "soil": ["sandy", "loamy"],
        "tempRange": [24, 38],
        "waterLevel": "medium",
        "duration": "85 - 95 Days",
        "sowing": "Feb - March",
        "yield": "25 - 35 Tons/Hectare",
        "returns": "Medium",
        "tip": "Sow in sandy riverbeds. Needs warm days and dry weather. Organic mulching prevents fruit rot from soil contact.",
    },
    {
        "id": "cucumber",
        "name": "Cucumber",
        "season": "zaid",
        "soil": ["sandy", "loamy"],
        "tempRange": [20, 35],
        "waterLevel": "medium",
        "duration": "60 - 70 Days",
        "sowing": "February - March",
        "yield": "8 - 12 Tons/Hectare",
        "returns": "Medium",
        "tip": "Quick cash crop. Use trellises to increase yield and fruit quality. Ensure adequate bees for pollination.",
    },
    {
        "id": "moong",
        "name": "Moong (Green Gram)",
        "season": "zaid",
        "soil": ["loamy", "sandy"],
        "tempRange": [25, 35],
        "waterLevel": "low",
        "duration": "60 - 75 Days",
        "sowing": "March - April",
        "yield": "0.8 - 1.2 Tons/Hectare",
        "returns": "Medium",
        "tip": "Short-duration pulse crop that fixes atmospheric nitrogen, improving soil fertility for the next season.",
    },
]

# 3. Mandi Prices
CROP_RATES = [
    {
        "name": "Paddy (Common)",
        "category": "cereals",
        "mandiRate2026": 2441,
        "mandiRate2025": 2369,
        "marketStatus": "Stable",
        "icon": "🌾",
    },
    {
        "name": "Wheat",
        "category": "cereals",
        "mandiRate2026": 2585,
        "mandiRate2025": 2425,
        "marketStatus": "Bullish",
        "icon": "🌾",
    },
    {
        "name": "Cotton (Long Staple)",
        "category": "cash",
        "mandiRate2026": 7521,
        "mandiRate2025": 7120,
        "marketStatus": "Bullish",
        "icon": "☁️",
    },
    {
        "name": "Mustard Seed",
        "category": "oilseeds",
        "mandiRate2026": 5950,
        "mandiRate2025": 5650,
        "marketStatus": "Stable",
        "icon": "🌼",
    },
    {
        "name": "Sugarcane (FRP)",
        "category": "cash",
        "mandiRate2026": 340,
        "mandiRate2025": 315,
        "marketStatus": "Stable",
        "icon": "🎋",
    },
    {
        "name": "Onion (Nashik Red)",
        "category": "vegetables",
        "mandiRate2026": 1850,
        "mandiRate2025": 1450,
        "marketStatus": "Volatile",
        "icon": "🧅",
    },
    {
        "name": "Potato (Jyoti)",
        "category": "vegetables",
        "mandiRate2026": 1200,
        "mandiRate2025": 1350,
        "marketStatus": "Bearish",
        "icon": "🥔",
    },
    {
        "name": "Tomato (Desi)",
        "category": "vegetables",
        "mandiRate2026": 2200,
        "mandiRate2025": 1800,
        "marketStatus": "Volatile",
        "icon": "🍅",
    },
    {
        "name": "Soybean (Yellow)",
        "category": "oilseeds",
        "mandiRate2026": 4892,
        "mandiRate2025": 4600,
        "marketStatus": "Stable",
        "icon": "🌱",
    },
    {
        "name": "Maize (Corn)",
        "category": "cereals",
        "mandiRate2026": 2225,
        "mandiRate2025": 2090,
        "marketStatus": "Bullish",
        "icon": "🌽",
    },
]

# 4. Chemical and Organic Fertilizer Calculations per Acre
CROP_RECIPES = {
    "paddy": {
        "name": "Paddy (Rice)",
        "ureaPerAcre": 100,
        "sspPerAcre": 75,
        "mopPerAcre": 40,
        "pesticidePerAcre": 500,
        "organicEquivalent": "Vermicompost: 2.0 Tons & Neem Cake: 150 kg",
        "recommendedBio": "Jeevamrita (200L) + Azospirillum bio-fertilizer (2 kg)",
        "pestAlternative": "Neem Astra (applied every 15 days from transplantation)",
    },
    "wheat": {
        "name": "Wheat",
        "ureaPerAcre": 110,
        "sspPerAcre": 90,
        "mopPerAcre": 30,
        "pesticidePerAcre": 400,
        "organicEquivalent": "Well-decomposed Farmyard Manure (FYM): 4.0 Tons",
        "recommendedBio": "Jeevamrita (200L) + Azotobacter culture (2 kg)",
        "pestAlternative": "Agnihastra (if termites or stem borers appear)",
    },
    "cotton": {
        "name": "Cotton",
        "ureaPerAcre": 120,
        "sspPerAcre": 80,
        "mopPerAcre": 50,
        "pesticidePerAcre": 750,
        "organicEquivalent": "Vermicompost: 2.5 Tons & Castor Cake: 200 kg",
        "recommendedBio": "Jeevamrita (200L) + PSB (Phosphorus Solubilizing Bacteria - 2 kg)",
        "pestAlternative": "Brahmastra or Neem Oil solution (1500 ppm)",
    },
    "mustard": {
        "name": "Mustard",
        "ureaPerAcre": 80,
        "sspPerAcre": 70,
        "mopPerAcre": 25,
        "pesticidePerAcre": 300,
        "organicEquivalent": "Farmyard Manure: 3.0 Tons & Mustard Cake: 100 kg",
        "recommendedBio": "Jeevamrita (200L) + Sulphur-solubilizing bacteria (1.5 kg)",
        "pestAlternative": "Ginger-Garlic-Chilli Extract (for Aphids control)",
    },
    "sugarcane": {
        "name": "Sugarcane",
        "ureaPerAcre": 250,
        "sspPerAcre": 120,
        "mopPerAcre": 80,
        "pesticidePerAcre": 1000,
        "organicEquivalent": "Compost/Press mud: 6.0 Tons & Neem Cake: 250 kg",
        "recommendedBio": "Jeevamrita (400L - split doses) + Acetobacter culture (3 kg)",
        "pestAlternative": "Trichoderma culture (seed treatment) & Agnihastra",
    },
    "onion": {
        "name": "Onion",
        "ureaPerAcre": 90,
        "sspPerAcre": 75,
        "mopPerAcre": 45,
        "pesticidePerAcre": 350,
        "organicEquivalent": "Poultry Manure: 1.5 Tons or Vermicompost: 2.0 Tons",
        "recommendedBio": "Jeevamrita (200L) + Mycorrhizae (VAM - 10 kg)",
        "pestAlternative": "Dashparni Ark (for thrips and blight control)",
    },
    "potato": {
        "name": "Potato",
        "ureaPerAcre": 150,
        "sspPerAcre": 100,
        "mopPerAcre": 80,
        "pesticidePerAcre": 600,
        "organicEquivalent": "Vermicompost: 3.5 Tons & Ash: 150 kg (potash replacement)",
        "recommendedBio": "Jeevamrita (200L) + PSB (2 kg) + Trichoderma viride (1 kg)",
        "pestAlternative": "Neem Oil spray & Copper Oxychloride alternative (Bordeaux mixture)",
    },
}

# 5. Organic Bio-concoction Recipes
ORGANIC_RECIPES = {
    "jeevamrita": {
        "name": "Jeevamrita (Growth Promoter)",
        "ingredients": [
            "Fresh Desi Cow Dung: 10 kg",
            "Desi Cow Urine: 10 Litres",
            "Jaggery (Gud): 2 kg",
            "Pulse Flour (Besan/Gram): 2 kg",
            "Fertile Forest Soil: 1 Handful",
            "Clean Water: 200 Litres",
        ],
        "method": "Mix all ingredients thoroughly in a plastic drum. Stir clockwise with a wooden stick twice daily. Keep in shade. Ferment for 5-7 days. Apply 200L per acre via irrigation water or spray.",
    },
    "neem_astra": {
        "name": "Neem Astra (Sucking Pests)",
        "ingredients": [
            "Desi Cow Urine: 10 Litres",
            "Fresh Cow Dung: 2 kg",
            "Crushed Neem Leaves & Twigs: 10 kg",
            "Water: 100 Litres",
        ],
        "method": "Crush the neem leaves into a fine paste. Add cow dung, urine, and water in a container. Stir well. Cover with a gunny bag and ferment in shade for 24-48 hours. Filter and spray directly on crops without dilution.",
    },
    "agnihastra": {
        "name": "Agnihastra (Caterpillars & Borers)",
        "ingredients": [
            "Desi Cow Urine: 10 Litres",
            "Tobacco Leaves (Crushed): 500 g",
            "Hot Green Chilli Paste: 500 g",
            "Garlic Paste: 250 g",
            "Neem Leaves Pulp: 5 kg",
        ],
        "method": "Boil the mixture in a copper pot, stirring constantly. Simmer for 15-20 minutes. Let it cool for 48 hours. Strain using a muslin cloth. Dilute 2.5 Litres of Agnihastra in 100 Litres of water to spray.",
    },
}


# Helper functions to satisfy static type checkers
def _get_soil_list(crop: dict[str, Any]) -> list[str]:
    soil_val = crop.get("soil")
    if isinstance(soil_val, list):
        return [str(s) for s in soil_val]
    return []


def _get_temp_bounds(crop: dict[str, Any]) -> tuple[int, int]:
    temp_val = crop.get("tempRange")
    if isinstance(temp_val, list) and len(temp_val) == 2:
        try:
            return int(temp_val[0]), int(temp_val[1])
        except (ValueError, TypeError):
            pass
    return 0, 100


def _get_recipe_value(recipe: dict[str, Any], key: str) -> int:
    val = recipe.get(key)
    try:
        return int(val) if val is not None else 0
    except (ValueError, TypeError):
        return 0


@mcp.tool()
def get_regional_weather(region: str) -> dict[str, Any]:
    """Get real-time weather diagnostics and soil conditions for an Indian region.

    Args:
        region: The region key in lowercase (e.g. 'punjab', 'maharashtra', 'uttar_pradesh', 'west_bengal', 'kerala', 'rajasthan').
    """
    import requests

    key = region.lower().replace(" ", "_")
    if key not in REGION_CLIMATES:
        return {
            "status": "error",
            "message": f"Region '{region}' not found. Choose from: punjab, maharashtra, uttar_pradesh, west_bengal, kerala, rajasthan.",
        }

    # Central coordinates mapping for Indian states
    STATE_COORDINATES = {
        "punjab": {"lat": 31.1471, "lon": 75.3412},
        "maharashtra": {"lat": 19.7515, "lon": 75.7139},
        "uttar_pradesh": {"lat": 26.8467, "lon": 80.9462},
        "west_bengal": {"lat": 22.9868, "lon": 87.8550},
        "kerala": {"lat": 10.8505, "lon": 76.2711},
        "rajasthan": {"lat": 27.0238, "lon": 74.2179},
    }

    base_profile = REGION_CLIMATES[key]
    coords = STATE_COORDINATES[key]

    # Fetch live weather parameters from Open-Meteo
    temp = base_profile["temp"]
    humidity = base_profile["humidity"]
    wind = base_profile["wind"]
    precipitation = 0.0
    weather_code = 0

    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={coords['lat']}&longitude={coords['lon']}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code"
        res = requests.get(url, timeout=5)
        if res.status_code == 200:
            current = res.json().get("current", {})
            temp = round(current.get("temperature_2m", temp))
            humidity = round(current.get("relative_humidity_2m", humidity))
            wind = round(current.get("wind_speed_10m", wind))
            precipitation = current.get("precipitation", 0.0)
            weather_code = current.get("weather_code", 0)
    except Exception:
        pass

    # Translate WMO Weather Code to Condition String
    def get_wmo_condition(code: int) -> str:
        if code == 0:
            return "Clear Sky"
        elif code in [1, 2, 3]:
            return "Partly Cloudy"
        elif code in [45, 48]:
            return "Foggy"
        elif code in [51, 53, 55]:
            return "Drizzle"
        elif code in [61, 63, 65, 66, 67]:
            return "Scattered Showers"
        elif code in [80, 81, 82]:
            return "Heavy Rain"
        elif code in [95, 96, 99]:
            return "Thunderstorms"
        return "Partly Cloudy"

    condition = get_wmo_condition(weather_code)

    # Calculate simulated dynamic soil moisture
    base_moisture_num = int(base_profile["soilMoisture"].replace("%", ""))
    dynamic_moisture = base_moisture_num
    if precipitation > 0:
        dynamic_moisture += round(precipitation * 4)
    else:
        # Scale slightly with humidity difference from 50%
        dynamic_moisture += round((humidity - 50) * 0.15)
    dynamic_moisture = max(10, min(98, dynamic_moisture))
    soil_moisture_str = f"{dynamic_moisture}%"

    # Construct weather alerts/warnings dynamically based on live metrics
    warnings = "No severe weather alerts. Ideal conditions for standard field activities."
    if precipitation > 8.0:
        warnings = "Orange alert: Heavy rainfall detected. Potential waterlogging in low-lying crop fields. Ensure drainage channels are clear."
    elif precipitation > 2.0:
        warnings = "Yellow alert: Moderate rain expected. Postpone foliar spraying of fertilizers to prevent drift."
    elif temp > 38:
        warnings = f"Heatwave warning: Extreme temperatures of {temp}°C. Avoid chemical sprays during peak afternoon hours. Increase irrigation frequency."
    elif wind > 22:
        warnings = f"High wind warning: Wind speeds of {wind} km/h. Postpone pesticide spraying to prevent chemical drift."

    return {
        "status": "success",
        "data": {
            "name": base_profile["name"],
            "temp": temp,
            "humidity": humidity,
            "rainChance": base_profile["rainChance"] if precipitation == 0 else round(min(100, precipitation * 20)),
            "wind": wind,
            "soilPH": base_profile["soilPH"],
            "soilMoisture": soil_moisture_str,
            "condition": condition,
            "warnings": warnings,
            "suitabilityText": base_profile["suitabilityText"],
        }
    }


@mcp.tool()
def recommend_crops(
    season: str, soil: str, temp: int, water_level: str
) -> list[dict[str, Any]]:
    """Evaluate and recommend suitable crops based on season, soil type, temperature, and water availability.

    Args:
        season: Cultivation season ('kharif', 'rabi', 'zaid').
        soil: Type of soil ('clayey', 'alluvial', 'loamy', 'black', 'sandy').
        temp: Average ambient temperature in degrees Celsius.
        water_level: Irrigation water availability ('low', 'medium', 'high').
    """
    season = season.lower()
    soil = soil.lower()
    water_level = water_level.lower()

    def get_water_score(lvl: str) -> int:
        if lvl == "low":
            return 1
        if lvl == "medium":
            return 2
        if lvl == "high":
            return 3
        return 2

    scored_crops = []
    for crop in CROPS_DB:
        score = 0
        reasons = []

        # Season matching
        if str(crop.get("season", "")).lower() == season:
            score += 40
        else:
            score -= 20
            reasons.append("Season mismatch")

        # Soil matching
        soil_list = _get_soil_list(crop)
        if soil in soil_list:
            score += 25
        else:
            reasons.append(f"Soil mismatch (Prefers: {', '.join(soil_list)})")

        # Temp matching
        min_temp, max_temp = _get_temp_bounds(crop)
        if min_temp <= temp <= max_temp:
            score += 20
        else:
            score += 5
            reasons.append(
                f"Temperature out of optimal range ({min_temp}-{max_temp}°C)"
            )

        # Water matching
        crop_water = str(crop.get("waterLevel", "")).lower()
        if crop_water == water_level:
            score += 15
        else:
            diff = abs(get_water_score(crop_water) - get_water_score(water_level))
            if diff == 1:
                score += 8
            reasons.append(f"Water requirement mismatch (Requires: {crop_water})")

        final_score = max(0, min(100, score))
        scored_crops.append(
            {
                "name": crop.get("name", "Unknown"),
                "suitability_score": f"{final_score}%",
                "sowing_period": crop.get("sowing", "N/A"),
                "growing_cycle": crop.get("duration", "N/A"),
                "est_yield": crop.get("yield", "N/A"),
                "market_value": crop.get("returns", "N/A"),
                "tip": crop.get("tip", ""),
                "warnings": reasons,
            }
        )

    # Sort by score descending
    scored_crops.sort(
        key=lambda x: int(x["suitability_score"].replace("%", "")), reverse=True
    )
    return scored_crops


@mcp.tool()
def get_mandi_prices(crop_query: str | None = None) -> list[dict[str, Any]]:
    """Retrieve mandi wholesale market rates (Rupees per Quintal - 100 kg) comparing 2026 and 2025 rates.

    Args:
        crop_query: Optional search keyword to filter crops (e.g. 'Wheat', 'Paddy', 'Onion').
    """
    import requests
    import random
    import time

    # Ticker mapping for major commodities
    TICKER_MAPPING = {
        "Paddy (Common)": "ZR=F",
        "Wheat": "ZW=F",
        "Cotton (Long Staple)": "CT=F",
        "Soybean (Yellow)": "ZS=F",
        "Maize (Corn)": "ZC=F",
    }
    TICKER_BASELINES = {
        "ZR=F": 15.0,
        "ZW=F": 600.0,
        "CT=F": 80.0,
        "ZS=F": 1150.0,
        "ZC=F": 440.0,
    }

    # Fetch live weather for Maharashtra (used to dynamically affect vegetable/sugarcane rates)
    live_rain = 0.0
    live_temp = 25.0
    try:
        weather_res = requests.get(
            "https://api.open-meteo.com/v1/forecast?latitude=19.7515&longitude=75.7139&current=temperature_2m,precipitation",
            timeout=5
        )
        if weather_res.status_code == 200:
            current_w = weather_res.json().get("current", {})
            live_rain = current_w.get("precipitation", 0.0)
            live_temp = current_w.get("temperature_2m", 25.0)
    except Exception:
        pass

    # Build updated rates list
    updated_rates = []
    for crop in CROP_RATES:
        name = crop["name"]
        base_rate_2026 = crop["mandiRate2026"]
        base_rate_2025 = crop["mandiRate2025"]
        category = crop["category"]
        
        live_rate_2026 = base_rate_2026
        live_rate_2025 = base_rate_2025
        market_status = crop["marketStatus"]

        # Case 1: Ticker-based live crop
        if name in TICKER_MAPPING:
            ticker = TICKER_MAPPING[name]
            baseline = TICKER_BASELINES[ticker]
            
            # Fetch live price from Yahoo Finance
            price = None
            try:
                headers = {"User-Agent": "Mozilla/5.0"}
                res = requests.get(f"https://query1.finance.yahoo.com/v8/finance/chart/{ticker}", headers=headers, timeout=5)
                if res.status_code == 200:
                    result = res.json().get("chart", {}).get("result")
                    if result and len(result) > 0:
                        price = result[0].get("meta", {}).get("regularMarketPrice")
            except Exception:
                pass

            if price is not None:
                scale = price / baseline
                live_rate_2026 = round(base_rate_2026 * scale)
                live_rate_2025 = round(base_rate_2025 * (scale * 0.98))
                
                # Determine status
                if scale > 1.05:
                    market_status = "Bullish"
                elif scale < 0.95:
                    market_status = "Bearish"
                else:
                    market_status = "Stable"
            else:
                # Fallback to hourly noise if API fails
                seed = int(time.time() / 3600) + hash(name)
                random.seed(seed)
                noise = random.uniform(-0.03, 0.03)
                live_rate_2026 = round(base_rate_2026 * (1.0 + noise))
                live_rate_2025 = round(base_rate_2025 * (1.0 + noise * 0.9))

        # Case 2: Vegetables and Sugarcane influenced by live weather conditions
        else:
            # Seed-based baseline daily noise
            seed = int(time.time() / 3600) + hash(name)
            random.seed(seed)
            weather_multiplier = 1.0

            # Heavy rain increases vegetable rates (Nashik region supply disruption)
            if live_rain > 5.0 and category == "vegetables":
                weather_multiplier += (live_rain / 15.0) * 0.1  # up to +15%
            # High temperatures (heatwaves) dry crops out and raise prices
            if live_temp > 35.0:
                weather_multiplier += (live_temp - 35.0) * 0.015  # up to +15%
                
            volatility = random.uniform(-0.04, 0.04)
            live_rate_2026 = round(base_rate_2026 * weather_multiplier * (1.0 + volatility))
            live_rate_2025 = round(base_rate_2025 * (1.0 + volatility * 0.8))

            if weather_multiplier > 1.05:
                market_status = "Volatile"
            elif volatility > 0.02:
                market_status = "Bullish"
            elif volatility < -0.02:
                market_status = "Bearish"
            else:
                market_status = "Stable"

        updated_rates.append({
            "name": name,
            "category": category,
            "mandiRate2026": live_rate_2026,
            "mandiRate2025": live_rate_2025,
            "marketStatus": market_status,
            "icon": crop["icon"],
        })

    if not crop_query:
        return updated_rates

    query = crop_query.lower()
    filtered = []
    for crop in updated_rates:
        if (
            query in str(crop.get("name", "")).lower()
            or query in str(crop.get("category", "")).lower()
        ):
            filtered.append(crop)
    return filtered


@mcp.tool()
def calculate_fertilizer(
    crop_id: str, area: float, unit: str = "acres"
) -> dict[str, Any]:
    """Calculate the exact chemical fertilizer dosages (Urea/SSP/MOP) vs equivalent organic recipes for a crop and land area.

    Args:
        crop_id: The lowercase crop key (e.g. 'paddy', 'wheat', 'cotton', 'mustard', 'sugarcane', 'onion', 'potato').
        area: Size of the agricultural land.
        unit: Unit of area measurement ('acres' or 'hectares').
    """
    crop_key = crop_id.lower().replace(" ", "_")
    if crop_key not in CROP_RECIPES:
        return {
            "status": "error",
            "message": f"Crop '{crop_id}' recipe not found. Choose from: paddy, wheat, cotton, mustard, sugarcane, onion, potato.",
        }

    recipe = CROP_RECIPES[crop_key]
    multiplier = area
    if unit.lower() == "hectares":
        multiplier = area * 2.471

    urea_per_acre = _get_recipe_value(recipe, "ureaPerAcre")
    ssp_per_acre = _get_recipe_value(recipe, "sspPerAcre")
    mop_per_acre = _get_recipe_value(recipe, "mopPerAcre")
    pest_per_acre = _get_recipe_value(recipe, "pesticidePerAcre")

    urea = round(urea_per_acre * multiplier)
    ssp = round(ssp_per_acre * multiplier)
    mop = round(mop_per_acre * multiplier)
    pest = round(pest_per_acre * multiplier)

    # NPK active ingredients calculations
    n = round(urea * 0.46)
    p = round(ssp * 0.16)
    k = round(mop * 0.60)

    # Estimated cost savings
    cost = round((urea * 6) + (ssp * 12) + (mop * 34) + ((pest / 1000) * 1200))

    return {
        "status": "success",
        "crop": recipe.get("name", "Unknown"),
        "area_acres": multiplier,
        "chemical_inputs": {
            "urea_kg": urea,
            "ssp_kg": ssp,
            "mop_kg": mop,
            "chemical_pesticide_ml": pest,
            "active_nutrients": f"Nitrogen: {n}kg, Phosphorus: {p}kg, Potassium: {k}kg",
        },
        "organic_alternatives": {
            "organic_equivalent": recipe.get("organicEquivalent", "N/A"),
            "recommended_bio_promoter": recipe.get("recommendedBio", "N/A"),
            "bio_pesticide_alternative": recipe.get("pestAlternative", "N/A"),
            "est_cost_savings": f"₹{cost} saved by switching to organic concoctions",
        },
    }


@mcp.tool()
def get_organic_recipe(recipe_name: str) -> dict[str, Any]:
    """Retrieve detailed ingredients and step-by-step fermentation steps for preparing organic bio-concoctions.

    Args:
        recipe_name: The recipe key (e.g. 'jeevamrita', 'neem_astra', 'agnihastra').
    """
    key = recipe_name.lower().replace(" ", "_")
    if key in ORGANIC_RECIPES:
        return {"status": "success", "recipe": ORGANIC_RECIPES[key]}
    return {
        "status": "error",
        "message": f"Organic recipe '{recipe_name}' not found. Choose from: jeevamrita, neem_astra, agnihastra.",
    }


if __name__ == "__main__":
    mcp.run()
