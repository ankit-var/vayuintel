import { useVayu } from '../context/VayuContext';

/**
 * A compact pill row showing live temperature, humidity and wind speed
 * fetched from Open-Meteo via the backend.
 */
export default function LiveWeatherBar() {
  const { weather } = useVayu();

  if (!weather || weather.temperature == null) {
    return null; // hide when backend is offline
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="inline-flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-full">
        <span className="material-symbols-outlined text-[14px] text-secondary">thermostat</span>
        <span className="font-telemetry-meta text-telemetry-meta text-on-surface">
          {weather.temperature != null ? `${weather.temperature}°C` : '—'}
        </span>
      </div>
      <div className="inline-flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-full">
        <span className="material-symbols-outlined text-[14px] text-secondary">humidity_percentage</span>
        <span className="font-telemetry-meta text-telemetry-meta text-on-surface">
          {weather.humidity != null ? `${weather.humidity}% RH` : '—'}
        </span>
      </div>
      <div className="inline-flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-full">
        <span className="material-symbols-outlined text-[14px] text-secondary">air</span>
        <span className="font-telemetry-meta text-telemetry-meta text-on-surface">
          {weather.wind_speed != null ? `${weather.wind_speed} km/h` : '—'}
        </span>
      </div>
      <span className="font-telemetry-meta text-telemetry-meta text-outline">Open-Meteo</span>
    </div>
  );
}
