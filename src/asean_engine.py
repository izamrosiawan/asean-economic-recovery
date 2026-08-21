import os
import json
import pandas as pd
import numpy as np

class AseanEconomicEngine:
    """
    Macroeconomic & Tourism Recovery Analytics Engine for ASEAN-10 Countries.
    Evaluates post-pandemic shock recovery trajectories, resilience scoring,
    and econometric forecast confidence intervals.
    """
    def __init__(self, data_path: str = None):
        if data_path is None:
            data_path = os.path.join(os.path.dirname(__file__), '..', 'data.json')
        self.data_path = data_path

    def load_data(self) -> list:
        """Loads ASEAN macroeconomic JSON payload."""
        with open(self.data_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def get_country_summary(self) -> pd.DataFrame:
        """Extracts key recovery metrics per country."""
        data = self.load_data()
        records = []
        for item in data:
            if isinstance(item, dict) and 'country' in item:
                metrics = item.get('metrics', {})
                records.append({
                    'country': item['country'],
                    'drop_severity_pct': metrics.get('drop_severity_pct', 0.0),
                    'recovery_rate_2025_pct': metrics.get('recovery_rate_2025_pct', 0.0),
                    'resilience_score': metrics.get('resilience_score', 0.0),
                    'years_to_recover': metrics.get('years_to_recover', 'N/A')
                })
        return pd.DataFrame(records)

    def calculate_resilience_matrix(self) -> pd.DataFrame:
        """Classifies member states into resilience quadrants."""
        df = self.get_country_summary()
        
        def classify_tier(row):
            rec = row['recovery_rate_2025_pct']
            score = row['resilience_score']
            if rec >= 100.0 or score >= 100.0:
                return 'Tier 1: High Resilience (Fully Recovered)'
            elif rec >= 75.0:
                return 'Tier 2: Moderate Resilience (Near Baseline)'
            else:
                return 'Tier 3: Vulnerable / Structural Lag'

        df['resilience_tier'] = df.apply(classify_tier, axis=1)
        return df

    def generate_forecast_bands(self, error_margin_pct: float = 0.08) -> pd.DataFrame:
        """Generates forecast interval estimates for 2026-2027."""
        data = self.load_data()
        records = []
        for item in data:
            if 'country' in item and 'forecast' in item:
                f_2026 = item['forecast'].get('2026', 0)
                f_2027 = item['forecast'].get('2027', 0)
                records.append({
                    'country': item['country'],
                    'forecast_2026': f_2026,
                    'forecast_2026_lower': int(f_2026 * (1.0 - error_margin_pct)),
                    'forecast_2026_upper': int(f_2026 * (1.0 + error_margin_pct)),
                    'forecast_2027': f_2027,
                    'forecast_2027_lower': int(f_2027 * (1.0 - error_margin_pct)),
                    'forecast_2027_upper': int(f_2027 * (1.0 + error_margin_pct)),
                })
        return pd.DataFrame(records)
