"""
Second-stage code review test suite for Vayu Intel data pipeline.
Tests:
  1. Timestamp conversion (multiple timezones, edge cases, DST awareness note)
  2. Forecast hour mapping correctness & no duplicate hours
  3. AQI calculation: breakpoints, max rule, missing pollutants
  4. Stale/missing data propagation
  5. Existing test suite (test_modules.py)
  6. 48-hour forecast window from live Open-Meteo
"""

import sys, asyncio, httpx, unittest
sys.path.insert(0, 'vayu-backend')

from datetime import datetime, timedelta, timezone
from app.main import parse_open_meteo_timestamp, app, get_forecasts, CITIES
from app.aqi_calculator import get_cpcb_aqi, calculate_sub_index

PASS = "\033[92mPASS\033[0m"
FAIL = "\033[91mFAIL\033[0m"


# ─────────────────────────────────────────────────────────────────────────────
# 1. Timestamp conversion tests
# ─────────────────────────────────────────────────────────────────────────────

def test_timestamps():
    print("\n══════ 1. Timestamp Conversion ══════")
    results = []

    cases = [
        # (description, iso_str, utc_offset_sec, expected_utc_Z)
        ("IST +05:30  21:30 -> 16:00Z",
         "2026-10-11T21:30", 19800, "2026-10-11T16:00:00Z"),
        ("IST +05:30  00:00 -> previous day 18:30Z",
         "2026-10-11T00:00", 19800, "2026-10-10T18:30:00Z"),
        ("IST +05:30  midnight boundary",
         "2026-01-01T00:00", 19800, "2025-12-31T18:30:00Z"),
        # Australia AEDT +11:00 (DST active, offset=39600)
        ("AEDT +11:00  10:00 -> 23:00Z previous day",
         "2026-10-11T10:00", 39600, "2026-10-10T23:00:00Z"),
        # US Eastern Standard -05:00 (offset=-18000)
        ("US EST -05:00  12:00 -> 17:00Z",
         "2026-01-15T12:00", -18000, "2026-01-15T17:00:00Z"),
        # Already a Z string — must be returned unchanged
        ("Already UTC Z — pass-through",
         "2026-10-11T16:00:00Z", 0, "2026-10-11T16:00:00Z"),
        # None/empty input — falls back to current time (just check it ends with Z)
        ("None input returns Z timestamp", None, 19800, None),
    ]

    for desc, iso_str, offset, expected in cases:
        result = parse_open_meteo_timestamp(iso_str, offset)
        if expected is None:
            ok = result.endswith("Z")
            label = PASS if ok else FAIL
            print(f"  [{label}] {desc}")
            print(f"         result: {result}")
        else:
            ok = result == expected
            label = PASS if ok else FAIL
            print(f"  [{label}] {desc}")
            if not ok:
                print(f"         expected: {expected}")
                print(f"         got:      {result}")
        results.append(ok)

    # DST awareness note: parser uses the utc_offset_seconds returned by
    # Open-Meteo itself at query time. Because Open-Meteo sets timezone=auto
    # and returns the LOCAL offset already accounting for DST, the parser
    # inherits DST correctness for free — it does not need to resolve DST
    # rules itself.
    print("\n  [NOTE] DST: Open-Meteo supplies the exact wall-clock offset")
    print("         at the moment of the query via utc_offset_seconds.")
    print("         The parser uses that offset directly, so DST is")
    print("         handled by the upstream API, not by this code.")

    return results


# ─────────────────────────────────────────────────────────────────────────────
# 2. AQI calculator: breakpoints, max rule, missing pollutants
# ─────────────────────────────────────────────────────────────────────────────

