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
OPENAQ_API_KEY = os.getenv("OPENAQ_API_KEY")  # Optional — keyless CAMS model fallback used if absent


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.client = httpx.AsyncClient(timeout=10.0)
    yield
    await app.state.client.aclose()

app = FastAPI(
    title="Vayu Intel API",
    description="Backend for Air Quality Intelligence & Early Warning System",
    version="1.2.0",
    lifespan=lifespan
)

# CORS — configurable via env; defaults to allow all origins
cors_origins_env = os.getenv("CORS_ORIGINS", "")
allowed_origins = [o.strip() for o in cors_origins_env.split(",") if o.strip()] if cors_origins_env else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Helpers ──────────────────────────────────────────────────────────────────

def parse_open_meteo_timestamp(iso_str: Optional[str], utc_offset_seconds: int = 19800) -> str:
    """
    Parses Open-Meteo local ISO string (e.g. '2026-10-11T21:30') with its exact UTC offset
    and returns a clean, unambiguous UTC ISO timestamp string (e.g. '2026-10-11T16:00:00Z').
    Does NOT naively append 'Z' to local times.
    """
    if not iso_str:
        return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    if iso_str.endswith("Z"):
        return iso_str

    try:
        tz = timezone(timedelta(seconds=utc_offset_seconds))
        dt_local = datetime.fromisoformat(iso_str).replace(tzinfo=tz)
        dt_utc = dt_local.astimezone(timezone.utc)
        return dt_utc.isoformat().replace("+00:00", "Z")
    except Exception:
        return iso_str

# ── Pydantic models ──────────────────────────────────────────────────────────

class HealthResponse(BaseModel):
    status: str
    version: str

class City(BaseModel):
    id: str
    name: str
    lat: float
    lon: float
    state: Optional[str] = None

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

# ── City & station registry ──────────────────────────────────────────────────

CITIES = {
    "delhi":         {"name": "Delhi NCR",      "lat": 28.6139, "lon": 77.2090, "state": "Delhi"},
    "mumbai":        {"name": "Mumbai",          "lat": 19.0760, "lon": 72.8777, "state": "Maharashtra"},
    "bengaluru":     {"name": "Bengaluru",       "lat": 12.9716, "lon": 77.5946, "state": "Karnataka"},
    "chennai":       {"name": "Chennai",         "lat": 13.0827, "lon": 80.2707, "state": "Tamil Nadu"},
    "kolkata":       {"name": "Kolkata",         "lat": 22.5726, "lon": 88.3639, "state": "West Bengal"},
    "hyderabad":     {"name": "Hyderabad",       "lat": 17.3850, "lon": 78.4867, "state": "Telangana"},
    "pune":          {"name": "Pune",            "lat": 18.5204, "lon": 73.8567, "state": "Maharashtra"},
    "ahmedabad":     {"name": "Ahmedabad",       "lat": 23.0225, "lon": 72.5714, "state": "Gujarat"},
    "jaipur":        {"name": "Jaipur",          "lat": 26.9124, "lon": 75.7873, "state": "Rajasthan"},
    "lucknow":       {"name": "Lucknow",         "lat": 26.8467, "lon": 80.9462, "state": "Uttar Pradesh"},
    "kanpur":        {"name": "Kanpur",          "lat": 26.4499, "lon": 80.3319, "state": "Uttar Pradesh"},
    "patna":         {"name": "Patna",           "lat": 25.5941, "lon": 85.1376, "state": "Bihar"},
    "varanasi":      {"name": "Varanasi",        "lat": 25.3176, "lon": 82.9739, "state": "Uttar Pradesh"},
    "gorakhpur":     {"name": "Gorakhpur",       "lat": 26.7606, "lon": 83.3732, "state": "Uttar Pradesh"},
    "chandigarh":    {"name": "Chandigarh",      "lat": 30.7333, "lon": 76.7794, "state": "Chandigarh"},
    "bhopal":        {"name": "Bhopal",          "lat": 23.2599, "lon": 77.4126, "state": "Madhya Pradesh"},
    "indore":        {"name": "Indore",          "lat": 22.7196, "lon": 75.8577, "state": "Madhya Pradesh"},
    "surat":         {"name": "Surat",           "lat": 21.1702, "lon": 72.8311, "state": "Gujarat"},
    "nagpur":        {"name": "Nagpur",          "lat": 21.1458, "lon": 79.0882, "state": "Maharashtra"},
    "kochi":         {"name": "Kochi",           "lat": 9.9312,  "lon": 76.2673, "state": "Kerala"},
    "visakhapatnam": {"name": "Visakhapatnam",   "lat": 17.6868, "lon": 83.2185, "state": "Andhra Pradesh"},
}

