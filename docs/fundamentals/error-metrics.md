# Error Metrics and Mathematical Bounds

In exact digital design, functional correctness is binary. In **approximate computing**, arithmetic error is treated as a continuous design budget traded against circuit power, delay, and area (PPA).

---

## 1. Primary Numerical Error Metrics

For an approximate arithmetic block computing $Y_{approx}(A, B)$ versus the ground-truth exact function $Y_{exact}(A, B)$ over an input distribution $S$:

### Error Distance ($ED$)
$$ED(A, B) = |Y_{approx}(A, B) - Y_{exact}(A, B)|$$

### Mean Error Distance ($MED$)
$$MED = \frac{1}{|S|} \sum_{(A,B) \in S} |Y_{approx}(A, B) - Y_{exact}(A, B)|$$

### Mean Relative Error Distance ($MRED$)
$$MRED = \frac{1}{|S^*|} \sum_{(A,B) \in S^*} \frac{|Y_{approx}(A, B) - Y_{exact}(A, B)|}{|Y_{exact}(A, B)|}$$
*(where $S^* = \{(A,B) \in S : Y_{exact}(A, B) \neq 0\}$)*

### Normalized Mean Error Distance ($NMED$)
$$NMED = \frac{MED}{D_{max}}$$
*(where $D_{max}$ is the maximum possible output magnitude, e.g. $(2^N-1)^2$ for an $N \times N$ unsigned multiplier).*

### Worst-Case Error ($WCE$) / Maximum Error Distance ($MaxED$)
$$WCE = \max_{(A,B) \in S} |Y_{approx}(A, B) - Y_{exact}(A, B)|$$

### Error Rate ($ER$)
$$ER = \frac{1}{|S|} \sum_{(A,B) \in S} \mathbb{I}(Y_{approx}(A, B) \neq Y_{exact}(A, B))$$

### Mean Error ($ME$) / Bias
$$ME = \frac{1}{|S|} \sum_{(A,B) \in S} (Y_{approx}(A, B) - Y_{exact}(A, B))$$
> **Design Insight:** In iterative accumulation (such as matrix multiplication or FIR convolution), an approximate unit with $ME \approx 0$ (unbiased) prevents error accumulation drift even when $ER$ is high.

---

## 2. Downstream Application Metrics

| Domain | Key Metric | Target Threshold |
| :--- | :--- | :--- |
| **Image Processing** | Peak Signal-to-Noise Ratio ($PSNR$) | $> 30\text{ dB}$ (Imperceptible degradation) |
| **Image Quality** | Structural Similarity Index ($SSIM$) | $> 0.92$ |
| **Deep Learning** | Top-1 Classification Accuracy Drop ($\Delta Top1$) | $\le 1.0\%$ |
| **Speech / Audio** | Signal-to-Quantization-Noise Ratio ($SQNR$) | $> 25\text{ dB}$ |
