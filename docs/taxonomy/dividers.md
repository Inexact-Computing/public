# Approximate Dividers & Square Rooters

Division ($\div$) and square root ($\sqrt{x}$) are the most computationally intensive elementary arithmetic operations in hardware. While an addition takes $1$ clock cycle and a multiplier takes $1$ to $3$ cycles, **an exact divider often requires 30 to 60 clock cycles**.

In modern applications like 3D graphics rendering, computer vision, color quantization, and wireless signal equalization, 100% exact division is rarely needed.

---

## 🔬 Why Division is So Hard in Silicon

In elementary school, you learned **long division**: you look at the divisor, guess the quotient digit, multiply, subtract, and bring down the next digit.

Hardware does the exact same thing in binary (called a **Restoring or Non-Restoring Array Divider**):

```
       Quotient: Q = 0 1 1 0  (6)
Divisor: 3  |  1 0 0 1 0  (Dividend = 18)
             - 0 0 1 1
             ---------
               0 0 1 1 0
             - 0 0 0 1 1
             ---------
                       0  (Remainder = 0)
```

Because each step depends strictly on the subtraction result of the previous step, **it cannot be parallelized**. This creates huge latency and power consumption.

---

## 🏛️ Major Families of Approximate Dividers

```mermaid
graph TD
    D[Approximate Dividers] --> M1[1. Logarithmic Conversion]
    D --> M2[2. Piecewise Linear Reciprocal 1/D]
    D --> M3[3. Newton-Raphson Truncation]
    D --> M4[4. Diagonal Squarer Pruning]

    M1 --> D1[LEAD & ALM: log2(N) - log2(D)]
    M2 --> D2[CADE: 1-cycle piecewise linear 1/D]
    M3 --> D3[Iterative root refinement with 1 iteration]
    M4 --> D4[Radix-4 Squarers: Eliminating symmetric partial products]
```

### 1. Logarithmic Dividers (LEAD / Log-Subtraction)
- **The Concept**: By the laws of logarithms:
  $$\log_2\left(\frac{N}{D}\right) = \log_2(N) - \log_2(D)$$
- **The Hardware**: Instead of a slow 32-step division loop, the circuit calculates approximate base-2 logs using a **Leading-One Detector (LOD)**, subtracts the exponents using a fast 1-cycle subtractor, and takes the antilog.
- **Result**: Cuts 30+ cycles down to **1 single clock cycle**!

### 2. Piecewise Linear Reciprocals ($1/D$)
- **The Concept**: Division $N / D$ is converted into multiplication: $N \times (1/D)$.
- The curve $f(D) = 1/D$ is split into 4 or 8 straight line segments ($a \cdot D + b$) stored in tiny look-up tables.

### 3. Dedicated Approximate Squarers ($x^2$) and Square Rooters ($\sqrt{x}$)
- Calculating $x^2$ using a regular multiplier wastes half the gates because $a_i \cdot a_j = a_j \cdot a_i$. Approximate squarers merge duplicate partial product columns and prune low-order terms, saving **up to 60% power** in 3D Euclidean distance calculations ($\sqrt{x^2 + y^2 + z^2}$).

---

## 📚 Primary Literature & IEEE Citations

For researchers and students exploring original circuit schematics and error derivations:

- **Piecewise Linear Logarithmic Dividers (LEAD)**:  
  H. Jiang et al., *"LEAD: Logarithmic Exponent Approximate Divider for Image Quantization Applications"*, ACM/IEEE Great Lakes Symposium on VLSI (GLSVLSI), [ACM/IEEE (DOI: 10.1145/3526241.3530323)](https://doi.org/10.1145/3526241.3530323).
- **Newton-Raphson Approximate Dividers**:  
  S. Shin et al., *"A Newton-Raphson Method-Based Approximate Divider Design for Color Quantization"*, IEEE ISOCC, [IEEE Xplore (DOI: 10.1109/isocc53507.2021.9613961)](https://doi.org/10.1109/isocc53507.2021.9613961).
- **Adaptive Unsigned Dynamic Dividers**:  
  C. Chen et al., *"Adaptive Approximation in Arithmetic Circuits: A Low-Power Unsigned Divider Design"*, IEEE/ACM DATE, [IEEE/ACM (DOI: 10.23919/date.2018.8342233)](https://doi.org/10.23919/date.2018.8342233).
- **Approximate Radix-4 Squarers**:  
  J. Chen et al., *"A Low-Power High-Performance Radix-4 Approximate Squaring Circuit"*, IEEE ASAP, [IEEE Xplore (DOI: 10.1109/asap.2009.35)](https://doi.org/10.1109/asap.2009.35).
- **Exact and Approximate Squarers for Error-Tolerant Computing**:  
  P. Balasubramanian et al., *"Exact and Approximate Squarers for Error-Tolerant Applications"*, IEEE Transactions on Computers, [IEEE Xplore (DOI: 10.1109/tc.2022.3228592)](https://doi.org/10.1109/tc.2022.3228592).
