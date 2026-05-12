# Pemetaan Referensi: JMAP (Joint Maximum A Posteriori)

**File Referensi**:
- [Mohammad-Djafari (1996)](file:///d:/Skripsi_Wiki/raw/journal/Joint%20Estimation%20Of%20Parameters%20And%20Hyperparameters%20In%20A%20Bayesian%20Approach%20Of%20Solving%20Inverse%20Problems.pdf)
- [Gelman et al. (2013) — Bayesian Data Analysis](file:///d:/Skripsi_Wiki/raw/journal/Bayesian%20Data%20Analysis.pdf)

---

## ✅ Status Ketersediaan PDF

| Referensi | Kunci BibTeX | Status PDF |
|---|---|---|
| Mohammad-Djafari (1996) | `mohammad1996joint` | ✅ Ada di `raw/journal/Joint Estimation Of...pdf` |
| Gelman et al. (2013) | `gelman2013bayesian` | ✅ Ada di `raw/journal/Bayesian Data Analysis.pdf` |
| Bishop (2006) | `bishop2006pattern` | ✅ Ada di `raw/journal/Bishop_book.pdf` |

---

## 1. Motivasi JMAP: Estimasi Simultan Parameter dan Hiperparameter

**Teks di Bab 2**:
> "JMAP mengatasi keterbatasan ini dengan memperlakukan hiperparameter sebagai variabel acak yang diestimasi bersama-sama dengan parameter utama dalam satu proses optimasi yang terpadu."

**Bukti dari Referensi — Mohammad-Djafari (1996)**:
> *"In this paper we propose a joint estimation of the parameters and hyperparameters (the parameters of the prior law) when a Bayesian approach with Maximum Entropy (ME) priors is used to solve the inverse problems."*

---

## 2. Dekomposisi Hierarki Bayesian: $P(\omega, \phi | y)$

**Teks di Bab 2**:
> "$P(\theta, \sigma \mid D) \propto P(D \mid \theta, \sigma) \, P(\theta \mid \sigma) \, P(\sigma)$"

**Bukti dari Referensi — Gelman et al. (2013), Halaman 107, Persamaan (5.3)**:

*(Diekstrak langsung dari PDF, Bab 5, Section 5.2, halaman buku 107)*

> *"The joint prior distribution is $p(\phi, \omega) = p(\phi)p(\omega|\phi)$, and the joint posterior distribution is*
> $$p(\phi, \omega | y) \propto p(\phi, \omega) p(y | \phi, \omega) = p(\phi, \omega) p(y | \omega) \tag{5.3}$$
> *with the latter simplification holding because the data distribution, $p(y|\phi, \omega)$, depends only on $\omega$; the hyperparameters $\phi$ affect $y$ only through $\omega$."*

**Keterangan notasi**: Gelman menggunakan $\phi$ untuk hiperparameter dan $\omega$ untuk parameter utama — dalam skripsi ini dinotasikan sebagai $\sigma$ dan $\theta$ secara berturut-turut. Persamaan (5.3) ini secara langsung adalah landasan untuk persamaan JMAP di Bab 2.

---

## 3. Tiga Langkah Analitik Penulisan Joint Posterior

**Bukti dari Referensi — Gelman et al. (2013), Halaman 108, Section 5.3**:

*(Diekstrak langsung dari PDF, judul bagian "Analytic derivation of conditional and marginal distributions")*

> *"We first perform the following three steps analytically:*
> *1. Write the joint posterior density, $p(\omega, \phi|y)$, in unnormalized form as a **product of the hyperprior distribution $p(\phi)$, the population distribution $p(\omega|\phi)$, and the likelihood $p(y|\omega)$**.*
> *2. Determine analytically the conditional posterior density of $\omega$ given the hyperparameters $\phi$; for fixed observed $y$, this is a function of $\phi$, $p(\omega|\phi, y)$.*
> *3. Estimate $\phi$ using the Bayesian paradigm; that is, obtain its marginal posterior distribution, $p(\phi|y)$."*

---

## 4. Justifikasi Penggunaan Non-Informative Hyperprior ($P(\sigma)$)

**Teks di Bab 2**:
> "Dalam praktek, suku $-\ln P(\sigma)$ yang merepresentasikan *hyperprior* sering kali diasumsikan sebagai *non-informative* atau *improper prior*..."

**Bukti dari Referensi — Gelman et al. (2013), Halaman 107-108, Section 5.2**:

*(Diekstrak langsung dari PDF, judul paragraf "The hyperprior distribution")*

> *"In order to create a joint probability distribution for $(\phi, \omega)$, we must assign a prior distribution to $\phi$. If little is known about $\phi$, we can assign a **diffuse prior distribution**, but we must be careful when using an **improper prior density** to check that the resulting posterior distribution is proper..."*

Dan pada halaman buku 108:
> *"As in nonhierarchical models, it is often practical to **start with a simple, relatively noninformative, prior distribution on $\phi$** and seek to add more prior information if there remains too much variation in the posterior distribution."*

---

## 5. Penggunaan Hyperprior Non-Informatif pada Model Konkret (Rat Tumor Example)

**Bukti dari Referensi — Gelman et al. (2013), Halaman 110, Section 5.3**:

*(Diekstrak langsung dari PDF, halaman buku 110)*

> *"...we shall assign a **noninformative hyperprior distribution** to reflect our ignorance about the unknown hyperparameters. As usual, the word 'noninformative' indicates our attitude toward this part of the model and is not intended to imply that this particular distribution has any special properties."*

---

## Kesimpulan Validasi

Seluruh klaim teoretis dalam bagian JMAP di Bab 2 telah terverifikasi memiliki landasan tekstual dan matematis yang kuat:

| Klaim | Sumber | Halaman |
|---|---|---|
| Estimasi simultan parameter + hiperparameter | Mohammad-Djafari (1996), Abstrak | - |
| Dekomposisi $P(\phi,\omega\|y) \propto P(\phi)P(\omega\|\phi)P(y\|\omega)$ | Gelman (2013), Persamaan (5.3) | 107 |
| Tiga komponen joint posterior | Gelman (2013), Section 5.3 | 108 |
| Justifikasi *non-informative hyperprior* | Gelman (2013), "The hyperprior distribution" | 107-108 |
| Penggunaan *noninformative hyperprior* dalam praktik | Gelman (2013), Rat Tumor example | 110 |
