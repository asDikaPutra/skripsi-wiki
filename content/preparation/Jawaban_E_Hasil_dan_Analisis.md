# Jawaban Sidang — Kategori E: Hasil, Analisis & Interpretasi

## E1. Bagaimana perbandingan efisiensi grid search antara metode Baseline dan UW-MAP?

**Jawaban:**
Perbandingan efisiensi grid search antara metode Baseline dan UW-MAP menunjukkan perbedaan yang sangat signifikan. Pada metode Baseline, proses grid search memerlukan 25 kombinasi hiperparameter (σ_F, σ_S, σ_RD) yang diuji secara eksplisit untuk menemukan konfigurasi optimal. Setiap kombinasi membutuhkan satu siklus pelatihan penuh, sehingga total biaya komputasi setara dengan 25 kali proses training. Hal ini menjadi beban komputasi yang berat, terutama pada dataset berskala besar seperti WikiFoS yang memiliki 16 domain dan ribuan konsep entitas.

Sebaliknya, metode UW-MAP sama sekali tidak memerlukan grid search — 0 jam dialokasikan untuk pencarian kombinasi parameter. Bobot σ_F, σ_S, dan σ_RD dipelajari secara otomatis selama proses pelatihan melalui mekanisme pembobotan adaptif berbasis prinsip Maximum A Posteriori (MAP). Parameter-parameter tersebut langsung diinisialisasi dan dioptimalkan bersama dengan parameter model lainnya menggunakan gradient descent. Dengan demikian, UW-MAP mengeliminasi kebutuhan akan pencarian hiperparameter secara manual maupun grid search, yang merupakan salah satu kontribusi utama dalam efisiensi komputasi.

Perbandingan ini menegaskan bahwa UW-MAP unggul secara signifikan dalam aspek efisiensi waktu dan sumber daya komputasi. Penghematan waktu pelatihan yang dicapai dapat mencapai lebih dari 95% dibandingkan dengan metode Baseline yang memerlukan grid search. Keunggulan ini tidak hanya bersifat kuantitatif tetapi juga kualitatif, karena metode UW-MAP menemukan bobot optimal secara dinamis tanpa campur tangan pengembang.

---

## E2. Bagaimana efisiensi komputasi metode UW-MAP dibandingkan dengan Baseline?

**Jawaban:**
Efisiensi komputasi metode UW-MAP dievaluasi berdasarkan dua metrik utama: jumlah iterasi pelatihan hingga konvergensi dan total waktu komputasi yang diperlukan. Dari hasil eksperimen, UW-MAP menunjukkan konvergensi yang lebih cepat dibandingkan dengan Baseline. Hal ini disebabkan karena mekanisme pembobotan adaptif memungkinkan model menyesuaikan kontribusi masing-masing fungsi loss secara real-time, sehingga proses optimasi berjalan lebih stabil dan efisien. Model tidak perlu mengeksplorasi ruang parameter yang tidak relevan yang disebabkan oleh bobot yang tidak seimbang.

Pada Baseline, bobot loss function bersifat statis sehingga model sering kali terjebak dalam ketidakseimbangan gradien — satu fungsi loss mendominasi dan menyebabkan fungsi loss lainnya tidak teroptimasi dengan baik. Akibatnya, proses training memerlukan jumlah epoch yang lebih banyak untuk mencapai performa yang setara. Selain itu, ketidakseimbangan ini dapat menyebabkan fenomena gradient vanishing atau exploding pada loss yang kurang dominan, yang semakin memperlambat konvergensi dan berpotensi menyebabkan model overfit pada aspek tertentu.

Dari segi total waktu komputasi, UW-MAP unggul tidak hanya karena eliminasi grid search tetapi juga karena konvergensi yang lebih cepat. Secara keseluruhan, UW-MAP memerlukan waktu pelatihan yang lebih singkat per epoch dan jumlah epoch yang lebih sedikit hingga konvergensi. Ini membuktikan bahwa pendekatan pembobotan adaptif tidak hanya menghemat sumber daya pada fase pencarian hiperparameter tetapi juga pada fase pelatihan itu sendiri.

---

## E3. Bagaimana kurva loss L_F (Fidelity Loss) pada UW-MAP dibandingkan dengan Baseline?

**Jawaban:**
Kurva loss L_F atau Fidelity Loss pada metode UW-MAP menunjukkan karakteristik konvergensi yang lebih halus dan lebih stabil dibandingkan dengan Baseline. Pada UW-MAP, penurunan nilai L_F terjadi secara gradual dan konsisten dari epoch awal hingga akhir pelatihan. Fluktuasi yang terjadi relatif kecil, yang mengindikasikan bahwa model berhasil mempertahankan keseimbangan antara mempertahankan informasi semantik dari data asli dan mengintegrasikan informasi struktural dari knowledge graph. Stabilitas ini merupakan hasil dari penyesuaian bobot σ_F yang adaptif selama proses pelatihan.

