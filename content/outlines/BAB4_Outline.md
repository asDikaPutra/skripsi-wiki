# Outline BAB 4: Hasil dan Pembahasan

Berdasarkan metodologi dan skenario eksperimen yang telah dirancang pada Bab 3, bab ini memaparkan hasil evaluasi model W2VPred-MAP dibandingkan dengan W2VPred *baseline*.

---

## ✅ Rencana Penulisan Bab 4
### 4.1 Analisis Efisiensi Pelatihan dan Dinamika Konvergensi
- [x] **4.1.1 Hasil *Grid Search Baseline* dan Komparasi Beban Komputasi**: Pemaparan perolehan parameter statis optimal ($\lambda, \mu$) dari *baseline* beserta analisis beban waktu/komputasi *grid search*, sebagai perbandingan langsung dengan efisiensi W2VPred-MAP.
- [x] **4.1.2 Dinamika Penurunan Komponen *Loss***: Analisis kurva *loss* ternormalisasi ($L_F$, $L_S$, $L_{RD}$) untuk melihat dominasi komponen pada *baseline* dan perbandingannya dengan W2VPred-MAP.
- [x] **4.1.3 Kalibrasi Ketidakpastian Otomatis**: Analisis evolusi parameter adaptif $\sigma_F, \sigma_S, \sigma_{RD}$ per *epoch* pada W2VPred-MAP. Dengan penjelasan trade-off. 
- [x] **4.1.4 Keseimbangan Rasio Skala *Loss***: Perbandingan stabilitas rasio $L_F : L_S : L_{RD}$ antara kedua model selama pelatihan.

### 4.2 Prediksi Struktur Semantik Lintas Domain
- [ ] **4.2.1 Visualisasi Matriks Afinitas**: Perbandingan *heatmap* matriks afinitas $W$ hasil prediksi model dengan matriks klaster *ground-truth* $W^*$.
- [ ] **4.2.2 Evaluasi Kuantitatif Struktur**: Analisis performa pemulihan struktur hierarkis WikiFoS berdasarkan metrik *Recall@k* ($k=1,2,3$).
- [ ] **4.2.3 Konsistensi Peringkat Global**: Analisis nilai korelasi *Spearman* ($\rho$) antara hasil prediksi model dan *ground-truth*. (ini tidak dilakukan)

### 4.3 Evaluasi Kualitas Representasi Ruang Vektor (Pengujian Analogi)
- [ ] **4.3.1 Pengujian Relasi Analogi Global**: Analisis performa *Acc@k* ($k=1,5,10$) menggunakan representasi rata-rata global ($\bar{U}$).
- [ ] **4.3.2 Pengujian Relasi Analogi Per Domain**: Perbandingan performa *Acc@k* untuk setiap 16 domain independen secara spesifik pada WikiFoS.
- [ ] **4.3.3 Dampak Pembobotan Adaptif terhadap Retensi Semantik**: Diskusi komprehensif mengapa W2VPred-MAP mampu mengungguli (atau setara dengan) *baseline* dalam menangkap analogi linguistik.

### 4.4 Evolusi Similaritas Semantik Lintas Domain
- [ ] **4.4.1 Seleksi Kata Polisemik Target**: Penjelasan ringkas mengenai hasil seleksi heuristik kata kandidat (seperti *cell*, *model*, *power*, *field*, *bond*).
- [ ] **4.4.2 Diferensiasi Konteks Semantik (*Baseline* vs MAP)**: Analisis visual grafik *cosine similarity* membandingkan dua kelompok konteks kata referensi di sepanjang 16 domain.
- [ ] **4.4.3 Analisis Kualitatif**: Interpretasi terhadap kesenjangan vertikal (kontras makna) dan variasi horizontal (adaptasi domain spesifik) dari representasi vektor W2VPred-MAP.

---

## 📋 Kebutuhan Data & Visualisasi (*Placeholder*)

Untuk mendukung argumen empiris pada draf Bab 4, berikut adalah daftar tabel, grafik, dan gambar yang perlu disiapkan (*generate* dari kode eksperimen):

