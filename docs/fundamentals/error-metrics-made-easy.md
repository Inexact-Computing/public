# How Do We Grade Mistakes? (Error Metrics Made Easy)

When a regular calculator gives the wrong answer, it gets an **F**.
In approximate computing, a circuit can deliberately differ from a specified reference. Errors need not be small for every input. How do we quantify them, and decide whether they satisfy an application's requirements?

We use error metrics. This page first works through one small table, step by step. The everyday analogies (pizza slices and dollars) follow under *Going deeper*.

**Route:** [Bits and carries](../start/bits-and-carry.md) → this page → [Approximate adders](../taxonomy/adders.md). For this page you only need whole-number subtraction and percentages.

**After this page you can:**

1. work out the signed error and the size of the error for each row of a table;
2. summarize a table by how often it is wrong and by how much, keeping the largest error separate;
3. explain which rows can be used for relative error, and what a small table cannot prove.

---

<a id="read-e01"></a>

## Step 1: Line up exact and approximate results

The **exact result** is our reference: the answer that the specified arithmetic should give. The **approximate result** is what an approximate method actually returned. Put each pair in the same row of our starting table (Table T):

| Row | Exact (reference) | Approximate |
|---|---:|---:|
| 1 | 0 | 1 |
| 2 | 10 | 11 |
| 3 | 20 | 18 |
| 4 | 30 | 30 |

All values are plain integers, and every error below is in the same integer units.

For each row, subtract the exact result from the approximate result. This is the **signed error**: e = approximate − exact. A positive error means the approximate result is too high; a negative error means it is too low.

The **size** of an error ignores its sign: the size of +1 and the size of −1 are both 1. This size is called the **error distance** (ED). Mathematicians write it as the absolute value, |e|.

Row 2 as an example: 11 − 10 = +1, so e = +1 and ED = 1.

**Predict first:** write e and ED for rows 1, 3 and 4.

<details markdown="1">
<summary>Check rows 1–4</summary>

| Row | Exact | Approximate | Signed error e | Size ED |
|---|---:|---:|---:|---:|
| 1 | 0 | 1 | +1 | 1 |
| 2 | 10 | 11 | +1 | 1 |
| 3 | 20 | 18 | −2 | 2 |
| 4 | 30 | 30 | 0 | 0 |

Row 3 is too low by 2; row 4 is exactly right.

</details>

**Error ledger task.** The ledger below starts with this same table. Write your predicted signed error and size for each row on paper, then press **Check this table** to compare. Editing any value clears the old check. **Reset to teaching table T** brings back this table; **Clear all rows** empties it so you can enter your own rows (up to 20). The ledger only compares the numbers you give it; it does not simulate any circuit.

<iframe
  src="../../labs/error-ledger.html"
  title="Error Ledger"
  style="width: 100%; height: 2300px; border: none; background: transparent; margin: 12px 0;"
  loading="lazy"
></iframe>

If the ledger does not load, [open the Error Ledger on its own page](../labs/error-ledger.html). Every result it shows for this table is also on this page.

<a id="read-e02"></a>

## Step 2: How often, and by how much?

A **mean** (average) is the total divided by the number of rows. Every row counts once; if the same pair appears twice, it counts as two rows.

- **Mean Error Distance (MED)** is the mean of the error sizes, including rows whose error is 0.
- **Error Rate (ER)** is the number of rows with any nonzero error, divided by the number of rows. We usually write it as a percentage.
- The **observed maximum** is the largest error size in the rows you checked.

These rows were typed by hand. They are not measurements of a real circuit, and they say nothing about how often such inputs occur in practice.

**Predict first:** for the table above, what are MED, ER and the observed maximum?

<details markdown="1">
<summary>Check the summary</summary>

- MED = (1 + 1 + 2 + 0) / 4 = 4 / 4 = **1**
- ER = 3 wrong rows / 4 rows = **75.00%**
- Observed maximum = **2** (row 3)

Side note: if you averaged the *signed* errors instead, you would get (1 + 1 − 2 + 0) / 4 = 0. That number is the signed mean error, not MED. Positive and negative errors cancel in the signed mean, but their sizes do not cancel in MED.

