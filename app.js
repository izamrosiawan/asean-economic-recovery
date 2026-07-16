// Global State
let countriesData = [];
let selectedCountry = 'ASEAN';
let charts = {};

// Simulator & Control States
let selectedYear = '2025';
let isComparisonMode = false;
let comparisonCountries = ['ASEAN']; // Default compare countries
let averageSpending = 1000; // Default average spending per tourist (USD)
let growthRateAdjustment = 0; // What-If forecasting adjustment (percent)

// Palette Colors dynamically reading CSS custom properties
const COLORS = {
    get primary() { return getComputedStyle(document.body).getPropertyValue('--color-primary').trim() || '#0f172a'; },
    get secondary() { return getComputedStyle(document.body).getPropertyValue('--color-secondary').trim() || '#f1f5f9'; },
    get border() { return getComputedStyle(document.body).getPropertyValue('--color-border').trim() || '#e2e8f0'; },
    get accent() { return getComputedStyle(document.body).getPropertyValue('--color-accent').trim() || '#4f46e5'; },
    get error() { return getComputedStyle(document.body).getPropertyValue('--color-error').trim() || '#ef4444'; },
    get success() { return getComputedStyle(document.body).getPropertyValue('--color-success').trim() || '#10b981'; }
};

// SVG Icon definitions
const MOON_SVG = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />`;
const SUN_SVG = `
  <circle cx="12" cy="12" r="5"></circle>
  <line x1="12" y1="1" x2="12" y2="3"></line>
  <line x1="12" y1="21" x2="12" y2="23"></line>
  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
  <line x1="1" y1="12" x2="3" y2="12"></line>
  <line x1="21" y1="12" x2="23" y2="12"></line>
  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
