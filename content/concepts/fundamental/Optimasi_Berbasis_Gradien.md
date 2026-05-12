# Konsep Fundamental: Optimasi Berbasis Gradien (*Gradient-Based Optimization*)

Optimasi adalah jantung dari proses pembelajaran ( *training*) pada *machine learning* dan *deep learning*. Ketika kita "melatih" sebuah model, secara matematis kita sedang mencari sekumpulan nilai parameter (seperti bobot matriks) yang meminimalkan sebuah **Fungsi Kerugian (*Loss Function*)**.

> **Kaitan dengan konsep lain:** Dalam konteks probabilistik, meminimalkan *loss function* seringkali setara dengan meminimalkan *Negative Log-Likelihood* (lihat [Negative Log Likelihood](Negative_Log_Likelihood.md)).

## 1. *Gradient Descent* (GD)

Bayangkan Anda sedang berada di puncak gunung dengan mata tertutup, dan tujuan Anda adalah mencapai lembah terendah (titik minimum fungsi *loss*). Bagaimana Anda tahu arah mana yang harus diambil?

Jawabannya adalah dengan meraba kemiringan tanah di bawah kaki Anda. Dalam kalkulus, "kemiringan" multidimensi ini disebut **Gradien** ($\nabla$). 
Gradien selalu menunjuk ke arah pendakian yang *paling terjal*. Karena tujuan kita adalah turun ke lembah, kita harus mengambil langkah berlawanan dengan arah gradien (arah negatif gradien).

Secara matematis, pembaruan (*update*) parameter $\theta$ dirumuskan sebagai:
$$ \theta_{t+1} = \theta_t - \eta \nabla_\theta \mathcal{L}(\theta_t) $$

*   $\theta_t$: Parameter saat ini (iterasi ke-$t$).
*   $\nabla_\theta \mathcal{L}(\theta_t)$: Gradien dari *loss function* terhadap parameter.
*   $\eta$ (*Learning Rate*): Laju pembelajaran, yaitu seberapa besar "langkah" yang Anda ambil. Jika terlalu besar, Anda bisa melompati lembah. Jika terlalu kecil, perjalanan Anda akan sangat lambat.

## 2. *Stochastic Gradient Descent* (SGD)

Dalam *Gradient Descent* klasik (juga disebut *Batch Gradient Descent*), model harus menghitung gradien menggunakan **seluruh** data *training* sekaligus sebelum mengambil satu langkah. 
Jika Anda memiliki jutaan data teks (misalnya matriks ko-okurensi yang sangat besar), menghitung seluruhnya untuk satu langkah sangat tidak efisien dan boros memori.

Solusinya adalah **Stochastic Gradient Descent (SGD)**. 
Alih-alih menggunakan seluruh data, SGD menghitung gradien berdasarkan satu persatu data acak, atau lebih umum, sebagian kecil data yang disebut ***mini-batch***. 

**Keuntungan SGD:**
*   Jauh lebih cepat karena evaluasinya lebih ringan.
*   Dapat berjalan meskipun memori (RAM/VRAM) terbatas.

**Kelemahan SGD:**
*   Karena hanya menggunakan sebagian data (sampel), tebakan arah lembahnya seringkali bising (*noisy*) dan tidak akurat. 
*   Akibatnya, SGD sering mengalami "osilasi" (bergerak zig-zag) saat menuruni lembah, membuatnya lambat untuk konvergen.
*   Rentan terjebak pada *local minimum* (lembah dangkal yang bukan tujuan akhir) atau *saddle points* (titik datar seperti pelana kuda).

Oleh karena itu, diperlukan optimasi tingkat lanjut seperti [Algoritma Adam](../major/Algoritma_Adam.md) untuk mengatasi masalah osilasi ini.
