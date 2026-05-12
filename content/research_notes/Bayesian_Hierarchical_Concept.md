# Catatan Riset: Model Bayesian Hierarkis vs Non-Hierarkis

## Model Bayesian Non-Hierarkis (Standar)
**Sumber**: Gelman, A., et al. (2013). *Bayesian Data Analysis* (3rd ed.).
- Dalam model Bayesian standar (non-hierarkis), parameter model $\theta$ diasumsikan berasal dari sebuah distribusi *prior* $p(\theta)$ di mana parameter dari *prior* tersebut (hiperparameter) bernilai tetap (konstan) dan diketahui.
- *Quote referensi*: Model non-hierarkis sering menspesifikasikan nilai numerik konstan untuk parameter *prior* alih-alih memberikannya distribusi *hyperprior* (Gelman 2013, Bab 5).

## Model Bayesian Hierarkis
**Sumber**: Bernardo, J. M., & Smith, A. F. M. (2009). *Bayesian Theory* (Bagian 5.6.4, hal. 371-372).
- **Kutipan Asli**:
  "Expressed in terms of generic densities, a simple version of such an hierarchical model has the form:
  $p(\boldsymbol{x}|\boldsymbol{\theta}) = p(\boldsymbol{x}_1, \dots, \boldsymbol{x}_k | \boldsymbol{\theta}_1, \dots, \boldsymbol{\theta}_k) = \prod_{i=1}^k p(\boldsymbol{x}_i | \boldsymbol{\theta}_i)$
  $p(\boldsymbol{\theta}|\boldsymbol{\phi}) = p(\boldsymbol{\theta}_1, \dots, \boldsymbol{\theta}_k | \boldsymbol{\phi}) = \prod_{i=1}^k p(\boldsymbol{\theta}_i | \boldsymbol{\phi})$
  $p(\boldsymbol{\phi})$
  The basic interpretation is as follows. Observables $\boldsymbol{x}_1, \dots, \boldsymbol{x}_k$ are available from $k$ different, but related, sources: for example, $k$ individuals in a homogeneous population, or $k$ clinical trial centres involved in the same study. The first stage of the hierarchy specifies parametric model components for each of the $k$ observables. But because of the 'relatedness' of the $k$ observables, the parameters $\boldsymbol{\theta}_1, \dots, \boldsymbol{\theta}_k$ are themselves judged to be exchangeable. The second and third stages of the hierarchy thus provide a prior for $\boldsymbol{\theta}$ of the familiar mixture representation form... Here, the 'hyperparameter' $\boldsymbol{\phi}$ typically has an interpretation in terms of characteristics - for example, mean and covariance - of the population... from which the $k$ units are drawn."

Catatan ini akan digunakan sebagai dasar referensi faktual untuk menyusun bagian 2.7.1 di `bab2.tex`.
