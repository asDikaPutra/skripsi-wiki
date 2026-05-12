# Jawaban Sidang — Kategori B: Formulasi Matematis & Turunan

> **Skripsi:** Reformulasi Probabilistik W2VPred menggunakan Joint Maximum A Posteriori (JMAP)
> **Bahasa:** Indonesia akademik formal
> **Jumlah:** 20 jawaban (B.1 – B.20)

---

## B.1 — Derivasi JF dari Likelihood Gaussian

**Pertanyaan:** Jelaskan bagaimana fungsi likelihood Gaussian diturunkan menjadi JF = LF/(2σF²) + (T·V²)log σF. Tunjukkan setiap langkah negatif log-likelihood dan konstanta yang diabaikan.

**Jawaban:**

**Langkah 1 — Model Observasi.** Matriks PPMI Yt direkonstruksi melalui inner-product embedding dan galat Gaussian:

$$Y_{t,ij} = [U_t U_t^\top]_{ij} + \varepsilon_{t,ij}, \quad \varepsilon_{t,ij} \sim \mathcal{N}(0, \sigma_F^2)$$

**Langkah 2 — Likelihood per Entri.** Karena ε ~ N(0, σF²), probabilitas satu entri observasi adalah:

$$p(Y_{t,ij} \mid U_t, \sigma_F) = \frac{1}{\sqrt{2\pi}\,\sigma_F} \exp\!\left(-\frac{(Y_{t,ij} - [U_t U_t^\top]_{ij})^2}{2\sigma_F^2}\right)$$

**Langkah 3 — Likelihood Gabungan.** Dengan asumsi i.i.d. pada seluruh entri (t = 1..T, i = 1..V, j = 1..V), likelihood total adalah hasil kali:

$$p(Y \mid U, \sigma_F) = \prod_{t=1}^T \prod_{i=1}^V \prod_{j=1}^V \frac{1}{\sqrt{2\pi}\,\sigma_F} \exp\!\left(-\frac{(Y_{t,ij} - [U_t U_t^\top]_{ij})^2}{2\sigma_F^2}\right)$$

**Langkah 4 — Negatif Log-Likelihood.** Transformasi ke bentuk penjumlahan:

$$\begin{aligned}
-\ln p(Y \mid U, \sigma_F) &= \sum_{t=1}^T \sum_{i=1}^V \sum_{j=1}^V \left[ \frac{(Y_{t,ij} - [U_t U_t^\top]_{ij})^2}{2\sigma_F^2} + \ln(\sqrt{2\pi}\,\sigma_F) \right] \\[4pt]
&= \frac{1}{2\sigma_F^2} \underbrace{\sum_{t=1}^T \sum_{i=1}^V \sum_{j=1}^V (Y_{t,ij} - [U_t U_t^\top]_{ij})^2}_{=: L_F} + (T \cdot V^2) \ln \sigma_F + \frac{T V^2}{2} \ln(2\pi)
\end{aligned}$$

**Langkah 5 — Definisi JF.** Komponen objektif yang relevan untuk optimasi hanyalah suku yang bergantung pada U atau σF. Konstanta $(T V^2 / 2)\ln(2\pi)$ tidak bergantung pada parameter dan dapat diabaikan:

$$J_F(U, \sigma_F) = \frac{L_F}{2\sigma_F^2} + (T \cdot V^2) \ln \sigma_F$$

di mana LF = Σt ‖Yt − UtUtᵀ‖F² adalah *Fidelity Loss* deterministik original.

---

## B.2 — Peran σF² dalam JF

**Pertanyaan:** Mengapa suku (T·V²) log σF muncul? Apa implikasinya terhadap estimasi σF² saat optimasi bersama parameter U?

**Jawaban:**

Suku $(T \cdot V^2) \ln \sigma_F$ muncul dari dua sumber:
1. **Faktor normalisasi distribusi Gaussian** — setiap entri observasi menyumbang faktor $1/(\sqrt{2\pi}\sigma_F)$, sehingga setelah negatif logaritma muncul $(T V^2) \ln \sigma_F$.
2. **Suku ini berfungsi sebagai regularisasi alami** — mencegah σF → 0 (yang akan membuat bobot $1/(2\sigma_F^2) \to \infty$ dan menyebabkan overfitting).

**Implikasi terhadap estimasi bersama:**
- Ketika U belum konvergen, LF besar → gradien mendorong σF membesar agar penalti $L_F/(2\sigma_F^2)$ tidak terlalu dominan.
- Ketika U mulai konvergen, LF mengecil → suku log σF mendorong σF mengecil, sehingga bobot fidelitas data meningkat.
- Terjadi **keseimbangan dinamis**: σF mengontrol seberapa ketat model harus merekonstruksi data, dan nilainya ditentukan oleh data secara otomatis, bukan melalui grid search.

---

## B.3 — Derivasi Prior Gibbs JS

**Pertanyaan:** Turunkan pS(U|W,σS²) = exp(−LS/(2σS²))/ZS menjadi JS = LS/(2σS²) + (T·V·d) log σS. Jelaskan bagaimana faktor T·V·d muncul.

**Jawaban:**

**Langkah 1 — Definisi Prior Gibbs.** Struktur embedding dimodelkan sebagai distribusi Gibbs:

$$p_S(U \mid W, \sigma_S) = \frac{1}{Z_S(\sigma_S)} \exp\!\left(-\frac{L_S(U)}{2\sigma_S^2}\right)$$

dengan LS(U) = Σ_{t≠t'} W_{t,t'} ‖Ut − Ut'‖F², dan fungsi partisi:

$$Z_S(\sigma_S) = \int \exp\!\left(-\frac{L_S(U)}{2\sigma_S^2}\right) dU$$

**Langkah 2 — Homogenitas dan Perubahan Variabel.** LS bersifat homogen derajat dua: LS(cU) = c² LS(U). Substitusi U = σS V:

$$L_S(\sigma_S V) = \sigma_S^2 L_S(V)$$

Integran menjadi:

$$\exp\!\left(-\frac{L_S(\sigma_S V)}{2\sigma_S^2}\right) = \exp\!\left(-\frac{L_S(V)}{2}\right)$$

**Langkah 3 — Jacobian Perubahan Variabel.** U ∈ ℝ^{T × V × d} (T domain, V kata, d dimensi). Saat U = σS V, elemen diferensial berubah sebagai:

$$dU = \sigma_S^{T \cdot V \cdot d} \, dV$$

karena setiap dari n = T·V·d dimensi diskalakan oleh σS.

**Langkah 4 — Fungsi Partisi Tersederhanakan:**

$$Z_S(\sigma_S) = \sigma_S^{T V d} \int \exp\!\left(-\frac{L_S(V)}{2}\right) dV = \sigma_S^{T V d} \cdot Z_S(1)$$

