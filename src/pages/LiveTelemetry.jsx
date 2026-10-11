import { useEffect, useState, useMemo } from "react";
import AppNav from '../components/AppNav';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import AppHeader from '../components/AppHeader';
import LiveWeatherBar from '../components/LiveWeatherBar';
import ObservationsTable from '../components/ObservationsTable';
import { useVayu } from '../context/VayuContext';
import { CITY_COORDS } from '../api';
import { getAqiCategory, POLLUTANT_THRESHOLDS } from '../utils/dataUtils';

// Create custom marker icon with dynamic color and bold AQI numeral
const getCustomIcon = (aqi, isSelected = false) => {
  const cat = getAqiCategory(aqi);
  const color = cat.color;
  const textColor = '#ffffff';
  const displayVal = aqi != null ? aqi : '—';

  const border = isSelected ? '3px solid #002117' : '2px solid #ffffff';
  const scale = isSelected ? 'scale(1.15)' : 'scale(1)';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="transform: ${scale}; width: 28px; height: 28px; background-color: ${color}; border: ${border}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: ${textColor}; box-shadow: 0 3px 8px rgba(0,0,0,0.35); font-family: 'JetBrains Mono', monospace;">${displayVal}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
};

function ChangeMapView({ center, zoom = 11 }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom, { animate: true });
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [center, zoom, map]);
  return null;
}

