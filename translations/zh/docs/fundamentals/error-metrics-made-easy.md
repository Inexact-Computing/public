<a id="how-do-we-grade-mistakes-error-metrics-made-easy"></a>

# 如何衡量计算误差？从简单例子理解误差指标

普通计算器给出错误答案，会被判为<strong>不及格</strong>。
近似计算（approximate computing）中，电路可以有意偏离规定的参考结果，且并非每个输入的误差都很小。如何量化误差，再判断它是否满足应用要求？

我们使用误差指标。本页先逐步算清一张小表；比萨切片和美元等日常类比放在“深入阅读”中。

<strong>路线：</strong>[比特与进位](../start/bits-and-carry.md) → 本页 → [近似加法器](../taxonomy/adders.md)。本页只需要整数减法和百分比。

<strong>读完本页，你将能够：</strong>

1. 算出表格每一行的有符号误差及误差大小；
2. 分别用出错频率和误差大小概括表格，同时单列最大误差；
3. 说明哪些行可用于相对误差，以及小表不能证明什么。

---

<a id="read-e01"></a>

<a id="step-1-line-up-exact-and-approximate-results"></a>

## 第1步：对齐精确结果与近似结果

<strong>精确结果</strong>是我们的参考，即规定的算术运算应给出的答案。<strong>近似结果</strong>是近似方法实际返回的结果。将每一对放在起始表（表T）的同一行：

| 行 | 精确值（参考） | 近似值 |
|---|---:|---:|
| 1 | 0 | 1 |
| 2 | 10 | 11 |
| 3 | 20 | 18 |
| 4 | 30 | 30 |

全部数值都是普通整数，下文误差也都使用相同的整数单位。

每行用近似结果减去精确结果，得到<strong>有符号误差（signed error）</strong>：e = 近似值 − 精确值。正误差表示近似结果偏高，负误差表示偏低。

误差的<strong>大小</strong>不看符号：+1和−1的大小都为1，称为<strong>误差距离（Error Distance，ED）</strong>。数学上用绝对值|e|表示。

以第2行为例：11 − 10 = +1，因此e = +1、ED = 1。

<strong>先预测：</strong>写出第1、3、4行的e和ED。

<details markdown="1">
<summary>核对第1–4行</summary>

| 行 | 精确值 | 近似值 | 有符号误差e | 大小ED |
|---|---:|---:|---:|---:|
| 1 | 0 | 1 | +1 | 1 |
| 2 | 10 | 11 | +1 | 1 |
| 3 | 20 | 18 | −2 | 2 |
| 4 | 30 | 30 | 0 | 0 |

第3行偏低2，第4行完全正确。

</details>

<strong>误差记录表任务。</strong>下方工具初始使用同一张表。先在纸上预测各行有符号误差和误差大小，再点击<strong>检查当前表格</strong>比较。编辑任意数值都会清除旧的检查结果。<strong>恢复教学表T</strong>可还原此表，<strong>清空全部行</strong>可将其清空后输入自己的数据，最多20行。工具只比较你提供的数值，不模拟电路。

<iframe
  src="../../labs/error-ledger.html"
  title="误差记录表"
  style="width: 100%; height: 2300px; border: none; background: transparent; margin: 12px 0;"
  loading="lazy"
></iframe>

若工具没有加载，可[单独打开误差记录表](../labs/error-ledger.html)。它对此表显示的全部结果也都在本页列出。

<a id="read-e02"></a>

<a id="step-2-how-often-and-by-how-much"></a>

## 第2步：多久出错一次，误差有多大？

<strong>均值</strong>就是总和除以行数。每行计一次，同样的一对数出现两次，就计为两行。

- <strong>平均误差距离（Mean Error Distance，MED）</strong>是误差大小的均值，包含误差为0的行。
- <strong>错误率（Error Rate，ER）</strong>是非零误差行数除以总行数，通常写成百分比。
- <strong>观测最大误差</strong>是已检查各行中最大的误差大小。

这些行由手工输入，不是真实电路测量，也不能说明这些输入在实际中出现的频率。

<strong>先预测：</strong>上表的MED、ER与观测最大误差各是多少？

<details markdown="1">
<summary>核对汇总结果</summary>

- MED = (1 + 1 + 2 + 0) / 4 = 4 / 4 = <strong>1</strong>
- ER = 3行出错 / 4行 = <strong>75.00%</strong>
- 观测最大误差 = <strong>2</strong>（第3行）

