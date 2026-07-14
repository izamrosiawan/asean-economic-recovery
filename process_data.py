import pandas as pd
import numpy as np
import json
import os

# Load Excel File
excel_path = 'dataset/pivot.xlsx'
xl = pd.ExcelFile(excel_path)
df = xl.parse(xl.sheet_names[0])

# Clean the dataframe
# Header is in row index 1
columns = df.iloc[1].tolist()
# Clean columns list (years should be strings/ints, clean country names)
columns[0] = 'destination_country'
columns[1] = 'origin_country'
# Convert years to strings like '2019', '2020', etc.
for i in range(2, len(columns)):
    columns[i] = str(int(float(columns[i])))

df.columns = columns
# Drop rows 0 and 1
df = df.iloc[2:].reset_index(drop=True)

# Replace NaN in numerical columns with None (for JSON compatibility)
years = [col for col in df.columns if col not in ['destination_country', 'origin_country']]
for year in years:
    df[year] = pd.to_numeric(df[year], errors='coerce')

# List of ASEAN countries
countries_data = []

# Prepare data for JSON
for idx, row in df.iterrows():
    country = row['destination_country']
    
    # Extract historical values
    history = {}
    for year in years:
        val = row[year]
        history[year] = int(val) if not pd.isna(val) else None
        
    val_2019 = history.get('2019')
    val_2020 = history.get('2020')
    val_2021 = history.get('2021')
    val_2025 = history.get('2025')
    
    # Calculate Drop Severity
    # Find minimum of 2020 and 2021 (handling NaNs)
    vals_pandemic = []
    if val_2020 is not None: vals_pandemic.append(val_2020)
    if val_2021 is not None: vals_pandemic.append(val_2021)
    
    min_pandemic = min(vals_pandemic) if vals_pandemic else None
    
    if val_2019 and min_pandemic is not None:
        drop_severity = ((min_pandemic - val_2019) / val_2019) * 100
        drop_retained = (min_pandemic / val_2019) * 100
    else:
        drop_severity = None
        drop_retained = None
        
    # Calculate Recovery Rate 2025
    if val_2019 and val_2025 is not None:
        recovery_rate = (val_2025 / val_2019) * 100
    else:
        recovery_rate = None
        
    # Years to Recover
    # Find first year (2022-2025) that reached or exceeded 2019 level
    years_to_recover = 'Not fully recovered'
    if val_2019:
        for yr in ['2022', '2023', '2024', '2025']:
            val_yr = history.get(yr)
            if val_yr is not None and val_yr >= val_2019:
                years_to_recover = yr
                break
                
    # Calculate Resilience Score
    # Score = Recovery Rate + Drop Retained
    # This means high recovery rate + high retained percentage during pandemic = high resilience
    if recovery_rate is not None and drop_retained is not None:
        resilience_score = recovery_rate + drop_retained
    else:
        resilience_score = 0
        
    # Forecasting for 2026 and 2027
    # Fit a linear regression on recovery period: 2021-2025
    # If 2021 is missing, use 2022-2025
    x_train = []
    y_train = []
    for yr in ['2021', '2022', '2023', '2024', '2025']:
        val_yr = history.get(yr)
        if val_yr is not None:
            x_train.append(int(yr))
            y_train.append(val_yr)
            
    forecast = {}
    if len(x_train) >= 2:
        slope, intercept = np.polyfit(x_train, y_train, 1)
        # Predict for 2026 and 2027
        val_2026 = slope * 2026 + intercept
        val_2027 = slope * 2027 + intercept
        # Clamping to avoid negative values
        forecast['2026'] = max(0, int(val_2026))
        forecast['2027'] = max(0, int(val_2027))
    else:
        forecast['2026'] = None
        forecast['2027'] = None
        
    countries_data.append({
        'country': country,
        'history': history,
        'metrics': {
            'drop_severity_pct': round(drop_severity, 2) if drop_severity is not None else None,
            'drop_retained_pct': round(drop_retained, 2) if drop_retained is not None else None,
            'recovery_rate_2025_pct': round(recovery_rate, 2) if recovery_rate is not None else None,
            'years_to_recover': years_to_recover,
            'resilience_score': round(resilience_score, 2)
        },
        'forecast': forecast
    })

# Export to data.json
with open('data.json', 'w') as f:
    json.dump(countries_data, f, indent=2)

print("Preprocessing complete. data.json generated.")
