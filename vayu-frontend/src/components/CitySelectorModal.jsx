import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CITY_COORDS } from '../api';

// Regional classification for Indian cities
const REGIONS = {
  All: null,
  North: ['delhi', 'jaipur', 'lucknow', 'kanpur', 'varanasi', 'gorakhpur', 'chandigarh'],
  South: ['bengaluru', 'chennai', 'hyderabad', 'kochi', 'visakhapatnam'],
  West: ['mumbai', 'pune', 'ahmedabad', 'surat'],
  Central: ['bhopal', 'indore', 'nagpur'],
  East: ['kolkata', 'patna'],
};

export default function CitySelectorModal({ isOpen, onClose, currentCity, onSelectCity }) {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const inputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearch('');
      setSelectedRegion('All');
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter cities by search text and region
  const filteredCities = useMemo(() => {
    const query = search.trim().toLowerCase();
    return Object.entries(CITY_COORDS).filter(([id, data]) => {
      // Region filter
      if (selectedRegion !== 'All' && !REGIONS[selectedRegion]?.includes(id)) {
        return false;
      }
      // Text search matching city id, label, or state
      if (!query) return true;
      const matchLabel = data.label.toLowerCase().includes(query);
      const matchState = data.state?.toLowerCase().includes(query) || false;
      const matchId = id.toLowerCase().includes(query);
      return matchLabel || matchState || matchId;
    });
  }, [search, selectedRegion]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Select City"
    >
      <div
        className="w-full sm:max-w-md bg-surface rounded-t-3xl sm:rounded-2xl max-h-[85vh] sm:max-h-[80vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-outline-variant/20 bg-surface-container-low/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-[16px] font-bold text-on-surface">Select Urban Center</h3>
              <p className="font-telemetry-meta text-[11px] text-on-surface-variant">21 Major Indian Cities & Hubs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 bg-surface-container-low/30 border-b border-outline-variant/15">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-3 pointer-events-none">
              search
            </span>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by city or state (e.g. Pune, UP)..."
              className="w-full pl-9 pr-9 py-2 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface placeholder:text-on-surface-variant/60 font-body-sm text-[13px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 text-on-surface-variant hover:text-on-surface"
                aria-label="Clear search"
              >
                <span className="material-symbols-outlined text-[16px]">cancel</span>
              </button>
            )}
          </div>

          {/* Region Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5">
            {Object.keys(REGIONS).map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-2.5 py-1 rounded-full font-label-sm text-[11px] whitespace-nowrap transition-all ${
                  selectedRegion === reg
                    ? 'bg-primary text-on-primary font-semibold shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* City List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-outline-variant/10">
          {filteredCities.length === 0 ? (
            <div className="py-10 text-center flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[32px] text-outline">location_off</span>
              <p className="font-body-sm text-sm text-on-surface-variant">No cities found matching "{search}"</p>
              <button
                onClick={() => { setSearch(''); setSelectedRegion('All'); }}
                className="mt-1 px-3 py-1 text-xs font-semibold text-primary hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredCities.map(([id, data]) => {
              const isSelected = currentCity === id;
              return (
                <button
                  key={id}
                  onClick={() => {
                    onSelectCity(id);
                    onClose();
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-primary/10 text-primary font-semibold border border-primary/20'
                      : 'hover:bg-surface-container-low text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">location_city</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-[14px] truncate">{data.label}</span>
                        {isSelected && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-primary text-on-primary shrink-0">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-on-surface-variant font-telemetry-meta">
                        <span>{data.state}</span>
                        <span>•</span>
                        <span>{data.lat.toFixed(2)}°N, {data.lon.toFixed(2)}°E</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 pl-2">
                    {isSelected ? (
                      <span className="material-symbols-outlined text-[20px] text-primary">check_circle</span>
                    ) : (
                      <span className="material-symbols-outlined text-[18px] text-outline/40">chevron_right</span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 bg-surface-container-lowest border-t border-outline-variant/15 flex items-center justify-between text-[11px] text-on-surface-variant">
          <span className="font-telemetry-meta">Telemetry: Open-Meteo & CAAQMS</span>
          <span className="font-medium text-secondary">21 Cities Covered</span>
        </div>
      </div>
    </div>
  );
}