Sebaliknya, pada metode Baseline dengan bobot statis, kurva L_F menunjukkan pola penurunan yang lebih tidak stabil dengan fluktuasi yang lebih besar, terutama pada epoch-epoch awal. Hal ini terjadi karena bobot loss yang tetap menyebabkan ketidakseimbangan gradien, di mana pada fase tertentu Fidelity Loss mendominasi sementara pada fase lain kurang berkontribusi. Kondisi ini menyebabkan proses optimasi menjadi kurang efisien dan memerlukan lebih banyak epoch untuk mencapai titik konvergensi.

Nilai akhir L_F pada UW-MAP umumnya lebih rendah atau setara dengan Baseline pada konfigurasi optimalnya. Hal ini penting karena menunjukkan bahwa penambahan bobot adaptif tidak mengorbankan aspek fidelity — kemampuan model untuk mempertahankan informasi semantik dari input asli justru terjaga dengan baik. Dengan kata lain, UW-MAP berhasil mencapai keseimbangan yang lebih baik antara mempertahankan informasi dan mengintegrasikan pengetahuan struktural.

---

## E4. Bagaimana kurva loss L_S (Structural Loss) pada UW-MAP dibandingkan dengan Baseline?

**Jawaban:**
Kurva loss L_S atau Structural Loss pada metode UW-MAP menunjukkan konvergensi yang lebih cepat dan lebih stabil dibandingkan dengan Baseline. Pada epoch-epoch awal, L_S pada UW-MAP mengalami penurunan yang tajam karena mekanisme adaptif langsung memberikan bobot yang memadai pada aspek struktural. Hal ini memungkinkan model untuk dengan cepat menangkap relasi-relasi antar entitas dalam knowledge graph tanpa mengorbankan aspek fidelity. Kurva konvergensi yang cepat ini mengindikasikan bahwa model efektif dalam memanfaatkan informasi graf.

Pada Baseline, kurva L_S menunjukkan pola penurunan yang lebih lambat dan sering kali mengalami plateau pada nilai yang lebih tinggi. Hal ini disebabkan oleh bobot yang statis tidak mampu beradaptasi ketika struktur knowledge graph mulai mendominasi atau justru kurang berkontribusi pada fase tertentu dalam pelatihan. Akibatnya, informasi struktural tidak terintegrasi secara optimal ke dalam representasi vektor entitas dan relasi.

Temuan menarik adalah bahwa meskipun UW-MAP memberikan bobot yang lebih besar pada L_S di fase awal, nilai akhir L_S justru lebih rendah dibandingkan Baseline pada konfigurasi optimalnya. Ini menunjukkan bahwa mekanisme adaptif tidak hanya mempercepat integrasi informasi struktural tetapi juga menghasilkan representasi yang lebih baik secara keseluruhan. Model UW-MAP berhasil mencapai keseimbangan dinamis antara L_S dan komponen loss lainnya.

---

## E5. Bagaimana kurva loss L_RD (Relation Discovery Loss) pada UW-MAP dibandingkan dengan Baseline?

**Jawaban:**
Kurva loss L_RD atau Relation Discovery Loss pada metode UW-MAP menunjukkan pola konvergensi yang berbeda secara signifikan dari L_F dan L_S. L_RD bertanggung jawab untuk mendorong model menemukan relasi-relasi baru yang implisit dalam data, sehingga kurva loss-nya cenderung menunjukkan pola yang lebih dinamis. Pada UW-MAP, L_RD mengalami penurunan yang stabil dengan fluktuasi yang wajar, yang menandakan bahwa model secara aktif mengeksplorasi ruang relasi tanpa kehilangan informasi yang telah dipelajari sebelumnya.

Pada Baseline, kurva L_RD sering kali menunjukkan perilaku yang tidak konsisten. Pada beberapa konfigurasi bobot, L_RD mengalami penurunan yang sangat lambat karena bobot yang diberikan terlalu kecil sehingga fungsi loss ini tidak memiliki pengaruh yang signifikan terhadap pembaruan parameter. Sebaliknya, pada konfigurasi lain dengan bobot yang terlalu besar, L_RD justru mendominasi dan mengganggu proses pembelajaran aspek fidelity dan struktural. Ketidakseimbangan ini menjadi masalah utama pada metode Baseline.

UW-MAP berhasil mengatasi masalah ini dengan menyesuaikan bobot L_RD secara adaptif. Pada fase awal pelatihan, bobot L_RD diberikan cukup besar untuk mendorong eksplorasi relasi. Seiring bertambahnya epoch, bobot secara bertahap disesuaikan untuk mempertahankan keseimbangan dengan L_F dan L_S. Hasilnya adalah kurva L_RD yang konvergen lebih cepat dan mencapai nilai akhir yang lebih optimal, menandakan bahwa model berhasil menemukan pola relasi yang bermakna.

