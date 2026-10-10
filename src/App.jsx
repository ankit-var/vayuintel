import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LiveTelemetry from './pages/LiveTelemetry';
import Forecast from './pages/Forecast';
import PollutionSource from './pages/PollutionSource';
import Alerts from './pages/Alerts';
import Transparency from './pages/Transparency';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/live" element={<LiveTelemetry />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/sources" element={<PollutionSource />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/transparency" element={<Transparency />} />
      </Routes>
    </Router>
  );
}

export default App;
