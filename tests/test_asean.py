import pytest
import pandas as pd
import numpy as np
from src.asean_engine import AseanEconomicEngine

@pytest.fixture
def engine():
    return AseanEconomicEngine()

def test_load_asean_data(engine):
    data = engine.load_data()
    assert isinstance(data, list)
    assert len(data) > 0

def test_country_summary(engine):
    summary = engine.get_country_summary()
    assert len(summary) > 0
    assert 'country' in summary.columns
    assert 'recovery_rate_2025_pct' in summary.columns
