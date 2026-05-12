# Distribusi Normal (Gaussian) dan Asumsi i.i.d.

## Konsep Utama
Distribusi Normal $\mathcal{N}(\mu, \sigma^2)$ adalah fungsi densitas probabilitas (kurva lonceng) yang menggambarkan sebaran parameter dengan deviasi yang simetris dari titik tengah (mean). Asumsi *Independent and Identically Distributed* (i.i.d.) menyatakan bahwa variabel acak (dalam hal ini, galat atau observasi) tidak saling memengaruhi satu sama lain dan mematuhi distribusi probabilitas yang persis sama.

## Penerapan dalam Model Probabilistik W2VPred
Teorema Limit Pusat (*Central Limit Theorem*) menjustifikasi bahwa kumpulan acak dari banyak galat kecil yang tak terelakkan (seperti akibat spasitas, *noise* pada matriks ko-okurensi komputasi, dan reduksi dimensi spasial laten kata) akan terakumulasi dan membentuk kurva normal. Sifat *i.i.d* memungkinkan model mengalikan seluruh kemungkinan entri secara langsung dalam formulasi gabungan probabilitas *Fidelity Loss* ($L_F$), karena probabilitas gabungan dari kejadian yang independen adalah hasil kali probabilitas masing-masing kejadian.

## Hubungan Antar Konsep
- Digunakan dalam Model: [[models/W2VPred|W2VPred]]
- Target Observasi: [[concepts/fundamental/Matriks_Ko-okurensi_dan_PPMI|Matriks PPMI]]
- Implementasi: [[concepts/major/Formulasi_Probabilistik_W2VPred|Formulasi Probabilistik W2VPred]]
 
## Sumber Referensi
- Bishop, C. M. (2006). *Pattern Recognition and Machine Learning*. Springer. (Bab 1 & 2: *Probability Distributions*).