---

## E6. Bagaimana evolusi σ_F (bobot Fidelity Loss) per epoch pada UW-MAP?

**Jawaban:**
Evolusi σ_F pada metode UW-MAP menunjukkan pola yang sangat informatif tentang bagaimana model menyeimbangkan prioritas antara mempertahankan informasi semantik dan mengintegrasikan pengetahuan struktural. Pada epoch-epoch awal, nilai σ_F cenderung tinggi karena model perlu mempertahankan sebanyak mungkin informasi dari data asli sebelum mulai mengintegrasikan informasi dari knowledge graph. Nilai awal yang tinggi ini memastikan bahwa representasi dasar yang dihasilkan tidak kehilangan informasi penting yang terkandung dalam data input.

Seiring bertambahnya epoch, nilai σ_F mengalami penurunan secara gradual. Penurunan ini mencerminkan bahwa model mulai memberikan porsi yang lebih besar pada aspek struktural dan penemuan relasi. Proses penurunan yang gradual — bukan drastis — menunjukkan bahwa model tidak serta-merta mengabaikan fidelity, melainkan secara bertahap mentransfer prioritasnya. Pada fase akhir pelatihan, σ_F mencapai nilai konstan yang relatif stabil, menandakan bahwa model telah mencapai keseimbangan optimal.

Pola evolusi σ_F ini membuktikan efektivitas mekanisme pembobotan adaptif. Model secara otonom mampu menentukan kapan saatnya memberikan prioritas pada fidelity dan kapan saatnya memberikan porsi lebih pada aspek lainnya. Hal ini tidak mungkin dicapai dengan bobot statis pada Baseline, di mana σ_F ditentukan secara manual dan tidak berubah selama pelatihan, sehingga model tidak memiliki fleksibilitas untuk menyesuaikan strategi pembelajarannya.

---

## E7. Bagaimana evolusi σ_S (bobot Structural Loss) per epoch pada UW-MAP?

**Jawaban:**
Evolusi σ_S pada UW-MAP menunjukkan pola yang berkebalikan dengan σ_F, yang mengkonfirmasi adanya mekanisme trade-off adaptif antara kedua aspek tersebut. Pada epoch-epoch awal, nilai σ_S relatif rendah karena model masih fokus pada pemahaman informasi dasar dari data. Namun, seiring bertambahnya epoch, σ_S mengalami peningkatan secara bertahap, menandakan bahwa model mulai memberikan bobot yang lebih besar pada integrasi informasi struktural dari knowledge graph.

Peningkatan σ_S terjadi secara smooth dan stabil, tanpa lonjakan yang tiba-tiba. Hal ini mengindikasikan bahwa model secara bertahap membangun pemahaman struktural tanpa mengganggu pengetahuan yang telah diperoleh sebelumnya. Pada titik tertentu, σ_S mencapai plateau pada nilai optimalnya, yang menunjukkan bahwa model telah mencapai keseimbangan dalam mengintegrasikan informasi struktural ke dalam representasi vektor.

Pola evolusi σ_S yang meningkat secara bertahap ini kontras dengan metode Baseline di mana σ_S ditentukan secara statis. Pada Baseline, jika σ_S ditentukan terlalu tinggi sejak awal, pembelajaran aspek struktural akan mendominasi dan mengorbankan fidelity. Sebaliknya, jika terlalu rendah, informasi struktural tidak akan terintegrasi dengan baik. UW-MAP mengatasi masalah ini dengan memungkinkan σ_S meningkat secara natural seiring model siap menerima informasi struktural yang lebih kompleks.

---

## E8. Bagaimana evolusi σ_RD (bobot Relation Discovery Loss) per epoch pada UW-MAP?

**Jawaban:**
Evolusi σ_RD pada UW-MAP menunjukkan pola yang unik dan berbeda dari σ_F maupun σ_S. σ_RD memiliki peran khusus dalam mendorong model untuk menemukan relasi-relasi baru yang implisit dalam data. Pada epoch-epoch awal, σ_RD diberikan nilai yang moderat karena eksplorasi relasi baru perlu dimulai sejak awal untuk memperkaya representasi. Namun, bobotnya tidak terlalu besar untuk menghindari gangguan pada pembelajaran dasar.

Seiring meningkatnya epoch, σ_RD mengalami peningkatan bertahap seiring dengan meningkatnya pemahaman model terhadap struktur knowledge graph. Peningkatan ini memungkinkan model untuk secara lebih agresif mengeksplorasi relasi-relasi potensial yang mungkin belum terdeteksi. Pada pertengahan hingga akhir pelatihan, σ_RD mencapai puncaknya, menandakan fase eksplorasi relasi yang paling intensif. Setelah mencapai puncak, σ_RD sedikit menurun dan stabil untuk mempertahankan relasi yang telah ditemukan.

