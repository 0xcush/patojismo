# /restock

Check inventory levels and draft purchase orders for items below reorder threshold.

## Usage

```
/restock [item | all]
```

- `item`: Specific item name from `data/inventory.json` or `data/lots.json`
- `all`: Scan everything and surface all items at or below reorder threshold
- No argument: defaults to `all`

## What this skill does

1. Read `data/inventory.json` (consumables) and `data/lots.json` (green beans)
2. For each item, compare current quantity against `reorder_point`
3. Group results:
   - **Critical** (at or below 50% of reorder point)
   - **Low** (below reorder point)
   - **OK** (above reorder point)
4. For critical and low items:
   - Look up preferred supplier in `data/suppliers.json`
   - Calculate suggested order quantity (typically 2× reorder point)
   - Draft PO entry with: supplier, item, quantity, estimated unit price, estimated total
5. Display summary table
6. Prompt: "Draft all POs to `data/orders.json`? [yes/no]"
7. If yes: write draft POs with status `draft`, await operator approval before submitting

## Output format

```
── RESTOCK REPORT ───────────────────────────────
Scanned: [N] items | Critical: X | Low: X | OK: X

CRITICAL:
  Oat milk        2L remaining   (reorder: 6L)   → draft PO: 12L from [Supplier]
  Filters V60     12 units       (reorder: 50)   → draft PO: 100 from [Supplier]

LOW:
  Whole milk      8L remaining   (reorder: 10L)  → draft PO: 20L from [Supplier]
  Cups 12oz       85 units       (reorder: 100)  → draft PO: 200 from [Supplier]

GREEN BEANS:
  LOT-2024-ETH-01   1.8kg left  (threshold: 2kg) → alert roaster + draft reorder

OK:
  [Collapsed — X items]
────────────────────────────────────────────────
Draft POs to data/orders.json? [yes/no]
```

## Error states

- Supplier not found for an item → flag as "no supplier configured", skip PO draft
- `data/inventory.json` missing → error with instructions to initialize
- Order already in `submitted` state for same item → warn, show existing order
