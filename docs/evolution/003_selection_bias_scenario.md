---
id: 003
date: 2025-12-15
type: feature
status: accepted
tags: [scenario, bias, narrative]
links: []
commit_no: pending
---

# Context
Based on the professor's feedback, the project is pivoting from a pure simulation to a Narrative RPG focused on AI ethics themes. The first theme to implement is **Selection Bias**, demonstrated through the character "Aunt Zhang".

# Goal
- **Demonstrate Selection Bias**: Show how an AI model trains on incomplete data (ignoring cash-based economies) and mislabels legitimate business owners as "high risk".
- **RPG Mechanics**: Implement the loop of Map Interaction -> Dialogue -> Finding Clues -> Investigation -> Educational Analysis -> PDA Update.

# Implementation
### 1. Game State & Logic (`app/game/page.tsx`)
- Refactored `GamePage` to manage `DialogContent`, `RPGState` (Journal/Encyclopedia), and Map Events locally.
- Implemented state transitions for Map Events:
    - **Status 'Available'**: Shows '!' icon. Clicking triggers initial dialogue (Aunt Zhang complaining).
    - **Status 'Investigating'**: Shows 'Magnifier' icon. Clicking triggers system analysis.
    - **Status 'Completed'**: Hides or marks event as done. Unlocks knowledge in PDA.

### 2. Map Interaction (`MapInteractiveLayer`)
- Updated to accept `MapEvent[]` with dynamic status.
- Renders different icons (`AlertCircle` vs `Search`) based on event status (`available` vs `investigating`).

### 3. Narrative Content
- **Character**: Aunt Zhang (Small shop owner, cash user).
- **Clue**: "Zhang's Ledger" (Physical proof of income unseen by AI).
- **Concept**: "Selection Bias" (Definition of the error source).

# Result
A complete gameplay loop for the first scenario is functional. Players can experience the narrative flow and unlock educational content in the PDA.

# Next Steps
- Expand to other bias types (e.g., Proxy Bias).
- Polish the UI transitions (e.g., animations when unlocking PDA).
