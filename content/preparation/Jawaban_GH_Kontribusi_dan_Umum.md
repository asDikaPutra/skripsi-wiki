# Jawaban Sidang — Kategori G & H

## KATEGORI G: KONTRIBUSI, KEASLIAN & SINTESIS

---

### G1. Apa kontribusi paling fundamental dari skripsi ini?

Kontribusi paling fundamental dari skripsi ini adalah reformulasi probabilistik terhadap metode Word2Vec Prediction (W2VPred) ke dalam kerangka Bayesian hierarchical model. Sebelumnya, W2VPred beroperasi secara deterministik: hyperparameter dipilih melalui grid search yang mahal secara komputasi, lalu model dilatih sekali dengan konfigurasi terpilih. Pendekatan kami menggantikan proses tersebut dengan pemodelan joint distribution atas data, parameter, dan hyperparameter secara terpadu. Dengan kata lain, kami tidak lagi memisahkan tahap *model selection* dari tahap *parameter estimation* — keduanya diintegrasikan dalam satu kerangka inferensi yang koheren secara statistika.

Kontribusi ini fundamental karena mengubah paradigma optimasi dari eksplorasi diskret (grid search) menjadi optimasi kontinu dalam ruang hyperparameter. Implikasinya, seluruh ketidakpastian yang terkait dengan pemilihan hyperparameter secara eksplisit dimodelkan melalui distribusi *a posteriori*, bukan diabaikan seperti pada prosedur dua-tahap konvensional. Hal ini membuka jalan bagi analisis ketidakpastian (*uncertainty quantification*) yang lebih rigorus dalam pemodelan word embedding, sebuah aspek yang selama ini kurang mendapat perhatian dalam literatur.

---

### G2. Apa beda pendekatan Anda dengan grid search biasa?

Perbedaan utama terletak pada filosofi optimasi. Grid search memperlakukan hyperparameter sebagai *nuisance parameters* yang harus ditentukan sebelum estimasi parameter utama. Prosesnya bersifat diskret: kita mendefinisikan kisi (grid) nilai hyperparameter, melatih model untuk setiap titik, lalu memilih titik terbaik berdasarkan metrik validasi. Pendekatan ini memiliki tiga kelemahan mendasar: (1) biaya komputasi yang meningkat secara eksponensial seiring jumlah hyperparameter (curse of dimensionality), (2) resolusi yang terbatas pada titik-titik grid sehingga kemungkinan terlewatnya konfigurasi optimal, dan (3) tidak adanya formalisme probabilistik yang memungkinkan kuantifikasi ketidakpastian.

JMAP, sebaliknya, memperlakukan hyperparameter sebagai variabel acak yang diestimasi bersama parameter model melalui maximum a posteriori bersama (Joint MAP). Alih-alih mencoba-coba nilai hyperparameter satu per satu, JMAP merumuskan satu fungsi objektif yang mencakup data likelihood, prior atas parameter, dan prior atas hyperparameter — lalu mengoptimasi semuanya secara simultan. Hasilnya adalah (1) biaya komputasi setara dengan satu kali training tanpa kebutuhan validasi silang, (2) solusi yang kontinu dan tidak terbatas oleh grid, serta (3) estimasi yang secara asimtotik konsisten. Eksperimen kami menunjukkan JMAP tidak hanya setara tetapi dalam beberapa konfigurasi mengungguli grid search, dengan keunggulan tambahan berupa efisiensi komputasi yang signifikan.

---

### G3. Mengapa Anda menyebutnya "JMAP pertama di domain embedding"?

JMAP — Joint Maximum a Posteriori — telah dikenal dalam literatur statistika dan machine learning, terutama dalam konteks model hierarchical Bayesian dan deep learning multi-task. Namun, penerapannya secara eksplisit untuk mengestimasi hyperparameter model word embedding secara simultan dengan parameter embedding itu sendiri belum pernah dilakukan sebelumnya. Karya Kendall et al. (2018) misalnya, menggunakan prinsip yang mirip tetapi dalam konteks multi-task learning untuk vision, di mana weight dari setiap task-loss diestimasi bersama parameter jaringan. Tidak ada karya sebelumnya yang merumuskan JMAP untuk mengoptimasi hyperparameter word embedding seperti ukuran konteks, jumlah negatif sampling, dan regularization coefficient secara joint.

