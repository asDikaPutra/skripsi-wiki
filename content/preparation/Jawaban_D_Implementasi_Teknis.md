# Jawaban Sidang — Kategori D: Implementasi Teknis

## 20 Pertanyaan dan Jawaban Lengkap

---

### D1. Bagaimana arsitektur kelas W2VPred dirancang? Jelaskan setiap parameter utama constructor-nya.

**Jawaban:**

Kelas `W2VPred` dirancang sebagai model multi-domain word embedding yang merepresentasikan vektor-vektor kata di setiap domain secara independen namun tetap diikat oleh regularisasi lintas domain. Constructor menerima parameter `tau` (koefisien untuk loss L_RD), `lam` (koefisien untuk loss L_S), `V` (ukuran kosakata), `T` (jumlah domain), dan `d` (dimensi embedding). Parameter `use_uncertainty_weighting` (boolean) menentukan mode operasi: jika `False`, model berjalan dalam mode Baseline dengan koefisien tetap `[1.0, tau, lam]`; jika `True`, model mengaktifkan Uncertainty Weighting dengan parameter belajar `s = log(σ²)`.

Parameter `init_s` menginisialisasi nilai awal `s` untuk setiap komponen loss (biasanya 0.0, yang berarti σ² = 1 dan σ = 1). Parameter `debug_mode` mengaktifkan logging diagnostik yang ekstensif. Dua parameter tambahan `u_init_low` dan `u_init_high` mengontrol rentang inisialisasi uniform untuk embedding U_t. Di dalam constructor, model menyiapkan tiga konstanta normalisasi penting: `c_F = T × V²`, `c_S = T × V × d`, dan `c_RD = T × V × d` yang digunakan dalam perhitungan loss pada mode Uncertainty Weighting.

Model menyimpan T buah matriks embedding `self.U` (masing-masing berukuran V × d dengan `requires_grad=True`), matriks jarak `self.D` (T × T), serta tiga parameter uncertainty `self.s_F`, `self.s_RD`, `self.s_S` (sebagai `nn.Parameter`) jika mode UW aktif. Struktur logging yang lengkap juga disiapkan untuk mencatat riwayat loss, bobot, sigma, presisi, gradien, dan rasio konvergensi.

---

### D2. Mengapa setiap domain memiliki optimizer Adam sendiri? Apa keuntungan arsitektur ini?

**Jawaban:**

Setiap domain memiliki optimizer Adam sendiri karena arsitektur pelatihan menggunakan strategi *sequential domain update*, di mana embedding domain `U_t` diperbarui satu per satu secara bergantian dalam setiap *outer step*. Jika hanya satu optimizer global yang digunakan untuk semua `U_t`, mekanisme momentum dan adaptive learning rate Adam akan tercampur antar domain — gradien dari domain yang berbeda akan memengaruhi *first moment* dan *second moment* yang sama, sehingga sinyal update tidak spesifik per domain.

Keuntungan utama dari pendekatan ini adalah setiap optimizer dapat mempertahankan state momentum yang spesifik untuk domain masing-masing. Hal ini penting karena setiap domain memiliki distribusi data dan karakteristik gradien yang berbeda. Sebagai contoh, domain "Sports" dan "Politics" dalam dataset WikiFoS memiliki struktur PPMI yang sangat berbeda, sehingga trajectory optimasi yang optimal untuk embedding domain tersebut juga berbeda. Dengan optimizer terpisah, kita memberikan kebebasan adaptif pada setiap domain untuk mengeksplorasi ruang parameter embedding-nya masing-masing tanpa gangguan dari domain lain. Inisialisasi optimizer dilakukan secara lazy di method `fit()` trainer dan learning rate-nya diperbarui secara seragam melalui scheduler setiap kali terjadi perubahan step.

---

### D3. Jelaskan mekanisme akumulasi gradien untuk parameter uncertainty `s`. Mengapa tidak di-update per domain?

**Jawaban:**

Parameter uncertainty `s = {s_F, s_RD, s_S}` hanya di-update satu kali di akhir setiap *outer step*, setelah seluruh T domain selesai diproses. Mekanismenya adalah sebagai berikut: di awal step, gradien `s` di-*zero* kan satu kali melalui `optimizer_uncertainty.zero_grad()`. Kemudian untuk setiap domain `t` dalam urutan acak, model menjalankan *forward pass* yang menghasilkan `total_loss` (yang mengandung kontribusi dari ketiga komponen loss untuk domain tersebut beserta term regularisasi `s`) lalu memanggil `loss.backward()`. Gradien dari setiap domain terhadap `s` akan terakumulasi secara otomatis oleh PyTorch karena `s` adalah parameter bersama yang digunakan di semua domain.

