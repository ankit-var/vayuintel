def calculate_sub_index(conc, breakpoints):
    """
    Calculate sub-index for a pollutant given its concentration and breakpoints.
    breakpoints is a list of tuples: (conc_low, conc_high, aqi_low, aqi_high)
    """
    if conc is None or conc < 0:
        return None
        
    for (c_low, c_high, i_low, i_high) in breakpoints:
        if c_low <= conc <= c_high:
            return round(((i_high - i_low) / (c_high - c_low)) * (conc - c_low) + i_low)
            
    # If concentration exceeds the highest breakpoint, extrapolate from the last interval
    last_c_low, last_c_high, last_i_low, last_i_high = breakpoints[-1]
    if conc > last_c_high:
        return round(((last_i_high - last_i_low) / (last_c_high - last_c_low)) * (conc - last_c_low) + last_i_low)
    
    return None

def get_cpcb_aqi(pm25=None, pm10=None, no2=None):
    """
    Calculates the AQI according to the Indian CPCB standard.
    Returns a dictionary with the AQI and the responsible pollutant.
    """
    # Breakpoints: (C_low, C_high, I_low, I_high)
    pm25_breakpoints = [
        (0.0, 30.0, 0, 50),
        (30.1, 60.0, 51, 100),
        (60.1, 90.0, 101, 200),
        (90.1, 120.0, 201, 300),
        (120.1, 250.0, 301, 400),
        (250.1, 1000.0, 401, 500) # Extrapolated max bound for calculation
    ]
    
    pm10_breakpoints = [
        (0, 50, 0, 50),
        (51, 100, 51, 100),
        (101, 250, 101, 200),
        (251, 350, 201, 300),
        (351, 430, 301, 400),
        (431, 1000, 401, 500)
    ]

    no2_breakpoints = [
        (0, 40, 0, 50),
        (41, 80, 51, 100),
        (81, 180, 101, 200),
        (181, 280, 201, 300),
        (281, 400, 301, 400),
        (401, 1000, 401, 500)
    ]

    sub_indices = {}
    
    if pm25 is not None:
        val = calculate_sub_index(pm25, pm25_breakpoints)
        if val is not None: sub_indices['PM2.5'] = val
        
    if pm10 is not None:
        val = calculate_sub_index(pm10, pm10_breakpoints)
        if val is not None: sub_indices['PM10'] = val
        
    if no2 is not None:
        val = calculate_sub_index(no2, no2_breakpoints)
        if val is not None: sub_indices['NO2'] = val

    if not sub_indices:
        return None
        
    # Standard rule: overall AQI is max of sub-indices
    max_pollutant = max(sub_indices, key=sub_indices.get)
    return {
        "aqi": sub_indices[max_pollutant],
        "prominent_pollutant": max_pollutant,
        "sub_indices": sub_indices
    }