</details>

### One comparison: wrong often, or wrong by more?

Two more small tables have the same exact results, 10 in every row:

| Row | Exact | Table F approximate | Table G approximate |
|---|---:|---:|---:|
| 1 | 10 | 9 | 10 |
| 2 | 10 | 9 | 10 |
| 3 | 10 | 9 | 10 |
| 4 | 10 | 9 | 14 |

**Predict first:** which table is wrong more often? Which has the larger observed error? What is the MED of each?

<details markdown="1">
<summary>Check F and G</summary>

| | ER | MED | Observed maximum |
|---|---:|---:|---:|
| Table F | 4 / 4 = 100.00% | 4 / 4 = 1 | 1 |
| Table G | 1 / 4 = 25.00% | 4 / 4 = 1 | 4 |

F is wrong more often; G has the larger single error that we observed. Both have MED 1, yet they behave differently. Equal MED values do not tell you that two sets of errors are the same, or that both suit the same task.

</details>

ER asks how often a result is wrong. MED averages the sizes of errors, including zero-error rows. Keep the maximum separate.

<a id="read-e03"></a>

## Step 3: Relative error, zero references, and what a table can prove

An error of 1 matters more when the exact result is 10 than when it is 1,000. The **relative error distance** (RED) compares the error size with the size of the reference:

RED = ED / |exact|

Use the size of the exact result, so a negative reference still gives a relative error that is zero or positive. For example, exact −10 and approximate −9 give ED = 1 and RED = 1/10 = 10%.

**When the exact result is 0, RED is undefined**, because we cannot divide by zero. Such a row is *excluded* from RED and from its mean, but only from those. Its error size and whether it is wrong are still known, so it still counts in MED and ER.

**Mean Relative Error Distance (MRED)** is the mean of RED over the valid rows (those with a nonzero exact result). Always report the number of valid rows, N<sub>valid</sub>, and the number excluded, next to the MRED value. If every exact result is 0, MRED is undefined, not 0. If the table has no rows at all, MED, ER, the observed maximum and MRED are all undefined.

**Predict first:** in the first table, which rows can be used for RED? What is MRED?

<details markdown="1">
<summary>Check relative errors</summary>

| Row | Exact | Approximate | ED | RED |
|---|---:|---:|---:|---|
| 1 | 0 | 1 | 1 | undefined; excluded |
| 2 | 10 | 11 | 1 | 1/10 = 10.00% |
| 3 | 20 | 18 | 2 | 2/20 = 10.00% |
| 4 | 30 | 30 | 0 | 0/30 = 0.00% |

MRED = (1/10 + 2/20 + 0/30) / 3 = 1/15 ≈ **6.67%**, with N<sub>valid</sub> = 3 and 1 row excluded (exact 0). The percentage is rounded to two decimal places; the exact value is 1/15. MED (1) and ER (75.00%) still use all four rows.

</details>

### What a small table can and cannot show

The **allowed inputs** are all the inputs that a tool or circuit accepts, for example every pair of unsigned 16-bit numbers. The **Worst-Case Error (WCE)** is the largest error size over *all* allowed inputs. Finding it needs a check of every allowed input, or a proof.

The largest error in a hand-made table is only an observed maximum. In the first table it is 2; that does not show that a circuit can never be off by more than 2. Which inputs you test, and how many times each one appears, changes MED, ER and MRED. A different set of rows can give different values.

---

## Check your understanding

Answer on paper first, then open the check. Your answers are not saved or sent anywhere. These questions use a new table, S:

| Row | Exact | Approximate |
|---|---:|---:|
| 1 | 0 | 1 |
| 2 | 8 | 7 |
| 3 | 10 | 11 |
| 4 | 20 | 20 |

<a id="read-q4"></a>

**Question 4.** (a) For S, find each signed error and its absolute size. Calculate MED, ER and the largest error observed in S. (b) In the F and G tables from Step 2, which is wrong more often? Which has the larger observed error? Do their equal MED values make their errors equivalent?

<details markdown="1">
<summary>Check question 4</summary>