### Kebutuhan Sub-bab 4.1 (Efisiensi & Konvergensi)
1. **Tabel Perbandingan Komputasi**:
   | Model | Waktu *Grid Search* | Waktu Pelatihan | Total Waktu | Status |
   | :--- | :---: | :---: | :---: | :---: |
   | W2VPred *Baseline* | ... jam | ... jam | ... jam | ⏳ Menunggu data |
   | W2VPred-MAP | 0 jam | ... jam | ... jam | ⏳ Menunggu data |
2. **Grafik 1**: Kurva *Total Loss* vs *Epoch* (*Baseline* vs MAP).
3. **Grafik 2**: Kurva *Loss* Ternormalisasi ($\tilde{L}_F, \tilde{L}_S, \tilde{L}_{RD}$) vs *Epoch*.
4. **Grafik 3**: Evolusi Parameter Adaptif ($\sigma_F, \sigma_S, \sigma_{RD}$) vs *Epoch*.
5. **Grafik 4**: Rasio Skala *Loss* ($L_F : L_S : L_{RD}$) vs *Epoch* (*Baseline* vs MAP).

### Kebutuhan Sub-bab 4.2 (Prediksi Struktur)
1. **Gambar 1**: *Heatmap* berjejer (Kiri: W *Baseline*, Tengah: W MAP, Kanan: W* *Ground-Truth*).
2. **Tabel Evaluasi Struktur**:
   | Metrik | W2VPred *Baseline* | W2VPred-MAP | Status |
   | :--- | :---: | :---: | :---: |
   | *Recall@1* | ... | ... | ⏳ Menunggu data |
   | *Recall@2* | ... | ... | ⏳ Menunggu data |
   | *Recall@3* | ... | ... | ⏳ Menunggu data |
   | Korelasi *Spearman* ($\rho$) | ... | ... | ⏳ Menunggu data |

### Kebutuhan Sub-bab 4.3 (Kualitas Representasi / Analogi)
1. **Tabel Analogi Global (Rata-rata $\bar{U}$)**:
   | Metrik | W2VPred *Baseline* | W2VPred-MAP | Status |
   | :--- | :---: | :---: | :---: |
   | *Acc@1* | ... | ... | ⏳ Menunggu data |
   | *Acc@5* | ... | ... | ⏳ Menunggu data |
   | *Acc@10* | ... | ... | ⏳ Menunggu data |
2. **Tabel Analogi Per Domain**: (Tabel besar berisi 16 baris nama domain WikiFoS dan kolom *Acc@1*, *Acc@5*, *Acc@10* untuk *Baseline* dan MAP).

### Kebutuhan Sub-bab 4.4 (Evolusi Semantik)
1. **Tabel Seleksi Kata (Skor $Q$)**: Menampilkan kata kandidat (*cell, model, power*, dll.) beserta skor variasi semantiknya.
2. **Grafik 5**: *Line chart Cosine Similarity* (Sumbu X: 16 Domain, Sumbu Y: *Cosine Similarity*). Terdapat 2 garis (Kelompok konteks 1 dan 2). Disajikan berdampingan (*Baseline* vs MAP).

---

## 📊 Ringkasan Status

| Sub-bab                                       | Status   |
| :-------------------------------------------- | :------- |
| **4.1 Analisis Efisiensi & Konvergensi**      | 🔴 Belum |
| **4.2 Prediksi Struktur Semantik**            | 🔴 Belum |
| **4.3 Evaluasi Kualitas Representasi**        | 🔴 Belum |
| **4.4 Evolusi Similaritas Semantik**          | 🔴 Belum |

catatan:
1. Pastikan setiap klaim terkait keunggulan model W2VPred-MAP didukung langsung oleh data empiris dari hasil eksperimen (sesuai *workflow research-paper-writing*).
2. Terapkan prinsip satu paragraf untuk satu pesan (*one message per paragraph*) dan nyatakan tesis kalimat di awal paragraf saat mulai menyusun *draft*.
3. Hasil evaluasi tidak sekadar dilaporkan, namun dikaitkan kembali ke hipotesis penelitian (yaitu pembobotan adaptif MAP dapat menyeimbangkan prior struktural dan *fidelity* tanpa *grid search*).
