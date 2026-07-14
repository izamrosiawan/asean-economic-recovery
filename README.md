# ASEAN Tourism Recovery & Economic Resilience Tracker (2019-2027)

Analisis pemulihan dampak pandemi COVID-19, metrik ketangguhan sektor pariwisata, dan model proyeksi kunjungan wisatawan di kawasan Asia Tenggara.

---

## Latar Belakang & Gambaran Umum
Sektor pariwisata merupakan salah satu pilar utama penggerak ekonomi di Asia Tenggara (ASEAN). Krisis kesehatan global pada periode 2020-2022 berdampak sangat buruk terhadap mobilitas internasional, menyebabkan penurunan kunjungan wisatawan asing ke tingkat terendah dalam sejarah pada tahun 2021, di mana kunjungan hanya tersisa sekitar 2% dari kondisi normal pada 2019.

Repositori ini memuat analisis kuantitatif mengenai performa pemulihan pariwisata di 11 negara anggota ASEAN. Analisis dilakukan dengan mengukur daya tahan sektoral melalui Indeks Ketangguhan Sektoral (Resilience Index) serta memproyeksikan tren kunjungan jangka pendek hingga tahun 2027 menggunakan model regresi linear.

Struktur repositori ini terbagi menjadi dua bagian:
1. **Analisis Data Pipeline (`notebook.ipynb` & `process_data.py`):** Berisi skrip pembersihan data mentah, perhitungan indeks ketahanan sektoral, dan pemodelan statistik berbasis Python.
2. **Dashboard Web Interaktif (`index.html`, `style.css` & `app.js`):** Dashboard visualisasi data real-time dengan desain bertema Sennep Editorial Warmth yang menonjolkan aspek tipografi dan tata letak datar yang bersih.

---

## Metodologi Analisis & Rekayasa Fitur
Ketahanan pariwisata di setiap negara diukur secara kuantitatif menggunakan tiga metrik utama:

1. **Drop Severity (%):** Mengukur kedalaman penurunan kunjungan pada titik terendah krisis (tahun 2020 atau 2021) dibandingkan dengan kondisi sebelum pandemi (2019).
   $$\text{Drop Severity} = \frac{\min(\text{Arrivals}_{2020}, \text{Arrivals}_{2021}) - \text{Arrivals}_{2019}}{\text{Arrivals}_{2019}} \times 100\%$$
2. **Recovery Rate 2025 (%):** Mengukur persentase pemulihan volume kunjungan pada tahun 2025 terhadap kondisi normal di tahun 2019.
   $$\text{Recovery Rate} = \frac{\text{Arrivals}_{2025}}{\text{Arrivals}_{2019}} \times 100\%$$
3. **Resilience Score:** Skor indeks komposit yang mencerminkan kemampuan bertahan pasar (sisa kunjungan yang terselamatkan) dikombinasikan dengan kecepatan pemulihan.
   $$\text{Resilience Score} = \text{Recovery Rate} + (100\% + \text{Drop Severity})$$

---

## Hasil Analisis Utama & Temuan Resiliensi

Berikut adalah peringkat indeks ketahanan sektoral hasil perhitungan dari dataset pariwisata ASEAN:

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

### Interpretasi Visualisasi

#### 1. Perbandingan Indeks Ketangguhan Sektoral
Grafik bar di bawah menggambarkan peringkat resiliensi komposit dari setiap negara. Malaysia menempati peringkat pertama karena pemulihan pasarnya yang sangat cepat pada periode 2024-2025, melampaui level sebelum pandemi. Negara seperti Lao PDR dan Indonesia dinilai tangguh karena mampu mempertahankan sisa kunjungan pariwisata yang lebih besar selama puncak pandemi dibandingkan dengan rata-rata regional.

![Peringkat Ketangguhan](images/resilience_ranking.png)

#### 2. Analisis Kuadran: Keparahan vs Kecepatan Pulih
Grafik kuadran memetakan hubungan antara seberapa dalam penurunan pasar saat puncak krisis (Sumbu X) dengan tingkat pemulihannya pada tahun 2025 (Sumbu Y). Negara yang berada di atas garis putus-putus (tingkat pemulihan 100%) menunjukkan restrukturisasi pariwisata yang sukses melewati kapasitas awal sebelum pandemi.

![Pemetaan Ketahanan Sektor](images/resilience_scatter.png)

---

## Proyeksi Pemodelan Tren (2026-2027)
Proyeksi masa depan dimodelkan menggunakan Regresi Linear Least Squares (OLS) dengan data latih dari periode pemulihan (2021–2025). Pembatasan data latih ini sengaja dilakukan untuk menghindari anomali penurunan drastis akibat karantina wilayah ekstrem pada tahun 2020.

* **Metrik Kawasan ASEAN (Gabungan):**
  Secara akumulatif, kunjungan ke wilayah ASEAN diproyeksikan tumbuh melampaui rekor tertinggi pada tahun 2019, dengan estimasi mencapai sekitar 203 juta kunjungan pada 2026 dan 241 juta kunjungan pada 2027. Faktor utama yang mendorong pertumbuhan ini antara lain pelonggaran kebijakan visa kunjungan serta pembukaan kembali rute penerbangan langsung internasional di pasar-pasar utama regional.

![Proyeksi Pariwisata ASEAN](images/asean_forecast.png)

### Estimasi Kunjungan Wisatawan Mendatang (2026-2027)

| Wilayah / Negara | Aktual 2025 | Proyeksi 2026 | Proyeksi 2027 | Estimasi Pertumbuhan (vs 2025) |
|---|:---:|:---:|:---:|:---:|
| **ASEAN (Gabungan)** | 147.044.420 | 203.105.477 | 241.539.250 | **+64.26%** |
| **Indonesia** | 15.386.646 | 20.606.873 | 24.218.574 | **+57.40%** |
| **Malaysia** | 42.196.892 | 55.705.637 | 66.907.122 | **+58.56%** |
| **Thailand** | 32.974.321 | 48.495.866 | 57.444.425 | **+74.21%** |
| **Singapore** | 16.910.000 | 23.752.453 | 28.090.861 | **+66.12%** |
| **Viet Nam** | 21.168.291 | 27.879.547 | 33.504.773 | **+58.28%** |