补充：若对有符号误差取平均，得到(1 + 1 − 2 + 0) / 4 = 0。这是有符号平均误差，不是MED。正负误差可在有符号均值中抵消，误差大小却不会在MED中抵消。

</details>

<a id="one-comparison-wrong-often-or-wrong-by-more"></a>

### 比较：出错更频繁，还是单次误差更大？

再看两张小表，每行精确结果都为10：

| 行 | 精确值 | 表F近似值 | 表G近似值 |
|---|---:|---:|---:|
| 1 | 10 | 9 | 10 |
| 2 | 10 | 9 | 10 |
| 3 | 10 | 9 | 10 |
| 4 | 10 | 9 | 14 |

<strong>先预测：</strong>哪张表出错更频繁？哪张表的观测误差更大？各自MED是多少？

<details markdown="1">
<summary>核对F与G</summary>

| | ER | MED | 观测最大误差 |
|---|---:|---:|---:|
| 表F | 4 / 4 = 100.00% | 4 / 4 = 1 | 1 |
| 表G | 1 / 4 = 25.00% | 4 / 4 = 1 | 4 |

F出错更频繁，G的已观测单次误差更大。两者MED均为1，行为却不同。MED相同不能说明两组误差相同，也不能说明两者适合同一任务。

</details>

ER衡量出错频率，MED对误差大小取平均且包含零误差行；最大值应单独列出。

<a id="read-e03"></a>

<a id="step-3-relative-error-zero-references-and-what-a-table-can-prove"></a>

## 第3步：相对误差、零参考值与表格能证明什么

精确结果为10时，误差1比精确结果为1,000时更值得关注。<strong>相对误差距离（Relative Error Distance，RED）</strong>将误差大小与参考值大小比较：

RED = ED / |精确值|

分母使用精确结果的绝对值，因此即使参考值为负，相对误差仍为零或正数。例如精确值−10、近似值−9，ED = 1，RED = 1/10 = 10%。

<strong>精确结果为0时，RED未定义</strong>，因为不能除以零。该行只从RED及其均值中排除。其误差大小和是否出错仍然已知，因此仍计入MED和ER。

<strong>平均相对误差距离（Mean Relative Error Distance，MRED）</strong>是有效行（精确结果非零）的RED均值。报告MRED时，应同时列出有效行数N<sub>valid</sub>和排除行数。若全部精确结果为0，MRED未定义，不能写0。若表格没有任何行，MED、ER、观测最大误差和MRED均未定义。

<strong>先预测：</strong>第一张表中哪些行可用于RED？MRED是多少？

<details markdown="1">
<summary>核对相对误差</summary>

| 行 | 精确值 | 近似值 | ED | RED |
|---|---:|---:|---:|---|
| 1 | 0 | 1 | 1 | 未定义；排除 |
| 2 | 10 | 11 | 1 | 1/10 = 10.00% |
| 3 | 20 | 18 | 2 | 2/20 = 10.00% |
| 4 | 30 | 30 | 0 | 0/30 = 0.00% |

MRED = (1/10 + 2/20 + 0/30) / 3 = 1/15 ≈ <strong>6.67%</strong>，其中N<sub>valid</sub> = 3，排除1行（精确值0）。百分比保留两位小数，精确值为1/15。MED（1）与ER（75.00%）仍使用全部四行。

</details>

<a id="what-a-small-table-can-and-cannot-show"></a>

### 小表能说明什么，不能说明什么

<strong>允许输入</strong>包括工具或电路接受的全部输入，例如所有无符号16比特数对。<strong>最坏情况误差（Worst-Case Error，WCE）</strong>是全部允许输入中的最大误差大小，需要检查每个允许输入或给出证明。

手工表格的最大误差只是观测最大值。第一张表中它为2，不能证明电路永远不会偏差超过2。测试哪些输入、各输入出现几次，都会改变MED、ER和MRED；另一组数据可能得到不同结果。

---

<a id="check-your-understanding"></a>

## 检查理解情况

先在纸上作答，再展开核对。答案不会保存或发送到任何地方。下面使用新表S：

| 行 | 精确值 | 近似值 |
|---|---:|---:|
| 1 | 0 | 1 |
| 2 | 8 | 7 |
| 3 | 10 | 11 |
| 4 | 20 | 20 |

<a id="read-q4"></a>

