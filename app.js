document.addEventListener('DOMContentLoaded', () => {

  const aseanDataset = {
    ASEAN: {
      name: "Total Kawasan ASEAN",
      baseline: "147.80M",
      drop: "3.06M (-97.9%)",
      recovery: "147.04M (99.5%)",
      history: [147.80, 27.18, 3.06, 44.21, 104.13, 140.58, 147.04],
      forecast: [164.39, 169.97]
    },
    Indonesia: {
      name: "Indonesia",
      baseline: "16.11M",
      drop: "1.56M (-90.3%)",
      recovery: "15.39M (95.5%)",
      history: [16.11, 4.05, 1.56, 5.89, 11.68, 14.35, 15.39],
      forecast: [17.46, 18.52]
    },
    Malaysia: {
      name: "Malaysia",
      baseline: "26.10M",
      drop: "0.13M (-99.5%)",
      recovery: "27.88M (106.8%)",
      history: [26.10, 4.33, 0.13, 10.07, 20.14, 25.50, 27.88],
      forecast: [30.12, 32.45]
    },
    Thailand: {
      name: "Thailand",
      baseline: "39.92M",
      drop: "0.43M (-98.9%)",
      recovery: "35.38M (88.6%)",
      history: [39.92, 6.70, 0.43, 11.15, 28.15, 33.20, 35.38],
      forecast: [39.80, 42.10]
    },
    Singapore: {
      name: "Singapura",
      baseline: "19.12M",
      drop: "0.33M (-98.3%)",
      recovery: "16.08M (84.1%)",
      history: [19.12, 2.74, 0.33, 6.31, 13.61, 15.10, 16.08],
      forecast: [18.20, 19.50]
    },
    Vietnam: {
      name: "Vietnam",
      baseline: "18.01M",
      drop: "0.16M (-99.1%)",
      recovery: "17.68M (98.2%)",
      history: [18.01, 3.84, 0.16, 3.66, 12.60, 16.40, 17.68],
      forecast: [20.15, 22.30]
    },
    Philippines: {
      name: "Filipina",
      baseline: "8.26M",
      drop: "0.16M (-98.1%)",
      recovery: "6.13M (74.2%)",
      history: [8.26, 1.48, 0.16, 2.65, 5.45, 5.90, 6.13],
      forecast: [7.20, 7.95]
    },
    Cambodia: {
      name: "Kamboja",
      baseline: "6.61M",
      drop: "0.20M (-97.0%)",
      recovery: "5.57M (84.3%)",
      history: [6.61, 1.31, 0.20, 2.28, 5.45, 6.70, 5.57],
      forecast: [7.20, 7.60]
    },
    "Lao PDR": {
      name: "Laos",
      baseline: "4.79M",
      drop: "0.00M (-100%)",
      recovery: "3.15M (65.8%)",
      history: [4.79, 0.89, 0.00, 1.29, 2.80, 3.20, 3.15],
      forecast: [3.90, 4.30]
    },
    "Brunei Darussalam": {
      name: "Brunei Darussalam",
      baseline: "4.45M",
      drop: "0.11M (-97.5%)",
      recovery: "0.74M (16.7%)",
      history: [4.45, 1.07, 0.11, 0.66, 2.27, 0.68, 0.74],
      forecast: [1.27, 1.40]
    },
    Myanmar: {
      name: "Myanmar",
      baseline: "4.36M",
      drop: "0.13M (-97.0%)",
      recovery: "1.24M (28.4%)",
      history: [4.36, 0.90, 0.13, 0.23, 1.28, 1.15, 1.24],
      forecast: [1.60, 1.85]
    }
  };

  const resilienceRanking = [
    { country: "Malaysia", score: 108.4 },
    { country: "Indonesia", score: 105.2 },
    { country: "Vietnam", score: 102.7 },
    { country: "Thailand", score: 91.4 },
    { country: "Singapura", score: 88.2 },
    { country: "Kamboja", score: 87.2 },
    { country: "Filipina", score: 78.6 },
    { country: "Laos", score: 69.4 },
    { country: "Myanmar", score: 31.2 },
    { country: "Brunei", score: 19.1 }
  ];

  let currentTheme = 'light';
  let activeCountry = 'ASEAN';
  let charts = {};

  initScrollReveal();
  initAnimatedCounters();
  initTheme();
  initCharts();
  initCountrySelector();
  initSimulator();
  initSQLExplorer();

  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
  }

  function initAnimatedCounters() {
    const counters = document.querySelectorAll('.counter-number');
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
      const duration = 1200;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1.0);
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = target * easeProgress;
        
        counter.textContent = currentVal.toFixed(decimals);

        if (progress < 1.0) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toFixed(decimals);
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  function initTheme() {
    const themeBtn = document.getElementById('btn-theme-toggle');
    if (!themeBtn) return;

    themeBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', currentTheme);
      updateAllChartsTheme();
    });
  }

  function getSeabornTheme() {
    const isDark = currentTheme === 'dark';
    return {
      textColor: isDark ? '#94a3b8' : '#333333',
      titleColor: isDark ? '#f8fafc' : '#111111',
      gridColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
      tooltipBg: isDark ? '#101726' : '#ffffff',
      tooltipBorder: isDark ? '#1e293b' : '#d4d4d8',
      // Seaborn Notebook Palette Matches
      historicalBlue: '#1f77b4',
      forecastOrange: '#ff7f0e',
      viridisPalette: [
        '#440154', '#472a7a', '#3b528b', '#2c728e', '#21918c',
        '#28ae80', '#5ec962', '#addc30', '#fde725', '#fde725'
      ]
    };
  }

  function initCountrySelector() {
    const buttons = document.querySelectorAll('#country-selector-bar .country-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        activeCountry = btn.dataset.country;
        const cData = aseanDataset[activeCountry];
        if (cData) {
          document.getElementById('disp-country-name').textContent = cData.name;
          document.getElementById('disp-baseline').textContent = cData.baseline;
          document.getElementById('disp-drop').textContent = cData.drop;
          document.getElementById('disp-recovery').textContent = cData.recovery;

          updateTimeSeriesChart();
        }
      });
    });
  }

  function initCharts() {
    renderTimeSeriesChart();
    renderResilienceChart();
  }

  function renderTimeSeriesChart() {
    const canvas = document.getElementById('timeSeriesChart');
    if (!canvas) return;

    const st = getSeabornTheme();
    const cData = aseanDataset[activeCountry];
    const years = ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026 (F)', '2027 (F)'];

    const historicalData = [...cData.history, null, null];
    const forecastData = [null, null, null, null, null, null, cData.history[6], ...cData.forecast];

    // Replicating notebook Seaborn line plot: linewidth 3, marker o, dashed orange forecast
    charts.timeSeries = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Data Historis (2019-2025)',
            data: historicalData,
            borderColor: st.historicalBlue,
            backgroundColor: 'rgba(31, 119, 180, 0.05)',
            borderWidth: 3,
            fill: true,
            tension: 0.1,
            pointRadius: 4,
            pointBackgroundColor: st.historicalBlue,
            pointHoverRadius: 7
          },
          {
            label: 'Proyeksi Model (2026-2027)',
            data: forecastData,
            borderColor: st.forecastOrange,
            backgroundColor: 'rgba(255, 127, 14, 0.04)',
            borderWidth: 3,
            borderDash: [6, 6],
            fill: true,
            tension: 0.1,
            pointRadius: 4,
            pointBackgroundColor: st.forecastOrange,
            pointHoverRadius: 7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 900, easing: 'easeOutQuart' },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: st.titleColor,
              font: { family: 'Plus Jakarta Sans', size: 11, weight: '500' },
              boxWidth: 10,
              boxHeight: 10
            }
          },
          tooltip: {
            backgroundColor: st.tooltipBg,
            titleColor: st.titleColor,
            bodyColor: st.textColor,
            borderColor: st.tooltipBorder,
            borderWidth: 1,
            titleFont: { family: 'JetBrains Mono', size: 12 },
            bodyFont: { family: 'JetBrains Mono', size: 11 },
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label.split(' ')[0]}: ${ctx.raw} Juta Kunjungan`
            }
          }
        },
        scales: {
          x: {
            grid: { display: true, color: st.gridColor, borderDash: [3, 3] },
            ticks: { color: st.textColor, font: { family: 'JetBrains Mono', size: 10 } }
          },
          y: {
            grid: { display: true, color: st.gridColor, borderDash: [3, 3] },
            ticks: { color: st.textColor, font: { family: 'JetBrains Mono', size: 10 }, callback: (v) => `${v}M` }
          }
        },
        onHover: (event, elements, chart) => {
          const readout = document.getElementById('hover-year-readout');
          if (!readout) return;
          if (elements && elements.length > 0) {
            const idx = elements[0].index;
            const yr = chart.data.labels[idx];
            const val = chart.data.datasets[0].data[idx] || chart.data.datasets[1].data[idx];
            readout.textContent = `${yr}  |  Volume: ${val} Juta Kunjungan`;
          }
        }
      }
    });
  }

  function updateTimeSeriesChart() {
    if (!charts.timeSeries) return;
    const cData = aseanDataset[activeCountry];
    const historicalData = [...cData.history, null, null];
    const forecastData = [null, null, null, null, null, null, cData.history[6], ...cData.forecast];

    charts.timeSeries.data.datasets[0].data = historicalData;
    charts.timeSeries.data.datasets[1].data = forecastData;
    charts.timeSeries.update();
  }

  function renderResilienceChart() {
    const canvas = document.getElementById('resilienceChart');
    if (!canvas) return;

    const st = getSeabornTheme();
    const labels = resilienceRanking.map(r => r.country);
    const scores = resilienceRanking.map(r => r.score);

    // Matching notebook seaborn.color_palette("viridis", len(df_ranking))
    charts.resilience = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Skor Resiliensi Komposit',
          data: scores,
          backgroundColor: st.viridisPalette,
          borderRadius: 4,
          borderWidth: 0.5,
          borderColor: 'rgba(0,0,0,0.1)'
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 900, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: st.tooltipBg,
            titleColor: st.titleColor,
            bodyColor: st.textColor,
            borderColor: st.tooltipBorder,
            borderWidth: 1,
            callbacks: {
              label: (ctx) => ` Skor: ${ctx.raw} pts`
            }
          }
        },
        scales: {
          x: {
            grid: { display: true, color: st.gridColor, borderDash: [3, 3] },
            ticks: { color: st.textColor, font: { family: 'JetBrains Mono', size: 10 } }
          },
          y: {
            grid: { display: false },
            ticks: { color: st.textColor, font: { family: 'Plus Jakarta Sans', size: 11, weight: '500' } }
          }
        }
      }
    });
  }

  function updateAllChartsTheme() {
    Object.values(charts).forEach(c => {
      if (c) c.destroy();
    });
    initCharts();
  }

  function initSimulator() {
    const sliderFlight = document.getElementById('slider-sim-flight');
    const sliderVisa = document.getElementById('slider-sim-visa');
    const sliderSpend = document.getElementById('slider-sim-spend');
    const btnReset = document.getElementById('btn-reset-sim');

    if (!sliderFlight || !sliderVisa || !sliderSpend) return;

    function recalculate() {
      const flightPct = parseFloat(sliderFlight.value);
      const visaPct = parseFloat(sliderVisa.value);
      const spendPct = parseFloat(sliderSpend.value);

      document.getElementById('txt-sim-flight').textContent = `+${flightPct}%`;
      document.getElementById('txt-sim-visa').textContent = `+${visaPct}%`;
      document.getElementById('txt-sim-spend').textContent = `+${spendPct}%`;

      const baseVisitors = 169.97;
      const baseSpendPerVisitor = 1200;
      const baseRevenueUSD = (baseVisitors * 1e6 * baseSpendPerVisitor) / 1e9;

      const visitorLiftPct = (flightPct * 0.45) + (visaPct * 0.35);
      const projectedVisitors = baseVisitors * (1 + visitorLiftPct / 100);
      const newSpend = baseSpendPerVisitor * (1 + spendPct / 100);
      const projectedRevenueUSD = (projectedVisitors * 1e6 * newSpend) / 1e9;
      const deltaRevenueUSD = projectedRevenueUSD - baseRevenueUSD;

      const baseResilience = 101.56;
      const resilienceLift = (visitorLiftPct * 0.3) + (spendPct * 0.15);
      const projectedResilience = baseResilience + resilienceLift;

      document.getElementById('sim-projected-visitors').textContent = `${projectedVisitors.toFixed(2)}M`;
      document.getElementById('sim-delta-revenue').textContent = `+$${deltaRevenueUSD.toFixed(2)}B`;
      document.getElementById('sim-projected-resilience').textContent = `${projectedResilience.toFixed(2)}`;
    }

    sliderFlight.addEventListener('input', recalculate);
    sliderVisa.addEventListener('input', recalculate);
    sliderSpend.addEventListener('input', recalculate);

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        sliderFlight.value = 0;
        sliderVisa.value = 0;
        sliderSpend.value = 0;
        recalculate();
      });
    }
  }

  function initSQLExplorer() {
    const btnTimeseries = document.getElementById('btn-q-timeseries');
    const btnResilience = document.getElementById('btn-q-resilience');
    const btnForecast = document.getElementById('btn-q-forecast');
    const codeDisplay = document.getElementById('sql-code-display');

    const snippets = {
      timeseries: `-- 1. Evaluasi Pertumbuhan Kunjungan Wisatawan per Negara (YoY)
