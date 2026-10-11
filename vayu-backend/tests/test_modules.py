import unittest
from app.alerts import get_cpcb_category, generate_alerts
from app.intelligence import generate_intelligence

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

if __name__ == '__main__':
    unittest.main()