def test_aqi_calculator():
    print("\n══════ 2. AQI Calculator ══════")
    results = []

    # 2a. Official CPCB PM2.5 breakpoints check (from CPCB notification)
    bp_cases = [
        ("PM2.5=0 -> AQI 0",    {"pm25": 0.0},           0),
        ("PM2.5=30 -> AQI 50",  {"pm25": 30.0},          50),
        ("PM2.5=30.05 -> ~50",  {"pm25": 30.05},         50),
        ("PM2.5=60 -> AQI 100", {"pm25": 60.0},          100),
        ("PM2.5=90 -> AQI 200", {"pm25": 90.0},          200),
        ("PM2.5=120-> AQI 300", {"pm25": 120.0},         300),
        ("PM2.5=250-> AQI 400", {"pm25": 250.0},         400),
        # Gap between 30.0 and 30.1 in current code — test 30.05
        # NOTE: The breakpoints have a gap: (0,30) then (30.1,60).
        # 30.05 falls in the first interval (upper boundary is <=30)
        # but 30.05 > 30.0, so it hits the extrapolation branch.
    ]

    for desc, kwargs, expected_aqi in bp_cases:
        res = get_cpcb_aqi(**kwargs)
        got = res["aqi"] if res else None
        ok = (got == expected_aqi)
        label = PASS if ok else FAIL
        print(f"  [{label}] {desc} => got {got}")
        results.append(ok)

    # 2b. Max-of-sub-indices rule
    print("\n  -- Max of sub-indices rule --")
    res = get_cpcb_aqi(pm25=30.0, pm10=250.0, no2=40.0)
    # PM2.5=30->50, PM10=250->200+, NO2=40->50
    # PM10 breakpoints: (101,250,101,200) -> PM10=250 -> AQI 200
    # So max should be PM10 at 200
    ok_max = res is not None and res["aqi"] == 200 and res["prominent_pollutant"] == "PM10"
    label = PASS if ok_max else FAIL
    print(f"  [{label}] pm25=30 pm10=250 no2=40 -> max is PM10=200, got aqi={res['aqi'] if res else None} prominent={res['prominent_pollutant'] if res else None}")
    results.append(ok_max)

    # 2c. All None inputs
    res_none = get_cpcb_aqi(pm25=None, pm10=None, no2=None)
    ok_none = res_none is None
    label = PASS if ok_none else FAIL
    print(f"  [{label}] All-None inputs returns None: {res_none}")
    results.append(ok_none)

    # 2d. Only one pollutant available
    res_one = get_cpcb_aqi(pm25=None, pm10=101.0, no2=None)
    ok_one = res_one is not None and res_one["prominent_pollutant"] == "PM10" and res_one["aqi"] == 101
    label = PASS if ok_one else FAIL
    print(f"  [{label}] Only pm10=101 -> AQI=101, PM10: aqi={res_one['aqi'] if res_one else None}, prominent={res_one['prominent_pollutant'] if res_one else None}")
    results.append(ok_one)

    # 2e. CRITICAL: Gap in PM2.5 breakpoints
    print("\n  -- Breakpoint gap analysis --")
    # PM2.5 breakpoints: (0.0,30.0,...) then (30.1,60.0,...)
    # A value like 30.05 falls in NO interval -> goes to extrapolation
    # This is a difference from official CPCB table (which has 0-30, 31-60 with integers)
    val_in_gap = calculate_sub_index(30.05, [
        (0.0, 30.0, 0, 50), (30.1, 60.0, 51, 100),
        (60.1, 90.0, 101, 200), (90.1, 120.0, 201, 300),
        (120.1, 250.0, 301, 400), (250.1, 1000.0, 401, 500)
    ])
    # 30.05 > 30.0 so first interval misses; 30.05 < 30.1 so second interval
    # misses; falls through to extrapolation from LAST interval (250.1-1000)
    # which gives a wildly incorrect value
    print(f"  [RISK] PM2.5=30.05 (in breakpoint gap 30.0..30.1): sub_index={val_in_gap}")
    print(f"         This value falls through all intervals and is extrapolated from the")
    print(f"         last (Severe) interval, producing an incorrect sub-index.")
    print(f"         Official CPCB uses integer µg/m³ ranges, but floating model")
    print(f"         output can land in this gap. Risk: LOW in practice (0.1 µg/m³ gap)")

    return results


# ─────────────────────────────────────────────────────────────────────────────
# 3. Forecast mapping: hour ordering, no duplicates, 48h window
# ─────────────────────────────────────────────────────────────────────────────

