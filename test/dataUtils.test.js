import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AQI_CATEGORIES,
  getAqiCategory,
  POLLUTANT_THRESHOLDS,
  formatValue,
  formatTimeIST,
  isStale,
  getDataState,
  aggregateStations,
  computeCityAverages,
  safeMultiplier,
  computeOverallAqi,
} from '../src/utils/dataUtils.js';

test('getAqiCategory: CPCB standard boundaries', () => {
  assert.equal(AQI_CATEGORIES.length, 6);
  // Good (0-50)
  assert.equal(getAqiCategory(0).label, 'Good');
  assert.equal(getAqiCategory(50).label, 'Good');

  // Satisfactory (51-100)
  assert.equal(getAqiCategory(51).label, 'Satisfactory');
  assert.equal(getAqiCategory(100).label, 'Satisfactory');

  // Moderate (101-200)
  assert.equal(getAqiCategory(101).label, 'Moderate');
  assert.equal(getAqiCategory(200).label, 'Moderate');

  // Poor (201-300)
  assert.equal(getAqiCategory(201).label, 'Poor');
  assert.equal(getAqiCategory(300).label, 'Poor');

  // Very Poor (301-400)
  assert.equal(getAqiCategory(301).label, 'Very Poor');
  assert.equal(getAqiCategory(400).label, 'Very Poor');

  // Severe (401-500 and beyond)
  assert.equal(getAqiCategory(401).label, 'Severe');
  assert.equal(getAqiCategory(500).label, 'Severe');
  assert.equal(getAqiCategory(650).label, 'Severe');
});

test('getAqiCategory: null, undefined, NaN handling', () => {
  assert.equal(getAqiCategory(null).label, 'Unavailable');
  assert.equal(getAqiCategory(undefined).label, 'Unavailable');
  assert.equal(getAqiCategory(NaN).label, 'Unavailable');
});

test('safeMultiplier: computes ratio vs CPCB thresholds', () => {
  assert.equal(POLLUTANT_THRESHOLDS.pm25.safe, 60);
  assert.equal(POLLUTANT_THRESHOLDS.pm10.safe, 100);
  assert.equal(safeMultiplier(120, 'pm25'), 2.0); // 120 / 60
  assert.equal(safeMultiplier(300, 'pm10'), 3.0); // 300 / 100
  assert.equal(safeMultiplier(null, 'pm25'), null);
  assert.equal(safeMultiplier(NaN, 'pm25'), null);
  assert.equal(safeMultiplier(50, 'unknown_pollutant'), null);
});

test('formatValue and formatTimeIST', () => {
  assert.equal(formatValue(24.56, 'µg/m³'), '24.6 µg/m³');
  assert.equal(formatValue(null, 'µg/m³'), '—');
  assert.equal(formatValue(undefined, 'µg/m³'), '—');

  assert.equal(formatTimeIST(null), '—');
  assert.match(formatTimeIST('2026-10-11T12:00:00Z'), /\d{1,2}:\d{2}/);
});

test('isStale and getDataState', () => {
  const recent = new Date().toISOString();
  const old = new Date(Date.now() - 3 * 3600 * 1000).toISOString(); // 3 hours ago

  assert.equal(isStale(recent), false);
  assert.equal(isStale(old), true);
  assert.equal(isStale(null), true);

  assert.equal(getDataState(150, recent), 'LIVE');
  assert.equal(getDataState(150, old), 'STALE');
  assert.equal(getDataState(null, recent), 'UNAVAILABLE');
  assert.equal(getDataState(NaN, recent), 'UNAVAILABLE');
});

test('aggregateStations: groups multi-pollutant observations', () => {
  const raw = [
    {
      station_id: 'st-1',
      location_name: 'Anand Vihar',
      coordinates: { latitude: 28.65, longitude: 77.30 },
      parameter: 'pm25',
      value: 180,
      unit: 'µg/m³',
      aqi: 345,
      category: 'Very Poor',
      timestamp: '2026-10-11T10:00:00Z',
      source: 'CPCB',
    },
    {
      station_id: 'st-1',
      location_name: 'Anand Vihar',
      coordinates: { latitude: 28.65, longitude: 77.30 },
      parameter: 'pm10',
      value: 290,
      unit: 'µg/m³',
      aqi: 345,
      category: 'Very Poor',
      timestamp: '2026-10-11T10:00:00Z',
      source: 'CPCB',
    },
    {
      station_id: 'invalid-st',
      location_name: 'Missing Coords',
      coordinates: null, // Should be ignored
      parameter: 'pm25',
      value: 50,
    },
  ];

  const stations = aggregateStations(raw);
  assert.equal(stations.length, 1);
  assert.equal(stations[0].id, 'st-1');
  assert.equal(stations[0].parameters.pm25.value, 180);
  assert.equal(stations[0].parameters.pm10.value, 290);
  assert.equal(stations[0].aqi, 345);
});

test('computeCityAverages: calculates pollutant averages accurately', () => {
  const obs = [
    { parameter: 'pm25', value: 100 },
    { parameter: 'pm25', value: 200 },
    { parameter: 'pm10', value: 300 },
  ];
  const avgs = computeCityAverages(obs);
  assert.equal(avgs.pm25, 150);
  assert.equal(avgs.pm10, 300);
  assert.equal(avgs.no2, null);
});

test('computeOverallAqi: finds maximum station AQI without fallbacks', () => {
  const obs = [
    { station_id: 's1', coordinates: { latitude: 28.6, longitude: 77.2 }, aqi: 120 },
    { station_id: 's2', coordinates: { latitude: 28.7, longitude: 77.3 }, aqi: 310 },
  ];
  assert.equal(computeOverallAqi(obs), 310);
  assert.equal(computeOverallAqi([]), null);
  assert.equal(computeOverallAqi(null), null);
});
