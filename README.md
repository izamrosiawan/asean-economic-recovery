# Tracker Pemulihan & Resiliensi Ekonomi Pariwisata ASEAN (2019–2027)

## Latar Belakang & Masalah
Pasca krisis global, kebijakan pariwisata lintas batas dan alokasi investasi infrastruktur memerlukan pendekatan berbasis data kuantitatif. Proyek ini menyajikan kerangka kerja analisis data untuk mengukur tingkat pemulihan, indeks ketahanan sektoral, dan proyeksi kedatangan wisatawan di 11 negara ASEAN (termasuk Timor-Leste) hingga tahun 2027.

---

## Ringkasan Eksekutif

- **Tujuan**: Menganalisis dampak pandemi COVID-19, mengukur indeks ketahanan sektoral 11 negara ASEAN, dan memproyeksikan tren kunjungan wisatawan (2026–2027).
- **Temuan Utama**:
  - **Titik Terendah Krisis**: Kunjungan wisatawan mancanegara anjlok hingga menyisakan **~2% dari level normal 2019** di puncak pandemi (2020–2021).
  - **Pemimpin Resiliensi**: **Malaysia** memimpin pemulihan kawasan dengan skor komposit **162,19** (tingkat pemulihan **161,67%** pada 2025, pulih penuh sejak 2024). **Vietnam** berada di urutan kedua dengan pemulihan **117,55%** (skor: 117,56).
  - **Pemulihan Moderat**: **Indonesia** (pemulihan 95,53%, skor: 105,20) dan **Singapura** (pemulihan 88,47%, skor: 90,20) mendekati kapasitas pra-pandemi tetapi belum pulih sepenuhnya.
  - **Pasar Lambat Pulih**: **Myanmar** (pemulihan 22,30%) dan **Brunei** (pemulihan 16,66%) mencatatkan laju pemulihan paling lambat di kawasan.
  - **Proyeksi Kawasan (2026–2027)**: Total kunjungan ke ASEAN diproyeksikan mencapai **164,3 juta pada 2026** dan **169,9 juta pada 2027** menggunakan model regresi linear teredam (*capped linear regression*).

---

## Kualitas Data & Metodologi

- **Penanganan Missing Values**: Data kunjungan bulanan untuk wilayah dengan pencatatan terbatas (seperti Timor-Leste) diagregasi ke total tahunan untuk menjaga konsistensi dataset.
- **Penanganan Outlier & Structural Shock**: Penurunan drastis 2020–2021 diidentifikasi sebagai guncangan struktural luar biasa. Model regresi OLS dilatih menggunakan periode pemulihan (2021–2025) agar penurunan ekstrem awal tidak mendistorsi tren proyeksi.
- **Asumsi Kapasitas**: Pertumbuhan pasca-2025 diasumsikan melandai (*plateauing*) saat mendekati atau melampaui puncak 2019 untuk mencerminkan batas kapasitas fisik infrastruktur pariwisata.

---

## Peringkat Ketahanan Sektor Pariwisata

Tabel berikut menampilkan perbandingan tingkat penurunan saat krisis, pemulihan 2025, dan skor ketahanan komposit:

| Peringkat | Negara | Kunjungan Terendah | Drop Severity (%) | Recovery Rate 2025 (%) | Status Pemulihan | Skor Resiliensi |
|:---:|---|:---:|:---:|:---:|:---:|:---:|
| 1 | **Malaysia** | 134.728 | -99.48% | **161.67%** | Pulih Penuh (2024) | **162.19** |
| 2 | **Viet Nam** | 3.500 | -99.98% | **117.55%** | Pulih Penuh (2025) | **117.56** |
| 3 | **Lao PDR** | 886.447 | **-81.50%** | 95.61% | Belum Pulih Penuh | **114.11** |
| 4 | **Indonesia** | 1.557.530 | **-90.33%** | 95.53% | Belum Pulih Penuh | **105.20** |
| 5 | **Singapore** | 330.059 | -98.27% | 88.47% | Belum Pulih Penuh | **90.20** |
| 6 | **Cambodia** | 196.495 | -97.03% | 84.25% | Pulih Penuh (2024) | **87.23** |
| 7 | **Timor-Leste** | 3.718 | -92.65% | 79.41% | Pulih Penuh (2023) | **86.75** |
| 8 | **Thailand** | 427.869 | -98.93% | 82.61% | Belum Pulih Penuh | **83.68** |
| 9 | **Philippines** | 163.879 | -98.02% | 78.49% | Belum Pulih Penuh | **80.47** |
| 10 | **Myanmar** | 130.947 | -97.00% | 22.30% | Belum Pulih Penuh | **25.30** |
| 11 | **Brunei Darussalam** | 110.391 | -97.52% | 16.66% | Belum Pulih Penuh | **19.14** |

