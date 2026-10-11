import os
from contextlib import asynccontextmanager
from typing import List, Optional
from datetime import datetime, timedelta, timezone
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from dotenv import load_dotenv
from app.aqi_calculator import get_cpcb_aqi
from app.alerts import generate_alerts, get_cpcb_category
from app.intelligence import generate_intelligence


load_dotenv()

OPENAQ_API_URL = "https://api.openaq.org/v3"
OPENMETEO_API_URL = "https://api.open-meteo.com/v1"
OPENAQ_API_KEY = os.getenv("OPENAQ_API_KEY") # Optional


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.client = httpx.AsyncClient(timeout=10.0)
    yield
    await app.state.client.aclose()

app = FastAPI(
    title="Vayu Intel API",
    description="Backend for Air Quality Intelligence & Early Warning System",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class HealthResponse(BaseModel):
    status: str
    version: str

class City(BaseModel):
    id: str
    name: str
    lat: float
    lon: float

class Observation(BaseModel):
    parameter: str
    value: Optional[float]
    unit: str
    timestamp: str
    source: str
    station_id: str
    location_name: Optional[str] = None
    coordinates: Optional[dict] = None
    aqi: Optional[int] = None
    category: Optional[str] = None

class Station(BaseModel):
    id: str
    name: str
    lat: float
    lon: float
    city: str
    latest_observations: List[Observation]

class ForecastPrediction(BaseModel):
    timestamp: str
    horizon_hours: int
    aqi_projected: int
    confidence: str
    is_observed: bool

class ForecastResponse(BaseModel):
    location: str
    data_freshness: str
    model_information: str
    forecast_method: str
    units: str
    predictions: List[ForecastPrediction]

class Alert(BaseModel):
    id: str
    severity: str
    title: str
    description: str
    issued_at: str
    active_until: str
    evidence: str
    data_source: str
    is_predicted: bool
    location: str

class IntelligenceResponse(BaseModel):
    location: str
    timestamp: str
    measured_facts: str
    weather_context: str
    source_hypotheses: str
    data_quality: str
    sources: dict

# Endpoints
@app.get("/health", response_model=HealthResponse)
async def health_check():
    return {"status": "ok", "version": "1.0.0"}

@app.get("/api/cities", response_model=List[City])
async def get_cities():
    # Pre-defined cities for the demo
    return [
        {"id": "delhi", "name": "Delhi NCR", "lat": 28.6139, "lon": 77.2090},
        {"id": "bengaluru", "name": "Bengaluru", "lat": 12.9716, "lon": 77.5946},
        {"id": "patna", "name": "Patna", "lat": 25.5941, "lon": 85.1376}
    ]

@app.get("/api/weather")
async def get_weather(lat: float = Query(...), lon: float = Query(...)):
    try:
        response = await app.state.client.get(
            f"{OPENMETEO_API_URL}/forecast",
            params={
                "latitude": lat,
                "longitude": lon,
                "current": "temperature_2m,relative_humidity_2m,wind_speed_10m",
                "timezone": "auto"
            }
        )
        response.raise_for_status()
        data = response.json()
        current = data.get("current", {})
        
        return {
            "temperature": current.get("temperature_2m"),
            "humidity": current.get("relative_humidity_2m"),
            "wind_speed": current.get("wind_speed_10m"),
            "source": "Open-Meteo"
        }
    except Exception as e:
        # Fallback if API fails
        return {
            "temperature": None,
            "humidity": None,
            "wind_speed": None,
            "source": "Unavailable",
            "error": str(e)
        }

CITY_STATIONS = {
    "delhi": [
        {"id": "DL-AV-01", "name": "Anand Vihar, Delhi", "lat": 28.6502, "lon": 77.3027, "authority": "CPCB Ref Station"},
        {"id": "DL-JP-02", "name": "Jahangirpuri, Delhi", "lat": 28.7328, "lon": 77.1706, "authority": "DPCC CAAQMS"},
        {"id": "DL-IT-03", "name": "ITO Junction, Delhi", "lat": 28.6319, "lon": 77.2410, "authority": "DPCC CAAQMS"},
        {"id": "DL-LR-04", "name": "Lodhi Road, Delhi", "lat": 28.5883, "lon": 77.2217, "authority": "IMD SAFAR"},
        {"id": "DL-RK-05", "name": "RK Puram, Delhi", "lat": 28.5632, "lon": 77.1869, "authority": "CPCB Baseline"},
        {"id": "DL-NR-06", "name": "Narela Industrial, Delhi", "lat": 28.8228, "lon": 77.1019, "authority": "DPCC Sensor"},
        {"id": "DL-PB-07", "name": "Punjabi Bagh, Delhi", "lat": 28.6683, "lon": 77.1167, "authority": "DPCC CAAQMS"},
        {"id": "DL-SP-08", "name": "Shadipur, Delhi", "lat": 28.6514, "lon": 77.1581, "authority": "CPCB Station"},
    ],
    "bengaluru": [
        {"id": "KA-BL-01", "name": "BTM Layout, Bengaluru", "lat": 12.9166, "lon": 77.6101, "authority": "KSPCB CAAQMS"},
        {"id": "KA-SB-02", "name": "Silk Board, Bengaluru", "lat": 12.9172, "lon": 77.6228, "authority": "KSPCB Sensor"},
        {"id": "KA-PY-03", "name": "Peenya Industrial Area", "lat": 13.0285, "lon": 77.5197, "authority": "CPCB Baseline"},
        {"id": "KA-HB-04", "name": "Hebbal, Bengaluru", "lat": 13.0358, "lon": 77.5970, "authority": "KSPCB Station"},
        {"id": "KA-RS-05", "name": "City Railway Station", "lat": 12.9781, "lon": 77.5695, "authority": "CPCB Ref Station"},
    ],
    "patna": [
        {"id": "BR-SM-01", "name": "Samanpura, Patna", "lat": 25.6111, "lon": 85.0833, "authority": "BSPCB CAAQMS"},
        {"id": "BR-PL-02", "name": "Planetarium (Taramandal)", "lat": 25.6097, "lon": 85.1376, "authority": "CPCB Ref Station"},
        {"id": "BR-MD-03", "name": "Muradpur, Patna", "lat": 25.6197, "lon": 85.1610, "authority": "BSPCB Station"},
        {"id": "BR-SK-04", "name": "Shikarpur, Patna", "lat": 25.5941, "lon": 85.1852, "authority": "CPCB Baseline"},
    ]
}

@app.get("/api/meta")
async def get_meta():
    return {
        "openaq_configured": bool(OPENAQ_API_KEY),
        "primary_map_provider": "OpenStreetMap / Leaflet (Keyless)",
        "air_quality_source": "OpenAQ v3" if OPENAQ_API_KEY else "Open-Meteo Air Quality (Keyless Real-Time Telemetry)",
        "requires_key_for_map": False,
        "requires_key_for_grid": False
    }

@app.get("/api/observations", response_model=List[Observation])
async def get_observations(city: str = Query(...)):
    cities = {
        "delhi": {"lat": 28.6139, "lon": 77.2090},
        "bengaluru": {"lat": 12.9716, "lon": 77.5946},
        "patna": {"lat": 25.5941, "lon": 85.1376}
    }
    
    if city not in cities:
        raise HTTPException(status_code=404, detail="City not found")
        
    coords = cities[city]
    stations = CITY_STATIONS.get(city, [])
    observations = []

    # 1. If OpenAQ API key is configured, try OpenAQ v3
    if OPENAQ_API_KEY:
        try:
            openaq_url = "https://api.openaq.org/v3/locations"
            headers = {"X-API-Key": OPENAQ_API_KEY}
            params = {
                "coordinates": f"{coords['lat']},{coords['lon']}",
                "radius": 50000,
                "limit": 25
            }
            resp = await app.state.client.get(openaq_url, params=params, headers=headers, timeout=5.0)
            if resp.status_code == 200:
                data = resp.json()
                for loc in data.get("results", []):
                    loc_coords = loc.get("coordinates")
                    loc_id = str(loc.get("id"))
                    loc_name = loc.get("name", "OpenAQ Station")
                    # Collect sensors/latest measurements if available
                    for sensor in loc.get("sensors", []):
                        param = sensor.get("parameter", {}).get("name", "").lower().replace(".", "")
                        val = sensor.get("latest", {}).get("value")
                        if val is not None:
                            aqi_calc = get_cpcb_aqi(**{param: val}) if param in ["pm25", "pm10", "no2"] else None
                            aqi_val = aqi_calc["aqi"] if aqi_calc else int(val)
                            cat_info = get_cpcb_category(aqi_val)
                            observations.append({
                                "parameter": param,
                                "value": float(val),
                                "unit": sensor.get("parameter", {}).get("units", "µg/m³"),
                                "timestamp": sensor.get("latest", {}).get("datetime", {}).get("utc", datetime.now(timezone.utc).isoformat()),
                                "source": "OpenAQ",
                                "station_id": loc_id,
                                "location_name": loc_name,
                                "coordinates": loc_coords,
                                "aqi": aqi_val,
                                "category": cat_info["category"]
                            })
                if observations:
                    return observations
        except Exception:
            pass # Fall through to keyless Open-Meteo Air Quality

    # 2. Keyless real-time provider: Open-Meteo Air Quality API
    try:
        lats = ",".join(str(s["lat"]) for s in stations)
        lons = ",".join(str(s["lon"]) for s in stations)
        
        aq_resp = await app.state.client.get(
            "https://air-quality-api.open-meteo.com/v1/air-quality",
            params={
                "latitude": lats,
                "longitude": lons,
                "current": "pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone",
                "timezone": "auto"
            },
            timeout=8.0
        )
        aq_resp.raise_for_status()
        aq_data = aq_resp.json()
        
        # Open-Meteo returns a list if multiple locations requested, or a dict if single
        if isinstance(aq_data, dict):
            aq_data = [aq_data]
            
        for idx, station in enumerate(stations):
            result = aq_data[idx] if idx < len(aq_data) else aq_data[0]
            current = result.get("current", {})
            iso_time = current.get("time")
            if iso_time and not iso_time.endswith("Z"):
                iso_time = f"{iso_time}Z"
            else:
                iso_time = datetime.now(timezone.utc).isoformat()
                
            pm25 = current.get("pm2_5")
            pm10 = current.get("pm10")
            no2 = current.get("nitrogen_dioxide")
            so2 = current.get("sulphur_dioxide")
            co = current.get("carbon_monoxide")
            o3 = current.get("ozone")
            
            cpcb_res = get_cpcb_aqi(pm25=pm25, pm10=pm10, no2=no2)
            station_aqi = cpcb_res["aqi"] if cpcb_res else (int(pm25) if pm25 else 120)
            cat_info = get_cpcb_category(station_aqi)
            
            station_coords = {"latitude": station["lat"], "longitude": station["lon"]}
            
            # Add parameters for this station
            param_map = [
                ("pm25", pm25, "µg/m³"),
                ("pm10", pm10, "µg/m³"),
                ("no2", no2, "µg/m³"),
                ("so2", so2, "µg/m³"),
                ("co", round(co / 1000.0, 2) if co is not None else None, "mg/m³"),
                ("o3", o3, "µg/m³")
            ]
            
            for p_name, p_val, p_unit in param_map:
                if p_val is not None:
                    observations.append({
                        "parameter": p_name,
                        "value": float(p_val),
                        "unit": p_unit,
                        "timestamp": iso_time,
                        "source": "Open-Meteo Air Quality",
                        "station_id": station["id"],
                        "location_name": station["name"],
                        "coordinates": station_coords,
                        "aqi": station_aqi,
                        "category": cat_info["category"]
                    })
                    
        return observations
    except Exception as e:
        print(f"Error fetching air quality data: {e}")
        return []

@app.get("/api/alerts", response_model=List[Alert])
async def get_alerts(city: str = Query(...)):
    try:
        forecast_resp = await get_forecasts(city)
        preds = forecast_resp["predictions"]
        current_pred = next((p for p in preds if p["is_observed"]), None)
        
        current_aqi_data = None
        if current_pred:
            prominent = "Unknown"
            if "Prominent Pollutant: " in forecast_resp["model_information"]:
                prominent = forecast_resp["model_information"].split("Prominent Pollutant: ")[-1]
            current_aqi_data = {"aqi": current_pred["aqi_projected"], "prominent_pollutant": prominent}
            
        return generate_alerts(city, current_aqi_data, preds)
    except Exception as e:
        return []

@app.get("/api/intelligence", response_model=IntelligenceResponse)
async def get_intelligence(city: str = Query(...)):
    try:
        cities = {
            "delhi": {"lat": 28.6139, "lon": 77.2090},
            "bengaluru": {"lat": 12.9716, "lon": 77.5946},
            "patna": {"lat": 25.5941, "lon": 85.1376}
        }
        coords = cities.get(city)
        if not coords:
            raise HTTPException(status_code=404, detail="City not found")
            
        observations = await get_observations(city)
        weather = await get_weather(coords["lat"], coords["lon"])
        
        forecast_resp = await get_forecasts(city)
        preds = forecast_resp["predictions"]
        current_pred = next((p for p in preds if p["is_observed"]), None)
        
        current_aqi_data = None
        if current_pred:
            prominent = "Unknown"
            if "Prominent Pollutant: " in forecast_resp["model_information"]:
                prominent = forecast_resp["model_information"].split("Prominent Pollutant: ")[-1]
            current_aqi_data = {"aqi": current_pred["aqi_projected"], "prominent_pollutant": prominent}
            
        return generate_intelligence(city, observations, weather, current_aqi_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/forecasts", response_model=ForecastResponse)
async def get_forecasts(city: str = Query(...)):
    # 1. Fetch latest real-time observations to form the baseline
    observations = await get_observations(city)
    
    # 2. Extract PM2.5, PM10, NO2 for CPCB AQI calculation
    param_values = {"pm25": [], "pm10": [], "no2": []}
    for obs in observations:
        param = obs.get("parameter")
        val = obs.get("value")
        if param in param_values and val is not None:
            param_values[param].append(val)
            
    # Calculate city-wide average for each pollutant
    avg_pm25 = sum(param_values["pm25"])/len(param_values["pm25"]) if param_values["pm25"] else None
    avg_pm10 = sum(param_values["pm10"])/len(param_values["pm10"]) if param_values["pm10"] else None
    avg_no2 = sum(param_values["no2"])/len(param_values["no2"]) if param_values["no2"] else None
    
    aqi_result = get_cpcb_aqi(pm25=avg_pm25, pm10=avg_pm10, no2=avg_no2)
    
    # Fallback to an average value if OpenAQ returns no valid data right now
    current_aqi = aqi_result["aqi"] if aqi_result else 150
    prominent = aqi_result["prominent_pollutant"] if aqi_result else "Unknown"
    
    now = datetime.now(timezone.utc).replace(minute=0, second=0, microsecond=0)
    
    predictions = []
    # Observed value (Horizon 0)
    predictions.append({
        "timestamp": now.isoformat().replace("+00:00", "Z"),
        "horizon_hours": 0,
        "aqi_projected": current_aqi,
        "confidence": "High",
        "is_observed": True
    })
    
    # 48-hour Persistence Baseline
    for h in range(1, 49):
        future_time = now + timedelta(hours=h)
        confidence = "High" if h <= 12 else "Medium" if h <= 24 else "Low"
        predictions.append({
            "timestamp": future_time.isoformat().replace("+00:00", "Z"),
            "horizon_hours": h,
            "aqi_projected": current_aqi,
            "confidence": confidence,
            "is_observed": False
        })
        
    return {
        "location": city,
        "data_freshness": now.isoformat().replace("+00:00", "Z"),
        "model_information": f"Persistence Baseline (Insufficient historical data for ML). Prominent Pollutant: {prominent}",
        "forecast_method": "Indian CPCB AQI Methodology",
        "units": "AQI",
        "predictions": predictions
    }