Kebaruan ini bukan semata-mata karena penerapan teknik yang sudah ada ke domain baru. Lebih dari itu, kami mendemonstrasikan bahwa formulasi JMAP untuk word embedding menghasilkan solusi yang secara teoretis lebih koheren — di mana setiap hyperparameter memiliki interpretasi Bayesian yang jelas — dan secara empiris kompetitif. Dengan kata lain, kami tidak sekadar "mengganti grid search dengan JMAP", tetapi merumuskan ulang seluruh proses estimasi word embedding dalam bahasa probabilistik yang memungkinkan pengembangan lebih lanjut, seperti inference variasional atau MCMC yang lebih ekspresif.

---

### G4. Apa kelebihan JMAP dibandingkan pendekatan Anda sebelumnya (grid search)?

Kelebihan pertama adalah efisiensi komputasi. Grid search dengan K titik per hyperparameter dan D hyperparameter memerlukan O(K^D) kali training. Untuk D=3 dan K=10, ini berarti 1.000 kali training. JMAP hanya memerlukan satu kali proses training dengan tambahan beberapa parameter yang dioptimasi secara end-to-end. Dalam eksperimen kami, JMAP mencapai konvergensi dalam waktu yang sebanding dengan satu kali training W2VPred standar, menghasilkan penghematan waktu hingga dua hingga tiga orde magnitudo.

Kelebihan kedua adalah kualitas solusi. Grid search hanya mengevaluasi titik-titik diskret dan bergantung pada resolusi grid yang ditentukan pengguna. JMAP beroperasi pada ruang kontinu sehingga dapat menemukan konfigurasi hyperparameter yang mungkin terlewat oleh grid. Lebih penting lagi, JMAP memanfaatkan informasi gradien dari fungsi objektif — ketika likelihood dan prior bersifat diferensiabel — sehingga arah optimasi lebih informatif dibandingkan pencarian buta pada grid. Hasil eksperimen kami mengonfirmasi bahwa JMAP setara atau lebih unggul dalam metrik validasi seperti koherensi topik dan akurasi analogi kata, tanpa memerlukan biaya pencarian hyperparameter.

---

### G5. Bagaimana Anda membuktikan bahwa JMAP setara dengan grid search?

Kami membuktikan melalui dua jalur: teoretis dan empiris. Secara teoretis, kami menunjukkan bahwa JMAP dapat dipandang sebagai generalisasi kontinu dari grid search. Dalam limit ketika prior atas hyperparameter bersifat uniform pada titik-titik grid dan aproksimasi Laplace digunakan, JMAP mereduksi menjadi prosedur yang mirip dengan grid search. Namun, JMAP melampaui grid search karena ia tidak terbatas pada titik diskret dan dapat memanfaatkan informasi gradien.

Secara empiris, kami merancang eksperimen komparatif yang ketat. Untuk setiap dataset dan konfigurasi, kami menjalankan grid search dengan resolusi tinggi (10-15 titik per hyperparameter) sebagai baseline. Kemudian, kami menjalankan JMAP dengan inisialisasi acak dan membandingkan metrik finalnya. Hasilnya menunjukkan bahwa JMAP secara konsisten mencapai performa dalam rentang ±2% dari grid search terbaik, dan dalam beberapa kasus bahkan melampauinya. Lebih penting lagi, JMAP mencapai hasil tersebut tanpa memerlukan proses pencarian terpisah — cukup satu kali optimasi end-to-end. Dengan demikian, JMAP tidak hanya setara secara performa tetapi unggul secara efisiensi.

---

### G6. Apakah JMAP bisa menggantikan grid search sepenuhnya?

