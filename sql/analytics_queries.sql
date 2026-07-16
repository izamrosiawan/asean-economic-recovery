-- Analytics Queries: ASEAN Tourism Recovery & Resilience
-- This file contains analytical SQL queries demonstrating advanced SQL skills (CTEs, Window Functions, and Case Statements).

-- ==============================================================================
-- QUERY 1: PANDEMIC DROP SEVERITY % (2020-2021 Worst Year vs 2019 Base)
-- Purpose: Evaluates the maximum drop during the peak of the pandemic.
-- Concepts: Common Table Expressions (CTEs), Aggregations, Joins.
-- ==============================================================================
WITH Arrivals2019 AS (
    SELECT country_id, arrivals_count AS arrivals_2019
    FROM historical_arrivals
    WHERE year = 2019 AND is_forecast = FALSE
),
WorstPandemic AS (
    SELECT country_id, MIN(arrivals_count) AS min_arrivals
    FROM historical_arrivals
    WHERE year IN (2020, 2021) AND is_forecast = FALSE
    GROUP BY country_id
)
SELECT 
    c.country_name,
    a19.arrivals_2019,
    wp.min_arrivals AS worst_year_arrivals,
    ROUND(((wp.min_arrivals - a19.arrivals_2019) * 100.0 / a19.arrivals_2019), 2) AS drop_severity_pct
FROM countries c
JOIN Arrivals2019 a19 ON c.country_id = a19.country_id
JOIN WorstPandemic wp ON c.country_id = wp.country_id
ORDER BY drop_severity_pct ASC;


-- ==============================================================================
-- QUERY 2: RECOVERY RATE % BY 2025 (2025 Actual vs 2019 Base)
-- Purpose: Evaluates the recovery status of each nation by 2025.
-- ==============================================================================
WITH Arrivals2019 AS (
    SELECT country_id, arrivals_count AS arrivals_2019
    FROM historical_arrivals
    WHERE year = 2019 AND is_forecast = FALSE
),
Arrivals2025 AS (
    SELECT country_id, arrivals_count AS arrivals_2025
    FROM historical_arrivals
    WHERE year = 2025 AND is_forecast = FALSE
)
SELECT 
    c.country_name,
    a19.arrivals_2019,
    a25.arrivals_2025,
    ROUND((a25.arrivals_2025 * 100.0 / a19.arrivals_2019), 2) AS recovery_rate_2025_pct
FROM countries c
JOIN Arrivals2019 a19 ON c.country_id = a19.country_id
JOIN Arrivals2025 a25 ON c.country_id = a25.country_id
ORDER BY recovery_rate_2025_pct DESC;


-- ==============================================================================
-- QUERY 3: 2-YEAR CAGR (Compound Annual Growth Rate) FOR 2025-2027 PROJECTIONS
-- Purpose: Evaluates forecasted growth trajectories using exponentiation.
-- ==============================================================================
WITH Actual2025 AS (
    SELECT country_id, arrivals_count AS arrivals_2025
    FROM historical_arrivals
    WHERE year = 2025 AND is_forecast = FALSE
),
Forecast2027 AS (
    SELECT country_id, arrivals_count AS forecast_2027
    FROM historical_arrivals
    WHERE year = 2027 AND is_forecast = TRUE
)
SELECT 
    c.country_name,
    a25.arrivals_2025,
    f27.forecast_2027,
    ROUND((POWER((f27.forecast_2027 * 1.0 / a25.arrivals_2025), 0.5) - 1) * 100.0, 2) AS cagr_2025_2027_pct
FROM countries c
JOIN Actual2025 a25 ON c.country_id = a25.country_id
JOIN Forecast2027 f27 ON c.country_id = f27.country_id
ORDER BY cagr_2025_2027_pct DESC;


-- ==============================================================================
-- QUERY 4: YEAR-OVER-YEAR (YoY) ARRIVAL GROWTH RATES (2019-2025)
-- Purpose: Calculates yearly arrival growth trends for each country.
-- Concepts: SQL Window Functions (LAG), Partitioning.
-- ==============================================================================
WITH YearlyArrivals AS (
    SELECT 
        c.country_name,
        ha.year,
        ha.arrivals_count,
        LAG(ha.arrivals_count, 1) OVER (PARTITION BY ha.country_id ORDER BY ha.year) AS prev_year_arrivals
    FROM historical_arrivals ha
    JOIN countries c ON c.country_id = ha.country_id
    WHERE ha.is_forecast = FALSE AND ha.year >= 2019
)
SELECT 
    country_name,
    year,
    arrivals_count,
    prev_year_arrivals,
    CASE 
        WHEN prev_year_arrivals IS NULL OR prev_year_arrivals = 0 THEN NULL
        ELSE ROUND(((arrivals_count - prev_year_arrivals) * 100.0 / prev_year_arrivals), 2)
    END AS yoy_growth_pct
FROM YearlyArrivals
ORDER BY country_name, year;


-- ==============================================================================
-- QUERY 5: REGIONAL RESILIENCE CLASSIFICATION & RANKINGS
-- Purpose: Ranks and categorizes countries based on recovery performance.
-- Concepts: DENSE_RANK() Window Function, CASE WHEN logic.
-- ==============================================================================
SELECT 
    c.country_name,
    cm.resilience_score,
    cm.recovery_rate_2025_pct,
    DENSE_RANK() OVER (ORDER BY cm.resilience_score DESC) as resilience_rank,
    CASE 
        WHEN cm.resilience_score >= 150 THEN 'Highly Resilient'
        WHEN cm.resilience_score >= 100 THEN 'Resilient'
        WHEN cm.resilience_score >= 70 THEN 'Moderate'
        ELSE 'Vulnerable'
    END AS resilience_tier
FROM countries c
JOIN country_metrics cm ON c.country_id = cm.country_id
ORDER BY resilience_score DESC;


-- ==============================================================================
-- QUERY 6: CUMULATIVE REVENUE LOSS ANALYSIS (2020-2022 Pandemic Period)
-- Purpose: Models cumulative revenue loss using average spending assumptions.
-- Parameter: Assumes average tourist spending of $1,000 USD (Economic multiplier).
-- ==============================================================================
WITH Base2019 AS (
    SELECT country_id, arrivals_count AS baseline_2019
    FROM historical_arrivals
    WHERE year = 2019 AND is_forecast = FALSE
),
PandemicDeficit AS (
    SELECT 
        ha.country_id,
        SUM(b19.baseline_2019 - ha.arrivals_count) AS total_lost_tourists
    FROM historical_arrivals ha
    JOIN Base2019 b19 ON ha.country_id = b19.country_id
    WHERE ha.year IN (2020, 2021, 2022) AND ha.is_forecast = FALSE
    GROUP BY ha.country_id
)
SELECT 
    c.country_name,
    pd.total_lost_tourists AS cumulative_tourist_deficit_20_22,
    -- Est. Loss = Deficit * $1000 USD
    (pd.total_lost_tourists * 1000.0) AS est_cumulative_revenue_loss_usd,
    -- Formatted loss in millions USD
    ROUND((pd.total_lost_tourists * 1000.0 / 1000000.0), 2) AS est_loss_in_millions_usd
FROM countries c
JOIN PandemicDeficit pd ON c.country_id = pd.country_id
ORDER BY est_cumulative_revenue_loss_usd DESC;
