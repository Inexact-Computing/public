# Glossary of Inexact & Approximate Computing

This glossary provides concise, plain-English definitions and mathematical context for terms frequently used across approximate hardware design.

---

### **Accuracy-Configurable / Dual-Mode**
An arithmetic unit that can switch at runtime between exact computation mode and one or more approximate modes to dynamically adapt to varying battery, thermal, or QoS constraints.

### **Carry-Disregard / Broken-Array**
A multiplier optimization technique where carry propagation is cut or disregarded in the least significant bit (LSB) columns of the partial product reduction tree, eliminating long carry-chains at the cost of bounded LSB error.

### **Compressor (Approximate 4:2 / 5:2)**
A multi-input adder cell used in Wallace/Dadda trees that condenses $N$ partial product bits into sum and carry outputs with simplified Boolean logic that introduces rare, low-magnitude truth-table deviations.

### **DRUM (Dynamic Range Unbiased Multiplier)**
A leading-one detector (LOD) based multiplier that dynamically selects a $k$-bit window of the most significant active bits of operands, truncating lower bits while applying unbiased rounding compensation.

### **EDP (Energy-Delay Product)**
A primary hardware figure-of-merit defined as $\text{EDP} = \text{Energy} \times \text{Delay} = \text{Power} \times \text{Delay}^2$.

### **ER (Error Rate)**
The fraction of all input combinations for which the approximate circuit output differs from the exact mathematical result:
$$\text{ER} = \frac{1}{|S|} \sum_{x \in S} \mathbb{I}(Y_{approx}(x) \neq Y_{exact}(x))$$

### **Lower-Part Constant (LPC)**
An approximation scheme in adders or multipliers where the $k$ least significant bits of the result are fixed to a constant (often $2^{k-1}$) or trivial bitwise OR, reducing area to zero in the lower slice.

### **MED (Mean Error Distance)**
The average absolute arithmetic error over the input evaluation domain $S$:
$$\text{MED} = \frac{1}{|S|} \sum_{x \in S} |Y_{approx}(x) - Y_{exact}(x)|$$

### **MRED (Mean Relative Error Distance)**
The average relative error across non-zero exact outputs, crucial for signal processing where relative precision matters more than absolute magnitude:
$$\text{MRED} = \frac{1}{|S \setminus \{x: Y_{exact}=0\}|} \sum \frac{|Y_{approx}(x) - Y_{exact}(x)|}{|Y_{exact}(x)|}$$

### **NMED (Normalized Mean Error Distance)**
$\text{MED}$ normalized by the maximum possible output $D_{max}$ of the exact circuit:
$$\text{NMED} = \frac{\text{MED}}{D_{max}}$$

### **RoBA (Rounding-Based Approximate Multiplier)**
An algorithm that rounds operands to their nearest powers of two ($A \approx 2^{k_1}, B \approx 2^{k_2}$), performing multiplication via barrel shifters and basic subtraction rather than full multiplier trees.

### **WCE (Worst-Case Error)**
The maximum absolute error magnitude that the approximate circuit can produce across the entire input space:
$$\text{WCE} = \max_{x \in S} |Y_{approx}(x) - Y_{exact}(x)|$$
