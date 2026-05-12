# Jawaban Sidang — Kategori C: Metodologi & Desain Eksperimen

> Ditujukan untuk persiapan ujian skripsi / sidang.
> Format: **C.1**, **C.2**, ... **C.20** — Bahasa Indonesia akademik formal.

---

## **C.1 — Pemilihan JMAP vs Metode Lain**

**Pertanyaan:** Mengapa JMAP dipilih dibandingkan CCA, MCCA, Concatenation-based embedding? Kelebihan teoretis dan praktis untuk tugas multi-domain word embedding?

**Jawaban:**

Terima kasih atas pertanyaannya. Pemilihan kerangka *Joint Maximum A Posteriori* (JMAP) didasarkan pada tiga pertimbangan utama:

**Pertama, keunggulan teoretis.** CCA dan MCCA merupakan metode proyeksi linear yang merepresentasikan hubungan antar dua atau lebih himpunan variabel melalui korelasi kanonik. Meskipun efektif untuk menangkap korelasi linear antar-domain, kedua metode ini tidak menyediakan mekanisme eksplisit untuk mengintegrasikan pengetahuan prior tentang struktur relasi antar-domain. Sementara itu, *concatenation-based embedding* — yang menggabungkan vektor dari semua domain secara sederhana — mengalami masalah kutukan dimensi dan kehilangan informasi spesifik-domain karena setiap domain diperlakukan seragam tanpa mempertimbangkan heterogenitasnya. JMAP, sebaliknya, menawarkan kerangka estimasi bersama (*joint estimation*) di mana parameter embedding (U) dan hiperparameter ketidakpastian (σ) dioptimasi secara simultan dalam satu fungsi objektif probabilistik yang koheren.

**Kedua, konsistensi probabilistik.** JMAP secara eksplisit membedakan komponen *likelihood* (L_F yang merekonstruksi data PPMI) dari komponen *prior* (L_S dan L_RD yang meregularisasi struktur embedding). Pembedaan ini memungkinkan setiap komponen loss memiliki parameter variansi sendiri yang diestimasi langsung dari data, bukan ditentukan secara manual melalui grid search. Hal ini tidak dimiliki oleh CCA, MCCA, maupun metode konkatensi.

**Ketiga, efisiensi praktis.** Dalam konteks multi-domain dengan T=16 domain dan V=70.000+ kosakata, JMAP menghilangkan kebutuhan grid search yang memerlukan 25 kali pelatihan penuh (12.500 epoch total). Cukup satu siklus pelatihan (500 epoch) untuk mendapatkan keseimbangan optimal antar komponen loss.

---

## **C.2 — Justifikasi UW-MAP**

**Pertanyaan:** Apa landasan teoretis *uncertainty weighting* dengan s = log σ² dibandingkan *fixed weighting*? Bagaimana mekanisme ini menjamin keseimbangan kontribusi antar domain heterogen?

**Jawaban:**

Terima kasih. Landasan teoretis *uncertainty weighting* berasal dari kerangka *Maximum A Posteriori* (MAP) yang memandang setiap komponen fungsi objektif sebagai distribusi probabilitas dengan variansi σ² yang dapat dipelajari.

**Pada model Baseline (fixed weighting),** fungsi objektif ditulis sebagai:

$$L_{W2VPred} = L_F + \lambda L_S + \tau L_{RD}$$

Nilai λ dan τ ditentukan melalui grid search dan bersifat tetap sepanjang pelatihan. Akibatnya, jika skala numerik L_F jauh lebih besar dari L_S dan L_RD (rasio mencapai 10⁴), bobot statis tidak mampu mengompensasi ketimpangan ini sehingga optimasi didominasi oleh komponen prior.

**Pada UW-MAP,** fungsi objektif JMAP ditulis sebagai:

$$J = \frac{L_F}{2\sigma_F^2} + \frac{L_S}{2\sigma_S^2} + \frac{L_{RD}}{2\sigma_{RD}^2} + (TV^2)\log\sigma_F + (TVd)\log\sigma_S + (TVd)\log\sigma_{RD}$$

Parameter σ² dipelajari secara adaptif. Bobot efektif setiap komponen adalah kebalikan variansi (presisi): $1/\sigma_k^2 = \exp(-s_k)$. Dengan demikian, komponen dengan ketidakpastian tinggi (σ² besar) secara otomatis mendapat bobot lebih kecil, dan sebaliknya. Melalui reparameterisasi $s_k = \log\sigma_k^2$, optimasi berlangsung dalam ruang tak-terkendala (*unconstrained*), menjamin σ² > 0 selalu terpenuhi.

**Mekanisme keseimbangan:** Ketika suatu komponen loss sulit diminimalkan (misalnya L_F membutuhkan representasi lebih kompleks), σ_F akan meningkat, bobot efektif L_F menurun, dan model mengalokasikan kapasitas ke komponen lain. Sebaliknya, komponen yang mudah dipelajari akan memiliki σ kecil sehingga bobot efektifnya tinggi. Proses ini menjamin keseimbangan kontribusi secara otomatis tanpa intervensi manual.

