# 006 - Investigation Report Visualization & Externalization

## Context
As the narrative deepened around algorithmic bias, purely text-based investigation reports felt insufficient to convey the statistical nature of the bias. The user needed to *see* the disparity between actual crime rates and the AI's predicted flags. Additionally, hardcoding report data in the component was becoming unmanageable.

## Decisions

### 1. Data Externalization
- **Change**: Moved specific report content from `GamePage.tsx` to `config/data/report/*.json`.
- **Reasoning**: Decouples content from logic, allowing designers to tweak narrative text and statistics without touching code. It follows the pattern set by `dialogue`, `journal`, and `encyclopedia`.

### 2. Comparative Data Visualization
- **Feature**: Added a bar chart to Michael's report comparing "Actual Crime Rate" vs "Predicted Flag Rate" across Black, Yellow, and White comparisons.
- **Design**:
    -   **Actual**: Solid bars (Objective truth).
    -   **Predicted**: Striped/Hatched bars (Artificial/Questionable construct).
    -   **Visual Language**: Red stripes indicate danger/warning/error in the algorithm's judgment.

### 3. Horizontal UI Layout
- **Problem**: The vertical "mobile-style" modal was too narrow to display data charts effectively alongside text.
- **Solution**: Refactored `InvestigationReportOverlay` to a widescreen (Horizontal) layout.
    -   **Left Panel**: Narrative (Metadata, Findings, System Suggestion).
    -   **Right Panel**: Data Visualization (Charts).
    -   This layout mimics professional dashboard interfaces, reinforcing the "System Admin" fantasy.

## Implementation Details

### JSON Structure
Added a `chart` object to the report interface:
```json
"chart": {
  "title": "Racial Bias Analysis",
  "labels": ["Black", "Yellow", "White"],
  "datasets": [ ... ]
}
```

### Component Logic
- `InvestigationReportOverlay` now dynamically checks for the comparison of `chart` data.
- If present, it switches to a 2-column grid.
- Used CSS `flex-1` and responsive sizing to ensuring charts scale correctly within the modal.

## Results
The report now clearly demonstrates the "Algorithmic Bias" concept: players can visually verify that while actual crime rates might be strictly lower or comparable, the AI's prediction for Black subjects is disproportionately inflated.