JMAP dapat menggantikan grid search untuk sebagian besar skenario word embedding, terutama ketika fungsi objektif bersifat diferensiabel terhadap hyperparameter — yang memang menjadi asumsi dasar dalam W2VPred. Dalam konteks ini, JMAP menawarkan solusi yang lebih elegan dan efisien. Namun, perlu dicatat bahwa JMAP mengoptimasi hyperparameter berdasarkan evidence atau marginal likelihood yang diaproksimasi, bukan berdasarkan metrik downstream task seperti akurasi analogi atau koherensi topik. Jika tujuan akhir adalah performa pada task tertentu dan hubungan antara hyperparameter dan metrik task tidak termodelkan dalam likelihood, grid search dengan validasi pada task tersebut mungkin masih relevan.

Selain itu, JMAP bergantung pada keberadaan prior yang informatif atau setidaknya proper untuk hyperparameter. Dalam situasi di mana pengetahuan prior sangat minim, hasil JMAP mungkin sensitif terhadap pilihan prior. Grid search dengan prior yang uniform secara implisit menghindari masalah ini. Meskipun demikian, kami berargumen bahwa untuk tujuan eksplorasi awal atau deployment dalam skala besar, JMAP adalah pilihan yang lebih unggul. Kombinasi keduanya pun dimungkinkan: JMAP untuk estimasi cepat, diikuti grid search halus di sekitar solusi JMAP untuk fine-tuning.

---

### G7. Hubungan skripsi Anda dengan Kendall et al. (2018)?

Kendall et al. (2018) mengusulkan pendekatan untuk menyeimbangkan task-task dalam multi-task learning dengan cara mengestimasi weight setiap task loss sebagai parameter yang bisa di-train. Secara matematis, mereka merumuskan likelihood Gaussian dengan variance yang bisa dipelajari dan menunjukkan bahwa meminimasi negative log-likelihood bersama akan secara otomatis menyeimbangkan kontribusi setiap task. Meskipun konteksnya berbeda — multi-task neural network untuk computer vision — prinsip yang digunakan secara matematis ekuivalen dengan JMAP.

Hubungan dengan skripsi kami adalah bahwa Kendall et al. (2018) merupakan kasus khusus dari JMAP ketika prior atas hyperparameter bersifat improper (uniform). Dalam formulasi kami, kami menunjukkan bahwa ketika kita menggunakan prior improper (p(λ) ∝ 1), JMAP mereduksi menjadi prosedur yang identik dengan pendekatan Kendall. Kontribusi kami adalah: (1) generalisasi ke prior proper yang informatif, (2) penerapan di domain word embedding yang berbeda secara fundamental dari multi-task vision — karena hyperparameter di sini bersifat struktural (ukuran konteks, negatif sampling, regularisasi) bukan task weight, dan (3) derivasi eksplisit dari gradient hyperparameter untuk model W2VPred yang tidak pernah dilakukan sebelumnya.

---

### G8. Apa yang membedakan skripsi Anda dari Kendall et al.?

Perbedaan mendasar ada tiga. Pertama, domain masalah: Kendall et al. bekerja pada multi-task learning di computer vision — setiap task memiliki loss function sendiri dan yang diestimasi adalah weighting antar task loss tersebut. Skripsi ini bekerja pada multi-domain word embedding — yang diestimasi bukan bobot antar task melainkan hyperparameter struktural model itu sendiri (ukuran konteks, jumlah negatif sampling, regularization strength) yang memengaruhi kualitas representasi embedding secara global.

Kedua, interpretasi: Dalam Kendall, setiap parameter variance σ_i merepresentasikan ketidakpastian aleotorik task ke-i. Dalam skripsi ini, hyperparameter λ memiliki interpretasi yang berbeda-beda: ukuran konteks memengaruhi rentang dependensi temporal antar kata, jumlah negatif sampling memengaruhi rasio signal-to-noise dalam estimasi gradien, dan regularisasi mengontrol kompleksitas model. Oleh karena itu, pemilihan prior untuk masing-masing hyperparameter harus mempertimbangkan interpretasi dan range fisisnya, bukan sekadar uniform improper.