`;

let currentTheme = 'light';

// Initialize Theme
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        setTheme('dark');
    } else {
        setTheme('light');
    }

    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(nextTheme);
        });
    }
}

// Apply Theme changes
function setTheme(theme) {
    currentTheme = theme;
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    
    if (theme === 'dark') {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        if (themeIcon) themeIcon.innerHTML = SUN_SVG;
    } else {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        if (themeIcon) themeIcon.innerHTML = MOON_SVG;
    }
    
    updateChartThemeColors();
    updateCharts();
}

// Update Chart.js base styling on theme switch
function updateChartThemeColors() {
    const isDark = currentTheme === 'dark';
    Chart.defaults.color = isDark ? '#94a3b8' : '#64748b';
    Chart.defaults.borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)';
}

// Tooltip customization helper
function getTooltipConfig() {
    const isDark = currentTheme === 'dark';
    return {
        backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
        titleColor: isDark ? '#f5f5f7' : '#1d1d1f',
        bodyColor: isDark ? '#8e8e93' : '#86868b',
        borderColor: isDark ? '#2c2c2e' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        cornerRadius: 4,
        titleFont: { family: '"SF Pro Text", -apple-system, sans-serif', weight: 'bold', size: 12 },
        bodyFont: { family: '"SF Pro Text", -apple-system, sans-serif', size: 11 }
    };
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    fetchData();
});

// Fetch preprocessed data
async function fetchData() {
    try {
        const response = await fetch('data.json');
        countriesData = await response.json();
        
        // Sort: ASEAN first, then others alphabetically
        countriesData.sort((a, b) => {
            if (a.country === 'ASEAN') return -1;
            if (b.country === 'ASEAN') return 1;
            return a.country.localeCompare(b.country);
        });

        populateCountrySelector();
        populateComparisonChecklist();
        updateKPIs();
        updateEconomicCalculations();
        updateSmartInsights();
        initCharts();
        
        // Load detailed SVG map dynamically
        fetch('asean-map.svg')
            .then(response => {
                if (!response.ok) throw new Error('Failed to load map file');
                return response.text();
            })
            .then(svgText => {
                const container = document.getElementById('map-container');
                if (container) {
                    // Remove existing SVG if any
                    const oldSvg = container.querySelector('svg');
                    if (oldSvg) oldSvg.remove();
                    
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(svgText, 'image/svg+xml');
                    const importedSvg = doc.querySelector('svg');
                    if (importedSvg) {
                        importedSvg.setAttribute('id', 'asean-map');
                        importedSvg.setAttribute('class', 'asean-svg-map');
                        container.appendChild(importedSvg);
                    }
                    initAseanMap();
                }
            })
            .catch(err => {
                console.error('Gagal memuat peta SVG:', err);
                const container = document.getElementById('map-container');
                if (container) {
                    const fallback = document.createElement('p');
                    fallback.style.padding = '24px';
                    fallback.style.textAlign = 'center';
                    fallback.style.color = 'var(--color-muted)';
                    fallback.textContent = 'Gagal memuat peta pariwisata interaktif.';
                    container.appendChild(fallback);
                }
            });
            
        populateTables();
    } catch (error) {
        console.error('Error fetching dataset:', error);
        alert('Gagal memuat dataset pariwisata. Hubungi administrator.');
    }
}

// Populate Selector Dropdown
function populateCountrySelector() {
    const selector = document.getElementById('country-selector');
    selector.innerHTML = '';
    
    countriesData.forEach(item => {
        const option = document.createElement('option');
        option.value = item.country;
        option.textContent = item.country === 'ASEAN' ? 'ASEAN (Gabungan)' : item.country;
        if (item.country === selectedCountry) {
            option.selected = true;
        }
        selector.appendChild(option);
    });
}

// Dropdown Change Handler
// Called from HTML selector
window.handleCountryChange = function() {
    const selector = document.getElementById('country-selector');
    selectedCountry = selector.value;
    
    updateKPIs();
    updateEconomicCalculations();
    updateSmartInsights();
    updateCharts();
    highlightActiveTableRow();
};

// Helper: Formatting numbers
function formatNumber(num) {
    if (num === null || num === undefined) return 'N/A';
    if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + ' Juta';
    }
    return num.toLocaleString('id-ID');
}

// Update KPI Metrics Cards dynamically
function updateKPIs() {
    const data = countriesData.find(d => d.country === selectedCountry);
    if (!data) return;

    const val2019 = data.history['2019'];
    const valActiveYear = data.history[selectedYear];
    
    // Update KPI Card titles dynamically
    const lblArrivals = document.getElementById('lbl-arrivals');
    if (lblArrivals) lblArrivals.textContent = `Kunjungan Wisatawan (${selectedYear})`;
    const lblRecovery = document.getElementById('lbl-recovery');
    if (lblRecovery) lblRecovery.textContent = `Tingkat Pemulihan (${selectedYear})`;

    // 1. KPI: Arrivals
    animateCountUp('kpi-arrivals', valActiveYear);
    const arrivalsChangeEl = document.getElementById('kpi-arrivals-change');
    let pctArrivals = 0;
    if (val2019 && valActiveYear !== null && valActiveYear !== undefined) {
        const pctChange = ((valActiveYear - val2019) / val2019) * 100;
        const sign = pctChange >= 0 ? '+' : '';
        arrivalsChangeEl.textContent = `${sign}${pctChange.toFixed(1)}% vs 2019`;
        arrivalsChangeEl.className = pctChange >= 0 ? 'trend positive' : 'trend negative';
        
        // Progress bar for arrivals = % of 2019 level (capped at 100%)
        pctArrivals = Math.min(100, Math.max(0, (valActiveYear / val2019) * 100));
    } else {
        arrivalsChangeEl.textContent = 'Data tidak lengkap';
        arrivalsChangeEl.className = 'trend';
    }
    document.getElementById('kpi-progress-arrivals').style.width = `${pctArrivals}%`;

    // 2. KPI: Pandemic Worst Drop
    const dropPct = data.metrics.drop_severity_pct;
    animateCountUp('kpi-drop', dropPct);
    
    const val2020 = data.history['2020'];
    const val2021 = data.history['2021'];
    let lowestYear = '2020';
    if (val2020 !== null && val2021 !== null) {
        lowestYear = val2021 < val2020 ? '2021' : '2020';
    }
    document.getElementById('kpi-drop-year').textContent = `Tahun terendah: ${lowestYear}`;
    
    // Progress fill for Drop = severity percentage (absolute value)
    const absDrop = dropPct !== null ? Math.min(100, Math.abs(dropPct)) : 0;
    document.getElementById('kpi-progress-drop').style.width = `${absDrop}%`;

    // 3. KPI: Recovery Rate
    let activeRecRate = null;
    if (val2019 && valActiveYear !== null && valActiveYear !== undefined) {
        activeRecRate = parseFloat(((valActiveYear / val2019) * 100).toFixed(2));
    }
    animateCountUp('kpi-recovery', activeRecRate);
    
    const recStatusEl = document.getElementById('kpi-recovery-status');
    if (activeRecRate !== null) {
        if (activeRecRate >= 100) {
            recStatusEl.textContent = `Pulih Penuh (vs 2019)`;
            recStatusEl.className = 'trend positive';
        } else {
            recStatusEl.textContent = `Belum Pulih (vs 2019)`;
            recStatusEl.className = 'trend negative';
        }
        document.getElementById('kpi-progress-recovery').style.width = `${Math.min(100, activeRecRate)}%`;
    } else {
        recStatusEl.textContent = 'Data tidak lengkap';
        recStatusEl.className = 'trend';
        document.getElementById('kpi-progress-recovery').style.width = `0%`;
    }

    // 4. KPI: Resilience Score & Badge
    const score = data.metrics.resilience_score;
    animateCountUp('kpi-resilience', score);
    
    const badgeEl = document.getElementById('kpi-resilience-badge');
    if (score >= 150) {
        badgeEl.textContent = 'SANGAT TANGGUH';
        badgeEl.className = 'card-badge high';
    } else if (score >= 100) {
        badgeEl.textContent = 'TANGGUH';
        badgeEl.className = 'card-badge mod';
    } else {
        badgeEl.textContent = 'RENTAN';
        badgeEl.className = 'card-badge low';
    }
    
    const progressScore = Math.min(100, (score / 200) * 100);
    document.getElementById('kpi-progress-resilience').style.width = `${progressScore}%`;
}

// Switch between dashboard tabs
window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`tab-${tabId}`).classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`btn-${tabId}`).classList.add('active');
    
    // Resize charts to prevent sizing errors
    setTimeout(() => {
        Object.keys(charts).forEach(key => {
            if (charts[key]) charts[key].resize();
        });
    }, 100);
};

// Update chart options dynamically for Light/Dark Mode
function updateChartOptions(chart) {
    if (!chart) return;
    const isDark = currentTheme === 'dark';
    
    // Update scales
    if (chart.options.scales) {
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)';
        const ticksColor = isDark ? '#94a3b8' : '#64748b';
        
        Object.keys(chart.options.scales).forEach(scaleId => {
            const scale = chart.options.scales[scaleId];
            if (scale.grid) {
                scale.grid.color = gridColor;
            }
            if (scale.ticks) {
                scale.ticks.color = ticksColor;
                if (scale.ticks.font) {
                    scale.ticks.font.family = '"Inter", -apple-system, sans-serif';
                }
            }
            if (scale.title) {
                scale.title.color = isDark ? '#f8fafc' : '#0f172a';
                if (scale.title.font) {
                    scale.title.font.family = '"Inter", -apple-system, sans-serif';
                }
            }
        });
    }
    
    // Update tooltips
    if (chart.options.plugins && chart.options.plugins.tooltip) {
        const tooltip = getTooltipConfig();
        // Preserve existing callbacks
        const existingCallbacks = chart.options.plugins.tooltip.callbacks;
        chart.options.plugins.tooltip = {
            ...chart.options.plugins.tooltip,
            ...tooltip,
            callbacks: existingCallbacks || chart.options.plugins.tooltip.callbacks
        };
    }
}

// Initialize Charts
function initCharts() {
    const ctxOverview = document.getElementById('overviewChart').getContext('2d');
    const ctxResilience = document.getElementById('resilienceScoreChart').getContext('2d');
    const ctxScatter = document.getElementById('resilienceScatterChart').getContext('2d');
    const ctxForecast = document.getElementById('forecastChart').getContext('2d');

    // Chart.js global overrides
    updateChartThemeColors();

    // 1. Overview Chart (Line Chart)
    const datasetsOverview = getOverviewDatasets(ctxOverview);
    charts.overview = new Chart(ctxOverview, {
        type: 'line',
        data: {
            labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
            datasets: datasetsOverview
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: getTooltipConfig()
            },
            scales: {
                y: {
                    grid: { color: 'rgba(15, 23, 42, 0.08)' },
                    ticks: {
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    }
                },
                x: { 
                    grid: { display: false }
                }
            }
        },
        plugins: [{
            id: 'pandemicPhaseZone',
            beforeDraw: (chart) => {
                const ctx = chart.ctx;
                const xAxis = chart.scales.x;
                const yAxis = chart.scales.y;
                
                const startX = xAxis.getPixelForValue('2020');
                const endX = xAxis.getPixelForValue('2022');
                const isDark = currentTheme === 'dark';
                
                // Draw subtle translucent gray block for lockdowns
                ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(15, 23, 42, 0.015)';
                ctx.fillRect(startX, yAxis.top, endX - startX, yAxis.bottom - yAxis.top);
                
                // Dotted vertical limiters
                ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.1)';
                ctx.lineWidth = 1;
                ctx.setLineDash([3, 3]);
                
                ctx.beginPath();
                ctx.moveTo(startX, yAxis.top);
                ctx.lineTo(startX, yAxis.bottom);
                ctx.moveTo(endX, yAxis.top);
                ctx.lineTo(endX, yAxis.bottom);
                ctx.stroke();
                ctx.setLineDash([]);
                
                // Draw Zone Title
                ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(15, 23, 42, 0.4)';
                ctx.font = "700 9px 'Plus Jakarta Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif";
                ctx.fillText('PERIODE KRISIS PANDEMI', startX + 15, yAxis.top + 20);
            }
        }, crosshairPlugin]
    });

    renderCustomLegend();

    // 2. Resilience Score Chart (Bar Chart)
    const sortedResilience = [...countriesData].filter(d => d.country !== 'ASEAN').sort((a,b) => b.metrics.resilience_score - a.metrics.resilience_score);
    const isDark = currentTheme === 'dark';

    charts.resilience = new Chart(ctxResilience, {
        type: 'bar',
        data: {
            labels: sortedResilience.map(d => d.country),
            datasets: [{
                label: 'Skor Ketangguhan',
                data: sortedResilience.map(d => d.metrics.resilience_score),
                backgroundColor: sortedResilience.map(d => d.country === selectedCountry ? COLORS.accent : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.08)')),
                borderColor: 'transparent',
                borderWidth: 0,
                borderRadius: 6,
                barThickness: 20
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                legend: { display: false },
                tooltip: getTooltipConfig()
            },
            scales: {
                y: { 
                    grid: { color: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)' }
                },
                x: { 
                    grid: { display: false }
                }
            }
        }
    });

    // 3. Resilience Scatter Chart (Drop vs Recovery)
    charts.scatter = new Chart(ctxScatter, {
        type: 'bubble',
        data: {
            datasets: getScatterDatasets()
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    ...getTooltipConfig(),
                    callbacks: {
                        label: function(context) {
                            const raw = context.raw;
                            return ` ${raw.label}: Drop ${raw.x}%, Recovery ${raw.y}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Keparahan Penurunan (Drop Severity %)', font: { weight: 'bold', family: '"Inter", -apple-system, sans-serif' } },
                    grid: { color: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)' },
                    ticks: {
                        callback: function(val) { return val + '%'; }
                    }
                },
                y: {
                    title: { display: true, text: 'Tingkat Pemulihan (Recovery Rate %)', font: { weight: 'bold', family: '"Inter", -apple-system, sans-serif' } },
                    grid: { color: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)' },
                    ticks: {
                        callback: function(val) { return val + '%'; }
                    }
                }
            }
        }
    });

    // 4. Forecast Chart (Historical + Projections)
    const forecastData = getForecastData();

    charts.forecast = new Chart(ctxForecast, {
        type: 'line',
        data: {
            labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026 (Est)', '2027 (Est)'],
            datasets: [
                {
                    label: 'Historis Aktual',
                    data: forecastData.history,
                    borderColor: COLORS.accent,
                    backgroundColor: isDark ? 'rgba(99, 102, 241, 0.05)' : 'rgba(79, 70, 229, 0.05)',
                    borderWidth: 2.5,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: COLORS.accent,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 1.5,
                    pointHoverRadius: 6
                },
                {
                    label: 'Proyeksi Tren',
                    data: forecastData.forecast,
                    borderColor: isDark ? '#a5b4fc' : '#818cf8',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.4,
                    pointStyle: 'circle',
                    pointRadius: 5,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: COLORS.accent,
                    pointBorderWidth: 1.5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                tooltip: {
                    ...getTooltipConfig(),
                    callbacks: {
                        label: function(context) {
                            return ` ${context.dataset.label}: ${formatNumber(context.raw)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    grid: { color: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)' },
                    ticks: {
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    }
                },
                x: { 
                    grid: { display: false }
                }
            }
        },
        plugins: [crosshairPlugin]
    });

    updateCharts();
}

// Generate Datasets for main Line Chart
function getOverviewDatasets(ctx) {
    const isDark = currentTheme === 'dark';
    
    if (isComparisonMode) {
        let colorIdx = 0;
        return countriesData
            .filter(item => comparisonCountries.includes(item.country))
            .map(item => {
                const color = COMPARISON_COLORS[colorIdx % COMPARISON_COLORS.length];
                colorIdx++;
                
                const dataArr = ['2019', '2020', '2021', '2022', '2023', '2024', '2025'].map(yr => item.history[yr]);
                let gradientBg = 'transparent';
                if (ctx) {
                    try {
                        const grad = ctx.createLinearGradient(0, 0, 0, 350);
                        const rgb = hexToRgb(color);
                        if (rgb) {
                            grad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`);
                            grad.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.0)`);
                            gradientBg = grad;
                        }
                    } catch (e) {
                        console.error('Error creating gradient:', e);
                    }
                }
                
                return {
                    label: item.country,
                    data: dataArr,
                    borderColor: color,
                    backgroundColor: gradientBg,
                    borderWidth: 2.5,
                    pointBackgroundColor: color,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 1.5,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    tension: 0.35,
                    fill: true
                };
            });
    } else {
        return countriesData.map(item => {
            const isSelected = item.country === selectedCountry;
            const dataArr = ['2019', '2020', '2021', '2022', '2023', '2024', '2025'].map(yr => item.history[yr]);
            
            let color = isDark ? '#2c2c2e' : '#e5e7eb'; 
            let gradientBg = 'transparent';
            
            if (isSelected) {
                color = COLORS.accent;
                if (ctx) {
                    try {
                        const grad = ctx.createLinearGradient(0, 0, 0, 350);
                        const rgb = hexToRgb(color);
                        if (rgb) {
                            grad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`);
                            grad.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.0)`);
                            gradientBg = grad;
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
            
            return {
                label: item.country,
                data: dataArr,
                borderColor: color,
                backgroundColor: gradientBg,
                borderWidth: isSelected ? 3.5 : 1.2,
                pointBackgroundColor: isSelected ? COLORS.accent : 'transparent',
                pointBorderColor: isSelected ? '#ffffff' : 'transparent',
                pointBorderWidth: isSelected ? 2 : 0,
                pointRadius: isSelected ? 5 : 0,
                pointHoverRadius: isSelected ? 7 : 4,
                tension: 0.35,
                fill: isSelected
            };
        });
    }
}

// Custom Legend for Line Chart
function renderCustomLegend() {
    const legendEl = document.getElementById('overview-legend');
    if (!legendEl) return;
    legendEl.innerHTML = '';
    
    countriesData.forEach((item, idx) => {
        const isSelected = isComparisonMode 
            ? comparisonCountries.includes(item.country) 
            : item.country === selectedCountry;
            
        const legendItem = document.createElement('div');
        legendItem.className = `legend-item ${isSelected ? 'selected' : ''}`;
        
        let color = COLORS.accent;
        if (isComparisonMode) {
            const compIdx = comparisonCountries.indexOf(item.country);
            if (compIdx !== -1) {
                color = COMPARISON_COLORS[compIdx % COMPARISON_COLORS.length];
            } else {
                color = currentTheme === 'dark' ? '#48484a' : '#d1d1d6';
            }
        }
        
        let bgStyle = isSelected ? color : 'transparent';
        let textStyle = isSelected ? '#ffffff' : 'var(--color-primary)';
        let borderStyle = isSelected ? `1px solid ${color}` : '1px solid var(--color-border)';

        legendItem.setAttribute('style', `background-color: ${bgStyle}; color: ${textStyle}; border: ${borderStyle}`);
        
        legendItem.innerHTML = `
            <span class="legend-dot" style="background-color: ${isSelected ? '#ffffff' : color}"></span>
            ${item.country === 'ASEAN' ? 'ASEAN' : item.country}
        `;
        
        legendItem.onclick = () => {
            if (isComparisonMode) {
                const checkbox = document.querySelector(`#comparison-checklist input[value="${item.country}"]`);
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    handleComparisonCheckChange(checkbox);
                }
            } else {
                selectedCountry = item.country;
                document.getElementById('country-selector').value = item.country;
                updateKPIs();
                updateEconomicCalculations();
                updateSmartInsights();
                updateCharts();
                highlightActiveTableRow();
            }
        };
        
        legendEl.appendChild(legendItem);
    });
}

