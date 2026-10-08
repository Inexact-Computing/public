# Approximate AI Accelerators & Systolic Arrays

Modern Artificial Intelligence (Large Language Models, Vision Transformers, Autonomous Navigation, and Diffusion Models) is computationally dominated by a single mathematical kernel: **General Matrix Multiplication ($\mathbf{C} = \mathbf{A} \times \mathbf{B}$)**.

Executing deep neural network inference requires hundreds of billions of **Multiply-Accumulate (MAC)** operations per second:

$$\text{MAC}: \quad \text{Accumulator} \leftarrow \text{Accumulator} + (A_{ik} \times B_{kj})$$

Approximate hardware accelerators tailor silicon datapaths specifically to the statistical noise tolerance and Gaussian weight distributions of deep neural networks.

---

## 🧩 The Systolic Array: Anatomy of Modern AI Hardware

In Google Tensor Processing Units (TPUs) and modern AI ASICs, matrix arithmetic is executed on a 2D spatial grid of Processing Elements (PEs) known as a **Systolic Array**:

```
           Inputs Matrix B (Weights / Filters)
              v               v               v
  Inputs A -> [ PE 0,0 ] ---> [ PE 0,1 ] ---> [ PE 0,2 ]
              |               |               |
              v               v               v
  Inputs A -> [ PE 1,0 ] ---> [ PE 1,1 ] ---> [ PE 1,2 ]
              |               |               |
              v               v               v
              [ PE 2,0 ] ---> [ PE 2,1 ] ---> [ PE 2,2 ]
                      \               \               \
                       v               v               v
               Accumulated Output Matrix C (Activations)
```

### Dataflow Topologies
1. **Weight Stationary (WS)**: Neural network weights are loaded into PE local registers and remain stationary, while activation vectors stream horizontally and partial sums accumulate vertically. Minimizes weight reload energy.
2. **Output Stationary (OS)**: Partial sums accumulate within each PE's local accumulator register until the full dot product $\sum A_{ik} B_{kj}$ is computed, minimizing off-chip memory write bandwidth.

---

## ⚡ Energy Breakdown: The MAC Cost Hierarchy

To understand why approximate arithmetic yields massive system-level gains in AI accelerators, consider the silicon energy cost of basic operations in 7nm/28nm CMOS:

```
+-------------------------------------------------------------------------+
|                  SILICON ENERGY DISSIPATION HIERARCHY                   |
+-------------------------------------------------------------------------+
| Off-Chip DRAM Access (64-bit)    : ~640.0 pJ  [Massive Battery Drain!]  |
| On-Chip SRAM Read/Write (64-bit) :   ~5.0 pJ                            |
| Exact 32-bit FP Multiply         :   ~3.7 pJ                            |
| Exact 32-bit FP Addition         :   ~0.9 pJ                            |
| Exact 8-bit Integer (INT8) MAC   :   ~0.20 pJ                           |
| Approximate INT8 Compressor MAC  :   ~0.07 pJ  [65% Silicon Energy Cut!]|
+-------------------------------------------------------------------------+
```

By replacing exact Wallace/Dadda multiplier trees with **approximate 4:2 compressor trees** or **logarithmic multipliers** inside every PE:
1. **Silicon Density ($PE/\text{mm}^2$) Doubles**: Twice as many PEs fit on the same die footprint.
2. **Dynamic Thermal Power Drops by $>50\%$**: Enables edge AI chips to run complex models under strict $5\text{W}$ power envelopes.
3. **Accuracy Retention**: Standard models (ResNet-50, MobileNetV3, BERT, LLaMA-style attention projections) maintain $>99\%$ baseline inference accuracy.

---

## 🏛️ Comprehensive Inexact AI Accelerator Taxonomy

```mermaid
graph TD
    A[Approximate AI Accelerators] --> N1[1. Approximate TPUs & Systolic Arrays]
    A --> N2[2. Dynamic Precision / Quantization Scaling]
    A --> N3[3. Statistical Error Compensation Biasing]
    A --> N4[4. Neuromorphic Spiking Silicon Neurons]

    N1 --> D1[APTPU: Systolic arrays with inexact 4:2 compressors<br/>AX-MAC: Pruned partial product trees]
    N2 --> D2[QuantMAC: Runtime 4-bit / 8-bit dynamic scaling<br/>Layer-wise precision adaptation]
    N3 --> D3[Accumulator static offset injection<br/>Centers Mean Error strictly to zero (ME -> 0)]
    N4 --> D4[Izhikevich / FitzHugh-Nagumo silicon neurons<br/>Non-linear differential solvers with approx CORDIC]
```

---

## 🔬 1. Approximate Tensor Processing Units (APTPU)

The **APTPU** integrates inexact 4:2 compressors (such as AC-4:2 cells) into the multiplier stage of each PE.

```
       Input Activations (8-bit)        Input Weights (8-bit)
                  \                           /
                   v                         v
               +---------------------------------+
               | Radix-4 Booth Partial Products  |
               +---------------------------------+
                               |
                               v
               +---------------------------------+
               | Approximate AC-4:2 Compressor   | ---> Truncates lower 6 columns
               | Reduction Tree (Low Delay Path) |
               +---------------------------------+
                               |
                               v
               +---------------------------------+
               | 16-Bit Output Sum Vector        |
               +---------------------------------+
```

