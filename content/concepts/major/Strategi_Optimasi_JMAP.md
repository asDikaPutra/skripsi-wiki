# Strategi Optimasi JMAP pada W2VPred

Dalam metode W2VPred-MAP, fungsi objektif L-MAP dirancang mengandung gabungan ruang parameter $U$ (*embedding*) dan *hyperparameter* variansi skala $\sigma = (\sigma_F, \sigma_S, \sigma_{RD})$. Untuk memecahkan sistem dengan dimensi masif semacam ini ($n = T \cdot V \cdot d$), penelitian ini menjelaskan proses inferensi menggunakan [[JMAP]] alih-alih pendekatan teoritis fundamental.

## Kenapa bukan Type-2 MLE (Evidence Maximization)?

Secara analitis murni, estimasi $\sigma$ paling tepat dilakukan lewat marginalisasi (*integrating out*) seluruh kemungkinan matriks konvensional $U$, lalu mengoptimalkan *Evidence* probabilitas terhadap $\sigma$. Namun, integral *Type-2 MLE* ini dirasa non-solvabel (tidak *tractable*) karena:
1. Rekonstruksi model PPMI tidak linear (karena berbentuk $U_t U_t^\top$), sehingga integral tak dapat direduksi secara murni sebagai turunan Gaussian standar.
2. Dimensi $n$ (total pasangan *word-context*) yang mencapai puluhan juta membuat ukuran komputasi tak terbatas. Algoritma aproksimasi seperti matriks Hessian (*Laplace Approximation*) memakan *overhead* komputasi raksasa yang tidak realistis.

## Substitusi Menggunakan Joint MAP (JMAP)

Karena itulah pengoptimalan serentak secara eksplisit via JMAP dipergunakan. Algoritma mencari poin maksimisasi probabilitas dari gabungan $(U, \sigma)$ pada satu proses titik gradien yang sama:

$$ (\hat{U}, \hat{\sigma}) = \arg \min_{U, \sigma} L_{MAP}(U, \sigma) $$

Menariknya, substitusi ini dibuktikan bernilai **ekuivalen secara asimptotik** dengan titik konvergensi akhir Type-2 MLE. Dua asalan utamanya:
1. Skala volume data observasi ($n$) yang jauh menembus limit ambang kelengkungan, sehingga matriks Hessian menjadi termarginalisasi/nir-signifikan (Suku Hessian tumbuh pada order $\mathcal{O}(\log n)$ sementara *likelihood* di order $\mathcal{O}(n)$).
2. Tesis bahwa faktor partisi parameter $\sigma$ telah teralienasi ke dalam konstanta skala logaritmik deterministik semata, tanpa mencemari nilai gradien Hessian turunan tak-pasti.

Dengan ini optimasi model di level komputasional dapat dieksekusi efisien menggunakan autograd berbasis siklus iteratif biasa.
