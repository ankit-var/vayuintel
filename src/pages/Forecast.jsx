
import React from 'react';
import { Link } from 'react-router-dom';

export default function Forecast() {
  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div className="h-20 px-space-md flex flex-col justify-between py-space-xs"><div className="flex items-center justify-between"><div className="flex items-center gap-space-sm"><img alt="Vayu Intelligence Logo" className="h-8 w-auto object-contain" src="/vayu-logo.svg"/><div className="flex flex-col"><div className="flex items-center gap-1.5"><span className="font-headline-sm text-headline-sm text-primary font-bold tracking-tight">Vayu Intel</span><div className="relative flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-secondary"></div><div className="absolute w-3.5 h-3.5 rounded-full bg-secondary-container/40 animate-ping"></div></div></div><span className="font-telemetry-meta text-telemetry-meta text-on-surface-variant flex items-center gap-1">Live Feed: CPCB &amp; OpenAQ</span></div></div><div className="flex items-center gap-space-sm"><div className="relative flex items-center bg-surface-container-low rounded-lg px-2 py-1"><span className="material-symbols-outlined text-[16px] text-secondary mr-1">location_city</span><select className="bg-transparent font-label-sm text-label-sm text-on-surface focus:outline-none appearance-none pr-4 cursor-pointer"><option value="delhi">Delhi NCR</option><option value="bengaluru">Bengaluru</option><option value="patna">Patna</option></select><span className="material-symbols-outlined text-[14px] text-on-surface-variant pointer-events-none absolute right-1">expand_more</span></div><button aria-label="Notifications" className="w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">notifications</span></button><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div><div className="flex items-center justify-between px-0.5"><div className="flex items-center gap-1.5"><span className="font-headline-sm text-headline-sm text-on-surface capitalize">Forecast</span></div><div className="inline-flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-full"><span className="material-symbols-outlined text-[12px] text-secondary">info</span><span className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">Illustrative MVP Demo Data</span></div></div></div></header><main className="flex flex-col relative w-full pt-20 pb-24 bg-surface px-space-md"><div className="flex flex-col w-full gap-space-md">

<div className="flex items-center gap-space-xs overflow-x-auto pb-1 no-scrollbar">
<button className="bg-primary text-on-primary font-label-md text-label-md px-3.5 py-2 rounded-full whitespace-nowrap shadow-sm flex items-center gap-1.5 transition-transform active:scale-95">
<span className="material-symbols-outlined text-[15px]" style={{"fontVariationSettings":"'FILL' 1"}}>auto_graph</span>
      48 Hours (Recommended)
    </button>
<button className="bg-surface-container text-on-surface-variant hover:text-on-surface font-label-md text-label-md px-3 py-2 rounded-full whitespace-nowrap transition-colors">
      24 Hours
    </button>
<button className="bg-surface-container text-on-surface-variant hover:text-on-surface font-label-md text-label-md px-3 py-2 rounded-full whitespace-nowrap transition-colors">
      72h Outlook
    </button>
</div>

<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden">
<div className="absolute -right-10 -bottom-10 w-40 h-40 bg-error-container/20 rounded-full blur-2xl pointer-events-none"></div>
<div className="flex items-center justify-between mb-3">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-secondary text-[18px]">crisis_alert</span>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Predictive Peak Trajectory</span>
</div>
<span className="bg-error text-on-error font-telemetry-meta text-telemetry-meta font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest animate-ping"></span>
        CPCB SEVERE
      </span>
</div>
<div className="flex items-baseline gap-2 mb-1">
<span className="font-telemetry-num text-[38px] leading-none text-on-surface font-bold tracking-tight">418</span>
<span className="font-label-md text-label-md text-error font-semibold">AQI Peak</span>
<span className="font-body-sm text-body-sm text-on-surface-variant ml-auto text-right">Tomorrow, 06:30 AM</span>
</div>

<div className="bg-surface-container-low rounded-lg p-space-sm mt-3 flex items-start gap-2.5">
<span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">cyclone</span>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface font-semibold">Primary Trigger Factor</span>
<span className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
          Nighttime thermal inversion trap combined with stagnant calm surface winds (&lt;3 km/h NW).
        </span>
</div>
</div>

<div className="mt-3.5 pt-3 flex flex-col gap-1.5">
<div className="flex justify-between items-center text-on-surface-variant font-telemetry-meta text-telemetry-meta">
<span className="flex items-center gap-1 text-on-surface">
<span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
          High Confidence (88% Next 18h)
        </span>
<span>Moderate (64% 24–48h)</span>
</div>
<div className="w-full bg-surface-container h-2 rounded-full overflow-hidden flex">
<div className="bg-secondary h-full rounded-l-full" style={{"width":"60%"}}></div>
<div className="bg-secondary-container h-full rounded-r-full" style={{"width":"40%"}}></div>
</div>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-3">
<div className="flex items-center justify-between">
<div className="flex flex-col">
<span className="font-headline-sm text-headline-sm text-on-surface font-bold">Dispersion Trajectory</span>
<span className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">Past 12h Observed vs. 48h Ensemble</span>
</div>
<div className="flex items-center gap-2 font-telemetry-meta text-[10px]">
<div className="flex items-center gap-1">
<span className="w-2.5 h-0.5 bg-primary rounded-full"></span>
<span className="text-on-surface-variant">Observed</span>
</div>
<div className="flex items-center gap-1">
<span className="w-2.5 h-0.5 bg-error border-b border-dashed border-error"></span>
<span className="text-on-surface-variant">Ensemble</span>
</div>
</div>
</div>

<div className="relative w-full overflow-hidden rounded-lg bg-surface-container-low p-2">

<div className="flex justify-between items-center px-1 font-telemetry-meta text-telemetry-meta text-on-surface-variant">
<span>AQI 500 max</span>
<span className="bg-surface-container px-1.5 py-0.5 rounded text-[10px] text-error">Uncertainty: ±20 AQI</span>
</div>
<svg className="w-full h-44 overflow-visible my-1" preserveAspectRatio="none" viewBox="0 0 360 170">
<defs>
<lineargradient id="uncertaintyGradient" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stopColor="#ba1a1a" stopOpacity="0.28" />
<stop offset="60%" stopColor="#006a61" stopOpacity="0.12" />
<stop offset="100%" stopColor="#006a61" stopOpacity="0.02" />
</lineargradient>
<lineargradient id="forecastLineGrad" x1="0" x2="1" y1="0" y2="0">
<stop offset="0%" stopColor="#006a61" />
<stop offset="28%" stopColor="#ba1a1a" />
<stop offset="65%" stopColor="#d97706" />
<stop offset="100%" stopColor="#006a61" />
</lineargradient>
</defs>

<line stroke="#d3e4fe" strokeDasharray="2 3" strokeWidth="0.7" x1="10" x2="350" y1="30" y2="30" />
<text fill="#ba1a1a" font-family="JetBrains Mono" font-size="7" x="12" y="27">400 Severe</text>
<line stroke="#d3e4fe" strokeDasharray="2 3" strokeWidth="0.7" x1="10" x2="350" y1="75" y2="75" />
<text fill="#707974" font-family="JetBrains Mono" font-size="7" x="12" y="72">300 Very Poor</text>
<line stroke="#d3e4fe" strokeDasharray="2 3" strokeWidth="0.7" x1="10" x2="350" y1="120" y2="120" />
<text fill="#707974" font-family="JetBrains Mono" font-size="7" x="12" y="117">200 Moderate</text>

<polygon fill="url(#uncertaintyGradient)" points="
          90,62
          130,52
          175,20
          230,80
          290,64
          350,90
          350,116
          290,88
          230,105
          175,38
          130,68
          90,62
        " />

<path d="M 15,95 C 40,88 65,74 90,62" fill="none" stroke="#003527" strokeLinecap="round" strokeWidth="2.6" />

<circle cx="15" cy="95" fill="#003527" r="2.5" />
<circle cx="50" cy="82" fill="#003527" r="2" />

<line stroke="#006a61" strokeDasharray="3 2" strokeWidth="1.2" x1="90" x2="90" y1="12" y2="145" />

<path d="M 90,62 C 115,58 145,28 175,28 C 205,28 215,92 245,92 C 275,92 285,76 315,76 C 335,76 345,102 350,102" fill="none" stroke="url(#forecastLineGrad)" strokeDasharray="4 3" strokeLinecap="round" strokeWidth="2.4" />


<circle cx="90" cy="62" fill="#006a61" r="4.5" stroke="#ffffff" strokeWidth="1.8" />

<circle cx="175" cy="28" fill="#ba1a1a" r="4.5" stroke="#ffffff" strokeWidth="1.8" />

<circle cx="245" cy="92" fill="#006a61" r="3.5" stroke="#ffffff" strokeWidth="1.5" />

<circle cx="350" cy="102" fill="#006a61" r="3.5" stroke="#ffffff" strokeWidth="1.5" />
</svg>

<div className="grid grid-cols-5 text-center font-telemetry-meta text-[9px] text-on-surface-variant pt-1 border-t border-surface-container">
<div className="text-left font-semibold text-primary">NOW<br/><span className="text-[8px]">14:30 (342)</span></div>
<div>+6h<br/><span className="text-[8px]">20:00 (365)</span></div>
<div className="font-bold text-error">PEAK +16h<br/><span className="text-[8px]">06:00 (418)</span></div>
<div>+24h<br/><span className="text-[8px]">14:00 (295)</span></div>
<div className="text-right">+48h<br/><span className="text-[8px]">Day 2 (280)</span></div>
</div>
</div>

<div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm px-1">
<span className="flex items-center gap-1 text-secondary">
<span className="material-symbols-outlined text-[16px]">touch_app</span>
        Ensemble upper-limit bound: 435 AQI
      </span>
<span className="font-telemetry-meta text-telemetry-meta">Lower bound: 395 AQI</span>
</div>
</div>

<div className="flex flex-col gap-2">
<div className="flex items-center justify-between px-0.5">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-secondary text-[18px]">view_timeline</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">4-Hour Predictive Breakdown</h3>
</div>
<span className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">Swipe horizontally</span>
</div>
<div className="flex gap-space-sm overflow-x-auto pb-2 no-scrollbar -mx-space-md px-space-md">

<div className="bg-surface-container-lowest min-w-[145px] p-3 rounded-xl shadow-sm flex flex-col justify-between shrink-0">
<div className="flex justify-between items-start mb-2">
<span className="font-label-sm text-label-sm text-on-surface font-semibold">Tonight 20:00</span>
<span className="font-telemetry-meta text-[10px] text-on-surface-variant">+6h</span>
</div>
<div className="flex items-baseline gap-1 my-1">
<span className="font-telemetry-num text-headline-md text-on-surface font-bold">365</span>
<span className="font-label-sm text-[10px] text-error font-medium">Very Poor</span>
</div>
<div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-surface-container text-on-surface-variant font-body-sm text-[11px]">
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[14px] text-secondary">foggy</span>
<span>Hazy Smog</span>
</div>
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">air</span>
<span>3.8 km/h NW</span>
</div>
<div className="bg-surface-container px-1.5 py-0.5 rounded text-[10px] text-error font-medium text-center">
            Dispersion: Poor
          </div>
</div>
</div>

<div className="bg-error-container/40 min-w-[155px] p-3 rounded-xl shadow-sm flex flex-col justify-between shrink-0 relative overflow-hidden">
<div className="absolute top-0 right-0 bg-error text-on-error font-telemetry-meta text-[9px] px-1.5 py-0.5 rounded-bl font-bold">
          PEAK
        </div>
<div className="flex justify-between items-start mb-2">
<span className="font-label-sm text-label-sm text-on-error-container font-bold">Dawn 06:00</span>
<span className="font-telemetry-meta text-[10px] text-error mr-6">+16h</span>
</div>
<div className="flex items-baseline gap-1 my-1">
<span className="font-telemetry-num text-headline-md text-error font-extrabold">418</span>
<span className="font-label-sm text-[10px] text-on-error-container font-bold">Severe</span>
</div>
<div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-error/20 text-on-error-container font-body-sm text-[11px]">
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[14px] text-error">lens_blur</span>
<span className="font-medium">Dense Inversion</span>
</div>
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">air</span>
<span>1.8 km/h Calm</span>
</div>
<div className="bg-error text-on-error px-1.5 py-0.5 rounded text-[10px] font-bold text-center">
            Dispersion: V. Poor
          </div>
</div>
</div>

<div className="bg-surface-container-lowest min-w-[145px] p-3 rounded-xl shadow-sm flex flex-col justify-between shrink-0">
<div className="flex justify-between items-start mb-2">
<span className="font-label-sm text-label-sm text-on-surface font-semibold">Midday 14:00</span>
<span className="font-telemetry-meta text-[10px] text-on-surface-variant">+24h</span>
</div>
<div className="flex items-baseline gap-1 my-1">
<span className="font-telemetry-num text-headline-md text-on-surface font-bold">295</span>
<span className="font-label-sm text-[10px] text-secondary font-medium">Poor</span>
</div>
<div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-surface-container text-on-surface-variant font-body-sm text-[11px]">
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[14px] text-secondary">wb_sunny</span>
<span>Solar Mixing</span>
</div>
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">air</span>
<span>8.4 km/h WNW</span>
</div>
<div className="bg-surface-container px-1.5 py-0.5 rounded text-[10px] text-secondary font-medium text-center">
            Dispersion: Fair
          </div>
</div>
</div>

<div className="bg-surface-container-lowest min-w-[145px] p-3 rounded-xl shadow-sm flex flex-col justify-between shrink-0">
<div className="flex justify-between items-start mb-2">
<span className="font-label-sm text-label-sm text-on-surface font-semibold">Night 02:00</span>
<span className="font-telemetry-meta text-[10px] text-on-surface-variant">+36h</span>
</div>
<div className="flex items-baseline gap-1 my-1">
<span className="font-telemetry-num text-headline-md text-on-surface font-bold">340</span>
<span className="font-label-sm text-[10px] text-error font-medium">Very Poor</span>
</div>
<div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-surface-container text-on-surface-variant font-body-sm text-[11px]">
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[14px] text-secondary">cloud</span>
<span>Low Mixing</span>
</div>
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">air</span>
<span>3.1 km/h NW</span>
</div>
<div className="bg-surface-container px-1.5 py-0.5 rounded text-[10px] text-error font-medium text-center">
            Dispersion: Poor
          </div>
</div>
</div>

<div className="bg-surface-container-lowest min-w-[145px] p-3 rounded-xl shadow-sm flex flex-col justify-between shrink-0">
<div className="flex justify-between items-start mb-2">
<span className="font-label-sm text-label-sm text-on-surface font-semibold">Day 2 14:00</span>
<span className="font-telemetry-meta text-[10px] text-on-surface-variant">+48h</span>
</div>
<div className="flex items-baseline gap-1 my-1">
<span className="font-telemetry-num text-headline-md text-on-surface font-bold">280</span>
<span className="font-label-sm text-[10px] text-secondary font-medium">Poor</span>
</div>
<div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-surface-container text-on-surface-variant font-body-sm text-[11px]">
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[14px] text-secondary">air</span>
<span>Breezy Clear</span>
</div>
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">air</span>
<span>10.2 km/h W</span>
</div>
<div className="bg-surface-container px-1.5 py-0.5 rounded text-[10px] text-secondary font-medium text-center">
            Dispersion: Fair
          </div>
</div>
</div>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-3">
<div className="flex items-center justify-between">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-secondary text-[18px]">thermostat</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Meteorological Drivers</h3>
</div>
<span className="bg-surface-container-low font-telemetry-meta text-telemetry-meta text-on-surface-variant px-2 py-0.5 rounded-full">
        Synoptic WRF Sync
      </span>
</div>

<div className="bg-surface-container-low rounded-lg p-3 flex items-start gap-3">
<div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center shrink-0 text-secondary">
<span className="material-symbols-outlined text-[20px]">air</span>
</div>
<div className="flex flex-col flex-1">
<div className="flex justify-between items-center mb-0.5">
<span className="font-label-md text-label-md text-on-surface font-semibold">Surface Wind Speed</span>
<span className="font-telemetry-num text-label-md text-error font-bold">2.1 km/h NW</span>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
          Decouples after midnight, inducing severe localized pollutant accumulation and zero horizontal advection.
        </span>
</div>
</div>

<div className="bg-surface-container-low rounded-lg p-3 flex items-start gap-3">
<div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center shrink-0 text-error">
<span className="material-symbols-outlined text-[20px]">layers</span>
</div>
<div className="flex flex-col flex-1">
<div className="flex justify-between items-center mb-0.5">
<span className="font-label-md text-label-md text-on-surface font-semibold">Thermal Inversion Cap</span>
<span className="font-telemetry-meta text-telemetry-meta text-error font-bold">03:00 – 08:00 AM</span>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
          8°C ground temp vs 14°C aloft creates a rigid ceiling, trapping emissions within the breathing zone.
        </span>
</div>
</div>

<div className="bg-surface-container-low rounded-lg p-3 flex items-start gap-3">
<div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center shrink-0 text-secondary">
<span className="material-symbols-outlined text-[20px]">vertical_align_bottom</span>
</div>
<div className="flex flex-col flex-1">
<div className="flex justify-between items-center mb-0.5">
<span className="font-label-md text-label-md text-on-surface font-semibold">Boundary Layer (PBL)</span>
<span className="font-telemetry-num text-label-md text-on-surface font-bold">180m Altitude</span>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
          Ventilation column compresses by 72% relative to afternoon norms, critically concentrating ambient particulate matter.
        </span>
</div>
</div>
</div>

<div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-2.5">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[20px]">model_training</span>
<span className="font-headline-sm text-headline-sm text-on-surface font-bold">Model Validation &amp; Telemetry</span>
</div>
<div className="flex flex-col gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
<div className="flex justify-between items-center py-1 border-b border-surface-container">
<span>Model Architecture</span>
<span className="font-telemetry-meta text-telemetry-meta font-medium text-on-surface text-right">
          Vayu-WRF Ensemble v2.1
        </span>
</div>
<div className="flex justify-between items-center py-1 border-b border-surface-container">
<span>Calibration Network</span>
<span className="font-telemetry-meta text-telemetry-meta text-on-surface">38 CPCB Monitoring Nodes</span>
</div>
<div className="flex justify-between items-center py-1 border-b border-surface-container">
<span>Historical Accuracy</span>
<span className="font-telemetry-meta text-telemetry-meta text-secondary font-semibold">MAE ±14.2 AQI (24h)</span>
</div>
</div>

<div className="bg-surface-container rounded-lg p-2.5 flex items-start gap-2 mt-1">
<span className="material-symbols-outlined text-on-surface-variant text-[16px] shrink-0 mt-0.5">info</span>
<p className="font-body-sm text-[11px] text-on-surface-variant leading-relaxed">
<strong>Scientific MVP Notice:</strong> Demo forecast generated via numerical meteorological assimilation models. This advisory is optimized for civic planning insights and is not a statutory legal alert.
      </p>
</div>
</div>
</div></main><nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_10px_rgba(0,0,0,0.04)]" data-active-classes="text-primary font-bold"><div className="grid grid-cols-6 items-center h-16 px-1"><Link className="flex flex-col items-center justify-center h-full min-h-[44px] text-on-surface-variant hover:text-on-surface transition-colors" data-path="overview" to="/"><span className="material-symbols-outlined text-[22px]">dashboard</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Overview</span></Link><Link className="flex flex-col items-center justify-center h-full min-h-[44px] text-on-surface-variant hover:text-on-surface transition-colors" data-path="stations" to="/live"><span className="material-symbols-outlined text-[22px]">sensors</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Stations</span></Link><Link aria-current="page" className="flex flex-col items-center justify-center h-full min-h-[44px] transition-colors text-primary font-bold" data-path="forecast" to="/forecast"><span className="material-symbols-outlined text-[22px]">cyclone</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Forecast</span></Link><Link className="flex flex-col items-center justify-center h-full min-h-[44px] text-on-surface-variant hover:text-on-surface transition-colors" data-path="attribution" to="/sources"><span className="material-symbols-outlined text-[22px]">neurology</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Attribution</span></Link><Link className="flex flex-col items-center justify-center h-full min-h-[44px] text-on-surface-variant hover:text-on-surface transition-colors" data-path="advisories" to="/alerts"><span className="material-symbols-outlined text-[22px]">warning</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Advisories</span></Link><Link className="flex flex-col items-center justify-center h-full min-h-[44px] text-on-surface-variant hover:text-on-surface transition-colors" data-path="data-sources" to="/transparency"><span className="material-symbols-outlined text-[22px]">database</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Sources</span></Link></div></nav>
    </>
  );
}