---

## **C.3 — Studi Kasus: WikiFoS**

**Pertanyaan:** Mengapa memilih korpus WikiFoS? Karakteristik linguistik dan struktural apa yang membuatnya *benchmark* sesuai?

**Jawaban:**

Terima kasih. Dataset yang digunakan dalam penelitian ini adalah **Wikipedia Field of Science (WikiFoS)** yang dikembangkan oleh Lassner et al. (2023) — bukan korpus Hadith sebagaimana disebutkan dalam pertanyaan. WikiFoS dipilih berdasarkan tiga karakteristik penting:

**Pertama, struktur hierarkis eksplisit.** WikiFoS membagi artikel ilmiah ke dalam empat klaster utama (Natural Sciences, Humanities, Engineering & Technology, Medical & Health Sciences) yang masing-masing terdiri dari empat sub-kategori, total 16 domain. Struktur ini ideal untuk menguji komponen Structure Loss (L_S) karena model harus mempelajari representasi di mana kategori dalam satu klaster (misalnya Chemistry dan Biology) memiliki jarak embedding yang lebih dekat dibandingkan lintas klaster (misalnya Chemistry dan Law).

**Kedua, heterogenitas domain yang realistis.** Distribusi artikel antar-domain tidak seragam, dengan kategori Literature & Languages memiliki jumlah tertinggi (24.800 artikel) dan Mechanical Engineering terendah (4.978). Ketimpangan ini menjadi kondisi ideal untuk menguji mekanisme MAP adaptif — apakah parameter σ mampu menyesuaikan bobot kepercayaan terhadap domain minoritas tanpa tenggelam oleh domain dominan.

**Ketiga, total 206.386 dokumen tersebar di 16 domain** memberikan ukuran data yang cukup besar untuk melatih embedding berdimensi d=100 secara stabil. Keragaman topik antar-domain (dari fisika kuantum hingga sastra klasik) memungkinkan evaluasi kualitas representasi lintas-domain yang bermakna.

---

## **C.4 — Representasi Data**

**Pertanyaan:** Bagaimana proses ekstraksi matriks PPMI dari korpus WikiFoS? Apakah ada *preprocessing* khusus?

**Jawaban:**

Terima kasih. Proses ekstraksi matriks PPMI (*Positive Pointwise Mutual Information*) dari korpus WikiFoS dilakukan melalui beberapa tahapan:

**Pertama, preprocessing teks.** Setiap artikel WikiFoS melalui tahap: tokenisasi kata, konversi ke *lowercase*, penghapusan tanda baca dan karakter non-alfabet, serta *stopword removal* menggunakan daftar *stopword* standar bahasa Inggris. Stemming atau lemmatisasi tidak diterapkan untuk mempertahankan informasi morfologis yang relevan untuk representasi semantik.

**Kedua, konstruksi matriks ko-okurensi.** Untuk setiap domain t, dihitung matriks ko-okurensi kata dengan jendela konteks (*context window*) berukuran tertentu (umumnya ±5 kata). Setiap pasangan kata (i,j) yang muncul dalam jendela yang sama dicatat frekuensi kemunculan bersamanya, menghasilkan matriks C_t berukuran V × V.

**Ketiga, konversi ke PPMI.** Matriks ko-okurensi dikonversi ke PPMI melalui formula:

$$PPMI_{ij} = \max\left(0, \log_2 \frac{P(i,j)}{P(i)P(j)}\right)$$

di mana P(i,j) adalah probabilitas kemunculan bersama, dan P(i), P(j) adalah probabilitas marginal masing-masing kata. Nilai negatif dipotong ke nol. Hasilnya adalah matriks sparse PPMI berukuran V × V per domain, disimpan dalam format sparse (COO/CSR) untuk efisiensi memori.

**Keempat, reduksi kosakata.** Kosakata bersama (*shared vocabulary*) dibangun dari kata-kata yang muncul di minimal dua domain dengan frekuensi minimum tertentu untuk menghindari *noise* dari kata yang terlalu jarang.

---

## **C.5 — Setup Baseline vs UW-MAP**

**Pertanyaan:** Pada Baseline, τ dan λ dicari via grid search. Berapa rentang nilai yang dicoba? Metrik apa yang jadi kriteria pemilihan? Apakah grid search global atau per-domain?

**Jawaban:**

Terima kasih. Setup grid search untuk model Baseline dilakukan sebagai berikut:

**Rentang nilai.** Grid search menggunakan ruang pencarian 5 × 5 = 25 kombinasi. Nilai λ (koefisien L_S) diuji pada rentang {128, 256, 512, 1024, 2048}. Nilai τ (koefisien L_RD) diuji pada rentang {256, 512, 1024, 2048, 4096}. Rentang ini dipilih berdasarkan eksplorasi awal yang menunjukkan bahwa nilai di luar rentang tersebut menghasilkan performa yang sangat buruk (L_RD dominan menghancurkan representasi) atau tidak memberikan efek regulasi yang berarti.