**Langkah 5 — Negatif Log Prior:**

$$\begin{aligned}
-\ln p_S(U \mid W, \sigma_S) &= \frac{L_S(U)}{2\sigma_S^2} + \ln Z_S(\sigma_S) \\[4pt]
&= \frac{L_S(U)}{2\sigma_S^2} + T V d \ln \sigma_S + \underbrace{\ln Z_S(1)}_{\text{konstan}}
\end{aligned}$$

Konstanta ln ZS(1) tidak bergantung pada parameter dan diabaikan, menghasilkan:

$$J_S(U, \sigma_S) = \frac{L_S}{2\sigma_S^2} + (T \cdot V \cdot d) \ln \sigma_S$$

**Penjelasan faktor T·V·d:** Jumlah total elemen bebas dalam tensor embedding U adalah T × V × d — setiap domain memiliki V embedding vektor berdimensi d. Jacobian substitusi U = σS V menghasilkan determinan σS^n dengan n = T·V·d.

---

## B.4 — Fungsi Partisi ZS dan Homogenitas

**Pertanyaan:** Bagaimana sifat homogenitas derajat dua LS(cU) = c²LS(U) digunakan untuk menyederhanakan fungsi partisi? Tunjukkan ZS ∝ (σS²)^(TVd/2).

**Jawaban:**

**Langkah 1 — Definisi Fungsi Partisi:**

$$Z_S(\sigma_S) = \int_{\mathbb{R}^{T V d}} \exp\!\left(-\frac{L_S(U)}{2\sigma_S^2}\right) dU$$

**Langkah 2 — Homogenitas Derajat Dua.** Sifat utama: untuk sembarang skalar c > 0,

$$L_S(cU) = c^2 L_S(U)$$

**Pembuktian singkat:** LS(U) = Σ_{t≠t'} W_{t,t'} ‖Ut − Ut'‖F². Setiap suku norma Frobenius memenuhi ‖cUt − cUt'‖F² = c²‖Ut − Ut'‖F². Maka LS(cU) = c²LS(U). ∎

**Langkah 3 — Perubahan Variabel.** Pilih c = 1/σS, atau secara ekuivalen U' = U/σS. Maka U = σS U' dan:

