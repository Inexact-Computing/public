<a id="approximate-transforms-dct-fft"></a>

# 近似变换：DCT与FFT

变换算法将数字信号在<strong>空间域／时域</strong>与<strong>频域</strong>之间转换，是现代通信、多媒体处理和生物医学遥测中的核心计算方法：

- <strong>离散余弦变换（Discrete Cosine Transform，DCT）</strong>：用于JPEG及变换编码；H.264/AVC和H.265/HEVC采用规范指定的整数类DCT变换，并不直接使用浮点DCT核。
- <strong>快速傅里叶变换（Fast Fourier Transform，FFT）</strong>：高效计算离散傅里叶变换（Discrete Fourier Transform，DFT），例如用于正交频分复用（OFDM）处理和频谱分析。

变换近似会改变输出频谱。能否接受取决于信号、量化和应用质量指标；感知上的容忍度不能保证丢弃频率成分或算术误差无害。

<strong>初次阅读？</strong> 你需要掌握平均值和负数加减法。入门部分无需三角函数、矩阵或复数知识，从“一行八个数”讲到“变换如何描述这些数，以及近似变换改变什么”。标有“深入阅读”的内容，包括余弦公式、矩阵和FFT，是本页原有的参考部分，初读时可以跳过。

<strong>读完入门部分，你将能够：</strong>

1. 将八个数描述为均值加上波动，并说明系数衡量什么；
2. 手算仅用加减法的近似变换的八个系数，并据此重建原数列；
3. 解释丢弃系数如何影响重建数值，以及运算次数为何不等于加法器数量或能耗。

<a id="trf-start"></a>

<a id="start-here-eight-brightness-values"></a>

## 从八个亮度值开始

取一条从暗区跨过边缘进入亮区的八个相邻像素（采用通常的0–255亮度标度）。从左到右将位置编号为0至7：

| 位置 | 数值 | 数值 − 均值（15） |
|---:|---:|---:|
| 0 | 10 | −5 |
| 1 | 10 | −5 |
| 2 | 10 | −5 |
| 3 | 10 | −5 |
| 4 | 20 | +5 |
| 5 | 20 | +5 |
| 6 | 20 | +5 |
| 7 | 20 | +5 |

<strong>均值（mean）</strong>为120 ÷ 8 = 15。剩余的<strong>波动（fluctuation）</strong>描述“左边较暗，右边较亮”。变换用八种固定模式各占多少来描述这八个数。每个“多少”就是一个<strong>系数（coefficient）</strong>。模式0平坦，衡量均值；其他模式衡量不同形式的上下起伏。

<a id="patterns-made-of-1-1-and-0"></a>

### 由+1、−1和0组成的模式

