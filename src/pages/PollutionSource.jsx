
import React from 'react';
import { Link } from 'react-router-dom';

export default function PollutionSource() {
  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div className="h-20 px-space-md flex flex-col justify-between py-space-xs"><div className="flex items-center justify-between"><div className="flex items-center gap-space-sm"><img alt="Vayu Intelligence Logo" className="h-8 w-auto object-contain" src="/vayu-logo.svg"/><div className="flex flex-col"><div className="flex items-center gap-1.5"><span className="font-headline-sm text-headline-sm text-primary font-bold tracking-tight">Vayu Intel</span><div className="relative flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-secondary"></div><div className="absolute w-3.5 h-3.5 rounded-full bg-secondary-container/40 animate-ping"></div></div></div><span className="font-telemetry-meta text-telemetry-meta text-on-surface-variant flex items-center gap-1">Live Feed: CPCB &amp; OpenAQ</span></div></div><div className="flex items-center gap-space-sm"><div className="relative flex items-center bg-surface-container-low rounded-lg px-2 py-1"><span className="material-symbols-outlined text-[16px] text-secondary mr-1">location_city</span><select className="bg-transparent font-label-sm text-label-sm text-on-surface focus:outline-none appearance-none pr-4 cursor-pointer"><option value="delhi">Delhi NCR</option><option value="bengaluru">Bengaluru</option><option value="patna">Patna</option></select><span className="material-symbols-outlined text-[14px] text-on-surface-variant pointer-events-none absolute right-1">expand_more</span></div><button aria-label="Notifications" className="w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">notifications</span></button><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div><div className="flex items-center justify-between px-0.5"><div className="flex items-center gap-1.5"><span className="font-headline-sm text-headline-sm text-on-surface capitalize">Attribution</span></div><div className="inline-flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-full"><span className="material-symbols-outlined text-[12px] text-secondary">info</span><span className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">Illustrative MVP Demo Data</span></div></div></div></header><main className="flex flex-col relative w-full pt-20 pb-24 bg-surface px-space-md"><div className="flex flex-col w-full space-y-space-md">

<div className="flex flex-col gap-1">
<div className="flex items-center gap-2">
<span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container">
<span className="material-symbols-outlined text-[18px]">neurology</span>
</span>
<h2 className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface tracking-tight">Pollution Intelligence &amp; Source Insights</h2>
</div>
<p className="font-body-md text-body-md text-on-surface-variant">Observational facts vs inferred source contributions.</p>
</div>

<div className="rounded-xl p-space-md bg-surface-container-high text-on-surface shadow-sm">
<div className="flex items-start gap-space-sm">
<div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0 text-primary">
<span className="material-symbols-outlined text-[20px]" style={{"fontVariationSettings":"'FILL' 1"}}>balance</span>
</div>
<div className="flex flex-col space-y-1">
<div className="flex items-center gap-1.5">
<span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-bold">CPCB Methodology Integrity</span>
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
</div>
<p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
<strong className="font-semibold text-primary">Important Notice:</strong> Ground stations measure total pollutant concentration. Source attributions below are scientific model approximations using chemical transport models and satellite thermal anomalies — never treated as certified ground truth.
        </p>
</div>
</div>
</div>

<div className="rounded-xl p-space-md bg-surface-container-lowest text-on-surface shadow-sm space-y-space-md">
<div className="flex items-center justify-between">
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Chemical Mass Balance</h3>
<p className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">Model Run: GEOS-Chem • 06:00 IST Composite</p>
</div>
<span className="px-2.5 py-1 rounded-full bg-surface-container font-telemetry-meta text-telemetry-meta text-secondary font-semibold">Simulated Model</span>
</div>

<div className="space-y-2">
<div className="flex justify-between items-center font-label-sm text-label-sm text-on-surface-variant">
<span>Source Contribution Partition</span>
<span className="font-telemetry-meta text-telemetry-meta">100% Attribution Target</span>
</div>
<div className="h-3 w-full rounded-full bg-surface-container overflow-hidden flex shadow-inner">
<div className="bg-primary h-full transition-all duration-500" style={{"width":"34%"}} title="Vehicular: 34%"></div>
<div className="bg-secondary h-full transition-all duration-500" style={{"width":"24%"}} title="Road Dust: 24%"></div>
<div className="bg-surface-tint h-full transition-all duration-500" style={{"width":"18%"}} title="Secondary PM: 18%"></div>
<div className="bg-inverse-surface h-full transition-all duration-500" style={{"width":"14%"}} title="Industrial: 14%"></div>
<div className="bg-error h-full transition-all duration-500" style={{"width":"10%"}} title="Biomass: 10%"></div>
</div>
<div className="flex items-center justify-between pt-0.5 px-0.5 text-on-surface-variant font-telemetry-meta text-[10px]">
<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary inline-block"></span>Trans 34%</span>
<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary inline-block"></span>Dust 24%</span>
<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-surface-tint inline-block"></span>Sec. 18%</span>
<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-inverse-surface inline-block"></span>Ind. 14%</span>
<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-error inline-block"></span>Bio. 10%</span>
</div>
</div>

<div className="space-y-space-sm pt-1">

<div className="p-3 rounded-lg bg-surface-container-low transition-colors hover:bg-surface-container flex flex-col space-y-1.5">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[18px] text-primary">directions_car</span>
<span className="font-label-lg text-label-lg text-on-surface font-semibold">Vehicular &amp; Transport Emissions</span>
</div>
<div className="flex items-baseline gap-1">
<span className="font-telemetry-num text-telemetry-num text-primary">34</span>
<span className="font-label-sm text-label-sm text-primary font-bold">%</span>
</div>
</div>
<div className="flex items-center justify-between">
<span className="font-body-sm text-body-sm text-on-surface-variant">Traffic density telemetry from major arterial corridors</span>
<span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-telemetry-meta text-telemetry-meta font-medium">Confidence: High</span>
</div>
</div>

<div className="p-3 rounded-lg bg-surface-container-low transition-colors hover:bg-surface-container flex flex-col space-y-1.5">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[18px] text-secondary">waves</span>
<span className="font-label-lg text-label-lg text-on-surface font-semibold">Road Dust &amp; Construction Activity</span>
</div>
<div className="flex items-baseline gap-1">
<span className="font-telemetry-num text-telemetry-num text-secondary">24</span>
<span className="font-label-sm text-label-sm text-secondary font-bold">%</span>
</div>
</div>
<div className="flex items-center justify-between">
<span className="font-body-sm text-body-sm text-on-surface-variant">Low surface wind resuspension &amp; micro-debris</span>
<span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-telemetry-meta text-telemetry-meta font-medium">Confidence: Moderate</span>
</div>
</div>

<div className="p-3 rounded-lg bg-surface-container-low transition-colors hover:bg-surface-container flex flex-col space-y-1.5">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[18px] text-surface-tint">science</span>
<span className="font-label-lg text-label-lg text-on-surface font-semibold">Secondary Particulate / Atmospheric Chemistry</span>
</div>
<div className="flex items-baseline gap-1">
<span className="font-telemetry-num text-telemetry-num text-surface-tint">18</span>
<span className="font-label-sm text-label-sm text-surface-tint font-bold">%</span>
</div>
</div>
<div className="flex items-center justify-between">
<span className="font-body-sm text-body-sm text-on-surface-variant">High relative humidity + SO2/NOx photochemical conversion</span>
<span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-telemetry-meta text-telemetry-meta font-medium">Confidence: Moderate</span>
</div>
</div>

<div className="p-3 rounded-lg bg-surface-container-low transition-colors hover:bg-surface-container flex flex-col space-y-1.5">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[18px] text-inverse-surface">factory</span>
<span className="font-label-lg text-label-lg text-on-surface font-semibold">Industrial &amp; Point Generation</span>
</div>
<div className="flex items-baseline gap-1">
<span className="font-telemetry-num text-telemetry-num text-inverse-surface">14</span>
<span className="font-label-sm text-label-sm text-inverse-surface font-bold">%</span>
</div>
</div>
<div className="flex items-center justify-between">
<span className="font-body-sm text-body-sm text-on-surface-variant">Continuous monitoring: Bawana/Narela/NCR perimeter</span>
<span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-telemetry-meta text-telemetry-meta font-medium">Confidence: High</span>
</div>
</div>

<div className="p-3 rounded-lg bg-surface-container-low transition-colors hover:bg-surface-container flex flex-col space-y-1.5">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[18px] text-error">local_fire_department</span>
<span className="font-label-lg text-label-lg text-on-surface font-semibold">Biomass &amp; Open Burning</span>
</div>
<div className="flex items-baseline gap-1">
<span className="font-telemetry-num text-telemetry-num text-error">10</span>
<span className="font-label-sm text-label-sm text-error font-bold">%</span>
</div>
</div>
<div className="flex items-center justify-between">
<span className="font-body-sm text-body-sm text-on-surface-variant">Satellite thermal hotspots: 42 detections in 150km radius</span>
<span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-telemetry-meta text-telemetry-meta font-medium">Confidence: Fair</span>
</div>
</div>
</div>
</div>

<div className="rounded-xl p-space-md bg-surface-container-lowest text-on-surface shadow-sm space-y-space-md">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[22px]">satellite_alt</span>
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Thermal Anomaly &amp; Fire Radar</h3>
<p className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">Earth Observation Orbital Stream</p>
</div>
</div>
<span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-telemetry-meta text-telemetry-meta font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span> Orbit Active
      </span>
</div>

<div className="p-3 rounded-lg bg-surface-container-low flex flex-col space-y-2">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Sensor Payloads</span>
<span className="font-telemetry-meta text-telemetry-meta text-primary font-semibold">VIIRS Suomi-NPP &amp; MODIS Aqua/Terra</span>
</div>
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Last Overpass Recency</span>
<span className="font-telemetry-meta text-telemetry-meta text-on-surface">3 hours ago (10:42 AM IST)</span>
</div>
</div>

<div className="relative rounded-xl overflow-hidden bg-surface-container-high p-4 flex flex-col justify-between min-h-[160px]">
<div className="flex items-start justify-between z-10">
<div className="space-y-1">
<span className="font-label-sm text-label-sm uppercase tracking-wide text-error font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">crisis_alert</span>
            Detected Thermal Hotspots
          </span>
<div className="flex items-baseline gap-2">
<span className="font-telemetry-num text-telemetry-num text-on-surface">42</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Active Detections</span>
</div>
</div>
<div className="flex flex-col items-end">
<span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-telemetry-meta text-telemetry-meta font-bold flex items-center gap-0.5">
<span className="material-symbols-outlined text-[12px]">trending_down</span> 64%
          </span>
<span className="font-telemetry-meta text-[10px] text-on-surface-variant mt-0.5">vs Seasonal Peak</span>
</div>
</div>

<div className="z-10 mt-4 pt-3 rounded-lg bg-surface-container-lowest/90 backdrop-blur-sm p-3">
<div className="flex items-center gap-2 mb-1">
<span className="material-symbols-outlined text-secondary text-[16px]">air</span>
<span className="font-label-md text-label-md text-on-surface font-semibold">Plume Dispersion Trajectory</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          NW winds at 850 hPa carrying mild boundary-layer smoke toward Delhi NCR bowl. Transboundary impact remains moderate.
        </p>
</div>
</div>

<div className="rounded-lg overflow-hidden bg-surface-container relative">
<div className="relative w-full h-36 bg-cover bg-center" data-alt="High resolution scientific satellite multispectral false-color thermal scan showing agricultural fields in northern India with small red heat anomaly points and atmospheric haze drifting south-eastward over a topographic map outline, in analytical teal and deep green tones." style={{"backgroundImage":"url('https://lh3.googleusercontent.com/aida-public/AB6AXuBQHsjhynp2Ab5fGJ6Tt6cRhJndyTUvCY5Qp_wQ0SQMJyN-QyT6pBJRl9wKbq8H7GVkVpbjqH-idcnNV2ACtTXm4GBtyvNdvypMespfxQIyKL8xqQNDIYSVWwxzM9XG-ho7uC0lMzq7cF6eSqAA-3lk3VmJQGgcMEJGF1HI5sNzLpD_fOO2siASEPgorIK27RIkhMvoIq6zzsFSYM00tPiIbcoukyvyMCiXsI7wiQTCtOsp9P7Gg73l')"}}>
<div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex items-end p-3">
<span className="font-telemetry-meta text-telemetry-meta text-on-primary">Upwind Punjab/Haryana Orbital Buffer: 150 km Radius</span>
</div>
</div>
</div>
</div>

<div className="rounded-xl p-space-md bg-surface-container-lowest text-on-surface shadow-sm space-y-space-md">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[22px]">thermostat</span>
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Meteorological Dispersion Factor</h3>
<p className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">Atmospheric Boundary Dynamics</p>
</div>
</div>
<span className="material-symbols-outlined text-outline text-[20px]">compress</span>
</div>
<div className="grid grid-cols-2 gap-space-sm">

<div className="p-3.5 rounded-lg bg-surface-container-low flex flex-col justify-between">
<div className="flex items-center justify-between mb-2">
<span className="font-label-sm text-label-sm text-on-surface-variant">Surface Wind Vector</span>
<span className="material-symbols-outlined text-secondary text-[18px]">navigation</span>
</div>
<div>
<div className="font-headline-sm text-headline-sm text-on-surface font-bold">NW @ 4.2</div>
<span className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">km/h Surface Velocity</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
          Pushes external regional emissions directly into Delhi bowl.
        </p>
</div>

<div className="p-3.5 rounded-lg bg-surface-container-low flex flex-col justify-between">
<div className="flex items-center justify-between mb-2">
<span className="font-label-sm text-label-sm text-on-surface-variant">Stagnation Index</span>
<span className="material-symbols-outlined text-error text-[18px]">speed</span>
</div>
<div>
<div className="flex items-baseline gap-1">
<span className="font-headline-sm text-headline-sm text-error font-bold">8.4</span>
<span className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">/ 10</span>
</div>
<span className="font-telemetry-meta text-telemetry-meta text-error font-semibold">High Stagnation</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
          Critical thermal inversion trapping pollutants below 380m layer.
        </p>
</div>
</div>
</div>

<div className="rounded-xl p-space-md bg-surface-container-lowest text-on-surface shadow-sm space-y-space-md">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-outline text-[20px]">troubleshoot</span>
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Evidence-Quality Matrix</h3>
<p className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">Hyperlocal Model Audit</p>
</div>
</div>
<span className="font-telemetry-meta text-telemetry-meta text-on-surface-variant px-2 py-0.5 rounded bg-surface-container">Ward 42</span>
</div>

<div className="rounded-xl p-4 bg-surface-container-low flex flex-col items-center text-center space-y-3">
<div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
<span className="material-symbols-outlined text-[26px]">cell_tower</span>
</div>
<div className="space-y-1 max-w-xs">
<div className="flex items-center justify-center gap-1.5 text-on-surface">
<span className="material-symbols-outlined text-error text-[16px]">info</span>
<span className="font-label-lg text-label-lg font-semibold">Localized Industrial Fugitive Emissions</span>
</div>
<span className="inline-block px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-telemetry-meta text-telemetry-meta">
          Insufficient Ground Telemetry for Ward 42-Patparganj
        </span>
</div>

<div className="p-3 rounded-lg bg-surface-container text-left w-full">
<div className="flex items-start gap-2">
<span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">explore</span>
<div className="space-y-1">
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Sensor array density in this pocket is insufficient to separate diesel generator exhaust from industrial boiler plume. Displaying regional baseline.
            </p>
<div className="flex items-center justify-between pt-1">
<span className="font-telemetry-meta text-[10px] text-on-surface-variant">Confidence Floor: ±14.8% CI</span>
<button className="font-label-sm text-label-sm text-secondary font-semibold hover:text-primary transition-colors flex items-center gap-0.5">
                Request Sensor Deployment
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</button>
</div>
</div>
</div>
</div>
</div>
</div>

<div className="rounded-xl p-4 bg-primary text-on-primary flex items-center justify-between shadow-md">
<div className="flex items-center gap-3">
<div className="w-9 h-9 rounded-full bg-surface-tint flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[20px] text-on-primary">terminal</span>
</div>
<div className="flex flex-col">
<span className="font-label-lg text-label-lg font-semibold text-on-primary">Inspect Chemical Markers</span>
<span className="font-telemetry-meta text-telemetry-meta text-primary-fixed">Download Organic Carbon/EC Raw Split</span>
</div>
</div>
<button aria-label="Export Telemetry Dataset" className="h-9 px-3.5 rounded-lg bg-secondary-container text-on-secondary-container font-label-md text-label-md font-semibold flex items-center gap-1 active:scale-95 transition-transform">
<span>Export</span>
<span className="material-symbols-outlined text-[16px]">download</span>
</button>
</div>
</div></main><nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_10px_rgba(0,0,0,0.04)]" data-active-classes="text-primary font-bold"><div className="grid grid-cols-6 items-center h-16 px-1"><Link className="flex flex-col items-center justify-center h-full min-h-[44px] text-on-surface-variant hover:text-on-surface transition-colors" data-path="overview" to="/"><span className="material-symbols-outlined text-[22px]">dashboard</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Overview</span></Link><Link className="flex flex-col items-center justify-center h-full min-h-[44px] text-on-surface-variant hover:text-on-surface transition-colors" data-path="stations" to="/live"><span className="material-symbols-outlined text-[22px]">sensors</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Stations</span></Link><Link className="flex flex-col items-center justify-center h-full min-h-[44px] text-on-surface-variant hover:text-on-surface transition-colors" data-path="forecast" to="/forecast"><span className="material-symbols-outlined text-[22px]">cyclone</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Forecast</span></Link><Link aria-current="page" className="flex flex-col items-center justify-center h-full min-h-[44px] transition-colors text-primary font-bold" data-path="attribution" to="/sources"><span className="material-symbols-outlined text-[22px]">neurology</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Attribution</span></Link><Link className="flex flex-col items-center justify-center h-full min-h-[44px] text-on-surface-variant hover:text-on-surface transition-colors" data-path="advisories" to="/alerts"><span className="material-symbols-outlined text-[22px]">warning</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Advisories</span></Link><Link className="flex flex-col items-center justify-center h-full min-h-[44px] text-on-surface-variant hover:text-on-surface transition-colors" data-path="data-sources" to="/transparency"><span className="material-symbols-outlined text-[22px]">database</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Sources</span></Link></div></nav>
    </>
  );
}
