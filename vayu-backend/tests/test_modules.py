import unittest
from app.alerts import get_cpcb_category, generate_alerts
from app.intelligence import generate_intelligence
from app.aqi_calculator import calculate_sub_index, get_cpcb_aqi, PM25_BREAKPOINTS, PM10_BREAKPOINTS

class TestModules(unittest.TestCase):
    def test_cpcb_categories(self):
        self.assertEqual(get_cpcb_category(45)["category"], "Good")
        self.assertEqual(get_cpcb_category(150)["category"], "Moderate")
        self.assertEqual(get_cpcb_category(250)["category"], "Poor")
        self.assertEqual(get_cpcb_category(350)["category"], "Very Poor")
        self.assertEqual(get_cpcb_category(450)["category"], "Severe")
        
        # Test alert severity
        self.assertEqual(get_cpcb_category(50)["severity"], "INFO")
        self.assertEqual(get_cpcb_category(250)["severity"], "CRITICAL")

    def test_generate_alerts(self):
        # Moderate AQI should not generate current alert, but a predicted severe AQI should
        current_data = {"aqi": 150, "prominent_pollutant": "PM2.5"}
        forecast = [
            {"aqi_projected": 150, "is_observed": True, "horizon_hours": 0, "timestamp": "now"},
            {"aqi_projected": 350, "is_observed": False, "horizon_hours": 10, "timestamp": "future"}
        ]
        
        alerts = generate_alerts("delhi", current_data, forecast)
        self.assertEqual(len(alerts), 1)
        self.assertTrue(alerts[0]["is_predicted"])
        self.assertIn("Very Poor", alerts[0]["title"])
        
        # Severe AQI should generate current alert
        current_data_severe = {"aqi": 450, "prominent_pollutant": "PM10"}
        forecast_severe = [
            {"aqi_projected": 450, "is_observed": True, "horizon_hours": 0, "timestamp": "now"},
            {"aqi_projected": 450, "is_observed": False, "horizon_hours": 10, "timestamp": "future"}
        ]
        alerts_severe = generate_alerts("delhi", current_data_severe, forecast_severe)
        self.assertEqual(len(alerts_severe), 1)  # Only current alert, forecast is not worse
        self.assertFalse(alerts_severe[0]["is_predicted"])

    def test_missing_data(self):
        self.assertEqual(len(generate_alerts("delhi", None, [])), 0)
        self.assertEqual(len(generate_alerts("delhi", {}, [])), 0)

    def test_intelligence_generation(self):
        obs = [{"parameter": "pm25", "value": 50, "station_id": "s1"}]
        weather = {"temperature": 10, "wind_speed": 3.0, "humidity": 80, "source": "Open-Meteo"}
        aqi_data = {"aqi": 150, "prominent_pollutant": "PM2.5"}
        
        intel = generate_intelligence("delhi", obs, weather, aqi_data)
        
        # Facts vs Hypotheses
        self.assertIn("current AQI is 150", intel["measured_facts"])
        self.assertIn("Low wind speeds may cause pollutants", intel["weather_context"])
        self.assertIn("Cooler temperatures can lead to thermal inversions", intel["weather_context"])
        self.assertIn("vehicular exhaust, construction dust", intel["source_hypotheses"])
        self.assertIn("general hypotheses", intel["source_hypotheses"])
        self.assertEqual(intel["location"], "delhi")

    def test_aqi_calculator_contiguous_breakpoints(self):
        # Test boundary gap fix: concentrations between 30 and 31 (e.g. 30.5) must not return None
        sub_idx_30 = calculate_sub_index(30.0, PM25_BREAKPOINTS)
        sub_idx_30_5 = calculate_sub_index(30.5, PM25_BREAKPOINTS)
        sub_idx_31 = calculate_sub_index(31.0, PM25_BREAKPOINTS)
        self.assertIsNotNone(sub_idx_30)
        self.assertIsNotNone(sub_idx_30_5)
        self.assertIsNotNone(sub_idx_31)
        self.assertEqual(sub_idx_30, 50)
        self.assertTrue(50 <= sub_idx_30_5 <= 53)

        # Test PM10 boundary values
        sub_idx_50 = calculate_sub_index(50.0, PM10_BREAKPOINTS)
        sub_idx_50_5 = calculate_sub_index(50.5, PM10_BREAKPOINTS)
        self.assertIsNotNone(sub_idx_50)
        self.assertIsNotNone(sub_idx_50_5)

        # Test negative and null
        self.assertIsNone(calculate_sub_index(-5, PM25_BREAKPOINTS))
        self.assertIsNone(calculate_sub_index(None, PM25_BREAKPOINTS))

        # Test cap at 500 for values beyond max breakpoint
        self.assertEqual(calculate_sub_index(600, PM25_BREAKPOINTS), 500)

    def test_get_cpcb_aqi_aggregation(self):
        # Empty / None inputs return None
        self.assertIsNone(get_cpcb_aqi())
        self.assertIsNone(get_cpcb_aqi(pm25=None, pm10=None))

        # High PM2.5 dominates
        res = get_cpcb_aqi(pm25=150.0, pm10=60.0)
        self.assertIsNotNone(res)
        self.assertEqual(res["prominent_pollutant"], "PM2.5")
        self.assertTrue(res["aqi"] > 300)

        # High PM10 dominates
        res2 = get_cpcb_aqi(pm25=20.0, pm10=300.0)
        self.assertIsNotNone(res2)
        self.assertEqual(res2["prominent_pollutant"], "PM10")

if __name__ == '__main__':
    unittest.main()
