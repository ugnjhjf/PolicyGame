# 007 - Expanding the Narrative & Developer Tools

## Context
Following the implementation of racial bias scenarios with Michael, the narrative required expansion to cover "Confirmation Bias" within law enforcement. Additionally, as the content grew, manually playing through the game to verify data linkages became inefficient, highlighting the need for developer tools.

## Decisions

### 1. New Narrative Event: Officer Chan
- **Content**: Added a new map event "Officer Chan's Patrol".
- **Concept**: Introduces "Confirmation Bias" — the tendency to interpret new evidence as confirmation of one's existing beliefs or theories.
- **Mechanics**:
    - **Dialogue**: Highlights Chan's reliance on "intuition" over evidence.
    - **Report**: A Pie Chart visualizing his arrest record (High total arrests vs. Low conviction rate).
    - **Visual Customization**: Implemented custom chart colors (Green for correct, Red for wrongful) and configurable value suffixes (removing '%' for raw counts) to improve data clarity.

### 2. Developer Productivity Tools
- **Problem**: Testing late-game content (Unlockable Concepts) required replaying the tutorial and map events repeatedly.
- **Solution**: Implemented a "Dev Mode" toggle.
    - **UI**: A unobtrusive "DEV MODE" button in the top-right corner.
    - **Functionality**: "Unlock All" button that instantly merges all JSON data (Clues, Concepts, Reports) into the player's active state.
    - **Safe-guard**: Visual indicators (Red border) when Dev Mode is active to prevent confusion during regular play.

### 3. Encyclopedia Formatting
- **Improvement**: Enabled `whitespace-pre-wrap` in the `PDAOverlay` to support newlines (`\n`) in JSON description fields.
- **Impact**: Allows for better readability of long concept descriptions by breaking them into paragraphs.

## Implementation Details

### Data Structure
- `config/data/report/officer_chan.json`: Added `colors` (["#4ade80", "#ef4444"]) and `valueSuffix` ("") properties to the chart definition.
- `types/rpg.ts`: Updated `InvestigationReportData` to support optional `colors` and `valueSuffix`.

### Dev Mode Logic
- Created `handleDevUnlockAll` in `GamePage.tsx`.
- Uses `Object.values()` to flatten imported data modules and marks `isRead: true` for all items.

## Results
The game now features three distinct bias scenarios (Selection, Algorithmic, Confirmation). The new Developer Mode significantly reduces iteration time for verifying future content additions.
