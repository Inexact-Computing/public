# 4:2 Approximate Compressor Playground

In high-speed multiplier trees (Wallace and Dadda trees), **4:2 Compressors** reduce 4 rows of partial products down to 2 rows.

---

## 🗜️ Live 4:2 Compressor Simulator

<iframe
  src="../compressor-4to2-playground.html"
  title="4:2 Approximate Compressor Playground"
  style="width:100%; height:480px; border:1px solid rgba(255,255,255,0.1); border-radius:8px; background:#0f172a;"
  loading="lazy"
></iframe>

---

## 🔬 Key Insights

1. **Gate Count Optimization**: Exact 4:2 compressors require 26 standard CMOS transistors. Approximate AC-4:2 compressors eliminate complex internal XOR gates, using only **14 transistors** ($46\%$ area reduction).
2. **Truth Table Accuracy**: Across all 32 input state combinations, the approximate compressor matches the exact mathematical result in **28 out of 32 states ($87.5\%$ exact accuracy)**, with any rare deviation strictly bounded to $\pm 1$.
