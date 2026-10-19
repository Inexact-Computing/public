# Bits and Carries: Where Computer Arithmetic Starts

Computers add numbers with switches that are either off or on. This page shows how a row of switches stands for a number, and how adding two such rows moves value from one column to the next.

**You need:** ordinary whole-number addition. Nothing else is assumed.

**After this page you can:**

1. read a four-bit pattern as a number by adding the weights of its bits;
2. add two four-bit numbers column by column, showing every carry;
3. tell the full five-bit sum apart from the four bits that a four-bit store keeps.

**Next page:** [How Do We Grade Mistakes?](../fundamentals/error-metrics-made-easy.md) uses these ideas to compare an exact result with an approximate one.

---

<a id="read-b01"></a>

## Bits and their weights

A **bit** is a switch with two states: 0 (off) or 1 (on). A row of bits is a **binary pattern**. The number of bits in the row is its **width**; this page uses a width of four bits.

Each position has its own **weight**. The rightmost bit is worth 1, and each step to the left doubles the value of a bit:

| Position (from the right) | 4th | 3rd | 2nd | 1st |
|---|---:|---:|---:|---:|
| Weight | 8 | 4 | 2 | 1 |

The rightmost position (1st, weight 1) is numbered bit 0 in the workbench, counting up to bit 3 on the left. A fifth position, if we need one, is worth 16.

To read a pattern, add the weights whose bits are 1. For example, `0110` has 1s in the positions worth 4 and 2, so `0110` means 4 + 2 = 6. All numbers on this page are **unsigned**: a pattern stands for zero or a positive number, never a negative one. The four bits can therefore show 0 (`0000`) up to 15 (`1111`).

We call the left end the **high** end (larger weights) and the right end the **low** end (smaller weights).

**Workbench task (Bits view).** Predict first: what value does `1011` stand for? Then set the four switches in the workbench below and compare. Each time you flip a switch, the Bits view shows which weights are being added.

<iframe
  src="../../labs/bits-and-carry-workbench.html"
  title="Bits and Carry Workbench"
  style="width: 100%; height: 1700px; border: none; background: transparent; margin: 12px 0;"
  loading="lazy"
></iframe>

If the workbench does not load, [open the Bits and Carry Workbench on its own page](../labs/bits-and-carry-workbench.html). Everything it shows is also in the tables on this page.

<a id="read-b02"></a>

## One column at a time: carries, gates and the full adder

### Why a carry appears

In ordinary addition, 5 + 7 in one column gives 12: you write 2 and carry 1 into the next column, where it is worth ten times as much. Binary works the same way, except that the next column is worth **twice** as much.

So 1 + 1 = 2, and 2 written in binary is `10` (one 2 and zero 1s). In that column we write 0 and send a 1 to the column on the left. That 1 is a **carry**. Seen from the column on the left, it is an **incoming carry** (carry-in). Seen from the column that sent it, it is an **outgoing carry** (carry-out).

### Three simple gates

A **gate** takes bits in and gives one bit out. A **truth table** lists every possible input and the output for each. Here are three gates with two inputs, x and y:

| x | y | AND | OR | XOR |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 | 1 |
| 1 | 0 | 0 | 1 | 1 |
| 1 | 1 | 1 | 1 | 0 |

- **AND** gives 1 only when both inputs are 1.
- **OR** gives 1 when at least one input is 1.
- **XOR** gives 1 when exactly one input is 1.

None of these gates adds two bits completely. OR answers "is at least one input 1?", but it never produces a carry.

### The full adder: one column of addition

A **full adder** adds three bits that meet in one column: the A bit, the B bit and the incoming carry (Cin). It reports the total as a **sum bit** (Sum, worth 1 in this column) and a **carry-out** (Cout, worth 2, sent to the next column). Count how many inputs are 1:

| A | B | Cin | Number of 1s | Sum | Cout |
|---|---|---|---:|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 | 1 | 0 |
| 0 | 1 | 0 | 1 | 1 | 0 |
| 0 | 1 | 1 | 2 | 0 | 1 |
| 1 | 0 | 0 | 1 | 1 | 0 |
| 1 | 0 | 1 | 2 | 0 | 1 |
| 1 | 1 | 0 | 2 | 0 | 1 |
| 1 | 1 | 1 | 3 | 1 | 1 |

In every row, (number of 1s) = Sum + 2 × Cout, so no value is lost. For example, three 1s make 3, which is `11` in binary: Sum 1 and Cout 1.

**Workbench task (Gates & full adder view).** Set x = 1 and y = 1; these are A and B in the full-adder table above. Predict the AND, OR and XOR outputs, then select each Gate and press **Check gate and full adder**. Next, keep x = 1 and y = 1, set **Local carry-in** to 1, predict Sum and Cout, and check again. This carry-in belongs to one practice column only. When we add whole four-bit numbers below, nothing enters the rightmost column from outside, so its carry-in is always 0.

<a id="read-b03"></a>

## Adding 7 + 1 column by column

A quick warm-up first: `0010` + `0001` (2 + 1) has no column with two 1s, so nothing is carried and the answer is `0011` = 3.

Now add 7 + 1, which is `0111` + `0001`. Start at the rightmost column, just as in ordinary addition. The carry into that first column is 0.