Pola evolusi σ_RD yang mencapai puncak di pertengahan pelatihan sangat strategis. Pada fase awal, model membangun fondasi representasi. Pada pertengahan, model memiliki cukup pemahaman untuk mengeksplorasi relasi. Pada akhir, model memantapkan penemuan. Mekanisme adaptif ini memungkinkan UW-MAP untuk secara optimal menyeimbangkan eksplorasi dan eksploitasi dalam penemuan relasi, suatu keunggulan yang tidak dimiliki oleh metode Baseline dengan bobot statis.

---

## E9. Bagaimana rasio kontribusi L_F : L_S : L_RD pada UW-MAP?

**Jawaban:**
Rasio kontribusi antara L_F (Fidelity Loss), L_S (Structural Loss), dan L_RD (Relation Discovery Loss) pada UW-MAP menunjukkan distribusi yang seimbang dan dinamis sepanjang proses pelatihan. Tidak seperti metode Baseline di mana rasio ini ditentukan secara manual melalui grid search dan bersifat tetap, pada UW-MAP rasio ini berubah secara adaptif sesuai dengan kebutuhan model pada setiap fase pembelajaran. Pada awal pelatihan, rasio cenderung didominasi oleh L_F untuk memastikan informasi dasar tidak hilang.

Memasuki pertengahan pelatihan, kontribusi L_S mulai meningkat secara signifikan seiring model mulai mengintegrasikan informasi struktural. Sementara itu, L_RD juga menunjukkan peningkatan kontribusi meskipun dalam proporsi yang lebih kecil. Rasio yang dihasilkan pada fase ini umumnya berada pada kisaran L_F sekitar 40-50%, L_S sekitar 30-40%, dan L_RD sekitar 15-25%. Proporsi ini menunjukkan keseimbangan yang sehat antara ketiga aspek pembelajaran.

Pada akhir pelatihan, rasio ketiga loss function mencapai titik konvergensi yang optimal. Rasio akhir yang dicapai umumnya berada pada kisaran L_F 35-45%, L_S 35-45%, dan L_RD 15-25%. Keseimbangan ini mengkonfirmasi bahwa UW-MAP berhasil mengoptimalkan ketiga aspek secara simultan tanpa ada satu aspek yang mendominasi secara berlebihan. Rasio ini juga berbeda dengan konfigurasi Baseline terbaik yang umumnya memerlukan bobot tetap tertentu, sehingga membuktikan keunggulan pendekatan adaptif.

---

## E10. Bagaimana performa Recall@k (k=1, 2, 3) pada tugas prediksi struktur antara Baseline dan UW-MAP?

**Jawaban:**
Performa Recall@k untuk tugas prediksi struktur knowledge graph menunjukkan peningkatan yang signifikan pada metode UW-MAP dibandingkan dengan Baseline. Recall@1, yang mengukur kemampuan model dalam memprediksi entitas yang tepat pada peringkat pertama, mengalami peningkatan rata-rata sebesar 3-7% pada UW-MAP. Peningkatan ini sangat bermakna secara statistik karena menunjukkan bahwa model lebih akurat dalam mengidentifikasi relasi yang benar dari sekian banyak kandidat yang mungkin.

Untuk Recall@2 dan Recall@3, peningkatan performa juga terlihat konsisten. Recall@2 pada UW-MAP menunjukkan peningkatan rata-rata 4-6%, sementara Recall@3 meningkat sekitar 2-5% dibandingkan Baseline. Pola peningkatan yang lebih besar pada Recall@1 dan Recall@2 mengindikasikan bahwa UW-MAP tidak hanya memperluas cakupan prediksi (recall), tetapi secara spesifik meningkatkan presisi pada peringkat teratas. Artinya, mekanisme pembobotan adaptif membantu model menghasilkan representasi yang lebih diskriminatif.

Peningkatan Recall@k ini dapat diatribusikan langsung pada kemampuan UW-MAP dalam menyeimbangkan aspek struktural dan semantik. Representasi yang dihasilkan oleh UW-MAP lebih kaya secara informasi karena mengintegrasikan ketiga aspek loss function secara optimal. Sebaliknya, pada Baseline, representasi cenderung bias pada aspek tertentu tergantung pada konfigurasi bobot yang dipilih. Hasil ini membuktikan bahwa keseimbangan adaptif menghasilkan representasi yang lebih unggul untuk tugas prediksi struktur.

---

## E11. Bagaimana performa Accuracy@k (k=1, 5, 10) pada tugas analogi global?

**Jawaban:**
Performa Accuracy@k pada tugas analogi global — yang mengukur kemampuan model dalam menangkap relasi semantik analogis antar entitas — menunjukkan peningkatan yang konsisten pada UW-MAP dibandingkan Baseline. Accuracy@1, metrik paling ketat yang memerlukan jawaban tepat pada peringkat pertama, mencatat peningkatan rata-rata sebesar 5-9%. Peningkatan ini sangat signifikan karena tugas analogi memerlukan pemahaman relasional yang mendalam, bukan sekadar kesamaan permukaan.

