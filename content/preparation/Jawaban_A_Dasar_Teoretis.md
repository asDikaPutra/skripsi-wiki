# Jawaban Sidang — Kategori A: Dasar Teoretis

> **Bayesian inference, MAP, JMAP, distribusi Gibbs, MLE, improper prior, fungsi partisi.**
> Disusun untuk persiapan ujian skripsi W2VPred-MAP.
> Bahasa Indonesia akademik formal sesuai PUEBI.

---

## 1. Peran Bayesian Inference dalam Reformulasi W2VPred

Bayesian inference berperan sebagai kerangka kerja sistematis yang memungkinkan integrasi pengetahuan awal (prior knowledge) ke dalam proses estimasi parameter embedding. Dalam reformulasi W2VPred menjadi W2VPred-MAP, Bayesian inference menyediakan mekanisme untuk menggabungkan data observasi (matriks PPMI) dengan batasan struktural antar domain secara koheren melalui Teorema Bayes: $P(\theta, \sigma \mid D) \propto P(D \mid \theta, \sigma) P(\theta \mid \sigma) P(\sigma)$. Pendekatan ini mengubah model yang semula deterministik menjadi model probabilistik dengan interpretasi statistik yang jelas pada setiap komponen loss.

Pendekatan Maximum A Posteriori (MAP) dipilih menggantikan Maximum Likelihood Estimation (MLE) murni karena dua alasan utama. Pertama, MLE hanya memaksimalkan $P(D \mid \theta)$ tanpa mempertimbangkan informasi struktural yang telah diketahui sebelumnya mengenai hubungan antar domain. Kedua, komponen $L_S$ dan $L_{RD}$ dalam W2VPred bukanlah fungsi likelihood yang berasal dari data observasi, melainkan batasan regularisasi yang bersifat prior. MAP memungkinkan perlakuan matematis yang setara antara data fidelity (Gaussian likelihood) dan batasan struktural (Gibbs prior) dalam satu fungsi objektif yang koheren secara Bayesian.

Lebih lanjut, pendekatan MAP menyediakan landasan teoretis untuk estimasi otomatis bobot keseimbangan antar komponen loss melalui parameter ketidakpastian $\sigma$. Dengan memperlakukan bobot regularisasi sebagai parameter yang diestimasi bersama embedding, W2VPred-MAP menghilangkan ketergantungan pada grid search manual untuk menentukan hiperparameter $\tau$ dan $\lambda$ seperti pada W2VPred asli.

---

## 2. JMAP vs Estimasi Bertahap

Keuntungan teoretis utama Joint Maximum A Posteriori (JMAP) dibandingkan estimasi bertahap adalah konsistensi inferensial yang lebih kuat. Dalam estimasi bertahap — misalnya MLE untuk $\theta$ lalu MAP untuk $\sigma$ — kita mengasumsikan bahwa parameter $\theta$ telah diketahui dengan pasti sebelum mengestimasi $\sigma$, sehingga mengabaikan ketidakpastian dari estimasi tahap pertama. Hal ini dapat menghasilkan estimasi $\sigma$ yang bias karena kesalahan pada $\theta$ tidak diperhitungkan dalam tahap kedua.

JMAP mengestimasi $\theta$ dan $\sigma$ secara simultan dengan memaksimalkan posterior gabungan: $(\hat{\theta}, \hat{\sigma}) = \arg\max_{\theta,\sigma} [\ln P(D \mid \theta, \sigma) + \ln P(\theta \mid \sigma) + \ln P(\sigma)]$. Dengan estimasi bersama, kedua parameter saling memengaruhi secara timbal balik selama proses optimasi: perubahan pada $\sigma$ mengubah bobot regularisasi yang memengaruhi estimasi $\theta$, dan sebaliknya, perubahan pada $\theta$ mengubah nilai likelihood dan prior yang memengaruhi estimasi $\sigma$. Mekanisme ini menghasilkan solusi yang lebih koheren secara statistik.

Selain itu, JMAP menghindari masalah propagasi kesalahan (error propagation) yang umum dalam prosedur bertahap. Dalam konteks W2VPred dengan 16 domain dan dimensi embedding yang besar, estimasi bertahap memerlukan prosedur validasi silang yang rumit untuk setiap tahap. JMAP menyederhanakan proses menjadi satu prosedur optimasi end-to-end, sehingga lebih efisien secara komputasi dan menghasilkan solusi yang optimal secara bersama, bukan optimal secara parsial.

---

## 3. Distribusi Gibbs pada Loss Struktur

Distribusi Gibbs secara umum didefinisikan sebagai $\pi(\omega) = \frac{1}{Z} \exp\left(-\frac{U(\omega)}{T}\right)$, di mana $U(\omega)$ adalah fungsi energi yang merepresentasikan tingkat ketidakstabilan suatu konfigurasi $\omega$, $Z$ adalah fungsi partisi yang menormalkan distribusi, dan $T$ adalah parameter temperatur yang mengontrol kekakuan distribusi. Konsep ini berasal dari fisika statistik dan diperkenalkan ke dalam pembelajaran mesin melalui karya Geman dan Geman (1984) tentang Markov Random Fields.

