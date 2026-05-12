# Reparameterisasi Numerik Variansi

Sebuah permasalahan fundamental ketika mengaplikasikan [[uncertainty_weighted_loss]] atau algoritma *Maximum A Posteriori* adaptif menggunakan metode *Gradient Descent* murni tanpa batasan (*unconstrained optimization*) terletak pada pembaruan nilai *hyperparameter* varians/skala parameter $\sigma^2$.

Secara probabilistik, sebuah variansi $\sigma^2$ harus diikat oleh aksioma nilai positif ketat ($\sigma^2 > 0$). Akan tetapi, proses iterasi dengan *gradient descent* tidak mengenal batasan tersebut; model secara membabi-buta berisiko menggeser $\sigma^2$ mencapai $0$ atau ke limit teritori negatif.

Apabila nilai $\sigma_k^2$ menyentuh nol (mengingat statusnya sebagai operan pembagi atau penyebut fraksional $\frac{L_k}{2\sigma_k^2}$ pada rumusan *loss* objektif), operasi algoritma akan mendatangkan kegagalan fatal: *Division by zero* atau *NaN* (*numerical underflow/overflow*). Selain itu, menggunakan perbaikan primitif seperti penjepitan (*clipping*) dinilai akan merusak stabilitas konvergensi aliran parameter.

## Solusi Pemetaan Logaritmik Laten

Solusi elegan untuk mengatasi batas ini adalah mengubah representasi model target optimasi variansi melalui variabel laten (terselubung) logaritmik $s_k$:

$$ s_k = \log \sigma_k^2 \implies \sigma_k^2 = e^{s_k} $$

Dengan mengubah orientasi target menjadi variabel baru $s_k$:
1. $s_k$ kini bebas berekspansi di seluruh rentang bilangan riil $\mathbb{R}$ (boleh memuat rentang nol dan negatif sangat ekstrem). Model optimasi bebas menggeser poin ini layaknya pemrosesan matriks tak terbatas tanpa takut menyalahi aksioma awal.
2. Saat komputasi dilakukan, $\sigma_k^2$ tinggal diekstraksi ke basis euler logaritmik ($e^{s_k}$). Berapapun fluktuasi pergeserannya ke ekstremum, pemetaan eksponensial ini mutlak menjamin rentang non-negatif mutlak.

Pada akhirnya, fungsi *loss* objektif ditulis ulang berdasar $s_k$. (misalnya $L_{MAP}(U, s) = \frac{L_F}{2e^{s_F}} + C_F s_F + ...$). Ini merupakan teknik reparameterisasi stabilitas numerik *standard industry-grade* pada optimasi probabilistik lanjutan.
