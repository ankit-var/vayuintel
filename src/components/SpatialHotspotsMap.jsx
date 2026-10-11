import { useEffect, useRef, useState, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { useVayu } from '../context/VayuContext';
import { CITY_COORDS } from '../api';

// ── Layer definitions ──────────────────────────────────────────────────────
const LAYERS = {
  AQI:   { label: 'AQI',   field: 'aqi',   unit: '',        decimals: 0 },
  PM25:  { label: 'PM2.5', field: 'pm25',  unit: ' µg/m³',  decimals: 1 },
  Wind:  { label: 'Wind',  field: null,     unit: '',        decimals: 0 }, // from weather context
};

// ── AQI colour scale ───────────────────────────────────────────────────────
function aqiColor(aqi) {
  if (!aqi || aqi <= 0) return '#94a3b8';
  if (aqi <= 50)  return '#22c55e';   // Good
  if (aqi <= 100) return '#84cc16';   // Satisfactory
  if (aqi <= 200) return '#eab308';   // Moderate
  if (aqi <= 300) return '#f97316';   // Poor
  if (aqi <= 400) return '#ef4444';   // Very Poor
  return '#7f1d1d';                   // Severe
}

function aqiLabel(aqi) {
  if (!aqi || aqi <= 0) return 'N/A';
  if (aqi <= 50)  return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 200) return 'Moderate';
  if (aqi <= 300) return 'Poor';
  if (aqi <= 400) return 'Very Poor';
  return 'Severe';
}

// PM2.5 WHO bands colour
function pm25Color(pm25) {
  if (!pm25 || pm25 <= 0) return '#94a3b8';
  if (pm25 <= 12)  return '#22c55e';
  if (pm25 <= 35)  return '#84cc16';
  if (pm25 <= 55)  return '#eab308';
  if (pm25 <= 150) return '#f97316';
  if (pm25 <= 250) return '#ef4444';
  return '#7f1d1d';
}

// ── Recenter map when city changes ────────────────────────────────────────
function RecenterOnCity({ center }) {
  const map = useMap();
  const prevKey = useRef(null);
  useEffect(() => {
    if (!center) return;
    const key = `${center[0]},${center[1]}`;
    if (prevKey.current === key) return;
    prevKey.current = key;
    map.setView(center, 11, { animate: true });
    setTimeout(() => map.invalidateSize(), 250);
  }, [center, map]);
  return null;
}