// Scatter Plot Datasets
function getScatterDatasets() {
    const isDark = currentTheme === 'dark';
    const isASEAN = selectedCountry === 'ASEAN';
    const dataPoints = countriesData
        .filter(d => d.country !== 'ASEAN')
        .map(d => {
            const isSelected = d.country === selectedCountry;
            let bg, bc;
            if (isASEAN) {
                bg = isDark ? 'rgba(10, 132, 255, 0.45)' : 'rgba(0, 113, 227, 0.45)';
                bc = isDark ? '#0a84ff' : '#0071e3';
            } else {
                bg = isSelected ? COLORS.accent : (isDark ? '#3a3a3c' : '#e5e5ea');
                bc = isSelected ? (isDark ? '#ffffff' : COLORS.accent) : (isDark ? '#48484a' : '#d1d1d6');
            }
            return {
                x: d.metrics.drop_severity_pct,
                y: d.metrics.recovery_rate_2025_pct,
                r: isSelected ? 12 : 6.5,
                label: d.country,
                isSelected: isSelected,
                backgroundColor: bg,
                borderColor: bc
            };
        });

    return [{
        data: dataPoints,
        backgroundColor: dataPoints.map(p => p.backgroundColor),
        borderColor: dataPoints.map(p => p.borderColor),
        borderWidth: dataPoints.map(p => p.isSelected ? 2 : 1),
        hoverBackgroundColor: COLORS.accent
    }];
}

