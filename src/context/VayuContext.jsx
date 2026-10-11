/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api, CITY_COORDS } from '../api';

const VayuContext = createContext(null);

export function VayuProvider({ children }) {
  const [city, setCity] = useState('delhi');
  const [weather, setWeather] = useState(null);
  const [observations, setObservations] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [forecasts, setForecasts] = useState([]);
  const [intelligence, setIntelligence] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Ping backend health and metadata
  useEffect(() => {
    api.health().then(h => setBackendOnline(h?.status === 'ok'));
    api.meta().then(m => { if (m) setMeta(m); });
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    // Clear previous city data immediately so stale values are never shown
    setWeather(null);
    setObservations([]);
    setAlerts([]);
    setForecasts([]);
    setIntelligence(null);
    try {
      const coords = CITY_COORDS[city];
      const [w, obs, al, fc, intel] = await Promise.all([
        api.weather(coords.lat, coords.lon),
        api.observations(city),
        api.alerts(city),
        api.forecasts(city),
        api.intelligence(city),
      ]);
      // Always set, even if null — prevents stale data from old city
      setWeather(w);
      setObservations(obs || []);
      setAlerts(al || []);
      setForecasts(fc || []);
      setIntelligence(intel);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, [city]);

  // Re-fetch whenever the selected city changes
  useEffect(() => { refresh(); }, [refresh]);

  return (
    <VayuContext.Provider value={{
      city, setCity,
      weather, observations, alerts, forecasts, intelligence,
      meta,
      loading, backendOnline, lastUpdated,
      refresh,
      coords: CITY_COORDS[city],
    }}>
      {children}
    </VayuContext.Provider>
  );
}

export const useVayu = () => useContext(VayuContext);
