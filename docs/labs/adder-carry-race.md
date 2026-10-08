# Adder Carry Propagation Race Lab

Explore the fundamental bottleneck of computer arithmetic: the **Carry-Propagation Chain**.

---

## ⚡ Live Carry Chain Race

<iframe
  src="../adder-carry-race.html"
  title="Adder Carry Propagation Race"
  style="width:100%; height:480px; border:1px solid rgba(255,255,255,0.1); border-radius:8px; background:#0f172a;"
  loading="lazy"
></iframe>

---

## 🔬 What to Observe

### 1. The Ripple-Carry Delay ($16\times$ Gate Delay)
- In a Ripple Carry Adder (RCA), bit 15 cannot compute its final sum until the carry signal ripples across all 15 lower bits.

### 2. Speculative Carry Prediction (ACA)
- Approximate Almost-Correct Adders (ACA) divide the adder into short 4-bit windows. The carry path is cut, reducing the critical delay from $16$ to only $4$ gate delays with $<0.5\%$ error probability!
