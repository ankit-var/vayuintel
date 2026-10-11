from typing import List, Dict, Any
from datetime import datetime, timezone, timedelta
import uuid

def get_cpcb_category(aqi: int) -> Dict[str, str]:
    if aqi <= 50:
        return {"category": "Good", "severity": "INFO", "precautions": "Air quality is satisfactory, and air pollution poses little or no risk."}
    elif aqi <= 100:
        return {"category": "Satisfactory", "severity": "INFO", "precautions": "Minor breathing discomfort to sensitive people."}
    elif aqi <= 200:
        return {"category": "Moderate", "severity": "WARNING", "precautions": "Breathing discomfort to people with lungs, asthma and heart diseases."}
    elif aqi <= 300:
        return {"category": "Poor", "severity": "CRITICAL", "precautions": "Breathing discomfort to most people on prolonged exposure."}
    elif aqi <= 400:
        return {"category": "Very Poor", "severity": "CRITICAL", "precautions": "Respiratory illness on prolonged exposure."}
    else:
        return {"category": "Severe", "severity": "CRITICAL", "precautions": "Affects healthy people and seriously impacts those with existing respiratory conditions."}

def generate_alerts(city: str, current_aqi_data: Dict, forecast_data: List[Dict]) -> List[Dict]:
    alerts = []
    now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    if not current_aqi_data or "aqi" not in current_aqi_data:
        return alerts

    current_aqi = current_aqi_data["aqi"]
    cat_info = get_cpcb_category(current_aqi)

    # Generate alert for current conditions if Poor or worse
    if current_aqi > 200:
        alerts.append({
            "id": str(uuid.uuid4()),
            "severity": cat_info["severity"],
            "title": f"Current AQI is {cat_info['category']}",
            "description": f"Model-estimated AQI is {current_aqi} (CPCB formula). {cat_info['precautions']} Note: Check local SPCB/CPCB for statutory regulatory advisories.",
            "issued_at": now,
            "active_until": (datetime.now(timezone.utc) + timedelta(hours=12)).isoformat().replace("+00:00", "Z"),
            "evidence": f"Estimated AQI: {current_aqi} (Dominant: {current_aqi_data.get('prominent_pollutant')})",
            "data_source": "Open-Meteo / CAMS Model Estimate",
            "is_predicted": False,
            "location": city
        })

    # Check forecast for severe degradation (only if it gets worse than current)
    worse_forecasts = [f for f in forecast_data if not f.get("is_observed") and f.get("aqi_projected", 0) > max(current_aqi, 250)]
    if worse_forecasts:
        worst_forecast = max(worse_forecasts, key=lambda x: x["aqi_projected"])
        f_cat_info = get_cpcb_category(worst_forecast["aqi_projected"])

        alerts.append({
            "id": str(uuid.uuid4()),
            "severity": f_cat_info["severity"],
            "title": f"Forecast: AQI may reach {f_cat_info['category']}",
            "description": f"Projected AQI is {worst_forecast['aqi_projected']} at horizon +{worst_forecast['horizon_hours']}h. {f_cat_info['precautions']}",
            "issued_at": now,
            "active_until": worst_forecast["timestamp"],
            "evidence": f"Projected AQI: {worst_forecast['aqi_projected']} via Open-Meteo CAMS Hourly Atmospheric Forecast",
            "data_source": "Open-Meteo CAMS 48h Model Forecast",
            "is_predicted": True,
            "location": city
        })

    return alerts
