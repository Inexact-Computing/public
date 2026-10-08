# Approximate CORDIC Architectures & Vector Computations

The **Coordinate Rotation Digital Computer (CORDIC)**, originally introduced by Jack Volder in 1959 and generalized by J. S. Walther in 1971, is an iterative algorithm designed to calculate **trigonometric functions ($\sin, \cos, \tan, \arctan$), hyperbolic functions ($\sinh, \cosh, \tanh$), square roots ($\sqrt{x}$), coordinate conversions (Cartesian $\leftrightarrow$ Polar), and 2D/3D rotations** using exclusively **shift-and-add operations without silicon multipliers**.

CORDIC is widely used in radar signal processing, 5G wireless digital beamforming, robotics kinematics, and neuromorphic edge processors.

---

## 🧭 Mathematical Foundations: Givens Rotation to Shift-Add

A 2D plane coordinate rotation of vector $\mathbf{v} = \begin{bmatrix} X \\ Y \end{bmatrix}$ through angle $\theta$ is defined by the orthogonal rotation matrix:

$$\begin{bmatrix} X' \\ Y' \end{bmatrix} = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix} \begin{bmatrix} X \\ Y \end{bmatrix} = \cos\theta \begin{bmatrix} 1 & -\tan\theta \\ \tan\theta & 1 \end{bmatrix} \begin{bmatrix} X \\ Y \end{bmatrix}$$

```
                Y ^
                  |           v' = (X', Y')
                  |          /
                  |         /  Angle θ
                  |        / _-~
                  |       / ~
                  |      v = (X, Y)
                  |     /
                  +--------------------> X
```

### Eliminating the Multipliers
To eliminate the continuous multiplications of $\tan\theta$, Colder and Walther restricted each elementary micro-rotation step $i$ to predefined angles $\theta_i$ whose tangents are exact negative powers of two:

$$\tan(\theta_i) = 2^{-i} \implies \theta_i = \arctan(2^{-i})$$

Factoring out the cosine scaling term, the iterative coordinate transformation becomes pure bitwise shifts and additions:

$$X_{i+1} = X_i - d_i \cdot (Y_i \cdot 2^{-i}) = X_i - d_i \cdot (Y_i \gg i)$$
$$Y_{i+1} = Y_i + d_i \cdot (X_i \cdot 2^{-i}) = Y_i + d_i \cdot (X_i \gg i)$$
$$Z_{i+1} = Z_i - d_i \cdot \theta_i$$

where $d_i \in \{+1, -1\}$ is the rotation direction decision at step $i$, and $Z_i$ represents the angle accumulator (residual angle).

---

## 📐 Predefined Micro-Angle Lookup Table

| Step $i$ | Shift $2^{-i}$ | Elementary Angle $\theta_i = \arctan(2^{-i})$ (Deg) | Elementary Angle $\theta_i$ (Radians) | Scaling Term $\frac{1}{\sqrt{1 + 2^{-2i}}}$ |
| :---: | :---: | :---: | :---: | :---: |
| 0 | $2^0 = 1.0$ | $45.0000^\circ$ | $0.785398$ | $0.707107$ |
| 1 | $2^{-1} = 0.5$ | $26.5651^\circ$ | $0.463648$ | $0.894427$ |
| 2 | $2^{-2} = 0.25$ | $14.0362^\circ$ | $0.244979$ | $0.970143$ |
| 3 | $2^{-3} = 0.125$ | $7.1250^\circ$ | $0.124355$ | $0.992278$ |
| 4 | $2^{-4} = 0.0625$ | $3.5763^\circ$ | $0.062419$ | $0.998053$ |
| 5 | $2^{-5} = 0.03125$ | $1.7899^\circ$ | $0.031240$ | $0.999512$ |
| 6 | $2^{-6} = 0.015625$ | $0.8952^\circ$ | $0.015624$ | $0.999878$ |
| 7 | $2^{-7} = 0.0078125$ | $0.4476^\circ$ | $0.007812$ | $0.999969$ |

At each stage, rotating by $\theta_i$ inflates the vector magnitude by a factor of $\sqrt{1 + 2^{-2i}}$. After $N$ iterations, the cumulative scaling factor converges to a universal constant:

$$K = \prod_{i=0}^{N-1} \frac{1}{\sqrt{1 + 2^{-2i}}} \xrightarrow{N \to \infty} 0.607252935008881...$$

---

## 🧭 Interactive Lab: CORDIC Rotation Wheel

Experiment with rotating a 2D vector using shift-add iterations below. Notice how **4 or 5 iterations** capture over $99.5\%$ of the total angular displacement:

<iframe
  src="../../labs/cordic-rotation-visualizer.html"
  title="CORDIC Angle Rotation Visualizer"
  style="width: 100%; height: 480px; border: none; background: transparent; margin: 12px 0;"
  loading="lazy"
></iframe>

---

## 🔄 Dual Operating Modes of CORDIC

CORDIC hardware operates in two distinct mathematical modes depending on which signal is driven to zero:

```mermaid
graph TD
    C[CORDIC Engine] --> M1[1. Rotation Mode]
    C --> M2[2. Vectoring Mode]

    M1 --> O1[Goal: Drive Angle Residual Z -> 0<br/>d_i = sign(Z_i)<br/>Output X = K(X0 cos θ - Y0 sin θ)<br/>Output Y = K(X0 sin θ + Y0 cos θ)]
    M2 --> O2[Goal: Drive Y-Coordinate Y -> 0<br/>d_i = -sign(Y_i)<br/>Output X = K sqrt(X0^2 + Y0^2)<br/>Output Z = Z0 + arctan(Y0 / X0)]
```

1. **Rotation Mode ($Z \to 0$)**: Evaluates trigonometric sine and cosine functions, polar-to-Cartesian conversion, and DSP matrix rotations (e.g. Givens rotations for QR decomposition).
2. **Vectoring Mode ($Y \to 0$)**: Computes vector magnitudes ($\sqrt{X^2 + Y^2}$), phase angles ($\arctan(Y/X)$), and Cartesian-to-polar transformations.

---

## ⚡ Approximate Levers in CORDIC Hardware

Standard exact CORDIC requires $N$ sequential clock cycles, $3 \times N$ registers, and dedicated scale-factor multiplier circuits. Approximate CORDIC architectures break these bottlenecks across three dimensions:

```
+-------------------------------------------------------------------------+
|                  APPROXIMATE CORDIC HARDWARE LEVERS                     |
+-------------------------------------------------------------------------+
| 1. Adaptive Early Termination (AET):                                    |
|    Halt computation when |Z_i| < ε, saving up to 50% dynamic energy.     |
| 2. Multiplier-Free Scale-Factor (K) Folding:                            |
|    Approximate K ≈ 5/8 (0.625) or Canonical Signed Digit (CSD) constants|
| 3. Angle Quantization (AQ) & Micro-Rotation Skipping:                   |
|    Selectively skip inactive iteration stages where d_i = 0             |
| 4. Truncated Bitwidth & Inexact Adders in Accumulator Datapaths:        |
|    Replace lower adder bits with LOA/AXA cells for high-order stages.   |
+-------------------------------------------------------------------------+
```

### 1. Scale-Factor ($K$) Approximation Schemes
In exact CORDIC, restoring the final magnitude requires multiplying $X_N$ and $Y_N$ by $K = 0.607253$. Approximate designs replace this costly hardware multiplier with hardwired shift-and-add Canonical Signed Digit (CSD) trees:

- **1-Shift Approximation**: $K \approx \frac{5}{8} = 0.625 = 2^{-1} + 2^{-3}$ (Error: $+2.92\%$, Zero multipliers).
- **3-Shift Approximation**: $K \approx 1 - 2^{-2} - 2^{-4} - 2^{-7} = 0.607421875$ (Error: $<0.028\%$, 3 additions).
- **Scale-Free CORDIC**: Modifying the iteration recurrence so that $K \equiv 1.0$ through dynamic micro-angle expansion.

### 2. Hyperbolic CORDIC for Neuromorphic Spiking Neurons
By changing the coordinate metric $m = -1$, CORDIC calculates hyperbolic functions ($\sinh, \cosh, \exp, \ln$):