SELECT 
    country_name,
    year_period,
    inbound_visitors,
    LAG(inbound_visitors, 1) OVER (PARTITION BY country_name ORDER BY year_period) AS prev_year_visitors,
    ROUND(((inbound_visitors - LAG(inbound_visitors, 1) OVER (PARTITION BY country_name ORDER BY year_period)) * 100.0) / 
          LAG(inbound_visitors, 1) OVER (PARTITION BY country_name ORDER BY year_period), 2) AS yoy_growth_pct
FROM asean_tourism_timeseries
WHERE year_period BETWEEN 2019 AND 2025
ORDER BY country_name, year_period;`,

      resilience: `-- 2. Komputasi Skor Komposit Resiliensi Krisis Regional
WITH BaselineMetrics AS (
    SELECT 
        country_name,
        MAX(CASE WHEN year_period = 2019 THEN inbound_visitors END) AS v_2019,
        MIN(CASE WHEN year_period BETWEEN 2020 AND 2021 THEN inbound_visitors END) AS v_trough,
        MAX(CASE WHEN year_period = 2025 THEN inbound_visitors END) AS v_2025
    FROM asean_tourism_timeseries
    GROUP BY country_name
)
SELECT 
    country_name,
    ROUND((v_trough * 100.0 / v_2019), 2) AS drop_retained_pct,
    ROUND((v_2025 * 100.0 / v_2019), 2) AS recovery_rate_2025,
    ROUND(((v_trough * 100.0 / v_2019) * 0.3) + ((v_2025 * 100.0 / v_2019) * 0.7), 2) AS composite_resilience_score
