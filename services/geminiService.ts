
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function getDecisionOutcome(scenario: string, decision: string): Promise<string> {
    try {
        const prompt = `
        You are a business simulation AI for a retro video game.
        The CEO of a company is facing a scenario and has made a decision.
        The game has a slightly humorous, cynical, and corporate tone.

        **SCENARIO:**
        ${scenario}

        **CEO's DECISION:**
        ${decision}

        **TASK:**
        Describe the outcome of this decision. The outcome should be a short, impactful statement of one or two sentences. Make it sound like a retro game status update.
        Example outcomes:
        - "The layoffs saved money, but morale is at an all-time low. Your Glassdoor rating is 1.2 stars."
        - "The new product is a hit! You're hailed as a visionary, but the R&D department is completely burned out."
        - "Ignoring the flaw was a disaster. A class-action lawsuit has been filed."

        Now, provide the outcome for the given scenario and decision.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text.trim();
    } catch (error) {
        console.error('Gemini API call failed:', error);
        return "The board is... concerned by your indecisiveness. The market waits for no one. Please try again.";
    }
}
