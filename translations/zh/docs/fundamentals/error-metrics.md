<a id="error-metrics-and-mathematical-bounds"></a>

# 误差指标与数学误差界

<strong>所需基础：</strong>已能像[如何衡量计算误差？](error-metrics-made-easy.md)那样，用小型手工表格理解ED、MED、ER与RED。本页<strong>不重复讲授</strong>入门页。

<strong>读完本页，你将能够：</strong>

1. 说明已评估输入的“集合”是什么，解释等权均值为什么不等于工作负载分布；
2. 计算有符号平均误差（偏差），说明它为何不同于MED；
3. 说明各指标的定义域，特别是MED、ER和MRED何时不再有定义。

<strong>路线：</strong>[如何衡量计算误差？](error-metrics-made-easy.md) → 本页 → [跨层次的近似方法](approx-paradigms.md)。

<a id="how-this-page-relates-to-the-beginner-page"></a>

## 本页与入门页的关系

| | [如何衡量计算误差？](error-metrics-made-easy.md) | <strong>本页</strong> |
|---|---|---|
| 任务 | 阅读小表，认识ED/MED/ER/RED | 给出定义、明确定义域、推导误差界 |
| 表格 | 手工教学表T、F、G、S | 一组已检查输入，然后讨论LOA全输入域 |
| 回答的问题 | 这个数值是什么意思？ | 数值何时有效，不能约束什么？ |
| 公式 | 紧随示例展示 | 精确定义，并给出各自定义域 |

若不熟悉下方符号，先读入门页；那里通过完整算例介绍ED、MED、ER、RED和MRED。

<a id="start-here-one-small-checked-set"></a>

## 从一小组已检查输入开始

把实际评估过的输入对记为$S$，即<strong>评估集合</strong>。它不是“全部输入”，而是你选取的输入。下面是五对输入的一个集合，已填入各行误差。定义仍为$e = \text{approx} - \text{exact}$。

| 行 | 精确值 | 近似值 | $e$ | $\lvert e\rvert$ |
|---|---:|---:|---:|---:|
| 1 | 12 | 13 | +1 | 1 |
| 2 | 20 | 18 | −2 | 2 |
| 3 | 0 | 1 | +1 | 1 |
| 4 | 30 | 30 | 0 | 0 |
| 5 | 40 | 41 | +1 | 1 |

对<strong>同样五行</strong>可以作出以下不同汇总：

| 汇总量 | 本例计算方式 | 数值 |
|---|---|---:|
| 有符号误差之和 | $+1-2+1+0+1$ | $+1$ |
| <strong>偏差</strong> = 有符号误差均值 | $+1 / 5$ | $+0.2$ |
| 误差大小之和 | $1+2+1+0+1$ | $5$ |
| <strong>MED</strong> = 平均误差距离 | $5 / 5$ | $1$ |
| <strong>ER</strong> = 错误率 | $4$行出错，总共$5$行 | $80\%$ |
| 观测最大ED | 已出现的最大$\lvert e\rvert$ | $2$ |

这张小表已能说明三件事。

<strong>每行都计一次，包括正确行。</strong>第4行$e=0$，仍占分母的五分之一。去掉零误差行会使MED从$1$增至$5/4=1.25$，ER从$80\%$增至$100\%$。本站反复强调“MED包含零误差行”，因为它决定分母。

<strong>有符号均值与大小均值是不同数值。</strong>偏差为$+0.2$，MED为$1$。对有符号误差平均得到$+0.2$，对大小平均得到$1$。一个表格可以偏差为$0$、MED为$1$，如$+1,-1$。因此“平均误差为零”从来不能直接说明算术准确。

<strong>观测最大值不是误差界。</strong>最大的$\lvert e\rvert$在$S$中为$2$，这个$2$只对这五行成立。增加输入可能发现更大误差，不能由此说明未评估的行。

<a id="collection-or-distribution"></a>

### 集合还是分布？

以上结论都采用等权重，每行贡献$1/5$。对于一个评估集合，这样做合理，误差记录表工具也这样计算。但它<strong>不等同于工作负载</strong>。如果某些输入远比其他输入常见，应使用<strong>加权</strong>期望，按各输入对出现的频率赋权。手选集合的等权均值可能与工作负载平均值不同。两者都有用途，但报告数值时必须说明是哪一种。

因此，本站反复要求说明测试输入、位宽、有无符号、舍入及溢出规则。“MED = 1”若没有评估集合、规格约定与位宽，就只是残缺信息，不能构成明确的量。

