# Patojismo Coffee System

Patojismo is a specialty coffee operation system. Manages the full stack: green bean sourcing, roasting, quality control, barista operations, and inventory — all agent-driven.

## System Structure

| Directory | Purpose |
|-----------|---------|
| `.claude/agents/` | Specialized agents per operational area |
| `.claude/skills/` | Reusable skills invokable across agents |
| `.claude/agent-memory/` | Persistent state per agent |
| `data/` | Roast logs, cupping sheets, inventory snapshots |
| `recipes/` | Drink recipes and brew protocols |
| `profiles/` | Roast profiles per origin/lot |

## Agents

| Agent | Role |
|-------|------|
| `roaster` | Green bean sourcing, roast scheduling, profile execution |
| `barista` | Drink recipes, service protocols, customer experience |
| `qc` | Cupping sessions, grading, quality gates |
| `inventory` | Stock tracking, supplier orders, cost tracking |

## Skills

| Skill | Trigger |
|-------|---------|
| `/brew` | Execute a specific drink recipe |
| `/roast` | Run a roast profile for a lot |
| `/cup` | Conduct a cupping session |
| `/restock` | Trigger a supplier reorder |
| `/menu` | Generate or update the current menu |

## Principles

- **Traceability**: Every cup traceable to a lot, roast date, and origin
- **Quality gates**: No lot advances without QC sign-off
- **Inventory-first**: Recipes blocked if ingredients out of stock
- **Simple data**: Plain text logs + JSON snapshots — no heavy DB
- **Language**: Spanish for internal ops, English for external-facing menus

## Anti-Patterns

- Don't create a roast without an active lot in inventory
- Don't publish a recipe without a passing cupping score (≥80 SCA)
- Don't place supplier orders without checking existing stock first