Parameter `s` tidak di-update per domain karena `s` merepresentasikan ketidakpastian global yang berlaku untuk seluruh dataset multi-domain, bukan per domain. Jika `s` diperbarui setiap kali selesai memproses satu domain, maka bobot loss untuk domain-domain berikutnya akan berubah di tengah langkah, menciptakan ketergantungan urutan (*ordering bias*) yang tidak diinginkan. Dengan mengakumulasi gradien dari seluruh T domain baru kemudian melakukan satu langkah Adam, estimator gradien untuk `s` menjadi lebih stabil karena didasarkan pada agregasi informasi dari semua domain. Strategi ini sejalan dengan prinsip JMAP (*Joint Maximum A Posteriori*) di mana parameter hyperparameter (uncertainty) diestimasi secara bersama dengan parameter model (embedding) dalam skema optimasi dua tingkat.

---

### D4. Bagaimana mekanisme forward pass untuk satu domain? Komponen loss apa saja yang dihitung?

**Jawaban:**

Method `forward(self, Y, t)` menerima daftar matriks PPMI `Y` (dalam format sparse tensor) dan indeks domain `t`, lalu menghitung tiga komponen loss. Komponen pertama adalah **L_F** (Fidelity Loss) yang mengukur kesalahan rekonstruksi: `‖Y[t] - U_t × U_tᵀ‖²`, yaitu Frobenius norm kuadrat dari selisih antara matriks PPMI asli dan rekonstruksi hasil produk embedding. Matriks PPMI di-*convert* ke dense terlebih dahulu karena operasi `@` (matmul) pada sparse tensor hasilnya tetap sparse dan perlu di-dense-kan.

Komponen kedua adalah **L_RD** (Regularization-Domain Distance) yang dihitung dengan terlebih dahulu memanggil `compute_distance_matrix()` untuk mendapatkan matriks `D` berisi jarak Euclidean kuadrat antar semua pasangan embedding domain, kemudian menghitung `‖D‖` (Frobenius norm dari matriks jarak). Komponen ketiga adalah **L_S** (Structure Loss) yang melibatkan matriks bobot struktur `w` yang dihitung dari `compute_structure_weights()`, lalu menghitung `(w[t] · D[t]).sum()`. Setelah ketiga komponen diperoleh, total loss dihitung: dalam mode Baseline menjadi `L = L_F + tau·L_RD + lam·L_S`, sedangkan dalam mode UW menjadi `L = ½·precision_F·L_F + ½·precision_RD·L_RD + ½·precision_S·L_S + regulasi`.

---

### D5. Jelaskan secara detail perhitungan loss Fidelity (L_F). Mengapa menggunakan Frobenius norm dan bukan MSE?

**Jawaban:**

Loss Fidelity (L_F) dihitung sebagai `torch.norm(Y[t].to_dense() - U[t] @ U[t].t()) ** 2`, yang secara matematis ekuivalen dengan `‖Y_t - U_t U_tᵀ‖_F²`, yaitu kuadrat dari Frobenius norm matriks selisih. Jika dijabarkan, ini sama dengan `Σᵢⱼ (Y_t[i,j] - (U_t U_tᵀ)[i,j])²`, yang secara numerik identik dengan MSE (Mean Squared Error) yang dikalikan dengan jumlah elemen V².

Penggunaan Frobenius norm daripada membagi dengan V² (yang akan menghasilkan MSE sesungguhnya) adalah keputusan desain yang disengaja untuk mempertahankan **skala loss original**. Dalam konteks multi-task learning dengan Uncertainty Weighting, skala absolut dari setiap komponen loss sangat penting karena memengaruhi keseimbangan antar task secara alami. Jika setiap komponen dinormalisasi menjadi MSE, informasi tentang magnitudo relatif antar komponen akan hilang. Selain itu, perhitungan `torch.norm(X) ** 2` lebih efisien secara komputasi daripada menghitung `torch.sum(X ** 2)` karena PyTorch mengoptimasi operasi norm untuk matriks — operasi ini menghitung akar kuadrat dari jumlah kuadrat lalu mengkuadratkannya kembali, namun implementasi PyTorch menggunakan rutin BLAS yang lebih optimal untuk matriks besar.