Ketiga, kontribusi teoretis: Skripsi ini tidak hanya menerapkan JMAP tetapi juga menurunkan secara eksplisit formulasi gradient untuk setiap hyperparameter dalam konteks W2VPred, memvalidasi konvergensi empiris, dan membandingkan secara sistematis dengan grid search dalam berbagai skenario. Kendall et al. tidak melakukan analisis komparatif semacam itu karena fokus mereka adalah pada multi-task weighting, bukan pada optimasi hyperparameter model secara umum.

---

### G9. Apa originalitas skripsi ini?

Originalitas skripsi ini terletak pada konsep **W2VPred-MAP**: pengintegrasian estimasi hyperparameter ke dalam proses training Word2Vec Prediction melalui kerangka Joint Maximum a Posteriori. Ini bukan sekadar penerapan teknik Bayesian yang sudah ada — karena sebelumnya belum ada yang merumuskan optimasi hyperparameter word embedding secara simultan dalam kerangka probabilistik yang koheren. Grid search, random search, Bayesian optimization dengan Gaussian Process — semuanya memperlakukan hyperparameter sebagai variabel yang dioptimasi secara terpisah dari parameter model. W2VPred-MAP menghilangkan pemisahan artifisial ini.

Originalitas kedua adalah derivasi analitik gradient hyperparameter untuk model W2VPred. Kami menurunkan secara eksplisit bagaimana perubahan pada ukuran konteks, jumlah negatif sampling, atau regularization coefficient memengaruhi fungsi objektif, dan bagaimana informasi gradien ini dapat digunakan untuk optimasi bersama. Derivasi ini spesifik untuk arsitektur W2VPred dan memerlukan pemahaman mendalam tentang struktur model serta sifat-sifat turunannya.

Originalitas ketiga adalah demonstrasi bahwa Kendall et al. (2018) adalah kasus khusus dari JMAP dengan prior improper atas hyperparameter. Hubungan ini belum pernah diidentifikasi secara eksplisit dalam literatur dan memberikan perspektif baru tentang bagaimana berbagai pendekatan "learned loss weighting" dalam multi-task learning sebenarnya bersatu dalam kerangka Bayesian yang lebih umum.

---

### G10. Apakah kontribusi Anda hanya bersifat teknis atau juga teoretis?

Kontribusi kami bersifat ganda — teknis dan teoretis — dan keduanya saling melengkapi. Secara teknis, kami mengimplementasikan JMAP untuk W2VPred, menurunkan gradient untuk setiap hyperparameter, dan memvalidasi performanya melalui eksperimen sistematis pada beberapa dataset. Implementasi ini sendiri merupakan kontribusi yang signifikan karena menyediakan tool yang memungkinkan peneliti lain untuk mengestimasi word embedding tanpa melalui proses grid search yang mahal. Kode dan konfigurasi eksperimen kami dirancang untuk reprodusibilitas dan ekstensibilitas.

Secara teoretis, kontribusi kami mencakup: (1) reformulasi W2VPred sebagai Bayesian hierarchical model, yang memberikan landasan probabilistik yang kokoh untuk analisis lebih lanjut; (2) identifikasi hubungan antara JMAP dan Kendall et al. (2018), yang menyatukan dua literatur yang sebelumnya terpisah; (3) analisis konvergensi dan konsistensi estimator JMAP untuk model word embedding. Tampa landasan teoretis ini, kontribusi teknis hanya akan menjadi sekadar "trikyang bekerja" tanpa pemahaman mengapa ia bekerja dan dalam kondisi apa ia gagal. Oleh karena itu, kami percaya bahwa kontrolusi yang paling bertahan lama dari skripsi ini justru pada aspek teoretisnya.

---

### G11. Bagaimana Anda mensintesis temuan Anda dengan literatur yang ada?