<a id="bias-why-direction-matters"></a>

## 偏差：为什么方向很重要

偏差（bias）是有符号误差（signed error）的均值，可用于预测累积。在精确累加器中，若每步误差均值非零，平均累积误差会与步数成正比；均值为零也不保证每次运行误差都小。[研究动机与挑战](motivations-and-challenges.md)逐步演示了这一点。下面列出三种常见情况与偏差符号：

```
清除非负结果的低输出位：误差非正
有符号截断或操作数近似：符号取决于模型
舍入：是否无偏取决于规则和输入分布
```

第三条经常被误解。“舍入无偏”是在特定数值分布上应用特定规则的论断。中点向上舍入（round-half-up）将恰好位于半步位置的值向上舍入。如果中点具有正概率，结合其余分布，这可能造成向上偏差；连续均匀小数部分在中点没有概率质量，平均舍入误差为零。不同输入集合可能产生任一方向的偏差，始终应问清规则与输入。

<a id="where-the-metrics-stop-being-defined"></a>

## 指标在哪些条件下不再有定义

入门页有意省略了这些细节，但实际使用时必须明确。

| 指标 | 有定义的范围 | 未定义或没有相应含义的情况 |
|---|---|---|
| ED，$\lvert e\rvert$ | 每对有限数值输出 | 未定义或非数值输出需要另立约定 |
| MED | 任意非空集合 | 集合为空 |
| ER | 任意非空集合 | 集合为空 |
| 观测最大误差 | 任意非空集合 | 集合为空 |
| RED | $\text{exact}\neq 0$的数值对 | $\text{exact}=0$，除以零 |
| MRED | 参考值非零的子集$S^*$ | $S^*$为空 |
| NMED（归一化平均误差距离，MED ÷ $D_{\max}$） | 已声明正归一化分母$D_{\max}$ | 未声明正归一化分母 |
| WCE | 明确的完整输入域$D$ | 只有样本 |

零参考值只使该行退出相对误差指标。其绝对误差仍已知，仍计入MED和ER；不能从表中删除，也不能把RED设为$0$或$\infty$。同样，全输入域WCE需要全部允许输入或证明，采样最大值不能代替。

<a id="check-your-understanding"></a>

## 检查理解情况

先在纸上作答，再展开核对。答案不会保存或发送到任何地方。

<a id="read-f10"></a>

<strong>WB10。</strong>对上述五行集合$S$：（a）MED、ER与观测最大误差是多少？（b）偏差是多少？（c）同事对同样各行报告“MED = 1.25”，最可能做了什么？

<details markdown="1">
<summary>核对WB10</summary>

（a）MED $= 5/5 = 1$；ER $= 4/5 = 80\%$；观测最大误差$= 2$。（b）偏差$= +1/5 = +0.2$。（c）他们除以<strong>四行出错数据</strong>，而非全部五行：$5/4 = 1.25$。MED的分母是整个集合，包括误差为0的行。

- 若得到MED $= 1.25$，检查是否因“第4行没有误差”而暗中删除它。零误差行必须保留，MED才准确。
- 若报告偏差为$1$，你平均的是大小；偏差必须保留符号。

</details>

<a id="read-f11"></a>

<strong>WB11。</strong>仍使用$S$：（a）哪些行能用于RED？（b）计算MRED，同时给出$N_{\text{valid}}$及排除行数。（c）被排除行是否仍影响MED和ER？

<details markdown="1">
<summary>核对WB11</summary>

（a）第1、2、4、5行，即精确值非0的行。第3行除以精确值0未定义，因此排除。（b）$\text{RED} = 1/12,\ 2/20,\ 0,\ 1/40$，故MRED $= (0.08333+0.1+0+0.025)/4 = 0.20833/4 \approx 5.21\%$，$N_{\text{valid}} = 4$，排除$1$行。（c）影响：第3行$e=+1$，确实出错，仍计入MED（误差总和中的$1$）和ER（四行出错数据之一）。

- 若把第3行RED设为$0$，就把无法计算的相对误差说成了完全无误差。应写“未定义；排除”。
- 若除以$5$而非$4$，你把被排除行计入了MRED分母。

</details>

<a id="read-f12"></a>

<strong>WB12。</strong>两名工程师报告同一电路。A：“测试10,000个随机输入，看到最大误差3，因此最坏情况误差为3。”B：“穷举全部$2^{16}$个低字节对（每字节8比特），最大误差128，因此声明输入域上的最坏情况误差为128。”哪个是误差界？另一个的具体缺陷是什么？

