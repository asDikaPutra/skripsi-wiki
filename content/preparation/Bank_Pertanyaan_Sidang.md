# Bank Pertanyaan Sidang — W2VPred-MAP

> **Daftar pertanyaan komprehensif untuk persiapan ujian skripsi / sidang.**
> Disusun per kategori: dari teoretis → teknis → hasil → sintesis.
> Jumlah total: **~120 pertanyaan** dari 8 kategori + 1 bonus.

---

## Daftar Isi
1.  [[#A. Dasar Teoretis (18 pertanyaan)]]
2.  [[#B. Formulasi Matematis & Turunan (20 pertanyaan)]]
3.  [[#C. Metodologi & Desain Eksperimen (20 pertanyaan)]]
4.  [[#D. Implementasi Teknis (20 pertanyaan)]]
5.  [[#E. Hasil, Analisis & Interpretasi (20 pertanyaan)]]
6.  [[#F. Kelemahan, Limitasi & Future Work (15 pertanyaan)]]
7.  [[#G. Kontribusi, Keaslian & Sintesis (12 pertanyaan)]]
8.  [[#H. Pertanyaan Umum Sidang (5 pertanyaan)]]

---

## A. Dasar Teoretis

*Bayesian inference, MAP, JMAP, distribusi Gibbs, MLE, improper prior, fungsi partisi.*

1. **Peran Bayesian Inference.** Jelaskan peran *Bayesian inference* dalam kerangka reformulasi W2VPred menjadi W2VPred‑MAP. Mengapa pendekatan *maximum a posteriori* (MAP) dipilih menggantikan *maximum likelihood estimation* (MLE) murni?
   — *Indikator:* Mahasiswa mampu menjelaskan motivasi penggunaan inferensi Bayesian untuk memasukkan informasi prior ke dalam estimasi parameter, serta membedakan logika MAP vs MLE.

2. **JMAP vs estimasi bertahap.** Dalam skripsi ini, estimasi dilakukan simultan terhadap parameter embedding (θ) dan hiperparameter ketidakpastian (σ) menggunakan JMAP. Apa keuntungan teoretis JMAP dibandingkan estimasi bertahap (MLE untuk θ lalu MAP untuk σ)?
   — *Indikator:* Mahasiswa memahami kompleksitas estimasi bersama dan mengapa JMAP memberikan solusi yang lebih koheren.

3. **Distribusi Gibbs pada loss struktur.** Komponen Lₛ dan L<sub>RD</sub> dimodelkan sebagai distribusi Gibbs. Definisikan distribusi Gibbs secara umum dan jelaskan bagaimana Lₛ dan L<sub>RD</sub> dipandang sebagai energi dari distribusi tersebut.
   — *Indikator:* Mahasiswa mampu menghubungkan fungsi loss dengan distribusi Gibbs dan memahami interpretasi probabilistik dari energi.

4. **Improper prior untuk P(σ).** Anda memilih prior improper untuk P(σ) dalam model JMAP. Apa yang dimaksud prior improper? Mengapa prior improper dipilih meskipun tidak dapat dinormalisasi?
   — *Indikator:* Mahasiswa memahami konsep prior improper, implikasinya terhadap posterior, dan alasan praktis penggunaannya.

5. **Fungsi partisi Gibbs Zₛ.** Fungsi partisi Gibbs untuk komponen struktur ditulis Zₛ(σₛ) = σₛⁿ·Zₛ(1). Turunkan hubungan tersebut berdasarkan sifat homogenitas derajat dua dari fungsi energi. Jelaskan makna n dalam persamaan.
   — *Indikator:* Mahasiswa mampu menurunkan dan menjelaskan skala fungsi partisi akibat homogenitas energi.

6. **MLE vs JMAP.** Dalam MLE, parameter diestimasi dengan memaksimalkan *likelihood*. Dalam JMAP, fungsi objektif mencakup likelihood (L<sub>F</sub>) maupun prior Gibbs (Lₛ, L<sub>RD</sub>). Tuliskan fungsi objektif JMAP secara matematis dan jelaskan mengapa prior Gibbs diperlakukan sebagai regulariser.
   — *Indikator:* Mahasiswa mampu merepresentasikan JMAP sebagai optimasi gabungan dan menjelaskan hubungan prior dan regularisasi.

7. **Full Bayesian vs MAP.** Apa perbedaan mendasar antara *full Bayesian inference* dan MAP? Dalam konteks W2VPred‑MAP, mengapa Anda cukup menggunakan MAP daripada integrasi numerik penuh?
   — *Indikator:* Mahasiswa membedakan estimasi titik vs inferensi penuh serta keterbatasan komputasi.

8. **Transformasi s = log σ².** Hiperparameter σ direpresentasikan melalui transformasi s = log σ². Mengapa transformasi logaritmik digunakan? Bagaimana pengaruhnya terhadap optimasi JMAP?
   — *Indikator:* Mahasiswa memahami keuntungan transformasi (kendala non‑negatif, kondisi numerik) dan dampak pada gradien.

9. **Ketergantungan fungsi partisi pada σ.** Distribusi Gibbs memiliki fungsi partisi Z yang bergantung pada parameter skala (σ). Jelaskan bagaimana ketergantungan ini mempengaruhi kontribusi prior Gibbs terhadap fungsi objektif JMAP, khususnya suku log Z.
   — *Indikator:* Mahasiswa mampu menjelaskan peran fungsi partisi dalam menormalkan distribusi Gibbs.

10. **σ tunggal atau per domain?** Dataset Hadith terdiri dari 16 domain. Bagaimana pengaruh jumlah domain terhadap estimasi σ untuk masing-masing komponen loss? Apakah σ diasumsikan tunggal atau berbeda per domain?
    — *Indikator:* Mahasiswa mengaitkan struktur data multi‑domain dengan pemodelan ketidakpastian.

11. **MAP → MLE dengan prior uniform.** Jelaskan hubungan MLE dan MAP ketika prior bersifat *uniform* (konstan). Dalam kasus khusus apakah JMAP dengan prior improper tertentu dapat mereduksi menjadi MLE?
    — *Indikator:* Mahasiswa memahami bahwa MAP dengan prior uniform ekuivalen dengan MLE.

12. **Skala gradien berbeda.** JMAP mengoptimasi parameter embedding (θ) dan hiperparameter σ yang memiliki skala gradien berbeda. Bagaimana Anda menangani hal ini?
    — *Indikator:* Mahasiswa menyadari isu penskalaan gradien dan strategi optimasi (alternating update, learning rate terpisah, dll.).

13. **Mengapa Lₛ dan L<sub>RD</sub> dipisah.** Distribusi Gibbs untuk Lₛ dan L<sub>RD</sub> memiliki bentuk energi berbeda. Jelaskan secara intuitif mengapa keduanya tidak digabung menjadi satu prior Gibbs.
    — *Indikator:* Mahasiswa mampu menjelaskan peran fungsional masing-masing komponen.

14. **Sensitivitas terhadap n besar.** Jika n sangat besar, bagaimana perilaku prior Gibbs terhadap perubahan σₛ? Implikasi apa yang muncul pada estimasi σₛ?
    — *Indikator:* Mahasiswa mampu menganalisis sensitivitas prior terhadap dimensi n.

15. **Alternatif prior informatif.** Untuk P(σ) Anda memilih prior improper. Sebutkan alternatif prior informatif yang mungkin digunakan dan bandingkan kelebihan/kekurangannya.
    — *Indikator:* Mahasiswa mampu membandingkan jenis prior (improper, conjugate, weakly-informative).

16. **Syarat konvergensi fungsi partisi.** Bagaimana Anda memastikan fungsi partisi Gibbs untuk Lₛ dan L<sub>RD</sub> terdefinisi dengan baik (*finite*)? Adakah kondisi yang harus dipenuhi oleh energi agar Z konvergen?
    — *Indikator:* Mahasiswa memahami syarat konvergensi fungsi partisi.

17. **Mekanisme penemuan keseimbangan.** Dalam W2VPred (tanpa uncertainty) ketiga loss dijumlah dengan bobot tetap. Dalam W2VPred‑MAP bobot diestimasi otomatis. Jelaskan mekanisme teoretis bagaimana JMAP menemukan keseimbangan antara L<sub>F</sub>, Lₛ, L<sub>RD</sub>.
    — *Indikator:* Mahasiswa mampu menjelaskan bahwa JMAP melakukan weighting melalui inverse variance.

18. **Kaitan dengan Bayesian model averaging.** W2VPred‑MAP menghasilkan representasi lebih baik. Kaitkan secara teoretis hasil tersebut dengan prinsip *Bayesian model averaging* atau *ridge regression* yang setara dengan MAP prior Gaussian.
    — *Indikator:* Mahasiswa mampu menghubungkan hasil empiris dengan teori regularisasi Bayesian.

---

## B. Formulasi Matematis & Turunan

*Derivasi likelihood ke loss, Gibbs prior, fungsi partisi, homogenitas, reparameterisasi, strategi optimasi JMAP.*

1. **Derivasi J<sub>F</sub> dari likelihood Gaussian.** Jelaskan bagaimana fungsi likelihood Gaussian diturunkan menjadi J<sub>F</sub> = L<sub>F</sub>/(2σ<sub>F</sub>²) + (T·V²)log σ<sub>F</sub>. Tunjukkan setiap langkah negatif log-likelihood dan konstanta yang diabaikan.

2. **Peran σ<sub>F</sub>² dalam J<sub>F</sub>.** Mengapa suku (T·V²)log σ<sub>F</sub> muncul? Apa implikasinya terhadap estimasi σ<sub>F</sub>² saat optimasi bersama parameter U?

3. **Derivasi prior Gibbs J<sub>S</sub>.** Turunkan p<sub>S</sub>(U|W,σ<sub>S</sub>²) = exp(−L<sub>S</sub>/(2σ<sub>S</sub>²))/Z<sub>S</sub> menjadi J<sub>S</sub> = L<sub>S</sub>/(2σ<sub>S</sub>²) + (T·V·d)log σ<sub>S</sub>. Jelaskan bagaimana faktor T·V·d muncul.

4. **Fungsi partisi Z<sub>S</sub> dan homogenitas.** Bagaimana sifat homogenitas derajat dua L<sub>S</sub>(cU) = c²L<sub>S</sub>(U) digunakan untuk menyederhanakan fungsi partisi? Tunjukkan Z<sub>S</sub> ∝ (σ<sub>S</sub>²)^(TVd/2).

5. **Penurunan J<sub>RD</sub>.** Turunkan bentuk J<sub>RD</sub> yang setara dengan J<sub>S</sub> tetapi dengan dimensi yang sesuai.

6. **Reparameterisasi s = log σ².** Mengapa reparameterisasi ini diperlukan? Tunjukkan bagaimana transformasi mengubah fungsi objektif dari L/(2σ²) + (k/2)log σ² menjadi ½exp(−s)L + (k/2)s, dan jelaskan keuntungannya.

7. **Gradien setelah reparameterisasi.** Turunkan ∂J/∂s untuk J = ½exp(−s)L + (k/2)s. Bagaimana bentuk ini mempermudah optimasi dibanding parameterisasi asli σ²?

8. **Strategi optimasi JMAP.** Jelaskan (θ̂,σ̂) = argmax [ln P(D|θ,σ) + ln P(θ|σ) + ln P(σ)]. Bagaimana setiap suku berkorespondensi dengan J<sub>F</sub>, J<sub>S</sub>, J<sub>RD</sub>?

9. **Perbedaan JMAP dengan MAP biasa.** Apa perbedaan mendasar JMAP dengan MAP biasa? Dalam kondisi apa JMAP lebih unggul?

10. **Korespondensi λ dan τ.** Diberikan λ = σ<sub>F</sub>²/σ<sub>S</sub>² dan τ = σ<sub>F</sub>²/σ<sub>RD</sub>², tunjukkan bagaimana parameter balancing ini muncul dalam fungsi objektif gabungan. Apa interpretasi praktis λ dan τ?

11. **σ<sub>F</sub>² sebagai faktor normalisasi.** Mengapa σ<sub>F</sub>² dapat difaktorkan keluar dari semua suku? Bagaimana hal ini memengaruhi strategi optimasi?

12. **Homogenitas pada L<sub>F</sub>.** Apakah fungsi fidelity L<sub>F</sub>(U) bersifat homogen derajat dua terhadap U? Jika tidak, bagaimana perlakuan fungsi partisi berbeda?

13. **Dampak reparameterisasi pada prior σ.** Jika kita menempatkan prior non-informatif p(σ²) ∝ 1/σ², bagaimana bentuk suku prior setelah reparameterisasi? Apakah transformasi mengubah interpretasi prior?

14. **Penurunan J<sub>S</sub> untuk dimensi d.** Tuliskan bentuk eksplisit L<sub>S</sub> dalam konteks W2VPred dan turunkan dimensi integral fungsi partisi sehingga menghasilkan faktor TVd/2.

15. **Alternatif reparameterisasi.** Selain s = log σ², adakah transformasi lain yang menjamin σ > 0? Bandingkan kelebihan dan kekurangan masing-masing.

16. **Bertahap vs bersama.** Lebih baik estimasi θ dan σ bersama dalam satu loop, atau bergantian (block-coordinate descent)? Jelaskan pertimbangannya.

17. **Bukti formal homogenitas.** Buktikan bahwa jika L<sub>S</sub>(cU) = c²L<sub>S</sub>(U), maka Z<sub>S</sub> sebanding dengan (σ<sub>S</sub>²)^(N/2) dengan N = TVd. Gunakan perubahan variabel U' = U/σ<sub>S</sub>.

18. **Konstanta pada J<sub>F</sub>.** Dalam derivasi J<sub>F</sub>, terdapat konstanta −(TV²/2)log(2πσ<sub>F</sub>²). Dalam JMAP, apakah pengabaian ini tetap valid ketika σ<sub>F</sub>² diestimasi?

19. **Interpretasi geometris reparameterisasi.** Gambarkan permukaan fungsi objektif sebelum dan sesudah reparameterisasi. Bagaimana transformasi mengubah kurvatur?

20. **Hubungan JMAP dengan Empirical Bayes.** Jelaskan persamaan dan perbedaan JMAP dengan metode Empirical Bayes standar dalam konteks pemilihan hyperparameter σ.

---

## C. Metodologi & Desain Eksperimen

*Alasan pilih JMAP, dataset, setup eksperimen, metrik evaluasi, validasi, hyperparameter.*

1. **Pemilihan JMAP vs metode lain.** Mengapa JMAP dipilih dibandingkan CCA, MCCA, Concatenation-based embedding? Kelebihan teoretis dan praktis untuk tugas multi-domain word embedding?

2. **Justifikasi UW-MAP.** Apa landasan teoretis uncertainty weighting dengan s = log σ² dibandingkan fixed weighting? Bagaimana mekanisme ini menjamin keseimbangan kontribusi antar domain heterogen?

3. **Studi kasus: Hadith corpus.** Mengapa memilih korpus Hadith? Karakteristik linguistik dan struktural apa yang membuatnya benchmark sesuai?

4. **Representasi data.** Bagaimana proses ekstraksi matriks PPMI dari korpus Hadith? Apakah ada preprocessing khusus (stopword removal, lemmatisasi)?

5. **Setup Baseline vs UW-MAP.** Pada Baseline, τ dan λ dicari via grid search. Berapa rentang nilai yang dicoba? Metrik apa yang jadi kriteria pemilihan? Apakah grid search global atau per-domain?

6. **Prosedur UW-MAP.** Parameter uncertainty s diperbarui sekali per outer step dengan akumulasi gradien dari seluruh domain. Bagaimana stabilitas pelatihan terjamin?

7. **Optimizer dan update.** Mengapa Adam? Apakah ada perbedaan learning rate antara optimizer embedding per-domain dan optimizer s? Skema update sequential per step?

8. **Skenario eksperimen.** Variasi jumlah iterasi, ukuran embedding, konteks window? Bagaimana reprodusibilitas?

9. **Metrik Recall@k.** Mengapa Recall@k (k=1,2,3) dipilih dibanding Precision@k atau MAP? Interpretasi Recall@1, @2, @3 dalam konteks embedding multidomain?

10. **Metrik Acc@k analogi.** Bagaimana relasi analogi didefinisikan pada korpus Hadith? Apakah diuji dalam domain sama atau lintas domain? Konstruksi dataset analogi?

11. **Cosine similarity lintas domain.** Bagaimana memastikan cosine similarity antar domain merepresentasikan relasi semantik bermakna, bukan artefak dimensionalitas?

12. **Spearman ρ.** Terhadap ground truth apa dibandingkan? Apakah menggunakan penilaian manusia atau benchmark yang ada?

13. **Validasi data.** Inspeksi outlier, missing values, distribusi frekuensi kata tidak seimbang? Penanganan domain dengan token sangat kecil?

14. **Pemilihan hyperparameter.** Selain τ dan λ, hyperparameter apa yang di-tune (learning rate, dimensi embedding, batch)? Proporsi training/validasi?

15. **Inisialisasi init_s=0.0.** Mengapa nilai tersebut dipilih? Sensitivitas hasil terhadap inisialisasi s? Dampak inisialisasi berbeda pada konvergensi?

16. **Kompleksitas komputasi.** Perbandingan biaya Baseline (grid search τ,λ) vs UW-MAP? Waktu pelatihan per konfigurasi? Skalabilitas terhadap jumlah domain?

17. **Analisis sensitivitas dimensi.** Apakah analisis sensitivitas terhadap jumlah dimensi embedding dilakukan? Bagaimana performa berubah dengan dimensi berbeda?

18. **Reproduksibilitas.** Langkah untuk memastikan eksperimen reproducible? Seed random, konfigurasi hyperparameter, script preprocessing terdokumentasi?

19. **PPMI vs Word2Vec.** Mengapa PPMI dipilih, bukan word2vec atau GloVe? Perbandingan performa jika input berbeda?

20. **Uji signifikansi statistik.** Apakah uji signifikansi dilakukan (paired t-test, Wilcoxon) untuk Baseline vs UW-MAP?

---

## D. Implementasi Teknis

*Arsitektur W2VPred class, Trainer, optimizer per domain, akumulasi gradien, loss computation, sparse tensors, numerical stability.*

1. **Arsitektur W2VPred.** Bagaimana kelas W2VPred dirancang sehingga tau, lam, V, T, d dapat diinisialisasi fleksibel? Peran `use_uncertainty_weighting` dan `init_s`?

2. **Forward pass.** Jelaskan alur *forward pass*, termasuk representasi vektor domain dan kata, serta kontribusi setiap komponen dalam tensor.

3. **Komputasi loss.** Tuliskan rumus L<sub>F</sub>, L<sub>S</sub>, L<sub>RD</sub>. Bagaimana kontribusi ketiganya digabungkan?

4. **Normalisasi loss.** Mengapa c<sub>F</sub> = T·V² dan c<sub>S</sub> = c<sub>RD</sub> = T·V·d? Dampak terhadap skala gradien dan stabilitas?

5. **Optimizer per domain.** Mengapa setiap domain punya optimizer Adam sendiri? Kelebihan dibanding satu optimizer bersama?

6. **Akumulasi gradien s.** Mekanisme akumulasi gradien parameter s dari seluruh domain sebelum update?

7. **Alur training.** Langkah demi langkah siklus pelatihan di kelas Trainer: batch → forward → loss → backward → update.

8. **Tensor PPMI sparse.** Bagaimana konversi sparse NumPy/SciPy ke PyTorch efisien? Apakah ada teknik batching khusus?

9. **Stabilitas numerik.** Langkah menghindari *division by zero*, *underflow*, NaN pada L<sub>RD</sub> (akar kuadrat) atau bobot ketidakpastian?

10. **Reproducibility.** Bagaimana random seed diatur? Apakah masih ada parameter non-deterministik?

11. **Inisialisasi parameter.** Bagaimana embedding domain, embedding kata, dan s diinisialisasi? Pertimbangan pemilihannya?

12. **Scheduling learning rate.** Apakah learning rate scheduler digunakan pada Adam? Strategi?

13. **Gradien parameter bersama.** Bagaimana parameter bersama (embedding kata) mendapat gradien dari semua domain sebelum update?

14. **Efisiensi memori.** Dengan T domain besar, bagaimana state optimizer per domain? Gradient checkpointing atau mixed precision?

15. **Validasi dan early stopping.** Kriteria konvergensi? Mekanisme early stopping atau penyimpanan model terbaik?

16. **Out-of-memory.** Jika tensor PPMI tidak muat GPU, strategi (CPU offloading, chunking, async transfer)?

17. **Perbandingan optimizer.** Mengapa Adam dibanding SGD, RMSprop? Eksperimen perbandingan?

18. **Logging dan monitoring.** Informasi yang dicatat: loss per domain, gradien norm, nilai s? Visualisasi debugging?

19. **Skalabilitas T.** Bagaimana desain Trainer menangani penambahan T? Bottleneck serial loop over domains?

20. **Ekstensibilitas kode.** Jika ingin menambah loss baru atau ganti optimizer, seberapa mudah? Pola desain yang digunakan?

---

## E. Hasil, Analisis & Interpretasi

*Baseline vs UW-MAP, efisiensi, konvergensi, evolusi σ, Recall@k, Acc@k, cosine similarity.*

1. **Grid search vs adaptif.** Mengapa UW-MAP menghilangkan kebutuhan grid search? Apakah tanpa mengorbankan kualitas?

2. **Efisiensi waktu.** Total *wall-clock time* UW-MAP vs Baseline? Sertakan jumlah epoch, forward-backward pass, overhead uncertainty.

3. **Trade-off kecepatan-stabilitas.** Apakah UW-MAP lebih sering mengalami oscillation atau divergensi?

4. **Konvergensi loss ternormalisasi.** Mengapa L<sub>S</sub> turun lebih cepat pada UW-MAP, sementara Baseline lebih seragam?

5. **Monotonisitas konvergensi.** Apakah L<sub>F</sub> dan L<sub>S</sub> monotonik? Jika tidak, pada epoch berapa spike dan interpretasi?

6. **Evolusi σ<sub>F</sub>, σ<sub>S</sub>, σ<sub>RD</sub>.** Mengapa σ<sub>F</sub> mengecil sementara σ<sub>S</sub> membesar (atau sebaliknya)? Kaitkan dengan *task difficulty*.

7. **Cold start σ.** Apakah σ bernilai sama pada epoch awal? Pengaruh inisialisasi pada perilaku awal?

8. **Stabilitas rasio L<sub>F</sub>:L<sub>S</sub>:L<sub>RD</sub>.** Apakah rasio stabil setelah konvergensi? Fluktuasi? Risiko *catastrophic forgetting*?

9. **Recall@k struktur.** Nilai Recall@1,2,3 pada UW-MAP vs Baseline? Signifikan statistik? Uji yang digunakan?

10. **False positive di heatmap W.** Apakah cell probabilitas tinggi yang tidak ada di *gold standard* adalah false positive atau indikasi relasi baru?

11. **Acc@k analogi global.** Overall Acc@1,5,10. Apakah UW-MAP unggul di semua metrik? Jika tidak, metrik mana Baseline lebih baik?

12. **Acc@k per domain.** Domain mana peningkatan terbesar dan penurunan terbesar? Karakteristik domain yang menjelaskan?

13. **Cosine similarity lintas domain.** Bagaimana mengukur bahwa UW-MAP menghasilkan representasi lebih terpisah secara semantik? Metrik kuantitatif selain cosine similarity?

14. **Sense disambiguation vs over-specialization.** Kata "cell": similarity biology-medicine tinggi, biology-energy rendah. Apakah ini sense disambiguation baik atau over-specialization?

15. **Contoh kualitatif keberhasilan UW-MAP.** Satu contoh konkret di mana UW-MAP berhasil memprediksi relasi yang gagal oleh Baseline. Mekanisme adaptifnya?

16. **Contoh kualitatif keunggulan Baseline.** Apakah ada contoh di mana Baseline lebih unggul? Keterbatasan UW-MAP yang terungkap?

17. **Pembuktian keseimbangan optimal.** Bagaimana membuktikan bobot adaptif mencapai keseimbangan optimal, bukan sekadar local optimum yang kebetulan baik?

18. **Sensitivitas terhadap skala loss.** Jika suatu task memiliki loss alami 2× lipat, apakah UW-MAP mengkompensasi atau memperparah?

19. **Generalisasi ke domain lain.** Sejauh mana UW-MAP dapat digeneralisasi ke MTL di luar word embedding (multimodal, recommender)? Batasan utama?

20. **Implikasi temuan.** Apa satu temuan paling mengejutkan dari eksperimen ini? Apakah sesuai hipotesis awal?

---

## F. Kelemahan, Limitasi & Future Work

*Asumsi i.i.d. Gaussian, improper prior, fungsi partisi, skalabilitas O(V²), generalisasi, SOTA comparison, downstream task.*

1. **Validasi asumsi i.i.d. Gaussian.** Bagaimana asumsi divalidasi? Bukti diagnostik residual (QQ-plot, uji normalitas)?

2. **Dampak non-Gaussian.** Jika galat PPMI tidak simetris/Gaussian, seberapa besar dampak pada konsistensi estimator?

3. **Posterior improper.** Dalam kondisi apa improper prior menyebabkan posterior improper? Pemeriksaan propriety posterior?

4. **Validitas Z<sub>S</sub>(1) konstan.** Mengapa Z<sub>S</sub>(1) dianggap konstanta? Apakah memengaruhi inferensi?

5. **Skalabilitas O(V²).** Untuk V > 50K, strategi aproksimasi yang diusulkan?

6. **Sampling atau variasional?** Apakah MCMC atau aproksimasi variasional dipertimbangkan untuk skala besar?

7. **Generalisasi korpus lain.** Seberapa representatif 16 domain Hadith? Generalisasi ke Alquran, tafsir, teks Arab klasik lain?

8. **Korpus non-Arab.** Apakah diuji pada korpus non-Arab atau domain sangat berbeda? Langkah validasi?

9. **Mengapa belum dibandingkan dengan CW/CJV?** Kendala teknis/nonteknis yang menghambat?

10. **Menunjukkan kontribusi tanpa SOTA.** Tanpa perbandingan SOTA, bagaimana kontribusi ditunjukkan? Ukuran pembanding relevan?

11. **Downstream task belum dijalankan.** Mengapa belum terealisasi? Pengaruh terhadap validasi performa?

12. **Metrik downstream.** Jika klasifikasi CNN dijalankan, metrik evaluasi (akurasi, F1)? Hubungan dengan kualitas parameter?

13. **Interpretabilitas s = log σ².** Dapat dikaitkan dengan konsep linguistik/semantik konkret? Tingkat kekhususan domain?

14. **Rencana peningkatan interpretabilitas.** Analisis sensitivitas? Visualisasi posterior? Studi kasus kata tertentu?

15. **Prioritas riset lanjutan.** Dari semua keterbatasan, mana paling krusial? Rencana konkret?

---

## G. Kontribusi, Keaslian & Sintesis

*Novelti, kontribusi terhadap W2VPred, perbandingan Kendall et al., aplikasi potensial.*

1. **Perbedaan filosofis deterministik vs Bayesian.** Apa perbedaan mendasar formulasi deterministik W2VPred dengan Bayesian yang diusulkan? Implikasi ontologis?

2. **Reformulasi atau sekadar penambahan noise?** Sejauh mana reformulasi menghasilkan model baru secara matematis?

3. **Adaptif terhadap heterogenitas domain.** Bagaimana membuktikan weighting JMAP benar-benar adaptif terhadap heterogenitas domain, bukan sekadar menangkap skala loss?

4. **Mengapa JMAP belum pernah diterapkan?** Faktor teknis/konseptual apa yang membuat penerapan ini tidak trivial?

5. **Superioritas dengan waktu komputasi sama.** Jika waktu komputasi disamakan, apakah JMAP tetap superior? Bagaimana "biaya komputasi" diukur?

6. **Kendall et al. sebagai kasus khusus.** Dalam kondisi prior apa JMAP dan Kendall identik? Dalam kondisi apa JMAP memberikan fleksibilitas tambahan?

7. **Modifikasi W2VPred asli.** Komponen W2VPred apa yang dimodifikasi agar integrasi JMAP berhasil? Asumsi W2VPred asli yang dilanggar?

8. **Cukup signifikan sebagai kontribusi?** Apakah pergeseran domain aplikasi (neural network → word embedding) cukup signifikan sebagai kontribusi berdiri sendiri?

9. **Identifiabilitas parameter.** Apakah ada degenerasi atau trade-off antara varian domain dan weighting yang menyebabkan estimasi tidak stabil?

10. **Skenario grid search lebih unggul.** Apakah ada skenario grid search tetap unggul (T=2 atau T>100)?

11. **Contoh konkret transfer learning.** Contoh dengan dataset nyata bagaimana W2VPred-MAP meningkatkan performa domain tidak terlihat?

12. **Kelemahan pendekatan deterministik.** Kelemahan fundamental pendekatan deterministik/heuristik yang hanya dapat diatasi formulasi Bayesian?

---

## H. Pertanyaan Umum Sidang

1. **Motivasi awal.** Apa motivasi memilih topik ini? Pengalaman spesifik atau celah literatur?

2. **Aplikasi praktis di industri.** W2VPed belum diadopsi luas. Siapa calon pengguna utama? Aplikasi konkret?

3. **Dampak sosial dan etis.** Apakah model adaptif berpotensi memperkuat bias representasi kata pada data tidak seimbang?

4. **Rencana publikasi.** Target jurnal/konferensi? Langkah konkret yang sudah dilakukan?

5. **Eksperimen dengan sumber daya tak terbatas.** Satu eksperimen paling penting untuk memperkuat klaim kontribusi?

---

> *Catatan:* Gunakan notes ini untuk latihan simulasi sidang. Jawab lisan maupun tulis, catat jawaban yang perlu direvisi, dan tandai pertanyaan yang masih terasa sulit dengan `[[todo/sidang_prep_notes]]`.

---
**Dibuat:** `2026-05-12`  
**Kategori:** `preparation/sidang`  
**Total:** ~120 pertanyaan  
**Pipeline:** Researcher ‖ Kanban multi-agent — parallel generation (7 specialists)
