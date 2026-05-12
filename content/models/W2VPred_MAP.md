# W2VPred-MAP

W2VPred-MAP adalah pengembangan langsung dari model [[W2VPred]] yang mereformulasi fungsionalitas pembobotan loss secara statis menjadi pembobotan probabilistik yang adaptif. Konsep ini dibangun untuk menangani permasalahan di mana W2VPred asli membutuhkan proses *grid search* yang ekstensif guna menemukan bobot keseimbangan ($\lambda$ dan $\mu$) antara *Fidelity Loss* ($L_F$), *Structure Loss* ($L_S$), dan *Smoothing Loss* ($L_{RD}$).

## Motivasi Pembaruan

Pendekatan *Uncertainty-Weighted Loss* (seperti dalam [[uncertainty_weighted_loss]]) memiliki gagasan awal yang cemerlang: mengizinkan model mempelajari skala setiap *loss* (variansi) secara otomatis. Namun, formulasi asli *Uncertainty Weighting* (UW) mengasumsikan bahwa setiap loss komponen adalah sebuah *negative log-likelihood* dari deviasi rekonstruksi data observasi. Pada W2VPred, asumsi tersebut gagal terpenuhi secara penuh:
- $L_F$ memang mengukur kecocokan dengan data matriks observasi PPMI (berlaku sebagai *likelihood*).
- Namun $L_S$ dan $L_{RD}$ tidak bergantung pada data observasi apapun, melainkan murni mengevaluasi interaksi jarak geometri dari *embedding* (berlaku sebagai *prior*).

Mengaplikasikan teknik UW secara mentah pada $L_S$ dan $L_{RD}$ dinilai inkonsisten secara teoritis karena mencampurkan *likelihood* dan *prior* ke dalam parameter variansi *noise* data yang diobservasi. Sebagai solusinya, pendekatan *Maximum A Posteriori* (MAP) diperkenalkan. 

## Fungsi Objektif

Dengan merumuskan $L_F$ sebagai Gaussian *likelihood* dan $L_S$, $L_{RD}$ sebagai Gibbs *prior* (lihat [[Formulasi_Probabilistik_W2VPred]]), estimasi gabungan diwujudkan ke dalam fungsi objektif berbasis estimasi parameter simultan (menggunakan [[JMAP]]):

$$ L_{MAP}(U, \sigma) = \frac{L_F}{2\sigma_F^2} + \frac{L_S}{2\sigma_S^2} + \frac{L_{RD}}{2\sigma_{RD}^2} + \frac{T \cdot V^2}{2} \log \sigma_F + \frac{T \cdot V \cdot d}{2} \log \sigma_S + \frac{T \cdot V \cdot d}{2} \log \sigma_{RD} $$

Dalam kerangka objektif tersebut:
- $\sigma_F, \sigma_S, \sigma_{RD}$ menjadi *hyperparameter* variansi adaptif.
- Komponen *loss* yang skalanya lebih besar otomatis akan ditekan oleh bobot efektif yang lebih rendah seiring dengan penyesuaian $\sigma_k$ pada waktu komputasi.
- Nilai $T \cdot V^2 \log \sigma_F$ dan semisalnya berperan sebagai fungsi penalti regularisasi untuk mengikat nilai $\sigma$ agar tidak membesar menuju infiniti tak berhingga.

Model W2VPred asli terbukti secara matematis merupakan bentuk statis khusus (*special case*) dari W2VPred-MAP ketika $\sigma$ diperlakukan statis dan diasumsikan $\lambda = \frac{\sigma_F^2}{\sigma_S^2}$ serta $\mu = \frac{\sigma_F^2}{\sigma_{RD}^2}$.