**Kriteria pemilihan.** Metrik yang digunakan adalah **skor agregat** dari hasil uji analogi, yang merupakan rata-rata tertimbang dari Acc@1, Acc@5, dan Acc@10 pada data validasi WikiFoS. Konfigurasi dengan skor agregat tertinggi (λ=128, τ=256, skor=1,0000) dipilih sebagai model Baseline terbaik. Kombinasi λ=512, τ=4096 menjadi yang terburuk (skor=0,0000) karena dominasi penalti jarak yang berlebihan.

**Sifat grid search.** Grid search bersifat **global**, bukan per-domain. Artinya, satu pasangan (λ, τ) diterapkan secara seragam ke seluruh 16 domain. Hal ini merupakan keterbatasan pendekatan Baseline karena diasumsikan bahwa satu bobot statis dapat mengimbangi seluruh heterogenitas domain — asumsi yang justru diatasi oleh UW-MAP.

---

## **C.6 — Prosedur UW-MAP**

**Pertanyaan:** Parameter uncertainty s diperbarui sekali per *outer step* dengan akumulasi gradien dari seluruh domain. Bagaimana stabilitas pelatihan terjamin?

**Jawaban:**

Terima kasih. Stabilitas pelatihan UW-MAP dijamin melalui beberapa mekanisme:

**Pertama, akumulasi gradien.** Parameter s = {s_F, s_S, s_RD} di-set *zero grad* sekali di awal setiap outer step. Kemudian, untuk setiap domain t ∈ {1,...,T}, dilakukan *forward pass* dan *backward pass*. Gradien dari seluruh domain terakumulasi secara otomatis di parameter s melalui *computational graph* PyTorch. Setelah semua domain selesai, optimizer uncertainty melakukan satu langkah update. Skema ini menjamin bahwa update s mencerminkan kontribusi seluruh domain, bukan hanya satu domain dominan.

**Kedua, clamping.** Nilai s dikurung (*clamp*) pada rentang [-3.0, 4.0] setelah setiap update. Rentang ini dipilih secara empiris: s < -3.0 berarti σ < 0.05 yang menghasilkan bobot presisi sangat besar dan berpotensi menyebabkan gradien meledak (*exploding gradient*); s > 4.0 berarti σ > 7.4 yang membuat bobot efektif hampir nol. Clamping mencegah kedua kondisi ekstrem ini.

**Ketiga, learning rate terpisah.** Parameter s menggunakan learning rate yang lebih kecil (0,01 → 0,001) dibandingkan embedding U (0,1 → 0,01). Perbedaan satu orde ini penting karena skala gradien s berbeda dengan gradien embedding. Jadwal penurunan LR identik di step 100 dan 300 untuk konsistensi.

**Keempat, gradient clipping.** Norma gradien embedding dibatasi maksimal 1,0 untuk mencegah lonjakan gradien yang dapat mengganggu estimasi s.

---

## **C.7 — Optimizer dan Update**

**Pertanyaan:** Mengapa Adam? Apakah ada perbedaan learning rate antara optimizer embedding per-domain dan optimizer s? Skema update sequential per step?

**Jawaban:**

**Pemilihan Adam.** Optimizer Adam dipilih karena tiga alasan utama:
1. **Adaptive learning rate per parameter.** Adam menghitung learning rate individual berdasarkan estimasi momen pertama dan kedua gradien, cocok untuk masalah dengan skala gradien berbeda antar-parameter — seperti pada W2VPred di mana gradien L_F jauh lebih besar dari L_S dan L_RD.
2. **Momentum.** Adam menggunakan momentum yang mempercepat konvergensi pada *plateau* dan meredam osilasi di *ravine*.
3. **Standar de facto.** Adam merupakan optimizer paling umum untuk model embedding dan MTL, memudahkan reproduksibilitas.

**Perbedaan learning rate.** Ya, terdapat perbedaan signifikan. Learning rate embedding U menggunakan jadwal: 0,1 (step < 100), 0,05 (step 100-300), 0,01 (step ≥ 300). Sementara learning rate s menggunakan: 0,01 (step < 100), 0,005 (step 100-300), 0,001 (step ≥ 300). Rasio LR_U : LR_s sekitar 10:1. Perbedaan ini diperlukan karena gradien terhadap s memiliki skala yang berbeda dari gradien terhadap U.

**Skema update sequential:**
1. Zero grad semua optimizer embedding dan optimizer uncertainty
2. Loop atas domain t dalam urutan acak (shuffled):
   a. Forward pass model pada domain t → hitung J_t
   b. Backward pass → gradien untuk U_t dan s terakumulasi
   c. Gradient clipping pada U_t
   d. Step optimizer embedding t
3. Setelah loop selesai, step optimizer uncertainty s sekali
4. Clamp s ke [-3.0, 4.0]

---

## **C.8 — Skenario Eksperimen**

**Pertanyaan:** Variasi jumlah iterasi, ukuran embedding, konteks window? Bagaimana reprodusibilitas?

**Jawaban:**

