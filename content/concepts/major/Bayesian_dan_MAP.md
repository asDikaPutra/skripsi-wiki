# Estimasi Bayesian dan Maximum A Posteriori (MAP)

Estimasi Bayesian adalah kerangka kerja inferensi statistik yang memperlakukan parameter yang tidak diketahui sebagai variabel acak yang memiliki distribusi peluang. Berbeda dengan pendekatan frekuentis yang hanya mengandalkan data observasi, pendekatan Bayesian memungkinkan integrasi pengetahuan awal (*prior knowledge*) ke dalam proses estimasi.

## 1. Teorema Bayes

Fondasi utama dari estimasi ini adalah Teorema Bayes, yang merumuskan hubungan antara data observasi ($D$) dan parameter model ($\theta$):

$$P(\theta | D) = \frac{P(D | \theta) P(\theta)}{P(D)}$$

Di mana:
- **Posterior** ($P(\theta | D)$): Probabilitas parameter setelah mempertimbangkan data observasi. Ini adalah tujuan akhir dari inferensi Bayesian.
- **Likelihood** ($P(D | \theta)$): Probabilitas data observasi muncul jika parameter model bernilai $\theta$. Ini mengukur seberapa baik model menjelaskan data.
- **Prior** ($P(\theta)$): Keyakinan atau pengetahuan awal mengenai parameter sebelum adanya data.
- **Evidence/Marginal Likelihood** ($P(D)$): Konstanta normalisasi yang memastikan total probabilitas posterior adalah satu. Dalam konteks optimasi, nilai ini biasanya diabaikan karena tidak bergantung pada $\theta$.

## 2. Maximum A Posteriori (MAP)

Estimasi *Maximum A Posteriori* (MAP) adalah strategi untuk mencari nilai tunggal dari parameter ($\hat{\theta}$) yang memaksimalkan probabilitas posterior. Secara formal:

$$\hat{\theta}_{MAP} = \arg \max_{\theta} P(\theta | D)$$
$$\hat{\theta}_{MAP} = \arg \max_{\theta} \left[ P(D | \theta) P(\theta) \right]$$

### Transformasi Log-Posterior
Untuk kemudahan komputasi, fungsi di atas sering ditransformasikan ke dalam bentuk logaritma (*log-space*). Karena fungsi logaritma bersifat monotonik naik, memaksimalkan probabilitas setara dengan memaksimalkan log-probabilitasnya:

$$\hat{\theta}_{MAP} = \arg \max_{\theta} \left[ \ln P(D | \theta) + \ln P(\theta) \right]$$

Dalam konteks minimalisasi fungsi kerugian (*loss minimization*), MAP setara dengan meminimalkan negatif log-posterior:

$$\hat{\theta}_{MAP} = \arg \min_{\theta} \left[ -\ln P(D | \theta) - \ln P(\theta) \right]$$

## 3. Hubungan dengan MLE dan Regularisasi

- **Maximum Likelihood Estimation (MLE)**: Jika asumsi *prior* bersifat seragam (*uniform prior*), maka $P(\theta)$ adalah konstan, sehingga MAP menjadi identik dengan MLE.
- **Regularisasi**: Dalam pembelajaran mesin, komponen $-\ln P(\theta)$ sering kali bermanifestasi sebagai teknik regularisasi. Contohnya, prior Gaussian ($\mathcal{N}(0, \sigma^2)$) menghasilkan regularisasi L2 (*Weight Decay*).

## 4. Relevansi dalam Model W2VPred

Dalam penelitian ini, kerangka kerja MAP digunakan untuk menyatukan dua aspek berbeda dari model:
1.  **Likelihood**: Dimodelkan melalui *Fidelity Loss* ($L_F$), yang mengukur kecocokan embedding terhadap matriks PPMI (data observasi).
2.  **Prior**: Dimodelkan melalui *Structure Loss* ($L_S$) dan *Smoothing Loss* ($L_{RD}$), yang merepresentasikan pengetahuan awal bahwa embedding harus konsisten secara geometris dan temporal.

Dengan menggunakan MAP, bobot relatif antara data fidelitas dan batasan struktural dapat diatur secara otomatis melalui parameter variansi yang diestimasi secara simultan.

---
## Hubungan Antar Konsep
- **Implementasi**: [[concepts/major/Formulasi_Probabilistik_W2VPred|Formulasi Probabilistik W2VPred]]
- **Strategi Estimasi**: [[concepts/major/JMAP|JMAP]]
- **Komponen Prior**: [[concepts/fundamental/Distribusi_Gibbs|Distribusi Gibbs]]
- **Komponen Likelihood**: [[concepts/fundamental/Gaussian_dan_iid|Gaussian dan i.i.d.]]

## Sumber Referensi
- Bishop, C. M. (2006). *Pattern Recognition and Machine Learning*. Springer. (Bab 1.2.3: *Bayesian Probabilities*).
- Gelman, A., et al. (2013). *Bayesian Data Analysis*. CRC press.
- Geman, S., & Geman, D. (1984). *Stochastic relaxation, Gibbs distributions, and the Bayesian restoration of images*.
