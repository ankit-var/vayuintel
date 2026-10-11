// Central API service — all backend calls go through here
const RENDER_BACKEND_URL = 'https://vayu-backend-oe9z.onrender.com';
const resolvedUrl = import.meta.env.VITE_API_URL
  || import.meta.env.VITE_API_BASE_URL
  || (import.meta.env.DEV ? 'http://localhost:8000' : RENDER_BACKEND_URL);
const BASE_URL = (resolvedUrl || RENDER_BACKEND_URL).replace(/\/+$/, '');

async function apiFetch(path, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[VayuAPI] Failed: ${path}`, err.message);
    return null; // caller handles null gracefully
  }
}

export const api = {
  health:       ()            => apiFetch('/health'),
  meta:         ()            => apiFetch('/api/meta'),
  cities:       ()            => apiFetch('/api/cities'),
  weather:      (lat, lon)    => apiFetch(`/api/weather?lat=${lat}&lon=${lon}`),
  observations: (city)        => apiFetch(`/api/observations?city=${city}`),
  alerts:       (city)        => apiFetch(`/api/alerts?city=${city}`),
  forecasts:    (city)        => apiFetch(`/api/forecasts?city=${city}`),
  intelligence: (city)        => apiFetch(`/api/intelligence?city=${city}`),
};

// City coordinate lookup — mirrors backend CITIES registry exactly.
// Data source: Open-Meteo Air Quality API (CAMS reanalysis, ~1 hour delay).
// All 21 cities receive real atmospheric model readings — not simulated data.
export const CITY_COORDS = {
  delhi:         { lat: 28.6139, lon: 77.2090, label: 'Delhi NCR',      state: 'Delhi' },
  mumbai:        { lat: 19.0760, lon: 72.8777, label: 'Mumbai',          state: 'Maharashtra' },
  bengaluru:     { lat: 12.9716, lon: 77.5946, label: 'Bengaluru',       state: 'Karnataka' },
  chennai:       { lat: 13.0827, lon: 80.2707, label: 'Chennai',         state: 'Tamil Nadu' },
  kolkata:       { lat: 22.5726, lon: 88.3639, label: 'Kolkata',         state: 'West Bengal' },
  hyderabad:     { lat: 17.3850, lon: 78.4867, label: 'Hyderabad',       state: 'Telangana' },
  pune:          { lat: 18.5204, lon: 73.8567, label: 'Pune',            state: 'Maharashtra' },
  ahmedabad:     { lat: 23.0225, lon: 72.5714, label: 'Ahmedabad',       state: 'Gujarat' },
  jaipur:        { lat: 26.9124, lon: 75.7873, label: 'Jaipur',          state: 'Rajasthan' },
  lucknow:       { lat: 26.8467, lon: 80.9462, label: 'Lucknow',         state: 'Uttar Pradesh' },
  kanpur:        { lat: 26.4499, lon: 80.3319, label: 'Kanpur',          state: 'Uttar Pradesh' },
  patna:         { lat: 25.5941, lon: 85.1376, label: 'Patna',           state: 'Bihar' },
  varanasi:      { lat: 25.3176, lon: 82.9739, label: 'Varanasi',        state: 'Uttar Pradesh' },
  gorakhpur:     { lat: 26.7606, lon: 83.3732, label: 'Gorakhpur',       state: 'Uttar Pradesh' },
  chandigarh:    { lat: 30.7333, lon: 76.7794, label: 'Chandigarh',      state: 'Chandigarh' },
  bhopal:        { lat: 23.2599, lon: 77.4126, label: 'Bhopal',          state: 'Madhya Pradesh' },
  indore:        { lat: 22.7196, lon: 75.8577, label: 'Indore',          state: 'Madhya Pradesh' },
  surat:         { lat: 21.1702, lon: 72.8311, label: 'Surat',           state: 'Gujarat' },
  nagpur:        { lat: 21.1458, lon: 79.0882, label: 'Nagpur',          state: 'Maharashtra' },
  kochi:         { lat:  9.9312, lon: 76.2673, label: 'Kochi',           state: 'Kerala' },
  visakhapatnam: { lat: 17.6868, lon: 83.2185, label: 'Visakhapatnam',   state: 'Andhra Pradesh' },
};
