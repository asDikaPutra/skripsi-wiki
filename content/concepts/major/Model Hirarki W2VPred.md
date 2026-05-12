Berdasarkan gambar rujukan dan formulasi probabilistik dari W2VPred-MAP pada dokumen skripsi tersebut, kita dapat menyusun ulang model hierarki Bayesian ke dalam tiga persamaan distribusi bersyarat (Hierarchical Bayesian Formulation) sebagai berikut:

Dalam konteks W2VPred-MAP:

- $\boldsymbol{x}$ (Data) diwakili oleh matriks observasi PPMI $\mathcal{Y}$.
    
- $\boldsymbol{\theta}$ (Parameter) diwakili oleh matriks _embedding_ $U$.
    
- $\boldsymbol{\phi}$ (Hiperparameter) diwakili oleh himpunan parameter variansi $\sigma = (\sigma_F, \sigma_S, \sigma_{RD})$.
    

Berikut adalah perumusannya:

### 1. Level Data / Likelihood (Persamaan Pertama)

$p(\mathcal{Y}|U, \sigma_F) = \prod_{t=1}^{T} p(Y_t | U_t, \sigma_F) = \prod_{t=1}^{T} \prod_{i=1}^{V} \prod_{j=1}^{V} \mathcal{N}\left(Y_{t,ij} \mid [U_t U_t^\top]_{ij}, \sigma_F^2\right)$

_(Keterangan: Distribusi probabilitas observasi $\mathcal{Y}$ diberikan parameter $U$ dan hiperparameter $\sigma_F$. Diasumsikan setiap observasi saling bebas (i.i.d), sehingga probabilitas gabungannya adalah hasil kali dari fungsi densitas Gaussian pada seluruh observasi di tiap domain $t$.)_

### 2. Level Parameter / Prior (Persamaan Kedua)

$p(U|W, \sigma_S, \sigma_{RD}) = p_S(U|W, \sigma_S) \cdot p_{RD}(U|\sigma_{RD})$

$p(U|W, \sigma_S, \sigma_{RD}) \propto \exp\left(-\frac{L_S(U)}{2\sigma_S^2}\right) \cdot \exp\left(-\frac{L_{RD}(U)}{2\sigma_{RD}^2}\right) = \exp\left(-\frac{L_S(U)}{2\sigma_S^2} - \frac{L_{RD}(U)}{2\sigma_{RD}^2}\right)$

_(Keterangan: Distribusi prior gabungan untuk matriks embedding $U$. Berbeda dengan formulasi gambar Anda yang mengasumsikan parameter $U_t$ saling bebas, pada model ini parameter $U_t$ antar domain **tidak saling bebas**. Ketergantungan struktural antar domain diikat oleh fungsi energi $L_S$ (berbobot $W$) dan $L_{RD}$ yang dimodelkan melalui Distribusi Gibbs. Oleh karena itu, prior ini tidak dapat difaktorisasi (dipecah menjadi perkalian) per domain $t$.)_

### 3. Level Hiperparameter / Hyperprior (Persamaan Ketiga)

$p(\sigma) = p(\sigma_F) \cdot p(\sigma_S) \cdot p(\sigma_{RD}) \propto 1$

_(Keterangan: Distribusi hyperprior untuk himpunan parameter skala $\sigma = (\sigma_F, \sigma_S, \sigma_{RD})$. Dalam pendekatan JMAP yang digunakan, hyperprior ini diasumsikan sebagai _non-informative prior_ (distribusi seragam), sehingga probabilitasnya dianggap konstan dan tidak mempengaruhi lanskap optimasi gradien. Ini memungkinkan nilai $\sigma$ sepenuhnya ditentukan oleh data.)_

---

**Distribusi Posterior Gabungan (Joint Posterior)**

Sesuai aturan Teorema Bayes, dari ketiga susunan hierarki di atas, kita akan mendapatkan distribusi posterior gabungannya (yang nantinya akan dimaksimalkan melalui JMAP) sebagai berikut:

$p(U, \sigma | \mathcal{Y}) \propto p(\mathcal{Y}|U, \sigma_F) \cdot p(U|W, \sigma_S, \sigma_{RD}) \cdot p(\sigma)$