// Historical + Projected Lines
function getForecastData() {
    const data = countriesData.find(d => d.country === selectedCountry);
    if (!data) return { history: [], forecast: [] };

    const histArr = ['2019', '2020', '2021', '2022', '2023', '2024', '2025'].map(yr => data.history[yr]);
    
    // Project starts at the end of history (index 6, 2025)
    const foreArr = Array(6).fill(null);
    foreArr.push(data.history['2025']);
    
    const adj2026 = Math.max(0, Math.round(data.forecast['2026'] * (1 + growthRateAdjustment / 100)));
    const adj2027 = Math.max(0, Math.round(data.forecast['2027'] * (1 + growthRateAdjustment / 100)));
    
    foreArr.push(adj2026);
    foreArr.push(adj2027);

    const paddedHist = [...histArr, null, null];

    return {
        history: paddedHist,
        forecast: foreArr
    };
}

// Update charts datasets dynamically
function updateCharts() {
    if (!charts.overview || !charts.resilience || !charts.scatter || !charts.forecast) return;

    // Update dynamic options based on current theme
    updateChartOptions(charts.overview);
    updateChartOptions(charts.resilience);
    updateChartOptions(charts.scatter);
    updateChartOptions(charts.forecast);

    const ctxOverview = document.getElementById('overviewChart').getContext('2d');
    const ctxForecast = document.getElementById('forecastChart').getContext('2d');
    const isDark = currentTheme === 'dark';
    const isASEAN = selectedCountry === 'ASEAN';

    // 1. Overview
    charts.overview.data.datasets = getOverviewDatasets(ctxOverview);
    charts.overview.update();
    renderCustomLegend();

    // 2. Resilience Bar Chart
    const sortedResilience = [...countriesData].filter(d => d.country !== 'ASEAN').sort((a,b) => b.metrics.resilience_score - a.metrics.resilience_score);
    charts.resilience.data.datasets[0].backgroundColor = sortedResilience.map(d => {
        if (isASEAN) {
            return isDark ? 'rgba(10, 132, 255, 0.5)' : 'rgba(0, 113, 227, 0.5)';
        }
        return d.country === selectedCountry ? COLORS.accent : (isDark ? '#3a3a3c' : '#e5e5ea');
    });
    charts.resilience.data.datasets[0].borderColor = 'transparent';
    charts.resilience.data.datasets[0].borderWidth = 0;
    charts.resilience.data.datasets[0].borderRadius = 4; // Apple Minimal card corner radius
    charts.resilience.update();

    // 3. Scatter Chart
    charts.scatter.data.datasets = getScatterDatasets();
    charts.scatter.update();

    // 4. Forecast
    const fore = getForecastData();
    charts.forecast.data.datasets[0].data = fore.history;
    charts.forecast.data.datasets[0].borderColor = COLORS.accent;
    charts.forecast.data.datasets[0].pointBackgroundColor = COLORS.accent;
    
    // Create gradient fill for forecast chart actual data
    if (ctxForecast) {
        try {
            const grad = ctxForecast.createLinearGradient(0, 0, 0, 350);
            const rgb = hexToRgb(COLORS.accent);
            if (rgb) {
                grad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`);
                grad.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.0)`);
                charts.forecast.data.datasets[0].backgroundColor = grad;
                charts.forecast.data.datasets[0].fill = true;
            }
        } catch (e) {
            console.error(e);
        }
    }
    
    charts.forecast.data.datasets[1].data = fore.forecast;
    charts.forecast.data.datasets[1].borderColor = isDark ? '#3899ec' : '#64b5f6'; // Lighter Apple Blue for forecast projection
    charts.forecast.data.datasets[1].pointBorderColor = COLORS.accent;
    charts.forecast.update();
    
    updateMapHighlights();
}

