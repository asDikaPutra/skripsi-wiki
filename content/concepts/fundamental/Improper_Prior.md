# Improper Prior

## Konsep Utama
Definisi *Improper Prior* adalah distribusi probabilitas a priori yang tidak memiliki ukuran luasan (*measure*) terhingga. Dengan kata lain, jika fungsi probabilitas distribusinya diintegralkan melintasi sepanjang seluruh ruang parameternya, hasil probabilitas kesuluruhannya tidaklah sama dengan 1, melainkan integralnya bersifat divergen ($\infty$).

## Penerapan dalam Model Probabilistik W2VPred
Komponen energi ruang jarak euklidian (karena murni mengukur selisih parameter seperti $\| U_t - U_{t'} \|_F^2$) memiliki sifat invarian terhadap orientasi translasi absolut. Artinya, jika kita menggeser seluruh matriks representasi ruang spasial secara bersamaan (+ C), ia tidak akan sedikit pun mengubah selisih jarak geometris awalnya. 

Hal ini menciptakan sebuah kondisi ekstrem di mana volume integral totalnya meregang menuju tak terhingga. Kondisi ini membuat penyebut pembagi normalisasi probabilitas (*Partition Function*) *Gibbs prior* di model W2VPred (yaitu $Z_S$ dan $Z_{RD}$) meledak menjadi bilangan tak terhingga (divergen), menjadikannya sebuah *Improper Prior*. Meskipun terdengar berisiko, parameter ini nantinya tetap terselamatkan melalui pemanfaatan turunan gradien manipulasi linear substitusi matriks berderajat dua.

## Hubungan Antar Konsep
- Dihasilkan oleh: [[concepts/fundamental/Distribusi_Gibbs|Distribusi Gibbs]]
- Diatasi dengan: [[concepts/fundamental/Integral_Fungsi_Partisi|Integral Fungsi Partisi]] (Scaling Trick)

## Sumber Referensi
- Gelman, A., Carlin, J. B., Stern, H. S., Dunson, D. B., Vehtari, A., & Rubin, D. B. (2013). *Bayesian Data Analysis*. CRC press. (Bab 2: *Single-parameter models*).
