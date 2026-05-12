# Negative Log-Likelihood (NLL)

## Konsep Utama
*Likelihood* total atas sekumpulan observasi adalah hasil perkalian seluruh probabilitas titik data bersyarat. Mengalikan jutaan persentase (angka koma di bawah 1) secara komputasi akan langsung menghantam limit presisi memori tipe data komputer (*numerical underflow*), menjadikannya nol secara absolut. 

Dengan mentransformasikan probabilitas menggunakan fungsi logaritma monotoik, operasi perkalian berubah menjadi aditif (penjumlahan). Penambahan tanda minus ("negatif") membalikkan masalah pencarian nilai probabilitas maksimal (*Maximum Likelihood Estimation* / MLE) menjadi masalah optimasi biasa, yaitu fungsi pencarian batas nilai minimum (*Loss Minimization*).

## Penerapan dalam Model Probabilistik W2VPred
Berperan penting dalam memecah perkalian integral probabilitas *Fidelity Loss* menjadi format linear. Melalui transformasi ini, fungsi $L_F$ biasa bisa diekstrak keluar dari wujud eksponensial menjadi wujud objektif kuadrat plus fungsional penalti varians. Transformasi NLL ini yang memungkinkan gradien dapat dihitung dengan mudah oleh komputasi diferensiasi otomatis (seperti *PyTorch Autograd*).

## Sumber Referensi
- Goodfellow, I., Bengio, Y., & Courville, A. (2016). *Deep Learning*. MIT Press. (Bab 5: *Machine Learning Basics*).
