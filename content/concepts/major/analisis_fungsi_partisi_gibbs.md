# Analisis Komponen Integral Fungsi Partisi Gibbs

Catatan ini membedah komponen matematis dari fungsi partisi $Z_S(\sigma_S)$ yang digunakan dalam perumusan distribusi prior Gibbs pada model W2VPred-MAP. Tujuannya adalah menjembatani antara notasi abstrak dalam skripsi dengan konsep kalkulus integral yang umum dipelajari.

## Persamaan Utama
Dalam kerangka kerja Bayesian untuk W2VPred, fungsi partisi didefinisikan sebagai:
$$Z_S(\sigma_S) = \int_{\mathbb{R}^n} \exp\!\left(-\frac{L_S(U)}{2\sigma_S^2}\right) dU$$

## Bedah Komponen Integral

### 1. Simbol $Z_S(\sigma_S)$ (Fungsi Partisi / Konstanta Normalisasi)
Dalam kalkulus biasa, jika kita memiliki fungsi $f(x)$ dan ingin menjadikannya distribusi peluang, kita harus membaginya dengan total luas di bawah kurva: $C = \int f(x) dx$. 
- **Di Skripsi**: $Z_S$ adalah "angka pembagi" tersebut. Tanpa $Z_S$, total peluang dari seluruh kemungkinan konfigurasi matriks $U$ tidak akan bernilai 1.
- **Analogi**: Bayangkan $Z_S$ sebagai "wadah" yang memastikan semua energi yang dikeluarkan oleh sistem terdistribusi secara adil menjadi peluang.

### 2. Wilayah Integrasi $\int_{\mathbb{R}^n} \dots dU$
Ini bukan integral garis ($dx$) atau integral lipat dua ($dx dy$) biasa, melainkan integral atas ruang berdimensi sangat tinggi.
- **Dimensi ($n$)**: Di sini $n = T \times V \times d$. Jika kita punya 16 domain ($T$), 50.000 kata ($V$), dan 100 dimensi embedding ($d$), maka kita sedang mengintegralkan di atas ruang berdimensi **80 juta**.
- **Variabel ($U$)**: Setiap "titik" di dalam ruang ini bukanlah sebuah angka, melainkan satu set lengkap seluruh matriks embedding untuk seluruh domain.

### 3. Kernel Eksponensial $\exp(\dots)$
Fungsi eksponensial di sini bertindak sebagai jembatan antara **Dunia Geometri** (jarak/loss) dan **Dunia Probabilitas**.
- **Logika Gibbs**: Semakin besar nilai *loss* $L_S(U)$ (konfigurasi yang buruk), nilai $\exp(-\text{Loss})$ akan semakin mendekati nol (peluangnya sangat kecil).
- Sebaliknya, konfigurasi $U$ yang "pintar" (memenuhi batasan struktur) akan memiliki $L_S$ kecil, sehingga nilai eksponensialnya besar dan peluangnya tinggi.

### 4. Pembagi $2\sigma_S^2$ (Parameter Skala / Temperatur)
Dalam integral biasa, ini mirip dengan parameter lebar pada kurva Bell (Gaussian). 
- **Fungsi**: Ia mengontrol seberapa "galak" kita menegakkan aturan struktur.
- **Jika $\sigma_S$ kecil**: Pembagi di dalam eksponensial menjadi kecil, membuat nilai negatifnya sangat besar. Ini akan menekan peluang konfigurasi yang "sedikit salah" sekalipun menjadi hampir nol (Aturan sangat ketat).
- **Jika $\sigma_S$ besar**: Nilai eksponensial menjadi lebih landai. Kita membolehkan adanya penyimpangan struktur (Aturan longgar/ketidakpastian tinggi).

### 5. Elemen Volume $dU$
Ini adalah elemen diferensial multidimensi. Sesuai bahasan [[Kalkulus Integral Multivariabel]], elemen ini sangat sensitif terhadap perubahan skala.
- Saat kita melakukan substitusi $U = \sigma_S V$, maka $dU$ akan berubah menjadi $\sigma_S^n dV$.
- Inilah alasan mengapa muncul suku $n \log \sigma_S$ pada fungsi objektif akhir; suku tersebut berasal dari "ledakan volume" saat kita mengeluarkan $\sigma_S$ dari dalam tanda integral.

## Ringkasan Hubungan
| Komponen | Nama Teknis | Peran dalam Kalkulus | Peran dalam Model |
| :--- | :--- | :--- | :--- |
| $L_S(U)$ | Fungsi Energi | Integrand (Fungsi yang dihitung) | Batasan struktur antar domain |
| $2\sigma_S^2$ | Varian / Temperatur | Parameter Skala | Derajat ketidakpastian struktur |
| $Z_S$ | Fungsi Partisi | Konstanta Normalisasi | Penyeimbang bobot otomatis |
| $n$ | Dimensionalitas | Derajat kebebasan | Kapasitas ruang embedding |

---
**Catatan Terkait:**
- [[Kalkulus Integral Multivariabel]] - Penjelasan tentang Jacobian $dU = \sigma_S^n dV$.
- [[Distribusi Gibbs]] - Dasar teori energi ke peluang.
- [[Maximum A Posteriori]] - Bagaimana $Z_S$ muncul dalam optimasi.
