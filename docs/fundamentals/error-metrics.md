# Error Metrics and Mathematical Bounds

**You need:** the everyday reading of ED, MED, ER and RED on a small hand-made table, as taught on [Error metrics made easy](error-metrics-made-easy.md). This page does **not** re-teach that page.

**After this page you can:**

1. say what a *collection* of evaluated inputs is, and why an equal-weight mean is not the same as a workload distribution;
2. compute the signed mean error (the *bias*) and say why it is a different number from MED;
3. state the domain in which each metric is defined — and in particular where MED, ER and MRED stop being defined.

**Route:** [Error metrics made easy](error-metrics-made-easy.md) → this page → [Approximation paradigms](approx-paradigms.md).

## How this page relates to the beginner page

| | [Error metrics made easy](error-metrics-made-easy.md) | **this page** |
|---|---|---|
| Job | read a small table, meet ED/MED/ER/RED | define them, fix their domains, derive the bounds |
| Tables | hand-made teaching tables T, F, G, S | one checked set, then LOA's full input domain |
| Question it answers | *what does this number mean?* | *when is this number valid, and what does it not bound?* |
| Formulas | shown next to examples | stated precisely, with the domain of each |

If a symbol below is unfamiliar, read the beginner page first: it introduces every one of ED, MED, ER, RED and MRED with worked arithmetic.

## Start here: one small checked set

Call the set of input pairs you actually evaluated $S$ — the **collection**. It is not "all inputs"; it is the inputs you chose. Here is one such collection of five pairs, with its per-row errors filled in. As always, $e = \text{approx} - \text{exact}$.

| Row | exact | approx | $e$ | $\lvert e\rvert$ |
|---|---:|---:|---:|---:|
| 1 | 12 | 13 | +1 | 1 |
| 2 | 20 | 18 | −2 | 2 |
| 3 | 0 | 1 | +1 | 1 |
| 4 | 30 | 30 | 0 | 0 |
| 5 | 40 | 41 | +1 | 1 |

Now four different summaries of the **same five rows**:

| Summary | How it is computed here | Value |
|---|---|---:|
| Sum of signed errors | $+1-2+1+0+1$ | $+1$ |
| **Bias** = mean signed error | $+1 / 5$ | $+0.2$ |
| Sum of sizes | $1+2+1+0+1$ | $5$ |
| **MED** = mean error distance | $5 / 5$ | $1$ |
| **ER** = error rate | $4$ wrong rows of $5$ | $80\%$ |
| Observed maximum ED | largest $\lvert e\rvert$ present | $2$ |

Three lessons are already visible in this tiny table.

**Every row counts once, including the correct one.** Row 4 has $e=0$ and still occupies a fifth of the denominator. Dropping zero-error rows would inflate MED from $1$ to $5/4=1.25$ and ER from $80\%$ to $100\%$. This is why the site writes "MED includes the zero rows" every time: it is a denominator convention, not a detail.

**The signed mean and the size mean are different numbers.** The bias is $+0.2$ and MED is $1$. If you averaged the signed errors you got $+0.2$; if you averaged the sizes you got $1$. A table can have bias $0$ and MED $1$ (for example $+1,-1$), so *"the mean error is zero"* is never a claim that the arithmetic is accurate.

**An observed maximum is not a bound.** The largest $\lvert e\rvert$ in $S$ is $2$, and it is $2$ for these five rows. Adding more inputs can reveal a larger error. It says nothing about the rows you did not evaluate.

### Collection or distribution?

Notice that every statement above is an *equal-weight* statement: each row contributes $1/5$. That is legitimate for a collection, and it is what the ledger tool computes. It is **not** the same as a workload. If some inputs occur far more often than others, the honest summary is a **weighted** expectation — each input pair weighted by how often it appears — and an equal-weight mean over a hand-picked set can then disagree with the workload average. Both numbers are useful, but the sentence accompanying the number has to say which one it is.

This is also why the site keeps repeating that the tested inputs must be stated, with the widths, signedness, rounding and overflow rules. "MED = 1" without a collection, a contract and a width is not a quantity; it is a fragment.

## Bias: why direction matters

The bias is the mean of the *signed* errors, and it is the number that predicts accumulation. In an exact running sum, a nonzero mean step error gives a mean accumulated error proportional to the number of steps; zero mean does not guarantee a small error in each run — this is worked through step by step on [Motivations and challenges](motivations-and-challenges.md). Three common situations, and the sign of the bias each one produces:

```
     Clearing low output bits, nonnegative result: errors are nonpositive
     Signed truncation or operand approximation: sign depends on the model
     Rounding: unbiasedness depends on the rule and input distribution
```

The third line is the one people get wrong. "Rounding is unbiased" is a claim about a *rule* applied to a *distribution* of values; round-half-up sends exact half-step ties upward. With positive probability at ties, this can cause upward bias, depending on the rest of the distribution; a continuous uniform fractional part has no probability mass at ties and has zero mean rounding error. A different input set can give either sign of bias. Always ask which rule and which inputs.

## Where the metrics stop being defined

This is the part the beginner page deliberately leaves out, and the part that matters most in practice.

| Metric | Defined on | Not defined / not meaningful when |
|---|---|---|
| ED, $\lvert e\rvert$ | each pair of finite numerical outputs | undefined or non-numerical outputs require a separate convention |
| MED | any nonempty collection | the collection is empty |
| ER | any nonempty collection | the collection is empty |
| observed maximum | any nonempty collection | the collection is empty |
| RED | pairs with $\text{exact}\neq 0$ | $\text{exact}=0$: division by zero |
| MRED | the subset $S^*$ with nonzero reference | $S^*$ is empty |
| NMED (Normalized Mean Error Distance, MED ÷ $D_{\max}$) | with a stated positive normaliser $D_{\max}$ | no positive normaliser is stated |
| WCE | a stated full input domain $D$ | only a sample is available |

A zero reference removes a row from the *relative* metrics only. Its absolute error is still known, so it still counts in MED and ER — and it must not be deleted from the table, nor given a RED of $0$ or $\infty$. Likewise, a full-domain WCE needs every allowed input (or a proof); a sampled maximum is not one.

## Check your understanding

Answer on paper first, then open the check. Your answers are not saved or sent anywhere.

<a id="read-f10"></a>

**WB10.** Using the five-row set $S$ above: (a) what are MED, ER and the observed maximum? (b) What is the bias? (c) A colleague reports "MED = 1.25" for the same rows. What did they most likely do?

<details markdown="1">
<summary>Check WB10</summary>

(a) MED $= 5/5 = 1$; ER $= 4/5 = 80\%$; observed maximum $= 2$. (b) Bias $= +1/5 = +0.2$. (c) They divided by the **four wrong rows** instead of all five: $5/4 = 1.25$. MED's denominator is the whole collection, including the rows whose error is 0.

- If you got MED $= 1.25$, check whether you silently dropped row 4 because "it has no error". Zero-error rows are exactly what keeps MED honest.
- If you reported the bias as $1$, you averaged the sizes; the bias keeps the sign.

</details>

<a id="read-f11"></a>

**WB11.** In the same set $S$: (a) which rows can be used for RED? (b) Compute MRED, giving $N_{\text{valid}}$ and the number of excluded rows. (c) Does the excluded row still affect MED and ER?

<details markdown="1">
<summary>Check WB11</summary>

(a) Rows 1, 2, 4 and 5 — every row whose exact value is not 0. Row 3 is excluded because dividing by its exact value 0 is undefined. (b) $\text{RED} = 1/12,\ 2/20,\ 0,\ 1/40$, so MRED $= (0.08333+0.1+0+0.025)/4 = 0.20833/4 \approx 5.21\%$, with $N_{\text{valid}} = 4$ and $1$ row excluded. (c) Yes: row 3 has $e=+1$, so it is a wrong row — it still counts in MED (as the $1$ in the sum) and in ER (as one of the four wrong rows).

- If you set row 3's RED to $0$, you have quietly asserted a perfect relative error where none can be computed. Write "undefined; excluded" instead.
- If you divided by $5$ instead of $4$, you included the excluded row in the MRED denominator.

</details>

<a id="read-f12"></a>

**WB12.** Two engineers report on the same circuit. A: "we tested 10,000 random inputs; the worst error we saw was 3, so the worst-case error is 3." B: "we enumerated all $2^{16}$ low-byte pairs (each byte is 8 bits) and the worst error was 128, so the worst-case error over the stated domain is 128." Which claim is a bound, and what is the precise defect in the other?

<details markdown="1">
<summary>Check WB12</summary>

