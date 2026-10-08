# Approximate CORDIC Architectures

The **Coordinate Rotation Digital Computer (CORDIC)** algorithm is widely used to compute trigonometric functions, coordinate rotations, vector magnitudes, and hyperbolic mappings without dedicated multipliers.

---

## 1. Approximation Levers in CORDIC

```mermaid
graph TD
    C[Approximate CORDIC] --> M1[1. Angle Iteration Pruning]
    C --> M2[2. Approximate Internal Adders]
    C --> M3[3. Scale-Factor (K) Simplification]
    C --> M4[4. Fully Parallel Unrolled Architectures]

    M1 --> O1[Early termination / Adaptive iterations]
    M2 --> O2[Speculative adders in X/Y/Z datapath]
    M3 --> O3[Shift-and-add scale constant approximation]
    M4 --> O4[Pipelined constant rotation schedule]
```

---

## 2. Key Techniques & Design Rules

1. **Iteration Elimination**: High-order iterations ($i > N/2$) contribute micro-rotations. Pruning them reduces latency linearly with bounded phase error.
2. **Datapath Truncation**: Lower bits in intermediate $X_i, Y_i$ registers experience diminishing significance, enabling lower-part truncation adders.
3. **Scale Factor ($K$) Folding**: Conventional CORDIC requires multiplying by $K = \prod \frac{1}{\sqrt{1+2^{-2i}}} \approx 0.60725$. Approximate CORDIC merges scaling directly into the terminal shift stages.
