# Outline BAB 2: Tinjauan Pustaka dan Landasan Teori

Berdasarkan fokus penelitian pada optimasi probabilistik W2VPred dan kebutuhan matematis di Bab 3.

---

## ✅ Progres Penulisan Bab 2
### 2.1 Pemrosesan Bahasa Alami (*Natural Language Processing*)
- [x] **2.1.1 Definisi dan Ruang Lingkup**: Menjelaskan NLP sebagai cabang AI yang memungkinkan mesin memahami bahasa manusia.
- [x] **2.1.2 Representasi Teks**: Pendekatan dasar mengubah teks menjadi bentuk matematis yang dapat diproses komputer.

### 2.2 Representasi Vektor Kata (*Word Embedding*)
- [x] **2.2.1 Konsep Dasar**: Transformasi teks ke ruang vektor kontinu yang padat (*dense*).
- [x] **2.2.2 Matriks Ko-okurensi dan PPMI**: Menjelaskan matriks ko-okurensi dan transformasi *Positive Point-wise Mutual Information* (PPMI).
- [x] **2.2.3 Pendekatan Neural (Word2Vec)**: Arsitektur Skip-gram dan CBOW sebagai pionir embedding modern.

### 2.3 *Word Embedding* Domain Spesifik (W2VPred)
- [x] **2.3.1 Fenomena Pergeseran Semantik**: Mengapa embedding umum gagal di domain spesifik dan perlunya penyesuaian.
- [x] **2.3.2 Arsitektur W2VPred**: Penjelasan model yang menggabungkan fidelitas data dan batasan struktural ($L_F + \lambda L_S + \mu L_{RD}$).

### 2.4 **Aljabar Linear dan Kalkulus Multivariat**
- [x] **2.4.1 Aljabar Linear untuk Ruang Vektor**: Membahas operasi matriks (*inner product* $\mathbf{U}_t \mathbf{U}_t^\top$), **Norma Frobenius** ($\| \cdot \|_F$), serta dasar matematis **Cosine Similarity** sebagai normalisasi produk titik.
- [x] **2.4.2 Kalkulus Integral Multivariabel**: Teknik komputasi integral lipat, termasuk **substitusi variabel** dan peran determinan **Jacobian multidimensi** ($dU = \sigma^n dV$) untuk menghitung elemen volume pada fungsi partisi konstan.
- [x] **2.4.3 Fungsi Homogen**: Konsep dasar homogenitas fungsi ($f(cU) = c^k f(U)$) dan pembuktian matematis kemunculan skalar kuadrat pada norma Frobenius sebagai landasan aljabar untuk penyederhanaan fungsi kompleks.

### 2.5 Distribusi Probabilitas
- [x] **2.5.1 Distribusi Normal (Gaussian)**: Asumsi galat rekonstruksi observasi PPMI.
- [x] **2.5.2 Distribusi Gibbs**: Transformasi fungsi *loss* menjadi distribusi peluang dan peran fungsi partisi.

### 2.6 *Maximum Likelihood Estimation* (MLE)
- [x] **2.6.1 Konsep Dasar MLE**: Prinsip pencarian parameter yang memaksimalkan *likelihood* data.
- [x] **2.6.2 Log-Likelihood dan NLL**: Transformasi ke bentuk logaritma untuk stabilitas numerik dan optimasi.

### 2.7 Inferensi Bayesian
- [x] **2.7.1 Dasar Inferensi Bayesian**: Penjelasan lengkap mulai dari pengertian dasar, **Teorema Bayes**, *prior*, *likelihood*, hingga *posterior*.
- [ ] **2.7.2 Model Bayesian Hirarki**: Penjelasan dasar model hirarkis (parameter dan hiperparameter) hingga strategi penyelesaian modelnya.
- [x] **2.7.3 *Empirical Bayes* (Type II MLE)**: Metode estimasi hiperparameter melalui *evidence approximation*.
- [x] **2.7.4 *Maximum A Posteriori* (MAP)**: Integrasi *prior* ke dalam estimasi parameter untuk mencegah *overfitting*.
- [x] **2.7.5 *Joint Maximum A Posteriori* (JMAP)**: Estimasi simultan parameter dan hiperparameter sebagai solusi pragmatis.

### 2.8 *Uncertainty-Weighted Loss* (Kendall et al.)
- [x] **2.8.1 Penyeimbangan *Multi-Task Loss***: Tantangan pada pencarian bobot optimal skala manual.
- [x] **2.8.2 Formula Uncertainty Weighting**: Perumusan adaptif menggunakan ketidakpastian homoskedastik ($\sigma$).
- [x] **2.8.3 Batasan Keabsahan Metode**: Mengapa metode ini murni membutuhkan asumsi *likelihood* dan tak bisa langsung dipakai pada fungsi heuristik/jarak.

### 2.9 Metode Optimasi Berbasis Gradien
- [x] **Gradient Descent dan Adam Optimizer**: Konsep dasar pembaruan parameter melalui arah negatif gradien untuk meminimalkan fungsi *loss*, dikembangkan menjadi optimasi adaptif Adam.

### 2.10 Evaluasi Kualitas *Embedding*
- [ ] **2.10.1 Evaluasi Intrinsik**: Uji kemiripan kata menggunakan **Cosine Similarity** dan evaluasi relasi analogi kata.
- [ ] **2.10.2 Evaluasi Ekstrinsik (Klasifikasi CNN)**: Dampak kualitas representasi pada tugas pemrosesan hilir (*downstream task*).

---

## 📊 Ringkasan Status

| Sub-bab                           | Status   |
| :-------------------------------- | :------- |
| **2.1 NLP**                       | 🟢 Sudah |
| **2.2 Word Embedding & PPMI**     | 🟢 Sudah |
| **2.3 W2VPred & Semantic Shift**  | 🟢 Sudah |
| **2.4 Landasan Matematis**        | 🟢 Sudah |
| **2.5 Distribusi Probabilitas**   | 🟢 Sudah |
| **2.6 MLE**                       | 🟢 Sudah |
| **2.7 Inferensi Bayesian**        | 🟡 Revisi|
| **2.8 Uncertainty Weighting**     | 🟢 Sudah |
| **2.9 Metode Optimasi**           | 🟢 Sudah |
| **2.10 Evaluasi Embedding**       | 🔴 Belum |
