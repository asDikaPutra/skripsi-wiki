# Uncertainty-Weighted Loss

*Uncertainty-Weighted Loss* adalah metode yang diusulkan oleh Kendall dkk. (2018) dalam jurnal *Multi-Task Learning Using Uncertainty to Weigh Losses for Scene Geometry and Semantics*. Metode ini memberikan pendekatan matematis berbasis *homoscedastic uncertainty* (ketidakpastian tugas) untuk menggabungkan beberapa fungsi *loss* dalam skenario *Multi-Task Learning* (MTL), memungkinkan jaringan saraf tiruan untuk secara otomatis menyeimbangkan skala *loss* dari beberapa tugas yang berbeda tanpa perlu melakukan penyetelan (*tuning*) bobot secara manual.

## Definisi Matematis

Dalam pemodelan probabilitas klasiknya, kerangka ini berfokus pada *homoscedastic uncertainty*—yakni ketidakpastian spesifik untuk sebuah tugas yang bernilai konstan untuk seluruh data, namun bervariasi antara tugas-tugas yang berbeda.

Pencarian bobot tugas ini dimodelkan dengan memaksimalkan fungsi probabilitas log (*log-likelihood*). Apabila sebuah jaringan memiliki dua tugas regresi dengan fungsi *loss* masing-masing $L_1(W)$ dan $L_2(W)$, serta parameter derau (*noise parameter*) $\sigma_1$ dan $\sigma_2$, maka fungsi objektif yang diminimalkan adalah:

$$ L(W, \sigma_1, \sigma_2) = \frac{1}{2\sigma_1^2} L_1(W) + \frac{1}{2\sigma_2^2} L_2(W) + \log \sigma_1 + \log \sigma_2 $$

Untuk tugas klasifikasi, metode ini menggunakan *softmax likelihood* dengan varians suhu (*temperature*) yang dioptimalkan, sehingga ketika digabungkan dengan fungsi objektif regresi (misal, $L_1$ regresi dan $L_2$ klasifikasi silang-entropi), pendekatannya didekati menjadi:

$$ L(W, \sigma_1, \sigma_2) \approx \frac{1}{2\sigma_1^2} L_1(W) + \frac{1}{\sigma_2^2} L_2(W) + \log \sigma_1 + \log \sigma_2 $$

Dalam implementasinya, agar penghitungan lebih stabil dan menghindari pembagian dengan nol, jaringan neural memprediksi *log variance*, yakni $s_i := \log \sigma_i^2$. Dengan ekspresi $s_i$, *loss* untuk sebuah komponen regresi dapat dihitung sebagai $\frac{1}{2} \exp(-s_i) L_i(W) + \frac{1}{2} s_i$.

## Kegunaannya dalam Multi-Task Learning

- **Mengatasi Perbedaan Skala dan Satuan:** Tugas-tugas pengenalan semantik (*semantic segmentation*) sering menggunakan skala silang-entropi, sementara estimasi jarak (*depth regression*) berskala piksel atau satuan metrik. *Uncertainty-weighted loss* menyamakan besaran *gradient* secara otomatis.
- **Pembelajaran Adaptif:** Seiring meningkatnya pemahaman *model* terhadap *dataset* selama proses pelatihan, parameter varians $\sigma$ ikut mengecil (yang akan membesarkan pengaruh suatu komponen *loss* secara proporsional), sehingga menuntun jaringan ke hasil optimum konvergen tanpa intervensi.

## Perbandingan dengan Skema Pembobotan Manual

Skema pembobotan manual tradisional sering menggunakan jumlahan linier:

$$ L_{total} = \sum_i w_i L_i $$

Kelemahan skema ini adalah kinerja model sangat rentan terhadap hiperparameter $w_i$. Memilah $w_i$ yang optimal membutuhkan waktu dan komputasi masif (*grid search*). Dengan *Uncertainty-Weighted Loss*, istilah regularisasi $\log \sigma$ mencegah parameter derau dari nilai yang tak terhingga dan membuat metode ini secara otomatis menemukan konfigurasi pembobotan optimal ($w_i = \frac{1}{2\sigma_i^2}$) jauh melampaui kemampuan penyetelan manual iteratif.
