# Comprehensive Glossary of Inexact & Approximate Computing

This glossary provides concise definitions, microarchitectural explanations, and mathematical formulas for key concepts, metrics, and circuit topologies used across approximate hardware design and computer engineering.

---

### **ACA (Almost-Correct Adder)**
A speculative carry adder architecture that cuts global carry propagation chains into localized $k$-bit prediction windows, reducing critical delay from $\mathcal{O}(N)$ to $\mathcal{O}(k)$.

### **Accuracy-Configurable / Dual-Mode**
An arithmetic unit that dynamically switches at runtime between exact computation mode and one or more approximate modes to adapt to varying battery levels, thermal throttling, or Quality-of-Service (QoS) requirements.

### **APTPU (Approximate Tensor Processing Unit)**
An AI accelerator matrix engine that integrates approximate 4:2 compressors and logarithmic arithmetic into systolic Processing Elements (PEs) to double compute density under strict thermal limits.

### **AXA / LAHAF (Approximate Full Adder Cells)**
CMOS Full Adder cell topologies that simplify the internal 28-transistor mirror circuit down to 8 to 12 transistors, trading 1 or 2 minor truth-table deviations for $>60\%$ lower dynamic switching power.

### **Booth Encoding (Radix-4 / Radix-8)**
A technique in multiplier design that encodes groups of multiplier bits into signed operations ($\{0, \pm Y, \pm 2Y\}$), halving the number of partial product rows from $N$ to $\lceil N/2 \rceil$.

### **Burks-Goldstine-von Neumann Theorem**
The mathematical proof established in 1946 showing that for random uniform inputs, the expected maximum carry run length in an $N$-bit addition is bounded by $\mathbb{E}[L_{\text{max}}] \approx \log_2(N)$.

### **CORDIC (Coordinate Rotation Digital Computer)**
An iterative algorithm that evaluates trigonometric ($\sin, \cos, \arctan$), hyperbolic ($\sinh, \cosh$), and vector rotations using exclusively bitwise shifts and additions without silicon multipliers.

### **CSF (Contrast Sensitivity Function)**
A psychophysical model of human vision describing how spatial frequency sensitivity peaks at $3\text{–}5\text{ cycles/degree}$ and attenuates rapidly at high frequencies, providing the perceptual basis for lossy compression and approximate transform pruning.

### **Dark Silicon**
The phenomenon caused by the 2005 collapse of Dennard scaling, where power density increases exponentially with transistor scaling, preventing modern microchips from powering all on-die transistors simultaneously at maximum clock frequency without melting.

### **DRAM Refresh Relaxation**
An approximate memory technique that quadruples the standard $64\text{ ms}$ DRAM refresh period to $256\text{ ms}$ or $512\text{ ms}$ for resilient buffers (e.g. video frames), saving $>65\%$ standby refresh power.

### **DRUM (Dynamic Range Unbiased Multiplier)**
A Leading-One Detector (LOD) based approximate multiplier that dynamically selects a $k$-bit window of the most significant active bits of operands while applying unbiased rounding compensation to the truncated bits.

### **EDP (Energy-Delay Product)**
A primary hardware figure of merit defined as:
$$\text{EDP} = \text{Energy} \times \text{Delay} = \text{Power} \times \text{Delay}^2$$

### **ER (Error Rate)**
The fraction of all input combinations for which the approximate circuit output differs from the exact mathematical result:
$$\text{ER} = \frac{1}{|S|} \sum_{x \in S} \mathbb{I}(Y_{\text{approx}}(x) \neq Y_{\text{exact}}(x))$$

### **GeAr (Generic Accuracy Configurable Adder)**
A generalized speculative adder topology parameterizing total wordlength ($N$), sub-adder length ($R$), prediction window ($P$), and valid sum bits ($Q$).

### **LEAD (Logarithmic Exponent Approximate Divider)**
A single-cycle approximate divider that converts division $N/D$ into base-2 logarithmic subtraction $\log_2 N - \log_2 D$ using leading-one detection and linear antilog interpolation.

### **LOA (Lower-Part OR Adder)**
An approximate adder architecture that uses exact full adders for upper $(N-k)$ MSBs and simple 1-gate bitwise OR logic ($S_i = A_i \lor B_i$) for lower $k$ LSBs.

### **MED (Mean Error Distance)**
The average absolute arithmetic error across the input domain $S$:
$$\text{MED} = \frac{1}{|S|} \sum_{x \in S} |Y_{\text{approx}}(x) - Y_{\text{exact}}(x)|$$

### **Mitchell's Logarithmic Algorithm**
A linear piecewise approximation of base-2 logarithms: $\log_2(1+x) \approx x$ for $x \in [0, 1)$, enabling multiplication and division to execute via fast integer addition and subtraction.

### **MRED (Mean Relative Error Distance)**
The average percentage relative error across all non-zero exact outputs:
$$\text{MRED} = \frac{1}{|S \setminus \{x: Y_{\text{exact}}=0\}|} \sum \frac{|Y_{\text{approx}}(x) - Y_{\text{exact}}(x)|}{|Y_{\text{exact}}(x)|}$$

### **NMED (Normalized Mean Error Distance)**
Mean Error Distance normalized by the maximum possible output magnitude $D_{\text{max}}$ of the exact circuit, enabling scale-independent comparison across arbitrary wordlengths:
$$\text{NMED} = \frac{\text{MED}}{D_{\text{max}}}$$

### **PSNR (Peak Signal-to-Noise Ratio)**
An engineering metric measured in decibels (dB) assessing reconstructed signal/image fidelity against ground truth:
$$\text{PSNR} = 10 \cdot \log_{10}\left( \frac{\text{MAX}_I^2}{\text{MSE}} \right)$$

### **RoBA (Rounding-Based Approximate Multiplier)**
An algorithm that rounds operands to their nearest powers of two ($A \approx 2^{k_1}, B \approx 2^{k_2}$), performing multiplication via barrel shifters and basic subtraction rather than deep multiplier trees.

### **SNM (Static Noise Margin)**
A metric of 6T SRAM bitcell electrical stability defining the maximum DC noise voltage that can be tolerated at the internal storage nodes without flipping the stored bit.

### **SSIM (Structural Similarity Index Measure)**
A perceptual image quality metric modeling human visual perception across luminance, contrast, and structural correlation:
$$\text{SSIM}(x, y) = \frac{(2\mu_x\mu_y + c_1)(2\sigma_{xy} + c_2)}{(\mu_x^2 + \mu_y^2 + c_1)(\sigma_x^2 + \sigma_y^2 + c_2)}$$

### **Systolic Array**
A 2D matrix mesh of Processing Elements (PEs) where data flows synchronously through neighboring cells to execute continuous matrix multiplications ($C = A \times B$) with high data reuse.

### **VOS (Voltage Over-Scaling)**
Scaling the circuit supply voltage $V_{DD}$ below the critical timing threshold required for worst-case delay, inducing rare timing errors along critical paths that are masked by application tolerance.

### **Wallace / Dadda Reduction Tree**
A columnar hardware reduction tree using 3:2 Full Adders and 4:2 Compressors that condenses $N$ partial product rows into 2 final sum and carry vectors in $\mathcal{O}(\log_{1.5} N)$ logic depth.

### **WCE (Worst-Case Error)**
The maximum absolute error magnitude that the approximate circuit can produce across the entire input space:
$$\text{WCE} = \max_{x \in S} |Y_{\text{approx}}(x) - Y_{\text{exact}}(x)|$$
