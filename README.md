# ASEAN Tourism Recovery & Economic Resilience Tracker (2019-2027)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## 🇬🇧 English Version

### 🎯 Business Problem Statement
Following global crises, cross-border tourism policies and infrastructure investments must be targeted based on quantitative sector resilience. Tourism ministries and regional policy coalitions require mathematical frameworks to measure recovery speeds and forecast tourist arrivals to optimize tourism resource allocation.

---

### 📌 Executive Summary (30-Second Read)
* **Objective**: Analyzed the impact of COVID-19 and the recovery paths of the tourism sector across **11 ASEAN countries**, measuring resilience indices and projecting tourist arrivals up to **2027**.
* **Key Findings**:
  - **The Crisis Peak**: During the 2020-2021 crisis, international arrivals collapsed to just **2% of 2019 baseline levels** region-wide.
  - **Resilience Leader**: **Malaysia** leads regional resilience with a composite score of **162.19**, achieving a **161.67% recovery rate** by 2025 (fully recovered by 2024). **Vietnam** follows in 2nd with a **117.55% recovery rate** (score: 117.56).
  - **Partial Recovery**: **Indonesia** (95.53% recovery, score: 105.20) and **Singapore** (88.47% recovery, score: 90.20) have shown strong, steady recovery but remain slightly below pre-pandemic normal capacity.
  - **Lagging Markets**: **Myanmar** (22.30% recovery, score: 25.30) and **Brunei** (16.66% recovery, score: 19.14) are classified as highly vulnerable due to extremely slow recovery.
  - **Composite Forecast (2026-2027)**: Total ASEAN arrivals are projected to reach **203M in 2026** and **241M in 2027**—a **+64.26% growth** compared to 2025, driven by visa relaxations and airline route restorations.
* **Actionable Recommendations**:
  - **Benchmark Top Performers**: Adopt successful tourism policies from Malaysia and Vietnam, such as extensive visa-free entry programs and aggressive international marketing campaigns.
  - **Focussed Policy Intervention**: Direct resources and cross-border infrastructure initiatives toward lagging markets (e.g. Myanmar and Brunei) to restore connectivity and regional attractiveness.
  - **Quarterly Monitoring**: Implement quarterly tracking of tourism KPIs against these projection models to dynamically optimize airline route frequencies and marketing budgets.

---

### 🛡️ Data Quality & Assumptions
* **Missing Values**: Gaps in monthly arrivals for smaller territories (such as Timor-Leste) were handled by aggregating data to annual frequencies to ensure dataset alignment.
* **Outlier Treatment**: The extreme collapse of international arrivals in 2020-2022 due to border closures was identified as a structural shock. The OLS forecasting model intentionally restricts its training dataset to the recovery phase (2021-2025) to prevent these anomalies from skewing the linear projection trend.
* **Assumptions**: We assume the post-pandemic recovery speed observed from 2021 to 2025 is linear and represents a stable macroeconomic trend.

---

### 📊 Resilience Ranking Table

Here is the sector resilience index calculated for the 11 ASEAN member nations:

| Rank | Country | Lowest Arrivals (Crisis) | Drop Severity (%) | Recovery Rate 2025 (%) | Recovery Status (Year Recovered) | Composite Resilience Score |
|:---:|---|:---:|:---:|:---:|:---:|:---:|
| 1 | **Malaysia** | 134,728 | -99.48% | **161.67%** | Fully Recovered (2024) | **162.19** (Highly Resilient) |
| 2 | **Viet Nam** | 3,500 | -99.98% | **117.55%** | Fully Recovered (2025) | **117.56** (Highly Resilient) |
| 3 | **Lao PDR** | 886,447 | **-81.50%** | 95.61% | Partially Recovered | **114.11** (Resilient) |
| 4 | **Indonesia** | 1,557,530 | **-90.33%** | 95.53% | Partially Recovered | **105.20** (Resilient) |
| 5 | **Singapore** | 330,059 | -98.27% | 88.47% | Partially Recovered | **90.20** (Moderate) |
| 6 | **Cambodia** | 196,495 | -97.03% | 84.25% | Fully Recovered (2024) | **87.23** (Moderate) |
| 7 | **Timor-Leste** | 3,718 | -92.65% | 79.41% | Fully Recovered (2023) | **86.75** (Moderate) |
| 8 | **Thailand** | 427,869 | -98.93% | 82.61% | Partially Recovered | **83.68** (Moderate) |
| 9 | **Philippines** | 163,879 | -98.02% | 78.49% | Partially Recovered | **80.47** (Moderate) |
| 10 | **Myanmar** | 130,947 | -97.00% | 22.30% | Partially Recovered | **25.30** (Vulnerable) |
| 11 | **Brunei Darussalam** | 110,391 | -97.52% | 16.66% | Partially Recovered | **19.14** (Vulnerable) |

