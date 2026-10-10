import React from 'react';
import { useVayu } from '../context/VayuContext';

const PARAM_LABELS = {
  pm25: 'PM₂.₅',
  pm10: 'PM₁₀',
  no2:  'NO₂',
  o3:   'O₃',
  so2:  'SO₂',
  co:   'CO',
};

function formatVal(val, unit) {
  if (val === null || val === undefined) return '—';
  return `${Number(val).toFixed(1)} ${unit}`;
}

function formatTime(ts) {
  if (!ts) return '—';
  try {
    return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  } catch { return ts; }
}

export default function ObservationsTable() {
  const { observations, loading } = useVayu();

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm py-4">
        <span className="material-symbols-outlined text-[16px] text-secondary animate-spin">progress_activity</span>
        Loading live observations…
      </div>
    );
  }

  if (!observations || observations.length === 0) {
    return (
      <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm py-4 px-1">
        <span className="material-symbols-outlined text-[16px] text-outline">cloud_off</span>
        No live observations available. Backend may be offline or OpenAQ returned no data for this city.
      </div>
    );
  }

  // Group by parameter, show latest per parameter per station (max 12 rows)
  const rows = observations.slice(0, 12);

  return (
    <div className="overflow-x-auto rounded-xl border border-outline-variant">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low">
            <th className="px-3 py-2 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Parameter</th>
            <th className="px-3 py-2 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Value</th>
            <th className="px-3 py-2 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider hidden sm:table-cell">Station</th>
            <th className="px-3 py-2 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider hidden sm:table-cell">Time (UTC)</th>
            <th className="px-3 py-2 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Source</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((obs, i) => (
            <tr key={i} className={`border-t border-outline-variant ${i % 2 === 0 ? '' : 'bg-surface-container-lowest/40'}`}>
              <td className="px-3 py-2 font-label-md text-label-md text-on-surface font-semibold">
                {PARAM_LABELS[obs.parameter] || obs.parameter}
              </td>
              <td className="px-3 py-2 font-telemetry-num text-telemetry-num text-on-surface" style={{ fontSize: '14px', lineHeight: '20px' }}>
                {formatVal(obs.value, obs.unit)}
              </td>
              <td className="px-3 py-2 font-body-sm text-body-sm text-on-surface-variant hidden sm:table-cell">
                #{obs.station_id}
              </td>
              <td className="px-3 py-2 font-telemetry-meta text-telemetry-meta text-on-surface-variant hidden sm:table-cell">
                {formatTime(obs.timestamp)}
              </td>
              <td className="px-3 py-2 font-telemetry-meta text-telemetry-meta text-outline hidden md:table-cell">
                {obs.source}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-3 py-1.5 bg-surface-container-low flex items-center gap-1 rounded-b-xl">
        <span className="material-symbols-outlined text-[11px] text-outline">info</span>
        <span className="font-telemetry-meta text-telemetry-meta text-outline">
          Live data from OpenAQ · Showing {rows.length} of {observations.length} readings
        </span>
      </div>
    </div>
  );
}