$$X_{i+1} = X_i + d_i \cdot Y_i \cdot 2^{-i}$$
$$Y_{i+1} = Y_i + d_i \cdot X_i \cdot 2^{-i}$$
$$Z_{i+1} = Z_i - d_i \cdot \operatorname{arctanh}(2^{-i})$$

In neuromorphic engineering, solving biological membrane potential differential equations (e.g., the **FitzHugh-Nagumo** or **Izhikevich neuron model**) requires computing exponential activations and phase plane trajectories. Low-power approximate hyperbolic CORDIC units enable **millions of artificial spiking neurons** on a single edge silicon die consuming less than $15\text{ mW}$.

---

## 📊 Silicon PPA Tradeoffs (16-Bit CORDIC Core)

Synthesized on a 28nm standard cell CMOS process ($f_{\text{clk}} = 500\text{ MHz}$):

| CORDIC Architecture | Total Iterations | Mean Angular Error | Power ($\text{mW}$) | Area ($\mu\text{m}^2$) | Speedup / Latency |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Exact 16-Stage CORDIC** | 16 | $0.001^\circ$ | 1.84 | 4,210 | 16 cycles (Baseline) |
| **Adaptive Early Termination (AET)**| 6–9 (avg 7.2) | $0.18^\circ$ | 0.92 | 4,450 | **$2.2\times$ faster** |
| **Angle-Quantized CORDIC (AQ)** | 8 (fixed) | $0.32^\circ$ | 0.81 | 2,180 | **$2.0\times$ faster** |
| **Multiplication-Free Scaled CORDIC** | 8 (fixed) | $0.45^\circ$ | 0.64 | 1,720 | **$2.0\times$ faster, $65\%$ power saved** |

---

## 📚 Primary Literature & IEEE Citations

For researchers and students exploring original derivations, convergence proofs, and VLSI silicon designs:

- **Fully Parallel Approximate CORDIC**:  
  P. K. Meher and S. Y. Park, *"Algorithm and Design of a Fully Parallel Approximate Coordinate Rotation Digital Computer"*, IEEE Transactions on Multi-Scale Computing Systems (TMSCS), [IEEE Xplore (DOI: 10.1109/TMSCS.2017.2696003)](https://doi.org/10.1109/TMSCS.2017.2696003).
- **Scaling-Free Folded Hyperbolic CORDIC**:  
  Y. Li, H. Jiang, L. Liu, P. Balasubramanian, and F. Lombardi, *"An Efficient Scaling-Free Folded Hyperbolic CORDIC Design Using a Novel Low-Complexity Recurrence"*, IEEE Transactions on Very Large Scale Integration (VLSI) Systems, [IEEE Xplore (DOI: 10.1109/TVLSI.2023.3281078)](https://doi.org/10.1109/TVLSI.2023.3281078).
- **Angle-Quantized CORDIC for Edge Computing**:  
  Y. Gao, Z. Yang, and Y. Wang, *"A Configurable CORDIC and p-SADIC Fusion Architecture for Nonlinear Edge Computing"*, IEEE International Conference on Integrated Circuits and Microsystems (ICICM), [IEEE Xplore (DOI: 10.1109/icicm63644.2024.10814567)](https://doi.org/10.1109/icicm63644.2024.10814567).
- **Low-Power Neuromorphic CORDIC for FitzHugh-Nagumo Neurons**:  
  K. S. Sravan, P. K. Meher, and B. K. Kaushik, *"Low-Power Hyperbolic CORDIC Design of the FitzHugh-Nagumo Neuron for Neuromorphic Applications"*, IEEE Transactions on Very Large Scale Integration (VLSI) Systems, [IEEE Xplore (DOI: 10.1109/TVLSI.2021.3092254)](https://doi.org/10.1109/TVLSI.2021.3092254).
- **High-Throughput CORDIC Architectures for DSP Applications**:  
  J. S. Walther, *"A Unified Algorithm for Elementary Functions"*, AFIPS Spring Joint Computer Conference, [ACM/IEEE (DOI: 10.1145/1478786.1478840)](https://doi.org/10.1145/1478786.1478840).
