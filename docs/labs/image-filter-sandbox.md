# Image Filter & Noise Sandbox Lab

In this interactive lab, you can test how inexact multipliers affect real 2D image processing filters in real time.

---

## 🖼️ Live Image Filtering Simulator

<iframe
  src="../image-filter-sandbox.html"
  title="Interactive Image Filter Sandbox"
  style="width:100%; height:620px; border:1px solid rgba(255,255,255,0.1); border-radius:8px; background:#0f172a;"
  loading="lazy"
></iframe>

---

## 🔬 Key Takeaways

### 1. Perceptual Noise Masking
- Try switching between **Exact Multiplier** and **Truncated LSB-4**.
- Notice that even though millions of individual math operations produce slight deviations, the human eye perceives a virtually identical crisp image with **$\text{PSNR} > 38\text{ dB}$**.

### 2. Gaussian Smoothing vs Edge Detection
- **Gaussian Blur** naturally averages neighbor pixels, making arithmetic errors self-canceling.
- **Sobel Edge Detection** computes sharp gradient differences, where error bounds must remain tightly controlled.
