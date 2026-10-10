
import React from 'react';
import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import LiveWeatherBar from '../components/LiveWeatherBar';
import ObservationsTable from '../components/ObservationsTable';

export default function LiveTelemetry() {
  return (
    <>
      <AppHeader pageTitle="Stations" />
      <main className="flex flex-col relative w-full pt-20 pb-24 bg-surface px-space-md"><div className="flex flex-col w-full pb-6 space-y-4">

      {/* Live weather & sensor data */}
      <LiveWeatherBar />
      <div className="flex flex-col space-y-1.5">
        <span className="font-headline-sm text-headline-sm text-on-surface">Live OpenAQ Sensor Readings</span>
        <ObservationsTable />
      </div>

<div className="w-full bg-surface-container rounded-xl p-3 shadow-sm flex items-center justify-between">
<div className="flex items-center gap-2.5 min-w-0">
<div className="relative flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-surface-container-lowest text-primary">
<span className="material-symbols-outlined text-[18px]">cell_tower</span>
<span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-secondary-fixed-dim border-2 border-surface"></span>
</div>
<div className="flex flex-col min-w-0">
<div className="flex items-center gap-1.5">
<span className="font-headline-sm text-label-md text-on-surface font-bold truncate">Delhi NCR Network</span>
<span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
</div>
<p className="font-telemetry-meta text-telemetry-meta text-on-surface-variant truncate">38 Active Monitors · 3 Stale/Offline</p>
</div>
</div>
<div className="flex items-center gap-1 bg-surface-container-lowest px-2 py-1 rounded-full shadow-sm flex-shrink-0">
<span className="material-symbols-outlined text-[13px] text-secondary">sync</span>
<span className="font-telemetry-meta text-[10px] text-on-surface-variant">Live Sync</span>
</div>
</div>

<div className="flex flex-col space-y-2">

<div className="relative w-full">
<span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">search</span>
<input className="w-full h-10 pl-9 pr-8 bg-surface-container-lowest rounded-lg font-body-md text-body-sm text-on-surface placeholder:text-outline-variant shadow-sm focus:outline-none focus:bg-surface-container-low transition-colors" id="station-search" placeholder="Search station by name, ward, landmark..." type="text"/>
<button aria-label="Clear Search" className="material-symbols-outlined absolute right-2.5 top-2.5 text-on-surface-variant text-[18px] hover:text-primary transition-colors">tune</button>
</div>

<div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-space-md px-space-md no-scrollbar">
<button className="filter-pill active flex-shrink-0 h-7 px-3 rounded-full bg-primary text-on-primary font-label-sm text-label-sm shadow-sm flex items-center gap-1 transition-all" data-filter="all">
<span>All Stations</span>
<span className="font-telemetry-meta text-[10px] bg-primary-container px-1 rounded-full text-on-primary-container">41</span>
</button>
<button className="filter-pill flex-shrink-0 h-7 px-3 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm shadow-sm flex items-center gap-1 hover:bg-surface-container-high transition-all" data-filter="severe">
<span className="w-2 h-2 rounded-full bg-error"></span>
<span>Severe &gt;400</span>
<span className="font-telemetry-meta text-[10px] bg-error-container text-on-error-container px-1 rounded-full">5</span>
</button>
<button className="filter-pill flex-shrink-0 h-7 px-3 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm shadow-sm flex items-center gap-1 hover:bg-surface-container-high transition-all" data-filter="very-poor">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span>Very Poor 301-400</span>
<span className="font-telemetry-meta text-[10px] bg-surface-container-high px-1 rounded-full text-on-surface-variant">18</span>
</button>
<button className="filter-pill flex-shrink-0 h-7 px-3 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm shadow-sm flex items-center gap-1 hover:bg-surface-container-high transition-all" data-filter="pm25">
<span className="material-symbols-outlined text-[13px]">grain</span>
<span>PM2.5 Dominant</span>
</button>
<button className="filter-pill flex-shrink-0 h-7 px-3 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm shadow-sm flex items-center gap-1 hover:bg-surface-container-high transition-all" data-filter="near">
<span className="material-symbols-outlined text-[13px] text-secondary">near_me</span>
<span>Near Me</span>
</button>
</div>
</div>

<div className="flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
<div className="p-3 flex items-center justify-between bg-surface-container-low">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[18px] text-primary">map</span>
<span className="font-headline-sm text-label-md text-on-surface font-semibold">Geospatial Sensor Grid</span>
</div>
<span className="font-telemetry-meta text-[10px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">Layer: CAAQMS Grid</span>
</div>

<div className="relative w-full h-44 bg-surface-container-high overflow-hidden" data-alt="Stylized top-down satellite GIS mapping visual showing the urban terrain of Delhi NCR with clean topographic contour lines, soft botanical teal hues, and glowing sensor nodes mapped across districts." data-location="Delhi, India" style={{"backgroundImage":"url('https://lh3.googleusercontent.com/aida-public/AB6AXuA7Mtgh4Cz7YdjVwheBz2OpszucmBt588OUHvYHpPSrkbSbvEhEoDJEAWZcdHYfZ2lGi8DpftxmnL9U1_7YlOu2DWYtlD0iuHW2oqfDFqMYol7uIfy_EimUsVqir3dHiq8V7-Iaz1dcZ5Ug6rK6EW1TWgD1zcvBkzeTKaHV4PyM14hJCLkkr-xgcob0iugmjJi50dVxQ7qWdKIYcNjIUpXgLZkTVmVsDeTLveRxYyhnEZMQGeaBl8iX')"}}>

<div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-black/20"></div>

<button aria-label="Anand Vihar Pin" className="station-pin absolute top-10 right-10 flex flex-col items-center group transform transition-transform hover:scale-110 focus:outline-none" data-station="anand-vihar">
<div className="relative flex items-center justify-center">
<div className="absolute w-8 h-8 rounded-full bg-error/30 animate-ping"></div>
<div className="w-6 h-6 rounded-full bg-error text-on-error flex items-center justify-center shadow-md font-telemetry-num text-[11px] font-bold">
            422
          </div>
</div>
<div className="bg-inverse-surface text-inverse-on-surface px-1.5 py-0.5 rounded text-[9px] font-label-sm mt-0.5 shadow whitespace-nowrap">
          Anand Vihar (Selected)
        </div>
</button>

<button aria-label="Jahangirpuri Pin" className="station-pin absolute top-6 left-16 flex flex-col items-center group transform transition-transform hover:scale-110 focus:outline-none" data-station="jahangirpuri">
<div className="w-5 h-5 rounded-full bg-error text-on-error flex items-center justify-center shadow font-telemetry-num text-[10px] font-bold">
          415
        </div>
<div className="bg-surface-container-lowest/90 text-on-surface px-1 py-0.2 rounded text-[8px] font-label-sm shadow mt-0.5 whitespace-nowrap">
          Jahangirpuri
        </div>
</button>

<button aria-label="ITO Pin" className="station-pin absolute top-20 left-28 flex flex-col items-center group transform transition-transform hover:scale-110 focus:outline-none" data-station="ito">
<div className="w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow font-telemetry-num text-[10px] font-bold">
          356
        </div>
<div className="bg-surface-container-lowest/90 text-on-surface px-1 py-0.2 rounded text-[8px] font-label-sm shadow mt-0.5 whitespace-nowrap">
          ITO
        </div>
</button>

<button aria-label="Lodhi Road Pin" className="station-pin absolute bottom-6 right-24 flex flex-col items-center group transform transition-transform hover:scale-110 focus:outline-none" data-station="lodhi">
<div className="w-5 h-5 rounded-full bg-surface-tint text-on-primary flex items-center justify-center shadow font-telemetry-num text-[10px] font-bold">
          195
        </div>
<div className="bg-surface-container-lowest/90 text-on-surface px-1 py-0.2 rounded text-[8px] font-label-sm shadow mt-0.5 whitespace-nowrap">
          Lodhi Rd
        </div>
</button>

<button aria-label="Narela Pin Offline" className="station-pin absolute top-3 left-4 flex flex-col items-center group opacity-80 hover:opacity-100" data-station="narela">
<div className="w-4 h-4 rounded-full bg-outline-variant text-on-surface flex items-center justify-center shadow font-telemetry-num text-[9px] font-bold">
          !
        </div>
<div className="bg-surface-container-lowest/90 text-error px-1 py-0.2 rounded text-[8px] font-label-sm shadow mt-0.5 whitespace-nowrap">
          Narela (Stale)
        </div>
</button>

<div className="absolute bottom-2 left-2 bg-surface-container-lowest/95 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm flex items-center gap-2">
<div className="flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-error"></span>
<span className="font-telemetry-meta text-[9px] text-on-surface-variant">Severe &gt;400</span>
</div>
<div className="flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="font-telemetry-meta text-[9px] text-on-surface-variant">Very Poor &gt;300</span>
</div>
<div className="flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-surface-tint"></span>
<span className="font-telemetry-meta text-[9px] text-on-surface-variant">Mod &lt;200</span>
</div>
</div>
</div>

<div className="p-2.5 bg-surface-container-low flex items-start gap-2">
<span className="material-symbols-outlined text-[16px] text-secondary flex-shrink-0 mt-0.5">radar</span>
<p className="font-body-sm text-body-sm text-on-surface-variant">
<span className="font-semibold text-on-surface">Spatial Coverage Notice:</span> High density in Central/South Delhi; Sparse sensor coverage in Outer North &amp; Najafgarh (<span className="text-error font-medium">Model uncertainty elevated ±14%</span>).
      </p>
</div>
</div>

<div className="flex flex-col bg-surface-container-lowest rounded-xl p-4 shadow-sm relative overflow-hidden">
<div className="flex items-start justify-between">
<div className="flex flex-col min-w-0 pr-2">
<div className="flex items-center gap-1.5 mb-0.5">
<span className="font-label-sm text-[10px] uppercase tracking-wider text-primary font-bold bg-primary-fixed px-1.5 py-0.5 rounded">Featured CAAQMS</span>
<span className="font-telemetry-meta text-[11px] text-on-surface-variant">ID: DL-AV-01</span>
</div>
<h2 className="font-headline-md text-headline-sm text-on-surface font-bold truncate">Anand Vihar, Delhi</h2>
<div className="flex items-center gap-1.5 mt-0.5">
<span className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">CPCB Ref Station</span>
<span className="text-on-surface-variant">·</span>
<span className="font-telemetry-meta text-telemetry-meta text-on-surface-variant flex items-center gap-0.5">
<span className="material-symbols-outlined text-[12px] text-secondary">schedule</span> Updated 8m ago (14:30 IST)
          </span>
</div>
</div>

<div className="flex flex-col items-end flex-shrink-0">
<div className="relative flex items-center gap-1.5 bg-error-container text-on-error-container px-3 py-1.5 rounded-xl shadow-sm">
<span className="relative flex h-2.5 w-2.5">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
<span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-error"></span>
</span>
<div className="flex flex-col items-end">
<span className="font-telemetry-num text-telemetry-num font-bold leading-none">422</span>
<span className="font-label-sm text-[10px] font-bold uppercase tracking-wider">Severe</span>
</div>
</div>
<span className="font-telemetry-meta text-[10px] text-on-surface-variant mt-1">Prompt Action Req.</span>
</div>
</div>

<div className="mt-4 pt-3 bg-surface-container-low rounded-lg p-2.5">
<div className="flex items-center justify-between mb-1.5">
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[14px] text-secondary">show_chart</span>
<span className="font-label-sm text-[11px] font-semibold text-on-surface">12-Hour Intraday Trend (AQI)</span>
</div>
<span className="font-telemetry-meta text-[10px] text-error font-semibold flex items-center gap-0.5">
<span className="material-symbols-outlined text-[12px]">north</span> Peak 486 at 07:00
        </span>
</div>

<div className="w-full h-14 relative flex items-end">
<svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 60">
<defs>
<lineargradient id="anandViharGrad" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stopColor="#ba1a1a" stopOpacity="0.25" />
<stop offset="100%" stopColor="#ba1a1a" stopOpacity="0.0" />
</lineargradient>
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
<span>Now (14:30)</span>
</div>
</div>

<div className="mt-4">
<div className="flex items-center justify-between mb-2">
<span className="font-label-sm text-label-sm text-on-surface font-semibold">Real-Time Chemical Breakdown</span>
<span className="font-telemetry-meta text-[10px] text-on-surface-variant">±3.8% CAAQMS Calibrated</span>
</div>
<div className="grid grid-cols-2 gap-2">

<div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="font-telemetry-meta text-label-sm font-bold text-on-surface">PM2.5</span>
<span className="font-telemetry-meta text-[10px] text-error font-semibold">4.7x 24h Std</span>
</div>
<div className="flex items-baseline gap-1 mt-1">
<span className="font-telemetry-num text-[22px] font-bold text-error leading-tight">284</span>
<span className="font-telemetry-meta text-[10px] text-on-surface-variant">µg/m³</span>
</div>
<div className="w-full bg-surface-container-highest rounded-full h-1 mt-1.5 overflow-hidden">
<div className="bg-error h-full rounded-full" style={{"width":"95%"}}></div>
</div>
</div>

<div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="font-telemetry-meta text-label-sm font-bold text-on-surface">PM10</span>
<span className="font-telemetry-meta text-[10px] text-error font-semibold">4.5x Std</span>
</div>
<div className="flex items-baseline gap-1 mt-1">
<span className="font-telemetry-num text-[22px] font-bold text-error leading-tight">452</span>
<span className="font-telemetry-meta text-[10px] text-on-surface-variant">µg/m³</span>
</div>
<div className="w-full bg-surface-container-highest rounded-full h-1 mt-1.5 overflow-hidden">
<div className="bg-error h-full rounded-full" style={{"width":"90%"}}></div>
</div>
</div>

<div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="font-telemetry-meta text-label-sm font-bold text-on-surface">NO2</span>
<span className="font-telemetry-meta text-[10px] text-secondary font-medium">Moderate</span>
</div>
<div className="flex items-baseline gap-1 mt-1">
<span className="font-telemetry-num text-[20px] font-bold text-on-surface leading-tight">88</span>
<span className="font-telemetry-meta text-[10px] text-on-surface-variant">µg/m³</span>
</div>
<div className="w-full bg-surface-container-highest rounded-full h-1 mt-1.5 overflow-hidden">
<div className="bg-secondary h-full rounded-full" style={{"width":"55%"}}></div>
</div>
</div>

<div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="font-telemetry-meta text-label-sm font-bold text-on-surface">SO2</span>
<span className="font-telemetry-meta text-[10px] text-surface-tint font-medium">Good</span>
</div>
<div className="flex items-baseline gap-1 mt-1">
<span className="font-telemetry-num text-[20px] font-bold text-on-surface leading-tight">24</span>
<span className="font-telemetry-meta text-[10px] text-on-surface-variant">µg/m³</span>
</div>
<div className="w-full bg-surface-container-highest rounded-full h-1 mt-1.5 overflow-hidden">
<div className="bg-surface-tint h-full rounded-full" style={{"width":"28%"}}></div>
</div>
</div>

<div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="font-telemetry-meta text-label-sm font-bold text-on-surface">CO</span>
<span className="font-telemetry-meta text-[10px] text-secondary font-medium">Moderate</span>
</div>
<div className="flex items-baseline gap-1 mt-1">
<span className="font-telemetry-num text-[20px] font-bold text-on-surface leading-tight">2.1</span>
<span className="font-telemetry-meta text-[10px] text-on-surface-variant">mg/m³</span>
</div>
<div className="w-full bg-surface-container-highest rounded-full h-1 mt-1.5 overflow-hidden">
<div className="bg-secondary h-full rounded-full" style={{"width":"50%"}}></div>
</div>
</div>

<div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="font-telemetry-meta text-label-sm font-bold text-on-surface">O3</span>
<span className="font-telemetry-meta text-[10px] text-surface-tint font-medium">Good</span>
</div>
<div className="flex items-baseline gap-1 mt-1">
<span className="font-telemetry-num text-[20px] font-bold text-on-surface leading-tight">42</span>
<span className="font-telemetry-meta text-[10px] text-on-surface-variant">µg/m³</span>
</div>
<div className="w-full bg-surface-container-highest rounded-full h-1 mt-1.5 overflow-hidden">
<div className="bg-surface-tint h-full rounded-full" style={{"width":"32%"}}></div>
</div>
</div>
</div>
</div>
</div>

<div className="flex flex-col space-y-2.5">
<div className="flex items-center justify-between px-1">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-[18px] text-primary">view_list</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Station Directory</h3>
</div>
<span className="font-telemetry-meta text-[11px] text-on-surface-variant">Sorted by Severity</span>
</div>

<div className="station-card bg-surface-container-lowest rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col space-y-2" data-name="ito junction">
<div className="flex items-start justify-between">
<div className="flex flex-col min-w-0 pr-2">
<div className="flex items-center gap-1.5">
<span className="font-headline-sm text-label-lg font-bold text-on-surface truncate">ITO Junction</span>
<span className="w-2 h-2 rounded-full bg-secondary"></span>
</div>
<div className="flex items-center gap-1.5 mt-0.5">
<span className="font-telemetry-meta text-[11px] text-on-surface-variant">DPCC CAAQMS</span>
<span className="text-on-surface-variant">·</span>
<span className="font-telemetry-meta text-[11px] text-secondary">Live 4m ago</span>
</div>
</div>
<div className="flex items-center gap-2 flex-shrink-0">
<div className="flex flex-col items-end">
<span className="font-label-sm text-[10px] font-semibold text-secondary">Very Poor</span>
<div className="flex items-baseline gap-1">
<span className="font-telemetry-meta text-[10px] text-on-surface-variant">PM2.5:</span>
<span className="font-telemetry-num text-label-sm font-semibold text-on-surface">194</span>
</div>
</div>
<div className="w-11 h-11 rounded-lg bg-surface-container flex flex-col items-center justify-center font-telemetry-num text-label-lg font-bold text-on-surface">
            356
          </div>
</div>
</div>
</div>

<div className="station-card bg-surface-container-lowest rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col space-y-2" data-name="rk puram">
<div className="flex items-start justify-between">
<div className="flex flex-col min-w-0 pr-2">
<div className="flex items-center gap-1.5">
<span className="font-headline-sm text-label-lg font-bold text-on-surface truncate">RK Puram</span>
<span className="w-2 h-2 rounded-full bg-secondary"></span>
</div>
<div className="flex items-center gap-1.5 mt-0.5">
<span className="font-telemetry-meta text-[11px] text-on-surface-variant">CPCB Baseline</span>
<span className="text-on-surface-variant">·</span>
<span className="font-telemetry-meta text-[11px] text-secondary">Live 12m ago</span>
</div>
</div>
<div className="flex items-center gap-2 flex-shrink-0">
<div className="flex flex-col items-end">
<span className="font-label-sm text-[10px] font-semibold text-secondary">Very Poor</span>
<div className="flex items-baseline gap-1">
<span className="font-telemetry-meta text-[10px] text-on-surface-variant">PM2.5:</span>
<span className="font-telemetry-num text-label-sm font-semibold text-on-surface">172</span>
</div>
</div>
<div className="w-11 h-11 rounded-lg bg-surface-container flex flex-col items-center justify-center font-telemetry-num text-label-lg font-bold text-on-surface">
            324
          </div>
</div>
</div>
</div>

<div className="station-card bg-surface-container-lowest rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col space-y-2" data-name="jahangirpuri">
<div className="flex items-start justify-between">
<div className="flex flex-col min-w-0 pr-2">
<div className="flex items-center gap-1.5">
<span className="font-headline-sm text-label-lg font-bold text-on-surface truncate">Jahangirpuri</span>
<span className="w-2 h-2 rounded-full bg-error"></span>
</div>
<div className="flex items-center gap-1.5 mt-0.5">
<span className="font-telemetry-meta text-[11px] text-on-surface-variant">DPCC Sensor</span>
<span className="text-on-surface-variant">·</span>
<span className="font-telemetry-meta text-[11px] text-secondary">Live 18m ago</span>
</div>
</div>
<div className="flex items-center gap-2 flex-shrink-0">
<div className="flex flex-col items-end">
<span className="font-label-sm text-[10px] font-bold text-error">Severe</span>
<div className="flex items-baseline gap-1">
<span className="font-telemetry-meta text-[10px] text-on-surface-variant">PM2.5:</span>
<span className="font-telemetry-num text-label-sm font-semibold text-error">278</span>
</div>
</div>
<div className="w-11 h-11 rounded-lg bg-error-container text-on-error-container flex flex-col items-center justify-center font-telemetry-num text-label-lg font-bold">
            415
          </div>
</div>
</div>
</div>

<div className="station-card bg-surface-container rounded-xl p-3 shadow-sm opacity-95 transition-shadow cursor-pointer flex flex-col space-y-2" data-name="narela industrial">
<div className="flex items-start justify-between">
<div className="flex flex-col min-w-0 pr-2">
<div className="flex items-center gap-1.5">
<span className="font-headline-sm text-label-lg font-bold text-on-surface truncate">Narela Industrial</span>
<span className="w-2 h-2 rounded-full bg-outline-variant"></span>
</div>
<div className="flex items-center gap-1 mt-0.5">
<span className="font-telemetry-meta text-[11px] text-error font-medium flex items-center gap-0.5">
<span className="material-symbols-outlined text-[12px]">cloud_off</span> Telemetry Offline (6h ago)
            </span>
</div>
</div>
<div className="flex items-center gap-2 flex-shrink-0">
<div className="flex flex-col items-end">
<span className="font-label-sm text-[10px] text-on-surface-variant">Last Unverified</span>
<div className="flex items-baseline gap-1">
<span className="font-telemetry-meta text-[10px] text-on-surface-variant">PM2.5:</span>
<span className="font-telemetry-num text-label-sm font-semibold text-on-surface-variant">--</span>
</div>
</div>
<div className="w-11 h-11 rounded-lg bg-surface-container-highest text-on-surface-variant flex flex-col items-center justify-center font-telemetry-num text-label-lg font-bold">
            390
          </div>
</div>
</div>

<div className="w-full bg-error-container/60 text-on-error-container p-2 rounded-lg flex items-center gap-2">
<span className="material-symbols-outlined text-[16px] text-error flex-shrink-0">warning</span>
<p className="font-body-sm text-[11px] leading-tight">
<span className="font-semibold">Stale Data Warning:</span> Sensor telemetry packet dropped since 08:30 IST. Model substituting regional atmospheric extrapolation.
        </p>
</div>
</div>

<div className="station-card bg-surface-container-lowest rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col space-y-2" data-name="lodhi road">
<div className="flex items-start justify-between">
<div className="flex flex-col min-w-0 pr-2">
<div className="flex items-center gap-1.5">
<span className="font-headline-sm text-label-lg font-bold text-on-surface truncate">Lodhi Road</span>
<span className="w-2 h-2 rounded-full bg-surface-tint"></span>
</div>
<div className="flex items-center gap-1.5 mt-0.5">
<span className="font-telemetry-meta text-[11px] text-on-surface-variant">IMD SAFAR</span>
<span className="text-on-surface-variant">·</span>
<span className="font-telemetry-meta text-[11px] text-secondary">Live 10m ago</span>
</div>
</div>
<div className="flex items-center gap-2 flex-shrink-0">
<div className="flex flex-col items-end">
<span className="font-label-sm text-[10px] font-semibold text-surface-tint">Moderate</span>
<div className="flex items-baseline gap-1">
<span className="font-telemetry-meta text-[10px] text-on-surface-variant">PM2.5:</span>
<span className="font-telemetry-num text-label-sm font-semibold text-on-surface">68</span>
</div>
</div>
<div className="w-11 h-11 rounded-lg bg-surface-container-low text-on-surface flex flex-col items-center justify-center font-telemetry-num text-label-lg font-bold">
            195
          </div>
</div>
</div>
</div>
</div>

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
<span className="font-telemetry-num text-headline-sm font-bold text-primary">92%</span>
<span className="font-telemetry-meta text-[10px] text-secondary font-medium">Online</span>
</div>
<div className="w-full bg-surface-container-high rounded-full h-1 mt-1 overflow-hidden">
<div className="bg-secondary h-full rounded-full" style={{"width":"92%"}}></div>
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
</main><nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_10px_rgba(0,0,0,0.04)]" data-active-classes="text-primary font-bold"><div className="grid grid-cols-6 items-center h-16 px-1"><Link className="flex flex-col items-center justify-center h-full min-h-[44px] text-on-surface-variant hover:text-on-surface transition-colors" data-path="overview" to="/"><span className="material-symbols-outlined text-[22px]">dashboard</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Overview</span></Link><Link aria-current="page" className="flex flex-col items-center justify-center h-full min-h-[44px] transition-colors text-primary font-bold" data-path="stations" to="/live"><span className="material-symbols-outlined text-[22px]">sensors</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Stations</span></Link><Link className="flex flex-col items-center justify-center h-full min-h-[44px] text-on-surface-variant hover:text-on-surface transition-colors" data-path="forecast" to="/forecast"><span className="material-symbols-outlined text-[22px]">cyclone</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Forecast</span></Link><Link className="flex flex-col items-center justify-center h-full min-h-[44px] text-on-surface-variant hover:text-on-surface transition-colors" data-path="attribution" to="/sources"><span className="material-symbols-outlined text-[22px]">neurology</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Attribution</span></Link><Link className="flex flex-col items-center justify-center h-full min-h-[44px] text-on-surface-variant hover:text-on-surface transition-colors" data-path="advisories" to="/alerts"><span className="material-symbols-outlined text-[22px]">warning</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Advisories</span></Link><Link className="flex flex-col items-center justify-center h-full min-h-[44px] text-on-surface-variant hover:text-on-surface transition-colors" data-path="data-sources" to="/transparency"><span className="material-symbols-outlined text-[22px]">database</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Sources</span></Link></div></nav>
    </>
  );
}