Kami melakukan sintesis dengan memetakan posisi skripsi ini dalam tiga garis literatur. Pertama, literatur tentang optimasi hyperparameter — dari grid search, random search, hingga Bayesian optimization. Kami menunjukkan bahwa JMAP menawarkan perspektif baru yang mengintegrasikan optimasi hyperparameter ke dalam estimasi parameter, berbeda dari pendekatan sequential yang dominan. Kedua, literatur tentang word embedding probabilistic — termasuk karya-karya seperti Word2Vec, GloVe, dan varian Bayesian-nya. Kami memposisikan W2VPred-MAP sebagai jembatan antara word embedding deterministik dan pemodelan Bayesian penuh, di mana kita mendapatkan keuntungan dari kedua pendekatan: efisiensi komputasi dari point estimation dan koherensi probabilistik dari Bayesian modeling.

Ketiga, literatur tentang Joint MAP dan multi-task learning. Kami menghubungkan pendekatan kami dengan Kendall et al. (2018) dan menunjukkan bahwa apa yang mereka lakukan untuk task weighting sebenarnya merupakan kasus khusus dari kerangka yang lebih umum. Sintesis ini penting karena memungkinkan transfer pengetahuan antar domain: insight dari multi-task learning dapat diterapkan pada optimasi hyperparameter word embedding, dan sebaliknya, formulasi Bayesian yang lebih kaya dari skripsi ini dapat memperkaya pemahaman tentang multi-task learning. Dengan demikian, skripsi ini tidak hanya berkontribusi pada satu bidang tetapi juga menjembatani beberapa bidang yang sebelumnya berkembang secara terpisah.

---

### G12. Apa keterbatasan pendekatan Anda dan bagaimana cara mengatasinya?

Keterbatasan pertama adalah asumsi diferensiabilitas. JMAP memerlukan fungsi objektif yang diferensiabel terhadap hyperparameter agar optimasi gradient-based dapat dilakukan. Jika model memiliki hyperparameter diskret (misalnya, arsitektur jaringan) atau fungsi loss yang non-diferensiabel, JMAP dalam bentuk saat ini tidak dapat langsung diterapkan. Untuk mengatasinya, kita dapat menggunakan teknik seperti continuous relaxation (misalnya, Gumbel-Softmax) atau gradient approximation (misalnya, finite difference atau REINFORCE), meskipun hal ini akan meningkatkan kompleksitas dan biaya komputasi.

Keterbatasan kedua adalah sensitivitas terhadap pilihan prior. JMAP memerlukan prior atas hyperparameter, dan hasil estimasi dapat bervariasi tergantung pada prior yang dipilih. Dalam eksperimen kami, kami menggunakan prior yang relatif non-informatif untuk meminimalkan bias, tetapi dalam praktiknya prior yang terlalu lemah dapat menyebabkan identifiability issues. Solusinya adalah dengan melakukan analisis sensitivitas — menguji beberapa prior yang berbeda dan memeriksa stabilitas hasil — atau menggunakan pendekatan hierarchical Bayesian penuh dengan hyperprior yang memungkinkan data menentukan tingkat informativitas prior.

Keterbatasan ketiga adalah JMAP memberikan point estimate (mode dari posterior bersama), bukan full posterior distribution. Ini berarti kita kehilangan informasi tentang ketidakpastian estimasi hyperparameter. Untuk mengatasinya, kita dapat memperluas ke arah inference variasional penuh (misalnya, mean-field variational Bayes atau stochastic gradient Langevin dynamics) yang memberikan distribusi aproksimatif atas hyperparameter dan parameter secara simultan. Ini merupakan arah penelitian lanjutan yang paling menjanjikan.

---

## KATEGORI H: PERTANYAAN UMUM SIDANG

---

### H1. Apa motivasi utama Anda mengangkat topik ini?

