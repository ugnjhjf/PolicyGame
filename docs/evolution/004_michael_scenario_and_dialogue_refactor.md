# 004 - Michael's Scenario & Dialogue System Refactor

## Context
With the "Selection Bias" (Aunt Zhang) scenario implemented, the next step was to introduce the second key theme: **Algorithmic Bias**. This required adding a new game event ("Michael's Office"). Simultaneously, user feedback highlighted the need for a more robust and visually rich dialogue system, as well as better separation of content from code.

## Decisions

### 1. Dialogue System Overhaul
- **Externalization**: All hardcoded text moved to `config/data/dialogue/`.
- **Directory Structure**: strict separation between narrative dialogues (`events/`) and system analysis (`investigate/`).
- **Rich Text Support**: Implemented a custom parser for:
    - `<red>`: Negative/Alert emphasis.
    - `<yellow>`: Key information/Highlight.
    - `<b>`: Structural emphasis.
    - `\n`: Line breaks within a single dialogue page.
- **Character Metadata**: Added optional `title` field (e.g., "Bakery Owner") to provide context without cluttering the name field.

### 2. Michael's Scenario (Algorithmic Bias)
- **Character Profile**: Michael is a **Black Senior Software Engineer**. This character design is intentional to **break stereotypes** regarding Black individuals' professional capability and income levels. He is highly educated and successful, yet still subject to algorithmic profiling.
- **Narrative**: Michael is fined by a smart city CCTV system for jaywalking. Despite his high socioeconomic status, the system targets him based on behavioral patterns and location, illustrating intersectional bias.
- **Flow**:
    1.  **Interaction**: Dialogue regarding the unfair fine.
    2.  **Clue**: "Michael's Fine Notice" (Evidence of context-blind enforcement).
    3.  **Investigation**: System analysis revealing the missing variable (infrastructure gap).
    4.  **Concept**: Unlock "Algorithmic Bias" in Encyclopedia.

### 3. UI/UX Refinements
- **PDA Notifications**:
    -   Changed background to solid dark (`bg-gray-900`) for readability.
    -   Increased Z-Index to separate from map layers.
    -   Auto-switch PDA tabs (Journal vs. Encyclopedia) based on content type.

## Implementation Details

### Data Architecture
New files created:
- `config/data/dialogue/michael.json`
- `config/data/journal/michael.json` (Clue)
- `config/data/encyclopedia/michael.json` (Concept)
- `config/data/investigate/michael.json` (System Analysis)

### Code Changes
- **GamePage.tsx**: Refactored `handleMapEvent` to support dynamic event IDs (`aunt_zhang`, `michael`) and their specific state transitions. Restored missing state definitions.
- **DialogueOverlay.tsx**: Added regex-based parser for styling tags and supports `whitespace-pre-wrap`.

## Results
The game now features two distinct, playable scenarios. The dialogue system is "content-ready," allowing designers to write rich scripts in JSON without touching the codebase. The UI is more legible and responsive to game state changes.
