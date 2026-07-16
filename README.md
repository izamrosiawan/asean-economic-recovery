# Tracker Pemulihan & Resiliensi Ekonomi Pariwisata ASEAN (2019-2027)

### 🎯 Pernyataan Masalah Bisnis
Pasca krisis global, kebijakan pariwisata lintas batas dan investasi infrastruktur harus diarahkan berdasarkan ketahanan sektor kuantitatif. Kementerian pariwisata dan koalisi kebijakan regional membutuhkan kerangka kerja analisis data untuk mengukur kecepatan pemulihan dan memproyeksikan kunjungan wisatawan guna mengoptimalkan alokasi sumber daya secara strategis.

---

### 📌 Ringkasan Eksekutif (30 Detik Baca)
* **Tujuan**: Menganalisis dampak pandemi COVID-19 dan jalur pemulihan sektor pariwisata di **11 negara ASEAN** (termasuk Timor-Leste), mengukur indeks ketahanan sektoral, serta memproyeksikan kunjungan wisatawan hingga tahun **2027**.
* **Temuan Utama**:
  - **Titik Terendah Krisis**: Pada puncak pandemi (2020-2021), kunjungan wisatawan mancanegara anjlok hingga menyisakan hanya **2% dari kondisi normal 2019** di seluruh kawasan.
  - **Pemimpin Resiliensi**: **Malaysia** memimpin ketangguhan regional dengan skor komposit **162,19**, mencapai tingkat pemulihan sebesar **161,67%** pada tahun 2025 (pulih penuh sejak 2024). **Vietnam** menyusul di peringkat kedua dengan tingkat pemulihan **117,55%** (skor: 117,56).
  - **Pemulihan Sebagian**: **Indonesia** (pemulihan 95,53%, skor: 105,20) dan **Singapura** (pemulihan 88,47%, skor: 90,20) menunjukkan tren pemulihan yang kuat namun masih sedikit di bawah kapasitas normal sebelum pandemi.
  - **Pasar yang Rentan**: **Myanmar** (pemulihan 22,30%, skor: 25,30) dan **Brunei** (pemulihan 16,66%, skor: 19,14) dikategorikan sangat rentan karena pemulihan yang lambat.
  - **Proyeksi Kawasan Realistis (2026-2027)**: Total kunjungan ke ASEAN diproyeksikan mencapai **164,3 juta pada 2026** dan **169,9 juta pada 2027**—menunjukkan tren pertumbuhan stabil melandai yang realistis pasca pemulihan cepat (menggunakan model regresi linear teredam/capped).
* **Rekomendasi Bisnis**:
  - **Benchmark Kebijakan Terbaik**: Adopsi kebijakan sukses dari Malaysia dan Vietnam, seperti pelonggaran visa kunjungan dan kampanye pemasaran internasional yang agresif.
  - **Intervensi Kebijakan Terarah**: Fokuskan alokasi sumber daya dan konektivitas rute udara ke negara-negara yang lambat pulih (Brunei dan Myanmar) untuk memulihkan daya tarik regional secara menyeluruh.
  - **Evaluasi KPI Berkala**: Lakukan pelacakan KPI kunjungan setiap kuartal berdasarkan model proyeksi ini untuk mengoptimalkan frekuensi rute penerbangan dan anggaran promosi pariwisata.

---

### 🛡️ Kualitas Data & Asumsi
* **Missing Values**: Kesenjangan data kunjungan bulanan untuk wilayah yang lebih kecil (seperti Timor-Leste) diatasi dengan agregasi data ke total tahunan demi keselarasan dataset.
* **Outlier Treatment**: Penurunan drastis wisatawan mancanegara pada 2020-2022 akibat penutupan batas negara dikategorikan sebagai guncangan struktural luar biasa. Model proyeksi OLS membatasi data latih hanya pada fase pemulihan (2021-2025) agar penurunan ekstrem tersebut tidak mendistorsi kemiringan tren.
* **Asumsi**: Kecepatan pemulihan pasca-pandemi (2021-2025) diasumsikan melandai (*plateauing*) saat mendekati batas atas kapasitas puncak 2019 demi menjaga proyeksi yang masuk akal dan profesional.

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
Menggunakan model Regresi Linear OLS teredam, total kunjungan ke kawasan ASEAN diproyeksikan tumbuh stabil mencapai **164,3 juta kunjungan pada 2026** dan **169,9 juta pada 2027**, menghindari pertumbuhan eksponensial tak terkontrol yang tidak realistis secara infrastruktur pariwisata.
![Proyeksi Pariwisata ASEAN](images/asean_forecast.png)

---

### 🗄️ Pemodelan Database & Analisis SQL
Untuk menunjukkan kompetensi analisis data relasional dan database querying tingkat lanjut, proyek ini menyertakan folder [sql/](sql/) berisi model database lengkap:
* **[schema.sql](sql/schema.sql)**: Rancangan skema DDL relasional yang ternormalisasi untuk tabel negara (`countries`), tabel transaksi kunjungan (`historical_arrivals`), dan tabel metrik performa (`country_metrics`).
* **[seed_data.sql](sql/seed_data.sql)**: Skrip SQL insert DML lengkap berisi data historis riil dan proyeksi pariwisata 10 negara ASEAN + Timor-Leste untuk memudahkan pengujian.
* **[analytics_queries.sql](sql/analytics_queries.sql)**: Kueri SQL analisis tingkat lanjut yang menunjukkan penguasaan query kompleks, seperti:
  1. *Pandemic Drop Severity %* menggunakan CTE (Common Table Expressions) & Join.
  2. *Recovery Rate %* untuk melacak tingkat pemulihan negara pada 2025.
  3. *Compound Annual Growth Rate* (CAGR) proyeksi 2-tahunan (2025-2027) menggunakan fungsi matematika `POWER()`.
  4. *Year-over-Year (YoY) Growth Rate* menggunakan **SQL Window Functions (`LAG() OVER ...`)**.
  5. *Regional Resilience Classification & Rankings* menggunakan **SQL Window Functions (`DENSE_RANK() OVER ...`)** dan logika kondisional `CASE WHEN`.
  6. *Cumulative Revenue Loss* akibat krisis pariwisata (2020-2022) menggunakan parameter pengali ekonomi pengeluaran wisatawan.

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
* **SQL** (PostgreSQL / SQLite kompatibel untuk database relational modeling)
* **HTML5 / CSS3 / JavaScript** (Dashboard interaktif dengan tema minimalis premium)
* **Jupyter Notebook** (Untuk data processing pipeline)
* **Git** (Version control)