---

### D6. Bagaimana struktur loss L_RD dihitung dan apa tujuannya dalam model?

**Jawaban:**

Loss L_RD dihitung melalui dua langkah. Pertama, method `compute_distance_matrix()` menghasilkan matriks `D` berukuran T × T di mana elemen `D[i,j]` adalah kuadrat jarak Euclidean antara vektor embedding domain `U_i` dan `U_j` yang telah di-*flatten*: `v = stack(U).view(T, -1)` menghasilkan matriks T × (V·d), lalu `pdist(v, p=2)²` menghitung seluruh jarak pairwise. Hasilnya ditempatkan dalam matriks segitiga atas dan direfleksikan untuk menghasilkan matriks simetris. Kedua, L_RD dihitung sebagai Frobenius norm dari matriks `D` tersebut: `‖D‖_F`, atau secara eksplisit `sqrt(Σᵢⱼ D[i,j]²)`.

Tujuan L_RD adalah memberikan regularisasi yang mendorong embedding antar domain untuk tidak terlalu berjauhan. Tanpa regularisasi ini, setiap embedding domain `U_t` bisa saja belajar representasi yang sangat berbeda satu sama lain, sehingga transfer learning antar domain menjadi tidak bermakna. L_RD bertindak sebagai *smoothing penalty* yang mengontrol *variance* antar domain: semakin besar koefisien `τ` (atau semakin kecil ketidakpastian yang dipelajari pada mode UW), semakin kuat gaya tarik-menarik antar domain. Dalam kerangka JMAP, L_RD dapat diinterpretasikan sebagai prior Gaussian yang mendorong embedding domain untuk berada di sekitar mean bersama. Normalisasi L_RD melalui konstanta `c_RD = T·V·d` pada mode UW memastikan bahwa term regularisasi ini memiliki bobot yang proporsional dengan dimensi ruang embedding.

---

### D7. Jelaskan algoritma di balik `compute_structure_weights()` dan bagaimana L_S dihitung.

**Jawaban:**

Method `compute_structure_weights()` menghasilkan matriks bobot `w` yang merepresentasikan kedekatan struktural antar domain. Algoritmanya sebagai berikut: pertama, bobot pairwise awal dihitung sebagai invers jarak: `w[i,j] = 1 / (D[i,j] + ε)` untuk `i < j`, di mana ε = 1e-8 adalah konstanta kecil untuk menghindari pembagian dengan nol. Semakin kecil jarak antar dua domain, semakin besar bobot strukturnya. Matriks bobut kemudian dibuat simetris (`w = w + w.T`).

Langkah kedua adalah normalisasi baris-kolom: `denom[i,j] = sum(w[i,:]) + sum(w[:,j])`, lalu bobot akhir adalah `N[i,j] = 1 / (denom[i,j] + ε)` dan hasil akhir `w_final = w * N`. Normalisasi ini memastikan bahwa bobot untuk setiap pasangan domain tidak hanya bergantung pada jarak pairwise tetapi juga pada konteks global dari semua domain — mirip dengan prinsip *degree normalization* dalam graph Laplacian.

Setelah matriks bobot `w` diperoleh, Loss Struktur L_S untuk domain `t` dihitung sebagai `Σⱼ w[t,j] × D[t,j]`, yaitu jumlah bobot dari domain `t` ke semua domain lain dikalikan dengan jarak. Secara keseluruhan, L_S mendorong struktur embedding antar domain untuk konsisten: domain-domain yang dekat secara struktural (bobot tinggi) seharusnya memiliki jarak embedding yang kecil, sementara domain yang jauh secara tematis bisa memiliki jarak lebih besar. Berbeda dengan L_RD yang bersifat global (semua pasangan diperlakukan sama), L_S bersifat adaptif terhadap topologi domain.

---

### D8. Bagaimana perhitungan total loss pada mode Baseline versus Uncertainty Weighting? Jelaskan perbedaannya secara matematis.

**Jawaban:**

Pada mode **Baseline**, total loss dihitung sebagai kombinasi linear sederhana: `L_total = L_F + τ·L_RD + λ·L_S`, di mana `τ` (tau) dan `λ` (lam) adalah hyperparameter tetap yang ditentukan sebelum pelatihan. Bobot `L_F` secara implisit adalah 1.0. Dalam implementasi, nilai `current_weights` disimpan sebagai tensor `[1.0, tau, lam]` dan tidak dinormalisasi. Model Baseline tidak memiliki mekanisme adaptasi — jika skala L_F jauh lebih besar dari L_RD dan L_S, maka optimasi akan didominasi oleh fidelity tanpa ada penyesuaian otomatis.

