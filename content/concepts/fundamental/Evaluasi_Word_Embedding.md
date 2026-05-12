# Konsep Fundamental: Evaluasi Kualitas *Word Embedding*

Setelah model *word embedding* dilatih, sangat penting untuk mengukur seberapa baik representasi vektor tersebut menangkap kedekatan makna (semantik) dan tata bahasa (sintaksis). Evaluasi ini umumnya dibagi menjadi dua paradigma utama: **Intrinsik** dan **Ekstrinsik**.

## 1. Evaluasi Intrinsik

Evaluasi intrinsik menilai kualitas ruang vektor secara langsung dan independen, tanpa mengintegrasikannya ke dalam aplikasi atau model lain. Tujuannya adalah melihat apakah vektor tersebut sesuai dengan naluri linguistik manusia.

### A. Uji Kemiripan Kata (*Word Similarity*)
*   **Konsep**: Jika dua kata memiliki makna yang mirip (contoh: "uang" dan "bank"), vektor mereka di dalam ruang *embedding* harus berdekatan (memiliki skor *cosine similarity* yang tinggi).
*   **Metode**: Membandingkan skor *cosine similarity* dari model dengan skor anotasi manusia menggunakan korelasi *Spearman*.
*   **Dataset Standar**: WordSim-353, MEN.

### B. Uji Analogi Kata (*Word Analogy*)
*   **Konsep**: Menguji apakah model menangkap pola relasional linier. Diperkenalkan oleh Mikolov dkk. (2013).
*   **Format Tugas**: "A terhadap B sama seperti C terhadap X". Model harus menebak X.
*   **Operasi Aljabar**: $v(X) \approx v(B) - v(A) + v(C)$
*   **Contoh Klasik**: $v(\text{Ratu}) \approx v(\text{Raja}) - v(\text{Pria}) + v(\text{Wanita})$.

## 2. Evaluasi Ekstrinsik

Skor intrinsik yang tinggi tidak selalu menjamin bahwa *embedding* tersebut akan bermanfaat untuk memecahkan masalah di dunia nyata. **Evaluasi ekstrinsik** menguji vektor tersebut dengan menggunakannya sebagai input (*feature representation*) untuk tugas NLP hilir (*downstream task*).

*   **Contoh Tugas**: Klasifikasi sentimen, pengenalan entitas bernama (NER), terjemahan mesin.
*   **Pengklasifikasi Standar**: Seringkali menggunakan arsitektur *Convolutional Neural Network* (CNN) satu dimensi, seperti yang diusulkan oleh Yoon Kim (2014).
*   **Skenario *Frozen Mode***: Untuk benar-benar menguji kualitas *embedding* mentah, bobot matriks *embedding* dibekukan (*frozen*) selama pelatihan CNN. Dengan demikian, performa akurasi klasifikasi sepenuhnya bergantung pada seberapa baik fitur semantik telah direpresentasikan oleh *embedding* tersebut.

Untuk model *domain-specific* seperti W2VPred, evaluasi ekstrinsik (seperti klasifikasi sentimen dokumen dalam domain yang sama) menjadi sangat penting untuk membuktikan bahwa model tidak hanya menangkap makna umum, tetapi juga makna khusus yang relevan dengan domain pengguna.
