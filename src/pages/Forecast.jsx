import { useState, useMemo } from 'react';
import AppNav from '../components/AppNav';
import AppHeader from '../components/AppHeader';
import LiveWeatherBar from '../components/LiveWeatherBar';
import { useVayu } from '../context/VayuContext';
import { getAqiCategory, formatTimeIST } from '../utils/dataUtils';

export default function Forecast() {
  const { forecasts, weather, loading, city } = useVayu();
  const [selectedHorizon, setSelectedHorizon] = useState(48);

  const rawPreds = useMemo(() => {
    return Array.isArray(forecasts?.predictions) ? forecasts.predictions : [];
  }, [forecasts]);

  // Filter predictions by selected horizon
  const filteredPreds = useMemo(() => {
    if (!rawPreds.length) return [];
    return rawPreds.filter(p => p.horizon_hours <= selectedHorizon);
  }, [rawPreds, selectedHorizon]);

  // Derived peak
  const validAqis = filteredPreds
    .map(p => p.aqi_projected)
    .filter(val => val != null && !Number.isNaN(val));

  const peak = validAqis.length > 0 ? Math.max(...validAqis) : null;
  const peakPred = peak != null ? filteredPreds.find(p => p.aqi_projected === peak) : null;
  const peakCat = getAqiCategory(peak);

  const peakTimeDisplay = peakPred?.timestamp
    ? formatTimeIST(peakPred.timestamp)
    : (peak != null ? 'Within forecast period' : 'Awaiting data');

  // Chart coordinate mapping
  const chartPoints = useMemo(() => {
    if (filteredPreds.length === 0) return [];
    const maxH = Math.max(...filteredPreds.map(p => p.horizon_hours), 1);
    return filteredPreds.map(p => {
      const x = 20 + (p.horizon_hours / maxH) * 320;
      // AQI 0 to 500 mapped to y: 145 (bottom) to 15 (top)
      const val = p.aqi_projected != null ? Math.min(500, Math.max(0, p.aqi_projected)) : 0;
      const y = 145 - (val / 500) * 125;
      return { x, y, aqi: p.aqi_projected, h: p.horizon_hours, ts: p.timestamp, isObserved: p.is_observed };
    });
  }, [filteredPreds]);

  // SVG path generation
  const pathD = useMemo(() => {
    if (chartPoints.length === 0) return '';
    return chartPoints.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x.toFixed(1)},${pt.y.toFixed(1)}` : `${acc} L ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
    }, '');
  }, [chartPoints]);

  const areaD = useMemo(() => {
    if (chartPoints.length === 0) return '';
    const firstX = chartPoints[0].x.toFixed(1);
    const lastX = chartPoints[chartPoints.length - 1].x.toFixed(1);
    return `${pathD} L ${lastX},155 L ${firstX},155 Z`;
  }, [pathD, chartPoints]);

  // Periodic breakdown cards (every 4 to 8 hours depending on horizon)
  const breakdownCards = useMemo(() => {
    if (filteredPreds.length === 0) return [];
    const step = selectedHorizon === 24 ? 4 : 6;
    const sampled = filteredPreds.filter((p) => p.horizon_hours > 0 && p.horizon_hours % step === 0);
    if (sampled.length === 0 && filteredPreds.length > 0) {
      return filteredPreds.slice(1, 6);
    }
    return sampled;
  }, [filteredPreds, selectedHorizon]);

  return (
    <>
      <AppHeader pageTitle="Forecast" />
      <main className="flex flex-col relative w-full pt-20 pb-24 bg-surface px-space-md">
        <div className="flex flex-col w-full gap-space-md">
          <LiveWeatherBar />

          {/* Horizon toggle buttons */}
          <div className="flex items-center gap-space-xs overflow-x-auto pb-1 no-scrollbar" role="group" aria-label="Forecast horizon selection">
            <button
              type="button"
              onClick={() => setSelectedHorizon(48)}
              className={`font-label-md text-label-md px-3.5 py-2 min-h-[40px] rounded-full whitespace-nowrap shadow-sm flex items-center gap-1.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                selectedHorizon === 48
                  ? 'bg-primary text-on-primary font-semibold'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">
                auto_graph
              </span>
              48 Hours (CPCB Baseline)
            </button>
            <button
              type="button"
              onClick={() => setSelectedHorizon(24)}
              className={`font-label-md text-label-md px-3.5 py-2 min-h-[40px] rounded-full whitespace-nowrap transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                selectedHorizon === 24
                  ? 'bg-primary text-on-primary font-semibold'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              24 Hours
            </button>
            <button
              type="button"
              onClick={() => setSelectedHorizon(72)}
              className={`font-label-md text-label-md px-3.5 py-2 min-h-[40px] rounded-full whitespace-nowrap transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                selectedHorizon === 72
                  ? 'bg-primary text-on-primary font-semibold'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Extended Outlook (48h max)
            </button>
          </div>

          {/* Peak Trajectory Card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-error-container/20 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[18px]">crisis_alert</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Projected Peak AQI
                </span>
              </div>
              <span
                className={`font-telemetry-meta text-telemetry-meta font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  peak != null && peak > 300 ? 'bg-error text-on-error' : 'bg-surface-container text-on-surface'
                }`}
              >
                {peak != null && (
                  <span className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest animate-ping"></span>
                )}
                {peakCat.label.toUpperCase()}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-telemetry-num text-[38px] leading-none text-on-surface font-bold tracking-tight">
                {peak != null ? peak : '—'}
              </span>
              <span className="font-label-md text-label-md text-error font-semibold">AQI Peak</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant ml-auto text-right">
                {peakTimeDisplay}
              </span>
            </div>

            <div className="bg-surface-container-low rounded-lg p-space-sm mt-3 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">cyclone</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">Methodology Note</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                  {forecasts?.model_information || 'Persistence baseline calculated from latest verified CPCB station telemetry.'}
                </span>
              </div>
            </div>

            <div className="mt-3.5 pt-3 flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-on-surface-variant font-telemetry-meta text-telemetry-meta">
                <span className="flex items-center gap-1 text-on-surface">
                  <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
                  Estimated Forecast Confidence
                </span>
                <span>Near-term: High · Mid-term: Medium</span>
              </div>
              <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden flex">
                <div className="bg-secondary h-full rounded-l-full" style={{ width: '65%' }}></div>
                <div className="bg-secondary-container h-full rounded-r-full" style={{ width: '35%' }}></div>
              </div>
            </div>
          </div>

          {/* Dispersion Trajectory Chart */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Dispersion Trajectory
                  </span>
                  <span className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">
                    Current Observed vs. {selectedHorizon}h Projected Baseline
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 font-telemetry-meta text-[10px]">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-primary rounded-full"></span>
                  <span className="text-on-surface-variant">Projected</span>
                </div>
              </div>
            </div>

            <div className="relative w-full overflow-hidden rounded-lg bg-surface-container-low p-2">
              <div className="flex justify-between items-center px-1 font-telemetry-meta text-telemetry-meta text-on-surface-variant">
                <span>AQI 500 max</span>
                <span className="bg-surface-container px-1.5 py-0.5 rounded text-[10px] text-secondary font-medium">
                  {rawPreds.length > 0 ? `${filteredPreds.length} Hours Plotted` : 'Awaiting Data'}
                </span>
              </div>

              {chartPoints.length > 0 ? (
                <svg className="w-full h-44 overflow-visible my-1" preserveAspectRatio="none" viewBox="0 0 360 170">
                  <defs>
                    <linearGradient id="forecastAreaGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#006a61" stopOpacity="0.30" />
                      <stop offset="100%" stopColor="#006a61" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  {/* Threshold gridlines */}
                  <line stroke="#d3e4fe" strokeDasharray="2 3" strokeWidth="0.7" x1="10" x2="350" y1="45" y2="45" />
                  <text fill="#ba1a1a" fontFamily="JetBrains Mono" fontSize="7" x="12" y="42">
                    400 Severe
                  </text>
                  <line stroke="#d3e4fe" strokeDasharray="2 3" strokeWidth="0.7" x1="10" x2="350" y1="70" y2="70" />
                  <text fill="#707974" fontFamily="JetBrains Mono" fontSize="7" x="12" y="67">
                    300 Very Poor
                  </text>
                  <line stroke="#d3e4fe" strokeDasharray="2 3" strokeWidth="0.7" x1="10" x2="350" y1="95" y2="95" />
                  <text fill="#707974" fontFamily="JetBrains Mono" fontSize="7" x="12" y="92">
                    200 Moderate
                  </text>

                  {/* Area fill */}
                  <polygon fill="url(#forecastAreaGrad)" points={areaD.replace(/[^0-9., LZM]/g, '')} />

                  {/* Trajectory line */}
                  <path d={pathD} fill="none" stroke="#006a61" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Data points */}
                  {chartPoints
                    .filter((_, idx) => idx === 0 || idx % Math.max(1, Math.floor(chartPoints.length / 5)) === 0 || idx === chartPoints.length - 1)
                    .map((pt, i) => (
                      <circle
                        key={i}
                        cx={pt.x}
                        cy={pt.y}
                        fill={pt.isObserved ? '#003527' : '#006a61'}
                        r={pt.isObserved ? 4.5 : 3.5}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    ))}
                </svg>
              ) : (
                <div className="w-full h-44 flex flex-col items-center justify-center text-on-surface-variant gap-1.5">
                  <span className="material-symbols-outlined text-[28px]">insights</span>
                  <span className="font-body-sm text-body-sm">
                    {loading ? 'Loading forecast models…' : 'No forecast predictions currently available.'}
                  </span>
                </div>
              )}

              {/* X Axis time labels */}
              {chartPoints.length > 0 && (
                <div className="grid grid-cols-4 text-center font-telemetry-meta text-[9px] text-on-surface-variant pt-1 border-t border-surface-container">
                  <div className="text-left font-semibold text-primary">
                    NOW
                    <br />
                    <span className="text-[8px]">
                      {chartPoints[0]?.aqi != null ? `AQI ${chartPoints[0].aqi}` : '—'}
                    </span>
                  </div>
                  <div>
                    +{Math.round(selectedHorizon * 0.33)}h
                    <br />
                    <span className="text-[8px]">
                      {chartPoints[Math.floor(chartPoints.length * 0.33)]?.aqi != null
                        ? `AQI ${chartPoints[Math.floor(chartPoints.length * 0.33)].aqi}`
                        : '—'}
                    </span>
                  </div>
                  <div>
                    +{Math.round(selectedHorizon * 0.66)}h
                    <br />
                    <span className="text-[8px]">
                      {chartPoints[Math.floor(chartPoints.length * 0.66)]?.aqi != null
                        ? `AQI ${chartPoints[Math.floor(chartPoints.length * 0.66)].aqi}`
                        : '—'}
                    </span>
                  </div>
                  <div className="text-right">
                    +{selectedHorizon}h
                    <br />
                    <span className="text-[8px]">
                      {chartPoints[chartPoints.length - 1]?.aqi != null
                        ? `AQI ${chartPoints[chartPoints.length - 1].aqi}`
                        : '—'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm px-1">
              <span className="flex items-center gap-1 text-secondary">
                <span className="material-symbols-outlined text-[16px]">info</span>
                Method: Persistence Baseline Model
              </span>
              <span className="font-telemetry-meta text-telemetry-meta">
                CPCB Standard AQI
              </span>
            </div>
          </div>

          {/* 4-Hour / 6-Hour Predictive Breakdown Cards */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-0.5">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[18px]">view_timeline</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Predictive Breakdown
                </h3>
              </div>
              <span className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">
                Scroll horizontally
              </span>
            </div>

            <div className="flex gap-space-sm overflow-x-auto pb-2 no-scrollbar -mx-space-md px-space-md">
              {breakdownCards.length > 0 ? (
                breakdownCards.map((p, idx) => {
                  const cat = getAqiCategory(p.aqi_projected);
                  const timeStr = p.timestamp ? formatTimeIST(p.timestamp) : `+${p.horizon_hours}h`;

                  return (
                    <div
                      key={idx}
                      className="bg-surface-container-lowest min-w-[150px] p-3 rounded-xl shadow-sm flex flex-col justify-between shrink-0 border border-outline-variant/30"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-label-sm text-label-sm text-on-surface font-semibold">{timeStr}</span>
                        <span className="font-telemetry-meta text-[10px] text-on-surface-variant font-mono">
                          +{p.horizon_hours}h
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1 my-1">
                        <span className="font-telemetry-num text-headline-md text-on-surface font-bold">
                          {p.aqi_projected != null ? p.aqi_projected : '—'}
                        </span>
                        <span
                          className={`font-label-sm text-[10px] font-semibold ${
                            p.aqi_projected != null && p.aqi_projected > 300 ? 'text-error' : 'text-primary'
                          }`}
                        >
                          {cat.label}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-surface-container text-on-surface-variant font-body-sm text-[11px]">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
                          <span>Confidence: {p.confidence || 'Medium'}</span>
                        </div>
                        <div className="bg-surface-container px-1.5 py-0.5 rounded text-[10px] text-secondary font-medium text-center">
                          {p.aqi_projected != null && p.aqi_projected > 300 ? 'Dispersion: Stagnant' : 'Dispersion: Moderate'}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-surface-container-lowest p-4 rounded-xl text-on-surface-variant text-body-sm w-full text-center">
                  {loading ? 'Loading predictions…' : 'No predictions available.'}
                </div>
              )}
            </div>
          </div>

          {/* Meteorological Drivers wired to real weather context */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[18px]">thermostat</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Meteorological Drivers
                </h3>
              </div>
              <span className="bg-surface-container-low font-telemetry-meta text-telemetry-meta text-on-surface-variant px-2 py-0.5 rounded-full">
                Open-Meteo Synoptic Sync
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-surface-container-low rounded-lg p-3 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center shrink-0 text-secondary">
                  <span className="material-symbols-outlined text-[20px]">air</span>
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      Surface Wind Speed
                    </span>
                    <span className="font-telemetry-num text-label-md text-on-surface font-bold">
                      {weather?.wind_speed != null ? `${weather.wind_speed} km/h` : '—'}
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                    {weather?.wind_speed != null && weather.wind_speed < 5
                      ? 'Calm winds (<5 km/h) limit horizontal ventilation, favoring localized aerosol accumulation.'
                      : 'Wind dynamics promote atmospheric dispersion and dilution of particulate emissions.'}
                  </span>
                </div>
              </div>

              <div className="bg-surface-container-low rounded-lg p-3 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center shrink-0 text-error">
                  <span className="material-symbols-outlined text-[20px]">thermostat</span>
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      Ambient Temperature
                    </span>
                    <span className="font-telemetry-meta text-telemetry-meta text-on-surface font-bold">
                      {weather?.temperature != null ? `${weather.temperature}°C` : '—'}
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                    Diurnal temperature fluctuations dictate surface thermal stratification and nocturnal inversion depth.
                  </span>
                </div>
              </div>

              <div className="bg-surface-container-low rounded-lg p-3 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center shrink-0 text-secondary">
                  <span className="material-symbols-outlined text-[20px]">humidity_percentage</span>
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      Relative Humidity
                    </span>
                    <span className="font-telemetry-num text-label-md text-on-surface font-bold">
                      {weather?.humidity != null ? `${weather.humidity}% RH` : '—'}
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                    Elevated humidity (&gt;70% RH) fosters secondary sulfate and nitrate aerosol formation via heterogeneous aqueous reactions.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Model Validation & Scientific Governance */}
          <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">model_training</span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Model Transparency &amp; Methodology
              </span>
            </div>
            <div className="flex flex-col gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
              <div className="flex justify-between items-center py-1 border-b border-surface-container">
                <span>Model Architecture</span>
                <span className="font-telemetry-meta text-telemetry-meta font-medium text-on-surface text-right">
                  CPCB Persistence Baseline
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-surface-container">
                <span>Calibration Network</span>
                <span className="font-telemetry-meta text-telemetry-meta text-on-surface">
                  Live Ground Telemetry ({city})
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-surface-container">
                <span>Validation Status</span>
                <span className="font-telemetry-meta text-telemetry-meta text-secondary font-semibold">
                  Continuous Real-Time Sync
                </span>
              </div>
            </div>

            <div className="bg-surface-container rounded-lg p-2.5 flex items-start gap-2 mt-1">
              <span className="material-symbols-outlined text-on-surface-variant text-[16px] shrink-0 mt-0.5">
                info
              </span>
              <p className="font-body-sm text-[11px] text-on-surface-variant leading-relaxed">
                <strong>Methodology Disclosure:</strong> Forecast estimates utilize an observational persistence model based on active CAAQMS observations. Numerical meteorological assimilation and multi-year training validation are in progress.
              </p>
            </div>
          </div>
        </div>
      </main>

      <AppNav />
    </>
  );
}