精确DCT采用余弦形状的模式；例如模式1为0.981、0.831、0.556、0.195、−0.195、−0.556、−0.831、−0.981。与这些数相乘成本较高。[Potluri等人](#the-potluri-et-al-14-addition-8-point-transform)的近似变换将每种模式替换为仅含+1、−1和0的模式。下表列出各模式中+1、−1的位置，其余位置均为0：

| 模式 | +1的位置 | −1的位置 | 非零项数 |
|---:|---|---|---:|
| 0 | 0, 1, 2, 3, 4, 5, 6, 7 | 无 | 8 |
| 1 | 1 | 6 | 2 |
| 2 | 0, 7 | 3, 4 | 4 |
| 3 | 0 | 7 | 2 |
| 4 | 0, 3, 4, 7 | 1, 2, 5, 6 | 8 |
| 5 | 3 | 4 | 2 |
| 6 | 2, 5 | 1, 6 | 4 |
| 7 | 2 | 5 | 2 |

这就是参考部分中矩阵\(\mathbf T_8\)的八行。

系数是一个匹配分数：将每个数值乘以对应模式项，再相加。模式项只有+1、−1和0时，相当于加上+1位置的数值，减去−1位置的数值，跳过0位置。

<strong>先预测：</strong> 对这一行边缘数据，哪些模式的系数为0？模式0的系数是多少？

<details markdown="1">
<summary>核对八个系数</summary>

| 模式 | 计算 | 系数 |
|---|---|---:|
| 0 | 10 + 10 + 10 + 10 + 20 + 20 + 20 + 20 | 120 |
| 1 | 数值(1) − 数值(6) = 10 − 20 | −10 |
| 2 | 10 − 10 − 20 + 20 | 0 |
| 3 | 数值(0) − 数值(7) = 10 − 20 | −10 |
| 4 | 10 − 10 − 10 + 10 + 20 − 20 − 20 + 20 | 0 |
| 5 | 数值(3) − 数值(4) = 10 − 20 | −10 |
| 6 | −10 + 10 + 20 − 20 | 0 |
| 7 | 数值(2) − 数值(5) = 10 − 20 | −10 |

模式0得到120 = 8 × 均值。模式2、4、6镜像对称（从两端读相同），系数为0，因为边缘行是“先低后高”，不对称。边缘体现在模式1、3、5、7中。

</details>

<a id="trf-rebuild"></a>

<a id="rebuilding-the-numbers-from-the-coefficients"></a>

### 由系数重建数值

这些模式不会因相互重叠而混淆（技术上称为正交）。因此可以分别恢复每种模式：系数除以该模式的非零项数，再乘以模式，将各项相加。模式0在每个位置给出120 ÷ 8 = 15；模式1给出−10 ÷ 2 = −5，因此位置1贡献−5、位置6贡献+5；依此类推。

压缩只保留部分系数。仿照类JPEG编码在二维情况下的做法，保留前面的系数：

| 保留系数 | 重建数值 | 出错位置数 | 最大误差 |
|---|---|---:|---:|
| 仅模式0 | 15 15 15 15 15 15 15 15 | 8 | 5 |
| 模式0–3 | 10 10 15 15 15 15 20 20 | 4 | 5 |
| 全部八个 | 10 10 10 10 20 20 20 20 | 0 | 0 |

保留更少系数时，锐利边缘变成较平缓的阶梯。哪些系数可丢弃而无可见损伤，取决于图像、量化与质量指标；单独这一行不能证明一般结论。

<details markdown="1">
<summary>选读：与同一行数据的精确DCT比较</summary>

下表两种结果均经缩放，使每种模式的长度为1（正交归一化）。精确值使用参考部分的余弦公式；近似值为前述系数除以对应模式非零项数的平方根：

| 系数 | 精确DCT | Potluri近似 |
|---:|---:|---:|
| 0 | 42.43 | 42.43 |
| 1 | −12.81 | −7.07 |
| 2 | 0 | 0 |
| 3 | 4.50 | −7.07 |
| 4 | 0 | 0 |
| 5 | −3.01 | −7.07 |
| 6 | 0 | 0 |
| 7 | 2.55 | −7.07 |

均值项一致。精确DCT将边缘的大部分成分集中于系数1；近似变换则均匀分散在1、3、5、7上。因此对这一行保留系数0–3时，近似变换丢失更多（被丢弃系数的平方和为100），精确DCT约为15.6。一行数据不是图像集；[文献质量表](#published-dct-comparison)报告了特定条件下45幅图像的均值。

</details>

<a id="trf-count"></a>

<a id="counting-operations"></a>

### 统计运算次数

分别计算各系数需要7 + 1 + 3 + 1 + 7 + 1 + 3 + 1 = 24次加减法。Potluri快速版本复用中间和，只需<strong>14</strong>次。直接按定义计算精确DCT，八个输出各需8次乘法、7次加法，总计64次乘法和56次加法。8 × 8块先对8行、再对8列做八点变换，因此需要16 × 14 = 224次加减法。

这些是指定算法的<strong>运算次数（operation count）</strong>。电路可以复用一个加法器14次，也可以使用14个加法器；平方根相关缩放未计入，且可并入量化；能耗还取决于位宽、开关活动和电路。[文献硬件表](#published-dct-comparison)给出了某项综合研究实际报告的指标。

<a id="check-your-understanding"></a>

### 检查你的理解

先在纸上作答，再展开核对。答案不会被保存或发送到任何地方。

<a id="trf-q1"></a>

<strong>问题TRF-1。</strong> 一行八个位置的数值均为12。它的八个系数是多少？

<a id="trf-q2"></a>

<strong>问题TRF-2。</strong> 对边缘行10 10 10 10 20 20 20 20，只保留模式0和1，重建数值是多少？

<a id="trf-q3"></a>

<strong>问题TRF-3。</strong> “Potluri需要14次运算，直接精确DCT需要120次，因此近似芯片的能耗约为九分之一。”这句话错在哪里？

<details markdown="1">
<summary>核对问题TRF-1至TRF-3</summary>

<strong>TRF-1。</strong> 模式0为96（8 × 12），其余均为0：其他模式的+1与−1数量相同，所以常数行相互抵消。常数行只有均值，没有波动。

<strong>TRF-2。</strong> 模式0在各处给出15；模式1在位置1加−5，在位置6加+5。结果为15 10 15 15 15 15 20 15。

- 直接加−10，而不是−10 ÷ 2 = −5，遗漏了除以模式的两个非零项。

<strong>TRF-3。</strong> 运算次数不是能耗，两种计数甚至包含不同的运算类型（一种没有乘法，另一种有64次）。比较还遗漏了归一化、存储、控制与位宽。精确快速Arai算法仅需34次运算，所以“120”也不是公平的精确基准。文献综合研究在45 nm下，相比另一近似设计BAS-2008，面积约减少8.85%、关键路径约缩短6.23%，并非能耗降至九分之一。

</details>

---

<a id="going-deeper"></a>

## 深入阅读

以下是本页原有的参考内容，回答前面的题目不需要用到它们。

- [DCT基础](#discrete-cosine-transform-dct-foundations)：余弦公式、8 × 8频率布局和矩阵形式
- [无乘法近似DCT](#multiplication-free-approximate-dct-architectures)，包括[Potluri核、归一化和运算次数表](#the-potluri-et-al-14-addition-8-point-transform)
- [近似FFT与旋转因子](#approximate-fast-fourier-transform-fft-twiddle-factors)（涉及复数）
- [比较条件](#comparison-conditions)、[文献硬件与质量表](#published-dct-comparison)及[原始文献](#primary-literature-ieee-citations)

---

<a id="discrete-cosine-transform-dct-foundations"></a>

## 📸 离散余弦变换（DCT）基础

二维II型离散余弦变换（2D-DCT-II）将$N \times N$的空间像素$f(x, y)$矩阵映射为频率系数$F(u, v)$：

$$F(u, v) = \frac{2 C(u) C(v)}{N} \sum_{x=0}^{N-1} \sum_{y=0}^{N-1} f(x, y) \cos\left[ \frac{(2x + 1)u \pi}{2N} \right] \cos\left[ \frac{(2y + 1)v \pi}{2N} \right]$$

其中$C(k) = \frac{1}{\sqrt{2}}$（当$k=0$），$C(k) = 1$（当$k > 0$）。该正交归一化适用于任意正整数$N$；当$N=8$时，前因子为$C(u)C(v)/4$。

```
+-------------------------------------------------------------------+
|                      8 x 8二维DCT频率分布                         |
+-------------------------------------------------------------------+
| [ DC  F01 F02 F03 F04 F05 F06 F07 ]  v向右增大                     |
| [ F10 F11 F12 F13 F14 F15 F16 F17 ]                               |
| [ F20 F21 F22 ...                 ]  u向下增大                    |
| [ ...                             ]                               |
| [ F60 F61 ...                     ]  直流分量DC在左上角           |
| [ F70 F71 F72 F73 F74 F75 F76 F77 ]                               |
| 两个轴上的频率均有变化；重要性取决于图像。                        |
+-------------------------------------------------------------------+
```

利用可分离性，先逐行应用一维DCT，再逐列应用一维DCT，即可计算二维DCT：

$$\mathbf{F} = \mathbf{C} \cdot \mathbf{f} \cdot \mathbf{C}^T$$

---

<a id="multiplication-free-approximate-dct-architectures"></a>

## 🏛️ 无乘法近似DCT架构

精确八点一维DCT矩阵$\mathbf{C}_8$含有无理三角常数：

$$\cos\left(\frac{\pi}{16}\right) \approx 0.98078528, \quad \sin\left(\frac{\pi}{16}\right) \approx 0.19509032, \quad \cos\left(\frac{3\pi}{16}\right) \approx 0.83147$$

部分近似DCT架构将系数限制在$\{0,\pm1,\pm2,\pm\frac12\}$这样的小集合内，使运算能用移位和加法实现。这并不描述所有设计：系数集合、归一化及变换核搜索方法均取决于具体算法。

<a id="the-potluri-et-al-14-addition-8-point-transform"></a>

### Potluri等人的14次加法八点变换
Potluri等人（2014；作者稿第4节第8页）提出以下未归一化核。它与Bouguezel–Ahmad–Swamy（BAS）系列不同：

$$\mathbf{T}_8 = \begin{bmatrix}
 1 &  1 &  1 &  1 &  1 &  1 &  1 &  1 \\
 0 &  1 &  0 &  0 &  0 &  0 & -1 &  0 \\
 1 &  0 &  0 & -1 & -1 &  0 &  0 &  1 \\
 1 &  0 &  0 &  0 &  0 &  0 &  0 & -1 \\
 1 & -1 & -1 &  1 &  1 & -1 & -1 &  1 \\
 0 &  0 &  0 &  1 & -1 &  0 &  0 &  0 \\
 0 & -1 &  1 &  0 &  0 &  1 & -1 &  0 \\
 0 &  0 &  1 &  0 &  0 & -1 &  0 &  0
\end{bmatrix}$$

归一化近似为$\widehat{\mathbf C}_8=\mathbf D\mathbf T_8$，其中

$$\mathbf D=\operatorname{diag}(1/\sqrt8,1/\sqrt2,1/2,1/\sqrt2,1/\sqrt8,1/\sqrt2,1/2,1/\sqrt2).$$

该核的快速分解需要14次加减法，无需乘法或移位（作者稿第10页表1）。计数不包含归一化，后者可并入类JPEG流水线的量化。将一维核应用于八行和八列，每个块需要$16\times14=224$次加减法，块大小为$8\times8$；这是运算次数，不是物理加法器数量。质量取决于图像、系数保留方式和量化，不能据此推断通用的PSNR或功率节省。

Potluri等人表1的部分计数比较的是<strong>一次八点一维变换</strong>，不含归一化：

| 算法 | 乘法 | 加减法 | 移位 | 总运算次数 |
| :--- | ---: | ---: | ---: | ---: |
| 精确DCT，直接按定义 | 64 | 56 | 0 | 120 |
| Arai精确快速算法 | 5 | 29 | 0 | 34 |
| BAS-2008近似 | 0 | 18 | 2 | 20 |
| Potluri提出的近似 | 0 | 14 | 0 | 14 |

直接计算的计数来自八个输出，每个含八次乘法与七次加法。将不同类型的运算等量计数是一种复杂度约定，不是功率或能耗模型。

---

<a id="approximate-fast-fourier-transform-fft-twiddle-factors"></a>

## 📡 近似快速傅里叶变换（FFT）与旋转因子

在Cooley-Tukey基2按时间抽取（Decimation-In-Time，DIT）FFT算法中，$N=2^m$点DFT使用$m$级蝶形运算。最上层拆分中，$A[k]$和$B[k]$分别为偶数、奇数位置输入样本的$N/2$点DFT，其中$0\le k<N/2$：

$$X[k] = A[k] + W_N^k \cdot B[k]$$

$$X[k + N/2] = A[k] - W_N^k \cdot B[k]$$

其中$W_N^k = e^{-j \frac{2\pi k}{N}} = \cos\left(\frac{2\pi k}{N}\right) - j \sin\left(\frac{2\pi k}{N}\right)$表示复数<strong>旋转因子（twiddle factor）</strong>对应的旋转。

每个蝶形先将$B[k]$乘以$W_N^k$，再将同一乘积与$A[k]$相加／相减。基2 FFT有$(N/2)\log_2N$个蝶形和$N\log_2N$次复数加减法。朴素实现给每个蝶形安排一次复数乘法，但$1,-1,\pm j$只需变号或交换分量；其他分解也会改变实数运算次数。教科书中的复数乘法用四次实数乘法和两次实数加法实现，但这不是通用的硬件下界。

<a id="levers-for-approximate-fft-design"></a>

### 近似FFT的设计方法：
1. <strong>旋转因子近似</strong>：只有在误差预算允许时，才将选定的$W$替换为$\widetilde W$。对于一个蝶形，进入后续级之前有$\Delta X[k]=(\widetilde W-W)B[k]$、$\Delta X[k+N/2]=-(\widetilde W-W)B[k]$。接近$-1$时需要变号，不能直接透传。$|B[k]|$较大时，即使小角度误差也可能影响结果。
2. <strong>非精确算术</strong>：降低乘法器或加法器精度会改变舍入和误差传播；只有乘法器结构本身使用压缩器时，才能在其中应用压缩器近似。
3. <strong>输出剪枝</strong>：只有依据明确指定的输出子集及其依赖图，才能合理删减运算。无论信道信噪比（SNR）如何，关闭后面完整的级通常都不能算出预期DFT。

---

<a id="comparison-conditions"></a>

## 📊 比较条件

应分别比较变换核、归一化变换和编解码流水线。硬件比较需说明工艺、电压、精度、吞吐量、开关活动工作负载及质量设置。精确变换后接有损量化，重建PSNR通常也不是无穷大。上述运算次数不能证明芯片功率、面积或能耗节省。

<a id="published-dct-comparison"></a>

<a id="published-hardware-and-quality-examples"></a>

### 文献中的硬件与质量示例

Potluri等人表4及第6.3节报告了<strong>使用FreePDK 45 nm、1.1 V综合的二维架构</strong>，输入字长为$L=8$。这些是综合估计，不是已制造芯片的测量值：

| 变换架构 | 门数 | 面积（mm²） | 关键路径（ns） | 文献最大频率（MHz） |
| :--- | ---: | ---: | ---: | ---: |
| BAS-2008 | 44,654 | 0.192 | 1.204 | 830.6 |
| Potluri提出的架构 | 40,705 | 0.175 | 1.129 | 885.7 |

根据表中舍入后的数值，相对BAS-2008，面积约减少8.85%，关键路径延迟约减少6.23%。原表5的功率单位标注问题尚未解决，因此此处仍省略功率列。

表2另报告45幅512 × 512、8比特灰度图像的<strong>类JPEG软件重建</strong>结果。每个8 × 8块保留Z形扫描顺序的前$r=10$个系数。以下均值并非在上述硬件工作点测得：

| 变换 | 平均PSNR（dB） | 平均通用图像质量指数（UQI） |
| :--- | ---: | ---: |
| 精确DCT | 28.336 | 0.733 |
| BAS-2008 | 27.245 | 0.686 |
| Potluri提出的架构 | 25.726 | 0.586 |

这里提出的变换以较低的报告硬件成本，换取了低于BAS-2008的重建质量。这两张表不能证明端到端编解码能耗或普遍的质量排序。[来源：作者稿，表1、2、4；第5.2.3与6.3节](https://arxiv.org/pdf/1501.02995)。

---

<a id="primary-literature-ieee-citations"></a>

## 📚 原始文献与IEEE引用

- U. S. Potluri, A. Madanayake, R. J. Cintra, F. M. Bayer, S. Kulasekera, and A. Edirisuriya, *"Improved 8-Point Approximate DCT for Image and Video Compression Requiring Only 14 Additions"*, IEEE Transactions on Circuits and Systems I: Regular Papers, 61(6), 1727–1740, 2014. [DOI: 10.1109/TCSI.2013.2295022](https://doi.org/10.1109/TCSI.2013.2295022); [作者稿](https://arxiv.org/pdf/1501.02995). 第4节给出变换核和归一化；表1统计未归一化的一维算术运算。
- J. W. Cooley and J. W. Tukey, *"An Algorithm for the Machine Calculation of Complex Fourier Series"*, Mathematics of Computation, 19(90), 297–301, 1965. [DOI: 10.1090/S0025-5718-1965-0178586-1](https://doi.org/10.1090/S0025-5718-1965-0178586-1); [原论文扫描件](https://www.cs.jhu.edu/~misha/ReadingSeminar/Papers/Cooley65.pdf).