# Geographic reference monitoring locations per city
# Station names reflect official CAAQMS monitoring landmarks within the city.
# Telemetry values reflect Open-Meteo / CAMS atmospheric model grid estimates (~40km cell resolution).
CITY_STATIONS = {
    "delhi": [
        {"id": "DL-AV-01", "name": "Anand Vihar (Grid Ref)",      "lat": 28.6502, "lon": 77.3027, "authority": "East Delhi CAMS Cell"},
        {"id": "DL-JP-02", "name": "Jahangirpuri (Grid Ref)",     "lat": 28.7328, "lon": 77.1706, "authority": "North Delhi CAMS Cell"},
        {"id": "DL-IT-03", "name": "ITO Junction (Grid Ref)",     "lat": 28.6319, "lon": 77.2410, "authority": "Central Delhi CAMS Cell"},
        {"id": "DL-LR-04", "name": "Lodhi Road (Grid Ref)",       "lat": 28.5883, "lon": 77.2217, "authority": "South Delhi CAMS Cell"},
        {"id": "DL-RK-05", "name": "RK Puram (Grid Ref)",         "lat": 28.5632, "lon": 77.1869, "authority": "South-West Delhi CAMS Cell"},
        {"id": "DL-NR-06", "name": "Narela Industrial (Grid Ref)","lat": 28.8228, "lon": 77.1019, "authority": "North-West Delhi CAMS Cell"},
        {"id": "DL-PB-07", "name": "Punjabi Bagh (Grid Ref)",     "lat": 28.6683, "lon": 77.1167, "authority": "West Delhi CAMS Cell"},
        {"id": "DL-SP-08", "name": "Shadipur (Grid Ref)",         "lat": 28.6514, "lon": 77.1581, "authority": "West-Central CAMS Cell"},
    ],
    "mumbai": [
        {"id": "MH-CL-01", "name": "Colaba (Grid Ref)",           "lat": 18.9067, "lon": 72.8147, "authority": "South Mumbai CAMS Cell"},
        {"id": "MH-BK-02", "name": "Bandra Kurla (Grid Ref)",     "lat": 19.0596, "lon": 72.8656, "authority": "Central Mumbai CAMS Cell"},
        {"id": "MH-CH-03", "name": "Chembur (Grid Ref)",          "lat": 19.0522, "lon": 72.9005, "authority": "East Mumbai CAMS Cell"},
        {"id": "MH-MZ-04", "name": "Mazgaon (Grid Ref)",          "lat": 18.9658, "lon": 72.8394, "authority": "Harbour CAMS Cell"},
        {"id": "MH-BW-05", "name": "Borivali East (Grid Ref)",    "lat": 19.2307, "lon": 72.8567, "authority": "North Mumbai CAMS Cell"},
    ],
    "bengaluru": [
        {"id": "KA-BL-01", "name": "BTM Layout (Grid Ref)",       "lat": 12.9166, "lon": 77.6101, "authority": "South Bengaluru CAMS Cell"},
        {"id": "KA-SB-02", "name": "Silk Board (Grid Ref)",       "lat": 12.9172, "lon": 77.6228, "authority": "South Bengaluru CAMS Cell"},
        {"id": "KA-PY-03", "name": "Peenya (Grid Ref)",           "lat": 13.0285, "lon": 77.5197, "authority": "North-West Bengaluru CAMS Cell"},
        {"id": "KA-HB-04", "name": "Hebbal (Grid Ref)",           "lat": 13.0358, "lon": 77.5970, "authority": "North Bengaluru CAMS Cell"},
        {"id": "KA-RS-05", "name": "City Railway (Grid Ref)",     "lat": 12.9781, "lon": 77.5695, "authority": "Central Bengaluru CAMS Cell"},
    ],
    "chennai": [
        {"id": "TN-MA-01", "name": "Manali (Grid Ref)",           "lat": 13.1680, "lon": 80.2590, "authority": "North Chennai CAMS Cell"},
        {"id": "TN-MN-02", "name": "Mahabalipuram Rd (Grid Ref)", "lat": 12.9970, "lon": 80.2501, "authority": "South Chennai CAMS Cell"},
        {"id": "TN-AT-03", "name": "Alandur (Grid Ref)",          "lat": 13.0003, "lon": 80.2015, "authority": "Airport Zone CAMS Cell"},
        {"id": "TN-EK-04", "name": "Egmore (Grid Ref)",           "lat": 13.0731, "lon": 80.2609, "authority": "Central Chennai CAMS Cell"},
    ],
    "kolkata": [
        {"id": "WB-BD-01", "name": "Ballygunge (Grid Ref)",       "lat": 22.5264, "lon": 88.3673, "authority": "South Kolkata CAMS Cell"},
        {"id": "WB-DB-02", "name": "Dhapa (Grid Ref)",            "lat": 22.5548, "lon": 88.4155, "authority": "East Kolkata CAMS Cell"},
        {"id": "WB-RB-03", "name": "Rabindra Bharati (Grid Ref)", "lat": 22.5880, "lon": 88.3652, "authority": "North Kolkata CAMS Cell"},
        {"id": "WB-FC-04", "name": "Fort William (Grid Ref)",     "lat": 22.5591, "lon": 88.3432, "authority": "Central Kolkata CAMS Cell"},
    ],
    "hyderabad": [
        {"id": "TS-HB-01", "name": "Zoo Park (Grid Ref)",         "lat": 17.3604, "lon": 78.4739, "authority": "South Hyderabad CAMS Cell"},
        {"id": "TS-BO-02", "name": "Bollaram (Grid Ref)",         "lat": 17.4839, "lon": 78.3743, "authority": "North Hyderabad CAMS Cell"},
        {"id": "TS-PM-03", "name": "Patancheruvu (Grid Ref)",     "lat": 17.5394, "lon": 78.2620, "authority": "Industrial Zone CAMS Cell"},
        {"id": "TS-SE-04", "name": "Sanathnagar (Grid Ref)",      "lat": 17.4484, "lon": 78.4317, "authority": "Central Hyderabad CAMS Cell"},
    ],
    "pune": [
        {"id": "MH-KT-01", "name": "Katraj (Grid Ref)",            "lat": 18.4529, "lon": 73.8611, "authority": "South Pune CAMS Cell"},
        {"id": "MH-SN-02", "name": "Shivajinagar (Grid Ref)",      "lat": 18.5308, "lon": 73.8474, "authority": "Central Pune CAMS Cell"},
        {"id": "MH-PC-03", "name": "Pimpri (Grid Ref)",            "lat": 18.6297, "lon": 73.8014, "authority": "PCMC Zone CAMS Cell"},
        {"id": "MH-HD-04", "name": "Hadapsar (Grid Ref)",          "lat": 18.5018, "lon": 73.9261, "authority": "East Pune CAMS Cell"},
    ],
    "ahmedabad": [
        {"id": "GJ-RT-01", "name": "GIDC Naroda (Grid Ref)",      "lat": 23.0736, "lon": 72.6619, "authority": "East Ahmedabad CAMS Cell"},
        {"id": "GJ-ME-02", "name": "Maninagar (Grid Ref)",        "lat": 22.9929, "lon": 72.6073, "authority": "South Ahmedabad CAMS Cell"},
        {"id": "GJ-VS-03", "name": "Vasna (Grid Ref)",            "lat": 23.0052, "lon": 72.5529, "authority": "West Ahmedabad CAMS Cell"},
        {"id": "GJ-CT-04", "name": "CTM (Grid Ref)",              "lat": 23.0417, "lon": 72.6303, "authority": "Central Ahmedabad CAMS Cell"},
    ],
    "jaipur": [
        {"id": "RJ-AM-01", "name": "Adarsh Nagar (Grid Ref)",     "lat": 26.9344, "lon": 75.7813, "authority": "Central Jaipur CAMS Cell"},
        {"id": "RJ-MR-02", "name": "Mansarovar (Grid Ref)",       "lat": 26.8648, "lon": 75.7565, "authority": "South Jaipur CAMS Cell"},
        {"id": "RJ-SH-03", "name": "Shastri Nagar (Grid Ref)",    "lat": 26.9303, "lon": 75.8167, "authority": "North Jaipur CAMS Cell"},
    ],
    "lucknow": [
        {"id": "UP-LB-01", "name": "Lalbagh (Grid Ref)",          "lat": 26.8441, "lon": 80.9308, "authority": "Central Lucknow CAMS Cell"},
        {"id": "UP-TL-02", "name": "Talkatora (Grid Ref)",        "lat": 26.8686, "lon": 80.9167, "authority": "Industrial Zone CAMS Cell"},
        {"id": "UP-AM-03", "name": "Aliganj (Grid Ref)",          "lat": 26.8930, "lon": 80.9563, "authority": "North Lucknow CAMS Cell"},
    ],
    "kanpur": [
        {"id": "UP-AV-01", "name": "Armapur Estate (Grid Ref)",   "lat": 26.4770, "lon": 80.3118, "authority": "West Kanpur CAMS Cell"},
        {"id": "UP-NK-02", "name": "Nehru Nagar (Grid Ref)",      "lat": 26.4695, "lon": 80.3504, "authority": "Central Kanpur CAMS Cell"},
        {"id": "UP-RB-03", "name": "Rooma (Grid Ref)",            "lat": 26.4309, "lon": 80.4067, "authority": "East Kanpur CAMS Cell"},
    ],
    "patna": [
        {"id": "BR-SM-01", "name": "Samanpura (Grid Ref)",        "lat": 25.6111, "lon": 85.0833, "authority": "West Patna CAMS Cell"},
        {"id": "BR-PL-02", "name": "Planetarium (Grid Ref)",      "lat": 25.6097, "lon": 85.1376, "authority": "Central Patna CAMS Cell"},
        {"id": "BR-MD-03", "name": "Muradpur (Grid Ref)",         "lat": 25.6197, "lon": 85.1610, "authority": "East Patna CAMS Cell"},
        {"id": "BR-SK-04", "name": "Shikarpur (Grid Ref)",        "lat": 25.5941, "lon": 85.1852, "authority": "South Patna CAMS Cell"},
    ],
    "varanasi": [
        {"id": "UP-AR-01", "name": "Ardhali Bazar (Grid Ref)",   "lat": 25.3499, "lon": 83.0020, "authority": "North Varanasi CAMS Cell"},
        {"id": "UP-ML-02", "name": "Maldahiya (Grid Ref)",       "lat": 25.3385, "lon": 83.0018, "authority": "Central Varanasi CAMS Cell"},
        {"id": "UP-BK-03", "name": "BHU Campus (Grid Ref)",      "lat": 25.2677, "lon": 82.9913, "authority": "South Varanasi CAMS Cell"},
    ],
    "gorakhpur": [
        {"id": "UP-GK-01", "name": "Padri Bazar (Grid Ref)",     "lat": 26.7720, "lon": 83.3894, "authority": "North Gorakhpur CAMS Cell"},
        {"id": "UP-GK-02", "name": "Ramgarh Tal (Grid Ref)",     "lat": 26.7385, "lon": 83.3680, "authority": "South Gorakhpur CAMS Cell"},
    ],
    "chandigarh": [
        {"id": "CH-SC-01", "name": "Sector 22 (Grid Ref)",       "lat": 30.7290, "lon": 76.7738, "authority": "Central Chandigarh CAMS Cell"},
        {"id": "CH-IN-02", "name": "Sector 25 (Grid Ref)",       "lat": 30.7271, "lon": 76.7931, "authority": "West Chandigarh CAMS Cell"},
        {"id": "CH-IE-03", "name": "Industrial Area (Grid Ref)", "lat": 30.7034, "lon": 76.8203, "authority": "South Chandigarh CAMS Cell"},
    ],
    "bhopal": [
        {"id": "MP-TS-01", "name": "T.T. Nagar (Grid Ref)",      "lat": 23.2389, "lon": 77.4013, "authority": "Central Bhopal CAMS Cell"},
        {"id": "MP-HA-02", "name": "Hoshangabad Rd (Grid Ref)",  "lat": 23.1983, "lon": 77.4365, "authority": "South Bhopal CAMS Cell"},
        {"id": "MP-GB-03", "name": "Govindpura (Grid Ref)",      "lat": 23.2827, "lon": 77.4639, "authority": "Industrial Zone CAMS Cell"},
    ],
    "indore": [
        {"id": "MP-GN-01", "name": "Gandhinagar (Grid Ref)",     "lat": 22.7263, "lon": 75.8608, "authority": "Airport Zone CAMS Cell"},
        {"id": "MP-SC-02", "name": "Sanwer Road (Grid Ref)",     "lat": 22.7596, "lon": 75.8266, "authority": "Industrial Zone CAMS Cell"},
        {"id": "MP-PM-03", "name": "Palasia (Grid Ref)",         "lat": 22.7173, "lon": 75.8833, "authority": "East Indore CAMS Cell"},
    ],
    "surat": [
        {"id": "GJ-AK-01", "name": "Athwa Lines (Grid Ref)",     "lat": 21.1875, "lon": 72.8251, "authority": "South Surat CAMS Cell"},
        {"id": "GJ-LA-02", "name": "Lal Darwaja (Grid Ref)",     "lat": 21.1961, "lon": 72.8311, "authority": "Central Surat CAMS Cell"},
        {"id": "GJ-KT-03", "name": "Katargam (Grid Ref)",         "lat": 21.2211, "lon": 72.8419, "authority": "North Surat CAMS Cell"},
    ],
    "nagpur": [
        {"id": "MH-CB-01", "name": "Civil Lines (Grid Ref)",     "lat": 21.1525, "lon": 79.0831, "authority": "Central Nagpur CAMS Cell"},
        {"id": "MH-HB-02", "name": "Hingna (Grid Ref)",          "lat": 21.1218, "lon": 78.9568, "authority": "Industrial Zone CAMS Cell"},
        {"id": "MH-KM-03", "name": "Kamptee Road (Grid Ref)",    "lat": 21.1699, "lon": 79.1316, "authority": "North Nagpur CAMS Cell"},
    ],
    "kochi": [
        {"id": "KL-ER-01", "name": "Ernakulam (Grid Ref)",        "lat": 9.9817,  "lon": 76.2994, "authority": "Central Kochi CAMS Cell"},
        {"id": "KL-ED-02", "name": "Edappally (Grid Ref)",        "lat": 10.0269, "lon": 76.3076, "authority": "North Kochi CAMS Cell"},
        {"id": "KL-KT-03", "name": "Kalamassery (Grid Ref)",      "lat": 10.0539, "lon": 76.3123, "authority": "Industrial Zone CAMS Cell"},
    ],
    "visakhapatnam": [
        {"id": "AP-GR-01", "name": "Gajuwaka (Grid Ref)",         "lat": 17.6815, "lon": 83.2124, "authority": "Industrial Zone CAMS Cell"},
        {"id": "AP-TO-02", "name": "Town Kotha Road (Grid Ref)",  "lat": 17.7126, "lon": 83.2973, "authority": "Port Zone CAMS Cell"},
        {"id": "AP-MW-03", "name": "MVP Colony (Grid Ref)",       "lat": 17.7228, "lon": 83.3319, "authority": "Coastal Residential CAMS Cell"},
    ],
}