Pada mode **Uncertainty Weighting**, total loss mengikuti prinsip JMAP: `L_total = ½·precision_F·L_F + ½·precision_RD·L_RD + ½·precision_S·L_S + ½·c_F·s_F/T + ½·c_RD·s_RD/T + ½·c_S·s_S/T`. Di sini `precision_k = exp(-s_k)` adalah presisi (inverse variance) dari setiap task, dan `s_k = log(σ_k²)` adalah parameter uncertainty yang dipelajari. Term `½·c_k·s_k/T` adalah regularisasi dari prior log-uniform (improper prior) yang mencegah `σ² → ∞`. Perbedaan fundamentalnya adalah: pada Baseline, bobot antar task bersifat tetap dan ditentukan secara manual melalui grid search; pada Uncertainty Weighting, bobot `1/(2σ²)` dipelajari secara otomatis dari data berdasarkan dinamika loss. Jika suatu task memiliki loss yang besar dan sulit dipelajari, maka `σ²` akan meningkat dan bobot task tersebut akan mengecil secara adaptif.

---

### D9. Apa fungsi konstanta normalisasi `c_F`, `c_S`, dan `c_RD`? Mengapa nilainya berbeda?

**Jawaban:**

Konstanta normalisasi `c_F = T·V²`, `c_S = T·V·d`, dan `c_RD = T·V·d` memiliki dua fungsi utama dalam mode Uncertainty Weighting. Pertama, mereka menyeimbangkan skala antara term *weighted loss* dan term regularisasi `½·c·s/T` dalam total loss JMAP. Kedua, mereka memastikan bahwa kecepatan update parameter `s` tidak bergantung secara artifisial pada dimensi masalah (V, T, d), sehingga hasil uncertainty weighting bersifat *scale-invariant*.

Nilai `c_F` berbeda dari `c_S` dan `c_RD` karena skala dari masing-masing komponen loss berbeda secara fundamental. L_F adalah kuadrat Frobenius norm dari matriks V×V sehingga skala naturalnya adalah V² (jumlah elemen matriks). Jika dikalikan dengan T (jumlah domain), kita mendapatkan `T·V²`. Sebaliknya, L_RD adalah norm dari matriks jarak T×T, dan L_S adalah jumlah dari T elemen — keduanya memiliki dimensi yang lebih kecil. Konstanta `T·V·d` untuk L_S dan L_RD dipilih karena dimensi embedding `d` muncul dalam *flattened view* saat menghitung matriks jarak. Penyetaraan `c_S = c_RD = T·V·d` mencerminkan fakta bahwa kedua komponen loss ini beroperasi pada ruang embedding yang sama dengan dimensi V·d.

---

### D10. Bagaimana inisialisasi parameter uncertainty `s` dilakukan dan apa dampaknya pada konvergensi?

**Jawaban:**

Parameter uncertainty `s_F`, `s_RD`, dan `s_S` diinisialisasi melalui parameter `init_s` pada constructor, dengan nilai default 0.0. Inisialisasi `s_k = 0` berarti `σ_k² = exp(0) = 1` dan `σ_k = 1`, sehingga bobot awal setiap task adalah `1/(2×1) = 0.5` sebelum regularisasi. Dalam praktiknya, dengan tiga task, bobot awal setelah penjumlahan bobot kira-kira seimbang. Pilihan `init_s = 0` bersifat netral — tidak memberikan prior bias terhadap task manapun.

Dampak inisialisasi pada konvergensi cukup signifikan. Jika `init_s` terlalu kecil (negatif besar, misal -10), maka σ² mendekati nol dan `1/(2σ²)` menjadi sangat besar, menyebabkan loss awal didominasi oleh komponen weighted loss yang ekstrem dan gradien uncertainty yang besar — dapat menyebabkan *instability* di awal training. Sebaliknya, jika `init_s` terlalu besar (positif besar, misal 5), maka bobot task sangat kecil sehingga model hampir tidak memberikan kontribusi apapun pada total loss, mengakibatkan embedding belajar lambat. Inisialisasi data-driven yang sempat dikembangkan (namun tidak diaktifkan) menggunakan rumus `s_k^(0) = log(L_k^(0) / c_k)` untuk menempatkan s pada titik ekuilibrium teoritis antara weighted loss dan regularisasi. Mekanisme *clamping* pada rentang [-10, 5] atau [-3, 4] (tergantung versi) mencegah s melayang ke nilai ekstrem.

