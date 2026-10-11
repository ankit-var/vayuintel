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
            "data_quality": "Missing or unavailable upstream model data."
        }

    aqi = aqi_data["aqi"]
    prominent = aqi_data.get("prominent_pollutant", "Unknown")
    cat_info = get_cpcb_category(aqi)

    # 1. Measured Facts
    facts = f"The current estimated AQI is {aqi} ({cat_info['category']}). "
    if prominent != "Unknown":
        facts += f"The primary elevated pollutant is {prominent}. "

    active_stations_count = len(set([o.get('station_id') for o in observations]))
    facts += f"Data is assimilated from {len(observations)} parameter points across {active_stations_count} reference points within the regional atmospheric grid."

    # 2. Weather Context (Hypotheses based on weather)
    weather_ctx = ""
    if weather and weather.get("temperature") is not None:
        temp = weather["temperature"]
        wind = weather["wind_speed"]
        humid = weather["humidity"]
        weather_ctx += f"Current conditions: {temp}°C, Wind: {wind} km/h, Humidity: {humid}%. "

        if wind is not None and wind < 5.0:
            weather_ctx += "Low wind speeds may cause pollutants to stagnate and accumulate locally. "
        elif wind is not None and wind > 15.0:
            weather_ctx += "Higher wind speeds generally aid in the dispersion of particulate matter, though they may also transport regional dust. "

        if temp is not None and temp < 15.0:
            weather_ctx += "Cooler temperatures can lead to thermal boundary layer inversions, trapping pollution near the surface. "
    else:
        weather_ctx = "Weather data is currently unavailable to assess dispersion conditions."

    # 3. Source Hypotheses (Strictly separated and qualified)
    hypotheses = "Based on typical patterns for the prominent pollutant, possible regional sources may include: "
    if prominent in ["PM2.5", "PM10"]:
        hypotheses += "vehicular exhaust, road & construction dust, industrial emissions, or seasonal biomass burning. "
    elif prominent == "NO2":
        hypotheses += "combustion processes, primarily from heavy vehicular corridors and industrial power generation. "
    else:
        hypotheses += "various local emission sources. "

    hypotheses += "(Note: Atmospheric model hypotheses based on pollutant profiles; not statutory chemical apportionment.)"

    return {
        "location": city,
        "timestamp": now,
        "measured_facts": facts,
        "weather_context": weather_ctx,
        "source_hypotheses": hypotheses,
        "data_quality": "Based on Open-Meteo / CAMS numerical atmospheric model (~40km grid cell resolution).",
        "sources": {
            "air_quality": "Open-Meteo / Copernicus Atmospheric Monitoring Service (CAMS)",
            "weather": weather.get("source", "Open-Meteo Weather Model")
        }
    }
