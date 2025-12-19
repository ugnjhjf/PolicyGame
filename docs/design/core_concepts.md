# Core Design Document (v2.0)

## 1. Core Themes (The "Big Three")

### A. AI Bias (偏见)
- **Goal**: Show how AI models can systematically discriminate against certain groups.
- **Dimensions**:
    - **Racial Bias**: Training data reflecting historical prejudices.
    - **Wealth Bias**: Proxies for income (e.g., zipcode) leading to loan denials.
    - **Regional Bias**: Urban vs. Rural resource allocation.
- **Gameplay Implementation**:
    - Players encounter characters denied services due to "Unknown Reasons".
    - Investigation reveals the *correlation* between the AI's decision and the protected attribute.

### B. AI Privacy (隐私)
- **Goal**: Explore the tension between Data Utility and Individual Privacy.
- **Current State**: Needs development.
- **Potential Angles**:
    - **Data Collection**: Who owns the data? (Medical records, surveillance footage).
    - **Inference**: AI predicting sensitive info from public data (e.g., predicting pregnancy from shopping habits).
    - **Trade-off**: "Give us your data for better services" vs. "Keep your privacy but get generic service."
- **Professor's Note**: Needs specific scenarios.

### C. Transparency & Fairness (透明度与公平性)
- **Goal**: Demystify the "Black Box".
- **Key Concepts**:
    - **Accuracy vs. Fairness**: High accuracy models might still be biased.
    - **False Positives vs. False Negatives**: 
        - Example: Is it worse to jail an innocent person (False Positive) or let a criminal go free (False Negative)?
    - **Thresholds**: Adjusting the "confidence bar" for a decision. High threshold = fewer decisions but higher certainty.
    - **Model Selection**: Choosing between different algorithms with different trade-offs.

## 2. Gameplay Flow

### A. Exploration (Map)
- **Visuals**: Map with interactive points ("!" icons).
- **Action**: Talk to NPCs to gather "Anecdotal Evidence" (e.g., "My loan was rejected even though I have high income").

### B. Investigation & PDA System
- **PDA - Clues**: Stores collected anecdotal evidence.
- **PDA - Encyclopedia**: Unlocks definitions as you discover them.
    - Example: Unlocking "Data Discrimination" entry after finding 3 related clues.
    - Content: Concise, educational explanations (3-4 sentences).

### C. The Consultant (Decision Making)
- **Role**: The player acts as an investigator reporting to an expert Consultant.
- **Interaction**:
    - Present gathered clues.
    - Consultant asks specific questions or offers choices (e.g., "Should we audit the training data or adjust the decision threshold?").
- **Outcome**: The choice leads to a "Regional Solution" affecting the game world (e.g., changing policy).

## 3. Educational Mechanics (Professor's Suggestions)
- **Interactive Thresholds**: Let players slide a bar to see how it changes who gets approved/rejected.
- **Model Choice**: Pick "Model A (High Accuracy, Low Fairness)" vs. "Model B (Lower Accuracy, High Fairness)".