FROM BaselineMetrics
ORDER BY composite_resilience_score DESC;`,

      forecast: `-- 3. Interval Kepercayaan Proyeksi Ekonometrika 2026-2027
SELECT 
    country_name,
    forecast_year,
    projected_inbound_visitors,
    ROUND(projected_inbound_visitors * (1 - 0.08), 2) AS lower_confidence_bound_95,
    ROUND(projected_inbound_visitors * (1 + 0.08), 2) AS upper_confidence_bound_95
FROM asean_forecast_model
WHERE forecast_year IN (2026, 2027)
ORDER BY country_name, forecast_year;`
    };

    function setSnippet(key, activeBtn) {
      if (codeDisplay) {
        codeDisplay.innerHTML = `<code>${snippets[key]}</code>`;
      }
      [btnTimeseries, btnResilience, btnForecast].forEach(b => {
        if (b) b.classList.remove('active');
      });
      if (activeBtn) activeBtn.classList.add('active');
    }

    if (btnTimeseries) btnTimeseries.addEventListener('click', () => setSnippet('timeseries', btnTimeseries));
    if (btnResilience) btnResilience.addEventListener('click', () => setSnippet('resilience', btnResilience));
    if (btnForecast) btnForecast.addEventListener('click', () => setSnippet('forecast', btnForecast));
  }

});
