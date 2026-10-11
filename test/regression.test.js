import test from 'node:test';
import assert from 'node:assert/strict';
import {
  aggregateStations,
  computeCityAverages,
  computeOverallAqi,
  getAqiCategory,
  POLLUTANT_THRESHOLDS,
  safeMultiplier,
  formatValue,
} from '../src/utils/dataUtils.js';

// ── 1. Route & Navigation Integrity ──────────────────────────────────────────
test('Route Regression: Navigation paths map directly to expected app routes', () => {
  const expectedRoutes = ['/', '/live', '/forecast', '/sources', '/alerts', '/transparency'];
  const navItems = [
    { label: 'Overview', to: '/' },
    { label: 'Stations', to: '/live' },
    { label: 'Forecast', to: '/forecast' },
    { label: 'Attribution', to: '/sources' },
    { label: 'Advisories', to: '/alerts' },
    { label: 'Sources', to: '/transparency' },
  ];

  for (const item of navItems) {
    assert.ok(expectedRoutes.includes(item.to), `Route ${item.to} should be registered in app`);
    assert.ok(item.label.length > 0);
  }
});

// ── 2. Forecast Ordering, Horizons, and Null Handling ────────────────────────
test('Forecast Regression: Ordering by horizon_hours and filtering logic', () => {
  const rawPredictions = [
    { horizon_hours: 12, aqi_projected: 240, timestamp: '2026-10-12T00:00:00Z' },
    { horizon_hours: 0, aqi_projected: 180, timestamp: '2026-10-11T12:00:00Z' },
    { horizon_hours: 48, aqi_projected: 310, timestamp: '2026-10-13T12:00:00Z' },
    { horizon_hours: 24, aqi_projected: 280, timestamp: '2026-10-12T12:00:00Z' },
    { horizon_hours: 6, aqi_projected: 210, timestamp: '2026-10-11T18:00:00Z' },
  ];

  // Ascending chronological sort
  const sorted = [...rawPredictions].sort((a, b) => a.horizon_hours - b.horizon_hours);
  assert.equal(sorted[0].horizon_hours, 0);
  assert.equal(sorted[1].horizon_hours, 6);
  assert.equal(sorted[2].horizon_hours, 12);
  assert.equal(sorted[3].horizon_hours, 24);
  assert.equal(sorted[4].horizon_hours, 48);

  // Filtering by 24h horizon
  const filtered24 = sorted.filter(p => p.horizon_hours <= 24);
  assert.equal(filtered24.length, 4);
  assert.equal(filtered24[filtered24.length - 1].horizon_hours, 24);

  // Peak projected AQI in 24h
  const validAqis24 = filtered24
    .map(p => p.aqi_projected)
    .filter(val => val != null && !Number.isNaN(val));
  const peak24 = Math.max(...validAqis24);
  assert.equal(peak24, 280);
});

test('Forecast Regression: Safe handling of empty, null, and non-numeric predictions', () => {
  const corruptPredictions = [
    { horizon_hours: 0, aqi_projected: null },
    { horizon_hours: 6, aqi_projected: undefined },
    { horizon_hours: 12, aqi_projected: NaN },
  ];

  const validAqis = corruptPredictions
    .map(p => p.aqi_projected)
    .filter(val => val != null && !Number.isNaN(val));

  const peak = validAqis.length > 0 ? Math.max(...validAqis) : null;
  assert.equal(peak, null);

  const cat = getAqiCategory(peak);
  assert.equal(cat.label, 'Unavailable');
});

// ── 3. Invalid Map Coordinates & Station Geolocation ─────────────────────────
test('Map Coordinates Regression: Drops null, zero, NaN, or malformed coordinates safely', () => {
  const observationsWithBadCoords = [
    {
      station_id: 'valid-st-1',
      location_name: 'Valid Station',
      coordinates: { latitude: 28.6139, longitude: 77.2090 },
      parameter: 'pm25',
      value: 85,
    },
    {
      station_id: 'bad-st-null',
      location_name: 'Null Coords Station',
      coordinates: null,
      parameter: 'pm25',
      value: 120,
    },
    {
      station_id: 'bad-st-zero',
      location_name: 'Null Island Coords',
      coordinates: { latitude: 0, longitude: 0 },
      parameter: 'pm25',
      value: 140,
    },
    {
      station_id: 'bad-st-nan',
      location_name: 'NaN Coords',
      coordinates: { latitude: NaN, longitude: 77.2090 },
      parameter: 'pm25',
      value: 95,
    },
    {
      station_id: 'bad-st-missing-lon',
      location_name: 'Missing Longitude',
      coordinates: { latitude: 28.6139 },
      parameter: 'pm25',
      value: 110,
    },
  ];

  const stations = aggregateStations(observationsWithBadCoords);
  // Only valid-st-1 should be retained for map display
  assert.equal(stations.length, 1);
  assert.equal(stations[0].id, 'valid-st-1');
  assert.equal(stations[0].lat, 28.6139);
  assert.equal(stations[0].lon, 77.2090);
});

// ── 4. AQI Data Handling & Category Boundary Regression ──────────────────────
test('AQI Regression: Exact boundary categorization without gaps', () => {
  const cases = [
    { val: -5, expected: 'Unavailable' },
    { val: 0, expected: 'Good' },
    { val: 50, expected: 'Good' },
    { val: 50.1, expected: 'Satisfactory' },
    { val: 100, expected: 'Satisfactory' },
    { val: 100.01, expected: 'Moderate' },
    { val: 200, expected: 'Moderate' },
    { val: 200.5, expected: 'Poor' },
    { val: 300, expected: 'Poor' },
    { val: 300.1, expected: 'Very Poor' },
    { val: 400, expected: 'Very Poor' },
    { val: 400.1, expected: 'Severe' },
    { val: 999, expected: 'Severe' },
  ];

  for (const { val, expected } of cases) {
    const res = getAqiCategory(val);
    assert.equal(res.label, expected, `AQI ${val} should yield category ${expected}`);
  }
});

// ── 5. Observations & Aggregation Edge Cases ─────────────────────────────────
test('Data Aggregation Regression: Safe math with empty or missing pollutant streams', () => {
  assert.equal(computeCityAverages([]).pm25, null);
  assert.equal(computeCityAverages([]).pm10, null);
  assert.equal(computeCityAverages([]).no2, null);

  const partialObs = [
    { parameter: 'pm25', value: null },
    { parameter: 'pm25', value: 120 },
    { parameter: 'co', value: 1.5 },
  ];
  const avgs = computeCityAverages(partialObs);
  assert.equal(avgs.pm25, 120);
  assert.equal(avgs.pm10, null);

  assert.equal(POLLUTANT_THRESHOLDS.pm25.safe, 60);
  assert.equal(computeOverallAqi([
    { station_id: 's1', coordinates: { latitude: 28.6, longitude: 77.2 }, aqi: 150 },
    { station_id: 's2', coordinates: { latitude: 28.7, longitude: 77.3 }, aqi: 280 },
  ]), 280);

  assert.equal(safeMultiplier(null, 'pm25'), null);
  assert.equal(safeMultiplier(120, 'pm25'), 2.0); // 120 / 60
  assert.equal(safeMultiplier(100, 'pm10'), 1.0); // 100 / 100

  assert.equal(formatValue(null, 'µg/m³'), '—');
  assert.equal(formatValue(NaN, 'µg/m³'), '—');
  assert.equal(formatValue(0, 'µg/m³'), '0.0 µg/m³');
});
