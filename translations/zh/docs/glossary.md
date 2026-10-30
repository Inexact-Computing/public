<a id="comprehensive-glossary-of-inexact-approximate-computing"></a>

# 非精确计算与近似计算术语表

<a id="reading-desk"></a>

<a id="reading-desk-enough-vocabulary-to-start"></a>

## 术语速查区：掌握入门所需词汇

<strong>将本页当作词典，不必背诵整张列表。</strong>先读[比特与进位](start/bits-and-carry.md)或[第一条阅读路线](index.md#first-visit-five-short-stops)，遇到生词来查，再回到例子。详细条目及科学条件保留在速查区下方。

<a id="numbers-costs-and-evidence"></a>

### 数值、代价与证据

| 词语或符号 | 直观含义与小例子 | 下一站 |
|---|---|---|
| 精确参考（exact reference）／基准（baseline） | 用于比较的规定答案或设计，包括位宽、舍入和溢出。“精确”不总是指无限精度。参考不同，误差评分也可能不同。 | [简单误差指标](fundamentals/error-metrics-made-easy.md) |
| 有符号误差（signed error）／偏差（bias） | 误差 = 近似值 − 参考值，9代替10时为−1。偏差是声明集合中的有符号误差均值，均值零不保证每个输入的结果精确。 | [误差传播](fundamentals/motivations-and-challenges.md) |
| 绝对值／求和／对数 | abs(−3) = 3去掉符号；`Σ`表示各项相加；`log₂ 8 = 3`问2的几次方等于8。详细页面逐一介绍各自用法。 | [数学误差指标](fundamentals/error-metrics.md) |
| 功率（power）与能量（energy） | 功率是单位时间的能量：1 W = 1 J/s。在指定时间段内平均功率恒定时，能量 = 功率 × 时间；30 mW × 2 ns = 60 pJ。一个时钟周期未必是一个完整任务。 | [为什么使用非精确计算？](fundamentals/why-approximate-computing.md) |
| 小单位 | `m`为千分之一，`n`为十亿分之一，`p`为万亿分之一；1 ns = 10⁻⁹ s，1 pJ = 10⁻¹² J。延迟使用时间单位，面积可用mm²或µm²。比较时单位和条件必须匹配。 | [代价算例](fundamentals/why-approximate-computing.md) |
| 百分点（percentage points） | 准确率从90%降至88%是下降2个百分点，相对降幅为2/90 ≈ 2.22%。必须说明使用哪一种。 | [AI案例](bridge/ai-and-approximate-math.md) |
| 工作负载（workload）／输入域（input domain）／证据 | 工作负载是实际任务与数据，输入域列出允许输入。五行练习只描述那五行。测量、仿真、模型预测与手算示例支持不同的论断。 | [历史](fundamentals/history-and-evolution.md) |

<a id="images-representations-and-applications"></a>

### 图像、数值表示与应用

| 词语 | 直观含义与边界 | 下一站 |
|---|---|---|
| 像素（pixel）／加权平均（weighted average） | 8比特灰度像素是0–255的亮度整数。邻近数值乘以指定权重后相加，再除以权重和。权重非负且和为正时，平均值在输入范围内。 | [像素](bridge/human-eyes-and-pixels.md) |
| 比较区域／MSE／PSNR | 固定比较哪些对齐像素。均方误差（Mean Squared Error，MSE）是平方差均值；峰值信噪比（Peak Signal-to-Noise Ratio，PSNR）使用MSE及指定峰值。MSE = 0时PSNR为无穷，评分相同不保证视觉质量相同。 | [图像评分](bridge/human-eyes-and-pixels.md) |
| 比特位置／空间频率（spatial frequency） | 位权改变一个数的幅度；空间频率描述相邻像素之间的变化。低位小误差未必不可见。 | [图像模式](bridge/human-eyes-and-pixels.md) |
| 量化（quantization）／缩放因子S／零点Z | 将数值存到离散网格上。S = 0.5、Z = 0时，整数q = 5表示2.5。舍入和裁剪规则很重要。对这些存储值做精确算术，不同于使用非精确电路。 | [AI层的完整算例](bridge/ai-and-approximate-math.md) |
| 训练（training）／推理（inference）／ReLU | 训练调整模型权重，推理计算已训练模型的输出。ReLU输出max(0, x)。任何阶段或激活函数都不保证能容忍算术误差。 | [AI概念辨析](bridge/ai-and-approximate-math.md) |

<a id="looking-inside-a-circuit-or-system"></a>

### 走进电路与系统内部

| 词语 | 直观含义与边界 | 下一站 |
|---|---|---|
| 部分积（partial product）／列截断（column truncation） | 二进制乘法中，输入比特积具有位权2^(i+j)。求和前去掉低位权积，可能损失进位；它不同于清除已算完乘积的比特。 | [乘法器](taxonomy/multipliers.md#mul-start) |
| 4:2压缩器（compressor） | 同列四比特加一个输入进位，归约为相对本列位权为1的Sum及两个位权均为2的进位。“4:2”不是说两个进位分别值2和4。 | [乘法器课程与实验](taxonomy/multipliers.md) |
| 倒数归一化 | 把正除数写为D = 2^e × d，其中1 ≤ d < 2，再在较小区间近似1/d。有限位宽移位和乘积仍需规定舍入／溢出规则。 | [除法器](taxonomy/dividers.md#div-start) |
| MAC／PE | 乘累加（multiply–accumulate，MAC）先求乘积，再加到累计和。处理单元（processing element，PE）是局部计算单元，常为带寄存器的MAC；还含什么由架构决定。 | [加速器](taxonomy/accelerators.md#acc-start) |
| 平均误差补偿 | 抵消实测或模型估算的平均算术误差，目标是已分析条件下的期望，不是每个输出的误差。 | [加速器补偿](taxonomy/accelerators.md) |
| 运算次数（operation count） | 指定算法的算术步骤数，不是物理硬件单元数，也不是能耗测量。 | [变换](taxonomy/transforms.md#trf-start) |
| 刷新窗口／命令间隔 | 刷新窗口覆盖全部行刷新，命令间隔是相邻刷新命令的间隙，两者是不同时间。放宽刷新可能增加数据保持失败。 | [存储器](taxonomy/memory.md#mem-start) |
| SEC–DED | 在编码假设下，对受保护码字提供单错纠正、双错检测（single-error correction and double-error detection）。它不保证处理任意多比特错误或未受保护数据。 | [存储保护](taxonomy/memory.md) |

<details markdown="1">
<summary>两个术语速查自测</summary>

<strong>术语自测1。</strong>一次运算持续2 ns，期间平均功率为30 mW。60 pJ是什么量？<strong>能量</strong>，因为功率 × 时间 = 能量。功率本身仍为30 mW。

<strong>术语自测2。</strong>两个已评估输入的误差为+1和−1。偏差为零，是否表示每个结果精确？<strong>否。</strong>有符号均值为零，但两个结果都偏离参考，平均绝对误差为1。

</details>

<a id="detailed-definitions-and-scientific-reference"></a>

## 详细定义与科学参考

本术语表对近似硬件设计和计算机工程中的关键概念、指标与电路拓扑，提供简明定义、微架构解释和数学公式。

---

<a id="aca-almost-correct-adder"></a>

### ACA：近乎正确加法器（Almost-Correct Adder）
一种推测进位加法器，通过限制预测进位所用的输入来实现近似。精度与逻辑深度取决于具体超前进位电路、窗口和恢复方案。ACA缩写也曾用于精度可配置加法器，不能据此假定一种通用模型。


### 精度可配置／双模式（Accuracy-Configurable / Dual-Mode）
具有多种精度选择的算术设计。部分实现在运行时选择模式，另一些在设计时固定参数。模式切换、精确恢复及应用质量保证，都需要明确的实现支持。

<a id="aptpu-approximate-tensor-processing-unit"></a>

### APTPU：近似张量处理单元（Approximate Tensor Processing Unit）
一种具体的近似张量处理单元设计。其算术和测量结果必须依据所指实现。见[加速器页](taxonomy/accelerators.md)。

<a id="axa-lahaf-approximate-full-adder-cells"></a>

### AXA／LAHAF：近似全加器单元（Approximate Full Adder Cells）
这两类具名近似全加器单元通过改变精确真值表简化电路。晶体管数量、出错条目、噪声裕量和功率取决于具体拓扑与条件，不是全部近似单元的固定属性。

例如，Yang等人（IEEE-NANO 2013）使用Cadence Spectre，在TSMC 65 nm、1.0 V下仿真三种AXA单元，与10晶体管精确全加器比较。AXA1（8晶体管）的Sum和Cout各在8种输入组合中的4种正确；AXA2（6晶体管）的Sum在4种正确、Cout在全部8种正确；AXA3（8晶体管）的Sum在6种正确、Cout在全部8种正确。总误差距离分别为4、4、2。动态功率分别为3.872、3.448、3.234 µW，精确单元为4.657 µW；但AXA1静态功率更高（72.82对56.02 nW）。这些是单个单元结果，不是多比特加法器结果，见[加法器页](taxonomy/adders.md)。


### 比特与位权（Bit and Bit Weight）
比特是一个二进制位，取0或1。无符号二进制模式中，各位置有其位权：最右位值1，每向左移一位就翻倍（1、2、4、8、……）。把比特为1的位置的位权相加，例如1011 = 8 + 2 + 1 = 11。见[比特与进位](start/bits-and-carry.md#read-b01)。

<a id="booth-encoding-radix-4-radix-8"></a>

### Booth编码：基4／基8（Booth Encoding，Radix-4 / Radix-8）
基4重编码使用数字$\{0,\pm1,\pm2\}$，产生约$\lceil N/2\rceil$行部分积。基8使用$\{0,\pm1,\pm2,\pm3,\pm4\}$，约$\lceil N/3\rceil$行；生成$3Y$需要额外处理。符号扩展和边界约定影响最终实现。

<a id="carry-carry-in-carry-out"></a>

### 进位：输入进位／输出进位（Carry，Carry-In / Carry-Out）
二进制加法中，一列总值为2或3时，写下和位（0或1），再向左边下一列送1。输出进位成为下一列输入进位，位置位权翻倍。从N列最左列输出的进位需要额外输出位；只存N比特就会丢弃它。见[比特与进位](start/bits-and-carry.md#read-b02)。


### 进位链统计（Carry-Chain Statistics）
典型进位传播与最坏情况进位传播不同，统计论断需要明确输入分布和进位序列定义。Burks、Goldstine和von Neumann（1946，第5.6节）证明：两个长度为$n$、各位随机的二进制字相加，最长进位序列平均长度至多为$\log_2 n$；当$n=40$，实际平均值为$4.62$，上界约$5.3$。它针对随机位模型，不是所有加法器的延迟，见[历史](fundamentals/history-and-evolution.md)。

<a id="cordic-coordinate-rotation-digital-computer"></a>

### CORDIC：坐标旋转数字计算算法（Coordinate Rotation Digital Computer）
使用移位和加法完成圆周或双曲旋转、向量化的一类迭代方法。角度表、收敛范围、重复双曲迭代级、有限精度和尺度补偿均取决于模式。递推中消除通用乘法器，不等于消除全部实现代价。

<a id="csf-contrast-sensitivity-function"></a>

### CSF：对比敏感度函数（Contrast Sensitivity Function）
描述指定观看条件下，对比敏感度随空间频率的变化。不同观察者、亮度和刺激下，峰值敏感度并非同一个固定值；比特有效位描述幅度，不是空间频率。


### 暗硅（Dark Silicon）
功率预算下无法同时工作的芯片部分。其比例取决于器件、架构和工作负载模型，不是普遍指数增长的密度，也不意味着芯片一定熔化。Esmaeilzadeh等人（ISCA 2011）据此类模型预测：固定面积芯片在22 nm下必须关闭21%的区域，8 nm下超过50%。这些是模型推算，不是芯片测量。

<a id="dram-refresh-relaxation"></a>

### 放宽DRAM刷新（DRAM Refresh Relaxation）
延长选定数据的刷新间隔可减少刷新活动，也可能增加数据保持错误。必须说明基准间隔、温度、器件、存储数据和实测能量，不能推断通用间隔或节省百分比。例如RAIDR仿真（ISCA 2012，8核、32 GB DDR3-1333、以自动刷新为基准）中，刷新次数下降74.6%，每次存储器访问能耗在正常温度范围下降8.3%，在扩展范围下降16.1%。见[已发表的刷新研究](taxonomy/memory.md#published-refresh-studies)。

<a id="drum-dynamic-range-unbiased-multiplier"></a>

### DRUM：动态范围无偏乘法器（Dynamic Range Unbiased Multiplier）
对无符号参考设计，以各操作数前导一为基准选取$k$比特窗口。有比特被丢弃时，将保留窗口的最低有效位置1；将保留操作数相乘，再补回丢弃部分对应的移位。零值单独处理。这不是普通舍入，见[乘法器定义及来源](taxonomy/multipliers.md)。

<a id="ed-error-distance-and-signed-error"></a>

### ED：误差距离（Error Distance）与有符号误差
对一个输入，有符号误差e = 近似值 − 精确值；正值表示近似结果偏高。误差距离是其大小，ED = |e|。两者与结果单位相同。见[如何衡量计算误差？](fundamentals/error-metrics-made-easy.md#read-e01)。

<a id="edp-energy-delay-product"></a>

### EDP：能量延迟积（Energy-Delay Product）
一种主要硬件评价指标，定义为：

$$\text{EDP} = E_{\text{operation}} \times t_{\text{delay}}$$

只有在同一测量时间段内，实测能量为$P\,t_{\text{delay}}$时，它才等于$P\,t_{\text{delay}}^2$。流水线延迟、周期时间、吞吐率和总任务能耗不能互换。

<a id="er-error-rate"></a>

### ER：错误率（Error Rate）
近似电路输出与精确参考不同的评估输入所占比例：

$$\text{ER} = \frac{1}{|S|} \sum_{x \in S} \mathbb{I}(Y_{\text{approx}}(x) \neq Y_{\text{exact}}(x))$$

这里$S$为非空评估集合。手工表中每行都计一次，重复行也计入；ER只描述该集合，不描述所有未见输入。


### 全加器（Full Adder）
完成一列加法的电路，输入三个比特（A、B及输入进位），输出Sum与Cout。相对本列，Sum值1，Cout值2，因此输入1的个数等于Sum + 2 × Cout。将全加器串接即可构成行波进位加法器。见[比特与进位](start/bits-and-carry.md#read-b02)。

<a id="gear-generic-accuracy-configurable-adder"></a>

### GeAr：通用精度可配置加法器（Generic Accuracy Configurable Adder）
使用相互重叠子加法器的可配置推测进位加法器设计。字长、重叠范围、输出和位及可选纠错取决于配置。


### 输入分布（Input Distribution）
评估时各允许输入的使用频率。ER、MED和MRED取决于输入组成与声明的指标规则。手工表对每行等权，重复行再次计入，均值只描述该集合而非未见输入。见[如何衡量计算误差？](fundamentals/error-metrics-made-easy.md#read-e03)。

<a id="lead-logarithmic-exponent-approximate-divider"></a>

### LEAD：对数指数近似除法器（Logarithmic Exponent Approximate Divider）
一种具名对数近似除法器设计。对数域除法模型适用于满足$D\ne0$的正操作数；零、有符号操作数、归一化、插值及结果舍入需要明确处理。算法名称本身不能保证单周期时序。

<a id="loa-lower-part-or-adder"></a>

### LOA：低位或运算加法器（Lower-Part OR Adder）
常规无符号LOA无外部输入进位，低$k$位使用或运算，$A_{k-1}\land B_{k-1}$向精确高位部分提供进位。要保留完整位宽的和，输出需$N+1$比特。分界进位不同就属于另一模型。

<a id="logic-gates-and-or-xor"></a>

### 逻辑门：与、或、异或（Logic Gates，AND、OR、XOR）
逻辑门接收输入比特并输出一个比特。两个输入时，AND仅在两者均为1时输出1，OR在至少一个为1时输出1，XOR仅在恰好一个为1时输出1。任何一种逻辑门都不能单独完成两个比特的加法，OR不会产生进位。见[比特与进位](start/bits-and-carry.md#read-b02)。

<a id="med-mean-error-distance"></a>

### MED：平均误差距离（Mean Error Distance）
非空评估集合$S$中的平均绝对算术误差：

$$\text{MED} = \frac{1}{|S|} \sum_{x \in S} |Y_{\text{approx}}(x) - Y_{\text{exact}}(x)|$$

每行计一次，包含零误差行。仅凭MED不能知道出错频率或最大误差大小。

<a id="mitchells-logarithmic-algorithm"></a>

### Mitchell对数算法（Mitchell's Logarithmic Algorithm）
对以2为底的对数作分段线性近似：$\log_2(1+x) \approx x$，其中$x \in [0, 1)$，使乘除运算可通过快速整数加减实现。

<a id="mred-mean-relative-error-distance"></a>

### MRED：平均相对误差距离（Mean Relative Error Distance）
精确输出非零的评估样本中，相对误差比值的平均数。乘以$100$后表示百分比：

$$S^* = \{x\in S:Y_{\text{exact}}(x)\ne0\},\qquad \text{MRED} = \frac{1}{|S^*|}\sum_{x\in S^*}\frac{|Y_{\text{approx}}(x)-Y_{\text{exact}}(x)|}{|Y_{\text{exact}}(x)|}$$

若$S^*$为空则未定义；应单独报告排除的情况。

<a id="nmed-normalized-mean-error-distance"></a>

### NMED：归一化平均误差距离（Normalized Mean Error Distance）
用声明的正精确参考幅度$D_{\text{max}}$归一化平均误差距离。设计比较仍受分布与表示方式影响：

$$\text{NMED} = \frac{\text{MED}}{D_{\text{max}}}$$


### 观测最大误差（Observed Maximum Error）
实际已评估输入中的最大误差距离。小样本不能确定全部允许输入上的最坏情况误差（WCE）；那需要全输入域检查或证明。见[如何衡量计算误差？](fundamentals/error-metrics-made-easy.md#read-e03)。

<a id="psnr-peak-signal-to-noise-ratio"></a>

### PSNR：峰值信噪比（Peak Signal-to-Noise Ratio）
以分贝（dB）衡量重建信号／图像相对真值保真度的工程指标：

$$\text{PSNR} = 10 \cdot \log_{10}\left( \frac{\text{MAX}_I^2}{\text{MSE}} \right)$$

<a id="red-relative-error-distance"></a>

### RED：相对误差距离（Relative Error Distance）
精确结果非零时，RED = ED / |精确值|。精确结果为0时RED未定义，只从RED/MRED排除该行并报告排除情况；其误差大小及是否正确仍计入MED、ER。见[如何衡量计算误差？](fundamentals/error-metrics-made-easy.md#read-e03)。

<a id="roba-rounding-based-approximate-multiplier"></a>

### RoBA：基于舍入的近似乘法器（Rounding-Based Approximate Multiplier）
对非负操作数，RoBA按数值距离选择2的幂，不对$\log_2(A)$舍入。近似式为$A_rB+AB_r-A_rB_r$，零值须明确处理。原无符号规则在中点$3\to2$，其他2的幂中点向上舍入；有符号变体需另定规格约定，见[原始来源与算术](taxonomy/multipliers.md)。

<a id="snm-static-noise-margin"></a>

### SNM：静态噪声容限（Static Noise Margin）
衡量6T SRAM位单元电气稳定性的指标，指内部存储节点在不翻转所存比特的前提下，可容忍的最大直流噪声电压。

<a id="ssim-structural-similarity-index-measure"></a>

### SSIM：结构相似性指数（Structural Similarity Index Measure）
结合亮度、对比度与结构的局部图像窗口质量指标。下方标准简化式假设指数均为1、$C_3=C_2/2$、窗口统计量有效且稳定常数为正：

$$\text{SSIM}(x, y) = \frac{(2\mu_x\mu_y + c_1)(2\sigma_{xy} + c_2)}{(\mu_x^2 + \mu_y^2 + c_1)(\sigma_x^2 + \sigma_y^2 + c_2)}$$


### 脉动阵列（Systolic Array）
数据在相邻处理单元间有节奏流动的网络。用于矩阵乘法（$C=AB$）的二维网格是重要实例，但脉动阵列不限于这种几何结构或任务。


### 真值表（Truth Table）
列出每一种输入比特组合及其输出的表。两个输入有四行，全加器等三个输入有八行。见[比特与进位](start/bits-and-carry.md#read-b02)。

<a id="vos-voltage-over-scaling"></a>

### VOS：过度电压缩放（Voltage Over-Scaling）
将$V_{DD}$降至满足指定时序约束所需的电压以下，可能产生时序错误。错误位置和频率取决于路径及输入；不能自动断定错误罕见或应用可容忍。仍满足时序的低电压运行不一定是近似计算。

<a id="wallace-dadda-reduction-tree"></a>

### Wallace／Dadda归约树（Reduction Tree）
精确的进位保留归约树将部分积行归约为两个向量，再执行最终进位传播加法。门级数取决于拓扑与实现。常规4:2压缩器的一列满足数值恒等式：输入和$=S+2C+2C_{\text{out}}$；两个进位都属于下一列位权，不是分别为2和4。

<a id="wce-worst-case-error"></a>

### WCE：最坏情况误差（Worst-Case Error）
近似电路在整个输入空间上可能产生的最大绝对误差：

$$\text{WCE} = \max_{x \in S} |Y_{\text{approx}}(x) - Y_{\text{exact}}(x)|$$

对于WCE，$S$必须是完整指定输入域，误差界须经证明或穷举评估建立；样本最大值不是全输入域保证。上文全部均值指标都需要非空集合与明确采样权重。PSNR需要非空且对齐的比较区域、指定像素范围及量化，只有MSE为零时PSNR才为无穷。

定义来源： Han and Orshansky, ETS 2013, 第II–IV节 ([作者稿](https://www.ece.ualberta.ca/~jhan8/publications/ApproCompReview_final.pdf)); Liang, Han and Lombardi, *New Metrics for the Reliability of Approximate and Probabilistic Adders*, ED/MED/NED定义 ([作者稿](https://www.ece.ualberta.ca/~jhan8/publications/Adder-TC-May28_FinalSubmission.pdf)); Wang, Bovik, Sheikh and Simoncelli, IEEE TIP 2004, 式12–13 ([作者稿](https://www.cns.nyu.edu/pub/lcv/wang03-preprint.pdf)). 各设计来源见对应电路页面。上文引用的少量已发表结果（AXA、进位统计、暗硅、RAIDR）如各条所述，属于仿真、模型或分析。其来源为： Yang, Jain, Liang, Han and Lombardi, *Approximate XOR/XNOR-based Adders for Inexact Computing*, IEEE-NANO 2013, 第III–IV节及表2 ([作者稿](http://www.ece.ualberta.ca/~jhan8/publications/AXA_25.pdf)); Burks, Goldstine and von Neumann, *Preliminary Discussion of the Logical Design of an Electronic Computing Instrument*, 1946, 第5.6节 ([转录本](https://safari.ethz.ch/architecture/fall2023/lib/exe/fetch.php?media=logical_design_of_an_electronic_computing_instrument.pdf)); Esmaeilzadeh et al., *Dark Silicon and the End of Multicore Scaling*, ISCA 2011, 摘要 ([论文](https://www.cs.cmu.edu/~18742/papers/Esmaeilzadeh2011.pdf)); Liu, Jaiyen, Veras and Mutlu, *RAIDR: Retention-Aware Intelligent DRAM Refresh*, ISCA 2012, 第5及6.1–6.3节 ([作者版本](https://users.ece.cmu.edu/~omutlu/pub/raidr-dram-refresh_isca12.pdf)).