# ── Endpoints ──────────────────────────────────────────────────────────────

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return {"status": "ok", "version": "1.2.0"}

@app.get("/api/cities", response_model=List[City])
async def get_cities():
    return [
        {"id": cid, "name": info["name"], "lat": info["lat"], "lon": info["lon"], "state": info.get("state")}
        for cid, info in CITIES.items()
    ]

@app.get("/api/meta")
async def get_meta():
    return {
        "openaq_configured": bool(OPENAQ_API_KEY),
        "primary_map_provider": "OpenStreetMap / Leaflet (Keyless)",
        "air_quality_source": "OpenAQ v3 (Authenticated Ground CAAQMS)" if OPENAQ_API_KEY else "Open-Meteo / Copernicus Atmosphere Monitoring Service (CAMS)",
        "data_nature": "Atmospheric model estimates (~40 km grid resolution). Values represent regional numerical model assimilations, not physical ground-level CAAQMS hardware sensors.",
        "spatial_resolution": "~40 km × 40 km (0.4° atmospheric grid cell)",
        "averaging_method": "Instantaneous 1-hour model estimates using CPCB piecewise linear formula. Not official 24-hour statutory regulatory index.",
        "forecast_engine": "Open-Meteo CAMS 48-Hour Numerical Atmospheric Model",
        "requires_key_for_map": False,
        "requires_key_for_aq": not bool(OPENAQ_API_KEY),
        "cities_supported": len(CITIES),
    }

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
        utc_offset = data.get("utc_offset_seconds", 19800)
        raw_time = current.get("time")
        parsed_time = parse_open_meteo_timestamp(raw_time, utc_offset)
        return {
            "temperature": current.get("temperature_2m"),
            "humidity": current.get("relative_humidity_2m"),
            "wind_speed": current.get("wind_speed_10m"),
            "timestamp": parsed_time,
            "source": "Open-Meteo Numerical Weather Model",
            "data_nature": "model_estimate"
        }
    except Exception as e:
        return {
            "temperature": None,
            "humidity": None,
            "wind_speed": None,
            "timestamp": None,
            "source": "Unavailable",
            "data_nature": "unavailable",
            "error": str(e)
        }