<details markdown="1">
<summary>核对WB12</summary>

B是<strong>其穷举输入域上的界</strong>：该域的每对允许输入都已检查，所以最大值确实是全域最大值，下方参考部分的LOA就是这种情况。A只有观测最大值：10,000个样本无论多么随机，都不能排除未抽到的更差输入。A应改为“10,000个随机输入样本中，观测到的最大误差为3”，这仍不能说明未测试输入。

- “随机”不能把样本变成证明，只有穷举或证明才可以。
- B也必须明确输入域：此处只有低字节影响误差，因此穷举$2^{16}$对就足够覆盖该电路。

</details>

---

<a id="reference-definitions-domains-and-derivations"></a>

## 🔬 参考：定义、定义域与推导

功能正确性相对于指定运算定义，包含数据表示、舍入与溢出行为。有限精度的精确参考不等于无限精度实数运算。

<strong>近似计算与非精确计算（inexact computing）</strong>同时量化数值误差和实现代价。设计可用精度换取较低功率、能耗、延迟或面积，但必须为该设计与工作负载建立误差界、证明收益。

<a id="1-primary-numerical-error-metrics"></a>

### 1. 主要数值误差指标

令$A$和$B$为输入操作数，$S$为已评估测试向量的非空集合。下文等权平均描述这一集合；工作负载概率分布需要加权期望。须声明操作数/输出位宽、有无符号、饱和或回绕、舍入以及精确参考。不说明规格约定，就将无界结果与回绕结果比较，会产生歧义。

令$Y_{\text{exact}}(A, B)$为数学真值，$Y_{\text{approx}}(A, B)$为近似硬件输出。

```
精确参考：Y_exact  = f(A, B)
近似电路：Y_approx = f_approx(A, B)
          ────────────────────────
误差距离：ED(A, B) = |Y_approx - Y_exact|
```

<a id="1-error-distance-ed"></a>

#### 1. 误差距离（$ED$）
特定输入对$(A, B)$的逐点绝对数值差：

$$ED(A, B) = |Y_{\text{approx}}(A, B) - Y_{\text{exact}}(A, B)|$$

<a id="2-mean-error-distance-med"></a>

#### 2. 平均误差距离（$MED$）
在评估集合$S$上的平均绝对误差距离：

$$MED = \frac{1}{|S|} \sum_{(A,B) \in S} |Y_{\text{approx}}(A, B) - Y_{\text{exact}}(A, B)|$$

> <strong>要点：</strong>MED与输出单位相同，衡量平均大小，不是每个结果的误差界。两个无符号8比特输入只有在保留九比特结果时，最大和才是$510$；8比特回绕输出的语义不同。假设MED为$1.2$，表示在声明测试集合上平均绝对差为$1.2$个单位，不是通用加法器实测结果。

<a id="3-mean-relative-error-distance-mred"></a>

#### 3. 平均相对误差距离（$MRED$）
相对误差比值的平均数，只有乘以$100$后才表示百分比：

$$MRED = \frac{1}{|S^*|} \sum_{(A,B) \in S^*} \frac{|Y_{\text{approx}}(A, B) - Y_{\text{exact}}(A, B)|}{|Y_{\text{exact}}(A, B)|}$$

*其中，$S^* = \{(A,B) \in S : Y_{\text{exact}}(A, B) \neq 0\}$，用以避免除以零。*

若$S^*$为空，MRED未定义。须报告排除的零参考值情况，并单独评估其绝对误差。不存在能保证不可见或应用正确的固定MRED阈值。

<a id="4-normalized-mean-error-distance-nmed"></a>

#### 4. 归一化平均误差距离（$NMED$）
$NMED$用声明的正参考幅度$D_{\text{max}}$归一化MED。它消除了输出尺度，但仅凭这一操作，不能直接比较不同位宽、分布或运算规格约定：

$$NMED = \frac{MED}{D_{\text{max}}}$$

两个无符号$N$比特输入保留完整结果时，乘法使用$D_{\text{max}} = (2^N - 1)^2$；没有输入进位的加法使用$D_{\text{max}} = 2^{N+1} - 2$。有符号或回绕参考需要另行定义归一化方式。

<a id="5-worst-case-error-wce-maximum-error-distance-maxed"></a>

#### 5. 最坏情况误差（$WCE$）／最大误差距离（$MaxED$）
使用完整允许输入域$D$定义最坏情况误差。样本$S$上的最大值只是观测最大值：

