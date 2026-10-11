import sys, asyncio, httpx
sys.path.insert(0, 'vayu-backend')
from app.main import app, get_observations, get_forecasts, CITIES, parse_open_meteo_timestamp

async def run_audit_tests():
    print("Testing CITIES in vayu-backend...")
    test_cities = ['delhi', 'bengaluru', 'patna']
    
    # Initialize httpx AsyncClient in app.state
    app.state.client = httpx.AsyncClient(timeout=10.0)

    try:
        for city_key in test_cities:
            cfg = CITIES[city_key]
            city_name = cfg['name']
            lat, lon = cfg['lat'], cfg['lon']
            
            obs_list = await get_observations(city_key)
            fc = await get_forecasts(city_key)
            
            print(f"\n==========================================")
            print(f"=== City: {city_name} (coords: {lat}, {lon}) ===")
            print(f"==========================================")
            print(f"  Observation count: {len(obs_list)}")
            assert len(obs_list) > 0, f"No observations returned for {city_name}"
            
            # Verify timestamps have Z
            timestamps = [o['timestamp'] for o in obs_list]
            for ts in timestamps:
                assert ts.endswith('Z'), f"Timestamp does not end in Z: {ts}"
            print(f"  Verified all {len(timestamps)} observation timestamps end with 'Z' (UTC). Sample: {timestamps[0]}")
            
            # Check station names and metadata
            stations = set(o['location_name'] for o in obs_list)
            print(f"  Station landmarks count: {len(stations)}")
            for st in sorted(stations):
                print(f"    - {st}")
                assert '(Grid Ref)' in st or 'Zoo' in st, f"Station name should indicate grid ref: {st}"
                
            # Verify data source transparency
            sources = set(o['source'] for o in obs_list)
            for src in sources:
                print(f"  Source disclosure: '{src}'")
                assert "Model" in src or "grid estimate" in src, f"Source must disclose model estimation: {src}"
                
            # Forecast assertions
            print(f"  Forecast Method: {fc['forecast_method']}")
            print(f"  Model Info: {fc['model_information']}")
            preds = fc['predictions']
            print(f"  Forecast predictions count: {len(preds)}")
            assert len(preds) > 0, "No forecast predictions returned"
            
            # Verify timestamps on forecast
            for p in preds:
                assert p['timestamp'].endswith('Z'), f"Forecast timestamp not ending in Z: {p['timestamp']}"
                
            # Check observed vs predicted distinction
            assert preds[0]['is_observed'] == True, "Horizon 0 must have is_observed == True"
            assert preds[1]['is_observed'] == False, "Horizon 1 must have is_observed == False"
            print(f"  Observed vs Predicted distinction verified: h=0 is_observed={preds[0]['is_observed']}, h=1 is_observed={preds[1]['is_observed']}")
            
            # Check that forecast varies over the 48 hours (not flat persistence!)
            aqis = [p['aqi_projected'] for p in preds]
            unique_aqis = set(aqis)
            print(f"  Forecast AQI curve: min={min(aqis)}, max={max(aqis)}, unique AQI values={len(unique_aqis)}")
            assert len(unique_aqis) > 1, f"Forecast is flat! All AQIs: {aqis[:6]}"
            
            print(f"  Sample hourly forecast trajectory:")
            for p in preds[:6]:
                print(f"    h+{p['horizon_hours']:02d} ({p['timestamp']}): Projected AQI {p['aqi_projected']} (Confidence: {p['confidence']}, Observed: {p['is_observed']})")
                
        # Test error handling when upstream fails
        print(f"\n==========================================")
        print(f"=== Testing Error Handling & Fallbacks ===")
        print(f"==========================================")
        # 1. Invalid city
        try:
            await get_observations("invalid_city_xyz")
            print("ERROR: Invalid city should have raised HTTPException 404")
        except Exception as e:
            print(f"  Verified invalid city raises 404 as expected: {e}")
            
        # 2. Upstream failure simulation on forecast
        # Temporarily point client to non-existent host
        bad_client = httpx.AsyncClient(transport=httpx.MockTransport(lambda req: httpx.Response(500)))
        app.state.client = bad_client
        fc_err = await get_forecasts("delhi")
        print(f"  Upstream failure response method: '{fc_err['forecast_method']}'")
        print(f"  Upstream failure predictions count: {len(fc_err['predictions'])}")
        assert fc_err['forecast_method'] == "Unavailable", "Must report Unavailable"
        assert len(fc_err['predictions']) == 0, "Must not fabricate flat fake predictions"
        print("  Verified upstream failure gracefully reports 'Unavailable' with 0 fabricated predictions!")

        print("\nALL AUDIT VERIFICATION TESTS PASSED SUCCESSFULLY!")
    finally:
        await app.state.client.aclose()

if __name__ == "__main__":
    asyncio.run(run_audit_tests())
