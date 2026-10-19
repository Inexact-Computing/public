# Comprehensive Glossary of Inexact & Approximate Computing


<a id="reading-desk"></a>

## Reading desk: enough vocabulary to start

**Use this page as a lookup, not a list to memorize.** Start with [bits and carries](start/bits-and-carry.md) or [the first reading route](index.md#first-visit-five-short-stops), look up an unfamiliar word, then return to the example. The original detailed entries and their scientific conditions remain below this desk.

### Numbers, costs and evidence

| Word or symbol | Plain meaning and a small example | Next stop |
|---|---|---|
| Exact reference / baseline | The answer or design specified for comparison, including width, rounding and overflow. “Exact” does not mean infinite precision in every setting. A different reference can give a different error score. | [Simple metrics](fundamentals/error-metrics-made-easy.md) |
| Signed error / bias | Error = approximate − reference; 9 instead of 10 gives −1. Bias is the mean signed error over a declared collection. A zero mean does not promise an exact answer on each input. | [Error propagation](fundamentals/motivations-and-challenges.md) |
| Absolute value / sum / logarithm | abs(−3) = 3 removes the sign. `Σ` means add the listed terms. `log₂ 8 = 3` asks which power of 2 gives 8. The detailed pages introduce each use. | [Mathematical metrics](fundamentals/error-metrics.md) |
| Power and energy | Power is energy per time: 1 W = 1 J/s. At constant average power over the specified interval, energy = power × time. 30 mW × 2 ns = 60 pJ. A clock cycle is not automatically a complete task. | [Why inexact?](fundamentals/why-approximate-computing.md) |
| Small units | `m` = one thousandth, `n` = one billionth, `p` = one trillionth: 1 ns = 10⁻⁹ s; 1 pJ = 10⁻¹² J. Delay uses time; area may use mm² or µm². Compare matching units and conditions. | [Cost example](fundamentals/why-approximate-computing.md) |
| Percentage points | Accuracy moving from 90% to 88% loses 2 percentage points; its relative decrease is 2/90 ≈ 2.22%. State which you mean. | [AI case study](bridge/ai-and-approximate-math.md) |
| Workload / input domain / evidence | A workload is the actual task and data; a domain lists allowed inputs. A five-row exercise describes those rows. A measurement, a simulation, a projection and a hand example support different claims. | [History](fundamentals/history-and-evolution.md) |

### Images, representations and applications

| Word | Plain meaning and boundary | Next stop |
|---|---|---|
| Pixel / weighted average | An 8-bit grayscale pixel is a brightness integer 0–255. Multiply neighboring values by stated weights, add, then divide by the weight sum. Nonnegative weights with a positive sum give an average within the input range. | [Pixels](bridge/human-eyes-and-pixels.md) |
| Comparison region / MSE / PSNR | Fix which aligned pixels are compared. MSE averages squared differences; PSNR uses that MSE and a specified peak value. At MSE = 0, PSNR is infinite. Equal scores need not look equally good. | [Image scores](bridge/human-eyes-and-pixels.md) |
| Bit position / spatial frequency | A bit's weight changes one number's amplitude. Spatial frequency describes variation across neighboring pixels. A small low-bit error is not automatically invisible. | [Image patterns](bridge/human-eyes-and-pixels.md) |
| Quantization / scale S / zero-point Z | Store values on a discrete grid. With S = 0.5 and Z = 0, integer q = 5 represents 2.5. Rounding and clipping rules matter. Exact arithmetic on these stored values differs from an inexact circuit. | [AI worked layer](bridge/ai-and-approximate-math.md) |
| Training / inference / ReLU | Training adjusts a model's weights; inference evaluates a trained model. ReLU outputs max(0, x). Neither phase nor the activation guarantees tolerance of arithmetic error. | [AI distinctions](bridge/ai-and-approximate-math.md) |

### Looking inside a circuit or system

| Word | Plain meaning and boundary | Next stop |
|---|---|---|
| Partial product / column truncation | In binary multiplication, input-bit products have weights 2^(i+j). Removing low-weight products before adding them can lose carries; it differs from clearing bits in a finished product. | [Multipliers](taxonomy/multipliers.md#mul-start) |
| 4:2 compressor | Four same-column bits plus a carry-in are reduced to Sum of weight 1 and two carries each of weight 2, relative to that column. “4:2” does not mean the carries have weights 2 and 4. | [Multiplier lesson and lab](taxonomy/multipliers.md) |
| Reciprocal normalization | Write a positive divisor as D = 2^e × d with 1 ≤ d < 2, then approximate 1/d on that smaller interval. Finite-width shifts and products still need rounding/overflow rules. | [Dividers](taxonomy/dividers.md#div-start) |
| MAC / PE | Multiply–accumulate: form a product and add it to a running total. A processing element (PE) is a local compute unit, often a MAC with registers. Architecture determines what else it contains. | [Accelerators](taxonomy/accelerators.md#acc-start) |
| Mean-error compensation | Offset a measured or modelled mean arithmetic error. It targets an expectation under the profiled conditions, not the error of every output. | [Accelerator compensation](taxonomy/accelerators.md) |
| Operation count | Number of arithmetic steps in a stated algorithm. It is not a count of physical hardware units or an energy measurement. | [Transforms](taxonomy/transforms.md#trf-start) |
| Refresh window / command interval | A refresh window covers refreshing all rows; a command interval is the gap between refresh commands. They are different times. Relaxing refresh can increase retention failures. | [Memory](taxonomy/memory.md#mem-start) |
| SEC–DED | Single-error correction and double-error detection within a protected codeword, under the code's assumptions. It does not promise to handle arbitrary multi-bit errors or unprotected data. | [Memory protection](taxonomy/memory.md) |

<details markdown="1">
<summary>Two quick lookup checks</summary>

**Glossary check 1.** A 2 ns operation uses 30 mW average power throughout that interval. Which quantity is 60 pJ? **Energy**, because power × time = energy. Power itself remains 30 mW.

**Glossary check 2.** Errors are +1 and −1 on two evaluated inputs. Is every result exact because bias is zero? **No.** The signed mean is zero, but both results differ from their references; their mean absolute error is 1.

</details>

## Detailed definitions and scientific reference


This glossary provides concise definitions, microarchitectural explanations, and mathematical formulas for key concepts, metrics, and circuit topologies used across approximate hardware design and computer engineering.

---

### **ACA (Almost-Correct Adder)**
A speculative adder that limits the inputs used to predict a carry. Accuracy and logic depth depend on the particular look-ahead circuit, window, and recovery scheme; the acronym also appears for accuracy-configurable adders and must not imply one universal model.

### **Accuracy-Configurable / Dual-Mode**
An arithmetic design with multiple accuracy choices. Some implementations support runtime mode selection; others fix parameters at design time. Mode switching, exact recovery and application-quality guarantees require explicit implementation support.

### **APTPU (Approximate Tensor Processing Unit)**
A particular approximate tensor-processing-unit design. Its arithmetic and measured results must be taken from the named implementation; the acronym does not imply logarithmic arithmetic, a compressor architecture, or a universal doubling of compute density. See the [accelerator page](taxonomy/accelerators.md).

### **AXA / LAHAF (Approximate Full Adder Cells)**
Named approximate full-adder cell families that alter the exact truth table to simplify a circuit. Transistor count, error entries, noise margin, and power depend on the specific topology and conditions; they are not fixed properties of all approximate cells.

Example: Yang et al. (IEEE-NANO 2013) simulated three AXA cells with Cadence Spectre in TSMC 65 nm at 1.0 V, against a 10-transistor exact full adder. AXA1 (8 transistors) gets Sum and Cout right for 4 of the 8 input combinations each; AXA2 (6 transistors) gets Sum right for 4 and Cout for all 8; AXA3 (8 transistors) gets Sum right for 6 and Cout for all 8. Their total error distances are 4, 4 and 2. Dynamic power is 3.872, 3.448 and 3.234 µW versus 4.657 µW for the exact cell, but AXA1's static power is higher (72.82 versus 56.02 nW). These are single-cell results, not multi-bit adders; see the [adder page](taxonomy/adders.md).

### **Bit and Bit Weight**
A bit is a single binary digit, 0 or 1. In an unsigned binary pattern, each position has a weight: the rightmost bit is worth 1, and each step to the left doubles the weight (1, 2, 4, 8, …). Add the weights whose bits are 1; for example, 1011 = 8 + 2 + 1 = 11. See [Bits and Carries](start/bits-and-carry.md#read-b01).

### **Booth Encoding (Radix-4 / Radix-8)**
Radix-4 recoding uses digits $\{0,\pm1,\pm2\}$ and generates about $\lceil N/2\rceil$ partial-product rows. Radix-8 uses $\{0,\pm1,\pm2,\pm3,\pm4\}$ and about $\lceil N/3\rceil$ rows; generating $3Y$ requires additional handling. Signed extension and boundary conventions affect the final implementation.

### **Carry (Carry-In / Carry-Out)**
When one column of a binary addition totals 2 or 3, write its sum bit (0 or 1) and send a 1 into the next column on the left. That carry-out becomes the next column's carry-in, at twice the positional weight. A carry out of the leftmost of N columns needs an extra output bit; storing only N bits discards it. See [Bits and Carries](start/bits-and-carry.md#read-b02).

### **Carry-Chain Statistics**
Typical carry propagation and worst-case carry propagation differ. Statistical statements need a specified input distribution and definition of a carry run. Burks, Goldstine and von Neumann (1946, Section 5.6) showed that, for two binary words of length $n$ with random digits, the longest carry sequence has an average length of at most $\log_2 n$; for $n=40$ they give the actual average as $4.62$, against a bound of about $5.3$. That result concerns their random-digit model, not the delay of every adder (see [history](fundamentals/history-and-evolution.md)).

### **CORDIC (Coordinate Rotation Digital Computer)**
An iterative family using shifts and additions for circular or hyperbolic rotations and vectoring. Angle tables, convergence ranges, repeated hyperbolic stages, finite precision and scale compensation depend on the mode. Eliminating general multipliers in the recurrence does not eliminate all implementation costs.

### **CSF (Contrast Sensitivity Function)**
A description of contrast sensitivity versus spatial frequency under specified viewing conditions. Peak sensitivity is not one fixed value for all observers, luminance levels, and stimuli; bit significance describes amplitude rather than spatial frequency.

### **Dark Silicon**
The portion of a chip that cannot be active simultaneously under its power budget. The fraction depends on device, architecture, and workload models; it is not a universal exponentially increasing density or a guarantee that a chip would melt. Esmaeilzadeh et al. (ISCA 2011) projected from such models that 21% of a fixed-size chip must be powered off at 22 nm and more than 50% at 8 nm; these are model projections, not chip measurements.

### **DRAM Refresh Relaxation**
Extending refresh intervals for selected data can reduce refresh activity but increase retention errors. The baseline interval, temperature, device, stored data and measured energy must be specified; no universal interval or savings percentage is implied. Example: in RAIDR's simulation (ISCA 2012; 8 cores, 32 GB DDR3-1333, auto-refresh baseline), refresh operations fell by 74.6%, and energy per memory access fell by 8.3% in the normal temperature range or 16.1% in the extended range; see the [published refresh studies](taxonomy/memory.md#published-refresh-studies).

### **DRUM (Dynamic Range Unbiased Multiplier)**
For the unsigned reference design, select a $k$-bit window relative to each operand's leading one. When bits are discarded, force the retained window's least-significant bit to one; multiply the retained operands and restore the discarded shift. Zero is handled separately. This is not ordinary rounding or an assertion of zero error for every input (see [multiplier definition and source](taxonomy/multipliers.md)).

### **ED (Error Distance) and Signed Error**
For one input, signed error is e = approximate − exact; positive means the approximate result is too high. Error distance is its size, ED = |e|. Both use the same units as the results. See [How Do We Grade Mistakes?](fundamentals/error-metrics-made-easy.md#read-e01).

### **EDP (Energy-Delay Product)**
A primary hardware figure of merit defined as:

$$\text{EDP} = E_{\text{operation}} \times t_{\text{delay}}$$

Only if the measured energy is $P\,t_{\text{delay}}$ under the same measurement interval does this equal $P\,t_{\text{delay}}^2$. Pipeline latency, cycle time, throughput, and total task energy must not be interchanged.

### **ER (Error Rate)**
The fraction of evaluated inputs for which the approximate circuit output differs from the exact reference result:

$$\text{ER} = \frac{1}{|S|} \sum_{x \in S} \mathbb{I}(Y_{\text{approx}}(x) \neq Y_{\text{exact}}(x))$$

Here $S$ is a nonempty evaluated collection. For a hand-made table, every listed row counts once, including repetitions; its ER describes that collection, not all unseen inputs.

### **Full Adder**
A one-column adding circuit with three input bits (A, B and an incoming carry) and two outputs: Sum and Cout. Relative to this column, Sum is worth 1 and Cout is worth 2, so the number of input 1s equals Sum + 2 × Cout. Chaining full adders gives a ripple-carry adder. See [Bits and Carries](start/bits-and-carry.md#read-b02).

### **GeAr (Generic Accuracy Configurable Adder)**
A configurable speculative-adder design using overlapping sub-adders. Word length, overlap, emitted sum bits and optional correction depend on the chosen configuration; one unverified parameter-letter convention is not imposed here.

### **Input Distribution**
How often each allowed input is used in an evaluation. ER, MED and MRED depend on the input mix and the stated metric rules. A hand-made table gives equal weight to each listed row; repetitions count again. Its averages describe that collection, not unseen inputs. See [How Do We Grade Mistakes?](fundamentals/error-metrics-made-easy.md#read-e03).

### **LEAD (Logarithmic Exponent Approximate Divider)**
A named logarithmic approximate-divider design. A log-domain division model applies to positive operands with $D\ne0$; zero, signed operands, normalization, interpolation and result rounding require explicit handling. The algorithm name does not by itself establish single-cycle timing.

### **LOA (Lower-Part OR Adder)**
In the conventional unsigned LOA with no external carry-in, the low $k$ bits use OR, and $A_{k-1}\land B_{k-1}$ supplies the carry to an exact upper part. Preserve $N+1$ output bits for a full-width sum. A design with a different boundary carry is a different model.

### **Logic Gates (AND, OR, XOR)**
A gate takes input bits and gives one output bit. For two inputs, AND gives 1 only when both are 1; OR gives 1 when at least one is 1; XOR gives 1 when exactly one is 1. None of these gates alone adds two bits completely: OR never produces a carry. See [Bits and Carries](start/bits-and-carry.md#read-b02).

### **MED (Mean Error Distance)**
The average absolute arithmetic error over the nonempty evaluated collection $S$:

$$\text{MED} = \frac{1}{|S|} \sum_{x \in S} |Y_{\text{approx}}(x) - Y_{\text{exact}}(x)|$$

Every evaluated row counts once, including rows with zero error. MED alone does not state how often errors occur or how large the largest error is.

### **Mitchell's Logarithmic Algorithm**
A linear piecewise approximation of base-2 logarithms: $\log_2(1+x) \approx x$ for $x \in [0, 1)$, enabling multiplication and division to execute via fast integer addition and subtraction.

### **MRED (Mean Relative Error Distance)**
The average relative error ratio over evaluated cases with nonzero exact output. Multiply by $100$ to express a percentage:

$$S^* = \{x\in S:Y_{\text{exact}}(x)\ne0\},\qquad \text{MRED} = \frac{1}{|S^*|}\sum_{x\in S^*}\frac{|Y_{\text{approx}}(x)-Y_{\text{exact}}(x)|}{|Y_{\text{exact}}(x)|}$$

It is undefined when $S^*$ is empty; report excluded cases separately.

### **NMED (Normalized Mean Error Distance)**
Mean Error Distance normalized by a stated positive exact-reference magnitude $D_{\text{max}}$. Distribution and representation still matter when comparing designs:

$$\text{NMED} = \frac{\text{MED}}{D_{\text{max}}}$$

### **Observed Maximum Error**
The largest error distance among the inputs actually evaluated. A small sample does not establish the Worst-Case Error (WCE) over all allowed inputs; that requires full-domain checking or a proof. See [How Do We Grade Mistakes?](fundamentals/error-metrics-made-easy.md#read-e03).

### **PSNR (Peak Signal-to-Noise Ratio)**
An engineering metric measured in decibels (dB) assessing reconstructed signal/image fidelity against ground truth:

$$\text{PSNR} = 10 \cdot \log_{10}\left( \frac{\text{MAX}_I^2}{\text{MSE}} \right)$$

### **RED (Relative Error Distance)**
For a nonzero exact result, RED = ED / |exact|. At exact result 0, RED is undefined; exclude that row only from RED/MRED, report the exclusion, and still count its error size and correctness in MED and ER. See [How Do We Grade Mistakes?](fundamentals/error-metrics-made-easy.md#read-e03).

### **RoBA (Rounding-Based Approximate Multiplier)**
For nonnegative operands, RoBA selects powers of two by numerical distance, not by rounding $\log_2(A)$. Its approximation is $A_rB+AB_r-A_rB_r$ and zero must be handled explicitly. The original unsigned rule chooses $3\to2$ at that tie and otherwise rounds power-of-two midpoints upward; signed variants need their own contract (see [original source and arithmetic](taxonomy/multipliers.md)).

### **SNM (Static Noise Margin)**
A metric of 6T SRAM bitcell electrical stability defining the maximum DC noise voltage that can be tolerated at the internal storage nodes without flipping the stored bit.

### **SSIM (Structural Similarity Index Measure)**
A local image-window quality metric combining luminance, contrast and structure. The standard simplified form below assumes unit exponents, $C_3=C_2/2$, valid window statistics and positive stabilizing constants:

$$\text{SSIM}(x, y) = \frac{(2\mu_x\mu_y + c_1)(2\sigma_{xy} + c_2)}{(\mu_x^2 + \mu_y^2 + c_1)(\sigma_x^2 + \sigma_y^2 + c_2)}$$

### **Systolic Array**
A network of processing elements in which data moves rhythmically between neighbors. A two-dimensional mesh for matrix multiplication ($C=AB$) is one important example; systolic arrays are not restricted to that geometry or task.

### **Truth Table**
A table listing every combination of input bits and its output. Two inputs give four rows; three inputs, as in a full adder, give eight. See [Bits and Carries](start/bits-and-carry.md#read-b02).

### **VOS (Voltage Over-Scaling)**
Reducing $V_{DD}$ below the value required to meet a stated timing constraint can cause timing errors. Error location and frequency depend on paths and inputs; their rarity or application tolerance is not automatic. Low-voltage operation that still meets timing is not necessarily approximate.

### **Wallace / Dadda Reduction Tree**
Exact carry-save reduction trees reduce partial-product rows to two vectors for a final carry-propagate addition. Gate levels depend on topology and implementation. In a conventional 4:2 compressor column, the numeric identity is input sum $=S+2C+2C_{\text{out}}$; the two carries share the next column's weight, not distinct binary weights two and four.

### **WCE (Worst-Case Error)**
The maximum absolute error magnitude that the approximate circuit can produce across the entire input space:

$$\text{WCE} = \max_{x \in S} |Y_{\text{approx}}(x) - Y_{\text{exact}}(x)|$$

For WCE, $S$ must be the full specified domain and the bound established by proof or exhaustive evaluation; a sampled maximum is not a full-domain guarantee. All mean metrics above require a nonempty collection and declared sampling weights. PSNR requires a nonempty aligned comparison region, a specified pixel range and quantization; only zero MSE gives infinite PSNR.

Sources for the definitions: Han and Orshansky, ETS 2013, Sections II–IV ([author manuscript](https://www.ece.ualberta.ca/~jhan8/publications/ApproCompReview_final.pdf)); Liang, Han and Lombardi, *New Metrics for the Reliability of Approximate and Probabilistic Adders*, definitions of ED/MED/NED ([author manuscript](https://www.ece.ualberta.ca/~jhan8/publications/Adder-TC-May28_FinalSubmission.pdf)); Wang, Bovik, Sheikh and Simoncelli, IEEE TIP 2004, equations 12–13 ([author manuscript](https://www.cns.nyu.edu/pub/lcv/wang03-preprint.pdf)). Design-specific sources are provided on the corresponding circuit pages. The few published results quoted in entries above (AXA, carry statistics, dark silicon, RAIDR) are simulations, models or analyses, as stated there; this glossary does not assert measured PPA savings. Their sources: Yang, Jain, Liang, Han and Lombardi, *Approximate XOR/XNOR-based Adders for Inexact Computing*, IEEE-NANO 2013, Sections III–IV and Table 2 ([author manuscript](http://www.ece.ualberta.ca/~jhan8/publications/AXA_25.pdf)); Burks, Goldstine and von Neumann, *Preliminary Discussion of the Logical Design of an Electronic Computing Instrument*, 1946, Section 5.6 ([transcription](https://safari.ethz.ch/architecture/fall2023/lib/exe/fetch.php?media=logical_design_of_an_electronic_computing_instrument.pdf)); Esmaeilzadeh et al., *Dark Silicon and the End of Multicore Scaling*, ISCA 2011, abstract ([paper](https://www.cs.cmu.edu/~18742/papers/Esmaeilzadeh2011.pdf)); Liu, Jaiyen, Veras and Mutlu, *RAIDR: Retention-Aware Intelligent DRAM Refresh*, ISCA 2012, Sections 5 and 6.1–6.3 ([author copy](https://users.ece.cmu.edu/~omutlu/pub/raidr-dram-refresh_isca12.pdf)).