// Populate Tables
function populateTables() {
    // A. Resilience Ranking
    const tableBody = document.querySelector('#resilience-table tbody');
    if (tableBody) {
        tableBody.innerHTML = '';
        
        const sorted = [...countriesData].filter(d => d.country !== 'ASEAN').sort((a, b) => b.metrics.resilience_score - a.metrics.resilience_score);
        
        sorted.forEach((item, idx) => {
            const row = document.createElement('tr');
            row.id = `row-resilience-${item.country.replace(/\s+/g, '')}`;
            if (item.country === selectedCountry) row.className = 'active-row';
            
            const v2020 = item.history['2020'];
            const v2021 = item.history['2021'];
            const worstVal = v2021 < v2020 ? v2021 : v2020;
            
            const isRecovered = item.metrics.years_to_recover !== 'Not fully recovered';
            const badgeClass = isRecovered ? 'badge success' : 'badge danger';
            
            row.innerHTML = `
                <td>${idx + 1}</td>
                <td><strong>${item.country}</strong></td>
                <td>${formatNumber(worstVal)}</td>
                <td style="color: ${COLORS.error}; font-weight: 500">${item.metrics.drop_severity_pct}%</td>
                <td>${item.metrics.recovery_rate_2025_pct}%</td>
                <td><span class="${badgeClass}">${item.metrics.years_to_recover === 'Not fully recovered' ? 'Belum Pulih' : item.metrics.years_to_recover}</span></td>
                <td style="color: var(--color-primary); font-weight: bold">${item.metrics.resilience_score}</td>
            `;
            
            row.onclick = () => selectCountryFromTable(item.country);
            tableBody.appendChild(row);
        });
    }

    // B. Forecast Estimate
    updateForecastTable();

    // C. Data Explorer Table
    renderExplorerTable();
}

// Click on table row to select country globally
function selectCountryFromTable(countryName) {
    selectedCountry = countryName;
    document.getElementById('country-selector').value = countryName;
    updateKPIs();
    updateEconomicCalculations();
    updateSmartInsights();
    updateCharts();
    highlightActiveTableRow();
}

// Manage Active highlight row classes
function highlightActiveTableRow() {
    // Remove active-row class from all rows
    document.querySelectorAll('.custom-table tbody tr').forEach(row => {
        row.classList.remove('active-row');
    });
    
    // Add to active row in all tables
    const key = selectedCountry.replace(/\s+/g, '');
    const rows = [
        document.getElementById(`row-resilience-${key}`),
        document.getElementById(`row-forecast-${key}`),
        document.getElementById(`row-explorer-${key}`)
    ];
    
    rows.forEach(row => {
        if (row) row.classList.add('active-row');
    });
}

