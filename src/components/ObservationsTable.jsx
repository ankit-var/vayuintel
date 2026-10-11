import { useVayu } from '../context/VayuContext';
import { formatTimeIST } from '../utils/dataUtils';

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

export default function ObservationsTable() {
  const { observations, loading } = useVayu();

  if (loading) {
    return (
      <div role="status" aria-live="polite" className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm py-4">
        <span className="material-symbols-outlined text-[16px] text-secondary animate-spin" aria-hidden="true">progress_activity</span>
        <span>Loading live observations…</span>
      </div>
    );
  }

  if (!observations || observations.length === 0) {
    return (
      <div role="status" className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm py-4 px-1">
        <span className="material-symbols-outlined text-[16px] text-outline" aria-hidden="true">cloud_off</span>
        <span>No live observations available. Backend may be offline or OpenAQ returned no data for this city.</span>
      </div>
    );
  }

  // Group by parameter, show latest per parameter per station (max 12 rows)
  const rows = observations.slice(0, 12);

  return (
    <div className="overflow-x-auto rounded-xl border border-outline-variant shadow-xs">
      <table className="w-full text-left border-collapse min-w-full" aria-label="Real-time Air Quality Observations">
        <thead>
          <tr className="bg-surface-container-low">
            <th scope="col" className="px-3 py-2 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Parameter
            </th>
            <th scope="col" className="px-3 py-2 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Value
            </th>
            <th scope="col" className="px-3 py-2 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider hidden sm:table-cell">
              Station
            </th>
            <th scope="col" className="px-3 py-2 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider hidden sm:table-cell">
              Time (IST)
            </th>
            <th scope="col" className="px-3 py-2 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider hidden md:table-cell">
              Source
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((obs, i) => (
            <tr key={i} className={`border-t border-outline-variant ${i % 2 === 0 ? '' : 'bg-surface-container-lowest/40'}`}>
              <td className="px-3 py-2">
                <div className="font-label-md text-label-md text-on-surface font-semibold">
                  {PARAM_LABELS[obs.parameter] || obs.parameter}
                </div>
                {/* Mobile sub-row showing station and time when columns are hidden */}
                <div className="text-[10px] text-on-surface-variant font-normal sm:hidden mt-0.5">
                  #{obs.station_id} · {formatTimeIST(obs.timestamp)}
                </div>
              </td>
              <td className="px-3 py-2 font-telemetry-num text-telemetry-num text-on-surface" style={{ fontSize: '14px', lineHeight: '20px' }}>
                {formatVal(obs.value, obs.unit)}
              </td>
              <td className="px-3 py-2 font-body-sm text-body-sm text-on-surface-variant hidden sm:table-cell">
                #{obs.station_id}
              </td>
              <td className="px-3 py-2 font-telemetry-meta text-telemetry-meta text-on-surface-variant hidden sm:table-cell">
                {formatTimeIST(obs.timestamp)}
              </td>
              <td className="px-3 py-2 font-telemetry-meta text-telemetry-meta text-outline hidden md:table-cell">
                {obs.source}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-3 py-2 bg-surface-container-low flex items-center gap-1.5 rounded-b-xl border-t border-outline-variant/30">
        <span className="material-symbols-outlined text-[13px] text-outline flex-shrink-0" aria-hidden="true">info</span>
        <span className="font-telemetry-meta text-[11px] text-outline">
          Live data stream · Showing {rows.length} of {observations.length} readings
        </span>
      </div>
    </div>
  );
}