---

### 🔍 Forecasting Validation
To establish model credibility, the OLS linear regression forecast was validated using a time-series split. The model was trained on the post-pandemic recovery data from 2021 to 2024 and validated against actual arrivals in 2025. Additionally, the forecasts were cross-referenced with pre-pandemic baseline figures (2019 levels) to ensure the predicted expansion rates align with historical maximum capacities.

---

### 📊 Key Visualizations

#### 1. Sector Resilience Index Ranking
The bar chart ranks the composite resilience of each country. Malaysia ranks first due to its fast post-pandemic growth exceeding pre-crisis levels. Lao PDR and Indonesia score high on resilience because they successfully defended a larger share of their tourist volume during the pandemic's peak.
![Resilience Ranking](images/resilience_ranking.png)

#### 2. Quadrant Analysis: Drop Severity vs. Recovery Rate
This maps the initial pandemic drop (X-axis) against the recovery percentage in 2025 (Y-axis). Countries positioned above the 100% horizontal line have successfully restructured and grown beyond their pre-pandemic market capacity.
![Resilience Scatter Plot](images/resilience_scatter.png)

#### 3. ASEAN Composite Arrivals Projection (2026-2027)
Modeled using OLS linear regression of the recovery years (2021-2025), the total regional arrivals are projected to reach **203 million in 2026** and **241 million in 2027**, indicating a complete structural recovery for the region.
![ASEAN Tourism Forecast](images/asean_forecast.png)

---

### ⚠️ Limitations & Next Steps
* **Limitations**: The model relies entirely on arrival volumes and does not capture tourist expenditures or average length of stay, which are vital indicators of economic impact.
* **Next Steps**:
  1. Integrate tourism revenue data to evaluate changes in tourist spending habits post-pandemic.
  2. Implement multivariate forecasting models (e.g. VAR or ARIMA) incorporating economic covariates such as inflation and exchange rate trends.

---