// CSV Export
window.exportCSV = function() {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // CSV Header row
    csvContent += "Negara,2019,2020,2021,2022,2023,2024,2025,2026_Est,2027_Est,Drop_Severity_Pct,Recovery_Rate_Pct,Resilience_Score\n";
    
    countriesData.forEach(item => {
        const row = [
            item.country,
            item.history['2019'] || '',
            item.history['2020'] || '',
            item.history['2021'] || '',
            item.history['2022'] || '',
            item.history['2023'] || '',
            item.history['2024'] || '',
            item.history['2025'] || '',
            item.forecast['2026'] || '',
            item.forecast['2027'] || '',
            item.metrics.drop_severity_pct || '',
            item.metrics.recovery_rate_2025_pct || '',
            item.metrics.resilience_score || ''
        ].join(",");
        csvContent += row + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "asean_tourism_recovery_analysis.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// SIMULATOR AND COMPARISON LOGIC

const COMPARISON_COLORS = [
    '#0071e3', // Apple Blue
    '#30d158', // Apple Green
    '#ff9f0a', // Apple Orange
    '#bf5af2', // Apple Purple
    '#ff453a', // Apple Red
    '#64d2ff', // Apple Light Blue
    '#ffd60a', // Apple Yellow
    '#ff2d55', // Apple Pink
    '#af52de', // Purple Dark
    '#5856d6', // Indigo
    '#a2845e'  // Brown
];

function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function populateComparisonChecklist() {
    const listEl = document.getElementById('comparison-checklist');
    if (!listEl) return;
    listEl.innerHTML = '';
    
    countriesData.forEach(item => {
        const div = document.createElement('label');
        div.className = 'comparison-item';
        
        const isChecked = comparisonCountries.includes(item.country);
        
        div.innerHTML = `
            <input type="checkbox" value="${item.country}" ${isChecked ? 'checked' : ''} onchange="handleComparisonCheckChange(this)">
            <span>${item.country === 'ASEAN' ? 'ASEAN (Gabungan)' : item.country}</span>
        `;
        listEl.appendChild(div);
    });
}

window.handleComparisonCheckChange = function(checkbox) {
    const val = checkbox.value;
    if (checkbox.checked) {
        if (!comparisonCountries.includes(val)) {
            comparisonCountries.push(val);
        }
    } else {
        if (comparisonCountries.length > 1) {
            comparisonCountries = comparisonCountries.filter(c => c !== val);
        } else {
            checkbox.checked = true;
            alert('Pilih minimal satu negara pembanding.');
        }
    }
    updateCharts();
    updateKPIs();
    updateEconomicCalculations();
    updateSmartInsights();
};

window.handleYearChange = function() {
    const yearSelector = document.getElementById('year-selector');
    selectedYear = yearSelector.value;
    
    document.querySelectorAll('.spending-year-lbl').forEach(el => el.textContent = selectedYear);
    
    updateKPIs();
    updateEconomicCalculations();
};

window.toggleComparisonMode = function() {
    const toggle = document.getElementById('compare-toggle');
    isComparisonMode = toggle.checked;
    
    const panel = document.getElementById('comparison-panel');
    if (isComparisonMode) {
        panel.classList.add('active');
    } else {
        panel.classList.remove('active');
    }
    
    updateCharts();
    updateKPIs();
    updateEconomicCalculations();
    updateSmartInsights();
};

window.handleSpendingChange = function(val) {
    averageSpending = parseInt(val);
    document.getElementById('spending-value').textContent = '$' + averageSpending.toLocaleString('id-ID');
    updateEconomicCalculations();
};

window.handleWhatIfChange = function(val) {
    growthRateAdjustment = parseInt(val);
    const valText = growthRateAdjustment > 0 ? `Optimis (+${growthRateAdjustment}%)` : (growthRateAdjustment < 0 ? `Pesimis (${growthRateAdjustment}%)` : 'Moderat (0%)');
    document.getElementById('whatif-value').textContent = valText;
    updateCharts();
    updateForecastTable();
};

function updateEconomicCalculations() {
    const data = countriesData.find(d => d.country === selectedCountry);
    if (!data) return;

    const valActiveYear = data.history[selectedYear];
    const val2019 = data.history['2019'];

    if (valActiveYear !== null && valActiveYear !== undefined) {
        const estRevenue = valActiveYear * averageSpending;
        document.getElementById('sim-revenue').textContent = '$' + estRevenue.toLocaleString('en-US');
    } else {
        document.getElementById('sim-revenue').textContent = 'N/A';
    }

    let totalLoss = 0;
    let hasCompleteData = true;
    
    ['2020', '2021', '2022'].forEach(yr => {
        const valYr = data.history[yr];
        if (val2019 && valYr !== null && valYr !== undefined) {
            const diff = val2019 - valYr;
            if (diff > 0) {
                totalLoss += diff * averageSpending;
            }
        } else {
            hasCompleteData = false;
        }
    });

    if (val2019 && hasCompleteData) {
        document.getElementById('sim-loss').textContent = '$' + totalLoss.toLocaleString('en-US');
    } else {
        document.getElementById('sim-loss').textContent = 'Data tidak lengkap';
    }
}

function updateSmartInsights() {
    const container = document.getElementById('insight-container');
    if (!container) return;

    if (isComparisonMode) {
        container.innerHTML = `
            <h3><span class="insight-badge" style="background-color: var(--color-accent-light); color: var(--color-accent);">Perbandingan</span> Analisis Multi-Negara</h3>
            <p class="insight-desc">
                Anda sedang dalam <strong>Mode Perbandingan</strong> dengan <strong>${comparisonCountries.length} negara</strong> terpilih. 
                Garis berwarna pada grafik di atas menampilkan perbandingan laju pemulihan sektoral secara real-time. 
                <br><br>
                <em>Rekomendasi Analitis:</em> Bandingkan kemiringan kurva dari tahun 2021 ke 2025 untuk melihat kecepatan pemulihan pasar masing-masing destinasi.
            </p>
        `;
        return;
    }

    const data = countriesData.find(d => d.country === selectedCountry);
    if (!data) return;

    const rate = data.metrics.recovery_rate_2025_pct;
    const score = data.metrics.resilience_score;
    const countryName = data.country === 'ASEAN' ? 'Wilayah ASEAN' : data.country;
    
    let badgeText = "Rentan";
    let badgeClass = "low";
    let analysisText = "";
    let recommendation = "";

    if (score >= 150) {
        badgeText = "Sangat Tangguh";
        badgeClass = "high";
        analysisText = `${countryName} memimpin pemulihan regional dengan tingkat pemulihan luar biasa sebesar ${rate}% dibanding kondisi pra-pandemi, menjadikannya destinasi dengan tingkat resiliensi pariwisata tertinggi di kelasnya.`;
        recommendation = "Fokus pada pariwisata berkelanjutan (sustainable tourism), diversifikasi pasar pariwisata minat khusus, dan optimalkan pengelolaan daya tampung destinasi (carrying capacity).";
    } else if (score >= 100) {
        badgeText = "Tangguh";
        badgeClass = "mod";
        analysisText = `${countryName} menunjukkan pemulihan tangguh mendekati kapasitas penuh (${rate}%). Kehilangan pasar saat puncak krisis berhasil ditekan dengan baik atau pemulihan berjalan sangat progresif.`;
        recommendation = "Perluas program kerja sama promosi penerbangan langsung internasional dan maksimalkan kemudahan izin kunjungan (bebas visa kunjungan singkat).";
    } else if (score >= 70) {
        badgeText = "Moderat";
        badgeClass = "mod";
        analysisText = `${countryName} berada di fase pemulihan moderat (${rate}%). Pemulihan pariwisata berjalan stabil namun belum mencapai tingkat normal awal akibat masih terbatasnya jalur konektivitas udara internasional.`;
        recommendation = "Lakukan deregulasi tarif penerbangan internasional, luncurkan insentif pariwisata, dan bangun branding destinasi yang lebih kompetitif di kancah global.";
    } else {
        badgeText = "Sangat Rentan";
        badgeClass = "low";
        analysisText = `${countryName} tergolong sangat rentan dengan tingkat pemulihan baru mencapai ${rate}%. Sektor pariwisata domestik dan internasional masih mengalami tekanan berat pasca-pandemi.`;
        recommendation = "Dibutuhkan intervensi kebijakan strategis darurat dari pemerintah, insentif pajak bagi pelaku usaha pariwisata, dan restorasi total rute penerbangan udara internasional.";
    }

    container.innerHTML = `
        <h3><span class="insight-badge" style="background-color: var(--color-accent-light); color: var(--color-accent);">${badgeText}</span> Profil Analisis: ${countryName}</h3>
        <p class="insight-desc">
            ${analysisText}
            <br><br>
            <strong>Rekomendasi Kebijakan:</strong> ${recommendation}
        </p>
    `;
}

function updateForecastTable() {
    const foreBody = document.querySelector('#forecast-table tbody');
    if (!foreBody) return;
    
    foreBody.innerHTML = '';
    countriesData.forEach(item => {
        const row = document.createElement('tr');
        row.id = `row-forecast-${item.country.replace(/\s+/g, '')}`;
        if (item.country === selectedCountry) row.className = 'active-row';
        
        const val2025 = item.history['2025'];
        const active2026 = Math.max(0, Math.round(item.forecast['2026'] * (1 + growthRateAdjustment / 100)));
        const active2027 = Math.max(0, Math.round(item.forecast['2027'] * (1 + growthRateAdjustment / 100)));
        
        let pctGrowth = '0%';
        let isPositive = true;
        if (val2025 && active2027 && val2025 > 0 && active2027 >= 0) {
            // Compound Annual Growth Rate (CAGR) for 2 years (2025 to 2027)
            const cagr = (Math.pow(active2027 / val2025, 1 / 2) - 1) * 100;
            isPositive = cagr >= 0;
            pctGrowth = (isPositive ? '+' : '') + cagr.toFixed(1) + '%';
        }
        
        const growthColor = isPositive ? 'var(--color-success)' : 'var(--color-error)';
        
        row.innerHTML = `
            <td><strong>${item.country === 'ASEAN' ? 'ASEAN (Total)' : item.country}</strong></td>
            <td>${formatNumber(val2025)}</td>
            <td>${formatNumber(active2026)}</td>
            <td>${formatNumber(active2027)}</td>
            <td style="color: ${growthColor}; font-weight: bold">${pctGrowth}</td>
        `;
        
        row.onclick = () => selectCountryFromTable(item.country);
        foreBody.appendChild(row);
    });
}

// ==========================================================================
// ADVANCED INTERACTION FUNCTIONS
// ==========================================================================

// Sorting and Filter States
let sortColumn = 'country';
let sortAscending = true;
let tableSearchQuery = '';

// Custom Chart.js Crosshair Guide Line Plugin
const crosshairPlugin = {
    id: 'crosshair',
    afterDraw: (chart) => {
        if (chart.tooltip?._active?.length) {
            const activePoint = chart.tooltip._active[0];
            const ctx = chart.ctx;
            const x = activePoint.element.x;
            const topY = chart.scales.y.top;
            const bottomY = chart.scales.y.bottom;
            
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, topY);
            ctx.lineTo(x, bottomY);
            ctx.lineWidth = 1;
            ctx.strokeStyle = currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.15)';
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.restore();
        }
    }
};

// Count-Up Animation for Metrik/KPI Numbers
function animateCountUp(elementId, targetVal) {
    const el = document.getElementById(elementId);
    if (!el) return;

    if (targetVal === null || targetVal === undefined || isNaN(targetVal)) {
        el.textContent = 'N/A';
        return;
    }

    const target = parseFloat(targetVal);
    const isArrivals = elementId === 'kpi-arrivals';
    const isDrop = elementId === 'kpi-drop';
    const isRecovery = elementId === 'kpi-recovery';
    const isResilience = elementId === 'kpi-resilience';
    
    // Parse current value
    let currentVal = parseFloat(el.textContent.replace(/[^0-9.-]/g, '')) || 0;
    if (isArrivals && el.textContent.includes('Juta')) {
        currentVal = currentVal * 1000000;
    }

    const duration = 750; // milidetik
    const startTime = performance.now();

    function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // easeOutQuad curve
        const ease = progress * (2 - progress);
        const current = currentVal + (target - currentVal) * ease;

        if (isArrivals) {
            el.textContent = formatNumber(Math.round(current));
        } else if (isDrop || isRecovery) {
            el.textContent = current.toFixed(2) + '%';
        } else if (isResilience) {
            el.textContent = current.toFixed(2);
        } else {
            el.textContent = current.toFixed(1);
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            if (isArrivals) {
                el.textContent = formatNumber(target);
            } else if (isDrop || isRecovery) {
                el.textContent = target.toFixed(2) + '%';
            } else if (isResilience) {
                el.textContent = target.toFixed(2);
            } else {
                el.textContent = target;
            }
        }
    }

    requestAnimationFrame(update);
}

