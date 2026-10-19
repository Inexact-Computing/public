# Approximate Transforms: DCT & FFT

Transform algorithms translate digital signals between the **spatial/time domain** and the **frequency domain**. They form the core computational engine of modern communication, multimedia processing, and biomedical telemetry:

- **Discrete Cosine Transform (DCT)**: Used in JPEG and transform coding; H.264/AVC and H.265/HEVC employ specified integer DCT-like transforms, rather than a literal floating-point DCT kernel.
- **Fast Fourier Transform (FFT)**: Efficiently evaluates a DFT, for example in OFDM processing and spectral analysis.

Transform approximation changes the output spectrum. Its acceptability depends on the signal, quantization and application quality metric; perceptual tolerance does not guarantee that discarded frequencies or arithmetic errors are harmless.

**New here?** You need averages and adding and subtracting negative numbers. No trigonometry, matrices or complex numbers are needed for this first part. It goes from "a row of eight numbers" to "how a transform describes them, and what an approximate transform changes". Material marked *Going deeper*, including the cosine formula, matrices and the FFT, is the original reference part of this page and is optional on a first read.

**After this first part you can:**

1. describe eight numbers as their mean plus fluctuations, and say what a coefficient measures;
2. compute by hand the eight coefficients of an approximate transform that uses only additions and subtractions, and rebuild the numbers from them;
3. explain what dropping coefficients does to the rebuilt numbers, and why an operation count is neither a count of adders nor an energy.

<a id="trf-start"></a>

## Start here: eight brightness values

Take eight neighbouring pixels across an edge, from a dark area to a brighter one (brightness on the usual 0–255 scale). Number the positions 0 to 7 from left to right:

| Position | Value | Value − mean (15) |
|---:|---:|---:|
| 0 | 10 | −5 |
| 1 | 10 | −5 |
| 2 | 10 | −5 |
| 3 | 10 | −5 |
| 4 | 20 | +5 |
| 5 | 20 | +5 |
| 6 | 20 | +5 |
| 7 | 20 | +5 |

The **mean** is 120 ÷ 8 = 15. What is left, the **fluctuation**, says "darker on the left, brighter on the right". A transform describes the eight numbers as *how much of each of eight fixed patterns* they contain. Each "how much" is a **coefficient**. Pattern 0 is flat and measures the mean; the others measure different ways of going up and down.

### Patterns made of +1, −1 and 0

