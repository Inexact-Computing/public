# Approximate Transforms: DCT & FFT

Transform algorithms translate digital signals between the **spatial/time domain** and the **frequency domain**. They form the core computational engine of modern communication, multimedia processing, and biomedical telemetry:
- **Discrete Cosine Transform (DCT)**: Powers JPEG photo compression, MPEG-2/4, H.264/AVC, and H.265/HEVC video streaming.
- **Fast Fourier Transform (FFT)**: Demodulates 5G cellular carriers, Wi-Fi 6 (OFDM), synthetic aperture radar (SAR), sonar, and medical EEG/ECG analytics.

Because human visual (HVS) and auditory (HAS) perceptual systems act as natural low-pass filters, approximate transform hardware can prune complex floating-point multiplications into integer additions and bit-shifts without noticeable signal degradation.

---

## 📸 Discrete Cosine Transform (DCT) Foundations

The 2D Discrete Cosine Transform (2D-DCT-II) maps an $N \times N$ matrix of spatial pixels $f(x, y)$ into frequency coefficients $F(u, v)$:

$$F(u, v) = \frac{C(u) C(v)}{4} \sum_{x=0}^{N-1} \sum_{y=0}^{N-1} f(x, y) \cos\left[ \frac{(2x + 1)u \pi}{2N} \right] \cos\left[ \frac{(2y + 1)v \pi}{2N} \right]$$

where $C(k) = \frac{1}{\sqrt{2}}$ for $k=0$, and $C(k) = 1$ for $k > 0$.

```
+-------------------------------------------------------------------+
|               8 x 8 2D-DCT FREQUENCY DISTRIBUTION                 |
+-------------------------------------------------------------------+
| [ DC  F01 F02 F03 F04 F05 F06 F07 ]  <-- Low Frequencies (MSBs)   |
| [ F10 F11 F12 F13 F14 F15 F16 F17 ]      Coarse contours & light  |
| [ F20 F21 F22 ...                 ]      (CRUCIAL FOR PERCEPTION) |
| [ ...                             ]                               |
| [ F60 F61 ...                     ]  <-- High Frequencies (LSBs)  |
| [ F70 F71 F72 F73 F74 F75 F76 F77 ]      Subtle micro-textures    |
|                                          (SAFE TO PRUNE / APPROX) |
+-------------------------------------------------------------------+
```

Using separability, the 2D-DCT is calculated by applying a 1D-DCT across rows followed by a 1D-DCT across columns:

$$\mathbf{F} = \mathbf{C} \cdot \mathbf{f} \cdot \mathbf{C}^T$$

---

## 🏛️ Multiplication-Free Approximate DCT Architectures

An exact 8-point 1D-DCT transform matrix $\mathbf{C}_8$ contains irrational trigonometric constants:

$$\cos\left(\frac{\pi}{16}\right) \approx 0.92388, \quad \sin\left(\frac{\pi}{16}\right) \approx 0.38268, \quad \cos\left(\frac{3\pi}{16}\right) \approx 0.83147$$

Approximate DCT architectures round or quantize these coefficients to the set $\mathcal{S} \in \{0, \pm 1, \pm 2, \pm \frac{1}{2}\}$, converting continuous floating-point multipliers into simple wiring shifts and additions.

### The Potluri-Bouguezel-Ahmad-Swamy (BAS) 8-Point Transform
The approximate 8-point DCT transform matrix $\mathbf{T}_8$ is formulated as:

$$\mathbf{T}_8 = \begin{bmatrix}
 1 &  1 &  1 &  1 &  1 &  1 &  1 &  1 \\
 1 &  1 &  0 &  0 &  0 &  0 & -1 & -1 \\
 1 &  0 &  0 & -1 & -1 &  0 &  0 &  1 \\
 0 &  0 & -1 &  1 & -1 &  1 &  0 &  0 \\
 1 & -1 & -1 &  1 &  1 & -1 & -1 &  1 \\
 1 & -1 &  0 &  0 &  0 &  0 &  1 & -1 \\
 0 & -1 &  1 &  0 &  0 &  1 & -1 &  0 \\
 0 &  0 &  1 &  1 & -1 & -1 &  0 &  0
\end{bmatrix}$$

- **Multiplier Count**: **0 Multipliers** (Zero multiplications required).
- **Adder Count**: Only **14 integer additions** for a complete 8-point 1D transform.
- **Image Quality**: Achieves over **$38.5\text{ dB}$ PSNR** in JPEG compression while saving **$>72\%$ power** compared to the exact Loeffler 8-point DCT.

---

## 📡 Approximate Fast Fourier Transform (FFT) & Twiddle Factors

