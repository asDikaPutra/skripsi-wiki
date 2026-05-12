# W2VPred (Word2Vec with Structure Prediction)

W2VPred adalah sebuah metode dinamis untuk [[Word Embedding]] yang diusulkan oleh Lassner dkk. (2023) dalam jurnal *Domain-Specific Word Embeddings with Structure Prediction* guna menangani permasalahan pembelajaran representasi kata pada korpus yang terbagi ke dalam beberapa sub-korpus (misalnya domain ilmu atau periode waktu). Metode ini mengatasi keterbatasan metode tradisional yang membutuhkan tahapan *post-alignment* dengan cara mempelajari struktur kedekatan antar sub-korpus dan representasi *embedding* secara simultan.

## Pendekatan Teoritis dan Metode

Penelitian ini mengusulkan tiga varian metode untuk menangani dinamika kata lintas domain yang merupakan generalisasi dari *Dynamic Word2Vec* (DW2V):

### 1. Word2Vec with Structure Constraint (W2VConstr)
Metode ini dioptimasi untuk kasus di mana struktur graf relasi antar sub-korpus telah diketahui sebagai asumsi awal (*prior knowledge*). Fungsi objektif yang diminimisasi adalah:
$$ \min_{U_t} L_F + \tau L_{RD} + \lambda L_S $$

Dimana:
- $L_F = \|Y_t - U_t U_t^\top\|_F^2$ adalah *data fidelity loss* yang memastikan *embedding* $U_t$ merepresentasikan [[concepts/fundamental/Matriks_Ko-okurensi_dan_PPMI|Matriks PPMI]] $Y_t$. Galat pada tahap ini secara probabilistik dimodelkan dengan [[concepts/fundamental/Gaussian_dan_iid|Distribusi Gaussian]].
- $L_{RD} = \|D\|_F$ adalah penalti regularisasi jarak, dengan $D_{t,t'} = \|U_t - U_{t'}\|_F^2$.
- $L_S = \sum_{t'=1}^T W_{t,t'} D_{t,t'}$ adalah batasan struktural (*structure constraint*), di mana $W \in \mathbb{R}^{T \times T}$ adalah matriks afinitas (kedekatan) yang merepresentasikan struktur *underlying semantic* yang diberikan.

### 2. Word2Vec with Structure Prediction (W2VPred)
Metode ini diusulkan ketika informasi struktur antar sub-korpus tidak tersedia. Matriks kedekatan relasi $W$ diestimasi secara iteratif dari data, memanfaatkan kebalikan dari jarak *embedding* saat proses *training*:
$$ \tilde{W}_{t,t'} \leftarrow \begin{cases} D_{t,t'}^{-1} & \text{untuk } t \neq t' \\ 0 & \text{untuk } t = t' \end{cases} $$

Matriks hasil tersebut kemudian dinormalisasi terhadap baris dan kolom terkait pada setiap iterasi. Akibatnya, metode ini dapat menemukan struktur *sub-corpora* yang tersembunyi dan menghasilkan representasi kata spesifik domain dalam satu ruang vektor (*vector space*) yang sama.

### 3. Word2Vec with Denoised Structure Constraint (W2VDen)
Ketika asumsi relasi struktur heuristik di awal terbukti suboptimal atau kurang berkualitas (seperti yang terlihat pada beberapa kasus *dataset* ensiklopedia), kerangka kerja ini menyarankan langkah hibrida: struktur awalnya diestimasi menggunakan W2VPred, selanjutnya struktur prediksi tersebut diproses melalui *denoising* (menghilangkan relasi *noise*), dan akhirnya dijadikan matriks masukan (*ground truth*) struktur dasar bagi pelatihan fungsi objektif W2VConstr.

## Kesimpulan

Berdasarkan evaluasi metode tersebut, representasi kata yang dihasilkan tidak memerlukan inisialisasi awal (*pre-training*) dari model lain dan cukup stabil. Metode ini menawarkan kemampuan prediksi struktur *sub-corpora* lintas domain secara utuh (*end-to-end*).