<strong>问题4。</strong>（a）求S的每行有符号误差与绝对大小，计算MED、ER及S中的观测最大误差。（b）第2步中的F和G，哪张表出错更频繁？哪张观测误差更大？MED相等是否使它们的误差等价？

<details markdown="1">
<summary>核对问题4</summary>

（a）有符号误差：+1、−1、+1、0。大小：1、1、1、0。MED = 3/4 = 0.75；ER = 3/4 = 75.00%；观测最大误差 = 1。

- MED为0.25是对有符号误差取了平均；MED使用大小，−1应计为1。
- MED为1是只除以3行出错数据；应除以全部4行。
- ER为100%是将正确行也算作出错；第4行没有误差。

（b）F出错更频繁（100%对25%），G观测误差更大（4对1）。MED相同不能使两者等价：MED不显示出错频率或最大误差。ER更高不表示每次误差更大。

选做追问：第一张表的有符号误差均值为0，为何MED却为1？因为先对各行取大小，再求平均。

</details>

<a id="read-q5"></a>

<strong>问题5。</strong>（a）S中哪些行可用于相对误差？被排除行是否仍计入MED、ER？解释原因。（b）S的观测最大误差为1，是否证明电路在全部允许输入上都不会出现大于1的误差？

<details markdown="1">
<summary>核对问题5</summary>

（a）第2、3、4行，N<sub>valid</sub> = 3。第1行精确结果为0而被排除，RED未定义；但其误差大小（1）及出错事实仍然已知，因此计入MED、ER。不能将其RED设为0或无穷，也不能从全部指标中删除该行。

（b）不能。S只有四行。全输入域保证需要检查每个允许输入或提供证明，并明确允许输入范围。

选做拓展：计算S的MRED。答案：(1/8 + 1/10 + 0/20) / 3 = 3/40 = 7.50%，N<sub>valid</sub> = 3，排除1行。若得到5.625%，说明除以4行而非3个有效行。

</details>

<strong>下一步：</strong>[近似加法器](../taxonomy/adders.md)介绍一种计算7 + 1却返回7的实际近似加法器，并讨论1个单位的误差是否改变决策。

---

<a id="going-deeper"></a>

## 深入阅读

以下保留本页原有参考材料，超出前述入门路线：

