import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/', label: 'Overview', icon: 'dashboard', dataPath: 'overview' },
  { path: '/live', label: 'Stations', icon: 'sensors', dataPath: 'stations' },
  { path: '/forecast', label: 'Forecast', icon: 'cyclone', dataPath: 'forecast' },
  { path: '/sources', label: 'Attribution', icon: 'neurology', dataPath: 'attribution' },
  { path: '/alerts', label: 'Advisories', icon: 'warning', dataPath: 'advisories' },
  { path: '/transparency', label: 'Sources', icon: 'database', dataPath: 'data-sources' },
];

export default function AppNav() {
  const location = useLocation();

  return (
    <nav
      aria-label="Main Navigation"
      className="fixed bottom-0 w-full z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_10px_rgba(0,0,0,0.04)]"
      data-active-classes="text-primary font-bold"
    >
      <div className="grid grid-cols-6 items-center h-16 px-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              data-path={item.dataPath}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary px-0.5 ${
                isActive
                  ? 'text-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] sm:text-[22px]" aria-hidden="true">
                {item.icon}
              </span>
              <span className="font-label-sm text-[9px] sm:text-[10px] tracking-tight truncate max-w-full text-center mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