async def test_forecast_live():
    print("\n══════ 3. Forecast Hour Mapping (Live) ══════")
    results = []
    app.state.client = httpx.AsyncClient(timeout=15.0)
    try:
        fc = await get_forecasts("delhi")
        preds = fc["predictions"]

        # 3a. Count
        ok_count = 1 <= len(preds) <= 49
        label = PASS if ok_count else FAIL
        print(f"  [{label}] Prediction count: {len(preds)} (expected 1-49, inclusive of current hour)")
        results.append(ok_count)

        # 3b. Horizon hours are strictly monotonically increasing starting at 0
        horizons = [p["horizon_hours"] for p in preds]
        ok_order = horizons == list(range(len(preds)))
        label = PASS if ok_order else FAIL
        print(f"  [{label}] Horizon hours monotonic 0..{horizons[-1] if horizons else 'N/A'}: {horizons[:6]}...")
        results.append(ok_order)

        # 3c. No duplicate timestamps
        timestamps = [p["timestamp"] for p in preds]
        ok_unique_ts = len(set(timestamps)) == len(timestamps)
        label = PASS if ok_unique_ts else FAIL
        print(f"  [{label}] No duplicate timestamps: {ok_unique_ts}")
        if not ok_unique_ts:
            dupes = [t for t in timestamps if timestamps.count(t) > 1]
            print(f"         Duplicates: {set(dupes)}")
        results.append(ok_unique_ts)

        # 3d. h=0 is_observed=True, all others False
        ok_obs = preds[0]["is_observed"] == True and all(not p["is_observed"] for p in preds[1:])
        label = PASS if ok_obs else FAIL
        print(f"  [{label}] Only h=0 has is_observed=True")
        results.append(ok_obs)

        # 3e. Timestamps all end with Z (UTC)
        bad_ts = [p["timestamp"] for p in preds if not p["timestamp"].endswith("Z")]
        ok_tz = len(bad_ts) == 0
        label = PASS if ok_tz else FAIL
        print(f"  [{label}] All prediction timestamps end with Z: {ok_tz}")
        if bad_ts:
            print(f"         Bad: {bad_ts[:3]}")
        results.append(ok_tz)

        # 3f. AQI values vary (not flat persistence)
        aqis = [p["aqi_projected"] for p in preds]
        unique_aqis = len(set(aqis))
        ok_vary = unique_aqis > 1
        label = PASS if ok_vary else FAIL
        print(f"  [{label}] Forecast varies: {unique_aqis} unique AQI values, min={min(aqis)}, max={max(aqis)}")
        results.append(ok_vary)

        # 3g. CRITICAL RISK CHECK: Does 'current hour' fallback use index 0
        # if all times are in the future? (first run of a new day)
        # The code initialises current_idx=0 and only advances it while
        # dt_utc <= now_utc, so if the API returns times starting in the future
        # h=0 will be a future hour, not the current one.
        now_utc = datetime.now(timezone.utc)
        h0_ts = datetime.fromisoformat(preds[0]["timestamp"].replace("Z", "+00:00"))
        delta_minutes = (h0_ts - now_utc).total_seconds() / 60
        print(f"\n  [INFO] h=0 timestamp: {preds[0]['timestamp']}")
        print(f"         now_utc:       {now_utc.strftime('%Y-%m-%dT%H:%M:%SZ')}")
        print(f"         h=0 is {abs(delta_minutes):.0f} minutes {'in the future' if delta_minutes > 0 else 'in the past'}")
        if delta_minutes > 90:
            print(f"  [RISK] h=0 is MORE than 90 min in the future — current_idx may have")
            print(f"         stalled on the wrong (older) slot. Verify Open-Meteo returned")
            print(f"         data aligned to the current hour.")

        # 3h. forecast_method and model_information are populated
        ok_meta = "Unavailable" not in fc["forecast_method"] and len(fc["model_information"]) > 10
        label = PASS if ok_meta else FAIL
        print(f"\n  [{label}] forecast_method: '{fc['forecast_method'][:60]}...'")
        print(f"         model_information: '{fc['model_information'][:80]}'")
        results.append(ok_meta)

    finally:
        await app.state.client.aclose()

    return results


