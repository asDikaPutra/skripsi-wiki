# Pemetaan Referensi: Estimasi Bayesian & MAP

Dokumen ini memetakan materi teori pada [[concepts/major/Bayesian_dan_MAP|Estimasi Bayesian & MAP]] ke sumber literatur yang digunakan.

---

## 1. Teorema Bayes dan Terminologi
**Poin Teori**: Definisi Posterior, Likelihood, Prior, dan Evidence.
**Sumber**: **Bishop (2006)**, Halaman 21-23.
- *Quote*: *"The quantity $p(\mathbf{w}|\mathcal{D})$ on the left-hand side is called the posterior probability... the quantity $p(\mathcal{D}|\mathbf{w})$ on the right-hand side is evaluated for the observed data set $\mathcal{D}$ and can be viewed as a function of the parameter vector $\mathbf{w}$, in which case it is called the likelihood function."*

---

## 2. Formulasi MAP dan Transformasi Log
**Poin Teori**: $\hat{\theta}_{MAP} = \arg \max \left[ P(D | \theta) P(\theta) \right]$ dan penggunaan logaritma.
**Sumber**: **Bishop (2006)**, Halaman 30.
- *Quote*: *"If we maximize the posterior probability, we obtain the maximum a posteriori (MAP) estimator... Since the logarithm is a monotonic function, maximizing the posterior distribution is equivalent to maximizing its logarithm."*

---

## 3. Hubungan MAP dengan Regularisasi
**Poin Teori**: Penjelasan bahwa log-prior berfungsi sebagai teknik regularisasi.
**Sumber**: **Gelman et al. (2013)**.
- *Note*: Gelman menjelaskan secara mendalam bagaimana pemilihan distribusi prior (misal: Cauchy atau Normal) secara statistik setara dengan menambahkan penalti pada fungsi optimasi untuk mencegah overfitting.

---

## 4. Aplikasi dalam Restorasi/Inference Gabungan
**Poin Teori**: Menggunakan MAP untuk menggabungkan observasi data dan batasan struktur.
**Sumber**: **Geman & Geman (1984)**, Halaman 722.
- *Quote*: *"This form of Bayesian estimation is known as maximum a posteriori or MAP estimation... one seeks to maximize $\log P(G=g | X=x) + \log P(X=x)$... the second term is the penalty term."*
- *Relevansi*: Ini menjadi dasar logis mengapa $L_F$ (likelihood) dan $L_S$ (prior) dalam W2VPred dapat dijumlahkan secara probabilistik.

---
**Kesimpulan**: Landasan teori MAP yang digunakan telah sesuai dengan standar literatur *Pattern Recognition* (Bishop) dan *Bayesian Statistics* (Gelman), serta mengikuti implementasi praktis pada pemodelan citra/struktur (Geman).