---

### D11. Bagaimana mekanisme gradient clipping diterapkan dan mengapa diperlukan?

**Jawaban:**

Gradient clipping diterapkan setelah setiap `loss.backward()` dan sebelum `optimizer_emb.step()` pada setiap domain. Implementasinya menggunakan `torch.nn.utils.clip_grad_norm_([model.U[t]], max_norm=1.0)`, yang membatasi norma Euclidean total dari gradien embedding untuk domain `t` agar tidak melebihi 1.0. Jika norma gradien melebihi threshold, semua komponen gradien akan diskalakan secara proporsional sehingga normanya tepat sama dengan `max_norm`.

Gradient clipping diperlukan karena beberapa alasan. Pertama, matriks PPMI bersifat sparse dan memiliki nilai yang sangat bervariasi — beberapa elemen bisa sangat besar (terutama pada kata-kata frekuensi tinggi dengan PMI positif besar), menghasilkan gradien dengan magnitude yang tidak stabil. Kedua, loss L_F yang menggunakan Frobenius norm tanpa normalisasi MSE memiliki skala yang bergantung pada V², sehingga pada kosakata besar (ratusan ribu kata), nilai loss dan gradien bisa meledak (*exploding gradients*). Ketiga, arsitektur sequential update per domain memperparah masalah ini karena update yang ekstrem pada satu domain di awal step dapat mengganggu keseimbangan embedding domain lainnya. Clipping gradien dengan threshold 1.0 memberikan keseimbangan antara stabilitas numerik dan kecepatan konvergensi — cukup ketat untuk mencegah divergensi namun cukup longgar untuk memungkinkan progres yang berarti.

---

### D12. Bagaimana urutan pemrosesan domain ditentukan dan apa dampaknya pada hasil pelatihan?

**Jawaban:**

Urutan pemrosesan domain ditentukan secara acak setiap *outer step* melalui `self.it_T = lambda: np.random.permutation(range(self.T))`. Setiap kali `step()` dipanggil, daftar indeks domain `[0, 1, ..., T-1]` diacak menggunakan `np.random.permutation` sehingga urutan kunjungan domain berbeda antar step. Tanpa pengacakan, jika domain selalu diproses dalam urutan yang sama (misal 0, 1, 2, ...), akan timbul bias sistematis: domain yang diproses di awal step akan mengalami gradien dari embedding yang belum di-update oleh domain lain, sementara domain yang diproses di akhir step akan melihat embedding yang sudah dipengaruhi oleh update dari semua domain sebelumnya.

Dampak dari pengacakan urutan adalah distribusi *bias temporal* yang lebih merata antar domain. Meskipun akumulasi gradien untuk parameter `s` tetap menggunakan informasi dari semua domain (karena `s` tidak di-update per domain), embedding `U_t` di-update segera setelah backward untuk domain tersebut. Oleh karena itu, urutan memengaruhi state embedding yang dilihat oleh domain berikutnya dalam step yang sama. Pengacakan memastikan bahwa tidak ada domain yang secara konsisten mendapatkan keuntungan posisi (*positional advantage*), sehingga estimasi gradien untuk setiap domain lebih representatif terhadap kondisi global model. Ini penting terutama pada awal training saat embedding masih jauh dari konvergensi.

---

### D13. Bagaimana proses logging dan penyimpanan checkpoint dilakukan? Data apa saja yang disimpan?

**Jawaban:**

Proses logging dan checkpoint diatur dalam method `fit()` pada Trainer dengan dua frekuensi berbeda: `log_freq` (biasanya 5 step) untuk logging diagnostik detail ke konsol dan file log, serta `checkpoint_freq` (biasanya 50 step) untuk menyimpan state model ke disk. Setiap `log_freq` step, trainer mencetak informasi lengkap yang mencakup total loss, komponen loss individual (L_F, L_RD, L_S), rasio loss, bobot task (atau koefisien baseline), parameter uncertainty, statistik gradien, dan laju konvergensi. Semua informasi ini juga ditulis ke file `training_log.txt` dalam format JSON.