Dalam W2VPred-MAP, komponen $L_S$ (structure loss) dan $L_{RD}$ (relationship distinction loss) dipandang sebagai fungsi energi dari distribusi Gibbs. Untuk $L_S$, fungsi energinya adalah $L_S(U) = \sum_{t \neq t'} W_{t,t'} \|U_t - U_{t'}\|_F^2$, yang mengukur ketidaksesuaian geometris antar domain embedding. Semakin besar $L_S$, semakin tinggi energi konfigurasi tersebut, sehingga probabilitas prior-nya semakin kecil. Parameter $2\sigma_S^2$ bertindak sebagai temperatur yang mengontrol seberapa ketat batasan struktur diterapkan.

Interpretasi probabilistik ini memberikan keuntungan penting: fungsi loss yang semula hanya bernilai numerik kini memiliki makna sebagai log-probabilitas dari suatu konfigurasi embedding. Ketika diintegrasikan ke dalam kerangka JMAP, distribusi Gibbs pada $L_S$ dan $L_{RD}$ menghasilkan suku regularisasi $n \log \sigma$ yang mencegah optimasi menaikkan $\sigma$ tanpa batas, sehingga menciptakan keseimbangan otomatis antara fidelity data dan batasan struktural.

---

## 4. Improper Prior untuk $P(\sigma)$

Improper prior adalah distribusi probabilitas awal yang tidak dapat dinormalisasi karena integralnya di seluruh ruang parameter bernilai tak terhingga ($\int P(\sigma) d\sigma = \infty$). Dengan kata lain, improper prior bukanlah distribusi probabilitas yang sah karena tidak memenuhi aksioma normalisasi, namun tetap dapat digunakan sebagai faktor dalam aturan Bayes selama posterior yang dihasilkan bersifat proper (terintegrasi hingga satu).

Pemilihan prior improper $P(\sigma) \propto 1$ atau $P(\sigma^2) \propto 1/\sigma^2$ dalam model JMAP didasarkan pada prinsip non-informatif (non-informative prior). Ketika kita tidak memiliki pengetahuan awal yang kuat mengenai skala ketidakpastian $\sigma$, prior improper memberikan fleksibilitas maksimal karena tidak memaksakan preferensi pada nilai $\sigma$ tertentu. Hal ini memungkinkan data sepenuhnya menentukan estimasi $\sigma$ melalui likelihood dan prior Gibbs yang bergantung pada $\sigma$.

Meskipun prior improper tidak dapat dinormalisasi, penggunaannya dalam JMAP tetap valid karena dua alasan. Pertama, fungsi objektif JMAP bekerja pada log-posterior, di mana konstanta normalisasi yang hilang dari prior improper hanyalah konstanta aditif yang tidak memengaruhi optimasi. Kedua, posterior gabungan $P(\theta, \sigma \mid D)$ yang dihasilkan tetap proper karena kontribusi dari likelihood dan prior Gibbs menyediakan informasi yang cukup untuk mempersempit ruang parameter. Dalam praktiknya, improper prior untuk $\sigma$ telah banyak digunakan dalam literatur Bayesian dan terbukti efektif untuk estimasi parameter skala.

---

## 5. Fungsi Partisi Gibbs $Z_S$

Fungsi partisi Gibbs untuk komponen struktur didefinisikan sebagai integral berdimensi tinggi: $Z_S(\sigma_S) = \int_{\mathbb{R}^n} \exp\left(-\frac{L_S(U)}{2\sigma_S^2}\right) dU$, dengan $n = T \cdot V \cdot d$ adalah total dimensi ruang embedding. Integral ini pada prinsipnya tidak dapat dihitung secara eksak karena dimensinya sangat besar (puluhan juta), namun dapat disederhanakan dengan memanfaatkan sifat homogenitas derajat dua dari fungsi energi $L_S$.

Sifat homogenitas menyatakan bahwa $L_S(cU) = c^2 L_S(U)$ untuk sembarang skalar $c > 0$. Dengan melakukan substitusi variabel $U = \sigma_S V$, maka $L_S(\sigma_S V) = \sigma_S^2 L_S(V)$ dan elemen volume berubah menjadi $dU = \sigma_S^n dV$ melalui teorema Jacobian. Substitusi ini menghasilkan:

$$Z_S(\sigma_S) = \int_{\mathbb{R}^n} \exp\left(-\frac{\sigma_S^2 L_S(V)}{2\sigma_S^2}\right) \sigma_S^n dV = \sigma_S^n \int_{\mathbb{R}^n} \exp\left(-\frac{L_S(V)}{2}\right) dV = \sigma_S^n \cdot Z_S(1)$$

Parameter $n = T \cdot V \cdot d$ memiliki makna sebagai jumlah total derajat kebebasan dalam ruang embedding, yaitu hasil kali jumlah domain ($T$), ukuran kosakata ($V$), dan dimensi embedding ($d$). Ekspresi $Z_S(1)$ adalah konstanta yang tidak bergantung pada $\sigma_S$ dan tidak perlu dihitung secara eksak karena akan hilang sebagai konstanta aditif dalam log-posterior. Hubungan $Z_S(\sigma_S) = \sigma_S^n \cdot Z_S(1)$ inilah yang memungkinkan kita memperoleh suku $n \log \sigma_S$ dalam fungsi objektif JMAP tanpa perlu mengevaluasi integral fungsi partisi secara langsung.

---

## 6. MLE vs JMAP

Maximum Likelihood Estimation (MLE) mengestimasi parameter dengan memaksimalkan fungsi likelihood: $\hat{\theta}_{MLE} = \arg\max_\theta \ln P(D \mid \theta)$. Dalam konteks W2VPred, MLE hanya akan melibatkan komponen fidelity loss $L_F$ yang dimodelkan sebagai Gaussian likelihood, tanpa mempertimbangkan batasan struktural antar domain. Akibatnya, embedding yang dihasilkan mungkin overfit terhadap data PPMI dan kehilangan koherensi semantik lintas domain.

Sebaliknya, JMAP memaksimalkan posterior gabungan yang mencakup likelihood maupun prior Gibbs. Fungsi objektif JMAP secara matematis ditulis sebagai:

$$(\hat{U}, \hat{\sigma}) = \arg\min_{U,\sigma} \left[ \frac{L_F}{2\sigma_F^2} + \frac{L_S}{2\sigma_S^2} + \frac{L_{RD}}{2\sigma_{RD}^2} + (T \cdot V^2) \log \sigma_F + (T \cdot V \cdot d)(\log \sigma_S + \log \sigma_{RD}) \right]$$

Prior Gibbs diperlakukan sebagai regulariser karena suku $L_S/(2\sigma_S^2)$ dan $L_{RD}/(2\sigma_{RD}^2)$ secara alami membatasi kompleksitas model. Semakin besar $L_S$ (semakin tidak koheren struktur embedding), semakin besar kontribusi negatif terhadap posterior. Parameter $\sigma$ mengontrol seberapa kuat regularisasi ini diterapkan: $\sigma$ kecil menyebabkan regularisasi ketat, sementara $\sigma$ besar melonggarkan batasan.

Hubungan dengan regularisasi klasik menjadi jelas jika kita perhatikan bahwa $\sigma_F^2/\sigma_S^2$ setara dengan parameter regularisasi $\lambda$ dalam formulasi deterministik W2VPred. Perbedaan utamanya adalah bahwa dalam JMAP, rasio ini diestimasi secara otomatis dari data melalui optimasi bersama, bukan ditentukan melalui grid search. Inilah esensi dari pendekatan Bayesian: ketidakpastian model dipelajari secara langsung dari data, bukan ditetapkan secara manual.

---

## 7. Full Bayesian vs MAP

Perbedaan mendasar antara full Bayesian inference dan MAP terletak pada representasi ketidakpastian posterior. Full Bayesian inference menghitung seluruh distribusi posterior $P(\theta, \sigma \mid D)$, yang memungkinkan pengukuran kuantil, interval kredibilitas, dan prediksi yang mempertimbangkan seluruh ketidakpastian parameter. Sebaliknya, MAP hanya mencari titik modus dari posterior: $(\hat{\theta}, \hat{\sigma}) = \arg\max P(\theta, \sigma \mid D)$. MAP adalah estimasi titik (point estimation) yang mengabaikan ketidakpastian di sekitar modus.

Dalam konteks W2VPred-MAP, penggunaan MAP dipilih karena dua pertimbangan utama. Pertama, dimensi ruang parameter sangat besar — total $n = T \cdot V \cdot d$ mencapai puluhan juta — sehingga integrasi numerik penuh melalui MCMC atau metode aproksimasi variasional menjadi tidak layak secara komputasi. Kedua, tujuan utama reformulasi adalah menghasilkan embedding yang lebih baik untuk tugas downstream, bukan melakukan inferensi kuantitatif terhadap ketidakpastian parameter. Estimasi titik MAP sudah cukup memadai untuk tujuan prediktif ini.

Selain itu, dalam limit data yang besar (large sample), distribusi posterior cenderung menyempit di sekitar modusnya sehingga MAP menjadi aproksimasi yang baik terhadap inferensi Bayesian penuh. Secara asimptotik, di bawah kondisi regularitas tertentu, estimator MAP konsisten dan efisien, menyamai sifat-sifat MLE namun dengan keunggulan tambahan berupa kemampuan memasukkan informasi prior. Dengan jumlah data yang besar pada setiap domain (matriks PPMI berukuran $V \times V$), asumsi asimptotik ini terpenuhi dengan baik.

---

## 8. Transformasi $s = \log \sigma^2$

Transformasi $s = \log \sigma^2$ digunakan untuk merepresentasikan parameter ketidakpastian $\sigma$ dalam bentuk yang lebih sesuai untuk optimasi gradien. Motivasi utamanya adalah kendala non-negatif: secara definisi, variansi $\sigma^2$ harus bernilai positif ($\sigma^2 > 0$). Namun, algoritma optimasi berbasis gradien seperti Adam bekerja pada ruang bilangan riil tak terbatas ($\mathbb{R}$) dan tidak memiliki mekanisme bawaan untuk menjaga $\sigma^2$ tetap positif. Tanpa transformasi, $\sigma^2$ dapat bergerak menuju nol atau bahkan negatif selama iterasi, menyebabkan pembagian dengan nol atau nilai NaN.

Dengan transformasi $s = \log \sigma^2$, parameter $s$ bebas bergerak di seluruh $\mathbb{R}$, sementara $\sigma^2 = e^s$ secara otomatis selalu positif untuk sembarang nilai $s$. Fungsi objektif setelah reparameterisasi berubah dari $L/(2\sigma^2) + (k/2)\log \sigma^2$ menjadi $\frac{1}{2} e^{-s} L + \frac{k}{2} s$, di mana $k$ adalah konstanta dimensional. Bentuk ini secara numerik lebih stabil karena menghindari pembagian langsung oleh $\sigma^2$.

Dampak terhadap optimasi JMAP sangat signifikan. Pertama, gradien terhadap $s$, yaitu $\partial J/\partial s = -\frac{1}{2} e^{-s} L + \frac{k}{2}$, memiliki komponen yang saling menyeimbangkan: suku pertama mendorong $s$ membesar (memperlemah regularisasi) sementara suku kedua mendorong $s$ mengecil (memperkuat regularisasi). Kedua, kurvatur fungsi objektif menjadi lebih halus dan konduksif terhadap konvergensi. Transformasi ini merupakan praktik standar dalam uncertainty-weighted multi-task learning, seperti yang digunakan oleh Kendall et al. (2018).

---

## 9. Ketergantungan Fungsi Partisi pada $\sigma$

Ketergantungan fungsi partisi $Z$ pada parameter skala $\sigma$ memiliki implikasi penting terhadap kontribusi prior Gibbs dalam fungsi objektif JMAP. Distribusi Gibbs untuk prior struktur ditulis sebagai $p_S(U \mid \sigma_S) = \frac{1}{Z_S(\sigma_S)} \exp\left(-\frac{L_S(U)}{2\sigma_S^2}\right)$, di mana $Z_S(\sigma_S)$ adalah konstanta normalisasi yang bergantung pada $\sigma_S$. Dalam log-posterior, kontribusi prior Gibbs menjadi $-\ln p_S = \frac{L_S}{2\sigma_S^2} + \ln Z_S(\sigma_S)$.

Telah ditunjukkan bahwa $Z_S(\sigma_S) = \sigma_S^n \cdot Z_S(1)$, sehingga $\ln Z_S(\sigma_S) = n \ln \sigma_S + \ln Z_S(1)$. Suku $\ln Z_S(1)$ adalah konstanta yang dapat diabaikan, tetapi suku $n \ln \sigma_S$ sangat penting karena menyediakan penalti terhadap $\sigma_S$ yang besar. Tanpa suku ini, optimasi dapat dengan mudah menaikkan $\sigma_S$ menuju tak terhingga untuk membuat $\frac{L_S}{2\sigma_S^2}$ mendekati nol, yang secara efektif menghilangkan pengaruh prior Gibbs.

Dengan adanya suku $n \ln \sigma_S$, terdapat keseimbangan alami: memperbesar $\sigma_S$ mengurangi kontribusi $L_S/(2\sigma_S^2)$ tetapi meningkatkan $n \ln \sigma_S$. Nilai optimal $\sigma_S$ tercapai ketika turunan dari kedua suku saling meniadakan, yaitu saat $\frac{\partial}{\partial \sigma_S}[\frac{L_S}{2\sigma_S^2} + n \ln \sigma_S] = 0$. Mekanisme ini memastikan bahwa prior Gibbs memberikan kontribusi yang proporsional terhadap kualitas struktur embedding, tanpa dominasi berlebihan dari salah satu komponen.

---

## 10. $\sigma$ Tunggal atau Per Domain?

Dalam model JMAP untuk dataset Hadith dengan 16 domain, parameter $\sigma$ tidak diestimasi per domain melainkan per komponen loss. Terdapat tiga parameter ketidakpastian: $\sigma_F$ untuk komponen fidelity (rekonstruksi PPMI), $\sigma_S$ untuk komponen struktur (kedekatan antar domain), dan $\sigma_{RD}$ untuk komponen relationship distinction (pembedaan hubungan). Masing-masing $\sigma$ bersifat global, berlaku untuk seluruh domain secara seragam.

Keputusan ini didasarkan pada peran fungsional masing-masing komponen loss. $\sigma_F$ mengontrol ketidakpastian rekonstruksi PPMI secara keseluruhan — jika data PPMI secara umum bising, $\sigma_F$ akan besar, memperlemah kontribusi fidelity. $\sigma_S$ mengontrol seberapa ketat batasan struktur antar domain — jika domain-domain memang sangat heterogen, $\sigma_S$ akan besar, melonggarkan batasan kesamaan embedding. Dengan demikian, setiap $\sigma$ menangkap aspek ketidakpastian yang bersifat global pada dataset.

Pendekatan per komponen ini berbeda dengan uncertainty weighting per-task pada MTL klasik (Kendall et al., 2018) di mana setiap task memiliki $\sigma$ sendiri. Dalam W2VPred-MAP, perlakuan per komponen lebih tepat karena semua domain berbagi mekanisme rekonstruksi yang sama (fidelity), struktur hubungan yang sama (graph domain), dan metrik pembedaan yang sama (RD). Jika $\sigma$ diestimasi per domain, jumlah parameter akan bertambah 16 kali lipat dan berpotensi menyebabkan overfitting pada parameter ketidakpastian, mengingat setiap domain hanya memiliki satu matriks PPMI sebagai sumber informasi.

---

## 11. MAP $\rightarrow$ MLE dengan Prior Uniform

Hubungan antara MAP dan MLE menjadi setara ketika prior $P(\theta)$ bersifat uniform (konstan) di seluruh ruang parameter. Dalam kasus ini, $P(\theta) \propto c$ sehingga $\ln P(\theta) = \text{konstanta}$ yang tidak bergantung pada $\theta$. Akibatnya, maksimisasi posterior MAP: $\hat{\theta}_{MAP} = \arg\max_\theta [\ln P(D \mid \theta) + \ln P(\theta)]$ mereduksi menjadi $\hat{\theta}_{MAP} = \arg\max_\theta \ln P(D \mid \theta) = \hat{\theta}_{MLE}$. Inilah mengapa MAP dipandang sebagai generalisasi dari MLE: MAP dengan prior uniform identik dengan MLE.

Dalam konteks JMAP dengan prior improper $P(\sigma) \propto 1$ (konstan), terdapat kasus khusus di mana JMAP dapat mereduksi menjadi MLE pada parameter tertentu. Jika prior improper $P(\sigma) \propto 1$ digunakan bersama dengan prior Gibbs $P(\theta \mid \sigma)$ yang bergantung pada $\sigma$, maka JMAP tidak sepenuhnya menjadi MLE karena prior Gibbs masih memberikan kontribusi regularisasi. Namun, jika kita mengambil limit $\sigma \to \infty$ pada prior Gibbs, maka $\frac{L_S}{2\sigma^2} \to 0$ dan $n \log \sigma \to \infty$, sehingga prior Gibbs mendominasi secara tidak proporsional — bukan MLE.

Sebaliknya, jika $P(\sigma)$ dipilih sebagai improper prior $P(\sigma^2) \propto 1/\sigma^2$ (setara dengan prior uniform untuk $\log \sigma$) dan kita hanya mengestimasi $\sigma$ tanpa prior Gibbs (hanya likelihood), maka MAP untuk $\sigma$ akan identik dengan MLE untuk $\sigma$. Namun dalam JMAP penuh dengan prior Gibbs, keseimbangan antara ketiga komponen loss tetap dipertahankan melalui suku $n \log \sigma$, sehingga hasil akhir berbeda dari MLE murni. Ini menunjukkan bahwa JMAP memberikan kerangka yang lebih kaya daripada sekadar MLE.

---

## 12. Skala Gradien Berbeda

Dalam JMAP, parameter embedding $\theta$ (matriks $U$) dan parameter ketidakpastian $\sigma$ memiliki skala gradien yang sangat berbeda. Gradien terhadap $U$ berasal dari turunan $L_F$, $L_S$, dan $L_{RD}$ yang melibatkan matriks berukuran $V \times d$, sementara gradien terhadap $\sigma$ hanya berupa skalar. Magnitudo gradien $U$ umumnya jauh lebih besar karena dipengaruhi oleh jumlah data observasi yang masif ($T \cdot V^2$ suku kuadrat), sedangkan gradien $\sigma$ relatif kecil karena hanya melibatkan suku $n/\sigma$ dan $-L/(2\sigma^3)$.

Penanganan perbedaan skala ini dilakukan melalui dua strategi utama. Pertama, penggunaan optimizer terpisah: setiap domain memiliki optimizer Adam sendiri untuk parameter embedding $U_t$, dan satu optimizer Adam terpisah untuk parameter $s$. Dengan optimizer terpisah, learning rate untuk embedding dapat diatur berbeda dari learning rate untuk $s$. Kedua, mekanisme akumulasi gradien: gradien untuk $s$ diakumulasi dari seluruh domain dalam satu outer step sebelum update, sedangkan parameter $U_t$ diperbarui per domain secara sekuensial.

Strategi alternating update ini memungkinkan setiap kelompok parameter dioptimasi dengan laju pembelajaran yang sesuai dengan skalanya masing-masing. Dalam implementasi, learning rate untuk embedding diatur lebih kecil ($\sim 10^{-3}$) dan untuk $s$ lebih besar ($\sim 10^{-2}$) untuk mengompensasi perbedaan magnitudo gradien. Pendekatan ini telah terbukti efektif dalam mencapai konvergensi yang stabil, sebagaimana didokumentasikan dalam literatur multi-task learning dengan uncertainty weighting.

---

## 13. Mengapa $L_S$ dan $L_{RD}$ Dipisah

Distribusi Gibbs untuk $L_S$ dan $L_{RD}$ memiliki bentuk energi yang berbeda secara fungsional meskipun sama-sama menggunakan metrik Frobenius. $L_S(U) = \sum_{t \neq t'} W_{t,t'} \|U_t - U_{t'}\|_F^2$ adalah fungsi energi yang bobotnya ditentukan oleh matriks kedekatan domain $W$. Energi ini bersifat linier terhadap bobot $W$ dan kuadratik terhadap selisih embedding, sehingga mendorong domain-domain yang serupa untuk memiliki embedding yang dekat. Semakin besar $W_{t,t'}$, semakin kuat tarikan antara domain $t$ dan $t'$.

Sebaliknya, $L_{RD}(U) = \sqrt{\sum_{t \neq t'} D_{t,t'}^2}$ dengan $D_{t,t'} = \|U_t - U_{t'}\|_F^2$ memiliki bentuk akar kuadrat dari jumlah kuadrat jarak. Keberadaan akar kuadrat membuat $L_{RD}$ tidak dapat difaktorisasi menjadi fungsi energi Gibbs yang sama dengan $L_S$. Secara intuitif, $L_{RD}$ mendorong pembedaan yang proporsional antar domain — memastikan bahwa embedding tidak semuanya runtuh ke titik yang sama — sementara $L_S$ mendorong kedekatan sesuai topologi domain.

Jika keduanya digabung menjadi satu prior Gibbs, akan sulit mengontrol kontribusi relatif antara dorongan untuk mendekat (dari $L_S$) dan dorongan untuk menjauh/membedakan (dari $L_{RD}$). Dengan memisahkan keduanya, JMAP dapat mengestimasi dua parameter ketidakpastian yang berbeda, yaitu $\sigma_S$ dan $\sigma_{RD}$, yang secara independen mengontrol kekuatan masing-masing batasan. Hal ini memberikan fleksibilitas yang lebih besar dalam menyeimbangkan trade-off antara koherensi struktur dan diskriminabilitas embedding.

---

## 14. Sensitivitas terhadap $n$ Besar

Ketika $n = T \cdot V \cdot d$ sangat besar, suku penalti $n \log \sigma_S$ dalam fungsi objektif JMAP menjadi sangat dominan. Perilaku prior Gibbs terhadap perubahan $\sigma_S$ berubah secara signifikan karena suku logaritmik ini tumbuh secara linier terhadap $n$, sementara suku $L_S/(2\sigma_S^2)$ bergantung pada nilai loss yang mungkin juga besar tetapi tidak secara langsung dipengaruhi oleh $n$. Akibatnya, penalti untuk $\sigma_S$ yang besar menjadi sangat berat, mendorong estimasi $\sigma_S$ ke nilai yang lebih kecil.

Implikasinya terhadap estimasi $\sigma_S$ adalah bahwa parameter ketidakpastian struktur akan cenderung kecil pada dataset dengan kosakata besar dan dimensi embedding tinggi. Hal ini sebenarnya diinginkan: dengan lebih banyak parameter embedding, keyakinan terhadap struktur antar domain seharusnya meningkat karena terdapat lebih banyak informasi yang mendukung konsistensi geometris. Secara interpretatif, $\sigma_S$ yang kecil berarti batasan struktur diterapkan dengan ketat, yang masuk akal jika kita memiliki kapasitas representasi yang besar.

Namun, terdapat risiko over-penalization jika $n$ terlalu besar relatif terhadap skala $L_S$. Dalam kasus ekstrem, optimasi dapat terjebak di $\sigma_S \to 0$ yang membuat suku $L_S/(2\sigma_S^2)$ meledak dan mendominasi fungsi objektif. Untuk mengatasi hal ini, normalisasi melalui konstanta $c_S = T \cdot V \cdot d$ diterapkan untuk menyeimbangkan skala antara suku energi dan suku logaritmik. Normalisasi ini memastikan bahwa kontribusi prior Gibbs tetap proporsional terhadap kapasitas model tanpa mendominasi secara berlebihan.

---

## 15. Alternatif Prior Informatif

Sebagai alternatif prior improper $P(\sigma) \propto 1$ yang digunakan dalam penelitian ini, terdapat beberapa prior informatif yang dapat dipertimbangkan. Pertama, prior conjugate Inverse-Gamma untuk variansi: $\sigma^2 \sim \text{Inv-Gamma}(\alpha, \beta)$, dengan bentuk $P(\sigma^2) \propto (\sigma^2)^{-\alpha-1} \exp(-\beta/\sigma^2)$. Prior ini bersifat conjugate terhadap likelihood Gaussian, sehingga posterior memiliki bentuk analitik yang sama. Kelebihan utamanya adalah kemudahan komputasi dan interpretasi parameter $\alpha$ dan $\beta$ sebagai jumlah prior pseudo-observations dan prior sum of squares.

Kedua, prior weakly-informative seperti Half-Cauchy($0, \gamma$) untuk $\sigma$, yang direkomendasikan oleh Gelman (2006) untuk parameter skala dalam model hierarki. Prior ini memiliki ekor yang berat (heavy tail) sehingga tidak terlalu restriktif, namun tetap proper dan memberikan regularisasi yang lebih baik daripada prior improper pada kasus dengan data sedikit. Kelebihan Half-Cauchy adalah stabilitas numerik yang lebih baik dan properti regularisasi yang halus.

Perbandingan dengan prior improper yang digunakan: prior improper memberikan fleksibilitas maksimal karena tidak memaksakan informasi apapun pada estimasi $\sigma$. Namun, kelemahannya adalah risiko posterior improper jika data tidak cukup informatif. Prior Inverse-Gamma memberikan kendali penuh melalui parameter $\alpha$ dan $\beta$, tetapi dapat terlalu restriktif jika parameter tidak dipilih dengan tepat. Prior Half-Cauchy menawarkan kompromi yang baik antara fleksibilitas dan stabilitas. Dalam penelitian ini, prior improper dipilih karena jumlah data yang besar (matriks PPMI dengan $V \sim 50.000$) menjamin posterior yang proper, dan kesederhanaan prior improper memudahkan derivasi analitik suku $n \log \sigma$.

---

## 16. Syarat Konvergensi Fungsi Partisi

Fungsi partisi Gibbs $Z_S(\sigma_S) = \int_{\mathbb{R}^n} \exp(-L_S(U)/(2\sigma_S^2)) dU$ harus bernilai finite (terhingga) agar distribusi Gibbs terdefinisi dengan baik. Syarat utama konvergensinya adalah bahwa fungsi energi $L_S(U)$ harus tumbuh cukup cepat seiring $\|U\| \to \infty$ sehingga integral eksponensialnya konvergen. Secara spesifik, $L_S(U)$ harus bersifat coercive, yaitu $L_S(U) \to \infty$ ketika $\|U\| \to \infty$, dan laju pertumbuhannya minimal harus setara dengan $\|U\|^2$ (kuadratik).

Dalam W2VPred-MAP, $L_S(U) = \sum_{t \neq t'} W_{t,t'} \|U_t - U_{t'}\|_F^2$ memenuhi syarat ini karena merupakan jumlah dari norma Frobenius kuadrat. Fungsi $\|U_t - U_{t'}\|_F^2$ bersifat kuadratik dan positif untuk setiap pasangan domain, sehingga $L_S(U)$ menjamin pertumbuhan minimal $\mathcal{O}(\|U\|^2)$. Oleh karena itu, integrand $\exp(-L_S/(2\sigma_S^2))$ meluruh secara Gaussian, menjamin konvergensi integral di seluruh $\mathbb{R}^n$.

Namun, perlu diperhatikan bahwa $L_S(U)$ tidak strictly convex terhadap seluruh elemen $U$ secara simultan. Sifat invarian translasi — yaitu $L_S(U + C) = L_S(U)$ untuk matriks konstanta $C$ yang seragam di semua domain — menyebabkan fungsi energi memiliki manifold datar (zero-energy manifold). Inilah yang menyebabkan prior Gibbs menjadi improper (tidak ternormalisasi secara global), karena integral di sepanjang arah translasi tidak konvergen. Sifat ini tidak mengganggu estimasi JMAP karena gradien terhadap arah translasi tetap nol, dan yang penting adalah konvergensi di arah-arah ortogonal terhadap manifold datar tersebut.

---

## 17. Mekanisme Penemuan Keseimbangan

Mekanisme teoretis bagaimana JMAP menemukan keseimbangan antara $L_F$, $L_S$, dan $L_{RD}$ dapat dijelaskan melalui prinsip inverse variance weighting. Fungsi objektif JMAP: $J = \frac{L_F}{2\sigma_F^2} + \frac{L_S}{2\sigma_S^2} + \frac{L_{RD}}{2\sigma_{RD}^2} + (T \cdot V^2)\log \sigma_F + (T \cdot V \cdot d)(\log \sigma_S + \log \sigma_{RD})$ menunjukkan bahwa setiap komponen loss dibagi oleh $2\sigma^2$ yang bersesuaian. Bobot efektif komponen $L_F$ dalam loss total adalah $1/(2\sigma_F^2)$, bobot $L_S$ adalah $1/(2\sigma_S^2)$, dan seterusnya.

Parameter $\sigma$ diestimasi melalui optimasi bersama, di mana gradien terhadap $\sigma_F$ misalnya adalah: $\frac{\partial J}{\partial \sigma_F} = -\frac{L_F}{\sigma_F^3} + \frac{T \cdot V^2}{\sigma_F}$. Pada titik optimal, gradien ini sama dengan nol, sehingga $\sigma_F^2 = \frac{L_F}{T \cdot V^2}$. Dengan kata lain, $\sigma_F$ pada optimalitas sebanding dengan akar rata-rata loss fidelity per entri PPMI. Semakin besar $L_F$ (semakin buruk rekonstruksi), semakin besar $\sigma_F$, sehingga bobot $L_F$ mengecil secara adaptif.

Mekanisme serupa berlaku untuk $\sigma_S$ dan $\sigma_{RD}$. Hasil bersihnya adalah JMAP secara otomatis menyeimbangkan kontribusi ketiga komponen loss berdasarkan kesulitan intrinsik masing-masing. Komponen yang loss-nya tinggi (sulit dipenuhi) mendapat bobot lebih kecil, sementara komponen yang loss-nya rendah (mudah dipenuhi) mendapat bobot lebih besar. Inilah yang membedakan JMAP dari W2VPred asli dengan bobot tetap $\tau$ dan $\lambda$: penyeimbangan dilakukan secara adaptif dan dinamis sepanjang pelatihan, bukan secara statis melalui grid search.

---

## 18. Kaitan dengan Bayesian Model Averaging

Hasil empiris bahwa W2VPred-MAP menghasilkan representasi embedding yang lebih baik dapat dikaitkan dengan prinsip regularisasi Bayesian. Dalam ridge regression, estimasi MAP dengan prior Gaussian $P(\theta) \propto \exp(-\lambda \|\theta\|^2)$ menghasilkan regularisasi L2 yang mengecilkan koefisien menuju nol secara proporsional. Semakin besar $\lambda$, semakin kuat regularisasi. Dalam W2VPred-MAP, prior Gibbs $L_S$ dan $L_{RD}$ bertindak sebagai regulariser yang mirip, namun dengan parameter kekuatan $1/(2\sigma_S^2)$ dan $1/(2\sigma_{RD}^2)$ yang diestimasi secara adaptif.

Kaitan dengan Bayesian model averaging (BMA) lebih bersifat konseptual daripada matematis langsung. BMA melakukan rata-rata tertimbang atas beberapa model dengan bobot proportional to posterior model probability. Dalam W2VPred-MAP, kita tidak melakukan rata-rata model, melainkan mengestimasi satu model dengan regularisasi adaptif. Namun, prinsip yang mendasarinya sama: memberikan bobot yang sesuai pada setiap sumber informasi (fidelity data, struktur domain, pembedaan hubungan) berdasarkan tingkat ketidakpastiannya.

Dalam praktiknya, regularisasi Bayesian melalui JMAP mengatasi kelemahan overfitting yang mungkin terjadi jika hanya mengandalkan MLE pada data multi-domain yang heterogen. Dengan memberikan penalti yang lebih besar pada komponen loss yang tidak stabil (ditandai oleh $\sigma$ besar), JMAP secara efektif melakukan shrinkage — analog dengan ridge regression — yang mencegah embedding overfit terhadap noise spesifik domain. Inilah yang secara teoretis menjelaskan peningkatan performa UW-MAP dibandingkan Baseline pada dataset WikiFoS 16 domain.

---

> **Catatan:** Jawaban di atas disusun berdasarkan kerangka teoretis reformulasi probabilistik W2VPred menggunakan JMAP. Setiap jawaban mengacu pada formulasi matematis yang konsisten dengan notasi yang digunakan dalam skripsi dan publikasi terkait. Jika diperlukan elaborasi lebih lanjut pada poin tertentu, silakan merujuk pada konsep terkait di wiki atau literatur primer.

---

*Disusun: 2026-05-12*
*Kategori: preparation/sidang*
*Tautan terkait: [[Bank_Pertanyaan_Sidang]] | [[Jawaban_Kategori_B]] | [[Jawaban_C_Metodologi]]*