@app.get("/api/observations", response_model=List[Observation])
async def get_observations(city: str = Query(...)):
    city = city.lower().strip()
    if city not in CITIES:
        raise HTTPException(status_code=404, detail=f"City '{city}' not supported. Valid cities: {', '.join(CITIES.keys())}")

    coords = CITIES[city]
    stations = CITY_STATIONS.get(city, [])

    if not stations:
        return []

    observations = []

    # 1. Try OpenAQ v3 if API key is present
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
                    loc_name = loc.get("name", "OpenAQ Ground Station")
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
                                "timestamp": sensor.get("latest", {}).get("datetime", {}).get("utc", datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")),
                                "source": "OpenAQ Ground Monitor (Physical Station)",
                                "station_id": loc_id,
                                "location_name": loc_name,
                                "coordinates": loc_coords,
                                "aqi": aqi_val,
                                "category": cat_info["category"]
                            })
                if observations:
                    return observations
        except Exception as e:
            print(f"[observations] OpenAQ failed or key invalid, falling back to Open-Meteo: {e}")

    # 2. Keyless provider: Open-Meteo Air Quality (CAMS reanalysis grid)
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
            timeout=10.0
        )
        aq_resp.raise_for_status()
        aq_data = aq_resp.json()

        # Open-Meteo returns a list for multiple coordinates, or a dict for single
        if isinstance(aq_data, dict):
            aq_data = [aq_data]

        for idx, station in enumerate(stations):
            result = aq_data[idx] if idx < len(aq_data) else aq_data[0]
            utc_offset = result.get("utc_offset_seconds", 19800)
            current = result.get("current", {})
            raw_time = current.get("time")
            iso_time = parse_open_meteo_timestamp(raw_time, utc_offset)

            pm25 = current.get("pm2_5")
            pm10 = current.get("pm10")
            no2  = current.get("nitrogen_dioxide")
            so2  = current.get("sulphur_dioxide")
            co   = current.get("carbon_monoxide")
            o3   = current.get("ozone")

            cpcb_res = get_cpcb_aqi(pm25=pm25, pm10=pm10, no2=no2)
            station_aqi = cpcb_res["aqi"] if cpcb_res else (int(pm25) if pm25 else None)
            cat_info = get_cpcb_category(station_aqi) if station_aqi else {"category": "Unknown"}

            station_coords = {"latitude": station["lat"], "longitude": station["lon"]}

            param_map = [
                ("pm25", pm25,   "µg/m³"),
                ("pm10", pm10,   "µg/m³"),
                ("no2",  no2,    "µg/m³"),
                ("so2",  so2,    "µg/m³"),
                ("co",   round(co / 1000.0, 3) if co is not None else None, "mg/m³"),
                ("o3",   o3,     "µg/m³"),
            ]

            for p_name, p_val, p_unit in param_map:
                if p_val is not None:
                    observations.append({
                        "parameter": p_name,
                        "value": float(p_val),
                        "unit": p_unit,
                        "timestamp": iso_time,
                        "source": "Open-Meteo / CAMS Model (~40km grid estimate)",
                        "station_id": station["id"],
                        "location_name": station["name"],
                        "coordinates": station_coords,
                        "aqi": station_aqi,
                        "category": cat_info["category"]
                    })

        return observations
    except Exception as e:
        print(f"[observations] Error fetching air quality data for {city}: {e}")
        # Clean empty list returned; never fabricate fake fallback numbers
        return []