**Predict first:** in which column does the first carry appear, and how far does it travel?

**Workbench task (Carry view).** Enter 7 and 1, then step through the columns one at a time from the right. Before each step, say what the Sum and Cout will be.

<details markdown="1">
<summary>Check the columns for 7 + 1</summary>

| Column (weight) | A bit | B bit | Carry in | Sum bit | Carry out |
|---|---|---|---|---|---|
| 1st (1) | 1 | 1 | 0 | 0 | 1 |
| 2nd (2) | 1 | 0 | 1 | 0 | 1 |
| 3rd (4) | 1 | 0 | 1 | 0 | 1 |
| 4th (8) | 0 | 0 | 1 | 1 | 0 |

The first column holds two 1s, so it writes 0 and carries 1. That carry meets one more 1 in each of the next two columns, so it travels on. In the fourth column it meets two 0s: the sum bit becomes 1 and nothing more is carried.

</details>

Reading the sum bits from left to right gives `1000`, and the final carry-out is 0. Written with all five positions, the full result is `01000` = 8. The 1 sits in the fourth column, which already existed; the fifth position (worth 16) stays 0.

### When the fifth bit is needed: 15 + 1

Now try `1111` + `0001` (15 + 1). Every column passes a carry to the left, and the last carry-out is 1.

| | Five-bit result | Four bits kept |
|---|---|---|
| `1111` + `0001` | `10000` = 16 | `0000` |

The **full sum** needs a fifth bit: `10000` = 16. If a number store only has room for four bits, it keeps `0000` and the final carry is lost. That `0000` is not the full exact sum; it is what a four-bit unsigned store retains.

**Workbench task (Carry view).** Enter 15 and 1. Before stepping, predict the five-bit result and the four bits kept, then check them in the workbench.

<details markdown="1">
<summary>Check the columns for 15 + 1</summary>

| Column (weight) | A bit | B bit | Carry in | Sum bit | Carry out |
|---|---|---|---|---|---|
| 1st (1) | 1 | 1 | 0 | 0 | 1 |
| 2nd (2) | 1 | 0 | 1 | 0 | 1 |
| 3rd (4) | 1 | 0 | 1 | 0 | 1 |
| 4th (8) | 1 | 0 | 1 | 0 | 1 |

The last carry becomes the fifth bit: full result `10000`, four bits kept `0000`.

</details>

### Optional review: 3 + 5

Try `0011` + `0101` on paper before opening the check.

<details markdown="1">
<summary>Check 3 + 5</summary>

| Column (weight) | A bit | B bit | Carry in | Sum bit | Carry out |
|---|---|---|---|---|---|
| 1st (1) | 1 | 1 | 0 | 0 | 1 |
| 2nd (2) | 1 | 0 | 1 | 0 | 1 |
| 3rd (4) | 0 | 1 | 1 | 0 | 1 |
| 4th (8) | 0 | 0 | 1 | 1 | 0 |

The full result is `01000` = 8. The bit patterns differ from 7 + 1, but the carries travel through the same three columns.

</details>

---

## Check your understanding

Answer on paper first, then open the check. Your answers are not saved or sent anywhere.

<a id="read-q1"></a>

**Question 1.** Using the bit weights 8, 4, 2, 1, what decimal value is `1011`? Show the amounts you add.

<details markdown="1">
<summary>Check question 1</summary>

**11 = 8 + 2 + 1.** The bits that are 1 sit in the positions worth 8, 2 and 1.

- If you got 13, you read the weights in the wrong direction: the rightmost bit is worth 1, the leftmost is worth 8.
- If you got 3, you counted the 1s. Each bit is worth its position's weight, not 1.
- `1011` is a pattern of switches, not the decimal number one thousand and eleven.

</details>

<a id="read-q2"></a>

**Question 2.** (a) Add `0111` and `0001` starting from the right. Show the carry into and out of each column. (b) For `1111` + `0001`, write the full five-bit result and the four rightmost bits.

<details markdown="1">
<summary>Check question 2</summary>

(a) The full result is `01000`. The carries into the columns, from the right, are 0, 1, 1, 1, and the last carry-out is 0. If you wrote `0110`, you wrote 0 in the rightmost column but did not pass its carry on.

(b) The full result is `10000` (16), with a final carry-out of 1. The four rightmost bits are `0000`. That `0000` is what four bits keep; it is not the full sum.

</details>

<a id="read-q3"></a>

**Question 3.** For inputs 1 and 1, give the outputs of AND, OR and XOR. A full adder receives A = 1, B = 1 and carry-in = 1. State its sum bit and carry-out. Explain how adding the three input bits gives your answer.

<details markdown="1">
<summary>Check question 3</summary>

AND gives 1, OR gives 1, XOR gives 0. XOR gives 1 only when exactly one input is 1.

The full adder gives **Sum 1 and Cout 1**: three 1s make 3, which is `11` in binary. If you answered Sum 0 and Cout 1, you added only A and B and left out the carry-in.

</details>

---

## Going deeper

The formal carry equations (with generate and propagate signals) and the delay of carry chains are in [The Carry Propagation Physics & Bottleneck](../taxonomy/adders.md#the-carry-propagation-physics-bottleneck) on the adders page. They are not needed for the next two pages.