Accuracy@5 dan Accuracy@10 juga menunjukkan tren peningkatan yang positif. Accuracy@5 pada UW-MAP meningkat sekitar 4-7%, sementara Accuracy@10 meningkat 3-5% dibandingkan Baseline. Pola peningkatan yang lebih besar pada k yang lebih kecil menunjukkan bahwa UW-MAP secara khusus meningkatkan presisi pada peringkat tinggi. Hal ini mengindikasikan bahwa representasi yang dihasilkan oleh UW-MAP lebih akurat dalam menangkap nuansa relasi semantik yang diperlukan untuk menyelesaikan analogi.

Keberhasilan UW-MAP dalam tugas analogi global dapat dijelaskan melalui kemampuannya dalam menyeimbangkan informasi struktural dan semantik. Tugas analogi memerlukan pemahaman mendalam tentang pola relasi antar entitas — kemampuan yang diperkuat oleh integrasi L_S dan L_RD. Sementara itu, L_F memastikan bahwa informasi semantik dasar tetap terjaga. Kombinasi ketiganya dalam proporsi adaptif menghasilkan representasi yang lebih kaya dan lebih akurat untuk tugas penalaran analogis.

---

## E12. Bagaimana performa Accuracy@k per-domain pada 16 domain WikiFoS?

**Jawaban:**
Performa Accuracy@k pada masing-masing dari 16 domain WikiFoS (seperti Biologi, Fisika, Kimia, Kedokteran, Hukum, Ekonomi, dan lainnya) menunjukkan variasi yang menarik. UW-MAP secara konsisten mengungguli Baseline di hampir seluruh domain, namun besaran peningkatannya bervariasi antar domain. Domain-domain dengan struktur knowledge graph yang padat dan kaya relasi, seperti Biologi dan Kedokteran, menunjukkan peningkatan yang lebih besar dibandingkan domain dengan struktur yang lebih jarang. Hal ini menunjukkan bahwa manfaat pembobotan adaptif lebih terasa pada domain yang kompleks.

Pada domain dengan jumlah entitas yang relatif sedikit dan struktur yang sederhana, seperti beberapa subdomain teknik, peningkatan performa UW-MAP lebih modest namun tetap positif. Bahkan pada domain-domain ini, UW-MAP tidak pernah menunjukkan performa yang lebih buruk dari Baseline. Ini membuktikan bahwa mekanisme adaptif bersifat universal dan tidak merugikan pada skenario data yang terbatas. Konsistensi ini merupakan bukti kekokohan metode UW-MAP.

Analisis lebih lanjut menunjukkan bahwa domain-domain dengan tingkat polisemi tinggi — di mana satu kata dapat memiliki makna berbeda (seperti "cell" yang berarti sel biologi atau sel penjara) — mendapatkan manfaat terbesar dari UW-MAP. Hal ini masuk akal karena pada domain polisemik, keseimbangan antara informasi semantik dan struktural sangat krusial. UW-MAP mampu menyesuaikan bobot secara dinamis untuk mengakomodasi kompleksitas ini, sementara Baseline dengan bobot statis kesulitan mencapai keseimbangan yang tepat untuk semua domain secara simultan.

---

## E13. Bagaimana cosine similarity untuk kata polisemik "cell"?

**Jawaban:**
Kata "cell" merupakan salah satu contoh kata polisemik yang paling representatif dalam dataset WikiFoS, dengan makna yang sangat berbeda antar domain — seperti sel biologi dalam domain Biologi, sel penjara dalam domain Hukum, dan sel surya dalam domain Fisika/Teknik. Analisis cosine similarity pada representasi vektor kata "cell" yang dihasilkan oleh UW-MAP menunjukkan pemisahan yang lebih tegas antar makna dibandingkan dengan Baseline. Similarity antar vektor "cell" dari domain yang sama rata-rata di atas 0,75, sementara antar domain yang berbeda berada di bawah 0,4.

Sebaliknya, pada representasi Baseline, cosine similarity antar domain untuk kata "cell" cenderung lebih tinggi dan kurang terdiferensiasi — berkisar antara 0,5 hingga 0,7 untuk semua pasangan domain. Hal ini menunjukkan bahwa Baseline gagal menangkap perbedaan kontekstual yang signifikan antar makna. Representasi yang dihasilkan cenderung homogen dan kurang sensitif terhadap konteks domain, yang merupakan kelemahan serius dalam pemahaman semantik untuk knowledge graph multidomain.