Setiap `checkpoint_freq` step, fungsi `save_var()` menyimpan berbagai tensor dan dictionary ke file menggunakan format PyTorch (.pt via `torch.save`). Data yang disimpan meliputi: embedding `U` yang telah di-*stack* dan dipindahkan ke CPU, riwayat loss (`L_F, L_RD, L_S, total`), riwayat bobot, riwayat konvergensi, rasio loss, log gradien, serta jika mode UW aktif: riwayat `s`, sigma (`exp(s/2)`), dan presisi (`exp(-s)`). Pada akhir pelatihan, seluruh data disimpan sekali lagi dengan akhiran `_final`. File-file ini memungkinkan analisis post-hoc yang mendalam, termasuk visualisasi trajectories konvergensi, analisis stabilitas bobot uncertainty, dan rekonstruksi embedding untuk evaluasi downstream.

---

### D14. Bagaimana mekanisme penjadwalan learning rate (learning rate scheduler) bekerja dan apa perannya?

**Jawaban:**

Terdapat dua fungsi scheduler yang terpisah. Fungsi `lr_scheduler(step)` mengatur learning rate untuk optimizer embedding `U_t` dengan skema step-based decay tiga fase: `lr = 0.1` untuk step 0-99, `lr = 0.05` untuk step 100-299, dan `lr = 0.01` untuk step ≥ 300. Fungsi `lr_scheduler_uncertainty(step)` pada versi terbaru menggunakan skema yang identik (0.1, 0.05, 0.01), namun pada versi awal menggunakan learning rate yang lebih kecil (0.01, 0.005, 0.001) karena parameter uncertainty `s` memerlukan update yang lebih halus.

Peran scheduler adalah menyeimbangkan eksplorasi dan konvergensi. Di awal training (step < 100), learning rate tinggi (0.1) memungkinkan embedding bergerak cepat dari inisialisasi acak menuju wilayah yang masuk akal. Fase menengah (100-299) dengan LR menengah melanjutkan fine-tuning. Fase akhir dengan LR rendah memastikan konvergensi stabil tanpa overshooting. Penting untuk dicatat bahwa scheduler memeriksa perubahan LR setiap step, dan jika LR berubah, semua optimizer embedding diperbarui nilai `lr`-nya melalui `param_groups[0]['lr'] = lr_baru`. State optimizer (momentum Adam) tetap dipertahankan — hanya learning rate yang diganti. Mekanisme ini diimplementasikan secara lazy: optimizer hanya dibuat sekali (di step pertama) dan LR-nya di-update langsung tanpa membuat ulang optimizer.

---

### D15. Bagaimana format data masukan `Y` diproses oleh Trainer? Jelaskan penanganan sparse tensor.

**Jawaban:**

Trainer menerima `Y` sebagai daftar (*list*) matriks PPMI dalam format sparse tensor PyTorch. Di constructor `__init__`, setiap elemen `Y[t]` dipindahkan ke device target (CUDA jika tersedia) melalui `self.Y[t] = self.Y[t].to(self.device)`. Matriks PPMI disimpan dalam format sparse karena dua alasan utama: pertama, matriks PPMI adalah matriks V×V yang sangat besar (ratusan ribu baris/kolom) tetapi mayoritas elemennya adalah nol — hanya pasangan kata yang co-occurs dalam jendela konteks yang memiliki nilai non-zero; kedua, penyimpanan sparse menghemat memori GPU secara signifikan karena hanya menyimpan indeks dan value dari elemen non-zero.

Dalam method `forward()` model, matriks sparse dikonversi ke dense melalui `Y[t].to_dense()` sebelum dilakukan operasi matriks `U[t] @ U[t].t()`. Konversi ini diperlukan karena meskipun PyTorch mendukung operasi matriks pada sparse tensor, hasil perkalian `sparse @ dense` tetap menghasilkan sparse tensor, dan operasi pengurangan dengan hasil rekonstruksi (dense) akan mengubahnya menjadi dense — sehingga konversi eksplisit lebih efisien dan menghindari error tipografi. Konversi ke dense aman dilakukan per domain (`Y[t]`) karena kita hanya mengakses satu matriks PPMI dalam satu waktu, bukan seluruh daftar. Untuk V yang sangat besar (misal > 100k), konversi ke dense per domain dapat memakan memori besar, sehingga ini menjadi pertimbangan skalabilitas yang perlu dicatat.

---