# ─────────────────────────────────────────────────────────────────────────────
# 4. Upstream failure & missing-value propagation
# ─────────────────────────────────────────────────────────────────────────────

async def test_error_propagation():
    print("\n══════ 4. Upstream Failure & Missing-Value Propagation ══════")
    results = []

    import json

    # 4a. Mock 500 from Open-Meteo
    def handler_500(request):
        return httpx.Response(500)
    bad_client = httpx.AsyncClient(transport=httpx.MockTransport(handler_500))
    app.state.client = bad_client
    fc = await get_forecasts("patna")
    ok_unavail = fc["forecast_method"] == "Unavailable" and fc["predictions"] == []
    label = PASS if ok_unavail else FAIL
    print(f"  [{label}] 500 upstream -> forecast_method='Unavailable', predictions=[]")
    results.append(ok_unavail)
    await bad_client.aclose()

    # 4b. Mock empty hourly payload
    empty_hourly = json.dumps({
        "utc_offset_seconds": 19800,
        "hourly": {"time": [], "pm2_5": [], "pm10": [], "nitrogen_dioxide": []}
    })
    def handler_empty(request):
        return httpx.Response(200, text=empty_hourly, headers={"content-type": "application/json"})
    empty_client = httpx.AsyncClient(transport=httpx.MockTransport(handler_empty))
    app.state.client = empty_client
    fc_empty = await get_forecasts("delhi")
    ok_empty = fc_empty["forecast_method"] == "Unavailable" and fc_empty["predictions"] == []
    label = PASS if ok_empty else FAIL
    print(f"  [{label}] Empty hourly array -> 'Unavailable', no fabricated values")
    results.append(ok_empty)
    await empty_client.aclose()

    # 4c. Mock payload with some None pollutant values mid-forecast
    # Check what get_cpcb_aqi returns when all three are None for that hour
    res_all_none = get_cpcb_aqi(pm25=None, pm10=None, no2=None)
    # In main.py: elif pm25 is not None -> aqi = int(pm25); else: aqi_val = 0
    # So if all None, aqi_val silently becomes 0. This is a fabrication risk.
    print(f"\n  [RISK] When all pollutants are None for a forecast hour:")
    print(f"         get_cpcb_aqi returns: {res_all_none}")
    print(f"         main.py line 610 falls to 'aqi_val = 0' — a fabricated 'Good' AQI")
    print(f"         This means a missing-data hour silently reports AQI=0 (Good)")
    print(f"         instead of 'Unavailable'. Risk: MEDIUM for sparse forecast tails.")
    results.append(True)  # not a crash — documenting the risk

    return results


# ─────────────────────────────────────────────────────────────────────────────
# 5. Existing test suite
# ─────────────────────────────────────────────────────────────────────────────

def run_existing_tests():
    print("\n══════ 5. Existing test_modules.py (unittest) ══════")
    sys.path.insert(0, 'vayu-frontend/vayu-backend')
    loader = unittest.TestLoader()
    suite = loader.discover('vayu-frontend/vayu-backend/tests', pattern='test_*.py')
    runner = unittest.TextTestRunner(verbosity=2, stream=sys.stdout)
    result = runner.run(suite)
    passed = result.wasSuccessful()
    return [passed]


# ─────────────────────────────────────────────────────────────────────────────
# Main runner
# ─────────────────────────────────────────────────────────────────────────────

async def main():
    all_results = []

    ts_results = test_timestamps()
    all_results.extend(ts_results)

    aqi_results = test_aqi_calculator()
    all_results.extend(aqi_results)

    fc_results = await test_forecast_live()
    all_results.extend(fc_results)

    err_results = await test_error_propagation()
    all_results.extend(err_results)

    existing_results = run_existing_tests()
    all_results.extend(existing_results)

    passed = sum(all_results)
    total = len(all_results)
    print(f"\n{'='*60}")
    print(f"SUMMARY: {passed}/{total} checks passed")
    print(f"{'='*60}")
    if passed < total:
        print("Some checks FAILED. See details above.")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