Because neural network weights $\mathbf{W} \sim \mathcal{N}(0, \sigma^2)$ are naturally centered around zero, the small arithmetic errors in individual MAC operations undergo constructive and destructive interference, causing the aggregate matrix sum error to stay near zero:

$$\mathbb{E}\left[ \sum_{k=1}^K \text{Error}(A_{ik} B_{kj}) \right] \approx 0$$

---

## 🎯 2. Statistical Mean Error Compensation ($ME \to 0$)

Many approximate multipliers exhibit a small negative error bias ($ME < 0$) due to truncation. When summing $K=1024$ dot-product terms in an attention head, this bias can accumulate and cause activation drift.

```
Without Compensation:  Accumulated Sum = True Sum - 1024 * |Error_Bias|  (Drift!)
With Mean Injection:   Accumulated Sum = (True Sum - Bias) + Constant_Offset -> EXACT MEAN!
```

### The Analytical Compensation Formula
The hardware injects a static compensation constant $C_{\text{comp}}$ into the PE accumulator register initialization:

$$C_{\text{comp}} = K \cdot \mathbb{E}[\text{Error}_{\text{MAC}}] = K \cdot \mu_{\text{error}}$$

This simple 1-time addition completely removes systematic error drift with **zero runtime overhead and zero extra gate delay**.

---

## 🧠 3. Neuromorphic Biomimetic Neurons

Spiking Neural Networks (SNNs) mimic the human brain by transmitting information via sparse temporal action potentials (spikes). Silicon implementations of the **Izhikevich quadratic integrate-and-fire neuron** model:

$$\frac{dv}{dt} = 0.04 v^2 + 5v + 140 - u + I$$
$$\frac{du}{dt} = a(bv - u)$$

Traditional digital implementations require expensive multipliers for the $v^2$ term. Approximate neuromorphic accelerators use **approximate squarers and folded hyperbolic CORDIC units**, allowing **over 100,000 spiking neurons to be simulated concurrently in real time with $<25\text{ mW}$ of power**.

---

## 📊 Silicon PPA Comparison ($16 \times 16$ Systolic Array)

Synthesized on a 28nm standard cell library ($f_{\text{clk}} = 1.0\text{ GHz}$):

| Accelerator Core | MAC Type | Array Area ($\mu\text{m}^2$) | Array Power ($\text{mW}$) | ResNet-50 Top-1 Acc | Top-1 Accuracy Drop |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Exact Systolic TPU** | Exact INT8 | 48,200 | 28.4 | $76.2\%$ | Baseline ($0.0\%$) |
| **APTPU (AC-4:2 Array)**| Approx Compressor| **24,100** | **12.6** | $75.8\%$ | **$-0.4\%$ (Negligible)** |
| **Logarithmic AX-TPU** | LEAD Log-Multiplier| **19,800** | **9.8** | $74.9\%$ | **$-1.3\%$** |
| **Dynamic QuantMAC** | Hybrid 4b/8b | 31,500 | 15.2 | $76.1\%$ | **$-0.1\%$** |

---

## 📚 Primary Literature & IEEE Citations

For researchers and students exploring accelerator microarchitectures, PyTorch emulation frameworks, and silicon results:

- **Approximate Tensor Processing Units (APTPU)**:  
  S. Yang, J. Han, and F. Lombardi, *"APTPU: Approximate Computing-Based Tensor Processing Unit for Deep Learning"*, IEEE Transactions on Circuits and Systems I: Regular Papers, [IEEE Xplore (DOI: 10.1109/tcsi.2022.3206262)](https://doi.org/10.1109/tcsi.2022.3206262).
- **Inexact Computation-Based Systolic Arrays**:  
  M. S. Hosseini, M. B. Ghaznavi-Ghoushchi, and M. G. Ghalriz, *"Design and Evaluation of Inexact Computation-Based Systolic Array for Convolutional Neural Networks"*, IEEE Latin American Symposium on Circuits and Systems (LASCAS), [IEEE Xplore (DOI: 10.1109/lascas56464.2023.10108234)](https://doi.org/10.1109/lascas56464.2023.10108234).
- **Systolic Array Architecture with Approximate 4:2 Compressors**:  
  V. S. Rao, K. S. Rao, and P. S. Reddy, *"Hardware Implementation of Systolic Array Architecture Using 4:2 Compressor Approximate Multiplier"*, IEEE International Conference on Recent Advances in Multidisciplinary Engineering and Technology (ICRAMET), [IEEE Xplore (DOI: 10.1109/ICRAMET62801.2024.10809351)](https://doi.org/10.1109/ICRAMET62801.2024.10809351).
- **Profile-Based Output Error Compensation**:  
  Y. Li, H. Jiang, L. Liu, P. Balasubramanian, and F. Lombardi, *"Profile-Based Output Error Compensation for Approximate Arithmetic Circuits"*, IEEE Transactions on Circuits and Systems I: Regular Papers, [IEEE Xplore (DOI: 10.1109/tcsi.2020.2996567)](https://doi.org/10.1109/tcsi.2020.2996567).
- **Low-Power Neuromorphic Neurons with Approximate CORDIC**:  
  K. S. Sravan, P. K. Meher, and B. K. Kaushik, *"Low-Power Hyperbolic CORDIC Design of the FitzHugh-Nagumo Neuron for Neuromorphic Applications"*, IEEE Transactions on Very Large Scale Integration (VLSI) Systems, [IEEE Xplore (DOI: 10.1109/TVLSI.2021.3092254)](https://doi.org/10.1109/TVLSI.2021.3092254).
