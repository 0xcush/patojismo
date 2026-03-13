# /brew

Execute a drink recipe from the Patojismo recipe library.

## Usage

```
/brew <drink-name> [lot-id]
```

- `drink-name`: Name of the recipe in `recipes/` (e.g., `espresso`, `v60-ethiopian`, `cold-brew`)
- `lot-id`: Optional. Force a specific lot. Defaults to the current active lot for that recipe.

## What this skill does

1. Look up the recipe in `recipes/<drink-name>.json`
2. Verify the referenced lot is `active` in `data/lots.json` and has remaining weight
3. Verify the lot has `qc_status: approved` (or `conditional` if method is allowed)
4. Read brew parameters: dose, yield, time, temp, grind, notes
5. Output a formatted brew guide:
   - Equipment needed
   - Step-by-step instructions with timings
   - Target parameters to hit
   - Tasting notes to expect
6. Log the brew event to `data/brew-log.json` (optional, if tracking usage)

## Output format

```
── BREW GUIDE: [Drink Name] ──────────────────────
Lot:     [ID] — [Origin], [Process]
Roasted: [Date] | Cupping score: [Score]

Equipment: [List]

Parameters:
  Dose:   XXg
  Yield:  XXg (ratio X:X)
  Time:   X:XX
  Temp:   XX°C
  Grind:  [Setting / Description]

Steps:
  1. ...
  2. ...
  ...

Expect: [Tasting notes]
────────────────────────────────────────────────
```

## Error states

- Recipe not found → list available recipes
- Lot not active → suggest nearest alternative lot
- QC not approved → block and show QC status + cupping score
- Insufficient stock → show remaining weight and suggest alternative
