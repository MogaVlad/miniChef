import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  text: string;
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
){
  try {
    const { ingredients, selectedCategory } = req.query;
    const prompt = `You are a recipe assistant. The user wants recipes using these ingredients: ${ingredients}, in the category: ${selectedCategory}.

Before generating recipes, validate the request:
- If any ingredient is not a real food item (e.g. random words, objects, nonsense), return: {"error": "Some of your inputs are not valid food ingredients. Please enter real ingredients."}
- If the ingredients contradict the category (e.g. meat/fish/poultry for vegetarian, savory items like chicken for desserts, non-breakfast items like steak for breakfast), return: {"error": "The ingredients you entered don't match the selected category. For example, meat is not suitable for vegetarian recipes."}
- If the ingredients are too vague to make a recipe (e.g. only generic words like "food" or "stuff"), return: {"error": "Please provide more specific ingredients."}
- Even a single valid ingredient is enough to generate recipes. Do not reject requests just because few ingredients are provided.
- If not all ingredients are needed for a recipe, that's fine. You can generate recipes using any combination of the provided ingredients. You don't have to use all of them in every recipe, just the majority of them.

If the request is valid, return a valid JSON array of recipe objects (minimum 3), each with fields: name, duration, ingredients (array of strings), preparation (string).
The duration must be realistic for a home cook — consider all steps including marinating, cooking, resting, etc. For example, skewers with chutney cannot be done in 45 minutes. Be honest about total time. Input it as a string with appropriate units (e.g. "45 minutes", "1 hour 30 minutes").
The preparation field must be a numbered step-by-step guide separated by newline characters (\\n). Example: "1. Preheat oven to 180°C (5 min).\\n2. Dice the vegetables (10 min).\\n3. Cook in oven (25 min)."
Each step must include a realistic time estimate in parentheses. The sum of all step times must equal the total duration. Do not write long paragraphs.

Return ONLY raw JSON, no markdown, no code blocks, no extra text.`;

    const model = genAI.getGenerativeModel({ model: "gemma-4-26b-a4b-it" });
    const result = await model.generateContent(prompt);
    let response = result.response.text()?.trim() || '[]';

    response = response.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');

    JSON.parse(response);

    res.status(200).json({ text: response });
  } catch (error: any) {
    console.error('API error:', error.message || error);
    res.status(200).json({ text: JSON.stringify([{ name: 'Error', duration: 'N/A', ingredients: ['N/A'], preparation: error.message || 'Unknown error' }]) });
  }
}
