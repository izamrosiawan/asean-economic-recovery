# ASEAN Post-Pandemic Economic Recovery Analytics & Tourism Forecasting

[![Python](https://img.shields.io/badge/Python-3.9%2B-blue.svg)](https://www.python.org/)
[![Pandas](https://img.shields.io/badge/Pandas-Analytics-orange.svg)](https://pandas.pydata.org/)
[![Domain](https://img.shields.io/badge/Domain-Macroeconomic%20Analytics-blue.svg)](#)
[![Tests](https://img.shields.io/badge/Tests-Pytest%20Passing-brightgreen.svg)](#)

Repositori ini menyajikan analisis komparatif pemulihan ekonomi makro dan sektor pariwisata negara-negara anggota ASEAN (*Southeast Asian Nations*) pasca-pandemi COVID-19.

---

## 📂 Struktur Proyek

```
├── .gitignore          # Konfigurasi pengabaian cache Git
├── dataset/            # File data mentah makroekonomi
├── images/             # Visualisasi plot komputasi 300 DPI
├── src/                # Modular Python analytics engine (AseanEconomicEngine)
├── tests/              # Automated unit tests (Pytest: validasi parsing dan metrik pemulihan)
├── notebook.ipynb      # Jupyter Notebook: Pemrosesan data makro, peramalan, dan visualisasi
├── requirements.txt    # Pinned stable dependencies
└── README.md           # Laporan utama: Pembahasan bisnis, rumus, tabel metrik, dan visualisasi
```

---

## 💻 Implementasi Modular & Pengujian Otomatis

Modul analitik makroekonomi tersedia di `src/asean_engine.py`:

```python
from src.asean_engine import AseanEconomicEngine

engine = AseanEconomicEngine()
summary_df = engine.get_country_summary()
print(summary_df.head())
```

Jalankan automated test:
```bash
pytest tests/
```

---

## 🚀 Cara Menjalankan

1. **Pasang Dependensi**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Eksekusi Notebook**:
   ```bash
   jupyter notebook notebook.ipynb
   ```

---
*ASEAN Economic Recovery Project.*
