// Global State
let countriesData = [];
let selectedCountry = 'ASEAN';
let charts = {};

// Palette Colors matching Flyhyer Minimal
const COLORS = {
    primary: '#000000',
    secondary: '#e5e7eb',
    tertiary: '#ffffff',
    neutral: '#ffffff',
    surface: '#ffffff',
    background: '#ffffff',
    onSurface: '#000000',
    border: '#e5e7eb',
    muted: '#ffffff',
    accent: '#000000',
    error: '#d92d20'
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
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
        updateKPIs();
        initCharts();
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
    const val2025 = data.history['2025'];
    
    // 1. KPI: Arrivals
    document.getElementById('kpi-arrivals').textContent = formatNumber(val2025);
    const arrivalsChangeEl = document.getElementById('kpi-arrivals-change');
    let pctArrivals = 0;
    if (val2019 && val2025) {
        const pctChange = ((val2025 - val2019) / val2019) * 100;
        const sign = pctChange >= 0 ? '+' : '';
        arrivalsChangeEl.textContent = `${sign}${pctChange.toFixed(1)}% vs 2019`;
        arrivalsChangeEl.className = pctChange >= 0 ? 'trend positive' : 'trend negative';
        
        // Progress bar for arrivals = % of 2019 level (capped at 100%)
        pctArrivals = Math.min(100, Math.max(0, (val2025 / val2019) * 100));
    } else {
        arrivalsChangeEl.textContent = 'Data tidak lengkap';
        arrivalsChangeEl.className = 'trend';
    }
    document.getElementById('kpi-progress-arrivals').style.width = `${pctArrivals}%`;

    // 2. KPI: Pandemic Worst Drop
    const dropPct = data.metrics.drop_severity_pct;
    document.getElementById('kpi-drop').textContent = dropPct !== null ? `${dropPct}%` : 'N/A';
    
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
    const recRate = data.metrics.recovery_rate_2025_pct;
    document.getElementById('kpi-recovery').textContent = recRate !== null ? `${recRate}%` : 'N/A';
    
    const recStatusEl = document.getElementById('kpi-recovery-status');
    if (recRate >= 100) {
        recStatusEl.textContent = `Pulih Penuh (${data.metrics.years_to_recover})`;
        recStatusEl.className = 'trend positive';
    } else {
        recStatusEl.textContent = 'Belum Pulih Sepenuhnya';
        recStatusEl.className = 'trend negative';
    }
    const progressRec = recRate !== null ? Math.min(100, recRate) : 0;
    document.getElementById('kpi-progress-recovery').style.width = `${progressRec}%`;

    // 4. KPI: Resilience Score & Badge
    const score = data.metrics.resilience_score;
    document.getElementById('kpi-resilience').textContent = score;
    
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
    
    // Max reasonable score is 200 (100% recovery + 100% retained)
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

// Initialize Charts
function initCharts() {
    const ctxOverview = document.getElementById('overviewChart').getContext('2d');
    const ctxResilience = document.getElementById('resilienceScoreChart').getContext('2d');
    const ctxScatter = document.getElementById('resilienceScatterChart').getContext('2d');
    const ctxForecast = document.getElementById('forecastChart').getContext('2d');

    // Chart.js global overrides for Flyhyer Minimal
    Chart.defaults.color = '#000000';
    Chart.defaults.font.family = '"Inter", -apple-system, sans-serif';
    Chart.defaults.font.size = 10;
    Chart.defaults.borderColor = 'rgba(0, 0, 0, 0.05)';

    // 1. Overview Chart (Line Chart)
    const datasetsOverview = getOverviewDatasets();
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
                tooltip: {
                    backgroundColor: '#ffffff',
                    titleColor: '#000000',
                    bodyColor: '#000000',
                    borderColor: '#000000',
                    borderWidth: 1,
                    padding: 12,
                    boxPadding: 6,
                    cornerRadius: 0,
                    titleFont: { family: '"Inter", -apple-system, sans-serif', weight: 'bold', size: 12 },
                    bodyFont: { family: '"Inter", -apple-system, sans-serif', size: 11 }
                }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: {
                        color: '#000000',
                        font: { family: '"Inter", -apple-system, sans-serif' },
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    }
                },
                x: { 
                    grid: { display: false }, 
                    ticks: { 
                        color: '#000000',
                        font: { family: '"Inter", -apple-system, sans-serif' }
                    } 
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
                
                // Draw subtle translucent gray block for lockdowns
                ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
                ctx.fillRect(startX, yAxis.top, endX - startX, yAxis.bottom - yAxis.top);
                
                // Dotted vertical limiters
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
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
                ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
                ctx.font = "700 9px 'Plus Jakarta Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif";
                ctx.fillText('PERIODE KRISIS PANDEMI', startX + 15, yAxis.top + 20);
            }
        }]
    });

    renderCustomLegend();

    // 2. Resilience Score Chart (Bar Chart)
    const sortedResilience = [...countriesData].filter(d => d.country !== 'ASEAN').sort((a,b) => b.metrics.resilience_score - a.metrics.resilience_score);

    charts.resilience = new Chart(ctxResilience, {
        type: 'bar',
        data: {
            labels: sortedResilience.map(d => d.country),
            datasets: [{
                label: 'Skor Ketangguhan',
                data: sortedResilience.map(d => d.metrics.resilience_score),
                backgroundColor: sortedResilience.map(d => d.country === selectedCountry ? '#000000' : '#e5e7eb'),
                borderColor: 'transparent',
                borderWidth: 0,
                borderRadius: 4,
                barThickness: 20
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { 
                    grid: { color: COLORS.border },
                    ticks: { color: '#000000' }
                },
                x: { 
                    grid: { display: false },
                    ticks: { color: '#000000' }
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
                    backgroundColor: '#ffffff',
                    titleColor: '#000000',
                    bodyColor: '#000000',
                    borderColor: '#000000',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 0,
                    titleFont: { family: '"Inter", -apple-system, sans-serif', weight: 'bold', size: 12 },
                    bodyFont: { family: '"Inter", -apple-system, sans-serif', size: 11 },
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
                    title: { display: true, text: 'Keparahan Penurunan (Drop Severity %)', color: '#000000', font: { weight: 'bold', family: '"Inter", -apple-system, sans-serif' } },
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: {
                        color: '#000000',
                        font: { family: '"Inter", -apple-system, sans-serif' },
                        callback: function(val) { return val + '%'; }
                    }
                },
                y: {
                    title: { display: true, text: 'Tingkat Pemulihan (Recovery Rate %)', color: '#000000', font: { weight: 'bold', family: '"Inter", -apple-system, sans-serif' } },
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: {
                        color: '#000000',
                        font: { family: '"Inter", -apple-system, sans-serif' },
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
                    borderColor: '#000000',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    fill: false,
                    tension: 0,
                    pointRadius: 4,
                    pointBackgroundColor: '#000000',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 1.5,
                    pointHoverRadius: 6
                },
                {
                    label: 'Proyeksi Tren',
                    data: forecastData.forecast,
                    borderColor: '#000000',
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    borderDash: [4, 4],
                    fill: false,
                    tension: 0,
                    pointStyle: 'circle',
                    pointRadius: 4,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#000000',
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
                    backgroundColor: '#ffffff',
                    titleColor: '#000000',
                    bodyColor: '#000000',
                    borderColor: '#000000',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 0,
                    titleFont: { family: '"Inter", -apple-system, sans-serif', weight: 'bold', size: 12 },
                    bodyFont: { family: '"Inter", -apple-system, sans-serif', size: 11 },
                    callbacks: {
                        label: function(context) {
                            return ` ${context.dataset.label}: ${formatNumber(context.raw)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: {
                        color: '#000000',
                        font: { family: '"Inter", -apple-system, sans-serif' },
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    }
                },
                x: { 
                    grid: { display: false }, 
                    ticks: { 
                        color: '#000000',
                        font: { family: '"Inter", -apple-system, sans-serif' }
                    } 
                }
            }
        }
    });
}

// Generate Datasets for main Line Chart
function getOverviewDatasets() {
    return countriesData.map(item => {
        const isSelected = item.country === selectedCountry;
        const dataArr = ['2019', '2020', '2021', '2022', '2023', '2024', '2025'].map(yr => item.history[yr]);
        
        let color = 'rgba(0, 0, 0, 0.15)'; // Stark gray for non-selected
        if (isSelected) {
            color = '#000000'; // Stark black for selected
        }
        
        return {
            label: item.country,
            data: dataArr,
            borderColor: color,
            borderWidth: isSelected ? 3 : 1,
            pointBackgroundColor: isSelected ? '#000000' : 'transparent',
            pointBorderColor: isSelected ? '#ffffff' : 'transparent',
            pointBorderWidth: isSelected ? 1.5 : 0,
            pointRadius: isSelected ? 4 : 0,
            pointHoverRadius: isSelected ? 6 : 3,
            tension: 0, // Stark straight lines for Flyhyer look
            fill: false
        };
    });
}

// Custom Legend for Line Chart
function renderCustomLegend() {
    const legendEl = document.getElementById('overview-legend');
    if (!legendEl) return;
    legendEl.innerHTML = '';
    
    countriesData.forEach(item => {
        const isSelected = item.country === selectedCountry;
        
        const legendItem = document.createElement('div');
        legendItem.className = `legend-item ${isSelected ? 'selected' : ''}`;
        
        let dotColor = '#e5e7eb';
        if (isSelected) {
            dotColor = '#000000';
        }
        
        legendItem.innerHTML = `
            <span class="legend-dot" style="background-color: ${dotColor}"></span>
            ${item.country === 'ASEAN' ? 'ASEAN' : item.country}
        `;
        
        legendItem.onclick = () => {
            selectedCountry = item.country;
            document.getElementById('country-selector').value = item.country;
            updateKPIs();
            updateCharts();
            highlightActiveTableRow();
        };
        
        legendEl.appendChild(legendItem);
    });
}

// Scatter Plot Datasets
function getScatterDatasets() {
    const dataPoints = countriesData
        .filter(d => d.country !== 'ASEAN')
        .map(d => {
            const isSelected = d.country === selectedCountry;
            return {
                x: d.metrics.drop_severity_pct,
                y: d.metrics.recovery_rate_2025_pct,
                r: isSelected ? 10 : 6,
                label: d.country,
                isSelected: isSelected
            };
        });

    return [{
        data: dataPoints,
        backgroundColor: dataPoints.map(p => p.isSelected ? '#000000' : 'transparent'),
        borderColor: dataPoints.map(p => '#000000'),
        borderWidth: 1.5,
        hoverBackgroundColor: '#000000'
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
    foreArr.push(data.forecast['2026']);
    foreArr.push(data.forecast['2027']);

    const paddedHist = [...histArr, null, null];

    return {
        history: paddedHist,
        forecast: foreArr
    };
}

// Update charts datasets dynamically
function updateCharts() {
    if (!charts.overview || !charts.resilience || !charts.scatter || !charts.forecast) return;

    // 1. Overview
    charts.overview.data.datasets = getOverviewDatasets();
    charts.overview.update();
    renderCustomLegend();

    // 2. Resilience Bar Chart
    const sortedResilience = [...countriesData].filter(d => d.country !== 'ASEAN').sort((a,b) => b.metrics.resilience_score - a.metrics.resilience_score);
    charts.resilience.data.datasets[0].backgroundColor = sortedResilience.map(d => d.country === selectedCountry ? COLORS.accent : COLORS.border);
    charts.resilience.data.datasets[0].borderColor = sortedResilience.map(d => d.country === selectedCountry ? COLORS.primary : 'transparent');
    charts.resilience.data.datasets[0].borderWidth = sortedResilience.map(d => d.country === selectedCountry ? 1 : 0);
    charts.resilience.update();

    // 3. Scatter Chart
    charts.scatter.data.datasets = getScatterDatasets();
    charts.scatter.update();

    // 4. Forecast
    const fore = getForecastData();
    charts.forecast.data.datasets[0].data = fore.history;
    charts.forecast.data.datasets[1].data = fore.forecast;
    charts.forecast.update();
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
    const foreBody = document.querySelector('#forecast-table tbody');
    if (foreBody) {
        foreBody.innerHTML = '';
        
        countriesData.forEach(item => {
            const row = document.createElement('tr');
            row.id = `row-forecast-${item.country.replace(/\s+/g, '')}`;
            if (item.country === selectedCountry) row.className = 'active-row';
            
            const val2025 = item.history['2025'];
            const val2027 = item.forecast['2027'];
            let pctGrowth = '0%';
            if (val2025 && val2027) {
                const growth = ((val2027 - val2025) / val2025) * 100;
                pctGrowth = (growth >= 0 ? '+' : '') + growth.toFixed(1) + '%';
            }
            
            row.innerHTML = `
                <td><strong>${item.country === 'ASEAN' ? 'ASEAN (Total)' : item.country}</strong></td>
                <td>${formatNumber(val2025)}</td>
                <td>${formatNumber(item.forecast['2026'])}</td>
                <td>${formatNumber(item.forecast['2027'])}</td>
                <td style="color: var(--color-primary); font-weight: bold">${pctGrowth}</td>
            `;
            
            row.onclick = () => selectCountryFromTable(item.country);
            foreBody.appendChild(row);
        });
    }

    // C. Data Explorer Table
    const expHead = document.querySelector('#explorer-table thead');
    const expBody = document.querySelector('#explorer-table tbody');
    
    if (expHead && expBody) {
        expHead.innerHTML = `
            <tr>
                <th>Negara</th>
                <th>2019</th>
                <th>2020</th>
                <th>2021</th>
                <th>2022</th>
                <th>2023</th>
                <th>2024</th>
                <th>2025</th>
                <th>2026 (Est)</th>
                <th>2027 (Est)</th>
                <th>Drop Severity %</th>
                <th>Recovery Rate %</th>
                <th>Score</th>
            </tr>
        `;
        
        expBody.innerHTML = '';
        countriesData.forEach(item => {
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
}

// Click on table row to select country globally
function selectCountryFromTable(countryName) {
    selectedCountry = countryName;
    document.getElementById('country-selector').value = countryName;
    updateKPIs();
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