@app.get("/api/alerts", response_model=List[Alert])
async def get_alerts(city: str = Query(...)):
    city = city.lower().strip()
    if city not in CITIES:
        raise HTTPException(status_code=404, detail=f"City '{city}' not supported.")
    try:
        forecast_resp = await get_forecasts(city)
        preds = forecast_resp.get("predictions", [])
        current_pred = next((p for p in preds if p["is_observed"]), None)

        current_aqi_data = None
        if current_pred and current_pred["aqi_projected"] > 0:
            prominent = "Unknown"
            if "Dominant Pollutant: " in forecast_resp["model_information"]:
                prominent = forecast_resp["model_information"].split("Dominant Pollutant: ")[-1]
            current_aqi_data = {"aqi": current_pred["aqi_projected"], "prominent_pollutant": prominent}

        return generate_alerts(city, current_aqi_data, preds)
    except Exception as e:
        print(f"[alerts] Error generating alerts for {city}: {e}")
        return []

@app.get("/api/intelligence", response_model=IntelligenceResponse)
async def get_intelligence(city: str = Query(...)):
    city = city.lower().strip()
    if city not in CITIES:
        raise HTTPException(status_code=404, detail=f"City '{city}' not supported.")
    try:
        coords = CITIES[city]
        observations = await get_observations(city)
        weather = await get_weather(coords["lat"], coords["lon"])

        forecast_resp = await get_forecasts(city)
        preds = forecast_resp.get("predictions", [])
        current_pred = next((p for p in preds if p["is_observed"]), None)

        current_aqi_data = None
        if current_pred and current_pred["aqi_projected"] > 0:
            prominent = "Unknown"
            if "Dominant Pollutant: " in forecast_resp["model_information"]:
                prominent = forecast_resp["model_information"].split("Dominant Pollutant: ")[-1]
            current_aqi_data = {"aqi": current_pred["aqi_projected"], "prominent_pollutant": prominent}

        return generate_intelligence(city, observations, weather, current_aqi_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/forecasts", response_model=ForecastResponse)
async def get_forecasts(city: str = Query(...)):
    city = city.lower().strip()
    if city not in CITIES:
        raise HTTPException(status_code=404, detail=f"City '{city}' not supported.")

    coords = CITIES[city]

    # Query Open-Meteo's actual hourly air-quality forecast for the next 48 hours
    try:
        resp = await app.state.client.get(
            "https://air-quality-api.open-meteo.com/v1/air-quality",
            params={
                "latitude": coords["lat"],
                "longitude": coords["lon"],
                "hourly": "pm10,pm2_5,nitrogen_dioxide",
                "forecast_days": 3,
                "timezone": "auto"
            },
            timeout=10.0
        )
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        print(f"[forecasts] Upstream fetch error for {city}: {e}")
        return {
            "location": city,
            "data_freshness": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "model_information": f"Unavailable: Upstream Open-Meteo forecast service failed ({str(e)})",
            "forecast_method": "Unavailable",
            "units": "AQI (CPCB Formula)",
            "predictions": []
        }

    utc_offset = data.get("utc_offset_seconds", 19800)
    tz = timezone(timedelta(seconds=utc_offset))
    hourly = data.get("hourly", {})
    times = hourly.get("time", [])
    pm25s = hourly.get("pm2_5", [])
    pm10s = hourly.get("pm10", [])
    no2s  = hourly.get("nitrogen_dioxide", [])

    if not times:
        return {
            "location": city,
            "data_freshness": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "model_information": "Unavailable: No hourly timesteps returned by Open-Meteo CAMS model",
            "forecast_method": "Unavailable",
            "units": "AQI (CPCB Formula)",
            "predictions": []
        }

    now_utc = datetime.now(timezone.utc)
    # Identify the closest timestep at or immediately before now_utc to serve as observed baseline
    current_idx = 0
    for i, t in enumerate(times):
        dt_utc = datetime.fromisoformat(t).replace(tzinfo=tz).astimezone(timezone.utc)
        if dt_utc <= now_utc:
            current_idx = i

    predictions = []
    prominent_counter = {}

    for h in range(0, 49):
        idx = current_idx + h
        if idx >= len(times):
            break

        dt_utc = datetime.fromisoformat(times[idx]).replace(tzinfo=tz).astimezone(timezone.utc)
        pm25 = pm25s[idx] if idx < len(pm25s) else None
        pm10 = pm10s[idx] if idx < len(pm10s) else None
        no2  = no2s[idx]  if idx < len(no2s)  else None

        cpcb_res = get_cpcb_aqi(pm25=pm25, pm10=pm10, no2=no2)
        if cpcb_res:
            aqi_val = cpcb_res["aqi"]
            p_pollutant = cpcb_res["prominent_pollutant"]
            prominent_counter[p_pollutant] = prominent_counter.get(p_pollutant, 0) + 1
        elif pm25 is not None:
            aqi_val = int(pm25)
        else:
            aqi_val = 0

        is_obs = (h == 0)
        confidence = "High" if h <= 12 else "Medium" if h <= 24 else "Low"

        predictions.append({
            "timestamp": dt_utc.isoformat().replace("+00:00", "Z"),
            "horizon_hours": h,
            "aqi_projected": aqi_val,
            "confidence": confidence,
            "is_observed": is_obs
        })

    most_prominent = max(prominent_counter, key=prominent_counter.get) if prominent_counter else "PM2.5"
    freshness_str = predictions[0]["timestamp"] if predictions else now_utc.isoformat().replace("+00:00", "Z")

    return {
        "location": city,
        "data_freshness": freshness_str,
        "model_information": f"Open-Meteo CAMS 48-Hour Model Forecast (~40km grid). Dominant Pollutant: {most_prominent}",
        "forecast_method": "CPCB Indian National AQI formula applied to hourly CAMS atmospheric predictions (Instantaneous 1-hour estimates)",
        "units": "AQI (CPCB Formula)",
        "predictions": predictions
    }
