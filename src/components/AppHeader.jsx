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
      <div className="h-20 px-space-md flex flex-col justify-between py-space-xs">
        {/* Top row: logo + controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <img alt="Vayu Intelligence Logo" className="h-8 w-auto object-contain" src="/vayu-logo.svg" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-headline-sm text-headline-sm text-primary font-bold tracking-tight">Vayu Intel</span>
                {/* Live pulsing dot — green when backend online, grey otherwise */}
                <div className="relative flex items-center justify-center" title={backendOnline ? 'Backend online' : 'Backend offline'}>
                  <div className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-secondary' : 'bg-outline'}`}></div>
                  {backendOnline && (
                    <div className="absolute w-3.5 h-3.5 rounded-full bg-secondary-container/40 animate-ping"></div>
                  )}
                </div>
              </div>
              <span className="font-telemetry-meta text-telemetry-meta text-on-surface-variant flex items-center gap-1">
                {backendOnline ? 'Live Feed: CPCB & OpenAQ' : 'Backend offline — demo data'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-sm">
            {/* City selector — drives global context */}
            <div className="relative flex items-center bg-surface-container-low rounded-lg px-2 py-1">
              <span className="material-symbols-outlined text-[16px] text-secondary mr-1">location_city</span>
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="bg-transparent font-label-sm text-label-sm text-on-surface focus:outline-none appearance-none pr-4 cursor-pointer"
              >
                <option value="delhi">Delhi NCR</option>
                <option value="bengaluru">Bengaluru</option>
                <option value="patna">Patna</option>
              </select>
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant pointer-events-none absolute right-1">expand_more</span>
            </div>

            <button aria-label="Notifications" className="w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </div>

        {/* Bottom row: page title + data label */}
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-1.5">
            <span className="font-headline-sm text-headline-sm text-on-surface capitalize">{pageTitle}</span>
            {loading && (
              <span className="material-symbols-outlined text-[14px] text-secondary animate-spin">progress_activity</span>
            )}
          </div>
          <div className="inline-flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-full">
            <span className="material-symbols-outlined text-[12px] text-secondary">info</span>
            <span className="font-telemetry-meta text-telemetry-meta text-on-surface-variant">
              {fmt ? `Updated ${fmt}` : 'Illustrative MVP Demo Data'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
