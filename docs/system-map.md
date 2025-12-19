# System Architecture Map

## Overview
This document tracks the current architecture of the **PolicyGame (RPG Mode)**.

```mermaid
graph TD
    %% Core State Management
    subgraph Data Layer
        RPGContext[RPGContext Provider]
        RPGState[RPGState Types]
        LocalStorage[(localStorage)]
        
        RPGContext -->|Persists| LocalStorage
        RPGContext -->|Uses| RPGState
    end

    %% UI Components
    subgraph Components
        GamePage[Page: /game]
        
        subgraph Overlays
            DialogueUI[DialogueOverlay VN Style]
            PDAUI[PDAOverlay Journal/Encyclopedia]
            MapLayer[MapInteractiveLayer]
        end
        
        StatusBar[GameStatusBar Legacy UI]
    end

    %% Component Relationships
    GamePage --> RPGContext
    GamePage --> MapLayer
    GamePage --> DialogueUI
    GamePage --> PDAUI
    GamePage --> StatusBar

    %% Interaction Flow
    MapLayer -->|On Event Click| GamePage
    GamePage -->|Open| DialogueUI
    GamePage -->|Open| PDAUI

    %% Data Flow
    DialogueUI -->|Unlocks Concept| RPGContext
    MapLayer -->|Triggers Event| RPGContext
    PDAUI -->|Reads| RPGContext
```

## Module Descriptions

### Data Layer
- **RPGContext**: Central store using React Context. Handles `inventory`, `journal`, `encyclopedia`, and `flags`.
- **RPGState**: TypeScript definitions for the game data models.

### UI Layers
- **MapInteractiveLayer**: An absolute positioned layer over the background map image. Renders clickable `(!)` icons based on `activeEvents`.
- **DialogueOverlay**: Visual Novel style dialogue system. Supports Left/Right/Center character portraits and multiple choice responses.
- **PDAOverlay**: The player's menu. Contains:
    - **Journal**: Clues collected during gameplay.
    - **Encyclopedia**: Educational concepts unlocked via dialogue.
