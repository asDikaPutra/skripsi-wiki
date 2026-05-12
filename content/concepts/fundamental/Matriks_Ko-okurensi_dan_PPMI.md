# Matriks Ko-okurensi dan PPMI

Matriks ko-okurensi dan *Positive Point-wise Mutual Information* (PPMI) merupakan fondasi utama dalam representasi kata berbasis distribusional. Dalam model W2VPred, matriks PPMI berfungsi sebagai target observasi ($\mathbf{Y}_t$) yang akan direkonstruksi oleh parameter embedding.

## 1. Matriks Ko-okurensi (*Co-occurrence Matrix*)

Matriks ko-okurensi adalah matriks persegi berukuran $V \times V$ (di mana $V$ adalah ukuran kosakata) yang menyimpan frekuensi seberapa sering pasangan kata muncul bersamaan dalam jarak tertentu.

### Tahapan Pembentukan:
1.  **Definisi Jendela Konteks (*Context Window*)**: Menentukan jarak maksimum ($L$) antara kata target ($w$) dan kata konteks ($c$).
2.  **Sliding Window**: Menggeser jendela di seluruh korpus teks. Jika kata $c$ muncul dalam jarak $L$ dari kata $w$, maka nilai pada sel $(w, c)$ dalam matriks ditingkatkan satu.
3.  **Simetri**: Biasanya matriks ini bersifat simetris karena jika $c$ adalah konteks bagi $w$, maka $w$ juga merupakan konteks bagi $c$.

**Masalah**: Frekuensi mentah sangat bias terhadap kata-kata yang sangat umum (seperti "dan", "yang", "di") yang muncul di hampir semua konteks namun tidak memiliki makna semantik yang kuat.

## 2. *Point-wise Mutual Information* (PMI)

PMI diperkenalkan untuk mengatasi bias frekuensi mentah dengan mengukur sejauh mana kemunculan bersama dua kata melebihi peluang kemunculan acaknya.

### Rumus Matematis:
$$PMI(w, c) = \log_2 \frac{P(w, c)}{P(w)P(c)}$$

Di mana:
*   $P(w, c) = \frac{count(w, c)}{N}$ : Peluang kemunculan bersama.
*   $P(w) = \frac{count(w)}{N}$ : Peluang marginal kata target.
*   $P(c) = \frac{count(c)}{N}$ : Peluang marginal kata konteks.
*   $N$ : Total seluruh pasangan ko-okurensi dalam korpus.

**Interpretasi**: 
*   **Positif**: Kata-kata tersebut memiliki asosiasi semantik yang kuat.
*   **Nol**: Kemunculan bersama hanya bersifat acak.
*   **Negatif**: Kata-kata tersebut jarang muncul bersamaan (seringkali tidak informatif).

## 3. *Positive Point-wise Mutual Information* (PPMI)

Dalam praktiknya, nilai PMI negatif sulit diinterpretasikan karena kurangnya data (pasangan kata yang tidak pernah muncul bersamaan akan menghasilkan $-\infty$). PPMI mengatasi hal ini dengan menetapkan batas bawah nol.

### Rumus Matematis:
$$PPMI(w, c) = \max(0, PMI(w, c))$$

Hasil akhirnya adalah sebuah matriks yang "bersih", di mana nilai-nilai yang tinggi menunjukkan hubungan semantik yang signifikan, dan nilai nol menunjukkan tidak adanya asosiasi yang kuat.

## 4. Contoh Perhitungan Sederhana

Misalkan kita memiliki korpus mini dengan 2 kalimat dan ukuran jendela (*window size*) = 1:
1. "data sains menarik"
2. "data sains kompleks"

**Kosakata**: {data, sains, menarik, kompleks}

### Langkah 1: Matriks Ko-okurensi
Pasangan yang muncul (simetris):
*   (data, sains): 2 kali
*   (sains, menarik): 1 kali
*   (sains, kompleks): 1 kali

| Kata | data | sains | menarik | kompleks | **Total (f)** |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **data** | 0 | 2 | 0 | 0 | **2** |
| **sains** | 2 | 0 | 1 | 1 | **4** |
| **menarik** | 0 | 1 | 0 | 0 | **1** |
| **kompleks** | 0 | 1 | 0 | 0 | **1** |
| **Total (N)** | | | | | **8** |

### Langkah 2: Menghitung PMI (data, sains)
*   $P(data, sains) = 2 / 8 = 0,25$
*   $P(data) = 2 / 8 = 0,25$
*   $P(sains) = 4 / 8 = 0,5$

$$PMI(data, sains) = \log_2 \frac{0,25}{0,25 \times 0,5} = \log_2 \frac{0,25}{0,125} = \log_2(2) = 1,0$$

### Langkah 3: Menghitung PMI (data, menarik)
Karena (data, menarik) tidak pernah muncul bersamaan dalam jendela:
*   $P(data, menarik) = 0$
*   $PMI(data, menarik) = \log_2(0) = -\infty$
*   $PPMI(data, menarik) = \max(0, -\infty) = 0$

## 5. Peran dalam Model W2VPred

Dalam model W2VPred, kita memiliki matriks PPMI $\mathbf{Y}_t$ untuk setiap domain $t$. Model mencoba mencari matriks laten $\mathbf{U}_t$ sedemikian rupa sehingga:
$$\mathbf{Y}_t \approx \mathbf{U}_t \mathbf{U}_t^\top$$
Proses pencarian $\mathbf{U}_t$ inilah yang disebut sebagai faktorisasi matriks, di mana galat rekonstruksinya dimodelkan menggunakan distribusi Gaussian dalam kerangka kerja MAP.

## 6. Hubungan Antar Konsep
- Digunakan dalam Model: [[models/W2VPred|W2VPred]]
- Asumsi Galat Rekonstruksi: [[concepts/fundamental/Gaussian_dan_iid|Gaussian dan i.i.d.]]

---
**Referensi**:
*   Jurafsky, D., & Martin, J. H. (2024). *Speech and Language Processing*.
*   Levy, O., & Goldberg, Y. (2014). *Neural word embedding as implicit matrix factorization*.
