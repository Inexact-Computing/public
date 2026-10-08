# Approximate Dividers & Square Rooters

Division ($Q = N / D$) and square root ($S = \sqrt{X}$) are the most computationally demanding elementary arithmetic operations in hardware. While an addition executes in a single clock cycle and a multiplier takes $1$ to $3$ pipelined stages, **an exact 32-bit floating-point divider requires $25$ to $60$ clock cycles and substantial silicon area**.

In applications like computer vision, 3D graphic rendering, vector normalization, color space conversion, and wireless channel equalization, mathematical precision can be traded for single-cycle latency and order-of-magnitude energy savings.

---

## 🔬 The Sequential Division Bottleneck

Unlike addition or multiplication, division is fundamentally **sequential and non-associative**. In digit-recurrence algorithms (Restoring, Non-Restoring, and Sweeney-Robertson-Tocher / SRT division), hardware determines one quotient bit per iteration via trial subtraction:

$$R_{j+1} = 2 R_j - q_{j+1} D$$

```
                         Sequential Iteration Chain
  [ Step 0: Trial Sub ] ---> [ Step 1: Trial Sub ] ---> ... ---> [ Step 31: Final Sub ]
  (Latency = 32 Sequential Cycles | Cannot be parallelized across spatial silicon!)
```

Because quotient digit $q_{j+1}$ depends strictly on the sign of the partial remainder $R_{j+1}$, the hardware forms an un-pipelined dependency chain that stalls CPU execution pipelines.

---

## 🏛️ Comprehensive Approximate Divider Taxonomy

```mermaid
graph TD
    D[Approximate Dividers & Rooters] --> F1[1. Logarithmic Dividers]
    D --> F2[2. Piecewise Linear Reciprocal 1/D]
    D --> F3[3. Truncated Newton-Raphson]
    D --> F4[4. Pruned Radix-4 Squarers]

    F1 --> D1[LEAD: Logarithmic Exponent Divider<br/>ALM: Mitchell Log Converter<br/>Single-cycle latency via log subtraction]
    F2 --> D2[CADE: Direct Piecewise Linear 1/D<br/>Small LUT + 1 MAC Stage]
    F3 --> D3[1-Iteration Seed Refinement<br/>X_{k+1} = X_k * (2 - D * X_k)]
    F4 --> D4[Radix-4 Squarer Folded Matrix<br/>Diagonal symmetry pruning (a_i * a_j = a_j * a_i)]
```

---

## 📈 1. Logarithmic Dividers (LEAD & Mitchell's Algorithm)

Logarithmic dividers exploit the fundamental algebraic law that transforms division into subtraction:

$$\frac{N}{D} = 2^{\log_2(N) - \log_2(D)}$$

```
Operand N ---> [ Leading-One Detector ] ---> Log2(N) ---\
                                                         (-) ---> Diff ---> [ Antilog Converter ] ---> Quotient Q*
Operand D ---> [ Leading-One Detector ] ---> Log2(D) ---/
```

### Mitchell's Base-2 Logarithmic Approximation
Any positive binary integer $X$ can be expressed by its most significant non-zero bit (Leading One position $k$) and a fractional fraction $x \in [0, 1)$:

$$X = 2^k (1 + x)$$
$$\log_2(X) = k + \log_2(1 + x) \approx k + x \quad (\text{using the linear approximation } \log_2(1+x) \approx x)$$

### Error Curve & Correction
The approximation error $E(x) = \log_2(1+x) - x$ reaches a maximum of $\Delta_{\text{max}} = 0.08639$ ($11.1\%$ relative error) at $x \approx 0.4427$. Approximate dividers like **LEAD (Logarithmic Exponent Approximate Divider)** apply a 2-segment piecewise linear correction offset to reduce maximum relative error below **$1.8\%$** while completing the entire 32-bit division in **a single clock cycle ($<1.2\text{ ns}$)**!

---

## ⚡ 2. Piecewise Linear Reciprocal ($1/D$) & Multiplier Fusion

Instead of computing $N/D$ sequentially, the architecture decomposes division into reciprocal generation followed by a single multiplication:

$$\frac{N}{D} = N \times \left(\frac{1}{D}\right)$$

```
Divisor D ---> [ Range Normalizer ] ---> [ Piecewise Linear LUT (a_k, b_k) ] ---> Reciprocal (1/D)
                                                                                       |
Dividend N --------------------------------------------------------------------> [ Multiplier ] ---> Quotient Q*
```

The non-linear reciprocal curve $f(D) = 1/D$ is partitioned into 4, 8, or 16 uniform intervals. For an interval $k \le D < k+1$, the reciprocal is generated via a linear Taylor expansion:

$$\frac{1}{D} \approx a_k \cdot D + b_k$$

where constants $a_k$ and $b_k$ are stored in a micro-lookup table (LUT) requiring fewer than 100 logic gates.

---

## 🎯 3. Dedicated Approximate Squarers ($X^2$)

Squaring an $N$-bit number $A = \sum_{i=0}^{N-1} A_i 2^i$ using a generic $N \times N$ multiplier wastes hardware because symmetric off-diagonal partial products are identical:

$$A^2 = \left(\sum_{i=0}^{N-1} A_i 2^i\right)^2 = \sum_{i=0}^{N-1} A_i 2^{2i} + 2 \sum_{i=0}^{N-2} \sum_{j=i+1}^{N-1} A_i A_j 2^{i+j}$$

```
              Exact Multiplier Grid               Pruned Approximate Squarer
           A3   A2   A1   A0                        A3   A2   A1   A0
        x  A3   A2   A1   A0                     -----------------------------
        --------------------                     [ A3 ] [ A2 ] [ A1 ] [ A0 ]  (Diagonal Terms)
        a0a3 a0a2 a0a1 a0a0                       + Folded Symmetric Off-Diagonals
        a1a3 a1a2 a1a1 a1a0                       + Low-Order LSBs Pruned / Truncated!
        a2a3 a2a2 a2a1 a2a0                      -----------------------------
        a3a3 a3a2 a3a1 a3a0                      -> Saves 62% logic gates!
```

- **Diagonal Terms**: Since $A_i^2 = A_i$ for any binary digit $A_i \in \{0, 1\}$, diagonal products require zero AND gates.
- **Off-Diagonal Symmetries**: Terms $A_i A_j$ and $A_j A_i$ are identical; combining them into $(A_i A_j) \cdot 2^{i+j+1}$ eliminates **$50\%$ of the partial product generation gates**.
- **Pruning**: In approximate squarers, low-order columns ($i+j < N/2$) are eliminated or replaced by constant compensation terms, saving **up to $65\%$ area and power**.

---

## 📊 Silicon PPA Comparison (32-Bit Unsigned Dividers)

Synthesized on a 28nm standard cell CMOS library ($f_{\text{clk}} = 800\text{ MHz}$):

| Divider Architecture | Latency (Cycles) | Critical Delay (ns) | Power ($\text{mW}$) | Area ($\mu\text{m}^2$) | Mean Relative Error ($MRED$) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Exact Non-Restoring Array** | 32 | 14.8 | 6.42 | 5,820 | $0.00\%$ |
| **Exact Radix-4 SRT Divider** | 16 | 8.2 | 8.15 | 8,940 | $0.00\%$ |
| **LEAD Logarithmic Divider** | **1** | **0.95** | **1.24** | **1,410** | $1.42\%$ |
| **Piecewise Linear $1/D$** | **2** | **1.35** | **1.86** | **1,950** | $0.85\%$ |
| **Truncated Newton-Raphson** | 3 | 2.10 | 2.45 | 3,120 | $0.21\%$ |

> [!TIP]
> Logarithmic and piecewise approximate dividers achieve a **$16\times$ to $32\times$ reduction in cycle latency** and **over $75\%$ energy savings**, making them ideal for high-throughput edge AI inference and real-time graphics shader pipelines.

---

## 📚 Primary Literature & IEEE Citations

For researchers and students exploring original circuit schematics, logarithmic proofs, and silicon test chips:

- **Piecewise Linear Logarithmic Dividers (LEAD)**:  
  H. Jiang, L. Liu, P. Balasubramanian, and F. Lombardi, *"LEAD: Logarithmic Exponent Approximate Divider for Image Quantization Applications"*, ACM/IEEE Great Lakes Symposium on VLSI (GLSVLSI), [ACM/IEEE (DOI: 10.1145/3526241.3530323)](https://doi.org/10.1145/3526241.3530323).
- **Newton-Raphson Approximate Dividers**:  
  S. Shin, Y. Lee, and M. Sunwoo, *"A Newton-Raphson Method-Based Approximate Divider Design for Color Quantization"*, IEEE International SoC Design Conference (ISOCC), [IEEE Xplore (DOI: 10.1109/isocc53507.2021.9613961)](https://doi.org/10.1109/isocc53507.2021.9613961).
- **Adaptive Unsigned Dynamic Dividers**:  
  C. Chen, J. Han, and W. Liu, *"Adaptive Approximation in Arithmetic Circuits: A Low-Power Unsigned Divider Design"*, IEEE/ACM Design, Automation & Test in Europe (DATE), [IEEE/ACM (DOI: 10.23919/date.2018.8342233)](https://doi.org/10.23919/date.2018.8342233).
- **Approximate Radix-4 Squarers**:  
  J. Chen, P. Ndai, and J. C. Lo, *"A Low-Power High-Performance Radix-4 Approximate Squaring Circuit"*, IEEE International Conference on Application-Specific Systems, Architectures and Processors (ASAP), [IEEE Xplore (DOI: 10.1109/asap.2009.35)](https://doi.org/10.1109/asap.2009.35).
- **Exact and Approximate Squarers for Error-Tolerant Computing**:  
  P. Balasubramanian, D. L. Maskell, and N. E. Mastorakis, *"Exact and Approximate Squarers for Error-Tolerant Applications"*, IEEE Transactions on Computers, [IEEE Xplore (DOI: 10.1109/tc.2022.3228592)](https://doi.org/10.1109/tc.2022.3228592).