### D16. Bagaimana stabilitas numerik dijaga dalam perhitungan loss dan parameter uncertainty?

**Jawaban:**

Stabilitas numerik dijaga melalui beberapa mekanisme yang bekerja secara sinergis. Pertama, **clamping parameter uncertainty**: nilai `s_F`, `s_RD`, `s_S` di-clamp ke rentang tertentu setelah setiap update — pada versi terbaru rentangnya [-10.0, 5.0] (sebelumnya [-3.0, 4.0]). Clamping mencegah `s` melayang ke nilai negatif besar yang menyebabkan `precision = exp(-s)` menjadi sangat besar (eksplosif) atau ke nilai positif besar yang membuat `precision` mendekati nol dan bobot loss menghilang.

Kedua, **epsilon safety** dalam pembagian: dalam `compute_structure_weights()`, pembagi `D[i,j] + 1e-8` dan `denom + 1e-8` mencegah pembagian dengan nol ketika dua domain memiliki embedding yang identik (jarak = 0) atau ketika jumlah bobot sama dengan nol. Ketiga, **handling NaN/Inf**: di method `step()`, setelah `loss.backward()`, nilai loss diperiksa dengan `torch.isnan(loss) or torch.isinf(loss)`. Jika ditemukan loss invalid, domain tersebut dilewati (`continue`) tanpa update — ini mencegah satu domain yang bermasalah merusak seluruh state model. Keempat, **gradient clipping** dengan `max_norm=1.0` mencegah gradien eksplosif, sementara **CPU fallback** jika CUDA tidak tersedia memungkinkan debugging tanpa GPU. Kelima, penggunaan `torch.no_grad()` untuk semua operasi logging mencegah computational graph membesar tanpa perlu dan mengurangi risiko memory exhaustion.

---

### D17. Bagaimana mekanisme penyimpanan dan distribusi embedding (`U`) antar domain? Menggunakan tensor terpisah atau tensor gabungan?

**Jawaban:**

Embedding domain disimpan sebagai **daftar tensor terpisah** (`self.U = []`) di mana setiap elemen `self.U[t]` adalah tensor PyTorch berukuran V × d dengan `requires_grad=True`. Setiap tensor bersifat independen: alokasi memorinya terpisah, computational graph-nya terpisah, dan masing-masing memiliki optimizer Adam sendiri. Pendekatan ini dipilih karena memudahkan operasi per-domain — kita bisa dengan mudah mengakses, memodifikasi, atau melakukan backward pada satu domain tanpa memengaruhi tensor domain lain.

Namun untuk beberapa operasi, tensor-tensor ini perlu digabungkan. Dalam `compute_distance_matrix()`, seluruh embedding domain di-*stack* menjadi satu tensor 3D berukuran T × V × d, kemudian di-*reshape* (view) menjadi T × (V·d) untuk menghitung jarak pairwise menggunakan `pdist`. Penggabungan ini hanya terjadi untuk komputasi, bukan untuk penyimpanan permanen. Saat checkpoint, embedding disimpan dalam bentuk stack: `torch.stack(model.U).detach().cpu()` menghasilkan tensor 3D T × V × d yang dipindahkan ke CPU. Bentuk stack ini memudahkan analisis pasca-pelatihan, termasuk evaluasi kesamaan antar domain dan visualisasi menggunakan PCA/t-SNE. Jika diperlukan akses per domain dari file checkpoint, `U_stack[t]` mengembalikan embedding domain `t`.

---

### D18. Bagaimana cara model menangani perbedaan skala antara komponen loss L_F, L_RD, dan L_S?

**Jawaban:**

Penanganan perbedaan skala antara komponen loss berbeda secara fundamental antara mode Baseline dan mode Uncertainty Weighting. Pada mode **Baseline**, perbedaan skala tidak ditangani secara adaptif — koefisien `τ` dan `λ` dipilih secara manual melalui *grid search* atau berdasarkan intuisi. Dalam implementasi, `τ = 256` dan `λ = 128` digunakan untuk dataset WikiFoS, yang mencerminkan fakta bahwa L_F biasanya memiliki magnitude jauh lebih besar dari L_RD dan L_S karena melibatkan error rekonstruksi V×V. Namun, koefisien tetap ini tidak dapat beradaptasi jika skala loss berubah selama training.