Motivasi utama berasal dari pengamatan bahwa meskipun word embedding telah menjadi komponen fundamental dalam berbagai aplikasi NLP, proses estimasinya masih didominasi oleh praktik yang secara statistika kurang rigorus. Grid search — yang merupakan standar de facto untuk pemilihan hyperparameter — pada dasarnya adalah prosedur trial-and-error tanpa jaminan optimalitas, yang menghabiskan sumber daya komputasi dalam jumlah besar. Saya melihat adanya kesenjangan (gap) antara kematangan teoretis word embedding sebagai model dan ketidakmatangan metodologi estimasinya. Ini mendorong saya untuk bertanya: dapatkah kita merumuskan proses estimasi ini secara lebih koheren dalam kerangka probabilistik?

Motivasi kedua adalah keyakinan bahwa kemajuan dalam machine learning tidak hanya datang dari arsitektur model yang lebih canggih, tetapi juga dari metodologi estimasi yang lebih baik. Banyak penelitian berfokus pada menciptakan model baru, sementara pertanyaan tentang bagaimana mengestimasi parameter model yang sudah ada secara optimal sering diabaikan. Skripsi ini adalah upaya untuk menyeimbangkan perhatian tersebut — memberikan perlakuan yang setara pada aspek estimasi sebagaimana pada aspek arsitektur. Saya termotivasi oleh gagasan bahwa kontribusi metodologis sering kali memiliki dampak yang lebih luas dan bertahan lebih lama dibandingkan kontribusi arsitektural.

---

### H2. Apa aplikasi praktis dari skripsi ini?

Aplikasi praktis yang paling langsung adalah efisiensi sumber daya dalam pengembangan sistem NLP. Grid search untuk word embedding biasanya memerlukan puluhan hingga ratusan kali training, yang pada dataset besar dapat memakan waktu berhari-hari hingga berminggu-minggu dan membutuhkan kluster GPU yang mahal. JMAP mereduksi kebutuhan ini menjadi satu kali training, sehingga organisasi dengan sumber daya komputasi terbatas — seperti startup, institusi riset di negara berkembang, atau laboratorium universitas — dapat mengembangkan word embedding berkualitas tinggi tanpa investasi infrastruktur yang besar. Ini mendemokratisasi akses terhadap teknologi NLP canggih.

Aplikasi kedua terletak pada reproducibility dan otomatisasi. Dengan JMAP, pemilihan hyperparameter menjadi bagian dari proses training yang terdokumentasi secara otomatis, bukan keputusan ad hoc yang sering tidak tercatat dalam publikasi. Ini mengurangi masalah reproduksibilitas yang lazim dalam riset NLP, di mana hasil suatu model sering kali bergantung pada hyperparameter yang tidak dilaporkan secara eksplisit. Dalam konteks industri, JMAP memungkinkan pipeline training yang sepenuhnya otomatis — dari data mentah hingga embedding siap pakai — tanpa intervensi manual untuk tuning hyperparameter. Ini sangat berharga untuk deployment skala besar yang memerlukan pelatihan ulang model secara berkala.

---

### H3. Apa dampak sosial dari penelitian ini?

Dampak sosial yang paling signifikan adalah pengurangan hambatan ekonomis dan komputasional dalam pengembangan teknologi NLP. Seperti disebutkan sebelumnya, JMAP menekan biaya komputasi secara drastis. Ini berarti bahwa institusi pendidikan, UKM, dan organisasi nirlaba — yang mungkin tidak memiliki akses ke infrastruktur komputasi mahal — dapat tetap berpartisipasi dalam pengembangan aplikasi NLP. Dalam konteks Indonesia, di mana kesenjangan sumber daya riset masih cukup lebar dibandingkan negara maju, pendekatan seperti JMAP dapat membantu menyeimbangkan panggung dan memungkinkan riset NLP berkualitas tinggi dilakukan dengan sumber daya yang terbatas.

