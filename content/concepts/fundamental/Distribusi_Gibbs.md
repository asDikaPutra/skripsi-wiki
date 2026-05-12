# Distribusi Gibbs (Energy-Based Prior)

Distribusi Gibbs merupakan kerangka kerja probabilistik yang menghubungkan konsep energi dari fisika statistik dengan teori peluang. Konsep ini menjadi fondasi bagi *Markov Random Fields* (MRF) yang digunakan secara luas dalam restorasi citra dan pemodelan data terstruktur.

## 1. Konsep Utama (Analogi Geman & Geman, 1984)

Berdasarkan karya seminal Geman & Geman (1984), terdapat analogi antara konfigurasi piksel (atau parameter model) dengan keadaan atom dalam sistem fisik:
- **Energi ($U$)**: Setiap konfigurasi parameter $\omega$ memiliki nilai energi $U(\omega)$ yang merepresentasikan tingkat "ketidakstabilan" atau "biaya".
- **Probabilitas**: Probabilitas suatu sistem berada dalam keadaan $\omega$ berbanding terbalik dengan eksponensial energinya:
  $$\pi(\omega) = \frac{1}{Z} \exp \left( - \frac{U(\omega)}{T} \right)$$
- **Fungsi Partisi ($Z$)**: Konstanta normalisasi yang menjamin total probabilitas adalah satu: $Z = \sum_{\omega \in \Omega} \exp(-U(\omega)/T)$.
- **Temperatur ($T$)**: Parameter kontrol yang menentukan seberapa tajam distribusi tersebut. Pada $T$ rendah, distribusi terpusat pada konfigurasi energi minimum (mode).

## 2. Ekuivalensi MRF-Gibbs

Salah satu kontribusi penting dari literatur ini adalah pembuktian bahwa sebuah proses acak bersifat *Markov Random Field* (MRF) jika dan hanya jika ia memiliki distribusi Gibbs. Hal ini memungkinkan pendefinisian hubungan lokal antar parameter melalui **Fungsi Potensial Clique** ($V_c$):
$$U(\omega) = \sum_{c \in \mathcal{C}} V_c(\omega)$$
Di mana $\mathcal{C}$ adalah himpunan *cliques* (kelompok titik yang saling bertetangga dalam graf).

## 3. Penerapan dalam Pemodelan W2VPred

Dalam konteks W2VPred, distribusi Gibbs digunakan untuk merumuskan batasan struktural sebagai *prior* Bayesian:
1.  **Transformasi Loss ke Energi**: Fungsi *loss* deterministik seperti *Structure Loss* ($L_S$) dan *Smoothing Loss* ($L_{RD}$) diperlakukan sebagai fungsi energi $U(\mathbf{U})$.
2.  **Representasi Struktur**: Hubungan antar domain diwakili oleh graf, di mana kedekatan semantik antar domain membentuk *cliques*.
3.  **Bayesian Prior**: Dengan mengasumsikan distribusi Gibbs, kita dapat memberikan interpretasi probabilistik pada regularisasi geometri:
    $$p(\mathbf{U} | \sigma) = \frac{1}{Z(\sigma)} \exp \left( - \frac{L(\mathbf{U})}{2\sigma^2} \right)$$
    Di sini, variansi $\sigma^2$ bertindak sebagai analog dari temperatur $T$ yang menentukan seberapa kuat pengaruh batasan struktur terhadap estimasi akhir.

## 4. Hubungan Antar Konsep
- **Model Utama**: [[models/W2VPred|W2VPred]]
- **Kerangka Estimasi**: [[concepts/major/Formulasi_Probabilistik_W2VPred|Formulasi Probabilistik W2VPred]]
- **Solusi Matematis**: [[concepts/fundamental/Integral_Fungsi_Partisi|Integral Fungsi Partisi]]
- **Karakteristik Prior**: [[concepts/fundamental/Improper_Prior|Improper Prior]]

## Sumber Referensi
- Geman, S., & Geman, D. (1984). *Stochastic relaxation, Gibbs distributions, and the Bayesian restoration of images*. IEEE Transactions on Pattern Analysis and Machine Intelligence, (6), 721-741. (Fail lokal: `raw/journal/Stochastic Relaxation, Gibbs Distributions, and.pdf`)
- LeCun, Y., et al. (2006). *A tutorial on energy-based learning*. (Fail lokal: `raw/journal/lecun_ebl_2006.pdf`)
