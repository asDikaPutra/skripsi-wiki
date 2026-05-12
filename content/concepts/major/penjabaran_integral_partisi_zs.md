# Penjabaran Lengkap: Integral Fungsi Partisi $Z_S(\sigma_S)$

> **Tujuan catatan ini**: Memahami secara intuitif dan matematis *setiap komponen* dari integral berikut, dari mana ia berasal, mengapa ditulis seperti itu, dan apa yang sebenarnya sedang "dihitung".

$$Z_S(\sigma_S) = \int_{\mathbb{R}^n} \exp\!\left(-\frac{L_S(U)}{2\sigma_S^2}\right) dU$$

---

## Bagian 1 — Dari Mana Integral Ini Berasal?

### Konteks: Kita Butuh Distribusi Peluang

Dalam kerangka Bayesian pada skripsi ini, kita ingin menyatakan bahwa konfigurasi matriks embedding $U$ tertentu "lebih mungkin" dari yang lain. Syarat ini dipenuhi oleh sebuah distribusi peluang, yang harus memenuhi satu aturan fundamental:

$$\text{Total peluang seluruh kemungkinan} = 1$$

Kita sudah punya fungsi yang nilainya *lebih besar* untuk konfigurasi $U$ yang baik (yang mematuhi batasan struktur), yaitu:

$$f(U) = \exp\!\left(-\frac{L_S(U)}{2\sigma_S^2}\right)$$

Tapi nilai $f(U)$ ini belum tentu "menjumlah ke 1" jika diintegralkan terhadap semua kemungkinan $U$. Untuk memaksanya menjadi 1, kita bagi dengan totalnya. Itulah $Z_S$:

$$p_S(U) = \frac{f(U)}{Z_S(\sigma_S)} \quad \Longrightarrow \quad Z_S(\sigma_S) = \int_{\mathbb{R}^n} f(U)\, dU$$

Jadi $Z_S$ bukan sesuatu yang aneh — ia hanyalah **jumlah dari semua nilai $f(U)$ di seluruh ruang yang mungkin**, persis seperti penyebut $P(D)$ pada hukum Bayes.

---

## Bagian 2 — Apa itu "Ruang $\mathbb{R}^n$" yang Diintegralkan?

### Perbandingan dengan Integral Biasa

Dalam kalkulus dasar, integral berarti menjumlahkan nilai fungsi di sepanjang satu garis ($dx$) atau satu bidang ($dx\,dy$). Integral multidimensi melakukan hal yang sama di ruang berdimensi lebih tinggi.

Di sini, "titik" yang kita integralkan bukan angka tunggal, melainkan **satu set lengkap seluruh matriks embedding untuk semua domain**. Dimensi ruang tersebut adalah:

$$n = T \times V \times d$$

Dengan $T$ = jumlah domain, $V$ = ukuran kosakata, $d$ = dimensi embedding.

**Contoh konkret pada WikiFoS**: $T = 16$, $V \approx 50.000$, $d = 100$ → **total $n = 80$ juta dimensi**.

Integral $\int_{\mathbb{R}^n} \dots dU$ berarti kita menjumlahkan nilai fungsi di *setiap kemungkinan kombinasi angka dari seluruh 80 juta elemen matriks tersebut secara bersamaan*.

### Visualisasi Bertahap

Bayangkan kita sederhanakan dulu — hanya ada **1 domain**, **2 kata**, **1 dimensi embedding**. Maka $U$ hanyalah dua angka: $U = (u_1, u_2)$.

Integral kita menjadi:
$$Z_S = \iint_{\mathbb{R}^2} \exp\!\left(-\frac{L_S(u_1, u_2)}{2\sigma_S^2}\right) du_1\, du_2$$

Ini sudah familiar — kita sedang menghitung volume di bawah permukaan fungsi di atas bidang $(u_1, u_2)$.

Di skripsi, bidang itu menjadi ruang 80 juta dimensi. Konsepnya sama, hanya tidak dapat divisualisasikan secara fisik.

---

## Bagian 3 — Bedah Fungsi Eksponensial $\exp(-L_S / 2\sigma_S^2)$

### Mengapa Bentuk $\exp(\text{negatif})$?

