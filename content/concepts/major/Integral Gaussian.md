
Misalkan kita memiliki fungsi energi $L_S$ yang sangat sederhana, yaitu jumlah kuadrat dari setiap elemen (seolah-olah setiap kata "terikat" ke titik pusat $(0,0)$ dengan pegas):

$$L_S(u_1, u_2) = u_1^2 + u_2^2$$

Maka bentuk integralnya menjadi:

$$Z_S = \int_{-\infty}^{\infty} \int_{-\infty}^{\infty} \exp\left(-\frac{u_1^2 + u_2^2}{2\sigma_S^2}\right) du_1 \, du_2$$

Berikut adalah langkah perhitungannya:

---

### 1. Pemisahan Variabel

Karena sifat eksponensial $\exp(A+B) = \exp(A)\exp(B)$, kita bisa memisahkan integral lipat dua ini menjadi perkalian dua integral satu dimensi:

$$Z_S = \left( \int_{-\infty}^{\infty} \exp\left(-\frac{u_1^2}{2\sigma_S^2}\right) du_1 \right) \times \left( \int_{-\infty}^{\infty} \exp\left(-\frac{u_2^2}{2\sigma_S^2}\right) du_2 \right)$$

### 2. Menggunakan Rumus Standar Integral Gaussian

Kita tahu bahwa hasil dari integral Gaussian standar adalah:

$$\int_{-\infty}^{\infty} e^{-ax^2} dx = \sqrt{\frac{\pi}{a}}$$

Dalam kasus kita, konstanta $a = \frac{1}{2\sigma_S^2}$. Maka untuk satu variabel ($u_1$):

$$\int_{-\infty}^{\infty} \exp\left(-\frac{1}{2\sigma_S^2} u_1^2\right) du_1 = \sqrt{\frac{\pi}{1/(2\sigma_S^2)}} = \sqrt{2\pi\sigma_S^2} = \sigma_S \sqrt{2\pi}$$

### 3. Hasil Akhir

Karena kita punya dua variabel yang identik ($u_1$ dan $u_2$):

$$Z_S = (\sigma_S \sqrt{2\pi}) \times (\sigma_S \sqrt{2\pi})$$

$$\boxed{Z_S = 2\pi \sigma_S^2}$$

---

### Korelasi dengan Teori Anda ($Z_S(\sigma_S) = \sigma_S^n \cdot Z_S(1)$)

Sekarang mari kita buktikan apakah hasil ini konsisten dengan penjabaran yang Anda buat di catatan skripsi:

1. **Tentukan $n$:** Karena ini integral lipat dua, maka dimensi $n = 2$.
    
2. **Tentukan $Z_S(1)$:** Jika kita set $\sigma_S = 1$ pada hasil di atas, maka $Z_S(1) = 2\pi(1)^2 = 2\pi$.
    
3. **Gunakan rumus Anda:**
    
    $$Z_S(\sigma_S) = \sigma_S^n \cdot Z_S(1)$$
    
    $$Z_S(\sigma_S) = \sigma_S^2 \cdot (2\pi)$$
    

Hasilnya **identik**.

### Apa maknanya secara geometris?

- **$Z_S(1) = 2\pi$** adalah "volume" dasar di bawah kurva lonceng 2D ketika lebarnya standar.
    
- **$\sigma_S^2$** adalah faktor penskalaan. Jika Anda memperlebar "lonceng" tersebut sebesar $\sigma_S$ ke arah sumbu $u_1$ dan sebesar $\sigma_S$ ke arah sumbu $u_2$, maka luas alasnya meningkat secara kuadratik ($\sigma_S \times \sigma_S$), sehingga volume totalnya (hasil integralnya) juga meningkat sebesar $\sigma_S^2$.
    

Dalam kasus skripsi Anda dengan $n = 80$ juta, volumenya meningkat sebesar $\sigma_S^{80.000.000}$. Itulah mengapa suku $n \log \sigma_S$ menjadi sangat dominan dalam fungsi objektif JMAP Anda.