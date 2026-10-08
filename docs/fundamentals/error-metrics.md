# Error Metrics and Mathematical Bounds

In exact digital arithmetic, functional correctness is binary: a circuit is either **100% correct** or **broken**. 

In **approximate and inexact computing**, arithmetic error is treated as a **continuous, quantifiable design budget**. By tolerating bounded numerical errors, designers trade precision for dramatic improvements in **Power, Performance, and Area (PPA)**.

---

## 1. Primary Numerical Error Metrics

Let $A$ and $B$ represent the input operands, and let $S$ denote the set of all evaluated input combinations ($|S|$ total test vectors).

Let $Y_{\text{exact}}(A, B)$ be the mathematical ground truth and $Y_{\text{approx}}(A, B)$ be the output produced by the approximate hardware.

```
       Exact Reference:  Y_exact  = f(A, B)
   Approximate Circuit:  Y_approx = f_approx(A, B)
                         ────────────────────────
       Error Distance:   ED(A, B) = |Y_approx - Y_exact|
```

---

### 1. Error Distance ($ED$)
The fundamental point-wise absolute numerical discrepancy for a specific input pair $(A, B)$:

$$ED(A, B) = |Y_{\text{approx}}(A, B) - Y_{\text{exact}}(A, B)|$$

---

### 2. Mean Error Distance ($MED$)
The average absolute error distance across the entire operational input space $S$. $MED$ measures the general accuracy of the circuit:

$$MED = \frac{1}{|S|} \sum_{(A,B) \in S} |Y_{\text{approx}}(A, B) - Y_{\text{exact}}(A, B)|$$

> **Key Insight:** $MED$ has physical arithmetic units (e.g., LSBs or integers). For an 8-bit adder, an $MED = 1.2$ means the approximate output is off by only $1.2$ counts on average out of $510$.

---

### 3. Mean Relative Error Distance ($MRED$)
The average relative percentage error normalized against the true exact magnitude:

$$MRED = \frac{1}{|S^*|} \sum_{(A,B) \in S^*} \frac{|Y_{\text{approx}}(A, B) - Y_{\text{exact}}(A, B)|}{|Y_{\text{exact}}(A, B)|}$$

*(where $S^* = \{(A,B) \in S : Y_{\text{exact}}(A, B) \neq 0\}$ to avoid division by zero).*

> **Application Rule:** For image and video processing, human visual perception is sensitive to relative contrast rather than absolute magnitude. Circuits with $MRED < 2\%$ are generally visually indistinguishable from exact hardware.

---

### 4. Normalized Mean Error Distance ($NMED$)
$NMED$ normalizes $MED$ by the maximum possible output range $D_{\text{max}}$ of the circuit. This allows fair comparison between circuits of different bit-widths (e.g. comparing an 8-bit multiplier to a 16-bit multiplier):

$$NMED = \frac{MED}{D_{\text{max}}}$$

For an unsigned $N$-bit multiplier, $D_{\text{max}} = (2^N - 1)^2$. For an $N$-bit adder, $D_{\text{max}} = 2^{N+1} - 2$.

---

### 5. Worst-Case Error ($WCE$) / Maximum Error Distance ($MaxED$)
The upper bound on the numerical error that can ever be produced by the circuit under any possible input combination:

$$WCE = \max_{(A,B) \in S} |Y_{\text{approx}}(A, B) - Y_{\text{exact}}(A, B)|$$

> **Safety Significance:** $WCE$ is critical for safety-critical and bounded algorithms. If an algorithm requires $|Error| \le 32$, a circuit with $WCE = 28$ is formally guaranteed to never violate system specifications.

---

### 6. Error Rate ($ER$)
The fraction of input test vectors for which the approximate circuit produces a non-zero error:

$$ER = \frac{1}{|S|} \sum_{(A,B) \in S} \mathbb{I}\Big(Y_{\text{approx}}(A, B) \neq Y_{\text{exact}}(A, B)\Big)$$

*(where $\mathbb{I}(\cdot)$ is the indicator function equal to $1$ if true and $0$ otherwise).*

