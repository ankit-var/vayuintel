import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useVayu } from '../context/VayuContext';
import { CITY_COORDS } from '../api';

// ── AQI colour helpers ─────────────────────────────────────────────────────
function aqiColor(aqi) {
  if (!aqi || aqi <= 0) return '#64748b';  // grey — no reading
  if (aqi <= 50)  return '#22c55e';  // Good
  if (aqi <= 100) return '#84cc16';  // Satisfactory
  if (aqi <= 200) return '#eab308';  // Moderate
  if (aqi <= 300) return '#f97316';  // Poor
  if (aqi <= 400) return '#ef4444';  // Very Poor
  return '#7f1d1d';                  // Severe
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

// ── Recenter map when city changes ────────────────────────────────────────
function RecenterOnCity({ center }) {
  const map = useMap();
  const prevCenter = useRef(null);
  useEffect(() => {
    if (!center) return;
    const key = `${center[0]},${center[1]}`;
    if (prevCenter.current === key) return;
    prevCenter.current = key;
    map.setView(center, 11, { animate: true });
    // force tile refresh in case the container was invisible during first render
    setTimeout(() => map.invalidateSize(), 200);
  }, [center, map]);
  return null;
}

// ── Main component ─────────────────────────────────────────────────────────
export default function SpatialHotspotsMap() {
  const { city, observations, coords, loading } = useVayu();

  const center = coords
    ? [coords.lat, coords.lon]
    : [28.6139, 77.209]; // Delhi fallback

  // Build marker data from live observations.
  // Each observation has: { station, lat, lon, aqi, pm25, pm10, parameter, value }
  const markers = observations
    .filter(o => o.lat && o.lon && o.lat !== 0 && o.lon !== 0)
    .slice(0, 40); // cap to keep the map clean

  const hasMarkers = markers.length > 0;

  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden bg-surface-container">
      {/* ── Leaflet interactive map ── */}
      <MapContainer
        center={center}
        zoom={10}
        zoomControl={false}
        attributionControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        {/* OpenStreetMap tiles — no API key required */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={18}
        />

        {/* Recenter when city selector changes */}
        <RecenterOnCity center={center} />

        {/* Live observation markers */}
        {markers.map((obs, i) => {
          const aqi = obs.aqi ?? obs.value ?? 0;
          const color = aqiColor(aqi);
          return (
            <CircleMarker
              key={`${obs.station}-${i}`}
              center={[obs.lat, obs.lon]}
              radius={aqi > 300 ? 11 : 8}
              pathOptions={{
                color: '#ffffff',
                weight: 1.5,
                fillColor: color,
                fillOpacity: 0.9,
              }}
            >
              <Popup>
                <div style={{ fontFamily: 'Inter, sans-serif', minWidth: 130 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, color: '#0b1c30' }}>
                    {obs.station}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <span style={{
                      display: 'inline-block',
                      width: 10, height: 10, borderRadius: '50%',
                      backgroundColor: color, flexShrink: 0,
                    }} />
                    <span style={{ fontWeight: 700, fontSize: 15, color }}>
                      AQI {aqi > 0 ? Math.round(aqi) : '—'}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{aqiLabel(aqi)}</div>
                  {obs.pm25 != null && (
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                      PM2.5: {obs.pm25} µg/m³
                    </div>
                  )}
                  {obs.pm10 != null && (
                    <div style={{ fontSize: 11, color: '#64748b' }}>
                      PM10: {obs.pm10} µg/m³
                    </div>
                  )}
                  {obs.parameter && obs.value != null && obs.parameter !== 'aqi' && (
                    <div style={{ fontSize: 11, color: '#64748b' }}>
                      {obs.parameter.toUpperCase()}: {obs.value}
                    </div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* ── Fallback if no geo-located stations ── */}
      {!hasMarkers && !loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-container/80 backdrop-blur-sm z-[1000] rounded-xl pointer-events-none">
          <span className="material-symbols-outlined text-[32px] text-on-surface-variant mb-2">location_off</span>
          <p className="font-label-md text-label-md text-on-surface-variant text-center px-4">
            No geolocated stations for this city yet.
          </p>
          <p className="font-telemetry-meta text-telemetry-meta text-outline text-center px-4 mt-1">
            Map is ready — switch cities or wait for data to load.
          </p>
        </div>
      )}

      {/* ── Loading spinner overlay ── */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-container/60 z-[1000] rounded-xl pointer-events-none">
          <span className="material-symbols-outlined text-[28px] text-primary animate-spin">progress_activity</span>
        </div>
      )}

      {/* ── Bottom attribution bar ── */}
      <div className="absolute bottom-2 left-2 right-2 bg-surface-container-lowest/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg shadow-sm flex items-center justify-between z-[1000] pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-secondary text-[16px]">sensors</span>
          <span className="font-telemetry-meta text-telemetry-meta text-on-surface">
            {hasMarkers
              ? `${markers.length} live station${markers.length !== 1 ? 's' : ''} • ${CITY_COORDS[city]?.label ?? city}`
              : 'Tap a marker to inspect'}
          </span>
        </div>
        <span className="font-label-sm text-label-sm text-on-surface-variant">OpenStreetMap</span>
      </div>
    </div>
  );
}
