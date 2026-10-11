import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
      <Router>
        <Routes>
          <Route path="/"            element={<Dashboard />} />
          <Route path="/live"        element={<LiveTelemetry />} />
          <Route path="/forecast"    element={<Forecast />} />
          <Route path="/sources"     element={<PollutionSource />} />
          <Route path="/alerts"      element={<Alerts />} />
          <Route path="/transparency" element={<Transparency />} />
          {/* Catch-all: redirect unknown paths to the dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </VayuProvider>
  );
}

export default App;
