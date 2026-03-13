# /cup

Run a cupping session for a lot and record SCA scores.

## Usage

```
/cup <lot-id> [roast-date]
```

- `lot-id`: Lot to evaluate (must have at least one roast log entry)
- `roast-date`: Optional. If multiple roasts exist, specify which one to cup. Defaults to most recent.

## What this skill does

1. Pull lot info from `data/lots.json` and most recent roast from `data/roast-log.json`
2. Check lot isn't already QC-approved for this roast date (warn if re-cupping)
3. Display cupping setup sheet:
   - Grind target, water volume, temp, steep time
   - Lot metadata: origin, process, roast date, days rested
4. Walk through SCA scoring interactively — prompt for each attribute:
   - Fragrance/Aroma, Flavor, Aftertaste, Acidity, Body, Balance, Uniformity, Clean Cup, Sweetness, Overall
   - Each scored 6.00–10.00 in 0.25 increments
5. Calculate final score (sum + defect deductions)
6. Apply quality gate:
   - ≥85 → specialty highlight
   - 80–84 → approved
   - 75–79 → conditional (flag allowed uses)
   - <75 → rejected
7. Prompt for tasting notes (free text)
8. Write result to `data/cupping-log.json`
9. Update `data/lots.json` → set `qc_status` and `cupping_score`
10. If approved: sign off corresponding profile (if profile references this lot)

## Output format

```
── CUPPING SHEET ────────────────────────────────
Lot:      [ID] — [Origin], [Farm], [Process]
Roasted:  [Date] ([N] days ago)
Grind:    Medium-coarse | 8.25g / 150mL | 93°C | 4min steep

Attribute scoring (6.00 – 10.00):
  Fragrance / Aroma: ___
  Flavor:            ___
  Aftertaste:        ___
  Acidity:           ___
  Body:              ___
  Balance:           ___
  Uniformity:        ___
  Clean Cup:         ___
  Sweetness:         ___
  Overall:           ___

Defects: ___ (×2 category 1, ×4 category 2)

─────────────────────────────
Final score: XX.XX
Result:      [APPROVED / CONDITIONAL / REJECTED]
────────────────────────────────────────────────
```

## Error states

- Lot not found → error
- No roast log for lot → block (can't cup unroasted coffee)
- Rest period <48h → warn (results may not be representative), require confirmation