The exact DCT uses cosine-shaped patterns; pattern 1, for example, is 0.981, 0.831, 0.556, 0.195, −0.195, −0.556, −0.831, −0.981. Multiplying by such numbers is costly. The approximate transform of [Potluri et al.](#the-potluri-et-al-14-addition-8-point-transform) replaces every pattern by one made only of +1, −1 and 0. Each row below lists where a pattern has +1 and where it has −1; every other position is 0:

| Pattern | +1 at positions | −1 at positions | Nonzero entries |
|---:|---|---|---:|
| 0 | 0, 1, 2, 3, 4, 5, 6, 7 | none | 8 |
| 1 | 1 | 6 | 2 |
| 2 | 0, 7 | 3, 4 | 4 |
| 3 | 0 | 7 | 2 |
| 4 | 0, 3, 4, 7 | 1, 2, 5, 6 | 8 |
| 5 | 3 | 4 | 2 |
| 6 | 2, 5 | 1, 6 | 4 |
| 7 | 2 | 5 | 2 |

These are the eight rows of the matrix \(\mathbf T_8\) in the reference section.

A coefficient is a matching score: multiply each value by the pattern entry below it and add. With entries of +1, −1 and 0, that means: add the values under +1, subtract those under −1, skip those under 0.

**Predict first:** which patterns will score 0 for the edge row, and what does pattern 0 score?

<details markdown="1">
<summary>Check the eight coefficients</summary>

| Pattern | Calculation | Coefficient |
|---|---|---:|
| 0 | 10 + 10 + 10 + 10 + 20 + 20 + 20 + 20 | 120 |
| 1 | value(1) − value(6) = 10 − 20 | −10 |
| 2 | 10 − 10 − 20 + 20 | 0 |
| 3 | value(0) − value(7) = 10 − 20 | −10 |
| 4 | 10 − 10 − 10 + 10 + 20 − 20 − 20 + 20 | 0 |
| 5 | value(3) − value(4) = 10 − 20 | −10 |
| 6 | −10 + 10 + 20 − 20 | 0 |
| 7 | value(2) − value(5) = 10 − 20 | −10 |

Pattern 0 gives 120 = 8 × the mean. Patterns 2, 4 and 6 are mirror-symmetric (the same read from either end) and score 0, because the edge row is "low then high", not symmetric. The edge shows up in patterns 1, 3, 5 and 7.

</details>

<a id="trf-rebuild"></a>

### Rebuilding the numbers from the coefficients

These patterns do not overlap in a way that confuses them (in technical terms, they are orthogonal). So each one can be put back separately: divide its coefficient by its number of nonzero entries, multiply the pattern by the result, and add everything up. Pattern 0 gives 120 ÷ 8 = 15 at every position; pattern 1 gives −10 ÷ 2 = −5, so −5 at position 1 and +5 at position 6; and so on.

Compression keeps only some coefficients. Keeping the first ones, as JPEG-like coding does in two dimensions:

| Coefficients kept | Rebuilt values | Positions wrong | Largest error |
|---|---|---:|---:|
| Pattern 0 only | 15 15 15 15 15 15 15 15 | 8 | 5 |
| Patterns 0–3 | 10 10 15 15 15 15 20 20 | 4 | 5 |
| All eight | 10 10 10 10 20 20 20 20 | 0 | 0 |

With fewer coefficients the sharp edge turns into a softer step. Which coefficients can be dropped without visible harm depends on the image, the quantization and the quality measure; this one row proves nothing general.

<details markdown="1">
<summary>Optional: compare with the exact DCT for the same row</summary>

Both rows below are scaled so that each pattern has length 1 (the orthonormal scaling). Exact values use the cosine formula in the reference section; approximate values are the coefficients above divided by the square root of each pattern's nonzero count:

| Coefficient | Exact DCT | Potluri approximation |
|---:|---:|---:|
| 0 | 42.43 | 42.43 |
| 1 | −12.81 | −7.07 |
| 2 | 0 | 0 |
| 3 | 4.50 | −7.07 |
| 4 | 0 | 0 |
| 5 | −3.01 | −7.07 |
| 6 | 0 | 0 |
| 7 | 2.55 | −7.07 |

The mean term agrees. The exact DCT puts most of the edge into coefficient 1; the approximation spreads it evenly over 1, 3, 5 and 7. For this one row, keeping coefficients 0–3 therefore loses more with the approximation (dropped squared size 100) than with the exact DCT (about 15.6). One row is not an image set; the [published quality table](#published-dct-comparison) reports averages over 45 images under its own conditions.

</details>

<a id="trf-count"></a>

### Counting operations

Computing each coefficient separately takes 7 + 1 + 3 + 1 + 7 + 1 + 3 + 1 = 24 additions and subtractions. Potluri's fast version reuses intermediate sums and needs **14**. The exact DCT computed straight from its definition needs 8 multiplications and 7 additions for each of the eight outputs: 64 and 56. An 8 × 8 block applies the eight-point transform to 8 rows and then 8 columns, so 16 × 14 = 224 additions and subtractions.

These are **operation counts** for one stated algorithm. A circuit may reuse one adder 14 times or build 14 adders; the scaling by square roots is not counted and may be folded into quantization; and energy depends on bit widths, switching activity and the circuit. The [published hardware table](#published-dct-comparison) shows what one synthesis study measured instead.

### Check your understanding

Answer on paper first, then open the check. Your answers are not saved or sent anywhere.

<a id="trf-q1"></a>

**Question TRF-1.** A flat row has the value 12 at all eight positions. What are its eight coefficients?

<a id="trf-q2"></a>

**Question TRF-2.** For the edge row 10 10 10 10 20 20 20 20, keep only patterns 0 and 1. What are the rebuilt values?

<a id="trf-q3"></a>

**Question TRF-3.** "Potluri needs 14 operations and the direct exact DCT 120, so the approximate chip uses about one-ninth of the energy." What is wrong with this?

<details markdown="1">
<summary>Check questions TRF-1 to TRF-3</summary>

**TRF-1.** 96 for pattern 0 (8 × 12) and 0 for all the others: every other pattern has as many +1s as −1s, so a flat row cancels out. A flat row has a mean and no fluctuation.

**TRF-2.** Pattern 0 gives 15 everywhere; pattern 1 adds −5 at position 1 and +5 at position 6. Result: 15 10 15 15 15 15 20 15.

- Adding −10 instead of −10 ÷ 2 = −5 forgets to divide by the pattern's two nonzero entries.

**TRF-3.** Operation counts are not energy, and the two counts are not even for the same kind of operation (no multiplications versus 64). The comparison also leaves out normalization, memory, control and bit widths. The fast exact Arai algorithm needs only 34 operations, so "120" is not the fair exact baseline either. The published synthesis study reports about 8.85% less area and 6.23% shorter critical path than another approximation (BAS-2008) at 45 nm, not a ninefold energy saving.

</details>

---

## Going deeper

Everything below is the original reference material for this page. It is not needed for the questions above.

- [DCT foundations](#discrete-cosine-transform-dct-foundations): the cosine formula, the 8 × 8 frequency layout and the matrix form
- [Multiplication-free approximate DCTs](#multiplication-free-approximate-dct-architectures), including [the Potluri kernel, its normalization and operation table](#the-potluri-et-al-14-addition-8-point-transform)
- [Approximate FFT and twiddle factors](#approximate-fast-fourier-transform-fft-twiddle-factors) (complex numbers)
- [Comparison conditions](#comparison-conditions), the [published hardware and quality tables](#published-dct-comparison) and [primary literature](#primary-literature-ieee-citations)

---

## 📸 Discrete Cosine Transform (DCT) Foundations

The 2D Discrete Cosine Transform (2D-DCT-II) maps an $N \times N$ matrix of spatial pixels $f(x, y)$ into frequency coefficients $F(u, v)$:

$$F(u, v) = \frac{2 C(u) C(v)}{N} \sum_{x=0}^{N-1} \sum_{y=0}^{N-1} f(x, y) \cos\left[ \frac{(2x + 1)u \pi}{2N} \right] \cos\left[ \frac{(2y + 1)v \pi}{2N} \right]$$

where $C(k) = \frac{1}{\sqrt{2}}$ for $k=0$, and $C(k) = 1$ for $k > 0$. This orthonormal scaling applies to any positive integer $N$; for $N=8$, the prefactor is $C(u)C(v)/4$.

```
+-------------------------------------------------------------------+
|               8 x 8 2D-DCT FREQUENCY DISTRIBUTION                 |
+-------------------------------------------------------------------+
| [ DC  F01 F02 F03 F04 F05 F06 F07 ]  v increases to the right      |
| [ F10 F11 F12 F13 F14 F15 F16 F17 ]                               |
| [ F20 F21 F22 ...                 ]  u increases downwards        |
| [ ...                             ]                               |
| [ F60 F61 ...                     ]  DC is at the top-left        |
| [ F70 F71 F72 F73 F74 F75 F76 F77 ]                               |
| Frequencies vary on both axes; importance depends on the image.   |
+-------------------------------------------------------------------+
```

Using separability, the 2D-DCT is calculated by applying a 1D-DCT across rows followed by a 1D-DCT across columns:

$$\mathbf{F} = \mathbf{C} \cdot \mathbf{f} \cdot \mathbf{C}^T$$

---

## 🏛️ Multiplication-Free Approximate DCT Architectures

An exact 8-point 1D-DCT transform matrix $\mathbf{C}_8$ contains irrational trigonometric constants:

$$\cos\left(\frac{\pi}{16}\right) \approx 0.98078528, \quad \sin\left(\frac{\pi}{16}\right) \approx 0.19509032, \quad \cos\left(\frac{3\pi}{16}\right) \approx 0.83147$$

Some approximate DCT architectures restrict coefficients to a small set such as $\{0,\pm1,\pm2,\pm\frac12\}$ so that operations can use shifts and additions. This is not a description of every design: the coefficient set, normalization and method of searching for a kernel depend on the particular algorithm.

### The Potluri et al. 14-Addition 8-Point Transform
Potluri et al. (2014; author manuscript, Section 4, p. 8) propose the following unnormalized kernel. It is distinct from the Bouguezel–Ahmad–Swamy (BAS) family:

$$\mathbf{T}_8 = \begin{bmatrix}
 1 &  1 &  1 &  1 &  1 &  1 &  1 &  1 \\
 0 &  1 &  0 &  0 &  0 &  0 & -1 &  0 \\
 1 &  0 &  0 & -1 & -1 &  0 &  0 &  1 \\
 1 &  0 &  0 &  0 &  0 &  0 &  0 & -1 \\
 1 & -1 & -1 &  1 &  1 & -1 & -1 &  1 \\
 0 &  0 &  0 &  1 & -1 &  0 &  0 &  0 \\
 0 & -1 &  1 &  0 &  0 &  1 & -1 &  0 \\
 0 &  0 &  1 &  0 &  0 & -1 &  0 &  0
\end{bmatrix}$$

The normalized approximation is $\widehat{\mathbf C}_8=\mathbf D\mathbf T_8$, where

$$\mathbf D=\operatorname{diag}(1/\sqrt8,1/\sqrt2,1/2,1/\sqrt2,1/\sqrt8,1/\sqrt2,1/2,1/\sqrt2).$$

The kernel requires 14 additions/subtractions and no multiplications or shifts in its fast factorization (Table 1, manuscript p. 10). These counts exclude normalization, which can be absorbed into quantization in a JPEG-like pipeline. Applying the 1D kernel to eight rows and eight columns takes $16\times14=224$ additions/subtractions per $8\times8$ block; this is an operation count, not a count of physical adders. Quality depends on images, coefficient retention and quantization; no universal PSNR or power saving is implied.

Selected counts from Potluri et al., Table 1, compare **one 8-point 1D transform**, excluding normalization:

| Algorithm | Multiplications | Additions/subtractions | Shifts | Total operations |
| :--- | ---: | ---: | ---: | ---: |
| Exact DCT, direct definition | 64 | 56 | 0 | 120 |
| Arai exact fast algorithm | 5 | 29 | 0 | 34 |
| BAS-2008 approximation | 0 | 18 | 2 | 20 |
| Potluri proposed approximation | 0 | 14 | 0 | 14 |

The direct count follows eight outputs, each with eight products and seven sums. Counting unlike operations equally is a complexity convention, not a power or energy model.

---

## 📡 Approximate Fast Fourier Transform (FFT) & Twiddle Factors

In the Cooley-Tukey Radix-2 decimation-in-time (DIT) FFT algorithm, an $N=2^m$-point Discrete Fourier Transform uses $m$ butterfly stages. At the top-level split, $A[k]$ and $B[k]$ are the $N/2$-point DFTs of even and odd input samples, for $0\le k<N/2$:

$$X[k] = A[k] + W_N^k \cdot B[k]$$

$$X[k + N/2] = A[k] - W_N^k \cdot B[k]$$

where $W_N^k = e^{-j \frac{2\pi k}{N}} = \cos\left(\frac{2\pi k}{N}\right) - j \sin\left(\frac{2\pi k}{N}\right)$ represents the complex **twiddle factor rotation**.

Each butterfly multiplies $B[k]$ by $W_N^k$ before adding/subtracting that same product to/from $A[k]$. A radix-2 FFT has $(N/2)\log_2N$ butterflies and $N\log_2N$ complex additions/subtractions. A naive implementation assigns one complex multiplication to each butterfly, but $1,-1,\pm j$ need only sign changes or component swaps, and other factorizations change the real arithmetic count. The textbook complex product uses four real multiplications and two real additions; that is not a universal hardware lower bound.

### Levers for Approximate FFT Design:
1. **Twiddle approximation**: Replace selected $W$ by $\widetilde W$ only with an error budget. For a butterfly, $\Delta X[k]=(\widetilde W-W)B[k]$ and $\Delta X[k+N/2]=-(\widetilde W-W)B[k]$ before subsequent stages. Near $-1$, a sign reversal is needed, not a pass-through. Even a small angle error can matter for large $|B[k]|$.
2. **Inexact arithmetic**: Reducing multiplier or adder precision changes rounding and error propagation; compressors apply only where that multiplier structure uses them.
3. **Output pruning**: Removing operations is justified only by a specified subset of outputs and its dependency graph. Disabling complete later stages does not in general compute the intended DFT, regardless of channel SNR.

---

## 📊 Comparison Conditions

Compare transform kernels, normalized transforms and codec pipelines separately. A hardware comparison needs process, voltage, precision, throughput, switching workload and quality settings. An exact transform followed by lossy quantization does not generally produce infinite reconstruction PSNR. The operation counts above do not establish silicon power, area or energy savings.

<a id="published-dct-comparison"></a>

### Published Hardware and Quality Examples

Potluri et al., Table 4 and Section 6.3, report **2D architectures synthesized using FreePDK 45 nm at 1.1 V**, with input word length $L=8$. These are synthesis estimates, not fabricated-chip measurements:

| Transform architecture | Gates | Area (mm²) | Critical path (ns) | Reported maximum frequency (MHz) |
| :--- | ---: | ---: | ---: | ---: |
| BAS-2008 | 44,654 | 0.192 | 1.204 | 830.6 |
| Potluri proposed | 40,705 | 0.175 | 1.129 | 885.7 |

From these rounded table values, area and critical-path delay decrease by approximately 8.85% and 6.23%, respectively, relative to BAS-2008. Power columns remain omitted because the original Table 5 power-unit labeling has not been resolved.

Separately, Table 2 reports **JPEG-like software reconstruction** for 45 grayscale 512 × 512, 8-bit images. Each 8 × 8 block retains its first $r=10$ zigzag coefficients. The averages below are not measurements at the hardware operating point above:

| Transform | Average PSNR (dB) | Average UQI |
| :--- | ---: | ---: |
| Exact DCT | 28.336 | 0.733 |
| BAS-2008 | 27.245 | 0.686 |
| Potluri proposed | 25.726 | 0.586 |

Here the proposed transform trades lower reported hardware cost for lower reconstruction quality than BAS-2008. The two tables do not establish end-to-end codec energy or a universal quality ranking. [Source: author manuscript, Tables 1, 2 and 4; Sections 5.2.3 and 6.3](https://arxiv.org/pdf/1501.02995).

---

## 📚 Primary Literature & IEEE Citations

- U. S. Potluri, A. Madanayake, R. J. Cintra, F. M. Bayer, S. Kulasekera, and A. Edirisuriya, *"Improved 8-Point Approximate DCT for Image and Video Compression Requiring Only 14 Additions"*, IEEE Transactions on Circuits and Systems I: Regular Papers, 61(6), 1727–1740, 2014. [DOI: 10.1109/TCSI.2013.2295022](https://doi.org/10.1109/TCSI.2013.2295022); [author manuscript](https://arxiv.org/pdf/1501.02995). Section 4 specifies the kernel and normalization; Table 1 counts the 1D unnormalized arithmetic.
- J. W. Cooley and J. W. Tukey, *"An Algorithm for the Machine Calculation of Complex Fourier Series"*, Mathematics of Computation, 19(90), 297–301, 1965. [DOI: 10.1090/S0025-5718-1965-0178586-1](https://doi.org/10.1090/S0025-5718-1965-0178586-1); [original paper scan](https://www.cs.jhu.edu/~misha/ReadingSeminar/Papers/Cooley65.pdf).