Terima kasih. Berikut adalah spesifikasi skenario eksperimen:

**Parameter tetap (sama untuk Baseline dan UW-MAP):**
- Jumlah iterasi: 500 epoch
- Dimensi embedding: d = 100
- Ukuran jendela konteks: 5 kata (ke kiri dan kanan)
- Vocabulary size (V): ~70.000 kata (setelah filtering frekuensi > 5 dan muncul di ≥ 2 domain)
- Learning rate scheduler identik
- Random seed: 42 untuk semua eksperimen

**Variasi eksperimen:**
- Baseline: 25 konfigurasi (λ × τ); masing-masing 1 run
- UW-MAP: 1 run untuk init_s = 0,0; plus variasi init_s ∈ {-2, 0, 2, 5} untuk analisis sensitivitas
- Setiap konfigurasi dijalankan 1 kali karena sifat deterministik (seed tetap)

**Reproduksibilitas:**
1. Random seed di-set di semua level: Python random, NumPy, dan PyTorch
2. Semua konfigurasi hyperparameter dicatat: dalam kode (model.py: parameter constructor) dan log file pelatihan
3. Script preprocessing PPMI terdokumentasi dan dapat dijalankan ulang
4. Hasil disimpan per checkpoint (setiap 50 epoch) mencakup embedding U, loss history, weight history, dan parameter σ

---

## **C.9 — Metrik Recall@k**

**Pertanyaan:** Mengapa Recall@k (k=1,2,3) dipilih dibanding Precision@k atau MAP? Interpretasi Recall@1, @2, @3 dalam konteks embedding multidomain?

**Jawaban:**

Terima kasih. Untuk evaluasi struktur — yaitu mengukur seberapa akurat model memprediksi relasi kedekatan antar-domain — Recall@k dipilih dengan pertimbangan berikut:

**Recall@k vs Precision@k:** Dalam konteks prediksi struktur domain, pertanyaan yang ingin dijawab adalah: "dari seluruh relasi yang seharusnya ada (ground truth struktur), berapa proporsi yang berhasil diprediksi oleh model dalam k prediksi teratas?" Ini adalah pertanyaan *recall*, bukan *precision*. Precision@k menjawab pertanyaan "dari k prediksi yang dihasilkan, berapa yang benar?" — yang kurang relevan karena kita lebih peduli pada cakupan struktur yang tertangkap.

**Recall@k vs MAP:** MAP (*Mean Average Precision*) lebih cocok untuk *ranking* dengan jumlah relevan yang diketahui pasti (seperti *information retrieval*). Dalam struktur domain, jumlah relasi relevan bersifat subjektif tergantung pada bobot afinitas W. Recall@k lebih mudah diinterpretasikan secara langsung.

**Interpretasi per k:**
- **Recall@1:** Mengukur apakah pasangan domain terdekat dalam embedding sudah sesuai dengan ground truth. Ini adalah metrik paling ketat — satu kesalahan langsung menurunkan skor.
- **Recall@2:** Memperbolehkan satu prediksi alternatif. Berguna ketika dua domain memiliki kedekatan yang hampir sama dengan domain target.
- **Recall@3:** Memberikan toleransi lebih besar, mengukur apakah model setidaknya menempatkan domain relevan dalam tiga tetangga terdekat.

---

## **C.10 — Metrik Acc@k Analogi**

**Pertanyaan:** Bagaimana relasi analogi didefinisikan pada korpus WikiFoS? Apakah diuji dalam domain sama atau lintas domain?

**Jawaban:**

Terima kasih. Evaluasi analogi pada korpus WikiFoS mengadaptasi paradigma word analogy tradisional (Mikolov et al., 2013) ke konteks multidomain:

**Definisi relasi analogi.** Relasi analogi didefinisikan melalui operasi vektor: jika terdapat hubungan semantik antara kata a dan b dalam suatu domain, maka vektor yang merepresentasikan hubungan tersebut — yaitu b - a — harus dapat ditransfer ke kata c untuk memprediksi kata d. Dengan kata lain, d diharapkan menjadi kata yang vektornya paling dekat dengan hasil operasi vektor b - a + c. Relasi yang diuji mencakup relasi hierarkis (isa/hypernym), relasi fungsional, dan relasi tematik.

**Konstruksi dataset.** Dataset analogi dikonstruksi secara mandiri untuk kebutuhan penelitian, berdasarkan struktur hierarkis WikiFoS. Contoh: jika termodinamika (Natural Sciences) berelasi dengan fisika kuantum (Natural Sciences) dengan cara yang sama seperti novel (Humanities) berelasi dengan puisi (Humanities), maka model harus mampu menangkap pola relasional ini.

**Lintas-domain vs intra-domain.** Pengujian dilakukan dalam dua mode:
1. **Intra-domain:** a, b, c, dan d berasal dari domain yang sama — menguji kemampuan model menangkap relasi semantik spesifik-domain.
2. **Cross-domain:** a-b dari satu domain, c dari domain lain — menguji sejauh mana representasi yang dipelajari bersifat konsisten dan dapat ditransfer antar-domain.