// ── Force Leaflet to repaint after container becomes visible ─────────────
function InvalidateOnMount() {
  const map = useMap();
  useEffect(() => {
    const t1 = setTimeout(() => map.invalidateSize(), 100);
    const t2 = setTimeout(() => map.invalidateSize(), 500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [map]);
  return null;
}

// ── Main component ─────────────────────────────────────────────────────────
export default function SpatialHotspotsMap() {
  const { city, observations, coords, loading, weather } = useVayu();
  const [activeLayer, setActiveLayer] = useState('AQI');

  const center = coords
    ? [coords.lat, coords.lon]
    : [28.6139, 77.209];

  // ── Derive one marker per station from observations list ─────────────────
  // Backend returns multiple rows per station (one per parameter).
  // We reduce to the best summary row per station_id.
  const stationMarkers = useMemo(() => {
    const stationMap = new Map();

    for (const obs of observations) {
      // Extract lat/lon from the nested coordinates object
      const lat = obs.coordinates?.latitude;
      const lon = obs.coordinates?.longitude;
      if (!lat || !lon || lat === 0 || lon === 0) continue;

      const id = obs.station_id;
      const existing = stationMap.get(id);

      // Collect pm25 and pm10 values keyed by station
      const pm25 = obs.parameter === 'pm25' ? obs.value : existing?.pm25;
      const pm10 = obs.parameter === 'pm10' ? obs.value : existing?.pm10;
      const no2  = obs.parameter === 'no2'  ? obs.value : existing?.no2;

      stationMap.set(id, {
        station_id: id,
        name: obs.location_name || obs.station_id || 'Monitoring Station',
        lat,
        lon,
        aqi: obs.aqi ?? existing?.aqi ?? 0,
        category: obs.category ?? existing?.category ?? '',
        pm25: pm25 ?? existing?.pm25,
        pm10: pm10 ?? existing?.pm10,
        no2:  no2  ?? existing?.no2,
        source: obs.source,
        timestamp: obs.timestamp,
      });
    }

    return Array.from(stationMap.values());
  }, [observations]);

  const hasMarkers = stationMarkers.length > 0;

  // ── Derive marker display value by active layer ───────────────────────────
  const getMarkerDisplay = (station) => {
    if (activeLayer === 'AQI') {
      return {
        value: station.aqi > 0 ? Math.round(station.aqi) : null,
        color: aqiColor(station.aqi),
        label: aqiLabel(station.aqi),
        displayStr: station.aqi > 0 ? `${Math.round(station.aqi)} AQI` : '—',
        sublabel: station.category,
      };
    }
    if (activeLayer === 'PM25') {
      const val = station.pm25;
      return {
        value: val,
        color: pm25Color(val),
        label: val != null ? `${val.toFixed(1)} µg/m³` : 'No PM2.5',
        displayStr: val != null ? `${val.toFixed(1)} µg/m³` : '—',
        sublabel: 'PM2.5',
      };
    }
    if (activeLayer === 'Wind') {
      // Wind is city-wide, not per station — show weather wind for all
      const ws = weather?.wind_speed;
      return {
        value: ws,
        color: '#3b82f6',
        label: ws != null ? `${ws} km/h` : 'No wind data',
        displayStr: ws != null ? `${ws} km/h` : '—',
        sublabel: 'Wind speed',
      };
    }
    return { value: null, color: '#94a3b8', label: '—', displayStr: '—', sublabel: '' };
  };

  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden bg-surface-container">

      {/* ── Layer toggle controls (AQI / PM2.5 / Wind) ── */}
      <div className="absolute top-2 left-2 flex items-center gap-1 bg-surface-container-lowest/95 backdrop-blur-md rounded-lg p-0.5 z-[1000] shadow-sm border border-outline-variant/30">
        {Object.entries(LAYERS).map(([key, def]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveLayer(key)}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
              activeLayer === key
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {def.label}
          </button>
        ))}
      </div>

      {/* ── Leaflet interactive map ── */}
      <MapContainer
        center={center}
        zoom={10}
        zoomControl={false}
        attributionControl={true}
        style={{ width: '100%', height: '100%' }}
      >
        {/* OpenStreetMap tiles — no API key required */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
          maxZoom={18}
        />

        <RecenterOnCity center={center} />
        <InvalidateOnMount />

        {/* Live station markers, one per physical station */}
        {stationMarkers.map((station) => {
          const disp = getMarkerDisplay(station);
          const radius = (station.aqi > 300 && activeLayer === 'AQI') ? 12 : 9;

          return (
            <CircleMarker
              key={station.station_id}
              center={[station.lat, station.lon]}
              radius={radius}
              pathOptions={{
                color: '#ffffff',
                weight: 1.5,
                fillColor: disp.color,
                fillOpacity: 0.92,
              }}
            >
              <Popup minWidth={150}>
                <div style={{ fontFamily: 'Inter, sans-serif', lineHeight: 1.4 }}>
                  <div style={{ fontWeight: 700, fontSize: 12, color: '#0b1c30', marginBottom: 6 }}>
                    {station.name}
                  </div>

                  {/* AQI row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span style={{
                      width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                      backgroundColor: aqiColor(station.aqi), display: 'inline-block',
                    }} />
                    <span style={{ fontWeight: 700, fontSize: 14, color: aqiColor(station.aqi) }}>
                      {station.aqi > 0 ? `AQI ${Math.round(station.aqi)}` : 'AQI —'}
                    </span>
                    <span style={{ fontSize: 10, color: '#64748b' }}>{station.category}</span>
                  </div>

                  {/* PM2.5 */}
                  {station.pm25 != null && (
                    <div style={{ fontSize: 11, color: '#475569', marginBottom: 2 }}>
                      PM2.5: <strong>{station.pm25.toFixed(1)}</strong> µg/m³
                    </div>
                  )}

                  {/* PM10 */}
                  {station.pm10 != null && (
                    <div style={{ fontSize: 11, color: '#475569', marginBottom: 2 }}>
                      PM10: <strong>{station.pm10.toFixed(1)}</strong> µg/m³
                    </div>
                  )}

                  {/* NO2 */}
                  {station.no2 != null && (
                    <div style={{ fontSize: 11, color: '#475569', marginBottom: 2 }}>
                      NO₂: <strong>{station.no2.toFixed(1)}</strong> µg/m³
                    </div>
                  )}

                  {/* Wind (if Wind layer active) */}
                  {activeLayer === 'Wind' && weather?.wind_speed != null && (
                    <div style={{ fontSize: 11, color: '#3b82f6', marginBottom: 2 }}>
                      Wind: <strong>{weather.wind_speed} km/h</strong>
                    </div>
                  )}

                  <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4, borderTop: '1px solid #e2e8f0', paddingTop: 4 }}>
                    {station.source} · {station.timestamp ? new Date(station.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* ── Overlay: no geolocated stations ── */}
      {!hasMarkers && !loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-container/85 backdrop-blur-sm z-[1000] rounded-xl pointer-events-none">
          <span className="material-symbols-outlined text-[32px] text-on-surface-variant mb-2">location_off</span>
          <p className="font-label-md text-label-md text-on-surface font-semibold text-center px-4">
            No station data received from backend
          </p>
          <p className="font-telemetry-meta text-telemetry-meta text-on-surface-variant text-center px-4 mt-1">
            Backend may be offline. Check the console for errors.
          </p>
        </div>
      )}

      {/* ── Overlay: loading ── */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-container/50 z-[1000] rounded-xl pointer-events-none">
          <span className="material-symbols-outlined text-[28px] text-primary" style={{ animation: 'spin 1s linear infinite' }}>progress_activity</span>
        </div>
      )}

      {/* ── Bottom status bar ── */}
      <div className="absolute bottom-8 left-2 right-2 bg-surface-container-lowest/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg shadow-sm flex items-center justify-between z-[1000] pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-secondary text-[16px]">sensors</span>
          <span className="font-telemetry-meta text-telemetry-meta text-on-surface">
            {hasMarkers
              ? `${stationMarkers.length} station${stationMarkers.length !== 1 ? 's' : ''} · ${CITY_COORDS[city]?.label ?? city} · ${LAYERS[activeLayer].label} layer`
              : loading ? 'Fetching station data…' : 'Awaiting data'}
          </span>
        </div>
        {hasMarkers && (
          <span className="font-label-sm text-label-sm text-secondary font-semibold">
            {activeLayer === 'Wind' && weather?.wind_speed != null
              ? `Wind: ${weather.wind_speed} km/h`
              : activeLayer === 'PM25'
              ? 'PM2.5 layer'
              : 'AQI layer'}
          </span>
        )}
      </div>
    </div>
  );
}