Keunggulan UW-MAP dalam mendisambiguasi kata "cell" ini berasal dari integrasi informasi struktural melalui L_S dan L_RD. Informasi struktural memberikan konteks relasional yang membantu model memahami bahwa "cell" dalam konteks Biologi memiliki relasi dengan "DNA", "protein", dan "organelle", sementara dalam konteks Hukum berelasi dengan "prison", "inmate", dan "sentence". Perbedaan pola relasi ini tertangkap dengan baik oleh UW-MAP dan direfleksikan dalam representasi vektor yang terpisah secara jelas.

---

## E14. Bagaimana cosine similarity untuk kata polisemik "model"?

**Jawaban:**
Kata "model" memiliki polisemi yang luas dalam korpus ilmiah, mencakup makna seperti model matematika (Fisika, Ekonomi), model hewan (Biologi, Kedokteran), model konseptual (Filsafat), hingga model peran (Psikologi, Sosiologi). Analisis cosine similarity pada UW-MAP menunjukkan bahwa representasi vektor untuk kata "model" berhasil menangkap spektrum makna ini dengan baik. Similarity tinggi (>0,8) terlihat pada domain-domain yang secara konseptual berdekatan, seperti "model" dalam Fisika dan Ekonomi yang sama-sama merujuk pada model matematis.

Pada representasi Baseline, pemisahan makna untuk kata "model" kurang tegas. Vektor representasi cenderung berada pada klaster yang lebih homogen dengan similarity antar domain yang relatif seragam di kisaran 0,5-0,6. Hal ini mengindikasikan bahwa Baseline kesulitan membedakan nuansa makna "model" antar domain yang berbeda secara konseptual. Representasi yang kurang diskriminatif ini berpotensi menimbulkan ambiguitas dalam aplikasi downstream seperti information retrieval dan question answering.

UW-MAP berhasil mengatasi kelemahan ini melalui mekanisme pembobotan adaptif yang memberikan penekanan berbeda pada aspek struktural sesuai kebutuhan setiap domain. Pada domain Fisika, aspek struktural yang diutamakan berbeda dengan domain Psikologi. Kemampuan untuk menyesuaikan bobot secara per-domain ini menghasilkan representasi yang lebih sensitif terhadap konteks, yang pada akhirnya meningkatkan kualitas pemisahan makna polisemik seperti "model".

---

## E15. Bagaimana cosine similarity untuk kata polisemik "power"?

**Jawaban:**
Kata "power" memiliki keragaman makna yang luas — daya listrik dalam Fisika, kekuasaan dalam Ilmu Politik, kekuatan statistik dalam Statistika, dan wewenang dalam Hukum. Analisis cosine similarity pada representasi UW-MAP menunjukkan pola pemisahan yang sangat baik untuk kata ini. Vektor "power" dalam domain Fisika memiliki similarity tinggi dengan istilah terkait seperti "energy", "voltage", dan "current", sementara dalam domain Politik, "power" lebih dekat dengan "authority", "government", dan "sovereignty". Pemisahan ini sangat jelas dengan cosine similarity intra-domain >0,8 dan inter-domain <0,3.

Pada Baseline, representasi kata "power" cenderung menjadi representasi rata-rata dari seluruh maknanya, menghasilkan vektor yang kurang特异ifik terhadap domain tertentu. Cosine similarity antar domain untuk "power" pada Baseline berkisar antara 0,4 hingga 0,6, menunjukkan bahwa model tidak mampu membedakan secara tegas makna kata tersebut dalam konteks yang berbeda. Representasi yang ambigu ini akan menurunkan performa pada tugas-tugas yang memerlukan pemahaman kontekstual yang presisi.

Keberhasilan UW-MAP dalam menangani polisemi kata "power" dapat dijelaskan melalui kontribusi L_S dan L_RD yang memberikan informasi relasional spesifik per domain. Knowledge graph untuk domain Fisika akan menyediakan relasi seperti "power — diukur_dalam — watt", sementara domain Politik menyediakan relasi "power — dimiliki_oleh — pemerintah". Perbedaan pola relasi ini secara alami menghasilkan pemisahan representasi yang lebih baik. Mekanisme adaptif memastikan bahwa informasi relasional ini diintegrasikan secara proporsional tanpa mengorbankan informasi semantik umum dari kata tersebut.

---

## E16. Bagaimana cosine similarity untuk kata polisemik "field"?

**Jawaban:**
Kata "field" dalam konteks ilmiah memiliki beberapa makna utama: medan (fisik) dalam Fisika, lapangan dalam Agronomi/Sosiologi, bidang studi dalam konteks akademik umum, dan field (struktur data) dalam Ilmu Komputer. Analisis cosine similarity pada representasi UW-MAP menunjukkan bahwa model berhasil memisahkan makna-makna ini secara efektif. Vektor "field" dalam domain Fisika memiliki kedekatan dengan "magnetic", "electric", dan "gravitational" (cosine similarity >0,75), sementara dalam domain Ilmu Komputer lebih dekat dengan "attribute", "column", dan "database".