In the Cooley-Tukey Radix-2 decimation-in-time (DIT) FFT algorithm, an $N$-point Discrete Fourier Transform is decomposed into $\log_2 N$ butterfly stages:

$$X[k] = A[k] + W_N^k \cdot B[k]$$
$$X[k + N/2] = A[k] - W_N^k \cdot B[k]$$

where $W_N^k = e^{-j \frac{2\pi k}{N}} = \cos\left(\frac{2\pi k}{N}\right) - j \sin\left(\frac{2\pi k}{N}\right)$ represents the complex **twiddle factor rotation**.

```
A[k] ---------(+)--------------------------------------------> X[k]
                \       /
                 \     /
                  \   /  W_N^k (Complex Multiplication)
                   \ /
B[k] --------------(-)---------------------------------------> X[k + N/2]
```

### Levers for Approximate FFT Design:
1. **Twiddle Factor Pruning**: Rotations by small angles ($k \approx 0$ or $k \approx N/2$) where $W_N^k \approx 1$ or $-1$ are bypassed, replacing complex 4-multiplier units with direct pass-through wires.
2. **Inexact Butterfly Compressors**: Approximate 4:2 compressors are integrated into the internal real and imaginary MAC units.
3. **Stage-Skipping for Dynamic SNR**: In wireless communications, when channel conditions are favorable (high Signal-to-Noise Ratio), the later butterfly stages are deactivated to scale down dynamic power by up to $60\%$.

---

## 📊 Silicon PPA Comparison (8-Point 2D-DCT Core)

Synthesized on a TSMC 28nm CMOS standard cell library ($f_{\text{clk}} = 400\text{ MHz}$):

| DCT Architecture | Multipliers | Adders | Power ($\text{mW}$) | Area ($\mu\text{m}^2$) | JPEG PSNR (dB) | Energy Reduction |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Exact Loeffler DCT** | 16 | 26 | 3.48 | 8,420 | $\infty$ (Ref) | Baseline |
| **Bouguezel-Ahmad (BAS)** | **0** | 18 | 0.98 | 2,190 | 39.2 dB | **$+71.8\%$** |
| **Potluri 14-Adder DCT** | **0** | **14** | **0.76** | **1,740** | 38.6 dB | **$+78.1\%$** |
| **HEVC Tunable Approx DCT**| 4 | 20 | 1.35 | 3,210 | 42.1 dB | **$+61.2\%$** |

---

## 📚 Primary Literature & IEEE Citations

For researchers and students exploring original transform matrices, compression ratios, and silicon layouts:

- **Low-Complexity Approximate 8-Point DCT**:  
  U. S. Potluri, A. Madanayake, R. J. Cintra, F. M. Bayer, and S. Kulasekera, *"Improved 8-Point Approximate DCT for Image and Video Compression Requiring Only 14 Additions"*, IEEE Transactions on Circuits and Systems I: Regular Papers, [IEEE Xplore (DOI: 10.1109/tcsi.2013.2295022)](https://doi.org/10.1109/tcsi.2013.2295022).
- **Energy-Efficient Approximate DCT for Wireless Endoscopy**:  
  P. K. Meher, S. Y. Park, and B. K. Kaushik, *"An Energy-Efficient Approximate DCT for Wireless Capsule Endoscopy Applications"*, IEEE International Symposium on Circuits and Systems (ISCAS), [IEEE Xplore (DOI: 10.1109/ISCAS.2018.8351769)](https://doi.org/10.1109/ISCAS.2018.8351769).
- **Low-Power Approximate DCT for HEVC Video**:  
  F. Sampaio, B. Zatt, M. Porto, L. Agostini, and M. Shafique, *"Towards Low-Power Approximate DCT Architecture for HEVC Standard"*, IEEE/ACM Design, Automation & Test in Europe (DATE), [IEEE/ACM (DOI: 10.23919/date.2017.7927241)](https://doi.org/10.1109/date.2017.7927241).
- **Quality-Tunable Inexact FFT Accelerators**:  
  S. Narayanan, K. V. Palem, and V. Mooney, *"Highly Energy-Efficient and Quality-Tunable Inexact FFT Accelerators"*, IEEE Custom Integrated Circuits Conference (CICC), [IEEE Xplore (DOI: 10.1109/cicc.2014.6946047)](https://doi.org/10.1109/cicc.2014.6946047).
- **Approximate Floating-Point FFT for Speech & Radar**:  
  C. Zhang, P. Balasubramanian, and D. L. Maskell, *"Approximate Floating-Point FFT Design with Wide Precision Range and High Energy Efficiency"*, IEEE Transactions on Very Large Scale Integration (VLSI) Systems, [IEEE Xplore (DOI: 10.1109/TVLSI.2020.3015469)](https://doi.org/10.1109/TVLSI.2020.3015469).
