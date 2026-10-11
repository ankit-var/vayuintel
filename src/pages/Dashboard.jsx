import AppHeader from '../components/AppHeader';
import AppNav from '../components/AppNav';
import LiveWeatherBar from '../components/LiveWeatherBar';
import ObservationsTable from '../components/ObservationsTable';
import SpatialHotspotsMap from '../components/SpatialHotspotsMap';
import { useVayu } from '../context/VayuContext';
import { CITY_COORDS } from '../api';
import {
  getAqiCategory,
  computeCityAverages,
  computeOverallAqi,
  safeMultiplier,
  formatTimeIST,
  aggregateStations,
  POLLUTANT_THRESHOLDS,
} from '../utils/dataUtils';

export default function Dashboard() {
  const { city, setCity, observations, alerts, forecasts, weather, lastUpdated, loading } = useVayu();

  // ── Derived live values ──────────────────────────────────────────────
  const stations = aggregateStations(observations);
  const overallAqi = computeOverallAqi(observations);
  const aqiCat = getAqiCategory(overallAqi);
  const averages = computeCityAverages(observations);

  const pm25Avg = averages.pm25;
  const pm10Avg = averages.pm10;
  const pm25Mult = safeMultiplier(pm25Avg, 'pm25');
  const pm10Mult = safeMultiplier(pm10Avg, 'pm10');
  const pm10Cat = pm10Avg != null
    ? (pm10Avg > 430 ? 'Severe' : pm10Avg > 350 ? 'Very Poor' : pm10Avg > 250 ? 'Poor' : pm10Avg > 100 ? 'Moderate' : 'Good')
    : null;

  // ── Live alerts count ────────────────────────────────────────────────
  const liveAlerts = Array.isArray(alerts) ? alerts : [];
  const criticalAlerts = liveAlerts.filter(a => a.severity === 'CRITICAL');

  // ── Forecasts ────────────────────────────────────────────────────────
  const preds = forecasts?.predictions || [];
  const peakPred = preds.length > 0
    ? preds.reduce((max, p) => (p.aqi_projected != null && p.aqi_projected > (max?.aqi_projected ?? -1)) ? p : max, null)
    : null;

  // ── Find highest-AQI station for "Peak station" label ────────────────
  const peakStation = stations.length > 0
    ? stations.reduce((best, s) => (s.aqi != null && s.aqi > (best?.aqi ?? -1)) ? s : best, null)
    : null;

  const hasData = observations.length > 0;

  return (
    <>
      <AppHeader pageTitle="Overview" />
      <main className="flex flex-col relative w-full pt-20 pb-24 bg-surface px-space-md"><div className="flex flex-col w-full pb-6 space-y-4">

<div className="flex flex-col pt-1">
<div className="flex items-center justify-between">
<div>
<h1 className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface font-bold tracking-tight">Air Quality Intelligence</h1>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Monitor pollution. Anticipate risks. Take action.</p>
</div>
<div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shadow-sm">
<span className="material-symbols-outlined text-[20px]">air</span>
</div>
</div>
</div>

<div className="flex flex-col space-y-2">
<div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5" role="group" aria-label="Monitoring city selection">
{Object.entries(CITY_COORDS).map(([id, c]) => (
  <button
    key={id}
    type="button"
    aria-pressed={city === id}
    onClick={() => setCity(id)}
    className={`city-btn flex-shrink-0 min-h-[36px] px-3.5 py-1.5 rounded-full font-label-md text-label-md shadow-sm transition-all flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-primary ${
      city === id
        ? 'bg-primary text-on-primary font-semibold'
        : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
    }`}
  >
    <span className={`w-2 h-2 rounded-full ${city === id ? 'bg-secondary-fixed' : 'bg-outline-variant'}`}></span>
    {c.label}
  </button>
))}
</div>
<div className="flex items-center justify-between px-1">
<div className="flex items-center gap-1.5 text-on-surface-variant font-telemetry-meta text-telemetry-meta">
<span className="material-symbols-outlined text-[13px] text-secondary">sync</span>
<span>{lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}` : 'Fetching…'}</span>
<span className="text-outline-variant">•</span>
<span className="font-medium text-on-surface">{hasData ? `${stations.length} Stations · ${observations.length} Readings` : loading ? 'Fetching…' : 'No data'}</span>
</div>
<span className={`font-telemetry-meta text-telemetry-meta font-semibold px-2 py-0.5 rounded-full ${hasData ? 'text-secondary bg-secondary-container/30' : 'text-outline bg-surface-container'}`}>{hasData ? 'LIVE' : 'OFFLINE'}</span>
</div>
</div>

<div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">

{/* ── Current AQI Card ── */}
<div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm flex flex-col justify-between relative overflow-hidden">
<div className="absolute -right-3 -top-3 w-16 h-16 bg-error-container/20 rounded-full blur-xl pointer-events-none"></div>
<div>
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Current AQI</span>
{overallAqi != null ? (
  <span className={`px-1.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold flex items-center gap-1 ${aqiCat.severity === 'critical' ? 'bg-error-container text-on-error-container' : aqiCat.severity === 'warning' ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary-fixed text-on-primary-fixed'}`}>
    <span className={`w-1.5 h-1.5 rounded-full ${aqiCat.severity === 'critical' ? 'bg-error' : 'bg-secondary'}`}></span>
    {aqiCat.label}
  </span>
) : (
  <span className="px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">Unavailable</span>
)}
</div>
<div className="flex items-baseline gap-1 mt-1.5">
<span className="font-telemetry-num text-telemetry-num text-on-surface font-bold">{overallAqi != null ? overallAqi : '—'}</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">IN-AQI</span>
</div>
</div>
<div className="mt-2 pt-2 bg-surface-container-low/50 rounded-lg p-1.5">
<p className="font-body-sm text-body-sm text-on-surface-variant truncate">CPCB Index{peakStation ? ` · Peak ${peakStation.name.split(',')[0]}` : ''}</p>
</div>
</div>

{/* ── PM2.5 Card ── */}
<div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">PM2.5 Primary</span>
{pm25Mult != null ? (
  <span className="px-1.5 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-medium">
    {pm25Mult}x Safe
  </span>
) : (
  <span className="px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">—</span>
)}
</div>
<div className="flex items-baseline gap-1 mt-1.5">
<span className="font-telemetry-num text-telemetry-num text-on-surface font-bold">{pm25Avg != null ? pm25Avg.toFixed(1) : '—'}</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">µg/m³</span>
</div>
</div>
<div className="mt-2 pt-2 bg-surface-container-low/50 rounded-lg p-1.5">
<p className="font-body-sm text-body-sm text-on-surface-variant truncate">Standard threshold: {POLLUTANT_THRESHOLDS.pm25.safe} µg/m³</p>
</div>
</div>

{/* ── PM10 Card ── */}
<div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">PM10 Coarse</span>
{pm10Mult != null ? (
  <span className="px-1.5 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-medium">
    {pm10Mult}x Safe
  </span>
) : (
  <span className="px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">—</span>
)}
</div>
<div className="flex items-baseline gap-1 mt-1.5">
<span className="font-telemetry-num text-telemetry-num text-on-surface font-bold">{pm10Avg != null ? pm10Avg.toFixed(1) : '—'}</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">µg/m³</span>
</div>
</div>
<div className="mt-2 pt-2 bg-surface-container-low/50 rounded-lg p-1.5">
<p className="font-body-sm text-body-sm text-on-surface-variant truncate">
  {pm10Cat ? `${pm10Cat} · Std ${POLLUTANT_THRESHOLDS.pm10.safe} µg/m³` : `Standard threshold: ${POLLUTANT_THRESHOLDS.pm10.safe} µg/m³`}
</p>
</div>
</div>

{/* ── Civic Response Card ── */}
<div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Civic Response</span>
{criticalAlerts.length > 0 ? (
  <span className="px-1.5 py-0.5 rounded-full bg-error text-on-error font-label-sm text-label-sm font-bold flex items-center gap-1 animate-pulse">
    <span className="material-symbols-outlined text-[11px]">priority_high</span>
    Active
  </span>
) : (
  <span className="px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">None</span>
)}
</div>
<div className="flex items-baseline gap-1 mt-1.5">
<span className={`font-telemetry-num text-telemetry-num font-bold ${criticalAlerts.length > 0 ? 'text-error' : 'text-on-surface'}`}>{liveAlerts.length}</span>
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Alert{liveAlerts.length !== 1 ? 's' : ''}</span>
</div>
</div>
<div className="mt-2 pt-2 bg-surface-container-low/50 rounded-lg p-1.5">
{criticalAlerts.length > 0 ? (
  <p className="font-body-sm text-body-sm text-on-surface font-medium truncate">{criticalAlerts[0].title}</p>
) : (
  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">No critical advisories active</p>
)}
</div>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm flex flex-col space-y-3">
<div className="flex items-center gap-2 mb-1">
<span className="material-symbols-outlined text-primary text-[20px]">map</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Spatial Hotspots</h2>
</div>

<SpatialHotspotsMap />

<div className="flex flex-col space-y-1.5 pt-1">
<div className="flex items-center justify-between text-on-surface-variant font-label-sm text-[10px]">
<span>CPCB Scale Band</span>
<span className="font-telemetry-meta">0 - 500 Sub-Index</span>
</div>
<div className="grid grid-cols-6 h-2 rounded-full overflow-hidden shadow-inner gap-0.5">
<div className="bg-primary-fixed" title="Good (0-50)"></div>
<div className="bg-tertiary-fixed" title="Satisfactory (51-100)"></div>
<div className="bg-secondary-container" title="Moderate (101-200)"></div>
<div className="bg-surface-tint" title="Poor (201-300)"></div>
<div className="bg-error" title="Very Poor (301-400)"></div>
<div className="bg-on-error-container" title="Severe (401-500)"></div>
</div>
<div className="grid grid-cols-6 text-center font-label-sm text-[9px] text-on-surface-variant tracking-tighter pt-0.5">
<span className="truncate">Good</span>
<span className="truncate">Satisf.</span>
<span className="truncate">Mod.</span>
<span className="truncate">Poor</span>
<span className="truncate text-error font-semibold">V.Poor</span>
<span className="truncate text-on-error-container font-semibold">Severe</span>
</div>
</div>
</div>

{/* ── Predictive Risk Window — from live forecast data ── */}
{peakPred && peakPred.aqi_projected != null ? (
<div className="bg-surface-container-low rounded-xl p-3.5 shadow-sm space-y-2.5">
<div className="flex items-center justify-between">
<div className="flex items-center gap-1.5">
<div className="w-6 h-6 rounded-full bg-error-container text-on-error-container flex items-center justify-center">
<span className="material-symbols-outlined text-[15px]">crisis_alert</span>
</div>
<span className="font-headline-sm text-headline-sm text-on-surface font-bold">Predictive Risk Window</span>
</div>
<span className={`font-telemetry-meta text-telemetry-meta font-bold px-2 py-0.5 rounded-full ${peakPred.aqi_projected > 300 ? 'text-error bg-error-container/40' : 'text-secondary bg-secondary-container/40'}`}>
  {getAqiCategory(peakPred.aqi_projected).label}
</span>
</div>
<div className="bg-surface-container-lowest rounded-lg p-2.5 space-y-2 shadow-xs">
<div className="flex items-center justify-between pb-1.5">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-secondary text-[16px]">schedule</span>
<span className="font-label-md text-label-md text-on-surface font-semibold">
  Peak at {formatTimeIST(peakPred.timestamp)} (+{peakPred.horizon_hours}h)
</span>
</div>
<span className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">Confidence: {peakPred.confidence}</span>
</div>
<div className="grid grid-cols-2 gap-2 text-on-surface">
<div className="bg-surface-container-low p-2 rounded-lg">
<span className="font-label-sm text-[10px] text-on-surface-variant uppercase block">Projected Peak AQI</span>
<span className="font-telemetry-meta text-telemetry-meta text-on-surface font-bold block mt-0.5">{peakPred.aqi_projected} ({getAqiCategory(peakPred.aqi_projected).label})</span>
</div>
<div className="bg-surface-container-low p-2 rounded-lg">
<span className="font-label-sm text-[10px] text-on-surface-variant uppercase block">Forecast Method</span>
<span className="font-telemetry-meta text-telemetry-meta text-on-surface font-bold block mt-0.5 truncate">Persistence Baseline</span>
</div>
</div>
</div>
<p className="font-telemetry-meta text-[10px] text-on-surface-variant text-center">Forecast uses persistence baseline — not a validated predictive model.</p>
</div>
) : (
<div className="bg-surface-container rounded-xl p-3 shadow-sm flex items-center gap-2">
<span className="material-symbols-outlined text-[18px] text-on-surface-variant">cloud_off</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">No forecast data available. Backend may be offline.</span>
</div>
)}

{/* ── Trend & Forecast Chart — simplified with live data indicators ── */}
<div className="bg-surface-container-lowest rounded-xl p-3.5 shadow-sm space-y-3">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-[20px]">show_chart</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Trend & Forecast</h2>
</div>
</div>

{preds.length > 0 ? (
<>
<div className="flex items-center justify-between text-on-surface-variant font-telemetry-meta text-[11px] px-1">
<div className="flex items-center gap-1.5">
<span className="w-3 h-1 bg-secondary rounded-full"></span>
<span>Current (Observed)</span>
</div>
<div className="flex items-center gap-1.5">
<span className="w-3 h-1 bg-surface-tint border-b border-dashed"></span>
<span>48h Persistence Baseline</span>
</div>
</div>

<div className="relative w-full bg-surface-container-low/40 rounded-xl p-3 flex flex-col gap-2">
{/* Current observation */}
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface font-semibold">Now (Observed)</span>
<span className="font-telemetry-num text-headline-sm text-on-surface font-bold">
  {preds[0].aqi_projected != null ? preds[0].aqi_projected : '—'}
  <span className="font-label-sm text-label-sm text-on-surface-variant ml-1">AQI</span>
</span>
</div>
{/* Forecast range */}
{preds.length > 1 && preds[1].aqi_projected != null && (
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant">+1h to +48h (Persistence)</span>
<span className="font-telemetry-num text-label-md text-on-surface font-semibold">
  {preds[1].aqi_projected} AQI
  <span className="font-telemetry-meta text-[10px] text-on-surface-variant ml-1">({preds[preds.length - 1].confidence} conf.)</span>
</span>
</div>
)}
<p className="font-telemetry-meta text-[10px] text-on-surface-variant mt-1">
  Method: Persistence Baseline (current AQI held constant). This is not a predictive forecast.
</p>
</div>
</>
) : (
<div className="flex items-center gap-2 py-4 text-on-surface-variant font-body-sm text-body-sm">
<span className="material-symbols-outlined text-[16px] text-outline">cloud_off</span>
No forecast data available.
</div>
)}
</div>

{/* ── Boundary Layer & Meteorology — from live weather API ── */}
<div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm space-y-2">
<div className="flex items-center justify-between">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-primary text-[18px]">thermostat</span>
<h3 className="font-label-lg text-label-lg text-on-surface font-semibold">Meteorology</h3>
</div>
<span className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">{weather?.source || 'Unavailable'}</span>
</div>
<div className="grid grid-cols-3 gap-1.5">

<div className="bg-surface-container-low rounded-lg p-2 text-center flex flex-col justify-between">
<span className="material-symbols-outlined text-secondary text-[16px] mx-auto">device_thermostat</span>
<span className="font-telemetry-num text-[18px] text-on-surface font-bold leading-tight mt-1">{weather?.temperature != null ? `${weather.temperature}°C` : '—'}</span>
<span className="font-label-sm text-[10px] text-on-surface-variant mt-0.5">Temp</span>
</div>

<div className="bg-surface-container-low rounded-lg p-2 text-center flex flex-col justify-between">
<span className="material-symbols-outlined text-secondary text-[16px] mx-auto">humidity_mid</span>
<span className="font-telemetry-num text-[18px] text-on-surface font-bold leading-tight mt-1">{weather?.humidity != null ? `${weather.humidity}%` : '—'}</span>
<span className="font-label-sm text-[10px] text-on-surface-variant mt-0.5">Humidity</span>
</div>

<div className="bg-surface-container-low rounded-lg p-2 text-center flex flex-col justify-between">
<span className="material-symbols-outlined text-secondary text-[16px] mx-auto">air</span>
<span className="font-telemetry-num text-[15px] text-on-surface font-bold leading-tight mt-1">{weather?.wind_speed != null ? `${weather.wind_speed}` : '—'} <span className="text-[10px] font-normal">km/h</span></span>
<span className="font-label-sm text-[10px] text-on-surface-variant mt-0.5">Wind</span>
</div>

</div>
</div>

{/* ── Data Provenance ── */}
<div className="bg-surface-container rounded-xl p-3 space-y-2">
<div className="flex items-center justify-between text-on-surface-variant font-telemetry-meta text-telemetry-meta">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-[15px] text-primary">verified</span>
<span className="font-semibold text-on-surface">Data Provenance & Scientific Protocol</span>
</div>
<span className="text-primary font-medium">Model v2.1</span>
</div>
<div className="grid grid-cols-2 gap-2 text-on-surface-variant font-body-sm text-[11px]">
<div className="flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span>Active Stations: <strong className="text-on-surface">{stations.length > 0 ? `${stations.length} reporting` : 'None'}</strong></span>
</div>
<div className="flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-surface-tint"></span>
<span>Forecast: <strong className="text-on-surface">Persistence Baseline</strong></span>
</div>
</div>
<div className="pt-1 text-center">
<p className="font-telemetry-meta text-[10px] text-on-surface-variant">Illustrative MVP — forecast uses persistence model, not validated ML prediction</p>
</div>
</div>

{/* ── Live Weather Strip ── */}
<LiveWeatherBar />

{/* ── Live OpenAQ Observations ── */}
<div className="flex flex-col space-y-1.5">
  <span className="font-headline-sm text-headline-sm text-on-surface">Live Sensor Readings</span>
  <ObservationsTable />
</div>

        </div>
      </main>
      <AppNav />
    </>
  );
}