- [平均误差距离——比萨切片检验](#1-mean-error-distance-med-the-pizza-slice-test)：选读日常例子及MED一般公式。
- [平均相对误差距离——美元检验](#2-mean-relative-error-distance-mred-the-dollar-test)：选读美元例子、MRED公式和三行算例。
- [最坏情况误差](#3-worst-case-error-wce-the-ceiling)：全输入域公式。
- [PSNR](#4-psnr-peak-signal-to-noise-ratio-pixel-error-score)：图像的像素误差评分。
- [指标速查表](#summary-cheat-sheet)。

---

<a id="1-mean-error-distance-med-the-pizza-slice-test"></a>

## 🍕 1. 平均误差距离（MED）——“比萨切片检验”

假设订了一份切成100片的比萨：

- 周一餐厅给了99片（误差1片）；
- 周二给了101片（误差1片）；
- 周三给了100片（误差0片）。

平均绝对误差为：

$$\text{Average Error} = \frac{1 + 1 + 0}{3} \approx 0.67\text{ slices}$$

对电路而言，<strong>平均误差距离（MED）</strong>是非空评估集合中，相对指定精确参考的平均绝对差。下式赋予每个样本相同权重：

$$\text{MED} = \frac{1}{N} \sum |Y_{\text{approx}} - Y_{\text{exact}}|$$

> <strong>实用理解：</strong>按列出的权重评估这些输入时，MED较小表示平均绝对差较小，不表示每一个结果都接近参考。

---

<a id="2-mean-relative-error-distance-mred-the-dollar-test"></a>

## 📊 2. 平均相对误差距离（MRED）——“美元检验”

比较两种误差：

1. 相对<strong>\$20,000</strong>偏差<strong>\$10</strong>，为$0.05\%$。
2. 相对<strong>\$1</strong>偏差<strong>\$10</strong>，为$1000\%$。

由于数值尺度不同，我们计算<strong>相对百分比误差</strong>：

$$\text{Relative Error} = \frac{|\text{Mistake}|}{|\text{True Value}|}, \qquad \text{True Value} \ne 0$$

对相对误差取平均，得到<strong>平均相对误差距离（MRED）</strong>。本页排除精确输出为零的输入，因为其相对误差涉及除以零。令$V$为已评估样本中$Y_{\text{exact}} \ne 0$的集合，$N_{\text{valid}} = |V|$为其数量：

$$\text{MRED} = \frac{1}{N_{\text{valid}}} \sum_{i \in V} \frac{|Y_{\text{approx},i} - Y_{\text{exact},i}|}{|Y_{\text{exact},i}|}$$

单独报告被排除样本数；若$N_{\text{valid}} = 0$，MRED未定义。例如，精确输出$[0, 10, 20]$、近似输出$[1, 11, 18]$在两个有效样本上的MRED为$(0.1 + 0.1)/2 = 0.1$，即$10\%$。零输出样本的误差仍重要，仍可计入MED、ER。MRED小不能保证噪声不可见或任务结果可接受。

---

<a id="3-worst-case-error-wce-the-ceiling"></a>

## 💥 3. 最坏情况误差（WCE）——“误差上限”

在最坏输入下，电路最大可能偏差多少？

$$\text{WCE} = \max_{x \in D} |Y_{\text{approx}}(x) - Y_{\text{exact}}(x)|$$

其中，$D$为完整允许输入域，须说明位宽、有无符号及溢出行为。全输入域误差界需要检查全部允许输入或给出证明；样本中最大误差只是观测最大值。

对于无符号16比特输入，最大精确乘积为$65535^2 = 4,294,836,225$，不是32比特输出所能编码的最大值。若证明乘法器在整个输入域具有$\text{WCE} = 64$，它在该域内的偏差就永远不超过$64$。这一界是否可接受，仍取决于任务。

---

<a id="4-psnr-peak-signal-to-noise-ratio-pixel-error-score"></a>

## 📸 4. 峰值信噪比（PSNR）——“像素误差评分”

滤波或压缩照片时，工程师使用<strong>峰值信噪比（Peak Signal-to-Noise Ratio，PSNR）</strong>概括相对指定参考图像的像素平方差，单位是分贝（<strong>dB</strong>）：

$$\text{MSE} = \frac{1}{P} \sum_{i=1}^{P} (I_{\text{approx},i} - I_{\text{reference},i})^2, \qquad \text{PSNR} = 10\log_{10}\left(\frac{255^2}{\text{MSE}}\right)$$

这里，$P$为比较的灰度像素数，$255$为8比特无符号像素的最大强度。应比较相同区域，并保持量化与参考处理一致。均方误差（Mean Squared Error，MSE）$= 0$时，比较像素完全相同，PSNR为无穷；MSE非零时PSNR有限。固定像素范围下，PSNR越高表示MSE越小，但不保证失真不可见或任务安全。图像内容、误差模式与观看条件都重要，能耗须另行测量。

已发表实例见[相同MSE，不同结构](error-metrics.md#same-mse-example)：同一照片的五种失真版本具有相同MSE，因而PSNR也相同，结构相似性评分却从0.69到0.99不等。

---

<a id="summary-cheat-sheet"></a>

## ⚖️ 指标速查表

| 指标 | 回答的问题 | 类比 |
| :--- | :--- | :--- |
| <strong>MED</strong> | 平均而言，答案偏差多远？ | 到目标的平均距离 |
| <strong>MRED</strong> | 平均百分比误差是多少？ | 实验报告中的百分比误差 |
| <strong>WCE</strong> | 完整指定输入域内的最大误差是多少？ | 已验证的误差上限 |
| <strong>ER（错误率）</strong> | 有非零误差的答案占多少？ | 硬币正面朝上的频率 |
| <strong>PSNR</strong> | 固定范围及参考下，像素平方误差有多小？ | 像素误差评分，不是不可见保证 |

这些指标描述声明的测试分布与运算规格约定，不能自动证明任务安全。ED/MED定义背景见Liang、Han和Lombardi，*New Metrics for the Reliability of Approximate and Probabilistic Adders*（[作者稿](https://www.ece.ualberta.ca/~jhan8/publications/Adder-TC-May28_FinalSubmission.pdf)）；为何仅凭像素平方误差不能确定可见性，见Wang、Bovik、Sheikh和Simoncelli，IEEE TIP，2004，第II节（[作者稿](https://www.cns.nyu.edu/pub/lcv/wang03-preprint.pdf)）。除引用Wang等人图2的MSSIM范围外，本页数值均为算术示例，不是电路或能耗实测结果。
