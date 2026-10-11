import { useVayu } from '../context/VayuContext';

/**
 * Shared header used by every page.
 * Props:
 *   pageTitle  – the subtitle shown on the second row (e.g. "Overview")
 */
export default function AppHeader({ pageTitle }) {
  const { city, setCity, backendOnline, lastUpdated, loading } = useVayu();

  const fmt = lastUpdated
    ? lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 px-3 sm:px-space-md flex flex-col justify-between py-space-xs">
        {/* Top row: logo + controls */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <img alt="Vayu Intel" className="h-6 sm:h-7 w-auto object-contain flex-shrink-0" src="/vayu-logo.svg" />
            {/* Live pulsing dot — green when backend online, grey otherwise */}
            <div
              className="relative flex items-center justify-center flex-shrink-0"
              role="status"
              aria-label={backendOnline ? 'Backend service online' : 'Backend offline'}
              title={backendOnline ? 'Backend online' : 'Backend offline'}
            >
              <div className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-secondary' : 'bg-outline'}`}></div>
              {backendOnline && (
                <div className="absolute w-3.5 h-3.5 rounded-full bg-secondary-container/40 animate-ping"></div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* City selector — drives global context */}
            <div className="relative flex items-center bg-surface-container-low rounded-lg px-2 py-1 min-h-[36px]">
              <span className="material-symbols-outlined text-[16px] text-secondary mr-1 flex-shrink-0" aria-hidden="true">
                location_city
              </span>
              <label htmlFor="city-select" className="sr-only">Select City</label>
              <select
                id="city-select"
                aria-label="Select monitoring city"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="bg-transparent font-label-sm text-xs sm:text-label-sm text-on-surface focus:outline-none appearance-none pr-4 cursor-pointer max-w-[90px] sm:max-w-[120px] truncate"
              >
                <option value="delhi">Delhi NCR</option>
                <option value="bengaluru">Bengaluru</option>
                <option value="patna">Patna</option>
              </select>
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant pointer-events-none absolute right-1" aria-hidden="true">
                expand_more
              </span>
            </div>

            <button
              type="button"
              aria-label="Notifications"
              className="hidden sm:flex w-9 sm:w-11 h-9 sm:h-11 min-w-[36px] min-h-[36px] items-center justify-center text-on-surface-variant hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]" aria-hidden="true">notifications</span>
            </button>
            <div
              role="img"
              aria-label="Active user profile"
              className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
            >
              <span className="material-symbols-outlined text-on-primary text-[16px] sm:text-[18px]" aria-hidden="true">person</span>
            </div>
          </div>
        </div>

        {/* Bottom row: page title + data label */}
        <div className="flex items-center justify-between px-0.5 gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <h1 className="font-headline-sm text-label-md sm:text-headline-sm text-on-surface capitalize truncate">
              {pageTitle}
            </h1>
            {loading && (
              <span
                role="status"
                aria-label="Refreshing data"
                className="material-symbols-outlined text-[14px] text-secondary animate-spin flex-shrink-0"
              >
                progress_activity
              </span>
            )}
          </div>
          <div className="inline-flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-full flex-shrink-0">
            <span className="material-symbols-outlined text-[12px] text-secondary flex-shrink-0" aria-hidden="true">info</span>
            <span className="font-telemetry-meta text-[10px] sm:text-telemetry-meta text-on-surface-variant truncate max-w-[150px] sm:max-w-none">
              {fmt ? `Updated ${fmt}` : 'MVP Demo Data'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