### 🌐 Live Demo
The interactive dashboard is hosted live on GitHub Pages:
👉 [https://izamrosiawan.github.io/asean-economic-recovery/](https://izamrosiawan.github.io/asean-economic-recovery/)

---

### 🔄 Reproducibility
* **Environment**: Python 3.11.x and Node.js (for running the dashboard UI).
* **Execution Sequence**:
  1. Execute `process_data.py` to clean datasets, compute resilience indexes, and output JSON summaries.
  2. Run [notebook.ipynb](notebook.ipynb) sequentially to evaluate regression projections.
  3. Deploy the interactive dashboard locally by opening [index.html](index.html) in a web browser.

---

<a name="bahasa-indonesia"></a>
## 🇮🇩 Versi Bahasa Indonesia

### 🎯 Business Problem Statement
Pasca krisis global, kebijakan pariwisata lintas batas dan investasi infrastruktur harus diarahkan berdasarkan ketahanan sektor kuantitatif. Kementerian pariwisata dan koalisi kebijakan regional membutuhkan kerangka kerja matematika untuk mengukur kecepatan pemulihan dan memproyeksikan kunjungan wisatawan guna mengoptimalkan alokasi sumber daya.

---

### 📌 Ringkasan Eksekutif (30 Detik Baca)
* **Tujuan**: Menganalisis dampak pandemi COVID-19 dan jalur pemulihan sektor pariwisata di **11 negara ASEAN**, mengukur indeks ketahanan sektoral, serta memproyeksikan kunjungan wisatawan hingga tahun **2027**.
* **Temuan Utama**:
  - **Titik Terendah Krisis**: Pada puncak pandemi (2020-2021), kunjungan wisatawan mancanegara anjlok hingga menyisakan hanya **2% dari kondisi normal 2019** di seluruh kawasan.
  - **Pemimpin Resiliensi**: **Malaysia** memimpin ketangguhan regional dengan skor komposit **162,19**, mencapai tingkat pemulihan sebesar **161,67%** pada tahun 2025 (pulih penuh sejak 2024). **Vietnam** menyusul di peringkat kedua dengan tingkat pemulihan **117,55%** (skor: 117,56).
  - **Pemulihan Sebagian**: **Indonesia** (pemulihan 95,53%, skor: 105,20) dan **Singapura** (pemulihan 88,47%, skor: 90,20) menunjukkan tren pemulihan yang kuat namun masih sedikit di bawah kapasitas normal sebelum pandemi.
  - **Pasar yang Rentan**: **Myanmar** (pemulihan 22,30%, skor: 25,30) dan **Brunei** (pemulihan 16,66%, skor: 19,14) dikategorikan sangat rentan karena pemulihan yang lambat.
  - **Proyeksi Kawasan (2026-2027)**: Total kunjungan ke ASEAN diproyeksikan mencapai **203 juta pada 2026** dan **241 juta pada 2027**—menunjukkan pertumbuhan sebesar **+64,26%** dibanding tahun 2025.
* **Rekomendasi Bisnis**:
  - **Benchmark Kebijakan Terbaik**: Adopsi kebijakan sukses dari Malaysia dan Vietnam, seperti pelonggaran visa kunjungan dan kampanye pemasaran internasional yang agresif.
  - **Intervensi Kebijakan Terarah**: Fokuskan alokasi sumber daya dan konektivitas rute udara ke negara-negara yang lambat pulih (Brunei dan Myanmar) untuk memulihkan daya tarik regional secara menyeluruh.
  - **Evaluasi KPI Berkala**: Lakukan pelacakan KPI kunjungan setiap kuartal berdasarkan model proyeksi ini untuk mengoptimalkan frekuensi rute penerbangan dan anggaran promosi pariwisata.

---

### 🛡️ Kualitas Data & Asumsi
* **Missing Values**: Kesenjangan data kunjungan bulanan untuk wilayah yang lebih kecil (seperti Timor-Leste) diatasi dengan agregasi data ke total tahunan demi keselarasan dataset.
* **Outlier Treatment**: Penurunan drastis wisatawan mancanegara pada 2020-2022 akibat penutupan batas negara dikategorikan sebagai guncangan struktural luar biasa. Model proyeksi OLS membatasi data latih hanya pada fase pemulihan (2021-2025) agar penurunan ekstrem tersebut tidak mendistorsi kemiringan tren.
* **Asumsi**: Kami mengasumsikan kecepatan pemulihan pasca-pandemi (2021-2025) berbentuk linear dan mencerminkan tren makroekonomi yang stabil.

---

### 📊 Tabel Peringkat Ketahanan Sektor

Berikut adalah peringkat ketahanan sektor pariwisata hasil analisis data pariwisata ASEAN:

| Peringkat | Negara | Kunjungan Terendah (Krisis) | Drop Severity (%) | Recovery Rate 2025 (%) | Status Pemulihan (Tahun Pulih) | Skor Ketangguhan (Resilience Score) |
|:---:|---|:---:|:---:|:---:|:---:|:---:|
| 1 | **Malaysia** | 134.728 | -99.48% | **161.67%** | Pulih Penuh (2024) | **162.19** (Sangat Tangguh) |
| 2 | **Viet Nam** | 3.500 | -99.98% | **117.55%** | Pulih Penuh (2025) | **117.56** (Sangat Tangguh) |
| 3 | **Lao PDR** | 886.447 | **-81.50%** | 95.61% | Belum Pulih Penuh | **114.11** (Tangguh) |
| 4 | **Indonesia** | 1.557.530 | **-90.33%** | 95.53% | Belum Pulih Penuh | **105.20** (Tangguh) |
| 5 | **Singapore** | 330.059 | -98.27% | 88.47% | Belum Pulih Penuh | **90.20** (Moderat) |
| 6 | **Cambodia** | 196.495 | -97.03% | 84.25% | Pulih Penuh (2024) | **87.23** (Moderat) |
| 7 | **Timor-Leste** | 3.718 | -92.65% | 79.41% | Pulih Penuh (2023) | **86.75** (Moderat) |
| 8 | **Thailand** | 427.869 | -98.93% | 82.61% | Belum Pulih Penuh | **83.68** (Moderat) |
| 9 | **Philippines** | 163.879 | -98.02% | 78.49% | Belum Pulih Penuh | **80.47** (Moderat) |
| 10 | **Myanmar** | 130.947 | -97.00% | 22.30% | Belum Pulih Penuh | **25.30** (Rentan) |
| 11 | **Brunei Darussalam** | 110.391 | -97.52% | 16.66% | Belum Pulih Penuh | **19.14** (Rentan) |

---

### 🔍 Validasi Model Proyeksi
Untuk menjamin kredibilitas model, proyeksi regresi linear OLS divalidasi menggunakan metode pembagian deret waktu (time-series split). Model dilatih pada data pemulihan 2021-2024 dan diuji terhadap realisasi kedatangan 2025. Selain itu, hasil proyeksi dicocokkan kembali dengan level dasar pra-pandemi (level 2019) untuk memastikan laju pertumbuhan yang diprediksi tetap berada dalam batas kapasitas historis.

---

### 📊 Visualisasi Utama

#### 1. Perbandingan Indeks Ketangguhan Sektoral
Malaysia berada di posisi teratas berkat pertumbuhan pasca-pandemi yang melampaui kondisi normal awal. Lao PDR dan Indonesia dinilai tangguh karena mampu mempertahankan sisa pariwisata yang lebih besar selama puncak krisis.
![Peringkat Ketangguhan](images/resilience_ranking.png)

#### 2. Analisis Kuadran: Keparahan vs. Kecepatan Pemulihan
Memetakan keparahan drop saat krisis (Sumbu X) vs. tingkat pemulihan 2025 (Sumbu Y). Negara di atas garis 100% berhasil merekonstruksi industrinya melampaui kapasitas awal.
![Pemetaan Ketahanan Sektor](images/resilience_scatter.png)

#### 3. Proyeksi Akumulatif Kunjungan ASEAN (2026-2027)
Menggunakan model Regresi Linear OLS, total kunjungan ke kawasan ASEAN diproyeksikan tumbuh pesat hingga mencapai **203 juta kunjungan pada 2026** dan **241 juta pada 2027**, menunjukkan pertumbuhan **+64,26%** dibanding realisasi tahun 2025.
![Proyeksi Pariwisata ASEAN](images/asean_forecast.png)

---

### ⚠️ Keterbatasan & Langkah Selanjutnya
* **Keterbatasan**: Model regresi hanya bergantung pada volume kedatangan fisik dan tidak memperhitungkan lama tinggal wisatawan maupun pengeluaran riil per kunjungan.
* **Langkah Selanjutnya**:
  1. Integrasikan data pendapatan pariwisata untuk mengevaluasi perubahan pola belanja wisatawan setelah pandemi.
  2. Implementasikan pemodelan multivariat (seperti VAR atau ARIMA) dengan menyertakan kovariat ekonomi seperti tingkat inflasi dan fluktuasi nilai tukar.

---

### 🌐 Demo Live
Dashboard interaktif dihosting secara live di GitHub Pages:
👉 [https://izamrosiawan.github.io/asean-economic-recovery/](https://izamrosiawan.github.io/asean-economic-recovery/)

---

### 🔄 Reproduksibilitas
* **Lingkungan**: Python 3.11.x dan Node.js (untuk dashboard).
* **Urutan Eksekusi**:
  1. Jalankan `process_data.py` untuk mengolah dataset, menghitung indeks ketahanan, dan mengekspor ke berkas JSON.
  2. Jalankan [notebook.ipynb](notebook.ipynb) secara berurutan untuk mengevaluasi proyeksi regresi.
  3. Buka berkas [index.html](index.html) langsung pada web browser untuk menggunakan dashboard interaktif secara lokal.

---

## ⚙️ Teknologi yang Digunakan
* **Python 3.11** (Pandas, NumPy, Scikit-learn, Statsmodels)
* **HTML5 / CSS3 / JavaScript** (Dashboard interaktif dengan tema Flyhyer Minimal)
* **Jupyter Notebook** (Untuk data processing pipeline)
* **Git** (Version control)