$$\exp\!\left(-\frac{L_S(\sigma_S U')}{2\sigma_S^2}\right) = \exp\!\left(-\frac{\sigma_S^2 L_S(U')}{2\sigma_S^2}\right) = \exp\!\left(-\frac{L_S(U')}{2}\right)$$

Parameter σS lenyap dari eksponensial.

**Langkah 4 — Diferensial.** dU = σS^{T V d} dU' (determinan Jacobian matriks diagonal T V d × T V d dengan entri σS).

**Langkah 5 — Bentuk Akhir:**

$$Z_S(\sigma_S) = \sigma_S^{T V d} \int \exp\!\left(-\frac{L_S(U')}{2}\right) dU' = \sigma_S^{T V d} \cdot Z_S(1)$$

Karena $\sigma_S^{TVd} = (\sigma_S^2)^{TVd/2}$, maka:

$$Z_S(\sigma_S) \propto (\sigma_S^2)^{\frac{T V d}{2}}$$

Hubungan proporsionalitas ini adalah kunci: fungsi partisi ZS(σS) berskala sebagai pangkat T V d / 2 dari σS², yang setelah negatif logaritma menghasilkan suku (T V d) ln σS dalam JS.

---

## B.5 — Penurunan JRD

**Pertanyaan:** Turunkan bentuk JRD yang setara dengan JS tetapi dengan dimensi yang sesuai.

**Jawaban:**

**Langkah 1 — Definisi Smoothing Loss.** LRD mengukur variasi antar-domain:

$$L_{RD}(U) = \sqrt{\sum_{t \neq t'} D_{t,t'}^2}, \quad D_{t,t'} = \|U_t - U_{t'}\|_F^2$$

atau dalam bentuk ekuivalen yang lebih umum: LRD(U) = Σ_{t≠t'} ‖Ut − Ut'‖F² = LS(U) dalam banyak implementasi.

**Langkah 2 — Prior Gibbs untuk Smoothing:**

$$p_{RD}(U \mid \sigma_{RD}) = \frac{1}{Z_{RD}(\sigma_{RD})} \exp\!\left(-\frac{L_{RD}(U)}{2\sigma_{RD}^2}\right)$$

**Langkah 3 — Homogenitas.** Sama seperti LS, fungsi LRD bersifat homogen derajat dua:

$$L_{RD}(cU) = c^2 L_{RD}(U)$$

karena setiap suku ‖cUt − cUt'‖F² = c²‖Ut − Ut'‖F², dan akar kuadrat dari c²·(Σ D²) menghasilkan c·√(Σ D²) = c·LRD(U). —> *Koreksi*: jika LRD didefinisikan sebagai Σ‖Ut−Ut'‖F², homogenitas derajat dua terpenuhi langsung. Jika LRD = √(Σ D²), homogenitas derajat SATU. Dalam skripsi ini digunakan definisi Σ‖Ut−Ut'‖F² sehingga homogenitas derajat dua terpenuhi.

**Langkah 4 — Fungsi Partisi.** Dengan perubahan variabel U = σRD V:

$$Z_{RD}(\sigma_{RD}) = \sigma_{RD}^{T V d} \cdot Z_{RD}(1)$$

**Langkah 5 — Negatif Log Prior:**

$$\begin{aligned}
-\ln p_{RD}(U \mid \sigma_{RD}) &= \frac{L_{RD}}{2\sigma_{RD}^2} + \ln Z_{RD}(\sigma_{RD}) \\[4pt]
&= \frac{L_{RD}}{2\sigma_{RD}^2} + T V d \ln \sigma_{RD} + \text{konstan}
\end{aligned}$$

Maka:

$$J_{RD}(U, \sigma_{RD}) = \frac{L_{RD}}{2\sigma_{RD}^2} + (T \cdot V \cdot d) \ln \sigma_{RD}$$

Bentuk ini identik dengan JS karena (a) fungsi energi sama-sama homogen derajat dua, dan (b) dimensi parameter U sama (T·V·d).

---

## B.6 — Reparameterisasi s = log σ²

**Pertanyaan:** Mengapa reparameterisasi ini diperlukan? Tunjukkan bagaimana transformasi mengubah fungsi objektif dari L/(2σ²) + (k/2)log σ² menjadi ½exp(−s)L + (k/2)s, dan jelaskan keuntungannya.

**Jawaban:**

**Motivasi — Kendala Non-Negatif.** Parameter σ² harus selalu positif (variansi). Mengoptimasi σ² secara langsung berisiko:
1. **Pelanggaran kendala** — update gradien dapat mendorong σ² < 0.
2. **Skala tidak seragam** — σ² dapat bervariasi hingga orde magnitudo yang berbeda, menyulitkan learning rate tunggal.
3. **Numerical underflow** — σ² → 0 menyebabkan pembagian dengan bilangan sangat kecil.

**Transformasi.** Definisikan:

$$s := \ln \sigma^2 \quad \Longleftrightarrow \quad \sigma^2 = e^{s}, \quad \sigma = e^{s/2}$$

**Substitusi ke Bentuk Umum JF/S/RD.** Setiap komponen memiliki bentuk:

$$J = \frac{L}{2\sigma^2} + \frac{n}{2} \ln \sigma^2$$

dengan n = 2·T·V² untuk JF (karena suku log σF dikalikan TV² = (2·TV²)/2·ln σF²) atau n = 2·T·V·d untuk JS dan JRD.

**Langkah demi langkah:**

$$\begin{aligned}
J &= \frac{L}{2 e^{s}} + \frac{n}{2} \cdot s \\[4pt]
&= \frac{1}{2} e^{-s} L + \frac{n}{2} s
\end{aligned}$$

Untuk kasus spesifik dengan k = T·V² atau k = T·V·d:

$$J = \frac{1}{2} e^{-s} L + \frac{k}{2} s$$

di mana untuk JF: k_F = 2·T·V²; untuk JS/RD: k_S = 2·T·V·d.

**Keuntungan Reparameterisasi:**

1. **Kendala tak-berkendala** — s ∈ ℝ, tidak ada batasan; optimasi bebas tanpa proyeksi.
2. **Skala gradien seragam** — gradien ∂J/∂s tidak bergantung pada magnitudo σ², memudahkan tuning learning rate.
3. **Stabilitas numerik** — menghindari pembagian dengan σ² yang mendekati nol atau ∞.
4. **Interpretasi** — s = 0 ⇔ σ² = 1, s < 0 ⇔ σ² < 1 (ketidakpastian kecil, bobot besar), s > 0 ⇔ σ² > 1 (ketidakpastian besar, bobot kecil).
5. **Linierisasi suku regularisasi** — suku (k/2)s adalah linear dalam s, bukan non-linear dalam σ, memudahkan optimasi.

---

## B.7 — Gradien Setelah Reparameterisasi

**Pertanyaan:** Turunkan ∂J/∂s untuk J = ½exp(−s)L + (k/2)s. Bagaimana bentuk ini mempermudah optimasi dibanding parameterisasi asli σ²?

**Jawaban:**

**Turunan Langsung:**

$$J = \frac{1}{2} e^{-s} L + \frac{k}{2} s$$

$$\frac{\partial J}{\partial s} = -\frac{1}{2} e^{-s} L + \frac{k}{2}$$

$$\boxed{\frac{\partial J}{\partial s} = \frac{1}{2} \bigl(k - e^{-s} L \bigr)}$$

**Interpretasi:** Gradien mencapai nol saat $e^{-s} L = k$, yaitu $\sigma^2 = L / k$.

**Perbandingan dengan Parameterisasi Asli σ².** Dalam parameterisasi asli ($\sigma^2$):

$$J = \frac{L}{2\sigma^2} + \frac{k}{2} \ln \sigma^2$$

$$\frac{\partial J}{\partial (\sigma^2)} = -\frac{L}{2\sigma^4} + \frac{k}{2\sigma^2} = \frac{1}{2\sigma^2}\left(k - \frac{L}{\sigma^2}\right)$$

**Keunggulan s = ln σ²:**

| Aspek | Parameterisasi σ² | Parameterisasi s |
|-------|-------------------|------------------|
| Bentuk gradien | $\frac{1}{2\sigma^2}(k - L/\sigma^2)$ | $\frac{1}{2}(k - e^{-s}L)$ |
| Ketergantungan skala | Gradien ∝ 1/σ² — mengecil saat σ² besar | Seragam — tidak bergantung pada nilai s |
| Saturasi saat σ² besar | Gradien mendekati 0 (vanishing) | Gradien tetap ~ k/2 |
| Learning rate sensitif | Sangat — harus diskalakan ulang | Lebih robust |
| Update dengan Adam | Perlu clip gradien atau normalisasi | Langsung stabil |

**Implikasi:** Dengan reparameterisasi, optimasi σ menjadi semudah mengoptimasi parameter lain dalam jaringan — Adam dapat langsung menerapkan update tanpa penyesuaian skala khusus.

---

## B.8 — Strategi Optimasi JMAP

**Pertanyaan:** Jelaskan (θ̂,σ̂) = argmax [ln P(D|θ,σ) + ln P(θ|σ) + ln P(σ)]. Bagaimana setiap suku berkorespondensi dengan JF, JS, JRD?

**Jawaban:**

**Formulasi JMAP.** Estimasi simultan parameter embedding U (θ) dan hiperparameter σ = (σF, σS, σRD) dengan memaksimalkan log-posterior gabungan:

$$(\hat{U}, \hat{\sigma}) = \arg\max_{U, \sigma} \bigl[ \underbrace{\ln P(Y \mid U, \sigma_F)}_{\text{likelihood}} + \underbrace{\ln P(U \mid \sigma_S, \sigma_{RD})}_{\text{prior}} + \underbrace{\ln P(\sigma)}_{\text{hyperprior}} \bigr]$$

Dalam praktiknya, kita meminimalkan negatif log-posterior:

$$(\hat{U}, \hat{\sigma}) = \arg\min_{U, \sigma} L_{MAP}(U, \sigma)$$

**Korespondensi dengan JF, JS, JRD:**

| Suku Bayes | Komponen | Ekspresi |
|------------|----------|----------|
| $-\ln P(Y \mid U, \sigma_F)$ | **JF** (Negative Log-Likelihood) | $\frac{L_F}{2\sigma_F^2} + T V^2 \ln \sigma_F$ |
| $-\ln P(U \mid \sigma_S)$ | **JS** (Gibbs Prior Struktur) | $\frac{L_S}{2\sigma_S^2} + T V d \ln \sigma_S$ |
| $-\ln P(U \mid \sigma_{RD})$ | **JRD** (Gibbs Prior Smoothing) | $\frac{L_{RD}}{2\sigma_{RD}^2} + T V d \ln \sigma_{RD}$ |
| $-\ln P(\sigma)$ | **Hyperprior** | Diabaikan (improper prior → konstan) |

**Fungsi Objektif Akhir:**

$$L_{MAP}(U, \sigma_F, \sigma_S, \sigma_{RD}) = \underbrace{\frac{L_F}{2\sigma_F^2} + T V^2 \ln \sigma_F}_{J_F} + \underbrace{\frac{L_S}{2\sigma_S^2} + T V d \ln \sigma_S}_{J_S} + \underbrace{\frac{L_{RD}}{2\sigma_{RD}^2} + T V d \ln \sigma_{RD}}_{J_{RD}}$$

**Strategi Optimasi:**
1. **Per-domain updates:** Embedding Ut dioptimasi per domain — setiap domain memiliki optimizer Adam sendiri.
2. **Global update σ:** Parameter s = ln σ² diakumulasi gradien dari seluruh domain, diperbarui sekali per outer step.
3. **Adam optimizer:** Learning rate terpisah untuk embedding dan s (biasanya s lebih kecil).
4. **Reparameterisasi:** Semua σ² direparameterisasi sebagai s = ln σ² untuk stabilitas numerik.

---

## B.9 — Perbedaan JMAP dengan MAP Biasa

**Pertanyaan:** Apa perbedaan mendasar JMAP dengan MAP biasa? Dalam kondisi apa JMAP lebih unggul?

**Jawaban:**

**Perbedaan Mendasar:**

| Aspek | MAP Biasa | JMAP |
|-------|-----------|------|
| Parameter | Hanya θ (parameter utama) | θ + σ (parameter + hiperparameter) |
| Prior | P(θ) — fixed, tidak diestimasi | P(θ|σ) — bergantung σ yang juga diestimasi |
| Objektif | $\ln P(D\|\theta) + \ln P(\theta)$ | $\ln P(D\|\theta,\sigma) + \ln P(\theta\|\sigma) + \ln P(\sigma)$ |
| Hiperparameter | Ditentukan manual / grid search | Diestimasi simultan dari data |
| Fleksibilitas | Bobot regularisasi tetap | Bobot regularisasi adaptif |

**Kapan JMAP Lebih Unggul:**

1. **Multi-task learning** — ketika beberapa fungsi loss dengan skala berbeda harus digabungkan (seperti W2VPred: LF, LS, LRD).
2. **Hiperparameter tidak diketahui** — tidak ada justifikasi teoretis yang kuat untuk nilai tetap tertentu.
3. **Grid search tidak praktis** — jumlah hiperparameter > 2 membuat grid search eksponensial mahal.
4. **Data heterogen** — ketika karakteristik noise/ketidakpastian bervariasi antar komponen atau domain.
5. **Skala besar** — pelatihan ulang untuk setiap titik grid tidak feasible.

**Kapan JMAP Tidak Diperlukan:**
- Hanya satu komponen loss (MAP biasa cukup).
- Hiperparameter diketahui dari teori/fisika.
- Sumber daya komputasi sangat terbatas.

---

## B.10 — Korespondensi λ dan τ

**Pertanyaan:** Diberikan λ = σF²/σS² dan τ = σF²/σRD², tunjukkan bagaimana parameter balancing ini muncul dalam fungsi objektif gabungan. Apa interpretasi praktis λ dan τ?

**Jawaban:**

**Turunan Korespondensi.** Fungsi objektif JMAP:

$$L_{MAP} = \frac{L_F}{2\sigma_F^2} + \frac{L_S}{2\sigma_S^2} + \frac{L_{RD}}{2\sigma_{RD}^2} + T V^2 \ln \sigma_F + T V d \ln \sigma_S + T V d \ln \sigma_{RD}$$

Faktorkan $1/(2\sigma_F^2)$ dari tiga suku pertama:

$$\begin{aligned}
L_{MAP} &= \frac{1}{2\sigma_F^2} \Bigl[ L_F + \frac{\sigma_F^2}{\sigma_S^2} L_S + \frac{\sigma_F^2}{\sigma_{RD}^2} L_{RD} \Bigr] + \text{(suku log)} \\[4pt]
&= \frac{1}{2\sigma_F^2} \Bigl[ L_F + \lambda L_S + \tau L_{RD} \Bigr] + \text{(suku log)}
\end{aligned}$$

di mana:

$$\boxed{\lambda = \frac{\sigma_F^2}{\sigma_S^2}}, \quad \boxed{\tau = \frac{\sigma_F^2}{\sigma_{RD}^2}}$$

**Interpretasi Praktis λ dan τ:**

1. **Rasio ketidakpastian** — λ besar berarti σS kecil relatif terhadap σF → prior struktur "kuat" (ketidakpastian rendah, bobot besar).
2. **Bobot regularisasi efektif** — λ dan τ adalah bobot yang secara klasik ditentukan via grid search.
3. **Adaptif otomatis** — dalam JMAP, λ dan τ tidak tetap; mereka berubah selama pelatihan karena σF, σS, σRD diestimasi simultan.
4. **Skala** — λ = 1 berarti ketidakpastian fidelitas dan struktur seimbang; λ > 1 berarti struktur lebih dipercaya daripada data; λ < 1 berarti data lebih dominan.

**Keterbatasan Pandangan Ini:** Persamaan di atas menyederhanakan dengan mengabaikan suku log σ. Dalam JMAP penuh, suku log σ juga berkontribusi pada estimasi σ, sehingga λ dan τ bukan sekadar rasio tetap tetapi hasil dari optimasi yang mempertimbangkan dimensi data (T·V² vs T·V·d).

---

## B.11 — σF² sebagai Faktor Normalisasi

**Pertanyaan:** Mengapa σF² dapat difaktorkan keluar dari semua suku? Bagaimana hal ini memengaruhi strategi optimasi?

**Jawaban:**

σF² dapat difaktorkan keluar dari suku-suku utama (L_F, L_S, L_RD) karena setiap komponen loss dibagi oleh variansinya masing-masing. Saat kita menulis:

$$L_{MAP} = \frac{L_F}{2\sigma_F^2} + \frac{L_S}{2\sigma_S^2} + \frac{L_{RD}}{2\sigma_{RD}^2} + \cdots$$

dan mendefinisikan λ = σF²/σS², τ = σF²/σRD², maka:

$$L_{MAP} = \frac{1}{2\sigma_F^2} \bigl(L_F + \lambda L_S + \tau L_{RD}\bigr) + \cdots$$

**Mengapa Ini Penting:**

1. **Satu skala referensi** — σF² menjadi unit dasar; λ dan τ adalah rasio yang lebih mudah diinterpretasi daripada σS² dan σRD² secara langsung.
2. **Tidak mengubah titik optimum** — faktor $1/(2\sigma_F^2)$ adalah konstanta positif untuk setiap iterasi; meminimalkan $L_F + \lambda L_S + \tau L_{RD}$ ekuivalen dengan meminimalkan $L_{MAP}$ terhadap U untuk σ tetap.

**Dampak pada Strategi Optimasi:**

- **Tidak ada simplifikasi berlebihan:** Meskipun σF² dapat difaktorkan dari suku loss, suku log σF, log σS, log σRD **tetap ada** dan memengaruhi estimasi σ. Faktorisasi hanya membantu interpretasi (menghubungkan ke parameter balancing original), bukan penyederhanaan optimasi.
- **Optimasi penuh tetap diperlukan:** σF, σS, σRD masing-masing diperbarui melalui gradien terhadap J_F, J_S, J_RD secara terpisah.

---

## B.12 — Homogenitas pada LF

**Pertanyaan:** Apakah fungsi fidelity LF(U) bersifat homogen derajat dua terhadap U? Jika tidak, bagaimana perlakuan fungsi partisi berbeda?

**Jawaban:**

**Homogenitas LF.** LF(U) = Σ_t ‖Y_t − U_t U_tᵀ‖F². Jika U diskalakan menjadi cU:

$$L_F(cU) = \sum_t \| Y_t - (cU_t)(cU_t)^\top \|_F^2 = \sum_t \| Y_t - c^2 U_t U_t^\top \|_F^2$$

**LF BUKAN homogen derajat dua** karena:
- Suku rekonstruksi $U_t U_t^\top$ berskala $c^2$, bukan $c$.
- Data observasi Y_t tidak diskalakan.
- Akibatnya: $L_F(cU) \neq c^2 L_F(U)$.

**Implikasi terhadap Fungsi Partisi:**

Likelihood Gaussian **tidak memiliki fungsi partisi** yang bergantung pada parameter dalam bentuk integral yang perlu disederhanakan. Dalam formulasi:

$$p(Y \mid U, \sigma_F) = \prod_{t,i,j} \frac{1}{\sqrt{2\pi}\sigma_F} \exp\!\left(-\frac{(Y_{t,ij} - [U_t U_t^\top]_{ij})^2}{2\sigma_F^2}\right)$$

Fungsi partisi di sini adalah $(2\pi)^{TV^2/2} \sigma_F^{TV^2}$, yang merupakan konstanta normalisasi dari distribusi Gaussian, bukan dari integral atas U. Suku $(T V^2)\ln \sigma_F$ muncul langsung dari normalisasi Gaussian — tanpa perlu homogenitas.

**Perbandingan:**

| Aspek | JF (Likelihood) | JS/JRD (Prior) |
|-------|-----------------|----------------|
| Sumber suku log | Normalisasi distribusi Gaussian | Fungsi partisi dari integral atas U |
| Homogenitas diperlukan? | Tidak | Ya |
| Eksponen suku log | TV² | TVd |
| Sifat | Tepat (exact) | Bergantung pada properti homogenitas |

---

## B.13 — Dampak Reparameterisasi pada Prior σ

**Pertanyaan:** Jika kita menempatkan prior non-informatif p(σ²) ∝ 1/σ², bagaimana bentuk suku prior setelah reparameterisasi? Apakah transformasi mengubah interpretasi prior?

**Jawaban:**

**Prior Non-Informatif Jeffreys untuk σ²:**

$$p(\sigma^2) \propto \frac{1}{\sigma^2}$$

Ini adalah prior improper yang invarian terhadap skala — tidak memihak nilai σ² tertentu.

**Transformasi s = ln σ².** Menggunakan aturan perubahan variabel untuk densitas probabilitas:

$$p(s) = p(\sigma^2) \cdot \left|\frac{d\sigma^2}{ds}\right|$$

$$\frac{d\sigma^2}{ds} = \frac{d}{ds} e^{s} = e^{s} = \sigma^2$$

Maka:

$$p(s) \propto \frac{1}{\sigma^2} \cdot \sigma^2 = 1$$

**Kesimpulan:** Setelah reparameterisasi, prior 1/σ² menjadi prior **uniform** (konstan) dalam s.

**Implikasi:**

| Aspek | Sebelum (σ²) | Sesudah (s) |
|-------|--------------|-------------|
| Prior | p(σ²) ∝ 1/σ² | p(s) ∝ 1 (uniform) |
| Sifat | Improper (∫ 1/σ² dσ² = ∞) | Improper (∫ 1 ds = ∞) |
| Invarian skala | Ya | Tidak langsung |
| Efek pada optimasi | Sama — kontribusi konstan | Sama — kontribusi konstan |

**Apakah interpretasi berubah?** Tidak secara fundamental. Prior non-informatif tetap menjadi prior non-informatif — tidak memberikan informasi preferensial. Transformasi hanya mengubah parameterisasi, bukan informasi yang dikodekan.

**Catatan:** Dalam implementasi JMAP skripsi ini, prior P(σ) diabaikan sepenuhnya (diperlakukan sebagai konstanta) karena:
1. Prior improper tidak berkontribusi pada gradien.
2. Suku regularisasi log σ sudah ada dari normalisasi Gibbs/Gaussian.
3. Menambahkan hyperprior tambahan tidak mengubah estimasi secara signifikan untuk tujuan praktis.

---

## B.14 — Penurunan JS untuk Dimensi d

**Pertanyaan:** Tuliskan bentuk eksplisit LS dalam konteks W2VPred dan turunkan dimensi integral fungsi partisi sehingga menghasilkan faktor TVd/2.

**Jawaban:**

**Bentuk Eksplisit LS.**
Structure Loss dalam W2VPred didefinisikan sebagai penjumlahan jarak kuadrat antar domain embedding, dibobot oleh matriks W:

$$L_S(U) = \sum_{t=1}^T \sum_{t' \neq t} W_{t,t'} \cdot \|U_t - U_{t'}\|_F^2$$

di mana:
- U_t ∈ ℝ^{V × d} adalah embedding domain t.
- W_{t,t'} adalah bobot kesamaan antar domain (misal, dari co-occurrence domain label).
- Norma Frobenius: ‖U_t − U_{t'}‖F² = Σ_{i=1}^V Σ_{k=1}^d (U_{t,i,k} − U_{t',i,k})².

**Dimensi Ruang Parameter.** Tensor embedding U memiliki total:

$$N = T \cdot V \cdot d$$

parameter bebas. Setiap Ut adalah matriks V × d, dan ada T domain.

**Turunan Integral Fungsi Partisi.**

$$Z_S(\sigma_S) = \int_{\mathbb{R}^{T V d}} \exp\!\left(-\frac{L_S(U)}{2\sigma_S^2}\right) dU$$

**Langkah 1 — Homogenitas.** LS(cU) = c²LS(U).

**Langkah 2 — Substitusi U = σS V.** Untuk V ∈ ℝ^{T V d}:

$$L_S(\sigma_S V) = \sigma_S^2 L_S(V)$$

Integran menjadi exp(−LS(V)/2), bebas dari σS.

**Langkah 3 — Diferensial.** Bentuk dU dalam koordinat kartesian ℝ^{T V d}:

$$U = \sigma_S V \quad\Longrightarrow\quad dU = \sigma_S^{T V d} \, dV$$

Karena dU = Π_{t,i,k} dU_{t,i,k} dan dU_{t,i,k} = σS dV_{t,i,k}, maka ada TVd faktor σS.

**Langkah 4 — Bentuk Akhir:**

$$Z_S(\sigma_S) = \sigma_S^{T V d} \int \exp\!\left(-\frac{L_S(V)}{2}\right) dV = \sigma_S^{T V d} \cdot Z_S(1)$$

Karena $\sigma_S^{T V d} = (\sigma_S^2)^{T V d / 2}$, diperoleh:

$$Z_S(\sigma_S) \propto (\sigma_S^2)^{\frac{T V d}{2}}$$

**Negatif Log Prior:**

$$-\ln p_S = \frac{L_S}{2\sigma_S^2} + \underbrace{\frac{T V d}{2} \ln \sigma_S^2}_{= T V d \ln \sigma_S} + \text{konstan}$$

Jadi faktor T·V·d pada suku log σS berasal langsung dari jumlah dimensi N = T·V·d dalam integral fungsi partisi.

---

## B.15 — Alternatif Reparameterisasi

**Pertanyaan:** Selain s = log σ², adakah transformasi lain yang menjamin σ > 0? Bandingkan kelebihan dan kekurangan masing-masing.

**Jawaban:**

Ada beberapa transformasi yang menjamin σ > 0:

**1. Softplus (σ = ln(1 + eʳ))**

- Parameter bebas: r ∈ ℝ.
- Transformasi: σ² = ln(1 + eʳ).
- Gradien: ∂σ²/∂r = eʳ/(1 + eʳ) = sigmoid(r) ∈ (0, 1).
- Kelebihan: Lebih smooth di sekitar 0; gradien tidak meledak untuk σ → 0.
- Kekurangan: Asymptot linear untuk r besar → skala tidak eksponensial; inversi tidak closed-form; komputasi lebih mahal.

**2. Eksponensial (σ² = eˢ) — s = ln σ² ✅ (digunakan)**

- Parameter bebas: s ∈ ℝ.
- Gradien: ∂σ²/∂s = σ² — gradien besar saat σ² besar, kecil saat σ² kecil.
- Kelebihan: Interpretasi langsung (ln-variance); inversi trivial; derivasi sederhana; suku regularisasi (k/2)s linear.
- Kekurangan: Gradien tak-terbatas untuk σ → 0 (tapi dalam praktik σ tidak pernah → 0 karena suku log σ mencegahnya).

**3. Kuadrat (σ = a²)**

- Parameter bebas: a ∈ ℝ.
- Transformasi: σ = a².
- Gradien: ∂J/∂a = (∂J/∂σ)(2a).
- Kelebihan: Sederhana secara komputasi.
- Kekurangan: Non-bijective (a dan −a menghasilkan σ sama); kurvatur tidak seragam; gradien menghilang saat a → 0.

**4. Inverse-link (precision) — τ = 1/σ²**

- Parameter bebas: τ > 0 (precision).
- Transformasi: J = (τ/2)L − (k/2)ln τ.
- Kelebihan: Bentuk linear dalam τ; interpretasi sebagai presisi.
- Kekurangan: Tetap harus memastikan τ > 0; memerlukan transformasi lain jika τ dioptimasi bebas.

**Perbandingan:**

| Metode | Domain | Gradien stabil | Interpretasi | Kompleksitas |
|--------|--------|---------------|--------------|-------------|
| **s = ln σ²** (dipilih) | ℝ | ✓ | Mudah | Rendah |
| Softplus | ℝ | ✓✓ | Sedang | Sedang |
| σ = a² | ℝ | ✗ (vanishing) | Mudah | Rendah |
| τ = 1/σ² | ℝ⁺ | ✓ | Mudah (precision) | Rendah |

**Alasan Pemilihan s = ln σ² dalam Skripsi:**

1. **Konsistensi dengan literatur** — Kendall et al. (2018) menggunakan s = ln σ².
2. **Kemudahan derivasi** — suku (k/2)s linear, memudahkan interpretasi gradien.
3. **Hubungan langsung dengan bobot** — bobot efektif w = 1/(2σ²) = ½exp(−s), interpretasi intuitif: s besar → ketidakpastian tinggi → bobot kecil.

---

## B.16 — Bertahap vs Bersama

**Pertanyaan:** Lebih baik estimasi θ dan σ bersama dalam satu loop, atau bergantian (block-coordinate descent)? Jelaskan pertimbangannya.

**Jawaban:**

**Dua Strategi:**

1. **Bersama (Joint — JMAP):** θ dan σ diperbarui dalam loop yang sama, setiap iterasi memperbarui keduanya secara berurutan.
2. **Bergantian (Block-Coordinate Descent — BCD):** Iterasi besar: optimasi θ hingga konvergen dengan σ tetap, lalu optimasi σ dengan θ tetap, ulangi.

**Perbandingan:**

| Aspek | Bersama (JMAP) | Bergantian (BCD) |
|-------|----------------|-------------------|
| **Konvergensi** | Satu fase, konvergen ke local optimum bersama | Dua fase; berpotensi osilasi antar siklus |
| **Biaya per iterasi** | Lebih murah — σ update sekali per step | Lebih mahal — perlu konvergensi penuh θ setiap siklus σ |
| **Stabilitas** | Sensitif terhadap learning rate σ | Lebih stabil karena σ diestimasi pada θ (hampir) optimal |
| **Teori konvergensi** | Landasan lebih lemah (parameter bersama tidak konveks) | Konvergensi terjamin untuk fungsi yang cukup smooth |
| **Efisiensi komputasi** | Satu pelatihan → langsung dapat σ | Pelatihan berulang (inner loop) |
| **Implementasi** | Lebih sederhana (satu loop) | Lebih kompleks (kriteria konvergensi inner loop) |
| **Risiko** | σ bisa konvergen premature ke nilai suboptimal | σ bisa berubah drastis antar siklus |

**Pertimbangan Kunci untuk W2VPred:**

- **Jumlah parameter:** U memiliki ~TVd = jutaan parameter; σ hanya 3 skalar. Overhead update σ per step sangat kecil.
- **Skala gradien:** Embedding diperbarui per-domain dengan Adam terpisah; σ mengakumulasi gradien dari semua domain. Struktur ini secara natural adalah **hybrid** — embedding diperbarui bersama (joint), sementara σ bisa dilihat sebagai koordinat terpisah.
- **Praktik saat ini:** Skema yang digunakan adalah bersama dalam satu loop: (1) untuk setiap domain, forward + backward, (2) akumulasi gradien σ, (3) update embedding per domain, (4) update σ global. Ini adalah JMAP dengan satu langkah BCD mini per iterasi.

**Rekomendasi:** Untuk W2VPred dengan dimensi kecil σ (3 parameter), **estimation bersama** lebih efisien dan praktis. BCD hanya disarankan jika σ sulit konvergen dan menyebabkan osilasi — yang tidak terjadi dalam eksperimen skripsi ini (konvergensi σ monotonik).

---

## B.17 — Bukti Formal Homogenitas

**Pertanyaan:** Buktikan bahwa jika LS(cU) = c²LS(U), maka ZS sebanding dengan (σS²)^(N/2) dengan N = TVd. Gunakan perubahan variabel U' = U/σS.

**Jawaban:**

**Diketahui:**
- LS: ℝ^{T V d} → ℝ memenuhi LS(cU) = c² LS(U) untuk sembarang c > 0 (homogen derajat dua).
- N = T·V·d adalah dimensi ruang parameter.
- Fungsi partisi: $Z_S(\sigma_S) = \int_{\mathbb{R}^N} \exp\!\left(-\frac{L_S(U)}{2\sigma_S^2}\right) dU$.

**Akan dibuktikan:** $Z_S(\sigma_S) = \sigma_S^N \cdot Z_S(1)$.

**Bukti:**

**Langkah 1 — Definisikan perubahan variabel.** Misalkan V = U/σS, atau secara ekuivalen U = σS V. Pemetaan φ: ℝ^N → ℝ^N, φ(V) = σS V, adalah difeomorfisma linear dengan matriks Jacobian J_φ = σS I_N (matriks identitas N×N dikalikan σS).

**Langkah 2 — Hitung Jacobian.** Determinan Jacobian:

$$\det(J_\varphi) = \det(\sigma_S I_N) = \sigma_S^N$$

Maka elemen volume berubah sebagai:

$$dU = |\det(J_\varphi)| \, dV = \sigma_S^N \, dV$$

**Langkah 3 — Substitusi ke integral.** Ganti U = σS V dalam eksponensial:

$$\exp\!\left(-\frac{L_S(U)}{2\sigma_S^2}\right) = \exp\!\left(-\frac{L_S(\sigma_S V)}{2\sigma_S^2}\right)$$

Gunakan homogenitas LS(σS V) = σS² LS(V):

$$= \exp\!\left(-\frac{\sigma_S^2 L_S(V)}{2\sigma_S^2}\right) = \exp\!\left(-\frac{L_S(V)}{2}\right)$$

**Langkah 4 — Integral dalam V.** Substitusi dU = σS^N dV dan integran yang sudah tidak bergantung σS:

$$\begin{aligned}
Z_S(\sigma_S) &= \int_{\mathbb{R}^N} \exp\!\left(-\frac{L_S(U)}{2\sigma_S^2}\right) dU \\[4pt]
&= \int_{\mathbb{R}^N} \exp\!\left(-\frac{L_S(V)}{2}\right) \cdot \sigma_S^N \, dV \\[4pt]
&= \sigma_S^N \int_{\mathbb{R}^N} \exp\!\left(-\frac{L_S(V)}{2}\right) dV
\end{aligned}$$

**Langkah 5 — Definisi ZS(1).** Integral di atas adalah ZS(1), yaitu fungsi partisi saat σS = 1:

$$Z_S(1) = \int_{\mathbb{R}^N} \exp\!\left(-\frac{L_S(V)}{2}\right) dV$$

Maka:

$$Z_S(\sigma_S) = \sigma_S^N \cdot Z_S(1)$$

Karena N = T V d dan σS^N = (σS²)^(N/2), terbukti bahwa ZS ∝ (σS²)^(TVd/2). ∎

**Implikasi:** Sifat ini memungkinkan fungsi partisi Gibbs yang umumnya intractable (integral dimensi tinggi) difaktorkan menjadi konstanta ZS(1) yang tidak perlu dihitung dikalikan faktor skala σS^N yang dapat diturunkan secara eksak.

---

## B.18 — Konstanta pada JF

**Pertanyaan:** Dalam derivasi JF, terdapat konstanta −(TV²/2)log(2πσF²). Dalam JMAP, apakah pengabaian ini tetap valid ketika σF² diestimasi?

**Jawaban:**

**Konstanta yang dimaksud:**

$$-\ln p(Y \mid U, \sigma_F) = \frac{L_F}{2\sigma_F^2} + \frac{T V^2}{2} \ln(2\pi\sigma_F^2)$$

$$= \frac{L_F}{2\sigma_F^2} + T V^2 \ln \sigma_F + \frac{T V^2}{2} \ln(2\pi)$$

Suku $\frac{T V^2}{2} \ln(2\pi)$ adalah konstanta yang tidak bergantung pada parameter mana pun (U, σF).

**Validitas Pengabaian:**

Ketika mengestimasi **U** (untuk σF tetap):

$$\frac{\partial}{\partial U}\left(\frac{T V^2}{2} \ln(2\pi)\right) = 0$$

✓ Valid — konstanta tidak memengaruhi gradien terhadap U.

Ketika mengestimasi **σF**:

$$\frac{\partial}{\partial \sigma_F}\left(\frac{T V^2}{2} \ln(2\pi)\right) = 0$$

✓ Valid — konstanta tidak bergantung pada σF.

**Amanat:** Suku $\ln(2\pi)$ adalah konstanta murni yang tidak bergantung pada parameter yang dioptimasi. Dalam fungsi objektif JMAP (yang diminimalkan), menambah atau menghilangkan konstanta tidak mengubah titik optimum. Dengan demikian, pengabaian tetap valid.

**Catatan Penting:** Berbeda dengan suku $(T V^2) \ln \sigma_F$ yang berasal dari $\frac{T V^2}{2} \ln \sigma_F^2$ — suku ini bergantung pada σF dan **harus dipertahankan** karena memengaruhi gradien terhadap σF. Hanya bagian $\ln(2\pi)$ yang diabaikan.

---

## B.19 — Interpretasi Geometris Reparameterisasi

**Pertanyaan:** Gambarkan permukaan fungsi objektif sebelum dan sesudah reparameterisasi. Bagaimana transformasi mengubah kurvatur?

**Jawaban:**

**Sebelum Reparameterisasi (σ²).** Perhatikan komponen tunggal dari objektif dalam parameter σ²:

$$J(\sigma^2) = \frac{L}{2\sigma^2} + \frac{n}{2} \ln \sigma^2$$

Plot J terhadap σ² ∈ (0, ∞):
- σ² → 0⁺: L/(2σ²) → +∞ (dominasi suku loss), J → ∞
- σ² → ∞: (n/2) ln σ² → ∞ (dominasi suku log), J → ∞
- Minimum: σ²* = L/n (dari ∂J/∂σ² = 0)
- **Kurvatur:** Sangat asimetris — curam di kiri (σ² kecil), landai di kanan (σ² besar). Learning rate yang cocok untuk σ² kecil terlalu besar untuk σ² besar dan sebaliknya.

**Sesudah Reparameterisasi (s = ln σ²):**

$$J(s) = \frac{1}{2} e^{-s} L + \frac{n}{2} s$$

Plot J terhadap s ∈ ℝ:
- s → −∞: ½e^{-s}L → ∞, J → ∞
- s → +∞: (n/2)s → ∞, J → ∞
- Minimum: s* = ln(L/n) (dari ∂J/∂s = 0)
- **Kurvatur:** Hampir simetris di sekitar minimum. Bentuk: ½Le^{-s} + (n/2)s — fungsi konveks yang smooth.

**Perubahan Kurvatur:**

| Aspek | σ²-space | s-space |
|-------|----------|---------|
| Bentuk permukaan | Curam-asimetris (asymmetric bowl) | Simetris-checkmark (convex) |
| Kondisi numerik | Ill-conditioned (rasio eigenval besar) | Well-conditioned |
| Gradien dominan | Dominasi suku L/(2σ⁴) saat σ kecil | Seragam — ±½(n − e^{-s}L) |
| Hessian | ∂²J/∂(σ²)² = L/σ⁶ − n/(2σ⁴) — bervariasi | ∂²J/∂s² = ½e^{-s}L > 0 — selalu positif |
| Optimal learning rate | Harus diskalakan inverse terhadap σ² | Dapat seragam |

**Visualisasi Deskriptif:**

```
J(σ²)                    J(s)
  |                       |
  |\                      |\
  | \                     | \
  |  \                    |  \______
  |   \___                |         \___
  |       \___            |            \__
  +--------\---→ σ²       +----------------→ s
  0         ↑              s* (s = ln σ²)
         σ²* = L/n
```

Permukaan J(σ²) memiliki kurvatur yang **sangat bergantung pada nilai σ²** — curam untuk σ² < σ²* dan landai untuk σ² > σ²*. Sebaliknya, J(s) memiliki kurvatur yang **relatif seragam** di seluruh domain s ∈ ℝ.

**Implikasi Praktis:** Transformasi s = ln σ² mengubah masalah optimasi dari yang secara numerik ill-conditioned menjadi well-conditioned, sehingga Adam (atau SGD dengan momentum) dapat menggunakan learning rate yang sama tanpa perlu penjadwalan adaptif per-parameter.

---

## B.20 — Hubungan JMAP dengan Empirical Bayes

**Pertanyaan:** Jelaskan persamaan dan perbedaan JMAP dengan metode Empirical Bayes standar dalam konteks pemilihan hyperparameter σ.

**Jawaban:**

**Empirical Bayes (Type-2 MLE).** Empirical Bayes mengestimasi hiperparameter σ dengan memaksimalkan *marginal likelihood* (evidence):

$$\hat{\sigma}_{EB} = \arg\max_\sigma \, P(Y \mid \sigma) = \arg\max_\sigma \int P(Y \mid U, \sigma_F) \, P(U \mid \sigma_S, \sigma_{RD}) \, dU$$

Parameter U diintegralkan (dimarginalisasi). Integral ini pada umumnya **intractable** untuk model non-linear seperti W2VPred.

**JMAP (Joint MAP).** JMAP mengestimasi U dan σ secara simultan tanpa marginalisasi:

$$(\hat{U}, \hat{\sigma})_{JMAP} = \arg\max_{U, \sigma} \, P(Y \mid U, \sigma_F) \, P(U \mid \sigma_S, \sigma_{RD})$$

**Persamaan:**

1. **Tujuan sama** — keduanya bertujuan mengestimasi σ dari data.
2. **Hasil asimptotik sama** — untuk jumlah data n → ∞, JMAP dan Empirical Bayes konvergen ke nilai σ yang sama (Laplace approximation: suku koreksi O(log n) dapat diabaikan terhadap O(n)).
3. **Prior untuk σ** — keduanya memerlukan hyperprior P(σ) (atau mengabaikannya dengan improper prior).

**Perbedaan:**

| Aspek | Empirical Bayes (Type-2 MLE) | JMAP |
|-------|------------------------------|------|
| Estimasi U | Dimarginalisasi (integral) | Diestimasi simultan |
| Kompleksitas | High — integral dimensi tinggi | Lower — optimasi gradien |
| Akurasi (n kecil) | Lebih akurat (memperhitungkan ketidakpastian U) | Kurang akurat (mengabaikan ketidakpastian U) |
| Perlakuan U | Nuisance parameter | Parameter utama |
| Metode solusi | Approksimasi (Laplace, VI, MCMC) | Gradient-based optimization |
| Traktabilitas | Tidak traktabel untuk W2VPred (non-linear, dimensi tinggi) | Traktabel (autograd) |
| Risiko | Overconfident pada σ (karena U dianggap pasti) | Underestimate ketidakpastian U |

**Mengapa JMAP Dipilih untuk W2VPred:**

1. **Intraktabilitas integral** — model PPMI non-linear (U_t U_tᵀ) dan dimensi N = TVd jutaan membuat marginalisasi tidak feasible.
2. **Efisiensi komputasi** — JMAP hanya memerlukan forward-backward pass seperti pelatihan biasa.
3. **Justifikasi asimptotik** — dataset WikiFoS dengan ~12 domain dan puluhan juta pasangan kata-konteks memberikan n besar, sehingga JMAP ≈ Empirical Bayes.
4. **Implementasi langsung** — PyTorch autograd untuk U dan σ dalam satu framework.

**Ilustrasi Matematis Hubungan:**

$$\ln P(Y \mid \sigma) = \underbrace{\ln P(Y \mid \hat{U}_{MAP}, \sigma) + \ln P(\hat{U}_{MAP} \mid \sigma)}_{\text{JMAP objective}} + \underbrace{\frac{1}{2} \ln |H| + \text{const}}_{\text{O}(\log n) \text{ koreksi}}$$

di mana H adalah matriks Hessian dari log-posterior. Suku koreksi $\frac{1}{2}\ln|H|$ tumbuh sebagai O(log n), sementara dua suku pertama tumbuh sebagai O(n). Untuk n besar, suku koreksi dapat diabaikan, membuktikan ekivalensi asimptotik JMAP dan Empirical Bayes.

---

> *Dokumen ini disusun untuk persiapan sidang skripsi.*
> *Kategori B — Formulasi Matematis & Turunan — 20 pertanyaan.*
> *Acuan utama: wiki/concepts/major/Formulasi_Probabilistik_W2VPred.md, JMAP.md, Strategi_Optimasi_JMAP.md*