// Inisialisasi Peta Interaktif ASEAN SVG
function initAseanMap() {
    const mapCountries = document.querySelectorAll('.map-country');
    const tooltip = document.getElementById('map-tooltip');
    const tooltipTitle = document.getElementById('map-tooltip-title');
    const tooltipDesc = document.getElementById('map-tooltip-desc');
    
    if (!mapCountries.length || !tooltip) return;

    mapCountries.forEach(path => {
        const countryName = path.getAttribute('data-country');
        const data = countriesData.find(d => d.country === countryName);
        
        if (data) {
            // Berikan kelas warna resiliensi berdasarkan skor
            const score = data.metrics.resilience_score;
            if (score >= 150) {
                path.classList.add('res-high');
            } else if (score >= 100) {
                path.classList.add('res-med');
            } else if (score >= 70) {
                path.classList.add('res-mod');
            } else {
                path.classList.add('res-low');
            }
        }

        // Mouse Enter / Hover
        path.addEventListener('mouseenter', (e) => {
            if (!data) return;
            const rate = data.metrics.recovery_rate_2025_pct;
            const arrivals = data.history[selectedYear];
            
            tooltipTitle.textContent = countryName === 'Brunei Darussalam' ? 'Brunei' : countryName;
            tooltipDesc.innerHTML = `
                Kunjungan (${selectedYear}): <strong>${formatNumber(arrivals)}</strong><br>
                Tingkat Pulih: <strong>${rate}%</strong><br>
                Skor Resiliensi: <strong>${data.metrics.resilience_score}</strong>
            `;
            
            tooltip.classList.add('visible');
        });

        // Mouse Move (kursor melayang)
        path.addEventListener('mousemove', (e) => {
            const mapCard = document.querySelector('.map-card-wrapper');
            const cardRect = mapCard.getBoundingClientRect();
            
            // Atur posisi relatif di dalam kartu
            const x = e.clientX - cardRect.left;
            const y = e.clientY - cardRect.top;
            
            tooltip.style.left = x + 'px';
            tooltip.style.top = y + 'px';
        });

        // Mouse Leave
        path.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });

        // Click Event (ganti negara)
        path.addEventListener('click', () => {
            if (isComparisonMode) {
                const checkbox = document.querySelector(`#comparison-checklist input[value="${countryName}"]`);
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    handleComparisonCheckChange(checkbox);
                }
            } else {
                selectedCountry = countryName;
                document.getElementById('country-selector').value = countryName;
                updateKPIs();
                updateEconomicCalculations();
                updateSmartInsights();
                updateCharts();
                highlightActiveTableRow();
            }
        });
    });
    
    updateMapHighlights();
}

