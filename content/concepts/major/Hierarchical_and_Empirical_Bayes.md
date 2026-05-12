# Hierarki dan Bayes Empiris (Hierarchical and Empirical Bayes)

*Diterjemahkan dari: Bayesian Theory (Bernardo & Smith), Bagian 5.6.4, Halaman 371-373.*

## 1. Konsep Model Hierarki
Pada Bagian 4.6.5, kita telah memotivasi dan membahas struktur model yang berbentuk hierarki. Dinyatakan dalam bentuk densitas generik, versi sederhana dari model hierarki tersebut memiliki struktur sebagai berikut:

1.  **Tahap Pertama:** Spesifikasi model untuk observasi data.
2.  **Tahap Kedua:** Spesifikasi distribusi parameter (*prior*) yang saling berkaitan.
3.  **Tahap Ketiga:** Spesifikasi distribusi untuk hiperparameter (*hyperprior*).

Interpretasi dasarnya adalah sebagai berikut. Observables $z_1, \dots, z_k$ tersedia dari $k$ sumber yang berbeda namun saling berkaitan: misalnya, $k$ individu dalam populasi yang homogen, atau $k$ pusat uji klinis yang terlibat dalam studi yang sama. 

Tahap pertama dari hierarki menentukan komponen model parametrik untuk masing-masing dari $k$ observasi tersebut. Namun, karena adanya "keterkaitan" (*relatedness*) antara $k$ observasi tersebut, parameter-parameter $\theta_1, \dots, \theta_k$ sendiri dianggap bersifat dapat dipertukarkan (*exchangeable*). Tahap kedua dan ketiga dari hierarki dengan demikian menyediakan *prior* untuk $\theta$ dalam bentuk representasi campuran (*mixture representation*) yang sudah kita kenal:

$$p(\theta_1, \dots, \theta_k) = \int \left[ \prod_{i=1}^k p(\theta_i \mid \phi) \right] p(\phi) d\phi$$

Di sini, "hiperparameter" $\phi$ biasanya memiliki interpretasi dalam hal karakteristik populasi—seperti rata-rata dan kovarians—dari mana $k$ unit tersebut diambil (misalnya populasi individu atau pusat pengujian).

## 2. Inferensi Posterior
Dalam banyak aplikasi, kita mungkin tertarik untuk melakukan inferensi terhadap karakteristik unit ($\theta_i$) maupun karakteristik populasi ($\phi$). Dalam kedua kasus tersebut, manipulasi probabilitas langsung menggunakan Teorema Bayes menghasilkan inferensi *posterior* sebagai berikut:

$$p(\theta, \phi \mid z) \propto p(z \mid \theta) p(\theta \mid \phi) p(\phi)$$

Secara lebih spesifik:
*   $p(\theta_i \mid \phi, z) \propto p(z \mid \theta_i) p(\theta_i \mid \phi)$
*   $p(\phi \mid z) \propto p(z \mid \phi) p(\phi)$

Di mana fungsi *likelihood* marginal untuk $\phi$ didefinisikan sebagai:
$$p(z \mid \phi) = \int p(z \mid \theta) p(\theta \mid \phi) d\theta$$

Tentu saja, implementasi aktual memerlukan evaluasi integral yang sesuai, yang dalam banyak kasus bersifat non-trivial. Namun, model-model ini dapat diimplementasikan secara Bayesian penuh menggunakan teknik komputasi yang tepat (seperti yang dibahas dalam volume *Bayesian Computation* dan *Bayesian Methods*).

## 3. Bayes Empiris (Empirical Bayes)
Sebuah aproksimasi yang menarik muncul dari baris pertama analisis di atas. Kita perhatikan bahwa jika distribusi *posterior* hiperparameter $p(\phi \mid z)$ sangat tajam (terpusat) di sekitar modusnya, katakanlah $\phi^*$, maka kita dapat melakukan aproksimasi:

$$p(\theta_i \mid z) \approx p(\theta_i \mid \phi^*, z)$$

Bentuk hasil ini dapat dianggap seolah-olah kita pertama-tama menggunakan data untuk mengestimasi $\phi$, lalu menggunakan nilai "plug-in" $\phi^*$ tersebut ke dalam Teorema Bayes untuk dua tahap pertama hierarki. Analisis ini memiliki nuansa Bayesian, namun menggunakan *prior* "empiris" yang didasarkan pada data.

Aproksimasi jalan pintas (*short-cut*) terhadap analisis Bayesian penuh dari model hierarki ini dikenal sebagai **metode Bayes Empiris** (*Empirical Bayes methods*). Istilah ini sebenarnya sedikit membingungkan, karena awalnya digunakan untuk mendeskripsikan estimasi frekuentis dari distribusi tahap kedua (Robbins, 1955). Namun, belakangan ini (mengikuti perkembangan Efron & Morris, 1972), istilah tersebut lebih merujuk pada upaya mengaproksimasi distribusi *posterior* yang timbul dari model hierarki.

## 4. Keterbatasan dan Kritik
Aproksimasi naif yang diuraikan di atas jelas memiliki kekurangan karena mengabaikan ketidakpastian (*uncertainty*) pada parameter $\phi$. Banyak perkembangan setelah Morris (1983) diarahkan untuk menemukan aproksimasi yang lebih dapat dipertahankan. Untuk pendekatan Bayesian yang lebih menyeluruh (*whole-hearted Bayesian approaches*), pembaca dapat merujuk pada Deely dan Lindley (1981) atau Kass dan Steffey (1989).
