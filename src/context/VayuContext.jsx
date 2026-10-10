import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, CITY_COORDS } from '../api';

const VayuContext = createContext(null);

export function VayuProvider({ children }) {
  const [city, setCity] = useState('delhi');
  const [weather, setWeather] = useState(null);
  const [observations, setObservations] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Ping backend health
  useEffect(() => {
    api.health().then(h => setBackendOnline(h?.status === 'ok'));
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const coords = CITY_COORDS[city];
      const [w, obs, al, fc] = await Promise.all([
        api.weather(coords.lat, coords.lon),
        api.observations(city),
        api.alerts(city),
        api.forecasts(city),
      ]);
      if (w)   setWeather(w);
      if (obs) setObservations(obs);
      if (al)  setAlerts(al);
      if (fc)  setForecasts(fc);
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
      weather, observations, alerts, forecasts,
      loading, backendOnline, lastUpdated,
      refresh,
      coords: CITY_COORDS[city],
    }}>
      {children}
    </VayuContext.Provider>
  );
}

export const useVayu = () => useContext(VayuContext);