$$WCE = \max_{(A,B) \in D} |Y_{\text{approx}}(A, B) - Y_{\text{exact}}(A, B)|$$

> <strong>误差界的范围：</strong>证明全域WCE为$28$，意味着该运算及其规格约定满足算术要求$|Error|\le32$。它不证明整个系统安全：累积误差、阈值决策和不支持的输入可能有额外要求。应通过穷举评估或证明建立界，而非样本最大值。

<a id="6-error-rate-er"></a>

#### 6. 错误率（$ER$）
近似电路产生非零误差的输入测试向量所占比例：

$$ER = \frac{1}{|S|} \sum_{(A,B) \in S} \mathbb{I}\Big(Y_{\text{approx}}(A, B) \neq Y_{\text{exact}}(A, B)\Big)$$

*其中，$\mathbb{I}(\cdot)$为指示函数，条件成立时为$1$，否则为$0$。*

> <strong>频率与大小不同：</strong>人为构造十个情况，其中九个误差为1，则ER $=90\%$、MED $=0.9$。清除$0$至$255$均匀分布无符号整数的第零位，得到ER $=50\%$、MED $=0.5$；但MRED取决于非零参考值，不存在通用的$0.01\%$。单独任何一个指标都不能证明失真可见性或可接受性。

> <strong>完整的加法器例子：</strong>考虑16比特低位或运算加法器（Lower-Part OR Adder，LOA），近似低位数$k=8$，无输入进位，输出17比特，输入独立均匀分布。除非两个低字节没有任何同一位置同时为1，否则输出出错，因此ER $=1-(3/4)^8\approx89.99\%$。多数误差较小：MED $=47.875$，最大误差$128$；NMED $=47.875/131070\approx3.65\times10^{-4}$，归一化分母为$D_{\max}=2^{17}-2$。这些数值来自包含分界进位$A_7\land B_7$的完整LOA模型。误差只取决于两个低字节，所以检查全部$2^{16}$个低字节对即可覆盖整个输入域。这里ER高不表示误差大。推导见加法器页：[LOA误差算例](../taxonomy/adders.md#loa-error-example)。

<a id="7-mean-error-me-statistical-bias"></a>

#### 7. 平均误差（$ME$）／统计偏差
电路产生的有符号平均误差：

$$ME = \frac{1}{|S|} \sum_{(A,B) \in S} \Big(Y_{\text{approx}}(A, B) - Y_{\text{exact}}(A, B)\Big)$$

对于有符号误差$e_i=Y_{\text{approx},i}-Y_{\text{exact},i}$，若累加器自身精确且不溢出，累积误差为$\sum_i e_i$。误差期望为零意味着累积误差期望为零，不是每次运行都接近零。其方差为$\sum_i\operatorname{Var}(e_i)+2\sum_{i<j}\operatorname{Cov}(e_i,e_j)$；独立性是额外假设。

<a id="2-downstream-application-quality-metrics"></a>

### 2. 下游应用质量指标

数值指标不能说明全部问题。评估近似算术时，还要使用真实下游应用的感知及机器学习指标。

<a id="peak-signal-to-noise-ratio-psnr"></a>

#### 🖼️ 峰值信噪比（$PSNR$）
峰值信噪比（Peak Signal-to-Noise Ratio，PSNR）用于计算机视觉与图像处理，衡量最大可能像素能量与均方误差（Mean Squared Error，$MSE$）的比值：

$$MSE = \frac{1}{M \times N} \sum_{x=0}^{M-1} \sum_{y=0}^{N-1} \Big(I_{\text{exact}}(x, y) - I_{\text{approx}}(x, y)\Big)^2$$

$$PSNR = 10 \cdot \log_{10}\left( \frac{MAX_I^2}{MSE} \right)$$

* 对8比特灰度图像，$MAX_I = 255$。
* MSE非零且$MAX_I=255$时，也等于$20\log_{10}(255/\sqrt{MSE})$。
* 应比较非空、对齐的区域，保持像素量化和参考处理一致。MSE $=0$时PSNR为无穷；任何正MSE对应有限PSNR。
* 没有固定PSNR值能保证感知等价。Wang等人第II节解释了为何相同MSE可能对应不同可见失真。

<a id="same-mse-example"></a>

<a id="same-mse-different-structure"></a>

##### 相同MSE，不同结构

Wang等人的图2以8比特“Boat”图像为原图（a），另给出五个失真版本（b）–（f）。各失真图相对原图的MSE $=210$，因此五者PSNR相同，均为$10\log_{10}(255^2/210)\approx24.91$ dB（本页由MSE计算；论文图2只报告MSE和MSSIM）。原图是参考，不是第六个失真版本。五者整图MSSIM数值不同：

| 图2子图 | 失真 | 相对原图的MSE | MSSIM |
| :--- | :--- | ---: | ---: |
| (b) | 对比度拉伸 | 210 | 0.9168 |
| (c) | 均值偏移 | 210 | 0.9900 |
| (d) | JPEG压缩 | 210 | 0.6949 |
| (e) | 模糊 | 210 | 0.7052 |
| (f) | 椒盐脉冲噪声 | 210 | 0.7748 |

均值偏移说明了原因。MSE等于平均误差的平方加误差方差。常量偏移只增加均值项，不改变各窗口方差及其与原图的协方差，因此只影响SSIM的亮度项。误差由多个分量相加时，方差含协方差，$\operatorname{Var}(e_1+e_2)=\operatorname{Var}(e_1)+\operatorname{Var}(e_2)+2\operatorname{Cov}(e_1,e_2)$，不只是各方差之和。

两个指标甚至可能给出相反排序。图7中JPEG2000压缩图（e）的PSNR为$34.56$ dB、MSSIM为$0.9409$；图（f）的PSNR较低，为$33.47$ dB，MSSIM却较高，为$0.9747$。图中压缩子图（d）–（f）排列在三个不同原图（a）–（c）下方，因此（e）、（f）看起来是不同图像的压缩结果，而非同一图像的两种失真。该例只能说明评分可能不一致，不能判断哪项更符合人类评价。

<strong>区域与参考也是评分的一部分。</strong>两个指标均相对于明确的参考图像、在明确区域计算。改变比较像素或改用重新编码的参考，会改变两个评分。缺少参考图像、区域和位深的PSNR，不能与另一结果比较，即使两者都以$255$为峰值。

<a id="structural-similarity-index-ssim"></a>

#### 🧠 结构相似性指数（$SSIM$）
$PSNR$衡量原始像素平方误差；结构相似性指数（Structural Similarity Index，$SSIM$）则对人类视觉中的<strong>亮度（$l$）、对比度（$c$）与结构（$s$）</strong>建模：

$$SSIM(x, y) = [l(x, y)]^\alpha \cdot [c(x, y)]^\beta \cdot [s(x, y)]^\gamma$$

采用标准选择$\alpha=\beta=\gamma=1$及$C_3=C_2/2$，可简化为：

$$SSIM(x, y) = \frac{(2\mu_x\mu_y + C_1)(2\sigma_{xy} + C_2)}{(\mu_x^2 + \mu_y^2 + C_1)(\sigma_x^2 + \sigma_y^2 + C_2)}$$

其中$x,y$是局部图像窗口；必须说明均值、方差、协方差、正稳定常数、动态范围和窗口权重。整图MSSIM对局部值取平均。上述简化不适用于任意指数（Wang等人，式12–13）。

* 对具有有效统计量的标准实值公式，评分范围为$[-1,1]$，比较窗口完全相同则为$1$。实现给出的满分或舍入后的报告分数，都不能当作两图完全相同的证明。
* SSIM是质量指标，不是通用接受阈值或安全阈值。

完整卷积算例见[人眼与像素](../bridge/human-eyes-and-pixels.md)，其中也说明单个输出像素能对整图PSNR说明什么、不能说明什么。

<a id="primary-literature-ieee-citations"></a>

### 📚 原始文献与IEEE引文

- <strong>近似算术指标综述：</strong>  
  J. Liang、J. Han、F. Lombardi，*"New Metrics for the Reliability of Approximate and Probabilistic Adders"*，IEEE Transactions on Computers，ED/MED/NED定义（[作者稿](https://www.ece.ualberta.ca/~jhan8/publications/Adder-TC-May28_FinalSubmission.pdf)）。本页数值算例独立计算，不是该论文的测量结果。
- <strong>SSIM质量评价：</strong>  
  Z. Wang、A. C. Bovik、H. R. Sheikh、E. P. Simoncelli，*"Image Quality Assessment: From Error Visibility to Structural Similarity"*，IEEE Transactions on Image Processing，13(4)，600–612，2004，第II节、式12–13、图2与图7（[作者稿](https://www.cns.nyu.edu/pub/lcv/wang03-preprint.pdf)，[作者发表记录](https://eceweb.uwaterloo.ca/~z70wang/publications/ssim.html)）。预印本页码与期刊正式页码不同，这里使用明确的公式定位。
