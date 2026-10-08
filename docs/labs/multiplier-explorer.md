# Multiplier Playground Lab

Welcome to the interactive **Approximate Multiplier Playground**!

In this lab, you can test how different approximate multiplier microarchitectures (Static Truncation, RoBA, DRUM) calculate products compared to exact 100% mathematical multiplication.

---

## 🎛️ Interactive Multiplier Explorer

<iframe
  src="../multiplier-explorer.html"
  title="Interactive Multiplier Explorer"
  style="width:100%; height:540px; border:1px solid rgba(255,255,255,0.1); border-radius:8px; background:#0f172a;"
  loading="lazy"
></iframe>

---

## 🔬 What to Observe

### 1. The Truncation Effect
- Drag Operand A and B to large numbers (e.g. $A=200, B=180$).
- Select **Truncated LSB-4**. Notice how the error is negligible (under $1\%$), but the chip saves over **$40\%$ of its logic gates**!

### 2. The Power-of-Two Rounding (RoBA)
- Select **RoBA Multiplier**.
- RoBA rounds operands to the nearest powers of two ($2^k$), replacing entire multiplier arrays with simple barrel shifters.

### 3. Dynamic Range Detection (DRUM)
- Select **DRUM-4**.
- Notice how DRUM automatically slides a 4-bit window to capture the most significant active bits, providing low relative error across all numerical ranges.