Ini adalah "trik Gibbs" yang berasal dari fisika statistik (mekanika statistik). Idenya:

- Kita punya fungsi energi $L_S(U)$ yang nilainya **kecil** untuk konfigurasi yang bagus.
- Kita ingin peluang konfigurasi bagus **besar**, dan peluang konfigurasi buruk **kecil**.
- Fungsi $\exp(-L_S)$ melakukan tepat itu: nilai kecil di dalam menghasilkan nilai besar di luar, dan sebaliknya.

Tabel ilustrasi:

| Kondisi | $L_S(U)$ | $-L_S/2\sigma^2$ | $\exp(\dots)$ | Peluang |
|:---|:---:|:---:|:---:|:---:|
| Domain-domain berada tepat di tempatnya | $\approx 0$ | $\approx 0$ | $\approx 1$ | Tertinggi |
| Sedikit menyimpang | Kecil | Negatif kecil | Mendekati 1 | Tinggi |
| Menyimpang parah | Besar | Negatif besar | Mendekati 0 | Hampir nol |

Nilai $\exp(\text{negatif apapun})$ selalu positif, sehingga ia aman dipakai sebagai peluang.

### Apa itu $L_S(U)$?

$$L_S(U) = \sum_{t \neq t'} W_{t,t'} \|U_t - U_{t'}\|_F^2$$

Ini adalah jumlahan dari jarak kuadrat antar matriks embedding dari setiap pasangan domain, diboboti oleh seberapa dekat kedua domain itu seharusnya ($W_{t,t'}$).

**Contoh konkret**: Domain `Chemistry` dan `Biology` seharusnya semantik dekat → $W$ besar. Jika model menempatkan keduanya jauh di ruang vektor, maka $\|U_{\text{Chem}} - U_{\text{Bio}}\|_F^2$ besar → $L_S$ besar → $\exp(-L_S/2\sigma^2)$ mendekati nol → peluang konfigurasi ini sangat rendah.

### Apa Peran $2\sigma_S^2$ di Penyebut?

Ini adalah **pengontrol kekakuan aturan**. Sifatnya persis sama dengan lebar $\sigma$ pada distribusi Gaussian:

- **$\sigma_S$ kecil** → pembagi kecil → nilai negatif di eksponensial sangat besar → kurva sangat runcing. Konfigurasi yang sedikit saja melanggar struktur langsung mendapat peluang sangat rendah. **Aturan sangat ketat.**

- **$\sigma_S$ besar** → pembagi besar → nilai negatif kecil → kurva landai. Hampir semua konfigurasi mendapat peluang mirip. **Aturan sangat longgar.**

Dalam JMAP, nilai $\sigma_S$ inilah yang dipelajari otomatis dari data.

---

## Bagian 4 — Penjabaran Langkah per Langkah: Kenapa $Z_S(\sigma_S) = \sigma_S^n \cdot Z_S(1)$?

Ini adalah hasil kunci yang memungkinkan kita menghitung $\log Z_S$ tanpa mengevaluasi integralnya secara eksak.

### Fakta 1: Sifat Homogenitas $L_S$ (Derajat Dua)

Terbukti bahwa: $L_S(cU) = c^2\, L_S(U)$ untuk semua skalar $c > 0$.

Buktinya langsung: karena $\|cU_t - cU_{t'}\|_F^2 = c^2\|U_t - U_{t'}\|_F^2$, maka saat dijumlahkan:
$$L_S(cU) = \sum_{t \neq t'} W_{t,t'} \cdot c^2\|U_t - U_{t'}\|_F^2 = c^2 \sum_{t \neq t'} W_{t,t'} \|U_t - U_{t'}\|_F^2 = c^2 L_S(U)$$

### Fakta 2: Perubahan Elemen Volume (Teorema Jacobian)

Ketika kita melakukan substitusi variabel $U = \sigma_S V$ pada integral $n$-dimensi, elemen volume berubah:
$$dU = \sigma_S^n\, dV$$

Logikanya: jika kita "memperbesar" setiap satu dari $n$ sumbu sebesar $\sigma_S$, volume total menjadi $\sigma_S^n$ kali lebih besar.

### Menyatukan Kedua Fakta

Substitusikan $U = \sigma_S V$ ke dalam $Z_S$:

**Langkah 1** — Sederhanakan eksponennya:

$$\exp\!\left(-\frac{L_S(\sigma_S V)}{2\sigma_S^2}\right) = \exp\!\left(-\frac{\sigma_S^2 \cdot L_S(V)}{2\sigma_S^2}\right) = \exp\!\left(-\frac{L_S(V)}{2}\right)$$

$\sigma_S^2$ di pembilang dan penyebut **saling menghapus**. Eksponensial kini bebas dari $\sigma_S$.

**Langkah 2** — Ganti elemen volume:

$$dU = \sigma_S^n\, dV$$

**Langkah 3** — Tulis ulang integral:

$$Z_S(\sigma_S) = \int_{\mathbb{R}^n} \exp\!\left(-\frac{L_S(V)}{2}\right)\, \sigma_S^n\, dV$$

**Langkah 4** — Keluarkan $\sigma_S^n$ karena ia konstanta terhadap $V$:

$$Z_S(\sigma_S) = \sigma_S^n \underbrace{\int_{\mathbb{R}^n} \exp\!\left(-\frac{L_S(V)}{2}\right)\, dV}_{\displaystyle Z_S(1)}$$

$$\boxed{Z_S(\sigma_S) = \sigma_S^n \cdot Z_S(1)}$$

Kita tidak perlu menghitung $Z_S(1)$ — cukup tahu bahwa ia adalah **konstanta** (tidak mengandung $\sigma_S$).

---

## Bagian 5 — Jembatan ke Fungsi Objektif JMAP

Kita butuh $\log Z_S$ untuk menghitung log-prior:

$$-\log p_S(U|\sigma_S) = \frac{L_S(U)}{2\sigma_S^2} + \log Z_S(\sigma_S)$$

Dengan hasil di atas:

$$\log Z_S(\sigma_S) = \log\!\left(\sigma_S^n \cdot Z_S(1)\right) = n\log\sigma_S + \underbrace{\log Z_S(1)}_{\text{konstanta → dibuang}}$$

Hasilnya:

$$\boxed{-\log p_S(U|\sigma_S) = \frac{L_S(U)}{2\sigma_S^2} + (T \cdot V \cdot d)\log\sigma_S + C_S}$$

**Suku $n\log\sigma_S$ inilah penalti regularisasi**. Ia mencegah optimasi "curang" dengan membuat $\sigma_S \to \infty$ (yang akan membuat $L_S/2\sigma_S^2 \to 0$, seolah-olah menghapus semua aturan struktur). Karena $\log\sigma_S$ tumbuh bersama $\sigma_S$, ada harga yang harus dibayar jika $\sigma_S$ terlalu besar.

---

## Alur Logis Keseluruhan

```
[1] Kita punya fungsi energi L_S(U) → batasan struktur domain
        ↓
[2] Ubah ke distribusi peluang via Gibbs: p(U) ∝ exp(-L_S / 2σ²)
        ↓
[3] Butuh Z_S untuk normalisasi → bentuknya integral dimensi-tinggi
        ↓
[4] Integral tidak bisa dihitung langsung → pakai substitusi U = σV
        ↓ (Gunakan: L_S(σV) = σ²·L_S(V) dan dU = σⁿ dV)
        ↓
[5] Z_S(σ) = σⁿ · Z_S(1)  ← σ berhasil "keluar" dari integral!
        ↓
[6] log Z_S(σ) = n·log(σ) + konstanta
        ↓
[7] Suku n·log(σ) masuk ke fungsi objektif sebagai penalti regularisasi otomatis
```

---

**Catatan Terkait:**
- [[concepts/fundamental/Distribusi_Gibbs]] — Dasar teori energi → peluang (Gibbs measure)
- [[concepts/fundamental/Fungsi_Homogen_Berderajat_Dua]] — Bukti formal $L_S(cU) = c^2 L_S(U)$
- [[concepts/fundamental/Integral_Fungsi_Partisi]] — Catatan teknis lebih lanjut
- [[concepts/major/Formulasi_Probabilistik_W2VPred]] — Penerapan lengkap di model W2VPred-MAP