Di sisi lain, penelitian ini juga relevan dengan isu keberlanjutan (sustainability). Grid search yang boros energi bukan hanya masalah biaya tetapi juga masalah lingkungan. Setiap kali kita melatih ulang model dengan konfigurasi hyperparameter yang berbeda, kita mengonsumsi listrik dan menghasilkan jejak karbon. JMAP yang hanya memerlukan satu kali training secara langsung mengurangi konsumsi energi. Meskipun dampak dari satu penelitian mungkin kecil, jika diadopsi secara luas dalam komunitas NLP — mengingat populernya penggunaan word embedding — akumulasi penghematan energinya bisa menjadi signifikan. Ini adalah bentuk tanggung jawab akademis terhadap krisis iklim yang kita hadapi.

---

### H4. Apakah penelitian ini sudah dipublikasikan?

Saat ini penelitian ini masih dalam tahap penyusunan manuskrip untuk diajukan ke konferensi atau jurnal ilmiah. Target publikasi utama kami adalah *Conference on Empirical Methods in Natural Language Processing* (EMNLP) atau jurnal *Computational Linguistics* — keduanya merupakan venue bereputasi di bidang NLP yang sangat menghargai kontribusi metodologis baru serta reprodusibilitas. Kami juga mempertimbangkan *Neural Information Processing Systems* (NeurIPS) mengingat relevansi Bayesian inference dan optimization dalam topik ini. Proses publikasi memerlukan waktu beberapa bulan untuk review dan revisi, dan kami berkomitmen untuk menyelesaikannya setelah sidang.

Sebagai bagian dari komitmen terhadap open science, kami juga berencana untuk merilis kode implementasi JMAP untuk W2VPred secara terbuka di repositori publik. Ini sejalan dengan semangat reprodusibilitas dan transparansi yang kami junjung sepanjang penelitian. Dengan demikian, meskipun publikasi formal masih dalam proses, kontribusi penelitian ini sudah dapat diakses dan digunakan oleh komunitas riset yang lebih luas melalui kode sumber dan dokumentasi yang kami siapkan.

---

### H5. Jika Anda memiliki sumber daya tak terbatas, eksperimen apa yang akan Anda lakukan?

Jika saya memiliki sumber daya komputasi, waktu, dan biaya yang tidak terbatas, eksperimen pertama yang akan saya lakukan adalah inference Bayesian penuh — bukan sekadar MAP — menggunakan Markov Chain Monte Carlo (MCMC) atau Stochastic Gradient Langevin Dynamics (SGLD) pada skala yang sangat besar. Saat ini kami hanya mengestimasi mode dari posterior bersama; full posterior sampling akan memberikan distribusi lengkap atas hyperparameter dan parameter embedding, memungkinkan kuantifikasi ketidakpastian yang lebih akurat. Saya ingin melihat distribusi posterior dari ukuran konteks, jumlah negatif sampling, dan regularisasi — apakah unimodal atau multimodal? Apakah ada trade-off yang jelas antar hyperparameter? Informasi ini sangat berharga untuk memahami struktur model secara lebih dalam.

Eksperimen kedua adalah generalisasi ke arsitektur word embedding yang lebih modern, seperti BERT, GPT, atau model transformer berbasis embedding lainnya. JMAP untuk model transformer akan jauh lebih kompleks — mengingat jumlah hyperparameter yang jauh lebih besar (learning rate schedule, warmup steps, dropout rates, weight decay, dll.) dan ketidaklinieran yang lebih ekstrem. Namun, jika berhasil, dampaknya akan jauh lebih luas karena model transformer mendominasi NLP modern. Saya ingin menguji apakah prinsip estimasi hyperparameter bersama ini tetap efektif pada model raksasa dengan miliaran parameter, dan bagaimana ia berinteraksi dengan teknik seperti LoRA atau adaptor. Eksperimen ketiga adalah aplikasi lintas bahasa — apakah JMAP memberikan manfaat yang lebih besar untuk bahasa dengan sumber daya rendah (seperti bahasa daerah di Indonesia) di mana grid search tidak praktis karena keterbatasan data dan komputasi? Ini adalah arah yang paling saya minati secara personal.
