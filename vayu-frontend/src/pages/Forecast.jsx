
import React from 'react';
import AppHeader from '../components/AppHeader';
import AppNav from '../components/AppNav';
import LiveWeatherBar from '../components/LiveWeatherBar';
import { useVayu } from '../context/VayuContext';

export default function Forecast() {
  const { forecasts } = useVayu();
  
  const preds = forecasts?.predictions || [];
  const peak = preds.length ? Math.max(...preds.map(p => p.aqi_projected)) : 418;
  const peakTimeObj = preds.find(p => p.aqi_projected === peak);
  const peakTime = peakTimeObj ? new Date(peakTimeObj.timestamp).toLocaleTimeString('en-IN', {hour: '2-digit', minute:'2-digit'}) : 'Tomorrow, 06:30 AM';

  return (
    <>
      <AppHeader pageTitle="Forecast" />
      <main className="flex flex-col relative w-full pt-20 pb-24 bg-surface px-space-md"><div className="flex flex-col w-full gap-space-md">
      <LiveWeatherBar />

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
        {peak > 400 ? 'CPCB SEVERE' : peak > 300 ? 'VERY POOR' : peak > 200 ? 'POOR' : 'MODERATE'}
      </span>
</div>
<div className="flex items-baseline gap-2 mb-1">
<span className="font-telemetry-num text-[38px] leading-none text-on-surface font-bold tracking-tight">{peak}</span>
<span className="font-label-md text-label-md text-error font-semibold">AQI Peak</span>
<span className="font-body-sm text-body-sm text-on-surface-variant ml-auto text-right">{peakTime}</span>
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
          {preds.length === 0 ? (
            <div className="p-4 bg-surface-container rounded-xl text-center text-on-surface-variant font-body-sm">
              Forecast data is currently unavailable from Open-Meteo CAMS model.
            </div>
          ) : (
            <div className="flex gap-space-sm overflow-x-auto pb-2 no-scrollbar -mx-space-md px-space-md">
              {preds.filter((_, idx) => idx > 0 && idx % 4 === 0).slice(0, 10).map((p) => {
                const pDate = new Date(p.timestamp);
                const timeLabel = pDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', weekday: 'short' });
                const isPeak = p.aqi_projected === peak;
                const cat = p.aqi_projected <= 50 ? 'Good' : p.aqi_projected <= 100 ? 'Satisfactory' : p.aqi_projected <= 200 ? 'Moderate' : p.aqi_projected <= 300 ? 'Poor' : p.aqi_projected <= 400 ? 'Very Poor' : 'Severe';
                const catColor = p.aqi_projected > 300 ? 'text-error' : p.aqi_projected > 200 ? 'text-error' : p.aqi_projected > 100 ? 'text-secondary' : 'text-primary';

                return (
                  <div
                    key={p.horizon_hours}
                    className={`${isPeak ? 'bg-error-container/30 border border-error/30' : 'bg-surface-container-lowest'} min-w-[145px] p-3 rounded-xl shadow-sm flex flex-col justify-between shrink-0 relative`}
                  >
                    {isPeak && (
                      <div className="absolute top-0 right-0 bg-error text-on-error font-telemetry-meta text-[9px] px-1.5 py-0.5 rounded-bl font-bold">
                        PEAK
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-label-sm text-label-sm text-on-surface font-semibold">{timeLabel}</span>
                      <span className="font-telemetry-meta text-[10px] text-on-surface-variant">+{p.horizon_hours}h</span>
                    </div>
                    <div className="flex items-baseline gap-1 my-1">
                      <span className={`font-telemetry-num text-headline-md font-bold ${isPeak ? 'text-error' : 'text-on-surface'}`}>
                        {p.aqi_projected}
                      </span>
                      <span className={`font-label-sm text-[10px] font-medium ${catColor}`}>
                        {cat}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-surface-container text-on-surface-variant font-body-sm text-[11px]">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-secondary">model_training</span>
                        <span>Confidence: {p.confidence}</span>
                      </div>
                      <div className="bg-surface-container px-1.5 py-0.5 rounded text-[10px] text-on-surface-variant font-medium text-center">
                        Open-Meteo CAMS Model
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">model_training</span>
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Model Provenance &amp; Telemetry</span>
          </div>
          <div className="flex flex-col gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
            <div className="flex justify-between items-center py-1 border-b border-surface-container">
              <span>Model Architecture</span>
              <span className="font-telemetry-meta text-telemetry-meta font-medium text-on-surface text-right">
                Open-Meteo CAMS 48h Numerical Model
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-surface-container">
              <span>Spatial Resolution</span>
              <span className="font-telemetry-meta text-telemetry-meta text-on-surface">~40 km × 40 km Atmospheric Grid</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-surface-container">
              <span>AQI Conversion</span>
              <span className="font-telemetry-meta text-telemetry-meta text-secondary font-semibold">Instantaneous CPCB Formula</span>
            </div>
          </div>

          <div className="bg-surface-container rounded-lg p-2.5 flex items-start gap-2 mt-1">
            <span className="material-symbols-outlined text-on-surface-variant text-[16px] shrink-0 mt-0.5">info</span>
            <p className="font-body-sm text-[11px] text-on-surface-variant leading-relaxed">
              <strong>Atmospheric Model Notice:</strong> 48-hour forecasts are derived from Copernicus Atmosphere Monitoring Service (CAMS) global numerical assimilation (~40 km grid cell). AQI values represent instantaneous hourly model projections calculated via Indian CPCB sub-index breakpoints, not statutory 24-hour ground station regulatory indices.
            </p>
          </div>
        </div>
</div>
</main>
      <AppNav />
    </>
  );
}