---

## Validasi Model Proyeksi

Model proyeksi OLS divalidasi menggunakan skema *time-series split*:
1. Model dilatih pada data pemulihan 2021–2024 dan diuji terhadap data aktual 2025.
2. Proyeksi diuji kaji dengan angka dasar (*baseline*) 2019 untuk memastikan tren pertumbuhan tetap berada dalam batas variasi historis yang realistis.

---

## Visualisasi Analisis

### 1. Peringkat Indeks Resiliensi Sektoral
Malaysia mencatatkan skor tertinggi berkat pemulihan cepat melampaui kondisi pra-pandemi, sedangkan Lao PDR dan Indonesia memiliki skor resiliensi tinggi karena persentase penurunan yang lebih rendah saat krisis.
![Peringkat Ketangguhan](images/resilience_ranking.png)

### 2. Keparahan Krisis vs Kecepatan Pemulihan
Visualisasi kuadran memetakan tingkat keparahan penurunan krisis (Sumbu X) terhadap laju pemulihan 2025 (Sumbu Y).
![Pemetaan Ketahanan Sektor](images/resilience_scatter.png)

### 3. Proyeksi Kunjungan Wisatawan ASEAN (2026–2027)
Proyeksi akumulatif kawasan menunjukkan tren pertumbuhan melandai yang stabil, diperkirakan mencapai **164,3 juta kunjungan (2026)** dan **169,9 juta kunjungan (2027)**.
![Proyeksi Pariwisata ASEAN](images/asean_forecast.png)

---

## Struktur Data & Kueri SQL

Proyek ini menyertakan skema dan kueri SQL di direktori [`sql/`](sql/):

- **[`sql/schema.sql`](sql/schema.sql)**: Skema DDL ternormalisasi (`countries`, `historical_arrivals`, `country_metrics`).
- **[`sql/seed_data.sql`](sql/seed_data.sql)**: Data DML historis dan proyeksi 11 negara ASEAN.
- **[`sql/analytics_queries.sql`](sql/analytics_queries.sql)**: Kueri analisis data meliputi:
  - Perhitungan *Drop Severity %* dan *Recovery Rate %* (CTE & Join).
  - *Compound Annual Growth Rate* (CAGR 2025–2027).
  - Analisis pertumbuhan YoY (`LAG() OVER ...`).
  - Pemeringkatan resiliensi kawasan (`DENSE_RANK() OVER ...`).
  - Estimasi kerugian pendapatan akumulatif krisis (2020–2022).

---

## Keterbatasan Analisis & Rencana Pengembangan

- **Keterbatasan**: Model saat ini berbasis volume kedatangan fisik (*tourist arrivals*) dan belum memperhitungkan durasi tinggal (*length of stay*) atau pengeluaran rata-rata wisatawan.
- **Rencana Pengembangan**:
  1. Integrasi variabel data transaksi/pendapatan pariwisata.
  2. Penerapan pemodelan deret waktu multivariat (ARIMA/VAR) dengan memasukkan indikator makroekonomi (inflasi, nilai tukar).

---

## Live Demo & Reproduksibilitas

- **Live Dashboard**: [https://izamrosiawan.github.io/asean-economic-recovery/](https://izamrosiawan.github.io/asean-economic-recovery/)
- **Langkah Menjalankan Kode**:
  1. Eksekusi `python process_data.py` untuk mengolah data dan menghasilkan file `data.json`.
  2. Buka `notebook.ipynb` untuk melihat eksplorasi data dan evaluasi model OLS.
  3. Buka `index.html` pada browser untuk melihat dashboard interaktif secara lokal.

---

## Tech Stack
- **Data Processing & Analytics**: Python 3.11 (Pandas, NumPy, Scikit-learn, Statsmodels), Jupyter Notebook
- **Database**: SQL (PostgreSQL / SQLite compatible)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla UI & Interactive Charts)
- **Deployment & Version Control**: Git, GitHub Pages
