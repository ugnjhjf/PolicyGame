---
id: 002
date: 2025-12-11
type: feature
status: accepted
tags: [ui, rpg-mechanics]
links: []
commit_no: 2b04bed
---

# Context
To support the Narrative RPG gameplay, we need specific UI components that were not present in the simulation version. Specifically:
1.  A way to interact with the map without entering separate pages.
2.  A way to display character dialogue (Visual Novel style).
3.  A central hub for collected information (Journal & Encyclopedia).

# Options
- **Separate Pages**: Keep using routing for everything (e.g., `/dialogue/1`).
    - *Cons*: Breaks immersion, slow transitions.
- **Overlays/Modals**: Render UI on top of the map.
    - *Pros*: Seamless experience, feels like a modern game.

# Decisions
Chosen **Overlays**. Created a set of reusable components (`DialogueOverlay`, `PDAOverlay`) that can be controlled via state in the main `GamePage`.

# Design
- **MapInteractiveLayer**: Uses absolute positioning with percentage values (`top: 50%`, `left: 50%`) to ensure icons stay correctly placed on the responsive map image.
- **DialogueOverlay**: Designed with a "Portrait" slot and a "Text Box" slot. Supports choices for future RPG elements.
- **PDAOverlay**: Implemented a Tab system to switch between "Journal" (Gameplay clues) and "Encyclopedia" (Educational content).

# Result
The game now features a functional skeleton for the RPG experience. Players can click icons, see dialogue (mockup), and open their PDA.

# Lessons
Separating the "Data Interfaces" (`Concept`, `Clue`) into the component file is a temporary measure. In Phase 3, these should be moved to a global type definition file (`types/rpg.ts`) to avoid circular dependencies.
