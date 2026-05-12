# Formulasi Probabilistik W2VPred

Dalam metode optimasi W2VPred-MAP, sangatlah esensial untuk menurunkan setiap *loss function* secara deterministik dari [[W2VPred]] menjadi wujud probabilistik. Hal ini bertujuan agar kita dapat menyeimbangkan skala pembobotan antar-komponen menggunakan *hyperparameter* statistik. Penjabaran berikut memuat langkah-langkah analitik secara utuh.

## 1. Probabilistik Fidelity Loss (Gaussian Likelihood)

Matriks observasi PPMI $Y_t$ direpresentasikan sebagai hasil rekonstruksi *inner-product embedding* $U_t U_t^\top$ yang dijangkiti oleh galat acak (*noise*). 

**Asumsi 1:** Setiap entri matriks observasi dimodelkan sebagai:
$$ Y_{t,ij} = [U_t U_t^\top]_{ij} + \epsilon_{t,ij} $$
dengan asumsi bahwa setiap galat berdistribusi independen normal (Gaussian), $\epsilon_{t,ij} \sim \mathcal{N}(0, \sigma_F^2)$.

Berdasarkan asumsi tersebut, probabilitas bersyarat untuk satu entri observasi menjadi:
$$ p(Y_{t,ij} | U_t, \sigma_F) = \frac{1}{\sqrt{2\pi}\sigma_F} \exp \left( - \frac{(Y_{t,ij} - [U_t U_t^\top]_{ij})^2}{2\sigma_F^2} \right) $$

Karena seluruh galat diasumsikan saling independen (*i.i.d*), probabilitas gabungan (*likelihood*) untuk seluruh observasi pada dimensi $T$ (jumlah domain) dan $V$ (ukuran kosakata) adalah perkalian dari seluruh entri:
$$ p(Y | U, \sigma_F) = \prod_{t=1}^T \prod_{i=1}^V \prod_{j=1}^V \frac{1}{\sqrt{2\pi}\sigma_F} \exp \left( - \frac{(Y_{t,ij} - [U_t U_t^\top]_{ij})^2}{2\sigma_F^2} \right) $$

Untuk mempermudah optimasi komputasional, kita mentransformasikan persamaan di atas ke bentuk penjumlahan melalui penerapan operasi negatif logaritma ($- \log$):
$$ -\log p(Y | U, \sigma_F) = \sum_{t=1}^T \sum_{i=1}^V \sum_{j=1}^V \left[ \frac{(Y_{t,ij} - [U_t U_t^\top]_{ij})^2}{2\sigma_F^2} + \log(\sqrt{2\pi}\sigma_F) \right] $$

$$ -\log p(Y | U, \sigma_F) = \frac{1}{2\sigma_F^2} \sum_{t=1}^T \sum_{i=1}^V \sum_{j=1}^V (Y_{t,ij} - [U_t U_t^\top]_{ij})^2 + (T \cdot V^2) \log \sigma_F + C_F $$
(di mana $C_F$ adalah konstanta turunan dari $\sqrt{2\pi}$ yang tidak bergantung pada variabel yang dioptimasi).

Mengingat bahwa suku kuadrat persis mewakili persamaan *Fidelity Loss* deterministik asli, yakni $L_F = \sum_t \| Y_t - U_t U_t^\top \|_F^2$, maka komponen objektif fungsional akhir dari $L_F$ menjadi:
$$ J_F(U, \sigma_F) = \frac{L_F}{2\sigma_F^2} + (T \cdot V^2) \log \sigma_F $$

## 2. Probabilistik Structure Loss (Gibbs Prior)

