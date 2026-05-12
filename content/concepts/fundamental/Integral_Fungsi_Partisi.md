# Integral Fungsi Partisi (Scaling Trick)

Dalam [[Formulasi_Probabilistik_W2VPred]], terdapat sebuah integral kompleks yang muncul saat mendefinisikan konstanta normalisasi untuk distribusi prior Gibbs. Integral ini dikenal sebagai **Fungsi Partisi**.

## Bentuk Integral
Untuk komponen *Structure Loss* ($L_S$) dan *Smoothing Loss* ($L_{RD}$), fungsi partisi didefinisikan sebagai integral atas seluruh ruang parameter $U$ (matriks embedding gabungan):

$$ Z(\sigma) = \int_{\mathbb{R}^n} \exp \left( - \frac{L(U)}{2\sigma^2} \right) dU $$

Di mana:
- $n = T \cdot V \cdot d$ (total dimensi parameter, bisa mencapai puluhan juta).
- $\sigma$ adalah hyperparameter varians yang ingin diestimasi.
- $dU$ adalah elemen volume dalam ruang multidimensi.

## Kendala Penyelesaian
Integral ini tidak dapat diselesaikan secara numerik maupun analitik langsung karena:
1. **Dimensi Sangat Tinggi**: Integrasi numerik (seperti aturan Simpson atau Quadrature) mustahil dilakukan pada ruang berdimensi jutaan.
2. **Improper Prior**: Karena loss fungsi berbasis jarak bersifat invarian terhadap translasi, integral ini sebenarnya bernilai tak terhingga (divergen). Hal ini dijelaskan lebih lanjut dalam [[Improper_Prior]].

## Cara Penyelesaian: Teknik Perubahan Variabel (Scaling Trick)
Meskipun integralnya divergen, kita tidak perlu mengetahui nilai numerik eksaknya. Kita hanya perlu mengetahui bagaimana nilai integral tersebut berubah terhadap perubahan $\sigma$. Caranya adalah dengan menggunakan **Teknik Substitusi/Scaling**.

### Langkah 1: Substitusi Variabel
Lakukan substitusi variabel $U = \sigma V$. Maka, matriks baru $V$ adalah matriks $U$ yang telah dinormalisasi skalanya terhadap $\sigma$.

### Langkah 2: Menggunakan Sifat Homogenitas
Berdasarkan [[Fungsi_Homogen_Berderajat_Dua]], fungsi loss kita memenuhi $L(\sigma V) = \sigma^2 L(V)$. Substitusikan ini ke dalam fungsi eksponensial:

$$ \exp \left( - \frac{L(\sigma V)}{2\sigma^2} \right) = \exp \left( - \frac{\sigma^2 L(V)}{2\sigma^2} \right) = \exp \left( - \frac{L(V)}{2} \right) $$

### Langkah 3: Transformasi Elemen Volume (Jacobian)
Dalam kalkulus multidimensi, jika kita menskalakan variabel integrasi sebesar $\sigma$ pada $n$ dimensi, maka elemen volumenya berubah sebesar faktor penentu Jacobian:
$$ dU = \sigma^n dV $$

### Langkah 4: Rekonstruksi Integral
Substitusikan semua komponen kembali ke dalam integral fungsi partisi:

$$ Z(\sigma) = \int_{\mathbb{R}^n} \exp \left( - \frac{L(V)}{2} \right) \sigma^n dV $$
$$ Z(\sigma) = \sigma^n \int_{\mathbb{R}^n} \exp \left( - \frac{L(V)}{2} \right) dV $$

### Langkah 5: Identifikasi Konstanta
Perhatikan bahwa integral $\int \exp(-L(V)/2) dV$ tidak lagi mengandung variabel $\sigma$. Ini adalah sebuah nilai konstan (walaupun tak terhingga secara teoritis) yang kita sebut sebagai $Z(1)$. Maka:
$$ Z(\sigma) = \sigma^n \cdot Z(1) $$

## Implikasi pada Formulasi Probabilistik
Saat kita mengambil negatif logaritma dari probabilitas prior:
$$ - \log p(U | \sigma) = - \log \left( \frac{1}{Z(\sigma)} \exp \left( - \frac{L(U)}{2\sigma^2} \right) \right) $$
$$ - \log p(U | \sigma) = \frac{L(U)}{2\sigma^2} + \log Z(\sigma) $$
$$ - \log p(U | \sigma) = \frac{L(U)}{2\sigma^2} + \log (\sigma^n \cdot Z(1)) $$
$$ - \log p(U | \sigma) = \frac{L(U)}{2\sigma^2} + n \log \sigma + \text{konstanta} $$

**Kesimpulan**: Teknik ini memungkinkan kita untuk mengisolasi $\sigma$ keluar dari integral, sehingga kita bisa melakukan optimasi gradien terhadap $\sigma$ tanpa harus menghitung nilai integral partisi yang kompleks atau tak terhingga tersebut.

## Hubungan Antar Konsep
- Konsep Pendukung: [[concepts/fundamental/Fungsi_Homogen_Berderajat_Dua|Fungsi Homogen Berderajat Dua]]
- Masalah Akar: [[concepts/fundamental/Improper_Prior|Improper Prior]]
- Digunakan dalam: [[concepts/major/Formulasi_Probabilistik_W2VPred|Formulasi Probabilistik W2VPred]]
