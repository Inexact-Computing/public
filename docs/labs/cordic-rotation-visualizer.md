# CORDIC Rotation Visualizer Lab

The **CORDIC algorithm** computes trigonometric functions and coordinate vector rotations without any multiplier hardware, using only bit-shifts and additions.

---

## 🧭 Live CORDIC Vector Wheel

<iframe
  src="../cordic-rotation-visualizer.html"
  title="CORDIC Angle Rotation Visualizer"
  style="width:100%; height:460px; border:1px solid rgba(255,255,255,0.1); border-radius:8px; background:#0f172a;"
  loading="lazy"
></iframe>

---

## 🔬 What to Observe

1. **Micro-Rotation Convergence**: CORDIC rotates the vector using predefined angle steps ($\theta_i = \arctan(2^{-i}) \in \{45^\circ, 26.56^\circ, 14.04^\circ, 7.12^\circ, \dots\}$).
2. **Early Termination (Adaptive Pruning)**: Late iterations contribute tiny fractions of a degree. Stopping early saves clock cycles and dynamic power with $<0.3^\circ$ phase error.
