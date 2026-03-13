# /roast

Execute a roast session for a given lot using a specified profile.

## Usage

```
/roast <lot-id> <profile-name> [charge-weight-kg]
```

- `lot-id`: Active lot from `data/lots.json`
- `profile-name`: Profile file from `profiles/` (without date suffix)
- `charge-weight-kg`: Optional. Defaults to profile's recommended charge weight.

## What this skill does

1. Validate lot exists and status is `approved` in `data/lots.json`
2. Validate sufficient green weight available (charge weight ≤ remaining weight)
3. Load profile from `profiles/<profile-name>.json`
4. Confirm profile has QC sign-off (signed field present)
5. Display the roast plan:
   - Lot details, charge weight, expected yield
   - Full profile: charge temp, first crack target, development time, drop temp
   - Any lot-specific notes from roaster memory
6. On confirmation, log the roast to `data/roast-log.json`:
   - Lot ID, profile used, charge weight, date, operator
   - Status: `in-progress`
7. After roast completion, prompt for:
   - Actual drop temp, actual first crack time, any deviations
   - Calculate yield loss % and flag if >15%
8. Update lot remaining weight in `data/lots.json`
9. Set roast entry status to `complete`, rest period starts (48h timer note)

## Output format

```
── ROAST PLAN ────────────────────────────────────
Lot:     [ID] — [Origin], [Process]
Profile: [Name] (signed off by QC on [Date])

Charge weight: XXkg → expected yield: ~XXkg (~XX% loss target)

Profile:
  Charge temp:   XXX°C
  Yellow point:  ~X:XX / XXX°C
  First crack:   ~XX:XX / XXX°C
  Dev time:      X:XX (XX% DTR)
  Drop temp:     XXX°C
  Total time:    ~XX:XX

Notes: [Any lot-specific flags]
────────────────────────────────────────────────
Proceed? [yes/no]
```

## Error states

- Lot not found or not approved → block, show lot status
- Insufficient stock → show remaining weight
- Profile not found → list available profiles
- Profile unsigned → block, prompt QC sign-off first
