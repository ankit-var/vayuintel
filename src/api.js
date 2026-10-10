// Central API service — all backend calls go through here
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
  health: ()                    => apiFetch('/health'),
  cities: ()                    => apiFetch('/api/cities'),
  weather: (lat, lon)           => apiFetch(`/api/weather?lat=${lat}&lon=${lon}`),
  observations: (city)          => apiFetch(`/api/observations?city=${city}`),
  alerts: (city)                => apiFetch(`/api/alerts?city=${city}`),
  forecasts: (city)             => apiFetch(`/api/forecasts?city=${city}`),
};

// city coordinate lookup (mirrors backend)
export const CITY_COORDS = {
  delhi:     { lat: 28.6139, lon: 77.2090, label: 'Delhi NCR' },
  bengaluru: { lat: 12.9716, lon: 77.5946, label: 'Bengaluru' },
  patna:     { lat: 25.5941, lon: 85.1376, label: 'Patna' },
};
