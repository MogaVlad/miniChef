import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ingredients = searchParams.get('ingredients');
    const selectedCategory = searchParams.get('selectedCategory');

    const prompt = `You are a professional culinary AI. The user wants recipes using these ingredients: ${ingredients}, in the category: ${selectedCategory}.

Before generating recipes, validate the request:
- If any ingredient is not a real food item (e.g., random words, objects, nonsense), return: {"error": "Some of your inputs are not valid food ingredients. Please enter real ingredients."}
- If the ingredients contradict the category (e.g., meat for vegetarian, savory items for desserts), return: {"error": "The ingredients you entered don't match the selected category."}
- If the ingredients are too vague, return: {"error": "Please provide more specific ingredients."}
- A single valid ingredient is enough. You can use any combination of the provided ingredients; you don't need to use all of them in every recipe.

If the request is valid, output a JSON array of at least 3 recipe objects. Each object MUST strictly follow this schema:
- "title": A short, catchy name for the recipe.
- "text": A brief 1-sentence description of the dish.
- "prepTime": Total estimated time (e.g., "45 minutes", "1 hour 30 minutes").
- "ingredients": An array of strings. Each string MUST include realistic, professional-standard metric quantities (e.g., "500g all-purpose flour", "2 tbsp extra virgin olive oil", "4 large eggs").
- "prepDetails": A single string containing the numbered preparation steps, separated by the newline character (\n). 

CRITICAL RULES FOR "prepDetails":
1. Number each step clearly (e.g., "1. ", "2. ").
2. Include the estimated time for each individual step in parentheses at the very end of the sentence (e.g., "(15 min)."). The sum of these times must equal the \`prepTime\`.
3. DO NOT repeat the exact quantity of an ingredient in the steps IF it is being used all at once (e.g., just say "fold in the sifted flour" or "stir in the cream"). 
4. ONLY specify the quantity in the steps IF an ingredient is being split across multiple steps (e.g., Step 1: "rub with 2 tbsp olive oil", Step 5: "drizzle with the remaining 2 tbsp olive oil").

Example output format:
[
  {
    "title": "Creamy tomato soup",
    "text": "Creamy tomato soup",
    "prepTime": "45 minutes",
    "ingredients": [
      "1.2kg ripe vine tomatoes", 
      "200ml heavy cream", 
      "1/2 cup fresh basil leaves", 
      "1 large yellow onion", 
      "4 cloves garlic", 
      "2 tbsp extra virgin olive oil"
    ],
    "prepDetails": "1. Finely chop the onion and mince the garlic cloves (10 min).\n2. Heat the olive oil in a pot and sauté the onion and garlic until translucent (5 min).\n3. Roughly chop the tomatoes, add to the pot, and bring to a gentle simmer (20 min).\n4. Transfer the mixture to a high-speed blender and purée until completely smooth (5 min).\n5. Return to low heat, stir in the cream, and garnish with the torn basil leaves and cracked pepper (5 min)."
  }
]

Return ONLY raw JSON, no markdown formatting (do not wrap in \`\`\`json), and no extra text.`;

    const model = genAI.getGenerativeModel({ model: "gemma-4-26b-a4b-it" });
    const result = await model.generateContent(prompt);
    let response = result.response.text()?.trim() || '[]';

    response = response.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');

    JSON.parse(response);

    return NextResponse.json({ text: response });
  } catch (error: any) {
    console.error('API error:', error.message || error);
    return NextResponse.json({ text: JSON.stringify([{ name: 'Error', duration: 'N/A', ingredients: ['N/A'], preparation: error.message || 'Unknown error' }]) });
  }
}
