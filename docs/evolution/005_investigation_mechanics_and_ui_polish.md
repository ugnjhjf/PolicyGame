# 005 - Investigation Mechanics & UI Polish

## Context
After implementing the two core scenarios (Aunt Zhang and Michael), the gameplay loop felt too "click-through". The "Investigation" phase was instantaneous, lacking the feeling of a system actually processing data. Additionally, character contexts (like race or tech-literacy) needed to be more visible during dialogues to reinforce the themes of bias.

## Decisions

### 1. Investigation Gameplay Loop
- **Problem**: Instant results from "Investigating" felt unrewarding.
- **Solution**: Introduced a **Progress Bar** mechanic.
    -   Clicking investigate starts a scanning process.
    -   Visual feedback (blue progress bar) simulates data collection.
    -   Completion triggers a "Ready" state (green bounding/icon).

### 2. Investigation Reports
- **Problem**: Delivering analysis via dialogue felt repetitive.
- **Solution**: Developed a dedicated **Investigation Report UI**.
    -   Formal document style ("Top Secret" / "System Log" aesthetic).
    -   Structured data: Problem, Region, Findings, and System Suggestions.
    -   This separates "narrative" (Dialogue) from "analysis" (Report).

### 3. Character Trait Badges
- **Problem**: Subtleties of character demographics (essential for understanding bias) might be missed in text alone.
- **Solution**: Added visual **Trait Badges** to the dialogue overlay.
    -   Examples: `[Black]`, `[Non-tech user]`.
    -   These badges alert the player to the specific demographic factors the AI might be misinterpreting.

## Implementation Details

### Components
- **`InvestigationReportOverlay.tsx`**: New component for rendering the detailed report.
- **`MapInteractiveLayer.tsx`**: Updated to support `progress` state and render progress bars.
- **`DialogueOverlay.tsx`**: Updated to accept and render `characterTraits`.

### State Management
- **`GamePage.tsx`**: 
    -   Updated `handleMapEvent` to manage the `investigating` -> `progress` -> `report` flow.
    -   Report data is currently mocked in `GamePage` but designed to be externalized to JSON in future iterations.

## Results
The game now has a more satisfying rhythm: Talk -> Clue -> Scan (Wait) -> Report -> Concept. The UI provides better context for the social issues being simulated.
