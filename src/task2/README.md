# Task 2 — String Character Frequency

Counts character occurrences in a string and outputs them in order of first appearance.

---

## Example

```
Input  : "hello world"
Output : h:1, e:1, l:3, o:2,  :1, w:1, r:1, d:1
```

Note: the space character between `o:2` and `w:1` is counted (` :1`).

---

## Implementation

**File**: `task2/stringFrequency.ts`

## Assumptions

| Concern | Decision | Rationale |
|---|---|---|
| Case sensitivity | Case-sensitive | `'a'` and `'A'` are distinct characters |
| Whitespace | Counted | The brief's own example output includes ` :1` for the space |
| Special characters | Counted | No character is excluded |
| Unicode | Supported | `for...of` iterates by Unicode code point, not byte |
| Empty input | Returns `""` | No characters = no output |

---

## Run the CLI

```bash
# Default — runs the example from the brief
npm run task2

# Custom input
npx ts-node task2/stringFrequency.ts "your string here"
```

---

## Run the Tests

Tests live in `src/tests/stringFrequency.spec.ts` and run via the main Playwright config.

```bash
npm run task2:test
```

### Test coverage

| Group | Cases |
|---|---|
| Core behaviour | Example from brief, first-appearance order, single char, repeated chars |
| Case sensitivity | `aAbB` → `a:1, A:1, b:1, B:1` |
| Whitespace | Single space, multiple spaces |
| Special characters | `!!!`, mixed alphanumeric + special |
| Edge cases | Empty string, all unique chars, Unicode (`café`) |