/**
 * Shared data-handling utilities for Vayu Intel.
 *
 * All AQI boundary values and category names follow the
 * Indian CPCB National AQI (2014) specification.
 *
 * IMPORTANT: These helpers must never fabricate, estimate,
 * or fall back to synthetic values. If data is missing,
 * the return value must indicate "unavailable".
 */

// ── CPCB AQI categories (matches backend aqi_calculator.py) ──────────────

export const AQI_CATEGORIES = [
  { min: 0,   max: 50,  label: 'Good',          color: '#22c55e', severity: 'info'     },
  { min: 51,  max: 100, label: 'Satisfactory',   color: '#84cc16', severity: 'info'     },
  { min: 101, max: 200, label: 'Moderate',        color: '#eab308', severity: 'warning'  },
  { min: 201, max: 300, label: 'Poor',            color: '#f97316', severity: 'critical' },
  { min: 301, max: 400, label: 'Very Poor',       color: '#ef4444', severity: 'critical' },
  { min: 401, max: 500, label: 'Severe',          color: '#7f1d1d', severity: 'critical' },
];

/**
 * Returns the CPCB AQI category for a numeric AQI value.
 * Returns an "Unavailable" sentinel if aqi is null/undefined/NaN.
 */
export function getAqiCategory(aqi) {
  if (aqi == null || Number.isNaN(Number(aqi))) {
    return { label: 'Unavailable', color: '#94a3b8', severity: 'info' };
  }
  const n = Number(aqi);
  if (n < 0 || !Number.isFinite(n)) {
    return { label: 'Unavailable', color: '#94a3b8', severity: 'info' };
  }
  if (n <= 50) return AQI_CATEGORIES[0];
  if (n <= 100) return AQI_CATEGORIES[1];
  if (n <= 200) return AQI_CATEGORIES[2];
  if (n <= 300) return AQI_CATEGORIES[3];
  if (n <= 400) return AQI_CATEGORIES[4];
  return AQI_CATEGORIES[5];
}

/**
 * CPCB NAAQS safe thresholds for pollutants (24-hour average, µg/m³ unless noted).
 */
export const POLLUTANT_THRESHOLDS = {
  pm25: { safe: 60,  unit: 'µg/m³', label: 'PM₂.₅' },
  pm10: { safe: 100, unit: 'µg/m³', label: 'PM₁₀'  },
  no2:  { safe: 80,  unit: 'µg/m³', label: 'NO₂'   },
  so2:  { safe: 80,  unit: 'µg/m³', label: 'SO₂'   },
  co:   { safe: 2.0, unit: 'mg/m³', label: 'CO'    },
  o3:   { safe: 100, unit: 'µg/m³', label: 'O₃'    },
};

/**
 * Safely formats a numeric value with its unit.
 * Returns '—' for null/undefined/NaN.
 */
export function formatValue(val, unit, decimals = 1) {
  if (val == null || Number.isNaN(Number(val))) return '—';
  return `${Number(val).toFixed(decimals)} ${unit || ''}`.trim();
}

/**
 * Format a timestamp in IST for display. Returns '—' if invalid/missing.
 */
export function formatTimeIST(ts) {
  if (!ts) return '—';
  try {
    return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });
  } catch {
    return '—';
  }
}

/**
 * Determines if a reading is "stale" — older than the given threshold (default 2 hours).
 */
export function isStale(ts, maxAgeMs = 2 * 60 * 60 * 1000) {
  if (!ts) return true;
  try {
    return (Date.now() - new Date(ts).getTime()) > maxAgeMs;
  } catch {
    return true;
  }
}

/**
 * Returns a data-state label for display:
 *   'LIVE'        – valid and recent
 *   'STALE'       – valid but older than threshold
 *   'UNAVAILABLE' – missing/null/invalid
 */
export function getDataState(value, timestamp) {
  if (value == null || Number.isNaN(Number(value))) return 'UNAVAILABLE';
  if (isStale(timestamp)) return 'STALE';
  return 'LIVE';
}

/**
 * Aggregates observations by station. Returns an array of station objects.
 * Each station has: id, name, coordinates, aqi, category, timestamp, source, parameters.
 * No synthetic fallbacks are injected.
 */
export function aggregateStations(observations) {
  const stationMap = new Map();

  for (const obs of (observations || [])) {
    const rawLat = obs.coordinates?.latitude;
    const rawLon = obs.coordinates?.longitude;
    if (rawLat == null || rawLon == null) continue;

    const lat = Number(rawLat);
    const lon = Number(rawLon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    if (lat === 0 && lon === 0) continue; // Null Island invalid coordinates
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) continue;

    const id = obs.station_id || `${lat}-${lon}`;
    if (!stationMap.has(id)) {
      stationMap.set(id, {
        id,
        name: obs.location_name || 'Monitoring Station',
        coordinates: [lat, lon],
        lat,
        lon,
        aqi: obs.aqi ?? null,
        category: obs.category ?? null,
        timestamp: obs.timestamp,
        source: obs.source,
        parameters: {},
      });
    }
    const st = stationMap.get(id);
    if (obs.parameter && obs.value != null) {
      st.parameters[obs.parameter] = { value: obs.value, unit: obs.unit };
    }
    // Update AQI only with real (non-null) values
    if (obs.aqi != null) st.aqi = obs.aqi;
    if (obs.category != null && obs.category !== 'Unavailable') st.category = obs.category;
    // Keep latest timestamp
    if (obs.timestamp && (!st.timestamp || new Date(obs.timestamp) > new Date(st.timestamp))) {
      st.timestamp = obs.timestamp;
    }
  }

  return Array.from(stationMap.values());
}

/**
 * Compute city-wide averages from observations for each pollutant.
 * Returns { pm25: avg|null, pm10: avg|null, ... }
 */
export function computeCityAverages(observations) {
  const sums = {};
  const counts = {};

  for (const obs of (observations || [])) {
    const p = obs.parameter;
    const v = obs.value;
    if (p && v != null && !Number.isNaN(Number(v))) {
      sums[p] = (sums[p] || 0) + Number(v);
      counts[p] = (counts[p] || 0) + 1;
    }
  }

  const result = {};
  for (const p of Object.keys(POLLUTANT_THRESHOLDS)) {
    result[p] = counts[p] ? Number((sums[p] / counts[p]).toFixed(2)) : null;
  }
  return result;
}

/**
 * Calculate safe-threshold multiplier for a pollutant.
 * Returns null if value is missing.
 */
export function safeMultiplier(value, parameter) {
  const thresh = POLLUTANT_THRESHOLDS[parameter];
  if (!thresh || value == null || Number.isNaN(Number(value))) return null;
  return Number((value / thresh.safe).toFixed(1));
}

/**
 * Compute overall AQI from observations (max of per-station AQIs).
 * Returns null if no stations have valid AQI.
 */
export function computeOverallAqi(observations) {
  const stations = aggregateStations(observations);
  const validAqis = stations.map(s => s.aqi).filter(a => a != null);
  if (validAqis.length === 0) return null;
  return Math.max(...validAqis);
}
