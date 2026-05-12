# Sifat Homogen Berderajat Dua & Substitusi Matriks Jacobian

## Konsep Utama
- **Fungsi Homogen**: Sebuah fungsi $f(\mathbf{x})$ dikatakan homogen berderajat $k$ jika ekuivalensi perbesaran skalanya mematuhi bentuk $f(c\mathbf{x}) = c^k f(\mathbf{x})$.
- **Substitusi Variabel Multidimensi**: Pada ranah perumusan kalkulus integral multidimensi (untuk matriks dimensi $n$), pergantian atau substitusi matriks yang diskalakan dengan konstanta ($\mathbf{x} = c\mathbf{v}$) akan secara matematis menarik masuk faktor pengali berwujud turunan ruang matriks penentunya (*Jacobian determinant*). Sehingga elemen integrasi volumenya berubah wujud secara linier dengan orde pangkat dimensinya, menjadi proporsional $d\mathbf{x} = c^n d\mathbf{v}$.

## Penerapan dalam Model Probabilistik W2VPred
Ini adalah fondasi penyelamat arsitektur komputasi teoretis pada *Loss function* model (khususnya untuk *structure loss* dan *smoothing loss*). Karena rumusan jarak menggunakan aturan matriks identitas Norma Frobenius yang pada dasarnya berpangkat dua (kuadrat), maka fungsi *loss* patuh pada sifat homogen berderajat 2 ($L(cU) = c^2 L(U)$). 

Fakta fundamental subtitusi *Jacobian* ($dU = \sigma^n dV$) digabung dengan ekuivalensi kuadrat ini secara elegan memungkinkan metodologi W2VPred melempar keseluruhan *hyperparameter* dispersi luasan $\sigma$ untuk keluar mutlak dari jebakan di dalam integral *improper prior* (yang nilainya teramat mustahil dipecahkan komputer karena melaju ke *infinity*). Operasi ini akhirnya memurnikan $\sigma$ menjadi sebuah operan fungsi turunan logaritmik $\log \sigma$ linier konvensional biasa di rumusan penalti gradien akhirnya. Tanpa kedua asas kalkulus dasar ini, sistem integrasi model pada W2VPred probabilitas berisiko tidak dapat diuraikan secara analitik komputasi.

## Sumber Referensi
- Stewart, J. (2015). *Calculus: Early Transcendentals* (8th ed.). Cengage Learning. (Bab 15: *Multiple Integrals* & Bab Perubahan Variabel / Analisis Jacobian).
