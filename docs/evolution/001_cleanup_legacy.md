---
id: 001
date: 2025-12-11
type: refactor
status: accepted
tags: [cleanup, architecture]
links: []
commit_no: 6ef85e9
---

# Context
We are pivoting the game direction from a Simulation Game to a Narrative RPG. The existing codebase contained a "Real-time Simulation Engine" (`engine/core`) and several detail pages (`government-complex`, `police-hq`) that are no longer relevant to the new design direction. Keeping them would cause confusion and bloat.

# Options
1.  **Keep and Disable**: Comment out the code or wrap it in feature flags.
2.  **Delete**: Remove the code entirely to maintain a clean codebase.

# Decisions
Selected **Option 2 (Delete)**. Since we have a clear plan (`docs/plan/implementation_plan.md`) and the old logic (time-based simulation) is fundamentally different from the new logic (event-based RPG), keeping the old code serves no purpose. Git history preserves it if recovery is ever needed.

# Design
- Removed `engine/core`: This contained `indexCalculator` and `gameEngine`.
- Removed `app/government-complex`, `app/police-hq`, `app/data-center` (implied): These were distinct pages for the simulation.
- Updated `app/game/page.tsx`: Removed the "Welcome" modals and direct links to these deleted pages.
- Kept `GameStatusBar`: It might be reused or refactored later, so it was left for now but simplified.

# Result
The application now builds without the simulation engine. The file structure is cleaner.

# Lessons
When deleting components, always check for "Barrel files" (index.ts) or direct imports in parent components (`GamePage`) instantly to avoid breaking the build.
