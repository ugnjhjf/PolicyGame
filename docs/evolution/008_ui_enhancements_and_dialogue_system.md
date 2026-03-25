# 008: UI Enhancements and Dialogue System Refinements

**Date:** 2026-01-13
**Status:** Implemented

## Overview
This update focuses on enhancing the visual novel aspects of the game (dialogue system) and integrating UI components from other branches to unify the game interface.

## Key Changes

### 1. Dialogue System
-   **Typewriter Effect**: Implemented character-by-character text rendering for a more immersive reading experience.
-   **Controls**:
    -   Added "Skip" functionality (click or press Next) to instantly reveal full text.
    -   Added a blinking cursor indicator.
-   **Readability**:
    -   Limited text width to `30em` (approx 60 characters) to prevent long lines spanning the full screen.
    -   Added a speed slider (1.0x - 1.5x) allowing users to adjust text scrolling speed.
-   **Bug FixES**: Fixed an issue where empty trait strings rendered as empty purple boxes.

### 2. UI Panels (Objective & To-do)
-   **Porting**: Integrated `GameObjectivePanel` from the `dev/v4` branch into the main game page.
-   **To-do List Updates**:
    -   Updated items to specific tasks: "Talk to Aunt Zhang", "Talk to Officer Chan", "Talk to Michael".
    -   **Map Integration**: Clicking a to-do item now triggers the corresponding map event, acting as a shortcut.
    -   **State Tracking**: Panels automatically update status (checkmarks) based on game state.

### 3. Map Enhancements
-   **Labels**: Added permanent character/location labels below the map icons (previously only tooltips were available).
-   **Animation Refinement**: Decoupled the label rendering from the icon's bounce animation, ensuring text remains readable and static while the icon animates.

## Technical Details
-   **Files Modified**: `DialogueOverlay.tsx`, `GameObjectivePanel.tsx`, `active events logic in page.tsx`, `MapInteractiveLayer.tsx`.
-   **Cleanup**: Removed broken/dead code references (`mapEvents`).
