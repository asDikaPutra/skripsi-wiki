# Joint Maximum A Posteriori (JMAP)

*Joint Maximum A Posteriori* (JMAP) adalah strategi estimasi dalam kerangka kerja Bayesian yang bertujuan untuk mengestimasi parameter utama ($\theta$) dan parameter pengatur atau hiperparameter ($\sigma$) secara simultan dari data observasi yang sama.

## 1. Motivasi Teoretis

Dalam banyak masalah estimasi, nilai hiperparameter (seperti variansi *noise* atau kekuatan regularisasi) biasanya tidak diketahui dan sering kali ditentukan melalui penyetelan manual atau validasi silang (*cross-validation*). JMAP menawarkan pendekatan yang lebih efisien dengan memperlakukan hiperparameter sebagai variabel acak yang perlu diestimasi bersama dengan parameter utama.

## 2. Formulasi Matematika

Berdasarkan aturan Bayes, distribusi posterior gabungan untuk parameter $\theta$ dan hiperparameter $\sigma$ diberikan oleh:

$$P(\theta, \sigma | D) \propto P(D | \theta, \sigma) P(\theta | \sigma) P(\sigma)$$

Di mana:
- $P(D | \theta, \sigma)$ adalah fungsi *likelihood*.
- $P(\theta | \sigma)$ adalah distribusi *prior* untuk parameter utama yang bergantung pada $\sigma$.
- $P(\sigma)$ adalah distribusi *prior* untuk hiperparameter (sering disebut sebagai *hyperprior*).

Estimasi JMAP dilakukan dengan memaksimalkan logaritma dari posterior gabungan tersebut:

$$(\hat{\theta}, \hat{\sigma})_{JMAP} = \arg \max_{\theta, \sigma} \left[ \ln P(D | \theta, \sigma) + \ln P(\theta | \sigma) + \ln P(\sigma) \right]$$

## 3. Keunggulan JMAP

1.  **Estimasi Adaptif**: Bobot antara fidelitas data dan batasan *prior* (regularisasi) ditentukan secara otomatis oleh data, bukan melalui *grid search*.
2.  **Konsistensi Statistik**: Memberikan landasan formal untuk menyeimbangkan berbagai tugas dalam *multi-task learning*.
3.  **Efisiensi Komputasi**: Menghindari proses pelatihan ulang model berkali-kali untuk mencari bobot yang optimal.

## 4. Penerapan dalam W2VPred

Dalam skripsi ini, JMAP digunakan untuk mengestimasi bobot adaptif pada fungsi *loss* gabungan W2VPred:
- **$\theta$**: Mewakili parameter *word embedding* ($\mathbf{U}$).
- **$\sigma$**: Mewakili parameter ketidakpastian (*uncertainty*) untuk setiap komponen *loss*.
- **$P(\sigma)$**: Diasumsikan sebagai *non-informative* atau *improper prior* untuk memberikan fleksibilitas maksimal pada estimasi variansi.

---
## Hubungan Antar Konsep
- **Fondasi**: [[concepts/major/Bayesian_dan_MAP|Estimasi Bayesian & MAP]]
- **Distribusi Prior**: [[concepts/fundamental/Distribusi_Gibbs|Distribusi Gibbs]]
- **Aplikasi Utama**: [[concepts/major/uncertainty_weighted_loss|Uncertainty Weighted Loss]]
- **Masalah Numerik**: [[concepts/fundamental/Improper_Prior|Improper Prior]]

## Sumber Referensi
- Mohammad-Djafari, A. (1996). *Joint estimation of parameters and hyperparameters in a Bayesian approach of solving inverse problems*. Proceedings of 3rd IEEE International Conference on Image Processing.
- Gelman, A., et al. (2013). *Bayesian Data Analysis*.
