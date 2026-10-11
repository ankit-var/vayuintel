def calculate_sub_index(conc, breakpoints):
    """
    Calculate sub-index for a pollutant given its concentration and breakpoints.
    breakpoints is a list of tuples: (conc_low, conc_high, aqi_low, aqi_high)
    Boundaries are contiguous — each range is [conc_low, conc_high].
    """
    if conc is None or conc < 0:
        return None

    for (c_low, c_high, i_low, i_high) in breakpoints:
        if c_low <= conc <= c_high:
            # Avoid division by zero when c_low == c_high
            if c_high == c_low:
                return i_low
            return round(((i_high - i_low) / (c_high - c_low)) * (conc - c_low) + i_low)

    # If concentration exceeds the highest breakpoint, cap at 500
    last_c_low, last_c_high, last_i_low, last_i_high = breakpoints[-1]
    if conc > last_c_high:
        return 500

    return None

# ── CPCB National AQI Breakpoints ──────────────────────────────────────────
# Source: CPCB National Air Quality Index (2014)
# Ranges are contiguous — no gaps between categories.

PM25_BREAKPOINTS = [
    (0,     30,   0,   50),
    (30,    60,   51,  100),
    (60,    90,   101, 200),
    (90,    120,  201, 300),
    (120,   250,  301, 400),
    (250,   500,  401, 500),
]

PM10_BREAKPOINTS = [
    (0,     50,   0,   50),
    (50,    100,  51,  100),
    (100,   250,  101, 200),
    (250,   350,  201, 300),
    (350,   430,  301, 400),
    (430,   500,  401, 500),
]

NO2_BREAKPOINTS = [
    (0,     40,   0,   50),
    (40,    80,   51,  100),
    (80,    180,  101, 200),
    (180,   280,  201, 300),
    (280,   400,  301, 400),
    (400,   500,  401, 500),
]

SO2_BREAKPOINTS = [
    (0,     40,   0,   50),
    (40,    80,   51,  100),
    (80,    380,  101, 200),
    (380,   800,  201, 300),
    (800,   1600, 301, 400),
    (1600,  2400, 401, 500),
]

CO_BREAKPOINTS = [
    # CO in mg/m³ per CPCB
    (0,     1.0,  0,   50),
    (1.0,   2.0,  51,  100),
    (2.0,   10.0, 101, 200),
    (10.0,  17.0, 201, 300),
    (17.0,  34.0, 301, 400),
    (34.0,  50.0, 401, 500),
]

O3_BREAKPOINTS = [
    (0,     50,   0,   50),
    (50,    100,  51,  100),
    (100,   168,  101, 200),
    (168,   208,  201, 300),
    (208,   748,  301, 400),
    (748,   1000, 401, 500),
]


def get_cpcb_aqi(pm25=None, pm10=None, no2=None, so2=None, co=None, o3=None):
    """
    Calculates the AQI according to the Indian CPCB standard.
    Returns a dictionary with the AQI and the responsible pollutant,
    or None if no valid concentration data is provided.
    """
    sub_indices = {}

    param_bp_pairs = [
        ('PM2.5', pm25, PM25_BREAKPOINTS),
        ('PM10',  pm10, PM10_BREAKPOINTS),
        ('NO2',   no2,  NO2_BREAKPOINTS),
        ('SO2',   so2,  SO2_BREAKPOINTS),
        ('CO',    co,   CO_BREAKPOINTS),
        ('O3',    o3,   O3_BREAKPOINTS),
    ]

    for name, conc, bp in param_bp_pairs:
        if conc is not None:
            val = calculate_sub_index(conc, bp)
            if val is not None:
                sub_indices[name] = val

    if not sub_indices:
        return None

    # Standard rule: overall AQI is max of sub-indices
    max_pollutant = max(sub_indices, key=sub_indices.get)
    return {
        "aqi": sub_indices[max_pollutant],
        "prominent_pollutant": max_pollutant,
        "sub_indices": sub_indices
    }
