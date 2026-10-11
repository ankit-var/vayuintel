
import React from 'react';
import AppHeader from '../components/AppHeader';
import AppNav from '../components/AppNav';

export default function Transparency() {
  return (
    <>
      <AppHeader pageTitle="Data Sources" />
      <main className="flex flex-col relative w-full pt-20 pb-24 bg-surface px-space-md"><div className="flex flex-col w-full space-y-space-md">

<div className="flex flex-col space-y-1">
<div className="inline-flex items-center gap-1.5 self-start px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface">
<span className="material-symbols-outlined text-[13px] text-secondary">verified_user</span>
<span className="font-telemetry-meta text-telemetry-meta tracking-wider uppercase">Open Science &amp; Peer Governance</span>
</div>
<p className="font-headline-sm text-headline-sm text-primary font-bold">Data Sources &amp; Scientific Transparency</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Open methodology, measurement boundaries, and uncertainty governance.</p>
</div>

<div className="p-space-md rounded-xl bg-surface-container flex items-center justify-between shadow-sm">
<div className="flex items-center gap-space-sm">
<div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-secondary-container">
<span className="material-symbols-outlined text-[18px] text-on-secondary-container">hub</span>
<span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary"></span>
</div>
<div>
<p className="font-label-sm text-label-sm text-on-surface">Federated Pipeline Status</p>
<p className="font-telemetry-meta text-telemetry-meta text-secondary">4 / 4 Nodes Active • Low Latency</p>
</div>
</div>
<div className="text-right">
<span className="font-telemetry-num text-[18px] leading-tight text-primary">99.1%</span>
<p className="font-label-sm text-[10px] text-on-surface-variant">Ingest Health</p>
</div>
</div>

<div className="flex flex-col space-y-space-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-primary">sensors</span>
<h2 className="font-label-lg text-label-lg text-on-surface font-semibold">Integrated Data Feeds</h2>
</div>
<span className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">4 Provenance Streams</span>
</div>

<div className="p-space-md rounded-xl bg-surface-container-low flex flex-col space-y-2.5 shadow-sm">
<div className="flex items-start justify-between">
<div className="flex flex-col pr-2">
<div className="flex items-center gap-1.5">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Open-Meteo &amp; Copernicus (CAMS)</h3>
</div>
<span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Atmospheric Dispersion &amp; Reanalysis Model Grid (~40 km)</span>
</div>
<span className="font-telemetry-meta text-telemetry-meta px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold">Live Numerical Grid</span>
</div>
<div className="p-2 rounded-lg bg-surface-container-lowest text-on-surface space-y-1">
<div className="flex items-center gap-1.5 text-on-surface-variant">
<span className="material-symbols-outlined text-[14px]">info</span>
<span className="font-label-sm text-label-sm font-medium">Model Estimation Notice</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface">Telemetry values are atmospheric model estimates derived from the ECMWF/CAMS regional ensemble (~0.4°/40 km resolution), calculated instantaneously using CPCB sub-index breakpoints. They are not direct physical measurements from statutory CPCB or DPCC monitoring stations.</p>
</div>
<div className="grid grid-cols-2 gap-2 pt-1 font-telemetry-meta text-telemetry-meta">
<div className="flex items-center gap-1 text-on-surface-variant">
<span className="material-symbols-outlined text-[13px] text-secondary">place</span>
<span>Grid Reference Points: DEL, BLR, PAT</span>
</div>
<div className="flex items-center justify-end gap-1 text-on-surface-variant">
<span className="material-symbols-outlined text-[13px] text-secondary">update</span>
<span>UTC Synced (Open-Meteo)</span>
</div>
</div>
</div>

<div className="p-space-md rounded-xl bg-surface-container-low flex flex-col space-y-2.5 shadow-sm">
<div className="flex items-start justify-between">
<div className="flex items-center gap-1.5">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">CPCB Methodology &amp; Sub-Index Calculation</h3>
</div>
<span className="font-telemetry-meta text-telemetry-meta px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-medium">Standardized</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface">Vayu Intel applies official CPCB piecewise linear sub-index breakpoint math (IN-AQI: Good 0-50 to Severe 401-500) to current PM2.5, PM10, and NO2 model inputs. Note: Official statutory CPCB station AQI requires a 24-hour time-weighted average across physical hardware.</p>
<div className="flex items-center justify-between pt-0.5 font-telemetry-meta text-telemetry-meta text-on-surface-variant">
<span className="flex items-center gap-1">
<span className="material-symbols-outlined text-[13px] text-secondary">calculate</span>
          Instantaneous Model Sub-Index (1-hr)
        </span>
<span className="px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface">Linear Interpolation</span>
</div>
</div>

<div className="p-space-md rounded-xl bg-surface-container-low flex flex-col space-y-2.5 shadow-sm">
<div className="flex items-start justify-between">
<div className="flex items-center gap-1.5">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">India Meteorological Dept &amp; ERA5</h3>
</div>
<span className="font-telemetry-meta text-telemetry-meta px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-medium">Synoptic</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface">Atmospheric boundary layer height (PBLH), 10m surface horizontal wind vectors (u/v), relative humidity, and vertical thermal inversions.</p>
<div className="flex items-center justify-between pt-0.5 font-telemetry-meta text-telemetry-meta text-on-surface-variant">
<span className="flex items-center gap-1">
<span className="material-symbols-outlined text-[13px] text-secondary">air</span>
          Reanalysis &amp; Numerical Weather
        </span>
<span className="px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface">Cycles: Every 3h</span>
</div>
</div>

<div className="p-space-md rounded-xl bg-surface-container-low flex flex-col space-y-2.5 shadow-sm">
<div className="flex items-start justify-between">
<div className="flex items-center gap-1.5">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">NASA FIRMS / VIIRS &amp; MODIS</h3>
</div>
<span className="font-telemetry-meta text-telemetry-meta px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-medium">Orbital</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface">Thermal anomaly telemetry for stubble combustion hotspots &amp; Aerosol Optical Depth (AOD 550nm) column thickness across northern belts.</p>
<div className="flex items-center justify-between pt-0.5 font-telemetry-meta text-telemetry-meta text-on-surface-variant">
<span className="flex items-center gap-1">
<span className="material-symbols-outlined text-[13px] text-secondary">satellite_alt</span>
          Sun-synchronous orbital swath
        </span>
<span className="px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface">Twice daily overpass</span>
</div>
</div>
</div>

<div className="relative overflow-hidden rounded-xl bg-primary-container text-on-primary p-space-md shadow-md">
<div className="flex items-center justify-between mb-2">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-[18px] text-primary-fixed">schema</span>
<span className="font-label-lg text-label-lg font-bold text-on-primary">Ensemble Fusion Pipeline</span>
</div>
<span className="font-telemetry-meta text-telemetry-meta px-2 py-0.5 rounded-full bg-primary text-primary-fixed">v2.4-Production</span>
</div>
<p className="font-body-sm text-body-sm text-on-primary-container mb-3">Ground sensor feeds, satellite column depths, and thermodynamic profiles converge into a physics-constrained neural dispersion grid.</p>
<div className="grid grid-cols-3 gap-2 text-center">
<div className="p-2 rounded-lg bg-primary/40 flex flex-col items-center">
<span className="material-symbols-outlined text-[18px] text-primary-fixed mb-1">foggy</span>
<span className="font-label-sm text-[10px] text-on-primary font-semibold">Ground Monitors</span>
<span className="font-telemetry-meta text-[9px] text-on-primary-container">56 Telemetry Nodes</span>
</div>
<div className="p-2 rounded-lg bg-primary/40 flex flex-col items-center">
<span className="material-symbols-outlined text-[18px] text-primary-fixed mb-1">cyclone</span>
<span className="font-label-sm text-[10px] text-on-primary font-semibold">WRF-Chem</span>
<span className="font-telemetry-meta text-[9px] text-on-primary-container">3km Spatial Grid</span>
</div>
<div className="p-2 rounded-lg bg-primary/40 flex flex-col items-center">
<span className="material-symbols-outlined text-[18px] text-primary-fixed mb-1">insights</span>
<span className="font-label-sm text-[10px] text-on-primary font-semibold">LightGBM Meta</span>
<span className="font-telemetry-meta text-[9px] text-on-primary-container">Bias Corrected</span>
</div>
</div>
</div>

<div className="flex flex-col space-y-space-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-primary">biotech</span>
<h2 className="font-label-lg text-label-lg text-on-surface font-semibold">Model Architecture &amp; Evaluation</h2>
</div>
<span className="font-telemetry-meta text-telemetry-meta text-secondary">Verified Test Bed</span>
</div>

<div className="grid grid-cols-3 gap-2">

<div className="p-space-sm rounded-xl bg-surface-container-low text-on-surface flex flex-col items-center text-center shadow-sm">
<span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">24h RMSE</span>
<div className="flex items-baseline gap-0.5 my-1">
<span className="font-telemetry-num text-[22px] leading-tight font-bold text-primary">18.4</span>
</div>
<span className="font-telemetry-meta text-[10px] text-secondary">AQI Points</span>
</div>

<div className="p-space-sm rounded-xl bg-surface-container-low text-on-surface flex flex-col items-center text-center shadow-sm">
<span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">Mean Error</span>
<div className="flex items-baseline gap-0.5 my-1">
<span className="font-telemetry-num text-[22px] leading-tight font-bold text-primary">7.2%</span>
</div>
<span className="font-telemetry-meta text-[10px] text-secondary">MAPE Scale</span>
</div>

<div className="p-space-sm rounded-xl bg-surface-container-low text-on-surface flex flex-col items-center text-center shadow-sm">
<span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">Early Warning</span>
<div className="flex items-baseline gap-0.5 my-1">
<span className="font-telemetry-num text-[22px] leading-tight font-bold text-primary">89.1%</span>
</div>
<span className="font-telemetry-meta text-[10px] text-secondary">True Positive</span>
</div>
</div>

<div className="p-space-md rounded-xl bg-surface-container-low space-y-2">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface font-semibold">Hybrid Modeling Architecture</span>
<span className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">WRF-Chem + XGB/GBDT</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Deterministic chemical transport simulation handles advection and regional secondary aerosol synthesis; an ensemble Gradient-Boosted tree layers local micrometeorological corrections.</p>
</div>

<div className="p-space-md rounded-xl bg-error-container text-on-error-container flex items-start gap-space-sm shadow-sm">
<span className="material-symbols-outlined text-[20px] text-error flex-shrink-0 mt-0.5">warning_amber</span>
<div className="flex flex-col space-y-0.5">
<span className="font-label-sm text-label-sm font-bold uppercase tracking-wide text-error">Spatial Resolution Boundary</span>
<p className="font-body-sm text-body-sm leading-snug">No ward-level precision claimed without dense local sensor micro-grids (&lt;1km spacing). Neighborhood interpolations exhibit higher dispersion uncertainty during atmospheric lulls.</p>
</div>
</div>
</div>

<div className="flex flex-col space-y-space-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-primary">health_and_safety</span>
<h2 className="font-label-lg text-label-lg text-on-surface font-semibold">Sensor Health &amp; Anomaly Detection</h2>
</div>
<span className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">Real-Time QA/QC</span>
</div>
<div className="p-space-md rounded-xl bg-surface-container-low flex flex-col space-y-3 shadow-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[18px] text-error">hourglass_bottom</span>
<div>
<p className="font-label-sm text-label-sm text-on-surface font-semibold">3 Stale Sensor Nodes Identified</p>
<p className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">Reporting silence exceeding 3 hours</p>
</div>
</div>
<button className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high transition-colors">Inspect</button>
</div>
<div className="flex flex-col space-y-1.5 pt-1">
<div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-surface-container-lowest font-body-sm text-body-sm">
<span className="text-on-surface">Anand Vihar, Delhi (CAAQMS-04)</span>
<span className="font-telemetry-meta text-telemetry-meta text-error font-medium">Stale 3h 42m</span>
</div>
<div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-surface-container-lowest font-body-sm text-body-sm">
<span className="text-on-surface">BTM Layout, Bengaluru (PCB-09)</span>
<span className="font-telemetry-meta text-telemetry-meta text-error font-medium">Stale 4h 10m</span>
</div>
<div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-surface-container-lowest font-body-sm text-body-sm">
<span className="text-on-surface">Shikarpur, Patna (BSPCB-02)</span>
<span className="font-telemetry-meta text-telemetry-meta text-error font-medium">Stale 3h 18m</span>
</div>
</div>
<div className="flex items-start gap-2 pt-1 text-on-surface-variant">
<span className="material-symbols-outlined text-[16px] text-secondary flex-shrink-0 mt-0.5">filter_alt</span>
<p className="font-body-sm text-body-sm text-on-surface">Automated IQR anomaly detection filters unphysical voltage spikes, optical chamber dust saturation, and baseline drift without dropping environmental plume signatures.</p>
</div>
</div>
</div>

<div className="rounded-xl overflow-hidden shadow-sm bg-surface-container">
<div className="relative w-full h-36">
<img className="w-full h-full object-cover" data-alt="High precision meteorological air quality measurement station in New Delhi at dawn, with continuous ambient sensors, solar panels, and scientific telemetry antennas under clear morning light in forest green and metallic tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBO-ivoToTZvE4pyFoMjW1RQyhYCj0jOzsxyIWjDUS43FXcOJlgN83APEYRSM5gIj4Oa8ORq9jDqbE806p9SucxqDzXTfK9mB8uabT8QHZ4SGnXdz7YTHeJwJjHS6BGkSmVPU_6rzJWBTrKrgiQ5jyjEQOShFmRoajQGHbdEuwjwFwXNGp_ayM9XR-y-A46HVOopVl-Cy-g03n-ZHkcDnnlxlUx01GlJ-iwkr2MLTTkz3vm2DJ4PJrT"/>
<div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex items-end p-space-md">
<div className="flex items-center justify-between w-full text-on-primary">
<div>
<p className="font-label-sm text-label-sm font-semibold">Continuous Co-location Bench</p>
<p className="font-telemetry-meta text-telemetry-meta text-primary-fixed">National Physical Laboratory (CSIR-NPL) Calibration Standard</p>
</div>
<span className="material-symbols-outlined text-[20px] text-primary-fixed">verified</span>
</div>
</div>
</div>
</div>

<div className="flex flex-col space-y-space-sm pt-1">
<div className="flex items-center justify-between">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-primary">cloud_download</span>
<h2 className="font-label-lg text-label-lg text-on-surface font-semibold">Open Data &amp; Research Access</h2>
</div>
<span className="font-telemetry-meta text-telemetry-meta text-secondary">CC-BY-4.0</span>
</div>
<div className="flex flex-col space-y-2">

<button className="w-full p-space-md rounded-xl bg-primary text-on-primary flex items-center justify-between active:scale-[0.99] transition-all shadow-sm" id="download-geojson">
<div className="flex items-center gap-space-sm">
<div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center">
<span className="material-symbols-outlined text-[20px] text-primary-fixed">polyline</span>
</div>
<div className="text-left">
<p className="font-label-lg text-label-lg font-bold text-on-primary">Download Raw GeoJSON Telemetry</p>
<p className="font-telemetry-meta text-telemetry-meta text-primary-fixed-dim">WGS84 Normalized • GeoJSON FeatureCollection</p>
</div>
</div>
<span className="material-symbols-outlined text-[20px] text-on-primary">arrow_downward</span>
</button>

<button className="w-full p-space-md rounded-xl bg-surface-container text-on-surface flex items-center justify-between hover:bg-surface-container-high active:scale-[0.99] transition-all shadow-sm" id="view-api-docs">
<div className="flex items-center gap-space-sm">
<div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center">
<span className="material-symbols-outlined text-[20px] text-secondary">terminal</span>
</div>
<div className="text-left">
<p className="font-label-lg text-label-lg font-bold text-on-surface">API Documentation (OpenAPI 3.0)</p>
<p className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">REST &amp; Streaming WebSocket endpoints</p>
</div>
</div>
<span className="material-symbols-outlined text-[20px] text-on-surface-variant">arrow_forward</span>
</button>

<button className="w-full p-space-md rounded-xl bg-surface-container text-on-surface flex items-center justify-between hover:bg-surface-container-high active:scale-[0.99] transition-all shadow-sm" id="view-whitepaper">
<div className="flex items-center gap-space-sm">
<div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center">
<span className="material-symbols-outlined text-[20px] text-secondary">description</span>
</div>
<div className="text-left">
<p className="font-label-lg text-label-lg font-bold text-on-surface">Model Bias &amp; Validation Whitepaper</p>
<p className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">PDF (v1.8) • Peer-Reviewed Methodology</p>
</div>
</div>
<span className="material-symbols-outlined text-[20px] text-on-surface-variant">open_in_new</span>
</button>
</div>
</div>

<div className="fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-inverse-surface text-inverse-on-surface shadow-xl flex items-center gap-2 text-label-sm font-label-sm opacity-0 pointer-events-none transition-all duration-300 z-50" id="toast-feedback">
  <span className="material-symbols-outlined text-[16px] text-secondary-fixed">check_circle</span>
  <span id="toast-message">Telemetry payload queued for download</span>
</div>
</div>
</main>
      <AppNav />
    </>
  );
}