Pada mode **Uncertainty Weighting**, adaptasi terjadi secara otomatis. Parameter `s_k = log(σ_k²)` dipelajari dan menghasilkan precision `1/σ² = exp(-s_k)`. Jika L_F secara konsisten lebih besar dari L_RD, maka gradien terhadap `s_F` akan mendorong `s_F` ke nilai positif (σ² besar), sehingga bobot `1/(2σ²)` untuk L_F mengecil. Sebaliknya, jika L_RD terlalu kecil, `s_RD` akan mengecil (σ² kecil) sehingga bobot L_RD membesar. Dengan demikian, Uncertainty Weighting secara implisit melakukan *loss balancing* adaptif. Ditambah dengan term regularisasi `½·c_k·s_k/T` yang mencegah σ² menjadi terlalu besar, sistem mencapai ekuilibrium di mana bobot setiap task proporsional dengan kebalikan dari varians residualnya — persis seperti prinsip *Automatic Relevance Determination* dalam Bayesian inference.

---

### D19. Bagaimana struktur direktori output dan format penyimpanan hasil eksperimen?

**Jawaban:**

Struktur direktori output diatur melalui fungsi `create_results_dir(results_path)` (dari modul `utils`) yang membuat folder baru di dalam `results_path` dengan nama berbasis timestamp. Parameter `out_dir` diteruskan ke `trainer.fit()`. Di dalam direktori tersebut, terdapat file `training_log.txt` yang berisi log teks terstruktur dari seluruh proses pelatihan, serta file-file `.pt` (PyTorch save) untuk setiap checkpoint dan hasil akhir.

Format penyimpanan menggunakan fungsi `save_var(var, filename, out_dir)` yang melakukan `torch.save(var, f"{out_dir}/{filename}.pt")`. Nama file mengikuti konvensi: `{prefix}_{type}_{suffix}`. Prefix adalah `uw_pure` untuk mode UW-MTL atau `baseline_pure` untuk mode Baseline. Type mencakup `U` (embedding), `loss_history`, `weight_history`, `convergence`, `loss_ratios`, `gradient_logs`, `sigma_history`, `s_history`, dan `precision_history`. Suffix adalah `step_{N}` untuk checkpoint pada step tertentu atau `final` untuk hasil akhir. Sebagai contoh, file `uw_pure_U_step_500.pt` berisi embedding dari model UW-MTL pada checkpoint step 500, sedangkan `baseline_pure_loss_history_final.pt` berisi riwayat loss lengkap model Baseline. Tidak ada file konfigurasi terpisah — hyperparameter dicatat dalam header file log teks.

---

### D20. Jika dataset memiliki jumlah domain yang sangat besar (T > 100), apa tantangan utama dari arsitektur saat ini dan bagaimana Anda akan mengatasinya?

**Jawaban:**

Arsitektur saat ini menghadapi beberapa tantangan jika T > 100. Pertama, **kompleksitas komputasi per step adalah O(T)** untuk komponen embedding dan **O(T²)** untuk komputasi matriks jarak D. Setiap step menjalankan T kali forward-backward (satu per domain), dan `compute_distance_matrix()` menghitung `pdist` untuk T vektor berdimensi V·d — yang memerlukan O(T²·V·d) operasi. Kedua, **memori GPU** akan menjadi bottleneck karena T tensor embedding (masing-masing V×d) dan log gradien disimpan per domain. Ketiga, **sequential update** memperlambat training secara linear dengan T — tidak ada paralelisasi karena setiap domain diproses bergantian.

Untuk mengatasi tantangan ini, beberapa strategi dapat diterapkan. Pertama, **mini-batch domain**: alih-alih memproses seluruh T domain setiap step, kita bisa mengambil sampel subset domain (misal 10-20) per step, mirip dengan stochastic gradient descent. Kedua, **matriks jarak aproksimatif**: untuk T besar, matriks jarak penuh O(T²) tidak perlu dihitung setiap step — cukup sampel acak pasangan domain atau gunakan pendekatan Nyström. Ketiga, **paralelisasi dengan gradient accumulation**: domain-domain dalam batch yang sama dapat diproses secara paralel di GPU dengan gradient accumulation untuk parameter `s`. Keempat, **pembatasan logging**: menyimpan riwayat gradien per-domain untuk T besar dapat dibatasi dengan subsampling atau agregasi statistik. Kelima, **mixed precision training**: menggunakan FP16 dapat mengurangi memori hingga setengahnya tanpa penurunan kualitas yang signifikan untuk embedding berdimensi sedang.
