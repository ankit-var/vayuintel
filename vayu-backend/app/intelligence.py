from typing import List, Dict, Any
from datetime import datetime, timezone
from app.alerts import get_cpcb_category

def generate_intelligence(city: str, observations: List[Dict], weather: Dict, aqi_data: Dict) -> Dict[str, Any]:
    now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    
    if not aqi_data or "aqi" not in aqi_data:
        return {
            "location": city,
            "timestamp": now,
            "measured_facts": "No recent valid observations available to determine air quality.",
            "weather_context": "Insufficient data to correlate weather with pollution dispersion.",
            "source_hypotheses": "Cannot determine potential sources without pollutant measurements.",
            "data_quality": "Missing or invalid data."
        }
        
    aqi = aqi_data["aqi"]
    prominent = aqi_data.get("prominent_pollutant", "Unknown")
    cat_info = get_cpcb_category(aqi)
    
    # 1. Measured Facts
    facts = f"The current AQI is {aqi} ({cat_info['category']}). "
    if prominent != "Unknown":
        facts += f"The primary elevated pollutant is {prominent}. "
        
    param_counts = {}
    for obs in observations:
        p = obs.get("parameter")
        if p:
            param_counts[p] = param_counts.get(p, 0) + 1
            
    facts += f"Data is aggregated from {len(observations)} recent measurements across {len(set([o.get('station_id') for o in observations]))} active stations."

    # 2. Weather Context (Hypotheses based on weather)
    weather_ctx = ""
    if weather and weather.get("temperature") is not None:
        temp = weather["temperature"]
        wind = weather["wind_speed"]
        humid = weather["humidity"]
        weather_ctx += f"Current conditions: {temp}°C, Wind: {wind} km/h, Humidity: {humid}%. "
        
        if wind < 5.0:
            weather_ctx += "Low wind speeds may cause pollutants to stagnate and accumulate locally. "
        elif wind > 15.0:
            weather_ctx += "Higher wind speeds generally aid in the dispersion of particulate matter, though they may also transport dust. "
            
        if temp < 15.0:
            weather_ctx += "Cooler temperatures can lead to thermal inversions, trapping pollution near the surface. "
    else:
        weather_ctx = "Weather data is currently unavailable to assess dispersion conditions."

    # 3. Source Hypotheses (Strictly separated and qualified)
    hypotheses = "Based on typical patterns for the prominent pollutant, possible sources may include: "
    if prominent in ["PM2.5", "PM10"]:
        hypotheses += "vehicular exhaust, construction dust, industrial emissions, or biomass burning. "
    elif prominent == "NO2":
        hypotheses += "combustion processes, primarily from vehicle engines and power plants. "
    else:
        hypotheses += "various local emission sources. "
        
    hypotheses += "(Note: These are general hypotheses based on pollutant types, not validated source apportionment data.)"

    return {
        "location": city,
        "timestamp": now,
        "measured_facts": facts,
        "weather_context": weather_ctx,
        "source_hypotheses": hypotheses,
        "data_quality": "Based on real-time OpenAQ aggregated measurements (Demonstration MVP).",
        "sources": {
            "air_quality": "OpenAQ",
            "weather": weather.get("source", "Unknown")
        }
    }