Metrik yang dilaporkan: **Acc@1, Acc@5, Acc@10** — persentase prediksi yang benar dalam 1, 5, dan 10 prediksi teratas dari kosakata penuh.

---

## **C.11 — Cosine Similarity Lintas Domain**

**Pertanyaan:** Bagaimana memastikan cosine similarity antar domain merepresentasikan relasi semantik bermakna, bukan artefak dimensionalitas?

**Jawaban:**

Terima kasih. Pertanyaan ini menyentuh isu validitas representasi yang sangat penting. Kami memastikan cosine similarity bermakna melalui tiga pendekatan:

**Pertama, validasi terhadap ground truth struktur.** Matriks afinitas W yang dikonstruksi dari hierarki WikiFoS menyediakan *ground truth* tentang domain mana yang seharusnya dekat dan mana yang jauh. Jika cosine similarity antara embedding U_t dan U_t' berkorelasi positif dengan W_{t,t'} — yang merupakan pengukuran struktural yang independen dari proses pelatihan — maka similarity tersebut mencerminkan struktur semantik nyata, bukan artefak.

**Kedua, evaluasi melalui tugas downstream.** Cosine similarity digunakan dalam tugas analogi lintas-domain. Jika hasil prediksi analogi masuk akal secara semantik (misalnya kata "DNA" dari Biology memiliki tetangga terdekat dari Chemistry yang relevan seperti "protein"), maka similarity tersebut dapat dianggap bermakna.

**Ketiga, analisis dimensi dan normalisasi.** Untuk membedakan similarity yang bermakna dari artefak dimensionalitas, kami membandingkan distribusi cosine similarity pada data nyata dengan distribusi pada embedding acak (randomized baseline). Jika pada embedding acak cosine similarity terpusat di nol dengan varians kecil, sementara pada embedding terlatih terdapat struktur jelas dengan beberapa pasangan sangat dekat dan lainnya jauh, maka similarity tersebut mencerminkan sinyal semantik, bukan *noise* dimensional.

---

## **C.12 — Spearman ρ**

**Pertanyaan:** Terhadap ground truth apa dibandingkan? Apakah menggunakan penilaian manusia atau benchmark yang ada?

**Jawaban:**

Terima kasih. Korelasi Spearman ρ digunakan untuk mengukur kesesuaian peringkat (*ranking consistency*) antara dua sumber informasi:

**Ground truth yang digunakan.** Spearman ρ dihitung dengan membandingkan peringkat kedekatan domain dari model (berdasarkan cosine similarity antar embedding domain U_t) terhadap peringkat dari matriks afinitas W yang dikonstruksi dari struktur hierarkis WikiFoS. Matriks W sendiri dibangun dengan aturan: W_{t,t'} = 1 jika t dan t' berada dalam klaster yang sama, dan 0 jika berbeda (dengan normalisasi baris). Dengan kata lain, ground truth adalah struktur klaster yang telah ditentukan sebelumnya oleh kurasi dataset.

**Penilaian manusia.** Penelitian ini tidak menggunakan penilaian manusia secara langsung. Sebagai gantinya, kami menggunakan struktur taksonomi yang sudah divalidasi oleh kurator dataset WikiFoS sebagai proksi *gold standard*. Pendekatan ini lebih objektif dan reproducible dibandingkan penilaian subjektif manusia, meskipun memiliki keterbatasan dalam menangkap nuansa semantik yang lebih halus.

**Interpretasi.** Spearman ρ mengukur sejauh mana peringkat kedekatan domain dari model konsisten dengan peringkat yang diharapkan dari struktur hierarkis. Nilai ρ > 0 menunjukkan bahwa model setidaknya menangkap arah struktur yang benar — domain dalam satu klaster cenderung lebih dekat daripada lintas klaster. Nilai ρ yang lebih tinggi pada UW-MAP dibandingkan Baseline mengindikasikan bahwa pembobotan adaptif menghasilkan struktur ruang embedding yang lebih sesuai dengan taksonomi domain.

---

## **C.13 — Validasi Data**

**Pertanyaan:** Inspeksi outlier, missing values, distribusi frekuensi kata tidak seimbang? Penanganan domain dengan token sangat kecil?

**Jawaban:**

Terima kasih. Validasi data dilakukan melalui beberapa tahap:

**Pertama, distribusi frekuensi kata.** Analisis distribusi menunjukkan ketidakseimbangan alami: sebagian kecil kata memiliki frekuensi sangat tinggi (kata fungsi residual) sementara sebagian besar kata memiliki frekuensi rendah. Untuk mengurangi efek ekor panjang (*long tail*), kata dengan frekuensi < 5 di seluruh korpus dihapus dari kosakata. Kosakata akhir sekitar 70.000 kata.

**Kedua, distribusi antar-domain.** Sebagaimana dilaporkan, jumlah artikel per-domain tidak seragam (Literature: 24.800, Mechanical Engineering: 4.978, rasio ~5:1). Domain dengan jumlah token kecil berpotensi menghasilkan matriks PPMI yang lebih *noisy*. Penanganannya bukan dengan *undersampling* atau *oversampling*, melainkan melalui mekanisme MAP adaptif itu sendiri — domain dengan data lebih sedikit akan memiliki ketidakpastian lebih tinggi (σ besar) sehingga bobot efektifnya dikurangi secara otomatis dalam fungsi objektif gabungan.

**Ketiga, missing values.** Matriks PPMI secara alami bersifat *sparse* karena tidak semua pasangan kata muncul bersama. Nilai PPMI = 0 untuk pasangan yang tidak ko-okuren bukanlah *missing value*, melainkan informasi valid bahwa kedua kata tidak memiliki asosiasi yang terukur. Oleh karena itu, tidak diperlukan imputasi.

**Keempat, outlier.** Inspeksi kualitatif dilakukan pada matriks PPMI untuk mendeteksi nilai ekstrem yang mungkin disebabkan oleh kesalahan preprocessing (misalnya spasi ganda, karakter khusus). Tidak ditemukan outlier sistematis yang memerlukan intervensi khusus.

---

## **C.14 — Pemilihan Hyperparameter**

**Pertanyaan:** Selain τ dan λ, hyperparameter apa yang di-tune? Proporsi training/validasi?

**Jawaban:**

Terima kasih. Berikut adalah daftar hyperparameter yang ditentukan dalam eksperimen:

**Hyperparameter yang ditentukan secara eksperimental:**
1. **τ dan λ** — melalui grid search 5×5 untuk Baseline (25 kombinasi)
2. **Dimensi embedding (d)** — ditetapkan ke 100 berdasarkan konvensi word embedding multidomain (Lassner et al., 2023)
3. **Learning rate embedding** — jadwal bertahap: 0,1 → 0,05 → 0,01
4. **Learning rate uncertainty** — jadwal bertahap: 0,01 → 0,005 → 0,001
5. **Inisialisasi s = 0,0** — dipilih karena setara dengan σ = 1,0 (netral, tidak bias ke bobot tinggi maupun rendah)
6. **Clamp range s ∈ [-3.0, 4.0]** — ditentukan dari eksplorasi awal

**Hyperparameter tetap (tidak di-tune):**
- Ukuran jendela konteks: 5
- Jumlah epoch: 500
- Ukuran batch: full-batch (karena PPMI sudah teragregasi)
- Gradien clipping max_norm: 1,0

**Proporsi data.** Data tidak dibagi secara tradisional (train/val/test) karena PPMI adalah representasi agregat dari seluruh korpus. Sebagai gantinya, model dilatih pada seluruh data PPMI, dan evaluasi dilakukan pada tugas analogi yang menggunakan subset kata yang tidak tumpang tindih secara eksplisit. Pendekatan ini konsisten dengan metodologi W2VPred asli dan umum dalam pelatihan *word embedding* statis.

---

## **C.15 — Inisialisasi init_s = 0.0**

**Pertanyaan:** Mengapa nilai tersebut dipilih? Sensitivitas hasil terhadap inisialisasi s? Dampak inisialisasi berbeda pada konvergensi?

**Jawaban:**

**Alasan pemilihan init_s = 0.0.** Nilai init_s = 0.0 setara dengan σ = exp(0/2) = 1.0. Ini berarti pada awal pelatihan, variansi σ² = 1.0 untuk semua komponen loss (F, S, RD), sehingga bobot efektif awal 1/(2σ²) = 0,5 untuk setiap komponen. Inisialisasi ini bersifat **netral** — tidak memberikan preferensi awal terhadap komponen loss mana pun dan memungkinkan model untuk secara mandiri menemukan keseimbangan selama pelatihan.

**Sensitivitas terhadap inisialisasi.** Eksperimen dengan variasi init_s ∈ {-2, 0, 2, 5} menunjukkan bahwa:
- **init_s ∈ {-2, 0, 2}** — performa analogi stabil: Acc@1 bertahan di atas 32% (32,22%–33,86%). Model mampu berkonvergensi ke konfigurasi yang setara meskipun dari titik awal berbeda. Ini membuktikan korolari ekuivalensi: perbedaan inisialisasi s identik dengan memulai dari kombinasi (λ, τ) yang berbeda secara teoretis, dan JMAP mampu menavigasi ruang ekuivalensi tersebut.
- **init_s = 5** — performa turun signifikan (Acc@1 = 28,89%). Pada inisialisasi ini σ ≈ 12, sehingga bobot efektif awal 1/(2·12²) ≈ 0,003 — sangat kecil. Gradien awal hampir mati, menyebabkan model gagal mempelajari representasi yang baik di fase krusial awal.

**Implikasi:** Selama inisialisasi tidak berada di ekstrem yang mematikan gradien (s > 4), JMAP robust terhadap pilihan init_s. Inisialisasi netral s = 0,0 direkomendasikan sebagai nilai *default* yang aman dan teoretis paling tidak bias.

---

## **C.16 — Kompleksitas Komputasi**

**Pertanyaan:** Perbandingan biaya Baseline (grid search) vs UW-MAP? Waktu pelatihan per konfigurasi? Skalabilitas terhadap jumlah domain?

**Jawaban:**

Terima kasih. Perbandingan kompleksitas komputasi adalah sebagai berikut:

**Baseline:** Membutuhkan 25 runs × 500 epoch = **12.500 epoch total** untuk menemukan (λ, τ) optimal. Beban ini linear terhadap ukuran grid: grid 10×10 membutuhkan 50.000 epoch. Setiap run sepenuhnya independen — tidak ada informasi yang dibagikan antar-run.

**UW-MAP:** Cukup **1 run × 500 epoch = 500 epoch total**. Overhead tambahan per step: (1) tiga parameter uncertainty s yang diupdate sekali per step — biaya komputasi marginal; (2) akumulasi gradien s — otomatis melalui PyTorch autograd, tidak ada overhead manual.

**Efisiensi:** Pengurangan 96% total epoch (dari 12.500 menjadi 500). Percepatan ini tidak mengorbankan kualitas — bahkan UW-MAP unggul dalam beberapa metrik evaluasi.

**Skalabilitas terhadap T (jumlah domain).** Kompleksitas per step adalah O(T·V²) untuk forward pass (komputasi L_F) ditambah O(T²·V·d) untuk struktur loss. UW-MAP menambahkan O(1) per step untuk update s. Keduanya (Baseline dan UW-MAP) memiliki skalabilitas yang sama terhadap T karena perbedaan hanya pada tiga parameter tambahan. Untuk T >> 16, bottleneck utama adalah O(T²) pada komputasi matriks jarak, bukan mekanisme uncertainty. Pada dataset dengan T besar, aproksimasi struktur (misalnya sampling pasangan domain) diperlukan terlepas dari mode yang digunakan.

---

## **C.17 — Analisis Sensitivitas Dimensi**

**Pertanyaan:** Apakah analisis sensitivitas terhadap jumlah dimensi embedding dilakukan? Bagaimana performa berubah dengan dimensi berbeda?

**Jawaban:**

Terima kasih. Analisis sensitivitas dimensi (d) tidak dilakukan secara formal dalam penelitian ini karena beberapa pertimbangan:

**Pertama, konsistensi dengan W2VPred asli.** Untuk memastikan perbandingan yang adil antara Baseline dan UW-MAP, semua parameter kecuali τ dan λ (untuk Baseline) dibuat identik. Dimensi embedding ditetapkan ke d=100, sesuai dengan konfigurasi yang digunakan oleh Lassner et al. (2023) dalam model W2VPred asli. Mengubah d akan mempersulit isolasi efek dari mekanisme uncertainty weighting terhadap peningkatan performa.

**Kedua, trade-off dimensi.** Dimensi embedding yang lebih besar (d > 100) meningkatkan kapasitas representasi namun juga meningkatkan risiko *overfitting* dan biaya komputasi O(V·d). Sebaliknya, d < 100 mungkin tidak cukup untuk menangkap struktur semantik kompleks dari 70.000 kosakata.

**Ketiga, fokus penelitian.** Tujuan utama penelitian adalah memvalidasi formulasi JMAP dan mekanisme uncertainty weighting, bukan mengoptimalkan arsitektur embedding secara menyeluruh. Analisis dimensi secara eksplisit direkomendasikan sebagai *future work*, khususnya untuk menguji generalisasi klaim ekuivalensi JMAP-Baseline pada berbagai d.

---

## **C.18 — Reproduksibilitas**

**Pertanyaan:** Langkah untuk memastikan eksperimen reproducible? Seed random, konfigurasi hyperparameter, script preprocessing terdokumentasi?

**Jawaban:**

Reproduksibilitas dijaga melalui beberapa lapisan dokumentasi dan standardisasi:

**1. Seed tetap.** Random seed 42 di-set secara eksplisit di tiga level: Python `random.seed(42)`, NumPy `np.random.seed(42)`, dan PyTorch `torch.manual_seed(42)`. Untuk CUDA, `torch.cuda.manual_seed_all(42)` dan `torch.backends.cudnn.deterministic = True` diterapkan untuk meminimalkan non-determinisme GPU.

**2. Dokumentasi hyperparameter.** Semua hyperparameter tercatat dalam dua tempat:
- Dalam kode: parameter constructor `W2VPred()` dan `Trainer()` di `model.py` dan `trainer.py`
- Dalam log file pelatihan: setiap run menghasilkan log yang mencatat konfigurasi lengkap

**3. Script preprocessing.** Proses ekstraksi PPMI dari korpus WikiFoS didokumentasikan dengan urutan langkah yang eksplisit: tokenisasi → ko-okurensi → PPMI → filtering kosakata. Dataset WikiFoS sendiri bersifat publik (*open access*), sehingga peneliti lain dapat mengunduh data yang sama dari repositori Hugging Face.

**4. Checkpoint reguler.** Setiap 50 epoch, state model disimpan mencakup: embedding U, loss history, weight history, parameter σ, dan gradient logs. Ini memungkinkan inspeksi pasca-pelatihan dan *debugging* jika ditemukan anomali.

**5. Kode sumber.** Seluruh kode tersedia di repositori penelitian mencakup model, trainer, dan utilitas evaluasi. Dokumentasi inline menjelaskan setiap fungsi dan parameter.

---

## **C.19 — PPMI vs Word2Vec / GloVe**

**Pertanyaan:** Mengapa PPMI dipilih, bukan word2vec atau GloVe? Perbandingan performa jika input berbeda?

**Jawaban:**

**Alasan pemilihan PPMI.** PPMI dipilih sebagai representasi input karena tiga alasan:

**Pertama, konsistensi dengan W2VPred asli.** Lassner et al. (2023) merancang W2VPred untuk merekonstruksi matriks PPMI melalui dekomposisi U_t U_t^T. Mengganti input akan mengubah definisi Fidelity Loss L_F secara fundamental dan mempersulit perbandingan dengan Baseline. Fokus penelitian adalah pada mekanisme adaptasi bobot loss, bukan pada representasi input.

**Kedua, keunggulan teoretis PPMI.** PPMI memiliki interpretasi probabilistik yang jelas: mengukur asosiasi kata berdasarkan *Pointwise Mutual Information* dengan koreksi bias frekuensi melalui pemotongan nilai negatif. Berbeda dengan word2vec yang menggunakan *negative sampling* (aproksimasi heuristik) atau GloVe yang mengoptimasi rasio ko-okurensi (regresi log-bilinear), PPMI bersifat non-parametrik dan dapat dihitung secara eksak dari statistik ko-okurensi. Sifat ini penting untuk formulasi JMAP di mana likelihood Gaussian membutuhkan data observasi yang terdefinisi dengan baik.

**Ketiga, sifat sparse PPMI.** Matriks PPMI bersifat sparse, sehingga penyimpanan dan komputasi dapat dioptimasi menggunakan tensor sparse PyTorch. Hal ini penting untuk ukuran kosakata V ~ 70.000.

**Perbandingan dengan input alternatif.** Jika word2vec atau GloVe digunakan sebagai input, L_F harus didefinisikan ulang dan kemungkinan besar memerlukan asumsi likelihood yang berbeda (misalnya distribusi kategorikal untuk skip-gram). Perbandingan performa antar-representasi input di luar cakupan penelitian ini, namun merupakan arah yang menarik untuk penelitian lanjutan.

---

## **C.20 — Uji Signifikansi Statistik**

**Pertanyaan:** Apakah uji signifikansi dilakukan (paired t-test, Wilcoxon) untuk Baseline vs UW-MAP?

**Jawaban:**

Terima kasih. Terkait uji signifikansi statistik:

**Jawaban singkat:** Uji signifikansi formal seperti paired t-test atau Wilcoxon signed-rank test **belum dilakukan** dalam penelitian ini.

**Alasan:**

**Pertama, sifat eksperimen.** Baseline membutuhkan grid search 25 run, sementara UW-MAP hanya 1 run (dengan variasi init_s untuk analisis sensitivitas). Untuk melakukan uji signifikansi yang valid, diperlukan beberapa run dengan random seed berbeda untuk setiap konfigurasi guna mendapatkan distribusi performa. Dengan seed tetap, setiap konfigurasi hanya menghasilkan satu titik data — tidak cukup untuk uji statistik parametrik maupun non-parametrik.

**Kedua, tujuan eksperimen.** Fokus utama adalah memvalidasi formulasi matematis JMAP dan menunjukkan bahwa mekanisme adaptif dapat menggantikan grid search tanpa mengorbankan kualitas. Efisiensi komputasi (96% pengurangan) adalah bukti utama keunggulan praktis, di samping peningkatan kualitatif pada representasi.

**Ketiga, pendekatan analitis sebagai alternatif.** Sebagai gantinya, analisis komparatif dilakukan melalui:
- Perbandingan langsung nilai loss akhir dan metrik evaluasi antara Baseline terbaik vs UW-MAP
- Analisis stabilitas inisialisasi (init_s ∈ {-2,0,2,5}) untuk menunjukkan konsistensi
- Visualisasi kurva konvergensi, rasio loss, dan dinamika parameter σ

**Rekomendasi.** Untuk penelitian lanjutan, eksperimen dengan 5–10 random seed berbeda untuk setiap konfigurasi akan memungkinkan uji signifikansi yang lebih ketat dan memperkuat klaim superioritas UW-MAP secara statistik.

---

> **Catatan:** Jawaban di atas disusun berdasarkan penelitian skripsi berjudul "Reformulasi Probabilistik W2VPred Menggunakan Joint Maximum A Posteriori (JMAP)" dengan dataset WikiFoS (16 domain), dua mode pelatihan (Baseline vs UW-MAP), dan evaluasi menggunakan Acc@k untuk tugas analogi.
>
> **Dibuat:** 2026-05-12
