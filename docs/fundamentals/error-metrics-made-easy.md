# How Do We Grade Mistakes? (Error Metrics Made Easy)

When a regular calculator gives the wrong answer, it gets an **F**.
In approximate computing, we design circuits that make deliberate small mistakes. But how do we know if a mistake is **"good and safe"** or **"catastrophic"**?

We use statistical error metrics! Let's explain them using simple, everyday analogies.

---

## 🍕 1. Mean Error Distance (MED) — "The Pizza Slice Test"

Imagine you order a pizza with 100 slices.
- If the restaurant gives you 99 slices on Monday (1 slice error)
- And 101 slices on Tuesday (1 slice error)
- And 100 slices on Wednesday (0 slice error)

Your average absolute mistake is:
$$\text{Average Error} = \frac{1 + 1 + 0}{3} = 0.67\text{ slices}$$

In circuits, **Mean Error Distance (MED)** is the average difference between what the approximate chip calculated and what an exact computer would have produced:

$$\text{MED} = \frac{1}{N} \sum |Y_{\text{approx}} - Y_{\text{exact}}|$$

> **Rule of Thumb:** A smaller MED means the circuit stays very close to the true answer on average.

---

## 📊 2. Mean Relative Error Distance (MRED) — "The Dollar Test"

Think about these two mistakes:
1. Being off by **$10** when buying a **$20,000 car** (a tiny $0.05\%$ mistake — nobody cares!).
2. Being off by **$10** when buying a **$1 candy bar** (a $1000\%$ mistake — huge disaster!).

Because numbers have different scales, we calculate the **relative percentage error**:

$$\text{Relative Error} = \frac{|\text{Mistake}|}{\text{True Value}}$$

Taking the average over all calculations gives us **Mean Relative Error Distance (MRED)**:

$$\text{MRED} = \frac{1}{N} \sum \frac{|Y_{\text{approx}} - Y_{\text{exact}}|}{|Y_{\text{exact}}|}$$

> **High-School Physics Tip:** In image processing and audio, keeping $\text{MRED} < 2\%$ makes the noise completely invisible to humans!

---

## 💥 3. Worst-Case Error (WCE) — "The Ceiling"

What is the biggest possible blunder this circuit can ever make in the worst possible scenario?

$$\text{WCE} = \max |Y_{\text{approx}} - Y_{\text{exact}}|$$

If a 16-bit multiplier has $\text{WCE} = 64$, you are guaranteed that no matter what crazy numbers you multiply, the answer will **never** be off by more than 64 (out of $4,294,967,295$!).

---

## 📸 4. PSNR (Peak Signal-to-Noise Ratio) — "Image Crispness Score"

When you filter or compress a photo, engineers use **PSNR** (measured in decibels, **dB**) to measure picture quality:

```
PSNR > 40 dB  :  Flawless crystal clear (Identical to original)
PSNR 30–40 dB :  Excellent quality (Instagram / YouTube HD standard)
PSNR 20–30 dB :  Noticeable grain or compression blur
PSNR < 20 dB  :  Pixelated mess
```

Approximate multipliers routinely achieve **$\text{PSNR} > 36\text{ dB}$** while saving $60\%$ chip energy!

---

## ⚖️ Summary Cheat Sheet

| Metric | What It Asks | Best Analogy |
| :--- | :--- | :--- |
| **MED** | On average, how far off is the answer? | Average distance from target |
| **MRED** | What is the average percentage mistake? | Percent error on a lab report |
| **WCE** | What is the worst mistake that can ever happen? | The safety limit / ceiling |
| **ER (Error Rate)**| What percentage of answers have any error at all? | How often the coin lands on heads |
| **PSNR** | How beautiful does the filtered picture look? | High-definition display rating |
