
# The CEO's Odyssey

**A Strategic Management Simulation**

> *Developed for the Aalto University MBA Strategic Management Module — November 2025.*

## Overview

**The CEO's Odyssey** is a retro-style platformer game that gamifies the complex decision-making processes faced by modern executives. Built as an experiential learning tool for the Strategic Management module, players assume the role of a newly appointed CEO (Pedro or Sandra) navigating the treacherous landscape of corporate leadership.

The game combines traditional platforming mechanics (jumping, moving, avoiding obstacles) with high-stakes strategic scenarios generated and adjudicated by **Google's Gemini AI**.

## Context & Learning Objectives

This application was developed by Sandra Calvo in response to the final assessment for the Strategic Management module, led by Professor Pedro Parada at **Aalto University Executive Education**.

**Key Strategic Concepts Explored:**
*   **The Three Horizons of Growth:** Balancing core business (H1) with future ventures (H3).
*   **Resource vs. Capability:** Understanding that physical assets are commodities, while routines are distinct capabilities.
*   **Portfolio Management:** Applying BCG/McKinsey matrices to divestitures and acquisitions.
*   **Organizational Fit:** The challenge of integrating distinct cultures during M&A.
*   **Strategic Trade-Offs:** The necessity of choosing between Cost Leadership and Differentiation (avoiding "Stuck in the Middle").

## Gameplay

1.  **Select your CEO:** Choose between Pedro or Sandra.
2.  **Navigate the Levels:**
    *   **Level 1 (Morning):** The Identity Crisis & Vision.
    *   **Level 2 (Afternoon):** Operational Efficiency & Market Structure.
    *   **Level 3 (Night):** Global Expansion & M&A.
    *   **Level 4 (The End Game):** Final Strategic Positioning.
3.  **Make Decisions:** Enter doors to face Board-level scenarios. Your choices affect your **Board Trust** score.
4.  **Survive:** Maintain Board Trust above 35% to avoid termination. Aim for >70% for a contract renewal.

## Why is the Gemini API Key Required?

The Gemini API key is used to power the **AI Game Master** logic within the application (`services/geminiService.ts`). Specifically, it serves two critical purposes in the game's architecture:

1.  **Dynamic Storytelling & Fallback:** The game is designed so that if a scenario option does not have a pre-written, hardcoded outcome, the application calls the Gemini API to generate a cynical, corporate-styled status update on the fly. This acts as a fallback system and allows for "infinite" procedural scenarios in future versions.
2.  **Atmosphere & Tone:** The prompts sent to Gemini are engineered to maintain the specific "retro video game" and "corporate satire" tone. This ensures that any AI-generated text seamlessly matches the game's unique voice (e.g., "The Board is concerned by your indecisiveness").

*Note: In this specific MBA module version, standard outcomes are hardcoded to ensure specific strategic lessons are conveyed accurately, but the AI infrastructure remains active to handle exceptions and dynamic content.*

## Technical Stack

*   **Frontend:** React 19 (Vite), TypeScript
*   **Styling:** Tailwind CSS
*   **AI Integration:** Google Gemini API (via `@google/genai`)
*   **Assets:** Procedural SVG generation (No external image assets required)

## Setup & Installation

### Prerequisites
*   Node.js (v18+)
*   A valid Google Gemini API Key

### Local Development

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set your API key (ensure `process.env.API_KEY` is available via your `.env` or bundler config).
4.  Run the development server:
    ```bash
    npm run dev
    ```

### Docker Deployment

To build and run the game containerized:

1.  **Build the image:**
    ```bash
    docker build --build-arg API_KEY=your_actual_api_key_here -t ceo-odyssey .
    ```

2.  **Run the container:**
    ```bash
    docker run -p 8080:80 ceo-odyssey
    ```

3.  Access the game at `http://localhost:8080`.

---
*© 2025 Sandra Calvo | Aalto University MBA*