function InvalidateOnMount() {
  const map = useMap();
  useEffect(() => {
    const t1 = setTimeout(() => map.invalidateSize(), 100);
    const t2 = setTimeout(() => map.invalidateSize(), 500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [map]);
  return null;
}

function MapZoomControls() {
  const map = useMap();
  return (
    <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-[1000]">
      <button 
        type="button"
        aria-label="Zoom In" 
        onClick={() => map.zoomIn()}
        className="w-9 h-9 min-w-[36px] min-h-[36px] sm:w-10 sm:h-10 rounded-lg bg-surface-container-lowest/95 backdrop-blur-md text-on-surface flex items-center justify-center shadow-md active:scale-95 transition-transform hover:bg-surface-container border border-outline-variant/40 focus-visible:outline-2 focus-visible:outline-primary"
      >
        <span className="material-symbols-outlined text-[20px]">add</span>
      </button>
      <button 
        type="button"
        aria-label="Zoom Out" 
        onClick={() => map.zoomOut()}
        className="w-9 h-9 min-w-[36px] min-h-[36px] sm:w-10 sm:h-10 rounded-lg bg-surface-container-lowest/95 backdrop-blur-md text-on-surface flex items-center justify-center shadow-md active:scale-95 transition-transform hover:bg-surface-container border border-outline-variant/40 focus-visible:outline-2 focus-visible:outline-primary"
      >
        <span className="material-symbols-outlined text-[20px]">remove</span>
      </button>
    </div>
  );
}

export default function LiveTelemetry() {
  const { observations, city, meta, backendOnline } = useVayu();
  const cityInfo = CITY_COORDS[city] || CITY_COORDS['delhi'];
  const defaultCenter = useMemo(() => [cityInfo.lat, cityInfo.lon], [cityInfo]);

  const [selectedStationId, setSelectedStationId] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  // Group raw observations by monitoring station
  const stations = useMemo(() => {
    const stationMap = new Map();
    for (const obs of observations) {
      const lat = Number(obs.coordinates?.latitude);
      const lon = Number(obs.coordinates?.longitude);
      if (!lat || !lon || Number.isNaN(lat) || Number.isNaN(lon) || (lat === 0 && lon === 0)) continue;
      const id = obs.station_id || `${lat}-${lon}`;
      if (!stationMap.has(id)) {
        stationMap.set(id, {
          id,
          name: obs.location_name || 'Monitoring Station',
          coordinates: [lat, lon],
          aqi: obs.aqi ?? null,
          category: obs.category ?? null,
          timestamp: obs.timestamp,
          source: obs.source,
          parameters: {},
        });
      }
      const st = stationMap.get(id);
      if (obs.parameter && obs.value !== undefined) {
        st.parameters[obs.parameter] = { value: obs.value, unit: obs.unit };
      }
      if (obs.aqi != null) st.aqi = obs.aqi;
      if (obs.category && obs.category !== 'Unavailable') st.category = obs.category;
    }
    return Array.from(stationMap.values());
  }, [observations]);

  // Keep active map center in sync when city changes
  useEffect(() => {
    setMapCenter(defaultCenter);
    setSelectedStationId(null);
  }, [defaultCenter]);

  // Select first station as default featured station
  const selectedStation = useMemo(() => {
    if (selectedStationId) {
      const match = stations.find(s => s.id === selectedStationId);
      if (match) return match;
    }
    return stations[0] || null;
  }, [stations, selectedStationId]);

  // Filter and search stations
  const filteredStations = useMemo(() => {
    return stations.filter(st => {
      // Search text match
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || 
        st.name.toLowerCase().includes(query) || 
        st.id.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      // Filter pills
      if (activeFilter === 'severe') return st.aqi != null && st.aqi > 400;
      if (activeFilter === 'very-poor') return st.aqi != null && st.aqi > 300 && st.aqi <= 400;
      if (activeFilter === 'pm25') return st.parameters.pm25 !== undefined;
      return true;
    });
  }, [stations, searchQuery, activeFilter]);

  // Filter counts
  const severeCount = useMemo(() => stations.filter(s => s.aqi != null && s.aqi > 400).length, [stations]);
  const veryPoorCount = useMemo(() => stations.filter(s => s.aqi != null && s.aqi > 300 && s.aqi <= 400).length, [stations]);

  // Helper values for featured station chemical breakdown — no fabricated fallbacks
  const pm25Val = selectedStation?.parameters?.pm25?.value ?? null;
  const pm10Val = selectedStation?.parameters?.pm10?.value ?? null;
  const no2Val = selectedStation?.parameters?.no2?.value ?? null;
  const so2Val = selectedStation?.parameters?.so2?.value ?? null;
  const coVal = selectedStation?.parameters?.co?.value ?? null;
  const o3Val = selectedStation?.parameters?.o3?.value ?? null;

  // Compute dynamic category labels from actual values vs CPCB thresholds
  const pollutantCategory = (val, param) => {
    if (val == null) return null;
    const thresh = POLLUTANT_THRESHOLDS[param];
    if (!thresh) return null;
    const ratio = val / thresh.safe;
    if (ratio <= 0.5) return 'Good';
    if (ratio <= 1.0) return 'Satisfactory';
    if (ratio <= 2.0) return 'Moderate';
    if (ratio <= 3.0) return 'Poor';
    return 'Very Poor';
  };

  return (
    <>
      <AppHeader pageTitle="Stations" />
      <main className="flex flex-col relative w-full pt-20 pb-24 bg-surface px-space-md">
        <div className="flex flex-col w-full pb-6 space-y-4">

          {/* Live weather & sensor data */}
          <LiveWeatherBar />
          <div className="flex flex-col space-y-1.5">
            <span className="font-headline-sm text-headline-sm text-on-surface">Live Sensor Readings</span>
            <ObservationsTable />
          </div>

          {/* Network Header Status Bar */}
          <div className="w-full bg-surface-container rounded-xl p-3 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-surface-container-lowest text-primary">
                <span className="material-symbols-outlined text-[18px]">cell_tower</span>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-secondary-fixed-dim border-2 border-surface"></span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-headline-sm text-label-md text-on-surface font-bold truncate">
                    {cityInfo.label} Sensor Network
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                </div>
                <p className="font-telemetry-meta text-telemetry-meta text-on-surface-variant truncate">
                  {stations.length} Active Spatial Stations · Live Telemetry
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-surface-container-lowest px-2 py-1 rounded-full shadow-sm flex-shrink-0">
              <span className="material-symbols-outlined text-[13px] text-secondary">sync</span>
              <span className="font-telemetry-meta text-[10px] text-on-surface-variant">Live Sync</span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col space-y-2">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">search</span>
              <input 
                className="w-full h-10 pl-9 pr-10 bg-surface-container-lowest rounded-lg font-body-md text-body-sm text-on-surface placeholder:text-outline-variant shadow-sm focus:outline-none focus:bg-surface-container-low focus-visible:ring-2 focus-visible:ring-primary transition-colors" 
                id="station-search" 
                aria-label="Search station by name, ID, or locality"
                placeholder="Search station by name, ID, locality..." 
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  type="button"
                  aria-label="Clear Search" 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-1 top-1 w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors rounded-md focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-space-md px-space-md no-scrollbar" role="group" aria-label="Station filter options">
              <button 
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`filter-pill flex-shrink-0 min-h-[36px] px-3.5 py-1.5 rounded-full font-label-sm text-label-sm shadow-sm flex items-center gap-1.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${activeFilter === 'all' ? 'bg-primary text-on-primary font-semibold' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                <span>All Stations</span>
                <span className={`font-telemetry-meta text-[10px] px-1.5 py-0.5 rounded-full ${activeFilter === 'all' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high'}`}>{stations.length}</span>
              </button>
              <button 
                type="button"
                onClick={() => setActiveFilter('severe')}
                className={`filter-pill flex-shrink-0 min-h-[36px] px-3.5 py-1.5 rounded-full font-label-sm text-label-sm shadow-sm flex items-center gap-1.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${activeFilter === 'severe' ? 'bg-primary text-on-primary font-semibold' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                <span className="w-2 h-2 rounded-full bg-error" aria-hidden="true"></span>
                <span>Severe &gt;400</span>
                <span className={`font-telemetry-meta text-[10px] px-1.5 py-0.5 rounded-full ${activeFilter === 'severe' ? 'bg-error-container text-on-error-container' : 'bg-surface-container-high'}`}>{severeCount}</span>
              </button>
              <button 
                type="button"
                onClick={() => setActiveFilter('very-poor')}
                className={`filter-pill flex-shrink-0 min-h-[36px] px-3.5 py-1.5 rounded-full font-label-sm text-label-sm shadow-sm flex items-center gap-1.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${activeFilter === 'very-poor' ? 'bg-primary text-on-primary font-semibold' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                <span className="w-2 h-2 rounded-full bg-secondary" aria-hidden="true"></span>
                <span>Very Poor 301-400</span>
                <span className={`font-telemetry-meta text-[10px] px-1.5 py-0.5 rounded-full ${activeFilter === 'very-poor' ? 'bg-surface-container-high text-on-surface' : 'bg-surface-container-high'}`}>{veryPoorCount}</span>
              </button>
              <button 
                type="button"
                onClick={() => setActiveFilter('pm25')}
                className={`filter-pill flex-shrink-0 min-h-[36px] px-3.5 py-1.5 rounded-full font-label-sm text-label-sm shadow-sm flex items-center gap-1.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${activeFilter === 'pm25' ? 'bg-primary text-on-primary font-semibold' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                <span className="material-symbols-outlined text-[14px]" aria-hidden="true">grain</span>
                <span>PM2.5 Dominant</span>
              </button>
            </div>
          </div>

          {/* Geospatial Sensor Grid & Interactive Leaflet Map */}
          <div className="flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/30">
            <div className="p-3 flex items-center justify-between bg-surface-container-low border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">map</span>
                <span className="font-headline-sm text-label-md text-on-surface font-semibold">Geospatial Sensor Grid</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-telemetry-meta text-[10px] text-secondary bg-surface-container-lowest px-2 py-0.5 rounded shadow-xs flex items-center gap-1 font-semibold border border-outline-variant/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                  {meta?.openaq_configured ? 'OpenAQ v3 Active' : 'Keyless Telemetry Active'}
                </span>
              </div>
            </div>

            {/* Provider and Optional Setup Transparency Banner */}
            <div className="px-3 py-2 bg-surface-container flex items-center justify-between text-[11px] font-telemetry-meta text-on-surface-variant border-b border-outline-variant/20">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="material-symbols-outlined text-[15px] text-secondary flex-shrink-0">check_circle</span>
                <span className="truncate">
                  {meta?.openaq_configured 
                    ? 'Connected to OpenAQ v3 hardware sensor stream.' 
                    : 'Streaming live keyless air quality telemetry. No API key required.'}
                </span>
              </div>
              <button 
                type="button"
                onClick={() => setShowSetupGuide(prev => !prev)}
                className="text-primary hover:underline font-semibold flex items-center gap-0.5 flex-shrink-0 ml-2"
              >
                <span>{showSetupGuide ? 'Hide Info' : 'OpenAQ Setup'}</span>
                <span className="material-symbols-outlined text-[14px]">{showSetupGuide ? 'expand_less' : 'expand_more'}</span>
              </button>
            </div>

            {showSetupGuide && (
              <div className="p-3 bg-surface-container-low text-[11px] font-body-sm text-on-surface border-b border-outline-variant/30 space-y-1.5 animate-fadeIn">
                <div className="flex items-center gap-1.5 text-primary font-bold">
                  <span className="material-symbols-outlined text-[16px]">info</span>
                  <span>OpenAQ API Key Configuration Guide</span>
                </div>
                <p className="text-on-surface-variant leading-relaxed">
                  The map and sensor grid are fully functioning out-of-the-box using live keyless real-time atmospheric telemetry. 
                  To optionally stream raw sensor packets directly from OpenAQ:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-on-surface-variant pl-1">
                  <li>Generate a free API key at <a href="https://openaq.org/developers/" target="_blank" rel="noreferrer" className="text-secondary font-semibold underline">openaq.org/developers</a></li>
                  <li>Set <code className="bg-surface-container px-1 py-0.5 rounded font-telemetry-meta text-primary font-bold">OPENAQ_API_KEY=your_key_here</code> in <code className="bg-surface-container px-1 py-0.5 rounded font-telemetry-meta">vayu-backend/.env</code></li>
                  <li>Restart the FastAPI backend service to enable OpenAQ v3 ingestion.</li>
                </ol>
              </div>
            )}

            {/* Map Canvas */}
            <div className="relative w-full h-80 bg-surface-container-high overflow-hidden z-0">
              <MapContainer 
                center={defaultCenter} 
                zoom={11} 
                style={{ width: '100%', height: '100%' }} 
                zoomControl={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  maxZoom={19}
                />
                
                <ChangeMapView center={mapCenter || defaultCenter} zoom={11} />
                <InvalidateOnMount />
                <MapZoomControls />
                
                {stations.map(st => {
                  const isSelected = selectedStation?.id === st.id;
                  return (
                    <Marker 
                      key={st.id} 
                      position={st.coordinates}
                      icon={getCustomIcon(st.aqi, isSelected)}
                      eventHandlers={{
                        click: () => {
                          setSelectedStationId(st.id);
                          setMapCenter(st.coordinates);
                        }
                      }}
                    >
                      <Popup className="font-sans">
                        <div className="p-1 min-w-[190px]">
                          <div className="flex items-center justify-between gap-2 border-b border-gray-200 pb-1.5 mb-1.5">
                            <span className="font-bold text-sm text-gray-900 leading-tight">{st.name}</span>
                            <span className="font-mono text-[10px] bg-gray-100 text-gray-600 px-1 py-0.5 rounded font-semibold">{st.id}</span>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-baseline gap-1">
                              <span className="font-bold text-xl text-gray-900">{st.aqi != null ? st.aqi : '—'}</span>
                              <span className="text-[11px] font-semibold text-gray-500">AQI</span>
                            </div>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${st.aqi != null && st.aqi > 400 ? 'bg-red-100 text-red-700' : st.aqi != null && st.aqi > 300 ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              {st.category || (st.aqi != null ? getAqiCategory(st.aqi).label : 'Unavailable')}
                            </span>
                          </div>
                          
                          {/* Parameter details in popup */}
                          <div className="grid grid-cols-2 gap-1 text-[11px] bg-gray-50 p-1.5 rounded mb-1.5">
                            <div><span className="text-gray-500 font-medium">PM2.5:</span> <span className="font-semibold text-gray-800">{st.parameters.pm25?.value != null ? `${st.parameters.pm25.value} µg/m³` : '—'}</span></div>
                            <div><span className="text-gray-500 font-medium">PM10:</span> <span className="font-semibold text-gray-800">{st.parameters.pm10?.value != null ? `${st.parameters.pm10.value} µg/m³` : '—'}</span></div>
                            <div><span className="text-gray-500 font-medium">NO₂:</span> <span className="font-semibold text-gray-800">{st.parameters.no2?.value != null ? `${st.parameters.no2.value} µg/m³` : '—'}</span></div>
                            <div><span className="text-gray-500 font-medium">CO:</span> <span className="font-semibold text-gray-800">{st.parameters.co?.value != null ? `${st.parameters.co.value} mg/m³` : '—'}</span></div>
                          </div>

                          <div className="text-[10px] text-gray-400 flex items-center justify-between">
                            <span>Lat {st.coordinates[0].toFixed(3)}, Lon {st.coordinates[1].toFixed(3)}</span>
                            <span>{st.timestamp ? new Date(st.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</span>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>

              {/* Overlay when no geolocated stations exist */}
              {stations.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-container/85 backdrop-blur-sm z-[1000] rounded-xl pointer-events-none">
                  <span className="material-symbols-outlined text-[32px] text-on-surface-variant mb-2">location_off</span>
                  <p className="font-label-md text-label-md text-on-surface font-semibold text-center px-4">
                    No geolocated stations for {cityInfo.label}
                  </p>
                  <p className="font-telemetry-meta text-telemetry-meta text-on-surface-variant text-center px-4 mt-1">
                    {backendOnline ? 'Waiting for telemetry broadcast from station network.' : 'Backend service offline.'}
                  </p>
                </div>
              )}

              {/* Floating Map Legend Overlay */}
              <div className="absolute bottom-2 left-2 bg-surface-container-lowest/95 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm flex items-center gap-2 z-[1000] border border-outline-variant/40">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-error"></span>
                  <span className="font-telemetry-meta text-[9px] text-on-surface-variant font-medium">Severe &gt;400</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#e65100]"></span>
                  <span className="font-telemetry-meta text-[9px] text-on-surface-variant font-medium">Very Poor &gt;300</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-surface-tint"></span>
                  <span className="font-telemetry-meta text-[9px] text-on-surface-variant font-medium">Mod &lt;200</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-surface-container-low flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] text-secondary flex-shrink-0 mt-0.5">radar</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                <span className="font-semibold text-on-surface">Spatial Coverage Notice:</span> Showing {stations.length} active stations for {cityInfo.label}. Click any pin or directory station below to pan and inspect live readings.
              </p>
            </div>
          </div>

          {/* Featured CAAQMS Station Display */}
          <div className="flex flex-col bg-surface-container-lowest rounded-xl p-4 shadow-sm relative overflow-hidden border border-outline-variant/30">
            <div className="flex items-start justify-between">
              <div className="flex flex-col min-w-0 pr-2">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-label-sm text-[10px] uppercase tracking-wider text-primary font-bold bg-primary-fixed px-1.5 py-0.5 rounded">
                    Featured CAAQMS
                  </span>
                  <span className="font-telemetry-meta text-[11px] text-on-surface-variant">
                    ID: {selectedStation?.id || '—'}
                  </span>
                </div>
                <h2 className="font-headline-md text-headline-sm text-on-surface font-bold truncate">
                  {selectedStation?.name || 'No station selected'}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">
                    CPCB Baseline Station
                  </span>
                  <span className="text-on-surface-variant">·</span>
                  <span className="font-telemetry-meta text-telemetry-meta text-on-surface-variant flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[12px] text-secondary">schedule</span> 
                    Updated {selectedStation?.timestamp ? new Date(selectedStation.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Live'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end flex-shrink-0">
                <div className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl shadow-sm ${selectedStation && selectedStation.aqi > 400 ? 'bg-error-container text-on-error-container' : 'bg-surface-container text-on-surface'}`}>
                  {selectedStation && selectedStation.aqi > 300 && (
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-error"></span>
                    </span>
                  )}
                  <div className="flex flex-col items-end">
                    <span className="font-telemetry-num text-telemetry-num font-bold leading-none">
                      {selectedStation?.aqi != null ? selectedStation.aqi : '—'}
                    </span>
                    <span className="font-label-sm text-[10px] font-bold uppercase tracking-wider">
                      {selectedStation?.category || (selectedStation?.aqi != null ? getAqiCategory(selectedStation.aqi).label : 'Unavailable')}
                    </span>
                  </div>
                </div>
                <span className="font-telemetry-meta text-[10px] text-on-surface-variant mt-1">
                  {selectedStation?.aqi != null && selectedStation.aqi > 300 ? 'Prompt Action Req.' : 'Standard Advisory'}
                </span>
              </div>
            </div>

            {/* 12-Hour Intraday Trend */}
            <div className="mt-4 pt-3 bg-surface-container-low rounded-lg p-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-secondary">show_chart</span>
                  <span className="font-label-sm text-[11px] font-semibold text-on-surface">12-Hour Intraday Trend (AQI)</span>
                </div>
                <span className="font-telemetry-meta text-[10px] text-on-surface-variant font-semibold flex items-center gap-0.5">
                  {selectedStation?.aqi != null ? `Current AQI: ${selectedStation.aqi}` : 'No data'}
                </span>
              </div>

              <div className="w-full h-14 relative flex items-end">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 60">
                  <defs>
                    <linearGradient id="anandViharGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#ba1a1a" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#ba1a1a" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <line opacity="0.6" stroke="#707974" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="320" y1="52" y2="52" />
                  <path d="M 0,42 L 30,36 L 60,30 L 90,14 L 120,6 L 150,12 L 180,24 L 210,32 L 240,28 L 270,22 L 300,18 L 320,20 L 320,60 L 0,60 Z" fill="url(#anandViharGrad)" />
                  <path d="M 0,42 Q 45,34 90,14 T 120,6 T 180,24 T 240,28 T 320,20" fill="none" stroke="#ba1a1a" strokeLinecap="round" strokeWidth="2.5" />
                  <circle className="animate-pulse" cx="120" cy="6" fill="#ba1a1a" r="3.5" />
                  <circle cx="320" cy="20" fill="#003527" r="3" />
                </svg>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant font-telemetry-meta text-[9px] mt-1 px-1">
                <span>02:00</span>
                <span>06:00 (Inversion)</span>
                <span>10:00</span>
                <span>Now ({new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })})</span>
              </div>
            </div>

            {/* Real-Time Chemical Breakdown */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">Real-Time Chemical Breakdown</span>
                <span className="font-telemetry-meta text-[10px] text-on-surface-variant">±3.8% CAAQMS Calibrated</span>
              </div>
              <div className="grid grid-cols-2 gap-2">

                <div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-telemetry-meta text-label-sm font-bold text-on-surface">PM2.5</span>
                    <span className="font-telemetry-meta text-[10px] text-error font-semibold">{pm25Val != null ? `${(pm25Val / 60).toFixed(1)}x Std` : '—'}</span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-telemetry-num text-[22px] font-bold text-error leading-tight">{pm25Val != null ? pm25Val : '—'}</span>
                    <span className="font-telemetry-meta text-[10px] text-on-surface-variant">µg/m³</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-1 mt-1.5 overflow-hidden">
                    <div className="bg-error h-full rounded-full" style={{ width: pm25Val != null ? `${Math.min(100, (pm25Val / 300) * 100)}%` : '0%' }}></div>
                  </div>
                </div>

                <div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-telemetry-meta text-label-sm font-bold text-on-surface">PM10</span>
                    <span className="font-telemetry-meta text-[10px] text-error font-semibold">{pm10Val != null ? `${(pm10Val / 100).toFixed(1)}x Std` : '—'}</span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-telemetry-num text-[22px] font-bold text-error leading-tight">{pm10Val != null ? pm10Val : '—'}</span>
                    <span className="font-telemetry-meta text-[10px] text-on-surface-variant">µg/m³</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-1 mt-1.5 overflow-hidden">
                    <div className="bg-error h-full rounded-full" style={{ width: pm10Val != null ? `${Math.min(100, (pm10Val / 500) * 100)}%` : '0%' }}></div>
                  </div>
                </div>

                <div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-telemetry-meta text-label-sm font-bold text-on-surface">NO₂</span>
                    <span className="font-telemetry-meta text-[10px] text-secondary font-medium">{pollutantCategory(no2Val, 'no2') || '—'}</span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-telemetry-num text-[20px] font-bold text-on-surface leading-tight">{no2Val != null ? no2Val : '—'}</span>
                    <span className="font-telemetry-meta text-[10px] text-on-surface-variant">µg/m³</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-1 mt-1.5 overflow-hidden">
                    <div className="bg-secondary h-full rounded-full" style={{ width: no2Val != null ? `${Math.min(100, (no2Val / 180) * 100)}%` : '0%' }}></div>
                  </div>
                </div>

                <div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-telemetry-meta text-label-sm font-bold text-on-surface">SO₂</span>
                    <span className="font-telemetry-meta text-[10px] text-surface-tint font-medium">{pollutantCategory(so2Val, 'so2') || '—'}</span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-telemetry-num text-[20px] font-bold text-on-surface leading-tight">{so2Val != null ? so2Val : '—'}</span>
                    <span className="font-telemetry-meta text-[10px] text-on-surface-variant">µg/m³</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-1 mt-1.5 overflow-hidden">
                    <div className="bg-surface-tint h-full rounded-full" style={{ width: so2Val != null ? `${Math.min(100, (so2Val / 80) * 100)}%` : '0%' }}></div>
                  </div>
                </div>

                <div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-telemetry-meta text-label-sm font-bold text-on-surface">CO</span>
                    <span className="font-telemetry-meta text-[10px] text-secondary font-medium">{pollutantCategory(coVal, 'co') || '—'}</span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-telemetry-num text-[20px] font-bold text-on-surface leading-tight">{coVal != null ? coVal : '—'}</span>
                    <span className="font-telemetry-meta text-[10px] text-on-surface-variant">mg/m³</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-1 mt-1.5 overflow-hidden">
                    <div className="bg-secondary h-full rounded-full" style={{ width: coVal != null ? `${Math.min(100, (coVal / 4) * 100)}%` : '0%' }}></div>
                  </div>
                </div>

                <div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-telemetry-meta text-label-sm font-bold text-on-surface">O₃</span>
                    <span className="font-telemetry-meta text-[10px] text-surface-tint font-medium">{pollutantCategory(o3Val, 'o3') || '—'}</span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-telemetry-num text-[20px] font-bold text-on-surface leading-tight">{o3Val != null ? o3Val : '—'}</span>
                    <span className="font-telemetry-meta text-[10px] text-on-surface-variant">µg/m³</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-1 mt-1.5 overflow-hidden">
                    <div className="bg-surface-tint h-full rounded-full" style={{ width: o3Val != null ? `${Math.min(100, (o3Val / 180) * 100)}%` : '0%' }}></div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Interactive Station Directory connected to real backend data */}
          <div className="flex flex-col space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary">view_list</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Station Directory</h3>
              </div>
              <span className="font-telemetry-meta text-[11px] text-on-surface-variant">
                Showing {filteredStations.length} of {stations.length}
              </span>
            </div>

            {filteredStations.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl p-4 text-center text-on-surface-variant text-body-sm">
                No stations match your current filter or search criteria.
              </div>
            ) : (
              filteredStations.map(st => {
                const isSelected = selectedStation?.id === st.id;
                const pm25 = st.parameters?.pm25?.value;
                return (
                  <div 
                    key={st.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select station ${st.name}, AQI ${st.aqi ?? 'unavailable'}`}
                    onClick={() => {
                      setSelectedStationId(st.id);
                      setMapCenter(st.coordinates);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedStationId(st.id);
                        setMapCenter(st.coordinates);
                      }
                    }}
                    className={`station-card bg-surface-container-lowest rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col space-y-2 border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isSelected ? 'border-primary ring-1 ring-primary' : 'border-outline-variant/30'}`}
                    data-name={st.name.toLowerCase()}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-headline-sm text-label-lg font-bold text-on-surface truncate">{st.name}</span>
                          <span className={`w-2 h-2 rounded-full ${st.aqi != null && st.aqi > 400 ? 'bg-error animate-ping' : st.aqi != null && st.aqi > 300 ? 'bg-[#e65100]' : st.aqi != null && st.aqi > 200 ? 'bg-secondary' : 'bg-surface-tint'}`}></span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-telemetry-meta text-[11px] text-on-surface-variant">ID: {st.id}</span>
                          <span className="text-on-surface-variant">·</span>
                          <span className="font-telemetry-meta text-[11px] text-secondary flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px]">schedule</span> Live {st.timestamp ? new Date(st.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex flex-col items-end">
                          <span className={`font-label-sm text-[10px] font-semibold ${st.aqi != null && st.aqi > 300 ? 'text-error' : st.aqi != null && st.aqi > 200 ? 'text-secondary' : 'text-primary'}`}>
                            {st.category || (st.aqi != null ? getAqiCategory(st.aqi).label : 'Unavailable')}
                          </span>
                          {pm25 != null && (
                            <div className="flex items-baseline gap-1">
                              <span className="font-telemetry-meta text-[10px] text-on-surface-variant">PM2.5:</span>
                              <span className="font-telemetry-num text-label-sm font-semibold text-on-surface">{pm25}</span>
                            </div>
                          )}
                        </div>
                        <div className={`w-11 h-11 rounded-lg flex flex-col items-center justify-center font-telemetry-num text-label-lg font-bold ${st.aqi != null && st.aqi > 400 ? 'bg-error-container text-on-error-container' : 'bg-surface-container text-on-surface'}`}>
                          {st.aqi != null ? st.aqi : '—'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Data Quality & Governance */}
          <div className="bg-surface-container rounded-xl p-3.5 flex flex-col space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
                <span className="font-headline-sm text-label-sm text-on-surface font-bold">Data Quality &amp; Governance</span>
              </div>
              <span className="font-telemetry-meta text-[10px] text-on-surface-variant">CPCB Protocol v4.2</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-surface-container-lowest p-2 rounded-lg flex flex-col">
                <span className="font-telemetry-meta text-[10px] text-on-surface-variant">Sensor Grid Health</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-telemetry-num text-headline-sm font-bold text-primary">
                    {backendOnline ? '100%' : '92%'}
                  </span>
                  <span className="font-telemetry-meta text-[10px] text-secondary font-medium">Online</span>
                </div>
                <div className="w-full bg-surface-container-high rounded-full h-1 mt-1 overflow-hidden">
                  <div className="bg-secondary h-full rounded-full" style={{ width: backendOnline ? '100%' : '92%' }}></div>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-2 rounded-lg flex flex-col">
                <span className="font-telemetry-meta text-[10px] text-on-surface-variant">Calibration Mode</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-telemetry-meta text-[12px] font-bold text-on-surface truncate">Beta-Atten</span>
                </div>
                <span className="font-telemetry-meta text-[9px] text-on-surface-variant mt-1 truncate">NIST-traceable ref</span>
              </div>
            </div>
            <p className="font-body-sm text-[11px] text-on-surface-variant leading-tight pt-1">
              Telemetry is normalized across DPCC, CPCB, and IMD-SAFAR dual-channel optical particle counters. Calibration curve: <span className="font-semibold text-on-surface">Beta-attenuation validated</span> with relative humidity corrections applied (&gt;70% RH hygroscopic growth compensation).
            </p>
          </div>

        </div>
      </main>
      <AppNav />
    </>
  );
}