B is a bound **over the domain it enumerates** — every allowed pair in that domain was checked, so the maximum is genuinely the domain maximum (this is the LOA situation on the reference section below). A is only an *observed* maximum: 10,000 samples, however random, cannot exclude a worse input that was not drawn. A's sentence needs to become "the largest error observed in a sample of 10,000 random inputs was 3", and it still says nothing about the untested inputs.

- "Random" does not make a sample into a proof. Only exhaustiveness or a proof does.
- Notice too that B's domain must be *stated*: here only the low bytes matter, which is why enumerating $2^{16}$ pairs is enough for this circuit.

</details>

---

## 🔬 Reference: definitions, domains and derivations

Functional correctness is defined relative to specified arithmetic, including representation, rounding, and overflow behavior. A finite-precision exact reference is not infinite-precision real arithmetic.

In **approximate and inexact computing**, numerical error is quantified alongside implementation cost. A design may trade precision for lower power, energy, delay or area, but the bound and benefit must be established for that design and workload.

### 1. Primary Numerical Error Metrics

Let $A$ and $B$ represent the input operands, and let $S$ be a nonempty collection of evaluated test vectors. Equal-weight averages below describe that collection; a workload probability distribution requires weighted expectations. State operand/output widths, signedness, saturation or wraparound, rounding, and the exact reference. Comparing an unbounded result with a wrapped result without specifying this contract is ambiguous.

Let $Y_{\text{exact}}(A, B)$ be the mathematical ground truth and $Y_{\text{approx}}(A, B)$ be the output produced by the approximate hardware.

```
       Exact Reference:  Y_exact  = f(A, B)
   Approximate Circuit:  Y_approx = f_approx(A, B)
                         ────────────────────────
       Error Distance:   ED(A, B) = |Y_approx - Y_exact|
```

#### 1. Error Distance ($ED$)
The fundamental point-wise absolute numerical discrepancy for a specific input pair $(A, B)$:

$$ED(A, B) = |Y_{\text{approx}}(A, B) - Y_{\text{exact}}(A, B)|$$

#### 2. Mean Error Distance ($MED$)
The average absolute error distance over the evaluated collection $S$:

$$MED = \frac{1}{|S|} \sum_{(A,B) \in S} |Y_{\text{approx}}(A, B) - Y_{\text{exact}}(A, B)|$$

> **Key Insight:** MED has the output's units and measures average magnitude, not a bound on every result. Two unsigned 8-bit inputs have maximum sum $510$ only when the result retains nine bits; an 8-bit wrapped output has different semantics. A hypothetical MED of $1.2$ means an average absolute difference of $1.2$ counts over the stated test collection, not a measured universal adder result.

#### 3. Mean Relative Error Distance ($MRED$)
The average relative error ratio, expressed as a percentage only after multiplying by $100$:

$$MRED = \frac{1}{|S^*|} \sum_{(A,B) \in S^*} \frac{|Y_{\text{approx}}(A, B) - Y_{\text{exact}}(A, B)|}{|Y_{\text{exact}}(A, B)|}$$

*(where $S^* = \{(A,B) \in S : Y_{\text{exact}}(A, B) \neq 0\}$ to avoid division by zero).*

If $S^*$ is empty, MRED is undefined. Report the excluded zero-reference cases and evaluate their absolute errors separately. No fixed MRED threshold guarantees invisibility or application correctness.

#### 4. Normalized Mean Error Distance ($NMED$)
$NMED$ normalizes MED by a stated positive reference magnitude $D_{\text{max}}$. It removes the output scale but does not alone make different widths, distributions, or arithmetic contracts directly comparable:

$$NMED = \frac{MED}{D_{\text{max}}}$$

For two unsigned $N$-bit inputs with the full result retained, use $D_{\text{max}} = (2^N - 1)^2$ for multiplication and $D_{\text{max}} = 2^{N+1} - 2$ for addition without carry-in. Signed or wrapped references require a separately defined normalization.

#### 5. Worst-Case Error ($WCE$) / Maximum Error Distance ($MaxED$)
Use the full allowed input domain $D$ to define a worst-case error. A maximum over sampled $S$ is only an observed maximum:

$$WCE = \max_{(A,B) \in D} |Y_{\text{approx}}(A, B) - Y_{\text{exact}}(A, B)|$$

