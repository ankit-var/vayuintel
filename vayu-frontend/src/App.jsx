import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { VayuProvider } from './context/VayuContext';
import Dashboard from './pages/Dashboard';
import LiveTelemetry from './pages/LiveTelemetry';
import Forecast from './pages/Forecast';
import PollutionSource from './pages/PollutionSource';
import Alerts from './pages/Alerts';
import Transparency from './pages/Transparency';

function App() {
  return (
    <VayuProvider>
      <div className="app-shell w-full min-h-screen bg-surface sm:max-w-[480px] sm:mx-auto relative flex flex-col sm:shadow-2xl sm:border-x sm:border-outline-variant/20">
        <Router>
          <Routes>
            <Route path="/"            element={<Dashboard />} />
            <Route path="/live"        element={<LiveTelemetry />} />
            <Route path="/forecast"    element={<Forecast />} />
            <Route path="/sources"     element={<PollutionSource />} />
            <Route path="/alerts"      element={<Alerts />} />
            <Route path="/transparency" element={<Transparency />} />
          </Routes>
        </Router>
      </div>
    </VayuProvider>
  );
}

export default App;