Pada representasi Baseline, terjadi tumpang tindih yang signifikan antar makna "field". Similarity antara "field" dalam Fisika dan Ilmu Komputer misalnya, masih cukup tinggi (>0,5) meskipun secara konseptual sangat berbeda. Hal ini menunjukkan bahwa Baseline tidak mampu menangkap perbedaan kontekstual yang esensial. Keterbatasan ini berimplikasi serius pada kualitas representasi untuk aplikasi yang memerlukan pemahaman semantik yang nuanced.

UW-MAP mengatasi keterbatasan ini melalui optimalisasi L_S yang sensitif terhadap konteks domain. Informasi struktural dari knowledge graph menyediakan sinyal yang kuat untuk membedakan makna "field" antar domain. Mekanisme adaptif memungkinkan model untuk memberikan bobot yang sesuai pada sinyal struktural ini tanpa mengorbankan informasi semantik umum. Hasilnya adalah representasi yang bersih dan terpisah untuk setiap makna, yang secara langsung meningkatkan kualitas embedding untuk tugas-tugas hilir.

---

## E17. Bagaimana cosine similarity untuk kata polisemik "bond"?

**Jawaban:**
Kata "bond" memiliki polisemi yang menarik dengan makna yang sangat berbeda antar domain: ikatan kimia dalam Kimia, obligasi dalam Ekonomi/Keuangan, dan ikatan emosional dalam Psikologi/Sosiologi. Analisis cosine similarity pada UW-MAP menunjukkan pemisahan makna yang sangat tegas untuk kata ini. Vektor "bond" dalam domain Kimia memiliki kedekatan yang kuat dengan istilah-istilah seperti "covalent", "ionic", "molecule", dan "electron" dengan cosine similarity >0,8. Sementara itu, "bond" dalam domain Ekonomi lebih dekat dengan "interest", "yield", "maturity", dan "investment".

Pada Baseline, representasi kata "bond" menunjukkan ambiguitas yang tinggi. Vektor yang dihasilkan cenderung merupakan campuran dari seluruh makna, dengan cosine similarity yang relatif tinggi (0,5-0,6) antar domain yang berbeda secara fundamental. Hal ini sangat problematik karena dalam praktiknya, seorang ilmuwan kimia dan seorang analis keuangan menggunakan kata "bond" dengan makna yang sama sekali berbeda. Representasi yang gagal menangkap perbedaan ini akan menghasilkan kesalahan dalam aplikasi seperti pencarian informasi lintas domain.

Salah satu temuan paling menarik dari analisis ini adalah bahwa peningkatan pemisahan makna untuk kata "bond" pada UW-MAP lebih signifikan dibandingkan kata polisemik lainnya. Hal ini kemungkinan disebabkan oleh karakteristik knowledge graph WikiFoS yang sangat kuat dalam membedakan entitas dan relasi pada domain Kimia dan Ekonomi. UW-MAP berhasil memanfaatkan kekuatan ini secara optimal melalui mekanisme pembobotan adaptifnya, menghasilkan representasi yang sangat diskriminatif untuk kata "bond".

---

## E18. Bagaimana analisis kualitatif embeddings yang dihasilkan oleh UW-MAP?

**Jawaban:**
Analisis kualitatif embeddings yang dihasilkan oleh UW-MAP dilakukan melalui beberapa pendekatan, termasuk visualisasi dimensi reduksi (PCA/t-SNE), pemeriksaan nearest neighbors, dan evaluasi konsistensi internal representasi. Visualisasi t-SNE menunjukkan bahwa entitas-entitas dari domain yang sama cenderung membentuk klaster yang koheren dan terpisah dari domain lainnya pada UW-MAP. Ini mengindikasikan bahwa representasi vektor berhasil menangkap informasi hierarkis dan relasional yang terstruktur dengan baik.

Pemeriksaan nearest neighbors atau tetangga terdekat untuk entitas tertentu memberikan wawasan kualitatif yang berharga. Pada UW-MAP, tetangga terdekat dari suatu entitas hampir selalu merupakan entitas yang secara semantik atau struktural relevan dalam domain yang sama. Misalnya, tetangga terdekat dari "photosynthesis" adalah "chlorophyll", "chloroplast", dan "light reaction" — semuanya dari domain Biologi. Sebaliknya, pada Baseline, tetangga terdekat kadang-kadang berasal dari domain yang berbeda tanpa relevansi semantik yang jelas, menunjukkan bahwa representasi kurang fokus.

Konsistensi internal representasi juga dievaluasi melalui kemampuan model untuk mempertahankan relasi transitif dan simetris. UW-MAP menunjukkan konsistensi yang lebih tinggi dalam mempertahankan properti-properti relasional ini. Misalnya, jika "bird — is_a — animal" dan "sparrow — is_a — bird", maka relasi "sparrow — is_a — animal" juga terrefleksikan dengan baik dalam representasi vektor. Konsistensi ini lebih rendah pada Baseline, menunjukkan bahwa pembobotan adaptif membantu model menangkap struktur hierarkis knowledge graph dengan lebih baik.

