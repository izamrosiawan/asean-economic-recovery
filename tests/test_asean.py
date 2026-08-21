import unittest
import pandas as pd
import numpy as np
from src.asean_engine import AseanEconomicEngine

class TestAseanEconomicEngine(unittest.TestCase):
    def setUp(self):
        self.engine = AseanEconomicEngine()

    def test_load_asean_data(self):
        data = self.engine.load_data()
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)

    def test_country_summary(self):
        summary = self.engine.get_country_summary()
        self.assertGreater(len(summary), 0)
        self.assertIn('country', summary.columns)
        self.assertIn('recovery_rate_2025_pct', summary.columns)
        self.assertIn('resilience_score', summary.columns)

    def test_resilience_matrix(self):
        matrix = self.engine.calculate_resilience_matrix()
        self.assertGreater(len(matrix), 0)
        self.assertIn('resilience_tier', matrix.columns)
        tiers = matrix['resilience_tier'].unique()
        self.assertGreaterEqual(len(tiers), 2)

    def test_forecast_bands(self):
        bands = self.engine.generate_forecast_bands(error_margin_pct=0.08)
        self.assertGreater(len(bands), 0)
        self.assertIn('forecast_2026_lower', bands.columns)
        self.assertIn('forecast_2026_upper', bands.columns)
        for _, row in bands.iterrows():
            if row['forecast_2026'] > 0:
                self.assertLess(row['forecast_2026_lower'], row['forecast_2026_upper'])

if __name__ == '__main__':
    unittest.main()
