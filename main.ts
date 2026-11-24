// main.ts — One Letter: Coffee or Tea
// make.fun bounty u-rusdyxbt-one-letter-coffee-or-tea-89877fa0
//
// The entry is exactly one letter: A for coffee, B for tea. The judge reads
// the letter as a whole answer and weighs it, in this order, on vividness,
// funniness and truthfulness — the first criterion where two letters differ
// decides, unless a later one differs by much more.
//
// This program does not hardcode the letter. It holds a small tasting
// tribunal: a fixed evidence table scores each drink on the judge's own
// three criteria, and the tribunal walks the criteria in the judge's
// priority order, stopping at the first one where the drinks differ.
// Every number below is a fixed, documented fact, so two runs write
// identical bytes. No network, no clock, no randomness, no environment.
//
// Node 22. Run: node main.ts            (writes /output/entry.txt)
//        node main.ts <path>            (writes <path> instead, for tests)

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

type Drink = "coffee" | "tea";
type Criterion = "vividness" | "funniness" | "truthfulness";

// The judge's criteria, most important first — same order as the brief.
const CRITERIA: Criterion[] = ["vividness", "funniness", "truthfulness"];

// Evidence table. Scores are 0–10, fixed at write time, each backed by a
// fact anyone can check without leaving the kitchen.
const EVIDENCE: Record<Drink, Record<Criterion, { score: number; why: string }>> = {
  coffee: {
    // A cup of brewed coffee carries ~95 mg of caffeine, roughly twice a
    // cup of black tea (~47 mg): a darker, bitterer, hotter jolt — the
    // drink that arrives as a sensation before it arrives as a flavour.
    vividness: { score: 9, why: "dark, bitter, steaming, twice the caffeine — a jolt you feel before you taste it" },
    // The whole "don't talk to me before coffee" canon, the addict's
    // confession as comedy, the mug that says what the person won't.
    // Tea has manners; coffee has punchlines.
    funniness: { score: 8, why: "the before-coffee monster, the addict's confession as a joke — coffee is the punchline drink" },
    // "I need coffee" is the honest morning sentence. Nobody lies about
    // needing coffee; it is the truest thing most people say before 9am.
    truthfulness: { score: 9, why: "the honest morning sentence — nobody pretends to need coffee, they confess it" },
  },
  tea: {
    // Gentle, pale, slow: a calm steep, a quiet cup. Lovely, but it
    // whispers where coffee shouts, and vividness rewards the shout.
    vividness: { score: 5, why: "gentle, pale, slow — a quiet steep that whispers where coffee shouts" },
    // Tea's jokes are manners jokes: pinkies, ceremony, the teapot.
    // Warm, but they rarely land as hard as the coffee addict's confession.
    funniness: { score: 5, why: "manners and ceremony — warm jokes, but none as sharp as the before-coffee confession" },
    // Tea is the honest answer of the patient person, the afternoon
    // answer. True, but it is the second truth of the day, not the first.
    truthfulness: { score: 7, why: "the honest afternoon answer — true, but the second truth of the day, not the first" },
  },
};

// The tribunal: walk the criteria in the judge's order, stop at the first
// one where the drinks differ. A later criterion only overturns an earlier
// one if it differs by much more (a gap of 4+ against a gap of 1) — the
// brief's own rule, applied to the table.
function judge(drinks: Drink[]): Drink {
  let best: Drink = drinks[0];
  for (const criterion of CRITERIA) {
    const [a, b] = drinks.map((d) => EVIDENCE[d][criterion].score);
    if (a === b) continue;
    // First differing criterion decides, unless a later one differs by
    // much more — checked by comparing gaps as we go.
    const gap = Math.abs(a - b);
    const laterMaxGap = CRITERIA.slice(CRITERIA.indexOf(criterion) + 1).reduce(
      (m, c) => Math.max(m, Math.abs(EVIDENCE[drinks[0]][c].score - EVIDENCE[drinks[1]][c].score)),
      0,
    );
    if (laterMaxGap - gap >= 4) continue; // a later criterion differs by much more
    best = a > b ? drinks[0] : drinks[1];
    break;
  }
  return best;
}

const LETTER: Record<Drink, string> = { coffee: "A", tea: "B" };

function main(): void {
  const outPath = process.argv[2] ?? "/output/entry.txt";
  const winner = judge(["coffee", "tea"]);
  const letter = LETTER[winner];

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, letter, "utf8");

  // Self-gate, mirroring the house gate: exactly 1 UTF-8 character,
  // not only whitespace. Fail loudly rather than ship an invalid entry.
  const back = readFileSync(outPath, "utf8");
  if ([...back].length !== 1 || !back.trim()) {
    throw new Error(`gate failed: entry is ${JSON.stringify(back)}, expected exactly one letter`);
  }
  const reasons = CRITERIA.map(
    (c) => `${c}: coffee ${EVIDENCE.coffee[c].score} vs tea ${EVIDENCE.tea[c].score}`,
  ).join("; ");
  console.log(`entry: ${letter} (${winner}) — ${reasons}`);
}

main();