> **Scope of a bound:** A proved full-domain WCE of $28$ satisfies an arithmetic requirement $|Error|\le32$ for that operation and contract. It does not prove whole-system safety: accumulated errors, threshold decisions, and unsupported inputs can impose additional requirements. Establish the bound by exhaustive evaluation or proof, not a sampled maximum.

#### 6. Error Rate ($ER$)
The fraction of input test vectors for which the approximate circuit produces a non-zero error:

$$ER = \frac{1}{|S|} \sum_{(A,B) \in S} \mathbb{I}\Big(Y_{\text{approx}}(A, B) \neq Y_{\text{exact}}(A, B)\Big)$$

*(where $\mathbb{I}(\cdot)$ is the indicator function equal to $1$ if true and $0$ otherwise).*

> **Frequency and magnitude differ:** In a constructed set of ten cases, nine errors of one count give ER $=90\%$ and MED $=0.9$. Clearing bit zero of a uniformly distributed unsigned integer from $0$ to $255$ gives ER $=50\%$ and MED $=0.5$, but MRED depends on the nonzero reference values; it is not a universal $0.01\%$. Neither metric alone proves visibility or acceptability.

> **A complete adder example:** Take a 16-bit lower-part OR adder (LOA) with $k=8$ approximate low bits, no carry-in, a 17-bit output, and independent, uniformly distributed inputs. Its output is wrong unless the two low bytes have no 1 bit in the same position, so ER $=1-(3/4)^8\approx89.99\%$. Most of those errors are small: MED $=47.875$ and the largest error is $128$, so NMED $=47.875/131070\approx3.65\times10^{-4}$ with $D_{\max}=2^{17}-2$. These values come from the full LOA model, including the boundary carry $A_7\land B_7$. Because the error depends only on the two low bytes, checking all $2^{16}$ low-byte pairs covers the whole input domain. A high ER here does not mean large errors. The derivation is on the adder page: [LOA error example](../taxonomy/adders.md#loa-error-example).

#### 7. Mean Error ($ME$) / Statistical Bias
The signed average error produced by the circuit:

$$ME = \frac{1}{|S|} \sum_{(A,B) \in S} \Big(Y_{\text{approx}}(A, B) - Y_{\text{exact}}(A, B)\Big)$$

For signed errors $e_i=Y_{\text{approx},i}-Y_{\text{exact},i}$, the accumulated error is $\sum_i e_i$ if the accumulator itself is exact and does not overflow. Zero expected error implies zero expected accumulated error, not a near-zero error in every run. Its variance is $\sum_i\operatorname{Var}(e_i)+2\sum_{i<j}\operatorname{Cov}(e_i,e_j)$; independence is an additional assumption.

### 2. Downstream Application Quality Metrics

Numerical metrics alone do not tell the whole story. We evaluate approximate arithmetic across real-world downstream perceptual and machine learning metrics:

#### 🖼️ Peak Signal-to-Noise Ratio ($PSNR$)
Used in computer vision and image processing. It measures the ratio between the maximum possible pixel energy and the Mean Squared Error ($MSE$):

$$MSE = \frac{1}{M \times N} \sum_{x=0}^{M-1} \sum_{y=0}^{N-1} \Big(I_{\text{exact}}(x, y) - I_{\text{approx}}(x, y)\Big)^2$$

$$PSNR = 10 \cdot \log_{10}\left( \frac{MAX_I^2}{MSE} \right)$$

* For 8-bit grayscale images, $MAX_I = 255$.
* For nonzero MSE and $MAX_I=255$, this also equals $20\log_{10}(255/\sqrt{MSE})$.
* Compare a nonempty, aligned region with the same pixel quantization and reference processing. MSE $=0$ gives infinite PSNR; any positive MSE gives finite PSNR.
* No fixed PSNR level guarantees perceptual equivalence. Wang et al., Section II, describe why identical MSE values can correspond to different visible distortions.

<a id="same-mse-example"></a>

##### Same MSE, different structure

Wang et al. (Fig. 2) show an 8-bit "Boat" image, panel (a), and five distorted versions, panels (b)–(f). Each distorted image has MSE $=210$ relative to the original, so all five have the same PSNR, $10\log_{10}(255^2/210)\approx24.91$ dB (computed here from the MSE; the figure reports only MSE and MSSIM). The original is the reference, not a sixth distortion. Their whole-image MSSIM values differ widely:

| Fig. 2 panel | Distortion | MSE vs. original | MSSIM |
| :--- | :--- | ---: | ---: |
| (b) | Contrast stretch | 210 | 0.9168 |
| (c) | Mean shift | 210 | 0.9900 |
| (d) | JPEG compression | 210 | 0.6949 |
| (e) | Blur | 210 | 0.7052 |
| (f) | Salt-and-pepper impulsive noise | 210 | 0.7748 |

The mean shift shows why. MSE equals the squared mean error plus the error variance. A constant offset adds only to the mean term. It leaves each window's variance, and its covariance with the original, unchanged, so only SSIM's luminance term is affected. When an error is a sum of components, its variance includes their covariances, $\operatorname{Var}(e_1+e_2)=\operatorname{Var}(e_1)+\operatorname{Var}(e_2)+2\operatorname{Cov}(e_1,e_2)$; it is not just the sum of the variances.

The two metrics can even rank images in opposite orders. In Fig. 7, the JPEG2000-compressed image in panel (e) has PSNR $34.56$ dB and MSSIM $0.9409$, while the one in panel (f) has a lower PSNR, $33.47$ dB, but a higher MSSIM, $0.9747$. The figure places the compressed panels (d)–(f) in a row beneath three different originals, (a)–(c), so (e) and (f) are apparently compressions of different images rather than two distortions of one; the example shows only that the two scores can disagree, not which one matches human judgment.

**Region and reference are part of the score.** Both metrics are computed *against a stated reference image, over a stated region*. Changing which pixels are compared, or comparing against a re-encoded reference, changes both numbers. A PSNR figure without its reference image, its region and its bit depth is not comparable with another figure, even when both use $255$ as the peak.

#### 🧠 Structural Similarity Index ($SSIM$)
While $PSNR$ measures raw pixel squared errors, $SSIM$ models the human visual system's perception of **luminance ($l$), contrast ($c$), and structure ($s$)**:

$$SSIM(x, y) = [l(x, y)]^\alpha \cdot [c(x, y)]^\beta \cdot [s(x, y)]^\gamma$$

For the standard choice $\alpha=\beta=\gamma=1$ and $C_3=C_2/2$, this simplifies to:

$$SSIM(x, y) = \frac{(2\mu_x\mu_y + C_1)(2\sigma_{xy} + C_2)}{(\mu_x^2 + \mu_y^2 + C_1)(\sigma_x^2 + \sigma_y^2 + C_2)}$$

Here $x,y$ are local image windows; the means, variances, covariance, positive stabilizing constants, dynamic range and window weights must be specified. Whole-image MSSIM averages local values. The simplification is not valid for arbitrary exponents (Wang et al., equations 12–13).

* For the standard real-valued formula with valid statistics, the score is bounded by $[-1,1]$; identical compared windows give $1$. Do not interpret every implementation or a rounded reported score as an identity proof.
* SSIM is a quality metric, not a universal acceptance or safety threshold.

A worked convolution example — including what a single output pixel can and cannot tell you about image-wide PSNR — is on [Human eyes and pixels](../bridge/human-eyes-and-pixels.md).

### 📚 Primary Literature & IEEE Citations

- **Comprehensive Survey on Approximate Arithmetic Metrics**:  
  J. Liang, J. Han and F. Lombardi, *"New Metrics for the Reliability of Approximate and Probabilistic Adders"*, IEEE Transactions on Computers, definitions of ED/MED/NED ([author manuscript](https://www.ece.ualberta.ca/~jhan8/publications/Adder-TC-May28_FinalSubmission.pdf)). The numerical examples here are independently computed, not measurements from that paper.
- **SSIM Quality Assessment**:  
  Z. Wang, A. C. Bovik, H. R. Sheikh and E. P. Simoncelli, *"Image Quality Assessment: From Error Visibility to Structural Similarity"*, IEEE Transactions on Image Processing, 13(4), 600–612, 2004, Section II, equations 12–13, Fig. 2 and Fig. 7 ([author manuscript](https://www.cns.nyu.edu/pub/lcv/wang03-preprint.pdf), [author publication record](https://eceweb.uwaterloo.ca/~z70wang/publications/ssim.html)). Preprint page numbering differs from the final journal pagination; the formula locators are explicit.
