Algoritma Optimasi Adam (*Adaptive Moment Estimation*)

Jika [Gradient Descent dan SGD](../fundamental/Optimasi_Berbasis_Gradien.md) adalah metode dasar untuk meminimalkan *loss function*, maka **Adam** adalah iterasi modernnya yang jauh lebih pintar dan efisien. Diperkenalkan oleh Kingma & Ba (2014), Adam telah menjadi standar industri dalam *deep learning* modern.

Adam secara cerdas menggabungkan dua ide brilian dari dunia optimasi: **Momentum** dan **Penskalaan Adaptif (*Adaptive Scaling*)**.

## 1. Mekanisme Kerja Adam

Untuk memahami Adam, kita bisa menganalogikannya dengan bola berat yang menggelinding menuruni bukit.

### A. Estimasi Momen Pertama (*Momentum*)
Pada SGD standar, pergerakan menuruni lembah (fungsi *loss*) seringkali berosilasi (zig-zag). Adam mengatasi ini dengan melacak rata-rata pergerakan gradien masa lalu ($m_t$). 
Ini meniru hukum fisika **momentum**. Bola berat yang menggelinding ke bawah akan mengumpulkan kecepatan dan terus bergerak searah dengan konsisten, mengabaikan polisi tidur atau guncangan kecil (*noise*). Ini membuat lintasan konvergensi jauh lebih halus dan cepat.

### B. Estimasi Momen Kedua (*RMSProp / Adaptive Scaling*)
Setiap parameter dalam *neural network* memiliki karakteristik berbeda. Beberapa parameter mungkin sangat sering diupdate, sementara yang lain jarang sekali.
Adam melacak rata-rata dari kuadrat gradien di masa lalu ($v_t$). 
*   Jika sebuah parameter sangat sering mendapat gradien besar, Adam akan **menurunkan** laju pembelajarannya secara spesifik untuk parameter tersebut agar tidak kebablasan.
*   Sebaliknya, untuk parameter yang jarang mendapat perhatian (*sparse*), Adam akan **meningkatkan** laju pembelajarannya.

### Rumus Update Adam
Secara teknis, nilai $m_t$ dan $v_t$ dikalkulasi secara eksponensial (memberikan bobot lebih besar pada gradien terbaru), dikoreksi bias awalnya, lalu digunakan untuk mengupdate parameter:
$$ \theta_{t+1} = \theta_t - \frac{\eta}{\sqrt{\hat{v}_t} + \epsilon} \hat{m}_t $$
*(dengan $\eta$ sebagai laju pembelajaran awal, dan $\epsilon$ sebagai angka kecil pencegah error pembagian dengan nol).*

## 2. Mengapa Adam Krusial untuk W2VPred dan JMAP?

Dalam penelitian domain-spesifik *word embedding* (W2VPred), penggunaan Adam bukanlah sekadar pilihan kosmetik, melainkan keharusan teknis:

1.  **Menangani Data Sangat Jarang (*Sparsity*)**:
    Data yang diinputkan ke model adalah [Matriks PPMI](../fundamental/Matriks_Ko-okurensi_dan_PPMI.md). Dalam bahasa alami, sebagian besar kombinasi pasangan kata memiliki frekuensi nol, membuat gradien menjadi sangat jarang (*sparse*). Komponen momen kedua pada Adam memastikannya tetap dapat memperbarui *embedding* secara efektif meskipun data yang masuk jarang.
2.  **Optimasi Gabungan Beda Skala (JMAP)**:
    Dalam pendekatan [JMAP](JMAP.md) dan [Strategi Optimasi JMAP](Strategi_Optimasi_JMAP.md), algoritma harus mengoptimasi **matriks *embedding*** yang berdimensi raksasa secara bersamaan dengan **parameter skalar variansi ($\sigma$)** dari [Uncertainty Weighting](uncertainty_weighted_loss.md) (dimana dalam praktek di-[reparameterisasi numerik](Reparameterisasi_Numerik.md) menjadi $s_k$).
    Skala dan kecepatan konvergensi dari *embedding* dan hiperparameter variansi tersebut sangatlah berbeda. Berkat kemampuan *adaptive learning rate* (laju pembelajaran yang disesuaikan secara individu per parameter), Adam dapat menstabilkan laju keduanya tanpa mengorbankan konvergensi salah satunya.
3.  **Menjaga Stabilitas dari Ledakan Gradien**:
    Berkat penskalaan momen kedua di posisi penyebut, Adam membantu membatasi ukuran langkah yang terlalu besar, menjaga *training* tetap stabil di iterasi-iterasi awal yang kritis.
