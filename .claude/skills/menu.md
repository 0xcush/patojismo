# /menu

Generate or update the current service menu based on active lots and recipes.

## Usage

```
/menu [generate | update | print]
```

- `generate`: Build menu from scratch based on current active lots and recipes
- `update`: Sync availability flags against current stock without rebuilding
- `print`: Output formatted printable menu text (English, guest-facing)
- No argument: defaults to `update` then `print`

## What this skill does

### `generate`
1. Read all recipes in `recipes/`
2. For each recipe, check referenced lot in `data/lots.json`:
   - `active` + `qc_status: approved` → available
   - `active` + `qc_status: conditional` → available (check method compatibility)
   - `depleted` or `qc_status: rejected` → unavailable
3. Read consumables from `data/inventory.json` — flag drinks requiring out-of-stock items
4. Build `data/menu.json` with full item list, availability, pricing, tasting notes
5. Report: X items available, Y unavailable, Z flagged

### `update`
1. Re-check availability for every item in existing `data/menu.json`
2. Update `available` flag only — do not change pricing or descriptions
3. Log changes: "Oat latte → unavailable (oat milk stock: 0)"

### `print`
Output a formatted menu grouped by category:

```
── PATOJISMO ─────────────────────────────────────

ESPRESSO BAR
  Espresso          $X.XX   Intenso, chocolatoso, cuerpo sedoso
  Cortado           $X.XX   Balance entre café y leche
  Flat White        $X.XX   Cremoso, dulce, suave

FILTER
  Pour Over         $X.XX   [Origin] — floral, cítrico, acidez brillante
  Cold Brew         $X.XX   Concentrado, refrescante, bajo en acidez

SEASONAL
  [Seasonal item]   $X.XX   [Description]

─── All coffees sourced direct. Ask us about the current lot. ───
```

## Error states

- `data/menu.json` not found + command is `update` or `print` → prompt to run `/menu generate` first
- No active approved lots → warn that menu will be empty
- Recipe references a lot that doesn't exist in `data/lots.json` → flag as broken recipe, exclude from menu
