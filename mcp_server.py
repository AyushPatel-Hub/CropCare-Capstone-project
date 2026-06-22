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
    key = region.lower().replace(" ", "_")
    if key in REGION_CLIMATES:
        return {"status": "success", "data": REGION_CLIMATES[key]}
    return {
        "status": "error",
        "message": f"Region '{region}' not found. Choose from: punjab, maharashtra, uttar_pradesh, west_bengal, kerala, rajasthan.",
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
    if not crop_query:
        return CROP_RATES

    query = crop_query.lower()
    filtered = []
    for crop in CROP_RATES:
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