(a) Signed errors: +1, −1, +1, 0. Sizes: 1, 1, 1, 0. MED = 3/4 = 0.75. ER = 3/4 = 75.00%. Largest observed error = 1.

- MED 0.25 comes from averaging the signed errors; MED uses the sizes, so −1 counts as 1.
- MED 1 comes from dividing by the 3 wrong rows only; divide by all 4 rows.
- ER 100% counts the correct row as wrong; row 4 has no error.

(b) F is wrong more often (100% against 25%). G has the larger observed error (4 against 1). Equal MED does not make them equivalent: MED does not show how often errors happen or how large the largest one is. A higher ER does not mean that each error is larger.

Optional follow-up: in the first table the signed errors average to 0, yet MED is 1. Why? (Each row's size is taken before averaging.)

</details>

<a id="read-q5"></a>

**Question 5.** (a) In S, which rows can be used for relative error? Does the excluded row still count in MED and ER? Explain. (b) S has observed maximum error 1. Does that prove a circuit can never have an error larger than 1 over all allowed inputs?

<details markdown="1">
<summary>Check question 5</summary>

(a) Rows 2, 3 and 4 (N<sub>valid</sub> = 3); row 1 is excluded because its exact result is 0. RED is undefined there, but its error size (1) and the fact that it is wrong are still known, so it still counts in MED and ER. Do not set its RED to 0 or to infinity, and do not remove the row from every metric.

(b) No. S has only four rows. A guarantee over all allowed inputs needs every allowed input to be checked, or a proof, with the allowed inputs stated.

Optional extension: compute MRED for S. Answer: (1/8 + 1/10 + 0/20) / 3 = 3/40 = 7.50%, with N<sub>valid</sub> = 3 and 1 excluded. If you got 5.625%, you divided by 4 rows instead of the 3 valid ones.

</details>

**Next:** [Approximate adders](../taxonomy/adders.md) shows a real approximate adder that returns 7 for 7 + 1, and asks whether a one-unit error can change a decision.

---

## Going deeper

The sections below are the original reference material for this page. They go further than the first route above:

- [Mean Error Distance — the pizza slice test](#1-mean-error-distance-med-the-pizza-slice-test): an optional everyday example and the general MED formula.
- [Mean Relative Error Distance — the dollar test](#2-mean-relative-error-distance-mred-the-dollar-test): an optional dollar example, the MRED formula and a three-row example.
- [Worst-Case Error](#3-worst-case-error-wce-the-ceiling): the formula over a full input domain.
- [PSNR](#4-psnr-peak-signal-to-noise-ratio-pixel-error-score): a pixel error score for images.
- [Summary cheat sheet](#summary-cheat-sheet).

---

## 🍕 1. Mean Error Distance (MED) — "The Pizza Slice Test"

Imagine you order a pizza with 100 slices.

- If the restaurant gives you 99 slices on Monday (1 slice error)
- And 101 slices on Tuesday (1 slice error)
- And 100 slices on Wednesday (0 slice error)

Your average absolute mistake is:

$$\text{Average Error} = \frac{1 + 1 + 0}{3} \approx 0.67\text{ slices}$$

In circuits, **Mean Error Distance (MED)** is the average absolute difference from a specified exact reference over a nonempty evaluated collection. The formula below gives equal weight to each sample:

$$\text{MED} = \frac{1}{N} \sum |Y_{\text{approx}} - Y_{\text{exact}}|$$

> **Rule of Thumb:** A smaller MED means a smaller average absolute difference over the inputs evaluated, each weighted as listed. It does not mean that every individual result is close.

---

## 📊 2. Mean Relative Error Distance (MRED) — "The Dollar Test"

Think about these two mistakes:

1. Being off by **\$10** relative to **\$20,000** gives $0.05\%$.
2. Being off by **\$10** relative to **\$1** gives $1000\%$.

Because numbers have different scales, we calculate the **relative percentage error**:

$$\text{Relative Error} = \frac{|\text{Mistake}|}{|\text{True Value}|}, \qquad \text{True Value} \ne 0$$

Taking the average gives us **Mean Relative Error Distance (MRED)**. Here we exclude inputs whose exact output is zero, because their relative error would involve division by zero. Let $V$ be the set of evaluated samples with $Y_{\text{exact}} \ne 0$, and let $N_{\text{valid}} = |V|$ be their count:

$$\text{MRED} = \frac{1}{N_{\text{valid}}} \sum_{i \in V} \frac{|Y_{\text{approx},i} - Y_{\text{exact},i}|}{|Y_{\text{exact},i}|}$$

Report the excluded sample count separately; if $N_{\text{valid}} = 0$, MRED is undefined. For example, exact outputs $[0, 10, 20]$ and approximate outputs $[1, 11, 18]$ give MRED $(0.1 + 0.1)/2 = 0.1$, or $10\%$, over two valid samples. The error at the zero-output sample still matters and can be included in MED and ER. A small MRED does not guarantee invisible noise or an acceptable task result.

---

## 💥 3. Worst-Case Error (WCE) — "The Ceiling"

What is the biggest possible blunder this circuit can ever make in the worst possible scenario?

$$\text{WCE} = \max_{x \in D} |Y_{\text{approx}}(x) - Y_{\text{exact}}(x)|$$

Here $D$ is the full allowed input domain, with the bit width, signedness, and overflow behavior specified. A full-domain bound requires checking every allowed input or a proof; the largest error in a sample is only an observed maximum.

For unsigned 16-bit inputs, the largest exact product is $65535^2 = 4,294,836,225$, not the largest value that a 32-bit output can encode. If a multiplier is proved to have $\text{WCE} = 64$ over that full input domain, its result is never off by more than $64$ there. Whether that bound is acceptable still depends on the task.

---

## 📸 4. PSNR (Peak Signal-to-Noise Ratio) — "Pixel Error Score"

When you filter or compress a photo, engineers use **PSNR** (measured in decibels, **dB**) to summarize squared pixel differences from a specified reference image:

$$\text{MSE} = \frac{1}{P} \sum_{i=1}^{P} (I_{\text{approx},i} - I_{\text{reference},i})^2, \qquad \text{PSNR} = 10\log_{10}\left(\frac{255^2}{\text{MSE}}\right)$$

For this formula, $P$ counts the compared grayscale pixels and $255$ is the maximum intensity for 8-bit unsigned pixels. Compare the same region with the same quantization and reference processing. With MSE $= 0$, the compared pixels are identical and PSNR is infinite; with nonzero MSE, PSNR is finite. For a fixed pixel range, a higher PSNR means a smaller MSE, but it does not guarantee invisibility or task safety. Image content, error pattern, and viewing conditions matter; energy use must be measured separately.

For a published example, see [Same MSE, different structure](error-metrics.md#same-mse-example): five differently distorted versions of one photo all have the same MSE, and therefore the same PSNR, yet their structural-similarity scores range from 0.69 to 0.99.

---

## ⚖️ Summary Cheat Sheet

| Metric | What It Asks | Best Analogy |
| :--- | :--- | :--- |
| **MED** | On average, how far off is the answer? | Average distance from target |
| **MRED** | What is the average percentage mistake? | Percent error on a lab report |
| **WCE** | What is the largest error over the full specified input domain? | A verified error ceiling |
| **ER (Error Rate)**| What percentage of answers have any error at all? | How often the coin lands on heads |
| **PSNR** | How small is the squared pixel error for a fixed range and reference? | A pixel error score, not a visibility guarantee |

The metrics describe a declared test distribution and arithmetic contract, not automatic task safety. For background, see Liang, Han and Lombardi, *New Metrics for the Reliability of Approximate and Probabilistic Adders*, ED/MED definitions ([author manuscript](https://www.ece.ualberta.ca/~jhan8/publications/Adder-TC-May28_FinalSubmission.pdf)); Wang, Bovik, Sheikh and Simoncelli, IEEE TIP, 2004, Section II ([author manuscript](https://www.cns.nyu.edu/pub/lcv/wang03-preprint.pdf)) for why squared pixel error alone does not settle visibility. Apart from the MSSIM range quoted from Wang et al. (Fig. 2), the numbers on this page are arithmetic examples, not measured circuit or energy results.