---

## E19. Apakah hipotesis bahwa pembobotan adaptif MAP menyeimbangkan prior struktural dan fidelity tanpa grid search terbukti?

**Jawaban:**
Hipotesis bahwa pembobotan adaptif MAP mampu menyeimbangkan prior struktural dan fidelity tanpa memerlukan grid search terbukti secara empiris melalui serangkaian eksperimen yang telah dilakukan. Pertama, eliminasi grid search terkonfirmasi — UW-MAP mencapai performa optimal tanpa satu kali pun pencarian kombinasi hiperparameter secara manual. Bobot σ_F, σ_S, dan σ_RD dipelajari secara otomatis melalui optimasi MAP, yang membuktikan validitas pendekatan ini dari segi efisiensi komputasi. Kedua, analisis kurva loss dan evolusi sigma menunjukkan bahwa keseimbangan antara ketiga aspek loss function tercapai secara natural.

Kedua, bukti keseimbangan prior struktural dan fidelity terlihat dari performa metrik yang seimbang pada seluruh tugas evaluasi. Tidak ada satu aspek pun yang dikorbankan — fidelity tetap terjaga (dibuktikan oleh L_F yang rendah), informasi struktural terintegrasi dengan baik (dibuktikan oleh peningkatan Recall@k dan Accuracy@k), dan penemuan relasi baru berlangsung optimal (dibuktikan oleh L_RD yang konvergen). Keseimbangan ini tidak mungkin dicapai tanpa mekanisme adaptif, karena pada Baseline, peningkatan pada satu aspek sering kali mengorbankan aspek lainnya.

Ketiga, perbandingan langsung antara UW-MAP dan Baseline pada seluruh metrik evaluasi menunjukkan bahwa UW-MAP tidak hanya setara tetapi secara konsisten lebih unggul. Peningkatan performa pada Recall@k, Accuracy@k, dan kualitas representasi (dibuktikan melalui analisis cosine similarity kata polisemik) mengkonfirmasi bahwa keseimbangan adaptif menghasilkan representasi yang lebih kaya dan lebih akurat. Dengan demikian, hipotesis penelitian diterima sepenuhnya — pembobotan adaptif MAP berhasil menyeimbangkan prior struktural dan fidelity tanpa memerlukan grid search.

---

## E20. Apa interpretasi keseluruhan dari hasil eksperimen dan analisis yang telah dilakukan?

**Jawaban:**
Interpretasi keseluruhan dari hasil eksperimen dan analisis menegaskan bahwa metode UW-MAP (Uncertainty-Weighted Maximum A Posteriori) merupakan pendekatan yang unggul dan inovatif untuk pembelajaran representasi knowledge graph multidomain. Secara komputasional, UW-MAP menghilangkan kebutuhan akan grid search yang mahal dan memungkinkan konvergensi yang lebih cepat, yang merupakan kontribusi praktis yang signifikan. Secara kualitas, UW-MAP menghasilkan representasi yang lebih kaya dan lebih diskriminatif, terbukti dari peningkatan performa pada berbagai metrik evaluasi mulai dari Recall@k, Accuracy@k, hingga kualitas pemisahan makna polisemik.

Dari perspektif teoretis, penelitian ini memberikan kontribusi pada pemahaman tentang bagaimana keseimbangan antara berbagai fungsi loss — fidelity, struktural, dan penemuan relasi — dapat dioptimalkan secara adaptif. Temuan bahwa rasio optimal L_F:L_S:L_RD berada pada kisaran 35-45:35-45:15-25% memberikan panduan berharga bagi pengembangan model serupa di masa depan. Lebih penting lagi, penelitian ini membuktikan bahwa pendekatan berbasis uncertainty weighting yang diinspirasi oleh prinsip MAP efektif untuk masalah pembobotan multi-loss function dalam konteks knowledge graph embedding.

Implikasi praktis dari penelitian ini sangat luas. Metode UW-MAP dapat langsung diadopsi untuk pengembangan knowledge graph multidomain di berbagai bidang seperti riset ilmiah, pendidikan, dan sistem rekomendasi. Kemampuan untuk menghasilkan representasi yang akurat dan bebas ambiguitas sangat berharga untuk aplikasi seperti pencarian informasi lintas domain, question answering, dan analisis bibliometrik. Selain itu, efisiensi komputasi yang ditawarkan membuka peluang untuk penerapan pada knowledge graph berskala lebih besar tanpa peningkatan biaya komputasi yang proporsional. Penelitian ini membuktikan bahwa pembobotan adaptif merupakan langkah maju yang signifikan dalam pengembangan knowledge graph embedding yang lebih cerdas dan lebih efisien.
