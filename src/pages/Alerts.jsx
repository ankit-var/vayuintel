
import { useState } from "react";
import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { useVayu } from '../context/VayuContext';

export default function Alerts() {
  const { alerts, loading, city } = useVayu();
  const criticalAlert = alerts?.find(a => a.severity === 'CRITICAL' && !a.is_predicted);
  const allAlerts = alerts || [];
  // C-1: Advisory tab state
  const [activeTab, setActiveTab] = useState('citizens');
  // C-2: Exposure slider state
  const [sliderMinutes, setSliderMinutes] = useState(45);
  // Approximate: inhaled µg = ambient PM2.5 conc * minutes * lung deposition factor
  const ambientPm25 = 188; // demo value (µg/m³)
  const inhaledMcg = Math.round(ambientPm25 * sliderMinutes * 0.034);
  const cigEq = (inhaledMcg / 156).toFixed(1); // 1 cigarette ≈ 156 µg retained PM2.5
  return (
    <>
      <AppHeader pageTitle="Advisories" />
      <main className="flex flex-col relative w-full pt-20 pb-24 bg-surface px-space-md"><div className="flex flex-col w-full gap-space-md">

      {/* Live backend alerts */}
      {loading && (
        <div className="flex items-center gap-2 py-2 text-on-surface-variant font-body-sm text-body-sm">
          <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
          Loading live alerts…
        </div>
      )}

      {!loading && allAlerts.length === 0 && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-container border border-outline-variant">
          <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">No active alerts for {city}. Air quality is within safe limits.</span>
        </div>
      )}

      {!loading && allAlerts.length > 0 && (
        <div className="flex flex-col gap-2">
          {allAlerts.map(a => (
            <div key={a.id} className={`p-3 rounded-xl border flex items-start gap-2.5 ${
              a.severity === 'CRITICAL' ? 'bg-error-container border-error' : 'bg-surface-container border-outline-variant'
            }`}>
              <span className={`material-symbols-outlined text-[18px] flex-shrink-0 ${
                a.severity === 'CRITICAL' ? 'text-error' : 'text-secondary'
              }`}>warning</span>
              <div className="flex flex-col min-w-0 gap-0.5">
                <span className="font-label-md text-label-md text-on-surface font-semibold">{a.title}</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">{a.description}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-telemetry-meta text-telemetry-meta text-outline">
                    {a.is_predicted ? '⚡ Predicted' : '📡 Measured'} · {a.data_source}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

<div className="flex flex-col gap-1">
<div className="flex items-center gap-2">
<span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-error-container text-on-error-container">
<span className="material-symbols-outlined text-[16px]" style={{"fontVariationSettings":"'FILL' 1"}}>crisis_alert</span>
</span>
<h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">Alerts &amp; Health Intelligence</h1>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
      Early warnings, exposure mitigation, and administrative action triggers.
    </p>
</div>

{criticalAlert ? (
<div className="relative overflow-hidden rounded-xl bg-error-container text-on-error-container shadow-md p-space-md flex flex-col gap-space-sm">
<div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-error/15 blur-2xl pointer-events-none"></div>
<div className="flex items-center justify-between z-10">
<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error text-on-error shadow-sm">
<span className="w-2 h-2 rounded-full bg-on-error animate-ping"></span>
<span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">Active Alert · {criticalAlert.data_source}</span>
</div>
<span className="font-telemetry-meta text-telemetry-meta text-on-error-container opacity-80 flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">schedule</span> Active until {criticalAlert.active_until ? new Date(criticalAlert.active_until).toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit'}) : 'Ongoing'}
      </span>
</div>
<div className="flex flex-col gap-1 z-10">
<h2 className="font-headline-sm text-headline-sm font-bold text-on-error-container leading-snug">{criticalAlert.title}</h2>
<p className="font-body-sm text-body-sm text-on-error-container opacity-90">{criticalAlert.description}</p>
</div>
<div className="grid grid-cols-2 gap-space-xs z-10 bg-surface-container-lowest/70 backdrop-blur-sm rounded-lg p-space-sm">
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant">Current AQI (Measured)</span>
<div className="flex items-baseline gap-1 mt-0.5">
<span className="font-telemetry-num text-telemetry-num text-error font-bold">{criticalAlert.evidence?.match(/\d+/)?.[0] || '—'}</span>
</div>
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant">Prominent Pollutant</span>
<div className="flex items-center gap-1 mt-1">
<span className="font-label-md text-label-md text-on-surface font-semibold">{criticalAlert.evidence?.split('Prominent: ')?.[1] || criticalAlert.evidence}</span>
</div>
</div>
</div>
<div className="flex flex-col gap-1 z-10 bg-error/10 rounded-lg p-2.5">
<div className="flex items-center gap-1.5 text-on-error-container">
<span className="material-symbols-outlined text-[16px]">health_and_safety</span>
<span className="font-label-sm text-label-sm font-bold uppercase tracking-wide">Health Advisory</span>
</div>
<p className="font-body-sm text-body-sm text-on-error-container opacity-90 leading-tight">
  Consult official CPCB / local authority advisories for restrictions. Sensitive groups should limit outdoor exposure.
</p>
</div>
</div>
) : (
<div className="relative overflow-hidden rounded-xl bg-surface-container text-on-surface shadow-md p-space-md flex flex-col gap-space-sm">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[20px] text-secondary">check_circle</span>
<span className="font-headline-sm text-headline-sm font-bold text-on-surface">No Critical Alerts</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
  Current measured AQI does not meet the threshold for a critical health alert. Monitor updates and consult official CPCB advisories for any regulatory actions.
</p>
</div>
)}

<div className="relative rounded-xl overflow-hidden shadow-sm h-32 bg-surface-container">
<img className="w-full h-full object-cover" alt="Dense atmospheric haze and winter smog blanket over urban city road infrastructure in Delhi NCR during dawn, dramatic streetlights penetrating deep aerosol haze, environmental intelligence surveillance viewpoint, documentary photojournalism style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwPJ4IJ891QwFi29fAbh9n6e8S2S7l6ypm4ebbroGwUR6UvTI6nSNetJzzP2hu7CtrtHVD3waIFLkeJ2bs5J7LrWNbUT0wvUTOHVQh38QHjY8_Uq3AUAz3j6ubzd6KcifE1em30Zq-lM_nn3_MgB--x4dQngvIhuyy_XbXsIHFm98ZLBstqOFlw84UmKEuFNiOLq1JF4ecspelr32gcMXG1PyQAEo3mwFo_LkhE19EFOY92cCJkPFx"/>
<div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent flex items-end p-3">
<div className="flex items-center justify-between w-full">
<span className="font-label-sm text-label-sm text-on-primary font-medium flex items-center gap-1">
<span className="material-symbols-outlined text-[15px]">sensors</span> Station Camera: Anand Vihar Cluster #4
        </span>
<span className="px-2 py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur-sm text-on-surface font-telemetry-meta text-telemetry-meta">
          Live Met Stream
        </span>
</div>
</div>
</div>

<div className="flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-[20px] text-primary">shield_with_heart</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Targeted Health Action Protocols</h2>
</div>
<span className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">Adaptive Guidance</span>
</div>

<div className="flex overflow-x-auto gap-1 bg-surface-container p-1 rounded-xl scrollbar-none" id="advisoryTabs" role="tablist">
<button
  role="tab"
  aria-selected={activeTab === 'citizens'}
  onClick={() => setActiveTab('citizens')}
  className={`advisory-tab flex-1 whitespace-nowrap min-w-max px-3 py-2 rounded-lg font-label-md text-label-md font-semibold transition-all duration-150 ${activeTab === 'citizens' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
        Citizens &amp; Families
      </button>
<button
  role="tab"
  aria-selected={activeTab === 'workers'}
  onClick={() => setActiveTab('workers')}
  className={`advisory-tab flex-1 whitespace-nowrap min-w-max px-3 py-2 rounded-lg font-label-md text-label-md font-medium transition-all duration-150 ${activeTab === 'workers' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
        Outdoor &amp; Police
      </button>
<button
  role="tab"
  aria-selected={activeTab === 'schools'}
  onClick={() => setActiveTab('schools')}
  className={`advisory-tab flex-1 whitespace-nowrap min-w-max px-3 py-2 rounded-lg font-label-md text-label-md font-medium transition-all duration-150 ${activeTab === 'schools' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
        Schools &amp; Labs
      </button>
<button
  role="tab"
  aria-selected={activeTab === 'municipal'}
  onClick={() => setActiveTab('municipal')}
  className={`advisory-tab flex-1 whitespace-nowrap min-w-max px-3 py-2 rounded-lg font-label-md text-label-md font-medium transition-all duration-150 ${activeTab === 'municipal' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
        Municipal (DPCC)
      </button>
</div>

<div className={`advisory-panel ${activeTab === 'citizens' ? 'flex' : 'hidden'} flex-col gap-2.5`} id="panel-citizens" role="tabpanel">

<div className="flex items-start gap-3 p-space-sm bg-surface-container-lowest rounded-xl shadow-sm">
<div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-primary">
<span className="material-symbols-outlined text-[20px]">masks</span>
</div>
<div className="flex flex-col gap-0.5 min-w-0">
<div className="flex items-center justify-between">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Respirator Standard</span>
<span className="px-1.5 py-0.5 rounded bg-error/15 text-error font-label-sm text-label-sm font-bold">Mandatory</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Wear certified <strong className="text-on-surface">N95 or FFP2 respirators</strong> during unavoidable transit. Cloth or surgical masks offer near-zero sub-micron PM2.5 filtration.
          </p>
</div>
</div>

<div className="flex items-start gap-3 p-space-sm bg-surface-container-lowest rounded-xl shadow-sm">
<div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-secondary">
<span className="material-symbols-outlined text-[20px]">air_purifier_gen</span>
</div>
<div className="flex flex-col gap-0.5 min-w-0">
<div className="flex items-center justify-between">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Indoor Microclimate</span>
<span className="px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">Seal Windows</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Run HEPA purifiers continuously in sealed sleeping quarters. Keep all outer windows and ventilation vents closed between <strong className="text-on-surface">04:00 AM – 10:00 AM</strong> during peak inversion.
          </p>
</div>
</div>

<div className="flex items-start gap-3 p-space-sm bg-surface-container-lowest rounded-xl shadow-sm">
<div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-error">
<span className="material-symbols-outlined text-[20px]">personal_injury</span>
</div>
<div className="flex flex-col gap-0.5 min-w-0">
<div className="flex items-center justify-between">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">High Vulnerability Cohort</span>
<span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold">Strict Caution</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Elderly individuals, children under 12, and asthma patients must suspend morning jogging, outdoor yoga, and playground hours until AQI recedes below 250.
          </p>
</div>
</div>
</div>

<div className={`advisory-panel ${activeTab === 'workers' ? 'flex' : 'hidden'} flex-col gap-2.5`} id="panel-workers" role="tabpanel">

<div className="flex items-start gap-3 p-space-sm bg-surface-container-lowest rounded-xl shadow-sm">
<div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-primary">
<span className="material-symbols-outlined text-[20px]">published_with_changes</span>
</div>
<div className="flex flex-col gap-0.5 min-w-0">
<div className="flex items-center justify-between">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Junction Rotation Shifts</span>
<span className="px-1.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">3-Hour Max</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Mandatory rotational shifts of traffic enforcement personnel at severe intersections (Mukarba Chowk, ITO, Ashram) every 3 hours into clean-air mobile stations.
          </p>
</div>
</div>

<div className="flex items-start gap-3 p-space-sm bg-surface-container-lowest rounded-xl shadow-sm">
<div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-secondary">
<span className="material-symbols-outlined text-[20px]">local_drink</span>
</div>
<div className="flex flex-col gap-0.5 min-w-0">
<div className="flex items-center justify-between">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Safety Gear &amp; Hydration</span>
<span className="px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">Department Supply</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Immediate distribution of high-seal silicone half-mask respirators with replaceable P3 particulates, saline eyewash, and warm hydration stations at all ward checkpoints.
          </p>
</div>
</div>
</div>

<div className={`advisory-panel ${activeTab === 'schools' ? 'flex' : 'hidden'} flex-col gap-2.5`} id="panel-schools" role="tabpanel">

<div className="flex items-start gap-3 p-space-sm bg-surface-container-lowest rounded-xl shadow-sm">
<div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-error">
<span className="material-symbols-outlined text-[20px]">sports_soccer</span>
</div>
<div className="flex flex-col gap-0.5 min-w-0">
<div className="flex items-center justify-between">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Outdoor Sports Suspended</span>
<span className="px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">100% Ceased</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Immediate cessation of physical education drills, morning prayer assemblies in open courtyards, and inter-school sports trials until the advisory level downgrades.
          </p>
</div>
</div>

<div className="flex items-start gap-3 p-space-sm bg-surface-container-lowest rounded-xl shadow-sm">
<div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-primary">
<span className="material-symbols-outlined text-[20px]">computer</span>
</div>
<div className="flex flex-col gap-0.5 min-w-0">
<div className="flex items-center justify-between">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Hybrid Schedule Transition</span>
<span className="px-1.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">Classes Pre-K to 8</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Primary wings transition automatically to synchronous remote learning modules. Stagger secondary senior batches to commence past 09:30 AM to bypass peak inversion hours.
          </p>
</div>
</div>
</div>

<div className={`advisory-panel ${activeTab === 'municipal' ? 'flex' : 'hidden'} flex-col gap-2.5`} id="panel-municipal" role="tabpanel">

<div className="flex items-start gap-3 p-space-sm bg-surface-container-lowest rounded-xl shadow-sm">
<div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-secondary">
<span className="material-symbols-outlined text-[20px]">water_drop</span>
</div>
<div className="flex flex-col gap-0.5 min-w-0">
<div className="flex items-center justify-between">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Water Sprinkling &amp; Sweeping</span>
<span className="px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">13 Hotspots</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Continuous deployment of mechanized vacuum road sweepers followed by chemical dust-suppressant misting trucks across the 13 defined CAQM critical road arterials.
          </p>
</div>
</div>

<div className="flex items-start gap-3 p-space-sm bg-surface-container-lowest rounded-xl shadow-sm">
<div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-primary">
<span className="material-symbols-outlined text-[20px]">flare</span>
</div>
<div className="flex flex-col gap-0.5 min-w-0">
<div className="flex items-center justify-between">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Anti-Smog Gun Batteries</span>
<span className="px-1.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">Active Run</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Engage high-reach aerosol suppression cannons mounted at construction boundary perimeters and high-rise civic utility complexes continuously through nocturnal hours.
          </p>
</div>
</div>

<div className="flex items-start gap-3 p-space-sm bg-surface-container-lowest rounded-xl shadow-sm">
<div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-error">
<span className="material-symbols-outlined text-[20px]">local_fire_department</span>
</div>
<div className="flex flex-col gap-0.5 min-w-0">
<div className="flex items-center justify-between">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Night Biomass Patrols</span>
<span className="px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">Zero Tolerance</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Intensify joint nocturnal flying squads with Delhi Police to detect and penalize illegal open waste combustion, tire fires, and industrial landfill flares.
          </p>
</div>
</div>
</div>
</div>

<div className="flex flex-col p-space-sm rounded-xl bg-surface-container-low shadow-sm gap-space-xs">
<div className="flex items-center justify-between">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-[18px] text-secondary">vital_signs</span>
<span className="font-headline-sm text-headline-sm text-on-surface font-bold">Personal Exposure Estimator</span>
</div>
<span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-telemetry-meta text-telemetry-meta">
        Real-time Matrix
      </span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
      Adjust planned outdoor exposure time tonight to see biological PM2.5 lung retention:
    </p>

<div className="flex flex-col gap-1 mt-1">
<div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface">
<span>Outdoor Duration</span>
<span className="font-telemetry-num text-[16px] text-primary font-bold">{sliderMinutes} Mins</span>
</div>
<input
  className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
  id="exposureSlider"
  max="180" min="15" step="15"
  type="range"
  value={sliderMinutes}
  onChange={e => setSliderMinutes(Number(e.target.value))}
/>
<div className="flex justify-between font-telemetry-meta text-telemetry-meta text-on-surface-variant">
<span>15m Quick Run</span>
<span>60m Commute</span>
<span>180m Shift</span>
</div>
</div>

<div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest mt-1">
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant">Estimated PM2.5 Inhaled</span>
<span className="font-telemetry-num text-[18px] font-bold text-error">~ {inhaledMcg} µg</span>
</div>
<div className="flex flex-col items-end">
<span className="font-label-sm text-label-sm text-on-surface-variant">Cigarette Equivalence</span>
<span className="font-telemetry-num text-[18px] font-bold text-on-surface">~ {cigEq} Cigs</span>
</div>
</div>
</div>

<div className="flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-[20px] text-on-surface-variant">history_toggle_off</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Alert Enforcement Log (Past 7 Days)</h2>
</div>
<span className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">CAQM Portal Sync</span>
</div>

<div className="flex flex-col gap-2">

<div className="flex flex-col p-space-sm bg-surface-container-lowest rounded-xl shadow-sm gap-1.5">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="font-label-md text-label-md font-bold text-on-surface">GRAP Stage II: Night Transport Restriction</span>
</div>
<span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-telemetry-meta text-telemetry-meta">
            RESOLVED
          </span>
</div>
<div className="flex items-center gap-2 text-on-surface-variant font-telemetry-meta text-telemetry-meta">
<span>Oct 28, 20:00 IST – Oct 29, 08:30 IST</span>
<span>•</span>
<span>Peak AQI: 342</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
          Outcome: 412 non-destined diesel trucks diverted via Western Peripheral Expressway. Hotspot spraying completed across 9 major radial arteries.
        </p>
</div>

<div className="flex flex-col p-space-sm bg-surface-container-lowest rounded-xl shadow-sm gap-1.5">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="font-label-md text-label-md font-bold text-on-surface">Agricultural Residue Inflow Flare</span>
</div>
<span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-telemetry-meta text-telemetry-meta">
            RESOLVED
          </span>
</div>
<div className="flex items-center gap-2 text-on-surface-variant font-telemetry-meta text-telemetry-meta">
<span>Oct 26, 14:00 IST – Oct 27, 02:00 IST</span>
<span>•</span>
<span>Peak AQI: 378</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
          Outcome: ISRO VIIRS satellite telemetry verified 34% stubble contribution spike; industrial generator sets shifted to piped gas operation in Bawana.
        </p>
</div>

<div className="flex flex-col p-space-sm bg-surface-container-lowest rounded-xl shadow-sm gap-1.5">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="font-label-md text-label-md font-bold text-on-surface">Localized Road Dust Advisory: Okhla Zone</span>
</div>
<span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-telemetry-meta text-telemetry-meta">
            RESOLVED
          </span>
</div>
<div className="flex items-center gap-2 text-on-surface-variant font-telemetry-meta text-telemetry-meta">
<span>Oct 24, 09:00 IST – Oct 24, 18:00 IST</span>
<span>•</span>
<span>Peak AQI: 310</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
          Outcome: Rapid deployment of 4 mobile water tankers. 18 commercial construction sites penalized for open debris piles.
        </p>
</div>
</div>
</div>

<div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-high shadow-sm">
<div className="flex items-center gap-2.5">
<span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
<span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
</span>
<div className="flex flex-col">
<span className="font-label-md text-label-md font-bold text-on-surface">Sameer Pollution Helpline</span>
<span className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">Report illegal waste fires: 1800-180-1717</span>
</div>
</div>
<a href="tel:18001801717" className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-semibold flex items-center gap-1 shadow-sm">
<span className="material-symbols-outlined text-[14px]">call</span> Dial
    </a>
</div>

<div className="flex items-start gap-2 p-3 rounded-lg bg-surface-container-low text-on-surface-variant">
<span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">policy</span>
<p className="font-body-sm text-body-sm leading-relaxed">
      Alert thresholds strictly adhere to Commission for Air Quality Management (CAQM) &amp; Central Pollution Control Board (CPCB) Graded Response Action Plan (GRAP) protocols. Demonstration telemetry synthesized for hackathon MVP benchmarking.
    </p>
</div>
</div>
</main><nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_10px_rgba(0,0,0,0.04)]" data-active-classes="text-primary font-bold"><div className="grid grid-cols-6 items-center h-16 px-1"><Link className="flex flex-col items-center justify-center h-full min-h-[44px] text-on-surface-variant hover:text-on-surface transition-colors" data-path="overview" to="/"><span className="material-symbols-outlined text-[22px]">dashboard</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Overview</span></Link><Link className="flex flex-col items-center justify-center h-full min-h-[44px] text-on-surface-variant hover:text-on-surface transition-colors" data-path="stations" to="/live"><span className="material-symbols-outlined text-[22px]">sensors</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Stations</span></Link><Link className="flex flex-col items-center justify-center h-full min-h-[44px] text-on-surface-variant hover:text-on-surface transition-colors" data-path="forecast" to="/forecast"><span className="material-symbols-outlined text-[22px]">cyclone</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Forecast</span></Link><Link className="flex flex-col items-center justify-center h-full min-h-[44px] text-on-surface-variant hover:text-on-surface transition-colors" data-path="attribution" to="/sources"><span className="material-symbols-outlined text-[22px]">neurology</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Attribution</span></Link><Link aria-current="page" className="flex flex-col items-center justify-center h-full min-h-[44px] transition-colors text-primary font-bold" data-path="advisories" to="/alerts"><span className="material-symbols-outlined text-[22px]">warning</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Advisories</span></Link><Link className="flex flex-col items-center justify-center h-full min-h-[44px] text-on-surface-variant hover:text-on-surface transition-colors" data-path="data-sources" to="/transparency"><span className="material-symbols-outlined text-[22px]">database</span><span className="font-label-sm text-[10px] tracking-tight truncate mt-0.5">Sources</span></Link></div></nav>
    </>
  );
}
