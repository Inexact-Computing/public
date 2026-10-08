# Design Space Exploration & Pareto Frontiers

This section summarizes empirical Pareto trade-offs extracted from multi-PDK synthesis and exhaustive error characterization.

---

## 1. Multiplier Pareto Landscape ($\text{MRED}$ vs. Energy-Delay Product)

```
       MRED (%)
         ^
    10%  |     [RoBA]              [High-Error / Ultra-Low-Power]
         |          \
     5%  |           [DRUM-4]     [Mitchell Log]
         |                 \
     1%  |                  [TOSAM]       [BAM-4]
         |                        \
   0.1%  |                         [AC-4:2 Compressors]
         |                                      \
     0%  +---------------------------------------[Exact Multiplier]---> EDP (fJ*ns)
```

---

## 2. Quantitative Trade-off Matrix (FreePDK45 @ 1 GHz)

| Design | Bit-width | Area ($\mu\text{m}^2$) | Delay (ns) | Power ($\mu\text{W}$) | EDP ($\text{fJ}\cdot\text{ns}$) | MRED (%) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Exact Wallace** | $16 \times 16$ | $1240$ | $0.98$ | $850$ | $816$ | $0.00\%$ |
| **AC-4:2 (Design 1)** | $16 \times 16$ | $890$ | $0.82$ | $560$ | $376$ | $0.42\%$ |
| **DRUM-6** | $16 \times 16$ | $680$ | $0.74$ | $390$ | $213$ | $1.85\%$ |
| **TOSAM** | $16 \times 16$ | $540$ | $0.70$ | $320$ | $156$ | $2.94\%$ |
| **RoBA** | $16 \times 16$ | $420$ | $0.62$ | $210$ | $80$ | $6.21\%$ |

---

## 3. Design Selection Heuristic

1. **For High-Fidelity Signal & Image Processing ($PSNR > 35\text{ dB}$)**:
   - Choose **Approximate 4:2 Compressors** or **TOSAM with small truncation**.
2. **For Edge DNN Inference (Quantized INT8 / MobileNet)**:
   - Choose **DRUM-5/6** or **Logarithmic multipliers** (retains $>98\%$ top-1 accuracy).
3. **For Extreme Energy-Constrained IoT / Bio-Sensors**:
   - Choose **RoBA** or **Broken-Array Multipliers (BAM)** for $>70\%$ energy savings.
