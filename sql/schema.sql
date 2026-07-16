-- Database Schema: ASEAN Tourism Recovery
-- This schema represents the relational model for the tourism database.

-- 1. Table: countries
CREATE TABLE IF NOT EXISTS countries (
    country_id SERIAL PRIMARY KEY,
    country_name VARCHAR(100) UNIQUE NOT NULL,
    resilience_tier VARCHAR(50) CHECK (resilience_tier IN ('High', 'Medium', 'Moderate', 'Low'))
);

-- 2. Table: historical_arrivals
CREATE TABLE IF NOT EXISTS historical_arrivals (
    arrival_id SERIAL PRIMARY KEY,
    country_id INT REFERENCES countries(country_id) ON DELETE CASCADE,
    year INT NOT NULL CHECK (year >= 2010 AND year <= 2030),
    arrivals_count INT NOT NULL DEFAULT 0,
    is_forecast BOOLEAN DEFAULT FALSE,
    UNIQUE(country_id, year)
);

-- 3. Table: country_metrics
CREATE TABLE IF NOT EXISTS country_metrics (
    metric_id SERIAL PRIMARY KEY,
    country_id INT UNIQUE REFERENCES countries(country_id) ON DELETE CASCADE,
    drop_severity_pct DECIMAL(5,2),
    drop_retained_pct DECIMAL(5,2),
    recovery_rate_2025_pct DECIMAL(5,2),
    resilience_score DECIMAL(5,2)
);