Komponen *Structure Loss* pada model dasar dirumuskan dengan $L_S(U) = \sum_{t \neq t'} W_{t,t'} \|U_t - U_{t'}\|_F^2$. Komponen ini **bukan** sebuah fungsi observasi, melainkan keyakinan (prior) terhadap struktur topologi ruang representasi. Oleh karenanya, di dalam kerangka kerja probabilitas, diasumsikan suatu distribusi energi *Gibbs*.

**Asumsi 2:** Probabilitas *prior* geometris terdistribusi Gibbs dan didefinisikan sebagai:
$$ p_S(U | W, \sigma_S) = \frac{1}{Z_S(\sigma_S)} \exp\left( - \frac{L_S(U)}{2\sigma_S^2} \right) $$
dengan konstanta fungsi partisi bernilai integral kontinu dari seluruh ruang probabilitas matrik:
$$ Z_S(\sigma_S) = \int \exp\left( - \frac{L_S(U)}{2\sigma_S^2} \right) dU $$

Mengevaluasi fungsi partisi $Z_S(\sigma_S)$ ini tidaklah mudah dikarenakan dimensinya yang nyaris tak terbatas. Akan tetapi, kita dapat mengeksploitasi fitur bawaan $L_S$, yaitu **Sifat Homogenitas Berderajat Dua** ($L_S(cU) = c^2 L_S(U)$). Dengan melakukan subtitusi variabel matriks $U = \sigma_S V$, maka $L_S(\sigma_S V) = \sigma_S^2 L_S(V)$. Hal ini menyebabkan parameter $\sigma_S^2$ pada operan eksponensial lenyap:
$$ \exp\left( - \frac{L_S(\sigma_S V)}{2\sigma_S^2} \right) = \exp\left( - \frac{L_S(V)}{2} \right) $$

Serta diferensial volume skalanya menjadi $dU = \sigma_S^n dV$ di mana $n = T \cdot V \cdot d$. Integralnya pun berubah wujud menjadi:
$$ Z_S(\sigma_S) = \sigma_S^n \int \exp\left( - \frac{L_S(V)}{2} \right) dV = \sigma_S^n \cdot Z_S(1) $$

Setelah kita mengekstraksi parameter pengali $\sigma_S^n$ keluar dari integral *intractable*, barulah kita melakukan transformasi negatif logaritma pada $p_S$:
$$ -\log p_S(U | W, \sigma_S) = \frac{L_S(U)}{2\sigma_S^2} + n \log \sigma_S + C_S $$

Mengingat parameter $n$ adalah setara dengan $T \cdot V \cdot d$, dan $C_S$ tidak berpengaruh pada tahapan optimasi, *loss* struktural tersebut menjadi wujud objektif akhir:
$$ J_S(U, \sigma_S) = \frac{L_S}{2\sigma_S^2} + (T \cdot V \cdot d) \log \sigma_S $$

## 3. Probabilistik Smoothing Loss (Gibbs Prior)

Komponen *Smoothing Loss* di model aslinya dinyatakan dengan $L_{RD}(U) = \sqrt{\sum_{t \neq t'} D_{t,t'}^2}$ di mana $D_{t,t'} = \|U_t - U_{t'}\|_F^2$. Sama seperti struktural di atas, properti ini tidak mengusung data observasional sehingga diperlakukan sebagai probabilitas berdasar *Gibbs Prior*.

**Asumsi 3:** Probabilitas *prior* kelancaran antar-domain didefinisikan sebagai:
$$ p_{RD}(U | \sigma_{RD}) = \frac{1}{Z_{RD}(\sigma_{RD})} \exp\left( - \frac{L_{RD}(U)}{2\sigma_{RD}^2} \right) $$

Sekali lagi kita mendapati **Sifat Homogenitas Berderajat Dua** bekerja pada rumusan $L_{RD}(cU) = c^2 L_{RD}(U)$. Karena sifatnya identik, dengan mensubstitusikan variabel ruang probabilitas $U = \sigma_{RD} V$ sebagaimana yang dikerjakan pada poin sebelumnya, didapatkan penyederhanaan fungsi partisi:
$$ Z_{RD}(\sigma_{RD}) = \sigma_{RD}^n \cdot Z_{RD}(1) $$

Sehingga ketika fungsi prior $p_{RD}$ dikenakan ekspresi negatif logaritma:
$$ -\log p_{RD}(U | \sigma_{RD}) = \frac{L_{RD}(U)}{2\sigma_{RD}^2} + n \log \sigma_{RD} + C_{RD} $$

Dengan $n = T \cdot V \cdot d$, kontribusi fungsi objektifnya diringkas ke bentuk deterministik:
$$ J_{RD}(U, \sigma_{RD}) = \frac{L_{RD}}{2\sigma_{RD}^2} + (T \cdot V \cdot d) \log \sigma_{RD} $$

Ketiga rumusan fraksional dengan embel-embel regularisasi varians ($J_F$, $J_S$, dan $J_{RD}$) inilah yang selanjutnya akan dikawinkan menjadi satu fungsi probabilitas *Bayesian inference* utuh via [[Strategi_Optimasi_JMAP]].
