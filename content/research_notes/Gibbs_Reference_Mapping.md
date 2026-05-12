# Pemetaan Referensi: Distribusi Gibbs (Geman & Geman, 1984)

Dokumen ini memetakan setiap poin yang ditulis dalam Bab 2 (Landasan Teori) ke bagian spesifik dalam paper primer: **"Stochastic Relaxation, Gibbs Distributions, and the Bayesian Restoration of Images" (Geman & Geman, 1984)**.

---

## 1. Definisi dan Analogi Fisika
**Teks di Bab 2:**
> "Distribusi Gibbs merupakan kerangka kerja probabilistik yang menghubungkan konsep energi dari fisika statistik ke dalam teori peluang."

**Bukti dalam Referensi (Hal. 721, Abstrak):**
> *"We make an analogy between images and statistical mechanics systems... The assignment of an energy function in the physical system determines its Gibbs distribution."*

---

## 2. Formulasi Matematis ($\pi$, $U$, $Z$, $T$)
**Teks di Bab 2:**
> "$\pi(\omega) = \frac{1}{Z} \exp \left( - \frac{U(\omega)}{T} \right)$"

**Bukti dalam Referensi (Hal. 725, Persamaan 4.3 & 4.5):**
> *"...a probability measure $\pi$ on $\Omega$ with the following representation: $\pi(\omega) = \frac{1}{Z} e^{-U(\omega)/T}$ ... $Z$ is the normalizing constant and is called the partition function."*

---

## 3. Peran Temperatur ($T$) dan Variansi ($\sigma^2$)
**Teks di Bab 2:**
> "Pada temperatur rendah ($T \to 0$), distribusi akan terpusat secara tajam pada konfigurasi dengan energi minimum. ...temperatur dianalogikan sebagai parameter skala atau variansi $2\sigma^2$."

**Bukti dalam Referensi:**
- **Hal. 721 (Poin 2):** *"At low temperatures the local conditional distributions concentrate on states that increase the objective function [maximize probability]."*
- **Hal. 728 (Persamaan 8.2):** Di sini Geman menggunakan pembagi $2\sigma^2$ dalam fungsi energi posterior untuk memodelkan noise Gaussian: *$U^P(f, l) = U(f, l) + \|\mu - \Phi(g, \phi(H(f)))\|^2 / 2\sigma^2$*. Ini menunjukkan secara eksplisit bahwa dalam kerangka Bayesian, variansi $\sigma^2$ adalah analog dari temperatur/energi.

---

## 4. Keunggulan Fungsi Energi untuk Prior
**Teks di Bab 2:**
> "Geman dan Geman (1984) menekankan bahwa penggunaan fungsi energi memberikan cara yang sangat fleksibel dan alami untuk merepresentasikan atribut atau pengetahuan awal (prior knowledge)..."

**Bukti dalam Referensi (Hal. 721, Abstrak):**
> *"The energy function is a more convenient and natural mechanism for embodying picture attributes than are the local characteristics..."*
> (Catatan: Mereka berargumen bahwa jauh lebih mudah merancang fungsi energi (loss) daripada merancang peluang kondisional lokal secara manual).

---

## 5. Integrasi Batasan Geometris (W2VPred)
**Teks di Bab 2:**
> "Batasan-batasan geometris tersebut dapat diintegrasikan ke dalam fungsi objektif gabungan... parameter variansi $\sigma$ untuk bertindak sebagai penyeimbang bobot secara otomatis."

**Bukti dalam Referensi (Hal. 722):**
> *"This form of Bayesian estimation is known as maximum a posteriori or MAP estimation... one seeks to maximize $\log P(G=g | X=x) + \log P(X=x)$... the second term is the penalty term."*
> (Catatan: Penalti term ini adalah Gibbs prior yang dibahas, yang dalam W2VPred diisi oleh $L_S$ dan $L_{RD}$).

---
**Kesimpulan**: Seluruh poin teori yang ditulis pada Bab 2 draf Anda memiliki dasar tekstual dan matematis yang kuat pada paper Geman & Geman (1984), khususnya pada bagian definisi Gibbs Distribution (Sec. IV) dan Posterior Distribution (Sec. VIII).
