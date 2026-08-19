import os
import json
import pandas as pd
import numpy as np

class AseanEconomicEngine:
    def __init__(self, data_path: str = None):
        if data_path is None:
            data_path = os.path.join(os.path.dirname(__file__), '..', 'data.json')
        self.data_path = data_path

    def load_data(self) -> list:
        with open(self.data_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def get_country_summary(self) -> pd.DataFrame:
        data = self.load_data()
        records = []
        for item in data:
            if isinstance(item, dict) and 'country' in item:
                metrics = item.get('metrics', {})
                records.append({
                    'country': item['country'],
                    'recovery_rate_2025_pct': metrics.get('recovery_rate_2025_pct', 0.0),
                    'years_to_recover': metrics.get('years_to_recover', 'N/A')
                })
        return pd.DataFrame(records)
