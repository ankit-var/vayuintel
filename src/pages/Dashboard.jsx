
import React from 'react';
import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import LiveWeatherBar from '../components/LiveWeatherBar';
import ObservationsTable from '../components/ObservationsTable';
import SpatialHotspotsMap from '../components/SpatialHotspotsMap';
import { useVayu } from '../context/VayuContext';
import { CITY_COORDS } from '../api';

export default function Dashboard() {
  const { city, setCity, observations, lastUpdated } = useVayu();
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
<div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
{Object.entries(CITY_COORDS).map(([id, c]) => (
  <button
    key={id}
    onClick={() => setCity(id)}
    className={`city-btn flex-shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-label-md shadow-sm transition-all flex items-center gap-1.5 ${
      city === id
        ? 'bg-primary text-on-primary'
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
<span className="font-medium text-on-surface">{observations.length > 0 ? `${observations.length} Readings` : '38 Stations'}</span>
</div>
<span className="font-telemetry-meta text-telemetry-meta text-secondary font-semibold bg-secondary-container/30 px-2 py-0.5 rounded-full">CAAQMS Live</span>
</div>
</div>

<div className="grid grid-cols-2 gap-2.5">

<div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm flex flex-col justify-between relative overflow-hidden">
<div className="absolute -right-3 -top-3 w-16 h-16 bg-error-container/20 rounded-full blur-xl pointer-events-none"></div>
<div>
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Current AQI</span>
<span className="px-1.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-error"></span>
            Very Poor
          </span>
</div>
<div className="flex items-baseline gap-1 mt-1.5">
<span className="font-telemetry-num text-telemetry-num text-on-surface font-bold">342</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">IN-AQI</span>
</div>
</div>
<div className="mt-2 pt-2 bg-surface-container-low/50 rounded-lg p-1.5">
<p className="font-body-sm text-body-sm text-on-surface-variant truncate">CPCB Index • Peak Anand Vihar</p>
<div className="flex items-center gap-1 text-error font-telemetry-meta text-telemetry-meta font-semibold mt-0.5">
<span className="material-symbols-outlined text-[13px]">trending_up</span>
<span>+18 vs yesterday ↗</span>
</div>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">PM2.5 Primary</span>
<span className="px-1.5 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-medium">
            3.1x Safe
          </span>
</div>
<div className="flex items-baseline gap-1 mt-1.5">
<span className="font-telemetry-num text-telemetry-num text-on-surface font-bold">188</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">µg/m³</span>
</div>
</div>
<div className="mt-2 pt-2 bg-surface-container-low/50 rounded-lg p-1.5">
<p className="font-body-sm text-body-sm text-on-surface-variant truncate">Standard threshold: 60 µg/m³</p>
<div className="flex items-center gap-1 text-error font-telemetry-meta text-telemetry-meta font-semibold mt-0.5">
<span className="material-symbols-outlined text-[13px]">arrow_upward</span>
<span>+12% 24h moving</span>
</div>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">PM10 Coarse</span>
<span className="px-1.5 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-medium">
            Poor
          </span>
</div>
<div className="flex items-baseline gap-1 mt-1.5">
<span className="font-telemetry-num text-telemetry-num text-on-surface font-bold">310</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">µg/m³</span>
</div>
</div>
<div className="mt-2 pt-2 bg-surface-container-low/50 rounded-lg p-1.5">
<p className="font-body-sm text-body-sm text-on-surface-variant truncate">Road dust &amp; construction</p>
<div className="flex items-center gap-1 text-secondary font-telemetry-meta text-telemetry-meta font-semibold mt-0.5">
<span className="material-symbols-outlined text-[13px]">arrow_downward</span>
<span>-4% 24h delta</span>
</div>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Civic Response</span>
<span className="px-1.5 py-0.5 rounded-full bg-error text-on-error font-label-sm text-label-sm font-bold flex items-center gap-1 animate-pulse">
<span className="material-symbols-outlined text-[11px]">priority_high</span>
            Stage III
          </span>
</div>
<div className="flex items-baseline gap-1 mt-1.5">
<span className="font-telemetry-num text-telemetry-num text-error font-bold">3</span>
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Alerts</span>
</div>
</div>
<div className="mt-2 pt-2 bg-surface-container-low/50 rounded-lg p-1.5">
<p className="font-body-sm text-body-sm text-on-surface font-medium truncate">GRAP Stage III Active</p>
<span className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">2 Hotspots in Red Zone</span>
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

<div className="bg-surface-container-low rounded-xl p-3.5 shadow-sm space-y-2.5">
<div className="flex items-center justify-between">
<div className="flex items-center gap-1.5">
<div className="w-6 h-6 rounded-full bg-error-container text-on-error-container flex items-center justify-center">
<span className="material-symbols-outlined text-[15px]">crisis_alert</span>
</div>
<span className="font-headline-sm text-headline-sm text-on-surface font-bold">Predictive Risk Window</span>
</div>
<span className="font-telemetry-meta text-telemetry-meta text-error font-bold bg-error-container/40 px-2 py-0.5 rounded-full">High Severity</span>
</div>
<div className="bg-surface-container-lowest rounded-lg p-2.5 space-y-2 shadow-xs">
<div className="flex items-center justify-between pb-1.5">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-secondary text-[16px]">schedule</span>
<span className="font-label-md text-label-md text-on-surface font-semibold">Tomorrow 05:00 AM – 09:00 AM</span>
</div>
<span className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">Inversion Trap</span>
</div>
<div className="grid grid-cols-2 gap-2 text-on-surface">
<div className="bg-surface-container-low p-2 rounded-lg">
<span className="font-label-sm text-[10px] text-on-surface-variant uppercase block">Impact Corridor</span>
<span className="font-label-md text-label-md text-on-surface font-semibold block mt-0.5 truncate">East Delhi / Trans-Yamuna</span>
</div>
<div className="bg-surface-container-low p-2 rounded-lg">
<span className="font-label-sm text-[10px] text-on-surface-variant uppercase block">Projected Peak AQI</span>
<span className="font-telemetry-meta text-telemetry-meta text-error font-bold block mt-0.5">390 – 420 (Severe)</span>
</div>
</div>
<div className="bg-primary/5 rounded-lg p-2.5 flex items-start gap-2">
<span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0 mt-0.5">verified_user</span>
<div>
<span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wide block">Mandated Public Action</span>
<p className="font-body-sm text-body-sm text-on-surface leading-snug mt-0.5">
            Municipal smog cannons deployment scheduled along Ring Road. School outdoor morning assemblies suspended. High-efficiency indoor HEPA filtration recommended.
          </p>
</div>
</div>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl p-3.5 shadow-sm space-y-3">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-[20px]">show_chart</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Trend & Ensemble Forecast</h2>
</div>
<div className="flex items-center gap-1 bg-surface-container-low rounded-lg p-0.5">
<button className="px-2 py-0.5 rounded text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm">24h</button>
<button className="px-2 py-0.5 rounded bg-surface-container-lowest text-primary font-label-sm text-label-sm shadow-xs font-semibold">48h</button>
<button className="px-2 py-0.5 rounded text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm">7D</button>
</div>
</div>

<div className="flex items-center justify-between text-on-surface-variant font-telemetry-meta text-[11px] px-1">
<div className="flex items-center gap-1.5">
<span className="w-3 h-1 bg-secondary rounded-full"></span>
<span>Observed CPCB (24h)</span>
</div>
<div className="flex items-center gap-1.5">
<span className="w-3 h-1 bg-surface-tint border-b border-dashed"></span>
<span>WRF-Chem (±18 CI)</span>
</div>
</div>

<div className="relative w-full h-40 bg-surface-container-low/40 rounded-xl p-2 flex flex-col justify-between overflow-hidden">

<div className="absolute inset-0 flex flex-col justify-between px-3 py-4 pointer-events-none opacity-40">
<div className="w-full border-b border-error/40 flex justify-between">
<span className="font-telemetry-meta text-[9px] text-error -mt-3.5">400 (Severe)</span>
</div>
<div className="w-full border-b border-error/20 flex justify-between">
<span className="font-telemetry-meta text-[9px] text-error -mt-3.5">300 (Very Poor)</span>
</div>
<div className="w-full border-b border-secondary flex justify-between">
<span className="font-telemetry-meta text-[9px] text-secondary -mt-3.5">200 (Moderate)</span>
</div>
</div>
<svg className="w-full h-full overflow-visible z-10" preserveAspectRatio="none" viewBox="0 0 340 120">
<defs>
<lineargradient id="observedGrad" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stopColor="#006a61" stopOpacity="0.35" />
<stop offset="100%" stopColor="#006a61" stopOpacity="0.0" />
</lineargradient>
<lineargradient id="forecastGrad" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stopColor="#ba1a1a" stopOpacity="0.25" />
<stop offset="100%" stopColor="#ba1a1a" stopOpacity="0.0" />
</lineargradient>
</defs>

<polygon fill="#d3e4fe" opacity="0.45" points="170,55 210,40 250,30 290,48 330,35 330,75 290,82 250,68 210,72 170,55" />

<polygon fill="url(#observedGrad)" points="10,80 50,75 90,65 130,68 170,55 170,115 10,115" />

<polygon fill="url(#forecastGrad)" points="170,55 210,54 250,47 290,62 330,52 330,115 170,115" />

<path d="M 10 80 Q 50 75 90 65 T 170 55" fill="none" stroke="#006a61" strokeLinecap="round" strokeWidth="2.5" />

<line stroke="#707974" strokeDasharray="2 2" strokeWidth="1" x1="170" x2="170" y1="10" y2="115" />

<path d="M 170 55 Q 210 54 250 47 T 330 52" fill="none" stroke="#ba1a1a" strokeDasharray="4 3" strokeLinecap="round" strokeWidth="2.5" />

<circle cx="10" cy="80" fill="#006a61" r="3" />
<circle cx="90" cy="65" fill="#006a61" r="3" />
<circle cx="170" cy="55" fill="#ffffff" r="4.5" stroke="#006a61" strokeWidth="2.5" />

<circle cx="250" cy="47" fill="#ffffff" r="4" stroke="#ba1a1a" strokeWidth="2" />
<circle cx="330" cy="52" fill="#ba1a1a" r="3" />
</svg>

<div className="flex justify-between items-center text-on-surface-variant font-telemetry-meta text-[10px] px-1 z-20">
<span>-24h (Yesterday)</span>
<span>-12h</span>
<span className="font-bold text-on-surface bg-surface-container-lowest px-1 rounded shadow-xs">Now (342)</span>
<span>+24h</span>
<span className="text-error font-semibold">+48h Projected</span>
</div>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm space-y-2">
<div className="flex items-center justify-between">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-primary text-[18px]">thermostat</span>
<h3 className="font-label-lg text-label-lg text-on-surface font-semibold">Boundary Layer & Meteorology</h3>
</div>
<span className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">SAFAR Ground Sensors</span>
</div>
<div className="grid grid-cols-4 gap-1.5">

<div className="bg-surface-container-low rounded-lg p-2 text-center flex flex-col justify-between">
<span className="material-symbols-outlined text-secondary text-[16px] mx-auto">device_thermostat</span>
<span className="font-telemetry-num text-[18px] text-on-surface font-bold leading-tight mt-1">19°C</span>
<span className="font-label-sm text-[10px] text-on-surface-variant mt-0.5">Temp</span>
</div>

<div className="bg-surface-container-low rounded-lg p-2 text-center flex flex-col justify-between">
<span className="material-symbols-outlined text-secondary text-[16px] mx-auto">humidity_mid</span>
<span className="font-telemetry-num text-[18px] text-on-surface font-bold leading-tight mt-1">68%</span>
<span className="font-label-sm text-[10px] text-on-surface-variant mt-0.5">Humidity</span>
</div>

<div className="bg-surface-container-low rounded-lg p-2 text-center flex flex-col justify-between">
<span className="material-symbols-outlined text-secondary text-[16px] mx-auto">air</span>
<span className="font-telemetry-num text-[15px] text-on-surface font-bold leading-tight mt-1">4.2 <span className="text-[10px] font-normal">km/h</span></span>
<span className="font-label-sm text-[9px] text-error font-medium truncate mt-0.5">NW Stagnant</span>
</div>

<div className="bg-surface-container-low rounded-lg p-2 text-center flex flex-col justify-between">
<span className="material-symbols-outlined text-error text-[16px] mx-auto">compress</span>
<span className="font-telemetry-num text-[16px] text-error font-bold leading-tight mt-1">380m</span>
<span className="font-label-sm text-[9px] text-error font-medium truncate mt-0.5">Low Ceiling</span>
</div>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm flex items-center gap-3">
<div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
<img className="w-full h-full object-cover" data-alt="Dense atmospheric haze over India Gate Delhi in soft amber morning light, low contrast horizon with high particulate smog dispersion, cinematic photojournalistic documentary style with subtle cool green and teal ambient tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQwy651i0YJvFjWFofqrAPcGld8TKVArAv71g0sMT40NEKPIZgkSiF2UPt9aaHdrz_ibGF_IYXSVcPKVkpYeoui-rkg_di2DzogDtruDT53bbXab-5luYmhccAOnXoS-JPmtEyyK1B8xtuES--DgBRO0Kou43iCb9guRii_4acpNwfnHaF5DoYvtOzlV8GYt3RbWVmYK55-uv-1V37PMCyYVNqxhrTcLDGW29ukJam_eT9LKVWArLa"/>
</div>
<div className="flex flex-col justify-center min-w-0">
<span className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider">Atmospheric Horizon</span>
<p className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">Dense Winter Smog Trap</p>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">Boundary mixing layer collapsed below 400m across National Capital Territory.</p>
</div>
</div>

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
<span>Ground Coverage: <strong className="text-on-surface">38/41 CPCB active</strong></span>
</div>
<div className="flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-surface-tint"></span>
<span>Engine: <strong className="text-on-surface">WRF-Chem + ML post-cal</strong></span>
</div>
</div>
<div className="pt-1 text-center">
<p className="font-telemetry-meta text-[10px] text-on-surface-variant">Illustrative MVP demo calibrated with synthetic CPCB baseline</p>
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
</main><nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_10px_rgba(0,0,0,0.04)]" data-active-classes="text-primary font-bold"><div className="grid grid-cols-6 items-center h-16 px-1"><Link aria-current="page" className="flex flex-col items-center justify-center h-full min-h-[44px] transition-colors text-primary font-bold" data-path="overview" to="/"><span className="material-symbols-outlined text-[22px]">dashboard</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Overview</span></Link><Link className="flex flex-col items-center justify-center h-full min-h-[44px] text-on-surface-variant hover:text-on-surface transition-colors" data-path="stations" to="/live"><span className="material-symbols-outlined text-[22px]">sensors</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Stations</span></Link><Link className="flex flex-col items-center justify-center h-full min-h-[44px] text-on-surface-variant hover:text-on-surface transition-colors" data-path="forecast" to="/forecast"><span className="material-symbols-outlined text-[22px]">cyclone</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Forecast</span></Link><Link className="flex flex-col items-center justify-center h-full min-h-[44px] text-on-surface-variant hover:text-on-surface transition-colors" data-path="attribution" to="/sources"><span className="material-symbols-outlined text-[22px]">neurology</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Attribution</span></Link><Link className="flex flex-col items-center justify-center h-full min-h-[44px] text-on-surface-variant hover:text-on-surface transition-colors" data-path="advisories" to="/alerts"><span className="material-symbols-outlined text-[22px]">warning</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Advisories</span></Link><Link className="flex flex-col items-center justify-center h-full min-h-[44px] text-on-surface-variant hover:text-on-surface transition-colors" data-path="data-sources" to="/transparency"><span className="material-symbols-outlined text-[22px]">database</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Sources</span></Link></div></nav>
    </>
  );
}