// Update Highlight Negara Aktif di Peta
function updateMapHighlights() {
    document.querySelectorAll('.map-country').forEach(path => {
        const countryName = path.getAttribute('data-country');
        if (isComparisonMode) {
            if (comparisonCountries.includes(countryName)) {
                path.classList.add('active');
            } else {
                path.classList.remove('active');
            }
        } else {
            if (countryName === selectedCountry) {
                path.classList.add('active');
            } else {
                path.classList.remove('active');
            }
        }
    });
}

// Render Data Explorer Table dengan Pencarian & Pengurutan Kolom
function renderExplorerTable() {
    const expHead = document.querySelector('#explorer-table thead');
    const expBody = document.querySelector('#explorer-table tbody');
    if (!expHead || !expBody) return;

    const columns = [
        { id: 'country', label: 'Negara' },
        { id: '2019', label: '2019' },
        { id: '2020', label: '2020' },
        { id: '2021', label: '2021' },
        { id: '2022', label: '2022' },
        { id: '2023', label: '2023' },
        { id: '2024', label: '2024' },
        { id: '2025', label: '2025' },
        { id: '2026', label: '2026 (Est)' },
        { id: '2027', label: '2027 (Est)' },
        { id: 'drop', label: 'Drop Severity %' },
        { id: 'recovery', label: 'Recovery Rate %' },
        { id: 'score', label: 'Score' }
    ];

    // Buat Headers
    expHead.innerHTML = `
        <tr>
            ${columns.map(col => {
                const isSorted = sortColumn === col.id;
                const sortClass = isSorted ? (sortAscending ? 'asc' : 'desc') : '';
                return `
                    <th class="sortable-header ${sortClass}" onclick="handleTableSort('${col.id}')">
                        ${col.label}
                        <span class="sort-indicator"></span>
                    </th>
                `;
            }).join('')}
        </tr>
    `;

    // Filter data berdasarkan kotak input pencarian
    let filteredData = countriesData.filter(item => {
        const query = tableSearchQuery.toLowerCase();
        return item.country.toLowerCase().includes(query);
    });

    // Urutkan data berdasarkan kolom terpilih
    filteredData.sort((a, b) => {
        let valA, valB;
        
        if (sortColumn === 'country') {
            // Pertahankan ASEAN di bagian atas jika pengurutan standar
            if (a.country === 'ASEAN') return -1;
            if (b.country === 'ASEAN') return 1;
            valA = a.country;
            valB = b.country;
        } else if (['2019', '2020', '2021', '2022', '2023', '2024', '2025'].includes(sortColumn)) {
            valA = a.history[sortColumn] || 0;
            valB = b.history[sortColumn] || 0;
        } else if (['2026', '2027'].includes(sortColumn)) {
            valA = a.forecast[sortColumn] || 0;
            valB = b.forecast[sortColumn] || 0;
        } else if (sortColumn === 'drop') {
            valA = a.metrics.drop_severity_pct || 0;
            valB = b.metrics.drop_severity_pct || 0;
        } else if (sortColumn === 'recovery') {
            valA = a.metrics.recovery_rate_2025_pct || 0;
            valB = b.metrics.recovery_rate_2025_pct || 0;
        } else if (sortColumn === 'score') {
            valA = a.metrics.resilience_score || 0;
            valB = b.metrics.resilience_score || 0;
        }

        if (valA < valB) return sortAscending ? -1 : 1;
        if (valA > valB) return sortAscending ? 1 : -1;
        return 0;
    });

    // Render baris tabel
    expBody.innerHTML = '';
    filteredData.forEach(item => {
        const row = document.createElement('tr');
        row.id = `row-explorer-${item.country.replace(/\s+/g, '')}`;
        if (item.country === selectedCountry) row.className = 'active-row';
        
        row.innerHTML = `
            <td><strong>${item.country === 'ASEAN' ? 'ASEAN (Total)' : item.country}</strong></td>
            <td>${formatNumber(item.history['2019'])}</td>
            <td>${formatNumber(item.history['2020'])}</td>
            <td>${formatNumber(item.history['2021'])}</td>
            <td>${formatNumber(item.history['2022'])}</td>
            <td>${formatNumber(item.history['2023'])}</td>
            <td>${formatNumber(item.history['2024'])}</td>
            <td>${formatNumber(item.history['2025'])}</td>
            <td style="color: var(--color-primary); font-weight: 500">${formatNumber(item.forecast['2026'])}</td>
            <td style="color: var(--color-primary); font-weight: 500">${formatNumber(item.forecast['2027'])}</td>
            <td style="color: ${COLORS.error}; font-weight: 500">${item.metrics.drop_severity_pct}%</td>
            <td style="color: var(--color-primary); font-weight: 500">${item.metrics.recovery_rate_2025_pct}%</td>
            <td style="font-weight: bold">${item.metrics.resilience_score}</td>
        `;
        
        row.onclick = () => selectCountryFromTable(item.country);
        expBody.appendChild(row);
    });
}

// Handler Kotak Input Pencarian
window.handleTableSearch = function(val) {
    tableSearchQuery = val;
    renderExplorerTable();
};

// Handler Pengurutan Kolom Kepala Tabel
window.handleTableSort = function(colId) {
    if (sortColumn === colId) {
        sortAscending = !sortAscending;
    } else {
        sortColumn = colId;
        sortAscending = true;
    }
    renderExplorerTable();
};

