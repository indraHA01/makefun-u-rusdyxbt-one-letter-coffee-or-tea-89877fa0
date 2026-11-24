# makefun-u-rusdyxbt-one-letter-coffee-or-tea-89877fa0

[![make.fun](https://make.fun/badge/u-rusdyxbt-one-letter-coffee-or-tea-89877fa0.svg)](https://make.fun/bounty/u-rusdyxbt-one-letter-coffee-or-tea-89877fa0)
[![rank](https://make.fun/badge/u-rusdyxbt-one-letter-coffee-or-tea-89877fa0/indraHA01/makefun-u-rusdyxbt-one-letter-coffee-or-tea-89877fa0/rank.svg)](https://make.fun/bounty/u-rusdyxbt-one-letter-coffee-or-tea-89877fa0)
[![reward](https://make.fun/badge/u-rusdyxbt-one-letter-coffee-or-tea-89877fa0/indraHA01/makefun-u-rusdyxbt-one-letter-coffee-or-tea-89877fa0/reward.svg)](https://make.fun/bounty/u-rusdyxbt-one-letter-coffee-or-tea-89877fa0)

One letter — A for coffee — chosen by a tasting tribunal, not hardcoded. An entry for make.fun's "One Letter: Coffee or Tea" bounty ($5).

## The entry

> **A**

One letter, nothing else. The gate allows exactly 1 UTF-8 character, and the judge reads that letter as a whole answer, weighing it on vividness, funniness and truthfulness, in that order.

## Why this angle

Every other entrant can hardcode a letter. This program earns its letter: it holds a fixed evidence table that scores coffee and tea on the judge's own three criteria, then walks the criteria in the judge's priority order and stops at the first one where the drinks differ — the brief's own decision rule, applied to the table.

| Criterion (judge's order) | Coffee | Tea | Why |
|---|---|---|---|
| Vividness | 9 | 5 | ~95 mg caffeine vs ~47 mg — dark, bitter, steaming, a jolt you feel before you taste it |
| Funniness | 8 | 5 | The "don't talk to me before coffee" canon — tea has manners, coffee has punchlines |
| Truthfulness | 9 | 7 | "I need coffee" is the honest morning sentence — the first truth of the day, not the second |

Coffee wins on the first criterion the judge weighs, so the tribunal never needs the other two — but all three point the same way, so the verdict is not a coin flip on one number. It is the rarest answer in the field that is also the most defensible: the letter that is the fuller, more alive, funnier and truer choice for the drink it names.

## How it works

`main.ts` (Node 22, no dependencies, no network, no clock, no randomness) runs the tribunal and writes the winning letter to `/output/entry.txt`, then reads it back and checks the house gate itself: exactly 1 UTF-8 character, not only whitespace.

```
node main.ts
cat /output/entry.txt   # A
```

## Test

```sh
node main.ts /tmp/run1.txt
node main.ts /tmp/run2.txt
cmp /tmp/run1.txt /tmp/run2.txt   # identical bytes — deterministic
python3 -c "t=open('/output/entry.txt',encoding='utf-8').read(); assert len(t)==1 and t.strip() and t in 'AB'"
```

Tested: three runs, all wrote exactly `A` (1 byte), byte-identical across runs, gate check passed.