> **Counter-Intuitive Insight:** A circuit can have a high Error Rate ($ER = 90\%$) while still being exceptionally accurate if its Error Distance is tiny ($ED = 1$). For example, dropping the single lowest bit produces $ER = 50\%$ but an unnoticeable $MRED = 0.01\%$.

---

### 7. Mean Error ($ME$) / Statistical Bias
The signed average error produced by the circuit:

$$ME = \frac{1}{|S|} \sum_{(A,B) \in S} \Big(Y_{\text{approx}}(A, B) - Y_{\text{exact}}(A, B)\Big)$$

```
     Truncation Multiplier:   ME < 0  (Always underestimates ──> Negative Drift)
     Rounding Multiplier:     ME ≈ 0  (Unbiased ──> Zero Accumulation Drift)
```

> **Deep Learning Relevance:** In large matrix multiplications ($\sum_{i=1}^{1024} A_i \cdot B_i$), if $ME = 0$, thousands of tiny positive and negative errors cancel each other out, yielding an almost exact accumulated sum!

---

## 2. Downstream Application Quality Metrics

Numerical metrics alone do not tell the whole story. We evaluate approximate arithmetic across real-world downstream perceptual and machine learning metrics:

### 🖼️ Peak Signal-to-Noise Ratio ($PSNR$)
Used in computer vision and image processing. It measures the ratio between the maximum possible pixel energy and the Mean Squared Error ($MSE$):

$$MSE = \frac{1}{M \times N} \sum_{x=0}^{M-1} \sum_{y=0}^{N-1} \Big(I_{\text{exact}}(x, y) - I_{\text{approx}}(x, y)\Big)^2$$

$$PSNR = 10 \cdot \log_{10}\left( \frac{MAX_I^2}{MSE} \right) = 20 \cdot \log_{10}\left( \frac{255}{\sqrt{MSE}} \right)$$

* For 8-bit grayscale images, $MAX_I = 255$.
* **$> 35\text{ dB}$**: Visually indistinguishable from exact image.
* **$30\text{ dB} - 35\text{ dB}$**: High quality, minor imperceptible noise.
* **$< 25\text{ dB}$**: Visible grain and structural artifacts.

---

### 🧠 Structural Similarity Index ($SSIM$)
While $PSNR$ measures raw pixel squared errors, $SSIM$ models the human visual system's perception of **luminance ($l$), contrast ($c$), and structure ($s$)**:

$$SSIM(x, y) = [l(x, y)]^\alpha \cdot [c(x, y)]^\beta \cdot [s(x, y)]^\gamma = \frac{(2\mu_x\mu_y + C_1)(2\sigma_{xy} + C_2)}{(\mu_x^2 + \mu_y^2 + C_1)(\sigma_x^2 + \sigma_y^2 + C_2)}$$

* Range: $[-1, 1]$, where $1.0$ indicates identical image structure.
* Approximate computing designs typically target $SSIM \ge 0.95$.

---

## 📚 Primary Literature & IEEE Citations

- **Comprehensive Survey on Approximate Arithmetic Metrics**:  
  J. Liang et al., *"New Metrics for the Reliability of Approximate and Probabilistic Adders"*, IEEE Transactions on Computers, [IEEE Xplore (DOI: 10.1109/TC.2012.146)](https://doi.org/10.1109/TC.2012.146).
- **Probabilistic Error Modeling Framework**:  
  V. K. Chippa et al., *"Analysis and Characterization of Inherent Application Resilience for Approximate Computing"*, ACM/IEEE DAC, [ACM/IEEE (DOI: 10.1145/2463209.2488873)](https://doi.org/10.1145/2463209.2488873).
- **SSIM Quality Assessment**:  
  Z. Wang et al., *"Image Quality Assessment: From Error Visibility to Structural Similarity"*, IEEE Transactions on Image Processing, [IEEE Xplore (DOI: 10.1109/TIP.2003.819861)](https://doi.org/10.1109/TIP.2003.819861).
